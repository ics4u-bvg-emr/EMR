import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  specialization: String,
  username:  { type: String, unique: true, required: true },
  email:     { type: String, unique: true, required: true },
  password:  { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user', 'doctor'],
    default: 'user',
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpires: Date,

  profilePhoto: { type: String },
  gender: String,
  dob: Date,
  phone: String,
  bio: String,
  address: String,
  experience: Number,
  certifications: String,
  onCall: Boolean,
  hours: String,
  patientLoad: Number,
}, { timestamps: true });


const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor
