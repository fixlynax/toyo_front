<template>
    <div class="p-6 bg-gray-50 ">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Marketing Dashboard</h1>
        </div>

        <div class="border-t border-gray-300 my-6"></div>

        <!-- Summary Section -->
        <div class="mb-8">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p class="text-gray-600">Loading dashboard data...</p>
            </div>
            
            <!-- Stats Grid - Updated card design to match UI image -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Total TC Users Card -->
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-center">
                        <h3 class="text-gray-500 text-sm font-medium mb-2">Total TC Users</h3>
                        <p class="text-3xl font-bold text-gray-800 mb-2">{{ apiData.total_tc_users }}</p>
                        <div class="text-xs text-gray-500">
                        </div>
                    </div>
                </div>
                
                <!-- Total Campaigns Card -->
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-center">
                        <h3 class="text-gray-500 text-sm font-medium mb-2">Total Campaigns</h3>
                        <p class="text-3xl font-bold text-gray-800 mb-2">{{ apiData.total_campaign }}</p>
                        <div class="text-xs text-gray-500">
                        </div>
                    </div>
                </div>
                
                <!-- Total Redemptions Card -->
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-center">
                        <h3 class="text-gray-500 text-sm font-medium mb-2">Total Redemptions</h3>
                        <p class="text-3xl font-bold text-gray-800 mb-2">{{ apiData.total_redemption }}</p>
                        <div class="text-xs text-gray-500">
                        </div>
                    </div>
                </div>
                
                <!-- Games Played Card -->
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-center">
                        <h3 class="text-gray-500 text-sm font-medium mb-2">Games Played</h3>
                        <p class="text-3xl font-bold text-gray-800 mb-2">{{ apiData.total_game_played }}</p>
                        <div class="text-xs text-gray-500">
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
</template>

<!-- KEEPING ALL CODE BELOW EXACTLY THE SAME -->
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/service/api';

const apiData = ref({});



const loading = ref(true);

// Simulate API call
const fetchData1 = () => {
    loading.value = true;
    
    setTimeout(() => {
        apiData.value = {
            "status": 1,
            "admin_data": {
                "total_tc_users": 7,
                "total_campaign": 25,
                "total_redemption": 10,
                "total_game_played": 2
            }
        };
        
        loading.value = false;
    }, 1000);
};

const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get(`marketingDashboard`);
        if ( (response.data.admin_data)) {
            // response.data.status === 1 &&
            apiData.value = response.data.admin_data;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching data list:', error);
        apiData.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.bg-blue-100 { background-color: #82b0ec; }
.bg-green-100 { background-color: #dcfce7; }
.bg-purple-100 { background-color: #f3e8ff; }
.bg-orange-100 { background-color: #ffedd5; }
</style>