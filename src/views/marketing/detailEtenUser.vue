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
                                <span class="block text-sm text-gray-500">Member Code.</span>
                                <span class="text-lg font-medium">{{ memberDetail.etenUserID }}</span>
                            </div>

                            <!-- Create Button -->
                            <RouterLink to="/om/confirmationEten">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">🏢 Company Details</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Company Registration No</span>
                                <p class="text-lg font-medium">{{ form.companyRegNo }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Company Name 1</span>
                                <p class="text-lg font-medium">{{ form.companyName1 }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Company Name 2</span>
                                <p class="text-lg font-medium">{{ form.companyName2 || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Company Name 3</span>
                                <p class="text-lg font-medium">{{ form.companyName3 || '-' }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Company Name 4</span>
                                <p class="text-lg font-medium">{{ form.companyName4 || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Sales Tax No</span>
                                <p class="text-lg font-medium">{{ form.salesTaxNo }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Service Tax No</span>
                                <p class="text-lg font-medium">{{ form.serviceTaxNo }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">TIN No</span>
                                <p class="text-lg font-medium">{{ form.tinNo }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Vat No</span>
                                <p class="text-lg font-medium">{{ form.vatNo }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">📍 Address & Contact Details</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Address Line 1</span>
                                <p class="text-lg font-medium">{{ form.addressLine1 }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Address Line 2</span>
                                <p class="text-lg font-medium">{{ form.addressLine2 }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Address Line 3</span>
                                <p class="text-lg font-medium">{{ form.addressLine3 || '-' }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Address Line 4</span>
                                <p class="text-lg font-medium">{{ form.addressLine4 || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">City</span>
                                <p class="text-lg font-medium">{{ form.city }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Postcode</span>
                                <p class="text-lg font-medium">{{ form.postcode }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">State</span>
                                <p class="text-lg font-medium">{{ form.state }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Country</span>
                                <p class="text-lg font-medium">{{ form.country }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Map Latitude</span>
                                <p class="text-lg font-medium">{{ form.mapLatitude }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Map Longitude</span>
                                <p class="text-lg font-medium">{{ form.mapLongitude }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Phone No</span>
                                <p class="text-lg font-medium">{{ form.phoneNumber }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Email</span>
                                <p class="text-lg font-medium">{{ form.emailAddress }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">👤 Account Details</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Account Type</span>
                                <p class="text-lg font-medium">{{ form.accountType }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Payment Terms</span>
                                <p class="text-lg font-medium">{{ form.paymentTerms }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Risk Category</span>
                                <p class="text-lg font-medium">{{ form.riskCategory }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Credit Limit</span>
                                <p class="text-lg font-medium">{{ form.creditLimit }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Customer Account Group</span>
                                <p class="text-lg font-medium">{{ form.customerAccountGroup }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Customer Condition Group</span>
                                <p class="text-lg font-medium">{{ form.customerCondGrp }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">💲 Pricing & Sales Info</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Price List</span>
                                <p class="text-lg font-medium">{{ form.pricelist }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Price Group</span>
                                <p class="text-lg font-medium">{{ form.priceGroup }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Price Procedure</span>
                                <p class="text-lg font-medium">{{ form.priceProcedure }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Sales Office</span>
                                <p class="text-lg font-medium">{{ form.salesOffice }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Sales District</span>
                                <p class="text-lg font-medium">{{ form.salesDistrict }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Starting Sales Amount</span>
                                <p class="text-lg font-medium">{{ form.startingSalesAmt }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">🚚 Shipping & Delivery</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Shipping Condition</span>
                                <p class="text-lg font-medium">{{ form.shippingCond }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Allow Lalamove</span>
                                <p class="text-lg font-medium">{{ form.allowLalamove ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">🪧 Signboard / Branding</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Signboard Type</span>
                                <p class="text-lg font-medium">{{ form.signboardType }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Signboard Brand</span>
                                <p class="text-lg font-medium">{{ form.signboardBrand ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/3">
                <!-- Suspend Account -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Account Status</div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Terms -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Terms</td>
                                    <td class="px-4 py-2 text-right">NET30</td>
                                </tr>

                                <!-- Risk Category -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Risk Category</td>
                                    <td class="px-4 py-2 text-right">
                                        <span class="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded"> Low </span>
                                    </td>
                                </tr>

                                <!-- Credit Limit -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Credit Limit</td>
                                    <td class="px-4 py-2 text-right">50,000</td>
                                </tr>

                                <!-- Status -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Status</td>
                                    <td class="px-4 py-2 text-right">
                                        <span class="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded"> <i class="pi pi-check-circle mr-1"></i> Active </span>
                                    </td>
                                </tr>

                                <!-- Suspend Button -->
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="px-2 py-2 text-right">
                                        <Button :label="isSuspended ? 'Un-suspend' : 'Suspend'" :severity="isSuspended ? 'success' : 'danger'" size="small" @click="confirmSuspend" />
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

                <!-- Finance Document -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Documents</div>

                    <!-- Document Items -->
                    <div class="space-y-3">
                        <!-- Billing -->
                        <div class="flex items-center justify-between px-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-blue-500"></i>
                                <span>Billing</span>
                            </div>
                            <RouterLink to="/billing">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Account Details -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-green-500"></i>
                                <span>Account Details</span>
                            </div>
                            <RouterLink to="/account-details">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Staff Billing -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-purple-500"></i>
                                <span>Staff Billing</span>
                            </div>
                            <RouterLink to="/staff-billing">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Statement -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-pink-500"></i>
                                <span>Statement</span>
                            </div>
                            <RouterLink to="/statement">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Finance Document -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-orange-500"></i>
                                <span>Finance Document</span>
                            </div>
                            <RouterLink to="/finance-document">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Suspend Account -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">User List</div>
                    <!-- User Table -->
                    <DataTable :value="users" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- Combined Column -->
                        <Column header="User Info" style="min-width: 1rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.name }}</span>
                                    <span class="text-gray-600 text-xs mt-2">👨🏻‍💻 {{ data.account }}</span>
                                    <span class="text-gray-600 text-xs">📞 {{ data.phone }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column field="lastLogin" header="Last Login" style="min-width: 8rem"></Column>

                        <!-- Status Column -->
                        <Column header="Status" style="min-width: 6rem">
                            <template #body="{ data }">
                                <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Ship To</div>

                <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                    <!-- Columns -->
                    <Column field="companyName1" header="Company Name" style="min-width: 12rem" />
                    <Column header="Address" style="min-width: 16rem">
                        <template #body="{ data }">
                            {{ data.addressLine1 }}<br />
                            <span v-if="data.addressLine2">{{ data.addressLine2 }}<br /></span>
                            <span v-if="data.addressLine3">{{ data.addressLine3 }}<br /></span>
                            <span v-if="data.addressLine4">{{ data.addressLine4 }}</span>
                            {{ data.city }}, {{ data.state }} {{ data.postcode }}<br />
                            {{ data.country }}
                        </template>
                    </Column>

                    <Column field="phoneNumber" header="Phone No" style="min-width: 10rem" />
                    <Column field="emailAddress" header="Email" style="min-width: 14rem" />
                </DataTable>
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

// 1. Suspend/Un-suspend
const isSuspended = ref(false);
const confirmSuspend = () => {
    isSuspended.value = !isSuspended.value;
};

// 2. Block/Un-block Device List
const devices = ref([
    {
        id: 1,
        name: 'iPhone 16',
        uniqueId: '00008030-001E3D400043402E',
        lastActive: '8/9/2025 10:54 pm',
        isBlocked: false
    },
    {
        id: 2,
        name: 'Samsung Galaxy',
        uniqueId: 'a8098c1a-f86e-11da-bd1a-00112444be1e',
        lastActive: '8/9/2025 5:13 pm',
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
