<template>
    <Fluid>
        <!-- Return Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Return Order</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Account -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown filter v-model="selectedCustomer" :options="customerOptions" optionLabel="name" placeholder="Select a Customer" class="w-full" />
                </div>
            </div>
        </div>

        <!-- Ship To / Pickup Section -->
        <div v-if="selectedDeliveryMethod === 'Delivery' || selectedDeliveryMethod === 'Lalamove'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Ship To Details</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Ship To Account No.</label>
                    <Dropdown v-model="shipToAccount" placeholder="Select Account" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 1</label>
                    <InputText v-model="shipToAddress1" placeholder="Insert Ship Address" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 2</label>
                    <InputText v-model="shipToAddress2" placeholder="Insert Ship Address" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 3</label>
                    <InputText v-model="shipToAddress3" placeholder="Insert Ship Address" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 4</label>
                    <InputText v-model="shipToAddress4" placeholder="Insert Ship Address" class="w-full" />
                </div>
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Estimated Return Arrival</label>
                    <Calendar v-model="datetime24h" showTime hourFormat="24" placeholder="Select ETA" class="w-full" />
                </div>
            </div>
        </div>

        <div v-if="selectedReturnType === 'Pickup'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Pickup Information</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block font-bold text-gray-700">Name</label>
                    <InputText v-model="pickupName" placeholder="Insert Name" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Contact Number</label>
                    <InputText v-model="pickupPhone" placeholder="Insert Contact Number" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Truck Plate Number</label>
                    <InputText v-model="pickupTruckPlate" placeholder="Insert Truck Plate Number" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Driver IC Number</label>
                    <InputText v-model="pickupDriverIC" placeholder="Insert Driver IC Number" class="w-full" />
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Products</div>

            <DataTable :value="patterns" class="w-full">
                <Column field="pattern" header="Pattern" />
                <Column field="size" header="Size" />
                <Column field="avlQty" header="Available Quantity" />
                <Column header="Return Quantity">
                    <template #body="slotProps">
                        <InputNumber v-model="slotProps.data.quantity" inputClass="text-center w-24" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" :min="0" :max="slotProps.data.avlQty" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <div class="card">
            <div class="text-lg font-bold text-gray-800 mb-2">Return Reason</div>
            <InputText placeholder="Enter the reason for this return order" class="w-full" style="background-color: #f5f5f5" />
            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/listReturnOrder">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/confirmReturnOrder">
                        <Button label="Submit" class="w-full" @click="handleSubmit" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const selectedCustomer = ref(null);
const selectedReturnType = ref(null);
const selectedDeliveryMethod = ref(null);

const shipToAccount = ref('');
const shipToAddress1 = ref('');
const shipToAddress2 = ref('');
const shipToAddress3 = ref('');
const shipToAddress4 = ref('');
const datetime24h = ref(null);

const pickupName = ref('');
const pickupPhone = ref('');
const pickupTruckPlate = ref('');
const pickupDriverIC = ref('');

const returnReason = ref('');

const customerOptions = [
    { name: 'ABC Motors Sdn Bhd', code: 'CUST001' },
    { name: 'Speed Tyre Enterprise', code: 'CUST002' },
    { name: 'GoAuto Garage', code: 'CUST003' }
];

const patterns = ref([
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1001', pattern: 'Classic Stripe', size: '225/45R17 94W', origin: 'Malaysia', quantity: 0, avlQty: 50 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1002', pattern: 'Sport Mesh', size: '235/40R18 95Y', origin: 'Japan', quantity: 0, avlQty: 30 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1003', pattern: 'Luxury Diamond', size: '245/45R19 98W', origin: 'Thailand', quantity: 0, avlQty: 20 }
]);

const handleSubmit = () => {
    console.log('Submitting return order:', {
        products: patterns.value,
        reason: returnReason.value
    });
};
</script>
