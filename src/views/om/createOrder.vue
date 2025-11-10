<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown filter v-model="selectedCustomer" :options="customerOptions" optionLabel="name" placeholder="Select a Customer" class="w-full" />
                </div>

                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Order Type</label>
                    <Dropdown v-model="selectedOrderType" :options="orderTypeOptions" placeholder="Select Order Type" class="w-full" />
                </div>

                <div v-if="selectedOrderType === 'Normal' || selectedOrderType === 'Own-Use'" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Delivery Method</label>
                    <Dropdown v-model="selectedDeliveryMethod" :options="deliveryMethodOptions" placeholder="Select Delivery Method" class="w-full" />
                </div>

                <div v-if="selectedOrderType === 'DS'" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Container Size</label>
                    <Dropdown v-model="selectedContainerSize" :options="containerSizeOptions" placeholder="Select Delivery Option" class="w-full" />
                </div>
            </div>
        </div>
        <div v-if="selectedDeliveryMethod === 'Delivery' || selectedDeliveryMethod === 'Lalamove'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Ship To Details</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block font-bold text-gray-700">Ship To Account No.</label>
                    <Dropdown placeholder="Select Delivery Method" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Ship To Address</label>
                    <Dropdown placeholder="Select Delivery Method" class="w-full" />
                </div>
            </div>
        </div>
        <div v-if="selectedOrderType === 'DS'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Ship To Details</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block font-bold text-gray-700">Ship To Account No.</label>
                    <Dropdown placeholder="Select Delivery Method" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Ship To Address</label>
                    <Dropdown placeholder="Select Delivery Method" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Estimated Time Arrival</label>
                    <Calendar id="calendar-24h" v-model="datetime24h" showTime hourFormat="24" placeholder="Select ETA"/>
                </div>
            </div>
        </div>
        <!-- Product Selection Section -->
        <div class="card flex flex-col gap-6">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
                <div class="text-2xl font-bold text-gray-800">Select Products</div>
                <Button v-if="selectedOrderType === 'DS'" icon="pi pi-file-import" label="Import Order" style="width: fit-content" />
            </div>

            <!-- Search Bar -->
            <div class="flex items-center gap-2 w-full max-w-md">
                <IconField class="flex-1">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="searchTerm" placeholder="Quick search by ID, pattern, or size..." class="w-full" />
                </IconField>
                <Button type="button" icon="pi pi-cog" class="p-button" />
            </div>

            <!-- Pattern Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div v-for="(pattern, index) in paginatedPatterns" :key="index" class="border rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-400 bg-white">
                    <img :src="pattern.image" alt="pattern" class="w-20 h-20 object-contain mb-3" />

                    <!-- Product Details -->
                    <div class="text-center space-y-1 w-full pb-3 border-b border-gray-200">
                        <div class="text-base font-semibold text-gray-800">{{ pattern.pattern }}</div>
                        <div class="text-sm text-gray-600">{{ pattern.size }}</div>
                        <div class="text-sm text-gray-600">Origin : {{ pattern.origin }}</div>
                    </div>

                    <!-- Price -->
                    <div class="text-lg font-semibold text-primary-600 mt-3">RM {{ pattern.price.toFixed(2) }}</div>

                    <!-- Quantity -->
                    <div class="mt-3 w-full">
                        <label class="block text-xs font-medium text-gray-600 mb-1 text-center">Quantity</label>
                        <InputNumber
                            v-model="pattern.quantity"
                            inputClass="text-center w-full"
                            showButtons
                            buttonLayout="horizontal"
                            decrementButtonClass="p-button-outlined"
                            incrementButtonClass="p-button-outlined"
                            incrementButtonIcon="pi pi-plus"
                            decrementButtonIcon="pi pi-minus"
                            placeholder="0"
                            :min="0"
                            class="w-full"
                        />
                    </div>

                    <!-- Add to Cart -->
                    <Button label="Add to Cart" icon="pi pi-shopping-cart" class="mt-4 w-full" @click="addSingleToCart(pattern)" :disabled="pattern.quantity <= 0" />
                </div>
            </div>

            <!-- Pagination Controls -->
            <div class="flex justify-center items-center gap-4 mt-6">
                <Button icon="pi pi-chevron-left" label="Previous" :disabled="currentPage === 1" @click="currentPage--" />
                <Button icon="pi pi-chevron-right" iconPos="right" label="Next" :disabled="currentPage === totalPages" @click="currentPage++" />
            </div>
            <span class="text-gray-600 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>

            <div v-if="cart.length === 0" class="flex flex-col md:flex-row justify-end gap-2 mt-6">
                <div class="w-40">
                    <RouterLink to="/om/listOrder">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/confirmOrder">
                        <Button label="Submit" class="w-full" disabled />
                    </RouterLink>
                </div>
            </div>
        </div>

        <div v-if="cart.length > 0" class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Selected Products</div>

            <DataTable :value="cart" class="w-full">
                <Column field="pattern" header="Pattern" />
                <Column field="size" header="Size" />
                <Column field="price" header="Price">
                    <template #body="slotProps"> RM {{ slotProps.data.price.toFixed(2) }} </template>
                </Column>

                <!-- Editable Quantity Column -->

                <Column header="Subtotal">
                    <template #body="slotProps"> RM {{ (slotProps.data.price * slotProps.data.quantity).toFixed(2) }} </template>
                </Column>

                <Column field="quantity" header="Quantity" :style="{ width: '180px' }">
                    <template #body="slotProps">
                        <div class="flex justify-center" style="justify-content: fit-content">
                            <InputNumber
                                v-model="slotProps.data.quantity"
                                inputClass="text-center w-24"
                                showButtons
                                buttonLayout="horizontal"
                                decrementButtonClass="p-button-outlined"
                                incrementButtonClass="p-button-outlined"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                :min="1"
                                class="w-32"
                            />
                        </div>
                    </template>
                </Column>
                <Column header="Available Qty">
                    <template #body="slotProps">
                        <div class="text-center">
                            {{ slotProps.data.avlQty }}
                        </div>
                    </template>
                </Column>
                <Column header="Action">
                    <template #body="slotProps">
                        <Button label="Remove" icon="pi pi-trash" severity="danger" text @click="removeFromCart(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <!-- Total Summary -->
            <div class="flex justify-end mt-2 text-lg font-semibold text-gray-700">
                Total: <span class="ml-2 text-blue-600">RM {{ cartTotal.toFixed(2) }}</span>
            </div>

            <!-- Cancel & Submit buttons (show when products are selected) -->
            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/listOrder">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/confirmOrder">
                        <Button label="Submit" class="w-full" @click="handleSubmit" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const selectedCustomer = ref(null);
const selectedOrderType = ref(null);
const selectedDeliveryMethod = ref(null);
const selectedDeliveryOption = ref(null);
const selectedContainerSize = ref(null);

const containerSizeOptions = ['20ft', '40ft'];

const customerOptions = [
    { name: 'ABC Motors Sdn Bhd', code: 'CUST001' },
    { name: 'Speed Tyre Enterprise', code: 'CUST002' },
    { name: 'GoAuto Garage', code: 'CUST003' }
];

const orderTypeOptions = ['Normal', 'DS', 'Own-Use'];
const deliveryMethodOptions = ['Pickup', 'Delivery', 'Lalamove'];
const deliveryOptionOptions = ['Deliver', 'Pickup'];

const patterns = ref([
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1001', pattern: 'Classic Stripe', size: '225/45R17 94W', origin: 'Malaysia', price: 320.5, quantity: 0, avlQty: 50 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1002', pattern: 'Sport Mesh', size: '235/40R18 95Y', origin: 'Japan', price: 420.0, quantity: 0, avlQty: 30 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1003', pattern: 'Luxury Diamond', size: '245/45R19 98W', origin: 'Thailand', price: 480.75, quantity: 0, avlQty: 20 },
    { image: '/demo/images/toyor_tayar4.png', materialId: 'MAT-1004', pattern: 'Eco Line', size: '255/50R20 105V', origin: 'Indonesia', price: 350.0, quantity: 0, avlQty: 40 },
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1005', pattern: 'Offroad Grip', size: '265/60R21 110H', origin: 'Malaysia', price: 560.25, quantity: 0, avlQty: 15 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1006', pattern: 'City Runner', size: '275/45R22 112V', origin: 'Japan', price: 510.0, quantity: 0, avlQty: 25 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1007', pattern: 'Urban Drift', size: '285/40R23 111Y', origin: 'Thailand', price: 465.5, quantity: 0, avlQty: 35 },
    { image: '/demo/images/toyor_tayar4.png', materialId: 'MAT-1008', pattern: 'Hybrid Plus', size: '295/35R24 110W', origin: 'Indonesia', price: 495.0, quantity: 0, avlQty: 45 },
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1009', pattern: 'Extreme Trail', size: '305/55R25 113V', origin: 'Malaysia', price: 580.75, quantity: 0, avlQty: 10 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1010', pattern: 'Smooth Road', size: '315/30R26 105Y', origin: 'Japan', price: 430.0, quantity: 0, avlQty: 60 }
]);

const cart = ref([]);

const filteredPatterns = computed(() => {
    if (!searchTerm.value.trim()) return patterns.value;
    const term = searchTerm.value.toLowerCase();
    return patterns.value.filter((p) => p.materialId.toLowerCase().includes(term) || p.pattern.toLowerCase().includes(term) || p.size.toLowerCase().includes(term));
});

const totalPages = computed(() => Math.ceil(filteredPatterns.value.length / itemsPerPage));
const paginatedPatterns = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredPatterns.value.slice(start, start + itemsPerPage);
});

const addSingleToCart = (pattern) => {
    if (pattern.quantity > 0) {
        const existing = cart.value.find((item) => item.materialId === pattern.materialId);
        if (existing) existing.quantity += pattern.quantity;
        else cart.value.push({ ...pattern });
        pattern.quantity = 0;
    }
};

const removeFromCart = (item) => {
    cart.value = cart.value.filter((i) => i.materialId !== item.materialId);
};

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

const handleSubmit = () => {
    console.log('Submitting order:', cart.value);
};
</script>
