<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Order</div>

                <!-- Dealer Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Dealer Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Company Name</label>
                            <InputText v-model="order.companyName" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Address</label>
                            <InputText v-model="order.address" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Dealer Accno</label>
                            <InputText v-model="order.dealerAccno" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Branch Location</label>
                            <InputText v-model="order.branchLocation" class="w-full" disabled />
                        </div>
                    </div>
                </div>

                <!-- Item Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">📦 Item Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Item Name</label>
                            <InputText v-model="order.itemName" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">SKU</label>
                            <InputText v-model="order.sku" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Quantity</label>
                            <InputNumber v-model="order.quantity" class="w-full" :min="1" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price</label>
                            <InputText v-model="order.price" class="w-full" disabled />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Order Type</label>
                            <Dropdown v-model="order.orderType" :options="orderTypes" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <div class="flex justify-start mt-8">
                        <div class="w-40">
                            <RouterLink to="/technical/confirmationOrder">
                                <Button label="Create Order" class="w-full p-button-success" />
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue'; const showDecision = ref(false); const decision = ref(null); const selectedAction = ref(''); const showSubmit = ref(false); const warantyDetail = ref({ id: 1, refNo: 'CLM-2025-001', claimDate: '2025-09-01', dealerName: 'AutoWorld KL', claimType: 'Tire Defect', status: 0, summary: { ctcNo: 'CTC-2025-001', scrapNo: 'SCR-8765', invoiceNo: 'INV-4567' }, dealerInfo: { dealerCode: 'DLR-001', contactPerson: 'Ahmad Zaki', contactNo: '+6012-3456789' }, customerInfo: { name: 'Lee Wei Ming', vehicle: 'Toyota Hilux 2.8G', regNo: 'WXY 4567' }, tires: { size: '265/65R17', pattern: 'Open Country A/T', serialNo: 'TYR-99887766', treadDepths: [6.5, 6.7, 6.6, 6.4] }, problem: { issue: 'Sidewall crack within 6 months of purchase', imageURL: ['/demo/images/sidewall-damage.jpg'], damageCode: 'D-102 (Sidewall Separation)' }, claimVariable: { Claim: 95, Usable: 80, Worn: 20 }, scrapDetails: { scrapNo: 'SCR-8765', imageURL1: ['/demo/images/toyo.jpg'] }, replacementOrder: { orderNo: 'ORD-5569', name: 'Proxes', item: 'Proxes R45', quantity: '4', total: '500.00', subTotal: '2000.00' }, reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-119', status: 'Return' } }); const handleApprove = () => { decision.value = 'approve'; showDecision.value = true; // hide Approve/Reject, show approve options selectedAction.value = ''; showSubmit.value = false; }; const handleReject = () => { decision.value = 'reject'; showDecision.value = true; // hide Approve/Reject, show reject reasons selectedAction.value = ''; showSubmit.value = false; }; const submitDecision = () => { if (decision.value === 'approve') { console.log('✅ Submitted Approval:', selectedAction.value); alert(Submitted Approval: ${selectedAction.value}); } else if (decision.value === 'reject') { console.log('❌ Submitted Rejection:', selectedAction.value); alert(Submitted Rejection: ${selectedAction.value}); } cancelDecision(); }; const cancelDecision = () => { // Reset everything decision.value = null; selectedAction.value = ''; showSubmit.value = false; showDecision.value = false; }; const showRejectReason = ref(false); const showRejectReason2 = ref(false); const rejectReason = ref(''); // ✅ Approve logic const submitApprove = () => { console.log('✅ Approved claim'); alert('Claim Approved ✅'); // 👉 You can add API call here }; // ✅ Reject logic const submitReject = () => { console.log('❌ Rejected with reason:', rejectReason.value); alert(Claim Rejected ❌\nReason: ${rejectReason.value}); // Reset after submit rejectReason.value = ''; showRejectReason.value = false; showRejectReason2.value = false; };
</script>
