# AI Companion Hub

Ein zentraler interaktiver Raum für KI-gestützte Mensch-Computer-Interaktion mit multimodalen Fähigkeiten.

## Entwicklungsregeln
- Strikte Fehleranalyse vor Änderungen
- Umfangreiches Logging für neue Funktionen
- Versionskontrolle für alle Änderungen

## Technologie-Stack

### Frontend
- Electron + React für die Desktop-Anwendung
- HTML/CSS für die Benutzeroberfläche
- Detaillierter [UI Style Guide](docs/UI.md) mit:
  - Farbschema (Dunkelgrau/Anthrazit mit Akzentfarben)
  - Typografie (Inter, Poppins, Space Mono)
  - Animierte Hintergründe und Partikel-Effekte
  - Komponenten-Design und Stimmungsanzeige

### Backend & APIs
- OpenAI API für LLM und TTS
- Whisper API für Spracherkennung
- SadTalker für Avatar-Animation
- eSpeakNG für Audio-Playback
- MCP Server für Monitoring und Debugging (Port 9000)
  - Live-Metriken (CPU, Memory, API-Aufrufe)
  - Echtzeit-Logging
  - Dateiänderungsverfolgung
  - Performance-Überwachung

### Datenspeicherung & Verwaltung
- Git für Versionskontrolle
- JSON für Memory-System
- YAML/JSON für Charakter-Presets

## Prioritäten & Roadmap

### Phase 1: Grundstruktur
- [x] Projekt-Setup
- [x] Git-Repository Einrichtung
- [x] MCP Server Konfiguration
- [x] ToDo-System mit Versionierung
- [x] Logging & Debugging System

### Phase 2: Kernfunktionen
- [x] Basis-Frontend mit Electron
- [x] Live Reload für schnelle Entwicklung
- [x] Umfangreiches Logging-System
- [ ] Chat-Interface
- [ ] OpenAI API Integration
- [x] Hintergrundbild und -musik im Loop
- [ ] TTS-Integration
- [ ] Memory-System Implementation

### Phase 3: Erweiterte Funktionen
- [ ] Whisper Spracherkennung
- [ ] Avatar-Integration mit SadTalker/EMO
- [ ] Charakter-Preset System
- [ ] Trigger-System

### Phase 4: Optimierung
- [ ] Performance-Optimierung
- [ ] Fehlerbehandlung
- [ ] Tests

## Server-Management

Die Server werden mit PM2 verwaltet und können über folgende Befehle gesteuert werden:

### Automatischer Start
```bash
./scripts/start-servers.sh
```

### Manuelle Steuerung
- `npm run server:start` - Server starten
- `npm run server:stop` - Server stoppen
- `npm run server:restart` - Server neustarten
- `npm run server:status` - Status anzeigen
- `npm run server:logs` - Logs anzeigen
- `npm run server:monitor` - Live-Monitoring

## API Dokumentation
Die vollständige API-Dokumentation finden Sie in der [API.md](docs/API.md) Datei.

## Backup-System

Das Projekt verfügt über ein automatisches Backup-System mit Zeitstempeln. Backups werden im `backups`-Verzeichnis gespeichert und enthalten sowohl die Projektdateien als auch Metadaten zum Git-Status.

### Backup erstellen
```bash
./scripts/backup.sh
```

### Backups anzeigen
```bash
./scripts/restore.sh list
```

### Backup wiederherstellen
```bash
./scripts/restore.sh restore backup_20250328_225500
```
Jedes Backup enthält:
- Zeitstempel der Erstellung
- Aktuelle Git-Branch und Commit
- Anzahl der gesicherten Dateien
- Größe des Backups


