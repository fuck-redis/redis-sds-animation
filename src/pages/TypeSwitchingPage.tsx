import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Play, ArrowRight, RefreshCw, Zap, Database, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { TypeSwitchingDiagram } from '@/components/video';
import { useState } from 'react';
import { SDSType } from '@/types/sds';
import { CodeBlock } from '@/components/code/CodeBlock';

export function TypeSwitchingPage() {
  const [selectedLength, setSelectedLength] = useState(25);
  const [growthStep, setGrowthStep] = useState(0);

  // 模拟字符串增长过程
  const growthStages = [
    { len: 5, type: SDSType.SDS_TYPE_5, action: 'sdsnew("hello")' },
    { len: 15, type: SDSType.SDS_TYPE_5, action: 'sdscat("ello world")' },
    { len: 32, type: SDSType.SDS_TYPE_5, action: 'sdscat(" more text here")' },
    { len: 33, type: SDSType.SDS_TYPE_8, action: 'sdscat("!") - 触发升级!' },
    { len: 100, type: SDSType.SDS_TYPE_8, action: '继续追加...' },
    { len: 256, type: SDSType.SDS_TYPE_8, action: 'sdscat("...") - 刚好256' },
    { len: 257, type: SDSType.SDS_TYPE_16, action: 'sdscat("x") - 触发升级!' },
  ];

  const currentStage = growthStages[Math.min(growthStep, growthStages.length - 1)];

  // 根据长度计算类型
  const calculateType = (len: number): SDSType => {
    if (len < 32) return SDSType.SDS_TYPE_5;
    if (len < 256) return SDSType.SDS_TYPE_8;
    if (len < 65536) return SDSType.SDS_TYPE_16;
    if (len < 4294967296) return SDSType.SDS_TYPE_32;
    return SDSType.SDS_TYPE_64;
  };

  const getTypeColor = (type: SDSType): string => {
    switch (type) {
      case SDSType.SDS_TYPE_5: return 'bg-emerald-500';
      case SDSType.SDS_TYPE_8: return 'bg-blue-500';
      case SDSType.SDS_TYPE_16: return 'bg-indigo-500';
      case SDSType.SDS_TYPE_32: return 'bg-amber-500';
      case SDSType.SDS_TYPE_64: return 'bg-orange-500';
    }
  };

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">内存管理</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">类型切换</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">类型切换机制</h1>

      <p className="text-lg text-slate-600">
        SDS 根据字符串长度自动选择最合适的 header 类型。当字符串长度超过当前类型的最大容量时，
        SDS 会自动升级到更大的类型。这种<strong>类型自适应机制</strong>兼顾了小字符串的内存效率和大字符串的存储能力。
      </p>

      {/* 类型选择规则 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <TrendingUp className="text-blue-600" size={28} />
          类型选择规则
        </h2>

        <div className="mb-6">
          <CodeBlock code={`/**
 * 根据字符串长度选择合适的 SDS 类型
 * @param len 字符串长度
 * @return 对应的 SDS 类型
 */
SDSType determineType(size_t len) {
    if (len < 32)           return SDS_TYPE_5;      // 2^5，最大32字节
    if (len < 256)          return SDS_TYPE_8;      // 2^8，最大256字节
    if (len < 65536)        return SDS_TYPE_16;     // 2^16，最大64KB
    if (len < 4294967296)   return SDS_TYPE_32;     // 2^32，最大4GB
    return SDS_TYPE_64;                                // 2^64，超大字符串
}`} language="java" />
        </div>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <TypeSwitchingDiagram />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">类型</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">长度范围</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">Header 大小</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">存储方式</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'SDS_TYPE_5', range: '0 ~ 31 字节', header: '1 字节', storage: 'flags 高5位直接存储 len', color: 'bg-emerald-50' },
                { type: 'SDS_TYPE_8', range: '32 ~ 255 字节', header: '3 字节', storage: '1B flags + 1B len + 1B alloc', color: 'bg-white' },
                { type: 'SDS_TYPE_16', range: '256 ~ 64KB', header: '5 字节', storage: '1B flags + 2B len + 2B alloc', color: 'bg-blue-50' },
                { type: 'SDS_TYPE_32', range: '64KB+ ~ 4GB', header: '9 字节', storage: '1B flags + 4B len + 4B alloc', color: 'bg-white' },
                { type: 'SDS_TYPE_64', range: '大于 4GB', header: '17 字节', storage: '1B flags + 8B len + 8B alloc', color: 'bg-amber-50' },
              ].map((t, i) => (
                <motion.tr
                  key={t.type}
                  className={t.color}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <td className="border border-slate-200 px-4 py-3 font-mono text-emerald-700 font-medium">{t.type}</td>
                  <td className="border border-slate-200 px-4 py-3">{t.range}</td>
                  <td className="border border-slate-200 px-4 py-3">{t.header}</td>
                  <td className="border border-slate-200 px-4 py-3 text-xs text-slate-600">{t.storage}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 动画演示：字符串增长与类型升级 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Play className="text-purple-600" size={28} />
          场景演示：字符串增长与类型升级
        </h2>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">模拟字符串增长过程</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setGrowthStep(Math.max(0, growthStep - 1))}
                className="px-3 py-1 bg-white rounded border border-slate-300 hover:bg-slate-50 text-sm"
                disabled={growthStep === 0}
              >
                上一步
              </button>
              <button
                onClick={() => setGrowthStep(Math.min(growthStages.length - 1, growthStep + 1))}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                disabled={growthStep === growthStages.length - 1}
              >
                下一步
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm text-slate-500">当前阶段：</div>
              <div className="flex gap-2">
                {growthStages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGrowthStep(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === growthStep ? 'bg-purple-600' : i < growthStep ? 'bg-purple-300' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-50 rounded p-3">
                <p className="text-xs text-slate-500 mb-1">当前操作</p>
                <code className="text-sm font-mono text-slate-800">{currentStage.action}</code>
              </div>
              <div className="bg-slate-50 rounded p-3">
                <p className="text-xs text-slate-500 mb-1">字符串长度</p>
                <p className="text-2xl font-bold text-slate-800">{currentStage.len} 字节</p>
              </div>
              <div className="bg-slate-50 rounded p-3">
                <p className="text-xs text-slate-500 mb-1">当前类型</p>
                <span className={`inline-block px-3 py-1 rounded text-white text-sm font-mono ${getTypeColor(currentStage.type)}`}>
                  {currentStage.type}
                </span>
              </div>
            </div>

            {/* 内存示意 */}
            <div className="bg-slate-100 rounded p-3">
              <p className="text-xs text-slate-500 mb-2">内存布局变化：</p>
              <div className="flex flex-wrap gap-1">
                {currentStage.type === SDSType.SDS_TYPE_5 && (
                  <>
                    <div className="w-6 h-8 bg-emerald-500 rounded flex items-center justify-center text-white text-xs">H</div>
                    <div className="w-6 h-8 bg-emerald-200 rounded flex items-center justify-center text-emerald-800 text-xs" style={{ width: `${Math.min(currentStage.len * 8, 80)}px` }}>
                      data
                    </div>
                    {currentStage.action.includes('触发升级') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 ml-2"
                      >
                        <RefreshCw size={16} className="text-purple-600 animate-spin" />
                        <span className="text-xs text-purple-600 font-bold">升级!</span>
                      </motion.div>
                    )}
                  </>
                )}
                {currentStage.type !== SDSType.SDS_TYPE_5 && (
                  <>
                    <div className="w-6 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">len</div>
                    <div className="w-6 h-8 bg-blue-400 rounded flex items-center justify-center text-white text-xs">alloc</div>
                    <div className="w-6 h-8 bg-blue-300 rounded flex items-center justify-center text-blue-800 text-xs">flags</div>
                    <div className="w-6 h-8 bg-blue-200 rounded flex items-center justify-center text-blue-800 text-xs" style={{ width: `${Math.min(currentStage.len * 6, 100)}px` }}>
                      data
                    </div>
                    {currentStage.action.includes('触发升级') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 ml-2"
                      >
                        <RefreshCw size={16} className="text-purple-600 animate-spin" />
                        <span className="text-xs text-purple-600 font-bold">升级!</span>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
              <CheckCircle size={16} />
              无需升级的情况
            </h4>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>- 长度始终在当前类型范围内</li>
              <li>- 追加操作直接在 free 空间写入</li>
              <li>- 无需任何内存重新分配</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              触发升级的情况
            </h4>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>- 追加后长度超过当前类型最大值</li>
              <li>- 需要分配更大的内存空间</li>
              <li>- 复制原有数据到新位置</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 升级详解 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">类型升级详解</h2>

        <div className="space-y-6">
          <motion.div
            className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} />
              升级时会发生什么？
            </h4>
            <ol className="list-decimal list-inside text-amber-700 text-sm space-y-2">
              <li><strong>检查容量：</strong>判断新长度是否超过当前类型的最大容量</li>
              <li><strong>选择新类型：</strong>调用 determineType() 选择合适的更大类型</li>
              <li><strong>分配新空间：</strong>分配新的 header + 数据区</li>
              <li><strong>复制数据：</strong>将原有数据复制到新位置</li>
              <li><strong>更新元数据：</strong>更新 len、alloc、flags 字段</li>
              <li><strong>释放旧空间：</strong>释放旧的 header（如果是 TYPE_5 等小类型）</li>
            </ol>
          </motion.div>

          <div className="bg-slate-100 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Clock size={16} />
              升级成本分析
            </h4>
            <p className="text-slate-600 text-sm mb-3">
              类型升级需要一次内存重新分配和数据复制操作。但升级发生在字符串增长超过阈值时，
              说明程序确实需要更大的空间。这种<strong>"按需升级"</strong>的策略确保了只在必要时才付出代价。
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded p-2">
                <p className="font-bold text-red-600">升级成本</p>
                <p className="text-slate-600">1次内存分配 + 1次数据复制</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="font-bold text-emerald-600">升级收益</p>
                <p className="text-slate-600">支持更长的字符串存储</p>
              </div>
            </div>
          </div>

          {/* 实际案例 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h4 className="font-bold text-slate-800 mb-3">真实案例：Redis SET 命令</h4>
            <div>
              <CodeBlock code={`> SET mykey "hello"
  // 创建: "hello" (5字节) → TYPE_5

> APPEND mykey " world"
  // 追加后: "hello world" (11字节) → 仍是 TYPE_5 (11 < 32)

> APPEND mykey "！！！这是一个很长的备注"
  // 追加后: 超过 32 字节 → 升级到 TYPE_8

> SET large_value "A...Z"  (300字节)
  // 直接创建: 300字节 → TYPE_8 (32 ≤ 300 < 256)

> APPEND large_value "更多内容..."
  // 追加后: 超过 256 字节 → 升级到 TYPE_16`} language="java" />
            </div>
          </div>
        </div>
      </section>

      {/* 为什么不支持自动降级 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Database size={24} className="text-red-600" />
          为什么不支持自动降级？
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              不支持降级的原因
            </h3>
            <ul className="space-y-3 text-red-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold">成本高：</span>
                <span>降级需要重新分配更小的内存并复制数据，代价与升级相同</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">得不偿失：</span>
                <span>如果字符串刚被缩短，很可能马上又要增长（如日志处理）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">惰性策略：</span>
                <span>与惰性空间回收的理念一致，宁可多占空间也不频繁操作</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              如何手动"降级"？
            </h3>
            <div className="text-emerald-700 text-sm space-y-3">
              <p>
                虽然 SDS 不支持自动降级，但可以通过以下方式手动实现：
              </p>
              <div>
                <CodeBlock code={`// 手动降级方法
// 1. 创建一个新的空 SDS
sds newSds = sdsempty();
// 2. 逐字符复制（会自动选择合适的类型）
for (int i = 0; i < oldSds.len; i++) {
    newSds = sdscat(newSds, oldSds.buf[i]);
}
// 3. 释放原 SDS
sdsfree(oldSds);`} language="java" />
              </div>
              <p className="text-xs bg-amber-100 p-2 rounded">
                <strong>注意：</strong>这种方式成本很高，只有在确实需要节省内存时才建议使用。
              </p>
            </div>
          </motion.div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-6">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Zap size={16} />
            sdsRemoveFreeSpace 的作用
          </h4>
          <p className="text-amber-700 text-sm">
            调用 <code className="bg-white px-1 rounded">sdsRemoveFreeSpace</code> 可以释放空闲空间（让 alloc = len），
            但<strong>不会改变类型</strong>。因为类型是由历史最大长度决定的，而不是当前长度。
            这样设计的好处是：如果字符串再次增长，很可能不需要再次升级类型。
          </p>
        </div>
      </section>

      {/* 内存效率分析 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">内存效率分析</h2>

        <motion.div
          className="bg-slate-50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center text-sm text-slate-600 mb-4">
            模拟场景：存储 1000 个随机字符串的长度分布
          </div>
          <div className="flex items-end justify-center gap-2 h-40">
            <motion.div
              className="w-16 bg-emerald-500 rounded-t"
              style={{ height: '75%' }}
              initial={{ height: 0 }}
              animate={{ height: '75%' }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-white text-xs mt-1">TYPE_5</div>
            </motion.div>
            <motion.div
              className="w-16 bg-blue-500 rounded-t"
              style={{ height: '18%' }}
              initial={{ height: 0 }}
              animate={{ height: '18%' }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-white text-xs mt-1">TYPE_8</div>
            </motion.div>
            <motion.div
              className="w-16 bg-indigo-500 rounded-t"
              style={{ height: '5%' }}
              initial={{ height: 0 }}
              animate={{ height: '5%' }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-white text-xs mt-1">TYPE_16</div>
            </motion.div>
            <motion.div
              className="w-16 bg-amber-500 rounded-t"
              style={{ height: '2%' }}
              initial={{ height: 0 }}
              animate={{ height: '2%' }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-white text-xs mt-1">TYPE_32</div>
            </motion.div>
          </div>
          <div className="text-center text-xs text-slate-500 mt-2">
            大多数字符串很短，类型自适应节省了大量内存
          </div>
        </motion.div>

        <div className="bg-slate-100 rounded-lg p-4 mt-6">
          <h4 className="font-bold text-slate-800 mb-3">类型自适应的优势</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded p-4">
              <p className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold">1</span>
                小字符串（如 key 名称）
              </p>
              <p className="text-slate-600">
                使用 TYPE_5（1字节 header），相比 TYPE_8 节省约 67% 的 header 开销。
                对于 Redis 中数十亿的键名，这个优化非常显著。
              </p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">2</span>
                大字符串（如缓存值）
              </p>
              <p className="text-slate-600">
                使用 TYPE_16/32，支持最大 4GB，无需担心溢出。
                Header 占比微乎其微，效率几乎与 C 字符串相同。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 长度选择器练习 */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Zap size={24} className="text-indigo-600" />
          小测验：猜猜是什么类型？
        </h2>

        <div className="mb-6">
          <label className="text-sm text-slate-600 mb-2 block">拖动滑块选择字符串长度：</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="300"
              value={selectedLength}
              onChange={(e) => setSelectedLength(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-mono text-slate-800 bg-white px-4 py-2 rounded-lg border shadow-sm min-w-[100px] text-center">
              {selectedLength} 字节
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">当前长度：</p>
              <p className="text-3xl font-bold text-slate-800">{selectedLength} 字节</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">SDS 类型：</p>
              <p className={`text-3xl font-bold ${
                calculateType(selectedLength) === SDSType.SDS_TYPE_5 ? 'text-emerald-600' :
                calculateType(selectedLength) === SDSType.SDS_TYPE_8 ? 'text-blue-600' :
                'text-indigo-600'
              }`}>
                {calculateType(selectedLength)}
              </p>
            </div>
          </div>

          <div className="bg-slate-100 rounded p-4">
            <p className="text-sm text-slate-600 mb-2">长度范围判定：</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedLength < 32 && (
                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">小于 32 → TYPE_5</span>
              )}
              {selectedLength >= 32 && selectedLength < 256 && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">32 &le; len &lt; 256 &rarr; TYPE_8</span>
              )}
              {selectedLength >= 256 && selectedLength < 65536 && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">256 &le; len &lt; 65536 &rarr; TYPE_16</span>
              )}
              {selectedLength >= 65536 && (
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">len ≥ 65536 → TYPE_32/64</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/memory-strategy/lazy-free"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：惰性回收
        </Link>
        <Link
          to="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          去体验完整演示 →
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
