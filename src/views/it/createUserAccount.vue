<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="card flex flex-col gap-6 w-full">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User</div>

        <!-- Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Username -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">User Name</label>
            <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
          </div>

          <!-- Email -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Email</label>
            <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
          </div>

          <!-- Password -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Password</label>
            <InputText 
              v-model="form.password" 
              type="password" 
              placeholder="Enter password" 
              class="w-full" 
            />
          </div>

          <!-- User Role -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">User Role</label>
            <Select
              v-model="form.user_role_id"
              :options="userRoleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select user role"
              class="w-full"
            />
          </div>

          <!-- First Name -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">First Name</label>
            <InputText v-model="form.first_name" placeholder="Enter first name" class="w-full" />
          </div>

          <!-- Last Name -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Last Name</label>
            <InputText v-model="form.last_name" placeholder="Enter last name" class="w-full" />
          </div>

          <!-- Mobile Phone -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Mobile Phone</label>
            <InputText v-model="form.mobilephone" placeholder="Enter mobile phone" class="w-full" />
          </div>

          <!-- Status -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Status</label>
            <Select
              v-model="form.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              class="w-full"
            />
          </div>

          <!-- Description / Role -->
          <div class="md:col-span-2">
            <label class="block font-bold text-gray-700 mb-2">Description / Role</label>
            <Textarea
              v-model="form.role_description"
              rows="3"
              placeholder="Enter description"
              class="w-full"
            />
          </div>

          <!-- Permissions Dropdown (opens dialog) -->
          <div class="md:col-span-2">
            <label class="block font-bold text-gray-700 mb-2">Permissions</label>
            <Select
              v-model="selectedPermissionPlaceholder"
              :options="[]"
              placeholder="Click to set permissions"
              class="w-full"
              @click="permissionsDialogVisible = true"
              readonly
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-8 gap-2">
          <div class="w-32">
            <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
          </div>
          <div class="w-32">
            <Button label="Create" class="w-full p-button" @click="submitForm" />
          </div>
        </div>
      </div>
    </div>

    <!-- Permissions Dialog (unchanged) -->
    <Dialog
      v-model:visible="permissionsDialogVisible"
      header="Set Permissions"
      modal
      :closable="true"
      :focusOnShow="false"
      style="width: 40rem"
    >
      <div class="flex flex-col gap-3">
        <div v-for="perm in permissionOptions" :key="perm.function_id" class="flex items-center gap-6">
          <span class="w-48 font-medium">{{ perm.function_name }}</span>
          <div class="flex gap-6 items-center">
            <!-- None -->
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="permissionState[perm.function_id]"
                :inputId="perm.function_id + '_none'"
                :name="'perm_' + perm.function_id"
                value="none"
              />
              <label :for="perm.function_id + '_none'" class="cursor-pointer text-gray-600">None</label>
            </div>

            <!-- Read -->
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="permissionState[perm.function_id]"
                :inputId="perm.function_id + '_read'"
                :name="'perm_' + perm.function_id"
                value="read"
              />
              <label :for="perm.function_id + '_read'" class="cursor-pointer text-blue-600">Read-Only</label>
            </div>

            <!-- Write -->
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="permissionState[perm.function_id]"
                :inputId="perm.function_id + '_write'"
                :name="'perm_' + perm.function_id"
                value="write"
              />
              <label :for="perm.function_id + '_write'" class="cursor-pointer text-green-600">Read & Write</label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Close" class="p-button-secondary" @click="permissionsDialogVisible = false" />
        </div>
      </template>
    </Dialog>
  </Fluid>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import Password from 'primevue/password';
import Tooltip from 'primevue/tooltip';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const form = ref({
  username: '',
  email: '',
  password: '',
  user_role_id: null,
  first_name: '',
  last_name: '',
  mobilephone: '',
  role_description: '',
  permissions: {},
  status: 1,
  is_super_admin: 0
});

const permissionsDialogVisible = ref(false);
const selectedPermissionPlaceholder = ref(null);
const submitting = ref(false);
const loadingRoles = ref(false);

// Options for dropdowns
const statusOptions = [
  { label: 'Active', value: 1 },
  { label: 'Suspend', value: 0 }
];

// Default user roles - you can customize these based on your system
const defaultUserRoles = [
  { label: 'Marketing Manager', value: 3 },
  { label: 'Content Editor', value: 4 },
  { label: 'Event Coordinator', value: 5 },
  { label: 'Campaign Manager', value: 6 },
  { label: 'Viewer', value: 7 }
];

const userRoleOptions = ref([...defaultUserRoles]);

const permissionOptions = [
  { function_id: 1, function_name: 'Events Management' },
  { function_id: 2, function_name: 'News Management' },
  { function_id: 3, function_name: 'Campaign Management' },
  { function_id: 4, function_name: 'Game Management' },
  { function_id: 5, function_name: 'Content Management' }
];

// Initialize permission state with 'none' for each permission
const permissionState = reactive({});
permissionOptions.forEach(p => {
  permissionState[p.function_id] = 'none';
});

// Computed properties
const getActivePermissionsCount = computed(() => {
  return Object.values(permissionState).filter(val => val !== 'none').length;
});

const getSelectedPermissionsCount = computed(() => {
  const activeCount = getActivePermissionsCount.value;
  return `${activeCount} of ${permissionOptions.length} permissions selected`;
});

// Fetch user roles from API - with multiple fallback options
const fetchUserRoles = async () => {
  loadingRoles.value = true;
  try {
    // Try multiple possible endpoints
    const possibleEndpoints = [
      'admin/user-roles',
      'admin/roles',
      'user-roles',
      'roles',
      'admin/get-roles'
    ];

    let rolesResponse = null;
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        rolesResponse = await api.get(endpoint);
        if (rolesResponse.data && (rolesResponse.data.length > 0 || rolesResponse.data.data)) {
          console.log(`Success with endpoint: ${endpoint}`, rolesResponse.data);
          break;
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error.message);
        continue;
      }
    }

    if (rolesResponse && rolesResponse.data) {
      // Handle different response formats
      let rolesData = rolesResponse.data;
      
      // If data is nested in a data property
      if (rolesResponse.data.data && Array.isArray(rolesResponse.data.data)) {
        rolesData = rolesResponse.data.data;
      }
      
      // If data has a status property and data inside
      if (rolesResponse.data.status && rolesResponse.data.data) {
        rolesData = rolesResponse.data.data;
      }

      if (Array.isArray(rolesData) && rolesData.length > 0) {
        userRoleOptions.value = rolesData.map(role => ({
          label: role.name || role.label || role.role_name || `Role ${role.id}`,
          value: role.id || role.value
        }));
        
        toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `Loaded ${userRoleOptions.value.length} user roles`, 
          life: 3000 
        });
      } else {
        throw new Error('No roles data found in response');
      }
    } else {
      throw new Error('No response from roles API');
    }
  } catch (error) {
    console.error('Error fetching user roles:', error);
    
    // Use default roles as fallback
    userRoleOptions.value = [...defaultUserRoles];
    
    toast.add({ 
      severity: 'warn', 
      summary: 'Using Default Roles', 
      detail: 'Could not load roles from server. Using default roles instead.', 
      life: 5000 
    });
  } finally {
    loadingRoles.value = false;
  }
};

// Alternative: Create user roles manually based on common roles
const createManualUserRoles = () => {
  return [
    { label: 'Super Administrator', value: 1 },
    { label: 'Administrator', value: 2 },
    { label: 'Marketing Manager', value: 3 },
    { label: 'Content Editor', value: 4 },
    { label: 'Event Coordinator', value: 5 },
    { label: 'Campaign Manager', value: 6 },
    { label: 'Viewer', value: 7 }
  ];
};

// Watch reactive state and sync with form.permissions
watch(
  permissionState,
  (newVal) => {
    Object.keys(newVal).forEach(id => {
      if (newVal[id] === 'read' || newVal[id] === 'write') {
        form.value.permissions[id] = newVal[id];
      } else {
        form.value.permissions[id] = null;
      }
    });
  },
  { deep: true }
);

// Cancel
const cancel = () => router.push('/it/listUserAccount');

// Enhanced validation
const validateForm = () => {
  const errors = [];

  if (!form.value.username) errors.push('Username is required');
  if (!form.value.email) errors.push('Email is required');
  if (!form.value.password) errors.push('Password is required');
  if (!form.value.user_role_id) errors.push('User Role is required');

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.value.email && !emailRegex.test(form.value.email)) {
    errors.push('Please enter a valid email address');
  }

  // Password strength validation
  if (form.value.password && form.value.password.length < 6) {
    errors.push('Password should be at least 6 characters long');
  }

  return errors;
};

// Permission management functions
const setAllPermissions = (type) => {
  permissionOptions.forEach(perm => {
    permissionState[perm.function_id] = type;
  });
};

// Submit
const submitForm = async () => {
  submitting.value = true;
  
  try {
    // Validate required fields
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: validationErrors.join('; '), 
        life: 5000 
      });
      return;
    }

    // Prepare permissions array
    const permissionsArray = permissionOptions.map(perm => {
      const permissionType = form.value.permissions[perm.function_id];
      return {
        function_id: perm.function_id,
        is_write: permissionType === 'write'
      };
    });

    const payload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      user_role_id: form.value.user_role_id,
      first_name: form.value.first_name || '',
      last_name: form.value.last_name || '',
      mobilephone: form.value.mobilephone || '',
      role_description: form.value.role_description || '',
      permissions: permissionsArray,
      status: form.value.status,
      is_super_admin: form.value.is_super_admin
    };

    console.log('Creating user with payload:', JSON.stringify(payload, null, 2));

    const response = await api.post('admin/create-user', payload);
    
    if (response.data.status === 1) {
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `User "${form.value.username}" created successfully!`, 
        life: 5000 
      });
      
      // Optional: Reset form after successful creation
      resetForm();
      
      // Redirect to user list
      setTimeout(() => {
        router.push('/it/listUserAccount');
      }, 1500);
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: response.data.message || 'Failed to create user', 
        life: 4000 
      });
    }
  } catch (err) {
    console.error('Error creating user:', err);
    
    // Handle specific error cases
    if (err.response?.data?.validation_errors) {
      const validationErrors = err.response.data.validation_errors;
      const errorMessages = Object.entries(validationErrors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('; ');
      
      toast.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: errorMessages || 'Please check your input data', 
        life: 6000 
      });
    } else if (err.response?.data?.message) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err.response.data.message, 
        life: 5000 
      });
    } else if (err.code === 'NETWORK_ERROR') {
      toast.add({ 
        severity: 'error', 
        summary: 'Network Error', 
        detail: 'Please check your internet connection', 
        life: 5000 
      });
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Something went wrong while creating the user', 
        life: 5000 
      });
    }
  } finally {
    submitting.value = false;
  }
};

// Reset form function
const resetForm = () => {
  form.value = {
    username: '',
    email: '',
    password: '',
    user_role_id: null,
    first_name: '',
    last_name: '',
    mobilephone: '',
    role_description: '',
    permissions: {},
    status: 1,
    is_super_admin: 0
  };
  
  // Reset permissions
  permissionOptions.forEach(perm => {
    permissionState[perm.function_id] = 'none';
  });
};

// Manual override to set user roles
const loadRolesManually = () => {
  userRoleOptions.value = createManualUserRoles();
  toast.add({ 
    severity: 'info', 
    summary: 'Manual Roles Loaded', 
    detail: 'Using predefined role list', 
    life: 4000 
  });
};

// Fetch user roles when component mounts
onMounted(() => {
  fetchUserRoles();
});
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-radiobutton .p-radiobutton-box) {
  border-radius: 50%;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
  background-color: #3B82F6;
  border-color: #3B82F6;
}

:deep(.p-select) {
  width: 100%;
}
</style>