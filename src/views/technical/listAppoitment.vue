<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Fetch appointment list
onBeforeMount(async () => {
    try {
        loading.value = true;
        const response = await api.get('appointment'); // adjust endpoint
        console.log(response.data);

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
                statusString: item.status_string
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching appointment list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List Appointment</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['memberName', 'phoneNo', 'dealerCustAcc', 'dealerShortName', 'bookDateTime']"
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
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" style="width: fit-content" />
                        <Button type="button" label="Template" icon="pi pi-download" class="p-button-info" style="width: fit-content" />
                    </div>
                </div>
            </template>

            <template #empty>No appointments found.</template>
            <template #loading>Loading appointments...</template>

            <!-- Columns -->
            <Column field="memberName" header="Member Name" style="min-width: 10rem">
                <template #body="{ data }">
                    <RouterLink :to="`/technical/detailAppointment/${data.id}`" class="hover:underline font-bold text-blue-600">
                        {{ data.memberName }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="phoneNo" header="Phone No" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.phoneNo }}
                </template>
            </Column>

            <Column field="dealerCustAcc" header="Dealer Cust Acc" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.dealerCustAcc }}
                </template>
            </Column>

            <Column field="dealerShortName" header="Dealer Short Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.dealerShortName }}
                </template>
            </Column>

            <Column field="bookDateTime" header="Book Date/Time" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.bookDateTime }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>
