<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex flex-col w-full">
                <!-- Create Event Card -->
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Event</div>

                    <!-- Event Form -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700">Title</label>
                            <InputText v-model="event.title" class="w-full" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700">Headline (180 max Character)</label>
                            <Textarea v-model="event.headline" rows="3" class="w-full" maxlength="180" />
                            <!-- Character Counter -->
                            <div class="text-xm text-gray-500 mt-1 text-right">{{ event.headline?.length || 0 }}/180</div>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700">Description</label>
                            <Textarea v-model="event.desc" rows="3" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Location</label>
                            <InputText v-model="event.location" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="event.startDate" :minDate="today" dateFormat="dd-mm-yy" showIcon class="w-full" @date-select="onStartDateSelect" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="event.endDate" :minDate="minEndDate" dateFormat="dd-mm-yy" showIcon class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="event.publishDate" dateFormat="dd-mm-yy" showIcon class="w-full" :maxDate="event.endDate" :disabled="!event.startDate || !event.endDate" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Survey</label>
                            <Dropdown v-model="event.isSurvey" :options="surveyOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <!-- Upload Images -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">
                            Upload Event Image
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 2MB)</span>
                        </label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div v-for="n in 3" :key="n">
                                <FileUpload
                                    mode="basic"
                                    :name="`image${n}`"
                                    accept="image/*"
                                    :maxFileSize="2 * 1024 * 1024"
                                    customUpload
                                    @select="(e) => onImageSelect(e, `image${n}`)"
                                    @remove="() => onImageRemove(`image${n}`)"
                                    @error="onUploadError"
                                    :chooseLabel="`Upload Image ${n}`"
                                    class="w-full"
                                    :invalidFileSizeMessage="`File size exceeds 2MB limit`"
                                    :invalidFileTypeMessage="`Invalid image type. Only PNG, JPG, JPEG, HEIF, HEIC are allowed`"
                                />
                                <!-- Image Preview with Remove Button -->
                                <div v-if="event[`image${n}URL`]" class="mt-2 relative group">
                                    <img :src="event[`image${n}URL`]" :alt="`Preview ${n}`" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                                    <!-- Remove Button -->
                                    <button
                                        @click="onImageRemove(`image${n}`)"
                                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                        title="Remove image"
                                    >
                                        <i class="pi pi-times text-sm"></i>
                                    </button>
                                    <!-- File Size Info -->
                                    <div v-if="imageSizes[`image${n}`]" class="text-xs text-gray-500 mt-1 text-center">Size: {{ formatFileSize(imageSizes[`image${n}`]) }}</div>
                                </div>
                                <!-- Image Error Message -->
                                <div v-if="imageErrors[`image${n}`]" class="text-red-500 text-xs mt-1">
                                    {{ imageErrors[`image${n}`] }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="event.isSurvey === 'No'" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="submitEvent" :loading="loading" />
                        </div>
                    </div>
                </div>

                <!-- Survey Questions -->
                <div v-if="event.isSurvey === 'Yes'" class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">📝 Survey Configuration</div>
                    <div class="mt-8 text-xl font-bold text-gray-800 border-b pb-2">🏆 Point Setting</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Silver</label>
                            <InputNumber v-model="event.point1" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Gold</label>
                            <InputNumber v-model="event.point2" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Platinum</label>
                            <InputNumber v-model="event.point3" showIcon class="w-full" />
                        </div>
                    </div>
                    <div v-if="questions.length > 0" class="space-y-4">
                        <div class="mt-8 text-xl font-bold text-gray-800 border-b pb-2 mb-8">Answer Options</div>

                        <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-semibold text-gray-800">Question {{ index + 1 }}</label>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeQuestion(index)" />
                            </div>

                            <InputText v-model="q.question" placeholder="Enter your question" class="w-full mb-4" />

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatLabel v-for="(ans, i) in q.answers" :key="i" variant="on" class="w-full">
                                    <InputText :id="`answer-${index}-${i}`" v-model="q.answers[i]" class="w-full" />
                                    <label :for="`answer-${index}-${i}`">Answer {{ i + 1 }}</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-gray-500 italic">No questions added yet.</div>

                    <div class="flex justify-start">
                        <Button icon="pi pi-plus" label="Add Question" class="p-button-success p-button-sm p-button-raised" :disabled="questions.length >= 20" @click="addQuestion" />
                    </div>

                    <div class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="submitEvent" :loading="loading" />
                        </div>
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

const toast = useToast();
const router = useRouter();
const loading = ref(false);

// dropdown options
const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const surveyOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
];

const correctAnswerOptions = [
    { label: 'Answer 1', value: '1' },
    { label: 'Answer 2', value: '2' },
    { label: 'Answer 3', value: '3' }
];

// event object
const event = ref({
    audience: 'ALL',
    isSurvey: 'No',
    point1: '0',
    point2: '0',
    point3: '0',
    title: '',
    desc: '',
    headline: '',
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    image1URL: '',
    image2URL: '',
    image3URL: ''
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

const today = new Date();
const minEndDate = ref(today);

const onStartDateSelect = (date) => {
    minEndDate.value = date;
    if (event.value.endDate && new Date(event.value.endDate) < new Date(date)) {
        event.value.endDate = '';
    }
};

// survey questions
const questions = ref([]);
const addQuestion = () => {
    if (questions.value.length < 20) {
        questions.value.push({
            question: '',
            answers: ['', '', '']
            // correctAnswer: ''
        });
    }
};
const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

// Image handling functions
const imageFiles = ref({});

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

// Handle image selection
const onImageSelect = (eventFile, fieldName) => {
    const file = eventFile.files[0];
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

    // Store the file
    imageFiles.value[fieldName] = file;
    imageSizes.value[fieldName] = file.size;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        event.value[`${fieldName}URL`] = e.target.result;
    };
    reader.onerror = () => {
        imageErrors.value[fieldName] = 'Failed to read image file';
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
        detail: `Image ${fieldName.replace('image', '')} uploaded successfully`,
        life: 2000
    });
};

// Handle image removal
const onImageRemove = (fieldName) => {
    // Clear the file
    imageFiles.value[fieldName] = null;
    event.value[`${fieldName}URL`] = '';
    imageSizes.value[fieldName] = 0;
    imageErrors.value[fieldName] = '';

    toast.add({
        severity: 'info',
        summary: 'Image Removed',
        detail: `Image ${fieldName.replace('image', '')} has been removed`,
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

// Format date from Date object to dd-mm-yyyy string
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Validate form fields including images
const validateFields = () => {
    // Basic validation
    if (!event.value.title || !event.value.desc || !event.value.location || !event.value.publishDate || !event.value.startDate || !event.value.endDate || !event.value.audience) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill all required fields.', life: 3000 });
        return false;
    }

    // Headline validation (max 180 characters)
    if (!event.value.headline || event.value.headline.trim().length === 0) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please enter a headline.', life: 3000 });
        return false;
    }

    if (event.value.headline.length > 180) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Headline must be 180 characters or less.', life: 3000 });
        return false;
    }

    // Date validation
    if (new Date(event.value.endDate) <= new Date(event.value.startDate)) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'End date must be after start date.', life: 3000 });
        return false;
    }

    // Validate images that are uploaded
    for (let i = 1; i <= 3; i++) {
        const field = `image${i}`;
        const file = imageFiles.value[field];

        if (file) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                imageErrors.value[field] = validation.message;
                toast.add({
                    severity: 'error',
                    summary: 'Invalid Image',
                    detail: `Image ${i}: ${validation.message}`,
                    life: 3000
                });
                return false;
            }
        }
    }

    // Survey-specific validation
    if (event.value.isSurvey === 'Yes') {
        if (!event.value.point1 || !event.value.point2 || !event.value.point3) {
            toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill all point fields.', life: 3000 });
            return false;
        }
        if (questions.value.length === 0) {
            toast.add({ severity: 'warn', summary: 'Validation', detail: 'Add at least one survey question.', life: 3000 });
            return false;
        }
        for (let q of questions.value) {
            if (!q.question || !q.answers[0] || !q.answers[1] || !q.answers[2]) {
                toast.add({
                    severity: 'warn',
                    summary: 'Validation',
                    detail: 'All questions and answers are required.',
                    life: 3000
                });
                return false;
            }
        }
    }

    return true;
};

// submit form
const submitEvent = async () => {
    if (!validateFields()) return;

    try {
        loading.value = true;

        const formData = new FormData();

        // Append basic fields
        formData.append('title', event.value.title);
        formData.append('headline', event.value.headline);
        formData.append('description', event.value.desc);
        formData.append('publishDate', formatDate(event.value.publishDate));
        formData.append('startDate', formatDate(event.value.startDate));
        formData.append('endDate', formatDate(event.value.endDate));
        formData.append('audience', event.value.audience);
        formData.append('location', event.value.location);
        formData.append('isSurvey', event.value.isSurvey);

        // Append points only if survey is yes
        if (event.value.isSurvey === 'Yes') {
            formData.append('point1', event.value.point1.toString());
            formData.append('point2', event.value.point2.toString());
            formData.append('point3', event.value.point3.toString());

            // Append survey questions
            const surveyQuestions = questions.value.map((q) => ({
                question: q.question,
                answer1: q.answers[0],
                answer2: q.answers[1],
                answer3: q.answers[2]
                // correctAnswer: q.correctAnswer
            }));
            formData.append('survey_questions', JSON.stringify(surveyQuestions));
        } else {
            // For non-survey events, still send empty points or default values
            formData.append('point1', '0');
            formData.append('point2', '0');
            formData.append('point3', '0');
            formData.append('survey_questions', JSON.stringify([]));
        }

        // Append image files
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            if (imageFiles.value[fieldName]) {
                formData.append(fieldName, imageFiles.value[fieldName]);
            }
        }

        // Use customRequest to send FormData with proper headers
        const response = await api.customRequest({
            method: 'POST',
            url: '/api/event/create',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Event created successfully!',
                life: 3000
            });
            router.push('/marketing/listEvent');
        } else {
            console.error('Backend error:', response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ? Object.values(response.data.messages).flat().join(', ') : 'Failed to create event',
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
        loading.value = false;
    }
};
</script>
