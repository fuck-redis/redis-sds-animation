/**
 * Video Figure Component
 * 文章中的视频图示组件，类似于示意图/动画插图
 * 支持视频播放和 fallback 机制
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VideoFigureProps {
  src?: string;
  caption: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  fallback?: React.ReactNode;
  className?: string;
  poster?: string;
}

/**
 * 嵌入视频图示
 * 用法：<VideoFigure src="/videos/sds-intro.mp4" caption="图1: SDS数据结构示意图" />
 */
export function VideoFigure({
  src,
  caption,
  autoplay = false,
  loop = true,
  muted = true,
  fallback,
  className = '',
  poster,
}: VideoFigureProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if video exists by trying to load it
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Timeout for loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      clearTimeout(timeout);
    };
  }, [src]);

  // No video source - show fallback or placeholder
  if (!src || hasError) {
    return (
      <figure className={`my-6 ${className}`}>
        {fallback ? (
          <div className="rounded-xl overflow-hidden shadow-lg">
            {fallback}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
            <div className="text-slate-500 text-sm mb-2">视频图示</div>
            <div className="text-slate-700 font-medium">{caption}</div>
            <div className="text-slate-400 text-xs mt-2">（视频待渲染）</div>
          </div>
        )}
        <figcaption className="text-center text-sm text-slate-600 mt-3 italic">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={`my-6 ${className}`}>
      <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-lg">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        )}

        <video
          ref={videoRef}
          src={src}
          loop={loop}
          muted={isMuted}
          autoPlay={autoplay}
          playsInline
          poster={poster}
          className="w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={() => {
            if (videoRef.current) {
              if (isPlaying) {
                videoRef.current.pause();
              } else {
                videoRef.current.play();
              }
            }
          }}
        />

        {/* 播放控制栏 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-emerald-400 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <span className="text-white/80 text-xs">{caption}</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-emerald-400 transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="text-center text-sm text-slate-600 mt-3 italic">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * 动画示意图组件 - 用于展示动态概念的静态/动画图示
 * 使用 framer-motion 实现 CSS 动画
 */
interface AnimatedDiagramProps {
  children: React.ReactNode;
  caption: string;
  className?: string;
}

export function AnimatedDiagram({ children, caption, className = '' }: AnimatedDiagramProps) {
  return (
    <figure className={`my-6 ${className}`}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        {children}
      </div>
      <figcaption className="text-center text-sm text-slate-600 mt-3 italic">
        {caption}
      </figcaption>
    </figure>
  );
}
