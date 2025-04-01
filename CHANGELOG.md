# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [0.3.3] - 2025-04-01

### Hinzugefügt
- Chat-Interface-Verbesserungen implementiert:
  - Charakterbild in farbigem Kreis vor dem Chat-Text eingefügt
  - Fallback auf farbige Initialen, wenn Bild nicht geladen werden kann
  - Erweiterte Emoji-Auswahl mit mehreren Optionen in einem Popover-Menü

### Verbessert
- Reduzierte Abstände oberhalb und unterhalb des Chat-Textes für kompaktere Darstellung
- Chat-Bubble für Benutzer mit glitzerndem Anthrazit-Effekt
- Anpassung der Bubble-Länge basierend auf der Textlänge

## [0.3.2] - 2025-04-01

### Behoben
- ReferenceError in App.jsx behoben: Entfernung aller `setChatMessages`-Aufrufe
- Verbesserte Trennung der Zuständigkeiten zwischen App und ChatInterface
- Optimierte Implementierung der Begrüßungsnachricht im ChatInterface

## [0.3.1] - 2025-03-31

### Behoben
- Kritischer Bugfix: TTS-Animation-Synchronisierung wurde grundlegend überarbeitet
- Robustere Beendigung der Charakter-Intro-Animation nach Abschluss der TTS-Wiedergabe
- Implementierung mehrerer Fallback-Mechanismen für Animation-Beendigung
- Direkter Aufruf von handleIntroAnimationComplete als zusätzliche Sicherheit
- Erweitertes Logging für bessere Fehlerdiagnose
- Backup-Timer, der nach 3 Sekunden die Animation erzwingt, falls sie noch läuft

## [0.3.0] - 2025-03-31

### Hinzugefügt
- Vollbild-Animation nach Charakterauswahl
- Zentrierter Glow/Halo-Effekt in den Charakterfarben direkt hinter dem Charakter
- Nicht-transparenter schwarzer Hintergrund-Layer für vollständige Abdunkelung
- Spezielle Glow-Fade-In Animation für den Halo-Effekt

### Verbessert
- Fließende Übergänge mit sanften Fade-Ins und Fade-Outs
- Angepasste Timing-Parameter für optimale Übergänge (1.2s für Einblenden, 6.2s für Ausblenden)
- Verbesserte Ausblend-Animation mit längeren Transition-Zeiten (1.5s)
- Verzögertes Umschalten nach Animation-Ende für sanfteren Übergang (500ms)
- Z-Index-Management für korrekte Schichtung aller Elemente
- Koordinierte Transitions zwischen allen Elementen für harmonische Übergänge

### Technische Details
- Komponente: AnimatedCharacterIntro.jsx
- Animationsphasen: entering, greeting, exiting
- Charakterfarben aus characterColors.js für konsistentes Branding
- Umfangreiches Logging für Animation-Status und Fehler

## [0.2.0] - 2025-03-30

### Hinzugefügt
- Charakterauswahl-Carousel mit horizontalem Scrolling
- Glassmorphism-Effekt für UI-Komponenten
- Charakterprofile mit Bildern und Beschreibungen
- Chat-Interface für Interaktion mit den Charakteren

### Verbessert
- Responsive Design für verschiedene Bildschirmgrößen
- Hintergrundbild-Integration mit korrektem z-index Layer
- UI-Komponenten mit besserer visueller Hierarchie

## [0.1.0] - 2025-03-28

### Hinzugefügt
- Initiale Projektstruktur
- Grundlegende UI-Komponenten
- Hintergrundmusik-Integration
- Basis-Funktionalität für Charakterauswahl
