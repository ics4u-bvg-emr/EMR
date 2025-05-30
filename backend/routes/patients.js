import express from 'express';
import Patient from '../models/Patient.js';
import mongoose from "mongoose";

const router = express.Router();

//GETS
router.get('/patients', async (req, res) => {
    try{
        const patients = await Patient.find();
        res.json(patients);
    }catch (error){
        res.status(500).json({ 
            message: "Error getting patients", 
            error: error.message 
        });
    }
});

//POSTS

//DELETE


//PUT


export default router;