# Sora 视频生成器 Web 应用

一个美观、现代的 Web 界面，用于使用 Sora API 生成视频。

## 功能特点

- 🎨 现代化、响应式的 UI 设计
- 🚀 实时流式响应显示
- 📝 快速提示词模板
- 📊 实时状态监控和日志
- 🔒 安全的后端代理（API 密钥不暴露在前端）
- 💫 流畅的动画效果
- 🎬 **双模式支持**：文生视频 / 图生视频
- 📐 **分辨率选择**：支持 720p、1080p、2K、4K
- 🖼️ **图片上传**：支持拖拽上传，即时预览

## 项目结构

```
SORA2/
├── app.py                  # Flask 后端服务器
├── sora_client.py          # 命令行客户端（可选）
├── requirements.txt        # Python 依赖
├── templates/
│   └── index.html         # 主页面模板
├── static/
│   ├── css/
│   │   └── style.css      # 样式文件
│   └── js/
│       └── app.js         # 前端 JavaScript
└── README_WEB.md          # 本文档
```

## 安装

1. **安装依赖**

```bash
pip install -r requirements.txt
```

## 使用方法

### 启动 Web 服务器

```bash
python app.py
```

服务器将在 `http://localhost:5000` 启动

### 访问应用

1. 在浏览器中打开：`http://localhost:5000`
2. 在文本框中输入视频描述
3. 点击"生成视频"按钮
4. 等待 API 返回结果

### 快速提示词

应用内置了多个快速提示词模板：
- 🐱 小猫吃鱼
- 🌅 海滩日落
- 🌃 城市夜景
- 🌲 森林溪流
- 🌧️ 雨天街景
- ☕ 咖啡店

点击任意模板即可快速填充提示词。

## 功能说明

### 1. 双模式切换
- **文生视频**：通过文字描述生成视频
- **图生视频**：上传图片作为参考，生成视频动画

### 2. 分辨率选择
- 720p (1280x720)
- 1080p (1920x1080) - 推荐
- 2K (2560x1440)
- 4K (3840x2160)

### 3. 图片上传（图生视频模式）
- 点击上传或拖拽上传
- 支持 JPG、PNG、GIF 格式
- 实时图片预览
- 一键删除重新上传

### 4. 视频描述输入
- 支持多行文本输入
- 实时字符计数
- 快速提示词模板
- 根据模式自动调整提示文字

### 5. 状态指示器
- **就绪**（绿色）：系统准备就绪
- **正在生成**（黄色）：正在调用 API 生成视频
- **错误**（红色）：生成过程中出现错误

### 6. 视频播放器
- **自动加载**：检测到视频 URL 后自动显示播放器
- **在线播放**：HTML5 播放器，支持播放/暂停、音量、全屏等控制
- **下载功能**：一键下载生成的视频文件
- **复制链接**：快速复制视频 URL 到剪贴板
- **加载动画**：视频加载时显示旋转动画提示
- **响应式**：完美适配各种屏幕尺寸

### 7. 响应日志
- 实时显示 API 返回的数据
- 时间戳记录
- 自动滚动到最新内容

### 8. 安全性
- API 密钥存储在后端，不会暴露给前端
- 后端代理所有 API 请求
- 防止 API 密钥泄露

## API 配置

在 `app.py` 中配置：

```python
API_KEY = "sk-wvTvyj2GXEzJkrOn73C7504a86764c279702A65237085358"
BASE_URL = "https://api.dzz.ai"
```

## 自定义配置

### 修改端口

在 `app.py` 中修改：

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # 修改 port 参数
```

### 修改样式

编辑 `static/css/style.css` 文件，修改 CSS 变量：

```css
:root {
    --primary-color: #6366f1;  /* 主色调 */
    --secondary-color: #8b5cf6;  /* 次要色调 */
    /* ... 其他颜色配置 */
}
```

## 技术栈

### 后端
- **Flask** - Web 框架
- **Requests** - HTTP 客户端
- **Server-Sent Events** - 实时流式传输

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **Vanilla JavaScript** - 交互逻辑
- **Fetch API** - HTTP 请求

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 部署建议

### 本地开发
```bash
python app.py
```

### 生产环境
使用 Gunicorn 或 uWSGI：

```bash
# 安装 Gunicorn
pip install gunicorn

# 运行
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker 部署
可以创建 Dockerfile：

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 故障排除

### 端口被占用
修改 `app.py` 中的端口号，或终止占用端口的程序。

### API 连接失败
检查：
1. API 密钥是否正确
2. 网络连接是否正常
3. API 服务是否可用

### 样式显示异常
清除浏览器缓存后重新加载页面。

## 许可证

本项目开源，供个人学习和使用。

## 贡献

欢迎提交问题和改进建议！

