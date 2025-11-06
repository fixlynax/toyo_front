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
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Customer Account -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <Dropdown
                                v-model="filters.customerAcc"
                                :options="customerOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Customer Account"
                                class="w-full"
                            />
                        </div>

                        <!-- Month -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Month</label>
                            <Dropdown
                                v-model="filters.month"
                                :options="monthOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Month"
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
                            label="Export Excel"
                            icon="pi pi-file-excel"
                            class="p-button-success"
                            @click="exportExcel"
                        />
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div class="card p-4 bg-white border rounded-lg">
                <div class="text-lg font-bold text-gray-800 mb-4">Shipment Data</div>
                <DataTable
                    v-if="shipmentData.length"
                    :value="shipmentData"
                    :paginator="true"
                    :rows="10"
                    responsiveLayout="scroll"
                >
                    <Column field="shipmentId" header="Shipment ID" style="min-width: 140px" />
                    <Column field="orderDate" header="Order Date" style="min-width: 120px" />
                    <Column field="customerName" header="Customer Name" style="min-width: 200px" />
                    <Column field="region" header="Region" style="min-width: 120px" />
                    <Column field="status" header="Status" style="min-width: 100px" />
                    <Column field="totalValue" header="Total Value (RM)" style="min-width: 130px" />
                    <template #empty>
                        <div class="text-center text-gray-500 py-4">
                            No data available for selected filters.
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive } from 'vue'


// ✅ Filters
const filters = reactive({
    customerAcc: null,
    month: null
})

// ✅ Dropdown Options
const customerOptions = [
    { label: 'PS Tyres & Battery Auto Services', value: 'PS001' },
    { label: 'Toyo Auto Centre UHP Tyres', value: 'TOYO002' },
    { label: 'Maxspeed Tyres Trading', value: 'MAX003' }
]

const monthOptions = [
    { label: 'January', value: 'Jan' },
    { label: 'February', value: 'Feb' },
    { label: 'March', value: 'Mar' },
    { label: 'April', value: 'Apr' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'Jun' },
    { label: 'July', value: 'Jul' },
    { label: 'August', value: 'Aug' },
    { label: 'September', value: 'Sep' },
    { label: 'October', value: 'Oct' },
    { label: 'November', value: 'Nov' },
    { label: 'December', value: 'Dec' }
]

// ✅ Sample Data
const shipmentData = ref([])

// ✅ Clear Filters
const clearFilters = () => {
    filters.customerAcc = null
    filters.month = null
    shipmentData.value = []
}

// ✅ Generate Report
const generateReport = () => {
    // Normally, fetch filtered data from API here
    shipmentData.value = [
        {
            shipmentId: 'DS-2024-001234',
            orderDate: '2024-01-15',
            customerName: 'PS Tyres & Battery Auto Services',
            region: 'Central',
            status: 'Delivered',
            totalValue: 24500
        },
        {
            shipmentId: 'DS-2024-001235',
            orderDate: '2024-01-18',
            customerName: 'PS Tyres & Battery Auto Services',
            region: 'Central',
            status: 'Shipped',
            totalValue: 18700
        }
    ]
}

// ✅ Export to Excel
const exportExcel = () => {
    if (!shipmentData.value.length) {
        alert('No data to export.')
        return
    }

    const exportData = shipmentData.value.map(item => ({
        'Shipment ID': item.shipmentId,
        'Order Date': item.orderDate,
        'Customer Name': item.customerName,
        'Region': item.region,
        'Status': item.status,
        'Total Value (RM)': item.totalValue
    }))

    const worksheet = utils.json_to_sheet(exportData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Direct Shipment Summary')

    const filename = `Direct_Shipment_Summary_${filters.month || 'All'}_${Date.now()}.xlsx`
    writeFileXLSX(workbook, filename)
}
</script>

<style scoped>
:deep(.p-dropdown) {
    width: 100%;
}
</style>
