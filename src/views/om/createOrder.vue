<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Account -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown filter v-model="selectedCustomer" :options="customerOptions" optionLabel="name" placeholder="Select a Customer" class="w-full" />
                </div>

                <!-- Order Type -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Order Type</label>
                    <Dropdown v-model="selectedOrderType" :options="orderTypeOptions" placeholder="Select Order Type" class="w-full" />
                </div>

                <!-- Delivery Method -->
                <div v-if="selectedOrderType === 'Normal' || selectedOrderType === 'Own-Use'" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Delivery Method</label>
                    <Dropdown v-model="selectedDeliveryMethod" :options="deliveryMethodOptions" placeholder="Select Delivery Method" class="w-full" />
                </div>

                <!-- Container Size -->
                <div v-if="selectedOrderType === 'DS'" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Container Size</label>
                    <Dropdown v-model="selectedContainerSize" :options="containerSizeOptions" placeholder="Select Container Size" class="w-full" />
                </div>
            </div>
        </div>

        <!-- Ship To Details -->
        <div v-if="selectedDeliveryMethod === 'Delivery' || selectedDeliveryMethod === 'Lalamove' || selectedOrderType === 'DS'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Ship To Details</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Ship To Account No.</label>
                    <Dropdown v-model="shipToAccount" placeholder="Select Delivery Method" class="w-full" />
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
                    <label class="block font-bold text-gray-700">Estimated Delivery Arrival</label>
                    <Calendar v-model="datetime24h" showTime hourFormat="24" placeholder="Select ETA" class="w-full" />
                </div>
            </div>
        </div>
        <div v-if="selectedDeliveryMethod === 'Pickup'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Pickup Information</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="">
                    <label class="block font-bold text-gray-700">Name</label>
                    <InputText v-model="shipToAccount" placeholder="Select Delivery Method" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700">Contact Number</label>
                    <InputText v-model="shipToAddress1" placeholder="Insert Contact Number" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Truck Plate Number</label>
                    <InputText v-model="shipToAddress2" placeholder="Insert Truck Plate Number" class="w-full" />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Driver IC Number</label>
                    <InputText v-model="shipToAddress3" placeholder="Insert Driver Ic Number" class="w-full" />
                </div>
            </div>
        </div>

        <!-- Product Selection Section -->
        <div class="card flex flex-col gap-6">
            <div class="flex items-center justify-between border-b pb-2">
                <div class="text-2xl font-bold text-gray-800">Select Products</div>
                <div class="gap-2 flex">
                    <Button v-if="selectedOrderType === 'DS'" icon="pi pi-file-import" label="Template" class="p-button-success" style="width: fit-content" />
                    <Button v-if="selectedOrderType === 'DS'" icon="pi pi-download" label="Import" style="width: fit-content" />
                </div>
            </div>

            <!-- Search Bar -->
            <div class="flex items-center gap-2 w-full max-w-md">
                <IconField class="flex-1">
                    <InputIcon><i class="pi pi-search" /></InputIcon>
                    <InputText v-model="searchTerm" placeholder="Quick search by ID, pattern, or size..." class="w-full" />
                </IconField>
                <Menu :model="sortItems" popup ref="sortMenu" />
                <Button type="button" icon="pi pi-cog" class="p-button" @click="$refs.sortMenu.toggle($event)" />
            </div>

            <!-- Pattern Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div v-for="(pattern, index) in paginatedPatterns" :key="index" class="border rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-400 bg-white">
                    <img :src="pattern.image" alt="pattern" class="w-20 h-20 object-contain mb-3" />

                    <div class="text-center space-y-1 w-full pb-3 border-b border-gray-200">
                        <div class="text-base font-semibold text-gray-800">{{ pattern.pattern }}</div>
                        <div class="text-sm text-gray-600">{{ pattern.size }}</div>
                        <div class="text-sm text-gray-600">Origin: {{ pattern.origin }}</div>
                    </div>

                    <div class="text-lg font-semibold text-primary-600 mt-3">RM {{ pattern.price.toFixed(2) }}</div>

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
                            :max="selectedOrderType === 'Own-Use' ? 4 - cartQuantity : undefined"
                            class="w-full"
                        />
                    </div>

                    <Button label="Add to Cart" icon="pi pi-shopping-cart" class="mt-4 w-full" @click="addSingleToCart(pattern)" :disabled="pattern.quantity <= 0 || (selectedOrderType === 'Own-Use' && cartQuantity + pattern.quantity > 4)" />
                </div>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center items-center gap-4 mt-6">
                <Button icon="pi pi-chevron-left" label="Previous" :disabled="currentPage === 1" @click="currentPage--" />
                <Button icon="pi pi-chevron-right" iconPos="right" label="Next" :disabled="currentPage === totalPages" @click="currentPage++" />
            </div>
            <span class="text-gray-600 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>

            <!-- Cart Empty Actions -->
            <div v-if="cart.length === 0" class="flex flex-col md:flex-row justify-end gap-2 mt-6">
                <div class="w-40">
                    <RouterLink to="/om/listOrder"><Button label="Cancel" class="w-full p-button-secondary" /></RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/confirmOrder"><Button label="Submit" class="w-full" disabled /></RouterLink>
                </div>
            </div>
        </div>

        <!-- Selected Products / Cart -->
        <div v-if="cart.length > 0" class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Selected Products</div>

            <DataTable :value="cart" class="w-full">
                <Column field="pattern" header="Pattern" />
                <Column field="size" header="Size" />
                <Column field="price" header="Price">
                    <template #body="slotProps">RM {{ slotProps.data.price.toFixed(2) }}</template>
                </Column>
                <Column header="Quantity" :style="{ width: '180px' }">
                    <template #body="slotProps">
                        <div class="flex justify-center">
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
                                :max="selectedOrderType === 'Own-Use' ? 4 - (cartTotalQuantity - slotProps.data.quantity) : undefined"
                                style="width: auto"
                            />
                        </div>
                    </template>
                </Column>
                <Column header="Available Qty">
                    <template #body="slotProps">
                        <div class="text-center">{{ slotProps.data.avlQty }}</div>
                    </template>
                </Column>
                <Column header="Subtotal">
                    <template #body="slotProps">RM {{ (slotProps.data.price * slotProps.data.quantity).toFixed(2) }}</template>
                </Column>
                <Column header="Action">
                    <template #body="slotProps">
                        <Button label="Remove" icon="pi pi-trash" severity="danger" text @click="removeFromCart(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <div class="flex justify-end mt-2 text-lg font-semibold text-gray-700">
                Total: <span class="ml-2 text-blue-600">RM {{ cartTotal.toFixed(2) }}</span>
            </div>

            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/listOrder"><Button label="Cancel" class="w-full p-button-secondary" /></RouterLink>
                </div>
                <div class="w-40">
                    <RouterLink to="/om/confirmOrder"><Button label="Submit" class="w-full" @click="handleSubmit" /></RouterLink>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const selectedCustomer = ref(null);
const selectedOrderType = ref(null);
const selectedDeliveryMethod = ref(null);
const selectedContainerSize = ref(null);

const shipToAccount = ref('');
const shipToAddress1 = ref('');
const shipToAddress2 = ref('');
const shipToAddress3 = ref('');
const shipToAddress4 = ref('');
const datetime24h = ref(null);

const containerSizeOptions = ['20ft', '40ft'];
const customerOptions = [
    { name: 'ABC Motors Sdn Bhd', code: 'CUST001' },
    { name: 'Speed Tyre Enterprise', code: 'CUST002' },
    { name: 'GoAuto Garage', code: 'CUST003' }
];
const orderTypeOptions = ['Normal', 'DS', 'Own-Use'];
const deliveryMethodOptions = ['Pickup', 'Delivery', 'Lalamove'];

const patterns = ref([
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1001', pattern: 'Classic Stripe', size: '225/45R17 94W', origin: 'Malaysia', price: 320.5, quantity: 0, avlQty: 50 },
    { image: '/demo/images/toyor_tayar2.png', materialId: 'MAT-1002', pattern: 'Sport Mesh', size: '235/40R18 95Y', origin: 'Japan', price: 420.0, quantity: 0, avlQty: 30 },
    { image: '/demo/images/toyor_tayar3.png', materialId: 'MAT-1003', pattern: 'Luxury Diamond', size: '245/45R19 98W', origin: 'Thailand', price: 480.75, quantity: 0, avlQty: 20 },
    { image: '/demo/images/toyor_tayar4.png', materialId: 'MAT-1004', pattern: 'Eco Line', size: '255/50R20 105V', origin: 'Indonesia', price: 350.0, quantity: 0, avlQty: 40 },
    { image: '/demo/images/toyor_tayar1.png', materialId: 'MAT-1005', pattern: 'Offroad Grip', size: '265/60R21 110H', origin: 'Malaysia', price: 560.25, quantity: 0, avlQty: 15 }
]);

const cart = ref([]);

const sortItems = [
    {
        label: 'Pattern',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern')
    },
    {
        label: 'Size',
        icon: 'pi pi-arrows-v',
        command: () => sortBy('size')
    }
];

const sortField = ref('');
const sortOrder = ref(1); // 1 = ascending, -1 = descending

const sortBy = (field) => {
    if (sortField.value === field)
        sortOrder.value *= -1; // toggle ascending/descending
    else sortOrder.value = 1;

    sortField.value = field;

    // Apply sorting to your paginatedPatterns
    patterns.value.sort((a, b) => {
        if (a[field] < b[field]) return -1 * sortOrder.value;
        if (a[field] > b[field]) return 1 * sortOrder.value;
        return 0;
    });
};

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

const cartQuantity = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
const cartTotalQuantity = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

const addSingleToCart = (pattern) => {
    if (pattern.quantity > 0) {
        if (selectedOrderType.value === 'Own-Use' && cartQuantity.value + pattern.quantity > 4) {
            alert('For Own-Use orders, the total quantity cannot exceed 4 tires.');
            return;
        }

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

// Clear Ship To data when order type changes to DS
watch(selectedOrderType, (newType) => {
    if (newType === 'DS') {
        shipToAccount.value = '';
        shipToAddress1.value = '';
        shipToAddress2.value = '';
        shipToAddress3.value = '';
        shipToAddress4.value = '';
        datetime24h.value = null;
        selectedDeliveryMethod.value = null;
    }
});
</script>
