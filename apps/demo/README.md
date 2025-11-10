# MCA System - Interactive Demo

交互式功能演示原型 - 完整展示元认知协作智能体系统的所有核心功能

## 🎯 概述

这是一个**纯前端**的交互式演示应用，无需数据库或后端服务器，所有数据通过模拟生成。用于展示MCA系统的完整功能集。

## ✨ 功能特色

### 1. 对话演示 (`/chat`)
- 6种用户模式的真实对话场景
- 实时置信度评分显示
- 交互式消息展开/折叠
- 详细的因素分解

### 2. 模式识别 (`/patterns`)
- 6种用户行为模式 (A-F)
- 详细特征分析
- 动态评分系统
- 风险等级评估
- 干预建议

### 3. 置信度评分 (`/confidence`)
- 5因素多维度评估
- 交互式可视化图表
- 快速预设场景
- 详细计算方法说明

### 4. 技能监控 (`/skills`)
- 独立性趋势分析
- 技能分解图表
- 预警系统
- 改进建议

### 5. 置信度校准 (`/calibration`)
- ECE (Expected Calibration Error) 计算
- 校准曲线可视化
- 差距分析
- 详细分布统计

### 6. 隐私保护 (`/privacy`)
- 3层隐私架构
- 交互式层级切换
- 数据示例对比
- 适用场景说明

### 7. 测试场景 (`/scenarios`)
- 6+ 预设测试场景
- 一键运行演示
- 详细结果展示
- 快速导航

## 🚀 快速开始

### 安装依赖

```bash
cd apps/demo
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3001`

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 📁 项目结构

```
apps/demo/
├── src/
│   ├── components/
│   │   ├── ui/              # UI组件库
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Progress.tsx
│   │   └── Layout.tsx       # 主布局
│   ├── pages/               # 页面组件
│   │   ├── DashboardPage.tsx
│   │   ├── ChatDemoPage.tsx
│   │   ├── PatternDemoPage.tsx
│   │   ├── ConfidenceDemoPage.tsx
│   │   ├── SkillMonitoringPage.tsx
│   │   ├── CalibrationPage.tsx
│   │   ├── PrivacyDemoPage.tsx
│   │   └── TestScenariosPage.tsx
│   ├── data/
│   │   └── mockData.ts      # 模拟数据生成器
│   ├── lib/
│   │   └── utils.ts         # 工具函数
│   ├── App.tsx              # 主应用
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── index.html               # HTML模板
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
└── package.json             # 依赖配置
```

## 🎨 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **图表**: Recharts
- **动画**: Framer Motion
- **图标**: Lucide React

## 🔧 核心特性

### 无数据库依赖
所有数据通过 `mockData.ts` 动态生成：
- 用户对话记录
- 置信度评分
- 用户模式分类
- 技能指标
- 校准数据

### 响应式设计
- 桌面端完整体验
- 移动端优化布局
- 自适应导航

### 交互式组件
- 可点击切换的模式选择器
- 展开/折叠的详细信息
- 实时更新的图表
- 动画过渡效果

### 丰富的可视化
- Line Chart: 趋势分析
- Bar Chart: 对比展示
- Progress Bar: 进度指标
- Custom Components: 定制显示

## 📖 使用指南

### 1. 从主页开始
访问 `/` 查看功能总览和快速开始指南

### 2. 选择测试场景
前往 `/scenarios` 选择一个预设场景运行

### 3. 探索各个功能
通过左侧导航栏访问各个功能模块：
- 对话演示
- 模式识别
- 置信度评分
- 技能监控
- 置信度校准
- 隐私保护

### 4. 交互式体验
- 切换不同的用户模式
- 查看置信度详细分解
- 分析技能趋势变化
- 对比隐私层级差异

## 🎯 演示场景

### 场景 1: 战略思考者
展示高元认知能力用户的交互方式

### 场景 2: 快速学习者
展示平衡学习与AI辅助

### 场景 3: 过度依赖警示
演示技能退化风险检测

### 场景 4: 困境挣扎者救援
展示对困难用户的支持

### 场景 5: 置信度校准
展示ECE计算和校准机制

### 场景 6: 隐私保护
演示三层架构差异

## 🔥 性能优化

- Code Splitting: 路由级别代码分割
- Lazy Loading: 图表按需加载
- Memoization: React.memo优化渲染
- 虚拟滚动: 长列表优化

## 🎨 自定义

### 修改主题颜色
编辑 `src/index.css` 中的 CSS 变量

### 添加新模拟数据
编辑 `src/data/mockData.ts` 添加生成器函数

### 创建新页面
1. 在 `src/pages/` 创建新组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/Layout.tsx` 添加导航

## 📝 注意事项

### 仅用于演示
- 所有数据均为模拟
- 不连接真实数据库
- 不发送网络请求
- 适合功能展示和原型验证

### 浏览器支持
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 部署

### Vercel (推荐)

```bash
pnpm build
vercel --prod
```

### Netlify

```bash
pnpm build
# 将 dist 目录部署到 Netlify
```

### 静态服务器

```bash
pnpm build
npx serve dist
```

## 📄 许可证

MIT License - 查看主项目的 LICENSE 文件

## 🤝 贡献

欢迎贡献！请查看主项目的贡献指南。

## 📮 联系

如有问题或建议，请在主项目创建 Issue。

---

**MCA System Demo** - 元认知协作智能体系统交互式原型
