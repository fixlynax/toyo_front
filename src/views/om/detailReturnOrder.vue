<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/om/listReturnOrder">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Return Order Detail</div>
                    </div>

                    <div class="font-semibold text-xl border-b pb-2 mt-2">🏬 Customer Details</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Customer Name</span>
                            <p class="text-lg font-medium">{{ dealerShop.companyName1 || '-' }} {{ dealerShop.companyName2 }} {{ dealerShop.companyName3 }} {{ dealerShop.companyName4 }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Account Number</span>
                            <p class="text-lg font-medium">{{ dealerShop.custAccountNo || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Member Code</span>
                            <p class="text-lg font-medium">{{ dealerShop.memberCode || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Location</span>
                            <p class="text-lg font-medium">
                                {{ dealerShop.addressLine1 }} {{ dealerShop.addressLine2 }} {{ dealerShop.addressLine3 }} {{ dealerShop.addressLine4 }}{{ dealerShop.city }}, {{ dealerShop.state }} , {{ dealerShop.postcode }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Contact Person</span>
                            <p class="text-lg font-medium">{{ dealerShop.phoneNumber || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ orderData.channel || '-' }}</p>
                        </div>
                         <div>
                            <span class="text-sm text-gray-500">SAP Return No.</span>
                            <p class="text-lg font-bold">{{ order.sapreturnno || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <!-- Header -->
                    <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800">📦 <span>Return Item</span></div>
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Order No</span>
                            <p class="text-lg font-semibold">{{ order.return_orderNo_ref || '-' }}</p>
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

                        <Column field="materialid" header="Material ID"></Column>

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
                                    <td class="px-4 py-2 text-right">{{ orderData.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right">{{ orderData.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right">{{ orderData.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right">{{ orderData.inv_no || '-' }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Return No</td>
                                    <td class="px-4 py-2 text-right">{{ order.sapreturnno || '-' }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ orderData.sapordertype || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ orderData.division || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Pickup</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelivery.pickup_datetime || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Receive</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelivery.receive_datetime || '-' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ orderData.created || '-' }}</td>
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
                    <div class="flex justify-end mt-4" v-else>
                        <Tag :value="getActionStatusLabel(order.orderstatus)" :severity="getActionStatusSeverity(order.orderstatus)" />
                    </div>
                </div>
            </div>
        </div>

        <Toast />
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
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
const subtotal = ref(0);

// ✅ Status mapping functions
const getdeliveryOrderStatusText = (status) => {
    const statusMap = {
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        PENDING_COLLECTION: 'Pending Collection',
        COMPLETED: 'Completed',
        NEW: 'New'
    };
    return statusMap[status?.toUpperCase()] || ` ${status || '-'}`;
};

const getOrderStatusText = (status) => {
    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        66: 'Processing',
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
        66: 'info',
        77: 'warn',
        9: 'success'
    };
    return severityMap[status] || 'secondary';
};

const getActionStatusLabel = (status) => {
    const actionMap = {
        1: 'Approved',
        2: 'Rejected'
    };
    return actionMap[status] || '';
};

const getActionStatusSeverity = (status) => {
    const severityMap = {
        1: 'success',
        2: 'danger'
    };
    return severityMap[status] || 'secondary';
};

// Method to get item price - handle null prices by looking up from original order
const getItemPrice = (item) => {
    // If unitprice is provided in return item, use it
    if (item.unitprice !== null && item.unitprice !== undefined) {
        return Number(item.unitprice) || 0;
    }

    // Otherwise, try to find price from original order data
    if (orderData.value.order_array) {
        try {
            const orderItems = typeof orderData.value.order_array === 'string' ? JSON.parse(orderData.value.order_array) : orderData.value.order_array;

            const originalItem = orderItems.find((orderItem) => orderItem.materialid === item.materialid && orderItem.itemno === (item.salesdoclineitem || item.itemno));

            if (originalItem && originalItem.price) {
                return Number(originalItem.price) || 0;
            }
        } catch (error) {
            console.error('Error parsing order array:', error);
        }
    }

    return 0;
};

// Method to calculate item total
const calculateItemTotal = (item) => {
    const qty = parseInt(item.qty) || 0;
    const price = getItemPrice(item);
    return qty * price;
};

// Method to format item number
const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(2, '0');
};

// Update subtotal when returnOrderArray changes
const updateSubtotal = () => {
    subtotal.value = returnOrderArray.value.reduce((sum, item) => {
        return sum + calculateItemTotal(item);
    }, 0);
};

// Watch for changes in returnOrderArray and update subtotal
watch(
    returnOrderArray,
    () => {
        updateSubtotal();
    },
    { deep: true }
);

// Also update when order data is loaded
watch(orderData, () => {
    if (returnOrderArray.value.length > 0) {
        updateSubtotal();
    }
});

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
        if (response.data.status === 0 && response.data.admin_data && response.data.admin_data.length > 0) {
            order.value = response.data.admin_data[0];
            dealerShop.value = order.value.dealer?.dealer_shop || {};
            orderData.value = order.value.order_data || {};
            orderDelivery.value = order.value.delivery_information || {};
            returnOrderArray.value = order.value.return_order_array || [];

            // Initialize subtotal
            updateSubtotal();
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

// ✅ Approve return order
const onApproveReturnOrder = async () => {
    try {
        loadingAction.value = 'approve';
        const formData = new FormData();
        formData.append('status', '1'); // 1 = Approved

        const response = await api.post(`order/update-return-order/${returnOrderNo}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            showToast('success', 'Success', 'Return order approved successfully!');
            // ✅ Instantly update local status (no need to refetch)
            order.value.orderstatus = 1;
        } else {
            const msg = response.data.error?.message || 'Failed to approve return order';
            showToast('error', 'Error', msg);
        }
    } catch (err) {
        console.error(err);
        showToast('error', 'Error', 'Failed to approve return order');
    } finally {
        loadingAction.value = null;
    }
};

// ✅ Reject return order
const onRejectReturnOrder = async () => {
    try {
        loadingAction.value = 'reject';
        const formData = new FormData();
        formData.append('status', '2'); // ✅ 2 = Rejected

        const response = await api.post(`order/update-return-order/${returnOrderNo}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            showToast('success', 'Success', 'Return order rejected successfully!');
            // ✅ Instantly update local status
            order.value.orderstatus = 2;
        } else {
            const msg = response.data.error?.message || 'Failed to reject return order';
            showToast('error', 'Error', msg);
        }
    } catch (err) {
        console.error(err);
        showToast('error', 'Error', 'Failed to reject return order');
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
