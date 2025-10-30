<template>

    <div class="card flex items-center justify-center flex-col gap-6 w-full py-2 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <!-- Toyo Tires Logo -->
      <img
        src="/public/demo/images/toyo_logo.png"
        alt="Toyo Tires"
        class="h-10 md:h-10 animate-pulse"
        style="object-fit: contain;"
      />

      <img
        src="/public/demo/images/tire.gif"
        alt="Toyo Tires"
        class="h-20 md:h-28 animate-pulse"
        style="object-fit: contain;"
      />

      <!-- Text -->
      <p class="text-sky-700 dark:text-sky-400 font-semibold tracking-wide text-lg">
        <!-- Loading Toyo Tires... -->
        {{ message }}
      </p>

      <!-- Subtext shimmer -->
      <p class="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
        <!-- Please wait a moment -->
        {{ subMessage }}
      </p>
    </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading Toyo Tires...'
  },
  subMessage: {
    type: String,
    default: 'Please wait a moment'
  },
  showProgress: {
    type: Boolean,
    default: false
  }
})
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
