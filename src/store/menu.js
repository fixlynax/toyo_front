import { defineStore } from 'pinia';
import { fetchNavigation } from '@/service/navigation';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    adminName: '', 
    menu: [],         // Navbar
    permissions: [],   // PermFunc
    role: ''
  }),
  actions: {
    // Fetch menu and permissions from API
    async loadMenuAndPermissions() {
      const { adminName,menu, permissions, role } = await fetchNavigation();
      this.adminName = adminName;
      this.menu = menu;
      this.permissions = permissions;
      this.role = role;
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
    },
    reset() {
      this.menu = [];
      this.permissions = [];
      this.adminName = '';
      this.role = '';
    }
  },
   persist: true 
});