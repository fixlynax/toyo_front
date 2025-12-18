<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List OE Tyre</div>

        <DataTable
            :value="tyres"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            removableSort
            class="rounded-table"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['id', 'pattern', 'brand', 'model',  'construction']"
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
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="fetchExportOE" />
                        <Button v-if="canUpdate" type="button" label="Import" icon="pi pi-file-import" class="p-button" @click="importInput?.click()" :loading="importLoading" />
                        <input ref="importInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport" />
                    </div>
                </div>
            </template>

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <Column field="pattern" header="Pattern" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.pattern }}
                </template>
            </Column>

            <Column field="brand" header="Brand" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.brand }}
                </template>
            </Column>

            <Column field="model" header="Model" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.model }}
                </template>
            </Column>

            <Column field="section_width" header="Size" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Section Width:</span>
                            <span>{{ data.section_width }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Tyre Size:</span>
                            <span>{{ data.tyre_size }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Rim Diameter:</span>
                            <span>{{ data.rim_diameter }}"</span>
                        </div class="flex">
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Load Index:</span>
                            <span>{{ data.load_index }}</span>
                        </div>
                    </div>
                </template>
            </Column>
            <!-- <Column field="origin" header="Origin" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.construction }}
                </template>
            </Column> -->
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref ,computed} from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('OE Tire LIst'));
const denyAccess = computed(() => menuStore.canTest('OE Tire LIst'));

const toast = useToast();

const importInput = ref();
const importLoading = ref(false);

const router = useRouter();
// Data variables
const tyres = ref([]);
const loading = ref(true);
const fileUpload = ref(null);
// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const fetchExportOE = async () => {
    try {
        loading.value = true;

        const response = await api.getDownload('oeTire/downloadData', {
            responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'OE_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
    } catch (err) {
        console.error('error fetching OE Tyre export:', err);
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
        const response = await api.postExtra('oeTire/uploadExcel', formData, {
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

const fetchData = async () => {
    try {
        loading.value = true;

        const response = await api.get('oeTireList');


        if (response.data.status === 1 && Array.isArray(response.data.oe_tires)) {
            tyres.value = response.data.oe_tires.map((product) => ({
                id: product.tire_id,
                brand: product.brand,
                model: product.model,
                construction: product.construction,
                created: product.created,
                load_index: product.load_index,
                model: product.model,
                pattern: product.pattern,
                rim_diameter: product.rim_diameter,
                section_width: product.section_width,
                status: product.status,
                tyre_size: product.tyre_size
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
            tyres.value = [];
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        console.error('Error fetching OE list:', error);
        tyres.value = [];
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