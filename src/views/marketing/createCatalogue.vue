<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Catalogue</div>

                <!-- Type & Is Birthday -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Type</label>
                        <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select a type" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Is Birthday?</label>
                        <Dropdown v-model="catalogue.isBirthday" :options="isBirthdayOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                    </div>

                    <div v-if="catalogue.type === 'Item' || catalogue.type === 'E-Voucher'">
                        <label class="block font-bold text-gray-700 mb-1">Quantity</label>
                        <InputNumber placeholder="Enter quantity" class="w-full" />
                    </div>

                    <div v-if="catalogue.type === 'E-Voucher'">
                        <label class="block font-bold text-gray-700 mb-1">Provider</label>
                        <InputText placeholder="Enter provider name" class="w-full" />
                    </div>
                </div>
                <!-- catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <!-- Purpose To & Expiry -->
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
                    <div>
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
            </div>
        </div>
        <div v-if="catalogue.type === 'Point'" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🪙 Point Add</div>
                </div>

                <!-- 3-Column Input Section -->
                <div class="mt-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="silverpoint" class="block font-bold text-gray-700 mb-1">Silver Point</label>
                            <InputNumber id="silverpoint" showButtons min="0" class="w-full" />
                        </div>

                        <div>
                            <label for="goldpoint" class="block font-bold text-gray-700 mb-1">Gold Point</label>
                            <InputNumber id="goldpoint" showButtons min="0" class="w-full" />
                        </div>

                        <div>
                            <label for="plantinumpoint" class="block font-bold text-gray-700 mb-1">Plantinum Point</label>
                            <InputNumber id="plantinumpoint" showButtons min="0" class="w-full" />
                        </div>
                    </div>
                    <!-- Submit Buttons (Default position) -->
                    <div v-if="catalogue.type !== 'E-Wallet' && catalogue.type !== 'E-Voucher'" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="$router.back()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="catalogue.purpose === 'Catalogue' && catalogue.type !== 'Point'" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🪙 Cost Redeem</div>
                </div>

                <!-- 3-Column Input Section -->
                <div class="mt-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="silverpoint" class="block font-bold text-gray-700 mb-1">Silver Point</label>
                            <InputNumber id="silverpoint" showButtons min="0" class="w-full" />
                        </div>

                        <div>
                            <label for="goldpoint" class="block font-bold text-gray-700 mb-1">Gold Point</label>
                            <InputNumber id="goldpoint" showButtons min="0" class="w-full" />
                        </div>

                        <div>
                            <label for="plantinumpoint" class="block font-bold text-gray-700 mb-1">Plantinum Point</label>
                            <InputNumber id="plantinumpoint" showButtons min="0" class="w-full" />
                        </div>
                    </div>
                    <!-- Submit Buttons (Default position) -->
                    <div v-if="catalogue.type !== 'E-Wallet' && catalogue.type !== 'E-Voucher'" class="flex justify-end mt-8 gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="$router.back()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ======================== -->
        <!-- E-Wallet PIN Section     -->
        <!-- ======================== -->
        <div v-if="catalogue.type === 'E-Wallet' || catalogue.type === 'E-Voucher'" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🔑 List PIN</div>
                </div>

                <DataTable :value="catalogue.pins" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
                    <template #header>
                        <div class="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                            <div class="flex gap-4 w-full md:w-auto">
                                <div class="w-32">
                                    <label class="block font-bold text-gray-700 mb-1">Total</label>
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
                <!-- Submit Buttons (For E-Wallet & E-Voucher) -->
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
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

/* Dropdown Options */
const typeOptions = [
    { label: 'E-Wallet', value: 'E-Wallet' },
    { label: 'E-Voucher', value: 'E-Voucher' },
    { label: 'Item', value: 'Item' },
    { label: 'Point', value: 'Point' }
];

const isBirthdayOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

const purposeOptions = [
    { label: 'Catalogue', value: 'Catalogue' },
    { label: 'Campaign', value: 'Campaign' },
    { label: 'Game', value: 'Game' }
];
/* Catalogue State */
const catalogue = ref({
    title: '',
    sku: '',
    description: '',
    terms: '',
    instruction: '',
    purpose: '',
    expiry: null,
    type: '',
    isBirthday: 0,
    image1URL: null,

    // E-Wallet Data
    pins: [],
    usedPins: 0,
    totalqty: 0,

    // E-Voucher Data
    vouchers: [],
    usedVouchers: 0,
    totalVouchers: 0,

    // Item Data
    valueAmount: 20,

    // Birthday Reward
    birthdayReward: {
        type: 'Points',
        points: {
            silver: 0,
            gold: 0,
            platinum: 0
        },
        itemId: null
    },

    // Redeem Cost
    point1: 0,
    point2: 0,
    point3: 0
});

const loading = ref(false);

/* Image Handlers */
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

/* E-Wallet Actions */
const downloadPins = () => {
    console.log('Downloading PINs for', catalogue.value.title);
};

const importPins = () => {
    console.log('Importing PINs for', catalogue.value.title);
    // Example mock PIN
    catalogue.value.pins.push({
        id: catalogue.value.pins.length + 1,
        pin: '1234-5678-ABCD',
        expiry: '2025-12-31',
        used: null,
        status: false
    });
    catalogue.value.totalqty = catalogue.value.pins.length;
};

/* E-Voucher Actions */
const downloadVouchers = () => {
    console.log('Downloading vouchers for', catalogue.value.title);
};

const importVouchers = () => {
    console.log('Importing vouchers for', catalogue.value.title);
    // Example mock voucher
    catalogue.value.vouchers.push({
        id: catalogue.value.vouchers.length + 1,
        code: 'VOUCHER-' + (catalogue.value.vouchers.length + 1),
        expiry: '2025-12-31',
        usedDate: null,
        status: 'Available'
    });
    catalogue.value.totalVouchers = catalogue.value.vouchers.length;
};
</script>
