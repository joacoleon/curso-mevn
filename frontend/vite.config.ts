import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteFonts from "unplugin-fonts/vite"; //Es necesario instalar la fuente roboto https://github.com/vuetifyjs/vuetify/issues/19140

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteFonts({
      fontsource: {
        families: [
          {
            name: "Roboto",
            weights: [100, 300, 400, 500, 700, 900],
            styles: ["normal", "italic"],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), //TODO -> Revisar esto, es para importar con @ en vez de ../.., pero no entiendo si esta bien
      //'@': fileURLToPath(new URL(import.meta.url, './src'))  
    }
  }
})
