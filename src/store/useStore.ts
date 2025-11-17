/**
 * Global State Management using Zustand
 */

import { create } from 'zustand';
import { SDSState, SDSOperation, OperationParams } from '@/types/sds';
import { AnimationState, AnimationStep } from '@/types/animation';
import { UIState, NotificationType, Notification } from '@/types/ui';
import { ComparisonState } from '@/types/comparison';

interface AppState {
  // SDS状态
  sdsState: SDSState | null;
  previousSdsState: SDSState | null;
  
  // 动画状态
  animationState: AnimationState;
  
  // UI状态
  uiState: UIState;
  
  // 对比状态
  comparisonState: ComparisonState;
  
  // Actions
  setSdsState: (state: SDSState) => void;
  setCurrentOperation: (operation: SDSOperation | null) => void;
  setOperationParams: (params: OperationParams) => void;
  setAnimationSteps: (steps: AnimationStep[]) => void;
  playAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  stopAnimation: () => void;
  setAnimationStep: (step: number) => void;
  setAnimationSpeed: (speed: number) => void;
  addNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  togglePanel: () => void;
  resetSds: () => void;
}

export const useStore = create<AppState>((set) => ({
  // 初始状态
  sdsState: null,
  previousSdsState: null,
  
  animationState: {
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    speed: 2, // 默认1x速度
    steps: [],
  },
  
  uiState: {
    theme: 'light',
    viewMode: 'normal',
    activeTab: 'operations',
    currentOperation: null,
    operationParams: {},
    isPanelExpanded: true,
    isInfoPanelVisible: true,
    isMobileMenuOpen: false,
    notifications: [],
  },
  
  comparisonState: {
    isComparing: false,
    currentScenario: null,
    results: null,
    selectedScenarioId: null,
  },
  
  // Actions实现
  setSdsState: (state) =>
    set((prev) => ({
      previousSdsState: prev.sdsState,
      sdsState: state,
    })),
  
  setCurrentOperation: (operation) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        currentOperation: operation,
        operationParams: {}, // 切换操作时重置参数
      },
    })),
  
  setOperationParams: (params) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        operationParams: params,
      },
    })),
  
  setAnimationSteps: (steps) =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        steps,
        totalSteps: steps.length,
        currentStep: 0,
      },
    })),
  
  playAnimation: () =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        isPlaying: true,
        isPaused: false,
      },
    })),
  
  pauseAnimation: () =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        isPlaying: false,
        isPaused: true,
      },
    })),
  
  resumeAnimation: () =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        isPlaying: true,
        isPaused: false,
      },
    })),
  
  stopAnimation: () =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
      },
    })),
  
  setAnimationStep: (step) =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        currentStep: Math.max(0, Math.min(step, state.animationState.totalSteps - 1)),
      },
    })),
  
  setAnimationSpeed: (speed) =>
    set((state) => ({
      animationState: {
        ...state.animationState,
        speed: Math.max(1, Math.min(speed, 5)),
      },
    })),
  
  addNotification: (type, title, message, duration = 3000) =>
    set((state) => {
      const notification: Notification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        type,
        title,
        message,
        duration,
        timestamp: Date.now(),
      };
      return {
        uiState: {
          ...state.uiState,
          notifications: [...state.uiState.notifications, notification],
        },
      };
    }),
  
  removeNotification: (id) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        notifications: state.uiState.notifications.filter((n) => n.id !== id),
      },
    })),
  
  setActiveTab: (tab) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        activeTab: tab,
      },
    })),
  
  togglePanel: () =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        isPanelExpanded: !state.uiState.isPanelExpanded,
      },
    })),
  
  resetSds: () =>
    set(() => ({
      sdsState: null,
      previousSdsState: null,
      animationState: {
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        totalSteps: 0,
        speed: 2,
        steps: [],
      },
    })),
}));
