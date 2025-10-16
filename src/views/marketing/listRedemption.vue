<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Details Redemption</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['refno', 'memberName', 'recipientName', 'itemName', 'quantity', 'redemptionDate', 'status']"
        >
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Export & Template Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Update" icon="pi pi-sync" class="p-button-success" />
                        <Button type="button" label="Template" icon="pi pi-download" class="p-button-danger" />
                    </div>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No Redemption data found. </template>
            <template #loading> Loading Redemption data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="refno" header="Ref No" sortable style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailRedemption" class="hover:underline font-bold">
                        {{ data.refno }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="memberName" header="Member Name" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.recipientName }}
                </template>
            </Column>
            
            <Column field="itemName" header="Item Name" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.itemName }}
                </template>
            </Column>
            
            <Column field="quantity" header="Quantity" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.quantity }}
                </template>
            </Column>
            
            <Column field="redemptionDate" header="Redemption Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.redemptionDate }}
                </template>
            </Column>
            
            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="getOverallStatusLabel(data.status)" 
                        :severity="getOverallStatusSeverity(data.status)" 
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListRedeemService } from '@/service/ListRedeem';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListRedeemService.getListRedeemData();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusLabel = (status) => {
    if (status === '0') return 'Pending';
    if (status === '1') return 'Approved';
    if (status === '2') return 'Rejected';
    if (status === 'Shipped') return 'Shipped';
    return 'Unknown';
};

const getOverallStatusSeverity = (status) => {
    if (status === '0') return 'warn';
    if (status === '1') return 'success';
    if (status === '2') return 'danger';
    if (status === 'Shipped') return 'success';
    return 'secondary';
};
</script>