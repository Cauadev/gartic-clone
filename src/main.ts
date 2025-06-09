import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routes'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';


const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
        darkModeSelector: false || 'none',
      }
    }
});
app.use(PrimeVue);
app.use(pinia)
app.use(router)
app.mount('#app')
