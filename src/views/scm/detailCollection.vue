<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
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
                    <DataTable :value="orderItems" dataKey="itemLineNo" responsiveLayout="scroll" class="text-sm" stripedRows>
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

                        <Column field="salesProgramId" header="Sales Program ID" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.salesProgramId }}</span>
                            </template>
                        </Column>

                        <Column field="priceGroup" header="Price Group" style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.priceGroup }}</span>
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

                    <div class="mt-4 flex justify-end items-center gap-2 relative">
                        <Button label="Update" size="small" class="p-button-primary w-40" @click="toggleDropdown" />

                        <transition name="fade">
                            <div
                                v-if="showDropdown"
                                class="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-56 z-50 p-2 flex flex-col gap-2"
                            >
                                <Button label="Update Collection Schedule" size="small" class="p-button-primary w-full" @click="handleSelect('schedule')" />
                                <Button label="Update Collection Complete" size="small" class="p-button-success w-full" @click="handleSelect('status')" />
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const showDropdown = ref(false);
const showCalendar = ref(false);
const showStatusDialog = ref(false);

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const handleSelect = (option) => {
    showDropdown.value = false;
    if (option === 'schedule') {
        showCalendar.value = true;
    } else if (option === 'status') {
        showStatusDialog.value = true;
    }
};

const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.relative');
    if (dropdown && !dropdown.contains(event.target)) {
        showDropdown.value = false;
    }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const orderItems = ref([
    { itemLineNo: 1, materialId: 'MAT001', salesProgramId: 'SP001', priceGroup: 'A1', quantity: 10, unitPrice: 25.5 },
    { itemLineNo: 2, materialId: 'MAT002', salesProgramId: 'SP002', priceGroup: 'B2', quantity: 5, unitPrice: 30.0 },
    { itemLineNo: 3, materialId: 'MAT003', salesProgramId: 'SP003', priceGroup: 'C3', quantity: 8, unitPrice: 22.75 }
]);

const paramData = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    accno: '66010341222',
    customerContactNo: '0123456789',
    CompanyName: 'HUH DUH NU UH',
    customerName: 'Zakir Turun',
    companyName: 'AutoWorld KL',
    dealerInfo: {
        dealerLoc: 'Petaling Jaya'
    }
});

const grandTotal = computed(() => orderItems.value.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
