<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold border-b pb-2">Referral Report</div>

                <div class="border rounded-lg p-6 bg-gray-50">
                    <div class="text-lg font-bold mb-4">Report Filters</div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label class="font-bold mb-2 block">Start Date *</label>
                            <Calendar v-model="filters.startDate" showIcon dateFormat="yy-mm-dd" :maxDate="maxDate" class="w-full" />
                        </div>

                        <div>
                            <label class="font-bold mb-2 block">End Date *</label>
                            <Calendar v-model="filters.endDate" showIcon dateFormat="yy-mm-dd" :minDate="filters.startDate" :maxDate="maxDate" class="w-full" />
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-6">
                        <span class="text-sm text-gray-600">
                            <span v-if="filters.startDate && filters.endDate"> Selected: {{ formatDate(filters.startDate) }} → {{ formatDate(filters.endDate) }} </span>
                            <span v-else class="text-orange-500"> Please select both dates </span>
                        </span>

                        <div class="flex gap-3">
                            <Button label="Clear" icon="pi pi-refresh" class="p-button-outlined" @click="clearFilters" />

                            <Button label="Generate Preview" icon="pi pi-eye" class="p-button-outlined" :disabled="!filters.startDate || !filters.endDate" @click="fetchPreview" />

                            <Button label="Export Report" icon="pi pi-download" class="p-button-primary" :disabled="!filters.startDate || !filters.endDate" @click="fetchExport" />
                        </div>
                    </div>
                </div>
                <div v-if="showPreview" class="border rounded-lg p-6 bg-white mt-6">
                    <div class="text-lg font-bold mb-4">Referral Preview</div>

                    <DataTable :value="previewData" :rows="5" paginator responsiveLayout="scroll">
                        <Column field="referralcode" header="Referral Code" />
                        <Column field="referralname" header="Referral Name" />
                        <Column field="referredcode" header="Referred Code" />
                        <Column field="referredname" header="Referred Name" />

                        <template #empty>
                            <div class="text-center text-gray-500 py-4">No referral data available</div>
                        </template>
                    </DataTable>

                    <div class="flex justify-end mt-4">
                        <Button label="Close Preview" class="p-button-outlined" @click="showPreview = false" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const previewData = ref([]);
const showPreview = ref(false);
const loading = ref(false);

const maxDate = new Date();

const filters = reactive({
    startDate: null,
    endDate: null
});

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
};

const clearFilters = () => {
    filters.startDate = null;
    filters.endDate = null;
};

const fetchPreview = async () => {
    try {
        loading.value = true;

        const response = await api.postExtra('cares/preview-tc-referral', {
            startDate: filters.startDate,
            endDate: filters.endDate
        });

        // ✅ match backend structure
        previewData.value = response.data?.admin_data || [];
        showPreview.value = true;

        if (!previewData.value.length) {
            toast.add({
                severity: 'info',
                summary: 'No Data',
                detail: 'No records found',
                life: 3000
            });
        }
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load preview',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const fetchExport = async () => {
    try {
        loading.value = true;

        const response = await api.postExtra('excel/export-tc-referral', { ...filters }, { responseType: 'arraybuffer' });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Referral_Report.xlsx';
        a.click();
        URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Export failed', life: 3000 });
    } finally {
        loading.value = false;
    }
};
</script>
