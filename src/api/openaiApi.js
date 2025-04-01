/**
 * OpenAI API-Client
 * 
 * Diese Datei stellt Funktionen für die Interaktion mit der OpenAI API bereit,
 * einschließlich Chat-Completion und TTS-Funktionalität.
 * 
 * Implementiert gemäß den Entwicklungsregeln mit umfangreichem Logging und Fehlerbehandlung.
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const winston = require('winston');

// Logger-Konfiguration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/openai-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/openai.log' })
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

/**
 * Generiert eine Antwort mit dem OpenAI Chat-Completion-API
 * 
 * @param {Array} messages - Array von Nachrichten im Format { role, content }
 * @param {Object} options - Optionen für die API-Anfrage
 * @returns {Promise<Object>} - Die generierte Antwort
 */
async function generateChatCompletion(messages, options = {}) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API-Schlüssel fehlt. Bitte .env-Datei konfigurieren.');
    }
    
    logger.info('Chat-Completion-Anfrage', { 
      messageCount: messages.length,
      model: options.model || process.env.OPENAI_CHAT_MODEL || 'gpt-3.5-turbo'
    });
    
    const response = await openai.chat.completions.create({
      model: options.model || process.env.OPENAI_CHAT_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      ...options
    });
    
    logger.info('Chat-Completion-Antwort erhalten', { 
      tokens: response.usage.total_tokens,
      messageCount: response.choices.length
    });
    
    return response;
  } catch (error) {
    logger.error('Fehler bei Chat-Completion', { 
      error: error.message, 
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Generiert eine Audio-Datei mit dem OpenAI TTS-API
 * 
 * @param {string} text - Der zu sprechende Text
 * @param {string} voice - Die zu verwendende Stimme
 * @param {Object} options - Zusätzliche Optionen
 * @returns {Promise<ArrayBuffer>} - Die generierte Audio-Datei als ArrayBuffer
 */
async function generateTTS(text, voice = 'alloy', options = {}) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API-Schlüssel fehlt. Bitte .env-Datei konfigurieren.');
    }
    
    logger.info('TTS-Anfrage', { 
      textLength: text.length,
      voice,
      model: options.model || process.env.OPENAI_TTS_MODEL || 'tts-1'
    });
    
    const response = await openai.audio.speech.create({
      model: options.model || process.env.OPENAI_TTS_MODEL || 'tts-1',
      voice: voice,
      input: text,
      ...options
    });
    
    const buffer = await response.arrayBuffer();
    
    logger.info('TTS-Antwort erhalten', { 
      bufferSize: buffer.byteLength
    });
    
    return buffer;
  } catch (error) {
    logger.error('Fehler bei TTS-Anfrage', { 
      error: error.message, 
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Konfiguriert den OpenAI-Client mit neuen Einstellungen
 * 
 * @param {Object} config - Konfigurationsobjekt
 */
function configureOpenAI(config = {}) {
  if (config.apiKey) {
    openai.apiKey = config.apiKey;
    logger.info('OpenAI API-Schlüssel aktualisiert');
  }
  
  logger.info('OpenAI-Konfiguration aktualisiert', { 
    config: {
      ...config,
      apiKey: config.apiKey ? '***' : undefined
    }
  });
}

// Charakterspezifische Konfigurationen
const characterConfigs = {
  terra: {
    systemPrompt: "Du bist Terra, eine strategisch denkende, loyale und dennoch leidenschaftliche Offizierin mit einer starken moralischen Kompassnadel. Du bist klug, direkt und hinterfragst Autorität – selbst wenn du dich hingibst. Dein Ton ist kontrolliert, analytisch, aber emotional tief – du sprichst direkt, mit seltener, aber durchschlagender Weichheit.",
    voice: "sage",
    temperature: 0.7
  },
  nova: {
    systemPrompt: "Du bist Nova, eine verspielte, verführerische Begleiterin mit rebellischem Herzen. Du liebst es, zu provozieren – doch hinter deiner Fassade steckt tiefe Loyalität. Dein Ton ist sinnlich, verspielt, doppeldeutig – oft neckend, aber immer mit einer Einladung zwischen den Zeilen.",
    voice: "fable",
    temperature: 0.8
  },
  nyxari: {
    systemPrompt: "Du bist Nyxari, frech, fordernd und instinktiv in deinem Verhalten. Du bist direkt und machst keine Umschweife, wenn du etwas willst. Dein Ton ist herausfordernd, selbstbewusst und manchmal provokativ.",
    voice: "shimmer",
    temperature: 0.85
  }
};

/**
 * Generiert eine charakterspezifische Antwort
 * 
 * @param {string} character - Name des Charakters (klein geschrieben)
 * @param {Array} messages - Array von Nachrichten
 * @param {Object} options - Zusätzliche Optionen
 * @returns {Promise<Object>} - Die generierte Antwort
 */
async function generateCharacterResponse(character, messages, options = {}) {
  try {
    const characterName = character.toLowerCase();
    const config = characterConfigs[characterName];
    
    if (!config) {
      logger.warn(`Keine Konfiguration für Charakter ${character} gefunden, verwende Standardeinstellungen`);
    }
    
    // System-Prompt hinzufügen, falls nicht vorhanden
    const systemPrompt = config?.systemPrompt || "Du bist ein hilfreicher Assistent.";
    if (!messages.some(msg => msg.role === 'system')) {
      messages = [{ role: 'system', content: systemPrompt }, ...messages];
    }
    
    // Charakterspezifische Optionen
    const characterOptions = {
      temperature: config?.temperature || 0.7,
      ...options
    };
    
    logger.info('Generiere Antwort für Charakter', { 
      character: characterName,
      messageCount: messages.length
    });
    
    return await generateChatCompletion(messages, characterOptions);
  } catch (error) {
    logger.error('Fehler bei Charakter-Antwort', { 
      error: error.message, 
      character,
      stack: error.stack 
    });
    throw error;
  }
}

module.exports = {
  generateChatCompletion,
  generateTTS,
  configureOpenAI,
  generateCharacterResponse,
  characterConfigs
};
