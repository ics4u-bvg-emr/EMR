import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctors", required: true },
    drugId: { type: mongoose.Schema.Types.ObjectId, ref: "drugs", required: true }, 
    dosage: { type: String, required: true },
    frequency: { type: String, required: true},
    route: { type: String, required: true },
    durationInDays: { type: Number, required: true },
    datePrescribed: { type: Date, default: Date.now },
    instructions: { type: String },
    status: { type: Boolean }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
