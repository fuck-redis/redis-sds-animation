/**
 * SDS Structure Visualization Component
 * 展示SDS的完整结构：头部信息和缓冲区
 */

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { SDSState } from '@/types/sds';
import { useStore } from '@/store/useStore';

interface SDSStructureProps {
  sds: SDSState;
}

// 字段提示信息
const FIELD_TOOLTIPS = {
  len: '已使用的字符串长度（不包括终止符）。Redis可以在O(1)时间复杂度内获取字符串长度，无需像C字符串那样遍历整个字符串。',
  alloc: '已分配的总容量（不包括头部和终止符）。当字符串长度增长时，Redis会预分配额外的空间以减少内存重新分配的次数。',
  flags: 'SDS类型标识，用于优化不同长度字符串的内存使用。Redis根据字符串长度选择不同的头部结构（TYPE_5/8/16/32/64），以节省内存空间。'
};

export function SDSStructure({ sds }: SDSStructureProps) {
  const { animationState } = useStore();
  const currentStep = animationState.steps[animationState.currentStep];
  
  // 检查当前动画步骤是否高亮某个字段
  const isHighlighted = (target: string) => {
    return currentStep?.target === target && currentStep?.type === 'highlight';
  };
  
  // 检查是否正在更新某个字段
  const isUpdating = (target: string) => {
    return currentStep?.target === target && currentStep?.type === 'update';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 头部信息 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">SDS Header</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* len 字段 */}
          <motion.div
            className={`border-2 rounded-lg p-4 text-center transition-all relative ${
              isHighlighted('len') || isUpdating('len')
                ? 'border-yellow-400 bg-yellow-50 shadow-lg scale-105'
                : 'border-gray-300 bg-gray-50'
            }`}
            animate={isUpdating('len') ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1 group relative">
              <span>len</span>
              <HelpCircle size={14} className="text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                <div className="relative">
                  {FIELD_TOOLTIPS.len}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{sds.len}</div>
            <div className="text-xs text-gray-500 mt-1">已使用长度</div>
          </motion.div>
          
          {/* alloc 字段 */}
          <motion.div
            className={`border-2 rounded-lg p-4 text-center transition-all relative ${
              isHighlighted('alloc') || isUpdating('alloc')
                ? 'border-yellow-400 bg-yellow-50 shadow-lg scale-105'
                : 'border-gray-300 bg-gray-50'
            }`}
            animate={isUpdating('alloc') ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1 group relative">
              <span>alloc</span>
              <HelpCircle size={14} className="text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                <div className="relative">
                  {FIELD_TOOLTIPS.alloc}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{sds.alloc}</div>
            <div className="text-xs text-gray-500 mt-1">已分配容量</div>
          </motion.div>
          
          {/* flags 字段 */}
          <motion.div
            className={`border-2 rounded-lg p-4 text-center transition-all relative ${
              isHighlighted('flags')
                ? 'border-yellow-400 bg-yellow-50 shadow-lg scale-105'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1 group relative">
              <span>flags</span>
              <HelpCircle size={14} className="text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                <div className="relative">
                  {FIELD_TOOLTIPS.flags}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-800">{sds.type}</div>
            <div className="text-xs text-gray-500 mt-1">SDS类型</div>
          </motion.div>
        </div>
      </div>
      
      {/* 缓冲区可视化 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Buffer - {sds.alloc + 1} bytes allocated
        </h3>
        <div className="relative">
          {/* 索引标尺 */}
          <div className="flex mb-1">
            {sds.buf.map((_, index) => (
              <div
                key={`index-${index}`}
                className="flex-1 text-center text-xs text-gray-400 font-mono"
                style={{ minWidth: '40px', maxWidth: '60px' }}
              >
                {index}
              </div>
            ))}
          </div>
          
          {/* 字符块 */}
          <div className="flex gap-1">
            {sds.buf.map((char, index) => {
              const isUsed = index < sds.len;
              const isTerminator = index === sds.len && char === '\0';
              const isFree = index > sds.len;
              const isHighlightedCell = currentStep?.target === `buf[${index}]`;
              
              let bgColor = 'bg-gray-100';
              if (isTerminator) bgColor = 'bg-red-100';
              else if (isUsed) bgColor = 'bg-green-100';
              else if (isFree) bgColor = 'bg-gray-50';
              
              if (isHighlightedCell) bgColor = 'bg-yellow-200';
              
              return (
                <motion.div
                  key={`char-${index}`}
                  className={`flex-1 border-2 rounded p-2 text-center font-mono text-sm ${bgColor}`}
                  style={{
                    minWidth: '40px',
                    maxWidth: '60px',
                    borderColor: isHighlightedCell ? '#FFC107' : isTerminator ? '#F44336' : '#E0E0E0',
                  }}
                  animate={isHighlightedCell ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-semibold">
                    {char === '\0' ? '\\0' : char || '\u00A0'}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* 区域标注 */}
          <div className="flex mt-2 gap-1">
            <div className="flex-1" style={{ width: `${(sds.len / sds.buf.length) * 100}%` }}>
              <div className="text-xs text-center text-green-600 font-medium">Used ({sds.len})</div>
            </div>
            <div className="flex-1" style={{ width: `${((sds.alloc - sds.len) / sds.buf.length) * 100}%` }}>
              <div className="text-xs text-center text-gray-500 font-medium">
                Free ({sds.alloc - sds.len})
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">内存效率:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {sds.alloc > 0 ? ((sds.len / sds.alloc) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">剩余空间:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {sds.alloc - sds.len} bytes
            </span>
          </div>
          <div>
            <span className="text-gray-600">总内存:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {sds.alloc + 1} bytes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
