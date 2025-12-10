<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/scm/listOrderPickup">
                            <Button icon="pi pi-arrow-left font-medium" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Order Pickup Details</div>
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
                                {{ orderDelList.eten_user?.addressLine1 }} {{ orderDelList.eten_user?.addressLine2 }} {{ orderDelList.eten_user?.addressLine3 }} {{ orderDelList.eten_user?.addressLine4 }}, {{ orderDelList.eten_user?.postcode }}
                                {{ orderDelList.eten_user?.city }} {{ orderDelList.eten_user?.state }}
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
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.storageLocation || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-black-700">City</span>
                            <p class="text-lg font-medium">{{ orderDelList.eten_user?.city || '-' }}</p>
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
                                    <td class="px-4 py-2 font-bold text-primary">Order No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.order_no || '-' }}</td>
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
                                    <td class="px-4 py-2 font-medium">Collector IC No</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList?.driverInformation?.collectorIC ? orderDelList.driverInformation.collectorIC : 'Not Assigned' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Pickup</td>
                                    <td class="px-4 py-2 text-right">{{ orderDelList.driverInformation?.pickup_datetime ? formatDate(orderDelList.driverInformation.pickup_datetime) : 'Not Assigned' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(orderDelList.created) || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- <div v-if="!orderDelList.driverInformation && canUpdate" class="flex justify-end mt-3">
                        <Button  
                            style="width: auto !important"
                            label="Update Collector Information"
                            icon="pi pi-pencil"
                            class="p-button-sm p-button-warning"
                            @click="confirmUpdatePickup(orderDelList)"
                        />
                    </div> -->
                    <div v-if="orderDelList.deliveryType != 'LALAMOVE' && !orderDelList?.driverInformation?.pickup_datetime && canUpdate" class="flex justify-end mt-3">
                        <Button style="width: auto !important" label="Update Pickup Date" icon="pi pi-calendar" class="p-button-sm p-button-warning" @click="promptUpdatePickup(orderDelList)" />
                    </div>
                    <div v-if="orderDelList.deliveryType == 'LALAMOVE' && !orderDelList?.driverInformation?.pickup_datetime && canUpdate" class="flex justify-end mt-3">
                        <Button style="width: auto !important" label="Update Pickup Date" icon="pi pi-calendar" class="p-button-sm p-button-warning" @click="confirmUpdatePickup2(orderDelList)" />
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3">
                        <div class="text-2xl font-bold text-gray-800">Pickup Detail</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Driver Name</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.driverInformation?.driverName ? orderDelList.driverInformation.driverName : 'Not Assigned' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">IC No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.driverInformation?.driverIC ? orderDelList.driverInformation.driverIC : 'Not Assigned' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Contact Number</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.driverInformation?.driverPhoneNumber ? orderDelList.driverInformation.driverPhoneNumber : 'Not Assigned' }}</td>
                                </tr>
                                <tr class="border-b even:bg-gray-50">
                                    <td class="px-4 py-2 font-medium">Truck Plate</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderDelList.driverInformation?.driverTruckPlate ? orderDelList.driverInformation.driverTruckPlate : 'Not Assigned' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
    <Dialog v-model:visible="showIcDialog" header="Update Collector information" modal :style="{ width: '50rem' }">
        <div class="flex flex-col gap-3 w-full">
            <div class="font-semibold">SAP DO No: {{ selectedData?.do_no }}</div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Collector IC Number</label>
                    <InputText v-model="form.driverIC" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Collector Driver Name</label>
                    <InputText v-model="form.driverName" placeholder="Enter Driver Name" class="w-full" />
                </div>
            </div>
            <div class="grid md:grid-cols-2 mb-2 gap-4">
                <div>
                    <label class="block mb-2 font-medium w-full">Collector Contact Number</label>
                    <InputText v-model="form.driverPhoneNum" placeholder="Enter Contact Number" maxlength="15" class="w-full" @keypress="allowOnlyNumbers" />
                </div>
                <div>
                    <label class="block mb-2 font-medium w-full">Collector Plate No</label>
                    <InputText v-model="form.driverPlateNum" placeholder="Enter Plate No" maxlength="8" class="w-full" />
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="handleCloseDialog" />
            <Button label="Confirm" @click="submitPickupUpdate" />
        </template>
    </Dialog>
    <Dialog v-model:visible="showIcDialog2" header="Pickup Confirmation" modal :style="{ width: '30rem' }">
        <div class="flex flex-col gap-3 w-full">
            <div>
                <label class="block mb-4 font-medium w-full">Please enter collector IC number to confirm</label>
                <InputText v-model="icNo" placeholder="Enter IC No" maxlength="12" class="w-full" @keypress="handleIcInput" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="handleCloseDialog2" />
            <Button label="Confirm" @click="submitPickupUpdate2" />
        </template>
    </Dialog>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfirm } from 'primevue';
import { useMenuStore } from '@/store/menu';

defineProps({
    id: {
        type: [String, Number],
        required: false
    }
});

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Order Pickup'));
const denyAccess = computed(() => menuStore.canTest('Order Pickup'));
const route = useRoute();
const router = useRouter();
const orderDelList = ref({});
const loading = ref(false);

const toast = useToast();
// const confirmation = useConfirm();

const showIcDialog = ref(false);
const showIcDialog2 = ref(false);
const confirmation = useConfirm();

const form = ref({
    driverIC: '',
    driverName: '',
    driverPhoneNum: '',
    driverPlateNum: ''
});
const icNo = ref('');
let selectedData = null;

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
const confirmUpdatePickup = (data) => {
    selectedData = data;
    form.value.driverIC = '';
    form.value.driverName = '';
    form.value.driverPhoneNum = '';
    form.value.driverPlateNum = '';
    showIcDialog.value = true;
};

const handleCloseDialog = () => {
    form.value.driverIC = '';
    form.value.driverName = '';
    form.value.driverPhoneNum = '';
    form.value.driverPlateNum = '';
    selectedData = null;
    showIcDialog.value = false;
};

const submitPickupUpdate = async () => {
    if (!form.value.driverIC || form.value.driverIC.length !== 12) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid IC No',
            detail: 'IC Number must be exactly 12 digits.',
            life: 3000
        });
        return;
    }
    try {
        const payload = new FormData();
        // payload.append('orderno', selectedData.order_no);
        payload.append('driverIC', form.value.driverIC);
        payload.append('driverName', form.value.driverName);
        payload.append('driverPhoneNum', form.value.driverPhoneNum);
        payload.append('driverPlateNum', form.value.driverPlateNum);
        // return;
        const res = await api.post(`order/driver-information-scm/${selectedData.order_no}`, payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date collecter information updated', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        handleCloseDialog();
    }
};

const confirmUpdatePickup2 = (data) => {
    selectedData = data;
    icNo.value = '';
    showIcDialog2.value = true;
};

const handleCloseDialog2 = () => {
    icNo.value = '';
    selectedData = null;
    showIcDialog2.value = false;
};

const submitPickupUpdate2 = async () => {
    if (!icNo.value || icNo.value.length !== 12) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid IC No',
            detail: 'IC Number must be exactly 12 digits.',
            life: 3000
        });
        return;
    }
    try {
        const payload = new FormData();
        payload.append('orderno', selectedData.order_no);
        payload.append('collectoric', icNo.value);

        const res = await api.post('update-collect-time', payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date set to now', life: 3000 });
            InitfetchData(); // refresh table
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        handleCloseDialog2();
    }
};
const promptUpdatePickup = (data) => {
    confirmation.require({
        message: `Are you sure you want to confirm pickup for order ${data.order_no} ?`,
        header: 'Pickup Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: async () => {
            try {
                const payload = new FormData();
                payload.append('orderno', data.order_no);

                const res = await api.post('update-collect-time', payload);

                if (res.data?.status === 1) {
                    toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date set to now', life: 3000 });
                    InitfetchData(); // refresh table
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
                }
            } catch (err) {
                console.error(err);
                toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
            }
        },
        reject: () => {
            // optional action on cancel
        }
    });
};
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
        PENDING: 'Pending',
        // "PENDING": 'Delivery',
        COMPLETED: 'Completed'
    };
    return statusMap[status] || `Status: ${status}`;
};
const getOrderStatusSeverity2 = (status) => {
    const severityMap = {
        PENDING: 'info',
        // "PENDING": 'warn',
        COMPLETED: 'success'
    };
    return severityMap[status] || 'secondary';
};

const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`order-pickup/detail/${id}`);
        if (response.data.admin_data) {
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
