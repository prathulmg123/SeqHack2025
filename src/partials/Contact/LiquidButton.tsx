import React, { useEffect, useRef, useCallback } from 'react';
import './liquid.scss';

class Point {
  x: number; y: number; ix: number; iy: number;
  vx: number; vy: number; cx1: number; cy1: number;
  cx2: number; cy2: number; level: number;

  constructor(x: number, y: number, level: number) {
    this.ix = this.x = 50 + x;
    this.iy = this.y = 50 + y;
    this.vx = this.vy = 0;
    this.cx1 = this.cy1 = this.cx2 = this.cy2 = 0;
    this.level = level;
  }

  move(state: any) {
    this.vx += (this.ix - this.x) / (state.viscosity * this.level);
    this.vy += (this.iy - this.y) / (state.viscosity * this.level);

    const dx = this.ix - state.relMouseX;
    const dy = this.iy - state.relMouseY;
    const relDist = 1 - Math.sqrt(dx * dx + dy * dy) / state.mouseDist;

    if ((state.mouseDirectionX > 0 && state.relMouseX > this.x) || 
        (state.mouseDirectionX < 0 && state.relMouseX < this.x)) {
      if (relDist > 0 && relDist < 1) {
        this.vx = (state.mouseSpeedX / 4) * relDist;
      }
    }
    
    this.vx *= 1 - state.damping;
    this.x += this.vx;

    if ((state.mouseDirectionY > 0 && state.relMouseY > this.y) || 
        (state.mouseDirectionY < 0 && state.relMouseY < this.y)) {
      if (relDist > 0 && relDist < 1) {
        this.vy = (state.mouseSpeedY / 4) * relDist;
      }
    }
    
    this.vy *= 1 - state.damping;
    this.y += this.vy;
  }
}

interface LiquidButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  // Add these new props
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
  icon?: React.ReactNode;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({ 
  text, 
  onClick, 
  className = '', 
  style = {} 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const stateRef = useRef({
    pointsA: [] as Point[], pointsB: [] as Point[],
    mouseX: 0, mouseY: 0, relMouseX: 0, relMouseY: 0,
    mouseLastX: 0, mouseLastY: 0, mouseDirectionX: 0, mouseDirectionY: 0,
    mouseSpeedX: 0, mouseSpeedY: 0, points: 8, viscosity: 20,
    mouseDist: 70, damping: 0.05, showIndicators: false
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const state = stateRef.current;
    
    state.mouseDirectionX = state.mouseX < e.pageX ? 1 : 
                          (state.mouseX > e.pageX ? -1 : 0);
    state.mouseDirectionY = state.mouseY < e.pageY ? 1 : 
                          (state.mouseY > e.pageY ? -1 : 0);

    state.mouseX = e.pageX;
    state.mouseY = e.pageY;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      state.relMouseX = e.pageX - rect.left - window.scrollX;
      state.relMouseY = e.pageY - rect.top - window.scrollY;
    }
  }, []);

  const updateMouseSpeed = useCallback(() => {
    const state = stateRef.current;
    state.mouseSpeedX = state.mouseX - state.mouseLastX;
    state.mouseSpeedY = state.mouseY - state.mouseLastY;
    state.mouseLastX = state.mouseX;
    state.mouseLastY = state.mouseY;
    setTimeout(updateMouseSpeed, 50);
  }, []);

  const initButton = useCallback(() => {
    if (!buttonRef.current || !canvasRef.current) return;
    
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    const state = stateRef.current;
    
    canvas.width = buttonWidth + 100;
    canvas.height = buttonHeight + 100;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Initialize points
    state.pointsA = [];
    state.pointsB = [];
    
    const addPoints = (x: number, y: number) => {
      state.pointsA.push(new Point(x, y, 1));
      state.pointsB.push(new Point(x, y, 2));
    };
    
    // Create button shape points
    const x = buttonHeight / 2;
    for (let j = 1; j < state.points; j++) {
      addPoints(x + ((buttonWidth - buttonHeight) / state.points) * j, 0);
    }
    addPoints(buttonWidth - buttonHeight / 5, 0);
    addPoints(buttonWidth + buttonHeight / 10, buttonHeight / 2);
    addPoints(buttonWidth - buttonHeight / 5, buttonHeight);
    
    for (let j = state.points - 1; j > 0; j--) {
      addPoints(x + ((buttonWidth - buttonHeight) / state.points) * j, buttonHeight);
    }
    addPoints(buttonHeight / 5, buttonHeight);
    addPoints(-buttonHeight / 10, buttonHeight / 2);
    addPoints(buttonHeight / 5, 0);
    
    // Animation loop
    const render = () => {
      if (!context) return;
      
      const state = stateRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update points
      state.pointsA.forEach(p => p.move(state));
      state.pointsB.forEach(p => p.move(state));
      
      // Draw shapes
      [state.pointsA, state.pointsB].forEach((points, j) => {
        if (!context) return;
        
        context.fillStyle = j === 0 ? '#fff' : 
          (() => {
            const gradient = context.createRadialGradient(
              state.relMouseX, state.relMouseY, 150, 
              state.relMouseX, state.relMouseY, 0
            );
            gradient.addColorStop(0, '#102ce5');
            gradient.addColorStop(1, '#E406D6');
            return gradient;
          })();
        
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const nextP = points[i + 1] || points[0];
          p.cx1 = (p.x + nextP.x) / 2;
          p.cy1 = (p.y + nextP.y) / 2;
          context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1);
        }
        
        context.fill();
      });
      
      animationFrameRef.current = requestAnimationFrame(render);
    };
    
    animationFrameRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    updateMouseSpeed();
    initButton();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, initButton, updateMouseSpeed]);

  return (
    <>
    <div className="buttons">
  <button className="blob-btn" onClick={onClick}>
    {text}
    <span className="blob-btn__inner">
      <span className="blob-btn__blobs">
        <span className="blob-btn__blob"></span>
        <span className="blob-btn__blob"></span>
        <span className="blob-btn__blob"></span>
        <span className="blob-btn__blob"></span>
      </span>
    </span>
  </button>
  <br/>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>
</svg>
</div>
    </>
  );
};

export default LiquidButton;