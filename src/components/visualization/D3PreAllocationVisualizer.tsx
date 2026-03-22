/**
 * D3PreAllocationVisualizer.tsx
 * 预分配策略可视化组件
 * 使用 D3.js 展示 SDS 内存预分配策略
 * 支持动态演示扩容过程、显示阈值点（1MB）
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { SDSState } from '@/types/sds';

interface D3PreAllocationVisualizerProps {
  /** 扩容前的 SDS 状态 */
  oldSds?: SDSState;
  /** 扩容后的 SDS 状态 */
  newSds?: SDSState;
  /** 是否显示动画 */
  animated?: boolean;
  /** 扩容原因 */
  reason?: string;
  /** 动画播放状态 */
  playState?: 'idle' | 'expanding' | 'completed';
  /** 播放进度回调 */
  onProgressChange?: (progress: number) => void;
}

// 阈值常量
const ONE_MB = 1024 * 1024; // 1MB 阈值

export function D3PreAllocationVisualizer({
  oldSds,
  newSds,
  animated = true,
  reason = '字符串拼接',
  playState = 'idle',
}: D3PreAllocationVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  // 计算预分配大小
  const calculateNewAllocation = useCallback((currentLen: number, neededLen: number): number => {
    const newLen = neededLen;
    // 规则1: 新长度小于 1MB 时，倍增策略
    if (newLen < ONE_MB) {
      return Math.max(newLen, currentLen * 2);
    }
    // 规则2: 新长度大于等于 1MB 时，每次增加 1MB
    return newLen + ONE_MB;
  }, []);

  // 格式化字节大小
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 渲染可视化
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    // 清除现有内容
    svg.selectAll('*').remove();

    // 获取容器尺寸
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 设置 SVG 尺寸
    svg.attr('width', width).attr('height', height);

    // 布局参数
    const margin = { top: 40, right: 40, bottom: 80, left: 40 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // 创建主 group
    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 默认值
    const defaultOldLen = 100;
    const defaultOldAlloc = 200;
    const defaultNewLen = 350;

    const oldLen = oldSds?.len ?? defaultOldLen;
    const oldAlloc = oldSds?.alloc ?? defaultOldAlloc;
    const newLen = newSds?.len ?? defaultNewLen;
    const newAlloc = newSds?.alloc ?? calculateNewAllocation(oldLen, newLen);

    // 计算比例尺
    const maxAlloc = Math.max(oldAlloc, newAlloc, ONE_MB * 1.5);
    const xScale = d3.scaleLinear().domain([0, maxAlloc]).range([0, contentWidth]);
    const barHeight = 40;
    const barGap = 80;

    // 绘制标题
    mainGroup
      .append('text')
      .attr('x', contentWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .attr('fill', '#334155')
      .text('SDS 预分配策略可视化');

    // 绘制副标题
    mainGroup
      .append('text')
      .attr('x', contentWidth / 2)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#64748B')
      .text(`原因: ${reason}`);

    // ========== 1MB 阈值线 ==========
    const thresholdGroup = mainGroup.append('g').attr('class', 'threshold-group');

    // 阈值标记
    thresholdGroup
      .append('line')
      .attr('x1', xScale(ONE_MB))
      .attr('y1', 30)
      .attr('x2', xScale(ONE_MB))
      .attr('y2', contentHeight - 20)
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    thresholdGroup
      .append('text')
      .attr('x', xScale(ONE_MB))
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('font-weight', 600)
      .attr('fill', '#EF4444')
      .text('1MB 阈值');

    thresholdGroup
      .append('text')
      .attr('x', xScale(ONE_MB))
      .attr('y', contentHeight - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', '#EF4444')
      .text(`${formatBytes(ONE_MB)}`);

    // ========== 扩容前条形图 ==========
    const oldGroup = mainGroup.append('g').attr('class', 'old-allocation');

    // 扩容前标签
    oldGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 40)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', '#334155')
      .text('扩容前');

    // 已使用部分（深色）
    oldGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 50)
      .attr('width', animated ? 0 : xScale(oldLen))
      .attr('height', barHeight)
      .attr('rx', 4)
      .attr('fill', '#22C55E')
      .style('transition', animated ? 'width 0.8s ease-out' : 'none')
      .transition()
      .duration(animated ? 800 : 0)
      .attr('width', xScale(oldLen));

    // 已分配但未使用部分（浅色）
    oldGroup
      .append('rect')
      .attr('x', xScale(oldLen))
      .attr('y', 50)
      .attr('width', xScale(oldAlloc - oldLen))
      .attr('height', barHeight)
      .attr('rx', 0)
      .attr('fill', '#86EFAC');

    // 右边框（如果 alloc > len）
    if (oldAlloc > oldLen) {
      oldGroup
        .append('rect')
        .attr('x', xScale(oldAlloc) - 4)
        .attr('y', 50)
        .attr('width', 4)
        .attr('height', barHeight)
        .attr('fill', '#22C55E')
        .attr('rx', 2);
    }

    // 扩容前数值标签
    oldGroup
      .append('text')
      .attr('x', 5)
      .attr('y', 75)
      .attr('font-size', 10)
      .attr('fill', '#FFFFFF')
      .attr('font-weight', 600)
      .text(`已用: ${oldLen}`);

    // 扩容前总分配标签
    oldGroup
      .append('text')
      .attr('x', xScale(oldAlloc) - 5)
      .attr('y', 75)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', '#0F172A')
      .text(`分配: ${oldAlloc}`);

    // ========== 箭头指示 ==========
    if (playState !== 'idle') {
      const arrowGroup = mainGroup.append('g').attr('class', 'arrow-group');

      const arrowY = 50 + barHeight / 2;

      arrowGroup
        .append('path')
        .attr(
          'd',
          `M ${xScale(oldAlloc) + 20} ${arrowY} L ${xScale(newAlloc) - 20} ${arrowY}`
        )
        .attr('fill', 'none')
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

      arrowGroup
        .append('text')
        .attr('x', (xScale(oldAlloc) + xScale(newAlloc)) / 2)
        .attr('y', arrowY - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#3B82F6')
        .text('预分配');

      // 箭头标记
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', '#3B82F6');
    }

    // ========== 扩容后条形图 ==========
    const newGroup = mainGroup.append('g').attr('class', 'new-allocation');

    // 扩容后标签
    newGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 50 + barGap + 40)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', '#334155')
      .text('扩容后');

    // 已使用部分
    newGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 50 + barGap + 50)
      .attr('width', animated ? 0 : xScale(newLen))
      .attr('height', barHeight)
      .attr('rx', 4)
      .attr('fill', '#3B82F6')
      .style('transition', animated ? 'width 0.8s ease-out' : 'none')
      .attr('width', xScale(newLen));

    // 预分配部分
    newGroup
      .append('rect')
      .attr('x', xScale(newLen))
      .attr('y', 50 + barGap + 50)
      .attr('width', xScale(newAlloc - newLen))
      .attr('height', barHeight)
      .attr('rx', 0)
      .attr('fill', '#93C5FD');

    // 右边框
    newGroup
      .append('rect')
      .attr('x', xScale(newAlloc) - 4)
      .attr('y', 50 + barGap + 50)
      .attr('width', 4)
      .attr('height', barHeight)
      .attr('fill', '#3B82F6')
      .attr('rx', 2);

    // 扩容后数值标签
    newGroup
      .append('text')
      .attr('x', 5)
      .attr('y', 50 + barGap + 75)
      .attr('font-size', 10)
      .attr('fill', '#FFFFFF')
      .attr('font-weight', 600)
      .text(`已用: ${newLen}`);

    // 扩容后总分配标签
    newGroup
      .append('text')
      .attr('x', xScale(newAlloc) - 5)
      .attr('y', 50 + barGap + 75)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', '#0F172A')
      .text(`分配: ${newAlloc}`);

    // ========== 分配增长信息 ==========
    const growthGroup = mainGroup.append('g').attr('class', 'growth-info');

    const growthY = 50 + barGap * 2 + 50;

    // 增长量
    const growth = newAlloc - oldAlloc;
    const growthPercent = ((growth / oldAlloc) * 100).toFixed(1);

    growthGroup
      .append('rect')
      .attr('x', contentWidth / 2 - 120)
      .attr('y', growthY)
      .attr('width', 240)
      .attr('height', 60)
      .attr('rx', 8)
      .attr('fill', '#F8FAFC')
      .attr('stroke', '#E2E8F0');

    growthGroup
      .append('text')
      .attr('x', contentWidth / 2)
      .attr('y', growthY + 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text('扩容增长');

    growthGroup
      .append('text')
      .attr('x', contentWidth / 2)
      .attr('y', growthY + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .attr('fill', '#0F172A')
      .text(`+${formatBytes(growth)} (+${growthPercent}%)`);

    // ========== 分配策略说明 ==========
    const strategyGroup = mainGroup.append('g').attr('class', 'strategy-info');

    const strategyY = growthY + 80;

    strategyGroup
      .append('text')
      .attr('x', contentWidth / 2)
      .attr('y', strategyY)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text(newLen < ONE_MB ? '策略: 小于 1MB 时采用倍增策略' : '策略: 大于等于 1MB 时每次增加 1MB');

    // Hover 效果
    [oldGroup, newGroup].forEach((group, index) => {
      const data = index === 0 ? { len: oldLen, alloc: oldAlloc } : { len: newLen, alloc: newAlloc };

      group
        .selectAll('rect')
        .on('mouseover', function (event) {
          d3.select(this).attr('opacity', 0.8);
          const [x, y] = d3.pointer(event, container);
          setTooltip({
            visible: true,
            x,
            y,
            content: `已使用: ${data.len} bytes\n已分配: ${data.alloc} bytes\n空闲: ${data.alloc - data.len} bytes`,
          });
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1);
          setTooltip((prev) => ({ ...prev, visible: false }));
        });
    });
  }, [oldSds, newSds, animated, reason, playState, calculateNewAllocation]);

  return (
    <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">SDS 预分配策略图解</h3>

      <div ref={containerRef} className="relative w-full h-80 bg-slate-50 rounded-lg overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute z-10 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-pre-line"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y + 10,
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22C55E' }} />
          <span className="text-slate-600">已使用</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#86EFAC' }} />
          <span className="text-slate-600">空闲 (扩容前)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }} />
          <span className="text-slate-600">已使用</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#93C5FD' }} />
          <span className="text-slate-600">空闲 (扩容后)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-red-500" />
          <span className="text-slate-600">1MB 阈值</span>
        </div>
      </div>

      {/* 预分配规则说明 */}
      <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs">
        <div className="font-semibold text-slate-700 mb-1">预分配规则:</div>
        <ul className="text-slate-600 space-y-0.5">
          <li>• 新长度 &lt; 1MB: 采用倍增策略 (new_alloc = max(new_len, old_alloc * 2))</li>
          <li>• 新长度 &ge; 1MB: 每次增加 1MB (new_alloc = new_len + 1MB)</li>
        </ul>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        鼠标悬停在条形图上查看详细信息
      </p>
    </div>
  );
}
