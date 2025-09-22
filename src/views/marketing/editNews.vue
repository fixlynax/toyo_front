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
                        <label class="block font-medium text-gray-700">Publish Date</label>
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" class="w-full" />
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
                        <!-- Image 1 -->
                        <div class="relative">
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Change Image 1" class="w-full" />
                            <div v-if="news.image1URL" class="relative mt-2">
                                <img :src="news.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <!-- Remove button -->
                                <button @click="removeImage('image1URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                        <!-- Image 2 -->
                        <div class="relative">
                            <FileUpload mode="basic" name="image2" accept="image/*" customUpload @select="onImageSelect($event, 'image2URL')" chooseLabel="Change Image 2" class="w-full" />
                            <div v-if="news.image2URL" class="relative mt-2">
                                <img :src="news.image2URL" alt="Preview 2" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage('image2URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                        <!-- Image 3 -->
                        <div class="relative">
                            <FileUpload mode="basic" name="image3" accept="image/*" customUpload @select="onImageSelect($event, 'image3URL')" chooseLabel="Change Image 3" class="w-full" />
                            <div v-if="news.image3URL" class="relative mt-2">
                                <img :src="news.image3URL" alt="Preview 3" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage('image3URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-2">
                    <div class="w-40">
                        <RouterLink to="/marketing/detailNews">
                            <Button v-if="news.status === 0" label="Save" class="w-full" />
                            <Button v-else-if="news.status === 1 || news.status === 2" label="Update" class="w-full" />
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

const news = ref({
    id: 1,
    audience: 'TC',
    title: 'Toyo Tires Launches Proxes Sport 2 in Malaysia',
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg',
    desc: 'Toyo Tires introduces its latest high-performance tire, Proxes Sport 2, designed for superior handling and grip on Malaysian roads.',
    location: 'Kuala Lumpur, Malaysia',
    publishDate: '2025-01-12',
    startDate: '2025-01-12',
    endDate: '2025-02-12',
    status: 2, // 0=Draft, 1=Published, 2=Unpublished
    created: '2025-01-10',
    deleted: null
});
// Existing methods...
const onImageSelect = (event, property) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        news.value[property] = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = (property) => {
    news.value[property] = null; // or '' if preferred
};
</script>
