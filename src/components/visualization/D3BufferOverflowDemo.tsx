/**
 * D3BufferOverflowDemo.tsx
 * 缓冲区溢出交互式演示
 * 展示 C 字符串溢出的危害和 SDS 的安全保护
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3BufferOverflowDemoProps {
  /** 是否显示动画 */
  animated?: boolean;
}

export function D3BufferOverflowDemo({
  animated = true,
}: D3BufferOverflowDemoProps) {
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
    const height = 380;
    svg.attr('width', width).attr('height', height);

    // 左侧：C String
    const leftX = width * 0.25;
    const rightX = width * 0.75;

    const g = svg.append('g');

    // 左侧标题
    g.append('text')
      .attr('x', leftX)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#DC2626')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('C String (危险!)');

    // 右侧标题
    g.append('text')
      .attr('x', rightX)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#22C55E')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('SDS (安全)');

    // 绘制内存布局
    const drawMemory = (
      x: number,
      y: number,
      data: string[],
      label: string,
      isDanger: boolean,
      overflowIndex?: number
    ) => {
      const charWidth = 32;
      const charHeight = 36;
      const headerHeight = 30;

      // 数据区标签
      g.append('text')
        .attr('x', x)
        .attr('y', y + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748B')
        .attr('font-size', '11px')
        .text(label);

      // Header (SDS 特有)
      if (!isDanger) {
        g.append('rect')
          .attr('x', x - 40)
          .attr('y', y + 25)
          .attr('width', 50)
          .attr('height', headerHeight)
          .attr('fill', '#DCFCE7')
          .attr('stroke', '#16A34A')
          .attr('rx', 4);

        g.append('text')
          .attr('x', x - 15)
          .attr('y', y + 45)
          .attr('text-anchor', 'middle')
          .attr('fill', '#166534')
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .text(`len=${data.length}`);
      }

      // 字符单元格
      data.forEach((char, i) => {
        const isOverflow = overflowIndex !== undefined && i >= overflowIndex;
        const fillColor = isOverflow
          ? '#DC2626'
          : isDanger
            ? '#FEE2E2'
            : '#22C55E';
        const strokeColor = isOverflow
          ? '#B91C1C'
          : isDanger
            ? '#FECACA'
            : '#16A34A';
        const textColor = isOverflow
          ? 'white'
          : isDanger
            ? '#991B1B'
            : 'white';

        g.append('rect')
          .attr('x', x + i * charWidth + (isDanger ? 20 : 15))
          .attr('y', y + 25)
          .attr('width', charWidth - 2)
          .attr('height', charHeight)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor)
          .attr('stroke-width', isOverflow ? 2 : 1)
          .attr('rx', 4)
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(300)
          .delay(i * 80)
          .attr('opacity', 1);

        g.append('text')
          .attr('x', x + i * charWidth + 20 + charWidth / 2 - 1)
          .attr('y', y + 50)
          .attr('text-anchor', 'middle')
          .attr('fill', textColor)
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('opacity', animated ? 0 : 1)
          .transition()
          .duration(300)
          .delay(i * 80)
          .attr('opacity', 1)
          .text(char);
      });
    };

    // Step 0: 初始状态
    if (step >= 0) {
      const buffer = ['b', 'u', 'f', 'f', 'e', 'r', '\\0'];
      drawMemory(leftX, 50, buffer, 'buffer[7]', true);

      const sdsData = ['b', 'u', 'f', 'f', 'e', 'r', '\\0', '·', '·', '·'];
      drawMemory(rightX, 50, sdsData, 'buf (alloc=10)', false);
    }

    // Step 1: 尝试写入
    if (step >= 1) {
      const y = 150;

      g.append('text')
        .attr('x', leftX)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0F172A')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .text('执行: strcpy(buffer, "overflow!")');

      g.append('text')
        .attr('x', rightX)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0F172A')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .text('执行: sdscpy(sds, "overflow!")');
    }

    // Step 2: 溢出效果
    if (step >= 2) {
      const y = 200;
      const overflowData = ['o', 'v', 'e', 'r', 'f', 'l', 'o', 'w', '!', '\\0'];

      // C String 溢出
      g.append('rect')
        .attr('x', leftX - 60)
        .attr('y', y - 5)
        .attr('width', 200)
        .attr('height', 80)
        .attr('fill', 'none')
        .attr('stroke', '#DC2626')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('rx', 8);

      g.append('text')
        .attr('x', leftX + 40)
        .attr('y', y + 90)
        .attr('text-anchor', 'middle')
        .attr('fill', '#DC2626')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('缓冲区只有 7 字节!');

      drawMemory(leftX, y - 20, overflowData, 'buffer[7] ← 溢出!', true, 7);

      // SDS 安全复制
      const safeData = ['o', 'v', 'e', 'r', 'f', 'l', 'o', 'w', '!', '\\0'];
      drawMemory(rightX, y - 20, safeData, 'buf (alloc=10)', false);

      g.append('text')
        .attr('x', rightX + 80)
        .attr('y', y + 90)
        .attr('text-anchor', 'middle')
        .attr('fill', '#22C55E')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('检查空间，必要时扩容 ✓');
    }

    // Step 3: 危险提示
    if (step >= 3) {
      g.append('rect')
        .attr('x', leftX - 100)
        .attr('y', 310)
        .attr('width', 200)
        .attr('height', 50)
        .attr('fill', '#FEE2E2')
        .attr('stroke', '#DC2626')
        .attr('rx', 8);

      g.append('text')
        .attr('x', leftX)
        .attr('y', 335)
        .attr('text-anchor', 'middle')
        .attr('fill', '#991B1B')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('⚠️ 可能覆盖相邻内存!');

      g.append('rect')
        .attr('x', rightX - 100)
        .attr('y', 310)
        .attr('width', 200)
        .attr('height', 50)
        .attr('fill', '#DCFCE7')
        .attr('stroke', '#22C55E')
        .attr('rx', 8);

      g.append('text')
        .attr('x', rightX)
        .attr('y', 335)
        .attr('text-anchor', 'middle')
        .attr('fill', '#166534')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('✓ SDS 自动处理，安全无忧');
    }

  }, [step, animated]);

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

      <div ref={containerRef} className="w-full min-h-[380px] bg-slate-50 rounded-lg">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="mt-3 text-sm text-slate-600 text-center">
        当前步骤: {step} / {totalSteps} - 点击"下一步"观看缓冲区溢出对比
      </div>
    </div>
  );
}
