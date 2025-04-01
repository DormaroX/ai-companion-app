const express = require('express');
const WebSocket = require('ws');
const os = require('os');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const winston = require('winston');

// Logger Setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/mcp-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/mcp.log' })
    ]
});

class MCPServer {
    constructor(port = 9000) {
        this.port = port;
        this.app = express();
        this.metrics = {
            apiCalls: {},
            errors: [],
            performance: {}
        };
        this.setupServer();
        this.setupWebSocket();
        this.setupFileWatcher();
        this.startMetricsCollection();
    }

    setupServer() {
        this.app.use(express.json());
        
        // Endpunkte für Metriken
        this.app.get('/metrics', (req, res) => {
            res.json(this.metrics);
        });

        // Endpunkt für Logs
        this.app.get('/logs', async (req, res) => {
            try {
                const logs = await fs.promises.readFile('logs/combined.log', 'utf8');
                res.json(logs.split('\n').filter(Boolean).map(JSON.parse));
            } catch (error) {
                res.status(500).json({ error: 'Fehler beim Lesen der Logs' });
            }
        });

        // Endpunkt für System-Info
        this.app.get('/system', (req, res) => {
            res.json({
                cpu: os.cpus(),
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    usage: (1 - os.freemem() / os.totalmem()) * 100
                },
                uptime: os.uptime(),
                platform: os.platform(),
                nodeVersion: process.version
            });
        });
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: this.port + 1 });
        
        this.wss.on('connection', (ws) => {
            logger.info('Neue WebSocket-Verbindung');
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleWebSocketMessage(data, ws);
                } catch (error) {
                    logger.error('Fehler bei WebSocket-Nachricht:', error);
                }
            });
        });
    }

    setupFileWatcher() {
        const watcher = chokidar.watch(['src/**/*', 'public/**/*'], {
            ignored: /(^|[\/\\])\../, // Ignoriere versteckte Dateien
            persistent: true
        });

        watcher.on('change', (path) => {
            this.broadcastToClients({
                type: 'fileChange',
                path,
                timestamp: new Date().toISOString()
            });
            logger.info(`Datei geändert: ${path}`);
        });
    }

    startMetricsCollection() {
        setInterval(() => {
            this.metrics.performance = {
                cpu: os.loadavg(),
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    usage: (1 - os.freemem() / os.totalmem()) * 100
                },
                timestamp: new Date().toISOString()
            };
            this.broadcastToClients({
                type: 'metrics',
                data: this.metrics.performance
            });
        }, 5000);
    }

    handleWebSocketMessage(data, ws) {
        switch (data.type) {
            case 'requestMetrics':
                ws.send(JSON.stringify({
                    type: 'metrics',
                    data: this.metrics
                }));
                break;
            case 'logError':
                this.metrics.errors.push({
                    ...data.error,
                    timestamp: new Date().toISOString()
                });
                this.broadcastToClients({
                    type: 'error',
                    data: data.error
                });
                break;
            case 'apiCall':
                this.trackAPICall(data.endpoint, data.method);
                break;
        }
    }

    trackAPICall(endpoint, method) {
        const key = `${method}:${endpoint}`;
        this.metrics.apiCalls[key] = (this.metrics.apiCalls[key] || 0) + 1;
    }

    broadcastToClients(data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            logger.info(`MCP Server läuft auf Port ${this.port}`);
            console.log(`MCP Server läuft auf Port ${this.port}`);
        });
    }
}

module.exports = new MCPServer();
