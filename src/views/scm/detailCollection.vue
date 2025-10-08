<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">CTC Details</div>
                    <div class="inline-flex items-center gap-2">
                        <Button label="Schedule Pick up" class="p-button-primary" size="small" @click="showCalendar = true" />
                        <Button label="Update Status" class="p-button-secondary" size="small" @click="showStatusDialog = true" />
                    </div>
                </div>

                <!-- CTC Reference Number -->
                <div class="mt-6 mb-4">
                    <div>
                        <span class="block text-sm font-bold text-black-700">CTC Ref No</span>
                        <span class="text-lg font-medium">{{ paramData.refNo }}</span>
                    </div>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Dealer Location</span>
                        <p class="font-medium text-lg">{{ paramData.dealerInfo.dealerLoc }}</p>
                    </div>

                    <div>
                        <span class="block text-sm font-bold text-black-700">Schedule Collection Date/Time</span>
                        <p class="font-medium text-lg">{{ formattedSchedule }}</p>
                    </div>

                    <div>
                        <span class="block text-sm font-bold text-black-700">No of Tires</span>
                        <p class="font-medium text-lg">{{ paramData.totalTire }}</p>
                    </div>
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
        </div>
    </div>

    <!-- Schedule Pickup Dialog -->
    <Dialog v-model:visible="showCalendar" header="Schedule Pick Up" :modal="true" :closable="true">
        <div class="p-4">
            <div class="mb-4">
                <label class="block text-sm font-bold text-black-700 mb-2">Select Date & Time</label>
                <Calendar v-model="selectedDate" showIcon showTime hourFormat="24" dateFormat="yy-mm-dd" :minDate="today" />
            </div>

            <div class="mt-4 flex justify-end gap-2">
                <Button label="Cancel" class="p-button-text" @click="showCalendar = false" />
                <Button label="Confirm Schedule" class="p-button-primary" @click="reschedule" />
            </div>
        </div>
    </Dialog>

    <!-- Update Status Dialog -->
    <Dialog v-model:visible="showStatusDialog" header="Update Status" :modal="true" :closable="true">
        <div class="p-4">
            <div class="mb-4">
                <label class="block text-sm font-bold text-black-700 mb-2">Select Status</label>
                <Dropdown 
                    v-model="selectedStatus" 
                    :options="statusOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                    placeholder="Select Status"
                    class="w-full"
                />
            </div>

            <div class="mt-4 flex justify-end gap-2">
                <Button label="Cancel" class="p-button-text" @click="showStatusDialog = false" />
                <Button label="Update" class="p-button-primary" @click="updateStatus" />
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

const showCalendar = ref(false);
const showStatusDialog = ref(false);
const selectedDate = ref(null);
const selectedStatus = ref(null);

// today + current time → ensures only future date/time is valid
const today = new Date();

// Status options for dropdown
const statusOptions = ref([
    { label: 'Scheduled', value: 0 },
    { label: 'In Progress', value: 1 },
    { label: 'Completed', value: 2 },
    { label: 'Cancelled', value: 3 }
]);

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
        console.log('Status updated to:', selectedStatus.value);
        paramData.value.status = selectedStatus.value;
        showStatusDialog.value = false;
        // Here you would typically make an API call to update the status
    } else {
        alert('Please select a status!');
    }
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
    totalTire: '6',
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