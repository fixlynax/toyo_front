<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="flex items-center justify-between border-b pb-2">
                            <div class="flex items-center space-x-3">
                                <RouterLink to="/om/listEten">
                                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                                </RouterLink>

                                <div class="text-2xl font-bold text-gray-800">Member Information</div>
                            </div>

                            <RouterLink to="/om/editEtenUser">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div class="font-semibold text-xl pb-2">👤 Account Details</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Member Code</span>
                                <p class="text-lg font-medium">
                                    {{ memberDetail.etenUserID }}
                                    <span v-if="memberDetail.isMaster === 1" class="font-bold">(Master)</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Name</span>
                                <p class="text-lg font-medium">{{ memberDetail.firstName }} {{ memberDetail.lastName }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Mobile Number</span>
                                <p class="text-lg font-medium">(+{{ memberDetail.countryCode }} ) {{ memberDetail.mobileNumber }}</p>
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
                    </div>
                </div>
                <!-- <div class="card mt-6">
                    <div class="flex items-center justify-between border-b pb-4 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Shipping Details</div>
                    </div>
                    <div class="mt-8 flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-xm font-bold text-black-700">Member Code</span>
                            <p class="text-lg font-medium">{{ memberDetail.shi }}</p>
                        </div>
                    </div>
                </div> -->
            </div>
            <div class="md:w-1/3">
                <div class="card flex flex-col w-full p-4">
                    <!-- Title -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Module</div>
                    </div>
                    <!-- Module List with Toggles -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">Marketing</span>
                            <ToggleSwitch disabled v-model="modules.marketing" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">OM</span>
                            <ToggleSwitch disabled v-model="modules.om" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">Technical</span>
                            <ToggleSwitch disabled v-model="modules.technical" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">SCM</span>
                            <ToggleSwitch disabled v-model="modules.scm" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">IT</span>
                            <ToggleSwitch disabled v-model="modules.it" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">Billing</span>
                            <ToggleSwitch disabled v-model="modules.billing" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-700">Sales</span>
                            <ToggleSwitch disabled v-model="modules.sales" class="custom-toggle" />
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col border-b w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-3">
                        <div class="text-2xl font-bold text-gray-800">Devices</div>
                        <div class="flex justify-end">
                            <RouterLink to="/om/manageDevices">
                                <Button label="Manage All Devices" icon="pi pi-tablet" size="small" class="!py-1 !px-3 text-sm" />
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Table -->
                    <div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <tbody>
                                    <tr v-for="device in [...devices].sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive)).slice(0, 5)" :key="device.id" class="border-b">
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
                                            <Button disabled :label="device.isBlocked ? 'Un-block' : 'Block'" :severity="device.isBlocked ? 'success' : 'danger'" size="small" class="!py-1 !px-2 text-xs w-fit" @click="toggleBlock(device)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
const modules = ref({
    marketing: true,
    om: true,
    technical: false,
    scm: false,
    it: false,
    billing: true,
    sales: true
});

const memberDetail = ref({
    id: 10,
    etenUserID: 'EU1010',
    countryCode: '60',
    mobileNumber: '1890123456',
    password: 'passowrd 123',
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
    isMaster: 1,
    device: 'Windows Laptop',
    platform: 'Web',
    fcmToken: 'fcm_token_10',
    status: 1,
    activated: 1,
    custaccountno: '6020201500',
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
    },
    {
        id: 2,
        name: 'MacBook Pro',
        uniqueId: '00008120-00A2BC1234567890',
        lastActive: '10/21/2025 11:22 am',
        isBlocked: false
    },
    {
        id: 3,
        name: 'iPhone 15 Pro',
        uniqueId: '00008030-00F1C2D3E4B5A6',
        lastActive: '10/18/2025 9:47 pm',
        isBlocked: false
    },
    {
        id: 4,
        name: 'Android Tablet',
        uniqueId: 'TAB-4C3D2B1A900',
        lastActive: '10/15/2025 4:20 pm',
        isBlocked: true
    },
    {
        id: 5,
        name: 'Office PC',
        uniqueId: 'PC-5B6C7D8E9F00',
        lastActive: '9/28/2025 3:14 pm',
        isBlocked: false
    },
    {
        id: 6,
        name: 'Windows Desktop',
        uniqueId: '00008020-001E3D400043402E',
        lastActive: '10/22/2025 8:05 am',
        isBlocked: false
    },
    {
        id: 7,
        name: 'iPad Air',
        uniqueId: '00008040-00B1E2C3D4A5F6',
        lastActive: '10/21/2025 9:10 pm',
        isBlocked: true
    },
    {
        id: 8,
        name: 'Samsung Galaxy S24',
        uniqueId: 'AND-9X8Y7Z6W5V4U',
        lastActive: '10/22/2025 12:15 am',
        isBlocked: false
    },
    {
        id: 9,
        name: 'Workstation PC',
        uniqueId: 'PC-9F8E7D6C5B4A',
        lastActive: '10/20/2025 2:30 pm',
        isBlocked: false
    },
    {
        id: 10,
        name: 'Surface Pro 9',
        uniqueId: '00008030-001E3D4000AA11',
        lastActive: '10/19/2025 6:35 pm',
        isBlocked: false
    }
]);

const toggleBlock = (device) => {
    device.isBlocked = !device.isBlocked;
};
</script>
<style scoped>
/* --- Disabled OFF --- */
:deep(.custom-toggle.p-disabled:not(.p-toggleswitch-checked) .p-toggleswitch-slider) {
    background-color: #f87171; /* lighter red */
    opacity: 0.8;
    cursor: not-allowed;
}

/* --- Disabled ON --- */
:deep(.custom-toggle.p-disabled.p-toggleswitch-checked .p-toggleswitch-slider) {
    background-color: #22c55e; /* lighter green */
    opacity: 0.8;
    cursor: not-allowed;
}

/* Disabled knob */
:deep(.custom-toggle.p-disabled .p-toggleswitch-slider:before) {
    background-color: #f9fafb;
    opacity: 0.9;
}

/* Disable hover for disabled */
:deep(.custom-toggle.p-disabled .p-toggleswitch-slider:hover) {
    filter: none;
}
</style>
