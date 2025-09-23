<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Catalogue</div>

                <!-- catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Title</label>
                        <InputText v-model="catalogue.title" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Description</label>
                        <Textarea v-model="catalogue.description" class="w-full" />
                    </div>

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

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700">Type</label>
                            <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select a type" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700 mb-1">SKU</label>
                            <InputText v-model="catalogue.sku" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Quantity</label>
                            <InputNumber v-model="catalogue.totalqty" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <!-- Purpose Dropdown -->
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Purpose</label>
                            <Dropdown v-model="catalogue.purpose" :options="purposeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>

                        <!-- Purpose ID Dropdown (Dynamic) -->
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Purpose ID</label>

                            <!-- Show Game List -->
                            <Dropdown v-if="catalogue.purpose === 'Game'" v-model="catalogue.purposeID" :options="gameList" optionLabel="title" optionValue="id" placeholder="Select Game" class="w-full" />

                            <!-- Show Campaign List -->
                            <Dropdown v-else-if="catalogue.purpose === 'Campaign'" v-model="catalogue.purposeID" :options="campaignList" optionLabel="title" optionValue="id" placeholder="Select Campaign" class="w-full" />

                            <!-- Show Catalogue List -->
                            <Dropdown v-else-if="catalogue.purpose === 'Catalogue'" v-model="catalogue.purposeID" :options="CatalogueList" optionLabel="title" optionValue="id" placeholder="Select Catalogue" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2" v-if="catalogue.type === 'E-Voucher'">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Value Type</label>
                            <Dropdown v-model="catalogue.valueType" :options="valueOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Value Amount</label>
                            <InputNumber v-model="catalogue.valueAmount" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Expiry Date</label>
                            <Calendar v-model="catalogue.expiry" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700">Publish Date</label>
                            <Calendar v-model="catalogue.publishDate" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Birthday Reward</label>
                            <Dropdown v-model="catalogue.isBirthday" :options="birthdayOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                    </div>
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

                <!-- Upload Images -->
                <div>
                    <label class="block font-medium text-gray-700 mb-2">Catalogue Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Image 1 -->
                        <div class="relative">
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Change Image 1" class="w-full" />
                            <div v-if="catalogue.image1URL" class="relative mt-2">
                                <img :src="catalogue.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <!-- Remove button -->
                                <button @click="removeImage('image1URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-2">
                    <div class="w-40">
                        <RouterLink to="/marketing/detailcatalogue">
                            <Button v-if="catalogue.status === 0" label="Save" class="w-full" />
                            <Button v-else-if="catalogue.status === 1 || catalogue.status === 2" label="Update" class="w-full" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const typeOptions = [
    { label: 'E-Wallet', value: 'E-Wallet' },
    { label: 'Voucher', value: 'Voucher' },
    { label: 'Item', value: 'Item' }
];

const purposeOptions = [
    { label: 'Catalogue', value: 'Catalogue' },
    { label: 'Campaign', value: 'Campaign' },
    { label: 'Game', value: 'Game' }
];

const birthdayOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

const valueOptions = [
    { label: 'Amount', value: 'Amount' },
    { label: 'Percentage', value: 'Percentage' }
];

// This can be used to store multiple catalogues if needed

const catalogue = ref({
    id: 1,
    type: 'E-Voucher',
    image1URL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
    image2URL: '/demo/images/event-toyo-1.jpg',
    image3URL: '/demo/images/event-toyo-1.jpg',
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
    purposeID: 'CAT001',
    totalqty: 500,
    availableqty: 420,
    expiry: '2025-12-31',
    isBirthday: 0,
    status: 1,
    created: '2025-01-01',
    deleted: 0,
    publishDate: '2025-06-15'
});

const campaignList = ref([
    {
        id: 1,
        title: 'Campaign 1'
    },
    {
        id: 2,
        title: 'Campaign 2'
    },
    {
        id: 3,
        title: 'Campaign 3'
    }
]);

const gameList = ref([
    {
        id: 1,
        title: 'Game 1'
    },
    {
        id: 2,
        title: 'Game 2'
    },
    {
        id: 3,
        title: 'Game 3'
    }
]);

const CatalogueList = ref([
    {
        id: 1,
        title: 'CatalogueL 1'
    },
    {
        id: 2,
        title: 'CatalogueL 2'
    },
    {
        id: 3,
        title: 'CatalogueL 3'
    }
]);
// Existing methods...
const onImageSelect = (event, property) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        catalogue.value[property] = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = (property) => {
    catalogue.value[property] = null; // or '' if preferred
};
</script>
