<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col gap-8">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Return Order Detail</div>

                    <div class="font-semibold text-xl border-b pb-2 mt-2">🏬 Dealer Details</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Dealer Name</span>
                            <p class="text-lg font-medium">{{ dealerShop.companyName1 }} {{ dealerShop.companyName2 }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Account Number</span>
                            <p class="text-lg font-medium">{{ dealerShop.custAccountNo }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Member Code</span>
                            <p class="text-lg font-medium">{{ dealerShop.memberCode }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Location</span>
                            <p class="text-lg font-medium">{{ dealerShop.city }} {{ dealerShop.state }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ order.channel }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Return Reason</span>
                            <p class="text-lg font-medium">{{ order.reason_message }}</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="font-semibold text-xl border-b pb-2 mt-2">📦 Return Materials</div>
                    <DataTable :value="returnOrderArray" class="text-sm" stripedRows>
                        <Column field="materialid" header="Material ID" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="font-bold text-lg">{{ data.materialid }}</span>
                            </template>
                        </Column>
                        <Column field="itemcategory" header="Item Category" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.itemcategory }}</span>
                            </template>
                        </Column>
                        <Column field="plant" header="Plant" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.plant }}</span>
                            </template>
                        </Column>
                        <Column field="qty" header="Qty" style="min-width: 4rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.qty }}</span>
                            </template>
                        </Column>
                        <Column field="salesdoclineitem" header="Line Item" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-lg">{{ data.salesdoclineitem }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div class="card">
                    <div class="font-semibold text-xl border-b pb-2 mt-2">💰 Order Summary</div>
                    <div class="grid grid-cols-2 gap-4 text-lg">
                        <div>
                            <span class="text-sm text-gray-500">Subtotal</span>
                            <p class="font-medium">RM {{ order.subtotal }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Tax</span>
                            <p class="font-medium">RM {{ order.tax }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Total</span>
                            <p class="font-medium text-green-700">RM {{ order.total }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Created</span>
                            <p class="font-medium">{{ order.created }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="order.orderstatus === 1 ? 'Complete' : 'Pending'" :severity="order.orderstatus === 1 ? 'success' : 'warn'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Ref</td>
                                    <td class="px-4 py-2 text-right">{{ order.return_orderNo_ref }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right">{{ order.order_no }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right">{{ order.so_no }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right">{{ order.do_no }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right">{{ order.inv_no }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right">{{ order.sapordertype }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ order.division }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Shipping Cond</td>
                                    <td class="px-4 py-2 text-right">{{ order.shippingcond }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Date</td>
                                    <td class="px-4 py-2 text-right">{{ order.deliveryDate }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ order.created }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex justify-end mt-4 gap-2">
                        <Button label="Reject" severity="danger" size="small" @click="showRejectPopup = true" />
                        <Button label="Approve" severity="success" size="small" @click="onApproveReturnOrder" />
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="showRejectPopup" header="Reject Return Order" modal class="w-96">
            <div class="flex flex-col gap-3">
                <p class="text-gray-700 text-sm">Select a reason for rejection:</p>
                <Dropdown v-model="rejectReason" :options="rejectReasonOptions" placeholder="-- Please Select --" optionLabel="label" optionValue="value" class="w-full" />
                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" size="small" @click="showRejectPopup = false" />
                    <Button label="Submit" severity="danger" size="small" :disabled="!rejectReason" @click="submitRejectReturnOrder" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue'
import Fluid from 'primevue/fluid'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const apiResponse = {
    status: 1,
    admin_data: [
        {
            returnID: 24,
            id: 61,
            orderID: 61,
            return_orderNo_ref: 'RTNORD-000000020',
            return_order_array: '[{"materialid":"81114NE0304175H","itemcategory":"ZR02","plant":"TSM","qty":"3","salesdoclineitem":"10"}]',
            reason_code: 'Y01',
            reason_message: 'Wrong DOM',
            orderstatus: 1,
            sap_timestamp: '2025-10-09 15:52:12',
            created: '2025-10-09 15:52:12',
            custaccountno: '6020201500',
            salesorg: 'TSM',
            distributionchannel: '10',
            division: '10',
            pricegroup: '06',
            sapordertype: 'ZRP1',
            customerCondGrp: '04',
            shipto: '6020201500',
            shippingcond: 'JB',
            storagelocation: 'TMSA',
            orderDesc: 'NORMAL',
            channel: 'ETEN',
            deliveryType: 'DELIVER',
            deliveryDate: '2025-10-11',
            order_no: 'ORD-000000044',
            so_no: '0910002078',
            do_no: '0920001446',
            inv_no: 'INV6565757',
            subtotal: '750.00',
            tax: '0.00',
            total: '750.00',
            dealer: {
                dealer_shop: {
                    memberCode: 'TY001',
                    custAccountNo: '6020201500',
                    companyName1: 'YIP BROTHERS TYRE & AUTO CAR WORKS',
                    companyName2: 'SDN. BHD.',
                    city: 'SHAH ALAM,',
                    state: 'SEL'
                }
            }
        }
    ]
}

const order = ref(apiResponse.admin_data[0])
const dealerShop = ref(order.value.dealer.dealer_shop)
const returnOrderArray = ref(JSON.parse(order.value.return_order_array))

const showRejectPopup = ref(false)
const rejectReason = ref(null)
const rejectReasonOptions = ref([
    { label: 'Incorrect Details', value: 'Incorrect Details' },
    { label: 'Invalid Return Reason', value: 'Invalid Return Reason' },
    { label: 'Duplicate Request', value: 'Duplicate Request' },
    { label: 'Other', value: 'Other' }
])

const onApproveReturnOrder = () => {
    alert('Return order approved')
}

const submitRejectReturnOrder = () => {
    alert(`Return order rejected: ${rejectReason.value}`)
    showRejectPopup.value = false
}
</script>
