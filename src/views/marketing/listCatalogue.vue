<template>
    <Fluid>
        <div class="card">
            <!-- Page Title -->
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Reward Catalogue List</div>

            <div class="flex items-center justify-between gap-4 w-full flex-wrap mb-6">
                <!-- Left: Search Field + Cog Button -->
                <div class="flex items-center gap-2 w-full max-w-md">
                    <IconField class="flex-1">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="searchQuery" placeholder="Quick Search" class="w-full" />
                    </IconField>
                    <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                </div>

                <!-- Right: Create Button -->
                <div class="flex items-center gap-2 ml-auto"></div>
                <div>
                    <Button type="button" label="Export" icon="pi pi-file-export"   style="width: fit-content" class="p-button-success" :loading="exportLoading" @click="fetchExport" />
                </div>
                <div>
                    <RouterLink v-if="canUpdate" to="/marketing/createCatalogue">
                        <Button type="button" label="Create"  style="width: fit-content" />
                    </RouterLink>
                </div>
            </div>

            <!-- Tab Menu for filtering by purpose -->
            <TabMenu :model="purposeTabs" v-model:activeIndex="activeTabIndex" class="mb-4 border-b" />

            <!-- Use your custom LoadingPage component -->
            <LoadingPage v-if="loading" :sub-message="'Loading Catalogue Item'" class="mt-8" />

            <div v-else-if="error" class="text-center py-8 text-red-500">
                <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                <p>{{ error }}</p>
                <Button @click="fetchCatalogueItems" label="Retry" class="p-button-outlined mt-4" />
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <!-- Catalogue Card -->
                <RouterLink
                    v-for="(item, index) in filteredItems"
                    :key="item.id || index"
                    :to="`/marketing/detailCatalogue/${item.id}`"
                    class="flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                    <!-- Top: Image Section -->
                    <div class="w-full h-32 bg-gray-100 relative overflow-hidden rounded-t-2xl">
                        <!-- Status Badge -->
                        <div :class="['absolute top-2 right-2 whitespace-nowrap text-xs font-bold px-2 py-1 rounded-full shadow-md', item.available_qty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                            {{ item.available_qty > 0 ? 'In Stock' : 'Out of Stock' }}
                        </div>

                        <!-- Image -->
                        <img :src="item.imageURL" :alt="item.title" class="w-full h-full object-cover" />
                    </div>

                    <!-- Bottom: Info Section -->
                    <div class="p-4 bg-white flex flex-col gap-3">
                        <!-- Title -->
                        <div class="text-lg font-semibold text-gray-800 truncate">
                            {{ item.title }}
                        </div>
                        <div class="text-ml font-bold text-primary-400 truncate">
                            {{ item.purpose }}
                        </div>

                        <!-- Row 1: Type -->
                        <div class="flex items-center justify-between text-sm text-gray-600">
                            <span class="truncate">{{ formatType(item.type) }}</span>
                        </div>

                        <!-- Row 2: Available + Expiry -->
                        <div class="flex items-center justify-between text-sm font-medium">
                            <!-- Available Quantity -->
                            <span class="text-gray-600">{{ item.available_qty }} / {{ item.total_qty }}</span>

                            <!-- Expiry with dynamic color -->
                            <span class="font-bold italic" :class="getExpiryClass(item.expiry)">
                                {{ formatExpiryDate(item.expiry) }}
                            </span>
                        </div>
                    </div>
                </RouterLink>
            </div>

            <div v-if="!loading && !error && filteredItems.length === 0" class="text-center py-8 text-gray-500">No catalogue items found {{ activeTabIndex > 0 ? `for ${purposeTabs[activeTabIndex].label}` : '' }}.</div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';
import { useToast } from 'primevue/usetoast';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Reward Catalogue'));
const denyAccess = computed(() => menuStore.canTest('Reward Catalogue'));

// Reactive data
const searchQuery = ref('');
const catalogueItems = ref([]);
const loading = ref(false);
const error = ref('');
const toast = useToast();
const exportLoading = ref(false);


// Tab Menu Configuration
const purposeTabs = [
    { label: 'All', purpose: '' },
    { label: 'Catalog', purpose: 'CATALOG' },
    { label: 'Campaign', purpose: 'CAMPAIGN' },
    { label: 'Game', purpose: 'GAME' }
];
const activeTabIndex = ref(0);

onMounted(() => {
    fetchCatalogueItems();
});

const fetchCatalogueItems = async () => {
    loading.value = true;
    error.value = '';

    try {
        const response = await api.get('catalog/catalogList');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            catalogueItems.value = response.data.admin_data.map((item) => ({
                ...item,
                // Ensure imageURL is properly formatted
                imageURL: item.imageURL || null
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
            catalogueItems.value = [];
        }
    } catch (err) {
        console.error('Error fetching catalogue items:', err);
        toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        catalogueItems.value = [];
    } finally {
        loading.value = false;
    }
};

const fetchExport = async () => {
    try {
        exportLoading.value = true;

        // get selected tab purpose
        const selectedPurpose = purposeTabs[activeTabIndex.value].purpose;

        // filter items based on tab
        const filteredItems = selectedPurpose
            ? catalogueItems.value.filter(
                  item => item.purpose === selectedPurpose
              )
            : catalogueItems.value; // "All" tab

        const body = {
            catalog_ids: JSON.stringify(filteredItems.map(item => item.id))
        };

        const response = await api.postExtra(
            'excel/export-availableQty-catalog',
            body,
            { responseType: 'arraybuffer' }
        );

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Catalog_Report.xlsx';
        a.click();
        URL.revokeObjectURL(url);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Export completed',
            life: 3000
        });
    } catch (error) {
        console.error('Export error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Export failed',
            life: 3000
        });
    } finally {
        exportLoading.value = false;
    }
};


// Filter items based on active tab and search query
const filteredItems = computed(() => {
    let filtered = catalogueItems.value;

    // Filter by active tab (purpose)
    const activeTab = purposeTabs[activeTabIndex.value];
    if (activeTab.purpose) {
        filtered = filtered.filter((item) => item.purpose === activeTab.purpose);
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((item) => item.title?.toLowerCase().includes(query) || item.type?.toLowerCase().includes(query) || item.purpose?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query));
    }

    return filtered;
});

const getExpiryClass = (expiryDate) => {
    if (!expiryDate) return 'text-gray-500';

    try {
        const today = new Date();
        // Convert DD-MM-YYYY to YYYY-MM-DD for proper Date parsing
        const [day, month, year] = expiryDate.split('-');
        const expiry = new Date(`${year}-${month}-${day}`);

        // Handle invalid dates
        if (isNaN(expiry.getTime())) {
            return 'text-gray-500';
        }

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
            return 'text-green-600';
        }
    } catch (error) {
        console.error('Error parsing expiry date:', error);
        return 'text-gray-500';
    }
};

const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return 'No expiry';

    try {
        // Convert from DD-MM-YYYY to DD/MM/YYYY format
        const [day, month, year] = expiryDate.split('-');
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting expiry date:', error);
        return 'Invalid date';
    }
};

const formatType = (type) => {
    const typeMap = {
        ITEM: 'Item',
        EWALLET: 'E-Wallet',
        EVOUCHER: 'E-Voucher'
    };
    return typeMap[type] || type;
};

// Watch for tab changes to update the filtered items
watch(activeTabIndex, () => {
    // The computed property filteredItems will automatically update
});
</script>
<style scoped>
/* Remove the default top highlight and apply bottom border instead */
.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link {
    border-top: none !important;
    border-bottom: 3px solid var(--primary-color) !important;
    color: var(--primary-color);
}

/* Ensure non-active tabs have no bottom border */
.p-tabmenu .p-tabmenu-nav .p-menuitem-link {
    border: none;
    border-radius: 0;
    background: transparent;
    transition: all 0.2s ease;
}

/* Optional: subtle hover effect */
.p-tabmenu .p-tabmenu-nav .p-menuitem-link:hover {
    color: var(--primary-color);
    background-color: rgba(var(--primary-color-rgb), 0.05);
}
</style>
