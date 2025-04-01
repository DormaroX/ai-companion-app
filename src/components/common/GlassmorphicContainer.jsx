import React from 'react';
import PropTypes from 'prop-types';

/**
 * GlassmorphicContainer - A reusable component for glassmorphism UI style
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.character - Character name (maxx, terra, nova, nyxari) for styling
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.enableHover - Whether to enable hover animation
 * @param {boolean} props.enableGlitch - Whether to enable glitch effect (for Nyxari)
 * @returns {JSX.Element} Glassmorphic container component
 */
const GlassmorphicContainer = ({ 
  children, 
  character = '', 
  className = '', 
  enableHover = true,
  enableGlitch = false
}) => {
  // Base classes for glassmorphism effect
  const baseClasses = "relative backdrop-blur-md bg-white/10 border border-white/20 shadow-glass";
  
  // Character-specific shadow styling
  const characterStyles = {
    maxx: "shadow-maxx",
    terra: "shadow-terra",
    nova: "shadow-nova",
    nyxari: "shadow-nyxari"
  };
  
  // Hover effect class
  const hoverClass = enableHover ? "transition-transform hover:scale-[1.01]" : "";
  
  // Glitch effect for Nyxari
  const glitchClass = (character === 'nyxari' && enableGlitch) ? "animate-glitch" : "";
  
  // Umfangreiches Logging für Fehleranalyse
  console.log('GlassmorphicContainer Styling:', {
    character,
    characterStyle: characterStyles[character] || 'default',
    enableHover,
    enableGlitch
  });

  // Combine all classes
  const combinedClasses = `
    ${baseClasses}
    ${characterStyles[character] || ''}
    ${hoverClass}
    ${glitchClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

GlassmorphicContainer.propTypes = {
  children: PropTypes.node.isRequired,
  character: PropTypes.oneOf(['', 'maxx', 'terra', 'nova', 'nyxari']),
  className: PropTypes.string,
  enableHover: PropTypes.bool,
  enableGlitch: PropTypes.bool
};

export default GlassmorphicContainer;
