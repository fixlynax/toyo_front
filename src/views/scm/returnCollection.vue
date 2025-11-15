<template>
    <div class="card">
        <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-bold text-gray-800">CTC Return List</div>
            <Button icon="pi pi-upload" label="Bulk Update" class="p-button" />
        </div>

        <DataTable
            :value="collectionList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['claimRefNo', 'companyName1', 'custAccountNo', 'problem', 'warrantyCertNo', 'action']"
        >
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <!-- Right: Sorting Options -->

                </div>
            </template>
            
            <template #empty> No return records found. </template>
            <template #loading> Loading return data. Please wait. </template>

            <Column field="created" header="Create Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data?.created) ?? '-' }}
                </template>
            </Column>

            <Column field="claimRefNo" header="Ref No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/technical/detailWarantyClaim/${data.id}`" class="hover:underline font-bold text-primary">
                        {{ data.claimRefNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="custAccountNo" header="Customer Acc No" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.eten_data.custAccountNo }}
                </template>
            </Column>
            <Column field="companyName1" header="Customer Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.eten_data.companyName1 }}
                </template>
            </Column>
            <Column field="addressLine1" header="Collection Address" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ `${data.eten_data.addressLine1} ${data.eten_data.addressLine2} ${data.eten_data.addressLine4} ${data.eten_data.addressLine4} ${data.eten_data.city} ${data.eten_data.postcode} ${data.eten_data.state}`}}
                </template>
            </Column>
            <Column field="phoneNumber" header="Contact No" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.eten_data.phoneNumber }}
                </template>
            </Column>
            <Column field="totalTire" header="Pcs" style="min-width: 6rem">
                <template #body="{ data }">
                    <span class="font-bold">{{ data.totalTire }}</span>
                </template>
            </Column>
            <Column field="PL" header="Delivery Date" style="min-width: 8rem">
                <template #body="{ data }">

                </template>
            </Column>
            <Column field="PL" header="Delivered Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.PL }}
                </template>
            </Column>



            <Column field="action" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data?.action ?? 'PENDING'" :severity="getStatusSeverity(data.action)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListCollectionService } from '@/service/ListCollection';
import api from '@/service/api';

// Data variables
const loading = ref(false);
const collectionList = ref([]);
const sortMenu = ref();
// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const sortBy = (field, order) => {
  collectionList.value = [...collectionList.value].sort((a, b) => {
    // Helper to get nested value
    const getField = (obj) => {
      return field.split('.').reduce((acc, key) => (acc ? acc[key] : ''), obj) ?? '';
    };

    const aVal = getField(a).toString().toLowerCase();
    const bVal = getField(b).toString().toLowerCase();

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
const sortItems = ref([
    {
        label: 'Sort by Ref No (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('claimRefNo', 'asc')
    },
    {
        label: 'Sort by Ref No (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('claimRefNo', 'desc')
    },
    {
        label: 'Sort by Cust Acc No (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('eten_data.custAccountNo', 'asc')
    },
    {
        label: 'Sort by Company Name',
        icon: 'pi pi-globe',
        command: () => sortBy('eten_data.companyName1', 'asc')
    }
]);
// =========================
// Fetch data on mount
// =========================
    onMounted(async () => {
    loading.value = true;
        fetchData();
    loading.value = false;
    });

    function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    }
    function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    }
    function formatDateFull(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    }
const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('return-order/list');
        console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
                    collectionList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            collectionList.value = [];
            filteredList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        collectionList.value = [];
        filteredList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

// =========================
// Helper functions for status display
// =========================
const getStatusSeverity = (status) => {
  switch (status) {
    case 'REIMBURSEMENT':
      return 'warn';
    case 'REPLACEMENT':
      return 'success';
    default:
      return 'info';
  }
};
</script>
