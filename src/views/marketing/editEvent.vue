<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex flex-col w-full">
                <!-- Edit Event Card -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                      <div class="flex items-center gap-3">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Event</div>
                      </div>
                    </div>

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
                            <Calendar v-model="event.startDate" dateFormat="dd-mm-yy" showIcon class="w-full" :minDate="minDate" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="event.endDate" dateFormat="dd-mm-yy" showIcon class="w-full" :minDate="minDate" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="event.publishDate" dateFormat="dd-mm-yy" showIcon class="w-full" :minDate="event.startDate" :maxDate="event.endDate" :disabled="!event.startDate || !event.endDate" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Audience</label>
                            <Dropdown v-model="event.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Survey</label>
                            <Dropdown v-model="event.isSurvey" :options="surveyOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <!-- Upload Images -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">
                            Event Images
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 1MB)</span>
                        </label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div v-for="(img, index) in [1, 2, 3]" :key="index" class="relative">
                                <FileUpload
                                    mode="basic"
                                    :name="`image${img}`"
                                    accept="image/*"
                                    customUpload
                                    @select="onImageSelect($event, `image${img}`)"
                                    @remove="() => removeImage(`image${img}`)"
                                    @error="onUploadError"
                                    :chooseLabel="`Change Image ${img}`"
                                    class="w-full"
                                    :invalidFileTypeMessage="`Invalid image type. Only PNG, JPG, JPEG, HEIF, HEIC are allowed`"
                                />
                                <!-- Image Preview Area -->
                                <div v-if="event[`image${img}URL`]" class="relative mt-2 group">
                                    <img :src="event[`image${img}URL`]" :alt="`Preview ${img}`" class="rounded-lg shadow-md object-cover w-full h-80" />
                                    <!-- Remove Button -->
                                    <button
                                        @click="removeImage(`image${img}`)"
                                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                        title="Remove Image"
                                    >
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

                    <!-- Actions for non-survey events -->
                    <div v-if="event.isSurvey === 'No'" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="submitEvent" :loading="loading" />
                        </div>
                    </div>
                </div>

                <!-- Survey Configuration -->
                <div v-if="event.isSurvey === 'Yes'" class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Survey Configuration</div>

                    <!-- Point Setting -->
                    <div class="mt-4">
                        <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Point Setting</div>
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
                                <InputNumber v-model="event.point3" class="w-full" />
                            </div>
                        </div>
                    </div>

                    <!-- Survey Questions -->
                    <div class="mt-8">
                        <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Survey Questions</div>

                        <div v-if="questions.length > 0" class="space-y-4">
                            <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                                <div class="flex items-center justify-between mb-2">
                                    <label class="font-semibold text-gray-800"> Question {{ index + 1 }} </label>
                                    <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeQuestion(index)" />
                                </div>

                                <!-- Question Input -->
                                <InputText v-model="q.question" placeholder="Enter your question" class="w-full mb-4" />

                                <!-- Answer Inputs -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FloatLabel v-for="(ans, i) in q.answers" :key="i" variant="on" class="w-full">
                                        <InputText :id="`answer-${index}-${i}`" v-model="q.answers[i]" class="w-full" />
                                        <label :for="`answer-${index}-${i}`">Answer {{ i + 1 }}</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-gray-500 italic">No questions added yet.</div>

                        <!-- Add Question -->
                        <div class="flex justify-start mt-4">
                            <Button icon="pi pi-plus" label="Add Question" class="p-button-success p-button-sm" :disabled="questions.length >= 20" @click="addQuestion" />
                        </div>
                    </div>

                    <!-- Actions -->
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const minDate = ref(new Date());

// Get event ID from route
const eventId = route.params.id;

// Dropdown options
const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const surveyOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
];

// Event data
const event = ref({
    id: null,
    audience: 'ALL',
    isSurvey: 'No',
    point1: 0,
    point2: 0,
    point3: 0,
    title: '',
    headline: '',
    desc: '',
    location: '',
    publishDate: null,
    startDate: null,
    endDate: null,
    image1URL: '',
    image2URL: '',
    image3URL: '',
    isPublish: 1
});

const questions = ref([]);
const imageFiles = ref({});
const removedImages = ref([]);

// Track original images
const originalImages = ref({
    image1URL: null,
    image2URL: null,
    image3URL: null
});

// Track image changes
const imageChanges = ref({
    image1: false,
    image2: false,
    image3: false
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

// Format Date object to dd-mm-yyyy string
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};



// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Fetch event details
const fetchEventDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`event/details/${eventId}`);

        if (response.data.status === 1) {
            const eventData = response.data.admin_data;

            // Update event data
            event.value = {
                id: eventData.id,
                audience: eventData.audience,
                isSurvey: eventData.isSurvey,
                point1: eventData.point1 || 0,
                point2: eventData.point2 || 0,
                point3: eventData.point3 || 0,
                title: eventData.title,
                headline: eventData.headline || '',
                desc: eventData.desc,
                location: eventData.location,
                publishDate: parseDate(eventData.publishDate),
                startDate: parseDate(eventData.startDate),
                endDate: parseDate(eventData.endDate),
                image1URL: eventData.image1URL,
                image2URL: eventData.image2URL,
                image3URL: eventData.image3URL,
                isPublish: eventData.status || 1
            };

            // Store original images
            originalImages.value = {
                image1URL: eventData.image1URL,
                image2URL: eventData.image2URL,
                image3URL: eventData.image3URL
            };

            // Handle survey questions
            if (eventData.survey_questions && eventData.survey_questions.length) {
                const rawQuestions = eventData.survey_questions[0];
                questions.value = rawQuestions.map((q) => ({
                    question: q.question || '',
                    answers: [q.answer1 || '', q.answer2 || '', q.answer3 || '']
                }));
            }

        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load event details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching event details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load event details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};


// Parse date string to Date object
const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return null;
};

// Question management
const addQuestion = () => {
    if (questions.value.length < 20) {
        questions.value.push({
            question: '',
            answers: ['', '', '']
        });
    }
};

const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

// Image handling
const onImageSelect = (eventFile, fieldName) => {
    const file = eventFile.files[0];
    if (!file) {

        imageErrors.value[fieldName] = 'No file selected';
        return;
    }

    if (file.size > 1024 * 1024) {
        toast.add({ severity: 'warn', summary: 'File too large', detail: 'Maximum file size allowed is 1MB', life: 3000 });
        return;
    }

    // Clear any previous errors
    imageErrors.value[fieldName] = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        event.value[`${fieldName}URL`] = e.target.result;
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
    event.value[`${fieldName}URL`] = '';
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
    // Basic validation
    const requiredFields = [
        { field: event.value.title, message: 'Title is required' },
        { field: event.value.headline, message: 'Headline is required' },
        { field: event.value.desc, message: 'Description is required' },
        { field: event.value.location, message: 'Location is required' },
        { field: event.value.startDate, message: 'Start Date is required' },
        { field: event.value.endDate, message: 'End Date is required' },
        { field: event.value.audience, message: 'Audience is required' }
    ];

    for (const { field, message } of requiredFields) {
        if (!field || (typeof field === 'string' && field.trim() === '')) {
            toast.add({ severity: 'warn', summary: 'Validation', detail: message, life: 3000 });
            return false;
        }
    }

    // Headline length validation
    if (event.value.headline && event.value.headline.length > 180) {
        toast.add({
            severity: 'warn',
            summary: 'Validation',
            detail: 'Headline must be 180 characters or less',
            life: 3000
        });
        return false;
    }

    // Date validation
    if (event.value.startDate && event.value.endDate) {
        const start = new Date(event.value.startDate);
        const end = new Date(event.value.endDate);

        if (end < start) {
            toast.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'End Date cannot be before Start Date',
                life: 3000
            });
            return false;
        }

        if (event.value.publishDate) {
            const publish = new Date(event.value.publishDate);
            if (publish < start || publish > end) {
                toast.add({
                    severity: 'warn',
                    summary: 'Validation',
                    detail: 'Publish Date must be between Start Date and End Date',
                    life: 3000
                });
                return false;
            }
        }
    }

    // Validate any new images that are uploaded
    for (const field of ['image1', 'image2', 'image3']) {
        const file = imageFiles.value[field];

        if (file) {
            if (file.size > 1024 * 1024) {
        toast.add({ severity: 'warn', summary: 'File too large', detail: 'Maximum file size allowed is 1MB', life: 3000 });
        return;
    }
        }
    }

    // Survey-specific validation
    if (event.value.isSurvey === 'Yes') {
        if (event.value.point1 === null || event.value.point1 === undefined || event.value.point2 === null || event.value.point2 === undefined || event.value.point3 === null || event.value.point3 === undefined) {
            toast.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Please fill all point fields.',
                life: 3000
            });
            return false;
        }

        if (questions.value.length === 0) {
            toast.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Add at least one survey question.',
                life: 3000
            });
            return false;
        }

        for (let q of questions.value) {
            if (!q.question || q.question.trim() === '' || !q.answers[0] || q.answers[0].trim() === '' || !q.answers[1] || q.answers[1].trim() === '' || !q.answers[2] || q.answers[2].trim() === '') {
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

// Submit event
const submitEvent = async () => {
    if (!validateForm()) return;

    try {
        loading.value = true;

        const formData = new FormData();

        // Append basic fields
        formData.append('title', event.value.title);
        formData.append('headline', event.value.headline);
        formData.append('description', event.value.desc);
        formData.append('location', event.value.location);
        formData.append('audience', event.value.audience);
        formData.append('isSurvey', event.value.isSurvey);
        formData.append('isPublish', event.value.isPublish.toString());

        // Append dates in dd-mm-yyyy format
        if (event.value.publishDate) {
            formData.append('publishDate', formatDate(event.value.publishDate));
        } else {
            formData.append('publishDate', '');
        }
        formData.append('startDate', formatDate(event.value.startDate));
        formData.append('endDate', formatDate(event.value.endDate));

        // Append points
        if (event.value.isSurvey === 'Yes') {
            formData.append('point1', event.value.point1?.toString() || '0');
            formData.append('point2', event.value.point2?.toString() || '0');
            formData.append('point3', event.value.point3?.toString() || '0');

            // Append survey questions
            const surveyQuestions = questions.value.map((q) => ({
                question: q.question || '',
                answer1: q.answers[0] || '',
                answer2: q.answers[1] || '',
                answer3: q.answers[2] || ''
            }));
            formData.append('survey_questions', JSON.stringify(surveyQuestions));
        } else {
            formData.append('point1', '0');
            formData.append('point2', '0');
            formData.append('point3', '0');
            formData.append('survey_questions', JSON.stringify([]));
        }

        // Append image files
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            const urlFieldName = `${fieldName}URL`;

            if (imageFiles.value[fieldName]) {
                // New file uploaded
                formData.append(fieldName, imageFiles.value[fieldName]);
            } else if (removedImages.value.includes(fieldName)) {
                // Image was removed - send empty string
                formData.append(fieldName, '');
            }
            // If none of the above, don't send anything (backend will keep existing)
        }

        const response = await api.customRequest({
            method: 'POST',
            url: `/api/event/edit/${eventId}`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Event updated successfully!',
                life: 3000
            });
            router.push(`/marketing/detailEvent/${eventId}`);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ||'Failed to update event',
                life: 3000
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ||'Failed to update event',
                life: 3000
            });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchEventDetails();
});
</script>
