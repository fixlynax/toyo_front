<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">➕ Create New Back Order</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <!-- Account No -->
                    <div class="flex-1">
                        <label for="custAccountNo" class="font-medium">Customer Account No.</label>
                        <InputText v-model="backOrder.custAccountNo" id="custAccountNo" type="text" class="w-full" />
                    </div>
                    
                    <!-- Search Customer Button -->
                    <div class="flex items-end">
                        <Button label="Search Customer" icon="pi pi-search" @click="searchCustomer" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 🏬 Dealer Information -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🏬 Dealer Information</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="dealerName">Company Name</label>
                        <InputText id="dealerName" type="text" v-model="backOrder.customerName" />
                    </div>
                    <div class="w-full">
                        <label for="location">Location</label>
                        <InputText id="location" type="text" v-model="backOrder.location" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="branch">Signboard</label>
                        <InputText id="branch" type="text" v-model="backOrder.signboard" />
                    </div>
                    <div class="w-full">
                        <label for="distributionChannel">Distribution Channel</label>
                        <Dropdown 
                            v-model="backOrder.distributionChannel" 
                            :options="distributionChannels" 
                            optionLabel="name" 
                            placeholder="Select Distribution Channel" 
                            class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="contactPerson">Contact Person</label>
                        <InputText id="contactPerson" type="text" v-model="warantyDetail.contactPerson" />
                    </div>
                    <div class="w-full">
                        <label for="contactNo">Contact Number</label>
                        <InputText id="contactNo" type="text" v-model="warantyDetail.contactNo" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 👤 Customer Info -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Customer Info</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="customerName">Customer Name</label>
                        <InputText id="customerName" type="text" v-model="customerInfo.name" />
                    </div>
                    <div class="w-full">
                        <label for="vehicle">Vehicle</label>
                        <InputText id="vehicle" type="text" v-model="customerInfo.vehicle" />
                    </div>
                    <div class="w-full">
                        <label for="regNo">Registration Number</label>
                        <InputText id="regNo" type="text" v-model="customerInfo.regNo" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 🛞 Tire Material & Description -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🛞 Tire Material & Description</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="tyreSize">Tyre Size</label>
                        <InputText id="tyreSize" type="text" v-model="tyre.size" />
                    </div>
                    <div class="w-full">
                        <label for="tyrespec">Tyre Spec</label>
                        <InputText id="tyrespec" type="text" v-model="tyre.tyrespec" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="rimDiameter">Rim Diameter</label>
                        <InputText id="rimDiameter" type="text" v-model="tyre.rimDiameter" />
                    </div>
                    <div class="w-full">
                        <label for="aspectRatio">Aspect Ratio</label>
                        <InputText id="aspectRatio" type="text" v-model="tyre.aspectRatio" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="sectionWidth">Section Width</label>
                        <InputText id="sectionWidth" type="text" v-model="tyre.sectionWidth" />
                    </div>
                    <div class="w-full">
                        <label for="quantity">Quantity</label>
                        <InputNumber id="quantity" v-model="tyre.quantity" mode="decimal" :min="1" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 🚚 Shipping & Delivery -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🚚 Shipping & Delivery</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="shipTo">Ship To</label>
                        <InputText id="shipTo" type="text" v-model="backOrder.shipTo" />
                    </div>
                    <div class="w-full">
                        <label for="orderDesc">Description</label>
                        <InputText id="orderDesc" type="text" v-model="backOrder.orderDesc" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="shippingCond">Shipping Condition</label>
                        <Dropdown 
                            v-model="backOrder.shippingCond" 
                            :options="shippingConditions" 
                            optionLabel="name" 
                            placeholder="Select Shipping Condition" 
                            class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="deliveryType">Delivery Type</label>
                        <Dropdown 
                            v-model="backOrder.deliveryType" 
                            :options="deliveryTypes" 
                            optionLabel="name" 
                            placeholder="Select Delivery Type" 
                            class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="deliveryDate">Delivery Date</label>
                        <Calendar id="deliveryDate" v-model="backOrder.deliveryDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="storageLocation">Storage Location</label>
                        <InputText id="storageLocation" type="text" v-model="backOrder.storageLocation" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between mt-8">
            <div class="w-40">
                <Button label="Cancel" class="w-full p-button-outlined p-button-secondary" @click="cancelOrder" />
            </div>
            <div class="flex gap-4">
                <div class="w-40">
                    <Button label="Save Draft" class="w-full p-button-outlined" @click="saveDraft" />
                </div>
                <div class="w-40">
                    <Button label="Create Order" class="w-full" @click="createOrder" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Dropdown options
const distributionChannels = ref([
    { name: "ETEN", code: "ETEN" },
    { name: "Retail", code: "RETAIL" },
    { name: "Wholesale", code: "WHOLESALE" },
]);

const shippingConditions = ref([
    { name: "Standard", code: "STANDARD" },
    { name: "Express", code: "EXPRESS" },
    { name: "Overnight", code: "OVERNIGHT" },
]);

const deliveryTypes = ref([
    { name: "Delivery", code: "DELIVER" },
    { name: "Pickup", code: "PICKUP" },
]);

// Form data
const backOrder = ref({
    custAccountNo: '',
    customerName: '',
    location: '',
    signboard: '',
    distributionChannel: '',
    shipTo: '',
    shippingCond: '',
    storageLocation: '',
    orderDesc: '',
    deliveryType: '',
    deliveryDate: '',
});

const warantyDetail = ref({
    contactPerson: "",
    contactNo: ""
});

const tyre = ref({
    size: "",
    tyrespec: "",
    rimDiameter: null,
    aspectRatio: "",
    sectionWidth: "",
    quantity: 1
});

const customerInfo = ref({
    name: "",
    vehicle: "",
    regNo: "",
});

// Methods
const searchCustomer = () => {
    // In a real app, this would call an API to fetch customer details
    console.log("Searching for customer with account:", backOrder.value.custAccountNo);
    // Mock data for demonstration
    if (backOrder.value.custAccountNo === '6080100900') {
        backOrder.value.customerName = 'PS Tyres & Battery Auto Services Sdn. Bhd';
        backOrder.value.location = '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia';
        backOrder.value.signboard = 'T10';
        warantyDetail.value.contactPerson = 'Ahmad Zaki';
        warantyDetail.value.contactNo = '+6012-3456789';
    }
};

const createOrder = () => {
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Create the back order
    console.log("Creating back order:", {
        backOrder: backOrder.value,
        tyre: tyre.value,
        warantyDetail: warantyDetail.value,
        customerInfo: customerInfo.value,
    });
    
    // Show success message
    // In a real app, this would call an API
    alert('Back order created successfully!');
    
    // Reset form
    resetForm();
};

const saveDraft = () => {
    console.log("Saving draft:", {
        backOrder: backOrder.value,
        tyre: tyre.value,
        warantyDetail: warantyDetail.value,
        customerInfo: customerInfo.value,
    });
    
    // Show success message
    alert('Draft saved successfully!');
};

const cancelOrder = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        resetForm();
    }
};

const validateForm = () => {
    // Basic validation
    if (!backOrder.value.custAccountNo) {
        alert('Please enter a customer account number');
        return false;
    }
    
    if (!backOrder.value.customerName) {
        alert('Please enter a company name');
        return false;
    }
    
    if (!tyre.value.size) {
        alert('Please enter a tyre size');
        return false;
    }
    
    if (!backOrder.value.deliveryDate) {
        alert('Please select a delivery date');
        return false;
    }
    
    return true;
};

const resetForm = () => {
    backOrder.value = {
        custAccountNo: '',
        customerName: '',
        location: '',
        signboard: '',
        distributionChannel: '',
        shipTo: '',
        shippingCond: '',
        storageLocation: '',
        orderDesc: '',
        deliveryType: '',
        deliveryDate: '',
    };
    
    warantyDetail.value = {
        contactPerson: "",
        contactNo: ""
    };
    
    tyre.value = {
        size: "",
        tyrespec: "",
        rimDiameter: null,
        aspectRatio: "",
        sectionWidth: "",
        quantity: 1
    };
    
    customerInfo.value = {
        name: "",
        vehicle: "",
        regNo: "",
    };
};

onMounted(() => {
    // Initialize any default values if needed
});
</script>