import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { keyframes } from '@mui/system';
import { characterColors } from '../../theme/characterColors';

// Animation für das Vergrößern des Bildes
const zoomIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Animation für das Einblenden des Glow-Effekts
const glowFadeIn = keyframes`
  0% {
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    filter: blur(70px);
  }
`;

// Animation für das Einblenden des Textes
const fadeInUp = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animation für das Ausblenden
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

/**
 * Komponente für die Animation nach der Charakterauswahl
 * Zeigt das Charakterbild in Vollbild an und blendet einen Begrüßungssatz ein
 * Die Animation wird mit der TTS-Wiedergabe synchronisiert
 */
const AnimatedCharacterIntro = ({ character, onAnimationComplete, id, backupTimerDuration = 5000 }) => {
  const [animationState, setAnimationState] = useState('entering'); // 'entering', 'greeting', 'exiting'
  
  // Logging für die Animation
  useEffect(() => {
    console.log(`Animation-Status: ${animationState} für Charakter ${character?.name}`);
  }, [animationState, character]);

  // Steuerung der Animation - Einblenden des Begrüßungssatzes
  useEffect(() => {
    if (!character) return;
    
    // Nach 1.2 Sekunden den Begrüßungssatz einblenden - längere Zeit für sanfteren Übergang
    const greetingTimer = setTimeout(() => {
      setAnimationState('greeting');
      console.log(`Begrüßung wird angezeigt für ${character.name}`);
    }, 1200);
    
    // Cleanup
    return () => {
      clearTimeout(greetingTimer);
    };
  }, [character]);
  
  // Funktion zum Starten der Exit-Animation
  const startExitAnimation = () => {
    if (animationState === 'exiting') {
      console.log('Exit-Animation bereits gestartet');
      return;
    }
    
    console.log(`Exit-Animation wird gestartet für ${character?.name}`);
    setAnimationState('exiting');
    
    // Nach 1.5 Sekunden die Animation vollständig beenden - längere Zeit für sanfteren Übergang
    setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
        console.log(`Animation vollständig beendet für ${character?.name}`);
      }
    }, 1500);
  };
  
  // Referenz, um zu verfolgen, ob die Audio-Wiedergabe beendet wurde
  const [audioPlaybackEnded, setAudioPlaybackEnded] = useState(false);
  
  // Backup-Timer: Animation nach konfigurierbarer Zeit beenden, falls sie noch läuft
  useEffect(() => {
    if (animationState === 'greeting' && !audioPlaybackEnded) {
      console.log(`Backup-Timer wird gestartet: ${backupTimerDuration}ms für ${character?.name}`);
      
      const backupTimer = setTimeout(() => {
        console.warn(`Backup-Timer für Animation-Beendigung ausgelöst nach ${backupTimerDuration}ms`);
        console.warn('Mögliche Ursache: Audio-Wiedergabe wurde nicht ordnungsgemäß beendet');
        startExitAnimation();
      }, backupTimerDuration);
      
      return () => {
        console.log('Backup-Timer wird aufgeräumt');
        clearTimeout(backupTimer);
      };
    }
  }, [animationState, character, backupTimerDuration, audioPlaybackEnded]);
  
  // Funktion zum Markieren, dass die Audio-Wiedergabe beendet wurde
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
  
  // Direkter Aufruf von handleIntroAnimationComplete als zusätzliche Sicherheit
  useEffect(() => {
    // Globale Funktion zum Beenden der Animation (kann von außen aufgerufen werden)
    window.endCharacterIntroAnimation = () => {
      console.log('Animation wird extern beendet');
      startExitAnimation();
    };
    
    return () => {
      delete window.endCharacterIntroAnimation;
    };
  }, []);
  
  if (!character) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000', // Komplett schwarzer Hintergrund
        overflow: 'hidden',
        opacity: animationState === 'exiting' ? 0 : 1,
        transition: 'opacity 1.5s ease-out', // Längere und sanftere Transition
      }}
    >
      {/* Nicht-transparenter Hintergrund-Layer mit Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          zIndex: 1,
          opacity: animationState === 'entering' ? 0 : (animationState === 'exiting' ? 0 : 1),
          transition: 'opacity 1.2s ease-in-out', // Verbesserte Transition für Ein- und Ausblenden
        }}
      />
      {/* Charakterbild mit Glow-Effekt */}
      <Box
        sx={{
          width: '100%',
          height: '85vh', // Erhöhung auf 85% der Bildschirmhöhe
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          animation: animationState === 'entering' 
            ? `${zoomIn} 1s ease-out forwards`
            : animationState === 'exiting'
              ? `${fadeOut} 1s ease-out forwards`
              : 'none',
          // Kein Pseudoelement mehr, stattdessen ein separater Container für den Glow-Effekt
        }}
      >
        {/* Glow-Effekt hinter dem Charakter */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%', // Zurück zur zentrierten Größe
            height: '90%', // Zurück zur zentrierten Größe
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2 // Höherer z-index als der Hintergrund-Layer
          }}
        >
          {/* Äußerer Glow */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${characterColors[character.name.toLowerCase()]?.light || '#90caf9'} 0%, rgba(0,0,0,0) 70%)`,
              opacity: animationState === 'entering' ? 0 : (animationState === 'exiting' ? 0 : 0.5),
              filter: 'blur(70px)',
              animation: `${glowFadeIn} 1.5s ease-out forwards`,
              transition: 'opacity 1.2s ease-in-out, filter 1.2s ease-in-out',
            }}
          />
          {/* Innerer Glow */}
          <Box
            sx={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${characterColors[character.name.toLowerCase()]?.main || '#1976d2'} 0%, rgba(0,0,0,0) 60%)`,
              opacity: animationState === 'entering' ? 0 : (animationState === 'exiting' ? 0 : 0.4),
              filter: 'blur(40px)',
              animation: `${glowFadeIn} 2s ease-out forwards`,
              transition: 'opacity 1.2s ease-in-out, filter 1.2s ease-in-out',
            }}
          />
        </Box>
        
        {/* Charakterbild */}
        <img
          src={character.image}
          alt={character.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 5,
            opacity: animationState === 'exiting' ? 0 : 1,
            transition: 'opacity 1.5s ease-out',
            // Logging für Bildgröße
            onLoad: (e) => console.log(`Bild geladen: ${e.target.naturalWidth}x${e.target.naturalHeight}`)
          }}
        />
      </Box>
      
      {/* Begrüßungssatz */}
      <Fade in={animationState === 'greeting'} timeout={1000} style={{ transition: 'opacity 1.5s ease-in-out' }}>
        <Typography
          variant="h2" // Größere Schrift
          sx={{
            color: '#fff',
            textAlign: 'center',
            marginTop: 2, // Reduzierter Abstand
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.05em',
            animation: `${fadeInUp} 1s ease-out forwards`,
            textShadow: `0 0 15px ${characterColors[character.name.toLowerCase()]?.light || 'rgba(144, 202, 249, 0.7)'}`,
            background: `linear-gradient(45deg, ${characterColors[character.name.toLowerCase()]?.light || '#90caf9'} 30%, ${characterColors[character.name.toLowerCase()]?.main || '#64b5f6'} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            padding: '0 2rem',
            position: 'absolute',
            bottom: '2vh', // Positionierung ganz unten am Rand
            width: '100%',
            zIndex: 10, // Höherer z-index als alle anderen Elemente
          }}
        >
          {character.greeting || character.description.split('.')[0]}
        </Typography>
      </Fade>
    </Box>
  );
};

export default AnimatedCharacterIntro;
