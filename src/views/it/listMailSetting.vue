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
                    </div>
                </template>
            </Column>

            <!-- Updated Description Column -->
            <Column header="Description" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="description-column-wrapper">
                        <div v-if="data.description" class="description-content">
                            <div class="description-text" v-html="data.description"></div>
                            <Button icon="pi pi-eye" class="p-button-text p-button-xm description-icon-btn" @click="viewFullDescription(data)" :title="'View full description'" />
                        </div>
                        <span v-else class="no-description">No description</span>
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
                        <span class="text-black font-semibold">{{ data.shippingPoint || '-' }}</span>
                    </div>
                </template>
            </Column>

            <Column header="Email Recipients" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center">
                        <Badge class="w-8">{{ data.emails.length }}</Badge>
                        <span class="text-black ml-2">recipient(s)</span>
                        <Button v-if="data.emails.length > 0" icon="pi pi-eye" class="p-button-text p-button-xm" @click="viewEmails(data)" title="View emails" />
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
                        <Button icon="pi pi-pencil" class="p-button-text p-button-primary p-button-sm" @click="editSetting(data)" title="Edit" :disabled="!canUpdate" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Edit Dialog -->
        <Dialog v-model:visible="editDialogVisible" :style="{ width: '700px' }" header="Edit Email Setting" :modal="true" :closable="true" :draggable="false" @hide="cancelEdit">
            <div v-if="editingSetting" class="py-4">
                <div class="space-y-6">
                    <!-- Function (Read-only) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Function</label>
                        <InputText :value="editingSetting.function" class="w-full bg-gray-50" disabled />
                    </div>

                    <!-- Storage Location -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"> Shipping Point (Storage Location)</label>
                        <Dropdown v-model="editForm.storageLocation" :options="storageLocationOptions" optionLabel="label" optionValue="value" placeholder="Select shipping point" class="w-full" disabled />
                    </div>

                    <!-- Description with Text Editor -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"> Description </label>
                        <TipTapEditorDesc v-model="editForm.description" :placeholderDesc="'Enter description...'" :showIconsDesc="true" :showCharacterCountDesc="false" />
                    </div>

                    <!-- Email Recipients -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Email Recipients
                                <span class="text-gray-500 text-xs ml-1">Current: {{ editingSetting.emails.length }} email(s)</span>
                            </label>
                        </div>

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
                            <span v-if="emailObjects.length === 0" class="text-gray-400 italic self-center">No emails added</span>
                        </div>

                        <!-- Multi-Select Dropdown for Users -->
                        <div class="mb-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select Email Recipients</label>
                            <MultiSelect v-model="selectedUsers" :options="availableUsers" optionLabel="displayLabel" optionValue="email" placeholder="Search and select users..." :filter="true" class="w-full">
                                <template #option="slotProps">
                                    <div class="flex items-center">
                                        <i class="pi pi-user text-gray-400 mr-2"></i>
                                        <div>
                                            <div class="font-medium text-gray-800">{{ slotProps.option.fullName }}</div>
                                            <div class="text-xs text-gray-500">{{ slotProps.option.email }}</div>
                                        </div>
                                    </div>
                                </template>
                            </MultiSelect>
                            <div class="flex justify-between mt-2">
                                <span class="text-xs text-gray-500">{{ selectedUsers.length }} user(s) selected</span>
                                <Button label="Add Selected" icon="pi pi-plus" class="p-button-sm p-button-outlined" @click="addSelectedEmails" :disabled="selectedUsers.length === 0" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-2 pt-6 mt-4">
                    <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-sm" @click="cancelEdit" />
                    <Button label="Save Changes" icon="pi pi-check" class="p-button p-button-sm" @click="saveSetting" :disabled="emailObjects.length === 0" :loading="saving" />
                </div>
            </div>
        </Dialog>

        <!-- View Emails Dialog -->
        <Dialog v-model:visible="viewEmailsDialogVisible" :style="{ width: '600px' }" header="Email Recipients" :modal="true" :closable="false">
            <div v-if="viewingSetting" class="py-4">
                <div class="mb-4">
                    <div class="text-lg font-bold text-gray-800 mb-1">{{ viewingSetting.function }}</div>
                    <div class="text-sm text-gray-500">{{ viewingSetting.emails.length }} recipient(s)</div>
                </div>

                <div class="max-h-96 overflow-y-auto">
                    <DataTable :value="viewingSetting.emails" :rows="10" dataKey="email" :rowHover="true" responsiveLayout="scroll" class="rounded-table">
                        <Column header="Email Address" style="min-width: 20rem">
                            <template #body="{ data }">
                                <div class="flex items-center py-2">
                                    <i class="pi pi-user text-gray-400 mr-3"></i>
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-800">{{ data.email }}</div>
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
                    <Button label="Close" icon="pi pi-times" class="p-button-outlined p-button-sm" @click="viewEmailsDialogVisible = false" />
                </div>
            </div>
        </Dialog>

        <!-- Full Description Dialog -->
        <Dialog v-model:visible="descriptionDialogVisible" :style="{ width: '700px' }" header="Description" :modal="true" :closable="false" :draggable="false">
            <div v-if="viewingDescription" class="py-4">
                <div class="mb-4">
                    <div class="text-lg font-bold text-gray-800 mb-1">{{ viewingDescription.function }}</div>
                    <!-- <div class="text-sm text-gray-500">{{ viewingDescription.shippingPoint || 'No shipping point' }}</div> -->
                </div>

                <div class="description-full-view border border-gray-200 rounded-md p-4 bg-gray-50" v-html="viewingDescription.description"></div>

                <div class="flex justify-end pt-4 mt-4">
                    <Button label="Close" icon="pi pi-times" class="p-button-outlined p-button-sm" @click="descriptionDialogVisible = false" />
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
import MultiSelect from 'primevue/multiselect';
import TipTapEditorDesc from '@/components/TipTapEditorDesc.vue';
import { computed } from 'vue';
import { useMenuStore } from '@/store/menu';

export default {
    name: 'MailSettingList',
    components: {
        Badge,
        Dialog,
        Dropdown,
        Textarea,
        MultiSelect,
        TipTapEditorDesc
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
            descriptionDialogVisible: false,
            editingSetting: null,
            viewingSetting: null,
            viewingDescription: null,
            filters1: { global: { value: null, matchMode: 'contains' } },
            // Email editing state
            emailObjects: [],
            selectedUsers: [], // Array of selected email strings
            allUsers: [], // All users from API
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
        },

        // Filter out already selected emails from available users
        availableUsers() {
            if (!this.allUsers.length) return [];

            const selectedEmails = this.emailObjects.map((obj) => obj.email.toLowerCase());

            return this.allUsers.filter((user) => !selectedEmails.includes(user.email.toLowerCase()));
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

        async loadUserList() {
            try {
                const res = await api.get('admin/list-user');
                if (res.data.status === 1) {
                    this.allUsers = res.data.data
                        .filter((user) => user.email && user.email.trim()) // Only users with email
                        .map((user) => ({
                            email: user.email.trim(),
                            fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
                            displayLabel: `${user.first_name || ''} ${user.last_name || ''}`.trim() ? `${user.first_name || ''} ${user.last_name || ''}`.trim() + ` (${user.email})` : user.email
                        }));

                    // Remove duplicates by email
                    const seen = new Set();
                    this.allUsers = this.allUsers.filter((user) => {
                        const email = user.email.toLowerCase();
                        if (seen.has(email)) return false;
                        seen.add(email);
                        return true;
                    });
                }
            } catch (err) {
                console.error('Failed to load user list:', err);
                this.allUsers = [];
            }
        },

        parseEmailString(emailString) {
            if (!emailString) return [];

            return (
                emailString
                    .split(',')
                    .map((item) => {
                        const trimmed = item.trim();
                        // Match pattern: Full Name (email) or just email
                        const match = trimmed.match(/^([^\(]+)\s*\(([^\)]+)\)$/);
                        if (match) {
                            const fullName = match[1].trim();
                            const email = match[2].trim();
                            return { email, fullName };
                        }
                        // If no parentheses, treat entire string as email
                        return { email: trimmed, fullName: trimmed };
                    })
                    .filter((item) => item.email && item.email.length > 0)
                    // Remove duplicates
                    .filter((item, index, self) => index === self.findIndex((t) => t.email.toLowerCase() === item.email.toLowerCase()))
            );
        },

        formatEmailObjects(emailObjects) {
            return emailObjects
                .map((obj) => {
                    return `${obj.email}`;
                })
                .join(', ');
        },

        viewEmails(setting) {
            this.viewingSetting = setting;
            this.viewEmailsDialogVisible = true;
        },

        viewFullDescription(setting) {
            this.viewingDescription = setting;
            this.descriptionDialogVisible = true;
        },

        async editSetting(setting) {
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
            this.selectedUsers = [];

            // Initialize edit form with current values
            this.editForm = {
                storageLocation: setting.shippingPoint !== '-' ? setting.shippingPoint : '',
                description: setting.description || ''
            };

            // Load user list for dropdown
            await this.loadUserList();

            this.editDialogVisible = true;

            this.toast.add({
                severity: 'info',
                summary: 'Edit Mode',
                detail: `Editing ${setting.function}`,
                life: 2000
            });
        },

        addSelectedEmails() {
            if (this.selectedUsers.length === 0) return;

            const newEmails = [];
            this.selectedUsers.forEach((email) => {
                // Find user details from allUsers
                const user = this.allUsers.find((u) => u.email === email);
                if (user) {
                    // Check if email already exists (double-check)
                    const exists = this.emailObjects.some((obj) => obj.email.toLowerCase() === user.email.toLowerCase());

                    if (!exists) {
                        newEmails.push({
                            email: user.email,
                            fullName: user.fullName
                        });
                    }
                }
            });

            // Add all new emails at once
            this.emailObjects.push(...newEmails);

            // Clear selection
            this.selectedUsers = [];
        },

        removeEmail(index) {
            // Remove the email from emailObjects
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

        cancelEdit() {
            this.editDialogVisible = false;
            this.editingSetting = null;
            this.emailObjects = [];
            this.selectedUsers = [];
            this.allUsers = [];
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

:deep(.p-multiselect) {
    .p-multiselect-label {
        padding: 0.5rem 0.75rem;
    }
}

.card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Updated Description Column Styling */
.description-column-wrapper {
    min-height: 60px;
    display: flex;
    align-items: center;
}

.description-content {
    display: flex;
    align-items: flex-start;
    width: 90%;
}

.description-text {
    flex: 1;
    font-size: 1rem;
    line-height: 1.6;
    max-height: 3.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 1.4em;
}

/* List styling for description preview */
.description-text :deep(p) {
    margin: 0 0 0.5em 0;
}

.description-text :deep(ul) {
    list-style-type: disc !important;
    padding-left: 1.5em !important;
    margin: 0.5em 0 !important;
}

.description-text :deep(ol) {
    list-style-type: decimal !important;
    padding-left: 1.5em !important;
    margin: 0.5em 0 !important;
}

.description-text :deep(li) {
    margin: 0.25em 0 !important;
}

.description-text :deep(li > p) {
    margin: 0 !important;
}

.description-icon-btn {
    width: 25px;
    height: 65px;
    padding: 0;
    border-radius: 50%;
    flex-shrink: 0;
}

.description-icon-btn:hover {
    background-color: #f3f4f6 !important;
}

.no-description {
    font-size: 0.875rem;
    color: #9ca3af;
    font-style: italic;
}

/* Email tag styling */
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

/* Description dialog styling */
.description-full-view {
    font-size: 1.2rem;
    line-height: 1.6;
    max-height: 60vh;
    overflow-y: auto;
}

/* List styling for full description view */
.description-full-view :deep(p) {
    margin-bottom: 0.75rem;
}

.description-full-view :deep(ul) {
    list-style-type: disc !important;
    padding-left: 1.5em !important;
    margin-bottom: 0.75rem !important;
}

.description-full-view :deep(ol) {
    list-style-type: decimal !important;
    padding-left: 1.5em !important;
    margin-bottom: 0.75rem !important;
}

.description-full-view :deep(li) {
    margin-bottom: 0.25rem !important;
}

.description-full-view :deep(li > p) {
    margin: 0 !important;
}

/* Ensure editor is properly visible in dialog */
:deep(.tiptap-editor-desc) {
    background: white;
}

:deep(.tiptap-editor-desc .editor-content-desc) {
    background: white;
}
</style>
