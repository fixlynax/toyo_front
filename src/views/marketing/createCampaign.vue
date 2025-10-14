<template>
    <Fluid>
        <!-- 🎯 Create Campaign -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Campaign</div>

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
                    <label class="block font-bold text-gray-700 mb-2">Upload Campaign Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, idx) in ['image1Path', 'image2Path', 'image3Path']" :key="idx">
                            <FileUpload mode="basic" :name="field" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Upload Image ${idx + 1}`" class="w-full" />
                            <img v-if="campaign[field]" :src="campaign[field]" :alt="`Preview ${idx + 1}`" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
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

        <!-- 🎁 Reward Section -->
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

                    <!-- Select Reward + Quantity -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <!-- Select Reward (2/3) -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Reward</label>
                            <Dropdown v-model="reward.selected" :options="listPrize" optionLabel="prizeName" placeholder="Select a reward" class="w-full">
                                <!-- Option Template -->
                                <template #option="slotProps">
                                    <div class="flex items-center gap-3">
                                        <img :src="slotProps.option.imageURL" class="w-28 h-16 object-cover rounded" />
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-gray-800">{{ slotProps.option.prizeName }}</span>
                                            <small class="text-gray-500">{{ slotProps.option.prizeType }}</small>
                                        </div>
                                    </div>
                                </template>

                                <!-- Selected Value Template -->
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-3">
                                        <img :src="slotProps.value.imageURL" class="w-8 h-8 object-cover rounded" />
                                        <div>
                                            <span class="font-semibold text-gray-800">{{ slotProps.value.prizeName }}</span>
                                            <small class="block text-gray-500">{{ slotProps.value.prizeType }}</small>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400">Select Reward</span>
                                </template>
                            </Dropdown>
                        </div>

                        <!-- Quantity -->
                        <div class="w-full">
                            <FloatLabel>
                                <InputNumber id="qty" v-model="reward.qty" :min="1" class="w-full" />
                                <label for="qty">Quantity</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No rewards added yet.</div>

            <!-- Add Reward Button -->
            <div class="flex justify-start mt-4">
                <Button icon="pi pi-plus" label="Add Reward" style="width: fit-content" class="p-button-success p-button-sm" :disabled="rewards.length >= 10" @click="addReward" />
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end mt-8 gap-2">
                <div class="w-40">
                    <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" @click="submitForm" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const campaign = ref({
    title: '',
    description: '',
    termCondition: '',
    image1Path: '',
    image2Path: '',
    image3Path: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    isGamification: 0,
    quota: 0,
    maxPerUser: 1,
    point1: 0,
    point2: 0,
    point3: 0,
    status: 1
});

// Gamification Toggle
const gamificationOnOff = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 }
];

// Reward Section
const rewards = ref([]);

const listPrize = ref([
    { id: 1, imageURL: '/demo/images/bonus-point.png', prizeName: 'Bonus Point Toyo', prizeType: 'Point', prizeQuota: 50, prizeRemain: 20 },
    { id: 2, imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg', prizeName: 'MYR 50 E-Wallet', prizeType: 'E-Wallet', prizeQuota: 100, prizeRemain: 40 },
    { id: 3, imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp', prizeName: 'Shopee E-Voucher', prizeType: 'E-Voucher', prizeQuota: 30, prizeRemain: 10 },
    { id: 4, imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s', prizeName: 'Toyo Tumbler', prizeType: 'Item', prizeQuota: 15, prizeRemain: 5 }
]);

const addReward = () => {
    rewards.value.push({
        selected: null,
        qty: 1
    });
};

const removeReward = (index) => {
    rewards.value.splice(index, 1);
};

// Upload
const onImageSelect = (event, field) => {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            campaign.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// Submit
const submitForm = () => {
    console.log('Campaign Data:', campaign.value);
    console.log('Rewards:', rewards.value);
};
</script>
