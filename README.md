# Redis SDS 可视化演示网站

一个交互式的 Redis SDS (Simple Dynamic String) 数据结构可视化和动画演示工具。

## 功能特性

- 🎯 **完整的 SDS 操作可视化**：sdsnew, sdscat, sdsrange, sdstrim 等
- 🎬 **流畅的动画系统**：分步展示每个操作的内部过程
- 📊 **性能对比分析**：SDS vs C 字符串的性能差异
- 🎨 **现代化 UI**：基于 React + TypeScript + TailwindCSS
- 📱 **响应式设计**：支持桌面端和移动端
- ♿ **可访问性支持**：键盘导航和屏幕阅读器友好

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **动画库**: Framer Motion
- **样式**: TailwindCSS
- **图标**: Lucide React

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/           # React组件
│   ├── visualization/    # 可视化相关组件
│   ├── controls/         # 控制面板组件
│   ├── common/          # 通用组件
│   └── layout/          # 布局组件
├── types/               # TypeScript类型定义
├── hooks/               # 自定义React Hooks
├── utils/               # 工具函数
├── store/               # Zustand状态管理
├── constants/           # 常量定义
└── styles/              # 样式文件
```

## SDS 操作说明

### 创建操作
- `sdsnew`: 创建新的 SDS 字符串
- `sdsempty`: 创建空 SDS
- `sdsdup`: 复制现有 SDS

### 修改操作
- `sdscat`: 字符串拼接
- `sdscpy`: 字符串复制
- `sdsrange`: 字符串截取
- `sdstrim`: 字符串裁剪

### 内存管理
- `sdsMakeRoomFor`: 预分配内存空间
- `sdsRemoveFreeSpace`: 释放空闲空间

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
