<template>
    <v-container>
        <c-row>
            <v-col cols="12">
                <v-form v-if="user.status_commit === 'n'" @submit.prevent="saveScore">
                    <v-h1 class="text-h5 font-weight-bold">ดำเนินการประเมินผู้รับประเมิน</v-h1>
                    <v-card class="pa-4 mt-2">
                        <p>ชื่อ - นามกสุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมิน : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,index1) in topics" :key="topic.id_topic" class="mt-2">
                        <v-col cols="12">
                            <b>{{ index1+1 }}.{{ topic.name_topic }}</b>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,index2) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        <p>
                                            {{ index1+1 }}.{{ index2+1 }} {{ indicate.name_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }}
                                        </p>
                                        <p class="mt-2">รายละเอียด : {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">ไฟล์ : <v-btn v-if="indicate.file_eva" @click="viweFile(indicate.file_eva)" size="small" color="blue">ดูไฟล์</v-btn><span v-else>-</span></p>
                                        <v-select class="mt-2" v-model="indicate.score" :items="[1,2,3,4]" label="ใส่คะแนนประเมิน 1-4" ></v-select>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะ</label>
                            <v-textarea label="(ถ้ามี)" v-model="detail_commit" rows="2"></v-textarea>
                        </v-card>
                    </div>
                    <div class="mt-4 text-center">
                        <v-btn type="submit" color="blue">บันทึกคะแนน</v-btn><br><br><br>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_commit === 'y'" type="success">กรอกแบบประเมินแล้ว</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </c-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {commit} from '../../API/base'

const id_eva = useRoute().params.id_eva
const user = ref<any>({})
const topics = ref([])
const detail_commit = ref('')

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'__blank')
}

const fetchUser = async () =>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
    }
}
const fetchTopic = async () =>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${commit}/save_score/indicate/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap(topic =>
        topic.indicates.map((i:any) =>{
            return{
                id_topic:topic.id_topic,
                id_indicate:i.id_indicate,
                score:i.score
            }
        })
    )
    if(allScore.some((s) => !s.score)){
        alert('กรุณากรอกคะแนนให้ครบ')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    formData.append('detail_commit',detail_commit.value)
    try{
        await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('บันทึกคะแนนสำเร็จ')
        await Promise.all([fetchTopic(),fetchUser()])
        navigateTo('/Committee/Show_eva')
    }catch(err){
        console.error("Error Save SCORE!",err)
    }
}
</script>

<style scoped>

</style>