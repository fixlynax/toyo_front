<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Return Order</div>
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />
        <DataTable 
            :value="filteredList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="materialid"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['return_orderNo_ref', 'custAccountNo' , 'storageLocation' , 'city', 'dealerName' , 'delivery_status' , 'created']">
            <template #header>
                <div class="flex flex-col gap-4 w-full">
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
                            
                            <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                            <Menu ref="sortMenu" :model="sortItems" :popup="true" />
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
                    </div>
                </div>
            </template>

            <template #empty> No return orders found. </template>
            <template #loading> Loading return orders data. Please wait. </template>

            <Column v-if="canUpdate" header="Export All" style="min-width: 8rem">
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
             <Column field="return_orderNo_ref" header="Ref No" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/scm/detailReturnOrder/${data.id}`" class="hover:underline font-bold text-primary-400">
                    {{ data.return_orderNo_ref }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="dealerName" header="Ship-To" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    <span class="font-bold">{{ data?.dealerName || '-' }}</span>
                    <br>
                     {{ data?.custAccountNo ?? '-' }}
                </template>
            </Column>
            <Column field="storageLocation" header="Storage Location" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data?.storageLocation ?? '-' }}
                </template>
            </Column>
            <Column field="city" header="City" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data?.city ?? '-' }}
                </template>
            </Column>
            <Column field="pickup_datetime" header="Pickup Date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.delivery_information?.pickup_datetime ? formatDate(data.delivery_information.pickup_datetime) : 'No date assigned' }}
                </template>
            </Column>
            <Column field="receive_datetime" header="Receiving Date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.delivery_information?.receive_datetime ? formatDate(data.delivery_information.receive_datetime) : 'No date assigned' }}
                </template>
            </Column>
            <Column field="length" header="Return Items" style="min-width: 12rem">
                <template #body="{ data }">
                        {{ data.return_order_array?.length || 0 }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.delivery_status" :severity="getStatusSeverity(data.delivery_status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Return Order Collection'));
const denyAccess = computed(() => menuStore.canTest('Return Order Collection'));
const toast = useToast();
const exportLoading1 = ref(false);
const importLoading1 = ref(false);
const exportLoading2 = ref(false);
const importLoading2 = ref(false);
const returnList = ref([]);
const filteredList = ref([]);
const loading = ref(true);
const importInput1 = ref();
const importInput2 = ref();

const selectedExportIds = ref(new Set());
const activeTabIndex = ref(0);
// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const sortMenu = ref();
const sortBy = (field, order) => {
    filteredList.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};
const sortItems = ref([
    {
        label: 'Sort by Ref No (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('return_orderNo_ref', 'asc')
    },
    {
        label: 'Sort by Ref No (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('return_orderNo_ref', 'desc')
    },
    {
        label: 'Sort by Cust Acc No (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('custAccountNo', 'asc')
    },
    {
        label: 'Sort by Company Name',
        icon: 'pi pi-globe',
        command: () => sortBy('companyName1', 'asc')
    },
    {
        label: 'Sort by Status',
        icon: 'pi pi-check-circle',
        command: () => sortBy('orderstatus', 'asc')
    }
]);

// const statusOptions = [
//     { label: 'Pending', value: 0 },
//     { label: 'Completed', value: 1 },
//     { label: 'Processing', value: 66 },
//     { label: 'Delivery', value: 77 }
// ];

const statusTabs = [
    { label: 'New', status: 0 },
    { label: 'Pending', status: 1 },
    { label: 'Completed', status: 2 }
];

watch(activeTabIndex, () => {
    filterByTab();
    selectedExportIds.value.clear();
});

const filterByTab = () => {
    const selected = statusTabs[activeTabIndex.value];
    if (!selected) {
        filteredList.value = returnList.value;
        return;
    }
    filteredList.value = returnList.value.filter((item) => item.delivery_status?.toUpperCase() === selected.label.toUpperCase());
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

// Export function PICKUP ONLY
const handleExport1 = async () => {
     const idsArray = Array.from(selectedExportIds.value).map(id => ({ id: Number(id) }));

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
     const idsArray = Array.from(selectedExportIds.value).map(id => ({ id: Number(id) }));

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
// Import function RECEIVE ONLY
const handleImport2 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading2.value = true;
        
        const formData = new FormData();
        formData.append('return_order_excel', file);
        
        const response = await api.postExtra('import-scm-receivereturn-order-list', formData, {
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

const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('scm-return-order-list');
        // console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
                returnList.value = response.data.admin_data.sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
    });
            filterByTab();
        } else {
            console.error('API returned error or invalid data:', response.data);
            returnList.value = [];
            filteredList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        returnList.value = [];
        filteredList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
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
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// function getStatusLabel(status) {
//     switch (status) {
//         case 0:
//             return 'Pending';
//         case 1:
//             return 'Approve';
//         case 2:
//             return 'Rejected';
//         case 66:
//             return 'Processing';
//         case 77:
//             return 'Pending Collection';
//         case 9:
//             return 'Completed';
//         default:
//             return 'Unknown';
//     }
// }

function getStatusSeverity(status) {
    switch (status) {
        case 'PENDING':
            return 'warn';
        case 'COMPLETED':
            return 'success';
        case 'NEW':
            return 'info';
        default:
            return 'secondary';
    }
}

</script>
