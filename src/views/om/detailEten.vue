<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col">
                    <div class="card flex flex-col gap-4 w-full">
                        <div class="flex items-center justify-between border-b pb-2 mb-2">
                            <!-- LEFT SIDE -->
                            <div class="flex items-center gap-2">
                                <RouterLink to="/om/listEten">
                                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                                </RouterLink>

                                <div class="text-2xl font-bold text-gray-800">Company Information</div>
                            </div>

                            <!-- RIGHT SIDE -->
                            <div class="flex items-center gap-2">
                                <Button v-if="canUpdate" @click="pullSAPData" :loading="loadingPullSAP" :disabled="loadingPullSAP" icon="pi pi-refresh" class="p-button-info" style="width: 70px">
                                    <span v-if="loadingPullSAP">Pulling SAP...</span>
                                    <span v-else>Pull SAP</span>
                                </Button>

                                <RouterLink :to="`/om/editEten/${form.custAccountNo}`">
                                    <Button v-if="canUpdate" icon="pi pi-pencil" class="p-button-warning" v-tooltip="'Edit'" />
                                </RouterLink>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Customer Name</span>
                                <p class="text-lg font-medium">{{ getCustomerName() || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Company Registration No</span>
                                <p class="text-lg font-medium">{{ form.companyRegNo || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Sales Tax No</span>
                                <p class="text-lg font-medium">{{ form.salesTaxNo || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Service Tax No</span>
                                <p class="text-lg font-medium">{{ form.serviceTaxNo || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">TIN No</span>
                                <p class="text-lg font-medium">{{ form.tinNo || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">VAT No</span>
                                <p class="text-lg font-medium">{{ form.vatNo || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Address</span>
                                <p class="text-lg font-medium">{{ getAddress() || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">City</span>
                                <p class="text-lg font-medium">{{ form.city || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Postcode</span>
                                <p class="text-lg font-medium">{{ form.postcode || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">State</span>
                                <p class="text-lg font-medium">{{ form.state || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Country</span>
                                <p class="text-lg font-medium">{{ form.country || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Coordinate Map (Long, Lat)</span>
                                <p class="text-lg font-medium">{{ form.mapLatitude ?? '-' }}° , {{ form.mapLongitude ?? '-' }}°</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Phone No.</span>
                                <p class="text-lg font-medium">{{ form.phoneNumber || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Email</span>
                                <p class="text-lg font-medium">{{ form.emailAddress || '-' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card flex flex-col gap-1 w-full">
                        <!-- Header -->
                        <div class="flex items-center justify-between border-b pb-2 mb-4">
                            <div class="text-2xl font-bold text-gray-800">Ship To</div>
                        </div>

                        <!-- Ship To Table -->
                        <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="rounded-table">
                            <Column header="Company Name" style="min-width: 13rem">
                                <template #body="{ data }">
                                    <span class="font-bold"> {{ data.custAccountNo }}<br /></span>
                                    {{ getShipToCustomerName(data) || '' }}<br />
                                </template>
                            </Column>
                            <Column header="Address" style="min-width: 13rem">
                                <template #body="{ data }">
                                    {{ getShipToAddress(data) || '' }}<br />
                                    {{ data.city }} {{ data.state }}<br />
                                    {{ data.postcode }} {{ data.country }}
                                </template>
                                <template #filterapply="slotProps"></template>
                                <template #filterclear="slotProps"></template>
                            </Column>

                            <Column field="phoneNumber" header="Phone No" style="min-width: 10rem">
                                <template #body="slotProps">
                                    {{ slotProps.data.phoneNumber || '-' }}
                                </template>
                            </Column>
                            <Column header="Email" style="min-width: 14rem">
                                <template #body="slotProps">
                                    {{ slotProps.data.emailAddress || '-' }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <div class="card flex flex-col gap-1 w-full">
                        <!-- Header -->
                        <div class="flex items-center justify-between border-b pb-2 mb-4">
                            <div class="text-2xl font-bold text-gray-800">User List</div>
                            <div class="inline-flex items-center gap-2">
                                <!-- Search Input -->
                                    <IconField class="flex-1">
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="userSearchTerm" placeholder="Search users..." class="p-inputtext-sm" @input="onUserSearch" />
                                    </IconField>
                                <RouterLink :to="`/om/createUserEten/${form.custAccountNo}`">
                                    <Button v-if="canUpdate" label="Create" class="p-button-info" size="small" />
                                </RouterLink>
                            </div>
                        </div>

                        <!-- User Table -->
                        <DataTable
                            :value="filteredUsers"
                            :rows="5"
                            dataKey="id"
                            :rowHover="true"
                            responsiveLayout="scroll"
                            class="rounded-table"
                            :paginator="true"
                            :rowsPerPageOptions="[5, 10, 20, 50]"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        >
                            <Column header="User Info" style="min-width: 1rem">
                                <template #body="{ data }">
                                    <div class="flex flex-col">
                                        <RouterLink :to="`/om/detailUser/${data.id}`" class="hover:underline font-bold">
                                            {{ data.firstName }} {{ data.lastName }}
                                            <span v-if="data.isMaster === 1" class="text-blue-400">(Master)</span>
                                        </RouterLink>
                                        <span class="text-sm text-gray-500">{{ data.emailAddress }}</span>
                                        <span class="text-sm text-gray-500">{{ data.countryCode }}{{ data.mobileNumber }}</span>
                                    </div>
                                </template>
                            </Column>

                            <Column header="Module" style="min-width: 8rem">
                                <template #body="{ data }">
                                    {{ getUserModules(data) }}
                                </template>
                            </Column>

                            <Column field="lastLogin" header="Last Login" style="min-width: 8rem">
                                <template #body="{ data }">
                                    {{ formatDate(data.lastLogin) }}
                                </template>
                            </Column>

                            <Column field="lastLogin" header="Activated Date" style="min-width: 8rem">
                                <template #body="{ data }">
                                    {{ formatDate(data.activated) }}
                                </template>
                            </Column>

                            <Column header="Status" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                                </template>
                            </Column>

                            <Column v-if="canUpdate" header="Activation Code" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <Button v-if="data.activated === null" icon="pi pi-send" label="Send" style="width: fit-content" class="p-button-info p-button-sm" @click="sendActivationCode(data)" />
                                    <label v-else>-</label>
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <!-- Forecast vs Actual Chart -->
                    <div class="card flex flex-col w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Forecast vs Actual Comparison</div>
                        <div v-if="salesForecast && salesForecast.comparison" class="h-[30rem]">
                            <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full" />
                        </div>
                        <div v-else class="h-[30rem] flex items-center justify-center text-gray-500">No forecast data available</div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/3">
                <!-- Suspend Account -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Account Info</div>
                        <!-- <span class="inline-flex items-center px-3 py-2 text-xs font-semibold text-green-700 bg-green-100 rounded"> <i class="pi pi-check-circle mr-1"></i> {{ form.accountStatus === 'false' ? 'Inactive' : 'Active' }} </span> -->
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Terms -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">eTEN No.</td>
                                    <td class="px-4 py-2 font-bold text-right text-primary">{{ form.memberCode }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Account No.</td>
                                    <td class="px-4 py-2 font-bold text-right text-primary">{{ form.custAccountNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Account Type</td>
                                    <td class="px-4 py-2 text-right">{{ form.accountType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Terms</td>
                                    <td class="px-4 py-2 text-right">{{ form.paymentTerms || '-' }}</td>
                                </tr>

                                <!-- Risk Category -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Risk Category</td>
                                    <td class="px-4 py-2 text-right">
                                        <span class="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded"> {{ form.riskCategory || 'Low' }} </span>
                                    </td>
                                </tr>

                                <!-- Credit Limit -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Credit Limit</td>
                                    <td class="px-4 py-2 text-right">{{ formatCurrency(form.creditLimit) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Account Group</td>
                                    <td class="px-4 py-2 text-right">{{ form.customerAccountGroup || '-' }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price List</td>
                                    <td class="px-4 py-2 text-right">{{ form.pricelist || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price Group</td>
                                    <td class="px-4 py-2 text-right">{{ form.priceGroup || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price Procedure</td>
                                    <td class="px-4 py-2 text-right">{{ form.priceProcedure || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Sales Office</td>
                                    <td class="px-4 py-2 text-right">{{ form.salesOffice || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Sales District</td>
                                    <td class="px-4 py-2 text-right">{{ form.salesDistrict || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Starting Sales Amount</td>
                                    <td class="px-4 py-2 text-right">{{ formatCurrency(form.startingSalesAmt) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Revenue</td>
                                    <td class="px-4 py-2 text-right">{{ formatCurrency(form.revenue) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Total Quantity</td>
                                    <td class="px-4 py-2 text-right">{{ form.targetQty || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Condition Group</td>
                                    <td class="px-4 py-2 text-right">{{ form.customerCondGrp || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Shipping Condition</td>
                                    <td class="px-4 py-2 text-right">{{ form.shippingCond || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Family Channel</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ form.isFamilyChannel == 1 ? 'Yes' : 'No' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Show In T-Care</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ form.showOnList == 1 ? 'Yes' : 'No' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow Lalamove</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ form.allowLalamove == 1 ? 'Yes' : 'No' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow Own Collection</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ form.allowOwnCollection == 1 ? 'Yes' : 'No' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Allow Direct Shipment</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ form.allowDirectship == 1 ? 'Yes' : 'No' }}
                                    </td>
                                </tr>

                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Signboard Type</td>
                                    <td class="px-4 py-2 text-right">{{ form.signboardType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Signboard Brand</td>
                                    <td class="px-4 py-2 text-right">{{ form.signboardBrand || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Finance Document -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Documents</div>

                    <!-- Document Items -->
                    <div class="space-y-3">
                        <!-- Account Details -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-id-card text-green-500"></i>
                                <span>Account Details</span>
                            </div>
                            <RouterLink :to="`/billing/listAccountDetailPersonal/${form.custAccountNo}`"> <Button label="Go" size="small" /> </RouterLink>
                        </div>

                        <!-- Billing -->
                        <div class="flex items-center justify-between px-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-file text-blue-500"></i>
                                <span>E-Invoice</span>
                            </div>
                            <RouterLink :to="`/billing/listBillingPersonal/${form.custAccountNo}`"> <Button label="Go" size="small" /> </RouterLink>
                        </div>

                        <!-- Staff Billing -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-file-check text-purple-500"></i>
                                <span>Self Bill E-Invoice</span>
                            </div>
                            <RouterLink :to="`/billing/listEbillingPersonal/${form.custAccountNo}`"> <Button label="Go" size="small" /> </RouterLink>
                        </div>

                        <!-- Statement -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-receipt text-pink-500"></i>
                                <span>Statement</span>
                            </div>
                            <RouterLink :to="`/billing/listStatementPersonal/${form.custAccountNo}`"> <Button label="Go" size="small" /> </RouterLink>
                        </div>

                        <!-- Finance Document -->
                        <div class="flex items-center justify-between px-2 mt-2">
                            <div class="flex items-center gap-2 text-gray-700">
                                <i class="pi pi-file-plus text-orange-500"></i>
                                <span>Others</span>
                            </div>
                            <RouterLink :to="`/billing/listOtherPersonal/${form.custAccountNo}`"> <Button label="Go" size="small" /> </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Customer'));

const toast = useToast();
const route = useRoute();

// Reactive data
const form = ref({});
const users = ref([]);
const shiptoList = ref([]);
const salesForecast = ref(null);
const loading = ref(false);
const isSuspended = ref(false);
const loadingPullSAP = ref(false);

// User search functionality
const userSearchTerm = ref('');

// Chart data
const chartData = ref();
const chartOptions = ref();

// Computed property for filtered users
const filteredUsers = computed(() => {
    if (!userSearchTerm.value.trim()) {
        return users.value;
    }

    const searchTerm = userSearchTerm.value.toLowerCase().trim();
    return users.value.filter((user) => {
        return (
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm)) ||
            (user.emailAddress && user.emailAddress.toLowerCase().includes(searchTerm)) ||
            (user.countryCode && user.countryCode.toLowerCase().includes(searchTerm)) ||
            (user.mobileNumber && user.mobileNumber.includes(searchTerm))
        );
    });
});

// Helper functions to combine customer name and address
const getCustomerName = () => {
    const parts = [];
    if (form.value.companyName1) parts.push(form.value.companyName1);
    if (form.value.companyName2) parts.push(form.value.companyName2);
    if (form.value.companyName3) parts.push(form.value.companyName3);
    if (form.value.companyName4) parts.push(form.value.companyName4);
    return parts.join(' ');
};

const getAddress = () => {
    const parts = [];
    // if (form.value.addressLine1) parts.push(form.value.addressLine1);
    if (form.value.addressLine2) parts.push(form.value.addressLine2);
    if (form.value.addressLine3) parts.push(form.value.addressLine3);
    if (form.value.addressLine4) parts.push(form.value.addressLine4);
    return parts.join(' ');
};

const getShipToCustomerName = (data) => {
    const parts = [];
    if (data.companyName1) parts.push(data.companyName1);
    if (data.companyName2) parts.push(data.companyName2);
    if (data.companyName3) parts.push(data.companyName3);
    if (data.companyName4) parts.push(data.companyName4);
    return parts.join(' ');
};

const getShipToAddress = (data) => {
    const parts = [];
    // if (data.addressLine1) parts.push(data.addressLine1);
    if (data.addressLine2) parts.push(data.addressLine2);
    if (data.addressLine3) parts.push(data.addressLine3);
    if (data.addressLine4) parts.push(data.addressLine4);
    return parts.join(' ');
};

// User search handler
const onUserSearch = () => {
    // Search is handled by computed property
};

// Pull SAP Data function
const pullSAPData = async () => {
    loadingPullSAP.value = true;
    try {
        const custAccNo = route.params.custAccNo;

        // Call the SAP update API
        const response = await api.postExtra('update_customer-SAP', {
            custaccountno: custAccNo
        });

        if (response.data.status === 1) {
            // Success - show success toast and refresh the data
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data successfully pulled from SAP',
                life: 5000
            });

            // Refresh the dealer profile data to show updated information
            await fetchDealerProfile();
        } else {
            // SAP returned error
            const errorMessage = response.data.message || 'Failed to pull data from SAP';
            toast.add({
                severity: 'error',
                summary: 'SAP Error',
                detail: errorMessage,
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error pulling SAP data:', error);

        // Handle different types of errors
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            // Server responded with error status
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = `Server error: ${error.response.status}`;
            }
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'No response from server. Please check your connection.';
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loadingPullSAP.value = false;
    }
};

// Fetch dealer profile data
const fetchDealerProfile = async () => {
    loading.value = true;
    try {
        const custAccNo = route.params.custAccNo;
        const response = await api.get(`profile_dealer/${custAccNo}`);

        if (response.data.status === 1 && response.data.admin_data && response.data.admin_data.length > 0) {
            const dealerData = response.data.admin_data[0];
            form.value = dealerData;
            users.value = dealerData.user_list || [];
            shiptoList.value = dealerData.shipTo_list || [];
            salesForecast.value = dealerData.salesForecast;

            // Update chart data
            if (salesForecast.value && salesForecast.value.comparison) {
                chartData.value = setChartData();
                chartOptions.value = setChartOptions();
            }
        } else {
            console.log('No dealer data found');
        }
    } catch (error) {
        console.error('Error fetching dealer profile:', error);
    } finally {
        loading.value = false;
    }
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '-';

    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value));
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    let formatted = date.toLocaleString('en-MY', options);
    
    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};

// Get user modules
const getUserModules = (user) => {
    const modules = [];
    if (user.allow_warranty) modules.push('Warranty');
    if (user.allow_order) modules.push('Order');
    if (user.allow_billing) modules.push('Billing');
    if (user.allow_sale) modules.push('Sales');
    if (user.allow_user) modules.push('User');

    // Check if all modules are allowed
    const allModules = ['Warranty', 'Order', 'Billing', 'Sales', 'User'];
    const hasAllModules = allModules.every((module) => modules.includes(module));

    return hasAllModules ? 'Full Access' : modules.length > 0 ? modules.join(', ') : '-';
};

// Send activation code
const sendActivationCode = async (user) => {
    try {
        const response = await api.get(`resend-OTP/${user.id}`);

        if (response.data.status === 1) {
            console.log('Activation code sent successfully');

            // ✅ Correct toast syntax
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Activation code sent successfully',
                life: 3000
            });
        } else {
            console.error('Failed to send activation code');
            toast.add({
                severity: 'error',
                summary: 'Failed',
                detail: 'Failed to send activation code',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error sending activation code:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while sending the activation code',
            life: 3000
        });
    }
};

// Chart configuration
const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const comparison = salesForecast.value.comparison;

    // Calculate target sales line position
    const targetSalesValue = form.value.targetQty ? form.value.targetQty / 3 : 0;

    // Find the maximum value for proper positioning
    const allValues = Object.values(comparison).flatMap((item) => [item.forecast, item.actual]);
    const maxValue = Math.max(...allValues, targetSalesValue);

    return {
        labels: Object.keys(comparison),
        datasets: [
            {
                label: 'Forecast',
                backgroundColor: '#0062B0',
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderWidth: 0,
                borderRadius: 16,
                borderSkipped: false,
                data: Object.values(comparison).map((item) => item.forecast)
            },
            {
                label: 'Actual',
                backgroundColor: '#B1DEFF',
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                borderWidth: 0,
                borderRadius: 16,
                borderSkipped: false,
                data: Object.values(comparison).map((item) => item.actual)
            },
            // Target Sales Line Dataset (as annotation line)
            {
                type: 'line',
                label: 'Target Sales',
                borderColor: '#FF6B6B',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 0,
                data: Object.keys(comparison).map(() => targetSalesValue)
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
                mode: 'nearest',
                intersect: true,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#374151',
                borderColor: '#d1d5db',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    title: function (context) {
                        return context[0].label;
                    },
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.x;

                        // Don't show label for target sales line in tooltip
                        if (context.datasetIndex === 2) {
                            return '';
                        }

                        return `${label}: ${value}`;
                    },
                    afterBody: function (context) {
                        if (context.length >= 2 && context[0].datasetIndex !== 2) {
                            const forecast = context[0].parsed.x;
                            const actual = context[1].parsed.x;
                            const difference = actual - forecast;
                            const percentage = forecast > 0 ? ((difference / forecast) * 100).toFixed(1) : 0;

                            return [`Variance: ${difference >= 0 ? '+' : ''}${difference}`, `Percentage: ${difference >= 0 ? '+' : ''}${percentage}%`];
                        }
                        return [];
                    },
                    labelColor: function (context) {
                        // Don't show color box for target sales line
                        if (context.datasetIndex === 2) {
                            return {
                                borderColor: 'transparent',
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                borderRadius: 0
                            };
                        }
                        return {
                            borderColor: context.dataset.borderColor,
                            backgroundColor: context.dataset.backgroundColor,
                            borderWidth: 2,
                            borderRadius: 2
                        };
                    }
                }
            },
            annotation: {
                annotations: {
                    targetLine: {
                        type: 'line',
                        yMin: 0,
                        yMax: 1,
                        xMin: form.value.targetQty ? form.value.targetQty / 3 : 0,
                        xMax: form.value.targetQty ? form.value.targetQty / 3 : 0,
                        borderColor: '#FF6B6B',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        label: {
                            content: `Target: ${form.value.targetQty ? (form.value.targetQty / 3).toFixed(2) : '0'}`,
                            enabled: true,
                            position: 'top',
                            backgroundColor: 'rgba(255, 107, 107, 0.8)',
                            color: '#fff',
                            font: {
                                size: 11,
                                weight: 'bold'
                            }
                        }
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
        interaction: {
            mode: 'nearest',
            intersect: true
        },
        elements: {
            bar: {
                borderRadius: 16,
                borderSkipped: false,
                hoverBackgroundColor: function (context) {
                    if (context.datasetIndex === 0) {
                        return '#004a80';
                    } else if (context.datasetIndex === 1) {
                        return '#8ecaff';
                    }
                    return null;
                }
            },
            line: {
                tension: 0,
                fill: false
            }
        },
        barPercentage: 0.7,
        categoryPercentage: 0.8
    };
};

// Suspend account function
const confirmSuspend = () => {
    isSuspended.value = !isSuspended.value;
    // You can add API call here to update account status
};

// Lifecycle
onMounted(() => {
    fetchDealerProfile();
});

// Watch for route changes
watch(
    () => route.params.custAccNo,
    () => {
        fetchDealerProfile();
    }
);
</script>
<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>
