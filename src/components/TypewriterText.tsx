import { useEffect, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  cursorColor?: string;
}

export default function TypewriterText({ 
  text, 
  className = '', 
  delay = 50,
  cursorColor = '#FF0F0F'
}: Props) {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayText('');
    setIsTypingComplete(false);
    let currentIndex = 0;
    
    // Type out the text
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, delay);

    // Blink the cursor
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, delay]);

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
      {(showCursor || !isTypingComplete) && (
        <span 
          style={{ 
            color: cursorColor,
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.1s'
          }}
        >
          <b>$</b>
        </span>
      )}
    </span>
  );
} 