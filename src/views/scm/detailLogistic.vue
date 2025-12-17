<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Column: Logistic Details and Ship To -->
      <div class="md:w-2/3 flex flex-col">
        <!-- Logistic Details Card -->
        <div class="card flex flex-col gap-6 w-full">
          <!-- Title -->
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                <div class="text-2xl font-bold text-gray-800">Logistic Details</div>
            </div>
           <RouterLink v-if="canUpdate" :to="`/scm/editLogistic/${logisticList.id}`">
                <Button type="button" label="Edit" />
            </RouterLink>
          </div>
          <div class="grid grid-cols-2 gap-4">
              <div>
                  <span class="text-sm text-black-700">Logistic Name</span>
                  <p class="text-lg font-medium">{{ logisticList.companyname }}</p>
              </div>
              <div>
                  <span class="text-sm text-black-700">Storage Location</span>
                  <p class="text-lg font-medium">{{ logisticList.storageLocationList }}</p>
              </div>
              <div>
                  <span class="text-sm text-black-700">Address</span>
                  <p class="text-lg font-medium">{{ `${logisticList.addressline1} ${logisticList.addressline2} ${logisticList.city} ${logisticList.postcode} ${logisticList.state}`}}</p>
              </div>
              <div>
                  <span class="text-sm text-black-700">Contact Person</span>
                  <p class="text-lg font-medium">{{ logisticList.contactperson || '-' }}</p>
              </div>
              <div>
                  <span class="text-sm text-black-700">Mobile No</span>
                  <p class="text-lg font-medium">{{ logisticList.mobileno }}</p>
              </div>
          </div>

        </div>
      </div>

      <!-- Sidebar: Account Info -->
      <div class="md:w-1/3 flex flex-col gap-8">
        <!-- Account Info Card -->
        <div class="card flex flex-col w-full mb-4">
          <!-- Header with Status Tag -->
          <div class="flex items-center justify-between border-b pb-2 mb-2">
            <div class="text-2xl font-bold text-gray-800">Account Info</div>
            <!-- <Tag
              :value="logisticList.status === '1' ? 'Active' : 'Inactive'"
              :severity="logisticList.status === '1' ? 'success' : 'danger'"
            /> -->
          </div>
          <!-- Account details table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <tbody>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Username</td>
                  <td class="px-4 py-2 text-right">{{ logisticList.uname }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Email</td>
                  <td class="px-4 py-2 text-right">{{ logisticList.emailaddress }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Created Date</td>
                  <td class="px-4 py-2 text-right">{{ formatDate(logisticList.created) }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Last Login Date</td>
                  <td class="px-4 py-2 text-right">{{ logisticList.lastLogin ? formatDate(logisticList.lastLogin) : 'Never' }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Status</td>
                  <td class="px-4 py-2 text-right"><Tag :value="logisticList.status === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(logisticList.status)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Other sidebar content can stay here -->
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('3PL Account'));
const denyAccess = computed(() => menuStore.canTest('3PL Account'));

const route = useRoute();
const router = useRouter();
const logisticList = ref({});
const loading = ref(false);

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    }
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    }
function formatDateFull(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    }
const InitfetchData = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`3pl-users/detail/${id}`);
        if ( (response.data.admin_data)) {
            // response.data.status === 1 &&
            logisticList.value = response.data.admin_data;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching data list:', error);
        logisticList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    InitfetchData();
});
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>
