const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Haal het token uit de header

  if (!token) {
    return res.status(403).json({ error: 'Toegang geweigerd. Geen token verstrekt.' });
  }

  try {
    // Verifieer de JWT met de geheim sleutel
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Voeg de gedecodeerde informatie toe aan de request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Ongeldig of verlopen token.' });
  }
};

module.exports = authenticateToken;
