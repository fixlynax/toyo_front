<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Direct Shipment Summary
                </div>
                
                <!-- Summary Stats Row -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="text-center p-4 border rounded-lg bg-blue-50">
                        <div class="text-3xl font-bold text-blue-600">{{ summaryStats.totalShipments.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Total Shipments</div>
                        <div class="text-xs text-green-600 mt-1">
                            <i class="pi pi-arrow-up"></i> 15.2% from last period
                        </div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-green-50">
                        <div class="text-3xl font-bold text-green-600">{{ summaryStats.completedShipments.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Completed</div>
                        <div class="text-xs text-gray-500 mt-1">
                            {{ summaryStats.completionRate }}% completion rate
                        </div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-purple-50">
                        <div class="text-3xl font-bold text-purple-600">RM {{ (summaryStats.totalValue / 1000).toFixed(0) }}K</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Total Value</div>
                        <div class="text-xs text-green-600 mt-1">
                            <i class="pi pi-arrow-up"></i> 8.7% from last period
                        </div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-orange-50">
                        <div class="text-3xl font-bold text-orange-600">{{ summaryStats.avgDeliveryTime }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Avg Delivery Days</div>
                        <div class="text-xs text-red-600 mt-1">
                            <i class="pi pi-arrow-up"></i> 1.2 days longer
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Status Distribution -->
                    <div class="border rounded-lg p-4">
                        <div class="text-lg font-bold text-gray-800 mb-4">Shipment Status</div>
                        <Chart 
                            type="doughnut" 
                            :data="statusChartData" 
                            :options="chartOptions"
                            style="height: 250px"
                        />
                    </div>

                    <!-- Monthly Trend -->
                    <div class="border rounded-lg p-4">
                        <div class="text-lg font-bold text-gray-800 mb-4">Monthly Trend</div>
                        <Chart 
                            type="bar" 
                            :data="monthlyTrendChartData" 
                            :options="chartOptions"
                            style="height: 250px"
                        />
                    </div>
                </div>
            
                <div class="flex justify-between items-center">
                    <div class="text-lg font-bold text-gray-800">Direct Shipment Details</div>
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

                    <Column header="Actions" style="min-width: 80px">
                        <template #body="{ data }">
                            <Button 
                                icon="pi pi-eye" 
                                class="p-button-info p-button-text p-button-sm" 
                                v-tooltip="'View Details'"
                                @click="viewShipmentDetails(data)" 
                            />
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

const chartOptions = ref({
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                font: {
                    size: 11
                }
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