<template>
    <Fluid>
        <div v-if="loading" class="text-center py-20 text-gray-500 text-lg">Loading news data...</div>

        <div v-else-if="error" class="text-center py-20 text-red-500 text-lg">
            {{ error }}
        </div>

        <div v-else class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit News</div>

                <!-- News Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="news.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Headline(180 max Characters)</label>
                        <Textarea v-model="news.headline" rows="3" class="w-full" maxlength="180" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="news.description" rows="3" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Start Date</label>
                        <Calendar v-model="news.startDate" dateFormat="yy-mm-dd" class="w-full" :minDate="minDate" @date-select="validateDates" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">End Date</label>
                        <Calendar v-model="news.endDate" dateFormat="yy-mm-dd" class="w-full" :minDate="minDate" @date-select="validateDates" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Publish Date</label>
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" class="w-full" :minDate="news.startDate"  :maxDate="news.endDate"  :disabled="!news.startDate || !news.endDate"/>
                    </div>

                    <!-- <div>
                        <label class="block font-bold text-gray-700">Audience</label>
                        <Dropdown v-model="news.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div> -->
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">News Images <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 2MB)</span> </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, index) in ['image1URL', 'image2URL', 'image3URL']" :key="index" class="relative">
                            <FileUpload mode="basic" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Change Image ${index + 1}`" class="w-full" />
                            <div v-if="previewImages[field]" class="relative mt-2">
                                <img :src="previewImages[field]" alt="Preview" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage(field)" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                            <div v-else class="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">No Image</div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-4 gap-2">
                    <RouterLink to="/marketing/listNews">
                        <Button label="Cancel" class="p-button-secondary w-40" />
                    </RouterLink>
                    <div class="w-40">
                        <Button label="Update" @click="updateNews" :loading="saving" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const minDate = ref(new Date());

const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const news = ref({
    title: '',
    description: '',
    audience: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    image1URL: null,
    image2URL: null,
    image3URL: null,
    status: 0
});

const originalImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});

const currentImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});

const imageChanges = ref({
    image1URL: false,
    image2URL: false,
    image3URL: false
});

const previewImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});
const parseDMY = (str) => {
    if (!str) return null;
    const [day, month, year] = str.split('-').map(Number); 
    return new Date(year, month - 1, day);
};

const fetchNewsDetails = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`news/details/${id}`);
        if (response.data.status === 1) {
            const data = response.data.admin_data;
            news.value = {
                ...data,
                publishDate: data.publishDate ? parseDMY(data.publishDate) : null,
                startDate: data.startDate ? parseDMY(data.startDate) : null,
                endDate: data.endDate ? parseDMY(data.endDate) : null
            };

            if (data.image1URL) {
                const imageUrl = await fetchPrivateImage(data.image1URL);
                previewImages.value.image1URL = imageUrl;
                originalImages.value.image1URL = data.image1URL;
                currentImages.value.image1URL = data.image1URL;
            }
            if (data.image2URL) {
                const imageUrl = await fetchPrivateImage(data.image2URL);
                previewImages.value.image2URL = imageUrl;
                originalImages.value.image2URL = data.image2URL;
                currentImages.value.image2URL = data.image2URL;
            }
            if (data.image3URL) {
                const imageUrl = await fetchPrivateImage(data.image3URL);
                previewImages.value.image3URL = imageUrl;
                originalImages.value.image3URL = data.image3URL;
                currentImages.value.image3URL = data.image3URL;
            }
        } else {
            error.value = 'News not found.';
        }
    } catch (err) {
        console.error(err);
        error.value = 'Failed to load news details.';
    } finally {
        loading.value = false;
    }
};

const fetchPrivateImage = async (url) => {
    try {
        return await api.getPrivateFile(url);
    } catch (e) {
        console.error('Error loading private image:', e);
        return null;
    }
};

const validateDates = () => {
    const start = new Date(news.value.startDate);
    const end = new Date(news.value.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid Date',
            detail: 'Start date cannot be before today.',
            life: 3000
        });
        news.value.startDate = null;
        return;
    }

    if (end < today) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid Date',
            detail: 'End date cannot be before today.',
            life: 3000
        });
        news.value.endDate = null;
        return;
    }

    if (end && start && end < start) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid Date Range',
            detail: 'End date must be after start date.',
            life: 3000
        });
        news.value.endDate = null;
    }
};

const onImageSelect = (event, property) => {
    const file = event.files[0];
    if (!file) return;
    news.value[property] = file;
    currentImages.value[property] = file; // Store the new file
    imageChanges.value[property] = true; // Mark as changed
    previewImages.value[property] = URL.createObjectURL(file);
};

const removeImage = (property) => {
    news.value[property] = null;
    currentImages.value[property] = 'REMOVED'; 
    imageChanges.value[property] = true; 
    previewImages.value[property] = null;
};

const updateNews = async () => {
    try {
        if (news.value.startDate && news.value.endDate && new Date(news.value.endDate) < new Date(news.value.startDate)) {
            toast.add({
                severity: 'error',
                summary: 'Invalid Date Range',
                detail: 'End date cannot be before start date.',
                life: 3000
            });
            return;
        }

        saving.value = true;
        const id = route.params.id;
        const formData = new FormData();

        formData.append('title', news.value.title);
        formData.append('description', news.value.description);
        formData.append('headline', news.value.headline);
        formData.append('audience', news.value.audience);
        formData.append('publishDate',formatDate(news.value.publishDate));
        formData.append('startDate', formatDate(news.value.startDate));
        formData.append('endDate', formatDate(news.value.endDate));
        formData.append('isPublish', news.value.status ?? 0);
                                                                                                                                                                                                        
        ['image1URL', 'image2URL', 'image3URL'].forEach((field, index) => {
            const imageField = `image${index + 1}`;
            const current = currentImages.value[field];
            const hasChanged = imageChanges.value[field];

            if (hasChanged) {
                if (current instanceof File) {
                    formData.append(imageField, current);
                } else if (current === 'REMOVED') {
                    formData.append(imageField, '');
                }
            }
        });
        
            const response = await api.postExtra(`news/edit/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });
       
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'News updated successfully.',
                life: 3000
            });
            router.push(`/marketing/detailNews/${id}`);
        } else {
            error.value = 'Failed to update news.';
        }
    } catch (err) {
        console.error('Error updating news:', err);
        error.value = 'Error updating news.';
    } finally {
        saving.value = false;
    }
};

// Format date (d-m-Y)
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

onMounted(fetchNewsDetails);
</script>