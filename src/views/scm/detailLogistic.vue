<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Column: Logistic Details and Ship To -->
      <div class="md:w-2/3 flex flex-col">
        <!-- Logistic Details Card -->
        <div class="card flex flex-col gap-6 w-full">
          <!-- Title -->
          <div class="flex items-center justify-between w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Logistic Information</div>

          <RouterLink to="/scm/editLogistic">
              <Button type="button" label="Edit" />
            </RouterLink>
          </div>
          
          
          <!-- Company Name and Address -->
          <div class="w-full mb-4">
            <h1 class="text-2xl font-bold text-gray-800">{{ logistic.companyName }}</h1>
            <span class="text-xs font-bold text-black-700">Address</span>
            <p class="text-lg font-medium">{{ logistic.address }}</p>
          </div>
          
          <!-- Username and Email -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Username</span>
              <p class="text-lg font-medium">{{ logistic.username }}</p>
            </div>
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Password</span>
              <p class="text-lg font-medium">{{ logistic.password }}</p>
            </div>
          </div>
          
          <!-- Contact Person and Contact Number -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Contact Person</span>
              <p class="text-lg font-medium">{{ logistic.contactPerson }}</p>
            </div>
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Contact Number</span>
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

        <!-- "Ship To" card as full width inside left column -->
        <div class="card flex flex-col w-full">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">🚚 Ship To</div>
          <DataTable :value="shiptoList" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
            <!-- Columns -->
            <Column field="code" header="Storage Location" style="min-width: 15rem" />
            <Column field="name" header="Name" style="min-width: 20rem"></Column>
            <Column field="description" header="Description" style="min-width: 10rem" />
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
        <!-- Other sidebar content can stay here -->
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { ref } from 'vue';

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
</script>
