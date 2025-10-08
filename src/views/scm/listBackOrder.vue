<script setup>
import { onBeforeMount, ref } from 'vue'
import { CustomerService } from '@/service/CustomerService'
import { ProductService } from '@/service/ProductService'
import { ListBackOrderService } from '@/service/ListBackOrder'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

// States
const products = ref([])
const customers1 = ref([])
const filters1 = ref({})
const loading = ref(true)
const listData = ref([])

// Fetch data on mount
onBeforeMount(async () => {
  // Parallel fetching
  const [productData, customerData, backOrderData] = await Promise.all([
    ProductService.getProductsWithOrdersSmall(),
    CustomerService.getCustomersLarge(),
    ListBackOrderService.getListBackOrderData(),
  ])

  products.value = productData
  customers1.value = customerData.map(c => ({
    ...c,
    date: new Date(c.date),
  }))

  listData.value = backOrderData
  loading.value = false

  initFilters1()
})

// Initialize filters
function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    'country.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  }
}

// Helper function for status
function getOverallStatusSeverity(status) {
  return status === 1 ? 'success' : 'danger'
}
</script>

<template>
  <div class="card">
    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
      List Back Order
    </div>

    <DataTable
      :value="listData"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      :loading="loading"
      :filters="filters1"
    >
      <!-- Table Header -->
      <template #header>
        <div class="flex items-center justify-between gap-4 flex-wrap w-full">
          <div class="flex items-center gap-2 w-full max-w-md">
            <IconField class="flex-1">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters1.global.value"
                placeholder="Quick Search"
                class="w-full"
              />
            </IconField>
            <Button type="button" icon="pi pi-cog" class="p-button" />
          </div>
        </div>
      </template>

      <!-- Empty & Loading States -->
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait... </template>

      <!-- Columns -->
      <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 8rem">
        <template #body="{ data }">
          <RouterLink to="/om/detailBackOrder" class="hover:underline font-bold">
            {{ data.custAccountNo }}
          </RouterLink>
        </template>
      </Column>

      <Column field="customerName" header="Name" style="min-width: 8rem">
        <template #body="{ data }"> {{ data.customerName }} </template>
      </Column>

      <Column field="deliveryDate" header="Order Date" style="min-width: 8rem">
        <template #body="{ data }"> {{ data.deliveryDate }} </template>
      </Column>

      <Column header="Back Order Expiry" style="min-width: 8rem">
        <template #body="{ data }"> {{ data.expiry }} </template>
      </Column>

      <Column header="Status" style="min-width: 8rem">
        <template #body="{ data }">
          <Tag
            :value="data.orderStatus === 1 ? 'Active' : 'Deactive'"
            :severity="getOverallStatusSeverity(data.orderStatus)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}
:deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
