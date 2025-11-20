
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Verner Panton 'Geometri' Style Generator
// Grid of squares with contrasting circles
const createPatternCanvas = () => {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  const gridCount = 8; 
  const tileSize = size / gridCount;

  for (let y = 0; y < gridCount; y++) {
    for (let x = 0; x < gridCount; x++) {
      const xPos = x * tileSize;
      const yPos = y * tileSize;
      const centerX = xPos + tileSize / 2;
      const centerY = yPos + tileSize / 2;

      // Checkerboard BG
      const isBlackBg = (x + y) % 2 === 0;
      
      ctx.fillStyle = isBlackBg ? '#000000' : '#ffffff';
      ctx.fillRect(xPos, yPos, tileSize, tileSize);

      // Contrast Circle
      ctx.fillStyle = isBlackBg ? '#ffffff' : '#000000';
      ctx.beginPath();

      // Alternating sizes
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
  const targetRotationY = useRef(Math.PI / 4);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let isMounted = true;
    const width = currentMount.clientWidth || window.innerWidth || 1;
    const height = currentMount.clientHeight || window.innerHeight || 1;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6;

    let renderer = null;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.background = 'transparent'; 
      currentMount.appendChild(renderer.domElement);
    } catch (e) {
      console.error("Error initializing WebGLRenderer:", e);
      return;
    }

    if (!renderer) return;
    
    // --- Rounded Room Construction ---
    const room = new THREE.Group();
    room.rotation.y = targetRotationY.current;

    const wallPatternCanvas = createPatternCanvas();
    const wallTexture = new THREE.CanvasTexture(wallPatternCanvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 2); // Denser pattern for the box
    
    if (renderer.capabilities.getMaxAnisotropy()) {
        wallTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    // MATERIAL: BackSide is crucial to see the "inside" of the box
    const roomMaterial = new THREE.MeshBasicMaterial({ 
        map: wallTexture, 
        side: THREE.BackSide 
    });
    
    // GEOMETRY: RoundedBoxGeometry(width, height, depth, segments, radius)
    // Dimensions must be equal to form a cube. 
    // Radius gives the squircle effect.
    const boxSize = 5;
    const boxRadius = 1.0; 
    const boxSegments = 8;
    const geometry = new RoundedBoxGeometry(boxSize, boxSize, boxSize, boxSegments, boxRadius);
    
    const roundedRoom = new THREE.Mesh(geometry, roomMaterial);
    room.add(roundedRoom);

    scene.add(room);

    // --- Animation ---
    let animationFrameId;
    const animate = () => {
      if (!isMounted || !renderer) return;

      try {
        animationFrameId = requestAnimationFrame(animate);
        
        room.rotation.y += (targetRotationY.current - room.rotation.y) * 0.08;
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
      geometry.dispose();
      
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
      zIndex: 2, 
      pointerEvents: 'none',
      backgroundColor: 'transparent',
  };

  return <div ref={mountRef} style={mountStyle} />;
};
