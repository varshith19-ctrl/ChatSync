import mongoose from 'mongoose';

const connectDB=async () => {
    try {
        const conn =await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.name}`);
         
    } catch (error) { 
        console.log(`MongoDB connection Error:${error}`);
        
    }
}
export default connectDB