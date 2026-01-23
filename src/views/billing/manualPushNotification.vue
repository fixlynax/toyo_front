<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Manual Push Notification</div>

                <!-- Form -->
                <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                    <!-- Dealer Shop Selection -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Customer<span style="color: red"> *</span></label>
                        <MultiSelect
                            v-model="form.dealerID_list"
                            :options="dealerOptions"
                            optionLabel="companyName"
                            optionValue="id"
                            placeholder="Select customer shop(s)"
                            class="w-full multiselect-custom"
                            :loading="loadingDealers"
                            :filter="true"
                            display="chip"
                            :showToggleAll="true"
                            filterPlaceholder="Search customers..."
                            :maxSelectedLabels="3"
                        >
                            <template #header>
                                <div class="flex justify-between items-center p-2 border-b">
                                    <span class="font-semibold">Select Customers</span>
                                    <div class="flex gap-2">
                                        <Button v-if="dealerOptions.length > 0" @click="selectAllDealers" size="small" class="p-button-text p-button-sm" :disabled="form.dealerID_list?.length === dealerOptions.length"> Select All </Button>
                                        <Button v-if="form.dealerID_list?.length > 0" @click="clearAllDealers" size="small" class="p-button-text p-button-sm"> Clear All </Button>
                                    </div>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex flex-col p-2">
                                    <span class="font-semibold text-gray-800">{{ slotProps.option.companyName }}</span>
                                    <span class="text-sm text-gray-600">{{ slotProps.option.memberCode }} - {{ slotProps.option.custAccountNo }}</span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.length > 0" class="flex flex-wrap gap-1">
                                    <template v-for="dealerId in slotProps.value" :key="dealerId">
                                        <div class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {{ getDealerNameById(dealerId) }}
                                        </div>
                                    </template>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </MultiSelect>
                        <small v-if="errors.dealerID_list" class="text-red-500 text-sm">{{ errors.dealerID_list }}</small>
                        <small class="text-gray-500 text-sm">Select one or more customer shops to receive the notification</small>
                    </div>

                    <!-- Title -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Title<span style="color: red"> *</span></label>
                        <InputText v-model="form.title" placeholder="Enter notification title" class="w-full" :maxlength="100" @input="updateTitleCounter" />
                        <div class="flex justify-between mt-1">
                            <small v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</small>
                            <small v-else class="text-gray-500 text-sm"></small>
                            <small class="text-gray-500 text-sm">{{ titleLength }}/100 characters</small>
                        </div>
                    </div>

                    <!-- Message -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Message<span style="color: red"> *</span></label>
                        <Textarea v-model="form.message" placeholder="Enter notification message" class="w-full" rows="4" :maxlength="180" @input="updateMessageCounter" />
                        <div class="flex justify-between mt-1">
                            <small v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</small>
                            <small v-else class="text-gray-500 text-sm"></small>
                            <small class="text-gray-500 text-sm">{{ messageLength }}/180 characters</small>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Send Notification" class="w-full p-button" @click="submitForm" :loading="submitting" :disabled="!form.dealerID_list?.length || !form.title || !form.message" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const form = ref({
    dealerID_list: [],
    title: '',
    message: ''
});

const errors = reactive({});

// Data from API
const dealerOptions = ref([]);
const dealerMap = ref({}); // Map to store dealer info by ID

// Loading and state
const loadingDealers = ref(false);
const submitting = ref(false);

// Computed properties
const titleLength = computed(() => form.value.title.length);
const messageLength = computed(() => form.value.message.length);
const selectedDealersCount = computed(() => form.value.dealerID_list?.length || 0);

// Helper function to get dealer name by ID
const getDealerNameById = (dealerId) => {
    return dealerMap.value[dealerId]?.companyName || `Customers ${dealerId}`;
};

// Character counter updates
const updateTitleCounter = () => {
    // Auto-truncate if exceeds limit
    if (form.value.title.length > 100) {
        form.value.title = form.value.title.substring(0, 100);
    }
};

const updateMessageCounter = () => {
    // Auto-truncate if exceeds limit
    if (form.value.message.length > 180) {
        form.value.message = form.value.message.substring(0, 180);
    }
};

// Select All / Clear All functions
const selectAllDealers = () => {
    form.value.dealerID_list = dealerOptions.value.map((dealer) => dealer.id);
};

const clearAllDealers = () => {
    form.value.dealerID_list = [];
};

// Fetch dealers from API
const fetchDealers = async () => {
    try {
        loadingDealers.value = true;
        const response = await api.post('list_dealer', {
            tabs: 'ORDER'
        });

        if (response.data.status === 1) {
            const adminData = response.data.admin_data;

            // Clear existing data
            dealerOptions.value = [];
            dealerMap.value = {};

            // Transform data for dropdown
            Object.values(adminData).forEach((shop) => {
                const dealerInfo = shop.shop;
                if (dealerInfo && dealerInfo.id) {
                    const companyName = `${dealerInfo.companyName1 || ''} ${dealerInfo.companyName2 || ''}`.trim();
                    const dealerOption = {
                        id: dealerInfo.id,
                        memberCode: dealerInfo.memberCode || '',
                        custAccountNo: dealerInfo.custAccountNo || '',
                        companyName: companyName || `Dealer ${dealerInfo.id}`,
                        city: dealerInfo.city || '',
                        state: dealerInfo.state || ''
                    };

                    dealerOptions.value.push(dealerOption);
                    dealerMap.value[dealerInfo.id] = dealerOption;
                }
            });

            // Sort by member code or company name
            dealerOptions.value.sort((a, b) => {
                if (a.memberCode && b.memberCode) {
                    return a.memberCode.localeCompare(b.memberCode);
                }
                return a.companyName.localeCompare(b.companyName);
            });

            console.log('Loaded customers:', dealerOptions.value.length);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to load customer list',
                life: 4000
            });
        }
    } catch (error) {
        console.error('Error fetching customers:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dealer list. Please try again.',
            life: 4000
        });
    } finally {
        loadingDealers.value = false;
    }
};

// Validation function
const validateForm = () => {
    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    let isValid = true;

    // Dealer list validation
    if (!form.value.dealerID_list || form.value.dealerID_list.length === 0) {
        errors.dealerID_list = 'Please select at least one dealer shop';
        isValid = false;
    }

    // Title validation
    if (!form.value.title.trim()) {
        errors.title = 'Title is required';
        isValid = false;
    } else if (form.value.title.length > 100) {
        errors.title = 'Title must not exceed 100 characters';
        isValid = false;
    }

    // Message validation
    if (!form.value.message.trim()) {
        errors.message = 'Message is required';
        isValid = false;
    } else if (form.value.message.length > 180) {
        errors.message = 'Message must not exceed 180 characters';
        isValid = false;
    }

    return isValid;
};

// Submit form
const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    submitting.value = true;

    try {
        // Prepare payload - dealerID_list should be an array of IDs
        const payload = {
            dealerID_list: form.value.dealerID_list, // This is already an array [1, 2, 3]
            title: form.value.title.trim(),
            message: form.value.message.trim()
        };

        console.log('Triggering push notification with payload:', payload);

        // Get selected dealer names for success message
        const selectedDealerNames = form.value.dealerID_list.map((dealerId) => getDealerNameById(dealerId)).join(', ');

        // Call the API endpoint
        const response = await api.post('credit/triggerNotification', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Done trigger push notification`,
                life: 5000
            });

            // Reset form after successful submission
            form.value = {
                dealerID_list: [],
                title: '',
                message: ''
            };
        } else {
            // Handle API errors
            const errorDetail = response.data.message || 'Failed to trigger notification';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 5000
            });

            // Handle validation errors from API
            if (response.data.errors) {
                Object.entries(response.data.errors).forEach(([field, messages]) => {
                    errors[field] = Array.isArray(messages) ? messages.join(', ') : messages;
                });
            }
        }
    } catch (err) {
        console.error('Error triggering notification:', err);

        let errorMessage = 'Something went wrong while sending notification';

        if (err.response?.data) {
            if (err.response.data.errors) {
                Object.entries(err.response.data.errors).forEach(([field, messages]) => {
                    errors[field] = Array.isArray(messages) ? messages.join(', ') : messages;
                });
                errorMessage = 'Please check the form for errors';
            } else if (err.response.data.message) {
                errorMessage = err.response.data.message;
            }
        } else if (err.code === 'NETWORK_ERROR') {
            errorMessage = 'Please check your internet connection';
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        submitting.value = false;
    }
};

const cancel = () => router.go(-1);

onMounted(() => {
    fetchDealers();
});
</script>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-multiselect) {
    width: 100%;
}

/* Style for multiselect with improved dropdown */
:deep(.multiselect-custom .p-multiselect-panel) {
    max-height: 400px;
    min-width: 500px;
}

:deep(.multiselect-custom .p-multiselect-header) {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

:deep(.multiselect-custom .p-multiselect-items-wrapper) {
    max-height: 350px;
}

:deep(.multiselect-custom .p-multiselect-item) {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #f3f4f6;
}

:deep(.multiselect-custom .p-multiselect-item:last-child) {
    border-bottom: none;
}

:deep(.multiselect-custom .p-checkbox-box) {
    border-radius: 4px;
}

/* Chip styling - custom for dealer names */
:deep(.multiselect-custom .p-multiselect-token) {
    display: none; /* Hide default chips since we're using custom display */
}

/* Improve filter input */
:deep(.multiselect-custom .p-multiselect-filter-container) {
    padding: 0.75rem;
}

:deep(.multiselect-custom .p-multiselect-filter-container .p-inputtext) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
}

/* Custom header buttons */
:deep(.multiselect-custom .p-multiselect-header .p-button) {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

:deep(.multiselect-custom .p-multiselect-header .p-button:not(:disabled):hover) {
    background-color: #f3f4f6;
}

/* Textarea styling */
:deep(.p-textarea) {
    width: 100%;
}

:deep(.p-textarea textarea) {
    resize: vertical;
    min-height: 100px;
}

/* Character counter */
.text-counter {
    font-size: 0.75rem;
    margin-top: 0.25rem;
}
</style>
