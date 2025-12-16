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
                    <div class="font-bold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800">📦 <span>Order Items</span></div>
                    <DataTable :value="orderItems" dataKey="materialid" class="rounded-table mt-4">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">{{ formatItemNo(data.itemno) }}</template>
                        </Column>
                        <Column header="Material">
                            <template #body="{ data }">
                                {{ data.materialid }}<br />
                                {{ data.materialdescription }}
                                <span class="block text-xs text-gray-500">SP: {{ data.salesprogramid || '-' }} </span>
                            </template>
                        </Column>
                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">{{ data.itemcategory }}</template>
                        </Column>
                        <Column field="qty" header="Quantity">
                            <template #body="{ data }">{{ parseInt(data.qty) }}</template>
                        </Column>
                        <Column field="unitprice" header="Unit Price" class="text-right">
                            <template #body="{ data }">RM {{ parseFloat(data.unitprice || 0).toFixed(2) }}</template>
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Grand Total</div>
                            </template>
                        </Column>
                        <Column field="totalamt" header="Total Amount" class="text-right">
                            <template #body="{ data }">RM {{ parseFloat(data.totalamt || 0).toFixed(2) }}</template>
                            <template #footer>
                                <div class="flex justify-start pr-3 font-semibold text-blue-600">RM {{ totalAmount.toFixed(2) }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- SAP Error Response Card (only for FAILED status with sapErrorResponse) -->
                <div v-if="orderStatusText === 'FAILED' && orderData.sapErrorResponse" class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-red-800">SAP Error Details</div>
                        <!-- <Tag value="ERROR" severity="danger" /> -->
                    </div>
                    <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <span class="text-sm font-semibold text-gray-700">Error Code</span>
                                <p class="text-lg font-medium text-red-600">{{ orderData.sapErrorResponse?.errorcode || '-' }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-semibold text-gray-700">Error Number</span>
                                <p class="text-lg font-medium text-red-600">{{ orderData.sapErrorResponse?.errornumber || '-' }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <span class="text-sm font-semibold text-gray-700">Error Message</span>
                                <p class="text-lg font-medium text-red-600">{{ orderData.sapErrorResponse?.message || '-' }}</p>
                            </div>
                        </div>
                        
                        <!-- Unfulfilled Items -->
                        <div v-if="orderData.sapErrorResponse?.data?.unfulfilled_items" class="mb-4">
                            <h4 class="font-semibold text-gray-700 mb-2">Unfulfilled Items:</h4>
                            <div class="bg-white p-3 rounded border">
                                <p class="text-red-600">
                                    Material: {{ orderData.sapErrorResponse.data.unfulfilled_items.materialid }} - 
                                    Qty: {{ orderData.sapErrorResponse.data.unfulfilled_items.qty }}
                                </p>
                            </div>
                        </div>
                        
                        <!-- Error Result Set -->
                        <div v-if="orderData.sapErrorResponse?.resultset && orderData.sapErrorResponse.resultset.length > 0">
                            <h4 class="font-semibold text-gray-700 mb-2">Detailed Errors:</h4>
                            <div class="space-y-2">
                                <div v-for="(error, index) in orderData.sapErrorResponse.resultset" :key="index" 
                                     class="bg-white p-3 rounded border border-red-200">
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
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Description</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.orderDesc || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No.</td>
                                    <td class="px-4 py-2 text-right font-medium">
                                        <div class="flex items-center justify-end gap-2">
                                            <span>{{ orderData.so_no || '-' }}</span>
                                            <Button v-if="!orderData.so_no && orderStatusText === 'TIMEOUT'" 
                                                    icon="pi pi-pencil"
                                                    class="p-button-text p-button-info p-button-secondary text-sm" 
                                                    size="small" 
                                                    @click="openUpdateSODialog"
                                                    v-tooltip="'Update SO Number'" />
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
                                    <td class="px-4 py-2 font-medium">Price Group</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.pricegroup || '-' }}</td>
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
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDateTime(orderData.created) || '-' }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="px-2 py-2 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button label="Void" 
                                                    class="p-button-danger text-sm !w-fit" 
                                                    @click="voidOrder" 
                                                    :loading="loadingAction" />
                                            <Button label="Process" 
                                                    class="p-button-success text-sm !w-fit" 
                                                    @click="processOrder" 
                                                    :loading="loadingAction"
                                                    :disabled="orderStatusText === 'FAILED' && !canProcessFailedOrder" />
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
                    <Button label="Cancel" class="p-button-secondary" @click="cancelUpdateSO" :disabled="loadingAction" />
                    <Button label="Update & Continue" class="p-button-primary" @click="updateSONumber" :loading="loadingAction" />
                </div>
            </div>
        </Dialog>

        <!-- Confirm Void Dialog -->
        <Dialog v-model:visible="showVoidConfirmDialog" header="Void Order" modal :style="{ width: '30rem' }" :closable="false">
            <div class="flex flex-col gap-4">
                <div class="p-fluid">
                    <label for="voidReason" class="font-semibold">Void Reason <span class="text-red-500">*</span></label>
                    <Dropdown id="voidReason" v-model="voidReason" :options="voidReasons" optionLabel="name" optionValue="code" placeholder="Select void reason" class="w-full" :class="{ 'p-invalid': voidReasonSubmitted && !voidReason }" />
                    <small v-if="voidReasonSubmitted && !voidReason" class="p-error">Void reason is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="voidRemarks" class="font-semibold">Remarks</label>
                    <Textarea id="voidRemarks" v-model="voidRemarks" rows="3" placeholder="Enter any additional remarks" class="w-full" />
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" class="p-button-secondary" @click="showVoidConfirmDialog = false" :disabled="loadingAction" />
                    <Button label="Confirm Void" class="p-button-danger" @click="confirmVoidOrder" :loading="loadingAction" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const toast = useToast();
const route = useRoute();
const router = useRouter();

// Reactive data
const orderData = ref({});
const customerInfo = ref({});
const shippingDetail = ref({});
const deliveryInfo = ref({});
const orderItems = ref([]);
const loadingAction = ref(false);

// SO Number dialog
const showUpdateSODialog = ref(false);
const soNumber = ref('');
const soNumberSubmitted = ref(false);

// Void dialog
const showVoidConfirmDialog = ref(false);
const voidReason = ref('');
const voidRemarks = ref('');
const voidReasonSubmitted = ref(false);
const voidReasons = ref([
    { code: 'SAP_ORDER_NOT_FOUND', name: 'SAP Order Not Found' },
    { code: 'CANCELLED_BY_CUSTOMER', name: 'Cancelled by Customer' },
    { code: 'OUT_OF_STOCK', name: 'Out of Stock' },
    { code: 'OTHER', name: 'Other' }
]);

// Computed properties
const totalAmount = computed(() => {
    return orderItems.value.reduce((sum, item) => sum + parseFloat(item.totalamt || 0), 0);
});

const orderStatusText = computed(() => {
    if (orderData.value.sapErrorResponse) {
        return 'FAILED';
    } else if (orderData.value.orderstatus === 0 && !orderData.value.so_no) {
        return 'TIMEOUT';
    } else if (orderData.value.orderstatus === 66) {
        return 'COMPLETED';
    } else {
        return 'PENDING';
    }
});

const orderStatusSeverity = computed(() => {
    switch (orderStatusText.value) {
        case 'FAILED': return 'danger';
        case 'TIMEOUT': return 'warning';
        case 'COMPLETED': return 'success';
        default: return 'warn';
    }
});

const canProcessFailedOrder = computed(() => {
    // For failed orders, check if there's an error response
    // and if it's related to insufficient stock or material issues
    if (!orderData.value.sapErrorResponse) return false;
    
    const errorData = orderData.value.sapErrorResponse;
    if (errorData.resultset) {
        // Check if error is about insufficient stock
        const hasStockError = errorData.resultset.some(error => 
            error.message && error.message.includes('Insufficient stock')
        );
        return !hasStockError; // Can process if no stock error
    }
    return false;
});

// Formatting methods
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY');
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-MY');
};

const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(6, '0');
};

// Address methods
const getFullAddress = (data) => {
    if (!data) return '-';
    const addressParts = [data.addressLine1, data.addressLine2, data.addressLine3, data.addressLine4, data.city, data.state, data.postcode].filter((part) => part && part.trim() !== '');
    return addressParts.join('') || '-';
};

const getCompanyName = (data) => {
    if (!data) return '-';
    return [data.companyName1, data.companyName2, data.companyName3, data.companyName4].filter(Boolean).join(', ') || '-';
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
        loadingAction.value = true;
        
        // Update SO number in the order
        const response = await api.postExtra(`order/update-so-number/${orderData.value.order_no}`, {
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
        loadingAction.value = false;
    }
};

const voidOrder = () => {
    showVoidConfirmDialog.value = true;
    voidReason.value = '';
    voidRemarks.value = '';
    voidReasonSubmitted.value = false;
};

const confirmVoidOrder = async () => {
    voidReasonSubmitted.value = true;
    if (!voidReason.value) return;

    try {
        loadingAction.value = true;
        
        const payload = new URLSearchParams();
        payload.append('voidReason', voidReason.value);
        payload.append('remarks', voidRemarks.value);

        const response = await api.postExtra(`order/void-order/${orderData.value.order_no}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order voided successfully',
                life: 3000
            });
            showVoidConfirmDialog.value = false;
            router.push('/om/listFailOrder');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to void order',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error voiding order:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to void order',
            life: 3000
        });
    } finally {
        loadingAction.value = false;
    }
};

const processOrder = async () => {
    try {
        loadingAction.value = true;
        
        // For TIMEOUT status with SO number
        if (orderStatusText.value === 'TIMEOUT') {
            if (!orderData.value.so_no) {
                toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please update SO number before processing',
                    life: 3000
                });
                openUpdateSODialog();
                loadingAction.value = false;
                return;
            }
            
            // Use the SAP update API for timeout orders
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
        }
        // For FAILED status
        else if (orderStatusText.value === 'FAILED') {
            // Use the failed order update API
            const response = await api.postExtra(`order/failed-order-update-sap/${orderData.value.order_no}`);
            
            if (response.data.status === 1) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Failed order processed successfully',
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
        loadingAction.value = false;
    }
};

// API Calls
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
                addressLine1: etenInfo.addressLine1,
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