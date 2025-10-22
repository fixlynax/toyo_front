<template>
    <Fluid>
        <div class="card flex flex-col gap-8 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Eten User</div>

            <!-- User Info -->
            <div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">First Name</label>
                        <InputText v-model="form.firstName" class="w-full" placeholder="Enter first name" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Last Name</label>
                        <InputText v-model="form.lastName" class="w-full" placeholder="Enter last name" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Email</label>
                        <InputText v-model="form.email" type="email" class="w-full" placeholder="Enter email" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Mobile No</label>
                        <InputText v-model="form.mobile" class="w-full" placeholder="Enter mobile number" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Password</label>
                        <Password v-model="form.password" :feedback="false" toggleMask class="w-full" placeholder="Enter password" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Confirm Password</label>
                        <Password v-model="form.confirmPassword" :feedback="false" toggleMask class="w-full" placeholder="Confirm password" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Modules -->
        <div class="card flex flex-col gap-8 w-full">
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">🧩 Modules Access</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div v-for="module in moduleOptions" :key="module.value">
                        <Checkbox class="mr-2" v-model="form.modules" :inputId="module.value" :value="module.value" />
                        <label :for="module.value">{{ module.label }}</label>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/detailEten">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/detailEten">
                        <Button label="Submit" class="w-full" />
                    </RouterLink>
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
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: '',
    state: '',
    race: '',
    memberLevel: '',
    password: '',
    confirmPassword: '',
    dealerAcc: '',
    shipToAcc: '',
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    city: '',
    postcode: '',
    shippingState: '',
    country: '',
    modules: []
});

const dealerList = [
    { code: '6080100900', name: 'PS Tyres & Battery Auto Services Sdn. Bhd' },
    { code: '6080102300', name: 'Toyo Auto Centre UHP Tyres Sdn Bhd' },
    { code: '6080102301', name: 'Tek Ming Auto Service Sdn. Bhd.' },
    { code: '6080102302', name: 'Apex Tyre & Car Care' },
    { code: '6080114400', name: 'JS Motorsports Sdn Bhd' },
    { code: '6080125300', name: 'Weng Tat Tyre Service' }
];

const raceOptions = [
    { label: 'Malay', value: 'Malay' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Other', value: 'Other' }
];

const stateOptions = [
    { label: 'Johor', value: 'Johor' },
    { label: 'Kelantan', value: 'Kelantan' },
    { label: 'Kuala Lumpur', value: 'Kuala Lumpur' },
    { label: 'Kedah', value: 'Kedah' },
    { label: 'Melaka', value: 'Melaka' },
    { label: 'Negeri Sembilan', value: 'Negeri Sembilan' },
    { label: 'Pulau Pinang', value: 'Pulau Pinang' },
    { label: 'Pahang', value: 'Pahang' },
    { label: 'Perak', value: 'Perak' },
    { label: 'Perlis', value: 'Perlis' },
    { label: 'Selangor', value: 'Selangor' },
    { label: 'Sabah', value: 'Sabah' },
    { label: 'Sarawak', value: 'Sarawak' },
    { label: 'Terengganu', value: 'Terengganu' }
];

const levelOptions = [
    { label: 'Silver', value: 'Silver' },
    { label: 'Gold', value: 'Gold' },
    { label: 'Platinum', value: 'Platinum' }
];

const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
];

const moduleOptions = [
    { label: 'Marketing', value: 'marketing' },
    { label: 'Technical', value: 'technical' },
    { label: 'OM', value: 'om' },
    { label: 'SCM', value: 'scm' },
    { label: 'IT', value: 'it' },
    { label: 'Billing', value: 'billing' },
    { label: 'Sales', value: 'sales' }
];
</script>
