<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-h5 font-weight-bold" >ดำเนินการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border bg-grey" style="width: 10%;">ลำดับ</th>
                                    <th class="text-center border bg-grey" style="width: 10%;">ชื่อ</th>
                                    <th class="text-center border bg-grey" style="width: 10%;">นามกสุล</th>
                                    <th class="text-center border bg-grey" style="width: 10%;">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center border bg-grey" style="width: 10%;">รอบการประเมิน</th>
                                    <th class="text-center border bg-grey" style="width: 10%;">สถานะการประเมิน</th>
                                    <th class="text-center border bg-grey" style="width: 10%;">ดำเนินการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :keys="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }}</td>
                                    <td class="text-center border">{{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border">{{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_commit === 'y' ? 'ประเมินสำเร็จ' : items.status_eva === 2 ? 'รอกรรมการประเมิน' : 'ปิด' }}</td>
                                    <td class="text-center border">
                                        <v-btn v-if="items.status_commit === 'n'" class="text-white" size="small" color="blue" @click="go(items.id_eva)">ประเมิน</v-btn>
                                        <v-btn v-else class="text-white" size="small" color="success">ประเมินแล้ว</v-btn>
                                    </td>
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

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/show_eva/user`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const go = (id_eva:number) => {
    navigateTo(`/Committee/Save_Score${id_eva}`)
}

onMounted(fetch)
</script>

<style scoped>
.bg-maroon{
    color: #7d0c14;
}
</style>