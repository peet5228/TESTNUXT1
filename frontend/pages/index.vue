<template>
    <v-container fulid class="fill-height">
        <v-row align="center" justify="center">
            <v-col cols="12" md="6" lg="5">
                <v-card elevation="10" rounded="lg" color="#7d0c14">
                    <p class="text-center text-white font-weight-bold text-h5">NTC EVALUATION SYSTEM</p>
                    <p class="text-center text-white font-weight-bold">ระบบประเมินบุคลากรวิทยากลัยเทคนิคน่าน</p>
                    <v-container class="bg-white">
                        <p class="text-center font-weight-bold text-h5">เข้าสู่ระบบ</p>
                        <v-alert type="error" v-if="error" variant="tonal">{{ error }}</v-alert>
                        <v-form @submit.prevent="Login">
                            <v-text-field v-model="username" label="ชื่อผู้ใช้" prepend-inner-icon="mdi-account"></v-text-field>
                            <v-text-field v-model="password" type="password" label="รหัสผ่าน" prepend-inner-icon="mdi-lock"></v-text-field>
                            <v-select v-model="role" :items="g" label="ประเภทสมาชิก" prepend-inner-icon="mdi-account-group" />
                            <v-btn color="#7d0c14" type="submit" block>เข้าสู่ระบบ</v-btn><br>
                            <NuxtLink to="/regis" class="text-blue"><center>สมัครสมาชิก</center></NuxtLink>
                        </v-form>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
definePageMeta({
    layout:false
})

import auth from '../API/auth'

const error = ref('')
const username = ref('')
const password = ref('')
const role = ref('')
const g = ['ฝ่ายบุคลกร','กรรมการประเมิน','ผู้รับการประเมินผล']

const Login = async () => {
    try{
        const res = await auth.login({
            username: username.value,
            password: password.value,
            role: role.value,
        })
        console.log("API Response : ",res.data)
        localStorage.setItem('token',res.data.token)
        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร') navigateTo('/Staff')
        else if(useRole === 'ผู้รับการประเมิน') navigateTo('/Evaluatee')
        else if(useRole === 'กรรมการประเมิน') navigateTo('/Committee')
    }catch(err){
        console.error("Login Failed",err)
        error.value = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }
}

</script>

<style scoped>

</style>