import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import { initDatabase } from '@/db';
import { createPinia } from 'pinia';

initDatabase();

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.mount('#app');
