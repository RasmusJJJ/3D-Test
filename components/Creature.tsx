
import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize.tsx';
import { useMousePosition } from '../hooks/useMousePosition.tsx';

export const Creature = () => {
  const { width, height } = useWindowSize();
  const mousePosition = useMousePosition();
  const [happiness, setHappiness] = useState(0);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural Blinking Logic
  useEffect(() => {
    let timeoutId;

    const performBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        // Occasional double blink
        if (Math.random() > 0.7) {
          setTimeout(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
          }, 100);
        }
      }, 150);

      const nextDelay = Math.random() * 4000 + 2000;
      timeoutId = setTimeout(performBlink, nextDelay);
    };
    
    timeoutId = setTimeout(performBlink, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Happiness & Eye Tracking Logic
  useEffect(() => {
    const { x: mouseX, y: mouseY } = mousePosition;
    const w = width || window.innerWidth || 1000;
    const h = height || window.innerHeight || 1000;

    if (mouseX === null || mouseY === null) {
      setHappiness(0);
      return;
    }

    const screenCenterX = w / 2;
    const screenCenterY = h / 2;
    const distance = Math.sqrt(Math.pow(mouseX - screenCenterX, 2) + Math.pow(mouseY - screenCenterY, 2));
    const maxDistance = Math.sqrt(Math.pow(screenCenterX, 2) + Math.pow(screenCenterY, 2));
    
    let newHappiness = 1 - Math.min(distance / maxDistance, 1);
    newHappiness = Math.pow(newHappiness, 2);
    setHappiness(newHappiness);

    // Calculate eye movement
    const deltaX = mouseX - screenCenterX;
    const deltaY = mouseY - screenCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const lookDistance = 3; // Max pixels eyes can move
    
    setEyeOffset({
      x: Math.cos(angle) * lookDistance,
      y: Math.sin(angle) * lookDistance
    });

  }, [mousePosition, width, height]);

  // Bornholm Shape
  const creaturePath = "M 89.6,22.2 C 88.3,18.7 86.8,14.6 84.4,11.8 C 82.2,9.3 78.9,8.4 76.5,7.2 C 68.3,3.1 59.4,3.1 50.8,2.1 C 40.4,0.9 30.2,2.3 21,7.2 C 14.9,10.4 10.1,15.5 6.8,21.5 C 3.1,28.2 1.5,35.8 1,43.5 C 0.5,52.2 1.4,61 4.1,69.2 C 6.8,77.3 11.2,84.6 17.5,90.2 C 24.3,96.3 33.1,99.9 42,100 C 51.5,100.1 60.9,96.8 68.8,91.5 C 76.9,86.1 83.2,78.5 87.2,70 C 91.2,61.5 93.2,52.1 94.7,42.8 C 95.8,36.1 96.1,29.3 89.6,22.2 Z";
  
  // Simple Smile
  const mouthYControl = 68 + happiness * 12;
  const mouthPath = `M 40,68 Q 52,${mouthYControl} 64,68`;

  const containerStyle: React.CSSProperties = {
    transform: `scale(${1 + happiness * 0.05})`,
    transition: 'transform 0.3s ease-out',
    position: 'relative',
    // Reduced size (7.5vmin)
    width: '7.5vmin', 
    height: '7.5vmin',
    minWidth: '30px',
  };

  const eyeStyle: React.CSSProperties = {
    transition: 'transform 0.1s ease-in-out',
    transformOrigin: 'center',
    transformBox: 'fill-box',
    transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1) translate(' + eyeOffset.x + 'px, ' + eyeOffset.y + 'px)',
  };

  return (
    <div style={containerStyle}>
      <svg
        viewBox="0 0 105 105"
        style={{ width: '100%', height: '100%'}}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* White Body */}
        <path d={creaturePath} fill="white" />

        {/* Left Eye - Simple Black Dot */}
        <circle cx="40" cy="40" r="4" fill="black" style={eyeStyle} />

        {/* Right Eye - Simple Black Dot */}
        <circle cx="64" cy="40" r="4" fill="black" style={eyeStyle} />

        {/* Mouth */}
        <path
          d={mouthPath}
          stroke="black" 
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
