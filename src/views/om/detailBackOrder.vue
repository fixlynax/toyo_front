<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col gap-2">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Back Order Detail</div>

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
                    <div class="font-semibold text-xl border-b pb-2 mt-2">🚚 Shipping & Order Info</div>
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
                    </div>
                </div>

                <!-- BACK ORDER ARRAY -->
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl border-b pb-2">📦 Back Order Items</div>
                    <DataTable :value="order.backorder_array" class="text-sm" stripedRows>
                        <Column field="materialid" header="Material ID" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.materialid }}</span>
                            </template>
                        </Column>
                        <Column field="qty" header="Qty" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.qty }}</span>
                            </template>
                        </Column>
                        <Column field="price" header="Price (RM)" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.price }}</span>
                            </template>
                        </Column>
                        <Column field="salesprogramid" header="Sales Program ID" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.salesprogramid }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- FULFILMENT ARRAY -->
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
            <div class="md:w-1/3 flex flex-col">
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
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
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
</script>
