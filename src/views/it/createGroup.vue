<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Group</div>

                <!-- Error Alert for non-field errors -->
                <div v-if="apiErrors.general" class="p-4 mb-4 border border-red-300 bg-red-50 rounded-md">
                    <div class="flex items-center">
                        <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
                        <span class="text-red-700 font-medium">{{ apiErrors.general }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Name</label>
                        <InputText v-model="form.name" placeholder="Enter group name" class="w-full" :class="{ 'p-invalid': fieldErrors.name }" />
                        <small v-if="fieldErrors.name" class="p-error block mt-1">
                            <i class="pi pi-exclamation-circle text-xs mr-1"></i>
                            {{ fieldErrors.name }}
                        </small>
                    </div>

                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" :class="{ 'p-invalid': fieldErrors.status }" />
                        <small v-if="fieldErrors.status" class="p-error block mt-1">
                            <i class="pi pi-exclamation-circle text-xs mr-1"></i>
                            {{ fieldErrors.status }}
                        </small>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <Textarea v-model="form.description" rows="3" placeholder="Enter description" class="w-full" :class="{ 'p-invalid': fieldErrors.description }" />
                        <small v-if="fieldErrors.description" class="p-error block mt-1">
                            <i class="pi pi-exclamation-circle text-xs mr-1"></i>
                            {{ fieldErrors.description }}
                        </small>
                    </div>

                    <div class="md:col-span-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="form.is_super_admin" :binary="true" inputId="super_admin" :class="{ 'p-invalid': fieldErrors.is_super_admin }" />
                            <label for="super_admin" class="font-bold text-gray-700 cursor-pointer">Super Administrator</label>
                        </div>
                        <small v-if="fieldErrors.is_super_admin" class="p-error block mt-1 ml-6">
                            <i class="pi pi-exclamation-circle text-xs mr-1"></i>
                            {{ fieldErrors.is_super_admin }}
                        </small>
                    </div>

                    <div class="md:col-span-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="form.is_sales_person" :binary="true" inputId="sales_person" :class="{ 'p-invalid': fieldErrors.is_sales_person }" />
                            <label for="sales_person" class="font-bold text-gray-700 cursor-pointer">Sales Person</label>
                        </div>
                        <small v-if="fieldErrors.is_sales_person" class="p-error block mt-1 ml-6">
                            <i class="pi pi-exclamation-circle text-xs mr-1"></i>
                            {{ fieldErrors.is_sales_person }}
                        </small>
                    </div>
                </div>

                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" :disabled="submitting" />
                    </div>
                    <div class="w-32">
                        <Button label="Create" class="w-full p-button" @click="submitForm" :loading="submitting" :disabled="submitting" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

// Form data
const form = reactive({
    name: '',
    description: '',
    status: 1,
    is_super_admin: false,
    is_sales_person: false
});

// Error handling objects
const fieldErrors = reactive({
    name: '',
    description: '',
    status: '',
    is_super_admin: '',
    is_sales_person: ''
});

const apiErrors = reactive({
    general: '',
    code: '',
    message: ''
});

const submitting = ref(false);

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

// Computed property to check if form has any errors
const hasErrors = computed(() => {
    return Object.values(fieldErrors).some((error) => error !== '') || apiErrors.general !== '' || apiErrors.message !== '';
});

// Clear all errors
const clearAllErrors = () => {
    Object.keys(fieldErrors).forEach((key) => {
        fieldErrors[key] = '';
    });
    apiErrors.general = '';
    apiErrors.code = '';
    apiErrors.message = '';
};

// Clear specific field error
const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
        fieldErrors[fieldName] = '';
    }
};

// Frontend validation
const validateForm = () => {
    clearAllErrors();
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
        fieldErrors.name = 'Group name is required';
        isValid = false;
    } else if (form.name.length > 100) {
        fieldErrors.name = 'Group name cannot exceed 100 characters';
        isValid = false;
    }

    // Description validation
    if (!form.description.trim()) {
        fieldErrors.description = 'Description is required';
        isValid = false;
    }

    // Status validation
    if (form.status === null || form.status === undefined) {
        fieldErrors.status = 'Status is required';
        isValid = false;
    }

    return isValid;
};

// Handle API error response
const handleApiError = (error) => {
    clearAllErrors();

    // Network error or server not responding
    if (!error.response) {
        apiErrors.general = 'Network error. Please check your connection and try again.';
        return;
    }

    const { status, data } = error.response;

    // Handle different status codes
    switch (status) {
        case 422: // Validation errors
            if (data.validation_errors) {
                Object.keys(data.validation_errors).forEach((field) => {
                    const errorMessages = data.validation_errors[field];
                    if (errorMessages && errorMessages.length > 0) {
                        // Map API field names to our form field names
                        const fieldName = field === 'is_super_admin' ? 'is_super_admin' : field === 'is_sales_person' ? 'is_sales_person' : field;

                        if (fieldErrors[fieldName] !== undefined) {
                            fieldErrors[fieldName] = errorMessages[0];
                        } else {
                            apiErrors.general = errorMessages[0];
                        }
                    }
                });
            }
            break;

        case 401: // Unauthorized
            apiErrors.general = 'You are not authorized to perform this action. Please login again.';
            break;

        case 403: // Forbidden
            apiErrors.general = 'You do not have permission to create groups.';
            break;

        case 409: // Conflict (e.g., duplicate name)
            apiErrors.general = 'A group with this name already exists.';
            break;

        case 500: // Server error
            apiErrors.general = 'Server error. Please try again later.';
            break;

        default:
            // Handle API's custom error format
            if (data.error && data.error.message) {
                apiErrors.message = data.error.message;
                apiErrors.code = data.error.code;
            } else if (data.message) {
                apiErrors.general = data.message;
            } else {
                apiErrors.general = 'An unexpected error occurred. Please try again.';
            }
    }

    // If we have a general error message from API, use it
    if (data.message && !apiErrors.general) {
        apiErrors.general = data.message;
    }
};

// Handle successful API response
const handleApiSuccess = (response) => {
    if (response.data.status === 1) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: response.data.message || `Group "${form.name}" created successfully!`,
            life: 5000
        });

        // Redirect after delay
        setTimeout(() => {
            router.push('/it/ListGroup');
        }, 1500);
    } else {
        // API returned status 0 but not an HTTP error
        apiErrors.general = response.data.message || 'Failed to create group';

        if (response.data.error) {
            apiErrors.message = response.data.error.message;
            apiErrors.code = response.data.error.code;
        }
    }
};

// Submit form
const submitForm = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix the errors in the form',
            life: 4000
        });
        return;
    }

    submitting.value = true;
    clearAllErrors();

    try {
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            status: form.status,
            is_super_admin: form.is_super_admin ? 1 : 0,
            is_sales_person: form.is_sales_person ? 1 : 0
        };

        const response = await api.post('admin/create-user-role', payload);
        handleApiSuccess(response);
    } catch (error) {
        handleApiError(error);

        // Show toast for general errors
        if (apiErrors.general) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: apiErrors.general,
                life: 5000
            });
        }
    } finally {
        submitting.value = false;
    }
};

const cancel = () => {
    if (!submitting.value) {
        router.push('/it/ListGroup');
    }
};

// Clear field error when user starts typing
const clearErrorOnInput = (fieldName) => {
    if (fieldErrors[fieldName]) {
        clearFieldError(fieldName);
    }
    if (apiErrors.general) {
        apiErrors.general = '';
    }
};

// Watch for form changes to clear errors
// (You can also use @input on each form field if you prefer)
</script>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-invalid) {
    border-color: #f44336 !important;
}

:deep(.p-invalid:focus) {
    box-shadow: 0 0 0 0.2rem rgba(244, 67, 54, 0.25) !important;
}

:deep(.p-checkbox.p-invalid .p-checkbox-box) {
    border-color: #f44336 !important;
}

:deep(.p-select.p-invalid .p-select-trigger) {
    border-color: #f44336 !important;
}

:deep(.p-radiobutton .p-radiobutton-box) {
    border-radius: 50%;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

:deep(.p-select) {
    width: 100%;
}
</style>
