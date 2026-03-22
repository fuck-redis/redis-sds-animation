/**
 * Hero Project Introduction Animation
 * A-12: Hero 项目介绍 (15s)
 *
 * 知识点：
 * 1. Redis SDS 是 Redis 的字符串实现
 * 2. SDS 的五大核心特性
 * 3. 本项目通过动画帮助理解 SDS 内部机制
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
        maxWidth: '380px',
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

function FeatureBadge({ icon, text, delay, color }: { icon: string; text: string; delay: number; color: string }) {
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
        gap: '12px',
        padding: '12px 20px',
        backgroundColor: '#1E293B',
        borderRadius: '30px',
        border: `2px solid ${color}`,
        opacity: progress,
        transform: `scale(${progress})`,
        margin: '8px 0',
        minWidth: '200px',
      }}
    >
      <span style={{ fontSize: '22px' }}>{icon}</span>
      <span style={{ color, fontSize: '16px', fontWeight: 600 }}>{text}</span>
    </div>
  );
}

function LogoAnimation({ delay }: { delay: number }) {
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
        width: '90px',
        height: '90px',
        backgroundColor: COLORS.redis,
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
        marginBottom: '25px',
        boxShadow: `0 8px 30px ${COLORS.redis}50`,
      }}
    >
      <span style={{ color: '#FFF', fontSize: '48px', fontWeight: 800 }}>R</span>
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
      fontSize: '18px',
      fontFamily: 'Space Grotesk, sans-serif',
      marginTop: '15px',
      textAlign: 'center',
    }}>
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
        marginTop: '30px',
      }}
    >
      <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.secondary, opacity: 0.3 }} />
      <div style={{ color: COLORS.highlight, fontSize: '14px', fontWeight: 600 }}>{text}</div>
      <div style={{ flex: 1, height: '1px', backgroundColor: COLORS.secondary, opacity: 0.3 }} />
    </div>
  );
}

export const HeroIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Main Title */}
      <Sequence from={0} durationInFrames={120}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <LogoAnimation delay={0} />
          <AnimatedText text="Redis SDS" delay={20} />
          <AnimatedText text="Simple Dynamic Strings" delay={50} color={COLORS.secondary} size="28px" />
          <AnimatedText text="可视化动画教程" delay={80} color={COLORS.highlight} size="24px" />
        </div>
      </Sequence>

      {/* Features */}
      <Sequence from={120} durationInFrames={240}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SectionDivider text="SDS 核心特性" delay={130} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '25px' }}>
            <FeatureBadge icon="O(1)" text="O(1) 长度获取" delay={160} color={COLORS.accent} />
            <FeatureBadge icon="+" text="空间预分配策略" delay={190} color={COLORS.blue} />
            <FeatureBadge icon="~" text="惰性空间释放" delay={220} color={COLORS.highlight} />
            <FeatureBadge icon="B" text="二进制安全" delay={250} color={COLORS.purple} />
            <FeatureBadge icon="T" text="5种类型自适应" delay={280} color={COLORS.amber} />
          </div>
        </div>
      </Sequence>

      {/* About Project */}
      <Sequence from={360} durationInFrames={210}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="关于本项目" delay={360} size="28px" color={COLORS.text} />

          <div style={{ display: 'flex', gap: '25px', marginTop: '25px' }}>
            <KnowledgeCard
              title="动画演示"
              content="通过 Remotion 动画直观展示 SDS 内部机制"
              delay={410}
              color={COLORS.blue}
            />
            <KnowledgeCard
              title="交互式学习"
              content="可控制的动画播放，深入理解每个知识点"
              delay={450}
              color={COLORS.accent}
            />
          </div>

          <KnowledgeCard
            title="适合人群"
            content="Redis 学习者 | 底层原理爱好者 | 面试准备"
            delay={490}
            color={COLORS.highlight}
          />
        </div>
      </Sequence>

      {/* Call to Action */}
      <Sequence from={570} durationInFrames={180}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="深入理解 Redis 字符串实现" delay={570} color={COLORS.text} size="26px" />
          <Label text="通过动画直观感受 SDS 的设计智慧" delay={610} color={COLORS.secondary} />
        </div>
      </Sequence>

      {/* End Frame */}
      <Sequence from={750} durationInFrames={90}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedText text="Let's Explore!" delay={750} color={COLORS.accent} size="36px" />
          <AnimatedText text="开始探索 SDS 的精彩世界" delay={790} color={COLORS.secondary} size="20px" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
