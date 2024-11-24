const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser); // Gebruiker registreren
router.post('/login', loginUser);       // Gebruiker inloggen
router.get('/', getAllUsers);          // Alle gebruikers ophalen

module.exports = router;
