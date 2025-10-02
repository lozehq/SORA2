# EdgeOne Pages 完整部署指南

## 项目结构说明

已改写为 EdgeOne Pages 完整支持：
- `/index.html` - 前端入口（根目录）
- `/static/` - 静态资源（CSS/JS）
- `/functions/api/` - Node Functions（后端 API）
  - `health.js` - 健康检查
  - `generate.js` - 视频生成代理

## 部署步骤

### 1. 推送到 GitHub
```bash
git add .
git commit -m "EdgeOne Pages Node Functions"
git push
```

### 2. EdgeOne Pages 创建项目
1. 访问 [EdgeOne Pages 控制台](https://console.tencentcloud.com/edgeone/pages)
2. 点击"新建项目" → "从 Git 导入"
3. 选择你的仓库和 main 分支
4. 项目设置：
   - 框架预设：**Other**
   - 根目录：`/`
   - 构建命令：留空
   - 输出目录：留空
   - 安装命令：留空

### 3. 配置环境变量（重要）
在项目设置 → 环境变量 → 添加：
- **变量名**：`SORA_API_KEY`
- **变量值**：你的 API 密钥（sk-wvTvyj2GXEzJkrOn73C7504a86764c279702A65237085358）
- **生效范围**：所有部署

### 4. 部署项目
- 点击"部署"按钮
- 等待构建完成（约 1-2 分钟）

### 5. 验证部署
1. 打开你的 EdgeOne 域名：
   - 主页应显示完整界面
2. 测试健康检查：
   - `https://你的域名/api/health`
   - 应返回：`{"status":"ok","model":"sora_video2"}`
3. 测试视频生成：
   - 在页面输入提示词
   - 点击"生成视频"
   - 应能正常生成和播放

## 文件说明

### functions/api/health.js
健康检查端点，返回 API 状态。

### functions/api/generate.js
视频生成代理：
- 接收前端请求
- 调用 api.dzz.ai
- 以 SSE 流式返回响应
- 从环境变量读取 SORA_API_KEY

### edgeone.json
EdgeOne Pages 配置文件：
- 定义 Node Functions 路由
- 映射 /api/* 到对应的函数

## 注意事项

1. **环境变量必须设置**
   - `SORA_API_KEY` 未配置会返回 500 错误

2. **函数冷启动**
   - 首次请求可能需要 1-2 秒初始化
   - 后续请求会快很多

3. **超时限制**
   - EdgeOne Node Functions 默认超时 30 秒
   - 视频生成通常在此时间内完成

4. **日志查看**
   - 项目设置 → 日志分析
   - 可查看函数执行日志和错误

## 故障排查

### 404 错误
- 检查 edgeone.json 是否在根目录
- 检查 functions/ 目录结构是否正确

### 500 错误
- 检查环境变量 SORA_API_KEY 是否设置
- 查看日志分析中的错误详情

### CORS 错误
- Node Functions 已内置 CORS 支持
- 如有问题，检查响应头设置

## 与之前方案的对比

| 方案 | 前端 | 后端 | 优点 | 缺点 |
|------|------|------|------|------|
| EdgeOne 完整部署 | EdgeOne | Node Functions | 全在一个平台，无需跨域 | 需改写后端为 JS |
| 分离部署 | EdgeOne | Render/Railway | 保留 Python 后端 | 需配置 apiBase，跨域 |
| Render 整站 | Render | Render | 最简单，无需改代码 | 不在 EdgeOne |

## 成本说明

- EdgeOne Pages 免费额度：
  - 100 GB 带宽/月
  - 1000 万次请求/月
  - Node Functions 免费使用

## 后续优化

1. 绑定自定义域名（项目设置 → 域名管理）
2. 配置 CDN 加速区域
3. 启用 HTTPS 证书（自动配置）
4. 监控函数性能和错误率

---

部署完成后，你的项目将完全运行在 EdgeOne Pages 上，无需额外的后端服务器！

