<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Pattern</div>

        <DataTable
            v-model:expandedRows="expandedRows"
            :value="patterns"
            :paginator="true"
            :rows="10"
            dataKey="pattern_id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['pattern_code', 'pattern_name', 'image_url']"
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

                        <!-- Sort Menu -->
                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <!-- Right: Export & Create Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button 
                        type="button" 
                        label="Export" 
                        icon="pi pi-file-export" 
                        class="p-button-success"
                        :loading="exportLoading"
                        @click="handleExport"
                        />
                        <Button 
                        type="button" 
                        label="Import" 
                        icon="pi pi-file-import" 
                        class="p-button"
                        @click="importInput?.click()"
                        :loading="importLoading"
                        />
                        <input 
                        ref="importInput"
                        type="file" 
                        accept=".xlsx,.xls" 
                        style="display: none" 
                        @change="handleImport"
                        />
                        <RouterLink to="/technical/createPattern">
                        <Button type="button" label="Create" icon="pi pi-plus" class="p-button" />
                        </RouterLink>
                    </div>
                </div>
            </template>

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <Column field="processedImageURL" header="Image" style="min-width: 8rem; text-align: center">
                <template #body="{ data }">
                    <img 
                        v-if="data.processedImageURL" 
                        :src="getImagePath(data.processedImageURL)" 
                        alt="Pattern Image" 
                        class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform" 
                        @click="openImage(data.processedImageURL)" 
                    />
                    <div v-else class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-400 text-xs">
                        No Image
                    </div>
                </template>
            </Column>

            <Column field="pattern_code" header="Pattern Code" style="min-width: 8rem">
                <template #body="{ data }">
                     <RouterLink :to="`/technical/detailPattern/${data.pattern_id}`" class="hover:underline font-bold text-primary-400">
                    <span class="font-semibold ml-1">{{ data.pattern_code }}</span>
                    </RouterLink>
                </template>
            </Column>

            <Column field="pattern_name" header="Pattern Name" style="min-width: 8rem">
                <template #body="{ data }">
                    <span class="font-semibold ml-1">{{ data.pattern_name || '-' }}</span>
                </template>
            </Column>

            <Column field="created" header="Created Date" style="min-width: 10rem">
                <template #body="{ data }">
                    <span class="text-gray-600">{{ formatDate(data.created) }}</span>
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
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import Dialog from 'primevue/dialog';


const patterns = ref([]);
const loading = ref(true);
const expandedRows = ref([]);
const exportLoading = ref(false);
const importLoading = ref(false);
const importInput = ref();

// Filters (for Quick Search)
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const sortMenu = ref();
const sortItems = ref([
    {
        label: 'Sort by Pattern Code (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('pattern_code', 'asc')
    },
    {
        label: 'Sort by Pattern Code (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('pattern_code', 'desc')
    },
    {
        label: 'Sort by Pattern Name (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern_name', 'asc')
    },
    {
        label: 'Sort by Pattern Name (Z-A)',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern_name', 'desc')
    },
    {
        label: 'Sort by Created Date (Newest)',
        icon: 'pi pi-calendar',
        command: () => sortBy('created', 'desc')
    },
    {
        label: 'Sort by Created Date (Oldest)',
        icon: 'pi pi-calendar',
        command: () => sortBy('created', 'asc')
    }
]);

const sortBy = (field, order) => {
    patterns.value.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];
        
        // Handle null values
        if (aValue === null) aValue = '';
        if (bValue === null) bValue = '';
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

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

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid Date';
    }
};

// Import function
// const handleImport = async (event) => {
//     const file = event.target.files[0];
   


//     if (!file) return;

//     try {
//         importLoading.value = true;
        
//         const formData = new FormData();
//         formData.append('material_file', file);
//         const response = await api.postExtra('material/import', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//             });
        
//         if (response.data.status === 1) {
//             // Refresh data after import
//             await fetchData();

//             // Reset file input
//             if (importInput.value) {
//                 importInput.value.value = '';
//             }

//             toast.add({
//                 severity: 'success',
//                 summary: 'Success',
//                 detail: 'File imported successfully',
//                 life: 3000
//             });
//             } else {
//             toast.add({
//                 severity: 'error',
//                 summary: 'Import Failed',
//                 detail: response.data.error || 'Server did not confirm success',
//                 life: 3000
//             });
//         }
//     } catch (error) {
//         console.error('Error importing data:', error);
//         toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
//     } finally {
//         importLoading.value = false;
//     }
// };

// Export function
// const handleExport = async () => {
//      const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

//     if (idsArray.length === 0) {
//         alert('Please select at least one row.');
//         return;
//     }
//     try {
//         exportLoading.value = true;
        
//             const response = await api.postExtra(
//         'material/export',
//         { material_id: JSON.stringify(idsArray) }, 
//         {
//             responseType: 'blob',
//             headers: {
//             'Content-Type': 'application/json',
//             }
//         }
//         );
//         const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//         });

//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'Material_Download.xlsx';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);

//         toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
//         selectedExportIds.value.clear();
//     } catch (error) {
//         console.error('Error exporting data:', error);
//         toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
//     } finally {
//         exportLoading.value = false;
//     }
// };

// Alternative export function for Excel format (using CSV with .xls extension)
const exportToExcel = () => {
    if (patterns.value.length === 0) {
        console.warn('No data to export');
        return;
    }

    try {
        // Create worksheet data
        const worksheetData = [
            ['Pattern Code', 'Pattern Name', 'Created Date', 'Image URL'],
            ...patterns.value.map(pattern => [
                pattern.pattern_code || '',
                pattern.pattern_name || '-',
                formatDate(pattern.created),
                pattern.imageURL || ''
            ])
        ];

        // Convert to CSV format
        const csvContent = worksheetData.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');

        // Create and download the file with .xls extension
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `pattern_list_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('Excel export successful');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};

const processCatalogueImages = async (catalogueItems) => {
    const processedItems = [];

    for (const item of catalogueItems) {
        if (item.imageURL && typeof item.imageURL === 'string') {
            try {
                // console.log('Processing private image:', item.imageURL);
                const blobUrl = await api.getPrivateFile(item.imageURL);
                if (blobUrl) {
                    processedItems.push({
                        ...item,
                        processedImageURL: blobUrl
                    });
                    console.log('Successfully processed image:', item.prizeName, blobUrl);
                } else {
                    // Fallback to original URL if private file loading fails
                    processedItems.push({
                        ...item,
                        processedImageURL: item.imageURL
                    });
                    console.warn('Failed to process private image, using original:', item.imageURL);
                }
            } catch (error) {
                console.error(`Error loading catalogue image for ${item.prizeName}:`, error);
                // Fallback to original URL
                processedItems.push({
                    ...item,
                    processedImageURL: item.imageURL
                });
            }
        } else {
            // No image URL, use placeholder
            processedItems.push({
                ...item,
                processedImageURL: ''
            });
        }
    }

    return processedItems;
};

onMounted(async () => {
    try {
        loading.value = true;

        const response = await api.get('patternList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.material_patterns)) {
            const transformedItems = response.data.material_patterns.map((pattern) => ({
                pattern_id: pattern.pattern_id,
                pattern_code: pattern.pattern_code,
                pattern_name: pattern.pattern_name,
                imageURL: pattern.image_url,
                created: pattern.created,
                processedImageURL: null // For private image processing
            }));

            // Process private images
            const processedItems = await processCatalogueImages(transformedItems);
            patterns.value = processedItems;

        } else {
            console.error('API returned error or invalid data:', response.data);
            patterns.value = [];
        }
    } catch (error) {
        console.error('Error fetching Pattern list:', error);
        patterns.value = [];
    } finally {
        loading.value = false;
    }
});
</script>