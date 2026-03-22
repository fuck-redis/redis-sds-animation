/**
 * SDS Structure Visualization Canvas
 * 可拖拽、可缩放、可叠加分镜标注
 * 使用 framer-motion 实现流畅动画
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Move, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { SDSState } from '@/types/sds';
import { useStore } from '@/store/useStore';
import {
  AnimatedCell,
  AnimatedArrow,
  AnimatedAnnotation,
} from './AnimatedElements';

interface SDSStructureProps {
  sds: SDSState;
}

interface Point {
  x: number;
  y: number;
}

interface HeaderBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const HEADER_BOXES: Record<'len' | 'alloc' | 'flags', HeaderBox> = {
  len: { x: 120, y: 64, width: 190, height: 88 },
  alloc: { x: 360, y: 64, width: 190, height: 88 },
  flags: { x: 600, y: 64, width: 190, height: 88 },
};

const CELL_WIDTH = 62;
const CELL_HEIGHT = 44;
const CELL_GAP_X = 14;
const CELL_GAP_Y = 32;
const BUFFER_START_X = 80;
const BUFFER_START_Y = 230;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseBufferTarget(target: string): number | null {
  const match = target.match(/^buf\[(\d+)\]$/);
  if (!match) return null;
  return Number(match[1]);
}

function computeCellsPerRow(total: number): number {
  if (total <= 12) return total;
  if (total <= 24) return 12;
  return 16;
}

export function SDSStructure({ sds }: SDSStructureProps) {
  const { animationState } = useStore();
  const currentStep = animationState.steps[animationState.currentStep];

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 1000, height: 640 });

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const interactedRef = useRef(false);

  const cellsPerRow = useMemo(() => computeCellsPerRow(sds.buf.length), [sds.buf.length]);
  const rowCount = useMemo(() => Math.ceil(sds.buf.length / cellsPerRow), [cellsPerRow, sds.buf.length]);

  const contentSize = useMemo(() => {
    const width = Math.max(920, BUFFER_START_X + cellsPerRow * (CELL_WIDTH + CELL_GAP_X) + 120);
    const height = Math.max(560, BUFFER_START_Y + rowCount * (CELL_HEIGHT + CELL_GAP_Y) + 120);
    return { width, height };
  }, [cellsPerRow, rowCount]);

  useEffect(() => {
    const observeTarget = wrapperRef.current;
    if (!observeTarget) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(observeTarget);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (interactedRef.current) return;
    setTransform({
      x: (viewport.width - contentSize.width) / 2,
      y: (viewport.height - contentSize.height) / 2,
      scale: 1,
    });
  }, [contentSize.height, contentSize.width, viewport.height, viewport.width]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: MouseEvent) => {
      const state = dragRef.current;
      if (!state) return;
      setTransform((prev) => ({
        ...prev,
        x: state.originX + (event.clientX - state.startX),
        y: state.originY + (event.clientY - state.startY),
      }));
    };

    const onUp = () => {
      setDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const cellPosition = (index: number): Point => {
    const col = index % cellsPerRow;
    const row = Math.floor(index / cellsPerRow);
    return {
      x: BUFFER_START_X + col * (CELL_WIDTH + CELL_GAP_X),
      y: BUFFER_START_Y + row * (CELL_HEIGHT + CELL_GAP_Y),
    };
  };

  const getTargetCenter = (target: string): Point => {
    if (target === 'len' || target === 'alloc' || target === 'flags') {
      const box = HEADER_BOXES[target];
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }

    if (target === 'header') {
      return { x: 450, y: 110 };
    }

    if (target === 'buffer') {
      return { x: BUFFER_START_X + 140, y: BUFFER_START_Y + 20 };
    }

    const index = parseBufferTarget(target);
    if (index !== null && index < sds.buf.length) {
      const pos = cellPosition(index);
      return { x: pos.x + CELL_WIDTH / 2, y: pos.y + CELL_HEIGHT / 2 };
    }

    return { x: contentSize.width / 2, y: contentSize.height / 2 };
  };

  const isHeaderActive = (name: 'len' | 'alloc' | 'flags') => {
    if (!currentStep) return false;
    if (currentStep.target === name) return true;
    if (currentStep.target === 'header' && (currentStep.type === 'highlight' || currentStep.type === 'calculation')) {
      return true;
    }
    return false;
  };

  const isCellActive = (index: number): boolean => {
    if (!currentStep) return false;
    return currentStep.target === `buf[${index}]`;
  };

  const variables = currentStep?.debug?.variables ?? {};

  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200 p-3 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-800">SDS 可视化画布</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="canvas-tool-btn"
            onClick={() => {
              interactedRef.current = true;
              setTransform((prev) => ({ ...prev, scale: clamp(prev.scale * 1.1, 0.4, 3) }));
            }}
            title="放大"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            className="canvas-tool-btn"
            onClick={() => {
              interactedRef.current = true;
              setTransform((prev) => ({ ...prev, scale: clamp(prev.scale / 1.1, 0.4, 3) }));
            }}
            title="缩小"
          >
            <ZoomOut size={14} />
          </button>
          <button
            type="button"
            className="canvas-tool-btn"
            onClick={() => {
              interactedRef.current = false;
              setTransform({
                x: (viewport.width - contentSize.width) / 2,
                y: (viewport.height - contentSize.height) / 2,
                scale: 1,
              });
            }}
            title="重置视图"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        <div className="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
          <div className="text-slate-500">当前阶段</div>
          <div className="font-semibold text-slate-800">{currentStep?.phase || '等待执行'}</div>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded px-2 py-1">
          <div className="text-slate-500">步骤</div>
          <div className="font-semibold text-slate-800">
            {animationState.totalSteps > 0 ? `${animationState.currentStep + 1}/${animationState.totalSteps}` : '-'}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1">
          <div className="text-slate-500">缩放</div>
          <div className="font-semibold text-slate-800">{(transform.scale * 100).toFixed(0)}%</div>
        </div>
      </div>

      {Object.keys(variables).length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {Object.entries(variables).map(([name, value]) => (
            <span key={name} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded">
              <strong>{name}</strong>
              <span>=</span>
              <span>{String(value)}</span>
            </span>
          ))}
        </div>
      )}

      <div
        ref={wrapperRef}
        className="canvas-wrapper flex-1"
        onWheel={(event) => {
          event.preventDefault();
          interactedRef.current = true;
          const rect = event.currentTarget.getBoundingClientRect();
          const cursorX = event.clientX - rect.left;
          const cursorY = event.clientY - rect.top;

          setTransform((prev) => {
            const nextScale = clamp(event.deltaY < 0 ? prev.scale * 1.08 : prev.scale / 1.08, 0.4, 3);
            const worldX = (cursorX - prev.x) / prev.scale;
            const worldY = (cursorY - prev.y) / prev.scale;
            return {
              scale: nextScale,
              x: cursorX - worldX * nextScale,
              y: cursorY - worldY * nextScale,
            };
          });
        }}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          interactedRef.current = true;
          setDragging(true);
          dragRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: transform.x,
            originY: transform.y,
          };
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <marker
              id="flow-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L8,4 L0,8 z" fill="#0F766E" />
            </marker>
          </defs>

          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            <rect x={0} y={0} width={contentSize.width} height={contentSize.height} fill="#F8FAFC" rx={16} />

            <text x={90} y={38} fontSize={14} fill="#334155" fontWeight={700}>
              SDS Header + Buffer
            </text>
            <text x={260} y={38} fontSize={11} fill="#64748B">
              拖动平移（{dragging ? '进行中' : '按住左键'}）
            </text>
            <g transform="translate(560, 24)">
              <Move size={14} />
            </g>

            {(Object.keys(HEADER_BOXES) as Array<keyof typeof HEADER_BOXES>).map((key) => {
              const box = HEADER_BOXES[key];
              const active = isHeaderActive(key);
              const value = key === 'len' ? sds.len : key === 'alloc' ? sds.alloc : sds.type;

              return (
                <g key={key}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    rx={10}
                    fill={active ? '#DCFCE7' : '#FFFFFF'}
                    stroke={active ? '#16A34A' : '#CBD5E1'}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  <text x={box.x + 14} y={box.y + 24} fontSize={12} fill="#64748B">
                    {key}
                  </text>
                  <text x={box.x + 14} y={box.y + 58} fontSize={24} fill="#0F172A" fontWeight={700}>
                    {String(value)}
                  </text>
                </g>
              );
            })}

            <text x={BUFFER_START_X} y={BUFFER_START_Y - 20} fontSize={13} fill="#334155" fontWeight={600}>
              Buffer ({sds.alloc + 1} bytes)
            </text>

            {sds.buf.map((char, index) => {
              const pos = cellPosition(index);
              const isUsed = index < sds.len;
              const isTerminator = index === sds.len && char === '\\0';
              const active = isCellActive(index);

              return (
                <AnimatedCell
                  key={`cell-${index}-${char}`}
                  index={index}
                  x={pos.x}
                  y={pos.y}
                  char={char}
                  isUsed={isUsed}
                  isTerminator={isTerminator}
                  isActive={active}
                />
              );
            })}

            {currentStep?.visual?.arrows?.map((arrow, index) => (
              <AnimatedArrow
                key={`arrow-${index}-${arrow.fromTarget}-${arrow.toTarget}`}
                arrow={arrow}
                index={index}
                getTargetCenter={getTargetCenter}
              />
            ))}

            {currentStep?.visual?.annotations?.map((annotation, index) => {
              const point = getTargetCenter(annotation.target);
              const yOffset = 20 + index * 18;

              return (
                <AnimatedAnnotation
                  key={`annotation-${index}-${annotation.target}`}
                  text={annotation.text}
                  x={point.x}
                  y={point.y - yOffset}
                  tone={annotation.tone || 'info'}
                  index={index}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>已用 {sds.len} / 分配 {sds.alloc}</span>
        <span>空闲 {sds.alloc - sds.len} bytes</span>
      </div>
    </section>
  );
}
