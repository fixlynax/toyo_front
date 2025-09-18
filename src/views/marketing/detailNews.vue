<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Content -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Event Details</div>
                        <div class="inline-flex items-center gap-2">
                            <Button 
                                label="Edit" 
                                icon="pi pi-pencil" 
                                class="p-button-info" 
                                size="small" 
                            />
                            <Button 
                                label="Delete" 
                                icon="pi pi-trash" 
                                class="p-button-danger" 
                                size="small" 
                            />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img 
                            :src="event.image1URL" 
                            alt="Event Image 1" 
                            class="rounded-xl shadow-sm object-cover w-full h-40" 
                        />
                        <img 
                            :src="event.image2URL" 
                            alt="Event Image 2" 
                            class="rounded-xl shadow-sm object-cover w-full h-40" 
                        />
                        <img 
                            :src="event.image3URL" 
                            alt="Event Image 3" 
                            class="rounded-xl shadow-sm object-cover w-full h-40" 
                        />
                    </div>

                    <!-- Event Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ event.title }}</h1>
                        <p class="text-lg font-medium">{{ event.desc }}</p>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">Location</span>
                                <p class="text-lg font-medium">{{ event.location }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">Start Date</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">End Date</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
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
                        <Tag 
                            :value="event.status === 1 ? 'Active' : 'Inactive'" 
                            :severity="event.status === 1 ? 'success' : 'danger'" 
                        />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ event.publishDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ event.audience }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ event.created }}</td>
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

const event = ref({
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
    status: 1,
    created: "2025-01-10",
    deleted: null,
});
</script>
