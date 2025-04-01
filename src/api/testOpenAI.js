/**
 * Test-Skript für die OpenAI API
 * 
 * Dieses Skript testet die Funktionalität der OpenAI API-Integration.
 * Es führt sowohl einen Chat-Completion-Test als auch einen TTS-Test durch.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { 
  generateChatCompletion, 
  generateTTS, 
  generateCharacterResponse 
} = require('./openaiApi');

// Überprüfen, ob der API-Schlüssel gesetzt ist
if (!process.env.OPENAI_API_KEY) {
  console.error('Fehler: OpenAI API-Schlüssel fehlt. Bitte .env-Datei konfigurieren.');
  process.exit(1);
}

// Test-Verzeichnis erstellen
const testDir = path.join(__dirname, '../../test-output');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Chat-Completion testen
async function testChatCompletion() {
  try {
    console.log('Teste Chat-Completion...');
    
    const messages = [
      { role: 'system', content: 'Du bist ein hilfreicher Assistent.' },
      { role: 'user', content: 'Sage mir einen kurzen Witz über Programmierung.' }
    ];
    
    const response = await generateChatCompletion(messages);
    console.log('Chat-Completion erfolgreich:');
    console.log(response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('Fehler beim Testen der Chat-Completion:', error.message);
    return false;
  }
}

// Charakter-Antwort testen
async function testCharacterResponse() {
  try {
    console.log('Teste Charakter-Antwort für Terra...');
    
    const messages = [
      { role: 'user', content: 'Wie würdest du dich kurz beschreiben?' }
    ];
    
    const response = await generateCharacterResponse('terra', messages);
    console.log('Charakter-Antwort erfolgreich:');
    console.log(response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('Fehler beim Testen der Charakter-Antwort:', error.message);
    return false;
  }
}

// TTS testen
async function testTTS() {
  try {
    console.log('Teste TTS...');
    
    const text = 'Dies ist ein Test der Text-to-Speech-Funktionalität.';
    const buffer = await generateTTS(text, 'alloy');
    
    const outputPath = path.join(testDir, 'tts-test.mp3');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`TTS erfolgreich. Audio-Datei gespeichert unter: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Fehler beim Testen der TTS-Funktionalität:', error.message);
    return false;
  }
}

// Alle Tests ausführen
async function runAllTests() {
  console.log('Starte OpenAI API-Tests...');
  
  const chatResult = await testChatCompletion();
  const characterResult = await testCharacterResponse();
  const ttsResult = await testTTS();
  
  console.log('\nTestergebnisse:');
  console.log(`Chat-Completion: ${chatResult ? 'Erfolgreich ✅' : 'Fehlgeschlagen ❌'}`);
  console.log(`Charakter-Antwort: ${characterResult ? 'Erfolgreich ✅' : 'Fehlgeschlagen ❌'}`);
  console.log(`TTS: ${ttsResult ? 'Erfolgreich ✅' : 'Fehlgeschlagen ❌'}`);
  
  if (chatResult && characterResult && ttsResult) {
    console.log('\nAlle Tests erfolgreich! Die OpenAI API-Integration funktioniert korrekt.');
  } else {
    console.log('\nEinige Tests sind fehlgeschlagen. Bitte überprüfen Sie die Fehlermeldungen.');
  }
}

// Tests ausführen
runAllTests().catch(error => {
  console.error('Unerwarteter Fehler bei der Testausführung:', error);
});
