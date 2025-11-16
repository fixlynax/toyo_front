<script setup>
import AppMenu from './AppMenu.vue';
const props = defineProps({
  menu: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
    <div class="layout-sidebar">
        <app-menu :Navbar="menu"></app-menu>
    </div>
</template>

<style lang="scss" scoped></style>
