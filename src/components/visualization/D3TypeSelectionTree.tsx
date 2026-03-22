/**
 * D3TypeSelectionTree.tsx
 * 交互式类型选择判定树可视化组件
 * 使用 D3.js 展示 SDS 类型选择的决策流程
 * 支持点击节点、动态高亮选中路径、显示阈值条件
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SDSType, SDS_MAX_LENGTH } from '@/types/sds';

interface D3TypeSelectionTreeProps {
  /** 当前选中的类型 */
  selectedType?: SDSType | null;
  /** 当前字符串长度 */
  currentLength?: number;
  /** 类型变更回调 */
  onTypeSelect?: (type: SDSType) => void;
  /** 显示动画开关 */
  animated?: boolean;
}

// 节点类型定义
interface TreeNode {
  id: string;
  label: string;
  description: string;
  type?: SDSType;
  threshold?: number;
  isCondition?: boolean;
  isSelected?: boolean;
  x?: number;
  y?: number;
}

// 决策树数据结构
const TYPE_SELECTION_TREE: TreeNode[] = [
  // 根节点
  {
    id: 'start',
    label: '字符串长度',
    description: '根据字符串长度选择 SDS 类型',
    isCondition: true,
  },
  // 第一层条件
  {
    id: 'len_le_32',
    label: 'len ≤ 32?',
    description: '如果长度不超过 32 字节',
    threshold: 32,
    isCondition: true,
  },
  {
    id: 'len_le_256',
    label: 'len ≤ 256?',
    description: '如果长度不超过 256 字节',
    threshold: 256,
    isCondition: true,
  },
  {
    id: 'len_le_65535',
    label: 'len ≤ 65535?',
    description: '如果长度不超过 64KB',
    threshold: 65535,
    isCondition: true,
  },
  {
    id: 'len_le_4294967295',
    label: 'len ≤ 2^32?',
    description: '如果长度不超过 4GB',
    threshold: 4294967295,
    isCondition: true,
  },
  // 类型节点
  {
    id: 'type_5',
    label: 'SDS_TYPE_5',
    description: '最大长度 32 字节，头部仅 1 字节（仅存储 flags）',
    type: SDSType.SDS_TYPE_5,
  },
  {
    id: 'type_8',
    label: 'SDS_TYPE_8',
    description: '最大长度 256 字节，头部 3 字节',
    type: SDSType.SDS_TYPE_8,
  },
  {
    id: 'type_16',
    label: 'SDS_TYPE_16',
    description: '最大长度 64KB，头部 5 字节',
    type: SDSType.SDS_TYPE_16,
  },
  {
    id: 'type_32',
    label: 'SDS_TYPE_32',
    description: '最大长度 4GB，头部 9 字节',
    type: SDSType.SDS_TYPE_32,
  },
  {
    id: 'type_64',
    label: 'SDS_TYPE_64',
    description: '最大长度 2^64，头部 17 字节',
    type: SDSType.SDS_TYPE_64,
  },
];

// 连接关系
const LINKS = [
  { source: 'start', target: 'len_le_32', condition: true },
  { source: 'len_le_32', target: 'type_5', condition: 'yes' },
  { source: 'len_le_32', target: 'len_le_256', condition: 'no' },
  { source: 'len_le_256', target: 'type_8', condition: 'yes' },
  { source: 'len_le_256', target: 'len_le_65535', condition: 'no' },
  { source: 'len_le_65535', target: 'type_16', condition: 'yes' },
  { source: 'len_le_65535', target: 'len_le_4294967295', condition: 'no' },
  { source: 'len_le_4294967295', target: 'type_32', condition: 'yes' },
  { source: 'len_le_4294967295', target: 'type_64', condition: 'no' },
];

export function D3TypeSelectionTree({
  selectedType,
  currentLength = 0,
  onTypeSelect,
  animated = true,
}: D3TypeSelectionTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  // 计算选中路径
  const getSelectedPath = (length: number): string[] => {
    const path: string[] = ['start'];
    if (length <= 32) {
      path.push('len_le_32', 'type_5');
    } else if (length <= 256) {
      path.push('len_le_32', 'len_le_256', 'type_8');
    } else if (length <= 65535) {
      path.push('len_le_32', 'len_le_256', 'len_le_65535', 'type_16');
    } else if (length <= 4294967295) {
      path.push('len_le_32', 'len_le_256', 'len_le_65535', 'len_le_4294967295', 'type_32');
    } else {
      path.push('len_le_32', 'len_le_256', 'len_le_65535', 'len_le_4294967295', 'type_64');
    }
    return path;
  };

  // 渲染决策树
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    // 清除现有内容
    svg.selectAll('*').remove();

    // 获取容器尺寸
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 设置 SVG 尺寸
    svg.attr('width', width).attr('height', height);

    // 布局参数
    const margin = { top: 30, right: 120, bottom: 30, left: 120 };
    const treeWidth = width - margin.left - margin.right;

    // 创建主 group
    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 绘制标题
    mainGroup
      .append('text')
      .attr('x', treeWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .attr('fill', '#334155')
      .text('SDS 类型选择判定树');

    // 获取选中路径
    const selectedPath = getSelectedPath(currentLength);

    // 创建节点映射
    const nodeMap = new Map<string, TreeNode>();
    TYPE_SELECTION_TREE.forEach((node) => {
      nodeMap.set(node.id, { ...node, isSelected: selectedPath.includes(node.id) });
    });

    // 计算节点位置
    const nodePositions: Record<string, { x: number; y: number }> = {};

    // 根节点位置
    nodePositions['start'] = { x: treeWidth / 2, y: 30 };

    // 条件节点位置（左侧）
    const conditionNodes = ['len_le_32', 'len_le_256', 'len_le_65535', 'len_le_4294967295'];
    const levelSpacing = 60;
    conditionNodes.forEach((nodeId, i) => {
      nodePositions[nodeId] = {
        x: margin.left + 50,
        y: 80 + i * levelSpacing,
      };
    });

    // 类型节点位置（右侧）
    const typeNodes = ['type_5', 'type_8', 'type_16', 'type_32', 'type_64'];
    const typeX = treeWidth - margin.left + 80;
    typeNodes.forEach((nodeId, i) => {
      nodePositions[nodeId] = {
        x: typeX,
        y: 30 + i * levelSpacing,
      };
    });

    // 绘制连接线
    const linkGroup = mainGroup.append('g').attr('class', 'links');

    LINKS.forEach((link) => {
      const source = nodePositions[link.source];
      const target = nodePositions[link.target];
      if (!source || !target) return;

      const isOnPath =
        selectedPath.includes(link.source) && selectedPath.includes(link.target);

      // 绘制连线
      const pathId = `link-${link.source}-${link.target}`;

      // 判断是向左还是向右连接
      const isRightward = target.x > source.x;

      if (isRightward) {
        // 向右的连接（条件到类型）
        const midX = (source.x + target.x) / 2;
        linkGroup
          .append('path')
          .attr('id', pathId)
          .attr('d', `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`)
          .attr('fill', 'none')
          .attr('stroke', isOnPath && animated ? '#22C55E' : '#CBD5E1')
          .attr('stroke-width', isOnPath && animated ? 2.5 : 1.5)
          .style('transition', animated ? 'stroke 0.5s ease' : 'none');
      } else {
        // 向左的连接（条件之间或到类型）
        linkGroup
          .append('path')
          .attr('id', pathId)
          .attr('d', `M ${source.x} ${source.y} L ${target.x} ${target.y}`)
          .attr('fill', 'none')
          .attr('stroke', isOnPath && animated ? '#22C55E' : '#CBD5E1')
          .attr('stroke-width', isOnPath && animated ? 2.5 : 1.5)
          .style('transition', animated ? 'stroke 0.5s ease' : 'none');

        // 添加箭头标记
        linkGroup
          .append('text')
          .attr('font-size', 10)
          .attr('fill', '#94A3B8')
          .attr('text-anchor', 'middle')
          .append('textPath')
          .attr('href', `#${pathId}`)
          .attr('startOffset', '50%')
          .text(link.condition === 'yes' ? '是' : link.condition === 'no' ? '否' : '');
      }
    });

    // 绘制节点
    const nodeGroup = mainGroup.append('g').attr('class', 'nodes');

    // 绘制条件节点（左侧）
    conditionNodes.forEach((nodeId) => {
      const node = nodeMap.get(nodeId);
      const pos = nodePositions[nodeId];
      if (!node || !pos) return;

      const isOnPath = selectedPath.includes(nodeId);

      const g = nodeGroup.append('g').attr('class', `node condition-node-${nodeId}`);

      // 节点背景
      g.append('rect')
        .attr('x', pos.x - 70)
        .attr('y', pos.y - 20)
        .attr('width', 140)
        .attr('height', 40)
        .attr('rx', 8)
        .attr('fill', isOnPath && animated ? '#DCFCE7' : '#FFFFFF')
        .attr('stroke', isOnPath && animated ? '#22C55E' : '#CBD5E1')
        .attr('stroke-width', isOnPath && animated ? 2 : 1.5)
        .attr('cursor', 'pointer')
        .style('transition', animated ? 'all 0.3s ease' : 'none')
        .on('mouseover', function (event) {
          d3.select(this).attr('fill', '#F0FDF4');
          const [x, y] = d3.pointer(event, container);
          setTooltip({
            visible: true,
            x,
            y,
            content: `${node.label}\n${node.description}`,
          });
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', isOnPath && animated ? '#DCFCE7' : '#FFFFFF');
          setTooltip((prev) => ({ ...prev, visible: false }));
        });

      // 节点标签
      g.append('text')
        .attr('x', pos.x)
        .attr('y', pos.y + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', '#0F172A')
        .text(node.label);
    });

    // 绘制类型节点（右侧）
    typeNodes.forEach((nodeId) => {
      const node = nodeMap.get(nodeId);
      const pos = nodePositions[nodeId];
      if (!node || !pos) return;

      const isSelected = selectedType === node.type;

      const g = nodeGroup.append('g').attr('class', `node type-node-${nodeId}`);

      // 节点背景
      g.append('rect')
        .attr('x', pos.x - 70)
        .attr('y', pos.y - 20)
        .attr('width', 140)
        .attr('height', 40)
        .attr('rx', 8)
        .attr('fill', isSelected && animated ? '#DBEAFE' : '#FFFFFF')
        .attr('stroke', isSelected && animated ? '#3B82F6' : '#CBD5E1')
        .attr('stroke-width', isSelected && animated ? 2.5 : 1.5)
        .attr('cursor', 'pointer')
        .style('transition', animated ? 'all 0.3s ease' : 'none')
        .on('mouseover', function (event) {
          d3.select(this).attr('fill', '#EFF6FF');
          const [x, y] = d3.pointer(event, container);
          setTooltip({
            visible: true,
            x,
            y,
            content: `${node.label}\n${node.description}\n点击选择此类型`,
          });
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', isSelected && animated ? '#DBEAFE' : '#FFFFFF');
          setTooltip((prev) => ({ ...prev, visible: false }));
        })
        .on('click', () => {
          if (node.type) {
            onTypeSelect?.(node.type);
          }
        });

      // 节点标签
      g.append('text')
        .attr('x', pos.x)
        .attr('y', pos.y + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', isSelected ? '#1D4ED8' : '#0F172A')
        .text(node.label);

      // 最大长度标签
      if (node.type) {
        const maxLen = SDS_MAX_LENGTH[node.type];
        const maxLenText = maxLen < 1000 ? `${maxLen}` : `${(maxLen / 1024).toFixed(0)}KB`;

        g.append('text')
          .attr('x', pos.x)
          .attr('y', pos.y + 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .attr('fill', '#64748B')
          .text(`最大: ${maxLenText}`);
      }
    });

    // 绘制起始节点
    const startNode = nodeMap.get('start');
    const startPos = nodePositions['start'];
    if (startNode && startPos) {
      const g = nodeGroup.append('g').attr('class', 'node start-node');

      g.append('ellipse')
        .attr('cx', startPos.x)
        .attr('cy', startPos.y)
        .attr('rx', 60)
        .attr('ry', 25)
        .attr('fill', '#FEF3C7')
        .attr('stroke', '#F59E0B')
        .attr('stroke-width', 2)
        .attr('cursor', 'pointer')
        .on('mouseover', function (event) {
          d3.select(this).attr('fill', '#FDE68A');
          const [x, y] = d3.pointer(event, container);
          setTooltip({
            visible: true,
            x,
            y,
            content: `${startNode.label}\n${startNode.description}`,
          });
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#FEF3C7');
          setTooltip((prev) => ({ ...prev, visible: false }));
        });

      g.append('text')
        .attr('x', startPos.x)
        .attr('y', startPos.y + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('fill', '#92400E')
        .text(startNode.label);
    }

    // 添加动画效果
    if (animated) {
      nodeGroup
        .selectAll('rect, ellipse')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay((_, i) => i * 50)
        .attr('opacity', 1);

      linkGroup
        .selectAll('path')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(300)
        .attr('opacity', 1);
    }
  }, [selectedType, currentLength, animated, onTypeSelect]);

  return (
    <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">SDS 类型选择判定流程</h3>

      <div ref={containerRef} className="relative w-full h-[500px] bg-slate-50 rounded-lg overflow-hidden">
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
          <div className="w-4 h-4 rounded bg-amber-100 border border-amber-400" />
          <span className="text-slate-600">起始节点</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white border border-slate-300" />
          <span className="text-slate-600">条件判断</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-400" />
          <span className="text-slate-600">类型节点</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-green-500" />
          <span className="text-slate-600">选中路径</span>
        </div>
      </div>

      {/* 当前长度信息 */}
      <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
        <span className="text-slate-600">当前长度: </span>
        <span className="font-semibold text-slate-800">{currentLength} bytes</span>
        {selectedType && (
          <>
            <span className="text-slate-400 mx-2">|</span>
            <span className="text-slate-600">选中类型: </span>
            <span className="font-semibold text-blue-600">{selectedType}</span>
          </>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-500">
        点击类型节点选择该类型，高亮路径显示基于当前长度的类型判定流程
      </p>
    </div>
  );
}
