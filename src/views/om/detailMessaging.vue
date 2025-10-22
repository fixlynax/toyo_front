<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="text-2xl font-bold text-gray-800">Message Details</div>
            <Button 
                label="Back to List" 
                icon="pi pi-arrow-left" 
                class="p-button-secondary" 
                @click="goBack" 
            />
        </div>

        <div v-if="loading" class="text-center py-8">
            <ProgressSpinner style="width: 50px; height: 50px" />
            <div class="mt-2 text-gray-600">Loading message details...</div>
        </div>

        <div v-else-if="message" class="bg-white rounded-lg shadow-sm border p-6">
            <!-- Message Header -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Message ID</label>
                    <div class="text-lg font-semibold text-gray-800">{{ message.messageId }}</div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Date</label>
                    <div class="text-lg font-semibold text-gray-800">{{ formatDate(message.messageDate) }}</div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Time</label>
                    <div class="text-lg font-semibold text-gray-800">{{ message.messageTime }}</div>
                </div>
            </div>

            <!-- Subject -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-500 mb-1">Subject</label>
                <div class="text-xl font-bold text-gray-900">{{ message.subject }}</div>
            </div>

            <!-- Dealers Section -->
            <div class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Dealers List </h3>
                </div>

                <DataTable :value="message.dealers" class="p-datatable-sm" :rowHover="true">
                    <Column field="custAccountNo" header="Account No" style="min-width: 250px">
                        <template #body="{ data }">
                            <div class="font-mono text-sm">{{ data.custAccountNo }}</div>
                        </template>
                    </Column>
                    
                    <Column field="companyName1" header="Company Name" style="min-width: 200px">
                        <template #body="{ data }">
                            <div class="font-medium">{{ data.companyName1 }}</div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <div v-else class="text-center py-8">
            <i class="pi pi-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <div class="text-xl font-semibold text-gray-700 mb-2">Message Not Found</div>
            <div class="text-gray-600 mb-4">The requested message could not be found.</div>
            <Button label="Back to List" icon="pi pi-arrow-left" @click="goBack" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const route = useRoute();
const router = useRouter();

const message = ref(null);
const loading = ref(true);

// Mock data service - replace with your actual API call
const mockMessages = {
    'MSG001': {
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
    'MSG002': {
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
    'MSG003': {
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
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const goBack = () => {
    router.push('/om/listMessaging'); // Adjust this path to your list page route
};

const fetchMessageDetails = async (messageId) => {
    loading.value = true;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Replace this with your actual API call
    // const response = await messagingService.getMessageById(messageId);
    // message.value = response.data;
    
    // Using mock data for demonstration
    message.value = mockMessages[messageId] || null;
    
    loading.value = false;
};

// Watch for route changes (in case user navigates between different messages)
watch(
    () => route.query.id,
    (newMessageId) => {
        if (newMessageId) {
            fetchMessageDetails(newMessageId);
        }
    }
);

onMounted(() => {
    const messageId = route.query.id;
    if (messageId) {
        fetchMessageDetails(messageId);
    } else {
        loading.value = false;
    }
});
</script>

<style scoped lang="scss">
:deep(.p-datatable) {
    .p-datatable-thead > tr > th {
        background-color: #f8fafc;
        color: #374151;
        font-weight: 600;
    }
}
</style>