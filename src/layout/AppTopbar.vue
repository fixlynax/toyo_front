<script setup>
import { useLayout } from '@/layout/composables/layout';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useMenuStore } from '../store/menu';

const menuStore = useMenuStore();
const adminName = computed(() => menuStore.adminName);
const forceReset = computed(() => menuStore.forceReset);
const { toggleMenu } = useLayout();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const showSettingsMenu = ref(false);
const showChangePasswordDialog = ref(false);
const showForceResetDialog = ref(false);
const loading = ref(false);

// Password form data
const passwordForm = ref({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
});

// Watch for forceReset changes
watch(
    forceReset,
    (newValue) => {
        console.log('Force Reset changed:', newValue);
        if (newValue === 1) {
            // Show force reset dialog
            showForceResetDialog.value = true;
        }
    },
    { immediate: true }
);

// Initialize dialog on mount
onMounted(() => {
    if (forceReset.value === 1) {
        showForceResetDialog.value = true;
    }
});

const handleLogout = async () => {
    try {
        await api.post('logout');
        api.tokenService.logout();
        router.push('/auth/login');
    } catch (error) {
        console.error('Logout failed:', error);
        api.tokenService.logout();
        router.push('/auth/login');
    }
};

const confirmLogout = () => {
    confirm.require({
        message: 'Are you sure you want to log out?',
        header: 'Confirm Logout',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Yes, Logout',
        rejectLabel: 'Cancel',
        accept: async () => {
            await handleLogout();
            toast.add({
                severity: 'info',
                summary: 'Logged out',
                detail: 'You have been logged out successfully.',
                life: 3000
            });
        }
    });
};

const toggleSettingsMenu = (event) => {
    // Prevent event propagation to avoid immediate closing
    event?.stopPropagation();
    showSettingsMenu.value = !showSettingsMenu.value;
};

const openChangePassword = () => {
    // Reset form
    passwordForm.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    };
    showChangePasswordDialog.value = true;
    showSettingsMenu.value = false;
};

// Common password change function
const changePassword = async (isForceReset = false) => {
    loading.value = true;
    try {
        const response = await api.post('change-password', passwordForm.value);

        if (response.data.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || 'Password changed successfully',
                life: 5000
            });

            // Reset form
            passwordForm.value = {
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            };

            if (isForceReset) {
                // For force reset, close dialog and auto logout
                showForceResetDialog.value = false;

                // Add a small delay before logout to show success message
                setTimeout(() => {
                    handleLogout();
                }, 1500);
            } else {
                // For regular change, just close dialog
                showChangePasswordDialog.value = false;
            }
        }
    } catch (error) {
        console.error('Password change failed:', error);

        if (error.response?.data?.errors) {
            // Show validation errors
            const errors = error.response.data.errors;
            Object.keys(errors).forEach((field) => {
                toast.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: errors[field][0],
                    life: 5000
                });
            });
        } else {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });

            // If current password is incorrect in force reset mode, show specific message
            if (errorMessage.includes('Current password is incorrect') && isForceReset) {
                // Keep the force reset dialog open
                // No need to do anything else
            }
        }
    } finally {
        loading.value = false;
    }
};

// Handle force reset password
const handleForceReset = async () => {
    await changePassword(true);
};

// Close settings menu when clicking outside
const closeSettingsMenu = (event) => {
    const settingsContainer = event.target.closest('.settings-container');
    if (!settingsContainer) {
        showSettingsMenu.value = false;
    }
};

// Add click outside listener
const setupClickOutsideListener = () => {
    document.addEventListener('click', closeSettingsMenu);
};

// Remove click outside listener
const removeClickOutsideListener = () => {
    document.removeEventListener('click', closeSettingsMenu);
};

// Handle escape key to close menu - but not for force reset dialog
const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
        if (showSettingsMenu.value) {
            showSettingsMenu.value = false;
        }
        // Don't allow escape to close force reset dialog
        if (showForceResetDialog.value && forceReset.value === 1) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
};

// Set up event listeners
onMounted(() => {
    // Use setTimeout to avoid potential extension conflicts during initial load
    setTimeout(() => {
        setupClickOutsideListener();
    }, 100);

    document.addEventListener('keydown', handleEscapeKey);
});

// Clean up event listeners
onUnmounted(() => {
    removeClickOutsideListener();
    document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/demo/images/toyo_logo.png" alt="Logo" style="height: 25px; object-fit: contain" />
            </router-link>
        </div>

        <div class="layout-topbar-actions flex items-center gap-4">
            <!-- Admin info with avatar -->
            <div class="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {{ adminName ? adminName.charAt(0).toUpperCase() : 'A' }}
                </div>
                <span class="text-sm font-medium text-gray-700">{{ adminName || 'Loading...' }}</span>
            </div>

            <!-- Settings dropdown trigger -->
            <div class="relative settings-container">
                <button class="layout-topbar-action p-link settings-button" @click="toggleSettingsMenu" type="button">
                    <i class="pi pi-cog"></i>
                </button>

                <!-- Settings dropdown menu -->
                <Transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 scale-95 transform -translate-y-2"
                    enter-to-class="opacity-100 scale-100 transform translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100 transform translate-y-0"
                    leave-to-class="opacity-0 scale-95 transform -translate-y-2"
                >
                    <div v-if="showSettingsMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 settings-menu">
                        <div class="px-4 py-2 border-b border-gray-100">
                            <p class="text-xs font-medium text-gray-500">Account Settings</p>
                        </div>
                        <button @click="openChangePassword" class="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200" type="button">
                            <i class="pi pi-key mr-3 text-blue-500"></i>
                            <span>Change Password</span>
                        </button>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button @click="confirmLogout" class="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200" type="button">
                            <i class="pi pi-sign-out mr-3"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </div>

    <!-- Regular Change Password Dialog -->
    <Dialog v-model:visible="showChangePasswordDialog" modal header="Change Password" :style="{ width: '450px' }" :closable="!loading" :closeOnEscape="!loading" class="password-dialog">
        <div class="p-fluid">
            <div class="field mb-4">
                <label for="current_password" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <Password id="current_password" v-model="passwordForm.current_password" :feedback="false" toggleMask class="w-full custom-password" :disabled="loading" inputClass="w-full" :inputStyle="{ padding: '0.75rem' }" />
            </div>

            <div class="field mb-4">
                <label for="new_password" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Password id="new_password" v-model="passwordForm.new_password" toggleMask class="w-full custom-password" :disabled="loading" :feedback="true" inputClass="w-full" :inputStyle="{ padding: '0.75rem' }" />
                <small class="text-xs text-gray-500 mt-1 block">Must contain both letters and numbers, at least 8 characters.</small>
            </div>

            <div class="field mb-2">
                <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <Password id="new_password_confirmation" v-model="passwordForm.new_password_confirmation" :feedback="false" toggleMask class="w-full custom-password" :disabled="loading" inputClass="w-full" :inputStyle="{ padding: '0.75rem' }" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-secondary" @click="showChangePasswordDialog = false" :disabled="loading" />
                <Button label="Change Password" icon="pi pi-check" class="p-button-primary" @click="changePassword(false)" :loading="loading" :disabled="loading" />
            </div>
        </template>
    </Dialog>

    <!-- Force Reset Password Dialog -->
    <Dialog v-model:visible="showForceResetDialog" modal :closable="false" :closeOnEscape="false" :dismissableMask="false" :showHeader="true" header="Reset Required Password" :style="{ width: '450px' }" class="force-reset-dialog">
        <div class="force-reset-content">
            <div class="flex items-center mb-4 p-3 bg-yellow-50 rounded-lg">
                <i class="pi pi-exclamation-triangle text-yellow-600 text-xl mr-3"></i>
                <div>
                    <p class="text-sm font-medium text-yellow-800">Password Reset Required</p>
                    <p class="text-xs text-yellow-700 mt-1">You must reset your password before continuing.</p>
                </div>
            </div>

            <div class="p-fluid">
                <div class="field mb-4">
                    <label for="force_current_password" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <Password id="force_current_password" v-model="passwordForm.current_password" :feedback="false" toggleMask class="w-full custom-password" :disabled="loading" inputClass="w-full" :inputStyle="{ padding: '0.75rem' }" />
                </div>

                <div class="field mb-4">
                    <label for="force_new_password" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <Password id="force_new_password" v-model="passwordForm.new_password" toggleMask class="w-full custom-password" :disabled="loading" :feedback="true" inputClass="w-full" :inputStyle="{ padding: '0.75rem' }" />
                    <small class="text-xs text-gray-500 mt-1 block">Must contain both letters and numbers, at least 8 characters.</small>
                </div>

                <div class="field mb-2">
                    <label for="force_new_password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <Password
                        id="force_new_password_confirmation"
                        v-model="passwordForm.new_password_confirmation"
                        :feedback="false"
                        toggleMask
                        class="w-full custom-password"
                        :disabled="loading"
                        inputClass="w-full"
                        :inputStyle="{ padding: '0.75rem' }"
                    />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <Button label="Reset Password" icon="pi pi-check" class="p-button-primary" @click="handleForceReset" :loading="loading" :disabled="loading" />
            </div>
        </template>
    </Dialog>

    <ConfirmDialog />
    <Toast />
</template>

<style scoped>
.layout-topbar {
    background: #ffffff;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
}

.layout-topbar-logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.layout-menu-button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(39, 33, 33, 0.2);
    color: rgb(0, 0, 0);
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.layout-menu-button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.layout-topbar-logo {
    display: flex;
    align-items: center;
}

.settings-button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgb(0, 0, 0);
    border-radius: 8px;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.settings-menu {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.98);
}

:deep(.password-dialog),
:deep(.force-reset-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

:deep(.password-dialog .p-dialog-header),
:deep(.force-reset-dialog .p-dialog-header) {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    padding: 1.25rem 1.5rem;
}

:deep(.force-reset-dialog .p-dialog-header) {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

:deep(.password-dialog .p-dialog-content),
:deep(.force-reset-dialog .p-dialog-content) {
    padding: 1.5rem;
}

:deep(.custom-password .p-password input) {
    border-radius: 8px;
    border: 1px solid #d1d5db;
    transition: all 0.2s ease;
}

:deep(.custom-password .p-password input:focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.custom-password .p-icon-wrapper) {
    color: #6b7280;
}

:deep(.p-button) {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
}

:deep(.p-button-primary) {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border: none;
}

:deep(.p-button-primary:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

:deep(.p-button-text) {
    color: #6b7280;
}

:deep(.p-button-text:hover) {
    background: #f3f4f6;
    color: #374151;
}

:deep(.p-password-panel) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

:deep(.p-toast) {
    border-radius: 8px;
}

:deep(.p-toast .p-toast-message) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.p-confirm-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

:deep(.p-confirm-dialog .p-dialog-header) {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    padding: 1.25rem 1.5rem;
}

:deep(.p-confirm-dialog .p-dialog-content) {
    padding: 1.5rem;
}

.force-reset-content {
    position: relative;
}
</style>
