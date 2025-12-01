<template>
    <Fluid>
        <!-- 🎯 Edit Campaign -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Campaign</div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-8">
                    <ProgressSpinner />
                </div>

                <!-- Campaign Form -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="campaign.title" class="w-full" />
                        <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="campaign.description" rows="3" class="w-full" />
                        <small v-if="errors.description" class="text-red-500">{{ errors.description }}</small>
                    </div>

                    <!-- Term & Condition -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Term & Condition</label>
                        <Textarea v-model="campaign.termCondition" rows="3" class="w-full" />
                        <small v-if="errors.termCondition" class="text-red-500">{{ errors.termCondition }}</small>
                    </div>

                    <!-- Quota & Max -->
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

                    <!-- Dates -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="campaign.publishDate" dateFormat="dd-mm-yy" class="w-full" />
                            <small v-if="errors.publishDate" class="text-red-500">{{ errors.publishDate }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="campaign.startDate" dateFormat="dd-mm-yy" class="w-full" />
                            <small v-if="errors.startDate" class="text-red-500">{{ errors.startDate }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="campaign.endDate" dateFormat="dd-mm-yy" class="w-full" />
                            <small v-if="errors.endDate" class="text-red-500">{{ errors.endDate }}</small>
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div v-if="!loading">
                    <label class="block font-bold text-gray-700 mb-2">Campaign Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, idx) in ['image1Path', 'image2Path', 'image3Path']" :key="idx" class="relative">
                            <FileUpload mode="basic" :name="field" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Change Image ${idx + 1}`" class="w-full" />
                            <div v-if="campaign[field]" class="relative mt-2">
                                <img :src="campaign[field]" :alt="`Preview ${idx + 1}`" class="rounded-lg shadow-md object-cover w-full h-60" />
                                <button @click="removeImage(field)" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">&times;</button>
                            </div>
                            <small v-if="errors[`image${idx + 1}`]" class="text-red-500">{{ errors[`image${idx + 1}`] }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 💎 Point Section -->
        <div v-if="!loading" class="card flex flex-col w-full mt-8">
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

        <!-- 🏆 Reward Section -->
        <div v-if="campaign.isGamification == 1 && !loading" class="card flex flex-col w-full mt-8">
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
                <div class="w-30">
                    <Button icon="pi pi-plus" label="Add Reward" class="p-button-success p-button-sm" @click="addReward" />
                </div>
            </div>
        </div>

        <!-- 📋 Criteria Section -->
        <div v-if="campaign.isGamification == 1 && !loading" class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
            </div>

            <div v-if="criterias.length > 0" class="space-y-4">
                <div v-for="(criteria, index) in criterias" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Criteria {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeCriteria(index)" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
                        <!-- Dropdown -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Tyre Pattern</label>
                            <Dropdown v-model="criteria.selected" :options="listCriteria" optionLabel="material" placeholder="Select pattern" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <div>
                                            <div class="font-semibold">{{ slotProps.option.material }}</div>
                                            <small class="text-gray-500">{{ slotProps.option.pattern_name }} • {{ slotProps.option.sectionwidth }}/{{ slotProps.option.tireseries }} R{{ slotProps.option.rimdiameter }}</small>
                                        </div>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-3">
                                        <div class="flex flex-col leading-tight">
                                            <span class="font-semibold text-gray-800">
                                                {{ slotProps.value.material }}
                                            </span>
                                            <div class="text-xs text-gray-600 space-y-0.5">
                                                <div>🧶 <span class="font-medium">Pattern:</span> {{ slotProps.value.pattern_name }}</div>
                                                <div>📏 <span class="font-medium">Size:</span> {{ slotProps.value.sectionwidth }}/{{ slotProps.value.tireseries }} R{{ slotProps.value.rimdiameter }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400 italic">Select pattern</span>
                                </template>
                            </Dropdown>
                            <small v-if="errors[`criteria_${index}`]" class="text-red-500">{{ errors[`criteria_${index}`] }}</small>
                        </div>

                        <!-- Min Qty -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Min. Qty</label>
                            <InputNumber v-model="criteria.minQty" class="w-full" :min="1" />
                            <small v-if="errors[`minQty_${index}`]" class="text-red-500">{{ errors[`minQty_${index}`] }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No criteria added yet.</div>

            <div class="flex justify-start mt-4">
                <div class="w-30">
                    <Button icon="pi pi-plus" label="Add Criteria" class="p-button-info p-button-sm" @click="addCriteria" />
                </div>
            </div>
        </div>

        <!-- ✅ Submit Buttons -->
        <div v-if="!loading" class="flex justify-end mt-8 gap-2">
            <div class="w-40">
                <Button label="Cancel" class="p-button-secondary w-full" @click="$router.back()" />
            </div>
            <div class="w-40">
                <Button label="Update" class="w-full" @click="submitForm" :loading="submitting" />
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const campaignId = route.params.id;
const loading = ref(true);
const submitting = ref(false);
const errors = ref({});

// Campaign data
const campaign = ref({
    id: 0,
    title: '',
    description: '',
    termCondition: '',
    image1Path: '',
    image2Path: '',
    image3Path: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    isGamification: 0,
    quota: 0,
    maxPerUser: 1,
    point1: 0,
    point2: 0,
    point3: 0,
    status: 1
});

const gamificationOnOff = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 }
];

// Image files storage
const imageFiles = ref({
    image1Path: null,
    image2Path: null,
    image3Path: null
});

// Reward and Criteria data
const listPrize = ref([]);
const listCriteria = ref([]);
const originalRewards = ref([]);
const originalCriteria = ref([]);

// 🎯 Reward State
const rewards = ref([]);
const addReward = () => rewards.value.push({ selected: null, qty: 1 });
const removeReward = (index) => rewards.value.splice(index, 1);

// 📋 Criteria State
const criterias = ref([]);
const addCriteria = () => criterias.value.push({ selected: null, minQty: 1 });
const removeCriteria = (index) => criterias.value.splice(index, 1);

// 📸 Image Handling
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

const removeImage = (field) => {
    campaign.value[field] = '';
    imageFiles.value[field] = null;
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

// Parse date from dd-mm-yyyy to Date object
const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
};

// API Functions
const fetchCampaignDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`campaign/details/${campaignId}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const data = response.data.admin_data;
            
            // Set campaign details
            if (data.campaign_details) {
                const details = data.campaign_details;
                
                // Process dates from dd-mm-yyyy to Date objects
                campaign.value = {
                    ...details,
                    publishDate: parseDate(details.publishDate),
                    startDate: parseDate(details.startDate),
                    endDate: parseDate(details.endDate),
                    isGamification: details.isGamification ? 1 : 0
                };

                // Process private images for campaign photos
                await processCampaignImages();
            }

            // Set criteria
            if (Array.isArray(data.criteria)) {
                criterias.value = data.criteria.map(item => ({
                    selected: {
                        material: item.title,
                        materialtype: item.type,
                        pattern_name: item.pattern,
                        sectionwidth: item.size ? item.size.split('/')[0] : '',
                        tireseries: item.size ? item.size.split('/')[1] : '',
                        // rimdiameter: item.size ? item.size.split('R')[1] : ''
                    },
                    minQty: parseInt(item.minQty)
                }));
                originalCriteria.value = [...criterias.value];
            }

            // Set rewards from reward_option
            if (Array.isArray(data.reward_option)) {
                rewards.value = data.reward_option.map(reward => ({
                    selected: {
                        id: reward.catalogID,
                        title: reward.catalog?.title || 'Unknown Prize',
                        type: reward.catalog?.type || 'Unknown',
                        availableqty: reward.catalog?.availableqty || 0,
                        processedImageURL: reward.catalog?.imageURL || ''
                    },
                    qty: parseInt(reward.total_qty)
                }));
                originalRewards.value = [...rewards.value];

                // Process private images for prize photos
                await processPrizeImages();
            }

            // Load additional data
            await fetchMaterials();
            await fetchCatalog();

        } else {
            console.error('API returned error or invalid data:', response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load campaign details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching campaign details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load campaign details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

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

            const processedItems = await processCatalogueImages(transformedItems);
            listPrize.value = processedItems;
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

const processCampaignImages = async () => {
    const imageFields = ['image1Path', 'image2Path', 'image3Path'];

    for (const field of imageFields) {
        if (campaign.value[field] && typeof campaign.value[field] === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(campaign.value[field]);
                if (blobUrl) {
                    campaign.value[field] = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading campaign image ${field}:`, error);
            }
        }
    }
};

const processPrizeImages = async () => {
    for (const reward of rewards.value) {
        if (reward.selected && reward.selected.processedImageURL && typeof reward.selected.processedImageURL === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(reward.selected.processedImageURL);
                if (blobUrl) {
                    reward.selected.processedImageURL = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading prize image for ${reward.selected.title}:`, error);
            }
        }
    }
};

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

    // Points validation
    if (campaign.value.point1 === null || campaign.value.point1 < 0) errors.value.point1 = 'Valid silver points are required';
    if (campaign.value.point2 === null || campaign.value.point2 < 0) errors.value.point2 = 'Valid gold points are required';
    if (campaign.value.point3 === null || campaign.value.point3 < 0) errors.value.point3 = 'Valid platinum points are required';

    // Gamification specific validations
    if (campaign.value.isGamification === 1) {
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
    }

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

    return Object.keys(errors.value).length === 0;
};

// Calculate reward quantity changes
const calculateRewardChanges = () => {
    const rewardOptions = [];
    
    // Find removed rewards (in original but not in current)
    originalRewards.value.forEach(original => {
        const exists = rewards.value.find(reward => 
            reward.selected && reward.selected.id === original.selected.id
        );
        
        if (!exists) {
            // Reward was removed - set quantity to 0
            rewardOptions.push({
                catalogID: original.selected.id.toString(),
                quantity: "0"
            });
        }
    });

    // Process current rewards
    rewards.value.forEach(reward => {
        if (reward.selected) {
            const original = originalRewards.value.find(orig => 
                orig.selected.id === reward.selected.id
            );
            
            if (original) {
                // Existing reward - calculate difference
                const difference = reward.qty - original.qty;
                rewardOptions.push({
                    catalogID: reward.selected.id.toString(),
                    quantity: difference.toString()
                });
            } else {
                // New reward - add with full quantity
                rewardOptions.push({
                    catalogID: reward.selected.id.toString(),
                    quantity: reward.qty.toString()
                });
            }
        }
    });

    return rewardOptions;
};

// 🚀 Submit Form
const submitForm = async () => {
    if (!validateFields()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix all validation errors',
            life: 5000
        });
        return;
    }

    submitting.value = true;

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
        formData.append('isGamification', campaign.value.isGamification === 1 ? 'on' : 'off');
        formData.append('point1', campaign.value.point1.toString());
        formData.append('point2', campaign.value.point2.toString());
        formData.append('point3', campaign.value.point3.toString());

        // Append image files if changed
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}Path`;
            if (imageFiles.value[fieldName]) {
                formData.append(`image${i}`, imageFiles.value[fieldName]);
            }
        }

        // Prepare criteria array (only for gamification campaigns)
        if (campaign.value.isGamification === 1) {
            const criteriaArray = criterias.value.map((criteria) => ({
                title: criteria.selected.material,
                type: criteria.selected.materialtype,
                pattern: criteria.selected.pattern_name,
                // size: criteria.selected.rimdiameter.toString(),
                minQty: criteria.minQty.toString()
            }));
            formData.append('criteria', JSON.stringify(criteriaArray));
        } else {
            formData.append('criteria', JSON.stringify([]));
        }

        // Prepare reward options with quantity changes
        const rewardOptions = campaign.value.isGamification === 1 ? calculateRewardChanges() : [];
        formData.append('reward_option', JSON.stringify(rewardOptions));

        const response = await api.customRequest({
            method: 'POST',
            url: `/api/campaign/edit/${campaignId}`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Campaign updated successfully!',
                life: 3000
            });
            router.push('/marketing/listCampaign');
        } else {
            console.error('Backend error:', response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ? Object.values(response.data.messages).flat().join(', ') : 'Failed to update campaign',
                life: 5000
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        if (error.response?.data) {
            console.error('Error response:', error.response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.messages ? Object.values(error.response.data.messages).flat().join(', ') : 'Something went wrong',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Network error or server unavailable',
                life: 3000
            });
        }
    } finally {
        submitting.value = false;
    }
};

// Initialize data
onMounted(() => {
    fetchCampaignDetails();
});
</script>