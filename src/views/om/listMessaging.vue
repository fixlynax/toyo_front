<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Messaging</div>

        <DataTable 
            :value="listData" 
            :paginator="true" 
            :rows="10" 
            dataKey="messageId" 
            :rowHover="true" 
            :loading="loading" 
            :filters="filters1" 
            filterDisplay="menu"
            :expandedRows="expandedRows"
            @row-toggle="onRowToggle"
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
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Create Button -->
                    <RouterLink to="/messaging/createMessage">
                        <Button type="button" label="Create Message" icon="pi pi-plus" class="p-button-success" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No messages found. </template>
            <template #loading> Loading messages data. Please wait. </template>

            <!-- Expand Row -->
            <Column :expander="true" headerStyle="width: 3rem" />

            <!-- Message Date -->
            <Column field="messageDate" header="Message Date" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="font-semibold text-gray-800">
                        {{ formatDate(data.messageDate) }}
                    </div>
                </template>
            </Column>

            <!-- Message Time -->
            <Column field="messageTime" header="Message Time" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="text-gray-700">
                        {{ data.messageTime }}
                    </div>
                </template>
            </Column>

            <!-- Message Subject -->
            <Column field="subject" header="Message Subject" style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="font-medium text-gray-900">
                        {{ data.subject }}
                    </div>
                </template>
            </Column>

            <!-- Expanded Row Template -->
            <template #expansion="{ data }">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Dealers List</div>
                    <DataTable 
                        :value="data.dealers" 
                        :paginator="true" 
                        :rows="5" 
                        :rowsPerPageOptions="[3, 5, 7, 15, 20, 25, 30, 50]"
                        dataKey="custAccountNo" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <!-- Dealer Account No -->
                        <Column field="custAccountNo" header="Account No" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="font-mono text-gray-700">
                                    {{ data.custAccountNo }}
                                </div>
                            </template>
                        </Column>

                        <!-- Dealer Name -->
                        <Column field="companyName1" header="Dealer Name" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div class="font-semibold text-gray-800">
                                    {{ data.companyName1 }}
                                </div>
                            </template>
                        </Column>

                        <!-- Dealer Email -->
                        <Column field="emailAddress" header="Email" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div class="text-blue-600 hover:underline">
                                    <a :href="`mailto:${data.emailAddress}`">{{ data.emailAddress }}</a>
                                </div>
                            </template>
                        </Column>

                        <!-- Dealer Phone -->
                        <Column field="phoneNumber" header="Phone" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="text-gray-700">
                                    {{ data.phoneNumber }}
                                </div>
                            </template>
                        </Column>

                        <!-- Status -->
                        <Column field="status" header="Status" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.status === 1 ? 'Active' : 'Inactive'" 
                                    :severity="data.status === 1 ? 'success' : 'danger'" 
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-4">
                                No dealers found for this message.
                            </div>
                        </template>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);
const expandedRows = ref([]);

// Sample data - replace with your actual service
const mockMessages = [
    {
        messageId: 'MSG001',
        messageDate: '2024-01-15',
        messageTime: '14:30:00',
        subject: 'Year End Promotion Announcement',
        dealers: [
            {
                custAccountNo: '6080100900',
                companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
                emailAddress: 'sales@toyotires.com.my',
                phoneNumber: '+60 3-1234 5678',
                status: 1
            },
            {
                custAccountNo: '6080102300',
                companyName1: 'Toyo Auto Centre UHP Tyres Sdn Bhd',
                emailAddress: 'johor@toyotires.com.my',
                phoneNumber: '+60 7-2345 678',
                status: 1
            },
            {
                custAccountNo: '6080102301',
                companyName1: 'Tek Ming Auto Service Sdn. Bhd.',
                emailAddress: 'penang@toyotires.com.my',
                phoneNumber: '+60 4-3456 789',
                status: 1
            },
            {
                custAccountNo: '6080102302',
                companyName1: 'Apex Tyre & Car Care',
                emailAddress: 'selangor@toyotires.com.my',
                phoneNumber: '+60 82-4567 890',
                status: 0
            },
            {
                custAccountNo: '6080114400',
                companyName1: 'JS Motorsports Sdn Bhd',
                emailAddress: 'petaling@toyotires.com.my',
                phoneNumber: '+60 4-5678 901',
                status: 1
            }
        ]
    },
    {
        messageId: 'MSG002',
        messageDate: '2024-01-10',
        messageTime: '09:15:00',
        subject: 'New Product Launch - Toyo Proxes Sport',
        dealers: [
            {
                custAccountNo: '6080100900',
                companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
                emailAddress: 'sales@toyotires.com.my',
                phoneNumber: '+60 3-1234 5678',
                status: 1
            },
            {
                custAccountNo: '6080102301',
                companyName1: 'Tek Ming Auto Service Sdn. Bhd.',
                emailAddress: 'penang@toyotires.com.my',
                phoneNumber: '+60 4-3456 789',
                status: 1
            }
        ]
    },
    {
        messageId: 'MSG003',
        messageDate: '2024-01-05',
        messageTime: '16:45:00',
        subject: 'Inventory Check Request',
        dealers: [
            {
                custAccountNo: '6080102300',
                companyName1: 'Toyo Auto Centre UHP Tyres Sdn Bhd',
                emailAddress: 'johor@toyotires.com.my',
                phoneNumber: '+60 7-2345 678',
                status: 1
            },
            {
                custAccountNo: '6080102302',
                companyName1: 'Apex Tyre & Car Care',
                emailAddress: 'selangor@toyotires.com.my',
                phoneNumber: '+60 82-4567 890',
                status: 0
            },
            {
                custAccountNo: '6080114400',
                companyName1: 'JS Motorsports Sdn Bhd',
                emailAddress: 'petaling@toyotires.com.my',
                phoneNumber: '+60 4-5678 901',
                status: 1
            }
        ]
    }
];

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        subject: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        messageDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const onRowToggle = (event) => {
    // You can add custom logic here when rows are expanded/collapsed
    console.log('Row toggle:', event);
};

onBeforeMount(async () => {
    initFilters1();
    // Replace with your actual service call
    // listData.value = await MessagingService.getListMessages();
    
    // Using mock data for demonstration
    listData.value = mockMessages;
    loading.value = false;
});
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

:deep(.p-row-expanded) {
    background-color: #f9fafb !important;
}
</style>