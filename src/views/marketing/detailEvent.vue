<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listEvent">
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Event Management Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink v-if="canUpdate" :to="`/marketing/editEvent/${eventId}`">
                                <Button label="Edit" class="p-button-info"  />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button v-if="canUpdate" label="Delete" class="p-button-danger"  @click="confirmDelete" />
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex justify-center items-center py-8">
                        <ProgressSpinner />
                    </div>

                    <!-- Event Content -->
                    <div v-else>
                        <!-- Event Images -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <img v-if="event.image1URL" :src="event.image1URL" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                            <img v-if="event.image2URL" :src="event.image2URL" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                            <img v-if="event.image3URL" :src="event.image3URL" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        </div>

                        <!-- Event Info -->
                        <div class="mt-6">
                            <h1 class="text-2xl font-bold text-gray-800">{{ event.title }}</h1>
                            <p class="text-lg font-medium">{{ event.headline }}</p>
                            <p class="text-lg font-medium">{{ event.desc }}</p>

                            <div class="flex flex-col md:flex-row gap-4 mt-3">
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">Location</span>
                                    <p class="text-lg font-medium">{{ event.location }}</p>
                                </div>
                            </div>

                            <div class="flex flex-col md:flex-row gap-4 mt-3">
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">Start Date</span>
                                    <p class="text-lg font-medium">{{ formatDate(event.startDate) }}</p>
                                </div>
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">End Date</span>
                                    <p class="text-lg font-medium">{{ formatDate(event.endDate) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Survey Info (only if enabled) -->
                <div class="card flex flex-col w-full" v-if="event.isSurvey === 'Yes' && surveyQuestions.length > 0">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">📋 Survey Info</div>
                        <Button icon="pi pi-download" label="Report" style="width: fit-content" class="p-button-primary p-button-sm" @click="fetchExport" />
                    </div>

                    <div class="space-y-6">
                        <!-- Loop through each question -->
                        <div v-for="(q, qIndex) in surveyQuestions" :key="qIndex" class="border-b pb-4">
                            <!-- Question Title and "Statistic" on the same line -->
                            <div class="flex justify-between items-center mb-2">
                                <div class="font-bold text-lg">Q{{ qIndex + 1 }}. {{ q.question }}</div>
                                <div class="font-bold text-lg text-gray-700">Respondent</div>
                            </div>

                            <!-- Answers & Statistics -->
                            <div class="space-y-1">
                                <div class="flex justify-between px-2">
                                    <ul class="list-disc list-inside mt-1 text-gray-600">
                                        <li>{{ q.answer1 }}</li>
                                    </ul>
                                    <span>{{ q.answer1_count }}</span>
                                </div>
                                <div class="flex justify-between px-2">
                                    <ul class="list-disc list-inside mt-1 text-gray-600">
                                        <li>{{ q.answer2 }}</li>
                                    </ul>
                                    <span>{{ q.answer2_count }}</span>
                                </div>
                                <div class="flex justify-between px-2">
                                    <ul class="list-disc list-inside mt-1 text-gray-600">
                                        <li>{{ q.answer3 }}</li>
                                    </ul>
                                    <span>{{ q.answer3_count }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="event.status === 1 ? 'Active' : 'Inactive'" :severity="event.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(event.publishDate) }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ event.audience }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">View</td>
                                    <td class="px-4 py-2 text-right">{{ event.view }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Survey</td>
                                    <td class="px-4 py-2 text-right">{{ event.isSurvey }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 'Yes'" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Silver</td>
                                    <td class="px-4 py-2 text-right">{{ event.point1 }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 'Yes'" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Gold</td>
                                    <td class="px-4 py-2 text-right">{{ event.point2 }}</td>
                                </tr>
                                <tr v-if="event.isSurvey === 'Yes'" class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Platinum</td>
                                    <td class="px-4 py-2 text-right">{{ event.point3 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Total Participants</td>
                                    <td class="px-4 py-2 text-right">{{ participants.length }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="py-4 text-right">
                                        <div class="flex justify-end">
                                            <ToggleButton v-if="canUpdate" v-model="eventStatus" @change="toggleEventStatus" onLabel="Inactive" offLabel="Active" onIcon="pi pi-times" offIcon="pi pi-check" class="w-30" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Participant List (only if survey enabled) -->
                <div class="card flex flex-col w-full" v-if="event.isSurvey === 'Yes' && participants.length > 0">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">👨🏻‍💻 Participant List</div>
                        <Button icon="pi pi-file-export" label="Export" style="width: fit-content" class="p-button-primary p-button-sm" />
                    </div>
                    <DataTable :value="participants" :paginator="true" :rows="10" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <Column header="User" style="min-width: 1rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.name }}</span>
                                    <span class="text-gray-600 text-xs mt-2">👤 {{ data.memberCode }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.membership }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column field="dateTaken" header="Date Taken" style="min-width: 6rem"></Column>
                        <Column field="pointEarn" header="Point Earned" style="min-width: 6rem; text-align: center"></Column>
                    </DataTable>
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
import { useMenuStore } from '@/store/menu';
 
const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Events Management'));
const denyAccess = computed(() => menuStore.canTest('Events Management'));

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
    headline: '',
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
                participants.value = (eventData.participants || []).filter((p) => p && typeof p === 'object');
            }


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

const fetchExport = async () => {
    try {
        loading.value = true;

        const response = await api.getDownload(
            `excel/survey/${eventId}`,
            { responseType: 'arraybuffer' }
        );

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = event.value.title;
        a.click();
        URL.revokeObjectURL(url);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Export completed',
            life: 3000
        });

    } catch (error) {
        console.error('Export error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Export failed',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};


onMounted(() => {
    fetchEventDetails();
});
</script>
