import { TransitionConfig } from '@/types/animation';

/**
 * 预定义的过渡配置库
 * 提供常用的动画过渡配置，可直接引用
 */
export const TRANSITIONS = {
  // 快速反馈的高亮效果
  highlight: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  // 平滑的值变化
  valueChange: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
  },
  // 布局动画（用于 resize）
  layout: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 20,
    layout: true,
  },
  // 淡入淡出效果
  fade: {
    type: 'tween' as const,
    ease: 'easeOut',
    duration: 0.3,
  },
  // 移动/复制动画
  move: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 22,
  },
  // 弹跳入场
  bounce: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 15,
  },
  // 快速缩放
  quickScale: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 25,
  },
  // 缓慢平滑
  slowSmooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
  },
} satisfies Record<string, TransitionConfig>;

/**
 * 获取指定类型的过渡配置
 */
export function getTransition(type: keyof typeof TRANSITIONS): TransitionConfig {
  return TRANSITIONS[type];
}
