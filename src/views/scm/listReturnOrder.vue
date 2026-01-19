<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Return Order Collection List</div>
        <LoadingPage v-if="loading" message="Loading Return Order Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />
            <DataTable
                :value="returnList"
                @filter="onTableFilter"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[ 10, 20, 50, 100]"
                dataKey="materialid"
                removableSort
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                class="rounded-table"
                filterDisplay="menu"
                :globalFilterFields="['sapDateSearch','sapTimeSearch','return_orderNo_ref', 'custaccountno', 'storageLocation', 'city', 'dealerName', 'delivery_status', 'pickupDateSearch', 'receiveDateSearch']"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Search and Filters Row -->
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
                            <div class="flex justify-end gap-2" v-if="statusTabs[activeTabIndex]?.label === 'New' && canUpdate">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading1" @click="handleExport1" />
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" @click="importInput1?.click()" :loading="importLoading1" />
                                <input ref="importInput1" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport1" />
                            </div>
                            <div class="flex justify-end gap-2" v-if="statusTabs[activeTabIndex]?.label === 'Pending' && canUpdate">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading2" @click="handleExport2" />
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" @click="importInput2?.click()" :loading="importLoading2" />
                                <input ref="importInput2" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport2" />
                            </div>
                            <div class="flex justify-end gap-2" v-if="statusTabs[activeTabIndex]?.label === 'Completed'">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="exportToExcel" />
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

                <template #empty> No return orders found. </template>
                <template #loading> Loading return orders data. Please wait. </template>

                <Column v-if="statusTabs[activeTabIndex]?.label !== 'Completed' && canUpdate" header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :key="returnList.length" :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="selectedExportIds.has(data.id)" @change="() => handleToggleExport(data.id)" />
                        </div>
                    </template>
                </Column>
                <Column field="sap_timestamp" header="Created On" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.sapDateSearch ?? '-' }}
                        <br/>
                        {{ data.sapTimeSearch ?? '-' }}
                    </template>
                </Column>
                <Column field="return_orderNo_ref" header="Ref No" dataType="date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailReturnOrder/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.return_orderNo_ref }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="dealerName" header="Ship-To" dataType="date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{ data?.dealerName || '-' }}</span>
                        <br />
                        {{ data?.custaccountno ?? '-' }}
                    </template>
                </Column>
                <Column field="storageLocation" header="Storage Location" style="max-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data?.storageLocation ?? '-' }}
                    </template>
                </Column>
                <Column field="city" header="City" style="max-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data?.city?.replace(/,$/, '') ?? '-' }}
                    </template>
                </Column>
                <Column field="state" header="State" style="max-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data?.state ?? '-' }}
                    </template>
                </Column>
                <Column field="pickupDateSearch" header="Pickup Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.pickupDateSearch || 'No date assigned' }}
                    </template>
                </Column>
                <Column field="receiveDateSearch" header="Receiving Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.receiveDateSearch || 'No date assigned' }}
                    </template>
                </Column>
                <Column field="return_order_array.length" header="Return Items Qty" style="min-width: 8rem; text-align: center" sortable>
                    <template #body="{ data }">
                        {{
                            data.return_order_array?.reduce((total, item) => total + Number(item.qty || 0),0) || 0
                        }}
                    </template>
                </Column>
                <Column field="delivery_status" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Tag :value="data.delivery_status" :severity="getStatusSeverity(data.delivery_status)" />
                    </template>
                </Column>
                <Column v-if="statusTabs[activeTabIndex]?.label !== 'New' && canUpdate" field="report" header="Report" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button 
                            icon="pi pi-print" 
                            class="p-button-text p-button-sm" 
                            @click="fetchReport(data.id)" 
                            tooltip="Print Report"
                            />
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
                    Return Order No: {{ item.return_order_no }}
                </div>
                <div v-if="showImportErrorHandle1" class="text-sm text-gray-600">
                    Pickup Date: {{ item.pickup_date_raw || 'Not Assigned' }}
                </div>
                <div v-if="showImportErrorHandle2" class="text-sm text-gray-600">
                    Receive Date: {{ item.receive_date_raw || 'Not Assigned' }}
                </div>
                <div class="text-red-600 mt-2">
                    {{ item.error }}
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
import { ref, onMounted, computed, onBeforeMount, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';
import LoadingPage from '@/components/LoadingPage.vue';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Return Order Collection'));
const denyAccess = computed(() => menuStore.canTest('Return Order Collection'));
const toast = useToast();
const exportLoading1 = ref(false);
const importLoading1 = ref(false);
const exportLoading2 = ref(false);
const importLoading2 = ref(false);
const returnList = ref([]);
const loading = ref(true);
const importInput1 = ref();
const importInput2 = ref();
const importErrors = ref([]);
const showImportErrorDialog = ref(false);
const showImportErrorHandle1 = ref(false);
const showImportErrorHandle2 = ref(false);

const selectedExportIds = ref(new Set());
const visibleRows = ref([]);
watch(returnList, (newVal) => {
    returnList.value = newVal;
}, { immediate: true });
 
const activeTabIndex = ref(0);
const dateRange = ref([null, null]);

const formatDateDMY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const statusTabs = [
    { label: 'New', submitLabel: 'NEW' },
    { label: 'Pending', submitLabel: 'PENDING' },
    { label: 'Completed', submitLabel: 'COMPLETED' }
];

watch(activeTabIndex, () => {
    const tab = statusTabs[activeTabIndex.value];
    if (tab.submitLabel === 'COMPLETED') {
        // Set default date range: last 7 days until today
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        dateRange.value = [lastWeek, today];
        const dateRangeStr = dateRange.value?.[0] && dateRange.value?.[1] ? `${formatDateDMY(dateRange.value[0])} - ${formatDateDMY(dateRange.value[1])}` : null;

        // Prepare request body
        const body = {
            tab: tab.submitLabel,
            date_range: dateRangeStr
        };
        fetchData(body);
    } else {
        dateRange.value = [null, null];
        fetchData();
    }
    selectedExportIds.value.clear();
});


const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
    }
};

const onTableFilter = (event) => {
    // Update visibleRows whenever filtering happens
    visibleRows.value = event.filteredValue || returnList.value;
};

// Toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map(item => item.id);

    if (isAllSelected()) {
        // Remove all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value].filter(id => !allIds.includes(id)));
    } else {
        // Add all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// Computed: are all visible rows selected?
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every(item => selectedExportIds.value.has(item.id));
};

// Export function PICKUP ONLY
const handleExport1 = async () => {
    const idsArray = Array.from(selectedExportIds.value).map((id) => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading1.value = true;

        const response = await api.postExtra(
            'excel/export-scm-return-order-list',
            { returnorderids_array: JSON.stringify(idsArray) },
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BulkOrder_Download.xlsx';
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
        exportLoading1.value = false;
    }
};
// Export function RECEIVE ONLY
const handleExport2 = async () => {
    const idsArray = Array.from(selectedExportIds.value).map((id) => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading2.value = true;

        const response = await api.postExtra(
            'excel/export-scm-receivereturn-order-list',
            { returnorderids_array: JSON.stringify(idsArray) },
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BulkOrder_Download.xlsx';
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
        exportLoading2.value = false;
    }
};

// Import function PICKUP ONLY
const handleImport1 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading1.value = true;

        const formData = new FormData();
        formData.append('return_order_excel', file);

        const response = await api.postExtra('excel/import-scm-return-order-list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            // Refresh data after import
            await fetchData();

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File imported successfully',
                life: 3000
            });
        } else {
            importErrors.value = response.data.admin_data || [];
            if (importErrors.value.length > 0) {
                showImportErrorHandle1.value = true;
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
        // Reset file input
        if (importInput1.value) {
            importInput1.value.value = '';
        }
    }
};
// Import function RECEIVE ONLY
const handleImport2 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading2.value = true;

        const formData = new FormData();
        formData.append('return_order_excel', file);

        const response = await api.postExtra('excel/import-scm-receivereturn-order-list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            // Refresh data after import
            await fetchData();

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File imported successfully',
                life: 3000
            });
        } else {
            importErrors.value = response.data.admin_data || [];
            if (importErrors.value.length > 0) {
                showImportErrorHandle2.value = true;
                showImportErrorDialog.value = true;
            }
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: response.data.message || 'Server did not confirm success',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading2.value = false;
        // Reset file input
        if (importInput2.value) {
            importInput2.value.value = '';
        }
    }
};
const handleCloseErrorModal = () => {
    importErrors.value = [];
    showImportErrorHandle1.value = false;
    showImportErrorHandle2.value = false;
    showImportErrorDialog.value = false; // optional, v-model handles it
};
const applyFilter = () => {
    const tab = statusTabs[activeTabIndex.value];
    if (tab.submitLabel === 'COMPLETED') {
        // Must have BOTH start & end date
        if (!dateRange.value?.[0] || !dateRange.value?.[1]) {
            // Show message (toast, alert, etc.)
            toast.add({
                severity: 'warn',
                summary: 'Date Range Required',
                detail: 'Please select a full date range for Completed records.',
                life: 3000
            });
            return; // STOP here, do NOT call API
        }
    }
    const dateRangeStr = dateRange.value?.[0] && dateRange.value?.[1] ? `${formatDateDMY(dateRange.value[0])} - ${formatDateDMY(dateRange.value[1])}` : null; // returns "dd/mm/yyyy - dd/mm/yyyy" or null
    const body = {
        tab: tab.submitLabel,
        date_range: dateRangeStr
    };

    fetchData(body);
};
const clearDate = () => {
    dateRange.value = [null, null];
};
const fetchData = async (body = null) => {
    try {
        loading.value = true;
        const payload = body || {
            tab: statusTabs[activeTabIndex.value].submitLabel
        };
        const response = await api.postExtra('scm-return-order-list', payload);
        // console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {

            returnList.value = response.data.admin_data
            .map(collectReturn => ({
                ...collectReturn,

                sapDateSearch: formatDate(collectReturn.sap_timestamp),
                sapTimeSearch: formatTime(collectReturn.sap_timestamp),
                pickupDateSearch: formatDate(collectReturn.delivery_information?.pickup_datetime),
                receiveDateSearch: formatDate(collectReturn.delivery_information?.receive_datetime),
            }))
            .sort((a, b) => new Date(b.sap_timestamp) - new Date(a.sap_timestamp));
        } else {
            returnList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        returnList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
const fetchReport = async (id) => {
    try {
        loading.value = true;
        const response = await api.get(`excel-return-order-detail/${id}`);
        console.log(response)
        if (response.data.status == 1) {
            generateReport(response.data.admin_data);
        }
        else{
        toast.add({
            severity: 'error',
            summary: 'Failed',
            detail: response.data.message || 'Failed to fetch report',
            life: 3000
        });
        }
    } catch (error) {
        console.error('Error fetching report:', error);
    } finally {
        loading.value = false;
    }
}
const exportToExcel = () => {
    const rowsToExport = visibleRows.value || [];

    if (rowsToExport.length === 0) {
        toast.add({severity: 'warn',summary: 'Warning', detail: 'No data to export', life: 3000 });
        return;
    }

    try {
        // Create worksheet data
        const headers = ['Created On','Ref No', 'Ship-To', 'Ship-To Acc No', 'Storage Location', 'City', 'State', 'Pickup Date', 'Receive Date', 'Return Items Qty', 'Status'];

        // Prepare data rows
        const csvData = rowsToExport.map((data) => [
            `"${data.sapDateSearch} ${data.sapTimeSearch}"`,
            `"${data.return_orderNo_ref || '-'}"`,
            `"${data.dealerName || '-'}"`,
            `"${data.custaccountno || '-'}"`,
            `"${data.storageLocation || '-'}"`,
            `"${data.city || '-'}"`,
            `"${data.state || '-'}"`,
            `"${data.pickupDateSearch || 'No date assigned'}"`,
            `"${data.receiveDateSearch || 'No date assigned'}"`,
            `"${data.return_order_array?.reduce((total, item) => total + Number(item.qty || 0),0) || 0}"`,
            `"${data.delivery_status || '-'}"`
        ]);

        // Combine headers and data
        const csvContent = [headers.join(','), ...csvData.map(row => row.join(',')) ].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = `return_order_list_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};
onMounted(() => {
    fetchData();
});
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
function formatTime(dateTimeString) {
    if (!dateTimeString) return '';
    const [, timePart] = dateTimeString.split(' ');
    if (!timePart) return '';

    let [hours, minutes, seconds] = timePart.split(':');
    hours = parseInt(hours, 10);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

function getStatusSeverity(status) {
    switch (status) {
        case 'PENDING':
            return 'info';
        case 'COMPLETED':
            return 'success';
        case 'NEW':
            return 'warning';
        default:
            return 'secondary';
    }
}
const generateReport = (report) => {
    const itemRows = (report.return_order_array || []).map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.materialid || '-'}</td>
            <td>${item.materialdescription || '-'}</td>
            <td>${item.qty || '-'}</td>
        </tr>
    `).join('');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Tyre Return Form</title>
            <style>
                body { 
                    font-family: Arial, 
                    sans-serif; font-size: 13px; 
                    padding: 20px; color: #000; 
                }

                .top-header {                     
                    font-size: 32px;
                    font-weight: 900;
                    color: #d69c00;
                    margin-bottom: 10px; 
                }
                .company-info { 
                    font-size: 14px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    font-weight:bold;
                }
                .sub-company-info { 
                    font-size: 10px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                }

                table { 
                    width: 100%;
                    border-collapse: collapse; 
                    font-size: 12px; 
                }
                th, td { 
                    border: 1px solid #000; 
                    padding: 6px; 
                }
                .small-table td { 
                    padding: 4px;
                }
                .small-table td table td {
                    padding: 2px;
                }
                .item-table td { 
                 text-align: center;
                }
                .section-title { 
                    margin-top: 20px; 
                    font-weight: bold; 
                }
                .note-wrapper {
                    padding-top: 20px; 
                }
                .note-box {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    border: 1px solid #000;
                    padding: 10px;
                    font-size: 12px;
                    text-align: justify;
                    line-height: 1.4;
                }
                .signature-section {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    // margin-top: 20px;
                    display: flex;
                    padding-top: 20px;
                    justify-content: space-between;
                }
                .signature-box {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    height: 150px;
                    width: 30%;
                    border: 1px solid #000;
                    padding: 10px;
                    font-size: 12px;
                    display: flex;
                    flex-direction: column;   /* stack items vertically */
                }
                .signature-line {
                    margin-top: auto;         /* pushes signature to bottom */
                    border-top: 1px solid #000;
                    width: 100%;
                    padding-top: 5px;
                    text-align: center;
                }
            </style>
        </head>
        <body>

            <div class="top-header"><img src="/etenadmin/demo/images/toyo_logo.png" alt="Logo" style="height: 25px; object-fit: contain" /></div>
            <div class="company-info">
                Toyo Tyre Sales And Marketing Malaysia Sdn Bhd <span class="sub-company-info">(Company No: 201501002742 (1128074 - X) )</span><br>
            </div>
            <hr style="border-width: 3px ;color: black;">
            <div class="sub-company-info">
                Level 2, Wisma Comcor, No.37, Jalan Pulas UH6, Section U1, Temasya Industrial Park, 40150 Shah Alam, Selangor Darul Ehsan, Malaysia
            </div>
            <div class="sub-company-info">
                Tel: +603-5569 3788 &nbsp; | &nbsp; Fax: +603-5569 3809
            </div>

            <table class="small-table">
                <tr>
                    <td><strong>CUSTOMER :</strong> ${ report.dealerName ||  '-'}</td>
                    <td><strong>BRANCH :</strong> ${ report.shiptoName ||  '-'}</td>
                    <td><strong>TYRE RETURN FORM</strong></td>
                </tr>
                <tr>
                    <td>
                        <strong>PAY TO :</strong><br>
                        ${ report.dealerAddress ||  '-'}
                         <br>
                        ${report.dealerPhoneNum ||  '-'}<br>
                    </td>

                    <td>
                        <strong>SHIP TO :</strong><br>
                        ${ report.shiptoAddress ||  '-'}
                         <br>
                        ${report.shiptoMobileNum ||  '-'}<br>
                    </td>

                    <td>
                        <table style="border:0;">
                            <tr>
                                <td style="border:0;width: 100px;">REF NO</td>
                                <td style="border:0; width:10px;">:</td>
                                <td style="border:0;">${ report.return_orderNo_ref ||  '-'}</td>
                            </tr>
                            <tr>
                                <td style="border:0;">DOC DATE</td>
                                <td style="border:0;">:</td>
                                <td style="border:0;">${ formatDate(report.sap_timestamp) || '-'} &nbsp; ${ formatTime(report.sap_timestamp) || ''}</td>
                            </tr>
                            <tr>
                                <td style="border:0;width:115px;">RETURN REASON</td>
                                <td style="border:0;">:</td>
                                <td style="border:0;">${ report.reason_message ||  '-'}</td>
                            </tr>
                            <tr>
                                <td style="border:0;width:115px;">RETURN REMARKS</td>
                                <td style="border:0;">:</td>
                                <td style="border:0;">${ report.remarks ||  '-'}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <br>

            <table class="item-table">
                <tr>
                    <th>No</th>
                    <th>Material ID</th>
                    <th>Material Description</th>
                    <th>Qty</th>
                </tr>

                ${ itemRows || `<tr><td colspan="3">-</td></tr>` }
            </table>

            <div class="signature-section">

                <div class="signature-box">
                    <strong>DELIVERY INFO</strong><br>
                    <br><br>
                    <div>TRUCK NO : ${ report.delivery?.driverPlateNo ||  '-'}</div><br>
                    <div>DRIVER NAME : ${ report.delivery?.driverName ||  '-'}</div><br>
                    <div>DRIVER IC :${ report.delivery?.driverIC ||  '-'}</div><br>
                </div>

                <div class="signature-box">
                    <strong>ACKNOWLEDGED BY DEALER</strong><br>
                    <br><br>
                    <div>NAME :</div><br>
                    <div>DATE :</div><br>
                </div>
                            
                <div class="signature-box">
                    <strong>RECEIVED BY WHS</strong><br>
                    <br><br>
                    <div>NAME : </div><br>
                    <div>DATE : </div><br>
                </div>

            </div>

        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
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
