const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
const README_PATH = path.join(__dirname, '../README.md');

async function extractTodosFromReadme() {
    const content = await fs.readFile(README_PATH, 'utf8');
    const todoPattern = /^- \[ \] (.+)$/gm;
    const todos = [];
    let match;

    while ((match = todoPattern.exec(content)) !== null) {
        todos.push({
            title: match[1],
            description: `Aus README importiert - ${match[1]}`,
            priority: 'medium',
            status: 'pending'
        });
    }

    return todos;
}

async function getCurrentApiTodos() {
    try {
        const response = await axios.get(`${API_URL}/todos`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Abrufen der ToDos:', error.message);
        return [];
    }
}

async function createTodo(todo) {
    try {
        const response = await axios.post(`${API_URL}/todos`, todo);
        console.log(`ToDo erstellt: ${todo.title}`);
        return response.data;
    } catch (error) {
        console.error(`Fehler beim Erstellen des ToDos ${todo.title}:`, error.message);
    }
}

async function updateReadmeWithTodoStatus() {
    try {
        const apiTodos = await getCurrentApiTodos();
        let content = await fs.readFile(README_PATH, 'utf8');

        // Erstelle eine Map der ToDo-Titel zu ihrem Status
        const todoStatusMap = new Map(
            apiTodos.map(todo => [todo.title, todo.status === 'completed'])
        );

        // Aktualisiere die Checkboxen in der README
        content = content.replace(
            /- \[([ x])\] (.+)$/gm,
            (match, check, title) => {
                const isCompleted = todoStatusMap.get(title);
                return `- [${isCompleted ? 'x' : ' '}] ${title}`;
            }
        );

        await fs.writeFile(README_PATH, content);
        console.log('README wurde aktualisiert');
    } catch (error) {
        console.error('Fehler beim Aktualisieren der README:', error.message);
    }
}

async function syncTodos() {
    try {
        console.log('Starte ToDo-Synchronisation...');
        
        const readmeTodos = await extractTodosFromReadme();
        const apiTodos = await getCurrentApiTodos();
        
        // Finde neue ToDos aus der README
        const existingTitles = new Set(apiTodos.map(todo => todo.title));
        const newTodos = readmeTodos.filter(todo => !existingTitles.has(todo.title));
        
        // Erstelle neue ToDos
        for (const todo of newTodos) {
            await createTodo(todo);
        }
        
        // Aktualisiere README mit aktuellem Status
        await updateReadmeWithTodoStatus();
        
        console.log('Synchronisation abgeschlossen');
    } catch (error) {
        console.error('Fehler bei der Synchronisation:', error.message);
    }
}

// Führe die Synchronisation aus
syncTodos();
