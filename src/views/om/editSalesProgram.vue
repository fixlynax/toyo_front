<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">
                    {{ isEditMode ? 'Edit Sales Program' : 'Create Sales Program' }}
                </div>

                <!-- Sales Program Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="salesProgram.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="salesProgram.desc" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="salesProgram.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="salesProgram.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price Group</label>
                            <InputText v-model="salesProgram.priceGroup" class="w-full" />
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Program Type</label>
                        <Dropdown v-model="salesProgram.type" :options="typeOptions" optionLabel="label" optionValue="value" 
                                 class="w-full" :disabled="isEditMode" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Sales Program ID</label>
                        <InputText v-model="salesProgram.id" class="w-full" :disabled="isEditMode" />
                    </div>
                </div>

                <!-- Upload Image -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Sales Program Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" customUpload @select="onImageSelect($event, 'image')" 
                                :chooseLabel="salesProgram.image ? 'Change Image' : 'Upload Program Image'" class="w-full" />
                            <img v-if="salesProgram.image" :src="salesProgram.image" alt="Preview" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                        </div>
                    </div>
                </div>

                <!-- Criteria Section -->
                <div>
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
                        <Button icon="pi pi-plus" label="Add Criteria" style="width: fit-content" class="p-button-success p-button-sm" 
                            :disabled="programItems.length >= 20" @click="addProgramItem" />
                    </div>

                    <!-- Criteria Items -->
                    <div v-if="programItems.length > 0" class="space-y-6">
                        <div v-for="(item, index) in programItems" :key="item.id || index" 
                             class="border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                            <!-- Criteria Header -->
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                        <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                                    </div>
                                    <h3 class="font-semibold text-lg text-gray-800">Criteria {{ index + 1 }}</h3>
                                </div>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" 
                                    @click="removeProgramItem(index)" />
                            </div>

                            <!-- Quantities Card -->
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <i class="pi pi-shopping-cart text-blue-600"></i>
                                    Purchase Requirements
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-blue-700 mb-1">Buy Quantity</label>
                                        <div class="flex items-center gap-2">
                                            <InputNumber v-model="item.buyQty" class="w-full" :min="1" showButtons />
                                            <span class="text-sm text-blue-600 font-medium">items</span>
                                        </div>
                                        <p class="text-xs text-blue-600 mt-1">Number of items customer needs to purchase</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-green-700 mb-1">Free Quantity</label>
                                        <div class="flex items-center gap-2">
                                            <InputNumber v-model="item.freeQty" class="w-full" :min="1" showButtons />
                                            <span class="text-sm text-green-600 font-medium">items</span>
                                        </div>
                                        <p class="text-xs text-green-600 mt-1">Number of free items customer will receive</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Buy Materials Section -->
                            <div class="mb-8">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-tags text-blue-600"></i>
                                            Buy Materials
                                        </h4>
                                    </div>
                                    <Button icon="pi pi-plus" label="Select Materials" style="width: fit-content" 
                                        class="p-button-outlined p-button-sm" @click="openBuyMaterialPopup(item)" />
                                </div>

                                <!-- Selected Buy Materials -->
                                <div v-if="item.selectedBuyMaterials.length > 0" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700"> 
                                            Selected Materials ({{ item.selectedBuyMaterials.length }}) 
                                        </span>
                                        <Button icon="pi pi-pencil" label="Edit Selection" style="width: fit-content" 
                                            class="p-button-text p-button-sm" @click="openBuyMaterialPopup(item)" />
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div v-for="selectedMaterial in item.selectedBuyMaterials" :key="selectedMaterial.id" 
                                             class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                                            <img :src="selectedMaterial.image || '/demo/images/event-toyo-1.jpg'" 
                                                 :alt="selectedMaterial.material" class="w-12 h-12 object-cover rounded-md shadow-sm" />
                                            <div class="flex-1 min-w-0">
                                                <div class="font-medium text-sm text-blue-800">{{ selectedMaterial.materialID }}</div>
                                                <div class="text-xs text-blue-600 truncate">{{ selectedMaterial.material }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">
                                                        Pattern: {{ selectedMaterial.pattern }}
                                                    </span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">
                                                        Rim: {{ selectedMaterial.rimDiameter }}"
                                                    </span>
                                                </div>
                                            </div>
                                            <Button icon="pi pi-times" class="p-button-text p-button-sm p-button-danger" 
                                                @click.stop="removeBuyMaterial(item, selectedMaterial)" />
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-inbox text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No buy materials selected</p>
                                    <Button icon="pi pi-plus" label="Select Materials" style="width: fit-content" 
                                        class="p-button-outlined p-button-sm mt-2" @click="openBuyMaterialPopup(item)" />
                                </div>
                            </div>

                            <!-- Free Material Section -->
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-gift text-green-600"></i>
                                            Free Material
                                        </h4>
                                    </div>
                                    <Button icon="pi pi-plus" label="Select Material" style="width: fit-content" 
                                        class="p-button-outlined p-button-sm" @click="openFreeMaterialPopup(item)" />
                                </div>

                                <!-- Selected Free Material -->
                                <div v-if="item.selectedFreeMaterial" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700"> Selected Free Material </span>
                                        <Button icon="pi pi-pencil" label="Change Selection" style="width: fit-content" 
                                            class="p-button-text p-button-sm" @click="openFreeMaterialPopup(item)" />
                                    </div>

                                    <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                        <img :src="item.selectedFreeMaterial.image || '/demo/images/event-toyo-1.jpg'" 
                                             :alt="item.selectedFreeMaterial.material" class="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                        <div class="flex-1">
                                            <div class="font-semibold text-green-800 text-sm mb-1">{{ item.selectedFreeMaterial.materialID }}</div>
                                            <div class="text-xs text-green-600 mb-2">{{ item.selectedFreeMaterial.material }}</div>
                                            <div class="flex flex-wrap items-center gap-2">
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">
                                                    Pattern: {{ item.selectedFreeMaterial.pattern }}
                                                </span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">
                                                    Rim: {{ item.selectedFreeMaterial.rimDiameter }}"
                                                </span>
                                            </div>
                                        </div>
                                        <Button icon="pi pi-times" class="p-button-text p-button-sm p-button-danger" 
                                            @click="item.selectedFreeMaterial = null" />
                                    </div>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No free material selected</p>
                                    <Button icon="pi pi-plus" label="Select Material" style="width: fit-content" 
                                        class="p-button-outlined p-button-sm mt-2" @click="openFreeMaterialPopup(item)" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                        <p class="text-lg">No criteria added yet</p>
                        <p class="text-sm">Click "Add Criteria" to create your first promotion rule</p>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-40">
                        <Button label="Cancel" class="w-full p-button-outlined p-button-secondary" 
                            @click="cancelEdit" v-if="isEditMode" />
                    </div>
                    <div class="w-40">
                        <Button :label="isEditMode ? 'Update' : 'Submit'" class="w-full" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Buy Material Selection Dialog -->
        <Dialog v-model:visible="showBuyMaterialDialog" :style="{ width: '90vw', maxWidth: '1200px' }" 
                header="Select Buy Materials" :modal="true" class="p-fluid">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Filters Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 class="font-semibold text-gray-700 mb-4">Filter Materials</h5>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Pattern</label>
                                <Dropdown v-model="currentBuyFilters.pattern" :options="uniquePatterns" placeholder="All Patterns" 
                                    class="w-full" @change="filterMaterials('buy')" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Rim Diameter</label>
                                <Dropdown v-model="currentBuyFilters.rim" :options="uniqueRimDiameters" placeholder="All Rim Diameters" 
                                    class="w-full" @change="filterMaterials('buy')" />
                            </div>
                            <div class="pt-4 border-t border-gray-200">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-600">Showing:</span>
                                    <span class="font-semibold text-blue-600">{{ filteredBuyMaterials.length }} materials</span>
                                </div>
                                <div class="flex items-center justify-between text-sm mt-1">
                                    <span class="text-gray-600">Selected:</span>
                                    <span class="font-semibold text-green-600">{{ currentBuySelections.length }} materials</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Materials Grid -->
                <div class="lg:col-span-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                        <div
                            v-for="material in filteredBuyMaterials"
                            :key="material.id"
                            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                            :class="isMaterialSelected(material, 'buy') ? 'border-2 border-blue-500 bg-blue-50' : ''"
                            @click="toggleMaterialSelection(material, 'buy')"
                        >
                            <div class="flex items-start gap-3">
                                <img :src="material.image || '/demo/images/event-toyo-1.jpg'" :alt="material.material" 
                                     class="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-gray-800 text-sm mb-1 truncate">{{ material.materialID }}</div>
                                    <div class="text-xs text-gray-600 mb-2 line-clamp-2">{{ material.material }}</div>
                                    <div class="flex flex-wrap gap-1">
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.pattern }}</span>
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.rimDiameter }}"</span>
                                    </div>
                                </div>
                                <div class="w-5 h-5 border-2 rounded-md flex items-center justify-center mt-1 flex-shrink-0" 
                                     :class="isMaterialSelected(material, 'buy') ? 'bg-blue-500 border-blue-500' : 'border-gray-300'">
                                    <i v-if="isMaterialSelected(material, 'buy')" class="pi pi-check text-white text-xs"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredBuyMaterials.length === 0" class="text-center py-8 text-gray-500">
                        <i class="pi pi-search text-3xl text-gray-300 mb-2"></i>
                        <p>No materials found matching your filters</p>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between items-center w-full">
                    <div class="text-sm text-gray-600">
                        <span class="font-semibold text-green-600">{{ currentBuySelections.length }}</span> materials selected
                    </div>
                    <div class="flex gap-2">
                        <Button label="Cancel" icon="pi pi-times" @click="showBuyMaterialDialog = false" class="p-button-text" />
                        <Button label="Apply Selection" icon="pi pi-check" @click="applyBuyMaterialSelection" class="p-button-primary" />
                    </div>
                </div>
            </template>
        </Dialog>

        <!-- Free Material Selection Dialog -->
        <Dialog v-model:visible="showFreeMaterialDialog" :style="{ width: '90vw', maxWidth: '1200px' }" 
                header="Select Free Material" :modal="true" class="p-fluid">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Filters Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 class="font-semibold text-gray-700 mb-4">Filter Materials</h5>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Pattern</label>
                                <Dropdown v-model="currentFreeFilters.pattern" :options="uniquePatterns" placeholder="All Patterns" 
                                    class="w-full" @change="filterMaterials('free')" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Rim Diameter</label>
                                <Dropdown v-model="currentFreeFilters.rim" :options="uniqueRimDiameters" placeholder="All Rim Diameters" 
                                    class="w-full" @change="filterMaterials('free')" />
                            </div>
                            <div class="pt-4 border-t border-gray-200">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-600">Showing:</span>
                                    <span class="font-semibold text-blue-600">{{ filteredFreeMaterials.length }} materials</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Materials Grid -->
                <div class="lg:col-span-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                        <div
                            v-for="material in filteredFreeMaterials"
                            :key="material.id"
                            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                            :class="currentFreeSelection?.id === material.id ? 'border-2 border-green-500 bg-green-50' : ''"
                            @click="selectFreeMaterialInPopup(material)"
                        >
                            <div class="flex items-start gap-3">
                                <img :src="material.image || '/demo/images/event-toyo-1.jpg'" :alt="material.material" 
                                     class="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-gray-800 text-sm mb-1 truncate">{{ material.materialID }}</div>
                                    <div class="text-xs text-gray-600 mb-2 line-clamp-2">{{ material.material }}</div>
                                    <div class="flex flex-wrap gap-1">
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.pattern }}</span>
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.rimDiameter }}"</span>
                                    </div>
                                </div>
                                <div class="w-5 h-5 border-2 rounded-full flex items-center justify-center mt-1 flex-shrink-0" 
                                     :class="currentFreeSelection?.id === material.id ? 'bg-green-500 border-green-500' : 'border-gray-300'">
                                    <i v-if="currentFreeSelection?.id === material.id" class="pi pi-check text-white text-xs"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredFreeMaterials.length === 0" class="text-center py-8 text-gray-500">
                        <i class="pi pi-search text-3xl text-gray-300 mb-2"></i>
                        <p>No materials found matching your filters</p>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between items-center w-full">
                    <div class="text-sm text-gray-600">
                        <span v-if="currentFreeSelection" class="font-semibold text-green-600">1</span>
                        <span v-else class="text-gray-400">0</span> material selected
                    </div>
                    <div class="flex gap-2">
                        <Button label="Cancel" icon="pi pi-times" @click="showFreeMaterialDialog = false" class="p-button-text" />
                        <Button label="Apply Selection" icon="pi pi-check" @click="applyFreeMaterialSelection" class="p-button-primary" 
                                :disabled="!currentFreeSelection" />
                    </div>
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const originalData = ref(null);

// Pre-filled existing sales program data
const salesProgram = ref({
    id: 'ABC4321',
    title: 'Year End Discount',
    desc: 'Exclusive year-end discounts on selected Toyo Tires models. Limited time offer!',
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    priceGroup: '06',
    type: 'FOC',
    status: 1,
    image: '/demo/images/event-toyo-2.jpg',
    created: '2025-09-08'
});

const typeOptions = [
    { label: 'FOC (Free of Charge)', value: 'FOC' },
    { label: 'Discount', value: 'DISCOUNT' },
    { label: 'Bundle', value: 'BUNDLE' }
];

const programItems = ref([]);

// Popup states
const showBuyMaterialDialog = ref(false);
const showFreeMaterialDialog = ref(false);
const currentEditingItem = ref(null);
const currentBuySelections = ref([]);
const currentFreeSelection = ref(null);
const currentBuyFilters = ref({ pattern: null, rim: null });
const currentFreeFilters = ref({ pattern: null, rim: null });

// Materials data with images - FULLY INTEGRATED
const materials = ref([
    {
        id: 39,
        materialID: '51113735003175T',
        material: '175/70R13 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 13,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 363,
        materialID: '51114510003115T',
        material: '1115/70D14 TEMPORARY SPARE SS...',
        materialType: 'ZTRD',
        pattern: '510',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 364,
        materialID: '51114735003185T',
        material: '185/70R14 8ST TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 365,
        materialID: '51114735004175T',
        material: '175/65R14 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 366,
        materialID: '51114735004185T',
        material: '185/65R14 8GT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 367,
        materialID: '51114735005185T',
        material: '185/60R14 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 40,
        materialID: '51115735004175T',
        material: '175/65R15 8HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 368,
        materialID: '51115735004185T',
        material: '185/65R15 8BT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 369,
        materialID: '51115735004195T',
        material: '195/65R15 9TT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 41,
        materialID: '51115735004205T',
        material: '205/65R15 9HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 370,
        materialID: '51115735005185T',
        material: '185/60R15 8HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 371,
        materialID: '51115735005195T',
        material: '195/60R15 8BT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    }
    // ... (rest of the materials array remains the same)
]);

// Computed properties for filters
const uniquePatterns = computed(() => {
    const patterns = new Set();
    materials.value.forEach((material) => {
        if (material.pattern && material.pattern !== '(NULL)') {
            patterns.add(material.pattern);
        }
    });
    return Array.from(patterns).sort();
});

const uniqueRimDiameters = computed(() => {
    const rims = new Set();
    materials.value.forEach((material) => {
        if (material.rimDiameter && material.rimDiameter > 0) {
            rims.add(material.rimDiameter);
        }
    });
    return Array.from(rims).sort((a, b) => a - b);
});

// Filtered materials for popups
const filteredBuyMaterials = computed(() => {
    return materials.value.filter((material) => {
        const patternMatch = !currentBuyFilters.value.pattern || material.pattern === currentBuyFilters.value.pattern;
        const rimMatch = !currentBuyFilters.value.rim || material.rimDiameter === currentBuyFilters.value.rim;
        return patternMatch && rimMatch;
    });
});

const filteredFreeMaterials = computed(() => {
    return materials.value.filter((material) => {
        const patternMatch = !currentFreeFilters.value.pattern || material.pattern === currentFreeFilters.value.pattern;
        const rimMatch = !currentFreeFilters.value.rim || material.rimDiameter === currentFreeFilters.value.rim;
        return patternMatch && rimMatch;
    });
});

// Initialize edit mode
onMounted(() => {
    // Check if we're in edit mode (e.g., from URL parameter or route)
    const programId = route.params.id;
    if (programId) {
        isEditMode.value = true;
        loadSalesProgram(programId);
    } else {
        // For demo purposes, pre-fill with sample criteria even in create mode
        prefillSampleCriteria();
    }
});

// Pre-fill sample criteria data
const prefillSampleCriteria = () => {
    programItems.value = [
        {
            id: 1,
            buyQty: 2,
            freeQty: 1,
            selectedBuyMaterials: [
                findMaterialById(39),  // 175/70R13 8ZT TOYO 350
                findMaterialById(363), // 1115/70D14 TEMPORARY SPARE SS...
                findMaterialById(365)  // 175/65R14 8ZT TOYO 350
            ],
            selectedFreeMaterial: findMaterialById(364),  // 185/70R14 8ST TOYO 350
            status: 1
        },
        {
            id: 2,
            buyQty: 3,
            freeQty: 1,
            selectedBuyMaterials: [
                findMaterialById(366),  // 185/65R14 8GT TOYO 350
                findMaterialById(367)   // 185/60R14 8ZT TOYO 350
            ],
            selectedFreeMaterial: findMaterialById(40),   // 175/65R15 8HT TOYO 350
            status: 1
        },
        {
            id: 3,
            buyQty: 4,
            freeQty: 2,
            selectedBuyMaterials: [
                findMaterialById(368),  // 185/65R15 8BT TOYO 350
                findMaterialById(369),  // 195/65R15 9TT TOYO 350
                findMaterialById(41)    // 205/65R15 9HT TOYO 350
            ],
            selectedFreeMaterial: findMaterialById(370),  // 185/60R15 8HT TOYO 350
            status: 1
        }
    ];
};

// Load existing sales program data
const loadSalesProgram = (id) => {
    // In a real application, you would fetch this data from an API
    // For demo purposes, we'll simulate loading data
    console.log(`Loading sales program with ID: ${id}`);
    
    // Simulate API call delay
    setTimeout(() => {
        // Mock data for editing - this would come from your API
        const mockData = {
            title: 'Summer Tire Promotion 2023',
            desc: 'Special summer promotion for selected tire models. Buy 2 tires and get 1 free on selected patterns.',
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            priceGroup: '06',
            type: 'FOC',
            status: 1,
            image: '/demo/images/event-toyo-1.jpg',
            id: id
        };
        
        salesProgram.value = { ...mockData };
        originalData.value = JSON.parse(JSON.stringify(mockData));
        
        // Load program items with proper material references
        loadProgramItems(id);
    }, 500);
};

// Load existing program items
const loadProgramItems = (programId) => {
    // In a real application, you would fetch this data from an API
    // For demo purposes, we'll create some mock items with existing data
    // This ensures materials are properly referenced from the materials array
    const mockItems = [
        {
            id: 1,
            buyQty: 2,
            freeQty: 1,
            selectedBuyMaterials: [
                findMaterialById(39),  // 175/70R13 8ZT TOYO 350
                findMaterialById(363), // 1115/70D14 TEMPORARY SPARE SS...
                findMaterialById(365)  // 175/65R14 8ZT TOYO 350
            ],
            selectedFreeMaterial: findMaterialById(364),  // 185/70R14 8ST TOYO 350
            status: 1
        },
        {
            id: 2,
            buyQty: 3,
            freeQty: 1,
            selectedBuyMaterials: [
                findMaterialById(366),  // 185/65R14 8GT TOYO 350
                findMaterialById(367),  // 185/60R14 8ZT TOYO 350
                findMaterialById(368)   // 185/65R15 8BT TOYO 350
            ],
            selectedFreeMaterial: findMaterialById(369),  // 195/65R15 9TT TOYO 350
            status: 1
        },
        {
            id: 3,
            buyQty: 4,
            freeQty: 2,
            selectedBuyMaterials: [
                findMaterialById(40),   // 175/65R15 8HT TOYO 350
                findMaterialById(41),   // 205/65R15 9HT TOYO 350
                findMaterialById(370)   // 185/60R15 8HT TOYO 350
            ],
            selectedFreeMaterial: findMaterialById(371),  // 195/60R15 8BT TOYO 350
            status: 1
        }
    ];
    
    programItems.value = [...mockItems];
};

// Helper function to find material by ID
const findMaterialById = (id) => {
    return materials.value.find(material => material.id === id) || null;
};

// Popup functions
const openBuyMaterialPopup = (item) => {
    currentEditingItem.value = item;
    currentBuySelections.value = [...item.selectedBuyMaterials];
    currentBuyFilters.value = { pattern: null, rim: null };
    showBuyMaterialDialog.value = true;
};

const openFreeMaterialPopup = (item) => {
    currentEditingItem.value = item;
    currentFreeSelection.value = item.selectedFreeMaterial;
    currentFreeFilters.value = { pattern: null, rim: null };
    showFreeMaterialDialog.value = true;
};

const toggleMaterialSelection = (material, type) => {
    if (type === 'buy') {
        const index = currentBuySelections.value.findIndex((m) => m.id === material.id);
        if (index === -1) {
            currentBuySelections.value.push(material);
        } else {
            currentBuySelections.value.splice(index, 1);
        }
    }
};

const selectFreeMaterialInPopup = (material) => {
    currentFreeSelection.value = material;
};

const isMaterialSelected = (material, type) => {
    if (type === 'buy') {
        return currentBuySelections.value.some((m) => m.id === material.id);
    }
    return false;
};

const applyBuyMaterialSelection = () => {
    if (currentEditingItem.value) {
        currentEditingItem.value.selectedBuyMaterials = [...currentBuySelections.value];
    }
    showBuyMaterialDialog.value = false;
};

const applyFreeMaterialSelection = () => {
    if (currentEditingItem.value) {
        currentEditingItem.value.selectedFreeMaterial = currentFreeSelection.value;
    }
    showFreeMaterialDialog.value = false;
};

const filterMaterials = (type) => {
    // Filters are applied automatically through computed properties
};

// Helper functions
const removeBuyMaterial = (item, material) => {
    const index = item.selectedBuyMaterials.findIndex((m) => m.id === material.id);
    if (index !== -1) {
        item.selectedBuyMaterials.splice(index, 1);
    }
};

const addProgramItem = () => {
    programItems.value.push({
        id: Date.now(), // Generate a temporary ID
        buyQty: 1,
        freeQty: 1,
        selectedBuyMaterials: [],
        selectedFreeMaterial: null,
        status: 1
    });
};

const removeProgramItem = (index) => {
    programItems.value.splice(index, 1);
};

const onImageSelect = (eventFile, field) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            salesProgram.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const submitForm = () => {
    console.log('Sales Program Data:', salesProgram.value);
    console.log('Program Items:', programItems.value);
    
    if (isEditMode.value) {
        // Update existing program
        console.log('Updating sales program...');
        // In a real app, you would make an API call here
        alert('Sales program updated successfully!');
    } else {
        // Create new program
        console.log('Creating new sales program...');
        // In a real app, you would make an API call here
        alert('Sales program created successfully!');
    }
};

const cancelEdit = () => {
    // Navigate back or reset form
    if (originalData.value) {
        salesProgram.value = { ...originalData.value };
        // Reset program items to original state
        loadProgramItems(salesProgram.value.id);
    }
    router.back();
};

// Watch for type changes to clear program items
watch(
    () => salesProgram.value.type,
    (newType) => {
        programItems.value = [];
    }
);
</script>