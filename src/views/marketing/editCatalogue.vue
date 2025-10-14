<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- ======================== -->
            <!-- Catalogue Edit Section   -->
            <!-- ======================== -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Catalogue</div>

                <!-- Type & Birthday -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Type</label>
                        <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" disabled optionValue="value" placeholder="Select a type" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Is Birthday?</label>
                        <Dropdown v-model="catalogue.isBirthday" :options="isBirthday" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                    </div>
                </div>
                <!-- catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-1">Title</label>
                        <InputText v-model="catalogue.title" class="w-full" />
                    </div>

                    <!-- SKU -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">SKU</label>
                        <InputText v-model="catalogue.sku" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="catalogue.description" class="w-full" />
                    </div>

                    <!-- Terms & Instructions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Terms</label>
                            <Textarea v-model="catalogue.terms" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Instruction</label>
                            <Textarea v-model="catalogue.instruction" class="w-full" />
                        </div>
                    </div>

                    <!-- Purpose To & Publish Date -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Purpose To</label>
                            <Dropdown v-model="catalogue.purpose" :options="purposeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Expiry</label>
                            <Calendar v-model="catalogue.expiry" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Catalogue Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="relative">
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Change Image 1" class="w-full" />
                            <div v-if="catalogue.image1URL" class="relative mt-2">
                                <img :src="catalogue.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage('image1URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-40">
                        <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="$router.back()" />
                    </div>
                </div>
            </div>
        </div>

        <!-- ======================== -->
        <!-- Birthday Reward Section  -->
        <!-- ======================== -->
        <!-- <div v-if="catalogue.isBirthday === 1" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🎂 Birthday Reward</div>
                </div>

                <div class="p-4 text-gray-600">
                    <div class="mb-4">
                        <label class="block font-bold text-gray-700 mb-1">Reward Type</label>
                        <Dropdown v-model="catalogue.birthdayReward.type" :options="birthdayRewardTypeOptions" optionLabel="label" optionValue="value" placeholder="Select reward type" class="w-full" />
                    </div> -->

        <!-- If Points -->
        <!-- <div v-if="catalogue.birthdayReward.type === 'Points'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Silver Tier Points</label>
                            <InputNumber v-model="catalogue.birthdayReward.points.silver" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Gold Tier Points</label>
                            <InputNumber v-model="catalogue.birthdayReward.points.gold" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Platinum Tier Points</label>
                            <InputNumber v-model="catalogue.birthdayReward.points.platinum" class="w-full" />
                        </div>
                    </div> -->

        <!-- If Reward -->
        <!-- <div v-else-if="catalogue.birthdayReward.type === 'Reward'" class="mt-4">
                        <label class="block font-bold text-gray-700 mb-1">Select Reward Item</label>
                        <Dropdown v-model="catalogue.birthdayReward.itemId" :options="rewardItems" optionLabel="title" optionValue="id" placeholder="Select a reward item" class="w-full" />
                    </div>
                </div>
            </div>
        </div> -->
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const typeOptions = [
    { label: 'E-Wallet', value: 'E-Wallet' },
    { label: 'E-Voucher', value: 'E-Voucher' },
    { label: 'Item', value: 'Item' }
];

const isBirthday = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

const purposeOptions = [
    { label: 'Catalogue', value: 'Catalogue' },
    { label: 'Campaign', value: 'Campaign' },
    { label: 'Game', value: 'Game' }
];

const valueOptions = [
    { label: 'Amount', value: 'Amount' },
    { label: 'Percentage', value: 'Percentage' }
];

const birthdayRewardTypeOptions = [
    { label: 'Points', value: 'Points' },
    { label: 'Reward', value: 'Reward' }
];

const rewardItems = [
    { id: 1, title: 'Touch ’n Go Reload RM20' },
    { id: 2, title: 'Starbucks Voucher RM10' },
    { id: 3, title: 'Grab Food Credit RM15' }
];

/**
 * Catalogue Data
 * PINs are stored decoded (plain text) in `catalogue.value.pins`
 */
const catalogue = ref({
    id: 1,
    type: 'E-Voucher', // or 'E-Voucher'
    image1URL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
    title: 'Touch ’n Go Reload RM20',
    sku: 'TNG20',
    valueType: 'Amount',
    valueAmount: 20,
    description: 'Reload your Touch ’n Go eWallet instantly with RM20 credit.',
    terms: 'Valid for registered TNG accounts only.',
    instruction: 'Provide TNG eWallet number during redemption.',
    point1: 200,
    point2: 180,
    point3: 150,
    purpose: 'Catalogue',
    status: 1,
    expiry: '2025-06-15',
    usedPins: 2,
    totalqty: 5,
    isBirthday: 1,

    // PINs will be stored in plain text
    pins: [],

    birthdayReward: {
        type: 'Points',
        points: {
            silver: 0,
            gold: 0,
            platinum: 0
        },
        itemId: null
    },

    vouchers: [],
    usedVouchers: 0,
    totalVouchers: 0
});

const loading = ref(false);

/**
 * Utility: Encode text to Base64 and remove trailing '='
 */
const encodeBase64NoPadding = (text) => {
    return btoa(text).replace(/=+$/, '');
};

/**
 * Utility: Decode Base64 string safely by adding back '=' padding
 */
const decodeBase64WithPadding = (encoded) => {
    const pad = encoded.length % 4;
    if (pad) {
        encoded += '='.repeat(4 - pad);
    }
    return atob(encoded);
};

/**
 * Computed property:
 * Show encoded PINs in UI while keeping storage plain text
 */
const encodedPins = computed(() => {
    return catalogue.value.pins.map((pin) => ({
        ...pin,
        pin: encodeBase64NoPadding(pin.pin) // Encode only for display
    }));
});

/**
 * Load sample PINs into storage as plain text
 */
const loadPins = () => {
    const decodedRawPins = [
        { id: 1, pin: '1234-5678-9011', pinExpiryDate: '2025-12-31', pinUsedDate: '2025-12-31', pinUsedStatus: true },
        { id: 2, pin: '9876-5432-1098', pinExpiryDate: '2025-11-30', pinUsedDate: '2025-05-22', pinUsedStatus: false },
        { id: 3, pin: '5555-2222-3333', pinExpiryDate: '2025-10-31', pinUsedDate: null, pinUsedStatus: false },
        { id: 4, pin: '3757-5432-5669', pinExpiryDate: '2025-11-30', pinUsedDate: '2025-12-31', pinUsedStatus: true },
        { id: 5, pin: '4444-6666-7777', pinExpiryDate: '2025-11-30', pinUsedDate: null, pinUsedStatus: false }
    ];

    // Store plain text pins
    catalogue.value.pins = decodedRawPins;
};

/**
 * Download pins as plain JSON (decoded)
 */
const downloadPins = () => {
    const dataStr = JSON.stringify(catalogue.value.pins, null, 2); // plain text
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'pins.json';
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Import pins (JSON format)
 */
const importPins = () => {
    alert('Import PIN logic goes here.');
};

onMounted(() => {
    loadPins();
});

// Handle Upload and Remove Image
/**
 * Handle image selection from PrimeVue FileUpload
 * @param {Object} event - PrimeVue FileUpload event
 * @param {String} property - The target property in catalogue (e.g., 'image1URL')
 */
const onImageSelect = (event, property) => {
    const file = event.files ? event.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        catalogue.value[property] = e.target.result; // Update catalogue image preview
    };
    reader.readAsDataURL(file);
};

/**
 * Remove the selected image
 * @param {String} property - The target property in catalogue (e.g., 'image1URL')
 */
const removeImage = (property) => {
    catalogue.value[property] = ''; // or null, depending on your preference
};
</script>
