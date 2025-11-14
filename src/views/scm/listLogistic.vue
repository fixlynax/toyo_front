<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Logistic</div>

        <DataTable
            :value="logisticList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['companyname', 'storageLocationList', 'contactperson', 'phoneno']"
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

                    <!-- Right: Create Logistic Button -->
                    <RouterLink to="/scm/createlogistic">
                        <Button label="Create" type="button" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No logistic companies found. </template>
            <template #loading> Loading logistic data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="companyname" header="Company Name" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink :to="`/scm/detailLogistic/${data.id}`" class="hover:underline font-bold text-primary-400">
                        {{ data.companyname }}
                    </RouterLink>
                </template>
            </Column>
            <!-- <Column field="uname" header="Username" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.uname }}
                </template>
            </Column> -->
            <Column field="storageLocationList" header="Storage Location" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.storageLocationList }}
                </template>
            </Column>
            <Column field="contactperson" header="Contact Person" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.contactperson }}
                </template>
            </Column>
            <Column field="mobileno" header="Mobile No" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.mobileno }}
                </template>
            </Column>
            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="data.status === 1 ? 'Active' : 'Inactive'" 
                        :severity="getOverallStatusSeverity(data.status)" 
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListLogisticService } from '@/service/listLogistic';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
// Data variables
const logisticList = ref([]);
const loading = ref(true);
const filteredList = ref([]);
// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const sortMenu = ref();
const sortBy = (field, order) => {
    logisticList.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};
const sortItems = ref([
    {
        label: 'Sort by Company Name (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('companyname', 'asc')
    },
    {
        label: 'Sort by Company Name (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('companyname', 'desc')
    },
    {
        label: 'Sort by Storage Location (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('storageLocationList', 'asc')
    },
    {
        label: 'Sort by Status',
        icon: 'pi pi-check-circle',
        command: () => sortBy('status', 'asc')
    }
]);
// =========================
// Helper functions for status display
// =========================
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};

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
        const response = await api.get('3pl-users/list');
        // console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
                    logisticList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            logisticList.value = [];
            filteredList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching data list:', error);
        logisticList.value = [];
        filteredList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>