<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-2/3 flex flex-col">
            <!-- HEADER -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center gap-2 border-b pb-2 mb-4">
                    <RouterLink to="/scm/listCollection">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                    </RouterLink>
                    <div class="text-2xl font-bold text-gray-800">CTC Details</div>
                </div>

                <!-- CUSTOMER INFO -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div class="md:col-span-2">
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div class="md:col-span-2 mb-4">
                                <span class="block text-sm font-bold text-gray-800">Customer Acc No</span>
                                <p class="font-medium font-semibold text-lg">{{ paramData.accno }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Company Name</span>
                                <p class="font-medium text-lg">{{ paramData.CompanyName }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Address</span>
                                <p class="font-medium text-lg">{{ paramData.dealerInfo.dealerLoc }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Contact No</span>
                                <p class="font-medium text-lg">{{ paramData.customerContactNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Name</span>
                                <p class="font-medium text-lg">{{ paramData.customerName }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- COLLECTION ITEMS -->
            <div class="card">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Collection Items</div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 font-bold">Tire Type</th>
                                <th class="px-4 py-2 font-bold text-right">Quantity</th>
                                <th class="px-4 py-2 font-bold text-right">Condition</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2">Passenger Car Tires</td>
                                <td class="px-4 py-2 text-right">4</td>
                                <td class="px-4 py-2 text-right">
                                    <Tag value="Good" severity="success" />
                                </td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2">Light Truck Tires</td>
                                <td class="px-4 py-2 text-right">2</td>
                                <td class="px-4 py-2 text-right">
                                    <Tag value="Worn" severity="warning" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🚚 Pickup Information</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Request Date</td>
                                <td class="px-4 py-2 text-right">CTC</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">3PL Name</td>
                                <td class="px-4 py-2 text-right">{{ paramData.accno }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">ETA Date/Time</td>
                                <td class="px-4 py-2 text-right">{{ paramData.companyName }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="mt-4 flex justify-end items-center gap-2">
                        <Button label="Update Collection Schedule" size="small" class="p-button-primary w-40" />
                        <Button label="Update Collection Complete" size="small" class="p-button-success w-40" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';

const showCalendar = ref(false);
const showStatusDialog = ref(false);
const selectedDate = ref(null);
const selectedStatus = ref(null);

// today + current time → ensures only future date/time is valid
const today = new Date();

// Status options for dropdown
const statusOptions = ref([
    { label: 'Pending', value: 0 },
    { label: 'Completed', value: 1 }
]);

// Computed properties for status display
const statusText = computed(() => {
    const status = paramData.value.status;
    return statusOptions.value.find((option) => option.value === status)?.label || 'Unknown';
});

const statusClass = computed(() => {
    const status = paramData.value.status;
    switch (status) {
        case 0: // Pending
            return 'bg-yellow-100 text-yellow-800';
        case 1: // Completed
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
});

// Format the schedule date for display
const formattedSchedule = computed(() => {
    const date = new Date(paramData.value.collectSchedule);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});

const reschedule = () => {
    if (selectedDate.value && selectedDate.value > new Date()) {
        console.log('New schedule selected:', selectedDate.value);

        paramData.value.collectSchedule = selectedDate.value.toISOString();
        showCalendar.value = false;
    } else {
        alert('Please select a future date & time!');
    }
};

const updateStatus = () => {
    if (selectedStatus.value !== null) {
        console.log('Status updated to:', selectedStatus.value);
        paramData.value.status = selectedStatus.value;
        showStatusDialog.value = false;
    } else {
        alert('Please select a status!');
    }
};

const paramData = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    accno: '66010341222',
    collectDate: '2025-09-07',
    collectTime: '3:00PM',
    requestDate: '3:00PM',
    etaDateTime: '3:00PM',
    customerContactNo: '0123456789',
    CompanyName: 'HUH DUH NU UH',
    customerName: 'Zakir Turun',
    dealerName: 'AutoWorld KL',
    name: 'AutoWorld KL',
    contactNo: 'AutoWorld KL',
    address: 'AutoWorld KL',
    companyName: 'AutoWorld KL',
    customerInfoaccNo: 'AutoWorld KL',
    status: 0,
    collectSchedule: '2025-02-18T09:00:00',
    totalTire: '6',
    company3PL: 'Miaw Miaw SDN BHD',
    dealerInfo: {
        dealerCode: 'DLR-001',
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789',
        dealerLoc: 'Petaling Jaya'
    },
    customerInfo: {
        name: 'Lee Wei Ming',
        vehicle: 'Toyota Hilux 2.8G',
        regNo: 'WXY 4567'
    }
});
</script>
