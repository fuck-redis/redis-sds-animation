/**
 * Pre-allocation Strategy Animation
 * A-3: 预分配策略动画 (20s)
 *
 * 知识点：
 * 1. SDS 追加操作时的预分配策略
 * 2. 小字符串 (< 1MB): alloc = len * 2
 * 3. 大字符串 (>= 1MB): alloc = len + 1MB
 * 4. 预分配减少内存分配次数，提升性能
 * 5. 均摊 O(1) 的扩容成本
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
  blue: '#3B82F6',
  amber: '#F59E0B',
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

function CharCell({ char, delay, bgColor, textColor, scale = 1, isNew = false }: {
  char: string; delay: number; bgColor: string; textColor: string; scale?: number; isNew?: boolean
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
        width: `${36 * scale}px`,
        height: `${36 * scale}px`,
        backgroundColor: bgColor,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 2px',
        boxShadow: isNew ? `0 0 15px ${COLORS.amber}60` : 'none',
      }}
    >
      <span style={{ color: textColor, fontSize: `${13 * scale}px`, fontWeight: 600, fontFamily: 'monospace' }}>{char}</span>
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
      transform: `translateY(${(1 - progress) * -10}px)`,
      fontSize: '28px',
      color: COLORS.highlight,
      margin: '15px 0',
    }}>
      {text || '↓'}
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
        minWidth: '350px',
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

export const PreAllocation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="空间预分配策略" delay={0} />
          <AnimatedText text="SDS 的智能内存管理" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* Before sdscat */}
      <Sequence from={90} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Label text='Before append: "Hello"' delay={90} color={COLORS.text} />

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <CharCell char="H" delay={110} bgColor="#1E3A8A" textColor="#93C5FD" />
            <CharCell char="e" delay={120} bgColor="#1E3A8A" textColor="#93C5FD" />
            <CharCell char="l" delay={130} bgColor="#1E3A8A" textColor="#93C5FD" />
            <CharCell char="l" delay={140} bgColor="#1E3A8A" textColor="#93C5FD" />
            <CharCell char="o" delay={150} bgColor="#1E3A8A" textColor="#93C5FD" />
            <CharCell char="\0" delay={160} bgColor="#1D4ED8" textColor="#FFFFFF" />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <StatBox label="len" value="5" delay={180} color={COLORS.blue} />
            <StatBox label="alloc" value="5" delay={195} color={COLORS.secondary} />
          </div>

          <KnowledgeCard
            title="问题"
            content="追加 6 字符时，5 + 6 = 11 > alloc(5)，需要扩容"
            delay={220}
            color={COLORS.amber}
          />
        </div>
      </Sequence>

      {/* Arrow with sdscat */}
      <Sequence from={270} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CodeBlock code='sdscat(s, " World")  // 追加 " World"' delay={280} color={COLORS.amber} />
          <Arrow delay={320} text="扩容中..." />
        </div>
      </Sequence>

      {/* After sdscat */}
      <Sequence from={360} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Label text='After append: "Hello World"' delay={360} color={COLORS.text} />

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <CharCell char="H" delay={380} bgColor="#14532D" textColor="#86EFAC" />
            <CharCell char="e" delay={390} bgColor="#14532D" textColor="#86EFAC" />
            <CharCell char="l" delay={400} bgColor="#14532D" textColor="#86EFAC" />
            <CharCell char="l" delay={410} bgColor="#14532D" textColor="#86EFAC" />
            <CharCell char="o" delay={420} bgColor="#14532D" textColor="#86EFAC" />
            <CharCell char=" " delay={430} bgColor={COLORS.amber} textColor="#FFFFFF" isNew={true} />
            <CharCell char="W" delay={440} bgColor={COLORS.amber} textColor="#FFFFFF" isNew={true} />
            <CharCell char="o" delay={450} bgColor={COLORS.amber} textColor="#FFFFFF" isNew={true} />
            <CharCell char="r" delay={460} bgColor={COLORS.amber} textColor="#FFFFFF" isNew={true} />
            <CharCell char="l" delay={470} bgColor={COLORS.amber} textColor="#FFFFFF" isNew={true} />
            <CharCell char="d" delay={480} bgColor={COLORS.amber} textColor="#FFFFFF" isNew={true} />
            <CharCell char="\0" delay={490} bgColor="#166534" textColor="#F0FDF4" />
            <CharCell char="·" delay={500} bgColor="#1E293B" textColor="#64748B" />
            <CharCell char="·" delay={510} bgColor="#1E293B" textColor="#64748B" />
            <CharCell char="·" delay={520} bgColor="#1E293B" textColor="#64748B" />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <StatBox label="len" value="11" delay={540} color={COLORS.accent} />
            <StatBox label="alloc" value="16" delay={560} color={COLORS.highlight} />
          </div>

          <CodeBlock code="alloc = len * 2 = 11 * 1.5 ≈ 16" delay={590} color={COLORS.highlight} />
        </div>
      </Sequence>

      {/* 预分配策略详解 */}
      <Sequence from={570} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="预分配策略公式" delay={570} color={COLORS.highlight} size="32px" />

          <StepCard step={1} title="小字符串 (< 1MB)" delay={620} color={COLORS.accent}>
            <CodeBlock code="alloc = len * 2" delay={640} color={COLORS.accent} />
            <Label text="双倍分配，减少分配次数" delay={670} color={COLORS.secondary} />
          </StepCard>

          <StepCard step={2} title="大字符串 (>= 1MB)" delay={720} color={COLORS.purple}>
            <CodeBlock code="alloc = len + 1MB" delay={740} color={COLORS.purple} />
            <Label text="固定增量，避免过度分配" delay={770} color={COLORS.secondary} />
          </StepCard>

          <KnowledgeCard
            title="性能优势"
            content="n 次追加只需要 O(n) 次内存分配，均摊成本为 O(1)"
            delay={810}
            color={COLORS.highlight}
          />
        </div>
      </Sequence>

      {/* 实际案例 */}
      <Sequence from={810} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="实际案例分析" delay={810} size="28px" color={COLORS.text} />

          <div style={{ display: 'flex', gap: '30px', marginTop: '25px' }}>
            <StepCard step={1} title="追加 1000 次" delay={860} color={COLORS.blue}>
              <CodeBlock code="每次追加 1 字符" delay={880} color={COLORS.secondary} />
              <CodeBlock code="C String: 1000 次分配" delay={900} color={COLORS.amber} />
              <CodeBlock code="SDS: ~10 次分配" delay={920} color={COLORS.accent} />
            </StepCard>

            <StepCard step={2} title="追加大字符串" delay={870} color={COLORS.purple}>
              <CodeBlock code="追加 2MB 字符串" delay={890} color={COLORS.secondary} />
              <CodeBlock code="alloc = 2MB + 1MB" delay={910} color={COLORS.purple} />
              <CodeBlock code="避免频繁扩容" delay={930} color={COLORS.accent} />
            </StepCard>
          </div>
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={990} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="时间换空间策略，显著提升性能" delay={990} color={COLORS.accent} size="24px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
