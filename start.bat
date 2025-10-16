@echo off
chcp 65001 >nul
echo ========================================
echo Sora 视频生成器 Web 应用
echo ========================================
echo.

REM 检查 .env 文件是否存在
if not exist ".env" (
    echo [警告] .env 文件不存在！
    echo.
    if exist ".env.example" (
        echo 正在从 .env.example 创建 .env 文件...
        copy .env.example .env >nul
        echo ✓ .env 文件已创建
        echo.
        echo [重要] 请编辑 .env 文件并配置您的 API Key！
        echo.
        pause
        exit /b 1
    ) else (
        echo [错误] 找不到 .env.example 文件
        pause
        exit /b 1
    )
)

echo 正在检查依赖...
python -m pip install -r requirements.txt --quiet
echo.
echo 正在启动服务器...
echo.
python app.py
pause

