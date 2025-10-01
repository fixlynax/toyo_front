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
                        <InputText v-model="form.custAccountNo" id="custAccountNo" type="text" class="w-full" disabled />
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
                        <label for="dealerName">Dealer Name</label>
                        <InputText id="dealerName" type="text" v-model="warantyDetail.dealerName" />
                    </div>
                    <div class="w-full">
                        <label for="location">Location</label>
                        <InputText id="location" type="text" v-model="warantyDetail.location" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="branch">Branch</label>
                        <InputText id="branch" type="text" v-model="warantyDetail.branch" />
                    </div>
                    <div class="w-full">
                        <label for="distributionChannel">Distribution Channel</label>
                        <InputText id="distributionChannel" type="text" v-model="form.distributionChannel" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="contactPerson">Contact Person</label>
                        <InputText id="contactPerson" type="text" v-model="warantyDetail.contactPerson" />
                    </div>
                    <div class="w-full">
                        <label for="contactNo">Contact Number</label>
                        <InputText id="contactNo" type="text" v-model="warantyDetail.contactNo" />
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
                        <InputText id="shipTo" type="text" v-model="form.shipTo" />
                    </div>
                    <div class="w-full">
                        <label for="orderDesc">Description</label>
                        <InputText id="orderDesc" type="text" v-model="form.orderDesc" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="shippingCond">Shipping Condition</label>
                        <Select id="shippingCond" v-model="dropdownShippingCondition" :options="dropdownShippingConditionValue" optionLabel="name" placeholder="Select One" class="w-full" />
                    </div>
                    <div class="w-full">
                        <label for="deliveryType">Delivery Type</label>
                        <InputText id="deliveryType" type="text" v-model="form.deliveryType" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="w-full">
                        <label for="deliveryDate">Delivery Date</label>
                        <InputText id="deliveryDate" type="date" v-model="form.deliveryDate" />
                    </div>
                    <div class="w-full">
                        <label for="boOrderNo">BO Order No</label>
                        <InputText id="boOrderNo" type="text" v-model="form.boOrderNo" />
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
                        <InputText id="customerName" type="text" v-model="customerInfo.name" />
                    </div>
                    <div class="w-full">
                        <label for="vehicle">Vehicle</label>
                        <InputText id="vehicle" type="text" v-model="customerInfo.vehicle" />
                    </div>
                    <div class="w-full">
                        <label for="regNo">Registration Number</label>
                        <InputText id="regNo" type="text" v-model="customerInfo.regNo" />
                    </div>
                </div>
            </div>
        </div>

        <!-- ✅ Submit -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex justify-end mt-4">
                    <Button label="Save Changes" class="w-40" @click="saveChanges" />
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

/* main editable objects */
const form = ref({
  custAccountNo: "6080100900",
  distributionChannel: "ETEN",
  shipTo: "Customer A",
  orderDesc: "Order for tyres",
  shippingCond: "RE",
  deliveryType: "DELIVER",
  deliveryDate: "2023-10-15",
  boOrderNo: "BO1001",
});

const warantyDetail = ref({
  dealerName: "AutoWorld KL",
  location: "Kuala Lumpur",
  branch: "Main Branch",
  contactPerson: "Ahmad Zaki",
  contactNo: "+6012-3456789",
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
