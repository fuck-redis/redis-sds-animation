import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Zap, RefreshCw, ArrowDownUp, Sparkles, Brain, TrendingUp, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { LazyFreeDiagram } from '@/components/video';

export function LazyFreePage() {
  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">内存管理</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">惰性回收</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">惰性空间回收</h1>

      <p className="text-lg text-slate-600">
        惰性空间回收是 SDS 的另一个核心优化策略。当 SDS 被缩短时，不立即释放多余的空间，
        而是将这部分空间保留在 <code className="bg-slate-100 px-1 rounded">free</code> 区域中，供后续追加操作使用。
        这种"<strong>以空间换时间</strong>"的策略显著提升了高频增删交替场景的性能。
      </p>

      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Brain className="text-amber-500" />
          什么是惰性回收？
        </h2>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <LazyFreeDiagram />
        </div>

        <motion.div
          className="bg-slate-50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-slate-700 leading-relaxed mb-4">
            惰性空间回收（Lazy Free）是指当 SDS 调用 <code className="bg-white px-1 rounded">sdstrim</code>、
            <code className="bg-white px-1 rounded">sdsrange</code> 或
            <code className="bg-white px-1 rounded">sdscpy</code> 等操作缩短字符串时，
            <strong>不立即释放</strong>多余的内存空间，而是将这部分空间标记为"可用但未释放"。
          </p>
          <p className="text-slate-700 leading-relaxed">
            free 区域的大小 = <code className="bg-white px-1 rounded">alloc - len</code>。
            当后续追加操作不超过 free 区域时，可以直接复用现有空间，无需任何内存分配。
          </p>
        </motion.div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <TrendingUp className="text-blue-600" />
          惰性回收 vs 立即回收
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            className="bg-red-50 rounded-lg p-6 border border-red-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
              <RefreshCw size={20} />
              立即回收（传统方式）
            </h3>
            <div className="bg-white rounded p-3 font-mono text-sm mb-3">
              <p className="text-red-700">sdstrim("hello world", "x")</p>
              <p className="text-slate-500 mt-1">// 删除前后空格</p>
              <p className="text-red-700 mt-2">// 立即释放多余空间</p>
            </div>
            <div className="space-y-2 text-sm text-red-700">
              <div className="flex items-center gap-2">
                <span>1. 分配 len=11 的新缓冲区</span>
              </div>
              <div className="flex items-center gap-2">
                <span>2. 复制 "hello world"</span>
              </div>
              <div className="flex items-center gap-2">
                <span>3. 释放原 alloc=22 的缓冲区</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-100 rounded text-red-800 text-sm">
              <strong>问题：</strong>alloc 从 22 变为 11，free 从 11 变为 0。<br/>
              下次追加时如果超过 11，需要重新扩容！
            </div>
          </motion.div>

          <motion.div
            className="bg-emerald-50 rounded-lg p-6 border border-emerald-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <Zap size={20} />
              惰性回收（SDS 方式）
            </h3>
            <div className="bg-white rounded p-3 font-mono text-sm mb-3">
              <p className="text-emerald-700">sdstrim("hello world", "x")</p>
              <p className="text-slate-500 mt-1">// 删除前后空格</p>
              <p className="text-emerald-700 mt-2">// free 区域增大，alloc 不变</p>
            </div>
            <div className="space-y-2 text-sm text-emerald-700">
              <div className="flex items-center gap-2">
                <span>1. 仅更新 len = 11</span>
              </div>
              <div className="flex items-center gap-2">
                <span>2. alloc 保持 22 不变</span>
              </div>
              <div className="flex items-center gap-2">
                <span>3. free 从 12 变为 22</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-100 rounded text-emerald-800 text-sm">
              <strong>优势：</strong>alloc 保持 22，free = 22。<br/>
              后续追加在 11 字节内无需任何内存分配！
            </div>
          </motion.div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="text-amber-800 text-sm">
            <strong>核心区别：</strong>
            立即回收会修改 alloc，而惰性回收只修改 len，alloc 保持不变。
            这意味着惰性回收后的 SDS 仍然拥有较大的预分配空间。
          </p>
        </div>

        {/* 惰性释放对比演示 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles className="text-emerald-600" />
            内存变化对比演示
          </h3>
          <div className="bg-slate-50 rounded-lg p-4">
            {/* 使用内置的 LazyFreeDiagram 代替 D3LazyFreeCompare */}
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="text-xl text-slate-600 font-medium">惰性回收内存变化</div>

              <div className="flex items-center gap-16 flex-wrap justify-center">
                {/* Before */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-base text-slate-500 mb-4">sdstrim 前 (len=20, alloc=32)</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      <div className="px-3 py-2 bg-emerald-100 border border-emerald-400 rounded text-sm text-emerald-800">
                        len=20
                      </div>
                      <div className="px-3 py-2 bg-emerald-100 border border-emerald-400 rounded text-sm text-emerald-800">
                        alloc=32
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <motion.div
                          key={`before-${i}`}
                          className={`w-8 h-10 rounded flex items-center justify-center text-xs font-mono font-bold border ${
                            i < 20
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-slate-100 border-slate-300 text-slate-400'
                          } ${i === 20 ? 'rounded-l-none' : ''} ${i === 31 ? 'rounded-r-none' : ''}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                        >
                          {i < 20 ? String.fromCharCode(97 + (i % 26)) : ''}
                          {i === 20 && '\\0'}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">已用: 20 | 空闲: 12</div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  className="text-4xl text-emerald-500 font-bold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  →
                </motion.div>

                {/* After */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-base text-slate-500 mb-4">sdstrim 后 (len=10, alloc=32)</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      <div className="px-3 py-2 bg-amber-100 border border-amber-400 rounded text-sm text-amber-800">
                        len=10
                      </div>
                      <div className="px-3 py-2 bg-amber-100 border border-amber-400 rounded text-sm text-amber-800">
                        alloc=32
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <motion.div
                          key={`after-${i}`}
                          className={`w-8 h-10 rounded flex items-center justify-center text-xs font-mono font-bold border ${
                            i < 10
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-yellow-50 border-yellow-300 text-yellow-600'
                          } ${i === 10 ? 'rounded-l-none border-l-0' : ''} ${i === 31 ? 'rounded-r-none' : ''}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.4 + i * 0.02 }}
                        >
                          {i < 10 ? String.fromCharCode(97 + (i % 26)) : ''}
                          {i === 10 && '\\0'}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-emerald-600">已用: 10 | <span className="text-yellow-600">空闲: 22</span></div>
                </motion.div>
              </div>

              <motion.div
                className="mt-6 px-6 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-base text-emerald-700 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                空闲空间从 12 增加到 22，下次追加 22 字节以内无需扩容！
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <History className="text-purple-600" />
          为什么需要惰性回收？
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-blue-50 rounded-lg p-6 border border-blue-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
              <ArrowDownUp size={20} />
              增删交替场景
            </h3>
            <div className="text-sm text-blue-700">
              <p className="mb-3">典型场景：日志处理、消息队列、缓存更新</p>
              <div className="bg-white rounded p-3 font-mono text-xs">
                <p>1. sdscat(log, "第一条日志...") // len 增长</p>
                <p>2. sdscat(log, "第二条日志...") // len 增长</p>
                <p>3. sdstrim(log, "\n") // 清理换行符，len 减少</p>
                <p>4. sdscat(log, "第三条日志...") // len 增长，可复用 free</p>
                <p>5. ... 循环往复</p>
              </div>
              <p className="mt-3">
                惰性回收使得第 4 步的追加操作可以直接复用第 3 步释放的空间，无需扩容。
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-purple-50 rounded-lg p-6 border border-purple-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
              <TrendingUp size={20} />
              性能优势
            </h3>
            <ul className="list-disc list-inside space-y-2 text-purple-700 text-sm">
              <li><strong>减少分配次数：</strong>避免频繁的 alloc/free</li>
              <li><strong>减少内存碎片：</strong>保持较大连续空间</li>
              <li><strong>提升吞吐量：</strong>append 操作在 free 足够时 O(1)</li>
              <li><strong>批量友好：</strong>适合 write-heavy 工作负载</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Zap className="text-amber-600" />
          主动释放 vs 惰性保留
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">操作</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">alloc 变化</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">len 变化</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-4 py-3 font-mono">sdstrim/sdsrange</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-600">不变（惰性回收）</td>
                <td className="border border-slate-200 px-4 py-3">减少</td>
                <td className="border border-slate-200 px-4 py-3">预期后续会有追加操作</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-4 py-3 font-mono">sdsRemoveFreeSpace</td>
                <td className="border border-slate-200 px-4 py-3 text-amber-600">缩小至 len</td>
                <td className="border border-slate-200 px-4 py-3">不变</td>
                <td className="border border-slate-200 px-4 py-3">确定不再需要预分配空间时</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Sparkles size={16} />
            设计哲学
          </h4>
          <p className="text-amber-800 text-sm">
            惰性空间回收体现了 SDS <strong>"宁可多占，不可频繁申请"</strong> 的设计理念。
            预分配 + 惰性回收 是 SDS 内存管理的两大核心策略：预分配减少扩容次数，惰性回收减少缩容次数。
            两者相辅相成，共同实现了内存分配次数的最小化。
          </p>
          <p className="text-amber-700 text-xs mt-2">
            想深入了解预分配策略？<Link to="/memory-strategy/pre-allocation" className="underline font-medium">点击查看预分配专题</Link>
          </p>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/memory-strategy/pre-allocation"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：预分配策略
        </Link>
        <Link
          to="/memory-strategy/type-switching"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：类型切换
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
