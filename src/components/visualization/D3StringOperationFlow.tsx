/**
 * D3StringOperationFlow.tsx
 * 字符串操作流程图可视化组件
 * 使用 D3.js 展示 SDS 字符串操作（如 sdscat, sdscpy）的执行流程
 * 支持节点动画效果、连接线动画
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SDSOperation } from '@/types/sds';

interface D3StringOperationFlowProps {
  /** 当前选中的操作 */
  operation: SDSOperation;
  /** 操作参数 */
  params?: {
    inputString?: string;
    concatString?: string;
    copyString?: string;
    extraBytes?: number;
  };
  /** 当前步骤索引 */
  currentStep?: number;
  /** 是否显示动画 */
  animated?: boolean;
  /** 步骤被点击时的回调 */
  onStepClick?: (step: number) => void;
}

// 操作步骤定义
interface OperationStep {
  id: string;
  label: string;
  description: string;
  codeSnippet?: string;
}

// 操作流程定义
const OPERATION_FLOWS: Record<SDSOperation, OperationStep[]> = {
  sdsnew: [
    { id: 'start', label: '开始', description: '调用 sdsnew() 创建新 SDS' },
    { id: 'calc_len', label: '计算长度', description: '计算输入字符串的长度' },
    { id: 'select_type', label: '选择类型', description: '根据长度选择合适的 SDS 类型' },
    { id: 'alloc_header', label: '分配头部', description: '为 SDS 头部分配内存' },
    { id: 'alloc_buf', label: '分配缓冲区', description: '为字符缓冲区分配内存 (alloc + 1)' },
    { id: 'copy_data', label: '复制数据', description: '将输入字符串复制到缓冲区' },
    { id: 'set_len', label: '设置长度', description: '设置 len 和 alloc 字段' },
    { id: 'add_terminator', label: '添加终止符', description: '在末尾添加 \\0' },
    { id: 'return', label: '返回', description: '返回新创建的 SDS 指针' },
  ],
  sdsempty: [
    { id: 'start', label: '开始', description: '调用 sdsempty() 创建空 SDS' },
    { id: 'alloc_empty', label: '分配空SDS', description: '分配最小大小的 SDS (SDS_TYPE_5)' },
    { id: 'set_zero', label: '置零', description: '设置 len = 0' },
    { id: 'add_terminator', label: '添加终止符', description: 'buf[0] = \\0' },
    { id: 'return', label: '返回', description: '返回空 SDS' },
  ],
  sdsdup: [
    { id: 'start', label: '开始', description: '调用 sdsdup() 复制 SDS' },
    { id: 'get_size', label: '获取大小', description: '获取原 SDS 的总大小' },
    { id: 'alloc_copy', label: '分配复制', description: '分配相同大小的新内存' },
    { id: 'copy_all', label: '复制全部', description: '复制头部和缓冲区' },
    { id: 'return', label: '返回', description: '返回新 SDS 指针' },
  ],
  sdscat: [
    { id: 'start', label: '开始', description: '调用 sdscat() 追加字符串' },
    { id: 'calc_needed', label: '计算需求', description: '计算需要的总长度: len + concat_len' },
    { id: 'check_space', label: '检查空间', description: '检查当前 alloc 是否足够' },
    { id: 'need_realloc', label: '需要扩容?', description: '如果空间不足需要扩容', codeSnippet: 'if (alloc < needed) { ... }' },
    { id: 'realloc', label: '扩容', description: '调用 sdsMakeRoomFor() 扩容' },
    { id: 'concat', label: '拼接', description: '将新字符串复制到末尾' },
    { id: 'update_len', label: '更新长度', description: '更新 len 字段' },
    { id: 'return', label: '返回', description: '返回 SDS 指针' },
  ],
  sdscpy: [
    { id: 'start', label: '开始', description: '调用 sdscpy() 复制字符串' },
    { id: 'calc_new_len', label: '计算新长度', description: '计算新字符串的长度' },
    { id: 'check_alloc', label: '检查空间', description: '检查 alloc 是否 >= 新长度' },
    { id: 'need_realloc', label: '需要扩容?', description: '如果空间不足需要扩容' },
    { id: 'realloc', label: '扩容', description: '必要时重新分配内存' },
    { id: 'copy', label: '复制', description: '用新字符串覆盖原内容' },
    { id: 'set_len', label: '设置长度', description: '更新 len = new_len' },
    { id: 'add_terminator', label: '添加终止符', description: '确保 \\0 终止' },
    { id: 'return', label: '返回', description: '返回 SDS 指针' },
  ],
  sdsrange: [
    { id: 'start', label: '开始', description: '调用 sdsrange() 截取范围' },
    { id: 'validate_range', label: '验证范围', description: '检查 start 和 end 的有效性' },
    { id: 'calc_new_len', label: '计算新长度', description: '新长度 = end - start + 1' },
    { id: 'shift_data', label: '移动数据', description: '将 [start, end] 移到缓冲区开头' },
    { id: 'update_len', label: '更新长度', description: '设置 len = new_len' },
    { id: 'return', label: '返回', description: '返回 SDS 指针' },
  ],
  sdstrim: [
    { id: 'start', label: '开始', description: '调用 sdstrim() 裁剪两端字符' },
    { id: 'find_start', label: '找起始位置', description: '从左找到第一个不需要删除的字符' },
    { id: 'find_end', label: '找结束位置', description: '从右找到第一个不需要删除的字符' },
    { id: 'calc_new_len', label: '计算新长度', description: '新长度 = end - start + 1' },
    { id: 'copy', label: '复制', description: '复制保留的部分到缓冲区开头' },
    { id: 'update_len', label: '更新长度', description: '设置 len = new_len' },
    { id: 'return', label: '返回', description: '返回 SDS 指针' },
  ],
  sdsMakeRoomFor: [
    { id: 'start', label: '开始', description: '调用 sdsMakeRoomFor() 预分配空间' },
    { id: 'calc_needed', label: '计算需求', description: 'needed = len + add_len' },
    { id: 'check_free', label: '检查空闲', description: '检查 alloc - len >= add_len' },
    { id: 'has_space', label: '有足够空间?', description: '如果空间足够直接返回' },
    { id: 'apply_policy', label: '应用策略', description: '根据长度选择扩容策略' },
    { id: 'realloc', label: '重新分配', description: '调用 realloc 扩大内存' },
    { id: 'return', label: '返回', description: '返回 SDS 指针（可能改变）' },
  ],
  sdsRemoveFreeSpace: [
    { id: 'start', label: '开始', description: '调用 sdsRemoveFreeSpace() 释放空闲空间' },
    { id: 'get_size', label: '获取大小', description: '计算实际需要的大小: header + len + 1' },
    { id: 'realloc', label: '重新分配', description: '调用 realloc 收缩到恰好大小' },
    { id: 'update_alloc', label: '更新 alloc', description: '设置 alloc = len' },
    { id: 'return', label: '返回', description: '返回 SDS 指针' },
  ],
};

export function D3StringOperationFlow({
  operation,
  params = {},
  currentStep = 0,
  animated = true,
  onStepClick,
}: D3StringOperationFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  // 获取操作步骤
  const steps = OPERATION_FLOWS[operation] || [];

  // 渲染流程图
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || steps.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    // 清除现有内容
    svg.selectAll('*').remove();

    // 获取容器尺寸
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 设置 SVG 尺寸
    svg.attr('width', width).attr('height', height);

    // 布局参数
    const margin = { top: 50, right: 40, bottom: 30, left: 40 };
    const contentWidth = width - margin.left - margin.right;

    // 创建主 group
    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 绘制标题
    mainGroup
      .append('text')
      .attr('x', contentWidth / 2)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .attr('fill', '#334155')
      .text(`${operation} 执行流程`);

    // 参数信息
    const paramText = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');

    if (paramText) {
      mainGroup
        .append('text')
        .attr('x', contentWidth / 2)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('fill', '#64748B')
        .text(paramText);
    }

    // 计算节点布局
    const nodeWidth = 140;
    const nodeHeight = 50;
    const horizontalGap = 60;
    const verticalGap = 65;

    // 计算行列数
    const cols = 3;
    const rows = Math.ceil(steps.length / cols);

    // 节点位置
    const nodePositions: Array<{ x: number; y: number; step: OperationStep; index: number }> = [];

    steps.forEach((step, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * (nodeWidth + horizontalGap) + nodeWidth / 2;
      const y = row * (nodeHeight + verticalGap) + nodeHeight / 2;

      nodePositions.push({ x, y, step, index: i });
    });

    // 调整组位置使流程图居中
    const totalWidth = cols * nodeWidth + (cols - 1) * horizontalGap;
    const totalHeight = rows * nodeHeight + (rows - 1) * verticalGap;
    const offsetX = (contentWidth - totalWidth) / 2;
    const offsetY = 20;

    const processGroup = mainGroup
      .append('g')
      .attr('transform', `translate(${offsetX}, ${offsetY})`);

    // 绘制连接线
    const linkGroup = processGroup.append('g').attr('class', 'links');

    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];

      // 判断连接方向
      const isHorizontal = current.index % cols !== cols - 1 && next.index === current.index + 1;

      let pathD: string;

      if (isHorizontal) {
        // 水平连接
        pathD = `M ${current.x + nodeWidth / 2} ${current.y} L ${next.x - nodeWidth / 2} ${next.y}`;
      } else {
        // 垂直连接（换行）
        const startX = current.x + nodeWidth / 2;
        const startY = current.y + nodeHeight / 2;
        const endX = next.x - nodeWidth / 2;
        const endY = next.y - nodeHeight / 2;
        const midY = (startY + endY) / 2;

        pathD = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
      }

      const isCompleted = current.index < currentStep;
      const isActive = current.index === currentStep - 1 || current.index === currentStep;

      linkGroup
        .append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', isCompleted && animated ? '#22C55E' : isActive && animated ? '#3B82F6' : '#CBD5E1')
        .attr('stroke-width', isActive ? 2.5 : 1.5)
        .attr('stroke-dasharray', isActive && animated ? '5,5' : 'none')
        .style('transition', animated ? 'stroke 0.3s ease' : 'none');
    }

    // 绘制节点
    const nodeGroup = processGroup.append('g').attr('class', 'nodes');

    nodePositions.forEach(({ x, y, step, index }) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;

      const g = nodeGroup.append('g').attr('class', `node node-${index}`);

      // 节点背景
      g.append('rect')
        .attr('x', x - nodeWidth / 2)
        .attr('y', y - nodeHeight / 2)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 8)
        .attr('fill', isActive && animated ? '#DBEAFE' : isCompleted && animated ? '#DCFCE7' : '#FFFFFF')
        .attr('stroke', isActive && animated ? '#3B82F6' : isCompleted && animated ? '#22C55E' : '#CBD5E1')
        .attr('stroke-width', isActive || isCompleted ? 2 : 1.5)
        .attr('cursor', 'pointer')
        .style('transition', animated ? 'all 0.3s ease' : 'none')
        .on('mouseover', function (event) {
          d3.select(this).attr('fill', '#F0FDF4');
          const [mx, my] = d3.pointer(event, container);
          setTooltip({
            visible: true,
            x: mx,
            y: my,
            content: `${step.label}\n${step.description}`,
          });
        })
        .on('mouseout', function () {
          d3.select(this).attr(
            'fill',
            isActive && animated ? '#DBEAFE' : isCompleted && animated ? '#DCFCE7' : '#FFFFFF'
          );
          setTooltip((prev) => ({ ...prev, visible: false }));
        })
        .on('click', () => onStepClick?.(index));

      // 步骤编号
      g.append('circle')
        .attr('cx', x - nodeWidth / 2 + 12)
        .attr('cy', y - nodeHeight / 2 + 12)
        .attr('r', 10)
        .attr('fill', isActive && animated ? '#3B82F6' : isCompleted && animated ? '#22C55E' : '#94A3B8');

      g.append('text')
        .attr('x', x - nodeWidth / 2 + 12)
        .attr('y', y - nodeHeight / 2 + 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('font-weight', 700)
        .attr('fill', '#FFFFFF')
        .text(index + 1);

      // 步骤标签
      g.append('text')
        .attr('x', x)
        .attr('y', y - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('font-weight', 600)
        .attr('fill', isActive ? '#1D4ED8' : '#0F172A')
        .text(step.label);

      // 简短描述
      const shortDesc = step.description.length > 18 ? step.description.slice(0, 16) + '...' : step.description;
      g.append('text')
        .attr('x', x)
        .attr('y', y + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', 9)
        .attr('fill', '#64748B')
        .text(shortDesc);

      // 当前步骤指示器
      if (isActive && animated) {
        g.append('rect')
          .attr('x', x - nodeWidth / 2 - 4)
          .attr('y', y - nodeHeight / 2 - 4)
          .attr('width', nodeWidth + 8)
          .attr('height', nodeHeight + 8)
          .attr('rx', 10)
          .attr('fill', 'none')
          .attr('stroke', '#3B82F6')
          .attr('stroke-width', 2)
          .attr('opacity', 0.8);
      }

      // 动画效果 - 节点入场
      if (animated) {
        g.attr('opacity', 0)
          .transition()
          .duration(300)
          .delay(index * 50)
          .attr('opacity', 1);
      }
    });

    // 进度指示器
    mainGroup
      .append('text')
      .attr('x', contentWidth - 10)
      .attr('y', totalHeight + offsetY + 25)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', '#64748B')
      .text(`步骤 ${currentStep + 1} / ${steps.length}`);
  }, [operation, params, currentStep, animated, onStepClick, steps]);

  return (
    <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">字符串操作执行流程</h3>

      <div ref={containerRef} className="relative w-full h-[450px] bg-slate-50 rounded-lg overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute z-10 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-pre-line max-w-xs"
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
          <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500" />
          <span className="text-slate-600">当前步骤</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-500" />
          <span className="text-slate-600">已完成</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white border border-slate-300" />
          <span className="text-slate-600">未开始</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-blue-500 border-dashed" />
          <span className="text-slate-600">执行中</span>
        </div>
      </div>

      {/* 操作说明 */}
      <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
        <span className="text-slate-600">操作: </span>
        <span className="font-semibold text-slate-800">{operation}</span>
        <span className="text-slate-400 mx-2">|</span>
        <span className="text-slate-500">{steps[currentStep]?.description || '等待执行'}</span>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        点击节点跳转到对应步骤
      </p>
    </div>
  );
}
