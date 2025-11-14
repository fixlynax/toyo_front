<template>
  <div class="flex justify-center items-start w-full py-8">
    <div class="grid grid-cols-12 gap-8 w-full max-w-4xl">

      <!-- ===== 2x2 Grid of First 4 Cards ===== -->
      <template v-for="(card, i) in summaryCards" :key="i">
        <RouterLink v-if="i < 4" :to="card.path" class="col-span-12 sm:col-span-6">
          <div class="card mb-0 shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-100 dark:border-surface-700 p-4 cursor-pointer">
            <div class="flex justify-between mb-4">
              <div>
                <span class="block text-muted-color font-medium mb-2">{{ card.title }}</span>
                <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl tracking-tight">
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

      <!-- ===== Centered Customer Card ===== -->
      <RouterLink class="col-span-12 flex justify-center" :to="summaryCards[4].path">
        <div class="w-full sm:w-1/2">
          <div class="card mb-0 shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-100 dark:border-surface-700 p-4 cursor-pointer">
            <div class="flex justify-between mb-4">
              <div>
                <span class="block text-muted-color font-medium mb-2">{{ summaryCards[4].title }}</span>
                <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl tracking-tight">
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
        </div>
      </RouterLink>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const summaryCards = [
    { title: 'Total Order', value: '3,560', change: '+320', description: 'compared to last month', icon: 'pi pi-shopping-cart text-blue-500 !text-xl', bg: 'bg-blue-100 dark:bg-blue-400/10', path: '/om/listOrder' },
    { title: 'Total Back Order', value: '2,230', change: '+130', description: 'from last month', icon: 'pi pi-dollar text-orange-500 !text-xl', bg: 'bg-orange-100 dark:bg-orange-400/10', path: '/om/listBackOrder' },
    { title: 'Total Return Order', value: '65', change: '+12', description: 'this month', icon: 'pi pi-users text-cyan-500 !text-xl', bg: 'bg-cyan-100 dark:bg-cyan-400/10', path: '/om/listReturnOrder' },
    { title: 'Sales Program', value: '30', change: '+7', description: 'this month', icon: 'pi pi-comment text-purple-500 !text-xl', bg: 'bg-purple-100 dark:bg-purple-400/10', path: '/om/listSalesProgram' },
    { title: 'Customer', value: '30', change: '+7', description: 'this month', icon: 'pi pi-users text-green-500 !text-xl', bg: 'bg-green-100 dark:bg-green-400/10', path: '/om/listEten' }
];
</script>
