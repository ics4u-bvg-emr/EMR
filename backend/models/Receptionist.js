import mongoose from 'mongoose';

const receptionistSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  username:  { type: String, unique: true, required: true },
  email:     { type: String, unique: true, required: true },
  password:  { type: String, required: true },
  role: {
    type: String,
    enum: ['receptionist'],
    default: 'receptionist',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetToken: String,
  resetTokenExpires: Date,

  profilePhoto: { type: String },
});

const Receptionist = mongoose.model('Receptionist', receptionistSchema);
export default Receptionist;