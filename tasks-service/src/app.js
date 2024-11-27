const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// dit is nodig om de frontend te laten communiceren met de backend
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Start server en verbind database
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Tasks-service draait op poort ${PORT}`);
});

module.exports = app;  // Exporteer de app zodat het beschikbaar is voor tests