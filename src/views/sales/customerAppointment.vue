<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';
import Dropdown from 'primevue/dropdown';

const listData = ref([]);
const loading = ref(true);
const loadingCustomers = ref(false);
const isLoadingData = ref(false);
const exportLoading = ref(false);
const selectedCustomer = ref(null);
const customerOptions = ref([]);
const debounceTimer = ref(null);

// 🟢 Tab setup
const statusTabs = [
    { label: 'Pending', status: 0 },
    { label: 'Accepted', status: 1 },
    { label: 'Rejected', status: 2 }
];
const activeTabIndex = ref(0);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Computed properties
const hasCustomerSelected = computed(() => !!selectedCustomer.value);

// 🟢 Filter appointments based on active tab
const filteredAppointments = computed(() => {
    const currentTab = statusTabs[activeTabIndex.value]?.status;

    if (currentTab === undefined || currentTab === 'ALL') {
        return listData.value;
    }

    // Convert both to numbers for reliable comparison
    return listData.value.filter((appointment) => Number(appointment.status) === Number(currentTab));
});

// 🟢 Fetch Customers for Dropdown
const fetchCustomers = async () => {
    try {
        loadingCustomers.value = true;

        // Fetch customers from the list_dealer endpoint
        const response = await api.post('list_dealer');

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const customers = new Map();

            Object.keys(adminData).forEach((key) => {
                const customer = adminData[key];
                const shop = customer.shop;

                if (shop.companyName1 && shop.custAccountNo) {
                    customers.set(shop.custAccountNo, {
                        id: shop.id,
                        name: shop.companyName1,
                        accountNo: shop.custAccountNo,
                        city: shop.city,
                        state: shop.state
                    });
                }

                // Also add sub-branches if they have different names
                if (customer.subBranches) {
                    Object.keys(customer.subBranches).forEach((subKey) => {
                        const subBranch = customer.subBranches[subKey];
                        const subShop = subBranch.shop;

                        if (subShop.companyName1 && subShop.custAccountNo) {
                            customers.set(subShop.custAccountNo, {
                                id: subShop.id,
                                name: subShop.companyName1,
                                accountNo: subShop.custAccountNo,
                                city: subShop.city,
                                state: subShop.state
                            });
                        }
                    });
                }
            });

            // Convert Map to array and sort by name
            customerOptions.value = Array.from(customers.values()).sort((a, b) => a.name.localeCompare(b.name));
        }
    } catch (error) {
        console.error('Error fetching customer list for dropdown:', error);
    } finally {
        loadingCustomers.value = false;
    }
};

// Fetch appointment list
const fetchAppointments = async () => {
    try {
        isLoadingData.value = true;

        const params = {};

        // Add customer account number if selected
        if (selectedCustomer.value) {
            params.custaccountno = selectedCustomer.value.accountNo;
        }

        const response = await api.post('appointment', params);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.id,
                appointmentCode: item.appointmentCode,
                requestDate: item.appointmentRequestDate,
                requestSession: item.appointmentRequestSession,
                appointmentDate: item.appointmentDate,
                appointmentTime: item.appointmentTime,
                dealerShop: item.dealerShop,
                dealerCustAccountNo: item.dealerCustAccountNo,
                status: item.status,
                statusString: item.status_string,
                customerName: item.customerName,
                customerPhone: item.customerPhone,
                dealerCustAcc: item.dealerCustAccountNo,
                dealerShortName: item.dealerShop,
                bookDateTime: item.appointmentDate && item.appointmentTime ? `${item.appointmentDate} ${item.appointmentTime}` : 'Not Scheduled'
            }));
        } else {
            listData.value = [];
            console.warn('Unexpected API response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching appointment list:', error);
        listData.value = [];
    } finally {
        isLoadingData.value = false;
        loading.value = false;
    }
};

// 🟢 Watch for customer selection changes with debounce
watch(selectedCustomer, (newValue, oldValue) => {
    // Clear any existing timer
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
    }

    // If customer is cleared, clear data immediately
    if (!newValue) {
        listData.value = [];
        return;
    }

    // Load data after a short delay
    debounceTimer.value = setTimeout(() => {
        fetchAppointments();
    }, 300);
});

// 🟢 Watch tab changes
watch(activeTabIndex, (newValue, oldValue) => {
    // If customer is selected, data is already filtered by computed property
    // No need to refetch, just update the filtered view
    if (!selectedCustomer.value) {
        listData.value = [];
    }
});

// 🟢 Frontend-only Export Function
const exportToExcel = () => {
    try {
        exportLoading.value = true;

        // Get data to export (filtered appointments based on active tab)
        const dataToExport = filteredAppointments.value;

        if (dataToExport.length === 0) {
            alert('No data to export');
            exportLoading.value = false;
            return;
        }

        // Define headers
        const headers = ['Appointment Code', 'Dealer Shop', 'Dealer Account No', 'Customer Name', 'Customer Phone', 'Request Date', 'Request Session', 'Appointment Date', 'Appointment Time', 'Status'];

        // Prepare CSV content
        let csvContent = headers.join(',') + '\n';

        // Add rows
        dataToExport.forEach((appointment) => {
            const row = [
                `"${appointment.appointmentCode || ''}"`,
                `"${appointment.dealerShop || ''}"`,
                `"${appointment.dealerCustAccountNo || ''}"`,
                `"${appointment.customerName || ''}"`,
                `"${appointment.customerPhone || ''}"`,
                `"${appointment.requestDate || ''}"`,
                `"${appointment.requestSession || ''}"`,
                `"${appointment.appointmentDate || ''}"`,
                `"${appointment.appointmentTime || ''}"`,
                `"${appointment.statusString || ''}"`
            ];
            csvContent += row.join(',') + '\n';
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `appointments_${getCurrentDateTime()}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error occurred while exporting data');
    } finally {
        exportLoading.value = false;
    }
};

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
function formatDateFull(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// 🟢 Helper function to get current date time for filename
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
};

// 🟢 Clear customer filter
const clearCustomerFilter = () => {
    selectedCustomer.value = null;
    listData.value = [];
};

// 🟢 Initial data load
onBeforeMount(async () => {
    await fetchCustomers();
    loading.value = false;
});

// 🟢 Status color helper
const getStatusColor = (status) => {
    switch (status) {
        case 0:
            return 'text-yellow-600';
        case 1:
            return 'text-green-600';
        case 2:
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Appointment</div>

        <!-- Show loading only -->
        <LoadingPage v-if="loading" message="Loading Appointments..." />

        <!-- Show table only when not loading -->
        <template v-else>
            <!-- 🟣 Status Tabs -->
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />

            <DataTable
                :value="filteredAppointments"
                :paginator="true"
                :rows="10"
                dataKey="id"
                removableSort
                class="rounded-table"
                :rowHover="true"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['appointmentCode', 'dealerShop', 'dealerCustAccountNo', 'customerName', 'customerPhone', 'requestDate', 'requestSession', 'appointmentTime', 'appointmentDate', 'statusString']"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <template #header>
                    <div class="flex flex-col gap-4 w-full">
                        <!-- Top Row: Search and Export -->
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <!-- Left: Search Field -->
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>

                            <!-- Right: Export & Template -->
                            <div class="flex items-center gap-2 ml-auto">
                                <Button type="button" label="Export" icon="pi pi-download" class="p-button" :loading="exportLoading" @click="exportToExcel" :disabled="!hasCustomerSelected || filteredAppointments.length === 0" />
                            </div>
                        </div>

                        <!-- Filter Row: Customer Name Filter -->
                        <div class="flex items-center gap-4 mb-1 flex-wrap">
                            <!-- Customer Name Filter -->
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Customer Name:</span>
                                <Dropdown
                                    v-model="selectedCustomer"
                                    :options="customerOptions"
                                    optionLabel="name"
                                    placeholder="Select Customer Name"
                                    class="w-64"
                                    :loading="loadingCustomers"
                                    :disabled="loadingCustomers || loading"
                                    showClear
                                    :filter="true"
                                    filterPlaceholder="Search customers..."
                                >
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="flex items-center">
                                            <span>{{ slotProps.value.name }}</span>
                                            <span v-if="isLoadingData" class="ml-2">
                                                <i class="pi pi-spin pi-spinner text-sm text-primary-500"></i>
                                            </span>
                                        </div>
                                        <span v-else>
                                            {{ slotProps.placeholder }}
                                        </span>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex flex-col">
                                            <span class="font-medium">{{ slotProps.option.name }}</span>
                                            <span class="text-xs text-gray-500">{{ slotProps.option.accountNo }}</span>
                                        </div>
                                    </template>
                                </Dropdown>
                                <Button v-if="selectedCustomer" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearCustomerFilter" title="Clear customer filter" :disabled="isLoadingData" />
                            </div>

                            <!-- Status message -->
                            <div v-if="!hasCustomerSelected" class="text-sm text-blue-600 italic">Select a customer to view</div>
                            <div v-else-if="isLoadingData" class="text-sm text-blue-600 italic">Loading appointments...</div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">
                        <template v-if="!hasCustomerSelected">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-building text-3xl text-blue-400"></i>
                                <span class="text-lg">Select a customer to view</span>
                                <span class="text-sm text-gray-400">Choose a customer name from the dropdown above</span>
                            </div>
                        </template>
                        <template v-else-if="isLoadingData">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                                <span class="text-lg">Loading appointments for {{ selectedCustomer?.name }}</span>
                                <span class="text-sm text-gray-400">Please wait...</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-file-excel text-3xl text-yellow-400"></i>
                                <span class="text-lg" v-if="selectedCustomer">No appointments found for {{ selectedCustomer.name }}</span>
                                <span class="text-lg" v-else>No appointments found</span>
                                <span class="text-sm text-gray-400">Try selecting a different customer</span>
                                <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearCustomerFilter" />
                            </div>
                        </template>
                    </div>
                </template>

                <!-- Columns -->
                <Column field="appointmentCode" header="Appointment Code" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/sales/detailCustomerAppointment/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.appointmentCode }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="dealerShop" header="Customer Info" style="min-width: 14rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.dealerShop }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.dealerCustAccountNo }}</div>
                        </div>
                    </template>
                </Column>

                <Column field="customerName" header="Consumer Info" style="min-width: 14rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.customerName }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.customerPhone }}</div>
                        </div>
                    </template>
                </Column>

                <Column field="requestDate" header="Request Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.requestDate) || 'Not Request' }}
                    </template>
                </Column>

                <Column field="requestSession" header="Request Session" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.requestSession || 'Not Request' }}
                    </template>
                </Column>

                <Column field="appointmentDate" header="Scheduled Date/Time" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ formatDateFull(data?.appointmentDate && data?.appointmentTime ? `${data.appointmentDate} ${data.appointmentTime}` : null) || 'Not Scheduled' }}
                    </template>
                </Column>

                <Column field="statusString" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <span :class="getStatusColor(data.status)">
                            {{ data.statusString }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </template>
    </div>
</template>

<style scoped>
:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
    border-color: #3b82f6;
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

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

/* Style for dropdown customer options */
:deep(.p-dropdown) {
    min-width: 250px;

    .p-dropdown-label {
        padding: 0.5rem;
    }
}

:deep(.p-dropdown-panel) {
    .p-dropdown-items {
        .p-dropdown-item {
            padding: 0.75rem 1rem;

            &.p-highlight {
                background-color: var(--p-primary-100);
                color: var(--p-primary-700);
            }
        }
    }
}

/* Loading spinner in dropdown value */
:deep(.p-dropdown .p-dropdown-label .pi-spinner) {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
