/**
 * Animation Generator
 * 生成各种SDS操作的动画步骤序列
 */

import { SDSState, SDSOperation, OperationParams } from '@/types/sds';
import { AnimationStep } from '@/types/animation';
import { calculatePreAllocation } from './sdsOperations';

let stepIdCounter = 0;

function generateStepId(): string {
  return `step-${Date.now()}-${stepIdCounter++}`;
}

/**
 * 生成sdsnew操作的动画步骤
 */
export function generateSdsnewAnimation(
  params: OperationParams,
  resultState: SDSState
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  
  // 阶段1: 类型确定
  steps.push({
    id: generateStepId(),
    type: 'calculation',
    target: 'header',
    duration: 800,
    phase: '类型确定',
    description: `根据字符串长度 ${resultState.len} 确定SDS类型为 ${resultState.type}`,
    data: {
      formula: 'determineSdsType(length)',
      values: { length: resultState.len },
      result: resultState.type,
    },
  });
  
  // 阶段2: 内存分配
  steps.push({
    id: generateStepId(),
    type: 'allocation',
    target: 'buffer',
    duration: 1000,
    phase: '内存分配',
    description: `分配 ${resultState.alloc + 1} 字节内存空间（${resultState.alloc}字符 + 1终止符）`,
    data: {
      oldSize: 0,
      newSize: resultState.alloc + 1,
      strategy: 'direct',
      reason: '初始分配',
    },
  });
  
  // 阶段3: 数据复制
  steps.push({
    id: generateStepId(),
    type: 'copy',
    target: 'buffer',
    duration: 800,
    phase: '数据填充',
    description: '将字符逐个复制到缓冲区',
    data: {
      sourceIndices: [],
      targetIndices: Array.from({ length: resultState.len }, (_, i) => i),
      data: resultState.originalString.split(''),
    },
  });
  
  // 阶段4: 头部更新
  steps.push({
    id: generateStepId(),
    type: 'update',
    target: 'len',
    duration: 400,
    phase: '结构更新',
    description: `设置len字段为 ${resultState.len}`,
    data: { oldValue: 0, newValue: resultState.len },
  });
  
  steps.push({
    id: generateStepId(),
    type: 'update',
    target: 'alloc',
    duration: 400,
    phase: '结构更新',
    description: `设置alloc字段为 ${resultState.alloc}`,
    data: { oldValue: 0, newValue: resultState.alloc },
  });
  
  // 阶段5: 添加终止符
  steps.push({
    id: generateStepId(),
    type: 'highlight',
    target: `buf[${resultState.len}]`,
    duration: 500,
    phase: '完成',
    description: '添加字符串终止符 \\0',
    data: { color: 'terminator' },
  });
  
  return steps;
}

/**
 * 生成sdscat操作的动画步骤
 */
export function generateSdscatAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const appendStr = params.concatString || '';
  const needsReallocation = currentState.alloc < resultState.len;
  
  // 阶段1: 空间检查
  steps.push({
    id: generateStepId(),
    type: 'highlight',
    target: 'len',
    duration: 300,
    phase: '空间检查',
    description: `当前已使用: ${currentState.len} 字节`,
    data: { color: 'highlight' },
  });
  
  steps.push({
    id: generateStepId(),
    type: 'highlight',
    target: 'alloc',
    duration: 300,
    phase: '空间检查',
    description: `当前已分配: ${currentState.alloc} 字节`,
    data: { color: 'highlight' },
  });
  
  steps.push({
    id: generateStepId(),
    type: 'calculation',
    target: 'header',
    duration: 600,
    phase: '空间检查',
    description: `需要空间: ${currentState.len} + ${appendStr.length} = ${resultState.len}`,
    data: {
      formula: 'currentLen + appendLen',
      values: { currentLen: currentState.len, appendLen: appendStr.length },
      result: resultState.len,
      needsReallocation,
    },
  });
  
  // 阶段2: 内存重新分配（如果需要）
  if (needsReallocation) {
    const newAlloc = calculatePreAllocation(currentState.len, appendStr.length);
    
    steps.push({
      id: generateStepId(),
      type: 'calculation',
      target: 'alloc',
      duration: 800,
      phase: '空间预分配',
      description: `预分配策略: (${currentState.len} + ${appendStr.length}) × 2 = ${newAlloc}`,
      data: {
        formula: '(currentLen + appendLen) × 2',
        values: { currentLen: currentState.len, appendLen: appendStr.length },
        result: newAlloc,
        explanation: 'Redis采用翻倍策略减少内存分配次数',
      },
    });
    
    steps.push({
      id: generateStepId(),
      type: 'allocation',
      target: 'buffer',
      duration: 1000,
      phase: '空间预分配',
      description: `重新分配 ${resultState.alloc + 1} 字节内存`,
      data: {
        oldSize: currentState.alloc + 1,
        newSize: resultState.alloc + 1,
        strategy: 'double',
        reason: '空间不足，需要扩展',
      },
    });
    
    steps.push({
      id: generateStepId(),
      type: 'copy',
      target: 'buffer',
      duration: 600,
      phase: '数据迁移',
      description: '将原有数据复制到新缓冲区',
      data: {
        sourceIndices: Array.from({ length: currentState.len }, (_, i) => i),
        targetIndices: Array.from({ length: currentState.len }, (_, i) => i),
        data: currentState.originalString.split(''),
      },
    });
  }
  
  // 阶段3: 数据拼接
  const appendChars = appendStr.split('');
  appendChars.forEach((char, index) => {
    steps.push({
      id: generateStepId(),
      type: 'copy',
      target: `buf[${currentState.len + index}]`,
      duration: 200,
      phase: '数据拼接',
      description: `添加字符 '${char}' 到位置 ${currentState.len + index}`,
      data: {
        sourceIndices: [],
        targetIndices: [currentState.len + index],
        data: [char],
      },
    });
  });
  
  // 阶段4: 更新头部
  steps.push({
    id: generateStepId(),
    type: 'update',
    target: 'len',
    duration: 400,
    phase: '更新状态',
    description: `更新len: ${currentState.len} → ${resultState.len}`,
    data: { oldValue: currentState.len, newValue: resultState.len },
  });
  
  if (needsReallocation) {
    steps.push({
      id: generateStepId(),
      type: 'update',
      target: 'alloc',
      duration: 400,
      phase: '更新状态',
      description: `更新alloc: ${currentState.alloc} → ${resultState.alloc}`,
      data: { oldValue: currentState.alloc, newValue: resultState.alloc },
    });
  }
  
  // 阶段5: 终止符
  steps.push({
    id: generateStepId(),
    type: 'update',
    target: `buf[${resultState.len}]`,
    duration: 300,
    phase: '完成',
    description: '更新终止符位置',
    data: { char: '\\0', color: 'terminator' },
  });
  
  return steps;
}

/**
 * 生成sdsrange操作的动画步骤
 */
export function generateSdsrangeAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const start = params.startIndex || 0;
  const end = params.endIndex || 0;
  
  // 阶段1: 参数验证
  steps.push({
    id: generateStepId(),
    type: 'highlight',
    target: 'buffer',
    duration: 600,
    phase: '参数验证',
    description: `选中范围: [${start}, ${end}]`,
    data: {
      highlightIndices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      color: 'highlight',
    },
  });
  
  steps.push({
    id: generateStepId(),
    type: 'calculation',
    target: 'header',
    duration: 400,
    phase: '参数验证',
    description: `新长度: ${end} - ${start} + 1 = ${resultState.len}`,
    data: {
      formula: 'end - start + 1',
      values: { start, end },
      result: resultState.len,
    },
  });
  
  // 阶段2: 数据移动
  for (let i = 0; i < resultState.len; i++) {
    steps.push({
      id: generateStepId(),
      type: 'move',
      target: `buf[${start + i}]`,
      duration: 300,
      phase: '数据移动',
      description: `移动字符 '${currentState.buf[start + i]}' 从位置${start + i}到位置${i}`,
      data: {
        from: { x: start + i, y: 0 },
        to: { x: i, y: 0 },
        char: currentState.buf[start + i],
      },
    });
  }
  
  // 阶段3: 更新头部
  steps.push({
    id: generateStepId(),
    type: 'update',
    target: 'len',
    duration: 400,
    phase: '更新状态',
    description: `更新len: ${currentState.len} → ${resultState.len}`,
    data: { oldValue: currentState.len, newValue: resultState.len },
  });
  
  steps.push({
    id: generateStepId(),
    type: 'highlight',
    target: `buf[${resultState.len}]`,
    duration: 300,
    phase: '完成',
    description: '添加新的终止符',
    data: { color: 'terminator' },
  });
  
  return steps;
}

/**
 * 根据操作类型生成动画步骤
 */
export function generateAnimationSteps(
  operation: SDSOperation,
  currentState: SDSState | null,
  params: OperationParams,
  resultState: SDSState
): AnimationStep[] {
  switch (operation) {
    case 'sdsnew':
    case 'sdsempty':
      return generateSdsnewAnimation(params, resultState);
      
    case 'sdscat':
      return currentState ? generateSdscatAnimation(currentState, params, resultState) : [];
      
    case 'sdsrange':
      return currentState ? generateSdsrangeAnimation(currentState, params, resultState) : [];
      
    // 其他操作的动画生成逻辑可以类似实现
    default:
      return [{
        id: generateStepId(),
        type: 'text',
        target: 'info',
        duration: 1000,
        description: `执行操作: ${operation}`,
        data: {},
      }];
  }
}
