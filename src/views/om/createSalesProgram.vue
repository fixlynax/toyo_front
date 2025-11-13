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

                    <div>
                        <label class="block font-bold text-gray-700">Program Type</label>
                        <InputText v-model="salesProgram.type" class="w-full" disabled />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Sales Program ID</label>
                        <InputText v-model="salesProgram.programID" class="w-full" />
                    </div>
                </div>

                <!-- Upload Image -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Sales Program Image</label>
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
                                chooseLabel="Upload Program Image" 
                                class="w-full" 
                            />
                            <div v-if="imagePreview" class="mt-2">
                                <img :src="imagePreview" alt="Preview" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <p class="text-xs text-gray-500 mt-1 text-center">
                                    File size: {{ formatFileSize(currentFileSize) }}
                                </p>
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
                                        <InputNumber v-model="programItem.freeQty" class="w-full" :min="1" showButtons />
                                        <span class="text-sm text-green-600 font-medium">items</span>
                                    </div>
                                    <p class="text-xs text-green-600 mt-1">Number of free items customer will receive</p>
                                </div>
                            </div>
                        </div>

                        <!-- Buy Materials Section - Single Selection with Select Button -->
                        <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center gap-2">
                                    <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                        <i class="pi pi-tags text-blue-600"></i>
                                        Buy Materials
                                    </h4>
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Select pattern and rim diameters, then click Select</span>
                                </div>
                                <Button v-if="programItem.buyMaterials.length > 0" icon="pi pi-times" label="Clear All Selections" style="width: fit-content" class="p-button-text p-button-sm p-button-danger" @click="clearAllBuySelections" />
                            </div>

                            <!-- Pattern Selection Section -->
                            <div class="space-y-4">
                                <!-- Current Selection -->
                                <div class="border border-blue-200 rounded-lg p-4 bg-white">
                                    <h5 class="font-medium text-gray-700 flex items-center gap-2 mb-3">
                                        <i class="pi pi-filter text-blue-500"></i>
                                        Select Pattern and Rim Diameters
                                    </h5>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                                            <Dropdown
                                                v-model="currentSelection.selectedPattern"
                                                :options="buyPatternOptions"
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Select Pattern"
                                                class="w-full"
                                                :filter="true"
                                                :loading="loadingBuyPatterns"
                                                @change="onPatternChange(currentSelection)"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Rim Diameter</label>
                                            <MultiSelect
                                                v-model="currentSelection.selectedRims"
                                                :options="currentSelection.availableRims"
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Select Rim Diameter"
                                                class="w-full"
                                                :filter="true"
                                                :disabled="!currentSelection.selectedPattern"
                                                :loading="loadingBuyRims"
                                            />
                                        </div>
                                    </div>

                                    <!-- Select Button -->
                                    <div class="flex justify-end mt-4">
                                        <Button icon="pi pi-check" label="Select" class="p-button-success p-button-sm" :disabled="!currentSelection.selectedPattern || currentSelection.selectedRims.length === 0" @click="addSelectedMaterials" />
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Buy Materials Display -->
                            <div v-if="programItem.buyMaterials.length > 0" class="mt-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">Selected Buy Materials ({{ programItem.buyMaterials.length }})</span>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-blue-200 rounded-lg bg-white">
                                    <div
                                        v-for="(material, index) in programItem.buyMaterials"
                                        :key="material.pattern + '_' + material.size + '_' + index"
                                        class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-medium text-blue-800 truncate">{{ material.patternname }}</div>
                                            <div class="flex flex-wrap items-center gap-2 mt-1">
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Pattern: {{ material.pattern }}</span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ material.size }}"</span>
                                            </div>
                                        </div>
                                        <Button icon="pi pi-times" class="p-button-danger p-button-text p-button-sm" @click="removeBuyMaterial(index)" />
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mt-4">
                                <i class="pi pi-inbox text-3xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500 text-sm">No buy materials selected</p>
                                <p class="text-gray-400 text-xs mt-1">Select pattern and rim diameters, then click Select button</p>
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
                                <div class="flex items-center gap-4">
                                    <!-- Dropdown -->
                                    <Dropdown
                                        v-model="programItem.selectedFreeMaterial"
                                        :options="freeMaterialOptions"
                                        optionLabel="material"
                                        optionValue="materialid"
                                        placeholder="Select Free Material"
                                        class="w-2/3"
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

                                    <!-- InputNumber -->
                                    <div class="flex flex-col w-1/3">
                                        <label class="block text-sm font-medium text-gray-700 mb-2 md:hidden">Free Quota</label>
                                        <InputNumber v-model="programItem.freeQuota" class="w-full" :min="1" showButtons />
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Free Material Display -->
                            <div v-if="programItem.selectedFreeMaterial && programItem.freeMaterialData" class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">Selected Free Material</span>
                                </div>

                                <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-green-800">{{ programItem.freeMaterialData.material }}</div>
                                        <div class="text-xs text-green-600 mt-1">Material ID: {{ programItem.freeMaterialData.materialid }}</div>
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
                        <Button 
                            label="Submit" 
                            class="w-full" 
                            @click="submitForm" 
                            :loading="submitting"
                            :disabled="submitting"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const toast = useToast();

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 10MB in bytes

const salesProgram = ref({
    programID: '',
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

// Current selection for buy materials
const currentSelection = ref({
    selectedPattern: null,
    selectedRims: [],
    availableRims: []
});

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
const loadingBuyRims = ref(false);
const loadingFreeMaterials = ref(false);

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

// Helper functions
const onPatternChange = async (selection) => {
    selection.selectedRims = [];
    selection.availableRims = [];

    if (selection.selectedPattern) {
        await loadPatternRims(selection);
    }
};

const addSelectedMaterials = () => {
    if (!currentSelection.value.selectedPattern || currentSelection.value.selectedRims.length === 0) {
        return;
    }

    const selectedPattern = buyPatternOptions.value.find((pattern) => pattern.value === currentSelection.value.selectedPattern);

    if (selectedPattern) {
        currentSelection.value.selectedRims.forEach((rim) => {
            // Check if this combination already exists
            const exists = programItem.value.buyMaterials.some((material) => material.pattern === currentSelection.value.selectedPattern && material.size === rim);

            if (!exists) {
                programItem.value.buyMaterials.push({
                    pattern: currentSelection.value.selectedPattern,
                    patternname: selectedPattern.patternName,
                    size: rim,
                    status: 1
                });
            }
        });

        // Clear current selection after adding
        currentSelection.value.selectedPattern = null;
        currentSelection.value.selectedRims = [];
        currentSelection.value.availableRims = [];

        showInfo(`Added ${currentSelection.value.selectedRims.length} rim diameter(s) to buy materials`);
    }
};

const removeBuyMaterial = (index) => {
    programItem.value.buyMaterials.splice(index, 1);
    showInfo('Buy material removed');
};

const clearAllBuySelections = () => {
    programItem.value.buyMaterials = [];
    currentSelection.value.selectedPattern = null;
    currentSelection.value.selectedRims = [];
    currentSelection.value.availableRims = [];
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
        showError('Failed to load buy patterns');
    } finally {
        loadingBuyPatterns.value = false;
    }
};

const loadPatternRims = async (selection) => {
    try {
        loadingBuyRims.value = true;
        const selectedPattern = buyPatternOptions.value.find((pattern) => pattern.value === selection.selectedPattern);

        if (selectedPattern && selectedPattern.rimSizes) {
            selection.availableRims = selectedPattern.rimSizes.map((size) => ({
                label: `${size}"`,
                value: size.toString()
            }));
        } else {
            selection.availableRims = [];
        }
    } catch (error) {
        console.error('Error loading pattern rims:', error);
        selection.availableRims = [];
        showError('Failed to load rim diameters');
    } finally {
        loadingBuyRims.value = false;
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

    if (!imageFile.value) {
        showError('Please upload an image');
        return false;
    }

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

        // ✅ Generate spFOC_array in the correct format
        const spFOCArray = programItem.value.buyMaterials.map((material) => ({
            pattern: material.pattern,
            patternname: material.patternname,
            size: material.size,
            status: 1
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
            // console.log('Sales program created successfully');
            showSuccess('Sales program created successfully!');
            setTimeout(() => {
                window.location.href = '/om/listSalesProgram';
            }, 1500);
        } else {
            // console.error('Error creating sales program:', response.data.error);
            showError('Error creating sales program: ' + (response.data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        // showError('Error submitting form: ' + (error.message || 'Please try again'));
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
        currentSelection.value = {
            selectedPattern: null,
            selectedRims: [],
            availableRims: []
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