/**
 * Animated Diagrams for SDS Concepts
 * 使用 CSS/Framer Motion 实现的动画示意图，可直接嵌入文章
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * SDS 内存布局动画示意图
 */
export function SDSMemoryDiagram() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 min-h-[450px]">
      {/* Header */}
      <div className="flex gap-4">
        {['len', 'alloc', 'flags'].map((field, i) => (
          <motion.div
            key={field}
            className="bg-emerald-100 border-2 border-emerald-400 rounded-xl px-6 py-4 text-center min-w-[80px]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="text-sm text-emerald-600 font-medium">{field}</div>
            <div className="text-2xl font-bold text-emerald-800">
              {field === 'len' ? '6' : field === 'alloc' ? '8' : '0'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Arrow */}
      <motion.div
        className="text-slate-400 text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        ↓
      </motion.div>

      {/* Buffer */}
      <div className="flex gap-2">
        {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·'].map((char, i) => (
          <motion.div
            key={i}
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-mono font-bold border-2 ${
              i < 6
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          >
            {char}
          </motion.div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex gap-12 text-base text-slate-500 mt-4">
        <span>已用: 6</span>
        <span>空闲: 2</span>
        <span>总分配: 8</span>
      </div>
    </div>
  );
}

/**
 * C String vs SDS 对比动画
 */
export function CStringVsSDSComparison() {
  return (
    <div className="flex justify-center gap-20 py-10 min-h-[450px] items-center">
      {/* C String */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-red-600 font-bold mb-6 text-2xl">C String</div>
        <div className="flex gap-2">
          {['H', 'e', 'l', 'l', 'o', '\\0'].map((char, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 bg-red-50 border-2 border-red-300 rounded-xl flex items-center justify-center text-xl text-red-800 font-mono font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {char}
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-lg text-slate-500 font-medium">O(n) 获取长度</div>
      </motion.div>

      {/* VS */}
      <motion.div
        className="flex items-center text-slate-400 text-4xl font-bold"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        VS
      </motion.div>

      {/* SDS */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-emerald-600 font-bold mb-6 text-2xl">SDS</div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3">
            {['len=6', 'alloc=8'].map((h, i) => (
              <motion.div
                key={i}
                className="px-4 py-3 bg-emerald-100 border-2 border-emerald-400 rounded-xl text-base text-emerald-800 font-mono font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {h}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·'].map((char, i) => (
              <motion.div
                key={i}
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-mono font-bold border-2 ${
                  i < 6
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-lg text-emerald-600 font-bold">O(1) 获取长度 ✓</div>
      </motion.div>
    </div>
  );
}

/**
 * 预分配策略动画
 */
export function PreAllocationDiagram() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 min-h-[450px]">
      <div className="text-base text-slate-600 mb-2 font-medium">sdscat 前 → sdscat 后</div>

      <div className="flex items-center gap-12">
        {/* Before */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-base text-slate-500 mb-4">原始字符串 "Hello"</div>
          <div className="flex gap-2">
            {['H', 'e', 'l', 'l', 'o', '\\0'].map((char, i) => (
              <motion.div
                key={`before-${i}`}
                className="w-14 h-14 bg-blue-50 border-2 border-blue-300 rounded-xl flex items-center justify-center text-base text-blue-800 font-mono font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-base text-slate-500 font-medium">len=5, alloc=5</div>
        </motion.div>

        {/* Arrow with animation */}
        <motion.div
          className="text-4xl text-emerald-500 font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          →
        </motion.div>

        {/* After */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-base text-slate-500 mb-4">追加 " World"</div>
          <div className="flex gap-1">
            {['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd', '\\0'].map((char, i) => (
              <motion.div
                key={`after-${i}`}
                className={`w-12 h-14 rounded-xl flex items-center justify-center text-sm font-mono font-bold border-2 ${
                  i < 5
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : i < 11
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-red-50 border-red-300 text-red-800'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-base text-emerald-600 font-bold">len=11, alloc=16</div>
          <div className="text-sm text-slate-400">预分配策略生效</div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 px-6 py-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-base text-emerald-700 font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        💡 扩容时预留空间，减少频繁 realloc
      </motion.div>
    </div>
  );
}

/**
 * 惰性释放动画
 */
export function LazyFreeDiagram() {
  return (
    <div className="flex flex-col items-center gap-8 py-10 min-h-[450px]">
      <div className="text-xl text-slate-600 font-medium">sdsRemoveFreeSpace 惰性释放</div>

      <div className="flex items-center gap-16">
        {/* Before */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-base text-slate-500 mb-4">释放前</div>
          <div className="flex gap-2">
            {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·', '·', '·'].map((char, i) => (
              <motion.div
                key={`before-${i}`}
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-base font-mono font-bold border-2 ${
                  i < 6
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-base text-slate-500 font-medium">alloc=10, len=5</div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="text-4xl text-emerald-500 font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          →
        </motion.div>

        {/* After */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-base text-slate-500 mb-4">释放后（惰性）</div>
          <div className="flex gap-2">
            {['H', 'e', 'l', 'l', 'o', '\\0'].map((char, i) => (
              <motion.div
                key={`after-${i}`}
                className="w-14 h-14 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-center text-base text-emerald-800 font-mono font-bold"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-base text-emerald-600 font-bold">alloc=6, len=5</div>
          <div className="text-sm text-slate-400">实际内存未释放</div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 px-6 py-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-base text-amber-700 font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        💡 保留 free 空间，下次 append 无需扩容
      </motion.div>
    </div>
  );
}

/**
 * 类型切换动画
 */
export function TypeSwitchingDiagram() {
  const types = [
    { name: 'TYPE_5', size: '32B', header: '1B', color: 'rose' },
    { name: 'TYPE_8', size: '256B', header: '3B', color: 'amber' },
    { name: 'TYPE_16', size: '64KB', header: '5B', color: 'emerald' },
    { name: 'TYPE_32', size: '4GB', header: '9B', color: 'blue' },
    { name: 'TYPE_64', size: '2^64', header: '17B', color: 'purple' },
  ];

  return (
    <div className="flex flex-col items-center gap-8 py-10 min-h-[450px]">
      <div className="text-xl text-slate-600 mb-4 font-medium">SDS 类型自适应</div>

      <div className="flex items-end gap-6">
        {types.map((type, i) => (
          <motion.div
            key={type.name}
            className={`flex flex-col items-center ${
              i === 2 ? 'ring-2 ring-emerald-400 rounded-xl p-4 -mt-4' : ''
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="text-base text-slate-500 mb-3">{type.size}</div>
            <motion.div
              className={`bg-${type.color}-100 border-2 border-${type.color}-400 rounded-xl px-5 py-4 min-w-[100px]`}
              whileHover={{ scale: 1.1 }}
            >
              <div className={`text-base font-bold text-${type.color}-800`}>{type.name}</div>
              <div className={`text-sm text-${type.color}-600 mt-2`}>header: {type.header}</div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-base text-blue-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        📊 根据字符串长度自动选择最优类型，兼顾小对象效率和大对象扩展性
      </motion.div>
    </div>
  );
}

/**
 * 缓冲区溢出对比动画
 */
export function BufferOverflowDiagram() {
  return (
    <div className="flex flex-col items-center gap-8 py-10 min-h-[450px]">
      <div className="flex items-center gap-16">
        {/* C String 溢出 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-red-600 font-bold mb-6 text-2xl">C String 溢出</div>
          <div className="relative">
            <div className="flex gap-2">
              {['b', 'u', 'f', 'f', 'e', 'r', '\\0'].map((char, i) => (
                <motion.div
                  key={`c-${i}`}
                  className="w-14 h-14 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center text-base text-red-800 font-mono font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
            {/* 溢出部分 */}
            <motion.div
              className="absolute -right-2 top-0 flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {['o', 'v', 'e', 'r', 'f', 'l', 'o', 'w'].map((char, i) => (
                <motion.div
                  key={`over-${i}`}
                  className="w-14 h-14 bg-red-500 border-2 border-red-700 rounded-xl flex items-center justify-center text-base text-white font-mono font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                >
                  {char}
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="mt-6 text-base text-red-600 font-medium">缓冲区只有 7 字节</div>
          <div className="text-base text-red-500 font-medium">写入 15 字节 → 溢出！</div>
        </motion.div>

        {/* VS */}
        <motion.div
          className="text-4xl text-slate-400 font-bold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
        >
          VS
        </motion.div>

        {/* SDS 安全 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-emerald-600 font-bold mb-4 text-2xl">SDS 安全</div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <motion.div className="px-3 py-2 bg-emerald-100 border-2 border-emerald-400 rounded-lg text-sm text-emerald-800 font-bold">
                len=7
              </motion.div>
              <motion.div className="px-3 py-2 bg-emerald-100 border-2 border-emerald-400 rounded-lg text-sm text-emerald-800 font-bold">
                alloc=15
              </motion.div>
            </div>
            <div className="flex gap-1">
              {['b', 'u', 'f', 'f', 'e', 'r', '\\0'].map((char, i) => (
                <motion.div
                  key={`sds-${i}`}
                  className="w-12 h-12 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-center text-sm text-emerald-800 font-mono font-bold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 + i * 0.05 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600 font-medium">alloc=15 ≥ len+新增</div>
          <div className="text-sm text-emerald-500 font-medium">自动扩容，安全无忧 ✓</div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * 二进制安全对比动画
 */
export function BinarySafeDiagram() {
  return (
    <div className="flex flex-col items-center gap-8 py-10 min-h-[450px]">
      <div className="flex items-center gap-16">
        {/* C String - 遇 \0 截断 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-red-600 font-bold mb-6 text-2xl">C String</div>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="flex gap-2">
              {['h', 'e', 'l', 'l', 'o', '\\0', 'w', 'o', 'r', 'l', 'd'].map((char, i) => (
                <motion.div
                  key={`c-${i}`}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-base font-mono font-bold ${
                    i === 5
                      ? 'bg-red-500 text-white'
                      : i < 5
                        ? 'bg-red-800 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {char === '\\0' ? '\\0' : char}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-base text-slate-400 text-left">遇到 \0 终止</div>
            <div className="mt-2 text-base text-red-400 text-left font-medium">strlen = 5（错误！）</div>
          </div>
          <div className="mt-4 text-base text-red-500 font-medium">二进制数据被截断</div>
        </motion.div>

        {/* VS */}
        <motion.div
          className="text-4xl text-slate-400 font-bold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          VS
        </motion.div>

        {/* SDS - 通过 len 判断 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-emerald-600 font-bold mb-6 text-2xl">SDS</div>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <motion.div
                  className="px-4 py-2 bg-emerald-500 rounded-lg text-base text-white font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  len=11
                </motion.div>
              </div>
              <div className="flex gap-2">
                {['h', 'e', 'l', 'l', 'o', '\\0', 'w', 'o', 'r', 'l', 'd'].map((char, i) => (
                  <motion.div
                    key={`sds-${i}`}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-base font-mono font-bold ${
                      i < 5
                        ? 'bg-emerald-800 text-white'
                        : i === 5
                          ? 'bg-red-500 text-white'
                          : 'bg-emerald-600 text-white'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 + i * 0.05 }}
                  >
                    {char === '\\0' ? '\\0' : char}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-base text-emerald-400 text-left">通过 len 字段判断长度</div>
            <div className="mt-2 text-base text-emerald-300 text-left font-bold">sds.len = 11 ✓</div>
          </div>
          <div className="mt-4 text-base text-emerald-500 font-medium">完整存储二进制数据</div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * 特性对比表动画
 */
export function FeatureComparisonTable() {
  const features = [
    { name: '长度获取', cString: 'O(n) 遍历', sds: 'O(1) 直接读取', winner: 'sds' },
    { name: '内存分配', cString: '精确分配', sds: '预分配策略', winner: 'sds' },
    { name: '追加操作', cString: '可能溢出', sds: '自动扩容', winner: 'sds' },
    { name: '空间回收', cString: '立即释放', sds: '惰性回收', winner: 'sds' },
    { name: '二进制安全', cString: '否（遇\\0截断）', sds: '是（len判断）', winner: 'sds' },
    { name: 'API 安全性', cString: '需手动管理', sds: '封装完善', winner: 'sds' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">特性</th>
            <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-red-600">C 字符串</th>
            <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-emerald-600">SDS</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <motion.tr
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="border border-slate-200 px-4 py-3 font-medium text-slate-800">
                {feature.name}
              </td>
              <td className="border border-slate-200 px-4 py-3 text-red-600 text-sm">
                {feature.cString}
              </td>
              <td className="border border-slate-200 px-4 py-3 text-emerald-600 text-sm font-medium">
                {feature.sds} ✓
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 修改操作动画 - 展示 sdscat, sdscpy, sdsrange, sdstrim 四个操作
 * 用于 ModifyOperationsPage 页面
 */
export function ModifyOperationsDiagram() {
  const operations = [
    {
      name: 'sdscat',
      desc: '字符串追加',
      before: ['H', 'e', 'l', 'l', 'o', '\\0'],
      after: ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd', '\\0'],
      highlight: 'after',
    },
    {
      name: 'sdscpy',
      desc: '字符串复制',
      before: ['H', 'i', '\\0', '·', '·', '·'],
      after: ['H', 'e', 'l', 'l', 'o', '\\0'],
      highlight: 'after',
    },
    {
      name: 'sdsrange',
      desc: '范围提取',
      before: ['H', 'e', 'l', 'l', 'o', '\\0'],
      after: ['e', 'l', 'l', '\\0'],
      highlight: 'after',
    },
    {
      name: 'sdstrim',
      desc: '两端裁剪',
      before: ['H', 'e', 'l', 'l', 'o', '\\0'],
      after: ['e', 'l', 'l', '\\0'],
      highlight: 'after',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // 自动循环切换操作
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % operations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeOp = operations[activeIndex];

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 操作切换标签 */}
      <div className="flex gap-2 flex-wrap justify-center">
        {operations.map((op, i) => (
          <motion.button
            key={op.name}
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeIndex === i
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {op.name}
          </motion.button>
        ))}
      </div>

      {/* 当前操作的动画 */}
      <motion.div
        key={activeIndex}
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-emerald-600 font-bold text-lg">{activeOp.name}</div>
        <div className="text-slate-500 text-sm">{activeOp.desc}</div>

        <div className="flex items-center gap-6 mt-2">
          {/* Before */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-xs text-slate-500 mb-2">操作前</div>
            <div className="flex">
              {activeOp.before.map((char, i) => (
                <motion.div
                  key={`before-${i}`}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold border ${
                    char === '\\0'
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : char === '·'
                        ? 'bg-slate-100 border-slate-300 text-slate-400'
                        : 'bg-blue-50 border-blue-300 text-blue-800'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            className="text-2xl text-emerald-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            →
          </motion.div>

          {/* After */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xs text-slate-500 mb-2">操作后</div>
            <div className="flex">
              {activeOp.after.map((char, i) => (
                <motion.div
                  key={`after-${i}`}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold border ${
                    char === '\\0'
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 操作说明 */}
      <motion.div
        className="mt-4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {activeOp.name} - {activeOp.desc} 操作示意图
      </motion.div>
    </div>
  );
}

/**
 * 内存操作动画 - 展示 sdsMakeRoomFor 和 sdsRemoveFreeSpace
 * 用于 MemoryOperationsPage 页面
 */
export function MemoryOperationsDiagram() {
  const [activeOp, setActiveOp] = useState<'expand' | 'shrink'>('expand');

  // sdsMakeRoomFor 扩容操作
  const expandDiagram = (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-8">
        {/* 扩容前 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-xs text-slate-500 mb-2">扩容前 (alloc=8)</div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <div className="px-2 py-1 bg-blue-100 border border-blue-400 rounded text-xs text-blue-800">
                len=6
              </div>
              <div className="px-2 py-1 bg-blue-100 border border-blue-400 rounded text-xs text-blue-800">
                alloc=8
              </div>
            </div>
            <div className="flex">
              {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·'].map((char, i) => (
                <motion.div
                  key={`before-${i}`}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold border-2 ${
                    i < 6
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-red-500">容量不足!</div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="text-3xl text-emerald-500"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          →
        </motion.div>

        {/* 扩容后 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-xs text-slate-500 mb-2">扩容后 (alloc=16)</div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <motion.div
                className="px-2 py-1 bg-emerald-100 border border-emerald-400 rounded text-xs text-emerald-800"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                len=6
              </motion.div>
              <motion.div
                className="px-2 py-1 bg-emerald-100 border border-emerald-400 rounded text-xs text-emerald-800"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                alloc=16
              </motion.div>
            </div>
            <div className="flex">
              {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·', '·', '·', '·', '·', '·', '·'].map((char, i) => (
                <motion.div
                  key={`after-${i}`}
                  className={`w-7 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold border-2 ${
                    i < 6
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + i * 0.03 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">预分配策略生效</div>
        </motion.div>
      </div>

      <motion.div
        className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        sdsMakeRoomFor - 扩容以容纳新数据
      </motion.div>
    </motion.div>
  );

  // sdsRemoveFreeSpace 惰性释放操作
  const shrinkDiagram = (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-8">
        {/* 释放前 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-xs text-slate-500 mb-2">释放前 (alloc=16, len=6)</div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <div className="px-2 py-1 bg-amber-100 border border-amber-400 rounded text-xs text-amber-800">
                len=6
              </div>
              <div className="px-2 py-1 bg-amber-100 border border-amber-400 rounded text-xs text-amber-800">
                alloc=16
              </div>
            </div>
            <div className="flex">
              {['H', 'e', 'l', 'l', 'o', '\\0', '·', '·', '·', '·', '·', '·', '·', '·'].map((char, i) => (
                <motion.div
                  key={`before-${i}`}
                  className={`w-7 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold border-2 ${
                    i < 6
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-500">有 10 字节空闲空间</div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="text-3xl text-amber-500"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          →
        </motion.div>

        {/* 释放后 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-xs text-slate-500 mb-2">释放后 (alloc=6, len=6)</div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <motion.div
                className="px-2 py-1 bg-emerald-100 border border-emerald-400 rounded text-xs text-emerald-800"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                len=6
              </motion.div>
              <motion.div
                className="px-2 py-1 bg-emerald-100 border border-emerald-400 rounded text-xs text-emerald-800"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
              >
                alloc=6
              </motion.div>
            </div>
            <div className="flex">
              {['H', 'e', 'l', 'l', 'o', '\\0'].map((char, i) => (
                <motion.div
                  key={`after-${i}`}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-bold border-2 bg-emerald-50 border-emerald-400 text-emerald-800"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">实际内存未释放（惰性）</div>
        </motion.div>
      </div>

      <motion.div
        className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        sdsRemoveFreeSpace - 移除空闲空间（惰性释放）
      </motion.div>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 操作切换标签 */}
      <div className="flex gap-3">
        <motion.button
          onClick={() => setActiveOp('expand')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeOp === 'expand'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          sdsMakeRoomFor
        </motion.button>
        <motion.button
          onClick={() => setActiveOp('shrink')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeOp === 'shrink'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          sdsRemoveFreeSpace
        </motion.button>
      </div>

      {/* 当前操作的动画 */}
      <div className="min-h-[450px] flex items-center justify-center">
        {activeOp === 'expand' ? expandDiagram : shrinkDiagram}
      </div>
    </div>
  );
}

/**
 * 操作流程图动画 - 展示三大类操作的关系
 * 用于 OperationsOverviewPage 页面
 */
export function OperationsFlowDiagram() {
  const categories = [
    {
      name: '创建操作',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      operations: ['sdsnew', 'sdsempty', 'sdsdup'],
    },
    {
      name: '修改操作',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-400',
      textColor: 'text-emerald-700',
      operations: ['sdscat', 'sdscpy', 'sdsrange', 'sdstrim'],
    },
    {
      name: '内存操作',
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-700',
      operations: ['sdsMakeRoomFor', 'sdsRemoveFreeSpace'],
    },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* 标题 */}
      <motion.div
        className="text-xl font-bold text-slate-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        SDS 操作分类
      </motion.div>

      {/* 三大类操作 */}
      <div className="flex items-start gap-6 flex-wrap justify-center">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.name}
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.2 }}
          >
            {/* 类别标题 */}
            <motion.div
              className={`px-4 py-2 ${category.bgColor} border-2 ${category.borderColor} rounded-xl`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + catIndex * 0.2, type: 'spring' }}
            >
              <div className={`font-bold ${category.textColor}`}>{category.name}</div>
            </motion.div>

            {/* 操作列表 */}
            <div className="flex flex-col gap-2">
              {category.operations.map((op, opIndex) => (
                <motion.div
                  key={op}
                  className={`px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-700 shadow-sm`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + catIndex * 0.2 + opIndex * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                  {op}
                </motion.div>
              ))}
            </div>

            {/* 连接箭头（除了最后一个） */}
            {catIndex < categories.length - 1 && (
              <motion.div
                className="text-2xl text-slate-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + catIndex * 0.2 }}
              >
                →
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 流程说明 */}
      <motion.div
        className="mt-4 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="font-medium">操作流程:</span>
          <span className="text-blue-600">创建</span>
          <span>→</span>
          <span className="text-emerald-600">修改</span>
          <span>→</span>
          <span className="text-amber-600">内存管理</span>
        </div>
      </motion.div>

      {/* 入场动画说明 */}
      <motion.div
        className="flex gap-4 text-xs text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>创建: sdsnew, sdsempty, sdsdup</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>修改: sdscat, sdscpy, sdsrange, sdstrim</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span>内存: sdsMakeRoomFor, sdsRemoveFreeSpace</span>
        </div>
      </motion.div>
    </div>
  );
}
