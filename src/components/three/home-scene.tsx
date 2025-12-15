'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function FloatingTaskCard({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.15;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 + delay) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <RoundedBox args={[2, 1.2, 0.15]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            roughness={0.2}
            metalness={0.3}
          />
        </RoundedBox>
        {/* Task icon */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#667eea" />
        </mesh>
      </mesh>
    </group>
  );
}

function FloatingChart({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * 0.6 + delay) * 0.12;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2 + delay) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <RoundedBox args={[1.8, 1.5, 0.1]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.85}
            roughness={0.1}
            metalness={0.2}
          />
        </RoundedBox>
        {/* Chart bars */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.6 + i * 0.4, -0.3 + Math.random() * 0.6, 0.06]}>
            <boxGeometry args={[0.2, 0.3 + Math.random() * 0.4, 0.02]} />
            <meshStandardMaterial color="#667eea" />
          </mesh>
        ))}
      </mesh>
    </group>
  );
}

function CentralLogo() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main logo shape */}
      <mesh>
        <RoundedBox args={[2.5, 2.5, 0.3]} radius={0.3} smoothness={4}>
          <meshStandardMaterial
            color="#667eea"
            roughness={0.2}
            metalness={0.5}
          />
        </RoundedBox>
      </mesh>
      {/* Inner icon */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function HomeScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#667eea" />
        <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />

        {/* Background stars */}
        <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />

        {/* Central Logo */}
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
          <CentralLogo />
        </Float>

        {/* Floating Task Cards */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <FloatingTaskCard position={[-4, 2, -1]} delay={0} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <FloatingTaskCard position={[4, 2, -1]} delay={1} />
        </Float>
        <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.4}>
          <FloatingTaskCard position={[-4, -2, -1]} delay={2} />
        </Float>
        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.4}>
          <FloatingTaskCard position={[4, -2, -1]} delay={3} />
        </Float>

        {/* Floating Charts */}
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
          <FloatingChart position={[-2, 3, -2]} delay={0.5} />
        </Float>
        <Float speed={1.7} rotationIntensity={0.15} floatIntensity={0.3}>
          <FloatingChart position={[2, -3, -2]} delay={1.5} />
        </Float>

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

