<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Sales Program'));

const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

// UPDATED Helper function to determine status based on period AND original status
const getStatusFromPeriod = (startDate, endDate, originalStatus) => {
    // Create dates at the start of the day for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const start = new Date(startDate);
    const startAtDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    const end = new Date(endDate);
    const endAtDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // Adjust end date to include the full end day (until midnight of next day)
    const endAtDayAdjusted = new Date(endAtDay);
    endAtDayAdjusted.setDate(endAtDayAdjusted.getDate() + 1);

    // UPDATED LOGIC BASED ON REQUIREMENTS:
    // 1. If originalStatus is 0 (inactive), always return Inactive
    // 2. If originalStatus is 1 (active), check dates
    if (originalStatus === 0) {
        return { label: 'Inactive', severity: 'danger' };
    }

    // Only check dates if originalStatus is 1
    if (originalStatus === 1) {
        if (today < startAtDay) {
            return { label: 'Upcoming', severity: 'info' };
        } else if (today >= startAtDay && today < endAtDayAdjusted) {
            return { label: 'Active', severity: 'success' };
        } else {
            return { label: 'Inactive', severity: 'danger' };
        }
    }

    // Fallback - if originalStatus is neither 0 nor 1
    return { label: 'Inactive', severity: 'danger' };
};

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

onBeforeMount(async () => {
    try {
        initFilters1();
        loading.value = true;
        const response = await api.post('sales-program/list-sales-program');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((sales) => {
                // UPDATED: Pass original status to getStatusFromPeriod
                const periodStatus = getStatusFromPeriod(
                    sales.startDate,
                    sales.endDate,
                    sales.status // Pass the original status from API
                );

                return {
                    id: sales.id,
                    programId: sales.programid,
                    title: sales.title,
                    startDate: sales.startDate,
                    endDate: sales.endDate,
                    freeQuota: sales.freeQuota || '-',
                    // Use the combined status (period + originalStatus)
                    status: periodStatus,
                    created: sales.created,
                    // Keep original status if needed for other purposes
                    originalStatus: sales.status
                };
            });

            console.log('Transformed data:', listData.value);
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching sales list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Sales Program</div>
        <!-- 🟢 Use LoadingPage for initial load, hide everything else -->
        <LoadingPage v-if="loading" :message="'Loading your Sales Programs...'" :sub-message="'Fetching your Sales Programs'" />

        <DataTable
            v-else
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="programId"
            :rowHover="true"
            :filters="filters1"
            filterDisplay="menu "
            class="rounded-table"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            sortField="created"
            :sortOrder="-1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        >
            <!-- Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                    </div>

                    <!-- Create Button -->
                    <RouterLink to="/om/createSalesProgram">
                        <Button v-if="canUpdate" type="button" label="Create" icon="pi pi-plus" class="p-button" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No sales programs found. </template>

            <!-- Program ID -->
            <Column field="programId" header="Program ID" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/om/detailSalesProgram/${data.programId}`" class="hover:underline font-bold text-primary-400">
                        {{ data.programId }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Program Name -->
            <Column field="title" header="Program Name" style="min-width: 12rem" />

            <Column field="created" header="Created Date" style="min-width: 12rem" hidden />

            <!-- Period -->
            <Column header="Period" style="min-width: 12rem">
                <template #body="{ data }"> {{ data.startDate }} → {{ data.endDate }} </template>
            </Column>
            <Column field="freeQuota" header="Quota" style="min-width: 12rem" />

            <!-- Status (now based on period AND original status) -->
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.status.label" :severity="data.status.severity" />
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