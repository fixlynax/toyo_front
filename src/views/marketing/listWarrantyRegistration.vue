<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Warranty Registration List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Warranty Registration Details...'" :sub-message="'Fetching Warranty data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

            <DataTable
                :value="filteredUsers"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['warranty_cert_no', 'invoice_no', 'member_code', 'full_name', 'mfgcode', 'tyresize', 'tyrespec', 'registered_on']"
                class="rounded-table"
                sortField="registered_on"
                :sortOrder="-1"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex flex-col gap-4 w-full">
                        <!-- Top Row: Search and Export -->
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>

                            <div>
                                <Button label="Export" icon="pi pi-upload" class="p-button-success" :loading="exportLoading" @click="exportToExcel" />
                            </div>
                        </div>

                        <div class="flex items-center gap-4 mb-1 flex-wrap">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Date Range:</span>
                                <div class="flex items-center gap-2">
                                    <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                    <span class="text-gray-500">to</span>
                                    <Calendar v-model="dateRange[1]"  placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                </div>
                                <Button v-if="dateRange[0] || dateRange[1]"  icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDate" title="Clear date filter" />
                            </div>
                            <Button 
                                icon="pi pi-filter" 
                                label="Filter" 
                                class="p-button-primary p-button-sm" 
                                @click="applyFilter" 
                                :disabled="(dateRange[0] && !dateRange[1]) || (!dateRange[0] && dateRange[1])"
                                :loading="loading"
                            />
                        </div>
                    </div>
                </template>

                <template #empty> No warranty registrations data found. </template>
                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading Warranty data...</p>
                    </div>
                </template>

                <Column field="warranty_cert_no" header="Warranty Cert No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailWarrantyRegistration/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.warranty_cert_no }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="invoice_no" header="Invoice No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.invoice_no || 'N/A' }}
                    </template>
                </Column>

                <Column field="full_name" header="TC Member" style="min-width: 8rem">
                    <template #body="{ data }">
                        <div v-if="data.member_code || data.full_name">
                            <div v-if="data.member_code">{{ data.member_code }}</div>
                            <div>{{ data.full_name || 'N/A' }}</div>
                        </div>
                        <div v-else>N/A</div>
                    </template>
                </Column>

                <Column field="tyre_info" header="Tyre" style="min-width: 6rem">
                    <template #body="{ data }">
                        <div class="flex flex-col text-sm">
                            <!-- MFG -->
                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-gray-600 w-16">MFG:</span>
                                <span class="font-medium">{{ data.mfgcode || '-' }}</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-gray-600 w-16">Size:</span>
                                <span class="font-medium">{{ data.tyresize || '-' }}</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-gray-600 w-16">Spec:</span>
                                <span class="font-medium">{{ data.tyrespec || '-' }}</span>
                            </div>

                            <div class="flex items-center gap-2" v-if="data.weekcode">
                                <span class="font-semibold text-gray-600 w-16">Week:</span>
                                <span class="font-medium">{{ data.weekcode }}</span>
                            </div>
                            <!-- Show message if all empty -->
                            <div v-if="!data.mfgcode && !data.tyresize && !data.tyrespec && !data.weekcode" class="text-center text-gray-400 py-1">-</div>
                        </div>
                    </template>
                </Column>

                <Column field="registered_on" header="Registered Date" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.registered_on) }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                   <template #body="{ data }">
                        <Tag :value="(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

// 🟢 State Management
const listData = ref([]);
const initialLoading = ref(true);
const tableLoading = ref(false);
const exportLoading = ref(false);
const dateRange = ref([null, null]);
const loading = ref(false);
const formatDateDMY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// 🟢 Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 🟢 Fetch Data
const fetchWarrantyData = async (body = null) => {
    try {
        tableLoading.value = true;
        const payload = body || {};
        const response = await api.post('warranty_registration/normal', payload);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((warranty) => ({
                id: warranty.id,
                warranty_cert_no: warranty.warranty_cert_no || 'N/A',
                invoice_no: warranty.invoice_no || 'N/A',
                member_code: warranty.member_code || null,
                full_name: warranty.full_name || null,
                mfgcode: warranty.mfgcode || 'N/A',
                tyresize: warranty.tyresize || 'N/A',
                tyrespec: warranty.tyrespec || 'N/A',
                weekcode: warranty.weekcode || 'N/A',
                registered_on: warranty.registered_on || null,
                status: warranty.status 
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail:response.data.message || 'Failed to load data', life: 3000 });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching Warranty registration list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail:response.data.message || 'Failed to load data', life: 3000 });
        listData.value = [];
    } finally {
        tableLoading.value = false;
    }
};
const applyFilter = () => {
  const dateRangeStr = dateRange.value?.[0] && dateRange.value?.[1]? `${formatDateDMY(dateRange.value[0])} - ${formatDateDMY(dateRange.value[1])}`: null// returns "dd/mm/yyyy - dd/mm/yyyy" or null
  const body = {
    date_range: dateRangeStr
  };

  fetchWarrantyData(body);
};
const clearDate = () => {
  dateRange.value = [null, null]; // or []
};

// 🟢 Initial load
onMounted(async () => {
    try {
        initialLoading.value = true;
        await fetchWarrantyData();
    } catch (error) {
        console.error('Error in initial load:', error);
    } finally {
        initialLoading.value = false;
    }
});

// Tabs for status filtering
const statusTabs = ref([
    { label: 'Active' }, 
    { label: 'Claimed' },
    { label: 'Expired' }
]);
const activeTabIndex = ref(0);

// Computed: Filter listData based on active tab
const filteredUsers = computed(() => {
    switch (activeTabIndex.value) {
        case 0: // All Users
            return listData.value.filter((user) => user.status === 'Active');
        case 1: // Active
            return listData.value.filter((user) => user.status === 'Claimed');
        case 2: // Inactive
            return listData.value.filter((user) => user.status == 'Expired');
        default:
            return listData.value;
    }
});

// 🟢 Helper Functions
function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';

    try {
        // Handle DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');

        if (!day || !month || !year) return dateString;

        const date = new Date(`${year}-${month}-${day}`);

        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error, dateString);
        return dateString;
    }
}

const getOverallStatusSeverity = (status) => {
    if (status === 'Active') return 'success'; // Fixed: was 'warn', should be 'warning'
    if (status === 'Claimed') return 'warn';
    if (status === 'Expired') return 'danger';
    return 'secondary';
};


const exportToExcel = () => {
    if (listData.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No data to export', life: 3000 });
        return;
    }

    try {
        // Create worksheet data
        const headers = ['Warranty Cert No', 'Invoice No', 'TC Member Code','TC Member Name', 'MFG', 'Size', 'Spec', 'Week', 'Registered Date', 'Status'];

        // Prepare data rows
        const csvData = listData.value.map((warranty) => [
             `"${warranty.warranty_cert_no || ''}"`,
                `"${warranty.invoice_no || ''}"`,
                `"${warranty.member_code || ''}"`,
                `"${warranty.full_name || ''}"`,
                `"${warranty.mfgcode  || ''}"`,
                `"${warranty.tyresize || ''}"`,
                `"${warranty.tyrespec || ''}"`,
                `"${warranty.weekcode || ''}"`,
                `"${warranty.registered_on || ''}"`,
                `"${warranty.status || ''}"`
        ]);

        // Combine headers and data
        const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `Waranty_Registration_List_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
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

/* Custom styling for the date filter */
:deep(.p-calendar) {
    .p-inputtext {
        padding: 0.5rem;
    }
}
</style>
