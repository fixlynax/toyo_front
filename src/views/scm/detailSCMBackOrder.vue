<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- LEFT COLUMN -->
      <div class="md:w-2/3">
        <div class="card flex flex-col gap-6 w-full">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2">
            Back Order Detail
          </div>

          <!-- Account Info -->
          <div class="flex items-center justify-between w-full">
            <div>
              <span class="block text-sm text-gray-500">Customer Account No.</span>
              <span class="text-lg font-medium">{{ backOrder.custAccountNo }}</span>
            </div>
          </div>

          <!-- Dealer Info -->
          <div class="font-semibold text-xl border-b pb-2 mt-8">
            🏬 Dealer Information
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Dealer Name</span>
              <p class="text-lg font-medium">{{ backOrder.customerName }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Location</span>
              <p class="text-lg font-medium">{{ backOrder.location }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Signboard</span>
              <p class="text-lg font-medium">{{ backOrder.signboard }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Distribution Channel</span>
              <p class="text-lg font-medium">{{ backOrder.distributionChannel }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Contact Person</span>
              <p class="text-lg font-medium">{{ warrantyDetail.contactPerson }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Contact Number</span>
              <p class="text-lg font-medium">{{ warrantyDetail.contactNo }}</p>
            </div>
          </div>

          <!-- Tyre Info -->
          <div class="font-semibold text-xl border-b pb-2 mt-8">
            🛞 Tire Material & Description
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Tyre Size</span>
              <p class="text-lg font-medium">{{ tyre.size }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Tyre Spec</span>
              <p class="text-lg font-medium">{{ tyre.tyrespec || '-' }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Rim Diameter</span>
              <p class="text-lg font-medium">{{ tyre.rimDiameter || '-' }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Aspect Ratio</span>
              <p class="text-lg font-medium">{{ tyre.aspectRatio || '-' }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Section Width</span>
              <p class="text-lg font-medium">{{ tyre.sectionWidth }}</p>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="font-semibold text-xl border-b pb-2 mt-8">
            🚚 Shipping & Description
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Ship To</span>
              <p class="text-lg font-medium">{{ backOrder.shipTo }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Description</span>
              <p class="text-lg font-medium">{{ backOrder.orderDesc }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Shipping Cond</span>
              <p class="text-lg font-medium">{{ backOrder.shippingCond }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">Delivery Type</span>
              <p class="text-lg font-medium">{{ backOrder.deliveryType }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full">
              <span class="text-sm text-gray-500">Delivery Date</span>
              <p class="text-lg font-medium">{{ backOrder.deliveryDate }}</p>
            </div>
            <div class="w-full">
              <span class="text-sm text-gray-500">BO Order No</span>
              <p class="text-lg font-medium">{{ backOrder.boOrderNo }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="md:w-1/3 flex flex-col gap-6">
        <!-- Advance Info -->
        <div class="card flex flex-col w-full">
          <div class="flex items-center justify-between border-b pb-3 mb-4">
            <div class="text-2xl font-bold text-gray-800">Advance Info</div>
            <Tag
              :value="form.status === 1 ? 'Complete' : 'Pending'"
              :severity="form.status === 1 ? 'success' : 'warn'"
            />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <tbody>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Division</td>
                  <td class="px-4 py-2 text-right">{{ backOrder.division }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">SAP Order Type</td>
                  <td class="px-4 py-2 text-right">{{ backOrder.sapOrderType }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Sales ORG</td>
                  <td class="px-4 py-2 text-right">{{ backOrder.salesOrg }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Order Date</td>
                  <td class="px-4 py-2 text-right">{{ backOrder.deliveryDate }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Expiry</td>
                  <td class="px-4 py-2 text-right">{{ backOrder.expiry }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="px-4 py-2 text-right">
                    <RouterLink to="/billing">
                      <Button label="Push Order" size="small" />
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="card flex flex-col w-full">
          <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">
            👤 Customer Info
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <tbody>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Customer Name</td>
                  <td class="px-4 py-2 text-right">{{ customerInfo.name }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Vehicle</td>
                  <td class="px-4 py-2 text-right">{{ customerInfo.vehicle }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-medium">Registration Number</td>
                  <td class="px-4 py-2 text-right">{{ customerInfo.regNo }}</td>
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
import { ref } from 'vue'

const form = ref({
  status: 0,
})

const backOrder = ref({
  custAccountNo: '6080100900',
  customerName: 'PS Tyres & Battery Auto Services Sdn. Bhd',
  location: '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia',
  signboard: 'T10',
  salesOrg: 'SO001',
  distributionChannel: 'ETEN',
  division: 'DIV01',
  sapOrderType: 'NORMAL',
  shipTo: 'YESSIR TYRES SOLUTION SDN BHD',
  shippingCond: 'Standard',
  orderDesc: 'Order for electronics',
  deliveryType: 'DELIVER',
  deliveryDate: '2023-10-15',
  boOrderNo: 'BO1001',
  expiry: '2023-11-15',
})

const tyre = ref({
  size: '215/45R17',
  tyrespec: '91W',
  rimDiameter: 17,
  aspectRatio: '45',
  sectionWidth: '215',
})

const customerInfo = ref({
  name: 'Lee Wei Ming',
  vehicle: 'Toyota Hilux 2.8G',
  regNo: 'WXY 4567',
})

const warrantyDetail = ref({
  contactPerson: 'Ahmad Zaki',
  contactNo: '+6012-3456789',
})
</script>
