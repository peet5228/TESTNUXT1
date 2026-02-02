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

    <ClientOnly>
    <v-navigation-drawer v-model="drawer" color="#404040" :temporary="isMobile" :permanent="!isMobile">
      <v-list>
        <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
            <v-list-item-title>
                {{ item.title }}
            </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    </ClientOnly>

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
const user = <any>ref({})
const token = process.client ? localStorage.getItem('token') : null

const logout = async () =>{
    if(!confirm('ต้องการออกจากระบบใช่มั้ย'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles = [
    //staff
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมิน',to:'/Staff/ManageEva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมิน',to:'/Staff/ManageEva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/ManageCommit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อการประเมิน',to:'/Staff/Topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัด',to:'/Staff/Indicate',role:'ฝ่ายบุคลากร'},
    {title:'จัดการรอบการประเมิน',to:'/Staff/Round_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการแบบประเมิน',to:'/Staff/Eva',role:'ฝ่ายบุคลากร'},

    //commit
    {title:'รายชื่อผู้รับการประเมิน',to:'/Committee/',role:'กรรมการประเมิน'},

    //eva
    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evaluatee/Edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบประเมินตนเอง',to:'/Evaluatee/Selfeva',role:'ผู้รับการประเมินผล'},
    {title:'ตรวจสอบผลการประเมิน',to:'/Evaluatee/Check_score',role:'ผู้รับการประเมินผล'},
    {title:'รายงานผล',to:'/Evaluatee/Report_eva',role:'ผู้รับการประเมินผล'},

]

const navitem = computed(() => roles.filter((item) => item.role.includes(user.value.role)))

const fetchUser = async () =>{
    if(!token){
        return await navigateTo('/',{replace:true})
    }
    try{
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        console.log(user.value)
    }catch(err){
        console.error('Error GET User',err)
        localStorage.removeItem('token')
        await navigateTo('/',{replace:true})
    }
}
onMounted(fetchUser)
</script>

<style scoped>

</style>