/**
 * Starter-Skript für den TTS-Server
 * 
 * Dieses Skript startet den TTS-Server und stellt sicher, dass
 * alle notwendigen Umgebungsvariablen geladen werden.
 */

require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

// Pfad zum TTS-Server
const ttsServerPath = path.join(__dirname, 'src', 'ttsServer.js');

// Starten des TTS-Servers als separater Prozess
console.log('Starte TTS-Server...');
const ttsServer = spawn('node', [ttsServerPath], {
  stdio: 'inherit',
  env: process.env
});

// Event-Handler für den TTS-Server
ttsServer.on('close', (code) => {
  console.log(`TTS-Server beendet mit Code ${code}`);
});

// Prozess-Event-Handler für sauberes Beenden
process.on('SIGINT', () => {
  console.log('Beende TTS-Server...');
  ttsServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Beende TTS-Server...');
  ttsServer.kill('SIGTERM');
  process.exit(0);
});

console.log('TTS-Server-Starter läuft. Drücken Sie Ctrl+C zum Beenden.');
