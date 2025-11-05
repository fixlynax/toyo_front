<script setup>
import { ref, onMounted } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';

// UI state
const isLoading = ref(false);
const showDetails = ref(false);

// Account No input
const accountNo = ref('');
const form = ref({}); // store selected ETEN data

// Dropdowns
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
    { name: 'Labuan', code: '05' },
    { name: 'Semananjung', code: '06' }
]);

const dropdownSignboardTypeValue = ref([
    { name: 'Non', code: 'Non' },
    { name: 'T10', code: 'T10' },
    { name: 'TAC', code: 'TAC' },
    { name: 'TC', code: 'TC' },
    { name: 'TSS', code: 'TSS' },
    { name: 'TST', code: 'TST' }
]);

// Dropdown v-model bindings
const dropdownYesNo = ref(null);
const dropdownShippingCondition = ref(null);
const dropdownAccountType = ref(null);
const dropdownPriceList = ref(null);
const dropdownSignboardType = ref(null);

const allDealers = ref([]);

const currentException = ref({
    dealers: []
});

// Fetch main branch dealer list
async function fetchDealerList() {
    try {
        const formData = new FormData();
        formData.append('mainBranch', 1);

        const response = await api.post('list_dealer', formData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const dealers = [];

            // 🔍 admin_data may contain multiple keys (like '6028010500', etc.)
            Object.values(adminData).forEach((item) => {
                if (item.shop) {
                    const shop = item.shop;
                    dealers.push({
                        label: shop.companyName1 + shop.companyName2 + shop.companyName3 + companyName4 + (shop.custAccountNo ? ` - ${shop.custAccountNo}` : ''),
                        value: shop.id,
                        group: shop.state || '-'
                    });
                }
            });

            allDealers.value = dealers;
        } else {
            allDealers.value = [];
            console.warn('No dealers found or invalid response format');
        }
    } catch (error) {
        console.error('Error fetching dealer list:', error);
    }
}

// Function to call SAP API
async function fetchDealerDetails(accountNo) {
    try {
        const response = await api.post('detail_dealer_SAP', {
            custAccountNo: accountNo
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching dealer details:', error);
        throw error;
    }
}

// Function to map SAP response to form fields
function mapSapResponseToForm(sapData) {
    const customerMaster = sapData.customermaster;

    return {
        // Company Details
        companyRegNo: customerMaster.companyregno || '',
        companyName1: customerMaster.companyname1 || '',
        companyName2: customerMaster.companyname2 || '',
        companyName3: customerMaster.companyname3 || '',
        companyName4: customerMaster.companyname4 || '',
        salesTaxNo: customerMaster.salestaxno || '',
        serviceTaxNo: customerMaster.servicetaxno || '',
        tinNo: customerMaster.tin || '',
        vatNo: customerMaster.vatno || '',

        // Address & Contact Details
        addressLine1: customerMaster.addressline1 || '',
        addressLine2: customerMaster.addressline2 || '',
        addressLine3: customerMaster.addressline3 || '',
        addressLine4: customerMaster.addressline4 || '',
        city: customerMaster.city || '',
        postcode: customerMaster.postcode || '',
        state: customerMaster.state || '',
        country: customerMaster.country || '',
        phoneNumber: customerMaster.phoneno || '',
        emailAddress: customerMaster.emailaddress || '',

        // Account Details
        accountType: '', // Not in SAP response, will use dropdown
        paymentTerms: customerMaster.paymentterms || '',
        riskCategory: customerMaster.riskcategory || '',
        creditLimit: customerMaster.creditlimit || '',
        customerAccountGroup: customerMaster.customeraccountgroup || '',
        customerCondGrp: customerMaster.customercondgrp || '',

        // Pricing & Sales Info
        pricelist: customerMaster.pricelist || '',
        priceGroup: customerMaster.pricegroup || '',
        priceProcedure: customerMaster.priceprocedure || '',
        salesOffice: customerMaster.salesoffice || '',
        salesDistrict: customerMaster.salesdistrict || '',
        startingSalesAmt: '', // Not in SAP response

        // Signboard / Branding
        signboardType: customerMaster.signboardtype || '',
        signboardBrand: customerMaster.signboardbrand || '',

        // Shipping & Delivery
        shippingCond: customerMaster.shippingcond || '',
        allowLalamove: '', // Not in SAP response

        // Other Settings
        showOnList: '', // Not in SAP response
        ifFamilyChannel: '', // Not in SAP response

        // Master User (not in SAP response)
        firstname: '',
        lastname: '',
        email: '',
        phoneno: '',
        password: '',
        confirmpassword: '',

        // Additional fields from SAP
        custAccountNo: customerMaster.custaccountno || '',
        mobilePhoneNo: customerMaster.mobilephoneno || '',
        accountStatus: customerMaster.accountstatus || '',
        accountLastUpdate: customerMaster.accountlastupdate || '',
        accountCreation: customerMaster.accountcreation || ''
    };
}

// Function for Next button
async function goNext() {
    if (!accountNo.value) {
        alert('Please enter Account No.');
        return;
    }

    isLoading.value = true;
    showDetails.value = false;

    try {
        const response = await fetchDealerDetails(accountNo.value);

        if (response.status === 1 && response.admin_data && response.admin_data[0]) {
            const sapData = response.admin_data[0];
            form.value = mapSapResponseToForm(sapData);

            // Pre-select dropdowns based on SAP data
            dropdownAccountType.value = dropdownAccountTypeValue.value.find((opt) => opt.code === form.value.accountType);
            dropdownPriceList.value = dropdownPriceListValue.value.find((opt) => opt.code === form.value.pricelist);
            dropdownSignboardType.value = dropdownSignboardTypeValue.value.find((opt) => opt.code === form.value.signboardType);
            dropdownShippingCondition.value = dropdownShippingConditionValue.value.find((opt) => opt.code === form.value.shippingCond);

            // Set default values for Yes/No dropdowns
            dropdownYesNo.value = dropdownYesNoValue.value.find((opt) => opt.code === '1'); // Default to Yes

            showDetails.value = true;
        } else {
            alert('No record found for Account No: ' + accountNo.value);
            form.value = {};
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching dealer details. Please try again.');
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchDealerList();
});
</script>

<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create eTEN</div>
                <div class="flex items-end gap-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <label for="accountNo" class="font-medium">Account No.</label>
                            <i class="pi pi-info-circle cursor-pointer font-bold" v-tooltip="'SAP account number for the dealer'"></i>
                        </div>
                        <InputText v-model="accountNo" id="accountNo" type="text" class="w-full" />
                    </div>
                    <div>
                        <Button label="Next" @click="goNext" />
                    </div>
                </div>
            </div>
        </div>

        <LoadingPage v-if="isLoading" />

        <div v-if="showDetails">
            <!-- 🏢 Company Details -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🏢 Company Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyRegNo">Company Registration No</label>
                            <InputText :disabled="!!form.companyRegNo" id="companyRegNo" type="text" v-model="form.companyRegNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName1">Company Name 1</label>
                            <InputText :disabled="!!form.companyName1" id="companyName1" type="text" v-model="form.companyName1" />
                        </div>
                        <div class="w-full">
                            <label for="companyName2">Company Name 2</label>
                            <InputText :disabled="!!form.companyName2" id="companyName2" type="text" v-model="form.companyName2" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName3">Company Name 3</label>
                            <InputText :disabled="!!form.companyName3" id="companyName3" type="text" v-model="form.companyName3" />
                        </div>
                        <div class="w-full">
                            <label for="companyName4">Company Name 4</label>
                            <InputText :disabled="!!form.companyName4" id="companyName4" type="text" v-model="form.companyName4" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesTaxNo">Sales Tax No</label>
                            <InputText :disabled="!!form.salesTaxNo" id="salesTaxNo" type="text" v-model="form.salesTaxNo" />
                        </div>
                        <div class="w-full">
                            <label for="serviceTaxNo">Service Tax No</label>
                            <InputText :disabled="!!form.serviceTaxNo" id="serviceTaxNo" type="text" v-model="form.serviceTaxNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="tinNo">TIN No</label>
                            <InputText :disabled="!!form.tinNo" id="tinNo" type="text" v-model="form.tinNo" />
                        </div>
                        <div class="w-full">
                            <label for="vatNo">VAT No</label>
                            <InputText :disabled="!!form.vatNo" id="vatNo" type="text" v-model="form.vatNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="mainBranch">Main Branch Account</label>
                            <Dropdown v-model="currentException.dealers" :disabled="isLoading || accountNo.endsWith('00')" :options="allDealers" optionLabel="label" optionValue="value" filter placeholder="Search or Select Main Branch" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex flex-col">
                                        <div class="font-medium text-gray-800">{{ slotProps.option.label }}</div>
                                        <small class="text-black-500">({{ slotProps.option.group }})</small>
                                    </div>
                                </template>
                            </Dropdown>
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
                            <InputText :disabled="!!form.addressLine1" id="addressLine1" type="text" v-model="form.addressLine1" />
                        </div>
                        <div class="w-full">
                            <label for="addressLine2">Address Line 2</label>
                            <InputText :disabled="!!form.addressLine2" id="addressLine2" type="text" v-model="form.addressLine2" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="addressLine3">Address Line 3</label>
                            <InputText :disabled="!!form.addressLine3" id="addressLine3" type="text" v-model="form.addressLine3" />
                        </div>
                        <div class="w-full">
                            <label for="addressLine4">Address Line 4</label>
                            <InputText :disabled="!!form.addressLine4" id="addressLine4" type="text" v-model="form.addressLine4" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="city">City</label>
                            <InputText :disabled="!!form.city" id="city" type="text" v-model="form.city" />
                        </div>
                        <div class="w-full">
                            <label for="postcode">Postcode</label>
                            <InputText :disabled="!!form.postcode" id="postcode" type="text" v-model="form.postcode" />
                        </div>
                        <div class="w-full">
                            <label for="state">State</label>
                            <InputText :disabled="!!form.state" id="state" type="text" v-model="form.state" />
                        </div>
                        <div class="w-full">
                            <label for="country">Country</label>
                            <InputText :disabled="!!form.country" id="country" type="text" v-model="form.country" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="mapLatitude">Map Latitude</label>
                            <InputText :disabled="!!form.mapLatitude" id="mapLatitude" type="text" v-model="form.mapLatitude" />
                        </div>
                        <div class="w-full">
                            <label for="mapLongitude">Map Longitude</label>
                            <InputText :disabled="!!form.mapLongitude" id="mapLongitude" type="text" v-model="form.mapLongitude" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="phoneN">Phone No</label>
                            <InputText :disabled="!!form.phoneNumber" id="phoneN" type="text" v-model="form.phoneNumber" />
                        </div>
                        <div class="w-full">
                            <label for="emailAddress">Email</label>
                            <InputText :disabled="!!form.emailAddress" id="emailAddress" type="text" v-model="form.emailAddress" />
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
                            <Select :disabled="!!dropdownAccountType" v-model="dropdownAccountType" :options="dropdownAccountTypeValue" optionLabel="name" placeholder="Select One" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="paymentTerms">Payment Terms</label>
                            <InputText :disabled="!!form.paymentTerms" id="paymentTerms" type="text" v-model="form.paymentTerms" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="riskCategory">Risk Category</label>
                            <InputText :disabled="!!form.riskCategory" id="riskCategory" type="text" v-model="form.riskCategory" />
                        </div>
                        <div class="w-full">
                            <label for="creditLimit">Credit Limit</label>
                            <InputText :disabled="!!form.creditLimit" id="creditLimit" type="text" v-model="form.creditLimit" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="customerAccountGroup">Customer Account Group</label>
                            <InputText :disabled="!!form.customerAccountGroup" id="customerAccountGroup" type="text" v-model="form.customerAccountGroup" />
                        </div>
                        <div class="w-full">
                            <label for="customerCondGrp">Customer Condition Group</label>
                            <InputText :disabled="!!form.customerCondGrp" id="customerCondGrp" type="text" v-model="form.customerCondGrp" />
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
                            <Select :disabled="!!dropdownPriceList" id="pricelist" v-model="dropdownPriceList" :options="dropdownPriceListValue" optionLabel="name" placeholder="Select One" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="priceGroup">Price Group</label>
                            <InputText :disabled="!!form.priceGroup" id="priceGroup" type="text" v-model="form.priceGroup" />
                        </div>
                        <div class="w-full">
                            <label for="priceProcedure">Price Procedure</label>
                            <InputText :disabled="!!form.priceProcedure" id="priceProcedure" type="text" v-model="form.priceProcedure" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesOffice">Sales Office</label>
                            <InputText :disabled="!!form.salesOffice" id="salesOffice" type="text" v-model="form.salesOffice" />
                        </div>
                        <div class="w-full">
                            <label for="salesDistrict">Sales District</label>
                            <InputText :disabled="!!form.salesDistrict" id="salesDistrict" type="text" v-model="form.salesDistrict" />
                        </div>
                        <div class="w-full">
                            <label for="startingSalesAmt">Starting Sales Amount</label>
                            <InputText :disabled="!!form.startingSalesAmt" id="startingSalesAmt" type="text" v-model="form.startingSalesAmt" />
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
                            <Select :disabled="!!dropdownSignboardType" id="signboardType" v-model="dropdownSignboardType" :options="dropdownSignboardTypeValue" optionLabel="name" placeholder="Select One" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="signboardBrand">Signboard Brand</label>
                            <InputText :disabled="!!form.signboardBrand" id="signboardBrand" type="text" v-model="form.signboardBrand" />
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
                            <Select :disabled="!!dropdownShippingCondition" id="shippingCond" v-model="dropdownShippingCondition" :options="dropdownShippingConditionValue" optionLabel="name" placeholder="Select One" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="allowLalamove">Allow Lalamove</label>
                            <Select :disabled="!!dropdownYesNo" id="allowLalamove" v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select One" class="w-full" />
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
                            <Select :disabled="!!dropdownYesNo" id="showOnList" v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select One" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="ifFamilyChannel">If Family Channel</label>
                            <Select :disabled="!!dropdownYesNo" id="ifFamilyChannel" v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select One" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Master User -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">👤 Master User</div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstname">First Name</label>
                            <InputText :disabled="!!form.firstname" id="firstname" type="text" v-model="form.firstname" required />
                        </div>
                        <div>
                            <label for="lastname">Last Name</label>
                            <InputText :disabled="!!form.lastname" id="lastname" type="text" v-model="form.lastname" required />
                        </div>
                        <div>
                            <label for="email">Email</label>
                            <InputText :disabled="!!form.email" id="email" type="text" v-model="form.email" required />
                        </div>
                        <div>
                            <label for="phoneno">Phone No</label>
                            <InputText :disabled="!!form.phoneno" id="phoneno" type="text" v-model="form.phoneno" required />
                        </div>
                        <div>
                            <label for="password">Password</label>
                            <Password id="password" v-model="form.password" toggleMask class="w-full" required />
                        </div>
                        <div>
                            <label for="password">Confirm Password</label>
                            <Password id="confirmpassword" v-model="form.confirmpassword" toggleMask :feedback="false" class="w-full" required />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                        <div class="w-40">
                            <RouterLink to="/om/confirmationEten">
                                <Button label="Cancel" class="w-full p-button-secondary" />
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
        </div>
    </Fluid>
</template>
