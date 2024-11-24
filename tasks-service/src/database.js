const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('MongoDB is verbonden');
  } catch (error) {
    console.error('Fout bij verbinden met MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
