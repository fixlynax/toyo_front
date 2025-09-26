<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Member Infromation</div>

                        <div class="flex items-center justify-between w-full">
                            <!-- Account No -->
                            <div>
                                <span class="block text-xm font-bold text-black-700">Member Code.</span>
                                <span class="text-lg font-medium">{{ memberDetail.etenUserID }}</span>
                            </div>

                            <!-- Create Button -->
                            <RouterLink to="/marketing/editEtenUser">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">👤 Account Details</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Name</span>
                                <p class="text-lg font-medium">{{ memberDetail.firstName }} {{ memberDetail.lastName }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Gender</span>
                                <p class="text-lg font-medium">{{ memberDetail.gender }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Email</span>
                                <p class="text-lg font-medium">{{ memberDetail.emailAddress }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Password</span>
                                <div class="flex items-center">
                                    <p class="text-lg font-medium mr-2 mb-0">
                                        {{ showPassword ? memberDetail.password : '••••••••' }}
                                    </p>
                                    <!-- Toggle Button -->
                                    <button type="button" @click="showPassword = !showPassword" class="text-gray-500 hover:text-gray-700">
                                        <div class="text-lg font-medium mr-2 mb-0">
                                            <i v-if="showPassword" class="pi pi-eye-slash"></i>
                                            <i v-else class="pi pi-eye"></i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Mobile Number</span>
                                <p class="text-lg font-medium">{{ memberDetail.countryCode }} {{ memberDetail.mobileNumber }}</p>
                            </div>

                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Level</span>
                                <p class="text-lg font-medium">{{ memberDetail.level }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Race</span>
                                <p class="text-lg font-medium">{{ memberDetail.race }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">State</span>
                                <p class="text-lg font-medium">{{ memberDetail.state }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Member Since</span>
                                <p class="text-lg font-medium">{{ memberDetail.memberSince }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Last Login</span>
                                <p class="text-lg font-medium">{{ memberDetail.lastLogin }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/3">
                <!-- Suspend Account -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Account Info</div>
                        <Tag :value="memberDetail.status === 1 ? 'Active' : 'Inactive'" :severity="memberDetail.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Allow Waranty -->
                                <tr class="border-b">
                                    <td className="px-4 py-2 font-medium">Platform</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.platform }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td className="px-4 py-2 font-medium">Allow Warranty</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.allow_warranty ? 'Yes' : 'No' }}</td>
                                </tr>

                                <!-- Allow Order -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow Order</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.allow_order ? 'Yes' : 'No' }}</td>
                                </tr>
                                <!-- Allow Billing -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow Billing</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.allow_billing ? 'Yes' : 'No' }}</td>
                                </tr>

                                <!-- Allow Sale -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow Sale</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.allow_sale ? 'Yes' : 'No' }}</td>
                                </tr>

                                <!-- Allow User -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow user</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.allow_user ? 'Yes' : 'No' }}</td>
                                </tr>

                                <!-- Is Master -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Is Master</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.isMaster ? 'Yes' : 'No' }}</td>
                                </tr>

                                <!-- Activation Code -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Activation Code</td>
                                    <td className="px-4 py-2 text-right">{{ memberDetail.activationCode }}</td>
                                </tr>

                                <!-- Suspend Button -->
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="px-2 py-2 text-right">
                                        <Button :label="isActivated ? 'Un-Activated' : 'Activated'" :severity="isActivated ? 'success' : 'danger'" size="small" @click="confirmSuspend" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Device List -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Devices</div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <tbody>
                                <tr v-for="device in devices" :key="device.id" class="border-b">
                                    <!-- Device info -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2 text-gray-800 font-bold">
                                            <i class="pi pi-tablet text-black-500"></i>
                                            {{ device.name }}
                                        </div>
                                        <div class="ml-6 text-gray-500 text-xs mt-2">
                                            <div>ID: {{ device.uniqueId }}</div>
                                            <div>Active at: {{ device.lastActive }}</div>
                                        </div>
                                    </td>

                                    <!-- Action -->
                                    <td class="px-4 py-3 text-right align-top">
                                        <Button :label="device.isBlocked ? 'Un-block' : 'Block'" :severity="device.isBlocked ? 'success' : 'danger'" size="small" @click="toggleBlock(device)" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
    memberCode: 'E346572',
    custAccountNo: '6080100900',
    companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    companyName2: '',
    companyName3: '',
    companyName4: '',
    companyRegNo: 'MY123456789',
    salesTaxNo: 'SST123456',
    serviceTaxNo: 'STX120987',
    tinNo: '1256734321',
    vatNo: '0976213456',
    addressLine1: '123 Toyo Road',
    addressLine2: 'Toyo Industrial Park',
    addressLine3: '',
    addressLine4: '',
    city: 'Kuala Lumpur',
    postcode: '50000',
    state: 'Kuala Lumpur',
    country: 'Malaysia',
    mapLatitude: '3.1390',
    mapLongitude: '101.6869',
    phoneNumber: '+60 3-1234 5678',
    mobilreNumber: '+60 19-1234 567',
    emailAddress: 'sales@toyotires.com.my',
    accountType: 'Retailer',
    priceGroup: 'A',
    priceProcedure: 'Standard',
    customerAccountGroup: 'Group1',
    customerCondGrp: 'Cond1',
    paymentTerms: 'NET 30',
    riskCategory: 'Low',
    creditLimit: 50000,
    pricelist: '01',
    signboardType: 'T10',
    signboardBrand: 'Toyo',
    salesOffice: 'Kuala Lumpur',
    salesDistrict: 'Central',
    shippingCond: 'RE',
    accountCreation: '2023-01-15',
    showOnList: 1,
    ifFamilyChannel: 0,
    allowLalamove: 1,
    startingSalesAmt: 1000,
    status: 0
});

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

// 1. Suspend/Un-Activated
const isActivated = ref(false);
const confirmSuspend = () => {
    isActivated.value = !isActivated.value;
};

// 2. Block/Un-block Device List
const devices = ref([
    {
        id: 1,
        name: 'Windows Laptop',
        uniqueId: '00008030-001E3D400043402E',
        lastActive: '8/9/2025 10:54 pm',
        isBlocked: true
    }
]);

const toggleBlock = (device) => {
    device.isBlocked = !device.isBlocked;
};

const users = ref([
    { id: 'U001', name: 'John Doe', phone: '0123456789', account: '6080100900', lastLogin: '11/9/2025 8:00am', status: 1 },
    { id: 'U002', name: 'Jane Smith', phone: '0198765432', account: '6080100901', lastLogin: '10/9/2025 8:00am', status: 1 },
    { id: 'U003', name: 'Alex Tan', phone: '0172233445', account: '6080100902', lastLogin: '23/7/2025 8:00am', status: 0 },
    { id: 'U004', name: 'Siti Aminah', phone: '0111122233', account: '6080100903', lastLogin: '09/9/2025 8:00am', status: 1 },
    { id: 'U005', name: 'Michael Lee', phone: '0139988776', account: '6080100904', lastLogin: '07/8/2025 8:00am', status: 0 }
]);

const billingDocs = ref([
    { id: 1, name: 'Invoice #001', type: 'Invoice' },
    { id: 2, name: 'Credit Note #100', type: 'CN' },
    { id: 3, name: 'Debit Note #200', type: 'DN' },
    { id: 4, name: 'SOA Jan 2025', type: 'SOA Statement' },
    { id: 5, name: 'Refund Note #10', type: 'Refund Note' }
]);

const viewDoc = (doc) => {
    console.log('Viewing billing document:', doc);
};

// 4. Finance Documents
const financeDocs = ref([
    { id: 1, name: 'Payment Receipt' },
    { id: 2, name: 'Tax Certificate' },
    { id: 3, name: 'Bank Statement' },
    { id: 4, name: 'Audit Report' },
    { id: 5, name: 'Financial Summary' }
]);

const viewFinance = (doc) => {
    console.log('Viewing finance document:', doc);
};

const manageUser = (user) => {
    console.log('Managing user:', user);
};

const shiptoList = ref([
    {
        id: 1,
        companyName1: 'Tan Know Car Tires',
        companyName2: '',
        companyName3: '',
        companyName4: '',
        addressLine1: 'Lot 123, Jalan Sungai',
        addressLine2: 'Seksyen 15',
        addressLine3: '',
        addressLine4: '',
        city: 'Shah Alam',
        state: 'Selangor',
        postcode: '40150',
        country: 'Malaysia',
        phoneNumber: '03-55123456',
        mobileNumber: '012-3456789',
        emailAddress: 'info@toyotires.my'
    },
    {
        id: 2,
        companyName1: 'Shiro Auto Parts',
        companyName2: 'Warehouse Division',
        companyName3: '',
        companyName4: '',
        addressLine1: 'No 45, Jalan Merdeka',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        postcode: '50450',
        country: 'Malaysia',
        phoneNumber: '03-98765432',
        mobileNumber: '019-8765432',
        emailAddress: 'contact@shiroauto.com'
    }
]);
</script>
