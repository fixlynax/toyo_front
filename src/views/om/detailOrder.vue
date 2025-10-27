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
                            <span class="text-lg font-medium">{{ backOrder.custAccountNo }}</span>
                        </div>
                    </div>

                    <div class="font-semibold text-xl border-b pb-2 mt-2">🏬 Customer Details</div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Dealer Name</span>
                            <p class="text-lg font-medium">{{ backOrder.customerName }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Location</span>
                            <p class="text-lg font-medium">{{ backOrder.location }}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Signboard</span>
                            <p class="text-lg font-medium">{{ backOrder.signboard }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ backOrder.distributionChannel }}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Contact Person</span>
                            <p class="text-lg font-medium">{{ warantyDetail.contactPerson }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm font-bold text-gray-700">Contact Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.contactNo }}</p>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl border-b pb-2">🚚 Shipping Information</div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-bold text-gray-700">Ship To</span>
                            <p class="text-lg font-medium">
                                {{ backOrdering.deliveryType === 'DELIVER' ? backOrdering.shipTo : 'Customer Self Pickup' }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Description</span>
                            <p class="text-lg font-medium">{{ backOrdering.orderDesc }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Shipping Cond</span>
                            <p class="text-lg font-medium">{{ backOrdering.shippingCond }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery Type</span>
                            <p class="text-lg font-medium">{{ backOrdering.deliveryType }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery ETA</span>
                            <p class="text-lg font-medium">{{ backOrdering.deliveryETA }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Delivery Status</span>
                            <p class="text-lg font-medium">
                                <span class="text-green-600 font-bold">
                                    {{ backOrdering.deliveryStatus }}
                                </span>
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
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="form.status === 1 ? 'Complete' : 'Pending'" :severity="form.status === 1 ? 'success' : 'warn'" />
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price Group</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ backOrder.division }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Group</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ backOrder.sapOrderType }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Storage Location</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ backOrder.salesOrg }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">User Approved</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ backOrder.deliveryDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Date Approved</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ backOrder.deliveryDate }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="px-2 py-2 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button label="Return Order" class="p-button-danger text-sm !w-fit" @click="showPasswordDialog = true" />
                                            <RouterLink to="/billing">
                                                <Button label="Pull SAP Update" class="text-sm !w-fit" />
                                            </RouterLink>
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
                                    <td class="px-4 py-2 text-right font-semibold">{{ billing.soNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ billing.doNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ billing.invoiceNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Last Updated</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ billing.lastUpdated }}</td>
                                </tr>
                            </tbody>
                        </table>
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

            <Dialog v-model:visible="showPasswordDialog" header="Enter Admin Password" modal :closable="false" style="width: 25rem">
                <div class="flex flex-col gap-3">
                    <span class="text-gray-700">Please enter the admin password to continue:</span>
                    <Password v-model="adminPassword" placeholder="Enter password" toggleMask feedback="false" class="w-full" />
                </div>

                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="cancelDialog" />
                        <Button label="Confirm" icon="pi pi-check" class="p-button-success" @click="confirmPassword" />
                    </div>
                </template>
            </Dialog>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Password from 'primevue/password';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Fluid from 'primevue/fluid';
import { RouterLink } from 'vue-router';

const toast = useToast();
const showPasswordDialog = ref(false);
const adminPassword = ref('');

const cancelDialog = () => {
    showPasswordDialog.value = false;
    adminPassword.value = '';
};

const confirmPassword = () => {
    if (adminPassword.value === 'admin123') {
        toast.add({ severity: 'success', summary: 'Access Granted', detail: 'You may proceed with Return Order.', life: 3000 });
        showPasswordDialog.value = false;
        adminPassword.value = '';
    } else {
        toast.add({ severity: 'error', summary: 'Invalid Password', detail: 'Please try again.', life: 3000 });
    }
};

const form = ref({ status: 0 });

const backOrder = ref({
    custAccountNo: '6080100900',
    customerName: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    location: '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia',
    signboard: 'T10',
    distributionChannel: 'ETEN',
    division: 'DIV01',
    sapOrderType: 'NORMAL',
    salesOrg: 'SO001',
    shipTo: 'YESSIR TYRES SOLUTION SDN BHD',
    shippingCond: 'Standard',
    deliveryType: 'DELIVER',
    deliveryDate: '2023-10-15',
    orderDesc: 'Order for electronics',
    boOrderNo: 'BO1001'
});

const billing = ref({
    soNo: 'SO1001',
    doNo: 'DO1001',
    invoiceNo: 'INV1001',
    lastUpdated: '2025-10-22'
});

const warantyDetail = ref({
    contactPerson: 'Ahmad Zaki',
    contactNo: '+6012-3456789'
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
    { id: 1, itemLineNo: 10, materialId: 'MAT-1001', salesProgramId: 'SP-2025A', priceGroup: 'PG-A', quantity: 5, unitPrice: 120.0 },
    { id: 2, itemLineNo: 20, materialId: 'MAT-2002', salesProgramId: 'SP-2025B', priceGroup: 'PG-B', quantity: 2, unitPrice: 250.5 },
    { id: 3, itemLineNo: 30, materialId: 'MAT-3003', salesProgramId: 'SP-2025C', priceGroup: 'PG-C', quantity: 1, unitPrice: 499.99 }
]);

const totalAmount = computed(() => orderItems.value.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
</script>
