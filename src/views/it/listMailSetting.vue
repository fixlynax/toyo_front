<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Mail Setting</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu" :expandedRows="expandedRows" @row-toggle="onRowToggle">
            <!-- Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search -->
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

            <template #empty> No Mail Setting found. </template>
            <template #loading> Loading Mail Setting data. Please wait. </template>

            <!-- Expand Row -->
            <Column :expander="true" headerStyle="width: 3rem" />

            <!-- Function Column -->
            <Column field="function" header="Function" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="font-semibold text-gray-800">
                        {{ data.function }}
                    </div>
                </template>
            </Column>

            <!-- Platform Column -->
            <Column field="platform" header="Platform" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="text-gray-700">
                        {{ data.platform }}
                    </div>
                </template>
            </Column>

            <!-- Shipping Point -->
            <Column field="shippingPoint" header="Shipping Point" style="min-width: 18rem">
                <template #body="{ data }">
                    <div class="text-gray-700">
                        <span v-if="data.function === 'Order'">{{ data.shippingPoint }}</span>
                        <span v-else>-</span>
                    </div>
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
                            <Button label="Save" icon="pi pi-check" class="p-button-success p-button-sm" @click="saveSetting(data)" />
                            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-button-sm" @click="cancelEdit()" />
                        </div>
                    </div>

                    <!-- Read Mode -->
                    <DataTable v-else :value="getEmailData(data.emails)" :paginator="true" :rows="5" :rowsPerPageOptions="[3, 5, 7, 15, 20, 25, 30, 50]" dataKey="email" :rowHover="true" responsiveLayout="scroll">
                        <!-- Email Address -->
                        <Column field="email" header="Email Address" style="min-width: 20rem">
                            <template #body="{ data }">
                                <div class="text-blue-600 hover:underline">
                                    <a :href="`mailto:${data.email}`">{{ data.email }}</a>
                                </div>
                            </template>
                        </Column>

                        <!-- Status -->
                        <Column field="status" header="Status" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Tag value="Active" severity="success" />
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
export default {
    name: 'MailSettingList',
    data() {
        return {
            listData: [],
            loading: true,
            editingId: null,
            expandedRows: [],
            filters1: {
                global: { value: null, matchMode: 'contains' }
            },
            form: {
                emails: [],
                function: ''
            },
            emailOptions: [
                { label: 'klang.ops@example.com', value: 'klang.ops@example.com' },
                { label: 'klang.manager@example.com', value: 'klang.manager@example.com' },
                { label: 'johor.ops@example.com', value: 'johor.ops@example.com' },
                { label: 'johor.manager@example.com', value: 'johor.manager@example.com' },
                { label: 'penang.ops@example.com', value: 'penang.ops@example.com' },
                { label: 'penang.supervisor@example.com', value: 'penang.supervisor@example.com' },
                { label: 'tech.hq@example.com', value: 'tech.hq@example.com' },
                { label: 'support.hq@example.com', value: 'support.hq@example.com' },
                { label: 'ctc.klang@example.com', value: 'ctc.klang@example.com' },
                { label: 'ctc.manager@example.com', value: 'ctc.manager@example.com' },
                { label: 'om.penang@example.com', value: 'om.penang@example.com' },
                { label: 'opslead.penang@example.com', value: 'opslead.penang@example.com' },
                { label: 'extra1@example.com', value: 'extra1@example.com' },
                { label: 'extra2@example.com', value: 'extra2@example.com' },
                { label: 'extra3@example.com', value: 'extra3@example.com' },
                { label: 'extra4@example.com', value: 'extra4@example.com' },
                { label: 'extra.person@example.com', value: 'extra.person@example.com' },
                { label: 'extra@example.com', value: 'extra@example.com' }
            ]
        };
    },
    methods: {
        loadData() {
            this.listData = [
                {
                    id: 1,
                    function: 'News',
                    platform: 'TC',
                    emails: ['klang.ops@example.com', 'klang.manager@example.com', 'extra1@example.com', 'extra2@example.com', 'extra3@example.com', 'extra4@example.com']
                },
                { id: 2, function: 'Event', platform: 'eTEN', emails: ['johor.ops@example.com', 'johor.manager@example.com'] },
                { id: 3, function: 'Tech', platform: 'TC', emails: ['penang.ops@example.com', 'penang.supervisor@example.com'] },
                { id: 4, function: 'Campaign', platform: 'TC', emails: ['om.penang@example.com', 'opslead.penang@example.com'] },
                { id: 5, function: 'Game', platform: 'eTEN', emails: ['ctc.klang@example.com', 'ctc.manager@example.com'] },
                { id: 6, function: 'Reward', platform: 'TC', emails: ['tech.hq@example.com', 'support.hq@example.com'] },
                { id: 7, function: 'Warranty', platform: 'TC', emails: ['om.penang@example.com', 'opslead.penang@example.com'] },
                { id: 8, function: 'Order', shippingPoint: 'PS Penang', platform: 'eTEN', emails: ['ctc.klang@example.com', 'ctc.manager@example.com', 'support.hq@example.com', 'extra.person@example.com'] },
                { id: 9, function: 'Return', platform: 'TC', emails: ['ctc.klang@example.com', 'tech.hq@example.com'] },
                { id: 10, function: 'Tech', platform: 'eTEN', emails: ['tech.hq@example.com', 'support.hq@example.com', 'extra@example.com'] }
            ];
            this.loading = false;
        },

        getEmailData(emails) {
            return emails.map((email) => ({
                email: email,
                status: 1
            }));
        },

        editSetting(setting) {
            // Cancel any existing edit first
            if (this.editingId) {
                this.cancelEdit();
            }

            this.editingId = setting.id;
            this.form.emails = [...setting.emails];
            this.form.function = setting.function;

            // Auto expand the row when editing
            this.expandedRows = [setting];
        },

        saveSetting() {
            const index = this.listData.findIndex((item) => item.id === this.editingId);
            if (index !== -1) {
                this.listData[index].emails = [...this.form.emails];
            }
            console.log('Saved Mail Setting:', this.listData[index]);
            this.cancelEdit();
        },

        cancelEdit() {
            this.editingId = null;
            this.form.emails = [];
            this.form.function = '';
            // Keep the row expanded if it was already expanded before editing
            // Or collapse all: this.expandedRows = [];
        },

        onRowToggle(event) {
            // If we're currently editing and user collapses the row, cancel edit
            if (this.editingId && !event.data) {
                this.cancelEdit();
            }
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
