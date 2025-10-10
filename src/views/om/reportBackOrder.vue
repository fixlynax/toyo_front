<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Report Back Order
                </div>
            
                
                <!-- Summary Stats Row -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="text-center p-4 border rounded-lg bg-blue-50">
                        <div class="text-3xl font-bold text-blue-600">{{ summaryStats.totalBackOrders.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Total Back Orders</div>
                        <div class="text-xs text-red-600 mt-1">
                            <i class="pi pi-arrow-up"></i> 8.3% from last period
                        </div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-green-50">
                        <div class="text-3xl font-bold text-green-600">{{ summaryStats.fulfilledOrders.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Fulfilled Orders</div>
                        <div class="text-xs text-gray-500 mt-1">
                            {{ summaryStats.fulfillmentRate }}% fulfillment rate
                        </div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-orange-50">
                        <div class="text-3xl font-bold text-orange-600">RM {{ (summaryStats.pendingValue / 1000).toFixed(0) }}K</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Pending Value</div>
                        <div class="text-xs text-red-600 mt-1">
                            <i class="pi pi-arrow-up"></i> 12.5% from last period
                        </div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-purple-50">
                        <div class="text-3xl font-bold text-purple-600">{{ summaryStats.avgWaitDays }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Avg Wait Days</div>
                        <div class="text-xs text-red-600 mt-1">
                            <i class="pi pi-arrow-up"></i> 2.1 days longer
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Status Distribution -->
                    <div class="p-4 bg-white border rounded-lg">
                        <div class="text-lg font-bold text-gray-800 mb-4">Status Distribution</div>
                        <Chart 
                            type="doughnut" 
                            :data="statusChartData" 
                            :options="chartOptions"
                            style="height: 250px"
                        />
                    </div>

                    <!-- Monthly Trend -->
                    <div class="p-4 bg-white border rounded-lg">
                        <div class="text-lg font-bold text-gray-800 mb-4">Monthly Trend</div>
                        <Chart 
                            type="bar" 
                            :data="monthlyTrendChartData" 
                            :options="chartOptions"
                            style="height: 250px"
                        />
                    </div>
                </div>

                <!-- Detailed Back Orders Table -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Back Order Details</div>
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
                        :value="backOrderData" 
                        :paginator="true" 
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        dataKey="backOrderId" 
                        :rowHover="true"
                        :loading="loading"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="400px"
                    >
                        <Column field="backOrderId" header="Back Order ID" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-mono text-sm font-semibold text-blue-600">
                                    {{ data.backOrderId }}
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

                        <Column field="productName" header="Product" style="min-width: 150px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.productName }}</div>
                                <div class="text-xs text-gray-500">{{ data.productCategory }}</div>
                            </template>
                        </Column>

                        <Column field="quantity" header="Qty" style="min-width: 80px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold text-orange-600">
                                    {{ data.quantity }}
                                </div>
                            </template>
                        </Column>

                        <Column field="orderValue" header="Order Value" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-bold text-purple-600">
                                    RM {{ data.orderValue.toLocaleString() }}
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

                        <Column field="priority" header="Priority" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.priority" 
                                    :severity="getPrioritySeverity(data.priority)" 
                                />
                            </template>
                        </Column>

                        <Column field="waitDays" header="Wait Days" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold" :class="getWaitDaysClass(data.waitDays)">
                                    {{ data.waitDays }}
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="min-width: 80px">
                            <template #body="{ data }">
                                <Button 
                                    icon="pi pi-eye" 
                                    class="p-button-info p-button-text p-button-sm" 
                                    v-tooltip="'View Details'"
                                    @click="viewBackOrderDetails(data)" 
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-8">
                                <i class="pi pi-inbox text-4xl mb-2"></i>
                                <div>No back order data found.</div>
                            </div>
                        </template>

                        <template #loading>
                            <div class="text-center py-4">
                                <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                                Loading back order data...
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
    totalBackOrders: 347,
    fulfilledOrders: 189,
    fulfillmentRate: 54.5,
    pendingValue: 2456700,
    avgWaitDays: 7.2
});

// Sample data
const backOrderData = ref([
    {
        backOrderId: 'BO-2024-001234',
        orderDate: new Date('2024-01-15'),
        customerName: 'PS Tyres & Battery Auto Services',
        customerType: 'Dealer',
        productName: 'Toyo Proxes 205/55R16',
        productCategory: 'Passenger Tyres',
        quantity: 25,
        orderValue: 18750,
        status: 'Pending Fulfillment',
        priority: 'High',
        waitDays: 5,
        estimatedArrival: new Date('2024-01-25'),
        supplier: 'Toyo Tires Malaysia'
    },
    {
        backOrderId: 'BO-2024-001235',
        orderDate: new Date('2024-01-16'),
        customerName: 'ABC Motors Sdn Bhd',
        customerType: 'Corporate',
        productName: 'Bridgestone Dueler 265/65R17',
        productCategory: 'SUV Tyres',
        quantity: 15,
        orderValue: 22500,
        status: 'In Transit',
        priority: 'Medium',
        waitDays: 3,
        estimatedArrival: new Date('2024-01-20'),
        supplier: 'Bridgestone Corp'
    },
    {
        backOrderId: 'BO-2024-001236',
        orderDate: new Date('2024-01-14'),
        customerName: 'City Auto Retail',
        customerType: 'Retail',
        productName: 'Michelin Pilot Sport 4',
        productCategory: 'Passenger Tyres',
        quantity: 8,
        orderValue: 6400,
        status: 'Partially Fulfilled',
        priority: 'Medium',
        waitDays: 8,
        estimatedArrival: new Date('2024-01-22'),
        supplier: 'Michelin Asia'
    },
    {
        backOrderId: 'BO-2024-001237',
        orderDate: new Date('2024-01-13'),
        customerName: 'Toyo Auto Centre UHP Tyres',
        customerType: 'Distributor',
        productName: 'Goodyear Wrangler AT',
        productCategory: 'SUV Tyres',
        quantity: 40,
        orderValue: 52000,
        status: 'Ready for Pickup',
        priority: 'Critical',
        waitDays: 12,
        estimatedArrival: new Date('2024-01-18'),
        supplier: 'Goodyear Malaysia'
    },
    {
        backOrderId: 'BO-2024-001238',
        orderDate: new Date('2024-01-12'),
        customerName: 'Borneo Tyre Services',
        customerType: 'Dealer',
        productName: 'Continental ContiEco',
        productCategory: 'Commercial Tyres',
        quantity: 30,
        orderValue: 37500,
        status: 'Cancelled',
        priority: 'Low',
        waitDays: 15,
        estimatedArrival: null,
        supplier: 'Continental Tires'
    }
]);

// Chart Data
const statusChartData = ref({
    labels: ['Pending', 'In Transit', 'Partial', 'Ready', 'Cancelled'],
    datasets: [
        {
            data: [45, 25, 15, 10, 5],
            backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'],
            hoverBackgroundColor: ['#D97706', '#2563EB', '#7C3AED', '#059669', '#DC2626']
        }
    ]
});

const monthlyTrendChartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Back Orders',
            data: [45, 52, 48, 65, 72, 68, 75, 82, 78, 85, 92, 88],
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
        case 'Ready for Pickup': return 'success';
        case 'In Transit': return 'info';
        case 'Partially Fulfilled': return 'warning';
        case 'Pending Fulfillment': return 'secondary';
        case 'Cancelled': return 'danger';
        default: return 'info';
    }
};

const getPrioritySeverity = (priority) => {
    switch (priority) {
        case 'Critical': return 'danger';
        case 'High': return 'warning';
        case 'Medium': return 'info';
        case 'Low': return 'success';
        default: return 'secondary';
    }
};

const getWaitDaysClass = (waitDays) => {
    if (waitDays <= 3) return 'text-green-600';
    if (waitDays <= 7) return 'text-orange-600';
    if (waitDays <= 14) return 'text-yellow-600';
    return 'text-red-600';
};

const exportToCSV = () => {
    console.log('Exporting to CSV...');
    alert('CSV export functionality would be implemented here');
};

const printReport = () => {
    window.print();
};

const viewBackOrderDetails = (backOrder) => {
    console.log('Viewing back order details:', backOrder);
    alert(`Viewing details for back order: ${backOrder.backOrderId}`);
};

// Initialize
onMounted(() => {
    console.log('Report Back Order component mounted');
});
</script>