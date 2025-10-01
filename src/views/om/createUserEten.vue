<template>
    <Fluid>
        <div class="card flex flex-col gap-8 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Eten User</div>

            <!-- User Info -->
            <div>  
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Name</label>
                        <InputText v-model="form.name" class="w-full" placeholder="Enter full name" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Email</label>
                        <InputText v-model="form.email" type="email" class="w-full" placeholder="Enter email" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Mobile No</label>
                        <InputText v-model="form.mobile" class="w-full" placeholder="Enter mobile number" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Gender</label>
                        <Dropdown v-model="form.gender" :options="genderOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Race</label>
                        <Dropdown v-model="form.race" :options="raceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">State</label>
                        <Dropdown v-model="form.state" :options="stateOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700"> Member Level</label>
                        <Dropdown v-model="form.level" :options="levelOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Security -->
            <div>
                <h3 class="text-xl font-semibold border-b p-2 text-gray-700 mb-4">🔑 Security</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Password</label>
                        <Password v-model="form.password" :feedback="false" toggleMask class="w-full" placeholder="Enter password" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Confirm Password</label>
                        <Password v-model="form.confirmPassword" :feedback="false" toggleMask class="w-full" placeholder="Confirm password" />
                    </div>
                </div>
            </div>

            <!-- Dealer & Shipping -->
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">🏢 Dealer & Shipping</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Dealer Acc No (Bill To)</label>
                        <Dropdown v-model="form.dealerAcc" :options="dealerList" optionLabel="name" optionValue="code" placeholder="Select Dealer" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Ship To Acc No</label>
                        <Dropdown v-model="form.shipToAcc" :options="dealerList" optionLabel="name" optionValue="code" placeholder="Select Ship To" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Shipping Address -->
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">📦 Shipping Address</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputText v-model="form.address1" class="w-full" placeholder="Address 1" />
                    <InputText v-model="form.address2" class="w-full" placeholder="Address 2" />
                    <InputText v-model="form.address3" class="w-full" placeholder="Address 3" />
                    <InputText v-model="form.address4" class="w-full" placeholder="Address 4" />
                    <InputText v-model="form.city" class="w-full" placeholder="City" />
                    <InputText v-model="form.postcode" class="w-full" placeholder="Postcode" />
                    <InputText v-model="form.state" class="w-full" placeholder="State" />
                    <InputText v-model="form.country" class="w-full" placeholder="Country" />
                </div>
            </div>

            <!-- Modules -->
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">🧩 Modules Access</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div><Checkbox v-model="form.modules" inputId="marketing" value="marketing" /> <label for="marketing">Marketing</label></div>
                    <div><Checkbox v-model="form.modules" inputId="technical" value="technical" /> <label for="technical">Technical</label></div>
                    <div><Checkbox v-model="form.modules" inputId="om" value="om" /> <label for="om">OM</label></div>
                    <div><Checkbox v-model="form.modules" inputId="scm" value="scm" /> <label for="scm">SCM</label></div>
                    <div><Checkbox v-model="form.modules" inputId="it" value="it" /> <label for="it">IT</label></div>
                    <div><Checkbox v-model="form.modules" inputId="billing" value="billing" /> <label for="billing">Billing</label></div>
                    <div><Checkbox v-model="form.modules" inputId="sales" value="sales" /> <label for="sales">Sales</label></div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end mt-6">
                <RouterLink to="/marketing/detailEvent">
                    <Button label="➕ Add User" class="p-button-success" @click="submitForm" />
                </RouterLink>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
    name: '',
    email: '',
    mobile: '',
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
    state: '',
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
    { label: 'Kuala Lumpur', value: 'Lumpur' },
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
    { label: 'Plantinum', value: 'Plantinum' }
];

const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
];

const submitForm = () => {
    console.log('Form Submitted:', form.value);
};
</script>

<style scoped>
.card {
    @apply bg-white shadow-md rounded-xl p-6;
}
</style>
