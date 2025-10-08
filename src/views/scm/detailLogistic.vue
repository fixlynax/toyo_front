<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Dealer Information -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Detail</div>

                    <div class="flex items-center justify-between w-full">
                        <!-- Account No -->
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Customer Account No.</span>
                            <span class="text-lg font-medium">{{ backOrder.custAccountNo }}</span>
                        </div>
                    </div>

                    <div class="font-semibold text-xl border-b pb-2 mt-8">🏬 Dealer Information</div>

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

                <!-- Order Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- ORDER INFORMATION CARD -->
                    <div class="card flex flex-col w-full">
                        <div class="font-semibold text-xl border-b pb-2">📦 Order Information</div>

                        <DataTable :value="[order]" :rows="1" dataKey="id" responsiveLayout="scroll" class="text-sm" stripedRows>
                            <!-- Item -->
                            <Column field="returnMaterial" header="Item" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <span class="font-bold text-lg">{{ data.returnMaterial }}</span>
                                </template>
                            </Column>

                            <!-- Quantity -->
                            <Column field="quantity" header="Quantity" style="min-width: 4rem; text-align: center">
                                <template #body="{ data }">
                                    <span class="font-medium text-lg">{{ data.quantity }}</span>
                                </template>
                            </Column>

                            <!-- Price -->
                            <Column field="price" header="Price" style="width: 6rem; text-align: right">
                                <template #body="{ data }">
                                    <span class="font-semibold text-lg text-green-600">RM {{ data.price }}</span>
                                </template>
                            </Column>
                        </DataTable>

                        <!-- Footer (styled like table total) -->
                        <div class="flex justify-end items-center border-t px-4 py-2">
                            <span class="text-lg font-semibold text-gray-800">Total: RM {{ order.total }}</span>
                        </div>
                    </div>

                    <!-- DELIVERY INFORMATION CARD -->
                    <div class="card flex flex-col gap-4 w-full">
                        <div class="font-semibold text-xl border-b pb-2">🚚 Delivery Information</div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="text-sm font-bold text-gray-700">Ship To</span>
                                <p class="text-lg font-medium">{{ backOrder.shipTo }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-gray-700">Description</span>
                                <p class="text-lg font-medium">{{ backOrder.orderDesc }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-gray-700">Shipping Cond</span>
                                <p class="text-lg font-medium">{{ backOrder.shippingCond }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-gray-700">Delivery Type</span>
                                <p class="text-lg font-medium">{{ backOrder.deliveryType }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-gray-700">Delivery Date</span>
                                <p class="text-lg font-medium">{{ backOrder.deliveryDate }}</p>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-gray-700">BO Order No</span>
                                <p class="text-lg font-medium">{{ backOrder.boOrderNo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="form.status === 1 ? 'Complete' : 'Pending'" :severity="form.status === 1 ? 'success' : 'warn'" />
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.division }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.sapOrderType }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Sales ORG</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.salesOrg }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Date</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.deliveryDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Expiry</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.expiry }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="px-2 py-2 text-right">
                                        <RouterLink to="/billing">
                                            <Button label="Pull Order" size="small" />
                                        </RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">👤 Customer Info</div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Name</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.name }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Vehicle</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.vehicle }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Registration Number</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.regNo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Billing Info -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Billing Info</div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Doc No</td>
                                    <td class="px-4 py-2 text-right">{{ billing.docNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Doc Type</td>
                                    <td class="px-4 py-2 text-right">{{ billing.docType }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Ref Doc No</td>
                                    <td class="px-4 py-2 text-right">{{ billing.refNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Doc Date</td>
                                    <td class="px-4 py-2 text-right">{{ billing.docDate }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="px-2 py-2 text-right w-40">
                                        <RouterLink to="/billing">
                                            <Button label="Download" class="w-40" size="small" />
                                        </RouterLink>
                                    </td>
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
import { ref } from 'vue';

const form = ref({
    memberCode: 'E346572',
    custAccountNo: '6080100900',
    companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    companyName2: '',
    companyName3: '',
    companyName4: '',
    companyRegNo: 'MY123456789',
    salesTaxNo: 'SST123456',
    serviceTaxNo: 'STX120987',
    tinNo: '1256734321',
    vatNo: '0976213456',
    addressLine1: '123 Toyo Road',
    addressLine2: 'Toyo Industrial Park',
    addressLine3: '',
    addressLine4: '',
    city: 'Kuala Lumpur',
    postcode: '50000',
    state: 'Kuala Lumpur',
    country: 'Malaysia',
    mapLatitude: '3.1390',
    mapLongitude: '101.6869',
    phoneNumber: '+60 3-1234 5678',
    mobilreNumber: '+60 19-1234 567',
    emailAddress: 'sales@toyotires.com.my',
    accountType: 'Retailer',
    priceGroup: 'A',
    priceProcedure: 'Standard',
    customerAccountGroup: 'Group1',
    customerCondGrp: 'Cond1',
    paymentTerms: 'NET 30',
    riskCategory: 'Low',
    creditLimit: 50000,
    pricelist: '01',
    signboardType: 'T10',
    signboardBrand: 'Toyo',
    salesOffice: 'Kuala Lumpur',
    salesDistrict: 'Central',
    shippingCond: 'RE',
    accountCreation: '2023-01-15',
    showOnList: 1,
    ifFamilyChannel: 0,
    allowLalamove: 1,
    startingSalesAmt: 1000,
    status: 0
});

const backOrder = ref({
    id: 1,
    etenUserListID: 'U12345',
    etenUserID: 'U67890',
    custAccountNo: '6080100900',
    customerName: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    location: '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia',
    signboard: 'T10',
    salesOrg: 'SO001',
    distributionChannel: 'ETEN',
    division: 'DIV01',
    priceGroup: 'PG01',
    sapOrderType: 'NORMAL',
    customerCondGrp: 'CCG1',
    shipTo: 'YESSIR TYRES SOLUTION SDN BHD',
    shippingCond: 'Standard',
    storageLocation: 'LOC01',
    orderDesc: 'Order for electronics',
    channel: 'ETEN',
    deliveryType: 'DELIVER',
    deliveryDate: '2023-10-15',
    boOrderNo: 'BO1001',
    backOrderArray: [],
    fulfillArray: [],
    orderStatus: 1,
    expiry: '2023-11-15',
    created: '2023-10-01',
    modified: '2023-10-05'
});

const order = ref({
    id: 1,
    returnRequestNo: 'RR1001',
    orderNo: 'TYO1001',
    soNo: 'SO1001',
    doNo: 'DO1001',
    price: 300,
    invoiceNo: 'INV1001',
    returnMaterial: 'TYRE-R15-001',
    returnReason: 'Defective tyre - air leakage',
    quantity: 4,
    total: 1200.0,
    custAccountNo: '6080100900',
    customerName: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    location: '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia',
    distributionChannel: 'ETEN',
    division: 'DIV01',
    orderStatus: 1
});

const billing = ref({
    id: 1,
    docNo: '0930463372',
    docType: 'Invoice',
    refNo: '0920476635',
    docDate: '10 Sept 2025'
});

const customerInfo = ref({
    name: 'Lee Wei Ming',
    vehicle: 'Toyota Hilux 2.8G',
    regNo: 'WXY 4567'
});

const warantyDetail = ref({
    contactPerson: 'Ahmad Zaki',
    contactNo: '+6012-3456789',
    location: 'Kuala Lumpur',
    branch: 'Main Branch'
});
</script>
