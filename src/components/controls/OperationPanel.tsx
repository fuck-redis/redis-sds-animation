/**
 * Operation Control Panel
 * 操作选择 + 播放控制
 */

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { SDSOperation, OPERATION_CATEGORIES, OPERATION_DESCRIPTIONS, OperationParams } from '@/types/sds';
import { useStore } from '@/store/useStore';
import { useAnimationPlayer } from '@/hooks/useAnimationPlayer';
import { ANIMATION_SPEEDS } from '@/types/animation';
import * as sdsOps from '@/utils/sdsOperations';
import { generateAnimationSteps } from '@/utils/animationGenerator';
import { PlaybackTimeline } from './PlaybackTimeline';
import { useAnimationHotkeys } from '@/hooks/useAnimationHotkeys';
import { usePersistedSetting } from '@/hooks/usePersistedSetting';
import { OperationParamForm, ParamSample } from './OperationParamForm';

const SAMPLES: Partial<Record<SDSOperation, ParamSample[]>> = {
  sdsnew: [
    { label: 'Hello', params: { inputString: 'Hello' } },
    { label: 'Redis', params: { inputString: 'Redis' } },
    { label: 'SDS123', params: { inputString: 'SDS123' } },
  ],
  sdscat: [
    { label: '+ World', params: { concatString: ' World' } },
    { label: '+ Redis', params: { concatString: ' Redis' } },
    { label: '+ !', params: { concatString: '!' } },
  ],
  sdscpy: [
    { label: 'Overwrite', params: { copyString: 'Overwrite' } },
    { label: 'Short', params: { copyString: 'OK' } },
    { label: 'Long', params: { copyString: 'Simple Dynamic String' } },
  ],
  sdsrange: [
    { label: '[0,2]', params: { startIndex: 0, endIndex: 2 } },
    { label: '[1,3]', params: { startIndex: 1, endIndex: 3 } },
  ],
  sdstrim: [
    { label: '空格', params: { trimChars: ' ' } },
    { label: '空格+制表', params: { trimChars: ' \t' } },
    { label: 'xy', params: { trimChars: 'xy' } },
  ],
  sdsMakeRoomFor: [
    { label: '+16', params: { extraBytes: 16 } },
    { label: '+64', params: { extraBytes: 64 } },
    { label: '+256', params: { extraBytes: 256 } },
  ],
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAscii(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[randomInt(0, chars.length - 1)];
  }
  return out;
}

function buildRandomParams(operation: SDSOperation, currentLen: number): OperationParams {
  switch (operation) {
    case 'sdsnew':
      return { inputString: randomAscii(randomInt(3, 10)) };
    case 'sdscat':
      return { concatString: randomAscii(randomInt(1, 6)) };
    case 'sdscpy':
      return { copyString: randomAscii(randomInt(2, 12)) };
    case 'sdsrange': {
      if (currentLen <= 0) return { startIndex: 0, endIndex: 0 };
      const start = randomInt(0, Math.max(0, currentLen - 1));
      const end = randomInt(start, Math.max(start, currentLen - 1));
      return { startIndex: start, endIndex: end };
    }
    case 'sdstrim':
      return { trimChars: randomInt(0, 1) ? ' ' : randomAscii(1) };
    case 'sdsMakeRoomFor':
      return { extraBytes: randomInt(8, 256) };
    default:
      return {};
  }
}

export function OperationPanel() {
  const {
    sdsState,
    uiState,
    animationState,
    setCurrentOperation,
    setOperationParams,
    setSdsState,
    setAnimationSteps,
    playAnimation,
    pauseAnimation,
    stopAnimation,
    setAnimationSpeed,
    addNotification,
  } = useStore();

  const { nextStep, prevStep, seekToStep } = useAnimationPlayer();
  const { value: savedSpeed, loaded: speedLoaded, setValue: setSavedSpeed } =
    usePersistedSetting<number>('animation_speed', 2);

  const [params, setParams] = useState<OperationParams>({});

  useEffect(() => {
    if (speedLoaded) {
      setAnimationSpeed(savedSpeed);
    }
  }, [savedSpeed, setAnimationSpeed, speedLoaded]);

  const applyParams = (next: OperationParams) => {
    setParams(next);
    setOperationParams(next);
  };

  const handleOperationSelect = (operation: SDSOperation) => {
    setCurrentOperation(operation);
    applyParams({});
  };

  const handleParamChange = (key: keyof OperationParams, value: string | number | boolean | undefined) => {
    applyParams({ ...params, [key]: value });
  };

  const currentSamples = useMemo(() => {
    if (!uiState.currentOperation) return [];
    return SAMPLES[uiState.currentOperation] ?? [];
  }, [uiState.currentOperation]);

  const handleExecute = () => {
    const operation = uiState.currentOperation;
    if (!operation) return;

    const validation = sdsOps.validateOperationParams(operation, params, sdsState || undefined);
    if (!validation.valid) {
      addNotification('error', '参数错误', validation.errors[0]);
      return;
    }

    try {
      let newState = null;

      switch (operation) {
        case 'sdsnew':
          newState = sdsOps.sdsnew(params.inputString || '', params.manualType);
          break;
        case 'sdsempty':
          newState = sdsOps.sdsempty();
          break;
        case 'sdsdup':
          newState = sdsState ? sdsOps.sdsdup(sdsState) : null;
          break;
        case 'sdscat':
          newState = sdsState ? sdsOps.sdscat(sdsState, params.concatString || '') : null;
          break;
        case 'sdscpy':
          newState = sdsState ? sdsOps.sdscpy(sdsState, params.copyString || '') : null;
          break;
        case 'sdsrange':
          newState = sdsState
            ? sdsOps.sdsrange(sdsState, params.startIndex ?? 0, params.endIndex ?? 0)
            : null;
          break;
        case 'sdstrim':
          newState = sdsState ? sdsOps.sdstrim(sdsState, params.trimChars || '') : null;
          break;
        case 'sdsMakeRoomFor':
          newState = sdsState ? sdsOps.sdsMakeRoomFor(sdsState, params.extraBytes || 0) : null;
          break;
        case 'sdsRemoveFreeSpace':
          newState = sdsState ? sdsOps.sdsRemoveFreeSpace(sdsState) : null;
          break;
      }

      if (newState) {
        const animSteps = generateAnimationSteps(operation, sdsState, params, newState);
        setAnimationSteps(animSteps);
        setSdsState(newState);
        playAnimation();
        addNotification('success', '操作成功', `已执行 ${operation}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知异常';
      addNotification('error', '执行失败', message);
    }
  };

  useAnimationHotkeys({
    enabled: animationState.steps.length > 0,
    onPrev: prevStep,
    onNext: nextStep,
    onTogglePlayPause: () => (animationState.isPlaying ? pauseAnimation() : playAnimation()),
    onReset: () => {
      stopAnimation();
      seekToStep(0);
    },
  });

  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200 p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-3">操作与播放控制</h2>

      <div className="space-y-3">
        {OPERATION_CATEGORIES.map((category) => (
          <div key={category.name}>
            <div className="text-xs font-semibold text-slate-600 mb-1">{category.name}</div>
            <div className="grid grid-cols-3 gap-1.5">
              {category.operations.map((operation) => (
                <motion.button
                  key={operation}
                  type="button"
                  onClick={() => handleOperationSelect(operation)}
                  disabled={animationState.isPlaying}
                  whileHover={{ scale: 1.05, backgroundColor: uiState.currentOperation === operation ? '#dcfce7' : '#f1f5f9' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={`px-2 py-1.5 rounded border text-xs transition-colors ${
                    uiState.currentOperation === operation
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={OPERATION_DESCRIPTIONS[operation]}
                >
                  {operation}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {uiState.currentOperation && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-600 mb-2">{OPERATION_DESCRIPTIONS[uiState.currentOperation]}</p>
          <OperationParamForm
            operation={uiState.currentOperation}
            params={params}
            samples={currentSamples}
            sdsLen={sdsState?.len ?? 0}
            onApplyParams={applyParams}
            onChangeParam={handleParamChange}
            onRandom={() => applyParams(buildRandomParams(uiState.currentOperation!, sdsState?.len ?? 0))}
            onExecute={handleExecute}
            executing={animationState.isPlaying}
          />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => seekToStep(0)}
            disabled={animationState.steps.length === 0 || animationState.currentStep === 0}
            className="control-btn"
            title="回到开始"
          >
            <SkipBack size={14} />
            <span>起点</span>
          </button>
          <button
            type="button"
            onClick={prevStep}
            disabled={animationState.steps.length === 0 || animationState.currentStep === 0}
            className="control-btn"
            title="上一步 ←"
          >
            <ChevronLeft size={14} />
            <span>上一步 ←</span>
          </button>
          <motion.button
            type="button"
            onClick={animationState.isPlaying ? pauseAnimation : playAnimation}
            disabled={animationState.steps.length === 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="control-btn control-btn-primary"
            title="播放/暂停 Space"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={animationState.isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {animationState.isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </motion.div>
            </AnimatePresence>
            <span>播放/暂停 ␣</span>
          </motion.button>
          <button
            type="button"
            onClick={nextStep}
            disabled={animationState.steps.length === 0 || animationState.currentStep >= animationState.totalSteps - 1}
            className="control-btn"
            title="下一步 →"
          >
            <ChevronRight size={14} />
            <span>下一步 →</span>
          </button>
          <button
            type="button"
            onClick={() => seekToStep(Math.max(0, animationState.totalSteps - 1))}
            disabled={animationState.steps.length === 0 || animationState.currentStep >= animationState.totalSteps - 1}
            className="control-btn"
            title="跳到结尾"
          >
            <SkipForward size={14} />
            <span>结尾</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stopAnimation();
              seekToStep(0);
            }}
            disabled={animationState.steps.length === 0}
            className="control-btn"
            title="重置 R"
          >
            <RotateCcw size={14} />
            <span>重置 R</span>
          </button>
        </div>

        <div>
          <div className="text-xs text-slate-600 mb-1">播放速度</div>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(ANIMATION_SPEEDS).map(([speed, config]) => {
              const numericSpeed = Number(speed);
              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => {
                    setAnimationSpeed(numericSpeed);
                    setSavedSpeed(numericSpeed);
                  }}
                  className={`py-1 text-xs rounded transition-colors ${
                    animationState.speed === numericSpeed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        <PlaybackTimeline
          totalSteps={animationState.totalSteps}
          currentStep={animationState.currentStep}
          onSeek={seekToStep}
        />

        <AnimatePresence mode="wait">
          {animationState.steps[animationState.currentStep] && (
            <motion.div
              key={animationState.steps[animationState.currentStep].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xs bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-slate-700"
            >
              <motion.span
                initial={{ scale: 1.1, color: '#16A34A' }}
                animate={{ scale: 1, color: '#1e293b' }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <strong>{animationState.steps[animationState.currentStep].phase || '分镜'}</strong>
              </motion.span>
              ：{animationState.steps[animationState.currentStep].description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
