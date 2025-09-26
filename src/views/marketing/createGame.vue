<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Game</div>

                <!-- Game Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="game.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="game.desc" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Location</label>
                            <InputText v-model="game.location" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="game.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="game.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Quota Player</label>
                        <InputNumber v-model="game.quota" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Type Game</label>
                        <Dropdown v-model="game.type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Game Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image1" accept="image/*" customUpload @select="onImageSelect($event, 'image1URL')" chooseLabel="Upload Image 1" class="w-full" />
                            <img v-if="game.image1URL" :src="game.image1URL" alt="Preview 1" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                        </div>
                        <div>
                            <FileUpload mode="basic" name="image2" accept="image/*" customUpload @select="onImageSelect($event, 'image2URL')" chooseLabel="Upload Image 2" class="w-full" />
                            <img v-if="game.image2URL" :src="game.image2URL" alt="Preview 2" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
                        </div>
                        <div>
                            <FileUpload mode="basic" name="image3" accept="image/*" customUpload @select="onImageSelect($event, 'image3URL')" chooseLabel="Upload Image 3" class="w-full" />
                            <img v-if="game.image3URL" :src="game.image3URL" alt="Preview 3" class="mt-2 rounded-lg shadow-md object-cover w-full h-60" />
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
                                <label class="block font-bold text-gray-700">Prize Type</label>
                                <Dropdown v-model="prize.type" :options="prizeTypes" optionLabel="label" optionValue="value" class="w-full" />
                            </div>

                            <!-- Prize Fields -->
                            <div v-if="prize.type === 'Point'">
                                <label class="block font-bold text-gray-700">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="text-sm text-gray-600">Silver</label>
                                        <InputNumber v-model="prize.value.silver" class="w-full" />
                                    </div>
                                    <div>
                                        <label class="text-sm text-gray-600">Gold</label>
                                        <InputNumber v-model="prize.value.gold" class="w-full" />
                                    </div>
                                    <div>
                                        <label class="text-sm text-gray-600">Platinum</label>
                                        <InputNumber v-model="prize.value.platinum" class="w-full" />
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block font-bold text-gray-700">Prize Quota</label>
                                    <InputNumber v-model="prize.quota" class="w-full" />
                                </div>
                            </div>

                            <div v-if="prize.type === 'Item'">
                                <label class="block font-bold text-gray-700">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />

                                <label class="block font-bold text-gray-700">Prize Value</label>
                                <InputText v-model="prize.value" class="w-full mb-2" />

                                <label class="block font-bold text-gray-700">Prize Quota</label>
                                <InputNumber v-model="prize.quota" class="w-full" />
                            </div>

                            <div v-if="prize.type === 'E-Voucher'">
                                <label class="block font-bold text-gray-700">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />

                                <label class="block font-bold text-gray-700">Prize Value</label>
                                <InputText v-model="prize.value" class="w-full mb-2" />

                                <label class="block font-bold text-gray-700">Prize Quota</label>
                                <InputNumber v-model="prize.quota" class="w-full mb-3" />

                                <div class="flex flex-col items-start gap-2 w-full">
                                    <label class="font-bold text-gray-700">Upload E-Voucher Code</label>
                                    <div class="flex gap-4">
                                        <FileUpload mode="basic" name="excel" accept=".xlsx,.xls" chooseLabel="Upload Excel" class="p-button-sm" />
                                        <Button icon="pi pi-download" label="Download Excel" class="p-button-sm p-button-outlined" />
                                    </div>
                                </div>
                            </div>

                            <div v-if="prize.type === 'E-Wallet'">
                                <label class="block font-bold text-gray-700">Prize Name</label>
                                <InputText v-model="prize.name" class="w-full mb-2" />

                                <label class="block font-bold text-gray-700">Prize Value</label>
                                <InputText v-model="prize.value" class="w-full mb-2" />

                                <label class="block font-bold text-gray-700">Prize Quota</label>
                                <InputNumber v-model="prize.quota" class="w-full mb-3" />

                                <div class="flex flex-col items-start gap-2 w-full">
                                    <label class="font-bold text-gray-700">Upload E-Wallet Pin</label>
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
                        <Button label="Submit" class="w-full" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const game = ref({
    title: '',
    desc: '',
    location: '',
    startDate: '',
    endDate: '',
    quota: '',
    type: 'Spin',
    image1URL: '',
    image2URL: '',
    image3URL: ''
});

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

const prizes = ref([]);

const addPrize = () => {
    prizes.value.push({
        type: '',
        name: '',
        value: '',
        quota: ''
    });
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

const submitForm = () => {
    console.log('Game Data:', game.value);
    console.log('Prizes:', prizes.value);
};
</script>
