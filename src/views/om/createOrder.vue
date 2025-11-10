<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Account -->
                <!-- Customer Account -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown filter v-model="selectedCustomer" :options="customerOptions" optionLabel="display" placeholder="Select a Customer" class="w-full" />
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
                <div class="flex gap-2">
                    <Button label="Pattern" icon="pi pi-filter" @click="patternPanel.toggle($event)" />
                    <Button label="Size" icon="pi pi-filter" @click="sizePanel.toggle($event)" />
                    <Button label="Width" icon="pi pi-filter" @click="widthPanel.toggle($event)" />
                </div>
            </div>

            <DataTable :value="tyres" selectionMode="multiple" v-model:selection="selectedTyres" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu">
                <template #empty>No data found.</template>
                <template #loading>Loading data. Please wait...</template>
                <Column selectionMode="multiple" style="width: 3rem"></Column>
                <Column field="materialid" header="Material ID" style="min-width: 6rem" />
                <Column field="pattern_name" header="Pattern" style="min-width: 8rem" />
                <Column field="origin" header="Origin" style="min-width: 8rem" />
                <Column field="size" header="Size" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col text-sm text-gray-700">
                            <div class="flex"><span class="w-40 font-semibold">Section Width:</span> {{ data.sectionwidth }}</div>
                            <div class="flex"><span class="w-40 font-semibold">Tire Series:</span> {{ data.tireseries }}</div>
                            <div class="flex"><span class="w-40 font-semibold">Rim Diameter:</span> {{ data.rimdiameter }}"</div>
                            <div class="flex"><span class="w-40 font-semibold">Speed Rating:</span> {{ data.speedplyrating }}</div>
                        </div>
                    </template>
                </Column>
            </DataTable>

            <!-- Overlay Panels -->
            <OverlayPanel ref="patternPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Search Pattern</label>
                    <InputText v-model="filters['pattern_name'].value" @input="onColumnFilter('pattern_name', filters['pattern_name'].value)" placeholder="Type pattern..." />
                </div>
            </OverlayPanel>
            <OverlayPanel ref="sizePanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Search Size</label>
                    <InputText v-model="filters['size'].value" @input="onColumnFilter('size', filters['size'].value)" placeholder="Type size..." />
                </div>
            </OverlayPanel>
            <OverlayPanel ref="widthPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Search Width</label>
                    <InputText v-model="filters['sectionwidth'].value" @input="onColumnFilter('sectionwidth', filters['sectionwidth'].value)" placeholder="Type width..." />
                </div>
            </OverlayPanel>
        </div>

        <!-- Cart Section -->
        <!-- Cart Section as DataTable -->
        <div v-if="selectedTyres.length" class="card mt-6">
            <div class="text-2xl font-bold border-b pb-2 mb-4">Selected Tyres (Cart)</div>

            <DataTable :value="selectedTyres" dataKey="id" :responsiveLayout="'scroll'" class="w-full">
                <Column field="pattern_name" header="Pattern" />
                <Column field="size" header="Size" />
                <Column field="origin" header="Origin" />
                <Column header="Price (RM)">
                    <template #body="{ data }">
                        {{ data.price.toFixed(2) }}
                    </template>
                </Column>
                <Column header="Quantity">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.quantity"
                            :min="1"
                            :max="selectedOrderType === 'Own-Use' ? 4 - cartQuantity + data.quantity : undefined"
                            :showButtons="true"
                            buttonLayout="horizontal"
                            incrementButtonClass="p-button-outlined p-button-sm"
                            decrementButtonClass="p-button-outlined p-button-sm"
                            incrementButtonIcon="pi pi-plus"
                            decrementButtonIcon="pi pi-minus"
                            class="w-20 text-center"
                        />
                    </template>
                </Column>
                <Column header="Action">
                    <template #body="{ data }">
                        <Button icon="pi pi-times" class="p-button-danger p-button-sm" @click="removeFromCart(data)" />
                    </template>
                </Column>
            </DataTable>

            <!-- Total Price -->
            <div class="text-right mt-4 font-bold text-lg">Total Price: RM {{ cartTotal.toFixed(2) }}</div>
            <div class="flex justify-end mt-8 gap-4">
                <div class="w-32">
                    <Button label="Cancel" class="p-button-secondary" @click="router.back()" />
                </div>
                <div class="w-32">
                    <RouterLink to="/om/confirmOrder">
                        <Button label="Checkout" class="flex-1 bg-primary text-white rounded-lg py-2 font-semibold hover:bg-primary-dark transition" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Form Data
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

// Options
const containerSizeOptions = ['20ft', '40ft'];
const customerOptions = [
    { name: 'ABC Motors Sdn Bhd', code: '6601035101' },
    { name: 'Speed Tyre Enterprise', code: '660103512313' },
    { name: 'GoAuto Garage', code: '6601035221' }
].map((c) => ({ ...c, display: `${c.name} (${c.code})` }));

const orderTypeOptions = ['Normal', 'DS', 'Own-Use'];
const deliveryMethodOptions = ['Pickup', 'Delivery', 'Lalamove'];

// Update tyres with prices
const tyres = ref([
    { id: 1, materialid: 'MAT-1001', pattern_name: 'Classic Stripe', size: '225/45R17', sectionwidth: 225, tireseries: 45, rimdiameter: 17, speedplyrating: 'W', origin: 'Malaysia', quantity: 1, price: 320.5 },
    { id: 2, materialid: 'MAT-1002', pattern_name: 'Sport Mesh', size: '235/40R18', sectionwidth: 235, tireseries: 40, rimdiameter: 18, speedplyrating: 'Y', origin: 'Japan', quantity: 1, price: 420.0 },
    { id: 3, materialid: 'MAT-1003', pattern_name: 'Luxury Diamond', size: '245/45R19', sectionwidth: 245, tireseries: 45, rimdiameter: 19, speedplyrating: 'W', origin: 'Thailand', quantity: 1, price: 480.75 }
]);

// Cart total
const cartTotal = computed(() => selectedTyres.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

// Selected Tyres (Cart)
const selectedTyres = ref([]);
const cartQuantity = computed(() => selectedTyres.value.reduce((sum, t) => sum + t.quantity, 0));

// Overlay Panels
const patternPanel = ref(null);
const sizePanel = ref(null);
const widthPanel = ref(null);

// Filters for DataTable
const filters = ref({
    pattern_name: { value: '', matchMode: 'contains' },
    size: { value: '', matchMode: 'contains' },
    sectionwidth: { value: '', matchMode: 'contains' }
});

const loading = ref(false);

// Filter function
const onColumnFilter = (field, value) => {
    filters.value[field].value = value;
};

// Remove from cart
const removeFromCart = (tyre) => {
    const index = selectedTyres.value.findIndex((t) => t.id === tyre.id);
    if (index !== -1) selectedTyres.value.splice(index, 1);
};

// Watch for DS order type to clear shipping info
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
