<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 " color="">
                        <h1 class="text-h5 font-weight-bold">ยืนยันผลการประเมินผล</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input label="เอกสารหรือคู่มือการประเมิน" v-model="file" accept="image/*" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn color="blue" type="submit" block>บันทึก</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn color="error" type="reset" block>ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>
                        <v-table v-else>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อไฟล์</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">{{ 1 }}</td>
                                    <td class="text-center border">{{ result.signature }}</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" prepend-icon="mdi-eye" size="small" @click="views(result.signature)">เปิดดู</v-btn>&nbsp;&nbsp;
                                        <v-btn color="error" class="text-white" size="small" @click="del(id_eva)">ลบ</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,commit} from '../../API/base'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const name_doc = ref('')
const file = ref<File | null>(null)
const id_eva = useRoute().params.id_eva

const error = ref<Record<string,string>>({})

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const saveMember = async () =>{
    if(!name_doc.value || !file.value) return alert('กรุณาเพิ่มข้อมูลให้ครบถ้วน')
    try{
        const formData = new FormData()
        formData.append('name_doc',name_doc.value)
        formData.append('file',file.value)
         await axios.post(`${commit}/signature/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error("Error!",err)
    }
}

const del = async (id_doc:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const views = (filename:string) => {
    const u = new URL(`/uploads/document/${filename}`,commit).href
    window.open(u,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>