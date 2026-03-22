import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, ChevronDown, Menu, X } from 'lucide-react';
import { GITHUB_URL } from '../../constants';
import { useGithubRepoStats } from '../../hooks/useGithubRepoStats';

interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: '基础概念',
    children: [
      { label: 'SDS 简介', path: '/introduction' },
      { label: 'SDS vs C 字符串', path: '/vs-c-string' },
      { label: '头部结构', path: '/structure' },
    ],
  },
  {
    label: 'SDS 操作',
    children: [
      { label: '操作总览', path: '/operations' },
      { label: '创建操作', path: '/operations/create' },
      { label: '修改操作', path: '/operations/modify' },
      { label: '内存操作', path: '/operations/memory' },
    ],
  },
  {
    label: '内存管理',
    children: [
      { label: '预分配策略', path: '/memory-strategy/pre-allocation' },
      { label: '惰性回收', path: '/memory-strategy/lazy-free' },
      { label: '类型切换', path: '/memory-strategy/type-switching' },
    ],
  },
  {
    label: '可视化演示',
    path: '/demo',
  },
];

function NavDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 150);
    setTimeoutId(id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 使用 div 代替 button 以避免事件问题 */}
      <div
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
      >
        {item.label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      <div
        className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-[9999]"
        style={{ display: isOpen && item.children ? 'block' : 'none' }}
      >
        {item.children?.map((child) => (
          <Link
            key={child.path}
            to={child.path!}
            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const { stars } = useGithubRepoStats(GITHUB_URL);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:inline">Redis SDS 教学</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              首页
            </Link>

            {navItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <Link
                  key={item.path}
                  to={item.path!}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* GitHub Link */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm"
          >
            <Github size={16} />
            <span className="hidden sm:inline">Star {stars}</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                首页
              </Link>

              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <div className="px-3 py-2 text-sm font-semibold text-slate-900">{item.label}</div>
                    <div className="pl-4 flex flex-col space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path!}
                          className="px-3 py-2 text-sm text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path!}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
