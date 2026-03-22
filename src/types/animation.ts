/**
 * Animation System Type Definitions
 */

export type SupportedLanguage = 'java' | 'python' | 'go' | 'javascript';

// 动画步骤类型
export type AnimationStepType =
  | 'highlight'
  | 'move'
  | 'transform'
  | 'text'
  | 'calculation'
  | 'comparison'
  | 'allocation'
  | 'copy'
  | 'update';

export interface DataFlowArrow {
  fromTarget: string;
  toTarget: string;
  label: string;
  color?: string;
}

export interface CanvasAnnotation {
  target: string;
  text: string;
  tone?: 'info' | 'success' | 'warning';
}

export interface StepDebugInfo {
  codeLines?: Partial<Record<SupportedLanguage, number[]>>;
  variables?: Record<string, string | number | boolean | null>;
  variableLines?: Partial<Record<SupportedLanguage, Record<string, number>>>;
}

// 过渡配置类型
export interface TransitionConfig {
  type: 'spring' | 'tween' | 'custom';
  // Spring config
  stiffness?: number;
  damping?: number;
  mass?: number;
  // Tween config
  ease?: string | number[];
  duration?: number;
  // For layout animations
  layout?: boolean;
}

// 动画步骤接口
export interface AnimationStep {
  id: string;
  type: AnimationStepType;
  target: string;
  duration: number;
  description: string;
  data?: Record<string, unknown>;
  delay?: number;
  phase?: string;
  debug?: StepDebugInfo;
  visual?: {
    arrows?: DataFlowArrow[];
    annotations?: CanvasAnnotation[];
  };
  // 过渡配置
  transition?: TransitionConfig;
  // 值变化插值数据
  interpolation?: {
    from?: Record<string, number | string>;
    to?: Record<string, number | string>;
  };
}

// 动画播放状态
export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  steps: AnimationStep[];
  currentPhase?: string;
}

// 动画速度配置
export const ANIMATION_SPEEDS: Record<number, { label: string; multiplier: number }> = {
  1: { label: '0.5x', multiplier: 2 },
  2: { label: '1x', multiplier: 1 },
  3: { label: '1.5x', multiplier: 0.67 },
  4: { label: '2x', multiplier: 0.5 },
  5: { label: '3x', multiplier: 0.33 },
};

export interface HighlightStyle {
  backgroundColor?: string;
  borderColor?: string;
  scale?: number;
  glow?: boolean;
}

export interface MoveConfig {
  from: { x: number; y: number };
  to: { x: number; y: number };
  path?: 'linear' | 'curved';
  showTrail?: boolean;
}

export interface CalculationDisplay {
  formula: string;
  values: Record<string, unknown>;
  result: unknown;
  explanation?: string;
}

export interface AllocationVisual {
  oldSize: number;
  newSize: number;
  strategy: 'direct' | 'double' | 'custom';
  reason: string;
}

export interface CopyVisual {
  sourceIndices: number[];
  targetIndices: number[];
  data: string[];
}
