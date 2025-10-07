<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Mail Setting</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <!-- Header -->
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

            <template #empty> No Mail Setting found. </template>
            <template #loading> Loading Mail Setting data. Please wait. </template>

            <!-- Function Column -->
            <Column field="function" header="Function" style="min-width: 10rem">
                <template #body="{ data }">{{ data.function }}</template>
            </Column>

            <!-- Email List -->
            <Column field="emails" header="Email List" style="min-width: 25rem">
                <template #body="{ data }">
                    <div v-if="editingId === data.id">
                        <MultiSelect v-model="form.emails" :options="emailOptions" optionLabel="label" optionValue="value" filter placeholder="Select email recipients" display="chip" class="w-full" />
                    </div>
                    <div v-else class="flex flex-col">
                        <span v-for="(email, index) in data.emails" :key="index">{{ email }}</span>
                    </div>
                </template>
            </Column>

            <!-- Shipping Point - only visible if function === 'Order' -->
            <Column field="shippingPoint" header="Shipping Point" style="min-width: 18rem">
                <template #body="{ data }">
                    <span v-if="data.function === 'Order'">{{ data.shippingPoint }}</span>
                    <span v-else>-</span>
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
                { label: 'johor.teamlead@example.com', value: 'johor.teamlead@example.com' },
                { label: 'johor.manager@example.com', value: 'johor.manager@example.com' },
                { label: 'penang.ops@example.com', value: 'penang.ops@example.com' },
                { label: 'penang.supervisor@example.com', value: 'penang.supervisor@example.com' },
                { label: 'om.hqlead@example.com', value: 'om.hqlead@example.com' },
                { label: 'om.hqmanager@example.com', value: 'om.hqmanager@example.com' },
                { label: 'tech.klang@example.com', value: 'tech.klang@example.com' },
                { label: 'engineer.klang@example.com', value: 'engineer.klang@example.com' },
                { label: 'ctc.warehouse@example.com', value: 'ctc.warehouse@example.com' },
                { label: 'ctc.dispatch@example.com', value: 'ctc.dispatch@example.com' },
                { label: 'om.penang@example.com', value: 'om.penang@example.com' },
                { label: 'opslead.penang@example.com', value: 'opslead.penang@example.com' },
                { label: 'ctc.klang@example.com', value: 'ctc.klang@example.com' },
                { label: 'ctc.manager@example.com', value: 'ctc.manager@example.com' },
                { label: 'tech.hq@example.com', value: 'tech.hq@example.com' },
                { label: 'support.hq@example.com', value: 'support.hq@example.com' },
                { label: 'om.johor@example.com', value: 'om.johor@example.com' },
                { label: 'opsmanager.johor@example.com', value: 'opsmanager.johor@example.com' }
            ]
        };
    },
    methods: {
        loadData() {
            this.listData = [
                { id: 1, function: 'OM', emails: ['klang.ops@example.com', 'klang.manager@example.com'] },
                { id: 2, function: 'CTC', emails: ['johor.ops@example.com', 'johor.manager@example.com'] },
                { id: 3, function: 'Tech', emails: ['penang.ops@example.com', 'penang.supervisor@example.com'] },
                { id: 4, function: 'OM', emails: ['om.johor@example.com', 'opsmanager.johor@example.com'] },
                { id: 5, function: 'CTC', emails: ['ctc.klang@example.com', 'ctc.manager@example.com'] },
                { id: 6, function: 'Tech', emails: ['tech.hq@example.com', 'support.hq@example.com'] },
                { id: 7, function: 'OM', emails: ['om.hqlead@example.com', 'om.hqmanager@example.com'] },
                { id: 8, function: 'Order', shippingPoint: 'PS Penang', emails: ['om.penang@example.com', 'opslead.penang@example.com'] },
                { id: 9, function: 'CTC', emails: ['ctc.warehouse@example.com', 'ctc.dispatch@example.com'] },
                { id: 10, function: 'Tech', emails: ['tech.klang@example.com', 'engineer.klang@example.com'] }
            ];
            this.loading = false;
        },

        editSetting(setting) {
            this.editingId = setting.id;
            this.form.emails = [...setting.emails];
            this.form.function = setting.function;
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
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>
