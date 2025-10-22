<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3">
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Return Order Detail</div>

                        <!-- Return Info -->
                        <div class="font-semibold text-xl border-b pb-2 mt-2">🏬 Dealer Information</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Name</span>
                                <p class="text-lg font-medium">{{ returnOrder.customerName }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Account Number</span>
                                <p class="text-lg font-medium">{{ returnOrder.custAccountNo }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Location</span>
                                <p class="text-lg font-medium">{{ returnOrder.location }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Channel</span>
                                <p class="text-lg font-medium">{{ returnOrder.distributionChannel }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Return Reason</span>
                                <p class="text-lg font-medium">{{ returnOrder.returnReason }}</p>
                            </div>
                        </div>

                        <!-- Return Items -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">📦 Return Information</div>
                        <DataTable :value="[returnOrder]" :rows="1" dataKey="id" class="text-sm">
                            <Column header="Return Material" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <span class="font-bold text-xl">{{ data.returnMaterial }}</span>
                                </template>
                            </Column>

                            <Column header="Quantity" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="font-medium text-xl">{{ data.quantity }}</span>
                                </template>
                            </Column>

                            <Column header="Total" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="font-medium text-xl">{{ data.total }}</span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3">
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
                                    <td class="px-4 py-2 text-right">{{ returnOrder.division }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.orderNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.soNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.doNo }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Invoice Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.invoiceNo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Approve / Reject Buttons -->
                    <div v-if="!returnFinalStatus" class="flex justify-end mt-4 gap-2">
                        <Button label="Reject" class="p-button-danger" size="small" @click="showRejectPopup = true" />
                        <Button label="Approve" class="p-button-success" size="small" @click="onApproveReturnOrder" />
                    </div>

                    <div v-else class="flex justify-end mt-4">
                        <span
                            class="px-4 py-2 rounded text-white text-sm"
                            :class="{
                                'bg-green-700': returnFinalStatus === 'approved',
                                'bg-red-700': returnFinalStatus === 'rejected'
                            }"
                        >
                            {{ returnFinalStatusText }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reject Popup Dialog -->
        <Dialog v-model:visible="showRejectPopup" header="Reject Return Order" modal class="w-96">
            <div class="flex flex-col gap-3">
                <p class="text-gray-700 text-sm">Select a reason for rejection:</p>
                <Dropdown v-model="rejectReason" :options="rejectReasonOptions" placeholder="-- Please Select --" optionLabel="label" optionValue="value" class="w-full" />
                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" class="p-button-secondary" size="small" @click="showRejectPopup = false" />
                    <Button label="Submit" class="p-button-danger" size="small" :disabled="!rejectReason" @click="submitRejectReturnOrder" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>
<script setup>
import { ref, computed } from 'vue';

// ✅ Form data
const form = ref({
    memberCode: 'E346572',
    custAccountNo: '6080100900',
    companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    status: 0
});

// ✅ Return order data
const returnOrder = ref({
    id: 1,
    returnRequestNo: 'RR1001',
    orderNo: 'TYO1001',
    soNo: 'SO1001',
    doNo: 'DO1001',
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

// ✅ Customer Info
const customerInfo = ref({
    name: 'Lee Wei Ming',
    vehicle: 'Toyota Hilux 2.8G',
    regNo: 'WXY 4567'
});

// ✅ Warranty Detail
const warantyDetail = ref({
    contactPerson: 'Ahmad Zaki',
    contactNo: '+6012-3456789'
});

// ✅ Approval / Reject handling (merged)
const showRejectPopup = ref(false);
const rejectReason = ref(null);
const rejectReasonOptions = ref([
    { label: 'Incorrect Details', value: 'Incorrect Details' },
    { label: 'Invalid Return Reason', value: 'Invalid Return Reason' },
    { label: 'Duplicate Request', value: 'Duplicate Request' },
    { label: 'Other', value: 'Other' }
]);

const returnFinalStatus = ref(null);
const returnFinalStatusText = ref('');

// ✅ Approve Return Order
const onApproveReturnOrder = () => {
    returnFinalStatus.value = 'approved';
    returnFinalStatusText.value = 'Approved';
};

// ✅ Open Reject Return Order popup
const onRejectReturnOrder = () => {
    showRejectPopup.value = true;
    rejectReason.value = null;
};

// ✅ Cancel Reject Return Order
const cancelRejectReturnOrder = () => {
    showRejectPopup.value = false;
    rejectReason.value = null;
};

// ✅ Submit Reject Return Order
const submitRejectReturnOrder = () => {
    if (!rejectReason.value) return;
    returnFinalStatus.value = 'rejected';
    returnFinalStatusText.value = `Rejected (${rejectReason.value})`;
    showRejectPopup.value = false;
};
</script>
