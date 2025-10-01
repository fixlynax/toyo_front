<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Collection Details</div>
                    <div class="inline-flex items-center gap-2">
                        <Button label="Reschedule" class="p-button-primary" size="small" @click="showCalendar = true" />
                    </div>

                </div>
                    <Dialog v-model:visible="showCalendar" header="Pick a new date & time" :modal="true" :closable="true">
                        <div class="p-4">
                            <!-- PrimeVue calendar with time -->
                            <Calendar 
                            v-model="selectedDate" 
                            showIcon 
                            showTime 
                            hourFormat="24" 
                            dateFormat="yy-mm-dd" 
                            :minDate="today" 
                            />

                            <div class="mt-4 flex justify-end gap-2">
                            <Button label="Cancel" class="p-button-text" @click="showCalendar = false" />
                            <Button label="Save" class="p-button-success" @click="reschedule" />
                            </div>
                        </div>
                    </Dialog>
                <div class="mt-6 mb-4">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Reference Number</span>
                        <span class="text-lg font-medium">{{ paramData.refNo }}</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Schedule</span>
                        <p class="font-medium text-lg">{{ paramData.collectSchedule }}</p>
                    </div>

                    <div>
                        <span class="block text-sm font-bold text-black-700">Total Tire</span>
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
</template>

<script setup>
import { ref } from 'vue';
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import Calendar from "primevue/calendar"

const showCalendar = ref(false)
const selectedDate = ref(null)

// today + current time → ensures only future date/time is valid
const today = new Date()

const reschedule = () => {
  if (selectedDate.value && selectedDate.value > new Date()) {
    console.log("New date & time selected:", selectedDate.value)
    showCalendar.value = false
  } else {
    alert("Please select a future date & time!")
  }
}

const paramData = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    collectDate: '2025-09-07',
    collectTime: '3:00PM',
    dealerName: 'AutoWorld KL',
    status: 0,
    collectSchedule: "2025-02-18 09:00:00",
    totalTire: "6",
    dealerInfo: {
        dealerCode: 'DLR-001',
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789',
        dealerLoc: "Petaling Jaya",
    },
    customerInfo: {
        name: 'Lee Wei Ming',
        vehicle: 'Toyota Hilux 2.8G',
        regNo: 'WXY 4567'
    },

});
</script>
