import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, CircularProgress, Tooltip, Popover, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Chat from './Chat';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
  }
}));

const ChatInterface = ({ selectedCharacter }) => {
  // Verwende localStorage, um Nachrichten zu speichern
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`chat_${selectedCharacter?.id}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Emoji-Picker-Zustände
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const openEmojiPicker = Boolean(emojiAnchorEl);
  
  // Häufig verwendete Emojis
  const popularEmojis = [
    { id: 'smile', emoji: '😊' },
    { id: 'heart', emoji: '❤️' },
    { id: 'thumbsup', emoji: '👍' },
    { id: 'laugh', emoji: '😂' },
    { id: 'thinking', emoji: '🤔' },
    { id: 'wink', emoji: '😉' },
    { id: 'cool', emoji: '😎' },
    { id: 'party', emoji: '🎉' },
    { id: 'fire', emoji: '🔥' },
    { id: 'clap', emoji: '👏' },
    { id: 'star', emoji: '⭐' },
    { id: 'ok', emoji: '👌' },
  ];
  
  // Scrolle automatisch zum neuesten Nachricht
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Speichere Nachrichten im localStorage
  useEffect(() => {
    if (selectedCharacter?.id && messages.length > 0) {
      localStorage.setItem(`chat_${selectedCharacter.id}`, JSON.stringify(messages));
    }
  }, [messages, selectedCharacter]);
  
  // Zeige Begrüßungsnachricht an, wenn ein neuer Charakter ausgewählt wird
  useEffect(() => {
    if (selectedCharacter && messages.length === 0) {
      const welcomeMessage = {
        content: `Willkommen! Ich bin ${selectedCharacter.name}. ${selectedCharacter.description || ''}`,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      console.log('Begrüßungsnachricht für neuen Charakter hinzugefügt:', selectedCharacter.name);
    }
  }, [selectedCharacter]);

  // Funktion zum Löschen des Chatverlaufs
  const clearChatHistory = () => {
    if (selectedCharacter?.id) {
      localStorage.removeItem(`chat_${selectedCharacter.id}`);
      setMessages([]);
    }
  };

  // Funktion zum Generieren einer KI-Antwort
  const generateAIResponse = async (userInput) => {
    if (!selectedCharacter) return;
    
    setIsLoading(true);
    
    try {
      // API-Anfrage an den OpenAI-Endpunkt
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: selectedCharacter.name,
          message: userInput,
          history: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error(`Fehler bei der API-Anfrage: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Füge KI-Antwort hinzu
      const aiMessage = {
        content: data.response,
        isUser: false,
        character: selectedCharacter.name,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Fehler bei der KI-Antwortgenerierung:', error);
      
      // Fallback-Antwort bei Fehler
      const errorMessage = {
        content: `Entschuldigung, ich konnte keine Antwort generieren. Bitte versuche es später noch einmal.`,
        isUser: false,
        character: selectedCharacter.name,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    // Füge User-Nachricht hinzu
    const userMessage = {
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputMessage.trim();
    setInputMessage('');

    // Generiere KI-Antwort
    generateAIResponse(userInput);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <Chat 
        ref={chatContainerRef}
        messages={messages}
        character={selectedCharacter?.name}
      />
      <InputContainer>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Schreibe eine Nachricht..."
          variant="outlined"
          size="small"
          disabled={isLoading}
        />
        <Tooltip title="Emoji einfügen">
          <IconButton 
            color="primary" 
            onClick={(event) => {
              setEmojiAnchorEl(event.currentTarget);
            }}
            disabled={isLoading}
          >
            <EmojiEmotionsIcon />
          </IconButton>
        </Tooltip>
        
        <Popover
          open={openEmojiPicker}
          anchorEl={emojiAnchorEl}
          onClose={() => setEmojiAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Grid container spacing={1}>
              {popularEmojis.map((emojiItem) => (
                <Grid item key={emojiItem.id}>
                  <IconButton
                    onClick={() => {
                      setInputMessage(prev => prev + emojiItem.emoji);
                      setEmojiAnchorEl(null);
                    }}
                    size="small"
                  >
                    <Box component="span" sx={{ fontSize: '1.5rem' }}>
                      {emojiItem.emoji}
                    </Box>
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Popover>
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;
