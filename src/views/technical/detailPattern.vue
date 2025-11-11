<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col gap-6">
                <!-- Tyre Specifications -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Pattern Details</h2>
                         <div class="inline-flex items-center gap-2">
                            <Button label="Edit" class="p-button-info" size="small" @click="editPattern" />
                            <Button label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <img 
                            v-if="patterns && patterns.processedImageURL"
                            :src="getImagePath(patterns.processedImageURL)" 
                            alt="Pattern Image" 
                            class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform" 
                            />
                            <div 
                            v-else 
                            class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-400 text-xs"
                            >
                            No Image
                            </div>
                        </div>

                        <template v-if="patterns">
                            <div>
                            <span class="text-sm font-bold text-gray-700">Pattern Code</span>
                            <p class="text-lg font-medium">{{ patterns?.pattern_code || '0'  }}</p>
                            </div>

                            <div>
                            <span class="text-sm font-bold text-gray-700">Pattern Name</span>
                            <p class="text-lg font-medium">{{ patterns?.pattern_name || 'N/A' }}</p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

        </div>
    </Fluid>
    <Dialog v-model:visible="deletePatternDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="patterns"
                >Are you sure you want to delete <b>{{ patterns.pattern_code }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deletePatternDialog = false" />
            <Button label="Yes" icon="pi pi-check" @click="deletePattern" />
        </template>
    </Dialog>
    <Dialog v-model:visible="editPatternDialog" modal header="Edit Pattern Deatails" :style="{ width: '700px' }">
        <div class="flex flex-col gap-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Name *</label>
                            <InputText v-model="formHolder.pattern_name" class="w-full" placeholder="Insert Pattern Name" />
                        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Code *</label>
                            <InputText v-model="formHolder.pattern_code" class="w-full" placeholder="Insert Pattern Code" />
                        <small v-if="errors.code" class="text-red-500">{{ errors.code }}</small>
                    </div>
                </div>

                <!-- Upload Image Section -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Update Pattern Image *</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                        <FileUpload 
                            mode="basic" 
                            name="image_url" 
                            accept="image/*" 
                            :maxFileSize="10000000"
                            :auto="true"
                            :chooseLabel="formHolder.image_url ? 'Change Image' : 'Upload Image'" 
                            class="w-full" 
                            @select="onImageSelect"
                            @remove="removeImage"
                            :invalidFileSizeMessage="'File size should be less than 10MB'"
                        />
                        <small v-if="errors.image" class="text-red-500">{{ errors.image }}</small>

                        <!-- Image preview using formHolder -->
                        <div v-if="formHolder.imageURL || formHolder.image_url" class="relative mt-2">
                            <img 
                                :src="formHolder.imageURL || formHolder.image_url" 
                                alt="Preview" 
                                class="rounded-lg shadow-md object-cover w-full h-60" 
                            />
                            <Button 
                                icon="pi pi-times" 
                                class="p-button-danger p-button-rounded p-button-sm absolute top-2 right-2" 
                                @click="removeImage" 
                            />
                        </div>
                        </div>
                    </div>
                    </div>
            <div class="flex justify-end mt-4">
                <Button label="Save" icon="pi pi-check" class="p-button-success p-button-sm" @click="savePatternEdit" />
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/service/api';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const patterns = ref();
const deletePatternDialog = ref(false);
const editPatternDialog = ref(false);
const formHolder = ref({
  pattern_name: '',
  pattern_code: '',
  image_url: '',
  imageURL: '',
});
const errors = ref({
    name: '',
    image: ''
});

const validateForm = () => {
    let isValid = true;
    errors.value = { name: '', image: '' };

    if (!formHolder.value.pattern_name) {
        errors.value.name = 'Pattern name is required';
        isValid = false;
    }
    if (!formHolder.value.pattern_code) {
        errors.value.name = 'Pattern code is required';
        isValid = false;
    }
    if (!formHolder.value.image_url && (formHolder.value.imageURL != patterns.value.processedImageURL)) {
        errors.value.image = 'Pattern image is required';
        isValid = false;
    }

    return isValid;
};

const onImageSelect = (event) => {
    const file = event.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        errors.value.image = 'Please select a valid image file (JPEG, PNG, etc.)';
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        errors.value.image = 'File size must be less than 10MB';
        return;
    }

    formHolder.value.image_url = file;
    errors.value.image = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        formHolder.value.imageURL = e.target.result; // preview of selected image
    };
    reader.readAsDataURL(file);
};
const removeImage = () => {
    formHolder.value.imageURL = '';  // remove preview
    formHolder.value.image_url = ''; // clear holder image value
};

function editPattern() {
    if (patterns.value) {
        // Copy current data into formHolder
        formHolder.value.imageURL = patterns.value.processedImageURL;
        formHolder.value.pattern_code = patterns.value.pattern_code;
        formHolder.value.image_url = patterns.value.image_url;
        formHolder.value.pattern_name = patterns.value.pattern_name;
        errors.value = { name: '', image: '' };
    }
    editPatternDialog.value = true;
}

function confirmDelete() {
    deletePatternDialog.value = true;
}
const savePatternEdit = async () => {

    // Validate form
    if (!validateForm()) {
        return;
    }
   try {
        loading.value = true;
        const id = route.params.id;
        const formData = new FormData();
        formData.append('pattern_name', formHolder.value.pattern_name);
        formData.append('image_url', formHolder.value.image_url);
        formData.append('pattern_code', formHolder.value.pattern_code);
        const response = await api.postExtra(`patternUpdate/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Successfull', detail: 'Pattern has been updated', life: 3000 });
            editPatternDialog.value = false;
        setTimeout(() => {
        router.go(0);
      }, 1000);
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to update pattern', life: 3000 });
        }
    } catch (error) {
        console.error('Error update pattern:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update pattern', life: 3000 });
    }
};

const deletePattern = async () => {

   try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.post(`patternDelete/${id}`);
        if (response.data.status === 1) {
            toast.add({ severity: 'info', summary: 'Deleted', detail: 'Pattern has been deleted', life: 3000 });
            editPatternDialog.value = false;
        setTimeout(() => {
        router.push('/technical/listPattern');
      }, 1000);
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to delete pattern', life: 3000 });
        }
    } catch (error) {
        console.error('Error deleting pattern:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete pattern', life: 3000 });
    }
};

const processCatalogueImages = async (item) => {
    if (item.image_url && typeof item.image_url === 'string') {
        try {
            const blobUrl = await api.getPrivateFile(item.image_url); // call your function
            return {
                ...item,
                processedImageURL: blobUrl || `/${item.image_url}` // fallback to public path
            };
        } catch (error) {
            console.error(`Error loading catalogue image for ${item.pattern_name}:`, error);
            return {
                ...item,
                processedImageURL: `/${item.image_url}`
            };
        }
    } else {
        return {
            ...item,
            processedImageURL: ''
        };
    }
};

const getImagePath = (path) => {
    if (!path) return '';
    return path.replace(/^public\//, '/');
};
onMounted(async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`patternDetail/${id}`);

        if (response.data.status === 1 && (response.data.material_pattern)) {

            const processedItem = await processCatalogueImages(response.data.material_pattern);
            patterns.value = processedItem;
        } else {
            console.error('API returned error or invalid data:', response.data);
            patterns.value = [];
        }
    } catch (error) {
        console.error('Error fetching Pattern list:', error);
        patterns.value = [];
    } finally {
        loading.value = false;
    }
});
</script>
