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
            <Column class="font-bold" field="usergroup" header="User Group" style="min-width: 20rem">
                <template #body="{ data }">
                    {{ data.usergroup }}
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
            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <!-- Edit button navigates to /it/technical -->
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                        <!-- Delete button -->
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteUser(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script>
import { ListUserService } from '@/service/ITUser';
import { useRouter } from 'vue-router';

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
        },
        editUser(user) {
            this.$router.push('/it/editGroup'); // ✅ use this.$router
        },
        deleteUser(user) {
            console.log('Deleting user:', user);
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>
