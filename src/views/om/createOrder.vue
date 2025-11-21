<template>
    <Fluid>
        <!-- Step 1: Customer & Order Type Selection -->
        <div v-if="currentStep === 1" class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Step 1: Select Customer & Order Type</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Account -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account *</label>
                    <Dropdown
                        filter
                        v-model="selectedCustomer"
                        :options="customerOptions"
                        optionLabel="display"
                        placeholder="Select a Customer"
                        class="w-full"
                        :loading="loadingCustomers"
                        @change="onCustomerChange"
                        :class="{ 'p-invalid': !selectedCustomer && step1Validated }"
                    />
                    <small v-if="loadingCustomers" class="text-blue-600">Loading customers...</small>
                    <small v-if="!selectedCustomer && step1Validated" class="p-error">Customer account is required.</small>
                    <small v-if="customerOptions.length === 0 && !loadingCustomers" class="text-gray-500">No customers available</small>
                </div>

                <!-- Order Type -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Order Type *</label>
                    <Dropdown
                        v-model="selectedOrderType"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Order Type"
                        class="w-full"
                        :class="{ 'p-invalid': !selectedOrderType && step1Validated }"
                        @change="onOrderTypeChange"
                    />
                    <small v-if="!selectedOrderType && step1Validated" class="p-error">Order type is required.</small>
                </div>

                <!-- Delivery Method -->
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Delivery Method *</label>
                    <Dropdown
                        v-model="selectedDeliveryMethod"
                        :options="deliveryMethodOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Delivery Method"
                        class="w-full"
                        :class="{ 'p-invalid': !selectedDeliveryMethod && step1Validated }"
                        @change="onDeliveryMethodChange"
                    />
                    <small v-if="!selectedDeliveryMethod && step1Validated" class="p-error">Delivery method is required.</small>
                </div>

                <!-- Driver Information for Pickup Methods -->
                <div v-if="selectedDeliveryMethod === 'SELFCOLLECT' || selectedDeliveryMethod === 'LALAMOVE'" class="md:col-span-2 border-t pt-4 mt-2">
                    <div class="font-bold text-gray-700 mb-4">Driver Information</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-semibold text-gray-600">Driver Name *</label>
                            <InputText v-model="driverInfo.name" placeholder="Enter driver name" class="w-full" :class="{ 'p-invalid': !driverInfo.name && step1Validated }" />
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-600">Phone Number *</label>
                            <InputText v-model="driverInfo.phone" placeholder="Enter phone number" class="w-full" :class="{ 'p-invalid': !driverInfo.phone && step1Validated }" />
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-600">Truck Plate No *</label>
                            <InputText v-model="driverInfo.plateNo" placeholder="Enter plate number" class="w-full" :class="{ 'p-invalid': !driverInfo.plateNo && step1Validated }" />
                        </div>
                        <div>
                            <label class="block font-semibold text-gray-600">IC Number *</label>
                            <InputText v-model="driverInfo.icNo" placeholder="Enter IC number" class="w-full" :class="{ 'p-invalid': !driverInfo.icNo && step1Validated }" />
                        </div>
                    </div>
                </div>

                <!-- Container Size for DIRECTSHIP -->
                <div v-if="selectedOrderType === 'DIRECTSHIP'" class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Container Size *</label>
                    <div class="flex bg-gray-200 rounded-full w-40 h-12 p-1">
                        <div
                            @click="selectedContainerSize = '20FT'"
                            :class="['flex-1 flex items-center justify-center rounded-full cursor-pointer font-semibold transition-all duration-300', selectedContainerSize === '20FT' ? 'bg-blue-500 text-white' : 'text-gray-700']"
                        >
                            20FT
                        </div>
                        <div
                            @click="selectedContainerSize = '40FT'"
                            :class="['flex-1 flex items-center justify-center rounded-full cursor-pointer font-semibold transition-all duration-300', selectedContainerSize === '40FT' ? 'bg-blue-500 text-white' : 'text-gray-700']"
                        >
                            40FT
                        </div>
                    </div>
                    <div class="text-sm text-gray-600 mt-2">Min: {{ minContainerCapacity }} units | Max: {{ maxContainerCapacity }} units</div>
                </div>
            </div>

            <div class="flex justify-end mt-4">
                <Button label="Next: Add Products" icon="pi pi-arrow-right" @click="goToStep(2)" :disabled="!canProceedToStep2" />
            </div>
        </div>

        <!-- Step 2: Product Selection -->
        <div v-if="currentStep === 2" class="card flex flex-col gap-6">
            <div class="flex items-center justify-between border-b pb-2">
                <div class="flex flex-col gap-1">
                    <h2 class="text-xl font-bold text-gray-800">Step 2: Select Products</h2>

                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div>
                            <span class="text-gray-500">Order Type: </span>
                            <span class="font-semibold text-gray-800">{{ selectedOrderType }}</span>
                        </div>

                        <span class="text-gray-400">•</span>

                        <div>
                            <span class="text-gray-500">Customer: </span>
                            <span class="font-semibold text-gray-800">{{ selectedCustomer?.display }}</span>
                        </div>

                        <span class="text-gray-400">•</span>

                        <div>
                            <span class="text-gray-500">Available Limit: </span>
                            <span class="font-semibold" :class="creditLimitClass"> RM {{ availableCredit?.toLocaleString() }} </span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <Button label="Pattern" icon="pi pi-filter" @click="patternPanel.toggle($event)" />
                    <Button label="Size" icon="pi pi-filter" @click="sizePanel.toggle($event)" />
                    <Button label="Width" icon="pi pi-filter" @click="widthPanel.toggle($event)" />
                    <!-- Excel Import/Export for DIRECTSHIP -->
                    <Button v-if="selectedOrderType === 'DIRECTSHIP'" label="Import Excel" icon="pi pi-upload" class="p-button-success" @click="importExcel" />
                    <Button v-if="selectedOrderType === 'DIRECTSHIP' && selectedTyres.length > 0" label="Export Excel" icon="pi pi-download" class="p-button-help" @click="exportExcel" />
                </div>
            </div>

            <!-- Global Search -->
            <div class="flex items-center gap-3 w-full">
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-3 flex items-center text-gray-500"></span>
                    <InputText v-model="globalFilter" placeholder="Search all columns..." class="w-full pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400" />
                </div>

                <Button icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" v-tooltip.top="'Clear filters'" />
            </div>

            <!-- DIRECTSHIP Progress Section -->
            <div v-if="selectedOrderType === 'DIRECTSHIP'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="font-semibold text-blue-800">Direct Shipment Progress</div>
                    <div class="text-sm font-semibold">Container: {{ selectedContainerSize }}</div>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="block font-semibold text-gray-700 text-sm">Container Filling Progress</label>
                        <ProgressBar :value="progressValue" class="mt-1 h-3 rounded-full" showValue="false" />
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{{ progressValue }}% filled</span>
                            <!-- <span>Volume: {{ containerCapacity }} units (Min: {{ minContainerCapacity }} | Max: {{ maxContainerCapacity }})</span> -->
                            <span>Volume: {{ containerCapacity }} units (Min: {{ minContainerCapacity }})</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-3 text-center">
                        <div class="bg-white p-2 rounded border">
                            <div class="text-xs text-gray-500">Total Value</div>
                            <div class="text-sm font-bold">RM {{ cartTotal.toFixed(2) }}</div>
                        </div>
                        <div class="bg-white p-2 rounded border">
                            <div class="text-xs text-gray-500">Total Items</div>
                            <div class="text-sm font-bold">{{ selectedTyres.length + freeItems.length }}</div>
                        </div>
                        <div class="bg-white p-2 rounded border">
                            <div class="text-xs text-gray-500">Total Volume</div>
                            <div class="text-sm font-bold">{{ containerCapacity }}</div>
                        </div>
                        <div class="bg-white p-2 rounded border">
                            <div class="text-xs text-gray-500">Free Items</div>
                            <div class="text-sm font-bold text-green-600">{{ freeItemsCount }}</div>
                        </div>
                    </div>
                </div>

                <!-- DIRECTSHIP Cart Reference -->
                <div v-if="currentCartRefNo" class="mt-3 p-3 bg-white border border-blue-300 rounded">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-semibold text-blue-800 text-sm">Cart Reference: {{ currentCartRefNo }}</div>
                            <div class="text-xs text-blue-600">Direct Shipment cart is ready</div>
                        </div>
                        <Button label="Reset Cart" icon="pi pi-refresh" class="p-button-outlined p-button-sm p-button-warning" @click="resetDirectShipCart" :disabled="processingOrder" />
                    </div>
                </div>
            </div>

            <!-- Sales Program Free Items -->
            <div v-if="freeItems.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="font-semibold text-green-800 mb-2">🎁 Free Items from Sales Program</div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="freeItem in freeItems" :key="freeItem.materialid" class="bg-white p-3 rounded border border-green-300">
                        <div class="font-medium text-green-700">{{ freeItem.material }}</div>
                        <div class="text-sm text-gray-600">Qty: {{ freeItem.qty }} | Category: {{ freeItem.itemcategory }}</div>
                    </div>
                </div>
            </div>

            <DataTable
                :value="filteredTyres"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                class="rounded-table"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
                :globalFilterFields="['materialid', 'material', 'pattern', 'pattern_name', 'size', 'sectionwidth', 'origin']"
            >
                <template #empty>
                    <div class="text-center p-4">
                        <div v-if="loading">Loading products...</div>
                        <div v-else-if="!selectedCustomer">Please select a customer first</div>
                        <div v-else>No products found for this customer.</div>
                    </div>
                </template>
                <template #loading>
                    <div class="text-center p-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <div>Loading products. Please wait...</div>
                    </div>
                </template>

                <Column field="materialid" header="Material ID" style="min-width: 6rem" :sortable="true" />

                <Column field="material" header="Material Description" style="min-width: 14rem" :sortable="true">
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <div class="font-semibold">{{ data.material }}</div>
                            <div class="text-xs text-gray-500">
                                {{ data.pattern }}
                                <span v-if="data.pattern_name">| {{ data.pattern_name }}</span>
                                | {{ data.origin }}
                                <span v-if="data.DOM">| DOM: {{ data.DOM }}</span>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="price" header="Price (RM)" style="min-width: 8rem" :sortable="true">
                    <template #body="{ data }">
                        <div class="font-bold text-blue-700">
                            {{ data.price ? data.price.toFixed(2) : '0.00' }}
                        </div>
                    </template>
                </Column>

                <Column field="stockBalance" header="Stock" style="min-width: 8rem" :sortable="true">
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <span
                                :class="{
                                    'text-green-600 font-bold': data.stockBalance > 10,
                                    'text-orange-600 font-semibold': data.stockBalance > 0 && data.stockBalance <= 10,
                                    'text-red-600': data.stockBalance === 0
                                }"
                            >
                                {{ data.stockBalance || 0 }}
                            </span>
                            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: data.color_code }" :title="data.stockLevel"></div>
                        </div>
                    </template>
                </Column>

                <Column header="Action" style="width: 10rem">
                    <template #body="{ data }">
                        <Button
                            label="Add"
                            icon="pi pi-shopping-cart"
                            class="p-button-primary p-button-sm"
                            @click="addToCart(data)"
                            :disabled="isInCart(data) || data.stockBalance === 0 || (selectedOrderType === 'DIRECTSHIP' && containerCapacity >= maxContainerCapacity)"
                        />
                    </template>
                </Column>
            </DataTable>

            <!-- Cart Summary -->
            <div v-if="selectedTyres.length > 0 || freeItems.length > 0" class="bg-white border rounded-xl shadow-md p-6 mt-6">
                <!-- Header -->
                <div class="flex items-center justify-between mb-5">
                    <div class="text-xl font-bold text-gray-900">🛒 Selected Products</div>
                    <div class="text-2xl font-extrabold text-indigo-700">Total: RM {{ cartTotal.toFixed(2) }}</div>
                </div>

                <!-- Regular Items -->
                <div v-if="selectedTyres.length > 0">
                    <div class="font-semibold text-lg mb-3 text-gray-700">Regular Items</div>
                    <DataTable :value="selectedTyres" class="rounded-table" scrollable scrollHeight="250px" stripedRows>
                        <Column header="Product" style="min-width: 14rem">
                            <template #body="{ data }">
                                <div class="font-semibold text-gray-800">{{ data.material }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ data.pattern }}
                                    <span v-if="data.pattern_name">| {{ data.pattern_name }}</span>
                                    | Stock: {{ data.stockBalance }}
                                    <span v-if="data.volume">| Vol: {{ data.volume }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column header="Price" field="price" style="min-width: 7rem; text-align: center">
                            <template #body="{ data }">
                                <div class="font-medium">RM {{ data.price.toFixed(2) }}</div>
                            </template>
                        </Column>

                        <Column header="Qty" style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <InputNumber
                                    v-model="data.quantity"
                                    :min="1"
                                    :max="getMaxQuantity(data)"
                                    :showButtons="true"
                                    buttonLayout="horizontal"
                                    incrementButtonClass="p-button-text p-button-sm"
                                    decrementButtonClass="p-button-text p-button-sm"
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                    class="w-20 mx-auto"
                                    @update:modelValue="onQuantityChange(data)"
                                />
                            </template>
                        </Column>

                        <Column header="Subtotal" style="min-width: 8rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-bold text-gray-900"> RM {{ (data.price * data.quantity).toFixed(2) }} </span>
                            </template>
                        </Column>

                        <Column header="Action" style="min-width: 5rem; text-align: center">
                            <template #body="{ data }">
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeFromCart(data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- Free Items -->
                <div v-if="freeItems.length > 0" class="mt-6">
                    <div class="font-semibold text-lg mb-3 text-green-700">🎁 Free Items (Sales Program)</div>
                    <DataTable :value="freeItems" class="rounded-table" scrollable scrollHeight="200px">
                        <Column header="Product" style="min-width: 14rem">
                            <template #body="{ data }">
                                <div class="font-semibold text-green-800">{{ data.material }}</div>
                                <div class="text-xs text-gray-500">Free Item</div>
                            </template>
                        </Column>

                        <Column header="Category" field="itemcategory" style="min-width: 8rem; text-align: center" />

                        <Column header="Qty" style="min-width: 6rem; text-align: center">
                            <template #body="{ data }">
                                <span class="font-bold text-green-600">{{ data.qty }}</span>
                            </template>
                        </Column>

                        <Column header="Price" style="min-width: 7rem; text-align: center">
                            <template #body="{ data }">
                                <div class="font-medium text-green-600">FREE</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- Cart Summary -->
                <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div class="text-sm text-gray-500">Regular Items</div>
                            <div class="text-lg font-bold">{{ selectedTyres.length }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500">Free Items</div>
                            <div class="text-lg font-bold text-green-600">{{ freeItemsCount }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500">Total Quantity</div>
                            <div class="text-lg font-bold">{{ cartQuantity + freeItemsQuantity }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500">Total Amount</div>
                            <div class="text-lg font-bold text-blue-600">RM {{ cartTotal.toFixed(2) }}</div>
                        </div>
                    </div>
                    <div v-if="selectedOrderType === 'DIRECTSHIP'" class="mt-3 pt-3 border-t text-center">
                        <div class="text-sm text-gray-500">Total Container Volume</div>
                        <div class="text-lg font-bold text-purple-600">{{ containerCapacity }} units</div>
                        <div class="text-xs text-gray-500 mt-1">(Min: {{ minContainerCapacity }} | Max: {{ maxContainerCapacity }})</div>
                    </div>
                </div>
            </div>

            <div class="flex justify-between mt-4">
                <Button label="Back" icon="pi pi-arrow-left" class="p-button-secondary" @click="goToStep(1)" />
                <Button label="Next: Review Order" icon="pi pi-arrow-right" @click="goToStep(3)" :disabled="!canProceedToStep3" />
            </div>

            <!-- Overlay Panels -->
            <OverlayPanel ref="patternPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Pattern</label>
                    <Dropdown
                        v-model="filters['pattern'].value"
                        :options="patternOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select pattern"
                        filter
                        showClear
                        class="w-full"
                        @change="onColumnFilter('pattern', filters['pattern'].value)"
                    />
                </div>
            </OverlayPanel>

            <OverlayPanel ref="sizePanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Size</label>
                    <Dropdown v-model="filters['size'].value" :options="sizeOptions" optionLabel="label" optionValue="value" placeholder="Select size" filter showClear class="w-full" @change="onColumnFilter('size', filters['size'].value)" />
                </div>
            </OverlayPanel>

            <OverlayPanel ref="widthPanel" :dismissable="true">
                <div class="p-2 flex flex-col gap-2">
                    <label class="font-semibold">Filter by Width</label>
                    <Dropdown
                        v-model="filters['sectionwidth'].value"
                        :options="widthOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select width"
                        filter
                        showClear
                        class="w-full"
                        @change="onColumnFilter('sectionwidth', filters['sectionwidth'].value)"
                    />
                </div>
            </OverlayPanel>
        </div>

        <!-- Step 3: Order Review & Confirmation -->
        <div v-if="currentStep === 3" class="card">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Step 3: Review & Confirm Order</div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column: Shipping Details -->
                <div>
                    <div class="font-bold text-lg text-gray-700 mb-4">Shipping Details</div>

                    <div class="grid grid-cols-1 gap-4 mb-6">
                        <div>
                            <label class="block font-bold text-gray-700">Ship To Account No. *</label>
                            <Dropdown
                                v-model="shipToAccount"
                                :options="shipToOptions"
                                optionLabel="display"
                                placeholder="Select Ship To Account"
                                class="w-full"
                                :loading="loadingShipTo"
                                :class="{ 'p-invalid': !shipToAccount && step3Validated }"
                                @change="onShipToAccountChange"
                            />
                            <small v-if="loadingShipTo" class="text-blue-600">Loading ship-to addresses...</small>
                            <small v-if="!shipToAccount && step3Validated" class="p-error">Ship to account is required.</small>
                            <small v-if="shipToOptions.length === 0 && !loadingShipTo && selectedCustomer" class="text-gray-500">No ship-to addresses found for this customer</small>
                        </div>

                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="font-semibold text-gray-700 mb-2">Selected Address:</div>
                            <div class="text-sm text-gray-600">
                                <div>{{ shipToAddress1 }}</div>
                                <div v-if="shipToAddress2">{{ shipToAddress2 }}</div>
                                <div v-if="shipToAddress3">{{ shipToAddress3 }}</div>
                                <div v-if="shipToAddress4">{{ shipToAddress4 }}</div>
                                <div>{{ shipToPostcode }} {{ shipToCity }}, {{ shipToState }}</div>
                                <div>{{ shipToCountry }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Driver Information Review -->
                    <div v-if="selectedDeliveryMethod === 'SELFCOLLECT' || selectedDeliveryMethod === 'LALAMOVE'" class="border-t pt-4">
                        <div class="font-bold text-lg text-gray-700 mb-4">Driver Information</div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div class="font-semibold text-gray-600">Name</div>
                                    <div>{{ driverInfo.name }}</div>
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-600">Phone</div>
                                    <div>{{ driverInfo.phone }}</div>
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-600">Plate No</div>
                                    <div>{{ driverInfo.plateNo }}</div>
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-600">IC Number</div>
                                    <div>{{ driverInfo.icNo }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Order Summary -->
                <div>
                    <div class="font-bold text-lg text-gray-700 mb-4">Order Summary</div>

                    <div class="bg-white border rounded-lg shadow-sm">
                        <!-- Order Details -->
                        <div class="p-4 border-b">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Customer:</span>
                                    <span class="font-semibold">{{ selectedCustomer?.display }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Order Type:</span>
                                    <span class="font-semibold">{{ selectedOrderType }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Delivery Method:</span>
                                    <span class="font-semibold">{{ deliveryMethodLabel }}</span>
                                </div>
                                <div v-if="selectedOrderType === 'DIRECTSHIP'" class="flex justify-between">
                                    <span class="text-gray-600">Container Size:</span>
                                    <span class="font-semibold">{{ selectedContainerSize }}</span>
                                </div>
                                <div v-if="selectedOrderType === 'DIRECTSHIP'" class="flex justify-between">
                                    <span class="text-gray-600">Container Volume:</span>
                                    <span class="font-semibold">{{ containerCapacity }} units</span>
                                </div>
                            </div>
                        </div>

                        <!-- Items Summary -->
                        <div class="p-4 border-b">
                            <div class="font-semibold text-gray-700 mb-3">Items Summary</div>
                            <div class="space-y-3">
                                <!-- Regular Items -->
                                <div v-for="item in selectedTyres" :key="item.id" class="flex justify-between items-center">
                                    <div class="flex-1">
                                        <div class="font-medium text-sm">{{ item.material }}</div>
                                        <div class="text-xs text-gray-500">Qty: {{ item.quantity }} × RM {{ item.price.toFixed(2) }}</div>
                                    </div>
                                    <div class="font-semibold">RM {{ (item.price * item.quantity).toFixed(2) }}</div>
                                </div>

                                <!-- Free Items -->
                                <div v-for="freeItem in freeItems" :key="freeItem.materialid" class="flex justify-between items-center border-t pt-2">
                                    <div class="flex-1">
                                        <div class="font-medium text-sm text-green-700">{{ freeItem.material }}</div>
                                        <div class="text-xs text-gray-500">Free Item × {{ freeItem.qty }}</div>
                                    </div>
                                    <div class="font-semibold text-green-600">FREE</div>
                                </div>
                            </div>
                        </div>

                        <!-- Totals -->
                        <div class="p-4">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>Regular Items:</span>
                                    <span>{{ selectedTyres.length }} items</span>
                                </div>
                                <div v-if="freeItems.length > 0" class="flex justify-between">
                                    <span>Free Items:</span>
                                    <span class="text-green-600">{{ freeItemsCount }} items</span>
                                </div>
                                <div class="flex justify-between border-t pt-2">
                                    <span class="font-semibold">Total Quantity:</span>
                                    <span class="font-semibold">{{ cartQuantity + freeItemsQuantity }}</span>
                                </div>
                                <div class="flex justify-between border-t pt-2">
                                    <span class="font-bold text-lg">Total Amount:</span>
                                    <span class="font-bold text-lg text-blue-600">RM {{ cartTotal.toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Credit Limit Check -->
                    <div class="mt-4 p-4 rounded-lg" :class="creditLimitClass + ' bg-opacity-10'">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold">Available Credit:</span>
                            <span class="font-bold">RM {{ availableCredit?.toLocaleString() }}</span>
                        </div>
                        <ProgressBar :value="creditUsagePercent" :class="creditLimitClass.replace('bg-', '')" class="mt-2 h-2" showValue="false" />
                        <div class="text-xs text-gray-600 mt-1 text-right">{{ creditUsagePercent }}% used</div>
                    </div>
                </div>
            </div>

            <div class="flex justify-between mt-8">
                <Button label="Back" icon="pi pi-arrow-left" class="p-button-secondary" @click="goToStep(2)" />
                <Button label="Place Order" icon="pi pi-check" class="p-button-success" @click="placeOrder" :disabled="!canPlaceOrder || processingOrder" :loading="processingOrder" />
            </div>
        </div>

        <!-- Order Processing Dialog -->
        <Dialog v-model:visible="showOrderDialog" :style="{ width: '500px' }" header="Order Processing" :modal="true" :closable="false">
            <div class="flex flex-col items-center gap-4">
                <ProgressSpinner v-if="orderStatus === 'processing'" style="width: 50px; height: 50px" strokeWidth="4" />
                <i v-else-if="orderStatus === 'success'" class="pi pi-check-circle text-green-500 text-5xl"></i>
                <i v-else-if="orderStatus === 'error'" class="pi pi-times-circle text-red-500 text-5xl"></i>

                <div class="text-center">
                    <div class="font-bold text-lg mb-2">{{ orderMessage }}</div>
                    <div v-if="orderStatus === 'processing'" class="text-gray-600">Please wait while we process your order...</div>
                    <div v-if="orderDetails" class="text-sm text-gray-600 mt-2">
                        <div v-if="orderDetails.orderRefNo">Order Number: {{ orderDetails.orderRefNo }}</div>
                        <div v-if="orderDetails.backOrderRefNo">Back Order Number: {{ orderDetails.backOrderRefNo }}</div>
                        <div v-if="orderDetails.cartRefNo">Cart Reference: {{ orderDetails.cartRefNo }}</div>
                    </div>
                    <div v-if="orderError" class="text-sm text-red-600 mt-2">
                        {{ orderError }}
                    </div>
                </div>
            </div>
            <template #footer>
                <Button v-if="orderStatus === 'success'" label="View Order" icon="pi pi-eye" @click="viewOrderDetails" class="p-button-primary mr-2" />
                <Button v-if="orderStatus === 'success' || orderStatus === 'error'" label="Close" icon="pi pi-check" @click="closeOrderDialog" class="p-button-primary" />
            </template>
        </Dialog>

        <!-- Back Order Confirmation Dialog -->
        <Dialog v-model:visible="showBackOrderDialog" :style="{ width: '600px' }" header="Back Order Required" :modal="true">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-yellow-500 text-2xl"></i>
                    <div>
                        <div class="font-bold text-lg">Some items cannot be fully fulfilled</div>
                        <div class="text-gray-600">SAP has accepted partial quantities for some items.</div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="font-semibold mb-2">Unfulfilled Items:</div>
                    <div v-for="item in unfulfilledItems" :key="item.materialid" class="flex justify-between items-center py-2 border-b">
                        <div>
                            <div class="font-medium">{{ item.materialid }}</div>
                            <div class="text-sm text-gray-600">Requested: {{ item.requested_qty }}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-green-600 font-semibold">Accepted: {{ item.accepted_qty }}</div>
                            <div class="text-orange-600">Back Order: {{ item.backorder_qty }}</div>
                        </div>
                    </div>
                </div>

                <div class="text-sm text-gray-600">Would you like to create a back order for the unfulfilled quantities?</div>
            </div>
            <template #footer>
                <Button label="Create Back Order" icon="pi pi-shopping-cart" @click="proceedWithBackOrder" class="p-button-warning" />
                <Button label="Proceed Without Back Order" icon="pi pi-check" @click="proceedWithoutBackOrder" class="p-button-primary" />
            </template>
        </Dialog>

        <!-- File Upload Dialog -->
        <Dialog v-model:visible="showUploadDialog" :style="{ width: '500px' }" header="Import Excel File" :modal="true">
            <div class="flex flex-col gap-4">
                <div class="text-gray-600">Upload Excel file for Direct Shipment order. The file should contain Material and Quantity columns.</div>

                <FileUpload mode="basic" name="order_excel" :url="uploadUrl" accept=".xlsx,.xls,.csv" :maxFileSize="1000000" chooseLabel="Select Excel File" @upload="onExcelUpload" @select="onFileSelect" />

                <div v-if="uploadMessage" class="p-3 rounded" :class="uploadMessageClass">
                    {{ uploadMessage }}
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="showUploadDialog = false" class="p-button-text" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

// Step Management
const currentStep = ref(1);
const step1Validated = ref(false);
const step3Validated = ref(false);

// Form Data
const selectedCustomer = ref(null);
const selectedOrderType = ref('NORMAL');
const selectedDeliveryMethod = ref('DELIVER');
const selectedContainerSize = ref('20FT');

// Driver Information
const driverInfo = ref({
    name: '',
    phone: '',
    plateNo: '',
    icNo: ''
});

// Ship To Details
const shipToAccount = ref(null);
const shipToAddress1 = ref('');
const shipToAddress2 = ref('');
const shipToAddress3 = ref('');
const shipToAddress4 = ref('');
const shipToCity = ref('');
const shipToState = ref('');
const shipToPostcode = ref('');
const shipToCountry = ref('');

// Order Processing
const processingOrder = ref(false);
const showOrderDialog = ref(false);
const showBackOrderDialog = ref(false);
const showUploadDialog = ref(false);
const orderStatus = ref('');
const orderMessage = ref('');
const orderDetails = ref(null);
const orderError = ref('');
const currentCartRefNo = ref('');
const unfulfilledItems = ref([]);
const availableCredit = ref(0);

// Options
const customerOptions = ref([]);
const orderTypeOptions = ref([
    { label: 'Normal', value: 'NORMAL' },
    { label: 'Direct Shipment', value: 'DIRECTSHIP' }
]);
const deliveryMethodOptions = ref([
    { label: 'Delivery', value: 'DELIVER' },
    { label: 'Pickup - Own Collection', value: 'SELFCOLLECT' },
    { label: 'Pickup - Lalamove', value: 'LALAMOVE' }
]);
const shipToOptions = ref([]);

// Loading states
const loading = ref(false);
const loadingCustomers = ref(false);
const loadingShipTo = ref(false);

// Tyre data
const tyres = ref([]);
const freeItems = ref([]);

// Filters
const globalFilter = ref('');
const filters = ref({
    pattern: { value: '', matchMode: 'contains' },
    size: { value: '', matchMode: 'contains' },
    sectionwidth: { value: '', matchMode: 'contains' }
});

// Cart
const selectedTyres = ref([]);

// Overlay panels
const patternPanel = ref(null);
const sizePanel = ref(null);
const widthPanel = ref(null);

// File Upload
const uploadUrl = ref('');
const uploadMessage = ref('');
const uploadMessageClass = ref('');

// Computed Properties
const cartTotal = computed(() => selectedTyres.value.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0));

const cartQuantity = computed(() => selectedTyres.value.reduce((sum, item) => sum + (item.quantity || 1), 0));

const freeItemsCount = computed(() => freeItems.value.reduce((sum, item) => sum + (item.qty || 0), 0));

const freeItemsQuantity = computed(() => freeItems.value.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0));

const containerCapacity = computed(() => {
    if (selectedOrderType.value !== 'DIRECTSHIP') return 0;

    let totalVolume = 0;

    // Calculate volume for regular items
    selectedTyres.value.forEach((item) => {
        totalVolume += (item.quantity || 1) * (item.volume || 0);
    });

    // Calculate volume for free items
    freeItems.value.forEach((item) => {
        const freeItem = tyres.value.find((t) => t.materialid === item.materialid);
        if (freeItem) {
            totalVolume += (item.qty || 0) * (freeItem.volume || 0);
        }
    });

    return Math.round(totalVolume);
});

const minContainerCapacity = computed(() => (selectedContainerSize.value === '20FT' ? 1 : 500));

const maxContainerCapacity = computed(() => (selectedContainerSize.value === '20FT' ? 1 : 1000));

const progressValue = computed(() => {
    if (!selectedContainerSize.value || containerCapacity.value === 0) return 0;
    const progress = Math.min((containerCapacity.value / maxContainerCapacity.value) * 100, 100);
    return Math.round(progress);
});

const canProceedToStep2 = computed(() => {
    const basicChecks = selectedCustomer.value && selectedOrderType.value && selectedDeliveryMethod.value;

    if (selectedDeliveryMethod.value === 'SELFCOLLECT' || selectedDeliveryMethod.value === 'LALAMOVE') {
        return basicChecks && driverInfo.value.name && driverInfo.value.phone && driverInfo.value.plateNo && driverInfo.value.icNo;
    }

    return basicChecks;
});

const canProceedToStep3 = computed(() => {
    const hasItems = selectedTyres.value.length > 0;
    const stockValid = !selectedTyres.value.some((item) => item.quantity > item.stockBalance);
    const priceValid = !selectedTyres.value.some((item) => !item.price || item.price <= 0);

    // For DIRECTSHIP, also check container capacity
    let containerValid = true;
    if (selectedOrderType.value === 'DIRECTSHIP') {
        containerValid = containerCapacity.value >= minContainerCapacity.value && containerCapacity.value <= maxContainerCapacity.value;
    }

    return hasItems && stockValid && priceValid && containerValid;
});

const canPlaceOrder = computed(() => {
    return canProceedToStep3.value && shipToAccount.value;
});

const deliveryMethodLabel = computed(() => {
    const method = deliveryMethodOptions.value.find((m) => m.value === selectedDeliveryMethod.value);
    return method ? method.label : '';
});

const creditUsagePercent = computed(() => {
    if (!availableCredit.value || availableCredit.value === 0) return 0;
    return Math.min(Math.round((cartTotal.value / availableCredit.value) * 100), 100);
});

const creditLimitClass = computed(() => {
    if (creditUsagePercent.value >= 90) return 'text-red-700';
    if (creditUsagePercent.value >= 75) return 'text-orange-700';
    return 'text-green-700';
});

// Dropdown options
const patternOptions = computed(() => {
    const patterns = uniqueSorted(tyres.value.map((t) => t.pattern).filter(Boolean));
    return patterns.map((v) => ({ label: v, value: v }));
});

const sizeOptions = computed(() => {
    const sizes = uniqueSorted(tyres.value.map((t) => t.size).filter(Boolean));
    return sizes.map((v) => ({ label: v, value: v }));
});

const widthOptions = computed(() => {
    const widths = uniqueSorted(tyres.value.map((t) => t.sectionwidth?.toString()).filter(Boolean));
    return widths.map((v) => ({ label: v, value: v }));
});

const filteredTyres = computed(() => {
    let filtered = tyres.value;

    // Apply column filters
    if (filters.value.pattern.value) {
        filtered = filtered.filter((t) => t.pattern === filters.value.pattern.value);
    }
    if (filters.value.size.value) {
        filtered = filtered.filter((t) => t.size === filters.value.size.value);
    }
    if (filters.value.sectionwidth.value) {
        filtered = filtered.filter((t) => t.sectionwidth?.toString() === filters.value.sectionwidth.value);
    }

    // Apply global filter
    if (globalFilter.value) {
        const searchTerm = globalFilter.value.toLowerCase();
        filtered = filtered.filter(
            (t) =>
                (t.materialid && t.materialid.toLowerCase().includes(searchTerm)) ||
                (t.material && t.material.toLowerCase().includes(searchTerm)) ||
                (t.pattern && t.pattern.toLowerCase().includes(searchTerm)) ||
                (t.pattern_name && t.pattern_name.toLowerCase().includes(searchTerm)) ||
                (t.size && t.size.toLowerCase().includes(searchTerm)) ||
                (t.sectionwidth && t.sectionwidth.toString().toLowerCase().includes(searchTerm)) ||
                (t.origin && t.origin.toLowerCase().includes(searchTerm))
        );
    }

    return filtered;
});

// Step Navigation
const goToStep = async (step) => {
    if (step === 2 && !canProceedToStep2.value) {
        step1Validated.value = true;
        return;
    }

    if (step === 3 && !canProceedToStep3.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please add products to cart before proceeding', life: 3000 });
        return;
    }

    // For DIRECTSHIP, ensure cart is created before proceeding to step 3
    if (step === 3 && selectedOrderType.value === 'DIRECTSHIP' && !currentCartRefNo.value) {
        try {
            await createDirectShipCart();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create cart. Please try again.', life: 3000 });
            return;
        }
    }

    currentStep.value = step;
    step1Validated.value = false;
    step3Validated.value = false;
};

// Helper function for unique sorted values
const uniqueSorted = (arr) => [...new Set(arr)].sort((a, b) => (a > b ? 1 : -1));

// Helper function to get maximum quantity based on stock
const getMaxQuantity = (tyre) => {
    return Math.min(tyre.stockBalance || 0, 999);
};

// API Calls
const fetchCustomers = async () => {
    loadingCustomers.value = true;
    try {
        console.log('Fetching customers...');
        const response = await api.post('list_dealer', {
            mainBranch: 0
        });

        console.log('Customers API Response:', response.data);

        if (response.data.status === 1) {
            const dealers = response.data.admin_data;
            console.log('Dealers data:', dealers);

            if (dealers && typeof dealers === 'object') {
                customerOptions.value = Object.keys(dealers).map((custAccountNo) => {
                    const shop = dealers[custAccountNo].shop;
                    console.log(`Processing customer ${custAccountNo}:`, shop);

                    return {
                        name: shop.custAccountName || 'Unknown',
                        code: custAccountNo,
                        display: `${[shop.companyName1, shop.companyName2, shop.companyName3, shop.companyName4].filter(Boolean).join(', ') || 'Unknown'} (${custAccountNo})`,
                        shopData: shop
                    };
                });
            } else {
                console.warn('No dealers data found in response');
                customerOptions.value = [];
            }

            console.log('Final customer options:', customerOptions.value);
        } else {
            console.error('Customers API returned status 0:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customers', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching customers:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customers', life: 3000 });
    } finally {
        loadingCustomers.value = false;
    }
};

const fetchShipToAddresses = async (custAccountNo) => {
    if (!custAccountNo) return;

    loadingShipTo.value = true;
    shipToOptions.value = [];
    availableCredit.value = 0;

    try {
        console.log('Fetching ship-to addresses for:', custAccountNo);
        const response = await api.post('list_dealer_shipto', {
            custaccountno: custAccountNo
        });

        console.log('Ship-to API Response:', response.data);

        if (response.data.status === 1) {
            const dealerData = response.data.admin_data;
            console.log('Dealer ship-to data:', dealerData);

            // Set available credit
            availableCredit.value = parseFloat(dealerData.credit_available) || 0;

            // Add ship-to addresses from shipto_list
            if (dealerData.shipto_list && dealerData.shipto_list.length > 0) {
                dealerData.shipto_list.forEach((shipto) => {
                    shipToOptions.value.push({
                        id: shipto.id,
                        code: shipto.custAccountNo,
                        display: `${shipto.custAccountNo} - ${shipto.companyName1 || 'Ship To Address'}`,
                        address1: shipto.addressLine1 || '',
                        address2: shipto.addressLine2 || '',
                        address3: shipto.addressLine3 || '',
                        address4: shipto.addressLine4 || '',
                        city: shipto.city || '',
                        state: shipto.state || '',
                        postcode: shipto.postcode || '',
                        country: shipto.country || ''
                    });
                });
            }

            // Set default ship to account
            if (shipToOptions.value.length > 0) {
                shipToAccount.value = shipToOptions.value[0];
                updateShipToFields(shipToAccount.value);
            }
        } else {
            console.error('Ship-to API returned status 0:', response.data);
        }
    } catch (error) {
        console.error('Error fetching ship to addresses:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load ship-to addresses', life: 3000 });
    } finally {
        loadingShipTo.value = false;
    }
};

const fetchMaterials = async (custAccountNo) => {
    if (!custAccountNo) return;

    loading.value = true;
    tyres.value = [];
    freeItems.value = [];

    try {
        console.log('Fetching materials for:', custAccountNo);
        const response = await api.post('list-material', {
            type: 'ADDTOCART',
            custaccountno: custAccountNo
        });

        console.log('Materials API Response:', response.data);

        if (response.data.status === 1) {
            const materials = response.data.admin_data || {};
            console.log('Raw materials data:', materials);

            // Handle the new API response structure
            let materialList = [];
            if (selectedOrderType.value === 'DIRECTSHIP' && materials.directship) {
                materialList = materials.directship;
            } else if (materials.normal) {
                materialList = materials.normal;
            } else {
                materialList = [];
            }

            if (materialList.length > 0) {
                tyres.value = materialList.map((material, index) => {
                    const size = `${material.sectionwidth || ''}/${material.tireseries || ''} R${material.rimdiameter || ''}`;
                    const price = parseFloat(material.price) || 0;

                    // Use stock_quantity from API response
                    const stockBalance = material.stock_quantity || 0;

                    // Determine stock level display
                    let stockLevel = 'No Stock';
                    let colorCode = '#C62828'; // red

                    if (stockBalance > 10) {
                        stockLevel = 'High Stock';
                        colorCode = '#2E7D32'; // green
                    } else if (stockBalance > 0 && stockBalance <= 10) {
                        stockLevel = 'Low Stock';
                        colorCode = '#EF6C00'; // orange
                    }

                    return {
                        id: material.materialid || `material-${index}`,
                        materialid: material.materialid,
                        material: material.material || 'N/A',
                        pattern: material.pattern || 'N/A',
                        pattern_name: material.pattern_name || null,
                        size: size,
                        sectionwidth: material.sectionwidth,
                        tireseries: material.tireseries,
                        rimdiameter: material.rimdiameter,
                        speedplyrating: material.speedplyrating || 'N/A',
                        origin: material.origin || 'Unknown',
                        price: price,
                        stockBalance: stockBalance,
                        stockLevel: stockLevel,
                        color_code: colorCode,
                        volume: parseFloat(material.volume) || 0,
                        materialtype: material.materialtype || 'ZFP2',
                        storageLocation: material.storageLocation,
                        DOM: material.DOM,
                        quantity: 1,
                        itemcategory: 'ZT02', // Default for regular items
                        plant: 'TSM',
                        salesprogramid: null
                    };
                });

                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Loaded ${tyres.value.length} products`,
                    life: 3000
                });
            } else {
                tyres.value = [];
                toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'No products available for this customer',
                    life: 3000
                });
            }
        } else {
            tyres.value = [];
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'No products available for this customer',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching materials:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load products',
            life: 3000
        });
        tyres.value = [];
    } finally {
        loading.value = false;
    }
};

const checkSalesProgram = async () => {
    if (!selectedCustomer.value || selectedTyres.value.length === 0) return;

    try {
        const orderArray = selectedTyres.value.map((item) => ({
            materialid: item.materialid,
            qty: item.quantity,
            pattern: item.pattern,
            pattern_name: item.pattern_name,
            rimdiameter: item.rimdiameter
        }));

        const response = await api.post('order/check-sales-program', {
            custaccountno: selectedCustomer.value.code,
            order_array: JSON.stringify(orderArray)
        });

        if (response.data.status === 1 && response.data.admin_data) {
            freeItems.value = response.data.admin_data.map((freeItem) => ({
                ...freeItem,
                itemcategory: freeItem.itemcategory || 'ZPRO'
            }));

            if (freeItems.value.length > 0) {
                toast.add({
                    severity: 'success',
                    summary: 'Sales Program Applied',
                    detail: `Found ${freeItems.value.length} free item(s) from sales program`,
                    life: 5000
                });
            }
        }
    } catch (error) {
        console.error('Error checking sales program:', error);
        // Silently fail, as sales program is optional
    }
};

// DIRECTSHIP: Create empty cart
const createDirectShipCart = async () => {
    if (!selectedCustomer.value) {
        throw new Error('No customer selected');
    }

    try {
        const response = await api.post('order/createEmptyDsCart-admin', {
            custaccountno: selectedCustomer.value.code
        });

        if (response.data.status === 1) {
            currentCartRefNo.value = response.data.eten_data.cartRefNo;
            toast.add({ severity: 'success', summary: 'Success', detail: 'Direct shipment cart created', life: 3000 });
            return currentCartRefNo.value;
        } else {
            throw new Error(response.data.error?.message || 'Failed to create cart');
        }
    } catch (error) {
        console.error('Error creating cart:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create order cart', life: 3000 });
        throw error;
    }
};

// Reset DIRECTSHIP cart
const resetDirectShipCart = async () => {
    if (!currentCartRefNo.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No cart to reset', life: 3000 });
        return;
    }

    try {
        const response = await api.get(`order/resetDsCart-admin/${currentCartRefNo.value}`);

        if (response.data.status === 1) {
            selectedTyres.value = [];
            freeItems.value = [];
            currentCartRefNo.value = '';
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cart reset successfully', life: 3000 });
        } else {
            throw new Error('Failed to reset cart');
        }
    } catch (error) {
        console.error('Error resetting cart:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reset cart', life: 3000 });
    }
};

// Excel Import/Export
const importExcel = () => {
    if (selectedOrderType.value !== 'DIRECTSHIP') {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Excel import is only available for Direct Shipment orders', life: 3000 });
        return;
    }
    showUploadDialog.value = true;
    uploadMessage.value = '';
};

const exportExcel = async () => {
    if (selectedOrderType.value !== 'DIRECTSHIP') {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Excel export is only available for Direct Shipment orders', life: 3000 });
        return;
    }

    if (!currentCartRefNo.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No cart available for export', life: 3000 });
        return;
    }

    try {
        const response = await api.get(`order/download-excel-cart/${currentCartRefNo.value}`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `directship_cart_${currentCartRefNo.value}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Excel file downloaded successfully', life: 3000 });
    } catch (error) {
        console.error('Error exporting Excel:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export Excel file', life: 3000 });
    }
};

const onFileSelect = (event) => {
    uploadMessage.value = '';
};

const onExcelUpload = async (event) => {
    try {
        const response = JSON.parse(event.xhr.response);
        if (response.status === 1) {
            uploadMessage.value = 'Excel file uploaded successfully!';
            uploadMessageClass.value = 'bg-green-100 text-green-700';

            // Update cart with imported data
            selectedTyres.value = response.eten_data.order_array || [];
            currentCartRefNo.value = response.eten_data.cartRefNo;

            setTimeout(() => {
                showUploadDialog.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Excel imported successfully', life: 3000 });
            }, 2000);
        } else {
            uploadMessage.value = response.message || 'Upload failed';
            uploadMessageClass.value = 'bg-red-100 text-red-700';
        }
    } catch (error) {
        uploadMessage.value = 'Upload failed: ' + error.message;
        uploadMessageClass.value = 'bg-red-100 text-red-700';
    }
};

// Add to Cart API (for both NORMAL and DIRECTSHIP)
const addToCartAPI = async (cartRefNo = null) => {
    if (!selectedCustomer.value || !shipToAccount.value || selectedTyres.value.length === 0) {
        throw new Error('Missing required data for checkout');
    }

    // Prepare order array according to API requirements
    const orderArray = selectedTyres.value.map((item, index) => ({
        materialid: item.materialid,
        itemno: String((index + 1) * 10).padStart(5, '0'), // Item numbers in increments of 10
        itemcategory: item.itemcategory || 'ZT02',
        plant: item.plant || 'TSM',
        qty: item.quantity.toString(),
        price: item.price.toString(),
        salesprogramid: null
    }));

    // Prepare request payload
    const payload = {
        order_array: JSON.stringify(orderArray),
        orderType: selectedOrderType.value,
        shipto: shipToAccount.value.id.toString(),
        deliveryType: selectedDeliveryMethod.value,
        custaccountno: selectedCustomer.value.code
    };

    // Add DIRECTSHIP specific fields
    if (selectedOrderType.value === 'DIRECTSHIP') {
        payload.containerSize = selectedContainerSize.value;
        if (cartRefNo) {
            payload.cartRefNo = cartRefNo;
        }
    }

    console.log('Add to cart payload:', payload);

    const response = await api.post('order/add-to-cart-admin', payload);
    return response.data;
};

// Confirm order API
const confirmOrderAPI = async (cartRefNo, orderArray) => {
    try {
        console.log('Confirming order with array:', orderArray);

        const response = await api.post(`order/confirm-order-admin/${cartRefNo}`, {
            order_array: JSON.stringify(orderArray),
            order_remark: `Order created via admin interface - ${selectedOrderType.value}`
        });

        return response.data;
    } catch (error) {
        console.error('Error confirming order:', error);
        throw new Error('Failed to confirm order');
    }
};

// Confirm back order API
const confirmBackOrderAPI = async (cartRefNo, orderArray, backorderArray) => {
    try {
        console.log('Confirming back order with arrays:', { orderArray, backorderArray });

        const response = await api.post(`order/confirm-backorder-admin/${cartRefNo}`, {
            order_array: JSON.stringify(orderArray),
            backorder_array: JSON.stringify(backorderArray),
            order_remark: `Order with back order created via admin interface - ${selectedOrderType.value}`
        });

        return response.data;
    } catch (error) {
        console.error('Error confirming back order:', error);
        throw new Error('Failed to confirm back order');
    }
};

// Submit driver information for pickup orders
const submitDriverInformation = async (orderNo) => {
    if (selectedDeliveryMethod.value !== 'SELFCOLLECT' && selectedDeliveryMethod.value !== 'LALAMOVE') {
        return true; // No driver info needed
    }

    try {
        const response = await api.post(`order/driver-information/${orderNo}`, {
            driverName: driverInfo.value.name,
            driverPhoneNum: driverInfo.value.phone,
            driverPlateNum: driverInfo.value.plateNo,
            driverIC: driverInfo.value.icNo
        });

        return response.data.status === 1;
    } catch (error) {
        console.error('Error submitting driver information:', error);
        throw new Error('Failed to submit driver information');
    }
};

// Main Order Placement Function
const placeOrder = async () => {
    if (!canPlaceOrder.value) {
        step3Validated.value = true;
        return;
    }

    processingOrder.value = true;
    showOrderDialog.value = true;
    orderStatus.value = 'processing';
    orderMessage.value = 'Processing your order...';
    orderError.value = '';
    orderDetails.value = null;

    try {
        // Prepare order array for both order types
        const orderArray = selectedTyres.value.map((item, index) => ({
            materialid: item.materialid,
            itemno: String((index + 1) * 10).padStart(5, '0'),
            itemcategory: item.itemcategory || 'ZT02',
            plant: item.plant || 'TSM',
            qty: item.quantity.toString(),
            price: item.price.toString(),
            salesprogramid: null
        }));

        if (selectedOrderType.value === 'DIRECTSHIP') {
            await processDirectShipOrder(orderArray);
        } else {
            await processNormalOrder(orderArray);
        }
    } catch (error) {
        console.error('Order placement error:', error);
        orderStatus.value = 'error';
        orderMessage.value = 'Failed to process order';
        orderError.value = error.message || 'Unknown error occurred';

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to process order',
            life: 5000
        });
    } finally {
        processingOrder.value = false;
    }
};

// Process DIRECTSHIP Order
const processDirectShipOrder = async (orderArray) => {
    orderMessage.value = 'Adding items to direct shipment...';

    const addToCartResult = await addToCartAPI(currentCartRefNo.value);

    if (addToCartResult.status === 1) {
        orderMessage.value = 'Confirming direct shipment order...';

        // Use the processed order array from addToCartAPI response if available
        const finalOrderArray = addToCartResult.eten_data?.order_array || orderArray;

        const confirmResult = await confirmOrderAPI(currentCartRefNo.value, finalOrderArray);
        await handleOrderConfirmation(confirmResult, 'DIRECTSHIP');
    } else {
        throw new Error(addToCartResult.message || 'Failed to add items to direct shipment cart');
    }
};

// Process NORMAL Order
const processNormalOrder = async (orderArray) => {
    orderMessage.value = 'Adding items to cart...';
    const addToCartResult = await addToCartAPI();

    if (addToCartResult.status === 1) {
        orderMessage.value = 'Confirming order with SAP...';
        const cartRefNo = addToCartResult.eten_data?.cartRefNo;

        // Use the processed order array from addToCartAPI response if available
        const finalOrderArray = addToCartResult.eten_data?.order_array || orderArray;

        const confirmResult = await confirmOrderAPI(cartRefNo, finalOrderArray);

        // Submit driver information for pickup orders
        if (confirmResult.status === 1 && (selectedDeliveryMethod.value === 'SELFCOLLECT' || selectedDeliveryMethod.value === 'LALAMOVE')) {
            orderMessage.value = 'Submitting driver information...';
            await submitDriverInformation(confirmResult.eten_data.orderRefNo);
        }

        await handleOrderConfirmation(confirmResult, 'NORMAL');
    } else {
        throw new Error(addToCartResult.message || 'Failed to add items to cart');
    }
};

// Handle Order Confirmation Response
const handleOrderConfirmation = async (confirmResult, orderType) => {
    console.log('Order confirmation result:', confirmResult);

    if (confirmResult.status === 1) {
        // Order successful
        orderStatus.value = 'success';
        orderMessage.value = `${orderType} order created successfully!`;
        orderDetails.value = {
            orderRefNo: confirmResult.eten_data.orderRefNo
        };

        // Clear cart and reset
        selectedTyres.value = [];
        freeItems.value = [];
        currentCartRefNo.value = '';
        currentStep.value = 1;

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `${orderType} order ${confirmResult.eten_data.orderRefNo} created successfully`,
            life: 5000
        });
    } else if (confirmResult.status === 0 && confirmResult.eten_data) {
        // Handle backorder scenario
        const backOrderData = Array.isArray(confirmResult.eten_data) ? confirmResult.eten_data[0] : confirmResult.eten_data;
        const unfulfilled = backOrderData?.unfulfilled_items || [];

        console.log('Unfulfilled items:', unfulfilled);

        // Check if there are actual unfulfilled items
        const hasUnfulfilledItems = unfulfilled.some((item) => item.materialid && item.materialid.trim() !== '' && item.backorder_qty > 0);

        if (hasUnfulfilledItems) {
            // Show back order dialog
            unfulfilledItems.value = unfulfilled.map((item) => ({
                materialid: item.materialid,
                requested_qty: item.requested_qty || 0,
                accepted_qty: item.accepted_qty || 0,
                backorder_qty: item.backorder_qty || 0
            }));

            showBackOrderDialog.value = true;
            showOrderDialog.value = false;
        } else {
            // SAP error without specific unfulfilled items
            throw new Error(confirmResult.message || `${orderType} order confirmation failed`);
        }
    } else {
        throw new Error(confirmResult.message || `${orderType} order confirmation failed`);
    }
};

// Back Order Processing
const proceedWithBackOrder = async () => {
    showBackOrderDialog.value = false;
    showOrderDialog.value = true;
    orderStatus.value = 'processing';
    orderMessage.value = 'Creating order with back order...';

    try {
        // Prepare arrays for back order
        const fulfilledArray = [];
        const backOrderArray = [];

        selectedTyres.value.forEach((item, index) => {
            const unfulfilledItem = unfulfilledItems.value.find((bo) => bo.materialid === item.materialid);

            if (unfulfilledItem && unfulfilledItem.backorder_qty > 0) {
                // Add to back order array with remaining quantity
                backOrderArray.push({
                    materialid: item.materialid,
                    itemno: String((index + 1) * 10).padStart(5, '0'),
                    itemcategory: item.itemcategory || 'ZT02',
                    plant: item.plant || 'TSM',
                    qty: unfulfilledItem.backorder_qty.toString(),
                    price: item.price.toString(),
                    salesprogramid: null
                });

                // If there's any accepted quantity, add to fulfilled array
                if (unfulfilledItem.accepted_qty > 0) {
                    fulfilledArray.push({
                        materialid: item.materialid,
                        itemno: String((index + 1) * 10).padStart(5, '0'),
                        itemcategory: item.itemcategory || 'ZT02',
                        plant: item.plant || 'TSM',
                        qty: unfulfilledItem.accepted_qty.toString(),
                        price: item.price.toString(),
                        salesprogramid: null
                    });
                }
            } else {
                // Item is fully fulfilled
                fulfilledArray.push({
                    materialid: item.materialid,
                    itemno: String((index + 1) * 10).padStart(5, '0'),
                    itemcategory: item.itemcategory || 'ZT02',
                    plant: item.plant || 'TSM',
                    qty: item.quantity.toString(),
                    price: item.price.toString(),
                    salesprogramid: null
                });
            }
        });

        const cartRefNo = currentCartRefNo.value || `TEMP-${Date.now()}`;
        const result = await confirmBackOrderAPI(cartRefNo, fulfilledArray, backOrderArray);

        if (result.status === 1) {
            orderStatus.value = 'success';
            orderMessage.value = 'Order created with back order!';
            orderDetails.value = {
                orderRefNo: result.eten_data.orderRefNo,
                backOrderRefNo: result.eten_data.backOrderRefNo
            };

            // Clear cart and reset
            selectedTyres.value = [];
            freeItems.value = [];
            currentCartRefNo.value = '';
            currentStep.value = 1;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Order ${result.eten_data.orderRefNo} created with back order ${result.eten_data.backOrderRefNo}`,
                life: 5000
            });
        } else {
            throw new Error(result.message || 'Back order creation failed');
        }
    } catch (error) {
        orderStatus.value = 'error';
        orderMessage.value = 'Failed to create back order';
        orderError.value = error.message;

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create back order',
            life: 5000
        });
    }
};

const proceedWithoutBackOrder = async () => {
    showBackOrderDialog.value = false;
    showOrderDialog.value = true;
    orderStatus.value = 'processing';
    orderMessage.value = 'Creating order without back order...';

    try {
        // Only process fulfilled items
        const orderArray = [];

        selectedTyres.value.forEach((item, index) => {
            const unfulfilledItem = unfulfilledItems.value.find((bo) => bo.materialid === item.materialid);

            if (!unfulfilledItem || unfulfilledItem.accepted_qty > 0) {
                const quantity = unfulfilledItem ? unfulfilledItem.accepted_qty : item.quantity;

                if (quantity > 0) {
                    orderArray.push({
                        materialid: item.materialid,
                        itemno: String((index + 1) * 10).padStart(5, '0'),
                        itemcategory: item.itemcategory || 'ZT02',
                        plant: item.plant || 'TSM',
                        qty: quantity.toString(),
                        price: item.price.toString(),
                        salesprogramid: null
                    });
                }
            }
        });

        if (orderArray.length === 0) {
            throw new Error('No items available for order');
        }

        const cartRefNo = currentCartRefNo.value || `TEMP-${Date.now()}`;
        const result = await confirmOrderAPI(cartRefNo, orderArray);

        if (result.status === 1) {
            orderStatus.value = 'success';
            orderMessage.value = 'Order created successfully!';
            orderDetails.value = {
                orderRefNo: result.eten_data.orderRefNo
            };

            // Clear cart and reset
            selectedTyres.value = [];
            freeItems.value = [];
            currentCartRefNo.value = '';
            currentStep.value = 1;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Order ${result.eten_data.orderRefNo} created successfully`,
                life: 5000
            });
        } else {
            throw new Error(result.message || 'Order creation failed');
        }
    } catch (error) {
        orderStatus.value = 'error';
        orderMessage.value = 'Failed to create order';
        orderError.value = error.message;
        

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create order',
            life: 5000
        });
    }
};

// Event Handlers
const onCustomerChange = (event) => {
    console.log('Customer changed:', event.value);

    if (event.value && event.value.code) {
        fetchMaterials(event.value.code);
        fetchShipToAddresses(event.value.code);
        selectedTyres.value = [];
        freeItems.value = [];
        currentCartRefNo.value = '';
    } else {
        resetAllData();
    }
};

const onOrderTypeChange = (event) => {
    console.log('Order type changed to:', event.value);

    // Clear cart when order type changes
    selectedTyres.value = [];
    freeItems.value = [];
    currentCartRefNo.value = '';

    // Refresh materials for new order type
    if (selectedCustomer.value) {
        fetchMaterials(selectedCustomer.value.code);
    }
};

const onDeliveryMethodChange = (event) => {
    console.log('Delivery method changed to:', event.value);
    // Reset driver info when delivery method changes
    if (event.value === 'DELIVER') {
        driverInfo.value = { name: '', phone: '', plateNo: '', icNo: '' };
    }
};

const onShipToAccountChange = (event) => {
    if (event.value) {
        updateShipToFields(event.value);
    } else {
        resetShipToFields();
    }
};

const onQuantityChange = (item) => {
    // Check sales program when quantity changes
    if (selectedTyres.value.length > 0) {
        checkSalesProgram();
    }
};

const onColumnFilter = (field, value) => {
    filters.value[field].value = value;
};

const clearFilters = () => {
    globalFilter.value = '';
    filters.value.pattern.value = '';
    filters.value.size.value = '';
    filters.value.sectionwidth.value = '';
};

const addToCart = (tyre) => {
    // Check stock availability
    if (tyre.stockBalance === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Out of Stock',
            detail: 'This product is currently out of stock',
            life: 3000
        });
        return;
    }

    // Check container capacity for DIRECTSHIP
    if (selectedOrderType.value === 'DIRECTSHIP') {
        const itemVolume = tyre.volume || 0;
        const currentVolume = containerCapacity.value;
        const maxVolume = maxContainerCapacity.value;

        if (currentVolume + itemVolume > maxVolume) {
            toast.add({
                severity: 'warn',
                summary: 'Container Full',
                detail: 'Container capacity reached',
                life: 3000
            });
            return;
        }
    }

    const existing = selectedTyres.value.find((t) => t.id === tyre.id);
    if (existing) {
        if (existing.quantity < getMaxQuantity(tyre)) {
            existing.quantity += 1;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Quantity updated in cart',
                life: 2000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Stock Limit',
                detail: 'Cannot exceed available stock',
                life: 3000
            });
        }
    } else {
        selectedTyres.value.push({
            ...tyre,
            quantity: 1
        });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added to cart',
            life: 2000
        });
    }

    // Check for sales program after adding to cart
    checkSalesProgram();
};

const removeFromCart = (tyre) => {
    const index = selectedTyres.value.findIndex((t) => t.id === tyre.id);
    if (index !== -1) {
        selectedTyres.value.splice(index, 1);
        toast.add({ severity: 'info', summary: 'Removed', detail: 'Product removed from cart', life: 2000 });

        // Recheck sales program after removal
        checkSalesProgram();
    }
};

const isInCart = (tyre) => selectedTyres.value.some((t) => t.id === tyre.id);

const viewOrderDetails = () => {
    if (orderDetails.value?.orderRefNo) {
        router.push(`/om/detailOrder/${orderDetails.value.orderRefNo}`);
    }
    closeOrderDialog();
};

const closeOrderDialog = () => {
    showOrderDialog.value = false;
    orderStatus.value = '';
    orderMessage.value = '';
    orderDetails.value = null;
    orderError.value = '';
    unfulfilledItems.value = [];
};

// Helper Functions
const updateShipToFields = (shipto) => {
    shipToAddress1.value = shipto.address1 || '';
    shipToAddress2.value = shipto.address2 || '';
    shipToAddress3.value = shipto.address3 || '';
    shipToAddress4.value = shipto.address4 || '';
    shipToCity.value = shipto.city || '';
    shipToState.value = shipto.state || '';
    shipToPostcode.value = shipto.postcode || '';
    shipToCountry.value = shipto.country || '';
};

const resetShipToFields = () => {
    shipToAddress1.value = '';
    shipToAddress2.value = '';
    shipToAddress3.value = '';
    shipToAddress4.value = '';
    shipToCity.value = '';
    shipToState.value = '';
    shipToPostcode.value = '';
    shipToCountry.value = '';
};

const resetAllData = () => {
    tyres.value = [];
    selectedTyres.value = [];
    freeItems.value = [];
    shipToOptions.value = [];
    shipToAccount.value = null;
    resetShipToFields();
    resetFilters();
    currentCartRefNo.value = '';
    availableCredit.value = 0;
};

const resetFilters = () => {
    globalFilter.value = '';
    filters.value.pattern.value = '';
    filters.value.size.value = '';
    filters.value.sectionwidth.value = '';
};

// Watchers
watch(selectedOrderType, (newType) => {
    console.log('Order type watcher:', newType);
    if (newType === 'DIRECTSHIP') {
        selectedDeliveryMethod.value = 'DELIVER';
    }
});

watch(selectedCustomer, (newCustomer) => {
    if (!newCustomer) {
        resetAllData();
    }
});

watch(
    selectedTyres,
    (newCart) => {
        if (newCart.length > 0) {
            checkSalesProgram();
        } else {
            freeItems.value = [];
        }
    },
    { deep: true }
);

// Initialize
onMounted(() => {
    fetchCustomers();
});
</script>

<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

:deep(.p-progressbar .p-progressbar-value) {
    transition: width 0.3s ease;
}
</style>
