import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Zap, TrendingUp, AlertTriangle, CheckCircle, Info, Database, Clock, Layers } from 'lucide-react';
import { PreAllocationDiagram } from '@/components/video';
import { D3PreAllocationVisualizer } from '@/components/visualization/D3Components';
import { SDSType } from '@/types/sds';
import { useState, useEffect } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';

export function PreAllocationPage() {
  const [appendStep, setAppendStep] = useState(0);
  const [calcLen, setCalcLen] = useState(500);
  const [calcAppend, setCalcAppend] = useState(100);
  const [thresholdStep, setThresholdStep] = useState(0);
  const [expandAnimStep, setExpandAnimStep] = useState(-1);

  const calculateNewAlloc = (sdsLen: number, appendLen: number) => {
    const newLen = sdsLen + appendLen;
    if (newLen < 1024 * 1024) {
      return { alloc: newLen * 2, strategy: '翻倍预分配', isDouble: true };
    } else {
      return { alloc: newLen + 1024 * 1024, strategy: '固定增量 (+1MB)', isDouble: false };
    }
  };

  const calcResult = calculateNewAlloc(calcLen, calcAppend);

  // 模拟多次追加的步骤
  const appendHistory: { step: number; len: number; alloc: number; free: number; needExpand: boolean; expandRatio: string }[] = [];
  let currentLen = 0;
  let currentAlloc = 0;
  for (let i = 0; i <= 10; i++) {
    if (i === 0) {
      currentLen = 1;
      currentAlloc = 2;
    } else if (i === 1) {
      currentLen = 2;
      currentAlloc = 2;
    } else if (i === 2) {
      currentLen = 3;
      currentAlloc = 4;
    } else if (i === 3) {
      currentLen = 4;
      currentAlloc = 4;
    } else if (i === 4) {
      currentLen = 5;
      currentAlloc = 8;
    } else if (i <= 7) {
      currentLen = i + 1;
      currentAlloc = 8;
    } else {
      currentLen = i + 1;
      currentAlloc = Math.min(currentLen * 2, 1024 * 1024);
    }
    appendHistory.push({
      step: i + 1,
      len: currentLen,
      alloc: currentAlloc,
      free: currentAlloc - currentLen,
      needExpand: i === 0 || i === 2 || i === 4,
      expandRatio: ((currentAlloc - currentLen) / currentLen * 100).toFixed(0)
    });
  }

  // 1MB 阈值演示数据
  const thresholdPoints = [
    { len: 100, newLen: 500, alloc: 1000, rule: '翻倍' },
    { len: 500, newLen: 800, alloc: 1600, rule: '翻倍' },
    { len: 800, newLen: 1000, alloc: 2000, rule: '翻倍' },
    { len: 1000000 - 100, newLen: 1000000, alloc: 2000000, rule: '翻倍' },
    { len: 1000000, newLen: 1100000, alloc: 2100000, rule: '+1MB' },
    { len: 2000000, newLen: 3000000, alloc: 4000000, rule: '+1MB' },
    { len: 5000000, newLen: 6000000, alloc: 7000000, rule: '+1MB' },
  ];

  // 扩容动画数据
  const expandAnimation = [
    { phase: '原始状态', len: 5, alloc: 5, desc: '字符串 "Hello"，刚好填满空间' },
    { phase: '追加 " World"', len: 11, alloc: 11, desc: '需要扩容！因为 free=0' },
    { phase: '计算新空间', len: 11, alloc: 22, desc: 'newLen=11 < 1MB，使用翻倍策略：11×2=22' },
    { phase: '分配新内存', len: 11, alloc: 22, desc: '申请 22 字节的新内存块' },
    { phase: '复制数据', len: 11, alloc: 22, desc: '将 "Hello" 复制到新内存' },
    { phase: '追加新内容', len: 11, alloc: 22, desc: '将 " World" 写入 free 区域' },
    { phase: '完成!', len: 11, alloc: 22, desc: 'len=11, free=11，下次追加无需扩容！' },
  ];

  // 动画效果
  useEffect(() => {
    if (expandAnimStep >= 0 && expandAnimStep < expandAnimation.length) {
      const timer = setTimeout(() => {
        setExpandAnimStep(s => s + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [expandAnimStep]);

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">内存管理</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">预分配策略</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">预分配策略详解</h1>

      <p className="text-lg text-slate-600">
        预分配是 SDS 提升追加操作性能的<strong>核心武器</strong>。当你不断向一个字符串追加内容时，
        如果每次都需要重新分配内存并复制整个字符串，性能会非常糟糕。SDS 通过"预分配"策略，
        每次扩容时多分配一些空间，为后续追加预留buffer，从而大大减少内存分配次数。
      </p>

      {/* 核心概念解释 */}
      <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Info className="text-emerald-600" size={28} />
          先理解一个问题：为什么要预分配？
        </h2>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">想象一个生活场景</h3>
          <p className="text-slate-600 mb-4">
            你有一个书架，开始放书。如果每放一本新书就要换一个新书架（更大的），你得：
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-4">
            <li>把所有书从旧书架搬到地上</li>
            <li>买一个更大的新书架</li>
            <li>把书从地上搬回新书架</li>
            <li>扔掉旧书架</li>
          </ol>
          <p className="text-slate-600">
            这太麻烦了！更好的做法是：一开始就买一个<strong className="text-emerald-600">比现在需要的大得多的书架</strong>，
            这样可以放很多书才需要换。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-5 border border-red-200">
            <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              没有预分配的问题
            </h4>
            <p className="text-red-700 text-sm mb-3">
              追加 N 次 = 最多需要 N-1 次内存分配和复制！
            </p>
            <div className="bg-white rounded p-3 text-sm font-mono">
              <div>追加 1000 次 = 999 次扩容</div>
              <div>每次扩容都要：申请 → 复制 → 释放</div>
              <div className="text-red-600 mt-2 font-bold">性能极差！</div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
            <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              有预分配的优势
            </h4>
            <p className="text-emerald-700 text-sm mb-3">
              追加 N 次 ≈ log₂(N) 次内存分配
            </p>
            <div className="bg-white rounded p-3 text-sm font-mono">
              <div>追加 1000 次 ≈ 只需要 10 次扩容</div>
              <div>扩容次数从 999 降到 10</div>
              <div className="text-emerald-600 mt-2 font-bold">性能提升 100 倍！</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Layers className="text-rose-600" size={28} />
          动画演示：一次完整的扩容过程
        </h2>

        <p className="text-slate-600 mb-6">
          让我们通过动画来理解一次追加操作触发的完整扩容流程。
          注意看：当 free 空间不足时，SDS 是如何工作的。
        </p>

        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          {/* 扩容动画控制 */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-600">
              点击"下一步"观看扩容过程：
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setExpandAnimStep(0)}
                className="px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
              >
                重新播放
              </button>
              <button
                onClick={() => setExpandAnimStep(s => Math.min(expandAnimation.length - 1, s + 1))}
                className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                disabled={expandAnimStep >= expandAnimation.length - 1}
              >
                {expandAnimStep >= expandAnimation.length - 1 ? '已结束' : '下一步'}
              </button>
            </div>
          </div>

          {/* 当前阶段 */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-sm text-slate-500 mb-2">当前阶段：</div>
            <div className="text-xl font-bold text-emerald-700">
              {expandAnimStep >= 0 && expandAnimStep < expandAnimation.length
                ? expandAnimation[expandAnimStep].phase
                : '点击"下一步"开始'}
            </div>
          </div>

          {/* 内存可视化 */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-sm text-slate-600 mb-3">内存状态（点击下一步查看变化）：</div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-xs text-slate-500">Header</div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: Math.min(expandAnimStep >= 0 && expandAnimStep < expandAnimation.length ? expandAnimation[expandAnimStep].alloc : 5, 25) }).map((_, i) => {
                  const currentItem = expandAnimStep >= 0 && expandAnimStep < expandAnimation.length ? expandAnimation[expandAnimStep] : null;
                  const isUsed = currentItem && i < currentItem.len;
                  return (
                    <div
                      key={i}
                      className={`w-8 h-10 rounded flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                        isUsed
                          ? expandAnimStep >= 3 && i >= 5
                            ? 'bg-blue-500 text-white'
                            : 'bg-emerald-500 text-white'
                          : i < (expandAnimStep >= 0 && expandAnimStep < expandAnimation.length ? expandAnimation[expandAnimStep].alloc : 5)
                            ? 'bg-amber-200 text-amber-800'
                            : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isUsed ? String.fromCharCode(72 + i) : i < (expandAnimStep >= 0 && expandAnimStep < expandAnimation.length ? expandAnimation[expandAnimStep].alloc : 5) ? '·' : ''}
                    </div>
                  );
                })}
                {expandAnimStep >= 0 && expandAnimStep < expandAnimation.length && expandAnimation[expandAnimStep].alloc > 25 && (
                  <div className="text-xs text-slate-400 self-center">...共 {expandAnimation[expandAnimStep].alloc} 字节</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mt-3">
              <div className="bg-emerald-100 rounded p-2">
                <span className="text-emerald-700">len = </span>
                <span className="font-bold">
                  {expandAnimStep >= 0 && expandAnimStep < expandAnimation.length ? expandAnimation[expandAnimStep].len : 5}
                </span>
              </div>
              <div className="bg-amber-100 rounded p-2">
                <span className="text-amber-700">alloc = </span>
                <span className="font-bold">
                  {expandAnimStep >= 0 && expandAnimStep < expandAnimation.length ? expandAnimation[expandAnimStep].alloc : 5}
                </span>
              </div>
              <div className="bg-blue-100 rounded p-2">
                <span className="text-blue-700">free = </span>
                <span className="font-bold">
                  {expandAnimStep >= 0 && expandAnimStep < expandAnimation.length
                    ? expandAnimation[expandAnimStep].alloc - expandAnimation[expandAnimStep].len
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* 阶段说明 */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-2">阶段说明：</div>
            <div className="text-slate-700">
              {expandAnimStep >= 0 && expandAnimStep < expandAnimation.length
                ? expandAnimation[expandAnimStep].desc
                : '点击"下一步"开始观看扩容流程'}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <TrendingUp className="text-blue-600" size={28} />
          预分配规则：SDS 是怎么做的？
        </h2>

        <div className="mb-6">
          <CodeBlock code={`/**
 * 计算新的分配空间（SDS 预分配策略）
 * @param sdsLen 当前 SDS 的长度
 * @param appendLen 追加字符串的长度
 * @return 新的分配空间大小
 */
size_t sdsAllocSize(size_t sdsLen, size_t appendLen) {
    size_t newLen = sdsLen + appendLen;  // 追加后的总长度

    // 关键判断：1MB 阈值
    if (newLen < 1024 * 1024) {
        // 场景1：小字符串 (< 1MB) → 翻倍预分配
        // 例如：5字节 → 分配 10字节
        // 例如：500字节 → 分配 1000字节
        return newLen * 2;
    } else {
        // 场景2：大字符串 (≥ 1MB) → 增加固定 1MB
        // 例如：2MB → 分配 3MB (多出来的1MB是buffer)
        // 例如：10MB → 分配 11MB
        return newLen + 1024 * 1024;
    }
}`} language="java" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-emerald-600" size={24} />
              <h3 className="text-lg font-bold text-emerald-800">规则一：小字符串 (&lt; 1MB)</h3>
            </div>
            <p className="text-emerald-700 text-lg font-bold mb-4">✕ 2 = 预分配空间</p>
            <p className="text-emerald-700 mb-4">
              当新长度小于 1MB 时，SDS 会<strong>翻倍分配</strong>。
              这样确保有足够的 free 空间供后续追加使用。
            </p>
            <div className="bg-white rounded-lg p-4 font-mono text-sm space-y-2">
              <div className="text-slate-600">// 追加 "hello" (5字节) 到空串</div>
              <div className="text-emerald-700">newLen = 0 + 5 = 5</div>
              <div className="text-emerald-700">newAlloc = 5 × 2 = <strong>10</strong></div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="text-xs text-slate-500">结果：free = 10 - 5 = <strong>5 字节可用</strong></div>
                <div className="text-xs text-emerald-600 mt-1">下次追加 5 字节以内无需扩容！</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-blue-800">规则二：大字符串 (≥ 1MB)</h3>
            </div>
            <p className="text-blue-700 text-lg font-bold mb-4">+ 1MB = 预分配空间</p>
            <p className="text-blue-700 mb-4">
              当新长度达到或超过 1MB 时，翻倍会浪费太多内存。
              改为<strong>只增加固定的 1MB</strong>。
            </p>
            <div className="bg-white rounded-lg p-4 font-mono text-sm space-y-2">
              <div className="text-slate-600">// 追加 2MB 到已有字符串</div>
              <div className="text-blue-700">newLen = 旧长度 + 2MB</div>
              <div className="text-blue-700">newAlloc = newLen + <strong>1MB</strong></div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="text-xs text-slate-500">结果：永远有 <strong>1MB buffer</strong></div>
                <div className="text-xs text-blue-600 mt-1">大字符串开销大，减少内存浪费</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Info size={18} />
            为什么选择 1MB 作为分界线？
          </h4>
          <p className="text-amber-700 text-sm">
            1MB 是经验值。对于小于 1MB 的字符串，翻倍带来的绝对内存开销很小（几KB到几百KB），
            但能显著减少扩容次数。对于大于 1MB 的字符串，翻倍可能一下子多分配几MB甚至几GB，
            浪费严重，所以只增加固定的 1MB。
          </p>
        </div>

        {/* 1MB 阈值可视化 */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-bold text-slate-800 mb-4">1MB 阈值分界可视化</h4>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {thresholdPoints.map((point, i) => (
                <button
                  key={i}
                  onClick={() => setThresholdStep(i)}
                  className={`px-2 py-1 rounded text-xs ${
                    thresholdStep === i
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {point.len < 1024 * 1024 ? '小' : '大'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-emerald-100 rounded p-2">
                <div className="text-xs text-emerald-600">追加前长度</div>
                <div className="font-bold text-emerald-800">{thresholdPoints[thresholdStep].len.toLocaleString()} bytes</div>
              </div>
              <div className="bg-blue-100 rounded p-2">
                <div className="text-xs text-blue-600">追加后长度</div>
                <div className="font-bold text-blue-800">{thresholdPoints[thresholdStep].newLen.toLocaleString()} bytes</div>
              </div>
              <div className="bg-amber-100 rounded p-2">
                <div className="text-xs text-amber-600">新分配空间</div>
                <div className="font-bold text-amber-800">{thresholdPoints[thresholdStep].alloc.toLocaleString()} bytes</div>
              </div>
              <div className={`rounded p-2 ${thresholdPoints[thresholdStep].rule === '翻倍' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                <div className="text-xs">使用规则</div>
                <div className={`font-bold ${thresholdPoints[thresholdStep].rule === '翻倍' ? 'text-emerald-800' : 'text-blue-800'}`}>
                  {thresholdPoints[thresholdStep].rule}
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              当 newLen = {thresholdPoints[thresholdStep].newLen.toLocaleString()} 字节
              {thresholdPoints[thresholdStep].newLen < 1024 * 1024
                ? ' < 1MB，使用翻倍策略'
                : ' ≥ 1MB，使用 +1MB 策略'}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Clock className="text-purple-600" size={28} />
          动画演示：多次追加的扩容过程
        </h2>

        <p className="text-slate-600 mb-6">
          下面我们模拟每次向空串追加 1 个字符，看看预分配是如何工作的。
          注意看：<strong>当 free 空间耗尽时才会扩容</strong>，而不是每次追加都扩容！
        </p>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">点击"下一步"模拟追加操作：</span>
            <div className="flex gap-2">
              <button
                onClick={() => setAppendStep(s => Math.max(0, s - 1))}
                className="px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
                disabled={appendStep === 0}
              >
                上一步
              </button>
              <button
                onClick={() => setAppendStep(s => Math.min(10, s + 1))}
                className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
              >
                {appendStep >= 10 ? '重新开始' : '下一步'}
              </button>
            </div>
          </div>

          {/* 当前状态可视化 */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-sm text-slate-600 mb-2">当前追加次数：<strong>{appendStep}</strong> / 10</div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-sm">内存状态：</div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(appendHistory[appendStep]?.alloc || 2, 20) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-8 rounded flex items-center justify-center text-xs font-mono ${
                      i < (appendHistory[appendStep]?.len || 0)
                        ? 'bg-emerald-500 text-white'
                        : i < (appendHistory[appendStep]?.alloc || 2)
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {i < (appendHistory[appendStep]?.len || 0)
                      ? String.fromCharCode(97 + i)
                      : i < (appendHistory[appendStep]?.alloc || 2)
                        ? '·'
                        : ''}
                  </div>
                ))}
                {(appendHistory[appendStep]?.alloc || 2) > 20 && (
                  <div className="text-xs text-slate-400 self-center">...</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-emerald-100 rounded p-2">
                <span className="text-emerald-700">len = </span>
                <span className="font-bold text-emerald-800">{appendHistory[appendStep]?.len || 0}</span>
              </div>
              <div className="bg-amber-100 rounded p-2">
                <span className="text-amber-700">alloc = </span>
                <span className="font-bold text-amber-800">{appendHistory[appendStep]?.alloc || 2}</span>
              </div>
              <div className="bg-blue-100 rounded p-2">
                <span className="text-blue-700">free = </span>
                <span className="font-bold text-blue-800">{appendHistory[appendStep]?.free || 0}</span>
              </div>
            </div>
          </div>

          {/* 操作历史 */}
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-200 sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left">步骤</th>
                  <th className="px-2 py-1 text-left">len</th>
                  <th className="px-2 py-1 text-left">alloc</th>
                  <th className="px-2 py-1 text-left">free</th>
                  <th className="px-2 py-1 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {appendHistory.map((item, i) => (
                  <tr
                    key={i}
                    className={`${i === appendStep ? 'bg-emerald-100' : ''} ${item.needExpand ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-2 py-1 font-bold">{item.step}</td>
                    <td className="px-2 py-1">{item.len}</td>
                    <td className="px-2 py-1">{item.alloc}</td>
                    <td className="px-2 py-1">{item.free}</td>
                    <td className="px-2 py-1">
                      {item.needExpand ? (
                        <span className="text-red-600 font-bold">扩容!</span>
                      ) : (
                        <span className="text-emerald-600">复用</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-slate-100 rounded text-sm">
            <strong>观察结果：</strong>
            10 次追加只扩容了 <strong>3 次</strong>（第1、3、5步），其他 7 次都直接复用 free 空间！
            如果没有预分配，这 10 次追加需要 9 次扩容。
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <PreAllocationDiagram />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">预分配过程演示</h3>
          <D3PreAllocationVisualizer
            oldSds={{ type: SDSType.SDS_TYPE_8, len: 100, alloc: 200, flags: 0, buf: [], originalString: '' }}
            newSds={{ type: SDSType.SDS_TYPE_8, len: 350, alloc: 512, flags: 0, buf: [], originalString: '' }}
            reason="字符串拼接"
            playState="expanding"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Database className="text-indigo-600" size={28} />
          预分配计算器
        </h2>

        <p className="text-slate-600 mb-6">
          输入当前字符串长度和追加长度，看看 SDS 会分配多少空间！
        </p>

        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                当前字符串长度 (bytes)
              </label>
              <input
                type="number"
                value={calcLen}
                onChange={(e) => setCalcLen(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                追加字符串长度 (bytes)
              </label>
              <input
                type="number"
                value={calcAppend}
                onChange={(e) => setCalcAppend(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <div className="bg-emerald-100 rounded-lg p-4 w-full">
                <div className="text-xs text-emerald-600 mb-1">预分配结果</div>
                <div className="text-2xl font-bold text-emerald-800">{calcResult.alloc.toLocaleString()} bytes</div>
                <div className="text-xs text-emerald-600 mt-1">{calcResult.strategy}</div>
                <div className="text-xs text-emerald-600 mt-1">
                  free = {(calcResult.alloc - calcLen - calcAppend).toLocaleString()} bytes
                </div>
              </div>
            </div>
          </div>

          {/* 快捷预设 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center">快速预设：</span>
            {[
              { label: '短字符串', len: 100, append: 50 },
              { label: '中等字符串', len: 50000, append: 10000 },
              { label: '大字符串', len: 2000000, append: 500000 },
              { label: '超大字符串', len: 10000000, append: 2000000 },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => { setCalcLen(preset.len); setCalcAppend(preset.append); }}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-lg p-4">
            <h4 className="font-bold text-slate-800 mb-3">计算过程详解</h4>
            <div className="font-mono text-sm space-y-1">
              <div>
                <span className="text-slate-500">// 步骤1：计算追加后的总长度</span>
              </div>
              <div className="text-blue-700">
                newLen = sdsLen + appendLen = {calcLen.toLocaleString()} + {calcAppend.toLocaleString()} = <strong>{(calcLen + calcAppend).toLocaleString()}</strong>
              </div>
              <div className="mt-2">
                <span className="text-slate-500">// 步骤2：判断是否小于 1MB (1024 * 1024 = 1,048,576)</span>
              </div>
              <div className="text-slate-700">
                {(calcLen + calcAppend).toLocaleString()} &lt; 1,048,576 ? → <strong>{(calcLen + calcAppend) < 1048576 ? '是 (使用翻倍)' : '否 (使用 +1MB)'}</strong>
              </div>
              <div className="mt-2">
                <span className="text-slate-500">// 步骤3：应用对应规则</span>
              </div>
              {(calcLen + calcAppend) < 1048576 ? (
                <div className="text-emerald-700">
                  newAlloc = newLen × 2 = {(calcLen + calcAppend).toLocaleString()} × 2 = <strong>{calcResult.alloc.toLocaleString()}</strong>
                </div>
              ) : (
                <div className="text-blue-700">
                  newAlloc = newLen + 1,048,576 = {(calcLen + calcAppend).toLocaleString()} + 1,048,576 = <strong>{calcResult.alloc.toLocaleString()}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-lg p-4">
          <h4 className="font-bold text-slate-800 mb-3">常见场景示例</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded p-3 text-sm">
              <div className="text-slate-500 mb-1">追加短字符串</div>
              <div className="font-mono">len=100, append=50</div>
              <div className="text-emerald-600 mt-1">→ alloc = 300 (翻倍)</div>
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <div className="text-slate-500 mb-1">追加微博内容</div>
              <div className="font-mono">len=1000, append=140</div>
              <div className="text-emerald-600 mt-1">→ alloc = 2280 (翻倍)</div>
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <div className="text-slate-500 mb-1">大文本拼接</div>
              <div className="font-mono">len=2MB, append=1MB</div>
              <div className="text-blue-600 mt-1">→ alloc = 3MB (+1MB)</div>
            </div>
            <div className="bg-white rounded p-3 text-sm">
              <div className="text-slate-500 mb-1">超大文件追加</div>
              <div className="font-mono">len=10MB, append=5MB</div>
              <div className="text-blue-600 mt-1">→ alloc = 16MB (+1MB)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">实际应用场景</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3">场景1：聊天消息</h3>
            <p className="text-blue-700 text-sm mb-4">
              用户不断发送消息，消息长度不断增长。使用预分配，服务器只需在必要时扩容，
              大部分追加操作都是 O(1) 的内存写入。
            </p>
            <div className="bg-white rounded p-3 text-xs font-mono">
              <div className="text-slate-500 mb-1">模拟：1000条消息，平均每条50字节</div>
              <div className="text-emerald-600">扩容次数：约 10-15 次</div>
              <div className="text-slate-500">vs 无预分配：999 次</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-bold text-green-800 mb-3">场景2：JSON 构建</h3>
            <p className="text-green-700 text-sm mb-4">
              构建 JSON 响应时，需要不断拼接字符串。使用预分配，可以一次性分配足够空间，
              避免多次扩容和复制。
            </p>
            <div className="bg-white rounded p-3 text-xs font-mono">
              <div className="text-slate-500 mb-1">模拟：构建 5KB 的 JSON</div>
              <div className="text-emerald-600">扩容次数：约 3 次</div>
              <div className="text-slate-500">vs 无预分配：约 5000 次</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
            <h3 className="font-bold text-amber-800 mb-3">场景3：日志收集</h3>
            <p className="text-amber-700 text-sm mb-4">
              日志系统持续收集日志，时间戳 + 内容不断追加。预分配减少内存碎片，
              提升日志写入性能。
            </p>
            <div className="bg-white rounded p-3 text-xs font-mono">
              <div className="text-slate-500 mb-1">模拟：收集 1MB 日志</div>
              <div className="text-emerald-600">扩容次数：约 2 次</div>
              <div className="text-slate-500">vs 无预分配：约 100万 次</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-3">场景4：Redis 缓存</h3>
            <p className="text-purple-700 text-sm mb-4">
              Redis 的 STRING 类型底层使用 SDS。缓存 value 的追加操作受益于预分配，
              减少内存分配开销。
            </p>
            <div className="bg-white rounded p-3 text-xs font-mono">
              <div className="text-slate-500 mb-1">模拟：缓存增长到 100KB</div>
              <div className="text-emerald-600">扩容次数：约 5 次</div>
              <div className="text-slate-500">vs 无预分配：约 10万 次</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">性能对比数据</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">追加次数</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">无预分配扩容</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">有预分配扩容</th>
                <th className="border border-slate-200 px-4 py-3 text-left font-bold">节省比例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-4 py-3">100 次</td>
                <td className="border border-slate-200 px-4 py-3 text-red-600 font-bold">99 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-600 font-bold">约 7 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-700">92%</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">1,000 次</td>
                <td className="border border-slate-200 px-4 py-3 text-red-600 font-bold">999 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-600 font-bold">约 10 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-700">99%</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-3">10,000 次</td>
                <td className="border border-slate-200 px-4 py-3 text-red-600 font-bold">9,999 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-600 font-bold">约 14 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-700">99.8%</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">100,000 次</td>
                <td className="border border-slate-200 px-4 py-3 text-red-600 font-bold">99,999 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-600 font-bold">约 17 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-700">99.98%</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-3">1,000,000 次</td>
                <td className="border border-slate-200 px-4 py-3 text-red-600 font-bold">999,999 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-600 font-bold">约 20 次</td>
                <td className="border border-slate-200 px-4 py-3 text-emerald-700">99.998%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
          <h4 className="font-bold text-emerald-800 mb-2">关键洞察</h4>
          <p className="text-emerald-700 text-sm">
            可以看到，追加次数增加 100 倍（1万 → 100万），但预分配情况下的扩容次数只增加了
            <strong>一点点</strong>（14 → 17）。这是因为 log₂(100万) ≈ 20。
            这就是为什么 SDS 的追加操作如此高效！
          </p>
        </div>
      </section>

      {/* 与惰性回收配合 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Layers className="text-amber-600" size={28} />
          预分配与惰性回收：黄金搭档
        </h2>

        <p className="text-slate-600 mb-6">
          预分配策略解决了<strong>扩容时的性能问题</strong>，而<strong>惰性回收</strong>则解决了<strong>缩容时的性能问题</strong>。
          两者配合，实现了对内存分配次数的极致优化。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-5 border border-emerald-200">
            <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={20} />
              预分配：扩容优化
            </h4>
            <p className="text-emerald-700 text-sm">
              当追加操作发现 free 空间不足时，一次性分配超过需要的空间，
              避免频繁扩容。追加 N 次只需要约 log₂(N) 次扩容。
            </p>
            <div className="mt-3 text-xs text-emerald-600">
              详见：<Link to="/memory-strategy/pre-allocation" className="underline">预分配策略专题</Link>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <Clock className="text-amber-600" size={20} />
              惰性回收：缩容优化
            </h4>
            <p className="text-amber-700 text-sm">
              当字符串被缩短时，不立即释放多余空间，而是保留在 free 区域。
              后续追加可以直接复用这些空间，无需重新分配。
            </p>
            <div className="mt-3 text-xs text-amber-600">
              详见：<Link to="/memory-strategy/lazy-free" className="underline">惰性回收专题</Link>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <h4 className="font-bold text-amber-800 mb-2">两者配合的效果</h4>
          <p className="text-amber-700 text-sm">
            在<strong>增删交替</strong>的高频场景（如日志处理、消息队列）中，
            预分配确保扩容成本最低，惰性回收确保缩容不浪费已分配的空间。
            即使不断追加和截断，内存分配的次数也会保持在最低水平。
          </p>
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/operations/memory"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：内存操作
        </Link>
        <Link
          to="/memory-strategy/lazy-free"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：惰性回收
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
