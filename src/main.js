import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Lara from '@primeuix/themes/lara';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css' // optional theme



import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        primary: 'blue',
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');

