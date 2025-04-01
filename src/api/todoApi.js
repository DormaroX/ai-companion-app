const express = require('express');
const router = express.Router();
const todoService = require('../services/todoService');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await todoService.getAllTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new todo
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const todo = await todoService.addTodo(title, description, dueDate, priority);
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update todo
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const todo = await todoService.updateTodo(req.params.id, updates);
        res.json(todo);
    } catch (error) {
        res.status(error.message === 'Todo not found' ? 404 : 500)
           .json({ error: error.message });
    }
});

// Add follow-up to todo
router.post('/:id/follow-up', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Follow-up text is required' });
        }
        const followUp = await todoService.addFollowUp(req.params.id, text);
        res.status(201).json(followUp);
    } catch (error) {
        res.status(error.message === 'Todo not found' ? 404 : 500)
           .json({ error: error.message });
    }
});

// Get todo history
router.get('/:id/history', async (req, res) => {
    try {
        const history = await todoService.getTodoHistory(req.params.id);
        res.json(history);
    } catch (error) {
        res.status(error.message === 'Todo not found' ? 404 : 500)
           .json({ error: error.message });
    }
});

module.exports = router;
