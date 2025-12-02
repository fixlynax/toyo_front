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
  <div class="flex min-h-screen bg-primary-500 font-sans">
    <!-- Left Side: Background with overlay -->
        <Toast position="top-right" />
    <div
      class="hidden md:flex w-2/3 relative items-center justify-center overflow-hidden"
      style="clip-path: ellipse(150% 90% at 99% 10%);"
    >
      <img
        src="https://www.toyotires.com.my/wp-content/uploads/2023/02/Toyo-Japan-Trip-Day-4-380-scaled.jpg"
        alt="Background"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
      />
      <div class="absolute inset-0 bg-black/20 backdrop-blur-md"></div>

      <div class="relative z-10 text-center px-8 max-w-xl mx-auto space-y-4">
        <img src="/demo/images/toyo_logo.png" alt="Logo" class="h-20 mx-auto mb-4 object-contain animate-fade-in" />
        <div class="flex justify-center items-center gap-4 mx-auto">
          <img src="/demo/images/Toyo ETen App_colour_FINAL.png" alt="eTEN Logo" class="h-24 object-contain opacity-90" />
          <img src="/demo/images/Toyo TCare App_colour_FINAL.png" alt="Care Logo" class="h-24 object-contain opacity-90" />
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-2 animate-fade-in-up">TOYO Admin</h2>
        <p class="text-white/70 text-lg animate-fade-in-up">Welcome back! Please login to continue.</p>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="flex w-full md:w-1/3 items-center justify-center p-8 sm:p-10 bg-primary-500">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 sm:p-8 ">
        <div class="text-center mb-6">
          <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">Login to your account</h1>
          <p class="text-gray-600 dark:text-gray-300 text-base">Enter your credentials below</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email1" class="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Email</label>
            <InputText
              id="email1"
              type="email"
              placeholder="Email address"
              v-model="email"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              input-class="px-4 py-3 rounded-lg w-full focus:outline-none"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password1" class="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Password</label>
            <Password
              id="password1"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              :feedback="false"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              input-class="px-4 py-3 rounded-lg w-full focus:outline-none"
            />
          </div>

          <!-- Login Button -->
          <Button 
            type="submit" 
            label="Log In" 
            class="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-3 font-semibold transition" 
            :loading="loading" 
            :disabled="loading" 
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
}
</style>
