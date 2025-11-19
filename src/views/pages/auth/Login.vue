<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const email = ref('');
const password = ref('');
const checked = ref(false);
const loading = ref(false);

const handleLogin = async () => {
    try {
        loading.value = true;

        const loginData = {
            email: email.value,
            password: password.value
        };

        const response = await api.post('login', loginData);

        if (response.data.status === 1) {
            const tokenData = response.data.admin_data[0];

            localStorage.setItem('auth_token', tokenData.access_token);
            localStorage.setItem('token_expires_at', tokenData.expires_at);
            localStorage.setItem('token_type', tokenData.token_type);

            // Success toast
            toast.add({
                severity: 'success',
                summary: 'Login Successful',
                detail: 'Welcome back! Redirecting...',
                life: 3000
            });

            // Small delay to show the success message before redirect
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } else {
            console.error('Login failed:', response.data);
            // Error toast for login failure
            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail: response.data.message || 'Invalid email or password',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        // Error toast for network/API errors
        toast.add({
            severity: 'error',
            summary: 'Login Error',
            detail: error.response?.data?.message || 'An error occurred during login',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// Handle form submission (for Enter key)
const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    handleLogin();
};
</script>

<template>
    <div class="flex min-h-screen">
        <!-- Toast component -->
        <Toast position="top-right" />

        <!-- Left Side: Logo / Image -->
        <div class="hidden md:flex w-1/2 bg-gradient-to-b from-blue-300 to-blue-400 items-center justify-center">
            <div class="text-center px-8">
                <img src="/demo/images/toyo_logo.png" alt="Logo" class="h-20 mx-auto mb-6 object-contain" />
                <h2 class="text-3xl font-bold text-white mb-2">TOYO Admin</h2>
                <p class="text-white/80 text-lg">Welcome back! Please login to continue.</p>
            </div>
        </div>

        <!-- Right Side: Login Form -->
        <div class="flex w-full md:w-1/2 items-center justify-center bg-gray-300 dark:bg-gray-900 px-4">
            <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 sm:p-12">
                <div class="text-center mb-10">
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Login to your account</h1>
                    <p class="text-gray-500 dark:text-gray-300">Enter your credentials below</p>
                </div>

                <!-- Wrap form elements in a form tag -->
                <form @submit="handleSubmit" class="space-y-6">
                    <!-- Email Input -->
                    <div>
                        <label for="email1" class="block text-gray-700 dark:text-gray-200 font-medium mb-2"> Email </label>
                        <InputText
                            id="email1"
                            type="email"
                            placeholder="Email address"
                            v-model="email"
                            class="w-full border-gray-300 dark:border-gray-600 rounded-lg"
                            input-class="w-full px-4 py-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition"
                        />
                    </div>

                    <!-- Password Input -->
                    <div>
                        <label for="password1" class="block text-gray-700 dark:text-gray-200 font-medium mb-2"> Password </label>
                        <Password
                            id="password1"
                            v-model="password"
                            placeholder="Password"
                            :toggleMask="true"
                            :feedback="false"
                            class="w-full border-gray-300 dark:border-gray-600 rounded-lg"
                            input-class="w-full px-4 py-3 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition"
                        />
                    </div>

                    <!-- Login Button -->
                    <Button type="submit" label="Log In" class="w-full bg-primary text-white rounded-lg py-3 font-semibold hover:bg-primary-dark transition" :loading="loading" :disabled="loading" />
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Adjust password eye icon size to match input height */
.pi-eye,
.pi-eye-slash {
    transform: scale(1.2);
    margin-right: 0.5rem;
}
</style>
