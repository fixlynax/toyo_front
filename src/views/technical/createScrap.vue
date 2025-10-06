<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="card flex flex-col gap-6 w-full">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Scrap</div>

        <!-- Scrap Details in a vertical sequence -->
        <div class="flex flex-col space-y-4">
          <!-- Step 1: Damage Code -->
          <div>
            <label class="block font-bold text-gray-700 mb-2">Damage Code</label>
            <select class="w-full border border-gray-300 rounded p-2" v-model="damageCode">
              <option disabled value="">Select Damage Code</option>
              <option value="damage1">D102-Sidewall Separation</option>
              <option value="damage2">D210-Tread Separation</option>
              <option value="damage3">D305-Noise/Vibration</option>
              <option value="damage4">D405-Impact Damage</option>
              <option value="damage5">D220-Sidewall Bulge</option>
              <option value="damage6">D130-Groove Cracking</option>
              <option value="damage7">D499-External Damage</option>
              <!-- Add more options as needed -->
            </select>
          </div>

          <!-- Step 2: Description -->
          <div>
            <label class="block font-bold text-gray-700 mb-2">Description</label>
            <!-- Use textarea for bigger input area -->
            <textarea
              class="w-full border border-gray-300 rounded p-2 h-20 resize-none"
              v-model="description"
              rows="2"
            ></textarea>
          </div>

          <!-- Step 3: Additional Info in one line with sliders -->
          <div class="flex space-x-4 mt-4 items-center">
            <!-- Claim % -->
            <div class="flex-1">
              <label class="block font-bold text-gray-700 mb-2">Claim %</label>
              <input
                type="range"
                min="0"
                max="100"
                v-model="claimPercentage"
                class="w-full"
              />
              <div class="text-center mt-1">{{ claimPercentage }}%</div>
            </div>

            <!-- Usable % -->
            <div class="flex-1">
              <label class="block font-bold text-gray-700 mb-2">Usable %</label>
              <input
                type="range"
                min="0"
                max="100"
                v-model="usablePercentage"
                class="w-full"
              />
              <div class="text-center mt-1">{{ usablePercentage }}%</div>
            </div>

            <!-- Worn % -->
            <div class="flex-1">
              <label class="block font-bold text-gray-700 mb-2">Worn %</label>
              <input
                type="range"
                min="0"
                max="100"
                v-model="wornPercentage"
                class="w-full"
              />
              <div class="text-center mt-1">{{ wornPercentage }}%</div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-start mt-8">
          <div class="w-40">
            <RouterLink to="/technical/detailWarantyClaim">
              <Button label="Submit" class="w-full p-button-success" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const damageCode = ref('');
const description = ref('');
const claimPercentage = ref(50); // default value
const usablePercentage = ref(50); // default value
const wornPercentage = ref(50); // default value
</script>