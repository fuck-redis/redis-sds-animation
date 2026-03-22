import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Play, Copy, Layers, Plus, Eraser, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModifyOperationsDiagram } from '@/components/video/Diagrams';
import { D3StringOperationFlow, D3SdscatOperation, D3SdscpyOperation } from '@/components/visualization/D3Components';
import { SDSOperation } from '@/types/sds';
import { useState } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';

export function ModifyOperationsPage() {
  const [currentOperation, setCurrentOperation] = useState<SDSOperation>('sdscat');
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <Link to="/operations" className="text-emerald-700 hover:underline">SDS 操作</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">修改操作</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">SDS 修改操作详解</h1>

      <p className="text-lg text-slate-600">
        本页深入讲解 SDS 的四个核心修改操作：<strong>sdscat</strong>（追加）、<strong>sdscpy</strong>（复制）、
        <strong>sdsrange</strong>（截取）和 <strong>sdstrim</strong>（裁剪）。重点分析每个操作的算法步骤和典型用法。
      </p>

      {/* 修改操作演示 */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-emerald-600" size={24} />
          四种修改操作一览
        </h2>
        <p className="text-slate-600 mb-4">
          下面是 sdscat（追加）、sdscpy（复制）、sdsrange（截取）、sdstrim（裁剪）四种修改操作的演示，
          点击按钮可切换查看不同操作的效果。
        </p>
        <ModifyOperationsDiagram />
      </section>

      {/* 字符串操作流程图 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="text-blue-600" size={24} />
          操作执行流程详解
        </h2>
        <p className="text-slate-600 mb-4">
          选择不同的操作查看其执行流程，拖动进度条可以逐步查看每个步骤的详细信息。
          通过这个流程图，你可以深入理解 SDS 内部是如何保证操作安全的。
        </p>
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <label className="text-sm text-slate-600">选择操作:</label>
          <select
            value={currentOperation}
            onChange={(e) => {
              setCurrentOperation(e.target.value as SDSOperation);
              setCurrentStep(0);
            }}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
          >
            <option value="sdscat">sdscat - 字符串追加</option>
            <option value="sdscpy">sdscpy - 字符串复制</option>
            <option value="sdsrange">sdsrange - 区间截取</option>
            <option value="sdstrim">sdstrim - 两端裁剪</option>
          </select>
          <label className="text-sm text-slate-600 ml-4">当前步骤:</label>
          <input
            type="range"
            min="0"
            max="7"
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value))}
            className="w-48"
          />
          <span className="text-sm font-mono text-slate-800">{currentStep + 1}</span>
        </div>
        <D3StringOperationFlow
          operation={currentOperation}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          params={{
            inputString: 'hello',
            concatString: ' world',
            copyString: 'hi',
          }}
        />
      </section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Plus className="text-blue-600" size={28} />
          sdscat - 字符串追加（拼接）
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
                { text: '计算新长度: newLen = sds.len + appendStr.len', desc: '确定追加后总长度' },
                { text: '检查是否需要扩容: newLen > sds.alloc', desc: '空间不足时触发扩容' },
                { text: '如果需要扩容，按预分配策略分配新空间', desc: '避免频繁扩容（详见预分配策略）' },
                { text: '将追加字符串复制到 buf 末尾', desc: '数据整合' },
                { text: '更新 len 和 alloc', desc: '维护元数据' },
                { text: '写入新的终止符 \\0', desc: '兼容 C 字符串函数' },
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
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold text-amber-800 text-sm">预分配策略</h4>
              <p className="text-amber-700 text-sm mt-1">
                sdscat 在扩容时会采用预分配策略，<Link to="/pre-allocation" className="text-amber-600 hover:underline inline-flex items-center gap-1">
                  详见预分配策略专题 <ExternalLink size={12} />
                </Link>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 将字符串追加到 SDS 末尾
 * @param sds 目标 SDS
 * @param append 要追加的字符串
 * @return 新的 SDS 状态
 */
public SDSState sdscat(SDSState sds, String append) {
    int newLen = sds.len + append.length(); // 新长度
    int newAlloc = sds.alloc;              // 新容量
    char[] newBuf = Arrays.copyOf(sds.buf, sds.buf.length);

    // 检查是否需要扩容
    if (newLen > sds.alloc) {
        newAlloc = preAllocate(sds.len, append.length());
        newBuf = new char[newAlloc + 1];
        // 复制旧数据到新缓冲区
        for (int i = 0; i < sds.len; i++) newBuf[i] = sds.buf[i];
    }

    // 复制追加内容到末尾
    for (int i = 0; i < append.length(); i++) {
        newBuf[sds.len + i] = append.charAt(i);
    }
    newBuf[newLen] = '\\0'; // 写入终止符
    return new SDSState(determineType(newAlloc), newLen, newAlloc, newBuf, sds.originalString + append);
}`} language="java" />
          </motion.div>
        </div>

        <motion.div
          className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h4 className="font-semibold text-emerald-800 mb-2">示例详解</h4>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div>输入: <code>sdscat("hello", " world")</code></div>
            <div className="mt-2 text-slate-600">
              <p>1. sds.len=5, append.len=6, newLen=11</p>
              <p>2. 原 alloc=5, 11 &gt; 5，需要扩容</p>
              <p>3. 预分配策略: newAlloc = 11 * 2 = 22</p>
              <p>4. 分配新缓冲区，复制 "hello"</p>
              <p>5. 复制 " world" 到末尾</p>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="text-emerald-700">结果: len=11, alloc=22, buf="hello world\0"</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* sdscat 追加操作演示 */}
      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Play className="text-emerald-600" size={20} />
          sdscat 追加操作演示
        </h2>
        <p className="text-slate-600 mb-4">
          点击"下一步"按钮逐步观看 sdscat 操作的详细执行流程，包括空间检查、扩容、复制数据等步骤。
        </p>
        <D3SdscatOperation initialString="Hello" appendString=" World" animated={true} />
      </motion.section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Copy className="text-blue-600" size={28} />
          sdscpy - 字符串复制（覆盖）
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
                { text: '计算新字符串长度: newLen', desc: '待复制字符串的长度' },
                { text: '检查 newLen <= sds.alloc', desc: '判断是否需要扩容' },
                { text: '如果足够，原地覆盖 buf', desc: '复用现有空间' },
                { text: '如果不够，扩容后复制', desc: '分配新空间' },
                { text: '更新 len，写入终止符', desc: '维护元数据' },
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

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4">
              <h4 className="font-semibold text-blue-800 text-sm">sdscpy vs sdscat</h4>
              <p className="text-sm text-blue-700 mt-1">
                <code>sdscpy</code> 是<strong>覆盖</strong>操作，用新字符串完全替换原内容。<br/>
                <code>sdscat</code> 是<strong>追加</strong>操作，在原内容末尾添加新内容。
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 用新字符串覆盖 SDS 内容
 * @param sds 目标 SDS
 * @param value 新的字符串
 * @return 新的 SDS 状态
 */
public SDSState sdscpy(SDSState sds, String value) {
    int newLen = value.length();        // 新字符串长度
    int newAlloc = sds.alloc;           // 新容量
    char[] newBuf = Arrays.copyOf(sds.buf, sds.buf.length);

    // 如果新长度超过容量，需要扩容
    if (newLen > sds.alloc) {
        newAlloc = newLen;              // 精确分配
        newBuf = new char[newAlloc + 1];
    }

    // 复制新内容到缓冲区
    for (int i = 0; i < newLen; i++) {
        newBuf[i] = value.charAt(i);
    }
    newBuf[newLen] = '\\0';
    return new SDSState(determineType(newAlloc), newLen, newAlloc, newBuf, value);
}`} language="java" />
          </motion.div>
        </div>

        <motion.div
          className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h4 className="font-semibold text-emerald-800 mb-2">示例详解</h4>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div>输入: <code>sdscpy("hello world", "hi")</code></div>
            <div className="mt-2 text-slate-600">
              <p>1. 原 sds.len=11, alloc=22</p>
              <p>2. 新字符串 "hi" 长度 newLen=2</p>
              <p>3. 2 &lt;= 22，无需扩容</p>
              <p>4. 原地覆盖 buf[0..1] = "hi"</p>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="text-emerald-700">结果: len=2, alloc=22（不变）, buf="hi\0"</p>
              <p className="text-xs text-slate-500 mt-1">
                注意：alloc 保持 22，free=20。这是惰性回收的体现。
                <Link to="/lazy-free" className="text-emerald-600 hover:underline inline-flex items-center gap-1 ml-1">
                  详见惰性回收 <ExternalLink size={12} />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* sdscpy 复制操作演示 */}
      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Play className="text-emerald-600" size={20} />
          sdscpy 复制操作演示
        </h2>
        <p className="text-slate-600 mb-4">
          点击"下一步"按钮逐步观看 sdscpy 操作的详细执行流程，包括覆盖复制的过程。
        </p>
        <D3SdscpyOperation originalString="Hello World" newString="Hi" animated={true} />
      </motion.section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Layers className="text-blue-600" size={28} />
          sdsrange - 区间截取（切片）
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              {[
                { text: '归一化区间: validStart = max(0, start)', desc: '处理负数索引' },
                { text: 'validEnd = min(len-1, end)', desc: '确保不越界' },
                { text: '计算新长度: newLen = validEnd - validStart + 1', desc: '区间内字符数' },
                { text: '将区间数据前移到 buf[0]', desc: '内存紧缩' },
                { text: '写入新的终止符', desc: '截断点' },
                { text: '更新 len，alloc 不变', desc: '惰性回收，free 增大' },
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <span className="text-slate-800">{step.text}</span>
                  <span className="text-xs text-slate-500 ml-2">({step.desc})</span>
                </motion.li>
              ))}
            </ol>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mt-4">
              <h4 className="font-semibold text-amber-800 text-sm">负数索引支持</h4>
              <p className="text-sm text-amber-700 mt-1">
                SDS 支持负数索引，-1 表示最后一个字符，-2 表示倒数第二个，以此类推。
                内部会自动转换为正数索引进行处理。
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4">
              <h4 className="font-semibold text-blue-800 text-sm">惰性回收</h4>
              <p className="text-blue-700 text-sm mt-1">
                sdsrange 不会立即释放多余空间，alloc 保持不变，free 增大。
                <Link to="/lazy-free" className="text-blue-600 hover:underline inline-flex items-center gap-1 ml-1">
                  详见惰性回收 <ExternalLink size={12} />
                </Link>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 保留指定区间的字符
 * @param sds 源 SDS
 * @param start 起始位置（支持负数）
 * @param end 结束位置（支持负数）
 * @return 新的 SDS 状态
 */
public SDSState sdsrange(SDSState sds, int start, int end) {
    // 归一化索引：负数转正数
    int validStart = Math.max(0, start);
    int validEnd = Math.min(sds.len - 1, end);

    // 空区间检测
    if (validStart > validEnd) return sdsempty();

    int newLen = validEnd - validStart + 1; // 新长度
    char[] newBuf = Arrays.copyOf(sds.buf, sds.buf.length);

    // 将区间数据前移到 buf[0]
    for (int i = 0; i < newLen; i++) {
        newBuf[i] = sds.buf[validStart + i];
    }
    newBuf[newLen] = '\\0';

    return new SDSState(sds.type, newLen, sds.alloc, newBuf,
        sds.originalString.substring(validStart, validEnd + 1));
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
            <div>输入: <code>sdsrange("hello", 1, 3)</code></div>
            <div className="mt-2 text-slate-600">
              <p>1. validStart = max(0, 1) = 1</p>
              <p>2. validEnd = min(4, 3) = 3（len=5，所以 len-1=4）</p>
              <p>3. newLen = 3 - 1 + 1 = 3</p>
              <p>4. 复制 buf[1..3] 到 buf[0..2]</p>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="text-emerald-700">结果: len=3, alloc=5（不变）, buf="ell\0"</p>
              <p className="text-xs text-slate-500 mt-1">
                注意：alloc 保持 5，free=2。这是惰性回收。
                <Link to="/lazy-free" className="text-emerald-600 hover:underline inline-flex items-center gap-1 ml-1">
                  详见惰性回收 <ExternalLink size={12} />
                </Link>
              </p>
            </div>
            <div className="mt-3 text-slate-600 text-xs">
              <p>负数索引示例: <code>sdsrange("hello", 0, -2)</code></p>
              <p>-2 转换为 len-2 = 3，区间 [0, 3] 保留 "hell"</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Eraser className="text-blue-600" size={28} />
          sdstrim - 两端裁剪
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              {[
                { text: '构建裁剪字符集合 trimSet', desc: 'Set<Character>快速查找' },
                { text: '从左向右扫描，跳过 trimSet 中的字符', desc: '找到第一个非裁剪字符' },
                { text: '从右向左扫描，跳过 trimSet 中的字符', desc: '找到最后一个非裁剪字符' },
                { text: '计算保留区间 [start, end]', desc: '内部截取范围' },
                { text: '调用 sdsrange 完成实际裁剪', desc: '复用 sdsrange 实现' },
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  <span className="text-slate-800">{step.text}</span>
                  <span className="text-xs text-slate-500 ml-2">({step.desc})</span>
                </motion.li>
              ))}
            </ol>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mt-4">
              <h4 className="font-semibold text-purple-800 text-sm">应用场景</h4>
              <p className="text-sm text-purple-700 mt-1">
                sdstrim 常用于去除用户输入首尾的空白字符：<br/>
                <code>sdstrim(userInput, " \t\n\r")</code>
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4">
              <h4 className="font-semibold text-blue-800 text-sm">惰性回收</h4>
              <p className="text-blue-700 text-sm mt-1">
                sdstrim 调用 sdsrange 实现，同样采用惰性回收策略。
                <Link to="/lazy-free" className="text-blue-600 hover:underline inline-flex items-center gap-1 ml-1">
                  详见惰性回收 <ExternalLink size={12} />
                </Link>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 删除字符串两端的指定字符
 * @param sds 源 SDS
 * @param trimChars 要删除的字符集合（字符串形式）
 * @return 裁剪后的新 SDS
 */
public SDSState sdstrim(SDSState sds, String trimChars) {
    // 将字符集合转为 Set 便于 O(1) 查找
    Set<Character> trimSet = toSet(trimChars);
    int start = 0, end = sds.len - 1;

    // 从左向右：跳过所有在 trimSet 中的字符
    while (start <= end && trimSet.contains(sds.buf[start])) {
        start++;
    }

    // 从右向左：跳过所有在 trimSet 中的字符
    while (end >= start && trimSet.contains(sds.buf[end])) {
        end--;
    }

    // 空字符串检测
    if (start > end) return sdsempty();

    // 复用 sdsrange 完成实际截取
    return sdsrange(sds, start, end);
}`} language="java" />
          </motion.div>
        </div>

        <motion.div
          className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h4 className="font-semibold text-emerald-800 mb-2">示例详解</h4>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div>输入: <code>sdstrim("xxhello worldxx", "x")</code></div>
            <div className="mt-2 text-slate-600">
              <p>1. trimSet = {'{x}'}</p>
              <p>2. start=0, buf[0]='x' 在 trimSet 中，start++ → 1</p>
              <p>3. start=1, buf[1]='x' 在 trimSet 中，start++ → 2</p>
              <p>4. start=2, buf[2]='h' 不在 trimSet，停止</p>
              <p>5. end=12, buf[12]='x' 在 trimSet 中，end-- → 11</p>
              <p>6. end=11, buf[11]='x' 在 trimSet 中，end-- → 10</p>
              <p>7. end=10, buf[10]='d' 不在 trimSet，停止</p>
              <p>8. 调用 sdsrange(sds, 2, 10)</p>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="text-emerald-700">结果: 保留 "hello world"，len=11, alloc=22（不变）</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-slate-100 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-slate-800 mb-3">修改操作对比表</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-300 px-3 py-2 text-left">操作</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">功能</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">alloc 变化</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">典型用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdscat</td>
                  <td className="border border-slate-300 px-3 py-2">追加到末尾</td>
                  <td className="border border-slate-300 px-3 py-2">可能扩容（预分配）</td>
                  <td className="border border-slate-300 px-3 py-2">字符串拼接</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdscpy</td>
                  <td className="border border-slate-300 px-3 py-2">完全覆盖</td>
                  <td className="border border-slate-300 px-3 py-2">可能扩容（精确）</td>
                  <td className="border border-slate-300 px-3 py-2">字符串替换</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdsrange</td>
                  <td className="border border-slate-300 px-3 py-2">区间截取</td>
                  <td className="border border-slate-300 px-3 py-2">不变（惰性回收）</td>
                  <td className="border border-slate-300 px-3 py-2">子字符串提取</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdstrim</td>
                  <td className="border border-slate-300 px-3 py-2">两端裁剪</td>
                  <td className="border border-slate-300 px-3 py-2">不变（惰性回收）</td>
                  <td className="border border-slate-300 px-3 py-2">去除首尾字符</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* 相关链接 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">相关专题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/pre-allocation"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
          >
            <Layers size={24} className="text-blue-600" />
            <div>
              <p className="font-semibold text-slate-800">预分配策略专题</p>
              <p className="text-sm text-slate-500">了解避免频繁扩容的智慧</p>
            </div>
            <ExternalLink size={16} className="ml-auto text-slate-400" />
          </Link>
          <Link
            to="/lazy-free"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
          >
            <Sparkles size={24} className="text-blue-600" />
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
          to="/operations/create"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：创建操作
        </Link>
        <Link
          to="/operations/memory"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：内存操作
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
