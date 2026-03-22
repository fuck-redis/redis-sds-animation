import { SDSState, OperationParams } from '@/types/sds';
import { AnimationStep } from '@/types/animation';
import { step } from './shared';

export function generateSdsnewAnimation(
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  const init = params.inputString ?? resultState.originalString ?? '';
  return [
    step({
      type: 'calculation',
      target: 'len',
      duration: 500,
      phase: '初始化',
      description: `读取输入字符串长度 len=${resultState.len}`,
      lines: [2],
      vars: { init, len: resultState.len },
      varLines: { len: 2 },
      visual: {
        annotations: [{ target: 'len', text: 'O(1) 长度字段写入', tone: 'info' }],
      },
    }),
    step({
      type: 'calculation',
      target: 'flags',
      duration: 700,
      phase: '类型选择',
      description: `根据长度选择类型 ${resultState.type}`,
      lines: [3],
      vars: { type: resultState.type },
      varLines: { type: 3 },
      visual: {
        annotations: [{ target: 'flags', text: '类型按长度自适应', tone: 'success' }],
      },
    }),
    step({
      type: 'allocation',
      target: 'alloc',
      duration: 800,
      phase: '分配内存',
      description: `分配 alloc=${resultState.alloc}，保留终止符位`,
      lines: [4],
      vars: { alloc: resultState.alloc },
      varLines: { alloc: 4 },
      visual: {
        arrows: [{ fromTarget: 'alloc', toTarget: 'buffer', label: 'alloc + 1', color: '#0891B2' }],
      },
    }),
    step({
      type: 'copy',
      target: 'buffer',
      duration: 900,
      phase: '写入字符',
      description: '逐字符写入 buf',
      lines: [5, 6, 7],
      vars: { source: init, copiedChars: resultState.len },
      varLines: { copiedChars: 6 },
      visual: {
        arrows: resultState.originalString.split('').slice(0, 6).map((_, index) => ({
          fromTarget: 'buffer',
          toTarget: `buf[${index}]`,
          label: `写入[${index}]`,
          color: '#16A34A',
        })),
      },
    }),
    step({
      type: 'update',
      target: `buf[${resultState.len}]`,
      duration: 400,
      phase: '收尾',
      description: '写入终止符 \\0，构造完成',
      lines: [8, 9],
      vars: { terminatorIndex: resultState.len },
      varLines: { terminatorIndex: 8 },
      visual: {
        annotations: [{ target: `buf[${resultState.len}]`, text: '\\0', tone: 'warning' }],
      },
    }),
  ];
}

export function generateSdsemptyAnimation(resultState: SDSState): AnimationStep[] {
  return [
    step({
      type: 'allocation',
      target: 'buffer',
      duration: 400,
      phase: '初始化',
      description: '构造空 SDS：len=0, alloc=0',
      lines: [1, 2, 3, 4],
      vars: { len: 0, alloc: 0, type: resultState.type },
      varLines: { len: 2, alloc: 3, type: 1 },
    }),
    step({
      type: 'update',
      target: 'buf[0]',
      duration: 300,
      phase: '收尾',
      description: '仅保留终止符 \\0',
      lines: [5, 6],
      vars: { terminatorIndex: 0 },
      varLines: { terminatorIndex: 5 },
      visual: {
        annotations: [{ target: 'buf[0]', text: 'empty', tone: 'info' }],
      },
    }),
  ];
}

export function generateSdsdupAnimation(currentState: SDSState, resultState: SDSState): AnimationStep[] {
  return [
    step({
      type: 'copy',
      target: 'buffer',
      duration: 700,
      phase: '复制缓冲区',
      description: '复制原缓冲区内容到新实例',
      lines: [2],
      vars: { sourceLength: currentState.buf.length, copiedLength: resultState.buf.length },
      varLines: { sourceLength: 2 },
      visual: {
        arrows: [
          { fromTarget: 'buffer', toTarget: 'buffer', label: 'copy()', color: '#0284C7' },
        ],
      },
    }),
    step({
      type: 'update',
      target: 'header',
      duration: 450,
      phase: '同步头部',
      description: '继承 type/len/alloc，返回独立对象',
      lines: [3, 4, 5, 6, 7],
      vars: { len: resultState.len, alloc: resultState.alloc },
      varLines: { len: 5, alloc: 6 },
      visual: {
        annotations: [{ target: 'header', text: '深拷贝完成', tone: 'success' }],
      },
    }),
  ];
}
