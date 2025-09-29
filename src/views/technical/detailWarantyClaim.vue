<template>
    <div class="p-6">
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Warranty Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Claim Details</div>
                        <div class="inline-flex items-center gap-2">
                            <RouterLink to="/marketing/editEvent">
                                <Button label="Report Download" class="p-button-danger" size="small" />
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Reference -->
                    <div class="mt-6">
                        <div>
                            <span class="block text-xm font-bold text-black-700">Reference Number</span>
                            <span class="text-lg font-medium">{{ warantyDetail.refNo }}</span>
                        </div>
                        <RouterLink to="/marketing/editEtenUser"></RouterLink>
                    </div>
                </div>

                <!-- Problem Issue -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Problem Issue</div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 mb-4">
                        <img v-for="(photo, index) in warantyDetail.problem.imageURL"
                             :key="index"
                             :src="photo"
                             alt="Problem Image"
                             class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-xm font-bold text-black-700">Problem</span>
                            <p class="font-medium text-lg">{{ warantyDetail.problem.issue }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Damage Code</span>
                            <p class="font-medium text-lg">{{ warantyDetail.problem.damageCode }}</p>
                        </div>
                    </div>
                </div>

                <!-- Claim Variable -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Claim Variable</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block font-bold">Claim %</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimVariable.Claim }}</p>
                        </div>
                        <div>
                            <span class="block font-bold">Usable %</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimVariable.Usable }}</p>
                        </div>
                        <div>
                            <span class="block font-bold">Worn %</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimVariable.Worn }}</p>
                        </div>
                        <div>
                            <span class="block font-bold">Damage Code</span>
                            <p class="font-medium text-lg">{{ warantyDetail.problem.damageCode }}</p>
                        </div>
                    </div>

                    <!-- Decision Area -->
                    <div class="flex justify-end mt-6">
                        <div class="flex gap-2">
                            <!-- Show buttons if not decided -->
                            <template v-if="!decision">
                                <Button label="Reject" class="p-button-danger" size="small" @click="handleReject" />
                                <Button label="Approve" class="p-button-success" size="small" @click="handleApprove" />
                            </template>

                            <!-- Show approved status -->
                            <Button v-else-if="decision === 'approved'" 
                                    label="✅ Approved" 
                                    class="p-button-success" 
                                    size="small" 
                                    disabled />

                            <!-- Show rejected status -->
                            <Button v-else-if="decision === 'rejected'" 
                                    label="❌ Rejected" 
                                    class="p-button-danger" 
                                    size="small" 
                                    disabled />
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Customer Information -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Name</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.customerInfo.name }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Vehicle</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.customerInfo.vehicle }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Registration Number</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.customerInfo.regNo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

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
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.dealerName }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Dealer Code</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.dealerInfo.dealerCode }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Contact Person</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.dealerInfo.contactPerson }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Contact Number</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.dealerInfo.contactNo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Tires Details -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🏬 Tires Details</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Serial Number</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.serialNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Pattern</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.pattern }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Size</td>
                                    <td class="px-4 py-2 text-right">{{ warantyDetail.tires.size }}</td>
                                </tr>
                                <tr v-for="(depth, i) in warantyDetail.tires.treadDepths" 
                                    :key="i" 
                                    class="border-b">
                                    <td class="px-4 py-2 font-medium">Tread Depth Tire {{ i + 1 }}</td>
                                    <td class="px-4 py-2 text-right">{{ depth }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- ✅ close RIGHT SIDE -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const decision = ref(null) // null | 'approved' | 'rejected'

const warantyDetail = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    dealerName: 'AutoWorld KL',
    claimType: 'Tire Defect',
    dealerInfo: {
        dealerCode: 'DLR-001',
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789'
    },
    customerInfo: {
        name: 'Lee Wei Ming',
        vehicle: 'Toyota Hilux 2.8G',
        regNo: 'WXY 4567'
    },
    tires: {
        size: '265/65R17',
        pattern: 'Open Country A/T',
        serialNo: 'TYR-99887766',
        treadDepths: [6.5, 6.7, 6.6, 6.4]
    },
    problem: {
        issue: 'Sidewall crack within 6 months of purchase',
        imageURL: ['/demo/images/sidewall-damage.jpg'],
        damageCode: 'D-102 (Sidewall Separation)'
    },
    claimVariable: {
        Claim: 95,
        Usable: 80,
        Worn: 20
    }
})

const handleApprove = () => {
    decision.value = 'approved'
    alert('Claim Approved ✅')
    // 👉 Add API call here
}

const handleReject = () => {
    decision.value = 'rejected'
    alert('Claim Rejected ❌')
    // 👉 Add API call here
}
</script>
