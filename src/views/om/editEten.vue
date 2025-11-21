<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex items-center mb-4 border-b pb-2">
                    <!-- Back Button -->
                    <RouterLink to="/om/listEten">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" v-tooltip="'Back'" />
                    </RouterLink>

                    <!-- Page Title -->
                    <div class="text-2xl font-bold text-gray-800">Edit Customer</div>
    
                </div>

                <div class="flex items-center">
                    <div class="flex flex-col md:flex-row gap-4 w-full">
                        <div class="w-full">
                            <label for="companyRegNo" class="font-medium text-gray-700"> Account No: </label>
                            <InputText v-model="form.custAccountNo" disabled inputClass="font-bold text-primary" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LoadingPage v-if="isLoading" />

        <div v-if="!isLoading && showEditForm">
            <!-- 🏢 Company Details -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🏢 Company Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyRegNo">Company Registration No</label>
                            <InputText disabled id="companyRegNo" type="text" v-model="form.companyRegNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName1">Company Name 1</label>
                            <InputText disabled id="companyName1" type="text" v-model="form.companyName1" />
                        </div>
                        <div class="w-full">
                            <label for="companyName2">Company Name 2</label>
                            <InputText disabled id="companyName2" type="text" v-model="form.companyName2" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName3">Company Name 3</label>
                            <InputText disabled id="companyName3" type="text" v-model="form.companyName3" />
                        </div>
                        <div class="w-full">
                            <label for="companyName4">Company Name 4</label>
                            <InputText disabled id="companyName4" type="text" v-model="form.companyName4" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesTaxNo">Sales Tax No</label>
                            <InputText disabled id="salesTaxNo" type="text" v-model="form.salesTaxNo" />
                        </div>
                        <div class="w-full">
                            <label for="serviceTaxNo">Service Tax No</label>
                            <InputText disabled id="serviceTaxNo" type="text" v-model="form.serviceTaxNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="tinNo">TIN No</label>
                            <InputText disabled id="tinNo" type="text" v-model="form.tinNo" />
                        </div>
                        <div class="w-full">
                            <label for="vatNo">VAT No</label>
                            <InputText disabled id="vatNo" type="text" v-model="form.vatNo" />
                        </div>
                    </div>

                    <!-- Main Branch dropdown - disabled only for main branch accounts -->
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="mainBranch">Main Branch Account</label>
                            <Dropdown v-model="currentException.dealers" :disabled="isMainBranch" :options="allDealers" optionLabel="label" optionValue="value" filter placeholder="Search or Select Main Branch" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex flex-col">
                                        <div class="font-medium text-gray-800">{{ slotProps.option.label }}</div>
                                        <small class="text-gray-500">({{ slotProps.option.group }})</small>
                                    </div>
                                </template>
                            </Dropdown>
                            <small v-if="isMainBranch" class="text-gray-500">This field is disabled for main branch accounts (ending with 00)</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📍 Address & Contact Details -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">📍 Address & Contact Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="addressLine1">Address Line 1</label>
                            <InputText disabled id="addressLine1" type="text" v-model="form.addressLine1" />
                        </div>
                        <div class="w-full">
                            <label for="addressLine2">Address Line 2</label>
                            <InputText disabled id="addressLine2" type="text" v-model="form.addressLine2" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="addressLine3">Address Line 3</label>
                            <InputText disabled id="addressLine3" type="text" v-model="form.addressLine3" />
                        </div>
                        <div class="w-full">
                            <label for="addressLine4">Address Line 4</label>
                            <InputText disabled id="addressLine4" type="text" v-model="form.addressLine4" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="city">City</label>
                            <InputText disabled id="city" type="text" v-model="form.city" />
                        </div>
                        <div class="w-full">
                            <label for="postcode">Postcode</label>
                            <InputText disabled id="postcode" type="text" v-model="form.postcode" />
                        </div>
                        <div class="w-full">
                            <label for="state">State</label>
                            <InputText disabled id="state" type="text" v-model="form.state" />
                        </div>
                        <div class="w-full">
                            <label for="country">Country</label>
                            <InputText disabled id="country" type="text" v-model="form.country" />
                        </div>
                    </div>

                    <!-- Editable Map Fields -->
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="mapLatitude">Map Latitude</label>
                            <InputText id="mapLatitude" type="text" v-model="form.mapLatitude" placeholder="Optional" />
                        </div>
                        <div class="w-full">
                            <label for="mapLongitude">Map Longitude</label>
                            <InputText id="mapLongitude" type="text" v-model="form.mapLongitude" placeholder="Optional" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="phoneNumber">Phone No</label>
                            <InputText disabled id="phoneNumber" type="text" v-model="form.phoneNumber" />
                        </div>
                        <div class="w-full">
                            <label for="emailAddress">Email</label>
                            <InputText disabled id="emailAddress" type="text" v-model="form.emailAddress" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 👤 Account Details -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">👤 Account Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <!-- Editable Account Type -->
                        <div class="w-full">
                            <label for="accountType">Account Type</label>
                            <Dropdown v-model="dropdownAccountType" :options="dropdownAccountTypeValue" optionLabel="name" placeholder="Select Account Type" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="paymentTerms">Payment Terms</label>
                            <InputText disabled id="paymentTerms" type="text" v-model="form.paymentTerms" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="riskCategory">Risk Category</label>
                            <InputText disabled id="riskCategory" type="text" v-model="form.riskCategory" />
                        </div>
                        <div class="w-full">
                            <label for="creditLimit">Credit Limit</label>
                            <InputText disabled id="creditLimit" type="text" v-model="form.creditLimit" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="customerAccountGroup">Customer Account Group</label>
                            <InputText disabled id="customerAccountGroup" type="text" v-model="form.customerAccountGroup" />
                        </div>
                        <div class="w-full">
                            <label for="customerCondGrp">Customer Condition Group</label>
                            <InputText disabled id="customerCondGrp" type="text" v-model="form.customerCondGrp" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📈 Target Sales -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">📈 Target Sales</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="targetQ1">Revenue</label>
                            <InputNumber disabled id="revenue" v-model="form.revenue" mode="decimal" :min="0" :maxFractionDigits="0" placeholder="Enter Revenue" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="targetQ2">TargetQty</label>
                            <InputNumber disabled id="targetQty" v-model="form.targetQty" mode="decimal" :min="0" :maxFractionDigits="0" placeholder="Enter Target Quantity" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 💲 Pricing & Sales Info -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">💲 Pricing & Sales Info</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="pricelist">Price List</label>
                            <InputText disabled id="pricelist" type="text" v-model="form.pricelist" />
                        </div>
                        <div class="w-full">
                            <label for="priceGroup">Price Group</label>
                            <InputText disabled id="priceGroup" type="text" v-model="form.priceGroup" />
                        </div>
                        <div class="w-full">
                            <label for="priceProcedure">Price Procedure</label>
                            <InputText disabled id="priceProcedure" type="text" v-model="form.priceProcedure" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesOffice">Sales Office</label>
                            <InputText disabled id="salesOffice" type="text" v-model="form.salesOffice" />
                        </div>
                        <div class="w-full">
                            <label for="salesDistrict">Sales District</label>
                            <InputText disabled id="salesDistrict" type="text" v-model="form.salesDistrict" />
                        </div>
                        <div class="w-full">
                            <label for="startingSalesAmt">Starting Sales Amount</label>
                            <InputNumber id="startingSalesAmt" v-model="form.startingSalesAmt" mode="decimal" :min="0" :maxFractionDigits="0" placeholder="Enter starting sales amount" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🪧 Signboard / Branding -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🪧 Signboard / Branding</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="signboardType">Signboard Type</label>
                            <InputText disabled id="signboardType" type="text" v-model="form.signboardType" />
                        </div>
                        <div class="w-full">
                            <label for="signboardBrand">Signboard Brand</label>
                            <InputText disabled id="signboardBrand" type="text" v-model="form.signboardBrand" />
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
                            <label for="shippingCond">Shipping Condition</label>
                            <InputText disabled id="shippingCond" type="text" v-model="form.shippingCond" />
                        </div>
                        <div class="w-full">
                            <label for="allowLalamove">Allow Lalamove</label>
                            <Dropdown v-model="dropdownAllowLalamove" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="allowDirectShipment">Allow Direct Shipment</label>
                            <Dropdown v-model="dropdownAllowDirectShipment" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- ⚙️ Other Settings -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">⚙️ Other Settings</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="showOnList">Show On List</label>
                            <Dropdown v-model="dropdownShowOnList" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="ifFamilyChannel">If Family Channel</label>
                            <Dropdown v-model="dropdownFamilyChannel" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📍 Ship To Accounts -->
            <div v-if="shipToAddresses.length > 0" class="mt-8">
                <div class="card w-full">
                    <div class="font-semibold text-xl border-b pb-2 mb-4 flex items-center gap-2">
                        📍 Ship To Accounts
                        <i class="pi pi-info-circle cursor-pointer font-bold" v-tooltip="'All fields from SAP are read-only.'"></i>
                    </div>

                    <!-- Loop through all Ship To addresses -->
                    <div v-for="(shipTo, index) in shipToAddresses" :key="shipTo.custAccountNo" class="border rounded-2xl p-5 mb-6 bg-gray-50 shadow-sm">
                        <div class="font-bold text-lg text-gray-700 mb-4 flex justify-between items-center">
                            <span>Account {{ index + 1 }}</span>
                            <span class="text-sm font-normal text-gray-500"> (SAP Data - Read Only) </span>
                        </div>

                        <!-- Account Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="font-medium text-gray-600">Ship To Account No</label>
                                <InputText disabled :value="shipTo.custAccountNo" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Email</label>
                                <InputText disabled :value="shipTo.emailAddress" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Company Names -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Company Name 1</label>
                                <InputText disabled :value="shipTo.companyName1" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 2</label>
                                <InputText disabled :value="shipTo.companyName2" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 3</label>
                                <InputText disabled :value="shipTo.companyName3" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 4</label>
                                <InputText disabled :value="shipTo.companyName4" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Address Lines -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Address Line 1</label>
                                <InputText disabled :value="shipTo.addressLine1" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 2</label>
                                <InputText disabled :value="shipTo.addressLine2" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 3</label>
                                <InputText disabled :value="shipTo.addressLine3" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 4</label>
                                <InputText disabled :value="shipTo.addressLine4" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Location Info -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">City</label>
                                <InputText disabled :value="shipTo.city" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Postcode</label>
                                <InputText disabled :value="shipTo.postcode" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">State</label>
                                <InputText disabled :value="shipTo.state" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Country</label>
                                <InputText disabled :value="shipTo.country" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Phone No</label>
                                <InputText disabled :value="shipTo.phoneNumber" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Mobile No</label>
                                <InputText disabled :value="shipTo.mobileNumber" class="w-full bg-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="flex flex-col md:flex-row justify-end gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="w-full p-button-secondary" @click="handleCancel" />
                        </div>
                        <div class="w-40">
                            <Button label="Update" class="w-full" @click="handleUpdate" :loading="loadingUpdate" :disabled="loadingUpdate" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const route = useRoute();

// Interfaces
interface DropdownOption {
    name: string;
    code: string;
}

interface DealerOption {
    label: string;
    value: string;
    group: string;
}

interface ShipToAddress {
    custAccountNo: string;
    companyName1: string;
    companyName2: string;
    companyName3: string;
    companyName4: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    phoneNumber: string;
    mobileNumber: string;
    emailAddress: string;
}

interface FormData {
    // Company Details
    companyRegNo: string;
    companyName1: string;
    companyName2: string;
    companyName3: string;
    companyName4: string;
    salesTaxNo: string;
    serviceTaxNo: string;
    tinNo: string;
    vatNo: string;

    // Address & Contact Details
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    mapLatitude: string;
    mapLongitude: string;
    phoneNumber: string;
    emailAddress: string;

    // Account Details
    paymentTerms: string;
    riskCategory: string;
    creditLimit: string;
    customerAccountGroup: string;
    customerCondGrp: string;

    // Target Sales Quarters
    revenue: string;
    targetQty: string;

    // Pricing & Sales Info
    priceGroup: string;
    priceProcedure: string;
    salesOffice: string;
    salesDistrict: string;
    startingSalesAmt: string;

    // Signboard / Branding
    signboardBrand: string;
    signboardType: string;

    // Additional fields
    custAccountNo: string;
    accountType: string;
    pricelist: string;
    shippingCond: string;
    allowLalamove: number;
    allowDirectship: number;
    showOnList: number;
    isFamilyChannel: number;
    memberCode: string;
}

// UI state
const isLoading = ref(false);
const loadingUpdate = ref(false);
const showEditForm = ref(false);

// Form data
const form = ref<FormData>({
    companyRegNo: '',
    companyName1: '',
    companyName2: '',
    companyName3: '',
    companyName4: '',
    salesTaxNo: '',
    serviceTaxNo: '',
    tinNo: '',
    vatNo: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    city: '',
    postcode: '',
    state: '',
    country: '',
    mapLatitude: '',
    mapLongitude: '',
    phoneNumber: '',
    emailAddress: '',
    paymentTerms: '',
    riskCategory: '',
    creditLimit: '',
    customerAccountGroup: '',
    customerCondGrp: '',
    revenue: '',
    targetQty: '',
    priceGroup: '',
    priceProcedure: '',
    salesOffice: '',
    salesDistrict: '',
    startingSalesAmt: '',
    signboardBrand: '',
    signboardType: '',
    custAccountNo: '',
    accountType: '',
    pricelist: '',
    shippingCond: '',
    allowLalamove: 0,
    allowDirectship: 0,
    showOnList: 0,
    isFamilyChannel: 0,
    memberCode: ''
});

// ShipTo addresses
const shipToAddresses = ref<ShipToAddress[]>([]);

// Dropdowns
const dropdownYesNoValue = ref<DropdownOption[]>([
    { name: 'Yes', code: '1' },
    { name: 'No', code: '0' }
]);

const dropdownAccountTypeValue = ref<DropdownOption[]>([
    { name: 'Retailer', code: 'Retailer' },
    { name: 'Wholesaler', code: 'Wholesaler' }
]);

// Dropdown v-model bindings
const dropdownAccountType = ref<DropdownOption | null>(null);
const dropdownAllowLalamove = ref<DropdownOption | null>(null);
const dropdownAllowDirectShipment = ref<DropdownOption | null>(null);
const dropdownShowOnList = ref<DropdownOption | null>(null);
const dropdownFamilyChannel = ref<DropdownOption | null>(null);

const allDealers = ref<DealerOption[]>([]);
const currentException = ref({
    dealers: null as string | null
});

// Computed property to check if account is main branch
const isMainBranch = computed(() => {
    return form.value.custAccountNo?.endsWith('00');
});

// Fetch dealer profile data
const fetchDealerProfile = async () => {
    isLoading.value = true;
    try {
        const custAccNo = route.params.custAccNo;
        const response = await api.get(`profile_dealer/${custAccNo}`);

        if (response.data.status === 1 && response.data.admin_data && response.data.admin_data.length > 0) {
            const dealerData = response.data.admin_data[0];

            // Map the API response to form data
            form.value = {
                companyRegNo: dealerData.companyRegNo || '',
                companyName1: dealerData.companyName1 || '',
                companyName2: dealerData.companyName2 || '',
                companyName3: dealerData.companyName3 || '',
                companyName4: dealerData.companyName4 || '',
                salesTaxNo: dealerData.salesTaxNo || '',
                serviceTaxNo: dealerData.serviceTaxNo || '',
                tinNo: dealerData.tinNo || '',
                vatNo: dealerData.vatNo || '',
                addressLine1: dealerData.addressLine1 || '',
                addressLine2: dealerData.addressLine2 || '',
                addressLine3: dealerData.addressLine3 || '',
                addressLine4: dealerData.addressLine4 || '',
                city: dealerData.city || '',
                postcode: dealerData.postcode || '',
                state: dealerData.state || '',
                country: dealerData.country || '',
                mapLatitude: dealerData.mapLatitude || '',
                mapLongitude: dealerData.mapLongitude || '',
                phoneNumber: dealerData.phoneNumber || '',
                emailAddress: dealerData.emailAddress || '',
                paymentTerms: dealerData.paymentTerms || '',
                riskCategory: dealerData.riskCategory || '',
                creditLimit: dealerData.creditLimit || '',
                customerAccountGroup: dealerData.customerAccountGroup || '',
                customerCondGrp: dealerData.customerCondGrp || '',
                revenue: dealerData.revenue || '',
                targetQty: dealerData.targetQty || '',
                priceGroup: dealerData.priceGroup || '',
                priceProcedure: dealerData.priceProcedure || '',
                salesOffice: dealerData.salesOffice || '',
                salesDistrict: dealerData.salesDistrict || '',
                startingSalesAmt: dealerData.startingSalesAmt || '',
                signboardBrand: dealerData.signboardBrand || '',
                signboardType: dealerData.signboardType || '',
                custAccountNo: dealerData.custAccountNo || '',
                accountType: dealerData.accountType || '',
                pricelist: dealerData.pricelist || '',
                shippingCond: dealerData.shippingCond || '',
                allowLalamove: dealerData.allowLalamove || 0,
                allowDirectship: dealerData.allowDirectship || 0,
                showOnList: dealerData.showOnList || 0,
                isFamilyChannel: dealerData.isFamilyChannel || 0,
                memberCode: dealerData.memberCode || ''
            };

            // Set dropdown values
            dropdownAccountType.value = dropdownAccountTypeValue.value.find((item) => item.code === form.value.accountType) || null;

            dropdownAllowLalamove.value = dropdownYesNoValue.value.find((item) => item.code === form.value.allowLalamove?.toString()) || dropdownYesNoValue.value[1]; // Default to No

            dropdownAllowDirectShipment.value = dropdownYesNoValue.value.find((item) => item.code === form.value.allowDirectship?.toString()) || dropdownYesNoValue.value[1]; // Default to No

            dropdownShowOnList.value = dropdownYesNoValue.value.find((item) => item.code === form.value.showOnList?.toString()) || dropdownYesNoValue.value[1]; // Default to No

            dropdownFamilyChannel.value = dropdownYesNoValue.value.find((item) => item.code === form.value.isFamilyChannel?.toString()) || dropdownYesNoValue.value[1]; // Default to No

            // Set ship to addresses
            shipToAddresses.value = dealerData.shipTo_list || [];

            // Set main branch dealer if exists
            if (dealerData.eten_userID && dealerData.eten_userID !== '0') {
                currentException.value.dealers = dealerData.eten_userID;
            }

            showEditForm.value = true;

            // Fetch dealer list for main branch dropdown
            await fetchDealerList();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Dealer not found',
                life: 4000
            });
            router.push('/om/listEten');
        }
    } catch (error) {
        console.error('Error fetching dealer profile:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dealer data',
            life: 4000
        });
        router.push('/om/listEten');
    } finally {
        isLoading.value = false;
    }
};

// Fetch main branch dealer list
async function fetchDealerList() {
    try {
        const requestData = {
            mainBranch: '1',
            custaccountno: form.value.custAccountNo
        };

        const response = await api.post('list_dealer', requestData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const dealers: DealerOption[] = [];

            Object.values(adminData).forEach((item: any) => {
                if (item.shop) {
                    const shop = item.shop;
                    dealers.push({
                        label: `${shop.companyName1 || ''} ${shop.companyName2 || ''} ${shop.companyName3 || ''} ${shop.companyName4 || ''}${shop.custAccountNo ? ` - ${shop.custAccountNo}` : ''}`.trim(),
                        value: shop.id,
                        group: shop.state || '-'
                    });
                }
            });

            allDealers.value = dealers;
        } else {
            allDealers.value = [];
        }
    } catch (error) {
        console.error('Error fetching dealer list:', error);
        allDealers.value = [];
    }
}

// Handle update
const handleUpdate = async () => {
    loadingUpdate.value = true;
    try {
        // Prepare data for API
        const updateData = {
            custAccountNo: form.value.custAccountNo,
            eten_userID: currentException.value.dealers || '0',
            compName1: form.value.companyName1,
            compName2: form.value.companyName2,
            compName3: form.value.companyName3,
            compName4: form.value.companyName4,
            compRegNo: form.value.companyRegNo,
            salesTaxNo: form.value.salesTaxNo,
            serviceTaxNo: form.value.serviceTaxNo,
            TIN: form.value.tinNo,
            VAT: form.value.vatNo,
            address1: form.value.addressLine1,
            address2: form.value.addressLine2,
            address3: form.value.addressLine3,
            address4: form.value.addressLine4,
            city: form.value.city,
            postcode: form.value.postcode,
            state: form.value.state,
            country: form.value.country,
            latitude: form.value.mapLatitude,
            longitude: form.value.mapLongitude,
            phoneNum: form.value.phoneNumber,
            mobileNum: form.value.mobileNumber,
            email: form.value.emailAddress,
            accountType: dropdownAccountType.value?.code || '',
            priceGroup: form.value.priceGroup,
            priceProcedure: form.value.priceProcedure,
            custAccGroup: form.value.customerAccountGroup,
            custCondGroup: form.value.customerCondGrp,
            paymentTerms: form.value.paymentTerms,
            riskCategory: form.value.riskCategory,
            creditLimit: form.value.creditLimit,
            pricelist: form.value.pricelist,
            signboardType: form.value.signboardType,
            signboardBrand: form.value.signboardBrand,
            salesOffice: form.value.salesOffice,
            salesDistrict: form.value.salesDistrict,
            shippingCond: form.value.shippingCond,
            showOnList: dropdownShowOnList.value?.code || '0',
            isFamilyChannel: dropdownFamilyChannel.value?.code || '0',
            allowLalamove: dropdownAllowLalamove.value?.code || '0',
            allowDirectship: dropdownAllowDirectShipment.value?.code || '0',
            startingSalesAmt: form.value.startingSalesAmt,
            revenue: form.value.revenue,
            targetQty: form.value.targetQty,
            s_array: JSON.stringify(shipToAddresses.value) // ShipTo data (read-only from SAP)
        };

        const response = await api.post('update_customer', updateData);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Dealer updated successfully',
                life: 4000
            });
            router.push('/om/listEten');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update dealer',
                life: 4000
            });
        }
    } catch (error) {
        console.error('Error updating dealer:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating dealer',
            life: 4000
        });
    } finally {
        loadingUpdate.value = false;
    }
};

const handleCancel = () => {
    router.push('/om/listEten');
};

// Lifecycle
onMounted(() => {
    fetchDealerProfile();
});
</script>

<style scoped>
.required::after {
    content: ' *';
    color: red;
}
</style>
