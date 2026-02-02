const express = require('express')
const db = require('../db')
const router = express.Router()

// API GET Profile
router.get('/',async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member set tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    }catch(err){
        console.error("Error GET Profile",err)
        res.status(500).json({message:"Error GET Profile"})
    }
})

module.exports = router