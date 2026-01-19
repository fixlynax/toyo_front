<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">OE Registration List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading OE Registration Details...'" :sub-message="'Fetching OE data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <div class="flex items-center gap-3 mb-4 ml-4">
                <!-- LEFT SIDE
                <Calendar v-model="dateRange" selectionMode="range" dateFormat="dd/mm/yy" placeholder="Select date range" style="width: 390px" />
                <Button label="Clear" class="p-button-sm p-button-danger" @click="clearDate" />
                <Button label="Filter" class="p-button-sm" @click="applyFilter" /> -->
            </div>
            <DataTable
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['oe_cert_no', 'member_code', 'full_name', 'weekcode', 'mfgcode', 'tyresize', 'tyrespec', 'registered_on', 'vehicle_no']"
                class="rounded-table"
                sortField="registered_on"
                :sortOrder="-1"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
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
                            <div>
                               <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading" @click="handleExport" :disabled="exportLoading" />
                            </div>
                        </div>
                        <!-- Second Row: Date Range Filter -->
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

                <template #empty> No OE registrations data found. </template>
                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading OE data...</p>
                    </div>
                </template>

                <!-- Export All Checkbox Column (EXACTLY like reference code) -->
                <Column header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="selectedExportIds.has(data.id)" @change="() => handleToggleExport(data.id)" />
                        </div>
                    </template>
                </Column>

                <Column field="oe_cert_no" header="OE Cert No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailOERegistration/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.oe_cert_no }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="full_name" header="TC Member" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <div v-if="data.member_code || data.full_name">
                            <div v-if="data.member_code" class="font-semibold">{{ data.member_code }}</div>
                            <div class="text-sm text-gray-600">{{ data.full_name || 'N/A' }}</div>
                        </div>
                        <div v-else class="text-gray-400">N/A</div>
                    </template>
                </Column>

                <Column field="vehicle_no" header="Vehicle Number" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.vehicle_no || 'N/A' }}
                    </template>
                </Column>

                <!-- Improved Tyre Column with vertical layout -->
                <Column header="Tyre" style="min-width: 10rem">
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

                <Column field="registered_on" header="Registered Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.registered_on) }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status === 0 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
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
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';

// 🟢 State Management
const listData = ref([]);
const initialLoading = ref(true);
const tableLoading = ref(false);
const exportLoading = ref(false);
const loading = ref(false);
const dateRange = ref([null, null]);
const formatDateDMY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
const visibleRows = ref([]); // For tracking filtered rows
const selectedExportIds = ref(new Set());
const toast = useToast();

// 🟢 Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 🟢 Fetch Data
const fetchOEData = async (body = null) => {
    try {
        tableLoading.value = true;
        const payload = body || {};
        const response = await api.post('warranty_registration/oe', payload);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((oe) => ({
                id: oe.id,
                oe_cert_no: oe.warranty_cert_no || 'N/A',
                member_code: oe.member_code || null,
                full_name: oe.full_name || null,
                mfgcode: oe.mfgcode || 'N/A',
                tyresize: oe.tyresize || 'N/A',
                tyrespec: oe.tyrespec || 'N/A',
                weekcode: oe.weekcode || 'N/A',
                registered_on: oe.registered_on || null,
                vehicle_no: oe.vehicle_no || 'N/A',
                status: oe.status || 0
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail:response.data.message || 'Failed to load data', life: 3000 });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching OE list:', error);
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

  fetchOEData(body);
};
const clearDate = () => {
  dateRange.value = [null, null];
};

const handleExport = async () => {
        const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading.value = true;
        
            const response = await api.postExtra(
            'excel/export-warranty-registration',{ warrantyreg_ids: JSON.stringify(idsArray) },
        {
            responseType: 'blob',
            headers: {
            'Content-Type': 'application/json',
            }
        }
        );
        const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'OERegList_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
        selectedExportIds.value.clear();
    } catch (error) {
        console.error('Error exporting data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    } finally {
        exportLoading.value = false;
    }
};


// 🟢 Initial load
onMounted(async () => {
    try {
        initialLoading.value = true;
        await fetchOEData();
    } catch (error) {
        console.error('Error in initial load:', error);
    } finally {
        initialLoading.value = false;
    }
});

// 🟢 Helper Functions
function parseDate(dateString) {
    if (!dateString || dateString === 'N/A') return null;

    let date;

    // Try DD-MM-YYYY format first
    const parts1 = dateString.split('-');
    if (parts1.length === 3 && parts1[2].length === 4) {
        const [day, month, year] = parts1;
        date = new Date(`${year}-${month}-${day}`);
    }
    // Try YYYY-MM-DD format (common from APIs)
    else if (dateString.includes('/')) {
        const parts2 = dateString.split('/');
        if (parts2.length === 3 && parts2[0].length === 4) {
            // YYYY/MM/DD
            date = new Date(dateString);
        } else if (parts2.length === 3 && parts2[2].length === 4) {
            // DD/MM/YYYY
            const [day, month, year] = parts2;
            date = new Date(`${year}-${month}-${day}`);
        }
    }
    // Try ISO format
    else {
        date = new Date(dateString);
    }

    return isNaN(date.getTime()) ? null : date;
}

function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';

    const date = parseDate(dateString);
    if (!date) return dateString;

    return date
        .toLocaleDateString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        .replace(/\//g, '/');
}

const getOverallStatusSeverity = (status) => {
    return status === 0 ? 'success' : 'danger';
};

// EXACTLY like reference code - toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map((item) => item.id);

    if (isAllSelected()) {
        // Remove all visible IDs at once (EXACTLY like reference code)
        selectedExportIds.value = new Set([...selectedExportIds.value].filter((id) => !allIds.includes(id)));
    } else {
        // Add all visible IDs at once (EXACTLY like reference code)
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// EXACTLY like reference code - check if all visible rows are selected
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every((item) => selectedExportIds.value.has(item.id));
};

// EXACTLY like reference code - handle individual checkbox toggle
const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
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

/* Tyre column styling */
:deep(.p-datatable-tbody > tr > td) {
    .tyre-info-vertical {
        padding: 0.25rem 0;

        .tyre-detail-row {
            padding: 0.125rem 0;
            font-size: 0.75rem;
            line-height: 1.25;
        }
    }
}
</style>
