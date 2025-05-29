import express from 'express'
import mongoose from 'mongoose'

const router=express.Router()

router.get('/doctors',async(req,res)=>{
    try{
        const doctors=await mongoose.connection.db.collection('doctors').find({}).toArray()
        res.status(200).json(doctors)
    }catch(error){
        res.status(500).json(error)
    }
})

// router.post('/doctors',async(req,res)=>{
//     try{
        
//     }catch(error){
//         res.status(500).json(error)
//     }
// })

export default router