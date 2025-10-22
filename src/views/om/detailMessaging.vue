<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div>
                <Button 
                    icon="pi pi-arrow-left" 
                    class="p-button-text p-button-secondary mb-2" 
                    @click="goBack"
                    label="Back to List"
                />
                <div class="text-2xl font-bold text-gray-800">
                    Dealers for {{ formatDate(route.params.messageDate) }}
                </div>
                <div class="text-gray-600 mt-1">
                    Total {{ dealers.length }} dealer(s) found
                </div>
            </div>
            
            <div class="text-right">
                <div class="text-lg font-semibold text-gray-700">
                    {{ formatDate(route.params.messageDate) }}
                </div>
                <div class="text-gray-500">
                    Message Date
                </div>
            </div>
        </div>

        <DataTable 
            :value="dealers" 
            :paginator="true" 
            :rows="10" 
            :rowsPerPageOptions="[5, 10, 15, 20, 25, 30, 50]"
            dataKey="custAccountNo" 
            :rowHover="true"
            :loading="loading"
            responsiveLayout="scroll"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Search dealers..." class="w-full" />
                        </IconField>
                    </div>

                    <!-- Export Button -->
                    <Button 
                        type="button" 
                        label="Export" 
                        icon="pi pi-download" 
                        class="p-button-outlined" 
                    />
                </div>
            </template>

            <template #empty> 
                <div class="text-center text-gray-500 py-8">
                    <i class="pi pi-inbox text-4xl mb-2"></i>
                    <div>No dealers found for this message date.</div>
                </div>
            </template>
            <template #loading> Loading dealers data. Please wait. </template>

            <!-- Dealer Account No -->
            <Column field="custAccountNo" header="Account No" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="font-mono text-gray-700">
                        {{ data.custAccountNo }}
                    </div>
                </template>
            </Column>

            <!-- Dealer Name -->
            <Column field="companyName1" header="Dealer Name" style="min-width: 15rem" sortable>
                <template #body="{ data }">
                    <div class="font-semibold text-gray-800">
                        {{ data.companyName1 }}
                    </div>
                </template>
            </Column>

            <!-- Dealer Email -->
            <Column field="emailAddress" header="Email" style="min-width: 12rem" sortable>
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
            <Column field="status" header="Status" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <Tag 
                        :value="data.status === 1 ? 'Active' : 'Inactive'" 
                        :severity="data.status === 1 ? 'success' : 'danger'" 
                    />
                </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-eye" 
                            class="p-button-rounded p-button-text p-button-primary" 
                            v-tooltip="'View Details'"
                        />
                        <Button 
                            icon="pi pi-envelope" 
                            class="p-button-rounded p-button-text p-button-info" 
                            v-tooltip="'Send Email'"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const router = useRouter();
const route = useRoute();
const dealers = ref([]);
const loading = ref(true);
const filters1 = ref(null);

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
        companyName1: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
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

const goBack = () => {
    router.push('/om/listMessaging');
};

const loadDealers = () => {
    const messageDate = route.params.messageDate;
    const message = mockMessages.find(msg => msg.messageDate === messageDate);
    
    if (message) {
        dealers.value = message.dealers;
    } else {
        dealers.value = [];
    }
    loading.value = false;
};

onBeforeMount(async () => {
    initFilters1();
    loadDealers();
});
</script>

<style scoped lang="scss">
:deep(.p-datatable) {
    .p-datatable-thead > tr > th {
        background-color: #f8fafc;
        font-weight: 600;
    }
}
</style>