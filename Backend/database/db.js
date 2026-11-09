import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI?.trim() || 'mongodb://127.0.0.1:27017';
        const parsedUri = new URL(mongoUri);
        const options = !parsedUri.pathname || parsedUri.pathname === '/'
            ? { dbName: 'note-app' }
            : {};
        await mongoose.connect(mongoUri, options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/bad auth|authentication failed/i.test(message) || error?.code === 18 || error?.code === 8000) {
            console.error('MongoDB authentication failed. Verify the Atlas database username and password, and percent-encode reserved characters in the password.');
            return;
        }
        console.error('MongoDB connection failed. The API is running without database access.');
        console.error(message);
    }
};

export default connectDB;