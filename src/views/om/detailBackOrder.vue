<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col gap-2">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/om/listBackOrder">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Back Order Detail</div>
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
                            <p class="text-lg font-medium">{{ order.deliveryDate }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Back Order No</span>
                            <p class="text-lg font-medium">{{ order.bo_orderno }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Expiry</span>
                            <p class="text-lg font-medium">{{ order.expiry }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Delivery Status</span>
                            <p class="text-lg font-medium">
                                <Tag :value="backOrdering.deliveryStatus" :severity="backOrdering.deliveryStatus === 'Delivered' ? 'success' : backOrdering.deliveryStatus === 'Scheduled' ? 'info' : 'warn'" />
                            </p>
                            <p class="text-xs text-gray-500 mt-1">Last updated: {{ backOrdering.lastUpdated }}</p>
                        </div>
                    </div>
                </div>

              
                <div class="card flex flex-col w-full">
                    <div class="font-semibold text-xl border-b pb-2">📦 Order Items</div>

                    <DataTable :value="orderItems" dataKey="id" responsiveLayout="scroll" class="text-sm" stripedRows>
                        <Column field="itemLineNo" header="Item Line No." style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.itemLineNo }}</span>
                            </template>
                        </Column>

                        <Column field="materialId" header="Material ID" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-medium text-lg">{{ data.materialId }}</span>
                            </template>
                        </Column>

                        <Column field="salesProgramId" header="Sales Program ID" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.salesProgramId }}</span>
                            </template>
                        </Column>

                        <Column field="priceGroup" header="Price Group" style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.priceGroup }}</span>
                            </template>
                        </Column>

                        <Column field="quantity" header="Qty" style="text-align: center">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.quantity }}</span>
                            </template>
                        </Column>

                        <Column field="unitPrice" header="Unit Price (RM)" style="min-width: 8rem; text-align: right">
                            <template #body="{ data }">
                                <span class="text-lg font-semibold text-green-600">{{ data.unitPrice.toFixed(2) }}</span>
                            </template>
                        </Column>

                        <Column field="totalPrice" header="Total (RM)" style="min-width: 8rem; text-align: right">
                            <template #body="{ data }">
                                <span class="text-lg font-bold text-green-700">{{ (data.quantity * data.unitPrice).toFixed(2) }}</span>
                            </template>
                        </Column>
                    </DataTable>

                    <div class="flex justify-end items-center border-t px-4 py-2">
                        <span class="text-lg font-semibold text-gray-800">Grand Total: RM {{ totalAmount.toFixed(2) }}</span>
                    </div>
                </div>

           
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl border-b pb-2">📦 Fulfilment Details</div>
                    <DataTable :value="order.fulfil_array" class="text-sm" stripedRows>
                        <Column field="materialid" header="Material ID" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.materialid }}</span>
                            </template>
                        </Column>
                        <Column field="qty" header="Qty" style="min-width: 5rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.qty }}</span>
                            </template>
                        </Column>
                        <Column field="date" header="Date" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.date }}</span>
                            </template>
                        </Column>
                        <Column field="saporder_no" header="SAP Order No" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.saporder_no }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col gap-6">
                <!-- ADVANCE INFO -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="order.orderstatus === 1 ? 'Complete' : 'Pending'" :severity="order.orderstatus === 1 ? 'success' : 'warn'" />
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
                                    <td class="px-4 py-2 text-right">{{ order.created }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Modified</td>
                                    <td class="px-4 py-2 text-right">{{ order.modified }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Expiry</td>
                                    <td class="px-4 py-2 text-right">{{ order.expiry }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex justify-end mt-4 gap-2">
                        <Button label="Cancel Back-Order" severity="danger" size="small" class="!w-fit" />
                        <Button label="Process Back-Order" severity="success" size="small" class="!w-fit" />
                    </div>
                </div>

            
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">📦 Order Logs</div>

                    <DataTable :value="orderLogs.slice(0, 10)" dataKey="id" responsiveLayout="scroll" class="text-sm" stripedRows>
                        <Column field="timestamp" header="Date & Time" style="min-width: 10rem">
                            <template #body="{ data }">
                                <span class="font-medium text-gray-800">{{ data.timestamp }}</span>
                            </template>
                        </Column>

                        <Column field="stage" header="Stage" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="font-semibold">{{ data.stage }}</span>
                            </template>
                        </Column>

                        <Column field="description" header="Activity Description" style="width: 16rem">
                            <template #body="{ data }">
                                <span>{{ data.description }}</span>
                            </template>
                        </Column>
                    </DataTable>

                    <div class="flex justify-end items-center border-t px-4 py-2">
                        <span class="text-sm text-gray-500">Showing latest 10 activities</span>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';
import Fluid from 'primevue/fluid';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const order = ref({
    id: 2,
    etenUserListID: 1,
    etenUserID: 1,
    custaccountno: '6020201500',
    salesorg: 'TSM',
    distributionchannel: '10',
    division: '10',
    pricegroup: '06',
    sapordertype: 'ZRP1',
    customerCondGrp: '04',
    shipto: '6020201500',
    shippingcond: 'KL',
    storagelocation: 'TMSA',
    orderDesc: 'NORMAL',
    channel: 'ETEN',
    deliveryType: 'DELIVER',
    deliveryDate: '2025-09-30',
    bo_orderno: '001212',
    backorder_array: [{ materialid: '81114NE0304175H', qty: '2', price: '100.00', salesprogramid: '0' }],
    fulfil_array: [{ materialid: '81114NE0304175H', qty: '1', salesprogramid: '0', date: '2025-09-09', saporder_no: '12345678', orderID: '1' }],
    orderstatus: 0,
    expiry: '2025-09-12 00:00:00',
    created: '2025-09-08 00:00:00',
    modified: '2025-09-09 00:00:00'
});

const orderLogs = ref([
    { id: 1, timestamp: '2025-10-20 09:45', stage: 'Customer Created', description: 'Order submitted by customer', status: 'Completed' },
    { id: 2, timestamp: '2025-10-20 10:02', stage: 'Order Validated', description: 'Order verified in system', status: 'Completed' },
    { id: 3, timestamp: '2025-10-20 10:10', stage: 'Awaiting Approval', description: 'Pending admin approval', status: 'Pending' },
    { id: 4, timestamp: '2025-10-20 11:15', stage: 'Approved', description: 'Admin approved the order', status: 'Completed' },
    { id: 5, timestamp: '2025-10-20 12:30', stage: 'Dispatched to SAP', description: 'Order sent to SAP for processing', status: 'Completed' },
    { id: 6, timestamp: '2025-10-20 13:00', stage: 'SAP Validation', description: 'SAP validating order details', status: 'Completed' },
    { id: 7, timestamp: '2025-10-20 14:20', stage: 'Processing in SAP', description: 'Order being processed in SAP', status: 'Completed' },
    { id: 8, timestamp: '2025-10-20 15:45', stage: 'Delivery Created', description: 'SAP created delivery order', status: 'Completed' },
    { id: 9, timestamp: '2025-10-20 17:00', stage: 'Invoice Generated', description: 'SAP invoice successfully generated', status: 'Completed' },
    { id: 10, timestamp: '2025-10-20 18:10', stage: 'Order Completed', description: 'Order marked completed in SAP', status: 'Completed' }
]);

const backOrdering = ref({
    shipTo: 'YESSIR TYRES SOLUTION SDN BHD',
    orderDesc: 'Order for electronics',
    shippingCond: 'Standard',
    deliveryType: 'DELIVER',
    deliveryDate: '2025-10-22',
    boOrderNo: 'BO1001',
    deliveryETA: '2025-10-24',
    deliveryStatus: 'Delivered',
    lastUpdated: '2025-10-23 09:45 AM'
});

const orderItems = ref([
    { id: 1, itemLineNo: '0010', materialId: '81114NE0304175H', salesProgramId: 'SP1001', priceGroup: '06', quantity: 2, unitPrice: 100 },
    { id: 2, itemLineNo: '0020', materialId: '81114NE0304120K', salesProgramId: 'SP1002', priceGroup: '06', quantity: 1, unitPrice: 150 }
]);

const totalAmount = computed(() => orderItems.value.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
</script>
