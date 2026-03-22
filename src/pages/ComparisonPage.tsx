import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Shield, AlertTriangle, CheckCircle, Bug, Database, Clock } from 'lucide-react';
import {
  BufferOverflowDiagram,
  BinarySafeDiagram,
  CStringVsSDSComparison,
} from '@/components/video';
import { CodeBlock } from '@/components/code/CodeBlock';
import { useState } from 'react';

export function ComparisonPage() {
  const [strlenExample, setStrlenExample] = useState('');
  const [strlenResult, setStrlenResult] = useState<number | null>(null);

  const calculateStrlen = (input: string) => {
    const nullIndex = input.indexOf('\0');
    setStrlenResult(nullIndex === -1 ? input.length : nullIndex);
  };

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <Link to="/introduction" className="text-emerald-700 hover:underline">SDS 简介</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">SDS vs C 字符串</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">SDS vs C 字符串：深入对比</h1>

      <p className="text-lg text-slate-600">
        Redis 没有直接使用 C 语言的字符串（char*），而是自己实现了一套叫做 <strong>SDS（Simple Dynamic Strings）</strong> 的字符串结构。
        为什么要自己实现？让我们通过实际例子来理解。
      </p>

      {/* 真实案例：strlen 有多慢？ */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Clock className="text-red-600" size={28} />
          先看一个真实问题：strlen 有多慢？
        </h2>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">动手体验：C 字符串的 strlen</h3>
          <p className="text-slate-600 mb-4">
            输入任意字符串（可以包含 <code className="bg-slate-100 px-1 rounded">\0</code>），看看 C 语言的 strlen 是如何工作的：
          </p>
          <div className="flex gap-4 items-center mb-4">
            <input
              type="text"
              value={strlenExample}
              onChange={(e) => setStrlenExample(e.target.value)}
              placeholder="输入字符串..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => calculateStrlen(strlenExample)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              计算长度
            </button>
          </div>
          {strlenResult !== null && (
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-slate-700">
                <strong>strlen 结果：</strong> {strlenResult} 字节
              </p>
              <p className="text-sm text-slate-500 mt-2">
                C 语言的 strlen 必须从第一个字符开始，逐字节扫描直到遇到 \0 才停止。
                对于长字符串，这可能需要数百万次 CPU 操作！
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-red-600 mb-2">O(n)</div>
            <p className="text-slate-600 text-sm">时间复杂度，需要遍历每个字符</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-orange-600 mb-2">缓存不友好</div>
            <p className="text-slate-600 text-sm">每次都要重新扫描，无法利用缓存</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-amber-600 mb-2">延迟不确定</div>
            <p className="text-slate-600 text-sm">字符串越长，耗时越长，难优化</p>
          </div>
        </div>
      </section>

      {/* 内存结构对比 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Database className="text-blue-600" size={28} />
          内存结构：为什么 SDS 更聪明？
        </h2>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <CStringVsSDSComparison />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              C 字符串的内存布局
            </h3>
            <div className="mb-4">
              <CodeBlock code={`char buf[7] = "hello";`} language="java" showLineNumbers={false} />
            </div>
            {/* 内存可视化 */}
            <div className="flex gap-1 mb-4">
              {['h', 'e', 'l', 'l', 'o', '\\0', '?'].map((char, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded border-2 ${
                    char === '\\0' ? 'bg-red-200 border-red-400 text-red-800' : 'bg-red-100 border-red-300 text-red-800'
                  }`}>
                    {char === '\0' ? '\\0' : char}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{i}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <p className="text-red-700 font-medium">问题：</p>
              <ul className="text-red-600 text-xs mt-1 space-y-1">
                <li>只有 \0 结尾，没有长度信息</li>
                <li>想知道长度？必须从头数到 \0</li>
                <li>存不了二进制数据（中间可能有 \0）</li>
              </ul>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              SDS 的内存布局
            </h3>
            <div className="mb-4">
              <CodeBlock code={`SDS: { len=5, alloc=6, buf="hello" }`} language="java" showLineNumbers={false} />
            </div>
            {/* 内存可视化 */}
            <div className="flex gap-1 mb-4 flex-wrap">
              {/* Header */}
              <div className="flex gap-1">
                {[
                  { val: 'len', desc: '5' },
                  { val: 'alloc', desc: '6' },
                  { val: 'flags', desc: '0' },
                ].map((field, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-10 flex flex-col items-center justify-center bg-emerald-600 text-white rounded border-2 border-emerald-400">
                      <span className="text-[10px]">{field.val}</span>
                      <span className="text-xs font-bold">{field.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Arrow */}
              <div className="flex items-center text-slate-400 px-2">→</div>
              {/* Buffer */}
              <div className="flex gap-1">
                {['h', 'e', 'l', 'l', 'o', '\\0'].map((char, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-8 h-10 flex items-center justify-center rounded border-2 ${
                      char === '\0' ? 'bg-slate-300 border-slate-400 text-slate-600' : 'bg-emerald-200 border-emerald-400 text-emerald-800'
                    }`}>
                      {char === '\0' ? '\\0' : char}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{5 + i}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <p className="text-emerald-700 font-medium">优势：</p>
              <ul className="text-emerald-600 text-xs mt-1 space-y-1">
                <li>Header 直接存储 len，O(1) 获取长度</li>
                <li>alloc 知道总空间，避免溢出</li>
                <li>二进制安全（用 len 判断，不是 \0）</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800 text-sm">
            <strong>结构细节：</strong>SDS 的 Header 包含 len（已用长度）、alloc（总分配）和 flags（类型标志）三个字段。
            想深入了解这五个字段和五种 Header 类型的详细设计？
            <Link to="/structure" className="underline font-medium hover:text-blue-600 ml-1">
              点击查看【SDS 头部结构】专题
            </Link>
          </p>
        </div>
      </section>

      {/* 缓冲区溢出 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Bug className="text-red-600" size={28} />
          安全性对比：缓冲区溢出 — 一个价值 10 亿美元的 bug
        </h2>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <BufferOverflowDiagram />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <Shield size={20} />
              C 字符串的危险游戏
            </h3>
            <p className="text-red-700 text-sm mb-4">
              缓冲区溢出是软件史上最常见的安全漏洞之一。据统计，CVE 漏洞中约 70% 与缓冲区溢出有关。
            </p>
            <div className="mb-4">
              <CodeBlock code={`// 经典危险代码
char buf[8];
strcpy(buf, "123456789");  // 10个字符+1个\\0 = 11字节
                                // 但buf只有8字节！

// 内存布局（假设buf在栈上）:
[返回地址] [旧EBP] [buf[0-7]] [其他变量]
              ^^^^^^^^^^^^^^^^
              被溢出覆写！攻击者可利用此劫持程序`} language="java" />
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <p className="text-red-700 font-medium mb-2">真实事故：</p>
              <ul className="text-red-600 text-xs space-y-1">
                <li>• 1988 Morris Worm 通过缓冲区溢出攻击扩散</li>
                <li>• 2008 Conficker 蠕虫利用 Windows 缓冲区溢出</li>
                <li>• 2014 Heartbleed 源于内存缓冲区读取越界</li>
              </ul>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              SDS 的安全护盾
            </h3>
            <p className="text-emerald-700 text-sm mb-4">
              SDS 的自动扩容机制从根本上杜绝了缓冲区溢出：
            </p>
            <div className="mb-4">
              <CodeBlock code={`// SDS 的安全复制
SDS sds = sdsnew("hello");  // alloc = 6

// 即使复制更长的字符串，也安全
sdscpy(sds, "hello world!");
// SDS 内部检查：
// if (newLen > alloc) {
//     alloc = newLen * 2;  // 自动扩容
// }
// 然后安全复制，永远不会溢出

// 用户感受：就像操作 Python/Go 字符串一样安全`} language="java" />
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <p className="text-emerald-700 font-medium mb-2">安全效果：</p>
              <ul className="text-emerald-600 text-xs space-y-1">
                <li>✓ 永远不会缓冲区溢出</li>
                <li>✓ 不需要手动边界检查</li>
                <li>✓ 让 Redis C 代码更安全</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 二进制安全 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Database className="text-purple-600" size={28} />
          二进制安全：\0 不是结束符
        </h2>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <BinarySafeDiagram />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            C 字符串的致命缺陷：\0 困境
          </h3>
          <p className="text-amber-700 mb-4">
            C 字符串用 <code className="bg-white px-1 rounded">\0</code> 作为结束标志，这导致一个致命问题：
            <strong>中间包含 \0 的数据无法正确存储！</strong>
          </p>
          <div className="mb-4">
            <CodeBlock code={`// 假设我们要存储一个 PNG 图片的前几个字节
// PNG 文件头：89 50 4E 47 0D 0A 1A 0A ...（包含 \\0）

char cstr[] = "\\x89PNG\\0more data";
printf("%s", cstr);  // 只输出 "PNG"，遇到 \\0 就截断了！
strlen(cstr);        // 返回 3，不是完整的 14！

// 如果用 cstr 保存到文件，会丢失 \\0 后面的数据`} language="java" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded p-3">
              <p className="text-amber-700 font-medium mb-2">无法正确存储：</p>
              <ul className="text-amber-600 text-xs space-y-1">
                <li>• PNG、JPEG 等图片文件</li>
                <li>• MP3、MP4 等音视频文件</li>
                <li>• Protocol Buffers 序列化数据</li>
                <li>• 任何包含 \0 的二进制协议</li>
              </ul>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-amber-700 font-medium mb-2">常见错误：</p>
              <ul className="text-amber-600 text-xs space-y-1">
                <li>• strcpy() 遇到 \0 就停止</li>
                <li>• strlen() 只计算到第一个 \0</li>
                <li>• memcpy() 需要额外长度参数</li>
                <li>• 文件读取可能截断数据</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <CheckCircle size={20} />
            SDS 的解决方案：用长度代替 \0
          </h3>
          <p className="text-emerald-700 mb-4">
            SDS 通过 header 中的 <code className="bg-white px-1 rounded">len</code> 字段判断字符串长度，
            完全不依赖 <code className="bg-white px-1 rounded">\0</code>。
          </p>
          <div className="mb-4">
            <CodeBlock code={`// SDS 可以安全存储任意二进制数据
SDS sds = sdsnew();
sdscpy(sds, "\\x89PNG\\xD\\xA\\x1A\\x0A");  // PNG 文件头

// SDS 内部：
// sds->len = 8（正确的字节数）
// sds->alloc = 8
// buf 中完整存储了所有 8 个字节，包括中间的 \\0

// 读取时：
sdslen(sds);  // 返回 8，不是遇到 \\0 后的 3！`} language="java" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded p-3">
              <p className="text-emerald-700 font-medium mb-2">Redis 的实际应用：</p>
              <ul className="text-emerald-600 text-xs space-y-1">
                <li>✓ 存储完整的图片数据</li>
                <li>✓ 存储序列化对象</li>
                <li>✓ 存储网络协议包</li>
              </ul>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-emerald-700 font-medium mb-2">性能优势：</p>
              <ul className="text-emerald-600 text-xs space-y-1">
                <li>✓ O(1) 获取任意数据长度</li>
                <li>✓ 无需扫描找 \0</li>
                <li>✓ 支持随机访问</li>
              </ul>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-emerald-700 font-medium mb-2">一致性保证：</p>
              <ul className="text-emerald-600 text-xs space-y-1">
                <li>✓ 存入什么，取出就是什么</li>
                <li>✓ 不会静默丢失数据</li>
                <li>✓ 字节级精确</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 总结 */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6">SDS vs C 字符串：核心差异总结</h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">对比维度</th>
                <th className="border border-slate-200 px-4 py-3 text-center font-bold bg-red-50">C 字符串</th>
                <th className="border border-slate-200 px-4 py-3 text-center font-bold bg-emerald-50">SDS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-4 py-3 font-medium">获取长度</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-red-50 text-red-600">O(n) 遍历</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-emerald-50 text-emerald-600">O(1) 直接读</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-4 py-3 font-medium">缓冲区安全</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-red-50 text-red-600">有溢出风险</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-emerald-50 text-emerald-600">自动扩容</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-3 font-medium">二进制安全</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-red-50 text-red-600">\0 截断</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-emerald-50 text-emerald-600">完整存储</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-4 py-3 font-medium">内存布局</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-red-50 text-red-600">仅数据+\0</td>
                <td className="border border-slate-200 px-4 py-3 text-center bg-emerald-50 text-emerald-600">Header+数据</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg p-4 border border-emerald-200">
          <h3 className="font-bold text-emerald-800 mb-2">核心洞见</h3>
          <p className="text-slate-700 text-sm">
            SDS 的设计完美诠释了"<strong>程序是为数据服务，而非数据为程序服务</strong>"的理念。
            不是让数据去迁就 C 字符串的缺陷，而是改进数据结构来适应真实需求。
            这也是 Redis 能够在性能和安全性上都表现出色的关键原因之一。
          </p>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/introduction"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：SDS 简介
        </Link>
        <Link
          to="/structure"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：SDS 头部结构
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
