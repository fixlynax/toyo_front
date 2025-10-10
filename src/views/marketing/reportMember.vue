<template>
    <Fluid>
        <!-- Header & Summary -->
        <div class="card flex flex-col gap-6 w-full">
            <div class="text-2xl font-bold text-gray-800">Member Report & Analytics</div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Total Members</div>
                            <div class="text-2xl font-bold text-blue-600 mt-1">{{ summaryStats.totalMembers.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-users text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-green-600 mt-2"><i class="pi pi-arrow-up"></i> 12.5% from last month</div>
                </div>

                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Active Members</div>
                            <div class="text-2xl font-bold text-green-600 mt-1">{{ summaryStats.activeMembers.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-user-plus text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-green-600 mt-2"><i class="pi pi-arrow-up"></i> 8.3% from last month</div>
                </div>

                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Avg Points</div>
                            <div class="text-2xl font-bold text-purple-600 mt-1">{{ summaryStats.averagePoints.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-star text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2"><i class="pi pi-arrow-down"></i> 2.1% from last month</div>
                </div>

                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Points Expiring</div>
                            <div class="text-2xl font-bold text-orange-600 mt-1">{{ summaryStats.pointsExpiring.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-clock text-orange-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2">This month</div>
                </div>
            </div>
        </div>

        <!-- Filters Section -->
        <div class="card border rounded-lg p-4 bg-gray-50 mt-8">
            <div class="text-lg font-bold text-gray-800 mb-4">Member Report Filters</div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Date Range</label>
                    <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="Select Date Range" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700 mb-2">Program Type</label>
                    <Dropdown v-model="filters.programType" :options="programTypeOptions" optionLabel="label" optionValue="value" placeholder="All Programs" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700 mb-2">State</label>
                    <Dropdown v-model="filters.state" :options="stateOptions" placeholder="All States" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700 mb-2">Age Group</label>
                    <Dropdown v-model="filters.ageGroup" :options="ageGroupOptions" optionLabel="label" optionValue="value" placeholder="All Ages" class="w-full" />
                </div>
            </div>

            <div class="flex justify-end gap-4 mt-4">
                <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                <Button label="Generate Report" class="p-button-primary" @click="generateReport" />
                <Button label="Export Summary" icon="pi pi-download" class="p-button-success" @click="exportSummary" />
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div class="card p-4 bg-white border rounded-lg">
                <div class="text-lg font-bold text-gray-800 mb-4">Gender Distribution</div>
                <Chart type="pie" :data="genderChartData" :options="chartOptions" style="height: 300px" />
            </div>

            <div class="card p-4 bg-white border rounded-lg">
                <div class="text-lg font-bold text-gray-800 mb-4">Age Group Distribution</div>
                <Chart type="bar" :data="ageGroupChartData" :options="chartOptions" style="height: 300px" />
            </div>

            <div class="card p-4 bg-white border rounded-lg">
                <div class="text-lg font-bold text-gray-800 mb-4">State Distribution</div>
                <Chart type="doughnut" :data="stateChartData" :options="chartOptions" style="height: 300px" />
            </div>

            <div class="card p-4 bg-white border rounded-lg">
                <div class="text-lg font-bold text-gray-800 mb-4">Birthday Month Distribution</div>
                <Chart type="polarArea" :data="birthdayChartData" :options="chartOptions" style="height: 300px" />
            </div>
        </div>

        <!-- Detailed Member Report Table -->
        <div class="card flex flex-col gap-6 w-full mt-8">
            <div class="flex justify-between items-center">
                <div class="text-lg font-bold text-gray-800">Detailed Member Report</div>
                <div class="flex gap-2">
                    <Button label="Export CSV" icon="pi pi-download" class="p-button-outlined p-button-secondary" @click="exportToCSV" />
                    <Button label="Print Report" icon="pi pi-print" class="p-button-outlined" @click="printReport" />
                </div>
            </div>

            <DataTable :value="memberReportData" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" :rowHover="true" :loading="loading" responsiveLayout="scroll" scrollHeight="400px">
                <Column field="memberId" header="Member ID" style="min-width: 100px" :sortable="true">
                    <template #body="{ data }"><div class="font-mono text-sm">{{ data.memberId }}</div></template>
                </Column>

                <Column field="name" header="Name" style="min-width: 150px" :sortable="true">
                    <template #body="{ data }">
                        <div class="font-semibold">{{ data.name }}</div>
                        <div class="text-xs text-gray-500">{{ data.email }}</div>
                    </template>
                </Column>

                <Column field="gender" header="Gender" style="min-width: 80px" :sortable="true">
                    <template #body="{ data }"><Tag :value="data.gender" :severity="getGenderSeverity(data.gender)" /></template>
                </Column>

                <Column field="state" header="State" style="min-width: 100px" :sortable="true">
                    <template #body="{ data }"><div class="flex items-center gap-1"><i class="pi pi-map-marker text-gray-400 text-xs"></i><span>{{ data.state }}</span></div></template>
                </Column>

                <Column field="age" header="Age" style="min-width: 80px" :sortable="true">
                    <template #body="{ data }"><Badge :value="data.age" :severity="getAgeSeverity(data.age)" /></template>
                </Column>

                <Column field="totalPoints" header="Total Points" style="min-width: 100px" :sortable="true">
                    <template #body="{ data }"><div class="font-bold text-blue-600">{{ data.totalPoints.toLocaleString() }}</div></template>
                </Column>

                <Column field="pointsExpiring" header="Points Expiring" style="min-width: 120px" :sortable="true">
                    <template #body="{ data }"><div class="font-bold" :class="data.pointsExpiring > 0 ? 'text-orange-600' : 'text-gray-400'">{{ data.pointsExpiring.toLocaleString() }}</div></template>
                </Column>

                <Column field="membershipTier" header="Tier" style="min-width: 100px" :sortable="true">
                    <template #body="{ data }"><Tag :value="data.membershipTier" :severity="getTierSeverity(data.membershipTier)" /></template>
                </Column>

                <Column field="joinDate" header="Join Date" style="min-width: 120px" :sortable="true">
                    <template #body="{ data }"><div class="text-sm">{{ formatDate(data.joinDate) }}</div></template>
                </Column>

                <template #empty>
                    <div class="text-center text-gray-500 py-8"><i class="pi pi-inbox text-4xl mb-2"></i><div>No member data found.</div></div>
                </template>
            </DataTable>
        </div>

        <!-- Points Expiry Summary Table -->
        <div class="card p-4 bg-white border rounded-lg mt-8">
            <div class="text-lg font-bold text-gray-800 mb-4">Points Expiry Summary</div>
            <DataTable :value="pointsExpiryData" :paginator="true" :rows="5" dataKey="month" :rowHover="true" responsiveLayout="scroll">
                <Column field="month" header="Month" style="min-width: 120px" />
                <Column field="totalPointsExpiring" header="Total Points Expiring" style="min-width: 150px">
                    <template #body="{ data }"><div class="font-bold text-orange-600">{{ data.totalPointsExpiring.toLocaleString() }}</div></template>
                </Column>
                <Column field="affectedMembers" header="Affected Members" style="min-width: 150px">
                    <template #body="{ data }"><div class="font-bold text-red-600">{{ data.affectedMembers.toLocaleString() }}</div></template>
                </Column>
                <Column field="averagePointsPerMember" header="Avg Points/Member" style="min-width: 150px">
                    <template #body="{ data }"><div class="font-bold text-blue-600">{{ data.averagePointsPerMember.toLocaleString() }}</div></template>
                </Column>
                <Column header="Actions" style="min-width: 100px">
                    <template #body="{ data }">
                        <Button label="Notify" class="p-button-outlined p-button-warning p-button-sm" @click="notifyExpiry(data.month)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </Fluid>
</template>



<script setup>
import { ref, reactive, onMounted } from 'vue';
import Chart from 'primevue/chart';

const loading = ref(false);

// Filters
const filters = reactive({
    dateRange: null,
    programType: null,
    state: null,
    ageGroup: null
});

// Options for filters
const programTypeOptions = ref([
    { label: 'All Programs', value: null },
    { label: 'Eten Program', value: 'eten' },
    { label: 'Toyo Care', value: 'toyo_care' },
    { label: 'Premium', value: 'premium' }
]);

const stateOptions = ref([
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak',
    'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'
]);

const ageGroupOptions = ref([
    { label: 'All Ages', value: null },
    { label: '18-25', value: '18-25' },
    { label: '26-35', value: '26-35' },
    { label: '36-45', value: '36-45' },
    { label: '46-55', value: '46-55' },
    { label: '56+', value: '56+' }
]);

// Summary Statistics
const summaryStats = reactive({
    totalMembers: 15420,
    activeMembers: 12850,
    averagePoints: 2450,
    pointsExpiring: 125000
});

// Sample data for charts and tables
const memberReportData = ref([
    {
        id: 1,
        memberId: 'MEM001234',
        name: 'Ahmad bin Ismail',
        email: 'ahmad.ismail@email.com',
        gender: 'Male',
        race: 'Malay',
        state: 'Selangor',
        age: 32,
        birthdayMonth: 'January',
        totalPoints: 3450,
        pointsExpiring: 500,
        membershipTier: 'Gold',
        joinDate: new Date('2023-03-15')
    },
    {
        id: 2,
        memberId: 'MEM001235',
        name: 'Siti Nurhaliza',
        email: 'siti.nur@email.com',
        gender: 'Female',
        race: 'Malay',
        state: 'Kuala Lumpur',
        age: 28,
        birthdayMonth: 'March',
        totalPoints: 2100,
        pointsExpiring: 0,
        membershipTier: 'Silver',
        joinDate: new Date('2023-06-22')
    },
    {
        id: 3,
        memberId: 'MEM001236',
        name: 'Raj Kumar',
        email: 'raj.kumar@email.com',
        gender: 'Male',
        race: 'Indian',
        state: 'Penang',
        age: 45,
        birthdayMonth: 'July',
        totalPoints: 5670,
        pointsExpiring: 1200,
        membershipTier: 'Platinum',
        joinDate: new Date('2022-11-08')
    },
    {
        id: 4,
        memberId: 'MEM001237',
        name: 'Chen Li Wei',
        email: 'chen.li@email.com',
        gender: 'Male',
        race: 'Chinese',
        state: 'Johor',
        age: 38,
        birthdayMonth: 'December',
        totalPoints: 1890,
        pointsExpiring: 300,
        membershipTier: 'Silver',
        joinDate: new Date('2023-08-14')
    },
    {
        id: 5,
        memberId: 'MEM001238',
        name: 'Nor Aishah',
        email: 'nor.aishah@email.com',
        gender: 'Female',
        race: 'Malay',
        state: 'Kelantan',
        age: 26,
        birthdayMonth: 'May',
        totalPoints: 4320,
        pointsExpiring: 750,
        membershipTier: 'Gold',
        joinDate: new Date('2023-01-30')
    }
]);

const pointsExpiryData = ref([
    { month: 'January 2024', totalPointsExpiring: 45000, affectedMembers: 320, averagePointsPerMember: 141 },
    { month: 'February 2024', totalPointsExpiring: 38000, affectedMembers: 280, averagePointsPerMember: 136 },
    { month: 'March 2024', totalPointsExpiring: 52000, affectedMembers: 410, averagePointsPerMember: 127 },
    { month: 'April 2024', totalPointsExpiring: 29000, affectedMembers: 220, averagePointsPerMember: 132 },
    { month: 'May 2024', totalPointsExpiring: 61000, affectedMembers: 480, averagePointsPerMember: 127 }
]);

// Chart Data
const genderChartData = ref({
    labels: ['Male', 'Female'],
    datasets: [
        {
            data: [65, 35],
            backgroundColor: ['#3B82F6', '#EC4899'],
            hoverBackgroundColor: ['#2563EB', '#DB2777']
        }
    ]
});

const ageGroupChartData = ref({
    labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
    datasets: [
        {
            label: 'Members',
            data: [25, 35, 20, 15, 5],
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1
        }
    ]
});

const stateChartData = ref({
    labels: ['Selangor', 'Kuala Lumpur', 'Johor', 'Penang', 'Sabah', 'Others'],
    datasets: [
        {
            data: [35, 25, 15, 10, 8, 7],
            backgroundColor: [
                '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'
            ]
        }
    ]
});

const birthdayChartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            data: [8, 7, 9, 8, 10, 7, 8, 9, 8, 9, 8, 9],
            backgroundColor: [
                '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280',
                '#EF4444', '#84CC16', '#06B6D4', '#F97316', '#8B5CF6', '#64748B'
            ]
        }
    ]
});

const chartOptions = ref({
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true
            }
        }
    },
    maintainAspectRatio: false
});

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getGenderSeverity = (gender) => {
    return gender === 'Male' ? 'info' : 'warning';
};

const getAgeSeverity = (age) => {
    if (age < 30) return 'success';
    if (age < 40) return 'info';
    if (age < 50) return 'warning';
    return 'danger';
};

const getTierSeverity = (tier) => {
    switch (tier) {
        case 'Platinum': return 'primary';
        case 'Gold': return 'warning';
        case 'Silver': return 'secondary';
        default: return 'info';
    }
};

const clearFilters = () => {
    filters.dateRange = null;
    filters.programType = null;
    filters.state = null;
    filters.ageGroup = null;
};

const generateReport = () => {
    loading.value = true;
    // Simulate API call
    setTimeout(() => {
        loading.value = false;
        console.log('Report generated with filters:', filters);
    }, 1000);
};

const exportToCSV = () => {
    console.log('Exporting to CSV...');
    // In real implementation, this would generate and download CSV
    alert('CSV export functionality would be implemented here');
};

const printReport = () => {
    window.print();
};

const notifyExpiry = (month) => {
    console.log(`Notifying members about points expiring in ${month}`);
    alert(`Notification would be sent for ${month} expiry`);
};

// Initialize charts
onMounted(() => {
    console.log('Member Report component mounted');
});
</script>

<style scoped>
:deep(.p-calendar),
:deep(.p-dropdown) {
    width: 100%;
}

@media print {
    .no-print {
        display: none !important;
    }
    
    .card {
        break-inside: avoid;
    }
}
</style>