<script setup>
import { ListRedeemService } from '@/service/ListRedeem';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);

// Map status → label
const getOverallStatusLabel = (status) => {
    if (status === '0') return 'Pending';
    if (status === '1') return 'Approved';
    if (status === '2') return 'Rejected';
    if (status === 'Shipped') return 'Shipped';
    return 'Unknown';
};

// Map status → severity
const getOverallStatusSeverity = (status) => {
    if (status === '0') return 'warn';
    if (status === '1') return 'success';
    if (status === '2') return 'danger';
    if (status === 'Shipped') return 'success';
    return 'secondary';
};


// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListRedeemService.getListRedeemData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Details Redemption</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Add eTEN Button -->
                    <RouterLink to="/marketing/createNews">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No News found. </template>
            <template #loading> Loading News data. Please wait. </template>
            <!-- Columns -->
            <Column field="refNo" header="Ref No" style="min-width: 8rem">
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
            <Column field="RedemptionDate" header="Redemption Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.redemptionDate }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
