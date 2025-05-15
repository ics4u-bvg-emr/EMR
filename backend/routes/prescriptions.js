import express from 'express';
import Prescription from '../models/Prescription.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await Prescription.find();
        res.json(prescriptions);

    } catch (error){
        res.status(500).json({
            message: "error getting prescriptions",
            error: error.message
        });
    }
});

router.post('/prescriptions', async (req, res) => {
     
    const { patientId, doctorId, drugId, dosage, frequency } = req.body;
     
    if (!patientId || !doctorId || !drugId || !dosage || !frequency) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const prescription = new Prescription(req.body);

        await prescription.save();
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({
            message: "Error creating prescription",
            error: error.message
        });
    } 
});

router.get('/prescriptions/:id', async (req, res) => { 
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid prescription ID' });
    }

    try {
        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json(prescription);
    } catch (error) {
        res.status(500).json({
            message: "Error getting prescription",
            error: error.message
        });
    }
});

router.put('/prescriptions/:id', async (req, res) => { 
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid prescription ID' });
    }

    try {
        const prescription = await Prescription.findByIdAndUpdate(id, req.body, { new: true });

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json(prescription);
    } catch (error) {
        res.status(500).json({
            message: "Error updating prescription",
            error: error.message
        });
    }
});


router.delete('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid prescription ID' });
    }

    try {
        const prescription = await Prescription.findByIdAndDelete(id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting prescription",
            error: error.message
        });
    }
});

export default router;