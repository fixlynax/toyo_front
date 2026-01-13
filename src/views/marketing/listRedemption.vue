<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Redemption Management List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Redemption Management Details...'" :sub-message="'Fetching redemption data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <TabView v-model:activeIndex="activeTab" class="mb-4">
                <TabPanel header="All" />
                <TabPanel header="Voucher" />
                <TabPanel header="Item" />
            </TabView>

            <DataTable
                :value="filteredData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['refno', 'memberName', 'recipientName', 'itemName', 'quantity', 'redemptionDate', 'status']"
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

                        <!-- Right: Export & Template Buttons -->
                        <div class="flex items-center gap-2 ml-auto">
                            <!-- <Button type="button" label="Update" icon="pi pi-sync" class="p-button-success" />
                            <Button type="button" label="Template" icon="pi pi-download" class="p-button-danger" /> -->
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Redemption data found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading redemption data...</p>
                    </div>
                </template>

                <Column field="refno" header="Ref No" sortable style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailRedemption/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.refno }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="memberName" header="Member Name" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.recipientName }}
                    </template>
                </Column>

                <Column field="itemName" header="Item Name" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.itemName }}
                    </template>
                </Column>

                <Column field="quantity" header="Quantity" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.quantity }}
                    </template>
                </Column>

                <Column field="redemptionDate" header="Redemption Date" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ formatDate(data.redemptionDate) }}
                    </template>
                </Column>

                <Column field="itemStatus" header="Item Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.itemStatus }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" />
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
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

// Data variables
const listData = ref([]);
const initialLoading = ref(true); // For initial page load
const tableLoading = ref(false); // For table operations
const activeTab = ref(0); // 0=All, 1=Voucher, 2=Item

const filteredData = computed(() => {
    if (activeTab.value === 1) {
        return listData.value.filter((i) => i.itemType === 'VOUCHER');
    }
    if (activeTab.value === 2) {
        return listData.value.filter((i) => i.itemType === 'ITEM');
    }
    return listData.value;
});

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('redeem/list');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((redeem) => ({
                id: redeem.id,
                refno: redeem.ref_no || 'N/A',
                recipientName: redeem.member_name || 'N/A',
                itemName: redeem.redeem_item || 'N/A',
                quantity: redeem.quantity || 0,
                redemptionDate: redeem.redeem_date || 'N/A',
                itemStatus: redeem.item_status || 'N/A',
                itemType: redeem.type || 'N/A',
                status: redeem.status
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching redeem list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
});

const getOverallStatusLabel = (status) => {
    if (status === 0) return 'Pending';
    if (status === 1) return 'Approved';
    if (status === 2) return 'Rejected';
    return 'Unknown';
};

const getOverallStatusSeverity = (status) => {
    if (status === 0) return 'warn'; // Fixed: was 'warn', should be 'warning'
    if (status === 1) return 'success';
    if (status === 2) return 'danger';
    return 'secondary';
};

function formatDate(dateString) {
    if (!dateString) return '';

    let day, month, year;

    // Detect YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        [year, month, day] = dateString.split('-');
    }
    // Detect DD-MM-YYYY
    else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        [day, month, year] = dateString.split('-');
    } else {
        return ''; // unknown format
    }

    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
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
