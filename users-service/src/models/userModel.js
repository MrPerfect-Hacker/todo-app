const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); //dit is nodig om createdAt en updatedAt te krijgen in de database 

module.exports = mongoose.model('User', userSchema);


