// src/components/TypeWriter/Typewriter.tsx
import { useEffect, useRef, useState } from 'react';
import style from './index.module.css';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  play?: boolean;
  onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 30,
  delay = 0,
  className = '',
  cursor = true,
  play = true,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!play) return;

    const startTyping = () => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        timeoutRef.current = setTimeout(startTyping, speed);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    const timer = setTimeout(() => {
      setIsTyping(true);
      startTyping();
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(timer);
    };
  }, [text, speed, delay, play, currentIndex, onComplete]);

  // Reset when text or play changes
  useEffect(() => {
    if (!play) return;
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(false);
  }, [text, play]);

  if (!play) return null;

  return (
    <span className={`${style.typewriter} ${className}`}>
      {displayedText}
      {cursor && isTyping && <span className={style.cursor}>|</span>}
    </span>
  );
};

export default Typewriter;