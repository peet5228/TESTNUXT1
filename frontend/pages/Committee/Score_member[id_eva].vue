<template>
    <v-container>
        <c-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <v-h1 class="text-h5 font-weight-bold">คะแนนประเมินผู้รับการประเมิน</v-h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ - นามกสุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมิน : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,index1) in topics" :key="topic.id_topic" class="mt-2">
                        <v-col cols="12">
                            {{ index1+1 }}.{{ topic.name_topic }}
                            <v-table class="table">
                                <tr>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">รายละเอียด</th>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">ไฟล์ที่แนบ</th>
                                    <th class="border bg-grey text-black pa-1" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="border pa-1 text-center">{{ indicate.name_indicate }}</td>
                                    <td class="border pa-1 text-center">{{ indicate.detail_indicate }}</td>
                                    <td class="border pa-1 text-center">{{ indicate.point_indicate }}</td>
                                    <td class="border pa-1 text-center">{{ indicate.point_indicate*4 }}</td>
                                    <td class="border pa-1 text-center">{{ indicate.detail_eva || '-' }}</td>
                                    <td class="border pa-1 text-center"><v-btn v-if="indicate.file_eva" @click="viweFile(indicate.file_eva)" color="blue" size="small">ดูไฟล์</v-btn><span v-else>-</span></td>
                                    <td class="border pa-1 text-center">{{ indicate.score_member*indicate.point_indicate }}</td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-4 text-end">
                        <v-card class="pa-4" color="success">คะแนนรวมทั้งหมด : {{ user.total_eva }} คะแนน</v-card>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 1" type="info">ยังไม่ได้กรอกแบบประเมิน</v-alert>
                <v-alert v-else type="warning">คุณยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </c-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {commit} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const id_eva = useRoute().params.id_eva

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,"__blank")
}

const fetchUser = async () =>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${commit}/score_member/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
    }
}
const fetchTopic = async () =>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${commit}/score_member/indicate/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

</script>

<style scoped>

</style>