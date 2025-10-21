<template>
    <Fluid>
        <div class="card">
            <!-- Page Title -->
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List Catalogue</div>

            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <div class="flex items-center justify-between gap-4 w-full flex-wrap mb-6">
                <!-- Left: Search Field + Cog Button -->
                <div class="flex items-center gap-2 w-full max-w-md">
                    <IconField class="flex-1">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText 
                            v-model="searchQuery" 
                            placeholder="Quick Search" 
                            class="w-full" 
                        />
                    </IconField>
                    <Button type="button" icon="pi pi-cog" class="p-button" />
                </div>

                <!-- Right: Create Button -->
                <RouterLink to="/marketing/createCatalogue">
                    <Button type="button" label="Create" />
                </RouterLink>
            </div>

            <!-- ========================= -->
            <!-- Catalogue Grid -->
            <!-- ========================= -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <!-- Catalogue Card -->
                <RouterLink
                    v-for="catalog in filteredItems"
                    :key="catalog.id"
                    :to="`/marketing/detailCatalogue/${catalog.id}`"
                    class="flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                    <!-- Top: Image Section -->
                    <div class="w-full h-32 bg-gray-100 relative overflow-hidden rounded-t-2xl">
                        <!-- Status Badge -->
                        <div :class="['absolute top-2 right-2 whitespace-nowrap text-xs font-bold px-2 py-1 rounded-full shadow-md', catalog.available_qty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                            {{ catalog.available_qty > 0 ? 'In Stock' : 'Out of Stock' }}
                        </div>

                        <!-- Image -->
                        <img 
                            :src="catalog.imageURL || 'https://via.placeholder.com/150'" 
                            :alt="catalog.title" 
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                        />
                    </div>

                    <!-- Bottom: Info Section -->
                    <div class="p-4 bg-white flex flex-col gap-3">
                        <!-- Title -->
                        <div class="text-lg font-semibold text-gray-800 truncate">
                            {{ catalog.title }}
                        </div>
                        <div class="text-ml font-semibold text-gray-500 truncate">
                            Purpose: {{ catalog.purpose }}
                        </div>

                        <!-- Row 1: SKU + Type -->
                        <div class="flex items-center justify-between text-sm text-gray-600">
                            <span class="truncate">ID: {{ catalog.id }}</span>
                            <span class="truncate">{{ formatType(catalog.type) }}</span>
                        </div>

                        <!-- Row 2: Expiry + Balance -->
                        <div class="flex items-center justify-between text-sm font-medium">
                            <!-- Balance -->
                            <span class="text-gray-600">{{ catalog.available_qty }} / {{ catalog.total_qty }}</span>

                            <!-- Expiry with dynamic color -->
                            <span class="font-bold italic" :class="getExpiryClass(catalog.expiry)">
                                {{ formatExpiry(catalog.expiry) }}
                            </span>
                        </div>
                    </div>
                </RouterLink>
            </div>

            <!-- ========================= -->
            <!-- Empty State -->
            <!-- ========================= -->
            <div v-if="filteredItems.length === 0" class="text-center py-8 text-gray-500">
                No catalogue items found matching your search.
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8 text-gray-500">
                Loading catalogue items...
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '@/service/api';

// Data variables
const catalogueItems = ref([]);
const loading = ref(true);
const searchQuery = ref('');

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    try {
        loading.value = true;
        const response = await api.get('catalog/catalogList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            catalogueItems.value = response.data.admin_data.map((catalog) => ({
                id: catalog.id,
                type: catalog.type,
                imageURL: catalog.imageURL,
                title: catalog.title,
                description: catalog.description,
                purpose: catalog.purpose,
                total_qty: catalog.total_qty,
                available_qty: catalog.available_qty,
                expiry: catalog.expiry
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            catalogueItems.value = [];
        }
    } catch (error) {
        console.error('Error fetching catalogue list:', error);
        catalogueItems.value = [];
    } finally {
        loading.value = false;
    }
});

// =========================
// Computed Properties
// =========================
const filteredItems = computed(() => {
    if (!searchQuery.value) {
        return catalogueItems.value;
    }

    const query = searchQuery.value.toLowerCase();
    return catalogueItems.value.filter(catalog =>
        catalog.title?.toLowerCase().includes(query) ||
        catalog.type?.toLowerCase().includes(query) ||
        catalog.purpose?.toLowerCase().includes(query) ||
        catalog.description?.toLowerCase().includes(query) ||
        catalog.id?.toString().includes(query)
    );
});

// =========================
// Helper Functions
// =========================
const getExpiryClass = (expiryDate) => {
    if (!expiryDate) return 'text-black';
    
    try {
        // Parse DD-MM-YYYY format
        const [day, month, year] = expiryDate.split('-');
        const expiry = new Date(`${year}-${month}-${day}`);
        const today = new Date();

        // Reset time part for accurate day comparison
        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            // Expired
            return 'text-red-500';
        } else if (diffDays <= 3) {
            // Expiring within 3 days
            return 'text-yellow-500';
        } else {
            // Safe
            return 'text-green-500';
        }
    } catch (error) {
        console.error('Error parsing expiry date:', error);
        return 'text-black';
    }
};

const formatExpiry = (expiryDate) => {
    if (!expiryDate) return 'No expiry';
    
    try {
        // Convert DD-MM-YYYY to a more readable format
        const [day, month, year] = expiryDate.split('-');
        return `${day}/${month}/${year}`;
    } catch (error) {
        return expiryDate;
    }
};

const formatType = (type) => {
    const typeMap = {
        'ITEM': 'Item',
        'EWALLET': 'E-Wallet',
        'EVOUCHER': 'E-Voucher'
    };
    return typeMap[type] || type;
};

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/150';
};
</script>