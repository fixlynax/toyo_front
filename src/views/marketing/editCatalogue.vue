<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
     
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Catalogue</div>

                <!-- Type & Birthday -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Type *</label>
                        <Dropdown v-model="catalogue.type" :options="typeOptions" optionLabel="label" optionValue="value" disabled placeholder="Select a type" class="w-full" />
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
                </div>

                <!-- catalogue Form -->
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
                            <InputNumber v-model="catalogue.point3" showButtons min="0" class="w-full" />
                            <small v-if="errors.point3" class="text-red-500">{{ errors.point3 }}</small>
                        </div>
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Catalogue Images <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">1280 × 720 px (max 1MB)</span> </label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="relative">
                            <FileUpload mode="basic" name="image1" accept="image/*" 
                                @select="onImageSelect" 
                                chooseLabel="Change Image" class="w-full" />
                            <div v-if="catalogue.image1URL" class="relative mt-2">
                                <img :src="catalogue.image1URL" alt="Preview 1" class="rounded-lg shadow-md object-cover w-full h-80" />
                                <button @click="removeImage" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600" title="Remove Image">&times;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Buttons -->
                <div class="flex justify-end mt-8 gap-2">
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
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
  id: null,
  title: '',
  description: '',
  purpose: '',
  type: '',
  isBirthday: 'NO',
  sku: '',
  terms: '',
  instruction: '',
  expiry: null,
  quantity: '',
  provider: '',
  valueType: '',
  valueAmount: '',
  point1: 0,
  point2: 0,
  point3: 0,
  image1URL: '',
});

const imageFile = ref(null);

onMounted(async () => {
  await fetchCatalogueDetails();
});

// Fetch catalogue details for pre-filling
const fetchCatalogueDetails = async () => {
  loading.value = true;
  try {
    const catalogueId = route.params.id;
    const response = await api.get(`catalog/details/${catalogueId}`);
    
    if (response.data.status === 1 && response.data.admin_data) {
      const data = response.data.admin_data;
      
      // Map API data to form structure
      catalogue.value = {
        id: data.id,
        title: data.title || '',
        description: data.description || '',
        purpose: data.purpose || '',
        type: data.type || '',
        isBirthday: data.isBirthday === 1 ? 'YES' : 'NO',
        sku: data.sku || '',
        terms: data.terms || '',
        instruction: data.instruction || '',
        expiry: formatDateForCalendar(data.expiry),
        quantity: data.totalqty || '',
        provider: data.provider || '',
        valueType: data.valueType || '',
        valueAmount: data.valueAmount || '',
        point1: data.point1 || 0,
        point2: data.point2 || 0,
        point3: data.point3 || 0,
        image1URL: '',
      };

      // Process image URL
      if (data.imageURL) {
        try {
          const blobUrl = (data.imageURL);
          catalogue.value.image1URL = blobUrl;
        } catch (error) {
          console.error('Error loading catalogue image:', error);
          catalogue.value.image1URL = data.imageURL;
        }
      }
      
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching catalogue details:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load catalogue details',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Convert date from API format (DD-MM-YYYY) to Calendar format
const formatDateForCalendar = (dateString) => {
  if (!dateString) return null;
  try {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

/* File Upload */
const onImageSelect = (event) => {
  const file = event.files[0];
  if (file) {
     if (file.size > 1024 * 1024) {
            toast.add({ severity: 'warn', summary: 'File too large', detail: 'Maximum file size allowed is 1MB', life: 3000 });
            return;
        }
    const reader = new FileReader();
    reader.onload = (e) => (catalogue.value.image1URL = e.target.result);
    reader.readAsDataURL(file);
    imageFile.value = file;
  }
};

const removeImage = () => {
  catalogue.value.image1URL = '';
  imageFile.value = null;
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

  if (!c.type) errors.value.type = 'Type is required';
  if (!c.isBirthday) errors.value.isBirthday = 'Is Birthday is required';
  if (!c.title) errors.value.title = 'Title is required';
  if (!c.description) errors.value.description = 'Description is required';
  if (!c.expiry) errors.value.expiry = 'Expiry date is required';
  if (c.point1 === '' || c.point1 === null) errors.value.point1 = 'Silver point is required';
  if (c.point2 === '' || c.point2 === null) errors.value.point2 = 'Gold point is required';
  if (c.point3 === '' || c.point3 === null) errors.value.point3 = 'Platinum point is required';

  if (c.type === 'ITEM' && !c.sku) errors.value.sku = 'SKU is required';
  if ((c.type === 'EVOUCHER' || c.type === 'ITEM') && (!c.quantity || c.quantity <= 0))
    errors.value.quantity = 'Quantity is required';
  if ((c.type === 'EVOUCHER' || c.type === 'EWALLET') && !c.valueType)
    errors.value.valueType = 'Value Type is required';
  if (c.type === 'EVOUCHER' && (!c.valueAmount || c.valueAmount <= 0))
    errors.value.valueAmount = 'Value Amount is required';

  return Object.keys(errors.value).length === 0;
};

/* Submit using FormData with append */
const submitCatalogue = async () => {
  if (!validateFields()) {
    toast.add({ severity: 'warn', summary: 'Validation', detail: 'Please fix all validation errors', life: 3000 });
    return;
  }

  loading.value = true;
  try {
    const c = catalogue.value;
    const formData = new FormData();

    // Append all required fields using FormData
    formData.append('type', c.type.toUpperCase());
    formData.append('isBirthday', c.isBirthday.toUpperCase());
    if (c.purpose) formData.append('purpose', c.purpose.toUpperCase());
    formData.append('title', c.title);
    formData.append('description', c.description);
    formData.append('expiry', formatDate(c.expiry));
    formData.append('point1', c.point1);
    formData.append('point2', c.point2);
    formData.append('point3', c.point3);

    // Optional or conditional fields
    if (c.terms) formData.append('terms', c.terms);
    if (c.instruction) formData.append('instruction', c.instruction);
    if (c.sku) formData.append('sku', c.sku);
    if (c.quantity) formData.append('quantity', c.quantity);
    if (c.provider) formData.append('provider', c.provider);
    if (c.valueType) formData.append('valueType', c.valueType.toUpperCase());
    if (c.valueAmount) formData.append('valueAmount', c.valueAmount);

    // Handle image - if new image selected, append it; if removed, send empty string
    if (imageFile.value) {
      formData.append('image1', imageFile.value);
    } else if (!catalogue.value.image1URL) {
      // If image was removed, send empty string to delete it
      formData.append('image1', '');
    }

    const response = await api.customRequest({
      method: 'POST',
      url: `/api/catalog/edit/${c.id}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.status === 1) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Catalogue updated successfully', life: 3000 });
      router.push('/marketing/listCatalogue');
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: response.data.error || 'Failed to update catalogue', life: 4000 });
    }
  } catch (error) {
    console.error('API Error:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: response.data.error || 'Failed to update catalogue', life: 4000 });
  } finally {
    loading.value = false;
  }
};
</script>