<template>

  <v-app>
    <v-app-bar color="#7d0c14">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>NTC Evaluation System</v-toolbar-title>
      <v-spacer />
      <p class="text-center">ผู้ใช้งาน : {{ user.first_name }} {{ user.last_name }} <br> {{ user.role }}</p>&nbsp;&nbsp;
      <!-- โปรไฟล์ -->
      <v-btn icon="mdi-logout" variant="text" @click="logout" />&nbsp;&nbsp;
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="#404040" :temporary="isMobile" :permanent="!isMobile">
      <v-list>
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

<script setup lang="ts" >
import axios from 'axios';
import { useDisplay } from 'vuetify';
import {api} from '../API/base'
const {mdAndDown} = useDisplay()
const isMobile = computed(() => mdAndDown.value)
const drawer = ref(true)
const user = ref<any>({})

const logout = async () =>{
    if(!confirm('ต้องการออกจากระบบใช่มั้ย'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles = [
    //staff
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},

    //commit
    {title:'รายชื่อผู้รับการประเมิน',to:'/Staff/',role:'กรรมการประเมิน'},

    //eva
    {title:'หน้าหลัก',to:'/Staff/',role:'ผู้รับการประเมินผล'},

]

const navitem = computed(() => roles.filter((item) => item.role.includes(user.value.role)))

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    if(!token){
        return await navigateTo('/',{replace:true})
    }
    try{
        const res = await axios.get(`${api}/auth/regis`)
    }catch(err){
        console.error('Error GET User',err)
        // if(!token){
        //     localStorage.removeItem('token')
        //     return await navigateTo('/',{replace:true})
        // }   
    }
}
onMounted(fetchUser())
</script>

<style scoped>

</style>