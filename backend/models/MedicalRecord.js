import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    title: { type: String, required: true },
    description: String,
    date: { type: Date, default: Date.now },
    attachments: [String], 
});

export default mongoose.model('MedicalRecord', medicalRecordSchema);
