import express from 'express';
import Diagnosis from '../models/Diagnosis.js';
import mongoose from 'mongoose';

const router = express.Router();
const { Types } = mongoose;

// Create or update a diagnosis
router.post('/patients/:patientId/diagnosis', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { doctorId, status, ...diagnosisData } = req.body;

    // Validate IDs
    if (!Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
    }
    if (!Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    // Validate status
    if (status && !['draft', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    // Convert prescription string to array if needed
    if (typeof diagnosisData.prescription === 'string') {
        try {
            diagnosisData.prescription = JSON.parse(diagnosisData.prescription);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid prescription format' });
        }
    }

    // Find and update or create new diagnosis
    const diagnosis = await Diagnosis.findOneAndUpdate(
        { patientId },
        {
            ...diagnosisData,
            doctorId,
            status: status || 'draft',
            patientId
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(diagnosis);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error saving diagnosis', 
      error: error.message 
    });
  }
});

// Get diagnosis for a patient
router.get('/patients/:patientId/diagnosis', async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const diagnosis = await Diagnosis.findOne({ patientId })
      .populate('doctorId', 'firstName lastName specialization')
      .populate('patientId', 'firstName lastName dateOfBirth sex');

    if (!diagnosis) {
      return res.status(404).json({ message: 'No diagnosis found' });
    }

    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching diagnosis', 
      error: error.message 
    });
  }
});

// Get all diagnoses (for doctor's dashboard)
router.get('/diagnosis', async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    const filter = {};

    if (doctorId) {
      if (!Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
      }
      filter.doctorId = doctorId;
    }

    if (status) {
      if (!['draft', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      filter.status = status;
    }

    const diagnoses = await Diagnosis.find(filter)
      .populate('patientId', 'firstName lastName dateOfBirth')
      .sort({ updatedAt: -1 });

    res.json(diagnoses);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching diagnoses', 
      error: error.message 
    });
  }
});

// Get all draft diagnoses for a doctor
router.get('/doctors/:doctorId/diagnosis/drafts', async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const drafts = await Diagnosis.find({ 
      doctorId,
      status: 'draft'
    })
    .populate('patientId', 'firstName lastName dateOfBirth')
    .sort({ updatedAt: -1 })
    .lean(); // Add lean() for better performance

    // Ensure we always return an array
    res.json(drafts || []);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ 
      message: 'Error fetching draft diagnoses', 
      error: error.message 
    });
  }
});

// Delete a diagnosis
router.delete('/diagnosis/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid diagnosis ID' });
    }

    const deleted = await Diagnosis.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.json({ message: 'Diagnosis deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting diagnosis', 
      error: error.message 
    });
  }
});

export default router;