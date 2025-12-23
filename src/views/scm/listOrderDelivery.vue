<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Delivery List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />
            <DataTable
                :value="orderDelList"
                @filter="onTableFilter"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                class="rounded-table"
                :globalFilterFields="['do_no','order_no', 'created', 'customer_name', 'custAccountNo', 'storagelocation', 'customer_name', 'city', 'state', 'deliveryDate', 'orderDesc', 'scheduled_delivery_time', 'delivered_datetime', 'orderstatus']"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>

                            <div class="flex justify-end gap-2" v-if="statusTabs[activeTabIndex]?.label === 'Pending' && canUpdate">
                                <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading1" @click="handleExport1" />
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" @click="importInput1?.click()" :loading="importLoading1" />
                                <input ref="importInput1" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport1" />
                            </div>
                            <div class="flex justify-end gap-2" v-if="statusTabs[activeTabIndex]?.label === 'Delivery' && canUpdate">
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

                <template #empty> No Order Delivery found. </template>
                <template #loading> Loading Order Delivery data. Please wait. </template>
                <Column v-if="statusTabs[activeTabIndex]?.label !== 'Completed' && canUpdate" header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :key="orderDelList.length" :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="selectedExportIds.has(data.orderID)" @change="() => handleToggleExport(data.orderID)" />
                        </div>
                    </template>
                </Column>
                <Column field="created" header="Created On" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data?.created) ?? '-' }}
                        <br/>
                        {{ formatTime(data?.created) ?? '-' }}
                    </template>
                </Column>
                <Column field="order_no" header="Ref No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.order_no }}
                    </template>
                </Column>
                <Column field="do_no" header="SAP DO No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailOrderDelivery/${data.orderID}`" class="hover:underline font-bold text-primary">
                            {{ data.do_no ? data.do_no : '-' }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{ ` ${data.customer_name || ''} ` }}</span>
                        <br />
                        {{ data.custAccountNo || '-' }}
                    </template>
                </Column>

                <Column field="storagelocation" header="Storage Location" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.storagelocation }}
                    </template>
                </Column>

                <Column field="city" header="City" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.city?.replace(/,$/, '') }}
                    </template>
                </Column>
                <Column field="state" header="State" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.state || '-' }}
                    </template>
                </Column>

                <Column field="orderDesc" header="Order Type" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.orderDesc }}
                    </template>
                </Column>

                <Column field="deliveryDate" header="ETA Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.deliveryDate ? formatDate(data.deliveryDate) : 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="scheduled_delivery_time" header="Planned Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.scheduled_delivery_time ? formatDate(data.scheduled_delivery_time) : 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="delivered_datetime" header="Delivered Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.delivered_datetime ? formatDate(data.delivered_datetime) : 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusLabel2(data.status)" :severity="getStatusSeverity2(data.status)" />
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
                    DO No: {{ item.do_no }}
                </div>
                <div  v-if="showImportErrorHandle1" class="text-sm text-gray-600">
                    Schedule Date: {{ item.scheduled_date_raw || 'Not Assigned' }}
                </div>
                <div  v-if="showImportErrorHandle2" class="text-sm text-gray-600">
                    Delivered Date: {{ item.delivered_date_raw || 'Not Assigned' }}
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
import { ref, computed, onBeforeMount, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { RouterLink } from 'vue-router';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Order Delivery'));
const denyAccess = computed(() => menuStore.canTest('Order Delivery'));
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
const activeTabIndex = ref(0);
const selectedExportIds = ref(new Set());

const loading = ref(true);
const orderDelList = ref([]);
const dateRange = ref([null, null]);
const visibleRows = computed(() => orderDelList.value);

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
    { label: 'Pending', submitLabel: 'PENDING' },
    { label: 'Delivery', submitLabel: 'DELIVERY' },
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
    //   console.log(selectedExportIds.value);
};

const onTableFilter = (event) => {
    // Update visibleRows whenever filtering happens
    visibleRows.value = event.filteredValue || orderDelList.value;
};

// Toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map(item => item.orderID);

    if (isAllSelected()) {
        // Remove all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value].filter(orderID => !allIds.includes(orderID)));
    } else {
        // Add all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// Computed: are all visible rows selected?
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every(item => selectedExportIds.value.has(item.id));
};

onMounted(async () => {
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

    return timePart; // already in 24-hour format: HH:mm:ss
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
    const idsArray = Array.from(selectedExportIds.value).map((id) => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    // console.log("export 1",idsArray);
    try {
        exportLoading1.value = true;

        const response = await api.postExtra(
            'excel/export-schedule-order',
            { orderids_array: JSON.stringify(idsArray) },
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
        a.download = 'BulkPlannedDate_Download.xlsx';
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
    const idsArray = Array.from(selectedExportIds.value).map((id) => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    // console.log("export 2",idsArray);
    try {
        exportLoading2.value = true;

        const response = await api.postExtra(
            'excel/export-delivered-order',
            { orderids_array: JSON.stringify(idsArray) },
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
        a.download = 'BulkDeliveredDate_Download.xlsx';
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
    // console.log("import 1",file);
    try {
        importLoading1.value = true;

        const formData = new FormData();
        formData.append('order_schedule_excel', file);

        const response = await api.postExtra('excel/import-schedule-order', formData, {
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
// Import function RECIEVE ONLY
const handleImport2 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // console.log("import 2",file);
    try {
        importLoading2.value = true;

        const formData = new FormData();
        formData.append('order_schedule_excel', file);

        const response = await api.postExtra('excel/import-delivered-order', formData, {
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
                detail: response.data.message || 'Failed to import data',
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
        const response = await api.postExtra('order-delivery/list', payload);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            orderDelList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
        } else {
        orderDelList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const exportToExcel = () => {
    const rowsToExport = visibleRows.value || [];

    if (rowsToExport.length === 0) {
        toast.add({severity: 'warn',summary: 'Warning', detail: 'No data to export', life: 3000 });
        return;
    }

    try {
    const headers = ['Created On', 'Ref No', 'SAP DO No', 'Customer Name', 'Customer Acc No', 'Storage Location','City', 'State', 'Order Type', 'Driver Name', 'Driver IC', 'Driver Contact','Driver Truck Plate', 'Eta Date', 'Planned Date', 'Delivered Date', 'Status','Item No','Pattern Name', 'Description', 'Qty'];

    const csvData = [];

    rowsToExport.forEach(data => {
        const baseRow = [
            `"${formatDate(data.created)} ${formatTime(data.created)}"`,
            `"${data.order_no || '-'}"`,
            `"${data.do_no || '-'}"`,
            `"${data.customer_name || ''} "`,
            `"${data.custAccountNo || '-'}"`,
            `"${data.storagelocation || '-'}"`,
            `"${data.city || '-'}"`,
            `"${data.state || '-'}"`,
            `"${data.orderDesc || '-'}"`,
            `"${data.driverName || '-'}"`,
            `"${data.driverIC || '-'}"`,
            `"${data.driverContactNo || '-'}"`,
            `"${data.driverPlateNo || '-'}"`,
            `"${formatDate(data.deliveryDate)}"`,
            `"${data.scheduled_delivery_time ? formatDate(data.scheduled_delivery_time) : 'No date assigned'}"`,
            `"${data.delivered_datetime ? formatDate(data.delivered_datetime) : 'No date assigned'}"`,
            `"${getStatusLabel2(data.status) || '-'}"`,
        ];

            // FIX: prevent undefined forEach
            (data.fullfill_items || []).forEach(item => {
                csvData.push([
                    ...baseRow,
                    `"${item.itemno || '-'}"`,
                    `"${item.patternName || '-'}"`,
                    `"${item.materialdescription || '-'}"`,
                    `"${parseFloat(item.qty) || '-'}"`
                ]);
            });
        });

        const csvContent = [headers.join(','), ...csvData.map(row => row.join(',')) ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = `order_delivery_list_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};
// Status Label and Severity
function getStatusLabel(status) {
    const map = {
        0: 'Pending',
        1: 'Completed',
        66: 'Processing',
        77: 'Delivery'
    };
    return map[status] || 'Unknown';
}

function getStatusSeverity(status) {
    const map = {
        0: 'warning',
        1: 'success',
        66: 'info',
        77: 'primary'
    };
    return map[status] || 'secondary';
}
const getStatusLabel2 = (status) => {
    const statusMap = {
        NEW: 'Pending',
        PENDING: 'Delivery',
        COMPLETED: 'Completed'
    };
    return statusMap[status] || `Status: ${status}`;
};
const getStatusSeverity2 = (status) => {
    const severityMap = {
        NEW: 'info',
        PENDING: 'warning',
        COMPLETED: 'success'
    };
    return severityMap[status] || 'secondary';
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
