<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Email Setting</div>

        <DataTable 
            :value="listData" 
            :paginator="true" 
            :rows="10" 
            dataKey="id" 
            :rowHover="true" 
            :loading="loading" 
            :filters="filters1" 
            filterDisplay="menu" 
            :expandedRows="expandedRows" 
            @row-toggle="onRowToggle" 
            class=" rounded-table"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        >
        
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon><i class="pi pi-search" /></InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Search by function, platform, or shipping point..." class="w-full" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8">
                    <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500">No email settings found.</p>
                </div>
            </template>
            <template #loading>
                <div class="flex items-center justify-center py-8">
                    <i class="pi pi-spin pi-spinner text-2xl text-primary-500 mr-3"></i>
                    <span class="text-gray-600">Loading email settings...</span>
                </div>
            </template>

            <Column :expander="true" headerStyle="width: 3rem" />

            <Column field="function" header="Function" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="flex items-center">
                        <span class="font-semibold text-gray-800">{{ data.function }}</span>
                    </div>
                </template>
            </Column>

            <Column field="platform" header="Platform" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <Badge value="TC" severity="info" class="font-medium" />
                </template>
            </Column>

            <Column field="shippingPoint" header="Shipping Point" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <div class="flex items-center">
                        <i class="pi pi-map-marker text-gray-400 mr-2"></i>
                        <span class="text-gray-700">{{ data.shippingPoint || 'Not specified' }}</span>
                    </div>
                </template>
            </Column>

            <Column header="Timestamp" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <div class="space-y-1">
                        <div class="flex items-start">
                            <i class="pi pi-calendar-plus text-green-500 mt-1 mr-2 text-sm"></i>
                            <div>
                                <div class="text-xs text-gray-500">Created</div>
                                <div class="text-sm font-medium text-gray-800">{{ formatDate(data.created) }}</div>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="pi pi-history text-blue-500 mt-1 mr-2 text-sm"></i>
                            <div>
                                <div class="text-xs text-gray-500">Last Updated</div>
                                <div class="text-sm font-medium text-gray-800">{{ formatDate(data.lastUpdated) }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>

            <Column header="Actions" style="width: 100px">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button v-if="editingId === data.id" icon="pi pi-check" class="p-button-text p-button-success p-button-sm" @click="saveSetting(data)" title="Save" />
                        <Button v-if="editingId === data.id" icon="pi pi-times" class="p-button-text p-button-danger p-button-sm" @click="cancelEdit()" title="Cancel" />
                        <Button v-else icon="pi pi-pencil" class="p-button-text p-button-primary p-button-sm" @click="editSetting(data)" title="Edit" />
                    </div>
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-4">
                    <div class="flex items-center mb-4">
                        <i class="pi pi-users text-lg text-gray-600 mr-2"></i>
                        <div class="text-lg font-bold text-gray-800">Email Recipients</div>
                        <Badge :value="data.emails.length" severity="secondary" class="ml-2" />
                    </div>

                    <div v-if="editingId === data.id">
                        <!-- Email Input with Tags -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2"> Edit Email Recipients </label>

                            <!-- Current Email Tags Display -->
                            <div class="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[3.5rem]">
                                <div v-for="(emailObj, index) in emailObjects" :key="index" class="inline-flex items-center gap-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
                                    <span class="text-gray-700">
                                        {{ emailObj.email }}
                                    </span>
                                    <button type="button" @click="removeEmail(index)" class="ml-1 text-gray-400 hover:text-red-500 focus:outline-none" title="Remove email">
                                        <i class="pi pi-times text-xs"></i>
                                    </button>
                                </div>
                                <span v-if="emailObjects.length === 0" class="text-gray-400 italic self-center"> No emails added </span>
                            </div>

                            <!-- Email Input Form -->
                            <div class="grid grid-cols-1 md:grid-cols-8 gap-4 mb-2">
                                <div class="md:col-span-7">
                                    <InputText v-model="newEmail" placeholder="Enter email address" class="w-full" @keyup.enter="addEmail" ref="emailInput" />
                                </div>
                                <Button label="Add Email" icon="pi pi-plus" class="p-button-sm" @click="addEmail" :disabled="!newEmail.trim()" />
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-end gap-2 pt-4 border-t border-gray-200">
                            <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-sm" @click="cancelEdit()" />
                            <Button label="Save Changes" icon="pi pi-check" class="p-button p-button-sm" @click="saveSetting(data)" :disabled="emailObjects.length === 0" />
                        </div>
                    </div>

                    <!-- Read-only Email List -->
                    <DataTable 
                        v-else :value="getEmailData(data.emails)" 
                        :paginator="true" :rows="5" 
                        :rowsPerPageOptions="[5, 10, 20, 25, 50]" 
                        dataKey="email" 
                        :rowHover="true" 
                        responsiveLayout="scroll" 
                        class="rounded-table" 
                        :alwaysShowPaginator="false"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">
                        <Column header="Email Address" style="min-width: 20rem">
                            <template #body="{ data }">
                                <div class="flex items-center">
                                    <span class="text-black hover:text-primary-800 flex-1">
                                        {{ data.email }}
                                    </span>
                                </div>
                            </template>
                        </Column>

                        <!-- <Column header="Status" style="width: 100px">
                            <template #body="{ data }">
                                <Badge value="Active" severity="success" class="text-xs font-normal" />
                            </template>
                        </Column> -->

                        <template #empty>
                            <div class="text-center py-6">
                                <i class="pi pi-users text-3xl text-gray-300 mb-3"></i>
                                <p class="text-gray-500">No email recipients configured</p>
                                <p class="text-gray-400 text-sm mt-1">Click Edit to add email addresses</p>
                            </div>
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
import Badge from 'primevue/badge';

export default {
    name: 'MailSettingList',
    components: {
        Badge
    },
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
            // Email editing state
            newEmail: '',
            newTag: '',
            emailObjects: []
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
                        emails: this.parseEmailString(item.email_addresses || '')
                    }));

                    this.toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Email settings loaded successfully',
                        life: 2000
                    });
                }
            } catch (err) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load email settings',
                    life: 3000
                });
                console.error('Load error:', err);
            } finally {
                this.loading = false;
            }
        },

        parseEmailString(emailString) {
            if (!emailString) return [];

            return emailString
                .split(',')
                .map((item) => {
                    const trimmed = item.trim();
                    // Match email with optional tag in parentheses
                    const match = trimmed.match(/^([^\(]+?)(?:\s*\((.+)\))?$/);
                    if (match) {
                        const email = match[1].trim();
                        const tag = match[2] ? match[2].trim() : null;
                        return { email, tag };
                    }
                    return { email: trimmed, tag: null };
                })
                .filter((item) => item.email && item.email.length > 0);
        },

        formatEmailObjects(emailObjects) {
            return emailObjects
                .map((obj) => {
                    return obj.tag ? `${obj.email} (${obj.tag})` : obj.email;
                })
                .join(', ');
        },

        getEmailData(emailObjects) {
            return emailObjects;
        },

        editSetting(setting) {
            if (this.editingId) this.cancelEdit();

            this.editingId = setting.id;
            this.emailObjects = JSON.parse(JSON.stringify(setting.emails)); // Deep copy
            this.newEmail = '';
            this.newTag = '';
            this.expandedRows = { [setting.id]: true };

            // Focus on email input
            this.$nextTick(() => {
                if (this.$refs.emailInput) {
                    this.$refs.emailInput.$el.focus();
                }
            });

            this.toast.add({
                severity: 'info',
                summary: 'Edit Mode',
                detail: `Editing ${setting.function}`,
                life: 2000
            });
        },

        addEmail() {
            if (!this.newEmail.trim()) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please enter an email address',
                    life: 2000
                });
                return;
            }

            if (!this.isValidEmail(this.newEmail.trim())) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Invalid Email',
                    detail: 'Please enter a valid email address',
                    life: 2000
                });
                return;
            }

            // Check for duplicate email
            if (this.emailObjects.some((obj) => obj.email.toLowerCase() === this.newEmail.trim().toLowerCase())) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Duplicate',
                    detail: 'This email is already added',
                    life: 2000
                });
                return;
            }

            this.emailObjects.push({
                email: this.newEmail.trim(),
                tag: this.newTag.trim() || null
            });

            // Clear inputs and focus back to email field
            this.newEmail = '';
            this.newTag = '';

            this.$nextTick(() => {
                if (this.$refs.emailInput) {
                    this.$refs.emailInput.$el.focus();
                }
            });
        },

        removeEmail(index) {
            // Remove the email at the specified index
            this.emailObjects.splice(index, 1);
        },

        async saveSetting(row) {
            if (this.emailObjects.length === 0) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please add at least one email address',
                    life: 2000
                });
                return;
            }

            try {
                const emailString = this.formatEmailObjects(this.emailObjects);
                const payload = {
                    email_addresses: emailString,
                    storage_location: row.shippingPoint
                };

                await api.post(`emailSetting/update/${row.id}`, payload);

                // Update local data
                const index = this.listData.findIndex((i) => i.id === row.id);
                if (index !== -1) {
                    this.listData[index].emails = [...this.emailObjects];
                    this.listData[index].lastUpdated = new Date().toISOString();
                }

                this.toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Email settings updated successfully',
                    life: 3000
                });
                this.cancelEdit();
            } catch (err) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save changes',
                    life: 3000
                });
                console.error('Save error:', err);
            }
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        cancelEdit() {
            this.editingId = null;
            this.emailObjects = [];
            this.newEmail = '';
            this.newTag = '';
            this.expandedRows = {};
        },

        onRowToggle(event) {
            if (this.editingId && !event.data) {
                this.toast.add({
                    severity: 'info',
                    summary: 'Edit Cancelled',
                    detail: 'Changes were not saved',
                    life: 2000
                });
                this.cancelEdit();
            }
        },

        formatDate(dateStr) {
            if (!dateStr || dateStr === '-') return '-';

            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return '-';

                return new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(date);
            } catch (error) {
                return '-';
            }
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>

<style scoped lang="scss">
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

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

:deep(.p-datatable .p-row-expanded) {
    background-color: #f8fafc !important;
    border-left: 3px solid #3b82f6;
}

:deep(.p-datatable .p-row-editing) {
    background-color: #eff6ff !important;
}

:deep(.p-badge) {
    font-size: 0.75rem;
    min-width: auto;
    padding: 0.125rem 0.375rem;
}

:deep(.p-column-title) {
    font-weight: 600;
    color: #374151;
}

.card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Custom email tag styling */
.email-tag {
    transition: all 0.2s ease;
}

.email-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.email-tag button:hover {
    color: #ef4444 !important;
}
</style>
