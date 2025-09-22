<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Game</div>

                <!-- Game Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Title</label>
                        <InputText v-model="game.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Description</label>
                        <Textarea v-model="game.desc" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-medium text-gray-700">Location</label>
                            <InputText v-model="game.location" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700">Start Date</label>
                            <Calendar v-model="game.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700">End Date</label>
                            <Calendar v-model="game.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Quota Player</label>
                        <InputNumber v-model="game.quota" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Type Game</label>
                        <Dropdown v-model="game.type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-medium text-gray-700 mb-2">Game Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="relative">
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Change Image 1" class="w-full" />
                            <div v-if="game.image1URL" class="relative mt-2">
                                <img :src="game.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-60" />
                                <button @click="removeImage('image1URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">&times;</button>
                            </div>
                        </div>
                        <div class="relative">
                            <FileUpload mode="basic" name="image2" accept="image/*" customUpload @select="onImageSelect($event, 'image2URL')" chooseLabel="Change Image 2" class="w-full" />
                            <div v-if="game.image2URL" class="relative mt-2">
                                <img :src="game.image2URL" alt="Preview 2" class="rounded-lg shadow-md object-cover w-full h-60" />
                                <button @click="removeImage('image2URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">&times;</button>
                            </div>
                        </div>
                        <div class="relative">
                            <FileUpload mode="basic" name="image3" accept="image/*" customUpload @select="onImageSelect($event, 'image3URL')" chooseLabel="Change Image 3" class="w-full" />
                            <div v-if="game.image3URL" class="relative mt-2">
                                <img :src="game.image3URL" alt="Preview 3" class="rounded-lg shadow-md object-cover w-full h-60" />
                                <button @click="removeImage('image3URL')" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prize Section -->
                <div>
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">🏆 Prize Section</div>
                        <Button icon="pi pi-plus" label="Add Prize" style="width: fit-content" class="p-button-success p-button-sm" :disabled="prizes.length >= 10" @click="addPrize" />
                    </div>

                    <div v-if="prizes.length > 0" class="space-y-4">
                        <div v-for="(prize, index) in prizes" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <div class="flex items-center justify-between mb-3">
                                <label class="font-semibold">Prize {{ index + 1 }}</label>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removePrize(index)" />
                            </div>

                            <!-- Prize Type -->
                            <div class="mb-3">
                                <label class="block font-medium text-gray-700">Prize Type</label>
                                <Dropdown v-model="prize.type" :options="prizeTypes" optionLabel="label" optionValue="value" class="w-full" />
                            </div>

                            <!-- Prize Inputs -->
                            <div v-if="prize.type === 'Point'">
                                <label class="block font-medium text-gray-700">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="text-sm">Silver</label>
                                        <InputNumber v-model="prize.value.silver" class="w-full" />
                                    </div>

                                    <div>
                                        <label class="text-sm">Gold</label>
                                        <InputNumber v-model="prize.value.gold" class="w-full" />
                                    </div>

                                    <div>
                                        <label class="text-sm">Platinum</label>
                                        <InputNumber v-model="prize.value.platinum" class="w-full" />
                                    </div>
                                </div>
                                
                                <div class="mt-3">
                                    <label class="block">Prize Quota</label>
                                    <InputNumber v-model="prize.quota" class="w-full" />
                                </div>
                            </div>

                            <div v-if="prize.type === 'Item'">
                                <label class="block font-medium text-gray-700">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />

                                <label class="block font-medium text-gray-700">Prize Value</label>
                                <InputText v-model="prize.value" class="w-full mb-2" />

                                <label class="block font-medium text-gray-700">Prize Quota</label>
                                <InputNumber v-model="prize.quota" class="w-full" />
                            </div>

                            <div v-if="prize.type === 'E-Voucher'">
                                <label class="block">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />

                                <label class="block">Prize Value</label>
                                <InputText v-model="prize.value" class="w-full mb-2" />

                                <label class="block">Prize Quota</label>
                                <InputNumber v-model="prize.quota" class="w-full mb-3" />

                                <div class="flex flex-col gap-2 w-full">
                                    <label>Upload E-Voucher Code</label>
                                    <div class="flex gap-4">
                                        <FileUpload mode="basic" name="excel" accept=".xlsx,.xls" chooseLabel="Upload Excel" class="p-button-sm" />
                                        <Button icon="pi pi-download" label="Download Excel" class="p-button-sm p-button-outlined" />
                                    </div>
                                </div>
                            </div>

                            <div v-if="prize.type === 'E-Wallet'">
                                <label class="block">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />

                                <label class="block">Prize Value</label>
                                <InputText v-model="prize.value" class="w-full mb-2" />

                                <label class="block">Prize Quota</label>
                                <InputNumber v-model="prize.quota" class="w-full mb-3" />

                                <div class="flex flex-col gap-2 w-full">
                                    <label>Upload E-Wallet Pin</label>
                                    <div class="flex gap-4">
                                        <FileUpload mode="basic" name="excel" accept=".xlsx,.xls" chooseLabel="Upload Excel" class="p-button-sm" />
                                        <Button icon="pi pi-download" label="Download Excel" class="p-button-sm p-button-outlined" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-gray-500 italic">No prizes added yet.</div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8">
                    <div class="w-40">
                        <RouterLink to="/marketing/detailGame">
                            <Button label="Update" class="w-full" />
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
    { label: 'Spin', value: 'Spin' },
    { label: 'Random', value: 'Random' }
];

const prizeTypes = [
    { label: 'Point', value: 'Point' },
    { label: 'Item', value: 'Item' },
    { label: 'E-Wallet', value: 'E-Wallet' },
    { label: 'E-Voucher', value: 'E-Voucher' }
];

const game = ref({
    id: 1,
    title: 'Toyo Tires Lucky Spin',
    desc: 'Spin the wheel and win exclusive prizes sponsored by Toyo Tires!',
    location: 'Kuala Lumpur Convention Centre',
    startDate: '2025-03-01',
    endDate: '2025-03-10',
    quota: 200,
    type: 'Spin',
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg'
});

const prizes = ref([
    { type: 'Point', name: 'Bonus Points', value: { silver: 50, gold: 100, platinum: 200 }, quota: 100 },
    { type: 'Item', name: 'Toyo Cap', value: 'Cap', quota: 50 },
    { type: 'E-Wallet', name: 'GrabPay Credit', value: 'RM10', quota: 30 },
    { type: 'E-Voucher', name: 'Lazada Voucher', value: 'RM20', quota: 20 }
]);

const addPrize = () => {
    prizes.value.push({ type: '', name: '', value: '', quota: '' });
};
const removePrize = (index) => {
    prizes.value.splice(index, 1);
};

const onImageSelect = (eventFile, field) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            game.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
const removeImage = (property) => {
    game.value[property] = null;
};
</script>
