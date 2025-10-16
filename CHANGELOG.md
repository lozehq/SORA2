# 更新日志 / Changelog

## [Security Fix] - 2025-10-13

### 🔒 安全修复 (Critical)

#### 修复内容
1. **移除硬编码的 API Key**
   - ❌ 从 `README.md` 中移除暴露的 API Key
   - ❌ 从 `sora_client.py` 中移除硬编码的 Key
   - ✅ 改为使用环境变量 `SORA_API_KEY`

2. **添加环境变量管理**
   - ✅ 创建 `.env.example` 模板文件
   - ✅ 更新 `.gitignore` 忽略 `.env` 文件
   - ✅ 添加 `python-dotenv` 依赖自动加载环境变量

3. **代码改进**
   - ✅ `app.py` - 添加环境变量加载和验证
   - ✅ `sora_client.py` - 强制使用环境变量，添加错误提示
   - ✅ 启动时检查 API Key 是否配置

### 📦 依赖修复

#### 修复内容
1. **补全缺失的依赖**
   - ✅ 添加 `flask>=2.3.0`
   - ✅ 添加 `gunicorn>=21.2.0`
   - ✅ 添加 `python-dotenv>=1.0.0`

### 🛠️ 启动脚本改进

#### Windows (`start.bat`)
- ✅ 自动检查 `.env` 文件是否存在
- ✅ 如不存在，自动从 `.env.example` 创建
- ✅ 提示用户配置 API Key

#### Mac/Linux (`start.sh`)
- ✅ 自动检查 `.env` 文件是否存在
- ✅ 如不存在，自动从 `.env.example` 创建
- ✅ 提示用户配置 API Key

### 📚 文档更新

#### 新增文档
- ✅ `SECURITY.md` - 安全最佳实践指南
- ✅ `CHANGELOG.md` - 本更新日志

#### 更新文档
- ✅ `README.md` - 添加 API Key 配置说明
- ✅ `使用说明.md` - 添加首次配置步骤
- ✅ `DEPLOY_VERCEL.md` - 强调环境变量配置

### 🔐 安全最佳实践

现在项目遵循以下安全标准：

1. ✅ **环境变量管理**
   - API Key 通过 `.env` 文件或环境变量配置
   - `.env` 文件已被 `.gitignore` 忽略
   
2. ✅ **代码安全**
   - 不再有硬编码的敏感信息
   - 启动时验证必需的环境变量
   
3. ✅ **文档安全**
   - 移除所有真实的 API Key
   - 使用占位符 `YOUR_API_KEY_HERE`
   
4. ✅ **用户引导**
   - 清晰的配置步骤说明
   - 自动化的环境检查

### 📝 迁移指南

如果你是现有用户，请按以下步骤迁移：

1. **更新代码**
   ```bash
   git pull
   ```

2. **安装新依赖**
   ```bash
   pip install -r requirements.txt
   ```

3. **配置环境变量**
   ```bash
   # 复制模板
   cp .env.example .env
   
   # 编辑 .env 文件，填入你的 API Key
   nano .env
   ```

4. **重启应用**
   ```bash
   python app.py
   ```

### ⚠️ 破坏性变更 (Breaking Changes)

- **命令行客户端**：现在必须设置 `SORA_API_KEY` 环境变量才能运行
- **Web 应用**：需要配置 `.env` 文件或设置环境变量

### 🎯 下一步计划

- [ ] 添加请求限流功能
- [ ] 实现用户认证系统
- [ ] 添加请求日志和监控
- [ ] 前端资源压缩优化
- [ ] 添加单元测试

---

## 如何获取 API Key

请联系 API 提供商 (api.dzz.ai) 获取你自己的 API Key。

**重要**：不要使用文档中的示例 Key，它们仅用于演示格式。
