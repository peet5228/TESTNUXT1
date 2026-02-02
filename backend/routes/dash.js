const express = require('express')
const db = require('../db')
const bc = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../middleware/authMiddleware')

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
router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[n]] = await db.query(`select count(*)as total from tb_eva where status_eva!=3`)
        const [[y]] = await db.query(`select count(*)as total from tb_eva where status_eva=3`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)
        res.json({
            box : [
                {title: 'แบบประเมินทั้งหมด',value: evaCount.total || '0' },
                {title: 'แบบประเมินที่ไม่สำเร็จ',value: evaCount.total > 0 ? `${ (n.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
                {title: 'แบบประเมินที่สำเร็จ',value: evaCount.total > 0 ? `${ (y.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
            ],
            box2 : [
                {title: 'ผู้รับการประเมินผลทั้งหมด',value: eva.total || 0},
                {title: 'กรรมการประเมินผลทั้งหมด',value: commit.total || 0},
            ]
        })
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ get ข้อมูล
router.get('/eva',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva , tb_member where tb_eva.id_member='${id_member}' and tb_member.id_member=tb_eva.id_eva`)
        const [[n]] = await db.query(`select count(*)as total from tb_eva , tb_member where tb_eva.id_member='${id_member}' and tb_member.id_member=tb_eva.id_eva and status_eva=1`)
        const [[y]] = await db.query(`select count(*)as total from tb_eva , tb_member where tb_eva.id_member='${id_member}' and tb_member.id_member=tb_eva.id_eva and status_eva!=1`)
        // const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        // const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)
        res.json({
            box : [
                {title: 'แบบประเมินทั้งหมด',value: evaCount.total || '0' },
                {title: 'แบบประเมินที่ยังไม่ได้ประเมิน',value: evaCount.total > 0 ? `${ (n.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
                {title: 'แบบประเมินที่ประเมินแล้ว',value: evaCount.total > 0 ? `${ (y.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
            ],
        })
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ get ข้อมูล
router.get('/doc',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ get ข้อมูล
router.get('/commit/doc',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router