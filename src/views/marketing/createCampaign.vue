<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Campaign</div>

                <!-- Campaign Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Title</label>
                        <InputText v-model="campaign.title" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Description</label>
                        <Textarea v-model="campaign.description" rows="3" class="w-full" />
                    </div>

                    <!-- Term Condition -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Term & Condition</label>
                        <Textarea v-model="campaign.termCondition" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <!-- Quota -->
                        <div>
                            <label class="block font-medium text-gray-700">Quota</label>
                            <InputNumber v-model="campaign.quota" class="w-full" />
                        </div>

                        <!-- Max per user -->
                        <div>
                            <label class="block font-medium text-gray-700">Max Per User</label>
                            <InputNumber v-model="campaign.maxPerUser" class="w-full" />
                        </div>

                        <!-- Gamification -->
                        <div>
                            <label class="block font-medium text-gray-700">Gamification</label>
                            <Dropdown v-model="campaign.isGamification" :options="gamificationOnOff" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <!-- Dates -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700">Publish Date</label>
                            <Calendar v-model="campaign.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700">Start Date</label>
                            <Calendar v-model="campaign.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700">End Date</label>
                            <Calendar v-model="campaign.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                    </div>

                    <!-- Points -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Point Silver</label>
                            <InputNumber v-model="campaign.point1" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Point Gold</label>
                            <InputNumber v-model="campaign.point2" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Point Platinum</label>
                            <InputNumber v-model="campaign.point3" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-medium text-gray-700 mb-2">Campaign Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="(field, idx) in ['image1Path', 'image2Path', 'image3Path']" :key="idx" class="relative">
                            <FileUpload mode="basic" :name="field" accept="image/*" customUpload @select="onImageSelect($event, field)" :chooseLabel="`Upload Image ${idx + 1}`" class="w-full" />
                            <div v-if="campaign[field]" class="relative mt-2">
                                <img :src="campaign[field]" :alt="`Preview ${idx + 1}`" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage(field)" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reward Options -->
                <div v-if="campaign.isGamification == 1">
                    <div class="flex justify-between items-center border-b pb-2 mb-2">
                        <div class="text-xl font-bold text-gray-800">🎁 Reward Options</div>
                        <Button label="Add Reward" style="width: fit-content" icon="pi pi-plus" class="p-button-sm" @click="addReward" />
                    </div>
                    <div class="space-y-6">
                        <div v-for="(reward, rIndex) in rewards" :key="rIndex" class="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-medium text-gray-700">Reward Name</label>
                                    <InputText v-model="reward.name" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium text-gray-700">Quantity</label>
                                    <InputNumber v-model="reward.quantity" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium text-gray-700">Type</label>
                                    <Dropdown v-model="reward.type" :options="rewardTypes" optionLabel="label" optionValue="value" class="w-full" />
                                </div>

                                <template v-if="reward.type === 'point'">
                                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label class="block font-medium text-gray-700">Silver Points</label>
                                            <InputNumber v-model="reward.points.silver" class="w-full" />
                                        </div>
                                        <div>
                                            <label class="block font-medium text-gray-700">Gold Points</label>
                                            <InputNumber v-model="reward.points.gold" class="w-full" />
                                        </div>
                                        <div>
                                            <label class="block font-medium text-gray-700">Platinum Points</label>
                                            <InputNumber v-model="reward.points.platinum" class="w-full" />
                                        </div>
                                    </div>
                                </template>

                                <template v-else-if="reward.type === 'pin'">
                                    <div>
                                        <label class="block font-medium text-gray-700">Expiry Date</label>
                                        <Calendar v-model="reward.expiry" dateFormat="yy-mm-dd" class="w-full" />
                                    </div>
                                </template>
                            </div>
                            <div class="flex justify-end mt-2">
                                <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="removeReward(rIndex)" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Criteria -->
                <div v-if="campaign.isGamification == 1">
                    <div class="flex justify-between items-center border-b pb-2 mb-2">
                        <div class="text-xl font-bold text-gray-800">📋 Criteria</div>
                        <Button label="Add Criteria" style="width: fit-content" icon="pi pi-plus" class="p-button-sm" @click="addCriteria" />
                    </div>
                    <div class="space-y-6">
                        <div v-for="(criteria, cIndex) in criterias" :key="cIndex" class="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-medium text-gray-700">Title</label>
                                    <InputText v-model="criteria.title" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium text-gray-700">Type</label>
                                    <Dropdown v-model="criteria.type" :options="criteriaTypes" optionLabel="label" optionValue="value" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium text-gray-700">Pattern</label>
                                    <InputText v-model="criteria.pattern" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium text-gray-700">Size</label>
                                    <InputText v-model="criteria.size" class="w-full" />
                                </div>
                                <div>
                                    <label class="block font-medium text-gray-700">Min Qty</label>
                                    <InputNumber v-model="criteria.minQty" class="w-full" />
                                </div>
                            </div>
                            <div class="flex justify-end mt-2">
                                <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="removeCriteria(cIndex)" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-4">
                    <div class="w-40">
                        <RouterLink to="/marketing/detailCampaign">
                            <Button label="Create" class="w-full" />
                        </RouterLink>
                    </div>
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

// Rewards
const rewardTypes = [
    { label: 'Point', value: 'point' },
    { label: 'Reward Pin', value: 'pin' }
];
const gamificationOnOff = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 }
];
const rewards = ref([]);
const addReward = () =>
    rewards.value.push({
        name: '',
        quantity: 0,
        type: '',
        points: { silver: 0, gold: 0, platinum: 0 },
        expiry: null
    });
const removeReward = (index) => rewards.value.splice(index, 1);

// Criteria
const criteriaTypes = [
    { label: 'Tyre', value: 'tyre' },
    { label: 'Rim', value: 'rim' }
];
const criterias = ref([]);
const addCriteria = () => criterias.value.push({ title: '', type: '', pattern: '', size: '', minQty: 1 });
const removeCriteria = (index) => criterias.value.splice(index, 1);

// Upload functions
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
const removeImage = (field) => {
    campaign.value[field] = '';
};
</script>
