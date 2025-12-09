<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Self Order Pickup List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />
            <div class="flex items-center gap-3 mb-4 ml-4">
                <!-- LEFT SIDE -->

                <Calendar v-model="dateRange" selectionMode="range" dateFormat="dd/mm/yy" placeholder="Select date range" style="width: 390px" />
                <Button label="Clear" class="p-button-sm p-button-danger" @click="clearDate" />
                <Button label="Filter" class="p-button-sm" @click="applyFilter" />
            </div>
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
                :globalFilterFields="[
                    'do_no',
                    'eten_user.custAccountNo',
                    'eten_user.companyName1',
                    'eten_user.companyName2',
                    'eten_user.companyName3',
                    'eten_user.companyName4',
                    'eten_user.storageLocation',
                    'eten_user.city',
                    'eten_user.state',
                    'deliveryType',
                    'orderstatus'
                ]"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <template #header>
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
                            <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading" @click="handleExport" />
                            <Button type="button" label="Bulk Update" icon="pi pi-file-import" @click="importInput?.click()" :loading="importLoading" />
                            <input ref="importInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport" />
                        </div>
                        <div class="flex justify-end gap-2" v-if="statusTabs[activeTabIndex]?.label === 'Completed'">
                            <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="exportToExcel" />
                        </div>
                    </div>
                </template>

                <template #empty> No Order Pickup found. </template>
                <template #loading> Loading Order Pickup data. Please wait. </template>
                <Column v-if="statusTabs[activeTabIndex]?.label !== 'Completed' && canUpdate" header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :key="orderDelList.length" :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="selectedExportIds.has(data.id)" @change="() => handleToggleExport(data.id)" />
                        </div>
                    </template>
                </Column>
                <Column field="created" header="Create Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.created) }}
                    </template>
                </Column>

                <Column field="do_no" header="SAP DO No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailOrderPickup/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.do_no ? data.do_no : '-' }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="eten_user.companyName1" header="Customer Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{ ` ${data.eten_user?.companyName1 || '-'} ${data.eten_user?.companyName2 || ''} ${data.eten_user?.companyName3 || ''} ${data.eten_user?.companyName4 || ''} ` }}</span>
                        <br />
                        {{ data.eten_user?.custAccountNo }}
                    </template>
                </Column>
                <Column field="eten_user.storageLocation" header="Storage Location" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.eten_user?.storageLocation ? data.eten_user.storageLocation : '-' }}
                    </template>
                </Column>
                <Column field="eten_user.city" header="City" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.eten_user?.city?.replace(/,$/, '') ?? '-' }}
                    </template>
                </Column>
                <Column field="eten_user.state" header="State" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.eten_user?.state ? data.eten_user.state : '-' }}
                    </template>
                </Column>
                <Column field="driverInformation.driverName" header="Collector" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <div v-if="data.driverInformation">
                            <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                                <div class="flex">
                                    <span>{{ data.driverInformation?.driverName || '-' }}</span>
                                </div>
                                <div class="flex">
                                    <span>{{ data.driverInformation?.driverIC || '-' }}</span>
                                </div>
                                <div class="flex">
                                    <span>{{ data.driverInformation?.driverPhoneNumber || '-' }}</span>
                                </div>
                                <div class="flex">
                                    <span>{{ data.driverInformation?.driverTruckPlate || '-' }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else>Not Assigned</div>
                    </template>
                </Column>
                <Column field="deliveryType" header="Pickup Type" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.deliveryType }}
                    </template>
                </Column>
                <Column field="driverInformation.pickup_datetime" header="Pickup Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.driverInformation?.pickup_datetime ? formatDate(data.driverInformation.pickup_datetime) : 'Not Assigned' }}
                    </template>
                </Column>
                <Column field="orderstatus" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusLabel2(data.status)" :severity="getStatusSeverity2(data.status)" />
                    </template>
                </Column>
                <Column v-if="showPickupColumn && canUpdate" field="" header="Action" style="min-width: 10rem">
                    <template #body="{ data }">
                        <!-- <div v-if="!data.driverInformation" class="flex justify-center">
                            <Button icon="pi pi-pencil" class="p-button-sm p-button-text p-button-warning" @click="confirmUpdatePickup(data)" />
                        </div> -->
                        <div v-if="data.deliveryType != 'LALAMOVE'" class="flex justify-center">
                            <Button icon="pi pi-calendar" class="p-button-sm p-button-text p-button-warning" @click="promptUpdatePickup(data)" />
                        </div>
                        <div v-else class="flex justify-center">
                            <Button icon="pi pi-calendar" class="p-button-sm p-button-text p-button-warning" @click="confirmUpdatePickup2(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="showIcDialog" header="Update Collector Information" modal :style="{ width: '50rem' }">
        <div class="flex flex-col gap-3 w-full">
            <div class="font-semibold">SAP DO No: {{ selectedData?.do_no }}</div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Collector IC Number</label>
                    <InputText v-model="form.driverIC" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Collector Driver Name</label>
                    <InputText v-model="form.driverName" placeholder="Enter Driver Name" class="w-full" />
                </div>
            </div>
            <div class="grid md:grid-cols-2 mb-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Collector Contact Number</label>
                    <InputText v-model="form.driverPhoneNum" placeholder="Enter Contact Number" maxlength="15" class="w-full" @keypress="allowOnlyNumbers" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Collector Plate No</label>
                    <InputText v-model="form.driverPlateNum" placeholder="Enter Plate No" maxlength="8" class="w-full" />
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="handleCloseDialog" />
            <Button label="Confirm" @click="submitPickupUpdate" />
        </template>
    </Dialog>
    <Dialog v-model:visible="showIcDialog2" header="Update Pickup Date" modal :style="{ width: '30rem' }">
        <div class="flex flex-col gap-3 w-full">
            <div class="font-semibold">SAP DO No: {{ selectedData?.do_no }}</div>

            <div>
                <label class="block mb-4 font-medium w-full">Collector IC Number</label>
                <InputText v-model="icNo" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="handleCloseDialog2" />
            <Button label="Confirm" @click="submitPickupUpdate2" />
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
import { useConfirm } from 'primevue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Order Pickup'));
const denyAccess = computed(() => menuStore.canTest('Order Pickup'));

const showIcDialog = ref(false);
const showIcDialog2 = ref(false);
const icNo = ref('');
const form = ref({
    driverIC: '',
    driverName: '',
    driverPhoneNum: '',
    driverPlateNum: ''
});
let selectedData = null;

const loading = ref(true);
const orderDelList = ref([]);
const activeTabIndex = ref(0);
const dateRange = ref(null);

const exportLoading = ref(false);
const importLoading = ref(false);
const importInput = ref();

const selectedExportIds = ref(new Set());
const visibleRows = ref(orderDelList.value);
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

const showPickupColumn = computed(() => {
    return orderDelList.value.some((item) => !item.driverInformation?.pickup_datetime);
});

const statusTabs = [
    { label: 'Pending', submitLabel: 'PENDING' },
    { label: 'Completed', submitLabel: 'COMPLETED' }
];

const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
    }
};
const onTableFilter = (event) => {
    // Update visibleRows whenever filtering happens
    visibleRows.value = event.filteredValue || orderDelList.value;
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
const handleExport = async () => {
    const idsArray = Array.from(selectedExportIds.value).map((id) => ({ id: Number(id) }));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading.value = true;

        const response = await api.postExtra(
            'excel/export-selfpickup',
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
        a.download = 'SelfPickup_Download.xlsx';
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
// Import function PICKUP ONLY
const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading.value = true;

        const formData = new FormData();
        formData.append('order_collect_excel', file);

        const response = await api.postExtra('excel/import-selfpickup', formData, {
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
        importLoading.value = false;
        // Reset file input
        if (importInput.value) {
            importInput.value.value = '';
        }
    }
};

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
        dateRange.value = null;
        fetchData();
    }
    selectedExportIds.value.clear();
});

onMounted(async () => {
    fetchData();
});

const toast = useToast();
const confirmation = useConfirm();

const handleIcInput = (e) => {
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // ⛔ block non-digits
    }
};

const allowOnlyNumbers = (event) => {
    const key = event.key;

    // allow digits
    if (/[0-9]/.test(key)) return;

    // allow "-"
    if (key === '-') return;

    // block everything else
    event.preventDefault();
};

const confirmUpdatePickup = (data) => {
    selectedData = data;
    form.value.driverIC = '';
    form.value.driverName = '';
    form.value.driverPhoneNum = '';
    form.value.driverPlateNum = '';
    showIcDialog.value = true;
};

const handleCloseDialog = () => {
    form.value.driverIC = '';
    form.value.driverName = '';
    form.value.driverPhoneNum = '';
    form.value.driverPlateNum = '';
    selectedData = null;
    showIcDialog.value = false;
};

const submitPickupUpdate = async () => {
    if (!form.value.driverIC || form.value.driverIC.length !== 12) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid IC No',
            detail: 'IC Number must be exactly 12 digits.',
            life: 3000
        });
        return;
    }
    try {
        const payload = new FormData();
        // payload.append('orderno', selectedData.order_no);
        payload.append('driverIC', form.value.driverIC);
        payload.append('driverName', form.value.driverName);
        payload.append('driverPhoneNum', form.value.driverPhoneNum);
        payload.append('driverPlateNum', form.value.driverPlateNum);
        // return;
        const res = await api.post(`order/driver-information-scm/${selectedData.order_no}`, payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date collecter information updated', life: 3000 });
            fetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        handleCloseDialog();
    }
};

const confirmUpdatePickup2 = (data) => {
    selectedData = data;
    icNo.value = '';
    showIcDialog2.value = true;
};

const handleCloseDialog2 = () => {
    icNo.value = '';
    selectedData = null;
    showIcDialog2.value = false;
};

const submitPickupUpdate2 = async () => {
    if (!icNo.value || icNo.value.length !== 12) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid IC No',
            detail: 'IC Number must be exactly 12 digits.',
            life: 3000
        });
        return;
    }
    try {
        const payload = new FormData();
        payload.append('orderno', selectedData.order_no);
        payload.append('collectoric', icNo.value);

        const res = await api.post('update-collect-time', payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date set to now', life: 3000 });
            fetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        handleCloseDialog2();
    }
};
const promptUpdatePickup = (data) => {
  confirmation.require({
    message: `Are you sure you want to confirm pickup for order ${data.order_no} ?`,
    header: 'Pickup Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: async () => {
      try {
        const payload = new FormData();
        payload.append('orderno', data.order_no);

        const res = await api.post('update-collect-time', payload);

        if (res.data?.status === 1) {
          toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date set to now', life: 3000 });
          InitfetchData(); // refresh table
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
      } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
      }
    },
    reject: () => {
      // optional action on cancel
    }
  });
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
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
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
    dateRange.value = null; // or []
};
const fetchData = async (body = null) => {
    try {
        loading.value = true;
        const payload = body || {
            tab: statusTabs[activeTabIndex.value].submitLabel
        };
        const response = await api.postExtra('order-pickup/list', payload);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            orderDelList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            orderDelList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        orderDelList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const exportToExcel = () => {
    if (orderDelList.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No data to export', life: 3000 });
        return;
    }

    try {
        // Create worksheet data
        const headers = ['Created', 'SAP DO No', 'Customer Name', 'Customer Acc No', 'Storage Location', 'City', 'State', 'Collecter Name', 'Collecter IC', 'Collecter Contact No', 'Collecter Truck Plate', 'Type', 'Pickup Date', 'Status'];

        // Prepare data rows
        const csvData = orderDelList.value.map((data) => [
            `"${formatDate(data.created)}"`,
            `"${data.do_no || '-'}"`,
            `"${data.eten_user?.companyName1} ${data.eten_user?.companyName2} ${data.eten_user?.companyName3} ${data.eten_user?.companyName4}"`,
            `"${data.eten_user?.custAccountNo || '-'}"`,
            `"${data.eten_user?.storageLocation || '-'}"`,
            `"${data.eten_user?.city || '-'}"`,
            `"${data.eten_user?.state || '-'}"`,
            `"${data.driverInformation?.driverName || '-'}"`,
            `"${data.driverInformation?.driverIC || '-'}"`,
            `"${data.driverInformation?.driverPhoneNumber || '-'}"`,
            `"${data.driverInformation?.driverTruckPlate || '-'}"`,
            `"${data.deliveryType || '-'}"`,
            `"${data.driverInformation?.pickup_datetime ? formatDate(data.driverInformation?.pickup_datetime) : 'No date assigned'}"`,
            `"${getStatusLabel2(data.status) || '-'}"`
        ]);

        // Combine headers and data
        const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `order_pickup_list_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

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
        0: 'warn',
        1: 'success',
        66: 'info',
        77: 'primary'
    };
    return map[status] || 'secondary';
}
const getStatusLabel2 = (status) => {
    const statusMap = {
        PENDING: 'Pending',
        // "PENDING": 'Delivery',
        COMPLETED: 'Completed'
    };
    return statusMap[status] || `Status: ${status}`;
};
const getStatusSeverity2 = (status) => {
    const severityMap = {
        PENDING: 'info',
        // "PENDING": 'warn',
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
