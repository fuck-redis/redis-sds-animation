/**
 * 3D SDS Header Component
 * 渲染 len, alloc, flags 字段
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';

interface HeaderFieldProps {
  name: string;
  value: string | number;
  position: [number, number, number];
  isActive: boolean;
}

function HeaderField({ name, value, position, isActive }: HeaderFieldProps) {
  const meshRef = useRef<Mesh>(null);
  const targetScale = isActive ? 1.05 : 1;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* 字段背景 */}
      <mesh ref={meshRef}>
        <RoundedBox args={[1.8, 0.8, 0.5]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={isActive ? '#DCFCE7' : '#FFFFFF'}
            emissive={isActive ? '#16A34A' : '#000000'}
            emissiveIntensity={isActive ? 0.2 : 0}
            metalness={0.05}
            roughness={0.5}
          />
        </RoundedBox>
      </mesh>

      {/* 字段名称 */}
      <Text
        position={[0, 0.15, 0.26]}
        fontSize={0.18}
        color="#64748B"
        anchorX="left"
        anchorY="middle"
      >
        {name}
      </Text>

      {/* 字段值 */}
      <Text
        position={[0, -0.15, 0.26]}
        fontSize={0.35}
        color="#0F172A"
        anchorX="left"
        anchorY="middle"
        font="/fonts/SpaceMono-Bold.ttf"
      >
        {String(value)}
      </Text>

      {/* 激活时的边框 */}
      {isActive && (
        <mesh position={[0, 0, 0]}>
          <RoundedBox args={[1.85, 0.85, 0.52]} radius={0.12} smoothness={4}>
            <meshBasicMaterial color="#16A34A" transparent opacity={0.3} />
          </RoundedBox>
        </mesh>
      )}
    </group>
  );
}

interface SDS3DHeaderProps {
  len: number;
  alloc: number;
  flags: string;
  activeField: 'len' | 'alloc' | 'flags' | null;
  position?: [number, number, number];
}

export function SDS3DHeader({
  len,
  alloc,
  flags,
  activeField,
  position = [0, 0, 0],
}: SDS3DHeaderProps) {
  const fieldSpacing = 2.2;

  return (
    <group position={position}>
      <HeaderField
        name="len"
        value={len}
        position={[-fieldSpacing, 0, 0]}
        isActive={activeField === 'len'}
      />
      <HeaderField
        name="alloc"
        value={alloc}
        position={[0, 0, 0]}
        isActive={activeField === 'alloc'}
      />
      <HeaderField
        name="flags"
        value={flags}
        position={[fieldSpacing, 0, 0]}
        isActive={activeField === 'flags'}
      />
    </group>
  );
}
