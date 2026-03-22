/**
 * D3SDSMemoryVisualizer.tsx
 * 交互式 SDS 内存布局可视化组件
 * 使用 D3.js 展示 SDS 数据结构的内存布局
 * 支持点击查看详情、hover 高亮、数据动态变化
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { SDSState, SDSType, SDS_HEADER_SIZE } from '@/types/sds';

interface D3SDSMemoryVisualizerProps {
  /** SDS 状态数据 */
  sds: SDSState;
  /** 当前选中的区域 */
  selectedRegion?: string | null;
  /** 区域被点击时的回调 */
  onRegionClick?: (region: string | null) => void;
  /** 显示动画开关 */
  animated?: boolean;
}

// 区域类型定义
type RegionType = 'len' | 'alloc' | 'flags' | 'buf' | 'header';

// 区域配置
interface RegionConfig {
  id: RegionType;
  name: string;
  description: string;
  color: string;
  hoverColor: string;
  byteSize: number | 'variable';
}

const REGION_CONFIGS: RegionConfig[] = [
  {
    id: 'len',
    name: 'len',
    description: '已使用长度，不包含终止符 \\0',
    color: '#DCFCE7',
    hoverColor: '#86EFAC',
    byteSize: 'variable',
  },
  {
    id: 'alloc',
    name: 'alloc',
    description: '已分配容量，不包含终止符 \\0',
    color: '#DBEAFE',
    hoverColor: '#93C5FD',
    byteSize: 'variable',
  },
  {
    id: 'flags',
    name: 'flags',
    description: '标志位，存储 SDS 类型 (0-7)',
    color: '#FEF3C7',
    hoverColor: '#FDE68A',
    byteSize: 1,
  },
  {
    id: 'buf',
    name: 'buf',
    description: '字符缓冲区，存储实际字符串数据',
    color: '#E0E7FF',
    hoverColor: '#A5B4FC',
    byteSize: 'variable',
  },
];

export function D3SDSMemoryVisualizer({
  sds,
  selectedRegion,
  onRegionClick,
  animated = true,
}: D3SDSMemoryVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  // 获取头部字节大小
  const getHeaderBytes = useCallback((type: SDSType): number => {
    return SDS_HEADER_SIZE[type];
  }, []);

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
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const headerWidth = width - margin.left - margin.right;
    const headerHeight = 80;
    const bufferCellSize = 32;
    const bufferCellGap = 4;

    // 创建主 group
    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 计算缓冲区尺寸
    const bufferSize = sds.alloc + 1; // +1 for null terminator
    const cellsPerRow = Math.min(bufferSize, 16);
    const bufferRows = Math.ceil(bufferSize / cellsPerRow);
    const bufferWidth = cellsPerRow * (bufferCellSize + bufferCellGap);
    const bufferHeight = bufferRows * (bufferCellSize + bufferCellGap);

    // 计算总宽度和缩放比例
    const totalWidth = Math.max(headerWidth, bufferWidth + 40);
    const scale = Math.min(1, headerWidth / totalWidth);

    // 缩放组
    const scaledGroup = mainGroup
      .append('g')
      .attr('transform', `scale(${scale})`);

    // 绘制标题
    mainGroup
      .append('text')
      .attr('x', totalWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .attr('fill', '#334155')
      .text('SDS 内存布局');

    // 绘制类型标签
    mainGroup
      .append('text')
      .attr('x', totalWidth / 2)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#64748B')
      .text(`类型: ${sds.type} | Header: ${getHeaderBytes(sds.type)} bytes`);

    // ========== Header 区域 ==========
    const headerGroup = scaledGroup.append('g').attr('class', 'header-group');

    // Header 背景框
    headerGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 25)
      .attr('width', totalWidth)
      .attr('height', headerHeight)
      .attr('rx', 8)
      .attr('fill', '#F1F5F9')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 1);

    // Header 标签
    headerGroup
      .append('text')
      .attr('x', 10)
      .attr('y', 42)
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text('SDS Header');

    // 计算各个字段的宽度
    const typeFieldWidth = (totalWidth - 40) / 3;

    // 绘制 len 字段
    const lenRegion = REGION_CONFIGS.find((r) => r.id === 'len')!;
    const lenGroup = headerGroup.append('g').attr('class', 'region len-region');

    lenGroup
      .append('rect')
      .attr('x', 10)
      .attr('y', 50)
      .attr('width', typeFieldWidth - 10)
      .attr('height', headerHeight - 30)
      .attr('rx', 6)
      .attr('fill', lenRegion.color)
      .attr('stroke', selectedRegion === 'len' ? '#16A34A' : '#CBD5E1')
      .attr('stroke-width', selectedRegion === 'len' ? 2 : 1)
      .attr('cursor', 'pointer')
      .style('transition', animated ? 'all 0.3s ease' : 'none')
      .on('mouseover', function (event) {
        d3.select(this).attr('fill', lenRegion.hoverColor);
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x,
          y,
          content: `${lenRegion.name}: ${sds.len} bytes\n${lenRegion.description}`,
        });
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', lenRegion.color);
        setTooltip((prev) => ({ ...prev, visible: false }));
      })
      .on('click', () => onRegionClick?.(selectedRegion === 'len' ? null : 'len'));

    lenGroup
      .append('text')
      .attr('x', 20)
      .attr('y', 68)
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text('len');

    lenGroup
      .append('text')
      .attr('x', 20)
      .attr('y', 92)
      .attr('font-size', 20)
      .attr('font-weight', 700)
      .attr('fill', '#0F172A')
      .text(sds.len);

    // 绘制 alloc 字段
    const allocRegion = REGION_CONFIGS.find((r) => r.id === 'alloc')!;
    const allocGroup = headerGroup.append('g').attr('class', 'region alloc-region');

    allocGroup
      .append('rect')
      .attr('x', 20 + typeFieldWidth)
      .attr('y', 50)
      .attr('width', typeFieldWidth - 10)
      .attr('height', headerHeight - 30)
      .attr('rx', 6)
      .attr('fill', allocRegion.color)
      .attr('stroke', selectedRegion === 'alloc' ? '#16A34A' : '#CBD5E1')
      .attr('stroke-width', selectedRegion === 'alloc' ? 2 : 1)
      .attr('cursor', 'pointer')
      .style('transition', animated ? 'all 0.3s ease' : 'none')
      .on('mouseover', function (event) {
        d3.select(this).attr('fill', allocRegion.hoverColor);
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x,
          y,
          content: `${allocRegion.name}: ${sds.alloc} bytes\n${allocRegion.description}`,
        });
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', allocRegion.color);
        setTooltip((prev) => ({ ...prev, visible: false }));
      })
      .on('click', () => onRegionClick?.(selectedRegion === 'alloc' ? null : 'alloc'));

    allocGroup
      .append('text')
      .attr('x', 30 + typeFieldWidth)
      .attr('y', 68)
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text('alloc');

    allocGroup
      .append('text')
      .attr('x', 30 + typeFieldWidth)
      .attr('y', 92)
      .attr('font-size', 20)
      .attr('font-weight', 700)
      .attr('fill', '#0F172A')
      .text(sds.alloc);

    // 绘制 flags 字段
    const flagsRegion = REGION_CONFIGS.find((r) => r.id === 'flags')!;
    const flagsGroup = headerGroup.append('g').attr('class', 'region flags-region');

    flagsGroup
      .append('rect')
      .attr('x', 30 + typeFieldWidth * 2)
      .attr('y', 50)
      .attr('width', typeFieldWidth - 10)
      .attr('height', headerHeight - 30)
      .attr('rx', 6)
      .attr('fill', flagsRegion.color)
      .attr('stroke', selectedRegion === 'flags' ? '#16A34A' : '#CBD5E1')
      .attr('stroke-width', selectedRegion === 'flags' ? 2 : 1)
      .attr('cursor', 'pointer')
      .style('transition', animated ? 'all 0.3s ease' : 'none')
      .on('mouseover', function (event) {
        d3.select(this).attr('fill', flagsRegion.hoverColor);
        const [x, y] = d3.pointer(event, container);
        setTooltip({
          visible: true,
          x,
          y,
          content: `${flagsRegion.name}: ${sds.flags}\n${flagsRegion.description}`,
        });
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', flagsRegion.color);
        setTooltip((prev) => ({ ...prev, visible: false }));
      })
      .on('click', () => onRegionClick?.(selectedRegion === 'flags' ? null : 'flags'));

    flagsGroup
      .append('text')
      .attr('x', 40 + typeFieldWidth * 2)
      .attr('y', 68)
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text('flags');

    flagsGroup
      .append('text')
      .attr('x', 40 + typeFieldWidth * 2)
      .attr('y', 92)
      .attr('font-size', 20)
      .attr('font-weight', 700)
      .attr('fill', '#0F172A')
      .text(sds.flags);

    // ========== Buffer 区域 ==========
    const bufferGroup = scaledGroup
      .append('g')
      .attr('class', 'buffer-group')
      .attr('transform', `translate(${(totalWidth - bufferWidth) / 2}, ${headerHeight + 50})`);

    // Buffer 标签
    bufferGroup
      .append('text')
      .attr('x', bufferWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', '#334155')
      .text(`Buffer (${bufferSize} bytes)`);

    // Buffer 外框
    bufferGroup
      .append('rect')
      .attr('x', -10)
      .attr('y', -5)
      .attr('width', bufferWidth + 20)
      .attr('height', bufferHeight + 10)
      .attr('rx', 8)
      .attr('fill', '#F8FAFC')
      .attr('stroke', selectedRegion === 'buf' ? '#16A34A' : '#E2E8F0')
      .attr('stroke-width', selectedRegion === 'buf' ? 2 : 1)
      .attr('cursor', 'pointer')
      .on('click', () => onRegionClick?.(selectedRegion === 'buf' ? null : 'buf'));

    // 绘制 buffer 单元格
    const bufRegion = REGION_CONFIGS.find((r) => r.id === 'buf')!;

    for (let i = 0; i < bufferSize; i++) {
      const col = i % cellsPerRow;
      const row = Math.floor(i / cellsPerRow);
      const x = col * (bufferCellSize + bufferCellGap);
      const y = row * (bufferCellSize + bufferCellGap);
      const isUsed = i < sds.len;
      const isTerminator = i === sds.len;

      const cellGroup = bufferGroup.append('g').attr('class', `buf-cell buf-cell-${i}`);

      // 单元格背景
      cellGroup
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', bufferCellSize)
        .attr('height', bufferCellSize)
        .attr('rx', 4)
        .attr('fill', isTerminator ? '#FEE2E2' : isUsed ? bufRegion.color : '#F1F5F9')
        .attr('stroke', isTerminator ? '#EF4444' : '#CBD5E1')
        .attr('stroke-width', 1)
        .style('transition', animated ? 'all 0.2s ease' : 'none');

      // 单元格字符
      const char = sds.buf[i] || '\0';
      cellGroup
        .append('text')
        .attr('x', x + bufferCellSize / 2)
        .attr('y', y + bufferCellSize / 2 + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', isTerminator ? '#EF4444' : '#0F172A')
        .text(char === '\0' ? '\\0' : char);

      // 索引标签
      cellGroup
        .append('text')
        .attr('x', x + bufferCellSize / 2)
        .attr('y', y + bufferCellSize + 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', 9)
        .attr('fill', '#94A3B8')
        .text(i);

      // Hover 效果
      cellGroup
        .on('mouseover', function (event) {
          d3.select(this)
            .select('rect')
            .attr('fill', isTerminator ? '#FECACA' : bufRegion.hoverColor);
          const [mx, my] = d3.pointer(event, container);
          const displayChar = char === '\0' ? '\\0' : char;
          setTooltip({
            visible: true,
            x: mx,
            y: my,
            content: `buf[${i}]: '${displayChar}'\n${isTerminator ? '字符串终止符' : isUsed ? '已使用' : '空闲'}`,
          });
        })
        .on('mouseout', function () {
          d3.select(this)
            .select('rect')
            .attr('fill', isTerminator ? '#FEE2E2' : isUsed ? bufRegion.color : '#F1F5F9');
          setTooltip((prev) => ({ ...prev, visible: false }));
        });
    }

    // ========== 统计信息 ==========
    const statsGroup = scaledGroup
      .append('g')
      .attr('class', 'stats-group')
      .attr('transform', `translate(0, ${headerHeight + 60 + bufferHeight})`);

    const stats = [
      { label: '已用', value: sds.len, color: '#22C55E' },
      { label: '空闲', value: sds.alloc - sds.len, color: '#94A3B8' },
      { label: '总分配', value: sds.alloc, color: '#3B82F6' },
    ];

    stats.forEach((stat, i) => {
      const statX = (totalWidth / 4) * (i + 1);

      statsGroup
        .append('rect')
        .attr('x', statX - 40)
        .attr('y', 10)
        .attr('width', 80)
        .attr('height', 50)
        .attr('rx', 6)
        .attr('fill', '#F8FAFC')
        .attr('stroke', '#E2E8F0');

      statsGroup
        .append('text')
        .attr('x', statX)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#64748B')
        .text(stat.label);

      statsGroup
        .append('text')
        .attr('x', statX)
        .attr('y', 48)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16)
        .attr('font-weight', 700)
        .attr('fill', stat.color)
        .text(`${stat.value}B`);
    });

    // 添加动画效果 - 数据变化时的过渡
    if (animated) {
      // 数字变化动画
      scaledGroup
        .selectAll('.region text:nth-child(3)')
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut);
    }
  }, [sds, selectedRegion, animated, onRegionClick, getHeaderBytes]);

  return (
    <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">SDS 内存布局图解</h3>

      <div ref={containerRef} className="relative w-full h-96 bg-slate-50 rounded-lg overflow-hidden">
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
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {REGION_CONFIGS.map((region) => (
          <div key={region.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: region.color }}
            />
            <span className="text-slate-600">{region.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FEE2E2' }} />
          <span className="text-slate-600">终止符</span>
        </div>
      </div>

      {/* 提示信息 */}
      <p className="mt-2 text-xs text-slate-500">
        点击区域查看详情，鼠标悬停查看更多信息
      </p>
    </div>
  );
}
