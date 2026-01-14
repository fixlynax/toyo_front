<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Redemption Management List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Redemption Management Details...'" :sub-message="'Fetching redemption data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <TabView v-model:activeIndex="activeTab" class="mb-4">
                <TabPanel header="All" />
                <TabPanel header="Voucher" />
                <TabPanel header="Item" />
            </TabView>

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
                :globalFilterFields="['refno', 'recipientName', 'itemName', 'quantity', 'redemptionDate', 'status']"
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

                <Column field="refno" header="Ref No" sortable style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailRedemption/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.refno }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="memberName" header="Member Name" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.recipientName }}
                    </template>
                </Column>

                <Column field="itemName" header="Item Name" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.itemName }}
                    </template>
                </Column>

                <Column field="quantity" header="Quantity" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.quantity }}
                    </template>
                </Column>

                <Column field="redemptionDate" header="Redemption Date" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ formatDate(data.redemptionDate) }}
                    </template>
                </Column>

                <Column field="itemStatus" header="Item Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.itemStatus }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
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

const filteredData = computed(() => {
    if (activeTab.value === 1) {
        return listData.value.filter((i) => i.itemType === 'VOUCHER');
    }
    if (activeTab.value === 2) {
        return listData.value.filter((i) => i.itemType === 'ITEM');
    }
    return listData.value;
});

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('redeem/list');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((redeem) => ({
                id: redeem.id,
                refno: redeem.ref_no || 'N/A',
                recipientName: redeem.member_name || 'N/A',
                itemName: redeem.redeem_item || 'N/A',
                quantity: redeem.quantity || 0,
                redemptionDate: redeem.redeem_date || 'N/A',
                itemStatus: redeem.item_status || 'N/A',
                itemType: redeem.type || 'N/A',
                status: redeem.status
            }));
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
});

const fetchData = async () => {
    try {
        tableLoading.value = true;
        const response = await api.get('redeem/list');
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((redeem) => ({
                id: redeem.id,
                refno: redeem.ref_no || 'N/A',
                recipientName: redeem.member_name || 'N/A',
                itemName: redeem.redeem_item || 'N/A',
                quantity: redeem.quantity || 0,
                redemptionDate: redeem.redeem_date || 'N/A',
                itemStatus: redeem.item_status || 'N/A',
                itemType: redeem.type || 'N/A',
                status: redeem.status
            }));
        }
    } finally {
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

    let date;

    // If the string contains a space (e.g., "2026-01-14 00:00:00"), take only the first part
    if (dateString.includes(' ')) {
        dateString = dateString.split(' ')[0];
    }

    // Try to parse YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        date = new Date(year, month - 1, day);
    } else {
        // Fallback: try Date constructor
        date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return '';

    // Return DD/M/YYYY format
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

        // Read Excel file
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // Preprocess rows: rename Shipped Date → scheduled_date
        const processedRows = rows.map((row) => {
            // Extract shipped date and format to YYYY-MM-DD
            let dateStr = row['Shipped Date (YYYY/MM/DD)'] || row['Shipped Date'] || null;
            let formattedDate = '';

            if (dateStr) {
                const d = new Date(dateStr);
                if (!isNaN(d)) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    formattedDate = `${year}-${month}-${day}`;
                }
            }

            return {
                ...row,
                scheduled_date: formattedDate
            };
        });

        // Validate: check that scheduled_date exists for all rows
        const invalidRows = processedRows.filter((r) => !r.scheduled_date);
        if (invalidRows.length > 0) {
            toast.add({
                severity: 'warn',
                summary: 'Invalid File',
                detail: `${invalidRows.length} row(s) missing valid Scheduled Date`,
                life: 5000
            });
            return;
        }

        // Convert back to a new Excel file to send to backend
        const newSheet = XLSX.utils.json_to_sheet(processedRows);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Sheet1');
        const newFileData = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        const newFile = new Blob([newFileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Prepare FormData
        const formData = new FormData();
        formData.append('redeem_excel', newFile, file.name);

        // Send to backend
        const response = await api.postExtra('excel/import-redemption-delivery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (response.data.status === 1) {
            await fetchData();
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || 'File imported successfully',
                life: 3000
            });
        } else {
            let errorMessage = response.data.message || 'Import failed';
            if (Array.isArray(response.data.admin_data)) {
                const errorDetails = response.data.admin_data.map((r) => `${r.redeem_no}: ${r.error}`).join('<br>');

                toast.add({
                    severity: 'error',
                    summary: 'Import Failed',
                    detail: `${errorMessage}<br><br><strong>Error Details:</strong><br>${errorDetails}`,
                    life: 8000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 5000
                });
            }
        }
    } catch (error) {
        let errorDetail = error.response?.data?.message || error.message || 'Import failed';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorDetail,
            life: 5000
        });
    } finally {
        importLoading1.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
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
