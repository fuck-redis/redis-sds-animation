/**
 * Allocation Animation Component
 * 新单元格出现时的入场动画
 */

import { motion } from 'framer-motion';
import { CELL_WIDTH, CELL_HEIGHT } from './AnimatedElements';

interface AllocationAnimationProps {
  oldSize: number;
  newSize: number;
  startX: number;
  startY: number;
  cellsPerRow: number;
  onComplete?: () => void;
}

export function AllocationAnimation({
  oldSize,
  newSize,
  startX,
  startY,
  cellsPerRow,
  onComplete,
}: AllocationAnimationProps) {
  const newCells = Array.from({ length: newSize - oldSize }, (_, i) => oldSize + i);

  const getCellPosition = (index: number) => {
    const col = index % cellsPerRow;
    const row = Math.floor(index / cellsPerRow);
    return {
      x: startX + col * (CELL_WIDTH + 14),
      y: startY + row * (CELL_HEIGHT + 32),
    };
  };

  return (
    <motion.g onAnimationComplete={onComplete}>
      {newCells.map((index, i) => {
        const pos = getCellPosition(index);

        return (
          <motion.g
            key={`alloc-${index}`}
            initial={{ opacity: 0, scale: 0, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              delay: i * 0.08,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            {/* 新单元格高亮边框 */}
            <motion.rect
              x={pos.x - 4}
              y={pos.y - 4}
              width={CELL_WIDTH + 8}
              height={CELL_HEIGHT + 8}
              rx={12}
              fill="none"
              stroke="#D97706"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: i * 0.08 + 0.1,
                duration: 0.3,
              }}
              className="new-cell-highlight"
            />

            {/* 单元格背景 */}
            <motion.rect
              x={pos.x}
              y={pos.y}
              width={CELL_WIDTH}
              height={CELL_HEIGHT}
              rx={8}
              fill="#FEF3C7"
              stroke="#D97706"
              strokeWidth={2}
            />

            {/* NEW 标签 */}
            <motion.text
              x={pos.x + CELL_WIDTH / 2}
              y={pos.y - 8}
              textAnchor="middle"
              fontSize={10}
              fill="#D97706"
              fontWeight={600}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.2 }}
            >
              NEW
            </motion.text>

            {/* 索引 */}
            <text x={pos.x + CELL_WIDTH / 2} y={pos.y + CELL_HEIGHT / 2 + 5} textAnchor="middle" fontSize={10} fill="#64748B">
              {index}
            </text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}
