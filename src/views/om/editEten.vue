<script setup>
import { ref, onMounted } from 'vue';

// Dummy data (replace with API call if needed)
const eten = {
    memberCode: 'E346572',
    custAccountNo: '6080100900',
    companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    companyName2: '',
    companyName3: '',
    companyName4: '',
    companyRegNo: 'MY123456789',
    salesTaxNo: 'SST123456',
    serviceTaxNo: 'STX120987',
    tinNo: '1256734321',
    vatNo: '0976213456',
    addressLine1: '123 Toyo Road',
    addressLine2: 'Toyo Industrial Park',
    addressLine3: '',
    addressLine4: '',
    city: 'Kuala Lumpur',
    postcode: '50000',
    state: 'Kuala Lumpur',
    country: 'Malaysia',
    mapLatitude: '3.1390',
    mapLongitude: '101.6869',
    phoneNumber: '+60 3-1234 5678',
    mobilreNumber: '+60 19-1234 567',
    emailAddress: 'sales@toyotires.com.my',
    accountType: 'Retailer',
    priceGroup: 'A',
    priceProcedure: 'Standard',
    customerAccountGroup: 'Group1',
    customerCondGrp: 'Cond1',
    paymentTerms: 'NET 30',
    riskCategory: 'Low',
    creditLimit: 50000,
    pricelist: '01',
    signboardType: 'T10',
    signboardBrand: 'Toyo',
    salesOffice: 'Kuala Lumpur',
    salesDistrict: 'Central',
    shippingCond: 'RE',
    accountCreation: '2023-01-15',
    showOnList: 1,
    ifFamilyChannel: 0,
    allowLalamove: 1,
    startingSalesAmt: 1000,
    status: 0
};

// UI state
const form = ref({});
const dropdownYesNoValue = ref([
    { name: 'Yes', code: '1' },
    { name: 'No', code: '0' }
]);

const dropdownShippingConditionValue = ref([
    { name: 'RE', code: 'RE' },
    { name: 'TP', code: 'TP' }
]);

const dropdownAccountTypeValue = ref([
    { name: 'Retailer', code: 'Retailer' },
    { name: 'Wholesaler', code: 'Wholesaler' },
    { name: 'DS', code: 'DS' }
]);

const dropdownPriceListValue = ref([
    { name: 'PM', code: '01' },
    { name: 'Sabah', code: '02' },
    { name: 'Sarawak', code: '03' },
    { name: 'Langkawi', code: '04' },
    { name: 'Labuan', code: '05' }
]);

const dropdownSignboardTypeValue = ref([
    { name: 'Non', code: 'Non' },
    { name: 'T10', code: 'T10' },
    { name: 'TAC', code: 'TAC' },
    { name: 'TC', code: 'TC' },
    { name: 'TSS', code: 'TSS' },
    { name: 'TST', code: 'TST' }
]);

// Dropdown v-models
const dropdownYesNo = ref(null);
const dropdownShippingCondition = ref(null);
const dropdownAccountType = ref(null);
const dropdownPriceList = ref(null);
const dropdownSignboardType = ref(null);

// Load existing eten data
onMounted(() => {
    form.value = { ...eten };

    dropdownAccountType.value = dropdownAccountTypeValue.value.find((opt) => opt.code === eten.accountType);
    dropdownPriceList.value = dropdownPriceListValue.value.find((opt) => opt.code === eten.pricelist);
    dropdownSignboardType.value = dropdownSignboardTypeValue.value.find((opt) => opt.code === eten.signboardType);
    dropdownShippingCondition.value = dropdownShippingConditionValue.value.find((opt) => opt.code === eten.shippingCond);
    dropdownYesNo.value = dropdownYesNoValue.value.find((opt) => opt.code === String(eten.allowLalamove));
});
</script>

<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit eTEN</div>

                <div class="flex items-end gap-3">
                    <!-- Account No (Disabled) -->
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <label for="accountNo" class="font-medium">Account No.</label>
                            <i class="pi pi-lock cursor-pointer font-bold" v-tooltip="'Account No cannot be changed'"></i>
                        </div>
                        <InputText v-model="form.custAccountNo" id="accountNo" type="text" class="w-full" disabled />
                    </div>
                </div>
            </div>
        </div>

        <!-- All form details (same as createEten but no loading) -->
        <!-- 🏢 Company Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🏢 Company Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="companyRegNo">Company Registration No</label>
                        <InputText id="companyRegNo" type="text" v-model="form.companyRegNo" disabled />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="companyName1">Company Name 1</label>
                        <InputText id="companyName1" type="text" v-model="form.companyName1" disabled />
                    </div>
                    <div class="w-full">
                        <label for="companyName2">Company Name 2</label>
                        <InputText id="companyName2" type="text" v-model="form.companyName2" disabled />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="companyName3">Company Name 3</label>
                        <InputText id="companyName3" type="text" v-model="form.companyName3" disabled />
                    </div>
                    <div class="w-full">
                        <label for="companyName4">Company Name 4</label>
                        <InputText id="companyName4" type="text" v-model="form.companyName4" disabled />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="salesTaxNo">Sales Tax No</label>
                        <InputText id="salesTaxNo" type="text" v-model="form.salesTaxNo" disabled />
                    </div>
                    <div class="w-full">
                        <label for="serviceTaxNo">Service Tax No</label>
                        <InputText id="serviceTaxNo" type="text" v-model="form.serviceTaxNo" disabled />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="tinNo">TIN No</label>
                        <InputText id="tinNo" type="text" v-model="form.tinNo" disabled />
                    </div>
                    <div class="w-full">
                        <label for="vatNo">VAT No</label>
                        <InputText id="vatNo" type="text" v-model="form.vatNo" disabled />
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
                        <InputText id="addressLine3" disabled type="text" v-model="form.addressLine3" />
                    </div>
                    <div class="w-full">
                        <label for="addressLine4">Address Line 4</label>
                        <InputText id="addressLine4" disabled type="text" v-model="form.addressLine4" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="city">City</label>
                        <InputText id="city" disabled type="text" v-model="form.city" />
                    </div>
                    <div class="w-full">
                        <label for="postcode">Postcode</label>
                        <InputText id="postcode" disabled type="text" v-model="form.postcode" />
                    </div>
                    <div class="w-full">
                        <label for="state">State</label>
                        <InputText id="state" disabled type="text" v-model="form.state" />
                    </div>
                    <div class="w-full">
                        <label for="country">Country</label>
                        <InputText id="country" disabled type="text" v-model="form.country" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="mapLatitude">Map Latitude</label>
                        <InputText id="mapLatitude" disabled type="text" v-model="form.mapLatitude" />
                    </div>
                    <div class="w-full">
                        <label for="mapLongitude">Map Longitude</label>
                        <InputText id="mapLongitude" disabled type="text" v-model="form.mapLongitude" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="phoneN">Phone No</label>
                        <InputText id="phoneN" disabled type="text" v-model="form.phoneNumber" />
                    </div>
                    <div class="w-full">
                        <label for="emailAddress">Email</label>
                        <InputText id="emailAddress" disabled type="text" v-model="form.emailAddress" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 👤 Account Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Account Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="accountType">Account Type</label>
                        <Select disabled v-model="dropdownAccountType" :options="dropdownAccountTypeValue" optionLabel="name" placeholder="Select One" class="w-full" />
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

        <!-- 💲 Pricing & Sales Info -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">💲 Pricing & Sales Info</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="pricelist">Price List</label>
                        <Select disabled id="pricelist" v-model="dropdownPriceList" :options="dropdownPriceListValue" optionLabel="name" placeholder="Select One" class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="priceGroup">Price Group</label>
                        <InputText disabled="true" id="priceGroup" type="text" v-model="form.priceGroup" />
                    </div>
                    <div class="w-full">
                        <label for="priceProcedure">Price Procedure</label>
                        <InputText disabled="true" id="priceProcedure" type="text" v-model="form.priceProcedure" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="salesOffice">Sales Office</label>
                        <InputText id="salesOffice" disabled type="text" v-model="form.salesOffice" />
                    </div>
                    <div class="w-full">
                        <label for="salesDistrict">Sales District</label>
                        <InputText id="salesDistrict" disabled type="text" v-model="form.salesDistrict" />
                    </div>
                    <div class="w-full">
                        <label for="startingSalesAmt">Starting Sales Amount</label>
                        <InputText id="startingSalesAmt" disabled type="text" v-model="form.startingSalesAmt" />
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
                        <Select id="signboardType" disabled v-model="dropdownSignboardType" :options="dropdownSignboardTypeValue" optionLabel="name" placeholder="Select One" class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="signboardBrand">Signboard Brand</label>
                        <InputText id="signboardBrand" disabled type="text" v-model="form.signboardBrand" />
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
                        <Select id="shippingCond" disabled v-model="dropdownShippingCondition" :options="dropdownShippingConditionValue" optionLabel="name" placeholder="Select One" class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="allowLalamove">Allow Lalamove</label>
                        <Select id="allowLalamove" v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select One" class="w-full" />
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
                        <Select id="showOnList" v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select One" class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="ifFamilyChannel">If Family Channel</label>
                        <Select id="ifFamilyChannel" v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select One" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Master User -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Master User</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="firstname">First Name</label>
                        <InputText id="firstname" type="text" />
                    </div>
                    <div class="w-full">
                        <label for="lastname">Last Name</label>
                        <InputText id="lastname" type="text" />
                    </div>
                    <div class="w-full">
                        <label for="email">Email</label>
                        <InputText id="email" type="text" />
                    </div>
                    <div class="w-full">
                        <label for="phoneno">Phone No</label>
                        <InputText id="phoneno" type="text" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                    <div class="w-40">
                        <RouterLink to="/om/confirmationEten">
                            <Button label="Cancel" class="p-button-secondary w-full" />
                        </RouterLink>
                    </div>
                    <div class="w-40">
                        <RouterLink to="/om/confirmationEten">
                            <Button label="Submit" class="w-full" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
