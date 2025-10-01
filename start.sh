#!/bin/bash
echo "========================================"
echo "Sora 视频生成器 Web 应用"
echo "========================================"
echo ""
echo "正在检查依赖..."
pip install -r requirements.txt --quiet
echo ""
echo "正在启动服务器..."
echo ""
python app.py

