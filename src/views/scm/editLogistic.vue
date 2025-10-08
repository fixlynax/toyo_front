<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Column: Edit Logistic Info -->
      <div class="md:w-2/3 flex flex-col space-y-8">
        <!-- Edit Logistic Card -->
        <div class="card flex flex-col gap-6 w-full p-4">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Logistic Information</div>

          <!-- Order No -->
          <div class="flex items-center justify-between w-full mb-4">
            <div class="w-full">
              <label class="block font-bold text-gray-700 mb-1">Order No</label>
              <input v-model="logistic.orderNo" type="text" class="w-full border p-2 rounded" />
            </div>
          </div>

          <!-- Logistic Details Header -->
          <div class="font-semibold text-xl border-b pb-2 mt-4">👤 Logistic Details</div>

          <!-- Company Name -->
          <div>
            <label class="block font-bold text-gray-700 mb-1">Company Name</label>
            <input v-model="logistic.companyName" type="text" class="w-full border p-2 rounded" />
          </div>

          <!-- Address -->
          <div>
            <label class="block font-bold text-gray-700 mb-1">Address</label>
            <input v-model="logistic.address" type="text" class="w-full border p-2 rounded" />
          </div>

          <!-- City & Postcode -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">City</label>
              <input v-model="logistic.city" type="text" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Postcode</label>
              <input v-model="logistic.postcode" type="text" class="w-full border p-2 rounded" />
            </div>
          </div>

          <!-- State & Status -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">State</label>
              <select v-model="logistic.state" class="w-full border p-2 rounded">
                <option disabled value="">Select State</option>
                <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Status</label>
              <select v-model="logistic.status" class="w-full border p-2 rounded">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Contact Person</label>
              <input v-model="logistic.contactPerson" type="text" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Contact No</label>
              <input v-model="logistic.contactNo" type="text" class="w-full border p-2 rounded" />
            </div>
          </div>

          <!-- Username & Email -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Username</label>
              <input v-model="logistic.username" type="text" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Email</label>
              <input v-model="logistic.email" type="email" class="w-full border p-2 rounded" />
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end mt-6">
            <button @click="saveChanges" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </div>

        <!-- Ship To table (unchanged, still shows data) -->
        <div class="card flex flex-col w-full">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">🚚 Ship To</div>
          <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
            <Column field="companyName1" header="Company Name" style="min-width: 15rem" />
            <Column header="Address" style="min-width: 20rem">
              <template #body="{ data }">
                {{ data.addressLine1 }}<br />
                <span v-if="data.addressLine2">{{ data.addressLine2 }}<br /></span>
                <span v-if="data.addressLine3">{{ data.addressLine3 }}<br /></span>
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
        <div class="card flex flex-col w-full mb-4">
          <div class="flex items-center justify-between border-b pb-2 mb-2">
            <div class="text-2xl font-bold text-gray-800">Account Info</div>
            <Tag
              :value="logistic.status === '1' ? 'Active' : 'Inactive'"
              :severity="logistic.status === '1' ? 'success' : 'danger'"
            />
          </div>

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
    </div>
  </Fluid>
</template>

<script setup>
import { ref } from 'vue'

const logistic = ref({
  companyName: 'JNT',
  orderNo: 'ORD001',
  accountNo: '6080100900',
  contactPerson: 'John Doe',
  contactNo: '123-456-7890',
  address: 'Toyo Tires Malaysia, Jalan Toyo, Off Jalan Klang Lama',
  city: 'Shah Alam',
  postcode: '47301',
  state: 'Selangor',
  email: 'contact@jntlogistics.com',
  username: 'jnt_user01',
  status: '1',
  createdSince: '2023-01-15',
  lastLogin: '2023-10-01'
})

const states = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak',
  'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'
]

const shiptoList = ref([
  {
    id: 1,
    companyName1: 'Tan Know Car Tires',
    addressLine1: 'Lot 123, Jalan Sungai',
    addressLine2: 'Seksyen 15',
    city: 'Shah Alam',
    state: 'Selangor',
    postcode: '40150',
    country: 'Malaysia',
    phoneNumber: '03-55123456',
    emailAddress: 'info@toyotires.my'
  },
  {
    id: 2,
    companyName1: 'Shiro Auto Parts',
    addressLine1: 'No 45, Jalan Merdeka',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    postcode: '50450',
    country: 'Malaysia',
    phoneNumber: '03-98765432',
    emailAddress: 'contact@shiroauto.com'
  }
])

const saveChanges = () => {
  console.log('Updated Logistic Data:', logistic.value)
  alert('Logistic details updated successfully!')
}
</script>
