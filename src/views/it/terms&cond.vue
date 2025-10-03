<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Terms & Conditions</div>

                <!-- T&C Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Toyocares T&C -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Toyocares T&C</label>
                        <Textarea v-model="form.tcTnc" placeholder="Enter Toyocares Terms & Conditions" rows="6" class="w-full" />
                    </div>

                    <!-- ETEN T&C -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">ETEN T&C</label>
                        <Textarea v-model="form.etenTnc" placeholder="Enter ETEN Terms & Conditions" rows="6" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Update" class="w-full p-button-success" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
    tcTnc: '',
    etenTnc: ''
});

const cancel = () => {
    router.push('/it/dashboard'); // adjust route
};

const submitForm = () => {
    if (!form.value.tcTnc || !form.value.etenTnc) {
        alert('⚠️ Both Toyocares and ETEN T&C are required');
        return;
    }

    console.log('✅ Terms & Conditions Updated:', form.value);
    // TODO: API call to update T&C
    // Note: keep last update log in backend
    router.push('/it/dashboard');
};
</script>
