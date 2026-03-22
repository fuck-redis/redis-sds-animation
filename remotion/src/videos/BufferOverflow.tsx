/**
 * Buffer Overflow Comparison Animation
 * A-6: 缓冲区溢出对比 (16s)
 *
 * 知识点：
 * 1. C String 无边界检查，追加可能溢出
 * 2. SDS 检查 alloc 空间，自动扩容
 * 3. 缓冲区溢出是常见的安全漏洞
 * 4. SDS 的安全性设计
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

function CharCell({ char, delay, bgColor, textColor, borderColor, isOverflow = false }: {
  char: string; delay: number; bgColor: string; textColor: string; borderColor?: string; isOverflow?: boolean;
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
        width: '36px',
        height: '36px',
        backgroundColor: isOverflow ? COLORS.red : bgColor,
        borderRadius: '6px',
        border: `2px solid ${isOverflow ? COLORS.red : (borderColor || bgColor)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '0 2px',
        boxShadow: isOverflow ? `0 0 15px ${COLORS.red}60` : 'none',
      }}
    >
      <span style={{ color: textColor, fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{char}</span>
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

export const BufferOverflow: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="缓冲区溢出" delay={0} color={COLORS.red} />
          <AnimatedText text="Buffer Overflow" delay={35} color={COLORS.secondary} size="20px" />
        </div>
      </Sequence>

      {/* 问题介绍 */}
      <Sequence from={90} durationInFrames={150}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="什么是缓冲区溢出？" delay={90} size="32px" color={COLORS.highlight} />

          <KnowledgeCard
            title="定义"
            content="写入数据超过缓冲区的容量，导致相邻内存被覆盖"
            delay={140}
            color={COLORS.red}
          />

          <KnowledgeCard
            title="危害"
            content="程序崩溃 | 数据损坏 | 安全漏洞 | 恶意攻击"
            delay={190}
            color={COLORS.amber}
          />
        </div>
      </Sequence>

      {/* C String Overflow */}
      <Sequence from={240} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionLabel text="C String 危险!" delay={240} color={COLORS.red} />

          <Label text='char buf[7] = "buffer";  // 容量 7' delay={270} color={COLORS.secondary} />

          <div style={{ display: 'flex', marginTop: '15px' }}>
            <CharCell char="b" delay={290} bgColor={COLORS.darkRed} textColor="#FECACA" borderColor={COLORS.red} />
            <CharCell char="u" delay={300} bgColor={COLORS.darkRed} textColor="#FECACA" borderColor={COLORS.red} />
            <CharCell char="f" delay={310} bgColor={COLORS.darkRed} textColor="#FECACA" borderColor={COLORS.red} />
            <CharCell char="f" delay={320} bgColor={COLORS.darkRed} textColor="#FECACA" borderColor={COLORS.red} />
            <CharCell char="e" delay={330} bgColor={COLORS.darkRed} textColor="#FECACA" borderColor={COLORS.red} />
            <CharCell char="r" delay={340} bgColor={COLORS.darkRed} textColor="#FECACA" borderColor={COLORS.red} />
            <CharCell char="\0" delay={350} bgColor={COLORS.red} textColor="#FFFFFF" borderColor={COLORS.red} />
          </div>

          <CodeBlock code='strcat(buf, " overflow");  // 危险!' delay={390} color={COLORS.red} />

          <Label text="尝试写入 15 字节，但只有 7 字节空间..." delay={420} color={COLORS.secondary} />

          <WarningBox text="溢出! 可能覆盖相邻内存区域" delay={460} color={COLORS.red} />
        </div>
      </Sequence>

      {/* VS */}
      <Sequence from={480} durationInFrames={60}>
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

      {/* SDS Safe */}
      <Sequence from={540} durationInFrames={300}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionLabel text="SDS 安全!" delay={540} color={COLORS.accent} />

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <div style={{ padding: '8px 14px', backgroundColor: '#1E293B', borderRadius: '8px', border: `2px solid ${COLORS.blue}` }}>
              <div style={{ fontSize: '12px', color: COLORS.secondary }}>len</div>
              <div style={{ fontSize: '20px', color: COLORS.blue, fontWeight: 700 }}>7</div>
            </div>
            <div style={{ padding: '8px 14px', backgroundColor: '#1E293B', borderRadius: '8px', border: `2px solid ${COLORS.purple}` }}>
              <div style={{ fontSize: '12px', color: COLORS.secondary }}>alloc</div>
              <div style={{ fontSize: '20px', color: COLORS.purple, fontWeight: 700 }}>15</div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '15px' }}>
            <CharCell char="b" delay={600} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="u" delay={610} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="f" delay={620} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="f" delay={630} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="e" delay={640} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="r" delay={650} bgColor="#14532D" textColor="#86EFAC" borderColor={COLORS.accent} />
            <CharCell char="\0" delay={660} bgColor="#166534" textColor="#F0FDF4" borderColor={COLORS.accent} />
            <CharCell char="·" delay={670} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={680} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={690} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={700} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={710} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={720} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
            <CharCell char="·" delay={730} bgColor="#1E293B" textColor="#64748B" borderColor={COLORS.secondary} />
          </div>

          <CodeBlock code="sdscat(s, \" overflow\");  // 安全!" delay={760} color={COLORS.accent} />

          <Label text="alloc >= len + addlen → 自动扩容" delay={790} color={COLORS.text} />

          <WarningBox text="SDS: 自动扩容，安全无忧" delay={830} color={COLORS.accent} />
        </div>
      </Sequence>

      {/* 总结 */}
      <Sequence from={840} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="SDS 的安全保障" delay={840} size="28px" color={COLORS.highlight} />

          <div style={{ display: 'flex', gap: '30px', marginTop: '25px' }}>
            <KnowledgeCard
              title="检查机制"
              content="sdscat 内部检查 alloc 空间是否足够"
              delay={900}
              color={COLORS.blue}
            />
            <KnowledgeCard
              title="自动扩容"
              content="空间不足时自动扩展 alloc"
              delay={940}
              color={COLORS.purple}
            />
            <KnowledgeCard
              title="预分配策略"
              content="提前分配多余空间，减少扩容次数"
              delay={980}
              color={COLORS.accent}
            />
          </div>

          <AnimatedText text="告别缓冲区溢出" delay={1020} color={COLORS.accent} size="24px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
