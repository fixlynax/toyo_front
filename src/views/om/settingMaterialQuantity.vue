<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Setting Material Quantity</div>

        <LoadingPage v-if="globalLoading" message="Loading..." />

        <div v-else>
            <!-- Dealer and Material Selection -->
            <div class="p-4 mb-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Dealer Multi-Select -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Dealers</label>
                        <MultiSelect
                            v-model="selectedDealers"
                            :options="dealerOptions"
                            optionLabel="label"
                            optionValue="value"
                            :placeholder="loadingDealers ? 'Loading dealers...' : 'Select dealers'"
                            display="chip"
                            :loading="loadingDealers"
                            :disabled="loadingDealers"
                            class="w-full"
                            :maxSelectedLabels="3"
                            @change="onSelectionChange"
                        >
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.length">
                                    <Chip v-for="dealer in getSelectedDealerNames(slotProps.value)" :key="dealer.value" :label="dealer.label" class="mr-2 mb-1" />
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </MultiSelect>
                        <div v-if="selectedDealers.length > 0" class="mt-2 text-sm text-gray-500">
                            Selected: {{ selectedDealers.length }} dealer(s)
                        </div>
                    </div>

                    <!-- Material Multi-Select -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Materials</label>
                        <MultiSelect
                            v-model="selectedMaterials"
                            :options="materialOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select materials"
                            display="chip"
                            :loading="loadingMaterialsList"
                            :disabled="loadingMaterialsList || !materialsLoaded"
                            class="w-full"
                            :maxSelectedLabels="3"
                            @change="onSelectionChange"
                        >
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.length">
                                    <Chip v-for="material in getSelectedMaterialNames(slotProps.value)" :key="material.value" :label="material.label" class="mr-2 mb-1" />
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </MultiSelect>
                        <div v-if="selectedMaterials.length > 0" class="mt-2 text-sm text-gray-500">
                            Selected: {{ selectedMaterials.length }} material(s)
                        </div>
                        <div v-else class="mt-2 text-sm text-gray-500">
                            Leave empty to select all materials
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between mt-4 pt-4 border-t">
                    <div class="flex items-center gap-2">
                        <Button 
                            label="Clear All Selections" 
                            icon="pi pi-times" 
                            severity="secondary" 
                            @click="clearAllSelections"
                            :disabled="!hasSelections"
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <Button 
                            label="Load Materials" 
                            icon="pi pi-search" 
                            class="p-button-primary"
                            @click="fetchEtenMaterials"
                            :loading="tableLoading"
                            :disabled="!canLoadMaterials"
                        />
                    </div>
                </div>
            </div>

            <!-- Results Table -->
            <div v-if="showResults && !loadingEtenMaterials">
                <DataTable
                    :value="materialList"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[10, 20, 50, 100]"
                    dataKey="id"
                    removableSort
                    :rowHover="true"
                    :loading="tableLoading"
                    :filters="filters"
                    filterDisplay="menu"
                    class="rounded-table"
                    :globalFilterFields="['pattern_name', 'material_id', 'material_desc', 'eten_name', 'custAccountNo']"
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
                                    <InputText v-model="filters['global'].value" placeholder="Search by pattern, material ID, description, or dealer" class="w-full" />
                                </IconField>
                            </div>

                            <div class="flex items-center gap-2 ml-auto">
                                <Button type="button" label="Export Excel" icon="pi pi-file-export" class="p-button-success" @click="exportMaterials" :loading="exportLoading" :disabled="!canExport" />
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" class="p-button-primary" @click="triggerImport" :loading="importLoading" :disabled="!canImport" />
                                <input ref="importFileInput" type="file" accept=".xlsx,.xls,.csv" style="display: none" @change="handleImport" />
                                <Button type="button" icon="pi pi-refresh" class="p-button-secondary" @click="fetchEtenMaterials" :loading="tableLoading" :disabled="!canLoadMaterials" />
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center py-8 text-gray-500">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <p>No material data found for selected criteria.</p>
                        </div>
                    </template>

                    <template #loading>
                        <div class="text-center py-8">
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                            <p class="mt-2">Loading material data...</p>
                        </div>
                    </template>

                    <Column field="eten_name" header="Dealer" style="min-width: 15rem" sortable>
                        <template #body="{ data }">
                            <div>
                                <div class="font-medium">{{ data.eten_name }}</div>
                                <div class="text-xs text-gray-500">{{ data.custAccountNo }}</div>
                            </div>
                        </template>
                    </Column>

                    <Column field="pattern_name" header="Pattern" style="min-width: 12rem" sortable>
                        <template #body="{ data }">
                            <div>
                                <div class="font-medium">{{ data.pattern_name }}</div>
                                <div class="text-xs text-gray-500">{{ data.pattern_code }}</div>
                            </div>
                        </template>
                    </Column>

                    <Column field="material_id" header="Material ID" style="min-width: 10rem" sortable />

                    <Column field="material_desc" header="Description" style="min-width: 15rem" sortable />

                    <Column field="normal_qty" header="Normal Qty" style="min-width: 8rem" sortable>
                        <template #body="{ data }">
                            <div
                                class="font-semibold"
                                :class="{
                                    'text-green-600': data.normal_qty !== 'Not Set' && data.normal_qty > 0,
                                    'text-gray-400': data.normal_qty === 'Not Set' || data.normal_qty === 0
                                }"
                            >
                                {{ data.normal_qty }}
                            </div>
                        </template>
                    </Column>

                    <Column field="ds_qty" header="DS Qty" style="min-width: 8rem" sortable>
                        <template #body="{ data }">
                            <div
                                class="font-semibold"
                                :class="{
                                    'text-blue-600': data.ds_qty !== 'Not Set' && data.ds_qty > 0,
                                    'text-gray-400': data.ds_qty === 'Not Set' || data.ds_qty === 0
                                }"
                            >
                                {{ data.ds_qty }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Initial State -->
            <div v-else-if="!showResults && !loadingEtenMaterials" class="text-center py-12 bg-gray-50 rounded-lg">
                <i class="pi pi-search text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Select Criteria</h3>
                <p class="text-gray-500 mb-4">Please select at least one dealer and click "Load Materials" to view data.</p>
            </div>
        </div>

        <!-- Import Result Dialog -->
        <Dialog v-model:visible="showImportResult" header="Import Results" :modal="true" :style="{ width: '600px' }">
            <div class="p-4">
                <div class="mb-4">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-check-circle text-green-500"></i>
                        <span class="font-medium">Successfully imported: {{ importResult.saved_count }} records</span>
                    </div>
                    <div v-if="importResult.not_saved_records && importResult.not_saved_records.length > 0">
                        <div class="flex items-center gap-2 mb-2">
                            <i class="pi pi-exclamation-triangle text-yellow-500"></i>
                            <span class="font-medium">Failed to import: {{ importResult.not_saved_records.length }} records</span>
                        </div>
                        <DataTable :value="importResult.not_saved_records" class="p-datatable-sm">
                            <Column field="row" header="Row"></Column>
                            <Column field="materialid" header="Material ID"></Column>
                            <Column field="reason" header="Reason"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" @click="showImportResult = false" class="p-button-text" />
                <Button label="Refresh Data" icon="pi pi-refresh" @click="handleImportComplete" class="p-button-primary" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const toast = useToast();
const menuStore = useMenuStore();
const importFileInput = ref();

const canUpdate = computed(() => menuStore.canWrite('Material Management'));

const globalLoading = ref(false);
const loadingDealers = ref(false);
const loadingMaterialsList = ref(false);
const loadingEtenMaterials = ref(false);
const tableLoading = ref(false);
const exportLoading = ref(false);
const importLoading = ref(false);
const showImportResult = ref(false);
const showResults = ref(false);
const materialsLoaded = ref(false);

const dealerList = ref([]);
const materialListData = ref([]); // From list-material API
const selectedDealers = ref([]);
const selectedMaterials = ref([]);
const selectedDealersData = ref([]);
const materialList = ref([]);
const importResult = ref({});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const dealerOptions = computed(() => {
    return dealerList.value.map((dealer) => {
        const shopData = dealer.shop || dealer;
        return {
            label: `${shopData.companyName1} (${shopData.custAccountNo})`,
            value: shopData.id,
            data: dealer
        };
    });
});

const materialOptions = computed(() => {
    return materialListData.value.map((material) => ({
        label: `${material.materialid} - ${material.material}`,
        value: material.materialid,
        data: material
    }));
});

const hasSelections = computed(() => {
    return selectedDealers.value.length > 0 || selectedMaterials.value.length > 0;
});

const canLoadMaterials = computed(() => {
    return selectedDealers.value.length > 0;
});

const canExport = computed(() => {
    return selectedDealers.value.length > 0 && materialList.value.length > 0;
});

const canImport = computed(() => {
    return selectedDealers.value.length > 0;
});

const getSelectedDealerNames = (dealerIds) => {
    return dealerIds.map(id => {
        const dealer = dealerOptions.value.find(d => d.value === id);
        return dealer || { label: 'Unknown', value: id };
    });
};

const getSelectedMaterialNames = (materialIds) => {
    return materialIds.map(id => {
        const material = materialOptions.value.find(m => m.value === id);
        return material || { label: id, value: id };
    });
};

const fetchDealers = async () => {
    try {
        loadingDealers.value = true;
        const response = await api.post('list_dealer', {
            tabs: 'ORDER'
        });

        if (response.data.status === 1) {
            let dealers = response.data.admin_data;
            if (dealers && typeof dealers === 'object' && !Array.isArray(dealers)) {
                dealers = Object.values(dealers);
            }
            dealerList.value = Array.isArray(dealers) ? dealers : [];
        } else {
            dealerList.value = [];
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'No dealers found',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching dealers:', error);
        dealerList.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dealers',
            life: 3000
        });
    } finally {
        loadingDealers.value = false;
    }
};

const fetchMaterialList = async () => {
    try {
        loadingMaterialsList.value = true;
        const response = await api.post('list-material', {
            type: 'SETMAX'
        });

        if (response.data.status === 1) {
            materialListData.value = response.data.admin_data || [];
            materialsLoaded.value = true;
        } else {
            materialListData.value = [];
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'No materials found',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching materials:', error);
        materialListData.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load materials',
            life: 3000
        });
    } finally {
        loadingMaterialsList.value = false;
        globalLoading.value = false;
    }
};

const onSelectionChange = () => {
    showResults.value = false;
    materialList.value = [];
};

const fetchEtenMaterials = async () => {
    if (!selectedDealers.value.length) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select at least one dealer',
            life: 3000
        });
        return;
    }

    try {
        loadingEtenMaterials.value = true;
        tableLoading.value = true;

        // Prepare request data
        const requestData = {
            ids: selectedDealers.value
        };

        // Only add materialid if materials are selected
        if (selectedMaterials.value.length > 0) {
            requestData.materialid = selectedMaterials.value;
        }

        const response = await api.post('maintenance/getEtenMaterial', requestData);

        if (response.data.status === 1) {
            materialList.value = response.data.admin_data;
            showResults.value = true;
            
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Loaded ${materialList.value.length} material records`,
                life: 3000
            });
        } else {
            materialList.value = [];
            showResults.value = true;
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.data.error || 'No materials found for selected criteria',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching ETEN materials:', error);
        materialList.value = [];
        showResults.value = false;
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load materials',
            life: 3000
        });
    } finally {
        loadingEtenMaterials.value = false;
        tableLoading.value = false;
    }
};

const exportMaterials = async () => {
    if (!selectedDealers.value.length) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select at least one dealer',
            life: 3000
        });
        return;
    }

    try {
        exportLoading.value = true;

        // Prepare request data
        const requestData = {
            ids: selectedDealers.value
        };

        // Only add materialid if materials are selected
        if (selectedMaterials.value.length > 0) {
            requestData.materialid = selectedMaterials.value;
        }

        const response = await api.postExtra('maintenance/exportEtenMaterial', requestData, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eten_materials_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Export completed successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Error exporting materials:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to export materials',
            life: 3000
        });
    } finally {
        exportLoading.value = false;
    }
};

const triggerImport = () => {
    if (!selectedDealers.value.length) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select at least one dealer first',
            life: 3000
        });
        return;
    }

    if (importFileInput.value) {
        importFileInput.value.click();
    }
};

const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedDealers.value.length) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No dealers selected',
            life: 3000
        });
        return;
    }

    try {
        importLoading.value = true;

        const formData = new FormData();
        formData.append('excel_file', file);
        // You might want to pass dealer IDs in the import request too
        formData.append('dealer_ids', JSON.stringify(selectedDealers.value));

        const response = await api.postExtra('maintenance/importEtenMaterial', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            importResult.value = response.data;
            showImportResult.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Imported ${response.data.saved_count} records successfully`,
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: response.data.error || 'Failed to import file',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error importing file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Import failed. Please check the file format.',
            life: 5000
        });
    } finally {
        importLoading.value = false;
        if (importFileInput.value) {
            importFileInput.value.value = '';
        }
    }
};

const handleImportComplete = async () => {
    showImportResult.value = false;
    await fetchEtenMaterials();
};

const clearAllSelections = () => {
    selectedDealers.value = [];
    selectedMaterials.value = [];
    selectedDealersData.value = [];
    materialList.value = [];
    showResults.value = false;
};

onMounted(async () => {
    globalLoading.value = true;
    await Promise.all([fetchDealers(), fetchMaterialList()]);
    globalLoading.value = false;
});
</script>

<style scoped>
/* Keep your existing styles, they work well */
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 1.5rem;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        background-color: #f9fafb;
        border-top: 1px solid #e5e7eb;
    }

    .p-datatable-thead > tr > th {
        background-color: #f3f4f6;
        font-weight: 600;
        color: #374151;

        &:first-child {
            border-top-left-radius: 0;
        }
        &:last-child {
            border-top-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr {
        transition: background-color 0.2s;

        &:hover {
            background-color: #f9fafb;
        }
    }
}

.dealer-selector {
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    :deep(.rounded-table) {
        .p-datatable-header {
            flex-direction: column;
            gap: 1rem;
        }

        .flex.items-center.justify-between {
            flex-direction: column;
            align-items: stretch;
        }

        .ml-auto {
            margin-left: 0;
            margin-top: 1rem;
        }
    }
}
</style>