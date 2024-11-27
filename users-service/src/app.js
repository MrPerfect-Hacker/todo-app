const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// dit is nodig om front-end te verbinden met back-end
app.use(cors());

// Middleware
app.use(bodyParser.json()); // dit is nodig om json te kunnen gebruiken

// Routes
app.use('/api/users', userRoutes); // dit is nodig om de routes te gebruiken

// dit is nodig om te zien of de server draait
app.get('/', (req, res) => {
    res.send('Server werkt!');
});  

// start de server en verbind database
app.listen(PORT, async () => { // async is nodig om connectDB aan te roepen
    await connectDB(); // dit is nodig om de database te verbinden
    console.log(`Server is running on port ${PORT}`); // dit is nodig om te zien of de server draait
})

module.exports = app;  // Exporteer de app voor gebruik in tests

