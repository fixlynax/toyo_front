<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/om/listReturnOrder">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Customer Name</span>
                            <p class="text-lg font-medium">
                                {{ dealerShop.companyName1 || '-' }} {{ dealerShop.companyName2 || '' }} <br />(<span class="font-semibold text-primarnotdy">{{ dealerShop.custAccountNo || '-' }}</span
                                >)
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Location</span>
                            <p class="text-lg font-medium">
                                {{ formatAddress(dealerShop) }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ orderData.channel || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ orderData.distributionchannel || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm text-gray-700">Sales Org</span>
                            <p class="text-lg font-medium">{{ orderData.salesorg || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm text-gray-700">Price Group</span>
                            <p class="text-lg font-medium">{{ orderData.pricegroup || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Email Address</span>
                            <p class="text-lg font-medium">{{ dealerShop.emailAddress || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Contact Number</span>
                            <p class="text-lg font-medium">{{ dealerShop.phoneNumber || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <!-- Header -->
                    <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800">📦 <span>Return Item</span></div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Order No.</span>
                            <p class="text-lg font-semibold text-primary">{{ order.return_orderNo_ref || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">SAP Return No.</span>
                            <p class="text-lg font-bold">{{ order.sapreturnno || '-' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Code</span>
                            <p class="text-lg font-semibold">{{ order.reason_code || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Return Reason</span>
                            <p class="text-lg font-medium">{{ order.reason_message || '-' }}</p>
                        </div>
                    </div>
                    <!-- Table -->
                    <DataTable :value="returnOrderArray" dataKey="materialid" class="rounded-table mt-6">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">
                                {{ formatItemNo(data.salesdoclineitem || data.itemno) }}
                            </template>
                        </Column>
                        <Column header="Material">
                            <template #body="{ data }">
                                {{ data.materialid }} <br />
                                {{ data.materialdescription }}
                                <span class="block text-xs text-gray-500">SP: {{ data.salesprogramid || '-' }} </span>
                            </template>
                        </Column>

                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory || 'ZR02' }}
                            </template>
                        </Column>

                        <Column field="qty" header="Quantity" class="text-right">
                            <template #body="{ data }">
                                {{ parseInt(data.qty) || 0 }}
                            </template>
                        </Column>

                        <!-- 🟦 Unit Price Column -->
                        <Column field="unitprice" header="Unit Price (RM)" class="text-right">
                            <template #body="{ data }">
                                {{ getItemPrice(data).toFixed(2) }}
                            </template>

                            <!-- ✅ Footer for label -->
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Subtotal</div>
                            </template>
                        </Column>

                        <!-- 🟦 Total Amount Column -->
                        <Column field="totalamt" header="Total Amount (RM)" class="text-right">
                            <template #body="{ data }">
                                {{ calculateItemTotal(data).toFixed(2) }}
                            </template>

                            <!-- ✅ Footer for total value -->
                            <template #footer>
                                <div class="flex justify-start pr-3 font-semibold text-blue-600">{{ subtotal.toFixed(2) }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="getOrderStatusText(order.orderstatus)" :severity="getOrderStatusSeverity(order.orderstatus)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right font-semibold text-primary">{{ orderData.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.sapordertype || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.division || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Storage Location</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.storagelocation || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Status</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ getDeliveryStatusText(order.delivery_status) }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDate(order.created) || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-4 gap-2" v-if="order.orderstatus === 0">
                        <Button label="Reject" severity="danger" size="small" @click="onRejectReturnOrder" :loading="loadingAction === 'reject'" />
                        <Button label="Approve" severity="success" size="small" @click="onApproveReturnOrder" :loading="loadingAction === 'approve'" />
                    </div>

                    <!-- Status Labels after action -->
                    <!-- <div class="flex justify-end mt-4" v-else>
                        <Tag :value="getActionStatusLabel(order.orderstatus)" :severity="getActionStatusSeverity(order.orderstatus)" />
                    </div> -->
                </div>
            </div>
        </div>

        <Toast />
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const toast = useToast();
const returnOrderNo = route.params.retOrdNo;

const order = ref({});
const dealerShop = ref({});
const orderData = ref({});
const orderDelivery = ref({});
const returnOrderArray = ref([]);
const loading = ref(true);
const loadingAction = ref(null);
const error = ref(null);

// ✅ Enhanced price mapping functions
const getItemPrice = (item) => {
    const materialId = item.materialid;
    const itemNo = item.salesdoclineitem || item.itemno;

    // Format item number for comparison (pad with zeros to 6 digits)
    const formattedItemNo = itemNo.toString().padStart(6, '0');

    // First, try to find the item in fullfill_order_array with exact match
    if (orderData.value.fullfill_order_array && Array.isArray(orderData.value.fullfill_order_array)) {
        const originalItem = orderData.value.fullfill_order_array.find((orderItem) => orderItem.materialid === materialId && orderItem.itemno === formattedItemNo);

        if (originalItem && originalItem.unitprice !== undefined && originalItem.unitprice !== null) {
            return Number(originalItem.unitprice) || 0;
        }
    }

    // If not found, check if there's a unitprice already in the return item (from API)
    if (item.unitprice !== undefined && item.unitprice !== null) {
        return Number(item.unitprice) || 0;
    }

    // Last resort: try to find by material ID only (fallback)
    if (orderData.value.fullfill_order_array && Array.isArray(orderData.value.fullfill_order_array)) {
        const fallbackItem = orderData.value.fullfill_order_array.find((orderItem) => orderItem.materialid === materialId);

        if (fallbackItem && fallbackItem.unitprice !== undefined && fallbackItem.unitprice !== null) {
            return Number(fallbackItem.unitprice) || 0;
        }
    }

    return 0;
};

// Helper to format item number for comparison (remove leading zeros)
const formatItemNoForComparison = (itemNo) => {
    if (!itemNo) return '';
    return itemNo.toString().replace(/^0+/, '');
};

// Method to calculate item total
const calculateItemTotal = (item) => {
    const qty = parseInt(item.qty) || 0;
    const price = getItemPrice(item);
    return qty * price;
};

// Computed property for subtotal
const subtotal = computed(() => {
    return returnOrderArray.value.reduce((sum, item) => {
        return sum + calculateItemTotal(item);
    }, 0);
});

// ✅ Status mapping functions
const getDeliveryStatusText = (status) => {
    const statusMap = {
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        PENDING_COLLECTION: 'Pending Collection',
        COMPLETED: 'Completed',
        NEW: 'New'
    };
    return statusMap[status?.toUpperCase()] || status || '-';
};

const getOrderStatusText = (status) => {
    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        77: 'Pending Collection',
        9: 'Completed'
    };
    return statusMap[status] || `Status: ${status}`;
};

const getOrderStatusSeverity = (status) => {
    const severityMap = {
        0: 'warn',
        1: 'success',
        2: 'danger',
        77: 'warn',
        9: 'success'
    };
    return severityMap[status] || 'secondary';
};

const getActionStatusLabel = (status) => {
    const actionMap = {
        1: 'Approved',
        2: 'Rejected',
        9: 'Completed'
    };
    return actionMap[status] || '';
};

const getActionStatusSeverity = (status) => {
    const severityMap = {
        1: 'success',
        2: 'danger',
        9: 'success'
    };
    return severityMap[status] || 'secondary';
};

// Helper methods
const formatAddress = (dealerShop) => {
    if (!dealerShop) return '-';
    const addressParts = [dealerShop.addressLine1, dealerShop.addressLine2, dealerShop.addressLine3, dealerShop.addressLine4, dealerShop.city, dealerShop.state, dealerShop.postcode].filter((part) => part && part.trim() !== '');
    return addressParts.join(' ') || '-';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Method to format item number for display
const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(6, '0');
};

// Toast helper
const showToast = (severity, summary, detail) => {
    toast.add({
        severity,
        summary,
        detail,
        life: 5000
    });
};

// Fetch order details
const fetchReturnOrderDetail = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await api.get(`order/detail-return-order/${returnOrderNo}`);

        if (response.data.status === 1 && response.data.admin_data && response.data.admin_data.length > 0) {
            const orderDataResponse = response.data.admin_data[0];
            order.value = orderDataResponse;
            dealerShop.value = orderDataResponse.dealer?.dealer_shop || {};
            orderData.value = orderDataResponse.order_data || {};
            orderDelivery.value = orderDataResponse.delivery_information || {};
            returnOrderArray.value = orderDataResponse.return_order_array || [];

            console.log('Order Data:', orderData.value);
            console.log('Return Items:', returnOrderArray.value);
            console.log('Fullfill Order Array:', orderData.value.fullfill_order_array);

            // Log price mapping for debugging
            returnOrderArray.value.forEach((item) => {
                const price = getItemPrice(item);
                const total = calculateItemTotal(item);
                console.log(`Item ${item.materialid}: Qty=${item.qty}, Price=${price}, Total=${total}`);
            });
            console.log('Subtotal:', subtotal.value);
        } else {
            error.value = 'No data found for this return order';
            showToast('error', 'Error', error.value);
        }
    } catch (err) {
        console.error('Error fetching return order details:', err);
        showToast('error', 'Error', 'Failed to load return order details');
    } finally {
        loading.value = false;
    }
};

// ✅ Fixed Approve return order
const onApproveReturnOrder = async () => {
    try {
        loadingAction.value = 'approve';

        // Use URLSearchParams instead of FormData for application/x-www-form-urlencoded
        const payload = new URLSearchParams();
        payload.append('status', '1'); // 1 = Approved

        console.log('Approving return order:', returnOrderNo);
        console.log('Payload:', { status: '1' });

        const response = await api.postExtra(`order/update-return-order/${returnOrderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Approve response:', response.data);

        if (response.data.status === 1) {
            showToast('success', 'Success', 'Return order approved successfully!');
            // ✅ Instantly update local status (no need to refetch)
            order.value.orderstatus = 1;
            // Also update the order object with response data if available
            if (response.data.admin_data) {
                Object.assign(order.value, response.data.admin_data);
            }
        } else {
            const errorData = response.data.error;
            let errorMessage = 'Failed to approve return order';

            if (errorData) {
                errorMessage = errorData.message || errorData.code || errorMessage;
            } else if (response.data.message) {
                errorMessage = response.data.message;
            }

            showToast('error', 'Error', errorMessage);
        }
    } catch (err) {
        console.error('Approve error:', err);
        let errorMessage = 'Failed to approve return order';

        if (err.response?.data?.error?.message) {
            errorMessage = err.response.data.error.message;
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }

        showToast('error', 'Error', errorMessage);
    } finally {
        loadingAction.value = null;
    }
};

// ✅ Fixed Reject return order
const onRejectReturnOrder = async () => {
    try {
        loadingAction.value = 'reject';

        // Use URLSearchParams instead of FormData for application/x-www-form-urlencoded
        const payload = new URLSearchParams();
        payload.append('status', '2'); // 2 = Rejected

        console.log('Rejecting return order:', returnOrderNo);
        console.log('Payload:', { status: '2' });

        const response = await api.postExtra(`order/update-return-order/${returnOrderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Reject response:', response.data);

        if (response.data.status === 1) {
            showToast('success', 'Success', 'Return order rejected successfully!');
            // ✅ Instantly update local status
            order.value.orderstatus = 2;
            // Also update the order object with response data if available
            if (response.data.admin_data) {
                Object.assign(order.value, response.data.admin_data);
            }
        } else {
            const errorData = response.data.error;
            let errorMessage = 'Failed to reject return order';

            if (errorData) {
                errorMessage = errorData.message || errorData.code || errorMessage;
            } else if (response.data.message) {
                errorMessage = response.data.message;
            }

            showToast('error', 'Error', errorMessage);
        }
    } catch (err) {
        console.error('Reject error:', err);
        let errorMessage = 'Failed to reject return order';

        if (err.response?.data?.error?.message) {
            errorMessage = err.response.data.error.message;
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }

        showToast('error', 'Error', errorMessage);
    } finally {
        loadingAction.value = null;
    }
};

// Fetch initial data
onMounted(() => fetchReturnOrderDetail());
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
