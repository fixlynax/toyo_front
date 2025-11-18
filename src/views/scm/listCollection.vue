<script setup>
import { ref, onBeforeMount, onMounted, watch ,computed} from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
const listData = ref([]);
const loading = ref(true);
const importLoading = ref(false);
const importInput = ref();


const toast = useToast();
const exportLoading1 = ref(false);
const importLoading1 = ref(false);
const exportLoading2 = ref(false);
const importLoading2 = ref(false);
const filteredList = ref([]);
const importInput1 = ref();
const importInput2 = ref();

// Data variables
const sortMenu = ref();
const activeTabIndex = ref(0);
const selectedExportIds = ref(new Set());

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

        // 3: 'Processing',
        // 4: 'Schedule',
        // 5: 'Collected',

const statusTabs = [
    { label: 'New', status: 0 ,code: 3},
    { label: 'Pending', status: 1 ,code: 4},
    { label: 'Completed', status: 2 ,code: 5}
];

watch(activeTabIndex, () => {
    filterByTab();
    selectedExportIds.value.clear();
});

const filterByTab = () => {
    const selected = statusTabs[activeTabIndex.value];
    if (!selected) {
        filteredList.value = listData.value;
        return;
    }
    filteredList.value = listData.value.filter((item) => (item.status) === selected.status);
};
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
        label: 'Sort by Ref No (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('claimRefno', 'asc')
    },
    {
        label: 'Sort by Ref No (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('claimRefno', 'desc')
    }
]);
const selectedRows = ref([]);
const filterStatus = ref(null);
const showFilterMenu = ref(false);

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
        const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    // console.log("export 1",idsArray);
    try {
        exportLoading1.value = true;
        
            const response = await api.postExtra(
            'excel/export-scm-ctc-list',
        { claim_id: JSON.stringify(idsArray) },
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
        a.download = 'BulkCollection_Download.xlsx';
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
    const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    // console.log("export 2",idsArray);
    try {
        exportLoading2.value = true;
        
            const response = await api.postExtra(
            'excel/export-scm-ctc-list',
        { claim_id: JSON.stringify(idsArray) },
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
        a.download = 'BulkCollectionReceieve_Download.xlsx';
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
        formData.append('ctc_excel', file);
        
        const response = await api.postExtra('excel/import-scm-ctc-collect', formData, {
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
        formData.append('ctc_excel', file);
        
        const response = await api.postExtra('excel/import-scm-ctc-reach', formData, {
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
        const response = await api.get('collection/list');
        if (response.data.status === 1) {
            
        listData.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            }); // sort by raw Date
            filterByTab();
        } else listData.value = [];
    } catch (error) {
        console.error('Error fetching collection list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
}
onMounted(async () => {
    fetchData();
});

</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2"> CTC List Collection</div>
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
            :globalFilterFields="['claimRefno', 'created', 'city', 'collectDate', 'collectTime', 'status']"
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

                    <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'New'">
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
                    <div class="flex justify-end gap-2"  v-if="statusTabs[activeTabIndex]?.label === 'Pending'">
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

            <template #empty> No Collection found. </template>
            <template #loading> Loading Collection data. Please wait. </template>
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
            <Column field="createDate" header="Create Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.created) }}
                </template>
            </Column>
            <Column field="collectRef" header="Ref No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/scm/detailCollection/${data.id}`" class="hover:underline font-bold text-primary">
                        {{ data.claimRefno }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="collectedDatetime" header="Collect Date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.collectDate && data.collectTime ? formatDate(data.collectDate) + ' ' + formatTime(data.collectTime): 'Not Assigned'}}
                </template>
            </Column>
            <Column field="returnDate" header="Receive Date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.reachWH ? formatDate(data.reachWH) : 'Not Assigned' }}
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusText(data.status)" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
