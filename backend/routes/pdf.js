import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import path from 'path';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';
import PdfReference from '../models/Pdf.js';

dotenv.config();
const router = express.Router();


const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("MONGO_URI =", process.env.MONGO_URI);


let gfs;
let gridFSBucket;

conn.once('open', () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: 'pdfs' });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('pdfs');
});


const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    if (file.mimetype === 'application/pdf') {
      return {
        filename: Date.now() + path.extname(file.originalname),
        bucketName: 'pdfs',
      };
    }
    return null;
  },
});

const upload = multer({ storage });


router.post('/upload-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or not a PDF' });
  }

  try {
    const reference = new PdfReference({
      filename: req.file.filename,
      gridFsId: req.file.id,
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      note: req.body.note,
    });

    await reference.save();
    res.status(200).json({ message: 'PDF uploaded and reference saved', file: req.file });
  } catch (err) {
    res.status(500).json({ error: 'Upload succeeded but failed to save reference', details: err });
  }
});



router.get('/pdf/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file || file.contentType !== 'application/pdf') {
      return res.status(404).json({ error: 'File not found or not a PDF' });
    }

    const readStream = gridFSBucket.openDownloadStream(file._id);
    res.set('Content-Type', 'application/pdf');
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving file' });
  }
});


router.delete('/pdf/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: 'File not found' });

    await gridFSBucket.delete(file._id);
    await PdfReference.deleteOne({ gridFsId: file._id });

    res.status(200).json({ message: 'File and reference deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting file' });
  }
});



export default router;

