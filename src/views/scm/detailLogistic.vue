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
           <RouterLink :to="`/scm/editLogistic/${logisticList.id}`">
                <Button type="button" label="Edit" />
            </RouterLink>
          </div>
          
          
          <!-- Company Name and Address -->
          <div class="w-full mb-4">
            <h1 class="text-2xl font-bold text-gray-800">{{ logisticList.companyname }}</h1>
            <span class="text-xs font-bold text-black-700">Address</span>
            <p class="text-lg font-medium">{{ `${logisticList.addressline1} ${logisticList.addressline2} ${logisticList.city} ${logisticList.postcode} ${logisticList.state}`}}</p>
          </div>
          
          <!-- Username and Email -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Username</span>
              <p class="text-lg font-medium">{{ logisticList.uname }}</p>
            </div>
          </div>
          
          <!-- Contact Person and Contact Number -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Contact Person</span>
              <p class="text-lg font-medium">{{ logisticList.contactperson }}</p>
            </div>
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Contact Number</span>
              <p class="text-lg font-medium">{{ logisticList.mobileno }}</p>
            </div>
          </div>
          
          <!-- City, Postcode, State -->
          <div class="flex flex-col md:flex-row gap-3 mb-3">
            <div class="w-full md:w-1/3">
              <span class="text-xs font-bold text-black-700">City</span>
              <p class="text-lg font-medium">{{ logisticList.city }}</p>
            </div>
            <div class="w-full md:w-1/3">
              <span class="text-xs font-bold text-black-700">Postcode</span>
              <p class="text-lg font-medium">{{ logisticList.postcode }}</p>
            </div>
            <div class="w-full md:w-1/3">
              <span class="text-xs font-bold text-black-700">State</span>
              <p class="text-lg font-medium">{{ logisticList.state }}</p>
            </div>
          </div>
          <div class="w-full md:w-1/2">
            <span class="text-xs font-bold text-black-700">Storage Location</span>
            <p class="text-lg font-medium">{{ logisticList.storageLocationList }}</p>
          </div>
        </div>

        <!-- "Ship To" card as full width inside left column -->
        <!-- <div class="card flex flex-col w-full">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">🚚 Ship To</div>
          <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
            <Column field="code" header="Storage Location" style="min-width: 15rem" />
            <Column field="name" header="Name" style="min-width: 20rem"></Column>
            <Column field="description" header="Description" style="min-width: 10rem" />
          </DataTable>
        </div> -->
      </div>

      <!-- Sidebar: Account Info -->
      <div class="md:w-1/3 flex flex-col gap-8">
        <!-- Account Info Card -->
        <div class="card flex flex-col w-full mb-4">
          <!-- Header with Status Tag -->
          <div class="flex items-center justify-between border-b pb-2 mb-2">
            <div class="text-2xl font-bold text-gray-800">Account Info</div>
            <Tag
              :value="logistic.status === '1' ? 'Active' : 'Inactive'"
              :severity="logistic.status === '1' ? 'success' : 'danger'"
            />
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
                  <td class="px-4 py-2 font-medium">Created Date</td>
                  <td class="px-4 py-2 text-right">{{ formatDateFull(logisticList.created) }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Last Login Date</td>
                  <td class="px-4 py-2 text-right">{{ logisticList.lastLogin ? formatDateFull(logisticList.lastLogin) : 'Never' }}</td>
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

const route = useRoute();
const router = useRouter();
const logisticList = ref({});
const loading = ref(false);

const logistic = ref({
        companyName: "JNT",
        orderNo: 'ORD001',
        accountNo: '6080100900',
        contactPerson: "John Doe",
        contactNo: "123-456-7890",
        address: "Toyo Tires Malaysia, Jalan Toyo, Off Jalan Klang Lama",
        city: "Shah Alam",
        postcode: "47301",
        state: "Selangor",
        email: "contact@jntlogistics.com",
        username: "jnt_user01",
        password: "password123",
        status: "1",
        shippingPoints: ["JNT"],
        storageLocation: "TMJB",
        createdSince: "2023-01-15T09:30:00",
        lastLogin: "2023-10-01T14:45:00"
});

const shiptoList = ref([
        {
        code: 'TMJB',
        name: 'Toyo Malaysia Johor Bahru',
        description: 'Main storage facility in Johor Bahru'
    },
    {
        code: 'TMSA',
        name: 'Toyo Malaysia Shah Alam',
        description: 'Central warehouse in Shah Alam'
    }
]);
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
            console.error('API returned error or invalid data:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching data list:', error);
        tyres.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    InitfetchData();
});
</script>
