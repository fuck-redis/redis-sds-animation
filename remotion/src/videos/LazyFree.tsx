/**
 * Lazy Free Animation
 * A-4: 惰性释放动画 (18s)
 *
 * 知识点：
 * 1. 惰性释放不立即回收可用空间
 * 2. 保留 free 空间供下次 append 使用
 * 3. 减少内存碎片
 * 4. 时间换空间策略
 * 5. sdsRemoveFreeSpace() 才会真正释放
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
  amber: '#F59E0B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
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
        maxWidth: '400px',
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

function CharCell({ char, delay, bgColor, textColor, borderColor, isFreed = false }: {
  char: string; delay: number; bgColor: string; textColor: string; borderColor?: string; isFreed?: boolean
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
        width: '38px',
        height: '38px',
        backgroundColor: isFreed ? '#374151' : bgColor,
        borderRadius: '6px',
        border: `2px solid ${isFreed ? '#4B5563' : (borderColor || bgColor)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 2px',
      }}
    >
      <span style={{
        color: isFreed ? '#9CA3AF' : textColor,
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'monospace',
        textDecoration: isFreed ? 'line-through' : 'none',
      }}>
        {char}
      </span>
    </div>
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
    <div style={{
      opacity: progress,
      color,
      fontSize: '14px',
      fontFamily: 'Space Grotesk, sans-serif',
      marginTop: '10px',
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
        fontSize: '14px',
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

function Arrow({ delay, text }: { delay: number; text?: string }) {
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
      fontSize: '28px',
      color: COLORS.highlight,
      margin: '20px 0',
    }}>
      {text || '↓'}
    </div>
  );
}

function StatBox({ label, value, delay, color }: { label: string; value: string; delay: number; color: string }) {
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
        textAlign: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        padding: '8px 16px',
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        border: `2px solid ${color}`,
      }}
    >
      <div style={{ fontSize: '11px', color: COLORS.secondary, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '22px', color, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function StepCard({ step, title, children, delay, color }: {
  step: number; title: string; children: React.ReactNode; delay: number; color: string
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
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: '14px 20px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 15}px)`,
        marginTop: '12px',
        minWidth: '320px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: '#000',
        }}>
          {step}
        </div>
        <div style={{ color, fontSize: '15px', fontWeight: 700 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

export const LazyFree: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="惰性释放" delay={0} />
          <AnimatedText text="Lazy Free Space" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* 概念解释 */}
      <Sequence from={90} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="什么是惰性释放？" delay={90} size="32px" color={COLORS.highlight} />

          <KnowledgeCard
            title="核心思想"
            content="释放字符串时，不立即回收 free 空间，而是保留供下次追加使用"
            delay={130}
            color={COLORS.accent}
          />

          <KnowledgeCard
            title="优势"
            content="减少内存碎片 | 避免频繁分配 | 提升追加性能"
            delay={180}
            color={COLORS.blue}
          />
        </div>
      </Sequence>

      {/* Before Section */}
      <Sequence from={240} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Label text='原字符串: "Hello World"' delay={240} color={COLORS.text} />

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <CharCell char="H" delay={260} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="e" delay={270} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="l" delay={280} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="l" delay={290} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="o" delay={300} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char=" " delay={310} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="W" delay={320} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="o" delay={330} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="r" delay={340} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="l" delay={350} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="d" delay={360} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="\0" delay={370} bgColor="#166534" textColor="#F0FDF4" borderColor={COLORS.accent} />
            <CharCell char="·" delay={380} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={390} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={400} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <StatBox label="len" value="11" delay={420} color={COLORS.blue} />
            <StatBox label="alloc" value="16" delay={435} color={COLORS.purple} />
            <StatBox label="free" value="5" delay={450} color={COLORS.highlight} />
          </div>
        </div>
      </Sequence>

      {/* Arrow */}
      <Sequence from={420} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CodeBlock code="sdsRemoveFreeSpace(s)  // 惰性释放" delay={430} color={COLORS.amber} />
          <Arrow delay={470} />
        </div>
      </Sequence>

      {/* After Section - Lazy Free */}
      <Sequence from={510} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Label text="惰性释放后" delay={510} color={COLORS.text} />

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <CharCell char="H" delay={530} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="e" delay={540} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="l" delay={550} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="l" delay={560} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="o" delay={570} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char=" " delay={580} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="W" delay={590} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="o" delay={600} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="r" delay={610} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="l" delay={620} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="d" delay={630} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="\0" delay={640} bgColor="#166534" textColor="#F0FDF4" borderColor={COLORS.accent} />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <StatBox label="len" value="11" delay={660} color={COLORS.blue} />
            <StatBox label="alloc" value="12" delay={675} color={COLORS.purple} />
            <StatBox label="free" value="1" delay={690} color={COLORS.highlight} />
          </div>

          <KnowledgeCard
            title="注意"
            content="free 空间从 5 减少到 1，但物理内存并未真正释放"
            delay={720}
            color={COLORS.amber}
          />
        </div>
      </Sequence>

      {/* 下次追加的优势 */}
      <Sequence from={720} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="惰性释放的优势" delay={720} size="28px" color={COLORS.accent} />

          <div style={{ display: 'flex', gap: '30px', marginTop: '25px' }}>
            <StepCard step={1} title="保留 free 空间" delay={770} color={COLORS.blue}>
              <CodeBlock code="下次 append 无需扩容" delay={790} color={COLORS.secondary} />
              <CodeBlock code="alloc 足够容纳新数据" delay={810} color={COLORS.accent} />
            </StepCard>

            <StepCard step={2} title="减少内存碎片" delay={780} color={COLORS.purple}>
              <CodeBlock code="避免频繁的 realloc" delay={800} color={COLORS.secondary} />
              <CodeBlock code="内存布局更稳定" delay={820} color={COLORS.accent} />
            </StepCard>
          </div>
        </div>
      </Sequence>

      {/* 真正的释放 */}
      <Sequence from={900} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="真正的空间释放" delay={900} size="28px" color={COLORS.highlight} />

          <KnowledgeCard
            title="sdsRemoveFreeSpace()"
            content="真正释放 free 空间，使 alloc == len + 1"
            delay={950}
            color={COLORS.highlight}
          />

          <KnowledgeCard
            title="使用场景"
            content="确定不再追加时调用 | 内存紧张时调用 | 主动释放内存"
            delay={1000}
            color={COLORS.amber}
          />
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1080} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="时间换空间：保留空间换取更好的性能" delay={1080} color={COLORS.accent} size="22px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
