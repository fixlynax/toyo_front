<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const listData = ref([]);
const filteredList = ref([]);
const loading = ref(true);
const activeTabIndex = ref(0);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);
const selectedBackOrders = ref([]);
const bulkCancelLoading = ref(false);
const showCancelDialog = ref(false); // New: Dialog visibility

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 🟢 Helper function to get default date range for Completed tab (last 7 days)
const getDefaultDateRangeForCompleted = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    
    return {
        start: startDate,
        end: endDate
    };
};

const statusTabs = [
    { label: 'Pending', status: 0, type: 'PENDING', requiresDateRange: false, initialLoad: true },
    { label: 'Completed', status: 1, type: 'COMPLETED', requiresDateRange: true, initialLoad: true },
    { label: 'Cancelled', status: 9, type: 'CANCELLED', requiresDateRange: true, initialLoad: false },
    { label: 'Expired', status: '', type: 'EXPIRED', requiresDateRange: true, initialLoad: false }
];

// Computed properties
const currentTab = computed(() => statusTabs[activeTabIndex.value]);
const currentTabLabel = computed(() => currentTab.value?.label || '');
const showDateRangeFilter = computed(() => currentTab.value?.requiresDateRange || false);
const isCompletedTab = computed(() => currentTab.value?.type === 'COMPLETED');
const isCancelledTab = computed(() => currentTab.value?.type === 'CANCELLED');
const isExpiredTab = computed(() => currentTab.value?.type === 'EXPIRED');
const isPendingTab = computed(() => currentTab.value?.type === 'PENDING');
const showSelection = computed(() => isPendingTab.value); // New: Show selection column only for Pending tab

// New: Show confirmation dialog
const confirmBulkCancel = () => {
    if (selectedBackOrders.value.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'No Selection',
            detail: 'Please select at least one back order to cancel.',
            life: 3000
        });
        return;
    }
    showCancelDialog.value = true;
};

// New: Handle bulk cancel from dialog
const handleBulkCancel = async () => {
    try {
        bulkCancelLoading.value = true;
        
        // Prepare data in the required format: [{"id":331},{"id":332}]
        const backorderData = selectedBackOrders.value.map(order => ({ id: order.id }));
        
        const response = await api.post('order/cancel-backorder', {
            backorder_id: JSON.stringify(backorderData)
        });

        if (response.data.status === 1) {
            // Show success toast
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Successfully cancelled ${selectedBackOrders.value.length} back order(s)`,
                life: 5000
            });
            
            // Close dialog
            showCancelDialog.value = false;
            
            // Clear selection
            selectedBackOrders.value = [];
            
            // Refresh the data
            await fetchBackOrders();
        } else {
            throw new Error('Failed to cancel back orders');
        }
    } catch (error) {
        console.error('Error cancelling back orders:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to cancel back orders. Please try again.',
            life: 5000
        });
    } finally {
        bulkCancelLoading.value = false;
    }
};

// Clear selection
const clearSelection = () => {
    selectedBackOrders.value = [];
    toast.add({
        severity: 'info',
        summary: 'Selection Cleared',
        detail: 'All selected back orders have been cleared.',
        life: 3000
    });
};

const fetchBackOrders = async (useDefaultRange = false) => {
    try {
        const selectedTab = currentTab.value;
        if (!selectedTab) return;

        // Clear selection when fetching new data
        if (selectedBackOrders.value.length > 0) {
            selectedBackOrders.value = [];
        }

        // For Cancelled and Expired tabs (requires date range and initialLoad is false), don't fetch until date range is set
        if ((isCancelledTab.value || isExpiredTab.value) && !selectedTab.initialLoad && !hasDateFilterApplied.value) {
            listData.value = [];
            filteredList.value = [];
            loading.value = false;
            return;
        }

        const formData = new FormData();
        formData.append('type', selectedTab.type);

        // Add date range if applied or if it's Completed tab with default range
        if (hasDateFilterApplied.value || (isCompletedTab.value && useDefaultRange)) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            let startDate, endDate;
            
            if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
                // Use user-selected date range
                startDate = dateRange.value[0];
                endDate = dateRange.value[1];
            } else if (isCompletedTab.value && useDefaultRange) {
                // Use default 7-day range for Completed tab
                const defaultRange = getDefaultDateRangeForCompleted();
                startDate = defaultRange.start;
                endDate = defaultRange.end;
            }

            if (startDate && endDate) {
                const dateRangeString = `${formatDateForBackend(startDate)} - ${formatDateForBackend(endDate)}`;
                formData.append('date_range', dateRangeString);
            }
        }

        loading.value = true;
        const response = await api.post('order/list-back-order', formData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;

            listData.value = adminData.map((order) => ({
                id: order.id,
                orderNo: order.bo_orderno || '-',
                custAccountNo: order.custaccountno,
                customerName: order.dealerName,
                deliveryType: order.deliveryType || '-',
                orderDate: order.created,
                shipTo: order.shipto || order.custaccountno,
                expiry: order.expiry,
                created: order.created,
                orderStatus: order.orderstatus,
                progress: calculateProgress(order),
                status: order.status
            }));

            filterByTab();
        } else {
            listData.value = [];
            filteredList.value = [];
        }
    } catch (error) {
        listData.value = [];
        filteredList.value = [];
        console.error('Error fetching back orders:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch back orders. Please try again.',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    // Handle initial load based on tab
    if (isCompletedTab.value) {
        // For Completed tab, fetch last 7 days by default
        await fetchBackOrders(true);
    } else if (isCancelledTab.value || isExpiredTab.value) {
        // For Cancelled and Expired tabs, don't fetch until date range is set
        loading.value = false;
        return;
    } else {
        // For Pending tab, fetch all data
        await fetchBackOrders();
    }
});

// Watch tab changes
watch(activeTabIndex, (newIndex, oldIndex) => {
    const selectedTab = statusTabs[newIndex];

    // Reset date range when changing tabs
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    
    // Clear selection when changing tabs
    if (selectedBackOrders.value.length > 0) {
        selectedBackOrders.value = [];
    }

    // Handle data loading based on tab type
    if (isCompletedTab.value) {
        // For Completed tab, fetch last 7 days by default
        fetchBackOrders(true);
    } else if (isCancelledTab.value || isExpiredTab.value) {
        // For Cancelled and Expired tabs, clear data (requires date range)
        listData.value = [];
        filteredList.value = [];
        loading.value = false;
    } else {
        // For Pending tab, fetch all data
        fetchBackOrders();
    }
});

// Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch when both dates are set
        if (newRange[0] && newRange[1]) {
            hasDateFilterApplied.value = true;
            fetchBackOrders();
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            // Clear data if date range is cleared
            hasDateFilterApplied.value = false;

            // Reload data based on tab type
            if (isCompletedTab.value) {
                // For Completed tab, reload last 7 days
                fetchBackOrders(true);
            } else if (isCancelledTab.value || isExpiredTab.value) {
                // For Cancelled and Expired tabs, clear data
                listData.value = [];
                filteredList.value = [];
            } else {
                // For Pending tab, reload all data
                fetchBackOrders();
            }
        }
    },
    { deep: true }
);

const filterByTab = () => {
    const selected = currentTab.value;
    if (!selected) {
        filteredList.value = listData.value;
        return;
    }

    // Expired tab logic
    if (selected.type === 'EXPIRED') {
        const now = new Date();

        filteredList.value = listData.value.filter((item) => {
            if (!item.expiry) return false;

            const isExpired = new Date(item.expiry) < now;
            const notCompleted = item.orderStatus != 1;
            const notCancelled = item.orderStatus != 9;

            return isExpired && notCompleted && notCancelled;
        });

        return;
    }

    // Normal tabs
    filteredList.value = listData.value.filter((item) => item.orderStatus == selected.status);
};

const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Reload data based on current tab
    if (isCompletedTab.value) {
        // For Completed tab, reload last 7 days
        fetchBackOrders(true);
    } else if (isCancelledTab.value || isExpiredTab.value) {
        // For Cancelled and Expired tabs, clear data
        listData.value = [];
        filteredList.value = [];
    } else {
        // For Pending tab, reload all data
        fetchBackOrders();
    }
};

const calculateProgress = (order) => {
    try {
        if (order.fullfill_percentage !== null && order.fullfill_percentage !== undefined) {
            const progress = parseInt(order.fullfill_percentage);
            return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
        }

        if (order.backorder_array && order.remaining_array) {
            const backorderItems = Array.isArray(order.backorder_array) ? order.backorder_array : JSON.parse(order.backorder_array);
            const remainingItems = Array.isArray(order.remaining_array) ? order.remaining_array : JSON.parse(order.remaining_array);

            if (Array.isArray(backorderItems) && Array.isArray(remainingItems)) {
                const totalOrdered = backorderItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);
                const totalRemaining = remainingItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);

                if (totalOrdered > 0) {
                    const fulfilled = totalOrdered - totalRemaining;
                    const progress = Math.round((fulfilled / totalOrdered) * 100);
                    return Math.min(100, Math.max(0, progress));
                }
            }
        }

        return 0;
    } catch (error) {
        return 0;
    }
};

const getProgressBarClass = (progress) => {
    if (progress <= 40) return 'progress-low';
    if (progress <= 60) return 'progress-fair';
    if (progress < 100) return 'progress-good';
    return 'progress-excellent';
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    let formatted = date.toLocaleString('en-MY', options);
    
    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};

const getStatusLabel = (data) => {
    // Check if order is expired (today >= Back Order Expiry) and not completed/cancelled
    if (data.expiry) {
        const now = new Date();
        const expiryDate = new Date(data.expiry);
        if (expiryDate < now && data.orderStatus !== 1 && data.orderStatus !== 9) {
            return 'Expired';
        }
    }

    switch (data.orderStatus) {
        case 0:
            return 'Pending';
        case 1:
            return 'Completed';
        default:
            return 'Cancelled';
    }
};

const getStatusSeverity = (data) => {
    // Check if order is expired (today >= Back Order Expiry) and not completed/cancelled
    if (data.expiry) {
        const now = new Date();
        const expiryDate = new Date(data.expiry);
        if (expiryDate < now && data.orderStatus !== 1 && data.orderStatus !== 9) {
            return 'secondary';
        }
    }

    switch (data.orderStatus) {
        case 0:
            return 'info';
        case 1:
            return 'success';
        default:
            return 'danger';
    }
};
</script>

<template>
    <div class="card flex flex-col w-full">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">📦 List Back Order</div>
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

        <LoadingPage v-if="loading" :sub-message="'Fetching your Back Order list'" />

        <DataTable
            v-if="!loading"
            :value="filteredList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['custAccountNo', 'orderNo', 'customerName', 'deliveryDate', 'expiry', 'orderStatus']"
            responsiveLayout="scroll"
            removableSort
            sortField="created"
            :sortOrder="-1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            class="rounded-table"
            v-model:selection="selectedBackOrders"
            :selectionMode="showSelection ? 'multiple' : null"
        >
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Top Row: Search and Bulk Cancel Button (only for Pending tab) -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>
                        
                        <!-- Bulk Cancel Section (only shown for Pending tab) -->
                        <div v-if="isPendingTab" class="flex items-center gap-4 flex-wrap">
                            <!-- Selected count badge -->
                            <div v-if="selectedBackOrders.length > 0" class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">
                                    {{ selectedBackOrders.length }} back order(s) selected
                                </span>
                                <Button 
                                    icon="pi pi-times" 
                                    class="p-button-text p-button-sm text-gray-500 hover:text-red-500" 
                                    @click="clearSelection"
                                    title="Clear selection"
                                />
                            </div>
                            
                            <!-- Bulk Cancel Button -->
                            <Button 
                                label="Bulk Cancel" 
                                icon="pi pi-times" 
                                :disabled="selectedBackOrders.length === 0 || bulkCancelLoading"
                                :loading="bulkCancelLoading"
                                class="p-button-danger"
                                @click="confirmBulkCancel"
                                :title="selectedBackOrders.length === 0 ? 'Select back orders to cancel' : `Cancel ${selectedBackOrders.length} selected back order(s)`"
                            />
                        </div>
                    </div>

                    <!-- Date Range Filter (for all tabs) -->
                    <div class="flex items-center gap-4 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>
                        <!-- Conditional messages for different tabs -->
                        <div v-if="isCancelledTab && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                        <div v-if="isExpiredTab && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                        <div v-if="isCompletedTab && !hasDateFilterApplied" class="text-sm text-blue-600 italic">
                            Showing last 7 days of {{ currentTabLabel }} orders. Use date range to filter further.
                        </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-4 text-gray-500">
                    <template v-if="(isCancelledTab || isExpiredTab) && !hasDateFilterApplied">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-calendar text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a date range to view {{ currentTabLabel }} orders</span>
                            <span class="text-sm text-gray-400">Choose both start and end dates to filter results</span>
                        </div>
                    </template>
                    <template v-else-if="hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                            <span class="text-lg">Please select both start and end dates</span>
                        </div>
                    </template>
                    <template v-else-if="hasDateFilterApplied"> No {{ currentTabLabel }} orders found in the selected date range. </template>
                    <template v-else> No back orders found. </template>
                </div>
            </template>

            <!-- Selection Column (only for Pending tab) -->
            <Column v-if="showSelection" selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="createdDate" header="Created On" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ formatDateTime(data.created) }}
                </template>
            </Column>

            <Column field="orderNo" header="Order No." style="min-width: 15rem" sortable>
                <template #body="{ data }">
                    <RouterLink :to="`/om/detailBackOrder/${data.orderNo}`" class="hover:underline font-bold text-primary-400">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="companyName" header="Customer Name" style="min-width: 10rem" sortable>
                <template #body="{ data }"
                    ><span class="font-bold">{{ data.customerName || '-' }}</span
                    ><br />{{ data.custAccountNo || '-' }}</template
                >
            </Column>
            <Column field="deliveryType" header="Delivery" style="min-width: 8rem" sortable />

            <Column field="orderDate" header="Order Date" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.orderDate) }}
                </template>
            </Column>

            <Column field="shipTo" header="Ship To Acc No." style="min-width: 8rem" sortable />

            <Column field="expiry" header="Back Order Expiry" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.expiry) }}
                </template>
            </Column>

            <Column field="orderStatus" header="Status" style="min-width: 8rem; text-align: left">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data)" :severity="getStatusSeverity(data)" />
                </template>
            </Column>

            <Column field="progress" header="Progress" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <ProgressBar :value="data.progress" class="w-full" :showValue="false" :class="getProgressBarClass(data.progress)" />
                        <span class="text-sm font-semibold">{{ data.progress }}%</span>
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Confirmation Dialog -->
        <Dialog 
            v-model:visible="showCancelDialog" 
            modal 
            header="Confirm Bulk Cancel" 
            :style="{ width: '450px' }"
            :draggable="false"
        >
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-2xl text-yellow-500"></i>
                    <div>
                        <p class="font-semibold text-gray-800">Are you sure you want to cancel {{ selectedBackOrders.length }} selected back order(s)?</p>
                        <p class="text-sm text-gray-600 mt-1">This action cannot be undone. Cancellation emails will be sent to customers.</p>
                    </div>
                </div>
                
                <div v-if="selectedBackOrders.length > 0" class="mt-2 p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                    <p class="text-sm font-medium text-gray-700 mb-2">Selected Back Orders:</p>
                    <ul class="text-sm text-gray-600">
                        <li v-for="(order, index) in selectedBackOrders.slice(0, 5)" :key="order.id" class="py-1 border-b border-gray-200 last:border-0">
                            {{ index + 1 }}. {{ order.orderNo }} - {{ order.customerName }}
                        </li>
                        <li v-if="selectedBackOrders.length > 5" class="py-1 text-gray-500 italic">
                            ... and {{ selectedBackOrders.length - 5 }} more
                        </li>
                    </ul>
                </div>
            </div>
            
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        class="p-button-text" 
                        @click="showCancelDialog = false"
                        :disabled="bulkCancelLoading"
                    />
                    <Button 
                        label="Confirm Cancel" 
                        icon="pi pi-check" 
                        class="p-button-danger" 
                        @click="handleBulkCancel"
                        :loading="bulkCancelLoading"
                        :disabled="bulkCancelLoading"
                    />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-progressbar) {
    height: 0.8rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .p-progressbar-value {
        border-radius: 9999px;
        transition:
            width 0.4s ease,
            background 0.4s ease;
    }

    &.progress-low .p-progressbar-value {
        background: linear-gradient(90deg, #f87171);
        box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
    }

    &.progress-fair .p-progressbar-value {
        background: linear-gradient(90deg, #fb923c);
        box-shadow: 0 0 6px rgba(251, 146, 60, 0.3);
    }

    &.progress-good .p-progressbar-value {
        background: linear-gradient(90deg, #fde047);
        box-shadow: 0 0 6px rgba(250, 204, 21, 0.3);
    }

    &.progress-excellent .p-progressbar-value {
        background: linear-gradient(90deg, #34d399);
        box-shadow: 0 0 6px rgba(52, 211, 153, 0.4);
    }
}

:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th:first-child {
        border-top-left-radius: 12px;
    }

    .p-datatable-thead > tr > th:last-child {
        border-top-right-radius: 12px;
    }

    .p-datatable-tbody > tr:last-child > td:first-child {
        border-bottom-left-radius: 0;
    }

    .p-datatable-tbody > tr:last-child > td:last-child {
        border-bottom-right-radius: 0;
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

/* Selection column styling */
:deep(.p-datatable .p-checkbox .p-checkbox-box) {
    border-radius: 4px;
}

:deep(.p-datatable .p-checkbox.p-highlight .p-checkbox-box) {
    background-color: #ef4444;
    border-color: #ef4444;
}

:deep(.p-datatable .p-checkbox:not(.p-disabled).p-focus .p-checkbox-box) {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}
</style>