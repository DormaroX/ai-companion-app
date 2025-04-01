# 🧭 UI-Struktur – Charakterauswahl & Dialogbereich (Electron-App)

```
+----------------------------------------------------------------------------------+
|                                  HEADER / TITLEBAR                               |
|                     "Wähle deinen Begleiter" (zentriert oben)   Lautstärkeregler |
+----------------------------------------------------------------------------------+

|                                                                                  |
|  +-----------------------------+   +------------------------------------------+  |
|  |                             |   |                                          |  |
|  |      CHARAKTERBEREICH       |   |               DIALOGZONE                 |  |
|  |                             |   |                                          |  |
|  |  [ CHARAKTERBILD (links) ]  |   |  [ THRON-HINTERGRUND – atmosphärisch ]   |  |
|  |                             |   |                                          |  |
|  |  Name: **Terra**            |   |  (Zentraler Thron, Kerzenlicht, Tiefe)   |  |
|  |  Tagline: *„Bereit. Immer.  |   |                                          |  |
|  |             Für dich.“*     |   |                                          |  |
|  |                             |   |                                          |  |
|  |  Eigenschaften:             |   |                                          |  |
|  |   - Strategisch & energisch |   |                                          |  |
|  |   - Loyal & zuverlässig     |   |                                          |  |
|  |   - Führungsstark & klar    |   |                                          |  |
|  |                             |   |                                          |  |
|  |  [ WÄHLEN Button ▼ ]        |   |                                          |  |
|  +-----------------------------+   +------------------------------------------+  |
|                                                                                  |

+----------------------------------------------------------------------------------+
|                                INPUT & INTERAKTION                               |
|                                                                                  |
|  [ 🎙️  Mic Icon ] [  Textfeld  ]                                    [ Send Btn ] |
|                                                                                  |
+----------------------------------------------------------------------------------+
```

## 🔍 Details & UI-Funktion

### 🔹 Linker Bereich (Charakter-Auswahl)
- **Charakterbild**: Freigestellt, leicht animierbar (Begrüßung / Reaktion).
- **Tagline**: Zitatartige, persönliche Ansprache je nach Charakter.
- **Eigenschaften**: 3 Bullet Points zur Beschreibung des Charakters.
- **Button**: Auswahl-Interaktion → TTS-Ausgabe + Visual Scaling.

### 🔹 Rechter Bereich (Dialog / Visual Center)
- **Hintergrund**: Edler, dunkler Raum mit Thron – immersiv.
- **Thron-Symbolik**: Zentrierung von Macht & Fokus.
- **Zukünftige Ergänzung**:
  - Lippenanimation
  - Dialog-Historie

### 🔹 Unten (Inputbereich)
- **Mikrofon-Icon**: Trigger für Sprachaufnahme (Whisper).
- **Textfeld**: Alternativ nutzbare Tastatureingabe.
- **Send Button**: Manuelle TTS-Auslösung + Konversation.