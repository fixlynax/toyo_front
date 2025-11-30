<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Catalogue</div>

                <!-- Type & Is Birthday -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Type *</label>
                        <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select a type" class="w-full" />
                        <small v-if="errors.type" class="text-red-500">{{ errors.type }}</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Is Birthday? *</label>
                        <Dropdown v-model="catalogue.isBirthday" :options="isBirthdayOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        <small v-if="errors.isBirthday" class="text-red-500">{{ errors.isBirthday }}</small>
                    </div>

                    <!-- Quantity for ITEM and EVOUCHER -->
                    <div v-if="catalogue.type === 'ITEM' || catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Quantity *</label>
                        <InputNumber v-model="catalogue.quantity" placeholder="Enter quantity" class="w-full" :min="1" />
                        <small v-if="errors.quantity" class="text-red-500">{{ errors.quantity }}</small>
                    </div>

                    <!-- Provider for EVOUCHER -->
                    <div v-if="catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Provider</label>
                        <InputText v-model="catalogue.provider" placeholder="Enter provider name" class="w-full" />
                    </div>

                    <!-- Value Type for EVOUCHER and EWALLET -->
                    <div v-if="catalogue.type === 'EVOUCHER' || catalogue.type === 'EWALLET'">
                        <label class="block font-bold text-gray-700 mb-1">Value Type *</label>
                        <Dropdown v-model="catalogue.valueType" :options="valueTypeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        <small v-if="errors.valueType" class="text-red-500">{{ errors.valueType }}</small>
                    </div>

                    <!-- Value Amount for EVOUCHER -->
                    <div v-if="catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Value Amount *</label>
                        <div>
                            <InputNumber v-if="catalogue.valueType !== 'PERCENTAGE'" v-model="catalogue.valueAmount" placeholder="Enter Amount" class="w-full" :min="0" />
                            <div v-else class="flex items-center gap-2">
                                <InputNumber v-model="catalogue.valueAmount" placeholder="Enter Percentage" :min="0" :max="100" class="w-full" />
                                <span class="text-gray-600">%</span>
                            </div>
                        </div>
                        <small v-if="errors.valueAmount" class="text-red-500">{{ errors.valueAmount }}</small>
                    </div>

                    <!-- Download Template Button for EWALLET -->
                    <div v-if="catalogue.type === 'EWALLET'" class="md:col-span-2">
                        <div class="flex items-center gap-4 mb-2">
                            <label class="block font-bold text-gray-700">Download Empty Template</label>
                            <Button 
                                label="Download Excel Template" 
                                icon="pi pi-download" 
                                class="p-button-outlined p-button-sm"
                                @click="downloadEmptyTemplate"
                                :loading="downloadingTemplate"
                            />
                        </div>
                        <small class="text-gray-500">Download the template file and fill in the required columns before uploading</small>
                    </div>

                    <!-- E-Wallet File Upload -->
                    <div v-if="catalogue.type === 'EWALLET'" class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-1">E-Wallet PIN File *</label>
                        <FileUpload mode="basic" name="ewallet_pin_file" accept=".xlsx,.xls" 
                            :chooseLabel="'Upload Excel File'" class="w-full" 
                            @select="onEwalletFileSelect" />
                        <small class="text-gray-500">Upload Excel file with provider, pincode, value, and expiry columns</small>
                        <small v-if="errors.ewallet_pin_file" class="text-red-500">{{ errors.ewallet_pin_file }}</small>
                    </div>
                </div>

                <!-- Catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Purpose To & Expiry -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Purpose To</label>
                            <Dropdown v-model="catalogue.purpose" :options="purposeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Expiry *</label>
                            <Calendar v-model="catalogue.expiry" dateFormat="dd-mm-yy" showIcon class="w-full" />
                            <small v-if="errors.expiry" class="text-red-500">{{ errors.expiry }}</small>
                        </div>
                    </div>
                    
                    <!-- Title -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Title *</label>
                        <InputText v-model="catalogue.title" class="w-full" />
                        <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
                    </div>

                    <!-- SKU - Only for ITEM type -->
                    <div v-if="catalogue.type === 'ITEM'">
                        <label class="block font-bold text-gray-700 mb-1">SKU *</label>
                        <InputText v-model="catalogue.sku" class="w-full" />
                        <small v-if="errors.sku" class="text-red-500">{{ errors.sku }}</small>
                    </div>
                    <div v-else>
                        <!-- Hidden spacer to maintain layout -->
                        <div class="invisible">
                            <label class="block font-bold text-gray-700 mb-1">SKU</label>
                            <InputText class="w-full" />
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description *</label>
                        <Textarea v-model="catalogue.description" class="w-full" />
                        <small v-if="errors.description" class="text-red-500">{{ errors.description }}</small>
                    </div>

                    <!-- Terms & Instructions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Terms</label>
                            <Textarea v-model="catalogue.terms" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Instruction</label>
                            <Textarea v-model="catalogue.instruction" class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Catalogue Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image1" accept="image/*" 
                                @select="onImageSelect" 
                                chooseLabel="Upload Image" class="w-full" />
                            <img v-if="catalogue.image1URL" :src="catalogue.image1URL" alt="Preview" 
                                class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                        </div>
                    </div>
                </div>

                <!-- Point Configuration for All Types -->
                <div class="card flex flex-col gap-6 w-full mt-8">
                    <div class="text-xl font-bold text-gray-800 border-b pb-2">🏆 Point Configuration *</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Silver *</label>
                            <InputNumber v-model="catalogue.point1" showButtons min="0" class="w-full" />
                            <small v-if="errors.point1" class="text-red-500">{{ errors.point1 }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Gold *</label>
                            <InputNumber v-model="catalogue.point2" showButtons min="0" class="w-full" />
                            <small v-if="errors.point2" class="text-red-500">{{ errors.point2 }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Platinum *</label>
                            <InputNumber v-model="catalogue.point3"  showButtons min="0" class="w-full" />
                            <small v-if="errors.point3" class="text-red-500">{{ errors.point3 }}</small>
                        </div>
                    </div>
                </div>
                
                <!-- Submit Buttons for non-survey items -->
                <div  class="flex justify-end mt-8 gap-2">
                    <div class="w-40">
                        <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="submitCatalogue" :loading="loading" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const toast = useToast();
const router = useRouter();
const loading = ref(false);
const downloadingTemplate = ref(false);
const errors = ref({});

// Dropdown options
const typeOptions = [
  { label: 'E-Wallet', value: 'EWALLET' },
  { label: 'E-Voucher', value: 'EVOUCHER' },
  { label: 'Item', value: 'ITEM' },
];

const isBirthdayOptions = [
  { label: 'Yes', value: 'YES' },
  { label: 'No', value: 'NO' },
];

const valueTypeOptions = [
  { label: 'Percentage', value: 'PERCENTAGE' },
  { label: 'Amount', value: 'AMOUNT' },
];

const purposeOptions = [
  { label: 'Catalog', value: 'CATALOG' },
  { label: 'Campaign', value: 'CAMPAIGN' },
  { label: 'Game', value: 'GAME' },
];

// Form data
const catalogue = ref({
  title: '',
  description: '',
  purpose: '',
  type: '',
  isBirthday: 'NO',
  sku: '',
  terms: '',
  instruction: '',
  expiry: null,
  quantity: null,
  provider: '',
  valueType: '',
  valueAmount: null,
  point1: 0,
  point2: 0,
  point3: 0,
  image1URL: '',
});

const imageFiles = ref({});
const ewalletFile = ref(null);

/* File Upload */
const onImageSelect = (event) => {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => (catalogue.value.image1URL = e.target.result);
    reader.readAsDataURL(file);
    imageFiles.value.image1 = file;
  }
};

const onEwalletFileSelect = (event) => {
  const file = event.files[0];
  if (file) ewalletFile.value = file;
};

/* Download Empty Template */
const downloadEmptyTemplate = async () => {
  downloadingTemplate.value = true;
  try {
    const response = await api.customRequest({
      method: 'GET',
      url: '/api/catalog/emptyPinTemplate',
      responseType: 'blob' // Important for file downloads
    });

    // Create a blob from the response data
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ewallet-pin-template.xlsx');
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
    
    toast.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Template downloaded successfully', 
      life: 3000 
    });
  } catch (error) {
    console.error('Download Error:', error);
    const message = error.response?.data?.message || 'Failed to download template';
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: message, 
      life: 4000 
    });
  } finally {
    downloadingTemplate.value = false;
  }
};

/* Format Date -> backend expects d-m-Y */
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
};

/* Validation */
const validateFields = () => {
  errors.value = {};
  const c = catalogue.value;

  // Required fields for all types
  if (!c.type) errors.value.type = 'Type is required';
  if (!c.isBirthday) errors.value.isBirthday = 'Is Birthday is required';
  if (!c.title) errors.value.title = 'Title is required';
  if (!c.description) errors.value.description = 'Description is required';
  if (!c.expiry) errors.value.expiry = 'Expiry date is required';
  
  // Point validation
  if (c.point1 === '' || c.point1 === null || c.point1 < 0) errors.value.point1 = 'Silver point is required and must be numeric';
  if (c.point2 === '' || c.point2 === null || c.point2 < 0) errors.value.point2 = 'Gold point is required and must be numeric';
  if (c.point3 === '' || c.point3 === null || c.point3 < 0) errors.value.point3 = 'Platinum point is required and must be numeric';

  // Conditional validations based on type
  if (c.type === 'ITEM') {
    if (!c.sku) errors.value.sku = 'SKU is required for ITEM type';
    if (!c.quantity || c.quantity <= 0) errors.value.quantity = 'Quantity is required for ITEM type';
  }

  if (c.type === 'EVOUCHER') {
    if (!c.quantity || c.quantity <= 0) errors.value.quantity = 'Quantity is required for EVOUCHER type';
    if (!c.valueType) errors.value.valueType = 'Value Type is required for EVOUCHER type';
    if (!c.valueAmount || c.valueAmount <= 0) errors.value.valueAmount = 'Value Amount is required for EVOUCHER type';
  }

  if (c.type === 'EWALLET') {
    if (!c.valueType) errors.value.valueType = 'Value Type is required for EWALLET type';
    if (!ewalletFile.value) errors.value.ewallet_pin_file = 'E-Wallet PIN file is required for EWALLET type';
  }

  return Object.keys(errors.value).length === 0;
};

/* Submit */
const submitCatalogue = async () => {
  if (!validateFields()) {
    toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fix all validation errors', life: 3000 });
    return;
  }

  loading.value = true;
  try {
    const c = catalogue.value;
    const formData = new FormData();

    // Required fields for all types
    formData.append('type', c.type);
    formData.append('isBirthday', c.isBirthday);
    formData.append('title', c.title);
    formData.append('description', c.description);
    formData.append('expiry', formatDate(c.expiry));
    formData.append('point1', c.point1);
    formData.append('point2', c.point2);
    formData.append('point3', c.point3);

    // Optional fields
    if (c.purpose) formData.append('purpose', c.purpose);
    if (c.terms) formData.append('terms', c.terms);
    if (c.instruction) formData.append('instruction', c.instruction);

    // Conditional fields
    if (c.type === 'ITEM' && c.sku) formData.append('sku', c.sku);
    if ((c.type === 'EVOUCHER' || c.type === 'ITEM') && c.quantity) formData.append('quantity', c.quantity);
    if (c.type === 'EVOUCHER' && c.provider) formData.append('provider', c.provider);
    if ((c.type === 'EVOUCHER' || c.type === 'EWALLET') && c.valueType) formData.append('valueType', c.valueType);
    if (c.type === 'EVOUCHER' && c.valueAmount) formData.append('valueAmount', c.valueAmount);

    // File uploads
    if (imageFiles.value.image1) formData.append('image1', imageFiles.value.image1);
    if (c.type === 'EWALLET' && ewalletFile.value) {
      formData.append('ewallet_pin_file', ewalletFile.value);
    }

    const response = await api.customRequest({
      method: 'POST',
      url: '/api/catalog/create',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.status === 1) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Catalogue created successfully', life: 3000 });
      router.push('/marketing/listCatalogue');
    } else {
      const message = response.data.error
        ? Object.values(response.data.error).flat().join(', ')
        : 'Failed to create catalogue';
      toast.add({ severity: 'error', summary: 'Error', detail: message, life: 4000 });
    }
  } catch (error) {
    console.error('API Error:', error);
    const message =
      error.response?.data?.message ||
      Object.values(error.response?.data?.error || {}).flat().join(', ') ||
      'Unexpected error occurred';
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 4000 });
  } finally {
    loading.value = false;
  }
};
</script>