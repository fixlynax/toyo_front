<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Account -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown filter v-model="selectedCustomer" :options="customerOptions" optionLabel="display" placeholder="Select a Customer" class="w-full" :loading="loadingCustomers" @change="onCustomerChange" />
                </div>

                <!-- Order Type -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Order Type</label>
                    <Dropdown v-model="selectedOrderType" :options="orderTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Order Type" class="w-full" />
                </div>

                <!-- Delivery Method -->
                <div v-if="selectedOrderType === 'NORMAL'" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Delivery Method</label>
                    <Dropdown v-model="selectedDeliveryMethod" :options="deliveryMethodOptions" placeholder="Select Delivery Method" class="w-full" />
                </div>
            </div>
        </div>

        <!-- Direct Shipment Section -->
        <div v-if="selectedOrderType === 'DIRECTSHIP'" class="card rounded-xl shadow-md p-6 text-black mb-12 bg-white">
            <!-- Header + Toggle on one line -->
            <div class="flex items-center justify-between mb-6">
                <div class="text-2xl font-bold">Direct Shipment</div>

                <!-- Container Size Toggle -->
                <div class="flex bg-gray-200 rounded-full w-40 h-12 p-1">
                    <!-- 20FT -->
                    <div
                        @click="selectedContainerSize = '20FT'"
                        :class="['flex-1 flex items-center justify-center rounded-full cursor-pointer font-semibold transition-all duration-300', selectedContainerSize === '20FT' ? 'bg-blue-500 text-white' : 'text-gray-700']"
                    >
                        20FT
                    </div>

                    <!-- 40FT -->
                    <div
                        @click="selectedContainerSize = '40FT'"
                        :class="['flex-1 flex items-center justify-center rounded-full cursor-pointer font-semibold transition-all duration-300', selectedContainerSize === '40FT' ? 'bg-blue-500 text-white' : 'text-gray-700']"
                    >
                        40FT
                    </div>
                </div>
            </div>

            <!-- Progress -->
            <div class="bg-gray-100 p-4 rounded-lg">
                <label class="block font-bold text-gray-700 text-center">Progress</label>
                <ProgressBar :value="progressValue" class="mt-2 h-4 rounded-full" showValue="false" />
                <div class="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{{ progressValue }}% filled</span>
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
                    <div class="text-xl font-bold">{{ selectedTyres.length }}</div>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-sm text-gray-500">PCS</div>
                    <div class="text-xl font-bold">{{ cartQuantity }}</div>
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
                <template #empty>No products found.</template>
                <template #loading>Loading products. Please wait...</template>

                <Column field="materialid" header="Material ID" style="min-width: 6rem" />
                <Column field="pattern" header="Pattern" style="min-width: 8rem" />
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
                <Column field="price" header="Price (RM)" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.price ? data.price.toFixed(2) : '0.00' }}
                    </template>
                </Column>
                <Column field="stockBalance" header="Stock" style="min-width: 6rem">
                    <template #body="{ data }">
                        <span :class="{ 'text-green-600 font-semibold': data.stockBalance > 0, 'text-red-600': data.stockBalance === 0 }">
                            {{ data.stockBalance || 0 }}
                        </span>
                    </template>
                </Column>

                <Column header="Action" style="width: 12rem">
                    <template #body="{ data }">
                        <Button label="Add to Cart" icon="pi pi-shopping-cart" class="p-button-primary" @click="addToCart(data)" :disabled="isInCart(data) || data.stockBalance === 0" />
                    </template>
                </Column>
            </DataTable>

            <!-- Overlay Panels -->
            <OverlayPanel ref="patternPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Pattern</label>
                    <Dropdown
                        v-model="filters['pattern'].value"
                        :options="patternOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select pattern"
                        filter
                        showClear
                        class="w-full"
                        @change="onColumnFilter('pattern', filters['pattern'].value)"
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
                <Column field="pattern" header="Pattern" />
                <Column field="size" header="Size" />
                <Column field="origin" header="Origin" />
                <Column header="Price (RM)">
                    <template #body="{ data }">
                        {{ data.price ? data.price.toFixed(2) : '0.00' }}
                    </template>
                </Column>
                <Column header="Stock">
                    <template #body="{ data }">
                        <span :class="{ 'text-green-600 font-semibold': data.stockBalance > 0, 'text-red-600': data.stockBalance === 0 }">
                            {{ data.stockBalance || 0 }}
                        </span>
                    </template>
                </Column>
                <Column header="Quantity" style="width: 16rem">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.quantity"
                            :min="1"
                            :max="getMaxQuantity(data)"
                            :showButtons="true"
                            buttonLayout="horizontal"
                            incrementButtonClass="p-button-outlined p-button-sm"
                            decrementButtonClass="p-button-outlined p-button-sm"
                            incrementButtonIcon="pi pi-plus"
                            decrementButtonIcon="pi pi-minus"
                            class="w-20 text-center"
                        />
                        <div v-if="data.quantity > data.stockBalance" class="text-xs text-red-500 mt-1">Max available: {{ data.stockBalance }}</div>
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
        <div v-if="showShipToDetails" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Ship To Details</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Ship To Account No.</label>
                    <Dropdown v-model="shipToAccount" :options="shipToOptions" optionLabel="display" placeholder="Select Ship To Account" class="w-full" :loading="loadingShipTo" @change="onShipToAccountChange" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700">Address Line 1</label>
                    <InputText v-model="shipToAddress1" placeholder="Address Line 1" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 2</label>
                    <InputText v-model="shipToAddress2" placeholder="Address Line 2" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 3</label>
                    <InputText v-model="shipToAddress3" placeholder="Address Line 3" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Address Line 4</label>
                    <InputText v-model="shipToAddress4" placeholder="Address Line 4" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">City</label>
                    <InputText v-model="shipToCity" placeholder="City" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">State</label>
                    <InputText v-model="shipToState" placeholder="State" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Postcode</label>
                    <InputText v-model="shipToPostcode" placeholder="Postcode" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Country</label>
                    <InputText v-model="shipToCountry" placeholder="Country" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Phone Number</label>
                    <InputText v-model="shipToPhone" placeholder="Phone Number" class="w-full" readonly />
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Mobile Number</label>
                    <InputText v-model="shipToMobile" placeholder="Mobile Number" class="w-full" readonly />
                </div>
            </div>
            <div class="flex justify-end mt-8 gap-4">
                <div class="w-32">
                    <Button label="Cancel" class="p-button-secondary" @click="router.back()" />
                </div>
                <div class="w-32">
                    <Button label="Checkout" class="flex-1 bg-primary text-white rounded-lg py-2 font-semibold hover:bg-primary-dark transition" @click="onCheckout" :disabled="!canCheckout || processingOrder" :loading="processingOrder" />
                </div>
            </div>
        </div>

        <!-- Order Processing Dialog -->
        <Dialog v-model:visible="showOrderDialog" :style="{ width: '500px' }" header="Order Processing" :modal="true" :closable="false">
            <div class="flex flex-col items-center gap-4">
                <ProgressSpinner v-if="orderStatus === 'processing'" style="width: 50px; height: 50px" strokeWidth="4" />
                <i v-else-if="orderStatus === 'success'" class="pi pi-check-circle text-green-500 text-5xl"></i>
                <i v-else-if="orderStatus === 'error'" class="pi pi-times-circle text-red-500 text-5xl"></i>

                <div class="text-center">
                    <div class="font-bold text-lg mb-2">{{ orderMessage }}</div>
                    <div v-if="orderStatus === 'processing'" class="text-gray-600">Please wait while we process your order...</div>
                    <div v-if="orderDetails" class="text-sm text-gray-600 mt-2">
                        <div v-if="orderDetails.orderRefNo">Order Number: {{ orderDetails.orderRefNo }}</div>
                        <div v-if="orderDetails.backOrderRefNo">Back Order Number: {{ orderDetails.backOrderRefNo }}</div>
                    </div>
                    <div v-if="orderError" class="text-sm text-red-600 mt-2">
                        {{ orderError }}
                    </div>
                </div>
            </div>
            <template #footer>
                <Button v-if="orderStatus === 'success' || orderStatus === 'error'" label="Close" icon="pi pi-check" @click="closeOrderDialog" class="p-button-primary" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

// Form Data
const selectedCustomer = ref(null);
const selectedOrderType = ref('NORMAL');
const selectedDeliveryMethod = ref('DELIVER');
const selectedContainerSize = ref('20FT');

// Ship To Details
const shipToAccount = ref(null);
const shipToAddress1 = ref('');
const shipToAddress2 = ref('');
const shipToAddress3 = ref('');
const shipToAddress4 = ref('');
const shipToCity = ref('');
const shipToState = ref('');
const shipToPostcode = ref('');
const shipToCountry = ref('');
const shipToPhone = ref('');
const shipToMobile = ref('');

// Order Processing
const processingOrder = ref(false);
const showOrderDialog = ref(false);
const orderStatus = ref('');
const orderMessage = ref('');
const orderDetails = ref(null);
const orderError = ref('');
const currentCartRefNo = ref('');

// Options
const customerOptions = ref([]);
const orderTypeOptions = ref([
    { label: 'Normal', value: 'NORMAL' },
    { label: 'Direct Shipment', value: 'DIRECTSHIP' }
]);
const deliveryMethodOptions = ['DELIVER'];
const shipToOptions = ref([]);

// Loading states
const loading = ref(false);
const loadingCustomers = ref(false);
const loadingShipTo = ref(false);

// Tyre data
const tyres = ref([]);

// Filters
const filters = ref({
    pattern: { value: '', matchMode: 'contains' },
    size: { value: '', matchMode: 'contains' },
    sectionwidth: { value: '', matchMode: 'contains' }
});

// Cart
const selectedTyres = ref([]);

// Overlay panels
const patternPanel = ref(null);
const sizePanel = ref(null);
const widthPanel = ref(null);

// Computed Properties
const cartTotal = computed(() => selectedTyres.value.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0));

const cartQuantity = computed(() => selectedTyres.value.reduce((sum, item) => sum + (item.quantity || 1), 0));

const progressValue = computed(() => {
    if (!selectedContainerSize.value || cartQuantity.value === 0) return 0;
    const containerCapacity = selectedContainerSize.value === '20FT' ? 1000 : 2000;
    const progress = Math.min((cartQuantity.value / containerCapacity) * 100, 100);
    return Math.round(progress);
});

const showShipToDetails = computed(() => (selectedDeliveryMethod.value === 'DELIVER' || selectedOrderType.value === 'DIRECTSHIP') && selectedCustomer.value);

const canCheckout = computed(() => selectedTyres.value.length > 0 && shipToAccount.value && selectedCustomer.value && selectedTyres.value.every((item) => item.quantity <= item.stockBalance));

// Dropdown options
const patternOptions = computed(() => {
    const patterns = uniqueSorted(tyres.value.map((t) => t.pattern).filter(Boolean));
    return patterns.map((v) => ({ label: v, value: v }));
});

const sizeOptions = computed(() => {
    const sizes = uniqueSorted(tyres.value.map((t) => t.size).filter(Boolean));
    return sizes.map((v) => ({ label: v, value: v }));
});

const widthOptions = computed(() => {
    const widths = uniqueSorted(tyres.value.map((t) => t.sectionwidth?.toString()).filter(Boolean));
    return widths.map((v) => ({ label: v, value: v }));
});

const filteredTyres = computed(() => {
    return tyres.value.filter((t) => {
        const pMatch = !filters.value.pattern.value || t.pattern === filters.value.pattern.value;
        const sMatch = !filters.value.size.value || t.size === filters.value.size.value;
        const wMatch = !filters.value.sectionwidth.value || (t.sectionwidth && t.sectionwidth.toString() === filters.value.sectionwidth.value);
        return pMatch && sMatch && wMatch;
    });
});

// Helper function for unique sorted values
const uniqueSorted = (arr) => [...new Set(arr)].sort((a, b) => (a > b ? 1 : -1));

// Helper function to get maximum quantity based on stock
const getMaxQuantity = (tyre) => {
    return Math.min(tyre.stockBalance || 0, 999);
};

// API Calls
const fetchCustomers = async () => {
    loadingCustomers.value = true;
    try {
        const response = await api.post('list_dealer', {
            mainBranch: 0
        });

        if (response.data.status === 1) {
            const dealers = response.data.admin_data;
            customerOptions.value = Object.keys(dealers).map((custAccountNo) => {
                const shop = dealers[custAccountNo].shop;
                return {
                    name: shop.custAccountName || 'Unknown',
                    code: custAccountNo,
                    display: `${[shop.companyName1, shop.companyName2, shop.companyName3, shop.companyName4].filter(Boolean).join(', ') || 'Unknown'} (${custAccountNo})`,
                    shopData: shop
                };
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customers', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching customers:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customers', life: 3000 });
    } finally {
        loadingCustomers.value = false;
    }
};

const fetchShipToAddresses = async (custAccountNo) => {
    if (!custAccountNo) return;

    loadingShipTo.value = true;
    try {
        const response = await api.post('list_dealer_shipto', {
            custaccountno: custAccountNo
        });

        if (response.data.status === 1) {
            const dealerData = response.data.admin_data;

            // Create ship to options from the shipto_list
            const shiptoList = dealerData.shipto_list || [];
            shipToOptions.value = shiptoList.map((shipto) => {
                const addressParts = [shipto.addressLine1, shipto.addressLine2, shipto.addressLine3, shipto.addressLine4].filter(Boolean);

                const displayAddress = addressParts.length > 0 ? addressParts.join(', ') : 'No address available';

                return {
                    id: shipto.id,
                    code: shipto.custAccountNo,
                    companyName: shipto.companyName1,
                    display: `${shipto.custAccountNo} - ${displayAddress}`,
                    address1: shipto.addressLine1 || '',
                    address2: shipto.addressLine2 || '',
                    address3: shipto.addressLine3 || '',
                    address4: shipto.addressLine4 || '',
                    city: shipto.city || '',
                    state: shipto.state || '',
                    postcode: shipto.postcode || '',
                    country: shipto.country || '',
                    phone: shipto.phoneNumber || '',
                    mobile: shipto.mobileNumber || ''
                };
            });

            // Add main dealer address as first option
            if (dealerData) {
                const mainAddressParts = [dealerData.addressLine1, dealerData.addressLine2, dealerData.addressLine3, dealerData.addressLine4].filter(Boolean);

                const mainDisplayAddress = mainAddressParts.length > 0 ? mainAddressParts.join(', ') : 'No address available';

                shipToOptions.value.unshift({
                    id: 'main',
                    code: dealerData.custAccountNo,
                    companyName: dealerData.companyName1,
                    display: `${dealerData.custAccountNo} (Main) - ${mainDisplayAddress}`,
                    address1: dealerData.addressLine1 || '',
                    address2: dealerData.addressLine2 || '',
                    address3: dealerData.addressLine3 || '',
                    address4: dealerData.addressLine4 || '',
                    city: dealerData.city || '',
                    state: dealerData.state || '',
                    postcode: dealerData.postcode || '',
                    country: dealerData.country || '',
                    phone: dealerData.phoneNumber || '',
                    mobile: dealerData.mobileNumber || ''
                });
            }

            // Set default ship to account
            if (shipToOptions.value.length > 0) {
                shipToAccount.value = shipToOptions.value[0];
                updateShipToFields(shipToAccount.value);
            }
        } else {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'No ship-to addresses found', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching ship to addresses:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load ship-to addresses', life: 3000 });
    } finally {
        loadingShipTo.value = false;
    }
};

const fetchMaterials = async (custAccountNo) => {
    if (!custAccountNo) return;

    loading.value = true;
    try {
        const response = await api.post('list-material', {
            type: 'ADDTOCART',
            custaccountno: custAccountNo
        });

        if (response.data.status === 1) {
            const materials = response.data.admin_data || [];

            tyres.value = materials.map((material) => {
                const size = `${material.sectionwidth || ''}/${material.tireseries || ''} R${material.rimdiameter || ''}`;
                const price = parseFloat(material.price) || 0;
                const stockBalance = material.stockLevel?.stockBalance || 0;

                return {
                    id: material.materialid,
                    materialid: material.materialid,
                    pattern: material.pattern || 'N/A',
                    size: size,
                    sectionwidth: material.sectionwidth,
                    tireseries: material.tireseries,
                    rimdiameter: material.rimdiameter,
                    speedplyrating: material.speedplyrating || 'N/A',
                    origin: material.origin || 'Unknown',
                    price: price,
                    stockBalance: stockBalance,
                    quantity: 1,
                    volume: parseFloat(material.volume) || 0,
                    material: material.material,
                    materialtype: material.materialtype || 'ZFP2',
                    plant: 'TSM',
                    itemcategory: material.materialtype || 'ZFP2'
                };
            });
        } else {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'No products available for this customer', life: 3000 });
            tyres.value = [];
        }
    } catch (error) {
        console.error('Error fetching materials:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products', life: 3000 });
        tyres.value = [];
    } finally {
        loading.value = false;
    }
};

// NEW: Add to Cart API (following Postman structure)
const addToCartAPI = async () => {
    if (!selectedCustomer.value || !shipToAccount.value || selectedTyres.value.length === 0) {
        throw new Error('Missing required data for checkout');
    }

    // Prepare order array according to Postman API requirements
    const orderArray = selectedTyres.value.map((item) => ({
        materialId: item.materialid,
        qty: item.quantity.toString(),
        price: item.price.toString()
    }));

    // Prepare request payload based on Postman reference
    const payload = {
        order_array: JSON.stringify(orderArray),
        orderType: selectedOrderType.value,
        shipto: shipToAccount.value.id.toString(), // Send ID, not custAccountNo
        deliveryType: selectedDeliveryMethod.value,
        custaccountno: selectedCustomer.value.code
    };

    // Add DIRECTSHIP specific fields
    if (selectedOrderType.value === 'DIRECTSHIP') {
        payload.containerSize = selectedContainerSize.value;
        payload.cartRefNo = currentCartRefNo.value || 'REF000000278'; // Use existing or default
    }

    console.log('Sending add-to-cart payload:', payload);

    const response = await api.post('order/add-to-cart-admin', payload);
    return response.data;
};

// Order Flow APIs (updated for DIRECTSHIP)
const createEmptyDsCart = async () => {
    if (!selectedCustomer.value) {
        throw new Error('No customer selected');
    }

    try {
        const response = await api.post('order/createEmptyDsCart-admin', {
            custaccountno: selectedCustomer.value.code
        });

        if (response.data.status === 1) {
            return response.data.eten_data.cartRefNo;
        } else {
            throw new Error(response.data.error?.message || 'Failed to create cart');
        }
    } catch (error) {
        console.error('Error creating cart:', error);
        throw new Error('Failed to create order cart');
    }
};

const resetDsCart = async (cartRefNo) => {
    try {
        const response = await api.get(`order/resetDsCart-admin/${cartRefNo}`);
        return response.data.status === 1;
    } catch (error) {
        console.error('Error resetting cart:', error);
        return false;
    }
};

const confirmOrder = async (cartRefNo, orderData) => {
    try {
        // Prepare order array according to API requirements
        const orderArray = orderData.items.map((item, index) => ({
            materialid: item.materialid,
            itemno: String(index + 1).padStart(5, '0'), // 5-digit item number
            itemcategory: item.itemcategory || 'ZFP2',
            plant: item.plant || 'TSM',
            qty: item.quantity.toString(),
            price: item.price.toString(),
            salesprogramid: null // Required field but can be null
        }));

        console.log('Sending order array:', orderArray);

        const response = await api.post(`order/confirm-order-admin/${cartRefNo}`, {
            order_array: JSON.stringify(orderArray),
            order_remark: `Order created via admin interface - ${orderData.orderType}`
        });

        return response.data;
    } catch (error) {
        console.error('Error confirming order:', error);
        if (error.response?.data) {
            console.error('API Error response:', error.response.data);
        }
        throw new Error('Failed to confirm order');
    }
};

const confirmBackOrder = async (cartRefNo, orderData, backOrderItems) => {
    try {
        const orderArray = orderData.items
            .filter((item) => !backOrderItems.includes(item.materialid))
            .map((item, index) => ({
                materialid: item.materialid,
                itemno: String(index + 1).padStart(5, '0'),
                itemcategory: item.itemcategory || 'ZFP2',
                plant: item.plant || 'TSM',
                qty: item.quantity.toString(),
                price: item.price.toString(),
                salesprogramid: null
            }));

        const backOrderArray = orderData.items
            .filter((item) => backOrderItems.includes(item.materialid))
            .map((item, index) => ({
                materialid: item.materialid,
                itemno: String(index + 1).padStart(5, '0'),
                itemcategory: item.itemcategory || 'ZFP2',
                plant: item.plant || 'TSM',
                qty: item.quantity.toString(),
                price: item.price.toString(),
                salesprogramid: null
            }));

        console.log('Sending backorder data:', {
            order_array: orderArray,
            backorder_array: backOrderArray
        });

        const response = await api.post(`order/confirm-backorder-admin/${cartRefNo}`, {
            order_array: JSON.stringify(orderArray),
            backorder_array: JSON.stringify(backOrderArray),
            order_remark: `Order with backorder created via admin interface - ${orderData.orderType}`
        });

        return response.data;
    } catch (error) {
        console.error('Error confirming back order:', error);
        if (error.response?.data) {
            console.error('API Error response:', error.response.data);
        }
        throw new Error('Failed to confirm back order');
    }
};

// Event Handlers
const onCustomerChange = (event) => {
    if (event.value && event.value.code) {
        fetchMaterials(event.value.code);
        fetchShipToAddresses(event.value.code);
    } else {
        resetAllData();
    }
};

const onShipToAccountChange = (event) => {
    if (event.value) {
        updateShipToFields(event.value);
    } else {
        resetShipToFields();
    }
};

const onColumnFilter = (field, value) => {
    filters.value[field].value = value;
};

const addToCart = (tyre) => {
    if (tyre.stockBalance === 0) {
        toast.add({ severity: 'warn', summary: 'Out of Stock', detail: 'This product is currently out of stock', life: 3000 });
        return;
    }

    const existing = selectedTyres.value.find((t) => t.id === tyre.id);
    if (existing) {
        if (existing.quantity < tyre.stockBalance) {
            existing.quantity += 1;
            toast.add({ severity: 'success', summary: 'Success', detail: 'Quantity updated in cart', life: 2000 });
        } else {
            toast.add({ severity: 'warn', summary: 'Stock Limit', detail: 'Cannot exceed available stock', life: 3000 });
        }
    } else {
        selectedTyres.value.push({
            ...tyre,
            quantity: 1
        });
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart', life: 2000 });
    }
};

const removeFromCart = (tyre) => {
    const index = selectedTyres.value.findIndex((t) => t.id === tyre.id);
    if (index !== -1) {
        selectedTyres.value.splice(index, 1);
        toast.add({ severity: 'info', summary: 'Removed', detail: 'Product removed from cart', life: 2000 });
    }
};

const isInCart = (tyre) => selectedTyres.value.some((t) => t.id === tyre.id);

const onCheckout = async () => {
    if (!canCheckout.value) {
        if (selectedTyres.value.length === 0) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please add products to cart', life: 3000 });
        } else if (!shipToAccount.value) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select ship to address', life: 3000 });
        } else if (selectedTyres.value.some((item) => item.quantity > item.stockBalance)) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Some items exceed available stock', life: 3000 });
        }
        return;
    }

    processingOrder.value = true;
    showOrderDialog.value = true;
    orderStatus.value = 'processing';
    orderMessage.value = 'Creating your order...';
    orderError.value = '';

    try {
        // For DIRECTSHIP orders, use the new add-to-cart API
        if (selectedOrderType.value === 'DIRECTSHIP') {
            orderMessage.value = 'Creating direct shipment order...';

            // Step 1: Create empty cart for DIRECTSHIP
            currentCartRefNo.value = await createEmptyDsCart();
            console.log('DIRECTSHIP Cart created:', currentCartRefNo.value);

            // Step 2: Use the add-to-cart API for DIRECTSHIP
            const result = await addToCartAPI();
            console.log('DIRECTSHIP Order result:', result);

            if (result.status === 1) {
                orderStatus.value = 'success';
                orderMessage.value = 'Direct shipment order created successfully!';

                // Clear cart
                selectedTyres.value = [];

                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Direct shipment order created successfully',
                    life: 5000
                });
            } else {
                orderError.value = result.message || 'Direct shipment order failed';
                throw new Error(result.message || 'Direct shipment order failed');
            }
        } else {
            // For NORMAL orders, use existing flow
            // Prepare order data
            const orderData = {
                customer: selectedCustomer.value,
                orderType: selectedOrderType.value,
                deliveryMethod: selectedDeliveryMethod.value,
                containerSize: selectedContainerSize.value,
                shipTo: shipToAccount.value,
                items: selectedTyres.value,
                total: cartTotal.value,
                timestamp: new Date().toISOString()
            };

            // Step 1: Create empty cart
            orderMessage.value = 'Creating order cart...';
            currentCartRefNo.value = await createEmptyDsCart();
            console.log('Cart created:', currentCartRefNo.value);

            // Step 2: Confirm order
            orderMessage.value = 'Processing order with SAP...';
            const result = await confirmOrder(currentCartRefNo.value, orderData);
            console.log('Order result:', result);

            if (result.status === 1) {
                // Order successful
                orderStatus.value = 'success';
                orderMessage.value = 'Order created successfully!';
                orderDetails.value = {
                    orderRefNo: result.eten_data.orderRefNo
                };

                // Clear cart
                selectedTyres.value = [];

                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Order ${result.eten_data.orderRefNo} created successfully`,
                    life: 5000
                });
            } else if (result.status === 0 && result.eten_data) {
                // Handle backorder scenario
                console.log('Backorder scenario detected:', result.eten_data);

                const backOrderData = result.eten_data[0];
                const backOrderItems = backOrderData?.unfulfilled_items?.filter((item) => item.materialid && item.materialid.trim() !== '').map((item) => item.materialid) || [];

                console.log('Backorder items:', backOrderItems);

                if (backOrderItems.length > 0) {
                    orderMessage.value = 'Processing order with backorder items...';
                    const backOrderResult = await confirmBackOrder(currentCartRefNo.value, orderData, backOrderItems);
                    console.log('Backorder result:', backOrderResult);

                    if (backOrderResult.status === 1) {
                        orderStatus.value = 'success';
                        orderMessage.value = 'Order created with backorder items!';
                        orderDetails.value = {
                            orderRefNo: backOrderResult.eten_data.orderRefNo,
                            backOrderRefNo: backOrderResult.eten_data.backOrderRefNo
                        };

                        // Clear cart
                        selectedTyres.value = [];

                        toast.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `Order ${backOrderResult.eten_data.orderRefNo} created with backorder ${backOrderResult.eten_data.backOrderRefNo}`,
                            life: 5000
                        });
                    } else {
                        orderError.value = backOrderResult.message || 'Failed to create back order';
                        throw new Error(backOrderResult.message || 'Failed to create back order');
                    }
                } else {
                    orderError.value = result.message || 'Order processing failed - no items fulfilled';
                    throw new Error(result.message || 'Order processing failed - no items fulfilled');
                }
            } else {
                orderError.value = result.message || 'Order processing failed';
                throw new Error(result.message || 'Order processing failed');
            }
        }
    } catch (error) {
        console.error('Checkout error:', error);
        orderStatus.value = 'error';
        orderMessage.value = 'Failed to process order';
        orderError.value = error.message || 'Unknown error occurred';

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to process order',
            life: 5000
        });

        // Reset cart on error
        if (currentCartRefNo.value) {
            try {
                await resetDsCart(currentCartRefNo.value);
                console.log('Cart reset successfully');
            } catch (resetError) {
                console.error('Error resetting cart:', resetError);
            }
        }
    } finally {
        processingOrder.value = false;
    }
};

const closeOrderDialog = () => {
    showOrderDialog.value = false;
    orderStatus.value = '';
    orderMessage.value = '';
    orderDetails.value = null;
    orderError.value = '';
    currentCartRefNo.value = '';
};

// Helper Functions
const updateShipToFields = (shipto) => {
    shipToAddress1.value = shipto.address1 || '';
    shipToAddress2.value = shipto.address2 || '';
    shipToAddress3.value = shipto.address3 || '';
    shipToAddress4.value = shipto.address4 || '';
    shipToCity.value = shipto.city || '';
    shipToState.value = shipto.state || '';
    shipToPostcode.value = shipto.postcode || '';
    shipToCountry.value = shipto.country || '';
    shipToPhone.value = shipto.phone || '';
    shipToMobile.value = shipto.mobile || '';
};

const resetShipToFields = () => {
    shipToAddress1.value = '';
    shipToAddress2.value = '';
    shipToAddress3.value = '';
    shipToAddress4.value = '';
    shipToCity.value = '';
    shipToState.value = '';
    shipToPostcode.value = '';
    shipToCountry.value = '';
    shipToPhone.value = '';
    shipToMobile.value = '';
};

const resetAllData = () => {
    tyres.value = [];
    selectedTyres.value = [];
    shipToOptions.value = [];
    shipToAccount.value = null;
    resetShipToFields();
    resetFilters();
};

const resetFilters = () => {
    filters.value.pattern.value = '';
    filters.value.size.value = '';
    filters.value.sectionwidth.value = '';
};

// Watchers
watch(selectedOrderType, (newType) => {
    if (newType === 'DIRECTSHIP') {
        selectedDeliveryMethod.value = null;
        if (shipToOptions.value.length > 0) {
            shipToAccount.value = shipToOptions.value[0];
            updateShipToFields(shipToAccount.value);
        }
    }
});

watch(selectedCustomer, (newCustomer) => {
    if (!newCustomer) {
        resetAllData();
    }
});

// Initialize
onMounted(() => {
    fetchCustomers();
});
</script>
