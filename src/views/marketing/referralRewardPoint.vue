<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">
                    Referral Reward Point
                </div>

                <!-- Description -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <i class="pi pi-info-circle text-blue-500 text-lg mt-1 mr-3"></i>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">About Referral Reward Points</div>
                            <div class="text-blue-700 text-sm">
                                Update reward points for sign-up rewards for both members (Eten, Toyo Care) 
                                and set the annual referral quota limits.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Current Settings Overview -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Eten Program Card -->
                    <div class="border rounded-lg p-4 bg-white shadow-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <i class="pi pi-user-plus text-white text-lg"></i>
                            </div>
                            <div>
                                <div class="font-bold text-gray-800">Eten Program</div>
                                <div class="text-sm text-gray-600">Member Referral Rewards</div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Points per Referral:</span>
                                <span class="font-bold text-blue-600">{{ currentSettings.eten.points }} pts</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Annual Quota:</span>
                                <span class="font-bold text-green-600">{{ currentSettings.eten.quota }} referrals</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Status:</span>
                                <Tag 
                                    :value="currentSettings.eten.status ? 'Active' : 'Inactive'" 
                                    :severity="currentSettings.eten.status ? 'success' : 'danger'" 
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Toyo Care Program Card -->
                    <div class="border rounded-lg p-4 bg-white shadow-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <i class="pi pi-star text-white text-lg"></i>
                            </div>
                            <div>
                                <div class="font-bold text-gray-800">Toyo Care Program</div>
                                <div class="text-sm text-gray-600">Premium Member Rewards</div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Points per Referral:</span>
                                <span class="font-bold text-blue-600">{{ currentSettings.toyoCare.points }} pts</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Annual Quota:</span>
                                <span class="font-bold text-green-600">{{ currentSettings.toyoCare.quota }} referrals</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Status:</span>
                                <Tag 
                                    :value="currentSettings.toyoCare.status ? 'Active' : 'Inactive'" 
                                    :severity="currentSettings.toyoCare.status ? 'success' : 'danger'" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Form -->
                <div class="border rounded-lg p-6 bg-gray-50">
                    <div class="text-xl font-bold text-gray-800 mb-4">Update Reward Point Settings</div>
                    
                    <div class="grid grid-cols-1 gap-6">
                        <!-- Eten Program Settings -->
                        <div class="border-b pb-4">
                            <div class="flex items-center gap-2 mb-4">
                                <i class="pi pi-user-plus text-blue-500"></i>
                                <div class="font-bold text-gray-800">Eten Program Settings</div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Points per Referral *</label>
                                    <InputNumber 
                                        v-model="form.eten.points" 
                                        mode="decimal" 
                                        :min="0" 
                                        :max="10000"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="0"
                                        placeholder="Enter points"
                                        class="w-full"
                                    />
                                    <div class="text-xs text-gray-500 mt-1">Points awarded for each successful referral</div>
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Annual Quota *</label>
                                    <InputNumber 
                                        v-model="form.eten.quota" 
                                        mode="decimal" 
                                        :min="1" 
                                        :max="100"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="0"
                                        placeholder="Enter quota"
                                        class="w-full"
                                    />
                                    <div class="text-xs text-gray-500 mt-1">Maximum referrals per member per year</div>
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                                    <div class="flex items-center gap-3 mt-2">
                                        <InputSwitch v-model="form.eten.status" />
                                        <span :class="form.eten.status ? 'text-green-600' : 'text-gray-600'">
                                            {{ form.eten.status ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Toyo Care Program Settings -->
                        <div>
                            <div class="flex items-center gap-2 mb-4">
                                <i class="pi pi-star text-green-500"></i>
                                <div class="font-bold text-gray-800">Toyo Care Program Settings</div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Points per Referral *</label>
                                    <InputNumber 
                                        v-model="form.toyoCare.points" 
                                        mode="decimal" 
                                        :min="0" 
                                        :max="10000"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="0"
                                        placeholder="Enter points"
                                        class="w-full"
                                    />
                                    <div class="text-xs text-gray-500 mt-1">Points awarded for each successful referral</div>
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Annual Quota *</label>
                                    <InputNumber 
                                        v-model="form.toyoCare.quota" 
                                        mode="decimal" 
                                        :min="1" 
                                        :max="100"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="0"
                                        placeholder="Enter quota"
                                        class="w-full"
                                    />
                                    <div class="text-xs text-gray-500 mt-1">Maximum referrals per member per year</div>
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                                    <div class="flex items-center gap-3 mt-2">
                                        <InputSwitch v-model="form.toyoCare.status" />
                                        <span :class="form.toyoCare.status ? 'text-green-600' : 'text-gray-600'">
                                            {{ form.toyoCare.status ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Changes -->
                    <div v-if="hasChanges" class="border rounded-lg p-4 bg-white mt-6">
                        <label class="block font-bold text-gray-700 mb-3">Preview Changes</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <!-- Eten Changes -->
                            <div class="space-y-2">
                                <div class="font-semibold text-blue-600">Eten Program</div>
                                <div v-if="form.eten.points !== currentSettings.eten.points" class="flex justify-between">
                                    <span>Points:</span>
                                    <span class="font-mono">
                                        <span class="text-red-500 line-through">{{ currentSettings.eten.points }}</span>
                                        <span class="mx-2">→</span>
                                        <span class="text-green-500">{{ form.eten.points }}</span>
                                    </span>
                                </div>
                                <div v-if="form.eten.quota !== currentSettings.eten.quota" class="flex justify-between">
                                    <span>Quota:</span>
                                    <span class="font-mono">
                                        <span class="text-red-500 line-through">{{ currentSettings.eten.quota }}</span>
                                        <span class="mx-2">→</span>
                                        <span class="text-green-500">{{ form.eten.quota }}</span>
                                    </span>
                                </div>
                                <div v-if="form.eten.status !== currentSettings.eten.status" class="flex justify-between">
                                    <span>Status:</span>
                                    <span class="font-mono">
                                        <span class="text-red-500 line-through">{{ currentSettings.eten.status ? 'Active' : 'Inactive' }}</span>
                                        <span class="mx-2">→</span>
                                        <span class="text-green-500">{{ form.eten.status ? 'Active' : 'Inactive' }}</span>
                                    </span>
                                </div>
                            </div>

                            <!-- Toyo Care Changes -->
                            <div class="space-y-2">
                                <div class="font-semibold text-green-600">Toyo Care Program</div>
                                <div v-if="form.toyoCare.points !== currentSettings.toyoCare.points" class="flex justify-between">
                                    <span>Points:</span>
                                    <span class="font-mono">
                                        <span class="text-red-500 line-through">{{ currentSettings.toyoCare.points }}</span>
                                        <span class="mx-2">→</span>
                                        <span class="text-green-500">{{ form.toyoCare.points }}</span>
                                    </span>
                                </div>
                                <div v-if="form.toyoCare.quota !== currentSettings.toyoCare.quota" class="flex justify-between">
                                    <span>Quota:</span>
                                    <span class="font-mono">
                                        <span class="text-red-500 line-through">{{ currentSettings.toyoCare.quota }}</span>
                                        <span class="mx-2">→</span>
                                        <span class="text-green-500">{{ form.toyoCare.quota }}</span>
                                    </span>
                                </div>
                                <div v-if="form.toyoCare.status !== currentSettings.toyoCare.status" class="flex justify-between">
                                    <span>Status:</span>
                                    <span class="font-mono">
                                        <span class="text-red-500 line-through">{{ currentSettings.toyoCare.status ? 'Active' : 'Inactive' }}</span>
                                        <span class="mx-2">→</span>
                                        <span class="text-green-500">{{ form.toyoCare.status ? 'Active' : 'Inactive' }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-6">
                        <div class="w-32">
                            <Button 
                                label="Reset" 
                                class="w-full p-button-outlined p-button-secondary" 
                                @click="resetForm" 
                                :disabled="!hasChanges"
                            />
                        </div>
                        <div class="w-32">
                            <Button 
                                label="Update" 
                                class="w-full" 
                                :disabled="!hasChanges || !isFormValid"
                                @click="updateSettings" 
                            />
                        </div>
                    </div>
                </div>

                <!-- History Table -->
                <div class="border rounded-lg p-4 bg-white">
                    <label class="block text-xl font-bold text-gray-700 mb-3">Update History</label>
                    <DataTable 
                        :value="updateHistory" 
                        :paginator="true" 
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        dataKey="id" 
                        :rowHover="true"
                        responsiveLayout="scroll"
                    >
                        <Column header="Date & Time" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    <div class="font-semibold text-gray-800">
                                        {{ formatDate(data.timestamp) }}
                                    </div>
                                    <div class="text-gray-500 text-xs">
                                        {{ formatTime(data.timestamp) }}
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column header="Updated By" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-user text-gray-500"></i>
                                    <span class="font-semibold">{{ data.updatedBy }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column header="Program" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.program" 
                                    :severity="data.program === 'Eten' ? 'info' : 'success'" 
                                />
                            </template>
                        </Column>

                        <Column header="Changes" style="min-width: 15rem">
                            <template #body="{ data }">
                                <div class="text-sm space-y-1">
                                    <div v-for="change in data.changes" :key="change.field" class="flex justify-between">
                                        <span class="text-gray-600">{{ change.field }}:</span>
                                        <span class="font-mono">
                                            <span class="text-red-500 line-through text-xs">{{ change.oldValue }}</span>
                                            <span class="mx-1">→</span>
                                            <span class="text-green-500">{{ change.newValue }}</span>
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-4">
                                No update history found.
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// Current settings data
const currentSettings = reactive({
    eten: {
        points: 500,
        quota: 10,
        status: true
    },
    toyoCare: {
        points: 1000,
        quota: 15,
        status: true
    }
});

// Form data
const form = reactive({
    eten: {
        points: 500,
        quota: 10,
        status: true
    },
    toyoCare: {
        points: 1000,
        quota: 15,
        status: true
    }
});

// Update history
const updateHistory = ref([
    {
        id: 1,
        timestamp: new Date('2024-01-15T14:30:00'),
        updatedBy: 'Admin User',
        program: 'Eten',
        changes: [
            { field: 'Points', oldValue: '400', newValue: '500' },
            { field: 'Quota', oldValue: '8', newValue: '10' }
        ]
    },
    {
        id: 2,
        timestamp: new Date('2024-01-10T10:15:00'),
        updatedBy: 'System Admin',
        program: 'Toyo Care',
        changes: [
            { field: 'Points', oldValue: '800', newValue: '1000' }
        ]
    },
    {
        id: 3,
        timestamp: new Date('2024-01-05T16:45:00'),
        updatedBy: 'Admin User',
        program: 'Both',
        changes: [
            { field: 'Eten Status', oldValue: 'Inactive', newValue: 'Active' },
            { field: 'Toyo Care Quota', oldValue: '12', newValue: '15' }
        ]
    }
]);

// Computed properties
const hasChanges = computed(() => {
    return JSON.stringify(form.eten) !== JSON.stringify(currentSettings.eten) ||
           JSON.stringify(form.toyoCare) !== JSON.stringify(currentSettings.toyoCare);
});

const isFormValid = computed(() => {
    return form.eten.points !== null && 
           form.eten.points >= 0 &&
           form.eten.quota !== null && 
           form.eten.quota >= 1 &&
           form.toyoCare.points !== null && 
           form.toyoCare.points >= 0 &&
           form.toyoCare.quota !== null && 
           form.toyoCare.quota >= 1;
});

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const resetForm = () => {
    Object.assign(form.eten, currentSettings.eten);
    Object.assign(form.toyoCare, currentSettings.toyoCare);
};

const updateSettings = () => {
    if (!isFormValid.value) {
        alert('Please fill in all required fields with valid values.');
        return;
    }

    // Create history entry
    const changes = [];
    
    // Check Eten changes
    if (form.eten.points !== currentSettings.eten.points) {
        changes.push({ 
            field: 'Eten Points', 
            oldValue: currentSettings.eten.points.toString(), 
            newValue: form.eten.points.toString() 
        });
    }
    if (form.eten.quota !== currentSettings.eten.quota) {
        changes.push({ 
            field: 'Eten Quota', 
            oldValue: currentSettings.eten.quota.toString(), 
            newValue: form.eten.quota.toString() 
        });
    }
    if (form.eten.status !== currentSettings.eten.status) {
        changes.push({ 
            field: 'Eten Status', 
            oldValue: currentSettings.eten.status ? 'Active' : 'Inactive', 
            newValue: form.eten.status ? 'Active' : 'Inactive' 
        });
    }
    
    // Check Toyo Care changes
    if (form.toyoCare.points !== currentSettings.toyoCare.points) {
        changes.push({ 
            field: 'Toyo Care Points', 
            oldValue: currentSettings.toyoCare.points.toString(), 
            newValue: form.toyoCare.points.toString() 
        });
    }
    if (form.toyoCare.quota !== currentSettings.toyoCare.quota) {
        changes.push({ 
            field: 'Toyo Care Quota', 
            oldValue: currentSettings.toyoCare.quota.toString(), 
            newValue: form.toyoCare.quota.toString() 
        });
    }
    if (form.toyoCare.status !== currentSettings.toyoCare.status) {
        changes.push({ 
            field: 'Toyo Care Status', 
            oldValue: currentSettings.toyoCare.status ? 'Active' : 'Inactive', 
            newValue: form.toyoCare.status ? 'Active' : 'Inactive' 
        });
    }

    if (changes.length > 0) {
        // Determine which program was updated
        const hasEtenChanges = changes.some(change => change.field.includes('Eten'));
        const hasToyoCareChanges = changes.some(change => change.field.includes('Toyo Care'));
        
        const program = hasEtenChanges && hasToyoCareChanges ? 'Both' : 
                      hasEtenChanges ? 'Eten' : 'Toyo Care';

        // Add to history
        updateHistory.value.unshift({
            id: Date.now(),
            timestamp: new Date(),
            updatedBy: 'Current User',
            program: program,
            changes: changes
        });

        // Update current settings
        Object.assign(currentSettings.eten, form.eten);
        Object.assign(currentSettings.toyoCare, form.toyoCare);

        console.log('Settings updated:', currentSettings);
        alert('Referral reward points updated successfully!');
    }
};

// Initialize
onMounted(() => {
    // Load current settings (in real app, this would be an API call)
    console.log('Referral reward points component mounted');
});
</script>