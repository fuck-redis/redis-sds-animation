/**
 * SDS Memory Layout Animation
 * A-1: SDS 内存布局动画 (20s)
 *
 * 知识点：
 * 1. SDS 包含 Header 和 Buffer 两部分
 * 2. Header 包含 len、alloc、flags 三个字段
 * 3. O(1) 长度获取的原理
 * 4. 不同类型 (TYPE_5/8/16/32/64) 的 Header 大小
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// 颜色配置 - 统一的颜色方案
const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
  header: '#3B82F6',
  buffer: '#8B5CF6',
  gradient: {
    start: '#1E293B',
    end: '#0F172A',
  },
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
        padding: '12px 20px',
        backgroundColor: '#1E293B',
        borderRadius: '10px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 20}px)`,
        marginTop: '15px',
        maxWidth: '450px',
      }}
    >
      <div style={{ color, fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{title}</div>
      <div style={{ color: COLORS.text, fontSize: '13px', opacity: 0.9 }}>{content}</div>
    </div>
  );
}

interface AnimatedProps {
  delay?: number;
}

function AnimatedText({ text, delay = 0, color = COLORS.text, size = '48px' }: AnimatedProps & { text: string; color?: string; size?: string }) {
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

function Subtitle({ text, delay = 0 }: { text: string; delay: number }) {
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
        fontSize: '20px',
        fontFamily: 'Space Grotesk, sans-serif',
        textAlign: 'center',
        marginTop: '12px',
      }}
    >
      {text}
    </div>
  );
}

function HeaderCell({ label, value, delay, color }: { label: string; value: string | number; delay: number; color: string }) {
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
        width: '100px',
        height: '70px',
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `3px solid ${color}`,
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 8px',
        boxShadow: `0 4px 20px ${color}30`,
      }}
    >
      <div style={{ fontSize: '11px', color: COLORS.secondary, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '26px', color: color, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function BufferCell({ char, index, delay, isUsed }: { char: string; index: number; delay: number; isUsed: boolean }) {
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
        width: '45px',
        height: '45px',
        backgroundColor: isUsed ? COLORS.accent : '#1E293B',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 3px',
        border: isUsed ? `2px solid ${COLORS.accent}` : `2px solid ${COLORS.secondary}`,
        boxShadow: isUsed ? `0 0 15px ${COLORS.accent}40` : 'none',
      }}
    >
      <div style={{ fontSize: '9px', color: isUsed ? '#000' : COLORS.secondary }}>{index}</div>
      <div style={{ fontSize: '16px', color: isUsed ? '#000' : COLORS.secondary, fontWeight: 600 }}>{char}</div>
    </div>
  );
}

function MemoryArrow({ delay }: { delay: number }) {
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
        width: '4px',
        height: '35px',
        backgroundColor: COLORS.highlight,
        opacity: progress,
        transform: `scaleY(${progress})`,
        margin: '15px 0',
      }}
    />
  );
}

function Label({ text, delay, color }: { text: string; delay: number; color: string }) {
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
        color: color,
        fontSize: '14px',
        fontFamily: 'Space Grotesk, sans-serif',
        opacity: progress,
        marginTop: '8px',
      }}
    >
      {text}
    </div>
  );
}

function SectionDivider({ text, delay }: { text: string; delay: number }) {
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
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        opacity: progress,
        marginTop: '25px',
      }}
    >
      <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.secondary, opacity: 0.3 }} />
      <div style={{ color: COLORS.highlight, fontSize: '14px', fontWeight: 600 }}>{text}</div>
      <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.secondary, opacity: 0.3 }} />
    </div>
  );
}

export const SdsMemoryLayout: React.FC = () => {
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
          <AnimatedText text="SDS 内存布局" delay={0} />
          <Subtitle text="Simple Dynamic String 结构详解" delay={20} />
          <SectionDivider text="核心数据结构" delay={50} />
        </div>
      </Sequence>

      {/* Header 字段详解 */}
      <Sequence from={90} durationInFrames={180}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="SDS Header" delay={90} size="36px" />

          <div style={{ display: 'flex', marginTop: '25px' }}>
            <HeaderCell label="len" value={6} delay={120} color={COLORS.header} />
            <HeaderCell label="alloc" value={8} delay={140} color={COLORS.buffer} />
            <HeaderCell label="flags" value="0" delay={160} color={COLORS.redis} />
          </div>

          <SectionDivider text="字段说明" delay={200} />

          <KnowledgeCard
            title="len - 字符串长度"
            content="已使用的字符数，O(1) 时间复杂度获取，无需遍历"
            delay={220}
            color={COLORS.header}
          />

          <KnowledgeCard
            title="alloc - 分配空间"
            content="总分配的字符空间，包括 \\0，alloc >= len + 1"
            delay={250}
            color={COLORS.buffer}
          />

          <KnowledgeCard
            title="flags - 类型标识"
            content="低3位存储类型：TYPE_5(0), TYPE_8(1), TYPE_16(2), TYPE_32(3), TYPE_64(4)"
            delay={280}
            color={COLORS.redis}
          />
        </div>
      </Sequence>

      {/* Buffer 数据区域 */}
      <Sequence from={330} durationInFrames={180}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="Buffer 数据区域" delay={330} size="36px" color={COLORS.highlight} />

          <MemoryArrow delay={360} />

          <div style={{ display: 'flex' }}>
            <BufferCell char="H" index={0} delay={380} isUsed={true} />
            <BufferCell char="e" index={1} delay={390} isUsed={true} />
            <BufferCell char="l" index={2} delay={400} isUsed={true} />
            <BufferCell char="l" index={3} delay={410} isUsed={true} />
            <BufferCell char="o" index={4} delay={420} isUsed={true} />
            <BufferCell char="\0" index={5} delay={430} isUsed={true} />
            <BufferCell char="·" index={6} delay={440} isUsed={false} />
            <BufferCell char="·" index={7} delay={450} isUsed={false} />
          </div>

          <SectionDivider text="空间统计" delay={480} />

          <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <Label text="已用" delay={500} color={COLORS.accent} />
              <div style={{ fontSize: '28px', color: COLORS.accent, fontWeight: 700 }}>6</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Label text="空闲" delay={520} color={COLORS.secondary} />
              <div style={{ fontSize: '28px', color: COLORS.secondary, fontWeight: 700 }}>2</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Label text="总分配" delay={540} color={COLORS.highlight} />
              <div style={{ fontSize: '28px', color: COLORS.highlight, fontWeight: 700 }}>8</div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* 内存布局图示 */}
      <Sequence from={510} durationInFrames={180}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="完整内存布局" delay={510} size="32px" color={COLORS.text} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
            {/* Header 部分 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{
                width: '35px', height: '45px',
                backgroundColor: COLORS.header + '40',
                border: `2px solid ${COLORS.header}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: COLORS.header,
              }}>len</div>
              <div style={{
                width: '40px', height: '45px',
                backgroundColor: COLORS.buffer + '40',
                border: `2px solid ${COLORS.buffer}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: COLORS.buffer,
              }}>alloc</div>
              <div style={{
                width: '25px', height: '45px',
                backgroundColor: COLORS.redis + '40',
                border: `2px solid ${COLORS.redis}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: COLORS.redis,
              }}>flags</div>
            </div>

            <div style={{ color: COLORS.secondary, fontSize: '24px' }}>|</div>

            {/* Buffer 部分 */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·'].map((char, i) => (
                <div key={i} style={{
                  width: '28px', height: '45px',
                  backgroundColor: i < 6 ? COLORS.accent + '40' : '#1E293B',
                  border: `2px solid ${i < 6 ? COLORS.accent : COLORS.secondary}`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: i < 6 ? COLORS.accent : COLORS.secondary,
                  fontFamily: 'monospace',
                }}>{char}</div>
              ))}
            </div>
          </div>

          <KnowledgeCard
            title="设计优势"
            content="Header 和 Buffer 连续内存分布，通过 len 字段实现 O(1) 长度获取，二进制安全"
            delay={580}
            color={COLORS.accent}
          />
        </div>
      </Sequence>

      {/* 总结 */}
      <Sequence from={690} durationInFrames={90}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatedText text="核心要点" delay={690} size="28px" color={COLORS.highlight} />
          <div style={{ display: 'flex', gap: '25px', marginTop: '20px' }}>
            <KnowledgeCard title="O(1) 长度" content="通过 len 字段" delay={720} color={COLORS.header} />
            <KnowledgeCard title="空间预分配" content="减少内存分配" delay={750} color={COLORS.buffer} />
            <KnowledgeCard title="惰性释放" content="延迟回收空间" delay={780} color={COLORS.accent} />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
