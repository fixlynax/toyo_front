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
                            <Button label="Edit" icon="pi pi-pencil" class="p-button-info" size="small" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" size="small" />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img :src="event.image1URL" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-40" />
                        <img :src="event.image2URL" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-40" />
                        <img :src="event.image3URL" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-40" />
                    </div>

                    <!-- Event Info -->
                    <div class="mt-6">
                        <!-- <h2 class="font-semibold text-xl text-gray-800 border-b pb-2">📍 Event Details</h2> -->
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
                        <Tag :value="event.status === 1 ? 'Active' : 'Inactive'" :severity="event.status === 1 ? 'success' : 'danger'" />
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
                                    <td class="px-4 py-2 font-medium">Survey</td>
                                    <td class="px-4 py-2 text-right">{{ event.isSurvey ? 'Yes' : 'No' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point 1 (Silver)</td>
                                    <td class="px-4 py-2 text-right">{{ event.point1 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point 2 (Gold)</td>
                                    <td class="px-4 py-2 text-right">{{ event.point2 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point 3 (Platinum)</td>
                                    <td class="px-4 py-2 text-right">{{ event.point3 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Total Views</td>
                                    <td class="px-4 py-2 text-right">{{ event.view }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Survey Info</div>
                    </div>

                    <div class="overflow-x-auto">
                        <!-- 📍 Questions -->
                        <div class="font-semibold text-xl border-b pb-2 mt-4">📍 Questions</div>
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <template v-if="questions.length > 0">
                                    <tr v-for="(q, index) in questions" :key="index" class="border-b">
                                        <td class="px-4 py-2 font-medium">{{ index + 1 }}</td>
                                        <td class="px-4 py-2 text-left">{{ q }}</td>
                                    </tr>
                                </template>
                                <tr v-else>
                                    <td class="px-4 py-2 text-gray-500 italic" colspan="2">No Questions</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- 📍 Answers -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">📍 Answers</div>
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <template v-if="answers.length > 0">
                                    <tr v-for="(a, index) in answers" :key="index" class="border-b">
                                        <td class="px-4 py-2 font-medium">{{ index + 1 }}</td>
                                        <td class="px-4 py-2 text-left">{{ a }}</td>
                                    </tr>
                                </template>
                                <tr v-else>
                                    <td class="px-4 py-2 text-gray-500 italic" colspan="2">No Answers</td>
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
    audience: 'Public',
    isSurvey: 1,
    point1: 85,
    point2: 90,
    point3: 95,
    title: 'Toyo Tires Drift Challenge 2025',
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg',
    desc: 'Experience the thrill of high-speed drifting powered by Toyo Tires. Join us for a weekend of motorsport excitement!',
    location: 'Sepang International Circuit, Malaysia',
    publishDate: '2025-01-10',
    startDate: '2025-02-15',
    endDate: '2025-02-16',
    view: 542,
    status: 1
});

const questions = ref([
  "How do you rate the durability of the tires?",
  "How do you rate the comfort while driving?",
  "How do you rate the performance in wet conditions?",
  "How do you rate the performance in dry conditions?",
  "How do you rate the value for money?",
  "How satisfied are you overall with Toyo Tires?"
]);

const answers = ref([
  "Low",
  "Average",
  "High"
]);
</script>
