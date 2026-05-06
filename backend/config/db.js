import mongoose from 'mongoose';

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://tilakrajpanchal432_db_user:9DgffUdX40NPINwG@productstore.mxfj7cs.mongodb.net/Taskify')
    .then(() => console.log('DB CONNECTED'))
}