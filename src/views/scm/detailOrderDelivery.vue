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

                    <div class="font-bold text-xl border-b pb-2 mt-2">Customer Details</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-medium text-black-700">Customer Name</span>
                            <p class="text-lg font-medium">
                                {{ orderDelList.eten_user?.companyName1 || '-' }} {{ orderDelList.eten_user?.companyName2 || '' }} {{ orderDelList.eten_user?.companyName3 || '' }} {{ orderDelList.eten_user?.companyName4 || '' }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">Account Number</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.custAccountNo || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">Member Code</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.memberCode || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">Location</span>
                            <p class="text-lg font-medium">
                                {{ orderDelList.eten_user?.addressLine2 || '' }} {{ orderDelList.eten_user?.addressLine3 || '' }} {{ orderDelList.eten_user?.addressLine4 || '' }},
                                {{ orderDelList.eten_user?.postcode || '' }} {{ orderDelList.eten_user?.city || '' }} {{ orderDelList.eten_user?.state || '' }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">Contact Person</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.phoneNumber || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">Channel</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.channel || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">Storage Location</span>
                            <p class="text-lg font-medium">{{ orderDelList.storagelocation || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">City</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.city.replace(/,$/, '') || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <!-- Header -->
                    <div class="font-bold text-xl border-b pb-2 mt-2">Order Item</div>
                    <!-- Table -->
                    <DataTable :value="orderDelList.fullfill_order_array" dataKey="materialid" class="rounded-table mt-6">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">
                                {{ formatItemNo(data.salesprogramid || data.itemno) }}
                            </template>
                        </Column>

                        <Column field="materialid" header="Material ID">
                            <template #body="{ data }">
                                {{ data.materialid }}
                            </template>
                        </Column>
                        <Column field="materialdescription" header="Description">
                            <template #body="{ data }">
                                {{ data.materialdescription }}
                            </template>
                        </Column>

                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory }}
                            </template>
                        </Column>

                        <Column field="qty" header="Quantity" class="text-right">
                            <template #body="{ data }">
                                {{ parseFloat(data.qty) }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="getOrderStatusText2(orderDelList.status)" :severity="getOrderStatusSeverity2(orderDelList.status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderDelList.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Remark</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderDelList.order_remarks || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderDelList.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Description</td>
                                    <td class="px-4 py-2 text-right font-medium">{{ orderDelList.orderDesc || '-' }}</td>
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
                                    <td class="px-4 py-2 font-medium">ETA Date</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.deliveryDate ? formatDate(orderDelList.deliveryDate) : 'Not Assigned' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Planned Date</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList?.scm_deliver_detail?.scheduled_delivery_time ? formatDate(orderDelList.scm_deliver_detail.scheduled_delivery_time) : 'Not Assigned' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivered Date</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList?.scm_deliver_detail?.delivered_datetime ? formatDate(orderDelList.scm_deliver_detail.delivered_datetime) : 'Not Assigned' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(orderDelList.created) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="!loading && orderDelList && !orderDelList?.scm_deliver_detail?.scheduled_delivery_time && !orderDelList?.scm_deliver_detail?.delivered_datetime && canUpdate" class="flex justify-end mt-3">
                        <Button style="width: auto !important" label="Update Planned Date" icon="pi pi-calendar" class="p-button-sm p-button-warning" @click="openDialogFn()" />
                    </div>
                    <div v-if="!loading && orderDelList && orderDelList?.scm_deliver_detail?.scheduled_delivery_time && !orderDelList?.scm_deliver_detail?.delivered_datetime && canUpdate" class="flex justify-end mt-3">
                        <Button style="width: auto !important" label="Update Delivered Date" icon="pi pi-calendar" class="p-button-sm p-button-warning" @click="openDialog2 = true" />
                    </div>
                </div>
                <div class="card flex flex-col w-full" v-if="orderDelList?.scm_deliver_detail?.scheduled_delivery_time">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Driver Information</div>
                        <div v-if="!loading && orderDelList && orderDelList?.scm_deliver_detail?.scheduled_delivery_time && !orderDelList?.scm_deliver_detail?.delivered_datetime && canUpdate" class="flex justify-end mt-3">
                            <Button style="width: auto !important" label="Update Information" icon="pi pi-pencil" class="p-button-sm p-button-warning" @click="openDialogFn2()" />
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-bold">Driver Name</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.scm_deliver_detail?.driverName || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-bold">Driver Contact</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.scm_deliver_detail?.driverContactNo || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-bold">Driver Ic</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.scm_deliver_detail?.driverIC || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-bold">Driver Truck Plate No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.scm_deliver_detail?.driverPlateNo || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Shipping Info</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Name</td>
                                    <td class="px-4 py-2 text-right font-semibold"> {{ orderDelList.shipto_data?.companyName1 || '-' }} {{ orderDelList.shipto_data?.companyName2 || '' }} {{ orderDelList.shipto_data?.companyName3 || '' }} {{ orderDelList.shipto_data?.companyName4 || '' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Company Account No.</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.shipto_data?.custAccountNo || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Address</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.shipto_data?.addressLine2 || '' }} {{ orderDelList.shipto_data?.addressLine3 || '' }} {{ orderDelList.shipto_data?.addressLine4 || '' }},
                                {{ orderDelList.shipto_data?.postcode || '' }} {{ orderDelList.shipto_data?.city || '' }} {{ orderDelList.shipto_data?.state || '' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Phone No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.shipto_data?.phoneNumber || '-' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Email</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.shipto_data?.emailAddress || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>

    <Dialog header="Update Planned Information" v-model:visible="openDialog" modal :style="{ width: '50rem' }">
        <div class="flex flex-col gap-3">
            <!-- Schedule Date -->
            <Calendar v-model="form.scheduleDate" dateFormat="yy-mm-dd" placeholder="Select Planned Date" :minDate="new Date()" />
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Driver IC Number</label>
                    <InputText v-model="form.driveric" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Name</label>
                    <InputText v-model="form.drivername" placeholder="Enter Driver Name" class="w-full" />
                </div>
            </div>
            <div class="grid md:grid-cols-2 mb-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Contact Number (Optional)</label>
                    <InputText v-model="form.drivercontactnum" placeholder="Enter Contact Number" maxlength="15" class="w-full" @keypress="allowOnlyNumbers" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Plate No</label>
                    <InputText v-model="form.drivervehicleplate" placeholder="Enter Plate No" maxlength="8" class="w-full" />
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 mt-3">
                <Button label="Cancel" class="p-button-text" @click="openDialog = false" />
                <Button label="Save" class="p-button-success" :loading="loadingUpdate" @click="saveSchedule" />
            </div>
        </div>
    </Dialog>

    <Dialog header="Update Delivered Date" v-model:visible="openDialog2" modal :style="{ width: '400px' }">
        <div class="flex flex-col gap-3">
            <Calendar v-model="form2.delivereddate" dateFormat="yy-mm-dd" placeholder="Select Delivered Date" :maxDate="new Date()" />

            <!-- <Calendar
          v-model="form2.deliverytime"
          showTime
          hourFormat="24"
          timeOnly
          placeholder="Select Schedule Time"
        /> -->

            <div class="flex justify-end gap-2 mt-3">
                <Button label="Cancel" class="p-button-text" @click="openDialog2 = false" />
                <Button label="Save" class="p-button-success" :loading="loadingUpdate2" @click="saveDelivered" />
            </div>
        </div>
    </Dialog>
    <Dialog header="Update Planned Information" v-model:visible="openDialog3" modal :style="{ width: '50rem' }">
        <div class="flex flex-col gap-3">
            <!-- Schedule Date -->
            <Calendar v-model="form3.scheduleDate" dateFormat="yy-mm-dd" placeholder="Select Planned Date" :minDate="new Date()" />
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Driver IC Number</label>
                    <InputText v-model="form3.driveric" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Name</label>
                    <InputText v-model="form3.drivername" placeholder="Enter Driver Name" class="w-full" />
                </div>
            </div>
            <div class="grid md:grid-cols-2 mb-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Contact Number (Optional)</label>
                    <InputText v-model="form3.drivercontactnum" placeholder="Enter Contact Number" maxlength="15" class="w-full" @keypress="allowOnlyNumbers" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Driver Plate No</label>
                    <InputText v-model="form3.drivervehicleplate" placeholder="Enter Plate No" maxlength="8" class="w-full" />
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 mt-3">
                <Button label="Cancel" class="p-button-text" @click="openDialog3 = false" />
                <Button label="Save" class="p-button-success" :loading="loadingUpdate3" @click="saveSchedule3" />
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Order Delivery'));
const denyAccess = computed(() => menuStore.canTest('Order Delivery'));

defineProps({
    id: {
        type: [String, Number],
        required: true
    }
});
const toast = useToast();
const route = useRoute();
const router = useRouter();
const orderDelList = ref({});
const loading = ref(false);

const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(2, '0');
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
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
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

const getOrderStatusText2 = (status) => {
    const statusMap = {
        NEW: 'Pending',
        PENDING: 'Delivery',
        COMPLETED: 'Completed'
    };
    return statusMap[status] || `Status: ${status}`;
};
const getOrderStatusSeverity2 = (status) => {
    const severityMap = {
        NEW: 'info',
        PENDING: 'warn',
        COMPLETED: 'success'
    };
    return severityMap[status] || 'secondary';
};
// Dialog state
const openDialog = ref(false);
const openDialog2 = ref(false);
const loadingUpdate = ref(false);
const loadingUpdate2 = ref(false);
const loadingUpdate3 = ref(false);
const openDialog3 = ref(false);
const openDialogFn = () => {
    if (orderDelList.value.deliveryDate) {
        form.value.scheduleDate = new Date(orderDelList.value.deliveryDate);
    } else {
        form.value.scheduleDate = new Date(); // default to today
    }
    form.value.drivername = '';
    form.value.drivercontactnum = '';
    form.value.drivervehicleplate = '';
    form.value.driveric = '';
    openDialog.value = true;
};

const openDialogFn2 = () => {
    if (orderDelList.value.deliveryDate) {
        form3.value.scheduleDate = new Date(orderDelList.value.scm_deliver_detail?.scheduled_delivery_time);
        form3.value.drivername = orderDelList.value.scm_deliver_detail?.driverName;
        form3.value.drivercontactnum = orderDelList.value.scm_deliver_detail?.driverContactNo;
        form3.value.drivervehicleplate = orderDelList.value.scm_deliver_detail?.driverPlateNo;
        form3.value.driveric = orderDelList.value.scm_deliver_detail?.driverIC;
    } else {
        form3.value.scheduleDate = new Date(); // default to today
    }
    openDialog3.value = true;
};
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
    orderno: '',
    scheduleDate: null,
    drivername: '',
    drivercontactnum: '',
    drivervehicleplate: '',
    driveric: ''
    //   scheduleTime: null
});
const form3 = ref({
    orderno: '',
    scheduleDate: null,
    drivername: '',
    drivercontactnum: '',
    drivervehicleplate: '',
    driveric: ''
});

const form2 = ref({
    orderno: null,
    delivereddate: null
    //   deliverytime: null
});

// Save function
const saveSchedule = async () => {
    if (!form.value.scheduleDate) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
        return;
    }
    if (!form.value.drivername || !form.value.drivervehicleplate || !form.value.driveric) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please fullfill driver information', life: 3000 });
        return;
    }

    try {
        const payload = {
            orderno: form.value.orderno,
            scheduledate: formatDateApi(form.value.scheduleDate),
            drivername: form.value.drivername,
            drivercontactnum: form.value.drivercontactnum,
            drivervehicleplate: form.value.drivervehicleplate,
            driveric: form.value.driveric
            //   scheduletime: formatTimeApi(form.value.scheduleTime)
        };
        const res = await api.post('update-schedule-order', payload);
        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Planned date updated successfully', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.error || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        form.value.scheduleDate = null;
        form.value.drivername = '';
        form.value.drivercontactnum = '';
        form.value.drivervehicleplate = '';
        form.value.driveric = '';
        openDialog.value = false;
    }
};
const saveSchedule3 = async () => {
    if (!form3.value.scheduleDate) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
        return;
    }
    if (!form3.value.drivername || !form3.value.drivervehicleplate || !form3.value.driveric) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please fullfill driver information', life: 3000 });
        return;
    }

    loadingUpdate3.value = true;
    try {
        const payload = {
            orderno: form3.value.orderno,
            scheduledate: formatDateApi(form3.value.scheduleDate),
            drivername: form3.value.drivername,
            drivercontactnum: form3.value.drivercontactnum,
            drivervehicleplate: form3.value.drivervehicleplate,
            driveric: form3.value.driveric
            //   scheduletime: formatTimeApi(form.value.scheduleTime)
        };
        const res = await api.post('update-schedule-order', payload);
        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Planned date details updated successfully', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.error || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        loadingUpdate3.value = false;
        form3.value.scheduleDate = null;
        form3.value.drivername = '';
        form3.value.drivercontactnum = '';
        form3.value.drivervehicleplate = '';
        form3.value.driveric = '';
        openDialog3.value = false;
    }
};
// Save function
const saveDelivered = async () => {
    if (!form2.value.delivereddate) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
        return;
    }

    try {
        const payload = {
            orderno: form2.value.orderno,
            delivereddate: formatDateApi(form2.value.delivereddate)
            //   deliveredtime: formatTimeApi(form2.value.deliverytime)
        };
        const res = await api.post('update-delivered-order', payload);
        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Delivered date updated successfully', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.error || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        openDialog2.value = false;
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
        const response = await api.get(`order-delivery/detail/${id}`);
        if (response.data.admin_data) {
            orderDelList.value = response.data.admin_data;
            form.value.orderno = orderDelList.value.order_no;
            form2.value.orderno = orderDelList.value.order_no;
            form3.value.orderno = orderDelList.value.order_no;
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
