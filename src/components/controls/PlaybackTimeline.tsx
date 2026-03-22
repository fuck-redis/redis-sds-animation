import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface PlaybackTimelineProps {
  totalSteps: number;
  currentStep: number;
  onSeek: (step: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function PlaybackTimeline({ totalSteps, currentStep, onSeek }: PlaybackTimelineProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateByPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || totalSteps <= 0) return;
      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const nextStep = Math.round(ratio * (totalSteps - 1));
      onSeek(nextStep);
    },
    [onSeek, totalSteps],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (event: MouseEvent) => {
      updateByPosition(event.clientX);
    };

    const onMouseUp = () => {
      setDragging(false);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        updateByPosition(event.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      setDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging, updateByPosition]);

  if (totalSteps === 0) {
    return (
      <div className="timeline-empty">
        暂无分镜步骤
      </div>
    );
  }

  const ratio = totalSteps <= 1 ? 0 : currentStep / (totalSteps - 1);

  return (
    <div className="timeline-wrap">
      <div className="timeline-meta">
        <span>步骤 {currentStep + 1} / {totalSteps}</span>
        <span>{Math.round(ratio * 100)}%</span>
      </div>

      <div
        ref={trackRef}
        className="timeline-track"
        onMouseDown={(event) => {
          setDragging(true);
          updateByPosition(event.clientX);
        }}
        onTouchStart={(event) => {
          setDragging(true);
          if (event.touches[0]) {
            updateByPosition(event.touches[0].clientX);
          }
        }}
      >
        <motion.div
          className="timeline-progress"
          layout
          animate={{ width: `${ratio * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          <motion.span
            className="timeline-thumb"
            animate={{ scale: dragging ? 1.3 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
