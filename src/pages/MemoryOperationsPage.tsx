import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, ArrowUpDown, Calculator, Scale, Layers, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { MemoryOperationsDiagram } from '@/components/video/Diagrams';
import { useState } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';

export function MemoryOperationsPage() {
  const [preAllocExample, setPreAllocExample] = useState({ currentLen: 500, addLen: 100 });

  const calculatePreAlloc = () => {
    const required = preAllocExample.currentLen + preAllocExample.addLen;
    let newAlloc;
    if (required < 1024 * 1024) {
      newAlloc = required * 2;
    } else {
      newAlloc = required + 1024 * 1024;
    }
    return { required, newAlloc };
  };

  const preAllocResult = calculatePreAlloc();

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <Link to="/operations" className="text-emerald-700 hover:underline">SDS 操作</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">内存操作</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">SDS 内存管理操作详解</h1>

      <p className="text-lg text-slate-600">
        本页深入讲解 SDS 的两个关键内存管理操作：<strong>sdsMakeRoomFor</strong>（预分配空间）和
        <strong>sdsRemoveFreeSpace</strong>（释放空闲空间）。这两个操作是理解 SDS 内存优化策略的钥匙。
      </p>

      {/* 内存操作演示 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={24} />
          内存操作演示
        </h2>
        <p className="text-slate-600 mb-4">
          下面是 sdsMakeRoomFor（预分配空间扩容）和 sdsRemoveFreeSpace（释放空闲空间）两种内存操作的演示，
          点击按钮可切换查看不同操作的效果。
        </p>
        <MemoryOperationsDiagram />
      </section>

      {/* 预分配计算器 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Calculator className="text-emerald-600" size={28} />
          预分配计算器
        </h2>

        <p className="text-slate-600 mb-6">
          动手体验一下预分配策略是如何工作的。输入当前长度和需要追加的长度，系统会计算出新的分配容量。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm text-slate-600">当前长度 (bytes):</label>
              <input
                type="number"
                value={preAllocExample.currentLen}
                onChange={(e) => setPreAllocExample({ ...preAllocExample, currentLen: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                min="0"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm text-slate-600">追加长度 (bytes):</label>
              <input
                type="number"
                value={preAllocExample.addLen}
                onChange={(e) => setPreAllocExample({ ...preAllocExample, addLen: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                min="0"
              />
            </div>
          </div>

          <motion.div
            className="bg-emerald-50 rounded-lg p-4 border border-emerald-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={`${preAllocExample.currentLen}-${preAllocExample.addLen}`}
          >
            <h4 className="font-semibold text-emerald-800 mb-2">计算结果</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-600">需求空间 (required):</span> <code className="bg-white px-1 rounded">{preAllocResult.required} bytes</code></p>
              <p><span className="text-slate-600">预分配阈值:</span> <code className="bg-white px-1 rounded">1 MB</code></p>
              <p className="mt-2">
                <span className="text-emerald-700">newAlloc = </span>
                {preAllocResult.required < 1024 * 1024 ? (
                  <span>{preAllocResult.required} × 2 = <strong className="text-emerald-600">{preAllocResult.newAlloc} bytes</strong></span>
                ) : (
                  <span>{preAllocResult.required} + 1MB = <strong className="text-emerald-600">{preAllocResult.newAlloc} bytes</strong></span>
                )}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">预分配策略公式</h4>
          <div className="bg-slate-900 rounded p-3 text-white font-mono text-sm">
            <CodeBlock code={`if (required < 1MB)
    newAlloc = required * 2;   // 翻倍策略
else
    newAlloc = required + 1MB; // 增量策略`} language="java" />
          </div>
          <div className="mt-3">
            <Link to="/pre-allocation" className="text-emerald-600 hover:underline text-sm inline-flex items-center gap-1">
              深入了解预分配策略 <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <ArrowUpDown className="text-blue-600" size={28} />
          sdsMakeRoomFor - 预分配空间
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              {[
                { text: '计算需求空间: required = sds.len + extraBytes', desc: '当前使用 + 额外需求' },
                { text: '检查是否需要扩容: required <= sds.alloc', desc: '空间足够直接返回' },
                { text: '如果需要扩容，计算新容量', desc: '按预分配策略计算' },
                { text: '分配新缓冲区，复制旧数据', desc: '保留现有内容' },
                { text: '更新 type（必要时）和 alloc', desc: '类型可能升级' },
                { text: '返回新 SDS 指针', desc: '可能返回原指针' },
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <span className="text-slate-800">{step.text}</span>
                  <span className="text-xs text-slate-500 ml-2">({step.desc})</span>
                </motion.li>
              ))}
            </ol>

            <motion.div
              className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h4 className="font-semibold text-amber-800 text-sm">预分配策略核心思想</h4>
              <p className="text-amber-700 text-sm mt-1">
                预分配策略的核心是<strong>以空间换时间</strong>：一次分配多一些空间，
                避免每次追加都触发扩容，从而减少内存分配次数，提升性能。
              </p>
              <div className="mt-2">
                <Link to="/pre-allocation" className="text-amber-600 hover:underline text-sm inline-flex items-center gap-1">
                  详见预分配策略专题 <ExternalLink size={12} />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 预分配额外空间
 * @param sds 目标 SDS
 * @param extraBytes 额外需要的字节数
 * @return 可能返回新的 SDS
 */
public SDSState sdsMakeRoomFor(SDSState sds, int extraBytes) {
    // 计算需求空间
    int required = sds.len + extraBytes;

    // 空间足够，无需扩容
    if (required <= sds.alloc) return sds;

    // 计算新容量（预分配策略）
    int newAlloc = preAllocate(sds.len, extraBytes);

    // 分配新缓冲区
    char[] newBuf = new char[newAlloc + 1];
    // 复制旧数据（包括 \\0）
    for (int i = 0; i <= sds.len; i++) {
        newBuf[i] = sds.buf[i];
    }

    // 返回新的 SDS
    return new SDSState(determineType(newAlloc), sds.len, newAlloc, newBuf, sds.originalString);
}`} language="java" />
          </motion.div>
        </div>

        <motion.div
          className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h4 className="font-semibold text-emerald-800 mb-2">示例详解</h4>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div>输入: <code>sdsMakeRoomFor("hi", 10)</code> 其中 len=2, alloc=2</div>
            <div className="mt-2 text-slate-600">
              <p>1. required = 2 + 10 = 12</p>
              <p>2. 12 &gt; 2，需要扩容</p>
              <p>3. 12 &lt; 1MB，newAlloc = 12 * 2 = 24</p>
              <p>4. 分配新缓冲区，复制 "hi\0"</p>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="text-emerald-700">结果: alloc = 24，len=2 不变，buf="hi\0" + 22字节空闲</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Scale className="text-amber-600" size={28} />
          sdsRemoveFreeSpace - 释放空闲空间
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              {[
                { text: '检查空闲空间: free = sds.alloc - sds.len', desc: '计算可用空间' },
                { text: '如果 free = 0，无空闲空间，直接返回', desc: '无需操作' },
                { text: '计算新容量: newAlloc = sds.len', desc: '精确匹配当前使用' },
                { text: '分配新缓冲区（刚好容纳内容）', desc: '紧凑排列' },
                { text: '复制内容和终止符到新缓冲区', desc: '数据迁移' },
                { text: '更新 type（必要时）和 alloc', desc: '类型可能降级' },
                { text: '返回紧凑的 SDS', desc: '内存优化完成' },
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <span className="text-slate-800">{step.text}</span>
                  <span className="text-xs text-slate-500 ml-2">({step.desc})</span>
                </motion.li>
              ))}
            </ol>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mt-4">
              <h4 className="font-semibold text-amber-800 text-sm">与惰性回收的配合</h4>
              <p className="text-amber-700 text-sm mt-1">
                惰性回收（sdsrange/sdstrim）只是将 free 增大，但 alloc 不变。
                sdsRemoveFreeSpace 则会真正释放这些空闲空间，让 alloc = len。
              </p>
              <div className="mt-2">
                <Link to="/lazy-free" className="text-amber-600 hover:underline text-sm inline-flex items-center gap-1">
                  详见惰性回收专题 <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 释放所有空闲空间
 * @param sds 目标 SDS
 * @return 紧凑化的新 SDS
 */
public SDSState sdsRemoveFreeSpace(SDSState sds) {
    // 没有空闲空间，无需操作
    if (sds.len == sds.alloc) return sds;

    // 精确分配：newAlloc = len
    int newAlloc = sds.len;

    // 分配新缓冲区
    char[] newBuf = new char[newAlloc + 1];

    // 复制数据和终止符
    for (int i = 0; i <= sds.len; i++) {
        newBuf[i] = sds.buf[i];
    }

    // 更新元数据
    return new SDSState(determineType(newAlloc), sds.len, newAlloc, newBuf, sds.originalString);
}`} language="java" />
          </motion.div>
        </div>

        <motion.div
          className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h4 className="font-semibold text-emerald-800 mb-2">示例详解</h4>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div>输入: SDS len=5, alloc=20（free=15）</div>
            <div className="mt-2 text-slate-600">
              <p>1. free = 20 - 5 = 15 &gt; 0，需要释放</p>
              <p>2. newAlloc = 5（精确分配）</p>
              <p>3. 分配新缓冲区 char[6]</p>
              <p>4. 复制 "hello\0"</p>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="text-emerald-700">结果: len=5, alloc=5, free=0，释放了 15 字节</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">两种操作的配合使用</h2>

        <motion.div
          className="bg-slate-50 rounded-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-40 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex flex-col items-center justify-center mb-3 shadow-lg">
                <ArrowUpDown size={32} className="text-white mb-1" />
                <span className="text-white text-sm font-bold">预分配</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">sdsMakeRoomFor</div>
              <div className="text-xs text-slate-500 mt-1">为后续操作预留空间</div>
            </motion.div>

            <motion.div
              className="text-5xl text-slate-400"
            >
              ⇄
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-40 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex flex-col items-center justify-center mb-3 shadow-lg">
                <Scale size={32} className="text-white mb-1" />
                <span className="text-white text-sm font-bold">释放</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">sdsRemoveFreeSpace</div>
              <div className="text-xs text-slate-500 mt-1">优化内存占用</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-3">典型应用场景</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">预分配 + 多次追加</h4>
              <p className="text-sm text-blue-700 mb-2">先预分配足够空间，然后执行多次追加</p>
              <div className="bg-slate-900 rounded p-2 text-white font-mono text-xs">
                <CodeBlock code={`s = sdsempty();
s = sdsMakeRoomFor(s, 1024); // 预分配1KB
s = sdscat(s, "part1");      // 无需扩容
s = sdscat(s, "part2");      // 无需扩容
s = sdscat(s, "part3");      // 无需扩容`} language="java" />
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-2">追加完成后释放</h4>
              <p className="text-sm text-amber-700 mb-2">追加操作完成后释放不再需要的预分配空间</p>
              <div className="bg-slate-900 rounded p-2 text-white font-mono text-xs">
                <CodeBlock code={`// 构建完成，释放空闲空间
s = sdsRemoveFreeSpace(s);
// len=实际长度，alloc=len，内存紧凑`} language="java" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-slate-100 rounded-lg p-4 mt-6">
          <h4 className="font-bold text-slate-800 mb-3">内存操作对比表</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-300 px-3 py-2 text-left">操作</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">alloc 变化</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">len 变化</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">使用场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdsMakeRoomFor</td>
                  <td className="border border-slate-300 px-3 py-2">增大（预分配策略）</td>
                  <td className="border border-slate-300 px-3 py-2">不变</td>
                  <td className="border border-slate-300 px-3 py-2">已知需要多次追加时</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdsRemoveFreeSpace</td>
                  <td className="border border-slate-300 px-3 py-2">缩小至 len</td>
                  <td className="border border-slate-300 px-3 py-2">不变</td>
                  <td className="border border-slate-300 px-3 py-2">追加完成，需要释放空闲时</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdscat（自动扩容）</td>
                  <td className="border border-slate-300 px-3 py-2">增大（预分配策略）</td>
                  <td className="border border-slate-300 px-3 py-2">增大</td>
                  <td className="border border-slate-300 px-3 py-2">常规追加操作</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* 相关链接 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">相关专题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/pre-allocation"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 transition-colors"
          >
            <Zap size={24} className="text-amber-600" />
            <div>
              <p className="font-semibold text-slate-800">预分配策略专题</p>
              <p className="text-sm text-slate-500">了解避免频繁扩容的智慧</p>
            </div>
            <ExternalLink size={16} className="ml-auto text-slate-400" />
          </Link>
          <Link
            to="/lazy-free"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 transition-colors"
          >
            <Layers size={24} className="text-amber-600" />
            <div>
              <p className="font-semibold text-slate-800">惰性回收专题</p>
              <p className="text-sm text-slate-500">空间回收的优化策略</p>
            </div>
            <ExternalLink size={16} className="ml-auto text-slate-400" />
          </Link>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/operations/modify"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：修改操作
        </Link>
        <Link
          to="/pre-allocation"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：预分配策略
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
