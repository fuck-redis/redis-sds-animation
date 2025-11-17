/**
 * Application Constants
 */

// 颜色常量
export const COLORS = {
  USED: '#4CAF50',        // 已使用内存
  FREE: '#E0E0E0',        // 空闲内存
  TERMINATOR: '#F44336',  // 终止符
  NEW_DATA: '#2196F3',    // 新数据
  HIGHLIGHT: '#FFC107',   // 高亮
  SUCCESS: '#4CAF50',     // 成功
  ERROR: '#F44336',       // 错误
  WARNING: '#FF9800',     // 警告
  INFO: '#2196F3',        // 信息
} as const;

// 动画时长常量（毫秒）
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 500,
  SLOW: 1000,
  VERY_SLOW: 2000,
} as const;

// 响应式断点
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

// 应用配置
export const APP_CONFIG = {
  MAX_STRING_LENGTH: 1024 * 1024, // 1MB
  MAX_HISTORY_ITEMS: 50,
  NOTIFICATION_DURATION: 3000,
  AUTO_SAVE_INTERVAL: 30000,
} as const;

// 快捷键
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ', // 空格
  NEXT_STEP: 'ArrowRight',
  PREV_STEP: 'ArrowLeft',
  STOP: 'Escape',
  SPEED_UP: '+',
  SPEED_DOWN: '-',
} as const;

// GitHub仓库链接（可自定义）
export const GITHUB_URL = 'https://github.com/cc11001100/redis-sds-animation';

// 文档链接
export const DOCS_URL = 'https://redis.io/docs/data-types/strings/';
