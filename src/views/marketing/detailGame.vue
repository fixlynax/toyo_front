<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Game Details</div>
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
                        <img :src="game.image1URL" alt="Game Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="game.image2URL" alt="Game Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="game.image3URL" alt="Game Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <!-- Event Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ game.title }}</h1>
                        <p class="text-lg font-medium">{{ game.desc }}</p>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">Location</span>
                                <p class="text-lg font-medium">{{ game.location }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">Start Date</span>
                                <p class="text-lg font-medium">{{ game.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-sm text-gray-500">End Date</span>
                                <p class="text-lg font-medium">{{ game.endDate }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Survey Info (only if enabled) -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">📋 Prize Info</div>
                    </div>

                    <DataTable :value="listPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- User Column -->
                        <Column field="prizeName" header="Prize Name" style="min-width: 8rem"></Column>

                        <!-- Prize Type -->
                        <Column field="prizeType" header="Prize Type" style="min-width: 8rem"></Column>

                        <!-- Prize -->
                        <Column field="prizeValue" header="Prize Value" style="min-width: 8rem"></Column>

                        <Column field="prizeQuota" header="Prize Quota" style="min-width: 8rem"></Column>

                        <Column field="prizeRemain" header="Prize Remain" style="min-width: 8rem"></Column>
                    </DataTable>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="game.status === 1 ? 'Active' : 'Inactive'" :severity="game.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Game No</td>
                                    <td class="px-4 py-2 text-right">{{ game.gameNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ game.publishDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quota</td>
                                    <td class="px-4 py-2 text-right">{{ game.quota }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Played</td>
                                    <td class="px-4 py-2 text-right">{{ game.played }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">QR Game</td>
                                    <td class="px-4 py-2 text-right">
                                        <div class="flex justify-end">
                                            <div class="flex flex-col items-center">
                                                <img :src="`/demo/images/qr-toyo.png`" alt="QR Game Image" class="rounded-xl shadow-sm object-cover w-30 h-20 mb-2" />
                                                <button class="bg-red-600 text-white px-3 py-1 rounded" @click="downloadQRCode">Download</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">👨🏻‍💻 Participant List</div>
                    <DataTable :value="participants" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- User Column -->
                        <Column header="User" style="min-width: 6rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.fullName }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.memberLevel }}</span>
                                    <span class="text-gray-600 text-xs mt-2">📅 {{ data.date }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Prize Type -->
                        <Column field="prizeType" header="Type" style="min-width: 8rem"></Column>

                        <!-- Prize -->
                        <Column field="prize" header="Prize" style="min-width: 8rem"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const game = ref({
    id: 1,
    gameNo: 'GTY2025001',
    type: 'SPIN',
    title: 'Toyo Tires Knowledge Challenge',
    desc: 'Test your knowledge about Toyo Tires’ history, technology, and innovations. Win exclusive merchandise!',
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg',
    termCondition: 'Open to all participants in Malaysia. Each user can only attempt once.',
    location: 'Online',
    publishDate: '2025-01-10',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    quota: 1000,
    played: 32,
    point1: 80,
    point2: 85,
    point3: 90,
    point4: 95,
    status: 1,
    created: '2025-01-05',
    deleted: null
});

const listPrize = ref([
    {
        id: 1,
        prizeName: 'Amazon $20 Gift Card',
        prizeType: 'Point',
        prizeValue: 100,
        prizeQuota: 50,
        prizeRemain: 20
    },
    {
        id: 2,
        prizeName: 'MYR 50 E-Wallet',
        prizeType: 'E-Wallet',
        prizeValue: 'MYR 50',
        prizeQuota: 100,
        prizeRemain: 40
    },
    {
        id: 3,
        prizeName: 'Amazon $50 E-Voucher',
        prizeType: 'E-Voucher',
        prizeValue: 'Amazon $50',
        prizeQuota: 30,
        prizeRemain: 10
    },
    {
        id: 4,
        prizeName: 'Smartwatch',
        prizeType: 'Item',
        prizeValue: 'Smartwatch',
        prizeQuota: 15,
        prizeRemain: 5
    },
    {
        id: 5,
        prizeName: 'Amazon $10 Gift Card',
        prizeType: 'Point',
        prizeValue: 75,
        prizeQuota: 40,
        prizeRemain: 25
    },
    {
        id: 6,
        prizeName: 'MYR 100 E-Wallet',
        prizeType: 'E-Wallet',
        prizeValue: 'MYR 100',
        prizeQuota: 80,
        prizeRemain: 30
    },
    {
        id: 7,
        prizeName: 'Amazon $25 E-Voucher',
        prizeType: 'E-Voucher',
        prizeValue: 'Amazon $25',
        prizeQuota: 25,
        prizeRemain: 8
    }
]);

const participants = ref([
    {
        id: 1,
        fullName: 'Ahmad Faiz',
        memberLevel: 'Gold',
        date: '2025-09-01',
        point: 90,
        prizeType: 'Point',
        prize: 100 // Example prize for 'Point'
    },
    {
        id: 2,
        fullName: 'Nur Aisyah',
        memberLevel: 'Silver',
        date: '2025-09-02',
        point: 85,
        prizeType: 'E-Wallet',
        prize: 'MYR 50' // Example prize for 'E-Wallet'
    },
    {
        id: 3,
        fullName: 'Hafiz Din',
        memberLevel: 'Platinum',
        date: '2025-09-02',
        point: 95,
        prizeType: 'E-Voucher',
        prize: 'Amazon $20' // Example prize for 'E-Voucher'
    },
    {
        id: 4,
        fullName: 'Lim Wei Jian',
        memberLevel: 'Gold',
        date: '2025-09-03',
        point: 90,
        prizeType: 'Item',
        prize: 'Smartwatch' // Example prize for 'Item'
    },
    {
        id: 5,
        fullName: 'Siti Mariam',
        memberLevel: 'Silver',
        date: '2025-09-03',
        point: 85,
        prizeType: 'Point',
        prize: 50
    },
    {
        id: 6,
        fullName: 'Arjun Kumar',
        memberLevel: 'Gold',
        date: '2025-09-04',
        point: 90,
        prizeType: 'E-Wallet',
        prize: 'MYR 100'
    },
    {
        id: 7,
        fullName: 'Tan Li Ying',
        memberLevel: 'Platinum',
        date: '2025-09-04',
        point: 95,
        prizeType: 'E-Voucher',
        prize: 'Amazon $50'
    },
    {
        id: 8,
        fullName: 'Mohd Amir',
        memberLevel: 'Silver',
        date: '2025-09-05',
        point: 85,
        prizeType: 'Item',
        prize: 'Bluetooth Headphones'
    },
    {
        id: 9,
        fullName: 'Farah Nadiah',
        memberLevel: 'Gold',
        date: '2025-09-05',
        point: 90,
        prizeType: 'Point',
        prize: 75
    },
    {
        id: 10,
        fullName: 'Jason Lee',
        memberLevel: 'Platinum',
        date: '2025-09-06',
        point: 95,
        prizeType: 'E-Wallet',
        prize: 'MYR 200'
    },
    {
        id: 11,
        fullName: 'Hazrul Izhar',
        memberLevel: 'Classic',
        date: '2025-09-06',
        point: 95,
        prizeType: 'Item',
        prize: 'Smartphone'
    }
]);
</script>
