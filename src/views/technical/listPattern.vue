<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Pattern List</div>

        <DataTable
            v-model:expandedRows="expandedRows"
            :value="patterns"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            dataKey="pattern_id"
            removableSort
            class="rounded-table"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['pattern_code', 'pattern_name', 'mfg_code', 'image_url']"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            tableStyle="min-width: 60rem"
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
                    <!-- Right: Export & Batch Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="fetchExportPattern" />
                        <Button v-if="canUpdate" type="button" label="Import" icon="pi pi-file-import" class="p-button" @click="importInput?.click()" :loading="importLoading" />
                        <input v-if="canUpdate" ref="importInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport" />
                    </div>
                    <!-- Right: Export & Create Buttons -->
                    <!-- <div class="flex items-center gap-2 ml-auto"> -->
                        <!-- <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" @click="exportToCSV" :disabled="patterns.length === 0" /> -->
                        <!-- <RouterLink to="/technical/createPattern" v-if="canUpdate">
                        <Button type="button" label="Create" icon="pi pi-plus" class="p-button" />
                        </RouterLink> -->
                    <!-- </div> -->
                </div>
            </template>

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>
            <Column field="created" header="Created On" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span>
                        {{ formatDate(data.created) }} 
                        <br/>
                        {{ formatTime(data?.created) ?? '-' }}
                    </span>
                </template>
            </Column>
            <Column field="processedImageURL" header="Image" style="min-width: 8rem; text-align: center">
                <template #body="{ data }">
                    <img
                        v-if="data.processedImageURL"
                        :src="getImagePath(data.processedImageURL || '/placeholder.png')"
                        alt="Pattern Image"
                        class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                        @click="openImage(data.processedImageURL || '/placeholder.png')"
                    />
                    <div v-else class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-400 text-xs">No Image</div>
                </template>
            </Column>

            <Column field="pattern_code" header="Pattern Code" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <RouterLink :to="`/technical/detailPattern/${data.pattern_id}`" class="hover:underline font-bold text-primary-400">
                        <span>{{ data.pattern_code }}</span>
                    </RouterLink>
                </template>
            </Column>
            <Column field="mfg_code" header="MFG Code" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span>{{ data.mfg_code || '-' }}</span>
                </template>
            </Column>
            <Column field="pattern_name" header="Pattern Name" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span>{{ data.pattern_name || '-' }}</span>
                </template>
            </Column>

        </DataTable>

        <!-- ✅ Image Preview Dialog -->
        <Dialog v-model:visible="showImageDialog" modal :style="{ width: '40vw' }" dismissableMask>
            <template #header>
                <div class="text-xl font-bold">Pattern Image</div>
            </template>
            <div class="flex justify-center items-center">
                <img :src="getImagePath(selectedImage)" alt="Preview" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useMenuStore } from '@/store/menu';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Pattern List'));
const denyAccess = computed(() => menuStore.canTest('Pattern List'));
const patterns = ref([]);
const loading = ref(true);
const expandedRows = ref([]);

const importInput = ref();
const importLoading = ref(false);

// Filters (for Quick Search)
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showImageDialog = ref(false);
const selectedImage = ref(null);

const openImage = (imagePath) => {
    if (!imagePath) return;
    selectedImage.value = imagePath;
    showImageDialog.value = true;
};

const getImagePath = (path) => {
    if (!path) return '';
    return path.replace(/^public\//, '/');
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
function formatTime(dateTimeString) {
    if (!dateTimeString) return '';
    const [, timePart] = dateTimeString.split(' ');

    return timePart; // already in 24-hour format: HH:mm:ss
}
// Export function to CSV
const exportToCSV = () => {
    if (patterns.value.length === 0) {
        console.warn('No data to export');
        return;
    }

    try {
        // Define CSV headers
        const headers = ['Pattern Code', 'Pattern Name', 'Created Date'];

        // Prepare data rows
        const csvData = patterns.value.map((pattern) => [`"${pattern.pattern_code || ''}"`, `"${pattern.pattern_name || '-'}"`, `"${formatDate(pattern.created)}"`]);

        // Combine headers and data
        const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `pattern_list_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
};

const fetchExportPattern = async () => {
    try {
        loading.value = true;

        const response = await api.postExtra('excel/export-material-pattern',{}, {
            responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Pattern_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
    } catch (err) {
        console.error('error fetching Pattern export:', err);
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
        formData.append('material_pattern_excel', file);
        const response = await api.postExtra('excel/import-material-pattern', formData, {
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

        const response = await api.get('patternList');

        if (response.data.status === 1 && Array.isArray(response.data.material_patterns)) {
            const transformedItems = response.data.material_patterns.map((pattern) => ({
                pattern_id: pattern.pattern_id,
                pattern_code: pattern.pattern_code,
                mfg_code: pattern.mfg_code,
                pattern_name: pattern.pattern_name,
                imageURL: pattern.image_url,
                created: pattern.created,
                processedImageURL: pattern.image_url
            }));

            // STEP 1: Show list instantly
            patterns.value = transformedItems;

        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
            patterns.value = [];
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        console.error('Error fetching Pattern list:', error);
        patterns.value = [];
    } finally {
        loading.value = false;
    }
};

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
