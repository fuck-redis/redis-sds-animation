/**
 * Animation Player Hook
 * 控制动画播放、暂停、步进等功能
 */

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { ANIMATION_SPEEDS } from '@/types/animation';

export function useAnimationPlayer() {
  const {
    animationState,
    setAnimationStep,
    playAnimation,
    pauseAnimation,
    stopAnimation,
  } = useStore();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 自动播放动画
  useEffect(() => {
    if (!animationState.isPlaying || animationState.steps.length === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    const speedMultiplier = ANIMATION_SPEEDS[animationState.speed]?.multiplier || 1;
    const currentStep = animationState.steps[animationState.currentStep];
    
    if (!currentStep) {
      stopAnimation();
      return;
    }
    
    const duration = currentStep.duration * speedMultiplier;
    
    timerRef.current = setTimeout(() => {
      const nextStep = animationState.currentStep + 1;
      
      if (nextStep >= animationState.totalSteps) {
        // 动画播放完成
        stopAnimation();
      } else {
        setAnimationStep(nextStep);
      }
    }, duration);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    animationState.isPlaying,
    animationState.currentStep,
    animationState.steps,
    animationState.speed,
    animationState.totalSteps,
    setAnimationStep,
    stopAnimation,
  ]);
  
  const seekToStep = (step: number) => {
    pauseAnimation();
    setAnimationStep(step);
  };
  
  const nextStep = () => {
    if (animationState.currentStep < animationState.totalSteps - 1) {
      pauseAnimation();
      setAnimationStep(animationState.currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (animationState.currentStep > 0) {
      pauseAnimation();
      setAnimationStep(animationState.currentStep - 1);
    }
  };
  
  return {
    play: playAnimation,
    pause: pauseAnimation,
    stop: stopAnimation,
    seekToStep,
    nextStep,
    prevStep,
  };
}
