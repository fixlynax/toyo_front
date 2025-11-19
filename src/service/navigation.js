import api from './api'; // your axios instance

export async function fetchNavigation() {
  const response = await api.get('navigation');
  return {
    adminName: response.data.data.admin_name,     
    menu: response.data.data.navbar,       
    permissions: response.data.data.permission,
    role: response.data.data.role,   
  };
}