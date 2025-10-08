<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="card flex flex-col gap-6 w-full p-4">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Create Logistic</div>

        <!-- Logistic Details Form -->
        <div>
          <!-- First Row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Company Name</label>
              <input v-model="form.companyName" type="text" placeholder="Enter Company Name" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Order No</label>
              <input v-model="form.orderNo" type="text" placeholder="Enter Order Number" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Address</label>
              <input v-model="form.address" type="text" placeholder="Enter Address" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">City</label>
              <input v-model="form.city" type="text" placeholder="Enter City" class="w-full border p-2 rounded" />
            </div>
          </div>

          <!-- Second Row -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">State</label>
              <select v-model="form.state" class="w-full border p-2 rounded">
                <option disabled value="">Select State</option>
                <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Postcode</label>
              <input v-model="form.postcode" type="text" placeholder="Enter Postcode" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Contact Person</label>
              <input v-model="form.contactPerson" type="text" placeholder="Enter Contact Person" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Contact No</label>
              <input v-model="form.contactNo" type="text" placeholder="Enter Contact Number" class="w-full border p-2 rounded" />
            </div>
          </div>

          <!-- Third Row -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" placeholder="Enter Email" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Status</label>
              <select v-model="form.status" class="w-full border p-2 rounded">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end mt-4">
            <button @click="submitForm" class="bg-blue-500 text-white px-4 py-2 rounded">
              Create Logistic
            </button>
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { reactive } from 'vue'

// reactive form data
const form = reactive({
  companyName: '',
  orderNo: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  contactPerson: '',
  contactNo: '',
  email: '',
  status: '1'
})

// list of states (example)
const states = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak',
  'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'
]

// submit logic
const submitForm = () => {
  console.log('Submitted data:', form)
  alert('Logistic created successfully!')
}
</script>
