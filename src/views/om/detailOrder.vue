<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Column - Customer Info & Order Items -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Customer Information Card -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b pb-3">
                        <RouterLink to="/om/listOrder">
                            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-bold text-gray-700">Customer Name</span>
                            <p class="text-lg font-medium">
                                {{ customerInfo.dealerName || '-' }}<br />
                                (<span class="text-primary font-semibold">{{ orderData.custaccountno || '-' }}</span
                                >)
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Location</span>
                            <p class="text-lg font-medium">{{ getFullAddress(customerInfo) || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Signboard</span>
                            <p class="text-lg font-medium">{{ customerInfo.signboard || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ orderData.distributionchannel || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Sales Org</span>
                            <p class="text-lg font-medium">{{ orderData.salesorg || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Price Group</span>
                            <p class="text-lg font-medium">{{ orderData.pricegroup || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Email Address</span>
                            <p class="text-lg font-medium">{{ customerInfo.email || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-700">Contact Number</span>
                            <p class="text-lg font-medium">{{ customerInfo.phoneNumber || customerInfo.mobileNumber || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Order Items Card -->
                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800">📦 <span>Order Items</span></div>
                    <DataTable :value="orderItems" dataKey="materialid" class="rounded-table mt-4">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">{{ formatItemNo(data.itemno) }}</template>
                        </Column>
                        <Column header="Material">
                            <template #body="{ data }">
                                {{ data.materialid }}<br />
                                {{ data.materialdescription }}
                                <span class="block text-xs text-gray-500">SP: {{ data.salesprogramid || '-' }} </span>
                            </template>
                        </Column>
                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">{{ data.itemcategory }}</template>
                        </Column>
                        <Column field="qty" header="Quantity">
                            <template #body="{ data }">{{ parseInt(data.qty) }}</template>
                        </Column>
                        <Column field="unitprice" header="Unit Price" class="text-right">
                            <template #body="{ data }">RM {{ parseFloat(data.unitprice || 0).toFixed(2) }}</template>
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Grand Total</div>
                            </template>
                        </Column>
                        <Column field="totalamt" header="Total Amount" class="text-right">
                            <template #body="{ data }">RM {{ parseFloat(data.totalamt || 0).toFixed(2) }}</template>
                            <template #footer>
                                <div class="flex justify-start pr-3 font-semibold text-blue-600">RM {{ totalAmount.toFixed(2) }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- Right Column - Advance Info & Shipping/Pickup Info -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info Card -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Order Info</div>
                        <Tag :value="orderStatusText" :severity="orderStatusSeverity" />
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No.</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderData.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Remark</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderData.order_remarks || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Channel</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ orderData.channel || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Description</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.orderDesc || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No.</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No.</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.inv_no || '-' }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price Group</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.pricegroup || '-' }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Group</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.customerCondGrp || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Type</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderData.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Storage Location</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ deliveryInfo.storageLocation || customerInfo.storageLocation || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">ETA Date</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDate(orderData.deliveryDate) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Planned Date</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDate(deliveryInfo.scheduled_delivery_time) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivered Date</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDate(deliveryInfo.delivered_datetime) || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ formatDateTime(orderData.created) || '-' }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="px-2 py-2 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button label="Return Order" class="p-button-danger text-sm !w-fit" @click="showReturnOrderDialog = true" :disabled="!canReturnOrder" />
                                            <Button label="Pull SAP Update" class="text-sm !w-fit" @click="pullSAPUpdate" :loading="loadingSAP" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Shipping Info Card (for DELIVER type) -->
                <!-- <div v-if="orderData.deliveryType === 'DELIVER'" class="card flex flex-col w-full"> -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Shipping Info</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Name</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ getCompanyName(shippingDetail) || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Account No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail?.custAccountNo || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Address</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ getFullAddress(shippingDetail) || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Phone No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail.phoneNumber || shippingDetail.mobileNumber || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Email</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ shippingDetail.emailAddress || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pickup Info Card (for LALAMOVE/SELFCOLLECT type) -->
                <!-- <div v-if="orderData.deliveryType === 'LALAMOVE' || orderData.deliveryType === 'SELFCOLLECT'" class="card flex flex-col w-full"> -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Pickup Info</div>
                        <div class="flex items-center gap-2">
                            <Tag v-if="!hasPickupInfo" value="No Collector" severity="warning" />
                            <!-- <Button v-if="hasPickupInfo" icon="pi pi-pencil" class="p-button-text p-button-secondary text-sm" size="small" @click="openUpdateDriverDialog" v-tooltip="'Update Driver Info'" /> -->
                            <!-- <Button v-if="hasPickupInfo" label="Update Driver" icon="pi pi-pencil" class="p-button-primary text-xs" style="width: fit-content" @click="openUpdateDriverDialog" /> -->
                        </div>
                    </div>

                    <!-- When pickup detail exists -->
                    <div v-if="hasPickupInfo" class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Driver Name</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ pickupDetail.driverName || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Phone Number</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ pickupDetail.driverPhoneNumber || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Truck Plate</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ pickupDetail.driverTruckPlate || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Driver IC</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ pickupDetail.driverIC || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Pickup Date & Time</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDateTime(pickupDetail.pickup_datetime) || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- When no pickup detail exists -->
                    <div v-else class="p-6 text-center">
                        <div class="text-gray-500 mb-4">
                            <i class="pi pi-info-circle text-2xl mb-2"></i>
                            <p class="text-lg font-medium">No collector information available</p>
                        </div>
                        <Button label="Add Driver" icon="pi pi-plus" class="p-button-primary" style="width: fit-content" @click="showAddDriverDialog = true" :disabled="loadingDriver" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Driver Dialog -->
        <Dialog v-model:visible="showAddDriverDialog" header="Add Driver Information" modal :style="{ width: '30rem' }" :closable="false">
            <div class="flex flex-col gap-4">
                <div class="p-fluid">
                    <label for="driverName" class="font-semibold">Driver Name <span class="text-red-500">*</span></label>
                    <InputText id="driverName" v-model="driverForm.driverName" placeholder="Enter driver name" class="w-full" :class="{ 'p-invalid': driverFormSubmitted && !driverForm.driverName }" />
                    <small v-if="driverFormSubmitted && !driverForm.driverName" class="p-error">Driver name is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="driverPhoneNumber" class="font-semibold">Phone Number <span class="text-red-500">*</span></label>
                    <InputText id="driverPhoneNumber" v-model="driverForm.driverPhoneNumber" placeholder="Enter phone number" class="w-full" :class="{ 'p-invalid': driverFormSubmitted && !driverForm.driverPhoneNumber }" />
                    <small v-if="driverFormSubmitted && !driverForm.driverPhoneNumber" class="p-error">Phone number is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="driverTruckPlate" class="font-semibold">Truck Plate No <span class="text-red-500">*</span></label>
                    <InputText id="driverTruckPlate" v-model="driverForm.driverTruckPlate" placeholder="Enter truck plate number" class="w-full" :class="{ 'p-invalid': driverFormSubmitted && !driverForm.driverTruckPlate }" />
                    <small v-if="driverFormSubmitted && !driverForm.driverTruckPlate" class="p-error">Truck plate number is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="driverIC" class="font-semibold">IC Number</label>
                    <InputText id="driverIC" v-model="driverForm.driverIC" placeholder="Enter IC number (optional)" class="w-full" />
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" class="p-button-secondary" @click="cancelAddDriver" :disabled="loadingDriver" />
                    <Button label="Submit" class="p-button-primary" @click="submitDriverInfo" :loading="loadingDriver" />
                </div>
            </div>
        </Dialog>

        <!-- Update Driver Dialog -->
        <Dialog v-model:visible="showUpdateDriverDialog" header="Update Driver Information" modal :style="{ width: '30rem' }" :closable="false">
            <div class="flex flex-col gap-4">
                <div class="p-fluid">
                    <label for="updateDriverName" class="font-semibold">Driver Name <span class="text-red-500">*</span></label>
                    <InputText id="updateDriverName" v-model="updateDriverForm.driverName" placeholder="Enter driver name" class="w-full" :class="{ 'p-invalid': updateDriverFormSubmitted && !updateDriverForm.driverName }" />
                    <small v-if="updateDriverFormSubmitted && !updateDriverForm.driverName" class="p-error">Driver name is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="updateDriverPhoneNumber" class="font-semibold">Phone Number <span class="text-red-500">*</span></label>
                    <InputText id="updateDriverPhoneNumber" v-model="updateDriverForm.driverPhoneNumber" placeholder="Enter phone number" class="w-full" :class="{ 'p-invalid': updateDriverFormSubmitted && !updateDriverForm.driverPhoneNumber }" />
                    <small v-if="updateDriverFormSubmitted && !updateDriverForm.driverPhoneNumber" class="p-error">Phone number is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="updateDriverTruckPlate" class="font-semibold">Truck Plate No <span class="text-red-500">*</span></label>
                    <InputText id="updateDriverTruckPlate" v-model="updateDriverForm.driverTruckPlate" placeholder="Enter truck plate number" class="w-full" :class="{ 'p-invalid': updateDriverFormSubmitted && !updateDriverForm.driverTruckPlate }" />
                    <small v-if="updateDriverFormSubmitted && !updateDriverForm.driverTruckPlate" class="p-error">Truck plate number is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="updateDriverIC" class="font-semibold">IC Number</label>
                    <InputText id="updateDriverIC" v-model="updateDriverForm.driverIC" placeholder="Enter IC number (optional)" class="w-full" />
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" class="p-button-secondary" @click="cancelUpdateDriver" :disabled="loadingDriver" />
                    <Button label="Update" class="p-button-primary" @click="updateDriverInfo" :loading="loadingDriver" />
                </div>
            </div>
        </Dialog>

        <!-- Return Order Dialog -->
        <Dialog v-model:visible="showReturnOrderDialog" header="Return Order" modal :style="{ width: '70rem' }" :closable="false">
            <div class="flex flex-col gap-4">
                <div class="p-fluid">
                    <label for="returnReason" class="font-semibold">Return Reason <span class="text-red-500">*</span></label>
                    <Dropdown id="returnReason" v-model="returnReason" :options="returnReasons" optionLabel="name" optionValue="code" placeholder="Select return reason" class="w-full" :class="{ 'p-invalid': !returnReason && returnFormSubmitted }" />
                    <small v-if="!returnReason && returnFormSubmitted" class="p-error">Return reason is required.</small>
                </div>

                <div class="p-fluid">
                    <label for="remarks" class="font-semibold">Remarks</label>
                    <Textarea id="remarks" v-model="remarks" rows="3" placeholder="Enter any additional remarks" class="w-full" />
                </div>

                <div class="font-semibold">Select ZT02 Items to Return</div>
                <div class="text-sm text-gray-600 mb-2">💡 <strong>Note:</strong> When you select a ZT02 item, any related ZT3F items with the same sales program will be automatically handled by the system.</div>

                <DataTable :value="zt02Items" selectionMode="multiple" v-model:selection="selectedReturnItems" dataKey="materialid" class="rounded-table" @selection-change="onSelectionChange">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="itemno" header="Item No">
                        <template #body="{ data }">{{ formatItemNo(data.itemno) }}</template>
                    </Column>
                    <Column field="materialid" header="Material ID"></Column>
                    <Column field="materialdescription" header="Material Description"></Column>
                    <Column field="itemcategory" header="Item Category">
                        <template #body="{ data }">
                            <Tag :value="data.itemcategory" :severity="getCategorySeverity(data.itemcategory)" />
                        </template>
                    </Column>
                    <Column field="salesProgram_programID" header="Sales Program">
                        <template #body="{ data }">{{ data.salesProgram_programID || '-' }}</template>
                    </Column>
                    <Column field="qty" header="Available Qty">
                        <template #body="{ data }">{{ parseInt(data.remainingQty) }}</template>
                    </Column>
                    <Column header="Return Qty">
                        <template #body="{ data }">
                            <InputNumber
                                v-model="returnQuantities[data.materialid]"
                                :min="0"
                                :max="parseInt(data.qty)"
                                showButtons
                                class="w-full"
                                :disabled="!isItemSelected(data.materialid)"
                                :class="{ 'p-invalid': hasQuantityError(data.materialid) }"
                            />
                            <small v-if="hasQuantityError(data.materialid)" class="p-error">Quantity must be greater than 0</small>
                        </template>
                    </Column>
                    <Column field="unitprice" header="Unit Price">
                        <template #body="{ data }">RM {{ parseFloat(data.unitprice || 0).toFixed(2) }}</template>
                    </Column>
                </DataTable>

                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" class="p-button-secondary" @click="cancelReturnOrder" :disabled="loadingReturn" />
                    <Button label="Submit Return" class="p-button-primary" @click="submitReturnOrder" :loading="loadingReturn" />
                </div>
            </div>
        </Dialog>
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
const pickupDetail = ref({});
const orderItems = ref([]);
const loadingSAP = ref(false);
const loadingReturn = ref(false);
const showReturnOrderDialog = ref(false);
const returnReason = ref('');
const remarks = ref('');
const selectedReturnItems = ref([]);
const returnQuantities = ref({});
const returnFormSubmitted = ref(false);

// Driver form reactive data
const showAddDriverDialog = ref(false);
const loadingDriver = ref(false);
const driverFormSubmitted = ref(false);
const driverForm = ref({
    driverName: '',
    driverPhoneNumber: '',
    driverTruckPlate: '',
    driverIC: ''
});

// Add new reactive data for update driver dialog
const showUpdateDriverDialog = ref(false);
const updateDriverForm = ref({
    driverName: '',
    driverPhoneNumber: '',
    driverTruckPlate: '',
    driverIC: ''
});
const updateDriverFormSubmitted = ref(false);

// Return reasons
const returnReasons = ref([
    { code: 'Wrong DOM', name: 'Wrong DOM' },
    { code: 'Receive Wrong Item', name: 'Receive Wrong Item' },
    { code: 'Delivered to wrong address', name: 'Delivered to wrong address' }
]);

// Computed properties
const totalAmount = computed(() => {
    return orderItems.value.reduce((sum, item) => sum + parseFloat(item.totalamt || 0), 0);
});

const orderStatusText = computed(() => {
    return orderData.value.orderstatus === 1 ? 'Complete' : 'Pending';
});

const orderStatusSeverity = computed(() => {
    return orderData.value.orderstatus === 1 ? 'success' : 'warn';
});

const canReturnOrder = computed(() => {
    const hasRemainingItems = orderData.value.remaining_return_items && orderData.value.remaining_return_items.length > 0;
    return orderData.value.orderstatus === 1 && orderData.value.inv_no && hasRemainingItems;
});

// Filter only ZT02 items for return selection from remaining_return_items
const zt02Items = computed(() => {
    if (!orderData.value.remaining_return_items || orderData.value.remaining_return_items.length === 0) {
        return [];
    }
    return orderData.value.remaining_return_items.filter((item) => item.itemcategory === 'ZT02');
});

// Check if pickup info exists
const hasPickupInfo = computed(() => {
    return pickupDetail.value && pickupDetail.value.driverName;
});

// Formatting methods
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
    return itemNo.toString().padStart(6, '0');
};

// Address methods
const getFullAddress = (data) => {
    if (!data) return '-';
    const addressParts = [data.addressLine2, data.addressLine3, data.addressLine4, data.city, data.state, data.postcode].filter((part) => part && part.trim() !== '');
    return addressParts.join('') || '-';
};

const getCompanyName = (data) => {
    if (!data) return '-';
    return [data.companyName1, data.companyName2, data.companyName3, data.companyName4].filter(Boolean).join(', ') || '-';
};

// Item category methods
const mapItemCategory = (category) => {
    if (!category) return 'ZR02';
    const categoryMap = { ZT02: 'ZR02', ZT3F: 'ZR3F' };
    return categoryMap[category] || category;
};

const getCategorySeverity = (category) => {
    const severityMap = { ZT02: 'success', ZT3F: 'info', ZR02: 'success', ZR3F: 'info' };
    return severityMap[category] || 'warning';
};

// Return order selection logic
const isItemSelected = (materialId) => {
    return selectedReturnItems.value.some((item) => item.materialid === materialId);
};

const hasQuantityError = (materialId) => {
    return isItemSelected(materialId) && (!returnQuantities.value[materialId] || returnQuantities.value[materialId] <= 0);
};

const onSelectionChange = (event) => {
    const newlySelectedItems = event.value;
    selectedReturnItems.value = newlySelectedItems;
};

// Driver form methods
const cancelAddDriver = () => {
    showAddDriverDialog.value = false;
    resetDriverForm();
};

const resetDriverForm = () => {
    driverForm.value = {
        driverName: '',
        driverPhoneNumber: '',
        driverTruckPlate: '',
        driverIC: ''
    };
    driverFormSubmitted.value = false;
};

const submitDriverInfo = async () => {
    try {
        driverFormSubmitted.value = true;
        loadingDriver.value = true;

        // Validate required fields
        if (!driverForm.value.driverName || !driverForm.value.driverPhoneNumber || !driverForm.value.driverTruckPlate) {
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            loadingDriver.value = false;
            return;
        }

        const payload = new URLSearchParams();
        payload.append('driverName', driverForm.value.driverName);
        payload.append('driverPhoneNum', driverForm.value.driverPhoneNumber);
        payload.append('driverPlateNum', driverForm.value.driverTruckPlate);
        if (driverForm.value.driverIC) {
            payload.append('driverIC', driverForm.value.driverIC);
        } else {
            payload.append('driverIC', '');
        }

        const orderNo = route.params.orderNo;
        console.log('Submitting driver info for order:', orderNo);
        console.log('Driver payload:', Object.fromEntries(payload));

        const response = await api.postExtra(`order/driver-information/${orderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Driver info response:', response.data);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Driver information added successfully',
                life: 3000
            });
            showAddDriverDialog.value = false;
            resetDriverForm();
            // Refresh order details to show updated pickup info
            await fetchOrderDetail();
        } else {
            const errorMessage = response.data.error?.message || 'Failed to add driver information';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error adding driver info:', error);
        let errorMessage = 'Failed to add driver information';

        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loadingDriver.value = false;
    }
};

// Add methods for update driver functionality
const openUpdateDriverDialog = () => {
    showUpdateDriverDialog.value = true;
    // Prefill the form with existing driver data
    if (pickupDetail.value) {
        updateDriverForm.value = {
            driverName: pickupDetail.value.driverName || '',
            driverPhoneNumber: pickupDetail.value.driverPhoneNumber || '',
            driverTruckPlate: pickupDetail.value.driverTruckPlate || '',
            driverIC: pickupDetail.value.driverIC || ''
        };
    }
    updateDriverFormSubmitted.value = false;
};

const cancelUpdateDriver = () => {
    showUpdateDriverDialog.value = false;
    resetUpdateDriverForm();
};

const resetUpdateDriverForm = () => {
    updateDriverForm.value = {
        driverName: '',
        driverPhoneNumber: '',
        driverTruckPlate: '',
        driverIC: ''
    };
    updateDriverFormSubmitted.value = false;
};

const updateDriverInfo = async () => {
    try {
        updateDriverFormSubmitted.value = true;
        loadingDriver.value = true;

        // Validate required fields
        if (!updateDriverForm.value.driverName || !updateDriverForm.value.driverPhoneNumber || !updateDriverForm.value.driverTruckPlate) {
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            loadingDriver.value = false;
            return;
        }

        const payload = new URLSearchParams();
        payload.append('driverName', updateDriverForm.value.driverName);
        payload.append('driverPhoneNum', updateDriverForm.value.driverPhoneNumber);
        payload.append('driverPlateNum', updateDriverForm.value.driverTruckPlate);
        if (updateDriverForm.value.driverIC) {
            payload.append('driverIC', updateDriverForm.value.driverIC);
        } else {
            payload.append('driverIC', '');
        }

        const orderNo = route.params.orderNo;
        const pickupId = pickupDetail.value.id;

        console.log('Updating driver info for order:', orderNo, 'pickup ID:', pickupId);
        console.log('Update driver payload:', Object.fromEntries(payload));

        const response = await api.postExtra(`order/update-driver-information/${pickupId}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Update driver info response:', response.data);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Driver information updated successfully',
                life: 3000
            });
            showUpdateDriverDialog.value = false;
            resetUpdateDriverForm();
            // Refresh order details to show updated pickup info
            await fetchOrderDetail();
        } else {
            const errorMessage = response.data.error?.message || 'Failed to update driver information';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error updating driver info:', error);
        let errorMessage = 'Failed to update driver information';

        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loadingDriver.value = false;
    }
};

// Watch for selection changes
watch(
    selectedReturnItems,
    (newSelection) => {
        // Reset quantities for deselected items
        Object.keys(returnQuantities.value).forEach((materialId) => {
            if (!newSelection.some((item) => item.materialid === materialId)) {
                delete returnQuantities.value[materialId];
            }
        });

        // Initialize quantities for newly selected items
        newSelection.forEach((item) => {
            if (returnQuantities.value[item.materialid] === undefined) {
                returnQuantities.value[item.materialid] = parseInt(item.qty) || 0;
            }
        });
    },
    { deep: true }
);

// API Calls
const fetchOrderDetail = async () => {
    try {
        const orderNo = route.params.orderNo;
        console.log('Fetching order details for:', orderNo);
        const response = await api.get(`order/detail-order/${orderNo}`);
        console.log('Order detail response:', response.data);

        if (response.data.status === 1 && response.data.admin_data.length > 0) {
            const data = response.data.admin_data[0];
            orderData.value = data;

            // Process order items
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

            // Process customer info
            const etenInfo = data.etenInformation || {};
            customerInfo.value = {
                dealerName: etenInfo.companyName1 || '-',
                signboard: etenInfo.signboardBrand || '-',
                storageLocation: etenInfo.storageLocation || '-',
                contactPerson: etenInfo.companyName3 || '-',
                phoneNumber: etenInfo.phoneNumber || '-',
                mobileNumber: etenInfo.mobileNumber || '-',
                email: etenInfo.emailAddress || '-',
                // addressLine1: etenInfo.addressLine1,
                addressLine2: etenInfo.addressLine2,
                addressLine3: etenInfo.addressLine3,
                addressLine4: etenInfo.addressLine4,
                city: etenInfo.city,
                state: etenInfo.state,
                postcode: etenInfo.postcode
            };

            // Process shipping detail
            if (Array.isArray(data.shippingDetail) && data.shippingDetail.length > 0) {
                const validShippingDetails = data.shippingDetail.filter((item) => item !== null);
                shippingDetail.value = validShippingDetails.length > 0 ? validShippingDetails[0] : {};
            } else {
                shippingDetail.value = {};
            }

            // Process delivery info
            if (Array.isArray(data.scm_deliver_detail) && data.scm_deliver_detail.length > 0) {
                const validDeliveryDetails = data.scm_deliver_detail.filter((item) => item !== null);
                deliveryInfo.value = validDeliveryDetails.length > 0 ? validDeliveryDetails[0] : {};
            } else {
                deliveryInfo.value = {};
            }

            // Process pickup info
            if (Array.isArray(data.scm_pickup_detail) && data.scm_pickup_detail.length > 0) {
                const validPickupDetails = data.scm_pickup_detail.filter((item) => item !== null);
                pickupDetail.value = validPickupDetails.length > 0 ? validPickupDetails[0] : {};
            } else {
                pickupDetail.value = {};
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
        console.log('Pulling SAP update for order:', orderNo);
        const response = await api.get(`order/order-update/${orderNo}`);
        console.log('SAP update response:', response.data);

        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'SAP data updated successfully', life: 3000 });
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
        returnFormSubmitted.value = true;
        loadingReturn.value = true;

        // Validate return reason
        if (!returnReason.value) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a return reason', life: 3000 });
            loadingReturn.value = false;
            return;
        }

        // Validate selected items
        const returnItems = selectedReturnItems.value
            .filter((item) => {
                const quantity = returnQuantities.value[item.materialid];
                return quantity !== undefined && quantity > 0;
            })
            .map((item) => {
                const quantity = returnQuantities.value[item.materialid] || 0;
                // Find the original item from remaining_return_items to get accurate data
                const originalItem = orderData.value.remaining_return_items.find((remainingItem) => remainingItem.materialid === item.materialid);

                return {
                    materialid: item.materialid.trim(),
                    itemcategory: mapItemCategory(item.itemcategory),
                    qty: quantity.toString(),
                    salesdoclineitem: originalItem?.itemno ? originalItem.itemno.toString().replace('0000', '') : '',
                    plant: 'TSM',
                    materialdescription: item.materialdescription || '',
                    salesProgram_programID: item.salesProgram_programID || '',
                    unitprice: parseFloat(item.unitprice || 0).toFixed(2)
                };
            });

        if (returnItems.length === 0) {
            toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select items and set return quantities greater than 0', life: 3000 });
            loadingReturn.value = false;
            return;
        }

        // Validate that quantities don't exceed available quantities from remaining_return_items
        for (const returnItem of returnItems) {
            const originalItem = orderData.value.remaining_return_items.find((item) => item.materialid === returnItem.materialid);
            if (originalItem && parseFloat(returnItem.qty) > parseFloat(originalItem.qty)) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Return quantity for ${returnItem.materialid} exceeds available quantity`,
                    life: 3000
                });
                loadingReturn.value = false;
                return;
            }
        }

        const payload = new URLSearchParams();
        payload.append('returnReason', returnReason.value);
        payload.append('remarks', remarks.value);
        payload.append('order_array', JSON.stringify(returnItems));

        const orderNo = route.params.orderNo;
        console.log('Submitting return order for:', orderNo);
        console.log('Return payload:', {
            returnReason: returnReason.value,
            remarks: remarks.value,
            order_array: returnItems
        });

        const response = await api.postExtra(`order/create-return-order/${orderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Return order response:', response.data);

        if (response.data.status === 1) {
            const returnOrderNo = response.data.eten_data;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Return order created: ${returnOrderNo}`,
                life: 5000
            });
            showReturnOrderDialog.value = false;
            resetReturnForm();
            await fetchOrderDetail();
        } else {
            const errorMessage = response.data.error?.messageEnglish || response.data.messageEnglish || 'Failed to create return order';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error creating return order:', error);
        let errorMessage = 'Failed to create return order';

        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loadingReturn.value = false;
    }
};

const cancelReturnOrder = () => {
    showReturnOrderDialog.value = false;
    resetReturnForm();
};

const resetReturnForm = () => {
    returnReason.value = '';
    remarks.value = '';
    selectedReturnItems.value = [];
    returnQuantities.value = {};
    returnFormSubmitted.value = false;
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

.card {
    @apply bg-white shadow-sm rounded-2xl border border-gray-100 p-6;
}
</style>
