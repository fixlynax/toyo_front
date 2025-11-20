<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Group</div>
        <DataTable :value="listData" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['usergroup', 'modules', 'statusUser']">
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

                    <!-- Right: Create Group Button -->
                    <RouterLink to="/it/createGroup">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No User Group found. </template>
            <template #loading> Loading user group data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="usergroup" header="User Group" style="min-width: 20rem" class="font-bold text-primary-400">
                <template #body="{ data }">
                    <span class="font-bold">{{ data.usergroup }}</span>
                </template>
            </Column>

            <Column field="modules" header="Module / Function List" style="min-width: 25rem">
                <template #body="{ data }">
                    <span :class="{ 'text-red-600': !data.modules }">
                        {{ data.modules || '- No Permissions' }}
                    </span>
                </template>
            </Column>

            <Column field="statusUser" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.statusUser === 1 ? 'Active' : 'Suspend'" :severity="data.statusUser === 1 ? 'success' : 'danger'" />
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editGroup(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteGroup(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';

const router = useRouter();
const listData = ref([]);
const loading = ref(true);

const moduleDialogVisible = ref(false);
const selectedModules = ref([]);

// Open module dialog
function openModuleDialog(modules) {
    selectedModules.value = modules;
    moduleDialogVisible.value = true;
}

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Fetch group data
onMounted(async () => {
    loading.value = true;
    try {
        const res = await api.get('admin/list-function-group');
        const raw = res.data; // <-- fixed

        listData.value = raw.map((group) => ({
            id: group.id,
            usergroup: group.name,
            description: group.description,
            statusUser: group.status ? 1 : 0,
            modules: group.functions.map((f) => f.name).join(', ')
        }));
    } catch (err) {
        console.error('Error fetching groups:', err);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

// Actions
const editGroup = (group) => {
    router.push(`/it/editGroup/${group.id}`);
};

const deleteGroup = (group) => {
    console.log('Deleting group:', group);
};
</script>
