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

                <div class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">🎁 Reward Options</div>
                    </div>

                    <div class="space-y-8">
                        <!-- Each Reward -->
                        <div v-for="(reward, rIndex) in rewards" :key="rIndex" class="pb-6 border-b last:border-0">
                            <!-- Top Row -->
                            <div class="flex justify-between items-center mb-4">
                                <div class="text-2xl font-bold text-gray-800">{{ reward.name }}</div>
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="removeReward(rIndex)" />
                            </div>

                            <!-- Reward Image + Details -->
                            <div class="flex flex-col md:flex-row gap-6 items-start">
                                <!-- Image -->
                                <img :src="reward.image" alt="Reward Image" class="rounded-xl shadow-sm object-cover w-full md:w-1/3 max-h-48" />

                                <!-- Info -->
                                <div class="flex-1 space-y-3">
                                    <!-- Type & Quantity -->
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600 text-lg">Type</span>
                                        <span class="font-semibold text-lg">{{ reward.type }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600 text-lg">Quantity</span>
                                        <span class="font-semibold text-lg">{{ reward.balQty }}/{{ reward.totalQty }}</span>
                                    </div>

                                    <!-- Reward Pin -->
                                    <template v-if="reward.type === 'Reward Pin'">
                                        <div class="pt-4">
                                            <div class="text-xl font-bold text-gray-800 mb-2">Reward Pin Details</div>
                                            <div class="flex justify-between items-center">
                                                <span class="text-gray-600 text-lg">Expiry</span>
                                                <span class="font-semibold text-lg">{{ reward.expiry }}</span>
                                            </div>
                                        </div>
                                    </template>

                                    <!-- Points -->
                                    <template v-else-if="reward.type === 'Point'">
                                        <div class="pt-4">
                                            <div class="text-xl font-bold text-gray-800 mb-3">Tier Points</div>
                                            <div class="grid grid-cols-3 text-center gap-4">
                                                <div>
                                                    <div class="text-gray-500">Silver</div>
                                                    <div class="font-semibold">{{ reward.tierPoints.silver }}</div>
                                                </div>
                                                <div>
                                                    <div class="text-gray-500">Gold</div>
                                                    <div class="font-semibold">{{ reward.tierPoints.gold }}</div>
                                                </div>
                                                <div>
                                                    <div class="text-gray-500">Platinum</div>
                                                    <div class="font-semibold">{{ reward.tierPoints.platinum }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
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
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🚩 Dealer list</div>
                    </div>

                    <DataTable :value="dealerList" :paginator="true" :rows="3" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- Title + Type in one column -->
                        <Column header="Name" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.name }}</span>
                                    <span class="text-gray-600 text-xm mt-2">🔧 {{ data.id }}</span>
                                </div>
                            </template>
                        </Column>   

                        <!-- Min Qty -->
                        <Column header="State" style="min-width: 6rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="text-gray-800">{{ data.state }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Pattern -->
                        <Column field="signboardType" header="Signboard Type" style="min-width: 6rem"></Column>

                        <!-- Size -->
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
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

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

const dealerList = [
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
];

const rewards = ref([
    // Example Reward: Points
    {
        type: 'Point',
        name: '500 Bonus Points',
        image: '/demo/images/bonus-point.png',
        totalQty: 30,
        balQty: 17,
        tierPoints: {
            silver: 100,
            gold: 200,
            platinum: 300
        },
        // Not applicable for Points
        expiry: null
    },

    // Example Reward: Reward Pin
    {
        type: 'Reward Pin',
        name: 'RM10 E-Wallet Voucher',
        image: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
        totalQty: 20,
        balQty: 12,
        expiry: '2025-12-31',
        tierPoints: {
            silver: null,
            gold: null,
            platinum: null
        }
    }
]);

function addReward() {
    rewards.value.push({
        type: null,
        name: '',
        image: null,
        qty: 1,
        tierPoints: { silver: 0, gold: 0, platinum: 0 }
    });
}

function removeReward(index) {
    rewards.value.splice(index, 1);
}
</script>
