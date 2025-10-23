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
                    <RouterLink to="/om/createMessaging">
                        <Button type="button" label="Create" icon="pi pi-plus" class="p-button-success" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No messages found. </template>
            <template #loading> Loading messages data. Please wait. </template>

            <!-- Message Date (Clickable) -->
            <Column field="messageDate" header="Message DateTime" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" 
                         @click="goToDetail(data.messageId)">
                        {{ formatDate(data.messageDate) }} , {{ data.messageTime }}
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

            <!-- Dealers Count -->
            <Column field="dealersCount" header="Number Of Customer" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="text-center">
                        <Tag :value="data.dealers.length.toString()" class="bg-blue-100 text-blue-800" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const router = useRouter();
const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

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

const goToDetail = (messageId) => {
    router.push({
        path: '/om/detailMessaging',
        query: { id: messageId }
    });
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
</style>