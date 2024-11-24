const express = require('express');
const { createTask, getAllTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Gebruik de authenticateToken middleware voor de routes die bescherming nodig hebben
router.post('/', authenticateToken, createTask);           // Taak aanmaken
router.get('/', authenticateToken, getAllTasks);           // Alle taken ophalen
router.put('/:taskId', authenticateToken, updateTask);     // Taak bijwerken
router.delete('/:taskId', authenticateToken, deleteTask);  // Taak verwijderen

module.exports = router;
