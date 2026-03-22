/**
 * Type Selection Decision Tree Animation
 * A-11: 类型选择判定树 (18s)
 *
 * 知识点：
 * 1. SDS 根据字符串长度自动选择最优类型
 * 2. 五种类型对应不同的长度阈值
 * 3. 类型选择是 O(1) 时间复杂度
 * 4. flags 字段的低 3 位存储类型信息
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

function DecisionNode({ condition, delay, x, y, width = 160 }: { condition: string; delay: number; x: number; y: number; width?: number }) {
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
        position: 'absolute',
        left: x,
        top: y,
        padding: '10px 14px',
        backgroundColor: '#1E293B',
        border: `2px solid ${COLORS.amber}`,
        borderRadius: '10px',
        opacity: progress,
        transform: `scale(${progress})`,
        width: width,
        textAlign: 'center',
        boxShadow: `0 4px 20px ${COLORS.amber}30`,
      }}
    >
      <div style={{ color: COLORS.amber, fontSize: '13px', fontFamily: 'monospace' }}>{condition}</div>
    </div>
  );
}

function ResultNode({ typeName, size, header, delay, x, y, color }: {
  typeName: string; size: string; header: string; delay: number; x: number; y: number; color: string
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
        position: 'absolute',
        left: x,
        top: y,
        padding: '10px 14px',
        backgroundColor: color + '20',
        border: `2px solid ${color}`,
        borderRadius: '10px',
        opacity: progress,
        transform: `scale(${progress})`,
        textAlign: 'center',
        minWidth: '80px',
      }}
    >
      <div style={{ color: COLORS.text, fontSize: '15px', fontWeight: 700 }}>{typeName}</div>
      <div style={{ color, fontSize: '11px', marginTop: '4px' }}>{size}</div>
      <div style={{ color: COLORS.secondary, fontSize: '10px' }}>header: {header}</div>
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
      marginTop: '15px',
      textAlign: 'center',
    }}>
      {text}
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
        padding: '10px 14px',
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateX(${(1 - progress) * -20}px)`,
        margin: '6px 0',
        minWidth: '360px',
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

function TypeSummaryCard({ type, capacity, delay, color }: {
  type: string; capacity: string; delay: number; color: string;
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
        padding: '8px 14px',
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `scale(${progress})`,
        textAlign: 'center',
      }}
    >
      <div style={{ color, fontSize: '12px', fontWeight: 700 }}>{type}</div>
      <div style={{ color: COLORS.text, fontSize: '11px' }}>{capacity}</div>
    </div>
  );
}

export const TypeSelection: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="类型选择判定" delay={0} />
          <AnimatedText text="SDS 内部类型决策流程" delay={35} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* Decision Tree */}
      <Sequence from={90} durationInFrames={420}>
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Root Decision */}
          <DecisionNode condition="len < 32?" delay={100} x={320} y={50} />

          {/* Level 2 */}
          <ResultNode typeName="TYPE_5" size="<=32B" header="1B" delay={150} x={100} y={150} color={COLORS.rose} />
          <DecisionNode condition="len < 256?" delay={160} x={350} y={150} />

          {/* Level 3 */}
          <ResultNode typeName="TYPE_8" size="<=256B" header="3B" delay={220} x={200} y={250} color={COLORS.amber} />
          <DecisionNode condition="len < 64KB?" delay={230} x={400} y={250} />

          {/* Level 4 */}
          <ResultNode typeName="TYPE_16" size="<=64KB" header="5B" delay={300} x={340} y={350} color={COLORS.emerald} />
          <DecisionNode condition="len < 4GB?" delay={310} x={480} y={350} />

          {/* Level 5 */}
          <ResultNode typeName="TYPE_32" size="<=4GB" header="9B" delay={380} x={440} y={450} color={COLORS.blue} />
          <ResultNode typeName="TYPE_64" size=">4GB" header="17B" delay={390} x={600} y={450} color={COLORS.purple} />

          {/* Arrows (using lines) */}
          <div style={{
            position: 'absolute',
            left: 395,
            top: 80,
            width: '2px',
            height: '70px',
            backgroundColor: COLORS.secondary,
            opacity: 0.5,
          }} />
        </div>
      </Sequence>

      {/* Summary Table */}
      <Sequence from={510} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="类型速查表" delay={510} color={COLORS.highlight} size="28px" />

          <div style={{ display: 'flex', gap: '15px', marginTop: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <TypeSummaryCard type="TYPE_5" capacity="<32B" delay={560} color={COLORS.rose} />
            <TypeSummaryCard type="TYPE_8" capacity="<256B" delay={590} color={COLORS.amber} />
            <TypeSummaryCard type="TYPE_16" capacity="<64KB" delay={620} color={COLORS.emerald} />
            <TypeSummaryCard type="TYPE_32" capacity="<4GB" delay={650} color={COLORS.blue} />
            <TypeSummaryCard type="TYPE_64" capacity=">=4GB" delay={680} color={COLORS.purple} />
          </div>

          <Label text="根据长度自动选择最优类型，平衡效率与扩展性" delay={720} color={COLORS.secondary} />
        </div>
      </Sequence>

      {/* Rules Detail */}
      <Sequence from={720} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="选择规则详解" delay={720} size="28px" color={COLORS.text} />

          <div style={{ marginTop: '20px' }}>
            <RuleCard type="TYPE_5" condition="len < 32" header="1B" delay={770} color={COLORS.rose} />
            <RuleCard type="TYPE_8" condition="32 <= len < 256" header="3B" delay={810} color={COLORS.amber} />
            <RuleCard type="TYPE_16" condition="256 <= len < 64KB" header="5B" delay={850} color={COLORS.emerald} />
            <RuleCard type="TYPE_32" condition="64KB <= len < 4GB" header="9B" delay={890} color={COLORS.blue} />
            <RuleCard type="TYPE_64" condition="len >= 4GB" header="17B" delay={930} color={COLORS.purple} />
          </div>
        </div>
      </Sequence>

      {/* O(1) Type Selection */}
      <Sequence from={930} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="O(1) 类型判断" delay={930} size="28px" color={COLORS.accent} />

          <KnowledgeCard
            title="如何实现 O(1)？"
            content="flags 字段的低 3 位直接存储类型，无需遍历，直接按位与获取"
            delay={990}
            color={COLORS.blue}
          />

          <KnowledgeCard
            title="flags 结构"
            content="0=TYPE_5, 1=TYPE_8, 2=TYPE_16, 3=TYPE_32, 4=TYPE_64"
            delay={1040}
            color={COLORS.purple}
          />
        </div>
      </Sequence>

      {/* End */}
      <Sequence from={1110} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="智能类型自适应" delay={1110} color={COLORS.accent} size="28px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
