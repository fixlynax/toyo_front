<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left: Dealer & Shipping Info -->
      <div class="card flex flex-col gap-6 w-full">
        <!-- Header -->
        <div class="flex items-center gap-2 border-b pb-2">
          <RouterLink to="/om/listOrder">
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
          </RouterLink>
          <div class="text-2xl font-bold text-gray-800">Confirmation Order</div>
        </div>

        <!-- Dealer Details -->
        <div>
          <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Dealer Details</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700">Company Name</label>
              <p class="text-gray-900">{{ order.companyName }}</p>
            </div>
            <div>
              <label class="block font-bold text-gray-700">Address</label>
              <p class="text-gray-900">{{ order.address }}</p>
            </div>
            <div>
              <label class="block font-bold text-gray-700">Dealer Accno</label>
              <p class="text-gray-900">{{ order.dealerAccno }}</p>
            </div>
            <div>
              <label class="block font-bold text-gray-700">Branch Location</label>
              <p class="text-gray-900">{{ order.branchLocation }}</p>
            </div>
          </div>
        </div>

        <!-- Order Type & Delivery -->
        <div>
          <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🚚 Delivery Details</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-gray-700">Order Type</label>
              <p class="text-gray-900">{{ order.orderType }}</p>
            </div>
            <div v-if="order.orderType !== 'DS'">
              <label class="block font-bold text-gray-700">Delivery Method</label>
              <p class="text-gray-900">{{ order.deliveryMethod }}</p>
            </div>
            <div v-if="order.orderType === 'DS'">
              <label class="block font-bold text-gray-700">Container Size</label>
              <p class="text-gray-900">{{ order.containerSize }}</p>
            </div>
          </div>

          <div v-if="['Delivery', 'Lalamove'].includes(order.deliveryMethod)">
            <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4 mt-4">📍 Ship To Details</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-gray-700">Ship To Account No.</label>
                <p class="text-gray-900">{{ order.shipToAccount }}</p>
              </div>
              <div>
                <label class="block font-bold text-gray-700">Ship To Address</label>
                <p class="text-gray-900">{{ order.shipToAddress }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Product / Item Details -->
      <div class="card flex flex-col gap-6 w-full">
        <div class="flex items-center justify-between border-b pb-2 mb-4">
          <div class="text-2xl font-bold text-gray-800">📦 Product Details</div>
          <Button v-if="order.orderType === 'DS'" icon="pi pi-file-import" label="Import Order" style="width: fit-content" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-gray-700">Pattern</label>
            <p class="text-gray-900">{{ order.pattern }}</p>
          </div>
          <div>
            <label class="block font-bold text-gray-700">Size</label>
            <p class="text-gray-900">{{ order.size }}</p>
          </div>
          <div>
            <label class="block font-bold text-gray-700">Quantity</label>
            <p class="text-gray-900">{{ order.quantity }}</p>
          </div>
          <div>
            <label class="block font-bold text-gray-700">Price</label>
            <p class="text-gray-900">RM {{ order.price.toFixed(2) }}</p>
          </div>
          <div>
            <label class="block font-bold text-gray-700">Subtotal</label>
            <p class="text-gray-900">RM {{ (order.price * order.quantity).toFixed(2) }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-8 gap-4">
          <div class="w-40">
            <Button label="Edit" class="p-button-secondary" @click="router.back()" />
          </div>
          <div class="w-40">
            <Button label="Submit" class="p-button" @click="handleSubmit" />
          </div>
        </div>
      </div>
    </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// Example order object reflecting Create Order form
const order = ref({
  companyName: 'Tack Lim Service Tires',
  address: '123 Jalan Ampang, Kuala Lumpur',
  dealerAccno: 'TLST123438',
  branchLocation: 'Kuala Lumpur',
  orderType: 'Normal', // 'Normal' | 'DS' | 'Own-Use'
  deliveryMethod: 'Delivery', // Only if not DS
  containerSize: '', // Only if DS
  shipToAccount: 'ACC-1234', // only for delivery/Lalamove
  shipToAddress: '45 Jalan Bukit Bintang, KL',
  pattern: 'Classic Stripe',
  size: '225/45R17 94W',
  quantity: 4,
  price: 320.5
});

const handleSubmit = () => {
  console.log('Submitting confirmed order:', order.value);
};
</script>
