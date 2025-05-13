import express from 'express'
import mongoose from 'mongoose'

const router=express.Router()

router.get('/drugs',async(req,res)=>{
    try{
        const drugs=await mongoose.connection.db.collection('drugs').find({},{projection:
            {
                _id:0,
                name:1,
                state:1,
                groups:1,
                indication:1,
                // classification:1,
                // targets:1,
                // products:1,
            }
        }).toArray()
        res.status(200).json(drugs)
    }catch(error){
        res.status(500).json(error)
    }
})

export default router