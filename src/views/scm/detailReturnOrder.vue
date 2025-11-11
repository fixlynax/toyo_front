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

                        <div class="flex items-center gap-2">
                            <Button icon="pi pi-file-import" label="Import" class="p-button-success" @click="importInput?.click()":loading="importLoading"/>
                            <input 
                            ref="importInput"
                            type="file" 
                            accept=".xlsx,.xls" 
                            style="display: none" 
                            @change="handleImport"
                            />
                            <Button icon="pi pi-file-export" label="Export" class="p-button-danger" :loading="exportLoading" @click="handleExport" />
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
                            <p class="font-medium text-lg">{{ returnList.orderstatus }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Reason</span>
                            <p class="font-medium text-lg">{{ `${returnList.reason_code} ${returnList.reason_message}` }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">SAP (Created)</span>
                            <p class="font-medium text-lg">{{ returnList.sap_timestamp }}</p>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Dealer Shop Details</div>
                        </div>
                    </div>

                    <div class="mt-6 mb-4">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Return Reference Number</span>
                            <span class="text-lg font-medium">{{ returnList.dealer.dealer_shop.memberCode }}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Account No</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.companyName1 }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Company Name</span>
                            <p class="font-medium text-lg">{{ `${returnList.dealer.dealer_shop.companyName1} ${returnList.dealer.dealer_shop.companyName2} ${returnList.dealer.dealer_shop.companyName3} ${returnList.dealer.dealer_shop?.companyName4}` }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Reg No</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.companyRegNo }}</p>
                        </div>
                         <div>
                            <span class="block text-sm font-bold text-black-700">Tax No</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.serviceTaxNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Adress</span>
                            <p class="font-medium text-lg">{{ `${returnList.dealer.dealer_shop.addressLine1} ${returnList.dealer.dealer_shop?.addressLine2 || ''} ${returnList.dealer.dealer_shop?.addressLine3 || ''} ${returnList.dealer.dealer_shop?.addressLine4 || ''}` }}</p>
                        </div>
                         <div>
                            <span class="block text-sm font-bold text-black-700">Postcode</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.city }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">City</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.city }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Phone No</span>
                            <p class="font-medium text-lg">{{ returnList.dealer.dealer_shop.phoneNumber }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Dealer Information -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Dealer Name</td>
                                    <td class="px-4 py-2 text-right">{{ `${returnList.dealer.firstName} ${returnList.dealer.lastName}` }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Dealer Code</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.dealer.activationCode}}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Contact Person</td>
                                    <td class="px-4 py-2 text-right">{{ `${returnList.dealer.emailAddress} ${returnList.dealer.mobileNumber}` }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Email</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.dealer.emailAddress }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Shipping Information -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800"> Shipping Information</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Account No</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.shiptoData.custAccountNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Company Name</td>
                                    <td class="px-4 py-2 text-right">{{ `${returnList.shiptoData.companyName1} ${returnList.shiptoData.companyName2} ${returnList.shiptoData.companyName3} ${returnList.shiptoData.companyName4}` }}</td>

                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Address</td>
                                    <td class="px-4 py-2 text-right">{{ `${returnList.shiptoData.addressLine1} ${returnList.shiptoData.addressLine2} ${returnList.shiptoData.addressLine3} ${returnList.shiptoData.addressLine4}` }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">City</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.shiptoData.city }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Company Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.shiptoData.phoneNumber }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Contact Person</td>
                                    <td class="px-4 py-2 text-right">{{ returnList.shiptoData.mobileNumber }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Button from 'primevue/button';
import api from '@/service/api';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const exportLoading = ref(false);
const importLoading = ref(false);
const route = useRoute();
const importInput = ref();
const returnList = ref({
  dealer: {
    dealer_shop: {},
  },
  shiptoData: {},
});
const loading = ref(true);

const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`scm-return-order-detail/${id}`);
        if ( (response.data.admin_data)) {
            // response.data.status === 1 &&
            returnList.value = response.data.admin_data[0];
            console.log('API Response:', returnList.value.return_orderNo_ref);
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
const handleExport = async () => {
 const idexport = route.params.id;
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
        
        const response = await api.postExtra('excel/import-scm-return-order-list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });
        
        if (response.data.status === 1) {
            // Refresh data after import
            await InitfetchData();

            // Reset file input
            if (importInput.value) {
                importInput.value.value = '';
            }

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
                detail: response.data.error || 'Server did not confirm success',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading.value = false;
    }
};
onMounted(() => {
    InitfetchData();
});

</script>
