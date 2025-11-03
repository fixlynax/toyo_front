<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Sales Program</div>

                <!-- Sales Program Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="salesProgram.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="salesProgram.desc" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="salesProgram.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="salesProgram.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price Group</label>
                            <InputText v-model="salesProgram.priceGroup" class="w-full" />
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Program Type</label>
                        <InputText v-model="salesProgram.type" :options="typeOptions" optionValue="value" class="w-full" disabled />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Sales Program ID</label>
                        <InputText v-model="salesProgram.id" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                </div>

                <!-- Upload Image -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Upload Sales Program Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" customUpload @select="onImageSelect($event, 'image')" chooseLabel="Upload Program Image" class="w-full" />
                            <img v-if="salesProgram.image" :src="salesProgram.image" alt="Preview" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                        </div>
                    </div>
                </div>

                <!-- Criteria Section -->
                <div>
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <h2 class="text-xl font-bold text-gray-800">📋 Criteria</h2>
                    </div>

                    <div v-if="programItems.length" class="space-y-6">
                        <div v-for="(item, index) in programItems" :key="index" class="rounded-xl border p-5 bg-gray-100 shadow-sm hover:shadow-md transition">
                            <!-- Header -->
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-semibold text-lg text-gray-800">Criteria {{ index + 1 }}</h3>
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removeProgramItem(index)" />
                            </div>

                            <!-- Quantities -->
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="text-sm text-gray-700 font-medium">Buy Qty</label>
                                    <InputNumber v-model="item.buyQty" :min="1" class="w-full" showButtons />
                                </div>
                                <div>
                                    <label class="text-sm text-gray-700 font-medium">Free Qty</label>
                                    <InputNumber v-model="item.freeQty" :min="1" class="w-full" showButtons />
                                </div>
                            </div>

                            <!-- Buy Section -->
                            <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2"><i class="pi pi-tags text-blue-600"></i> Buy Materials</h4>

                                <div class="flex flex-wrap gap-4 mb-3">
                                    <MultiSelect
                                        v-model="item.selectedBuyPatterns"
                                        :options="patternOptions"
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Patterns"
                                        class="flex-1"
                                        display="chip"
                                        :filter="true"
                                        @change="updateBuyMaterials(item)"
                                    />
                                    <MultiSelect
                                        v-model="item.selectedBuyRims"
                                        :options="rimDiameterOptions"
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Rims"
                                        class="flex-1"
                                        display="chip"
                                        :filter="true"
                                        @change="updateBuyMaterials(item)"
                                    />
                                </div>

                                <div v-if="item.availableBuyMaterials.length">
                                    <!-- Batch Action Bar -->
                                    <div v-if="item.selectedBuyMaterials.length" class="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-2">
                                        <span class="text-sm font-medium text-blue-700">
                                            {{ item.selectedBuyMaterials.length }} material(s) selected
                                        </span>
                                        <Button 
                                            icon="pi pi-times"
                                            label="Remove Selected"
                                            class="p-button-danger p-button-sm"
                                            @click="clearBuySelection(item)"
                                        />
                                    </div>

                                    <!-- Material List -->
                                    <div class="max-h-56 overflow-y-auto border rounded-lg divide-y">
                                        <div
                                            v-for="mat in item.availableBuyMaterials"
                                            :key="mat.id"
                                            class="flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-150"
                                            :class="isMaterialSelected(item.selectedBuyMaterials, mat.id)
                                                ? 'bg-blue-50 hover:bg-blue-100'
                                                : 'hover:bg-gray-50'"
                                            @click="toggleBuyMaterialSelection(item, mat)"
                                        >
                                            <Checkbox
                                                :inputId="'buyMat-' + mat.id"
                                                :binary="true"
                                                :modelValue="isMaterialSelected(item.selectedBuyMaterials, mat.id)"
                                                @change="toggleBuyMaterialSelection(item, mat)"
                                            />
                                            <div class="flex-1">
                                                <p class="font-medium text-sm">{{ mat.material }}</p>
                                                <p class="text-xs text-gray-500">Pattern: {{ mat.pattern }} | Rim: {{ mat.rimDiameter }}"</p>
                                            </div>
                                            <Button
                                                icon="pi pi-times"
                                                class="p-button-rounded p-button-text p-button-danger p-button-sm"
                                                @click.stop="removeBuyMaterial(item, mat.id)"
                                                v-tooltip.bottom="'Remove this material from list'"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p v-else class="text-sm text-gray-500 text-center py-3">No matching materials</p>
                            </div>

                            <!-- Free Section -->
                            <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                                <h4 class="font-semibold text-green-800 mb-3 flex items-center gap-2"><i class="pi pi-gift text-green-600"></i> Free Material</h4>

                                <div class="flex flex-wrap gap-4 mb-3">
                                    <Dropdown v-model="item.selectedFreePattern" :options="patternOptions" optionLabel="label" optionValue="value" placeholder="Pattern" class="flex-1" @change="updateFreeMaterial(item)" />
                                    <Dropdown v-model="item.selectedFreeRim" :options="rimDiameterOptions" optionLabel="label" optionValue="value" placeholder="Rim" class="flex-1" @change="updateFreeMaterial(item)" />
                                </div>

                                <div v-if="item.selectedFreeMaterial" class="p-3 border rounded-lg bg-white flex justify-between items-center">
                                    <div>
                                        <p class="font-medium text-green-800">{{ item.selectedFreeMaterial.material }}</p>
                                        <p class="text-xs text-gray-500">Pattern: {{ item.selectedFreeMaterial.pattern }} | Rim: {{ item.selectedFreeMaterial.rimDiameter }}"</p>
                                    </div>
                                    <Button icon="pi pi-times" class="p-button-text p-button-sm p-button-danger" @click="clearFreeSelection(item)" />
                                </div>
                                <p v-else class="text-sm text-gray-500 text-center py-3">No free material selected</p>
                            </div>
                        </div>

                        <!-- Add Criteria Button at Bottom -->
                        <div class="flex justify-center mt-8">
                            <Button icon="pi pi-plus" label="Add Criteria" class="p-button-success p-button-lg" :disabled="programItems.length >= 20" @click="addProgramItem" />
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                        <p class="text-lg">No criteria added yet</p>
                        <Button icon="pi pi-plus" label="Add Criteria" class="p-button-success mt-4" :disabled="programItems.length >= 20" @click="addProgramItem" />
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end mt-8">
                    <div class="w-40">
                        <Button label="Submit" class="w-full" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const salesProgram = ref({
    title: '',
    desc: '',
    startDate: '',
    endDate: '',
    priceGroup: '06',
    type: 'FOC',
    status: 1,
    image: ''
});

const typeOptions = [{ label: 'FOC (Free of Charge)', value: 'FOC' }];

const programItems = ref([]);

// Pattern Options with labels
const patternOptions = ref([
    { label: '735 - Toyo 350', value: '735' },
    { label: '510 - Temporary Spare', value: '510' },
    { label: 'NTL - NTINT1', value: 'NTL' },
    { label: '830 - 830 Series', value: '830' },
    { label: '852 - SG2A Series', value: '852' },
    { label: 'NIN - NTINV Series', value: 'NIN' },
    { label: 'NGM - NTGMT Series', value: 'NGM' },
    { label: '414 - 421A Series', value: '414' },
    { label: '41A - 421A Alternative', value: '41A' },
    { label: '42S - 420S Series', value: '42S' },
    { label: 'SD7 - Toyo SD7', value: 'SD7' },
    { label: '170 - M170 Series', value: '170' },
    { label: '320 - M320 Series', value: '320' },
    { label: '610 - M610 Series', value: '610' },
    { label: '627 - M627 Series', value: '627' },
    { label: 'CRQ - PXCR1F Series', value: 'CRQ' },
    { label: 'N03 - NE03 Series', value: 'N03' }
]);

// Rim Diameter Options with labels
const rimDiameterOptions = ref([
    { label: '13"', value: 13 },
    { label: '14"', value: 14 },
    { label: '15"', value: 15 },
    { label: '16"', value: 16 },
    { label: '17"', value: 17 },
    { label: '18"', value: 18 },
    { label: '19"', value: 19 },
    { label: '20"', value: 20 }
]);

// Materials data (same as before)
const materials = ref([
    {
        id: 39,
        materialID: '51113735003175T',
        material: '175/70R13 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 13,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 363,
        materialID: '51114510003115T',
        material: '1115/70D14 TEMPORARY SPARE SS...',
        materialType: 'ZTRD',
        pattern: '510',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 364,
        materialID: '51114735003185T',
        material: '185/70R14 8ST TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 365,
        materialID: '51114735004175T',
        material: '175/65R14 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 366,
        materialID: '51114735004185T',
        material: '185/65R14 8GT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 367,
        materialID: '51114735005185T',
        material: '185/60R14 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 40,
        materialID: '51115735004175T',
        material: '175/65R15 8HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 368,
        materialID: '51115735004185T',
        material: '185/65R15 8BT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 369,
        materialID: '51115735004195T',
        material: '195/65R15 9TT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 41,
        materialID: '51115735004205T',
        material: '205/65R15 9HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 370,
        materialID: '51115735005185T',
        material: '185/60R15 8HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 371,
        materialID: '51115735005195T',
        material: '195/60R15 8BT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 372,
        materialID: '51116510003105T',
        material: '1105/70R16 TEMPORARY SPARE SS...',
        materialType: 'ZTRD',
        pattern: '510',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 373,
        materialID: '61115NTN107205V',
        material: '205/50 R15 86V NTINT1 TLR 2R 1X',
        materialType: 'ZTRD',
        pattern: 'NTL',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 374,
        materialID: '61116N83005215W',
        material: '215/60 R16 99W 830 TLY GSS RD1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 375,
        materialID: '61116N83006205W',
        material: '205/55 R16 94W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 376,
        materialID: '61117SG24007215W',
        material: '215/50 R17 95W SG2A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '852',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 377,
        materialID: '61117SG24008225W',
        material: '225/45 R17 94W SG2A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '852',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 378,
        materialID: '61117N83006215W',
        material: '215/55 R17 98W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 379,
        materialID: '61117N83006225W',
        material: '225/55 R17 101W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 380,
        materialID: '61117N83007215W',
        material: '215/50 R17 95W 830 TLY GSS CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 381,
        materialID: '61117N83007225Y',
        material: '225/50 R17 98Y 830 TLY G2R CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 382,
        materialID: '61117NIN008225W',
        material: '225/45 R17 91W NTINVT.UK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 383,
        materialID: '61117NIN008235W',
        material: '235/45ZR17 94W NTINV TLY SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 384,
        materialID: '61118N83008225Y',
        material: '225/45 R18 95Y 830 TLY G1R CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 385,
        materialID: '61118N83008235W',
        material: '235/45 R18 98W 830 TLY GSS RD1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 386,
        materialID: '61118N83009235Y',
        material: '235/40 R18 95Y 830 TLY G1R CG1X',
        materialType: 'ZTRD',
        pattern: '830',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 387,
        materialID: '61118NIN008225W',
        material: '225/45 R18 91W NTINV TLYK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 388,
        materialID: '61118NIN008245W',
        material: '245/45 R18 96W NTINV TLYK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 389,
        materialID: '61118NIN009275W',
        material: '275/40ZR18 99W NTINV TLYK SS HK',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 390,
        materialID: '61119SG24008245Y',
        material: '245/45 R19 102Y SG2A TLZ G1R RD1X',
        materialType: 'ZTRD',
        pattern: '562',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 391,
        materialID: '61119NIN010025W',
        material: '235/35ZR19 91W NTINV TLYK SS RD...',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 392,
        materialID: '61120SG24009245Y',
        material: '245/40 R20 99Y SG2A TLZ G1R RD1X',
        materialType: 'ZTRD',
        pattern: '562',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 393,
        materialID: '61120NIN009245W',
        material: '245/40 R20 99W NTINV TLYK SS GEHX',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 394,
        materialID: '61120NIN010075W',
        material: '275/35ZR20 1020W NTINV TLY SS CG...',
        materialType: 'ZTRD',
        pattern: 'NIN',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 395,
        materialID: '62120NGMT003300Q',
        material: '33X1250 R20 114Q NTGMT TLB BETC',
        materialType: 'ZTRD',
        pattern: 'NGM',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 396,
        materialID: '62120NGMT003509',
        material: '35X1250 R20 1219 NTGMT TLE BEPT',
        materialType: 'ZTRD',
        pattern: 'NGM',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 397,
        materialID: '62517421404225V',
        material: '225/65 R17 106V 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '414',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 398,
        materialID: '62518421405225V',
        material: '225/60 R18 104V 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '414',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 399,
        materialID: '62518421A05235W',
        material: '235/60 R18 10/W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 400,
        materialID: '62518421A06235V',
        material: '235/55 R18 10/W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 401,
        materialID: '62519421A06225V',
        material: '225/55 R19 99V 421A TLZ GSS 1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 402,
        materialID: '62519421A06235W',
        material: '235/55 R19 105W 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 19,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 403,
        materialID: '62520420507265V',
        material: '265/50 R20 111V 420S TLV GSS RD1X',
        materialType: 'ZTRD',
        pattern: '42S',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 404,
        materialID: '62520421008245W',
        material: '245/45 R20 103W 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 405,
        materialID: '62520421008235W',
        material: '255/45 R20 105W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 406,
        materialID: '62520421008275W',
        material: '275/45 R20 110W 421A TLZ GSS RD1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 407,
        materialID: '62520421009275W',
        material: '275/40 R20 106W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 408,
        materialID: '62520421010315W',
        material: '315/35 R20 110W 421A TLZ GSS CG1X',
        materialType: 'ZTRD',
        pattern: '41A',
        patternName: '(NULL)',
        rimDiameter: 20,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 42,
        materialID: '71114750703185S',
        material: '185/70 R14 88S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: 'Toyo SD7',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 43,
        materialID: '71114750704175S',
        material: '175/65 R14 82S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: 'Toyo SD7',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 409,
        materialID: '71114750704185S',
        material: '185/65 R14 86S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 410,
        materialID: '71114750705183H',
        material: '185/60 R14 82H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 411,
        materialID: '71114750704175S',
        material: '175/65 R15 84S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 412,
        materialID: '71114750704185S',
        material: '185/65 R15 88S TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 413,
        materialID: '71114750704195H',
        material: '195/65 R15 91H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 414,
        materialID: '71114750704203H',
        material: '205/65 R15 94H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 415,
        materialID: '71114750705183H',
        material: '185/60 R15 84H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 416,
        materialID: '71114750705193H',
        material: '195/60 R15 88H TYSD7 TLZ SSMC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 417,
        materialID: '71114750706185V',
        material: '185/55 R15 82V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 418,
        materialID: '71114750706195V',
        material: '195/55 R15 83V TYSD7 TLZ SSMC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 419,
        materialID: '71114750705203H',
        material: '205/60 R16 92H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 420,
        materialID: '71114750705213H',
        material: '215/60 R16 93H TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 421,
        materialID: '71114750706205V',
        material: '205/55 R16 91V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 16,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 422,
        materialID: '71114750706215V',
        material: '215/55 R17 94V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 423,
        materialID: '71114750707215V',
        material: '215/50 R17 91V TYSD7 TLM GSS MC1Z',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 424,
        materialID: '71114750708215W',
        material: '215/45 R17 87W TYSD7 TLM GSS M...',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 17,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 425,
        materialID: '71114750708225W',
        material: '225/45 R18 91W TYSD7 TLM GSS M...',
        materialType: 'ZTRD',
        pattern: 'SD7',
        patternName: '(NULL)',
        rimDiameter: 18,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 426,
        materialID: '7310CM17000110L',
        material: '11R225146L M1702 TL',
        materialType: 'ZTRD',
        pattern: '170',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 427,
        materialID: '7310CM17001209H',
        material: '295/80 R225152M M170 TL',
        materialType: 'ZTRD',
        pattern: '170',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 428,
        materialID: '7310CM32000110K',
        material: '11R225 148K M3202 TL',
        materialType: 'ZTRD',
        pattern: '320',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 429,
        materialID: '7310CM61000110M',
        material: '11R225 16 M6102 TL S',
        materialType: 'ZTRD',
        pattern: '610',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 430,
        materialID: '7310CM62700110L',
        material: '11R225 5 146L M627 TL',
        materialType: 'ZTRD',
        pattern: '627',
        patternName: '(NULL)',
        rimDiameter: 0,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 148,
        materialID: '81114CR1F04175T',
        material: '175/65 R14 82T PXCR1FTLY GSS MT1Z',
        materialType: 'ZFP2',
        pattern: 'CRQ',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 149,
        materialID: '81114NE0303165T',
        material: '165/70 R14 85T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 150,
        materialID: '81114NE0303175T',
        material: '175/70 R14 88T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 151,
        materialID: '81114NE0303185T',
        material: '185/70 R14 88T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 152,
        materialID: '81114NE0303195T',
        material: '195/70 R14 91T NE03',
        materialType: 'ZFP2',
        pattern: 'N03',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    }
]);

// Helper functions
const updateBuyMaterials = (item) => {
    if (item.selectedBuyPatterns.length > 0 && item.selectedBuyRims.length > 0) {
        const filteredMaterials = materials.value.filter((material) => item.selectedBuyPatterns.includes(material.pattern) && item.selectedBuyRims.includes(material.rimDiameter));
        item.availableBuyMaterials = [...filteredMaterials];
    } else {
        item.availableBuyMaterials = [];
    }
};

const toggleBuyMaterialSelection = (item, material) => {
    const isSelected = item.selectedBuyMaterials.some((selected) => selected.id === material.id);

    if (isSelected) {
        // Remove from selection
        item.selectedBuyMaterials = item.selectedBuyMaterials.filter((selected) => selected.id !== material.id);
    } else {
        // Add to selection
        item.selectedBuyMaterials.push({ ...material });
    }
};

const removeBuyMaterial = (item, materialId) => {
    // Remove from available materials (completely remove from the list)
    item.availableBuyMaterials = item.availableBuyMaterials.filter((material) => material.id !== materialId);
    
    // Also remove from selected materials if it was selected
    item.selectedBuyMaterials = item.selectedBuyMaterials.filter((material) => material.id !== materialId);
};

const isMaterialSelected = (selectedMaterials, materialId) => {
    return selectedMaterials.some((material) => material.id === materialId);
};

const clearBuySelection = (item) => {
    item.selectedBuyMaterials = [];
    item.selectedBuyPatterns = [];
    item.selectedBuyRims = [];
    item.availableBuyMaterials = [];
};

const updateFreeMaterial = (item) => {
    if (item.selectedFreePattern && item.selectedFreeRim) {
        const filteredMaterials = materials.value.filter((material) => material.pattern === item.selectedFreePattern && material.rimDiameter === item.selectedFreeRim);

        // For free material, only select the first matching material
        item.selectedFreeMaterial = filteredMaterials.length > 0 ? { ...filteredMaterials[0] } : null;
    }
};

const clearFreeSelection = (item) => {
    item.selectedFreeMaterial = null;
    item.selectedFreePattern = null;
    item.selectedFreeRim = null;
};

const addProgramItem = () => {
    programItems.value.push({
        buyQty: 1,
        freeQty: 1,
        selectedBuyMaterials: [],
        availableBuyMaterials: [],
        selectedFreeMaterial: null,
        selectedBuyPatterns: [],
        selectedBuyRims: [],
        selectedFreePattern: null,
        selectedFreeRim: null,
        status: 1
    });
};

const removeProgramItem = (index) => {
    programItems.value.splice(index, 1);
};

const onImageSelect = (eventFile, field) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            salesProgram.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const submitForm = () => {
    console.log('Sales Program Data:', salesProgram.value);
    console.log('Program Items:', programItems.value);
};

// Watch for type changes to clear program items
watch(
    () => salesProgram.value.type,
    (newType) => {
        programItems.value = [];
    }
);
</script>