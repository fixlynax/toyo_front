<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Report Own Collection
                </div>
                
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Total Collections</div>
                                <div class="text-2xl font-bold text-blue-600 mt-1">{{ summaryStats.totalCollections.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-shopping-bag text-blue-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-green-600 mt-2">
                            <i class="pi pi-arrow-up"></i> 12.5% from last period
                        </div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Completed</div>
                                <div class="text-2xl font-bold text-green-600 mt-1">{{ summaryStats.completedCollections.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-check-circle text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            {{ summaryStats.completionRate }}% completion rate
                        </div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Total Value</div>
                                <div class="text-2xl font-bold text-purple-600 mt-1">RM {{ summaryStats.totalValue.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-dollar text-purple-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-green-600 mt-2">
                            <i class="pi pi-arrow-up"></i> 8.7% from last period
                        </div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Avg Wait Time</div>
                                <div class="text-2xl font-bold text-orange-600 mt-1">{{ summaryStats.avgWaitTime }} mins</div>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-clock text-orange-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-red-600 mt-2">
                            <i class="pi pi-arrow-up"></i> 2.3 mins longer
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Daily Collection Trend -->
                    <div class="p-4 bg-white border rounded-lg">
                        <div class="text-lg font-bold text-gray-800 mb-4">Daily Collection Trend</div>
                        <Chart 
                            type="bar" 
                            :data="dailyTrendChartData" 
                            :options="chartOptions"
                            style="height: 300px"
                        />
                    </div>

                    <!-- Time Slot Distribution -->
                    <div class="p-4 bg-white border rounded-lg">
                        <div class="text-lg font-bold text-gray-800 mb-4">Collection Trends</div>
                        <Chart 
                            type="line" 
                            :data="timeSlotChartData" 
                            :options="chartOptions"
                            style="height: 300px"
                        />
                    </div>
                </div>

                <!-- Detailed Collections Table -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Collection Details</div>
                        <div class="flex gap-2">
                            <Button 
                                label="Export CSV" 
                                icon="pi pi-download" 
                                class="p-button-outlined p-button-secondary"
                                @click="exportToCSV" 
                            />
                            <Button 
                                label="Print Report" 
                                icon="pi pi-print" 
                                class="p-button-outlined"
                                @click="printReport" 
                            />
                        </div>
                    </div>

                    <DataTable 
                        :value="collectionData" 
                        :paginator="true" 
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        dataKey="collectionId" 
                        :rowHover="true"
                        :loading="loading"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="400px"
                    >
                        <Column field="collectionId" header="Collection ID" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-mono text-sm font-semibold text-blue-600">
                                    {{ data.collectionId }}
                                </div>
                            </template>
                        </Column>

                        <Column field="orderDate" header="Order Date" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ formatDate(data.orderDate) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="collectionDate" header="Collection Date" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ formatDate(data.collectionDate) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="customerName" header="Customer" style="min-width: 150px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.customerName }}</div>
                                <div class="text-xs text-gray-500">{{ data.customerType }}</div>
                            </template>
                        </Column>

                        <Column field="collectionPoint" header="Collection Point" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="flex items-center gap-1">
                                    <i class="pi pi-map-marker text-gray-400 text-xs"></i>
                                    <span>{{ data.collectionPoint }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column field="totalValue" header="Order Value" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-bold text-purple-600">
                                    RM {{ data.totalValue.toLocaleString() }}
                                </div>
                            </template>
                        </Column>

                        <Column field="status" header="Status" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.status" 
                                    :severity="getStatusSeverity(data.status)" 
                                />
                            </template>
                        </Column>

                        <Column field="timeSlot" header="Time Slot" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm font-medium">
                                    {{ data.timeSlot }}
                                </div>
                            </template>
                        </Column>

                        <Column field="waitTime" header="Wait Time" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold" :class="getWaitTimeClass(data.waitTime)">
                                    {{ data.waitTime || '-' }} mins
                                </div>
                            </template>
                        </Column>

                        <Column field="collectionType" header="Type" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.collectionType" 
                                    severity="info"
                                />
                            </template>
                        </Column>

                        <Column header="Actions" style="min-width: 100px">
                            <template #body="{ data }">
                                <Button 
                                    icon="pi pi-eye" 
                                    class="p-button-info p-button-text p-button-sm" 
                                    v-tooltip="'View Details'"
                                    @click="viewCollectionDetails(data)" 
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-8">
                                <i class="pi pi-inbox text-4xl mb-2"></i>
                                <div>No collection data found.</div>
                                <div class="text-sm mt-1">Adjust your filters or generate a new report.</div>
                            </div>
                        </template>

                        <template #loading>
                            <div class="text-center py-4">
                                <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                                Loading collection data...
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Chart from 'primevue/chart';

const loading = ref(false);

// Summary Statistics
const summaryStats = reactive({
    totalCollections: 856,
    completedCollections: 732,
    completionRate: 85.5,
    totalValue: 3245600,
    avgWaitTime: 8.2
});

// Sample data
const collectionData = ref([
    {
        collectionId: 'COL-2024-001234',
        orderDate: new Date('2024-01-15'),
        collectionDate: new Date('2024-01-16'),
        customerName: 'Ahmad bin Ismail',
        customerType: 'Retail Customer',
        collectionPoint: 'Main Warehouse',
        totalValue: 2450,
        status: 'Collected',
        timeSlot: 'Morning (8AM-12PM)',
        waitTime: 5,
        collectionType: 'Standard Collection'
    },
    {
        collectionId: 'COL-2024-001235',
        orderDate: new Date('2024-01-16'),
        collectionDate: new Date('2024-01-17'),
        customerName: 'PS Tyres & Battery',
        customerType: 'Dealer',
        collectionPoint: 'Central Hub',
        totalValue: 18700,
        status: 'Ready for Pickup',
        timeSlot: 'Afternoon (12PM-4PM)',
        waitTime: null,
        collectionType: 'Bulk Collection'
    },
    {
        collectionId: 'COL-2024-001236',
        orderDate: new Date('2024-01-14'),
        collectionDate: new Date('2024-01-18'),
        customerName: 'ABC Motors Sdn Bhd',
        customerType: 'Corporate',
        collectionPoint: 'North Branch',
        totalValue: 32500,
        status: 'Scheduled',
        timeSlot: 'Morning (8AM-12PM)',
        waitTime: null,
        collectionType: 'Scheduled Pickup'
    },
    {
        collectionId: 'COL-2024-001237',
        orderDate: new Date('2024-01-13'),
        collectionDate: new Date('2024-01-15'),
        customerName: 'City Auto Retail',
        customerType: 'VIP',
        collectionPoint: 'Main Warehouse',
        totalValue: 8900,
        status: 'Collected',
        timeSlot: 'Evening (4PM-8PM)',
        waitTime: 12,
        collectionType: 'Express Collection'
    },
    {
        collectionId: 'COL-2024-001238',
        orderDate: new Date('2024-01-12'),
        collectionDate: new Date('2024-01-14'),
        customerName: 'Borneo Tyre Services',
        customerType: 'Dealer',
        collectionPoint: 'South Branch',
        totalValue: 15600,
        status: 'Cancelled',
        timeSlot: 'Afternoon (12PM-4PM)',
        waitTime: null,
        collectionType: 'Standard Collection'
    }
]);

// Chart Data
const dailyTrendChartData = ref({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Collections',
            data: [45, 52, 38, 61, 55, 48, 35],
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1
        }
    ]
});

const timeSlotChartData = ref({
    labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
    datasets: [
        {
            label: 'Collections per Hour',
            data: [15, 28, 45, 38, 32, 25, 42, 35, 28, 38, 25, 18],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
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

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Collected': return 'success';
        case 'Ready for Pickup': return 'info';
        case 'Scheduled': return 'warning';
        case 'Cancelled': return 'danger';
        case 'Overdue': return 'secondary';
        default: return 'info';
    }
};

const getWaitTimeClass = (waitTime) => {
    if (!waitTime) return 'text-gray-400';
    if (waitTime <= 5) return 'text-green-600';
    if (waitTime <= 10) return 'text-orange-600';
    return 'text-red-600';
};

const exportToCSV = () => {
    console.log('Exporting to CSV...');
    alert('CSV export functionality would be implemented here');
};

const printReport = () => {
    window.print();
};

const viewCollectionDetails = (collection) => {
    console.log('Viewing collection details:', collection);
    alert(`Viewing details for collection: ${collection.collectionId}`);
};

// Initialize
onMounted(() => {
    console.log('Report Own Collection component mounted');
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
}
</style>