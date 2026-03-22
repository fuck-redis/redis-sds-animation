/**
 * Copy Animation Component
 * 字符复制飞行动画
 */

import { motion } from 'framer-motion';
import { CELL_WIDTH, CELL_HEIGHT } from './AnimatedElements';

interface CopyAnimationProps {
  sourceIndex: number;
  targetIndex: number;
  char: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  onComplete?: () => void;
}

export function CopyAnimation({
  sourceIndex: _sourceIndex,
  targetIndex: _targetIndex,
  char,
  sourceX,
  sourceY,
  targetX,
  targetY,
  onComplete,
}: CopyAnimationProps) {
  // 中心点
  const sourceCenterX = sourceX + CELL_WIDTH / 2;
  const sourceCenterY = sourceY + CELL_HEIGHT / 2;
  const targetCenterX = targetX + CELL_WIDTH / 2;
  const targetCenterY = targetY + CELL_HEIGHT / 2;

  return (
    <motion.g onAnimationComplete={onComplete}>
      {/* 源位置高亮 */}
      <motion.rect
        x={sourceX - 2}
        y={sourceY - 2}
        width={CELL_WIDTH + 4}
        height={CELL_HEIGHT + 4}
        rx={10}
        fill="none"
        stroke="#16A34A"
        strokeWidth={2}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* 飞行的字符 */}
      <motion.g
        initial={{
          x: sourceCenterX,
          y: sourceCenterY,
          opacity: 1,
        }}
        animate={{
          x: targetCenterX,
          y: targetCenterY,
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
          opacity: { times: [0, 0.7, 1] },
        }}
      >
        {/* 飞行中的字符框 */}
        <motion.rect
          x={-CELL_WIDTH / 2}
          y={-CELL_HEIGHT / 2}
          width={CELL_WIDTH}
          height={CELL_HEIGHT}
          rx={8}
          fill="#DCFCE7"
          stroke="#16A34A"
          strokeWidth={2}
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.2 }}
        />
        <text
          x={0}
          y={5}
          textAnchor="middle"
          fontSize={14}
          fill="#0F172A"
          fontFamily="monospace"
          fontWeight={600}
        >
          {char}
        </text>
      </motion.g>

      {/* 拖尾效果 */}
      <motion.line
        x1={sourceCenterX}
        y1={sourceCenterY}
        x2={targetCenterX}
        y2={targetCenterY}
        stroke="#16A34A"
        strokeWidth={2}
        strokeDasharray={4}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, ease: 'easeOut', opacity: { times: [0, 0.5, 1] } }}
      />

      {/* 目标位置高亮 */}
      <motion.rect
        x={targetX - 2}
        y={targetY - 2}
        width={CELL_WIDTH + 4}
        height={CELL_HEIGHT + 4}
        rx={10}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={2}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1, 1] }}
        transition={{ duration: 0.4, delay: 0.3, opacity: { times: [0, 0.2, 0.8, 1] }, scale: { times: [0, 0.2, 0.8, 1] } }}
      />
    </motion.g>
  );
}
