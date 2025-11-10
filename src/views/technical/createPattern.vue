<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Pattern</div>

                <!-- Pattern Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Name *</label>
                        <InputText v-model="pattern.name" class="w-full" placeholder="Insert Pattern Name" />
                        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
                    </div>
                    
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Code</label>
                        <InputText v-model="pattern.code" class="w-full" placeholder="Insert Pattern Code (Optional)" />
                        <small v-if="errors.code" class="text-red-500">{{ errors.code }}</small>
                    </div>
                </div>

                <!-- Upload Image Section -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Pattern Image *</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <img :src="pattern.imageURL" alt="Preview" class="rounded-lg shadow-md object-cover w-full h-60" />
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

                <!-- Loading Indicator -->
                <div v-if="loading" class="flex justify-center items-center gap-2">
                    <ProgressSpinner style="width: 30px; height: 30px" />
                    <span>Creating pattern...</span>
                </div>

                <!-- Messages -->
                <Message v-if="successMessage" severity="success" class="w-full" @close="successMessage = ''">
                    {{ successMessage }}
                </Message>
                <Message v-if="errorMessage" severity="error" class="w-full" @close="errorMessage = ''">
                    {{ errorMessage }}
                </Message>

                <!-- Debug Info (remove in production) -->
                <div v-if="debugInfo" class="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 class="font-bold text-yellow-800 mb-2">Debug Information:</h4>
                    <pre class="text-xs text-yellow-700">{{ debugInfo }}</pre>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-4">
                    <RouterLink to="/technical/listPattern">
                        <Button label="Cancel" class="p-button-secondary" :disabled="loading" />
                    </RouterLink>
                    <Button 
                        label="Submit" 
                        class="p-button-success" 
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
const debugInfo = ref('');
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
    debugInfo.value = '';

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

        // Debug: Log FormData contents
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ', value);
        }

        // Make API request
        const response = await api.post('patternCreate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 30000 // 30 second timeout
        });

        console.log('API Response:', response.data);

        if (response.data.status === 1 || response.status === 200) {
            successMessage.value = 'Pattern created successfully!';
            
            // Redirect to list page after success
            setTimeout(() => {
                router.push('/technical/listPattern');
            }, 2000);
        } else {
            errorMessage.value = response.data.message || 'Failed to create pattern';
            debugInfo.value = JSON.stringify(response.data, null, 2);
        }
    } catch (error) {
        console.error('Error creating pattern:', error);
        
        // Enhanced error logging
        debugInfo.value = `Error Details:
Status: ${error.response?.status}
Message: ${error.message}
Response Data: ${JSON.stringify(error.response?.data, null, 2)}
        `;

        if (error.response) {
            // Server responded with error status
            const errorData = error.response.data;
            
            if (error.response.status === 400) {
                errorMessage.value = errorData.message || 'Bad request. Please check your input.';
                
                // Handle validation errors
                if (errorData.errors) {
                    const errorList = Object.values(errorData.errors).flat().join(', ');
                    errorMessage.value += `: ${errorList}`;
                }
            } else if (error.response.status === 413) {
                errorMessage.value = 'File too large. Please select a smaller image.';
            } else if (error.response.status === 415) {
                errorMessage.value = 'Unsupported file type. Please use JPEG, PNG, or other common image formats.';
            } else {
                errorMessage.value = errorData.message || `Server error (${error.response.status})`;
            }
        } else if (error.request) {
            // Request was made but no response received
            errorMessage.value = 'Network error. Please check your internet connection and try again.';
        } else {
            // Something else happened
            errorMessage.value = 'An unexpected error occurred. Please try again.';
        }
    } finally {
        loading.value = false;
    }
};
</script>