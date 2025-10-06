<template>
    <div class="card">
        <!-- Page Title -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Pattern</div>

        <!-- ========================= -->
        <!-- Main DataTable -->
        <!-- ========================= -->
        <DataTable
            v-model:expandedRows="expandedRows"
            :value="tyres"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['materialid', 'pattern', 'imageURL']"
            tableStyle="min-width: 60rem"
        >
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search + Sort -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>

                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <!-- Right: Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button" />
                        <Button type="button" label="Create" icon="pi pi-file-import" class="p-button" />
                    </div>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <!-- ========================= -->
            <!-- Columns -->
            <!-- ========================= -->
            <Column expander style="width: 5rem" />

            <Column field="imageURL" header="Image" style="min-width: 8rem; text-align: center">
                <template #body="{ data }">
                    <img :src="getImagePath(data.imageURL)" alt="Tyre Image" class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform" @click="openImage(data.imageURL)" />
                </template>
            </Column>

            <Column field="pattern" header="Pattern" style="min-width: 10rem">
                <template #body="{ data }">
                    <span class="font-semibold ml-1">{{ data.pattern }}</span>
                </template>
            </Column>

            <Column field="origin" header="Origin" style="min-width: 8rem">
                <template #body="{ data }">
                    <span>{{ data.origin || '—' }}</span>
                </template>
            </Column>

            <!-- ========================= -->
            <!-- Row Expansion -->
            <!-- ========================= -->
            <template #expansion="slotProps">
                <div class="p-4 bg-gray-50 rounded-lg shadow-inner">
                    <h5 class="font-semibold mb-3 text-gray-700">
                        Sizes for <span class="text-black-700">{{ slotProps.data.pattern }}</span>
                    </h5>

                    <DataTable :value="slotProps.data.sizes" class="p-datatable-sm" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 20]" dataKey="materialid" :rowHover="true" responsiveLayout="scroll">
                        <!-- <Column field="materialid" header="Material ID" style="min-width: 10rem" /> -->
                        <Column field="productdesc" header="Product Description" style="min-width: 12rem" />
                        <Column field="rimDiameter" header="Rim Diameter" style="min-width: 8rem" />
                        <Column field="aspectRatio" header="Aspect Ratio" style="min-width: 8rem" />
                        <Column field="sectionWidth" header="Section Width" style="min-width: 8rem" />
                        <Column field="loadIndex" header="Load Index" style="min-width: 8rem" />
                        <Column field="plyRating" header="Ply Rating" style="min-width: 8rem" />
                        <Column field="tyreSize" header="Tyre Size" style="min-width: 8rem" />
                    </DataTable>
                </div>
            </template>
        </DataTable>

        <!-- ========================= -->
        <!-- Image Preview Dialog -->
        <!-- ========================= -->
        <Dialog v-model:visible="showImageDialog" modal :style="{ width: '40vw' }" dismissableMask>
            <div class="flex justify-center items-center">
                <img :src="getImagePath(selectedImage)" alt="Preview" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListTyreService } from '@/service/listProduct';
import Dialog from 'primevue/dialog';

// =========================
// State
// =========================
const tyres = ref([]);
const loading = ref(true);
const expandedRows = ref([]);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Sort Menu
// =========================
const sortMenu = ref();
const sortItems = ref([
    {
        label: 'Sort by Material ID (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('materialid', 'asc')
    },
    {
        label: 'Sort by Material ID (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('materialid', 'desc')
    },
    {
        label: 'Sort by Pattern (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern', 'asc')
    },
    {
        label: 'Sort by Pattern (Z-A)',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern', 'desc')
    }
]);

const sortBy = (field, order) => {
    tyres.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// =========================
// Image Preview
// =========================
const showImageDialog = ref(false);
const selectedImage = ref(null);

const openImage = (imagePath) => {
    selectedImage.value = imagePath;
    showImageDialog.value = true;
};

const getImagePath = (path) => (!path ? '' : path.replace(/^public\//, '/'));

// =========================
// Dummy Data
// =========================
onMounted(async () => {
    loading.value = true;
    const data = await ListTyreService.getListTyre();

    tyres.value = data.map((tyre) => {
        let sizes = [];

        switch (tyre.pattern) {
            case 'Proxes':
                sizes = [
                    {
                        materialid: `${tyre.materialid}-A1`,
                        productdesc: 'Proxes Sport',
                        rimDiameter: 17,
                        aspectRatio: 45,
                        sectionWidth: 215,
                        loadIndex: '91W',
                        plyRating: 'XL',
                        tyreSize: '215/45R17'
                    },
                    {
                        materialid: `${tyre.materialid}-A2`,
                        productdesc: 'Proxes TR1',
                        rimDiameter: 18,
                        aspectRatio: 40,
                        sectionWidth: 235,
                        loadIndex: '94Y',
                        plyRating: 'SL',
                        tyreSize: '235/40R18'
                    }
                ];
                break;

            case 'Open Country':
                sizes = [
                    {
                        materialid: `${tyre.materialid}-B1`,
                        productdesc: 'Open Country A/T III',
                        rimDiameter: 17,
                        aspectRatio: 70,
                        sectionWidth: 265,
                        loadIndex: '115S',
                        plyRating: '10PR',
                        tyreSize: '265/70R17'
                    },
                    {
                        materialid: `${tyre.materialid}-B2`,
                        productdesc: 'Open Country M/T',
                        rimDiameter: 18,
                        aspectRatio: 65,
                        sectionWidth: 285,
                        loadIndex: '122Q',
                        plyRating: '8PR',
                        tyreSize: '285/65R18'
                    }
                ];
                break;

            case 'NanoEnergy':
                sizes = [
                    {
                        materialid: `${tyre.materialid}-C1`,
                        productdesc: 'NanoEnergy 3 Plus',
                        rimDiameter: 15,
                        aspectRatio: 65,
                        sectionWidth: 195,
                        loadIndex: '91V',
                        plyRating: 'SL',
                        tyreSize: '195/65R15'
                    },
                    {
                        materialid: `${tyre.materialid}-C2`,
                        productdesc: 'NanoEnergy Van',
                        rimDiameter: 16,
                        aspectRatio: 55,
                        sectionWidth: 205,
                        loadIndex: '91V',
                        plyRating: 'SL',
                        tyreSize: '205/55R16'
                    }
                ];
                break;

            default:
                sizes = [
                    {
                        materialid: `${tyre.materialid}-D1`,
                        productdesc: `${tyre.pattern} Standard`,
                        rimDiameter: 16,
                        aspectRatio: 60,
                        sectionWidth: 215,
                        loadIndex: '95H',
                        plyRating: 'SL',
                        tyreSize: '215/60R16'
                    },
                    {
                        materialid: `${tyre.materialid}-D2`,
                        productdesc: `${tyre.pattern} Premium`,
                        rimDiameter: 17,
                        aspectRatio: 50,
                        sectionWidth: 225,
                        loadIndex: '94V',
                        plyRating: 'XL',
                        tyreSize: '225/50R17'
                    }
                ];
                break;
        }

        return { ...tyre, sizes };
    });

    loading.value = false;
});
</script>
