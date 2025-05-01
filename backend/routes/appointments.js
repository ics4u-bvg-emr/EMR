import express from 'express';
import Appointment from '../models/Appointment';
import mongoose from "mongoose";

const router = express.Router();

//GETS
router.get('/appointments', async (req, res) => {
    try{
        const appointments = await Appointment.find();
        res.json(appointments);
    }catch (error){
        res.status(500).json({ 
            message: "Error getting appointments", 
            error: error.message 
        });
    }
});

//POSTS
router.post('/appointments', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.body.doctorId)) {
            return res.status(400).json({ message: "Invalid doctor ID format" });
        }
        if (!ObjectId.isValid(req.body.patientId)) {
            return res.status(400).json({ message: "Invalid patient ID format" });
        }

        const appointment = new Appointment({
            doctorId: req.body.doctorId,
            patientId: req.body.patientId,
            date: new Date(req.body.date),
            time: req.body.time,
            reason: req.body.reason,
            notes: req.body.notes,
            status: req.body.status,
        });
        
        const savedAppointment = await appointment.save();
        res.status(201).json({ 
          message: "Appointment created successfully", 
          _id: savedAppointment._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error creating appointment", 
            error: error.message 
        });
    }
});

//DELETE


//PUT


export default router;