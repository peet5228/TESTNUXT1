<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">รายงานแบบประเมินที่สำเร็จ</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ผู้รับการประเมิน</th>
                                    <th class="text-center border">วันทีออกแบบประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">สถานะการประเมิน</th>
                                    <!-- <th class="text-center border">จัดการ</th> -->
                                    <!-- <th class="text-center border">เพิ่มกรรมการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border">{{ items.status_eva === 1 ? 'ยังไม่ได้ประเมิน' : items.status_eva === 2 ? 'รอกรรมการประเมิน' : 'ประเมินเสร็จสิ้น' }}</td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                         <br><br>
                        <center><v-btn color="warning" class="text-white noP" prepend-icon="mdi-printer" @click="p()">พิมพ์</v-btn></center>
                    </v-card-text>
                    <!-- </v-card-text> -->
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const m = ref([])
const r = ref([])

const form = ref<any>({
    id_eva:null,
    id_member: null,
    id_sys: '',
    day_eva: '',
}) 

const reset = () => {
    form.value = {
        id_eva:null,
        id_member: null,
        id_sys: '',
        day_eva: '',
    }
}

const edit = (items:any) => {
    form.value = {...items}
} 

const error = ref<Record<string,string>>({})

function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.id_member)error.value.id_member='กรุณาเลือกผู้รับการประเมินผล'
    if(!f.day_eva)error.value.day_eva='กรุณาเลือกวันที่ออกแบบประเมิน'
    if(!f.id_sys)error.value.id_sys='กรุณาเลือกรอบการประเมิน'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/eva/y`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
        const round = await axios.get(`${staff}/eva/round`,{headers:{Authorization:`Bearer ${token}`}})
        r.value = round.data
        const member = await axios.get(`${staff}/member/eva`,{headers:{Authorization:`Bearer ${token}`}})
        m.value = member.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        form.value.id_eva
        ? await axios.put(`${staff}/eva/${form.value.id_eva}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error("Error!",err)
    }
}

const del = async (id_eva:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/eva/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path: `Eva_commit-${id_eva}`})
}


const p = () => {
    window.print()
}

onMounted(fetch)
</script>

<style scoped>
@media print{
    .v-btn,.noP{
        display: none !important;
    }
}
</style>