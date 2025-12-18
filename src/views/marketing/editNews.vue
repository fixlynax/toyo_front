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
                        <label class="block font-bold text-gray-700">Headline (180 max Character)</label>
                        <Textarea v-model="news.headline" rows="3" class="w-full" maxlength="180" />
                        <!-- Character Counter -->
                        <div class="text-xm text-gray-500 mt-1 text-right">{{ news.headline?.length || 0 }}/180</div>
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
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" class="w-full" :minDate="news.startDate" :maxDate="news.endDate" :disabled="!news.startDate || !news.endDate" />
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">
                        News Images
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 2MB)</span>
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(img, index) in [1, 2, 3]" :key="index" class="relative">
                            <FileUpload
                                mode="basic"
                                :name="`image${img}`"
                                accept="image/*"
                                :maxFileSize="2 * 1024 * 1024"
                                customUpload
                                @select="onImageSelect($event, `image${img}`)"
                                @remove="() => removeImage(`image${img}`)"
                                @error="onUploadError"
                                :chooseLabel="`Change Image ${img}`"
                                class="w-full"
                                :invalidFileSizeMessage="`File size exceeds 2MB limit`"
                                :invalidFileTypeMessage="`Invalid image type. Only PNG, JPG, JPEG, HEIF, HEIC are allowed`"
                            />
                            <!-- Image Preview Area -->
                            <div v-if="previewImages[`image${img}URL`]" class="relative mt-2 group">
                                <img :src="previewImages[`image${img}URL`]" alt="Preview" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <!-- Remove Button -->
                                <button @click="removeImage(`image${img}`)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600" title="Remove Image">
                                    <i class="pi pi-times text-sm"></i>
                                </button>
                                <!-- Image Status Indicators -->
                                <div class="text-xs mt-1 text-center">
                                    <span v-if="!imageChanges[`image${img}`] && originalImages[`image${img}URL`]" class="text-blue-600"> Current image </span>
                                    <span v-if="imageChanges[`image${img}`] && imageFiles[`image${img}`]" class="text-green-600"> New image selected </span>
                                    <span v-if="imageChanges[`image${img}`] && removedImages.includes(`image${img}`)" class="text-red-600"> Image will be removed </span>
                                </div>
                                <!-- File Size Display -->
                                <div v-if="imageSizes[`image${img}`]" class="text-xs text-gray-500 text-center">Size: {{ formatFileSize(imageSizes[`image${img}`]) }}</div>
                            </div>
                            <div v-else class="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">No Image</div>
                            <!-- Error Message -->
                            <div v-if="imageErrors[`image${img}`]" class="text-red-500 text-xs mt-1">
                                {{ imageErrors[`image${img}`] }}
                            </div>
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

// Track original images from server
const originalImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});

// Track current images (can be File object, URL string, or 'REMOVED')
const currentImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});

// Track if image has been changed
const imageChanges = ref({
    image1: false,
    image2: false,
    image3: false
});

// Track image files for new uploads
const imageFiles = ref({
    image1: null,
    image2: null,
    image3: null
});

// Track removed images
const removedImages = ref([]);

// Preview URLs for display
const previewImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});

// Track image file sizes
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

const parseDMY = (str) => {
    if (!str) return null;
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// Validate image file
const validateImageFile = (file) => {
    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        return {
            valid: false,
            message: `File size exceeds 2MB limit. Your file is ${formatFileSize(file.size)}`
        };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif', 'image/heic'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
        return {
            valid: false,
            message: 'Invalid image type. Only PNG, JPG, JPEG, HEIF, HEIC are allowed'
        };
    }

    return { valid: true, message: '' };
};

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

            // Load images
            const imageFields = ['image1URL', 'image2URL', 'image3URL'];

            for (const field of imageFields) {
                const url = data[field];

                if (url && url !== 'null') {
                    previewImages.value[field] = url; // direct use
                    originalImages.value[field] = url;
                    currentImages.value[field] = url;
                }
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

const onImageSelect = (event, fieldName) => {
    const file = event.files[0];
    if (!file) {
        imageErrors.value[fieldName] = 'No file selected';
        return;
    }

    // Validate the image
    const validation = validateImageFile(file);
    if (!validation.valid) {
        imageErrors.value[fieldName] = validation.message;
        toast.add({
            severity: 'error',
            summary: 'Invalid Image',
            detail: validation.message,
            life: 3000
        });
        return;
    }

    // Clear any previous errors
    imageErrors.value[fieldName] = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImages.value[`${fieldName}URL`] = e.target.result;
    };
    reader.readAsDataURL(file);

    // Store the file
    imageFiles.value[fieldName] = file;
    imageChanges.value[fieldName] = true;
    imageSizes.value[fieldName] = file.size;

    // Remove from removed images if it was previously marked for removal
    const index = removedImages.value.indexOf(fieldName);
    if (index > -1) {
        removedImages.value.splice(index, 1);
    }

    toast.add({
        severity: 'success',
        summary: 'Image Selected',
        detail: `Image ${fieldName.replace('image', '')} will be updated`,
        life: 2000
    });
};

const removeImage = (fieldName) => {
    previewImages.value[`${fieldName}URL`] = '';
    removedImages.value.push(fieldName);
    imageChanges.value[fieldName] = true;
    imageSizes.value[fieldName] = 0;
    imageErrors.value[fieldName] = '';
    delete imageFiles.value[fieldName];

    toast.add({
        severity: 'info',
        summary: 'Image Removed',
        detail: `Image ${fieldName.replace('image', '')} will be removed`,
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

// Validate form including images
const validateForm = () => {
    // Check required fields
    if (!news.value.title?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Title',
            detail: 'Please enter a title for the news',
            life: 3000
        });
        return false;
    }

    if (!news.value.headline?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Headline',
            detail: 'Please enter a headline for the news',
            life: 3000
        });
        return false;
    }

    if (!news.value.description?.trim()) {
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

    if (news.value.endDate && news.value.startDate && new Date(news.value.endDate) < new Date(news.value.startDate)) {
        toast.add({
            severity: 'error',
            summary: 'Invalid Date Range',
            detail: 'End date cannot be before start date.',
            life: 3000
        });
        return false;
    }

    // Validate any new images that are uploaded
    for (const field of ['image1', 'image2', 'image3']) {
        const file = imageFiles.value[field];

        if (file) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                imageErrors.value[field] = validation.message;
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Image',
                    detail: `${field}: ${validation.message}`,
                    life: 3000
                });
                return false;
            }
        }
    }

    return true;
};

const updateNews = async () => {
    try {
        // Validate form
        if (!validateForm()) {
            return;
        }

        saving.value = true;
        const id = route.params.id;
        const formData = new FormData();

        // Append basic fields
        formData.append('title', news.value.title);
        formData.append('description', news.value.description);
        formData.append('headline', news.value.headline);
        formData.append('audience', news.value.audience);
        formData.append('publishDate', formatDate(news.value.publishDate));
        formData.append('startDate', formatDate(news.value.startDate));
        formData.append('endDate', formatDate(news.value.endDate));
        formData.append('isPublish', news.value.status ?? 0);

        // Handle image fields based on changes
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            const hasChanged = imageChanges.value[fieldName];
            const file = imageFiles.value[fieldName];
            const isRemoved = removedImages.value.includes(fieldName);

            if (hasChanged) {
                if (file) {
                    // New file uploaded
                    formData.append(fieldName, file);
                } else if (isRemoved) {
                    // Image marked for removal - send empty string
                    formData.append(fieldName, '');
                }
            }
            // If not changed, don't send anything (backend will keep existing)
        }

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
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error || 'Failed to update news.',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error updating news:', err);

        // Handle specific error cases
        if (err.response?.status === 413) {
            toast.add({
                severity: 'error',
                summary: 'File Too Large',
                detail: 'Total image size exceeds server limit',
                life: 3000
            });
        } else if (err.response?.status === 422) {
            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please check your form inputs',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error updating news. Please try again.',
                life: 3000
            });
        }
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
