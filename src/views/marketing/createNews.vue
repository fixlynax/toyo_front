<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create News</div>

                <!-- news Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="news.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="news.desc" rows="3" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Start Date</label>
                        <Calendar v-model="news.startDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">End Date</label>
                        <Calendar v-model="news.endDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Publish Date</label>
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Audience</label>
                        <Dropdown v-model="news.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload news Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Upload Image 1" class="w-full" />
                            <img v-if="news.image1URL" :src="news.image1URL" alt="Preview 1" class="mt-2 rounded-lg shadow-md object-cover w-full h-100" />
                        </div>
                        <div>
                            <FileUpload mode="basic" accept="image/*" customUpload @select="onImageSelect($event, 'image2URL')" chooseLabel="Upload Image 2" class="w-full" />
                            <img v-if="news.image2URL" :src="news.image2URL" alt="Preview 2" class="mt-2 rounded-lg shadow-md object-cover w-full h-100" />
                        </div>
                        <div>
                            <FileUpload mode="basic" accept="image/*" customUpload @select="onImageSelect($event, 'image3URL')" chooseLabel="Upload Image 3" class="w-full" />
                            <img v-if="news.image3URL" :src="news.image3URL" alt="Preview 3" class="mt-2 rounded-lg shadow-md object-cover w-full h-100" />
                        </div>
                    </div>
                </div>

                <!-- Submit -->

                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-40">
                        <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                    </div>
                    <div class="w-40">
                        <RouterLink to="/marketing/listnews">
                            <Button label="Save as Draft" class="w-full p-button-outlined p-button-info" @click="saveDraft" />
                        </RouterLink>
                    </div>
                    <div class="w-40">
                        <RouterLink to="/marketing/detailnews">
                            <Button label="Save & Publish" class="w-full" />
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
    { label: 'Yes', value: true },
    { label: 'No', value: false }
];

const news = ref({
    id: 1,
    audience: 'ALL', // match option values
    title: '',
    image1URL: '',
    image2URL: '',
    image3URL: '',
    desc: '',
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    isSurvey: false,
    point1: null,
    point2: null,
    point3: null
});

const onImageSelect = (event, field) => {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            news.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
</script>
