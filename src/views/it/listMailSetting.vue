<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 ">List Mail Setting</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu" :expandedRows="expandedRows" @row-toggle="onRowToggle">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon><i class="pi pi-search" /></InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                </div>
            </template>

            <template #empty>No Mail Setting found.</template>
            <template #loading>Loading Mail Setting data. Please wait.</template>

            <Column :expander="true" headerStyle="width: 3rem" />

            <Column field="function" header="Function" style="min-width: 10rem" class="font-bold">
                <template #body="{ data }">
                    <div class="font-bold text-primary-400">{{ data.function }}</div>
                </template>
            </Column>

            <Column field="platform" header="Platform" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ data.platform }}</div>
                </template>
            </Column>

            <Column field="shippingPoint" header="Shipping Point" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ data.shippingPoint }}</div>
                </template>
            </Column>

            <Column field="created" header="Created Date" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ formatDate(data.created) }}</div>
                </template>
            </Column>

            <Column field="lastUpdated" header="Last Updated" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ formatDate(data.lastUpdated) }}</div>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <div v-if="editingId === data.id">
                            <Button icon="pi pi-check" class="p-button-text p-button-success p-button-sm" @click="saveSetting(data)" />
                            <Button icon="pi pi-times" class="p-button-text p-button-danger p-button-sm" @click="cancelEdit()" />
                        </div>
                        <div v-else>
                            <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editSetting(data)" />
                        </div>
                    </div>
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Email List</div>

                    <div v-if="editingId === data.id" class="mb-4">
                        <div class="font-semibold text-gray-700 mb-2">Edit Email Recipients:</div>
                        
                        <!-- Changed from MultiSelect to Textarea for comma-separated input -->
                        <Textarea
                            v-model="emailInput"
                            :autoResize="true"
                            rows="3"
                            placeholder="Enter email addresses separated by commas. Example: abc@gmail.com,def@gmail.com,ghi@gmail.com"
                            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <div class="flex justify-end gap-2 mt-4">
                            <Button label="Save" icon="pi pi-check" class="p-button p-button-sm" @click="saveSetting(data)" />
                            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-button-sm" @click="cancelEdit()" />
                        </div>
                    </div>

                    <DataTable
                        v-else
                        :value="getEmailData(data.emails)"
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[3,5,7,15,20,25,30,50]"
                        dataKey="email"
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column field="email" header="Email Address" style="min-width: 20rem">
                            <template #body="{ data }">
                                <div class="text-gray-800 hover:underline">
                                    <a :href="`mailto:${data.email}`">{{ data.email }}</a>
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-4">No email recipients configured.</div>
                        </template>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

export default {
    name: 'MailSettingList',
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            listData: [],
            loading: true,
            editingId: null,
            expandedRows: {},
            filters1: { global: { value: null, matchMode: 'contains' } },
            form: { emails: [], shippingPoint: '' },
            emailInput: '' // New data property for textarea input
        };
    },
    methods: {
        async loadData() {
            try {
                this.loading = true;
                const res = await api.get('emailSettings');
                if (res.data.status === 1) {
                    this.listData = res.data.email_settings.map(item => ({
                        id: item.email_setting_id,
                        function: item.notification_type,
                        platform: 'TC',
                        shippingPoint: item.storage_location || '-',
                        created: item.created_date || '-',
                        lastUpdated: item.last_updated || '-',
                        emails: item.email_addresses ? item.email_addresses.split(',') : []
                    }));

                    this.toast.add({ severity: 'success', summary: 'Loaded', detail: 'Mail settings loaded', life: 2000 });
                }
            } catch (err) {
                this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 2500 });
            } finally {
                this.loading = false;
            }
        },

        getEmailData(emails) {
            return emails.map(email => ({ email }));
        },

        editSetting(setting) {
            if (this.editingId) this.cancelEdit();
            this.editingId = setting.id;
            this.form.emails = [...setting.emails];
            this.form.shippingPoint = setting.shippingPoint;
            // Convert array to comma-separated string for textarea
            this.emailInput = setting.emails.join(', ');
            this.expandedRows = { [setting.id]: true };
            this.toast.add({ severity: 'info', summary: 'Editing', detail: 'Edit mode enabled', life: 2000 });
        },

        async saveSetting(row) {
            try {
                // Parse comma-separated emails, trim whitespace, and filter out empty values
                const emailArray = this.emailInput
                    .split(',')
                    .map(email => email.trim())
                    .filter(email => email.length > 0);
                
                // Validate email format (optional)
                const invalidEmails = emailArray.filter(email => !this.isValidEmail(email));
                if (invalidEmails.length > 0) {
                    this.toast.add({ 
                        severity: 'warn', 
                        summary: 'Warning', 
                        detail: `Invalid email format: ${invalidEmails.join(', ')}`, 
                        life: 3000 
                    });
                    return;
                }

                const payload = {
                    email_addresses: emailArray.join(','),
                    storage_location: this.form.shippingPoint
                };

                await api.post(`emailSetting/update/${row.id}`, payload);

                const index = this.listData.findIndex(i => i.id === row.id);
                if (index !== -1) {
                    this.listData[index].emails = emailArray;
                    this.listData[index].shippingPoint = this.form.shippingPoint;
                }

                this.toast.add({ severity: 'success', summary: 'Saved', detail: 'Mail setting updated successfully', life: 2000 });
                this.cancelEdit();
            } catch (err) {
                this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save', life: 2500 });
            }
        },

        isValidEmail(email) {
            // Simple email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        cancelEdit() {
            this.editingId = null;
            this.form.emails = [];
            this.form.shippingPoint = '';
            this.emailInput = '';
            this.expandedRows = {};
        },

        onRowToggle(event) {
            if (this.editingId && !event.data) {
                this.cancelEdit();
                this.toast.add({ severity: 'info', summary: 'Closed', detail: 'Row collapsed while editing', life: 2000 });
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>

<style scoped lang="scss">
:deep(.p-row-expanded) { background-color: #f9fafb !important; }
:deep(.p-row-editing) { background-color: #f0f9ff !important; }
</style>