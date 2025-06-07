import express from 'express';
import Patient from '../models/Patient.js';
import mongoose from "mongoose";

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

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

// GET specific patient by ID
router.get('/patients/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid patient ID format" });
        }

        const patient = await Patient.findById(req.params.id);
        
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ 
            message: "Error getting patient", 
            error: error.message 
        });
    }
});

//POSTS
router.post('/patients', async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, sex, contactInfo } = req.body;

        if (!firstName) {
            return res.status(400).json({ message: "First name is required" });
        }
        if (!lastName) {
            return res.status(400).json({ message: "Last name is required" });
        }
        if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
            return res.status(400).json({ message: "Invalid date of birth format" });
        }

        const patient = new Patient({
            firstName,
            lastName,
            ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
            ...(sex && { sex }),
            ...(req.body.familyMembers && { familyMembers: req.body.familyMembers }),
            ...(req.body.contactInfo && { contactInfo: {
                phoneNumber: req.body.contactInfo.phoneNumber,
                email: req.body.contactInfo.email,
                address: req.body.contactInfo.address
            }}),
            ...(req.body.weight && { weight: req.body.weight }),
            ...(req.body.height && { height: req.body.height }),
            ...(req.body.allergies && { allergies: req.body.allergies }),
            ...(req.body.medicalHistory && { medicalHistory: {
                pastConditions: req.body.medicalHistory.pastConditions || [],
                currentPrescriptions: req.body.medicalHistory.currentPrescriptions || [],
                familyHistory: req.body.medicalHistory.familyHistory || [],
                notes: req.body.medicalHistory.notes
            }}),
            ...(req.body.profilePicture && { profilePicture: req.body.profilePicture }),

        });

        const savedPatient = await patient.save();

        res.status(201).json({
            message: "Patient created successfully",
            _id: savedPatient._id
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating patient",
            error: error.message
        });
    }
});

//DELETE
router.delete('/patients/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid patient ID format" });
        }

        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        
        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({ 
            message: "Patient deleted successfully",
            _id: req.params.id
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting patient", 
            error: error.message 
        });
    }
});

//PUT
router.put('/patients/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid patient ID format" });
        }

        if (req.body.sex && !['Male', 'Female', 'Other'].includes(req.body.sex)) {
            return res.status(400).json({ message: "Invalid sex value" });
        }
        if (req.body.dateOfBirth && isNaN(Date.parse(req.body.dateOfBirth))) {
            return res.status(400).json({ message: "Invalid date of birth format" });
        }

        const updatedData = {
            ...req.body,
            ...(req.body.dateOfBirth && { dateOfBirth: new Date(req.body.dateOfBirth) }),
            ...(req.body.contactInfo && {
                contactInfo: {
                    ...req.body.contactInfo
                }
            }),
            ...(req.body.medicalHistory && {
                medicalHistory: {
                    pastConditions: req.body.medicalHistory.pastConditions || [],
                    currentPrescriptions: req.body.medicalHistory.currentPrescriptions || [],
                    familyHistory: req.body.medicalHistory.familyHistory || [],
                    notes: req.body.medicalHistory.notes
                }
            })
        };

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({ 
            message: "Patient updated successfully",
            patient: updatedPatient
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating patient", 
            error: error.message 
        });
    }
});

export default router;