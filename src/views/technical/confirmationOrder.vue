<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Confirm Order</div>

                <!-- Dealer Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Dealer Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Company Name</label>
                            <p class="text-gray-900">{{ order.companyName }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Address</label>
                            <p class="text-gray-900">{{ order.address }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Dealer Accno</label>
                            <p class="text-gray-900">{{ order.dealerAccno }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Branch Location</label>
                            <p class="text-gray-900">{{ order.branchLocation }}</p>
                        </div>
                    </div>
                </div>

                <!-- Item Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">📦 Item Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Item Name</label>
                            <p class="text-gray-900">{{ order.itemName }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">SKU</label>
                            <p class="text-gray-900">{{ order.sku }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Quantity</label>
                            <p class="text-gray-900">{{ order.quantity }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price</label>
                            <p class="text-gray-900">{{ order.price }}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Order Type</label>
                            <p class="text-gray-900">{{ order.orderType }}</p>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-40">
                        <Button label="Edit" class="p-button-secondary" @click="goBack" />
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="p-button-success" @click="submitOrder" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Same data as before – ideally you’d pass it via props or state
const order = ref({
    companyName: 'Tack Lim Service Tires',
    address: '123 Jalan Ampang, Kuala Lumpur',
    dealerAccno: 'TLST123438',
    branchLocation: 'Kuala Lumpur',
    itemName: 'Proxes TR1',
    sku: 'PTR100123',
    quantity: 4,
    price: '0.00',
    orderType: 'Normal'
});

const goBack = () => {
    // navigate back to edit page
    router.push('/technical/createOrder');
};

const submitOrder = () => {
    alert('✅ Order Submitted:\n' + JSON.stringify(order.value, null, 2));
    router.push('/technical/detailWarantyClaim');
    // You can replace alert with API call to save
};
</script>
