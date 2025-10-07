<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Message</div>

                <!-- Message Form -->
                <div class="grid grid-cols-1 gap-6">
                    <!-- Message Subject -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Message Subject</label>
                        <InputText v-model="message.subject" placeholder="Enter message subject" class="w-full" />
                    </div>

                    <!-- Message Body -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Message Body</label>
                        <Textarea 
                            v-model="message.body" 
                            rows="8" 
                            placeholder="Type your message here..." 
                            class="w-full" 
                            :autoResize="true"
                        />
                    </div>

                    <!-- Dealer Selection -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block font-bold text-gray-700">Dealer List</label>
                            <span class="text-sm text-gray-500">{{ selectedDealers.length }} dealers selected</span>
                        </div>
                        
                        <MultiSelect 
                            v-model="selectedDealers" 
                            :options="groupedDealers" 
                            optionLabel="label" 
                            filter 
                            optionGroupLabel="label" 
                            optionGroupChildren="items" 
                            display="chip" 
                            placeholder="Select Dealers" 
                            class="w-full"
                            :maxSelectedLabels="3"
                        >
                            <template #optiongroup="slotProps">
                                <div class="flex items-center">
                                    <i class="pi pi-map-marker mr-2 text-blue-500" />
                                    <div class="font-semibold">{{ slotProps.option.label }}</div>
                                    <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {{ slotProps.option.items.length }} dealers
                                    </span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="inline-flex items-center">
                                    <i class="pi pi-building mr-1 text-sm" />
                                    <span>{{ slotProps.value.length }} dealers selected</span>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>

                    <!-- Selected Dealers Preview -->
                    <div v-if="selectedDealers.length > 0" class="border rounded-lg p-4 bg-gray-50">
                        <label class="block font-bold text-gray-700 mb-3">Selected Dealers Preview</label>
                        <DataTable 
                            :value="selectedDealers" 
                            :paginator="true" 
                            :rows="5" 
                            :rowsPerPageOptions="[3, 5, 7, 10]"
                            dataKey="custAccountNo" 
                            :rowHover="true"
                            responsiveLayout="scroll"
                        >
                            <Column header="Account No" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <div class="font-mono text-gray-700">
                                        {{ data.custAccountNo }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Dealer Name" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div class="font-semibold text-gray-800">
                                        {{ data.companyName1 }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Email" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div class="text-blue-600">
                                        {{ data.emailAddress }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Phone" style="min-width: 10rem">
                                <template #body="{ data }">
                                    <div class="text-gray-700">
                                        {{ data.phoneNumber }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Status" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Tag 
                                        :value="data.status === 1 ? 'Active' : 'Inactive'" 
                                        :severity="data.status === 1 ? 'success' : 'danger'" 
                                    />
                                </template>
                            </Column>

                            <Column header="Actions" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Button 
                                        icon="pi pi-trash" 
                                        class="p-button-danger p-button-text p-button-sm" 
                                        @click="removeDealer(data)" 
                                    />
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center text-gray-500 py-4">
                                    No dealers selected.
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 mt-8">
                    <div class="w-32">
                        <Button 
                            label="Cancel" 
                            class="w-full p-button-outlined p-button-secondary" 
                            @click="handleCancel" 
                        />
                    </div>
                    <div class="w-32">
                        <Button 
                            label="Send" 
                            class="w-full" 
                            :disabled="!isFormValid"
                            @click="sendMessage" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const message = ref({
    subject: '',
    body: ''
});

const selectedDealers = ref([]);

// Sample dealer data
const dealers = ref([
    {
        memberCode: 'E346572',
        custAccountNo: '6080100900',
        companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
        phoneNumber: '+60 3-1234 5678',
        mobilreNumber: '+60 19-1234 567',
        state: 'Kuala Lumpur',
        emailAddress: 'sales@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E234176',
        custAccountNo: '6080102300',
        companyName1: 'Toyo Auto Centre UHP Tyres Sdn Bhd',
        phoneNumber: '+60 7-2345 678',
        mobilreNumber: '+60 16-2345 678',
        state: 'Johor',
        emailAddress: 'johor@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E127568',
        custAccountNo: '6080102301',
        companyName1: 'Tek Ming Auto Service Sdn. Bhd.',
        phoneNumber: '+60 4-3456 789',
        mobilreNumber: '+60 12-3456 789',
        state: 'Penang',
        emailAddress: 'penang@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E127823',
        custAccountNo: '6080102302',
        companyName1: 'Apex Tyre & Car Care',
        phoneNumber: '+60 82-4567 890',
        mobilreNumber: '+60 18-4567 890',
        state: 'Selangor',
        emailAddress: 'selangor@toyotires.com.my',
        status: 0
    },
    {
        memberCode: 'E748235',
        custAccountNo: '6080114400',
        companyName1: 'JS Motorsports Sdn Bhd',
        phoneNumber: '+60 4-5678 901',
        mobilreNumber: '+60 17-5678 901',
        state: 'Selangor',
        emailAddress: 'petaling@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E325632',
        custAccountNo: '6080125300',
        companyName1: 'Weng Tat Tyre Service',
        phoneNumber: '+60 8-7654 321',
        mobilreNumber: '+60 19-8765 432',
        state: 'Kedah',
        emailAddress: 'labuan@toyotires.com.my',
        status: 0
    }
]);

// Group dealers by state for the MultiSelect
const groupedDealers = computed(() => {
    const states = {};
    
    dealers.value.forEach(dealer => {
        if (!states[dealer.state]) {
            states[dealer.state] = [];
        }
        states[dealer.state].push({
            ...dealer,
            label: `${dealer.companyName1} (${dealer.custAccountNo})`
        });
    });

    return Object.keys(states).map(state => ({
        label: state,
        items: states[state]
    }));
});

// Computed properties for statistics
const activeDealersCount = computed(() => {
    return selectedDealers.value.filter(dealer => dealer.status === 1).length;
});

const estimatedRecipients = computed(() => {
    // Assuming each dealer has multiple contacts, estimate 2-3 recipients per dealer
    return selectedDealers.value.length * 2;
});

const isFormValid = computed(() => {
    return message.value.subject.trim() !== '' && 
           message.value.body.trim() !== '' && 
           selectedDealers.value.length > 0;
});

// Initialize labels for dealers
onMounted(() => {
    dealers.value.forEach(dealer => {
        dealer.label = `${dealer.companyName1} (${dealer.custAccountNo})`;
    });
});

const removeDealer = (dealer) => {
    const index = selectedDealers.value.findIndex(d => d.custAccountNo === dealer.custAccountNo);
    if (index !== -1) {
        selectedDealers.value.splice(index, 1);
    }
};

const handleCancel = () => {
    if (message.value.subject || message.value.body || selectedDealers.value.length > 0) {
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            router.back();
        }
    } else {
        router.back();
    }
};

const sendMessage = () => {
    if (!isFormValid.value) {
        alert('Please fill in all required fields and select at least one dealer.');
        return;
    }

    const messageData = {
        ...message.value,
        dealers: selectedDealers.value,
        timestamp: new Date().toISOString(),
        totalRecipients: selectedDealers.value.length,
        activeRecipients: activeDealersCount.value
    };

    console.log('Sending message:', messageData);
    
    // Here you would typically make an API call to send the message
    alert(`Message sent successfully to ${selectedDealers.value.length} dealers!`);
    
    // Reset form
    message.value = {
        subject: '',
        body: ''
    };
    selectedDealers.value = [];
    
    // Navigate back to messages list
    router.push('/messaging');
};
</script>

<style scoped>
:deep(.p-textarea) {
    min-height: 200px;
}

:deep(.p-multiselect) {
    width: 100%;
}
</style>