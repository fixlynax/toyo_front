<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- Claim Details -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Details</div>
                    <div class="inline-flex items-center gap-2">
                        <RouterLink to="/marketing/editEvent">
                            <Button label="Report Download" class="p-button-danger" size="small" />
                        </RouterLink>
                    </div>
                </div>
                <div class="mt-6">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Reference Number</span>
                        <span class="text-lg font-medium">{{ warantyDetail.refNo }}</span>
                    </div>
                </div>
            </div>

            <!-- Tire Details -->
            <div class="card flex flex-col w-full mt-6">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Tire Details</div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Serial Number</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.serialNo }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Pattern</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.pattern }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Size</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.size }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Section Width</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.sectionWidth }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Tire Series</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.tireSeries }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Rim Diameter</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.rimDiameter }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Speed Ply Rating</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.speedPlyRating }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Tread Depth</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.treadDepths }} mm</p>
                    </div>
                </div>
            </div>

            <!-- Customer and Dealer Information -->
            <div class="flex flex-col md:flex-row gap-8 mt-6">
                <!-- Customer -->
                <div class="md:w-1/2 card">
                    <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">👤 Customer Information</div>
                    <div class="space-y-2">
                        <div>
                            <span class="block font-bold text-black-700">Name</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customerInfo.name }}</p>
                        </div>
                        <div>
                            <span class="block font-bold text-black-700">Vehicle</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customerInfo.vehicle }}</p>
                        </div>
                        <div>
                            <span class="block font-bold text-black-700">Registration No.</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customerInfo.regNo }}</p>
                        </div>
                    </div>
                </div>

                <!-- Dealer -->
                <div class="md:w-1/2 card">
                    <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                    <div class="space-y-2">
                        <div>
                            <span class="block font-bold text-black-700">Dealer Name</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerName }}</p>
                        </div>
                        <div>
                            <span class="block font-bold text-black-700">Dealer Code</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.dealerCode }}</p>
                        </div>
                        <div>
                            <span class="block font-bold text-black-700">Contact Person</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactPerson }}</p>
                        </div>
                        <div>
                            <span class="block font-bold text-black-700">Contact Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactNo }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col">
            <!-- 1. CTC Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">CTC Details</div>
                    <button class="p-button-primary" @click="createCTC">Create</button>
                </div>
                <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div>
                        <span class="font-bold">Warranty Entry ID</span>
                        <p>{{ warantyDetail.id }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Collect Date</span>
                        <p>{{ warantyDetail.collectDate }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Collect Time</span>
                        <p>{{ warantyDetail.collectTime }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Created Date</span>
                        <p>{{ warantyDetail.createdDate }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Status</span>
                        <p>{{ warantyDetail.status }}</p>
                    </div>
                </div>
            </div>

            <!-- 2. Claim Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Details</div>
                    <button class="p-button-primary" @click="createClaim">Create</button>
                </div>
                <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div>
                        <span class="font-bold">Damage Code</span>
                        <p>{{ warantyDetail.problem.damageCode }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Description</span>
                        <p>{{ warantyDetail.problem.issue }}</p>
                    </div>
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Claim %</span>
                            <p>{{ warantyDetail.claimVariable.Claim }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Usable %</span>
                            <p>{{ warantyDetail.claimVariable.Usable }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Worn %</span>
                            <p>{{ warantyDetail.claimVariable.Worn }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button class="p-button-success" @click="onApproveClaim">Approve</button>
                    <button class="p-button-danger" @click="onRejectClaim">Reject</button>
                </div>
            </div>

            <!-- 3. Scrap Detail -->
            <div v-if="claimFinalStatus === 'approved'" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Scrap Details</div>
                </div>
                <img :src="warantyDetail.scrapDetails.imageURL1[0]" alt="Scrap Image" class="rounded-xl shadow-sm object-cover w-full h-72 mb-4" />
                <div class="flex justify-end gap-2">
                    <button class="p-button-success" @click="approveScrap">Approve</button>
                    <button class="p-button-danger" @click="rejectScrap">Reject</button>
                </div>

                <div v-if="warantyDetail.claimVariable.Claim === 90" class="mt-4">
                    <label class="block font-bold mb-1">Select Action</label>
                    <select v-model="scrapAction" class="w-full border p-2 rounded">
                        <option value="">-- Select --</option>
                        <option value="replacement">Replacement</option>
                        <option value="reimbursement">Reimbursement</option>
                    </select>
                </div>
            </div>

            <!-- 4. Invoice Detail -->
            <div v-if="scrapAction === 'reimbursement'" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Invoice Details</div>
                    <button class="p-button-primary" @click="viewInvoice">View / Download</button>
                </div>
                <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div>
                        <span class="font-bold">File Name</span>
                        <p>{{ invoice.fileName }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Submitted Date</span>
                        <p>{{ invoice.submittedDate }}</p>
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button class="p-button-success" @click="approveInvoice">Approve</button>
                    <button class="p-button-danger" @click="rejectInvoice">Reject</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const warantyDetail = ref({
    id: 'WARRANTY-TOYO-001',
    refNo: 'CLM-2025-TOYO-001',
    collectDate: '2025-09-07',
    collectTime: '3:00PM',
    createdDate: '2025-08-25',
    dealerName: 'AutoWorld Toyo Dealer',
    status: 'Pending',
    dealerInfo: { dealerCode: 'D-TOYO-001', contactPerson: 'Mr. Toyo', contactNo: '+6012-3456789' },
    customerInfo: { name: 'John Toyo', vehicle: 'Toyota Hilux 2.8G', regNo: 'WXY 4567' },
    tires: { serialNo: 'TYO-99887766', pattern: 'Open Country A/T', size: '265/65R17', sectionWidth: 255, tireSeries: 80, rimDiameter: 17, speedPlyRating: 'S', treadDepths: 6.5 },
    problem: { issue: 'Sidewall crack within 6 months of purchase', damageCode: 'D-102 (Sidewall Separation)' },
    claimVariable: { Claim: 90, Usable: 80, Worn: 10 },
    scrapDetails: { imageURL1: ['/demo/images/toyo-scrap.jpg'] }
});

const claimFinalStatus = ref('');
const scrapAction = ref('');
const invoice = ref({ fileName: 'invoice_toyo.pdf', submittedDate: '2025-09-10' });

const createCTC = () => alert('Create CTC clicked');
const createClaim = () => alert('Create Claim clicked');
const onApproveClaim = () => (claimFinalStatus.value = 'approved');
const onRejectClaim = () => (claimFinalStatus.value = 'rejected');
const approveScrap = () => alert('Scrap Approved');
const rejectScrap = () => alert('Scrap Rejected');
const viewInvoice = () => alert(`Viewing invoice: ${invoice.value.fileName}`);
const approveInvoice = () => alert('Invoice Approved');
const rejectInvoice = () => alert('Invoice Rejected');
</script>
