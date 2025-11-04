<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Month End Closing Calendar</div>

                <!-- 🟢 Only show LoadingPage during initial load, hide DataTable completely -->
                <LoadingPage 
                    v-if="loading" 
                    :message="'Loading Month End Closing...'" 
                    :sub-message="'Fetching your Month End Closing list'" 
                />

                <!-- Closing Dates Table -->
                <DataTable 
                    v-else 
                    :value="closingDates" 
                    :paginator="true" 
                    :rows="12" 
                    :rowsPerPageOptions="[12, 24, 36, 48, 60]" 
                    dataKey="id" 
                    :rowHover="true"  
                    sortField="closingDateTime" 
                    :sortOrder="-1" 
                    responsiveLayout="scroll" 
                    :filters="filters"
                    filterDisplay="menu"
                    :globalFilterFields="['monthYear', 'closingDateTime', 'status']"
                    class="rounded-table"
                >
                    <template #header>
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                            <!-- Search Field -->
                            <div class="flex items-center gap-2 w-full sm:max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText 
                                        v-model="filters['global'].value" 
                                        placeholder="Quick Search (Month, Date, Status)" 
                                        class="w-full" 
                                    />
                                </IconField>
                                 <Button type="button" icon="pi pi-cog" class="p-button" />
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-calendar-times text-4xl mb-2"></i>
                            <div>No closing dates configured.</div>
                        </div>
                    </template>

                    <template #loading>
                        <div class="text-center py-4">
                            <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                            Loading closing dates...
                        </div>
                    </template>

                    <Column field="monthYear" header="Month" style="min-width: 10rem" :sortable="true">
                        <template #body="{ data }">
                            <div class="font-semibold text-gray-800">
                                {{ formatMonth(data.monthYear) }}
                            </div>
                        </template>
                    </Column>

                    <Column field="closingDateTime" header="Closing Date" style="min-width: 15rem" >
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ formatDate(data.closingDateTime) }}
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="closingDateTime" header="Closing Time" style="min-width: 15rem" >
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ formatTime(data.closingDateTime) }}
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="status" header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Tag :value="getApiStatus(data.status)" :severity="getApiStatusSeverity(data.status)" />
                        </template>
                    </Column>

                    <Column header="Actions" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex gap-1">
                                <Button icon="pi pi-pencil" class="p-button-info p-button-text p-button-sm" v-tooltip="'Edit'" @click="editDate(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Edit Dialog -->
        <Dialog v-model:visible="showEditDialog" header="Edit Closing Date" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
            <div class="grid grid-cols-1 gap-4">
                <!-- Month Display -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Month</label>
                    <div class="p-inputtext p-component w-full bg-gray-100">
                        {{ formatMonth(currentDate.monthYear) }}
                    </div>
                </div>

                <!-- Closing Date & Time -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Closing Date & Time *</label>
                    <Calendar v-model="currentDate.closingDateTime" showTime hourFormat="24" placeholder="Select Closing Date and Time" class="w-full" :minDate="minDate" :maxDate="maxDate" />
                </div>

                <!-- Status -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton v-model="currentDate.status" inputId="status_active" name="status" :value="1" />
                            <label for="status_active" class="ml-2">Active (Closing)</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton v-model="currentDate.status" inputId="status_inactive" name="status" :value="0" />
                            <label for="status_inactive" class="ml-2">Inactive (Not Closing)</label>
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div v-if="currentDate.monthYear && currentDate.closingDateTime" class="border rounded-lg p-4 bg-gray-50">
                    <label class="block font-bold text-gray-700 mb-2">Preview</label>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Month:</span>
                            <span class="font-semibold">{{ formatMonth(currentDate.monthYear) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Closing Date:</span>
                            <span class="font-semibold">{{ formatDatePreview(currentDate.closingDateTime) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Closing Time:</span>
                            <span class="font-semibold">{{ formatTimePreview(currentDate.closingDateTime) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Status:</span>
                            <Tag :value="getApiStatus(currentDate.status)" :severity="getApiStatusSeverity(currentDate.status)" class="text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
                <Button label="Update" icon="pi pi-check" class="p-button-primary" :disabled="!isDialogFormValid" @click="saveDate" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { FilterMatchMode } from '@primevue/core/api';

const loading = ref(false);
const showEditDialog = ref(false);
const editMode = ref(false);

// Quick Search Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Current date for edit
const currentDate = reactive({
    id: null,
    monthYear: null,
    closingDateTime: null,
    status: 1
});

const closingDates = ref([]);

// Computed property to count filtered records
const filteredRecordsCount = computed(() => {
    if (filters.value.global.value) {
        const searchTerm = filters.value.global.value.toLowerCase();
        return closingDates.value.filter(date => {
            const monthYear = formatMonth(date.monthYear).toLowerCase();
            const closingDate = formatDate(date.closingDateTime).toLowerCase();
            const status = getApiStatus(date.status).toLowerCase();
            
            return monthYear.includes(searchTerm) || 
                   closingDate.includes(searchTerm) || 
                   status.includes(searchTerm);
        }).length;
    }
    return closingDates.value.length;
});

// Date constraints
const minDate = computed(() => {
    if (!currentDate.monthYear) return new Date();
    const month = new Date(currentDate.monthYear);
    month.setDate(1);
    return month;
});

const maxDate = computed(() => {
    if (!currentDate.monthYear) return new Date();
    const month = new Date(currentDate.monthYear);
    month.setMonth(month.getMonth() + 1);
    month.setDate(0); // Last day of the month
    return month;
});

// Computed properties
const isDialogFormValid = computed(() => {
    return currentDate.closingDateTime !== null && currentDate.status !== null;
});

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatMonth = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long'
    });
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const formatDatePreview = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTimePreview = (date) => {
    return new Date(date).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// API Status handling
const getApiStatus = (status) => {
    return status === 1 ? 'Close' : 'Incoming';
};

const getApiStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'secondary';
};

const editDate = (date) => {
    editMode.value = true;
    Object.assign(currentDate, {
        id: date.id,
        monthYear: new Date(date.monthYear),
        closingDateTime: new Date(date.closingDateTime),
        status: date.status
    });
    showEditDialog.value = true;
};

const saveDate = async () => {
    try {
        loading.value = true;
        
        // Prepare data for API update
        const updateData = {
            id: currentDate.id,
            closingDate: new Date(currentDate.closingDateTime).getDate(),
            closingMonth: new Date(currentDate.monthYear).toLocaleDateString('en-MY', { month: 'long' }),
            closingYear: new Date(currentDate.monthYear).getFullYear().toString(),
            closingTime: new Date(currentDate.closingDateTime).toLocaleTimeString('en-MY', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
            }),
            status: currentDate.status
        };

        // Call API to update the closing date
        const response = await api.put('maintenance/update-monthly-end', updateData);
        
        if (response.data.status === 1) {
            // Update local data
            const index = closingDates.value.findIndex((date) => date.id === currentDate.id);
            if (index !== -1) {
                closingDates.value[index] = {
                    ...closingDates.value[index],
                    closingDateTime: new Date(currentDate.closingDateTime),
                    status: currentDate.status
                };
            }
            closeDialog();
            console.log('Closing date updated successfully');
        } else {
            console.error('Failed to update closing date:', response.data);
            alert('Failed to update closing date. Please try again.');
        }
    } catch (error) {
        console.error('Error updating closing date:', error);
        alert('Error updating closing date. Please try again.');
    } finally {
        loading.value = false;
    }
};

const closeDialog = () => {
    showEditDialog.value = false;
    editMode.value = false;
    // Reset form
    Object.assign(currentDate, {
        id: null,
        monthYear: null,
        closingDateTime: null,
        status: 1
    });
};

// Helper function to convert API data to component format
const transformApiData = (apiData) => {
    return apiData.map(item => {
        // Create a date string from the API data
        const dateString = `${item.closingDate} ${item.closingMonth} ${item.closingYear} ${item.closingTime}`;
        const closingDateTime = new Date(dateString);
        
        // Create monthYear from closing date (first day of the month)
        const monthYear = new Date(item.closingYear, getMonthNumber(item.closingMonth), 1);
        
        return {
            id: item.id,
            monthYear: monthYear,
            closingDateTime: closingDateTime,
            status: item.status,
            updated: item.updated,
            closingDateFormatted: item.closingDateFormatted
        };
    });
};

// Helper function to convert month name to number
const getMonthNumber = (monthName) => {
    const months = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    return months[monthName] || 0;
};

// Initialize
onMounted(async () => {
    try {
        loading.value = true;
        const response = await api.get('maintenance/list-monthly-end');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && response.data.admin_data) {
            // Transform API data to match component structure
            closingDates.value = transformApiData(response.data.admin_data);
            console.log('Transformed closing dates:', closingDates.value);
        } else {
            console.error('API returned error or invalid data:', response.data);
            closingDates.value = [];
        }
    } catch (error) {
        console.error('Error fetching month end closing dates:', error);
        closingDates.value = [];
    } finally {
        loading.value = false;
    }
});
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