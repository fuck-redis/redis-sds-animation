/**
 * 3D SDS Buffer Cell Component
 * 使用 Three.js 渲染 3D 单元格
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface SDS3DCellProps {
  index: number;
  position: [number, number, number];
  char: string;
  isUsed: boolean;
  isTerminator: boolean;
  isActive: boolean;
}

export function SDS3DCell({
  index,
  position,
  char,
  isUsed,
  isTerminator,
  isActive,
}: SDS3DCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // 颜色配置
  const usedColor = '#4CAF50';
  const freeColor = '#E0E0E0';
  const terminatorColor = '#F44336';
  const activeColor = '#FFC107';

  const baseColor = isTerminator ? terminatorColor : isUsed ? usedColor : freeColor;
  const emissiveIntensity = isActive ? 0.5 : hovered ? 0.2 : 0;

  // 悬停和激活时的动画
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered || isActive ? 1.1 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* 单元格主体 */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.5, 0.4]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={isActive ? activeColor : '#000000'}
          emissiveIntensity={emissiveIntensity}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* 索引标签 */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.2}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
      >
        {index}
      </Text>

      {/* 字符 */}
      <Text
        position={[0, 0, 0.21]}
        fontSize={0.25}
        color="#0F172A"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceMono-Regular.ttf"
      >
        {char === '\0' ? '\\0' : char || '·'}
      </Text>

      {/* 激活时的边框发光 */}
      {isActive && (
        <mesh>
          <boxGeometry args={[0.85, 0.55, 0.45]} />
          <meshBasicMaterial color={activeColor} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
