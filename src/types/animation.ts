/**
 * Animation System Type Definitions
 */

// 动画步骤类型
export type AnimationStepType =
  | 'highlight'    // 高亮元素
  | 'move'         // 移动元素
  | 'transform'    // 变换（缩放、旋转等）
  | 'text'         // 文本变化
  | 'calculation'  // 计算过程展示
  | 'comparison'   // 比较展示
  | 'allocation'   // 内存分配
  | 'copy'         // 数据复制
  | 'update';      // 更新字段值

// 动画步骤接口
export interface AnimationStep {
  id: string;                    // 唯一标识
  type: AnimationStepType;       // 步骤类型
  target: string;                // 目标元素标识（如：'len', 'buf[0]', 'header'）
  duration: number;              // 持续时间（毫秒）
  description: string;           // 步骤描述（用于展示）
  data?: Record<string, any>;   // 动画特定数据
  delay?: number;                // 延迟开始时间（毫秒）
  phase?: string;                // 所属阶段（如：'检查空间', '数据拼接'）
}

// 动画播放状态
export interface AnimationState {
  isPlaying: boolean;           // 是否正在播放
  isPaused: boolean;            // 是否暂停
  currentStep: number;          // 当前步骤索引
  totalSteps: number;           // 总步骤数
  speed: number;                // 播放速度（1-5）
  steps: AnimationStep[];       // 所有动画步骤
  currentPhase?: string;        // 当前阶段
}

// 动画速度配置
export const ANIMATION_SPEEDS: Record<number, { label: string; multiplier: number }> = {
  1: { label: '0.5x', multiplier: 2 },
  2: { label: '1x', multiplier: 1 },
  3: { label: '1.5x', multiplier: 0.67 },
  4: { label: '2x', multiplier: 0.5 },
  5: { label: '3x', multiplier: 0.33 },
};

// 高亮样式配置
export interface HighlightStyle {
  backgroundColor?: string;
  borderColor?: string;
  scale?: number;
  glow?: boolean;
}

// 移动动画配置
export interface MoveConfig {
  from: { x: number; y: number };
  to: { x: number; y: number };
  path?: 'linear' | 'curved';
  showTrail?: boolean;
}

// 计算步骤展示
export interface CalculationDisplay {
  formula: string;              // 计算公式
  values: Record<string, any>;  // 变量值
  result: any;                  // 计算结果
  explanation?: string;         // 说明
}

// 内存分配可视化
export interface AllocationVisual {
  oldSize: number;
  newSize: number;
  strategy: 'direct' | 'double' | 'custom';
  reason: string;
}

// 数据复制可视化
export interface CopyVisual {
  sourceIndices: number[];
  targetIndices: number[];
  data: string[];
}
