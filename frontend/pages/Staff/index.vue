<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">Dashboard - Staff</h1>
                        <v-row>
                            <v-col v-for="b in box" :key="b">
                                <v-card class="pa-4" elevation="5" cols="12" md="4">
                                    <div class="text-h5">{{ b.title }}</div>
                                    <div class="text-h3">{{ b.value }}</div>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col v-for="b in box2" :key="b" cols="12" md="6">
                                <v-card class="pa-4" elevation="5">
                                    <div class="text-h5">{{ b.title }}</div>
                                    <div class="text-h3">{{ b.value }}</div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-sheet>
                    <v-card-text>
                       
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const box = ref([])
const box2 = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/dash/Staff`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        box2.value = res.data.box2
    }catch(err){
        console.error("Error Fetching",err)
    }
}


onMounted(fetch)
</script>

<style scoped>

</style>