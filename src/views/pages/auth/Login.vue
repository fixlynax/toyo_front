<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
    try {
        loading.value = true;
        const loginData = { email: email.value, password: password.value };
        const response = await api.post('login', loginData);

        if (response.data.status === 1) {
            const tokenData = response.data.admin_data[0];
            localStorage.setItem('auth_token', tokenData.access_token);
            localStorage.setItem('token_expires_at', tokenData.expires_at);
            localStorage.setItem('token_type', tokenData.token_type);

            toast.add({
                severity: 'success',
                summary: 'Login Successful',
                detail: 'Welcome back! Redirecting...',
                life: 3000
            });

            setTimeout(() => router.push('/'), 1000);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail: response.data.message || 'Invalid email or password',
                life: 5000
            });
        }
    } catch (error) {
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

const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
};
</script>

<template>
    <div class="flex min-h-screen">
        <!-- Left Side: Logo / Background -->
        <div
            class="hidden md:flex w-2/3 items-center justify-center p-10 relative overflow-hidden"
            style="
                clip-path: ellipse(150% 90% at 93% 10%);
                background-image: url('https://staticnews.motortrader.com.my/media/Toyo-PXSP2-Launch-001-copy-0.jpg'), linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
                background-repeat: no-repeat, no-repeat;
                background-position: center, center;
                background-size: cover;
            "
        >
            <div class="text-center relative z-10">
                <img src="/demo/images/toyo_logo.png" alt="Logo" class="h-20 mx-auto mb-6 object-contain" />

                <div class="flex justify-center items-center gap-4 mb-6">
                    <img src="/demo/images/Toyo ETen App_colour_FINAL.png" alt="eTEN Logo" class="h-32 object-contain opacity-90" />
                    <img src="/demo/images/Toyo TCare App_colour_FINAL.png" alt="Care Logo" class="h-32 object-contain opacity-90" />
                </div>

                <h2 class="text-3xl font-bold text-white mb-2">TOYO Admin</h2>
                <p class="text-white/80 text-lg">Welcome back! Please login to continue.</p>
            </div>
        </div>

        <!-- Right Side: Login Form -->
        <div class="flex w-full md:w-1/3 items-center bg-gray-200 justify-center p-6 sm:p-10">
            <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10">
                <div class="text-center mb-8 sm:mb-10">
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Login to your account</h1>
                    <p class="text-gray-500 dark:text-gray-300 text-base">Enter your credentials below</p>
                </div>

                <form @submit="handleSubmit" class="space-y-5 sm:space-y-6">
                    <!-- Email Input -->
                    <div>
                        <label for="email1" class="block text-gray-700 dark:text-gray-200 font-medium mb-2">Email</label>
                        <InputText
                            id="email1"
                            type="email"
                            placeholder="Email address"
                            v-model="email"
                            class="w-full border-gray-300 dark:border-gray-600 rounded-lg"
                            input-class="w-full px-3 py-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition"
                        />
                    </div>

                    <!-- Password Input -->
                    <div>
                        <label for="password1" class="block text-gray-700 dark:text-gray-200 font-medium mb-2">Password</label>
                        <Password
                            id="password1"
                            v-model="password"
                            placeholder="Password"
                            :toggleMask="true"
                            :feedback="false"
                            class="w-full border-gray-300 dark:border-gray-600 rounded-lg"
                            input-class="w-full px-3 py-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition"
                        />
                    </div>

                    <!-- Login Button -->
                    <Button type="submit" label="Log In" class="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-primary-dark transition" :loading="loading" :disabled="loading" />
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye,
.pi-eye-slash {
    transform: scale(1.2);
    margin-right: 0.5rem;
}
</style>
