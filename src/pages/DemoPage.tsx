import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, X, Layers, Sparkles, BookOpen, Clock, ArrowRight, MousePointerClick } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SDSStructure } from '../components/visualization/SDSStructure';
import { OperationPanel } from '../components/controls/OperationPanel';
import { useAnimationPlayer } from '../hooks/useAnimationPlayer';
import { CodeDebuggerPanel } from '../components/code/CodeDebuggerPanel';
import { GITHUB_URL } from '../constants';
import { useGithubRepoStats } from '../hooks/useGithubRepoStats';
import { SDSState, SDSType } from '../types/sds';

export function DemoPage() {
  const { sdsState, uiState, removeNotification } = useStore();
  const { stars } = useGithubRepoStats(GITHUB_URL);
  const [demoState, setDemoState] = useState<SDSState | null>(null);

  useAnimationPlayer();

  // 创建示例 SDS 状态用于演示
  useEffect(() => {
    if (!sdsState && !demoState) {
      // 创建一个默认的演示 SDS
      const demo: SDSState = {
        type: SDSType.SDS_TYPE_8,
        len: 5,
        alloc: 8,
        flags: 0,
        buf: ['H', 'e', 'l', 'l', 'o', '\\0'],
        originalString: 'Hello',
      };
      setDemoState(demo);
    }
  }, [sdsState, demoState]);

  useEffect(() => {
    const timers = uiState.notifications.map((notification) => {
      if (!notification.duration) return null;
      return setTimeout(() => removeNotification(notification.id), notification.duration);
    });

    return () => timers.forEach((timer) => timer && clearTimeout(timer));
  }, [removeNotification, uiState.notifications]);

  const displayState = sdsState || demoState;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 shadow-sm flex items-center px-4 flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-emerald-700 flex items-center gap-1"
          >
            ← 返回首页
          </Link>

          <h1 className="text-lg font-bold text-slate-900">Redis SDS 动手实验室</h1>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md hover:bg-slate-800"
          >
            <Github size={14} />
            <span>Star {stars}</span>
          </a>
        </div>
      </header>

      {/* Main Content - Full Height */}
      <main className="flex-1 flex flex-col min-h-0 p-3">
        <div className="flex-1 flex flex-col min-h-0 gap-3">
          {/* Top: SDS Visualization + Code Panel */}
          <div className="flex-1 flex gap-3 min-h-0">
            {/* Left: SDS Structure */}
            <div className="flex-1 min-w-0 flex flex-col">
              {displayState ? (
                <>
                  <SDSStructure sds={displayState} />
                  {!sdsState && demoState && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                      <MousePointerClick size={16} className="text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        <strong>演示模式：</strong>请在下方选择一个操作（如 sdsnew）来开始实验
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 shadow-md p-4 h-full flex flex-col items-center justify-center">
                  <Sparkles size={48} className="text-emerald-400 mb-4" />
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">开始 SDS 动手实验</h2>
                  <p className="text-sm text-slate-600 text-center max-w-md">
                    在下方操作面板选择一个操作（推荐从 <code className="bg-slate-100 px-1 rounded">sdsnew</code> 开始）
                  </p>
                </div>
              )}
            </div>

            {/* Right: Code Debugger */}
            <div className="w-96 flex-shrink-0">
              <CodeDebuggerPanel />
            </div>
          </div>

          {/* Bottom: Operation Panel + Quick Links */}
          <div className="h-48 flex gap-3 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <OperationPanel />
            </div>

            <div className="w-64 flex-shrink-0 bg-white rounded-lg border border-slate-200 shadow-md p-3">
              <h3 className="font-semibold text-slate-800 text-xs mb-2 flex items-center gap-1">
                <BookOpen size={12} className="text-indigo-600" />
                深入学习
              </h3>
              <div className="space-y-1.5">
                <Link
                  to="/memory-strategy/pre-allocation"
                  className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <Layers size={14} className="text-emerald-600" />
                  <span className="text-xs text-slate-700">预分配策略</span>
                  <ArrowRight size={12} className="text-slate-400 ml-auto" />
                </Link>
                <Link
                  to="/memory-strategy/lazy-free"
                  className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Clock size={14} className="text-amber-600" />
                  <span className="text-xs text-slate-700">惰性回收</span>
                  <ArrowRight size={12} className="text-slate-400 ml-auto" />
                </Link>
                <Link
                  to="/memory-strategy/type-switching"
                  className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Sparkles size={14} className="text-blue-600" />
                  <span className="text-xs text-slate-700">类型切换</span>
                  <ArrowRight size={12} className="text-slate-400 ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications */}
      <div className="fixed bottom-3 right-3 space-y-2 z-50">
        {uiState.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-xs bg-white rounded-lg shadow-lg p-3 border-l-4 ${
              notification.type === 'success'
                ? 'border-emerald-500'
                : notification.type === 'error'
                  ? 'border-red-500'
                  : notification.type === 'warning'
                    ? 'border-amber-500'
                    : 'border-cyan-500'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-sm text-slate-900">{notification.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeNotification(notification.id)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
