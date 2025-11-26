<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Product</div>

        <DataTable
            :value="tyres"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="materialid"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['materialid', 'pattern', 'origin', 'sectionwidth', 'tireseries', 'rimdiameter', 'speedplyrating','status']"
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
                        <!-- <Button 
                        type="button" 
                        label="Material" 
                        icon="pi pi-sync" 
                        class="p-button"
                        :loading="materialLoading"
                        @click="handleMaterial"
                        />
                        <Button 
                        type="button" 
                        label="Stock Level" 
                        icon="pi pi-sync" 
                        class="p-button"
                        :loading="stockLevelLoading"
                        @click="handleStockLevel"
                        /> -->
                        <Button 
                        type="button" 
                        label="Export" 
                        icon="pi pi-file-export" 
                        class="p-button"
                        :loading="exportLoading"
                        @click="handleExport"
                        />
                        <Button v-if="canUpdate"
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
                        <!-- <Button 
                        type="button" 
                        icon="pi pi-refresh" 
                        class="p-button"
                        :loading="refreshLoading"
                        @click="refreshData"
                        /> -->
                    </div>
                </div>
            </template>
            
            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <Column header="Export All" style="min-width: 8rem">
                <template #header>
                    <div class="flex justify-center">
                    <Checkbox
                        :binary="true"
                        :model-value="false"  
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
            <Column field="materialid" header="Material ID" style="min-width: 6rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col items-start gap-1">
                            {{ data.materialid }}
                    </div>
                </template>
            </Column>

            <Column field="pattern" header="Pattern" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                        {{ data.pattern }}
                </template>
            </Column>

            <Column field="origin" header="Origin" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.origin }}
                </template>
            </Column>

            <Column field="sectionwidth" header="Size" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Section Width:</span>
                            <span>{{ data.sectionwidth }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Tire Series:</span>
                            <span>{{ data.tireseries }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Rim Diameter:</span>
                            <span>{{ data.rimdiameter }}"</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Speed Rating:</span>
                            <span>{{ data.speedplyrating }}</span>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Sell Column with Checkbox -->
            <Column field="sell" header="Sell" style="min-width: 6rem" v-if="canUpdate">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox 
                            v-model="data.sell" 
                            :binary="true" 
                            :disabled="data.updatingSell"
                            @change="handleToggleSell(data)"
                            :class="data.sell ? 'p-checkbox-checked' : ''"
                        />
                        <i v-if="data.updatingSell" class="pi pi-spin pi-spinner ml-2"></i>
                    </div>
                </template>
            </Column>
            
            
            <!-- Warranty Column with Checkbox -->
            <Column field="warranty" header="Warranty" style="min-width: 8rem" v-if="canUpdate">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox 
                        v-model="data.warranty" 
                        :binary="true" 
                        :disabled="data.updatingWarranty"
                        @change="handleToggleWarranty(data)"
                        :class="data.warranty ? 'p-checkbox-checked' : ''"
                        />
                        <i v-if="data.updatingWarranty" class="pi pi-spin pi-spinner ml-2"></i>
                    </div>
                </template>
            </Column>
            
            <!-- TWP Column with Checkbox -->
            <Column field="twp" header="TWP" style="min-width: 8rem" v-if="canUpdate">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox 
                            v-model="data.twp" 
                            :binary="true" 
                            :disabled="data.updatingTWP"
                            @change="handleToggleTWP(data)"
                            :class="data.twp ? 'p-checkbox-checked' : ''"
                        />
                        <i v-if="data.updatingTWP" class="pi pi-spin pi-spinner ml-2"></i>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, computed  } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Product List'));
const denyAccess = computed(() => menuStore.canTest('Product List'));

const toast = useToast();

// Data variables
const tyres = ref([]);
const loading = ref(true);
const exportLoading = ref(false);
const importLoading = ref(false);
const refreshLoading = ref(false);
const materialLoading = ref(false);
const stockLevelLoading = ref(false);
const importInput = ref();
const selectedExportIds = ref(new Set());

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


// Fetch data function
const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('material');


        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            tyres.value = response.data.admin_data.map((product) => ({
                id: product.id, // Make sure this is included for API calls
                materialid: product.materialid,
                twp: product.isTWP === 1,
                warranty: product.isWarranty === 1,
                sell: product.isSell === 1,
                pattern: product.pattern,
                pattern_name: product.pattern_name,
                origin: product.origin,
                sectionwidth: product.sectionwidth,
                tireseries: product.tireseries,
                rimdiameter: product.rimdiameter,
                speedplyrating: product.speedplyrating,
                updatingTWP: false,
                updatingWarranty: false,
                updatingSell: false
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            tyres.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        tyres.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
        refreshLoading.value = false;
    }
};

// Material update function
const handleMaterial = async () => {
    try {
        materialLoading.value = true;
        const response = await api.get('updatematerialmaster');
        
        if (response.data.success) {
            const updatedCount = response.data.updated ? response.data.updated.length : 0;
            toast.add({ 
                severity: 'success', 
                summary: 'Material Updated', 
                detail: `Material master updated successfully. ${updatedCount} records processed.`, 
                life: 5000 
            });
            
            // Refresh the data to show updated materials
            await fetchData();
        } else {
            toast.add({ 
                severity: 'warn', 
                summary: 'Material Update', 
                detail: response.data.message || 'Material update completed with warnings', 
                life: 5000 
            });
        }
    } catch (error) {
        console.error('Error updating material master:', error);
        toast.add({ 
            severity: 'error', 
            summary: 'Update Failed', 
            detail: 'Failed to update material master', 
            life: 3000 
        });
    } finally {
        materialLoading.value = false;
    }
};

// Stock level update function
const handleStockLevel = async () => {
    try {
        stockLevelLoading.value = true;
        const response = await api.get('updatestocklevel');
        
        if (response.data.success) {
            toast.add({ 
                severity: 'success', 
                summary: 'Stock Level Updated', 
                detail: 'Stock levels updated successfully', 
                life: 5000 
            });
            
            // Refresh the data to show updated stock levels
            await fetchData();
        } else {
            toast.add({ 
                severity: 'warn', 
                summary: 'Stock Level Update', 
                detail: response.data.message || 'Stock level update completed with warnings', 
                life: 5000 
            });
        }
    } catch (error) {
        console.error('Error updating stock level:', error);
        toast.add({ 
            severity: 'error', 
            summary: 'Update Failed', 
            detail: 'Failed to update stock levels', 
            life: 3000 
        });
    } finally {
        stockLevelLoading.value = false;
    }
};

// Computed boolean: are all rows selected?
const allSelected = computed(() => {
  return tyres.value.length > 0 && selectedExportIds.value.size === tyres.value.length;
});

// Toggle functions
const handleToggleExport = (id) => {
  if (selectedExportIds.value.has(id)) {
    selectedExportIds.value.delete(id);
  } else {
    selectedExportIds.value.add(id);
  }
};

// Check all
const toggleSelectAll = () => {
  if (allSelected.value) {
    // Unselect all
    selectedExportIds.value.clear();
  } else {
    // Select all
    tyres.value.forEach(row => selectedExportIds.value.add(row.id));
  }
};

// Toggle functions
const handleToggleTWP = async (data) => {
    try {
        data.updatingTWP = true;
        const newStatus = data.twp ? 1 : 0;
        await api.put(`material/toggleTWP/${data.id}`, {

        });
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'TWP status updated', life: 3000 });
    } catch (error) {
        console.error('Error updating TWP:', error);
        data.twp = !data.twp; // Revert on error
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update TWP status', life: 3000 });
    } finally {
        data.updatingTWP = false;
    }
};

const handleToggleWarranty = async (data) => {
    try {
        data.updatingWarranty = true;
        const newStatus = data.warranty ? 1 : 0;
        
        await api.put(`material/toggleWarranty/${data.id}`, {
            status: newStatus
        });
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Warranty status updated', life: 3000 });
    } catch (error) {
        console.error('Error updating warranty:', error);
        data.warranty = !data.warranty; // Revert on error
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update warranty status', life: 3000 });
    } finally {
        data.updatingWarranty = false;
    }
};

const handleToggleSell = async (data) => {
    try {
        data.updatingSell = true;
        const newStatus = data.sell ? 1 : 0;
        
        await api.put(`material/toggleSell/${data.id}`, {
            status: newStatus
        });
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Sell status updated', life: 3000 });
    } catch (error) {
        console.error('Error updating sell status:', error);
        data.sell = !data.sell; // Revert on error
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update sell status', life: 3000 });
    } finally {
        data.updatingSell = false;
    }
};

// Export function
const handleExport = async () => {
     const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading.value = true;
        
            const response = await api.postExtra(
        'material/export',
        { material_id: JSON.stringify(idsArray) }, 
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
        a.download = 'Material_Download.xlsx';
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

// Import function
const handleImport = async (event) => {
    const file = event.target.files[0];
   


    if (!file) return;

    try {
        importLoading.value = true;
        
        const formData = new FormData();
        formData.append('material_file', file);
        const response = await api.postExtra('material/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });
        
        if (response.data.status === 1) {
            // Refresh data after import
            await fetchData();

            // Reset file input
            if (importInput.value) {
                importInput.value.value = '';
            }

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
        importLoading.value = false;
    }
};

// Refresh function
// const refreshData = () => {
//     refreshLoading.value = true;
//     fetchData();
// };

onMounted(() => {
    fetchData();
});

const getOverallStatusLabel = (deleted) => {
    return deleted ? 'Inactive' : 'Active';
};

const getOverallStatusSeverity = (deleted) => {
    return deleted ? 'danger' : 'success';
};
</script>