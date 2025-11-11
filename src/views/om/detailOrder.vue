<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/om/listOrder">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                    </div>

                    <div class="flex items-center justify-between w-full">
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Customer Account No.</span>
                            <span class="text-lg font-medium">{{ orderData.custaccountno || '-' }}</span>
                        </div>
                    </div>

                    <div class="font-semibold text-xl border-b pb-2 mt-2">🏬 Customer Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Dealer Name</span>
                            <p class="text-lg font-medium">{{ customerInfo.dealerName || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Location</span>
                            <p class="text-lg font-medium">{{ getFullAddress(shippingDetail) || '-' }}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Signboard</span>
                            <p class="text-lg font-medium">{{ customerInfo.signboard || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ orderData.distributionchannel || '-' }}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Contact Person</span>
                            <p class="text-lg font-medium">{{ shippingDetail?.companyName1 || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Contact Number</span>
                            <p class="text-lg font-medium">{{ shippingDetail?.phoneNumber || shippingDetail?.mobileNumber || '-' }}</p>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🚚 Shipping Information</div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-bold text-gray-700">Ship To</span>
                            <p class="text-lg font-medium">
                                {{ orderData.deliveryType === 'DELIVER' ? shippingDetail?.companyName1 : 'Customer Self Pickup' }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Shipping Cond</span>
                            <p class="text-lg font-medium">{{ orderData.shippingcond || 'Standard' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery Type</span>
                            <p class="text-lg font-medium">{{ orderData.deliveryType || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery ETA</span>
                            <p class="text-lg font-medium">{{ formatDate(orderData.deliveryDate) }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery Status</span>
                            <p class="text-lg font-medium">
                                <span :class="statusClass(orderData.status_string)">
                                    {{ orderData.status_string || '-' }}
                                </span>
                            </p>
                            <p class="text-xs text-gray-500 mt-1">Last updated: {{ formatDateTime(orderData.updated_at) }}</p>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="font-semibold text-xl border-b pb-2">📦 Order Items</div>

                    <DataTable :value="orderItems" selectionMode="multiple" v-model:selection="selectedReturnItems" dataKey="materialid">
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="materialid" header="Material ID"></Column>
                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory || 'ZRO2' }}
                            </template>
                        </Column>
                        <Column field="qty" header="Available Qty">
                            <template #body="{ data }">
                                {{ data.qty - getReturnedQty(data.materialid) }}
                            </template>
                        </Column>
                        <!-- <Column header="Return Qty">
                            <template #body="{ data }">
                                <InputNumber v-model="returnQuantities[data.materialid]" :min="0" :max="data.qty - getReturnedQty(data.materialid)" showButtons class="w-full" />
                            </template>
                        </Column> -->
                        <Column field="unitprice" header="Price">
                            <template #body="{ data }">
                                RM {{ parseFloat(data.unitprice).toFixed(2) }}
                            </template>
                        </Column>
                    </DataTable>

                    <div class="flex justify-end items-center border-t px-4 py-2">
                        <span class="text-lg font-semibold text-gray-800">Grand Total: RM {{ totalAmount.toFixed(2) }}</span>
                    </div>
                </div>
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="orderData.orderstatus === 1 ? 'Complete' : 'Pending'" :severity="orderData.orderstatus === 1 ? 'success' : 'warn'" />
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price Group</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.pricegroup || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Group</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.customerCondGrp || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Storage Location</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.storagelocation || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">User Approved</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.approved_by || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Date Approved</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDate(orderData.approved_at) }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="px-2 py-2 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button label="Return Order" class="p-button-danger text-sm !w-fit" @click="showReturnOrderDialog = true" :disabled="orderData.orderstatus !== 1" />
                                            <Button label="Pull SAP Update" class="text-sm !w-fit" @click="pullSAPUpdate" :loading="loadingSAP" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">Document Info</div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Last Updated</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDateTime(orderData.updated_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Return Order Dialog -->
            <Dialog v-model:visible="showReturnOrderDialog" header="Return Order" modal :style="{ width: '50rem' }">
                <div class="flex flex-col gap-4">
                    <div class="p-fluid">
                        <label for="returnReason" class="font-semibold">Return Reason</label>
                        <Dropdown id="returnReason" v-model="returnReason" :options="returnReasons" optionLabel="name" optionValue="code" placeholder="Select return reason" class="w-full" />
                    </div>

                    <div class="font-semibold">Select Items to Return</div>
                    <DataTable :value="orderItems" selectionMode="multiple" v-model:selection="selectedReturnItems" dataKey="materialid">
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="materialid" header="Material ID"></Column>
                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory || 'ZRO2' }}
                            </template>
                            </Column>   
                        <Column field="qty" header="Available Qty">
                            <template #body="{ data }">
                                {{ data.qty - getReturnedQty(data.materialid) }}
                            </template>
                        </Column>
                        <Column header="Return Qty">
                            <template #body="{ data }">
                                <InputNumber v-model="returnQuantities[data.materialid]" :min="0" :max="data.qty - getReturnedQty(data.materialid)" showButtons class="w-full" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="cancelReturnOrder" />
                    <Button label="Submit Return" icon="pi pi-check" class="p-button-success" @click="submitReturnOrder" />
                </template>
            </Dialog>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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
const orderItems = ref([]);
const loadingSAP = ref(false);
const showReturnOrderDialog = ref(false);
const returnReason = ref('');
const selectedReturnItems = ref([]);
const returnQuantities = ref({});

// Return reasons
const returnReasons = ref([
    { code: 'Y01', name: 'Wrong DOM' },
    { code: 'Y09', name: 'Receive Wrong Item' },
    { code: 'Y11', name: 'Delivered Wrong Address' }
]);

// Computed properties
const totalAmount = computed(() => {
    return orderItems.value.reduce((sum, item) => {
        return sum + parseFloat(item.qty) * parseFloat(item.unitprice || 0);
    }, 0);
});

// Methods
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY');
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-MY');
};

const statusClass = (status) => {
    const statusMap = {
        COMPLETED: 'text-green-600 font-bold',
        DELIVERY: 'text-blue-600 font-bold',
        PROCESSING: 'text-orange-600 font-bold',
        PENDING: 'text-gray-600 font-bold'
    };
    return statusMap[status] || 'text-gray-600 font-bold';
};

const getFullAddress = (shipping) => {
    if (!shipping) return '-';
    const addressParts = [shipping.addressLine1, shipping.addressLine2, shipping.addressLine3, shipping.addressLine4, shipping.city, shipping.state, shipping.postcode].filter((part) => part && part.trim() !== '');

    return addressParts.join(', ') || '-';
};

const getReturnedQty = (materialId) => {
    // This should be implemented based on your return order history
    // For now, return 0 as placeholder
    return 0;
};

// API Calls
const fetchOrderDetail = async () => {
    try {
        const orderNo = route.params.orderNo;
        const response = await api.get(`order/detail-order/${orderNo}`);

        if (response.data.status === 1) {
            const data = response.data.admin_data[0];
            orderData.value = data;

            // Extract order items from order_array and merge with fullfill_order_array
            if (data.order_array && Array.isArray(data.order_array)) {
                const orderArray = data.order_array;
                const fullfillArray = data.fullfill_order_array || [];

                orderItems.value = orderArray.map((orderItem) => {
                    const fullfillItem = fullfillArray.find((fItem) => fItem.materialid === orderItem.materialid) || {};
                    return {
                        materialid: orderItem.materialid,
                        itemcategory: orderItem.itemcategory || 'ZRO2',
                        qty: parseFloat(orderItem.qty) || 0,
                        unitprice: parseFloat(fullfillItem.unitprice) || 0,
                        totalamt: parseFloat(fullfillItem.totalamt) || 0,
                        itemno: orderItem.itemno || fullfillItem.itemno
                    };
                });
            }

            // Extract shipping details
            if (data.shippingDetail && data.shippingDetail.length > 0) {
                shippingDetail.value = data.shippingDetail[0];
            }

            // Set customer info
            customerInfo.value = {
                dealerName: data.customer_name || shippingDetail.value?.companyName1 || '-',
                division: data.division || '-',
                sapOrderType: data.sapordertype || '-',
                salesOrg: data.salesorg || '-',
                distributionChannel: data.distributionchannel || '-'
            };
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch order details', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch order details', life: 3000 });
    }
};

const pullSAPUpdate = async () => {
    try {
        loadingSAP.value = true;
        const orderNo = route.params.orderNo;
        const response = await api.get(`order/order-update/${orderNo}`);

        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'SAP data updated successfully', life: 3000 });
            // Refresh order data
            await fetchOrderDetail();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to update SAP data', life: 3000 });
        }
    } catch (error) {
        console.error('Error pulling SAP update:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update SAP data', life: 3000 });
    } finally {
        loadingSAP.value = false;
    }
};

const submitReturnOrder = async () => {
    try {
        if (!returnReason.value) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a return reason', life: 3000 });
            return;
        }

        const returnItems = selectedReturnItems.value
            .filter((item) => returnQuantities.value[item.materialid] > 0)
            .map((item, index) => ({
                materialid: item.materialid,
                itemcategory: item.itemcategory || 'ZRO2',
                qty: returnQuantities.value[item.materialid].toString(),
                salesdoclineitem: ((index + 1) * 10).toString()
            }));

        if (returnItems.length === 0) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select items and quantities to return', life: 3000 });
            return;
        }

        const payload = {
            order_array: returnItems,
            returnReason: returnReason.value // Send the code, not the name
        };

        console.log('Return Order Payload:', payload);

        const orderNo = route.params.orderNo;
        const response = await api.post(`order/create-return-order/${orderNo}`, payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Return order created: ${response.data.admin_data}`,
                life: 3000
            });
            showReturnOrderDialog.value = false;
            resetReturnForm();

            // Refresh order data to reflect the return
            await fetchOrderDetail();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to create return order',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error creating return order:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create return order',
            life: 3000
        });
    }
};

const cancelReturnOrder = () => {
    showReturnOrderDialog.value = false;
    resetReturnForm();
};

const resetReturnForm = () => {
    returnReason.value = '';
    selectedReturnItems.value = [];
    returnQuantities.value = {};
};

// Lifecycle
onMounted(() => {
    fetchOrderDetail();
});
</script>
