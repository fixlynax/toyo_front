<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List Tread Depth</div>

        <DataTable
            :value="tread_depths"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="tread_depth_id"
            removableSort
            class="rounded-table"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['pattern', 'section_width', 'updated_formatted', 'tire_series', 'rim_diameter']"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Sort Menu Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                    </div>

                    <!-- Right: Export & Batch Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="fetchExport" />
                        <Button type="button" label="Import" icon="pi pi-file-import" class="p-button" @click="importInput?.click()" :loading="importLoading" />
                        <input ref="importInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport" />
                    </div>
                </div>
            </template>

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <Column field="updated_formatted" header="Last Updated" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.updated_formatted }}
                </template>
            </Column>

            <Column field="pattern" header="Pattern" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.pattern }}
                </template>
            </Column>

            <Column field="section_width" header="Section Widht" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.section_width }}
                </template>
            </Column>

            <Column field="section_width" header="Section Widht" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.section_width }}
                </template>
            </Column>

            <Column field="tire_series" header="Tyre Series" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.tire_series }}
                </template>
            </Column>

            <Column field="rim_diameter" header="Rim Diameter" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.rim_diameter }}
                </template>
            </Column>
            

            <Column
                v-for="step in [100,95,90,85,80,75,70,65,60,55,50,45,40,35,30,25,20,15,10]"
                :key="step"
                :field="'p' + step"
                :header="step + '%'"
                style="min-width: 5rem" 
                sortable
            >
                <template #body="{ data }">
                    {{ data['p' + step] }}
                </template>
            </Column>

        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref ,computed} from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
// import { useMenuStore } from '@/store/menu';

// const menuStore = useMenuStore();
// const canUpdate = computed(() => menuStore.canWrite('OE Tire LIst'));
// const denyAccess = computed(() => menuStore.canTest('OE Tire LIst'));

const toast = useToast();

const importInput = ref();
const importLoading = ref(false);

// Data variables
const tread_depths = ref([]);
const loading = ref(true);
// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const fetchExport = async () => {
    try {
        loading.value = true;

        const response = await api.getDownload('treaddepthlist/downloadData', {
            responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TreadDepth_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
    } catch (err) {
        console.error('error fetching Tread Depth export:', err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

// Import function
const handleImport = async (event) => {
    const file = event.target.files[0];
   


    if (!file) return;

    try {
        importLoading.value = true;
        
        const formData = new FormData();
        formData.append('excel_file', file);
        const response = await api.postExtra('treaddepthlist/uploadExcel', formData, {
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
                detail: response.data.error || 'Failed to import data',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading.value = false;
                    if (importInput.value) {
                importInput.value.value = '';
            }
    }
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

const fetchData = async () => {
    try {
        loading.value = true;

        const response = await api.get('treaddepthlist');


        if (response.data.status === 1 && Array.isArray(response.data.tread_depths)) {
            tread_depths.value = response.data.tread_depths.map(item => ({
                ...item,
                updated_formatted: formatDate(item.updated)
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
            tread_depths.value = [];
        }
    } catch (error) {
        console.error('Error fetching Tread Depth list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        tread_depths.value = [];
    } finally {
        loading.value = false;
    }
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