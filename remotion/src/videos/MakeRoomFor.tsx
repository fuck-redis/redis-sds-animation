/**
 * sdsMakeRoomFor Animation
 * A-10: sdsMakeRoomFor 扩容 (20s)
 *
 * 知识点：
 * 1. sdsMakeRoomFor 确保 SDS 有足够的可用空间
 * 2. 检查 needed = sdslen(s) + addlen
 * 3. 小于 1MB 时加倍扩容，大于等于 1MB 时增加固定量
 * 4. 均摊 O(1) 的扩容成本
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

function CodeLine({ code, delay, color, indent = 0 }: { code: string; delay: number; color?: string; indent?: number }) {
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
        margin: '4px 0',
        paddingLeft: `${indent * 20}px`,
      }}
    >
      {code}
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
    <div style={{ opacity: progress, color, fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif', marginTop: '8px' }}>
      {text}
    </div>
  );
}

function StepBox({ step, title, children, delay, color }: { step: number; title: string; children: React.ReactNode; delay: number; color: string }) {
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
        transform: `translateY(${(1 - progress) * 20}px)`,
        marginTop: '15px',
        minWidth: '380px',
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

function ComparisonBox({ left, right, result, delay }: { left: string; right: string; result: string; delay: number }) {
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
        gap: '15px',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '10px 0',
      }}
    >
      <div style={{ padding: '8px 14px', backgroundColor: '#7F1D1D', borderRadius: '6px', color: '#FECACA', fontFamily: 'monospace', fontSize: '13px' }}>
        {left}
      </div>
      <div style={{ color: COLORS.secondary, fontSize: '18px' }}>→</div>
      <div style={{ padding: '8px 14px', backgroundColor: '#14532D', borderRadius: '6px', color: '#86EFAC', fontFamily: 'monospace', fontSize: '13px' }}>
        {right}
      </div>
      <div style={{ padding: '8px 14px', backgroundColor: '#1E293B', borderRadius: '6px', color: COLORS.highlight, fontFamily: 'monospace', fontSize: '13px', border: `1px solid ${COLORS.highlight}` }}>
        {result}
      </div>
    </div>
  );
}

function FormulaBox({ condition, formula, result, delay, color }: {
  condition: string; formula: string; result: string; delay: number; color: string;
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
        borderRadius: '10px',
        padding: '12px 16px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 15}px)`,
        margin: '8px 0',
        minWidth: '350px',
      }}
    >
      <div style={{ fontSize: '12px', color: COLORS.secondary, marginBottom: '6px' }}>{condition}</div>
      <div style={{ fontSize: '16px', color: color, fontFamily: 'monospace', fontWeight: 600 }}>{formula}</div>
      <div style={{ fontSize: '14px', color: COLORS.text, marginTop: '6px' }}>结果: <span style={{ color }}>{result}</span></div>
    </div>
  );
}

export const MakeRoomFor: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="sdsMakeRoomFor" delay={0} />
          <AnimatedText text="智能扩容内部实现" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* API */}
      <Sequence from={90} durationInFrames={120}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#1E293B', padding: '14px 20px', borderRadius: '10px' }}>
            <CodeLine code="sds sdsMakeRoomFor(sds s, size_t addlen);" delay={100} />
          </div>
          <Label text="确保 s 有至少 addlen 的可用空间" delay={130} color={COLORS.secondary} />
        </div>
      </Sequence>

      {/* Step 1 */}
      <Sequence from={210} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepBox step={1} title="检查可用空间" delay={210} color={COLORS.blue}>
            <CodeLine code="needed = sdslen(s) + addlen;" delay={230} />
            <ComparisonBox left="len=5, addlen=10" right="needed=15" result="需要 15" delay={260} />
          </StepBox>
        </div>
      </Sequence>

      {/* Step 2 */}
      <Sequence from={360} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepBox step={2} title="检查是否需要扩容" delay={360} color={COLORS.purple}>
            <CodeLine code="if (needed <= s->alloc) return s; // 无需扩容" delay={380} color={COLORS.accent} />
            <ComparisonBox left="alloc=16, needed=15" right="15 <= 16" result="无需扩容!" delay={420} />
          </StepBox>
        </div>
      </Sequence>

      {/* Step 3 - When expansion needed */}
      <Sequence from={510} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StepBox step={3} title="需要扩容时" delay={510} color={COLORS.amber}>
            <CodeLine code="if (needed < SDS_MAX_PREALLOC) {" delay={530} />
            <CodeLine code="    newlen = needed * 2;" delay={550} color={COLORS.blue} indent={1} />
            <CodeLine code="} else {" delay={570} />
            <CodeLine code="    newlen = needed + SDS_MAX_PREALLOC;" delay={590} color={COLORS.purple} indent={1} />
            <CodeLine code="}" delay={610} />
            <Label text="SDS_MAX_PREALLOC = 1024*1024 (1MB)" delay={640} color={COLORS.secondary} />
          </StepBox>
        </div>
      </Sequence>

      {/* Example calculation */}
      <Sequence from={720} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="扩容计算示例" delay={720} color={COLORS.highlight} size="28px" />

          <FormulaBox
            condition="场景: len=1000, addlen=100, alloc=1000"
            formula="1000 + 100 = 1100 > 1000"
            result="需要扩容!"
            delay={780}
            color={COLORS.amber}
          />

          <FormulaBox
            condition="1100 < 1MB (1048576)?"
            formula="newlen = 1100 * 2 = 2200"
            result="alloc = 2200"
            delay={850}
            color={COLORS.accent}
          />
        </div>
      </Sequence>

      {/* Large string example */}
      <Sequence from={930} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="大字符串扩容" delay={930} size="28px" color={COLORS.purple} />

          <FormulaBox
            condition="场景: len=2MB, addlen=1MB, alloc=2MB"
            formula="2MB + 1MB = 3MB >= 1MB"
            result="使用固定增量"
            delay={990}
            color={COLORS.purple}
          />

          <FormulaBox
            condition="大于等于 1MB 时的策略"
            formula="newlen = 3MB + 1MB = 4MB"
            result="alloc = 4MB"
            delay={1060}
            color={COLORS.highlight}
          />

          <KnowledgeCard
            title="为什么大字符串用固定增量？"
            content="避免双倍扩容消耗过多内存，平衡性能与内存使用"
            delay={1130}
            color={COLORS.blue}
          />
        </div>
      </Sequence>

      {/* Benefits */}
      <Sequence from={1230} durationInFrames={120}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="扩容优化策略" delay={1230} color={COLORS.accent} size="28px" />

          <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
            <KnowledgeCard title="小于 1MB" content="双倍扩容" delay={1280} color={COLORS.blue} />
            <KnowledgeCard title="大于等于 1MB" content="固定 +1MB" delay={1310} color={COLORS.purple} />
          </div>

          <Label text="减少内存碎片和分配次数" delay={1350} color={COLORS.highlight} />
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1440} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="Amortized O(1) 扩容成本" delay={1440} color={COLORS.secondary} size="24px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
