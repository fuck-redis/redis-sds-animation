import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Box, Layers, Cpu, Database, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SDSMemoryDiagram, TypeSwitchingDiagram } from '@/components/video';
import { D3SDSMemoryVisualizer, D3TypeSelectionTree } from '@/components/visualization/D3Components';
import { SDSType } from '@/types/sds';
import { useState } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';

export function StructurePage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SDSType>(SDSType.SDS_TYPE_5);
  const [currentLength, setCurrentLength] = useState(20);

  // 计算给定长度的 SDS 实际占用内存
  const calculateMemory = (len: number) => {
    let type = SDSType.SDS_TYPE_5;
    let headerSize = 1;
    if (len >= 32) { type = SDSType.SDS_TYPE_8; headerSize = 3; }
    if (len >= 256) { type = SDSType.SDS_TYPE_16; headerSize = 5; }
    if (len >= 65536) { type = SDSType.SDS_TYPE_32; headerSize = 9; }
    if (len >= 4294967296) { type = SDSType.SDS_TYPE_64; headerSize = 17; }
    return { type, headerSize, total: headerSize + len + 1 }; // +1 for null terminator
  };

  const memoryExample = calculateMemory(currentLength);

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <Link to="/introduction" className="text-emerald-700 hover:underline">SDS 简介</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">SDS 头部结构</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">SDS 头部结构详解</h1>

      <p className="text-lg text-slate-600">
        SDS 的精髓在于它的头部设计。通过在字符串前添加几个字节的元数据，
        SDS 实现了 <strong>O(1) 长度获取</strong>、<strong>自动扩容</strong> 和 <strong>二进制安全</strong>。
        让我们深入了解这个设计。
      </p>

      {/* SDS 内存布局图 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Box className="text-blue-600" size={28} />
          SDS 内存结构全景图
        </h2>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <p className="text-sm text-slate-600 mb-4 text-center">SDS 内存布局示意图 - 点击各区域查看详情</p>
          <SDSMemoryDiagram />
        </div>

        {/* 可点击的内存区域说明 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">点击探索：SDS 内存结构详解</h3>
          <D3SDSMemoryVisualizer
            sds={{
              type: SDSType.SDS_TYPE_8,
              len: currentLength,
              alloc: 32,
              flags: 0,
              buf: 'Hello, Redis!'.split('').map((c, i) => i < currentLength ? c : '\0'),
              originalString: 'Hello, Redis!',
            }}
            selectedRegion={selectedRegion}
            onRegionClick={setSelectedRegion}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
            <div className="font-mono text-sm text-emerald-800 font-bold mb-2">len 字段</div>
            <p className="text-sm text-emerald-700 mt-1">已使用的字节数（不含 \0）</p>
            <div className="mt-3 bg-emerald-100 rounded p-3">
              <p className="text-xs text-emerald-800 font-medium">
                <Zap size={12} className="inline mr-1" />
                核心优势：<strong>O(1)</strong> 获取长度，无需遍历
              </p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="font-mono text-sm text-blue-800 font-bold mb-2">alloc 字段</div>
            <p className="text-sm text-blue-700 mt-1">总分配空间（不含 header 和 \0）</p>
            <div className="mt-3 bg-blue-100 rounded p-3">
              <p className="text-xs text-blue-800 font-medium">
                <Database size={12} className="inline mr-1" />
                作用：知道还有多少<strong>空闲空间</strong>可用
              </p>
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
            <div className="font-mono text-sm text-amber-800 font-bold mb-2">flags 字段</div>
            <p className="text-sm text-amber-700 mt-1">低3位存储类型，低5位可用于其他标志</p>
            <div className="mt-3 bg-amber-100 rounded p-3">
              <p className="text-xs text-amber-800 font-medium">
                <Cpu size={12} className="inline mr-1" />
                作用：标识当前 SDS <strong>类型</strong>，用于类型切换判断
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 mt-6">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Layers size={16} className="text-emerald-400" />
            SDS Header 结构（按类型不同而变化）
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg p-3 text-white font-mono text-xs">
              <div className="text-emerald-400 mb-2">// TYPE_5 (1 byte total)</div>
              <CodeBlock code={`struct sdshdr5 {
    unsigned char flags;  // 高5位存len，低3位存type
    char buf[];           // 柔性数组
};`} language="java" />
            </div>
            <div className="bg-slate-900 rounded-lg p-3 text-white font-mono text-xs">
              <div className="text-blue-400 mb-2">// TYPE_8 (3 bytes)</div>
              <CodeBlock code={`struct sdshdr8 {
    unsigned char flags;  // 低3位存type
    unsigned char len;    // 1字节已用长度
    unsigned char alloc;  // 1字节总分配
    char buf[];           // 柔性数组
};`} language="java" />
            </div>
          </div>
          <div className="mt-4 bg-slate-700 rounded p-3">
            <p className="text-slate-300 text-xs">
              <strong>注意：</strong>TYPE_16/32/64 的 header 结构类似 TYPE_8，只是 len 和 alloc 分别扩展为 2/4/8 字节。
              <code className="bg-slate-600 px-1 rounded mx-1">__attribute__ ((__packed__))</code>
              确保结构体紧凑，不添加 padding。
            </p>
          </div>
        </div>
      </section>

      {/* 五种类型图示 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Layers className="text-purple-600" size={28} />
          五种 Header 类型一览
        </h2>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <TypeSwitchingDiagram />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">类型</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">长度阈值</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">Header 大小</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">存储方式</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">典型应用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-50">
                <td className="border border-emerald-200 px-4 py-3 font-mono font-bold">SDS_TYPE_5</td>
                <td className="border border-emerald-200 px-4 py-3">
                  <span className="bg-emerald-100 px-2 py-1 rounded text-xs">0 ~ 31 字节</span>
                </td>
                <td className="border border-emerald-200 px-4 py-3 font-mono">1 字节</td>
                <td className="border border-emerald-200 px-4 py-3">flags 高5位直接存储 len</td>
                <td className="border border-emerald-200 px-4 py-3 text-slate-600">Redis 键名等超短字符串</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-3 font-mono font-bold">SDS_TYPE_8</td>
                <td className="border border-slate-200 px-4 py-3">
                  <span className="bg-blue-100 px-2 py-1 rounded text-xs">32 ~ 255 字节</span>
                </td>
                <td className="border border-slate-200 px-4 py-3 font-mono">3 字节</td>
                <td className="border border-slate-200 px-4 py-3">1B flags + 1B len + 1B alloc</td>
                <td className="border border-slate-200 px-4 py-3 text-slate-600">短字符串值、计数器</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-blue-200 px-4 py-3 font-mono font-bold">SDS_TYPE_16</td>
                <td className="border border-blue-200 px-4 py-3">
                  <span className="bg-blue-100 px-2 py-1 rounded text-xs">256 ~ 65535 字节</span>
                </td>
                <td className="border border-blue-200 px-4 py-3 font-mono">5 字节</td>
                <td className="border border-blue-200 px-4 py-3">1B flags + 2B len + 2B alloc</td>
                <td className="border border-blue-200 px-4 py-3 text-slate-600">中等长度字符串、JSON</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-3 font-mono font-bold">SDS_TYPE_32</td>
                <td className="border border-slate-200 px-4 py-3">
                  <span className="bg-amber-100 px-2 py-1 rounded text-xs">64KB ~ 4GB</span>
                </td>
                <td className="border border-slate-200 px-4 py-3 font-mono">9 字节</td>
                <td className="border border-slate-200 px-4 py-3">1B flags + 4B len + 4B alloc</td>
                <td className="border border-slate-200 px-4 py-3 text-slate-600">大字符串值、缓存数据</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="border border-amber-200 px-4 py-3 font-mono font-bold">SDS_TYPE_64</td>
                <td className="border border-amber-200 px-4 py-3">
                  <span className="bg-orange-100 px-2 py-1 rounded text-xs">大于 4GB</span>
                </td>
                <td className="border border-amber-200 px-4 py-3 font-mono">17 字节</td>
                <td className="border border-amber-200 px-4 py-3">1B flags + 8B len + 8B alloc</td>
                <td className="border border-amber-50 px-4 py-3 text-slate-600">超大字符串（极少使用）</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 内存计算器 */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
          <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <Cpu size={18} />
            内存计算器：实际占用多少内存？
          </h3>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="text-sm text-slate-600">字符串长度：</label>
            <input
              type="range"
              min="1"
              max="100"
              value={currentLength}
              onChange={(e) => setCurrentLength(parseInt(e.target.value))}
              className="w-48"
            />
            <span className="text-lg font-mono text-slate-800 bg-white px-3 py-1 rounded border">
              {currentLength} 字节
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded p-3 text-center">
              <p className="text-xs text-slate-500">Header</p>
              <p className="text-lg font-bold text-indigo-600">{memoryExample.headerSize} B</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="text-xs text-slate-500">数据</p>
              <p className="text-lg font-bold text-emerald-600">{currentLength} B</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="text-xs text-slate-500">终止符</p>
              <p className="text-lg font-bold text-slate-600">1 B</p>
            </div>
            <div className="bg-white rounded p-3 text-center border-2 border-indigo-300">
              <p className="text-xs text-slate-500">总计</p>
              <p className="text-lg font-bold text-indigo-700">{memoryExample.total} B</p>
            </div>
          </div>
          <p className="text-sm text-indigo-600 mt-3">
            <strong>当前类型：</strong>
            <span className="font-mono bg-indigo-100 px-2 py-0.5 rounded ml-1">{memoryExample.type}</span>
          </p>
        </div>
      </section>

      {/* 类型选择流程 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <ChevronRight className="text-blue-600" size={28} />
          类型选择算法
        </h2>

        <div className="bg-slate-900 rounded-lg p-6 text-white font-mono mb-6">
          <CodeBlock code={`/**
 * 根据字符串长度选择合适的 SDS 类型
 * @param len 字符串长度
 * @return 对应的 SDS 类型
 */
SDSType determineType(size_t len) {
    if (len < 32)           return SDS_TYPE_5;      // 极短字符串
    if (len < 256)          return SDS_TYPE_8;      // 短字符串
    if (len < 65536)        return SDS_TYPE_16;     // 中等字符串
    if (len < 4294967296)   return SDS_TYPE_32;     // 大字符串
    return SDS_TYPE_64;                                // 超大字符串
}`} language="java" />
        </div>

        <motion.div
          className="bg-slate-50 rounded-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-center space-x-4 text-sm font-mono">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-32 bg-slate-200 rounded-lg p-2 mb-2">输入字符串</div>
              <div className="text-slate-600">len</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ArrowRight size={20} className="text-slate-400" />
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-40 bg-emerald-100 rounded-lg p-2 mb-2">len &le; 32 ?</div>
              <div className="text-emerald-600">SDS_TYPE_5</div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center mt-4 space-x-4 text-sm">
            {['否 &rarr; TYPE_8', '否 &rarr; TYPE_16', '否 &rarr; TYPE_32', '否 &rarr; TYPE_64'].map((label, i) => (
              <motion.div
                key={label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="w-32 h-8 bg-slate-200 rounded mb-2" />
                <div className="text-slate-500 text-xs" dangerouslySetInnerHTML={{ __html: label }} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="inline-block bg-red-100 rounded-lg p-2">
              <span className="text-red-700 font-mono text-sm">SDS_TYPE_64</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-5 gap-2 mt-4 text-center text-xs text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="bg-rose-50 rounded p-2">&lt; 32B<br />TYPE_5</div>
          <div className="bg-blue-50 rounded p-2">&lt; 256B<br />TYPE_8</div>
          <div className="bg-emerald-50 rounded p-2">&lt; 64KB<br />TYPE_16</div>
          <div className="bg-amber-50 rounded p-2">&lt; 4GB<br />TYPE_32</div>
          <div className="bg-orange-50 rounded p-2">&ge; 4GB<br />TYPE_64</div>
        </motion.div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded mt-6">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Zap size={16} className="text-amber-600" />
            TYPE_5 的特殊设计
          </h4>
          <p className="text-amber-700 text-sm">
            TYPE_5 是最特殊的类型，它的 header 只有 1 字节（全部是 flags），
            长度信息直接存储在 flags 的高 5 位中。这种极致紧凑的设计使得
            "hello"（5字节）这样的短字符串只需要 6 字节（1字节header + 5字节数据）即可存储。
            这也是 Redis 存储数十亿个短键名依然高效的原因之一。
          </p>
        </div>

        {/* 类型选择判定树 */}
        <div className="mt-6 bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">交互式类型判定器</h3>
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm text-slate-600">拖动滑块选择长度：</label>
            <input
              type="range"
              min="0"
              max="100"
              value={currentLength}
              onChange={(e) => setCurrentLength(parseInt(e.target.value))}
              className="w-48"
            />
            <span className="text-sm font-mono text-slate-800 bg-white px-3 py-1 rounded border">
              {currentLength} 字节
            </span>
          </div>
          <D3TypeSelectionTree
            selectedType={selectedType}
            currentLength={currentLength}
            onTypeSelect={setSelectedType}
          />
        </div>
      </section>

      {/* 为什么需要多种类型 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">为什么需要多种类型？</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="bg-emerald-50 rounded-lg p-5 border border-emerald-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl mb-3">1B</div>
            <h3 className="font-bold text-emerald-800 mb-1">SDS_TYPE_5</h3>
            <p className="text-sm text-emerald-700">仅 1 字节 header，极致紧凑，适合键名</p>
          </motion.div>

          <motion.div
            className="bg-blue-50 rounded-lg p-5 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl mb-3">3~17B</div>
            <h3 className="font-bold text-blue-800 mb-1">TYPE_8/16/32/64</h3>
            <p className="text-sm text-blue-700">渐进式增大，支持更长字符串</p>
          </motion.div>

          <motion.div
            className="bg-amber-50 rounded-lg p-5 border border-amber-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl mb-3">节省 45%</div>
            <h3 className="font-bold text-amber-800 mb-1">内存效率</h3>
            <p className="text-sm text-amber-700">选择最小类型，减少开销</p>
          </motion.div>
        </div>

        <motion.div
          className="bg-slate-50 rounded-lg p-4 border-l-4 border-emerald-500 mt-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Database size={16} className="text-emerald-600" />
            实际内存对比：100万个 "hello" 字符串
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-200">
                  <th className="px-3 py-2 text-left">Header类型</th>
                  <th className="px-3 py-2 text-left">Header大小</th>
                  <th className="px-3 py-2 text-left">数据大小</th>
                  <th className="px-3 py-2 text-left">每条总大小</th>
                  <th className="px-3 py-2 text-left">100万条总内存</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-emerald-50">
                  <td className="px-3 py-2 font-mono">TYPE_5</td>
                  <td className="px-3 py-2">1 字节</td>
                  <td className="px-3 py-2">5 字节</td>
                  <td className="px-3 py-2">6 字节</td>
                  <td className="px-3 py-2 font-bold text-emerald-600">约 6MB</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono">TYPE_8</td>
                  <td className="px-3 py-2">3 字节</td>
                  <td className="px-3 py-2">5 字节</td>
                  <td className="px-3 py-2">9 字节</td>
                  <td className="px-3 py-2">约 9MB</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-3 py-2 font-mono">TYPE_16</td>
                  <td className="px-3 py-2">5 字节</td>
                  <td className="px-3 py-2">5 字节</td>
                  <td className="px-3 py-2">11 字节</td>
                  <td className="px-3 py-2">约 11MB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-emerald-100 rounded p-3">
            <p className="text-emerald-800 text-sm font-medium">
              <strong>关键洞见：</strong>
              使用 TYPE_5 比 TYPE_8 节省约 33% 内存，比 TYPE_16 节省约 45% 内存！
              对于 Redis 中数十亿个短键名，这个优化带来的内存节省是巨大的。
            </p>
          </div>
        </motion.div>
      </section>

      {/* 相关专题链接 */}
      <section className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">相关专题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/memory-strategy/pre-allocation"
            className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-colors group"
          >
            <h3 className="font-bold text-blue-800 mb-1 group-hover:text-blue-600">预分配策略</h3>
            <p className="text-blue-600 text-sm">深入了解 SDS 的空间预分配算法，小于1MB翻倍、大于1MB多分配1MB</p>
          </Link>
          <Link
            to="/memory-strategy/lazy-free"
            className="bg-white rounded-lg p-4 border border-amber-200 hover:border-amber-400 transition-colors group"
          >
            <h3 className="font-bold text-amber-800 mb-1 group-hover:text-amber-600">惰性回收</h3>
            <p className="text-amber-600 text-sm">了解 SDS 如何通过惰性空间回收减少内存分配次数</p>
          </Link>
          <Link
            to="/memory-strategy/type-switching"
            className="bg-white rounded-lg p-4 border border-purple-200 hover:border-purple-400 transition-colors group"
          >
            <h3 className="font-bold text-purple-800 mb-1 group-hover:text-purple-600">类型切换</h3>
            <p className="text-purple-600 text-sm">了解 SDS 在扩容时如何自动切换到更大的类型</p>
          </Link>
          <Link
            to="/vs-c-string"
            className="bg-white rounded-lg p-4 border border-emerald-200 hover:border-emerald-400 transition-colors group"
          >
            <h3 className="font-bold text-emerald-800 mb-1 group-hover:text-emerald-600">SDS vs C 字符串</h3>
            <p className="text-emerald-600 text-sm">回顾 SDS 相比 C 字符串的核心优势对比</p>
          </Link>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/vs-c-string"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：SDS vs C 字符串
        </Link>
        <Link
          to="/operations"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：SDS 操作总览
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
