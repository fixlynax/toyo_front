<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">API Connection Test</h1>
    
    <button 
      @click="testConnection" 
      :disabled="loading"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {{ loading ? 'Testing...' : 'Test API Connection' }}
    </button>

    <div v-if="result" class="mt-4 p-4 border rounded" :class="result.success ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'">
      <h3 class="font-bold">{{ result.success ? '✅ Success' : '❌ Error' }}</h3>
      <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 rounded">
      <h3 class="font-bold text-red-800">Error Details:</h3>
      <pre class="text-red-600">{{ error }}</pre>
    </div>
  </div>
</template>

<script>
import api from '@/service/api';

export default {
  name: 'TestAPI',
  data() {
    return {
      loading: false,
      result: null,
      error: null
    }
  },
  methods: {
    async testConnection() {
      this.loading = true;
      this.result = null;
      this.error = null;

      try {
        const response = await api.get('test-connection');
        this.result = {
          success: true,
          data: response.data,
          status: response.status,
          headers: response.headers
        };
        console.log('API Test Success:', response.data);
      } catch (error) {
        this.result = {
          success: false,
          error: error.message
        };
        this.error = {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        };
        console.error('API Test Failed:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>