<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Referral Report
                </div>

                <!-- Description -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <i class="pi pi-info-circle text-blue-500 text-lg mt-1 mr-3"></i>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">About Referral Report</div>
                            <div class="text-blue-700 text-sm">
                                Export comprehensive list of member sign-ups through referral program. 
                                Filter by date range to generate customized reports for analysis and tracking.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters Section -->
                <div class="border rounded-lg p-6 bg-gray-50">
                    <div class="text-lg font-bold text-gray-800 mb-4">Report Filters</div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Date Range Selection -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Date Range *</label>
                            <Calendar 
                                v-model="filters.dateRange" 
                                selectionMode="range" 
                                :manualInput="false"
                                placeholder="Select Date Range"
                                class="w-full"
                                :maxDate="maxDate"
                                showIcon
                            />
                            <div class="text-xs text-gray-500 mt-2">
                                Select the period for referral sign-ups
                            </div>
                        </div>

                        <!-- Program Type -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Program Type</label>
                            <Dropdown 
                                v-model="filters.programType" 
                                :options="programTypeOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Programs"
                                class="w-full"
                            />
                            <div class="text-xs text-gray-500 mt-2">
                                Filter by specific referral program
                            </div>
                        </div>
                    </div>

                    <!-- Additional Filters -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        <!-- Status Filter -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Member Status</label>
                            <Dropdown 
                                v-model="filters.memberStatus" 
                                :options="memberStatusOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Status"
                                class="w-full"
                            />
                        </div>

                        <!-- State Filter -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">State</label>
                            <Dropdown 
                                v-model="filters.state" 
                                :options="stateOptions" 
                                placeholder="All States"
                                class="w-full"
                            />
                        </div>

                        <!-- Export Format -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Export Format</label>
                            <Dropdown 
                                v-model="filters.exportFormat" 
                                :options="exportFormatOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Format"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <!-- Quick Date Presets -->
                    <div class="mt-6">
                        <label class="block font-bold text-gray-700 mb-2">Quick Date Presets</label>
                        <div class="flex flex-wrap gap-2">
                            <Button 
                                v-for="preset in datePresets" 
                                :key="preset.label"
                                :label="preset.label" 
                                class="p-button-outlined p-button-secondary p-button-sm"
                                @click="applyDatePreset(preset)"
                            />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-between items-center mt-6">
                        <div class="text-sm text-gray-600">
                            <span v-if="filters.dateRange && filters.dateRange.length === 2">
                                Selected: {{ formatDate(filters.dateRange[0]) }} to {{ formatDate(filters.dateRange[1]) }}
                            </span>
                            <span v-else class="text-orange-500">
                                Please select a date range
                            </span>
                        </div>
                        <div class="flex gap-4">
                            <Button 
                                label="Clear Filters" 
                                icon="pi pi-refresh" 
                                class="p-button-outlined p-button-secondary"
                                @click="clearFilters" 
                            />
                            <Button 
                                label="Generate Preview" 
                                icon="pi pi-eye" 
                                class="p-button-outlined"
                                :disabled="!isDateRangeSelected"
                                @click="generatePreview" 
                            />
                            <Button 
                                label="Export Report" 
                                icon="pi pi-download" 
                                class="p-button-primary"
                                :disabled="!isDateRangeSelected"
                                @click="exportReport" 
                            />
                        </div>
                    </div>
                </div>

                <!-- Preview Section -->
                <div v-if="showPreview" class="border rounded-lg p-6 bg-white">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Report Preview</div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i class="pi pi-info-circle"></i>
                            <span>Showing {{ previewData.length }} of {{ totalRecords }} records</span>
                        </div>
                    </div>

                    <!-- Preview Statistics -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold text-blue-600">{{ previewStats.totalReferrals }}</div>
                            <div class="text-sm text-blue-800">Total Referrals</div>
                        </div>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold text-green-600">{{ previewStats.successfulReferrals }}</div>
                            <div class="text-sm text-green-800">Successful</div>
                        </div>
                        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold text-orange-600">{{ previewStats.pendingReferrals }}</div>
                            <div class="text-sm text-orange-800">Pending</div>
                        </div>
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold text-purple-600">RM {{ previewStats.totalRewards.toLocaleString() }}</div>
                            <div class="text-sm text-purple-800">Total Rewards</div>
                        </div>
                    </div>

                    <!-- Preview Table -->
                    <DataTable 
                        :value="previewData" 
                        :paginator="true" 
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        dataKey="id" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column field="referralDate" header="Date" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ formatDate(data.referralDate) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="referrerName" header="Referrer" style="min-width: 150px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.referrerName }}</div>
                                <div class="text-xs text-gray-500">{{ data.referrerId }}</div>
                            </template>
                        </Column>

                        <Column field="referredName" header="Referred Member" style="min-width: 150px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.referredName }}</div>
                                <div class="text-xs text-gray-500">{{ data.referredEmail }}</div>
                            </template>
                        </Column>

                        <Column field="program" header="Program" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <Tag :value="data.program" :severity="getProgramSeverity(data.program)" />
                            </template>
                        </Column>

                        <Column field="status" header="Status" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                            </template>
                        </Column>

                        <Column field="rewardPoints" header="Reward Points" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-bold text-green-600">
                                    {{ data.rewardPoints.toLocaleString() }}
                                </div>
                            </template>
                        </Column>

                        <Column field="state" header="State" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ data.state }}
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-4">
                                No referral data found for the selected filters.
                            </div>
                        </template>
                    </DataTable>

                    <!-- Export Confirmation -->
                    <div class="flex justify-end gap-4 mt-6 pt-4 border-t">
                        <Button 
                            label="Close Preview" 
                            class="p-button-outlined p-button-secondary"
                            @click="showPreview = false" 
                        />
                        <Button 
                            label="Export Now" 
                            icon="pi pi-download" 
                            class="p-button-success"
                            @click="exportReport" 
                        />
                    </div>
                </div>

                <!-- Recent Exports -->
                <div class="border rounded-lg p-6 bg-white">
                    <div class="text-lg font-bold text-gray-800 mb-4">Recent Exports</div>
                    <DataTable 
                        :value="exportHistory" 
                        :paginator="true" 
                        :rows="5"
                        dataKey="id" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column field="exportDate" header="Export Date" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    <div class="font-semibold">{{ formatDate(data.exportDate) }}</div>
                                    <div class="text-gray-500 text-xs">{{ formatTime(data.exportDate) }}</div>
                                </div>
                            </template>
                        </Column>

                        <Column field="dateRange" header="Period" style="min-width: 150px">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ data.dateRange }}
                                </div>
                            </template>
                        </Column>

                        <Column field="records" header="Records" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-bold text-blue-600">
                                    {{ data.records.toLocaleString() }}
                                </div>
                            </template>
                        </Column>

                        <Column field="format" header="Format" style="min-width: 100px">
                            <template #body="{ data }">
                                <Tag :value="data.format.toUpperCase()" severity="info" />
                            </template>
                        </Column>

                        <Column field="exportedBy" header="Exported By" style="min-width: 120px">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-user text-gray-500"></i>
                                    <span>{{ data.exportedBy }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="min-width: 100px">
                            <template #body="{ data }">
                                <Button 
                                    icon="pi pi-download" 
                                    class="p-button-outlined p-button-info p-button-sm"
                                    @click="downloadExport(data.id)" 
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-4">
                                No export history found.
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const showPreview = ref(false);
const loading = ref(false);

// Filters
const filters = reactive({
    dateRange: null,
    programType: null,
    memberStatus: null,
    state: null,
    exportFormat: 'csv'
});

// Options
const programTypeOptions = ref([
    { label: 'All Programs', value: null },
    { label: 'Eten Program', value: 'eten' },
    { label: 'Toyo Care', value: 'toyo_care' },
    { label: 'Premium', value: 'premium' }
]);

const memberStatusOptions = ref([
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Verified', value: 'verified' },
    { label: 'Expired', value: 'expired' }
]);

const stateOptions = ref([
    'All States',
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak',
    'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'
]);

const exportFormatOptions = ref([
    { label: 'CSV (Excel)', value: 'csv' },
    { label: 'PDF Document', value: 'pdf' },
    { label: 'Excel Workbook', value: 'xlsx' }
]);

const datePresets = ref([
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'This Month', type: 'month' },
    { label: 'Last Month', type: 'last_month' },
    { label: 'This Year', type: 'year' }
]);

// Preview data
const previewData = ref([]);
const totalRecords = ref(0);
const previewStats = reactive({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0
});

// Export history
const exportHistory = ref([
    {
        id: 1,
        exportDate: new Date('2024-01-15T14:30:00'),
        dateRange: '1 Jan 2024 - 15 Jan 2024',
        records: 245,
        format: 'csv',
        exportedBy: 'Admin User'
    },
    {
        id: 2,
        exportDate: new Date('2024-01-10T10:15:00'),
        dateRange: '1 Dec 2023 - 31 Dec 2023',
        records: 567,
        format: 'xlsx',
        exportedBy: 'System Admin'
    },
    {
        id: 3,
        exportDate: new Date('2024-01-05T16:45:00'),
        dateRange: '1 Nov 2023 - 30 Nov 2023',
        records: 432,
        format: 'pdf',
        exportedBy: 'Admin User'
    },
    {
        id: 4,
        exportDate: new Date('2024-01-01T09:00:00'),
        dateRange: '1 Jan 2023 - 31 Dec 2023',
        records: 5234,
        format: 'csv',
        exportedBy: 'Report Manager'
    }
]);

// Sample preview data
const samplePreviewData = [
    {
        id: 1,
        referralDate: new Date('2024-01-15'),
        referrerName: 'Ahmad bin Ismail',
        referrerId: 'MEM001234',
        referredName: 'Siti Nurhaliza',
        referredEmail: 'siti.nur@email.com',
        program: 'Eten',
        status: 'Successful',
        rewardPoints: 500,
        state: 'Selangor'
    },
    {
        id: 2,
        referralDate: new Date('2024-01-14'),
        referrerName: 'Raj Kumar',
        referrerId: 'MEM001235',
        referredName: 'Chen Li Wei',
        referredEmail: 'chen.li@email.com',
        program: 'Toyo Care',
        status: 'Pending',
        rewardPoints: 1000,
        state: 'Kuala Lumpur'
    },
    {
        id: 3,
        referralDate: new Date('2024-01-13'),
        referrerName: 'Nor Aishah',
        referrerId: 'MEM001236',
        referredName: 'Lim Wei Jie',
        referredEmail: 'lim.wei@email.com',
        program: 'Eten',
        status: 'Successful',
        rewardPoints: 500,
        state: 'Johor'
    },
    {
        id: 4,
        referralDate: new Date('2024-01-12'),
        referrerName: 'Mohd Ali',
        referrerId: 'MEM001237',
        referredName: 'Priya Sharma',
        referredEmail: 'priya.s@email.com',
        program: 'Premium',
        status: 'Expired',
        rewardPoints: 0,
        state: 'Penang'
    },
    {
        id: 5,
        referralDate: new Date('2024-01-11'),
        referrerName: 'Tan Wei Ling',
        referrerId: 'MEM001238',
        referredName: 'Ahmad Firdaus',
        referredEmail: 'ahmad.f@email.com',
        program: 'Toyo Care',
        status: 'Successful',
        rewardPoints: 1000,
        state: 'Selangor'
    }
];

// Computed properties
const isDateRangeSelected = computed(() => {
    return filters.dateRange && filters.dateRange.length === 2;
});

const maxDate = computed(() => {
    return new Date();
});

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const getProgramSeverity = (program) => {
    switch (program) {
        case 'Eten': return 'info';
        case 'Toyo Care': return 'success';
        case 'Premium': return 'warning';
        default: return 'secondary';
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Successful': return 'success';
        case 'Pending': return 'warning';
        case 'Expired': return 'danger';
        default: return 'info';
    }
};

const applyDatePreset = (preset) => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (preset.days) {
        startDate.setDate(endDate.getDate() - preset.days);
    } else if (preset.type === 'month') {
        startDate.setDate(1);
    } else if (preset.type === 'last_month') {
        startDate.setMonth(endDate.getMonth() - 1, 1);
        endDate.setDate(0); // Last day of previous month
    } else if (preset.type === 'year') {
        startDate.setMonth(0, 1);
    }
    
    filters.dateRange = [startDate, endDate];
};

const clearFilters = () => {
    filters.dateRange = null;
    filters.programType = null;
    filters.memberStatus = null;
    filters.state = null;
    filters.exportFormat = 'csv';
    showPreview.value = false;
};

const generatePreview = () => {
    if (!isDateRangeSelected.value) {
        alert('Please select a date range first.');
        return;
    }

    loading.value = true;
    showPreview.value = true;

    // Simulate API call
    setTimeout(() => {
        previewData.value = samplePreviewData;
        totalRecords.value = 156;
        
        // Calculate preview stats
        previewStats.totalReferrals = previewData.value.length;
        previewStats.successfulReferrals = previewData.value.filter(item => item.status === 'Successful').length;
        previewStats.pendingReferrals = previewData.value.filter(item => item.status === 'Pending').length;
        previewStats.totalRewards = previewData.value.reduce((sum, item) => sum + item.rewardPoints, 0);
        
        loading.value = false;
        console.log('Preview generated with filters:', filters);
    }, 1000);
};

const exportReport = () => {
    if (!isDateRangeSelected.value) {
        alert('Please select a date range first.');
        return;
    }

    const exportData = {
        format: filters.exportFormat,
        dateRange: filters.dateRange,
        programType: filters.programType,
        memberStatus: filters.memberStatus,
        state: filters.state
    };

    console.log('Exporting report:', exportData);

    // Simulate export process
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        
        // Add to export history
        exportHistory.value.unshift({
            id: Date.now(),
            exportDate: new Date(),
            dateRange: `${formatDate(filters.dateRange[0])} - ${formatDate(filters.dateRange[1])}`,
            records: previewData.value.length,
            format: filters.exportFormat,
            exportedBy: 'Current User'
        });

        alert(`Report exported successfully as ${filters.exportFormat.toUpperCase()}!`);
    }, 2000);
};

const downloadExport = (exportId) => {
    console.log('Downloading export:', exportId);
    alert(`Download functionality for export ${exportId} would be implemented here`);
};

// Initialize
onMounted(() => {
    console.log('Referral Report component mounted');
});
</script>

<style scoped>
:deep(.p-calendar),
:deep(.p-dropdown) {
    width: 100%;
}
</style>