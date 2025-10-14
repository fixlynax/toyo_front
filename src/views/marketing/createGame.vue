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
            </div>
        </div>

        <!-- 🏆 Prize Section -->
        <div class="card flex flex-col w-full mt-8">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-xl font-bold text-gray-800">🏆 Prize Section</div>
            </div>

            <div v-if="prizes.length > 0" class="space-y-4">
                <div v-for="(prize, index) in prizes" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-3">
                        <label class="font-semibold">Prize {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removePrize(index)" />
                    </div>

                    <!-- Prize & Quantity Side by Side -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <!-- Select Prize (2/3) -->
                        <div class="md:col-span-2">
                            <label class="block font-bold text-gray-700 mb-1">Select Prize</label>
                            <Dropdown v-model="prize.selected" :options="listPrize" optionLabel="prizeName" placeholder="Select a prize" class="w-full">
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
                                        <img :src="slotProps.value.imageURL" class="w-8 h-8 object-cover rounded" />
                                        <div>
                                            <span class="font-semibold text-gray-800">{{ slotProps.value.prizeName }}</span>
                                            <small class="block text-gray-500">{{ slotProps.value.prizeType }}</small>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400">Select Prize</span>
                                </template>
                            </Dropdown>
                        </div>

                        <!-- Quantity (1/3 with FloatLabel) -->
                        <div class="w-full">
                            <FloatLabel>
                                <InputNumber id="qty" v-model="prize.qty" :min="1" class="w-full" />
                                <label for="qty">Quantity</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No prizes added yet.</div>

            <!-- Add Prize Button -->
            <div class="flex justify-start mt-4">
                <Button icon="pi pi-plus" label="Add Prize" style="width: fit-content" class="p-button-success p-button-sm" :disabled="prizes.length >= 10" @click="addPrize" />
            </div>

            <!-- Submit -->
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

// 🎁 Prize List Dropdown Data
const listPrize = ref([
    { id: 1, imageURL: '/demo/images/bonus-point.png', prizeName: 'Bonus Point Toyo', prizeType: 'Point', prizeQuota: 50, prizeRemain: 20 },
    { id: 2, imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg', prizeName: 'MYR 50 E-Wallet', prizeType: 'E-Wallet', prizeQuota: 100, prizeRemain: 40 },
    { id: 3, imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp', prizeName: 'Shopee E-Voucher', prizeType: 'E-Voucher', prizeQuota: 30, prizeRemain: 10 },
    { id: 4, imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s', prizeName: 'Toyo Tumbler', prizeType: 'Item', prizeQuota: 15, prizeRemain: 5 }
]);

const prizes = ref([]);

const addPrize = () => {
    prizes.value.push({
        selected: null,
        qty: 1
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
    console.log('Selected Prizes:', prizes.value);
};
</script>
