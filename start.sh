#!/bin/bash
echo "========================================"
echo "Sora 视频生成器 Web 应用"
echo "========================================"
echo ""

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
    echo "[警告] .env 文件不存在！"
    echo ""
    if [ -f ".env.example" ]; then
        echo "正在从 .env.example 创建 .env 文件..."
        cp .env.example .env
        echo "✓ .env 文件已创建"
        echo ""
        echo "[重要] 请编辑 .env 文件并配置您的 API Key！"
        echo "使用命令: nano .env 或 vim .env"
        echo ""
        exit 1
    else
        echo "[错误] 找不到 .env.example 文件"
        exit 1
    fi
fi

echo "正在检查依赖..."
pip install -r requirements.txt --quiet
echo ""
echo "正在启动服务器..."
echo ""
python app.py

