import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara' 
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: { darkModeSelector: 'none' }
  }
})
app.mount('#app')
