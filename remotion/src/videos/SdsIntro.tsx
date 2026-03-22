/**
 * SDS Introduction Video
 * 使用 Remotion 制作的 Redis SDS 简介动画
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { useCallback } from 'react';

// 颜色配置
const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
};

interface TextProps {
  text: string;
  delay?: number;
}

function AnimatedText({ text, delay = 0 }: TextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 200 },
  });

  const opacity = progress;
  const translateY = (1 - progress) * 20;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        color: COLORS.text,
        fontSize: '48px',
        fontWeight: 700,
        fontFamily: 'Space Grotesk, sans-serif',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
}

function Subtitle({ text, delay = 0 }: TextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 200 },
  });

  return (
    <div
      style={{
        opacity: progress,
        color: COLORS.secondary,
        fontSize: '24px',
        fontFamily: 'Space Grotesk, sans-serif',
        textAlign: 'center',
        marginTop: '20px',
      }}
    >
      {text}
    </div>
  );
}

function MemoryCell({ index, char, delay }: { index: number; char: string; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 150, stiffness: 200 },
  });

  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: COLORS.accent,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 4px',
      }}
    >
      <div style={{ fontSize: '10px', color: '#000', opacity: 0.6 }}>{index}</div>
      <div style={{ fontSize: '20px', color: '#000', fontWeight: 700 }}>{char}</div>
    </div>
  );
}

function HeaderField({ name, value, delay }: { name: string; value: string | number; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 150, stiffness: 200 },
  });

  return (
    <div
      style={{
        padding: '10px 20px',
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        margin: '0 8px',
        opacity: progress,
      }}
    >
      <div style={{ fontSize: '14px', color: COLORS.secondary }}>{name}</div>
      <div style={{ fontSize: '32px', color: COLORS.text, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export const SdsIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="Redis SDS" delay={0} />
          <div
            style={{
              width: '100px',
              height: '4px',
              backgroundColor: COLORS.redis,
              margin: '20px 0',
              transform: 'scaleX(0)',
            }}
          />
          <Subtitle text="Simple Dynamic Strings" delay={20} />
        </div>
      </Sequence>

      {/* SDS 结构展示 */}
      <Sequence from={90} durationInFrames={150}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="SDS 数据结构" delay={90} />

          {/* Header */}
          <div
            style={{
              display: 'flex',
              marginTop: '40px',
              marginBottom: '30px',
            }}
          >
            <HeaderField name="len" value={6} delay={110} />
            <HeaderField name="alloc" value={8} delay={120} />
            <HeaderField name="flags" value="0" delay={130} />
          </div>

          {/* Buffer */}
          <div style={{ display: 'flex' }}>
            <MemoryCell index={0} char="H" delay={140} />
            <MemoryCell index={1} char="e" delay={145} />
            <MemoryCell index={2} char="l" delay={150} />
            <MemoryCell index={3} char="l" delay={155} />
            <MemoryCell index={4} char="o" delay={160} />
            <MemoryCell index={5} char="\0" delay={165} />
            <MemoryCell index={6} char="·" delay={170} />
            <MemoryCell index={7} char="·" delay={175} />
          </div>

          <Subtitle text="O(1) 长度获取 | 空间预分配 | 惰性释放" delay={190} />
        </div>
      </Sequence>

      {/* vs C String */}
      <Sequence from={240} durationInFrames={150}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="vs C String" delay={240} />
          <div
            style={{
              display: 'flex',
              gap: '60px',
              marginTop: '40px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: COLORS.highlight, fontSize: '24px', marginBottom: '10px' }}>
                C String
              </div>
              <div style={{ color: COLORS.secondary, fontSize: '18px' }}>O(n) 长度</div>
              <div style={{ color: COLORS.secondary, fontSize: '18px' }}>无预分配</div>
              <div style={{ color: COLORS.secondary, fontSize: '18px' }}>手动的空间管理</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: COLORS.accent, fontSize: '24px', marginBottom: '10px' }}>
                SDS
              </div>
              <div style={{ color: COLORS.accent, fontSize: '18px' }}>O(1) 长度</div>
              <div style={{ color: COLORS.accent, fontSize: '18px' }}>空间预分配</div>
              <div style={{ color: COLORS.accent, fontSize: '18px' }}>惰性释放</div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* 结束 */}
      <Sequence from={390} durationInFrames={60}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="下一章：SDS 结构详解" delay={390} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
