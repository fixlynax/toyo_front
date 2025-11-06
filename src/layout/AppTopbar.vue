<script setup>
import { useLayout } from '@/layout/composables/layout';
import api from '@/service/api';
import { useRouter } from 'vue-router';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();

const handleLogout = async () => {
    try {
        // Call the logout API
        await api.post('logout');
        
        // Remove token and redirect
        api.tokenService.logout();
        
        // Redirect to login page
        router.push('/auth/login');
    } catch (error) {
        console.error('Logout failed:', error);
        // Even if API call fails, clear local token and redirect
        api.tokenService.logout();
        router.push('/auth/login');
    }
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/demo/images/toyo_tires.png" alt="Logo" style="height: 35px; object-fit: contain;" />
            </router-link>
        </div>

        <div class="layout-topbar-separator">
            <span class="text-xl font-bold ml-5">John Doe</span>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <!-- Dark mode toggle commented out -->
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="handleLogout">
                        <i class="pi pi-user font-bold"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>