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
                            <Calendar v-model="event.publishDate" dateFormat="dd-mm-yy" showIcon class="w-full"   :maxDate="event.endDate"  :disabled="!event.startDate || !event.endDate"/>
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
                        <label class="block font-bold text-gray-700 mb-2">Upload Event Image <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 2MB)</span> </label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div v-for="n in 3" :key="n">
                                <FileUpload mode="basic" :name="`image${n}`" accept="image/*" customUpload @select="(e) => onImageSelect(e, `image${n}`)" :chooseLabel="`Upload Image ${n}`" class="w-full" />
                                <img v-if="event[`image${n}URL`]" :src="event[`image${n}URL`]" :alt="`Preview ${n}`" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                            </div>
                        </div>
                    </div>

                    <div v-if="event.isSurvey === 'No'" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="submitEvent" />
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

                            <!-- <div class="mt-4">
                                <label class="block font-semibold text-gray-700 mb-2">Correct Answer</label>
                                <Dropdown v-model="q.correctAnswer" :options="correctAnswerOptions" optionLabel="label" optionValue="value" placeholder="Select correct answer" class="w-full" />
                            </div> -->
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
                            <Button label="Submit" class="w-full" @click="submitEvent" />
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
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    image1URL: '',
    image2URL: '',
    image3URL: ''
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
            answers: ['', '', ''],
            // correctAnswer: ''
        });
    }
};
const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

// handle image preview and file storage
const imageFiles = ref({});
const onImageSelect = (eventFile, fieldName) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => (event.value[`${fieldName}URL`] = e.target.result);
        reader.readAsDataURL(file);
        imageFiles.value[fieldName] = file;
    }
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

const validateFields = () => {
    // Basic validation
    if (!event.value.title || !event.value.desc || !event.value.location || !event.value.publishDate || !event.value.startDate || !event.value.endDate || !event.value.audience) {
        toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill all required fields.', life: 3000 });
        return false;
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
            if (!q.question || !q.answers[0] || !q.answers[1] || !q.answers[2] ) {
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
        const formData = new FormData();

        // Append basic fields
        formData.append('title', event.value.title);
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
                answer3: q.answers[2],
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
    }
};
</script>
