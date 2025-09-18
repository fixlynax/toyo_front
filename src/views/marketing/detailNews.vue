<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Content -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Details News</div>

                        <!-- Buttons -->
                        <div class="inline-flex items-center gap-2">
                            <!-- Draft (status 0) -->
                            <Button v-if="news.status === 0" label="Save" class="p-button-success" size="small" />

                            <!-- Published (status 1) -->
                            <template v-else-if="news.status === 1 || news.status === 2">
                                <RouterLink to="/marketing/editNews">
                                    <Button label="Edit" class="p-button-info" size="small" />
                                </RouterLink>
                                <Button label="Delete" class="p-button-danger" size="small" />
                            </template>
                        </div>
                    </div>

                    <!-- news Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img :src="news.image1URL" alt="News Image 1" class="rounded-xl shadow-sm object-cover w-full h-40" />
                        <img :src="news.image2URL" alt="News Image 2" class="rounded-xl shadow-sm object-cover w-full h-40" />
                        <img :src="news.image3URL" alt="News Image 3" class="rounded-xl shadow-sm object-cover w-full h-40" />
                    </div>

                    <!-- news Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ news.title }}</h1>
                        <p class="text-lg font-medium">{{ news.desc }}</p>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">Location</span>
                                <p class="text-lg font-medium">{{ news.location }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">Start Date</span>
                                <p class="text-lg font-medium">{{ news.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">End Date</span>
                                <p class="text-lg font-medium">{{ news.endDate }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Quick Info -->
                <div class="card flex flex-col w-full">
                    <!-- Header with Status on Right -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="statusLabel(news.status)" :severity="statusSeverity(news.status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ news.publishDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ news.audience }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ news.created }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

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

// helper functions for tag
const statusLabel = (status) => {
    if (status === 0) return 'Draft';
    if (status === 1) return 'Published';
    if (status === 2) return 'Unpublished';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 0) return 'info';
    if (status === 1) return 'success';
    if (status === 2) return 'warn';
    return 'secondary';
};
</script>
