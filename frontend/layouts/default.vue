<template>
  <v-app>
    <v-app-bar color="#7d0c14" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>NTC Evaluation System</v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/theme" class="mr-4">Theme</NuxtLink>
      <!-- โปรไฟล์ -->
      <v-btn icon="mdi-account-circle" variant="text" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="260" color="#404040">
      <v-list density="comfortable" >
        <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
            <v-list-item-title>
                {{ item.title }}
            </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="py-6">
        <slot />
      </v-container>
      <v-footer app class="text-caption justify-center">© 2025 NTC Evaluation System</v-footer>
    </v-main>
  </v-app>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>