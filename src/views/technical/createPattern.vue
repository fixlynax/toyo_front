<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Pattern</div>

                <!-- Pattern Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Code</label>
                        <InputText v-model="pattern.code" class="w-full" placeholder="Insert Pattern Code" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Pattern Name</label>
                        <InputText v-model="pattern.name" class="w-full" placeholder="Insert Pattern Name" />
                    </div>
                </div>

                <!-- Upload Image Section -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Pattern Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" customUpload @select="onImageSelect" chooseLabel="Upload Image" class="w-full" />
                            <div v-if="pattern.imageURL" class="relative mt-2">
                                <img :src="pattern.imageURL" alt="Preview" class="rounded-lg shadow-md object-cover w-full h-60" />
                                <Button icon="pi pi-times" class="p-button-danger p-button-rounded p-button-sm absolute top-2 right-2" @click="removeImage" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8 gap-4">
                    <RouterLink to="/technical/listPattern">
                        <Button label="Cancel" class="p-button-secondary" />
                    </RouterLink>
                    <RouterLink to="/technical/listPattern">
                        <Button label="Submit" class="p-button-success" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const pattern = ref({
    code: '',
    name: '',
    imageURL: ''
});

const onImageSelect = (eventFile) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            pattern.value.imageURL = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const removeImage = () => {
    pattern.value.imageURL = '';
};
</script>
