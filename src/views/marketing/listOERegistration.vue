<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">OE Registration List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading OEs...'" :sub-message="'Fetching OE data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                :value="filteredData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['oe_cert_no', 'member_code', 'full_name', 'weekcode', 'mfgcode', 'tyresize', 'tyrespec', 'registered_on', 'vehicle_no']"
                class="rounded-table"
                sortField="registered_on"
                :sortOrder="-1"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex flex-col gap-4 w-full">
                        <!-- Top Row: Search -->
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>
                        </div>
                    </div>

                    <!-- Date Range Filter -->
                    <div class="flex items-center gap-4 mb-1 mt-4 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="tableLoading" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="tableLoading" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>
                        <div v-if="!hasDateFilterApplied" class="text-sm text-blue-600 italic">Select a date range to filter by registration date</div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">
                        <template v-if="!hasDateFilterApplied">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-calendar text-3xl text-blue-400"></i>
                                <span class="text-lg">Select a date range to view OE registrations</span>
                                <span class="text-sm text-gray-400">Choose both start and end dates to filter results</span>
                            </div>
                        </template>
                        <template v-else-if="hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                                <span class="text-lg">Please select both start and end dates</span>
                            </div>
                        </template>
                        <template v-else> No OE registrations found in the selected date range. </template>
                    </div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading OE data...</p>
                    </div>
                </template>

                <Column field="oe_cert_no" header="OE Cert No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailOERegistration/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.oe_cert_no }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="full_name" header="TC Member" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <div v-if="data.member_code || data.full_name">
                            <div v-if="data.member_code" class="font-semibold">{{ data.member_code }}</div>
                            <div class="text-sm text-gray-600">{{ data.full_name || 'N/A' }}</div>
                        </div>
                        <div v-else class="text-gray-400">N/A</div>
                    </template>
                </Column>

                <Column field="vehicle_no" header="Vehicle Number" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.vehicle_no || 'N/A' }}
                    </template>
                </Column>

                <!-- Improved Tyre Column with vertical layout -->
                <Column header="Tyre" style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <!-- MFG -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">MFG:</span>
                                <span class="font-medium">{{ data.mfgcode || '-' }}</span>
                            </div>

                            <!-- Size -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Size:</span>
                                <span class="font-medium">{{ data.tyresize || '-' }}</span>
                            </div>

                            <!-- Spec -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Spec:</span>
                                <span class="font-medium">{{ data.tyrespec || '-' }}</span>
                            </div>

                            <!-- Week -->
                            <div class="flex justify-between items-center" v-if="data.weekcode">
                                <span class="font-semibold text-gray-600">Week:</span>
                                <span class="font-medium">{{ data.weekcode }}</span>
                            </div>

                            <!-- Show message if all empty -->
                            <div v-if="!data.mfgcode && !data.tyresize && !data.tyrespec && !data.weekcode" class="text-center text-gray-400 py-1">-</div>
                        </div>
                    </template>
                </Column>

                <Column field="registered_on" header="Registered Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.registered_on) }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status === 0 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

// 🟢 State Management
const listData = ref([]);
const initialLoading = ref(true);
const tableLoading = ref(false);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);

// 🟢 Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 🟢 Fetch Data
const fetchOEData = async () => {
    try {
        tableLoading.value = true;

        const response = await api.post('warranty_registration/oe');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((oe) => ({
                id: oe.id,
                oe_cert_no: oe.warranty_cert_no || 'N/A',
                member_code: oe.member_code || null,
                full_name: oe.full_name || null,
                mfgcode: oe.mfgcode || 'N/A',
                tyresize: oe.tyresize || 'N/A',
                tyrespec: oe.tyrespec || 'N/A',
                weekcode: oe.weekcode || 'N/A',
                registered_on: oe.registered_on || null,
                vehicle_no: oe.vehicle_no || 'N/A',
                status: oe.status || 0
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching OE list:', error);
        listData.value = [];
    } finally {
        tableLoading.value = false;
    }
};

// 🟢 Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        if (newRange[0] && newRange[1]) {
            hasDateFilterApplied.value = true;
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            hasDateFilterApplied.value = false;
        }
    },
    { deep: true }
);

// 🟢 Computed - Filter data by date range
const filteredData = computed(() => {
    if (!hasDateFilterApplied.value) {
        return [];
    }

    let filtered = [...listData.value];

    // Apply date range filter based on registered_on date
    if (dateRange.value[0] && dateRange.value[1]) {
        filtered = filtered.filter((item) => {
            if (!item.registered_on || item.registered_on === 'N/A') return false;

            try {
                const orderDate = parseDate(item.registered_on);
                if (!orderDate) return false;

                orderDate.setHours(0, 0, 0, 0);

                const startDate = dateRange.value[0] ? new Date(dateRange.value[0]) : null;
                const endDate = dateRange.value[1] ? new Date(dateRange.value[1]) : null;

                if (startDate) startDate.setHours(0, 0, 0, 0);
                if (endDate) endDate.setHours(23, 59, 59, 999);

                const isAfterStart = !startDate || orderDate >= startDate;
                const isBeforeEnd = !endDate || orderDate <= endDate;

                return isAfterStart && isBeforeEnd;
            } catch (error) {
                console.error('Error parsing date:', item.registered_on, error);
                return false;
            }
        });
    }

    return filtered;
});

// 🟢 Initial load
onMounted(async () => {
    try {
        initialLoading.value = true;
        await fetchOEData();
    } catch (error) {
        console.error('Error in initial load:', error);
    } finally {
        initialLoading.value = false;
    }
});

// 🟢 Helper Functions
function parseDate(dateString) {
    if (!dateString || dateString === 'N/A') return null;

    let date;

    // Try DD-MM-YYYY format first
    const parts1 = dateString.split('-');
    if (parts1.length === 3 && parts1[2].length === 4) {
        const [day, month, year] = parts1;
        date = new Date(`${year}-${month}-${day}`);
    }
    // Try YYYY-MM-DD format (common from APIs)
    else if (dateString.includes('/')) {
        const parts2 = dateString.split('/');
        if (parts2.length === 3 && parts2[0].length === 4) {
            // YYYY/MM/DD
            date = new Date(dateString);
        } else if (parts2.length === 3 && parts2[2].length === 4) {
            // DD/MM/YYYY
            const [day, month, year] = parts2;
            date = new Date(`${year}-${month}-${day}`);
        }
    }
    // Try ISO format
    else {
        date = new Date(dateString);
    }

    return isNaN(date.getTime()) ? null : date;
}

function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';

    const date = parseDate(dateString);
    if (!date) return dateString;

    return date
        .toLocaleDateString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        .replace(/\//g, '/');
}

const getOverallStatusSeverity = (status) => {
    return status === 0 ? 'success' : 'danger';
};

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
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

/* Custom styling for the date filter */
:deep(.p-calendar) {
    .p-inputtext {
        padding: 0.5rem;
    }
}

/* Tyre column styling */
:deep(.p-datatable-tbody > tr > td) {
    .tyre-info-vertical {
        padding: 0.25rem 0;

        .tyre-detail-row {
            padding: 0.125rem 0;
            font-size: 0.75rem;
            line-height: 1.25;
        }
    }
}
</style>
