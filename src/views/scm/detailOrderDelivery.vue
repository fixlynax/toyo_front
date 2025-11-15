<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/scm/listOrderDelivery">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Order Delivery Details</div>
                    </div>

                    <div class="font-semibold text-xl border-b pb-2 mt-2">Customer Details</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Dealer Name</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.companyName1 || '-' }} {{ orderDelList.eten_user?.companyName2 }} {{ orderDelList.eten_user?.companyName3 }} {{ orderDelList.eten_user?.companyName4 }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Account Number</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.custAccountNo || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Member Code</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.memberCode || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Location</span>
                            <p class="text-lg font-medium">
                                {{ orderDelList.eten_user?.addressLine1 }} {{ orderDelList.eten_user?.addressLine2 }} {{ orderDelList.eten_user?.addressLine3 }} {{ orderDelList.eten_user?.addressLine4 }}, {{ orderDelList.eten_user?.postcode }} {{ orderDelList.eten_user?.city }} {{ orderDelList.eten_user?.state }} 
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Contact Person</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.phoneNumber || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.channel || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <!-- Header -->
                    <div class="font-semibold text-xl border-b pb-2 mt-2">Order Item</div>
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Order Type</span>
                            <p class="text-lg font-semibold">{{ orderDelList.orderDesc || '-' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Ship To</span>
                            <p class="text-lg font-semibold">{{ orderDelList.shipto || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Inv No</span>
                            <p class="text-lg font-medium">{{ orderDelList.inv_no || '-' }}</p>
                        </div>
                    </div>
                    <!-- Table -->
                    <DataTable :value="orderDelList.fullfill_order_array" dataKey="materialid" class="rounded-table mt-6">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">
                                {{ formatItemNo(data.salesprogramid || data.itemno) }}
                            </template>
                        </Column>

                        <Column field="materialid" header="Item Category">
                            <template #body="{ data }">
                                {{ data.materialid }}
                            </template>
                        </Column>

                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory }}
                            </template>
                        </Column>

                        <Column field="qty" header="Quantity" class="text-right">
                            <template #body="{ data }">
                                {{ data.qty }}
                            </template>
                        </Column>

                        <!-- 🟦 Unit Price Column -->
                        <Column field="unitprice" header="Unit Price (RM)" class="text-right">
                            <template #body="{ data }">
                                {{ data.unitprice }}
                            </template>

                            <!-- ✅ Footer for label -->
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Subtotal</div>
                            </template>
                        </Column>

                        <!-- 🟦 Total Amount Column -->
                        <Column field="totalamt" header="Total Amount (RM)" class="text-right">
                            <template #body="{ data }">
                                {{ (Number(data.unitprice) * Number(data.qty)).toFixed(2) }}
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
                        <Tag :value="getOrderStatusText(orderDelList.orderstatus)" :severity="getOrderStatusSeverity(orderDelList.orderstatus)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Return No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.sapreturnno || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.sapordertype || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.division || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Pickup</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.pickup_datetime || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Receive</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.receive_datetime || '-' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.created || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-4 gap-2" v-if="orderDelList.orderstatus === 0">
                        <Button label="Reject" severity="danger" size="small" @click="onRejectReturnOrder" :loading="loadingAction === 'reject'" />
                        <Button label="Approve" severity="success" size="small" @click="onApproveReturnOrder" :loading="loadingAction === 'approve'" />
                    </div>

                    <!-- Status Labels after action -->
                    <div class="flex justify-end mt-4" v-else>
                        <Tag :value="getOrderStatusText(orderDelList.orderstatus)" :severity="getOrderStatusSeverity(orderDelList.orderstatus)" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const orderDelList = ref({});
const loading = ref(false);

const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(2, '0');
};
const subtotal = computed(() => {
    const arr = orderDelList.value.fullfill_order_array || [];
    return arr.reduce((sum, item) => sum + (Number(item.unitprice) * Number(item.qty)), 0);
});
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    }
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    }
function formatDateFull(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    }
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

const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`order-delivery/detail/${id}`);
        if ( (response.data.admin_data)) {
            // response.data.status === 1 &&
            orderDelList.value = response.data.admin_data;
        } else {
            console.error('API returned error or invalid data:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching data list:', error);
        orderDelList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    InitfetchData();
});
</script>
