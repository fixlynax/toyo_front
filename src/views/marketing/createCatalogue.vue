<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Catalogue</div>

                <!-- Catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Title</label>
                        <InputText v-model="catalogue.title" class="w-full" placeholder="Enter catalogue title" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Description</label>
                        <Textarea v-model="catalogue.description" class="w-full" placeholder="Enter catalogue description" />
                    </div>

                    <!-- Terms and Instruction -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700">Terms</label>
                            <Textarea v-model="catalogue.terms" class="w-full" placeholder="Enter terms and conditions" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700">Instruction</label>
                            <Textarea v-model="catalogue.instruction" class="w-full" placeholder="Enter redemption instructions" />
                        </div>
                    </div>

                    <!-- Type, SKU, Quantity -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Type</label>
                            <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select a type" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">SKU</label>
                            <InputText v-model="catalogue.sku" class="w-full" placeholder="Enter SKU" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Quantity</label>
                            <InputNumber v-model="catalogue.totalqty" class="w-full" placeholder="Enter quantity" />
                        </div>
                    </div>

                    <!-- Purpose and Purpose ID -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Purpose To</label>
                            <Dropdown v-model="catalogue.purpose" :options="purposeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>

                        <!-- Conditional Purpose ID Dropdown -->
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Purpose For</label>

                            <!-- Game List -->
                            <Dropdown
                                v-if="catalogue.purpose === 'Game'"
                                v-model="catalogue.purposeID"
                                :options="gameList"
                                optionLabel="title"
                                optionValue="id"
                                :placeholder="catalogue.purpose ? 'Select Game' : 'Please Select Purpose For'"
                                class="w-full"
                            />

                            <!-- Campaign List -->
                            <Dropdown
                                v-else-if="catalogue.purpose === 'Campaign'"
                                v-model="catalogue.purposeID"
                                :options="campaignList"
                                optionLabel="title"
                                optionValue="id"
                                :placeholder="catalogue.purpose ? 'Select Campaign' : 'Please Select Purpose For'"
                                class="w-full"
                            />

                            <!-- Catalogue List -->
                            <Dropdown
                                v-else-if="catalogue.purpose === 'Catalogue'"
                                v-model="catalogue.purposeID"
                                :options="CatalogueList"
                                optionLabel="title"
                                optionValue="id"
                                :placeholder="catalogue.purpose ? 'Select Catalogue' : 'Please Select Purpose For'"
                                class="w-full"
                            />

                            <!-- Default message if no purpose is selected -->
                            <Dropdown v-else disabled placeholder="Please Select Purpose For" class="w-full" />
                        </div>
                    </div>

                    <!-- Value Type & Amount (Only if E-Voucher) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2" v-if="catalogue.type === 'E-Voucher'">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Value Type</label>
                            <Dropdown v-model="catalogue.valueType" :options="valueOptions" optionLabel="label" optionValue="value" placeholder="Select value type" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Value Amount</label>
                            <InputNumber v-model="catalogue.valueAmount" class="w-full" placeholder="Enter amount" />
                        </div>
                    </div>

                    <!-- Expiry, Publish Date, Birthday Reward -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Expiry Date</label>
                            <Calendar v-model="catalogue.expiry" class="w-full" placeholder="Select expiry date" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700">Publish Date</label>
                            <Calendar v-model="catalogue.publishDate" class="w-full" placeholder="Select publish date" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Birthday Reward</label>
                            <Dropdown v-model="catalogue.isBirthday" :options="birthdayOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                    </div>

                    <!-- Points -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Silver Point</label>
                            <InputNumber v-model="catalogue.point1" class="w-full" placeholder="Enter silver point" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Gold Point</label>
                            <InputNumber v-model="catalogue.point2" class="w-full" placeholder="Enter gold point" />
                        </div>
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Platinum Point</label>
                            <InputNumber v-model="catalogue.point3" class="w-full" placeholder="Enter platinum point" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-medium text-gray-700 mb-2">Catalogue Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="relative">
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Upload Image 1" class="w-full" />
                            <div v-if="catalogue.image1URL" class="relative mt-2">
                                <img :src="catalogue.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage('image1URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-2">
                    <div class="w-40">
                        <Button label="Save" class="w-full" @click="saveCatalogue" />
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
    { label: 'E-Voucher', value: 'E-Voucher' },
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

// Default empty catalogue object for creation
const catalogue = ref({
    title: '',
    description: '',
    terms: '',
    instruction: '',
    type: '',
    sku: '',
    totalqty: null,
    purpose: '',
    purposeID: null,
    valueType: '',
    valueAmount: null,
    expiry: '',
    publishDate: '',
    isBirthday: 0,
    point1: null,
    point2: null,
    point3: null,
    image1URL: ''
});

const campaignList = ref([
    { id: 1, title: 'Campaign 1' },
    { id: 2, title: 'Campaign 2' },
    { id: 3, title: 'Campaign 3' }
]);

const gameList = ref([
    { id: 1, title: 'Game 1' },
    { id: 2, title: 'Game 2' },
    { id: 3, title: 'Game 3' }
]);

const CatalogueList = ref([
    { id: 1, title: 'Catalogue 1' },
    { id: 2, title: 'Catalogue 2' },
    { id: 3, title: 'Catalogue 3' }
]);

// Image upload preview
const onImageSelect = (event, property) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        catalogue.value[property] = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Remove image
const removeImage = (property) => {
    catalogue.value[property] = '';
};

// Save action
const saveCatalogue = () => {
    console.log('Catalogue saved:', catalogue.value);
    alert('Catalogue saved successfully!');
};
</script>
