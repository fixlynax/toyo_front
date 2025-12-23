<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Customer List</div>

        <!-- Use your custom LoadingPage component for initial load -->
        <LoadingPage v-if="loading" :message="'Loading Customer List...'" :sub-message="'Fetching your Customer list'" />

        <!-- DataTable only shows when not loading -->
        <DataTable
            v-else
            :value="filteredData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 50, 100]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :sortField="'created'"
            :sortOrder="-1"
            :globalFilterFields="['memberCode', 'custAccountNo', 'companyName1', 'city', 'state', 'phoneNumber', 'signboardType', 'status']"
            class="rounded-table"
        >
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Top Row: Search and Buttons -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Left: Search Field -->
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>
                        <div class="flex gap-2">
                            <!-- <Button type="button" label="Bulk Update" @click="fetchData" /> -->
                            <!-- Right: Create Customer Button -->
                            <!-- <RouterLink to="/om/createEten">
                                <Button type="button" label="Create" icon="pi pi-plus" />
                            </RouterLink> -->
                        </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                        <i class="pi pi-file-excel text-3xl text-yellow-400"></i>
                        <span class="text-lg">No customer data found</span>
                        <span class="text-sm text-gray-400">Try refreshing the page</span>
                    </div>
                </div>
            </template>

            <Column field="memberCode" header="Customer Code" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink :to="`/sales/detailCustomer/${data.custAccountNo}`" class="hover:underline font-bold text-primary-400">
                        {{ data.memberCode }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="created" header="CreatedTime" class="hidden" />

            <Column field="custAccountNo" header="Customer Account No" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                    <div class="flex flex-wrap gap-1 mt-1">
                        <!-- Main: if custAccountNo ends with 00 -->
                        <span v-if="String(data.custAccountNo).endsWith('00')" class="text-[10px] font-semibold text-white bg-blue-700 px-2 py-[2px] rounded shadow-sm"> Main </span>

                        <!-- Sub: otherwise -->
                        <span v-else class="text-[10px] font-semibold text-white bg-green-700 px-2 py-[2px] rounded shadow-sm"> Sub </span>
                    </div>
                </template>
            </Column>

            <Column field="companyName1" header="Company Name" style="min-width: 8rem" />

            <Column field="location" header="Location" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.city }}{{ data.state }} </template>
            </Column>

            <Column field="phoneNumber" header="Phone No" style="min-width: 8rem" />

            <Column field="signboardType" header="Signboard" style="min-width: 8rem" />

            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.masterStatus === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.masterStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const listData = ref([]);
const loading = ref(true);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Fetch all customer data on component mount
onMounted(async () => {
    try {
        loading.value = true;

        // Fetch all customer data without any filters
        const response = await api.post('list_dealer');

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const transformedData = [];

            Object.keys(adminData).forEach((key) => {
                const customer = adminData[key];
                const shop = customer.shop;

                // Find the master user (where isMaster = 1)
                const masterUser = customer.user_list?.find((user) => user.isMaster === 1);

                // Use master user status if available, otherwise fallback to shop status
                const masterStatus = masterUser ? masterUser.status : shop.status;

                // Add main branch only (removed sub-branches logic)
                transformedData.push({
                    id: shop.id,
                    memberCode: shop.memberCode || 'Untitled',
                    custAccountNo: shop.custAccountNo,
                    companyName1: shop.companyName1,
                    companyName2: shop.companyName2,
                    city: shop.city,
                    state: shop.state,
                    phoneNumber: shop.phoneNumber || '-',
                    signboardType: shop.signboardType || '-',
                    status: shop.status,
                    masterStatus: masterStatus,
                    user_list: customer.user_list,
                    created: shop.created
                });
            });

            listData.value = transformedData;

            // toast.add({
            //     severity: 'success',
            //     summary: 'Data Loaded',
            //     detail: `Loaded ${transformedData.length} customer records`,
            //     life: 2000
            // });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'No Data',
                detail: 'No customer data found',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load customer data',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
});

// Computed property for filtered data
const filteredData = computed(() => {
    return listData.value;
});

const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('bulkUpdCust');
        if (response.data.status === 1) {
            // Handle success
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to bulk update', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to bulk update', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

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
