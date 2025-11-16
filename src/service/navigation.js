import api from './api'; // your axios instance

export async function fetchNavigation() {
  const response = await api.get('navigation');
  return {
    menu: response.data.data.navbar,       
    permissions: response.data.data.permission
  };
}