/**
 * SDSNEW Operation Animation
 * A-8: sdsnew 创建流程 (20s)
 *
 * 知识点：
 * 1. sdsnew 是创建 SDS 字符串的主要 API
 * 2. 根据字符串长度选择最优类型
 * 3. Header 和 Buffer 连续内存分布
 * 4. 返回指向数据的指针，不暴露 Header 位置
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

function CodeLine({ code, delay, isComment = false, color }: { code: string; delay: number; isComment?: boolean; color?: string }) {
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
        transform: `translateX(${(1 - progress) * -20}px)`,
        color: isComment ? COLORS.secondary : (color || COLORS.accent),
        fontSize: '15px',
        fontFamily: 'monospace',
        margin: '6px 0',
      }}
    >
      {code}
    </div>
  );
}

function MemoryBlock({ label, content, delay, color, width = 50 }: { label: string; content: string; delay: number; color: string; width?: number }) {
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
        width: `${width}px`,
        height: '45px',
        backgroundColor: color,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 4px',
      }}
    >
      <div style={{ fontSize: '10px', color: '#000', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '12px', color: '#000', fontWeight: 700, fontFamily: 'monospace' }}>{content}</div>
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
      fontSize: '24px',
      color: COLORS.highlight,
      margin: '15px 0',
    }}>
      {text || '↓'}
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
      textAlign: 'center',
    }}>
      {text}
    </div>
  );
}

function StepCard({ step, title, children, delay, color }: {
  step: number; title: string; children: React.ReactNode; delay: number; color: string;
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

export const SdsNewOperation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="sdsnew" delay={0} />
          <AnimatedText text="创建 SDS 字符串" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* API Declaration */}
      <Sequence from={90} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Label text="函数声明" delay={90} color={COLORS.highlight} />

          <div style={{ backgroundColor: '#1E293B', padding: '16px 24px', borderRadius: '10px', marginTop: '12px' }}>
            <CodeLine code="sds sdsnew(const char *init);" delay={110} />
            <CodeLine code="// 创建包含指定内容的 SDS" delay={130} isComment />
          </div>

          <KnowledgeCard
            title="返回值"
            content="返回指向数据的指针，隐藏了 Header 的位置"
            delay={160}
            color={COLORS.blue}
          />
        </div>
      </Sequence>

      {/* Step 1: Calculate length */}
      <Sequence from={240} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={1} title="计算长度并选择类型" delay={240} color={COLORS.blue}>
            <CodeLine code='sds sdsnew("Hello");  // init = "Hello"' delay={260} />
            <CodeLine code="strlen(init) = 5" delay={280} />
            <CodeLine code="5 < 32 → 选择 TYPE_5" delay={300} color={COLORS.accent} />
          </StepCard>

          <Arrow delay={350} />
        </div>
      </Sequence>

      {/* Step 2: Allocate memory */}
      <Sequence from={390} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={2} title="分配内存" delay={390} color={COLORS.purple}>
            <CodeLine code="TYPE_5 Header: 1 byte" delay={410} />
            <CodeLine code="Buffer: len + 1 = 6 bytes" delay={430} />
            <CodeLine code="Total: 7 bytes" delay={450} color={COLORS.highlight} />
          </StepCard>

          <Arrow delay={500} />
        </div>
      </Sequence>

      {/* Step 3: Memory Layout */}
      <Sequence from={540} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={3} title="内存布局" delay={540} color={COLORS.highlight}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <MemoryBlock label="flags" content="0" delay={570} color={COLORS.redis} width={45} />
              <Arrow delay={590} text="|" />
              <MemoryBlock label="H" content="H" delay={600} color={COLORS.accent} width={35} />
              <MemoryBlock label="e" content="e" delay={615} color={COLORS.accent} width={35} />
              <MemoryBlock label="l" content="l" delay={630} color={COLORS.accent} width={35} />
              <MemoryBlock label="l" content="l" delay={645} color={COLORS.accent} width={35} />
              <MemoryBlock label="o" content="o" delay={660} color={COLORS.accent} width={35} />
              <MemoryBlock label="\\0" content="\\0" delay={675} color={COLORS.blue} width={35} />
            </div>
            <Label text="flags=0 表示 TYPE_5" delay={700} color={COLORS.secondary} />
          </StepCard>

          <Arrow delay={740} />
        </div>
      </Sequence>

      {/* Step 4: Return pointer */}
      <Sequence from={780} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={4} title="返回指针" delay={780} color={COLORS.accent}>
            <CodeLine code="return buf;  // 指向数据的指针" delay={800} />
            <CodeLine code="// 不暴露 header 位置，封装实现细节" delay={820} isComment />
          </StepCard>

          <KnowledgeCard
            title="封装设计"
            content="SDS 对外表现为普通字符串，但内部包含了高效操作的元数据"
            delay={870}
            color={COLORS.blue}
          />
        </div>
      </Sequence>

      {/* Summary */}
      <Sequence from={960} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="sdsnew 工作流程" delay={960} size="28px" color={COLORS.highlight} />

          <div style={{ display: 'flex', gap: '20px', marginTop: '25px' }}>
            <StatBox label="1. 计算长度" value="O(n)" delay={1010} color={COLORS.blue} />
            <StatBox label="2. 选择类型" value="O(1)" delay={1030} color={COLORS.purple} />
            <StatBox label="3. 分配内存" value="O(1)" delay={1050} color={COLORS.highlight} />
            <StatBox label="4. 返回指针" value="O(1)" delay={1070} color={COLORS.accent} />
          </div>

          <Label text="总复杂度 O(n)，但创建后操作都是 O(1)" delay={1100} color={COLORS.text} />
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1170} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="SDS 封装隐藏实现细节" delay={1170} color={COLORS.secondary} size="24px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
