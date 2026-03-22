import { Link } from 'react-router-dom';
import { ArrowRight, Database, BookOpen, Key, FileText, Layers } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';

export function IntroductionPage() {
  const [strlenInput, setStrlenInput] = useState('hello world');
  const [strlenResult, setStrlenResult] = useState(11);

  const simulateStrlen = (input: string) => {
    setStrlenInput(input);
    const nullIndex = input.indexOf('\0');
    setStrlenResult(nullIndex === -1 ? input.length : nullIndex);
  };

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">SDS 简介</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">SDS 简介：从根子上理解 Redis 字符串</h1>

      <p className="text-lg text-slate-600">
        当你执行 <code className="bg-slate-100 px-2 py-1 rounded">SET name "redis"</code> 时，
        Redis 并不是直接用 C 字符串存储 "redis"，而是用一套更聪明的数据结构叫 <strong>SDS（Simple Dynamic String）</strong>。
        让我们看看为什么。
      </p>

      {/* 什么是 SDS */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <BookOpen className="text-emerald-600" size={28} />
          先问一个问题：C 字符串有什么问题？
        </h2>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">动手体验：strlen 有多慢？</h3>
          <p className="text-slate-600 mb-4">
            输入任意字符串，观察 C 语言的 strlen 需要"遍历"多少步才能知道长度：
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['hello', 'redis', 'hello world', 'a very long string here'].map(str => (
              <button
                key={str}
                onClick={() => simulateStrlen(str)}
                className={`px-3 py-1 rounded text-sm ${
                  strlenInput === str ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                "{str}"
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-lg">
            <div className="text-slate-600">输入：</div>
            <div className="font-mono text-lg">{strlenInput}</div>
            <div className="text-slate-400">→</div>
            <div className="text-emerald-600 font-bold">strlen = {strlenResult}</div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>观察：</strong>strlen 必须从第一个字符开始，逐字节扫描到 \0 才停止。
              对于 1000 字节的字符串，需要 1000 次操作。SDS 只需要直接读取 len 字段，<strong>O(1)</strong>！
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-red-600 font-bold">1</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">长度获取 O(n)</h4>
            <p className="text-slate-600 text-sm">每次 strlen 都要遍历，重复计算</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-red-600 font-bold">2</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">缓冲区溢出风险</h4>
            <p className="text-slate-600 text-sm">strcpy/strcat 不检查边界</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-red-600 font-bold">3</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">二进制不安全</h4>
            <p className="text-slate-600 text-sm">\0 截断数据，无法存储图片等二进制</p>
          </div>
        </div>
      </section>

      {/* SDS 应用场景 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Database className="text-blue-600" size={28} />
          SDS 在 Redis 中的应用场景
        </h2>

        <p className="text-slate-600 mb-6">
          Redis 几乎所有需要字符串的地方都使用了 SDS，而不仅仅是存储 value。让我展示几个关键场景：
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-5 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <Key className="text-red-600" size={24} />
              <h3 className="font-bold text-red-800">键名存储</h3>
            </div>
            <p className="text-red-700 text-sm mb-3">
              Redis 的 key 名称使用 SDS 存储。例如 "user:1000:profile" 这样的键名。
            </p>
            <div className="bg-white rounded p-2 text-xs font-mono">
              <div className="text-slate-500">SDS {`{ len=18, alloc=20 }`}</div>
              <div className="text-red-700">"user:1000:profile"</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-5 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-emerald-600" size={24} />
              <h3 className="font-bold text-emerald-800">字符串值</h3>
            </div>
            <p className="text-emerald-700 text-sm mb-3">
              STRING 类型 的 value 使用 SDS。SET name "redis" 存储的就是 SDS。
            </p>
            <div className="bg-white rounded p-2 text-xs font-mono">
              <div className="text-slate-500">SDS {`{ len=5, alloc=8 }`}</div>
              <div className="text-emerald-700">"redis"</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="text-blue-600" size={24} />
              <h3 className="font-bold text-blue-800">协议传输</h3>
            </div>
            <p className="text-blue-700 text-sm mb-3">
              Redis Protocol 中的 bulk string 也用 SDS。客户端与服务端通信都是这种格式。
            </p>
            <div className="bg-white rounded p-2 text-xs font-mono">
              <div className="text-slate-500">$5\r\nredis\r\n</div>
              <div className="text-blue-700">bulk string 格式</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2">一个具体例子</h4>
          <CodeBlock code={`SET product:100 "Redis Performance Book"
OK

Redis 内部存储 product:100 键名：
  SDS { len=14, alloc=16 }
  buf: "product:100\\0"

Redis 内部存储值：
  SDS { len=22, alloc=32 }
  buf: "Redis Performance Book\\0"`} language="java" />
        </div>
      </section>

      {/* 四大核心优势 - 简要版 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">SDS 的四大核心优势</h2>

        <div className="space-y-6">
          {/* 优势1: 长度 O(1) */}
          <div className="border-2 border-emerald-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">长度 O(1) 获取</h3>
                <p className="text-emerald-700">
                  SDS header 中的 <code className="bg-white px-1 rounded">len</code> 字段直接记录长度，
                  获取长度只需一次内存读取，不需遍历！
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-slate-800 mb-3">实际影响：Redis 命令性能</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="font-bold text-red-800 mb-2">STRLEN key</p>
                  <p className="text-red-600 text-sm">如果用 C 字符串：需要 strlen() 遍历整个字符串</p>
                  <p className="text-red-700 text-xs mt-1">对于 1MB 的 value，需要 1M 次操作！</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="font-bold text-emerald-800 mb-2">SDS 实现</p>
                  <p className="text-emerald-600 text-sm">直接读 sds{'>'}len 字段</p>
                  <p className="text-emerald-700 text-xs mt-1">无论字符串多长，永远 O(1)！</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-100 rounded-lg p-3 text-sm text-emerald-800">
              <Link to="/vs-c-string" className="underline font-medium hover:text-emerald-600">
                详见【SDS vs C 字符串】性能对比专题
              </Link>
            </div>
          </div>

          {/* 优势2: 预分配 - 简要版 */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-800 mb-2">空间预分配</h3>
                <p className="text-blue-700">
                  扩容时<strong>多分配一些空间</strong>，减少后续追加时的内存分配次数。
                  典型的"以空间换时间"策略。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-slate-800 mb-3">预分配策略</h4>
              <ul className="text-slate-600 text-sm space-y-2">
                <li>小于 1MB：扩容时容量翻倍</li>
                <li>大于等于 1MB：多分配 1MB</li>
              </ul>
              <p className="text-blue-600 text-xs mt-2">
                1000 次追加操作，原本需要 999 次扩容，预分配后只需约 10 次！
              </p>
            </div>

            <div className="bg-blue-100 rounded-lg p-3 text-sm text-blue-800">
              <Link to="/memory-strategy/pre-allocation" className="underline font-medium hover:text-blue-600">
                详见【预分配策略】专题深入讲解
              </Link>
            </div>
          </div>

          {/* 优势3: 惰性回收 - 简要版 */}
          <div className="border-2 border-amber-200 rounded-xl p-6 bg-gradient-to-br from-amber-50 to-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-800 mb-2">惰性空间回收</h3>
                <p className="text-amber-700">
                  字符串缩短时，不立即释放多余空间，而是保留在 <code className="bg-white px-1 rounded">free</code> 区域。
                  后续追加可以<strong>直接复用</strong>这些空间！
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-slate-800 mb-3">惰性回收原理</h4>
              <p className="text-slate-600 text-sm">
                宁可多占空间，也不频繁申请/释放。预分配 + 惰性回收 = 黄金搭档，
                两者配合实现内存分配次数的<strong>最小化</strong>。
              </p>
            </div>

            <div className="bg-amber-100 rounded-lg p-3 text-sm text-amber-800">
              <Link to="/memory-strategy/lazy-free" className="underline font-medium hover:text-amber-600">
                详见【惰性回收】专题深入讲解
              </Link>
            </div>
          </div>

          {/* 优势4: 类型自适应 - 简要版 */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">类型自适应</h3>
                <p className="text-purple-700">
                  SDS 根据字符串长度自动选择<strong>最紧凑的 header 类型</strong>。
                  5 字节的字符串不需要 17 字节的 header！
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-slate-800 mb-3">5 种 Header 类型</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="bg-red-50 p-2 rounded border border-red-200">
                  <p className="font-bold text-red-700">TYPE_5</p>
                  <p className="text-red-600">0~31B / 1B header</p>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <p className="font-bold text-emerald-700">TYPE_8</p>
                  <p className="text-emerald-600">32~255B / 3B header</p>
                </div>
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <p className="font-bold text-blue-700">TYPE_16</p>
                  <p className="text-blue-600">256B~64KB / 5B</p>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                  <p className="font-bold text-amber-700">TYPE_32</p>
                  <p className="text-amber-600">64KB~4GB / 9B</p>
                </div>
                <div className="bg-purple-50 p-2 rounded border border-purple-200">
                  <p className="font-bold text-purple-700">TYPE_64</p>
                  <p className="text-purple-600">&gt;4GB / 17B</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 rounded-lg p-3 text-sm text-purple-800">
              <Link to="/structure" className="underline font-medium hover:text-purple-600">
                详见【SDS 头部结构】专题深入讲解五种类型
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 总结 */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-sm p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">SDS 设计哲学</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold text-emerald-400 mb-2">核心思想</h3>
            <p className="text-slate-300 text-sm">
              SDS 的设计完美体现了 Redis 的理念：<strong>不牺牲性能换安全，也不牺牲安全换性能</strong>。
              通过在 header 中维护元数据，实现了 O(1) 长度获取、自动扩容、二进制安全等多个目标。
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold text-emerald-400 mb-2">空间换时间</h3>
            <p className="text-slate-300 text-sm">
              多占用 3-17 字节的 header，换取：
            </p>
            <ul className="text-slate-300 text-sm mt-2 space-y-1">
              <li>- O(1) 长度获取</li>
              <li>- O(1) 追加（大多数情况）</li>
              <li>- 永不缓冲区溢出</li>
              <li>- 二进制安全存储</li>
            </ul>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/20">
          <p className="text-lg text-center">
            <strong className="text-emerald-400">Redis 的 SDS 简单而强大，</strong>
            <span className="text-slate-300">每一个设计决策都经过了深思熟虑。</span>
            <br />
            <span className="text-slate-400 text-sm">这就是为什么 Redis 能在性能和安全性上都表现出色的原因之一。</span>
          </p>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <div />
        <Link
          to="/vs-c-string"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：SDS vs C 字符串
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
