<template>
    <Fluid>
        <!-- Create Order Form -->
        <div class="card flex flex-col gap-6">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Create Return Order</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <Dropdown optionLabel="name" placeholder="Select a Customer" class="w-full" />
                </div>

                <div class="md:col-span-2">
                    <label class="block font-bold text-gray-700">Order Type</label>
                    <Dropdown placeholder="Select Order Type" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700">Delivery Method</label>
                    <Dropdown placeholder="Select Delivery Method" class="w-full" />
                </div>

                <div>
                    <label class="block font-bold text-gray-700">Delivery Option</label>
                    <Dropdown placeholder="Select Delivery Option" class="w-full" />
                </div>
            </div>
        </div>
    </Fluid>
</template>
