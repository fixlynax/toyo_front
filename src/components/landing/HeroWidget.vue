<template>
    <div
        id="hero"
        class="flex flex-col-reverse md:flex-row items-center justify-between pt-40 pb-40 px-6 md:px-16 lg:px-40 overflow-hidden"
        style="background: linear-gradient(135deg, #dbeafe 0%, #2563eb1a 100%); clip-path: ellipse(150% 90% at 93% 10%)"
    >
        <!-- Left Content -->
        <div class="text-center md:text-left md:w-1/2 space-y-6">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span class="block font-light text-blue-600">Drive the Future</span>
                with TOYO Admin
            </h1>
            <p class="text-gray-600 text-lg md:text-xl leading-relaxed">Empowering your business with smart management tools for marketing, order tracking, and performance insight — all in one platform.</p>
            <div class="flex justify-center md:justify-start mb-29">
                <Button label="Get Started" as="router-link" to="/login" rounded class="!text-lg md:!text-xl !px-8 !py-3 mt-4 bg-blue-600 hover:bg-blue-700 border-none text-white shadow-md" />
            </div>
        </div>

        <!-- Right Image -->
        <div class="flex justify-center md:justify-end md:w-1/2">
            <img src="/demo/images/toyor_tayar4.png" alt="Hero Image" class="w-1/12 md:w-9/12 lg:w-8/12 object-contain drop-shadow-lg" />
        </div>
    </div>
</template>
