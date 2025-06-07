import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Receptionist from '../models/Receptionist.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all receptionists
router.get('/receptionists', async (req, res) => {
  try {
    const receptionists = await Receptionist.find().select('-password');
    res.status(200).json(receptionists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching receptionists', error: error.message });
  }
});

// GET receptionist by ID
router.get('/receptionists/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid receptionist ID' });
  }

  try {
    const receptionist = await Receptionist.findById(id).select('-password');
    if (!receptionist) return res.status(404).json({ message: 'Receptionist not found' });
    res.status(200).json(receptionist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching receptionist', error: error.message });
  }
});

// CREATE receptionist
router.post('/receptionists', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const receptionist = new Receptionist({
      firstName,
      lastName,
      username,
      email,
      password, // hash in real use
    });

    const savedReceptionist = await receptionist.save();
    res.status(201).json(savedReceptionist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating receptionist', error: error.message });
  }
});

// UPDATE receptionist
router.put('/receptionists/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid receptionist ID' });
  }

  try {
    const updatedReceptionist = await Receptionist.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedReceptionist) return res.status(404).json({ message: 'Receptionist not found' });
    res.status(200).json(updatedReceptionist);
  } catch (error) {
    res.status(500).json({ message: 'Error updating receptionist', error: error.message });
  }
});

// DELETE receptionist
router.delete('/receptionists/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid receptionist ID' });
  }

  try {
    const deletedReceptionist = await Receptionist.findByIdAndDelete(id);
    if (!deletedReceptionist) return res.status(404).json({ message: 'Receptionist not found' });
    res.status(200).json({ message: 'Receptionist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting receptionist', error: error.message });
  }
});

// OPTIONAL: Upload receptionist profile photo
router.put('/receptionists/:id/profile-photo', requireAuth, upload.single('photo'), async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid receptionist ID' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const updatedReceptionist = await Receptionist.findByIdAndUpdate(
      id,
      { profilePhoto: base64Image },
      { new: true }
    );

    if (!updatedReceptionist) {
      return res.status(404).json({ message: 'Receptionist not found' });
    }

    res.status(200).json({ profilePhoto: updatedReceptionist.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

export default router;
