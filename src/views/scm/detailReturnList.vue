<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <div class="card flex flex-col w-full">
                <div class="flex items-center gap-2 border-b pb-2 mb-4">
                    <RouterLink to="/scm/returnCollection">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                    </RouterLink>
                    <div class="text-2xl font-bold text-gray-800">Return Details</div>
                </div>

                <!-- Status Badge -->
                <div class="mt-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="statusClass">
                        {{ statusText }}
                    </span>
                </div>

                <!-- CTC Reference Number -->
                <div class="mt-6 mb-4">
                    <div>
                        <span class="block text-sm font-bold text-black-700">CTC Ref No</span>
                        <span class="text-lg font-medium">{{ paramData.refNo }}</span>
                    </div>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 items-center">
                    <div>
                        <span class="block text-sm font-bold text-gray-800">Dealer Location</span>
                        <p class="font-medium text-lg">{{ paramData.dealerInfo.dealerLoc }}</p>
                    </div>

                    <div>
                        <span class="block text-sm font-bold text-gray-800">Schedule Return Date/Time</span>
                        <p class="font-medium text-lg">{{ formattedSchedule }}</p>
                    </div>

                    <div>
                        <span class="block text-sm font-bold text-gray-800">No of Tires</span>
                        <p class="font-medium text-lg">{{ paramData.totalTire }}</p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end items-center gap-2 mt-6">
                    <RouterLink to="/scm/listCollection">
                        <Button label="Cancel" size="small" class="p-button-secondary" />
                    </RouterLink>
                    <Button label="Update" size="small" class="p-button-primary" @click="handleUpdate" />
                </div>
            </div>

            <!-- Additional Return Information Section -->
            <div class="card flex flex-col w-full mt-6">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-xl font-bold text-gray-800">📦 Return Items</div>
                </div>
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
            <!-- Customer Information -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Customer Name</td>
                                <td class="px-4 py-2 text-right">{{ paramData.customerInfo.name }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Vehicle</td>
                                <td class="px-4 py-2 text-right">{{ paramData.customerInfo.vehicle }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Registration Number</td>
                                <td class="px-4 py-2 text-right">{{ paramData.customerInfo.regNo }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Dealer Information -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Dealer Name</td>
                                <td class="px-4 py-2 text-right">{{ paramData.dealerName }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Dealer Code</td>
                                <td class="px-4 py-2 text-right">{{ paramData.dealerInfo.dealerCode }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Contact Person</td>
                                <td class="px-4 py-2 text-right">{{ paramData.dealerInfo.contactPerson }}</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-medium">Contact Number</td>
                                <td class="px-4 py-2 text-right">{{ paramData.dealerInfo.contactNo }}</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-medium">Address</td>
                                <td class="px-4 py-2 text-right">{{ paramData.dealerInfo.dealerLoc }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Shipment Information -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-xl font-bold text-gray-800">🚚 Shipment Arrangement</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Carrier</td>
                                <td class="px-4 py-2 text-right">ABC Logistics</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Tracking No</td>
                                <td class="px-4 py-2 text-right">TRK-789012</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-medium">Estimated Delivery</td>
                                <td class="px-4 py-2 text-right">2-3 business days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Schedule Return Dialog -->
    <Dialog v-model:visible="showCalendar" header="Schedule Return" :modal="true" :closable="true">
        <div class="p-4">
            <div class="mb-4">
                <label class="block text-sm font-bold text-black-700 mb-2">Select Return Date & Time</label>
                <Calendar v-model="selectedDate" showIcon showTime hourFormat="24" dateFormat="yy-mm-dd" :minDate="today" />
            </div>

            <div class="mt-4 flex justify-end gap-2">
                <Button label="Cancel" class="p-button-text" @click="showCalendar = false" />
                <Button label="Confirm Return Schedule" class="p-button-primary" @click="reschedule" />
            </div>
        </div>
    </Dialog>

    <!-- Update Status Dialog -->
    <Dialog v-model:visible="showStatusDialog" header="Update Return Status" :modal="true" :closable="true">
        <div class="p-4">
            <div class="mb-4">
                <label class="block text-sm font-bold text-black-700 mb-2">Select Return Status</label>
                <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full" />
            </div>

            <div class="mt-4 flex justify-end gap-2">
                <Button label="Cancel" class="p-button-text" @click="showStatusDialog = false" />
                <Button label="Update Status" class="p-button-primary" @click="updateStatus" />
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';

const showCalendar = ref(false);
const showStatusDialog = ref(false);
const selectedDate = ref(null);
const selectedStatus = ref(null);

// today + current time → ensures only future date/time is valid
const today = new Date();

// Status options for dropdown
const statusOptions = ref([
    { label: 'Pending', value: 0 },
    { label: 'In Transit', value: 1 },
    { label: 'Completed', value: 2 },
    { label: 'Cancelled', value: 3 }
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
        case 1: // In Transit
            return 'bg-blue-100 text-blue-800';
        case 2: // Completed
            return 'bg-green-100 text-green-800';
        case 3: // Cancelled
            return 'bg-red-100 text-red-800';
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
        console.log('New return schedule selected:', selectedDate.value);
        // Update the schedule in paramData
        paramData.value.collectSchedule = selectedDate.value.toISOString();
        showCalendar.value = false;
        // Here you would typically make an API call to update the schedule
    } else {
        alert('Please select a future date & time!');
    }
};

const updateStatus = () => {
    if (selectedStatus.value !== null) {
        console.log('Return status updated to:', selectedStatus.value);
        paramData.value.status = selectedStatus.value;
        showStatusDialog.value = false;
        // Here you would typically make an API call to update the status
    } else {
        alert('Please select a status!');
    }
};

const handleUpdate = () => {
    console.log('Update return details');
    // Handle the update logic here
};

const paramData = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    collectDate: '2025-09-07',
    collectTime: '3:00PM',
    dealerName: 'AutoWorld KL',
    status: 0,
    collectSchedule: '2025-02-18T09:00:00',
    totalTire: '2',
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
