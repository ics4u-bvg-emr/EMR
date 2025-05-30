import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    // date: { type: Date, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: { type: String, required: true },
    notes: { type: String },
    status: { type: String, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;