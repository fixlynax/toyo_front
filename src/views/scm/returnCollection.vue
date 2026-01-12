<template>
    <div class="card">
            <div class="text-2xl font-bold text-gray-800">CTC Return List</div>
        <LoadingPage v-if="loading" message="Loading Return CTC Collection Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />
            <DataTable
                :value="collectionList"
                @filter="onTableFilter"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                class="rounded-table"
                removableSort
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['claimRefno', 'createDateSearch', 'createTimeSearch', 'custname', 'custaccountno','city','storagelocation','state', 'deliveryDateSearch', 'deliveredDateSearch', 'status', 'deliveryDate']"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <!-- ========================= -->
                <!-- Header Section -->
                <!-- ========================= -->
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <!-- Left: Search Field + Cog Button -->
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>

                            <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'New' && canUpdate">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading1" @click="handleExport1"/>
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" @click="importInput1?.click()":loading="importLoading1" />
                                <input 
                                ref="importInput1"
                                type="file" 
                                accept=".xlsx,.xls" 
                                style="display: none" 
                                @change="handleImport1"
                                />
                            </div>
                            <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Pending' && canUpdate">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading2" @click="handleExport2"/>
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" @click="importInput2?.click()":loading="importLoading2" />
                                <input 
                                ref="importInput2"
                                type="file" 
                                accept=".xlsx,.xls" 
                                style="display: none" 
                                @change="handleImport2"
                                />
                            </div>
                            <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Completed'">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="exportToExcel"/>
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
                
                <template #empty> No return records found. </template>
                <template #loading> Loading return data. Please wait. </template>
                <Column v-if="statusTabs[activeTabIndex]?.label !== 'Completed' && canUpdate" header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :key="collectionList.length" :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                        <Checkbox
                            :binary="true"
                            :model-value="selectedExportIds.has(data?.claimID)"
                            @change="() => handleToggleExport(data?.claimID)"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="created" header="Created On" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.createDateSearch ?? '-' }}
                        <br/>
                        {{ data.createTimeSearch ?? '-' }}
                    </template>
                </Column>

                <Column field="claimRefNo" header="Ref No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailReturnList/${data?.id}`" class="hover:underline font-bold text-primary">
                            {{ data?.claimRefno ?? '-' }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="custname" header="Ship-To" dataType="date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{ data?.custname || '-' }}</span>
                        <br />
                        {{ data?.custaccountno ?? '-' }}
                    </template>
                </Column>
                <Column field="storagelocation" header="Storage Location" style="max-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data?.storagelocation ?? '-' }}
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
                <Column field="deliveryDateSearch" header="Delivery Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.deliveryDateSearch || 'Not Assigned' }}
                    </template>
                </Column>
                <Column field="deliveredDateSearch" header="Delivered Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.deliveredDateSearch || 'Not Assigned'}}
                    </template>
                </Column>
                <Column field="action" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusText(data.status)" :severity="getStatusSeverity(data.status)" />
                    </template>
                </Column>
                <Column field="report" header="Report" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button 
                            icon="pi pi-print" 
                            class="p-button-text p-button-sm" 
                            @click="fetchReport(data.warrantyEntryID)" 
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
                    Warranty Order No: {{ item.warranty_order_no }}
                </div>
                <div v-if="showImportErrorHandle1" class="text-sm text-gray-600">
                    Schedule Date: {{ item.schedule_date_raw || 'Not Assigned' }}
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
import { onMounted, ref, watch, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';
import LoadingPage from '@/components/LoadingPage.vue';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('CTC Return'));
const denyAccess = computed(() => menuStore.canTest('CTC Return'));

const toast = useToast();
const exportLoading1 = ref(false);
const importLoading1 = ref(false);
const exportLoading2 = ref(false);
const importLoading2 = ref(false);
const importInput1 = ref();
const importInput2 = ref();
const importErrors = ref([]);
const showImportErrorDialog = ref(false);
const showImportErrorHandle1 = ref(false);
const showImportErrorHandle2 = ref(false);

// Data variables
const loading = ref(true);
const reportloading = ref(false);

const collectionList = ref([]);

const activeTabIndex = ref(0);
const dateRange = ref([null, null]);
const visibleRows = ref([]);
watch(collectionList, (newVal) => {
    collectionList.value = newVal;
}, { immediate: true });
const formatDateDMY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const selectedExportIds = ref(new Set());
// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const statusTabs = [
    { label: 'New',submitLabel: 'NEW'},
    { label: 'Pending',submitLabel: 'PENDING'},
    { label: 'Completed',submitLabel: 'COMPLETED'}
];

watch(activeTabIndex, () => {
    const tab = statusTabs[activeTabIndex.value];
    if (tab.submitLabel === 'COMPLETED') {
        // Set default date range: last 7 days until today
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        dateRange.value = [lastWeek, today];
        const dateRangeStr =
            dateRange.value?.[0] && dateRange.value?.[1]
                ? `${formatDateDMY(dateRange.value[0])} - ${formatDateDMY(dateRange.value[1])}`
                : null;

        // Prepare request body
        const body = {
            tab: tab.submitLabel,
            date_range: dateRangeStr
        };
        fetchData(body);
    }else{
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
    visibleRows.value = event.filteredValue || collectionList.value;
};

// Toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map(item => item.claimID);

    if (isAllSelected()) {
        // Remove all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value].filter(claimID => !allIds.includes(claimID)));
    } else {
        // Add all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// Computed: are all visible rows selected?
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every(item => selectedExportIds.value.has(item.claimID));
};


function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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
// Export function SCHEDULE ONLY
const handleExport1 = async () => {
     const idsArray = Array.from(selectedExportIds.value).map(id => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading1.value = true;
        
            const response = await api.postExtra(
            'excel/export-schedule-warranty',
        { warrantyentryids_array: JSON.stringify(idsArray) },
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
        a.download = 'BulkReturnSchedule_Download.xlsx';
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
// Export function RECIEVE ONLY
const handleExport2 = async () => {
     const idsArray = Array.from(selectedExportIds.value).map(id => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading2.value = true;
        
            const response = await api.postExtra(
            'excel/export-receive-warranty',
        { warrantyentryids_array: JSON.stringify(idsArray) },
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
        a.download = 'BulkReturnReceive_Download.xlsx';
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

// Import function SCHEDULE ONLY
const handleImport1 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        importLoading1.value = true;
        
        const formData = new FormData();
        formData.append('warranty_excel', file);
        
        const response = await api.postExtra('excel/import-schedule-warranty', formData, {
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
            } 
        else {
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
// Import function RECIEVE ONLY
const handleImport2 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        importLoading2.value = true;
        
        const formData = new FormData();
        formData.append('warranty_excel', file);
        
        const response = await api.postExtra('excel/import-receive-warranty', formData, {
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
                detail: response.data.error || 'Failed to import data',
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
  const dateRangeStr = dateRange.value?.[0] && dateRange.value?.[1]? `${formatDateDMY(dateRange.value[0])} - ${formatDateDMY(dateRange.value[1])}`: null// returns "dd/mm/yyyy - dd/mm/yyyy" or null
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
        const response = await api.postExtra('return/list',payload);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
             collectionList.value = response.data.admin_data
            .map(collect => ({
                ...collect,

                createDateSearch: formatDate(collect.created),
                createTimeSearch: formatTime(collect.created),
                deliveryDateSearch: formatDate(collect.scheduleDeliveryDate),
                deliveredDateSearch: formatDate(collect.deliveryDate),
            }))
            .sort((a, b) => new Date(b.created) - new Date(a.created));

        } else {
            collectionList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        collectionList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
const fetchReport = async (id) => {
    try {
        reportloading.value = true;
        const response = await api.get(`warrantyReport/ctc/${id}`);
        if (response.data.status === 1) {
            generateReport(response.data.report_data);
        }else{
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
        reportloading.value = false;
    }
}
const generateReport = (report) => {
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <html>
        <head>
            <title>CTC Return Collection - ${report.claim_no}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    color: #000;
                }
                .header-logo {
                    font-size: 32px;
                    font-weight: 900;
                    color: #d69c00;
                    margin-bottom: 10px;
                }
                .sub-header {
                    font-size: 14px;
                    margin-top: -5px;
                    font-weight:bold;
                }
                .title-box {
                    border: 2px solid #000;
                    padding: 8px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 10px;
                }
                .flex-box {
                    display: flex;
                    border: 1px solid #000;
                    margin-top: 20px;
                    min-height: 160px;
                }
                .left-box {
                    flex: 2;
                    padding: 10px;
                    font-size: 13px;
                    border-right: 1px solid #000;
                    text-align: justify;
                }
                .right-box {
                    flex: 1;
                    padding: 10px;
                    font-size: 13px;
                }
                .signature-line {
                    margin-top: 80px;
                    border-top: 1px solid #000;
                    width: 250px;
                    font-size: 12px;
                }
                .dealer-line {
                    margin-top: 5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 13px;
                }
                th {
                    border: 1px solid #000;
                    text-align: center;
                    padding: 6px;
                    font-weight: bold;
                }
                td {
                    border: 1px solid #000;
                    text-align: center;
                    padding: 6px;
                }
                /* NEW STYLES FOR STORE USE SECTION */
                .store-use-container {
                    border: 1px solid #000;
                    margin-top: 30px;
                }
                .store-use-header {
                    border-bottom: 1px solid #000;
                    padding: 6px;
                    text-align: center;
                    font-weight: bold;
                }
                .store-use-content {
                    display: flex;
                    min-height: 160px;
                }
                .store-left {
                    flex: 1;
                    padding: 10px;
                    border-right: 1px solid #000;
                    font-size: 13px;
                    line-height: 1.45;
                    text-align: justify;
                }
                .store-right {
                    flex: 1;
                }
                .store-top {
                    padding: 10px;
                    font-size: 13px;
                }

                .store-bottom {
                    padding: 10px;
                    font-size: 13px;
                }
                .line-input {
                    display: inline-block;
                    border-bottom: 1px solid #000;
                    width: 180px;
                    height: 12px;
                }
                .separator {
                    border: none;
                    border-top: 1px solid #000;
                }
            </style>
        </head>
        <body>

            <div class="header-logo"><img src="/demo/images/toyo_logo.png" alt="Logo" style="height: 25px; object-fit: contain"/></div>
            <div class="sub-header">Toyo Tyre Sales And Marketing Malaysia Sdn Bhd <span class="sub-company-info">(Company No: 201501002742 (1128074 - X) )</span></div>

            <div class="title-box">CLAIM TIRE COLLECTION <span style="color:red;">(RETURN)</span></div>
            <div class="flex-box">
                <div class="left-box">
                    I hereby certify that the below tyre(s) has / have Not been claimed earlier and authorized TSM
                    (Toyo Sales & Marketing Sdn Bhd) the Right to cut Or do manners it deem fit in order to examine the
                    below tyre(s)
                    
                    <div class="signature-line"><div class="dealer-line">Dealer Authorised Signature</div></div>
                </div>

                <div class="right-box">
                    <strong>CTC No:</strong> ${report.claim_no || '-'}<br><br>
                    <strong>CLAIM STATUS:</strong> CTC RETURN <br><br>
                    <strong>Dealer Name & Address:</strong><br>
                    ${report.dealerName || '-'}<br>
                    ${report.dealerAddress.replace(/\n/g, "<br>") || '-'}
                </div>
            </div>

            <table>
                <tr>
                    <th>ITEM NO</th>
                    <th>TIRE SIZE</th>
                    <th>SERIAL NUMBER</th>
                    <th>WC NUMBER</th>
                    <th>REMARKS</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>${report.material_desc || "-"}</td>
                    <td>${report.serial_no || '-'}</td>
                    <td>${report.claim_no || '-'}</td>
                    <td>${report.remarks || "-"}</td>
                </tr>
            </table>
            <br>

            <!-- FOR STORE USE SECTION -->
            <div class="store-use-container">
                
                <div class="store-use-header">FOR STORE USE</div>

                <div class="store-use-content">

                    <!-- LEFT SIDE -->
                    <div class="store-left">
                        <strong>NOTE</strong><br>
                        PLEASE NOTE
                        THAT THE TYRE HAS BEEN COLLECTED FOR INSPECTION AS PART OF THE CLAIM
                        ASSESSMENT PROCESS. THE TYRE WILL BE EXAMINED TO ASSESS COMPLIANCE WITH
                        MANUFACTURER AND POLICY GUIDELINES. THIS PROCESS IS CARRIED OUT IN ACCORDANCE
                        WITH THE APPLICABLE TERMS AND CONDITIONS OF THE CLAIM. THE INSPECTION FINDINGS
                        WILL DETERMINE CLAIM ELIGIBILITY, AND THE TYRE MAY NOT BE RETURNED IF THE TYRE IS
                        DEEMED CLAIMABLE.
                    </div>

                    <!-- RIGHT SIDE -->
                    <div class="store-right">
    
                        <!-- TOP BLOCK -->
                        <div class="store-top">
                            <strong>Branch Asst / Storehand</strong><br><br>
                            <div>Name: </div> <br>
                            <div>Date: </div> <br>
                        </div>

                        <div class="separator"></div>

                        <!-- BOTTOM BLOCK -->
                        <div class="store-bottom">
                            <strong>Lorry :</strong> <br><br>
                            <div>Driver Name: </div> <br>
                            <div>Date: </div> <br>
                            <div>IC No: </div> <br>
                        </div>

                    </div>

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
const exportToExcel = () => {
    const rowsToExport = visibleRows.value || [];

    if (rowsToExport.length === 0) {
        toast.add({severity: 'warn',summary: 'Warning', detail: 'No data to export', life: 3000 });
        return;
    }

    try {
        // Create worksheet data
        const headers = ['Created On', 'Ref No', 'Customer Name', 'Customer Acc No', 'Storage Location', 'City', 'State', 'Delivery Date', 'Delivered Date', 'Status'];
        
        // Prepare data rows
        const csvData = rowsToExport.map(data => [
            `"${data.createDateSearch} ${data.createTimeSearch}"`,
            `"${data.claimRefno || '-'}"`,
            `"${data.custname || '-'}"`,
            `"${data.custaccountno || '-'}"`,
            `"${data.storagelocation || '-'}"`,
            `"${data.city?.replace(/,$/, '') || '-'}"`,
            `"${data.state || '-'}"`,
            `"${data.deliveryDateSearch || 'Not Assigned'}"`,
            `"${data.deliveredDateSearch || 'Not Assigned'}"`,
            `"${getStatusText(data.status) || '-'}"`,
        ]);

        // Combine headers and data
        const csvContent = [headers.join(','), ...csvData.map(row => row.join(',')) ].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.href = url;
        link.download = `ctc_return_collection_list_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};
// =========================
// Helper functions for status display
// =========================
function getStatusSeverity(status) {
    const severityMap = {
        0: 'warning',
        1: 'info',
        2: 'success',
    };
    return severityMap[status] || 'secondary';
}
function getStatusText(status) {
    const statusMap = {
        0: 'New',
        1: 'Pending',
        2: 'Completed'
    };
    return statusMap[status] || 'Unknown';
}
    onMounted(async () => {
        fetchData();
    });
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