import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatBubble from './ChatBubble';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

const Chat = forwardRef(({ messages = [], character }, ref) => {
  return (
    <ChatContainer ref={ref}>
      {messages.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          opacity: 0.5
        }}>
          Noch keine Nachrichten. Starte eine Unterhaltung!
        </Box>
      ) : (
        messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message}
            isUser={message.isUser}
            character={!message.isUser ? character : undefined}
          />
        ))
      )}
    </ChatContainer>
  );
});

export default Chat;
