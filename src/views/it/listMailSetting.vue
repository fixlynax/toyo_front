<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Email Settings</div>
        <DataTable 
            :value="listData" 
            :paginator="true" 
            :rows="10" 
            dataKey="notification" 
            :rowHover="true" 
            :loading="loading"
        >
            <!-- Table Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText 
                                v-model="filters1['global'].value" 
                                placeholder="Quick Search" 
                                class="w-full" 
                            />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Add Email Setting Button -->
                    <RouterLink to="/it/createMailSetting">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <!-- Empty / Loading Messages -->
            <template #empty> No Email Settings found. </template>
            <template #loading> Loading email setting data. Please wait. </template>

            <!-- Notification Email Name -->
            <Column class="font-bold" field="notification" header="Notification" style="min-width: 15rem">
                <template #body="{ data }">
                    {{ data.notification }}
                </template>
            </Column>

            <!-- Email Address -->
            <Column field="email" header="Email Address" style="min-width: 20rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
            </Column>

            <!-- Shipping Point -->
            <Column field="shippoint" header="Shipping Point" style="min-width: 15rem">
                <template #body="{ data }">
                    {{ data.shippoint }}
                </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <!-- Edit button -->
                        <Button 
                            icon="pi pi-pencil" 
                            class="p-button-text p-button-info p-button-sm" 
                            @click="editMailSetting(data)" 
                        />
                        <!-- Delete button -->
                        <Button 
                            icon="pi pi-trash" 
                            class="p-button-text p-button-danger p-button-sm" 
                            @click="deleteMailSetting(data)" 
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { listMailSetting } from '@/service/listMail';

export default {
    name: 'MailSettingList',
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
            listMailSetting.getlistMailSetting().then((data) => {
                this.listData = data;
                this.loading = false;
            });
        },
        editMailSetting(mail) {
            this.$router.push('/it/editMailSetting'); 
        },
        deleteMailSetting(mail) {
            console.log('Deleting mail setting:', mail);
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>
