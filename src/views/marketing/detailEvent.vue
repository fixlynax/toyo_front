<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Event Details Card -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Event Details</div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink to="/marketing/editEvent">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button label="Delete" class="p-button-danger" size="small" />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img :src="event.image1URL" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="event.image2URL" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="event.image3URL" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
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

            <!-- Right Sidebar - Advance Info -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <!-- Header with Status -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="event.status === 1 ? 'Active' : 'Inactive'" :severity="event.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <!-- Event Additional Info -->
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
                                <tr v-if="event.isSurvey === 1" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Classic</td>
                                    <td class="px-4 py-2 text-right">{{ event.point1 }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 1" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Silver</td>
                                    <td class="px-4 py-2 text-right">{{ event.point2 }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 1" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Gold</td>
                                    <td class="px-4 py-2 text-right">{{ event.point3 }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 1" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Platinum</td>
                                    <td class="px-4 py-2 text-right">{{ event.point4 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Total Views</td>
                                    <td class="px-4 py-2 text-right">{{ event.view }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex flex-col md:flex-row gap-8 mt-8">
            <!-- Left Content - Survey Questions -->
            <div class="md:w-2/3" v-if="event.isSurvey === 1">
                <div class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Survey Info</div>
                        <Button icon="pi pi-plus" class="p-button-success" size="small" />
                    </div>

                    <div class="overflow-x-auto">
                        <!-- Survey Questions -->
                        <table class="w-full text-m text-left text-gray-800">
                            <tbody>
                                <template v-if="questions.length > 0">
                                    <tr v-for="(q, index) in questions" :key="index" class="border-b">
                                        <td class="px-4 py-2 font-medium align-top w-10">{{ index + 1 }}</td>
                                        <td class="px-4 py-2 text-left">
                                            <div class="flex items-start justify-between">
                                                <!-- Question text + answers -->
                                                <div>
                                                    <div class="font-bold">{{ q.text }}</div>
                                                    <ul class="list-disc list-inside mt-1 text-gray-600">
                                                        <li v-for="(ans, i) in q.options" :key="i">{{ ans }}</li>
                                                    </ul>
                                                </div>
                                                <!-- Delete Button -->
                                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" />
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                <tr v-else>
                                    <td class="px-4 py-2 text-gray-500 italic" colspan="2">No Questions</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <!-- Statistics for each question graph -->
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const event = ref({
    id: 1,
    audience: 'TC',
    isSurvey: 1, // change to 0 to test "no survey"
    point1: 85,
    point2: 90,
    point3: 95,
    point4: 100,
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
    { text: 'How do you rate the durability of the tires?', options: ['Low', 'Average', 'High'] },
    { text: 'How do you rate the comfort while driving?', options: ['Low', 'Average', 'High'] },
    { text: 'How do you rate the performance in wet conditions?', options: ['Low', 'Average', 'High'] },
    { text: 'How do you rate the performance in dry conditions?', options: ['Low', 'Average', 'High'] },
    { text: 'How do you rate the value for money?', options: ['Low', 'Average', 'High'] },
    { text: 'How satisfied are you overall with Toyo Tires?', options: ['Low', 'Average', 'High'] }
]);

const participants = ref([
    {
        name: 'Participant 1',
        answers: ['High', 'Average', 'High', 'High', 'Average', 'High']
    },
    {
        name: 'Participant 2',
        answers: ['Low', 'Low', 'Average', 'High', 'Low', 'Average']
    },
    {
        name: 'Participant 3',
        answers: ['High', 'High', 'High', 'High', 'High', 'High']
    }
    // Add more participants as needed
]);

const getStatistics = () => {
    const stats = questions.value.map((question, qIndex) => {
        const counts = question.options.reduce((acc, option) => {
            acc[option] = 0;
            return acc;
        }, {});

        // Count answers
        participants.value.forEach((participant) => {
            const answer = participant.answers[qIndex];
            if (counts.hasOwnProperty(answer)) {
                counts[answer]++;
            }
        });
        return {
            question: question.text,
            counts
        };
    });
    return stats;
};

const statistics = ref(getStatistics());
</script>
