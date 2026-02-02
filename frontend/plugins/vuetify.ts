// plugins/vuetify.ts
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css'
import { createVuetify } from 'vuetify'
export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({})
  app.vueApp.use(vuetify)
})
