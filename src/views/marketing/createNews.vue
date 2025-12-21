<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="flex items-center gap-3">
                    <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create News</div>
                    </div>
                </div>

                <!-- News Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="news.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Headline (180 max Character)</label>
                        <Textarea v-model="news.headline" rows="3" class="w-full" maxlength="180" />
                        <!-- Character Counter -->
                        <div class="text-xm text-gray-500 mt-1 text-right">{{ news.headline?.length || 0 }}/180</div>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="news.desc" rows="3" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Start Date</label>
                        <Calendar v-model="news.startDate" dateFormat="yy-mm-dd" showIcon class="w-full" :minDate="today" @date-select="onStartDateSelect" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">End Date</label>
                        <Calendar v-model="news.endDate" dateFormat="yy-mm-dd" showIcon class="w-full" :minDate="minEndDate" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Publish Date</label>
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" showIcon class="w-full" :minDate="news.startDate" :maxDate="news.endDate" :disabled="!news.startDate || !news.endDate" />
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">
                        Upload News Images
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 1MB)</span>
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="n in 3" :key="n">
                            <FileUpload
                                mode="basic"
                                accept="image/*"
                                customUpload
                                :chooseLabel="`Upload Image ${n}`"
                                class="w-full"
                                @select="(e) => onImageSelect(e, `image${n}`)"
                                @remove="() => onImageRemove(`image${n}`)"
                                @error="onUploadError"
                                :invalidFileTypeMessage="`Invalid image type. Only PNG, JPG, JPEG, HEIF, HEIC are allowed`"
                            />
                            <!-- Image Preview with Remove Button -->
                            <div v-if="preview[`image${n}`]" class="mt-2 relative group">
                                <img :src="preview[`image${n}`]" :alt="`Preview ${n}`" class="rounded-lg shadow-md object-cover w-full h-40" />
                                <!-- Remove Button -->
                                <button
                                    @click="onImageRemove(`image${n}`)"
                                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                    title="Remove image"
                                >
                                    <i class="pi pi-times text-sm"></i>
                                </button>
                                <!-- File Size Info -->
                                <div class="text-xs text-gray-500 mt-1 text-center">Size: {{ imageSizes[`image${n}`] ? formatFileSize(imageSizes[`image${n}`]) : '' }}</div>
                            </div>
                            <!-- Image Error Message -->
                            <div v-if="imageErrors[`image${n}`]" class="text-red-500 text-xs mt-1">
                                {{ imageErrors[`image${n}`] }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-40">
                        <Button label="Cancel" class="p-button-secondary w-full" @click="$router.back()" />
                    </div>
                    <div class="w-40">
                        <Button label="Save as Draft" class="w-full p-button-outlined p-button-info" @click="handleSave(0)" :loading="loading" />
                    </div>
                    <div class="w-40">
                        <Button label="Save & Publish" class="w-full p-button-success" @click="handleSave(1)" :loading="loading" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

// Reactive data
const today = new Date();
const loading = ref(false);
const news = ref({
    title: '',
    desc: '',
    headline: '',
    startDate: '',
    endDate: '',
    publishDate: '',
    audience: 'ALL',
    image1: null,
    image2: null,
    image3: null,
    isPublish: 0
});

// Preview images
const preview = ref({
    image1: '',
    image2: '',
    image3: ''
});

// Track image sizes
const imageSizes = ref({
    image1: 0,
    image2: 0,
    image3: 0
});

// Track image errors
const imageErrors = ref({
    image1: '',
    image2: '',
    image3: ''
});

// Computed: End date must be after start date
const minEndDate = computed(() => {
    return news.value.startDate ? new Date(news.value.startDate) : today;
});

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



// Handle file selection and preview
const onImageSelect = (event, field) => {
    const file = event.files[0];

    if (!file) {
        imageErrors.value[field] = 'No file selected';
        return;
    }
      if (file.size > 1024 * 1024) {
        toast.add({ severity: 'warn', summary: 'File too large', detail: 'Maximum file size allowed is 1MB', life: 3000 });
        return;
    }

    // Clear any previous errors
    imageErrors.value[field] = '';

    // Store the file
    news.value[field] = file;
    imageSizes.value[field] = file.size;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.value[field] = e.target.result;
    };
    reader.onerror = () => {
        imageErrors.value[field] = 'Failed to read image file';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to read image file',
            life: 3000
        });
    };
    reader.readAsDataURL(file);

    toast.add({
        severity: 'success',
        summary: 'Image Selected',
        detail: `Image ${field.replace('image', '')} uploaded successfully`,
        life: 2000
    });
};

// Handle image removal
const onImageRemove = (field) => {
    // Clear the file
    news.value[field] = null;
    preview.value[field] = '';
    imageSizes.value[field] = 0;
    imageErrors.value[field] = '';

    toast.add({
        severity: 'info',
        summary: 'Image Removed',
        detail: `Image ${field.replace('image', '')} has been removed`,
        life: 2000
    });
};

// Handle upload errors
const onUploadError = (error) => {
    console.error('Upload error:', error);
    toast.add({
        severity: 'error',
        summary: 'Upload Error',
        detail: 'Failed to upload image. Please try again.',
        life: 3000
    });
};

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate the form before submission
const validateForm = () => {
    // Check required fields
    if (!news.value.title.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Title',
            detail: 'Please enter a title for the news',
            life: 3000
        });
        return false;
    }

    if (!news.value.headline.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Headline',
            detail: 'Please enter a headline for the news',
            life: 3000
        });
        return false;
    }

    if (!news.value.desc.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Description',
            detail: 'Please enter a description for the news',
            life: 3000
        });
        return false;
    }

    if (!news.value.startDate) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Start Date',
            detail: 'Please select a start date',
            life: 3000
        });
        return false;
    }

    if (!news.value.endDate) {
        toast.add({
            severity: 'warn',
            summary: 'Missing End Date',
            detail: 'Please select an end date',
            life: 3000
        });
        return false;
    }

    if (news.value.endDate <= news.value.startDate) {
        toast.add({
            severity: 'error',
            summary: 'Invalid Date Range',
            detail: 'End date must be after start date',
            life: 3000
        });
        return false;
    }

    // Check if any image has validation errors
    for (const field in imageErrors.value) {
        if (imageErrors.value[field]) {
            toast.add({
                severity: 'error',
                summary: 'Image Error',
                detail: `Please fix the issue with ${field}`,
                life: 3000
            });
            return false;
        }
    }

    // Validate images that are uploaded
    for (let i = 1; i <= 3; i++) {
        const field = `image${i}`;
        const file = news.value[field];

        if (file) {
            if (file.size > 1024 * 1024) {
                toast.add({ severity: 'warn', summary: 'File too large', detail: 'Maximum file size allowed is 1MB', life: 3000 });
                return;
            }
        }
    }

    return true;
};

// Handle save (draft or publish)
const handleSave = async (isPublish) => {
    // Validate the form
    if (!validateForm()) {
        return;
    }

    // Additional validation for publish
    if (isPublish === 1 && !news.value.publishDate) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Publish Date',
            detail: 'Please select a publish date when publishing',
            life: 3000
        });
        return;
    }

    try {
        loading.value = true;

        const formData = new FormData();
        formData.append('title', news.value.title);
        formData.append('description', news.value.desc);
        formData.append('headline', news.value.headline);
        formData.append('audience', news.value.audience);
        formData.append('startDate', formatDate(news.value.startDate));
        formData.append('endDate', formatDate(news.value.endDate));
        formData.append('isPublish', isPublish);

        if (isPublish === 1 && news.value.publishDate) {
            formData.append('publishDate', formatDate(news.value.publishDate));
        }

        // Append images if they exist
        if (news.value.image1) formData.append('image1', news.value.image1);
        if (news.value.image2) formData.append('image2', news.value.image2);
        if (news.value.image3) formData.append('image3', news.value.image3);

        const response = await api.customRequest({
            method: 'post',
            url: '/api/news/create',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: isPublish ? 'News Published Successfully' : 'Saved as Draft',
                life: 3000
            });
            router.push('/marketing/listnews');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error?.message || 'Failed to save news',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Save error:', error);

        // Handle specific error cases
        toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error?.message || 'Failed to save news',
                life: 3000
            });
    } finally {
        loading.value = false;
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
</script>
