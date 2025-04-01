#!/bin/bash

# Verzeichnis des Projekts
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# Funktion zum Überprüfen des Server-Status
check_server() {
    local port=$1
    local max_attempts=30
    local attempt=1

    echo "Warte auf Server auf Port $port..."
    while ! nc -z localhost $port; do
        if [ $attempt -ge $max_attempts ]; then
            echo "Server auf Port $port konnte nicht gestartet werden"
            return 1
        fi
        sleep 1
        ((attempt++))
    done
    echo "Server auf Port $port läuft"
    return 0
}

# Stoppe eventuell laufende Server
echo "Stoppe eventuell laufende Server..."
npm run server:stop 2>/dev/null || true

# Starte die Server
echo "Starte Server..."
npm run server:start

# Überprüfe Server-Status
check_server 3000 # API Server
check_server 9000 # MCP Server

# Zeige Server-Status
echo -e "\nServer-Status:"
npm run server:status

echo -e "\nServer-Logs können mit 'npm run server:logs' angezeigt werden"
echo "Server-Monitoring ist verfügbar unter 'npm run server:monitor'"
