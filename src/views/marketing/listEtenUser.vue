<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List User</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Users...'" :sub-message="'Fetching user data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <!-- Tab Menu for Status Filter -->
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

            <DataTable
                :value="filteredUsers"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['etenUserID', 'firstName', 'lastName', 'gender', 'race', 'state', 'level', 'memberSince', 'lastLogin', 'status']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
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
                            <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                        </div>

                        <!-- Right: Export Button -->
                        <Button 
                            type="button" 
                            label="Export" 
                            icon="pi pi-file-export" 
                            class="p-button-danger" 
                            @click="exportUsers" 
                        />
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No users found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading user data...</p>
                    </div>
                </template>

                <Column field="etenUserID" header="Mem Code" style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailEtenUser/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.etenUserID }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="name" header="Name" style="min-width: 8rem">
                    <template #body="{ data }"> 
                        {{ data.firstName }} {{ data.lastName }} 
                    </template>
                </Column>

                <Column field="gender" header="Gender" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ formatGender(data.gender) }}
                    </template>
                </Column>
                
                <Column field="race" header="Race" style="min-width: 6rem" />
                <Column field="state" header="State" style="min-width: 6rem" />
                <Column field="level" header="Level" style="min-width: 6rem" />
                
                <Column field="memberSince" header="Mem Since" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.memberSince) }}
                    </template>
                </Column>
                
                <Column field="lastLogin" header="Last Login" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDateTime(data.lastLogin) }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusText(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

// Data variables
const listData = ref([]);
const initialLoading = ref(true);
const tableLoading = ref(false);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Tabs for status filtering
const statusTabs = ref([
    { label: 'All Users' }, 
    { label: 'Active' }, 
    { label: 'Inactive' },
    { label: 'Deleted' }
]);
const activeTabIndex = ref(0);

// Computed: Filter listData based on active tab
const filteredUsers = computed(() => {
    switch (activeTabIndex.value) {
        case 0: // All Users
            return listData.value;
        case 1: // Active
            return listData.value.filter((user) => user.status === 1);
        case 2: // Inactive
            return listData.value.filter((user) => user.status == 0);
        case 3: // Deleted
            return listData.value.filter((user) => user.status == 9);
        default:
            return listData.value;
    }
});

onMounted(async () => {
    await fetchUsers();
});

const fetchUsers = async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('cares/userList');
        
        if (response.data.status === 1 && response.data.admin_data) {
            const allUsers = [
                ...(response.data.admin_data.active_user || []), 
                ...(response.data.admin_data.inactive_user || []),
                ...(response.data.admin_data.deleted_user || [])
            ];

            listData.value = allUsers.map((user) => ({
                id: user.id,
                etenUserID: user.member_code || '-',
                firstName: user.full_name || '-',
                lastName: '', // API only provides full_name, not separate first/last
                gender: user.gender || '-',
                race: user.race || '-',
                state: user.state || '-',
                level: user.member_level || '-',
                memberSince: user.member_since || '-',
                lastLogin: user.last_login || '-',
                status: user.status 
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail:response.data.message || 'Failed to load data', life: 3000 });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching user list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail:response.data.message || 'Failed to load data', life: 3000 });
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
};

const getOverallStatusSeverity = (status) => {
  const severityMap = {
    1: 'success',
    9: 'warn',
    0: 'danger'
  };
     return severityMap[status] || 'secondary';
}
const getStatusText = (status) => {
  const statusMap = {
    1: 'Active',
    9: 'Deleted',
    0: 'Inactive'
  };

  return statusMap[status] || 'Unknown';
};


const formatGender = (gender) => {
    if (!gender || gender === '-') return '-';
    if (gender === 'M' || gender === 'Male') return 'Male';
    if (gender === 'F' || gender === 'Female') return 'Female';
    return gender;
};

function formatDate(dateString) {
    if (!dateString) return '';

    // DD-MM-YYYY
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}


function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';

    const [datePart, timePart] = dateTimeString.split(' ');
    if (!datePart) return '';

    // DD-MM-YYYY
    const [day, month, year] = datePart.split('-');
    const date = new Date(`${year}-${month}-${day}T${timePart}`);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}


const exportUsers = () => {
    // Implement export functionality here
    // You can implement CSV/Excel export logic here
    alert('Export functionality to be implemented');
};
</script>

<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>