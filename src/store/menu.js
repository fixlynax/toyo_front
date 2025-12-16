import { defineStore } from 'pinia';
import { fetchNavigation } from '@/service/navigation';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    adminName: '', 
    menu: [],         // Navbar
    permissions: [],   // PermFunc
    role: '',
    isManager: 0,
    forceReset : 0,
    hasFetched: false, // NEW FLAG
  }),
  actions: {
    // Fetch menu and permissions from API
    async loadMenuAndPermissions() {
      if (this.hasFetched) return;
      const { adminName, menu, permissions, role, isManager, forceReset } = await fetchNavigation();
      this.adminName = adminName;
      this.menu = menu;
      this.permissions = permissions;
      this.role = role;
      this.isManager = isManager;
      this.forceReset = forceReset;
      this.hasFetched = true;
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
    canTest(funcName) {
      return false;
    },
    reset() {
      this.menu = [];
      this.permissions = [];
      this.adminName = '';
      this.role = '';
      this.isManager = 0;
      this.forceReset = 0;
      this.hasFetched = false;
    }
  },
   persist: true 
});