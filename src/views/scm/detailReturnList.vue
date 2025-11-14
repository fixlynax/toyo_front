<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- HEADER -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center gap-2 border-b pb-2 mb-4">
                    <RouterLink to="/scm/returnCollection">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                    </RouterLink>
                    <div class="text-2xl font-bold text-gray-800">Return Details</div>
                </div>

                <!-- DEALER INFO -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div class="md:col-span-2">
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div class="md:col-span-2 mb-4">
                                <span class="block text-sm font-bold text-gray-800">Customer Acc No</span>
                                <p class="font-medium font-semibold text-lg">{{ returnData.refNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Name</span>
                                <p class="font-medium text-lg">{{ returnData.dealerName }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Code</span>
                                <p class="font-medium text-lg">{{ returnData.dealerInfo.dealerCode }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Location</span>
                                <p class="font-medium text-lg">{{ returnData.dealerInfo.dealerLoc }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Customer Contact</span>
                                <p class="font-medium text-lg">{{ returnData.dealerInfo.contactNo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-2">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Return Items</div>
                <div class="overflow-x-auto">
                    <DataTable :value="returnItems" dataKey="itemLineNo" responsiveLayout="scroll" class="text-sm" stripedRows>
                        <Column field="itemLineNo" header="Item Line No." style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.itemLineNo }}</span>
                            </template>
                        </Column>

                        <Column field="materialId" header="Material ID" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-medium text-lg">{{ data.materialId }}</span>
                            </template>
                        </Column>

                        <Column field="condition" header="Condition" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span :class="data.condition === 'Good' ? 'text-green-600' : 'text-red-600'">
                                    {{ data.condition }}
                                </span>
                            </template>
                        </Column>

                        <Column field="quantity" header="Qty" style="text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.quantity }}</span>
                            </template>
                        </Column>

                        <Column field="unitPrice" header="Unit Price (RM)" style="min-width: 8rem; text-align: right">
                            <template #body="{ data }">
                                <span class="text-lg font-semibold text-green-600">{{ data.unitPrice.toFixed(2) }}</span>
                            </template>
                        </Column>

                        <Column field="totalPrice" header="Total (RM)" style="min-width: 8rem; text-align: right">
                            <template #body="{ data }">
                                <span class="text-lg font-bold text-green-700">{{ (data.quantity * data.unitPrice).toFixed(2) }}</span>
                            </template>
                        </Column>
                    </DataTable>

                    <div class="flex justify-end items-center border-t px-4 py-2">
                        <span class="text-lg font-semibold text-gray-800">Grand Total: RM {{ grandTotal.toFixed(2) }}</span>
                    </div>
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
                                <td class="px-4 py-2 font-medium">Ref No.</td>
                                <td class="px-4 py-2 text-right">{{ returnData.refNo }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Request Date</td>
                                <td class="px-4 py-2 text-right">{{ returnData.requestDate }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">3PL Company</td>
                                <td class="px-4 py-2 text-right">{{ returnData.company3PL }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">ETA Date/Time</td>
                                <td class="px-4 py-2 text-right">{{ formattedSchedule }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-4 flex justify-end items-center gap-2 relative">
                    <Button label="Update" size="small" class="p-button-primary w-40" @click="toggleDropdown" />
                    <transition name="fade">
                        <div v-if="showDropdown" class="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-56 z-50 p-2 flex flex-col gap-2">
                            <Button label="Update Return Schedule" size="small" class="p-button-secondary p-button w-full" @click="handleSelect('schedule')" />
                            <Button label="Update Return Completed" size="small" class="p-button w-full" @click="handleSelect('status')" />
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
// import Button from 'primevue/button';
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import Tag from 'primevue/tag';

const showDropdown = ref(false);
const showCalendar = ref(false);
const showStatusDialog = ref(false);

const toggleDropdown = () => (showDropdown.value = !showDropdown.value);

const handleSelect = (option) => {
    showDropdown.value = false;
    if (option === 'schedule') showCalendar.value = true;
    else if (option === 'status') showStatusDialog.value = true;
};

const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.relative');
    if (dropdown && !dropdown.contains(event.target)) showDropdown.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const returnItems = ref([
    { itemLineNo: 1, materialId: 'RTN001', condition: 'Good', quantity: 4, unitPrice: 150.5 },
    { itemLineNo: 2, materialId: 'RTN002', condition: 'Worn', quantity: 2, unitPrice: 90.0 },
    { itemLineNo: 3, materialId: 'RTN003', condition: 'Good', quantity: 1, unitPrice: 200.0 }
]);

const returnData = ref({
    refNo: 'RET-2025-001',
    dealerName: 'AutoWorld KL',
    requestDate: '2025-10-20',
    company3PL: 'LALAMOVE',
    collectSchedule: '2025-10-27T09:00:00',
    dealerInfo: {
        dealerCode: 'DLR-001',
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789',
        dealerLoc: 'Petaling Jaya'
    }
});

const grandTotal = computed(() => returnItems.value.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));

const formattedSchedule = computed(() => {
    const date = new Date(returnData.value.collectSchedule);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
