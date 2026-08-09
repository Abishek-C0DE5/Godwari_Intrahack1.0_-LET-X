import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars as SparkleStars } from '@react-three/drei';
import * as THREE from 'three';

function Earth({ isZooming, isFading }) {
  const earth = useRef();
  const materialRef = useRef();
  const atmosphereRef = useRef();
  
  const texture = useLoader(
    THREE.TextureLoader,
    '/images/earth_day_4096.jpg'
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

    if (isFading) {
      if (materialRef.current) {
        materialRef.current.transparent = true;
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, 0.08);
      }
      if (atmosphereRef.current) {
        atmosphereRef.current.opacity = THREE.MathUtils.lerp(atmosphereRef.current.opacity, 0, 0.08);
      }
    }
  });

  return (
    <group ref={earth} rotation={[0, Math.PI / 2, 0]} position={[0, -0.8, 0]}>
      <mesh>
        <sphereGeometry args={[1.5, 192, 192]} />
        <meshPhongMaterial
          ref={materialRef}
          map={texture}
          shininess={18}
          specular={new THREE.Color(0x224466)}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[1.5, 192, 192]} />
        <meshBasicMaterial
          ref={atmosphereRef}
          color={0x3b9cff}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function ColoredStars() {
  const count = 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const starsRef = useRef();

  const colorOptions = [
    new THREE.Color('#ffffff'), // White
    new THREE.Color('#8ab4f8'), // Light Blue
    new THREE.Color('#f48fb1'), // Soft Pink
    new THREE.Color('#fff2cc')  // Pale Yellow
  ];

  for (let i = 0; i < count; i++) {
    const radius = 25 + Math.random() * 45;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        vertexColors={true}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

function Meteors() {
  const count = 8;
  const meteorsRef = useRef();

  // Create initial random data for each meteor
  const [data] = useState(() => 
    new Array(count).fill().map(() => ({
      x: 10 + Math.random() * 20,
      y: 5 + Math.random() * 20,
      z: -15 + Math.random() * 10,
      speed: 0.15 + Math.random() * 0.3,
      length: 1 + Math.random() * 3,
      delay: Math.random() * 300 // random frame delay before shooting
    }))
  );

  useFrame(() => {
    if (meteorsRef.current) {
      meteorsRef.current.children.forEach((meteor, i) => {
        if (data[i].delay > 0) {
          data[i].delay--;
          return;
        }
        
        // Shoot diagonally down and left
        meteor.position.x -= data[i].speed;
        meteor.position.y -= data[i].speed * 0.8;
        meteor.position.z += data[i].speed * 0.5; 

        // Reset if it goes way off screen
        if (meteor.position.x < -20 || meteor.position.y < -15) {
          meteor.position.x = 10 + Math.random() * 20;
          meteor.position.y = 5 + Math.random() * 20;
          meteor.position.z = -15 + Math.random() * 10;
          data[i].delay = 100 + Math.random() * 400; // wait before shooting again
        }
      });
    }
  });

  return (
    <group ref={meteorsRef}>
      {data.map((m, i) => (
        <mesh key={i} position={[m.x, m.y, m.z]} rotation={[0, 0, Math.PI / 3.5]}>
          <cylinderGeometry args={[0.005, 0.02, m.length, 4]} />
          <meshBasicMaterial color="#a3c2ff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CameraController({ isZooming }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    if (isZooming) {
      // Smoothly zoom into the earth (shifted down and larger)
      camera.position.lerp(new THREE.Vector3(0, -0.8, 1.6), 0.035);
      
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure WebGL context is ready before fading in
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    setIsZooming(true); // Start the cinematic zoom
    
    // After 2.0 seconds of zooming, start the CSS fade out of the whole container
    setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // After 3.0 seconds total, trigger the final callback to unmount the intro
    setTimeout(() => {
      onExplore();
    }, 3000); 
  };

  return (
    <div
      className={`fixed inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#00030b',
        fontFamily: "'Inter', 'Outfit', sans-serif"
      }}
    >
      {/* Background Map Image - PERMANENTLY VISIBLE */}
      <img 
        src="/images/nepal_map.png" 
        alt="Nepal Map" 
        className="absolute inset-0 w-full h-full object-contain scale-[1.3] md:scale-150 z-[-1] pointer-events-none opacity-40"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(59, 156, 255, 0.8))',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        className="absolute inset-0 z-10"
      >
        {/* Cosmic Ambient Lighting (Nebula feel) */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, -10]} color="#4433ff" intensity={3} />
        <pointLight position={[-10, -10, -10]} color="#ff3366" intensity={2} />
        <directionalLight position={[-5, 4, 6]} color="#ffffff" intensity={3} />
        <directionalLight position={[5, 1, -4]} color="#b3d4ff" intensity={1} />
        
        <React.Suspense fallback={null}>
          <Earth isZooming={isZooming} isFading={isFading} />
        </React.Suspense>
        
        {/* Shimmering / Twinkling Stars */}
        <SparkleStars radius={50} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1.5} />
        
        {/* Custom Colored Drifting Stars */}
        <ColoredStars />

        {/* Shooting Stars / Meteors */}
        <Meteors />

        <CameraController isZooming={isZooming} />
      </Canvas>



      {/* UI Overlay - IN FRONT of Earth (z-20) */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Logo - Top Left */}
        <div className="absolute top-6 left-8 pointer-events-auto flex items-center gap-3">
          <img src="/images/logo.png" alt="YatraVerse Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          <span className="text-xl font-bold text-white tracking-widest hidden md:block uppercase">YatraVerse</span>
        </div>

        {/* Text - Top Center (Adjusted size and position so it doesn't touch Earth) */}
        <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 text-center w-full px-4 animate-fade-in-up">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-2 drop-shadow-2xl">
            Explore Nepal.<br/>
            <span className="text-white drop-shadow-xl">Connect with locals.</span>
          </h1>
          <p className="text-sm md:text-lg text-white max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg shadow-black opacity-90">
            Experience the Himalayas like never before.
          </p>
        </div>

        {/* Button - Dead Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-40">
          <button
            onClick={handleExplore}
            className="pointer-events-auto px-10 py-4 rounded-full border border-white/20 bg-black/80 text-white font-bold tracking-wider hover:bg-black hover:scale-105 hover:border-white/50 transition-all duration-300 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)] group flex items-center gap-3"
          >
            <span>EXPLORE NOW</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
