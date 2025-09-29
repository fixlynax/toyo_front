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
                        <label class="block text-xm font-bold text-gray-700 mb-2">Tire Size</label>
                        <Dropdown 
                            v-model="form.tyreSize" 
                            :options="tireSizeOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            placeholder="Select Tire Size" 
                            class="w-full" 
                        />
                    </div>

                    <!-- Tire Pattern -->
                    <div class="md:col-span-2">
                        <label class="block text-xm font-bold text-gray-700 mb-2">Tire Pattern</label>
                        <Dropdown 
                            v-model="form.pattern" 
                            :options="tirePatternOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            placeholder="Select Tire Pattern" 
                            class="w-full" 
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-xm font-bold text-gray-700 mb-2">Description</label>
                        <InputText 
                            v-model="form.desc" 
                            class="w-full" 
                            placeholder="Enter Description Here..." 
                        />
                    </div>

                    <!-- MFG Code -->
                    <div>
                        <label class="block text-xm font-bold text-gray-700 mb-2">MFG Code</label>
                        <InputText 
                            v-model="form.mfgcode" 
                            class="w-full" 
                            placeholder="Enter MFG Code Here..." 
                        />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button 
                            label="Cancel" 
                            class="w-full p-button-secondary" 
                            @click="cancel" 
                        />
                    </div>
                    <div class="w-32">
                        <Button 
                            label="Save Tire" 
                            class="w-full p-button-success" 
                            @click="saveTire" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Router instance
const router = useRouter();

// Form state
const form = ref({
    tyreSize: '',
    pattern: '',
    desc: '',
    mfgcode: '',
    stock: 0,
    image1URL: '',
    image2URL: '',
    image3URL: ''
});

// =======================
// Tire Size Options
// =======================
const tireSizeOptions = [
    { label: '165/65R14', value: '165/65R14' },
    { label: '175/70R14', value: '175/70R14' },
    { label: '185/65R15', value: '185/65R15' },
    { label: '195/60R15', value: '195/60R15' },
    { label: '205/55R16', value: '205/55R16' },
    { label: '215/60R16', value: '215/60R16' },
    { label: '225/65R17', value: '225/65R17' },
    { label: '235/55R18', value: '235/55R18' },
    { label: '245/45R19', value: '245/45R19' },
    { label: '265/70R17', value: '265/70R17' },
    { label: '275/65R18', value: '275/65R18' },
    { label: '295/80R22.5', value: '295/80R22.5' },
    { label: '315/80R22.5', value: '315/80R22.5' }
];

// =======================
// Tire Pattern Options
// =======================
const tirePatternOptions = [
    { label: 'All-Season', value: 'All-Season' },
    { label: 'Highway Terrain (H/T)', value: 'Highway Terrain (H/T)' },
    { label: 'Mud Terrain (M/T)', value: 'Mud Terrain (M/T)' },
    { label: 'All Terrain (A/T)', value: 'All Terrain (A/T)' },
    { label: 'Performance', value: 'Performance' },
    { label: 'Touring', value: 'Touring' },
    { label: 'Eco/Low Rolling Resistance', value: 'Eco/Low Rolling Resistance' },
    { label: 'Directional', value: 'Directional' },
    { label: 'Symmetric', value: 'Symmetric' },
    { label: 'Asymmetric', value: 'Asymmetric' },
    { label: 'Winter/Snow', value: 'Winter/Snow' },
    { label: 'Commercial/Heavy Duty', value: 'Commercial/Heavy Duty' }
];

// =======================
// Cancel and go back
// =======================
const cancel = () => {
    router.push('/technical/twpTireList');
};

// =======================
// Save Tire
// =======================
const saveTire = () => {
    console.log('Tire saved:', form.value);
    // TODO: Add API call to save tire data
};
</script>
