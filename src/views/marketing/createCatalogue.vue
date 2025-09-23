<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- ======================== -->
            <!-- Catalogue Edit Section   -->
            <!-- ======================== -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Catalogue</div>

                <!-- catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div>
                        <label class="block font-medium text-gray-700 mb-1">Title</label>
                        <InputText v-model="catalogue.title" class="w-full" />
                    </div>

                    <!-- SKU -->
                    <div>
                        <label class="block font-medium text-gray-700 mb-1">SKU</label>
                        <InputText v-model="catalogue.sku" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Description</label>
                        <Textarea v-model="catalogue.description" class="w-full" />
                    </div>

                    <!-- Terms & Instructions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700">Terms</label>
                            <Textarea v-model="catalogue.terms" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700">Instruction</label>
                            <Textarea v-model="catalogue.instruction" class="w-full" />
                        </div>
                    </div>

                    <!-- Purpose To & Expiry -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Purpose To</label>
                            <Dropdown v-model="catalogue.purpose" :options="purposeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Expiry</label>
                            <Calendar v-model="catalogue.expiry" class="w-full" />
                        </div>
                    </div>

                    <!-- Type & Is Birthday -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Type</label>
                            <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select a type" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Is Birthday?</label>
                            <Dropdown v-model="catalogue.isBirthday" :options="isBirthdayOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                    </div>

                    <!-- E-Voucher Specific Fields -->
                    <div v-if="catalogue.type === 'E-Voucher'" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Value Type</label>
                            <Dropdown v-model="catalogue.valueType" :options="valueOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Value Amount</label>
                            <InputNumber v-model="catalogue.valueAmount" class="w-full" />
                        </div>
                    </div>

                    <!-- Item Specific Fields -->
                    <div v-else-if="catalogue.type === 'Item'" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Quantity</label>
                            <InputNumber v-model="catalogue.valueAmount" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-medium text-gray-700 mb-2">Catalogue Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="relative">
                            <FileUpload 
                                mode="basic" 
                                name="image1" 
                                accept="image/*" 
                                customUpload 
                                @select="onImageSelect($event, 'image1URL')" 
                                chooseLabel="Change Image 1" 
                                class="w-full" 
                            />
                            <div v-if="catalogue.image1URL" class="relative mt-2">
                                <img :src="catalogue.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button 
                                    @click="removeImage('image1URL')" 
                                    class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" 
                                    title="Remove Image">
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ======================== -->
        <!-- PIN Section (E-Wallet)   -->
        <!-- ======================== -->
        <div v-if="catalogue.type === 'E-Wallet'" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🔑 List PIN</div>
                </div>

                <DataTable :value="catalogue.pins" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
                    <template #header>
                        <div class="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                            <div class="flex gap-4 w-full md:w-auto">
                                <div class="w-32">
                                    <label class="block font-medium text-gray-700 mb-1">Used</label>
                                    <span class="text-gray-800 font-semibold">{{ catalogue.usedPins }}</span>
                                </div>
                                <div class="w-32">
                                    <label class="block font-medium text-gray-700 mb-1">Total</label>
                                    <span class="text-gray-800 font-semibold">{{ catalogue.totalqty }}</span>
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <Button icon="pi pi-download" class="w-10 h-10" severity="primary" @click="downloadPins" />
                                <Button icon="pi pi-upload" class="w-10 h-10" severity="success" @click="importPins" />
                            </div>
                        </div>
                    </template>

                    <template #empty> No pins found. </template>
                    <template #loading> Loading pins data. Please wait. </template>

                    <Column header="Pin" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.pin }} </template>
                    </Column>
                    <Column header="Expiry" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.expiry }}</template>
                    </Column>
                    <Column header="Date Used" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.used }}</template>
                    </Column>
                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.status ? 'Used' : 'Available' }}</template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- ======================== -->
        <!-- Birthday Reward Section  -->
        <!-- ======================== -->
        <div v-if="catalogue.isBirthday === 1" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🎂 Birthday Reward</div>
                </div>

                <div class="p-4 text-gray-600">
                    <!-- Reward Type Selection -->
                    <div class="mb-4">
                        <label class="block font-medium text-gray-700 mb-1">Reward Type</label>
                        <Dropdown v-model="catalogue.birthdayReward.type" :options="birthdayRewardTypeOptions" optionLabel="label" optionValue="value" placeholder="Select reward type" class="w-full" />
                    </div>

                    <!-- Points Option -->
                    <div v-if="catalogue.birthdayReward.type === 'Points'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Silver Tier Points</label>
                            <InputNumber v-model="catalogue.birthdayReward.points.silver" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Gold Tier Points</label>
                            <InputNumber v-model="catalogue.birthdayReward.points.gold" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Platinum Tier Points</label>
                            <InputNumber v-model="catalogue.birthdayReward.points.platinum" class="w-full" />
                        </div>
                    </div>

                    <!-- Reward Item Option -->
                    <div v-else-if="catalogue.birthdayReward.type === 'Reward'" class="mt-4">
                        <label class="block font-medium text-gray-700 mb-1">Select Reward Item</label>
                        <Dropdown v-model="catalogue.birthdayReward.itemId" :options="rewardItems" optionLabel="title" optionValue="id" placeholder="Select a reward item" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- ======================== -->
        <!-- Cost Redeem Section      -->
        <!-- ======================== -->
        <div class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🎁 Cost Redeem</div>
                </div>

                <div class="p-4 text-gray-600">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Silver Point</label>
                            <InputNumber v-model="catalogue.point1" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Gold Point</label>
                            <InputNumber v-model="catalogue.point2" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Platinum Point</label>
                            <InputNumber v-model="catalogue.point3" class="w-full" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end mt-2">
                    <div class="w-40">
                            <Button label="Save" class="w-full" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

// Catalogue Types
const typeOptions = [
    { label: 'E-Wallet', value: 'E-Wallet' },
    { label: 'E-Voucher', value: 'E-Voucher' },
    { label: 'Item', value: 'Item' }
];

// Yes / No
const isBirthdayOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

// Purpose
const purposeOptions = [
    { label: 'Catalogue', value: 'Catalogue' },
    { label: 'Campaign', value: 'Campaign' },
    { label: 'Game', value: 'Game' }
];

// Value Type
const valueOptions = [
    { label: 'Amount', value: 'Amount' },
    { label: 'Percentage', value: 'Percentage' }
];

// Birthday Reward Options
const birthdayRewardTypeOptions = [
    { label: 'Points', value: 'Points' },
    { label: 'Reward', value: 'Reward' }
];

// Example Reward Items
const rewardItems = [
    { id: 1, title: 'Touch ’n Go Reload RM20' },
    { id: 2, title: 'Starbucks Voucher RM10' },
    { id: 3, title: 'Grab Food Credit RM15' }
];

// Catalogue Data
const catalogue = ref({

    // Birthday Reward Data
    birthdayReward: {
        type: 'Points',
        points: {
            silver: 0,
            gold: 0,
            platinum: 0
        },
        itemId: null
    }
});

// Image Upload Handlers
const onImageSelect = (event, property) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        catalogue.value[property] = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = (property) => {
    catalogue.value[property] = null;
};

// PIN Actions
const downloadPins = () => {
    console.log('Downloading PINs for', catalogue.value.title);
};

const importPins = () => {
    console.log('Importing PINs for', catalogue.value.title);
};
</script>
