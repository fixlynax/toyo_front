<template>
    <div class="flex flex-col items-center justify-center gap-6 w-full h-full bg-white/50 dark:bg-gray-900 rounded-2xl mt-8">
        <img src="/public/demo/images/toyo_logo.png" alt="Toyo Tires" class="h-10 md:h-10 animate-pulse" style="object-fit: contain" />

        <img src="/public/demo/images/tire.gif" alt="Toyo Tires" class="h-20 md:h-28 animate-pulse" style="object-fit: contain" />

        <p class="text-sky-700 dark:text-sky-400 font-semibold tracking-wide text-xl">
            {{ randomMessage }}
        </p>

        <p class="text-gray-500 dark:text-gray-400 text-m animate-pulse">
            {{ subMessage }}
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    message: {
        type: [String, Array],
        default: () => [
            'Loading Toyo Tires...',
            'Checking tire pressure...',
            'Starting engine...',
            'Preparing performance data...',
            'Revving up system...',
            'Warming up the track...',
            'Balancing tire grip...',
            'Polishing alloy rims...',
            'Optimizing traction control...',
            'Aligning suspension geometry...',
            'Spinning test wheel...',
            'Measuring tread depth...',
            'Calibrating speed sensors...',
            'Loading high-performance settings...',
            'Engaging turbo boost...',
            'Fueling virtual tank...',
            'Checking road conditions...',
            'Inspecting brake system...',
            'Lubricating drivetrain...',
            'Tightening lug nuts...',
            'Warming up the pit crew...',
            'Scanning for optimal performance...',
            'Finalizing tire rotation data...',
            'Setting race mode...',
            'Burning some virtual rubber...'
        ]
    },
    subMessage: {
        type: String,
        default: 'Please wait a moment'
    },
    showProgress: {
        type: Boolean,
        default: false
    }
});

const randomMessage = computed(() => {
    return Array.isArray(props.message) ? props.message[Math.floor(Math.random() * props.message.length)] : props.message;
});
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
.animate-spin {
    animation: spin 1s linear infinite;
}
</style>

