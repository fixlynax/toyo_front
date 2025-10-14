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
                        <label class="block font-bold text-gray-700 mb-2">Event Images</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div v-for="(img, index) in [1, 2, 3]" :key="index" class="relative">
                                <FileUpload mode="basic" :name="`image${img}`" accept="image/*" customUpload @select="onImageSelect($event, `image${img}URL`)" :chooseLabel="`Change Image ${img}`" class="w-full" />
                                <div v-if="event[`image${img}URL`]" class="relative mt-2">
                                    <img :src="event[`image${img}URL`]" :alt="`Preview ${img}`" class="rounded-lg shadow-md object-cover w-full h-80" />
                                    <button @click="removeImage(`image${img}URL`)" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Point Configuration Card -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="text-xl font-bold text-gray-800 border-b pb-2">🏅 Point Configuration</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Silver Point</label>
                            <InputNumber v-model="event.point2" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Gold Point</label>
                            <InputNumber v-model="event.point3" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Platinum Point</label>
                            <InputNumber v-model="event.point4" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Survey Questions Card -->
                <div v-if="event.isSurvey === 1" class="card flex flex-col gap-6 w-full">
                    <div class="text-xl font-bold text-gray-800 border-b pb-2">📝 Survey Questions</div>

                    <div v-if="questions.length > 0" class="space-y-4">
                        <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-semibold text-gray-800">Question {{ index + 1 }}</label>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeQuestion(index)" />
                            </div>

                            <!-- Question Text -->
                            <InputText v-model="q.text" placeholder="Enter your question" class="w-full mb-4" />

                            <!-- Answer Inputs with Labels -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatLabel v-for="(ans, i) in q.options" :key="i" variant="on" class="w-full">
                                    <InputText :id="`answer-${index}-${i}`" v-model="q.options[i]" class="w-full" />
                                    <label :for="`answer-${index}-${i}`">Answer {{ i + 1 }}</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-gray-500 italic">No questions added yet.</div>

                    <!-- Add Question Button -->
                    <div class="flex justify-start mt-4">
                        <Button icon="pi pi-plus" label="Add Question" style="width: fit-content" class="p-button-success p-button-sm" :disabled="questions.length >= 10" @click="addQuestion" />
                    </div>

                    <!-- Submit Buttons -->
                    <div class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <RouterLink to="/marketing/detailEvent">
                                <Button label="Update" class="w-full" />
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
    id: 1,
    audience: 'TC',
    isSurvey: 1,
    point2: 90,
    point3: 95,
    point4: 100,
    title: 'Toyo Tires Drift Challenge 2025',
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg',
    desc: 'Experience the thrill of high-speed drifting powered by Toyo Tires.',
    location: 'Sepang International Circuit, Malaysia',
    publishDate: '2025-01-10',
    startDate: '2025-02-15',
    endDate: '2025-02-16'
});

const questions = ref([
    { text: 'How do you rate the durability of the tires?', options: ['Low', 'Average', 'High'] },
    { text: 'How do you rate the comfort while driving?', options: ['Low', 'Average', 'High'] }
]);

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

const removeImage = (property) => {
    event.value[property] = null;
};
</script>
