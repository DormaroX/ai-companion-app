import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, AppBar, Toolbar, Typography, IconButton, Paper,
  Grid, useTheme, Button, Slider, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import CharacterCarousel from './components/carousel/CharacterCarousel';
import AnimatedCharacterIntro from './components/animations/AnimatedCharacterIntro';
import { characterProfiles } from './components/characters/characterProfiles';
import ChatInterface from './components/chat/ChatInterface';

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(5px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: 'none'
}));


function App() {
  const theme = useTheme();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('backgroundMusicVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5; // Default: 50%
  });
  const [isMuted, setIsMuted] = useState(() => {
    const savedMuted = localStorage.getItem('backgroundMusicMuted');
    return savedMuted ? savedMuted === 'true' : false; // Default: nicht stumm
  });
  const [showIntroAnimation, setShowIntroAnimation] = useState(false);
  const [animatingCharacter, setAnimatingCharacter] = useState(null);
  const audioRef = useRef(null);
  const ttsAudioRef = useRef(null);

  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(3px)',
    boxShadow: 'none',
    padding: '1rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.02)'
  };

  // Chat-Funktionalität wurde in die ChatInterface-Komponente verschoben

  // Effekt für die Steuerung der Hintergrundmusik
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      localStorage.setItem('backgroundMusicVolume', volume.toString());
      localStorage.setItem('backgroundMusicMuted', isMuted.toString());
      
      // Umfangreiches Logging für neue Funktionen
      console.log(`Hintergrundmusik-Status: ${isMuted ? 'Stumm' : 'Aktiv'}, Lautstärke: ${Math.round(volume * 100)}%`);
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleCharacterSelect = (character) => {
    if (!character || !character.name) {
      console.error('Ungültiger Charakter-Objekt');
      return;
    }
    
    try {
      console.log(`Charakter wird ausgewählt: ${character.name}`);
      
      // Intro-Animation starten
      setAnimatingCharacter(character);
      setShowIntroAnimation(true);
      console.log('Intro-Animation gestartet für:', character.name);
      
      // Animationsstartzeit speichern für Zeitberechnungen
      const animationStartTime = Date.now();
      window.animationStartTime = animationStartTime;
      console.log('Animation-Startzeit:', new Date(animationStartTime).toISOString());
      
      // Zufälligen Begrüßungssatz auswählen, falls vorhanden
      let welcomeMessage = character.greeting || "Hallo";
      if (character.welcome_messages && character.welcome_messages.length > 0) {
        const randomIndex = Math.floor(Math.random() * character.welcome_messages.length);
        welcomeMessage = character.welcome_messages[randomIndex];
        console.log(`Zufälliger Begrüßungssatz ausgewählt: "${welcomeMessage}"`);
      } else {
        console.log(`Standard-Begrüßungssatz verwendet: "${welcomeMessage}"`);
      }
      
      // TTS-Anfrage senden
      console.log(`TTS-Anfrage wird gesendet für: "${welcomeMessage}"`);
      fetch('http://localhost:3001/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          voice: character.tts_voice || character.name.toLowerCase(), 
          text: welcomeMessage 
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`TTS-Anfrage fehlgeschlagen: ${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then(audioSrc => {
        console.log('TTS-Audio-Quelle erhalten:', audioSrc);
        
        // Audio-Element erstellen und abspielen
        const audio = new Audio(audioSrc);
        ttsAudioRef.current = audio;
        
        // Event-Listener für das Ende der Audio-Wiedergabe
        audio.addEventListener('ended', () => {
          console.log('TTS-Audio-Wiedergabe beendet');
          
          // Markiere Audio-Wiedergabe als beendet, um Backup-Timer zu deaktivieren
          if (window.markAudioPlaybackEnded) {
            console.log('Markiere Audio-Wiedergabe als beendet für Backup-Timer');
            window.markAudioPlaybackEnded();
          } else {
            console.warn('markAudioPlaybackEnded-Funktion nicht verfügbar');
          }
          
          // Minimale Animationsdauer berechnen (4 Sekunden oder Audio-Länge + 1 Sekunde)
          const animationDuration = Date.now() - animationStartTime;
          console.log('Aktuelle Animationsdauer:', animationDuration, 'ms');
          
          // Animation beenden, wenn die Mindestdauer erreicht ist
          if (animationDuration >= 4000) {
            console.log('Minimale Animationsdauer erreicht, Animation wird beendet');
            // Übergebe den aktuellen Charakter explizit
            handleIntroAnimationComplete(character);
          } else {
            const remainingTime = 4000 - animationDuration;
            console.log(`Warte noch ${remainingTime}ms bis zum Ende der Animation`);
            // Übergebe den aktuellen Charakter explizit
            setTimeout(() => handleIntroAnimationComplete(character), remainingTime);
          }
        });
        
        // Fehlerbehandlung für Audio-Wiedergabe
        audio.addEventListener('error', (e) => {
          console.error('Fehler bei der TTS-Audio-Wiedergabe:', e);
          
          // Markiere Audio-Wiedergabe als beendet, um Backup-Timer zu deaktivieren
          if (window.markAudioPlaybackEnded) {
            console.log('Markiere Audio-Wiedergabe als beendet (Fehlerfall)');
            window.markAudioPlaybackEnded();
          }
          
          // Fallback: Animation nach 4 Sekunden beenden
          // Übergebe den aktuellen Charakter explizit
          setTimeout(() => handleIntroAnimationComplete(character), 4000);
        });
        
        // Audio abspielen
        audio.play().then(() => {
          console.log('TTS-Audio-Wiedergabe gestartet');
        }).catch(error => {
          console.error('Fehler beim Starten der TTS-Audio-Wiedergabe:', error);
          // Fallback: Animation nach 4 Sekunden beenden
          // Übergebe den aktuellen Charakter explizit
          setTimeout(() => handleIntroAnimationComplete(character), 4000);
        });
        
        // Backup-Timer: Animation nach 10 Sekunden beenden, falls die Audio-Wiedergabe nicht startet
        setTimeout(() => {
          if (window.animationStartTime === animationStartTime && document.getElementById('character-intro-animation')) {
            console.warn('Backup-Timer ausgelöst: Animation wird nach 10 Sekunden beendet');
            // Übergebe den aktuellen Charakter explizit
            handleIntroAnimationComplete(character);
          }
        }, 10000);
      })
      .catch(error => {
        console.error('Fehler bei der TTS-Anfrage:', error);
        // Fallback: Animation nach 4 Sekunden beenden
        // Übergebe den aktuellen Charakter explizit
        setTimeout(() => handleIntroAnimationComplete(character), 4000);
      });
      
    } catch (error) {
      console.error('Fehler beim Setzen des Charakters:', error);
      // State zurücksetzen bei Fehler
      setSelectedCharacter(null);
      setChatMessages([]);
    }
  };
  
  // Handler für das Ende der Intro-Animation
  // Akzeptiert einen optionalen Charakter-Parameter, um Race-Conditions zu vermeiden
  const handleIntroAnimationComplete = (explicitCharacter = null) => {
    try {
      // Verwende den explizit übergebenen Charakter oder den animatingCharacter-Zustand
      const characterToUse = explicitCharacter || animatingCharacter;
      console.log('Intro-Animation beendet, setze Charakter:', characterToUse?.name);
      
      // Lokale Kopie des Charakters erstellen, um Race-Conditions zu vermeiden
      const character = characterToUse ? { ...characterToUse } : null;
      console.log('Lokale Kopie des Charakters erstellt:', character?.name);
      
      // Verzögerung für einen sanfteren Übergang
      setTimeout(() => {
        // Null-Check vor dem Setzen des Charakters
        if (character) {
          // Charakter setzen
          setSelectedCharacter(character);
          
          // Animation ausblenden
          setShowIntroAnimation(false);
          
          // Keine Chat-Nachrichten mehr hier setzen, da dies in der ChatInterface-Komponente erfolgt
          console.log('Charakter gesetzt, ChatInterface wird die Begrüßungsnachricht anzeigen');
        } else {
          console.warn('Kein gültiger Charakter für Begrüßungsnachricht verfügbar');
          setShowIntroAnimation(false);
        }
      }, 500); // Kurze Verzögerung für sanfteren Übergang
      
    } catch (error) {
      console.error('Fehler nach der Intro-Animation:', error);
      // State zurücksetzen bei Fehler
      setSelectedCharacter(null);
      setShowIntroAnimation(false);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: 'transparent', 
        color: '#fff',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/src/assets/images/background.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: 'none'
        }
      }}
    >
      {/* Audio-Player für Hintergrundmusik */}
      <audio
        ref={audioRef}
        src="/src/assets/audio/background-music.mp3"
        autoPlay
        loop
        style={{ display: 'none' }}
      />
      
      {/* Intro-Animation */}
      {showIntroAnimation && animatingCharacter && (
        <AnimatedCharacterIntro 
          id="character-intro-animation"
          character={animatingCharacter} 
          onAnimationComplete={handleIntroAnimationComplete} 
        />
      )}
      
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {/* Header/Titlebar */}
        <AppBar position="static" sx={headerStyle}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Leerer Platzhalter auf der linken Seite für Balance */}
            <Box sx={{ width: '180px' }} />
            
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.5rem',
                letterSpacing: '0.2em',
                background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              AI COMPANION HUB
            </Typography>
            
            {/* Lautstärkeregler auf der rechten Seite */}
            <Box sx={{ width: '180px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Slider
                size="small"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Lautstärke"
                min={0}
                max={1}
                step={0.01}
                sx={{
                  width: 100,
                  color: '#90caf9',
                  opacity: isMuted ? 0.5 : 0.8,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0px 0px 0px 8px rgba(144, 202, 249, 0.16)'
                    }
                  }
                }}
              />
              <Tooltip title={isMuted ? "Ton einschalten" : "Ton ausschalten"}>
                <IconButton 
                  onClick={handleMuteToggle} 
                  sx={{ color: 'white', opacity: 0.7, ml: 1 }}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth={false} sx={{ height: 'calc(100% - 64px)', pt: 2, pb: 2, px: 3 }}>
          <Grid container spacing={2} sx={{ height: 'calc(100% - 16px)', width: '100%', margin: 0 }}>
            {/* Linke Spalte: Charakter-Info */}
            <Grid item xs={3.6} sx={{ height: '100%', pb: 4 }}>
              {!selectedCharacter ? (
                <CharacterCarousel onCharacterSelect={handleCharacterSelect} />
              ) : (
                <GlassPaper sx={{ p: 0, height: '100%' }}>
                  <Box sx={{ p: 0, height: '100%', position: 'relative' }}>
                    {/* Character Image Section */}
                    <Box sx={{
                      position: 'absolute',
                      top: '3rem',
                      left: theme.spacing(4),
                      right: theme.spacing(4),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '55%'
                    }}>
                      <img
                        src={selectedCharacter.image}
                        alt={selectedCharacter.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          maxHeight: '100%'
                        }}
                      />
                    </Box>

                    {/* Character Name */}
                    <Typography
                      variant="h4"
                      sx={{
                        position: 'absolute',
                        top: 'calc(55% + 4rem)',
                        left: theme.spacing(4),
                        right: theme.spacing(4),
                        color: '#90caf9',
                        textAlign: 'center',
                        fontSize: '2rem',
                        fontWeight: 600
                      }}
                    >
                      {selectedCharacter.name}
                    </Typography>

                    {/* Trigger Words */}
                    <Box sx={{
                      position: 'absolute',
                      top: 'calc(55% + 3.2rem + 2rem + 2rem)',
                      left: theme.spacing(4),
                      right: theme.spacing(4),
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: theme.spacing(1),
                      justifyContent: 'center'
                    }}>
                      {selectedCharacter.trigger_words.map((word, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{ 
                            px: theme.spacing(2),
                            py: theme.spacing(0.5),
                            borderRadius: '15px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {word}
                        </Typography>
                      ))}
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        position: 'absolute',
                        top: 'calc(55% + 3.2rem + 2rem + 2rem + 4rem)',
                        left: theme.spacing(4),
                        right: theme.spacing(4),
                        color: theme.palette.grey[300],
                        textAlign: 'justify',
                        fontSize: '1.2rem',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        maxWidth: '600px',
                        margin: '0 auto'
                      }}
                    >
                      {selectedCharacter.description}
                    </Typography>

                    {/* Back Button */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: theme.spacing(4),
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}>
                      <Button
                        variant="contained"
                        onClick={() => setSelectedCharacter(null)}
                        sx={{
                          width: '200px',
                          backgroundColor: '#d32f2f',
                          color: theme.palette.common.white,
                          borderRadius: '25px',
                          textTransform: 'none',
                          fontSize: '1.1rem',
                          padding: theme.spacing(1, 4),
                          '&:hover': {
                            backgroundColor: '#9a0007'
                          }
                        }}
                      >
                        Zurück zur Auswahl
                      </Button>
                    </Box>
                  </Box>
                </GlassPaper>
              )}
            </Grid>

            {/* Rechte Spalte: Dialogzone */}
            <Grid item xs={8.4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', pb: 4 }}>
              <GlassPaper 
                sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {selectedCharacter ? (
                  <>
                    <ChatInterface selectedCharacter={selectedCharacter} />
                  </>
                ) : (
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" color="text.secondary">
                      Wähle einen Begleiter aus der linken Spalte
                    </Typography>
                  </Box>
                )}
              </GlassPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
