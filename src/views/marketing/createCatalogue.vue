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

                    <div v-if="catalogue.type === 'ITEM' || catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Quantity *</label>
                        <InputNumber v-model="catalogue.quantity" placeholder="Enter quantity" class="w-full" />
                        <small v-if="errors.quantity" class="text-red-500">{{ errors.quantity }}</small>
                    </div>

                    <div v-if="catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Provider</label>
                        <InputText v-model="catalogue.provider" placeholder="Enter provider name" class="w-full" />
                    </div>
                    <div v-if="catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Value Type *</label>
                        <Dropdown v-model="catalogue.valueType" :options="valueType" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                        <small v-if="errors.valueType" class="text-red-500">{{ errors.valueType }}</small>
                    </div>

                    <div v-if="catalogue.type === 'EVOUCHER'">
                        <label class="block font-bold text-gray-700 mb-1">Value Amount *</label>
                        <div>
                            <InputNumber v-if="catalogue.valueType !== 'Percentage'" v-model="catalogue.valueAmount" placeholder="Enter Amount" class="w-full" />
                            <div v-else class="flex items-center gap-2">
                                <InputNumber v-model="catalogue.valueAmount" placeholder="Enter Percentage" suffix="%" :max="100" class="w-full" />
                            </div>
                        </div>
                        <small v-if="errors.valueAmount" class="text-red-500">{{ errors.valueAmount }}</small>
                    </div>
                </div>

                <!-- Catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Purpose To & Expiry -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Purpose To</label>
                            <Dropdown v-model="catalogue.purpose" :options="filteredPurposeOptions" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
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

                    <!-- SKU -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">SKU <span v-if="catalogue.type === 'ITEM'" class="text-red-500">*</span></label>
                        <InputText v-model="catalogue.sku" class="w-full" />
                        <small v-if="errors.sku" class="text-red-500">{{ errors.sku }}</small>
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
                        <div v-for="n in 1" :key="n">
                            <FileUpload mode="basic" :name="`image${n}`" accept="image/*" customUpload 
                                @select="(e) => onImageSelect(e, `image${n}`)" 
                                :chooseLabel="`Upload Image ${n}`" class="w-full" />
                            <img v-if="catalogue[`image${n}URL`]" :src="catalogue[`image${n}URL`]" :alt="`Preview ${n}`" 
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
                            <InputNumber v-model="catalogue.point1" class="w-full" />
                            <small v-if="errors.point1" class="text-red-500">{{ errors.point1 }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Gold *</label>
                            <InputNumber v-model="catalogue.point2" class="w-full" />
                            <small v-if="errors.point2" class="text-red-500">{{ errors.point2 }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1">Platinum *</label>
                            <InputNumber v-model="catalogue.point3" class="w-full" />
                            <small v-if="errors.point3" class="text-red-500">{{ errors.point3 }}</small>
                        </div>
                    </div>
                </div>

                <!-- Submit Buttons for non-survey items -->
                <div v-if="catalogue.isSurvey === 'no'" class="flex justify-end mt-8 gap-2">
                    <div class="w-40">
                        <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                    </div>
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="submitCatalogue" :loading="loading" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Survey Questions -->
        <div v-if="catalogue.isSurvey === 'yes'" class="card flex flex-col gap-6 w-full mt-8">
            <div class="text-xl font-bold text-gray-800 border-b pb-2">📝 Survey Questions</div>
            <div v-if="questions.length > 0" class="space-y-4">
                <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div class="flex items-center justify-between mb-2">
                        <label class="font-semibold text-gray-800">Question {{ index + 1 }}</label>
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeQuestion(index)" />
                    </div>

                    <InputText v-model="q.question" placeholder="Enter your question" class="w-full mb-4" />

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FloatLabel v-for="(ans, i) in q.answers" :key="i" variant="on" class="w-full">
                            <InputText :id="`answer-${index}-${i}`" v-model="q.answers[i]" class="w-full" />
                            <label :for="`answer-${index}-${i}`">Answer {{ i + 1 }}</label>
                        </FloatLabel>
                    </div>

                    <div class="mt-4">
                        <label class="block font-semibold text-gray-700 mb-2">Correct Answer</label>
                        <Dropdown v-model="q.correctAnswer" :options="correctAnswerOptions" optionLabel="label" optionValue="value" placeholder="Select correct answer" class="w-full" />
                    </div>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">No questions added yet.</div>

            <div class="flex justify-start">
                <Button icon="pi pi-plus" label="Add Question" style="width: fit-content" class="p-button-success p-button-sm" 
                    :disabled="questions.length >= 10" @click="addQuestion" />
            </div>

            <div class="flex justify-end mt-8 gap-2">
                <div class="w-40">
                    <Button label="Cancel" class="p-button-secondary w-full mr-2" @click="$router.back()" />
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" @click="submitCatalogue" :loading="loading" />
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
const errors = ref({});

/* Dropdown Options - Fixed to match API expectations */
const typeOptions = [
    { label: 'E-Wallet', value: 'EWALLET' },
    { label: 'E-Voucher', value: 'EVOUCHER' },
    { label: 'Item', value: 'ITEM' },
    { label: 'Point', value: 'POINT' }
];

const isBirthdayOptions = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' }
];

const valueType = [
    { label: 'Percentage', value: 'Percentage' },
    { label: 'Amount', value: 'Amount' }
];

const purposeOptions = [
    { label: 'Catalogue', value: 'Catalogue' },
    { label: 'Campaign', value: 'Campaign' },
    { label: 'Game', value: 'Game' }
];

const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const surveyOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
];

const correctAnswerOptions = [
    { label: 'Answer 1', value: '1' },
    { label: 'Answer 2', value: '2' },
    { label: 'Answer 3', value: '3' }
];

/* Catalogue State */
const catalogue = ref({
    title: '',
    description: '',
    audience: 'ALL',
    isSurvey: 'no',
    purpose: '',
    type: '',
    isBirthday: 'NO',
    sku: '',
    terms: '',
    instruction: '',
    expiry: null,
    
    // Points
    point1: 0,
    point2: 0,
    point3: 0,
    
    // Cost redeem
    costSilver: 0,
    costGold: 0,
    costPlatinum: 0,
    
    // E-Voucher specific
    quantity: 0,
    provider: '',
    valueType: 'Amount',
    valueAmount: 0,
    
    // Images
    image1URL: '',
    image2URL: '',
    image3URL: ''
});

// Image files storage
const imageFiles = ref({});

// Survey questions
const questions = ref([]);

/* Computed Properties */
const filteredPurposeOptions = computed(() => {
    if (catalogue.value.type === 'POINT') {
        return purposeOptions.filter((opt) => opt.value !== 'Catalogue');
    }
    return purposeOptions;
});

/* Image Handlers */
const onImageSelect = (catalogFile, fieldName) => {
    const file = catalogFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => (catalogue.value[`${fieldName}URL`] = e.target.result);
        reader.readAsDataURL(file);
        imageFiles.value[fieldName] = file;
    }
};

/* Survey Questions Management */
const addQuestion = () => {
    if (questions.value.length < 10) {
        questions.value.push({
            question: '',
            answers: ['', '', ''],
            correctAnswer: ''
        });
    }
};

const removeQuestion = (index) => {
    questions.value.splice(index, 1);
};

/* Date Formatter - Fixed to match API format */
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

/* Validation - Enhanced with specific API requirements */
const validateFields = () => {
    errors.value = {};

    // Required fields for all types
    if (!catalogue.value.type) errors.value.type = 'Type is required';
    if (!catalogue.value.isBirthday) errors.value.isBirthday = 'Is Birthday is required';
    if (!catalogue.value.title) errors.value.title = 'Title is required';
    if (!catalogue.value.description) errors.value.description = 'Description is required';
    if (!catalogue.value.expiry) errors.value.expiry = 'Expiry date is required';
    if (catalogue.value.point1 === null || catalogue.value.point1 === '') errors.value.point1 = 'Silver point is required';
    if (catalogue.value.point2 === null || catalogue.value.point2 === '') errors.value.point2 = 'Gold point is required';
    if (catalogue.value.point3 === null || catalogue.value.point3 === '') errors.value.point3 = 'Platinum point is required';

    // Type-specific validations
    if (catalogue.value.type === 'ITEM' && !catalogue.value.sku) {
        errors.value.sku = 'SKU is required for Item type';
    }

    if ((catalogue.value.type === 'EVOUCHER' || catalogue.value.type === 'ITEM') && 
        (!catalogue.value.quantity || catalogue.value.quantity <= 0)) {
        errors.value.quantity = 'Quantity is required';
    }

    if (catalogue.value.type === 'EVOUCHER') {
        if (!catalogue.value.valueType) errors.value.valueType = 'Value Type is required';
        if (!catalogue.value.valueAmount || catalogue.value.valueAmount <= 0) errors.value.valueAmount = 'Value Amount is required';
    }

    // Survey-specific validation
    if (catalogue.value.isSurvey === 'yes') {
        if (questions.value.length === 0) {
            toast.add({ severity: 'warn', summary: 'Validation', detail: 'Add at least one survey question.', life: 3000 });
            return false;
        }
        for (let q of questions.value) {
            if (!q.question || !q.answers[0] || !q.answers[1] || !q.answers[2] || !q.correctAnswer) {
                toast.add({
                    severity: 'warn',
                    summary: 'Validation',
                    detail: 'All questions, answers, and correct answers are required.',
                    life: 3000
                });
                return false;
            }
        }
    }

    return Object.keys(errors.value).length === 0;
};

/* Form Submission - Fixed to match API structure */
const submitCatalogue = async () => {
    if (!validateFields()) {
        toast.add({ 
            severity: 'warn', 
            summary: 'Validation', 
            detail: 'Please fix all validation errors', 
            life: 3000 
        });
        return;
    }

    loading.value = true;

    try {
        const formData = new FormData();

        // Append basic required fields
        formData.append('type', catalogue.value.type);
        formData.append('isBirthday', catalogue.value.isBirthday);
        formData.append('title', catalogue.value.title);
        formData.append('description', catalogue.value.description);
        formData.append('expiry', formatDate(catalogue.value.expiry));
        formData.append('point1', catalogue.value.point1.toString());
        formData.append('point2', catalogue.value.point2.toString());
        formData.append('point3', catalogue.value.point3.toString());

        // Append conditional fields
        if (catalogue.value.sku) formData.append('sku', catalogue.value.sku);
        if (catalogue.value.terms) formData.append('terms', catalogue.value.terms);
        if (catalogue.value.instruction) formData.append('instruction', catalogue.value.instruction);
        if (catalogue.value.purpose) formData.append('purpose', catalogue.value.purpose);
        if (catalogue.value.quantity) formData.append('quantity', catalogue.value.quantity.toString());
        if (catalogue.value.provider) formData.append('provider', catalogue.value.provider);
        if (catalogue.value.valueType) formData.append('valueType', catalogue.value.valueType);
        if (catalogue.value.valueAmount) formData.append('valueAmount', catalogue.value.valueAmount.toString());

        // Append image files
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            if (imageFiles.value[fieldName]) {
                formData.append(fieldName, imageFiles.value[fieldName]);
            }
        }

        // Debug: Log form data before sending
        console.log('Submitting form data:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // API call
        const response = await api.customRequest({
            method: 'POST',
            url: '/api/catalog/create',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 0) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Catalogue created successfully!',
                life: 3000
            });
            router.push('/marketing/listCatalogue');
        } else {
            console.error('Backend error:', response.data);
            const errorMessage = response.data.messages 
                ? Object.values(response.data.messages).flat().join(', ')
                : 'Failed to create catalogue';
            
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        
        // Handle validation errors from backend
        if (error.response?.data?.messages) {
            const backendErrors = error.response.data.messages;
            const errorDetails = Object.values(backendErrors).flat().join(', ');
            
            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: errorDetails,
                life: 5000
            });
        } else if (error.response?.data) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.message || 'Something went wrong',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Network error or server unavailable',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
</script>