<script setup>
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed, watch } from 'vue';
import Dropdown from 'primevue/dropdown';

const listData = ref([]);
const loading = ref(true);
const loadingCustomers = ref(false);
const isLoadingData = ref(false);
const exportLoading = ref(false);
const selectedCustomer = ref(null);
const customerOptions = ref([]);
const debounceTimer = ref(null);

const activeTab = ref(0);

const tabs = [
    { label: 'Processing', value: 'Processing' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' }
];

// Define status categories based on your requirements
// const statusCategories = {
//     Processing: ['Pending Dealer', 'Pending CTC', 'Processing'],
//     'In Progress': ['In Progress', 'Pending Scrap', 'Pending Manager Approve', 'Pending Invoice', 'Pending Invoice Approve'],
//     Completed: ['Completed', 'Admin Approved', 'Dealer Approved', 'Settled'],
//     Reject: ['Reject', 'Admin Rejected', 'Dealer Rejected']
// };

const getOverallStatusSeverity = (status) => {
    switch (status) {
        case 'Pending Dealer':
        case 'Pending CTC':
        case 'Pending Scrap':
        case 'Pending Manager Approve':
        case 'Pending Invoice':
        case 'Pending Invoice Approve':
            return 'warn';
        case 'Dealer Approved':
        case 'Admin Approved':
        case 'Completed':
        case 'Settled':
            return 'success';
        case 'Dealer Rejected':
        case 'Admin Rejected':
        case 'Rejected':
            return 'danger';
        case 'Processing':
            return 'info';
        case 'In Progress':
            return 'warning';
        default:
            return 'secondary';
    }
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Computed properties
const hasCustomerSelected = computed(() => !!selectedCustomer.value);
const filteredList = computed(() => {
    const tabValue = tabs[activeTab.value].value;

    return listData.value.filter((item) => item.status === tabValue);
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

const fetchClaims = async () => {
    isLoadingData.value = true;
    try {
        const params = {};

        // Add customer account number if selected
        if (selectedCustomer.value) {
            params.custaccountno = selectedCustomer.value.accountNo;
        }

        const response = await api.post('warranty_claim', params);

        if (response.data.status === 1) {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.claim_id,
                refNo: item.claimRefNo,
                dealerName: item.dealer,
                isTWP: item.isTWP,
                claimTypeDisplay: item.isTWP == 1 ? 'TWP' : 'Technical Claim',
                claimType: item.warrantyType || '-',
                dealer_sales_office: item.dealer_sales_office || '-',
                claimDate: item.claim_date || '-',
                submissionDate: item.submit_date || '-',
                warrantyRegCertNo: item.warrantyRegCertNo || '-',
                status: item.status,
                stage: item.stage || '-'
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching claims:', error);
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
        fetchClaims();
    }, 300);
});

// 🟢 Watch tab changes
watch(activeTab, (newValue, oldValue) => {
    // If customer is selected, data is already filtered by computed property
    // No need to refetch, just update the filtered view
    if (!selectedCustomer.value) {
        listData.value = [];
    }
});

function formatDate(dateString) {
    if (!dateString) return '';

    // Expected: DD-MM-YYYY
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date)) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Export functionality
const exportToCSV = () => {
    exportLoading.value = true;

    try {
        // Use filtered data for export
        const exportData = filteredList.value.map((item) => ({
            'Ref No': item.refNo,
            'Submission Date': item.claimDate,
            'Dealer Name': item.dealerName,
            'Warranty Cert No': item.warrantyRegCertNo,
            'Dealer Sales Office': item.dealer_sales_office,
            'Claim Type': item.claimType,
            Status: item.status,
            Stage: item.stage
        }));

        if (exportData.length === 0) {
            alert('No data to export for the current filter.');
            exportLoading.value = false;
            return;
        }

        // Create CSV content
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map((item) =>
            Object.values(item)
                .map((field) => `"${String(field).replace(/"/g, '""')}"`)
                .join(',')
        );

        const csvContent = [headers, ...rows].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `warranty_claims_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting data. Please try again.');
    } finally {
        exportLoading.value = false;
    }
};

// 🟢 Clear customer filter
const clearCustomerFilter = () => {
    selectedCustomer.value = null;
    listData.value = [];
};

onMounted(async () => {
    await fetchCustomers();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Claim</div>

        <!-- Custom Tabs with Counts -->
        <div class="border-gray-200 mb-4">
            <div class="flex space-x-8">
                <button
                    v-for="(tab, index) in tabs"
                    :key="tab.value"
                    @click="activeTab = index"
                    class="px-1 py-3 text-sm font-medium relative transition-colors duration-200"
                    :class="[activeTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                >
                    <div class="flex items-center gap-2">
                        <span>{{ tab.label }}</span>
                    </div>
                </button>
            </div>
        </div>

        <LoadingPage v-if="loading" message="Loading Warranty Claim List..." />

        <div v-else>
            <DataTable
                :value="filteredList"
                :paginator="true"
                :rows="10"
                dataKey="id"
                class="rounded-table"
                removableSort=""
                :rowHover="true"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['refNo', 'dealerName', 'claimTypeDisplay', 'dealer_sales_office', 'claimDate', 'status', 'stage', 'warrantyRegCertNo']"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <template #header>
                    <div class="flex flex-col gap-4 w-full">
                        <!-- Top Row: Search -->
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>

                            <div class="flex items-center gap-2 ml-auto">
                                <Button type="button" label="Export " icon="pi pi-download" class="p-button-success" @click="exportToCSV" :loading="exportLoading" :disabled="filteredList.length === 0" />
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
                            <div v-else-if="isLoadingData" class="text-sm text-blue-600 italic">Loading warranty claims...</div>
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
                                <span class="text-lg">Loading warranty claims for {{ selectedCustomer?.name }}</span>
                                <span class="text-sm text-gray-400">Please wait...</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-file-excel text-3xl text-yellow-400"></i>
                                <span class="text-lg" v-if="selectedCustomer">No warranty claims found for {{ selectedCustomer.name }}</span>
                                <span class="text-lg" v-else>No warranty claims found</span>
                                <span class="text-sm text-gray-400">Try selecting a different customer</span>
                                <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearCustomerFilter" />
                            </div>
                        </template>
                    </div>
                </template>

                <Column field="refNo" header="Ref No" style="min-width: 15rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/sales/detailCustomerWarrantyClaim/${data.id}`" class="hover:underline font-bold text-blue-600">
                            {{ data.refNo }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="claimDate" header="Submission Date" style="min-width: 15rem" sortable>
                    <template #body="{ data }">{{ data?.claimDate ? formatDate(data.claimDate) : 'Not Assigned' }}</template>
                </Column>

                <Column field="dealerName" header="Dealer Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.dealerName }}</div>
                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.warrantyRegCertNo }}</div>
                        </div>
                    </template>
                </Column>
                <Column field="dealer_sales_office" header="Dealer Sales Office" style="min-width: 15rem" sortable>
                    <template #body="{ data }">{{ data.dealer_sales_office }}</template>
                </Column>
                <Column field="claimTypeDisplay" header="Claim Type" style="min-width: 15rem" sortable>
                    <template #body="{ data }">
                        {{ data.claimTypeDisplay }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>

                <Column field="stage" header="Stage" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.stage }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    padding: 12px 16px;
    font-weight: 600;
    color: #374151;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 12px 16px;
    border-color: #e5e7eb;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #f3f4f6;
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
