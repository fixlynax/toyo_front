<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Redemption Management List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Redemption Management Details...'" :sub-message="'Fetching redemption data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTab" class="mb-4" />
            <DataTable
                :value="filteredData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['ref_no', 'redeem_date', 'item_status', 'quantity', 'member_name', 'item_status', 'status']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Left: Search Field + Cog Button -->
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                        </div>

                        <!-- Right: Export & Import Buttons (Item tab only) -->
                        <div class="flex items-center gap-2 ml-auto" v-if="activeTab === 2">
                            <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading1" @click="handleExport" />
                            <Button type="button" label="Bulk Update" icon="pi pi-file-import" :loading="importLoading1" @click="fileInput?.click()" />
                            <input ref="fileInput" type="file" class="hidden" accept=".xlsx,.xls" @change="handleImport" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Redemption data found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading redemption data...</p>
                    </div>
                </template>

                <Column v-if="activeTab === 2" header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :key="filteredData.length" binary :model-value="isAllSelected()" @change="toggleSelectAll" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox binary :model-value="selectedExportIds.has(data.id)" @change="handleToggleExport(data.id)" />
                        </div>
                    </template>
                </Column>

                <Column field="ref_no" header="Ref No" sortable style="min-width: 8rem" >
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailRedemption/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.ref_no || '-' }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="member_name" header="Member Name" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.member_name }}
                    </template>
                </Column>

                <Column field="item_status" header="Item Name" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.item_status }}
                    </template>
                </Column>

                <Column field="quantity" header="Quantity" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.quantity }}
                    </template>
                </Column>

                <Column field="redeem_date" header="Redemption Date" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.redeem_date) }}
                    </template>
                </Column>

                <Column field="item_status" header="Item Status" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.item_status }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
        <Dialog
        v-model:visible="showImportErrorDialog"
        header="Import Errors"
        modal
        :style="{ width: '700px' }"
        @hide="handleCloseErrorModal"
    >
        <div v-if="importErrors.length === 0" class="text-gray-500">
            No error details available.
        </div>

        <div v-else class="flex flex-col gap-4">
            <div
                v-for="(item, index) in importErrors"
                :key="index"
                class="p-3 border rounded"
            >
                <div class="font-semibold">
                     Redeem No: {{ item.redeem_no }}
                </div>
                <div v-if="showImportErrorHandle1" >
                    <div class="text-sm text-gray-600">
                        Error: {{ item.error || '-' }}
                    </div>
                </div>
                <div class="text-red-600 mt-2">
                    {{ item.reason }}
                </div>
            </div>
        </div>

        <template #footer>
            <Button
                label="Close"
                icon="pi pi-times"
                @click="handleCloseErrorModal()"
            />
        </template>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import * as XLSX from 'xlsx';

// Data variables
const listData = ref([]);
const initialLoading = ref(true); // For initial page load
const tableLoading = ref(false); // For table operations
const activeTab = ref(0); // 0=All, 1=Voucher, 2=Item
const exportLoading1 = ref(false);
const importLoading1 = ref(false);
const fileInput = ref(null); // use this everywhere
const toast = useToast();
const importErrors = ref([]);
const showImportErrorDialog = ref(false);
const showImportErrorHandle = ref(false);
const statusTabs = [
    { label: 'All'},
    { label: 'Voucher'},
    { label: 'Item'}
];
const filteredData = computed(() => {
    if (activeTab.value === 1) {
        return listData.value.filter((i) => i.type === 'VOUCHER');
    }
    if (activeTab.value === 2) {
        return listData.value.filter((i) => i.type === 'ITEM');
    }
    return listData.value;
});

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('redeem/list');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching redeem list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
};

const getOverallStatusLabel = (status) => {
    if (status === 0) return 'Pending';
    if (status === 1) return 'Approved';
    if (status === 2) return 'Rejected';
    return 'Unknown';
};

const getOverallStatusSeverity = (status) => {
    if (status === 0) return 'warn'; // Fixed: was 'warn', should be 'warning'
    if (status === 1) return 'success';
    if (status === 2) return 'danger';
    return 'secondary';
};

const selectedExportIds = ref(new Set());

const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
    }
};

const toggleSelectAll = () => {
    if (isAllSelected()) {
        selectedExportIds.value.clear();
    } else {
        filteredData.value.forEach((row) => {
            selectedExportIds.value.add(row.id);
        });
    }
};

const isAllSelected = () => {
    return filteredData.value.length > 0 && filteredData.value.every((row) => selectedExportIds.value.has(row.id));
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

const handleExport = async () => {
    const idsArray = Array.from(selectedExportIds.value).map((id) => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }

    try {
        exportLoading1.value = true;

        const formData = new FormData();
        formData.append('redeem_ids', JSON.stringify(idsArray)); // like Postman: [3,4]

        const response = await api.postExtra('excel/export-redemption-delivery', formData, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Redemption_Item.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
        selectedExportIds.value.clear();
    } catch (error) {
        console.error('Error exporting data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    } finally {
        exportLoading1.value = false;
    }
};

const handleImport = async (event) => {
    if (activeTab.value !== 2) {
        toast.add({
            severity: 'warn',
            summary: 'Not Allowed',
            detail: 'You can only import data in the Item tab.',
            life: 3000
        });
        if (fileInput.value) fileInput.value.value = '';
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        toast.add({
            severity: 'error',
            summary: 'Invalid File',
            detail: 'Please upload a valid Excel file (.xlsx or .xls)',
            life: 3000
        });
        return;
    }

    try {
        importLoading1.value = true;
        const formData = new FormData();
        formData.append('redeem_excel', file);

        // Send to backend
        const response = await api.postExtra('excel/import-redemption-delivery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || 'File imported successfully',
                life: 3000
            });
            await fetchData();
        } else {
            importErrors.value = response.data.admin_data || [];
            if (importErrors.value.length > 0) {
                showImportErrorHandle.value = true;
                showImportErrorDialog.value = true;
            }
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: response.data.message || 'Failed to import data',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading1.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
};
const handleCloseErrorModal = () => {
    importErrors.value = [];
    showImportErrorHandle.value = false;
    showImportErrorDialog.value = false; // optional, v-model handles it
};
</script>

<style scoped>
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
</style>
