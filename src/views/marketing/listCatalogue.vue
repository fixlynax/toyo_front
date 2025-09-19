<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Advanced</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="firstname2">Firstname</label>
                        <InputText id="firstname2" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Lastname</label>
                        <InputText id="lastname2" type="text" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="address">Address</label>
                    <Textarea id="address" rows="4" />
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="state">State</label>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="zip">Zip</label>
                        <InputText id="zip" type="text" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
