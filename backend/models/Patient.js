import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  phoneNumber: { type: String },
  email: { type: String },
  address: { type: String }
});

const medicalHistorySchema = new mongoose.Schema({
  allergies: { type: [String], default: [] },
  currentPrescriptions: { type: [String], default: [] },
  notes: { type: String }
});

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    familyMembers: { type: [String], default: [] },
    dateOfBirth: { type: Date },
    sex: { type: String, enum: ['Male', 'Female', 'Other'] },
    contactInfo: contactInfoSchema,
    weight: { type: Number },
    height: { type: Number },
    medicalHistory: medicalHistorySchema
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
