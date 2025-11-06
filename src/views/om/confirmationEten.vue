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
                
                <div class="w-full">
                    <span class="text-sm text-gray-500">Main Branch</span>
                    <p class="text-lg font-medium">{{ getMainBranchLabel(form.mainBranchDealer) || '-' }}</p>
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
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Account Type</span>
                        <p class="text-lg font-medium">{{ getDropdownLabel(form.accountType, accountTypeOptions) || '-' }}</p>
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
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price List</span>
                        <p class="text-lg font-medium">{{ getDropdownLabel(form.pricelist, priceListOptions) || '-' }}</p>
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

        <!-- 🚚 Shipping & Delivery -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🚚 Shipping & Delivery</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Shipping Condition</span>
                        <p class="text-lg font-medium">{{ getDropdownLabel(form.shippingCond, shippingConditionOptions) || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Allow Lalamove</span>
                        <p class="text-lg font-medium">{{ form.allowLalamove === '1' ? 'Yes' : 'No' }}</p>
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
                        <p class="text-lg font-medium">{{ getDropdownLabel(form.signboardType, signboardTypeOptions) || '-' }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Signboard Brand</span>
                        <p class="text-lg font-medium">{{ form.signboardBrand || '-' }}</p>
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
                <div v-for="(shipTo, index) in form.shipToAddresses" :key="shipTo.custaccountno" 
                     class="border rounded-2xl p-5 mb-6 bg-gray-50 shadow-sm">
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
                    <div>
                        <div class="w-full">
                            <span class="text-sm text-gray-500">Password</span>
                            <div class="flex items-center">
                                <p class="text-lg font-medium mr-2 mb-0">
                                    {{ showPassword ? form.password : '••••••••' }}
                                </p>
                                <button type="button" @click="showPassword = !showPassword" class="text-gray-500 hover:text-gray-700">
                                    <i v-if="showPassword" class="pi pi-eye-slash text-sm"></i>
                                    <i v-else class="pi pi-eye text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="w-full">
                            <span class="text-sm text-gray-500">Confirm Password</span>
                            <div class="flex items-center">
                                <p class="text-lg font-medium mr-2 mb-0">
                                    {{ ConfirmationshowPassword ? form.confirmpassword : '••••••••' }}
                                </p>
                                <button type="button" @click="ConfirmationshowPassword = !ConfirmationshowPassword" class="text-gray-500 hover:text-gray-700">
                                    <i v-if="ConfirmationshowPassword" class="pi pi-eye-slash text-sm"></i>
                                    <i v-else class="pi pi-eye text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row justify-end gap-2 mt-6">
                    <div class="w-40">
                        <Button label="Edit" class="w-full p-button-secondary" @click="handleEdit" />
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

const router = useRouter();

const showPassword = ref(false);
const ConfirmationshowPassword = ref(false);
const isSubmitting = ref(false);
const form = ref({});
const allDealers = ref([]);

// Dropdown options for display
const accountTypeOptions = [
    { name: 'Retailer', code: 'Retailer' },
    { name: 'Wholesaler', code: 'Wholesaler' },
    { name: 'DS', code: 'DS' }
];

const priceListOptions = [
    { name: 'PM', code: '01' },
    { name: 'Sabah', code: '02' },
    { name: 'Sarawak', code: '03' },
    { name: 'Langkawi', code: '04' },
    { name: 'Labuan', code: '05' },
    { name: 'Semananjung', code: '06' }
];

const signboardTypeOptions = [
    { name: 'Non', code: 'Non' },
    { name: 'T10', code: 'T10' },
    { name: 'TAC', code: 'TAC' },
    { name: 'TC', code: 'TC' },
    { name: 'TSS', code: 'TSS' },
    { name: 'TST', code: 'TST' }
];

const shippingConditionOptions = [
    { name: 'RE', code: 'RE' },
    { name: 'TP', code: 'TP' }
];

// Helper function to get dropdown label from code
function getDropdownLabel(code, options) {
    if (!code) return '-';
    const option = options.find(opt => opt.code === code);
    return option ? option.name : code;
}

// Helper function to get main branch label
function getMainBranchLabel(dealerId) {
    if (!dealerId) return '-';
    const dealer = allDealers.value.find(d => d.value === dealerId);
    return dealer ? dealer.label : `Dealer ID: ${dealerId}`;
}

// Format currency values
function formatCurrency(value) {
    if (!value) return '-';
    const num = parseFloat(value);
    return isNaN(num) ? value : `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format credit limit
function formatCreditLimit(value) {
    if (!value) return '-';
    const num = parseFloat(value);
    return isNaN(num) ? value : `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Extract country code from phone number
function extractCountryCode(phoneNumber) {
    if (!phoneNumber) return '60'; // Default Malaysia code
    // Simple extraction - you might need more sophisticated logic
    if (phoneNumber.startsWith('+60')) return '60';
    if (phoneNumber.startsWith('60')) return '60';
    if (phoneNumber.startsWith('01')) return '60'; // Malaysian mobile numbers
    return '60'; // Default to Malaysia
}

// Extract mobile number without country code
function extractMobileNumber(phoneNumber) {
    if (!phoneNumber) return '';
    // Remove country code and any non-digit characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Remove Malaysia country code
    if (cleanNumber.startsWith('60')) {
        cleanNumber = cleanNumber.substring(2);
    }
    
    // Remove leading zero if present
    if (cleanNumber.startsWith('0')) {
        cleanNumber = cleanNumber.substring(1);
    }
    
    return cleanNumber;
}

// Prepare Ship To array for API
function prepareShipToArray(shipToAddresses) {
    if (!shipToAddresses || !Array.isArray(shipToAddresses)) return [];
    
    return shipToAddresses.map(shipTo => ({
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

// Map form data to FormData for API request
function mapFormToFormData(formData) {
    const formDataObj = new FormData();
    const mobileNumber = extractMobileNumber(formData.phoneno);
    const countryCode = extractCountryCode(formData.phoneno);

    // Dealer Information
    formDataObj.append('memberCode', formData.memberCode || '');
    formDataObj.append('custAccountNo', formData.custAccountNo || formData.accountNo || '');
    formDataObj.append('eten_userID', formData.eten_userID || '');
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
    formDataObj.append('creditLimit', formData.creditLimit || '');
    formDataObj.append('pricelist', formData.pricelist || '');
    formDataObj.append('signboardType', formData.signboardType || '');
    formDataObj.append('signboardBrand', formData.signboardBrand || '');
    formDataObj.append('salesOffice', formData.salesOffice || '');
    formDataObj.append('salesDistrict', formData.salesDistrict || '');
    formDataObj.append('shippingCond', formData.shippingCond || '');
    formDataObj.append('storageLoc', formData.storageLocation || '');
    formDataObj.append('accountStatus', 1); // Default active
    formDataObj.append('accountLastUpdate', formData.accountLastUpdate || '');
    formDataObj.append('accountCreation', formData.accountCreation || new Date().toISOString().split('T')[0]);
    formDataObj.append('showOnList', formData.showOnList || '0');
    formDataObj.append('isFamilyChannel', formData.ifFamilyChannel || '0');
    formDataObj.append('allowLalamove', formData.allowLalamove || '0');
    formDataObj.append('status', formData.status || '0');
    formDataObj.append('startingSalesAmt', formData.startingSalesAmt || '0');

    // Ship-to Information as JSON array
    const shipToArray = prepareShipToArray(formData.shipToAddresses);
    formDataObj.append('s_array', JSON.stringify(shipToArray));

    // Master User Information
    formDataObj.append('im_first_name', formData.firstname || '');
    formDataObj.append('im_last_name', formData.lastname || '');
    formDataObj.append('im_email', formData.email || '');
    formDataObj.append('im_countryCode', countryCode);
    formDataObj.append('im_mobileNum', mobileNumber);
    formDataObj.append('im_password', formData.password || '');
    formDataObj.append('im_confirm_password', formData.confirmpassword || '');

    return formDataObj;
}

// Load data from localStorage
function loadFormData() {
    try {
        const storedData = localStorage.getItem('etenFormData');
        if (storedData) {
            form.value = JSON.parse(storedData);
            console.log('Loaded form data:', form.value);
            
            // Check if ShipTo data exists
            if (form.value.shipToAddresses) {
                console.log('ShipTo addresses found:', form.value.shipToAddresses.length);
            }
        } else {
            console.warn('No form data found in localStorage');
            router.push('/om/createEten');
        }
    } catch (error) {
        console.error('Error loading form data from localStorage:', error);
        router.push('/om/createEten');
    }
}

// Fetch dealer list for main branch display
async function fetchDealerList() {
    try {
        const formData = new FormData();
        formData.append('mainBranch', 1);

        const response = await api.post('list_dealer', formData);

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

// Handle edit - go back to create form
function handleEdit() {
    router.push('/om/createEten');
}

// Handle form submission
async function handleSubmit() {
    isSubmitting.value = true;
    
    try {
        // Validate required fields
        if (!form.value.firstname || !form.value.email || !form.value.phoneno || !form.value.password) {
            alert('Please ensure all required Master User fields are filled in.');
            isSubmitting.value = false;
            return;
        }

        if (form.value.password !== form.value.confirmpassword) {
            alert('Password and Confirm Password do not match.');
            isSubmitting.value = false;
            return;
        }

        // Prepare FormData for API request
        const formData = mapFormToFormData(form.value);
        
        // Log FormData contents for debugging
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Log the s_array specifically
        const shipToArray = prepareShipToArray(form.value.shipToAddresses);
        console.log('Ship To Array:', shipToArray);

        // Call addDealer API with FormData
        const response = await api.post('add_dealer', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            // Success
            alert('Dealer created successfully! An activation email has been sent to the master user.');
            
            // Clear localStorage after successful submission
            localStorage.removeItem('etenFormData');
            
            // Navigate to detail page or success page
            router.push('/om/detailEten');
        } else {
            // Handle API error
            const errorMessage = response.data.error?.message || 'Failed to create dealer. Please try again.';
            alert(`Error: ${errorMessage}`);
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        if (error.response?.data?.error) {
            alert(`Error: ${error.response.data.error.message || 'Failed to create dealer.'}`);
        } else {
            alert('Network error. Please check your connection and try again.');
        }
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
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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