<template>
    <Fluid>
        <!-- Main Content Area -->
        <div class="card flex flex-col gap-6 w-full">
            <!-- Header -->
            <div class="text-2xl font-bold text-gray-800">Direct Shipment Summary</div>

            <!-- Summary Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <!-- Total Shipments -->
                <div class="card p-4 bg-gray-50 border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Total Shipments</div>
                            <div class="text-2xl font-bold text-blue-600 mt-1">
                                {{ summaryStats.totalShipments.toLocaleString() }}
                            </div>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-truck text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-green-600 mt-2">
                        <i class="pi pi-arrow-up"></i> 15.2% from last period
                    </div>
                </div>

                <!-- Completed -->
                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Completed</div>
                            <div class="text-2xl font-bold text-green-600 mt-1">
                                {{ summaryStats.completedShipments.toLocaleString() }}
                            </div>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        {{ summaryStats.completionRate }}% completion rate
                    </div>
                </div>

                <!-- Total Value -->
                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Total Value</div>
                            <div class="text-2xl font-bold text-purple-600 mt-1">
                                RM {{ summaryStats.totalValue.toLocaleString() }}
                            </div>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-dollar text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-green-600 mt-2">
                        <i class="pi pi-arrow-up"></i> 8.7% from last period
                    </div>
                </div>

                <!-- Avg Delivery Time -->
                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Avg Delivery Time</div>
                            <div class="text-2xl font-bold text-orange-600 mt-1">
                                {{ summaryStats.avgDeliveryTime }} days
                            </div>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-clock text-orange-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2">
                        <i class="pi pi-arrow-up"></i> 1.2 days longer
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Shipment Status Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Shipment Status Distribution</div>
                    <Chart
                        type="doughnut"
                        :data="statusChartData"
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Monthly Shipment Trend -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Monthly Shipment Trend</div>
                    <Chart
                        type="bar"
                        :data="monthlyTrendChartData"
                        :options="chartOptions"
                        style="height: 300px"
                    />
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

                <DataTable
                    :value="shipmentData"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    dataKey="shipmentId"
                    :rowHover="true"
                    :loading="loading"
                    responsiveLayout="scroll"
                    :scrollable="true"
                    scrollHeight="400px"
                >
                    <Column field="shipmentId" header="Shipment ID" style="min-width: 120px" :sortable="true">
                        <template #body="{ data }">
                            <div class="font-mono text-sm font-semibold text-blue-600">
                                {{ data.shipmentId }}
                            </div>
                        </template>
                    </Column>

                    <Column field="orderDate" header="Order Date" style="min-width: 100px" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm">{{ formatDate(data.orderDate) }}</div>
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
                            <div class="text-sm">{{ formatDate(data.shipmentDate) }}</div>
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

                    <Column header="Actions" style="min-width: 80px">
                        <template #body="{ data }">
                            <Button icon="pi pi-eye" class="p-button-info p-button-text p-button-sm" v-tooltip="'View Details'" @click="viewShipmentDetails(data)" />
                        </template>
                    </Column>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <div>No shipment data found.</div>
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

// Summary Stats
const summaryStats = reactive({
    totalShipments: 1247,
    completedShipments: 985,
    completionRate: 79,
    totalValue: 4589200,
    avgDeliveryTime: 3.2
});

// Shipment Data
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

// Charts
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

const regionalChartData = ref({
    labels: ['Central', 'North', 'South', 'East Coast', 'East Malaysia'],
    datasets: [
        {
            data: [30, 25, 20, 15, 10],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
        }
    ]
});

const customerTypeChartData = ref({
    labels: ['Dealer', 'Distributor', 'Corporate', 'Retail'],
    datasets: [
        {
            data: [40, 30, 20, 10],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
        }
    ]
});

const chartOptions = ref({
    plugins: {
        legend: {
            position: 'bottom',
            labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } }
        }
    },
    maintainAspectRatio: false
});

// Methods
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

const exportToCSV = () => alert('CSV export functionality would be implemented here');
const printReport = () => window.print();
const viewShipmentDetails = (shipment) => alert(`Viewing details for shipment: ${shipment.shipmentId}`);

onMounted(() => console.log('Direct Shipment Summary mounted'));
</script>

<style scoped>
:deep(.p-datatable) {
    font-size: 0.875rem;
}
:deep(.p-chart) {
    font-size: 0.75rem;
}
@media print {
    .no-print {
        display: none !important;
    }
}
</style>
