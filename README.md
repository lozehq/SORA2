# Sora Video Generation Client

A complete solution for interacting with the Sora video generation API (api.dzz.ai), including both a **Web Application** and a **Command-line Client**.

## 🌟 Features

- 🎨 **Beautiful Web UI** - Modern, responsive web interface
- 💻 **Command-line Client** - Simple Python CLI for quick access
- 🚀 **Real-time Streaming** - See results as they're generated
- 📝 **Quick Prompts** - Pre-built templates for common scenarios
- 🔒 **Secure** - API key stored safely on the server
- 🎯 **Easy to Use** - No coding required for web interface
- 🎬 **Dual Modes** - Text-to-video & Image-to-video generation
- 📐 **Multiple Resolutions** - 720p, 1080p, 2K, 4K support
- 🖼️ **Image Upload** - Drag & drop with instant preview

## 📦 Installation

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Configure API Key

**⚠️ Important: You must configure your API key before running the application!**

1. Copy the environment template:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```bash
   SORA_API_KEY=your_api_key_here
   ```

3. Save the file

> **Security Note**: The `.env` file is gitignored and will not be committed to version control.

## 🚀 Quick Start

### Option 1: Web Application (Recommended)

**Start the server:**
```bash
python app.py
```

**Access the application:**
Open your browser and visit: `http://localhost:5000`

Features:
- Beautiful, modern UI
- Real-time status updates
- Quick prompt templates
- Response logging
- Mobile-friendly design
- **Text-to-video mode** - Generate videos from descriptions
- **Image-to-video mode** - Upload images and animate them
- **Resolution selector** - Choose from 720p to 4K
- **Drag & drop upload** - Easy image uploading

### Option 2: Command Line

**Set API key in environment (required):**
```bash
# Windows
set SORA_API_KEY=your_api_key_here

# Mac/Linux
export SORA_API_KEY=your_api_key_here
```

Or use the `.env` file (automatically loaded).

**With custom prompt:**
```bash
python sora_client.py "生成一个 1080p 的小猫吃鱼"
```

**With default prompt:**
```bash
python sora_client.py
```

### Option 3: As a Python Module

```python
from sora_client import SoraClient

# Initialize the client
client = SoraClient(
    api_key="YOUR_API_KEY_HERE",
    base_url="https://api.dzz.ai"
)

# Generate a video
client.generate_video("生成一个 1080p 的夕阳下的海滩")
```

## API Configuration

- **Base URL**: `https://api.dzz.ai`
- **API Key**: Configure via environment variable `SORA_API_KEY`
- **Model**: `sora_video2`
- **Endpoint**: `/v1/chat/completions`

### Setting up API Key

1. Copy `.env.example` to `.env`
2. Edit `.env` and add your API key:
   ```bash
   SORA_API_KEY=your_api_key_here
   ```
3. The application will automatically load the key from the environment

## Alternative Usage

You can also use this API in other applications:

### Cherry or ChatWise

1. Add the base URL: `https://api.dzz.ai`
2. Add your API key (obtain from the API provider)
3. Fill in the model name: `sora_video2`

### cURL Example

```bash
curl --location --request POST 'https://api.dzz.ai/v1/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY_HERE' \
--header 'Content-Type: application/json' \
--data-raw '{
    "messages": [
        {
            "role": "user",
            "content": "生成一个 1080p 的小猫吃鱼"
        }
    ],
    "model": "sora_video2",
    "stream": true
}'
```

## Notes

- Watermarks have been removed from generated videos
- The API uses a chat-completion style interface
- Streaming is enabled by default for real-time feedback

## License

This project is open source and available for personal use.

