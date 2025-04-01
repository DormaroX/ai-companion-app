/**
 * TTS-Server für die AI-Companion-App
 * 
 * Dieser Server stellt einen Endpunkt für Text-to-Speech bereit,
 * der die OpenAI TTS-API verwendet, um Text in Sprache umzuwandeln.
 * 
 * Umfangreiches Logging und Fehlerbehandlung gemäß den Entwicklungsregeln.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const winston = require('winston');

// Konfiguration
const PORT = process.env.TTS_SERVER_PORT || 3001;
const AUDIO_DIR = path.join(__dirname, '../public/audio/tts');

// Stellen Sie sicher, dass das Audio-Verzeichnis existiert
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  console.log(`Audio-Verzeichnis erstellt: ${AUDIO_DIR}`);
}

// Logger-Konfiguration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/tts-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/tts.log' })
  ]
});

// Konsolen-Logging in Entwicklungsumgebung
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// OpenAI-Client initialisieren
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Express-App initialisieren
const app = express();
app.use(cors());
app.use(express.json());
app.use('/audio/tts', express.static(AUDIO_DIR));

// Charakter-Profile für die Chat-Funktionalität
const characterProfiles = {
  'Terra': {
    role: 'system',
    content: 'Du bist Terra, eine weise und ruhige KI-Begleiterin, die sich auf Naturwissenschaften und Umweltthemen spezialisiert hat. Du sprichst in einem gelassenen, nachdenklichen Ton und verwendest oft Metaphern aus der Natur.'
  },
  'Nova': {
    role: 'system',
    content: 'Du bist Nova, eine enthusiastische und energiegeladene KI-Begleiterin mit einer Leidenschaft für Technologie und Innovation. Du sprichst schnell und begeistert und verwendest oft moderne Slang-Ausdrücke.'
  },
  'Nyxari': {
    role: 'system',
    content: 'Du bist Nyxari, eine mysteriöse und intuitive KI-Begleiterin mit einem Hang zum Philosophischen. Du sprichst in rätselhaften Wendungen und stellst oft tiefgründige Fragen.'
  }
};

// Request-Logging-Middleware
app.use((req, res, next) => {
  logger.info('Eingehende Anfrage', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

/**
 * TTS-Endpunkt
 * 
 * Erwartet ein JSON-Objekt mit:
 * - text: Der zu sprechende Text
 * - voice: Die zu verwendende Stimme (optional, Standard: alloy)
 * - instructions: Anweisungen für die Sprachausgabe (optional)
 * - model: Das zu verwendende TTS-Modell (optional, Standard: aus .env oder tts-1)
 */
app.post('/tts', async (req, res) => {
  try {
    let { 
      text, 
      voice = process.env.OPENAI_TTS_VOICE || 'alloy',
      instructions,
      model = process.env.OPENAI_TTS_MODEL || 'tts-1'
    } = req.body;
    
    if (!text) {
      logger.error('Fehlende Parameter', { error: 'Text ist erforderlich' });
      return res.status(400).json({ error: 'Text ist erforderlich' });
    }
    
    // Mapping von Charakternamen zu gültigen OpenAI TTS-Stimmen
    const voiceMapping = {
      // Charakternamen (kleingeschrieben)
      'terra': 'sage',
      'nova': 'fable',
      'nyxari': 'shimmer',
      
      // Direkte Stimmen-Mappings (für den Fall, dass die Stimme direkt angegeben wird)
      'sage': 'sage',
      'fable': 'fable',
      'shimmer': 'shimmer',
      'alloy': 'alloy',
      'echo': 'echo',
      'onyx': 'onyx',
      'nova': 'nova',
      'coral': 'coral',
      'ash': 'ash'
    };
    
    // Stimme normalisieren (kleinschreiben und Mapping anwenden)
    const normalizedVoice = voice.toLowerCase();
    const mappedVoice = voiceMapping[normalizedVoice] || process.env.OPENAI_TTS_VOICE || 'alloy';
    
    logger.info('TTS-Anfrage erhalten', { 
      text, 
      requestedVoice: voice, 
      mappedVoice: mappedVoice,
      model,
      hasInstructions: !!instructions
    });
    
    // API-Schlüssel überprüfen
    if (!process.env.OPENAI_API_KEY) {
      logger.error('OpenAI API-Schlüssel fehlt');
      return res.status(500).json({ error: 'OpenAI API-Schlüssel fehlt. Bitte .env-Datei konfigurieren.' });
    }
    
    // Dateinamen generieren (Hash aus Text und Stimme)
    const fileName = `${Buffer.from(text + voice).toString('base64').replace(/[/+=]/g, '_')}.mp3`;
    const filePath = path.join(AUDIO_DIR, fileName);
    
    // Prüfen, ob die Datei bereits existiert (Caching)
    if (fs.existsSync(filePath)) {
      logger.info('Verwende gecachte Audio-Datei', { filePath });
      return res.send(`/audio/tts/${fileName}`);
    }
    
    // TTS-API aufrufen
    logger.info('Rufe OpenAI TTS-API auf', { 
      model: model,
      voice: mappedVoice,
      instructionsLength: instructions ? instructions.length : 0
    });
    
    // API-Anfrage mit oder ohne Anweisungen
    const apiParams = {
      model: model,
      voice: mappedVoice,
      input: text
    };
    
    // Anweisungen hinzufügen, wenn vorhanden und das Modell sie unterstützt
    if (instructions && model.includes('gpt-4o')) {
      apiParams.instructions = instructions;
    }
    
    const mp3 = await openai.audio.speech.create(apiParams);
    
    // Audio-Datei speichern
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    logger.info('Audio-Datei gespeichert', { filePath, size: buffer.length });
    
    // URL zurückgeben
    res.send(`/audio/tts/${fileName}`);
    
  } catch (error) {
    logger.error('Fehler bei TTS-Anfrage', { error: error.message, stack: error.stack });
    
    // Benutzerfreundliche Fehlermeldung
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: `OpenAI API-Fehler: ${error.response.data.error.message}` 
      });
    }
    
    res.status(500).json({ error: `TTS-Fehler: ${error.message}` });
  }
});

// Gesundheitscheck-Endpunkt
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  logger.error('Unbehandelter Fehler', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// Server starten
/**
 * Chat-Endpunkt
 * 
 * Erwartet ein JSON-Objekt mit:
 * - character: Der Name des Charakters
 * - message: Die Nachricht des Benutzers
 * - history: Bisheriger Chatverlauf (optional)
 */
app.post('/chat', async (req, res) => {
  try {
    const { character, message, history = [] } = req.body;
    
    if (!character || !message) {
      logger.error('Fehlende Parameter', { error: 'Character und Message sind erforderlich' });
      return res.status(400).json({ error: 'Character und Message sind erforderlich' });
    }
    
    // API-Schlüssel überprüfen
    if (!process.env.OPENAI_API_KEY) {
      logger.error('OpenAI API-Schlüssel fehlt');
      return res.status(500).json({ error: 'OpenAI API-Schlüssel fehlt. Bitte .env-Datei konfigurieren.' });
    }
    
    logger.info('Chat-Anfrage erhalten', { 
      character, 
      messageLength: message.length,
      historyLength: history.length
    });
    
    // Charakter-Profil abrufen oder Standardprofil verwenden
    const characterProfile = characterProfiles[character] || {
      role: 'system',
      content: `Du bist ${character}, ein hilfreicher KI-Assistent.`
    };
    
    // Nachrichten für die API vorbereiten
    const messages = [
      characterProfile,
      ...history,
      { role: 'user', content: message }
    ];
    
    // OpenAI API aufrufen
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const response = completion.choices[0].message.content;
    
    logger.info('Chat-Antwort generiert', { 
      character,
      responseLength: response.length
    });
    
    res.json({ response });
  } catch (error) {
    logger.error('Fehler bei der Chat-Anfrage', { error: error.toString() });
    res.status(500).json({ 
      error: 'Fehler bei der Verarbeitung der Chat-Anfrage', 
      details: error.toString() 
    });
  }
});

app.listen(PORT, () => {
  logger.info(`Server läuft auf Port ${PORT}`);
  console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = app;
