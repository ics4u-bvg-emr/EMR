import express from 'express';
import mongoose from 'mongoose';
import MedicalRecord from '../models/MedicalRecord';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

router.get('/medical-records', async (req, res) => {
    try {
        const records = await MedicalRecord.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching medical records', 
            error: error.message 
        });
    }
});

router.get('/medical-records/:patientId', async (req, res) => {
    const { patientId } = req.params;

    if (!ObjectId.isValid(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID format' });
    }

    try {
        const records = await MedicalRecord.find({ patientId });
        res.json(records);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching records for patient', 
            error: error.message 
        });
    }
});

router.post('/medical-records', async (req, res) => {
    try {
        const { patientId, doctorId, title, description, date, attachments } = req.body;

        if (!ObjectId.isValid(patientId) || !ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid patient or doctor ID' });
        }

        const record = new MedicalRecord({
            patientId,
            doctorId,
            title,
            description,
            date: date ? new Date(date) : new Date(),
            attachments
        });

        const saved = await record.save();
        res.status(201).json({ 
            message: 'Medical record created successfully', 
            _id: saved._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error saving medical record', 
            error: error.message 
        });
    }
});

router.put('/medical-records/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid record ID format' });
    }

    try {
        const updated = await MedicalRecord.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Record updated', record: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating record', error: error.message });
    }
});

router.delete('/medical-records/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid record ID format' });
    }

    try {
        await MedicalRecord.findByIdAndDelete(id);
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting record', error: error.message });
    }
});

export default router;
