import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  specialization: { type: String },
  username:  { type: String, unique: true, required: true },
  email:     { type: String, unique: true, required: true },
  password:  { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user', 'doctor'],
    default: 'user',
  },

  // 🆕 Email verification
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,

  // 🔁 Password reset
  resetToken: String,
  resetTokenExpires: Date,
})

const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor
