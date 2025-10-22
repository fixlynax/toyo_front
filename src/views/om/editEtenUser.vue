<template>
    <Fluid>
        <!-- Edit User Section -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit User Eten</div>

                <!-- User Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Member Code</label>
                        <InputText disabled v-model="memberDetail.etenUserID" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">First Name</label>
                        <InputText v-model="memberDetail.firstName" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Last Name</label>
                        <InputText v-model="memberDetail.lastName" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Country Code</label>
                        <Dropdown v-model="memberDetail.countryCode" :options="codeOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Mobile Number</label>
                        <InputText v-model="memberDetail.mobileNumber" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Email</label>
                        <InputText v-model="memberDetail.emailAddress" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Password</label>
                        <div class="relative w-full">
                            <!-- Input -->
                            <InputText :type="showPassword ? 'text' : 'password'" v-model="memberDetail.password" class="w-full pr-10" />

                            <!-- Eye toggle button inside input -->
                            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                                <i v-if="showPassword" class="pi pi-eye-slash"></i>
                                <i v-else class="pi pi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 card flex flex-col gap-8 w-full">
            <div>
                <h3 class="text-2xl font-bold text-gray-800 border-b pb-2">🧩 Modules Access</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Checkbox v-model="moduleAccess.marketing" :binary="true" class="mr-2" />
                        <label>Marketing</label>
                    </div>
                    <div>
                        <Checkbox v-model="moduleAccess.technical" :binary="true" class="mr-2" />
                        <label>Technical</label>
                    </div>
                    <div>
                        <Checkbox v-model="moduleAccess.om" :binary="true" class="mr-2" />
                        <label>OM</label>
                    </div>
                    <div>
                        <Checkbox v-model="moduleAccess.scm" :binary="true" class="mr-2" />
                        <label>SCM</label>
                    </div>
                    <div>
                        <Checkbox v-model="moduleAccess.it" :binary="true" class="mr-2" />
                        <label>IT</label>
                    </div>
                    <div>
                        <Checkbox v-model="moduleAccess.billing" :binary="true" class="mr-2" />
                        <label>Billing</label>
                    </div>
                    <div>
                        <Checkbox v-model="moduleAccess.sales" :binary="true" class="mr-2" />
                        <label>Sales</label>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-2 gap-2">
                <div class="w-40">
                    <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                </div>

                <div class="w-40">
                    <RouterLink to="/om/detailUser">
                        <Button label="Update" class="w-full" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';

const memberDetail = ref({
    id: 10,
    etenUserID: 'EU1010',
    countryCode: '60',
    mobileNumber: '1890123456',
    password: 'hashed_pw_10',
    firstName: 'Faizal',
    lastName: 'Rahman',
    emailAddress: 'faizal.rahman@toyotires.com.my',
    gender: 'Male',
    race: 'Malay',
    state: 'Sabah',
    level: 'Silver',
    memberSince: '2025-04-20',
    lastLogin: '2025-08-01 12:05:00',
    allow_warranty: 0,
    allow_order: 1,
    allow_billing: 0,
    allow_sale: 1,
    allow_user: 0,
    activationCode: 'ACT01234',
    isMaster: 0,
    device: 'Windows Laptop',
    platform: 'Web',
    fcmToken: 'fcm_token_10',
    status: 1,
    activated: 1,
    created: '2025-04-20',
    deleted: 0
});

// Fixed computed property with proper mapping
const moduleAccess = computed({
    get() {
        return {
            marketing: memberDetail.value.allow_warranty === 1,
            technical: memberDetail.value.allow_user === 1,
            om: memberDetail.value.allow_order === 1,
            scm: memberDetail.value.allow_billing === 1,
            it: memberDetail.value.allow_sale === 1,
            billing: memberDetail.value.allow_billing === 1,
            sales: memberDetail.value.allow_sale === 1
        };
    },
    set(newValue) {
        // Update the memberDetail values when checkboxes change
        memberDetail.value.allow_warranty = newValue.marketing ? 1 : 0;
        memberDetail.value.allow_user = newValue.technical ? 1 : 0;
        memberDetail.value.allow_order = newValue.om ? 1 : 0;
        memberDetail.value.allow_billing = newValue.scm || newValue.billing ? 1 : 0;
        memberDetail.value.allow_sale = newValue.it || newValue.sales ? 1 : 0;
    }
});

const showPassword = ref(false);
const codeOptions = ref([
    { label: '+60', value: '60' },
    { label: '+65', value: '65' },
    { label: '+66', value: '66' }
    // Add more country codes as needed
]);
</script>