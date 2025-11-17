/**
 * UI State Type Definitions
 */

import { SDSOperation, OperationParams } from './sds';

// UI主题
export type Theme = 'light' | 'dark' | 'auto';

// 视图模式
export type ViewMode = 'normal' | 'comparison' | 'documentation';

// 活动标签页
export type ActiveTab = 'operations' | 'comparison' | 'documentation' | 'settings';

// UI状态接口
export interface UIState {
  theme: Theme;
  viewMode: ViewMode;
  activeTab: ActiveTab;
  currentOperation: SDSOperation | null;
  operationParams: OperationParams;
  isPanelExpanded: boolean;
  isInfoPanelVisible: boolean;
  isMobileMenuOpen: boolean;
  notifications: Notification[];
}

// 通知类型
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// 通知接口
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // 自动关闭时间（ms），undefined表示不自动关闭
  timestamp: number;
}

// 操作历史记录
export interface OperationHistoryItem {
  id: string;
  operation: SDSOperation;
  params: OperationParams;
  timestamp: number;
  stateBefore: any; // 操作前的SDS状态快照
  stateAfter: any;  // 操作后的SDS状态快照
}

// 用户偏好设置
export interface UserPreferences {
  animationSpeed: number;
  showDetailedSteps: boolean;
  autoPlayAnimations: boolean;
  highlightChanges: boolean;
  enableSoundEffects: boolean;
  keyboardShortcuts: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
}

// 帮助文档条目
export interface DocumentationEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  examples?: CodeExample[];
  relatedOperations?: SDSOperation[];
}

// 代码示例
export interface CodeExample {
  language: 'c' | 'pseudo';
  code: string;
  explanation: string;
}

// 工具提示配置
export interface TooltipConfig {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
}

// 模态框状态
export interface ModalState {
  isOpen: boolean;
  type: 'operation-details' | 'settings' | 'help' | 'about' | null;
  data?: any;
}
