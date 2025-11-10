<template>
    <Fluid>
        <div class="flex flex-col gap-6 w-full">
            <!-- Dealer Details Card -->
            <div class="card p-4">
                <div class="flex items-center gap-2 border-b mb-8">
                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" @click="router.back()" />

                    <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                </div>
                <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Dealer Details</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Dealer Accno</label>
                        <p class="text-gray-900">{{ order.dealerAccno }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Company Name</label>
                        <p class="text-gray-900">{{ order.companyName }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address</label>
                        <p class="text-gray-900">{{ order.address }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Branch Location</label>
                        <p class="text-gray-900">{{ order.branchLocation }}</p>
                    </div>
                </div>
            </div>

            <!-- Delivery Details Card -->
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

            <!-- Ship To Details Card -->
            <div class="card p-4" v-if="['Delivery', 'Lalamove'].includes(order.deliveryMethod)">
                <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">📍 Ship To Details</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Ship To Account No.</label>
                        <p class="text-gray-900">{{ order.shipToAccount }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Ship To Address</label>
                        <p class="text-gray-900">{{ order.shipToAddress }}</p>
                    </div>
                </div>
            </div>

            <!-- Product Details Card -->
            <!-- Product Details Card -->
            <div class="card p-4">
                <div class="flex justify-between items-center border-b pb-2 mb-4">
                    <div class="text-xl font-bold text-gray-800">📦 Product Details</div>
                    <Button v-if="order.orderType === 'DS'" icon="pi pi-file-import" label="Import Order" class="p-button-text p-button-secondary" />
                </div>

                <!-- DataTable -->
                <DataTable :value="order.items">
                    <Column header="Pattern">
                        <template #body="slotProps">{{ slotProps.data.pattern }}</template>
                    </Column>
                    <Column header="Size">
                        <template #body="slotProps">{{ slotProps.data.size }}</template>
                    </Column>
                    <Column header="Quantity">
                        <template #body="slotProps">{{ slotProps.data.quantity }}</template>
                    </Column>
                    <Column header="Price">
                        <template #body="slotProps">RM {{ slotProps.data.price.toFixed(2) }}</template>
                    </Column>
                    <Column header="Subtotal">
                        <template #body="slotProps">RM {{ (slotProps.data.price * slotProps.data.quantity).toFixed(2) }}</template>
                    </Column>
                </DataTable>

                <!-- Grand Total -->
                <div class="flex justify-end mt-4 text-lg font-bold text-green-600">
                    <div>Total: RM {{ grandTotal.toFixed(2) }}</div>
                </div>

                <!-- Action Buttons -->
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
import { ref, computed } from 'vue'; // added computed
import { useRouter } from 'vue-router';
const router = useRouter();

// Example order object reflecting Create Order form
const order = ref({
    companyName: 'Tack Lim Service Tires',
    address: '123 Jalan Ampang, Kuala Lumpur',
    dealerAccno: 'TLST123438',
    branchLocation: 'Kuala Lumpur',
    orderType: 'Normal',
    deliveryMethod: 'Delivery',
    containerSize: '',
    shipToAccount: 'ACC-1234',
    shipToAddress: '45 Jalan Bukit Bintang, KL',
    items: [
        { pattern: 'Classic Stripe', size: '225/45R17 94W', quantity: 4, price: 320.5 },
        { pattern: 'Sporty Tread', size: '205/55R16 91V', quantity: 2, price: 280.0 },
        { pattern: 'All-Terrain', size: '245/70R16 107S', quantity: 1, price: 450.0 }
    ]
});

// Compute grand total
const grandTotal = computed(() => order.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

const handleSubmit = () => {
    console.log('Submitting confirmed order:', order.value);
};
</script>
