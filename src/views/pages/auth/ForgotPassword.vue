<template>
    <div class="flex min-h-screen bg-primary-400 font-sans">
        <!-- Left Side: Background with overlay -->
        <Toast position="top-right" />
        <div class="hidden md:flex w-2/3 relative items-center justify-center overflow-hidden" style="clip-path: ellipse(130% 91% at 99% 10%)">
            <div class="absolute inset-0 bg-black/30"></div>

            <div class="relative z-10 text-center px-8 max-w-xl mx-auto space-y-4">
                <img src="/demo/images/toyo_logo_auth.png" alt="Logo" class="h-20 mx-auto mb-4 object-contain animate-fade-in" />
                <div class="flex justify-center items-center gap-4 mx-auto">
                    <img src="/demo/images/Toyo ETen App_colour_FINAL.png" alt="eTEN Logo" class="h-24 object-contain opacity-90" />
                    <img src="/demo/images/Toyo TCare App_colour_FINAL.png" alt="Care Logo" class="h-24 object-contain opacity-90" />
                </div>
                <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-2 animate-fade-in-up">eTEN Support</h2>
                <p class="text-white/70 text-lg animate-fade-in-up">Reset your password to regain access to your account.</p>
            </div>
        </div>

        <!-- Right Side: Forgot Password Form -->
        <div class="flex w-full md:w-1/3 items-center justify-center p-8 sm:p-10 bg-primary-500">
            <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div class="text-center mb-6">
                    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">Forgot Password</h1>
                    <p class="text-gray-600 dark:text-gray-300 text-base">Enter your email to receive a temporary password</p>
                </div>

                <!-- Success Message (shown after successful request) -->
                <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <div class="flex items-center">
                        <i class="pi pi-check-circle text-green-500 text-xl mr-3"></i>
                        <div>
                            <p class="text-green-800 dark:text-green-300 font-medium">Temporary password sent!</p>
                            <p class="text-green-600 dark:text-green-400 text-sm mt-1">A temporary password has been sent to your email. Please check your inbox and use it to log in.</p>
                        </div>
                    </div>
                </div>

                <form v-if="!success" @submit.prevent="handleResetPassword" class="space-y-4 sm:space-y-6">
                    <!-- Email Input -->
                    <div>
                        <label for="resetEmail" class="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Email</label>
                        <InputText
                            id="resetEmail"
                            type="email"
                            placeholder="Enter your email address"
                            v-model="email"
                            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            input-class="px-4 py-3 rounded-lg w-full focus:outline-none"
                            :disabled="loading"
                        />
                        <small v-if="errors.email" class="text-red-500 text-sm mt-1 block">{{ errors.email }}</small>
                        <small v-if="apiErrors.email" class="text-red-500 text-sm mt-1 block">{{ apiErrors.email }}</small>
                    </div>

                    <!-- Action Buttons -->
                    <div class="space-y-3">
                        <Button type="submit" label="Send Temporary Password" class="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-3 font-semibold transition" :loading="loading" :disabled="loading || success" />

                        <div class="text-center">
                            <a href="#" @click.prevent="goToLogin" class="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200"> ← Back to Login </a>
                        </div>
                    </div>
                </form>

                <!-- Additional Instructions (shown after success) -->
                <div v-if="success" class="mt-6 text-center">
                    <p class="text-gray-600 dark:text-gray-300 mb-4">After logging in with the temporary password, you will be prompted to set a new password.</p>
                    <Button label="Go to Login" @click="goToLogin" class="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-3 font-semibold transition" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const email = ref('');
const loading = ref(false);
const success = ref(false);
const errors = reactive({});
const apiErrors = reactive({});

const handleResetPassword = async () => {
    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);
    Object.keys(apiErrors).forEach((key) => delete apiErrors[key]);

    // Validation
    if (!email.value.trim()) {
        errors.email = 'Email is required';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = 'Please enter a valid email address';
        return;
    }

    try {
        loading.value = true;

        // Call API to send temporary password
        const response = await api.post('forgot-password', {
            email: email.value.trim().toLowerCase()
        });

        if (response.data.status === 1) {
            success.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'A temporary password has been sent to your email address.',
                life: 5000
            });

            // Clear email field for security
            email.value = '';
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to process your request',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Reset password error:', error);

        let errorMessage = 'Something went wrong. Please try again.';

        if (error.response?.data) {
            const errorData = error.response.data;

            // Handle validation errors from API
            if (errorData.error) {
                // Laravel validation errors
                if (errorData.error.email) {
                    apiErrors.email = Array.isArray(errorData.error.email) ? errorData.error.email[0] : errorData.error.email;
                }
                errorMessage = 'Please check your input and try again';
            }

            // Handle specific error messages
            if (errorData.message) {
                if (errorData.message === 'User not found') {
                    apiErrors.email = 'No account found with this email address';
                } else {
                    errorMessage = errorData.message;
                }
            }
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

const goToLogin = () => {
    router.push('/auth/login');
};
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in {
    animation: fade-in 1s ease-out forwards;
}
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in-up {
    animation: fade-in-up 1s ease-out forwards;
}
</style>
