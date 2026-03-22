/**
 * Animated SVG Elements for SDS Visualization
 * 使用 framer-motion 实现的动画元素组件
 */

import { motion } from 'framer-motion';
import { DataFlowArrow } from '@/types/animation';

// 单元格尺寸常量
export const CELL_WIDTH = 62;
export const CELL_HEIGHT = 44;

interface HeaderBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  value: string | number;
  active: boolean;
  children?: React.ReactNode;
}

export function AnimatedHeaderBox({
  x,
  y,
  width,
  height,
  name,
  value,
  active,
  children,
}: HeaderBoxProps) {
  return (
    <motion.g
      animate={{
        scale: active ? 1.02 : 1,
        filter: active ? 'drop-shadow(0 0 8px rgba(22, 163, 74, 0.5))' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        fill={active ? '#DCFCE7' : '#FFFFFF'}
        stroke={active ? '#16A34A' : '#CBD5E1'}
        strokeWidth={active ? 2 : 1.5}
        animate={{
          fill: active ? '#DCFCE7' : '#FFFFFF',
          stroke: active ? '#16A34A' : '#CBD5E1',
          strokeWidth: active ? 2 : 1.5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <text x={x + 14} y={y + 24} fontSize={12} fill="#64748B">
        {name}
      </text>
      {/* 值变化时的缩放动画 */}
      <motion.text
        key={`${name}-${value}`}
        x={x + 14}
        y={y + 58}
        fontSize={24}
        fill="#0F172A"
        fontWeight={700}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {String(value)}
      </motion.text>
      {children}
    </motion.g>
  );
}

interface CellProps {
  index: number;
  x: number;
  y: number;
  char: string;
  isUsed: boolean;
  isTerminator: boolean;
  isActive: boolean;
  isNew?: boolean;
}

export function AnimatedCell({
  index,
  x,
  y,
  char,
  isUsed,
  isTerminator,
  isActive,
  isNew = false,
}: CellProps) {
  const fill = isTerminator ? '#FEE2E2' : isUsed ? '#DCFCE7' : '#F1F5F9';
  const stroke = isActive ? '#F59E0B' : isTerminator ? '#EF4444' : '#CBD5E1';

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      layout
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* 高亮时的发光效果 */}
      {isActive && (
        <motion.rect
          x={x - 4}
          y={y - 4}
          width={CELL_WIDTH + 8}
          height={CELL_HEIGHT + 8}
          rx={12}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      {/* 新单元格的高亮标记 */}
      {isNew && (
        <motion.rect
          x={x - 4}
          y={y - 4}
          width={CELL_WIDTH + 8}
          height={CELL_HEIGHT + 8}
          rx={12}
          fill="none"
          stroke="#D97706"
          strokeWidth={2}
          className="new-cell-highlight"
        />
      )}

      {/* 单元格背景 */}
      <motion.rect
        x={x}
        y={y}
        width={CELL_WIDTH}
        height={CELL_HEIGHT}
        rx={8}
        animate={{
          fill,
          stroke,
          strokeWidth: isActive ? 2.5 : 1.5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      {/* 索引标签 */}
      <text x={x + CELL_WIDTH / 2} y={y - 8} textAnchor="middle" fontSize={10} fill="#64748B">
        {index}
      </text>

      {/* 字符内容 */}
      <motion.text
        key={`char-${index}-${char}`}
        x={x + CELL_WIDTH / 2}
        y={y + 27}
        textAnchor="middle"
        fontSize={14}
        fill="#0F172A"
        fontFamily="monospace"
        fontWeight={600}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {char === '\0' ? '\\0' : char || '·'}
      </motion.text>
    </motion.g>
  );
}

interface ArrowProps {
  arrow: DataFlowArrow;
  index: number;
  getTargetCenter: (target: string) => { x: number; y: number };
}

export function AnimatedArrow({ arrow, index, getTargetCenter }: ArrowProps) {
  const from = getTargetCenter(arrow.fromTarget);
  const to = getTargetCenter(arrow.toTarget);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 12;
  const color = arrow.color || '#0F766E';

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* 动画绘制路径 */}
      <motion.path
        d={`M${from.x},${from.y} L${to.x},${to.y}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        markerEnd="url(#flow-arrow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: 'easeOut',
        }}
      />

      {/* 标签框 */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.3 + index * 0.1,
        }}
      >
        <rect
          x={midX - 32}
          y={midY - 10}
          width={64}
          height={20}
          rx={8}
          fill="white"
          stroke={color}
          strokeWidth={1}
        />
        <text x={midX} y={midY + 4} textAnchor="middle" fontSize={10} fill={color} fontWeight={600}>
          {arrow.label}
        </text>
      </motion.g>
    </motion.g>
  );
}

interface AnnotationProps {
  text: string;
  x: number;
  y: number;
  tone: 'info' | 'success' | 'warning';
  index: number;
}

export function AnimatedAnnotation({ text, x, y, tone, index }: AnnotationProps) {
  const toneConfig =
    tone === 'success'
      ? { bg: '#DCFCE7', stroke: '#16A34A', text: '#166534' }
      : tone === 'warning'
        ? { bg: '#FEF3C7', stroke: '#D97706', text: '#92400E' }
        : { bg: '#E0F2FE', stroke: '#0284C7', text: '#0C4A6E' };

  return (
    <motion.g
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
        delay: index * 0.1,
      }}
    >
      <rect
        x={x - 56}
        y={y}
        width={112}
        height={18}
        rx={8}
        fill={toneConfig.bg}
        stroke={toneConfig.stroke}
        strokeWidth={1}
      />
      <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={toneConfig.text}>
        {text}
      </text>
    </motion.g>
  );
}
