<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Group</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <!-- Table Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Add Group Button -->
                    <RouterLink to="/it/createGroup">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <!-- Empty / Loading Messages -->
            <template #empty> No User Group found. </template>
            <template #loading> Loading user group data. Please wait. </template>

            <!-- User Group Name -->
            <Column field="usergroup" header="User Group" style="min-width: 20rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailNews" class="hover:underline font-bold">
                        {{ data.usergroup }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Module / Function List -->
            <Column field="modules" header="Module / Function List" style="min-width: 25rem">
                <template #body="{ data }">
                    <span>{{ data.modules.join(', ') }}</span>
                </template>
            </Column>

            <!-- Status -->
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.statusUser === 1 ? 'Active' : 'Suspend'" :severity="data.statusUser === 1 ? 'success' : 'danger'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { ListUserService } from '@/service/ITUser'; // adjust path

export default {
    name: 'UserGroupList',
    data() {
        return {
            listData: [],
            loading: true,
            filters1: {
                global: { value: null, matchMode: 'contains' }
            }
        };
    },
    methods: {
        loadData() {
            ListUserService.getListUser().then((data) => {
                this.listData = data;
                this.loading = false;
            });
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>
