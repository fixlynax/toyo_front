<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
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
                                <span class="block text-xm font-bold text-black-700">Location</span>
                                <p class="text-lg font-medium">{{ event.location }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Start Date</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">End Date</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Survey Info (only if enabled) -->
                <div class="card flex flex-col w-full" v-if="event.isSurvey === 1">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">📋 Survey Info</div>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Loop through each question -->
                        <div v-for="(q, qIndex) in questions" :key="qIndex" class="border-b pb-4">
                            <!-- Question Title and "Statistic" on the same line -->
                            <div class="flex justify-between items-center mb-2">
                                <div class="font-bold text-lg">Q{{ qIndex + 1 }}. {{ q.text }}</div>
                                <div class="font-bold text-lg text-gray-700">Respondent</div>
                            </div>

                            <!-- Answers & Statistics -->
                            <div class="space-y-1">
                                <div v-for="(ans, aIndex) in q.options" :key="aIndex" class="flex justify-between px-2">
                                    <!-- Left Side: Answer -->
                                    <ul class="list-disc list-inside mt-1 text-gray-600">
                                        <li>{{ ans }}</li>
                                    </ul>

                                    <!-- Right Side: Statistic -->
                                    <span class="">{{ q.statistics[aIndex] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
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
                                    <td class="px-4 py-2 font-medium">Total Participants</td>
                                    <td class="px-4 py-2 text-right">{{ event.view }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Participant List (only if survey enabled) -->
                <div class="card flex flex-col w-full" v-if="event.isSurvey === 1">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">👨🏻‍💻 Participant List</div>
                    <DataTable :value="participants" :paginator="true" :rows="10" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <Column header="User" style="min-width: 1rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.fullName }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.memberLevel }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column field="date" header="Date Taken" style="min-width: 6rem"></Column>
                        <Column field="point" header="Point Earned" style="min-width: 6rem; text-align: center"></Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- <div class="flex flex-col md:flex-row gap-8 mt-8">
            <div class="w-full" v-if="event.isSurvey === 1">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">📊 Survey Statistic</div>
                    </div>

                    <div class="grid grid-cols-12">
                        <div class="col-span-12 xl:col-span-12">
                            <SurveyStatistic />
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
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
    {
        text: 'How do you rate the durability of the tires?',
        options: ['Low', 'Average', 'High'],
        statistics: [10, 20, 2]
    },
    {
        text: 'How do you rate the comfort while driving?',
        options: ['Low', 'Average', 'High'],
        statistics: [5, 15, 8]
    },
    {
        text: 'How do you rate the performance in wet conditions?',
        options: ['Low', 'Average', 'High'],
        statistics: [7, 12, 6]
    },
    {
        text: 'How do you rate the performance in dry conditions?',
        options: ['Low', 'Average', 'High'],
        statistics: [3, 17, 9]
    },
    {
        text: 'How do you rate the value for money?',
        options: ['Low', 'Average', 'High'],
        statistics: [4, 14, 11]
    },
    {
        text: 'How satisfied are you overall with Toyo Tires?',
        options: ['Low', 'Average', 'High'],
        statistics: [2, 18, 9]
    }
]);

const participants = ref([
    {
        id: 1,
        fullName: 'Ahmad Faiz',
        memberLevel: 'Gold',
        date: '2025-09-01',
        point: 90
    },
    {
        id: 2,
        fullName: 'Nur Aisyah',
        memberLevel: 'Silver',
        date: '2025-09-02',
        point: 85
    },
    {
        id: 3,
        fullName: 'Hafiz Din',
        memberLevel: 'Platinum',
        date: '2025-09-02',
        point: 95
    },
    {
        id: 4,
        fullName: 'Lim Wei Jian',
        memberLevel: 'Gold',
        date: '2025-09-03',
        point: 90
    },
    {
        id: 5,
        fullName: 'Siti Mariam',
        memberLevel: 'Silver',
        date: '2025-09-03',
        point: 85
    },
    {
        id: 6,
        fullName: 'Arjun Kumar',
        memberLevel: 'Gold',
        date: '2025-09-04',
        point: 90
    },
    {
        id: 7,
        fullName: 'Tan Li Ying',
        memberLevel: 'Platinum',
        date: '2025-09-04',
        point: 95
    },
    {
        id: 8,
        fullName: 'Mohd Amir',
        memberLevel: 'Silver',
        date: '2025-09-05',
        point: 85
    },
    {
        id: 9,
        fullName: 'Farah Nadiah',
        memberLevel: 'Gold',
        date: '2025-09-05',
        point: 90
    },
    {
        id: 10,
        fullName: 'Jason Lee',
        memberLevel: 'Platinum',
        date: '2025-09-06',
        point: 95
    },
    {
        id: 11,
        fullName: 'Hazrul Izhar',
        memberLevel: 'Classic',
        date: '2025-09-06',
        point: 95
    }
]);
</script>
