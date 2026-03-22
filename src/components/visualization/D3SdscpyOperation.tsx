/**
 * D3SdscpyOperation.tsx
 * sdscpy 复制操作动画
 * 展示 sdscpy 如何用新字符串覆盖原字符串
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3SdscpyOperationProps {
  /** 原始字符串 */
  originalString?: string;
  /** 复制的新字符串 */
  newString?: string;
  /** 是否显示动画 */
  animated?: boolean;
}

export function D3SdscpyOperation({
  originalString = 'Hello World',
  newString = 'Hi',
  animated = true,
}: D3SdscpyOperationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const totalSteps = 3;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const width = container.clientWidth;
    const height = 320;
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, 30)`);

    const oldLen = originalString.length;
    const newLen = newString.length;
    const maxLen = Math.max(oldLen, newLen);
    const alloc = maxLen + 2;

    const charWidth = 36;
    const totalWidth = (alloc + 3) * charWidth;

    // Step 0: 初始状态
    const step0Group = g.append('g').attr('class', 'step-0');

    step0Group.append('text')
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', '#0F172A')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('sdscpy 初始状态');

    // Header
    step0Group.append('rect')
      .attr('x', -totalWidth / 2)
      .attr('y', 20)
      .attr('width', 60)
      .attr('height', 35)
      .attr('fill', '#DCFCE7')
      .attr('stroke', '#16A34A')
      .attr('rx', 4);

    step0Group.append('text')
      .attr('x', -totalWidth / 2 + 30)
      .attr('y', 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#166534')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(`len=${oldLen}`);

    // Buffer - 原始字符串
    for (let i = 0; i < alloc + 1; i++) {
      let char = '';
      let isUsed = false;
      let isOld = false;

      if (i < oldLen) {
        char = originalString[i];
        isUsed = true;
        isOld = true;
      } else if (i === oldLen) {
        char = '\\0';
        isUsed = true;
      }

      step0Group.append('rect')
        .attr('x', -totalWidth / 2 + 65 + i * charWidth)
        .attr('y', 20)
        .attr('width', charWidth - 4)
        .attr('height', 35)
        .attr('fill', isOld ? '#22C55E' : isUsed ? '#94A3B8' : '#F1F5F9')
        .attr('stroke', isOld ? '#16A34A' : isUsed ? '#CBD5E1' : '#E2E8F0')
        .attr('rx', 4)
        .attr('opacity', animated ? 0 : 1)
        .transition()
        .duration(400)
        .delay(i * 50)
        .attr('opacity', 1);

      step0Group.append('text')
        .attr('x', -totalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
        .attr('y', 43)
        .attr('text-anchor', 'middle')
        .attr('fill', isOld ? 'white' : '#94A3B8')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('opacity', animated ? 0 : 1)
        .transition()
        .duration(400)
        .delay(i * 50)
        .attr('opacity', 1)
        .text(char);
    }

    // 旧字符串标签
    step0Group.append('text')
      .attr('x', -totalWidth / 2 + 65 + oldLen * charWidth / 2)
      .attr('y', 70)
      .attr('text-anchor', 'middle')
      .attr('fill', '#166534')
      .attr('font-size', '11px')
      .text(`原字符串 "${originalString}"`);

    // Step 1: 复制新字符串
    if (step >= 1) {
      const step1Group = g.append('g').attr('class', 'step-1').attr('transform', `translate(0, 110)`);

      step1Group.append('text')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0F172A')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(`sdscpy("${newString}") - 覆盖写入`);

      // Header - 更新 len
      step1Group.append('rect')
        .attr('x', -totalWidth / 2)
        .attr('y', 20)
        .attr('width', 60)
        .attr('height', 35)
        .attr('fill', '#DBEAFE')
        .attr('stroke', '#2563EB')
        .attr('rx', 4);

      step1Group.append('text')
        .attr('x', -totalWidth / 2 + 30)
        .attr('y', 42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1E40AF')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`len=${newLen}`);

      // Buffer - 新字符串覆盖
      for (let i = 0; i < alloc + 1; i++) {
        let char = '';
        let isNew = false;
        let isUsed = false;

        if (i < newLen) {
          char = newString[i];
          isNew = true;
          isUsed = true;
        } else if (i === newLen) {
          char = '\\0';
          isUsed = true;
        } else if (i < oldLen) {
          char = originalString[i];
        }

        const fillColor = isNew ? '#3B82F6' : isUsed ? '#94A3B8' : '#F1F5F9';
        const strokeColor = isNew ? '#1D4ED8' : isUsed ? '#CBD5E1' : '#E2E8F0';
        const textColor = isNew ? 'white' : '#94A3B8';

        step1Group.append('rect')
          .attr('x', -totalWidth / 2 + 65 + i * charWidth)
          .attr('y', 20)
          .attr('width', charWidth - 4)
          .attr('height', 35)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor)
          .attr('rx', 4)
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(300)
          .delay(i * 60)
          .attr('opacity', 1);

        step1Group.append('text')
          .attr('x', -totalWidth / 2 + 65 + i * charWidth + charWidth / 2 - 2)
          .attr('y', 43)
          .attr('text-anchor', 'middle')
          .attr('fill', textColor)
          .attr('font-size', '13px')
          .attr('font-weight', 'bold')
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(300)
          .delay(i * 60)
          .attr('opacity', 1)
          .text(char);
      }

      // 新字符串标签
      step1Group.append('text')
        .attr('x', -totalWidth / 2 + 65 + newLen * charWidth / 2)
        .attr('y', 70)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1E40AF')
        .attr('font-size', '11px')
        .text(`新字符串 "${newString}"`);

      // 被覆盖部分提示
      if (newLen < oldLen) {
        step1Group.append('text')
          .attr('x', -totalWidth / 2 + 65 + (newLen + (oldLen - newLen) / 2) * charWidth)
          .attr('y', 70)
          .attr('text-anchor', 'middle')
          .attr('fill', '#94A3B8')
          .attr('font-size', '10px')
          .text(`(被覆盖: "${originalString.substring(newLen)}")`);
      }
    }

    // Step 2: 完成状态
    if (step >= 2) {
      const step2Group = g.append('g').attr('class', 'step-2').attr('transform', `translate(0, 200)`);

      step2Group.append('text')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('完成! len 已更新，alloc 保持不变');

      step2Group.append('rect')
        .attr('x', -120)
        .attr('y', 15)
        .attr('width', 240)
        .attr('height', 50)
        .attr('fill', '#DCFCE7')
        .attr('stroke', '#16A34A')
        .attr('rx', 8);

      step2Group.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .text(`"${newString}" (len=${newLen})`);

      step2Group.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '11px')
        .text(`free = alloc - len = ${alloc} - ${newLen} = ${alloc - newLen}`);
    }

  }, [step, animated, originalString, newString]);

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

      <div ref={containerRef} className="w-full min-h-[320px] bg-slate-50 rounded-lg">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="mt-3 text-sm text-slate-600 text-center">
        当前步骤: {step} / {totalSteps}
      </div>
    </div>
  );
}
