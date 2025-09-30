<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create CTC</div>

                <!-- Dealer Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Waranty Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Entry ID </label>
                            <InputText v-model="order.companyName" class="w-full"  />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Collect Date</label>
                            <InputText v-model="order.address" class="w-full"  />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Collect Time</label>
                            <InputText v-model="order.dealerAccno" class="w-full"  />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Status</label>
                            <InputText v-model="order.branchLocation" class="w-full"  />
                        </div>
                    </div>

                    <div class="flex justify-start mt-8">
                        <div class="w-40">
                            <RouterLink to="/technical/detailWarantyClaim">
                                <Button label="Sumbit Order" class="w-full p-button-success" />
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
