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
                        <label class="block font-bold text-gray-700">Gender</label>
                        <Dropdown v-model="form.gender" :options="genderOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select gender" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Race</label>
                        <Dropdown v-model="form.race" :options="raceOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select race" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">State</label>
                        <Dropdown v-model="form.state" :options="stateOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select state" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Member Level</label>
                        <Dropdown v-model="form.memberLevel" :options="levelOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select level" />
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

            <!-- Dealer & Shipping -->
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">🏢 Dealer & Shipping</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Dealer Acc No (Bill To)</label>
                        <Dropdown v-model="form.dealerAcc" :options="dealerList" optionLabel="name" optionValue="code" placeholder="Select Dealer" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Ship To Acc No</label>
                        <Dropdown v-model="form.shipToAcc" :options="dealerList" optionLabel="name" optionValue="code" placeholder="Select Ship To" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Shipping Address -->
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">📦 Shipping Address</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Address 1</label>
                        <InputText v-model="form.address1" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address 2</label>
                        <InputText v-model="form.address2" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address 3</label>
                        <InputText v-model="form.address3" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address 4</label>
                        <InputText v-model="form.address4" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">State</label>
                        <Dropdown v-model="form.shippingState" :options="stateOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select state" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">City</label>
                        <InputText v-model="form.city" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Postcode</label>
                        <InputText v-model="form.postcode" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Country</label>
                        <InputText v-model="form.country" class="w-full" />
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
                    <RouterLink to="/om/confirmationEten">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/confirmationEten">
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

const submitForm = () => {
    console.log('Form Submitted:', form.value);
    // Add form validation or API submission here
    router.push('/om/detailUser');
};
</script>
