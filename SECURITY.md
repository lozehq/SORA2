# 安全说明 / Security Guidelines

## 🔒 重要安全提示

### API Key 管理

**请勿将 API Key 硬编码在代码中或提交到版本控制系统！**

#### ✅ 正确做法

1. 使用环境变量存储 API Key
2. 使用 `.env` 文件（已在 `.gitignore` 中）
3. 生产环境使用平台的环境变量配置

#### ❌ 错误做法

- ❌ 不要在代码中硬编码 API Key
- ❌ 不要将 `.env` 文件提交到 Git
- ❌ 不要在公开文档中展示真实的 API Key
- ❌ 不要在截图中暴露 API Key

## 环境变量配置

### 本地开发

1. 复制 `.env.example` 到 `.env`
2. 填入你的 API Key
3. `.env` 文件会被自动忽略，不会提交到 Git

### Vercel 部署

在 Vercel 项目设置中添加环境变量：
- Key: `SORA_API_KEY`
- Value: 你的 API Key
- Environments: Production, Preview, Development

### Render 部署

在 Render 控制台的 Environment 标签页添加：
- Key: `SORA_API_KEY`
- Value: 你的 API Key

### Docker 部署

使用 `-e` 参数传递环境变量：
```bash
docker run -e SORA_API_KEY=your_key_here -p 5000:5000 sora2
```

或使用 `--env-file`:
```bash
docker run --env-file .env -p 5000:5000 sora2
```

## 最佳实践

1. **定期轮换 API Key**
2. **使用不同的 Key 用于开发和生产环境**
3. **限制 API Key 的访问权限**
4. **监控 API 使用情况，及时发现异常**
5. **不要在客户端代码中暴露 API Key**

## 如果 API Key 泄露

1. 立即在 API 提供商处撤销该 Key
2. 生成新的 API Key
3. 更新所有使用该 Key 的环境
4. 检查是否有未授权的使用

## 报告安全问题

如果发现安全漏洞，请通过 GitHub Issues 私下报告，不要公开披露。
