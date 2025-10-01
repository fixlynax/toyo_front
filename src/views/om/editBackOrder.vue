<template>
    <Fluid>
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">✏️ Edit Back Order</div>

                <div class="flex items-end gap-3">
                    <!-- Account No (Disabled) -->
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <label for="custAccountNo" class="font-medium">Customer Account No.</label>
                            <i class="pi pi-lock cursor-pointer font-bold" v-tooltip="'Account No cannot be changed'"></i>
                        </div>
                        <InputText v-model="backOrder.custAccountNo" id="custAccountNo" type="text" class="w-full" disabled />
                    </div>
                </div>
            </div>
        </div>

        <!-- 🏬 Dealer Information -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🏬 Dealer Information</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="dealerName">Company Name</label>
                        <InputText id="dealerName" type="text" v-model="backOrder.customerName" disabled />
                    </div>
                    <div class="w-full">
                        <label for="location">Location</label>
                        <InputText id="location" type="text" v-model="backOrder.location" disabled/>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="branch">Signboard</label>
                        <InputText id="branch" type="text" v-model="backOrder.signboard" disabled/>
                    </div>
                    <div class="w-full">
                        <label for="distributionChannel">Distribution Channel</label>
                        <InputText id="distributionChannel" type="text" v-model="backOrder.distributionChannel" disabled />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="contactPerson">Contact Person</label>
                        <InputText id="contactPerson" type="text" v-model="warantyDetail.contactPerson" disabled/>
                    </div>
                    <div class="w-full">
                        <label for="contactNo">Contact Number</label>
                        <InputText id="contactNo" type="text" v-model="warantyDetail.contactNo" disabled/>
                    </div>
                </div>
            </div>
        </div>

        <!-- 👤 Customer Info (ADDED) -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">👤 Customer Info</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="customerName">Customer Name</label>
                        <InputText id="customerName" type="text" v-model="customerInfo.name" disabled/>
                    </div>
                    <div class="w-full">
                        <label for="vehicle">Vehicle</label>
                        <InputText id="vehicle" type="text" v-model="customerInfo.vehicle" disabled/>
                    </div>
                    <div class="w-full">
                        <label for="regNo">Registration Number</label>
                        <InputText id="regNo" type="text" v-model="customerInfo.regNo" disabled/>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🛞 Tire Material & Description -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl border-b pb-2">🛞 Tire Material & Description</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="tyreSize">Tyre Size</label>
                        <InputText id="tyreSize" type="text" v-model="tyre.size" />
                    </div>
                    <div class="w-full">
                        <label for="tyrespec">Tyre Spec</label>
                        <InputText id="tyrespec" type="text" v-model="tyre.tyrespec" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="rimDiameter">Rim Diameter</label>
                        <InputText id="rimDiameter" type="text" v-model="tyre.rimDiameter" />
                    </div>
                    <div class="w-full">
                        <label for="aspectRatio">Aspect Ratio</label>
                        <InputText id="aspectRatio" type="text" v-model="tyre.aspectRatio" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="sectionWidth">Section Width</label>
                        <InputText id="sectionWidth" type="text" v-model="tyre.sectionWidth" />
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
                        <label for="shipTo">Ship To</label>
                        <InputText id="shipTo" type="text" v-model="backOrder.shipTo" />
                    </div>
                    <div class="w-full">
                        <label for="orderDesc">Description</label>
                        <InputText id="orderDesc" type="text" v-model="backOrder.orderDesc" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="shippingCond">Shipping Condition</label>
                        <InputText id="orderDesc" type="text" v-model="backOrder.shippingCond" />
                    </div>
                    <div class="w-full">
                        <label for="deliveryType">Delivery Type</label>
                        <InputText id="deliveryType" type="text" v-model="backOrder.deliveryType" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="deliveryDate">Delivery Date</label>
                        <InputText id="deliveryDate" type="date" v-model="backOrder.deliveryDate" />
                    </div>
                    <div class="w-full">
                        <label for="boOrderNo">BO Order No</label>
                        <InputText id="boOrderNo" type="text" v-model="backOrder.boOrderNo" />
                    </div>
                </div>

                <div class="flex justify-end mt-2">
                    <div class="w-40">
                        <Button label="Save Changes" class="w-full" @click="saveChanges" />
                    </div>
                </div>
            </div>
        </div>

        


    </Fluid>
</template>

<script setup>
import { ref, onMounted } from "vue";

/* dropdown data */
const dropdownShippingConditionValue = ref([
    { name: "RE", code: "RE" },
    { name: "TP", code: "TP" },
]);

const dropdownShippingCondition = ref(null);


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
            },);

const warantyDetail = ref({
  contactPerson: "Ahmad Zaki",
  contactNo: "+6012-3456789"
});

const tyre = ref({
  size: "215/45R17",
  tyrespec: "91W",
  rimDiameter: 17,
  aspectRatio: "45",
  sectionWidth: "215",
});

/* ADDED customer info */
const customerInfo = ref({
  name: "Lee Wei Ming",
  vehicle: "Toyota Hilux 2.8G",
  regNo: "WXY 4567",
});

onMounted(() => {
  dropdownShippingCondition.value = dropdownShippingConditionValue.value.find(
    (opt) => opt.code === form.value.shippingCond
  );
});

const saveChanges = () => {
  // Replace with API call / event emit as needed
  console.log("Save payload:", {
    form: form.value,
    tyre: tyre.value,
    warantyDetail: warantyDetail.value,
    customerInfo: customerInfo.value,
    shippingCondition: dropdownShippingCondition.value,
  });
};
</script>
