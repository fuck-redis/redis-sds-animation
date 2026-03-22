import { useEffect } from 'react';

interface UseAnimationHotkeysOptions {
  enabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlayPause: () => void;
  onReset: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}

export function useAnimationHotkeys({
  enabled,
  onPrev,
  onNext,
  onTogglePlayPause,
  onReset,
}: UseAnimationHotkeysOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      } else if (event.key === ' ') {
        event.preventDefault();
        onTogglePlayPause();
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onPrev, onNext, onTogglePlayPause, onReset]);
}
