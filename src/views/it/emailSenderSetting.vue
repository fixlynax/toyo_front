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
                <!-- Sender Name -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">Sender Name</label>
                    <InputText v-model="form.email_name" placeholder="Enter sender display name" :disabled="loading" class="w-full" />
                </div>

                <!-- Sender Email -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">Sender Email</label>
                    <InputText v-model="form.email_address" placeholder="Enter sender email address" :disabled="loading" class="w-full" type="email" />
                </div>

                <!-- Outgoing SMTP Server -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">Outgoing SMTP Server</label>
                    <InputText v-model="form.smtp_server" placeholder="Enter SMTP server address" :disabled="loading" class="w-full" />
                </div>

                <!-- Outgoing Port No -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">Outgoing Port No</label>
                    <InputNumber v-model="form.email_port" placeholder="Enter SMTP port" :disabled="loading" class="w-full" :min="1" :max="65535" />
                </div>

                <!-- Username -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">Username</label>
                    <InputText v-model="form.email_username" placeholder="Enter SMTP username" :disabled="loading" class="w-full" />
                </div>

                <!-- Password (Required) -->
                <div class="flex flex-col gap-1">
                    <label class="block text-xm font-bold text-gray-700 mb-1">Password</label>
                    <Password v-model="form.email_password" placeholder="Enter SMTP password" :disabled="loading" class="w-full" :feedback="false" toggleMask />
                </div>
            </div>

            <!-- Password Required Info -->
            <div class="p-4 border border-amber-200 bg-amber-50 rounded-md">
                <div class="flex items-start gap-3">
                    <i class="pi pi-info-circle text-amber-600 mt-0.5"></i>
                    <div>
                        <div class="font-semibold text-amber-800">Reminder</div>
                        <ul class="text-sm text-amber-700 mt-1 list-disc list-inside space-y-1">
                            <li>Password field is now required and cannot be empty</li>
                            <li>Always provide the SMTP password when updating settings</li>
                            <li>Keep a secure record of the password</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Current Settings Display (Read-only) -->
            <div v-if="currentSettings" class="mt-4 p-4 border rounded-md bg-gray-50">
                <div class="text-sm font-semibold text-gray-700 mb-2">Current Settings (Read-only):</div>
                <div class="grid grid-cols-1 md:grid-cols-1 gap-3 text-xm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Last Updated:</span>
                        <span class="font-bold">{{ formatDate(currentSettings.created) }}</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 pt-4">
                <div class="w-40">
                    <Button label="Send Test Email" class="w-full p-button-secondary" @click="openTestEmailDialog" :disabled="loading" />
                </div>
                <div class="w-40">
                    <Button label="Update" class="w-full p-button-warning" @click="submitForm" :loading="loading" />
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
                <div class="text-gray-600">Email settings have been updated successfully.</div>
                <div class="flex justify-end gap-2">
                    <Button label="OK" class="p-button-primary" @click="handleSuccessClose" />
                </div>
            </div>
        </Dialog>

        <!-- Test Email Success Dialog -->
        <Dialog header="Test Email Sent" v-model:visible="showTestEmailSuccessDialog" :modal="true" :closable="true" :style="{ width: '500px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <i class="pi pi-check-circle text-green-500 text-2xl"></i>
                    <div class="text-lg font-semibold">Test Email Sent!</div>
                </div>
                <div class="text-gray-600">
                    Test email has been sent to <strong>{{ testEmailAddress }}</strong
                    >. Please check the inbox to verify the email settings.
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="OK" class="p-button-primary" @click="showTestEmailSuccessDialog = false" />
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
                <div class="text-gray-700">You are about to update email settings. This will replace all current settings including the password.</div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" class="p-button-secondary" @click="showConfirmDialog = false" />
                    <Button label="Update" class="p-button-warning" @click="confirmUpdate" />
                </div>
            </div>
        </Dialog>

        <!-- Send Test Email Dialog -->
        <Dialog header="Send Test Email" v-model:visible="showTestEmailDialog" :modal="true" :closable="true" :style="{ width: '500px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-4">
                <div class="mb-2">
                    <label class="block text-sm font-bold text-gray-700 mb-1">Recipient Email Address</label>
                    <InputText v-model="testEmailAddress" placeholder="Enter email address to send test" class="w-full" type="email" @keyup.enter="sendTestEmail" />
                    <div class="text-xs text-gray-500 mt-1">Enter the email address where you want to send the test email</div>
                </div>

                <div class="p-4 border border-blue-100 bg-blue-50 rounded-md">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
                        <div class="text-sm text-blue-700"><strong>Note:</strong> This will send a test email using the current email settings. Make sure to save your settings first if you've made any changes.</div>
                    </div>
                </div>

                <div class="flex justify-end gap-2">
                    <Button label="Cancel" class="p-button-secondary" @click="showTestEmailDialog = false" />
                    <Button label="Send Test Email" class="p-button-primary" @click="sendTestEmail" :loading="sendingTestEmail" :disabled="!isValidTestEmail" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const toast = useToast();

const form = reactive({
    email_username: '',
    email_password: '',
    email_address: '',
    email_name: '',
    email_port: null,
    smtp_server: ''
});

const initialForm = ref({});
const currentSettings = ref(null);
const loading = ref(false);
const sendingTestEmail = ref(false);
const showSuccessDialog = ref(false);
const showConfirmDialog = ref(false);
const showTestEmailSuccessDialog = ref(false);
const showTestEmailDialog = ref(false);
const testEmailAddress = ref('');

const isValidTestEmail = computed(() => {
    return testEmailAddress.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmailAddress.value);
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-MY', {
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
            form.smtp_server = response.data.admin_data.mailHost || '';
            form.email_password = ''; // Always empty on load for security

            // Store initial values
            initialForm.value = {
                email_username: response.data.admin_data.mailUsername || '',
                email_address: response.data.admin_data.mailAddress || '',
                email_name: response.data.admin_data.mailName || '',
                email_port: response.data.admin_data.mailPort ? parseInt(response.data.admin_data.mailPort) : null,
                smtp_server: response.data.admin_data.mailHost || ''
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
    // Validate required fields
    if (!form.email_name?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Sender Name is required',
            life: 3000
        });
        return false;
    }

    if (!form.email_address?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Sender Email is required',
            life: 3000
        });
        return false;
    }

    if (!isValidEmail(form.email_address)) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid',
            detail: 'Please enter a valid email address',
            life: 3000
        });
        return false;
    }

    if (!form.smtp_server?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Outgoing SMTP Server is required',
            life: 3000
        });
        return false;
    }

    if (!form.email_port) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Outgoing Port No is required',
            life: 3000
        });
        return false;
    }

    if (form.email_port < 1 || form.email_port > 65535) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid',
            detail: 'Port number must be between 1 and 65535',
            life: 3000
        });
        return false;
    }

    if (!form.email_username?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Username is required',
            life: 3000
        });
        return false;
    }

    // Password is now required
    if (!form.email_password?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Password is required',
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

const openTestEmailDialog = () => {
    // Pre-fill with sender email as a suggestion
    testEmailAddress.value = form.email_address || '';
    showTestEmailDialog.value = true;
};

const sendTestEmail = async () => {
    if (!testEmailAddress.value?.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Please enter an email address',
            life: 3000
        });
        return;
    }

    if (!isValidEmail(testEmailAddress.value)) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid',
            detail: 'Please enter a valid email address',
            life: 3000
        });
        return;
    }

    sendingTestEmail.value = true;
    showTestEmailDialog.value = false;

    try {
        const response = await api.post('email-sender/send-test', {
            email: testEmailAddress.value
        });

        if (response.data.status === 1) {
            showTestEmailSuccessDialog.value = true;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Test email sent to ${testEmailAddress.value}`,
                life: 3000
            });
        } else {
            throw new Error(response.data.error || 'Failed to send test email');
        }
    } catch (error) {
        console.error('Error sending test email:', error);

        let errorMessage = 'Failed to send test email';
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
        sendingTestEmail.value = false;
    }
};

const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    // Show confirmation dialog for update
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
        // Send all required fields including password
        const payload = {
            email_username: form.email_username.trim(),
            email_password: form.email_password.trim(),
            email_address: form.email_address.trim(),
            email_name: form.email_name.trim(),
            email_port: form.email_port
            // Note: smtp_server is not in the current API payload
            // You may need to adjust the API to accept this field
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
                email_port: form.email_port,
                smtp_server: form.smtp_server
            };

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
