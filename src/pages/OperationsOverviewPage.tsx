import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Copy, RefreshCw, ArrowLeft, GitBranch, BookOpen, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { OperationsFlowDiagram } from '@/components/video/Diagrams';

const operationCategories = [
  {
    title: '创建操作',
    icon: Plus,
    color: 'bg-emerald-500',
    items: [
      { name: 'sdsnew', desc: '根据初始字符串创建新的 SDS 实例', path: '/operations/create' },
      { name: 'sdsempty', desc: '创建空的 SDS 字符串', path: '/operations/create' },
      { name: 'sdsdup', desc: '复制现有的 SDS 字符串', path: '/operations/create' },
    ],
  },
  {
    title: '修改操作',
    icon: Copy,
    color: 'bg-blue-500',
    items: [
      { name: 'sdscat', desc: '将字符串追加到 SDS 末尾（拼接）', path: '/operations/modify' },
      { name: 'sdscpy', desc: '用新字符串覆盖 SDS 内容（复制）', path: '/operations/modify' },
      { name: 'sdsrange', desc: '保留指定范围的字符（截取）', path: '/operations/modify' },
      { name: 'sdstrim', desc: '删除字符串两端的指定字符（裁剪）', path: '/operations/modify' },
    ],
  },
  {
    title: '内存管理操作',
    icon: RefreshCw,
    color: 'bg-amber-500',
    items: [
      { name: 'sdsMakeRoomFor', desc: '预分配指定大小的额外空间', path: '/operations/memory' },
      { name: 'sdsRemoveFreeSpace', desc: '释放所有未使用的空间', path: '/operations/memory' },
    ],
  },
];

export function OperationsOverviewPage() {
  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs mb-6">
        <Link to="/" className="text-emerald-700 hover:underline">首页</Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-500">SDS 操作总览</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">SDS 操作总览</h1>

      <p className="text-lg text-slate-600">
        Redis SDS 提供了 9 种核心操作，分为三大类：<strong>创建操作</strong>、<strong>修改操作</strong>和<strong>内存管理操作</strong>。
        本页作为入口，简要介绍每类操作的特点，点到为止。
      </p>

      {/* 操作流程图 */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="text-indigo-600" />
          SDS 操作分类总览
        </h2>
        <p className="text-slate-600 mb-4">
          下面是 SDS 三大类操作的关系图，帮助你建立整体认知：
        </p>
        <OperationsFlowDiagram />
      </section>

      {/* 操作分类详解 - 简化版 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <BookOpen className="text-emerald-600" />
          操作分类简介
        </h2>

        <div className="space-y-8">
          {/* 创建操作 */}
          <motion.div
            className="border-2 border-emerald-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 to-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
              <Plus size={24} />
              第一类：创建操作 —— 从无到有
            </h3>
            <p className="text-slate-700 mb-4">
              创建操作用于生成新的 SDS 字符串实例。SDS 支持三种创建方式：
              从字符串创建（sdsnew）、创建空字符串（sdsempty）、复制已有 SDS（sdsdup）。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'sdsnew', desc: '最常用的创建方式，根据初始字符串创建', color: 'emerald' },
                { name: 'sdsempty', desc: '创建空字符串，常用于预分配场景', color: 'blue' },
                { name: 'sdsdup', desc: '深拷贝，创建一个独立的新实例', color: 'amber' },
              ].map((item) => (
                <div key={item.name} className={`bg-${item.color}-50 rounded-lg p-4 border border-${item.color}-200`}>
                  <code className={`font-mono font-bold text-${item.color}-700`}>{item.name}</code>
                  <p className={`text-${item.color}-600 text-sm mt-2`}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-emerald-100 rounded-lg p-4">
              <p className="text-emerald-800 text-sm">
                <strong>想深入了解？</strong>
                <Link to="/operations/create" className="ml-2 text-emerald-600 hover:underline inline-flex items-center gap-1">
                  进入创建操作详解 <ExternalLink size={14} />
                </Link>
              </p>
            </div>
          </motion.div>

          {/* 修改操作 */}
          <motion.div
            className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
              <Copy size={24} />
              第二类：修改操作 —— 内容变换
            </h3>
            <p className="text-slate-700 mb-4">
              修改操作用于改变 SDS 的内容。SDS 提供四种修改操作：追加（sdscat）、覆盖（sdscpy）、
              截取（sdsrange）、裁剪（sdstrim）。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'sdscat', desc: '追加拼接，在末尾添加内容', color: 'blue' },
                { name: 'sdscpy', desc: '完全覆盖，用新字符串替换', color: 'blue' },
                { name: 'sdsrange', desc: '区间截取，保留指定范围', color: 'blue' },
                { name: 'sdstrim', desc: '两端裁剪，删除首尾指定字符', color: 'blue' },
              ].map((item) => (
                <div key={item.name} className={`bg-${item.color}-50 rounded-lg p-4 border border-${item.color}-200`}>
                  <code className={`font-mono font-bold text-${item.color}-700`}>{item.name}</code>
                  <p className={`text-${item.color}-600 text-sm mt-2`}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-blue-100 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>想深入了解？</strong>
                <Link to="/operations/modify" className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1">
                  进入修改操作详解 <ExternalLink size={14} />
                </Link>
              </p>
            </div>
          </motion.div>

          {/* 内存管理操作 */}
          <motion.div
            className="border-2 border-amber-200 rounded-xl p-6 bg-gradient-to-br from-amber-50 to-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
              <RefreshCw size={24} />
              第三类：内存管理操作 —— 精打细算
            </h3>
            <p className="text-slate-700 mb-4">
              内存管理操作用于精细控制 SDS 的内存使用。预分配（sdsMakeRoomFor）避免频繁扩容，
              释放空闲（sdsRemoveFreeSpace）回收不再需要的内存。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'sdsMakeRoomFor', desc: '预分配额外空间，为后续操作做准备', color: 'amber' },
                { name: 'sdsRemoveFreeSpace', desc: '释放空闲空间，让 alloc 等于 len', color: 'amber' },
              ].map((item) => (
                <div key={item.name} className={`bg-${item.color}-50 rounded-lg p-4 border border-${item.color}-200`}>
                  <code className={`font-mono font-bold text-${item.color}-700`}>{item.name}</code>
                  <p className={`text-${item.color}-600 text-sm mt-2`}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-amber-100 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>想深入了解？</strong>
                <Link to="/operations/memory" className="ml-2 text-amber-600 hover:underline inline-flex items-center gap-1">
                  进入内存操作详解 <ExternalLink size={14} />
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 操作流程图 */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <GitBranch className="text-emerald-600" size={28} />
          SDS 操作分类流程图
        </h2>

        <motion.div
          className="bg-slate-50 rounded-xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* 中心节点 */}
            <motion.div
              className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl px-8 py-4 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-bold text-lg">SDS 操作</p>
              <p className="text-sm opacity-80">共 9 种核心操作</p>
            </motion.div>

            {/* 三个分支 */}
            <div className="flex items-start gap-8 flex-wrap justify-center">
              {/* 创建操作 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-emerald-500 text-white rounded-lg px-4 py-2 mb-3 inline-block">
                  <Plus size={16} className="inline mr-2" />
                  创建操作
                </div>
                <div className="bg-white rounded-lg border-2 border-emerald-200 p-3 shadow-sm">
                  <p className="font-mono text-sm text-emerald-700">sdsnew()</p>
                  <p className="font-mono text-sm text-emerald-700">sdsempty()</p>
                  <p className="font-mono text-sm text-emerald-700">sdsdup()</p>
                </div>
                <p className="text-xs text-emerald-600 mt-2 max-w-[120px]">从无到有创建</p>
              </motion.div>

              {/* 修改操作 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-3 inline-block">
                  <Copy size={16} className="inline mr-2" />
                  修改操作
                </div>
                <div className="bg-white rounded-lg border-2 border-blue-200 p-3 shadow-sm">
                  <p className="font-mono text-sm text-blue-700">sdscat()</p>
                  <p className="font-mono text-sm text-blue-700">sdscpy()</p>
                  <p className="font-mono text-sm text-blue-700">sdsrange()</p>
                  <p className="font-mono text-sm text-blue-700">sdstrim()</p>
                </div>
                <p className="text-xs text-blue-600 mt-2 max-w-[120px]">内容变换</p>
              </motion.div>

              {/* 内存管理 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-amber-500 text-white rounded-lg px-4 py-2 mb-3 inline-block">
                  <RefreshCw size={16} className="inline mr-2" />
                  内存管理
                </div>
                <div className="bg-white rounded-lg border-2 border-amber-200 p-3 shadow-sm">
                  <p className="font-mono text-sm text-amber-700">sdsMakeRoomFor()</p>
                  <p className="font-mono text-sm text-amber-700">sdsRemoveFreeSpace()</p>
                </div>
                <p className="text-xs text-amber-600 mt-2 max-w-[120px]">内存优化</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 操作卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {operationCategories.map((category, index) => (
          <motion.div
            key={category.title}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          >
            <div className={`${category.color} px-6 py-4`}>
              <div className="flex items-center gap-3">
                <category.icon size={24} className="text-white" />
                <h2 className="text-lg font-bold text-white">{category.title}</h2>
              </div>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {category.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + (i + 1) * 0.05 }}
                  >
                    <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
                      {item.name}
                    </code>
                    <span className="text-sm text-slate-600">{item.desc}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        <Link
          to="/structure"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          上一篇：SDS 头部结构
        </Link>
        <Link
          to="/operations/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          下一篇：创建操作详解
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
