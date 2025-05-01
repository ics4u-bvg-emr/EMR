import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/index.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; 

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

//Routes 
app.use('/api', routes);

//Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 