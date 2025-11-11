<template>
    <Fluid>
        <!-- Return Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Return Order</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Account -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown filter showClear v-model="selectedCustomer" :options="customerOptions" optionLabel="display" placeholder="Select a Customer" class="w-full" @change="onCustomerChange" />
                </div>

                <!-- Order Selection with Quick Search -->
                <div v-if="ordersForCustomer.length" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Select Order</label>
                    <Dropdown
                        filter
                        showClear
                        v-model="selectedOrder"
                        :options="ordersForCustomer"
                        optionLabel="orderNumber"
                        placeholder="Select an Order"
                        class="w-full"
                        :filterBy="'orderNumber'"
                        :filterFunction="customOrderFilter"
                        @change="onOrderChange"
                    />
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div v-if="selectedOrder" class="card flex flex-col gap-6 mt-4">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Products in Order</div>

            <DataTable :value="orderProducts" class="w-full">
                <Column field="pattern" header="Pattern" />
                <Column field="size" header="Size" />
                <Column field="origin" header="Origin" />
                <Column field="avlQty" header="Ordered Quantity">
                    <template #body="slotProps">
                        <div class="text-start w-full">
                            {{ slotProps.data.avlQty }}
                        </div>
                    </template>
                </Column>
                <Column header="Return Quantity">
                    <template #body="slotProps">
                        <InputNumber
                            v-model="slotProps.data.returnQty"
                            inputClass="!w-8 !h-7 text-sm text-center"
                            showButtons
                            buttonLayout="horizontal"
                            incrementButtonIcon="pi pi-plus text-xs"
                            decrementButtonIcon="pi pi-minus text-xs"
                            :min="0"
                            :max="slotProps.data.avlQty"
                            class="p-inputnumber-sm"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Return Reason and Image Upload -->
        <div v-if="selectedOrder" class="card mt-4 p-6 bg-white shadow-lg rounded-2xl">
            <div class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Return Reason & Images</div>

            <!-- Image Upload -->
            <div class="mb-6">
                <label class="block font-semibold text-gray-700 mb-2">Upload Image(s) (Optional)</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition" @click="$refs.fileInput.click()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M21 16v-6m0 0l-4 4m4-4l-4-4" />
                    </svg>
                    <span class="text-gray-500 text-sm">Click or drag file here to upload</span>
                </div>
                <input type="file" accept="image/*" ref="fileInput" @change="onImageChange" class="hidden" />

                <div v-if="returnImage" class="mt-4 flex gap-4 items-center flex-wrap relative">
                    <div class="relative inline-block">
                        <img :src="returnImage" alt="Uploaded Image" class="h-32 object-contain border rounded-lg shadow-sm" />
                        <button type="button" class="absolute top-1 right-0 text-red-600 bg-transparent hover:text-red-500 font-bold text-2xl p-1" @click="returnImage = null">×</button>
                    </div>
                </div>
            </div>

            <!-- Text Reason -->
            <label class="block font-semibold text-gray-700 mb-2">Reason for Return</label>
            <InputText v-model="returnReason" placeholder="Enter the reason for this return order" class="w-full" style="background-color: #f5f5f5" />

            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/listReturnOrder">
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
import { ref } from 'vue';

const selectedCustomer = ref(null);
const selectedOrder = ref(null);
const returnReason = ref('');
const returnImage = ref(null);

// Options with display (name + account no)
const customerOptions = [
    { name: 'ABC Motors Sdn Bhd', code: 'CUST001' },
    { name: 'Speed Tyre Enterprise', code: 'CUST002' },
    { name: 'GoAuto Garage', code: 'CUST003' }
].map((c) => ({ ...c, display: `${c.name} (${c.code})` }));

// Orders for selected customer
const ordersForCustomer = ref([]);
const orderProducts = ref([]);

// Mock data for orders
const allOrders = {
    CUST001: [
        {
            orderNumber: 'ORD-1001',
            products: [
                { pattern: 'Classic Stripe', size: '225/45R17', origin: 'Malaysia', avlQty: 4, returnQty: 0 },
                { pattern: 'Sport Mesh', size: '235/40R18', origin: 'Japan', avlQty: 2, returnQty: 0 }
            ]
        },
        { orderNumber: 'ORD-1002', products: [{ pattern: 'Luxury Diamond', size: '245/45R19', origin: 'Thailand', avlQty: 1, returnQty: 0 }] }
    ],
    CUST002: [{ orderNumber: 'ORD-2001', products: [{ pattern: 'Eco Line', size: '255/50R20', origin: 'Indonesia', avlQty: 3, returnQty: 0 }] }]
};

// When customer changes
const onCustomerChange = () => {
    selectedOrder.value = null;
    orderProducts.value = [];
    ordersForCustomer.value = allOrders[selectedCustomer.value?.code] || [];
};

// When order changes
const onOrderChange = () => {
    if (selectedOrder.value) {
        orderProducts.value = selectedOrder.value.products.map((p) => ({ ...p }));
    } else {
        orderProducts.value = [];
    }
};

// Custom filter function for orders dropdown
const customOrderFilter = (option, filter) => {
    if (!filter) return true;
    return option.orderNumber.toLowerCase().includes(filter.toLowerCase());
};

// Handle image selection
const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => (returnImage.value = e.target.result);
        reader.readAsDataURL(file);
    } else {
        returnImage.value = null;
    }
};

// Submit return order
const handleSubmit = () => {
    const productsToReturn = orderProducts.value.filter((p) => p.returnQty > 0);
    if (!selectedCustomer.value || !selectedOrder.value) {
        alert('Please select a customer and an order.');
        return;
    }
    if (!productsToReturn.length) {
        alert('Please enter return quantity for at least one product.');
        return;
    }
    console.log('Submitting Return Order:', {
        customer: selectedCustomer.value,
        order: selectedOrder.value?.orderNumber,
        products: productsToReturn,
        reason: returnReason.value,
        image: returnImage.value
    });
    alert('Return Order submitted! Check console for details.');
};
</script>
