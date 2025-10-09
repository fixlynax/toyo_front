<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Report Back Order
                </div>

                <!-- Description -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <i class="pi pi-info-circle text-blue-500 text-lg mt-1 mr-3"></i>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">About Back Order Report</div>
                            <div class="text-blue-700 text-sm">
                                Monitor and analyze back order performance, fulfillment rates, 
                                and inventory management across all products and regions.
                            </div>
                        </div>
                    </div>
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

                        <!-- Product Category -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Product Category</label>
                            <Dropdown 
                                v-model="filters.productCategory" 
                                :options="productCategoryOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Categories"
                                class="w-full"
                            />
                        </div>

                        <!-- Back Order Status -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Back Order Status</label>
                            <Dropdown 
                                v-model="filters.status" 
                                :options="statusOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Status"
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

                    <!-- Additional Filters -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <!-- Priority Level -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Priority Level</label>
                            <Dropdown 
                                v-model="filters.priority" 
                                :options="priorityOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Priorities"
                                class="w-full"
                            />
                        </div>

                        <!-- Supplier -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Supplier</label>
                            <Dropdown 
                                v-model="filters.supplier" 
                                :options="supplierOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Suppliers"
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
                            label="Export Report" 
                            icon="pi pi-download" 
                            class="p-button-success"
                            @click="exportReport" 
                        />
                    </div>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Total Back Orders</div>
                            <div class="text-2xl font-bold text-blue-600 mt-1">{{ summaryStats.totalBackOrders.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-shopping-cart text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2">
                        <i class="pi pi-arrow-up"></i> 8.3% from last period
                    </div>
                </div>

                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Fulfilled</div>
                            <div class="text-2xl font-bold text-green-600 mt-1">{{ summaryStats.fulfilledOrders.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        {{ summaryStats.fulfillmentRate }}% fulfillment rate
                    </div>
                </div>

                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Pending Value</div>
                            <div class="text-2xl font-bold text-orange-600 mt-1">RM {{ summaryStats.pendingValue.toLocaleString() }}</div>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-dollar text-orange-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2">
                        <i class="pi pi-arrow-up"></i> 12.5% from last period
                    </div>
                </div>

                <div class="card p-4 bg-white border rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-gray-600">Avg Wait Days</div>
                            <div class="text-2xl font-bold text-purple-600 mt-1">{{ summaryStats.avgWaitDays }} days</div>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="pi pi-clock text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="text-xs text-red-600 mt-2">
                        <i class="pi pi-arrow-up"></i> 2.1 days longer
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Back Order Status Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Back Order Status Distribution</div>
                    <Chart 
                        type="doughnut" 
                        :data="statusChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Monthly Back Order Trend -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Monthly Back Order Trend</div>
                    <Chart 
                        type="bar" 
                        :data="monthlyTrendChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Product Category Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Product Category Distribution</div>
                    <Chart 
                        type="pie" 
                        :data="productCategoryChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Fulfillment Rate by Region -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Fulfillment Rate by Region</div>
                    <Chart 
                        type="horizontalBar" 
                        :data="regionalFulfillmentChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>
            </div>

            <!-- Performance Metrics -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Fulfillment Performance -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Fulfillment Performance</div>
                    <div class="space-y-4">
                        <div v-for="metric in fulfillmentMetrics" :key="metric.label" class="flex justify-between items-center">
                            <span class="text-gray-700">{{ metric.label }}</span>
                            <div class="flex items-center gap-2">
                                <span class="font-bold" :class="metric.color">{{ metric.value }}%</span>
                                <div class="w-24 bg-gray-200 rounded-full h-2">
                                    <div class="h-2 rounded-full" :class="metric.colorClass" :style="{ width: metric.value + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Back Ordered Products -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Top Back Ordered Products</div>
                    <div class="space-y-3">
                        <div v-for="product in topBackOrderedProducts" :key="product.name" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-box text-gray-400"></i>
                                <span class="font-medium">{{ product.name }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">{{ product.backOrders }} orders</span>
                                <span class="font-bold text-orange-600">RM {{ product.value.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Supplier Performance -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Supplier Performance</div>
                    <div class="space-y-3">
                        <div v-for="supplier in supplierPerformance" :key="supplier.name" class="flex justify-between items-center p-2 border-b">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-truck text-gray-400"></i>
                                <span>{{ supplier.name }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-bold" :class="supplier.color">{{ supplier.fulfillmentRate }}%</span>
                                <span class="text-sm text-gray-500">{{ supplier.avgDelay }} days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Back Orders Table -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="flex justify-between items-center">
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

                    <Column field="estimatedArrival" header="Est. Arrival" style="min-width: 100px" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm" :class="data.estimatedArrival ? 'text-gray-800' : 'text-gray-400'">
                                {{ data.estimatedArrival ? formatDate(data.estimatedArrival) : 'TBD' }}
                            </div>
                        </template>
                    </Column>

                    <Column field="supplier" header="Supplier" style="min-width: 120px" :sortable="true">
                        <template #body="{ data }">
                            <div class="text-sm">
                                {{ data.supplier }}
                            </div>
                        </template>
                    </Column>

                    <Column header="Actions" style="min-width: 100px">
                        <template #body="{ data }">
                            <Button 
                                icon="pi pi-eye" 
                                class="p-button-info p-button-text p-button-sm" 
                                v-tooltip="'View Details'"
                                @click="viewBackOrderDetails(data)" 
                            />
                            <Button 
                                icon="pi pi-truck" 
                                class="p-button-success p-button-text p-button-sm ml-1" 
                                v-tooltip="'Update Status'"
                                @click="updateBackOrderStatus(data)" 
                            />
                        </template>
                    </Column>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <div>No back order data found.</div>
                            <div class="text-sm mt-1">Adjust your filters or generate a new report.</div>
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

            <!-- Back Order Analytics -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Customer Type Analysis -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Back Orders by Customer Type</div>
                    <DataTable 
                        :value="customerTypeAnalysis" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column field="type" header="Customer Type" style="min-width: 120px">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.type }}</div>
                            </template>
                        </Column>

                        <Column field="backOrders" header="Back Orders" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-blue-600 font-bold">{{ data.backOrders.toLocaleString() }}</div>
                            </template>
                        </Column>

                        <Column field="percentage" header="Percentage" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-green-600 font-bold">{{ data.percentage }}%</div>
                            </template>
                        </Column>

                        <Column field="avgWaitDays" header="Avg Wait Days" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-orange-600 font-bold">{{ data.avgWaitDays }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- Product Category Analysis -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Back Orders by Product Category</div>
                    <DataTable 
                        :value="productCategoryAnalysis" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column field="category" header="Category" style="min-width: 120px">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.category }}</div>
                            </template>
                        </Column>

                        <Column field="backOrders" header="Back Orders" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-blue-600 font-bold">{{ data.backOrders.toLocaleString() }}</div>
                            </template>
                        </Column>

                        <Column field="fulfillmentRate" header="Fulfillment Rate" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-green-600 font-bold">{{ data.fulfillmentRate }}%</div>
                            </template>
                        </Column>

                        <Column field="avgValue" header="Avg Value" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-purple-600 font-bold">RM {{ data.avgValue.toLocaleString() }}</div>
                            </template>
                        </Column>
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

// Filters
const filters = reactive({
    dateRange: null,
    productCategory: null,
    status: null,
    region: null,
    priority: null,
    supplier: null,
    customerType: null
});

// Options for filters
const productCategoryOptions = ref([
    { label: 'All Categories', value: null },
    { label: 'Passenger Tyres', value: 'passenger' },
    { label: 'SUV Tyres', value: 'suv' },
    { label: 'Commercial Tyres', value: 'commercial' },
    { label: 'Motorcycle Tyres', value: 'motorcycle' },
    { label: 'Accessories', value: 'accessories' }
]);

const statusOptions = ref([
    { label: 'All Status', value: null },
    { label: 'Pending Fulfillment', value: 'pending' },
    { label: 'In Transit', value: 'in_transit' },
    { label: 'Partially Fulfilled', value: 'partial' },
    { label: 'Ready for Pickup', value: 'ready' },
    { label: 'Cancelled', value: 'cancelled' }
]);

const regionOptions = ref([
    'All Regions',
    'Central Region', 'Northern Region', 'Southern Region', 
    'East Coast', 'East Malaysia', 'Sabah', 'Sarawak'
]);

const priorityOptions = ref([
    { label: 'All Priorities', value: null },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Critical', value: 'critical' }
]);

const supplierOptions = ref([
    { label: 'All Suppliers', value: null },
    { label: 'Toyo Tires Malaysia', value: 'toyo_malaysia' },
    { label: 'Bridgestone Corp', value: 'bridgestone' },
    { label: 'Michelin Asia', value: 'michelin' },
    { label: 'Goodyear Malaysia', value: 'goodyear' },
    { label: 'Continental Tires', value: 'continental' }
]);

const customerTypeOptions = ref([
    { label: 'All Types', value: null },
    { label: 'Dealer', value: 'dealer' },
    { label: 'Distributor', value: 'distributor' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'Retail', value: 'retail' }
]);

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

// Performance Metrics
const fulfillmentMetrics = ref([
    { label: 'On-Time Fulfillment', value: 65, color: 'text-green-600', colorClass: 'bg-green-500' },
    { label: 'Within 7 Days', value: 78, color: 'text-blue-600', colorClass: 'bg-blue-500' },
    { label: 'Within 14 Days', value: 92, color: 'text-purple-600', colorClass: 'bg-purple-500' },
    { label: 'Overdue Orders', value: 8, color: 'text-red-600', colorClass: 'bg-red-500' }
]);

// Top Back Ordered Products
const topBackOrderedProducts = ref([
    { name: 'Toyo Proxes 205/55R16', backOrders: 45, value: 337500 },
    { name: 'Bridgestone Dueler 265/65R17', backOrders: 38, value: 570000 },
    { name: 'Michelin Pilot Sport 4', backOrders: 32, value: 256000 },
    { name: 'Goodyear Wrangler AT', backOrders: 28, value: 364000 },
    { name: 'Continental ContiEco', backOrders: 25, value: 312500 }
]);

// Supplier Performance
const supplierPerformance = ref([
    { name: 'Toyo Tires Malaysia', fulfillmentRate: 85, avgDelay: 2.5, color: 'text-green-600' },
    { name: 'Bridgestone Corp', fulfillmentRate: 78, avgDelay: 3.2, color: 'text-blue-600' },
    { name: 'Michelin Asia', fulfillmentRate: 72, avgDelay: 4.1, color: 'text-orange-600' },
    { name: 'Goodyear Malaysia', fulfillmentRate: 65, avgDelay: 5.8, color: 'text-red-600' }
]);

// Customer Type Analysis
const customerTypeAnalysis = ref([
    { type: 'Dealer', backOrders: 156, percentage: 45.0, avgWaitDays: 6.8 },
    { type: 'Corporate', backOrders: 89, percentage: 25.6, avgWaitDays: 5.2 },
    { type: 'Distributor', backOrders: 67, percentage: 19.3, avgWaitDays: 8.4 },
    { type: 'Retail', backOrders: 35, percentage: 10.1, avgWaitDays: 9.1 }
]);

// Product Category Analysis
const productCategoryAnalysis = ref([
    { category: 'Passenger Tyres', backOrders: 145, fulfillmentRate: 68, avgValue: 7500 },
    { category: 'SUV Tyres', backOrders: 98, fulfillmentRate: 62, avgValue: 15000 },
    { category: 'Commercial Tyres', backOrders: 67, fulfillmentRate: 55, avgValue: 12500 },
    { category: 'Motorcycle Tyres', backOrders: 25, fulfillmentRate: 78, avgValue: 3200 },
    { category: 'Accessories', backOrders: 12, fulfillmentRate: 85, avgValue: 1800 }
]);

// Chart Data
const statusChartData = ref({
    labels: ['Pending Fulfillment', 'In Transit', 'Partially Fulfilled', 'Ready for Pickup', 'Cancelled'],
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

const productCategoryChartData = ref({
    labels: ['Passenger Tyres', 'SUV Tyres', 'Commercial Tyres', 'Motorcycle Tyres', 'Accessories'],
    datasets: [
        {
            data: [45, 25, 15, 10, 5],
            backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6']
        }
    ]
});

const regionalFulfillmentChartData = ref({
    labels: ['Central Region', 'Southern Region', 'Northern Region', 'East Coast', 'East Malaysia'],
    datasets: [
        {
            label: 'Fulfillment Rate (%)',
            data: [85, 78, 72, 65, 58],
            backgroundColor: '#10B981',
            borderColor: '#059669',
            borderWidth: 1
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

const clearFilters = () => {
    filters.dateRange = null;
    filters.productCategory = null;
    filters.status = null;
    filters.region = null;
    filters.priority = null;
    filters.supplier = null;
    filters.customerType = null;
};

const generateReport = () => {
    loading.value = true;
    // Simulate API call
    setTimeout(() => {
        loading.value = false;
        console.log('Report generated with filters:', filters);
    }, 1000);
};

const exportReport = () => {
    console.log('Exporting report...');
    alert('Report export functionality would be implemented here');
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

const updateBackOrderStatus = (backOrder) => {
    console.log('Updating back order status:', backOrder);
    alert(`Update status for back order: ${backOrder.backOrderId}`);
};

// Initialize
onMounted(() => {
    console.log('Report Back Order component mounted');
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