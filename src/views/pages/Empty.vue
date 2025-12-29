<template>
    <div className="card text-center">
        <i class="pi pi-lock text-red-500 mb-4 " style="--p-icon-size: 3rem;"></i>
        <h1 class="text-2xl font-semibold mb-2 mt-2">
            403 Forbidden
        </h1>
        <p class="text-gray-600 mb-6">
            You do not have permission to access this page.
            Please contact your administrator if you believe this is a mistake.
        </p>
        <div class="flex justify-center gap-3">
            <Button
                label="Go Back"
                icon="pi pi-arrow-left"
                class="p-button-text"
                @click="$router.back()"
            />

            <Button
                label="Dashboard"
                icon="pi pi-home"
                class="p-button-primary"
                @click="$router.push('/')"
            />
        </div>
    </div>
</template>
