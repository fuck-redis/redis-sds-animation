/**
 * D3SdscatOperation.tsx
 * sdscat 追加操作详细步骤动画
 * 展示追加操作的完整流程：检查空间 → 可能扩容 → 复制数据 → 更新元数据
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3SdscatOperationProps {
  /** 初始字符串 */
  initialString?: string;
  /** 追加字符串 */
  appendString?: string;
  /** 是否显示动画 */
  animated?: boolean;
}

export function D3SdscatOperation({
  initialString = 'Hello',
  appendString = ' World',
  animated = true,
}: D3SdscatOperationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const totalSteps = 4;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const width = container.clientWidth;
    const height = 400;
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, 40)`);

    const initialLen = initialString.length;
    const appendLen = appendString.length;
    const newLen = initialLen + appendLen;

    // 计算需要的空间
    const needExpand = newLen > initialLen + 2; // 假设初始 free=2

    // Step 0: 初始状态
    const step0Group = g.append('g').attr('class', 'step-0');
    step0Group.append('text')
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', '#0F172A')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('步骤 1: 检查空间');

    // 绘制初始 SDS
    const barY = 20;
    const charWidth = 40;
    const totalWidth = (initialLen + 3) * charWidth;

    // Header
    step0Group.append('rect')
      .attr('x', -totalWidth / 2)
      .attr('y', barY)
      .attr('width', 60)
      .attr('height', 35)
      .attr('fill', '#DCFCE7')
      .attr('stroke', '#16A34A')
      .attr('rx', 4);

    step0Group.append('text')
      .attr('x', -totalWidth / 2 + 30)
      .attr('y', barY + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', '#166534')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(`len=${initialLen}`);

    // Buffer
    for (let i = 0; i < initialLen + 2; i++) {
      const char = i < initialLen ? initialString[i] : (i === initialLen ? '\\0' : '·');
      const isUsed = i < initialLen;

      step0Group.append('rect')
        .attr('x', -totalWidth / 2 + 65 + i * charWidth)
        .attr('y', barY)
        .attr('width', charWidth - 4)
        .attr('height', 35)
        .attr('fill', isUsed ? '#22C55E' : '#E2E8F0')
        .attr('stroke', isUsed ? '#16A34A' : '#CBD5E1')
        .attr('rx', 4)
        .attr('opacity', animated ? 0 : 1)
        .transition()
        .duration(animated ? 500 : 0)
        .delay(i * 100)
        .attr('opacity', 1);

      step0Group.append('text')
        .attr('x', -totalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
        .attr('y', barY + 23)
        .attr('text-anchor', 'middle')
        .attr('fill', isUsed ? 'white' : '#94A3B8')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('opacity', animated ? 0 : 1)
        .transition()
        .duration(animated ? 500 : 0)
        .delay(i * 100)
        .attr('opacity', 1)
        .text(char);
    }

    // free 标签
    step0Group.append('text')
      .attr('x', -totalWidth / 2 + 65 + (initialLen + 1) * charWidth)
      .attr('y', barY + 50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94A3B8')
      .attr('font-size', '11px')
      .text(`free=${2}`);

    // Step 1: 检查结果
    if (step >= 1) {
      const step1Group = g.append('g').attr('class', 'step-1').attr('transform', `translate(0, 90)`);

      step1Group.append('text')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0F172A')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(`步骤 2: ${needExpand ? '空间不足，需要扩容!' : '空间足够，直接追加'}`);

      if (needExpand) {
        step1Group.append('rect')
          .attr('x', -80)
          .attr('y', 15)
          .attr('width', 160)
          .attr('height', 30)
          .attr('fill', '#FEF3C7')
          .attr('stroke', '#F59E0B')
          .attr('rx', 6);

        step1Group.append('text')
          .attr('x', 0)
          .attr('y', 35)
          .attr('text-anchor', 'middle')
          .attr('fill', '#B45309')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(`需要 ${newLen} 字节，当前只有 ${initialLen + 2}`);
      }
    }

    // Step 2: 扩容
    if (step >= 2 && needExpand) {
      const step2Group = g.append('g').attr('class', 'step-2').attr('transform', `translate(0, 160)`);

      step2Group.append('text')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0F172A')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('步骤 3: 预分配扩容');

      // 新空间
      const newAlloc = newLen * 2; // 简化的预分配策略
      const newTotalWidth = (newAlloc + 3) * charWidth;

      // Header
      step2Group.append('rect')
        .attr('x', -newTotalWidth / 2)
        .attr('y', 20)
        .attr('width', 60)
        .attr('height', 35)
        .attr('fill', '#DCFCE7')
        .attr('stroke', '#16A34A')
        .attr('rx', 4);

      step2Group.append('text')
        .attr('x', -newTotalWidth / 2 + 30)
        .attr('y', 42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`len=${initialLen}`);

      // Buffer - 原始部分
      for (let i = 0; i < initialLen + 1; i++) {
        const char = i < initialLen ? initialString[i] : '\\0';
        step2Group.append('rect')
          .attr('x', -newTotalWidth / 2 + 65 + i * charWidth)
          .attr('y', 20)
          .attr('width', charWidth - 4)
          .attr('height', 35)
          .attr('fill', '#22C55E')
          .attr('stroke', '#16A34A')
          .attr('rx', 4)
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(400)
          .delay(i * 50)
          .attr('opacity', 1);

        step2Group.append('text')
          .attr('x', -newTotalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
          .attr('y', 43)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(400)
          .delay(i * 50)
          .attr('opacity', 1)
          .text(char);
      }

      // Buffer - free 部分
      for (let i = initialLen + 1; i < newAlloc + 1; i++) {
        step2Group.append('rect')
          .attr('x', -newTotalWidth / 2 + 65 + i * charWidth)
          .attr('y', 20)
          .attr('width', charWidth - 4)
          .attr('height', 35)
          .attr('fill', '#FEF3C7')
          .attr('stroke', '#F59E0B')
          .attr('rx', 4)
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(400)
          .delay((i - initialLen - 1) * 30 + 300)
          .attr('opacity', 1);

        step2Group.append('text')
          .attr('x', -newTotalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
          .attr('y', 43)
          .attr('text-anchor', 'middle')
          .attr('fill', '#B45309')
          .attr('font-size', '12px')
          .text('·');
      }

      step2Group.append('text')
        .attr('x', 0)
        .attr('y', 75)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`新空间: alloc=${newAlloc}`);
    }

    // Step 3: 复制追加
    if (step >= 3) {
      const step3Group = g.append('g').attr('class', 'step-3').attr('transform', `translate(0, needExpand ? 260 : 130)`);

      step3Group.append('text')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0F172A')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('步骤 4: 复制追加内容并更新 len');

      const finalLen = newLen;
      const finalAlloc = needExpand ? newLen * 2 : initialLen + 2;
      const finalTotalWidth = (finalAlloc + 3) * charWidth;

      // Header - 更新后的 len
      step3Group.append('rect')
        .attr('x', -finalTotalWidth / 2)
        .attr('y', 20)
        .attr('width', 60)
        .attr('height', 35)
        .attr('fill', '#DCFCE7')
        .attr('stroke', '#16A34A')
        .attr('rx', 4);

      step3Group.append('text')
        .attr('x', -finalTotalWidth / 2 + 30)
        .attr('y', 42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`len=${finalLen}`);

      // Buffer - 完整字符串
      for (let i = 0; i < finalLen + 1; i++) {
        let char;
        if (i < initialLen) char = initialString[i];
        else if (i < finalLen) char = appendString[i - initialLen];
        else char = '\\0';

        const isNew = i >= initialLen && i < finalLen;

        step3Group.append('rect')
          .attr('x', -finalTotalWidth / 2 + 65 + i * charWidth)
          .attr('y', 20)
          .attr('width', charWidth - 4)
          .attr('height', 35)
          .attr('fill', isNew ? '#3B82F6' : '#22C55E')
          .attr('stroke', isNew ? '#1D4ED8' : '#16A34A')
          .attr('rx', 4)
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(400)
          .delay(i * 80)
          .attr('opacity', 1);

        step3Group.append('text')
          .attr('x', -finalTotalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
          .attr('y', 43)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(400)
          .delay(i * 80)
          .attr('opacity', 1)
          .text(char);
      }

      // free 区域
      for (let i = finalLen + 1; i < finalAlloc + 1; i++) {
        step3Group.append('rect')
          .attr('x', -finalTotalWidth / 2 + 65 + i * charWidth)
          .attr('y', 20)
          .attr('width', charWidth - 4)
          .attr('height', 35)
          .attr('fill', '#FEF3C7')
          .attr('stroke', '#F59E0B')
          .attr('rx', 4)
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(300)
          .delay((i - finalLen) * 30 + 500)
          .attr('opacity', 1);

        step3Group.append('text')
          .attr('x', -finalTotalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
          .attr('y', 43)
          .attr('text-anchor', 'middle')
          .attr('fill', '#B45309')
          .attr('font-size', '12px')
          .text('·');
      }

      step3Group.append('text')
        .attr('x', 0)
        .attr('y', 75)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`完成! len=${finalLen}, alloc=${finalAlloc}`);
    }

  }, [step, animated, initialString, appendString]);

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setStep(s => Math.min(s + 1, totalSteps))}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          {step === 0 ? '开始演示' : step >= totalSteps ? '重新开始' : '下一步'}
        </button>
        {step > 0 && (
          <button
            onClick={() => setStep(0)}
            className="ml-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            重置
          </button>
        )}
      </div>

      <div ref={containerRef} className="w-full min-h-[400px] bg-slate-50 rounded-lg">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="mt-3 text-sm text-slate-600 text-center">
        当前步骤: {step} / {totalSteps}
      </div>
    </div>
  );
}
