<template>
    <Fluid>
        <!-- Header -->
        <div class="flex">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Confirm eTEN</div>
                 <p class="text-gray-600">Please review the information before submitting.</p>

                <!-- Account No -->
                <div class="flex items-end gap-3">
                    <div class="flex-1">
                        <span class="text-sm text-gray-500">Account No.</span>
                        <p class="text-lg font-medium">{{ form.custAccountNo }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🏢 Company Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🏢 Company Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Registration No</span>
                        <p class="text-lg font-medium">{{ form.companyRegNo }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 1</span>
                        <p class="text-lg font-medium">{{ form.companyName1 }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 2</span>
                        <p class="text-lg font-medium">{{ form.companyName2 || "-"  }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 3</span>
                        <p class="text-lg font-medium">{{ form.companyName3 || "-" }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Company Name 4</span>
                        <p class="text-lg font-medium">{{ form.companyName4 || "-"  }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Sales Tax No</span>
                        <p class="text-lg font-medium">{{ form.salesTaxNo }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Service Tax No</span>
                        <p class="text-lg font-medium">{{ form.serviceTaxNo }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="text-sm text-gray-500">TIN No</span>
                            <p class="text-lg font-medium">{{ form.tinNo }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm text-gray-500">Vat No</span>
                            <p class="text-lg font-medium">{{ form.vatNo }}</p>
                        </div>
                    </div>
            </div>
        </div>

        <!-- 📍 Address & Contact Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">📍 Address & Contact Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 1</span>
                        <p class="text-lg font-medium">{{ form.addressLine1 }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 2</span>
                        <p class="text-lg font-medium">{{ form.addressLine2 }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 3</span>
                        <p class="text-lg font-medium">{{ form.addressLine3 || "-" }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Address Line 4</span>
                        <p class="text-lg font-medium">{{ form.addressLine4 || "-" }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">City</span>
                        <p class="text-lg font-medium">{{ form.city }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Postcode</span>
                        <p class="text-lg font-medium">{{ form.postcode }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">State</span>
                        <p class="text-lg font-medium">{{ form.state }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Country</span>
                        <p class="text-lg font-medium">{{ form.country }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Map Latitude</span>
                        <p class="text-lg font-medium">{{ form.mapLatitude }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Map Longitude</span>
                        <p class="text-lg font-medium">{{ form.mapLongitude }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Phone No</span>
                        <p class="text-lg font-medium">{{ form.phoneNumber }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Email</span>
                        <p class="text-lg font-medium">{{ form.emailAddress }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 👤 Account Details -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Account Details</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Account Type</span>
                        <p class="text-lg font-medium">{{ form.accountType }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Payment Terms</span>
                        <p class="text-lg font-medium">{{ form.paymentTerms }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Risk Category</span>
                        <p class="text-lg font-medium">{{ form.riskCategory }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Credit Limit</span>
                        <p class="text-lg font-medium">{{ form.creditLimit }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Customer Account Group</span>
                        <p class="text-lg font-medium">{{ form.customerAccountGroup }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Customer Condition Group</span>
                        <p class="text-lg font-medium">{{ form.customerCondGrp }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 💲 Pricing & Sales Info -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">💲 Pricing & Sales Info</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price List</span>
                        <p class="text-lg font-medium">{{ form.pricelist }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price Group</span>
                        <p class="text-lg font-medium">{{ form.priceGroup }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Price Procedure</span>
                        <p class="text-lg font-medium">{{ form.priceProcedure }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Sales Office</span>
                        <p class="text-lg font-medium">{{ form.salesOffice }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Sales District</span>
                        <p class="text-lg font-medium">{{ form.salesDistrict }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Starting Sales Amount</span>
                        <p class="text-lg font-medium">{{ form.startingSalesAmt }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🚚 Shipping & Delivery -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🚚 Shipping & Delivery</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Shipping Condition</span>
                        <p class="text-lg font-medium">{{ form.shippingCond }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Allow Lalamove</span>
                        <p class="text-lg font-medium">{{ form.allowLalamove ? 'Yes' : 'No' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🚚 Shipping & Delivery -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🪧 Signboard / Branding</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Signboard Type</span>
                        <p class="text-lg font-medium">{{ form.signboardType }}</p>
                    </div>
                    <div class="w-full">
                        <span class="text-sm text-gray-500">Signboard Brand</span>
                        <p class="text-lg font-medium">{{ form.signboardBrand ? 'Yes' : 'No' }}</p>
                    </div>
                </div>
                
                <div class="flex flex-col md:flex-row justify-end mt-4"> 
                    <div class="w-40"> 
                        <RouterLink to="/om/addEten">
                            <Button label="Edit" class="w-full" />
                        </RouterLink>
                    </div> 
                    <div class="w-40 ml-4"> 
                        <RouterLink to="/om/detailEten">
                            <Button label="Submit" class="w-full" />
                        </RouterLink>
                    </div> 
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue'

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
})
</script>
