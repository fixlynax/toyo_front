<template>
    <Fluid>
        <!-- 🎯 Edit Campaign -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Campaign</div>

                <!-- Campaign Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="campaign.title" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="campaign.description" rows="3" class="w-full" />
                    </div>

                    <!-- Term & Condition -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Term & Condition</label>
                        <Textarea v-model="campaign.termCondition" rows="3" class="w-full" />
                    </div>

                    <!-- Quota & Max -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Quota</label>
                            <InputNumber v-model="campaign.quota" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Max Per User</label>
                            <InputNumber v-model="campaign.maxPerUser" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Gamification</label>
                            <Dropdown v-model="campaign.isGamification" :options="gamificationOnOff" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <!-- Dates -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Publish Date</label>
                            <Calendar v-model="campaign.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="campaign.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="campaign.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Campaign Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, idx) in ['image1Path', 'image2Path', 'image3Path']" :key="idx" class="relative">
                            <FileUpload mode="basic" :name="field" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Change Image ${idx + 1}`" class="w-full" />
                            <div v-if="campaign[field]" class="relative mt-2">
                                <img :src="campaign[field]" :alt="`Preview ${idx + 1}`" class="rounded-lg shadow-md object-cover w-full h-60" />
                                <button @click="removeImage(field)" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 💎 Point Section -->
        <div class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">💎 Point Configuration</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block font-bold text-gray-700">Silver Points</label>
                    <InputNumber v-model="campaign.point1" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Gold Points</label>
                    <InputNumber v-model="campaign.point2" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Platinum Points</label>
                    <InputNumber v-model="campaign.point3" class="w-full" />
                </div>
            </div>
        </div>

        <!-- 🏆 Reward Section -->
        <div v-if="campaign.isGamification == 1" class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">🏆 Reward Section</div>
            </div>

            <div v-if="rewards.length > 0" class="space-y-4">
                <div v-for="(reward, index) in rewards" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Reward {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeReward(index)" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <!-- Select Prize -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Prize</label>
                            <Dropdown v-model="reward.selected" :options="listPrize" optionLabel="prizeName" placeholder="Select a prize" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <img :src="slotProps.option.imageURL" class="w-28 h-16 object-cover rounded" />
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-gray-800">{{ slotProps.option.prizeName }}</span>
                                            <small class="text-gray-500">{{ slotProps.option.prizeType }}</small>
                                        </div>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-3">
                                        <img :src="slotProps.value.imageURL" class="w-14 h-14 object-cover rounded" />
                                        <div>
                                            <span class="font-semibold text-gray-800">{{ slotProps.value.prizeName }}</span>
                                            <small class="block text-gray-500">{{ slotProps.value.prizeType }}</small>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400">Select Prize</span>
                                </template>
                            </Dropdown>
                        </div>

                        <!-- Quantity -->
                        <div>
                            <FloatLabel>
                                <InputNumber id="qty" v-model="reward.qty" :min="1" class="w-full" />
                                <label for="qty">Quantity</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No rewards added yet.</div>

            <div class="flex justify-start mt-4">
                <div class="w-30">
                    <Button icon="pi pi-plus" label="Add Reward" class="p-button-success p-button-sm" @click="addReward" />
                </div>
            </div>
        </div>

        <!-- 📋 Criteria Section -->
        <div v-if="campaign.isGamification == 1" class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
            </div>

            <div v-if="criterias.length > 0" class="space-y-4">
                <div v-for="(criteria, index) in criterias" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Criteria {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeCriteria(index)" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
                        <!-- Dropdown -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Tyre Pattern</label>
                            <Dropdown v-model="criteria.selected" :options="listCriteria" optionLabel="name" placeholder="Select pattern" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <img :src="slotProps.option.image" class="w-20 h-20 object-cover rounded" />
                                        <div>
                                            <div class="font-semibold">{{ slotProps.option.name }}</div>
                                            <small class="text-gray-500">{{ slotProps.option.pattern }} • {{ slotProps.option.size }} • {{ slotProps.option.minQty }}</small>
                                        </div>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-3">
                                        <!-- Image -->
                                        <img :src="slotProps.value.image" class="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm" />

                                        <!-- Details -->
                                        <div class="flex flex-col leading-tight">
                                            <span class="font-semibold text-gray-800">
                                                {{ slotProps.value.name }}
                                            </span>
                                            <div class="text-xs text-gray-600 space-y-0.5">
                                                <div>🧶 <span class="font-medium">Pattern:</span> {{ slotProps.value.pattern }}</div>
                                                <div>📏 <span class="font-medium">Size:</span> {{ slotProps.value.size }}</div>
                                                <div>📦 <span class="font-medium">Min Qty:</span> {{ slotProps.value.minQty }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <span v-else class="text-gray-400 italic">Select pattern</span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No criteria added yet.</div>

            <div class="flex justify-start mt-4">
                <div class="w-30">
                    <Button icon="pi pi-plus" label="Add Criteria" class="p-button-info p-button-sm" @click="addCriteria" />
                </div>
            </div>
        </div>

        <!-- ✅ Submit Buttons -->
        <div class="flex justify-end mt-8 gap-2">
            <div class="w-40">
                <Button label="Cancel" class="p-button-secondary w-full" @click="$router.back()" />
            </div>
            <div class="w-40">
                <Button label="Update" class="w-full" @click="submitForm" />
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const campaign = ref({
    id: 1,
    campaignNo: 'CTY001',
    title: 'Toyo Tires Safety Awareness Campaign',
    description: 'Promoting road safety and awareness with Toyo Tires during festive season.',
    termCondition: 'Valid for participants within Malaysia only. One entry per user.',
    image1Path: '/demo/images/event-toyo-1.jpg',
    image2Path: '/demo/images/event-toyo-2.jpg',
    image3Path: '/demo/images/event-toyo-3.jpg',
    publishDate: '2025-01-05',
    startDate: '2025-01-10',
    endDate: '2025-02-10',
    isGamification: 1,
    quota: 1000,
    maxPerUser: 1,
    point1: 10,
    point2: 20,
    point3: 30,
    status: 1
});

const gamificationOnOff = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 }
];

// 🎁 Prize List
const listPrize = ref([
    { id: 1, imageURL: '/demo/images/bonus-point.png', prizeName: 'Bonus Point Toyo', prizeType: 'Point', prizeQuota: 50, prizeRemain: 20 },
    { id: 2, imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg', prizeName: 'MYR 50 E-Wallet', prizeType: 'E-Wallet', prizeQuota: 100, prizeRemain: 40 },
    { id: 3, imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp', prizeName: 'Shopee E-Voucher', prizeType: 'E-Voucher', prizeQuota: 30, prizeRemain: 10 },
    { id: 4, imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s', prizeName: 'Toyo Tumbler', prizeType: 'Item', prizeQuota: 15, prizeRemain: 5 }
]);

// 🎯 Reward State
const rewards = ref([]);
const addReward = () => rewards.value.push({ selected: null, qty: 1 });
const removeReward = (index) => rewards.value.splice(index, 1);

// 📋 Criteria
const listCriteria = ref([
    { image: '/demo/images/toyor_tayar6.png', pattern: 'T1R', name: 'Proxes T1R', size: '15 inch', minQty: 2 },
    { image: '/demo/images/toyor_tayar5.png', pattern: 'TSC', name: 'Proxes TSC', size: '17 inch', minQty: 1 },
    { image: '/demo/images/toyor_tayar4.png', pattern: 'TR', name: 'Proxes TR1', size: '14 inch', minQty: 2 },
    { image: '/demo/images/toyor_tayar3.png', pattern: 'TH7', name: 'Proxes TH7', size: '15 inch', minQty: 1 },
    { image: '/demo/images/toyor_tayar2.png', pattern: 'T1S', name: 'Proxes T1S', size: '14 inch', minQty: 2 },
    { image: '/demo/images/toyor_tayar1.png', pattern: 'T35', name: 'Proxes T35', size: '16 inch', minQty: 1 },
    { image: '/demo/images/toyor_tayar2.png', pattern: 'TEO', name: 'NanoEnergy TEO', size: '24 inch', minQty: 2 },
    { image: '/demo/images/toyor_tayar1.png', pattern: 'T35', name: 'Proxes T35', size: '16 inch', minQty: 1 },
    { image: '/demo/images/toyor_tayar3.png', pattern: 'T1S', name: 'Proxes T1S', size: '14 inch', minQty: 4 },
    { image: '/demo/images/toyor_tayar4.png', pattern: 'TH7', name: 'Proxes TH7', size: '15 inch', minQty: 2 },
    { image: '/demo/images/toyor_tayar5.png', pattern: 'C1S', name: 'Proxes C1S', size: '15 inch', minQty: 1 },
    { image: '/demo/images/toyor_tayar6.png', pattern: 'Yew', name: 'Proxes Yew', size: '15 inch', minQty: 4 }
]);

const criterias = ref([]);
const addCriteria = () => criterias.value.push({ selected: null, minQty: 1 });
const removeCriteria = (index) => criterias.value.splice(index, 1);

// 📸 Upload
const onImageSelect = (event, field) => {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => (campaign.value[field] = e.target.result);
        reader.readAsDataURL(file);
    }
};
const removeImage = (field) => (campaign.value[field] = '');

// 🚀 Submit
const submitForm = () => {
    console.log('Updated Campaign:', campaign.value);
    console.log('Rewards:', rewards.value);
    console.log('Criterias:', criterias.value);
};
</script>
