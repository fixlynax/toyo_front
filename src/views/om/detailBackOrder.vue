<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col gap-2">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b pb-2">
                        <RouterLink to="/om/listBackOrder">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Back Order Detail</div>
                        <div class="flex-grow flex justify-end">
                            <Button label="Export" style="width: fit-content" icon="pi pi-file-export" class="p-button" />
                        </div>
                    </div>

                    <div class="font-semibold text-xl border-b pb-2 mt-2">🏬 Customer Information</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Customer Account No</span>
                            <p class="text-lg font-medium">{{ order.custaccountno }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ order.channel }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ order.distributionchannel }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Division</span>
                            <p class="text-lg font-medium">{{ order.division }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Sales Org</span>
                            <p class="text-lg font-medium">{{ order.salesorg }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Price Group</span>
                            <p class="text-lg font-medium">{{ order.pricegroup }}</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="font-semibold text-xl border-b pb-2 mt-2 mb-4">🚚 Shipping Information</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Ship To</span>
                            <p class="text-lg font-medium">{{ order.shipto }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Shipping Cond</span>
                            <p class="text-lg font-medium">{{ order.shippingcond }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Storage Location</span>
                            <p class="text-lg font-medium">{{ order.storagelocation }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Delivery Type</span>
                            <p class="text-lg font-medium">{{ order.deliveryType }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Delivery Date</span>
                            <p class="text-lg font-medium">{{ formatDate(order.deliveryDate) }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Back Order No</span>
                            <p class="text-lg font-medium">{{ order.bo_orderno }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Expiry</span>
                            <p class="text-lg font-medium">{{ formatDate(order.expiry) }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Fulfillment Status</span>
                            <p class="text-lg font-medium">
                                <span :class="fulfillmentStatus.class" class="font-bold">
                                    {{ fulfillmentStatus.text }}
                                </span>
                            </p>
                            <p class="text-xs text-gray-500 mt-1">Last updated: {{ formatDate(order.modified) }}</p>
                        </div>
                    </div>
                </div>

                <!-- BACK ORDER ITEMS -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between mb-4">
                        <div class="font-semibold text-xl">📦 Back Order Items</div>
                        <div class="flex items-center gap-2">
                            <Tag :value="`${fulfillmentPercentage}% Fulfilled`" :severity="fulfillmentPercentage === 100 ? 'success' : fulfillmentPercentage > 0 ? 'warning' : 'danger'" />
                            <Button v-if="canProcessBackOrder" label="Process Available Stock" icon="pi pi-play" severity="success" size="small" @click="processBackOrder(1)" :loading="processing" class="!w-fit" />
                        </div>
                    </div>

                    <DataTable :value="backOrderItems" dataKey="id" responsiveLayout="scroll" class="text-sm" stripedRows>
                        <Column field="itemno" header="Item No" style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.itemno }}</span>
                            </template>
                        </Column>

                        <Column field="materialid" header="Material ID" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-medium text-lg">{{ data.materialid }}</span>
                            </template>
                        </Column>

                        <Column field="itemcategory" header="Item Category" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.itemcategory }}</span>
                            </template>
                        </Column>

                        <Column field="qty" header="Original Qty" style="text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg font-semibold">{{ formatQuantity(data.qty) }}</span>
                            </template>
                        </Column>

                        <Column field="fulfilledQty" header="Fulfilled Qty" style="text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg" :class="getFulfillmentClass(data)">
                                    {{ formatQuantity(getFulfilledQuantity(data.materialid)) }}
                                </span>
                            </template>
                        </Column>

                        <Column field="remainingQty" header="Remaining Qty" style="text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg font-bold" :class="getRemainingClass(data)">
                                    {{ formatQuantity(getRemainingQuantity(data.materialid)) }}
                                </span>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- FULFILLMENT ORDERS -->
                <div class="card flex flex-col gap-4" v-if="order.list_order && order.list_order.length > 0">
                    <div class="font-semibold text-xl border-b pb-2">🚛 Fulfillment Orders</div>

                    <div v-for="fulfillOrder in order.list_order" :key="fulfillOrder.id" class="border rounded-lg p-4 mb-4 bg-gray-50">
                        <div class="flex justify-between items-center mb-3">
                            <div>
                                <span class="font-bold text-lg text-blue-700">Order: {{ fulfillOrder.order_no }}</span>
                                <Tag :value="getOrderStatusText(fulfillOrder.orderstatus)" :severity="getOrderStatusSeverity(fulfillOrder.orderstatus)" class="ml-2" />
                            </div>
                            <div class="text-sm text-gray-500">Created: {{ formatDate(fulfillOrder.created) }}</div>
                        </div>

                        <DataTable :value="getFulfillmentItems(fulfillOrder)" class="text-sm" stripedRows>
                            <Column field="materialid" header="Material ID" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <span class="font-bold">{{ data.materialid }}</span>
                                </template>
                            </Column>
                            <Column field="qty" header="Qty" style="min-width: 5rem">
                                <template #body="{ data }">
                                    <span>{{ formatQuantity(data.qty) }}</span>
                                </template>
                            </Column>
                            <Column field="unitprice" header="Unit Price (RM)" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="font-semibold text-green-600">{{ data.unitprice }}</span>
                                </template>
                            </Column>
                            <Column field="totalamt" header="Total (RM)" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="font-bold text-green-700">{{ data.totalamt }}</span>
                                </template>
                            </Column>
                            <Column field="itemno" header="Item No" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="text-gray-600">{{ data.itemno }}</span>
                                </template>
                            </Column>
                        </DataTable>

                        <div class="flex justify-between items-center mt-3 pt-3 border-t">
                            <div class="text-sm text-gray-600">Delivery: {{ formatDate(fulfillOrder.deliveryDate) }}</div>
                            <div class="text-lg font-bold text-blue-800">Total: RM {{ fulfillOrder.total }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col gap-2">
                <!-- ADVANCE INFO -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="getBackOrderStatusText(order.orderstatus)" :severity="getBackOrderStatusSeverity(order.orderstatus)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Condition Group</td>
                                    <td class="px-4 py-2 text-right">{{ order.customerCondGrp }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ order.sapordertype }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(order.created) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Modified</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(order.modified) }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Expiry</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(order.expiry) }}</td>
                                </tr>
                                <tr class="border-t">
                                    <td class="px-4 py-2 font-medium">Total Orders</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ order.list_order ? order.list_order.length : 0 }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex justify-end mt-4 gap-2">
                        <Button label="Cancel Back-Order" severity="danger" size="small" class="!w-fit" @click="confirmCancelBackOrder" :disabled="!canCancelBackOrder" :loading="cancelling" />
                        <Button label="Process Back-Order" severity="success" size="small" class="!w-fit" @click="processBackOrder(1)" :disabled="!canProcessBackOrder" :loading="processing" />
                    </div>
                </div>

                <!-- FULFILLMENT SUMMARY -->
                <div class="card flex flex-col w-full" v-if="fulfillmentSummary.length > 0">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">📊 Fulfillment Summary</div>

                    <div v-for="item in fulfillmentSummary" :key="item.materialid" class="mb-3 p-3 border rounded">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-bold text-sm">{{ item.materialid }}</span>
                            <Tag :value="`${item.fulfillmentRate}%`" :severity="item.fulfillmentRate === 100 ? 'success' : item.fulfillmentRate > 0 ? 'warning' : 'danger'" />
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${item.fulfillmentRate}%` }"></div>
                        </div>
                        <div class="flex justify-between text-xs mt-1">
                            <span>Fulfilled: {{ formatQuantity(item.fulfilled) }}/{{ formatQuantity(item.original) }}</span>
                            <span class="font-semibold">Remaining: {{ formatQuantity(item.remaining) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import api from '@/service/api';

const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const order = ref({});
const loading = ref(false);
const processing = ref(false);
const cancelling = ref(false);

// Fetch back order details
const fetchBackOrderDetail = async () => {
    try {
        loading.value = true;
        const boNo = route.params.boNo;
        const response = await api.get(`order/detail-back-order/${boNo}`);

        if (response.data.status === 1 && response.data.admin_data.length > 0) {
            order.value = response.data.admin_data[0];
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Back order not found', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching back order details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch back order details', life: 3000 });
    } finally {
        loading.value = false;
    }
};

// Process back order
const processBackOrder = async (status) => {
    try {
        processing.value = true;
        const boNo = route.params.boNo;
        const response = await api.post(`order/create-backorder/${boNo}`, { status });

        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Back order processed successfully', life: 3000 });
            // Refresh the data
            await fetchBackOrderDetail();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.error?.message || 'Failed to process back order', life: 3000 });
        }
    } catch (error) {
        console.error('Error processing back order:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to process back order', life: 3000 });
    } finally {
        processing.value = false;
    }
};

// Cancel back order
const cancelBackOrder = async () => {
    try {
        cancelling.value = true;
        const boNo = route.params.boNo;
        const response = await api.post(`order/create-backorder/${boNo}`, { status: 9 });

        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Back order cancelled successfully', life: 3000 });
            // Refresh the data
            await fetchBackOrderDetail();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.error?.message || 'Failed to cancel back order', life: 3000 });
        }
    } catch (error) {
        console.error('Error cancelling back order:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel back order', life: 3000 });
    } finally {
        cancelling.value = false;
    }
};

// Confirm cancellation
const confirmCancelBackOrder = () => {
    confirm.require({
        message: 'Are you sure you want to cancel this back order? This action cannot be undone.',
        header: 'Confirm Cancellation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            cancelBackOrder();
        },
        reject: () => {
            // Do nothing
        }
    });
};

// Helper method to format quantity as whole numbers
const formatQuantity = (quantity) => {
    if (quantity === null || quantity === undefined || quantity === '') return '0';
    
    // Convert to number and round to nearest whole number
    const num = parseFloat(quantity);
    if (isNaN(num)) return '0';
    
    return Math.round(num).toString();
};

// Computed properties
const backOrderItems = computed(() => {
    return order.value.backorder_array || [];
});

const fulfillmentPercentage = computed(() => {
    return order.value.fullfill_percentage || 0;
});

const fulfillmentStatus = computed(() => {
    if (fulfillmentPercentage.value === 100) {
        return { text: 'Completed', class: 'text-green-600' };
    } else if (fulfillmentPercentage.value > 0) {
        return { text: 'Partially Fulfilled', class: 'text-orange-500' };
    } else {
        return { text: 'Pending Fulfillment', class: 'text-red-600' };
    }
});

// Business logic for button states
const canProcessBackOrder = computed(() => {
    return order.value.orderstatus === 0 && fulfillmentPercentage.value < 100 && isNotExpired.value;
});

const canCancelBackOrder = computed(() => {
    return order.value.orderstatus === 0 && isNotExpired.value;
});

const isNotExpired = computed(() => {
    if (!order.value.expiry) return true;
    return new Date(order.value.expiry) >= new Date();
});

// Fulfillment summary
const fulfillmentSummary = computed(() => {
    if (!backOrderItems.value.length) return [];

    return backOrderItems.value.map((item) => {
        const fulfilled = getFulfilledQuantity(item.materialid);
        const original = parseFloat(item.qty);
        const remaining = original - fulfilled;
        const fulfillmentRate = original > 0 ? Math.round((fulfilled / original) * 100) : 0;

        return {
            materialid: item.materialid,
            original: original,
            fulfilled: fulfilled,
            remaining: remaining,
            fulfillmentRate: fulfillmentRate
        };
    });
});

// Helper methods
const getFulfilledQuantity = (materialId) => {
    if (!order.value.list_order) return 0;

    let totalFulfilled = 0;
    order.value.list_order.forEach((orderItem) => {
        if (orderItem.fullfill_order_array) {
            orderItem.fullfill_order_array.forEach((fulfillItem) => {
                if (fulfillItem.materialid === materialId) {
                    totalFulfilled += parseFloat(fulfillItem.qty);
                }
            });
        }
    });
    return totalFulfilled;
};

const getRemainingQuantity = (materialId) => {
    const backOrderItem = backOrderItems.value.find((item) => item.materialid === materialId);
    if (!backOrderItem) return 0;

    const originalQty = parseFloat(backOrderItem.qty);
    const fulfilledQty = getFulfilledQuantity(materialId);
    return originalQty - fulfilledQty;
};

const getFulfillmentClass = (data) => {
    const fulfilled = getFulfilledQuantity(data.materialid);
    const original = parseFloat(data.qty);

    if (fulfilled === 0) return 'text-red-600';
    if (fulfilled < original) return 'text-orange-500';
    return 'text-green-600 font-bold';
};

const getRemainingClass = (data) => {
    const remaining = getRemainingQuantity(data.materialid);
    if (remaining === 0) return 'text-green-600';
    if (remaining > 0) return 'text-orange-500';
    return 'text-red-600';
};

const getFulfillmentItems = (fulfillOrder) => {
    return fulfillOrder.fullfill_order_array || [];
};

const getOrderStatusText = (status) => {
    const statusMap = {
        0: 'Processing',
        1: 'Approved',
        9: 'Rejected',
        66: 'Processing in SAP'
    };
    return statusMap[status] || 'Unknown';
};

const getOrderStatusSeverity = (status) => {
    const severityMap = {
        0: 'warn',
        1: 'success',
        9: 'danger',
        66: 'info'
    };
    return severityMap[status] || 'secondary';
};

const getBackOrderStatusText = (status) => {
    const statusMap = {
        0: 'In Progress',
        1: 'Complete',
        9: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
};

const getBackOrderStatusSeverity = (status) => {
    const severityMap = {
        0: 'warn',
        1: 'success',
        9: 'danger'
    };
    return severityMap[status] || 'secondary';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Lifecycle
onMounted(() => {
    fetchBackOrderDetail();
});
</script>