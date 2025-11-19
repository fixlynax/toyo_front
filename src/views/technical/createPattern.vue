<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Pattern</div>

                <!-- Pattern Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Name</label>
                        <InputText v-model="pattern.name" class="w-full" placeholder="Insert Pattern Name" />
                        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
                    </div>
                    
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Code</label>
                        <InputText v-model="pattern.code" class="w-full" placeholder="Insert Pattern Code" maxlength="3"/>
                        <small v-if="errors.code" class="text-red-500">{{ errors.code }}</small>
                    </div>
                </div>

                <!-- Upload Image Section -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Pattern Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <FileUpload 
                                mode="basic" 
                                name="image_url" 
                                accept="image/*" 
                                :maxFileSize="10000000"
                                :auto="true"
                                :chooseLabel="selectedFile ? 'Change Image' : 'Upload Image'" 
                                class="w-full" 
                                @select="onImageSelect"
                                @remove="removeImage"
                                :invalidFileSizeMessage="'File size should be less than 10MB'"
                            />
                            <small v-if="errors.image" class="text-red-500">{{ errors.image }}</small>
                            
                            <div v-if="pattern.imageURL" class="relative mt-2">
                                <img :src="pattern.imageURL" alt="Preview" class="rounded-lg shadow-md object-cover h-60" />
                                <Button 
                                    icon="pi pi-times" 
                                    class="p-button-danger p-button-rounded p-button-sm absolute top-2 right-2" 
                                    @click="removeImage" 
                                />
                            </div>
                            <div v-else-if="selectedFile" class="mt-2 p-2 border rounded bg-gray-50">
                                <p class="text-sm text-gray-600">Selected file: {{ selectedFile.name }}</p>
                                <p class="text-xs text-gray-500">Size: {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-4">
                    <RouterLink to="/technical/listPattern">
                        <Button label="Cancel" class="p-button-danger" :disabled="loading" />
                    </RouterLink>
                    <Button 
                        label="Submit" 
                        class="p-button-success w-30"
                        style="width: min-content!important;" 
                        @click="submitPattern" 
                        :disabled="loading"
                        :loading="loading"
                    />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const router = useRouter();

const pattern = ref({
    code: '',
    name: '',
    imageURL: ''
});

const selectedFile = ref(null);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const errors = ref({
    code: '',
    name: '',
    image: ''
});

const validateForm = () => {
    let isValid = true;
    errors.value = { code: '', name: '', image: '' };

    if (!pattern.value.name.trim()) {
        errors.value.name = 'Pattern name is required';
        isValid = false;
    }
    if (!pattern.value.code.trim()) {
        errors.value.code = 'Pattern code is required';
     
    }
    if (!selectedFile.value) {
        errors.value.image = 'Pattern image is required';
        isValid = false;
    }

    return isValid;
};

const onImageSelect = (event) => {
    const file = event.files[0];
    if (file) {
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

        selectedFile.value = file;
        errors.value.image = '';

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            pattern.value.imageURL = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const removeImage = () => {
    pattern.value.imageURL = '';
    selectedFile.value = null;
};

const submitPattern = async () => {
    // Clear previous messages
    successMessage.value = '';
    errorMessage.value = '';

    // Validate form
    if (!validateForm()) {
        errorMessage.value = 'Please fill in all required fields correctly';
        return;
    }

    loading.value = true;

    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('pattern_name', pattern.value.name.trim());
        
        // Append the file - make sure it's the correct field name
        formData.append('image_url', selectedFile.value);

        // If pattern code is provided, add it
        if (pattern.value.code.trim()) {
            formData.append('pattern_code', pattern.value.code.trim());
        }

        // Make API request
        const response = await api.postExtra('patternCreate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if (response.data.status === 1) {
            toast.add({severity: 'success',summary: 'Success',detail: 'Pattern created successfully',life: 3000});
            // Redirect to list page after success
            setTimeout(() => {
                router.push('/technical/listPattern');
            }, 1000);
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.error || 'Failed to create pattern', life: 3000 });
        }
    } catch (error) {
        console.error('Error creating pattern:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error || 'Failed to create pattern', life: 3000 });
    } finally {
        loading.value = false;
    }
};
</script>