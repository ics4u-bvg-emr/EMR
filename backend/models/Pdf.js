import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema({
  filename: String,
  gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  uploadedAt: { type: Date, default: Date.now },
  notes: String,
});

export default mongoose.model('PdfReference', PdfSchema);
