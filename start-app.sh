#!/bin/bash

# Logging-Funktion
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Verzeichnis zum Projektroot wechseln
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Überprüfe ob alle notwendigen Dienste laufen
check_dependencies() {
    log "Überprüfe Abhängigkeiten..."
    if ! command -v node &> /dev/null; then
        log "ERROR: Node.js ist nicht installiert"
        exit 1
    fi
}

# Stoppe eventuell laufende Prozesse
stop_processes() {
    log "Stoppe eventuell laufende Prozesse..."
    
    # Finde und beende Vite-Prozesse
    pkill -f "vite" || true
    
    # Finde und beende Electron-Prozesse
    pkill -f "electron.*$PROJECT_ROOT" || true
    
    # Finde und beende TTS-Server
    pkill -f "node.*ttsServer.js" || true
    
    # Warte kurz, damit alle Prozesse beendet werden können
    sleep 2
}

# Starte die Server und die App
start_app() {
    log "Starte AI Companion Hub..."
    
    # Starte den TTS-Server
    log "Starte TTS-Server..."
    node start-tts-server.js &
    TTS_PID=$!
    log "TTS-Server gestartet (PID: $TTS_PID)"
    
    # Warte kurz, damit der TTS-Server hochfahren kann
    sleep 2
    
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
    
    # Speichere PIDs in einer Datei für späteres Cleanup
    echo "$TTS_PID $VITE_PID $ELECTRON_PID" > .app_pids
}

# Hauptprozess
main() {
    log "Starte AI Companion Hub..."
    check_dependencies
    stop_processes
    start_app
    
    # Warte auf Beendigung und handle Signale
    trap 'log "Beende Anwendung..."; kill $(cat .app_pids 2>/dev/null) 2>/dev/null; rm .app_pids 2>/dev/null; exit' SIGINT SIGTERM
    wait
}

# Führe das Hauptprogramm aus
main
