import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const DATABASE_URL = process.env.DATABASE_URL as string;

export const connectDB = async () => {
    await mongoose.connect(DATABASE_URL).then(() => {
        console.log('MongoDB connected successfully');
    }).catch(() => {
        console.log("Error connecting to MongoDB ");
    });
};
