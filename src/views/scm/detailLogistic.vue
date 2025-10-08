<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Column: Logistic Details and Ship To -->
      <div class="md:w-2/3 flex flex-col space-y-8">
        <!-- Logistic Details Card -->
        <div class="card flex flex-col gap-6 w-full">
          <!-- Title -->
          <div class="text-2xl font-bold text-gray-800 border-b pb-2">Logistic Information</div>
          
          <!-- Order No and Edit Button -->
          <div class="flex items-center justify-between w-full">
            <div>
              <span class="block text-xs font-bold text-black-700">Order No.</span>
              <span class="text-lg font-medium">{{ logistic.orderNo }}</span>
            </div>
            <RouterLink to="/scm/editLogistic">
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
          
          <!-- Username and Email -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Username</span>
              <p class="text-lg font-medium">{{ logistic.username }}</p>
            </div>
            <div class="w-full md:w-1/2">
              <span class="text-xs font-bold text-black-700">Email</span>
              <p class="text-lg font-medium">{{ logistic.email }}</p>
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
        <!-- Other sidebar content can stay here -->
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const memberDetail = ref({
    id: 10,
    etenUserID: 'EU1010',
    countryCode: '60',
    mobileNumber: '1890123456',
    password: 'hashed_pw_10',
    firstName: 'Faizal',
    lastName: 'Rahman',
    emailAddress: 'faizal.rahman@toyotires.com.my',
    gender: 'Male',
    race: 'Malay',
    state: 'Sabah',
    level: 'Silver',
    memberSince: '2025-04-20',
    lastLogin: '2025-08-01 12:05:00',
    allow_warranty: 0,
    allow_order: 1,
    allow_billing: 0,
    allow_sale: 1,
    allow_user: 0,
    activationCode: 'ACT01234',
    isMaster: 0,
    device: 'Windows Laptop',
    platform: 'Web',
    fcmToken: 'fcm_token_10',
    status: 1,
    activated: 1,
    created: '2025-04-20',
    deleted: 0
});

const showPassword = ref(false);

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
    shippingPoints: ['JNT'],
    createdSince: '2023-01-15T09:30:00',
    lastLogin: '2023-10-01T14:45:00'
});
// 1. Suspend/Un-Activated
const isActivated = ref(false);
const confirmSuspend = () => {
    isActivated.value = !isActivated.value;
};

// 2. Block/Un-block Device List
const devices = ref([
    {
        id: 1,
        name: 'Windows Laptop',
        uniqueId: '00008030-001E3D400043402E',
        lastActive: '8/9/2025 10:54 pm',
        isBlocked: true
    }
]);

const toggleBlock = (device) => {
    device.isBlocked = !device.isBlocked;
};

const users = ref([
    { id: 'U001', name: 'John Doe', phone: '0123456789', account: '6080100900', lastLogin: '11/9/2025 8:00am', status: 1 },
    { id: 'U002', name: 'Jane Smith', phone: '0198765432', account: '6080100901', lastLogin: '10/9/2025 8:00am', status: 1 },
    { id: 'U003', name: 'Alex Tan', phone: '0172233445', account: '6080100902', lastLogin: '23/7/2025 8:00am', status: 0 },
    { id: 'U004', name: 'Siti Aminah', phone: '0111122233', account: '6080100903', lastLogin: '09/9/2025 8:00am', status: 1 },
    { id: 'U005', name: 'Michael Lee', phone: '0139988776', account: '6080100904', lastLogin: '07/8/2025 8:00am', status: 0 }
]);

const billingDocs = ref([
    { id: 1, name: 'Invoice #001', type: 'Invoice' },
    { id: 2, name: 'Credit Note #100', type: 'CN' },
    { id: 3, name: 'Debit Note #200', type: 'DN' },
    { id: 4, name: 'SOA Jan 2025', type: 'SOA Statement' },
    { id: 5, name: 'Refund Note #10', type: 'Refund Note' }
]);

const viewDoc = (doc) => {
    console.log('Viewing billing document:', doc);
};

// 4. Finance Documents
const financeDocs = ref([
    { id: 1, name: 'Payment Receipt' },
    { id: 2, name: 'Tax Certificate' },
    { id: 3, name: 'Bank Statement' },
    { id: 4, name: 'Audit Report' },
    { id: 5, name: 'Financial Summary' }
]);

const viewFinance = (doc) => {
    console.log('Viewing finance document:', doc);
};

const manageUser = (user) => {
    console.log('Managing user:', user);
};

const shiptoList = ref([
    {
        id: 1,
        companyName1: 'Tan Know Car Tires',
        companyName2: '',
        companyName3: '',
        companyName4: '',
        addressLine1: 'Lot 123, Jalan Sungai',
        addressLine2: 'Seksyen 15',
        addressLine3: '',
        addressLine4: '',
        city: 'Shah Alam',
        state: 'Selangor',
        postcode: '40150',
        country: 'Malaysia',
        phoneNumber: '03-55123456',
        mobileNumber: '012-3456789',
        emailAddress: 'info@toyotires.my'
    },
    {
        id: 2,
        companyName1: 'Shiro Auto Parts',
        companyName2: 'Warehouse Division',
        companyName3: '',
        companyName4: '',
        addressLine1: 'No 45, Jalan Merdeka',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        postcode: '50450',
        country: 'Malaysia',
        phoneNumber: '03-98765432',
        mobileNumber: '019-8765432',
        emailAddress: 'contact@shiroauto.com'
    }
]);
</script>
