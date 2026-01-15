<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-2">
                            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                            <div class="text-2xl font-bold text-gray-800">Return Order Collection Details</div>
                        </div>
                    </div>
                    <div class="font-bold text-xl border-b pb-2 mt-2">Customer Details</div>

                    <div class="grid grid-cols-1 md:grid-cols-2 mt-6 mb-4">
                        <div>
                            <span class="block text-sm text-black-700">Company Name</span>
                            <p class="font-medium text-lg">{{ `${returnList.dealer.dealer_shop.companyName1 || '-'} ${returnList.dealer.dealer_shop.companyName2 || ''}` }}</p>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Account Number</span>
                            <span class="text-lg font-medium">{{ returnList.dealer.dealer_shop.custAccountNo }}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-sm text-black-700">Member Code</span>
                            <span class="text-lg font-medium">{{ returnList.dealer.dealer_shop.memberCode }}</span>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Reg No</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.companyRegNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Address</span>
                            <p class="font-medium text-lg">
                                {{
                                    `${returnList.dealer.dealer_shop?.addressLine2 || ''} ${returnList.dealer.dealer_shop?.addressLine3 || ''} ${returnList.dealer.dealer_shop?.addressLine4 || ''} ${returnList.dealer.dealer_shop.city} ,${returnList.dealer.dealer_shop.postcode}`
                                }}
                            </p>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Contact Person</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.phoneNumber }}</p>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Storage</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.storageLocation }}</p>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">City</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.city }}</p>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Return Order Item</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4 mt-4">
                        <div>
                            <span class="block text-sm text-black-700">Return Ref No.</span>
                            <span class="text-lg font-medium">{{ returnList.return_orderNo_ref }}</span>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">SAP Return No.</span>
                            <span class="text-lg font-medium">{{ returnList.sapreturnno ?? '-' }}</span>
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Return Delivery No.</span>
                            <p class="text-lg font-medium">{{ returnList.delivery_information?.sapreturndeliveryno || '-' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-sm text-black-700">Status</span>
                            <Tag :value="returnList.delivery_status" :severity="getStatusSeverity(returnList.delivery_status)" />
                        </div>
                        <div>
                            <span class="block text-sm text-black-700">Reason</span>
                            <p class="font-medium text-lg">{{ `(${returnList.reason_code}) ${returnList.reason_message}` }}</p>
                        </div>
                    </div>
                    <div class="mt-6 mb-4">
                        <!-- <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800 mb-4"><span>Return Order Item</span></div> -->
                        <DataTable :value="returnList.return_order_array" :rows="10" dataKey="" :rowHover="true" class="rounded-table">
                            <Column field="materialid" header="Material ID" style="min-width: 10rem">
                                <template #body="{ data }">
                                    {{ data?.materialid || '-' }}
                                </template>
                            </Column>
                            <Column field="materialdescription" header="Description" style="min-width: 10rem">
                                <template #body="{ data }">
                                    {{ data?.materialdescription || '-' }}
                                </template>
                            </Column>
                            <Column field="itemcategory" header="Item Category" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.itemcategory }}
                                </template>
                            </Column>
                            <Column field="plant" header="Plant" style="min-width: 8rem">
                                <template #body="{ data }">
                                    {{ data.plant }}
                                </template>
                            </Column>
                            <Column field="quantity" header="Quantity" style="min-width: 8rem">
                                <template #body="{ data }">
                                    {{ data.qty }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 ">
                        <div class="text-2xl font-bold text-gray-800">Order Info</div>
                        <Tag :value="returnList.delivery_status" :severity="getStatusSeverity(returnList.delivery_status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ returnList.order_data.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Remark</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ returnList.remarks || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Type</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ returnList?.order_data?.orderDesc ? (returnList.order_data.orderDesc === 'Back Order' ? 'NORMAL' : returnList.order_data.orderDesc.toUpperCase()) : '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data?.do_no ?? '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Inv No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.inv_no || '-' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">SAP Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDateTime(returnList.sap_timestamp) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Pickup Date</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.delivery_information?.pickup_datetime ? formatDate(returnList.delivery_information?.pickup_datetime) : 'No date assigned' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Received Date</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.delivery_information?.receive_datetime ? formatDate(returnList.delivery_information?.receive_datetime) : 'No date assigned' }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="returnList.delivery_status == 'NEW' && canUpdate" class="flex justify-end mt-3">
                            <Button style="width: auto !important" label="Update Pickup Date" icon="pi pi-calendar" class="p-button-warning p-button-sm" @click="openDialog = true" />
                        </div>
                        <div v-if="returnList.delivery_status == 'PENDING' && canUpdate" class="flex justify-end mt-3">
                            <Button style="width: auto !important" label="Update Received Date" icon="pi pi-calendar" class="p-button-sm p-button-warning" @click="openDialog2 = true" />
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="flex items-center gap-2 border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Driver Details</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 mt-6 mb-4">
                        <div>
                            <span class="text-sm font-bold text-black-700">Driver</span>
                            <p lass="text-lg font-medium">{{ returnList.delivery_information?.driverName ? returnList.delivery_information.driverName : 'Not Assigned' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-black-700">Contact No</span>
                            <p lass="text-lg font-medium">{{ returnList.delivery_information?.driverContactNo ? returnList.delivery_information.driverContactNo : 'Not Assigned' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-black-700">IC No</span>
                            <p lass="text-lg font-medium">{{ returnList.delivery_information?.driverIC ? returnList.delivery_information.driverIC : 'Not Assigned' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-black-700">Plate No</span>
                            <p lass="text-lg font-medium">{{ returnList.delivery_information?.driverPlateNo ? returnList.delivery_information.driverPlateNo : 'Not Assigned' }}</p>
                        </div>
                    </div>
                </div>
                <!-- <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Order Information</div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Inv No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Type</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Description</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.orderDesc || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Remarks</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.orderReceiveRemarks || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data.so_no || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> -->
            </div>
        </div>
    </Fluid>
    <Dialog header="Update Pickup Date" v-model:visible="openDialog" modal :style="{ width: '500px' }" :closable="!loadingUpdate">
        <div class="flex flex-col gap-3">
            <!-- Schedule Date -->
            <Calendar v-model="form.pickupdate" dateFormat="yy-mm-dd" placeholder="Select Pickup Date" :minDate="new Date()" />
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Driver IC Number</label>
                    <InputText v-model="form.driverIC" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Name</label>
                    <InputText v-model="form.driverName" placeholder="Enter Driver Name" class="w-full" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Contact Number (Optional)</label>
                    <InputText v-model="form.driverPhoneNum" placeholder="Enter Contact Number" maxlength="15" class="w-full" @keypress="allowOnlyNumbers" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Plate No</label>
                    <InputText v-model="form.driverPlateNum" placeholder="Enter Plate No" maxlength="8" class="w-full" />
                </div>
            </div>
            <!-- Actions -->
            <div class="flex justify-end gap-2 mt-3">
                <Button label="Cancel" class="p-button-text" :loading="loadingUpdate" @click="openDialog = false" />
                <Button label="Save" class="p-button-success" :loading="loadingUpdate" @click="savePickup" />
            </div>
        </div>
    </Dialog>

    <Dialog header="Update Received Date" v-model:visible="openDialog2" modal :style="{ width: '400px' }" :closable="!loadingUpdate2">
        <div class="flex flex-col gap-3">
            <Calendar v-model="form2.receivedate" dateFormat="yy-mm-dd" placeholder="Select Received Date" :maxDate="new Date()" />

            <div class="flex justify-end gap-2 mt-3">
                <Button label="Cancel" class="p-button-text" :loading="loadingUpdate2" @click="openDialog2 = false" />
                <Button label="Save" class="p-button-success" :loading="loadingUpdate2" @click="saveRecieve" />
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import api from '@/service/api';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Return Order Collection'));
const denyAccess = computed(() => menuStore.canTest('Return Order Collection'));
const openDialog = ref(false);
const openDialog2 = ref(false);
const loadingUpdate = ref(false);
const loadingUpdate2 = ref(false);

defineProps({
    id: {
        type: [String, Number],
        required: true
    }
});
const toast = useToast();
const exportLoading = ref(false);
const importLoading = ref(false);
const route = useRoute();
const router = useRouter();
const importInput = ref();
const returnList = ref({
    dealer: {
        dealer_shop: {}
    },
    shiptoData: {},
    delivery_information: {},
    order_data: {}
});
const loading = ref(true);
const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    let formatted = date.toLocaleString('en-MY', options);
    
    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
const handleIcInput = (e) => {
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // ⛔ block non-digits
    }
};
const allowOnlyNumbers = (event) => {
    const key = event.key;

    // allow digits
    if (/[0-9]/.test(key)) return;

    // allow "-"
    if (key === '-') return;

    // block everything else
    event.preventDefault();
};
// Form
const form = ref({
    returnorderno: null,
    pickupdate: null,
    driverIC: '',
    driverName: '',
    driverPhoneNum: '',
    driverPlateNum: ''
    //   scheduleTime: null
});

const form2 = ref({
    returnorderno: null,
    receivedate: null
    //   deliverytime: null
});

// Save function
const savePickup = async () => {
    if (!form.value.pickupdate) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
        return;
    }
    if (!form.value.driverName || !form.value.driverPlateNum || !form.value.driverIC) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please input driver name, IC No and plate number', life: 3000 });
        return;
    }
    loadingUpdate.value = true;

    try {
        const payload = {
            returnorderno: form.value.returnorderno,
            pickupdate: formatDateApi(form.value.pickupdate),
            drivername: form.value.driverName,
            drivercontactnum: form.value.driverPhoneNum,
            drivervehicleplate: form.value.driverPlateNum,
            driveric: form.value.driverIC,
        };

        const res = await api.post('update-pickup-return-order', payload);
        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date information updated', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.error || 'Failed to updated pickup information', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: res.data?.error || 'Failed to updated pickup information', life: 3000 });
    } finally {
        openDialog.value = false;
        loadingUpdate.value = false;
    }
};

// Save function
const saveRecieve = async () => {
    if (!form2.value.receivedate) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
        return;
    }
    loadingUpdate2.value = true;

    try {
        const payload = {
            returnorderno: form2.value.returnorderno,
            receivedate: formatDateApi(form2.value.receivedate)
            //   deliveredtime: formatTimeApi(form2.value.deliverytime)
        };
        const res = await api.post('update-receive-return-order', payload);
        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Received date information updated', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.admin_data[0].sap_error.error_message || 'Failed to update received information', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: res.data?.admin_data[0].sap_error.error_message || 'Failed to update received information', life: 3000 });
    } finally {
        openDialog2.value = false;
        loadingUpdate2.value = false;
    }
};
// Helpers
const formatDateApi = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`scm-return-order-detail/${id}`);
        if (response.data.admin_data) {
            // response.data.status === 1 &&
            returnList.value = response.data.admin_data[0];
            form.value.returnorderno = returnList.value.return_orderNo_ref;
            form2.value.returnorderno = returnList.value.return_orderNo_ref;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        tyres.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

function getStatusSeverity(status) {
    switch (status) {
        case 'PENDING':
            return 'warn';
        case 'COMPLETED':
            return 'success';
        case 'NEW':
            return 'info';
        default:
            return 'secondary';
    }
}
onMounted(() => {
    InitfetchData();
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
