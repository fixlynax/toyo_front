<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';

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

    // Additional fields
    custAccountNo: string;
    mobilePhoneNo: string;
    accountStatus: string;
    accountLastUpdate: string;
    accountCreation: string;
}

// UI state
const isLoading = ref(false);
const isSubmitting = ref(false);

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
    priceGroup: '',
    priceProcedure: '',
    salesOffice: '',
    salesDistrict: '',
    startingSalesAmt: '',
    signboardBrand: '',
    custAccountNo: '',
    mobilePhoneNo: '',
    accountStatus: '',
    accountLastUpdate: '',
    accountCreation: ''
});

// ShipTo addresses
const shipToAddresses = ref<ShipToAddress[]>([]);

// Track SAP populated fields
const sapPopulatedFields = ref(new Set<string>());
const sapPopulatedShipToFields = ref<Map<string, Set<string>>>(new Map());

// Dropdowns
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

// Dropdown v-model bindings (separate for each)
const allowLalamove = ref<DropdownOption | null>(null);
const showOnList = ref<DropdownOption | null>(null);
const ifFamilyChannel = ref<DropdownOption | null>(null);
const dropdownShippingCondition = ref<DropdownOption | null>(null);
const dropdownAccountType = ref<DropdownOption | null>(null);
const dropdownPriceList = ref<DropdownOption | null>(null);
const dropdownSignboardType = ref<DropdownOption | null>(null);

const allDealers = ref<DealerOption[]>([]);
const currentException = ref({
    dealers: null as string | null
});

// Get account number from route
const custAccountNo = ref('');

// NEW: Computed property to check if account is main branch
const isMainBranch = ref(false);

// Watch accountNo to update isMainBranch
watch(custAccountNo, (newVal) => {
    isMainBranch.value = newVal.endsWith('00');
});

// Helper functions - MODIFIED: All SAP fields are now editable
function isSapField(fieldName: string): boolean {
    return sapPopulatedFields.value.has(fieldName);
}

function isSapShipToField(shipToAccountNo: string, fieldName: string): boolean {
    const shipToFields = sapPopulatedShipToFields.value.get(shipToAccountNo);
    return shipToFields ? shipToFields.has(fieldName) : false;
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

// Function to map SAP response to form fields - MODIFIED: Track SAP fields but don't disable them
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

    // Track ALL fields from SAP (including null/empty ones) - but don't disable them
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

// Fetch dealer details for editing - MODIFIED: Use SAP API first, then fallback to existing data
async function fetchDealerDetailsForEdit() {
    if (!custAccountNo.value) return;

    isLoading.value = true;

    try {
        // First try to get data from SAP
        const sapResponse: ApiResponse = await fetchDealerDetails(custAccountNo.value);

        if (sapResponse.status === 1 && sapResponse.admin_data && sapResponse.admin_data[0]) {
            const sapData = sapResponse.admin_data[0];
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
            allowLalamove.value = dropdownYesNoValue.value[0];
            showOnList.value = dropdownYesNoValue.value[0];
            ifFamilyChannel.value = dropdownYesNoValue.value[0];

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Dealer data loaded from SAP',
                life: 3000
            });
        } else {
            // Fallback to existing API if SAP data not available
            await fetchExistingDealerData();
        }
    } catch (error) {
        console.error('Error fetching SAP dealer details:', error);
        // Fallback to existing API if SAP call fails
        await fetchExistingDealerData();
    } finally {
        isLoading.value = false;
    }
}

// Fallback function to get existing dealer data
async function fetchExistingDealerData() {
    try {
        const response = await api.post('detail_dealer_SAP', {
            custAccountNo: custAccountNo.value
        });

        if (response.data.status === 1 && response.data.admin_data) {
            const dealerData = response.data.admin_data;
            populateForm(dealerData);
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Using existing dealer data',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load dealer data',
                life: 4000
            });
            router.push('/om/listEten');
        }
    } catch (error) {
        console.error('Error fetching existing dealer details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading dealer data',
            life: 4000
        });
        router.push('/om/listEten');
    }
}

function populateForm(dealerData: any) {
    // Populate main form fields
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
        priceGroup: dealerData.priceGroup || '',
        priceProcedure: dealerData.priceProcedure || '',
        salesOffice: dealerData.salesOffice || '',
        salesDistrict: dealerData.salesDistrict || '',
        startingSalesAmt: dealerData.startingSalesAmt || '',
        signboardBrand: dealerData.signboardBrand || '',
        custAccountNo: dealerData.custAccountNo || '',
        mobilePhoneNo: dealerData.mobileNumber || '',
        accountStatus: dealerData.accountStatus || '',
        accountLastUpdate: dealerData.accountLastUpdate || '',
        accountCreation: dealerData.accountCreation || ''
    };

    // Populate dropdowns
    if (dealerData.accountType) {
        dropdownAccountType.value = dropdownAccountTypeValue.value.find((opt) => opt.code === dealerData.accountType) || null;
    }
    if (dealerData.pricelist) {
        dropdownPriceList.value = dropdownPriceListValue.value.find((opt) => opt.code === dealerData.pricelist) || null;
    }
    if (dealerData.signboardType) {
        dropdownSignboardType.value = dropdownSignboardTypeValue.value.find((opt) => opt.code === dealerData.signboardType) || null;
    }
    if (dealerData.shippingCond) {
        dropdownShippingCondition.value = dropdownShippingConditionValue.value.find((opt) => opt.code === dealerData.shippingCond) || null;
    }

    // Populate Yes/No dropdowns
    allowLalamove.value = dealerData.allowLalamove === '1' ? dropdownYesNoValue.value[0] : dropdownYesNoValue.value[1];
    showOnList.value = dealerData.showOnList === '1' ? dropdownYesNoValue.value[0] : dropdownYesNoValue.value[1];
    ifFamilyChannel.value = dealerData.isFamilyChannel === '1' ? dropdownYesNoValue.value[0] : dropdownYesNoValue.value[1];

    // Populate main branch dealer
    currentException.value.dealers = dealerData.mainBranchDealer || null;

    // Populate ShipTo addresses if available
    if (dealerData.shipToAddresses && Array.isArray(dealerData.shipToAddresses)) {
        shipToAddresses.value = dealerData.shipToAddresses.map((shipTo: any) => ({
            custaccountno: shipTo.custAccountNo || '',
            companyname1: shipTo.companyName1 || '',
            companyname2: shipTo.companyName2 || '',
            companyname3: shipTo.companyName3 || '',
            companyname4: shipTo.companyName4 || '',
            addressline1: shipTo.addressLine1 || '',
            addressline2: shipTo.addressLine2 || '',
            addressline3: shipTo.addressLine3 || '',
            addressline4: shipTo.addressLine4 || '',
            city: shipTo.city || '',
            postcode: shipTo.postcode || '',
            state: shipTo.state || '',
            country: shipTo.country || '',
            phoneno: shipTo.phoneNumber || '',
            mobilephoneno: shipTo.mobileNumber || '',
            emailaddress: shipTo.emailAddress || ''
        }));
    }
}

async function handleSubmit() {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
        // Prepare ShipTo array for API
        const shipToArray = shipToAddresses.value.map((shipTo) => ({
            s_custAccNo: shipTo.custaccountno,
            s_compName1: shipTo.companyname1,
            s_compName2: shipTo.companyname2,
            s_compName3: shipTo.companyname3,
            s_compName4: shipTo.companyname4,
            s_address1: shipTo.addressline1,
            s_address2: shipTo.addressline2,
            s_address3: shipTo.addressline3,
            s_address4: shipTo.addressline4,
            s_city: shipTo.city,
            s_state: shipTo.state,
            s_postcode: shipTo.postcode,
            s_country: shipTo.country,
            s_phoneNum: shipTo.phoneno,
            s_mobileNum: shipTo.mobilephoneno,
            s_email: shipTo.emailaddress
        }));

        // Prepare form data for API
        const submitData = {
            custAccountNo: custAccountNo.value,
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
            mobileNum: form.value.mobilePhoneNo,
            email: form.value.emailAddress,
            accountType: dropdownAccountType.value?.code || '',
            priceGroup: form.value.priceGroup,
            priceProcedure: form.value.priceProcedure,
            custAccGroup: form.value.customerAccountGroup,
            custCondGroup: form.value.customerCondGrp,
            paymentTerms: form.value.paymentTerms,
            riskCategory: form.value.riskCategory,
            creditLimit: form.value.creditLimit,
            pricelist: dropdownPriceList.value?.code || '',
            signboardType: dropdownSignboardType.value?.code || '',
            signboardBrand: form.value.signboardBrand,
            salesOffice: form.value.salesOffice,
            salesDistrict: form.value.salesDistrict,
            shippingCond: dropdownShippingCondition.value?.code || '',
            showOnList: showOnList.value?.code || '0',
            isFamilyChannel: ifFamilyChannel.value?.code || '0',
            allowLalamove: allowLalamove.value?.code || '0',
            startingSalesAmt: form.value.startingSalesAmt,
            s_array: JSON.stringify(shipToArray)
        };

        // Call update API
        const response = await api.post('update_customer', submitData);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Dealer updated successfully',
                life: 4000
            });
            router.push('/om/listEten');
        } else {
            throw new Error(response.data.error?.message || 'Update failed');
        }
    } catch (error: any) {
        console.error('Error updating dealer:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update dealer',
            life: 4000
        });
    } finally {
        isSubmitting.value = false;
    }
}

function handleBack() {
    router.push('/om/listEten');
}

// Add new ShipTo address
function addNewShipTo() {
    shipToAddresses.value.push({
        custaccountno: '',
        companyname1: '',
        companyname2: '',
        companyname3: '',
        companyname4: '',
        addressline1: '',
        addressline2: '',
        addressline3: '',
        addressline4: '',
        city: '',
        postcode: '',
        state: '',
        country: '',
        phoneno: '',
        mobilephoneno: '',
        emailaddress: ''
    });
}

// Remove ShipTo address
function removeShipTo(index: number) {
    shipToAddresses.value.splice(index, 1);
}

onMounted(() => {
    // Get account number from route
    custAccountNo.value = route.params.custAccNo as string;

    if (!custAccountNo.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No account number provided',
            life: 4000
        });
        router.push('/om/listEten');
        return;
    }

    fetchDealerDetailsForEdit();
    fetchDealerList();
});

// Fetch main branch dealer list
async function fetchDealerList() {
    try {
        const formData = new FormData();
        formData.append('mainBranch', '1');
        formData.append('custaccountno,', custAccountNo.value);
        
        const response = await api.post('list_dealer', formData);

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
</script>

<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit eTEN - {{ custAccountNo }}</div>
                <div class="text-lg text-gray-600">
                    Editing dealer account: <strong>{{ custAccountNo }}</strong>
                </div>
            </div>
        </div>

        <LoadingPage v-if="isLoading" />

        <div v-if="!isLoading">
            <!-- 🏢 Company Details -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🏢 Company Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyRegNo">Company Registration No</label>
                            <InputText id="companyRegNo" type="text" v-model="form.companyRegNo" :class="{ 'bg-blue-50': isSapField('companyRegNo') }" />
                            <small v-if="isSapField('companyRegNo')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName1">Company Name 1</label>
                            <InputText id="companyName1" type="text" v-model="form.companyName1" :class="{ 'bg-blue-50': isSapField('companyName1') }" />
                            <small v-if="isSapField('companyName1')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="companyName2">Company Name 2</label>
                            <InputText id="companyName2" type="text" v-model="form.companyName2" :class="{ 'bg-blue-50': isSapField('companyName2') }" />
                            <small v-if="isSapField('companyName2')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="companyName3">Company Name 3</label>
                            <InputText id="companyName3" type="text" v-model="form.companyName3" :class="{ 'bg-blue-50': isSapField('companyName3') }" />
                            <small v-if="isSapField('companyName3')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="companyName4">Company Name 4</label>
                            <InputText id="companyName4" type="text" v-model="form.companyName4" :class="{ 'bg-blue-50': isSapField('companyName4') }" />
                            <small v-if="isSapField('companyName4')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesTaxNo">Sales Tax No</label>
                            <InputText id="salesTaxNo" type="text" v-model="form.salesTaxNo" :class="{ 'bg-blue-50': isSapField('salesTaxNo') }" />
                            <small v-if="isSapField('salesTaxNo')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="serviceTaxNo">Service Tax No</label>
                            <InputText id="serviceTaxNo" type="text" v-model="form.serviceTaxNo" :class="{ 'bg-blue-50': isSapField('serviceTaxNo') }" />
                            <small v-if="isSapField('serviceTaxNo')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="tinNo">TIN No</label>
                            <InputText id="tinNo" type="text" v-model="form.tinNo" :class="{ 'bg-blue-50': isSapField('tinNo') }" />
                            <small v-if="isSapField('tinNo')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="vatNo">VAT No</label>
                            <InputText id="vatNo" type="text" v-model="form.vatNo" :class="{ 'bg-blue-50': isSapField('vatNo') }" />
                            <small v-if="isSapField('vatNo')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <!-- Main Branch dropdown -->
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="mainBranch">Main Branch Account</label>
                            <Dropdown v-model="currentException.dealers" :disabled="isMainBranch" :options="allDealers" optionLabel="label" optionValue="value" filter placeholder="Search or Select Main Branch" class="w-full" />
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
                            <InputText id="addressLine1" type="text" v-model="form.addressLine1" :class="{ 'bg-blue-50': isSapField('addressLine1') }" />
                            <small v-if="isSapField('addressLine1')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="addressLine2">Address Line 2</label>
                            <InputText id="addressLine2" type="text" v-model="form.addressLine2" :class="{ 'bg-blue-50': isSapField('addressLine2') }" />
                            <small v-if="isSapField('addressLine2')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="addressLine3">Address Line 3</label>
                            <InputText id="addressLine3" type="text" v-model="form.addressLine3" :class="{ 'bg-blue-50': isSapField('addressLine3') }" />
                            <small v-if="isSapField('addressLine3')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="addressLine4">Address Line 4</label>
                            <InputText id="addressLine4" type="text" v-model="form.addressLine4" :class="{ 'bg-blue-50': isSapField('addressLine4') }" />
                            <small v-if="isSapField('addressLine4')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="city">City</label>
                            <InputText id="city" type="text" v-model="form.city" :class="{ 'bg-blue-50': isSapField('city') }" />
                            <small v-if="isSapField('city')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="postcode">Postcode</label>
                            <InputText id="postcode" type="text" v-model="form.postcode" :class="{ 'bg-blue-50': isSapField('postcode') }" />
                            <small v-if="isSapField('postcode')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="state">State</label>
                            <InputText id="state" type="text" v-model="form.state" :class="{ 'bg-blue-50': isSapField('state') }" />
                            <small v-if="isSapField('state')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="country">Country</label>
                            <InputText id="country" type="text" v-model="form.country" :class="{ 'bg-blue-50': isSapField('country') }" />
                            <small v-if="isSapField('country')" class="text-blue-600">Data from SAP</small>
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
                            <InputText id="phoneNumber" type="text" v-model="form.phoneNumber" :class="{ 'bg-blue-50': isSapField('phoneNumber') }" />
                            <small v-if="isSapField('phoneNumber')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="emailAddress">Email</label>
                            <InputText id="emailAddress" type="text" v-model="form.emailAddress" :class="{ 'bg-blue-50': isSapField('emailAddress') }" />
                            <small v-if="isSapField('emailAddress')" class="text-blue-600">Data from SAP</small>
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
                            <InputText id="paymentTerms" type="text" v-model="form.paymentTerms" :class="{ 'bg-blue-50': isSapField('paymentTerms') }" />
                            <small v-if="isSapField('paymentTerms')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="riskCategory">Risk Category</label>
                            <InputText id="riskCategory" type="text" v-model="form.riskCategory" :class="{ 'bg-blue-50': isSapField('riskCategory') }" />
                            <small v-if="isSapField('riskCategory')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="creditLimit">Credit Limit</label>
                            <InputText id="creditLimit" type="text" v-model="form.creditLimit" :class="{ 'bg-blue-50': isSapField('creditLimit') }" />
                            <small v-if="isSapField('creditLimit')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="customerAccountGroup">Customer Account Group</label>
                            <InputText id="customerAccountGroup" type="text" v-model="form.customerAccountGroup" :class="{ 'bg-blue-50': isSapField('customerAccountGroup') }" />
                            <small v-if="isSapField('customerAccountGroup')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="customerCondGrp">Customer Condition Group</label>
                            <InputText id="customerCondGrp" type="text" v-model="form.customerCondGrp" :class="{ 'bg-blue-50': isSapField('customerCondGrp') }" />
                            <small v-if="isSapField('customerCondGrp')" class="text-blue-600">Data from SAP</small>
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
                            <InputText id="priceGroup" type="text" v-model="form.priceGroup" :class="{ 'bg-blue-50': isSapField('priceGroup') }" />
                            <small v-if="isSapField('priceGroup')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="priceProcedure">Price Procedure</label>
                            <InputText id="priceProcedure" type="text" v-model="form.priceProcedure" :class="{ 'bg-blue-50': isSapField('priceProcedure') }" />
                            <small v-if="isSapField('priceProcedure')" class="text-blue-600">Data from SAP</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <label for="salesOffice">Sales Office</label>
                            <InputText id="salesOffice" type="text" v-model="form.salesOffice" :class="{ 'bg-blue-50': isSapField('salesOffice') }" />
                            <small v-if="isSapField('salesOffice')" class="text-blue-600">Data from SAP</small>
                        </div>
                        <div class="w-full">
                            <label for="salesDistrict">Sales District</label>
                            <InputText id="salesDistrict" type="text" v-model="form.salesDistrict" :class="{ 'bg-blue-50': isSapField('salesDistrict') }" />
                            <small v-if="isSapField('salesDistrict')" class="text-blue-600">Data from SAP</small>
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
                            <InputText id="signboardBrand" type="text" v-model="form.signboardBrand" :class="{ 'bg-blue-50': isSapField('signboardBrand') }" />
                            <small v-if="isSapField('signboardBrand')" class="text-blue-600">Data from SAP</small>
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
                            <Dropdown v-model="allowLalamove" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
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
                            <Dropdown v-model="showOnList" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                        <div class="w-full">
                            <label for="ifFamilyChannel">If Family Channel</label>
                            <Dropdown v-model="ifFamilyChannel" :options="dropdownYesNoValue" optionLabel="name" placeholder="Select Option" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📍 Ship To Accounts -->
            <div class="mt-8">
                <div class="card w-full">
                    <div class="font-semibold text-xl border-b pb-2 mb-4 flex justify-between items-center">
                        <span>📍 Ship To Accounts</span>
                        <Button label="Add Ship To" icon="pi pi-plus" @click="addNewShipTo" class="p-button-sm" />
                    </div>

                    <!-- Loop through all Ship To addresses -->
                    <div v-for="(shipTo, index) in shipToAddresses" :key="index" class="border rounded-2xl p-5 mb-6 bg-gray-50 shadow-sm">
                        <div class="font-bold text-lg text-gray-700 mb-4 flex justify-between items-center">
                            <span>Ship To Account {{ index + 1 }}</span>
                            <Button label="Remove" icon="pi pi-trash" @click="removeShipTo(index)" class="p-button-danger p-button-sm" v-if="shipToAddresses.length > 1" />
                        </div>

                        <!-- Account Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="font-medium text-gray-600">Ship To Account No</label>
                                <InputText v-model="shipTo.custaccountno" placeholder="Enter account number" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'custaccountno') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'custaccountno')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Email</label>
                                <InputText v-model="shipTo.emailaddress" placeholder="example@email.com" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'emailaddress') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'emailaddress')" class="text-blue-600">Data from SAP</small>
                            </div>
                        </div>

                        <!-- Company Names -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Company Name 1</label>
                                <InputText v-model="shipTo.companyname1" placeholder="Company Name Line 1" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'companyname1') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'companyname1')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 2</label>
                                <InputText v-model="shipTo.companyname2" placeholder="Company Name Line 2" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'companyname2') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'companyname2')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 3</label>
                                <InputText v-model="shipTo.companyname3" placeholder="Company Name Line 3" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'companyname3') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'companyname3')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Company Name 4</label>
                                <InputText v-model="shipTo.companyname4" placeholder="Company Name Line 4" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'companyname4') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'companyname4')" class="text-blue-600">Data from SAP</small>
                            </div>
                        </div>

                        <!-- Address Lines -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Address Line 1</label>
                                <InputText v-model="shipTo.addressline1" placeholder="Address Line 1" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'addressline1') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'addressline1')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 2</label>
                                <InputText v-model="shipTo.addressline2" placeholder="Address Line 2" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'addressline2') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'addressline2')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 3</label>
                                <InputText v-model="shipTo.addressline3" placeholder="Address Line 3" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'addressline3') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'addressline3')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Address Line 4</label>
                                <InputText v-model="shipTo.addressline4" placeholder="Address Line 4" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'addressline4') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'addressline4')" class="text-blue-600">Data from SAP</small>
                            </div>
                        </div>

                        <!-- Location Info -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">City</label>
                                <InputText v-model="shipTo.city" placeholder="City" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'city') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'city')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Postcode</label>
                                <InputText v-model="shipTo.postcode" placeholder="Postcode" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'postcode') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'postcode')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">State</label>
                                <InputText v-model="shipTo.state" placeholder="State" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'state') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'state')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Country</label>
                                <InputText v-model="shipTo.country" placeholder="Country" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'country') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'country')" class="text-blue-600">Data from SAP</small>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="font-medium text-gray-600">Phone No</label>
                                <InputText v-model="shipTo.phoneno" placeholder="e.g. 03-1234567" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'phoneno') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'phoneno')" class="text-blue-600">Data from SAP</small>
                            </div>
                            <div>
                                <label class="font-medium text-gray-600">Mobile No</label>
                                <InputText v-model="shipTo.mobilephoneno" placeholder="e.g. 012-3456789" class="w-full" :class="{ 'bg-blue-50': isSapShipToField(shipTo.custaccountno, 'mobilephoneno') }" />
                                <small v-if="isSapShipToField(shipTo.custaccountno, 'mobilephoneno')" class="text-blue-600">Data from SAP</small>
                            </div>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-if="shipToAddresses.length === 0" class="text-center py-8 text-gray-500">No Ship To accounts added. Click "Add Ship To" to add one.</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="flex flex-col md:flex-row justify-end gap-2">
                        <div class="w-40">
                            <Button label="Cancel" class="w-full p-button-secondary" @click="handleBack" :disabled="isSubmitting" />
                        </div>
                        <div class="w-40">
                            <Button label="Update" class="w-full" @click="handleSubmit" :loading="isSubmitting" />
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
