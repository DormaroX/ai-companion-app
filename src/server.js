const express = require('express');
const cors = require('cors');
const winston = require('winston');
const path = require('path');
const todoApi = require('./api/todoApi');
const mcpServer = require('./mcp/mcpServer');

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip
    });
    next();
});

// Statische Dateien für MCP
app.use('/mcp', express.static(path.join(__dirname, '../public/mcp')));

// Routes
app.use('/api/todos', todoApi);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start servers
app.listen(PORT, () => {
    // Starte MCP Server
    mcpServer.start();

    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
});
