<script setup>
import { ListRedeemService } from '@/service/ListRedeem';
import { onBeforeMount, ref, computed } from 'vue';

const listData = ref([]);
const filteredData = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all'); // Default to search all
const selectedFilter = ref(''); // For specific filter values

// Map status → label
const getOverallStatusLabel = (status) => {
    if (status === '0') return 'Pending';
    if (status === '1') return 'Approved';
    if (status === '2') return 'Rejected';
    if (status === 'Shipped') return 'Shipped';
    return 'Unknown';
};

// Map status → severity
const getOverallStatusSeverity = (status) => {
    if (status === '0') return 'warn';
    if (status === '1') return 'success';
    if (status === '2') return 'danger';
    if (status === 'Shipped') return 'success';
    return 'secondary';
};

// Filter options
const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Status', value: 'status' },
    { label: 'Item Name', value: 'itemName' }
];

// Status filter options
const statusOptions = [
    { label: 'Pending', value: '0' },
    { label: 'Approved', value: '1' },
    { label: 'Rejected', value: '2' }
];

// Item name filter options (you can modify these based on your actual data)
const itemNameOptions = [
    { label: 'Umbrella', value: 'Umbrella' },
    { label: 'Tumbler', value: 'Tumbler' },
    { label: 'Pen', value: 'Pen' },
    { label: 'Charms', value: 'Charms' }
];

// Computed property for current filter options
const currentFilterOptions = computed(() => {
    switch (selectedCategory.value) {
        case 'status':
            return statusOptions;
        case 'itemName':
            return itemNameOptions;
        default:
            return [];
    }
});

// Reset filter when category changes
const handleCategoryChange = () => {
    selectedFilter.value = '';
    filterData();
};

// Handle filter selection change
const handleFilterChange = () => {
    filterData();
};

// Handle search input
const handleSearch = () => {
    filterData();
};

// Filter data based on search query and selected filters
const filterData = () => {
    if (!searchQuery.value.trim() && !selectedFilter.value) {
        filteredData.value = listData.value;
        return;
    }

    const query = searchQuery.value.toLowerCase().trim();
    
    filteredData.value = listData.value.filter(item => {
        // Apply category filter first
        let categoryMatch = true;
        if (selectedFilter.value) {
            switch (selectedCategory.value) {
                case 'status':
                    categoryMatch = item.status === selectedFilter.value;
                    break;
                case 'itemName':
                    categoryMatch = item.itemName === selectedFilter.value;
                    break;
            }
        }

        // Then apply search query
        let searchMatch = true;
        if (query) {
            switch (selectedCategory.value) {
                case 'status':
                    const statusLabel = getOverallStatusLabel(item.status);
                    searchMatch = statusLabel.toLowerCase().includes(query);
                    break;
                case 'itemName':
                    searchMatch = item.itemName?.toLowerCase().includes(query);
                    break;
                case 'all':
                default:
                    searchMatch = (
                        item.refno?.toLowerCase().includes(query) ||
                        item.recipientName?.toLowerCase().includes(query) ||
                        item.itemName?.toLowerCase().includes(query) ||
                        item.quantity?.toString().includes(query) ||
                        item.redemptionDate?.toLowerCase().includes(query) ||
                        getOverallStatusLabel(item.status).toLowerCase().includes(query)
                    );
                    break;
            }
        }

        return categoryMatch && searchMatch;
    });
};

// Clear all filters
const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
    selectedFilter.value = '';
    filteredData.value = listData.value;
};

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListRedeemService.getListRedeemData();
    filteredData.value = listData.value;
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Details Redemption</div>
        <DataTable :value="filteredData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <template #header>
                <div class="flex flex-col gap-4">
                    <!-- Filter Controls - All in One Line -->
                    <div class="flex items-center justify-between gap-2 w-full">
                        <!-- Left: Filter Controls -->
                        <div class="flex items-center gap-2 flex-1">
                            <!-- Category Dropdown -->
                            <div class="flex flex-col">
                                <label class="text-sm font-medium text-gray-600 mb-1">Filter by</label>
                                <Dropdown 
                                    v-model="selectedCategory" 
                                    :options="filterOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    class="w-30"
                                    @change="handleCategoryChange"
                                />
                            </div>
                            
                            <!-- Specific Filter Dropdown -->
                            <div class="flex flex-col" v-if="selectedCategory !== 'all'">
                                <label class="text-sm font-medium text-gray-600 mb-1">
                                    {{ selectedCategory === 'status' ? 'Status' : 'Item Name' }}
                                </label>
                                <Dropdown 
                                    v-model="selectedFilter" 
                                    :options="currentFilterOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    :placeholder="`Select ${selectedCategory}`"
                                    class="w-32"
                                    @change="handleFilterChange"
                                />
                            </div>

                            <!-- Search Input -->
                            <div class="flex flex-col flex-1 min-w-60">
                                <label class="text-sm font-medium text-gray-600 mb-1">Search</label>
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                        v-model="searchQuery" 
                                        :placeholder="selectedCategory === 'all' ? 'Search all...' : `Search in ${selectedCategory}...`" 
                                        class="w-full" 
                                        @input="handleSearch"
                                    />
                                </IconField>
                            </div>

                            <!-- Settings Button -->
                            <div class="flex flex-col justify-end">
                                <Button type="button" icon="pi pi-cog" class="p-button" />
                            </div>
                        </div>

                        <!-- Right: Export & Template Buttons -->
                        <div class="flex items-center gap-2">
                            <Button type="button" label="Update" icon="pi pi-sync" class="p-button-success" />
                            <Button type="button" label="Template" icon="pi pi-download" class="p-button-danger" />
                        </div>
                    </div>

                    <!-- Active Filters Display -->
                    <div v-if="selectedFilter || searchQuery" class="flex items-center gap-2 text-sm">
                        <span class="text-gray-600">Active filters:</span>
                        <Tag v-if="selectedCategory !== 'all'" :value="`${selectedCategory}: ${selectedFilter}`" severity="info" />
                        <Tag v-if="searchQuery" :value="`Search: ${searchQuery}`" severity="info" />
                    </div>
                </div>
            </template>

            <template #empty> 
                No redemption records found. 
            </template>
            <template #loading> 
                Loading redemption data. Please wait. 
            </template>
            
            <!-- Columns -->
            <Column field="refno" header="Ref No" sortable style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailRedemption" class="hover:underline font-bold">
                        {{ data.refno }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="memberName" header="Member Name" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.recipientName }}
                </template>
            </Column>
            <Column field="itemName" header="Item Name" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.itemName }}
                </template>
            </Column>
            <Column field="quantity" header="Quantity" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.quantity }}
                </template>
            </Column>
            <Column field="RedemptionDate" header="Redemption Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.redemptionDate }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>