require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Failed to connect to the Database");
        process.exit(1);
    }
}
module.exports = connectDB;