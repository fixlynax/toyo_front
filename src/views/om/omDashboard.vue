<template>
  <div class="flex w-full">
    <div class="w-full card">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center gap-4">
          <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          <span class="text-muted-color">Loading dashboard data...</span>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>

        <!-- Summary Cards Grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- First 4 Cards in 3-column layout -->
          <template v-for="(card, i) in summaryCards.slice(0, 4)" :key="i">
            <RouterLink :to="card.path" class="col-span-12 lg:col-span-6 xl:col-span-3">
              <div class="card mb-0 shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-100 dark:border-surface-700 p-4 cursor-pointer">
                <div class="flex justify-between mb-4">
                  <div>
                    <span class="block text-muted-color font-medium mb-4">{{ card.title }}</span>
                    <div class="text-surface-800 dark:text-surface-0 font-medium text-2xl tracking-tight">
                      {{ card.value }}
                    </div>
                  </div>
                  <div class="flex items-center justify-center rounded-xl" :class="card.bg" style="width: 2.8rem; height: 2.8rem">
                    <i :class="card.icon"></i>
                  </div>
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <span class="text-primary font-semibold">{{ card.change }}</span>
                  <span class="text-muted-color">{{ card.description }}</span>
                </div>
              </div>
            </RouterLink>
          </template>

          <!-- Customer Card - Full width on mobile, half on desktop -->
          <RouterLink :to="summaryCards[4].path" class="col-span-12 lg:col-span-6">
            <div class="card mb-0 shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-100 dark:border-surface-700 p-4 cursor-pointer">
              <div class="flex justify-between mb-4">
                <div>
                  <span class="block text-muted-color font-medium mb-4">{{ summaryCards[4].title }}</span>
                  <div class="text-surface-900 dark:text-surface-0 font-medium text-2xl tracking-tight">
                    {{ summaryCards[4].value }}
                  </div>
                </div>
                <div class="flex items-center justify-center rounded-xl" :class="summaryCards[4].bg" style="width: 2.8rem; height: 2.8rem">
                  <i :class="summaryCards[4].icon"></i>
                </div>
              </div>
              <div class="flex items-center gap-1 text-sm">
                <span class="text-primary font-semibold">{{ summaryCards[4].change }}</span>
                <span class="text-muted-color">{{ summaryCards[4].description }}</span>
              </div>
            </div>
          </RouterLink>

          <!-- Quick Stats Card -->
          <div class="col-span-12 lg:col-span-6">
            <div class="card mb-0 shadow-sm border border-surface-100 dark:border-surface-700 p-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">Quick Statistics</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(stat, index) in quickStats" :key="index" class="text-center">
                  <div class="text-2xl font-bold text-primary mb-1">{{ stat.value }}</div>
                  <div class="text-xs text-muted-color">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/service/api'

const loading = ref(true)
const dashboardData = ref(null)

const summaryCards = ref([
  { 
    title: 'Total Order', 
    value: 0, 
    change: '', 
    description: 'compared to last month', 
    icon: 'pi pi-shopping-cart text-blue-500 !text-xl', 
    bg: 'bg-blue-100 dark:bg-blue-400/10', 
    path: '/om/listOrder' 
  },
  { 
    title: 'Total Back Order', 
    value: 0, 
    change: '', 
    description: 'from last month', 
    icon: 'pi pi-clock text-orange-500 !text-xl', 
    bg: 'bg-orange-100 dark:bg-orange-400/10', 
    path: '/om/listBackOrder' 
  },
  { 
    title: 'Total Return Order', 
    value: 0, 
    change: '', 
    description: 'this month', 
    icon: 'pi pi-refresh text-cyan-500 !text-xl', 
    bg: 'bg-cyan-100 dark:bg-cyan-400/10', 
    path: '/om/listReturnOrder' 
  },
  { 
    title: 'Sales Program', 
    value: 0, 
    change: '', 
    description: 'this month', 
    icon: 'pi pi-tag text-purple-500 !text-xl', 
    bg: 'bg-purple-100 dark:bg-purple-400/10', 
    path: '/om/listSalesProgram' 
  },
  { 
    title: 'Customer', 
    value: 0, 
    change: '', 
    description: 'this month', 
    icon: 'pi pi-users text-green-500 !text-xl', 
    bg: 'bg-green-100 dark:bg-green-400/10', 
    path: '/om/listEten' 
  }
])

const hardcodedData = {
  current_month: "11",
  last_month: "10",
  orders: { overall: 181 },
  backorders: { total_backorder: 119, status_0: 91 },
  return_orders: { total_return: 47, status_1: 7 },
  sales_program: { total_return: 33, total_status_1: 4 },
  dealers: { total_dealer: 33, total_status_1: 17 }
}

// Computed quick stats
const quickStats = computed(() => {
  if (!dashboardData.value) return []
  
  const d = dashboardData.value
  return [
    { label: 'Pending Backorders', value: d.backorders.status_0 },
    { label: 'Approved Returns', value: d.return_orders.status_1 },
    { label: 'Active Sales Programs', value: d.sales_program.total_status_1 },
    { label: 'Active Dealers', value: d.dealers.total_status_1 }
  ]
})

async function loadDashboard() {
  loading.value = true
  try {
    const res = await api.get('dashboard')
    if (res.data && res.data.status === 1) {
      dashboardData.value = res.data.admin_data
      updateCards(res.data.admin_data)
    } else {
      dashboardData.value = hardcodedData
      updateCards(hardcodedData)
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err)
    dashboardData.value = hardcodedData
    updateCards(hardcodedData)
  } finally {
    loading.value = false
  }
}

function updateCards(d) {
  summaryCards.value[0].value = d.orders.overall
  summaryCards.value[1].value = d.backorders.total_backorder
  summaryCards.value[2].value = d.return_orders.total_return
  summaryCards.value[3].value = d.sales_program.total_return
  summaryCards.value[4].value = d.dealers.total_dealer

  summaryCards.value[0].change = '+' + (Number(d.current_month) - Number(d.last_month))
  summaryCards.value[1].change = '+' + d.backorders.status_0
  summaryCards.value[2].change = '+' + d.return_orders.status_1
  summaryCards.value[3].change = '+' + d.sales_program.total_status_1
  summaryCards.value[4].change = '+' + d.dealers.total_status_1
}

onMounted(loadDashboard)
</script>

<style scoped>
.card {
  @apply bg-surface-0 dark:bg-surface-900 rounded-border;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.rounded-border {
  border-radius: 12px;
}
</style>