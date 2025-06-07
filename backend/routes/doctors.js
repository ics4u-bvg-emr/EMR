import express from 'express';
import Doctor from '../models/Doctor.js';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
});

router.get('/doctors/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
});

router.post('/doctors', async (req, res) => {
    try {
        const { firstName, lastName, specialization, username, email, password, role } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const doctor = new Doctor({ firstName, lastName, specialization, username, email, password, role });
        const savedDoctor = await doctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Error creating doctor', error: error.message });
    }
});

router.put('/doctors/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDoctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor', error: error.message });
    }
});

router.delete('/doctors/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        if (!deletedDoctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(200).json({ message: 'Doctor deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error: error.message });
    }
});

router.put('/doctors/:id/profile-photo', requireAuth, upload.single('photo'), async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const updatedDoctor = await Doctor.findByIdAndUpdate(
        id,
        { profilePhoto: base64Image },
        { new: true }
        );

        if (!updatedDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ profilePhoto: updatedDoctor.profilePhoto });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading photo', error: error.message });
    }
});

export default router;
