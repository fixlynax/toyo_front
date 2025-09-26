<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Add TWP Tire</div>

                <!-- Tire Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Tire Size -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Tire Size</label>
                        <InputText v-model="form.tyreSize" placeholder="e.g., 215/60R16" class="w-full" />
                    </div>

                    <!-- Tire Pattern -->
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Tire Pattern</label>
                        <InputText v-model="form.pattern" placeholder="e.g., All-Terrain" class="w-full" />
                    </div>

                    <!-- Tire Type -->
                    <div>
                        <label class="block font-medium text-gray-700">Tire Type</label>
                        <Dropdown v-model="form.type" :options="tireTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Type" class="w-full" />
                    </div>

                    <!-- Stock Quantity -->
                    <div>
                        <label class="block font-medium text-gray-700">Stock Quantity</label>
                        <InputNumber v-model="form.stock" class="w-full" placeholder="0" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Save Tire" class="w-full p-button-success" @click="saveTire" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ListTyreService } from '@/service/listProduct';

const router = useRouter();

const form = ref({
    tyreSize: '',
    pattern: '',
    type: '',
    stock: 0,
    image1URL: '',
    image2URL: '',
    image3URL: ''
});

const tireTypeOptions = [
    { label: 'Passenger Car', value: 'Passenger Car' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Truck', value: 'Truck' },
    { label: 'Bus', value: 'Bus' }
];

// Cancel and go back
const cancel = () => {
    router.push('/technical/twpTireList');
};
</script>
