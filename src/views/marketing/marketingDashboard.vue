<template>
    <div class="p-6 bg-gray-50 min-h-screen">
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
            
            <!-- Stats Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-gray-500 text-sm font-medium">Total TC Users</h3>
                            <p class="text-2xl font-bold text-gray-800 mt-2">{{ apiData.admin_data.total_tc_users }}</p>
                            <p class="text-xs text-gray-500 mt-1">0 submitted + 0 pending</p>
                        </div>
                        <div class="bg-blue-100 p-2 rounded-lg">
                            <i class="fas fa-users text-blue-500"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-gray-500 text-sm font-medium">Total Campaigns</h3>
                            <p class="text-2xl font-bold text-gray-800 mt-2">{{ apiData.admin_data.total_campaign }}</p>
                            <p class="text-xs text-gray-500 mt-1">0 submitted + 0 pending</p>
                        </div>
                        <div class="bg-green-100 p-2 rounded-lg">
                            <i class="fas fa-bullhorn text-green-500"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-gray-500 text-sm font-medium">Total Redemptions</h3>
                            <p class="text-2xl font-bold text-gray-800 mt-2">{{ apiData.admin_data.total_redemption }}</p>
                            <p class="text-xs text-gray-500 mt-1">0 submitted + 0 pending</p>
                        </div>
                        <div class="bg-purple-100 p-2 rounded-lg">
                            <i class="fas fa-gift text-purple-500"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-gray-500 text-sm font-medium">Games Played</h3>
                            <p class="text-2xl font-bold text-gray-800 mt-2">{{ apiData.admin_data.total_game_played }}</p>
                            <p class="text-xs text-gray-500 mt-1">0 submitted + 0 pending</p>
                        </div>
                        <div class="bg-orange-100 p-2 rounded-lg">
                            <i class="fas fa-gamepad text-orange-500"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const apiData = ref({
    status: 0,
    admin_data: {
        total_tc_users: 0,
        total_campaign: 0,
        total_redemption: 0,
        total_game_played: 0
    }
});

const loading = ref(true);

// Simulate API call
const fetchData = () => {
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

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.bg-blue-100 { background-color: #dbeafe; }
.bg-green-100 { background-color: #dcfce7; }
.bg-purple-100 { background-color: #f3e8ff; }
.bg-orange-100 { background-color: #ffedd5; }
</style>