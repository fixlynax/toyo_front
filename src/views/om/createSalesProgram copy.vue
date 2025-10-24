<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Sales Program</div>

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
                        <InputText v-model="salesProgram.type" :options="typeOptions" optionValue="value" class="w-full" disabled />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Sales Program ID</label>
                        <InputText v-model="salesProgram.id" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                </div>

                <!-- Upload Image -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Sales Program Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" customUpload @select="onImageSelect($event, 'image')" chooseLabel="Upload Program Image" class="w-full" />
                            <img v-if="salesProgram.image" :src="salesProgram.image" alt="Preview" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                        </div>
                    </div>
                </div>

                <!-- Criteria Section -->
                <div>
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
                        <Button icon="pi pi-plus" label="Add Criteria" style="width: fit-content" class="p-button-success p-button-sm" :disabled="programItems.length >= 20" @click="addProgramItem" />
                    </div>

                    <!-- Criteria Items -->
                    <div v-if="programItems.length > 0" class="space-y-6">
                        <div v-for="(item, index) in programItems" :key="index" class="border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                            <!-- Criteria Header -->
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                        <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                                    </div>
                                    <h3 class="font-semibold text-lg text-gray-800">Criteria {{ index + 1 }}</h3>
                                </div>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeProgramItem(index)" />
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
                                        <!-- <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"> Select multiple </span> -->
                                    </div>
                                    <Button icon="pi pi-plus" label="Select Materials" style="width: fit-content" class="p-button-outlined p-button-sm" @click="openBuyMaterialPopup(item)" />
                                </div>

                                <!-- Selected Buy Materials -->
                                <div v-if="item.selectedBuyMaterials.length > 0" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700"> Selected Materials ({{ item.selectedBuyMaterials.length }}) </span>
                                        <Button icon="pi pi-pencil" label="Edit Selection" style="width: fit-content" class="p-button-text p-button-sm" @click="openBuyMaterialPopup(item)" />
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div v-for="selectedMaterial in item.selectedBuyMaterials" :key="selectedMaterial.id" class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                                            <img :src="selectedMaterial.image || '/demo/images/event-toyo-1.jpg'" :alt="selectedMaterial.material" class="w-12 h-12 object-cover rounded-md shadow-sm" />
                                            <div class="flex-1 min-w-0">
                                                <div class="font-medium text-sm text-blue-800">{{ selectedMaterial.materialID }}</div>
                                                <div class="text-xs text-blue-600 truncate">{{ selectedMaterial.material }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Pattern: {{ selectedMaterial.pattern }}</span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ selectedMaterial.rimDiameter }}"</span>
                                                </div>
                                            </div>
                                            <Button icon="pi pi-times" class="p-button-text p-button-sm p-button-danger" @click.stop="removeBuyMaterial(item, selectedMaterial)" />
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-inbox text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No buy materials selected</p>
                                    <Button icon="pi pi-plus" label="Select Materials" style="width: fit-content" class="p-button-outlined p-button-sm mt-2" @click="openBuyMaterialPopup(item)" />
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
                                        <!-- <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"> Select one </span> -->
                                    </div>
                                    <Button icon="pi pi-plus" label="Select Material" style="width: fit-content" class="p-button-outlined p-button-sm" @click="openFreeMaterialPopup(item)" />
                                </div>

                                <!-- Selected Free Material -->
                                <div v-if="item.selectedFreeMaterial" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700"> Selected Free Material </span>
                                        <Button icon="pi pi-pencil" label="Change Selection" style="width: fit-content" class="p-button-text p-button-sm" @click="openFreeMaterialPopup(item)" />
                                    </div>

                                    <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                        <img :src="item.selectedFreeMaterial.image || '/demo/images/event-toyo-1.jpg'" :alt="item.selectedFreeMaterial.material" class="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                        <div class="flex-1">
                                            <div class="font-semibold text-green-800 text-sm mb-1">{{ item.selectedFreeMaterial.materialID }}</div>
                                            <div class="text-xs text-green-600 mb-2">{{ item.selectedFreeMaterial.material }}</div>
                                            <div class="flex flex-wrap items-center gap-2">
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">Pattern: {{ item.selectedFreeMaterial.pattern }}</span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">Rim: {{ item.selectedFreeMaterial.rimDiameter }}"</span>
                                            </div>
                                        </div>
                                        <Button icon="pi pi-times" class="p-button-text p-button-sm p-button-danger" @click="item.selectedFreeMaterial = null" />
                                    </div>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No free material selected</p>
                                    <Button icon="pi pi-plus" label="Select Material" style="width: fit-content" class="p-button-outlined p-button-sm mt-2" @click="openFreeMaterialPopup(item)" />
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
                <div class="flex justify-end mt-8">
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Buy Material Selection Dialog -->
        <Dialog v-model:visible="showBuyMaterialDialog" :style="{ width: '90vw', maxWidth: '1200px' }" header="Select Buy Materials" :modal="true" class="p-fluid">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Filters Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 class="font-semibold text-gray-700 mb-4">Filter Materials</h5>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Pattern</label>
                                <Dropdown v-model="currentBuyFilters.pattern" :options="uniquePatterns" placeholder="All Patterns" class="w-full" @change="filterMaterials('buy')" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Rim Diameter</label>
                                <Dropdown v-model="currentBuyFilters.rim" :options="uniqueRimDiameters" placeholder="All Rim Diameters" class="w-full" @change="filterMaterials('buy')" />
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
                                <img :src="material.image || '/demo/images/event-toyo-1.jpg'" :alt="material.material" class="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-gray-800 text-sm mb-1 truncate">{{ material.materialID }}</div>
                                    <div class="text-xs text-gray-600 mb-2 line-clamp-2">{{ material.material }}</div>
                                    <div class="flex flex-wrap gap-1">
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.pattern }}</span>
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.rimDiameter }}"</span>
                                    </div>
                                </div>
                                <div class="w-5 h-5 border-2 rounded-md flex items-center justify-center mt-1 flex-shrink-0" :class="isMaterialSelected(material, 'buy') ? 'bg-blue-500 border-blue-500' : 'border-gray-300'">
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
        <Dialog v-model:visible="showFreeMaterialDialog" :style="{ width: '90vw', maxWidth: '1200px' }" header="Select Free Material" :modal="true" class="p-fluid">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Filters Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 class="font-semibold text-gray-700 mb-4">Filter Materials</h5>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Pattern</label>
                                <Dropdown v-model="currentFreeFilters.pattern" :options="uniquePatterns" placeholder="All Patterns" class="w-full" @change="filterMaterials('free')" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">By Rim Diameter</label>
                                <Dropdown v-model="currentFreeFilters.rim" :options="uniqueRimDiameters" placeholder="All Rim Diameters" class="w-full" @change="filterMaterials('free')" />
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
                                <img :src="material.image || '/demo/images/event-toyo-1.jpg'" :alt="material.material" class="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-gray-800 text-sm mb-1 truncate">{{ material.materialID }}</div>
                                    <div class="text-xs text-gray-600 mb-2 line-clamp-2">{{ material.material }}</div>
                                    <div class="flex flex-wrap gap-1">
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.pattern }}</span>
                                        <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{{ material.rimDiameter }}"</span>
                                    </div>
                                </div>
                                <div class="w-5 h-5 border-2 rounded-full flex items-center justify-center mt-1 flex-shrink-0" :class="currentFreeSelection?.id === material.id ? 'bg-green-500 border-green-500' : 'border-gray-300'">
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
                        <Button label="Apply Selection" icon="pi pi-check" @click="applyFreeMaterialSelection" class="p-button-primary" :disabled="!currentFreeSelection" />
                    </div>
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Dialog from 'primevue/dialog';

const salesProgram = ref({
    title: '',
    desc: '',
    startDate: '',
    endDate: '',
    priceGroup: '06',
    type: 'FOC',
    status: 1,
    image: ''
});

const typeOptions = [{ label: 'FOC (Free of Charge)', value: 'FOC' }];

const programItems = ref([]);

// Popup states
const showBuyMaterialDialog = ref(false);
const showFreeMaterialDialog = ref(false);
const currentEditingItem = ref(null);
const currentBuySelections = ref([]);
const currentFreeSelection = ref(null);
const currentBuyFilters = ref({ pattern: null, rim: null });
const currentFreeFilters = ref({ pattern: null, rim: null });

// Materials data with images
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
    },
    {
        id: 372,
        materialID: '51116510003105T',
        material: '1105/70R16 TEMPORARY SPARE SS...',
        materialType: 'ZTRD',
        pattern: '510',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 373,
        materialID: '61115NTN107205V',
        material: '205/50 R15 86V NTINT1 TLR 2R 1X',
        materialType: 'ZTRD',
        pattern: 'NTL',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 374,
        materialID: '61116N83005215W',
        material: '215/60 R16 99W 830 TLY GSS RD1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 375,
        materialID: '61116N83006205W',
        material: '205/55 R16 94W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 376,
        materialID: '61117SG24007215W',
        material: '215/50 R17 95W SG2A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '852',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 377,
        materialID: '61117SG24008225W',
        material: '225/45 R17 94W SG2A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '852',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 378,
        materialID: '61117N83006215W',
        material: '215/55 R17 98W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 379,
        materialID: '61117N83006225W',
        material: '225/55 R17 101W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 380,
        materialID: '61117N83007215W',
        material: '215/50 R17 95W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 381,
        materialID: '61117N83007225Y',
        material: '225/50 R17 98Y 830 TLY G2R CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 382,
        materialID: '61117NIN008225W',
        material: '225/45 R17 91W NTINVT.UK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 383,
        materialID: '61117NIN008235W',
        material: '235/45ZR17 94W NTINV TLY SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 384,
        materialID: '61118N83008225Y',
        material: '225/45 R18 95Y 830 TLY G1R CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 385,
        materialID: '61118N83008235W',
        material: '235/45 R18 98W 830 TLY GSS RD1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 386,
        materialID: '61118N83009235Y',
        material: '235/40 R18 95Y 830 TLY G1R CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 387,
        materialID: '61118NIN008225W',
        material: '225/45 R18 91W NTINV TLYK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 388,
        materialID: '61118NIN008245W',
        material: '245/45 R18 96W NTINV TLYK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 389,
        materialID: '61118NIN009275W',
        material: '275/40ZR18 99W NTINV TLYK SS HK',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 390,
        materialID: '61119SG24008245Y',
        material: '245/45 R19 102Y SG2A TLZ G1R RD1X',
        materialType: 'ZTRD',
        pattern: '562',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 391,
        materialID: '61119NIN010025W',
        material: '235/35ZR19 91W NTINV TLYK SS RD...',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 392,
        materialID: '61120SG24009245Y',
        material: '245/40 R20 99Y SG2A TLZ G1R RD1X',
        materialType: 'ZTRD',
        pattern: '562',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 393,
        materialID: '61120NIN009245W',
        material: '245/40 R20 99W NTINV TLYK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 394,
        materialID: '61120NIN010075W',
        material: '275/35ZR20 1020W NTINV TLY SS CG...',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 395,
        materialID: '62120NGMT003300Q',
        material: '33X1250 R20 114Q NTGMT TLB BETC',
        materialType: 'ZTRD',
        pattern: 'NGM',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 396,
        materialID: '62120NGMT003509',
        material: '35X1250 R20 1219 NTGMT TLE BEPT',
        materialType: 'ZTRD',
        pattern: 'NGM',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 397,
        materialID: '62517421404225V',
        material: '225/65 R17 106V 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '414',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 398,
        materialID: '62518421405225V',
        material: '225/60 R18 104V 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '414',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 399,
        materialID: '62518421A05235W',
        material: '235/60 R18 10/W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 400,
        materialID: '62518421A06235V',
        material: '235/55 R18 10/W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 401,
        materialID: '62519421A06225V',
        material: '225/55 R19 99V 421A TLZ GSS 1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 402,
        materialID: '62519421A06235W',
        material: '235/55 R19 105W 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 403,
        materialID: '62520420507265V',
        material: '265/50 R20 111V 420S TLV GSS RD1X',
        materialType: 'ZTRD',
        pattern: '42S',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 404,
        materialID: '62520421008245W',
        material: '245/45 R20 103W 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 405,
        materialID: '62520421008235W',
        material: '255/45 R20 105W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 406,
        materialID: '62520421008275W',
        material: '275/45 R20 110W 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 407,
        materialID: '62520421009275W',
        material: '275/40 R20 106W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 408,
        materialID: '62520421010315W',
        material: '315/35 R20 110W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 42,
        materialID: '71114750703185S',
        material: '185/70 R14 88S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: 'Toyo SD7',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 43,
        materialID: '71114750704175S',
        material: '175/65 R14 82S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: 'Toyo SD7',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 409,
        materialID: '71114750704185S',
        material: '185/65 R14 86S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 410,
        materialID: '71114750705183H',
        material: '185/60 R14 82H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 411,
        materialID: '71114750704175S',
        material: '175/65 R15 84S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 412,
        materialID: '71114750704185S',
        material: '185/65 R15 88S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 413,
        materialID: '71114750704195H',
        material: '195/65 R15 91H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 414,
        materialID: '71114750704203H',
        material: '205/65 R15 94H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 415,
        materialID: '71114750705183H',
        material: '185/60 R15 84H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 416,
        materialID: '71114750705193H',
        material: '195/60 R15 88H TYSD7 TLZ SSMC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 417,
        materialID: '71114750706185V',
        material: '185/55 R15 82V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 418,
        materialID: '71114750706195V',
        material: '195/55 R15 83V TYSD7 TLZ SSMC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 419,
        materialID: '71114750705203H',
        material: '205/60 R16 92H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 420,
        materialID: '71114750705213H',
        material: '215/60 R16 93H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 421,
        materialID: '71114750706205V',
        material: '205/55 R16 91V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 422,
        materialID: '71114750706215V',
        material: '215/55 R17 94V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 423,
        materialID: '71114750707215V',
        material: '215/50 R17 91V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 424,
        materialID: '71114750708215W',
        material: '215/45 R17 87W TYSD7 TLM GSS M...',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 425,
        materialID: '71114750708225W',
        material: '225/45 R18 91W TYSD7 TLM GSS M...',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 426,
        materialID: '7310CM17000110L',
        material: '11R225146L M1702 TL',
        materialType: 'ZTRD',
        pattern: '170',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 427,
        materialID: '7310CM17001209H',
        material: '295/80 R225152M M170 TL',
        materialType: 'ZTRD',
        pattern: '170',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 428,
        materialID: '7310CM32000110K',
        material: '11R225 148K M3202 TL',
        materialType: 'ZTRD',
        pattern: '320',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 429,
        materialID: '7310CM61000110M',
        material: '11R225 16 M6102 TL S',
        materialType: 'ZTRD',
        pattern: '610',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 430,
        materialID: '7310CM62700110L',
        material: '11R225 5 146L M627 TL',
        materialType: 'ZTRD',
        pattern: '627',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 148,
        materialID: '81114CR1F04175T',
        material: '175/65 R14 82T PXCR1FTLY GSS MT1Z',
        materialType: 'ZFP2',
        pattern: 'CRQ',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 149,
        materialID: '81114NE0303165T',
        material: '165/70 R14 85T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 150,
        materialID: '81114NE0303175T',
        material: '175/70 R14 88T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 151,
        materialID: '81114NE0303185T',
        material: '185/70 R14 88T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 152,
        materialID: '81114NE0303195T',
        material: '195/70 R14 91T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    }
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
};

// Watch for type changes to clear program items
watch(
    () => salesProgram.value.type,
    (newType) => {
        programItems.value = [];
    }
);
</script>


