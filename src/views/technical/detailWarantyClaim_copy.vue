<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- Claim Detail -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Warranty Detail</div>
                    <div class="inline-flex items-center gap-2">
                        <Button label="Report Download" class="p-button-danger" size="small" @click="downloadReport" />
                    </div>
                </div>
                <div class="mt-6">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Ref No</span>
                        <span class="text-lg font-medium">{{ warantyDetail.admin_data?.claimRefNo }}</span>
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
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.warrantyRegTireID }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Pattern</span>
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.pattern }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Size</span>
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.size }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Tire Specification</span>
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.tire_details?.tyrespec }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Week Code</span>
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.tire_details?.weekcode }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Manufacturing Code</span>
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.tire_details?.mfgcode }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Warranty Cert No</span>
                        <p class="text-lg font-medium">{{ warantyDetail.admin_data?.warrantyCertNo }}</p>
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
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.firstName }} {{ warantyDetail.admin_data?.lastName }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Vehicle</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.vehicleBrand }} {{ warantyDetail.admin_data?.vehicleModel }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Registration No.</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.vehicleRegNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Mobile Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.mobileNumber }}</p>
                        </div>
                    </div>
                </div>

                <!-- Dealer -->
                <div class="md:w-1/2 card">
                    <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Dealer Acc No</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.dealer_details?.custAccountNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Dealer Name</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.dealer_details?.companyName1 }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Contact Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.dealer_details?.phoneNumber }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Email</span>
                            <p class="text-lg font-medium">{{ warantyDetail.admin_data?.dealer_details?.emailAddress }}</p>
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
                    <Button v-if="warantyDetail.admin_data?.isCTC === 0 && warantyDetail.admin_data?.status === 3" 
                            label="Request CTC" 
                            class="p-button-info" 
                            size="small" 
                            @click="createCTC" 
                            :loading="loadingCTC" />
                </div>
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Warranty Entry ID</span>
                        <p>{{ warantyDetail.admin_data?.id }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Submitted Date</span>
                        <p>{{ formatDate(warantyDetail.admin_data?.submitDate) }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Verified Date</span>
                        <p>{{ formatDate(warantyDetail.admin_data?.verifiedDate) }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Created Date</span>
                        <p>{{ formatDate(warantyDetail.admin_data?.created) }}</p>
                    </div>
                    <div>
                        <span class="font-bold">CTC Status</span>
                        <p>{{ getCTCStatus() }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Claim Status</span>
                        <p>{{ getClaimStatus() }}</p>
                    </div>
                </div>
            </div>

            <!-- 2. Claim Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                    <Button v-if="showClaimVariableButton" 
                            label="Enter Claim Variable" 
                            class="p-button-info" 
                            size="small" 
                            @click="showClaimVariableDialog = true" />
                </div>
                
                <div v-if="warantyDetail.admin_data?.claimPercent !== null" class="grid grid-cols-1 gap-2 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Damage Code</span>
                        <p>{{ warantyDetail.admin_data?.damageCode || 'Not set' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Problem</span>
                        <p>{{ warantyDetail.admin_data?.problem }}</p>
                    </div>
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Claim %</span>
                            <p>{{ warantyDetail.admin_data?.claimPercent || 0 }}%</p>
                        </div>
                        <div>
                            <span class="font-bold">Usable %</span>
                            <p>{{ warantyDetail.admin_data?.usablePercent || 0 }}%</p>
                        </div>
                        <div>
                            <span class="font-bold">Worn %</span>
                            <p>{{ warantyDetail.admin_data?.wornPercent || 0 }}%</p>
                        </div>
                    </div>
                </div>
                <div v-else class="text-sm text-gray-600 italic">
                    Claim variables not set yet
                </div>

                <div v-if="showClaimApprovalButtons" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve" class="p-button-success" size="small" @click="approveClaim" :loading="loadingClaim" />
                    <Button label="Reject" class="p-button-danger" size="small" @click="showRejectDialog = true" />
                </div>
                <div v-else-if="claimFinalStatus" class="text-right mt-3 text-sm font-bold" :class="claimFinalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                    Claim {{ claimFinalStatus }}
                </div>
            </div>

            <!-- 3. Scrap Detail -->
            <div v-if="showScrapSection" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Scrap Detail</div>
                    <Button v-if="warantyDetail.admin_data?.isScrap === 0 && claimFinalStatus === 'approved'" 
                            label="Request Scrap" 
                            class="p-button-info" 
                            size="small" 
                            @click="requestScrap" 
                            :loading="loadingScrap" />
                </div>

                <!-- Scrap Images Gallery -->
                <Galleria v-if="scrapImages.length > 0" 
                         :value="scrapImages" 
                         :responsiveOptions="galleriaResponsiveOptions" 
                         :numVisible="3" 
                         containerStyle="max-width: 640px; margin: 0 auto" 
                         :circular="true" 
                         :showItemNavigators="true" 
                         :showThumbnails="false">
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" class="rounded-xl object-cover w-full h-60 shadow-sm" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" class="rounded-md h-16 w-16 object-cover" />
                    </template>
                </Galleria>
                <div v-else class="text-sm text-gray-600 italic text-center py-4">
                    No scrap images available
                </div>

                <!-- Scrap Approval -->
                <div v-if="showScrapApproval" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve" class="p-button-success" size="small" @click="approveScrap" />
                    <Button label="Reject" class="p-button-danger" size="small" @click="rejectScrap" />
                </div>
                <div v-else-if="scrapStatus" class="text-right mt-3 text-sm font-bold" :class="scrapStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                    Scrap {{ scrapStatus }}
                </div>

                <!-- Action Selection after Scrap Approval -->
                <div v-if="scrapStatus === 'approved' && !replacementSubmitted && !reimbursementSubmitted" class="mt-4">
                    <label class="block text-sm font-bold mb-1">Select Action</label>
                    <select v-model="scrapAction" class="w-full border p-2 rounded">
                        <option value="">-- Select --</option>
                        <option v-if="warantyDetail.admin_data?.claimPercent >= 90" value="replacement">Replacement</option>
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
                        <span>RM {{ (replacementForm.quantity * replacementForm.price).toFixed(2) }}</span>
                    </div>

                    <div class="flex justify-end mt-4">
                        <Button label="Submit Replacement" class="p-button-success" size="small" @click="submitReplacement" :loading="loadingReplacement" />
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
                            <p class="text-lg font-bold text-gray-900 mt-1">{{ replacementResult.sap_sono }}</p>
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
                        <Button label="Submit Reimbursement" class="p-button-success" size="small" @click="submitReimbursement" :loading="loadingReimbursement" />
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
                            <p class="text-lg font-bold text-gray-900 mt-1">{{ warantyDetail.admin_data?.claimRefNo }}</p>
                        </div>
                        <div>
                            <span class="block text-gray-600 font-semibold">Invoice Amount</span>
                            <p class="text-lg font-bold text-blue-700 mt-1">RM {{ reimbursementResult.invoice_amount?.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. Invoice Detail -->
            <div v-if="showInvoiceSection" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Invoice Detail</div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">File Name</span>
                        <p>{{ warantyDetail.admin_data?.invAttachURL ? 'Invoice attached' : 'No invoice' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Submitted Date</span>
                        <p>{{ formatDate(warantyDetail.admin_data?.invSubmitDate) }}</p>
                    </div>
                    <div class="flex justify-end p-1 gap-2">
                        <Button v-if="warantyDetail.admin_data?.invAttachURL" icon="pi pi-eye" class="p-button-info" size="small" @click="viewInvoice" />
                        <Button v-if="warantyDetail.admin_data?.invAttachURL" icon="pi pi-download" class="p-button-danger" size="small" @click="downloadInvoice" />
                    </div>
                </div>
                <div v-if="showInvoiceApproval" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve" class="p-button-success" size="small" @click="approveInvoice" :loading="loadingInvoice" />
                    <Button label="Reject" class="p-button-danger" size="small" @click="rejectInvoice" />
                </div>
                <div v-else-if="invoiceStatus" class="text-right mt-3 text-sm font-bold" :class="invoiceStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                    Invoice {{ invoiceStatus }}
                </div>
            </div>
        </div>
    </div>

    <!-- Dialogs -->
    <Dialog v-model:visible="showClaimVariableDialog" header="Enter Claim Variables" :modal="true">
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="block text-sm font-bold mb-1">Claim %</label>
                <InputNumber v-model="claimVariables.claimPercent" mode="decimal" :min="0" :max="100" :fractionDigits="2" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-bold mb-1">Usable %</label>
                <InputNumber v-model="claimVariables.usablePercent" mode="decimal" :min="0" :max="100" :fractionDigits="2" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-bold mb-1">Worn %</label>
                <InputNumber v-model="claimVariables.wornPercent" mode="decimal" :min="0" :max="100" :fractionDigits="2" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-bold mb-1">Damage Code</label>
                <InputText v-model="claimVariables.damageCode" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" class="p-button-text" @click="showClaimVariableDialog = false" />
            <Button label="Save" class="p-button-primary" @click="saveClaimVariables" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showRejectDialog" header="Reject Claim" :modal="true">
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="block text-sm font-bold mb-1">Reject Reason</label>
                <Dropdown v-model="selectedRejectReason" :options="rejectReasons" optionLabel="damageMode" optionValue="id" placeholder="Select reject reason" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" class="p-button-text" @click="showRejectDialog = false" />
            <Button label="Confirm Reject" class="p-button-danger" @click="rejectClaim" :disabled="!selectedRejectReason" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import axios from 'axios';

const route = useRoute();
const claimId = route.params.id;

// API Base URL
const API_BASE = 'http://127.0.0.1:8000/api';

// Data
const warantyDetail = ref({});
const rejectReasons = ref([]);
const loadingCTC = ref(false);
const loadingClaim = ref(false);
const loadingScrap = ref(false);
const loadingReplacement = ref(false);
const loadingReimbursement = ref(false);
const loadingInvoice = ref(false);

// States
const claimFinalStatus = ref('');
const scrapStatus = ref('');
const scrapAction = ref('');
const invoiceStatus = ref('');
const showClaimVariableDialog = ref(false);
const showRejectDialog = ref(false);

// Forms
const claimVariables = ref({
    claimPercent: 0,
    usablePercent: 0,
    wornPercent: 0,
    damageCode: ''
});

const replacementForm = ref({ name: '', quantity: 1, price: 0 });
const reimbursementForm = ref({ amount: 0 });
const selectedRejectReason = ref(null);

const replacementSubmitted = ref(false);
const reimbursementSubmitted = ref(false);
const replacementResult = ref({});
const reimbursementResult = ref({});

// Computed Properties
const showClaimVariableButton = computed(() => {
    return warantyDetail.value.admin_data?.isCTC === 1 && 
           warantyDetail.value.admin_data?.claimPercent === null;
});

const showClaimApprovalButtons = computed(() => {
    return warantyDetail.value.admin_data?.claimPercent !== null && 
           !claimFinalStatus.value;
});

const showScrapSection = computed(() => {
    return claimFinalStatus.value === 'approved' || warantyDetail.value.admin_data?.isScrap === 1;
});

const showScrapApproval = computed(() => {
    return warantyDetail.value.admin_data?.isScrap === 1 && !scrapStatus.value;
});

const showInvoiceSection = computed(() => {
    return scrapAction.value === 'reimbursement' && reimbursementSubmitted.value;
});

const showInvoiceApproval = computed(() => {
    return warantyDetail.value.admin_data?.invAttachURL && !invoiceStatus.value;
});

const scrapImages = computed(() => {
    const images = [];
    if (warantyDetail.value.admin_data?.scrapImage1URL) {
        images.push({ itemImageSrc: warantyDetail.value.admin_data.scrapImage1URL, thumbnailImageSrc: warantyDetail.value.admin_data.scrapImage1URL });
    }
    if (warantyDetail.value.admin_data?.scrapImage2URL) {
        images.push({ itemImageSrc: warantyDetail.value.admin_data.scrapImage2URL, thumbnailImageSrc: warantyDetail.value.admin_data.scrapImage2URL });
    }
    if (warantyDetail.value.admin_data?.scrapImage3URL) {
        images.push({ itemImageSrc: warantyDetail.value.admin_data.scrapImage3URL, thumbnailImageSrc: warantyDetail.value.admin_data.scrapImage3URL });
    }
    return images;
});

// Methods
const fetchWarrantyDetail = async () => {
    try {
        const response = await axios.get(`${API_BASE}/warranty_claim/${claimId}`);
        warantyDetail.value = response.data;
        updateStatusFromAPI();
    } catch (error) {
        console.error('Error fetching warranty details:', error);
        alert('Failed to load warranty details');
    }
};

const fetchRejectReasons = async () => {
    try {
        const response = await axios.get(`${API_BASE}/rejectReasonList`);
        rejectReasons.value = response.data.admin_data || [];
    } catch (error) {
        console.error('Error fetching reject reasons:', error);
    }
};

const updateStatusFromAPI = () => {
    const data = warantyDetail.value.admin_data;
    if (!data) return;

    // Update claim status
    if (data.status >= 4) {
        claimFinalStatus.value = 'approved';
    } else if (data.status === -1) {
        claimFinalStatus.value = 'rejected';
    }

    // Update scrap status
    if (data.isScrap === 1) {
        scrapStatus.value = 'approved';
    }

    // Update invoice status
    if (data.invSubmitDate && data.approvedBy) {
        invoiceStatus.value = 'approved';
    }
};

const createCTC = async () => {
    loadingCTC.value = true;
    try {
        const response = await axios.put(`${API_BASE}/warranty_claim/requestCTC/${claimId}`, {
            status: 1
        });
        
        if (response.data.status === 1) {
            warantyDetail.value.admin_data.isCTC = 1;
            alert('CTC request submitted successfully');
        }
    } catch (error) {
        console.error('Error creating CTC:', error);
        alert('Failed to create CTC request');
    } finally {
        loadingCTC.value = false;
    }
};

const requestScrap = async () => {
    loadingScrap.value = true;
    try {
        const response = await axios.put(`${API_BASE}/warranty_claim/requestScrap/${claimId}`, {
            status: 1
        });
        
        if (response.data.status === 1) {
            warantyDetail.value.admin_data.isScrap = 1;
            alert('Scrap request submitted successfully');
        }
    } catch (error) {
        console.error('Error requesting scrap:', error);
        alert('Failed to submit scrap request');
    } finally {
        loadingScrap.value = false;
    }
};

const saveClaimVariables = () => {
    // In a real implementation, you would save these to the backend
    warantyDetail.value.admin_data.claimPercent = claimVariables.value.claimPercent;
    warantyDetail.value.admin_data.usablePercent = claimVariables.value.usablePercent;
    warantyDetail.value.admin_data.wornPercent = claimVariables.value.wornPercent;
    warantyDetail.value.admin_data.damageCode = claimVariables.value.damageCode;
    showClaimVariableDialog.value = false;
};

const approveClaim = () => {
    claimFinalStatus.value = 'approved';
    // Update status in backend
    updateClaimStatus(4); // Assuming 4 is approved status
};

const rejectClaim = async () => {
    if (!selectedRejectReason.value) {
        alert('Please select a reject reason');
        return;
    }

    loadingClaim.value = true;
    try {
        const response = await axios.post(`${API_BASE}/warranty_claim/reject`, {
            claim_id: parseInt(claimId),
            reject_reason_id: selectedRejectReason.value
        });
        
        if (response.data.status === 1) {
            claimFinalStatus.value = 'rejected';
            showRejectDialog.value = false;
            alert('Claim rejected successfully');
        }
    } catch (error) {
        console.error('Error rejecting claim:', error);
        alert('Failed to reject claim');
    } finally {
        loadingClaim.value = false;
    }
};

const updateClaimStatus = async (status) => {
    try {
        // API call to update claim status
        // This would be implemented based on your backend API
        console.log(`Updating claim status to: ${status}`);
    } catch (error) {
        console.error('Error updating claim status:', error);
    }
};

const approveScrap = () => {
    scrapStatus.value = 'approved';
};

const rejectScrap = () => {
    scrapStatus.value = 'rejected';
};

const submitReplacement = async () => {
    loadingReplacement.value = true;
    try {
        const response = await axios.post(`${API_BASE}/warranty_claim/approveReplacement`, {
            claim_id: parseInt(claimId),
            materialid: 'MATERIAL_ID' // You need to get this from your data
        });
        
        if (response.data.status === 1) {
            replacementResult.value = response.data.admin_data;
            replacementSubmitted.value = true;
            alert('Replacement submitted successfully');
        }
    } catch (error) {
        console.error('Error submitting replacement:', error);
        alert('Failed to submit replacement');
    } finally {
        loadingReplacement.value = false;
    }
};

const submitReimbursement = async () => {
    loadingReimbursement.value = true;
    try {
        const response = await axios.post(`${API_BASE}/warranty_claim/approveReimbursement`, {
            claim_id: parseInt(claimId),
            materialid: 'MATERIAL_ID', // You need to get this from your data
            claimable_percent: warantyDetail.value.admin_data?.claimPercent || 0
        });
        
        if (response.data.status === 1) {
            reimbursementResult.value = response.data.admin_data;
            reimbursementSubmitted.value = true;
            alert('Reimbursement submitted successfully');
        }
    } catch (error) {
        console.error('Error submitting reimbursement:', error);
        alert('Failed to submit reimbursement');
    } finally {
        loadingReimbursement.value = false;
    }
};

const approveInvoice = async () => {
    loadingInvoice.value = true;
    try {
        const response = await axios.put(`${API_BASE}/warranty_claim/approveInvoice/${claimId}`, {
            status: 1
        });
        
        if (response.data.status === 1) {
            invoiceStatus.value = 'approved';
            alert('Invoice approved successfully');
        }
    } catch (error) {
        console.error('Error approving invoice:', error);
        alert('Failed to approve invoice');
    } finally {
        loadingInvoice.value = false;
    }
};

const rejectInvoice = () => {
    invoiceStatus.value = 'rejected';
};

const viewInvoice = () => {
    if (warantyDetail.value.admin_data?.invAttachURL) {
        window.open(warantyDetail.value.admin_data.invAttachURL, '_blank');
    }
};

const downloadInvoice = () => {
    if (warantyDetail.value.admin_data?.invAttachURL) {
        const link = document.createElement('a');
        link.href = warantyDetail.value.admin_data.invAttachURL;
        link.download = 'invoice.pdf';
        link.click();
    }
};

const downloadReport = () => {
    alert('Download report functionality to be implemented');
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

const getCTCStatus = () => {
    return warantyDetail.value.admin_data?.isCTC === 1 ? 'Requested' : 'Not Requested';
};

const getClaimStatus = () => {
    const status = warantyDetail.value.admin_data?.status;
    switch (status) {
        case 3: return 'Pending';
        case 4: return 'Approved';
        case -1: return 'Rejected';
        default: return 'Unknown';
    }
};

const galleriaResponsiveOptions = ref([
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
]);

// Lifecycle
onMounted(() => {
    fetchWarrantyDetail();
    fetchRejectReasons();
});
</script>