# Vercel 部署指南

## 一键部署（最快）

点击下面的按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/SORA2&env=SORA_API_KEY&envDescription=Sora%20API%20密钥&envLink=https://api.dzz.ai)

## 手动部署步骤

### 1. 推送到 GitHub
```bash
git add .
git commit -m "Add Vercel deployment config"
git push
```

### 2. 导入到 Vercel
1. 访问 [Vercel](https://vercel.com)
2. 登录后点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 选择你的 SORA2 仓库
5. 点击 "Import"

### 3. 配置环境变量

**⚠️ 重要：必须配置 API Key 才能使用！**

在部署配置页面：
1. 展开 "Environment Variables"
2. 添加环境变量：
   - **Name**: `SORA_API_KEY`
   - **Value**: `你的API密钥`（从 API 提供商处获取）
   - **Environment**: Production, Preview, Development（全选）
3. 点击 "Deploy"

> **安全提示**：
> - 不要在代码中硬编码 API Key
> - 不要将 API Key 提交到 Git
> - 不要在截图或文档中展示真实的 API Key

### 4. 等待部署完成
- 部署通常需要 1-3 分钟
- Vercel 会自动分配一个域名，例如：`sora2-xxx.vercel.app`

### 5. 验证部署
1. 访问你的 Vercel 域名
2. 测试健康检查：`https://你的域名.vercel.app/api/health`
   - 应返回：`{"status":"ok","model":"sora_video2"}`
3. 在主页输入提示词，点击"生成视频"测试

## 项目结构

```
SORA2/
├── index.html          # 前端入口（根目录）
├── static/             # 静态资源
│   ├── css/
│   └── js/
├── api/                # Vercel Serverless Functions
│   ├── health.py       # 健康检查
│   └── generate.py     # 视频生成
├── vercel.json         # Vercel 配置
└── requirements.txt    # Python 依赖
```

## Vercel 配置说明

### vercel.json
- `builds`: 定义 Python Serverless Functions
- `routes`: 路由规则（API 路由和静态文件）
- `env`: 环境变量引用

### Serverless Functions
- 位于 `/api/` 目录
- 每个 `.py` 文件对应一个 API 端点
- 使用 `@vercel/python` 运行时
- 最大执行时间：10秒（Hobby）/ 60秒（Pro）

## 自定义域名

1. Vercel 项目 → Settings → Domains
2. 添加你的域名
3. 配置 DNS 记录（Vercel 会提供指引）

## 常见问题

### 1. 部署失败
- 检查 `requirements.txt` 依赖是否正确
- 查看 Vercel 部署日志中的错误信息

### 2. API 返回 500
- 检查环境变量 `SORA_API_KEY` 是否设置
- 查看 Vercel Functions 日志

### 3. 视频生成超时
- Vercel Hobby 计划函数最长运行 10 秒
- 如需更长时间，升级到 Pro 计划（60 秒）
- 或使用 Render/Railway 部署后端（无时间限制）

## 成本说明

Vercel 免费额度（Hobby 计划）：
- 100 GB 带宽/月
- 无限次部署
- Serverless Functions：100 GB-Hours/月
- 函数执行时间：10 秒
- 完全免费，无需信用卡

## 性能优化

1. **CDN 加速**
   - Vercel 自动为静态资源配置全球 CDN
   - 静态文件自动压缩和优化

2. **函数冷启动**
   - 首次请求可能需要 1-2 秒初始化
   - 频繁访问的函数会保持热启动状态

3. **流式响应**
   - `/api/generate` 使用 SSE 流式传输
   - 实时显示生成进度

## 与其他平台对比

| 平台 | 优点 | 缺点 |
|------|------|------|
| **Vercel** | 一键部署，全球 CDN，Python 支持 | 函数超时 10s（免费版） |
| EdgeOne Pages | 国内访问快 | 不支持 Python，配置复杂 |
| Render | 无超时限制，完整 Python 环境 | 构建较慢，免费版会休眠 |
| Railway | 简单易用，Docker 支持 | 免费额度有限 |

## 监控与日志

1. **实时日志**
   - Vercel 项目 → Deployments → 点击部署 → Runtime Logs

2. **性能监控**
   - Vercel Analytics（需升级）
   - 查看访问量、响应时间等

---

部署完成后，你的项目将运行在 Vercel 的全球边缘网络上，享受极速访问体验！

