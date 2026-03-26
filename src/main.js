import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import App from './App';
import router from './router';
import './assets/tailwind.css';
import 'tabulator-tables/dist/css/tabulator_bulma.min.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(App)
  .use(router)
  .use(pinia)
  .use(Antd)
  .mount('#app');
