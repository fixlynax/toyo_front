<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Campaign Details</div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink to="/marketing/editCampaign">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button label="Delete" class="p-button-danger" size="small" />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img :src="campaign.image1Path" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="campaign.image2Path" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="campaign.image3Path" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <!-- Event Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ campaign.title }}</h1>
                        <p class="text-lg font-medium">{{ campaign.description }}</p>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Term Condition</span>
                                <p class="text-lg font-medium">{{ campaign.termCondition }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Start Date</span>
                                <p class="text-lg font-medium">{{ campaign.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">End Date</span>
                                <p class="text-lg font-medium">{{ campaign.endDate }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full relative">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🎁 Prize Info</div>
                    </div>

                    <DataTable :value="listPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- Prize Column -->
                        <Column header="Prize" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-3 relative group" @mouseenter="hoverPrize = data.id" @mouseleave="hoverPrize = null">
                                    <img :src="data.imageURL" alt="Prize" class="w-36 h-24 rounded-lg object-cover border" />
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-800">{{ data.prizeName }}</span>
                                        <span class="text-gray-600 text-xs">{{ data.prizeType }}</span>
                                    </div>

                                    <!-- Tooltip for Point Type -->
                                    <div v-if="data.prizeType === 'Point' && hoverPrize === data.id" class="absolute top-0 left-20 bg-white border rounded-lg shadow-lg p-3 text-xm w-60 z-10">
                                        <div class="font-semibold text-xl text-gray-700 mb-2">🏅 Point Reward</div>
                                        <ul class="list-disc list-inside text-gray-700 space-y-1 ml-5">
                                            <li><b>Silver :</b> 80 pts</li>
                                            <li><b>Gold :</b> 90 pts</li>
                                            <li><b>Platinum :</b> 100 pts</li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <!-- Win / Qty Column -->
                        <Column header="Win / Qty" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div>{{ data.prizeRemain }} / {{ data.prizeQuota }}</div>
                            </template>
                        </Column>

                        <!-- Action Column -->
                        <Column header="Action" style="min-width: 6rem">
                            <template #body="{ data }">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info" @click="openEditDialog(data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="campaign.status === 1 ? 'Active' : 'Inactive'" :severity="campaign.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Campaign No</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ campaign.campaignNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Gamification</td>
                                    <td class="px-4 py-2 text-right font-bold" :class="campaign.isGamification ? 'text-green-500' : 'text-red-500'">
                                        {{ campaign.isGamification ? 'ON' : 'OFF' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Max Per User</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.maxPerUser }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Silver</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.point1 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Gold</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.point2 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Platinum</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.point3 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quota</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.quota }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.publishDate }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">👨🏻‍💻 Participant List</div>
                        <Button icon="pi pi-file-export" label="Export" style="width: fit-content" class="p-button-danger p-button-sm" />
                    </div>
                    <DataTable :value="participants" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- User Column -->
                        <Column header="User" style="min-width: 6rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <RouterLink to="marketing/detailParticipant" class="hover:underline">
                                        <span class="font-bold text-gray-800">{{ data.fullName }}</span>
                                    </RouterLink>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.memberLevel }}</span>
                                    <span class="text-gray-600 text-xs mt-2">📅 {{ data.date }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Prize Type -->
                        <Column field="prizeName" header="Prize" style="min-width: 8rem"></Column>

                        <!-- Action Approve & Reject -->
                        <!-- Action Approve & Reject -->
                        <Column header="Action" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex gap-2 items-center">
                                    <!-- Approve Button -->
                                    <Button v-if="!data.status" icon="pi pi-check" size="small" class="p-button-success p-button-sm" @click="approveParticipant(data)" />

                                    <!-- Reject Button -->
                                    <Button v-if="!data.status" icon="pi pi-times" size="small" class="p-button-danger p-button-sm" @click="rejectParticipant(data)" />

                                    <!-- Status Tag -->
                                    <Tag v-if="data.status" :value="data.status" :severity="data.status === 'Approved' ? 'success' : data.status === 'Rejected' ? 'danger' : 'info'" class="ml-2" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div class="card flex flex-col w-full">
                    <!-- Header with Invite Button -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🚩 Dealer list</div>
                        <RouterLink to="/marketing/inviteDealer">
                            <Button label="Invite Dealer" icon="pi pi-user-plus" style="width: fit-content" class="p-button-sm p-button-success" />
                        </RouterLink>
                    </div>

                    <DataTable :value="dealerList" :paginator="true" :rows="3" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- Title + ID -->
                        <Column header="Name" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.name }}</span>
                                    <span class="text-gray-600 text-xm mt-2">🔧 {{ data.id }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- State -->
                        <Column header="State" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-gray-800">{{ data.state }}</span>
                            </template>
                        </Column>

                        <!-- Signboard Type -->
                        <Column field="signboardType" header="Signboard Type" style="min-width: 6rem"></Column>

                        <!-- Actions -->
                        <Column header="Actions" style="min-width: 4rem; text-align: center">
                            <template #body="{ data }">
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="removeDealer(data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🚩 Criteria</div>
                    </div>

                    <DataTable :value="criteria" :paginator="true" :rows="3" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- Title + Type in one column -->
                        <Column header="Name" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.title }}</span>
                                    <span class="text-gray-600 text-xm mt-2">🔧 {{ data.type }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Pattern -->
                        <Column field="pattern" header="Pattern" style="min-width: 6rem"></Column>

                        <Column field="size" header="Size" style="min-width: 6rem"></Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Edit Prize Dialog -->
        <Dialog v-model:visible="editDialogVisible" modal header="Edit Prize Quantity" :style="{ width: '400px' }">
            <div class="flex flex-col gap-3">
                <div class="font-semibold text-gray-800">{{ selectedPrize?.prizeName }}</div>
                <div class="flex items-center gap-3">
                    <label class="text-gray-700 font-medium w-20">Quota:</label>
                    <InputNumber v-model="selectedPrize.prizeQuota" :min="1" class="w-full" />
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="Save" icon="pi pi-check" class="p-button-success p-button-sm" @click="savePrizeEdit" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const hoverPrize = ref(null);
const editDialogVisible = ref(false);
const selectedPrize = ref(null);

const campaign = ref({
    id: 1,
    campaignNo: 'CTY001',
    eten_userID_list: 'E010001,E010002,E010003',
    isGamification: 1,
    title: 'Toyo Tires Safety Awareness Campaign',
    description: 'Promoting road safety and awareness with Toyo Tires during festive season.',
    image1Path: '/demo/images/event-toyo-1.jpg',
    image2Path: '/demo/images/event-toyo-2.jpg',
    image3Path: '/demo/images/event-toyo-3.jpg',
    termCondition: 'Valid for participants within Malaysia only. One entry per user.',
    publishDate: '2025-01-05',
    startDate: '2025-01-10',
    endDate: '2025-02-10',
    quota: 1000,
    maxPerUser: 1,
    point1: 10,
    point2: 20,
    point3: 30,
    status: 1,
    created: '2025-01-05',
    deleted: null,
    totalSub: 650 // Current total submissions
});

const participants = ref([
    {
        id: 1,
        fullName: 'Ahmad Faiz',
        memberLevel: 'Gold',
        date: '2025-09-01',
        point: 90,
        prizeName: 'Bonus Point Toyo',
        prizeType: 'Point',
        prize: 100,
        status: 'Approved'
    },
    {
        id: 2,
        fullName: 'Nur Aisyah',
        memberLevel: 'Silver',
        date: '2025-09-02',
        point: 85,
        prizeName: 'E-Wallet RM 50',
        prizeType: 'E-Wallet',
        prize: 'MYR 50',
        status: 'Approved'
    },
    {
        id: 3,
        fullName: 'Hafiz Din',
        memberLevel: 'Platinum',
        date: '2025-09-02',
        point: 95,
        prizeName: 'Shoppe RM 20',
        prizeType: 'E-Voucher',
        prize: 'Amazon $20',
        status: 'Rejected'
    },
    {
        id: 4,
        fullName: 'Lim Wei Jian',
        memberLevel: 'Gold',
        date: '2025-09-03',
        point: 90,
        prizeName: 'Smartwatch',
        prizeType: 'Item',
        prize: 'Smartwatch',
        status: ''
    },
    {
        id: 5,
        fullName: 'Siti Mariam',
        memberLevel: 'Silver',
        date: '2025-09-03',
        point: 85,
        prizeName: 'Bonus Point Toyo',
        prizeType: 'Point',
        prize: 50,
        status: ''
    },
    {
        id: 6,
        fullName: 'Arjun Kumar',
        memberLevel: 'Gold',
        date: '2025-09-04',
        point: 90,
        prizeName: 'E-Wallet RM 100',
        prizeType: 'E-Wallet',
        prize: 'MYR 100',
        status: ''
    },
    {
        id: 7,
        fullName: 'Tan Li Ying',
        memberLevel: 'Platinum',
        date: '2025-09-04',
        point: 95,
        prizeName: 'E-Voucher Shoppe RM 50',
        prizeType: 'E-Voucher',
        prize: 'Amazon $50',
        status: ''
    },
    {
        id: 8,
        fullName: 'Mohd Amir',
        memberLevel: 'Silver',
        date: '2025-09-05',
        point: 85,
        prizeName: 'Bluetooth Headphones',
        prizeType: 'Item',
        prize: 'Bluetooth Headphones',
        status: ''
    },
    {
        id: 9,
        fullName: 'Farah Nadiah',
        memberLevel: 'Gold',
        date: '2025-09-05',
        point: 90,
        prizeName: 'Bonus Point Toyo',
        prizeType: 'Point',
        prize: 75,
        status: ''
    },
    {
        id: 10,
        fullName: 'Jason Lee',
        memberLevel: 'Platinum',
        date: '2025-09-06',
        point: 95,
        prizeName: 'E-Wallet RM 200',
        prizeType: 'E-Wallet',
        prize: 'MYR 200',
        status: ''
    },
    {
        id: 11,
        fullName: 'Hazrul Izhar',
        memberLevel: 'Classic',
        date: '2025-09-06',
        point: 95,
        prizeName: 'Umbrella',
        prizeType: 'Item',
        prize: 'Smartphone',
        status: ''
    }
]);

const criteria = [
    {
        id: 1,
        title: 'Pattern A Small',
        type: 'Tire',
        pattern: 'Pattern A',
        size: '15 inch',
        minQty: 2
    },
    {
        id: 2,
        title: 'Pattern A Medium',
        type: 'Tire',
        pattern: 'Pattern A',
        size: '16 inch',
        minQty: 4
    },
    {
        id: 3,
        title: 'Pattern B Small',
        type: 'Tire',
        pattern: 'Pattern B',
        size: '15 inch',
        minQty: 2
    },
    {
        id: 4,
        title: 'Pattern B Large',
        type: 'Tire',
        pattern: 'Pattern B',
        size: '18 inch',
        minQty: 4
    },
    {
        id: 5,
        title: 'Pattern C Economy',
        type: 'Tire',
        pattern: 'Pattern C',
        size: '14 inch',
        minQty: 2
    },
    {
        id: 6,
        title: 'Pattern C Premium',
        type: 'Tire',
        pattern: 'Pattern C',
        size: '17 inch',
        minQty: 4
    },
    {
        id: 7,
        title: 'Pattern D Standard',
        type: 'Tire',
        pattern: 'Pattern D',
        size: '16 inch',
        minQty: 2
    },
    {
        id: 8,
        title: 'Pattern D Wide',
        type: 'Tire',
        pattern: 'Pattern D',
        size: '19 inch',
        minQty: 4
    },
    {
        id: 9,
        title: 'Pattern E Compact',
        type: 'Tire',
        pattern: 'Pattern E',
        size: '13 inch',
        minQty: 2
    },
    {
        id: 10,
        title: 'Pattern E Sport',
        type: 'Tire',
        pattern: 'Pattern E',
        size: '20 inch',
        minQty: 4
    }
];

const dealerList = ref([
    {
        id: 'E010001',
        name: 'Tau Lim Tires Service',
        signboardType: 'T10',
        state: 'Johor'
    },
    {
        id: 'E010002',
        name: 'Toyo Tires Center',
        signboardType: 'TAC',
        state: 'Kuala Lumpur'
    },
    {
        id: 'E010003',
        name: 'Auto Wheels Malaysia',
        signboardType: 'TSS',
        state: 'Selangor'
    },
    {
        id: 'E010004',
        name: 'Speedy Tire Shop',
        signboardType: 'TST',
        state: 'Penang'
    },
    {
        id: 'E010005',
        name: 'Premium Auto Tires',
        signboardType: 'TPC',
        state: 'Perak'
    },
    {
        id: 'E010006',
        name: 'Star Tires & Service',
        signboardType: 'Non',
        state: 'Sabah'
    },
    {
        id: 'E010007',
        name: 'AutoMax Tire Service',
        signboardType: 'T10',
        state: 'Johor'
    }
]);

const listPrize = ref([
    { id: 1, prizeType: 'Point', imageURL: '/demo/images/bonus-point.png', prizeName: 'Bonus Point Toyo', prizeQuota: 50, prizeRemain: 20 },
    { id: 2, prizeType: 'E-Wallet', imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg', prizeName: 'MYR 50 E-Wallet', prizeQuota: 100, prizeRemain: 40 },
    { id: 3, prizeType: 'E-Voucher', imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp', prizeName: 'Shopee E-Voucher', prizeQuota: 30, prizeRemain: 10 },
    { id: 4, prizeType: 'Item', imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s', prizeName: 'Toyo Tumbler', prizeQuota: 15, prizeRemain: 5 }
]);

const removeDealer = (dealer) => {
    dealerList.value = dealerList.value.filter((d) => d.id !== dealer.id);
};

function openEditDialog(prize) {
    selectedPrize.value = { ...prize };
    editDialogVisible.value = true;
}

function savePrizeEdit() {
    const index = listPrize.value.findIndex((p) => p.id === selectedPrize.value.id);
    if (index !== -1) {
        listPrize.value[index].prizeQuota = selectedPrize.value.prizeQuota;
    }
    editDialogVisible.value = false;
}

function approveParticipant(participant) {
    const target = participants.value.find(p => p.id === participant.id);
    if (target) {
        target.status = 'Approved';
    }
}

function rejectParticipant(participant) {
    const target = participants.value.find(p => p.id === participant.id);
    if (target) {
        target.status = 'Rejected';
    }
}
</script>
