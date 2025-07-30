import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import style from './index.module.css';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  play?: boolean;
  fontSize?: string;
}

const AnimatedTitle = ({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  stagger = 0.03,
  play = true,
  fontSize = 'inherit',
}: AnimatedTitleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const chars = text.split('');

  useEffect(() => {
    if (!containerRef.current || !play) return;

    const chars = containerRef.current.querySelectorAll('[data-char]');
    if (animationRef.current) {
      animationRef.current.kill();
    }

    gsap.set(chars, {
      y: '1.5em',
      opacity: 0,
      scale: 0.8,
      filter: 'blur(6px)',
      rotation: -5,
    });

    animationRef.current = gsap.timeline({ delay });

    animationRef.current.to(chars, {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      rotation: 0,
      duration,
      ease: 'expo.out',
      stagger,
    });

    // animationRef.current.to(chars, {
    //   y: '-0.2em',
    //   rotation: 2,
    //   scale: 1.05,
    //   duration: 1.5,
    //   ease: 'sine.inOut',
    //   repeat: -1,
    //   yoyo: true,
    //   stagger: {
    //     each: 0.1,
    //     from: 'center',
    //   },
    // }, `+=0.2`);

    // Flicker effect
    animationRef.current.to(chars, {
      opacity: gsap.utils.distribute({
        base: 0.7,
        amount: 0.3,
        from: "random",
      }),
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: {
        each: 0.2,
        from: 'center',
      },
    }, "<");

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, delay, duration, stagger, play]);

  return (
    <div
      ref={containerRef}
      className={`${style.container} ${className}`}
      style={{ fontSize }}
    >
      {chars.map((char, index) => (
        <span key={index} data-char className={style.char}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default AnimatedTitle;
