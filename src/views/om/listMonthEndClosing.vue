<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header with Create Button -->
                <div class="flex justify-between items-center border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Month End Closing</div>
                    <Button v-if="canUpdate" label="Create" icon="pi pi-plus" class="p-button-primary" @click="openCreateDialog" style="width: fit-content" />
                </div>

                <!-- 🟢 Only show LoadingPage during initial load, hide DataTable completely -->
                <LoadingPage v-if="loading" :message="'Loading Month End Closing...'" :sub-message="'Fetching your Month End Closing list'" />

                <!-- Closing Dates Table -->
                <DataTable
                    v-else
                    :value="sortedClosingDates"
                    :paginator="true"
                    :rows="12"
                    :rowsPerPageOptions="[12, 24, 36, 48, 60]"
                    dataKey="id"
                    :rowHover="true"
                    sortField="closingDateTime"
                    :sortOrder="-1"
                    removableSort
                    responsiveLayout="scroll"
                    :filters="filters"
                    filterDisplay="menu"
                    :globalFilterFields="['monthYear', 'closingDateFormatted', 'closingTime', 'status']"
                    class="rounded-table"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    :rowClass="rowClass"
                >
                    <template #header>
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                            <!-- Search Field -->
                            <div class="flex items-center gap-2 w-full sm:max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search (Month, Date, Status)" class="w-full" />
                                </IconField>
                                <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-calendar-times text-4xl mb-2"></i>
                            <div>No closing dates configured.</div>
                            <Button label="Create First Closing Date" icon="pi pi-plus" class="p-button-outlined mt-4" @click="openCreateDialog" />
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

                    <Column field="closingDateFormatted" header="Closing Date" style="min-width: 15rem">
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ data.closingDateFormatted }}
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="closingTime" header="Closing Time" style="min-width: 15rem">
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ formatTimeDisplay(data.closingTime) }}
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="status" header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Tag :value="getApiStatus(data.status)" :severity="getApiStatusSeverity(data.status)" />
                        </template>
                    </Column>

                    <Column v-if="canUpdate" header="Action" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex gap-1">
                                <Button icon="pi pi-pencil" class="p-button-info p-button-text p-button-sm" v-tooltip="'Edit'" @click="editDate(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Create Dialog -->
        <Dialog v-model:visible="showCreateDialog" header="Create New Closing Date" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
            <div class="grid grid-cols-1 gap-4">
                <!-- Month Selection -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Month and Year *</label>
                    <Calendar v-model="newDate.monthYear" view="month" dateFormat="mm/yy" placeholder="Select Month and Year" class="w-full" :showIcon="true" :minDate="minMonthYear" :maxDate="maxMonthYear" :disabledDates="disabledMonths" />
                    <small class="text-gray-500 mt-1 block"> Note: Months that already have closing dates are disabled </small>
                </div>

                <!-- Closing Date -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Closing Date *</label>
                    <Calendar v-model="newDate.closingDate" :minDate="minClosingDate" :maxDate="maxClosingDate" dateFormat="dd" placeholder="Select Day" class="w-full" :showIcon="true" :disabled="!newDate.monthYear" />
                    <small class="text-gray-500 mt-1 block"> Default: 26th of the month </small>
                </div>

                <!-- Closing Time -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Closing Time *</label>
                    <Calendar v-model="newDate.closingTime" timeOnly hourFormat="24" placeholder="Select Time" class="w-full" />
                    <small class="text-gray-500 mt-1 block"> Default: 17:00 </small>
                </div>

                <!-- Status -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton v-model="newDate.status" inputId="create_status_active" name="create_status" :value="1" />
                            <label for="create_status_active" class="ml-2">Active</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton v-model="newDate.status" inputId="create_status_inactive" name="create_status" :value="0" />
                            <label for="create_status_inactive" class="ml-2">Inactive</label>
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div v-if="newDate.monthYear && newDate.closingDate && newDate.closingTime" class="border rounded-lg p-4 bg-gray-50">
                    <label class="block font-bold text-gray-700 mb-2">Preview</label>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Month:</span>
                            <span class="font-semibold">{{ formatMonth(newDate.monthYear) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Closing Date:</span>
                            <span class="font-semibold">{{ getNewDate() }} {{ formatMonth(newDate.monthYear) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Closing Time:</span>
                            <span class="font-semibold">{{ formatTimePreview(newDate.closingTime) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Status:</span>
                            <Tag :value="getApiStatus(newDate.status)" :severity="getApiStatusSeverity(newDate.status)" class="text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeCreateDialog" />
                <Button label="Create" icon="pi pi-check" class="p-button-primary" :disabled="!isCreateFormValid" @click="createDate" />
            </template>
        </Dialog>

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

                <!-- Closing Date -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Closing Date *</label>
                    <Calendar v-model="currentDate.closingDate" :minDate="minDate" :maxDate="maxDate" dateFormat="dd" placeholder="Select Day" class="w-full" :showIcon="true" />
                </div>

                <!-- Closing Time -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Closing Time *</label>
                    <Calendar v-model="currentDate.closingTime" timeOnly hourFormat="24" placeholder="Select Time" class="w-full" />
                </div>

                <!-- Status -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton v-model="currentDate.status" inputId="status_active" name="status" :value="1" />
                            <label for="status_active" class="ml-2">Active</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton v-model="currentDate.status" inputId="status_inactive" name="status" :value="0" />
                            <label for="status_inactive" class="ml-2">Inactive</label>
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div v-if="currentDate.monthYear && currentDate.closingDate && currentDate.closingTime" class="border rounded-lg p-4 bg-gray-50">
                    <label class="block font-bold text-gray-700 mb-2">Preview</label>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Month:</span>
                            <span class="font-semibold">{{ formatMonth(currentDate.monthYear) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Closing Date:</span>
                            <span class="font-semibold">{{ getCurrentDate() }} {{ formatMonth(currentDate.monthYear) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Closing Time:</span>
                            <span class="font-semibold">{{ formatTimePreview(currentDate.closingTime) }}</span>
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Month End Closing'));

const toast = useToast();

const loading = ref(false);
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const editMode = ref(false);

// Quick Search Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// New date for creation
const newDate = reactive({
    monthYear: null,
    closingDate: null,
    closingTime: null,
    status: 1
});

// Current date for edit
const currentDate = reactive({
    id: null,
    monthYear: null,
    closingDate: null,
    closingTime: null,
    status: 1
});

const closingDates = ref([]);

// Computed property for sorted closing dates (descending by year and month)
const sortedClosingDates = computed(() => {
    return [...closingDates.value].sort((a, b) => {
        const dateA = new Date(a.monthYear);
        const dateB = new Date(b.monthYear);
        return dateB - dateA; // Descending order
    });
});

// Get existing months for disabling in calendar
const existingMonths = computed(() => {
    return closingDates.value.map((date) => {
        const d = new Date(date.monthYear);
        return {
            year: d.getFullYear(),
            month: d.getMonth()
        };
    });
});

// Disabled months for calendar (months that already exist in the list)
const disabledMonths = computed(() => {
    return existingMonths.value.map((existing) => {
        const disabledDate = new Date(existing.year, existing.month, 1);
        return disabledDate;
    });
});

// Date constraints for creation
const minMonthYear = computed(() => {
    const today = new Date();
    today.setDate(1);
    return today;
});

const maxMonthYear = computed(() => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);
    return maxDate;
});

const minClosingDate = computed(() => {
    if (!newDate.monthYear) return new Date();
    const month = new Date(newDate.monthYear);
    month.setDate(1);
    return month;
});

const maxClosingDate = computed(() => {
    if (!newDate.monthYear) return new Date();
    const month = new Date(newDate.monthYear);
    month.setMonth(month.getMonth() + 1);
    month.setDate(0); // Last day of the month
    return month;
});

// Date constraints for editing
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
const isCreateFormValid = computed(() => {
    return newDate.monthYear !== null && newDate.closingDate !== null && newDate.closingTime !== null && newDate.status !== null;
});

const isDialogFormValid = computed(() => {
    return currentDate.closingDate !== null && currentDate.closingTime !== null && currentDate.status !== null;
});

// Function to check if a row is the current month
const isCurrentMonth = (rowData) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January)
    
    const rowDate = new Date(rowData.monthYear);
    return rowDate.getFullYear() === currentYear && 
           rowDate.getMonth() === currentMonth;
};

// Row class function for highlighting current month
const rowClass = (data) => {
    return isCurrentMonth(data) ? 'current-month-row' : '';
};

// Watch for monthYear changes to set default closing date and time
watch(
    () => newDate.monthYear,
    (newMonthYear) => {
        if (newMonthYear) {
            // Set default closing date to 26th of the selected month
            const defaultDate = new Date(newMonthYear);
            defaultDate.setDate(26);
            newDate.closingDate = defaultDate;

            // Set default closing time to 17:00
            const defaultTime = new Date();
            defaultTime.setHours(17, 0, 0, 0);
            newDate.closingTime = defaultTime;
        }
    }
);

// Methods
const formatMonth = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long'
    });
};

const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    // Convert "14:44:00" to "14:44"
    return timeString.substring(0, 5);
};

const formatTimePreview = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const getCurrentDate = () => {
    if (!currentDate.closingDate) return '';
    return new Date(currentDate.closingDate).getDate();
};

const getNewDate = () => {
    if (!newDate.closingDate) return '';
    return new Date(newDate.closingDate).getDate();
};

// API Status handling
const getApiStatus = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
};

const getApiStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'secondary';
};

// Create methods
const openCreateDialog = () => {
    showCreateDialog.value = true;
    // Reset form
    Object.assign(newDate, {
        monthYear: null,
        closingDate: null,
        closingTime: null,
        status: 1
    });
};

const closeCreateDialog = () => {
    showCreateDialog.value = false;
    // Reset form
    Object.assign(newDate, {
        monthYear: null,
        closingDate: null,
        closingTime: null,
        status: 1
    });
};

const createDate = async () => {
    try {
        loading.value = true;

        // Prepare data for API creation
        const createData = {
            closingMonth: new Date(newDate.monthYear).toLocaleDateString('en-MY', { month: 'long' }),
            closingYear: new Date(newDate.monthYear).getFullYear().toString(),
            closingDate: new Date(newDate.closingDate).getDate(),
            closingTime: formatTimePreview(newDate.closingTime),
            status: newDate.status
        };

        // Call API to create the closing date
        const response = await api.post('maintenance/create-monthly-end', createData);

        if (response.data.status === 1) {
            // Add new date to local data
            const transformedData = transformApiData([response.data.admin_data]);
            closingDates.value.unshift(transformedData[0]);
            closeCreateDialog();

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Closing date created successfully',
                life: 3000
            });
        } else {
            let errorMessage = 'Failed to create closing date. Please try again.';
            if (response.data.error === 'Month and year already exist') {
                errorMessage = 'A closing date for this month and year already exists.';
            }

            toast.add({
                severity: 'warn',
                summary: 'Failed',
                detail: errorMessage,
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the closing date',
            life: 3000
        });
        console.error('Error creating closing date:', error);
    } finally {
        loading.value = false;
    }
};

// Edit methods
const editDate = (date) => {
    editMode.value = true;

    // Create closing date from monthYear and closingDate
    const closingDate = new Date(date.monthYear);
    closingDate.setDate(date.closingDate);

    // Create closing time from closingTime string
    const [hours, minutes] = date.closingTime.split(':');
    const closingTime = new Date();
    closingTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    Object.assign(currentDate, {
        id: date.id,
        monthYear: new Date(date.monthYear),
        closingDate: closingDate,
        closingTime: closingTime,
        status: date.status
    });
    showEditDialog.value = true;
};

const saveDate = async () => {
    try {
        loading.value = true;

        // Prepare data for API update
        const updateData = {
            date: new Date(currentDate.closingDate).getDate(), // Only the day number
            time: formatTimePreview(currentDate.closingTime), // HH:mm format
            status: currentDate.status
        };

        // Call API to update the closing date
        const response = await api.post(`maintenance/update-monthly-end/${currentDate.id}`, updateData);

        if (response.data.status === 1) {
            // Update local data
            const index = closingDates.value.findIndex((date) => date.id === currentDate.id);
            if (index !== -1) {
                closingDates.value[index] = {
                    ...closingDates.value[index],
                    closingDate: updateData.date,
                    closingTime: updateData.time + ':00',
                    status: updateData.status,
                    closingDateFormatted: response.data.admin_data?.closingDateFormatted || closingDates.value[index].closingDateFormatted
                };
            }
            closeDialog();

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Closing date updated successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Failed',
                detail: 'Failed to update closing date. Please try again.',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating the closing date',
            life: 3000
        });
        console.error('Error updating closing date:', error);
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
        closingDate: null,
        closingTime: null,
        status: 1
    });
};

// Helper function to convert API data to component format
const transformApiData = (apiData) => {
    return apiData.map((item) => {
        // Create monthYear from closing month and year (first day of the month)
        const monthYear = new Date(item.closingYear, getMonthNumber(item.closingMonth) - 1, 1);

        return {
            id: item.id,
            monthYear: monthYear,
            closingDate: parseInt(item.closingDate), // Store as number for editing
            closingTime: item.closingTime,
            status: item.status,
            updated: item.updated,
            closingDateFormatted: item.closingDateFormatted
        };
    });
};

// Helper function to convert month name to number (0-indexed for JavaScript Date)
const getMonthNumber = (monthName) => {
    const months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
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

:deep(.current-month-row) {
    background-color: #e3f2fd !important; /* Light blue background */
    border-left: 4px solid #1976d2 !important; /* Primary blue left border */
}

:deep(.current-month-row:hover) {
    background-color: #bbdefb !important; /* Slightly darker blue on hover */
}

:deep(.p-datatable .current-month-row td) {
    font-weight: bold; /* Make text bolder */
}

:deep(.p-datatable .current-month-row .font-semibold) {
    color: #0d47a1 !important; /* Dark blue text color for better contrast */
}
</style>