
<template>
    <Fluid>
        <!-- 🎯 Create Campaign -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Campaign</div>

                <!-- Campaign Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="campaign.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="campaign.description" rows="3" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Term & Condition</label>
                        <Textarea v-model="campaign.termCondition" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Quota</label>
                            <InputNumber v-model="campaign.quota" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Max Per User</label>
                            <InputNumber v-model="campaign.maxPerUser" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Gamification</label>
                            <Dropdown v-model="campaign.isGamification" :options="gamificationOnOff" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="campaign.publishDate" showIcon dateFormat="dd-mm-yy" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="campaign.startDate" showIcon dateFormat="dd-mm-yy" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="campaign.endDate" showIcon dateFormat="dd-mm-yy" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Campaign Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, idx) in ['image1', 'image2', 'image3']" :key="idx">
                            <FileUpload mode="basic" :name="field" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Upload Image ${idx + 1}`" class="w-full" />
                            <img v-if="campaign[field]" :src="campaign[field]" :alt="`Preview ${idx + 1}`" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 💎 Point Section -->
        <div class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">💎 Point Configuration</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block font-bold text-gray-700">Silver Points</label>
                    <InputNumber v-model="campaign.point1" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Gold Points</label>
                    <InputNumber v-model="campaign.point2" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Platinum Points</label>
                    <InputNumber v-model="campaign.point3" class="w-full" />
                </div>
            </div>
        </div>

        <!-- 📋 Criteria Section -->
        <div  class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
            </div>

            <div v-if="criterias.length > 0" class="space-y-4">
                <div v-for="(criteria, index) in criterias" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Criteria {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeCriteria(index)" />
                    </div>

                    <div class="grid grid-cols-1 gap-4 items-end">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Select Tyre Pattern</label>
                            <Dropdown v-model="criteria.selected" :options="listCriteria" optionLabel="material" placeholder="Select pattern" class="w-full mb-4">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <div>
                                            <div class="font-semibold">{{ slotProps.option.material }}</div>
                                            <small class="text-gray-500">{{ slotProps.option.pattern_name }} • {{ slotProps.option.sectionwidth }}/{{ slotProps.option.tireseries }} R{{ slotProps.option.rimdiameter }}</small>
                                        </div>
                                    </div>
                                </template>
                            </Dropdown>
                            <div v-if="criteria.selected">
                                <label class="block font-bold text-gray-700 mb-1">Min. Qty</label>
                                <InputNumber v-model="criteria.minQty" class="w-full mt-2" placeholder="Minimum Quantity" :min="1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No criteria added yet.</div>

            <div class="flex justify-start mt-4">
                <Button icon="pi pi-plus" label="Add Criteria" class="p-button-info p-button-sm" @click="addCriteria" />
            </div>
        </div>

        <!-- 🏆 Reward Section -->
        <div class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">🏆 Reward Section</div>
            </div>

            <div v-if="rewards.length > 0" class="space-y-4">
                <div v-for="(reward, index) in rewards" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Reward {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeReward(index)" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Reward</label>
                            <Dropdown v-model="reward.selected" :options="listPrize" optionLabel="title" placeholder="Select a reward" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <img v-if="slotProps.option.processedImageURL" :src="slotProps.option.processedImageURL" class="w-28 h-16 object-cover rounded" />
                                        <div v-else class="w-28 h-16 bg-gray-200 rounded flex items-center justify-center">
                                            <i class="pi pi-image text-gray-400"></i>
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-gray-800">{{ slotProps.option.title }}</span>
                                            <small class="text-gray-500">{{ slotProps.option.type }} • {{ slotProps.option.purpose }}</small>
                                        </div>
                                    </div>
                                </template>
                            </Dropdown>
                        </div>

                        <div class="w-full">
                            <FloatLabel>
                                <InputNumber id="qty" v-model="reward.qty" :min="1" class="w-full" />
                                <label for="qty">Quantity</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No rewards added yet.</div>

            <div class="flex justify-start mt-4">
                <Button icon="pi pi-plus" label="Add Reward" style="width: fit-content" class="p-button-success p-button-sm" :disabled="rewards.length >= 10" @click="addReward" />
            </div>

            <div class="flex justify-end mt-8 gap-2">
                <div class="w-40">
                    <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" @click="submitEvent" :loading="isSubmitting" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';

const router = useRouter();

// Campaign data
const campaign = ref({
    title: 'TEST OFF',
    description: 'TEST OFF',
    termCondition: 'TEST OFF',
    image1: '',
    image2: '',
    image3: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    isGamification: 'off', // Changed to string to match dropdown
    quota: 1,
    maxPerUser: 1,
    point1: 1,
    point2: 1,
    point3: 1,
    status: 1
});

// UI state
const isSubmitting = ref(false);

// Gamification toggle - using strings 'on'/'off' as per API requirement
const gamificationOnOff = [
    { label: 'ON', value: 'on' },
    { label: 'OFF', value: 'off'}
];

// Criteria section
const criterias = ref([]);
const listCriteria = ref([]);

// Reward section
const rewards = ref([]);
const listPrize = ref([]);

// API functions
const fetchMaterials = async () => {
    try {
        const response = await api.post('list-material', { type: 'EXCEPTION' });
        if (response.data.status === 1) {
            listCriteria.value = response.data.admin_data || [];
        }
    } catch (error) {
        console.error('Error fetching materials:', error);
    }
};

const fetchCatalog = async () => {
    try {
        const response = await api.get('campaign/catalogs');
        if (response.data.status === 1) {
            listPrize.value = response.data.admin_data || [];
        }
                    // Transform API data to match frontend expectations
            const transformedItems = (response.data.admin_data || []).map((item) => ({
                imageURL: item.imageURL, 
                title: item.title, 
                type: item.type, 
                purpose: item.purpose, 
                processedImageURL: null // Will be populated by processCatalogueImages
            }));

            console.log('Transformed items before processing:', transformedItems);

            // Process private images
            const processedItems = await processCatalogueImages(transformedItems);
            listPrize.value = processedItems;
    } catch (error) {
        console.error('Error fetching catalog:', error);
    }
};

// Criteria management
const addCriteria = () => criterias.value.push({ 
    selected: null, 
    minQty: 1 
});

const removeCriteria = (index) => criterias.value.splice(index, 1);

// Reward management
const addReward = () => rewards.value.push({ 
    selected: null, 
    qty: 1 
});

const removeReward = (index) => rewards.value.splice(index, 1);

// Image upload
const onImageSelect = (event, field) => {
    // PrimeVue emits wrapper objects sometimes — extract the real File
    let file = event.files?.[0];

    // 🔍 Safety check: convert to real File if needed
    if (file && !(file instanceof File) && file instanceof Blob) {
        // Some PrimeVue versions wrap Blob; fix that
        file = new File([file], file.name || 'upload.jpg', { type: file.type });
    }

    if (file instanceof File) {
        // console.log('✅ Real file selected:', file);

        // Store File object for upload
        campaign.value[`${field}File`] = file;

        // Create Base64 preview for UI
        const reader = new FileReader();
        reader.onload = (e) => {
            campaign.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        console.warn('⚠️ Not a real File object:', file);
    }
};

// Process private images using the API method
const processCatalogueImages = async (catalogueItems) => {
    const processedItems = [];

    for (const item of catalogueItems) {
        if (item.imageURL && typeof item.imageURL === 'string') {
            try {
                console.log('Processing private image:', item.imageURL);
                const blobUrl = await api.getPrivateFile(item.imageURL);
                if (blobUrl) {
                    processedItems.push({
                        ...item,
                        processedImageURL: blobUrl
                    });
                    console.log('Successfully processed image:', item.prizeName, blobUrl);
                } else {
                    // Fallback to original URL if private file loading fails
                    processedItems.push({
                        ...item,
                        processedImageURL: item.imageURL
                    });
                    console.warn('Failed to process private image, using original:', item.imageURL);
                }
            } catch (error) {
                console.error(`Error loading catalogue image for ${item.prizeName}:`, error);
                // Fallback to original URL
                processedItems.push({
                    ...item,
                    processedImageURL: item.imageURL
                });
            }
        } else {
            // No image URL, use placeholder
            processedItems.push({
                ...item,
                processedImageURL: 'https://via.placeholder.com/150x100?text=No+Image'
            });
        }
    }

    return processedItems;
};

// Format date to dd-mm-yyyy
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Validation
const validateForm = () => {
    if (!campaign.value.title || !campaign.value.description || !campaign.value.termCondition) {
        alert('Please fill in all required fields: Title, Description, and Terms & Conditions');
        return false;
    }

    if (!campaign.value.publishDate || !campaign.value.startDate || !campaign.value.endDate) {
        alert('Please select all dates: Publish Date, Start Date, and End Date');
        return false;
    }

    // Fixed: Check for string 'on' instead of number 1

        if (criterias.value.length === 0) {
            alert('Please add at least one criteria for gamification campaign');
            return false;
        }

        // Validate criteria
        for (let i = 0; i < criterias.value.length; i++) {
            const criteria = criterias.value[i];
            if (!criteria.selected || !criteria.minQty) {
                alert(`Please complete all fields for Criteria ${i + 1}`);
                return false;
            }
        }

        if (rewards.value.length === 0) {
            alert('Please add at least one reward for gamification campaign');
            return false;
        }

        // Validate rewards
        for (let i = 0; i < rewards.value.length; i++) {
            const reward = rewards.value[i];
            if (!reward.selected || !reward.qty) {
                alert(`Please complete all fields for Reward ${i + 1}`);
                return false;
            }
        }
    

    return true;
};


// Submit event - FIXED VERSION
const submitEvent = async () => {
    if (!validateForm()) return;

    isSubmitting.value = true;

    try {
        const formData = new FormData();

        // Basic campaign data
        formData.append('title', campaign.value.title);
        formData.append('description', campaign.value.description);
        formData.append('tnc', campaign.value.termCondition);
        formData.append('publishDate', formatDate(campaign.value.publishDate));
        formData.append('startDate', formatDate(campaign.value.startDate));
        formData.append('endDate', formatDate(campaign.value.endDate));
        formData.append('quota', campaign.value.quota.toString());
        formData.append('maxPerUser', campaign.value.maxPerUser.toString());
        formData.append('isGamification', campaign.value.isGamification); // Already string 'on'/'off'
        formData.append('point1', campaign.value.point1.toString());
        formData.append('point2', campaign.value.point2.toString());
        formData.append('point3', campaign.value.point3.toString());

        // Handle images
        // Handle formData submission
        if (campaign.value.image1File) {
            formData.append('image1', campaign.value.image1File);
        }
        if (campaign.value.image2File) {
            formData.append('image2', campaign.value.image2File);
        }
        if (campaign.value.image3File) {
            formData.append('image3', campaign.value.image3File);
        }       
        

        // FIXED: Always send criteria and reward_option, even if empty
        let criteriaArray = [];
        let rewardOptions = [];

       
   
            // Prepare criteria array
            criteriaArray = criterias.value.map(criteria => ({
                title: criteria.selected.material,
                type: criteria.selected.materialtype,
                pattern: criteria.selected.pattern,
                size: criteria.selected.rimdiameter.toString(),
                minQty: criteria.minQty.toString()
            }));

            // Prepare reward options array
            rewardOptions = rewards.value.map(reward => ({
                catalogID: reward.selected.id.toString(),
                quantity: reward.qty.toString()
            }));
        

        // FIXED: Always append these fields, even if empty
        formData.append('criteria', JSON.stringify(criteriaArray));
        formData.append('reward_option', JSON.stringify(rewardOptions));

        // ✅ Log all FormData contents
        for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            // console.log(`${key}:`, value.name, value.type, value.size, value);
        } else {
            // console.log(`${key}:`, value);
        }
}
            const response = await api.customRequest({
            method: 'POST',
            url: '/api/campaign/create',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            alert('Campaign created successfully!');
            router.back();
        } else {
            alert('Failed to create campaign: ' + (response.data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating campaign:', error);
        if (error.response?.data) {
            console.error('API Error response:', error.response.data);
            alert('Error creating campaign: ' + (error.response.data.error?.messageEnglish || 'Validation error'));
        } else {
            alert('Error creating campaign. Please try again.');
        }
    } finally {
        isSubmitting.value = false;
    }
};

// Initialize data
onMounted(() => {
    fetchMaterials();
    fetchCatalog();
});
</script>