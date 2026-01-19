<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-1">List Directship Container</div>

                <LoadingPage v-if="loading" :message="'Loading Container Sizes...'" :sub-message="'Fetching container size limits'" />

                <div v-else class="container-grid">
                    <div class="container-card">
                        <div class="container-header">
                            <i class="pi pi-box text-blue-500 text-xl"></i>
                            <h3 class="font-semibold text-gray-800">20ft Container</h3>
                        </div>
                        <div class="container-body">
                            <div class="limit-item">
                                <span class="limit-label">Minimum Limit:</span>
                                <span class="limit-value">{{ adminData.min_container_twenty }}</span>
                            </div>
                            <div class="limit-item">
                                <span class="limit-label">Maximum Limit:</span>
                                <span class="limit-value">{{ adminData.max_container_twenty }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 40ft Container Card -->
                    <div class="container-card">
                        <div class="container-header">
                            <i class="pi pi-box text-green-500 text-xl"></i>
                            <h3 class="font-semibold text-gray-800">40ft Container</h3>
                        </div>
                        <div class="container-body">
                            <div class="limit-item">
                                <span class="limit-label">Minimum Limit:</span>
                                <span class="limit-value">{{ adminData.min_container_forty }}</span>
                            </div>
                            <div class="limit-item">
                                <span class="limit-label">Maximum Limit:</span>
                                <span class="limit-value">{{ adminData.max_container_forty }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-4">
                    <Button v-if="canUpdate" label="Edit Container Size" icon="pi pi-pencil" class="p-button-primary" @click="openEditModal" :disabled="loading" />
                </div>
            </div>
        </div>

        <!-- Edit Dialog -->
        <Dialog v-model:visible="showEditModal" header="Edit Container Size Limits" :modal="true" class="p-fluid" :style="{ width: '50rem' }" :closable="!updating">
            <div v-if="dialogLoading" class="text-center py-8"><i class="pi pi-spinner pi-spin text-2xl mr-2"></i> Loading container data...</div>

            <div v-else class="grid grid-cols-1 gap-6">
                <!-- 20ft Container Section -->
                <div class="section-card">
                    <h4 class="section-title">
                        <i class="pi pi-box text-blue-500 mr-2"></i>
                        20ft Container Limits
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="field">
                            <label for="min_container_twenty" class="field-label">Minimum Limit *</label>
                            <InputNumber id="min_container_twenty" v-model="editForm.min_container_twenty" mode="decimal" :min="0" class="w-full" placeholder="Enter minimum value" />
                        </div>
                        <div class="field">
                            <label for="max_container_twenty" class="field-label">Maximum Limit *</label>
                            <InputNumber id="max_container_twenty" v-model="editForm.max_container_twenty" mode="decimal" :min="0" class="w-full" placeholder="Enter maximum value" />
                        </div>
                    </div>
                </div>

                <!-- 40ft Container Section -->
                <div class="section-card">
                    <h4 class="section-title">
                        <i class="pi pi-box text-green-500 mr-2"></i>
                        40ft Container Limits
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="field">
                            <label for="min_container_forty" class="field-label">Minimum Limit *</label>
                            <InputNumber id="min_container_forty" v-model="editForm.min_container_forty" mode="decimal" :min="0" class="w-full" placeholder="Enter minimum value" />
                        </div>
                        <div class="field">
                            <label for="max_container_forty" class="field-label">Maximum Limit *</label>
                            <InputNumber id="max_container_forty" v-model="editForm.max_container_forty" mode="decimal" :min="0" class="w-full" placeholder="Enter maximum value" />
                        </div>
                    </div>
                </div>

                <!-- Validation Summary -->
                <div v-if="validationErrors.length > 0" class="validation-errors">
                    <div class="flex items-center gap-2 text-red-600 mb-2">
                        <i class="pi pi-exclamation-triangle"></i>
                        <span class="font-semibold">Please fix the following issues:</span>
                    </div>
                    <ul class="list-disc list-inside text-sm text-red-600">
                        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                    </ul>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeEditModal" :disabled="updating" />
                <Button :label="updating ? 'Updating...' : 'Update Limits'" icon="pi pi-check" class="p-button-primary" :disabled="!isFormValid || updating" @click="updateContainerSizes" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Maintenance Mode'));


const toast = useToast();
const loading = ref(false);
const dialogLoading = ref(false);
const updating = ref(false);
const showEditModal = ref(false);

const adminData = reactive({
    max_container_twenty: 0,
    max_container_forty: 0,
    min_container_twenty: 0,
    min_container_forty: 0
});

const editForm = reactive({
    max_container_twenty: null,
    max_container_forty: null,
    min_container_twenty: null,
    min_container_forty: null
});

// Computed Properties
const isFormValid = computed(() => {
    return (
        editForm.min_container_twenty !== null &&
        editForm.max_container_twenty !== null &&
        editForm.min_container_forty !== null &&
        editForm.max_container_forty !== null &&
        editForm.min_container_twenty >= 0 &&
        editForm.max_container_twenty >= 0 &&
        editForm.min_container_forty >= 0 &&
        editForm.max_container_forty >= 0
    );
});

const validationErrors = computed(() => {
    const errors = [];
    if (editForm.min_container_twenty === null) errors.push('20ft minimum limit is required');
    if (editForm.max_container_twenty === null) errors.push('20ft maximum limit is required');
    if (editForm.min_container_forty === null) errors.push('40ft minimum limit is required');
    if (editForm.max_container_forty === null) errors.push('40ft maximum limit is required');

    if (editForm.min_container_twenty !== null && editForm.min_container_twenty < 0) errors.push('20ft minimum limit cannot be negative');
    if (editForm.max_container_twenty !== null && editForm.max_container_twenty < 0) errors.push('20ft maximum limit cannot be negative');
    if (editForm.min_container_forty !== null && editForm.min_container_forty < 0) errors.push('40ft minimum limit cannot be negative');
    if (editForm.max_container_forty !== null && editForm.max_container_forty < 0) errors.push('40ft maximum limit cannot be negative');

    return errors;
});

// Methods
const fetchContainerSizes = async () => {
    loading.value = true;
    try {
        const response = await api.get('maintenance/list-container-size');

        if (response.data.status === 1) {
            Object.assign(adminData, response.data.admin_data);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch container sizes',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error fetching container sizes:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.error || 'An error occurred while fetching container sizes',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const openEditModal = () => {
    showEditModal.value = true;
    dialogLoading.value = true;

    // Copy current values to edit form
    Object.assign(editForm, {
        max_container_twenty: adminData.max_container_twenty,
        max_container_forty: adminData.max_container_forty,
        min_container_twenty: adminData.min_container_twenty,
        min_container_forty: adminData.min_container_forty
    });

    dialogLoading.value = false;
};

const closeEditModal = () => {
    if (!updating.value) {
        showEditModal.value = false;
        // Reset form validation
        Object.assign(editForm, {
            max_container_twenty: null,
            max_container_forty: null,
            min_container_twenty: null,
            min_container_forty: null
        });
    }
};

const updateContainerSizes = async () => {
    updating.value = true;

    try {
        const formData = new FormData();

        // Only include fields that have values (nullable handling)
        if (editForm.max_container_twenty !== null) {
            formData.append('max_container_twenty', editForm.max_container_twenty);
        }
        if (editForm.max_container_forty !== null) {
            formData.append('max_container_forty', editForm.max_container_forty);
        }
        if (editForm.min_container_twenty !== null) {
            formData.append('min_container_twenty', editForm.min_container_twenty);
        }
        if (editForm.min_container_forty !== null) {
            formData.append('min_container_forty', editForm.min_container_forty);
        }

        const response = await api.post('maintenance/update-container-size', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || 'Container size settings updated successfully.',
                life: 3000
            });
            showEditModal.value = false;
            await fetchContainerSizes(); // Refresh data
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error?.message || 'Failed to update container sizes',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error updating container sizes:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.error || 'An error occurred while updating container sizes',
            life: 3000
        });
    } finally {
        updating.value = false;
    }
};

onMounted(fetchContainerSizes);
</script>

<style scoped>
.container-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.container-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.container-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.container-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
}

.container-header h3 {
    margin: 0;
    color: #374151;
}

.container-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.limit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
}

.limit-label {
    font-weight: 500;
    color: #6b7280;
}

.limit-value {
    font-weight: 600;
    color: #1f2937;
    font-size: 1.1rem;
}

.section-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
}

.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    color: #374151;
    font-weight: 600;
}

.field {
    display: flex;
    flex-direction: column;
}

.field-label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.validation-errors {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
}

:deep(.p-inputnumber) {
    width: 100%;
}

:deep(.p-inputnumber-input) {
    width: 100%;
}
</style>
