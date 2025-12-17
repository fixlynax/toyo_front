<script setup>
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';

const router = useRouter();
const listData = ref([]);
const loading = ref(true);
const loadingCustomers = ref(false);
const isLoadingData = ref(false);
const exportLoading = ref(false);
const selectedCustomer = ref(null);
const customerOptions = ref([]);
const debounceTimer = ref(null);
const claimSearch = ref(''); // For direct claim number search
const searchingClaim = ref(false); // Track if searching for claim
const searchError = ref(''); // For search errors

const activeTab = ref(0);

const tabs = [
    { label: 'Processing', value: 'Processing' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' }
];

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

// 🟢 Fetch Customers for Dropdown - MODIFIED to show Main accounts only
const fetchCustomers = async () => {
    try {
        loadingCustomers.value = true;

        // Fetch customers from the list_dealer endpoint
        const response = await api.post('list_dealer', {
            mainBranch: 0 // Get all dealers including sub-branches
        });

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const mainDealerList = [];

            Object.keys(adminData).forEach((key) => {
                const customer = adminData[key];
                const shop = customer.shop;

                // 🟢 Only include main dealers (accounts ending with "00")
                if (shop.companyName1 && shop.custAccountNo && shop.custAccountNo.toString().endsWith('00')) {
                    mainDealerList.push({
                        id: shop.id,
                        name: trimCompanyName(shop.companyName1, shop.companyName2),
                        accountNo: shop.custAccountNo,
                        city: shop.city,
                        state: shop.state,
                        isMain: true,
                        hasSubBranches: Object.keys(customer.subBranches || {}).length > 0
                    });
                }
            });

            // Sort alphabetically by company name
            customerOptions.value = mainDealerList.sort((a, b) => a.name.localeCompare(b.name));
        }
    } catch (error) {
        console.error('Error fetching customer list for dropdown:', error);
    } finally {
        loadingCustomers.value = false;
    }
};

// 🟢 Helper function to trim company name
const trimCompanyName = (name1, name2) => {
    const fullName = `${name1 || ''} ${name2 || ''}`.trim();
    return fullName || 'Unknown';
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

// 🟢 Direct claim number search
const searchClaimDirectly = async () => {
    if (!claimSearch.value.trim()) {
        searchError.value = 'Please enter a claim reference number';
        return;
    }

    searchingClaim.value = true;
    searchError.value = '';

    try {
        // First, try to fetch claim details by ref number
        const response = await api.post('warranty_claim', {
            claimRefNo: claimSearch.value.trim()
        });

        if (response.data.status === 1 && response.data.admin_data && response.data.admin_data.length > 0) {
            // Found the claim, navigate to detail page
            const claim = response.data.admin_data[0];
            router.push(`/sales/detailCustomerWarrantyClaim/${claim.claim_id}`);
        } else {
            searchError.value = `Claim reference "${claimSearch.value}" not found. Please check the number and try again.`;
        }
    } catch (error) {
        console.error('Error searching claim:', error);
        searchError.value = 'Error searching for claim. Please try again.';
    } finally {
        searchingClaim.value = false;
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

// 🟢 Clear claim search
const clearClaimSearch = () => {
    claimSearch.value = '';
    searchError.value = '';
};

// 🟢 Handle Enter key in claim search
const handleClaimSearchKeydown = (event) => {
    if (event.key === 'Enter') {
        searchClaimDirectly();
    }
};

onMounted(async () => {
    await fetchCustomers();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Customer Warranty Claim</div>

        <!-- High-Level Claim Search (Above Tabs) -->
        <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <i class="pi pi-search text-blue-500"></i>
                    <span class="text-lg font-semibold text-gray-800">Warranty Claim Search</span>
                </div>
                <Badge value="Quick Access" severity="info" />
            </div>

            <p class="text-sm text-gray-600 mb-4">Enter a claim reference number to go directly to the claim details page</p>

            <div class="flex items-center gap-2">
                <IconField class="flex-1">
                    <InputIcon><i class="pi pi-id-card" /></InputIcon>
                    <InputText v-model="claimSearch" placeholder="Enter Claim Reference Number (e.g., W-2024-00123)" class="w-full" @keydown="handleClaimSearchKeydown" :disabled="searchingClaim" />
                </IconField>

                <Button label="Go to Claim" icon="pi pi-arrow-right" class="p-button-primary" @click="searchClaimDirectly" :loading="searchingClaim" :disabled="!claimSearch.trim() || searchingClaim" />

                <Button v-if="claimSearch" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearClaimSearch" title="Clear search" />
            </div>

            <!-- Search Error Message -->
            <div v-if="searchError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <div class="flex items-center gap-2">
                    <i class="pi pi-exclamation-circle text-red-500"></i>
                    <span class="text-sm text-red-700">{{ searchError }}</span>
                </div>
            </div>
        </div>

        <!-- OR Divider -->
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">OR</span>
            </div>
        </div>

        <!-- Custom Tabs -->
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
            <!-- SEPARATE FILTER/SEARCH SECTION -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div class="flex flex-col gap-4 w-full">
                    <!-- Search Row -->
                    <div class="flex items-center gap-4 w-full">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon><i class="pi pi-search" /></InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" :disabled="!hasCustomerSelected" />
                            </IconField>
                        </div>

                        <!-- Export Button in Filter Section -->
                        <div class="flex items-center gap-2 ml-auto">
                            <Button type="button" label="Export" icon="pi pi-download" class="p-button-success" @click="exportToCSV" :loading="exportLoading" :disabled="filteredList.length === 0 || !hasCustomerSelected" />
                        </div>
                    </div>

                    <!-- Filter Row: Customer Name Filter -->
                    <div class="flex items-center gap-6 flex-wrap">
                        <!-- Customer Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Customer:</span>
                            <div class="relative">
                                <Dropdown
                                    v-model="selectedCustomer"
                                    :options="customerOptions"
                                    optionLabel="name"
                                    placeholder="Select Customer (Main Accounts Only)"
                                    class="w-100"
                                    :loading="loadingCustomers"
                                    :disabled="loadingCustomers || loading"
                                    :filter="true"
                                    filterPlaceholder="Search main customers..."
                                >
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="flex items-center gap-2">
                                            <span class="text-blue-600 font-bold">🏢</span>
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
                                        <div class="flex items-center gap-2">
                                            <span class="text-blue-600 font-bold">🏢</span>
                                            <div class="flex flex-col">
                                                <span class="font-medium">{{ slotProps.option.name }}</span>
                                                <span class="text-xs text-gray-500">{{ slotProps.option.accountNo }}</span>
                                            </div>
                                            <Badge v-if="slotProps.option.hasSubBranches" value="Has Branches" severity="info" size="small" class="ml-auto" />
                                        </div>
                                    </template>
                                </Dropdown>
                                <Button v-if="selectedCustomer" icon="pi pi-times" class="p-button-text p-button-sm ml-2" @click="clearCustomerFilter" title="Clear customer filter" :disabled="isLoadingData" />
                            </div>
                        </div>

                        <!-- Status message -->
                        <!-- <div v-if="!hasCustomerSelected" class="text-sm text-blue-600 italic">Select a main customer account to view claims</div>
                        <div v-else-if="isLoadingData" class="text-sm text-blue-600 italic">Loading warranty claims for {{ selectedCustomer.name }}...</div> -->
                    </div>
                </div>
            </div>

            <!-- DATA TABLE -->
            <DataTable
                v-if="hasCustomerSelected"
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
                sortField="claimDate"
                :sortOrder="-1"
            >
                <template #empty>
                    <div class="text-center py-8 text-gray-500">
                        <template v-if="isLoadingData">
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
                                <span class="text-sm text-gray-400">Try selecting a different main customer account</span>
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

            <!-- Initial state when no customer is selected -->
            <div v-if="!hasCustomerSelected && !loading" class="text-center py-12 bg-gray-50 rounded-lg border">
                <div class="flex flex-col items-center gap-4">
                    <i class="pi pi-users text-5xl text-blue-300"></i>
                    <h3 class="text-xl font-semibold text-gray-700">No Customer Selected</h3>
                    <p class="text-gray-500 max-w-md">Please select a customer from the dropdown above to view their warranty claim history. The table will display claims for the selected customer and all its branches.</p>
                </div>
            </div>
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
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
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

/* Direct claim search styling */
:deep(.p-inputtext) {
    &.claim-search {
        border-color: #3b82f6;
        border-width: 2px;

        &:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    }
}
</style>
