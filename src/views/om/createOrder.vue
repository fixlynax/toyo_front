<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        </div>

        <div v-if="selectedOrderType === 'DS'" class="card rounded-xl shadow-md p-6 text-black mb-12 bg-white">
            <!-- Header + Toggle on one line -->
            <div class="flex items-center justify-between mb-6">
                <div class="text-2xl font-bold">Direct Shipment</div>

                <!-- Container Size Toggle -->
                <div class="flex bg-gray-200 rounded-full w-40 h-12 p-1">
                    <!-- 20FT -->
                    <div
                        @click="selectedContainerSize = '20ft'"
                        :class="['flex-1 flex items-center justify-center rounded-full cursor-pointer font-semibold transition-all duration-300', selectedContainerSize === '20ft' ? 'bg-blue-500 text-white' : 'text-gray-700']"
                    >
                        20FT
                    </div>

                    <!-- 40FT -->
                    <div
                        @click="selectedContainerSize = '40ft'"
                        :class="['flex-1 flex items-center justify-center rounded-full cursor-pointer font-semibold transition-all duration-300', selectedContainerSize === '40ft' ? 'bg-blue-500 text-white' : 'text-gray-700']"
                    >
                        40FT
                    </div>
                </div>
            </div>

            <!-- Progress -->
            <div class="bg-gray-100 p-4 rounded-lg">
                <label class="block font-bold text-gray-700 text-center">Progress</label>
                <ProgressBar :value="selectedContainerSize ? 100 : 0" class="mt-2 h-4 rounded-full" showValue="false" />
                <!-- Need To Update With material Size  -->
                <div class="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0% filled</span>
                    <span>Minimum requirement: 95%</span>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-sm text-gray-500">Total Value</div>
                    <div class="text-xl font-bold">RM {{ cartTotal.toFixed(2) }}</div>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-sm text-gray-500">Total Items</div>
                    <div class="text-xl font-bold">3</div>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-sm text-gray-500">PCS</div>
                    <div class="text-xl font-bold">0</div>
                </div>
            </div>
        </div>

        <!-- Product Selection -->
        <div class="card flex flex-col gap-6">
            <div class="flex items-center justify-between border-b pb-2">
                <div class="text-2xl font-bold text-gray-800">Select Products</div>
                <div class="flex gap-2">
                    <Button label="Pattern" icon="pi pi-filter" @click="patternPanel.toggle($event)" />
                    <Button label="Size" icon="pi pi-filter" @click="sizePanel.toggle($event)" />
                    <Button label="Width" icon="pi pi-filter" @click="widthPanel.toggle($event)" />
                </div>
            </div>

            <DataTable :value="filteredTyres" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" :rowHover="true" :loading="loading">
                <template #empty>No data found.</template>
                <template #loading>Loading data. Please wait...</template>

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

                <Column header="Action" style="width: 12rem">
                    <template #body="{ data }">
                        <Button label="Add to Cart" icon="pi pi-shopping-cart" class="p-button-primary" @click="addToCart(data)" />
                    </template>
                </Column>
            </DataTable>

            <!-- Overlay Panels -->
            <OverlayPanel ref="patternPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Pattern</label>
                    <Dropdown
                        v-model="filters['pattern_name'].value"
                        :options="patternOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select pattern"
                        filter
                        showClear
                        class="w-full"
                        @change="onColumnFilter('pattern_name', filters['pattern_name'].value)"
                    />
                </div>
            </OverlayPanel>

            <OverlayPanel ref="sizePanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Size</label>
                    <Dropdown v-model="filters['size'].value" :options="sizeOptions" optionLabel="label" optionValue="value" placeholder="Select size" filter showClear class="w-full" @change="onColumnFilter('size', filters['size'].value)" />
                </div>
            </OverlayPanel>

            <OverlayPanel ref="widthPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Width</label>
                    <Dropdown
                        v-model="filters['sectionwidth'].value"
                        :options="widthOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select width"
                        filter
                        showClear
                        class="w-full"
                        @change="onColumnFilter('sectionwidth', filters['sectionwidth'].value)"
                    />
                </div>
            </OverlayPanel>
        </div>

        <!-- Cart Section -->
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
                <Column header="Quantity " style="width: 16rem">
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

            <div class="text-right mt-4 font-bold text-lg">Total Price: RM {{ cartTotal.toFixed(2) }}</div>
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

        <!-- Pickup Info -->
        <div v-if="selectedDeliveryMethod === 'Pickup'" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Pickup Information</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block font-bold text-gray-700">Name</label>
                    <InputText v-model="shipToAccount" placeholder="Insert Name" class="w-full" />
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
                    <InputText v-model="shipToAddress3" placeholder="Insert Driver IC Number" class="w-full" />
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
const selectedContainerSize = ref('20ft');

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

// Tyre data
const tyres = ref([
    { id: 1, materialid: 'MAT-1001', pattern_name: 'Classic Stripe', size: '225/45R17', sectionwidth: 225, tireseries: 45, rimdiameter: 17, speedplyrating: 'W', origin: 'Malaysia', quantity: 1, price: 320.5 },
    { id: 2, materialid: 'MAT-1002', pattern_name: 'Sport Mesh', size: '235/40R18', sectionwidth: 235, tireseries: 40, rimdiameter: 18, speedplyrating: 'Y', origin: 'Japan', quantity: 1, price: 420.0 },
    { id: 3, materialid: 'MAT-1003', pattern_name: 'Luxury Diamond', size: '245/45R19', sectionwidth: 245, tireseries: 45, rimdiameter: 19, speedplyrating: 'W', origin: 'Thailand', quantity: 1, price: 480.75 }
]);

// Generate unique dropdown options
const uniqueSorted = (arr) => [...new Set(arr)].sort((a, b) => (a > b ? 1 : -1));
const patternOptions = uniqueSorted(tyres.value.map((t) => t.pattern_name)).map((v) => ({ label: v, value: v }));
const sizeOptions = uniqueSorted(tyres.value.map((t) => t.size)).map((v) => ({ label: v, value: v }));
const widthOptions = uniqueSorted(tyres.value.map((t) => t.sectionwidth.toString())).map((v) => ({ label: v, value: v }));

// Filters
const filters = ref({
    pattern_name: { value: '', matchMode: 'contains' },
    size: { value: '', matchMode: 'contains' },
    sectionwidth: { value: '', matchMode: 'contains' }
});

const loading = ref(false);
const selectedTyres = ref([]);
const cartTotal = computed(() => selectedTyres.value.reduce((sum, i) => sum + i.price * i.quantity, 0));
const cartQuantity = computed(() => selectedTyres.value.reduce((sum, i) => sum + i.quantity, 0));

// Overlay panels
const patternPanel = ref(null);
const sizePanel = ref(null);
const widthPanel = ref(null);

// Filter action
const onColumnFilter = (field, value) => {
    filters.value[field].value = value;
};

// Remove cart item
const removeFromCart = (tyre) => {
    const index = selectedTyres.value.findIndex((t) => t.id === tyre.id);
    if (index !== -1) selectedTyres.value.splice(index, 1);
};

const addToCart = (tyre) => {
    const existing = selectedTyres.value.find((t) => t.id === tyre.id);
    if (existing) {
        existing.quantity += 1; // increment quantity if already in cart
    } else {
        selectedTyres.value.push({ ...tyre, quantity: 1 });
    }
};

// Disable button if already in cart
const isInCart = (tyre) => selectedTyres.value.some((t) => t.id === tyre.id);

// Filtered tyres
const filteredTyres = computed(() => {
    return tyres.value.filter((t) => {
        const pMatch = !filters.value.pattern_name.value || t.pattern_name === filters.value.pattern_name.value;
        const sMatch = !filters.value.size.value || t.size === filters.value.size.value;
        const wMatch = !filters.value.sectionwidth.value || t.sectionwidth.toString() === filters.value.sectionwidth.value;
        return pMatch && sMatch && wMatch;
    });
});

// Watch DS reset
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
