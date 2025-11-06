<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';

const router = useRouter();
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

            // Store token in localStorage
            localStorage.setItem('auth_token', tokenData.access_token);
            localStorage.setItem('token_expires_at', tokenData.expires_at);
            localStorage.setItem('token_type', tokenData.token_type);

            // The token will now be automatically added to all future requests
            // via the axios interceptor in api.js

            // Redirect to dashboard or intended page
            router.push('/');
        } else {
            console.error('Login failed:', response.data);
            // Handle login error (show message to user)
        }
    } catch (error) {
        console.error('Login error:', error);
        // Handle error (show message to user)
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/demo/images/toyo_logo.png" alt="Logo" class="h-[35px] object-contain mb-20 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome TOYO Admin!</div>
                        <span class="text-muted-color font-medium">Log in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"> Email </label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"> Password </label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2" />
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <Button label="Log In" class="w-full" @click="handleLogin" :loading="loading" :disabled="loading" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
