
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Verner Panton 'Geometri' / Grid Style Generator
// A rigid grid of squares containing contrasting circles of varying sizes
const createPatternCanvas = () => {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  // The pattern is a grid. Let's make it 8x8 for a good density.
  const gridCount = 8; 
  const tileSize = size / gridCount;

  for (let y = 0; y < gridCount; y++) {
    for (let x = 0; x < gridCount; x++) {
      const xPos = x * tileSize;
      const yPos = y * tileSize;
      const centerX = xPos + tileSize / 2;
      const centerY = yPos + tileSize / 2;

      // 1. Determine Background Color (Checkerboard)
      // (x + y) % 2 === 0 gives us the checkerboard pattern
      const isBlackBg = (x + y) % 2 === 0;
      
      ctx.fillStyle = isBlackBg ? '#000000' : '#ffffff';
      ctx.fillRect(xPos, yPos, tileSize, tileSize);

      // 2. Draw Circle (Contrast Color)
      ctx.fillStyle = isBlackBg ? '#ffffff' : '#000000';
      ctx.beginPath();

      // 3. Create Rhythm: Alternate circle sizes by row
      // Even rows have large circles (almost touching edges)
      // Odd rows have smaller circles (creating breathing room)
      let radius;
      if (y % 2 === 0) {
        radius = tileSize * 0.42; // Large
      } else {
        radius = tileSize * 0.25; // Small
      }

      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas;
};

export const LineEnvironment = () => {
  const mountRef = useRef(null);
  // Start with 45 degrees (PI/4) so walls are clearly visible immediately
  const targetRotationY = useRef(Math.PI / 4);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let isMounted = true;

    // Prevent divide-by-zero issues if container hasn't laid out yet
    const width = currentMount.clientWidth || window.innerWidth || 1;
    const height = currentMount.clientHeight || window.innerHeight || 1;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6;

    let renderer = null;

    try {
      // Alpha: true is crucial for transparency
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      // Clear color must be transparent
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.background = 'transparent'; 
      currentMount.appendChild(renderer.domElement);
    } catch (e) {
      console.error("Error initializing WebGLRenderer:", e);
      return;
    }

    if (!renderer) return;
    
    // --- Room Construction ---
    const room = new THREE.Group();
    room.rotation.y = targetRotationY.current;

    const CUBE_SIZE = 4;

    const wallPatternCanvas = createPatternCanvas();
    const wallTexture = new THREE.CanvasTexture(wallPatternCanvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    // We repeat the texture slightly to increase density if needed, 
    // but the canvas generator handles the density nicely now (8x8 grid).
    wallTexture.repeat.set(1, 1); 
    
    // Enable Anisotropy for sharp lines at angles
    if (renderer.capabilities.getMaxAnisotropy()) {
        wallTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    // Use the same patterned material for walls, floor, and ceiling
    const roomMaterial = new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.DoubleSide });
    
    const planeGeom = new THREE.PlaneGeometry(CUBE_SIZE, CUBE_SIZE);
    
    const leftWall = new THREE.Mesh(planeGeom, roomMaterial);
    leftWall.position.x = -CUBE_SIZE / 2;
    leftWall.rotation.y = Math.PI / 2;
    room.add(leftWall);
    
    const rightWall = new THREE.Mesh(planeGeom, roomMaterial);
    rightWall.position.x = CUBE_SIZE / 2;
    rightWall.rotation.y = -Math.PI / 2;
    room.add(rightWall);
    
    const floor = new THREE.Mesh(planeGeom, roomMaterial);
    floor.position.y = -CUBE_SIZE / 2;
    floor.rotation.x = Math.PI / 2;
    room.add(floor);
    
    const ceiling = new THREE.Mesh(planeGeom, roomMaterial);
    ceiling.position.y = CUBE_SIZE / 2;
    ceiling.rotation.x = -Math.PI / 2;
    room.add(ceiling);

    scene.add(room);

    // --- Animation and Interaction ---
    let animationFrameId;
    const animate = () => {
      if (!isMounted || !renderer) return;

      try {
        animationFrameId = requestAnimationFrame(animate);
        
        // Smoothly interpolate visual rotation towards target
        room.rotation.y += (targetRotationY.current - room.rotation.y) * 0.08;
        
        // Decay target rotation back to 0 (The "Return to Center" force)
        targetRotationY.current *= 0.98;

        renderer.render(scene, camera);
      } catch (e) {
        console.error("Render error:", e);
        cancelAnimationFrame(animationFrameId);
      }
    };
    animate();

    const handleScroll = (event) => {
        if (!isMounted) return;
        const maxAngle = Math.PI / 3;
        const baseSpeed = 0.00025;
        const currentTargetAngle = targetRotationY.current;
        
        const proximityToLimit = Math.abs(currentTargetAngle) / maxAngle;
        const resistanceFactor = Math.max(0, 1 - Math.pow(proximityToLimit, 3));
        
        const rotationIncrement = event.deltaY * baseSpeed * resistanceFactor;
        
        let newTargetAngle = currentTargetAngle + rotationIncrement;
        newTargetAngle = Math.max(-maxAngle, Math.min(maxAngle, newTargetAngle));
        targetRotationY.current = newTargetAngle;
    };
    
    const handleResize = () => {
      if (!isMounted || !renderer || !currentMount) return;
      const w = currentMount.clientWidth || 1;
      const h = currentMount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      scene.remove(room);
      room.clear();

      wallTexture.dispose();
      roomMaterial.dispose();
      planeGeom.dispose();
      
      if (renderer) {
        renderer.dispose();
        if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  const mountStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2, // Explicit Z-index higher than creature
      pointerEvents: 'none',
      backgroundColor: 'transparent', // Ensure container is transparent
  };

  return <div ref={mountRef} style={mountStyle} />;
};
