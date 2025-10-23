<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Month End Closing Calendar</div>

                <!-- Description
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                    <div class="flex items-start">
                        <i class="pi pi-info-circle text-blue-500 text-lg mt-1 mr-3"></i>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">About Month End Closing</div>
                            <div class="text-blue-700 text-sm">Orders placed after the closing date/time will be processed as next month's orders when sent to SAP. These dates apply nationwide to all regions and dealers.</div>
                        </div>
                    </div>
                </div> -->

                <!-- Closing Dates Table -->
                <DataTable :value="closingDates" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" :rowHover="true" :loading="loading" sortField="closingDateTime" :sortOrder="-1" responsiveLayout="scroll">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500"> Showing {{ closingDates.length }} records </span>
                            <div class="flex gap-2">
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-calendar-times text-4xl mb-2"></i>
                            <div>No closing dates configured.</div>
                            <div class="text-sm mt-1">Add your first month end closing date to get started.</div>
                            <Button label="Add First Closing Date" icon="pi pi-plus" class="p-button-outlined mt-4" @click="showAddDialog = true" />
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

                    <Column field="closingDateTime" header="Closing Date" style="min-width: 15rem" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ formatDate(data.closingDateTime) }}
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="closingDateTime" header="Closing Time" style="min-width: 15rem" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ formatTime(data.closingDateTime) }}
                                </div>
                            </div>
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

        <!-- Add/Edit Dialog -->
        <Dialog v-model:visible="showAddDialog" :header="editMode ? 'Edit Closing Date' : 'Add Closing Date'" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
            <div class="grid grid-cols-1 gap-4">
                

                <!-- Closing Date & Time -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Closing Date & Time *</label>
                    <Calendar v-model="currentDate.closingDateTime" showTime hourFormat="24" placeholder="Select Closing Date and Time" class="w-full" :minDate="minDate" :maxDate="maxDate" />
                </div>

                <!-- Preview -->
                <div v-if="currentDate.monthYear && currentDate.closingDateTime" class="border rounded-lg p-4 bg-gray-50">
                    <label class="block font-bold text-gray-700 mb-2">Preview</label>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Month:</span>
                            <span class="font-semibold">{{ getMonthYearPreview() }}</span>
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
                            <Tag :value="getPreviewStatus()" :severity="getPreviewStatusSeverity()" class="text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
                <Button :label="editMode ? 'Update' : 'Add Closing Date'" icon="pi pi-check" class="p-button-primary" :disabled="!isDialogFormValid" @click="saveDate" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const loading = ref(false);
const showAddDialog = ref(false);
const editMode = ref(false);

// Current date for add/edit
const currentDate = reactive({
    monthYear: null,
    closingDateTime: null
});

// Sample data
const closingDates = ref([
    {
        id: 1,
        monthYear: new Date('2024-01-01'),
        closingDateTime: new Date('2024-01-31T23:59:59'),
        createdBy: 'Admin',
        createdAt: new Date('2024-01-01T09:00:00')
    },
    {
        id: 2,
        monthYear: new Date('2024-02-01'),
        closingDateTime: new Date('2024-02-29T23:59:59'),
        createdBy: 'Admin',
        createdAt: new Date('2024-02-01T09:00:00')
    },
    {
        id: 3,
        monthYear: new Date('2024-03-01'),
        closingDateTime: new Date('2024-03-31T23:59:59'),
        createdBy: 'Admin',
        createdAt: new Date('2024-03-01T09:00:00')
    },
    {
        id: 4,
        monthYear: new Date('2024-04-01'),
        closingDateTime: new Date('2024-04-30T23:59:59'),
        createdBy: 'Admin',
        createdAt: new Date('2024-04-01T09:00:00')
    }
]);

// Date constraints
const minMonth = computed(() => {
    return new Date();
});

const maxMonth = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 2);
    return date;
});

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
    return currentDate.monthYear !== null && currentDate.closingDateTime !== null;
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

const getMonthYearPreview = () => {
    if (!currentDate.monthYear) return '';
    return new Date(currentDate.monthYear).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long'
    });
};

const getStatus = (date) => {
    const now = new Date();
    const closingDate = new Date(date.closingDateTime);

    if (now > closingDate) return 'Closed';
    if (now.getMonth() === closingDate.getMonth() && now.getFullYear() === closingDate.getFullYear()) {
        return 'Current';
    }
    return 'Upcoming';
};

const getStatusSeverity = (date) => {
    const status = getStatus(date);
    switch (status) {
        case 'Closed':
            return 'secondary';
        case 'Current':
            return 'warning';
        case 'Upcoming':
            return 'success';
        default:
            return 'info';
    }
};

const getPreviewStatus = () => {
    if (!currentDate.closingDateTime) return '';
    const now = new Date();
    const closingDate = new Date(currentDate.closingDateTime);

    if (now > closingDate) return 'Closed';
    if (now.getMonth() === closingDate.getMonth() && now.getFullYear() === closingDate.getFullYear()) {
        return 'Current';
    }
    return 'Upcoming';
};

const getPreviewStatusSeverity = () => {
    const status = getPreviewStatus();
    switch (status) {
        case 'Closed':
            return 'secondary';
        case 'Current':
            return 'warning';
        case 'Upcoming':
            return 'success';
        default:
            return 'info';
    }
};

const getDaysRemaining = (date) => {
    const now = new Date();
    const closingDate = new Date(date.closingDateTime);

    if (now > closingDate) return '0';

    const diffTime = closingDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
};

const getDaysRemainingSeverity = (date) => {
    const days = parseInt(getDaysRemaining(date));
    if (days === 0) return 'danger';
    if (days <= 3) return 'warning';
    if (days <= 7) return 'info';
    return 'success';
};

const addDate = () => {
    showAddDialog.value = true;
    editMode.value = false;
};

const editDate = (date) => {
    editMode.value = true;
    Object.assign(currentDate, {
        monthYear: new Date(date.monthYear),
        closingDateTime: new Date(date.closingDateTime)
    });
    showAddDialog.value = true;
};

const deleteDate = (id) => {
    const date = closingDates.value.find((d) => d.id === id);
    if (date && confirm(`Are you sure you want to delete the closing date for ${formatDate(date.monthYear)}?`)) {
        closingDates.value = closingDates.value.filter((d) => d.id !== id);
        console.log(`Closing date ${id} has been deleted`);
    }
};

const saveDate = () => {
    if (editMode.value) {
        // Update existing date
        const index = closingDates.value.findIndex((date) => date.monthYear.getTime() === currentDate.monthYear.getTime());
        if (index !== -1) {
            closingDates.value[index] = {
                ...closingDates.value[index],
                closingDateTime: new Date(currentDate.closingDateTime)
            };
        }
    } else {
        // Create new date
        // Check if month already exists
        const existingDate = closingDates.value.find((date) => date.monthYear.getMonth() === currentDate.monthYear.getMonth() && date.monthYear.getFullYear() === currentDate.monthYear.getFullYear());

        if (existingDate) {
            alert('A closing date already exists for this month. Please edit the existing entry instead.');
            return;
        }

        const newDate = {
            id: Date.now(),
            monthYear: new Date(currentDate.monthYear),
            closingDateTime: new Date(currentDate.closingDateTime),
            createdBy: 'Admin',
            createdAt: new Date()
        };
        closingDates.value.push(newDate);
    }

    closeDialog();
    console.log('Closing date saved:', currentDate);
};

const closeDialog = () => {
    showAddDialog.value = false;
    editMode.value = false;
    // Reset form
    Object.assign(currentDate, {
        monthYear: null,
        closingDateTime: null
    });
};

// Initialize
onMounted(() => {
    // Simulate loading
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
});
</script>
