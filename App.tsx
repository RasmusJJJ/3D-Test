import React from 'react';
import { Creature } from './components/Creature.tsx';
import { LineEnvironment } from './components/LineEnvironment.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { NavigationOverlay } from './components/NavigationOverlay.tsx';

const App = () => {
  // Ensure the app fills the entire viewport
  const mainStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    minHeight: '100vh',
    backgroundColor: '#111111', // Dark gray to distinguish from non-loaded black screen
    cursor: 'none',
    overflow: 'hidden',
    display: 'block',
  };

  const creatureContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1, // Creature sits on layer 1
  };

  return (
    <main style={mainStyle}>
      <CustomCursor />
      
      {/* Creature is rendered first. */}
      <div style={creatureContainerStyle}>
        <Creature />
      </div>

      {/* LineEnvironment is rendered on top (handled by its internal zIndex: 2). */}
      <LineEnvironment />

      {/* Navigation Overlay sits on top of everything (zIndex: 10) */}
      <NavigationOverlay />
    </main>
  );
};

export default App;