<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 ">List Mail Setting</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu" :expandedRows="expandedRows" @row-toggle="onRowToggle">
            <!-- Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                </div>
            </template>

            <template #empty>No Mail Setting found.</template>
            <template #loading>Loading Mail Setting data. Please wait.</template>

            <!-- Expand Row -->
            <Column :expander="true" headerStyle="width: 3rem" />

            <!-- Function Column -->
            <Column field="function" header="Function" style="min-width: 10rem" class="font-bold">
                <template #body="{ data }">
                    <div class="font-bold text-primary-400">{{ data.function }}</div>
                </template>
            </Column>

            <!-- Platform Column -->
            <Column field="platform" header="Platform" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ data.platform }}</div>
                </template>
            </Column>

            <!-- Shipping Point Column -->
            <Column field="shippingPoint" header="Shipping Point" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ data.shippingPoint }}</div>
                </template>
            </Column>

            <!-- Created Date -->
            <Column field="created" header="Created Date" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ formatDate(data.created) }}</div>
                </template>
            </Column>

            <!-- Last Updated -->
            <Column field="lastUpdated" header="Last Updated" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">{{ formatDate(data.lastUpdated) }}</div>
                </template>
            </Column>

            <!-- Actions -->
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

            <!-- Expanded Row Template -->
            <template #expansion="{ data }">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="text-lg font-bold text-gray-800 mb-4">Email List</div>

                    <!-- Edit Mode -->
                    <div v-if="editingId === data.id" class="mb-4">
                        <div class="font-semibold text-gray-700 mb-2">Edit Email Recipients:</div>
                        <MultiSelect
                            v-model="form.emails"
                            :options="emailOptions"
                            optionLabel="label"
                            optionValue="value"
                            filter
                            placeholder="Select email recipients"
                            display="chip"
                            class="resizable-multiselect min-w-[250px] max-w-[800px] w-full"
                            style="resize: horizontal; overflow: auto; min-height: 42px"
                        />
                        <div class="flex justify-end gap-2 mt-4">
                            <Button label="Save" icon="pi pi-check" class="p-button p-button-sm" @click="saveSetting(data)" />
                            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-button-sm" @click="cancelEdit()" />
                        </div>
                    </div>

                    <!-- Read Mode -->
                    <DataTable v-else :value="getEmailData(data.emails)" :paginator="true" :rows="5" :rowsPerPageOptions="[3, 5, 7, 15, 20, 25, 30, 50]" dataKey="email" :rowHover="true" responsiveLayout="scroll">
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

export default {
    name: 'MailSettingList',
    data() {
        return {
            listData: [],
            loading: true,
            editingId: null,
            expandedRows: {}, // use object keyed by id for automatic expand
            filters1: { global: { value: null, matchMode: 'contains' } },
            form: { emails: [], function: '' },
            emailOptions: []
        };
    },
    methods: {
        async loadData() {
            try {
                this.loading = true;
                const res = await api.get('emailSettings');
                if (res.data.status === 1) {
                    this.listData = res.data.email_settings.map((item) => ({
                        id: item.email_setting_id,
                        function: item.notification_type,
                        platform: 'TC',
                        shippingPoint: item.storage_location || '-',
                        created: item.created_date || '-',
                        lastUpdated: item.last_updated || '-',
                        emails: item.email_addresses ? item.email_addresses.split(',') : []
                    }));

                    // Populate email options dynamically
                    const allEmails = new Set();
                    this.listData.forEach((item) => item.emails.forEach((email) => allEmails.add(email)));
                    this.emailOptions = Array.from(allEmails).map((email) => ({ label: email, value: email }));
                }
            } catch (err) {
                console.error('Failed to load email settings:', err);
            } finally {
                this.loading = false;
            }
        },

        getEmailData(emails) {
            return emails.map((email) => ({ email, status: 1 }));
        },

        editSetting(setting) {
            if (this.editingId) this.cancelEdit();
            this.editingId = setting.id;
            this.form.emails = [...setting.emails];
            this.form.function = setting.function;

            // Automatically expand row being edited
            this.expandedRows = { [setting.id]: true };
        },

        saveSetting() {
            const index = this.listData.findIndex((item) => item.id === this.editingId);
            if (index !== -1) this.listData[index].emails = [...this.form.emails];
            console.log('Saved Mail Setting:', this.listData[index]);
            this.cancelEdit();
        },

        cancelEdit() {
            this.editingId = null;
            this.form.emails = [];
            this.form.function = '';
            this.expandedRows = {}; // collapse all
        },

        onRowToggle(event) {
            if (this.editingId && !event.data) this.cancelEdit();
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
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}
:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
:deep(.p-row-expanded) {
    background-color: #f9fafb !important;
}
:deep(.p-row-editing) {
    background-color: #f0f9ff !important;
}
</style>
