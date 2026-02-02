<template>
    <v-container>
        <c-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
                    <v-h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</v-h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ - นามกสุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมิน : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,index1) in topics" :key="topic.id_topic" class="mt-2">
                        <v-col cols="12">
                            {{ index1+1 }}.{{ topic.name_topic }}
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,index2) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        <p>
                                            {{ index1+1 }}.{{ index2+1 }} {{ indicate.name_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }} รายละเอียด : {{ indicate.detail_indicate }}
                                        </p>
                                        <v-textarea label="คำอธิบายเพิ่มเติม(ถ้ามี)" v-model="indicate.detail_eva" rows="2"></v-textarea>
                                        <v-file-input label="file" @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" accept="image/*,.pdf" ></v-file-input>
                                        <v-select v-if="indicate.check_indicate === 'y'" v-model="indicate.score" :items="[1,2,3,4]" label="ใส่คะแนนประเมิน 1-4" ></v-select>
                                        <v-text-field v-else v-model="indicate.score" type="number" label="ใส่คะแนนประเมิน 1-4" min="1" max="4"  @input="indicate.score > 4 ? indicate.score = 4 : null"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                        <v-btn type="submit" color="blue">บันทึกคะแนน</v-btn><br><br><br>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 2 || user.status_eva === 3" type="success">คุณกรอกแบบประเมินแล้ว</v-alert>
                <v-alert v-else type="warning">คุณยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </c-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {eva} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])

const fetchUser = async () =>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
    }
}
const fetchTopic = async () =>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${eva}/selfeva/indicate`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})
const fileMap = ref<Record<string,string>>({})
const onFileChange = (event:Event,id_topic:number,id_indicate:number) =>{
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if(!file)return
    fileMap.value[`${id_topic}-${id_indicate}`] = file
}

const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap(topic =>
        topic.indicates.map((i:any) =>{
            const key = `${topic.id_topic}-${i.id_indicate}`
            const file = fileMap.value[key]
            if(file)formData.append(`file_${key}`,file)
            return{
                id_topic:topic.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
                detail_eva:i.detail_eva,
                file_key:file ? `file_${key}` : null
            }
        })
    )
    if(allScore.some((s) => !s.score)){
        alert('กรุณากรอกคะแนนให้ครบ')
    }
    formData.append('scores',JSON.stringify(allScore))
    try{
        await axios.post(`${eva}/selfeva/save`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('บันทึกคะแนนสำเร็จ')
        await Promise.all([fetchTopic(),fetchUser()])
    }catch(err){
        console.error("Error Save SCORE!",err)
    }
}
</script>

<style scoped>

</style>