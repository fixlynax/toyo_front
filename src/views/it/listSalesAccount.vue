<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Sales Account</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['userlist', 'email', 'mobile', 'salesOffice', 'salesDistrict']">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
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

                    <RouterLink to="/it/createSalesAccount">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <template #empty>No sales accounts found.</template>
            <template #loading>Loading sales accounts. Please wait.</template>

            <Column field="userlist" class="font-bold text-primary-400" header="Name" style="min-width: 10rem">
                <template #body="{ data }">{{ data.userlist || '-' }}</template>
            </Column>

            <Column field="description" header="Title" style="min-width: 8rem">
                <template #body="{ data }">{{ data.description || '-' }}</template>
            </Column>

            <Column field="mobilephone" header="Mobile No" style="min-width: 10rem">
                <template #body="{ data }">{{ data.mobilephone || '-' }}</template>
            </Column>

            <Column field="email" header="Email" style="min-width: 12rem">
                <template #body="{ data }">{{ data.email || '-' }}</template>
            </Column>

            <Column field="salesOffice" header="Sales Office" style="min-width: 10rem">
                <template #body="{ data }">{{ data.salesOffice || '-' }}</template>
            </Column>

            <Column field="salesDistrict" header="Sales District" style="min-width: 10rem">
                <template #body="{ data }">{{ data.salesDistrict || '-' }}</template>
            </Column>

            <Column field="placeorder" header="Order" style="min-width: 8rem">
                <template #body="{ data }">
                    <span :class="data.placeorder === 1 ? 'font-semibold' : ''">
                        {{ data.placeorder === 1 ? 'Yes' : '-' }}
                    </span>
                </template>
            </Column>

            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.statusUser !== undefined ? getUserStatusLabel(data.statusUser) : '-'" :severity="data.statusUser !== undefined ? getUserStatusSeverity(data.statusUser) : 'info'" class="font-bold" />
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteUser(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const listData = ref([]);
const loading = ref(true);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const sortMenu = ref();
const sortItems = ref([
    {
        label: 'Sort by Name (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('userlist', 'asc')
    },
    {
        label: 'Sort by Name (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('userlist', 'desc')
    },
    {
        label: 'Sort by Sales Office',
        icon: 'pi pi-briefcase',
        command: () => sortBy('salesOffice', 'asc')
    },
    {
        label: 'Sort by Status',
        icon: 'pi pi-check-circle',
        command: () => sortBy('statusUser', 'desc')
    }
]);

const sortBy = (field, order) => {
    listData.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

const getUserStatusLabel = (status) => (status === 1 ? 'Active' : 'Suspend');
const getUserStatusSeverity = (status) => (status === 1 ? 'success' : 'danger');

const editUser = (user) => {
    router.push(`/it/editSalesAcc/${user.id}`);
};

const deleteUser = (user) => {
    console.log('Deleting sales account:', user);
};

onMounted(async () => {
    loading.value = true;
    try {
        const res = await api.get('admin/list-user-role');
        const raw = res.data.data;

        const mapped = raw.map((item) => ({
            id: item.id,
            userlist: item.name,
            description: item.description,
            email: item.email,
            mobilephone: item.mobilephone,
            salesOffice: item.salesOffice,
            salesDistrict: item.salesDistrict,
            placeorder: item.is_sales_person ? 1 : 0,
            statusUser: item.status ? 1 : 0,
            sales_person: item.is_sales_person ? 1 : 0
        }));

        listData.value = mapped.filter((x) => x.sales_person === 1);
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch sales accounts',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
});
</script>
