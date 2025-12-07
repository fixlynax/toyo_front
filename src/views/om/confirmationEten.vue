<template>
    <Fluid>
        <!-- Header -->
        <div class="flex">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Confirm eTEN</div>
                <p class="text-gray-600">Please review the information before submitting.</p>

                <!-- Account No -->
                <div class="flex items-end gap-3">
                    <div class="flex-1">
                        <span class="text-sm text-gray-500">Account No.</span>
                        <p class="text-lg font-medium">{{ form.custAccountNo || form.accountNo || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🏢 Company Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🏢 Company Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Registration No</span>
                        <p class="text-lg font-medium">{{ form.companyRegNo || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 1</span>
                        <p class="text-lg font-medium">{{ form.companyName1 || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 2</span>
                        <p class="text-lg font-medium">{{ form.companyName2 || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 3</span>
                        <p class="text-lg font-medium">{{ form.companyName3 || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 4</span>
                        <p class="text-lg font-medium">{{ form.companyName4 || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Sales Tax No</span>
                        <p class="text-lg font-medium">{{ form.salesTaxNo || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Service Tax No</span>
                        <p class="text-lg font-medium">{{ form.serviceTaxNo || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">TIN No</span>
                        <p class="text-lg font-medium">{{ form.tinNo || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">VAT No</span>
                        <p class="text-lg font-medium">{{ form.vatNo || '-' }}</p>
                    </div>
                </div>

                <!-- UPDATED: Main Branch display -->
                <div class="w-full">
                    <span class="text-sm text-gray-500">Main Branch Account</span>
                    <p class="text-lg font-medium">{{ getMainBranchLabel(form.mainBranchDealer) || (form.accountNo && form.accountNo.endsWith('00') ? 'This is a main branch account' : '-') }}</p>
                </div>
            </div>
        </div>

        <!-- 📍 Address & Contact Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">📍 Address & Contact Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 1</span>
                        <p class="text-lg font-medium">{{ form.addressLine1 || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 2</span>
                        <p class="text-lg font-medium">{{ form.addressLine2 || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 3</span>
                        <p class="text-lg font-medium">{{ form.addressLine3 || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 4</span>
                        <p class="text-lg font-medium">{{ form.addressLine4 || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">City</span>
                        <p class="text-lg font-medium">{{ form.city || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Postcode</span>
                        <p class="text-lg font-medium">{{ form.postcode || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">State</span>
                        <p class="text-lg font-medium">{{ form.state || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Country</span>
                        <p class="text-lg font-medium">{{ form.country || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Map Latitude</span>
                        <p class="text-lg font-medium">{{ form.mapLatitude || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Map Longitude</span>
                        <p class="text-lg font-medium">{{ form.mapLongitude || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Phone No</span>
                        <p class="text-lg font-medium">{{ form.phoneNumber || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Email</span>
                        <p class="text-lg font-medium">{{ form.emailAddress || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 👤 Account Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Account Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <!-- UPDATED: Account Type display -->
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Account Type</span>
                        <p class="text-lg font-medium">{{ getAccountTypeLabel(form.accountType) || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Payment Terms</span>
                        <p class="text-lg font-medium">{{ form.paymentTerms || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Risk Category</span>
                        <p class="text-lg font-medium">{{ form.riskCategory || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Credit Limit</span>
                        <p class="text-lg font-medium">{{ formatCreditLimit(form.creditLimit) }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Customer Account Group</span>
                        <p class="text-lg font-medium">{{ form.customerAccountGroup || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Customer Condition Group</span>
                        <p class="text-lg font-medium">{{ form.customerCondGrp || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 💲 Pricing & Sales Info -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">💲 Pricing & Sales Info</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <!-- UPDATED: Price List display -->
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price List</span>
                        <p class="text-lg font-medium">{{ form.pricelist || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price Group</span>
                        <p class="text-lg font-medium">{{ form.priceGroup || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price Procedure</span>
                        <p class="text-lg font-medium">{{ form.priceProcedure || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Sales Office</span>
                        <p class="text-lg font-medium">{{ form.salesOffice || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Sales District</span>
                        <p class="text-lg font-medium">{{ form.salesDistrict || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Starting Sales Amount</span>
                        <p class="text-lg font-medium">{{ formatCurrency(form.startingSalesAmt) }}</p>
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
                        <span class="text-sm text-gray-500">Signboard Type</span>
                        <p class="text-lg font-medium">{{ form.signboardType || '-' }}</p>
                    </div>

                    <div class="w-full">
                        <span class="text-sm text-gray-500">Signboard Brand</span>
                        <p class="text-lg font-medium">{{ form.signboardBrand || '-' }}</p>
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
                        <span class="text-sm text-gray-500">Revenue</span>
                        <p class="text-lg font-medium">{{ formatCurrency(form.revenue) }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Quantity</span>
                        <p class="text-lg font-medium">{{ formatCurrency(form.quantity) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🚚 Shipping & Delivery -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🚚 Shipping & Delivery</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <!-- UPDATED: Shipping Condition display -->
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Shipping Condition</span>
                        <p class="text-lg font-medium">{{ form.shippingCond || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Allow Lalamove</span>
                        <p class="text-lg font-medium">{{ form.allowLalamove === '1' ? 'Yes' : 'No' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Allow Own Collection</span>
                        <p class="text-lg font-medium">{{ form.allowOwnCollection === '1' ? 'Yes' : 'No' }}</p>
                    </div>
                    <!-- NEW: Allow Direct Shipment -->
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Allow Direct Shipment</span>
                        <p class="text-lg font-medium">{{ form.allowDirectShipment === '1' ? 'Yes' : 'No' }}</p>
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
                        <span class="text-sm text-gray-500">Show On List</span>
                        <p class="text-lg font-medium">{{ form.showOnList === '1' ? 'Yes' : 'No' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">If Family Channel</span>
                        <p class="text-lg font-medium">{{ form.ifFamilyChannel === '1' ? 'Yes' : 'No' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 📍 Ship To Accounts -->
        <div v-if="form.shipToAddresses && form.shipToAddresses.length > 0" class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">📍 Ship To Accounts</div>

                <!-- Loop through all Ship To addresses -->
                <div v-for="(shipTo, index) in form.shipToAddresses" :key="shipTo.custaccountno" class="border rounded-2xl p-5 mb-6 bg-gray-50 shadow-sm">
                    <div class="font-bold text-lg text-gray-700 mb-4">Account {{ index + 1 }}</div>

                    <!-- Account Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Ship To Account No</span>
                            <p class="text-lg font-medium">{{ shipTo.custaccountno || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Email</span>
                            <p class="text-lg font-medium">{{ shipTo.emailaddress || '-' }}</p>
                        </div>
                    </div>

                    <!-- Company Names -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Company Name 1</span>
                            <p class="text-lg font-medium">{{ shipTo.companyname1 || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Company Name 2</span>
                            <p class="text-lg font-medium">{{ shipTo.companyname2 || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Company Name 3</span>
                            <p class="text-lg font-medium">{{ shipTo.companyname3 || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Company Name 4</span>
                            <p class="text-lg font-medium">{{ shipTo.companyname4 || '-' }}</p>
                        </div>
                    </div>

                    <!-- Address Lines -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Address Line 1</span>
                            <p class="text-lg font-medium">{{ shipTo.addressline1 || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Address Line 2</span>
                            <p class="text-lg font-medium">{{ shipTo.addressline2 || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Address Line 3</span>
                            <p class="text-lg font-medium">{{ shipTo.addressline3 || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Address Line 4</span>
                            <p class="text-lg font-medium">{{ shipTo.addressline4 || '-' }}</p>
                        </div>
                    </div>

                    <!-- Location Info -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">City</span>
                            <p class="text-lg font-medium">{{ shipTo.city || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Postcode</span>
                            <p class="text-lg font-medium">{{ shipTo.postcode || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">State</span>
                            <p class="text-lg font-medium">{{ shipTo.state || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Country</span>
                            <p class="text-lg font-medium">{{ shipTo.country || '-' }}</p>
                        </div>
                    </div>

                    <!-- Contact Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Phone No</span>
                            <p class="text-lg font-medium">{{ shipTo.phoneno || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Mobile No</span>
                            <p class="text-lg font-medium">{{ shipTo.mobilephoneno || '-' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 👤 Master User -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Master User</div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-500">First Name</span>
                        <p class="text-lg font-medium">{{ form.firstname || '-' }}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Last Name</span>
                        <p class="text-lg font-medium">{{ form.lastname || '-' }}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Email</span>
                        <p class="text-lg font-medium">{{ form.email || '-' }}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Phone No.</span>
                        <p class="text-lg font-medium">{{ form.phoneno || '-' }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row justify-end gap-2 mt-6">
                    <div class="w-40">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="handleEdit" />
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="handleSubmit" :loading="isSubmitting" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const isSubmitting = ref(false);
const form = ref({});
const allDealers = ref([]);

// Account Type options (matching createEten)
const accountTypeOptions = [
    { name: 'Retailer', code: 'Retailer' },
    { name: 'Wholesaler', code: 'Wholesaler' }
];

// Helper functions
function getAccountTypeLabel(code) {
    if (!code) return '-';
    const option = accountTypeOptions.find((opt) => opt.code === code);
    return option ? option.name : code;
}

function getMainBranchLabel(dealerId) {
    if (!dealerId) return '-';
    const dealer = allDealers.value.find((d) => d.value === dealerId);
    return dealer ? dealer.label : `Dealer ID: ${dealerId}`;
}

function formatCurrency(value) {
    if (!value || value === '0') return '-';
    const num = parseFloat(value);
    return isNaN(num) ? value : `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCreditLimit(value) {
    if (!value || value === '0') return '-';
    const num = parseFloat(value);
    return isNaN(num) ? value : `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Phone number helpers
function extractCountryCode(phoneNumber) {
    if (!phoneNumber) return '60';
    if (phoneNumber.startsWith('+60')) return '60';
    if (phoneNumber.startsWith('60')) return '60';
    if (phoneNumber.startsWith('01')) return '60';
    return '60';
}

function extractMobileNumber(phoneNumber) {
    if (!phoneNumber) return '';
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.startsWith('60')) {
        cleanNumber = cleanNumber.substring(2);
    }
    if (cleanNumber.startsWith('0')) {
        cleanNumber = cleanNumber.substring(1);
    }
    return cleanNumber;
}

function prepareShipToArray(shipToAddresses) {
    if (!shipToAddresses || !Array.isArray(shipToAddresses) || shipToAddresses.length === 0) {
        return [];
    }
    return shipToAddresses.map((shipTo) => ({
        s_custAccNo: shipTo.custaccountno || '',
        s_compName1: shipTo.companyname1 || '',
        s_compName2: shipTo.companyname2 || '',
        s_compName3: shipTo.companyname3 || '',
        s_compName4: shipTo.companyname4 || '',
        s_address1: shipTo.addressline1 || '',
        s_address2: shipTo.addressline2 || '',
        s_address3: shipTo.addressline3 || '',
        s_address4: shipTo.addressline4 || '',
        s_city: shipTo.city || '',
        s_state: shipTo.state || '',
        s_postcode: shipTo.postcode || '',
        s_country: shipTo.country || '',
        s_phoneNum: shipTo.phoneno || '',
        s_mobileNum: shipTo.mobilephoneno || '',
        s_email: shipTo.emailaddress || ''
    }));
}

function validateForm(formData) {
    const requiredFields = ['custAccountNo', 'companyName1', 'firstname', 'email', 'phoneno'];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
        return {
            isValid: false,
            message: `Missing required fields: ${missingFields.join(', ')}`
        };
    }

    return { isValid: true };
}

// Map form data for API - FIXED to match backend expectations
function mapFormToFormData(formData) {
    const formDataObj = new FormData();

    const mobileNumber = extractMobileNumber(formData.phoneno);
    const countryCode = extractCountryCode(formData.phoneno);

    // Ensure custAccountNo is populated
    const custAccountNo = formData.custAccountNo || formData.accountNo || '';

    // FIXED: Map fields to match backend exactly
    formDataObj.append('custAccountNo', custAccountNo);
    formDataObj.append('eten_userID', formData.eten_userID || '0');
    formDataObj.append('compName1', formData.companyName1 || '');
    formDataObj.append('compName2', formData.companyName2 || '');
    formDataObj.append('compName3', formData.companyName3 || '');
    formDataObj.append('compName4', formData.companyName4 || '');
    formDataObj.append('compRegNo', formData.companyRegNo || '');
    formDataObj.append('salesTaxNo', formData.salesTaxNo || '');
    formDataObj.append('serviceTaxNo', formData.serviceTaxNo || '');
    formDataObj.append('TIN', formData.tinNo || '');
    formDataObj.append('VAT', formData.vatNo || '');
    formDataObj.append('address1', formData.addressLine1 || '');
    formDataObj.append('address2', formData.addressLine2 || '');
    formDataObj.append('address3', formData.addressLine3 || '');
    formDataObj.append('address4', formData.addressLine4 || '');
    formDataObj.append('city', formData.city || '');
    formDataObj.append('postcode', formData.postcode || '');
    formDataObj.append('state', formData.state || '');
    formDataObj.append('country', formData.country || '');
    formDataObj.append('latitude', formData.mapLatitude || '');
    formDataObj.append('longitude', formData.mapLongitude || '');
    formDataObj.append('phoneNum', formData.phoneNumber || '');
    formDataObj.append('mobileNum', formData.mobilePhoneNo || '');
    formDataObj.append('email', formData.emailAddress || '');
    formDataObj.append('accountType', formData.accountType || '');
    formDataObj.append('priceGroup', formData.priceGroup || '');
    formDataObj.append('priceProcedure', formData.priceProcedure || '');
    formDataObj.append('custAccGroup', formData.customerAccountGroup || '');
    formDataObj.append('custCondGroup', formData.customerCondGrp || '');
    formDataObj.append('paymentTerms', formData.paymentTerms || '');
    formDataObj.append('riskCategory', formData.riskCategory || '');
    formDataObj.append('creditLimit', formData.creditLimit || '0');
    formDataObj.append('pricelist', formData.pricelist || '');
    formDataObj.append('signboardBrand', formData.signboardBrand || '');
    formDataObj.append('signboardType', formData.signboardType || '');
    formDataObj.append('salesOffice', formData.salesOffice || '');
    formDataObj.append('salesDistrict', formData.salesDistrict || '');
    formDataObj.append('shippingCond', formData.shippingCond || '');
    formDataObj.append('accountStatus', formData.accountStatus || '');
    formDataObj.append('accountLastUpdate', formData.accountLastUpdate || '');
    formDataObj.append('accountCreation', formData.accountCreation || new Date().toISOString().split('T')[0]);
    formDataObj.append('showOnList', formData.showOnList || '0');
    formDataObj.append('isFamilyChannel', formData.ifFamilyChannel || '0');
    formDataObj.append('allowLalamove', formData.allowLalamove || '0');
    formDataObj.append('allowDirectShipment', formData.allowDirectShipment || '0'); // FIXED: Changed from allowDirectShipment
    formDataObj.append('allowOwnCollection', formData.allowOwnCollection || '0'); // FIXED: Changed from allowOwnCollection
    formDataObj.append('status', 1);
    formDataObj.append('startingSalesAmt', formData.startingSalesAmt || '0');

    // Target Sales - FIXED: Use correct field names
    formDataObj.append('revenue', formData.revenue || '0');
    formDataObj.append('targetQty', formData.quantity || '0');

    // Ship To array - FIXED: Ensure proper JSON stringification
    const shipToArray = prepareShipToArray(formData.shipToAddresses);
    formDataObj.append('s_array', JSON.stringify(shipToArray));

    // Master user - FIXED: Use correct field names
    formDataObj.append('im_first_name', formData.firstname || '');
    formDataObj.append('im_last_name', formData.lastname || '');
    formDataObj.append('im_email', formData.email || '');
    formDataObj.append('im_countryCode', countryCode);
    formDataObj.append('im_mobileNum', mobileNumber);

    return formDataObj;
}

// Load form data
function loadFormData() {
    try {
        const storedData = localStorage.getItem('etenFormData');
        if (storedData) {
            form.value = JSON.parse(storedData);
            // Ensure custAccountNo is set
            if (!form.value.custAccountNo && form.value.accountNo) {
                form.value.custAccountNo = form.value.accountNo;
            }

            // Ensure required fields exist with defaults
            if (!form.value.revenue) form.value.revenue = '0';
            if (!form.value.quantity) form.value.quantity = '0';
            if (!form.value.creditLimit) form.value.creditLimit = '0';
            if (!form.value.startingSalesAmt) form.value.startingSalesAmt = '0';
            if (!form.value.allowOwnCollection) form.value.allowOwnCollection = '0';
            if (!form.value.allowDirectShipment) form.value.allowDirectShipment = '0';
            if (!form.value.allowLalamove) form.value.allowLalamove = '0';
            if (!form.value.showOnList) form.value.showOnList = '0';
            if (!form.value.ifFamilyChannel) form.value.ifFamilyChannel = '0';
        } else {
            toast.add({
                severity: 'warn',
                summary: 'No Form Data',
                detail: 'Please fill in the form first',
                life: 4000
            });
            router.push('/om/createEten');
        }
    } catch (error) {
        console.error('Error loading form data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load form data',
            life: 4000
        });
        router.push('/om/createEten');
    }
}

// Fetch dealer list
async function fetchDealerList() {
    try {
        const custAccountNo = form.value.custAccountNo || form.value.accountNo;
        if (!custAccountNo) return;

        const requestData = {
            mainBranch: '1',
            custaccountno: custAccountNo
        };

        const response = await api.post('list_dealer', requestData);
        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const dealers = [];
            Object.values(adminData).forEach((item) => {
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
        }
    } catch (error) {
        console.error('Error fetching dealer list:', error);
    }
}

// Handle edit
function handleEdit() {
    router.push('/om/createEten');
}

// Handle submit - FIXED: Better error handling and validation
async function handleSubmit() {
    isSubmitting.value = true;

    try {
        // Ensure custAccountNo
        if (!form.value.custAccountNo && form.value.accountNo) {
            form.value.custAccountNo = form.value.accountNo;
        }

        // Validate required fields
        const validation = validateForm(form.value);
        if (!validation.isValid) {
            toast.add({
                severity: 'warn',
                summary: 'Missing Information',
                detail: validation.message,
                life: 4000
            });
            isSubmitting.value = false;
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.value.email && !emailRegex.test(form.value.email)) {
            toast.add({
                severity: 'warn',
                summary: 'Invalid Email',
                detail: 'Please enter a valid email address for the master user',
                life: 4000
            });
            isSubmitting.value = false;
            return;
        }

        // Prepare FormData
        const formData = mapFormToFormData(form.value);

        // Debug logs
        console.log('Submitting form data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Submit API
        const response = await api.postExtra('add_dealer', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json'
            }
        });

        console.log('API Response:', response.data);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Dealer created successfully! An activation SMS has been sent to the master user.',
                life: 5000
            });
            localStorage.removeItem('etenFormData');

            // Navigate to list page after short delay
            setTimeout(() => {
                router.push('/om/listEten');
            }, 2000);
        } else {
            let errorMsg = 'Failed to create dealer. Please try again.';

            if (response.data.validation_errors) {
                // Handle validation errors
                const errors = Object.values(response.data.validation_errors).flat();
                errorMsg = errors.join(', ');
            } else if (response.data.error?.message) {
                errorMsg = response.data.error.message;
            } else if (response.data.error?.description) {
                errorMsg = response.data.error.description;
            } else if (response.data.message) {
                errorMsg = response.data.message;
            } else if (response.data.status === 0) {
                errorMsg = 'Account number already exists or duplicate entry.';
            }

            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMsg,
                life: 5000
            });
        }
    } catch (err) {
        console.error('Submission error:', err);
        let errorMsg = 'Failed to create account. Please check your connection and try again.';

        if (err.response?.data?.error) {
            errorMsg = err.response.data.error.message || err.response.data.error.description || errorMsg;
        } else if (err.response?.data?.message) {
            errorMsg = err.response.data.message;
        } else if (err.message) {
            errorMsg = err.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg,
            life: 5000
        });
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(() => {
    loadFormData();
    fetchDealerList();
});
</script>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.border-b {
    border-bottom: 1px solid #e5e7eb;
}

.text-sm {
    font-size: 0.875rem;
}

.text-lg {
    font-size: 1.125rem;
}

.text-2xl {
    font-size: 1.5rem;
}

.text-xl {
    font-size: 1.25rem;
}

.font-semibold {
    font-weight: 600;
}

.font-bold {
    font-weight: 700;
}

.font-medium {
    font-weight: 500;
}

.text-gray-800 {
    color: #1f2937;
}

.text-gray-600 {
    color: #4b5563;
}

.text-gray-500 {
    color: #6b7280;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.rounded-2xl {
    border-radius: 1rem;
}
</style>
