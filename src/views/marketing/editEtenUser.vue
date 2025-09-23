<template>
    <Fluid>
        <!-- Edit User Section -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit User</div>

                <!-- User Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-medium text-gray-700">Member Code</label>
                        <InputText disabled v-model="memberDetail.etenUserID" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">First Name</label>
                        <InputText v-model="memberDetail.firstName" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Last Name</label>
                        <InputText v-model="memberDetail.lastName" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Country Code</label>
                        <InputText v-model="memberDetail.countryCode" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Mobile Number</label>
                        <InputText v-model="memberDetail.mobileNumber" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Gender</label>
                        <Dropdown v-model="memberDetail.gender" :options="genderOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Race</label>
                        <Dropdown v-model="memberDetail.race" :options="raceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">State</label>
                        <Dropdown v-model="memberDetail.state" :options="stateOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Level</label>
                        <Dropdown v-model="memberDetail.level" :options="levelOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Email</label>
                        <InputText v-model="memberDetail.emailAddress" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Password</label>
                        <div class="flex items-center">
                            <InputText :type="showPassword ? 'text' : 'password'" v-model="memberDetail.password" class="w-full" />
                            <button type="button" @click="showPassword = !showPassword" class="ml-2 text-gray-500 hover:text-gray-700">
                                <div class="text-lg font-medium">
                                    <i v-if="showPassword" class="pi pi-eye-slash"></i>
                                    <i v-else class="pi pi-eye"></i>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Member Since</label>
                        <Calendar disabled v-model="memberDetail.memberSince" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Last Login</label>
                        <Calendar disabled v-model="memberDetail.lastLogin" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                </div>
                <!-- ✅ closes Edit User grid -->
            </div>
        </div>

        <!-- Account Info Section -->
        <div class="flex flex-col md:flex-row gap-8 mt-6">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Account Info</div>

                <!-- Account Info Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-medium text-gray-700">Platform</label>
                        <Dropdown v-model="memberDetail.platform" :options="platformOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700">Allow Waranty</label>
                        <Dropdown v-model="memberDetail.allow_warranty" :options="selectOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700">Allow Oder</label>
                        <Dropdown v-model="memberDetail.allow_order" :options="selectOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700">Allow Billing</label>
                        <Dropdown v-model="memberDetail.allow_billing" :options="selectOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700">Allow Sale</label>
                        <Dropdown v-model="memberDetail.allow_sale" :options="selectOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700">Allow User</label>
                        <Dropdown v-model="memberDetail.allow_user" :options="selectOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700">Is Master</label>
                        <Dropdown v-model="memberDetail.isMaster" :options="selectOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                     <div>
                        <label class="block font-medium text-gray-700">Activation Code</label>
                        <InputText disabled v-model="memberDetail.activationCode"class="w-full" />
                    </div>
                </div>
                <!-- ✅ closes Account Info grid -->


                <!-- Submit -->
                <div class="flex justify-end mt-2">
                    <div class="w-40">
                        <RouterLink to="/marketing/detailEtenUser">
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

const platformOptions = [
    { label: 'Web', value: 'Web' },
    { label: 'Android', value: 'Android' },
    { label: 'Huawei', value: 'Huawei' },
    { label: 'Iphone', value: 'Iphone' }
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

const selectOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];


const memberDetail = ref({
    id: 10,
    etenUserID: 'EU1010',
    countryCode: '60',
    mobileNumber: '1890123456',
    password: 'hashed_pw_10',
    firstName: 'Faizal',
    lastName: 'Rahman',
    emailAddress: 'faizal.rahman@toyotires.com.my',
    gender: 'Male',
    race: 'Malay',
    state: 'Sabah',
    level: 'Silver',
    memberSince: '2025-04-20',
    lastLogin: '2025-08-01 12:05:00',
    allow_warranty: 0,
    allow_order: 1,
    allow_billing: 0,
    allow_sale: 1,
    allow_user: 0,
    activationCode: 'ACT01234',
    isMaster: 0,
    device: 'Windows Laptop',
    platform: 'Web',
    fcmToken: 'fcm_token_10',
    status: 1,
    activated: 1,
    created: '2025-04-20',
    deleted: 0
});

const showPassword = ref(false);


</script>
