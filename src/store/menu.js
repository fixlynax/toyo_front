import { defineStore } from 'pinia';
import { fetchNavigation } from '@/service/navigation';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: [],         // Navbar
    permissions: []   // PermFunc
  }),
  actions: {
    // Fetch menu and permissions from API
    async loadMenuAndPermissions() {
      const { menu, permissions } = await fetchNavigation();
      this.menu = menu;
      this.permissions = permissions;
    },
    // Can the user view this function?
    canView(funcName) {
      const perm = this.permissions.find(p => p.function_name === funcName);
      return !!perm; // exists → can view, else cannot
    },

    // Can the user write?
    canWrite(funcName) {
      const perm = this.permissions.find(p => p.function_name === funcName);
      return perm?.has_write_permission || false; // true → write, false or missing → cannot write
    }
  }
});