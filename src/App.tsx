/**
 * Main Application Component
 */

import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { SDSStructure } from './components/visualization/SDSStructure';
import { OperationPanel } from './components/controls/OperationPanel';
import { useAnimationPlayer } from './hooks/useAnimationPlayer';
import { AlertCircle } from 'lucide-react';

function App() {
  const { sdsState, uiState, removeNotification } = useStore();
  
  // 激活动画播放器
  useAnimationPlayer();
  
  // 自动移除通知
  useEffect(() => {
    const timers = uiState.notifications.map((notif) => {
      if (notif.duration) {
        return setTimeout(() => {
          removeNotification(notif.id);
        }, notif.duration);
      }
      return null;
    });
    
    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [uiState.notifications, removeNotification]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Redis 底层数据结构 SDS 可视化演示
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Simple Dynamic String - 交互式数据结构学习工具
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Area (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {sdsState ? (
              <SDSStructure sds={sdsState} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  开始探索 SDS
                </h3>
                <p className="text-gray-600">
                  从右侧操作面板选择一个操作来创建或修改SDS结构
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700 mb-2">快速开始：</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 使用 <span className="font-mono bg-gray-100 px-1 rounded">sdsnew</span> 创建新字符串</li>
                      <li>• 使用 <span className="font-mono bg-gray-100 px-1 rounded">sdscat</span> 拼接字符串</li>
                      <li>• 使用 <span className="font-mono bg-gray-100 px-1 rounded">sdsrange</span> 截取字符串</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* 信息面板 */}
            {sdsState && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">关键特性</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 font-medium">O(1) 长度查询</div>
                    <div className="text-xs text-green-600 mt-1">len字段直接存储长度</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 font-medium">二进制安全</div>
                    <div className="text-xs text-blue-600 mt-1">可存储任意二进制数据</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-700 font-medium">预分配策略</div>
                    <div className="text-xs text-purple-600 mt-1">减少内存分配次数</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-sm text-orange-700 font-medium">类型优化</div>
                    <div className="text-xs text-orange-600 mt-1">根据长度选择最优头部</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Control Panel (1/3) */}
          <div className="lg:col-span-1">
            <OperationPanel />
          </div>
        </div>
      </main>
      
      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {uiState.notifications.map((notif) => (
          <div
            key={notif.id}
            className={`max-w-sm bg-white rounded-lg shadow-lg p-4 border-l-4 animate-slide-in ${
              notif.type === 'success' ? 'border-green-500' :
              notif.type === 'error' ? 'border-red-500' :
              notif.type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-900">{notif.title}</div>
                <div className="text-sm text-gray-600 mt-1">{notif.message}</div>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
