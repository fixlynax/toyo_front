<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">
                            Edit Back Order
                        </div>

                        <!-- Account No + Save -->
                        <div class="flex items-center justify-between w-full">
                            <div>
                                <span class="block text-sm text-gray-500">Customer Account No.</span>
                                <InputText v-model="order.custAccountNo" class="w-52" />
                            </div>
                            <Button type="button" label="Save" @click="saveOrder" />
                        </div>

                        <!-- Dealer Info -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">🏬 Dealer Information</div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Dealer Name</label>
                                <InputText v-model="warantyDetail.dealerName" class="w-full" />
                            </div>
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Location</label>
                                <InputText v-model="warantyDetail.location" class="w-full" />
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Branch</label>
                                <InputText v-model="warantyDetail.branch" class="w-full" />
                            </div>
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Distribution Channel</label>
                                <InputText v-model="order.distributionChannel" class="w-full" />
                            </div>
                        </div>

                        <!-- Order Dates -->
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Order Date</label>
                                <Calendar v-model="order.deliveryDate" dateFormat="yy-mm-dd" class="w-full" />
                            </div>
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Expiry</label>
                                <Calendar v-model="order.expiry" dateFormat="yy-mm-dd" class="w-full" />
                            </div>
                        </div>

                        <!-- Tire Info -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">🏬 Tire Material & Description</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Tyre Size</label>
                                <InputText v-model="tyre.size" class="w-full" />
                            </div>
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Tyre Spec</label>
                                <InputText v-model="tyre.tyrespec" class="w-full" />
                            </div>
                        </div>

                        <!-- Shipping -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">🚚 Shipping & Description</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Ship To</label>
                                <InputText v-model="order.shipTo" class="w-full" />
                            </div>
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Description</label>
                                <InputText v-model="order.orderDesc" class="w-full" />
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Shipping Cond</label>
                                <InputText v-model="order.shippingCond" class="w-full" />
                            </div>
                            <div class="w-full">
                                <label class="text-sm text-gray-500">Delivery Type</label>
                                <InputText v-model="order.deliveryType" class="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="md:w-1/3">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Account Status</div>
                        <Dropdown 
                            v-model="form.status" 
                            :options="[{label:'Active', value:1},{label:'Inactive', value:0}]" 
                            optionLabel="label" 
                            optionValue="value"
                            class="w-40"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue'
import { InputText } from 'primevue/inputtext'
import { Button } from 'primevue/button'
import { Calendar } from 'primevue/calendar'
import { Dropdown } from 'primevue/dropdown'

const order = ref({
  custAccountNo: 'CUST001',
  distributionChannel: 'ETEN',
  deliveryDate: '2023-10-15',
  expiry: '2023-11-15',
  shipTo: 'Customer A',
  orderDesc: 'Order for electronics',
  shippingCond: 'Standard',
  deliveryType: 'DELIVER'
})

const tyre = ref({
  size: '215/45R17',
  tyrespec: '91W'
})

const warantyDetail = ref({
  dealerName: 'AutoWorld KL',
  location: 'Kuala Lumpur',
  branch: 'Main Branch'
})

const form = ref({
  status: 1
})

const saveOrder = () => {
  console.log('Saving...', order.value, tyre.value, warantyDetail.value, form.value)
}
</script>
