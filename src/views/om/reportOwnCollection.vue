<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Report Own Collection
                </div>

                <!-- Description -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <i class="pi pi-info-circle text-blue-500 text-lg mt-1 mr-3"></i>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">About Own Collection Report</div>
                            <div class="text-blue-700 text-sm">
                                Track and analyze customer self-collection performance, collection patterns, 
                                and operational efficiency across all collection points.
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

                        <!-- Collection Point -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Collection Point</label>
                            <Dropdown 
                                v-model="filters.collectionPoint" 
                                :options="collectionPointOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Points"
                                class="w-full"
                            />
                        </div>

                        <!-- Collection Status -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Collection Status</label>
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
                    </div>

                    <!-- Additional Filters -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

                        <!-- Time Slot -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Time Slot</label>
                            <Dropdown 
                                v-model="filters.timeSlot" 
                                :options="timeSlotOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Time Slots"
                                class="w-full"
                            />
                        </div>

                        <!-- Collection Type -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Collection Type</label>
                            <Dropdown 
                                v-model="filters.collectionType" 
                                :options="collectionTypeOptions" 
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

                <div class="card p-4 bg-white border rounded-lg shadow-sm">
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

                <div class="card p-4 bg-white border rounded-lg shadow-sm">
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

                <div class="card p-4 bg-white border rounded-lg shadow-sm">
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Collection Status Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Collection Status Distribution</div>
                    <Chart 
                        type="doughnut" 
                        :data="statusChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Daily Collection Trend -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Daily Collection Trend</div>
                    <Chart 
                        type="bar" 
                        :data="dailyTrendChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Collection Point Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Collection Point Distribution</div>
                    <Chart 
                        type="pie" 
                        :data="collectionPointChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>

                <!-- Time Slot Distribution -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Peak Collection Hours</div>
                    <Chart 
                        type="line" 
                        :data="timeSlotChartData" 
                        :options="chartOptions"
                        style="height: 300px"
                    />
                </div>
            </div>

            <!-- Collection Performance Metrics -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Collection Efficiency -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Collection Efficiency</div>
                    <div class="space-y-4">
                        <div v-for="metric in efficiencyMetrics" :key="metric.label" class="flex justify-between items-center">
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

                <!-- Top Collection Points -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Top Collection Points</div>
                    <div class="space-y-3">
                        <div v-for="point in topCollectionPoints" :key="point.name" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-map-marker text-gray-400"></i>
                                <span class="font-medium">{{ point.name }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">{{ point.collections }} collections</span>
                                <span class="font-bold text-purple-600">RM {{ point.value.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collection Issues Summary -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Collection Issues Summary</div>
                    <div class="space-y-3">
                        <div v-for="issue in collectionIssues" :key="issue.type" class="flex justify-between items-center p-2 border-b">
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

            <!-- Detailed Collections Table -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="flex justify-between items-center">
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

            <!-- Collection Analytics -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Customer Type Analysis -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Customer Type Analysis</div>
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

                        <Column field="collections" header="Collections" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-blue-600 font-bold">{{ data.collections.toLocaleString() }}</div>
                            </template>
                        </Column>

                        <Column field="percentage" header="Percentage" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-green-600 font-bold">{{ data.percentage }}%</div>
                            </template>
                        </Column>

                        <Column field="avgValue" header="Avg Value" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-purple-600 font-bold">RM {{ data.avgValue.toLocaleString() }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- Collection Time Analysis -->
                <div class="card p-4 bg-white border rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Collection Time Analysis</div>
                    <DataTable 
                        :value="timeAnalysis" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column field="timeSlot" header="Time Slot" style="min-width: 120px">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.timeSlot }}</div>
                            </template>
                        </Column>

                        <Column field="collections" header="Collections" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-blue-600 font-bold">{{ data.collections.toLocaleString() }}</div>
                            </template>
                        </Column>

                        <Column field="peakHour" header="Peak Hour" style="min-width: 100px">
                            <template #body="{ data }">
                                <Tag :value="data.peakHour" severity="warning" />
                            </template>
                        </Column>

                        <Column field="avgWaitTime" header="Avg Wait" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-orange-600 font-bold">{{ data.avgWaitTime }} mins</div>
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
    collectionPoint: null,
    status: null,
    customerType: null,
    region: null,
    timeSlot: null,
    collectionType: null
});

// Options for filters
const collectionPointOptions = ref([
    { label: 'All Points', value: null },
    { label: 'Main Warehouse', value: 'main_warehouse' },
    { label: 'Central Hub', value: 'central_hub' },
    { label: 'North Branch', value: 'north_branch' },
    { label: 'South Branch', value: 'south_branch' },
    { label: 'East Branch', value: 'east_branch' }
]);

const statusOptions = ref([
    { label: 'All Status', value: null },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Ready for Pickup', value: 'Ready for Pickup' },
    { label: 'Collected', value: 'Collected' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Overdue', value: 'Overdue' }
]);

const customerTypeOptions = ref([
    { label: 'All Types', value: null },
    { label: 'Retail Customer', value: 'retail' },
    { label: 'Dealer', value: 'dealer' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'VIP', value: 'vip' }
]);

const regionOptions = ref([
    'All Regions',
    'Central Region', 'Northern Region', 'Southern Region', 
    'East Coast', 'East Malaysia'
]);

const timeSlotOptions = ref([
    { label: 'All Time Slots', value: null },
    { label: 'Morning (8AM-12PM)', value: 'morning' },
    { label: 'Afternoon (12PM-4PM)', value: 'afternoon' },
    { label: 'Evening (4PM-8PM)', value: 'evening' }
]);

const collectionTypeOptions = ref([
    { label: 'All Types', value: null },
    { label: 'Standard Collection', value: 'standard' },
    { label: 'Express Collection', value: 'express' },
    { label: 'Bulk Collection', value: 'bulk' },
    { label: 'Scheduled Pickup', value: 'scheduled' }
]);

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

// Performance Metrics
const efficiencyMetrics = ref([
    { label: 'On-Time Collection', value: 92, color: 'text-green-600', colorClass: 'bg-green-500' },
    { label: 'Within 10 mins Wait', value: 78, color: 'text-blue-600', colorClass: 'bg-blue-500' },
    { label: 'Same Day Collection', value: 65, color: 'text-purple-600', colorClass: 'bg-purple-500' },
    { label: 'Collection Rate', value: 85, color: 'text-orange-600', colorClass: 'bg-orange-500' }
]);

// Top Collection Points
const topCollectionPoints = ref([
    { name: 'Main Warehouse', collections: 245, value: 1250000 },
    { name: 'Central Hub', collections: 189, value: 980000 },
    { name: 'North Branch', collections: 156, value: 875000 },
    { name: 'South Branch', collections: 132, value: 456000 },
    { name: 'East Branch', collections: 98, value: 389000 }
]);

// Collection Issues
const collectionIssues = ref([
    { type: 'Late Collections', count: 23, percentage: 2.7, color: 'text-orange-500' },
    { type: 'No Show', count: 18, percentage: 2.1, color: 'text-red-500' },
    { type: 'Wrong Items', count: 8, percentage: 0.9, color: 'text-yellow-500' },
    { type: 'Document Issues', count: 12, percentage: 1.4, color: 'text-blue-500' }
]);

// Customer Type Analysis
const customerTypeAnalysis = ref([
    { type: 'Retail Customer', collections: 456, percentage: 53.3, avgValue: 2850 },
    { type: 'Dealer', collections: 245, percentage: 28.6, avgValue: 12500 },
    { type: 'Corporate', collections: 123, percentage: 14.4, avgValue: 18700 },
    { type: 'VIP', collections: 32, percentage: 3.7, avgValue: 8900 }
]);

// Time Analysis
const timeAnalysis = ref([
    { timeSlot: 'Morning (8AM-12PM)', collections: 345, peakHour: '10AM', avgWaitTime: 6.2 },
    { timeSlot: 'Afternoon (12PM-4PM)', collections: 287, peakHour: '2PM', avgWaitTime: 8.7 },
    { timeSlot: 'Evening (4PM-8PM)', collections: 224, peakHour: '5PM', avgWaitTime: 11.3 }
]);

// Chart Data
const statusChartData = ref({
    labels: ['Collected', 'Ready for Pickup', 'Scheduled', 'Cancelled', 'Overdue'],
    datasets: [
        {
            data: [65, 15, 12, 5, 3],
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#6B7280', '#EF4444'],
            hoverBackgroundColor: ['#059669', '#2563EB', '#D97706', '#4B5563', '#DC2626']
        }
    ]
});

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

const collectionPointChartData = ref({
    labels: ['Main Warehouse', 'Central Hub', 'North Branch', 'South Branch', 'East Branch'],
    datasets: [
        {
            data: [35, 25, 18, 12, 10],
            backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6']
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

const clearFilters = () => {
    filters.dateRange = null;
    filters.collectionPoint = null;
    filters.status = null;
    filters.customerType = null;
    filters.region = null;
    filters.timeSlot = null;
    filters.collectionType = null;
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