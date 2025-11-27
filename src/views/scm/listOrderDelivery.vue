<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Delivery List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />
            <div class="flex items-center gap-3 mb-4 ml-4">
                <!-- LEFT SIDE -->

                    <Calendar
                        v-model="dateRange"
                        selectionMode="range"
                        dateFormat="dd/mm/yy"
                        placeholder="Select date range"
                        style="width: 390px;"
                    />
                    <Button label="Clear" class="p-button-sm p-button-danger" @click="clearDate" />
                    <Button label="Filter" class="p-button-sm" @click="applyFilter" />

            </div>
            <DataTable
                :value="orderDelList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['do_no', 'eten_user.custAccountNo', 'storagelocation' ,  'eten_user.companyName1', 'eten_user.companyName2', 'eten_user.companyName3', 'eten_user.companyName4', 'eten_user.city', 'eten_user.state', 'deliveryDate',, 'scm_deliver_detail.scheduled_delivery_time', 'scm_deliver_detail.delivered_datetime', 'orderstatus']"
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

                        <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Pending' && canUpdate">
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
                        <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Delivery' && canUpdate">
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
                    </div>
                </template>

                <template #empty> No Order Delivery found. </template>
                <template #loading> Loading Order Delivery data. Please wait. </template>
                <Column v-if="statusTabs[activeTabIndex]?.label !== 'Completed' && canUpdate" header="Export All" style="min-width: 8rem" >
                    <template #header>
                        <div class="flex justify-center">
                        <Checkbox
                            :key="orderDelList.length" 
                            :binary="true"
                            :model-value="allSelected"  
                            @change="() => toggleSelectAll()"  
                        />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                        <Checkbox
                            :binary="true"
                            :model-value="selectedExportIds.has(data.id)"
                            @change="() => handleToggleExport(data.id)"
                        />
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
                        <RouterLink :to="`/scm/detailOrderDelivery/${data.id}`" class="hover:underline font-bold text-primary">
                            {{ data.do_no ? data.do_no : '-' }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="eten_user.companyName1" header="Customer Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{` ${data.eten_user.companyName1} ${data.eten_user.companyName2} ${data.eten_user.companyName3} ${data.eten_user.companyName4} ` }}</span>
                    <br>
                     {{ data.eten_user.custAccountNo }}
                    </template>
                </Column>

                <Column field="storagelocation" header="Storage Location" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                         {{`${data.storagelocation}` }}
                    </template>
                </Column>

                <Column field="eten_user.city" header="City" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                         {{ data.eten_user.city?.replace(/,$/, '') }}
                    </template>
                </Column>
                <Column field="eten_user.state" header="State" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                         {{`${data.eten_user.state}` }}
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

                <Column field="scm_deliver_detail.scheduled_delivery_time" header="Planned Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.scm_deliver_detail?.scheduled_delivery_time ? formatDate(data.scm_deliver_detail.scheduled_delivery_time) : 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="scm_deliver_detail.delivered_datetime" header="Delivered Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                          {{ data.scm_deliver_detail?.delivered_datetime? formatDate(data.scm_deliver_detail.delivered_datetime): 'Not Assigned' }}
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

// Data variables
const activeTabIndex = ref(0);
const selectedExportIds = ref(new Set());

const loading = ref(true);
const orderDelList = ref([]);
const dateRange = ref(null);

const formatDateDMY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const statusTabs = [
    { label: 'Pending',submitLabel: 'PENDING' },
    { label: 'Delivery', submitLabel: 'DELIVERY' },
    { label: 'Completed', submitLabel: 'COMPLETED'}
];

watch(activeTabIndex, () => {
    const tab = statusTabs[activeTabIndex.value];
    if (tab.submitLabel === 'COMPLETED') {
        selectedExportIds.value.clear();
        orderDelList.value = [];
        return;
    }
    fetchData();
    selectedExportIds.value.clear();
});

// Computed boolean: are all rows selected?
const allSelected = computed(() => {
  return orderDelList.value.length > 0 &&
         orderDelList.value.every(item => selectedExportIds.value.has(item.id));
});

const handleToggleExport = (id) => {
  if (selectedExportIds.value.has(id)) {
    selectedExportIds.value.delete(id);
  } else {
    selectedExportIds.value.add(id);
  }
//   console.log(selectedExportIds.value);
};

// Check all
const toggleSelectAll = () => {
  if (allSelected.value) {
    // Unselect all for this tab
    orderDelList.value.forEach(item => {
      selectedExportIds.value.delete(item.id);
    });
  } else {
    // Select all for this tab
    orderDelList.value.forEach(item => {
      selectedExportIds.value.add(item.id);
    });
  }
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
        day: '2-digit',
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
        hour12: true,
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
    // Export function SCHEDULE ONLY
const handleExport1 = async () => {
     const idsArray = Array.from(selectedExportIds.value).map(id => ({ id: Number(id) }));

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
     const idsArray = Array.from(selectedExportIds.value).map(id => ({ id: Number(id) }));

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
  dateRange.value = null; // or []
};
const fetchData = async (body = null) => {
    try {
        loading.value = true;
        const payload = body || {
        tab: statusTabs[activeTabIndex.value].submitLabel
        };
        const response = await api.postExtra('order-delivery/list',payload);
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
        "NEW": 'Pending',
        "PENDING": 'Delivery',
        "COMPLETED": 'Completed',
    };
    return statusMap[status] || `Status: ${status}`;
};
const getStatusSeverity2 = (status) => {
    const severityMap = {
        "NEW": 'info',
        "PENDING": 'warning',
        "COMPLETED": 'success',
    };
    return severityMap[status] || 'secondary';
};
</script>
