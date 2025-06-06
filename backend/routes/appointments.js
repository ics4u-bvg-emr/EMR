import express from 'express';
import Appointment from '../models/Appointment.js';
import { requireAuth } from '../middleware/auth.js';
import mongoose from "mongoose";

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

//GETS
router.get('/appointments', async (req, res) => {
    try{
        const appointments = await Appointment.find().populate('patientId', 'firstName lastName').exec();
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
        const { doctorId, patientId, start, end, reason, notes, status } = req.body;

        if (!ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: "Invalid doctor ID format" });
        }
        if (!ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Invalid patient ID format" });
        }

        if (!start || isNaN(Date.parse(start))) {
            return res.status(400).json({ message: "Invalid or missing start time" });
        }
        if (!end || isNaN(Date.parse(end))) {
            return res.status(400).json({ message: "Invalid or missing end time" });
        }
        const appointment = new Appointment({
            doctorId: req.body.doctorId,
            patientId: req.body.patientId,
            start: new Date(start),
            end: new Date(end),
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
router.delete('/appointments/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }

        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        
        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ 
            message: "Appointment deleted successfully",
            _id: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting appointment", 
            error: error.message 
        });
    }
});

//PUT
router.put('/appointments/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }
        if (req.body.doctorId && !ObjectId.isValid(req.body.doctorId)) {
            return res.status(400).json({ message: "Invalid doctor ID format" });
        }
        if (req.body.patientId && !ObjectId.isValid(req.body.patientId)) {
            return res.status(400).json({ message: "Invalid patient ID format" });
        }

        const updatedData = {
            ...req.body,
            ...(req.body.date && { date: new Date(req.body.date) })
        };

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ 
            message: "Appointment updated successfully",
            appointment: updatedAppointment
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating appointment", 
            error: error.message 
        });
    }
});

router.get('/appointments/my', requireAuth, async (req, res) => {
    try {
        const doctorId = req.user._id;

        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'firstName lastName phone') 
            .exec();

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctor's appointments", error: error.message });
    }
});

export default router;