<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <!-- Loading State -->
                <LoadingPage v-if="loading" :message="'Loading Redemption Details...'" />

                <!-- Redemption Details (Read-only) -->
                <div class="card flex flex-col gap-2 w-full" v-if="!loading">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                            <div class="text-2xl font-bold text-gray-800">Edit Redemption</div>
                        </div>
                    </div>

                    <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Recipient</span>
                            <p class="text-xm font-medium">{{ redemption.redeem_item?.recipientName || redemption.redeem_item?.recipient || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-xm text-gray-500">{{ redemption.redeem_item?.contactNumber || redemption.redeem_item?.contact || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Redeemed Item</span>
                            <p class="text-xm text-gray-500">{{ redemption.type || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Approved By</span>
                            <p class="text-xm text-gray-500">{{ redemption.redeem_item?.approvedBy || 'N/A' }} ({{ redemption.adminID || 'N/A' }})</p>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details (Editable) -->
                <div class="card flex flex-col gap-4 w-full" v-if="!loading">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Edit Shipping Details</h2>
                        <div v-if="isShippingDisabled" class="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded">Shipping details (Shipping Date, Courier, Tracking No) are read-only for Pending/Rejected status</div>
                    </div>

                    <div class="grid grid-cols-4 gap-4">
                        <!-- Shipping Date -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Shipping Date</label>
                            <DatePicker v-model="form.ship_date" class="w-full" placeholder="Select Shipping Date" dateFormat="dd-mm-yy" :class="{ 'p-invalid': formErrors.ship_date }" showIcon :disabled="isShippingDisabled" />
                            <!-- <small v-if="formErrors.ship_date" class="p-error">{{ formErrors.ship_date[0] }}</small> -->
                            <small v-if="isShippingDisabled" class="text-gray-500 italic">This field cannot be modified for current status</small>
                        </div>

                        <!-- Recipient Name -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Recipient</label>
                            <InputText v-model="form.recipient" type="text" class="w-full" :class="{ 'p-invalid': formErrors.recipient }" placeholder="Recipient Name" />
                            <small v-if="formErrors.recipient" class="p-error">{{ formErrors.recipient[0] }}</small>
                        </div>

                        <!-- Contact Number -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Contact</label>
                            <InputText v-model="form.contact" type="text" class="w-full" :class="{ 'p-invalid': formErrors.contact }" placeholder="Contact Number" />
                            <small v-if="formErrors.contact" class="p-error">{{ formErrors.contact[0] }}</small>
                        </div>

                        <!-- Courier Name -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Courier</label>
                            <InputText v-model="form.courier" type="text" class="w-full" :class="{ 'p-invalid': formErrors.courier }" placeholder="Courier Name" :disabled="isShippingDisabled" />
                            <!-- <small v-if="formErrors.courier" class="p-error">{{ formErrors.courier[0] }}</small> -->
                            <small v-if="isShippingDisabled" class="text-gray-500 italic">This field cannot be modified for current status</small>
                        </div>

                        <!-- Tracking Number -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Tracking No</label>
                            <InputText v-model="form.tracking_no" type="text" class="w-full" :class="{ 'p-invalid': formErrors.tracking_no }" placeholder="Tracking Number" :disabled="isShippingDisabled" />
                            <!-- <small v-if="formErrors.tracking_no" class="p-error">{{ formErrors.tracking_no[0] }}</small> -->
                            <small v-if="isShippingDisabled" class="text-gray-500 italic">This field cannot be modified for current status</small>
                        </div>

                        <!-- Address Line 1 -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Address Line 1</label>
                            <InputText v-model="form.address1" type="text" class="w-full" :class="{ 'p-invalid': formErrors.address1 }" placeholder="Street Address" />
                            <small v-if="formErrors.address1" class="p-error">{{ formErrors.address1[0] }}</small>
                        </div>

                        <!-- Address Line 2 -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Address Line 2</label>
                            <InputText v-model="form.address2" type="text" class="w-full" :class="{ 'p-invalid': formErrors.address2 }" placeholder="Apartment, Suite, etc. (optional)" />
                            <small v-if="formErrors.address2" class="p-error">{{ formErrors.address2[0] }}</small>
                        </div>

                        <!-- City & State -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">City</label>
                            <InputText v-model="form.city" type="text" class="w-full" :class="{ 'p-invalid': formErrors.city }" placeholder="City" />
                            <small v-if="formErrors.city" class="p-error">{{ formErrors.city[0] }}</small>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">State</label>
                            <InputText v-model="form.state" type="text" class="w-full" :class="{ 'p-invalid': formErrors.state }" placeholder="State" />
                            <small v-if="formErrors.state" class="p-error">{{ formErrors.state[0] }}</small>
                        </div>

                        <!-- Postcode & Country -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Postcode</label>
                            <InputText v-model="form.postcode" type="text" class="w-full" :class="{ 'p-invalid': formErrors.postcode }" placeholder="Postcode" />
                            <small v-if="formErrors.postcode" class="p-error">{{ formErrors.postcode[0] }}</small>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Country</label>
                            <InputText v-model="form.country" type="text" class="w-full" :class="{ 'p-invalid': formErrors.country }" placeholder="Country" />
                            <small v-if="formErrors.country" class="p-error">{{ formErrors.country[0] }}</small>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-6 gap-2">
                        <RouterLink :to="`/marketing/detailRedemption/${redemptionId}`">
                            <Button label="Cancel" class="p-button-secondary" :disabled="processing" />
                        </RouterLink>
                        <div>
                            <Button label="Update" class="p-button-success" @click="saveChanges" :disabled="processing" :loading="processing" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="md:w-1/3 flex flex-col" v-if="!loading">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Advance Info</h2>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">RefNo</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.refno || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Code</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.user?.memberCode || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Level</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.memberLevel || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Redeem Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDateTime(redemption.created) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Verified Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDateTime(redemption.redeem_item?.verifiedDate) }}</td>
                                </tr>
                                <tr class="border-b" v-if="redemption.status === 1">
                                    <td class="px-4 py-2 font-medium">Approved Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDateTime(redemption.verifiedDate) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Points Used</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.point || 0 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quantity</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.qty || 0 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Status</td>
                                    <td class="px-4 py-2 text-right">
                                        <span :class="statusClass">{{ statusText }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

// PrimeVue Components
import DatePicker from 'primevue/calendar';
import InputText from 'primevue/inputtext';

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
    type: '',
    adminID: '',
    status: 0,
    created: '',
    point: 0,
    qty: 0,
    verifiedDate: null,
    user: {
        memberCode: ''
    },
    redeem_item: {
        recipientName: '',
        contactNumber: '',
        approvedBy: '',
        verifiedDate: '',
        courierName: '',
        trackingNumber: '',
        shippedDate: '',
        addLine1: '',
        addLine2: '',
        addCity: '',
        addState: '',
        addPostcode: '',
        addCountry: ''
    }
});

// Form data for editing (matching API requirements)
const form = ref({
    recipient: '',
    contact: '',
    courier: '',
    ship_date: null,
    tracking_no: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
});

const formErrors = ref({});

// Computed properties for status
const isShippingDisabled = computed(() => {
    return redemption.value.status === 0 || redemption.value.status === 2;
});

const statusText = computed(() => {
    switch (redemption.value.status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Approved';
        case 2:
            return 'Rejected';
        default:
            return 'Unknown';
    }
});

const statusClass = computed(() => {
    switch (redemption.value.status) {
        case 0:
            return 'text-yellow-600 font-semibold';
        case 1:
            return 'text-green-600 font-semibold';
        case 2:
            return 'text-red-600 font-semibold';
        default:
            return 'text-gray-600';
    }
});

// Fetch redemption details from API
const fetchRedemptionDetails = async () => {
    try {
        loading.value = true;

        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await api.get(`redeem/item/${redemptionId}?_t=${timestamp}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const redemptionData = response.data.admin_data.redemption_details;

            // Map API data to component structure
            redemption.value = {
                id: redemptionData.id,
                refno: redemptionData.refno,
                memberLevel: redemptionData.memberLevel,
                type: redemptionData.type,
                adminID: redemptionData.adminID,
                status: redemptionData.status,
                created: redemptionData.created,
                point: redemptionData.point,
                qty: redemptionData.qty,
                verifiedDate: redemptionData.verifiedDate,
                user: redemptionData.user || {},
                redeem_item: redemptionData.redeem_item || {}
            };

            // Fix: Check if redeem_item exists before using it
            const redeemItem = redemption.value.redeem_item || {};

            // Pre-fill form with existing data
            form.value = {
                recipient: redeemItem.recipientName || '',
                contact: redeemItem.contactNumber || '',
                courier: redeemItem.courierName || '',
                ship_date: redeemItem.shippedDate ? parseDate(redeemItem.shippedDate) : null,
                tracking_no: redeemItem.trackingNumber || '',
                address1: redeemItem.addLine1 || '',
                address2: redeemItem.addLine2 || '',
                city: redeemItem.addCity || '',
                state: redeemItem.addState || '',
                postcode: redeemItem.addPostcode || '',
                country: redeemItem.addCountry || ''
            };

            console.log('Form data populated:', form.value);
            console.log('Redeem item data:', redeemItem);
            console.log('Redemption status:', redemption.value.status);
            console.log('Shipping disabled:', isShippingDisabled.value);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to load redemption details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching redemption details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load redemption details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const parseDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        // Handle different date formats
        if (dateStr.includes('-')) {
            // Handle database format (Y-m-d) or frontend format (d-m-Y)
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                // If it looks like Y-m-d (from database)
                if (parts[0].length === 4) {
                    const [year, month, day] = parts;
                    return new Date(`${year}-${month}-${day}`);
                }
                // If it looks like d-m-Y (from frontend)
                else if (parts[2].length === 4) {
                    const [day, month, year] = parts;
                    return new Date(`${year}-${month}-${day}`);
                }
            }
        }
        // If it's already in ISO format
        return new Date(dateStr);
    } catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
};

// Save Changes with FormData
const saveChanges = async () => {
    processing.value = true;
    formErrors.value = {};

    try {
        // Format date to dd-mm-yyyy for API if date exists
        let formattedDate = '';
        if (form.value.ship_date) {
            formattedDate = formatDateForAPI(form.value.ship_date);

            if (!formattedDate) {
                toast.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Invalid shipping date format',
                    life: 3000
                });
                processing.value = false;
                return;
            }
        }

        console.log('Sending update with data:', form.value);

        // Create FormData with field names matching API expectations
        const formData = new FormData();

        // All fields are optional - only append if they have values
        if (form.value.courier) formData.append('courier', form.value.courier.trim());
        if (form.value.tracking_no) formData.append('tracking_no', form.value.tracking_no.trim());
        if (form.value.ship_date) formData.append('ship_date', formattedDate);

        if (form.value.recipient) formData.append('recipient', form.value.recipient.trim());
        if (form.value.contact) formData.append('contact', form.value.contact.trim());
        if (form.value.address1) formData.append('address1', form.value.address1.trim());
        if (form.value.address2) formData.append('address2', form.value.address2.trim());
        if (form.value.city) formData.append('city', form.value.city.trim());
        if (form.value.state) formData.append('state', form.value.state.trim());
        if (form.value.postcode) formData.append('postcode', form.value.postcode.trim());
        if (form.value.country) formData.append('country', form.value.country.trim());

        // Debug: log what's being sent
        console.log('FormData being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Send update request
        const response = await api.post(`redeem/edit/${redemptionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Update API Response:', response.data);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || 'Shipping details updated successfully!',
                life: 3000
            });

            // Redirect back to detail page with cache busting
            setTimeout(() => {
                router.push(`/marketing/detailRedemption/${redemptionId}?refresh=${Date.now()}`);
            }, 1500);
        } else {
            // Handle API validation errors
            if (response.data.error) {
                formErrors.value = response.data.error;
                toast.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Please check the form for errors',
                    life: 3000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.data.message || 'Failed to update redemption details',
                    life: 3000
                });
            }
        }
    } catch (error) {
        console.error('Error updating redemption:', error);

        // Handle validation errors from API
        if (error.response && error.response.data && error.response.data.error) {
            formErrors.value = error.response.data.error;
            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please check the form for errors',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to update redemption details',
                life: 3000
            });
        }
    } finally {
        processing.value = false;
    }
};

// Format date for API (dd-mm-yyyy)
const formatDateForAPI = (date) => {
    if (!date) return '';

    try {
        // Handle both Date objects and strings
        const d = date instanceof Date ? date : new Date(date);

        // Check if date is valid
        if (isNaN(d.getTime())) {
            console.error('Invalid date:', date);
            return '';
        }

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error('Error formatting date for API:', error);
        return '';
    }
};

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Try parsing dd-mm-yyyy format
            if (dateString.includes('-')) {
                const [day, month, year] = dateString.split('-');
                const parsedDate = new Date(`${year}-${month}-${day}`);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            }
            return dateString;
        }
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

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-MY');
};

// Fetch data when component mounts
onMounted(() => {
    fetchRedemptionDetails();
});
</script>
