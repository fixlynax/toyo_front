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
                                    <Button v-if="item.selectedBuyPattern || item.selectedBuyRims.length > 0" icon="pi pi-times" label="Clear Selection" style="width: fit-content" class="p-button-text p-button-sm p-button-danger" @click="clearBuySelection(item)" />
                                </div>

                                <!-- Selection Criteria -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                                        <Dropdown 
                                            v-model="item.selectedBuyPattern" 
                                            :options="buyPatternOptions" 
                                            optionLabel="label" 
                                            optionValue="value" 
                                            placeholder="Select Pattern" 
                                            class="w-full" 
                                            :filter="true" 
                                            :loading="loadingBuyPatterns"
                                            @change="onBuyPatternChange(item)" 
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Rim Diameter</label>
                                        <MultiSelect
                                            v-model="item.selectedBuyRims"
                                            :options="item.availableBuyRims"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Select Rim Diameter"
                                            class="w-full"
                                            :filter="true"
                                            :disabled="!item.selectedBuyPattern"
                                            :loading="loadingBuyRims"
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
                                            :key="material.materialid"
                                            class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <div class="flex-1 min-w-0">
                                                <div class="text-sm font-medium text-blue-800 truncate">{{ material.material }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Pattern: {{ material.pattern }}</span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ material.rimdiameter }}"</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="!item.selectedBuyPattern || item.selectedBuyRims.length === 0" class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
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

                                <!-- Free Material Selection -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Free Material</label>
                                    <Dropdown 
                                        v-model="item.selectedFreeMaterial" 
                                        :options="freeMaterialOptions" 
                                        optionLabel="material" 
                                        optionValue="materialid" 
                                        placeholder="Select Free Material" 
                                        class="w-full" 
                                        :filter="true"
                                        :loading="loadingFreeMaterials"
                                        @change="onFreeMaterialChange(item)"
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

                                <!-- Selected Free Material Display -->
                                <div v-if="item.selectedFreeMaterial && item.freeMaterialData" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700">Selected Free Material</span>
                                    </div>

                                    <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-green-800">{{ item.freeMaterialData.material }}</div>
                                            <div class="text-xs text-green-600 mt-1">Material ID: {{ item.freeMaterialData.materialid }}</div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No free material selected</p>
                                    <p class="text-gray-400 text-xs mt-1">Select a free material from the dropdown</p>
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
import { ref, onMounted, watch } from 'vue';
import api from '@/service/api';

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

// API Data
const buyPatternOptions = ref([]);
const freeMaterialOptions = ref([]);
const loadingBuyPatterns = ref(false);
const loadingBuyRims = ref(false);
const loadingFreeMaterials = ref(false);

// Helper functions
const onBuyPatternChange = async (item) => {
    item.selectedBuyRims = [];
    item.availableBuyMaterials = [];
    item.availableBuyRims = [];
    
    if (item.selectedBuyPattern) {
        await loadBuyRims(item);
    }
};

const updateBuyMaterials = async (item) => {
    if (item.selectedBuyPattern && item.selectedBuyRims.length > 0) {
        await loadBuyMaterials(item);
    } else {
        item.availableBuyMaterials = [];
    }
};

const clearBuySelection = (item) => {
    item.selectedBuyPattern = null;
    item.selectedBuyRims = [];
    item.availableBuyMaterials = [];
    item.availableBuyRims = [];
};

const onFreeMaterialChange = (item) => {
    if (item.selectedFreeMaterial) {
        const selectedMaterial = freeMaterialOptions.value.find(
            material => material.materialid === item.selectedFreeMaterial
        );
        item.freeMaterialData = selectedMaterial ? { ...selectedMaterial } : null;
    } else {
        item.freeMaterialData = null;
    }
};

const clearFreeSelection = (item) => {
    item.selectedFreeMaterial = null;
    item.freeMaterialData = null;
};

const getFreeMaterialLabel = (materialId) => {
    const material = freeMaterialOptions.value.find(m => m.materialid === materialId);
    return material ? material.material : materialId;
};

const addProgramItem = () => {
    programItems.value.push({
        buyQty: 1,
        freeQty: 1,
        availableBuyMaterials: [],
        selectedFreeMaterial: null,
        freeMaterialData: null,
        selectedBuyPattern: null,
        selectedBuyRims: [],
        availableBuyRims: [],
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

// API Functions
const loadBuyPatterns = async () => {
    try {
        loadingBuyPatterns.value = true;
        const response = await api.get('criteria-selection');
        
        if (response.data.status === 1) {
            const patternsData = response.data.admin_data;
            const patterns = [];
            
            for (const [patternCode, patternData] of Object.entries(patternsData)) {
                for (const [patternName, rimSizes] of Object.entries(patternData)) {
                    patterns.push({
                        label: `${patternCode} - ${patternName}`,
                        value: patternCode,
                        patternName: patternName,
                        rimSizes: rimSizes
                    });
                }
            }
            
            buyPatternOptions.value = patterns;
        }
    } catch (error) {
        console.error('Error loading buy patterns:', error);
    } finally {
        loadingBuyPatterns.value = false;
    }
};

const loadBuyRims = async (item) => {
    try {
        loadingBuyRims.value = true;
        const selectedPattern = buyPatternOptions.value.find(
            pattern => pattern.value === item.selectedBuyPattern
        );
        
        if (selectedPattern && selectedPattern.rimSizes) {
            item.availableBuyRims = selectedPattern.rimSizes.map(size => ({
                label: `${size}"`,
                value: parseInt(size)
            }));
        } else {
            item.availableBuyRims = [];
        }
    } catch (error) {
        console.error('Error loading buy rims:', error);
        item.availableBuyRims = [];
    } finally {
        loadingBuyRims.value = false;
    }
};

const loadBuyMaterials = async (item) => {
    try {
        // Since we don't have a direct API to get materials by pattern and rim,
        // we'll simulate this based on the available data
        // In a real scenario, you would call an API that filters materials
        
        // For now, we'll create mock materials based on the selection
        const mockMaterials = item.selectedBuyRims.map(rim => ({
            materialid: `MAT_${item.selectedBuyPattern}_${rim}`,
            material: `${item.selectedBuyPattern} Material - ${rim}"`,
            pattern: item.selectedBuyPattern,
            rimdiameter: rim
        }));
        
        item.availableBuyMaterials = mockMaterials;
    } catch (error) {
        console.error('Error loading buy materials:', error);
        item.availableBuyMaterials = [];
    }
};

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
    } finally {
        loadingFreeMaterials.value = false;
    }
};

const submitForm = async () => {
    try {
        // Prepare data for API
        const formData = new FormData();
        
        // Sales Program Data
        formData.append('programID', salesProgram.value.id);
        formData.append('pricegroup', salesProgram.value.priceGroup);
        formData.append('type', salesProgram.value.type);
        formData.append('programName', salesProgram.value.title);
        formData.append('desc', salesProgram.value.desc);
        formData.append('startdate', salesProgram.value.startDate);
        formData.append('enddate', salesProgram.value.endDate);
        formData.append('status', salesProgram.value.status);
        
        // Image file
        if (salesProgram.value.image && salesProgram.value.image.startsWith('data:')) {
            const blob = dataURLtoBlob(salesProgram.value.image);
            formData.append('image', blob, 'sales-program-image.jpg');
        }
        
        // Prepare spFOC_array from program items
        const spFOCArray = programItems.value.map(item => {
            // For buy materials, we need to create entries for each pattern+rim combination
            const buyEntries = [];
            
            if (item.selectedBuyPattern && item.selectedBuyRims.length > 0) {
                item.selectedBuyRims.forEach(rim => {
                    buyEntries.push({
                        pattern: item.selectedBuyPattern,
                        patternname: buyPatternOptions.value.find(p => p.value === item.selectedBuyPattern)?.patternName || '',
                        size: rim,
                        status: item.status
                    });
                });
            }
            
            return {
                buyQty: item.buyQty,
                freeQty: item.freeQty,
                freematerialid: item.selectedFreeMaterial,
                freematerialdesc: item.freeMaterialData?.material || '',
                freeQuota: null, // Add if needed
                buyEntries: buyEntries
            };
        });
        
        // Flatten the buy entries
        const flattenedSpFOCArray = [];
        spFOCArray.forEach(item => {
            item.buyEntries.forEach(entry => {
                flattenedSpFOCArray.push({
                    pattern: entry.pattern,
                    patternname: entry.patternname,
                    size: entry.size,
                    status: entry.status,
                    buyQty: item.buyQty,
                    freeQty: item.freeQty,
                    freematerialid: item.freematerialid,
                    freematerialdesc: item.freematerialdesc,
                    freeQuota: item.freeQuota
                });
            });
        });
        
        formData.append('spFOC_array', JSON.stringify(flattenedSpFOCArray));
        
        // For the first item (assuming single free material per submission)
        const firstItem = programItems.value[0];
        if (firstItem) {
            formData.append('freematerialid', firstItem.selectedFreeMaterial || '');
            formData.append('freematerialdesc', firstItem.freeMaterialData?.material || '');
            formData.append('buyQty', firstItem.buyQty);
            formData.append('freeQty', firstItem.freeQty);
            formData.append('freeQuota', firstItem.freeQuota || '');
        }
        
        const response = await api.post('sales-program/create-sales-program', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (response.data.status === 1) {
            console.log('Sales program created successfully');
            // Redirect or show success message
        } else {
            console.error('Error creating sales program:', response.data.error);
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

// Helper function to convert data URL to blob
const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

// Watch for type changes to clear program items
watch(
    () => salesProgram.value.type,
    (newType) => {
        programItems.value = [];
    }
);

// Load initial data
onMounted(() => {
    loadBuyPatterns();
    loadFreeMaterials();
});
</script>