/**
 * Type Switching Animation
 * A-5: 类型切换动画 (20s)
 *
 * 知识点：
 * 1. SDS 有 5 种内部类型：TYPE_5/8/16/32/64
 * 2. 根据字符串长度自动选择最优类型
 * 3. 不同类型的 Header 大小不同
 * 4. 优化内存效率：小字符串用小 Header
 * 5. 平衡灵活性与内存开销
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
  rose: '#F43F5E',
  amber: '#F59E0B',
  emerald: '#10B981',
  blue: '#3B82F6',
  purple: '#A855F7',
  orange: '#F97316',
  cyan: '#06B6D4',
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

function TypeCard({ name, size, header, delay, color, isHighlighted, capacity }: {
  name: string; size: string; header: string; delay: number; color: string; isHighlighted: boolean; capacity: string;
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
        backgroundColor: isHighlighted ? `${color}20` : '#1E293B',
        borderRadius: '12px',
        border: `3px solid ${color}`,
        opacity: progress,
        transform: `scale(${progress}) ${isHighlighted ? 'scale(1.08)' : ''}`,
        margin: isHighlighted ? '0 12px' : '0 8px',
        boxShadow: isHighlighted ? `0 0 25px ${color}50` : 'none',
        minWidth: '100px',
      }}
    >
      <div style={{ fontSize: '11px', color: COLORS.secondary, marginBottom: '4px' }}>容量</div>
      <div style={{ fontSize: '22px', color, fontWeight: 700 }}>{size}</div>
      <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 600, marginTop: '6px' }}>{name}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{ fontSize: '11px', color: COLORS.secondary }}>Header: {header}</div>
      </div>
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
      fontSize: '16px',
      fontFamily: 'Space Grotesk, sans-serif',
      marginTop: '15px',
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
        fontSize: '14px',
        fontFamily: 'monospace',
        color: color || COLORS.accent,
        margin: '5px 0',
        borderLeft: `3px solid ${color || COLORS.accent}`,
      }}
    >
      {code}
    </div>
  );
}

function RuleCard({ type, condition, header, delay, color }: {
  type: string; condition: string; header: string; delay: number; color: string;
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
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '10px 16px',
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateX(${(1 - progress) * -20}px)`,
        margin: '6px 0',
        minWidth: '380px',
      }}
    >
      <div style={{ padding: '4px 10px', backgroundColor: color, borderRadius: '4px', fontSize: '12px', fontWeight: 700, color: '#000' }}>
        {type}
      </div>
      <div style={{ flex: 1, color: COLORS.text, fontSize: '13px', fontFamily: 'monospace' }}>{condition}</div>
      <div style={{ color: COLORS.secondary, fontSize: '12px' }}>Header: {header}</div>
    </div>
  );
}

export const TypeSwitching: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="SDS 类型切换" delay={0} />
          <AnimatedText text="5 种优化类型" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* 类型概览 */}
      <Sequence from={90} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="5 种内部类型" delay={90} size="32px" color={COLORS.highlight} />

          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '30px' }}>
            <TypeCard name="TYPE_5" size="32B" header="1B" delay={130} color={COLORS.rose} isHighlighted={false} capacity="≤32" />
            <TypeCard name="TYPE_8" size="256B" header="3B" delay={160} color={COLORS.amber} isHighlighted={false} capacity="≤256" />
            <TypeCard name="TYPE_16" size="64KB" header="5B" delay={190} color={COLORS.emerald} isHighlighted={true} capacity="≤64KB" />
            <TypeCard name="TYPE_32" size="4GB" header="9B" delay={220} color={COLORS.blue} isHighlighted={false} capacity="≤4GB" />
            <TypeCard name="TYPE_64" size="2^64" header="17B" delay={250} color={COLORS.purple} isHighlighted={false} capacity=">4GB" />
          </div>

          <Label text="根据字符串长度自动选择最优类型" delay={290} color={COLORS.text} />
        </div>
      </Sequence>

      {/* 类型选择规则 */}
      <Sequence from={330} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="类型选择规则" delay={330} color={COLORS.highlight} size="28px" />

          <div style={{ marginTop: '20px' }}>
            <RuleCard type="TYPE_5" condition="len < 32" header="1B" delay={380} color={COLORS.rose} />
            <RuleCard type="TYPE_8" condition="len < 256" header="3B" delay={420} color={COLORS.amber} />
            <RuleCard type="TYPE_16" condition="len < 64KB" header="5B" delay={460} color={COLORS.emerald} />
            <RuleCard type="TYPE_32" condition="len < 4GB" header="9B" delay={500} color={COLORS.blue} />
            <RuleCard type="TYPE_64" condition="len >= 4GB" header="17B" delay={540} color={COLORS.purple} />
          </div>
        </div>
      </Sequence>

      {/* 设计原理 */}
      <Sequence from={570} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="设计原理" delay={570} size="28px" color={COLORS.accent} />

          <div style={{ display: 'flex', gap: '25px', marginTop: '25px' }}>
            <KnowledgeCard
              title="小对象优化"
              content="短字符串用小 Header，减少元数据开销"
              delay={620}
              color={COLORS.rose}
            />
            <KnowledgeCard
              title="大对象扩展"
              content="长字符串支持大容量的类型"
              delay={660}
              color={COLORS.blue}
            />
          </div>

          <KnowledgeCard
            title="flags 字段"
            content="低 3 位存储类型标识：0=TYPE_5, 1=TYPE_8, 2=TYPE_16, 3=TYPE_32, 4=TYPE_64"
            delay={700}
            color={COLORS.highlight}
          />
        </div>
      </Sequence>

      {/* 内存效率对比 */}
      <Sequence from={780} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="内存效率对比" delay={780} size="28px" color={COLORS.text} />

          <div style={{ display: 'flex', gap: '30px', marginTop: '25px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: COLORS.rose }}>1B</div>
              <div style={{ fontSize: '14px', color: COLORS.secondary, marginTop: '5px' }}>TYPE_5 Header</div>
              <div style={{ fontSize: '12px', color: COLORS.text, marginTop: '10px' }}>存 "Hi" 只需要 4B</div>
            </div>
            <div style={{ fontSize: '36px', color: COLORS.secondary }}>vs</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: COLORS.blue }}>17B</div>
              <div style={{ fontSize: '14px', color: COLORS.secondary, marginTop: '5px' }}>TYPE_64 Header</div>
              <div style={{ fontSize: '12px', color: COLORS.text, marginTop: '10px' }}>存 "Hi" 也需要 20B</div>
            </div>
          </div>

          <CodeBlock code="如果都用 TYPE_64: 存 1 字符 = 17B header + 2B = 19B" delay={900} color={COLORS.secondary} />
          <CodeBlock code="使用 TYPE_5: 存 1 字符 = 1B header + 2B = 3B" delay={940} color={COLORS.accent} />
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1020} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="智能类型自适应" delay={1020} size="28px" color={COLORS.accent} />
          <Label text="平衡内存效率与灵活性" delay={1060} color={COLORS.secondary} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
