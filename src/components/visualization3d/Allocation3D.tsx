/**
 * 3D Allocation Animation Component
 * 新单元格出现时的 3D 入场动画
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Allocation3DCellProps {
  index: number;
  position: [number, number, number];
  delay?: number;
}

export function Allocation3DCell({
  index,
  position,
  delay = 0,
}: Allocation3DCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - startTime.current - delay;
    if (elapsed < 0) return;

    // 入场动画：缩放从 0 到 1
    const progress = Math.min(elapsed * 2, 1);
    const scale = easeOutBack(progress);
    meshRef.current.scale.set(scale, scale, scale);

    // 透明度动画
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    if (material.opacity !== undefined) {
      material.opacity = progress;
    }
  });

  return (
    <group position={position}>
      {/* 新单元格主体 */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.5, 0.4]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#D97706"
          emissiveIntensity={0.3}
          transparent
          opacity={0}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* NEW 标签 */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.15}
        color="#D97706"
        anchorX="center"
        anchorY="middle"
      >
        NEW
      </Text>

      {/* 索引 */}
      <Text
        position={[0, 0, 0.21]}
        fontSize={0.2}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
      >
        {index}
      </Text>
    </group>
  );
}

interface Allocation3DProps {
  indices: number[];
  startPosition: [number, number, number];
  cellSpacing?: number;
}

export function Allocation3D({
  indices,
  startPosition,
  cellSpacing = 1.0,
}: Allocation3DProps) {
  return (
    <group>
      {indices.map((index, i) => (
        <Allocation3DCell
          key={`alloc-${index}`}
          index={index}
          position={[
            startPosition[0] + i * cellSpacing,
            startPosition[1],
            startPosition[2],
          ]}
          delay={i * 0.1}
        />
      ))}
    </group>
  );
}

// 弹性缓动函数
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
