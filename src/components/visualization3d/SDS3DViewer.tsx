/**
 * 3D SDS Viewer Component
 * 3D 可视化主组件
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { SDS3DHeader } from './SDS3DHeader';
import { SDS3DCell } from './SDS3DCell';
import { SDSState } from '@/types/sds';

interface SDS3DViewerProps {
  sds: SDSState;
  currentStepTarget?: string;
}

function SDS3DScene({ sds, currentStepTarget }: SDS3DViewerProps) {
  // 计算当前激活的字段
  const activeField = currentStepTarget === 'len'
    ? 'len'
    : currentStepTarget === 'alloc'
      ? 'alloc'
      : currentStepTarget === 'flags'
        ? 'flags'
        : null;

  // 单元格位置计算
  const getCellPosition = (index: number): [number, number, number] => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    return [
      -3.0 + col * 1.0,
      -1.5 - row * 0.7,
      0,
    ];
  };

  // 检查单元格是否被激活
  const isCellActive = (index: number): boolean => {
    return currentStepTarget === `buf[${index}]`;
  };

  return (
    <>
      {/* 灯光 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#16A34A" />

      {/* 环境 */}
      <Environment preset="studio" />

      {/* SDS Header */}
      <SDS3DHeader
        len={sds.len}
        alloc={sds.alloc}
        flags={sds.type}
        activeField={activeField}
        position={[0, 1.5, 0]}
      />

      {/* Buffer 标签 */}
      <group position={[-3.0, -0.8, 0]}>
        {/* 使用 Text 组件需要字体文件，暂时用简单的 mesh */}
      </group>

      {/* Buffer 单元格 */}
      {sds.buf.map((char, index) => {
        const pos = getCellPosition(index);
        const isUsed = index < sds.len;
        const isTerminator = index === sds.len && char === '\0';
        const isActive = isCellActive(index);

        return (
          <SDS3DCell
            key={`cell-${index}`}
            index={index}
            position={pos}
            char={char}
            isUsed={isUsed}
            isTerminator={isTerminator}
            isActive={isActive}
          />
        );
      })}

      {/* 阴影 */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={10}
      />

      {/* 控制器 */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        target={[0, -0.5, 0]}
      />
    </>
  );
}

export function SDS3DViewer({ sds, currentStepTarget }: SDS3DViewerProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg">
      <Canvas
        shadows
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <SDS3DScene sds={sds} currentStepTarget={currentStepTarget} />
      </Canvas>
    </div>
  );
}
