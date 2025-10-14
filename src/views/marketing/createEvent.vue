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
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="event.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="event.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="event.endDate" dateFormat="yy-mm-dd" class="w-full" />
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
                        <label class="block font-bold text-gray-700 mb-2">Upload Event Image</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Upload Image 1" class="w-full" />
                                <img v-if="event.image1URL" :src="event.image1URL" alt="Preview 1" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                            </div>
                            <div>
                                <FileUpload mode="basic" name="image2" accept="image/*" customUpload @select="onImageSelect($event, 'image2URL')" chooseLabel="Upload Image 2" class="w-full" />
                                <img v-if="event.image2URL" :src="event.image2URL" alt="Preview 2" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                            </div>
                            <div>
                                <FileUpload mode="basic" name="image3" accept="image/*" customUpload @select="onImageSelect($event, 'image3URL')" chooseLabel="Upload Image 3" class="w-full" />
                                <img v-if="event.image3URL" :src="event.image3URL" alt="Preview 3" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                            </div>
                        </div>
                    </div>

                    <div v-if="event.isSurvey === 0" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <RouterLink to="/marketing/detailEvent">
                                <Button label="Submit" class="w-full" />
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Point Configuration Card -->
                <div v-if="event.isSurvey === 1" class="card flex flex-col gap-6 w-full">
                    <div class="text-xl font-bold text-gray-800 border-b pb-2">🏆 Point Configuration</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Silver</label>
                            <InputNumber v-model="event.point2" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Gold</label>
                            <InputNumber v-model="event.point3" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Platinum</label>
                            <InputNumber v-model="event.point4" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Survey Questions Card -->
                <div v-if="event.isSurvey === 1" class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="text-xl font-bold text-gray-800 border-b pb-2">📝 Survey Questions</div>

                    <!-- Questions List -->
                    <div v-if="questions.length > 0" class="space-y-4">
                        <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <!-- Question Header -->
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-semibold text-gray-800">Question {{ index + 1 }}</label>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeQuestion(index)" />
                            </div>

                            <!-- Question Input -->
                            <InputText v-model="q.text" placeholder="Enter your question" class="w-full mb-4" />

                            <!-- Answer Inputs -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatLabel v-for="(ans, i) in q.options" :key="i" variant="on" class="w-full">
                                    <InputText :id="`answer-${index}-${i}`" v-model="q.options[i]" class="w-full" />
                                    <label :for="`answer-${index}-${i}`">Answer {{ i + 1 }}</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                    <!-- No Questions Placeholder -->
                    <div v-else class="text-gray-500 italic">No questions added yet.</div>

                    <!-- Add Question Button -->
                    <div class="flex justify-start">
                        <Button icon="pi pi-plus" label="Add Question" style="width: fit-content" class="p-button-success p-button-sm" :disabled="questions.length >= 10" @click="addQuestion" />
                    </div>

                    <!-- Submit Buttons -->
                    <div class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <RouterLink to="/marketing/detailEvent">
                                <Button label="Submit" class="w-full" />
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const surveyOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

const event = ref({
    audience: 'ALL',
    isSurvey: 0,
    point1: '',
    point2: '',
    point3: '',
    point4: '',
    title: '',
    image1URL: '',
    image2URL: '',
    image3URL: '',
    desc: '',
    location: '',
    publishDate: '',
    startDate: '',
    endDate: ''
});

const questions = ref([]);

const addQuestion = () => {
    if (questions.value.length < 10) {
        questions.value.push({
            text: '',
            options: ['Low', 'Average', 'High']
        });
    }
};

const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

const onImageSelect = (eventFile, field) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            event.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
</script>
