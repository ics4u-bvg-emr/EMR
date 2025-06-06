import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import authRoutes from './routes/auth.js'; // ✅ Add this
import protectedRoutes from './routes/protected.js'; // ✅ Add this
 
dotenv.config();
 
const app = express();
const port = process.env.PORT || 3000;
 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
 
// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
 
// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);          // ✅ Now this works
app.use('/api/protected', protectedRoutes);
 
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 