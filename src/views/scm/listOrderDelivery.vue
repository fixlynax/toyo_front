<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Delivery List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />
            <DataTable
                :value="filteredList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['do_no', 'eten_user.custAccountNo', 'storagelocation' ,  'eten_user.companyName1', 'eten_user.companyName2', 'eten_user.companyName3', 'eten_user.companyName4', 'eten_user.city', 'deliveryDate', 'orderstatus']"
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
                            <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                            <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                        </div>

                        <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Pending'">
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
                        <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Delivery'">
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
                <Column header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                        <Checkbox
                            :key="filteredList.length" 
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
                <Column field="created" header="Create Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.created) }}
                    </template>
                </Column>

                <Column field="do_no" header="SAP DO No" style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailOrderDelivery/${data.id}`" class="hover:underline font-bold text-primary">
                            {{ data.do_no ? data.do_no : '-' }}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="companyName1" header="Customer Name" style="min-width: 12rem">
                    <template #body="{ data }">
                        <span class="font-bold">{{` ${data.eten_user.companyName1} ${data.eten_user.companyName2} ${data.eten_user.companyName3} ${data.eten_user.companyName4} ` }}</span>
                    <br>
                     {{ data.eten_user.custAccountNo }}
                    </template>
                </Column>

                <Column field="storagelocation" header="Storage Location" style="min-width: 12rem">
                    <template #body="{ data }">
                         {{`${data.storagelocation}` }}
                    </template>
                </Column>

                <Column field="city" header="City" style="min-width: 12rem">
                    <template #body="{ data }">
                         {{`${data.eten_user.city}` }}
                    </template>
                </Column>

                <Column field="orderDesc" header="Order Type" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.orderDesc }}
                    </template>
                </Column>


                <Column field="deliveryDate" header="ETA Date" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.deliveryDate ? formatDate(data.deliveryDate) : 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="scheduled_delivery_time" header="Deliver Date" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.scm_deliver_detail?.scheduled_delivery_time ? formatDate(data.scm_deliver_detail.scheduled_delivery_time) : 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="collectedDatetime" header="Delivered Date" style="min-width: 10rem">
                    <template #body="{ data }">
                          {{ data.scm_deliver_detail?.delivered_datetime? formatDate(data.scm_deliver_detail.delivered_datetime): 'Not Assigned' }}
                    </template>
                </Column>

                <Column field="orderstatus" header="Status" style="min-width: 8rem">
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

const toast = useToast();
const exportLoading1 = ref(false);
const importLoading1 = ref(false);
const exportLoading2 = ref(false);
const importLoading2 = ref(false);
const returnList = ref([]);
const importInput1 = ref();
const importInput2 = ref();

// Data variables
const sortMenu = ref();
const activeTabIndex = ref(0);
const selectedExportIds = ref(new Set());

const loading = ref(true);
const orderDelList = ref([]);
const filteredList  = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

        // 0: 'Pending',
        // 1: 'Completed',
        // 66: 'Processing',
        // 77: 'Delivery'

const statusTabs = [
    { label: 'Pending', status: 0 },
    { label: 'Delivery', status: 1 },
    { label: 'Completed', status: 2}
];

watch(activeTabIndex, () => {
    filterByTab();
    selectedExportIds.value.clear();
});
const getOrderStatus = (data) => {
    const detail = data.scm_deliver_detail;

    if (!detail) return 0;                     // Pending / New
    if (detail.delivered_datetime) return 2;    // Completed
    if (detail.scheduled_delivery_time) return 1; // Delivery
    return 0; // fallback to Pending
};

const filterByTab = () => {
    const selected = statusTabs[activeTabIndex.value];
    if (!selected) {
        filteredList.value = orderDelList.value;
        return;
    }
    filteredList.value = orderDelList.value.filter(item => getOrderStatus(item) === selected.status);
};
// Computed boolean: are all rows selected?
const allSelected = computed(() => {
  return filteredList.value.length > 0 &&
         filteredList.value.every(item => selectedExportIds.value.has(item.id));
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
    filteredList.value.forEach(item => {
      selectedExportIds.value.delete(item.id);
    });
  } else {
    // Select all for this tab
    filteredList.value.forEach(item => {
      selectedExportIds.value.add(item.id);
    });
  }
};

const sortBy = (field, order) => {
  filteredList.value = [...filteredList.value].sort((a, b) => {
    // Helper to get nested value
    const getField = (obj) => {
      return field.split('.').reduce((acc, key) => (acc ? acc[key] : ''), obj) ?? '';
    };

    const aVal = getField(a).toString().toLowerCase();
    const bVal = getField(b).toString().toLowerCase();

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
const sortItems = ref([
    {
        label: 'Sort by SAP DO No (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('do_no', 'asc')
    },
    {
        label: 'Sort by SAP DO No (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('do_no', 'desc')
    },
    {
        label: 'Sort by Cust Acc No (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('eten_user.custAccountNo', 'asc')
    },
    {
        label: 'Sort by Company Name',
        icon: 'pi pi-globe',
        command: () => sortBy('eten_user.companyName1', 'asc')
    }
]);

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
        a.download = 'BulkDeliverySchedule_Download.xlsx';
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
        a.download = 'BulkDeliveryReceive_Download.xlsx';
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
                detail: response.data.error || 'Server did not confirm success',
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
                detail: response.data.error || 'Server did not confirm success',
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
const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('order-delivery/list');
        console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
                    orderDelList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
            filterByTab();
        } else {
            console.error('API returned error or invalid data:', response.data);
            orderDelList.value = [];
            filteredList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        orderDelList.value = [];
        filteredList.value = [];
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
        0: 'warn',
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
        "PENDING": 'warn',
        "COMPLETED": 'success',
    };
    return severityMap[status] || 'secondary';
};
</script>
