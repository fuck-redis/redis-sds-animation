/**
 * Comparison Analysis Type Definitions
 * SDS vs C String performance comparison
 */

// 性能指标
export interface PerformanceMetrics {
  allocationCount: number;      // 内存分配次数
  totalBytesCopied: number;     // 总复制字节数
  estimatedTime: number;        // 估算耗时（ms）
  memoryEfficiency: number;     // 内存效率（0-1）
  peakMemoryUsage: number;      // 峰值内存使用（bytes）
}

// 对比操作
export interface ComparisonOperation {
  type: 'concat' | 'copy' | 'length' | 'range';
  data: string | number;
  timestamp: number;
}

// 对比场景
export interface ComparisonScenario {
  id: string;
  name: string;
  description: string;
  operations: ComparisonOperation[];
  initialString: string;
}

// 对比结果
export interface ComparisonResult {
  scenario: ComparisonScenario;
  sdsMetrics: PerformanceMetrics;
  cStringMetrics: PerformanceMetrics;
  speedup: number;              // SDS相对于C字符串的加速比
  memoryOverhead: number;       // SDS的内存开销（百分比）
  conclusions: string[];        // 结论说明
}

// 对比状态
export interface ComparisonState {
  isComparing: boolean;
  currentScenario: ComparisonScenario | null;
  results: ComparisonResult | null;
  selectedScenarioId: string | null;
}

// 预定义对比场景
export const COMPARISON_SCENARIOS: ComparisonScenario[] = [
  {
    id: 'concat-performance',
    name: '连续拼接性能测试',
    description: '连续执行10次字符串拼接操作，对比内存分配次数和复制开销',
    initialString: 'Hello',
    operations: [
      { type: 'concat', data: ' World', timestamp: 0 },
      { type: 'concat', data: '!', timestamp: 100 },
      { type: 'concat', data: ' Redis', timestamp: 200 },
      { type: 'concat', data: ' SDS', timestamp: 300 },
      { type: 'concat', data: ' is', timestamp: 400 },
      { type: 'concat', data: ' awesome', timestamp: 500 },
      { type: 'concat', data: ' and', timestamp: 600 },
      { type: 'concat', data: ' efficient', timestamp: 700 },
      { type: 'concat', data: ' for', timestamp: 800 },
      { type: 'concat', data: ' strings', timestamp: 900 },
    ],
  },
  {
    id: 'length-query',
    name: '长度查询性能',
    description: '频繁查询字符串长度，对比O(1)和O(n)的差异',
    initialString: 'Redis Simple Dynamic String',
    operations: Array(20).fill(null).map((_, i) => ({
      type: 'length' as const,
      data: 0,
      timestamp: i * 50,
    })),
  },
  {
    id: 'mixed-operations',
    name: '混合操作场景',
    description: '混合执行拼接、截取等操作',
    initialString: 'Start',
    operations: [
      { type: 'concat', data: ' Middle', timestamp: 0 },
      { type: 'concat', data: ' End', timestamp: 100 },
      { type: 'range', data: 5, timestamp: 200 },
      { type: 'concat', data: ' Again', timestamp: 300 },
    ],
  },
];

// C字符串模拟状态
export interface CStringState {
  buffer: string[];
  capacity: number;
  length: number; // 需要通过遍历计算
}

// 对比可视化配置
export interface ComparisonVisualConfig {
  showSideBySide: boolean;
  highlightDifferences: boolean;
  showMetricsInRealtime: boolean;
  animationSync: boolean;
}
