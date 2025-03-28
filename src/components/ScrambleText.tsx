import { useEffect, useState } from 'react';

interface Props {
  text: string;
  className?: string;
}

export default function ScrambleText({ text, className = '' }: Props) {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyz0123456789';

  useEffect(() => {
    let iteration = 0;
    const maxIterations = 15; // Number of scrambles before final text
    let finalTextRevealed = 0;
    
    const interval = setInterval(() => {
      if (iteration >= maxIterations) {
        // Start revealing the final text one character at a time
        if (finalTextRevealed <= text.length) {
          setDisplayText(
            text.slice(0, finalTextRevealed) +
            Array(text.length - finalTextRevealed)
              .fill(0)
              .map(() => chars[Math.floor(Math.random() * chars.length)])
              .join('')
          );
          finalTextRevealed++;
        } else {
          clearInterval(interval);
        }
      } else {
        // Random scramble phase
        setDisplayText(
          Array(text.length)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('')
        );
        iteration++;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className={className}>
      {displayText ? `</${displayText}>` : ''}
    </h1>
  );
} 