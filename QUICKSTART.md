# 🚀 快速开始指南

## 📦 安装依赖

首先，安装项目所需的所有依赖：

```bash
npm install
```

如果安装速度较慢，可以使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

或使用 pnpm（推荐）：

```bash
pnpm install
```

## 🏃 运行项目

### 开发模式

启动开发服务器，支持热更新：

```bash
npm run dev
```

服务器启动后，浏览器会自动打开 `http://localhost:3000`

### 生产构建

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 🎯 使用指南

### 1. 创建SDS字符串

- 在右侧操作面板选择 **"创建操作"** 分类
- 点击 `sdsnew` 按钮
- 在输入框输入初始字符串，例如："Hello"
- 点击 **"执行操作"** 按钮
- 观察左侧可视化区域的SDS结构

### 2. 拼接字符串

- 确保已有SDS实例
- 选择 `sdscat` 操作
- 输入要拼接的字符串，例如：" World"
- 点击执行，观察动画展示内存分配和数据拼接过程

### 3. 截取字符串

- 选择 `sdsrange` 操作
- 设置起始索引和结束索引
- 执行操作，观察字符移动动画

### 4. 动画控制

- **播放/暂停**：控制动画播放状态
- **速度控制**：调整动画播放速度（0.5x - 3x）
- **步骤进度条**：拖动查看特定步骤
- **步骤描述**：查看当前动画步骤的详细说明

## 🎨 主要功能

### ✅ 已实现功能

1. **SDS核心操作**
   - ✅ `sdsnew` - 创建新SDS
   - ✅ `sdsempty` - 创建空SDS
   - ✅ `sdsdup` - 复制SDS
   - ✅ `sdscat` - 字符串拼接
   - ✅ `sdscpy` - 字符串复制
   - ✅ `sdsrange` - 字符串截取
   - ✅ `sdstrim` - 字符串裁剪
   - ✅ `sdsMakeRoomFor` - 预分配空间
   - ✅ `sdsRemoveFreeSpace` - 释放空闲空间

2. **可视化功能**
   - ✅ 实时SDS结构展示（头部+缓冲区）
   - ✅ 内存布局可视化
   - ✅ 颜色编码（已使用/空闲/终止符）
   - ✅ 交互式动画演示
   - ✅ 分步骤展示操作过程

3. **动画系统**
   - ✅ 流畅的过渡动画
   - ✅ 可控的播放速度
   - ✅ 步进控制
   - ✅ 实时进度显示

4. **用户体验**
   - ✅ 现代化UI设计
   - ✅ 响应式布局
   - ✅ 实时通知系统
   - ✅ 参数验证提示

### 🔮 可扩展功能（可继续开发）

- ⏳ SDS vs C字符串性能对比
- ⏳ 操作历史记录
- ⏳ 导出/导入场景
- ⏳ 更多动画效果
- ⏳ 键盘快捷键支持
- ⏳ 深色模式
- ⏳ 多语言支持

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── visualization/   # 可视化组件
│   │   └── SDSStructure.tsx  # SDS结构展示
│   └── controls/        # 控制面板组件
│       └── OperationPanel.tsx # 操作控制面板
├── types/              # TypeScript类型定义
│   ├── sds.ts         # SDS相关类型
│   ├── animation.ts   # 动画系统类型
│   ├── comparison.ts  # 对比分析类型
│   └── ui.ts          # UI状态类型
├── store/             # Zustand状态管理
│   └── useStore.ts    # 全局状态Store
├── utils/             # 工具函数
│   ├── sdsOperations.ts      # SDS操作实现
│   └── animationGenerator.ts # 动画生成器
├── hooks/             # 自定义Hooks
│   └── useAnimationPlayer.ts # 动画播放器
├── constants/         # 常量定义
│   └── index.ts       # 应用常量
├── styles/            # 样式文件
│   └── index.css      # 全局样式
├── App.tsx            # 主应用组件
└── main.tsx           # 应用入口
```

## 🔧 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **动画**: Framer Motion
- **样式**: TailwindCSS
- **图标**: Lucide React

## 💡 开发提示

### 添加新操作

1. 在 `src/utils/sdsOperations.ts` 实现操作逻辑
2. 在 `src/utils/animationGenerator.ts` 添加动画生成
3. 在 `src/types/sds.ts` 更新类型定义
4. 在 `src/components/controls/OperationPanel.tsx` 添加UI

### 自定义动画

修改 `src/utils/animationGenerator.ts` 中的动画步骤生成逻辑：

```typescript
steps.push({
  id: generateStepId(),
  type: 'highlight',  // 动画类型
  target: 'len',      // 目标元素
  duration: 500,      // 持续时间(ms)
  description: '高亮显示len字段',
  data: { color: 'highlight' },
});
```

### 样式定制

在 `tailwind.config.js` 中修改主题配置：

```javascript
theme: {
  extend: {
    colors: {
      used: '#your-color',
      // ... 其他颜色
    }
  }
}
```

## 🐛 故障排除

### 依赖安装失败

```bash
# 清除缓存后重新安装
rm -rf node_modules package-lock.json
npm install
```

### 端口被占用

修改 `vite.config.ts` 中的端口：

```typescript
server: {
  port: 3001, // 改为其他端口
}
```

### TypeScript 错误

确保安装了所有类型定义：

```bash
npm install --save-dev @types/node
```

## 📚 学习资源

- [Redis官方文档 - SDS](https://redis.io/docs/data-types/strings/)
- [Redis源码 - SDS实现](https://github.com/redis/redis/blob/unstable/src/sds.c)
- [React官方文档](https://react.dev/)
- [Framer Motion动画库](https://www.framer.com/motion/)

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
