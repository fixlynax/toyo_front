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

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Customer Name</span>
                            <p class="text-lg font-medium">{{ customerInfo.dealerName || '-' }} <br /> ({{ orderData.custaccountno || '-' }})</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Location</span>
                            <p class="text-lg font-medium">{{ getFullAddress(customerInfo) || '-' }}</p>
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
                            <p class="text-lg font-medium">{{ customerInfo.contactPerson || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Contact Number</span>
                            <p class="text-lg font-medium">{{ customerInfo.phoneNumber || customerInfo.mobileNumber || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <!-- Header -->
                    <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800">📦 <span>Order Items</span></div>

                    <!-- Table -->
                    <DataTable :value="orderItems" dataKey="materialid" class="rounded-table mt-4">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">
                                {{ formatItemNo(data.itemno) }}
                            </template>
                        </Column>

                        <Column header="Material">
                            <template #body="{ data }">
                                {{ data.materialid }} <br />
                                {{ data.materialdescription }}
                            </template>
                        </Column>

                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory }}
                            </template>
                        </Column>

                        <Column field="qty" header="Quantity">
                            <template #body="{ data }">
                                {{ parseInt(data.qty) }}
                            </template>
                        </Column>

                        <!-- 🟦 Unit Price Column -->
                        <Column field="unitprice" header="Unit Price" class="text-right">
                            <template #body="{ data }"> RM {{ parseFloat(data.unitprice || 0).toFixed(2) }} </template>

                            <!-- ✅ Footer for label -->
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Grand Total</div>
                            </template>
                        </Column>

                        <!-- 🟦 Total Amount Column -->
                        <Column field="totalamt" header="Total Amount" class="text-right">
                            <template #body="{ data }"> RM {{ parseFloat(data.totalamt || 0).toFixed(2) }} </template>

                            <!-- ✅ Footer for total value -->
                            <template #footer>
                                <div class="flex justify-start pr-3 font-semibold text-blue-600">RM {{ totalAmount.toFixed(2) }}</div>
                            </template>
                        </Column>
                    </DataTable>
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
                                <tr class="border-b text-xm">
                                    <td class="px-4 py-2 font-medium">Order No.</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ orderData.order_no || '-' }}</td>
                                </tr>
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
                                    <td class="px-4 py-2 font-medium">Scheduled Delivery</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDateTime(deliveryInfo.scheduled_delivery_time) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivered Date</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDateTime(deliveryInfo.delivered_datetime) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDateTime(orderData.created) || '-' }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="px-2 py-2 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button label="Return Order" class="p-button-danger text-sm !w-fit" @click="showReturnOrderDialog = true" :disabled="orderData.orderstatus !== 1" />
                                            <Button label="Pull SAP Update" class="text-sm !w-fit" @click="pullSAPUpdate" :loading="loadingSAP"  :disabled="orderData.orderstatus === 1"/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Shipping Info</div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Name</td>
                                    <td class="px-4 py-2 text-right font-semibold">
                                        {{ [shippingDetail.companyName1, shippingDetail.companyName2, shippingDetail.companyName3, shippingDetail.companyName4].filter(Boolean).join(', ') }}
                                    </td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Account No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">
                                        {{ shippingDetail?.custAccountNo || '-' }}
                                    </td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Address</td>
                                    <td class="px-4 py-2 text-right font-semibold">
                                        {{ getFullAddress(shippingDetail) }}
                                    </td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Phone No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail.phoneNumber || '-' }}</td>
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

            <!-- Return Order Dialog -->
            <Dialog v-model:visible="showReturnOrderDialog" header="Return Order" modal :style="{ width: '70rem' }">
                <div class="flex flex-col gap-4">
                    <div class="p-fluid">
                        <label for="returnReason" class="font-semibold">Return Reason</label>
                        <Dropdown id="returnReason" v-model="returnReason" :options="returnReasons" optionLabel="name" optionValue="code" placeholder="Select return reason" class="w-full" />
                    </div>

                    <div class="font-semibold">Select Items to Return</div>
                    <DataTable :value="orderItems" selectionMode="multiple" v-model:selection="selectedReturnItems" dataKey="materialid" class="rounded-table">
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">
                                {{ formatItemNo(data.itemno) }}
                            </template>
                        </Column>
                        <Column field="materialid" header="Material ID"></Column>
                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ mapItemCategory(data.itemcategory) }}
                            </template>
                        </Column>
                        <Column field="qty" header="Available Qty">
                            <template #body="{ data }">
                                {{ parseInt(data.qty) }}
                            </template>
                        </Column>
                        <Column header="Return Qty">
                            <template #body="{ data }">
                                <InputNumber v-model="returnQuantities[data.materialid]" :min="0" :max="parseInt(data.qty)" showButtons class="w-full" :disabled="!selectedReturnItems.some((item) => item.materialid === data.materialid)" />
                            </template>
                        </Column>
                        <Column field="unitprice" header="Unit Price">
                            <template #body="{ data }"> RM {{ parseFloat(data.unitprice || 0).toFixed(2) }} </template>
                        </Column>
                        <template #loadingicon></template>
                    </DataTable>

                    <div class="flex justify-end gap-2 mt-4">
                        <Button label="Cancel" class="p-button-secondary" @click="cancelReturnOrder" />
                        <Button label="Submit Return" class="p-button-primary" @click="submitReturnOrder" />
                    </div>
                </div>
            </Dialog>
        </div>
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
const loadingSAP = ref(false);
const showReturnOrderDialog = ref(false);
const returnReason = ref('');
const selectedReturnItems = ref([]);
const returnQuantities = ref({});

// Return reasons
const returnReasons = ref([
    { code: 'Wrong DOM', name: 'Wrong DOM' },
    { code: 'Receive Wrong Item', name: 'Receive Wrong Item' },
    { code: 'Delivered Wrong Address', name: 'Delivered Wrong Address' }
]);

// Computed properties
const totalAmount = computed(() => {
    return orderItems.value.reduce((sum, item) => {
        return sum + parseFloat(item.totalamt || 0);
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

const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    // Convert to string and pad with leading zeros to 6 digits
    return itemNo.toString().padStart(6, '0');
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

const getFullAddress = (data) => {
    if (!data) return '-';

    // Handle both customerInfo and shippingDetail structures
    const addressParts = [data.addressLine1, data.addressLine2, data.addressLine3, data.addressLine4, data.city, data.state, data.postcode].filter((part) => part && part.trim() !== '');

    return addressParts.join('') || '-';
};

// Item category mapping function
const mapItemCategory = (category) => {
    if (!category) return 'ZR02';

    const categoryMap = {
        ZT02: 'ZR02',
        ZT3F: 'ZR3F'
    };

    return categoryMap[category] || category;
};

// Watch for selection changes to enable/disable quantity input
watch(selectedReturnItems, (newSelection) => {
    // Reset quantities for items that are no longer selected
    Object.keys(returnQuantities.value).forEach((materialId) => {
        if (!newSelection.some((item) => item.materialid === materialId)) {
            returnQuantities.value[materialId] = 0;
        }
    });
});

// API Calls
const fetchOrderDetail = async () => {
    try {
        const orderNo = route.params.orderNo;
        const response = await api.get(`order/detail-order/${orderNo}`);

        if (response.data.status === 1 && response.data.admin_data.length > 0) {
            const data = response.data.admin_data[0];
            orderData.value = data;

            // ✅ Use fullfill_order_array for order items display
            if (Array.isArray(data.fullfill_order_array)) {
                orderItems.value = data.fullfill_order_array.map((item) => ({
                    ...item,
                    qty: parseInt(item.qty) || 0,
                    unitprice: parseFloat(item.unitprice) || 0,
                    totalamt: parseFloat(item.totalamt) || 0
                }));
            } else {
                orderItems.value = [];
            }

            // ✅ Customer Details (from etenInformation)
            const etenInfo = data.etenInformation || {};
            customerInfo.value = {
                dealerName: etenInfo.companyName1 || '-',
                signboard: etenInfo.signboardBrand || '-',
                contactPerson: etenInfo.companyName3 || '-', // MR. JACKIE CHAN
                phoneNumber: etenInfo.phoneNumber || '-',
                mobileNumber: etenInfo.mobileNumber || '-',
                email: etenInfo.emailAddress || '-',
                // Address fields for location
                addressLine1: etenInfo.addressLine1,
                addressLine2: etenInfo.addressLine2,
                addressLine3: etenInfo.addressLine3,
                addressLine4: etenInfo.addressLine4,
                city: etenInfo.city,
                state: etenInfo.state,
                postcode: etenInfo.postcode
            };

            // ✅ Shipping Info (from shippingDetail array)
            if (Array.isArray(data.shippingDetail) && data.shippingDetail.length > 0) {
                shippingDetail.value = data.shippingDetail[0];
            } else {
                shippingDetail.value = {};
            }

            // ✅ Delivery Info (from scm_deliver_detail array)
            if (Array.isArray(data.scm_deliver_detail) && data.scm_deliver_detail.length > 0 && data.scm_deliver_detail[0]) {
                deliveryInfo.value = data.scm_deliver_detail[0];
            } else {
                deliveryInfo.value = {};
            }
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid or empty order data', life: 3000 });
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
                itemcategory: mapItemCategory(item.itemcategory), // Use mapped category for return
                qty: returnQuantities.value[item.materialid].toString(),
                salesdoclineitem: item.itemno,
                plant: 'TSM'
            }));

        if (returnItems.length === 0) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select items and quantities to return', life: 3000 });
            return;
        }

        const payload = new URLSearchParams();
        payload.append('returnReason', returnReason.value);
        payload.append('order_array', JSON.stringify(returnItems));

        console.log('Return Order Payload:', {
            returnReason: returnReason.value,
            order_array: returnItems
        });

        const orderNo = route.params.orderNo;
        const response = await api.postExtra(`order/create-return-order/${orderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Return order created: ${response.data.admin_data}`,
                life: 3000
            });
            showReturnOrderDialog.value = false;
            resetReturnForm();
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
            detail: 'Failed to create return order: ' + error.message,
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
