<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Scrap</div>

                <!-- Dealer Details -->
                <div>
                    <div class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">🏢 Scrap Details</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700">Damage Code</label>
                            <InputText class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Description</label>
                            <InputText class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Claim %</label>
                            <Calendar class="w-full" placeholder="Select Date " showIcon icon="pi pi-calendar" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Usable %</label>
                            <Calendar timeOnly hourFormat="12" class="w-full" placeholder="Select time " showIcon icon="pi pi-clock" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Worn %</label>
                            <InputText class="w-full" />
                        </div>
                    </div>

                    <div class="flex justify-start mt-8">
                        <div class="w-40">
                            <RouterLink to="/technical/detailWarantyClaim">
                                <Button label="Submit" class="w-full p-button-success" />
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
</script>
