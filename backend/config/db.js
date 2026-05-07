import mongoose from 'mongoose';

export const connectDB = async() => {
    await mongoose.connect('YOUR_DATABASE_URL')
    .then(() => console.log('DB CONNECTED'))
}