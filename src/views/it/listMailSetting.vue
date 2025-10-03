<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Mail Push Setting</div>

                <!-- Email Push Toggles -->
                <div class="flex flex-col gap-6">
                    <div 
                        v-for="mail in mailOptions" 
                        :key="mail.value" 
                        class="border rounded-lg p-4 flex flex-col gap-4"
                    >
                        <!-- Toggle Row -->
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-800">{{ mail.label }}</span>
                            <InputSwitch 
                                v-model="form.mails[mail.value].enabled" 
                                @change="handleToggle(mail.value)" 
                            />
                        </div>

                        <!-- Show fields only if ON -->
                        <div v-if="form.mails[mail.value].enabled" class="grid grid-cols-1 gap-4">
                            <!-- Email Address -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <InputText 
                                    v-model="form.mails[mail.value].email" 
                                    placeholder="Enter recipient email" 
                                    class="w-full" 
                                />
                            </div>

                            <!-- Shipping Point -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Shipping Point</label>
                                <InputText 
                                    v-model="form.mails[mail.value].shippoint" 
                                    placeholder="Enter shipping point" 
                                    class="w-full" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Save" class="w-full p-button-primary" @click="save" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';

const router = useRouter();

const form = ref({
    mails: {
        CTC: { enabled: false, email: '', shippoint: '' },
        SCRAP: { enabled: false, email: '', shippoint: '' },
    }
});

const mailOptions = [
    { label: 'Customer Technical Complaint (CTC)', value: 'CTC' },
    { label: 'Scrap Claim', value: 'SCRAP' }
];

// Handle toggle logic (if you want exclusive modes later)
const handleToggle = (mail) => {
    // Example: add logic if some emails should be exclusive
    console.log(`Toggled ${mail}`);
};

const save = () => {
    console.log('Saving mail push config:', form.value);
    // TODO: API call to save
    router.push('/it/mailPushSetting');
};
</script>
