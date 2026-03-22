/**
 * Binary Safe Comparison Animation
 * A-7: 二进制安全对比 (18s)
 *
 * 知识点：
 * 1. C String 依赖 \0 判断字符串结束
 * 2. C String 无法存储包含 \0 的二进制数据
 * 3. SDS 通过 len 字段判断长度，支持二进制数据
 * 4. 适用于图片、音频、视频、协议数据等
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
  red: '#EF4444',
  darkRed: '#991B1B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  amber: '#F59E0B',
};

// 知识卡片组件
function KnowledgeCard({ title, content, delay, color }: { title: string; content: string; delay: number; color: string }) {
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
        padding: '12px 18px',
        backgroundColor: '#1E293B',
        borderRadius: '10px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 15}px)`,
        marginTop: '12px',
        maxWidth: '420px',
      }}
    >
      <div style={{ color, fontSize: '13px', fontWeight: 700, marginBottom: '5px' }}>{title}</div>
      <div style={{ color: COLORS.text, fontSize: '12px', opacity: 0.9 }}>{content}</div>
    </div>
  );
}

function AnimatedText({ text, delay = 0, color = COLORS.text, size = '48px' }: { text: string; delay?: number; color?: string; size?: string }) {
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
        transform: `translateY(${(1 - progress) * 20}px)`,
        color,
        fontSize: size,
        fontWeight: 700,
        fontFamily: 'Space Grotesk, sans-serif',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
}

function CharCell({ char, delay, bgColor, textColor, isLost = false }: {
  char: string; delay: number; bgColor: string; textColor: string; isLost?: boolean;
}) {
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
        width: '34px',
        height: '34px',
        backgroundColor: isLost ? '#374151' : bgColor,
        borderRadius: '4px',
        border: `1px solid ${isLost ? '#4B5563' : bgColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isLost ? 0.4 : progress,
        transform: `scale(${progress})`,
        margin: '0 1px',
      }}
    >
      <span style={{
        color: isLost ? '#6B7280' : textColor,
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'monospace',
        textDecoration: isLost ? 'line-through' : 'none',
      }}>
        {char}
      </span>
    </div>
  );
}

function Label({ text, delay, color, size = '14px' }: { text: string; delay: number; color: string; size?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 200 },
  });

  return (
    <div style={{
      opacity: progress,
      color,
      fontSize: size,
      fontFamily: 'Space Grotesk, sans-serif',
      marginTop: '10px',
      textAlign: 'center',
    }}>
      {text}
    </div>
  );
}

function CodeBlock({ code, delay, color }: { code: string; delay: number; color?: string }) {
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
        opacity: progress,
        transform: `translateX(${(1 - progress) * -15}px)`,
        backgroundColor: '#1E293B',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'monospace',
        color: color || COLORS.accent,
        margin: '6px 0',
        borderLeft: `3px solid ${color || COLORS.accent}`,
      }}
    >
      {code}
    </div>
  );
}

function DataBox({ label, data, delay, color, lostCount }: {
  label: string; data: string[]; delay: number; color: string; lostCount?: number;
}) {
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
        padding: '14px 18px',
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `scale(${progress})`,
        minWidth: '300px',
      }}
    >
      <div style={{ color, fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {data.map((char, i) => (
          <div key={i} style={{
            padding: '4px 8px',
            backgroundColor: char === '\\0' ? color + '40' : '#1E293B',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: char === '\\0' ? color : COLORS.text,
          }}>
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ text, delay, color }: { text: string; delay: number; color: string }) {
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
        color,
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: 'Space Grotesk, sans-serif',
        marginBottom: '15px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      }}
    >
      {text}
    </div>
  );
}

function ComparisonBox({ left, right, delay }: { left: string; right: string; delay: number }) {
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
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        opacity: progress,
        marginTop: '15px',
      }}
    >
      <div style={{ padding: '8px 14px', backgroundColor: COLORS.darkRed + '40', borderRadius: '6px', color: COLORS.red, fontFamily: 'monospace', fontSize: '13px' }}>
        {left}
      </div>
      <div style={{ color: COLORS.highlight, fontSize: '20px' }}>→</div>
      <div style={{ padding: '8px 14px', backgroundColor: COLORS.accent + '30', borderRadius: '6px', color: COLORS.accent, fontFamily: 'monospace', fontSize: '13px' }}>
        {right}
      </div>
    </div>
  );
}

function WarningBox({ text, delay, color }: { text: string; delay: number; color: string }) {
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
        padding: '14px 20px',
        backgroundColor: '#1E293B',
        border: `3px solid ${color}`,
        borderRadius: '10px',
        opacity: progress,
        transform: `scale(${progress})`,
        marginTop: '15px',
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      <span style={{ color, fontSize: '16px', fontWeight: 700 }}>{text}</span>
    </div>
  );
}

export const BinarySafe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="二进制安全" delay={0} />
          <AnimatedText text="Binary Safe" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* 问题解释 */}
      <Sequence from={90} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="什么是二进制安全？" delay={90} size="32px" color={COLORS.highlight} />

          <KnowledgeCard
            title="定义"
            content="能够存储任意二进制数据，包括 \\0 等特殊字符"
            delay={140}
            color={COLORS.blue}
          />

          <KnowledgeCard
            title="C String 问题"
            content="使用 \\0 作为字符串结束标志，无法区分 \\0 是数据还是结束符"
            delay={190}
            color={COLORS.red}
          />
        </div>
      </Sequence>

      {/* Problem with C String */}
      <Sequence from={270} durationInFrames={270}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionLabel text="C String 的问题" delay={270} color={COLORS.red} />

          <DataBox
            label='存储数据: "hello\\0world" (11字节)'
            data={['h', 'e', 'l', 'l', 'o', '\\0', 'w', 'o', 'r', 'l', 'd']}
            delay={300}
            color={COLORS.red}
          />

          <ComparisonBox left="strlen() = 5" right="数据被截断!" delay={380} />

          <CodeBlock code='strlen("hello\\0world") = 5  // 遇到 \\0 就终止' delay={420} color={COLORS.red} />

          <WarningBox text="\\0 之后的数据完全丢失!" delay={470} color={COLORS.red} />
        </div>
      </Sequence>

      {/* SDS Solution */}
      <Sequence from={540} durationInFrames={300}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionLabel text="SDS 解决方案" delay={540} color={COLORS.accent} />

          <Label text="通过 len 字段判断长度，不依赖 \\0" delay={580} color={COLORS.secondary} />

          <DataBox
            label="SDS: len = 11 (完整存储)"
            data={['h', 'e', 'l', 'l', 'o', '\\0', 'w', 'o', 'r', 'l', 'd']}
            delay={620}
            color={COLORS.accent}
          />

          <ComparisonBox left="sds.len = 11" right="完整数据!" delay={700} />

          <CodeBlock code="sdslen(s) = 11  // 正确获取长度" delay={740} color={COLORS.accent} />

          <WarningBox text="SDS 支持存储任意二进制数据" delay={790} color={COLORS.accent} />
        </div>
      </Sequence>

      {/* Use Cases */}
      <Sequence from={840} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="SDS 适用场景" delay={840} size="28px" color={COLORS.highlight} />

          <div style={{ display: 'flex', gap: '25px', marginTop: '25px' }}>
            <KnowledgeCard
              title="多媒体数据"
              content="图片、音频、视频"
              delay={900}
              color={COLORS.blue}
            />
            <KnowledgeCard
              title="协议数据"
              content="Redis RESP 协议"
              delay={940}
              color={COLORS.purple}
            />
            <KnowledgeCard
              title="任意二进制"
              content="序列化数据等"
              delay={980}
              color={COLORS.accent}
            />
          </div>
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1020} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="二进制安全是 SDS 的核心优势" delay={1020} color={COLORS.accent} size="24px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
