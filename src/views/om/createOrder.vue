<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Create Toyo Order</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown v-model="selectedCustomer" :options="customerOptions" optionLabel="name" placeholder="Select a Customer" class="w-full" />
                </div>

                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Order Type</label>
                    <Dropdown v-model="selectedOrderType" :options="orderTypeOptions" placeholder="Select Order Type" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700">Delivery Method</label>
                    <Dropdown v-model="selectedDeliveryMethod" :options="deliveryMethodOptions" placeholder="Select Delivery Method" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700">Delivery Option</label>
                    <Dropdown v-model="selectedDeliveryOption" :options="deliveryOptionOptions" placeholder="Select Delivery Option" class="w-full" />
                </div>
            </div>
        </div>

        <!-- Product Selection Section -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Select Products</div>

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
                <div v-for="(pattern, index) in paginatedPatterns" :key="index" class="border rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-400">
                    <img :src="pattern.image" alt="pattern" class="w-20 h-20 object-contain mb-3" />
                    <div class="text-center space-y-1">
                        <div class="text-base font-semibold text-gray-800">{{ pattern.pattern }}</div>
                        <div class="text-sm text-gray-600">{{ pattern.size }}</div>
                        <div class="text-sm text-gray-600">Origin : {{ pattern.origin }}</div>
                    </div>

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

                    <Button label="Add to Cart" icon="pi pi-shopping-cart" class="mt-4 w-full" @click="addSingleToCart(pattern)" :disabled="pattern.quantity <= 0" />
                </div>
            </div>

            <!-- Pagination Controls -->
            <div class="flex justify-center items-center gap-4 mt-6">
                <Button icon="pi pi-chevron-left" label="Previous" :disabled="currentPage === 1" @click="currentPage--" />
                <Button icon="pi pi-chevron-right" iconPos="right" label="Next" :disabled="currentPage === totalPages" @click="currentPage++" />
            </div>
            <span class="text-gray-600 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>

            <!-- Cancel & Submit (show only if no selected products) -->
            <div v-if="cart.length === 0" class="flex flex-col md:flex-row justify-end gap-2 mt-6">
                <div class="w-40">
                    <RouterLink to="/om/listOrder">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" disabled />
                </div>
            </div>
        </div>

        <!-- Cart Section (only visible if there are selected products) -->
        <div v-if="cart.length > 0" class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Selected Products</div>

            <DataTable :value="cart" class="w-full">
                <Column field="pattern" header="Pattern"></Column>
                <Column field="size" header="Size"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column header="Action">
                    <template #body="slotProps">
                        <Button label="Remove" icon="pi pi-trash" severity="danger" text @click="removeFromCart(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <!-- Cancel & Submit buttons (show when products are selected) -->
            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/listOrder">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" @click="handleSubmit" />
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

const customerOptions = [
    { name: 'ABC Motors Sdn Bhd', code: 'CUST001' },
    { name: 'Speed Tyre Enterprise', code: 'CUST002' },
    { name: 'GoAuto Garage', code: 'CUST003' }
];

const orderTypeOptions = ['Normal ', 'DS ', 'Own-Use '];

const deliveryMethodOptions = ['Pickup', 'Delivery', 'Courier'];

const deliveryOptionOptions = ['Deliver', 'Pickup'];

const patterns = ref([
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1001', pattern: 'Classic Stripe', size: '225/45R17 94W', origin: 'Malaysia', quantity: 0 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1002', pattern: 'Sport Mesh', size: '235/40R18 95Y', origin: 'Japan', quantity: 0 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1003', pattern: 'Luxury Diamond', size: '245/45R19 98W', origin: 'Thailand', quantity: 0 },
    { image: '/demo/images/toyor_tayar4.png', materialId: 'MAT-1004', pattern: 'Eco Line', size: '255/50R20 105V', origin: 'Indonesia', quantity: 0 },
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1005', pattern: 'Offroad Grip', size: '265/60R21 110H', origin: 'Malaysia', quantity: 0 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1006', pattern: 'City Runner', size: '275/45R22 112V', origin: 'Japan', quantity: 0 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1007', pattern: 'Urban Drift', size: '285/40R23 111Y', origin: 'Thailand', quantity: 0 },
    { image: '/demo/images/toyor_tayar4.png', materialId: 'MAT-1008', pattern: 'Hybrid Plus', size: '295/35R24 110W', origin: 'Indonesia', quantity: 0 },
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1009', pattern: 'Extreme Trail', size: '305/55R25 113V', origin: 'Malaysia', quantity: 0 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1010', pattern: 'Smooth Road', size: '315/30R26 105Y', origin: 'Japan', quantity: 0 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1011', pattern: 'Grip Master', size: '325/35R27 114W', origin: 'Thailand', quantity: 0 },
    { image: '/demo/images/toyor_tayar4.png', materialId: 'MAT-1012', pattern: 'Touring Comfort', size: '335/25R28 111Y', origin: 'Indonesia', quantity: 0 }
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
</script>
