const jwt = require('jsonwebtoken');
const Task = require('../models/taskModel');

// middeleware voor authenticatie via jwt token
exports.authenticateToken = (req, res, next) => {
  const token = req.header['authorization'] && req.header['authorization'].split(' ')[1]; // haal token uit authorization header
  if (!token) {
    return res.status(403).json({ error: 'Geen token gevonden!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is ongeldig!' });
    }
    req.user = user; // bewaar de gebruikersinformatie uit het token
    next();
  });
};

// Alle taken ophalen (gebruiker moet ingelogd zijn)
exports.getAllTasks = async (req, res) => {
  try {
    // zoeken naar taken die specifiek tot de ingelogde gebruiker behoren
    const tasks = await Task.find( { userId: req.user.id } );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Fout bij ophalen van taken: ' + error.message });
  }
};

// Taak aanmaken (Alleen voor de ingelogde gebruikers)
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Titel en en beschrijving zijn verplicht!' });
    }

    const newTask = new Task({ 
      title, 
      description, 
      userId: req.user.id, // Taak wordt gekoppeld aan de ingelogde gebruiker
    });

    await newTask.save();
    res.status(201).json({ message: 'Taak succesvol aangemaakt!', task: newTask });
  } catch (error) {
    res.status(500).json({ error: 'Fout bij het aanmaken van de taak: ' + error.message });
  }
};
// Taak bijwerken
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    // Zoek de taak op basis van taskId
    const task = await Task.findById(taskId);

    // Controleer of de taak bestaat en of de ingelogde gebruiker de eigenaar is
    if (!task) {
      return res.status(404).json({ error: 'Taak niet gevonden!' });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Je hebt geen toestemming om deze taak bij te werken!' });
    }

    // Bijwerken van de taak
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    res.status(200).json({ message: 'Taak succesvol bijgewerkt!', task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Fout bij bijwerken van de taak: ' + error.message });
  }
};

// Taak verwijderen
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Zoek de taak op basis van taskId
    const task = await Task.findById(taskId);

    // Controleer of de taak bestaat en of de ingelogde gebruiker de eigenaar is
    if (!task) {
      return res.status(404).json({ error: 'Taak niet gevonden!' });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Je hebt geen toestemming om deze taak te verwijderen!' });
    }

    // Verwijder de taak
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Taak succesvol verwijderd!' });
  } catch (error) {
    res.status(500).json({ error: 'Fout bij verwijderen van de taak: ' + error.message });
  }
};

