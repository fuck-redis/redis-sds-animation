/**
 * SDSCAT Append Operation Animation
 * A-9: sdscat 追加操作 (20s)
 *
 * 知识点：
 * 1. sdscat 将一个字符串追加到另一个SDS末尾
 * 2. 追加前检查 alloc 空间是否足够
 * 3. 空间不足时调用 sdsMakeRoomFor 扩容
 * 4. 预分配策略减少内存分配次数
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

function CodeLine({ code, delay, color }: { code: string; delay: number; color?: string }) {
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
        color: color || COLORS.accent,
        fontSize: '14px',
        fontFamily: 'monospace',
        margin: '5px 0',
      }}
    >
      {code}
    </div>
  );
}

function CharCell({ char, delay, bgColor, textColor, borderColor, isNew = false }: {
  char: string; delay: number; bgColor: string; textColor: string; borderColor?: string; isNew?: boolean;
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
        backgroundColor: bgColor,
        borderRadius: '5px',
        border: `2px solid ${borderColor || bgColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 2px',
        boxShadow: isNew ? `0 0 12px ${COLORS.amber}50` : 'none',
      }}
    >
      <span style={{ color: textColor, fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{char}</span>
    </div>
  );
}

function HeaderBlock({ label, value, delay, color, borderColor }: { label: string; value: string | number; delay: number; color: string; borderColor?: string }) {
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
        padding: '6px 12px',
        backgroundColor: '#1E293B',
        borderRadius: '6px',
        border: `2px solid ${borderColor || color}`,
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 4px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '10px', color: COLORS.secondary }}>{label}</div>
      <div style={{ fontSize: '18px', color, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Label({ text, delay, color }: { text: string; delay: number; color: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    delay,
    fps,
    config: { damping: 200, stiffness: 200 },
  });

  return (
    <div style={{ opacity: progress, color, fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif', marginTop: '10px' }}>
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

export const SdscatOperation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="sdscat" delay={0} />
          <AnimatedText text="追加字符串操作" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* API */}
      <Sequence from={90} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Label text="函数声明" delay={90} color={COLORS.highlight} />

          <div style={{ backgroundColor: '#1E293B', padding: '14px 20px', borderRadius: '10px', marginTop: '12px' }}>
            <CodeLine code="sds sdscat(sds s, const char *t);" delay={110} />
          </div>

          <KnowledgeCard
            title="功能"
            content="将字符串 t 追加到 s 的末尾"
            delay={150}
            color={COLORS.blue}
          />
        </div>
      </Sequence>

      {/* Before State */}
      <Sequence from={240} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={1} title="初始状态" delay={240} color={COLORS.blue}>
            <Label text='s = "Hello" (len=5, alloc=5)' delay={260} color={COLORS.text} />

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <HeaderBlock label="len" value={5} delay={280} color={COLORS.blue} />
              <HeaderBlock label="alloc" value={5} delay={290} color={COLORS.purple} />
            </div>

            <div style={{ display: 'flex', marginTop: '12px' }}>
              <CharCell char="H" delay={310} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="e" delay={320} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="l" delay={330} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="l" delay={340} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="o" delay={350} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="\0" delay={360} bgColor="#166534" textColor="#F0FDF4" borderColor={COLORS.accent} />
            </div>
          </StepCard>
        </div>
      </Sequence>

      {/* Arrow with operation */}
      <Sequence from={420} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#1E293B', padding: '14px 20px', borderRadius: '10px' }}>
            <CodeLine code='sdscat(s, " World");  // 追加 " World"' delay={430} color={COLORS.amber} />
          </div>
        </div>
      </Sequence>

      {/* Check and Expand */}
      <Sequence from={510} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={2} title="检查空间" delay={510} color={COLORS.amber}>
            <CodeLine code="len + addlen = 5 + 6 = 11" delay={530} />
            <CodeLine code="11 > alloc(5) → 需要扩容!" delay={550} color={COLORS.red} />
          </StepCard>

          <StepCard step={3} title="扩容 (预分配)" delay={610} color={COLORS.purple}>
            <CodeLine code="alloc = len * 2 = 11 * 1.5 ≈ 16" delay={630} color={COLORS.accent} />
            <Label text="调用 sdsMakeRoomFor() 内部扩容" delay={660} color={COLORS.secondary} />
          </StepCard>
        </div>
      </Sequence>

      {/* After State */}
      <Sequence from={780} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepCard step={4} title="扩容后" delay={780} color={COLORS.accent}>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <HeaderBlock label="len" value={11} delay={800} color={COLORS.accent} />
              <HeaderBlock label="alloc" value={16} delay={810} color={COLORS.highlight} />
            </div>

            <div style={{ display: 'flex', marginTop: '12px' }}>
              <CharCell char="H" delay={840} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="e" delay={850} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="l" delay={860} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="l" delay={870} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char="o" delay={880} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
              <CharCell char=" " delay={890} bgColor={COLORS.amber} textColor="#FFFFFF" borderColor={COLORS.amber} isNew={true} />
              <CharCell char="W" delay={900} bgColor={COLORS.amber} textColor="#FFFFFF" borderColor={COLORS.amber} isNew={true} />
              <CharCell char="o" delay={910} bgColor={COLORS.amber} textColor="#FFFFFF" borderColor={COLORS.amber} isNew={true} />
              <CharCell char="r" delay={920} bgColor={COLORS.amber} textColor="#FFFFFF" borderColor={COLORS.amber} isNew={true} />
              <CharCell char="l" delay={930} bgColor={COLORS.amber} textColor="#FFFFFF" borderColor={COLORS.amber} isNew={true} />
              <CharCell char="d" delay={940} bgColor={COLORS.amber} textColor="#FFFFFF" borderColor={COLORS.amber} isNew={true} />
              <CharCell char="\0" delay={950} bgColor="#166534" textColor="#F0FDF4" borderColor={COLORS.accent} />
              <CharCell char="·" delay={960} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
              <CharCell char="·" delay={970} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
              <CharCell char="·" delay={980} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            </div>

            <Label text='s = "Hello World" (len=11, alloc=16)' delay={1000} color={COLORS.text} />
          </StepCard>
        </div>
      </Sequence>

      {/* Pre-allocation Rules */}
      <Sequence from={990} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="预分配策略" delay={990} color={COLORS.highlight} size="28px" />

          <KnowledgeCard
            title="SDS_MAX_PREALLOC = 1024*1024 (1MB)"
            content="小于 1MB: alloc = len * 2 | 大于等于 1MB: alloc = len + 1MB"
            delay={1040}
            color={COLORS.blue}
          />

          <KnowledgeCard
            title="性能优化"
            content="减少内存分配次数，n 次追加只需要 O(n) 次分配"
            delay={1090}
            color={COLORS.accent}
          />
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1170} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="减少频繁 realloc，显著提升性能" delay={1170} color={COLORS.accent} size="22px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
