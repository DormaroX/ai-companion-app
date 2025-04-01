const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/todo-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/todo.log' })
    ]
});

class TodoService {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data/todos.json');
        this.ensureDataFile();
    }

    async ensureDataFile() {
        try {
            await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
            try {
                await fs.access(this.dataPath);
            } catch {
                await fs.writeFile(this.dataPath, JSON.stringify({ todos: [] }));
            }
        } catch (error) {
            logger.error('Error initializing todo data file:', error);
            throw error;
        }
    }

    async getAllTodos() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data).todos;
        } catch (error) {
            logger.error('Error reading todos:', error);
            throw error;
        }
    }

    async addTodo(title, description, dueDate, priority = 'medium') {
        try {
            const todos = await this.getAllTodos();
            const newTodo = {
                id: uuidv4(),
                title,
                description,
                dueDate,
                priority,
                status: 'pending',
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                version: 1,
                history: [{
                    version: 1,
                    timestamp: new Date().toISOString(),
                    action: 'created',
                    changes: { title, description, dueDate, priority }
                }],
                followUps: []
            };

            todos.push(newTodo);
            await fs.writeFile(this.dataPath, JSON.stringify({ todos }, null, 2));
            logger.info('Todo created:', { todoId: newTodo.id });
            return newTodo;
        } catch (error) {
            logger.error('Error adding todo:', error);
            throw error;
        }
    }

    async updateTodo(id, updates) {
        try {
            const todos = await this.getAllTodos();
            const todoIndex = todos.findIndex(todo => todo.id === id);
            
            if (todoIndex === -1) {
                throw new Error('Todo not found');
            }

            const todo = todos[todoIndex];
            const newVersion = todo.version + 1;
            
            const updatedTodo = {
                ...todo,
                ...updates,
                version: newVersion,
                modified: new Date().toISOString(),
                history: [...todo.history, {
                    version: newVersion,
                    timestamp: new Date().toISOString(),
                    action: 'updated',
                    changes: updates
                }]
            };

            todos[todoIndex] = updatedTodo;
            await fs.writeFile(this.dataPath, JSON.stringify({ todos }, null, 2));
            logger.info('Todo updated:', { todoId: id, version: newVersion });
            return updatedTodo;
        } catch (error) {
            logger.error('Error updating todo:', error);
            throw error;
        }
    }

    async addFollowUp(todoId, followUpText) {
        try {
            const todos = await this.getAllTodos();
            const todoIndex = todos.findIndex(todo => todo.id === todoId);
            
            if (todoIndex === -1) {
                throw new Error('Todo not found');
            }

            const followUp = {
                id: uuidv4(),
                text: followUpText,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            todos[todoIndex].followUps.push(followUp);
            await fs.writeFile(this.dataPath, JSON.stringify({ todos }, null, 2));
            logger.info('Follow-up added:', { todoId, followUpId: followUp.id });
            return followUp;
        } catch (error) {
            logger.error('Error adding follow-up:', error);
            throw error;
        }
    }

    async getTodoHistory(id) {
        try {
            const todos = await this.getAllTodos();
            const todo = todos.find(todo => todo.id === id);
            
            if (!todo) {
                throw new Error('Todo not found');
            }

            return todo.history;
        } catch (error) {
            logger.error('Error getting todo history:', error);
            throw error;
        }
    }
}

module.exports = new TodoService();
