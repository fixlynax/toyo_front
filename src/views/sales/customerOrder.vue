<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';

// 🟢 State
const filters1 = ref({});
const listData = ref([]);
const loading = ref(true);
const dateRange = ref([null, null]); // [startDate, endDate]
const hasDateFilterApplied = ref(false); // New flag to track if date filter is applied
const dealers = ref([]); // List of dealers (main accounts only)
const selectedDealer = ref(null); // Selected dealer
const isDealerSelected = ref(false); // Flag to track if dealer is selected

// 🟢 Filters
function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Status Map
const statusMap = {
    66: { label: 'Processing', severity: 'warning' },
    77: { label: 'Delivery', severity: 'info' },
    1: { label: 'Completed', severity: 'success' }
};

// 🟢 Tabs with initial load control
const statusTabs = [
    { label: 'Processing', status: 66, requiresDateRange: false, initialLoad: true },
    { label: 'Delivery', status: 77, requiresDateRange: false, initialLoad: true },
    { label: 'Completed', status: 1, requiresDateRange: true, initialLoad: false }
];
const activeTabIndex = ref(0);

// 🟢 Computed properties
const currentTab = computed(() => statusTabs[activeTabIndex.value]);
const currentTabLabel = computed(() => currentTab.value?.label || '');

// 🟢 Fetch Dealers (Main accounts only)
const fetchDealers = async () => {
    try {
        const response = await api.post('list_dealer', {
            mainBranch: 0 // Get all dealers including sub-branches
        });

        if (response.data.status === 1 && response.data.admin_data) {
            const dealerData = response.data.admin_data;
            const mainDealerList = [];

            // Process dealer data - only include main dealers (accounts ending with "00")
            Object.entries(dealerData).forEach(([custAccountNo, data]) => {
                const mainShop = data.shop;

                // Only add main dealers (ending with "00")
                if (mainShop.custAccountNo && mainShop.custAccountNo.toString().endsWith('00')) {
                    mainDealerList.push({
                        custAccountNo: mainShop.custAccountNo,
                        companyName: trimCompanyName(mainShop.companyName1, mainShop.companyName2),
                        isMain: true,
                        hasSubBranches: Object.keys(data.subBranches || {}).length > 0
                    });
                }
            });

            // Sort alphabetically by company name
            dealers.value = mainDealerList.sort((a, b) => a.companyName.localeCompare(b.companyName));
        } else {
            dealers.value = [];
        }
    } catch (error) {
        console.error('Error fetching dealers:', error);
        dealers.value = [];
    }
};

// Helper function to trim company name
const trimCompanyName = (name1, name2) => {
    const fullName = `${name1 || ''} ${name2 || ''}`.trim();
    return fullName || 'Unknown';
};

// 🟢 Fetch Orders
const fetchOrders = async (status = null, dateFilter = false, mainAccountNo = null) => {
    try {
        loading.value = true;
        const statusMapping = { 66: 'PROCESSING', 77: 'DELIVERY', 1: 'COMPLETE' };
        const tabs = statusMapping[status] || 'PROCESSING';

        // Prepare request data
        const requestData = { tabs };

        // Add date range if applied
        if (dateFilter && dateRange.value[0] && dateRange.value[1]) {
            // Format dates for backend (assuming backend expects d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            requestData.date_range = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
        }

        // Add dealer filter if selected
        if (mainAccountNo) {
            requestData.custaccountno = mainAccountNo;
            requestData.mainBranch = 1; // Tell backend this is a main branch selection
        }

        const response = await api.post('order/list-order', requestData);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((order) => ({
                id: order.id,
                orderNo: order.order_no,
                custAccountNo: order.custaccountno,
                companyName: order.dealerName,
                sapOrderType: order.sapordertype,
                orderType: order.orderDesc,
                deliveryType: order.deliveryType,
                shipToAccountNo: order.shiptoCustAccNo,
                deliveryDate: order.deliveryDate,
                soNo: order.so_no,
                doNo: order.do_no,
                invoiceNo: order.inv_no,
                created: order.created,
                orderStatus: order.orderstatus,
                subtotal: order.subtotal,
                total: order.total,
                orderArray: order.order_array,
                // Delivery information
                scmDeliverInfo: order.scm_deliver_information,
                scmPickupInfo: order.scm_pickup_information
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching order list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
};

// 🟢 Handle dealer selection (only main accounts in dropdown)
const handleDealerChange = () => {
    const selectedTab = currentTab.value;

    if (selectedDealer.value) {
        isDealerSelected.value = true;

        // Reset date range when changing dealer
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;

        // Pass the main account number to fetchOrders
        // The API should handle filtering for main account + sub-accounts
        fetchOrders(selectedTab.status, false, selectedDealer.value);
    } else {
        isDealerSelected.value = false;
        listData.value = [];
        loading.value = false;
    }
};

// 🟢 Watch tab change
watch(activeTabIndex, (newIndex) => {
    const selectedTab = statusTabs[newIndex];

    if (selectedDealer.value && isDealerSelected.value) {
        // Reset date range when changing tabs
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;

        // Clear data when switching to Completed tab
        if (selectedTab?.requiresDateRange && !selectedTab?.initialLoad) {
            listData.value = [];
            loading.value = false;
        } else {
            fetchOrders(selectedTab?.status, false, selectedDealer.value);
        }
    }
});

// 🟢 Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch when both dates are set AND dealer is selected
        if (newRange[0] && newRange[1] && isDealerSelected.value && selectedDealer.value) {
            hasDateFilterApplied.value = true;
            fetchOrders(selectedTab.status, true, selectedDealer.value);
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            // Handle clearing date range
            hasDateFilterApplied.value = false;

            // For tabs with initial load, reload dealer data
            if (selectedTab?.initialLoad && isDealerSelected.value && selectedDealer.value) {
                fetchOrders(selectedTab.status, false, selectedDealer.value);
            } else {
                // For Completed tab, clear data
                listData.value = [];
            }
        }
    },
    { deep: true }
);

// 🟢 Watch dealer selection
watch(selectedDealer, () => {
    handleDealerChange();
});

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters1();
    await fetchDealers(); // Load dealers first

    // Don't fetch any orders initially - wait for dealer selection
    loading.value = false;
    isDealerSelected.value = false;
    listData.value = [];
});

// 🟢 Computed - Filter orders by status and date range
const filteredOrders = computed(() => {
    // If no dealer is selected, return empty array
    if (!isDealerSelected.value || !selectedDealer.value) {
        return [];
    }

    const selectedTab = currentTab.value;

    // For Completed tab without date filter, return empty array
    if (selectedTab?.requiresDateRange && !selectedTab?.initialLoad && !hasDateFilterApplied.value) {
        return [];
    }

    let filtered = listData.value.filter((order) => order.orderStatus === selectedTab?.status);

    // Apply date range filter when date filter is applied
    if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
        filtered = filtered.filter((order) => {
            if (!order.created) return false;

            const orderDate = new Date(order.created);
            orderDate.setHours(0, 0, 0, 0); // Normalize time to start of day

            const startDate = dateRange.value[0] ? new Date(dateRange.value[0]) : null;
            const endDate = dateRange.value[1] ? new Date(dateRange.value[1]) : null;

            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999); // End of day

            const isAfterStart = !startDate || orderDate >= startDate;
            const isBeforeEnd = !endDate || orderDate <= endDate;

            return isAfterStart && isBeforeEnd;
        });
    }

    return filtered;
});

// 🟢 Format Date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Reload data for tabs with initial load, clear for Completed tab
    if (currentTab.value?.initialLoad && isDealerSelected.value && selectedDealer.value) {
        fetchOrders(currentTab.value.status, false, selectedDealer.value);
    } else {
        listData.value = [];
    }
};

// 🟢 Clear Dealer Filter
const clearDealerFilter = () => {
    selectedDealer.value = null;
    isDealerSelected.value = false;
    listData.value = [];
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    loading.value = false;
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Order</div>

        <div>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

            <!-- Header with Search and Filters (Always shown) -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div class="flex flex-col gap-4 w-full">
                    <!-- Search Row -->
                    <div class="flex items-center gap-4 w-full">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon><i class="pi pi-search" /></InputIcon>
                                <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" :disabled="!isDealerSelected" />
                            </IconField>
                        </div>
                    </div>

                    <!-- Filter Row: Customer and Date Range in one line -->
                    <div class="flex items-center gap-6 flex-wrap">
                        <!-- Customer Dropdown (Main accounts only) -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Customer:</span>
                            <div class="relative">
                                <Dropdown v-model="selectedDealer" :options="dealers" optionLabel="companyName" optionValue="custAccountNo" placeholder="Select Customer" class="w-100" :filter="true" :disabled="loading">
                                    <template #option="slotProps">
                                        <div class="flex items-center gap-2">
                                            <span class="text-blue-600 font-bold">🏢</span>
                                            <span>{{ slotProps.option.companyName }}</span>
                                            <span class="text-xs text-gray-400 ml-auto">{{ slotProps.option.custAccountNo }}</span>
                                        </div>
                                    </template>
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="flex items-center gap-2">
                                            <span class="text-blue-600 font-bold">🏢</span>
                                            <span>{{ dealers.find((d) => d.custAccountNo === slotProps.value)?.companyName }}</span>
                                        </div>
                                        <span v-else>{{ slotProps.placeholder }}</span>
                                    </template>
                                </Dropdown>
                                <Button v-if="selectedDealer" icon="pi pi-times" class="p-button-text p-button-sm ml-2" @click="clearDealerFilter" title="Clear customer filter" />
                            </div>
                        </div>

                        <!-- Date Range Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading || !isDealerSelected" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading || !isDealerSelected" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" :disabled="!isDealerSelected" />
                        </div>

                        <!-- Show message only for Completed tab without date filter -->
                        <div v-if="isDealerSelected && currentTab?.requiresDateRange && !currentTab?.initialLoad && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                    </div>
                </div>
            </div>

            <LoadingPage v-if="loading" :message="'Loading Orders...'" :sub-message="'Fetching order list for selected customer'" />

            <!-- DataTable (Only shown when customer is selected) -->
            <DataTable
                v-if="!loading && isDealerSelected"
                :value="filteredOrders"
                :paginator="true"
                :rows="10"
                dataKey="id"
                :rowHover="true"
                :filters="filters1"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                filterDisplay="menu"
                :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipToAccountNo', 'created', 'orderType', 'deliveryType', 'invoiceNo', 'doNo', 'soNo']"
                class="rounded-table"
                removableSort
                sortField="created"
                :sortOrder="-1"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        <template v-if="!isDealerSelected || !selectedDealer">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-users text-3xl text-blue-400"></i>
                                <span class="text-lg">Please select a customer first</span>
                                <span class="text-sm text-gray-400">Choose a customer from the dropdown above to view their orders</span>
                            </div>
                        </template>
                        <template v-else-if="currentTab?.requiresDateRange && !currentTab?.initialLoad && !hasDateFilterApplied">
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
                        <template v-else> No orders found for the selected customer. </template>
                    </div>
                </template>

                <!-- Columns -->
                <Column field="created" header="Created Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">{{ formatDate(data.created) }}</template>
                </Column>

                <Column header="Order No" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailOrder/${data.orderNo}`" class="hover:underline font-bold text-primary-400">
                            {{ data.orderNo || '-' }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="companyName" header="Customer Name" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{ data.companyName || '-' }}</span
                        ><br />{{ data.custAccountNo || '-' }}
                    </template>
                </Column>

                <Column field="orderType" header="Order Type" style="min-width: 7rem" sortable>
                    <template #body="{ data }">
                        <span v-if="data.orderType === 'Normal'">NORMAL</span>
                        <span v-else-if="data.orderType === 'Directship'">DS</span>
                        <span v-else-if="data.orderType === 'Own'">OWN USE</span>
                        <span v-else-if="data.orderType === 'Warranty'">WARRANTY</span>
                        <span v-else-if="data.orderType === 'Back Order'">BACK ORDER</span>
                        <span v-else>{{ data.orderType || data.sapOrderType || '-' }}</span>
                    </template>
                </Column>

                <Column field="deliveryType" header="Delivery" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        <span v-if="data.deliveryType === 'DELIVER'">DELIVER</span>
                        <span v-else-if="data.deliveryType === 'PICKUP'">PICKUP</span>
                        <span v-else-if="data.deliveryType === 'SELFCOLLECT'">OWNCOLLECT</span>
                        <span v-else-if="data.deliveryType === 'LALAMOVE'">LALAMOVE</span>
                        <span v-else>{{ data.deliveryType || '-' }}</span>
                    </template>
                </Column>

                <Column field="shipToAccountNo" header="Ship To Acc No" style="min-width: 7rem" sortable>
                    <template #body="{ data }">{{ data.shipToAccountNo || data.custAccountNo || '-' }}</template>
                </Column>

                <!-- Modified Delivery Info Column - Vertical Layout -->
                <Column header="Delivery Info" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <!-- ETA -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">ETA:</span>
                                <span class="font-medium">{{ formatDate(data.deliveryDate) || '-' }}</span>
                            </div>

                            <!-- Planned -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Planned:</span>
                                <span class="font-medium">{{ data.scmDeliverInfo ? formatDate(data.scmDeliverInfo.scheduled_delivery_time) : '-' }}</span>
                            </div>

                            <!-- Delivered -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Delivered:</span>
                                <span class="font-medium">
                                    <template v-if="data.scmDeliverInfo?.delivered_datetime">
                                        {{ formatDate(data.scmDeliverInfo.delivered_datetime) }}
                                    </template>
                                    <template v-else-if="data.scmPickupInfo?.pickup_datetime">
                                        {{ formatDate(data.scmPickupInfo.pickup_datetime) }}
                                    </template>
                                    <template v-else>-</template>
                                </span>
                            </div>

                            <!-- Show message if no delivery info data -->
                            <div v-if="!data.deliveryDate && !data.scmDeliverInfo && !data.scmPickupInfo" class="text-center text-gray-400 py-1">-</div>
                        </div>
                    </template>
                </Column>

                <Column header="SAP Ref" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <!-- SO -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">SO:</span>
                                <span class="font-medium">{{ data.soNo || '-' }}</span>
                            </div>

                            <!-- DO -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">DO:</span>
                                <span class="font-medium">{{ data.doNo || '-' }}</span>
                            </div>

                            <!-- Invoice (only show if exists) -->
                            <div v-if="data.invoiceNo" class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Inv No:</span>
                                <span class="font-medium">{{ data.invoiceNo }}</span>
                            </div>

                            <!-- Show message if no SAP ref data -->
                            <div v-if="!data.soNo && !data.doNo && !data.invoiceNo" class="text-center text-gray-400 py-1">-</div>
                        </div>
                    </template>
                </Column>

                <Column header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="statusMap[data.orderStatus]?.label || 'Unknown'" :severity="statusMap[data.orderStatus]?.severity || 'danger'" />
                    </template>
                </Column>

                <Column header="Total" style="min-width: 8rem">
                    <template #body="{ data }">
                        <span v-if="data.total">RM {{ parseFloat(data.total).toFixed(2) }}</span>
                        <span v-else>-</span>
                    </template>
                </Column>
            </DataTable>

            <!-- Initial state when no customer is selected -->
            <div v-if="!loading && !isDealerSelected" class="text-center py-12 bg-gray-50 rounded-lg border">
                <div class="flex flex-col items-center gap-4">
                    <i class="pi pi-users text-5xl text-blue-300"></i>
                    <h3 class="text-xl font-semibold text-gray-700">No Customer Selected</h3>
                    <p class="text-gray-500 max-w-md">Please select a customer from the dropdown above to view their order history. The table will display orders for the selected customer and all its branches.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-tabmenu .p-tabmenuitem.p-highlight .p-menuitem-link) {
    border-color: #3b82f6;
}
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
}
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

/* Custom styling for the delivery info and SAP ref tables */
:deep(.p-datatable-tbody) {
    .delivery-info-cell,
    .sap-ref-cell {
        padding: 0.25rem !important;

        .delivery-header,
        .sap-ref-header {
            background-color: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
        }

        .delivery-data,
        .sap-ref-data {
            font-size: 0.75rem;
            line-height: 1.25;
        }
    }
}

/* Custom styling for SAP Ref vertical layout */
:deep(.p-datatable-tbody > tr > td) {
    .sap-ref-vertical {
        padding: 0.25rem 0;
    }
}

/* Dealer dropdown styling */
:deep(.p-dropdown) {
    min-width: 200px;
}

:deep(.p-dropdown-item) {
    padding: 0.5rem 1rem;
}
</style>
