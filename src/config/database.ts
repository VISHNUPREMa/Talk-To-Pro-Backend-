import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = 'mongodb+srv://vishnuprem5152:R63W1jKDWhniLEg8@new-cluster.buqgq.mongodb.net/';

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MongoDB connection URI not found in environment variables');
        }      

        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    }
};

export default connectDB;

