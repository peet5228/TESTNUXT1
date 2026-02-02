const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const uploadDir = path.join(__dirname,'../../uploads/document')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')


// ====== demo =======
// API สำหรับ get ข้อมูล
// router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
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
router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Upload ข้อมูล
router.post('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {name_doc} = req.body
        const file = req.files?.file
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`insert into tb_doc (name_doc,day_doc,file) values (?,CURDATE(),?)`,[name_doc,filename])
        res.status(201).json({message:'Uploads Success'})
    }catch(err){
        console.error('Error Uploads',err)
        res.status(500).json({message:'Error Uploads'})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_doc',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_doc} = req.params
        const [[D]] = await db.query(`select file from tb_doc where id_doc='${id_doc}'`)
        const fp = path.join(uploadDir,D.file)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`delete from tb_doc where id_doc='${id_doc}'`)
        res.json({message:"Delete Success"})
    }catch(err){
        console.error('Error Delete',err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router