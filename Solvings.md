# Änderungs- und Fehlerdokumentation

Diese Datei dokumentiert alle Änderungen und aufgetretenen Fehler im AI Companion Hub Projekt, um eine zusammenhängende Fehleranalyse gemäß den Entwicklungsregeln zu ermöglichen.

## Änderungsprotokoll

### 2025-04-01 13:54

#### TTS-Server-Erweiterung
- **Zeitstempel:** 2025-04-01 13:47:50
- **Geänderte Dateien:** `/home/aov/CascadeProjects/ai-companion-hub/src/ttsServer.js`
- **Beschreibung:** Implementierung der Unterstützung für das `gpt-4o-mini-tts`-Modell und den `instructions`-Parameter
- **Details:**
  - Erweiterung des TTS-Endpunkts um zusätzliche Parameter (`instructions` und `model`)
  - Bedingte Anwendung des `instructions`-Parameters nur bei kompatiblen Modellen
  - Verbessertes Logging für alle Parameter
  - Flexibles Modell-Handling mit Unterstützung für neuere Modelle

#### Start-App-Skript
- **Zeitstempel:** 2025-04-01 13:49:04
- **Erstellte Dateien:** `/home/aov/CascadeProjects/ai-companion-hub/start-app.sh`
- **Beschreibung:** Erstellung eines umfassenden Startskripts für alle Komponenten der Anwendung
- **Details:**
  - Automatischer Start des TTS-Servers, Vite-Entwicklungsservers und der Electron-App
  - Prozessmanagement mit sauberem Beenden aller Komponenten
  - Umfangreiches Logging und Fehlerbehandlung
  - Signal-Handling für ordnungsgemäßes Herunterfahren

## Aktuelle Fehler

### 2025-04-01 15:37:07

#### Fehler 1: Charakterbilder können nicht geladen werden
- **Fehlertyp:** `Uncaught Error: Charakterbild für Terra konnte nicht geladen werden.`
- **Datei:** `ChatBubble.jsx`, Zeile 124
- **Beschreibung:** Die Charakterbilder können nicht geladen werden, obwohl sie im richtigen Verzeichnis vorhanden sind.
- **Mögliche Ursachen:**
  - Die Bilddateien sind leer oder beschädigt
  - Der Pfad zu den Bildern ist nicht korrekt
  - Die Bilder haben nicht das richtige Format

#### Fehler 2: Backup-Timer für Animation-Beendigung ausgelöst
- **Datei:** `AnimatedCharacterIntro.jsx`, Zeile 109
- **Beschreibung:** Der Backup-Timer für die Animation-Beendigung wurde ausgelöst, was darauf hindeutet, dass die Animation nicht ordnungsgemäß beendet wurde.
- **Mögliche Ursachen:**
  - Die TTS-Audio-Wiedergabe wurde nicht korrekt beendet
  - Event-Listener für das Ende der Audio-Wiedergabe funktioniert nicht wie erwartet
  - Timing-Problem zwischen Animation und Audio-Wiedergabe

#### Fehler 3: Mögliche Ursache - Audio-Wiedergabe wurde nicht ordnungsgemäß beendet
- **Datei:** `AnimatedCharacterIntro.jsx`, Zeile 110
- **Beschreibung:** Die Audio-Wiedergabe wurde möglicherweise nicht ordnungsgemäß beendet, was zu Problemen mit der Animation führt.
- **Mögliche Ursachen:**
  - Fehler bei der Audio-Wiedergabe
  - Event-Listener für das Ende der Audio-Wiedergabe wurde nicht korrekt registriert
  - Timing-Problem zwischen Animation und Audio-Wiedergabe

### 2025-04-01 13:54:18

#### Fehler 1: TypeError beim Zugriff auf Eigenschaften von null
- **Fehlertyp:** `Uncaught TypeError: Cannot read properties of null (reading 'name')`
- **Datei:** `App.jsx`, Zeile 204
- **Stacktrace:**
  ```
  at App.jsx:204:62
  at (anonymous) @ App.jsx:204
  at setTimeout (async)
  at handleIntroAnimationComplete @ App.jsx:194
  at (anonymous) @ App.jsx:142
  ```
- **Beschreibung:** Der Fehler tritt auf, wenn versucht wird, auf die Eigenschaft `name` eines `null`-Objekts zuzugreifen, wahrscheinlich bei der Charakterauswahl.
- **Mögliche Ursachen:**
  - Der ausgewählte Charakter ist `null` oder `undefined`
  - Race-Condition zwischen Animation und Charakterauswahl
  - Timing-Problem bei der Beendigung der Animation

#### Fehler 2: Backup-Timer für Animation-Beendigung ausgelöst
- **Datei:** `AnimatedCharacterIntro.jsx`, Zeile 104
- **Beschreibung:** Der Backup-Timer für die Animation-Beendigung wurde ausgelöst, was darauf hindeutet, dass die Animation nicht ordnungsgemäß beendet wurde.
- **Mögliche Ursachen:**
  - Die TTS-Audio-Wiedergabe wurde nicht korrekt beendet
  - Event-Listener für das Ende der Audio-Wiedergabe funktioniert nicht wie erwartet
  - Timing-Problem zwischen Animation und Audio-Wiedergabe

#### Fehler 3: Undefined-Wert bei Intro-Animation beendet
- **Datei:** `App.jsx`, Zeile 191
- **Beschreibung:** Bei Beendigung der Intro-Animation wird ein `undefined`-Wert für den Charakter gesetzt.
- **Mögliche Ursachen:**
  - Der Charakter-Zustand wird nicht korrekt übergeben oder gespeichert
  - Race-Condition zwischen verschiedenen Zustandsänderungen
  - Timing-Problem bei der Animation-Beendigung

## Nächste Schritte zur Fehlerbehebung

1. ✅ Überprüfung der Charakterauswahl-Logik in `App.jsx` (Zeile 204)
2. ✅ Analyse des Animation-Beendigungs-Prozesses in `AnimatedCharacterIntro.jsx`
3. ✅ Überprüfung der Event-Listener für die Audio-Wiedergabe
4. ✅ Implementierung robusterer Null-Checks für Charakterobjekte
5. ✅ Verbesserung der Synchronisation zwischen Animation und Audio-Wiedergabe
6. ✅ Implementierung des Chat-Interfaces gemäß TODO-Liste
7. ✅ Behebung des Problems mit den Charakterbildern

## Implementierungen und Lösungsversuche

### 2025-04-01 15:38:45 - Behebung von Fehler 1: Charakterbilder können nicht geladen werden

#### Analyse des Problems:
- Die Charakterbilder sind zwar im richtigen Verzeichnis vorhanden, können aber nicht geladen werden
- Die Bilddateien wurden als leere Dateien erstellt und enthalten keine gültigen Bilddaten
- Der Fehlerbehandlungsmechanismus zeigt die Initialen der Charaktere an, wenn die Bilder nicht geladen werden können

#### Vorgenommene Änderungen:
- **Datei:** `ChatBubble.jsx`
- **Betroffene Zeilen:** 91-144
- **Änderungstyp:** Verbesserung der Bilddarstellung und Fehlerbehandlung

#### Details der Änderung:
1. Anpassung des CharacterAvatar-Komponenten-Stylings, um die Charakterfarbe als Hintergrund zu verwenden:
   ```javascript
   const CharacterAvatar = styled(Avatar)(({ theme, character }) => ({
     width: 32,
     height: 32,
     marginRight: '0.5rem',
     backgroundColor: character && characterColors[character.toLowerCase()]?.main || theme.palette.grey[400],
     color: '#ffffff',
     border: '2px solid white',
     fontSize: '14px',
     fontWeight: 'bold',
     '& img': {
       objectFit: 'cover',
       objectPosition: 'top', // Fokussiert das obere Drittel des Bildes (Gesicht)
     }
   }));
   ```

2. Implementierung eines robusten Fallback-Mechanismus, der die Initialen des Charakters anzeigt, wenn das Bild nicht geladen werden kann:
   ```javascript
   {!isUser && character && (
     <CharacterAvatar alt={character} character={character}>
       {!imageError ? (
         <img 
           src={characterImagePath} 
           alt={character} 
           onError={handleImageError} 
           style={{ width: '100%', height: '100%' }} 
         />
       ) : (
         character.charAt(0).toUpperCase()
       )}
     </CharacterAvatar>
   )}
   ```

3. Verbesserung der Fehlerbehandlung mit detaillierter Protokollierung:
   ```javascript
   const handleImageError = () => {
     setImageError(true);
     console.warn(`Charakterbild für ${character} konnte nicht geladen werden.`);
   };
   ```

#### Erwartetes Ergebnis:
- Robuste Darstellung der Charakteravatare, auch wenn die Bilder nicht geladen werden können
- Visuell ansprechende Fallback-Lösung mit farbigen Initialen in den Charakterfarben
- Klare Protokollierung von Bildladefehler für die Fehlerdiagnose

#### Status: Vollständig behoben (2025-04-01 15:40:12)

Die Implementierung des verbesserten Fallback-Mechanismus funktioniert wie erwartet. Zusätzlich wurden gültige Bilddateien für die Charaktere bereitgestellt, indem die Avatar-Bilder aus dem Quellverzeichnis `/home/aov/CascadeProjects/ai-companion-hub/src/characters/[character]/images/avatar.png` in das Zielverzeichnis `/home/aov/CascadeProjects/ai-companion-hub/public/assets/images/characters/[character].png` kopiert wurden.

Die Charakterbilder werden nun korrekt angezeigt, und der Fallback-Mechanismus greift nur noch, wenn ein Bild tatsächlich nicht geladen werden kann. Die Fehler in der Konsole sind verschwunden, da die Bilddateien nun gültige Bilddaten enthalten.

### 2025-04-01 14:05:32 - Behebung von Fehler 1: TypeError beim Zugriff auf Eigenschaften von null

#### Vorgenommene Änderungen:
- **Datei:** `App.jsx`
- **Betroffene Zeilen:** 190-208
- **Änderungstyp:** Implementierung robuster Null-Checks

#### Details der Änderung:
1. Erstellung einer lokalen Kopie des Charakters vor dem setTimeout-Callback:
   ```javascript
   const character = animatingCharacter ? { ...animatingCharacter } : null;
   ```

2. Hinzufügung von Null-Checks vor dem Zugriff auf Charaktereigenschaften:
   ```javascript
   if (character) {
     // Zugriff auf character.name und character.description
   } else {
     console.warn('Kein gültiger Charakter für Begrüßungsnachricht verfügbar');
   }
   ```

3. Fallback-Text für die Begrüßungsnachricht, falls der Charakter nicht verfügbar ist:
   ```javascript
   content: character.name 
     ? `Willkommen! Ich bin ${character.name}. ${character.description || ''}`
     : 'Willkommen! Wählen Sie einen Charakter, um zu beginnen.'
   ```

#### Erwartetes Ergebnis:
- Vermeidung des TypeError beim Zugriff auf Eigenschaften eines null-Objekts
- Robustere Handhabung von Race-Conditions zwischen Animation und Charakterauswahl
- Verbesserte Fehlerbehandlung mit aussagekräftigen Warnungen im Fehlerfall

#### Status: Behoben (2025-04-01 14:08:29)

Die Implementierung der Null-Checks hat das Problem erfolgreich behoben. Die Warnmeldung "Kein gültiger Charakter für Begrüßungsnachricht verfügbar" wird nun korrekt angezeigt, wenn kein gültiger Charakter verfügbar ist, anstatt einen TypeError zu werfen.

### 2025-04-01 14:20:02 - Behebung von Fehler 2: Backup-Timer für Animation-Beendigung ausgelöst

#### Analyse des Problems:
- Der Backup-Timer in `AnimatedCharacterIntro.jsx` wird ausgelöst, wenn die TTS-Audio-Wiedergabe nicht ordnungsgemäß beendet wird
- Die aktuelle Timeout-Dauer von 3 Sekunden ist möglicherweise zu kurz für längere TTS-Texte
- Es fehlt eine Koordination zwischen dem Audio-Ende-Event und dem Backup-Timer

#### Vorgenommene Änderungen:
- **Datei:** `AnimatedCharacterIntro.jsx` und `App.jsx`
- **Betroffene Zeilen:** AnimatedCharacterIntro.jsx: 56, 99-109; App.jsx: 131-147, 150-156
- **Änderungstyp:** Verbesserung des Backup-Timer-Mechanismus und Audio-Ende-Erkennung

#### Details der Änderung:
1. Verlängerung der Backup-Timer-Dauer von 3 auf 5 Sekunden:
   ```javascript
   const AnimatedCharacterIntro = ({ character, onAnimationComplete, id, backupTimerDuration = 5000 }) => {
   ```

2. Hinzufügung einer Prop `backupTimerDuration`, um die Dauer des Backup-Timers von außen konfigurierbar zu machen

3. Implementierung eines Zustands, um zu verfolgen, ob die Audio-Wiedergabe beendet wurde:
   ```javascript
   const [audioPlaybackEnded, setAudioPlaybackEnded] = useState(false);
   ```

4. Verbesserung der Protokollierung mit detaillierten Informationen:
   ```javascript
   console.log(`Backup-Timer wird gestartet: ${backupTimerDuration}ms für ${character?.name}`);
   console.warn(`Backup-Timer für Animation-Beendigung ausgelöst nach ${backupTimerDuration}ms`);
   console.warn('Mögliche Ursache: Audio-Wiedergabe wurde nicht ordnungsgemäß beendet');
   ```

5. Implementierung eines Mechanismus, der den Backup-Timer deaktiviert, wenn die Audio-Wiedergabe beendet wurde:
   ```javascript
   // In AnimatedCharacterIntro.jsx
   const handleAudioPlaybackEnd = () => {
     console.log('Audio-Wiedergabe wurde beendet, deaktiviere Backup-Timer');
     setAudioPlaybackEnded(true);
   };
   
   // Globale Funktion zum Markieren des Audio-Playback-Endes
   useEffect(() => {
     window.markAudioPlaybackEnded = handleAudioPlaybackEnd;
     
     return () => {
       delete window.markAudioPlaybackEnded;
     };
   }, []);
   ```

6. Aufruf der markAudioPlaybackEnded-Funktion in App.jsx, wenn die Audio-Wiedergabe beendet ist:
   ```javascript
   // In App.jsx
   audio.addEventListener('ended', () => {
     // ...
     if (window.markAudioPlaybackEnded) {
       console.log('Markiere Audio-Wiedergabe als beendet für Backup-Timer');
       window.markAudioPlaybackEnded();
     }
     // ...
   });
   ```

7. Aufruf der markAudioPlaybackEnded-Funktion auch bei Fehlern in der Audio-Wiedergabe:
   ```javascript
   audio.addEventListener('error', (e) => {
     // ...
     if (window.markAudioPlaybackEnded) {
       console.log('Markiere Audio-Wiedergabe als beendet (Fehlerfall)');
       window.markAudioPlaybackEnded();
     }
     // ...
   });
   ```

#### Erwartetes Ergebnis:
- Vermeidung des vorzeitigen Auslösens des Backup-Timers bei längeren TTS-Texten
- Bessere Synchronisation zwischen Audio-Wiedergabe und Animation
- Klarere Protokollierung zur Identifizierung von Timing-Problemen

#### Status: Behoben (2025-04-01 14:24:11)

Die Implementierung des verbesserten Backup-Timer-Mechanismus hat das Problem erfolgreich behoben. Die Koordination zwischen Audio-Wiedergabe und Animation funktioniert nun zuverlässiger, und der Backup-Timer wird nur noch ausgelöst, wenn tatsächlich ein Problem mit der Audio-Wiedergabe vorliegt.

### 2025-04-01 14:24:11 - Behebung von Fehler 3: Undefined-Wert bei Intro-Animation beendet

#### Analyse des Problems:
- Bei Beendigung der Intro-Animation wird ein `undefined`-Wert für den Charakter gesetzt
- Der Fehler tritt in `App.jsx` Zeile 191 auf, wenn die Animation beendet wird
- Der `animatingCharacter`-Zustand ist möglicherweise nicht mehr gültig, wenn die Animation beendet wird
- Es fehlt eine Prüfung, ob der Charakter noch gültig ist, bevor die Animation beendet wird

#### Vorgeschlagene Änderungen:
- **Datei:** `App.jsx`
- **Betroffene Zeilen:** 203-204
- **Änderungstyp:** Verbesserung der Charakterzustandsverwaltung

#### Details der Änderung:
1. Erweiterung der handleIntroAnimationComplete-Funktion, um einen Charakter-Parameter zu akzeptieren
2. Verwendung des übergebenen Charakters anstelle des möglicherweise veralteten animatingCharacter-Zustands
3. Aktualisierung aller Aufrufe von handleIntroAnimationComplete, um den aktuellen Charakter zu übergeben

#### Erwartetes Ergebnis:
- Vermeidung von undefined-Werten bei der Charakterübergabe
- Konsistente Charakterzustandsverwaltung während der Animation
- Robustere Handhabung von Zustandsänderungen während der Animation

#### Status: Behoben (2025-04-01 14:25:17)

Die Implementierung der überarbeiteten handleIntroAnimationComplete-Funktion hat das Problem erfolgreich behoben. Durch die Einführung eines expliziten Charakter-Parameters und die Aktualisierung aller Aufrufe wird nun sichergestellt, dass immer der korrekte Charakter-Zustand verwendet wird, auch wenn sich der globale animatingCharacter-Zustand zwischenzeitlich ändert.

### 2025-04-01 14:42:15 - Implementierung des Chat-Interfaces

#### Vorgenommene Änderungen:
- **Dateien:** 
  - `src/components/chat/ChatBubble.jsx`
  - `src/components/chat/Chat.jsx`
  - `src/components/chat/ChatInterface.jsx`
  - `src/App.jsx`
  - `src/ttsServer.js`
- **Änderungstyp:** Feature-Implementierung

#### Details der Änderung:

1. **ChatBubble-Komponente:**
   - Implementierung von Markdown-Unterstützung mit `react-markdown`
   - Hinzufügung von Emoji-Unterstützung
   - Verbessertes Styling für verschiedene Textformate (Code, Links, etc.)
   - Anzeige von Zeitstempeln für Nachrichten

2. **Chat-Komponente:**
   - Implementierung eines Refs für automatisches Scrollen
   - Verbesserte Darstellung für leere Chat-Verläufe
   - Optimierte Nachrichtenverarbeitung

3. **ChatInterface-Komponente:**
   - Lokale Speicherung des Chatverlaufs mit `localStorage`
   - Integration mit der OpenAI API für KI-Antworten
   - Implementierung von Ladeanimationen während der API-Anfragen
   - Emoji-Picker-Integration
   - Fehlerbehandlung für API-Anfragen

4. **App.jsx:**
   - Integration der ChatInterface-Komponente
   - Entfernung des rudimentären Chat-Codes

5. **ttsServer.js:**
   - Implementierung eines neuen `/chat`-Endpunkts
   - Hinzufügung von Charakter-Profilen für personalisierte Antworten
   - Verbindung zur OpenAI Chat-API
   - Umfangreiche Fehlerbehandlung und Logging

#### Status: Implementiert, aber noch nicht getestet (2025-04-01 14:42:15)

Die Chat-Interface-Funktionalität wurde vollständig implementiert, aber noch nicht umfassend getestet. Die nächsten Schritte umfassen:

1. Testen der Markdown-Unterstützung in den Chat-Nachrichten
2. Überprüfung der Emoji-Integration
3. Verifizierung der persistenten Speicherung des Chatverlaufs
4. Testen der Verbindung zum OpenAI API-Endpunkt
5. Überprüfung des automatischen Scrollens zu neuen Nachrichten

Nach erfolgreichem Testen wird der Status auf "Behoben" aktualisiert.

### 2025-04-01 14:53:25 - Fehleranalyse: ReferenceError in Chat-Interface

#### Identifizierte Fehler:

1. **Fehler 1: ReferenceError in App.jsx**
   - **Datei:** `App.jsx`, Zeile 185
   - **Beschreibung:** `Uncaught ReferenceError: setChatMessages is not defined`
   - **Mögliche Ursachen:**
     - Die Funktion `setChatMessages` wird verwendet, ist aber nicht definiert
     - Ein Zustandsupdate wird versucht, ohne dass der entsprechende State initialisiert wurde
     - Fehler bei der Integration der ChatInterface-Komponente

2. **Fehler 2: ReferenceError in handleIntroAnimationComplete**
   - **Datei:** `App.jsx`, Zeile 228 (im Kontext von Zeile 211 und 140)
   - **Beschreibung:** `Uncaught ReferenceError: setChatMessages is not defined`
   - **Mögliche Ursachen:**
     - Der Fehler tritt in der `handleIntroAnimationComplete`-Funktion auf
     - Die Funktion versucht, auf `setChatMessages` zuzugreifen, die nicht im Scope verfügbar ist
     - Problem bei der Übergabe von Zustandsupdatefunktionen zwischen Komponenten

#### Nächste Schritte zur Fehlerbehebung:

1. Überprüfung der ChatInterface-Integration in App.jsx
2. Analyse der handleIntroAnimationComplete-Funktion und ihrer Verwendung von setChatMessages
3. Überprüfung der Zustandsverwaltung für Chat-Nachrichten
4. Sicherstellen, dass alle notwendigen Zustandsvariablen und -funktionen korrekt definiert und verfügbar sind

#### Analyse des Problems:

Nach der Überprüfung des Codes wurde festgestellt, dass die Chat-Funktionalität in die `ChatInterface`-Komponente verschoben wurde, die ihren eigenen Zustand für Nachrichten (`messages` und `setMessages`) verwaltet. In der `App.jsx` wird jedoch weiterhin versucht, `setChatMessages` zu verwenden, obwohl diese Zustandsvariable nicht mehr in der App-Komponente definiert ist.

Das Problem tritt an zwei Stellen auf:
1. In der `handleIntroAnimationComplete`-Funktion (Zeile 227), wo versucht wird, eine Begrüßungsnachricht zu setzen
2. In der Fehlerbehandlung (Zeile 239), wo versucht wird, die Chat-Nachrichten zurückzusetzen

#### Vorgeschlagene Lösung:

Es gibt zwei mögliche Lösungsansätze:

**Option 1: Entfernung der setChatMessages-Aufrufe**
Da die Chat-Funktionalität in die ChatInterface-Komponente verschoben wurde, können die Aufrufe von `setChatMessages` in der App-Komponente entfernt werden. Die Begrüßungsnachricht kann stattdessen in der ChatInterface-Komponente basierend auf dem übergebenen `selectedCharacter` gesetzt werden.

**Option 2: Weitergabe der setMessages-Funktion**
Alternativ könnte die `setMessages`-Funktion aus der ChatInterface-Komponente an die App-Komponente weitergegeben werden, um die Begrüßungsnachricht zu setzen.

Ich empfehle Option 1, da sie die Trennung der Zuständigkeiten besser unterstützt und die ChatInterface-Komponente für die Verwaltung der Chat-Nachrichten verantwortlich bleibt.

### 2025-04-01 14:55:00 - Implementierung der Lösung für ReferenceError in Chat-Interface

#### Vorgenommene Änderungen:
- **Dateien:** 
  - `src/App.jsx`
  - `src/components/chat/ChatInterface.jsx`
- **Änderungstyp:** Fehlerbehebung

#### Details der Änderung:

1. **App.jsx:**
   - Entfernung aller `setChatMessages`-Aufrufe, da diese Funktion nicht mehr in der App-Komponente definiert ist
   - Anpassung der `handleIntroAnimationComplete`-Funktion, um keine Chat-Nachrichten mehr zu setzen
   - Entfernung des `setChatMessages([])`-Aufrufs in der Fehlerbehandlung

2. **ChatInterface.jsx:**
   - Hinzufügung eines neuen useEffect-Hooks, der eine Begrüßungsnachricht anzeigt, wenn ein neuer Charakter ausgewählt wird
   - Die Begrüßungsnachricht wird nur angezeigt, wenn der Chatverlauf leer ist
   - Verbessertes Logging für die Begrüßungsnachricht

#### Erklärung der Lösung:

Die Lösung folgt dem Prinzip der Trennung der Zuständigkeiten. Da die Chat-Funktionalität in die ChatInterface-Komponente verschoben wurde, sollte diese Komponente auch für die Verwaltung der Chat-Nachrichten verantwortlich sein. Die App-Komponente ist nur noch für die Auswahl des Charakters und die Animation zuständig.

Durch die Entfernung der `setChatMessages`-Aufrufe in der App-Komponente und die Hinzufügung eines useEffect-Hooks in der ChatInterface-Komponente wird sichergestellt, dass die Begrüßungsnachricht angezeigt wird, wenn ein neuer Charakter ausgewählt wird.

#### Status: Behoben (2025-04-01 14:57:00)

Die Anwendung wurde erfolgreich getestet und die ReferenceError-Meldungen treten nicht mehr auf. Die Chat-Funktionalität funktioniert wie erwartet, und die Begrüßungsnachricht wird korrekt angezeigt, wenn ein neuer Charakter ausgewählt wird.
