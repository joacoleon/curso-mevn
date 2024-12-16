import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import 'unfonts.css'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#EDF2F4',
    surface: '#FFFFFF',
    primary: '#F44336',
    'primary-darken-1': '#D32F2F',
    'primary-lighten-1': '#FFCDD2',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

/* colors: {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  primary: '#6200EE',
  'primary-darken-1': '#3700B3',
  secondary: '#03DAC6',
  'secondary-darken-1': '#018786',
  error: '#B00020',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FB8C00',
} */

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      },
    },
  });

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');

//createApp(App).use(router).use(vuetify).use(pinia).mount('#app')