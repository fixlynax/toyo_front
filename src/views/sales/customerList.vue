<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">List Customer</div>

        <!-- Use your custom LoadingPage component for initial load -->
        <LoadingPage v-if="loading" :message="'Loading Customer List...'" :sub-message="'Fetching your Customer list'" />

        <!-- DataTable only shows when not loading -->
        <DataTable
            v-else
            :value="filteredData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 50, 100]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :sortField="'created'"
            :sortOrder="-1"
            :globalFilterFields="['memberCode', 'custAccountNo', 'companyName1', 'city', 'state', 'phoneNumber', 'signboardType', 'status']"
            class="rounded-table"
        >
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Top Row: Search and Buttons -->
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
                        <div class="flex gap-2">
                            <!-- <Button type="button" label="Bulk Update" @click="fetchData" /> -->
                            <!-- Right: Create Customer Button -->
                            <!-- <RouterLink to="/om/createEten">
                                <Button type="button" label="Create" icon="pi pi-plus" />
                            </RouterLink> -->
                        </div>
                    </div>

                    <!-- Filter Row: Customer Name Filter -->
                    <div class="flex items-center gap-4 mb-1 flex-wrap">
                        <!-- Customer Name Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Customer:</span>
                            <Dropdown
                                v-model="selectedCustomer"
                                :options="customerOptions"
                                optionLabel="name"
                                placeholder="Select Customer"
                                class="w-100"
                                :loading="loadingCustomers"
                                :disabled="loadingCustomers || loading"
                                @change="onCustomerChange"
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
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <template v-if="!selectedCustomer">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-building text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a customer to view</span>
                            <span class="text-sm text-gray-400">Choose a customer name from the dropdown above</span>
                        </div>
                    </template>
                    <template v-else-if="isLoadingData">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                            <span class="text-lg">Loading data for {{ selectedCustomer.name }}</span>
                            <span class="text-sm text-gray-400">Please wait...</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-file-excel text-3xl text-yellow-400"></i>
                            <span class="text-lg">No data found for {{ selectedCustomer.name }}</span>
                            <span class="text-sm text-gray-400">Try selecting a different customer</span>
                            <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearCustomerFilter" />
                        </div>
                    </template>
                </div>
            </template>

            <Column field="memberCode" header="Customer Code" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink :to="`/sales/detailCustomer/${data.custAccountNo}`" class="hover:underline font-bold text-primary-400">
                        {{ data.memberCode }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="created" header="CreatedTime" class="hidden" />

            <Column field="custAccountNo" header="Customer Account No" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                    <div class="flex flex-wrap gap-1 mt-1">
                        <!-- Main: if custAccountNo ends with 00 -->
                        <span v-if="String(data.custAccountNo).endsWith('00')" class="text-[10px] font-semibold text-white bg-blue-700 px-2 py-[2px] rounded shadow-sm"> Main </span>

                        <!-- Sub: otherwise -->
                        <span v-else class="text-[10px] font-semibold text-white bg-green-700 px-2 py-[2px] rounded shadow-sm"> Sub </span>
                    </div>
                </template></Column
            >

            <Column field="companyName1" header="Company Name" style="min-width: 8rem" />

            <Column field="location" header="Location" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.city }}{{ data.state }} </template>
            </Column>

            <Column field="phoneNumber" header="Phone No" style="min-width: 8rem" />

            <Column field="signboardType" header="Signboard" style="min-width: 8rem" />

            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.masterStatus === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.masterStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';

const toast = useToast();
const router = useRouter();
const listData = ref([]);
const loading = ref(true);
const loadingCustomers = ref(false);
const selectedCustomer = ref(null);
const customerOptions = ref([]);
const isLoadingData = ref(false);
const debounceTimer = ref(null);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Fetch customer names for dropdown on component mount
onMounted(async () => {
    try {
        loading.value = true;
        loadingCustomers.value = true;

        // First, fetch all customers for the dropdown
        const response = await api.post('list_dealer');

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;

            // Extract unique customers for dropdown
            const customers = new Map();

            Object.keys(adminData).forEach((key) => {
                const customer = adminData[key];
                const shop = customer.shop;

                if (shop.companyName1 && shop.custAccountNo) {
                    // Use custAccountNo as unique key to avoid duplicates
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
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load customer list',
            life: 3000
        });
    } finally {
        loading.value = false;
        loadingCustomers.value = false;
    }
});

// Watch for customer selection changes with debounce
watch(selectedCustomer, (newValue, oldValue) => {
    // Clear any existing timer
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
    }

    // If customer is cleared, immediately clear data
    if (!newValue) {
        listData.value = [];
        return;
    }

    // If customer is selected, load data after a short delay
    debounceTimer.value = setTimeout(() => {
        loadCustomerData();
    }, 300); // 300ms debounce to avoid rapid API calls
});

// Load data when customer is selected
const loadCustomerData = async () => {
    if (!selectedCustomer.value) {
        listData.value = [];
        return;
    }

    isLoadingData.value = true;
    listData.value = [];

    try {
        // Fetch data for specific customer
        const response = await api.post('list_dealer', {
            custaccountno: selectedCustomer.value.accountNo
        });

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const transformedData = [];

            Object.keys(adminData).forEach((key) => {
                const customer = adminData[key];
                const shop = customer.shop;

                // Find the master user (where isMaster = 1)
                const masterUser = customer.user_list?.find((user) => user.isMaster === 1);

                // Use master user status if available, otherwise fallback to shop status
                const masterStatus = masterUser ? masterUser.status : shop.status;

                // Add main branch
                transformedData.push({
                    id: shop.id,
                    memberCode: shop.memberCode || 'Untitled',
                    custAccountNo: shop.custAccountNo,
                    companyName1: shop.companyName1,
                    companyName2: shop.companyName2,
                    city: shop.city,
                    state: shop.state,
                    phoneNumber: shop.phoneNumber || '-',
                    signboardType: shop.signboardType || '-',
                    status: shop.status,
                    masterStatus: masterStatus,
                    user_list: customer.user_list,
                    created: shop.created
                });

                // Add sub-branches if they exist
                if (customer.subBranches) {
                    Object.keys(customer.subBranches).forEach((subKey) => {
                        const subBranch = customer.subBranches[subKey];
                        const subShop = subBranch.shop;

                        const subMasterUser = subBranch.user_list?.find((user) => user.isMaster === 1);
                        const subMasterStatus = subMasterUser ? subMasterUser.status : subShop.status;

                        transformedData.push({
                            id: subShop.id,
                            memberCode: subShop.memberCode || 'Untitled',
                            custAccountNo: subShop.custAccountNo,
                            companyName1: subShop.companyName1,
                            companyName2: subShop.companyName2,
                            city: subShop.city,
                            state: subShop.state,
                            phoneNumber: subShop.phoneNumber || '-',
                            signboardType: subShop.signboardType || '-',
                            status: subShop.status,
                            masterStatus: subMasterStatus,
                            user_list: subBranch.user_list,
                            created: subShop.created
                        });
                    });
                }
            });

            listData.value = transformedData;

            toast.add({
                severity: 'success',
                summary: 'Data Loaded',
                detail: `Loaded data for ${selectedCustomer.value.name}`,
                life: 2000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'No Data',
                detail: 'No data found for selected customer',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load customer data',
            life: 3000
        });
    } finally {
        isLoadingData.value = false;
    }
};

// Handle customer change (for manual trigger if needed)
const onCustomerChange = () => {
    // Data loading is now handled by the watch function
    // This function is kept for any additional logic if needed
};

// Clear customer filter
const clearCustomerFilter = () => {
    selectedCustomer.value = null;
    listData.value = [];

    toast.add({
        severity: 'info',
        summary: 'Filter Cleared',
        detail: 'Customer filter has been cleared',
        life: 2000
    });
};

// Computed property for filtered data
const filteredData = computed(() => {
    return listData.value;
});

const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('bulkUpdCust');
        if (response.data.status === 1) {
            // Handle success
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to bulk update', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to bulk update', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>

<style scoped lang="scss">
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