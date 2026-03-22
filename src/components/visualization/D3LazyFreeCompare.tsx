/**
 * D3LazyFreeCompare.tsx
 * 惰性回收 vs 立即回收 对比可视化组件
 * 使用 D3.js 展示两种回收策略的对比
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3LazyFreeCompareProps {
  /** 初始字符串长度 */
  initialLen?: number;
  /** 裁剪后的长度 */
  trimmedLen?: number;
  /** 是否显示动画 */
  animated?: boolean;
}

export function D3LazyFreeCompare({
  initialLen = 20,
  trimmedLen = 10,
  animated = true,
}: D3LazyFreeCompareProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const width = container.clientWidth;
    const height = 320;
    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const allocWidth = 180;
    const barHeight = 40;
    const gap = 30;

    // 左侧：惰性回收
    const leftX = innerWidth * 0.25 - allocWidth / 2;

    g.append('text')
      .attr('x', leftX + allocWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#22C55E')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text('惰性回收 (SDS)');

    // 初始状态 - 惰性
    g.append('text')
      .attr('x', leftX + allocWidth / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text(`初始: len=${initialLen}`);

    const lazyAllocBar = g.append('g')
      .attr('transform', `translate(${leftX}, 35)`);

    lazyAllocBar.append('rect')
      .attr('width', allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#E2E8F0')
      .attr('rx', 4);

    lazyAllocBar.append('rect')
      .attr('width', (initialLen / 32) * allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#22C55E')
      .attr('rx', 4)
      .attr('opacity', animated ? 0 : 1);

    lazyAllocBar.append('text')
      .attr('x', allocWidth / 2)
      .attr('y', barHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(`alloc=${initialLen}`);

    // 裁剪后 - 惰性
    const lazyTrimmedY = 35 + barHeight + gap;

    g.append('text')
      .attr('x', leftX + allocWidth / 2)
      .attr('y', lazyTrimmedY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text(`sdstrim: len=${trimmedLen}`);

    const lazyTrimmedBar = g.append('g')
      .attr('transform', `translate(${leftX}, lazyTrimmedY)`);

    lazyTrimmedBar.append('rect')
      .attr('width', allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#E2E8F0')
      .attr('rx', 4);

    // len 区域
    lazyTrimmedBar.append('rect')
      .attr('width', (trimmedLen / 32) * allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#22C55E')
      .attr('rx', 4)
      .attr('opacity', animated ? 0 : 1);

    // free 区域
    lazyTrimmedBar.append('rect')
      .attr('x', (trimmedLen / 32) * allocWidth)
      .attr('width', ((initialLen - trimmedLen) / 32) * allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#FACC15')
      .attr('rx', animated ? 0 : 4)
      .attr('opacity', animated ? 0 : 1);

    lazyTrimmedBar.append('text')
      .attr('x', allocWidth / 2)
      .attr('y', barHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(`len=${trimmedLen}`);

    // free 标签
    lazyTrimmedBar.append('text')
      .attr('x', ((trimmedLen + (initialLen - trimmedLen) / 2) / 32) * allocWidth)
      .attr('y', barHeight + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FACC15')
      .attr('font-size', '10px')
      .text('free 保留');

    // 右侧：立即回收
    const rightX = innerWidth * 0.75 - allocWidth / 2;

    g.append('text')
      .attr('x', rightX + allocWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#DC2626')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text('立即回收 (C String)');

    g.append('text')
      .attr('x', rightX + allocWidth / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text(`初始: len=${initialLen}`);

    const immediateAllocBar = g.append('g')
      .attr('transform', `translate(${rightX}, 35)`);

    immediateAllocBar.append('rect')
      .attr('width', allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#E2E8F0')
      .attr('rx', 4);

    immediateAllocBar.append('rect')
      .attr('width', (initialLen / 32) * allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#DC2626')
      .attr('rx', 4)
      .attr('opacity', animated ? 0 : 1);

    immediateAllocBar.append('text')
      .attr('x', allocWidth / 2)
      .attr('y', barHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(`alloc=${initialLen}`);

    // 裁剪后 - 立即回收
    const immediateTrimmedY = 35 + barHeight + gap;

    g.append('text')
      .attr('x', rightX + allocWidth / 2)
      .attr('y', immediateTrimmedY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '12px')
      .text(`trim: len=${trimmedLen}`);

    const immediateTrimmedBar = g.append('g')
      .attr('transform', `translate(${rightX}, immediateTrimmedY)`);

    immediateTrimmedBar.append('rect')
      .attr('width', allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#E2E8F0')
      .attr('rx', 4);

    immediateTrimmedBar.append('rect')
      .attr('width', (trimmedLen / 32) * allocWidth)
      .attr('height', barHeight)
      .attr('fill', '#DC2626')
      .attr('rx', 4)
      .attr('opacity', animated ? 0 : 1);

    immediateTrimmedBar.append('text')
      .attr('x', allocWidth / 2)
      .attr('y', barHeight / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(`alloc=${trimmedLen}`);

    immediateTrimmedBar.append('text')
      .attr('x', allocWidth + 10)
      .attr('y', barHeight / 2 + 5)
      .attr('fill', '#DC2626')
      .attr('font-size', '10px')
      .text('需重新分配!');

    // 动画效果
    if (animated) {
      // 惰性回收动画
      g.selectAll('rect').transition()
        .duration(800)
        .delay((_, i) => i * 150)
        .attr('opacity', 1);
    }

    // 底部说明
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '11px')
      .text('点击上方区域切换动画状态');

  }, [initialLen, trimmedLen, animated, currentStep]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="w-full cursor-pointer" onClick={() => setCurrentStep(s => s + 1)} />
      <div className="flex justify-center gap-8 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded" />
          <span>len (已使用)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded" />
          <span>free (惰性保留)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>立即释放</span>
        </div>
      </div>
    </div>
  );
}
