<script setup>
import { useMenuStore } from '../store/menu';
import { computed } from 'vue';

const menuStore = useMenuStore();
const adminName = computed(() => menuStore.adminName); 
</script>
<template>
    <div class="p-10">
        <h1 class="text-4xl font-bold mb-6 text-gray-800 text-center">Welcome to ETEN Support</h1>
        <p class="text-lg mb-8 text-gray-600 text-center">Hi {{ adminName || 'admin' }}, let's begin your days by navigating through the functions from the left menu.</p>

        <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouterLink to="/om/listOrder" class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
                <i class="pi pi-briefcase text-4xl text-blue-600 mb-4"></i>
                <h2 class="text-xl font-semibold mb-2">Order Management</h2>
                <p class="text-gray-500 text-sm">Go to List Order</p>
            </RouterLink>

            <RouterLink to="/scm/listCollection" class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
                <i class="pi pi-sitemap text-4xl text-green-600 mb-4"></i>
                <h2 class="text-xl font-semibold mb-2">Supply Chain</h2>
                <p class="text-gray-500 text-sm">Go to CTC List Collection</p>
            </RouterLink>

            <RouterLink to="/marketing/ListNews" class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
                <i class="pi pi-megaphone text-4xl text-purple-600 mb-4"></i>
                <h2 class="text-xl font-semibold mb-2">Marketing</h2>
                <p class="text-gray-500 text-sm">Go to Marketing Module</p>
            </RouterLink>

            <RouterLink to="/technical/listClaim" class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
                <i class="pi pi-cog text-4xl text-red-600 mb-4"></i>
                <h2 class="text-xl font-semibold mb-2">Technical</h2>
                <p class="text-gray-500 text-sm">Go to List Claim</p>
            </RouterLink>
        </div> -->
    </div>
</template>
