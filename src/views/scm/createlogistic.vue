<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Column: Logistic Details and Ship To -->
      <div class="md:w-2/3 flex flex-col space-y-8">
        <!-- Logistic Details Card -->
        <div class="card flex flex-col gap-6 w-full">
          <!-- Title -->
          <div class="text-2xl font-bold text-gray-800 border-b pb-2">Logistic Details</div>
          
          <!-- Order No and Edit Button -->
          <div class="flex items-center justify-between w-full">
            <div>
              <span class="block text-xs font-bold text-black-700">Order No.</span>
              <span class="text-lg font-medium">{{ logistic.orderNo }}</span>
            </div>
            <RouterLink to="/marketing/editLogistic">
              <Button type="button" label="Edit" />
            </RouterLink>
          </div>
          
          <!-- Logistic Details Header -->
          <div class="font-semibold text-xl border-b pb-2 mt-8">👤 Logistic Details</div>
          
          <!-- Company Name and Address -->
          <div class="w-full mb-4">
            <h1 class="text-2xl font-bold text-gray-800">{{ logistic.companyName }}</h1>
            <span class="text-xs font-bold text-black-700">Address</span>
            <p class="text-lg font-medium">{{ logistic.address }}</p>
          </div>
          
          <!-- Contact Info -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Contact Person</span>
              <p class="text-lg font-medium">{{ logistic.contactPerson }}</p>
            </div>
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Contact No</span>
              <p class="text-lg font-medium">{{ logistic.contactNo }}</p>
            </div>
          </div>
          
          <!-- City, Postcode, State -->
          <div class="flex flex-col md:flex-row gap-3 mb-3">
            <div class="w-full md:w-1/3">
              <span class="text-xs font-bold text-black-700">City</span>
              <p class="text-lg font-medium">{{ logistic.city }}</p>
            </div>
            <div class="w-full md:w-1/3">
              <span class="text-xs font-bold text-black-700">Postcode</span>
              <p class="text-lg font-medium">{{ logistic.postcode }}</p>
            </div>
            <div class="w-full md:w-1/3">
              <span class="text-xs font-bold text-black-700">State</span>
              <p class="text-lg font-medium">{{ logistic.state }}</p>
            </div>
          </div>
        </div>

        <!-- "Ship To" card -->
        <div class="card flex flex-col w-full">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">🚚 Ship To</div>
          <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
            <!-- Columns -->
            <Column field="companyName1" header="Company Name" style="min-width: 15rem" />
            <Column header="Address" style="min-width: 20rem">
              <template #body="{ data }">
                {{ data.addressLine1 }}<br />
                <span v-if="data.addressLine2">{{ data.addressLine2 }}<br /></span>
                <span v-if="data.addressLine3">{{ data.addressLine3 }}<br /></span>
                <span v-if="data.addressLine4">{{ data.addressLine4 }}</span>
                {{ data.city }}, {{ data.state }} {{ data.postcode }}<br />
                {{ data.country }}
              </template>
            </Column>
            <Column field="phoneNumber" header="Phone No" style="min-width: 10rem" />
            <Column field="emailAddress" header="Email" style="min-width: 14rem" />
          </DataTable>
        </div>
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
                  <td class="px-4 py-2 font-medium">Account No</td>
                  <td class="px-4 py-2 text-right">{{ logistic.accountNo }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Created Since</td>
                  <td class="px-4 py-2 text-right">{{ logistic.createdSince }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Last Login</td>
                  <td class="px-4 py-2 text-right">{{ logistic.lastLogin }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Additional sidebar content can stay here -->
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const logistic = ref({
  companyName: 'JNT Logistics',
  orderNo: 'LOG12345',
  accountNo: '6080100900',
  contactPerson: 'Jane Doe',
  contactNo: '012-3456789',
  address: '123 Logistic St, Industrial Area',
  city: 'Kuala Lumpur',
  postcode: '50450',
  state: 'Wilayah Persekutuan',
  email: 'logistics@company.com',
  username: 'logistics_user',
  status: '1',
  createdSince: '2022-01-10T09:30:00',
  lastLogin: '2023-10-01T14:45:00',
});

const shiptoList = ref([
  {
    id: 1,
    companyName1: 'Main Warehouse',
    addressLine1: 'Lot 123, Jalan Sg. Wang',
    addressLine2: 'Seksyen 15',
    addressLine3: '',
    addressLine4: '',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    postcode: '50450',
    country: 'Malaysia',
    phoneNumber: '03-55123456',
    emailAddress: 'warehouse@logistics.com'
  },
  // add more as needed
]);
</script>