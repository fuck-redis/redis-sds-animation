/**
 * C String vs SDS Comparison Animation
 * A-2: C String vs SDS 对比 (18s)
 *
 * 知识点：
 * 1. C String 使用 \0 结尾，需要 O(n) 遍历获取长度
 * 2. SDS 使用 len 字段，O(1) 时间复杂度获取长度
 * 3. C String 无空间预分配，每次追加可能需要扩容
 * 4. SDS 有空间预分配策略，减少内存分配次数
 * 5. SDS 支持惰性释放，C String 手动管理
 */

import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const COLORS = {
  redis: '#DC2626',
  background: '#0F172A',
  text: '#F8FAFC',
  accent: '#22C55E',
  secondary: '#64748B',
  highlight: '#FACC15',
  cstring: '#EF4444',
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
        padding: '10px 16px',
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 15}px)`,
        marginTop: '10px',
        maxWidth: '380px',
      }}
    >
      <div style={{ color, fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>{title}</div>
      <div style={{ color: COLORS.text, fontSize: '11px', opacity: 0.9 }}>{content}</div>
    </div>
  );
}

// 代码块组件
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
        padding: '8px 14px',
        borderRadius: '6px',
        fontSize: '13px',
        fontFamily: 'monospace',
        color: color || COLORS.accent,
        margin: '4px 0',
      }}
    >
      {code}
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

function CharCell({ char, delay, bgColor, textColor }: { char: string; delay: number; bgColor: string; textColor: string }) {
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
        width: '40px',
        height: '40px',
        backgroundColor: bgColor,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 2px',
      }}
    >
      <span style={{ color: textColor, fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{char}</span>
    </div>
  );
}

function FeatureItem({ text, delay, isPositive, icon }: { text: string; delay: number; isPositive: boolean; icon?: string }) {
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
        transform: `translateX(${(1 - progress) * (isPositive ? -20 : 20)}px)`,
        fontSize: '16px',
        fontFamily: 'Space Grotesk, sans-serif',
        color: isPositive ? COLORS.accent : COLORS.cstring,
        margin: '6px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon || (isPositive ? '+' : '-')}</span>
      {text}
    </div>
  );
}

function ComparisonBox({ title, items, delay, color }: { title: string; items: { text: string; isPositive: boolean }[]; delay: number; color: string }) {
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
        padding: '16px 20px',
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `scale(${progress})`,
        minWidth: '280px',
      }}
    >
      <div style={{ color, fontSize: '18px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>{title}</div>
      {items.map((item, i) => (
        <FeatureItem key={i} text={item.text} delay={delay + i * 20} isPositive={item.isPositive} />
      ))}
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
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'Space Grotesk, sans-serif',
        marginTop: '15px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}
    >
      {text}
    </div>
  );
}

export const CStringVsSds: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="C String vs SDS" delay={0} />
          <AnimatedText text="两种字符串实现对比" delay={40} color={COLORS.secondary} size="22px" />
        </div>
      </Sequence>

      {/* C String 详解 */}
      <Sequence from={90} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionLabel text="C String" delay={90} color={COLORS.cstring} />

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <CharCell char="H" delay={120} bgColor="#7F1D1D" textColor="#FECACA" />
            <CharCell char="e" delay={130} bgColor="#7F1D1D" textColor="#FECACA" />
            <CharCell char="l" delay={140} bgColor="#7F1D1D" textColor="#FECACA" />
            <CharCell char="l" delay={150} bgColor="#7F1D1D" textColor="#FECACA" />
            <CharCell char="o" delay={160} bgColor="#7F1D1D" textColor="#FECACA" />
            <CharCell char="\0" delay={170} bgColor={COLORS.cstring} textColor="#FFFFFF" />
          </div>

          <CodeBlock code="strlen(s) = O(n) 需遍历整个字符串" delay={200} color={COLORS.cstring} />
          <CodeBlock code="遇到 \\0 终止，无法存储二进制" delay={230} color={COLORS.secondary} />

          <ComparisonBox
            title="C String 特点"
            items={[
              { text: 'O(n) 长度获取', isPositive: false },
              { text: '无空间预分配', isPositive: false },
              { text: '手动空间管理', isPositive: false },
              { text: '缓冲区溢出风险', isPositive: false },
            ]}
            delay={270}
            color={COLORS.cstring}
          />
        </div>
      </Sequence>

      {/* VS */}
      <Sequence from={330} durationInFrames={60}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 800,
            color: COLORS.highlight,
            textShadow: `0 0 30px ${COLORS.highlight}60`,
          }}>
            VS
          </div>
        </div>
      </Sequence>

      {/* SDS 详解 */}
      <Sequence from={390} durationInFrames={300}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionLabel text="SDS" delay={390} color={COLORS.accent} />

          {/* SDS 结构 */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
            <div style={{ padding: '6px 12px', backgroundColor: '#1E293B', borderRadius: '6px', border: `2px solid ${COLORS.blue}` }}>
              <div style={{ fontSize: '10px', color: COLORS.secondary }}>len</div>
              <div style={{ fontSize: '20px', color: COLORS.blue, fontWeight: 700 }}>5</div>
            </div>
            <div style={{ padding: '6px 12px', backgroundColor: '#1E293B', borderRadius: '6px', border: `2px solid ${COLORS.purple}` }}>
              <div style={{ fontSize: '10px', color: COLORS.secondary }}>alloc</div>
              <div style={{ fontSize: '20px', color: COLORS.purple, fontWeight: 700 }}>8</div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '15px' }}>
            <CharCell char="H" delay={440} bgColor="#14532D" textColor="#BBF7D0" />
            <CharCell char="e" delay={450} bgColor="#14532D" textColor="#BBF7D0" />
            <CharCell char="l" delay={460} bgColor="#14532D" textColor="#BBF7D0" />
            <CharCell char="l" delay={470} bgColor="#14532D" textColor="#BBF7D0" />
            <CharCell char="o" delay={480} bgColor="#14532D" textColor="#BBF7D0" />
            <CharCell char="\0" delay={490} bgColor="#166534" textColor="#F0FDF4" />
            <CharCell char="·" delay={500} bgColor="#1E293B" textColor="#64748B" />
            <CharCell char="·" delay={510} bgColor="#1E293B" textColor="#64748B" />
          </div>

          <CodeBlock code="sds.len = O(1) 直接读取" delay={540} color={COLORS.accent} />
          <CodeBlock code="alloc - len = 3 空闲空间" delay={570} color={COLORS.secondary} />

          <ComparisonBox
            title="SDS 优势"
            items={[
              { text: 'O(1) 长度获取', isPositive: true },
              { text: '空间预分配策略', isPositive: true },
              { text: '惰性空间释放', isPositive: true },
              { text: '二进制安全', isPositive: true },
            ]}
            delay={600}
            color={COLORS.accent}
          />
        </div>
      </Sequence>

      {/* 总结对比 */}
      <Sequence from={690} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="核心差异总结" delay={690} size="28px" color={COLORS.highlight} />

          <div style={{ display: 'flex', gap: '40px', marginTop: '25px' }}>
            <KnowledgeCard
              title="时间复杂度"
              content="C: O(n) vs SDS: O(1)"
              delay={730}
              color={COLORS.cstring}
            />
            <KnowledgeCard
              title="空间管理"
              content="C: 手动 vs SDS: 自动"
              delay={760}
              color={COLORS.accent}
            />
            <KnowledgeCard
              title="安全性"
              content="C: 溢出风险 vs SDS: 安全"
              delay={790}
              color={COLORS.highlight}
            />
          </div>

          <AnimatedText text="SDS 是 Redis 的最佳选择" delay={830} color={COLORS.accent} size="24px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
