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
    
    if (!currentTab || currentTab === 'ALL') {
        return listData.value;
    }

    return listData.value.filter(appointment => appointment.status === currentTab);
});

// Fetch appointment list
const fetchAppointments = async () => {
    try {
        loading.value = true;
        const response = await api.get('appointment');
        console.log('API Response:', response.data);

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

const fetchExport = async () => {
    try {
        loading.value = true;
        exportLoading.value = true;
        const response = await api.getDownload('appointment/export', {
        responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Appointment_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.error('rror fetching OE Tire export:', err);
    } finally {
        loading.value = false;
        exportLoading.value = false;
    }
};

// 🟢 Initial data load
onBeforeMount(() => {
    fetchAppointments();
});

// 🟢 Status color helper
const getStatusColor = (status) => {
    switch (status) {
        case 0: return 'text-yellow-600';
        case 1: return 'text-green-600';
        case 2: return 'text-red-600';
        default: return 'text-gray-600';
    }
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List Appointment</div>
        
        <!-- Show loading only -->
        <LoadingPage v-if="loading" message="Loading Appointments..." />
        
        <!-- Show table only when not loading -->
        <template v-else>
            <!-- 🟣 Status Tabs -->
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />
            
            <DataTable 
                :value="filteredAppointments" 
                :paginator="true" 
                :rows="10" 
                dataKey="id" 
                :rowHover="true" 
                :filters="filters" 
                filterDisplay="menu" 
                :globalFilterFields="['appointmentCode', 'dealerShop', 'dealerCustAccountNo', 'statusString']"
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
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>

                        <!-- Right: Export & Template -->
                        <div class="flex items-center gap-2 ml-auto">
                            <Button 
                                type="button" 
                                label="Export" 
                                icon="pi pi-download" 
                                class="p-button" 
                                :loading="exportLoading" 
                                @click="fetchExport" 
                            />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        No appointments found for this status.
                    </div>
                </template>

                <!-- Columns -->
                <Column field="appointmentCode" header="Appointment Code" style="min-width: 12rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/technical/detailAppointment/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.appointmentCode }}
                        </RouterLink>
                    </template>
                </Column>

                <Column header="Dealer Info" style="min-width: 14rem">
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.dealerShop }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.dealerCustAccountNo }}</div>
                        </div>
                    </template>
                </Column>

                <Column header="Customer Info" style="min-width: 14rem">
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.customerName }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.customerPhone }}</div>
                        </div>
                    </template>
                </Column>

                <Column field="requestDate" header="Request Date" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.requestDate || 'Not specified' }}
                    </template>
                </Column>

                <Column field="requestSession" header="Request Session" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.requestSession || 'Not specified' }}
                    </template>
                </Column>

                <Column field="bookDateTime" header="Scheduled Date/Time" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.bookDateTime }}
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
</style>