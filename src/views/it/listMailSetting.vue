<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Email Setting</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters1"
            filterDisplay="menu"
            class="rounded-table"
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

            <Column field="function" header="Function" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="font-bold text-gray-800">{{ data.function }}</span>
                        <span v-if="data.description" class="font-semibold text-ms text-gray-500 mt-1 line-clamp-2">{{ data.description }}</span>
                        <span v-else class="text-xm text-gray-400 italic mt-1">No description</span>
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
                        <i class="pi pi-map-marker text-primary mr-2"></i>
                        <span class="text-black font-semibold">{{ data.shippingPoint || 'Not specified' }}</span>
                    </div>
                </template>
            </Column>

            <Column header="Email Recipients" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center">
                        <i class="pi pi-users text-primary mr-2"></i>
                        <span class="text-gray-700">{{ data.emails.length }} recipient(s)</span>
                        <Button 
                            v-if="data.emails.length > 0"
                            icon="pi pi-eye" 
                            class="p-button-text p-button-sm ml-2"
                            @click="viewEmails(data)"
                            title="View emails"
                        />
                    </div>
                </template>
            </Column>

            <Column header="Timestamp" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <div class="space-y-1">
                        <div class="flex items-start">
                            <i class="pi pi-calendar-plus text-green-500 mt-1 mr-2 text-xm"></i>
                            <div>
                                <div class="text-xs text-gray-500">Created On</div>
                                <div class="text-xm font-semibold text-black">{{ formatDate(data.created) }}</div>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="pi pi-history text-blue-500 mr-2 text-sm mt-3"></i>
                            <div>
                                <div class="text-xs text-gray-500 mt-2">Last Updated</div>
                                <div class="text-xm font-semibold text-gray-800">{{ formatDate(data.lastUpdated) }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>

            <Column header="Action" style="width: 120px">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-pencil" 
                            class="p-button-text p-button-primary p-button-sm" 
                            @click="editSetting(data)" 
                            title="Edit" 
                            :disabled="!canUpdate"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Edit Dialog -->
        <Dialog 
            v-model:visible="editDialogVisible" 
            :style="{ width: '700px' }" 
            header="Edit Email Setting"
            :modal="true"
            :closable="true"
            :draggable="false"
            @hide="cancelEdit"
        >
            <div v-if="editingSetting" class="py-4">
                <div class="space-y-6">
                    <!-- Function (Read-only) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Function</label>
                        <InputText 
                            :value="editingSetting.function" 
                            class="w-full bg-gray-50" 
                            readonly 
                        />
                    </div>

                    <!-- Storage Location -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Shipping Point (Storage Location)
                            <span class="text-gray-500 text-xs ml-1">Current: {{ editingSetting.shippingPoint || 'Not specified' }}</span>
                        </label>
                        <Dropdown 
                            v-model="editForm.storageLocation"
                            :options="storageLocationOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select shipping point"
                            class="w-full"
                            :class="{ 'border-red-300': !editForm.storageLocation }"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Description
                            <span v-if="editingSetting.description" class="text-gray-500 text-xs ml-1">Current: {{ editingSetting.description }}</span>
                            <span v-else class="text-gray-500 text-xs ml-1">Current: No description</span>
                        </label>
                        <Textarea 
                            v-model="editForm.description"
                            :rows="3"
                            class="w-full"
                            placeholder="Enter description..."
                        />
                    </div>

                    <!-- Email Recipients -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Email Recipients
                                <span class="text-gray-500 text-xs ml-1">Current: {{ editingSetting.emails.length }} email(s)</span>
                            </label>
                            <span class="text-xs text-gray-500">Enter email and press Enter or click Add</span>
                        </div>

                        <!-- Current Email Tags Display -->
                        <div class="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[3.5rem]">
                            <div v-for="(emailObj, index) in emailObjects" :key="index" 
                                 class="inline-flex items-center gap-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
                                <span class="text-gray-700">
                                    {{ emailObj.email }}
                                    <span v-if="emailObj.tag" class="text-gray-500 text-xs">({{ emailObj.tag }})</span>
                                </span>
                                <button type="button" @click="removeEmail(index)" 
                                        class="ml-1 text-gray-400 hover:text-red-500 focus:outline-none" 
                                        title="Remove email">
                                    <i class="pi pi-times text-xs"></i>
                                </button>
                            </div>
                            <span v-if="emailObjects.length === 0" class="text-gray-400 italic self-center">No emails added</span>
                        </div>

                        <!-- Email Input Form -->
                        <div class="grid grid-cols-1 md:grid-cols-8 gap-4 mb-2">
                            <div class="md:col-span-7">
                                <InputText 
                                    v-model="newEmail" 
                                    placeholder="Enter email address" 
                                    class="w-full" 
                                    @keyup.enter="addEmail" 
                                    ref="emailInput" 
                                />
                            </div>
                            <Button 
                                label="Add" 
                                icon="pi pi-plus" 
                                class="p-button-sm" 
                                @click="addEmail" 
                                :disabled="!newEmail.trim()" 
                            />
                        </div>
                        <div v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-2 pt-6 mt-4">
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        class="p-button-outlined p-button-sm" 
                        @click="cancelEdit" 
                    />
                    <Button 
                        label="Save Changes" 
                        icon="pi pi-check" 
                        class="p-button p-button-sm" 
                        @click="saveSetting" 
                        :disabled="emailObjects.length === 0 || !editForm.storageLocation"
                        :loading="saving"
                    />
                </div>
            </div>
        </Dialog>

        <!-- View Emails Dialog -->
        <Dialog 
            v-model:visible="viewEmailsDialogVisible" 
            :style="{ width: '500px' }" 
            header="Email Recipients"
            :modal="true"
            :closable="true"
        >
            <div v-if="viewingSetting" class="py-4">
                <div class="mb-4">
                    <div class="text-lg font-semibold text-gray-800 mb-1">{{ viewingSetting.function }}</div>
                    <div class="text-sm text-gray-500">{{ viewingSetting.emails.length }} recipient(s)</div>
                </div>
                
                <div class="max-h-96 overflow-y-auto">
                    <DataTable
                        :value="viewingSetting.emails"
                        :rows="10"
                        dataKey="email"
                        :rowHover="true"
                        responsiveLayout="scroll"
                        class="rounded-table"
                    >
                        <Column header="Email Address" style="min-width: 20rem">
                            <template #body="{ data }">
                                <div class="flex items-center py-2">
                                    <i class="pi pi-envelope text-gray-400 mr-3"></i>
                                    <div class="flex-1">
                                        <div class="text-gray-800">{{ data.email }}</div>
                                        <div v-if="data.tag" class="text-xs text-gray-500 mt-1">
                                            Tag: {{ data.tag }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center py-6">
                                <i class="pi pi-users text-3xl text-gray-300 mb-3"></i>
                                <p class="text-gray-500">No email recipients configured</p>
                            </div>
                        </template>
                    </DataTable>
                </div>
                
                <div class="flex justify-end pt-4 border-t border-gray-200 mt-4">
                    <Button 
                        label="Close" 
                        icon="pi pi-times" 
                        class="p-button-outlined p-button-sm" 
                        @click="viewEmailsDialogVisible = false" 
                    />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import { computed } from 'vue';
import { useMenuStore } from '@/store/menu';

export default {
    name: 'MailSettingList',
    components: {
        Badge,
        Dialog,
        Dropdown,
        Textarea
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            listData: [],
            loading: true,
            editDialogVisible: false,
            viewEmailsDialogVisible: false,
            editingSetting: null,
            viewingSetting: null,
            filters1: { global: { value: null, matchMode: 'contains' } },
            // Email editing state
            newEmail: '',
            emailObjects: [],
            emailError: '',
            saving: false,
            // Edit form
            editForm: {
                storageLocation: '',
                description: ''
            },
            // Storage location options
            storageLocationOptions: [
                { label: 'RETP', value: 'RETP' },
                { label: 'TMJB', value: 'TMJB' },
                { label: 'TMSB', value: 'TMSB' },
                { label: 'TMSA', value: 'TMSA' },
                { label: 'TMSK', value: 'TMSK' },
                { label: 'TMDS', value: 'TMDS' }
            ]
        };
    },    
    computed: {  
        canUpdate() {
            const menuStore = useMenuStore();
            return menuStore.canWrite('Email Setting');
        }
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
                        description: item.description || null,
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

        viewEmails(setting) {
            this.viewingSetting = setting;
            this.viewEmailsDialogVisible = true;
        },

        editSetting(setting) {
            if (!this.canUpdate) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Permission Denied',
                    detail: 'You do not have permission to edit email settings',
                    life: 3000
                });
                return;
            }

            this.editingSetting = { ...setting };
            this.emailObjects = JSON.parse(JSON.stringify(setting.emails));
            this.newEmail = '';
            this.emailError = '';
            
            // Initialize edit form with current values
            this.editForm = {
                storageLocation: setting.shippingPoint !== '-' ? setting.shippingPoint : '',
                description: setting.description || ''
            };
            
            this.editDialogVisible = true;

            // Focus on email input after dialog opens
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
            this.emailError = '';
            
            if (!this.newEmail.trim()) {
                this.emailError = 'Please enter an email address';
                return;
            }

            if (!this.isValidEmail(this.newEmail.trim())) {
                this.emailError = 'Please enter a valid email address';
                return;
            }

            // Check for duplicate email
            if (this.emailObjects.some((obj) => obj.email.toLowerCase() === this.newEmail.trim().toLowerCase())) {
                this.emailError = 'This email is already added';
                return;
            }

            this.emailObjects.push({
                email: this.newEmail.trim(),
                tag: null // No tag input in current design
            });

            // Clear input and focus back
            this.newEmail = '';
            this.$nextTick(() => {
                if (this.$refs.emailInput) {
                    this.$refs.emailInput.$el.focus();
                }
            });
        },

        removeEmail(index) {
            this.emailObjects.splice(index, 1);
        },

        async saveSetting() {
            if (this.emailObjects.length === 0) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please add at least one email address',
                    life: 2000
                });
                return;
            }

            if (!this.editForm.storageLocation) {
                this.toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please select a shipping point',
                    life: 2000
                });
                return;
            }

            try {
                this.saving = true;
                const emailString = this.formatEmailObjects(this.emailObjects);
                const payload = {
                    email_addresses: emailString,
                    storage_location: this.editForm.storageLocation,
                    description: this.editForm.description
                };

                await api.post(`emailSetting/update/${this.editingSetting.id}`, payload);

                // Update local data
                const index = this.listData.findIndex((i) => i.id === this.editingSetting.id);
                if (index !== -1) {
                    this.listData[index].emails = [...this.emailObjects];
                    this.listData[index].shippingPoint = this.editForm.storageLocation;
                    this.listData[index].description = this.editForm.description;
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
            } finally {
                this.saving = false;
            }
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        cancelEdit() {
            this.editDialogVisible = false;
            this.editingSetting = null;
            this.emailObjects = [];
            this.newEmail = '';
            this.emailError = '';
            this.editForm = {
                storageLocation: '',
                description: ''
            };
        },

        formatDate(dateStr) {
            if (!dateStr || dateStr === '-') return '-';

            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return '-';

                // Use hour12: true to get AM/PM format
                const formatted = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).format(date);

                // Convert am/pm to uppercase
                return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
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

:deep(.p-dialog) {
    .p-dialog-header {
        border-bottom: 1px solid #e5e7eb;
        padding: 1.25rem 1.5rem;
    }
    
    .p-dialog-content {
        padding: 1.5rem;
    }
    
    .p-dialog-footer {
        border-top: 1px solid #e5e7eb;
        padding: 1rem 1.5rem;
    }
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

/* Line clamp for description text */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>