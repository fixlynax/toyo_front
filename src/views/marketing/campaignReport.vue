<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Title -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Campaign Report ({{ selectedReport.label }})</div>

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

                     <!-- ✅ Include Deleted Users Checkbox -->
                            <!-- <div class="flex items-center gap-2 mt-6">
                                <Checkbox v-model="filters.includeDeleted" inputId="includeDeleted" :binary="true" />
                                <label for="includeDeleted" class="text-gray-700 cursor-pointer">Include Deleted Users</label>
                            </div> -->
                        </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 mt-6">
                    <Button label="Clear Filters" class="p-button-primary" @click="clearFilters" />
                    <Button label="Export" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" :disabled="!filters.years || filters.years.length === 0" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref, watch } from 'vue';

// Initialize Toast
const toast = useToast();

// ✅ Report Types with API endpoint mapping
const reportTypes = ref([
    { label: 'Tire Pattern', value: 'by-pattern', apiEndpoint: 'report/tirepattern-report', columnHeader: 'Gender' },
    { label: 'Tire Size', value: 'by-size', apiEndpoint: 'report/tiresize-report', columnHeader: 'Race' },
    { label: 'Vehicle Brand', value: 'by-brand', apiEndpoint: 'report/vehiclebrand-report', columnHeader: 'State' },
    { label: 'Vehicle Type', value: 'by-type', apiEndpoint: 'report/vehicletype-report', columnHeader: 'Age Group' }
]);

// ✅ Selected Report
const selectedReport = ref(reportTypes.value[0]);

// ✅ Filters - Add includeDeleted with default value
const filters = reactive({
    years: [],
    month: null,
    expiryFrom: null,
    expiryTo: null,
    includeDeleted: false // ✅ Default to false (0)
});

// ✅ Report Data
const reportData = ref([]);

// ✅ Loading states
const exportLoading = ref(false);
const loadingData = ref(false);

// ✅ Year Options
const yearOptions = ref([]);

const generateYearOptions = (yearsBack = 10) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < yearsBack; i++) {
        const year = currentYear - i;
        years.push({ label: year.toString(), value: year.toString() });
    }
    yearOptions.value = years;
};

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

// ✅ Clear Filters - Reset includeDeleted to false
const clearFilters = () => {
    filters.years = [];
    filters.month = null;
    filters.expiryFrom = null;
    filters.expiryTo = null;
    filters.includeDeleted = false; // ✅ Reset to false
    reportData.value = [];

    showToast('info', 'Filters Cleared', 'All filters have been reset to default values.');
};

// ✅ Prepare JSON Body for API - Add include_deleted parameter
const prepareRequestBody = () => {
    if (!filters.years || filters.years.length === 0) {
        showToast('warn', 'Years Required', 'Please select at least one year.');
        return null;
    }

    const requestBody = {
        years: filters.years,
        include_deleted: filters.includeDeleted ? 1 : 0 // ✅ Add include_deleted parameter
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

// ✅ EXPORT TO EXCEL - Updated to include include_deleted parameter
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

        // Try with stringified years (like returnCollection does)
        const alternativeBody = {
            years: JSON.stringify(filters.years),
            include_deleted: filters.includeDeleted ? 1 : 0 // ✅ Add include_deleted
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

        // Try different approaches sequentially
        let response;

        // Approach 1: Try with stringified years (like returnCollection)
        try {
            response = await api.postExtra(endpoint, alternativeBody, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error1) {
            // Approach 2: Try with original request body
            response = await api.postExtra(endpoint, requestBody, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Verify we got a blob response
        if (!response.data || !(response.data instanceof Blob)) {
            throw new Error('Server did not return Excel file');
        }

        // Check content type
        const contentType = response.headers['content-type'] || response.data.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        // Create blob
        const blob = new Blob([response.data], { type: contentType });

        // Generate download URL
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Generate filename with include_deleted indicator
        const timestamp = new Date().toISOString().split('T')[0];
        const reportName = selectedReport.value.label.replace(/\s+/g, '_');
        const yearsStr = filters.years.join('_');
        const deletedIndicator = filters.includeDeleted ? '_with_deleted' : '_active_only';

        // Try to get filename from Content-Disposition header
        let filename = `${reportName}_${yearsStr}${deletedIndicator}_${timestamp}.xlsx`;
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
                const errorMsg = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
                showToast('error', 'Export Failed', errorMsg);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
            showToast('error', 'Network Error', 'No response from server');
        } else {
            console.error('Request setup error:', error.message);
            showToast('error', 'Export Error', error.message || 'Failed to export');
        }

        // Try one more approach with FormData
        await tryFormDataApproach();
    } finally {
        exportLoading.value = false;
    }
};

// ✅ TRY FORM DATA APPROACH - Updated to include include_deleted
const tryFormDataApproach = async () => {
    try {
        const endpoint = selectedReport.value.apiEndpoint;
        const formData = new FormData();

        // Append data as FormData
        formData.append('years', filters.years.join(','));
        formData.append('include_deleted', filters.includeDeleted ? '1' : '0'); // ✅ Add include_deleted

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
        const response = await api.postExtra(endpoint, formData, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data instanceof Blob) {
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const deletedIndicator = filters.includeDeleted ? '_with_deleted' : '_active_only';
            a.download = `${selectedReport.value.label}_${filters.years.join('_')}${deletedIndicator}.xlsx`;
            a.click();

            showToast('success', 'Export Successful (FormData)', 'File downloaded using FormData');
        }
    } catch (formDataError) {
        console.error('FormData approach also failed:', formDataError);
    }
};

// Watch for filter changes
let debounceTimer = null;
watch(
    () => [selectedReport.value, filters.years, filters.month, filters.expiryFrom, filters.expiryTo, filters.includeDeleted], // ✅ Add includeDeleted to watch
    () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    },
    { deep: true }
);

// Initialize
onMounted(() => {
    generateYearOptions(5);
    const currentYear = new Date().getFullYear().toString();
    filters.years = [currentYear];
    filters.includeDeleted = false; // ✅ Default to false
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
