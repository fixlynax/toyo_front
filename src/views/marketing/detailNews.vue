<template>
    <Fluid>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20 text-gray-500 text-lg">Loading news details...</div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 text-red-500 text-lg">
            {{ error }}
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col md:flex-row gap-8">
            <!-- LEFT CONTENT -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- HEADER -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listNews">
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">News Management List</div>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <RouterLink v-if="canUpdate" :to="`/marketing/editNews/${news.id}`">
                                <Button label="Edit" class="p-button-info"  />
                            </RouterLink>
                            <Button v-if="canUpdate" label="Delete" class="p-button-danger"  @click="confirmDelete" />
                        </div>
                    </div>

                    <!-- IMAGES -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img v-if="imageSrcs.image1" :src="imageSrcs.image1" alt="News Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img v-if="imageSrcs.image2" :src="imageSrcs.image2" alt="News Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img v-if="imageSrcs.image3" :src="imageSrcs.image3" alt="News Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <!-- News Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ !news.title || news.title === 'null' ? '-' : news.title }}</h1>
                        <p class="text-lg font-medium">{{ !news.headline|| news.headline=== 'null' ? '-' : news.headline}}
                        </p>
                        <p class="text-lg font-medium">{{ !news.description|| news.description=== 'null' ? '-' : news.description}}</p>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Start Date</span>
                            <p class="text-lg font-medium">{{ formatDate(news.startDate )}}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">End Date</span>
                            <p class="text-lg font-medium">{{ formatDate(news.endDate) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDEBAR -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="statusLabel(news.status)" :severity="statusSeverity(news.status)" />
                    </div>

                    <!-- Details Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(news.publishDate )}}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ news.audience }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Total View</td>
                                    <td class="px-4 py-2 text-right">{{ !news.view || news.view === 'null' ? '0' : news.view }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ news.created_at }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="py-4 text-right" v-if="canUpdate">
                                        <div class="flex justify-end">
                                            <ToggleButton
                                                v-model="newsStatus"
                                                :modelValue="news.status === 1"
                                                @change="toggleNewsStatus"
                                                onLabel="Published"
                                                offLabel="Unpublished"
                                                onIcon="pi pi-eye"
                                                offIcon="pi pi-eye-slash"
                                                class="w-30"
                                                aria-label="Do you confirm ?"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="news.status === 0" class="flex justify-end mt-4 gap-2">
                            <div class="w-30">
                                <Button label="Publish" @click="publishNews" :loading="saving" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import { useMenuStore } from '@/store/menu';
 
const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('News Management'));
const denyAccess = computed(() => menuStore.canTest('News Management'));

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const news = ref({
    id: null,
    title: '',
    headline: '',
    description: '',
    image1URL: '',
    image2URL: '',
    image3URL: '',
    startDate: '',
    endDate: '',
    publishDate: '',
    audience: '',
    view: 0,
    status: 0,
    created_at: ''
});
const loading = ref(true);
const error = ref(null);
const saving = ref(false);

const imageSrcs = ref({
    image1: null,
    image2: null,
    image3: null
});

function formatDate(dateString) {
    if (!dateString) return '';

    // DD-MM-YYYY
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Computed property for toggle button
const newsStatus = computed({
    get: () => news.value.status === 1,
    set: (newValue) => {
        // This will be handled by the API call
    }
});

// Fetch news details
const fetchNewsDetails = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`news/details/${id}`);
        if (response.data.status === 1) {
            news.value = response.data.admin_data;

            // Fetch images requiring authentication
            imageSrcs.value.image1 = (news.value.image1URL);
            imageSrcs.value.image2 = (news.value.image2URL);
            imageSrcs.value.image3 = (news.value.image3URL);
        } else {
            error.value = 'News not found.';
        }
    } catch (err) {
        error.value = 'Failed to load news details.';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// Toggle news status
const toggleNewsStatus = async () => {
    try {
        const response = await api.put(`news/togglePublish/${news.value.id}`);

        if (response.data.status === 1) {
            // Update local news status
            news.value.status = news.value.status === 1 ? 2 : 1;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `News ${news.value.status === 1 ? 'published' : 'unpublished'} successfully`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update news status',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating news status:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update news status',
            life: 3000
        });
    }
};

// Helper functions for status label and severity
const statusLabel = (status) => {
    if (status === 0) return 'Draft';
    if (status === 1) return 'Published';
    if (status === 2) return 'Unpublished';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 0) return 'info';
    if (status === 1) return 'success';
    if (status === 2) return 'warn';
    return 'secondary';
};



// Confirm before delete
const confirmDelete = () => {
    confirm.require({
        message: 'Are you sure you want to delete this news?',
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await api.put(`news/delete/${news.value.id}`);
                toast.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'News deleted successfully.',
                    life: 3000
                });
                router.push('/marketing/listNews');
            } catch (error) {
                console.error('Delete failed:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete news.',
                    life: 3000
                });
            }
        },
        reject: () => {
            toast.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'Deletion cancelled.',
                life: 2000
            });
        }
    });
};


// Publish News
const publishNews = async () => {
    try {
        const response = await api.put(`news/togglePublish/${news.value.id}`);

        if (response.data.status === 1) {
            // Update local news status
            news.value.status = news.value.status === 1 ? 0 : 1;

            toast.add({
                severity: 'success',
                summary: 'Published',
                detail: `News ${news.value.status === 1 ? 'activated' : 'deactivated'} successfully`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to publish news.',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Publish failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to publish news.',
            life: 3000
        });
    }
};
onMounted(() => {
    fetchNewsDetails();
});
</script>
