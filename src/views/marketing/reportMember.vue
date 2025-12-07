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
                            <Dropdown v-model="selectedReport" :options="reportTypes" optionLabel="label" placeholder="Select Report Type" class="w-full" />
                        </div>

                        <!-- Year Filter -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Year</label>
                            <MultiSelect v-model="filters.years" :options="yearOptions" optionLabel="label" optionValue="value" placeholder="Select Year(s)" class="w-full" :maxSelectedLabels="3" display="chip" />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-6">
                        <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" :disabled="!filters.years || filters.years.length === 0" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import api from '@/service/api';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref, watch } from 'vue';

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
    const month = monthOptions.value.find((m) => m.value === monthValue);
    return month ? month.label : 'All Months';
};

// ✅ Get Total Records
const getTotalRecords = () => {
    if (reportData.value.length === 0) return 0;
    
    const totalRow = reportData.value.find(row => 
        row.label && row.label.toLowerCase().includes('total') ||
        row.label && row.label.toLowerCase().includes('grand')
    );
    
    if (totalRow && filters.years.length > 0) {
        const year = filters.years[0];
        return totalRow[year] || 0;
    }
    
    if (filters.years.length > 0) {
        const year = filters.years[0];
        return reportData.value.reduce((sum, row) => {
            const value = parseFloat(row[year]) || 0;
            return sum + value;
        }, 0);
    }
    
    return 0;
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

// ✅ Prepare JSON Body for API
const prepareRequestBody = () => {
    if (!filters.years || filters.years.length === 0) {
        showToast('warn', 'Years Required', 'Please select at least one year.');
        return null;
    }

    const requestBody = {
        years: filters.years
    };
    
    // Add additional filters
    if (selectedReport.value.value === 'by-birthday' && filters.month) {
        requestBody.month = filters.month;
    }
    
    if (selectedReport.value.value === 'point-expiry') {
        if (filters.expiryFrom !== null && filters.expiryFrom !== undefined) {
            requestBody.expiryFrom = filters.expiryFrom;
        }
        if (filters.expiryTo !== null && filters.expiryTo !== undefined) {
            requestBody.expiryTo = filters.expiryTo;
        }
    }
    
    return requestBody;
};

// ✅ FETCH DATA FOR PREVIEW
const fetchReportData = async () => {
    if (!filters.years || filters.years.length === 0) {
        reportData.value = [];
        return;
    }

    loadingData.value = true;
    
    try {
        const endpoint = selectedReport.value.apiEndpoint;
        const requestBody = prepareRequestBody();
        
        if (!requestBody) {
            loadingData.value = false;
            return;
        }

        console.log('📊 Fetching preview from:', endpoint, 'with:', requestBody);
        
        // For preview, use regular post (JSON response)
        const response = await api.post(endpoint, requestBody);
        
        // Process response
        if (response.data && response.data.status === 1) {
            const data = response.data.data || response.data.report_data || response.data;
            reportData.value = Array.isArray(data) ? data : [];
            showToast('success', 'Data Loaded', 'Report data loaded successfully');
        } else {
            reportData.value = [];
            showToast('warn', 'No Data', 'No data available for selected filters');
        }
    } catch (error) {
        console.error('Error fetching preview data:', error);
        reportData.value = [];
        showToast('error', 'Error', 'Failed to load data');
    } finally {
        loadingData.value = false;
    }
};

// ✅ EXPORT TO EXCEL - FIXED VERSION
const exportExcel = async () => {
    if (!filters.years || filters.years.length === 0) {
        showToast('warn', 'Year Required', 'Please select at least one year.');
        return;
    }

    exportLoading.value = true;

    try {
        const endpoint = selectedReport.value.apiEndpoint;
        const requestBody = prepareRequestBody();
        
        if (!requestBody) {
            exportLoading.value = false;
            return;
        }

        console.log('📤 Exporting Excel from:', endpoint);
        console.log('Request Body:', JSON.stringify(requestBody, null, 2));

        // 🔴 CRITICAL FIX 1: Use exact same format as your returnCollection component
        // returnCollection uses: { warrantyentryids_array: JSON.stringify(idsArray) }
        // Try if your backend expects JSON string for arrays
        
        // OPTION 1: Try with stringified years (like returnCollection does)
        const alternativeBody = {
            years: JSON.stringify(filters.years)  // Stringify the array
        };
        
        // Copy other filters
        if (selectedReport.value.value === 'by-birthday' && filters.month) {
            alternativeBody.month = filters.month;
        }
        
        if (selectedReport.value.value === 'point-expiry') {
            if (filters.expiryFrom !== null) {
                alternativeBody.expiryFrom = filters.expiryFrom;
            }
            if (filters.expiryTo !== null) {
                alternativeBody.expiryTo = filters.expiryTo;
            }
        }

        console.log('Alternative Body:', alternativeBody);

        // 🔴 CRITICAL FIX 2: Try different approaches sequentially
        let response;
        
        // Approach 1: Try with stringified years (like returnCollection)
        try {
            console.log('Trying Approach 1: Stringified years');
            response = await api.postExtra(
                endpoint, 
                alternativeBody,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Approach 1 succeeded');
        } catch (error1) {
            console.log('Approach 1 failed, trying Approach 2...');
            
            // Approach 2: Try with original request body
            response = await api.postExtra(
                endpoint, 
                requestBody,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Approach 2 succeeded');
        }

        // Verify we got a blob response
        if (!response.data || !(response.data instanceof Blob)) {
            throw new Error('Server did not return Excel file');
        }

        // 🔴 CRITICAL FIX 3: Check content type
        const contentType = response.headers['content-type'] || 
                           response.data.type || 
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        
        console.log('Response Content-Type:', contentType);
        
        // Create blob
        const blob = new Blob([response.data], { type: contentType });

        // Generate download URL
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const reportName = selectedReport.value.label.replace(/\s+/g, '_');
        const yearsStr = filters.years.join('_');
        
        // Try to get filename from Content-Disposition header
        let filename = `${reportName}_${yearsStr}_${timestamp}.xlsx`;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"']+)["']?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = decodeURIComponent(filenameMatch[1]);
            }
        }
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);

        showToast('success', 'Export Successful', `${filename} downloaded successfully!`);
        
    } catch (error) {
        console.error('❌ Export Error Details:', error);
        
        // Enhanced error logging
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
            
            // Try to read error message from blob if it's a blob
            if (error.response.data instanceof Blob) {
                try {
                    const errorText = await error.response.data.text();
                    console.error('Error Blob Content:', errorText);
                    
                    // Try to parse as JSON
                    try {
                        const errorJson = JSON.parse(errorText);
                        console.error('Error JSON:', errorJson);
                        showToast('error', 'Server Error', errorJson.message || errorJson.error || 'Server error occurred');
                    } catch (parseError) {
                        console.error('Could not parse error as JSON');
                        showToast('error', 'Server Error', 'Server returned error file');
                    }
                } catch (blobError) {
                    console.error('Could not read error blob:', blobError);
                    showToast('error', 'Export Failed', `Server error: ${error.response.status}`);
                }
            } else {
                // Regular error response
                console.error('Error Data:', error.response.data);
                const errorMsg = error.response.data?.message || 
                               error.response.data?.error || 
                               `Server error: ${error.response.status}`;
                showToast('error', 'Export Failed', errorMsg);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
            showToast('error', 'Network Error', 'No response from server');
        } else {
            console.error('Request setup error:', error.message);
            showToast('error', 'Export Error', error.message || 'Failed to export');
        }
        
        // 🔴 CRITICAL FIX 4: Try one more approach with FormData
        console.log('Trying FormData approach as last resort...');
        await tryFormDataApproach();
    } finally {
        exportLoading.value = false;
    }
};

// ✅ TRY FORM DATA APPROACH (like returnCollection's import)
const tryFormDataApproach = async () => {
    try {
        const endpoint = selectedReport.value.apiEndpoint;
        const formData = new FormData();
        
        // Append data as FormData
        formData.append('years', filters.years.join(','));
        
        if (selectedReport.value.value === 'by-birthday' && filters.month) {
            formData.append('month', filters.month);
        }
        
        if (selectedReport.value.value === 'point-expiry') {
            if (filters.expiryFrom !== null) {
                formData.append('expiryFrom', filters.expiryFrom.toString());
            }
            if (filters.expiryTo !== null) {
                formData.append('expiryTo', filters.expiryTo.toString());
            }
        }
        
        console.log('Trying FormData with:', Object.fromEntries(formData.entries()));
        
        const response = await api.postExtra(
            endpoint,
            formData,
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        if (response.data instanceof Blob) {
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedReport.value.label}_${filters.years.join('_')}.xlsx`;
            a.click();
            
            showToast('success', 'Export Successful (FormData)', 'File downloaded using FormData');
        }
    } catch (formDataError) {
        console.error('FormData approach also failed:', formDataError);
    }
};

// ✅ DEBUG FUNCTION: Test API directly
const testApiManually = async () => {
    console.log('🧪 Testing API manually...');
    
    try {
        // Test with simplest possible request
        const testBody = { years: ['2024'] };
        
        // Test 1: Regular POST (should work for preview)
        const previewResponse = await api.post('report/gender-report', testBody);
        console.log('✅ Preview POST success:', previewResponse.data);
        
        // Test 2: postExtra with blob
        console.log('Testing postExtra with blob...');
        const exportResponse = await api.postExtra(
            'report/gender-report',
            testBody,
            {
                responseType: 'blob',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        
        console.log('✅ postExtra response received');
        console.log('Response type:', typeof exportResponse.data);
        console.log('Is Blob?', exportResponse.data instanceof Blob);
        console.log('Headers:', exportResponse.headers);
        
        // Try to read the blob
        if (exportResponse.data instanceof Blob) {
            const text = await exportResponse.data.text();
            console.log('Blob first 500 chars:', text.substring(0, 500));
            
            // Check if it's actually HTML error page
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                console.error('⚠️ Server returned HTML error page instead of Excel');
                showToast('error', 'Server Error', 'Server returned HTML error. Check server logs.');
            }
        }
        
    } catch (error) {
        console.error('❌ Manual test failed:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

// Watch for filter changes
let debounceTimer = null;
watch(
    () => [selectedReport.value, filters.years, filters.month, filters.expiryFrom, filters.expiryTo],
    () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        
        // debounceTimer = setTimeout(() => {
        //     if (filters.years && filters.years.length > 0) {
        //         fetchReportData();
        //     } else {
        //         reportData.value = [];
        //     }
        // }, 500);
    },
    { deep: true }
);

// Initialize
onMounted(() => {
    // Set default to current year
    const currentYear = new Date().getFullYear().toString();
    filters.years = [currentYear];
    
    // // Initial fetch
    // setTimeout(() => {
    //     if (filters.years.length > 0) {
    //         fetchReportData();
    //     }
    // }, 300);
    
    // Add test button to window for debugging
    window.testReportApi = testApiManually;
    console.log('🔧 Debug: Call testReportApi() in console to test API manually');
});
</script>

<style scoped>
/* Styles remain the same */
</style>

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

th,
td {
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

    th,
    td {
        padding: 6px 8px;
    }
}
</style>