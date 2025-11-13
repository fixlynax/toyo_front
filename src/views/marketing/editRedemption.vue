<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
           
            <div class="md:w-2/3 flex flex-col gap-2">
                <!-- Loading State -->
                <LoadingPage v-if="loading" :message="'Loading Redemption Details...'" />

                <!-- Redemption Details (Read-only) -->
                <div class="card flex flex-col gap-6 w-full" v-if="!loading">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🎁 Redemption Details</h2>
                    </div>

                    <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Recipient</span>
                            <p class="text-lg font-medium">{{ redemption.recipientName || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-lg text-gray-500">{{ redemption.contactNumber || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Redeemed Item</span>
                            <p class="text-lg text-gray-500">{{ redemption.itemName || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Approved By</span>
                            <p class="text-lg text-gray-500">{{ redemption.approvedBy || 'N/A' }} ({{ redemption.adminID || 'N/A' }})</p>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details (Editable) -->
                <div class="card flex flex-col gap-6 w-full" v-if="!loading">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🚚 Edit Shipping Details</h2>
                    </div>

                    <div class="grid grid-cols-4 gap-4">
                        <!-- Shipping Date -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Shipping Date <span class="text-red-500">*</span></label>
                            <Calendar 
                                v-model="form.shippedDate" 
                                class="w-full" 
                                placeholder="Select Shipping Date" 
                                dateFormat="dd-mm-yy"
                                :class="{ 'p-invalid': formErrors.ship_date }"
                            />
                            <small v-if="formErrors.ship_date" class="p-error">{{ formErrors.ship_date[0] }}</small>
                        </div>

                        <!-- Recipient Name -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Recipient <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.recipient" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.recipient }"
                                placeholder="Recipient Name" 
                            />
                            <small v-if="formErrors.recipient" class="p-error">{{ formErrors.recipient[0] }}</small>
                        </div>

                        <!-- Contact Number -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Contact <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.contact" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.contact }"
                                placeholder="Contact Number" 
                            />
                            <small v-if="formErrors.contact" class="p-error">{{ formErrors.contact[0] }}</small>
                        </div>

                        <!-- Courier Name -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Courier <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.courier" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.courier }"
                                placeholder="Courier Name" 
                            />
                            <small v-if="formErrors.courier" class="p-error">{{ formErrors.courier[0] }}</small>
                        </div>

                        <!-- Tracking Number -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Tracking No <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.tracking_no" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.tracking_no }"
                                placeholder="Tracking Number" 
                            />
                            <small v-if="formErrors.tracking_no" class="p-error">{{ formErrors.tracking_no[0] }}</small>
                        </div>

                        <!-- Address Line 1 -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Address Line 1 <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.address_line_1" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.address_line_1 }"
                                placeholder="Street Address" 
                            />
                            <small v-if="formErrors.address_line_1" class="p-error">{{ formErrors.address_line_1[0] }}</small>
                        </div>

                        <!-- Address Line 2 -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Address Line 2</label>
                            <InputText 
                                v-model="form.address_line_2" 
                                type="text" 
                                class="w-full" 
                                placeholder="Apartment, Suite, etc. (optional)" 
                            />
                        </div>

                        <!-- City & State -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">City <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.city" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.city }"
                                placeholder="City" 
                            />
                            <small v-if="formErrors.city" class="p-error">{{ formErrors.city[0] }}</small>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">State <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.state" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.state }"
                                placeholder="State" 
                            />
                            <small v-if="formErrors.state" class="p-error">{{ formErrors.state[0] }}</small>
                        </div>

                        <!-- Postcode & Country -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Postcode <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.postcode" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.postcode }"
                                placeholder="Postcode" 
                            />
                            <small v-if="formErrors.postcode" class="p-error">{{ formErrors.postcode[0] }}</small>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Country <span class="text-red-500">*</span></label>
                            <InputText 
                                v-model="form.country" 
                                type="text" 
                                class="w-full" 
                                :class="{ 'p-invalid': formErrors.country }"
                                placeholder="Country" 
                            />
                            <small v-if="formErrors.country" class="p-error">{{ formErrors.country[0] }}</small>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-6 gap-2">
                        <RouterLink :to="`/marketing/detailRedemption/${redemptionId}`">
                            <Button label="Cancel" class="p-button-secondary" :disabled="processing" />
                        </RouterLink>
                        <div>
                            <Button 
                                label="Update" 
                                class="p-button-success" 
                                @click="saveChanges" 
                                :disabled="processing"
                                :loading="processing"
                            />
                        </div>
                    </div>
                </div>
            </div>

     
            <div class="md:w-1/3 flex flex-col" v-if="!loading">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</h2>
                        <Tag :value="statusLabel(redemption.status)" :severity="statusSeverity(redemption.status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">RefNo</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.refno || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Level</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.memberLevel || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Redeem Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.redemptionDate) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.created) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Component for notifications -->
        <Toast />
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const redemptionId = route.params.id;

const loading = ref(true);
const processing = ref(false);

// Redemption data from API
const redemption = ref({
    id: null,
    refno: '',
    memberLevel: '',
    recipientName: '',
    contactNumber: '',
    addLine1: '',
    addLine2: '',
    addCity: '',
    addState: '',
    addPostcode: '',
    addCountry: '',
    itemName: '',
    redemptionDate: '',
    courierName: '',
    trackingNumber: '',
    shippedDate: '',
    adminID: '',
    approvedBy: '',
    status: 0,
    created: ''
});

// Form data for editing (matching API requirements)
const form = ref({
    recipient: '',
    contact: '',
    courier: '',
    ship_date: null,
    tracking_no: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
});

const formErrors = ref({});

// Fetch redemption details from API
const fetchRedemptionDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`redeem/item/${redemptionId}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const redemptionData = response.data.admin_data.redemption_details;
            
            // Map API data to component structure
            redemption.value = {
                id: redemptionData.id,
                refno: redemptionData.refno,
                memberLevel: redemptionData.memberLevel,
                recipientName: redemptionData.recipientName,
                contactNumber: redemptionData.contactNumber,
                addLine1: redemptionData.addLine1,
                addLine2: redemptionData.addLine2,
                addCity: redemptionData.addCity,
                addState: redemptionData.addState,
                addPostcode: redemptionData.addPostcode,
                addCountry: redemptionData.addCountry,
                itemName: redemptionData.redeem_item,
                redemptionDate: redemptionData.created,
                courierName: redemptionData.courierName,
                trackingNumber: redemptionData.trackingNumber,
                shippedDate: redemptionData.shippedDate,
                adminID: redemptionData.adminID,
                approvedBy: redemptionData.approvedBy,
                status: redemptionData.status,
                created: redemptionData.created
            };

            // Pre-fill form with existing data
            form.value = {
                recipient: redemptionData.recipientName || '',
                contact: redemptionData.contactNumber || '',
                courier: redemptionData.courierName || '',
                ship_date: parseDate(redemptionData.shippedDate),
                tracking_no: redemptionData.trackingNumber || '',
                address_line_1: redemptionData.addLine1 || '',
                address_line_2: redemptionData.addLine2 || '',
                city: redemptionData.addCity || '',
                state: redemptionData.addState || '',
                postcode: redemptionData.addPostcode || '',
                country: redemptionData.addCountry || ''
            };

        } else {
            console.error('API returned error or invalid data:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load redemption details', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching redemption details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load redemption details', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const parseDate = (dateStr) => {
                if (!dateStr) return '';
                const [day, month, year] = dateStr.split('-');
                return new Date(`${year}-${month}-${day}`);
            };

// Save Changes with FormData
const saveChanges = async () => {
    processing.value = true;
    formErrors.value = {};

    try {
        // Format date to dd-mm-yyyy
        const formattedDate = form.value.ship_date 
            ? formatDateForAPI(form.value.ship_date)
            : '';

        // Create FormData and append all fields
        const formData = new FormData();
        formData.append('recipient', form.value.recipient);
        formData.append('contact', form.value.contact);
        formData.append('courier', form.value.courier);
        formData.append('ship_date', formattedDate);
        formData.append('tracking_no', form.value.tracking_no);
        formData.append('address_line_1', form.value.address_line_1);
        formData.append('address_line_2', form.value.address_line_2 || '');
        formData.append('city', form.value.city);
        formData.append('state', form.value.state);
        formData.append('postcode', form.value.postcode);
        formData.append('country', form.value.country);

        // Send update request
        const response = await api.post(`redeem/edit/${redemptionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Shipping details updated successfully!', life: 3000 });
            
            // Redirect to detail page after successful update
            setTimeout(() => {
                router.push(`/marketing/detailRedemption/${redemptionId}`);
            }, 1500);
        } else {
            console.error('Failed to update redemption:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update redemption details', life: 3000 });
        }
    } catch (error) {
        console.error('Error updating redemption:', error);
        
        // Handle validation errors
        if (error.response && error.response.data && error.response.data.error) {
            formErrors.value = error.response.data.error;
            toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please check the form for errors', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update redemption details', life: 3000 });
        }
    } finally {
        processing.value = false;
    }
};

// Format date for API (dd-mm-yyyy)
const formatDateForAPI = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
};

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

// Status Helpers
const statusLabel = (status) => {
    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Processing',
        4: 'Delivery',
        5: 'Redeemed (Yet to Use)',
        10: 'Completed'
    };
    return statusMap[status] || 'Unknown';
};

const statusSeverity = (status) => {
    const severityMap = {
        0: 'warning',
        1: 'success',
        2: 'danger',
        3: 'info',
        4: 'primary',
        5: 'secondary',
        10: 'success'
    };
    return severityMap[status] || 'secondary';
};

// Fetch data when component mounts
onMounted(() => {
    fetchRedemptionDetails();
});
</script>