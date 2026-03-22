/**
 * Animation Generator Entry
 */

import { SDSState, SDSOperation, OperationParams } from '@/types/sds';
import { AnimationStep } from '@/types/animation';
import {
  generateSdsnewAnimation,
  generateSdsemptyAnimation,
  generateSdsdupAnimation,
} from './animationSteps/createAnimations';
import {
  generateSdscatAnimation,
  generateSdscpyAnimation,
  generateSdsrangeAnimation,
  generateSdstrimAnimation,
} from './animationSteps/mutateAnimations';
import {
  generateSdsMakeRoomForAnimation,
  generateSdsRemoveFreeSpaceAnimation,
} from './animationSteps/memoryAnimations';
import { step } from './animationSteps/shared';

export function generateAnimationSteps(
  operation: SDSOperation,
  currentState: SDSState | null,
  params: OperationParams,
  resultState: SDSState,
): AnimationStep[] {
  switch (operation) {
    case 'sdsnew':
      return generateSdsnewAnimation(params, resultState);
    case 'sdsempty':
      return generateSdsemptyAnimation(resultState);
    case 'sdsdup':
      return currentState ? generateSdsdupAnimation(currentState, resultState) : [];
    case 'sdscat':
      return currentState ? generateSdscatAnimation(currentState, params, resultState) : [];
    case 'sdscpy':
      return currentState ? generateSdscpyAnimation(currentState, params, resultState) : [];
    case 'sdsrange':
      return currentState ? generateSdsrangeAnimation(currentState, params, resultState) : [];
    case 'sdstrim':
      return currentState ? generateSdstrimAnimation(currentState, params, resultState) : [];
    case 'sdsMakeRoomFor':
      return currentState ? generateSdsMakeRoomForAnimation(currentState, params, resultState) : [];
    case 'sdsRemoveFreeSpace':
      return currentState ? generateSdsRemoveFreeSpaceAnimation(currentState, resultState) : [];
    default:
      return [
        step({
          type: 'text',
          target: 'info',
          duration: 1000,
          description: `执行操作: ${operation}`,
          lines: [1],
        }),
      ];
  }
}
