import mongoose from 'mongoose';

const examinationFieldsSchema = new mongoose.Schema({
  temperature: String,
  pulse: String,
  bp: String,
  resp: String,
  spo2: String,
  weight: String,
  height: String,
  waist: String,
  bmi: String,
  ldl: String,
  hdl: String,
  triglycerides: String,
  protein: String,
  dipstickGlucose: String,
  blood: String,
  fastingGlucose: String,
  hba1c: String,
  other: String
});

const diagnosisSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  symptoms: [String],
  otherSymptom: String,
  examinationFields: examinationFieldsSchema,
  diagnosis: String,
  prescription: [{
    name: String,
    dose: String,
    frequency: String
  }],
  plan: String,
  followUp: {
    date: Date,
    notes: String
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
diagnosisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

export default Diagnosis;