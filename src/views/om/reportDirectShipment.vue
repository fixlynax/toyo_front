<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Direct Shipment Summary
                </div>

                <!-- Filters Section -->
                <div class="border rounded-lg p-4 bg-gray-50">
                    <div class="text-lg font-bold text-gray-800 mb-4">Report Filters</div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <!-- Date Range -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Date Range</label>
                            <Calendar
                                v-model="filters.dateRange"
                                selectionMode="range"
                                :manualInput="false"
                                placeholder="Select Date Range"
                                class="w-full"
                            />
                        </div>

                        <!-- Shipment Status -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Shipment Status</label>
                            <Dropdown
                                v-model="filters.status"
                                :options="statusOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Status"
                                class="w-full"
                            />
                        </div>

                        <!-- Customer Type -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Type</label>
                            <Dropdown
                                v-model="filters.customerType"
                                :options="customerTypeOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Types"
                                class="w-full"
                            />
                        </div>

                        <!-- Region -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Region</label>
                            <Dropdown
                                v-model="filters.region"
                                :options="regionOptions"
                                placeholder="All Regions"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button
                            label="Clear Filters"
                            class="p-button-outlined p-button-secondary"
                            @click="clearFilters"
                        />
                        <Button
                            label="Generate Report"
                            class="p-button-primary"
                            @click="generateReport"
                        />
                        <Button
                            label="Export Summary"
                            icon="pi pi-download"
                            class="p-button-success"
                            @click="exportSummary"
                        />
                    </div>
                </div>
            </div>

            <!-- Summary Stats -->
            <!-- (unchanged section for brevity, same as your version) -->

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Shipment Status Distribution</div>
                    <Chart type="doughnut" :data="statusChartData" :options="chartOptions" style="height: 300px" />
                </div>

                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Monthly Shipment Trend</div>
                    <Chart type="bar" :data="monthlyTrendChartData" :options="chartOptions" style="height: 300px" />
                </div>
            </div>

            <!-- DataTable + other sections unchanged -->
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Chart from 'primevue/chart';

// ✅ Loading state
const loading = ref(false);

// ✅ Filters
const filters = reactive({
    dateRange: null,
    status: null,
    customerType: null,
    region: null
});

// ✅ Dropdown Options
const statusOptions = [
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' }
];

const customerTypeOptions = [
    { label: 'Dealer', value: 'Dealer' },
    { label: 'Distributor', value: 'Distributor' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Retail', value: 'Retail' }
];

const regionOptions = [
    { label: 'Central', value: 'Central' },
    { label: 'Southern', value: 'Southern' },
    { label: 'Northern', value: 'Northern' },
    { label: 'East Coast', value: 'East Coast' },
    { label: 'East Malaysia', value: 'East Malaysia' }
];

// ✅ Summary Stats
const summaryStats = reactive({
    totalShipments: 1247,
    completedShipments: 985,
    completionRate: 79,
    totalValue: 4589200,
    avgDeliveryTime: 3.2
});

// ✅ Sample Data
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
    }
]);

// ✅ Performance Metrics, Top Customers, Shipment Issues (unchanged)

// ✅ Chart Data
const statusChartData = ref({
    labels: ['Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
        {
            data: [65, 15, 12, 6, 2],
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#6B7280', '#EF4444']
        }
    ]
});

const monthlyTrendChartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Shipments',
            data: [120, 135, 98, 156, 145, 167, 189, 176, 154, 198, 210, 195],
            backgroundColor: '#3B82F6'
        }
    ]
});

// ✅ Chart Options
const chartOptions = ref({
    plugins: {
        legend: {
            position: 'bottom',
            labels: { usePointStyle: true }
        }
    },
    maintainAspectRatio: false
});

// ✅ Utility Methods
const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Delivered': return 'success';
        case 'Shipped': return 'info';
        case 'Processing': return 'warning';
        case 'Pending': return 'secondary';
        case 'Cancelled': return 'danger';
        default: return 'info';
    }
};

const getDeliveryTimeClass = (days) => {
    if (!days) return 'text-gray-400';
    if (days <= 2) return 'text-green-600';
    if (days <= 4) return 'text-orange-600';
    return 'text-red-600';
};

// ✅ Action Methods
const clearFilters = () => {
    Object.keys(filters).forEach((key) => (filters[key] = null));
};

const generateReport = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        console.log('Report generated with filters:', filters);
    }, 1000);
};

const exportSummary = () => alert('Summary export functionality would be implemented here');
const exportToCSV = () => alert('CSV export functionality would be implemented here');

const viewShipmentDetails = (shipment) => alert(`Viewing details for ${shipment.shipmentId}`);
const printReport = () => window.print();

onMounted(() => console.log('Direct Shipment Summary mounted'));
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
