
import React from 'react';
import { useMousePosition } from '../hooks/useMousePosition.tsx';

export const CustomCursor = () => {
  const { x, y } = useMousePosition();

  if (x === null || y === null) {
    return null;
  }

  // Base style for all cursor elements
  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: 'white',
    pointerEvents: 'none',
    zIndex: 10000,
    mixBlendMode: 'difference', // Inverts colors to be visible on black and white
  };

  // Horizontal Line
  const hLineStyle: React.CSSProperties = {
    ...baseStyle,
    top: y,
    left: 0,
    width: '100%',
    height: '1px',
  };

  // Vertical Line
  const vLineStyle: React.CSSProperties = {
    ...baseStyle,
    top: 0,
    left: x,
    width: '1px',
    height: '100%',
  };

  // Center Sticky Square
  const centerSquareStyle: React.CSSProperties = {
    ...baseStyle,
    top: y,
    left: x,
    width: '10px',
    height: '10px',
    transform: 'translate(-50%, -50%)', // Center the square exactly on the mouse point
  };

  return (
    <>
      <div style={hLineStyle} />
      <div style={vLineStyle} />
      <div style={centerSquareStyle} />
    </>
  );
};
