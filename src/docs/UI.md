# UI Style Guide

## Layout

Das grundlegende UI-Layout ist in der folgenden Skizze definiert:

![UI Layout](../assets/images/ui-layout.png)

### Grundstruktur

#### 1. Header/Titlebar
- Zentrierte Überschrift "Wähle deinen Begleiter"
- Klares, minimalistisches Design
- Dient als erste Orientierung

#### 2. Hauptbereich (2-Spalten-Layout)

##### Linke Spalte: Charakterbereich
- Charakterbild mit Animation
- Name und persönliche Tagline
- Charaktereigenschaften als Bullet Points
- Interaktiver Auswahl-Button

##### Rechte Spalte: Dialogzone
- Atmosphärischer Thron-Hintergrund
- Dunkler, edler Raumkontext
- Platz für:
  - Video/Avatar-Overlay
  - Lippenanimation
  - Dialog-Historie

#### 3. Footer: Interaktionsbereich
- Mikrofon-Icon für Sprachaufnahme
- Textfeld für manuelle Eingabe
- Send-Button für Aktionsauslösung

### Responsive Verhalten
- Hauptbereich stapelt auf mobilen Geräten
- Dialogzone passt sich der Bildschirmgröße an
- Interaktionsbereich bleibt fixiert am unteren Rand


## Design-System

### Farbpalette
```css
:root {
  /* Basis-Farben */
  --color-background: #1A1A1A;
  --color-surface: #2D2D2D;
  --color-text: #FFFFFF;
  
  /* Akzentfarben für verschiedene Charaktere */
  --color-terra: #8B0000;    /* Tiefrot */
  --color-nova: #9B4F96;     /* Violett */
  --color-nyxari: #00CED1;   /* Cyan */
  
  /* UI-Elemente */
  --color-border: #404040;
  --color-input: #333333;
  --color-hover: #4A4A4A;
}
```

### Typografie
```css
/* Primäre Schriftart für UI-Elemente */
font-family: 'Inter', sans-serif;

/* Überschriften und Akzente */
font-family: 'Poppins', sans-serif;

/* Technische Elemente (Logs, Code, etc.) */
font-family: 'Space Mono', monospace;
```

### Komponenten

#### Hintergrund
- Dunkler, animierter Shader-Hintergrund
- Subtile Partikel-Animation
- Nebel-Effekte in sehr geringer Opazität
- Leichte Bewegung zur Schaffung von Atmosphäre

```javascript
// Beispiel Shader-Konfiguration
const backgroundConfig = {
  particleDensity: 0.3,
  fogOpacity: 0.15,
  animationSpeed: 0.5,
  colorGradient: ['#1A1A1A', '#2D2D2D']
};
```

#### Stimmungsanzeige
- Dynamische Farbfläche
- Pulsiert basierend auf Charakter-Emotion
- Subtile Farbübergänge
- Position: Ambient Hintergrundeffekt

```javascript
// Emotions-Mapping
const emotionColors = {
  neutral: { color: '#404040', pulseRate: 1.0 },
  happy: { color: '#FFD700', pulseRate: 1.2 },
  thoughtful: { color: '#9B4F96', pulseRate: 0.8 },
  focused: { color: '#00CED1', pulseRate: 1.5 }
};
```

#### Chat-Interface
- Klares, minimalistisches Design
- Deutliche visuelle Trennung zwischen Benutzer und KI
- Eingebaute Markdown-Unterstützung
- Code-Block-Hervorhebung

##### Eingabefeld
- Klare, subtile Umrandung
- Integrierter Voice-Input-Button
- Visuelles Feedback bei Aufnahme
- Placeholder-Text für Kontext

```css
.input-field {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-input);
  transition: border-color 0.2s ease;
}

.voice-button {
  border-radius: 50%;
  background: var(--color-surface);
  transition: background-color 0.2s ease;
}
```

#### TTS-Feedback
- Subtiler, mitlaufender Text
- Charakter-spezifische Formatierung
- Status-Indikator ("Nova spricht...")
- Sanfte Fade-Animationen

```css
.tts-feedback {
  font-family: 'Space Mono', monospace;
  font-size: 0.9em;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
```

## Animations-Richtlinien

### Übergänge
- Sanfte Ease-In-Out Transitionen
- Dauer: 200-300ms für UI-Elemente
- Dauer: 500-800ms für Ambiente-Effekte

### Partikel-System
```javascript
const particleSystem = {
  baseColor: '#404040',
  size: { min: 1, max: 3 },
  speed: { min: 0.5, max: 1.5 },
  opacity: { min: 0.1, max: 0.3 },
  count: 50
};
```

### Responsive Design
- Fluid Typography (clamp)
- Flexible Layouts
- Mobile-First Ansatz
- Breakpoints für verschiedene Bildschirmgrößen

```css
/* Beispiel für Fluid Typography */
:root {
  --fluid-min-width: 320;
  --fluid-max-width: 1440;
  --fluid-min-size: 14;
  --fluid-max-size: 18;
  --fluid-min-scale: 1.2;
  --fluid-max-scale: 1.333;
}
```

## Barrierefreiheit
- Minimaler Kontrast 4.5:1
- Keyboard Navigation
- Screen Reader Unterstützung
- Fokus-Indikatoren

## Performance
- Lazy Loading für Shader
- Optimierte Asset-Größen
- Reduzierte Partikelanzahl auf mobilen Geräten
- Adaptive Animationen basierend auf Device-Leistung
