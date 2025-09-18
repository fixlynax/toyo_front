<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit News</div>

                <!-- news Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Title</label>
                        <InputText v-model="news.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Description</label>
                        <Textarea v-model="news.desc" rows="3" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Location</label>
                        <InputText v-model="news.location" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Publish Date</label>
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Start Date</label>
                        <Calendar v-model="news.startDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">End Date</label>
                        <Calendar v-model="news.endDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Audience</label>
                        <Dropdown v-model="news.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>     
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-medium text-gray-700 mb-2">News Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($news, 'image1URL')" chooseLabel="Change Image 1" class="w-full" />
                            <img v-if="news.image1URL" :src="news.image1URL" alt="Preview 1" class="mt-2 rounded-lg shadow-md object-cover w-full h-48" />
                        </div>
                        <div>
                            <FileUpload mode="basic" name="image2" accept="image/*" customUpload @select="onImageSelect($news, 'image2URL')" chooseLabel="Change Image 2" class="w-full" />
                            <img v-if="news.image2URL" :src="news.image2URL" alt="Preview 2" class="mt-2 rounded-lg shadow-md object-cover w-full h-48" />
                        </div>
                        <div>
                            <FileUpload mode="basic" name="image3" accept="image/*" customUpload @select="onImageSelect($news, 'image3URL')" chooseLabel="Change Image 3" class="w-full" />
                            <img v-if="news.image3URL" :src="news.image3URL" alt="Preview 3" class="mt-2 rounded-lg shadow-md object-cover w-full h-48" />
                        </div>
                    </div>
                </div>

                <!-- Survey Section -->
                <div v-if="news.isSurvey === 1">
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">📝 Survey Questions</div>
                        <Button icon="pi pi-plus" label="Add Question" style="width: fit-content" class="p-button-success p-button-sm" :disabled="questions.length >= 10" @click="addQuestion" />
                    </div>

                    <div v-if="questions.length > 0" class="space-y-4">
                        <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-semibold">Question {{ index + 1 }}</label>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeQuestion(index)" />
                            </div>
                            <InputText v-model="q.text" placeholder="Enter your question" class="w-full mb-2" />
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <InputText v-for="(ans, i) in q.options" :key="i" v-model="q.options[i]" placeholder="Answer" />
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-gray-500 italic">No questions added yet.</div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8">
                    <div class="w-40">
                        <RouterLink to="/marketing/detailNews">
                            <Button label="Update" class="w-full" />
                        </RouterLink>
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

const news = ref({
    id: 1,
    audience: "TC",
    title: "Toyo Tires Launches Proxes Sport 2 in Malaysia",
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg',
    desc: "Toyo Tires introduces its latest high-performance tire, Proxes Sport 2, designed for superior handling and grip on Malaysian roads.",
    location: "Kuala Lumpur, Malaysia",
    publishDate: "2025-01-12",
    startDate: "2025-01-12",
    endDate: "2025-02-12",
    status: 2, // 0=Draft, 1=Published, 2=Unpublished
    created: "2025-01-10",
    deleted: null,
})
const onImageSelect = (newsFile, field) => {
    const file = newsFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            news.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
</script>
