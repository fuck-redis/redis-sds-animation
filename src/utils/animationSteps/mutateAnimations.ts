import { SDSState, OperationParams } from '@/types/sds';
import { AnimationStep } from '@/types/animation';
import { calculatePreAllocation } from '@/utils/sdsOperations';
import { step } from './shared';

export function generateSdscatAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  const appendStr = params.concatString || '';
  const needsReallocation = currentState.alloc < resultState.len;
  const preAlloc = needsReallocation
    ? calculatePreAllocation(currentState.len, appendStr.length)
    : currentState.alloc;

  const steps: AnimationStep[] = [
    step({
      type: 'calculation',
      target: 'len',
      duration: 500,
      phase: '容量检查',
      description: `newLen = ${currentState.len} + ${appendStr.length} = ${resultState.len}`,
      lines: [2],
      vars: { oldLen: currentState.len, appendLen: appendStr.length, newLen: resultState.len },
      varLines: { oldLen: 2, appendLen: 2, newLen: 2 },
      visual: {
        arrows: [{ fromTarget: 'len', toTarget: 'alloc', label: '检查空间', color: '#0EA5E9' }],
      },
    }),
  ];

  if (needsReallocation) {
    steps.push(
      step({
        type: 'calculation',
        target: 'alloc',
        duration: 700,
        phase: '预分配',
        description: `空间不足，按策略扩容到 ${preAlloc}`,
        lines: [5, 6, 7],
        vars: { oldAlloc: currentState.alloc, newAlloc: preAlloc },
        varLines: { oldAlloc: 3, newAlloc: 6 },
        visual: {
          annotations: [{ target: 'alloc', text: '扩容触发', tone: 'warning' }],
        },
      }),
      step({
        type: 'copy',
        target: 'buffer',
        duration: 700,
        phase: '数据迁移',
        description: '旧数据搬迁到新缓冲区',
        lines: [8, 9],
        vars: { copiedBytes: currentState.len },
        varLines: { copiedBytes: 8 },
        visual: {
          arrows: [{ fromTarget: 'buffer', toTarget: 'buffer', label: '迁移', color: '#2563EB' }],
        },
      }),
    );
  }

  appendStr.split('').forEach((char, index) => {
    steps.push(
      step({
        type: 'copy',
        target: `buf[${currentState.len + index}]`,
        duration: 180,
        phase: '追加字符',
        description: `写入 '${char}' 到 buf[${currentState.len + index}]`,
        lines: [10, 11, 12],
        vars: { index, target: currentState.len + index, char },
        varLines: { index: 10, target: 11 },
        visual: {
          arrows: [
            {
              fromTarget: 'buffer',
              toTarget: `buf[${currentState.len + index}]`,
              label: 'append',
              color: '#16A34A',
            },
          ],
        },
      }),
    );
  });

  steps.push(
    step({
      type: 'update',
      target: 'len',
      duration: 350,
      phase: '更新头部',
      description: `len: ${currentState.len} -> ${resultState.len}`,
      lines: [13],
      vars: { len: resultState.len },
      varLines: { len: 13 },
    }),
    step({
      type: 'update',
      target: 'alloc',
      duration: 350,
      phase: '更新头部',
      description: `alloc: ${currentState.alloc} -> ${resultState.alloc}`,
      lines: [14],
      vars: { alloc: resultState.alloc },
      varLines: { alloc: 14 },
      visual: needsReallocation
        ? {
            annotations: [{ target: 'alloc', text: '预留空闲空间', tone: 'info' }],
          }
        : undefined,
    }),
    step({
      type: 'highlight',
      target: `buf[${resultState.len}]`,
      duration: 300,
      phase: '收尾',
      description: '写入新的终止符',
      lines: [15, 16],
      vars: { terminatorIndex: resultState.len },
      varLines: { terminatorIndex: 15 },
      visual: {
        annotations: [{ target: `buf[${resultState.len}]`, text: '\\0', tone: 'warning' }],
      },
    }),
  );

  return steps;
}

export function generateSdscpyAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  const copyStr = params.copyString || '';
  const needsReallocation = copyStr.length > currentState.alloc;

  return [
    step({
      type: 'calculation',
      target: 'len',
      duration: 500,
      phase: '计算新长度',
      description: `newLen = ${copyStr.length}`,
      lines: [2, 3],
      vars: { oldLen: currentState.len, newLen: copyStr.length },
      varLines: { newLen: 2 },
    }),
    step({
      type: needsReallocation ? 'allocation' : 'highlight',
      target: 'alloc',
      duration: 650,
      phase: '容量策略',
      description: needsReallocation
        ? `空间不足，扩容到 ${resultState.alloc}`
        : '复用现有缓冲区，无需扩容',
      lines: needsReallocation ? [5, 6, 7] : [4],
      vars: { oldAlloc: currentState.alloc, newAlloc: resultState.alloc },
      varLines: { oldAlloc: 3, newAlloc: 6 },
      visual: {
        annotations: [{ target: 'alloc', text: needsReallocation ? '新建缓冲区' : '原地覆盖', tone: 'info' }],
      },
    }),
    step({
      type: 'copy',
      target: 'buffer',
      duration: 900,
      phase: '覆盖写入',
      description: '将新字符串逐字符覆盖到 buf 开头',
      lines: [8, 9],
      vars: { source: copyStr, copiedChars: resultState.len },
      varLines: { copiedChars: 8 },
      visual: {
        arrows: [{ fromTarget: 'buffer', toTarget: 'buffer', label: 'overwrite', color: '#16A34A' }],
      },
    }),
    step({
      type: 'update',
      target: `buf[${resultState.len}]`,
      duration: 350,
      phase: '收尾',
      description: '写入终止符并更新头部',
      lines: [10, 11],
      vars: { len: resultState.len, alloc: resultState.alloc },
      varLines: { len: 11, alloc: 11 },
      visual: {
        annotations: [{ target: 'len', text: 'len 更新', tone: 'success' }],
      },
    }),
  ];
}

export function generateSdsrangeAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  const start = params.startIndex ?? 0;
  const end = params.endIndex ?? 0;

  const steps: AnimationStep[] = [
    step({
      type: 'calculation',
      target: 'header',
      duration: 550,
      phase: '区间归一化',
      description: `validRange=[${start}, ${end}] => newLen=${resultState.len}`,
      lines: [2, 3, 4, 5],
      vars: { start, end, newLen: resultState.len },
      varLines: { start: 2, end: 3, newLen: 5 },
      visual: {
        annotations: [{ target: 'buffer', text: '只保留选中区间', tone: 'info' }],
      },
    }),
  ];

  for (let i = 0; i < resultState.len; i++) {
    steps.push(
      step({
        type: 'move',
        target: `buf[${start + i}]`,
        duration: 260,
        phase: '数据前移',
        description: `buf[${start + i}] -> buf[${i}]`,
        lines: [7, 8, 9],
        vars: { from: start + i, to: i, char: currentState.buf[start + i] },
        varLines: { from: 8, to: 8 },
        visual: {
          arrows: [{ fromTarget: `buf[${start + i}]`, toTarget: `buf[${i}]`, label: 'move', color: '#0EA5E9' }],
        },
      }),
    );
  }

  steps.push(
    step({
      type: 'update',
      target: 'len',
      duration: 380,
      phase: '更新元信息',
      description: `len: ${currentState.len} -> ${resultState.len}`,
      lines: [10, 11],
      vars: { len: resultState.len },
      varLines: { len: 11 },
    }),
    step({
      type: 'highlight',
      target: `buf[${resultState.len}]`,
      duration: 320,
      phase: '收尾',
      description: '写入新的终止符',
      lines: [10],
      vars: { terminatorIndex: resultState.len },
      varLines: { terminatorIndex: 10 },
      visual: {
        annotations: [{ target: `buf[${resultState.len}]`, text: '\\0', tone: 'warning' }],
      },
    }),
  );

  return steps;
}

export function generateSdstrimAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  const trimChars = params.trimChars || '';
  const start = currentState.originalString.length - resultState.originalString.length;

  return [
    step({
      type: 'calculation',
      target: 'buffer',
      duration: 500,
      phase: '构建裁剪集合',
      description: `trimSet = {${trimChars.split('').join(', ') || '∅'}}`,
      lines: [2],
      vars: { trimChars },
      varLines: { trimChars: 2 },
    }),
    step({
      type: 'move',
      target: 'buffer',
      duration: 700,
      phase: '双指针扫描',
      description: 'start/end 指针从两端向中间收缩',
      lines: [3, 4, 5, 6],
      vars: { start, end: start + resultState.len - 1 },
      varLines: { start: 3, end: 3 },
      visual: {
        arrows: [
          { fromTarget: 'buf[0]', toTarget: `buf[${Math.max(0, start)}]`, label: 'start++', color: '#16A34A' },
          {
            fromTarget: `buf[${Math.max(0, currentState.len - 1)}]`,
            toTarget: `buf[${Math.max(0, start + resultState.len - 1)}]`,
            label: 'end--',
            color: '#EA580C',
          },
        ],
      },
    }),
    step({
      type: 'update',
      target: 'len',
      duration: 450,
      phase: '裁剪完成',
      description: '复用 sdsrange 完成区间保留',
      lines: [7, 8],
      vars: { newLen: resultState.len, result: resultState.originalString },
      varLines: { newLen: 8 },
      visual: {
        annotations: [{ target: 'len', text: 'trim -> range', tone: 'success' }],
      },
    }),
  ];
}
