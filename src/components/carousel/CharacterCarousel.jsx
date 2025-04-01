import React, { useState } from 'react';
import { Box, IconButton, Button, Typography, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { characterProfiles } from '../characters/characterProfiles';
import { styled } from '@mui/material/styles';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(5px)',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  margin: 0,
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  textAlign: 'center',
}));

const ImageSection = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '3rem', // Abstand vom oberen Rand
  left: theme.spacing(4),
  right: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '55%',
}));

const CharacterImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  maxHeight: '100%'
});

const SelectButton = styled(Button)(({ theme }) => ({
  width: '200px',
  alignSelf: 'center',
  marginTop: theme.spacing(2),
  backgroundColor: '#490d49',
  color: theme.palette.common.white,
  borderRadius: '25px',
  textTransform: 'none',
  fontSize: '1.1rem',
  padding: theme.spacing(1, 4),
  '&:hover': {
    backgroundColor: '#2e082e',
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
}));

const CharacterName = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: `calc(55% + 4rem)`, // Nach dem Bild
  left: theme.spacing(4),
  right: theme.spacing(4),
  color: '#90caf9',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 600,
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: `calc(55% + 3.2rem + 2rem + 2rem)`, // Button + Description height + gaps
  left: theme.spacing(4),
  right: theme.spacing(4),
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'center',
}));

// Styled Components
const getTagStyle = (word) => ({
  // Terra's Eigenschaften
  Verantwortung: {
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
    color: '#90caf9',
    border: '1px solid rgba(25, 118, 210, 0.5)'
  },
  Befehl: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    color: '#ff8a80',
    border: '1px solid rgba(211, 47, 47, 0.5)'
  },
  Nähe: {
    backgroundColor: 'rgba(56, 142, 60, 0.2)',
    color: '#a5d6a7',
    border: '1px solid rgba(56, 142, 60, 0.5)'
  },
  Vertrauen: {
    backgroundColor: 'rgba(194, 24, 91, 0.2)',
    color: '#f48fb1',
    border: '1px solid rgba(194, 24, 91, 0.5)'
  },
  // Nova's Eigenschaften
  Spiel: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    color: '#ce93d8',
    border: '1px solid rgba(156, 39, 176, 0.5)'
  },
  Mut: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#ffb74d',
    border: '1px solid rgba(255, 152, 0, 0.5)'
  },
  Verlangen: {
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    color: '#f48fb1',
    border: '1px solid rgba(233, 30, 99, 0.5)'
  },
  Grenze: {
    backgroundColor: 'rgba(0, 150, 136, 0.2)',
    color: '#80cbc4',
    border: '1px solid rgba(0, 150, 136, 0.5)'
  },
  // Nyxari's Eigenschaften
  Kontrolle: {
    backgroundColor: 'rgba(63, 81, 181, 0.2)',
    color: '#9fa8da',
    border: '1px solid rgba(63, 81, 181, 0.5)'
  },
  Instinkt: {
    backgroundColor: 'rgba(121, 85, 72, 0.2)',
    color: '#bcaaa4',
    border: '1px solid rgba(121, 85, 72, 0.5)'
  },
  Beute: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    color: '#ef9a9a',
    border: '1px solid rgba(244, 67, 54, 0.5)'
  },
  Hingabe: {
    backgroundColor: 'rgba(171, 71, 188, 0.2)',
    color: '#ce93d8',
    border: '1px solid rgba(171, 71, 188, 0.5)'
  }
})[word] || {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.2)'
};

const Tag = styled(Typography)(({ theme, customstyle }) => ({
  padding: theme.spacing(0.5, 2),
  borderRadius: '15px',
  fontSize: '0.9rem',
  fontWeight: 500,
  letterSpacing: '0.5px',
  ...customstyle
}));

const Description = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: `calc(55% + 3.2rem + 2rem + 2rem + 4rem)`, // Nach den Tags
  left: theme.spacing(4),
  right: theme.spacing(4),
  color: theme.palette.grey[300],
  textAlign: 'justify',
  fontSize: '1.2rem',
  lineHeight: 1.6,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'italic',
  maxWidth: '600px',
  margin: '0 auto',
}));

const CharacterCarousel = ({ onCharacterSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const theme = useTheme();
  const currentCharacter = characterProfiles[activeIndex];

  const handlePrevious = () => {
    setActiveIndex((prev) => 
      prev === 0 ? characterProfiles.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => 
      prev === characterProfiles.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelect = () => {
    if (isSelecting) return; // Verhindert Doppelklicks
    
    if (!currentCharacter) {
      console.error('Kein Charakter ausgewählt');
      return;
    }

    if (typeof onCharacterSelect !== 'function') {
      console.error('onCharacterSelect ist keine Funktion');
      return;
    }

    setIsSelecting(true);
    console.log('Charakter wird ausgewählt:', currentCharacter.name);
    
    try {
      onCharacterSelect(currentCharacter);
      console.log('Charakter erfolgreich ausgewählt:', currentCharacter.name);
    } catch (error) {
      console.error('Fehler bei der Charakterauswahl:', error);
    } finally {
      // Nach 500ms wieder Klicks erlauben
      setTimeout(() => setIsSelecting(false), 500);
    }
  };

  return (
    <CarouselContainer>
      <ImageSection>
        <NavigationButton
          onClick={handlePrevious}
          sx={{ left: theme.spacing(2) }}
        >
          <ChevronLeft />
        </NavigationButton>

        <CharacterImage
          src={currentCharacter.image}
          alt={currentCharacter.name}
          loading="lazy"
        />

        <NavigationButton
          onClick={handleNext}
          sx={{ right: theme.spacing(2) }}
        >
          <ChevronRight />
        </NavigationButton>
      </ImageSection>

          <CharacterName variant="h4">
            {currentCharacter.name}
          </CharacterName>

          <TagsContainer>
            {currentCharacter.trigger_words.map((word, i) => (
              <Tag key={i} variant="caption" customstyle={getTagStyle(word)}>
                {word}
              </Tag>
            ))}
          </TagsContainer>

          <Description variant="body1">
            {currentCharacter.description}
          </Description>
          
          <Box sx={{ 
            position: 'absolute',
            bottom: theme.spacing(4),
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            <SelectButton
              variant="contained"
              onClick={handleSelect}
              disabled={isSelecting}
            >
              Auswählen
            </SelectButton>
          </Box>
    </CarouselContainer>
  );
};

export { getTagStyle };
export default CharacterCarousel;
