const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// ====== demo =======
// API สำหรับ get ข้อมูล
// router.get('/',verifyToken,requireRole('ผ่ายบุคลากร'),async (req,res) => {
//     try{
//         const [rows] = await db.query(``)
//         res.json(rows)
//     }catch(err){
//         console.error('Error Get',err)
//         res.status(500).json({message:'Error Get'})
//     }
// })
// ====== demo =======

// API สำหรับ get ข้อมูล
router.get('/',verifyToken,requireRole('ผ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_topic order by id_topic desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ get ข้อมูล where params
router.get('/:id_topic',verifyToken,requireRole('ผ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_topic} = req.params
        const [rows] = await db.query(`select * from tb_topic where id_topic='${id_toic}' order by id_topic desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ INsert ข้อมูล
router.post('/',verifyToken,requireRole('ผ่ายบุคลากร'),async (req,res) => {
    try{
        const {name_topic} = req.body
        const [rows] = await db.query(`insert into tb_topic (name_topic) values (?)`,[name_topic])
        res.json({rows,message:'Insert Sucess'})
    }catch(err){
        console.error('Error Insert',err)
        res.status(500).json({message:'Error Insert'})
    }
})

// API สำหรับ Update ข้อมูล
router.put('/:id_topic',verifyToken,requireRole('ผ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_topic} = req.params
        const {name_topic} = req.body
        const [rows] = await db.query(`update tb_topic set name_topic? where id_topic='${id_topic}'`,[name_topic])
        res.json({rows,message:'Update Sucess'})
    }catch(err){
        console.error('Error Update',err)
        res.status(500).json({message:'Error Update'})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_topic',verifyToken,requireRole('ผ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_topic} = req.params
        // const {name_topic} = req.body
        const [rows] = await db.query(`delete from tb_topic where id_topic='${id_topic}'`)
        res.json({rows,message:'Delete Sucess'})
    }catch(err){
        console.error('Error Delete',err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router