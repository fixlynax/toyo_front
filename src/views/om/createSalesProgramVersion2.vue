<!-- <template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
            
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Sales Program</div>

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

            
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Sales Program Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" customUpload @select="onImageSelect" chooseLabel="Upload Program Image" class="w-full" />
                            <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                        </div>
                    </div>
                </div>

          
                <div>
                  
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
                    </div>

                
                    <div v-if="programItems.length > 0" class="space-y-6">
                        <div v-for="(item, index) in programItems" :key="index" class="border rounded-xl p-6 shadow-sm bg-gray-100 hover:shadow-md transition-shadow duration-200">
                         
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                        <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                                    </div>
                                    <h3 class="font-semibold text-lg text-gray-800">Criteria {{ index + 1 }}</h3>
                                </div>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeProgramItem(index)" />
                            </div>
   

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

                     
                            <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-tags text-blue-600"></i>
                                            Buy Materials
                                        </h4>
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">All matching materials will be included</span>
                                    </div>
                                    <Button
                                        v-if="item.selectedBuyPatterns.length > 0 || item.selectedBuyRims.length > 0"
                                        icon="pi pi-times"
                                        label="Clear Selection"
                                        style="width: fit-content"
                                        class="p-button-text p-button-sm p-button-danger"
                                        @click="clearBuySelection(item)"
                                    />
                                </div>

                        
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                                        <MultiSelect
                                            v-model="item.selectedBuyPatterns"
                                            :options="buyPatternOptions"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Select Patterns"
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
                                            :disabled="item.selectedBuyPatterns.length === 0"
                                            :loading="loadingBuyRims"
                                            @change="updateBuyMaterials(item)"
                                        />
                                    </div>
                                </div>

                         
                                <div v-if="item.buyMaterials.length > 0" class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700">Selected Buy Materials ({{ item.buyMaterials.length }})</span>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border border-blue-200 rounded-lg bg-white">
                                        <div v-for="material in item.buyMaterials" :key="material.pattern + '_' + material.size" class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                                            <div class="flex-1 min-w-0">
                                                <div class="text-sm font-medium text-blue-800 truncate">{{ material.patternname }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Pattern: {{ material.pattern }}</span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">Rim: {{ material.size }}"</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="item.selectedBuyPatterns.length === 0 || item.selectedBuyRims.length === 0" class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
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

                         
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div class="md:col-span-2">
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
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Free Quota</label>
                                        <InputNumber v-model="item.freeQuota" class="w-full" :min="1" showButtons />
                                    </div>
                                </div>

                            
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

          
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                        <p class="text-lg">No criteria added yet</p>
                        <p class="text-sm">Click "Add Criteria" to create your first promotion rule</p>
                    </div>
                </div>
                <Button icon="pi pi-plus" label="Add Criteria" class="p-button-success p-button-sm" :disabled="programItems.length >= 20" @click="addProgramItem" />

           
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

const programItems = ref([]);


const buyPatternOptions = ref([]);
const freeMaterialOptions = ref([]);
const loadingBuyPatterns = ref(false);
const loadingBuyRims = ref(false);
const loadingFreeMaterials = ref(false);


const onBuyPatternChange = async (item) => {
    item.selectedBuyRims = [];
    item.buyMaterials = [];
    item.availableBuyRims = [];

    if (item.selectedBuyPatterns.length > 0) {
        await loadBuyRims(item);
    }
};

const updateBuyMaterials = async (item) => {
    if (item.selectedBuyPatterns.length > 0 && item.selectedBuyRims.length > 0) {
        await loadBuyMaterials(item);
    } else {
        item.buyMaterials = [];
    }
};

const clearBuySelection = (item) => {
    item.selectedBuyPatterns = [];
    item.selectedBuyRims = [];
    item.buyMaterials = [];
    item.availableBuyRims = [];
};

const onFreeMaterialChange = (item) => {
    if (item.selectedFreeMaterial) {
        const selectedMaterial = freeMaterialOptions.value.find(
            (material) => material.materialid === item.selectedFreeMaterial
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
    const material = freeMaterialOptions.value.find((m) => m.materialid === materialId);
    return material ? material.material : materialId;
};

const addProgramItem = () => {
    programItems.value.push({
        buyQty: 1,
        freeQty: 1,
        freeQuota: null,
        buyMaterials: [],
        selectedFreeMaterial: null,
        freeMaterialData: null,
        selectedBuyPatterns: [], 
        selectedBuyRims: [],
        availableBuyRims: [],
        status: 1
    });
};

const removeProgramItem = (index) => {
    programItems.value.splice(index, 1);
};

const onImageSelect = (event) => {
    const file = event.files[0];
    if (file) {
        imageFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};


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
        
     
        const allRimSizes = new Set();
        
        item.selectedBuyPatterns.forEach(patternCode => {
            const selectedPattern = buyPatternOptions.value.find(
                pattern => pattern.value === patternCode
            );
            
            if (selectedPattern && selectedPattern.rimSizes) {
                selectedPattern.rimSizes.forEach(size => {
                    allRimSizes.add(size.toString());
                });
            }
        });

    
        item.availableBuyRims = Array.from(allRimSizes).map(size => ({
            label: `${size}"`,
            value: size
        })).sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

    } catch (error) {
        console.error('Error loading buy rims:', error);
        item.availableBuyRims = [];
    } finally {
        loadingBuyRims.value = false;
    }
};

const loadBuyMaterials = async (item) => {
    try {
        item.buyMaterials = [];
        
    
        item.selectedBuyPatterns.forEach(patternCode => {
            const selectedPattern = buyPatternOptions.value.find(
                pattern => pattern.value === patternCode
            );
            
            if (selectedPattern) {
                item.selectedBuyRims.forEach(rim => {
                    item.buyMaterials.push({
                        pattern: patternCode,
                        patternname: selectedPattern.patternName,
                        size: rim,
                        status: 1
                    });
                });
            }
        });
        
    } catch (error) {
        console.error('Error loading buy materials:', error);
        item.buyMaterials = [];
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
        // Validation
        if (!salesProgram.value.programID) {
            alert('Please enter Sales Program ID');
            return;
        }

        if (!salesProgram.value.programName) {
            alert('Please enter Program Name');
            return;
        }

        if (!salesProgram.value.startdate || !salesProgram.value.enddate) {
            alert('Please select both Start Date and End Date');
            return;
        }

        if (!imageFile.value) {
            alert('Please upload an image');
            return;
        }

        if (programItems.value.length === 0) {
            alert('Please add at least one criteria');
            return;
        }

        // Validate each program item
        for (const item of programItems.value) {
            if (item.selectedBuyPatterns.length === 0 || item.selectedBuyRims.length === 0) {
                alert('Please select buy materials for all criteria');
                return;
            }
            if (!item.selectedFreeMaterial) {
                alert('Please select free material for all criteria');
                return;
            }
            if (!item.freeQuota || item.freeQuota < 1) {
                alert('Please enter free quota for all criteria');
                return;
            }
        }

  
        const spFOCArray = programItems.value.flatMap((item) =>
            item.buyMaterials.map((mat) => ({
                pattern: mat.pattern,
                patternname: mat.patternname,
                size: mat.size,
                status: 1
            }))
        );

        console.log('Generated spFOC_array (clean):', JSON.stringify(spFOCArray, null, 2));


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

      
        formData.append('spFOC_array', JSON.stringify(spFOCArray));

   
        const firstItem = programItems.value[0];
        if (firstItem) {
            formData.append('freematerialid', firstItem.selectedFreeMaterial || '');
            formData.append('freematerialdesc', firstItem.freeMaterialData?.material || '');
            formData.append('buyQty', firstItem.buyQty);
            formData.append('freeQty', firstItem.freeQty);
            formData.append('freeQuota', firstItem.freeQuota || '');
        }

        console.log('Submitting form data:', {
            programID: salesProgram.value.programID,
            pricegroup: salesProgram.value.pricegroup,
            programName: salesProgram.value.programName,
            desc: salesProgram.value.desc,
            startdate: formatDate(salesProgram.value.startdate),
            enddate: formatDate(salesProgram.value.enddate),
            spFOC_array: spFOCArray,
            freematerialid: firstItem?.selectedFreeMaterial,
            freematerialdesc: firstItem?.freeMaterialData?.material,
            buyQty: firstItem?.buyQty,
            freeQty: firstItem?.freeQty,
            freeQuota: firstItem?.freeQuota,
            imageFile: imageFile.value.name || 'N/A',
            status: salesProgram.value.status,
            type: salesProgram.value.type
        });

        const response = await api.post('sales-program/create-sales-program', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            console.log('Sales program created successfully');
            alert('Sales program created successfully!');
            window.location.href = '/om/listSalesProgram';
        } else {
            console.error('Error creating sales program:', response.data.error);
            alert('Error creating sales program: ' + (response.data.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form: ' + error.message);
    }
};


const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


watch(
    () => salesProgram.value.type,
    () => {
        programItems.value = [];
    }
);


onMounted(() => {
    loadBuyPatterns();
    loadFreeMaterials();
});
</script> -->