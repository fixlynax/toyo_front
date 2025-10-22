<script setup>
import { ref } from 'vue';
import { ListEtenService } from '@/service/ListEten.js';
import LoadingPage from '@/components/LoadingPage.vue';

// UI state
const isLoading = ref(false);
const showDetails = ref(false);

// Account No input (no dummy data)
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

// Dropdown v-model bindings
const dropdownYesNo = ref(null);
const dropdownShippingCondition = ref(null);
const dropdownAccountType = ref(null);
const dropdownPriceList = ref(null);
const dropdownSignboardType = ref(null);

// Function for Next button
function goNext() {
    if (!accountNo.value) {
        alert('Please enter Account No.');
        return;
    }

    isLoading.value = true;
    showDetails.value = false;

    setTimeout(() => {
        // find data from service
        const etenList = ListEtenService.getListEtenData();
        const matched = etenList.find((item) => item.custAccountNo === accountNo.value);

        if (matched) {
            form.value = { ...matched };

            // pre-select dropdowns
            dropdownAccountType.value = dropdownAccountTypeValue.value.find((opt) => opt.code === matched.accountType);
            dropdownPriceList.value = dropdownPriceListValue.value.find((opt) => opt.code === matched.pricelist);
            dropdownSignboardType.value = dropdownSignboardTypeValue.value.find((opt) => opt.code === matched.signboardType);
            dropdownShippingCondition.value = dropdownShippingConditionValue.value.find((opt) => opt.code === matched.shippingCond);
            dropdownYesNo.value = dropdownYesNoValue.value.find((opt) => opt.code === String(matched.allowLalamove));
        } else {
            alert('No record found for Account No: ' + accountNo.value);
            form.value = {};
        }

        isLoading.value = false;
        showDetails.value = true;
    }, 1500); // simulate delay
}
</script>

<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create eTEN</div>
                <div class="flex items-end gap-3">
                    <!-- Left side: Account No with icon + input -->
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <label for="accountNo" class="font-medium">Account No.</label>
                            <i class="pi pi-info-circle cursor-pointer font-bold" v-tooltip="'SAP account number for the dealer'"></i>
                        </div>
                        <InputText v-model="accountNo" id="accountNo" type="text" class="w-full" />
                    </div>

                    <!-- Right side: Next button -->
                    <div>
                        <Button label="Next" @click="goNext" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Page -->
        <LoadingPage v-if="isLoading" />

        <!-- All form details -->
        <div v-if="showDetails">
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

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="mapLatitude">Map Latitude</label>
                            <InputText disabled id="mapLatitude" type="text" v-model="form.mapLatitude" />
                        </div>
                        <div class="w-full">
                            <label for="mapLongitude">Map Longitude</label>
                            <InputText disabled id="mapLongitude" type="text" v-model="form.mapLongitude" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="phoneN">Phone No</label>
                            <InputText disabled id="phoneN" type="text" v-model="form.phoneNumber" />
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
                            <InputText disabled id="startingSalesAmt" type="text" v-model="form.startingSalesAmt" />
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
                            <Select disabled id="signboardType" v-model="dropdownSignboardType" :options="dropdownSignboardTypeValue" optionLabel="name" placeholder="Select One" class="w-full" />
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
                            <Select disabled id="shippingCond" v-model="dropdownShippingCondition" :options="dropdownShippingConditionValue" optionLabel="name" placeholder="Select One" class="w-full" />
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
