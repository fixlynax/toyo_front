<template>
  <div class="flex mt-8">
    <div class="card flex items-center justify-center flex-col gap-6 w-full py-2 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <!-- Toyo Tires Logo -->
      <img
        src="/public/demo/images/toyo_tires.png"
        alt="Toyo Tires"
        class="h-40 md:h-48 animate-pulse"
        style="object-fit: contain;"
      />

      

      <!-- Circular Loader -->
      <!-- <div class="relative w-16 h-16">
        <div class="absolute w-full h-full rounded-full border-4 border-sky-600"></div>
        <div class="absolute w-full h-full rounded-full border-4 border-sky-700 border-t-transparent animate-spin"></div>
      </div> -->

      <img
        src="/public/demo/images/tire.gif"
        alt="Toyo Tires"
        class="h-20 md:h-28 animate-pulse"
        style="object-fit: contain;"
      />

      <!-- Text -->
      <p class="mt-2 text-sky-700 dark:text-sky-400 font-semibold tracking-wide text-lg">
        Loading Toyo Tires...
      </p>

      <!-- Subtext shimmer -->
      <p class="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
        Please wait a moment
      </p>
    </div>
  </div>
</template>

<script setup>
// No props needed, just a presentational loader
</script>

<style scoped>
/* Smooth spin */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
