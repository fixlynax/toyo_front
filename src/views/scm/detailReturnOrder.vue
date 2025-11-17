<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                            <div class="text-2xl font-bold text-gray-800">Return Order Details</div>
                        </div>
                    </div>

                    <div class="mt-6 mb-4">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Return Reference Number</span>
                            <span class="text-lg font-medium">{{ returnList.return_orderNo_ref }}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Status</span>
                            <Tag :value="returnList.delivery_status" :severity="getStatusSeverity(returnList.delivery_status)" />
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Reason</span>
                            <p class="font-medium text-lg">{{ `(${returnList.reason_code}) ${returnList.reason_message}` }}</p>
                        </div>
                    </div>
                    <div class="mt-6 mb-4">
                        <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800"><span>Return Item</span></div>
                        <DataTable 
                            :value="returnList.return_order_array"
                            :rows="10"
                            dataKey=""
                            :rowHover="true">

                            <Column field="materialid" header="Material ID" style="min-width: 10rem">
                                <template #body="{ data }">
                                    {{ data?.materialid || '-' }}
                                </template>
                            </Column>
                            <Column field="itemcategory" header="Category" style="min-width: 12rem">
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
                            <Column field="unitprice" header="Unit Price (RM)" style="min-width: 8rem">
                                <template #body="{ data }">
                                        {{ data.unitprice }}
                                </template>
                                 <!-- ✅ Footer for label -->
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Subtotal</div>
                            </template>
                            </Column>
                            <Column field="unitprice" header="Total Price (RM)" style="min-width: 8rem">
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
                 <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Customer Details</div>
                        </div>
                    </div>
                    <div class="mt-6 mb-4">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Company Name</span>
                            <p class="font-medium text-lg">{{ `${returnList.dealer.dealer_shop.companyName1} ${returnList.dealer.dealer_shop.companyName2} ${returnList.dealer.dealer_shop.companyName3} ${returnList.dealer.dealer_shop?.companyName4}` }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Member Code</span>
                            <span class="text-lg font-medium">{{ returnList.dealer.dealer_shop.memberCode }}</span>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Reg No</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.companyRegNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Address</span>
                            <p class="font-medium text-lg">{{ `${returnList.dealer.dealer_shop.addressLine1} ${returnList.dealer.dealer_shop?.addressLine2 || ''} ${returnList.dealer.dealer_shop?.addressLine3 || ''} ${returnList.dealer.dealer_shop?.addressLine4 || ''} ${returnList.dealer.dealer_shop.city} ,${returnList.dealer.dealer_shop.postcode}` }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Contact Person</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.phoneNumber }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Storage</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.storageLocation }}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Information</div>
                        <Tag :value="returnList.delivery_status" :severity="getStatusSeverity(returnList.delivery_status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Ref</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.return_orderNo_ref || '-' }}</td>
                                </tr>
                                 <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Return No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.delivery_information?.sapreturndeliveryno ?? '-' }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">SAP Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(returnList.sap_timestamp) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Pickup Date</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.delivery_information?.pickup_datetime ? formatDate(returnList.delivery_information?.pickup_datetime) : 'No date assigned' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Date</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.delivery_information?.receive_datetime ? formatDate(returnList.delivery_information?.receive_datetime) : 'No date assigned' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="!loading && returnList && !returnList.delivery_information?.pickup_datetime && !returnList.delivery_information?.receive_datetime" class="flex justify-end mt-3">
                        <Button  
                            style="width: auto !important"
                            label="Update Date"
                            icon="pi pi-calendar"
                            class="p-button-sm p-button-warning"
                            @click="updateDialog = true"
                        />
                    </div>
                </div>
                <div class="card flex flex-col w-full">
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
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Subtotal</td>
                                    <td class="px-4 py-2 text-right">{{` RM ${returnList.order_data.subtotal || '-'} `}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
    <Dialog
        header="Update Return Date Details"
        v-model:visible="updateDialog"
        modal
        :style="{ width: '500px' }"
    >
        <input type="hidden" v-model="form.returnID" />
        <div class="flex flex-col gap-4">
            <Calendar
                v-model="form.scheduleDate"
                dateFormat="yy-mm-dd"
                placeholder="Select Schedule Date"
            />

            <Calendar
                v-model="form.deliveryDatetime"
                showTime
                hourFormat="24"
                placeholder="Select Delivery Datetime"
            />

            <div class="flex justify-end gap-2 mt-4">
                <Button label="Cancel" class="p-button-text" @click="updateDialog = false" />
                <Button label="Save" class="p-button-success" :loading="loadingUpdate" @click="saveReturnUpdate" />
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
    dealer_shop: {},
  },
  shiptoData: {},
  delivery_information: {},
  order_data: {},
});
const loading = ref(true);
function formatDate(dateString) {
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
const subtotal = computed(() => {
    const arr = returnList.value.return_order_array || [];
    return arr.reduce((sum, item) => sum + (Number(item.unitprice) * Number(item.qty)), 0);
});

const updateDialog = ref(false);
const loadingUpdate = ref(false);

const form = ref({
    returnID: 0,
    scheduleDate: '',
    deliveryDatetime: ''
});

const saveReturnUpdate = async () => {
    if (!form.value.scheduleDate && !form.value.deliveryDatetime) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a date', life: 3000 });
        return;
    }
    loadingUpdate.value = true;

    try {
        const payload = new FormData();
        payload.append('returnID', form.value.returnID);
        payload.append('scheduleDate', formatDateSubmit(form.value.scheduleDate));
        payload.append('deliveryDatetime', formatDatetimeSubmit(form.value.deliveryDatetime));

        const res = await api.post('return/updateReturn', payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Return Details updated successfully', life: 3000 });
            updateDialog.value = false;
            // optionally reload details
            await InitfetchData();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        loadingUpdate.value = false;
    }
};
const formatDateSubmit = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDatetimeSubmit = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};
const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`scm-return-order-detail/${id}`);
        if ( (response.data.admin_data)) {
            // response.data.status === 1 &&
            returnList.value = response.data.admin_data[0];
            form.value.returnID =returnList.value.id;
        } else {
            console.error('API returned error or invalid data:', response.data);
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
const handleExport = async () => {
 const idexport = Number(route.params.id);
    try {
        exportLoading.value = true;
            const response = await api.postExtra(
            'excel/exportsingle-scm-return-order-list',
        { id: idexport  },
        {
            responseType: 'blob',
            headers: {
            'Content-Type': 'application/json',
            }
        }
        );
        const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${returnList.value.return_orderNo_ref}_Order_Download.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
    } catch (error) {
        console.error('Error exporting data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    } finally {
        exportLoading.value = false;
    }
};
const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading.value = true;
        
        const formData = new FormData();
        formData.append('return_order_excel', file);
        
        const response = await api.postExtra('excel/importsingle-scm-return-order-list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });
        
        if (response.data.status === 1) {
            // Refresh data after import
            await InitfetchData();


            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File imported successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: response.data.admin_data.error_message || 'Server did not confirm success',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading.value = false;
        // Reset file input
        if (importInput.value) {
            importInput.value.value = '';
        }
    }
};
onMounted(() => {
    InitfetchData();
});

</script>
