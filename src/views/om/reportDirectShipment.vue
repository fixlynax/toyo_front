<template>
    <Fluid>
        <!-- Main Content Area -->
        <div class="card flex flex-col gap-6 w-full">
            <!-- Header -->
            <div class="text-2xl font-bold text-gray-800">Direct Shipment Summary</div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Total Shipments</div>
                            <div class="text-2xl font-bold text-blue-600 mt-1">{{ summaryStats.totalShipments.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-truck text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-green-600 mt-2"><i class="pi pi-arrow-up"></i> 15.2% from last period</div>
                </div>

                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Completed</div>
                            <div class="text-2xl font-bold text-green-600 mt-1">{{ summaryStats.completedShipments.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">{{ summaryStats.completionRate }}% completion rate</div>
                </div>

                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Total Value</div>
                            <div class="text-2xl font-bold text-purple-600 mt-1">RM {{ summaryStats.totalValue.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-dollar text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-green-600 mt-2"><i class="pi pi-arrow-up"></i> 8.7% from last period</div>
                </div>

                <div class="card p-4 !bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Avg Delivery Time</div>
                            <div class="text-2xl font-bold text-orange-600 mt-1">{{ summaryStats.avgDeliveryTime }} days</div>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-clock text-orange-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2"><i class="pi pi-arrow-up"></i> 1.2 days longer</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-8">
            <!-- Filters Section - Moved to top -->
            <div class="card border rounded-lg p-4 bg-gray-50">
                <div class="text-lg font-bold text-gray-800 mb-4">Direct Shipment Report Filters</div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Date Range -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Date Range</label>
                        <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="Select Date Range" class="w-full" />
                    </div>

                    <!-- Shipment Status -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Shipment Status</label>
                        <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="All Status" class="w-full" />
                    </div>

                    <!-- Customer Type -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Customer Type</label>
                        <Dropdown v-model="filters.customerType" :options="customerTypeOptions" optionLabel="label" optionValue="value" placeholder="All Types" class="w-full" />
                    </div>

                    <!-- Region -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Region</label>
                        <Dropdown v-model="filters.region" :options="regionOptions" placeholder="All Regions" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 mt-4">
                    <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                    <Button label="Generate Report" class="p-button-primary" @click="generateReport" />
                    <Button label="Export Summary" icon="pi pi-download" class="p-button-success" @click="exportSummary" />
                </div>
            </div>
            <!-- Performance Metrics -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- On-Time Delivery Performance -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">On-Time Delivery Performance</div>
                    <div class="space-y-4">
                        <div v-for="metric in performanceMetrics" :key="metric.label" class="flex justify-between items-center">
                            <span class="text-gray-700">{{ metric.label }}</span>
                            <div class="flex items-center gap-2">
                                <span class="font-bold bg-white" :class="metric.color"> {{ metric.value }}% </span>
                                <div class="w-24 bg-gray-200 rounded-full h-2">
                                    <div class="h-2 rounded-full" :class="metric.color" :style="{ width: metric.value + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Customers -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Top Customers by Volume</div>
                    <div class="space-y-3">
                        <div v-for="customer in topCustomers" :key="customer.name" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-building text-gray-400"></i>
                                <span class="font-medium">{{ customer.name }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">{{ customer.shipments }} shipments</span>
                                <span class="font-bold text-purple-600">RM {{ customer.value.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shipment Issues Summary -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Shipment Issues Summary</div>
                    <div class="space-y-3">
                        <div v-for="issue in shipmentIssues" :key="issue.type" class="flex justify-between items-center p-2 border-b">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-exclamation-triangle" :class="issue.color"></i>
                                <span>{{ issue.type }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-bold" :class="issue.color">{{ issue.count }}</span>
                                <span class="text-sm text-gray-500">({{ issue.percentage }}%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Shipment Status Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Shipment Status Distribution</div>
                    <Chart type="doughnut" :data="statusChartData" :options="chartOptions" style="height: 300px" />
                </div>

                <!-- Monthly Shipment Trend -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Monthly Shipment Trend</div>
                    <Chart type="bar" :data="monthlyTrendChartData" :options="chartOptions" style="height: 300px" />
                </div>

                <!-- Regional Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Regional Distribution</div>
                    <Chart type="pie" :data="regionalChartData" :options="chartOptions" style="height: 300px" />
                </div>

                <!-- Customer Type Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Customer Type Distribution</div>
                    <Chart type="polarArea" :data="customerTypeChartData" :options="chartOptions" style="height: 300px" />
                </div>
            </div>

            <!-- Detailed Shipments Table -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="flex justify-between items-center">
                    <div class="text-lg font-bold text-gray-800">Direct Shipment Details</div>
                    <div class="flex gap-2">
                        <Button label="Export CSV" icon="pi pi-download" class="p-button-outlined p-button-secondary" @click="exportToCSV" />
                        <Button label="Print Report" icon="pi pi-print" class="p-button-outlined" @click="printReport" />
                    </div>
                </div>

                <DataTable :value="shipmentData" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="shipmentId" :rowHover="true" :loading="loading" responsiveLayout="scroll" :scrollable="true" scrollHeight="400px">
                    <Column field="shipmentId" header="Shipment ID" style="min-width: 120px" :sortable="true">
                        <template #body="{ data }">
                            <div class="font-mono text-sm font-semibold text-blue-600">
                                {{ data.shipmentId }}
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

                    <Column field="customerName" header="Customer" style="min-width: 150px" :sortable="true">
                        <template #body="{ data }">
                            <div class="font-semibold">{{ data.customerName }}</div>
                            <div class="text-xs text-gray-500">{{ data.customerType }}</div>
                        </template>
                    </Column>

                    <Column field="region" header="Region" style="min-width: 100px" :sortable="true">
                        <template #body="{ data }">
                            <div class="flex items-center gap-1">
                                <i class="pi pi-map-marker text-gray-400 text-xs"></i>
                                <span>{{ data.region }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="totalValue" header="Order Value" style="min-width: 120px" :sortable="true">
                        <template #body="{ data }">
                            <div class="font-bold text-purple-600">RM {{ data.totalValue.toLocaleString() }}</div>
                        </template>
                    </Column>

                    <Column field="status" header="Status" style="min-width: 120px" :sortable="true">
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                        </template>
                    </Column>

                    <Column field="shipmentDate" header="Shipment Date" style="min-width: 100px" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm">
                                {{ formatDate(data.shipmentDate) }}
                            </div>
                        </template>
                    </Column>

                    <Column field="deliveryDate" header="Delivery Date" style="min-width: 100px" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm" :class="data.deliveryDate ? 'text-gray-800' : 'text-gray-400'">
                                {{ data.deliveryDate ? formatDate(data.deliveryDate) : 'Pending' }}
                            </div>
                        </template>
                    </Column>

                    <Column field="deliveryTime" header="Days" style="min-width: 80px" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-center font-bold" :class="getDeliveryTimeClass(data.deliveryTime)">
                                {{ data.deliveryTime || '-' }}
                            </div>
                        </template>
                    </Column>

                    <Column header="Actions" style="min-width: 100px">
                        <template #body="{ data }">
                            <Button icon="pi pi-eye" class="p-button-info p-button-text p-button-sm" v-tooltip="'View Details'" @click="viewShipmentDetails(data)" />
                        </template>
                    </Column>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <div>No shipment data found.</div>
                            <div class="text-sm mt-1">Adjust your filters or generate a new report.</div>
                        </div>
                    </template>

                    <template #loading>
                        <div class="text-center py-4">
                            <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                            Loading shipment data...
                        </div>
                    </template>
                </DataTable>
            </div>
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
    status: null,
    customerType: null,
    region: null
});

// Options for filters
const statusOptions = ref([
    { label: 'All Status', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
]);

const customerTypeOptions = ref([
    { label: 'All Types', value: null },
    { label: 'Dealer', value: 'Dealer' },
    { label: 'Distributor', value: 'Distributor' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Retail', value: 'Retail' }
]);

const regionOptions = ref(['All Regions', 'Central Region', 'Northern Region', 'Southern Region', 'East Coast', 'East Malaysia', 'Sabah', 'Sarawak']);

// Summary Statistics
const summaryStats = reactive({
    totalShipments: 1247,
    completedShipments: 985,
    completionRate: 79,
    totalValue: 4589200,
    avgDeliveryTime: 3.2
});

// Sample data
const shipmentData = ref([
    {
        shipmentId: 'DS-2024-001234',
        orderDate: new Date('2024-01-15'),
        customerName: 'PS Tyres & Battery Auto Services',
        customerType: 'Dealer',
        region: 'Central Region',
        totalValue: 24500,
        status: 'Delivered',
        shipmentDate: new Date('2024-01-16'),
        deliveryDate: new Date('2024-01-18'),
        deliveryTime: 2
    },
    {
        shipmentId: 'DS-2024-001235',
        orderDate: new Date('2024-01-16'),
        customerName: 'Toyo Auto Centre UHP Tyres',
        customerType: 'Distributor',
        region: 'Southern Region',
        totalValue: 18700,
        status: 'Shipped',
        shipmentDate: new Date('2024-01-17'),
        deliveryDate: null,
        deliveryTime: null
    },
    {
        shipmentId: 'DS-2024-001236',
        orderDate: new Date('2024-01-14'),
        customerName: 'ABC Motors Sdn Bhd',
        customerType: 'Corporate',
        region: 'Northern Region',
        totalValue: 32500,
        status: 'Processing',
        shipmentDate: null,
        deliveryDate: null,
        deliveryTime: null
    },
    {
        shipmentId: 'DS-2024-001237',
        orderDate: new Date('2024-01-13'),
        customerName: 'City Auto Retail',
        customerType: 'Retail',
        region: 'East Coast',
        totalValue: 8900,
        status: 'Delivered',
        shipmentDate: new Date('2024-01-14'),
        deliveryDate: new Date('2024-01-17'),
        deliveryTime: 3
    },
    {
        shipmentId: 'DS-2024-001238',
        orderDate: new Date('2024-01-12'),
        customerName: 'Borneo Tyre Services',
        customerType: 'Dealer',
        region: 'East Malaysia',
        totalValue: 15600,
        status: 'Cancelled',
        shipmentDate: null,
        deliveryDate: null,
        deliveryTime: null
    }
]);

// Performance Metrics
const performanceMetrics = ref([
    { label: 'On-Time Delivery', value: 87, color: 'text-green-600 bg-green-500' },
    { label: 'Within 2 Days', value: 65, color: 'text-blue-600 bg-blue-500' },
    { label: 'Within 3 Days', value: 92, color: 'text-purple-600 bg-purple-500' },
    { label: 'Delayed Shipments', value: 8, color: 'text-orange-600 bg-orange-500' }
]);

// Top Customers
const topCustomers = ref([
    { name: 'PS Tyres & Battery', shipments: 45, value: 1250000 },
    { name: 'Toyo Auto Centre', shipments: 38, value: 980000 },
    { name: 'ABC Motors', shipments: 32, value: 875000 },
    { name: 'City Auto Retail', shipments: 28, value: 456000 },
    { name: 'Borneo Tyre Services', shipments: 25, value: 389000 }
]);

// Shipment Issues
const shipmentIssues = ref([
    { type: 'Delivery Delays', count: 23, percentage: 1.8, color: 'text-orange-500' },
    { type: 'Damaged Goods', count: 8, percentage: 0.6, color: 'text-red-500' },
    { type: 'Wrong Items', count: 5, percentage: 0.4, color: 'text-yellow-500' },
    { type: 'Missing Documentation', count: 12, percentage: 1.0, color: 'text-blue-500' }
]);

// Chart Data
const statusChartData = ref({
    labels: ['Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
        {
            data: [65, 15, 12, 6, 2],
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#6B7280', '#EF4444'],
            hoverBackgroundColor: ['#059669', '#2563EB', '#D97706', '#4B5563', '#DC2626']
        }
    ]
});

const monthlyTrendChartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Shipments',
            data: [120, 135, 98, 156, 145, 167, 189, 176, 154, 198, 210, 195],
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1
        }
    ]
});

const regionalChartData = ref({
    labels: ['Central', 'Southern', 'Northern', 'East Coast', 'East Malaysia'],
    datasets: [
        {
            data: [45, 20, 15, 12, 8],
            backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6']
        }
    ]
});

const customerTypeChartData = ref({
    labels: ['Dealer', 'Distributor', 'Corporate', 'Retail'],
    datasets: [
        {
            data: [40, 30, 20, 10],
            backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B']
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
        case 'Delivered':
            return 'success';
        case 'Shipped':
            return 'info';
        case 'Processing':
            return 'warning';
        case 'Pending':
            return 'secondary';
        case 'Cancelled':
            return 'danger';
        default:
            return 'info';
    }
};

const getDeliveryTimeClass = (days) => {
    if (!days) return 'text-gray-400';
    if (days <= 2) return 'text-green-600';
    if (days <= 4) return 'text-orange-600';
    return 'text-red-600';
};

const clearFilters = () => {
    filters.dateRange = null;
    filters.status = null;
    filters.customerType = null;
    filters.region = null;
};

const generateReport = () => {
    loading.value = true;
    // Simulate API call
    setTimeout(() => {
        loading.value = false;
        console.log('Report generated with filters:', filters);
    }, 1000);
};

const exportSummary = () => {
    console.log('Exporting summary...');
    alert('Summary export functionality would be implemented here');
};

const exportToCSV = () => {
    console.log('Exporting to CSV...');
    alert('CSV export functionality would be implemented here');
};

const printReport = () => {
    window.print();
};

const viewShipmentDetails = (shipment) => {
    console.log('Viewing shipment details:', shipment);
    alert(`Viewing details for shipment: ${shipment.shipmentId}`);
};

// Initialize
onMounted(() => {
    console.log('Direct Shipment Summary component mounted');
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
