<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Back Order Detail</div>

                        <div class="flex items-center justify-between w-full">
                            <!-- Account No -->
                            <div>
                                <span class="block text-sm text-gray-500">Customer Account No.</span>
                                <span class="text-lg font-medium">{{ order.custAccountNo }}</span>
                            </div>

                            <!-- Create Button -->
                            <RouterLink to="/om/editEten">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">Dealer Information</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Eten User LIst Id</span>
                                <p class="text-lg font-medium">{{ order.etenUserListID }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Eten Id</span>
                                <p class="text-lg font-medium">{{ order.etenUserID || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Name</span>
                                <p class="text-lg font-medium">{{ order.shipTo || '-' }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Distribution Channel</span>
                                <p class="text-lg font-medium">{{ order.distributionChannel || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Order Date</span>
                                <p class="text-lg font-medium">{{ order.deliveryDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Expiry</span>
                                <p class="text-lg font-medium">{{ order.expiry }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">Tire Material & Description</div>

                       <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Tyre Size</span>
                                <p class="text-lg font-medium">{{ tyre.size }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Tyre Spec</span>
                                <p class="text-lg font-medium">{{ tyre.tyrespec || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Rim Diameter</span>
                                <p class="text-lg font-medium">{{ tyre.rimDiameter || '-' }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Aspect Ratio</span>
                                <p class="text-lg font-medium">{{ tyre.aspectRatio || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Section Width</span>
                                <p class="text-lg font-medium">{{ tyre.sectionWidth }}</p>
                            </div>
                        </div>

                       <div class="font-semibold text-xl border-b pb-2 mt-8">🚚 Shipping & Description</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Ship To</span>
                                <p class="text-lg font-medium">{{ order.shipTo }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Description</span>
                                <p class="text-lg font-medium">{{ order.orderDesc }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Shipping Cond</span>
                                <p class="text-lg font-medium">{{ order.shippingCond }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Delivery Type</span>
                                <p class="text-lg font-medium">{{ order.deliveryType }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Delivery Date</span>
                                <p class="text-lg font-medium">{{ order.deliveryDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">BO Order No</span>
                                <p class="text-lg font-medium">{{ order.boOrderNo }}</p>
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

const order = ref({
                id: 1,
                etenUserListID: 'U12345',
                etenUserID: 'U67890',
                custAccountNo: 'CUST001',
                salesOrg: 'SO001',
                distributionChannel: 'ETEN',
                division: 'DIV01',
                priceGroup: 'PG01',
                sapOrderType: 'NORMAL',
                customerCondGrp: 'CCG1',
                shipTo: 'Customer A',
                shippingCond: 'Standard',
                storageLocation: 'LOC01',
                orderDesc: 'Order for electronics',
                channel: 'ETEN',
                deliveryType: 'DELIVER',
                deliveryDate: '2023-10-15',
                boOrderNo: 'BO1001',
                backOrderArray: [],
                fulfillArray: [],
                orderStatus: 1,
                expiry: '2023-11-15',
                created: '2023-10-01',
                modified: '2023-10-05'
            },);

const tyre = ref({
                id: 1,
                warrantyRegisterID: 1001,
                pattern: 'Proxes T1R',
                rimDiameter: 17,
                aspectRatio: '45',
                sectionWidth: '215',
                tyreSize: '215/45R17',
                loadIndex: '91',
                plyRating: 'XL',
                deleted: null,
                status: 'Non-Waranty',
                size: '215/45R17',
                origin: 'Japan',
                desc: 'High-performance tire for sports cars',
                mfgcode: 'MFG-2025-001',
                tyresize: 'Passenger Car',
                tyrespec: '91W',
                weekcode: '3524'
            },);    

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
    { id: 'U002', name: 'Jane Smith', phone: '0198765432', account: '6080100901', lastLogin:  '10/9/2025 8:00am', status: 1 },
    { id: 'U003', name: 'Alex Tan', phone: '0172233445', account: '6080100902', lastLogin:  '23/7/2025 8:00am', status: 0 },
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
