#!/bin/bash

# Logging-Funktion
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Verzeichnis zum Projektroot wechseln
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Überprüfe ob alle notwendigen Dienste laufen
check_dependencies() {
    log "Überprüfe Abhängigkeiten..."
    if ! command -v node &> /dev/null; then
        log "ERROR: Node.js ist nicht installiert"
        exit 1
    fi
}

# Starte die Server
start_servers() {
    log "Starte AI Companion Hub Server..."
    
    # Starte den Vite-Entwicklungsserver
    log "Starte Vite-Entwicklungsserver..."
    npm run dev &
    VITE_PID=$!
    log "Vite-Server gestartet (PID: $VITE_PID)"
    
    # Warte kurz, damit der Vite-Server hochfahren kann
    sleep 5
    
    # Starte die Electron-App
    log "Starte Electron-App..."
    npm run electron-dev &
    ELECTRON_PID=$!
    log "Electron-App gestartet (PID: $ELECTRON_PID)"
}

# Hauptprozess
main() {
    log "Starte AI Companion Hub..."
    check_dependencies
    start_servers
    
    # Warte auf Beendigung und handle Signale
    trap 'kill $MAIN_PID; exit' SIGINT SIGTERM
    wait
}

main
