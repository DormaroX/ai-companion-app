# ToDo-Liste

## Phase 1: Grundstruktur (Abgeschlossen)

1. ✅ Projekt-Setup
2. ✅ Git-Repository Einrichtung
3. ✅ MCP Server Konfiguration (Basis)
4. ✅ ToDo-System mit Versionierung
5. ✅ Logging & Debugging System

## Phase 2: Kernfunktionen

### Abgeschlossene Aufgaben
1. ✅ Basis-Frontend mit Electron
2. ✅ Live Reload für schnelle Entwicklung
3. ✅ Umfangreiches Logging-System
4. ✅ Hintergrundbild und -musik im Loop
5. ✅ Container-Transparenz implementieren
   - ✅ Paper und Card Komponenten mit transparentem Hintergrund
   - ✅ Glassmorphism-Effekt für bessere Lesbarkeit
6. ✅ Charakterbilder einbinden
   - ✅ Bilder in assets/images/characters/ ablegen
   - ✅ Optimale Bildgrößen und Formate festlegen
7. ✅ Carousel-Funktionalität entwickeln
   - ✅ Horizontales Scrolling für Charakterauswahl
   - ✅ Touch- und Maussteuerung
   - ✅ Animierte Übergänge
8. ✅ UI-Komponenten verfeinern
   - ✅ Bessere visuelle Hierarchie
   - ✅ Einheitliche Abstände und Ausrichtungen
   - ✅ Hover- und Fokus-Zustände
9. ✅ Kritische UI-Fixes
   - ✅ Vollbild-Modus beim App-Start (F11 für Vollbild-Toggle)
   - ✅ Auswahl-Button Trigger-Fehler beheben
   - ✅ Terras Bildgröße im Charakter-Carousel anpassen

### Offene Aufgaben

1. ✅ TTS-Integration
   - ✅ TTS-Funktionalität während der Charakterauswahl-Animation
   - ✅ TTS-Server implementieren
   - ✅ Verbindung zum OpenAI TTS-API herstellen
   - ✅ Fehlerbehandlung und Fallback-Mechanismen
   - ✅ Mapping von Charakternamen zu gültigen OpenAI TTS-Stimmen

2. ✅ Chat-Interface
   - ✅ Bubble-Chat-Prozess implementieren
   - ✅ Nachrichtenverlauf speichern
   - ✅ Benutzerfreundliche Eingabe und Anzeige
   - ✅ Emoji- und Markdown-Unterstützung

3. ⚠️ OpenAI API Integration
   - ✅ API-Schlüssel-Verwaltung
   - ✅ Chat-Completion-Endpunkt anbinden
   - ✅ Modell-Parameter konfigurierbar machen

4. ✅ Chat-Interface Verbesserungen
   - ✅ Chat-Text des ausgewählten Charakters
     - ✅ Kleines Bild vor dem Chat-Text einfügen
     - ✅ Grauer Kreis als Hintergrund
     - ✅ Bild im oberen Drittel fokussieren (Gesicht sichtbar)
   - ✅ Weniger Abstand oberhalb und unterhalb des Chat-Textes (kleinere Bubble)
   - ✅ Chat-Bubble für Benutzer
     - ✅ Farbe in glitzerndes Anthrazit ändern
     - ✅ Länge der Bubble an Textlänge anpassen
   - ✅ Emoji-Auswahl erweitern (mehr als 1 Emoji verfügbar machen)

## Phase 3: Erweiterte Funktionen

1. ❌ MCP-Server verbessern
   - ❌ Alte whisper Codes löschen
   - ❌ Auf whisper-node umstellen
   - ❌ Spracherkennung optimieren
   - ❌ Fehlerbehandlung verbessern

2. ❌ Whisper Spracherkennung
   - ❌ Lokale Spracherkennung implementieren
   - ❌ Sprachbefehle definieren
   - ❌ Feedback für erkannte Sprache

3. ❌ Avatar-Integration mit SadTalker/EMO
   - ❌ 3D-Modell-Integration
   - ❌ Lippensynchronisation mit TTS
   - ❌ Emotionale Reaktionen basierend auf Konversation

4. ❌ Charakter-Preset System
   - ❌ Benutzerdefinierte Charaktere erstellen
   - ❌ Import/Export von Charakterprofilen
   - ❌ Vorlagen für verschiedene Charaktertypen

5. ❌ Memory-System Implementation
   - ❌ Persistente Speicherung von Konversationen
   - ❌ Kontextmanagement für AI-Antworten
   - ❌ Benutzereinstellungen speichern
   
6.   ❌ Trigger-System
   - ❌ Ereignisbasierte Aktionen
   - ❌ Benutzerdefinierte Trigger definieren
   - ❌ Integration mit anderen Systemen

## Phase 3.5: Bereinigung und Optimierung

1. ❌ Temporäre Dateien bereinigen
   - ❌ Temporäre Audio-Dateien in public/audio/tts/ regelmäßig löschen
   - ❌ Test-Output-Dateien entfernen
   - ❌ Automatische Bereinigung implementieren

## Phase 4: Optimierung

1. ❌ Performance-Optimierung
   - ❌ Code-Splitting
   - ❌ Asset-Optimierung
   - ❌ Caching-Strategien

2. ❌ Fehlerbehandlung
   - ❌ Umfassende Fehlerprotokolle
   - ❌ Benutzerfreundliche Fehlermeldungen
   - ❌ Automatische Wiederherstellung

3. ❌ Tests
   - ❌ Unit-Tests für Kernfunktionen
   - ❌ Integrationstests
   - ❌ End-to-End-Tests

## Legende
✅ - Abgeschlossen
⚠️ - Teilweise abgeschlossen
❌ - Noch nicht begonnen/abgeschlossen
