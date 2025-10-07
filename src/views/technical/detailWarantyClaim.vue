<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- Claim Detail -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Warranty Detail</div>
                    <div class="inline-flex items-center gap-2">
                        <RouterLink to="/marketing/editEvent">
                            <Button label="Report Download" class="p-button-danger" size="small" />
                        </RouterLink>
                    </div>
                </div>
                <div class="mt-6">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Ref No</span>
                        <span class="text-lg font-medium">{{ warantyDetail.refNo }}</span>
                    </div>
                </div>
            </div>

            <!-- Tire  -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Tire Detail</div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Serial Number</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.serialNo }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Pattern</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.pattern }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Section Width</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.sectionWidth }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Tire Series</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.tireSeries }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Rim Diameter</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.rimDiameter }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Speed Ply Rating</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.speedPlyRating }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Tread Depth</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.treadDepths }} mm</p>
                    </div>
                </div>
            </div>

            <!-- Customer and Dealer Information -->
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Customer -->
                <div class="md:w-1/2 card">
                    <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">👤 Customer Information</div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Name</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customerInfo.name }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Vehicle</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customerInfo.vehicle }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Registration No.</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customerInfo.regNo }}</p>
                        </div>
                    </div>
                </div>

                <!-- Dealer -->
                <div class="md:w-1/2 card">
                    <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Dealer Acc No</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.custAccountNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Dealer Name</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerName }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Contact Person</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactPerson }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Contact Number</span>
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
                    <div class="text-2xl font-bold text-gray-800">CTC Detail</div>
                    <Button v-if="warantyDetail.status === 'Pending'" label="Create" class="p-button-info" size="small" @click="createCTC" />
                </div>
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
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
                        <span class="font-bold">Updated Date</span>
                        <p>{{ warantyDetail.updatedDate }}</p>
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
                    <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                    <Button label="Create" class="p-button-info" size="small" @click="createClaim" />
                </div>
                <div class="grid grid-cols-1 gap-2 text-sm text-gray-800">
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

                <div v-if="claimFinalStatus === ''" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve" class="p-button-success" size="small" @click="onApproveClaim" />
                    <Button label="Reject" class="p-button-danger" size="small" @click="onRejectClaim" />
                </div>
                <div v-else class="text-right mt-3 text-sm font-bold" :class="claimFinalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">Claim {{ claimFinalStatus }}</div>
            </div>

            <!-- 3. Scrap Detail -->
            <div v-if="claimFinalStatus === 'approved'" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Scrap Detail</div>
                </div>

                <Galleria :value="scrapImages" :responsiveOptions="galleriaResponsiveOptions" :numVisible="3" containerStyle="max-width: 640px; margin: 0 auto" :circular="true" :showItemNavigators="true" :showThumbnails="false">
                    >
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" class="rounded-xl object-cover w-full h-60 shadow-sm" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" class="rounded-md h-16 w-16 object-cover" />
                    </template>
                </Galleria>

                <!-- Approve / Reject -->
                <div v-if="scrapStatus === ''" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve" class="p-button-success" size="small" @click="approveScrap" />
                    <Button label="Reject" class="p-button-danger" size="small" @click="rejectScrap" />
                </div>
                <div v-else class="text-right mt-3 text-sm font-bold" :class="scrapStatus === 'approved' ? 'text-green-600' : 'text-red-600'">Scrap {{ scrapStatus }}</div>

                <!-- Select Action -->
                <div v-if="scrapStatus === 'approved' && !replacementSubmitted && !reimbursementSubmitted" class="mt-4">
                    <label class="block text-sm font-bold mb-1">Select Action</label>
                    <select v-model="scrapAction" class="w-full border p-2 rounded">
                        <option value="">-- Select --</option>
                        <option v-if="warantyDetail.claimVariable.Claim >= 90" value="replacement">Replacement</option>
                        <option value="reimbursement">Reimbursement</option>
                    </select>
                </div>

                <!-- Replacement Form -->
                <div v-if="scrapAction === 'replacement' && !replacementSubmitted" class="mt-4">
                    <label class="block text-sm font-bold mb-1">Item Name</label>
                    <input v-model="replacementForm.name" type="text" class="w-full border p-2 rounded mb-2" />

                    <label class="block text-sm font-bold mb-1">Quantity</label>
                    <input v-model.number="replacementForm.quantity" type="number" class="w-full border p-2 rounded mb-2" />

                    <label class="block text-sm font-bold mb-1">Price</label>
                    <input v-model.number="replacementForm.price" type="number" class="w-full border p-2 rounded mb-2" />

                    <div class="flex justify-between mt-2 font-semibold">
                        <span>Total:</span>
                        <span>{{ replacementForm.quantity * replacementForm.price }}</span>
                    </div>

                    <div class="flex justify-end mt-4">
                        <Button label="Submit" class="p-button-success" size="small" @click="submitReplacement" />
                    </div>
                </div>

                <!-- Replacement Output -->
                <div v-if="replacementSubmitted" class="mt-6 p-5 rounded-xl shadow-sm border border-green-200 bg-green-50">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xl font-bold text-green-800 flex items-center gap-2">
                            <i class="pi pi-sync text-green-600"></i>
                            Replacement Detail
                        </h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                        <div>
                            <span class="block text-gray-600 font-semibold">Reference No</span>
                            <p class="text-lg font-bold text-gray-900 mt-1">ORD-{{ Math.floor(Math.random() * 10000) }}</p>
                        </div>
                        <div>
                            <span class="block text-gray-600 font-semibold">Item Name</span>
                            <p class="text-gray-900 mt-1">{{ replacementForm.name }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-800">
                        <div>
                            <span class="block text-gray-600 font-semibold">Quantity</span>
                            <p class="text-gray-900 mt-1">{{ replacementForm.quantity }}</p>
                        </div>
                        <div>
                            <span class="block text-gray-600 font-semibold">Unit Price</span>
                            <p class="text-gray-900 mt-1">RM {{ replacementForm.price.toFixed(2) }}</p>
                        </div>
                        <div>
                            <span class="block text-gray-600 font-semibold">Total</span>
                            <p class="text-lg font-bold text-green-700 mt-1">RM {{ (replacementForm.quantity * replacementForm.price).toFixed(2) }}</p>
                        </div>
                    </div>
                </div>
                <!-- Reimbursement Form -->
                <div v-if="scrapAction === 'reimbursement' && !reimbursementSubmitted" class="mt-4">
                    <label class="block text-sm font-bold mb-1">Invoice Amount</label>
                    <input v-model.number="reimbursementForm.amount" type="number" class="w-full border p-2 rounded mb-2" />

                    <div class="flex justify-end mt-4">
                        <Button label="Submit" class="p-button-success" size="small" @click="submitReimbursement" />
                    </div>
                </div>

                <!-- Reimbursement Output -->
                <div v-if="reimbursementSubmitted" class="mt-6 p-5 rounded-xl shadow-sm border border-blue-200 bg-blue-50">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xl font-bold text-blue-800 flex items-center gap-2">
                            <i class="pi pi-wallet text-blue-600"></i>
                            Reimbursement Detail
                        </h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                        <div>
                            <span class="block text-gray-600 font-semibold">Reference No</span>
                            <p class="text-lg font-bold text-gray-900 mt-1">{{ warantyDetail.refNo }}</p>
                        </div>
                        <div>
                            <span class="block text-gray-600 font-semibold">Invoice Amount</span>
                            <p class="text-lg font-bold text-blue-700 mt-1">RM {{ reimbursementForm.amount.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. Invoice Detail -->
            <div v-if="scrapAction === 'reimbursement' && reimbursementSubmitted" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Invoice Detail</div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">File Name</span>
                        <p>{{ invoice.fileName }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Submitted Date</span>
                        <p>{{ invoice.submittedDate }}</p>
                    </div>
                    <div class="flex justify-end p-1 gap-2">
                        <Button icon="pi pi-eye" class="p-button-info" size="small" @click="viewInvoice" />
                        <Button icon="pi pi-download" class="p-button-danger" size="small" @click="viewInvoice" />
                    </div>
                </div>
                <div v-if="invoiceStatus === ''" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve" class="p-button-success" size="small" @click="approveInvoice" />
                    <Button label="Reject" class="p-button-danger" size="small" @click="rejectInvoice" />
                </div>
                <div v-else class="text-right mt-3 text-sm font-bold" :class="invoiceStatus === 'approved' ? 'text-green-600' : 'text-red-600'">Invoice {{ invoiceStatus }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';

const warantyDetail = ref({
    id: 'WARRANTY-TOYO-001',
    refNo: 'CLM-2025-TOYO-001',
    collectDate: '2025-09-07',
    collectTime: '3:00PM',
    createdDate: '2025-08-25',
    updatedDate: '2025-09-01',
    dealerName: 'AutoWorld Toyo Dealer',
    status: 'Pending',
    dealerInfo: { dealerCode: 'D-TOYO-001', custAccountNo: '6080100900', contactPerson: 'Mr. Toyo', contactNo: '+6012-3456789' },
    customerInfo: { name: 'John Toyo', vehicle: 'Toyota Hilux 2.8G', regNo: 'WXY 4567' },
    tires: { serialNo: 'TYO-99887766', pattern: 'Open Country A/T', sectionWidth: 255, tireSeries: 80, rimDiameter: 17, speedPlyRating: 'S', treadDepths: 6.5 },
    problem: { issue: 'Sidewall crack within 6 months of purchase', damageCode: 'D-102 (Sidewall Separation)' },
    claimVariable: { Claim: 90, Usable: 80, Worn: 10 },
    scrapDetails: { imageURL1: ['/demo/images/sidewall-damage.jpg'], imageURL2: ['/demo/images/sidewall-damage.jpg'], imageURL3: ['/demo/images/sidewall-damage.jpg'] }
});

// States
const claimFinalStatus = ref('');
const scrapStatus = ref('');
const scrapAction = ref('');
const invoiceStatus = ref('');

// Replacement form
const replacementForm = ref({ name: '', quantity: 1, price: 0 });
const replacementSubmitted = ref(false);

// Reimbursement form
const reimbursementForm = ref({ amount: 0 });
const reimbursementSubmitted = ref(false);

// Invoice
const invoice = ref({ fileName: 'invoice_toyo.pdf', submittedDate: '2025-09-10' });

// Methods
const createCTC = () => alert('Create CTC clicked');
const createClaim = () => alert('Create Claim clicked');

const onApproveClaim = () => (claimFinalStatus.value = 'approved');
const onRejectClaim = () => (claimFinalStatus.value = 'rejected');

const approveScrap = () => (scrapStatus.value = 'approved');
const rejectScrap = () => (scrapStatus.value = 'rejected');

const submitReplacement = () => {
    replacementSubmitted.value = true;
};

const submitReimbursement = () => {
    reimbursementSubmitted.value = true;
};

const viewInvoice = () => alert(`Viewing invoice: ${invoice.value.fileName}`);
const approveInvoice = () => (invoiceStatus.value = 'approved');
const rejectInvoice = () => (invoiceStatus.value = 'rejected');

const scrapImages = ref([
    { itemImageSrc: '/demo/images/sidewall-damage.jpg', thumbnailImageSrc: '/demo/images/sidewall-damage.jpg' },
    { itemImageSrc: '/demo/images/toyo.jpg', thumbnailImageSrc: '/demo/images/sidewall-damage.jpg' },
    { itemImageSrc: '/demo/images/event-toyo-1.jpg', thumbnailImageSrc: '/demo/images/sidewall-damage.jpg' }
]);

const galleriaResponsiveOptions = ref([
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
]);
</script>
