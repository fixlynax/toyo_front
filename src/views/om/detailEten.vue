<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col">
                    <div class="card flex flex-col gap-4 w-full">
                        <div class="flex items-center justify-between border-b pb-2 mb-4">
                            <div class="flex items-center gap-2">
                                <RouterLink to="/om/listEten">
                                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                                </RouterLink>
                                <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                            </div>

                            <RouterLink to="/om/editEten">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div>
                            <span class="block text-sm text-gray-500">Account No.</span>
                            <span class="text-lg font-medium">{{ form.custAccountNo }}</span>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-4 w-full">
                        <div class="text-xl font-semibold border-b pb-2">🏢 Company Details</div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Company Registration No</span>
                                <p class="text-lg font-medium">{{ form.companyRegNo }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Company Name 1</span>
                                <p class="text-lg font-medium">{{ form.companyName1 }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Company Name 2</span>
                                <p class="text-lg font-medium">{{ form.companyName2 || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Company Name 3</span>
                                <p class="text-lg font-medium">{{ form.companyName3 || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Company Name 4</span>
                                <p class="text-lg font-medium">{{ form.companyName4 || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Sales Tax No</span>
                                <p class="text-lg font-medium">{{ form.salesTaxNo }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Service Tax No</span>
                                <p class="text-lg font-medium">{{ form.serviceTaxNo }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">TIN No</span>
                                <p class="text-lg font-medium">{{ form.tinNo }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">VAT No</span>
                                <p class="text-lg font-medium">{{ form.vatNo }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-4 w-full">
                        <div class="text-xl font-semibold border-b pb-2">📍 Address & Contact Details</div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Address Line 1</span>
                                <p class="text-lg font-medium">{{ form.addressLine1 }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Address Line 2</span>
                                <p class="text-lg font-medium">{{ form.addressLine2 }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Address Line 3</span>
                                <p class="text-lg font-medium">{{ form.addressLine3 || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Address Line 4</span>
                                <p class="text-lg font-medium">{{ form.addressLine4 || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">City</span>
                                <p class="text-lg font-medium">{{ form.city }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Postcode</span>
                                <p class="text-lg font-medium">{{ form.postcode }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">State</span>
                                <p class="text-lg font-medium">{{ form.state }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Country</span>
                                <p class="text-lg font-medium">{{ form.country }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Map Latitude</span>
                                <p class="text-lg font-medium">{{ form.mapLatitude }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Map Longitude</span>
                                <p class="text-lg font-medium">{{ form.mapLongitude }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Phone No</span>
                                <p class="text-lg font-medium">{{ form.phoneNumber }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Email</span>
                                <p class="text-lg font-medium">{{ form.emailAddress }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-4 w-full">
                        <div class="text-xl font-semibold border-b pb-2">👤 Account Details</div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Account Type</span>
                                <p class="text-lg font-medium">{{ form.accountType }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Payment Terms</span>
                                <p class="text-lg font-medium">{{ form.paymentTerms }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Risk Category</span>
                                <p class="text-lg font-medium">{{ form.riskCategory }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Credit Limit</span>
                                <p class="text-lg font-medium">{{ form.creditLimit }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Customer Account Group</span>
                                <p class="text-lg font-medium">{{ form.customerAccountGroup }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Customer Condition Group</span>
                                <p class="text-lg font-medium">{{ form.customerCondGrp }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-4 w-full">
                        <div class="text-xl font-semibold border-b pb-2">💲 Pricing & Sales Info</div>

                        <div class="grid md:grid-cols-3 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Price List</span>
                                <p class="text-lg font-medium">{{ form.pricelist }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Price Group</span>
                                <p class="text-lg font-medium">{{ form.priceGroup }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Price Procedure</span>
                                <p class="text-lg font-medium">{{ form.priceProcedure }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Sales Office</span>
                                <p class="text-lg font-medium">{{ form.salesOffice }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Sales District</span>
                                <p class="text-lg font-medium">{{ form.salesDistrict }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Starting Sales Amount</span>
                                <p class="text-lg font-medium">{{ form.startingSalesAmt }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-4 w-full">
                        <div class="text-xl font-semibold border-b pb-2">🚚 Shipping & Delivery</div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Shipping Condition</span>
                                <p class="text-lg font-medium">{{ form.shippingCond }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Allow Lalamove</span>
                                <p class="text-lg font-medium">{{ form.allowLalamove ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-4 w-full">
                        <div class="text-xl font-semibold border-b pb-2">🪧 Signboard / Branding</div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Signboard Type</span>
                                <p class="text-lg font-medium">{{ form.signboardType }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Signboard Brand</span>
                                <p class="text-lg font-medium">{{ form.signboardBrand ? 'Yes' : 'No' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/3">
                <!-- Suspend Account -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Account Status</div>
                        <div>
                            <Button label="Manage Device" icon="pi pi-tablet" size="small" class="!py-1 !px-3 text-sm" />
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Terms -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Terms</td>
                                    <td class="px-4 py-2 text-right">NET30</td>
                                </tr>

                                <!-- Risk Category -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Risk Category</td>
                                    <td class="px-4 py-2 text-right">
                                        <span class="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded"> Low </span>
                                    </td>
                                </tr>

                                <!-- Credit Limit -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Credit Limit</td>
                                    <td class="px-4 py-2 text-right">50,000</td>
                                </tr>

                                <!-- Status -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Status</td>
                                    <td class="px-4 py-2 text-right">
                                        <span class="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded"> <i class="pi pi-check-circle mr-1"></i> Active </span>
                                    </td>
                                </tr>

                                <!-- Suspend Button -->
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="px-2 py-2 text-right">
                                        <Button :label="isSuspended ? 'Un-suspend' : 'Suspend'" :severity="isSuspended ? 'success' : 'danger'" size="small" @click="confirmSuspend" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Device List -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Forecast vs Actual Comparison</div>
                    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
                    <div class="overflow-x-auto"></div>
                </div>

                <!-- Finance Document -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Documents</div>

                    <!-- Document Items -->
                    <div class="space-y-3">
                        <!-- Billing -->
                        <div class="flex items-center justify-between px-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-blue-500"></i>
                                <span>Billing</span>
                            </div>
                            <RouterLink to="/billing">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Account Details -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-green-500"></i>
                                <span>Account Details</span>
                            </div>
                            <RouterLink to="/account-details">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Staff Billing -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-purple-500"></i>
                                <span>Staff Billing</span>
                            </div>
                            <RouterLink to="/staff-billing">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Statement -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-pink-500"></i>
                                <span>Statement</span>
                            </div>
                            <RouterLink to="/statement">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>

                        <!-- Finance Document -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-folder text-orange-500"></i>
                                <span>Finance Document</span>
                            </div>
                            <RouterLink to="/finance-document">
                                <Button label="Go" size="small" />
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <!-- Header -->
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Ship To</div>
                    <!-- Optional button area (keep empty for consistency) -->
                    <div></div>
                </div>

                <!-- Ship To Table -->
                <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                    <Column field="companyName1" header="Company Name" style="min-width: 12rem" />
                    <Column header="Address" style="min-width: 16rem">
                        <template #body="{ data }">
                            {{ data.addressLine1 }}<br />
                            <span v-if="data.addressLine2">{{ data.addressLine2 }}<br /></span>
                            <span v-if="data.addressLine3">{{ data.addressLine3 }}<br /></span>
                            <span v-if="data.addressLine4">{{ data.addressLine4 }}</span>
                            {{ data.city }}, {{ data.state }} {{ data.postcode }}<br />
                            {{ data.country }}
                        </template>
                    </Column>

                    <Column field="phoneNumber" header="Phone No" style="min-width: 10rem" />
                    <Column field="emailAddress" header="Email" style="min-width: 14rem" />
                </DataTable>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <!-- Header -->
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">User List</div>
                    <div class="inline-flex items-center gap-2">
                        <RouterLink to="/om/createUserEten">
                            <Button label="Create" class="p-button-info" size="small" />
                        </RouterLink>
                    </div>
                </div>

                <!-- User Table -->
                <DataTable :value="users" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                    <Column header="User Info" style="min-width: 1rem">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <RouterLink to="/om/detailUser" class="hover:underline font-bold">
                                    {{ data.name }}
                                    <span v-if="data.isMaster === 1" class="text-blue-400">(Admin)</span>
                                </RouterLink>
                            </div>
                        </template>
                    </Column>

                    <Column header="Module" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.modules.join(', ') }}
                        </template>
                    </Column>
                    <Column field="lastLogin" header="Last Login" style="min-width: 8rem" />

                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                        </template>
                    </Column>
                    <Column field="activationCode" header="Activation Code" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Button icon="pi pi-send" label="Send" style="width: fit-content" class="p-button-info p-button-sm" @click="sendSetting(data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Forecast',
                backgroundColor: '#0062B0',
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderWidth: 0,
                borderRadius: 16, // More rounded corners
                borderSkipped: false,
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'Actual',
                backgroundColor: '#B1DEFF',
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                borderWidth: 0,
                borderRadius: 16, // More rounded corners
                borderSkipped: false,
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                position: 'top',
                align: 'center',
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    padding: 20,
                    boxWidth: 8,
                    boxHeight: 8
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.x}`;
                    }
                }
            }
        },
        scales: {
            x: {
                position: 'top',
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    },
                    callback: function (value) {
                        return value;
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    padding: 10
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        },
        // Enhanced bar styling
        elements: {
            bar: {
                borderRadius: 16, // Even more rounded
                borderSkipped: false
            }
        },
        barPercentage: 0.7,
        categoryPercentage: 0.8
    };
};

const form = ref({
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
});

// 1. Suspend/Un-suspend
const isSuspended = ref(false);
const confirmSuspend = () => {
    isSuspended.value = !isSuspended.value;
};

// 2. Block/Un-block Device List
const devices = ref([
    {
        id: 1,
        name: 'iPhone 16',
        uniqueId: '00008030-001E3D400043402E',
        lastActive: '8/9/2025 10:54 pm',
        isBlocked: false
    },
    {
        id: 2,
        name: 'Samsung Galaxy',
        uniqueId: 'a8098c1a-f86e-11da-bd1a-00112444be1e',
        lastActive: '8/9/2025 5:13 pm',
        isBlocked: true
    }
]);

const toggleBlock = (device) => {
    device.isBlocked = !device.isBlocked;
};

const users = ref([
    { id: 'U001', name: 'John Doe', phone: '0123456789', modules: ['Marketing', 'Sales'], account: '6080100900', lastLogin: '11/9/2025 8:00am', status: 1, isMaster: 1 },
    { id: 'U002', name: 'Jane Smith', phone: '0198765432', modules: ['OM', 'Technical'], account: '6080100901', lastLogin: '10/9/2025 8:00am', status: 1, isMaster: 0 },
    { id: 'U003', name: 'Alex Tan', phone: '0172233445', modules: ['ITBilling'], account: '6080100902', lastLogin: '23/7/2025 8:00am', status: 0, isMaster: 0 },
    { id: 'U004', name: 'Siti Aminah', phone: '0111122233', modules: ['SCM', 'Sales', 'Marketing'], account: '6080100903', lastLogin: '09/9/2025 8:00am', status: 1, isMaster: 0 },
    { id: 'U005', name: 'Michael Lee', phone: '0139988776', modules: ['Technical', 'IT'], account: '6080100904', lastLogin: '07/8/2025 8:00am', status: 0, isMaster: 0 }
]);

const billingDocs = ref([
    { id: 1, name: 'Invoice #001', type: 'Invoice' },
    { id: 2, name: 'Credit Note #100', type: 'CN' },
    { id: 3, name: 'Debit Note #200', type: 'DN' },
    { id: 4, name: 'SOA Jan 2025', type: 'SOA Statement' },
    { id: 5, name: 'Refund Note #10', type: 'Refund Note' }
]);

const viewDoc = (doc) => {
    console.log('Viewing billing document:', doc);
};

// 4. Finance Documents
const financeDocs = ref([
    { id: 1, name: 'Payment Receipt' },
    { id: 2, name: 'Tax Certificate' },
    { id: 3, name: 'Bank Statement' },
    { id: 4, name: 'Audit Report' },
    { id: 5, name: 'Financial Summary' }
]);

const viewFinance = (doc) => {
    console.log('Viewing finance document:', doc);
};

const manageUser = (user) => {
    console.log('Managing user:', user);
};

const shiptoList = ref([
    {
        id: 1,
        companyName1: 'Tan Know Car Tires',
        companyName2: '',
        companyName3: '',
        companyName4: '',
        addressLine1: 'Lot 123, Jalan Sungai',
        addressLine2: 'Seksyen 15',
        addressLine3: '',
        addressLine4: '',
        city: 'Shah Alam',
        state: 'Selangor',
        postcode: '40150',
        country: 'Malaysia',
        phoneNumber: '03-55123456',
        mobileNumber: '012-3456789',
        emailAddress: 'info@toyotires.my'
    },
    {
        id: 2,
        companyName1: 'Shiro Auto Parts',
        companyName2: 'Warehouse Division',
        companyName3: '',
        companyName4: '',
        addressLine1: 'No 45, Jalan Merdeka',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        postcode: '50450',
        country: 'Malaysia',
        phoneNumber: '03-98765432',
        mobileNumber: '019-8765432',
        emailAddress: 'contact@shiroauto.com'
    }
]);

const onManageDevice = () => {
    console.log('Manage device clicked');
};

const sendSetting = (data) => {
    console.log('Sending activation code to:', data.name);
};
</script>
