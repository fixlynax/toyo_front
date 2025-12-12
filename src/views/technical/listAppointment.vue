<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';

const listData = ref([]);
const loading = ref(true);
const exportLoading = ref(false);

// 🟢 Tab setup
const statusTabs = [
    { label: 'Pending', status: 0 },
    { label: 'Accepted', status: 1 },
    { label: 'Rejected', status: 2 }
];
const activeTabIndex = ref(0);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 🟢 Filter appointments based on active tab
const filteredAppointments = computed(() => {
    const currentTab = statusTabs[activeTabIndex.value]?.status;

    if (currentTab === undefined || currentTab === 'ALL') {
        return listData.value;
    }

    // Convert both to numbers for reliable comparison
    return listData.value.filter((appointment) => Number(appointment.status) === Number(currentTab));
});

// Fetch appointment list
const fetchAppointments = async () => {
    try {
        loading.value = true;
        const response = await api.post('appointment');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.id,
                appointmentCode: item.appointmentCode,
                requestDate: item.appointmentRequestDate,
                requestSession: item.appointmentRequestSession,
                appointmentDate: item.appointmentDate,
                appointmentTime: item.appointmentTime,
                dealerShop: item.dealerShop,
                dealerCustAccountNo: item.dealerCustAccountNo,
                status: item.status,
                statusString: item.status_string,
                customerName: item.customerName,
                customerPhone: item.customerPhone,
                dealerCustAcc: item.dealerCustAccountNo,
                dealerShortName: item.dealerShop,
                bookDateTime: item.appointmentDate && item.appointmentTime ? `${item.appointmentDate} ${item.appointmentTime}` : 'Not Scheduled'
            }));
        } else {
            listData.value = [];
            console.warn('Unexpected API response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching appointment list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
};

// 🟢 Frontend-only Export Function
const exportToExcel = () => {
    try {
        exportLoading.value = true;

        // Get data to export (filtered appointments based on active tab)
        const dataToExport = filteredAppointments.value;

        if (dataToExport.length === 0) {
            alert('No data to export');
            exportLoading.value = false;
            return;
        }

        // Define headers
        const headers = ['Appointment Code', 'Dealer Shop', 'Dealer Account No', 'Customer Name', 'Customer Phone', 'Request Date', 'Request Session', 'Appointment Date', 'Appointment Time', 'Status'];

        // Prepare CSV content
        let csvContent = headers.join(',') + '\n';

        // Add rows
        dataToExport.forEach((appointment) => {
            const row = [
                `"${appointment.appointmentCode || ''}"`,
                `"${appointment.dealerShop || ''}"`,
                `"${appointment.dealerCustAccountNo || ''}"`,
                `"${appointment.customerName || ''}"`,
                `"${appointment.customerPhone || ''}"`,
                `"${appointment.requestDate || ''}"`,
                `"${appointment.requestSession || ''}"`,
                `"${appointment.appointmentDate || ''}"`,
                `"${appointment.appointmentTime || ''}"`,
                `"${appointment.statusString || ''}"`
            ];
            csvContent += row.join(',') + '\n';
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `appointments_${getCurrentDateTime()}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error occurred while exporting data');
    } finally {
        exportLoading.value = false;
    }
};

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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

// 🟢 Helper function to get current date time for filename
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
};


// 🟢 Initial data load
onBeforeMount(() => {
    fetchAppointments();
});

// 🟢 Status color helper
const getStatusColor = (status) => {
    switch (status) {
        case 0:
            return 'text-yellow-600';
        case 1:
            return 'text-green-600';
        case 2:
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Appointment</div>

        <!-- Show loading only -->
        <LoadingPage v-if="loading" message="Loading Appointments..." />

        <!-- Show table only when not loading -->
        <template v-else>
            <!-- 🟣 Status Tabs -->
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />

            <DataTable
                :value="filteredAppointments"
                :paginator="true"
                :rows="10"
                dataKey="id"
                removableSort
                class="rounded-table"
                :rowHover="true"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['appointmentCode', 'dealerShop', 'dealerCustAccountNo', 'customerName', 'customerPhone', 'requestDate', 'requestSession', 'appointmentTime', 'appointmentDate', 'statusString']"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <template #header>
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

                        <!-- Right: Export & Template -->
                        <div class="flex items-center gap-2 ml-auto">
                            <Button type="button" label="Export" icon="pi pi-download" class="p-button-success" :loading="exportLoading" @click="exportToExcel" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">No appointments found for this status.</div>
                </template>

                <!-- Columns -->
                <Column field="appointmentCode" header="Appointment Code" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/technical/detailAppointment/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.appointmentCode }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="dealerShop" header="Customer Info" style="min-width: 14rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.dealerShop }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.dealerCustAccountNo }}</div>
                        </div>
                    </template>
                </Column>

                <Column field="customerName" header="Consumer Info" style="min-width: 14rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.customerName }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.customerPhone }}</div>
                        </div>
                    </template>
                </Column>

                <Column field="requestDate" header="Request Date" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.requestDate) || 'Not Request' }}
                    </template>
                </Column>

                <Column field="requestSession" header="Request Session" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.requestSession || 'Not Request' }}
                    </template>
                </Column>

                <Column field="appointmentDate" header="Scheduled Date/Time" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ formatDateFull(data?.appointmentDate && data?.appointmentTime ? `${data.appointmentDate} ${data.appointmentTime}` : null) || 'Not Scheduled' }}
                    </template>
                </Column>

                <Column field="statusString" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <span :class="getStatusColor(data.status)">
                            {{ data.statusString }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </template>
    </div>
</template>

<style scoped>
:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
    border-color: #3b82f6;
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
            border-bottom-right-radius:0;
        }
    }
    
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>
