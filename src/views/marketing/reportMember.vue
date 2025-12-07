<template>
    <Fluid>
        <Toast />
        
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Title -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">{{ selectedReport.label }}</div>

                <!-- Filters Section -->
                <div>
                    <!-- Main Filters Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Report Type -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Report Type</label>
                            <Dropdown 
                                v-model="selectedReport" 
                                :options="reportTypes" 
                                optionLabel="label" 
                                placeholder="Select Report Type" 
                                class="w-full"
                            />
                        </div>

                        <!-- Year Filter -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Year</label>
                            <MultiSelect 
                                v-model="filters.years" 
                                :options="yearOptions" 
                                optionLabel="label" 
                                optionValue="value" 
                                placeholder="Select Year(s)" 
                                class="w-full"
                                :maxSelectedLabels="3"
                                display="chip"
                            />
                        </div>
                    </div>

                    <!-- Additional Filters Row (conditional) -->
                    <div v-if="selectedReport.value === 'by-birthday'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                        <!-- Empty column for alignment -->
                        <div></div>
                    </div>

                    <div v-if="selectedReport.value === 'point-expiry'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Expiry Range (Days)</label>
                            <div class="flex gap-2">
                                <InputNumber 
                                    v-model="filters.expiryFrom" 
                                    placeholder="From" 
                                    :min="0" 
                                    class="w-full"
                                />
                                <InputNumber 
                                    v-model="filters.expiryTo" 
                                    placeholder="To" 
                                    :min="0" 
                                    class="w-full"
                                />
                            </div>
                        </div>
                        <!-- Empty column for alignment -->
                        <div></div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-6">
                        <Button 
                            label="Clear Filters" 
                            class="p-button-outlined p-button-secondary" 
                            @click="clearFilters" 
                        />
                        <Button 
                            label="Export Excel" 
                            icon="pi pi-file-excel" 
                            class="p-button-success" 
                            @click="exportExcel" 
                            :loading="exportLoading" 
                            :disabled="!filters.years || filters.years.length === 0"
                        />
                    </div>
                </div>
            </div>

            <!-- Report Preview/Summary -->
            <div class="card p-6">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-700">Report Preview</h3>
                    <p class="text-sm text-gray-500">Preview of the data that will be exported</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-center py-8" v-if="!filters.years || filters.years.length === 0">
                        <i class="pi pi-chart-bar text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">Select year(s) and click Export Excel to generate the report.</p>
                    </div>
                    <div v-else-if="loadingData" class="text-center py-8">
                        <i class="pi pi-spinner pi-spin text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">Loading report data...</p>
                    </div>
                    <div v-else-if="reportData.length === 0 && filters.years.length > 0" class="text-center py-8">
                        <i class="pi pi-exclamation-circle text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">No data available for the selected filters.</p>
                    </div>
                    <div v-else-if="reportData.length > 0">
                        <!-- Preview Table -->
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white border border-gray-200">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                                            {{ getReportColumnHeader() }}
                                        </th>
                                        <th v-for="year in filters.years" 
                                            :key="year" 
                                            class="py-2 px-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                                            {{ year }}
                                        </th>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                                            %
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in reportData" 
                                        :key="index"
                                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="py-2 px-4 border-b border-gray-200">
                                            {{ item.label }}
                                        </td>
                                        <td v-for="year in filters.years" 
                                            :key="year" 
                                            class="py-2 px-4 border-b border-gray-200 text-center">
                                            {{ item[year] || '' }}
                                        </td>
                                        <td class="py-2 px-4 border-b border-gray-200 text-center">
                                            {{ item.percentage || '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Report Metadata -->
                        <div class="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                            <p><strong>Report Type:</strong> {{ selectedReport.label }}</p>
                            <p><strong>Selected Years:</strong> {{ filters.years.join(', ') }}</p>
                            <p v-if="filters.month"><strong>Month:</strong> {{ getMonthLabel(filters.month) }}</p>
                            <p v-if="filters.expiryFrom || filters.expiryTo">
                                <strong>Expiry Range:</strong> 
                                {{ filters.expiryFrom || '0' }} to {{ filters.expiryTo || 'Unlimited' }} days
                            </p>
                            <p><strong>Total Records:</strong> {{ getTotalRecords() }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

// Initialize Toast
const toast = useToast();

// ✅ Report Types with API endpoint mapping
const reportTypes = ref([
    { label: 'TC by Gender', value: 'by-gender', apiEndpoint: 'report/gender-report', columnHeader: 'Gender' },
    { label: 'TC by Race', value: 'by-race', apiEndpoint: 'report/race-report', columnHeader: 'Race' },
    { label: 'TC by State', value: 'by-state', apiEndpoint: 'report/state-report', columnHeader: 'State' },
    { label: 'TC by Age', value: 'by-age', apiEndpoint: 'report/age-report', columnHeader: 'Age Group' },
    { label: 'TC by Birthday', value: 'by-birthday', apiEndpoint: 'report/birthMonth-report', columnHeader: 'Birth Month' },
    { label: 'TC Point Expiry', value: 'point-expiry', apiEndpoint: 'report/pointExpiry-report', columnHeader: 'Month' }
]);

// ✅ Selected Report
const selectedReport = ref(reportTypes.value[0]);

// ✅ Filters
const filters = reactive({
    years: [],
    month: null,
    expiryFrom: null,
    expiryTo: null
});

// ✅ Report Data
const reportData = ref([]);

// ✅ Loading states
const exportLoading = ref(false);
const loadingData = ref(false);

// ✅ Year Options
const yearOptions = ref([
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' }
]);

// ✅ Month Options (for birthday report)
const monthOptions = ref([
    { label: 'All Months', value: null },
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
]);

// ✅ Show Toast Notification
const showToast = (severity, summary, detail, life = 3000) => {
    toast.add({
        severity,
        summary,
        detail,
        life
    });
};

// ✅ Get Report Column Header
const getReportColumnHeader = () => {
    return selectedReport.value.columnHeader || selectedReport.value.label;
};

// ✅ Get Month Label
const getMonthLabel = (monthValue) => {
    const month = monthOptions.value.find(m => m.value === monthValue);
    return month ? month.label : 'All Months';
};

// ✅ Get Total Records
const getTotalRecords = () => {
    if (reportData.value.length === 0) return 0;
    const lastRow = reportData.value[reportData.value.length - 1];
    return lastRow[Object.keys(lastRow).find(key => key.includes('Total'))] || 0;
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.years = [];
    filters.month = null;
    filters.expiryFrom = null;
    filters.expiryTo = null;
    reportData.value = [];
    
    showToast('info', 'Filters Cleared', 'All filters have been reset to default values.');
};

// ✅ Prepare FormData for API
const prepareFormData = () => {
    const formData = new FormData();
    
    // ✅ CORRECT FORMAT: Add years as JSON stringified array
    if (filters.years && filters.years.length > 0) {
        // Stringify the entire array: "[2024, 2025]"
        formData.append('years', JSON.stringify(filters.years));
        console.log('Stringified years array:', JSON.stringify(filters.years));
    } else {
        showToast('warn', 'Years Required', 'Please select at least one year.');
        return null;
    }
    
    // Add additional parameters based on report type
    if (selectedReport.value.value === 'by-birthday' && filters.month) {
        formData.append('month', filters.month);
    }
    
    if (selectedReport.value.value === 'point-expiry') {
        if (filters.expiryFrom !== null && filters.expiryFrom !== undefined) {
            formData.append('expiryFrom', filters.expiryFrom.toString());
        }
        if (filters.expiryTo !== null && filters.expiryTo !== undefined) {
            formData.append('expiryTo', filters.expiryTo.toString());
        }
    }
    
    // Log what we're sending
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
    return formData;
};

// ✅ FETCH DATA FOR PREVIEW - EXPECTS JSON
const fetchReportData = async () => {
    if (!filters.years || filters.years.length === 0) {
        reportData.value = [];
        return;
    }

    loadingData.value = true;
    try {
        const endpoint = selectedReport.value.apiEndpoint;
        const formData = prepareFormData();
        
        if (!formData) {
            loadingData.value = false;
            return;
        }
        
        console.log('Fetching preview data from:', endpoint);
        
        // Add parameter to request JSON for preview
        formData.append('format', 'json');
        
        const response = await api.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'json' // Explicitly request JSON
        });
        
        console.log('✅ Preview API Response:', response.data);
        
        // Process the response
        if (response.data && (response.data.status === 1 || response.data.success)) {
            const data = response.data.data || response.data;
            reportData.value = formatReportData(data);
            
            if (reportData.value.length > 0) {
                showToast('success', 'Data Loaded', 
                    `Report data loaded successfully for ${filters.years.length} year(s)`);
            } else {
                showToast('warn', 'No Data', 'No data available for the selected filters.');
            }
        } else {
            console.error('API Response Error:', response.data);
            reportData.value = [];
            showToast('error', 'API Error', 
                response.data?.message || 'Failed to fetch report data');
        }
        
    } catch (error) {
        console.error('Error fetching preview data:', error);
        
        // Handle blob response error (API returned Excel instead of JSON)
        if (error.response && error.response.data instanceof Blob) {
            console.log('API returned Excel blob instead of JSON for preview');
            reportData.value = [];
            showToast('info', 'Preview Note', 
                'This report returns Excel data directly. Click Export Excel to download.');
            return;
        }
        
        // Handle JSON parsing errors
        if (error.code === 'ERR_BAD_RESPONSE' || error.message.includes('Unexpected token')) {
            console.log('API returned non-JSON response (likely Excel)');
            reportData.value = [];
            showToast('info', 'Preview Unavailable', 
                'Real-time preview is not available. Click Export Excel to download the report.');
            return;
        }
        
        reportData.value = [];
        
        // Show detailed error message
        if (error.response?.status === 422) {
            const errorData = error.response?.data;
            let errorMessage = 'Validation error. ';
            
            if (errorData?.errors) {
                Object.keys(errorData.errors).forEach(key => {
                    errorMessage += `${key}: ${errorData.errors[key].join(', ')} `;
                });
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }
            
            showToast('error', 'Validation Error', errorMessage);
        } else if (error.response?.status === 500) {
            showToast('error', 'Server Error', 
                'The server encountered an error. Please try again later.');
        } else {
            showToast('error', 'Fetch Error', 
                'Failed to fetch report data. Please check your connection and try again.');
        }
    } finally {
        loadingData.value = false;
    }
};

// ✅ FORMAT API RESPONSE FOR PREVIEW
const formatReportData = (apiData) => {
    const formattedData = [];
    
    // Handle different API response structures
    if (Array.isArray(apiData)) {
        apiData.forEach(item => {
            const row = { 
                label: item.label || item.category || item.name || item.gender || 
                       item.race || item.state || item.ageGroup || item.month || 'N/A'
            };
            
            filters.years.forEach(year => {
                row[year] = item[year] || item[`year_${year}`] || 
                           item[`count_${year}`] || item.count || '';
            });
            
            row.percentage = item.percentage || item.percent || 
                            (item.percentage ? `${item.percentage}%` : '');
            
            formattedData.push(row);
        });
    } else if (apiData && typeof apiData === 'object') {
        Object.keys(apiData).forEach(key => {
            if (key !== 'status' && key !== 'success' && key !== 'message') {
                const item = apiData[key];
                const row = { 
                    label: key.charAt(0).toUpperCase() + key.slice(1)
                };
                
                if (typeof item === 'object') {
                    filters.years.forEach(year => {
                        row[year] = item[year] || item.value || item.count || '';
                    });
                    row.percentage = item.percentage || item.percent || '';
                } else {
                    row[filters.years[0]] = item;
                }
                
                formattedData.push(row);
            }
        });
    }
    
    return formattedData;
};

// ✅ EXPORT TO EXCEL - EXPECTS BLOB
const exportExcel = async () => {
    if (!filters.years || filters.years.length === 0) {
        showToast('warn', 'Year Required', 'Please select at least one year.');
        return;
    }

    exportLoading.value = true;
    
    try {
        const endpoint = selectedReport.value.apiEndpoint;
        const formData = prepareFormData();
        
        if (!formData) {
            exportLoading.value = false;
            return;
        }
        
        console.log('Exporting Excel from:', endpoint);
        
        // ✅ Request blob response (Excel file)
        const response = await api.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob' // CRITICAL: Expect Excel binary
        });
        
        console.log('✅ Excel response received:', response);
        
        // Determine content type
        const contentType = response.headers['content-type'] || 
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        
        // Create blob from response
        const blob = new Blob([response.data], { type: contentType });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Generate filename
        let filename = 'report_export.xlsx';
        
        // Try to extract filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                filename = fileNameMatch[1].replace(/['"]/g, '');
            }
        }
        
        // Fallback: Generate descriptive filename
        if (filename === 'report_export.xlsx') {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
            filename = `${selectedReport.value.value.replace(/-/g, '_')}_report`;
            
            if (filters.years.length > 0) {
                filename += `_${filters.years.join('_')}`;
            }
            
            if (selectedReport.value.value === 'by-birthday' && filters.month) {
                const monthLabel = getMonthLabel(filters.month).replace(/\s+/g, '_');
                filename += `_${monthLabel}`;
            }
            
            filename += `_${timestamp}.xlsx`;
        }
        
        // Trigger download
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showToast('success', 'Export Successful', 
            `${selectedReport.value.label} report downloaded successfully!`);
        
    } catch (error) {
        console.error('Export Error:', error);
        
        // Handle blob parsing errors
        if (error.response && error.response.data instanceof Blob) {
            try {
                // Try to read error message from blob
                const errorText = await error.response.data.text();
                const errorData = JSON.parse(errorText);
                showToast('error', 'Export Failed', 
                    errorData.message || 'Server returned an error while generating Excel.');
            } catch (parseError) {
                showToast('error', 'Export Failed', 
                    'Failed to generate Excel file. Please try again.');
            }
        } else if (error.response?.status === 422) {
            const errorData = error.response?.data;
            let errorMessage = 'Validation error. ';
            
            if (errorData?.errors) {
                Object.keys(errorData.errors).forEach(key => {
                    errorMessage += `${key}: ${errorData.errors[key].join(', ')} `;
                });
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }
            
            showToast('error', 'Validation Error', errorMessage);
        } else if (error.response?.status === 500) {
            showToast('error', 'Server Error', 
                'The server encountered an error while generating the report.');
        } else {
            showToast('error', 'Export Error', 
                'Failed to export. Please check your network and try again.');
        }
    } finally {
        exportLoading.value = false;
    }
};

// ✅ Watch for filter changes to update data
watch([() => selectedReport.value, () => filters.years], 
    ([newReport, newYears], [oldReport, oldYears]) => {
    
    const yearsChanged = JSON.stringify(newYears) !== JSON.stringify(oldYears);
    const reportChanged = newReport.value !== oldReport.value;
    
    if ((yearsChanged || reportChanged) && newYears && newYears.length > 0) {
        fetchReportData();
    } else {
        reportData.value = [];
    }
}, { deep: true });

// ✅ Initialize with default values
onMounted(() => {
    // Set default years (e.g., current year)
    const currentYear = new Date().getFullYear().toString();
    filters.years = [currentYear];
    
    // Fetch initial data after a short delay
    setTimeout(() => {
        fetchReportData();
    }, 500);
});
</script>

<style scoped>
:deep(.p-multiselect),
:deep(.p-dropdown),
:deep(.p-inputnumber) {
    width: 100%;
}

:deep(.p-button) {
    min-width: 120px;
}

:deep(.p-button:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Custom styling for the multi-select chips */
:deep(.p-multiselect-chip .p-multiselect-token) {
    background-color: #e2e8f0;
    color: #1e293b;
    font-weight: 500;
}

/* Toast positioning */
:deep(.p-toast) {
    z-index: 1000;
}

/* Table styling */
table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
}

thead {
    background-color: #f9fafb;
}

tbody tr:hover {
    background-color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .grid-cols-1.md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
    
    .flex.gap-2 {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    table {
        font-size: 14px;
    }
    
    th, td {
        padding: 6px 8px;
    }
}
</style>