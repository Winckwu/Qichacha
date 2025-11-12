# MCA System - Mac 运行指南

## 系统概览

这是一个完整的全栈 AI 教育系统，包含：
- **前端应用** (`apps/web`): React + TypeScript + Tailwind CSS
- **Demo 应用** (`apps/demo`): React 演示应用，展示各种功能
- **后端 API** (`apps/api`): Node.js + Express + Prisma
- **数据库**: PostgreSQL
- **AI 集成**: OpenAI GPT-4, Anthropic Claude, Google Gemini

---

## 第一步：安装前置依赖

### 1.1 安装 Homebrew（如果还没有）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 1.2 安装 Node.js 18+

```bash
# 使用 Homebrew 安装 Node.js
brew install node@18

# 或者使用 nvm（推荐，方便版本管理）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 1.3 安装 pnpm

```bash
npm install -g pnpm
```

### 1.4 安装 PostgreSQL

```bash
# 使用 Homebrew 安装 PostgreSQL
brew install postgresql@14

# 启动 PostgreSQL 服务
brew services start postgresql@14

# 验证安装
psql --version
```

---

## 第二步：克隆并配置项目

### 2.1 进入项目目录

```bash
cd /path/to/Qichacha
```

### 2.2 安装项目依赖

```bash
# 在项目根目录运行
pnpm install
```

这会安装所有子项目（web, demo, api）的依赖。

---

## 第三步：配置数据库

### 3.1 创建数据库

```bash
# 创建数据库
createdb mca_system

# 或者使用 psql
psql postgres
CREATE DATABASE mca_system;
\q
```

### 3.2 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 使用你喜欢的编辑器编辑 .env
nano .env
# 或
code .env
```

### 3.3 编辑 `.env` 文件

```env
# 数据库连接（根据你的 PostgreSQL 配置修改）
DATABASE_URL="postgresql://你的用户名:你的密码@localhost:5432/mca_system?schema=public"

# 如果是本地默认安装，通常是：
DATABASE_URL="postgresql://postgres@localhost:5432/mca_system?schema=public"

# OpenAI API Key（必需）
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Claude API Key（可选，用于多模型对比）
CLAUDE_API_KEY="your-claude-api-key-here"

# Google Gemini API Key（可选，用于多模型对比）
GEMINI_API_KEY="your-gemini-api-key-here"

# 服务器配置
PORT=3001
NODE_ENV=development

# 前端 API 地址
VITE_API_URL=http://localhost:3001

# Session 密钥（生产环境请改成随机字符串）
SESSION_SECRET="your-random-session-secret-here"

# CORS 配置
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3.4 运行数据库迁移

```bash
# 生成 Prisma Client
cd apps/api
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate dev --name init

# 返回项目根目录
cd ../..
```

---

## 第四步：运行系统

### 4.1 同时启动所有服务（推荐）

```bash
# 在项目根目录运行，会同时启动 API 和 Web
pnpm dev
```

这个命令会启动：
- **后端 API**: http://localhost:3001
- **Web 前端**: http://localhost:5173
- **Demo 应用**: 需要单独启动（见下方）

### 4.2 单独启动各个服务

如果你想单独启动某个服务：

```bash
# 只启动 Demo 应用
pnpm dev:demo
# 访问: http://localhost:5173

# 只启动 API
cd apps/api
pnpm dev
# 访问: http://localhost:3001

# 只启动 Web 应用
cd apps/web
pnpm dev
# 访问: http://localhost:5174
```

---

## 第五步：验证安装

### 5.1 检查 API 健康状态

```bash
curl http://localhost:3001/health
```

应该返回类似：
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5.2 访问前端应用

1. **Demo 应用**: http://localhost:5173
   - 展示各种功能演示
   - 包含 Pattern 识别、隐私层级、技能监控等页面

2. **Web 应用**: http://localhost:5174
   - 完整的聊天界面
   - 包含置信度评分、Pattern 识别、验证工具等

### 5.3 打开数据库管理界面

```bash
# 在项目根目录运行
pnpm db:studio
```

访问 http://localhost:5555 可以查看和管理数据库数据。

---

## 常用命令

### 开发命令

```bash
# 启动开发服务器
pnpm dev              # 启动所有服务
pnpm dev:demo         # 只启动 demo

# 构建项目
pnpm build            # 构建所有项目
pnpm build:demo       # 只构建 demo

# 预览构建结果
pnpm preview:demo     # 预览 demo 构建结果

# 代码检查
pnpm lint             # 运行 ESLint
pnpm format           # 格式化代码
pnpm type-check       # TypeScript 类型检查
```

### 数据库命令

```bash
# 数据库迁移
pnpm db:migrate       # 运行迁移
pnpm db:generate      # 生成 Prisma Client
pnpm db:studio        # 打开 Prisma Studio
```

---

## 项目结构说明

```
Qichacha/
├── apps/
│   ├── api/                    # 后端 API 服务
│   │   ├── src/
│   │   │   ├── routes/         # API 路由
│   │   │   ├── controllers/    # 控制器
│   │   │   ├── services/       # 业务逻辑
│   │   │   │   ├── confidence/              # 置信度计算
│   │   │   │   ├── ai-integration/          # AI API 集成
│   │   │   │   ├── pattern-recognition/     # Pattern 识别
│   │   │   │   └── skill-monitoring/        # 技能监控
│   │   │   └── server.ts       # 服务器入口
│   │   ├── prisma/
│   │   │   └── schema.prisma   # 数据库 Schema
│   │   └── package.json
│   │
│   ├── web/                    # Web 应用（完整功能）
│   │   ├── src/
│   │   │   ├── components/     # UI 组件
│   │   │   ├── pages/          # 页面
│   │   │   ├── lib/            # 工具函数
│   │   │   └── i18n.ts         # 国际化配置
│   │   └── package.json
│   │
│   └── demo/                   # Demo 演示应用
│       ├── src/
│       │   ├── pages/          # 演示页面
│       │   │   ├── PatternDemoPage.tsx      # Pattern 展示
│       │   │   ├── PrivacyDemoPage.tsx      # 隐私层级
│       │   │   ├── SkillMonitoringPage.tsx  # 技能监控
│       │   │   └── ...
│       │   ├── locales/        # 中英文翻译
│       │   │   ├── zh.json
│       │   │   └── en.json
│       │   └── i18n.ts
│       └── package.json
│
├── .env                        # 环境变量（需要创建）
├── .env.example                # 环境变量模板
├── package.json                # 根 package.json
├── pnpm-workspace.yaml         # pnpm workspace 配置
├── README.md                   # 项目说明
├── SETUP.md                    # 设置指南
└── MAC_SETUP_GUIDE.md          # 本文档
```

---

## 核心功能说明

### 1. 置信度评分系统
每个 AI 回复都包含多因素置信度评分：
- 模型不确定性
- 知识库匹配度
- 信息时效性
- 领域可靠性
- 来源一致性

### 2. Pattern 识别（6种用户行为模式）
- **Pattern A**: 战略分解者 - 高元认知能力
- **Pattern B**: 效率迭代者 - 快速迭代优化
- **Pattern C**: 学习探索者 - 深度学习
- **Pattern D**: 验证谨慎者 - 健康怀疑
- **Pattern E**: 务实完成者 - 任务导向
- **Pattern F**: 无批判依赖者 - 过度依赖风险

### 3. 自适应界面
根据检测到的用户 Pattern 自动调整 UI：
- Pattern A: 增强验证工具
- Pattern F: 显示干预提示

### 4. 技能监控
追踪独立性比率，防止技能退化：
- 每日/每周指标
- 按任务类型分类技能
- 趋势分析
- 警报系统

---

## 故障排除

### 数据库连接问题

```bash
# 检查 PostgreSQL 是否运行
brew services list | grep postgresql

# 重启 PostgreSQL
brew services restart postgresql@14

# 测试连接
psql mca_system
```

### 端口占用问题

```bash
# 查看端口占用
lsof -i :3001  # API 端口
lsof -i :5173  # Web/Demo 端口

# 修改 .env 中的 PORT 配置
```

### Prisma Client 问题

```bash
# 重新生成 Prisma Client
cd apps/api
pnpm prisma generate
cd ../..
```

### 依赖安装问题

```bash
# 清理并重新安装
rm -rf node_modules apps/*/node_modules
pnpm install
```

### TypeScript 错误

```bash
# 清理构建缓存
rm -rf dist apps/*/dist apps/*/.next
pnpm install
pnpm build
```

---

## 获取 API Keys

### OpenAI API Key (必需)
1. 访问 https://platform.openai.com/
2. 注册/登录账号
3. 进入 API Keys 页面创建新 Key
4. 复制到 `.env` 的 `OPENAI_API_KEY`

### Anthropic Claude API Key (可选)
1. 访问 https://console.anthropic.com/
2. 注册/登录账号
3. 获取 API Key
4. 复制到 `.env` 的 `CLAUDE_API_KEY`

### Google Gemini API Key (可选)
1. 访问 https://makersuite.google.com/
2. 获取 API Key
3. 复制到 `.env` 的 `GEMINI_API_KEY`

---

## 推荐的开发工具

- **IDE**: VSCode
- **数据库管理**: Prisma Studio (内置) 或 Postico (Mac)
- **API 测试**: Postman 或 Insomnia
- **终端**: iTerm2

---

## 下一步

1. ✅ 启动系统，访问 http://localhost:5173 查看 Demo 应用
2. ✅ 测试聊天界面，查看置信度评分
3. ✅ 浏览 Pattern 识别页面，了解 6 种用户模式
4. ✅ 探索技能监控功能
5. ✅ 查看数据库结构（使用 Prisma Studio）

---

## 常见问题

**Q: 我只想运行 Demo，不需要 API 和数据库吗？**
A: Demo 应用目前使用 mock 数据，可以单独运行：`pnpm dev:demo`

**Q: 如何切换语言？**
A: Demo 应用右上角有语言切换按钮，支持中英文切换

**Q: 生产环境如何部署？**
A: 参考 `DEPLOYMENT.md` 文件，包含 Vercel、Railway 等部署方案

**Q: 数据库结构是什么样的？**
A: 查看 `apps/api/prisma/schema.prisma`，包含 User, Session, Interaction 等 8 个表

---

## 需要帮助？

- 📖 查看 `README.md` 了解项目概览
- 📖 查看 `SETUP.md` 了解详细设置
- 📖 查看 `FEATURES.md` 了解功能说明
- 🐛 遇到问题？检查上面的"故障排除"部分

祝你使用愉快！🎉
