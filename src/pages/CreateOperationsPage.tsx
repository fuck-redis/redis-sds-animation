import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Play, Layers, Plus, Copy, Database, Zap, CheckCircle, ArrowDown, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { SDSMemoryDiagram } from '@/components/video';
import { CodeBlock } from '@/components/code/CodeBlock';
import { useState } from 'react';

export function CreateOperationsPage() {
  const [sdsnewExample, setSdsnewExample] = useState('hello');
  const [sdsemptyDemo, setSdsemptyDemo] = useState(false);
  const [sdsdupDemo, setSdsdupDemo] = useState(false);

  // 模拟 sdsnew 的结果
  const sdsnewResult = () => {
    const len = sdsnewExample.length;
    let type = 'TYPE_5';
    let headerSize = 1;
    if (len >= 32) { type = 'TYPE_8'; headerSize = 3; }
    if (len >= 256) { type = 'TYPE_16'; headerSize = 5; }
    return {
      type,
      headerSize,
      len,
      alloc: len,
      totalSize: headerSize + len + 1
    };
  };

  const result = sdsnewResult();

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <Link to="/operations" className="text-emerald-700 hover:underline">SDS 操作</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">创建操作</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">创建操作详解</h1>

      <p className="text-lg text-slate-600">
        本页深入讲解 SDS 的三种创建操作：<strong>sdsnew</strong>（从字符串创建）、<strong>sdsempty</strong>（创建空字符串）、
        <strong>sdsdup</strong>（复制已有 SDS）。重点分析类型选择、内存布局和算法步骤。
      </p>

      {/* sdsnew */}
      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Plus className="text-emerald-600" size={28} />
          sdsnew - 根据字符串创建 SDS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-700">
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <strong>计算长度：</strong>获取输入字符串的字节数 len
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <strong>选择类型：</strong>根据 len 调用 determineType() 选择合适的 SDS 类型
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <strong>分配空间：</strong>分配 alloc = len 的缓冲区（刚好容纳数据）
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <strong>复制数据：</strong>将输入字符串内容复制到 buf[]
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <strong>添加终止符：</strong>在末尾写入 <code className="bg-slate-100 px-1 rounded">\0</code>，兼容 C 字符串函数
              </motion.li>
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">代码实现 (Java)</h3>
            <CodeBlock code={`/**
 * 根据初始字符串创建新的 SDS 实例
 * @param init 初始字符串
 * @return 新的 SDS 状态
 */
public SDSState vdsnew(String init) {
    int len = init.length();           // 获取字符串长度
    SDSType type = determineType(len); // 根据长度选择类型
    int alloc = len;                  // 分配恰好容纳数据的大小
    char[] buf = new char[alloc + 1]; // +1 为终止符 \\0
    // 复制字符串内容到缓冲区
    for (int i = 0; i < len; i++) {
        buf[i] = init.charAt(i);
    }
    buf[len] = '\\0';                  // 添加字符串终止符
    return new SDSState(type, len, alloc, buf, init);
}`} language="java" />
          </motion.div>
        </div>

        {/* 交互式演示 */}
        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
          <h4 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <Play size={16} />
            动手体验：sdsnew 实际效果
          </h4>
          <div className="flex flex-wrap gap-3 mb-4">
            {['hello', 'redis', 'a', 'hello world, this is a test'].map(str => (
              <button
                key={str}
                onClick={() => setSdsnewExample(str)}
                className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                  sdsnewExample === str
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-emerald-100 border border-slate-300'
                }`}
              >
                "{str}"
              </button>
            ))}
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-50 rounded p-2 text-center">
                <p className="text-xs text-slate-500">输入</p>
                <p className="font-mono text-sm font-bold">"{sdsnewExample}"</p>
              </div>
              <div className="bg-emerald-50 rounded p-2 text-center">
                <p className="text-xs text-slate-500">长度 len</p>
                <p className="font-mono text-sm font-bold text-emerald-600">{result.len}</p>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <p className="text-xs text-slate-500">类型</p>
                <p className="font-mono text-sm font-bold text-blue-600">{result.type}</p>
              </div>
              <div className="bg-amber-50 rounded p-2 text-center">
                <p className="text-xs text-slate-500">总内存</p>
                <p className="font-mono text-sm font-bold text-amber-600">{result.totalSize} B</p>
              </div>
            </div>
            <div className="bg-slate-100 rounded p-3">
              <p className="text-xs text-slate-500 mb-2">内存布局：</p>
              <div className="flex flex-wrap gap-1">
                {result.type === 'TYPE_5' ? (
                  <div className="flex">
                    <div className="w-8 h-8 bg-emerald-500 rounded-l flex items-center justify-center text-white text-xs">H</div>
                    <div className="flex">
                      {sdsnewExample.split('').map((c, i) => (
                        <div key={i} className="w-8 h-8 bg-emerald-200 flex items-center justify-center text-emerald-800 text-xs border-l border-emerald-300">
                          {c}
                        </div>
                      ))}
                      <div className="w-8 h-8 bg-slate-300 rounded-r flex items-center justify-center text-slate-600 text-xs border-l border-slate-400">
                        \0
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="w-8 h-8 bg-blue-500 rounded-l flex items-center justify-center text-white text-xs">len</div>
                    <div className="w-8 h-8 bg-blue-400 flex items-center justify-center text-white text-xs border-l border-blue-500">alloc</div>
                    <div className="w-8 h-8 bg-blue-300 flex items-center justify-center text-blue-800 text-xs border-l border-blue-400">flags</div>
                    <div className="flex">
                      {sdsnewExample.split('').map((c, i) => (
                        <div key={i} className="w-8 h-8 bg-blue-200 flex items-center justify-center text-blue-800 text-xs border-l border-blue-300">
                          {c}
                        </div>
                      ))}
                      <div className="w-8 h-8 bg-slate-300 rounded-r flex items-center justify-center text-slate-600 text-xs border-l border-slate-400">
                        \0
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-2 text-center">SDS 创建后内存布局示意</p>
          <SDSMemoryDiagram />
        </div>

        {/* 类型选择与创建关系 */}
        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Layers size={16} className="text-amber-600" />
            类型选择与创建关系
          </h4>
          <p className="text-amber-700 text-sm mb-3">
            创建 SDS 时，类型是根据初始字符串长度自动选择的。这个选择影响 header 大小和能表示的最大长度：
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-200">
                  <th className="border border-amber-300 px-3 py-2 text-left">类型</th>
                  <th className="border border-amber-300 px-3 py-2 text-left">Header 大小</th>
                  <th className="border border-amber-300 px-3 py-2 text-left">长度阈值</th>
                  <th className="border border-amber-300 px-3 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-amber-300 px-3 py-2 font-mono">TYPE_5</td>
                  <td className="border border-amber-300 px-3 py-2">1 字节</td>
                  <td className="border border-amber-300 px-3 py-2">len &lt; 32</td>
                  <td className="border border-amber-300 px-3 py-2">最小类型，适合短字符串</td>
                </tr>
                <tr className="bg-amber-50">
                  <td className="border border-amber-300 px-3 py-2 font-mono">TYPE_8</td>
                  <td className="border border-amber-300 px-3 py-2">3 字节</td>
                  <td className="border border-amber-300 px-3 py-2">32 &le; len &lt; 256</td>
                  <td className="border border-amber-300 px-3 py-2">中等长度字符串</td>
                </tr>
                <tr>
                  <td className="border border-amber-300 px-3 py-2 font-mono">TYPE_16</td>
                  <td className="border border-amber-300 px-3 py-2">5 字节</td>
                  <td className="border border-amber-300 px-3 py-2">256 &le; len &lt; 65536</td>
                  <td className="border border-amber-300 px-3 py-2">长字符串</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* sdsempty */}
      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Database className="text-blue-600" size={28} />
          sdsempty - 创建空 SDS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-700">
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <strong>创建空 SDS：</strong>len = 0，alloc = 0
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <strong>选择最小类型：</strong>使用 TYPE_5（1字节 header）
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <strong>分配缓冲区：</strong>buf 仅包含终止符 <code className="bg-slate-100 px-1 rounded">\0</code>
              </motion.li>
            </ol>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Zap size={16} className="text-amber-600" />
                应用场景
              </h4>
              <p className="text-amber-700 text-sm">
                sdsempty() 通常用于需要先创建空 SDS 再进行后续操作的场景。
                创建后通常会配合 <strong>sdsMakeRoomFor</strong> 进行预分配，为后续追加做好准备。
              </p>
              <div className="mt-2">
                <Link to="/operations/memory" className="text-amber-600 hover:underline text-sm inline-flex items-center gap-1">
                  详见内存操作专题 <ExternalLink size={12} />
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
 * 创建空的 SDS 字符串
 * @return 空的 SDS 状态
 */
public SDSState vdsempty() {
    return new SDSState(
        SDSType.SDS_TYPE_5,  // 使用最小类型
        0,                    // len = 0，没有数据
        0,                    // alloc = 0，未分配空间
        new char[] {'\\0'},  // buf 只有终止符
        ""                    // 原始字符串为空
    );
}`} language="java" />
          </motion.div>
        </div>

        {/* 交互式演示 */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <Play size={16} />
            动手体验：sdsempty + sdsMakeRoomFor
          </h4>
          <button
            onClick={() => setSdsemptyDemo(!sdsemptyDemo)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {sdsemptyDemo ? '重置演示' : '开始演示'}
          </button>

          {sdsemptyDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 bg-white rounded-lg p-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                  <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">sds = sdsempty()</code>
                  <span className="text-blue-600 text-sm">// 创建空 SDS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                  <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">sds = sdsMakeRoomFor(sds, 1024)</code>
                  <span className="text-blue-600 text-sm">// 预分配 1KB 空间</span>
                </div>
                <div className="bg-slate-100 rounded p-3">
                  <p className="text-xs text-slate-500 mb-2">预分配后的状态：</p>
                  <div className="flex gap-2 text-sm">
                    <span className="bg-emerald-100 px-2 py-1 rounded">len = 0</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">alloc = 1024</span>
                    <span className="bg-amber-100 px-2 py-1 rounded">free = 1024</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    现在可以安全地追加最多 1024 字节而无需扩容！
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 典型用法 */}
        <div className="mt-6 bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            典型用法示例
          </h4>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <div className="text-slate-500">// 场景：构建一个 JSON 字符串</div>
            <div className="mt-2"><code>sds = sdsempty()</code></div>
            <div><code>sds = sdsMakeRoomFor(sds, 4096)</code>  <span className="text-slate-400">// 预分配 4KB</span></div>
            <div className="mt-2"><code>sds = sdscat(sds, &quot;name&quot;: &quot;redis&quot;)</code></div>
            <div><code>sds = sdscat(sds, &quot;version&quot;: &quot;7.0&quot;)</code></div>
            <div className="mt-2 text-slate-400">// 所有追加操作都在预分配空间内完成，无扩容！</div>
          </div>
        </div>
      </motion.section>

      {/* sdsdup */}
      <motion.section
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Copy className="text-purple-600" size={28} />
          sdsdup - 复制 SDS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">算法步骤</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-700">
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <strong>分配新空间：</strong>根据原 SDS 的 alloc 分配新缓冲区
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <strong>复制元数据：</strong>复制 type、len、alloc 字段
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <strong>深拷贝数据：</strong>完整复制 buf[] 内容（不是引用）
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <strong>返回新指针：</strong>返回独立的新 SDS 实例
              </motion.li>
            </ol>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded mt-4">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Copy size={16} className="text-purple-600" />
                深拷贝 vs 浅拷贝
              </h4>
              <p className="text-purple-700 text-sm">
                sdsdup 是<strong>深拷贝</strong>，新旧 SDS 共享数据的修改互不影响。
                这与引用拷贝不同，引用拷贝两个指针指向同一块内存，修改一个会影响另一个。
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
 * 复制 SDS 字符串（深拷贝）
 * @param src 源 SDS
 * @return 新的独立 SDS 实例
 */
public SDSState vdsdup(SDSState src) {
    // 完整复制 buf 数组（深拷贝）
    char[] copied = Arrays.copyOf(src.buf, src.buf.length);
    // 创建新实例，复制所有元数据
    return new SDSState(
        src.type,              // 复制类型
        src.len,              // 复制长度
        src.alloc,            // 复制分配空间
        copied,               // 使用新复制的缓冲区
        src.originalString    // 复制原始字符串
    );
}`} language="java" />
          </motion.div>
        </div>

        {/* 交互式演示 */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <Play size={16} />
            动手体验：sdsdup 深拷贝效果
          </h4>
          <button
            onClick={() => setSdsdupDemo(!sdsdupDemo)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            {sdsdupDemo ? '重置演示' : '开始演示'}
          </button>

          {sdsdupDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 bg-white rounded-lg p-4"
            >
              <div className="space-y-4">
                <div className="bg-slate-100 rounded p-3">
                  <p className="text-xs text-slate-500 mb-2">原始 SDS s1 = "hello"</p>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 bg-emerald-500 rounded-l flex items-center justify-center text-white text-xs">H</div>
                    <div className="flex">
                      {['h', 'e', 'l', 'l', 'o'].map((c, i) => (
                        <div key={i} className="w-8 h-8 bg-emerald-200 flex items-center justify-center text-emerald-800 text-xs border-l border-emerald-300">
                          {c}
                        </div>
                      ))}
                      <div className="w-8 h-8 bg-slate-300 rounded-r flex items-center justify-center text-slate-600 text-xs border-l border-slate-400">\0</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">s1: len=5, alloc=10</p>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowDown size={20} className="text-purple-600" />
                </div>

                <div className="bg-slate-100 rounded p-3">
                  <p className="text-xs text-slate-500 mb-2">sdsdup(s1) 创建 s2</p>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 bg-purple-500 rounded-l flex items-center justify-center text-white text-xs">H</div>
                    <div className="flex">
                      {['h', 'e', 'l', 'l', 'o'].map((c, i) => (
                        <div key={i} className="w-8 h-8 bg-purple-200 flex items-center justify-center text-purple-800 text-xs border-l border-purple-300">
                          {c}
                        </div>
                      ))}
                      <div className="w-8 h-8 bg-slate-300 rounded-r flex items-center justify-center text-slate-600 text-xs border-l border-slate-400">\0</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">s2: len=5, alloc=10（独立副本）</p>
                </div>

                <div className="bg-amber-50 rounded p-3">
                  <p className="text-amber-800 text-sm font-medium">
                    <strong>关键：</strong>修改 s2 不会影响 s1！
                  </p>
                  <p className="text-amber-700 text-xs mt-1">
                    sdscat(s2, "!") 后，s1 仍然是 "hello"，s2 变成 "hello!"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 三种创建操作对比 */}
        <div className="bg-slate-100 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Layers size={16} />
            三种创建操作对比
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-300 px-3 py-2 text-left">操作</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">输入</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">alloc 初始值</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">特点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdsnew</td>
                  <td className="border border-slate-300 px-3 py-2">任意字符串</td>
                  <td className="border border-slate-300 px-3 py-2">alloc = len</td>
                  <td className="border border-slate-300 px-3 py-2">最常用，按需分配</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdsempty</td>
                  <td className="border border-slate-300 px-3 py-2">无</td>
                  <td className="border border-slate-300 px-3 py-2">alloc = 0</td>
                  <td className="border border-slate-300 px-3 py-2">需要后续预分配或追加</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 font-mono">sdsdup</td>
                  <td className="border border-slate-300 px-3 py-2">已有 SDS</td>
                  <td className="border border-slate-300 px-3 py-2">alloc = 原 alloc</td>
                  <td className="border border-slate-300 px-3 py-2">深拷贝，保留预分配空间策略</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* Redis 实际命令对应 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Redis 命令与 SDS 创建操作的对应</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">Redis 命令</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">内部调用的 SDS 函数</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">说明</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cmd: 'SET key value', func: 'sdsnew(value)', desc: '从字符串创建新的 SDS' },
                { cmd: 'SET key ""', func: 'sdsempty()', desc: '创建空字符串' },
                { cmd: 'SET newkey oldkey', func: 'sdsdup(oldkey)', desc: '复制已有键的值' },
                { cmd: 'APPEND key value', func: 'sdscat() 或 sdsMakeRoomFor()', desc: '追加或扩容后追加' },
                { cmd: 'SETRANGE key offset value', func: 'sdscpy() + 扩容检查', desc: '覆写指定位置' },
              ].map((item, i) => (
                <motion.tr
                  key={item.cmd}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="border border-slate-200 px-4 py-3 font-mono text-red-600">{item.cmd}</td>
                  <td className="border border-slate-200 px-4 py-3 font-mono text-emerald-600">{item.func}</td>
                  <td className="border border-slate-200 px-4 py-3 text-slate-600">{item.desc}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 相关链接 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">相关专题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/operations/memory"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200 hover:border-amber-400 transition-colors"
          >
            <Layers size={24} className="text-amber-600" />
            <div>
              <p className="font-semibold text-slate-800">内存操作专题</p>
              <p className="text-sm text-slate-500">预分配与空间释放的详细讲解</p>
            </div>
            <ExternalLink size={16} className="ml-auto text-slate-400" />
          </Link>
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
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/operations"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：操作总览
        </Link>
        <Link
          to="/operations/modify"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：修改操作
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
