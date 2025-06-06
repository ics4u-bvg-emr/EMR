import express from 'express'
import mongoose from 'mongoose'

const router=express.Router()

router.get('/drugs',async(req,res)=>{
    try{
        const drugs=await mongoose.connection.db.collection('drugs').find({},{
            projection:
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
        const interactions=await mongoose.connection.db.collection('drugs').findOne({name:req.params.name},{
            projection:
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
        const results=await mongoose.connection.db.collection('drugs').find({name:{$regex:req.params.query,$options:'i'}},{
            projection:
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

router.get('/drugs/interaction-check', async (req, res) => {
    try {
        const { drug1, drug2 } = req.query;
        if (!drug1 || !drug2)
        return res.status(400).json({ error: 'Needs 2 drug names' });

        const collection = mongoose.connection.db.collection('drugs');

        const [drugA, drugB] = await Promise.all([
        collection.findOne({ name: drug1 }, { projection: { 'drug-interactions': 1 } }),
        collection.findOne({ name: drug2 }, { projection: { 'drug-interactions': 1 } })
        ]);

        if (!drugA || !drugB)
        return res.status(404).json({ error: 'One or both drugs not found' });

        const listA = Array.isArray(drugA['drug-interactions']) ? drugA['drug-interactions'] : [];
        const listB = Array.isArray(drugB['drug-interactions']) ? drugB['drug-interactions'] : [];

        const interactionFromA = listA.find(d => d.name === drug2);
        const interactionFromB = listB.find(d => d.name === drug1);

        if (interactionFromA || interactionFromB) {
        return res.status(200).json({
            interactions: interactionFromA?.description || interactionFromB?.description || 'Interaction found'
        });
        }

        return res.status(200).json({ interactions: null });
    } catch (err) {
        console.error('Drug interaction check failed:', err);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
});


export default router