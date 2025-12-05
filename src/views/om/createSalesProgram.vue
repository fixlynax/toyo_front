<template>
    <Fluid>
        <Toast />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Sales Program</div>

                <!-- Sales Program Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="salesProgram.programName" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="salesProgram.desc" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="salesProgram.startdate" showIcon dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="salesProgram.enddate" showIcon dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price Group</label>
                            <InputText v-model="salesProgram.pricegroup" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Program Type</label>
                            <InputText v-model="salesProgram.type" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Sales Program ID</label>
                            <InputText v-model="salesProgram.programID" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Show Sales Program</label>
                            <Dropdown v-model="salesProgram.showSP" :options="showOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select Availability " />
                        </div>
                    </div>
                </div>

                <!-- Upload Image -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">
                        Upload Sales Program Image
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">(Max file size: 2 MB)</span>
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" :maxFileSize="2 * 1024 * 1024" customUpload @select="onImageSelect" @error="onUploadError" chooseLabel="Upload Program Image" class="w-full" />
                            <div v-if="imagePreview" class="mt-2">
                                <img :src="imagePreview" alt="Preview" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <p class="text-xs text-gray-500 mt-1 text-center">File size: {{ formatFileSize(currentFileSize) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Single Criteria Section -->
                <div>
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
                    </div>

                    <!-- Single Criteria Item -->
                    <div class="border rounded-xl p-6 shadow-sm bg-gray-100 hover:shadow-md transition-shadow duration-200">
                        <!-- Quantities Card -->
                        <div class="rounded-lg mb-6">
                            <h4 class="font-semibold text-black-800 mb-3 flex items-center gap-2">
                                <i class="pi pi-shopping-cart text-black-600"></i>
                                Purchase Requirements
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-1">Buy Quantity</label>
                                    <div class="flex items-center gap-2">
                                        <InputNumber v-model="programItem.buyQty" class="w-full" :min="1" showButtons />
                                        <span class="text-sm text-blue-600 font-medium">items</span>
                                    </div>
                                    <p class="text-xs text-blue-600 mt-1">Number of items customer needs to purchase</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-green-700 mb-1">Free Quantity</label>
                                    <div class="flex items-center gap-2">
                                        <InputNumber v-model="programItem.freeQty" class="w-full" :min="1" disabled />
                                        <span class="text-sm text-green-600 font-medium">items</span>
                                    </div>
                                    <p class="text-xs text-green-600 mt-1">Number of free items customer will receive</p>
                                </div>
                            </div>
                        </div>

                        <!-- Buy Materials Section -->
                        <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center gap-2">
                                    <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                        <i class="pi pi-tags text-blue-600"></i>
                                        Buy Materials
                                    </h4>
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Select materials to include in promotion</span>
                                </div>
                                <div class="flex gap-2">
                                    <Button v-if="programItem.buyMaterials.length > 0" icon="pi pi-times" label="Clear All" style="width: fit-content" class="p-button-text p-button-sm p-button-danger" @click="clearAllBuySelections" />
                                    <Button icon="pi pi-plus" label="Add Materials" style="width: fit-content" class="p-button-primary p-button-sm" @click="openMaterialPopup" :loading="loadingMaterials" :disabled="loadingMaterials" />
                                </div>
                            </div>

                            <!-- Selected Buy Materials Display -->
                            <div v-if="programItem.buyMaterials.length > 0" class="mt-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">Selected Buy Materials ({{ programItem.buyMaterials.length }})</span>
                                    <Badge :value="`${programItem.buyMaterials.length} materials`" severity="info" />
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-blue-200 rounded-lg bg-white">
                                    <div
                                        v-for="(material, index) in programItem.buyMaterials"
                                        :key="material.materialid + '_' + index"
                                        class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-medium text-blue-800 truncate">{{ material.materialid }}</div>
                                            <div class="flex flex-wrap items-center gap-2 mt-1">
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">{{ material.patternDisplay }}</span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ material.rimdiameter }}"</span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Desc: {{ material.material }}</span>
                                            </div>
                                        </div>
                                        <Button icon="pi pi-times" class="p-button-danger p-button-text p-button-sm" @click="removeBuyMaterial(index)" />
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mt-4">
                                <i class="pi pi-inbox text-3xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500 text-sm">No buy materials selected</p>
                                <p class="text-gray-400 text-xs mt-1">Click "Add Materials" to select materials for this promotion</p>
                            </div>
                        </div>

                        <!-- Free Material Section -->
                        <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center gap-2">
                                    <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                        <i class="pi pi-gift text-green-600"></i>
                                        Free Material
                                    </h4>
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Select one</span>
                                </div>
                                <Button v-if="programItem.selectedFreeMaterial" icon="pi pi-times" label="Clear Selection" style="width: fit-content" class="p-button-text p-button-sm p-button-danger" @click="clearFreeSelection" />
                            </div>

                            <!-- Free Material Selection -->
                            <div class="flex flex-col">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Free Material & Quota</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Dropdown -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Free Material</label>
                                        <Dropdown
                                            v-model="programItem.selectedFreeMaterial"
                                            :options="freeMaterialOptions"
                                            optionLabel="material"
                                            optionValue="materialid"
                                            placeholder="Select Free Material"
                                            class="w-full"
                                            :filter="true"
                                            :loading="loadingFreeMaterials"
                                            @change="onFreeMaterialChange"
                                            :filterFields="['material', 'materialid']"
                                        >
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value" class="flex items-center">
                                                    <div>
                                                        <div class="font-medium">{{ getFreeMaterialLabel(slotProps.value) }}</div>
                                                        <div class="text-xs text-gray-500">{{ slotProps.value }}</div>
                                                        <!-- Show material ID -->
                                                    </div>
                                                </div>
                                                <span v-else>
                                                    {{ slotProps.placeholder }}
                                                </span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="flex items-center">
                                                    <div>
                                                        <div class="font-medium">{{ slotProps.option.material }}</div>
                                                        <div class="text-xs text-gray-500">{{ slotProps.option.materialid }}</div>
                                                        <!-- Show material ID -->
                                                    </div>
                                                </div>
                                            </template>
                                        </Dropdown>
                                    </div>

                                    <!-- InputNumber -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Free Quota</label>
                                        <InputNumber v-model="programItem.freeQuota" class="w-full" :min="1" showButtons />
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Free Material Display -->
                            <div v-if="programItem.selectedFreeMaterial && programItem.freeMaterialData" class="space-y-3 mt-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">Selected Free Material Details</span>
                                </div>

                                <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-green-800">{{ programItem.freeMaterialData.material }}</div>
                                        <div class="text-xs text-green-600 mt-1">Material ID: {{ programItem.freeMaterialData.materialid }}</div>
                                        <div class="text-xs text-green-600">Pattern: {{ programItem.freeMaterialData.pattern }}</div>
                                        <div class="text-xs text-green-600">Rim: {{ programItem.freeMaterialData.rimdiameter }}"</div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mt-4">
                                <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500 text-sm">No free material selected</p>
                                <p class="text-gray-400 text-xs mt-1">Select a free material from the dropdown</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end gap-2 mt-8">
                    <div class="w-40">
                        <RouterLink to="/om/listSalesProgram">
                            <Button label="Cancel" class="w-full p-button-secondary" />
                        </RouterLink>
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="submitForm" :loading="submitting" :disabled="submitting" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Material Selection Popup -->
        <Dialog v-model:visible="materialPopupVisible" modal header="Select Buy Materials" :style="{ width: '90vw', maxWidth: '1200px' }" class="p-fluid">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Filter Section -->
                <div class="lg:col-span-1 space-y-4">
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h5 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <i class="pi pi-filter text-blue-500"></i>
                            Filter Materials
                        </h5>

                        <!-- Pattern Filter - MultiSelect -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                            <MultiSelect
                                v-model="materialFilter.selectedPatterns"
                                :options="buyPatternOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Patterns"
                                class="w-full"
                                :filter="true"
                                display="chip"
                                @change="onPatternFilterChange"
                            >
                                <template #value="slotProps">
                                    <div v-if="slotProps.value && slotProps.value.length > 0" class="flex flex-wrap gap-1">
                                        <span v-for="pattern in getSelectedPatternLabels(slotProps.value)" :key="pattern.value" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {{ pattern.label }}
                                        </span>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                            </MultiSelect>
                        </div>

                        <!-- Rim Diameter Filter - MultiSelect -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rim Diameter</label>
                            <MultiSelect
                                v-model="materialFilter.selectedRims"
                                :options="materialFilter.availableRims"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Rim Diameters"
                                class="w-full"
                                :filter="true"
                                display="chip"
                                :disabled="!materialFilter.selectedPatterns || materialFilter.selectedPatterns.length === 0"
                            />
                        </div>

                        <!-- Filter Actions -->
                        <div class="flex gap-2">
                            <Button label="Apply Filter" icon="pi pi-search" class="p-button-primary p-button-sm w-full" @click="applyMaterialFilter" />
                            <Button label="Clear" icon="pi pi-refresh" class="p-button-secondary p-button-sm w-full" @click="clearMaterialFilter" />
                        </div>
                    </div>

                    <!-- Selected Count -->
                    <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                        <h5 class="font-semibold text-green-700 mb-2">Selection Summary</h5>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-green-600">Selected:</span>
                                <Badge :value="selectedMaterialsCount" severity="success" />
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-green-600">Filtered:</span>
                                <Badge :value="filteredMaterials.length" severity="info" />
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-green-600">Patterns:</span>
                                <Badge :value="materialFilter.selectedPatterns?.length || 0" severity="warning" />
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-green-600">Rims:</span>
                                <Badge :value="materialFilter.selectedRims?.length || 0" severity="warning" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Materials List -->
                <div class="lg:col-span-3">
                    <div class="border border-gray-200 rounded-lg p-4 bg-white">
                        <div class="flex items-center justify-between mb-4">
                            <h5 class="font-semibold text-gray-700">Available Materials</h5>
                            <div class="flex gap-2">
                                <Button v-if="filteredMaterials.length > 0" :label="`Select All (${filteredMaterials.length})`" icon="pi pi-check" class="p-button-outlined p-button-success p-button-sm" @click="selectAllFiltered" />
                                <Button v-if="selectedMaterialsCount > 0" label="Clear Selection" icon="pi pi-times" class="p-button-outlined p-button-danger p-button-sm" @click="clearSelectionInPopup" />
                            </div>
                        </div>

                        <!-- Search Bar -->
                        <div class="mb-4">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-search"></i>
                                </span>
                                <InputText v-model="materialSearch" placeholder="Search materials by ID, description, pattern..." class="w-full" @input="onMaterialSearch" />
                                <Button v-if="materialSearch" icon="pi pi-times" class="p-button-text" @click="clearMaterialSearch" />
                            </div>
                        </div>

                        <div v-if="filteredMaterials.length > 0" class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                            <DataTable
                                :value="filteredMaterials"
                                v-model:selection="selectedMaterials"
                                removableSort
                                selectionMode="multiple"
                                dataKey="materialid"
                                class="p-datatable-sm"
                                :scrollable="true"
                                scrollHeight="flex"
                                :loading="loadingMaterials"
                            >
                                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                                <Column field="materialid" header="Material ID" sortable>
                                    <template #body="{ data }">
                                        <span class="font-mono text-sm">{{ data.materialid }}</span>
                                    </template>
                                </Column>
                                <Column field="material" header="Description" sortable>
                                    <template #body="{ data }">
                                        <div class="font-medium">{{ data.material }}</div>
                                    </template>
                                </Column>
                                <Column field="pattern" header="Pattern" sortable>
                                    <template #body="{ data }">
                                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{{ data.patternDisplay }}</span>
                                    </template>
                                </Column>
                                <Column field="rimdiameter" header="Rim" sortable>
                                    <template #body="{ data }">
                                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{{ data.rimdiameter }}"</span>
                                    </template>
                                </Column>
                                <Column field="sectionwidth" header="Section Width" sortable>
                                    <template #body="{ data }">
                                        <span class="text-gray-600 text-sm">{{ data.sectionwidth }}</span>
                                    </template>
                                </Column>
                                <template #empty>
                                    <div class="text-center py-8">
                                        <i class="pi pi-search text-3xl text-gray-300 mb-2"></i>
                                        <p class="text-gray-500">No materials found</p>
                                        <p class="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                    </div>
                                </template>
                                <template #loading>
                                    <div class="text-center py-8">
                                        <i class="pi pi-spinner pi-spin text-2xl text-blue-500 mb-2"></i>
                                        <p class="text-gray-500">Loading materials...</p>
                                    </div>
                                </template>
                            </DataTable>
                        </div>

                        <div v-else-if="!loadingMaterials" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                            <p class="text-gray-500">No materials found</p>
                            <p class="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between items-center w-full">
                    <div class="text-sm text-gray-600">{{ selectedMaterialsCount }} material(s) selected</div>
                    <div class="flex gap-2">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeMaterialPopup" />
                        <Button label="Add Selected" icon="pi pi-check" class="p-button-primary" @click="addSelectedMaterials" :disabled="selectedMaterialsCount === 0 || loadingMaterials" :loading="loadingMaterials" />
                    </div>
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const toast = useToast();

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const salesProgram = ref({
    programID: '',
    showSP: 1,
    pricegroup: '06',
    type: 'FOC',
    programName: '',
    desc: '',
    startdate: '',
    enddate: '',
    status: 1
});

const imageFile = ref(null);
const imagePreview = ref('');
const currentFileSize = ref(0);
const submitting = ref(false);
const loadingMaterials = ref(false);

// Single program item
const programItem = ref({
    buyQty: 1,
    freeQty: 1,
    freeQuota: null,
    buyMaterials: [],
    selectedFreeMaterial: null,
    freeMaterialData: null,
    status: 1
});

// API Data
const buyPatternOptions = ref([]);
const freeMaterialOptions = ref([]);
const loadingBuyPatterns = ref(false);
const loadingFreeMaterials = ref(false);

// Store all materials data for filtering (for buy materials)
const allBuyMaterialsData = ref([]);

// Material Popup
const materialPopupVisible = ref(false);
const selectedMaterials = ref([]);
const filteredMaterials = ref([]);
const materialSearch = ref('');

// Material Filter - Updated for multi-select
const materialFilter = ref({
    selectedPatterns: [], // Changed from selectedPattern to selectedPatterns (array)
    selectedRims: [], // Changed from selectedRim to selectedRims (array)
    availableRims: []
});

const showOptions = ref([
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
]);

// Computed
const selectedMaterialsCount = computed(() => selectedMaterials.value.length);

// Toast notification functions
const showSuccess = (message) => {
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000
    });
};

const showError = (message) => {
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000
    });
};

const showWarning = (message) => {
    toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: message,
        life: 4000
    });
};

const showInfo = (message) => {
    toast.add({
        severity: 'info',
        summary: 'Information',
        detail: message,
        life: 3000
    });
};

// Helper function to get selected pattern labels
const getSelectedPatternLabels = (selectedPatternValues) => {
    return selectedPatternValues.map((patternValue) => {
        const pattern = buyPatternOptions.value.find((p) => p.value === patternValue);
        return {
            value: patternValue,
            label: pattern ? pattern.label : patternValue
        };
    });
};

// Material Search Function
const onMaterialSearch = () => {
    applyMaterialFilter();
};

const clearMaterialSearch = () => {
    materialSearch.value = '';
    applyMaterialFilter();
};

// Material Popup Functions
const openMaterialPopup = async () => {
    materialPopupVisible.value = true;
    // Reset selection when opening popup
    selectedMaterials.value = [];
    materialSearch.value = '';

    // Show loading state
    loadingMaterials.value = true;

    try {
        // Load buy materials data for filtering
        await loadBuyMaterialsData();
        // Show all materials initially
        filteredMaterials.value = [...allBuyMaterialsData.value];
    } catch (error) {
        console.error('Error loading materials:', error);
        showError('Failed to load materials');
    } finally {
        loadingMaterials.value = false;
    }
};

const closeMaterialPopup = () => {
    materialPopupVisible.value = false;
    selectedMaterials.value = [];
    materialSearch.value = '';
    materialFilter.value = {
        selectedPatterns: [],
        selectedRims: [],
        availableRims: []
    };
    loadingMaterials.value = false;
};

// Updated pattern filter change handler
const onPatternFilterChange = () => {
    materialFilter.value.selectedRims = [];
    materialFilter.value.availableRims = [];

    if (materialFilter.value.selectedPatterns && materialFilter.value.selectedPatterns.length > 0) {
        const allRims = new Set();

        materialFilter.value.selectedPatterns.forEach((patternValue) => {
            const patternData = buyPatternOptions.value.find((p) => p.value === patternValue);
            if (patternData && patternData.rimSizes) {
                patternData.rimSizes.forEach((rim) => {
                    allRims.add(rim);
                });
            }
        });

        materialFilter.value.availableRims = Array.from(allRims)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .map((rim) => ({
                label: `${rim}"`,
                value: rim.toString()
            }));
    }
};

// Updated apply material filter function
const applyMaterialFilter = () => {
    let filtered = [...allBuyMaterialsData.value];

    // Apply pattern filter (multiple patterns)
    if (materialFilter.value.selectedPatterns && materialFilter.value.selectedPatterns.length > 0) {
        filtered = filtered.filter((material) => materialFilter.value.selectedPatterns.includes(material.pattern));
    }

    // Apply rim diameter filter (multiple rims)
    if (materialFilter.value.selectedRims && materialFilter.value.selectedRims.length > 0) {
        filtered = filtered.filter((material) => materialFilter.value.selectedRims.includes(material.rimdiameter.toString()));
    }

    // Apply search filter
    if (materialSearch.value) {
        const searchTerm = materialSearch.value.toLowerCase();
        filtered = filtered.filter(
            (material) =>
                material.materialid.toLowerCase().includes(searchTerm) ||
                material.material.toLowerCase().includes(searchTerm) ||
                material.pattern.toLowerCase().includes(searchTerm) ||
                material.rimdiameter.toString().includes(searchTerm) ||
                (material.sectionwidth && material.sectionwidth.toString().includes(searchTerm))
        );
    }

    filteredMaterials.value = filtered;
    selectedMaterials.value = []; // Clear selection when filter changes
};

const clearMaterialFilter = () => {
    materialFilter.value = {
        selectedPatterns: [],
        selectedRims: [],
        availableRims: []
    };
    materialSearch.value = '';
    filteredMaterials.value = [...allBuyMaterialsData.value];
    selectedMaterials.value = [];
};

const selectAllFiltered = () => {
    selectedMaterials.value = [...filteredMaterials.value];
};

const clearSelectionInPopup = () => {
    selectedMaterials.value = [];
};

const addSelectedMaterials = async () => {
    if (selectedMaterials.value.length === 0) {
        showWarning('Please select at least one material');
        return;
    }

    loadingMaterials.value = true;

    try {
        // Add only new materials (check by materialid)
        let addedCount = 0;
        selectedMaterials.value.forEach((material) => {
            const exists = programItem.value.buyMaterials.some((existing) => existing.materialid === material.materialid);
            if (!exists) {
                programItem.value.buyMaterials.push({
                    materialid: material.materialid,
                    material: material.material,
                    pattern: material.pattern,
                    patternDisplay: material.patternDisplay,
                    rimdiameter: material.rimdiameter,
                    status: 1
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            showSuccess(`Added ${addedCount} material(s) to buy materials`);
        } else {
            showInfo('All selected materials are already added');
        }

        closeMaterialPopup();
    } catch (error) {
        console.error('Error adding materials:', error);
        showError('Failed to add materials');
    } finally {
        loadingMaterials.value = false;
    }
};

// Existing helper functions
const removeBuyMaterial = (index) => {
    programItem.value.buyMaterials.splice(index, 1);
    showInfo('Buy material removed');
};

const clearAllBuySelections = () => {
    programItem.value.buyMaterials = [];
    showInfo('All buy material selections cleared');
};

const onFreeMaterialChange = () => {
    if (programItem.value.selectedFreeMaterial) {
        const selectedMaterial = freeMaterialOptions.value.find((material) => material.materialid === programItem.value.selectedFreeMaterial);
        programItem.value.freeMaterialData = selectedMaterial ? { ...selectedMaterial } : null;
        showInfo('Free material selected');
    } else {
        programItem.value.freeMaterialData = null;
    }
};

const clearFreeSelection = () => {
    programItem.value.selectedFreeMaterial = null;
    programItem.value.freeMaterialData = null;
    showInfo('Free material selection cleared');
};

const getFreeMaterialLabel = (materialId) => {
    const material = freeMaterialOptions.value.find((m) => m.materialid === materialId);
    return material ? `${material.material} (${material.materialid})` : materialId;
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateImageFile = (file) => {
    if (!file) {
        return { valid: false, message: 'Please select an image file' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            message: `File size too large. Maximum allowed size is ${formatFileSize(MAX_FILE_SIZE)}. Your file is ${formatFileSize(file.size)}.`
        };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        return { valid: false, message: 'Please select a valid image file' };
    }

    return { valid: true };
};

const onImageSelect = (event) => {
    const file = event.files[0];
    if (file) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
            showError(validation.message);
            return;
        }

        imageFile.value = file;
        currentFileSize.value = file.size;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);

        showSuccess(`Image selected successfully (${formatFileSize(file.size)})`);
    }
};

const onUploadError = (event) => {
    if (event.xhr && event.xhr.status) {
        showError(`Upload failed: ${event.xhr.statusText}`);
    } else {
        showError('File upload failed. Please check the file size and try again.');
    }
};

// Updated loadBuyPatterns function to show "code - pattern name" format
const loadBuyPatterns = async () => {
    try {
        loadingBuyPatterns.value = true;
        const response = await api.get('criteria-selection');

        if (response.data.status === 1) {
            const patternsData = response.data.admin_data;
            const patterns = [];

            for (const [patternCode, patternNamesData] of Object.entries(patternsData)) {
                for (const [patternName, rimData] of Object.entries(patternNamesData)) {
                    const rimSizes = Object.keys(rimData)
                        .map((rim) => parseFloat(rim))
                        .sort((a, b) => a - b);

                    // Create label in "code - pattern name" format
                    const label = `${patternCode} - ${patternName}`;

                    patterns.push({
                        label: label,
                        value: patternCode,
                        patternName: patternName,
                        rimSizes: rimSizes
                    });
                }
            }

            // Remove duplicates by pattern code (keep first occurrence)
            const uniquePatterns = patterns.filter((pattern, index, self) => index === self.findIndex((p) => p.value === pattern.value));

            buyPatternOptions.value = uniquePatterns;
        }
    } catch (error) {
        console.error('Error loading buy patterns:', error);
        showError('Failed to load buy patterns');
    } finally {
        loadingBuyPatterns.value = false;
    }
};

// Updated loadBuyMaterialsData function to include patternDisplay
const loadBuyMaterialsData = async () => {
    try {
        const response = await api.get('criteria-selection');

        if (response.data.status === 1) {
            const patternsData = response.data.admin_data;
            const materials = [];

            // Convert the nested structure to a flat array of materials
            for (const [patternCode, patternNamesData] of Object.entries(patternsData)) {
                for (const [patternName, rimData] of Object.entries(patternNamesData)) {
                    for (const [rimDiameter, materialDescriptions] of Object.entries(rimData)) {
                        materialDescriptions.forEach((materialDesc) => {
                            const [materialid, material] = materialDesc.split('|').map((item) => item.trim());

                            materials.push({
                                materialid: materialid,
                                material: material,
                                pattern: patternCode,
                                patternDisplay: `${patternCode} - ${patternName}`, // Add display format
                                rimdiameter: parseFloat(rimDiameter),
                                sectionwidth: extractSectionWidth(material)
                            });
                        });
                    }
                }
            }

            allBuyMaterialsData.value = materials;
        }
    } catch (error) {
        console.error('Error loading buy materials data:', error);
        showError('Failed to load buy materials data');
        throw error;
    }
};

// Helper function to extract section width from material description
const extractSectionWidth = (materialDesc) => {
    const match = materialDesc.match(/(\d+)\/\d+\s+R/);
    return match ? parseInt(match[1]) : null;
};

// API Functions for Free Materials (using list-material API with SALESPROGRAM type)
const loadFreeMaterials = async () => {
    try {
        loadingFreeMaterials.value = true;
        const response = await api.post('list-material', {
            type: 'SALESPROGRAM'
        });

        if (response.data.status === 1) {
            freeMaterialOptions.value = response.data.admin_data;
        }
    } catch (error) {
        console.error('Error loading free materials:', error);
        showError('Failed to load free materials');
    } finally {
        loadingFreeMaterials.value = false;
    }
};

const validateForm = () => {
    if (!salesProgram.value.programID) {
        showError('Please enter Sales Program ID');
        return false;
    }

    if (!salesProgram.value.showSP) {
        showError('Please enter Sales Program ID');
        return false;
    }

    if (!salesProgram.value.programName) {
        showError('Please enter Program Name');
        return false;
    }

    if (!salesProgram.value.startdate || !salesProgram.value.enddate) {
        showError('Please select both Start Date and End Date');
        return false;
    }

    // Validate dates
    const startDate = new Date(salesProgram.value.startdate);
    const endDate = new Date(salesProgram.value.enddate);

    if (endDate <= startDate) {
        showError('End date must be after start date');
        return false;
    }

    // if (!imageFile.value) {
    //     showError('Please upload an image');
    //     return false;
    // }

    // Validate image file size
    const imageValidation = validateImageFile(imageFile.value);
    if (!imageValidation.valid) {
        showError(imageValidation.message);
        return false;
    }

    // Validate buy materials
    if (programItem.value.buyMaterials.length === 0) {
        showError('Please select at least one buy material');
        return false;
    }

    // Validate free material
    if (!programItem.value.selectedFreeMaterial) {
        showError('Please select free material');
        return false;
    }
    if (!programItem.value.freeQuota || programItem.value.freeQuota < 1) {
        showError('Please enter free quota');
        return false;
    }

    return true;
};

const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        submitting.value = true;

        // ✅ Generate spFOC_array in the correct format for API
        const spFOCArray = programItem.value.buyMaterials.map((material) => ({
            materialid: material.materialid,
            status: material.status
        }));

        console.log('Generated spFOC_array:', JSON.stringify(spFOCArray, null, 2));

        // Prepare FormData
        const formData = new FormData();

        formData.append('programID', salesProgram.value.programID);
        formData.append('showSP', salesProgram.value.showSP);
        formData.append('pricegroup', salesProgram.value.pricegroup);
        formData.append('type', salesProgram.value.type);
        formData.append('programName', salesProgram.value.programName);
        formData.append('desc', salesProgram.value.desc);
        formData.append('startdate', formatDate(salesProgram.value.startdate));
        formData.append('enddate', formatDate(salesProgram.value.enddate));
        formData.append('status', salesProgram.value.status);
        formData.append('image', imageFile.value);

        // ✅ Append spFOC_array as a JSON string
        formData.append('spFOC_array', JSON.stringify(spFOCArray));

        // Append individual fields
        formData.append('freematerialid', programItem.value.selectedFreeMaterial || '');
        formData.append('freematerialdesc', programItem.value.freeMaterialData?.material || '');
        formData.append('buyQty', programItem.value.buyQty);
        formData.append('freeQty', programItem.value.freeQty);
        formData.append('freeQuota', programItem.value.freeQuota || '');

        console.log('Submitting form data:', {
            programID: salesProgram.value.programID,
            showSP: salesProgram.value.showSP,
            pricegroup: salesProgram.value.pricegroup,
            programName: salesProgram.value.programName,
            desc: salesProgram.value.desc,
            startdate: formatDate(salesProgram.value.startdate),
            enddate: formatDate(salesProgram.value.enddate),
            spFOC_array: JSON.stringify(spFOCArray),
            freematerialid: programItem.value.selectedFreeMaterial,
            freematerialdesc: programItem.value.freeMaterialData?.material,
            buyQty: programItem.value.buyQty,
            freeQty: programItem.value.freeQty,
            freeQuota: programItem.value.freeQuota,
            imageFile: imageFile.value?.name || 'N/A',
            status: salesProgram.value.status,
            type: salesProgram.value.type
        });

        const response = await api.postExtra('sales-program/create-sales-program', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            showSuccess('Sales program created successfully!');
            setTimeout(() => {
                window.location.href = '/om/listSalesProgram';
            }, 1500);
        } else {
            showError('Error creating sales program: ' + (response.data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Error submitting form, please try again');
    } finally {
        submitting.value = false;
    }
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Watch for type changes to clear program items
watch(
    () => salesProgram.value.type,
    () => {
        programItem.value = {
            buyQty: 1,
            freeQty: 1,
            freeQuota: null,
            buyMaterials: [],
            selectedFreeMaterial: null,
            freeMaterialData: null,
            status: 1
        };
        showInfo('Program type changed - form has been reset');
    }
);

// Load initial data
onMounted(() => {
    loadBuyPatterns();
    loadFreeMaterials();
    showInfo('Sales program form loaded. Please fill in all required fields.');
});
</script>
