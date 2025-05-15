import express from 'express'
import mongoose from 'mongoose'

const router=express.Router()

router.get('/drugs',async(req,res)=>{
    try{
        const drugs=await mongoose.connection.db.collection('drugs').find({},{projection:
            {
                _id:0,
                name:1,
                // state:1,
                // groups:1,
                // indication:1,
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

router.get('/drugs/:name/details',async(req,res)=>{
    try{
        const drug=await mongoose.connection.db.collection('drugs').findOne({name:req.params.name})
        res.status(200).json(drug)
    }catch(error){
        res.status(500).json(error)
    }
})

router.get('/drugs/:name/interactions',async(req,res)=>{
    try{
        const interactions=await mongoose.connection.db.collection('drugs').findOne({name:req.params.name},{projection:
            {
                _id:0,
                'drug-interactions':1,
                'food-interactions':1
            }
        })
        res.status(200).json(interactions)
    }catch(error){
    res.status(500).json(error)
    }
})

router.get('/drugs/search/:query',async(req,res)=>{
    try{
        const results=await mongoose.connection.db.collection('drugs').find({name:{$regex:req.params.query,$options:'i'}},{projection:
            {
                _id:0,
                name:1,
            }
        }).toArray()
        res.status(200).json(results)
    }catch(error){
        res.status(500).json(error)
    }
})



export default router