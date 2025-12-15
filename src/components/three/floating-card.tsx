'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// Card dimensions as constants for easy adjustment
const CARD_WIDTH = 2.5;
const CARD_HEIGHT = 1.5;
const CARD_DEPTH = 0.1;
const CARD_RADIUS = 0.1;

interface FloatingCardProps {
  position: [number, number, number];
  title: string;
  value: string;
  change: number;
  color?: string;
}

export function FloatingCard({
  position,
  title,
  value,
  change,
  color = '#667eea',
}: FloatingCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  // Memoize animation parameters to avoid recalculation
  const animationOffset = useMemo(() => position[0], [position]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;
    // Gentle floating animation
    meshRef.current.position.y = initialY + Math.sin(elapsed * 0.5 + animationOffset) * 0.1;
    // Subtle rotation
    meshRef.current.rotation.y = Math.sin(elapsed * 0.3) * 0.05;
  });

  // Memoize derived values
  const changeColor = change >= 0 ? '#22c55e' : '#ef4444';
  const changeSymbol = change >= 0 ? '▲' : '▼';
  const changeText = `${changeSymbol} ${Math.abs(change).toFixed(1)}%`;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        {/* Card background */}
        <RoundedBox args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} radius={CARD_RADIUS} smoothness={4}>
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.95}
            roughness={0.1}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Title label */}
        <Text
          position={[0, 0.4, 0.06]}
          fontSize={0.15}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>

        {/* Main value */}
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.35}
          color={color}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {value}
        </Text>

        {/* Change indicator */}
        <Text
          position={[0, -0.45, 0.06]}
          fontSize={0.12}
          color={changeColor}
          anchorX="center"
          anchorY="middle"
        >
          {changeText}
        </Text>

        {/* Accent bar */}
        <mesh position={[0, -0.7, 0.05]}>
          <boxGeometry args={[2.3, 0.05, 0.02]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </mesh>
    </group>
  );
}
