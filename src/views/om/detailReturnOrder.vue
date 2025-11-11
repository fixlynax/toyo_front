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
                            <span class="text-sm text-gray-500">Dealer Name</span>
                            <p class="text-lg font-medium">{{ dealerShop.companyName1 || '-' }} {{ dealerShop.companyName2 }}</p>
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
                            <p class="text-lg font-medium">{{ dealerShop.city || '-' }} {{ dealerShop.state }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Return Code</span>
                            <p class="text-lg font-semibold">{{ order.reason_code || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Return Reason</span>
                            <p class="text-lg font-medium">{{ order.reason_message || '-' }}</p>
                        </div>

                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ order.channel || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🚚 Shipping Information</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-bold text-gray-700">Ship To</span>
                            <p class="text-lg font-medium">
                                {{ order.deliveryType === 'DELIVER' ? dealerShop.companyName1 : 'Customer Self Pickup' }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Description</span>
                            <p class="text-lg font-medium">{{ order.orderDesc || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Shipping Cond</span>
                            <p class="text-lg font-medium">{{ order.shippingcond || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery Type</span>
                            <p class="text-lg font-medium">{{ order.deliveryType || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery ETA</span>
                            <p class="text-lg font-medium">{{ order.deliveryDate || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery Status</span>
                            <p class="text-lg font-medium">
                                <Tag :value="getOrderStatusText(order.orderstatus)" :severity="getOrderStatusSeverity(order.orderstatus)" />
                            </p>
                            <p class="text-xs text-gray-500 mt-1">Last updated: {{ order.created || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="font-semibold text-xl border-b pb-2 mt-2">📦 Return Materials</div>
                    <DataTable :value="returnOrderArray" class="text-sm" stripedRows>
                        <Column field="salesdoclineitem" header="Line Item No." style="min-width: 6rem">
                            <template #body="{ data, index }">
                                <span class="text-lg">{{ index + 1 }}</span>
                            </template>
                        </Column>
                        <Column field="materialid" header="Material ID" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.materialid || '-' }}</span>
                            </template>
                        </Column>
                        <Column field="itemcategory" header="Item Category" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.itemcategory || '-' }}</span>
                            </template>
                        </Column>
                        <Column field="qty" header="Qty" style="min-width: 4rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.qty || '-' }}</span>
                            </template>
                        </Column>
                        <Column field="total" header="Total" style="min-width: 6rem">
                            <template #body>
                                <span class="text-lg">RM {{ order.price || '-' }}</span>
                            </template>
                        </Column>
                        <Column field="tax" header="Tax" style="min-width: 6rem">
                            <template #body>
                                <span class="text-lg text-red-600">RM {{ order.tax || '-' }}</span>
                            </template>
                        </Column>
                    </DataTable>
                    <div class="mt-2 flex justify-end text-lg font-semibold">Subtotal: RM {{ order.subtotal || '-' }}</div>
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
                                    <td class="px-4 py-2 font-medium">Order Ref</td>
                                    <td class="px-4 py-2 text-right">{{ order.return_orderNo_ref || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right">{{ order.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right">{{ order.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right">{{ order.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right">{{ order.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ order.sapordertype || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ order.division || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Date</td>
                                    <td class="px-4 py-2 text-right">{{ order.deliveryDate || '-' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ order.created || '-' }}</td>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const toast = useToast();
const returnOrderNo = route.params.retOrdNo;

const order = ref({});
const dealerShop = ref({});
const returnOrderArray = ref([]);
const loading = ref(true);
const loadingAction = ref(null);
const error = ref(null);

// ✅ Status mapping functions
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
            returnOrderArray.value = order.value.return_order_array || [];
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
        formData.append('status', '2'); // ✅ 2 = Rejected (previously used 9 incorrectly)

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
