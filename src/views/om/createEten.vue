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
    signboardbrand: string;
    signboardtype: string;
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

    // Target Sales Quarters
    revenue: string;
    quantity: string;

    // Pricing & Sales Info
    priceGroup: string;
    priceProcedure: string;
    salesOffice: string;
    salesDistrict: string;
    startingSalesAmt: string;

    // Signboard / Branding
    signboardBrand: string;
    signboardType: string;

    // Master User
    firstname: string;
    lastname: string;
    email: string;
    phoneno: string;

    // Additional fields from SAP
    custAccountNo: string;
    mobilePhoneNo: string;
    accountStatus: string;
    accountLastUpdate: string;
    accountCreation: string;

    // NEW: Fields for dropdown replacements
    accountType: string;
    pricelist: string;
    shippingCond: string;
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

    // Target Sales Quarter
    revenue: '',
    quantity: '',

    // Pricing & Sales Info
    priceGroup: '',
    priceProcedure: '',
    salesOffice: '',
    salesDistrict: '',
    startingSalesAmt: '',

    // Signboard / Branding
    signboardBrand: '',
    signboardType: '',

    // Master User
    firstname: '',
    lastname: '',
    email: '',
    phoneno: '',

    // Additional fields from SAP
    custAccountNo: '',
    mobilePhoneNo: '',
    accountStatus: '',
    accountLastUpdate: '',
    accountCreation: '',

    // NEW: Fields for dropdown replacements
    accountType: '',
    pricelist: '',
    shippingCond: ''
});

// ShipTo addresses
const shipToAddresses = ref<ShipToAddress[]>([]);
const selectedShipTo = ref<ShipToAddress | null>(null);

// Track SAP populated fields - All fields from SAP are disabled
const sapPopulatedFields = ref(new Set<string>());
const sapPopulatedShipToFields = ref<Map<string, Set<string>>>(new Map());

// Dropdowns
const dropdownYesNoValue = ref<DropdownOption[]>([
    { name: 'Yes', code: '1' },
    { name: 'No', code: '0' }
]);

// NEW: Account Type dropdown (editable, not from SAP)
const dropdownAccountTypeValue = ref<DropdownOption[]>([
    { name: 'Retailer', code: 'Retailer' },
    { name: 'Wholesaler', code: 'Wholesaler' }
]);

// Dropdown v-model bindings
const dropdownYesNo = ref<DropdownOption | null>(null);
const dropdownAccountType = ref<DropdownOption | null>(null); // NEW: Account Type dropdown binding
const dropdownAllowDirectShipment = ref<DropdownOption | null>(null); // NEW: Allow Direct Shipment dropdown
const dropdownShowOnList = ref<DropdownOption | null>(null); // NEW: Show On List dropdown
const dropdownFamilyChannel = ref<DropdownOption | null>(null); // NEW: If Family Channel dropdown

const allDealers = ref<DealerOption[]>([]);
const currentException = ref({
    dealers: null as string | null
});

// NEW: Computed property to check if account is main branch
const isMainBranch = ref(false);

// NEW: Main branch dealer data
const mainBranchDealer = ref<DealerOption | null>(null);

// Watch accountNo to update isMainBranch and fetch main branch data
watch(accountNo, (newVal) => {
    isMainBranch.value = newVal.endsWith('00');

    // Fetch main branch dealer data when accountNo changes (but only if it has value and is sub-branch)
    if (newVal && newVal.trim() !== '' && !isMainBranch.value) {
        fetchMainBranchDealer();
    } else {
        // Reset main branch dealer if it's a main branch account
        mainBranchDealer.value = null;
        currentException.value.dealers = null;
    }
});

// NEW: Function to handle account number input with 10 character limit
function handleAccountNoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-digit characters
    value = value.replace(/\D/g, '');

    // Limit to 10 characters
    if (value.length > 10) {
        value = value.substring(0, 10);
    }

    accountNo.value = value;
}

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
        if (!form.value.firstname || !form.value.lastname || !form.value.email || !form.value.phoneno) {
            toast.add({
                severity: 'warn',
                summary: 'Incomplete Form',
                detail: 'Please fill in all required Master User fields.',
                life: 3000
            });
            return;
        }

        // Determine eten_userID based on main branch selection
        let etenUserID = '0'; // Default to 0 for main branch

        // If main branch is selected and current account is not main branch, set eten_userID to selected main branch ID
        if (currentException.value.dealers && !isMainBranch.value) {
            etenUserID = currentException.value.dealers;
        }

        // Combine all form data (includes quarter fields)
        const fullForm = {
            ...form.value, // This now includes quantity, revenue
            accountType: dropdownAccountType.value?.code || '',
            allowLalamove: dropdownYesNo.value?.code || '0',
            allowDirectShipment: dropdownAllowDirectShipment.value?.code || '0',
            showOnList: dropdownShowOnList.value?.code || '0',
            ifFamilyChannel: dropdownFamilyChannel.value?.code || '0',
            mainBranchDealer: currentException.value.dealers || null,
            accountNo: accountNo.value,
            selectedShipTo: selectedShipTo.value || null,
            shipToAddresses: shipToAddresses.value,
            eten_userID: etenUserID
        };

        console.log('Form data to be saved:', fullForm); // For debugging

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

// NEW: Fetch main branch dealer data - Only fetch the main branch for the current account
async function fetchMainBranchDealer() {
    try {
        if (!accountNo.value) return;

        // Extract main branch account number (first 8 digits + '00')
        const mainBranchAccountNo = accountNo.value.substring(0, 8) + '00';

        // Use JSON object instead of FormData
        const requestData = {
            mainBranch: '1', // Always pass mainBranch=1 as per requirement
            custaccountno: mainBranchAccountNo // Pass main branch account number
        };

        const response = await api.post('list_dealer', requestData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const dealers: DealerOption[] = [];

            Object.values(adminData).forEach((item: any) => {
                if (item.shop) {
                    const shop = item.shop;
                    dealers.push({
                        label: `${shop.companyName1 || ''} ${shop.companyName2 || ''} ${shop.companyName3 || ''} ${shop.companyName4 || ''}${shop.custAccountNo ? ` ( ${shop.custAccountNo} )` : ''}`.trim(),
                        value: shop.id,
                        group: shop.state || '-'
                    });
                }
            });

            // Since we're fetching only the main branch, there should be only one dealer
            if (dealers.length === 1) {
                mainBranchDealer.value = dealers[0];
                currentException.value.dealers = dealers[0].value;
            } else {
                mainBranchDealer.value = null;
                currentException.value.dealers = null;
                console.warn('No main branch dealer found or multiple dealers returned');
            }
        } else {
            mainBranchDealer.value = null;
            currentException.value.dealers = null;
            console.warn('No main branch dealer found or invalid response format');
        }
    } catch (error) {
        console.error('Error fetching main branch dealer:', error);
        mainBranchDealer.value = null;
        currentException.value.dealers = null;
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

// Function to map SAP response to form fields - UPDATED: Mark all SAP fields as populated and disabled
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

    // NEW: Track ALL fields from SAP (including null/empty ones) - ALL fields are disabled
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
        'signboardType',
        'custAccountNo',
        'mobilePhoneNo',
        'accountStatus',
        'accountLastUpdate',
        'accountCreation',
        // NEW: Add the dropdown replacement fields (except accountType which is now editable)
        'pricelist',
        'shippingCond'
    ];

    sapFieldKeys.forEach((key) => {
        sapPopulatedFields.value.add(key);
    });

    // Track which ShipTo fields have SAP data (all fields from SAP are disabled)
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

        // Target Sales Quarters
        revenue: '',
        quantity: '',

        // Signboard / Branding
        signboardBrand: customerMaster.signboardbrand || '',
        signboardType: customerMaster.signboardtype || '',

        // Master User (these are NOT from SAP, so they remain editable)
        firstname: '',
        lastname: '',
        email: '',
        phoneno: '',

        // Additional fields from SAP
        custAccountNo: customerMaster.custaccountno || '',
        mobilePhoneNo: customerMaster.mobilephoneno || '',
        accountStatus: customerMaster.accountstatus || '',
        accountLastUpdate: customerMaster.accountlastupdate || '',
        accountCreation: customerMaster.accountcreation || '',

        // NEW: Dropdown replacement fields from SAP (accountType removed since it's now editable)
        accountType: '', // Reset accountType since it's now editable via dropdown
        pricelist: customerMaster.pricelist || '',
        shippingCond: customerMaster.shippingcond || '',

        // Map fields (not from SAP)
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

    // Validate account number length
    if (accountNo.value.length !== 10) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid Account No',
            detail: 'Account No must be exactly 10 characters.',
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

            // MODIFIED: Set default values for dropdowns - "No" for all dropdowns
            const noOption = dropdownYesNoValue.value.find((opt) => opt.name === 'No');

            const yesOption = dropdownYesNoValue.value.find((opt) => opt.name === 'Yes');

            // Set default to "No" for Allow Lalamove
            dropdownYesNo.value = noOption || dropdownYesNoValue.value[0];

            // Set default to "No" for Allow Direct Shipment
            dropdownAllowDirectShipment.value = noOption || dropdownYesNoValue.value[0];

            // Set default to "No" for Show On List
            dropdownShowOnList.value = yesOption || dropdownYesNoValue.value[1];

            // Set default to "No" for If Family Channel
            dropdownFamilyChannel.value = yesOption || dropdownYesNoValue.value[1];

            showDetails.value = true;
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Account Already Exist',
                detail: `Account Already Exist for Account No: ${accountNo.value}`,
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
        revenue: '',
        quantity: '',
        customerCondGrp: '',
        priceGroup: '',
        priceProcedure: '',
        salesOffice: '',
        salesDistrict: '',
        startingSalesAmt: '',
        signboardBrand: '',
        signboardType: '',
        firstname: '',
        lastname: '',
        email: '',
        phoneno: '',
        custAccountNo: '',
        mobilePhoneNo: '',
        accountStatus: '',
        accountLastUpdate: '',
        accountCreation: '',
        // NEW: Reset dropdown replacement fields
        accountType: '',
        pricelist: '',
        shippingCond: ''
    };
    sapPopulatedFields.value.clear();
    sapPopulatedShipToFields.value.clear();

    // MODIFIED: Find "No" option and set all dropdowns to "No"
    const noOption = dropdownYesNoValue.value.find((opt) => opt.name === 'No');
    const yesOption = dropdownYesNoValue.value.find((opt) => opt.name === 'Yes');

    // Set all dropdowns to "No" by default
    dropdownYesNo.value = noOption || dropdownYesNoValue.value[0];
    dropdownAccountType.value = null;
    dropdownAllowDirectShipment.value = noOption || dropdownYesNoValue.value[0];
    dropdownShowOnList.value = yesOption || dropdownYesNoValue.value[1];
    dropdownFamilyChannel.value = yesOption || dropdownYesNoValue.value[1];
    currentException.value.dealers = null;
    shipToAddresses.value = [];
    selectedShipTo.value = null;
    isMainBranch.value = false;
    mainBranchDealer.value = null;
}

const handleBack = () => {
    router.push('/om/listEten');
};

onMounted(() => {
    // fetchMainBranchDealer();
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
                            <i class="pi pi-info-circle cursor-pointer font-bold" v-tooltip="'SAP account number for the dealer. Must be exactly 10 characters. Main branch ends with 00, sub-branch ends with other digits.'"></i>
                        </div>
                        <InputText v-model="accountNo" id="accountNo" type="text" class="w-full" placeholder="Enter 10-digit SAP account number" maxlength="10" @input="handleAccountNoInput" />
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

                    <!-- UPDATED: Main Branch dropdown - auto-filled and read-only for sub-branches -->
                    <div class="flex flex-col md:flex-row gap-4" v-if="!isMainBranch && mainBranchDealer">
                        <div class="w-full">
                            <label for="mainBranch">Main Branch Account</label>
                            <InputText disabled id="mainBranch" type="text" :value="mainBranchDealer.label" class="w-full bg-gray-100" />
                            <small class="text-gray-500">Auto-filled with main branch data</small>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4" v-else-if="isMainBranch">
                        <div class="w-full">
                            <label for="mainBranch">Main Branch Account</label>
                            <InputText disabled id="mainBranch" type="text" value="This is a main branch account" class="w-full bg-gray-100" />
                            <small class="text-gray-500">This is a main branch account (ending with 00)</small>
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
                        <!-- CHANGED: Account Type from InputText to Dropdown (editable) -->
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
                            <label for="revenue">Revenue</label>
                            <InputNumber id="revenue" type="text" v-model="form.revenue" placeholder="Enter Revenue" />
                        </div>
                        <div class="w-full">
                            <label for="quantity">Quantity</label>
                            <InputNumber id="quantity" type="text" v-model="form.quantity" placeholder="Enter Total Quantity" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 💲 Pricing & Sales Info -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">💲 Pricing & Sales Info</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <!-- CHANGED: Price List from Dropdown to InputText -->
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
                            <InputNumber id="startingSalesAmt" type="text" v-model="form.startingSalesAmt" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🪧 Signboard / Branding -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🪧 Signboard / Branding</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <!-- REMOVED: Signboard Type dropdown -->
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
                        <!-- CHANGED: Shipping Condition from Dropdown to InputText -->
                        <div class="w-full">
                            <label for="shippingCond">Shipping Condition</label>
                            <InputText disabled id="shippingCond" type="text" v-model="form.shippingCond" />
                        </div>
                        <div class="w-full">
                            <label for="allowLalamove">Allow Lalamove</label>
                            <!-- This will show "No" by default -->
                            <Dropdown v-model="dropdownYesNo" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="allowDirectShipment">Allow Direct Shipment</label>
                            <!-- This will show "No" by default -->
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
                            <!-- This will show "No" by default -->
                            <Dropdown v-model="dropdownShowOnList" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="ifFamilyChannel">If Family Channel</label>
                            <!-- This will show "No" by default -->
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
                    <div v-for="(shipTo, index) in shipToAddresses" :key="shipTo.custaccountno" class="border rounded-2xl p-5 mb-6 bg-gray-50 shadow-sm">
                        <div class="font-bold text-lg text-gray-700 mb-4 flex justify-between items-center">
                            <span>Account {{ index + 1 }}</span>
                            <span class="text-sm font-normal text-gray-500"> (SAP Data - Read Only) </span>
                        </div>

                        <!-- Account Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="font-medium text-gray-600">Ship To Account No</label>
                                <InputText disabled v-model="shipTo.custaccountno" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Email</label>
                                <InputText disabled v-model="shipTo.emailaddress" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Company Names -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Company Name 1</label>
                                <InputText disabled v-model="shipTo.companyname1" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 2</label>
                                <InputText disabled v-model="shipTo.companyname2" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 3</label>
                                <InputText disabled v-model="shipTo.companyname3" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 4</label>
                                <InputText disabled v-model="shipTo.companyname4" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Address Lines -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Address Line 1</label>
                                <InputText disabled v-model="shipTo.addressline1" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 2</label>
                                <InputText disabled v-model="shipTo.addressline2" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 3</label>
                                <InputText disabled v-model="shipTo.addressline3" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 4</label>
                                <InputText disabled v-model="shipTo.addressline4" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Location Info -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">City</label>
                                <InputText disabled v-model="shipTo.city" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Postcode</label>
                                <InputText disabled v-model="shipTo.postcode" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">State</label>
                                <InputText disabled v-model="shipTo.state" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Country</label>
                                <InputText disabled v-model="shipTo.country" class="w-full bg-gray-100" />
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Phone No</label>
                                <InputText disabled v-model="shipTo.phoneno" class="w-full bg-gray-100" />
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Mobile No</label>
                                <InputText disabled v-model="shipTo.mobilephoneno" class="w-full bg-gray-100" />
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
                    </div>

                    <div class="flex flex-col md:flex-row justify-end gap-S2 mt-4">
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
