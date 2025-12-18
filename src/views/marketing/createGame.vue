<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Game</div>

                <!-- Game Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="game.title" class="w-full" />
                        <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="game.description" rows="3" class="w-full" />
                        <small v-if="errors.description" class="text-red-500">{{ errors.description }}</small>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Location</label>
                        <InputText v-model="game.location" class="w-full" />
                        <small v-if="errors.location" class="text-red-500">{{ errors.location }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Quota Player</label>
                        <InputNumber v-model="game.quota" class="w-full" />
                        <small v-if="errors.quota" class="text-red-500">{{ errors.quota }}</small>
                    </div>

                    <!-- <div>
                        <label class="block font-bold text-gray-700">Type Game</label>
                        <Dropdown v-model="game.type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full" />
                        <small v-if="errors.type" class="text-red-500">{{ errors.type }}</small>
                    </div> -->
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                    <div>
                        <label class="block font-bold text-gray-700">Publish Date</label>
                        <Calendar v-model="game.publishDate" showIcon dateFormat="dd-mm-yy" class="w-full"  :minDate="today" />
                        <small v-if="errors.publishDate" class="text-red-500">{{ errors.publishDate }}</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Start Date</label>
                        <Calendar v-model="game.startDate" showIcon dateFormat="dd-mm-yy" class="w-full" :minDate="today" @date-select="onStartDateSelect" />
                        <small v-if="errors.startDate" class="text-red-500">{{ errors.startDate }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">End Date</label>
                        <Calendar v-model="game.endDate" showIcon dateFormat="dd-mm-yy" class="w-full" :minDate="minEndDate" />
                        <small v-if="errors.endDate" class="text-red-500">{{ errors.endDate }}</small>
                    </div>
                </div>

                <!-- TNC Section -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Terms & Conditions</label>
                    <Textarea v-model="game.tnc" rows="3" class="w-full" />
                    <small v-if="errors.tnc" class="text-red-500">{{ errors.tnc }}</small>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Game Images <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 2MB)</span> </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1')" chooseLabel="Upload Image 1" class="w-full" />
                            <img v-if="game.image1URL" :src="game.image1URL" alt="Preview 1" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                            <small v-if="errors.image1" class="text-red-500">{{ errors.image1 }}</small>
                        </div>
                        <div>
                            <FileUpload mode="basic" name="image2" accept="image/*" customUpload @select="onImageSelect($event, 'image2')" chooseLabel="Upload Image 2" class="w-full" />
                            <img v-if="game.image2URL" :src="game.image2URL" alt="Preview 2" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                            <small v-if="errors.image2" class="text-red-500">{{ errors.image2 }}</small>
                        </div>
                        <div>
                            <FileUpload mode="basic" name="image3" accept="image/*" customUpload @select="onImageSelect($event, 'image3')" chooseLabel="Upload Image 3" class="w-full" />
                            <img v-if="game.image3URL" :src="game.image3URL" alt="Preview 3" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                            <small v-if="errors.image3" class="text-red-500">{{ errors.image3 }}</small>
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
                    <InputNumber v-model="game.point1" class="w-full" />
                    <small v-if="errors.point1" class="text-red-500">{{ errors.point1 }}</small>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Gold Points</label>
                    <InputNumber v-model="game.point2" class="w-full" />
                    <small v-if="errors.point2" class="text-red-500">{{ errors.point2 }}</small>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Platinum Points</label>
                    <InputNumber v-model="game.point3" class="w-full" />
                    <small v-if="errors.point3" class="text-red-500">{{ errors.point3 }}</small>
                </div>
            </div>
        </div>

        <!-- 🏆 Prize Section -->
        <div class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">🏆 Prize Section</div>
            </div>

            <div v-if="prizes.length > 0" class="space-y-4">
                <div v-for="(prize, index) in prizes" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Prize {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removePrize(index)" />
                    </div>

                    <!-- Prize & Quantity Side by Side -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <!-- Select Prize (2/3) -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Prize</label>
                            <Dropdown v-model="prize.selected" :options="listPrize" optionLabel="prizeName" placeholder="Select a prize" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <div class="w-28 h-16 flex items-center justify-center bg-gray-100 rounded border">
                                            <img :src="slotProps.option.processedImageURL" :alt="slotProps.option.prizeName" class="max-w-full max-h-full object-contain" @load="onImageLoad" @error="onImageError" />
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-gray-800">{{ slotProps.option.prizeName }}</span>
                                            <small class="text-gray-500">{{ slotProps.option.prizeType }} • Available: {{ slotProps.option.availableqty }}</small>
                                        </div>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-3">
                                        <div class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded border">
                                            <img :src="slotProps.value.processedImageURL" :alt="slotProps.value.prizeName" class="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <span class="font-semibold text-gray-800">{{ slotProps.value.prizeName }}</span>
                                            <small class="block text-gray-500">{{ slotProps.value.prizeType }} • Available: {{ slotProps.value.availableqty }}</small>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400">Select Prize</span>
                                </template>
                            </Dropdown>
                            <small v-if="errors[`prize_${index}`]" class="text-red-500">{{ errors[`prize_${index}`] }}</small>
                        </div>

                        <!-- Quantity (1/3 with FloatLabel) -->
                        <div class="w-full">
                            <FloatLabel>
                                <InputNumber id="qty" v-model="prize.qty" :min="1" class="w-full" />
                                <label for="qty">Quantity</label>
                            </FloatLabel>
                            <small v-if="errors[`qty_${index}`]" class="text-red-500">{{ errors[`qty_${index}`] }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No prizes added yet.</div>

            <!-- Add Prize Button -->
            <div class="flex justify-start mt-4">
                <Button icon="pi pi-plus" label="Add Prize" style="width: fit-content" class="p-button-success p-button-sm" :disabled="prizes.length >= 10" @click="addPrize" />
            </div>

            <div class="flex justify-end mt-8 gap-2">
                <div class="w-40">
                    <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" @click="submitGame" :loading="loading" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const loading = ref(false);

const game = ref({
    title: '',
    description: '',
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    quota: null,
    // type: 'sPiN',
    point1: null,
    point2: null,
    point3: null,
    tnc: '',
    image1URL: '',
    image2URL: '',
    image3URL: ''
});

const imageFiles = ref({
    image1: null,
    image2: null,
    image3: null
});


const errors = ref({});

// const typeOptions = [
//     { label: 'Spin', value: 'sPiN' },
//     { label: 'Random', value: 'RANdom' }
// ];

// 🎁 Prize List Dropdown Data
const listPrize = ref([]);

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

// Image event handlers
const onImageLoad = (event) => {
    event.target.style.opacity = '1';
};

// When start date changes, reset end date if invalid
const onStartDateSelect = () => {
    if (news.value.endDate && news.value.endDate <= news.value.startDate) {
        news.value.endDate = '';
        toast.add({
            severity: 'warn',
            summary: 'Invalid Date',
            detail: 'End date must be after start date.',
            life: 3000
        });
    }
};

const onImageError = (event) => {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'https://via.placeholder.com/150x100?text=Image+Error';
    event.target.style.opacity = '1';
    event.target.onerror = null; // Prevent infinite loop
};

const fetchCatalog = async () => {
    try {
        const response = await api.get('game/catalogs');

        if (response.data.status === 1) {
            // Transform API data to match frontend expectations
            const transformedItems = (response.data.admin_data || []).map((item) => ({
                id: item.id,
                imageURL: item.imageURL, // ✅ FIXED: Changed from 'image' to 'imageURL'
                prizeName: item.title, // Map 'title' to 'prizeName'
                prizeType: item.type, // Map 'type' to 'prizeType'
                prizeQuota: item.totalqty,
                availableqty: item.availableqty,
                description: item.description,
                valueAmount: item.valueAmount,
                valueType: item.valueType,
                processedImageURL: null // Will be populated by processCatalogueImages
            }));

            // Process private images
            const processedItems = await processCatalogueImages(transformedItems);
            listPrize.value = processedItems;

        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load prize catalog',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching catalog:', error);
        toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load prize catalog',
                life: 3000
            });
    }
};


// Initialize data
onMounted(() => {
    fetchCatalog();
});

const prizes = ref([]);

const addPrize = () => {
    prizes.value.push({
        selected: null,
        qty: 1
    });
};

const removePrize = (index) => {
    prizes.value.splice(index, 1);
};

const onImageSelect = (eventFile, field) => {
    const file = eventFile.files[0];
    if (file) {
        // Store the file for upload
        imageFiles.value[field] = file;

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            game.value[`${field}URL`] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const validateFields = () => {
    errors.value = {};

    // Basic field validation
    if (!game.value.title.trim()) errors.value.title = 'Title is required';
    if (!game.value.description.trim()) errors.value.description = 'Description is required';
    if (!game.value.location.trim()) errors.value.location = 'Location is required';
    if (!game.value.publishDate) errors.value.publishDate = 'Publish date is required';
    if (!game.value.startDate) errors.value.startDate = 'Start date is required';
    if (!game.value.endDate) errors.value.endDate = 'End date is required';
    if (!game.value.quota || game.value.quota <= 0) errors.value.quota = 'Valid quota is required';
    // if (!game.value.type) errors.value.type = 'Game type is required';
    if (!game.value.tnc.trim()) errors.value.tnc = 'Terms & Conditions are required';

    // Points validation
    if (game.value.point1 === null || game.value.point1 < 0) errors.value.point1 = 'Valid silver points are required';
    if (game.value.point2 === null || game.value.point2 < 0) errors.value.point2 = 'Valid gold points are required';
    if (game.value.point3 === null || game.value.point3 < 0) errors.value.point3 = 'Valid platinum points are required';

    // Image validation
    if (!imageFiles.value.image1) errors.value.image1 = 'Image 1 is required';
    if (!imageFiles.value.image2) errors.value.image2 = 'Image 2 is required';
    if (!imageFiles.value.image3) errors.value.image3 = 'Image 3 is required';

    // Prize validation
    prizes.value.forEach((prize, index) => {
        if (!prize.selected) {
            errors.value[`prize_${index}`] = 'Prize selection is required';
        }
        if (!prize.qty || prize.qty <= 0) {
            errors.value[`qty_${index}`] = 'Valid quantity is required';
        } else if (prize.selected && prize.qty > prize.selected.prizeRemain) {
            errors.value[`qty_${index}`] = `Quantity exceeds available stock (${prize.selected.prizeRemain} available)`;
        }
    });

    // Date validation
    if (game.value.startDate && game.value.endDate) {
        const start = new Date(game.value.startDate);
        const end = new Date(game.value.endDate);
        if (end < start) {
            errors.value.endDate = 'End date cannot be before start date';
        }
    }

    if (game.value.publishDate && game.value.startDate) {
        const publish = new Date(game.value.publishDate);
        const start = new Date(game.value.startDate);
        if (start < publish) {
            errors.value.startDate = 'Start date cannot be before publish date';
        }
    }

    return Object.keys(errors.value).length === 0;
};

// submit form
const submitGame = async () => {
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

        // Append basic fields
        formData.append('title', game.value.title);
        formData.append('description', game.value.description);
        formData.append('publishDate', formatDate(game.value.publishDate));
        formData.append('startDate', formatDate(game.value.startDate));
        formData.append('endDate', formatDate(game.value.endDate));
        formData.append('quota', game.value.quota.toString());
        formData.append('location', game.value.location);
        // formData.append('type', game.value.type);
        formData.append('point1', game.value.point1.toString());
        formData.append('point2', game.value.point2.toString());
        formData.append('point3', game.value.point3.toString());
        formData.append('tnc', game.value.tnc);

        // Append image files
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            if (imageFiles.value[fieldName]) {
                formData.append(fieldName, imageFiles.value[fieldName]);
            }
        }

        // Prepare prize selection array
        const prizeSelection = prizes.value.map((prize) => ({
            catalogID: prize.selected.id.toString(),
            quantity: prize.qty.toString()
        }));

        // Append prize selection as JSON string
        formData.append('prize_selection', JSON.stringify(prizeSelection));

        // Use customRequest to send FormData with proper headers
        const response = await api.customRequest({
            method: 'POST',
            url: '/api/game/create',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Game created successfully!',
                life: 3000
            });
            router.push('/marketing/listGame');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ||'Failed to create game',
                life: 3000
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ||'Failed to create game',
                life: 3000
            });
    } finally {
        loading.value = false;
    }
};
</script>
