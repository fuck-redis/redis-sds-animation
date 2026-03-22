/**
 * Application Constants
 */

export const COLORS = {
  USED: '#16A34A',
  FREE: '#CBD5E1',
  TERMINATOR: '#DC2626',
  NEW_DATA: '#0284C7',
  HIGHLIGHT: '#F59E0B',
  SUCCESS: '#16A34A',
  ERROR: '#DC2626',
  WARNING: '#D97706',
  INFO: '#0284C7',
} as const;

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 500,
  SLOW: 1000,
  VERY_SLOW: 2000,
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

export const APP_CONFIG = {
  MAX_STRING_LENGTH: 1024 * 1024,
  MAX_HISTORY_ITEMS: 50,
  NOTIFICATION_DURATION: 3000,
  AUTO_SAVE_INTERVAL: 30000,
} as const;

export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ',
  NEXT_STEP: 'ArrowRight',
  PREV_STEP: 'ArrowLeft',
  RESET: 'r',
} as const;

export const GITHUB_URL = 'https://github.com/fuck-redis/redis-sds-animation';
export const DOCS_URL = 'https://redis.io/docs/latest/operate/oss_and_stack/reference/internals/internals-sds/';
export const LEARNING_PATH_URL = 'https://fuck-algorithm.github.io/leetcode-hot-100/';
