<template>
    <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">จัดการผู้รับการประเมินผล</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.first_name" :error-messages="error.first_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.last_name" :error-messages="error.last_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" type="password" v-model="form.password" :error-messages="error.password"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="เลือกประเภทสมาชิก" :items="['ผู้รับการประเมินผล']" v-model="form.role" :error-messages="error.role"></v-select>
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn color="blue" type="submit" block>{{ form.id_member ? "อัปเดต" : 'บันทึก' }}</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn color="error" type="reset" block>ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อ-นามสกุล</th>
                                    <th class="text-center border">อีเมล</th>
                                    <th class="text-center border">ชื่อผู้ใช้</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member"></tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api} from '../API/base'

const result = ref([])

const form = ref<any>({}) 
const error = ref<Record<string,string>>({})
const confirmPassword = ref('')

const emailReget = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.first_name.trim())error.value.first_name='กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name='กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email='กรุณากรอกอีเมล'
    if(!f.username.trim())error.value.username='กรุณากรอกชื่อผู้ใช้'
    if(!f.password.trim())error.value.password='กรุณากรอกรหัสผ่าน'
    if(confirmPassword.value.trim())error.value.confirmPassword='กรุณายืนยันรหัสผ่าน'
    if(!f.role.trim())error.value.role='กรุณาเลือกประเภทสมาชิก'
    return Object.keys(error.value).length === 0
}

const saveMember = async () =>{
    try{
        const token = localStorage.getItem('token')
        await axios.post(`${api}/auth/regis`,form.value)
        alert('สมัครสำเร็จ')
        navigateTo('/')
    }catch(err){
        console.error("Error POST Member!",err)
    }
}

</script>

<style scoped>

</style>