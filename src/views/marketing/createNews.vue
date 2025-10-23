<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create News</div>

                <!-- news Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="news.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="news.desc" rows="3" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Start Date</label>
                        <Calendar v-model="news.startDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">End Date</label>
                        <Calendar v-model="news.endDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Publish Date</label>
                        <Calendar v-model="news.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Audience</label>
                        <Dropdown v-model="news.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <!-- Upload Images -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload News Images</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="n in 3" :key="n">
                            <FileUpload mode="basic" accept="image/*" customUpload :chooseLabel="`Upload Image ${n}`" class="w-full" @select="(e) => onImageSelect(e, `image${n}`)" />
                            <img v-if="preview[`image${n}`]" :src="preview[`image${n}`]" :alt="`Preview ${n}`" class="mt-2 rounded-lg shadow-md object-cover w-full h-40" />
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-40">
                        <Button label="Cancel" class="p-button-secondary w-full" @click="$router.back()" />
                    </div>
                    <div class="w-40">
                        <Button label="Save as Draft" class="w-full p-button-outlined p-button-info" @click="handleSave(0)" />
                    </div>
                    <div class="w-40">
                        <Button label="Save & Publish" class="w-full p-button-success" @click="handleSave(1)" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/service/api';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const audienceOptions = [
    { label: 'TC', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'ALL', value: 'ALL' }
];

const news = ref({
    title: '',
    desc: '',
    startDate: '',
    endDate: '',
    publishDate: '',
    audience: 'ALL',
    image1: null,
    image2: null,
    image3: null,
    isPublish: 0
});

const preview = ref({
    image1: '',
    image2: '',
    image3: ''
});

// handle file selection + preview
const onImageSelect = (event, field) => {
    const file = event.files[0];
    if (file) {
        news.value[field] = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// handle save (draft or publish)
const handleSave = async (isPublish) => {
    try {
        const formData = new FormData();
        formData.append('title', news.value.title);
        formData.append('description', news.value.desc);
        formData.append('audience', news.value.audience);
        formData.append('startDate', formatDate(news.value.startDate));
        formData.append('endDate', formatDate(news.value.endDate));
        formData.append('isPublish', isPublish);

        if (isPublish === 1 && news.value.publishDate) {
            formData.append('publishDate', formatDate(news.value.publishDate));
        }

        if (news.value.image1) formData.append('image1', news.value.image1);
        if (news.value.image2) formData.append('image2', news.value.image2);
        if (news.value.image3) formData.append('image3', news.value.image3);

        const response = await api.customRequest({
            method: 'post',
            url: '/api/news/create',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: isPublish ? 'News Published Successfully' : 'Saved as Draft',
                life: 3000
            });
            router.push('/marketing/listnews');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error?.message || 'Failed to save news',
                life: 3000
            });
        }
    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong while saving news',
            life: 3000
        });
    }
};

// format date for backend (d-m-Y)
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};
</script>
