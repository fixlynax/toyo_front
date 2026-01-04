<template>
    <Fluid>
        <div class="card flex flex-col gap-6 w-full">
            <!-- Header -->
            <div class="flex items-center pb-2 border-b">
                <div>
                    <div class="text-2xl font-bold text-gray-800">Email Sender Settings</div>
                </div>
            </div>

            <!-- Email Sender Form -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email Username -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1"> Email Username </label>
                    <InputText v-model="form.email_username" placeholder="Enter SMTP username" :disabled="loading" class="w-full" />
                </div>

                <!-- Email Address -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1"> Email Address </label>
                    <InputText v-model="form.email_address" placeholder="Enter sender email address" :disabled="loading" class="w-full" type="email" />
                </div>

                <!-- Email Password (Optional) -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">
                        Password
                        <span class="text-xs font-normal text-gray-500">(Leave empty to keep current)</span>
                    </label>
                    <Password v-model="form.email_password" placeholder="Enter SMTP password (optional)" :disabled="loading" class="w-full" :feedback="false" toggleMask />
                </div>

                <!-- Email Name -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1"> Email Name </label>
                    <InputText v-model="form.email_name" placeholder="Enter sender display name" :disabled="loading" class="w-full" />
                </div>

                <!-- Email Port -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1"> Email Port </label>
                    <InputNumber v-model="form.email_port" placeholder="Enter SMTP port" :disabled="loading" class="w-full" :min="1" :max="65535" />
                </div>
            </div>

            <!-- Password Update Info -->
            <div v-if="form.email_password" class="p-4 border border-amber-200 bg-amber-50 rounded-md">
                <div class="flex items-start gap-3">
                    <i class="pi pi-info-circle text-amber-600 mt-0.5"></i>
                    <div>
                        <div class="font-semibold text-amber-800">Password Update Notice</div>
                        <div class="text-sm text-amber-700 mt-1">You are updating the SMTP password.</div>
                        <ul class="text-sm text-amber-700 mt-1 list-disc list-inside space-y-1">
                            <li>Keep a record of the new password</li>
                            <li>Test email sending after updating</li>
                            <li>Leaving password empty will keep the current password</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Current Settings Display (Read-only) -->
            <div v-if="currentSettings" class="mt-4 p-4 border rounded-md bg-gray-50">
                <div class="text-sm font-semibold text-gray-700 mb-2">Current Environment Settings (Read-only):</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Mail Type:</span>
                        <span class="font-bold">{{ currentSettings.mailType }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Mail Host:</span>
                        <span class="font-bold">{{ currentSettings.mailHost }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Mail Encryption:</span>
                        <span class="font-bold">{{ currentSettings.mailEncryption }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Last Updated:</span>
                        <span class="font-bold">{{ formatDate(currentSettings.created) }}</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 pt-4">
                <div class="w-32">
                    <Button label="Reset" class="w-full p-button-secondary" @click="resetForm" :disabled="loading" />
                </div>
                <div class="w-40">
                    <Button label="Update Settings" class="w-full p-button-warning" @click="submitForm" :loading="loading" />
                </div>
            </div>
        </div>

        <!-- Success Dialog -->
        <Dialog header="Success" v-model:visible="showSuccessDialog" :modal="true" :closable="true" :style="{ width: '500px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <i class="pi pi-check-circle text-green-500 text-2xl"></i>
                    <div class="text-lg font-semibold">Settings Updated!</div>
                </div>
                <div class="text-gray-600">
                    Email settings have been updated.
                    <span v-if="form.email_password"> Password has been updated.</span>
                    <span v-else> Password remains unchanged.</span>
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="OK" class="p-button-primary" @click="handleSuccessClose" />
                </div>
            </div>
        </Dialog>

        <!-- Confirm Update Dialog -->
        <Dialog header="Confirm Settings Update" v-model:visible="showConfirmDialog" :modal="true" :closable="false" :style="{ width: '500px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-amber-500 text-2xl"></i>
                    <div class="text-lg font-semibold text-amber-700">Confirm Update</div>
                </div>
                <div class="text-gray-700">
                    You are about to update email settings.
                    <span v-if="form.email_password"> This includes updating the password.</span>
                    <span v-else> The password will remain unchanged.</span>
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" class="p-button-secondary" @click="showConfirmDialog = false" />
                    <Button label="Yes, Update" class="p-button-warning" @click="confirmUpdate" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import api from '@/service/api';

const toast = useToast();

const form = reactive({
    email_username: '',
    email_password: '',
    email_address: '',
    email_name: '',
    email_port: null
});

const initialForm = ref({});
const currentSettings = ref(null);
const loading = ref(false);
const showSuccessDialog = ref(false);
const showConfirmDialog = ref(false);

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(async () => {
    await fetchEmailSettings();
});

const fetchEmailSettings = async () => {
    loading.value = true;
    try {
        const response = await api.get('email-sender');

        if (response.data.status === 1 && response.data.admin_data) {
            currentSettings.value = response.data.admin_data;

            // Populate form fields
            form.email_username = response.data.admin_data.mailUsername || '';
            form.email_address = response.data.admin_data.mailAddress || '';
            form.email_name = response.data.admin_data.mailName || '';
            form.email_port = response.data.admin_data.mailPort ? parseInt(response.data.admin_data.mailPort) : null;
            form.email_password = ''; // Always empty on load

            // Store initial values for reset functionality
            initialForm.value = {
                email_username: response.data.admin_data.mailUsername || '',
                email_address: response.data.admin_data.mailAddress || '',
                email_name: response.data.admin_data.mailName || '',
                email_port: response.data.admin_data.mailPort ? parseInt(response.data.admin_data.mailPort) : null
            };

            toast.add({
                severity: 'success',
                summary: 'Loaded',
                detail: 'Email settings loaded successfully',
                life: 2000
            });
        } else {
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'No existing email settings found',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching email settings:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load email settings',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const validateForm = () => {
    // Validate email address if provided
    if (form.email_address && !isValidEmail(form.email_address)) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid',
            detail: 'Please enter a valid email address',
            life: 3000
        });
        return false;
    }

    // Validate port number if provided
    if (form.email_port && (form.email_port < 1 || form.email_port > 65535)) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid',
            detail: 'Port number must be between 1 and 65535',
            life: 3000
        });
        return false;
    }

    return true;
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const resetForm = () => {
    // Reset form to initial values
    form.email_username = initialForm.value.email_username || '';
    form.email_address = initialForm.value.email_address || '';
    form.email_name = initialForm.value.email_name || '';
    form.email_port = initialForm.value.email_port || null;
    form.email_password = '';

    toast.add({
        severity: 'info',
        summary: 'Reset',
        detail: 'All changes have been reset',
        life: 2000
    });
};

const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    // Show confirmation dialog for any update
    showConfirmDialog.value = true;
};

const confirmUpdate = async () => {
    showConfirmDialog.value = false;
    await updateEmailSettings();
};

const updateEmailSettings = async () => {
    loading.value = true;

    toast.add({
        severity: 'info',
        summary: 'Saving',
        detail: 'Updating email settings...',
        life: 2000
    });

    try {
        // Send password field - if empty, send as empty string
        const payload = {
            email_username: form.email_username || '',
            email_address: form.email_address || '',
            email_name: form.email_name || '',
            email_port: form.email_port || '',
            email_password: form.email_password || '' // Send empty string if no new password
        };

        const response = await api.post('email-sender/new', payload);

        if (response.data.status === 1) {
            showSuccessDialog.value = true;

            // Update current settings with new data
            currentSettings.value = response.data.admin_data;

            // Update initial values with new values
            initialForm.value = {
                email_username: form.email_username,
                email_address: form.email_address,
                email_name: form.email_name,
                email_port: form.email_port
            };

            // Clear password field after successful save
            form.email_password = '';

            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Email settings updated successfully',
                life: 3000
            });
        } else {
            throw new Error(response.data.error || 'Update failed');
        }
    } catch (error) {
        console.error('Error updating email settings:', error);

        let errorMessage = 'Failed to update email settings';
        if (error.response?.data?.error) {
            if (typeof error.response.data.error === 'object') {
                errorMessage = Object.values(error.response.data.error).flat().join(', ');
            } else {
                errorMessage = error.response.data.error;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const handleSuccessClose = () => {
    showSuccessDialog.value = false;
};
</script>

<style scoped>
.card {
    @apply bg-white rounded-lg shadow-sm p-6;
}

/* Custom styling for password field */
:deep(.p-password input) {
    width: 100%;
}
</style>
