import express from 'express';
import patientRoutes from './patients.js';
import appointmentRoutes from './appointments.js';
import medicalRecordRoutes from './medical-records.js';
import drugRoutes from './drugs.js'

const router = express.Router();

// Prefix all routes with '/api'
router.use('/', appointmentRoutes);
router.use('/', patientRoutes);
router.use('/', medicalRecordRoutes);
router.use('/', drugRoutes)

export default router;