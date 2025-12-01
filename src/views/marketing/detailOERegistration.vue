<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listOERegistration">
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">OE Warranty Registration</div>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Date Register</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Registartion Card</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Vehicle Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Vehicle Plate No</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Vehicle Type</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Vehicle Brand</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Vehicle Model</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Mileage Photo</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Purchase Date</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Tyre Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Tyre List</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Tyre Pattern</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Tyre Size</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Tyre Description</span>
                                <p class="text-lg font-medium">{{ event.endDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Serial Plate No</span>
                                <p class="text-lg font-medium">{{ event.startDate }}</p>
                            </div>
                    </div>
                        </div>
                    </div>
                

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ User Details</div>
                        <Tag :value="event.status === 1 ? 'Active' : 'Inactive'" :severity="event.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">TC member no</td>
                                    <td class="px-4 py-2 text-right">{{ event.publishDate }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ event.audience }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Name</td>
                                    <td class="px-4 py-2 text-right">{{ event.view }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Phone Number</td>
                                    <td class="px-4 py-2 text-right">{{ event.isSurvey }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 'Yes'" class="border-b">
                                    <td class="px-4 py-2 font-medium">Member email</td>
                                    <td class="px-4 py-2 text-right">{{ event.point1 }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm'; // Added
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm(); // Added

const eventId = route.params.id;
const loading = ref(true);
// Removed: const deleteDialog = ref(false);

// Event data
const event = ref({
    id: null,
    audience: '',
    isSurvey: 'No',
    point1: 0,
    point2: 0,
    point3: 0,
    title: '',
    image1URL: '',
    image2URL: '',
    image3URL: '',
    desc: '',
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    view: 0,
    status: 0
});

const surveyQuestions = ref([]);
const participants = ref([]);

// Computed property for toggle button
const eventStatus = computed({
    get: () => event.value.status === 1,
    set: (newValue) => {
        // This will be handled by the API call
    }
});

// Toggle event status
const toggleEventStatus = async () => {
    try {
        const response = await api.put(`event/togglePublish/${eventId}`);

        if (response.data.status === 1) {
            // Update local event status
            event.value.status = event.value.status === 1 ? 0 : 1;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Event ${event.value.status === 1 ? 'activated' : 'deactivated'} successfully`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update event status',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating event status:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update event status',
            life: 3000
        });
    }
};

// Confirm before delete
const confirmDelete = () => {
    confirm.require({
        message: 'Are you sure you want to delete this event?',
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                const response = await api.put(`event/delete/${event.value.id}`);

                if (response.data.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Event deleted successfully.',
                        life: 3000
                    });
                    router.push('/marketing/listEvent');
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete event.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Delete failed:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete event.',
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

// Fetch event details
const fetchEventDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`event/details/${eventId}`);

        if (response.data.status === 1) {
            const eventData = response.data.admin_data;

            // Update event data
            event.value = {
                ...event.value,
                ...eventData
            };

            // Handle survey questions
            if (eventData.survey_questions && eventData.survey_questions.length > 0) {
                surveyQuestions.value = eventData.survey_questions[0] || [];
            }

            // Handle participants
            if (eventData.participants) {
                participants.value = eventData.participants;
            }

            // Process private images
            await processPrivateImages();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load event details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching event details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load event details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Process private images using the API method
const processPrivateImages = async () => {
    const imageFields = ['image1URL', 'image2URL', 'image3URL'];

    for (const field of imageFields) {
        if (event.value[field] && typeof event.value[field] === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(event.value[field]);
                if (blobUrl) {
                    event.value[field] = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading image ${field}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

onMounted(() => {
    fetchEventDetails();
});
</script>
