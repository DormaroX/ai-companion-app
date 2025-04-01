import React from 'react';
import { styled } from '@mui/material/styles';
import { characterColors } from '../../theme/characterColors';
import ReactMarkdown from 'react-markdown';
import { Box, Typography, Avatar } from '@mui/material';

const BubbleWrapper = styled('div')(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: '0.25rem', // Noch weiter reduzierter Abstand
  marginTop: '0.25rem', // Reduzierter Abstand für alle Bubbles
  '&:first-of-type': {
    marginTop: '0.25rem', // Reduzierter Abstand für die erste Bubble
  },
  width: '100%', // Volle Breite für den Wrapper
  padding: '0 16px' // Seitenabstand hinzufügen
}));

const Bubble = styled('div')(({ theme, isUser, character, contentLength }) => ({
  maxWidth: '70%',
  minWidth: '100px', // Mindestbreite für Bubbles
  width: 'fit-content', // Breite passt sich dem Inhalt an
  padding: '0.1rem 0.5rem', // Stark reduzierter vertikaler Abstand, horizontaler Abstand bleibt ausreichend
  borderRadius: '1rem',
  backgroundColor: isUser 
    ? '#2A2A2A' // Glitzerndes Anthrazit für Benutzer-Bubbles
    : (character && characterColors[character.toLowerCase()]?.main) || theme.palette.grey[100],
  color: isUser || character 
    ? '#ffffff'
    : theme.palette.text.primary,
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  '& a': {
    color: isUser || character ? '#ffffff' : theme.palette.primary.main,
    textDecoration: 'underline',
  },
  '& code': {
    backgroundColor: isUser || character 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)',
    padding: '0.1rem 0.3rem',
    borderRadius: '0.3rem',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: isUser || character 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)',
    padding: '0.3rem',
    borderRadius: '0.3rem',
    overflowX: 'auto',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& img.emoji': {
    height: '1.2em',
    width: '1.2em',
    margin: '0 0.1em',
    verticalAlign: '-0.2em',
  },
}));

// Funktion zum Ersetzen von Emoji-Shortcodes mit Emoji-Bildern
const replaceEmojis = (text) => {
  // Einfache Emoji-Ersetzung mit regulären Ausdrücken
  // In einer vollständigen Implementierung würde man eine Emoji-Bibliothek verwenden
  const emojiRegex = /:([a-z0-9_+-]+):/g;
  return text.replace(emojiRegex, (match, emojiName) => {
    try {
      // Versuche, das Emoji zu finden
      const emoji = require(`emoji-mart/data/emoji-mart.json`).emojis[emojiName];
      if (emoji) {
        return `<img class="emoji" alt="${emojiName}" src="${emoji.src}" />`;
      }
      return match; // Falls nicht gefunden, behalte den Original-Text
    } catch (error) {
      console.warn('Emoji nicht gefunden:', emojiName);
      return match;
    }
  });
};

// Hinzufügen von Glitzereffekt für Anthrazit
const glitterAnimation = {
  '@keyframes glitter': {
    '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)' },
    '50%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)' },
    '100%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)' },
  },
  animation: 'glitter 3s infinite',
};

const CharacterAvatar = styled(Avatar)(({ theme, character }) => ({
  width: 32,
  height: 32,
  marginRight: '0.5rem',
  backgroundColor: 'transparent', // Transparenter Hintergrund
  color: character && characterColors[character.toLowerCase()]?.main || theme.palette.grey[700],
  border: '2px solid white',
  fontSize: '14px',
  fontWeight: 'bold',
  '& img': {
    objectFit: 'cover',
    objectPosition: 'top', // Fokussiert das obere Drittel des Bildes (Gesicht)
  }
}));

const ChatBubble = ({ message, isUser, character }) => {
  // Timestamp-Anzeige, falls vorhanden
  const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : '';
  
  // Behandle den Nachrichteninhalt als String
  const messageContent = typeof message === 'string' ? message : message.content || '';
  
  // Bestimme die Länge des Inhalts für die Breitenanpassung
  const contentLength = messageContent.length;
  
  // Bestimme den Pfad zum Charakterbild
  const characterImagePath = character ? `/assets/images/characters/${character.toLowerCase()}.png` : '';
  
  // Prüfe, ob das Bild existiert
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
    console.warn(`Charakterbild für ${character} konnte nicht geladen werden.`);
  };
  
  return (
    <BubbleWrapper isUser={isUser}>
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: isUser ? 'flex-end' : 'flex-start',
        flex: 1, // Nimmt den verfügbaren Platz ein
      }}>
        <Bubble 
          isUser={isUser} 
          character={character} 
          contentLength={contentLength}
          sx={isUser ? glitterAnimation : {}}
        >
          <ReactMarkdown components={{
            // Entferne zusätzliche Abstände bei Paragraphen
            p: ({node, ...props}) => <p style={{ margin: 0 }} {...props} />
          }}>{messageContent}</ReactMarkdown>
        </Bubble>
        {timestamp && (
          <Typography variant="caption" sx={{ mt: 0.3, opacity: 0.7, fontSize: '0.7rem' }}>
            {timestamp}
          </Typography>
        )}
      </Box>
    </BubbleWrapper>
  );
};

export default ChatBubble;
