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
                        <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="campaign.description" rows="3" class="w-full" />
                        <small v-if="errors.description" class="text-red-500">{{ errors.description }}</small>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Term & Condition</label>
                        <Textarea v-model="campaign.termCondition" rows="3" class="w-full" />
                        <small v-if="errors.termCondition" class="text-red-500">{{ errors.termCondition }}</small>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Quota</label>
                            <InputNumber v-model="campaign.quota" class="w-full" />
                            <small v-if="errors.quota" class="text-red-500">{{ errors.quota }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Max Per User</label>
                            <InputNumber v-model="campaign.maxPerUser" class="w-full" />
                            <small v-if="errors.maxPerUser" class="text-red-500">{{ errors.maxPerUser }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Gamification</label>
                            <Dropdown v-model="campaign.isGamification" :options="gamificationOnOff" optionLabel="label" optionValue="value" class="w-full" />
                            <small v-if="errors.isGamification" class="text-red-500">{{ errors.isGamification }}</small>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="campaign.startDate" :minDate="today" @date-select="onStartDateSelect" />
                            <small v-if="errors.startDate" class="text-red-500">{{ errors.startDate }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="campaign.endDate" :minDate="minEndDate || null" />
                            <small v-if="errors.endDate" class="text-red-500">{{ errors.endDate }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="campaign.publishDate" :maxDate="campaign.endDate || null" :disabled="!campaign.startDate || !campaign.endDate" />
                            <small v-if="errors.publishDate" class="text-red-500">{{ errors.publishDate }}</small>
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Campaign Images <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 2MB)</span> </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, idx) in ['image1', 'image2', 'image3']" :key="idx">
                            <FileUpload mode="basic" :name="field" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Upload Image ${idx + 1}`" class="w-full" />
                            <img v-if="campaign[field]" :src="campaign[field]" :alt="`Preview ${idx + 1}`" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                            <small v-if="errors[`image${idx + 1}`]" class="text-red-500">{{ errors[`image${idx + 1}`] }}</small>
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
                    <small v-if="errors.point1" class="text-red-500">{{ errors.point1 }}</small>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Gold Points</label>
                    <InputNumber v-model="campaign.point2" class="w-full" />
                    <small v-if="errors.point2" class="text-red-500">{{ errors.point2 }}</small>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Platinum Points</label>
                    <InputNumber v-model="campaign.point3" class="w-full" />
                    <small v-if="errors.point3" class="text-red-500">{{ errors.point3 }}</small>
                </div>
            </div>
        </div>

        <!-- 📋 Criteria Section -->
        <div class="card flex flex-col w-full mt-8">
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
                            <small v-if="errors[`criteria_${index}`]" class="text-red-500">{{ errors[`criteria_${index}`] }}</small>
                            <div v-if="criteria.selected">
                                <label class="block font-bold text-gray-700 mb-1">Min. Qty</label>
                                <InputNumber v-model="criteria.minQty" class="w-full mt-2" placeholder="Minimum Quantity" :min="1" />
                                <small v-if="errors[`minQty_${index}`]" class="text-red-500">{{ errors[`minQty_${index}`] }}</small>
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
                        <!-- Select Prize -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Prize</label>
                            <Dropdown v-model="reward.selected" :options="listPrize" optionLabel="title" placeholder="Select a prize" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <img :src="slotProps.option.processedImageURL" class="w-28 h-16 object-cover rounded" />
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-gray-800">{{ slotProps.option.title }}</span>
                                            <small class="text-gray-500">{{ slotProps.option.type }} • Available: {{ slotProps.option.availableqty }}</small>
                                        </div>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-3">
                                        <img :src="slotProps.value.processedImageURL" class="w-14 h-14 object-cover rounded" />
                                        <div>
                                            <span class="font-semibold text-gray-800">{{ slotProps.value.title }}</span>
                                            <small class="block text-gray-500">{{ slotProps.value.type }} • Available: {{ slotProps.value.availableqty }}</small>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400">Select Prize</span>
                                </template>
                            </Dropdown>
                            <small v-if="errors[`reward_${index}`]" class="text-red-500">{{ errors[`reward_${index}`] }}</small>
                        </div>

                        <!-- Quantity -->
                        <div>
                            <FloatLabel>
                                <InputNumber id="qty" v-model="reward.qty" :min="1" class="w-full" />
                                <label for="qty">Quantity</label>
                            </FloatLabel>
                            <small v-if="errors[`qty_${index}`]" class="text-red-500">{{ errors[`qty_${index}`] }}</small>
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
                    <Button label="Submit" class="w-full" @click="submitCampaign" :loading="loading" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const today = new Date();
const minEndDate = ref(null);

// Campaign data
const campaign = ref({
    title: '',
    description: '',
    termCondition: '',
    image1: '',
    image2: '',
    image3: '',
    publishDate: null,
    startDate: null,
    endDate: null,
    isGamification: 'off',
    quota: 0,
    maxPerUser: null,
    point1: 0,
    point2: 0,
    point3: 0,
    status: 0
});

// Image files storage
const imageFiles = ref({
    image1: null,
    image2: null,
    image3: null
});

// When start date changes, reset end date if invalid
const onStartDateSelect = (value) => {
    campaign.value.endDate = null;
    minEndDate.value = value instanceof Date ? value : null;
};

// UI state
const errors = ref({});

// Gamification toggle
const gamificationOnOff = [
    { label: 'ON', value: 'on' },
    { label: 'OFF', value: 'off' }
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
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load materials',
            life: 5000
        });
    }
};

const fetchCatalog = async () => {
    try {
        const response = await api.get('campaign/catalogs');

        if (response.data.status === 1) {
            // Transform API data to match frontend expectations
            const transformedItems = (response.data.admin_data || []).map((item) => ({
                id: item.id,
                imageURL: item.imageURL,
                title: item.title,
                type: item.type,
                purpose: item.purpose,
                totalqty: item.totalqty,
                availableqty: item.availableqty,
                processedImageURL: null
            }));

            // Process private images
            const processedItems = await processCatalogueImages(transformedItems);
            listPrize.value = processedItems;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load prize catalog',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error fetching catalog:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load prize catalog',
            life: 5000
        });
    }
};

// Process private images using the API method
const processCatalogueImages = async (catalogueItems) => {
    const processedItems = [];

    for (const item of catalogueItems) {
        if (item.imageURL && typeof item.imageURL === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(item.imageURL);
                if (blobUrl) {
                    processedItems.push({
                        ...item,
                        processedImageURL: blobUrl
                    });
                } else {
                    processedItems.push({
                        ...item,
                        processedImageURL: item.imageURL
                    });
                }
            } catch (error) {
                console.error(`Error loading catalogue image for ${item.title}:`, error);
                processedItems.push({
                    ...item,
                    processedImageURL: item.imageURL
                });
            }
        } else {
            processedItems.push({
                ...item,
                processedImageURL: 'https://via.placeholder.com/150x100?text=No+Image'
            });
        }
    }

    return processedItems;
};

// Criteria management
const addCriteria = () =>
    criterias.value.push({
        selected: null,
        minQty: 1
    });

const removeCriteria = (index) => criterias.value.splice(index, 1);

// Reward management
const addReward = () =>
    rewards.value.push({
        selected: null,
        qty: 1
    });

const removeReward = (index) => rewards.value.splice(index, 1);

// Image upload
const onImageSelect = (event, field) => {
    const file = event.files[0];
    if (file) {
        // Store the file for upload
        imageFiles.value[field] = file;

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            campaign.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
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
const validateFields = () => {
    errors.value = {};

    // Basic field validation
    if (!campaign.value.title.trim()) errors.value.title = 'Title is required';
    if (!campaign.value.description.trim()) errors.value.description = 'Description is required';
    if (!campaign.value.termCondition.trim()) errors.value.termCondition = 'Terms & Conditions are required';
    if (!campaign.value.publishDate) errors.value.publishDate = 'Publish date is required';
    if (!campaign.value.startDate) errors.value.startDate = 'Start date is required';
    if (!campaign.value.endDate) errors.value.endDate = 'End date is required';
    if (!campaign.value.quota || campaign.value.quota <= 0) errors.value.quota = 'Valid quota is required';
    if (!campaign.value.maxPerUser || campaign.value.maxPerUser <= 0) errors.value.maxPerUser = 'Valid max per user is required';
    if (!campaign.value.isGamification) errors.value.isGamification = 'Gamification setting is required';

    // Points validation
    if (campaign.value.point1 === null || campaign.value.point1 < 0) errors.value.point1 = 'Valid silver points are required';
    if (campaign.value.point2 === null || campaign.value.point2 < 0) errors.value.point2 = 'Valid gold points are required';
    if (campaign.value.point3 === null || campaign.value.point3 < 0) errors.value.point3 = 'Valid platinum points are required';

    // Image validation
    // if (!imageFiles.value.image1) errors.value.image1 = 'Image 1 is required';
    // if (!imageFiles.value.image2) errors.value.image2 = 'Image 2 is required';
    // if (!imageFiles.value.image3) errors.value.image3 = 'Image 3 is required';

    // Criteria validation
    criterias.value.forEach((criteria, index) => {
        if (!criteria.selected) {
            errors.value[`criteria_${index}`] = 'Criteria selection is required';
        }
        if (!criteria.minQty || criteria.minQty <= 0) {
            errors.value[`minQty_${index}`] = 'Valid minimum quantity is required';
        }
    });

    // Reward validation
    rewards.value.forEach((reward, index) => {
        if (!reward.selected) {
            errors.value[`reward_${index}`] = 'Reward selection is required';
        }
        if (!reward.qty || reward.qty <= 0) {
            errors.value[`qty_${index}`] = 'Valid quantity is required';
        } else if (reward.selected && reward.qty > reward.selected.availableqty) {
            errors.value[`qty_${index}`] = `Quantity exceeds available stock (${reward.selected.availableqty} available)`;
        }
    });

    // Date validation
    if (campaign.value.startDate && campaign.value.endDate) {
        const start = new Date(campaign.value.startDate);
        const end = new Date(campaign.value.endDate);
        if (end < start) {
            errors.value.endDate = 'End date cannot be before start date';
        }
    }

    if (campaign.value.publishDate && campaign.value.startDate) {
        const publish = new Date(campaign.value.publishDate);
        const start = new Date(campaign.value.startDate);
        if (start < publish) {
            errors.value.startDate = 'Start date cannot be before publish date';
        }
    }

    // Gamification specific validations
    if (campaign.value.isGamification === 'on') {
        if (criterias.value.length === 0) {
            errors.value.criteria = 'At least one criteria is required for gamification campaign';
        }
        if (rewards.value.length === 0) {
            errors.value.rewards = 'At least one reward is required for gamification campaign';
        }
    }

    return Object.keys(errors.value).length === 0;
};

// Submit campaign
const submitCampaign = async () => {
    if (!validateFields()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix all validation errors',
            life: 5000
        });
        return;
    }

    loading.value = true;

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
        formData.append('isGamification', campaign.value.isGamification);
        formData.append('point1', campaign.value.point1.toString());
        formData.append('point2', campaign.value.point2.toString());
        formData.append('point3', campaign.value.point3.toString());

        // Append image files
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            if (imageFiles.value[fieldName]) {
                formData.append(fieldName, imageFiles.value[fieldName]);
            }
        }

        // Prepare criteria array
        const criteriaArray = criterias.value.map((criteria) => ({
            title: criteria.selected.material,
            type: criteria.selected.materialtype,
            pattern: criteria.selected.pattern,
            size: criteria.selected.rimdiameter.toString(),
            minQty: criteria.minQty.toString()
        }));

        // Prepare reward options array
        const rewardOptions = rewards.value.map((reward) => ({
            catalogID: reward.selected.id.toString(),
            quantity: reward.qty.toString()
        }));

        // Append criteria and reward_option
        formData.append('criteria', JSON.stringify(criteriaArray));
        formData.append('reward_option', JSON.stringify(rewardOptions));

        // Log form data for debugging
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
            } else {
            }
        }
for (let pair of formData.entries()) {
    console.log(pair[0] + ': ', pair[1]);
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
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Campaign created successfully!',
                life: 3000
            });
            router.push('/marketing/listCampaign');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages || 'Failed to create campaign',
                life: 3000
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages || 'Failed to create campaign',
                life: 3000
            });
    } finally {
        loading.value = false;
    }
};

// Initialize data
onMounted(() => {
    fetchMaterials();
    fetchCatalog();
});
</script>
