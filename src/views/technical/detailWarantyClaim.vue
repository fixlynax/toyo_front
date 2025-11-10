<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20 text-gray-500 text-lg w-full">Loading warranty details...</div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 text-red-500 text-lg w-full">
            {{ error }}
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col md:flex-row gap-8 w-full">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Claim Detail -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Warranty Detail</div>
                        <div class="inline-flex items-center gap-2">
                            <Button label="Reject Warranty" class="p-button-danger" size="small" @click="openRejectDialog" :disabled="rejecting" />
                            <Button label="Request CTC" class="p-button-info" size="small" @click="requestCTCSubmit" />
                            <Button label="Request Scrap" class="p-button-warning" size="small" @click="requestScrapSubmit" />
                        </div>
                    </div>
                    <div class="mt-6">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Ref No</span>
                            <span class="text-lg font-medium">{{ warantyDetail.claimRefNo }}</span>
                        </div>
                    </div>
                </div>

                <!-- Tire Detail -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Tire Detail</div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Serial Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.plateSerial || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Pattern</span>
                            <p class="text-lg font-medium">{{ warantyDetail.pattern }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Size</span>
                            <p class="text-lg font-medium">{{ warantyDetail.size }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Tire Specification</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_details?.tyrespec || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Manufacturing Code</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_details?.mfgcode || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Week Code</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_details?.weekcode || 'N/A' }}</p>
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
                                <p class="text-lg font-medium">{{ warantyDetail.firstName }} {{ warantyDetail.lastName }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Vehicle</span>
                                <p class="text-lg font-medium">{{ warantyDetail.vehicleBrand }} {{ warantyDetail.vehicleModel }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Registration No.</span>
                                <p class="text-lg font-medium">{{ warantyDetail.vehicleRegNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Mobile Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.mobileNumber }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Dealer -->
                    <div class="md:w-1/2 card">
                        <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                                <span class="block text-sm font-bold text-black-800">Dealer Acc No</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.custAccountNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Dealer Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.companyName1 }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Contact Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.phoneNumber }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Email</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.emailAddress }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <!-- 1. CTC Detail -->
                <div class="card w-full mb-4" v-if="warantyDetail.isCTC === 1 && warantyDetail.isScrap === 0 && warantyDetail.status === 4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">CTC Detail</div>
                        <Button v-if="warantyDetail.isCTC === 1 && warantyDetail.isScrap === 0 && warantyDetail.status === 4" label="Create" class="p-button-info" size="small" @click="createCTC" />
                    </div>
                    <!-- <div class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Warranty Entry ID</span>
                            <p>{{ warantyDetail.id }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Submitted Date</span>
                            <p>{{ formatDate(warantyDetail.submitDate) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Verified Date</span>
                            <p>{{ formatDate(warantyDetail.verifiedDate) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Created Date</span>
                            <p>{{ formatDate(warantyDetail.created) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">CTC Status</span>
                            <p>{{ getCTCStatus(warantyDetail.isCTC) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Overall Status</span>
                            <p>{{ getStatusText(warantyDetail.status) }}</p>
                        </div>
                    </div> -->
                </div>

                <!-- 2. Claim Detail -->
                <div class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                        <Button v-if="!warantyDetail.damageCode" label="Create" class="p-button-info" size="small" @click="createClaim" />
                    </div>
                    <div class="grid grid-cols-1 gap-2 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Damage Code</span>
                            <p>{{ warantyDetail.damageCode || 'Not set' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Problem Description</span>
                            <p>{{ warantyDetail.problem || 'No description' }}</p>
                        </div>
                    </div>

                    <div v-if="warantyDetail.status === 4" class="flex justify-end gap-2 mt-4">
                        <Button label="Replacement" class="p-button-info" size="small" @click="createReplacement" />
                        <Button label="Reimbursement" class="p-button-warning" size="small" @click="createReimbursement" />
                    </div>
                    <div v-else-if="claimFinalStatus" class="text-right mt-3 text-sm font-bold" :class="claimFinalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">Claim {{ claimFinalStatus }}</div>
                </div>

                <!-- 3. Scrap Detail -->
                <div v-if="warantyDetail.status === 4 && warantyDetail.isScrap === 1" class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Scrap Detail</div>
                    </div>

                    <!-- Scrap Images Gallery -->
                    <div v-if="scrapImages.length > 0" class="mb-6">
                        <Galleria
                            :value="scrapImages"
                            :responsiveOptions="galleriaResponsiveOptions"
                            :numVisible="5"
                            containerStyle="max-width: 100%; margin: 0 auto"
                            :circular="true"
                            :showItemNavigators="true"
                            :showThumbnails="true"
                            :showIndicators="true"
                            :showThumbnailNavigators="true"
                            thumbnailsPosition="bottom"
                        >
                            <template #item="slotProps">
                                <img :src="slotProps.item.itemImageSrc" :alt="`Scrap image ${slotProps.index + 1}`" class="rounded-xl object-contain w-full h-80 shadow-sm bg-gray-100" />
                            </template>
                            <template #thumbnail="slotProps">
                                <img
                                    :src="slotProps.item.thumbnailImageSrc"
                                    :alt="`Scrap thumbnail ${slotProps.index + 1}`"
                                    class="rounded-md h-16 w-16 object-cover border-2 border-transparent hover:border-primary transition-all"
                                    :class="{ 'border-primary': slotProps.index === slotProps.activeIndex }"
                                />
                            </template>
                        </Galleria>
                    </div>

                    <!-- No Images Message -->
                    <div v-else class="text-center py-8 bg-gray-50 rounded-lg mb-6">
                        <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                        <p class="text-gray-500 font-medium">No scrap images available</p>
                    </div>
                </div>

                <!-- 4. Invoice Detail -->
                <div v-if="(scrapAction === 'reimbursement' && reimbursementSubmitted) || warantyDetail.isReimbursement === 1" class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Invoice Detail</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Invoice Number</span>
                            <p>{{ warantyDetail.invNo || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Submitted Date</span>
                            <p>{{ formatDate(warantyDetail.invSubmitDate) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Amount</span>
                            <p>RM {{ warantyDetail.invAmount?.toFixed(2) || '0.00' }}</p>
                        </div>
                    </div>
                    <div class="flex justify-end p-1 gap-2 mt-2">
                        <Button v-if="warantyDetail.invAttachURL" icon="pi pi-eye" class="p-button-info" size="small" @click="viewInvoice(warantyDetail.invAttachURL)" />
                        <Button v-if="warantyDetail.invAttachURL" icon="pi pi-download" class="p-button-danger" size="small" @click="downloadInvoice(warantyDetail.invAttachURL)" />
                    </div>
                    <div v-if="warantyDetail.invNo && !invoiceStatus" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve" class="p-button-success" size="small" @click="approveInvoice" />
                        <Button label="Reject" class="p-button-danger" size="small" @click="rejectInvoice" />
                    </div>
                    <div v-else-if="invoiceStatus" class="text-right mt-3 text-sm font-bold" :class="invoiceStatus === 'approved' ? 'text-green-600' : 'text-red-600'">Invoice {{ invoiceStatus }}</div>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="showCreateCTCDialog" header="Create CTC" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="grid grid-cols-1 gap-4">
            <!-- Month Display -->

            <!-- Closing Date -->
            <div>
                <label class="block font-bold text-gray-700 mb-2">Schedule *</label>
                <Calendar v-model="ctcdate" dateFormat="dd/mm/yy" placeholder="Select Date & Time" class="w-full" :showIcon="true" :showTime="true" hourFormat="24" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeCTCDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="saveCTC" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showCreateReplacementDialog" header="Submit Replacement" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <label class="block font-bold text-gray-700 mb-1">Select Material ID</label>
        <Dropdown v-model="selectedMaterial" :options="listMaterial" optionLabel="material" placeholder="Select pattern" class="w-full mb-4">
            <template #option="slotProps">
                <div class="flex items-center gap-3">
                    <div>
                        <div class="font-semibold">{{ slotProps.option.material }}</div>
                    </div>
                </div>
            </template>
        </Dropdown>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeReplacementDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="submitReplacement" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showCreateReimbursementDialog" header="Submit Reimbursement" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="field">
            <label class="block font-bold text-gray-700 mb-1">Select Material ID</label>
            <Dropdown v-model="selectedMaterial" :options="listMaterial" optionLabel="material" placeholder="Select pattern" class="w-full mb-4">
                <template #option="slotProps">
                    <div class="flex items-center gap-3">
                        <div>
                            <div class="font-semibold">{{ slotProps.option.material }}</div>
                        </div>
                    </div>
                </template>
            </Dropdown>
        </div>

        <div class="field">
            <label for="claimablePercent" class="block font-bold text-gray-700 mb-1">Claimable Percent (%)</label>
            <InputNumber id="claimablePercent" v-model="reimbursementForm.claimablePercent" mode="decimal" :min="0" :max="100" :minFractionDigits="2" :maxFractionDigits="2" placeholder="Enter claimable percentage" class="w-full mb-4" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeReimbursementDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="submitReimbursement" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showRejectDialog" header="Reject Warranty Claim" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="field">
            <label class="block font-bold text-gray-700 mb-1">Select Rejection Reason *</label>
            <Dropdown v-model="selectedRejectReason" :options="rejectReasons" optionLabel="damageMode" optionValue="id" placeholder="Select rejection reason" class="w-full mb-4" :class="{ 'p-invalid': !selectedRejectReason && rejecting }">
                <template #option="slotProps">
                    <div class="flex flex-col gap-1 py-2">
                        <div class="font-semibold text-gray-800">{{ slotProps.option.damageMode }}</div>
                        <div class="text-sm text-gray-600"><span class="font-medium">Code:</span> {{ slotProps.option.code }} | <span class="font-medium">Part:</span> {{ slotProps.option.part }}</div>
                        <div class="text-xs text-gray-500">{{ slotProps.option.grouping }}</div>
                    </div>
                </template>
            </Dropdown>
            <small v-if="!selectedRejectReason && rejecting" class="p-error">Please select a rejection reason.</small>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div class="flex items-start gap-3">
                <i class="pi pi-exclamation-triangle text-yellow-600 mt-1"></i>
                <div>
                    <p class="font-semibold text-yellow-800">Warning</p>
                    <p class="text-yellow-700 text-sm mt-1">This action will reject the warranty claim and cannot be undone.</p>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeRejectDialog" :disabled="rejecting" />
            <Button label="Reject Claim" icon="pi pi-times-circle" class="p-button-danger" @click="confirmRejectWarranty" :loading="rejecting" :disabled="!selectedRejectReason || rejecting" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import api from '@/service/api';

// const router = useRouter();
const route = useRoute();
const toast = useToast();

// Reactive data
const ctcdate = ref(new Date());
const showCreateCTCDialog = ref(false);
const showCreateReimbursementDialog = ref(false);
const showCreateReplacementDialog = ref(false);

const warantyDetail = ref({});
const loading = ref(true);
const error = ref(null);
const saving = ref(false);

// States
const claimFinalStatus = ref('');
const scrapStatus = ref('');
const scrapAction = ref('');
const invoiceStatus = ref('');

// Forms
const replacementForm = ref({ materialId: '' });
const reimbursementForm = ref({ materialId: '', claimablePercent: 0 });

// Results
const replacementResult = ref({});
const reimbursementResult = ref({});
const replacementSubmitted = ref(false);
const reimbursementSubmitted = ref(false);

// Images
const scrapImages = ref([]);
const listMaterial = ref([]);
const selectedMaterial = ref(null);

const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

//reject
const showRejectDialog = ref(false);
const rejectReasons = ref([]);
const selectedRejectReason = ref(null);
const rejecting = ref(false);

// Computed properties
const hasScrapImages = computed(() => {
    return warantyDetail.value.scrapImage1URL || warantyDetail.value.scrapImage2URL || warantyDetail.value.scrapImage3URL;
});

const fetchMaterial = async () => {
    try {
        const response = await api.get('material');
        console.log(response.data);
        if (response.data.status === 1) {
            listMaterial.value = response.data.admin_data || [];
        }
        // Transform API data to match frontend expectations
        // const transformedItems = (response.data.admin_data || []).map((item) => ({
        //     imageURL: item.imageURL,
        //     title: item.title,
        //     type: item.type,
        //     purpose: item.purpose,
        //     processedImageURL: null // Will be populated by processCatalogueImages
        // }));
    } catch (error) {
        console.error('Error fetching catalog:', error);
    }
};

// Methods
const fetchWarrantyDetail = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`warranty_claim/${id}`);
        // console.log(response.data);
        if (response.data.status === 1) {
            warantyDetail.value = response.data.admin_data;
            await loadScrapImages();
        } else {
            error.value = 'Warranty claim not found.';
        }
    } catch (err) {
        error.value = 'Failed to load warranty details.';
        console.error('Error fetching warranty details:', err);
    } finally {
        loading.value = false;
    }
};

// Fetch rejection reasons
const fetchRejectReasons = async () => {
    try {
        const response = await api.get('rejectReasonList');
        if (response.data.status === 1) {
            rejectReasons.value = response.data.admin_data || [];
        } else {
            console.error('Failed to fetch rejection reasons');
        }
    } catch (error) {
        console.error('Error fetching rejection reasons:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load rejection reasons',
            life: 3000
        });
    }
};

// Open reject dialog
const openRejectDialog = () => {
    showRejectDialog.value = true;
    selectedRejectReason.value = null;
};

// Close reject dialog
const closeRejectDialog = () => {
    showRejectDialog.value = false;
    selectedRejectReason.value = null;
    rejecting.value = false;
};

// Confirm and reject warranty
const confirmRejectWarranty = async () => {
    if (!selectedRejectReason.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a rejection reason',
            life: 3000
        });
        return;
    }

    try {
        rejecting.value = true;
        
        const response = await api.post('warranty_claim/reject', {
            claim_id: warantyDetail.value.id,
            reject_reason_id: selectedRejectReason.value
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Warranty claim rejected successfully',
                life: 3000
            });
            
            // Refresh the warranty details to reflect the rejection
            await fetchWarrantyDetail();
            closeRejectDialog();
        } else {
            throw new Error(response.data.message || 'Rejection failed');
        }
    } catch (err) {
        console.error('Error rejecting warranty:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to reject warranty claim',
            life: 3000
        });
    } finally {
        rejecting.value = false;
    }
};

// Remove the old rejectWarranty function and replace it with the new implementation above

// Methods
const requestCTCSubmit = async () => {
    try {
        loading.value = true;
        const id = warantyDetail.value.id;
        const response = await api.put(`warranty_claim/requestCTC/${id}`);
        // console.log(response.data);
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Request CTC successfully',
                life: 3000
            });
        } else {
            error.value = 'Request CTC fails.';
        }
    } catch (err) {
        error.value = 'Failed to request CTC.';
        console.error('Error Request CTC:', err);
    } finally {
        loading.value = false;
    }
};

const requestScrapSubmit = async () => {
    try {
        loading.value = true;
        const id = warantyDetail.value.id;
        const response = await api.put(`warranty_claim/requestScrap/${id}`);
        // console.log(response.data);
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Request Scrap successfully',
                life: 3000
            });
        } else {
            error.value = 'Request Scrap fails.';
        }
    } catch (err) {
        error.value = 'Failed to request Scrap.';
        console.error('Error Request Scrap:', err);
    } finally {
        loading.value = false;
    }
};

const loadScrapImages = async () => {
    const images = [];

    // Load scrap images from the database fields
    const imageUrls = [warantyDetail.value.scrapImage1URL, warantyDetail.value.scrapImage2URL, warantyDetail.value.scrapImage3URL].filter((url) => url && url !== 'null' && url !== null);

    console.log('Found scrap images:', imageUrls);

    for (const [index, url] of imageUrls.entries()) {
        try {
            const imageSrc = await api.getPrivateFile(url);
            images.push({
                itemImageSrc: imageSrc,
                thumbnailImageSrc: imageSrc,
                alt: `Scrap Image ${index + 1}`
            });
        } catch (err) {
            console.error('Error loading scrap image:', err);
            // Add placeholder for failed images
            images.push({
                itemImageSrc: '/placeholder-image.jpg', // Add a placeholder image
                thumbnailImageSrc: '/placeholder-image.jpg',
                alt: `Scrap Image ${index + 1} - Failed to load`
            });
        }
    }

    scrapImages.value = images;

    // If no images but scrap is marked, show a message
    if (scrapImages.value.length === 0 && warantyDetail.value.isScrap === 1) {
        console.log('No scrap images found for scrap entry');
    }
};

defineProps({
    id: String // now the component explicitly accepts id
});

const createCTC = () => {
    showCreateCTCDialog.value = true;
};

const createReplacement = () => {
    showCreateReplacementDialog.value = true;
};

const createReimbursement = () => {
    showCreateReimbursementDialog.value = true;
};

const closeCTCDialog = () => {
    showCreateCTCDialog.value = false;
    ctcdate.value = new Date();
};

const closeReplacementDialog = () => {
    showCreateReplacementDialog.value = false;
};

const closeReimbursementDialog = () => {
    showCreateReimbursementDialog.value = false;
};
const saveCTC = async () => {
    try {
        loading.value = true;

        // Prepare data for API update - match the expected format
        const pad = (n) => n.toString().padStart(2, '0');
        const d = ctcdate.value;

        const createData = {
            claim_id: warantyDetail.value.id,
            collect_datetime: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        };
        // console.log('Sending create ctc:', createData);

        const response = await api.post(`collection/createCTC`, createData);

        if (response.data.status === 1) {
            closeCTCDialog();
        } else {
            console.error('Failed to create date:', response.data);
            alert('Failed to create ctc. Please try again.');
        }
    } catch (error) {
        console.error('Error create ctc:', error);
    } finally {
        loading.value = false;
        closeCTCDialog();
        // router.go(0);
    }
};
const createClaim = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Claim creation functionality to be implemented',
        life: 3000
    });
};

const onApproveClaim = async () => {
    try {
        saving.value = true;
        // API call for claim approval would go here
        claimFinalStatus.value = 'approved';
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Claim approved successfully',
            life: 3000
        });
    } catch (err) {
        console.error('Error approving claim:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to approve claim',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const onRejectClaim = async () => {
    try {
        saving.value = true;
        const response = await api.post('warranty_claim/reject', {
            claim_id: warantyDetail.value.id,
            reject_reason_id: 1 // You might want to get this from user input
        });

        if (response.data.status === 1) {
            claimFinalStatus.value = 'rejected';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Claim rejected successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error rejecting claim:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reject claim',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const submitReplacement = async () => {
    if (!selectedMaterial.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please enter Material ID',
            life: 3000
        });
        return;
    }

    try {
        saving.value = true;
        const response = await api.post('warranty_claim/approveReplacement', {
            claim_id: warantyDetail.value.id,
            materialid: selectedMaterial.value.materialid
        });
        console.log('Replacement asdasdasd:', response);
        if (response.data.status === 1) {
            replacementResult.value = response.data.admin_data;
            replacementSubmitted.value = true;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Replacement approved successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error submitting replacement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit replacement',
            life: 3000
        });
    } finally {
        saving.value = false;
        closeReplacementDialog();
    }
};

const submitReimbursement = async () => {
    if (!selectedMaterial.value || reimbursementForm.value.claimablePercent <= 0) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please fill all required fields',
            life: 3000
        });
        return;
    }

    try {
        saving.value = true;
        const response = await api.post('warranty_claim/approveReimbursement', {
            claim_id: warantyDetail.value.id,
            materialid: selectedMaterial.value.materialid,
            claimable_percent: reimbursementForm.value.claimablePercent
        });

        if (response.data.status === 1) {
            reimbursementResult.value = response.data.admin_data;
            reimbursementSubmitted.value = true;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reimbursement approved successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error submitting reimbursement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit reimbursement',
            life: 3000
        });
    } finally {
        saving.value = false;
        closeReimbursementDialog();
    }
};

const approveInvoice = async () => {
    try {
        saving.value = true;
        const response = await api.put(`warranty_claim/approveInvoice/${warantyDetail.value.id}`);

        if (response.data.status === 1) {
            invoiceStatus.value = 'approved';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Invoice approved successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error approving invoice:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to approve invoice',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const rejectInvoice = () => {
    invoiceStatus.value = 'rejected';
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Invoice rejected',
        life: 3000
    });
};

const viewInvoice = (url) => {
    if (url) {
        window.open(url, '_blank');
    }
};

const downloadInvoice = async (url) => {
    if (url) {
        try {
            const fileBlob = await api.getPrivateFile(url, true);
            const downloadUrl = window.URL.createObjectURL(fileBlob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'invoice.pdf';
            link.click();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Error downloading invoice:', err);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to download invoice',
                life: 3000
            });
        }
    }
};

const downloadReport = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Report download functionality to be implemented',
        life: 3000
    });
};

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY');
};

const getStatusText = (status) => {
    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Under Review'
    };
    return statusMap[status] || 'Unknown';
};

const getCTCStatus = (isCTC) => {
    return isCTC === 1 ? 'Created' : 'Not Created';
};

// Lifecycle
onMounted(() => {
    fetchWarrantyDetail();
    fetchMaterial();
    fetchRejectReasons(); // Add this line
});
</script>
