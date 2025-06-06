import express from 'express';
import patientRoutes from './patients.js';
import appointmentRoutes from './appointments.js';
import medicalRecordRoutes from './medical-records.js';
import drugRoutes from './drugs.js'
import prescriptionRoutes from './prescriptions.js';
import doctorRoutes from './doctors.js'
import diagnosisRoutes from './diagnosis.js'
import receptionistRoutes from './receptionist.js';

const router = express.Router();

// Prefix all routes with '/api'
router.use('/', appointmentRoutes);
router.use('/', patientRoutes);
router.use('/', diagnosisRoutes);
router.use('/', medicalRecordRoutes);
router.use('/', drugRoutes)
router.use('/', prescriptionRoutes);
router.use('/', doctorRoutes);
router.use('/', receptionistRoutes);

export default router;