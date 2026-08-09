import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Earth({ isZooming }) {
  const earth = useRef();
  
  const texture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_day_4096.jpg'
  );
  texture.colorSpace = THREE.SRGBColorSpace;

  // Target rotation for Asia region
  const targetRotationY = Math.PI * 1.5;
  const targetRotationX = 0.3;

  useFrame((state, delta) => {
    if (!earth.current) return;
    
    if (isZooming) {
      // Smoothly rotate to face target region
      earth.current.rotation.y = THREE.MathUtils.lerp(earth.current.rotation.y, targetRotationY, 0.03);
      earth.current.rotation.x = THREE.MathUtils.lerp(earth.current.rotation.x, targetRotationX, 0.03);
    } else {
      // Normal slow idle rotation
      earth.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={earth} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <sphereGeometry args={[1.8, 192, 192]} />
        <meshPhongMaterial
          map={texture}
          shininess={18}
          specular={new THREE.Color(0x224466)}
        />
      </mesh>
      <mesh scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[1.8, 192, 192]} />
        <meshBasicMaterial
          color={0x3b9cff}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Stars() {
  const count = 700;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const radius = 25 + Math.random() * 45;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color={0xffffff}
        transparent
        opacity={0.65}
      />
    </points>
  );
}

function CameraController({ isZooming }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    if (isZooming) {
      // Smoothly zoom in to the earth
      camera.position.lerp(new THREE.Vector3(0, 0, 1.95), 0.02);
      
      // Ensure controls don't fight the camera interpolation
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={2.5}
      maxDistance={12}
      rotateSpeed={0.45}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

export default function EarthIntro({ onExplore }) {
  const [isZooming, setIsZooming] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const handleExplore = () => {
    setIsZooming(true); // Start the cinematic zoom
    
    // After 2.5 seconds of zooming, start the CSS fade out of the whole container
    setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // After 3.5 seconds total, trigger the final callback to unmount the intro
    setTimeout(() => {
      onExplore();
    }, 3500); 
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#00030b',
        fontFamily: "'Inter', 'Outfit', sans-serif"
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#00030b']} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[-5, 4, 6]} intensity={4} />
        <directionalLight position={[5, 1, -4]} intensity={0.8} />
        <React.Suspense fallback={null}>
          <Earth isZooming={isZooming} />
        </React.Suspense>
        <Stars />
        <CameraController isZooming={isZooming} />
      </Canvas>

      {/* UI Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Logo - Top Left */}
        <div className="absolute top-6 left-8 pointer-events-auto flex items-center gap-3">
          <img src="/images/logo.png" alt="YatraVerse Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          <span className="text-xl font-bold text-white tracking-widest hidden md:block uppercase">YatraVerse</span>
        </div>

        {/* Text - Top Center */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center w-full px-4">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-[0.2em] drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-3">
            YATRAVERSE
          </h1>
          <p className="text-base md:text-lg font-medium text-gray-300 tracking-[0.3em] uppercase opacity-90 drop-shadow-md">
            Discover the Nepal locals know
          </p>
        </div>

        {/* Button - Dead Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={handleExplore}
            className="pointer-events-auto px-10 py-4 rounded-full border border-white/30 bg-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/20 hover:scale-105 hover:border-white/50 transition-all duration-300 backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] group flex items-center gap-3"
          >
            <span>EXPLORE NEPAL</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
