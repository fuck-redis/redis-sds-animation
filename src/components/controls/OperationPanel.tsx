/**
 * Operation Control Panel
 * 操作选择和参数输入面板
 */

import { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { SDSOperation, OPERATION_CATEGORIES, OPERATION_DESCRIPTIONS, OperationParams } from '@/types/sds';
import { useStore } from '@/store/useStore';
import { useAnimationPlayer } from '@/hooks/useAnimationPlayer';
import { ANIMATION_SPEEDS } from '@/types/animation';
import * as sdsOps from '@/utils/sdsOperations';
import { generateAnimationSteps } from '@/utils/animationGenerator';

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
  
  // 获取动画播放器控制方法
  const { nextStep, prevStep, seekToStep } = useAnimationPlayer();
  
  const [params, setParams] = useState<OperationParams>({});
  
  const handleOperationSelect = (op: SDSOperation) => {
    setCurrentOperation(op);
    setParams({});
  };
  
  const handleParamChange = (key: keyof OperationParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };
  
  const handleExecute = () => {
    const operation = uiState.currentOperation;
    if (!operation) return;
    
    // 验证参数
    const validation = sdsOps.validateOperationParams(operation, params, sdsState || undefined);
    if (!validation.valid) {
      addNotification('error', '参数错误', validation.errors[0]);
      return;
    }
    
    // 执行操作
    try {
      let newState: any;
      
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
          newState = sdsState ? sdsOps.sdsrange(sdsState, params.startIndex || 0, params.endIndex || 0) : null;
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
        default:
          throw new Error('未知操作');
      }
      
      if (newState) {
        // 生成动画步骤
        const animSteps = generateAnimationSteps(operation, sdsState, params, newState);
        setAnimationSteps(animSteps);
        setSdsState(newState);
        playAnimation();
        addNotification('success', '操作成功', `已执行 ${operation}`);
      }
    } catch (error: any) {
      addNotification('error', '执行失败', error.message);
    }
  };
  
  const renderParamInputs = () => {
    const op = uiState.currentOperation;
    if (!op) return null;
    
    return (
      <div className="mt-4 space-y-3">
        {/* sdsnew参数 */}
        {op === 'sdsnew' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                初始字符串
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入字符串..."
                value={params.inputString || ''}
                onChange={(e) => handleParamChange('inputString', e.target.value)}
              />
            </div>
          </>
        )}
        
        {/* sdscat参数 */}
        {op === 'sdscat' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              拼接字符串
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="要追加的字符串..."
              value={params.concatString || ''}
              onChange={(e) => handleParamChange('concatString', e.target.value)}
            />
          </div>
        )}
        
        {/* sdscpy参数 */}
        {op === 'sdscpy' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新字符串
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="用于覆盖的字符串..."
              value={params.copyString || ''}
              onChange={(e) => handleParamChange('copyString', e.target.value)}
            />
          </div>
        )}
        
        {/* sdsrange参数 */}
        {op === 'sdsrange' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                起始索引
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={sdsState ? sdsState.len - 1 : 0}
                value={params.startIndex || 0}
                onChange={(e) => handleParamChange('startIndex', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束索引
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={params.startIndex || 0}
                max={sdsState ? sdsState.len - 1 : 0}
                value={params.endIndex || 0}
                onChange={(e) => handleParamChange('endIndex', parseInt(e.target.value))}
              />
            </div>
          </div>
        )}
        
        {/* sdstrim参数 */}
        {op === 'sdstrim' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              要裁剪的字符
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="要从两端删除的字符集..."
              value={params.trimChars || ''}
              onChange={(e) => handleParamChange('trimChars', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">例如: " \t" 会删除空格和制表符</p>
          </div>
        )}
        
        {/* sdsMakeRoomFor参数 */}
        {op === 'sdsMakeRoomFor' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              额外字节数
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="需要预分配的额外空间..."
              min="1"
              value={params.extraBytes || ''}
              onChange={(e) => handleParamChange('extraBytes', parseInt(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">当前剩余空间: {sdsState ? sdsState.alloc - sdsState.len : 0} 字节</p>
          </div>
        )}
        
        {/* 执行按钮 */}
        <button
          onClick={handleExecute}
          disabled={animationState.isPlaying}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          执行操作
        </button>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">操作面板</h2>
      
      {/* 操作分类 */}
      <div className="space-y-4">
        {OPERATION_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{category.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {category.operations.map((op) => (
                <button
                  key={op}
                  onClick={() => handleOperationSelect(op)}
                  disabled={animationState.isPlaying}
                  className={`p-3 text-sm rounded-md border-2 transition-all ${
                    uiState.currentOperation === op
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="font-medium">{op}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {OPERATION_DESCRIPTIONS[op].substring(0, 20)}...
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 参数输入区域 */}
      {uiState.currentOperation && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {OPERATION_DESCRIPTIONS[uiState.currentOperation]}
          </h3>
          {renderParamInputs()}
        </div>
      )}
      
      {/* 动画控制 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">动画控制</h3>
        
        {/* 播放控制按钮 */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => seekToStep(0)}
            disabled={animationState.steps.length === 0 || animationState.currentStep === 0}
            className="flex items-center justify-center bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="回到开始"
          >
            <SkipBack size={18} />
          </button>
          
          <button
            onClick={prevStep}
            disabled={animationState.steps.length === 0 || animationState.currentStep === 0}
            className="flex items-center justify-center bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="上一步"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button
            onClick={animationState.isPlaying ? pauseAnimation : playAnimation}
            disabled={animationState.steps.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {animationState.isPlaying ? (
              <><Pause size={16} /> 暂停</>
            ) : (
              <><Play size={16} /> 播放</>
            )}
          </button>
          
          <button
            onClick={nextStep}
            disabled={animationState.steps.length === 0 || animationState.currentStep >= animationState.totalSteps - 1}
            className="flex items-center justify-center bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="下一步"
          >
            <ChevronRight size={18} />
          </button>
          
          <button
            onClick={() => seekToStep(animationState.totalSteps - 1)}
            disabled={animationState.steps.length === 0 || animationState.currentStep >= animationState.totalSteps - 1}
            className="flex items-center justify-center bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="跳到结尾"
          >
            <SkipForward size={18} />
          </button>
          
          <button
            onClick={stopAnimation}
            disabled={animationState.steps.length === 0}
            className="flex items-center justify-center bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            title="重置"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        
        {/* 速度控制 */}
        {animationState.steps.length > 0 && (
          <div className="mb-3">
            <label className="text-xs text-gray-600 mb-1 block">播放速度</label>
            <div className="flex gap-1">
              {Object.entries(ANIMATION_SPEEDS).map(([speed, config]) => (
                <button
                  key={speed}
                  onClick={() => setAnimationSpeed(Number(speed))}
                  className={`flex-1 py-1.5 px-2 text-xs rounded transition-colors ${
                    animationState.speed === Number(speed)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 进度显示 */}
        {animationState.steps.length > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>步骤 {animationState.currentStep + 1} / {animationState.totalSteps}</span>
              <span>{Math.round(((animationState.currentStep + 1) / animationState.totalSteps) * 100)}%</span>
            </div>
            
            {/* 可点击的进度条 */}
            <div 
              className="w-full bg-gray-200 rounded-full h-3 cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const targetStep = Math.floor(percentage * animationState.totalSteps);
                seekToStep(Math.max(0, Math.min(targetStep, animationState.totalSteps - 1)));
              }}
            >
              <div
                className="bg-blue-600 h-3 rounded-full transition-all relative"
                style={{
                  width: `${((animationState.currentStep + 1) / animationState.totalSteps) * 100}%`,
                }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-700 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
            
            {animationState.steps[animationState.currentStep] && (
              <div className="mt-2 text-sm text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0 mt-0.5">
                    {animationState.currentStep + 1}
                  </span>
                  <span className="flex-1">{animationState.steps[animationState.currentStep].description}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
