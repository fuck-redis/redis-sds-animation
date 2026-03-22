/**
 * 3D Arrow Component
 * 用于 3D 场景中的箭头连接
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Arrow3DProps {
  from: [number, number, number];
  to: [number, number, number];
  label?: string;
  color?: string;
  animated?: boolean;
}

export function Arrow3D({
  from,
  to,
  label,
  color = '#0F766E',
  animated = false,
}: Arrow3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  // 计算中点和方向
  const midPoint = useMemo(() => {
    return [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.3,
      (from[2] + to[2]) / 2,
    ] as [number, number, number];
  }, [from, to]);

  const direction = useMemo(() => {
    const dir = new THREE.Vector3(
      to[0] - from[0],
      to[1] - from[1],
      to[2] - from[2]
    ).normalize();
    return dir;
  }, [from, to]);

  const length = useMemo(() => {
    return new THREE.Vector3(
      to[0] - from[0],
      to[1] - from[1],
      to[2] - from[2]
    ).length();
  }, [from, to]);

  // 动画
  useFrame((_, delta) => {
    if (animated && groupRef.current) {
      progressRef.current = (progressRef.current + delta * 0.5) % 1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 箭头主体 */}
      <arrowHelper
        args={[
          new THREE.Vector3(direction.x, direction.y, direction.z),
          new THREE.Vector3(from[0], from[1], from[2]),
          length * 0.8,
          color,
          0.2,
          0.1,
        ]}
      />

      {/* 标签 */}
      {label && (
        <group position={midPoint}>
          <mesh>
            <planeGeometry args={[0.8, 0.25]} />
            <meshBasicMaterial color="white" transparent opacity={0.9} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.15}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}
