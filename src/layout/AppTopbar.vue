<script setup>
import { useLayout } from '@/layout/composables/layout';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const { toggleMenu } = useLayout();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

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
            toast.add({ severity: 'info', summary: 'Logged out', detail: 'You have been logged out successfully.', life: 3000 });
        }
    });
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/demo/images/toyo_tires.png" alt="Logo" style="height: 25px; object-fit: contain" />
            </router-link>
        </div>

        <div class="layout-topbar-actions flex items-center gap-4">
            <span class="text-lg font-semibold text-gray-800">John Doe</span>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="confirmLogout">
                        <i class="pi pi-sign-out font-bold"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <ConfirmDialog />
    <Toast />
</template>
