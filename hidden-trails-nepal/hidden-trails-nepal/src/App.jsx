import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

function Earth() {
  const earth = useRef()

  const texture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_day_4096.jpg'
  )

  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((state, delta) => {
    earth.current.rotation.y += delta * 0.035
  })

  return (
    <group ref={earth} rotation={[0, Math.PI / 2, 0]}>

      {/* EARTH */}
      <mesh>
        <sphereGeometry args={[3.1, 192, 192]} />

        <meshPhongMaterial
          map={texture}
          shininess={18}
          specular={new THREE.Color(0x224466)}
        />
      </mesh>

      {/* ATMOSPHERE */}
      <mesh scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[3.1, 192, 192]} />

        <meshBasicMaterial
          color={0x3b9cff}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

    </group>
  )
}

function Stars() {
  const count = 700
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const radius = 25 + Math.random() * 45

    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] =
      radius * Math.sin(phi) * Math.cos(theta)

    positions[i * 3 + 1] =
      radius * Math.sin(phi) * Math.sin(theta)

    positions[i * 3 + 2] =
      radius * Math.cos(phi)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color={0xffffff}
        transparent
        opacity={0.65}
      />
    </points>
  )
}

function App() {
  const [showNepal, setShowNepal] = useState(false)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#00030b'
      }}
    >

      {/* 3D EARTH */}
      <Canvas
        camera={{
          position: [0, 0, 7.4],
          fov: 42
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >

        {/* SPACE */}
        <color
          attach="background"
          args={['#00030b']}
        />

        {/* GENERAL LIGHT */}
        <ambientLight intensity={1.1} />

        {/* SUN */}
        <directionalLight
          position={[-5, 4, 6]}
          intensity={4}
        />

        {/* SOFT FILL */}
        <directionalLight
          position={[5, 1, -4]}
          intensity={0.8}
        />

        <Earth />

        <Stars />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          rotateSpeed={0.45}
          enableDamping
          dampingFactor={0.05}
        />

      </Canvas>

      {/* TITLE */}
      <div
        style={{
          position: 'absolute',
          top: '38px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
          color: 'white',
          pointerEvents: 'auto',
          zIndex: 10,
          fontFamily: 'Arial, sans-serif'
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: '44px',
            fontWeight: '600',
            letterSpacing: '7px',
            textShadow:
              '0 0 25px rgba(70,150,255,0.65)'
          }}
        >
          HIDDEN TRAILS NEPAL
        </h1>

        <p
          style={{
            marginTop: '12px',
            fontSize: '17px',
            letterSpacing: '2px',
            opacity: 0.9
          }}
        >
          Discover the Nepal locals know.
        </p>

        {/* EXPLORE NEPAL BUTTON */}
        <button
          onClick={() => setShowNepal(true)}
          style={{
            marginTop: '25px',
            padding: '14px 30px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.12)',
            color: 'white',
            fontSize: '16px',
            letterSpacing: '2px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          EXPLORE NEPAL
        </button>

      </div>

      {/* NEPAL MAP */}
      {showNepal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#06130d',
            zIndex: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >

         <TransformWrapper
  initialScale={1}
  minScale={0.7}
  maxScale={5}
  centerOnInit={true}
>
  <TransformComponent
    wrapperStyle={{
      width: '90vw',
      height: '85vh'
    }}
    contentStyle={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <img
      src="/maps/nepal.svg"
      alt="Map of Nepal"
      style={{
        width: '800px',
        maxWidth: '80vw',
        height: 'auto',
        display: 'block'
      }}
    />
  </TransformComponent>
</TransformWrapper>

        </div>
      )}

    </div>
  )
}

export default App