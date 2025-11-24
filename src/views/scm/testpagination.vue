<template>
  <div class="card">
    <div class="text-2xl font-bold text-gray-800 border-b pb-2">
      List Claim
    </div>
      <!-- Custom Tabs with Counts -->
      <div class="border-b border-gray-200 mb-4">
          <div class="flex space-x-8">
              <button
              v-for="(tab, index) in tabs"
              :key="tab.value"
              @click="changeTab(index)"
              class="px-1 py-3 text-sm font-medium relative transition-colors duration-200"
              :class="[activeTab.value === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
            >
              <div class="flex items-center gap-2">
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </div>
      </div>

      <LoadingPage v-if="loading" message="Loading Warranty Claim List..." />
    <DataTable v-else
      :value="listData"
      :loading="loading"
      dataKey="id"
      :rowHover="true"
      lazy
      paginator
      :rows="perPage"
      :totalRecords="pagination.total"
      @page="onPage"
    >
      <Column field="refNo" header="Ref No" style="min-width: 15rem">
          <template #body="{ data }">
              <RouterLink :to="`/technical/detailWarantyClaim/${data.id}`" class="hover:underline font-bold text-blue-600">
                  {{ data.refNo }}
              </RouterLink>
          </template>
      </Column>
      <Column field="dealerName" header="Dealer" />
      <Column field="claimType" header="Claim Type" />
      <Column field="claim_date" header="Claim Date" style="min-width: 15rem">
          <template #body="{ data }">{{ formatDate(data.claim_date) }}</template>
      </Column>
      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getStatusColor(data.status)" />
        </template>
      </Column>

      <Column field="stage" header="Stage" />
    </DataTable>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/service/api';

const listData = ref([]);
const exportLoading = ref(false);

const activeTab = ref(0);

const tabs = [
    { label: 'Processing', value: 'Processing' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' }
];

const currentPage = ref(1);
const perPage = ref(10);

const pagination = ref({
  total: 0,
});

const loading = ref(false);

// Map backend fields → DataTable fields
const mapBackendData = (data) =>
  data.map((item) => ({
    id: item.claim_id,
    refNo: item.claimRefNo,
    dealerName: item.dealer,
    claimType: item.warrantyType,
    status: item.status,
    stage: item.stage,
    claim_date: item.claim_date,
  }));

// MAIN FETCH FUNCTION (lazy)
const fetchClaims = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.postExtra(
      'warranty_claim2',
      { 
        tab: tabs[activeTab.value].value   
      },
      { params: { page } }
    );

    if (response.data.status === 1) {
      listData.value = mapBackendData(response.data.admin_data);

      pagination.value = {
        total: response.data.pagination.total,
      };

      currentPage.value = page;
    } else {
      listData.value = [];
    }
  } catch (error) {
    console.error(error);
    listData.value = [];
  } finally {
    loading.value = false;
  }
};

// Export functionality
const exportToCSV = () => {
    exportLoading.value = true;

    try {
        // Use filtered data for export
        const exportData = filteredList.value.map((item) => ({
            'Ref No': item.refNo,
            'Dealer Name': item.dealerName,
            'Claim Type': item.claimType,
            'Submission Date': item.submissionDate,
            'Warranty Cert No': item.warrantyRegCertNo,
            Status: item.status,
            Stage: item.stage
        }));

        if (exportData.length === 0) {
            alert('No data to export for the current filter.');
            exportLoading.value = false;
            return;
        }

        // Create CSV content
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map((item) =>
            Object.values(item)
                .map((field) => `"${String(field).replace(/"/g, '""')}"`)
                .join(',')
        );

        const csvContent = [headers, ...rows].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `warranty_claims_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting data. Please try again.');
    } finally {
        exportLoading.value = false;
    }
};
// PrimeVue pagination event
const onPage = (event) => {
  const newPage = event.page + 1; // PrimeVue is 0-based
  fetchClaims(newPage);
};
const changeTab = (index) => {
  activeTab.value = index;
  fetchClaims(1);   // reset to page 1 when switching tabs
};
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
// Status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Processing': return 'info';
    case 'In Progress': return 'warn';
    case 'Completed': return 'success';
    case 'Rejected': return 'danger';
    default: return 'secondary';
  }
};

onMounted(() => {
  fetchClaims();
});
</script>
