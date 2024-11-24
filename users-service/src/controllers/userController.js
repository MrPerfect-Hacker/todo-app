const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Gebruiker registreren
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vul alle velden in!' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Gebruiker bestaat al!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Versleutel wachtwoord
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Gebruiker succesvol geregistreerd!' });
  } catch (error) {
    console.error('Registratiefout:', error.message);
    res.status(500).json({ error: 'Registratie mislukt' });
  }
};

// Gebruiker inloggen
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vul alle velden in!' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Ongeldig wachtwoord!' });
    }

    // JWT Token genereren
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Succesvol ingelogd!', token });
  } catch (error) {
    console.error('Loginfout:', error.message);
    res.status(500).json({ error: 'Inloggen mislukt' });
  }
};

// Alle gebruikers ophalen
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fout bij ophalen van gebruikers' });
  }
};
