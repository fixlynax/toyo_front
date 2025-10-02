<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Back Order Detail</div>

                        <div class="flex items-center justify-between w-full">
                            <!-- Account No -->
                            <div>
                                <span class="block text-sm text-gray-500">Return Request Number</span>
                                <span class="text-lg font-medium">{{ returnOrder.returnRequestNo }}</span>
                            </div>

                            <!-- Create Button -->
                            <RouterLink to="/om/editBackOrder">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">🏬 Dealer Information</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Name</span>
                                 <p class="text-lg font-medium"> {{ returnOrder.customerName }} </p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Account Number</span>
                                <p class="text-lg font-medium">{{ returnOrder.custAccountNo }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Location</span>
                                <p class="text-lg font-medium">{{ returnOrder.signboard }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Distribution Channel</span>
                                <p class="text-lg font-medium">{{ backOrder.distributionChannel  }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Contact Person</span>
                                <p class="text-lg font-medium">{{ warantyDetail.contactPerson }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Contact Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.contactNo }}</p>
                            </div>
                        </div>

                        <div class="font-semibold text-xl border-b pb-2 mt-8">🏬 Tire Material & Description</div>

                       <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Tyre Size</span>
                                <p class="text-lg font-medium">{{ tyre.size }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Tyre Spec</span>
                                <p class="text-lg font-medium">{{ tyre.tyrespec || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Rim Diameter</span>
                                <p class="text-lg font-medium">{{ tyre.rimDiameter || '-' }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Aspect Ratio</span>
                                <p class="text-lg font-medium">{{ tyre.aspectRatio || '-' }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Section Width</span>
                                <p class="text-lg font-medium">{{ tyre.sectionWidth }}</p>
                            </div>
                        </div>

                       <div class="font-semibold text-xl border-b pb-2 mt-8">🚚 Shipping & Description</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Ship To</span>
                                <p class="text-lg font-medium">{{ backOrder.shipTo }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Description</span>
                                <p class="text-lg font-medium">{{ backOrder.orderDesc }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Shipping Cond</span>
                                <p class="text-lg font-medium">{{ backOrder.shippingCond }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Delivery Type</span>
                                <p class="text-lg font-medium">{{ backOrder.deliveryType }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Delivery Date</span>
                                <p class="text-lg font-medium">{{ backOrder.deliveryDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">BO Order No</span>
                                <p class="text-lg font-medium">{{ backOrder.boOrderNo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/3">
    <!-- Suspend Account -->
            <div class="card flex flex-col w-full">
                <!-- Title + Status in one line -->
                <div class="flex items-center justify-between border-b pb-3 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                    <Tag 
                        :value="form.status === 1 ? 'Complete' : 'Pending'" 
                        :severity="form.status === 1 ? 'success' : 'warn'" 
                    />
                </div>
          
                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Terms -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.division }}</td>
                                </tr>

                                <!-- Credit Limit -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ backOrder.sapOrderType }}</td>
                                </tr>
                                
                                <!-- Credit Limit -->
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
                                    <td class="px-4 py-2 text-right">{{ backOrder.expiry}}</td>
                                </tr>

                                <!-- Suspend Button -->
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="px-2 py-2 text-right">
                            <RouterLink to="/billing">
                                <Button label="Push Order" size="small" />
                            </RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                <!-- Customer Information -->
<div class="card flex flex-col w-full">
    <!-- Title -->
    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">
        👤 Customer Info
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-700">
            <tbody>
                <!-- Customer Name -->
                <tr class="border-b">
                    <td class="px-4 py-2 font-medium">Customer Name</td>
                    <td class="px-4 py-2 text-right">{{ customerInfo.name }}</td>
                </tr>

                <!-- Vehicle -->
                <tr class="border-b">
                    <td class="px-4 py-2 font-medium">Vehicle</td>
                    <td class="px-4 py-2 text-right">{{ customerInfo.vehicle }}</td>
                </tr>

                <!-- Registration Number -->
                <tr>
                    <td class="px-4 py-2 font-medium">Registration Number</td>
                    <td class="px-4 py-2 text-right">{{ customerInfo.regNo }}</td>
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

const returnOrder = ref({
                id: 1,
                returnRequestNo: 'RR1001',
                soNo: 'SO1001',
                doNo: 'DO1001',
                invoiceNo: 'INV1001',
                returnMaterial: 'TYRE-R15-001',
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
                orderStatus: 1, // Completed
                expiry: '2023-11-15',
                created: '2023-10-01',
                modified: '2023-10-05'
            },,
        );

const tyre = ref({
                id: 1,
                warrantyRegisterID: 1001,
                pattern: 'Proxes T1R',
                rimDiameter: 17,
                aspectRatio: '45',
                sectionWidth: '215',
                tyreSize: '215/45R17',
                loadIndex: '91',
                plyRating: 'XL',
                deleted: null,
                status: 'Non-Waranty',
                size: '215/45R17',
                origin: 'Japan',
                desc: 'High-performance tire for sports cars',
                mfgcode: 'MFG-2025-001',
                tyresize: 'Passenger Car',
                tyrespec: '91W',
                weekcode: '3524'
            },
        );      

const customerInfo = ref({
        name: 'Lee Wei Ming',
        vehicle: 'Toyota Hilux 2.8G',
        regNo: 'WXY 4567'
    },);

const warantyDetail = ref(
    {
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789',
        location: 'Kuala Lumpur',
        branch: 'Main Branch'
    },);
</script>
