<template>
    <Fluid>
        <Toast />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="flex items-center gap-2">
                        <RouterLink to="/om/listSalesProgram">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Edit Sales Program</div>
                    </div>
                    <div class="inline-flex items-center gap-2">
                        <Tag :value="salesProgram.status === 1 ? 'Active' : 'Inactive'" :severity="salesProgram.status === 1 ? 'success' : 'danger'" />
                    </div>
                </div>

                <!-- Loading State -->
                <LoadingPage v-if="loading" :message="'Loading Sales Program...'" :sub-message="'Fetching program details'" />

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12 text-red-600">
                    <i class="pi pi-exclamation-triangle text-4xl mb-4"></i>
                    <p class="text-lg">Failed to load sales program data</p>
                    <Button label="Retry" class="p-button-outlined p-button-danger mt-4" @click="fetchSalesProgram" />
                </div>

                <!-- Content -->
                <div v-else class="flex flex-col gap-6">
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

                        <div>
                            <label class="block font-bold text-gray-700">Program Type</label>
                            <InputText v-model="salesProgram.type" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Sales Program ID</label>
                            <InputText v-model="salesProgram.programID" class="w-full" disabled />
                        </div>
                    </div>

                    <!-- Upload Image -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">
                            Sales Program Image
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">(Max file size: 2 MB)</span>
                        </label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <FileUpload
                                    mode="basic"
                                    name="image"
                                    accept="image/*"
                                    :maxFileSize="MAX_FILE_SIZE"
                                    customUpload
                                    @select="onImageSelect"
                                    @error="onUploadError"
                                    :chooseLabel="imageFile ? 'Change Image' : 'Upload Program Image'"
                                    class="w-full"
                                />
                                <div class="mt-2">
                                    <!-- Show loading when image is being processed -->
                                    <div v-if="imageLoading" class="rounded-lg shadow-md w-full h-80 bg-gray-200 flex items-center justify-center">
                                        <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
                                        <span class="ml-2 text-gray-600">Loading image...</span>
                                    </div>
                                    <!-- Show image preview or existing image -->
                                    <div v-else-if="imagePreview || salesProgram.imageUrl">
                                        <img :src="imagePreview || salesProgram.imageUrl" alt="Program Image" class="rounded-lg shadow-md object-cover w-full h-80" @error="handleImageError" @load="handleImageLoad" />
                                        <p v-if="currentFileSize" class="text-xs text-gray-500 mt-1 text-center">File size: {{ formatFileSize(currentFileSize) }}</p>
                                        <p v-else-if="salesProgram.imageUrl && !imageFile" class="text-xs text-gray-500 mt-1 text-center">Existing image</p>
                                    </div>
                                    <!-- Show placeholder when no image -->
                                    <div v-else class="rounded-lg shadow-md w-full h-80 bg-gray-200 flex items-center justify-center">
                                        <i class="pi pi-image text-4xl text-gray-400"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Single Criteria Section -->
                    <div v-if="salesProgram.type === 'FOC'">
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

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-blue-200 rounded-lg bg-white">
                                        <div
                                            v-for="(material, index) in programItem.buyMaterials"
                                            :key="material.materialid + '_' + index"
                                            class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <div class="flex-1 min-w-0">
                                                <div class="text-sm font-medium text-blue-800 truncate">{{ material.material }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Pattern: {{ material.pattern }}</span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ material.rimdiameter }}"</span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">ID: {{ material.materialid }}</span>
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
                                            >
                                                <template #value="slotProps">
                                                    <div v-if="slotProps.value" class="flex items-center">
                                                        <div>
                                                            <div class="font-medium">{{ getFreeMaterialLabel(slotProps.value) }}</div>
                                                            <div class="text-xs text-gray-500">{{ slotProps.value }}</div>
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
                                <Button label="Cancel" class="w-full p-button-secondary" :disabled="submitting" />
                            </RouterLink>
                        </div>
                        <div class="w-40">
                            <Button label="Update" class="w-full" @click="submitForm" :loading="submitting" :disabled="submitting" />
                        </div>
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

                        <!-- Pattern Filter -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                            <Dropdown v-model="materialFilter.selectedPattern" :options="buyPatternOptions" optionLabel="label" optionValue="value" placeholder="Select Pattern" class="w-full" :filter="true" @change="onPatternFilterChange" />
                        </div>

                        <!-- Rim Diameter Filter -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rim Diameter</label>
                            <Dropdown
                                v-model="materialFilter.selectedRim"
                                :options="materialFilter.availableRims"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Rim Diameter"
                                class="w-full"
                                :filter="true"
                                :disabled="!materialFilter.selectedPattern"
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
                                <span class="text-sm text-green-600">Existing:</span>
                                <Badge :value="programItem.buyMaterials.length" severity="warning" />
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
                                <Button label="Restore Previous" icon="pi pi-refresh" class="p-button-outlined p-button-warning p-button-sm" @click="restorePreviousSelection" />
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
                                selectionMode="multiple"
                                removableSort
                                dataKey="materialid"
                                class="p-datatable-sm"
                                :scrollable="true"
                                scrollHeight="flex"
                                :loading="loadingMaterials"
                            >
                                <Column selectionMode="multiple" headerStyle="width: 3rem">
                                    <template #header>
                                        <div class="flex items-center gap-2">
                                            <Checkbox v-model="selectAll" :binary="true" @change="onSelectAllChange" />
                                            <span>All</span>
                                        </div>
                                    </template>
                                </Column>
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
                                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{{ data.pattern }}</span>
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
                    <div class="text-sm text-gray-600">
                        {{ selectedMaterialsCount }} material(s) selected
                        <span v-if="selectedMaterialsCount !== programItem.buyMaterials.length" class="text-orange-600 ml-2"> (Previously: {{ programItem.buyMaterials.length }}) </span>
                    </div>
                    <div class="flex gap-2">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeMaterialPopup" />
                        <Button label="Update Selection" icon="pi pi-check" class="p-button-primary" @click="addSelectedMaterials" :disabled="selectedMaterialsCount === 0 || loadingMaterials" :loading="loadingMaterials" />
                    </div>
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const programId = ref(route.params.id);
const loading = ref(false);
const error = ref(false);
const submitting = ref(false);
const imageLoading = ref(false);
const loadingMaterials = ref(false);

// Sales Program Data
const salesProgram = ref({
    programID: '',
    pricegroup: '06',
    type: 'FOC',
    programName: '',
    desc: '',
    startdate: '',
    enddate: '',
    status: 1,
    imageUrl: ''
});

const imageFile = ref(null);
const imagePreview = ref('');
const currentFileSize = ref(0);

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

// Store all buy materials data for filtering (from criteria-selection API)
const allBuyMaterialsData = ref([]);

// Material Popup
const materialPopupVisible = ref(false);
const selectedMaterials = ref([]);
const filteredMaterials = ref([]);
const materialSearch = ref('');
const selectAll = ref(false);

// Store original selection for restore functionality
const originalSelection = ref([]);

// Material Filter
const materialFilter = ref({
    selectedPattern: null,
    selectedRim: null,
    availableRims: []
});

// Computed
const selectedMaterialsCount = computed(() => selectedMaterials.value.length);

// Watch for selection changes to update selectAll checkbox
watch(
    selectedMaterials,
    (newSelection) => {
        if (filteredMaterials.value.length === 0) {
            selectAll.value = false;
            return;
        }

        // Check if all filtered items are selected
        const allFilteredSelected = filteredMaterials.value.every((item) => newSelection.some((selected) => selected.materialid === item.materialid));
        selectAll.value = allFilteredSelected;
    },
    { deep: true }
);

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

// Material Search Function
const onMaterialSearch = () => {
    applyMaterialFilter();
};

const clearMaterialSearch = () => {
    materialSearch.value = '';
    applyMaterialFilter();
};

// Process private images using the API method
const processPrivateImages = async (programData) => {
    if (!programData || !programData.image) {
        return programData;
    }

    const imageUrl = programData.image;

    // If it's already a blob URL or data URL, return as is
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
        programData.imageUrl = imageUrl;
        return programData;
    }

    // Use getPrivateFile to load the image
    try {
        imageLoading.value = true;
        console.log('Processing private image for edit:', imageUrl);
        const blobUrl = await api.getPrivateFile(imageUrl);
        if (blobUrl) {
            programData.imageUrl = blobUrl;
            console.log('Image processed successfully');
        } else {
            console.warn('getPrivateFile returned null/undefined');
            programData.imageUrl = '';
        }
    } catch (error) {
        console.error('Error loading private image in edit:', error);
        // Fallback strategies
        if (imageUrl.includes('salesprogramphotos')) {
            programData.imageUrl = `${window.location.origin}/${imageUrl}`;
        } else {
            programData.imageUrl = '';
        }
    } finally {
        imageLoading.value = false;
    }

    return programData;
};

// Fetch sales program data
const fetchSalesProgram = async () => {
    loading.value = true;
    error.value = false;

    try {
        const response = await api.get(`sales-program/detail-sales-program/${programId.value}`);

        if (response.data.status === 1 && response.data.admin_data.length > 0) {
            let programData = response.data.admin_data[0];

            // Process image first using getPrivateFile
            programData = await processPrivateImages(programData);

            // Map API data to form structure
            salesProgram.value = {
                programID: programData.programid,
                pricegroup: programData.pricegroup,
                type: programData.type,
                programName: programData.title,
                desc: programData.desc,
                startdate: new Date(programData.startDate),
                enddate: new Date(programData.endDate),
                status: programData.status,
                imageUrl: programData.imageUrl
            };

            // Load FOC criteria data
            if (programData.type === 'FOC') {
                await loadProgramCriteria(programData);
            }

            showSuccess('Sales program data loaded successfully');
        } else {
            error.value = true;
            showError('No sales program data found');
        }
    } catch (err) {
        console.error('Error fetching sales program:', err);
        error.value = true;
        showError('Failed to load sales program data');
    } finally {
        loading.value = false;
    }
};

// Load program criteria from API data
const loadProgramCriteria = async (programData) => {
    // Set main program item values
    programItem.value.buyQty = programData.buyQty || 1;
    programItem.value.freeQty = programData.freeQty || 1;
    programItem.value.freeQuota = programData.freeQuota;
    programItem.value.selectedFreeMaterial = programData.free_material;
    programItem.value.status = programData.status;

    // Load free material data
    if (programData.free_material) {
        // Ensure free materials are loaded first
        if (freeMaterialOptions.value.length === 0) {
            await loadFreeMaterials();
        }
        const freeMaterial = freeMaterialOptions.value.find((m) => m.materialid === programData.free_material);
        if (freeMaterial) {
            programItem.value.freeMaterialData = freeMaterial;
        }
    }

    // Load buy materials from FOC criteria
    if (programData.salesProgramFOC && programData.salesProgramFOC.length > 0) {
        // Wait for buy materials data to be loaded
        if (allBuyMaterialsData.value.length === 0) {
            await loadBuyMaterialsData();
        }

        // Map FOC criteria to material details
        programItem.value.buyMaterials = programData.salesProgramFOC
            .map((foc) => {
                // Find the material details from buy materials data
                const materialDetail = allBuyMaterialsData.value.find((m) => m.materialid === foc.materialid);

                return {
                    id: foc.id, // Keep the ID for updates
                    materialid: foc.materialid,
                    material: materialDetail?.material || foc.materialdesc || foc.materialid,
                    pattern: materialDetail?.pattern || 'N/A',
                    rimdiameter: materialDetail?.rimdiameter || 'N/A',
                    status: foc.status
                };
            })
            .filter((material) => material.materialid); // Filter out any invalid materials
    }
};

// Material Popup Functions
const openMaterialPopup = async () => {
    materialPopupVisible.value = true;

    // Store original selection for restore functionality
    originalSelection.value = [...programItem.value.buyMaterials];

    // Show loading state
    loadingMaterials.value = true;

    try {
        // Load buy materials data for filtering
        await loadBuyMaterialsData();
        // Show all materials initially
        filteredMaterials.value = [...allBuyMaterialsData.value];

        // Pre-select materials that are already in programItem.buyMaterials
        preSelectExistingMaterials();
    } catch (error) {
        console.error('Error loading materials:', error);
        showError('Failed to load materials');
    } finally {
        loadingMaterials.value = false;
    }
};

// Pre-select materials that are already selected in the program
const preSelectExistingMaterials = () => {
    if (programItem.value.buyMaterials.length === 0) {
        selectedMaterials.value = [];
        return;
    }

    // Get array of material IDs that are already selected
    const selectedMaterialIds = programItem.value.buyMaterials.map((material) => material.materialid);

    // Find the corresponding material objects from allBuyMaterialsData
    selectedMaterials.value = allBuyMaterialsData.value.filter((material) => selectedMaterialIds.includes(material.materialid));

    console.log('Pre-selected materials:', selectedMaterials.value.length);
    console.log('Selected material IDs:', selectedMaterialIds);
};

const closeMaterialPopup = () => {
    materialPopupVisible.value = false;
    selectedMaterials.value = [];
    materialSearch.value = '';
    materialFilter.value = {
        selectedPattern: null,
        selectedRim: null,
        availableRims: []
    };
    selectAll.value = false;
    loadingMaterials.value = false;
};

const onPatternFilterChange = () => {
    materialFilter.value.selectedRim = null;
    materialFilter.value.availableRims = [];

    if (materialFilter.value.selectedPattern) {
        const patternData = buyPatternOptions.value.find((p) => p.value === materialFilter.value.selectedPattern);
        if (patternData && patternData.rimSizes) {
            materialFilter.value.availableRims = patternData.rimSizes
                .map((rim) => ({
                    label: `${rim}"`,
                    value: rim.toString()
                }))
                .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
        }
    }
};

const applyMaterialFilter = () => {
    let filtered = [...allBuyMaterialsData.value];

    // Apply pattern filter
    if (materialFilter.value.selectedPattern) {
        filtered = filtered.filter((material) => material.pattern === materialFilter.value.selectedPattern);
    }

    // Apply rim diameter filter
    if (materialFilter.value.selectedRim) {
        filtered = filtered.filter((material) => material.rimdiameter.toString() === materialFilter.value.selectedRim);
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

    // Update selection to maintain pre-selected items that are still in the filtered list
    const selectedMaterialIds = selectedMaterials.value.map((material) => material.materialid);
    selectedMaterials.value = filtered.filter((material) => selectedMaterialIds.includes(material.materialid));
};

const clearMaterialFilter = () => {
    materialFilter.value = {
        selectedPattern: null,
        selectedRim: null,
        availableRims: []
    };
    materialSearch.value = '';
    filteredMaterials.value = [...allBuyMaterialsData.value];

    // Restore full selection after clearing filter
    preSelectExistingMaterials();
};

const selectAllFiltered = () => {
    selectedMaterials.value = [...filteredMaterials.value];
};

const clearSelectionInPopup = () => {
    selectedMaterials.value = [];
};

const restorePreviousSelection = () => {
    preSelectExistingMaterials();
    showInfo('Previous selection restored');
};

const onSelectAllChange = (event) => {
    if (event.checked) {
        selectAllFiltered();
    } else {
        clearSelectionInPopup();
    }
};

const addSelectedMaterials = async () => {
    if (selectedMaterials.value.length === 0) {
        showWarning('Please select at least one material');
        return;
    }

    loadingMaterials.value = true;

    try {
        // Replace all existing buy materials with the new selection
        programItem.value.buyMaterials = selectedMaterials.value.map((material) => ({
            materialid: material.materialid,
            material: material.material,
            pattern: material.pattern,
            rimdiameter: material.rimdiameter,
            status: 1
        }));

        showSuccess(`Updated buy materials with ${selectedMaterials.value.length} material(s)`);
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
    return material ? material.material : materialId;
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

// Image handling functions
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
            // Clear the existing image URL when new file is selected
            salesProgram.value.imageUrl = '';
        };
        reader.readAsDataURL(file);

        showSuccess(`Image selected successfully (${formatFileSize(file.size)})`);
    }
};

const handleImageError = (event) => {
    console.warn('Image failed to load:', event.target.src);
    event.target.src = '';
    salesProgram.value.imageUrl = '';
};

const handleImageLoad = () => {
    console.log('Image loaded successfully');
};

const onUploadError = (event) => {
    if (event.xhr && event.xhr.status) {
        showError(`Upload failed: ${event.xhr.statusText}`);
    } else {
        showError('File upload failed. Please check the file size and try again.');
    }
};

// API Functions for Buy Materials (using criteria-selection API)
const loadBuyPatterns = async () => {
    try {
        loadingBuyPatterns.value = true;
        const response = await api.get('criteria-selection');

        if (response.data.status === 1) {
            const patternsData = response.data.admin_data;
            const patterns = [];

            for (const [patternCode, rimData] of Object.entries(patternsData)) {
                for (const [rimDiameter, materialDescriptions] of Object.entries(rimData)) {
                    // Extract pattern name from first material description if available
                    const firstDesc = materialDescriptions[0] || '';
                    const patternName = firstDesc.split('|')[1]?.trim() || patternCode;

                    // Check if pattern already exists
                    const existingPattern = patterns.find((p) => p.value === patternCode);

                    if (existingPattern) {
                        // Add rim size if not already present
                        if (!existingPattern.rimSizes.includes(parseFloat(rimDiameter))) {
                            existingPattern.rimSizes.push(parseFloat(rimDiameter));
                        }
                    } else {
                        patterns.push({
                            label: `${patternCode} - ${patternName}`,
                            value: patternCode,
                            patternName: patternName,
                            rimSizes: [parseFloat(rimDiameter)]
                        });
                    }
                }
            }

            // Sort rim sizes for each pattern
            patterns.forEach((pattern) => {
                pattern.rimSizes.sort((a, b) => a - b);
            });

            buyPatternOptions.value = patterns;
        }
    } catch (error) {
        console.error('Error loading buy patterns:', error);
        showError('Failed to load buy patterns');
    } finally {
        loadingBuyPatterns.value = false;
    }
};

// Load buy materials data from criteria-selection API
const loadBuyMaterialsData = async () => {
    try {
        const response = await api.get('criteria-selection');

        if (response.data.status === 1) {
            const patternsData = response.data.admin_data;
            const materials = [];

            // Convert the nested structure to a flat array of materials
            for (const [patternCode, rimData] of Object.entries(patternsData)) {
                for (const [rimDiameter, materialDescriptions] of Object.entries(rimData)) {
                    materialDescriptions.forEach((materialDesc) => {
                        const [materialid, material] = materialDesc.split('|').map((item) => item.trim());

                        materials.push({
                            materialid: materialid,
                            material: material,
                            pattern: patternCode,
                            rimdiameter: parseFloat(rimDiameter),
                            sectionwidth: extractSectionWidth(material)
                        });
                    });
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

// Form Validation
const validateForm = () => {
    if (!salesProgram.value.programName) {
        showError('Please enter Program Title');
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

    // Validate image file if changed
    if (imageFile.value) {
        const imageValidation = validateImageFile(imageFile.value);
        if (!imageValidation.valid) {
            showError(imageValidation.message);
            return false;
        }
    }

    // For FOC programs, validate criteria
    if (salesProgram.value.type === 'FOC') {
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
    }

    return true;
};

// Submit Form for Update
const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        submitting.value = true;

        // ✅ Generate spFOC_array in the correct format for API (materialid and status only)
        const spFOCArray = programItem.value.buyMaterials.map((material) => ({
            id: material.id || null, // Include ID for existing records, null for new ones
            materialid: material.materialid,
            status: material.status
        }));

        console.log('Generated spFOC_array:', JSON.stringify(spFOCArray, null, 2));

        // Prepare FormData
        const formData = new FormData();

        formData.append('programID', salesProgram.value.programID);
        formData.append('pricegroup', salesProgram.value.pricegroup);
        formData.append('type', salesProgram.value.type);
        formData.append('programName', salesProgram.value.programName);
        formData.append('desc', salesProgram.value.desc);
        formData.append('startdate', formatDate(salesProgram.value.startdate));
        formData.append('enddate', formatDate(salesProgram.value.enddate));
        formData.append('status', salesProgram.value.status);

        // Append image if changed
        if (imageFile.value) {
            formData.append('image', imageFile.value);
        }

        // For FOC programs, append criteria data
        if (salesProgram.value.type === 'FOC') {
            // Append spFOC_array as a JSON string
            formData.append('spFOC_array', JSON.stringify(spFOCArray));

            // Append individual fields
            formData.append('freematerialid', programItem.value.selectedFreeMaterial || '');
            formData.append('freematerialdesc', programItem.value.freeMaterialData?.material || '');
            formData.append('buyQty', programItem.value.buyQty);
            formData.append('freeQty', programItem.value.freeQty);
            formData.append('freeQuota', programItem.value.freeQuota || '');
        }

        console.log('Updating sales program:', salesProgram.value.programID);

        const response = await api.postExtra(`sales-program/update-sales-program/${salesProgram.value.programID}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            console.log('Sales program updated successfully');
            showSuccess('Sales program updated successfully!');
            setTimeout(() => {
                router.push('/om/listSalesProgram');
            }, 1500);
        } else {
            console.error('Error updating sales program:', response.data.error);
            showError('Error updating sales program: ' + (response.data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Error submitting form: ' + (error.message || 'Please try again'));
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

// Clean up blob URLs when component unmounts
onUnmounted(() => {
    if (salesProgram.value.imageUrl && salesProgram.value.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(salesProgram.value.imageUrl);
    }
});

// Load initial data
onMounted(() => {
    if (!programId.value) {
        showError('No program ID provided');
        router.push('/om/listSalesProgram');
        return;
    }

    // Load all necessary data
    Promise.all([loadBuyPatterns(), loadFreeMaterials(), loadBuyMaterialsData(), fetchSalesProgram()]).catch((error) => {
        console.error('Error loading initial data:', error);
        showError('Failed to load required data');
    });
});
</script>
