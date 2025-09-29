<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>

                <!-- Dealer Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Dealer Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Company Name</label>
                            <InputText v-model="order.companyName" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Address</label>
                            <InputText v-model="order.address" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Dealer Accno</label>
                            <InputText v-model="order.dealerAccno" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Branch Location</label>
                            <InputText v-model="order.branchLocation" class="w-full" disabled />
                        </div>
                    </div>
                </div>

                <!-- Item Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">📦 Item Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Item Name</label>
                            <InputText v-model="order.itemName" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">SKU</label>
                            <InputText v-model="order.sku" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Quantity</label>
                            <InputNumber v-model="order.quantity" class="w-full" :min="1" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price</label>
                            <InputText v-model="order.price" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Order Type</label>
                            <Dropdown v-model="order.orderType" :options="orderTypes" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <div class="flex justify-start mt-8">
                        <div class="w-40">
                            <RouterLink to="/technical/confirmationOrder">
                                <Button label="Create Order" class="w-full p-button-success" />
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

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

const orderTypes = [
    { label: 'Normal', value: 'Normal' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Special', value: 'Special' }
];

const submitOrder = () => {
    // if (!order.value.orderType) {
    //     alert('⚠️ Please select an order type');
    //     return;
    // }
    // alert('✅ Order Created:\n' + JSON.stringify(order.value, null, 2));

    router.push('/technical/confirmationOrder');
};
</script>
