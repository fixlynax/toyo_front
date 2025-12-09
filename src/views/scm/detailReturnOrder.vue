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
                            <span class="block text-sm text-black-700">Return Reference Number</span>
                            <span class="text-lg font-medium">{{ returnList.return_orderNo_ref }}</span>
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
                            <Column field="materialdescription" header="Description" style="min-width: 10rem">
                                <template #body="{ data }">
                                    {{ data?.materialdescription || '-' }}
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
                        </DataTable>
                    </div>
                </div>
                 <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Customer Details</div>
                        </div>
                    </div>
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
                            <p class="font-medium text-lg">{{ `${returnList.dealer.dealer_shop.addressLine1} ${returnList.dealer.dealer_shop?.addressLine2 || ''} ${returnList.dealer.dealer_shop?.addressLine3 || ''} ${returnList.dealer.dealer_shop?.addressLine4 || ''} ${returnList.dealer.dealer_shop.city} ,${returnList.dealer.dealer_shop.postcode}` }}</p>
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
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.order_data?.do_no ?? '-' }}</td>
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
                                    <td class="px-4 py-2 font-medium">Recieve Date</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.delivery_information?.receive_datetime ? formatDate(returnList.delivery_information?.receive_datetime) : 'No date assigned' }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="(returnList.delivery_status == 'NEW') && canUpdate" class="flex justify-end mt-3">
                        <Button 
                        style="width: auto !important"
                            label="Update Pickup Date" 
                            icon="pi pi-calendar"
                            class="p-button-warning p-button-sm"
                            @click="openDialog = true"
                        />
                        </div>
                        <div v-if="(returnList.delivery_status == 'PENDING') && canUpdate" class="flex justify-end mt-3">
                        <Button  
                            style="width: auto !important"
                            label="Update Recieve Date"
                            icon="pi pi-calendar"
                            class="p-button-sm p-button-warning"
                            @click="openDialog2  = true"
                        />
                        </div>
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
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Subtotal</td>
                                    <td class="px-4 py-2 text-right">{{` RM ${returnList.order_data.subtotal || '-'} `}}</td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
    <Dialog
      header="Update Pickup Date"
      v-model:visible="openDialog"
      modal
      :style="{ width: '400px' }"
      :closable="!loadingUpdate" 
    >
      <div class="flex flex-col gap-3">
        <!-- Schedule Date -->
        <Calendar
          v-model="form.pickupdate"
          dateFormat="yy-mm-dd"
          placeholder="Select Pickup Date"
          :minDate="new Date()"
        />

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-3">
          <Button label="Cancel" class="p-button-text" :loading="loadingUpdate"  @click="openDialog = false" />
          <Button label="Save" class="p-button-success" :loading="loadingUpdate" @click="savePickup" />
        </div>
      </div>
    </Dialog>

    <Dialog
      header="Update Recieve Date"
      v-model:visible="openDialog2"
      modal
      :style="{ width: '400px' }"
      :closable="!loadingUpdate2" 
    >
      <div class="flex flex-col gap-3">

        <Calendar
          v-model="form2.receivedate"
          dateFormat="yy-mm-dd"
          placeholder="Select Recieve Date"
          :maxDate="new Date()"
        />

        <div class="flex justify-end gap-2 mt-3">
          <Button label="Cancel" class="p-button-text" :loading="loadingUpdate2"  @click="openDialog2 = false" />
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
    dealer_shop: {},
  },
  shiptoData: {},
  delivery_information: {},
  order_data: {},
});
const loading = ref(true);
function formatDateTime(dateString) {
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
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}


// Form
const form = ref({
  returnorderno: null, 
  pickupdate: null,      
//   scheduleTime: null      
});

const form2 = ref({
  returnorderno: null, 
  receivedate: null,      
//   deliverytime: null      
});

// Save function
const savePickup = async () => {

  if (!form.value.pickupdate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
    return;
  }
    loadingUpdate.value = true;

  try {
    const payload = {
      returnorderno: form.value.returnorderno,
      pickupdate: formatDateApi(form.value.pickupdate),
    //   scheduletime: formatTimeApi(form.value.scheduleTime)
    };
    const res = await api.post('update-pickup-return-order', payload);
    if (res.data?.status === 1) {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date updated successfully', life: 3000 });
        InitfetchData(); // refresh table
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: res.data?.error || 'Failed', life: 3000 });
    }
    } catch (err) {
    console.error(err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    }finally{
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
      receivedate: formatDateApi(form2.value.receivedate),
    //   deliveredtime: formatTimeApi(form2.value.deliverytime)
    };
    const res = await api.post('update-receive-return-order', payload);
    if (res.data?.status === 1) {
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Recieve date updated successfully', life: 3000 });
        InitfetchData(); // refresh table
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: res.data?.admin_data[0].sap_error.error_message || 'Failed', life: 3000 });
    }
    } catch (err) {
    console.error(err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    }finally{
        openDialog2.value = false;
        loadingUpdate2.value = false;
    }

};
// Helpers
const formatDateApi = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`scm-return-order-detail/${id}`);
        if ( (response.data.admin_data)) {
            // response.data.status === 1 &&
            returnList.value = response.data.admin_data[0];
            form.value.returnorderno =returnList.value.return_orderNo_ref;
            form2.value.returnorderno =returnList.value.return_orderNo_ref;
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
                detail: response.data.message || 'Server did not confirm success',
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
