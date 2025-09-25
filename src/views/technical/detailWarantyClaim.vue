<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Waranty Infromation</div>

                        <div class="flex items-center justify-between w-full">
                            <!-- Account No -->
                            <div>
                                <span class="block text-sm text-gray-500">Refrence Number.</span>
                                <span class="text-lg font-medium">{{ warantyDetail.refNo }}</span>
                            </div>

                            <!-- Create Button -->
                            <RouterLink to="/marketing/editEtenUser">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">👤Dealer Information</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerName }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Code</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.dealerCode }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Contact Person</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactPerson }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Contact Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactNo }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Claim Type</span>
                                <p class="text-lg font-medium">{{ warantyDetail.claimType }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">CTC Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.summary.ctcNo }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Scrap Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.summary.scrapNo }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Invoice Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.summary.invoiceNo }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">👤Customer Information</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Customer Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.customerInfo.name }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Vehicle</span>
                                <p class="text-lg font-medium">{{ warantyDetail.customerInfo.vehicle }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Registration Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.customerInfo.regNo }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Damage Code</span>
                                <p class="text-lg font-medium">{{ warantyDetail.problem.damageCode }}</p>
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
                        <div class="text-2xl font-bold text-gray-800">Tires Details</div>
                        <!-- <Tag :value="memberDetail.status === 1 ? 'Active' : 'Inactive'" :severity="memberDetail.status === 1 ? 'success' : 'danger'" /> -->
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Allow Waranty -->
                                <tr class="border-b">
                                    <td className="px-4 py-2 font-medium">Size</td>
                                    <td className="px-4 py-2 text-right">{{ warantyDetail.tires.size }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td className="px-4 py-2 font-medium">Pattern</td>
                                    <td className="px-4 py-2 text-right">{{ warantyDetail.tires.pattern }}</td>
                                </tr>

                                <!-- Allow Order -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Serial Number</td>
                                    <td className="px-4 py-2 text-right">{{ warantyDetail.tires.serialNo }}</td>
                                </tr>
                                <!-- Allow Billing -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Thread Depths Tire 1</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[0] }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Thread Depths Tire 2</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[1] }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Thread Depths Tire 3</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[2] }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Thread Depths Tire 4</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[3] }}</td>
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

const warantyDetail = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    dealerName: 'AutoWorld KL',
    claimType: 'Tire Defect',
    status: 0, // Pending
    summary: {
        ctcNo: 'CTC-2025-001',
        scrapNo: 'SCR-8765',
        invoiceNo: 'INV-4567'
    },
    dealerInfo: {
        dealerCode: 'DLR-001',
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789'
    },
    customerInfo: {
        name: 'Lee Wei Ming',
        vehicle: 'Toyota Hilux 2.8G',
        regNo: 'WXY 4567'
    },
    tires: {
        size: '265/65R17',
        pattern: 'Open Country A/T',
        serialNo: 'TYR-99887766',
        treadDepths: [6.5, 6.7, 6.6, 6.4]
    },
    problem: {
        issue: 'Sidewall crack within 6 months of purchase',
        photos: ['https://example.com/images/sidewall_damage.jpg'],
        damageCode: 'D-102 (Sidewall Separation)'
    },
    ctcDetails: {
        ctcNo: 'CTC-2025-001',
        status: 'Pending Review'
    },
    scrapDetails: {
        scrapNo: 'SCR-8765',
        status: 'Pending Photo Upload'
    },
    claimVariable: {
        amount: 'RM 450.00',
        replacementType: 'Partial'
    },
    replacementOrder: {
        orderNo: 'ORD-5566',
        item: 'Open Country A/T (1 pc)'
    },
    reimbursement: {
        approvedAmount: 'RM 300.00',
        status: 'Pending'
    },
    report: {
        file: 'CLM-2025-001-Report.pdf'
    }
});

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
