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
                            <Button icon="pi pi-file-import" label="Import" class="p-button-success" />
                            <Button icon="pi pi-file-export" label="Export" class="p-button-danger" />
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

const route = useRoute();
const returnList = ref({
  dealer: {
    dealer_shop: {},
  },
  shiptoData: {},
});
const loading = ref(true);

const returnOrder = ref({
    returnRequestNo: 'RR-2025-001',
    pattern: 'Proxes T1R',
    size: '215/45R17',
    dotYear: '2024',
    qty: 2,
    deliveryLocation: 'Kuala Lumpur',
    remark: 'Defective tyre - air leakage'
});

const dealerInfo = ref({
    name: 'AutoWorld KL',
    code: 'DLR-001',
    contactPerson: 'Ahmad Zaki',
    contactNo: '+60123456789'
});

const customerInfo = ref({
    name: 'Lee Wei Ming',
    vehicle: 'Toyota Hilux 2.8G',
    regNo: 'WXY 4567'
});

const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`scm-return-order-detail/${id}`);
        console.log('API Response:', response.data);
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

onMounted(() => {
    InitfetchData();
});

</script>
