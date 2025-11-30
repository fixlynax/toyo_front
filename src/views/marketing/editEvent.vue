<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex flex-col w-full">
                <!-- Edit Event Card -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Event</div>

                    <!-- Event Form -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700">Title</label>
                            <InputText v-model="event.title" class="w-full" />
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
                            <Calendar v-model="event.endDate" dateFormat="dd-mm-yy" showIcon class="w-full":minDate="minDate" />
                        </div>
                        
                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="event.publishDate" dateFormat="dd-mm-yy" showIcon class="w-full" :minDate="event.startDate"  :maxDate="event.endDate"  :disabled="!event.startDate || !event.endDate"/>
                        </div>

                        <!-- <div>
                            <label class="block font-bold text-gray-700">Audience</label>
                            <Dropdown v-model="event.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div> -->

                        <div>
                            <label class="block font-bold text-gray-700">Survey</label>
                            <Dropdown v-model="event.isSurvey" :options="surveyOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <!-- Upload Images -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Event Images</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div v-for="(img, index) in [1, 2, 3]" :key="index" class="relative">
                                <FileUpload mode="basic" :name="`image${img}`" accept="image/*" customUpload @select="onImageSelect($event, `image${img}`)" :chooseLabel="`Change Image ${img}`" class="w-full" />
                                <div v-if="event[`image${img}URL`]" class="relative mt-2">
                                    <img :src="event[`image${img}URL`]" :alt="`Preview ${img}`" class="rounded-lg shadow-md object-cover w-full h-80" />
                                    <button @click="removeImage(`image${img}`)" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions for non-survey events -->
                    <div v-if="event.isSurvey === 'no'" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="submitEvent" :loading="loading" />
                        </div>
                    </div>
                </div>

                <!-- Survey Configuration -->
                <div v-if="event.isSurvey === 'yes'" class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">📝 Survey Configuration</div>

                    <!-- Point Setting -->
                    <div class="mt-4">
                        <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏆 Point Setting</div>
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
                        <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">📝 Survey Questions</div>

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

                                <!-- Correct Answer -->
                                <div class="mt-4">
                                    <label class="block font-semibold text-gray-700 mb-2">Correct Answer</label>
                                    <Dropdown v-model="q.correctAnswer" :options="getCorrectAnswerOptions(q.answers)" optionLabel="label" optionValue="value" placeholder="Select correct answer" class="w-full" />
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-gray-500 italic">No questions added yet.</div>

                        <!-- Add Question -->
                        <div class="flex justify-start mt-4">
                            <Button icon="pi pi-plus" label="Add Question" class="p-button-success p-button-sm" :disabled="questions.length >= 10" @click="addQuestion" />
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const minDate = ref(new Date());

const eventId = route.params.id;

// Dropdown options
const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const surveyOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
];

// Event data
const event = ref({
    id: null,
    audience: 'ALL',
    isSurvey: 'no',
    point1: 0,
    point2: 0,
    point3: 0,
    title: '',
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

// Format date string to Date object for calendar
const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return null;
};

// Format Date object to dd-mm-yyyy string
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};
const parseDMY = (str) => {
    if (!str) return null;
    const [day, month, year] = str.split('-').map(Number); 
    return new Date(year, month - 1, day);
};
// Fetch event details
const fetchEventDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`event/details/${eventId}`);

        if (response.data.status === 1) {
            const eventData = response.data.admin_data;

            // Update event data with proper date formatting
            event.value = {
                id: eventData.id,
                audience: eventData.audience,
                isSurvey: eventData.isSurvey === 1 ? 'yes' : 'no',
                point1: eventData.point1 || 0,
                point2: eventData.point2 || 0,
                point3: eventData.point3 || 0,
                title: eventData.title,
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

            // Handle survey questions
            if (eventData.survey_questions && eventData.survey_questions.length > 0) {
                questions.value = eventData.survey_questions.map(q => ({
                    question: q.question,
                    answers: [q.answer1, q.answer2, q.answer3],
                    correctAnswer: q.correctAnswer
                }));
            }

            // Process private images
            await processPrivateImages();
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

// Process private images using the API method
const processPrivateImages = async () => {
    const imageFields = ['image1URL', 'image2URL', 'image3URL'];

    for (const field of imageFields) {
        if (event.value[field] && typeof event.value[field] === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(event.value[field]);
                if (blobUrl) {
                    event.value[field] = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading image ${field}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

// Question management
const addQuestion = () => {
    if (questions.value.length < 10) {
        questions.value.push({
            question: '',
            answers: ['', '', ''],
            correctAnswer: ''
        });
    }
};

const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

const getCorrectAnswerOptions = (answers) => {
    return answers.map((ans, idx) => ({
        label: ans || `Answer ${idx + 1}`,
        value: (idx + 1).toString()
    }));
};

// Image handling
const onImageSelect = (eventFile, fieldName) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            event.value[`${fieldName}URL`] = e.target.result;
        };
        reader.readAsDataURL(file);
        imageFiles.value[fieldName] = file;
        
        // Remove from removed images if it was previously marked for removal
        const index = removedImages.value.indexOf(fieldName);
        if (index > -1) {
            removedImages.value.splice(index, 1);
        }
    }
};

const removeImage = (fieldName) => {
    event.value[`${fieldName}URL`] = '';
    removedImages.value.push(fieldName);
    delete imageFiles.value[fieldName];
};

// Validation
const validateFields = () => {
    // Basic validation
    if (!event.value.title || !event.value.desc || !event.value.location || !event.value.startDate || !event.value.endDate || !event.value.audience) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill all required fields.', life: 3000 });
        return false;
    }

    // Survey-specific validation
    if (event.value.isSurvey === 'yes') {
        if (!event.value.point1 || !event.value.point2 || !event.value.point3) {
            toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill all point fields.', life: 3000 });
            return false;
        }
        if (questions.value.length === 0) {
            toast.add({ severity: 'warn', summary: 'Validation', detail: 'Add at least one survey question.', life: 3000 });
            return false;
        }
        for (let q of questions.value) {
            if (!q.question || !q.answers[0] || !q.answers[1] || !q.answers[2] || !q.correctAnswer) {
                toast.add({
                    severity: 'warn',
                    summary: 'Validation',
                    detail: 'All questions, answers, and correct answers are required.',
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
    if (!validateFields()) return;

    try {
        loading.value = true;

        const formData = new FormData();

        // Append basic fields using FormData.append()
        formData.append('title', event.value.title);
        formData.append('description', event.value.desc);
        formData.append('location', event.value.location);
        formData.append('audience', event.value.audience);
        formData.append('isSurvey', event.value.isSurvey);
        formData.append('isPublish', event.value.isPublish.toString());

        // Append dates in dd-mm-yyyy format
        if (event.value.publishDate) {
            formData.append('publishDate', formatDate(event.value.publishDate));
        }
        formData.append('startDate', formatDate(event.value.startDate));
        formData.append('endDate', formatDate(event.value.endDate));

        // Append points
        if (event.value.isSurvey === 'yes') {
            formData.append('point1', event.value.point1.toString());
            formData.append('point2', event.value.point2.toString());
            formData.append('point3', event.value.point3.toString());

            // Append survey questions
            const surveyQuestions = questions.value.map((q) => ({
                question: q.question,
                answer1: q.answers[0],
                answer2: q.answers[1],
                answer3: q.answers[2],
                correctAnswer: q.correctAnswer
            }));
            formData.append('survey_questions', JSON.stringify(surveyQuestions));
        } else {
            // For non-survey events
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
            } else if (removedImages.value.includes(fieldName)) {
                // Send empty string to indicate image removal
                formData.append(fieldName, '');
            }
        }
       
     // Use customRequest to send FormData with proper headers
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
            router.push('/marketing/listEvent');
        } else {
            console.error('Backend error:', response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.messages ? Object.values(response.data.messages).flat().join(', ') : 'Failed to update event',
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

onMounted(() => {
    fetchEventDetails();
});
</script>