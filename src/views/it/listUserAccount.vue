<template>
    <Fluid>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div class="text-2xl font-bold">List User List</div>
            </div>

            <DataTable :value="listData" :loading="loading" :filters="filters" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" filterDisplay="menu" :globalFilterFields="['usergroup', 'description', 'created']" class="rounded-table">
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>

                        <RouterLink to="/it/createGroup">
                            <Button type="button" label="Create" icon="pi pi-plus" />
                        </RouterLink>
                    </div>
                </template>

                <Column field="userlist" header="List User & Role" style="min-width: 20rem">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-primary-400">{{ data.userlist }}</span>
                            <div class="flex gap-2">
                                <Tag :value="data.is_super_admin ? 'Super Admin' : 'User'" :severity="data.is_super_admin ? 'primary' : 'secondary'" />
                                <Tag v-if="data.sales_person" value="Sales" severity="info" />
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="description" header="Description" style="min-width: 20rem">
                    <template #body="{ data }">
                        <span class="">{{ data.description }}</span>
                    </template>
                </Column>

                <Column field="modules" header="Module / Function List" style="min-width: 20rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-eye" class="p-button-text p-button-sm text-blue-600" @click="openModuleDialog(data.modules)" />
                        <span class="ml-2">{{ data.modules.length }} Modules</span>
                    </template>
                </Column>

                <Column field="created" header="Created" style="min-width: 15rem">
                    <template #body="{ data }">
                        {{ data.created }}
                    </template>
                </Column>

                <Column header="Status" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Tag :severity="data.statusUser === 1 ? 'success' : 'danger'" :value="data.statusUser === 1 ? 'Active' : 'Inactive'" />
                    </template>
                </Column>

                <Column header="Action" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <div class="flex gap-2">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteUser(data)" />
                            </div>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="moduleDialogVisible" header="Module List" modal style="width: 60rem">
            <div class="grid grid-cols-2 gap-4 font-semibold border-b pb-2">
                <div>Module</div>
                <div class="text-center">Permission</div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
                <template v-for="(m, i) in selectedModules" :key="i">
                    <div><span class="font-bold">- </span>{{ m.name }}</div>
                    <div class="flex justify-center">
                        <Tag :value="m.write ? 'Write' : 'Read'" :severity="m.write ? 'success' : 'info'" />
                    </div>
                </template>
            </div>
        </Dialog>
    </Fluid>
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

function openModuleDialog(modules) {
    selectedModules.value = modules;
    moduleDialogVisible.value = true;
}

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    loading.value = true;
    try {
        const res = await api.get('admin/list-user-role');
        const raw = res.data.data;

        listData.value = raw.map((item) => ({
            id: item.id,
            userlist: item.name,
            description: item.description,
            is_super_admin: item.is_super_admin ? 1 : 0,
            sales_person: item.is_sales_person ? 1 : 0,
            created: item.created,
            modules: item.permissions.map((p) => ({
                name: p.function_name,
                write: p.is_write
            })),
            statusUser: item.status ? 1 : 0
        }));
    } catch {
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

const editUser = (user) => {
    router.push(`/it/editGroup/${user.id}`);
};

const deleteUser = (user) => {
    console.log('Deleting user:', user);
};
</script>
<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

// Rounded table styles
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

    // For the last row in the table body
    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    // When table is empty
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>
