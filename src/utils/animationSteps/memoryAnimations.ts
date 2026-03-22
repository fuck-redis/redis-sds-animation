import { SDSState, OperationParams } from '@/types/sds';
import { AnimationStep } from '@/types/animation';
import { step } from './shared';

export function generateSdsMakeRoomForAnimation(
  currentState: SDSState,
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  const extra = params.extraBytes ?? 0;
  const required = currentState.len + extra;
  const expand = required > currentState.alloc;

  const steps: AnimationStep[] = [
    step({
      type: 'calculation',
      target: 'alloc',
      duration: 480,
      phase: '计算需求',
      description: `required = len(${currentState.len}) + extra(${extra}) = ${required}`,
      lines: [2, 3],
      vars: { required, alloc: currentState.alloc },
      varLines: { required: 2, alloc: 3 },
    }),
  ];

  if (!expand) {
    steps.push(
      step({
        type: 'highlight',
        target: 'alloc',
        duration: 400,
        phase: '容量足够',
        description: '无需扩容，直接返回',
        lines: [4],
        vars: { spare: currentState.alloc - currentState.len },
        varLines: { spare: 4 },
        visual: {
          annotations: [{ target: 'alloc', text: '已有空闲空间', tone: 'success' }],
        },
      }),
    );
    return steps;
  }

  steps.push(
    step({
      type: 'allocation',
      target: 'alloc',
      duration: 700,
      phase: '执行扩容',
      description: `按预分配策略扩容到 ${resultState.alloc}`,
      lines: [5, 6, 7],
      vars: { newAlloc: resultState.alloc },
      varLines: { newAlloc: 6 },
      visual: {
        arrows: [{ fromTarget: 'alloc', toTarget: 'buffer', label: 'realloc', color: '#0284C7' }],
      },
    }),
    step({
      type: 'copy',
      target: 'buffer',
      duration: 650,
      phase: '数据保留',
      description: '复制原有数据并保留终止符',
      lines: [8, 9],
      vars: { copiedBytes: currentState.len + 1 },
      varLines: { copiedBytes: 8 },
      visual: {
        annotations: [{ target: 'buffer', text: '字符串内容不变', tone: 'info' }],
      },
    }),
    step({
      type: 'update',
      target: 'header',
      duration: 360,
      phase: '更新元信息',
      description: `alloc 更新为 ${resultState.alloc}，len 保持 ${resultState.len}`,
      lines: [10],
      vars: { len: resultState.len, alloc: resultState.alloc },
      varLines: { alloc: 10 },
    }),
  );

  return steps;
}

export function generateSdsRemoveFreeSpaceAnimation(
  currentState: SDSState,
  resultState: SDSState,
): AnimationStep[] {
  const noFree = currentState.len === currentState.alloc;

  if (noFree) {
    return [
      step({
        type: 'highlight',
        target: 'alloc',
        duration: 400,
        phase: '检查空闲区',
        description: 'alloc 与 len 相同，无可回收空间',
        lines: [2],
        vars: { len: currentState.len, alloc: currentState.alloc },
        varLines: { len: 2, alloc: 2 },
        visual: {
          annotations: [{ target: 'alloc', text: 'already tight', tone: 'info' }],
        },
      }),
    ];
  }

  return [
    step({
      type: 'calculation',
      target: 'alloc',
      duration: 520,
      phase: '确定目标容量',
      description: `newAlloc = len = ${resultState.len}`,
      lines: [3, 4],
      vars: { oldAlloc: currentState.alloc, newAlloc: resultState.alloc },
      varLines: { oldAlloc: 3, newAlloc: 3 },
    }),
    step({
      type: 'copy',
      target: 'buffer',
      duration: 700,
      phase: '压缩拷贝',
      description: '仅保留有效内容和终止符',
      lines: [5, 6, 7],
      vars: { copiedBytes: resultState.len + 1 },
      varLines: { copiedBytes: 6 },
      visual: {
        arrows: [{ fromTarget: 'buffer', toTarget: 'buffer', label: 'compact', color: '#16A34A' }],
      },
    }),
    step({
      type: 'update',
      target: 'header',
      duration: 350,
      phase: '更新元信息',
      description: `alloc: ${currentState.alloc} -> ${resultState.alloc}`,
      lines: [8],
      vars: { alloc: resultState.alloc, freed: currentState.alloc - resultState.alloc },
      varLines: { alloc: 8, freed: 8 },
      visual: {
        annotations: [{ target: 'alloc', text: '回收空闲区', tone: 'success' }],
      },
    }),
  ];
}
