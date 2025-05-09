import express from 'express';
import patientRoutes from './patients.js';
import appointmentRoutes from './appointments.js';

const router = express.Router();

// Prefix all routes with '/api'
router.use('/', appointmentRoutes);
router.use('/', patientRoutes);

export default router;