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
                        <InputText v-model="salesProgram.id" class="w-full" />
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
                    </div>

                    <!-- Criteria Items -->
                    <div v-if="programItems.length > 0" class="space-y-6">
                        <div v-for="(item, index) in programItems" :key="index" class="border rounded-xl p-6 shadow-sm bg-gray-100 hover:shadow-md transition-shadow duration-200">
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
                            <div class="rounded-lg mb-12">
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
                            <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-tags text-blue-600"></i>
                                            Buy Materials
                                        </h4>
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">All matching materials will be included</span>
                                    </div>
                                    <Button v-if="item.selectedBuyPattern || item.selectedBuyRim" icon="pi pi-times" label="Clear Selection" style="width: fit-content" class="p-button-text p-button-sm p-button-danger" @click="clearBuySelection(item)" />
                                </div>

                                <!-- Selection Criteria -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                                        <Dropdown 
                                            v-model="item.selectedBuyPattern" 
                                            :options="patternOptions" 
                                            optionLabel="label" 
                                            optionValue="value" 
                                            placeholder="Select Pattern" 
                                            class="w-full" 
                                            :filter="true" 
                                            @change="updateBuyMaterials(item)" 
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Rim Diameter</label>
                                        <Dropdown
                                            v-model="item.selectedBuyRim"
                                            :options="rimDiameterOptions"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Select Rim Diameter"
                                            class="w-full"
                                            :filter="true"
                                            @change="updateBuyMaterials(item)"
                                        />
                                    </div>
                                </div>

                                <!-- Selected Buy Materials Display -->
                                <div v-if="item.availableBuyMaterials.length > 0" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700">Selected Buy Materials ({{ item.availableBuyMaterials.length }})</span>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border border-blue-200 rounded-lg bg-white">
                                        <div
                                            v-for="material in item.availableBuyMaterials"
                                            :key="material.id"
                                            class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <div class="flex-1 min-w-0">
                                                <div class="text-sm font-medium text-blue-800 truncate">{{ material.material }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Pattern: {{ material.pattern }}</span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ material.rimDiameter }}"</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="!item.selectedBuyPattern || !item.selectedBuyRim" class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-inbox text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No buy materials selected</p>
                                    <p class="text-gray-400 text-xs mt-1">Select pattern and rim diameter to display available materials</p>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-exclamation-circle text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No materials found</p>
                                    <p class="text-gray-400 text-xs mt-1">No materials match the selected criteria</p>
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
                                    <Button v-if="item.selectedFreeMaterial" icon="pi pi-times" label="Clear Selection" style="width: fit-content" class="p-button-text p-button-sm p-button-danger" @click="clearFreeSelection(item)" />
                                </div>

                                <!-- Selection Criteria -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                                        <Dropdown v-model="item.selectedFreePattern" :options="patternOptions" optionLabel="label" optionValue="value" placeholder="Select Pattern" class="w-full" @change="updateFreeMaterial(item)" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Rim Diameter</label>
                                        <Dropdown v-model="item.selectedFreeRim" :options="rimDiameterOptions" optionLabel="label" optionValue="value" placeholder="Select Rim Diameter" class="w-full" @change="updateFreeMaterial(item)" />
                                    </div>
                                </div>

                                <!-- Selected Free Material Display -->
                                <div v-if="item.selectedFreeMaterial" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700">Selected Free Material</span>
                                    </div>

                                    <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-green-800">{{ item.selectedFreeMaterial.material }}</div>
                                            <div class="flex flex-wrap items-center gap-2 mt-1">
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">Pattern: {{ item.selectedFreeMaterial.pattern }}</span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">Rim: {{ item.selectedFreeMaterial.rimDiameter }}"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No free material selected</p>
                                    <p class="text-gray-400 text-xs mt-1">Select pattern and rim diameter to display materials</p>
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
                <Button icon="pi pi-plus" label="Add Criteria" class="p-button-success p-button-sm" :disabled="programItems.length >= 20" @click="addProgramItem" />

                <!-- Submit -->
                <div class="flex justify-end gap-2 mt-8">
                    <div class="w-40">
                        <RouterLink to="/om/listSalesProgram">
                            <Button label="Cancel" class="w-full p-button-secondary" />
                        </RouterLink>
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, watch } from 'vue';

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

// Pattern Options with labels
const patternOptions = ref([
    { label: '735 - Toyo 350', value: '735' },
    { label: '510 - Temporary Spare', value: '510' },
    { label: 'NTL - NTINT1', value: 'NTL' },
    { label: '830 - 830 Series', value: '830' },
    { label: '852 - SG2A Series', value: '852' },
    { label: 'NIN - NTINV Series', value: 'NIN' },
    { label: 'NGM - NTGMT Series', value: 'NGM' },
    { label: '414 - 421A Series', value: '414' },
    { label: '41A - 421A Alternative', value: '41A' },
    { label: '42S - 420S Series', value: '42S' },
    { label: 'SD7 - Toyo SD7', value: 'SD7' },
    { label: '170 - M170 Series', value: '170' },
    { label: '320 - M320 Series', value: '320' },
    { label: '610 - M610 Series', value: '610' },
    { label: '627 - M627 Series', value: '627' },
    { label: 'CRQ - PXCR1F Series', value: 'CRQ' },
    { label: 'N03 - NE03 Series', value: 'N03' }
]);

// Rim Diameter Options with labels
const rimDiameterOptions = ref([
    { label: '13"', value: 13 },
    { label: '14"', value: 14 },
    { label: '15"', value: 15 },
    { label: '16"', value: 16 },
    { label: '17"', value: 17 },
    { label: '18"', value: 18 },
    { label: '19"', value: 19 },
    { label: '20"', value: 20 }
]);

// Materials data (truncated for brevity - include your full materials array)
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
    // ... include all your materials here
]);

// Helper functions
const updateBuyMaterials = (item) => {
    if (item.selectedBuyPattern && item.selectedBuyRim) {
        const filteredMaterials = materials.value.filter(
            (material) => material.pattern === item.selectedBuyPattern && material.rimDiameter === item.selectedBuyRim
        );
        item.availableBuyMaterials = [...filteredMaterials];
    } else {
        item.availableBuyMaterials = [];
    }
};

const clearBuySelection = (item) => {
    item.selectedBuyPattern = null;
    item.selectedBuyRim = null;
    item.availableBuyMaterials = [];
};

const updateFreeMaterial = (item) => {
    if (item.selectedFreePattern && item.selectedFreeRim) {
        const filteredMaterials = materials.value.filter(
            (material) => material.pattern === item.selectedFreePattern && material.rimDiameter === item.selectedFreeRim
        );

        // For free material, only select the first matching material
        item.selectedFreeMaterial = filteredMaterials.length > 0 ? { ...filteredMaterials[0] } : null;
    } else {
        item.selectedFreeMaterial = null;
    }
};

const clearFreeSelection = (item) => {
    item.selectedFreeMaterial = null;
    item.selectedFreePattern = null;
    item.selectedFreeRim = null;
};

const addProgramItem = () => {
    programItems.value.push({
        buyQty: 1,
        freeQty: 1,
        availableBuyMaterials: [], // This is what gets submitted for buy materials
        selectedFreeMaterial: null,
        selectedBuyPattern: null,
        selectedBuyRim: null,
        selectedFreePattern: null,
        selectedFreeRim: null,
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
    
    // The availableBuyMaterials array contains all the selected buy materials
    // The selectedFreeMaterial object contains the selected free material
};

// Watch for type changes to clear program items
watch(
    () => salesProgram.value.type,
    (newType) => {
        programItems.value = [];
    }
);
</script>