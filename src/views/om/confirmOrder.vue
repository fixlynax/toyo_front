<template>
    <Fluid>
        <div class="flex flex-col w-full">
            <!-- Header -->
            <div class="card p-4">
                <div class="flex items-center gap-2 border-b mb-8">
                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" @click="router.back()" />
                    <div class="text-2xl font-bold text-gray-800">Confirm Order</div>
                </div>

                <!-- Dealer Details -->
                <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Dealer Details</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Customer Account</label>
                        <p class="text-gray-900">{{ order.customerAccount }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Company Name</label>
                        <p class="text-gray-900">{{ order.companyName }}</p>
                    </div>
                </div>
            </div>

            <!-- Delivery Details -->
            <div class="card p-4">
                <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🚚 Delivery Details</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Order Type</label>
                        <p class="text-gray-900">{{ order.orderType }}</p>
                    </div>

                    <div v-if="order.orderType !== 'DS'">
                        <label class="block font-bold text-gray-700">Delivery Method</label>
                        <p class="text-gray-900">{{ order.deliveryMethod }}</p>
                    </div>

                    <div v-if="order.orderType === 'DS'">
                        <label class="block font-bold text-gray-700">Container Size</label>
                        <p class="text-gray-900">{{ order.containerSize }}</p>
                    </div>
                </div>
            </div>

            <!-- Ship To Details -->
            <div v-if="['Delivery', 'Lalamove'].includes(order.deliveryMethod) || order.orderType === 'DS'" class="card p-4">
                <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">📍 Ship To Details</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Ship To Account No.</label>
                        <p class="text-gray-900">{{ order.shipToAccount }}</p>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Address Line 1</label>
                        <p class="text-gray-900">{{ order.shipToAddress1 }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address Line 2</label>
                        <p class="text-gray-900">{{ order.shipToAddress2 }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address Line 3</label>
                        <p class="text-gray-900">{{ order.shipToAddress3 }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address Line 4</label>
                        <p class="text-gray-900">{{ order.shipToAddress4 }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Estimated Delivery Arrival</label>
                        <p class="text-gray-900">{{ order.eta }}</p>
                    </div>
                </div>
            </div>

            <!-- Pickup Details -->
            <div v-if="order.deliveryMethod === 'Pickup'" class="card p-4">
                <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🚛 Pickup Information</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Name</label>
                        <p class="text-gray-900">{{ order.pickupName }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Contact Number</label>
                        <p class="text-gray-900">{{ order.pickupContact }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Truck Plate Number</label>
                        <p class="text-gray-900">{{ order.pickupTruckPlate }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Driver IC Number</label>
                        <p class="text-gray-900">{{ order.pickupDriverIC }}</p>
                    </div>
                </div>
            </div>

            <!-- Product Details -->
            <div class="card p-4">
                <div class="flex justify-between items-center border-b pb-2 mb-4">
                    <div class="text-xl font-bold text-gray-800">📦 Product Details</div>
                </div>

                <DataTable :value="order.items">
                    <Column field="pattern" header="Pattern" />
                    <Column field="size" header="Size" />
                    <Column field="quantity" header="Quantity" />
                    <Column header="Price">
                        <template #body="slotProps">RM {{ slotProps.data.price.toFixed(2) }}</template>
                    </Column>
                    <Column header="Subtotal">
                        <template #body="slotProps">RM {{ (slotProps.data.price * slotProps.data.quantity).toFixed(2) }}</template>
                    </Column>
                </DataTable>

                <!-- Total -->
                <div class="flex justify-end mt-4 text-lg font-bold text-green-600">
                    <div>Total: RM {{ grandTotal.toFixed(2) }}</div>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end mt-4 gap-4">
                    <div class="w-40">
                        <Button label="Edit" class="p-button-secondary" @click="router.back()" />
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="p-button" @click="handleSubmit" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const order = ref({
    customerAccount: 'CUST001',
    companyName: 'ABC Motors Sdn Bhd',
    orderType: 'Normal', // Normal | Own-Use | DS
    deliveryMethod: 'Delivery', // Pickup | Delivery | Lalamove
    containerSize: '40ft',

    // Ship To
    shipToAccount: 'ACC-5555',
    shipToAddress1: 'Lot 15 Jalan Bukit Bintang',
    shipToAddress2: 'Kuala Lumpur',
    shipToAddress3: 'Wilayah Persekutuan',
    shipToAddress4: 'Malaysia',
    eta: '2025-11-12 15:00',

    // Pickup
    pickupName: 'Ahmad Fauzi',
    pickupContact: '012-3456789',
    pickupTruckPlate: 'WXY 1234',
    pickupDriverIC: '900101-10-1234',

    // Items
    items: [
        { pattern: 'Classic Stripe', size: '225/45R17 94W', quantity: 2, price: 320.5 },
        { pattern: 'Eco Line', size: '255/50R20 105V', quantity: 1, price: 350.0 }
    ]
});

const grandTotal = computed(() => order.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

const handleSubmit = () => {
    console.log('Submitting confirmed order:', order.value);
};
</script>
