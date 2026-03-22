import { Link } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, Cpu, MemoryStick, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  {
    title: '基础概念',
    icon: BookOpen,
    color: 'bg-emerald-500',
    items: [
      { label: 'SDS 简介', path: '/introduction', desc: '了解 SDS 的定义与核心优势' },
      { label: 'SDS vs C 字符串', path: '/vs-c-string', desc: '对比两种字符串的优劣' },
      { label: '头部结构', path: '/structure', desc: '深入理解 SDS 的内存布局' },
    ],
  },
  {
    title: 'SDS 操作',
    icon: Cpu,
    color: 'bg-blue-500',
    items: [
      { label: '操作总览', path: '/operations', desc: '查看所有操作分类' },
      { label: '创建操作', path: '/operations/create', desc: 'sdsnew, sdsempty, sdsdup' },
      { label: '修改操作', path: '/operations/modify', desc: 'sdscat, sdscpy, sdsrange, sdstrim' },
      { label: '内存操作', path: '/operations/memory', desc: 'sdsMakeRoomFor, sdsRemoveFreeSpace' },
    ],
  },
  {
    title: '内存管理策略',
    icon: MemoryStick,
    color: 'bg-amber-500',
    items: [
      { label: '预分配策略', path: '/memory-strategy/pre-allocation', desc: '空间预分配减少扩容次数' },
      { label: '惰性回收', path: '/memory-strategy/lazy-free', desc: '延迟释放空间提升性能' },
      { label: '类型切换', path: '/memory-strategy/type-switching', desc: '根据长度自动选择类型' },
    ],
  },
  {
    title: '动手实践',
    icon: Rocket,
    color: 'bg-red-500',
    items: [
      { label: '在线调试', path: '/demo', desc: '亲身操作 SDS 各接口' },
    ],
  },
];

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          深入理解 Redis SDS 字符串
        </motion.h1>
        <motion.p
          className="text-lg text-slate-600 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Redis Simple Dynamic String (简单动态字符串) 是 Redis 字符串的底层实现。
          通过实际案例和详细图解，掌握 SDS 的内存管理精髓。
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Play size={20} />
            开始动手实践
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Learning Modules */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">学习路径</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, moduleIndex) => (
            <motion.div
              key={module.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + moduleIndex * 0.15 }}
              whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            >
              <div className={`${module.color} px-6 py-4`}>
                <div className="flex items-center gap-3">
                  <module.icon size={24} className="text-white" />
                  <h3 className="text-lg font-bold text-white">{module.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {module.items.map((item, itemIndex) => (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + moduleIndex * 0.15 + itemIndex * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div>
                          <div className="font-medium text-slate-900 group-hover:text-emerald-700">
                            {item.label}
                          </div>
                          <div className="text-sm text-slate-500">{item.desc}</div>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-slate-400 group-hover:text-emerald-600"
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
