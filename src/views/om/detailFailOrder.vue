<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Column - Customer Info & Order Items -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Customer Information Card -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b pb-3">
                        <RouterLink to="/om/listFailOrder">
                            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-bold text-gray-700">Customer Name</span>
                            <p class="text-lg font-medium">
                                {{ customerInfo.dealerName || '-' }}<br />
                                (<span class="text-primary font-semibold">{{ orderData.custaccountno || '-' }}</span
                                >)
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Location</span>
                            <p class="text-lg font-medium">{{ getFullAddress(customerInfo) || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Signboard</span>
                            <p class="text-lg font-medium">{{ customerInfo.signboard || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ orderData.distributionchannel || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Sales Org</span>
                            <p class="text-lg font-medium">{{ orderData.salesorg || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Price Group</span>
                            <p class="text-lg font-medium">{{ orderData.pricegroup || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Email Address</span>
                            <p class="text-lg font-medium">{{ customerInfo.email || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Contact Number</span>
                            <p class="text-lg font-medium">{{ customerInfo.phoneNumber || customerInfo.mobileNumber || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Order Items Card -->
                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <div class="font-bold text-2xl border-b pb-3 px-4 flex items-center text-gray-800"><span>Order Items</span></div>
                    <DataTable :value="orderItems" dataKey="materialid" class="rounded-table mt-4">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">{{ formatItemNo(data.itemno) }}</template>
                        </Column>
                        <Column header="Material">
                            <template #body="{ data }">
                                {{ data.materialid }}<br />
                                {{ data.materialdescription }}
                                <span v-if="data.salesprogramid" class="block text-xs text-gray-500">SP: {{ data.salesprogramid || '-' }} </span>
                            </template>
                        </Column>
                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">{{ data.itemcategory }}</template>
                        </Column>
                        <Column field="qty" header="Quantity">
                            <template #body="{ data }">{{ parseInt(data.qty) }}</template>
                        </Column>
                    </DataTable>
                </div>

                <!-- SAP Error Response Card (only for FAILED status with sapErrorResponse) -->
                <div v-if="orderStatusText === 'FAILED' && orderData.sapErrorResponse" class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-black">SAP Error Details</div>
                    </div>
                    <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <span class="text-sm font-semibold text-black">Error Code</span>
                                <p class="text-lg font-medium text-red-600">{{ orderData.sapErrorResponse?.errorcode || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-semibold text-black">Error Number</span>
                                <p class="text-lg font-medium text-red-600">{{ orderData.sapErrorResponse?.errornumber || '-' }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <span class="text-sm font-semibold text-black">Error Message</span>
                                <p class="text-lg font-medium text-red-600">{{ orderData.sapErrorResponse?.message || '-' }}</p>
                            </div>
                        </div>

                        <!-- Unfulfilled Items -->
                        <div v-if="orderData.sapErrorResponse?.data?.unfulfilled_items" class="mb-4">
                            <h4 class="font-semibold text-gray-700 mb-2">Unfulfilled Items:</h4>
                            <div class="bg-white p-3 rounded border">
                                <p class="text-red-600">Material: {{ orderData.sapErrorResponse.data.unfulfilled_items.materialid }} - Qty: {{ orderData.sapErrorResponse.data.unfulfilled_items.qty }}</p>
                            </div>
                        </div>

                        <!-- Error Result Set -->
                        <div v-if="orderData.sapErrorResponse?.resultset && orderData.sapErrorResponse.resultset.length > 0">
                            <h4 class="font-semibold text-gray-700 mb-2">Detailed Errors:</h4>
                            <div class="space-y-2">
                                <div v-for="(error, index) in orderData.sapErrorResponse.resultset" :key="index" class="bg-white p-3 rounded border border-red-200">
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                                            {{ error.type }}
                                        </span>
                                        <span class="text-sm font-medium">{{ error.id }} ({{ error.number }})</span>
                                    </div>
                                    <p class="mt-1 text-red-700">{{ error.message }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column - Advance Info & Shipping/Pickup Info -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info Card -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Order Info</div>
                        <Tag :value="orderStatusText" :severity="orderStatusSeverity" />
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No.</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderData.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Remark</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderData.order_remarks || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Channel</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ orderData.channel || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right font-medium">
                                        <span v-if="orderData.orderDesc === 'NORMAL'">NORMAL</span>
                                        <span v-else-if="orderData.orderDesc === 'DIRECTSHIP'">DS</span>
                                        <span v-else-if="orderData.orderDesc === 'OWN'">OWN USE</span>
                                        <span v-else-if="orderData.orderDesc === 'Warranty'">WARRANTY</span>
                                        <span v-else-if="orderData.orderDesc === 'Back Order'">NORMAL</span>
                                        <span v-else>
                                            {{ orderData.orderDesc || orderData.orderDesc || '-' }}
                                        </span>
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order SAP Type</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.sapordertype || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No.</td>
                                    <td class="px-4 py-2 text-right font-medium">
                                        <div class="flex items-center justify-end gap-2">
                                            <span>{{ orderData.so_no || '-' }}</span>
                                            <Button
                                                v-if="!orderData.so_no || orderStatusText === 'TIMEOUT' && canUpdate"
                                                icon="pi pi-pencil"
                                                class="p-button-text p-button-info p-button-secondary text-sm"
                                                size="small"
                                                @click="openUpdateSODialog"
                                                v-tooltip="'Update SO Number'"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No.</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Group</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.customerCondGrp || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Type</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Storage Location</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ deliveryInfo.storageLocation || customerInfo.storageLocation || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">ETA Date</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDateTime(orderData.deliveryDate) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Planned Date</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDateTime(deliveryInfo.scheduled_delivery_time) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivered Date</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDateTime(deliveryInfo.delivered_datetime) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created On</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDateTime(orderData.created) || '-' }}</td>
                                </tr>
                                <!-- Only show buttons for TIMEOUT status -->
                                <tr v-if="orderStatusText === 'TIMEOUT'">
                                    <td colspan="2" class="px-2 py-2 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button v-if="canUpdate" label="Void" class="p-button-danger text-sm !w-fit" @click="showVoidToast" :disabled="loadingProcess" />
                                            <Button v-if="canUpdate" label="Process" class="p-button-success text-sm !w-fit" @click="processOrder" :loading="loadingProcess" />
                                        </div>
                                    </td>
                                </tr>
                                <!-- Show status message for other statuses -->
                                <tr v-else>
                                    <td colspan="2" class="px-2 py-2 text-right">
                                        <div class="text-sm text-gray-800 font-bold italic mt-2">
                                            {{ getStatusMessage() }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Shipping Info Card (for DELIVER type) -->
                <div v-if="orderData.deliveryType === 'DELIVER'" class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Shipping Info</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Name</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ getCompanyName(shippingDetail) || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Account No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail?.custAccountNo || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Address</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ getFullAddress(shippingDetail) || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Phone No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail.phoneNumber || shippingDetail.mobileNumber || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Email</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail.emailAddress || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update SO Number Dialog -->
        <Dialog v-model:visible="showUpdateSODialog" header="Update SO Number" modal :style="{ width: '30rem' }" :closable="false">
            <div class="flex flex-col gap-4">
                <div class="p-fluid">
                    <label for="soNumber" class="font-semibold">SO Number <span class="text-red-500">*</span></label>
                    <InputText id="soNumber" v-model="soNumber" placeholder="Enter SO Number" class="w-full" :class="{ 'p-invalid': soNumberSubmitted && !soNumber }" />
                    <small v-if="soNumberSubmitted && !soNumber" class="p-error">SO Number is required.</small>
                    <small class="text-gray-500">Check with SAP if a successful order exists with the same order number.</small>
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" class="p-button-secondary" @click="cancelUpdateSO" :disabled="loadingUpdate" />
                    <Button label="Update & Continue" class="p-button-primary" @click="updateSONumber" :loading="loadingUpdate" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';
import api from '@/service/api';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Fail Order'));

// Reactive data
const orderData = ref({});
const customerInfo = ref({});
const shippingDetail = ref({});
const deliveryInfo = ref({});
const orderItems = ref([]);
const loadingProcess = ref(false);
const loadingUpdate = ref(false);

// SO Number dialog
const showUpdateSODialog = ref(false);
const soNumber = ref('');
const soNumberSubmitted = ref(false);

// Computed properties
const totalAmount = computed(() => {
    return orderItems.value.reduce((sum, item) => sum + parseFloat(item.totalamt || 0), 0);
});

const orderStatusText = computed(() => {
    if (orderData.value.sapErrorResponse) {
        return 'FAILED';
    } else if (orderData.value.orderstatus === 0 || !orderData.value.so_no) {
        return 'TIMEOUT';
    } else if (orderData.value.orderstatus === 66) {
        return 'PROCESSING';
    } else {
        return 'PENDING';
    }
});

const orderStatusSeverity = computed(() => {
    switch (orderStatusText.value) {
        case 'FAILED':
            return 'danger';
        case 'TIMEOUT':
            return 'warning';
        case 'PROCESSING':
            return 'success';
        default:
            return 'warn';
    }
});

// Formatting methods
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY');
};

const formatDateTime = (dateString) => {
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

const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(6, '0');
};

// Address methods
const getFullAddress = (data) => {
    if (!data) return '-';
    const addressParts = [ data.addressLine2, data.addressLine3, data.addressLine4, data.city, data.postcode, data.state].filter((part) => part && part.trim() !== '');
    return addressParts.join('') || '-';
};

const getCompanyName = (data) => {
    if (!data) return '-';
    return [data.companyName1, data.companyName2, data.companyName3, data.companyName4].filter(Boolean).join(', ') || '-';
};

// Status message helper
const getStatusMessage = () => {
    switch (orderStatusText.value) {
        case 'FAILED':
            return 'This order has failed in SAP. Please check error details above.';
        case 'PROCESSING':
            return 'This order has been processing.';
        case 'PENDING':
            return 'This order is pending processing.';
        default:
            return 'No action required.';
    }
};

// Order processing methods
const openUpdateSODialog = () => {
    showUpdateSODialog.value = true;
    soNumber.value = orderData.value.so_no || '';
    soNumberSubmitted.value = false;
};

const cancelUpdateSO = () => {
    showUpdateSODialog.value = false;
    soNumber.value = '';
    soNumberSubmitted.value = false;
};

const updateSONumber = async () => {
    soNumberSubmitted.value = true;
    if (!soNumber.value) return;

    try {
        loadingUpdate.value = true;

        // Update SO number using the sonoFailedOrder API
        const response = await api.postExtra(`order/failed-order-update-sono/${orderData.value.order_no}`, {
            so_no: soNumber.value
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'SO Number updated successfully',
                life: 3000
            });
            showUpdateSODialog.value = false;
            await fetchOrderDetail();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to update SO number',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating SO number:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update SO number',
            life: 3000
        });
    } finally {
        loadingUpdate.value = false;
    }
};

const showVoidToast = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Void function is not yet implemented',
        life: 3000
    });
};

const processOrder = async () => {
    try {
        loadingProcess.value = true;

        // Only process TIMEOUT orders
        if (orderStatusText.value !== 'TIMEOUT') {
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'This action is only available for TIMEOUT orders',
                life: 3000
            });
            loadingProcess.value = false;
            return;
        }

        if (!orderData.value.so_no) {
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please update SO number before processing',
                life: 3000
            });
            openUpdateSODialog();
            loadingProcess.value = false;
            return;
        }

        // Use the getSAPOrderStatus API for timeout orders
        const response = await api.get(`order/order-update/${orderData.value.order_no}`);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order processed successfully',
                life: 3000
            });
            await fetchOrderDetail();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to process order',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error processing order:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to process order',
            life: 3000
        });
    } finally {
        loadingProcess.value = false;
    }
};

// API Calls - only using 3 specified APIs
const fetchOrderDetail = async () => {
    try {
        const orderNo = route.params.orderNo;
        console.log('Fetching failed order details for:', orderNo);
        const response = await api.postExtra(`order/failed-order-detail/${orderNo}`);
        console.log('Failed order detail response:', response.data);

        if (response.data.status === 1 && response.data.admin_data) {
            const data = response.data.admin_data;
            orderData.value = data;

            // Process order items
            if (Array.isArray(data.order_array)) {
                orderItems.value = data.order_array.map((item) => ({
                    ...item,
                    qty: parseInt(item.qty) || 0,
                    unitprice: parseFloat(item.unitprice) || 0,
                    totalamt: parseFloat(item.totalamt) || 0
                }));
            } else {
                orderItems.value = [];
            }

            // Process customer info
            const etenInfo = data.eten_user || {};
            customerInfo.value = {
                dealerName: etenInfo.companyName1 || '-',
                signboard: etenInfo.signboardBrand || '-',
                storageLocation: etenInfo.storageLocation || '-',
                contactPerson: etenInfo.companyName3 || '-',
                phoneNumber: etenInfo.phoneNumber || '-',
                mobileNumber: etenInfo.mobileNumber || '-',
                email: etenInfo.emailAddress || '-',
                // addressLine1: etenInfo.addressLine1,
                addressLine2: etenInfo.addressLine2,
                addressLine3: etenInfo.addressLine3,
                addressLine4: etenInfo.addressLine4,
                city: etenInfo.city,
                state: etenInfo.state,
                postcode: etenInfo.postcode
            };

            // Process shipping detail
            if (data.shipto_data) {
                shippingDetail.value = data.shipto_data;
            } else {
                shippingDetail.value = {};
            }

            // Decode sapErrorResponse if it exists
            if (data.sapErrorResponse) {
                if (typeof data.sapErrorResponse === 'string') {
                    try {
                        orderData.value.sapErrorResponse = JSON.parse(data.sapErrorResponse);
                    } catch (e) {
                        console.error('Error parsing sapErrorResponse:', e);
                        orderData.value.sapErrorResponse = null;
                    }
                } else {
                    orderData.value.sapErrorResponse = data.sapErrorResponse;
                }
            }
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid or empty order data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch order details', life: 3000 });
    }
};

// Lifecycle
onMounted(() => {
    fetchOrderDetail();
});
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

.card {
    @apply bg-white shadow-sm rounded-2xl border border-gray-100 p-6;
}
</style>
