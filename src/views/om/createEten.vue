<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

// Interfaces (keep existing interfaces the same)
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
    custaccountno: string;
    companyname1: string;
    companyname2: string;
    companyname3: string;
    companyname4: string;
    addressline1: string;
    addressline2: string;
    addressline3: string;
    addressline4: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    phoneno: string;
    mobilephoneno: string;
    emailaddress: string;
}

interface CustomerMaster {
    custaccountno: string;
    companyname1: string;
    companyname2: string;
    companyname3: string;
    companyname4: string;
    companyregno: string;
    salestaxno: string;
    servicetaxno: string;
    tin: string;
    vatno: string;
    addressline1: string;
    addressline2: string;
    addressline3: string;
    addressline4: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    phoneno: string;
    mobilephoneno: string;
    emailaddress: string;
    pricegroup: string;
    priceprocedure: string;
    customeraccountgroup: string;
    customercondgrp: string;
    paymentterms: string;
    riskcategory: string;
    creditlimit: string;
    pricelist: string;
    signboardtype: string;
    signboardbrand: string;
    salesoffice: string;
    salesdistrict: string;
    shippingcond: string;
    accountstatus: string;
    accountlastupdate: string;
    accountcreation: string;
    accounttype: string;
    ShipTo: ShipToAddress[];
}

interface SapResponseItem {
    customermaster: CustomerMaster;
}

interface ApiResponse {
    status: number;
    admin_data: SapResponseItem[];
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

    // Pricing & Sales Info
    priceGroup: string;
    priceProcedure: string;
    salesOffice: string;
    salesDistrict: string;
    startingSalesAmt: string;

    // Signboard / Branding
    signboardBrand: string;

    // Master User
    firstname: string;
    lastname: string;
    email: string;
    phoneno: string;
    password: string;
    confirmpassword: string;

    // Additional fields from SAP
    custAccountNo: string;
    mobilePhoneNo: string;
    accountStatus: string;
    accountLastUpdate: string;
    accountCreation: string;
}

// UI state
const isLoading = ref(false);
const showDetails = ref(false);

// Account No input
const accountNo = ref('');
const form = ref<FormData>({
    // Company Details
    companyRegNo: '',
    companyName1: '',
    companyName2: '',
    companyName3: '',
    companyName4: '',
    salesTaxNo: '',
    serviceTaxNo: '',
    tinNo: '',
    vatNo: '',

    // Address & Contact Details
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

    // Account Details
    paymentTerms: '',
    riskCategory: '',
    creditLimit: '',
    customerAccountGroup: '',
    customerCondGrp: '',

    // Pricing & Sales Info
    priceGroup: '',
    priceProcedure: '',
    salesOffice: '',
    salesDistrict: '',
    startingSalesAmt: '',

    // Signboard / Branding
    signboardBrand: '',

    // Master User
    firstname: '',
    lastname: '',
    email: '',
    phoneno: '',
    password: '',
    confirmpassword: '',

    // Additional fields from SAP
    custAccountNo: '',
    mobilePhoneNo: '',
    accountStatus: '',
    accountLastUpdate: '',
    accountCreation: ''
});

// ShipTo addresses
const shipToAddresses = ref<ShipToAddress[]>([]);
const selectedShipTo = ref<ShipToAddress | null>(null);

// Track SAP populated fields - NEW: Track all fields from SAP (including null/empty ones)
const sapPopulatedFields = ref(new Set<string>());
const sapPopulatedShipToFields = ref<Map<string, Set<string>>>(new Map());

// Dropdowns (keep existing dropdowns)
const dropdownYesNoValue = ref<DropdownOption[]>([
    { name: 'Yes', code: '1' },
    { name: 'No', code: '0' }
]);

const dropdownShippingConditionValue = ref<DropdownOption[]>([
    { name: 'RE', code: 'RE' },
    { name: 'TP', code: 'TP' }
]);

const dropdownAccountTypeValue = ref<DropdownOption[]>([
    { name: 'Retailer', code: 'Retailer' },
    { name: 'Wholesaler', code: 'Wholesaler' },
    { name: 'DS', code: 'DS' }
]);

const dropdownPriceListValue = ref<DropdownOption[]>([
    { name: 'PM', code: '01' },
    { name: 'Sabah', code: '02' },
    { name: 'Sarawak', code: '03' },
    { name: 'Langkawi', code: '04' },
    { name: 'Labuan', code: '05' },
    { name: 'Semananjung', code: '06' }
]);

const dropdownSignboardTypeValue = ref<DropdownOption[]>([
    { name: 'Non', code: 'Non' },
    { name: 'T10', code: 'T10' },
    { name: 'TAC', code: 'TAC' },
    { name: 'TC', code: 'TC' },
    { name: 'TSS', code: 'TSS' },
    { name: 'TST', code: 'TST' }
]);

// Dropdown v-model bindings
const dropdownYesNo = ref<DropdownOption | null>(null);
const dropdownShippingCondition = ref<DropdownOption | null>(null);
const dropdownAccountType = ref<DropdownOption | null>(null);
const dropdownPriceList = ref<DropdownOption | null>(null);
const dropdownSignboardType = ref<DropdownOption | null>(null);

const allDealers = ref<DealerOption[]>([]);
const currentException = ref({
    dealers: null as string | null
});

// NEW: Computed property to check if account is main branch
const isMainBranch = ref(false);

// Watch accountNo to update isMainBranch
watch(accountNo, (newVal) => {
    isMainBranch.value = newVal.endsWith('00');
    
    // Fetch dealer list when accountNo changes (but only if it has value)
    if (newVal && newVal.trim() !== '') {
        fetchDealerList();
    }
});

// Helper functions - UPDATED: All SAP fields should be disabled regardless of value
function isSapField(fieldName: string): boolean {
    return sapPopulatedFields.value.has(fieldName);
}

function isSapShipToField(shipToAccountNo: string, fieldName: string): boolean {
    const shipToFields = sapPopulatedShipToFields.value.get(shipToAccountNo);
    return shipToFields ? shipToFields.has(fieldName) : false;
}

function handleSubmit() {
    try {
        // Validate required fields
        if (!form.value.firstname || !form.value.lastname || !form.value.email || !form.value.phoneno || !form.value.password) {
            toast.add({
                severity: 'warn',
                summary: 'Incomplete Form',
                detail: 'Please fill in all required Master User fields.',
                life: 3000
            });
            return;
        }

        if (form.value.password !== form.value.confirmpassword) {
            toast.add({
                severity: 'error',
                summary: 'Password Mismatch',
                detail: 'Password and Confirm Password do not match.',
                life: 3000
            });
            return;
        }

        // Combine all dropdown selections and form data
        const fullForm = {
            ...form.value,
            accountType: dropdownAccountType.value?.code || '',
            pricelist: dropdownPriceList.value?.code || '',
            signboardType: dropdownSignboardType.value?.code || '',
            shippingCond: dropdownShippingCondition.value?.code || '',
            allowLalamove: dropdownYesNo.value?.code || '0',
            showOnList: dropdownYesNo.value?.code || '0',
            ifFamilyChannel: dropdownYesNo.value?.code || '0',
            mainBranchDealer: currentException.value.dealers || null,
            accountNo: accountNo.value,
            selectedShipTo: selectedShipTo.value || null,
            // Include all ShipTo addresses in the form data
            shipToAddresses: shipToAddresses.value
        };

        // Save to localStorage
        localStorage.setItem('etenFormData', JSON.stringify(fullForm));

        // Navigate to confirmation page
        router.push('/om/confirmationEten');
    } catch (err) {
        console.error('Error saving form to localStorage:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong while saving your form.',
            life: 4000
        });
    }
}

// Fetch main branch dealer list - UPDATED: Always pass mainBranch=1
// Fetch main branch dealer list - FIXED: Pass both mainBranch=1 and custaccountno
async function fetchDealerList() {
    try {
        // Use JSON object instead of FormData
        const requestData = {
            mainBranch: '1', // Always pass mainBranch=1 as per requirement
            custaccountno: accountNo.value // Pass current accountNo to exclude self from list
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
            console.warn('No dealers found or invalid response format');
        }
    } catch (error) {
        console.error('Error fetching dealer list:', error);
    }
}

// Function to call SAP API
async function fetchDealerDetails(accountNo: string): Promise<ApiResponse> {
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

// Function to map SAP response to form fields - UPDATED: Mark all SAP fields as populated
function mapSapResponseToForm(sapData: SapResponseItem): FormData {
    const customerMaster = sapData.customermaster;
    sapPopulatedFields.value.clear();
    sapPopulatedShipToFields.value.clear();

    // Store ShipTo addresses
    if (customerMaster.ShipTo && Array.isArray(customerMaster.ShipTo)) {
        shipToAddresses.value = customerMaster.ShipTo;
    } else if (customerMaster.ShipTo && typeof customerMaster.ShipTo === 'object') {
        // Handle case where ShipTo is a single object instead of array
        shipToAddresses.value = [customerMaster.ShipTo]; 
    } else {
        shipToAddresses.value = [];
    }

    // NEW: Track ALL fields from SAP (including null/empty ones)
    const sapFieldKeys = [
        'companyRegNo',
        'companyName1',
        'companyName2',
        'companyName3',
        'companyName4',
        'salesTaxNo',
        'serviceTaxNo',
        'tinNo',
        'vatNo',
        'addressLine1',
        'addressLine2',
        'addressLine3',
        'addressLine4',
        'city',
        'postcode',
        'state',
        'country',
        'phoneNumber',
        'emailAddress',
        'paymentTerms',
        'riskCategory',
        'creditLimit',
        'customerAccountGroup',
        'customerCondGrp',
        'priceGroup',
        'priceProcedure',
        'salesOffice',
        'salesDistrict',
        'signboardBrand',
        'custAccountNo',
        'mobilePhoneNo',
        'accountStatus',
        'accountLastUpdate',
        'accountCreation'
    ];

    sapFieldKeys.forEach((key) => {
        sapPopulatedFields.value.add(key);
    });

    // Track which ShipTo fields have SAP data (all fields from SAP)
    shipToAddresses.value.forEach((shipTo) => {
        const shipToFields = new Set<string>([
            'custaccountno',
            'companyname1',
            'companyname2',
            'companyname3',
            'companyname4',
            'addressline1',
            'addressline2',
            'addressline3',
            'addressline4',
            'city',
            'postcode',
            'state',
            'country',
            'phoneno',
            'mobilephoneno',
            'emailaddress'
        ]);
        sapPopulatedShipToFields.value.set(shipTo.custaccountno, shipToFields);
    });

    const mappedData: FormData = {
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
        paymentTerms: customerMaster.paymentterms || '',
        riskCategory: customerMaster.riskcategory || '',
        creditLimit: customerMaster.creditlimit || '',
        customerAccountGroup: customerMaster.customeraccountgroup || '',
        customerCondGrp: customerMaster.customercondgrp || '',

        // Pricing & Sales Info
        priceGroup: customerMaster.pricegroup || '',
        priceProcedure: customerMaster.priceprocedure || '',
        salesOffice: customerMaster.salesoffice || '',
        salesDistrict: customerMaster.salesdistrict || '',
        startingSalesAmt: '',

        // Signboard / Branding
        signboardBrand: customerMaster.signboardbrand || '',

        // Master User
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
        accountCreation: customerMaster.accountcreation || '',

        // Map fields
        mapLatitude: '',
        mapLongitude: ''
    };

    return mappedData;
}

// Function for Next button
async function goNext() {
    if (!accountNo.value) {
        toast.add({
            severity: 'warn',
            summary: 'Input Required',
            detail: 'Please enter Account No.',
            life: 4000
        });
        return;
    }

    isLoading.value = true;
    showDetails.value = false;
    shipToAddresses.value = [];
    selectedShipTo.value = null;

    try {
        const response: ApiResponse = await fetchDealerDetails(accountNo.value);

        if (response.status === 1 && response.admin_data && response.admin_data[0]) {
            const sapData = response.admin_data[0];
            form.value = mapSapResponseToForm(sapData);

            // Pre-select dropdowns based on SAP data
            if (sapData.customermaster.accounttype) {
                dropdownAccountType.value = dropdownAccountTypeValue.value.find((opt) => opt.code === sapData.customermaster.accounttype) || null;
            }
            if (sapData.customermaster.pricelist) {
                dropdownPriceList.value = dropdownPriceListValue.value.find((opt) => opt.code === sapData.customermaster.pricelist) || null;
            }
            if (sapData.customermaster.signboardtype) {
                dropdownSignboardType.value = dropdownSignboardTypeValue.value.find((opt) => opt.code === sapData.customermaster.signboardtype) || null;
            }
            if (sapData.customermaster.shippingcond) {
                dropdownShippingCondition.value = dropdownShippingConditionValue.value.find((opt) => opt.code === sapData.customermaster.shippingcond) || null;
            }

            // Set default values for Yes/No dropdowns
            dropdownYesNo.value = dropdownYesNoValue.value[0]; // Default to Yes

            showDetails.value = true;
        } else {
            toast.add({
                severity: 'warn',
                summary: 'No Record Found',
                detail: `No record found for Account No: ${accountNo.value}`,
                life: 4000
            });
            resetForm();
        }
    } catch (error) {
        console.error('Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching dealer details. Please try again.',
            life: 4000
        });
        resetForm();
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    form.value = {
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
        priceGroup: '',
        priceProcedure: '',
        salesOffice: '',
        salesDistrict: '',
        startingSalesAmt: '',
        signboardBrand: '',
        firstname: '',
        lastname: '',
        email: '',
        phoneno: '',
        password: '',
        confirmpassword: '',
        custAccountNo: '',
        mobilePhoneNo: '',
        accountStatus: '',
        accountLastUpdate: '',
        accountCreation: ''
    };
    sapPopulatedFields.value.clear();
    sapPopulatedShipToFields.value.clear();
    dropdownAccountType.value = null;
    dropdownPriceList.value = null;
    dropdownSignboardType.value = null;
    dropdownShippingCondition.value = null;
    dropdownYesNo.value = null;
    currentException.value.dealers = null;
    shipToAddresses.value = [];
    selectedShipTo.value = null;
    isMainBranch.value = false;
}

const handleBack = () => {
    router.push('/om/listEten');
};

onMounted(() => {
    // fetchDealerList();
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
                            <i class="pi pi-info-circle cursor-pointer font-bold" v-tooltip="'SAP account number for the dealer. Can be main branch (ending with 00) or sub-branch.'"></i>
                        </div>
                        <InputText v-model="accountNo" id="accountNo" type="text" class="w-full" placeholder="Enter SAP account number" />
                    </div>
                    <div>
                        <Button label="Next" @click="goNext" :disabled="!accountNo" />
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
                            <InputText :disabled="isSapField('companyRegNo')" id="companyRegNo" type="text" v-model="form.companyRegNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName1">Company Name 1</label>
                            <InputText :disabled="isSapField('companyName1')" id="companyName1" type="text" v-model="form.companyName1" />
                        </div>
                        <div class="w-full">
                            <label for="companyName2">Company Name 2</label>
                            <InputText :disabled="isSapField('companyName2')" id="companyName2" type="text" v-model="form.companyName2" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName3">Company Name 3</label>
                            <InputText :disabled="isSapField('companyName3')" id="companyName3" type="text" v-model="form.companyName3" />
                        </div>
                        <div class="w-full">
                            <label for="companyName4">Company Name 4</label>
                            <InputText :disabled="isSapField('companyName4')" id="companyName4" type="text" v-model="form.companyName4" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesTaxNo">Sales Tax No</label>
                            <InputText :disabled="isSapField('salesTaxNo')" id="salesTaxNo" type="text" v-model="form.salesTaxNo" />
                        </div>
                        <div class="w-full">
                            <label for="serviceTaxNo">Service Tax No</label>
                            <InputText :disabled="isSapField('serviceTaxNo')" id="serviceTaxNo" type="text" v-model="form.serviceTaxNo" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="tinNo">TIN No</label>
                            <InputText :disabled="isSapField('tinNo')" id="tinNo" type="text" v-model="form.tinNo" />
                        </div>
                        <div class="w-full">
                            <label for="vatNo">VAT No</label>
                            <InputText :disabled="isSapField('vatNo')" id="vatNo" type="text" v-model="form.vatNo" />
                        </div>
                    </div>

                    <!-- UPDATED: Main Branch dropdown - disabled only for main branch accounts -->
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
                            <InputText :disabled="isSapField('addressLine1')" id="addressLine1" type="text" v-model="form.addressLine1" />
                        </div>
                        <div class="w-full">
                            <label for="addressLine2">Address Line 2</label>
                            <InputText :disabled="isSapField('addressLine2')" id="addressLine2" type="text" v-model="form.addressLine2" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="addressLine3">Address Line 3</label>
                            <InputText :disabled="isSapField('addressLine3')" id="addressLine3" type="text" v-model="form.addressLine3" />
                        </div>
                        <div class="w-full">
                            <label for="addressLine4">Address Line 4</label>
                            <InputText :disabled="isSapField('addressLine4')" id="addressLine4" type="text" v-model="form.addressLine4" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="city">City</label>
                            <InputText :disabled="isSapField('city')" id="city" type="text" v-model="form.city" />
                        </div>
                        <div class="w-full">
                            <label for="postcode">Postcode</label>
                            <InputText :disabled="isSapField('postcode')" id="postcode" type="text" v-model="form.postcode" />
                        </div>
                        <div class="w-full">
                            <label for="state">State</label>
                            <InputText :disabled="isSapField('state')" id="state" type="text" v-model="form.state" />
                        </div>
                        <div class="w-full">
                            <label for="country">Country</label>
                            <InputText :disabled="isSapField('country')" id="country" type="text" v-model="form.country" />
                        </div>
                    </div>

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
                            <InputText :disabled="isSapField('phoneNumber')" id="phoneNumber" type="text" v-model="form.phoneNumber" />
                        </div>
                        <div class="w-full">
                            <label for="emailAddress">Email</label>
                            <InputText :disabled="isSapField('emailAddress')" id="emailAddress" type="text" v-model="form.emailAddress" />
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
                            <Dropdown v-model="dropdownAccountType" :options="dropdownAccountTypeValue" optionLabel="name" placeholder="Select Account Type" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="paymentTerms">Payment Terms</label>
                            <InputText :disabled="isSapField('paymentTerms')" id="paymentTerms" type="text" v-model="form.paymentTerms" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="riskCategory">Risk Category</label>
                            <InputText :disabled="isSapField('riskCategory')" id="riskCategory" type="text" v-model="form.riskCategory" />
                        </div>
                        <div class="w-full">
                            <label for="creditLimit">Credit Limit</label>
                            <InputText :disabled="isSapField('creditLimit')" id="creditLimit" type="text" v-model="form.creditLimit" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="customerAccountGroup">Customer Account Group</label>
                            <InputText :disabled="isSapField('customerAccountGroup')" id="customerAccountGroup" type="text" v-model="form.customerAccountGroup" />
                        </div>
                        <div class="w-full">
                            <label for="customerCondGrp">Customer Condition Group</label>
                            <InputText :disabled="isSapField('customerCondGrp')" id="customerCondGrp" type="text" v-model="form.customerCondGrp" />
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
                            <Dropdown v-model="dropdownPriceList" :options="dropdownPriceListValue" optionLabel="name" placeholder="Select Price List" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="priceGroup">Price Group</label>
                            <InputText :disabled="isSapField('priceGroup')" id="priceGroup" type="text" v-model="form.priceGroup" />
                        </div>
                        <div class="w-full">
                            <label for="priceProcedure">Price Procedure</label>
                            <InputText :disabled="isSapField('priceProcedure')" id="priceProcedure" type="text" v-model="form.priceProcedure" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesOffice">Sales Office</label>
                            <InputText :disabled="isSapField('salesOffice')" id="salesOffice" type="text" v-model="form.salesOffice" />
                        </div>
                        <div class="w-full">
                            <label for="salesDistrict">Sales District</label>
                            <InputText :disabled="isSapField('salesDistrict')" id="salesDistrict" type="text" v-model="form.salesDistrict" />
                        </div>
                        <div class="w-full">
                            <label for="startingSalesAmt">Starting Sales Amount</label>
                            <InputText id="startingSalesAmt" type="text" v-model="form.startingSalesAmt" />
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
                            <Dropdown v-model="dropdownSignboardType" :options="dropdownSignboardTypeValue" optionLabel="name" placeholder="Select Signboard Type" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="signboardBrand">Signboard Brand</label>
                            <InputText :disabled="isSapField('signboardBrand')" id="signboardBrand" type="text" v-model="form.signboardBrand" />
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
                            <Dropdown v-model="dropdownShippingCondition" :options="dropdownShippingConditionValue" optionLabel="name" placeholder="Select Shipping Condition" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="allowLalamove">Allow Lalamove</label>
                            <Dropdown v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
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
                            <Dropdown v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="ifFamilyChannel">If Family Channel</label>
                            <Dropdown v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📍 Ship To Accounts -->
            <div v-if="shipToAddresses.length > 0" class="mt-8">
                <div class="card w-full">
                    <div class="font-semibold text-xl border-b pb-2 mb-4 flex items-center gap-2">
                        📍 Ship To Accounts
                        <i class="pi pi-info-circle cursor-pointer font-bold" v-tooltip="'All fields from SAP are read-only. You can only edit empty fields.'"></i>
                    </div>

                    <!-- Loop through all Ship To addresses -->
                    <div v-for="(shipTo, index) in shipToAddresses" :key="shipTo.custaccountno" class="border rounded-2xl p-5 mb-6 bg-gray-50 shadow-sm">
                        <div class="font-bold text-lg text-gray-700 mb-4 flex justify-between items-center">
                            <span>Account {{ index + 1 }}</span>
                            <span class="text-sm font-normal text-gray-500"> (SAP Data - Read Only) </span>
                        </div>

                        <!-- Account Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="font-medium text-gray-600">Ship To Account No</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'custaccountno')"
                                    v-model="shipTo.custaccountno"
                                    placeholder="Enter account number"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'custaccountno') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Email</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'emailaddress')"
                                    v-model="shipTo.emailaddress"
                                    placeholder="example@email.com"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'emailaddress') }"
                                />
                            </div>
                        </div>

                        <!-- Company Names -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Company Name 1</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'companyname1')"
                                    v-model="shipTo.companyname1"
                                    placeholder="Company Name Line 1"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'companyname1') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 2</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'companyname2')"
                                    v-model="shipTo.companyname2"
                                    placeholder="Company Name Line 2"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'companyname2') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 3</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'companyname3')"
                                    v-model="shipTo.companyname3"
                                    placeholder="Company Name Line 3"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'companyname3') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 4</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'companyname4')"
                                    v-model="shipTo.companyname4"
                                    placeholder="Company Name Line 4"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'companyname4') }"
                                />
                            </div>
                        </div>

                        <!-- Address Lines -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Address Line 1</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'addressline1')"
                                    v-model="shipTo.addressline1"
                                    placeholder="Address Line 1"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'addressline1') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 2</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'addressline2')"
                                    v-model="shipTo.addressline2"
                                    placeholder="Address Line 2"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'addressline2') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 3</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'addressline3')"
                                    v-model="shipTo.addressline3"
                                    placeholder="Address Line 3"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'addressline3') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 4</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'addressline4')"
                                    v-model="shipTo.addressline4"
                                    placeholder="Address Line 4"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'addressline4') }"
                                />
                            </div>
                        </div>

                        <!-- Location Info -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">City</label>
                                <InputText :disabled="isSapShipToField(shipTo.custaccountno, 'city')" v-model="shipTo.city" placeholder="City" class="w-full" :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'city') }" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Postcode</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'postcode')"
                                    v-model="shipTo.postcode"
                                    placeholder="Postcode"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'postcode') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">State</label>
                                <InputText :disabled="isSapShipToField(shipTo.custaccountno, 'state')" v-model="shipTo.state" placeholder="State" class="w-full" :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'state') }" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Country</label>
                                <InputText :disabled="isSapShipToField(shipTo.custaccountno, 'country')" v-model="shipTo.country" placeholder="Country" class="w-full" :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'country') }" />
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Phone No</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'phoneno')"
                                    v-model="shipTo.phoneno"
                                    placeholder="e.g. 03-1234567"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'phoneno') }"
                                />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Mobile No</label>
                                <InputText
                                    :disabled="isSapShipToField(shipTo.custaccountno, 'mobilephoneno')"
                                    v-model="shipTo.mobilephoneno"
                                    placeholder="e.g. 012-3456789"
                                    class="w-full"
                                    :class="{ 'bg-gray-100': isSapShipToField(shipTo.custaccountno, 'mobilephoneno') }"
                                />
                            </div>
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
                            <label for="firstname" class="required">First Name</label>
                            <InputText id="firstname" type="text" v-model="form.firstname" required />
                        </div>
                        <div>
                            <label for="lastname" class="required">Last Name</label>
                            <InputText id="lastname" type="text" v-model="form.lastname" required />
                        </div>
                        <div>
                            <label for="email" class="required">Email</label>
                            <InputText id="email" type="email" v-model="form.email" required />
                        </div>
                        <div>
                            <label for="phoneno" class="required">Phone No</label>
                            <InputText id="phoneno" type="text" v-model="form.phoneno" required />
                        </div>
                        <!-- <div>
                            <label for="password" class="required">Password</label>
                            <Password id="password" v-model="form.password" toggleMask class="w-full" required />
                        </div>
                        <div>
                            <label for="confirmpassword" class="required">Confirm Password</label>
                            <Password id="confirmpassword" v-model="form.confirmpassword" toggleMask :feedback="false" class="w-full" required />
                        </div> -->
                    </div>

                    <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                        <div class="w-40">
                            <Button label="Cancel" class="w-full p-button-secondary" @click="handleBack" />
                        </div>
                        <div class="w-40">
                            <Button label="Submit" class="w-full" @click="handleSubmit" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
.required::after {
    content: ' *';
    color: red;
}
</style>
