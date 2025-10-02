#!/usr/bin/env python3
"""
Sora Video Generation Web Application
Flask backend server
"""

from flask import Flask, render_template, request, Response, jsonify
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
# Enable CORS for frontends hosted on different origins (EdgeOne Pages + backend elsewhere)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

# API Configuration
# Prefer environment variable for security in deployments
API_KEY = os.getenv('SORA_API_KEY', "sk-wvTvyj2GXEzJkrOn73C7504a86764c279702A65237085358")
BASE_URL = "https://api.dzz.ai"
API_ENDPOINT = f"{BASE_URL}/v1/chat/completions"


@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')


@app.route('/api/generate', methods=['POST'])
def generate_video():
    """Proxy endpoint for video generation"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        resolution = data.get('resolution', '1080p')
        aspect_ratio = data.get('aspectRatio', '16:9')
        mode = data.get('mode', 'text')
        image_base64 = data.get('image', None)
        
        # 打印调试信息
        print(f"收到请求 - 分辨率: {resolution}, 比例: {aspect_ratio}, 模式: {mode}")
        
        if not prompt and mode == 'text':
            return jsonify({'error': 'Prompt is required'}), 400
        
        if mode == 'image' and not image_base64:
            return jsonify({'error': 'Image is required for image-to-video mode'}), 400
        
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Build message content
        if mode == 'image' and image_base64:
            # Image-to-video mode
            content = [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": image_base64
                    }
                }
            ]
            if prompt:
                content.insert(0, {
                    "type": "text",
                    "text": prompt
                })
        else:
            # Text-to-video mode
            content = prompt
        
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": content
                }
            ],
            "model": "sora_video2",
            "stream": True
        }
        
        def generate():
            """Generator function for streaming response"""
            try:
                print(f"发送到 API 的 payload: {json.dumps(payload, ensure_ascii=False)[:200]}...")
                
                response = requests.post(
                    API_ENDPOINT,
                    headers=headers,
                    json=payload,
                    stream=True,
                    timeout=300
                )
                
                print(f"API 响应状态码: {response.status_code}")
                response.raise_for_status()
                
                for line in response.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith('data: '):
                            data = decoded_line[6:]
                            yield f"data: {data}\n\n"
                            
            except requests.exceptions.RequestException as e:
                print(f"API 请求错误: {str(e)}")
                if hasattr(e, 'response') and e.response is not None:
                    print(f"响应内容: {e.response.text[:500]}")
                error_data = {
                    'error': str(e),
                    'status': getattr(e.response, 'status_code', 500) if hasattr(e, 'response') else 500
                }
                yield f"data: {json.dumps(error_data)}\n\n"
            except Exception as e:
                print(f"其他错误: {str(e)}")
                error_data = {'error': str(e), 'status': 500}
                yield f"data: {json.dumps(error_data)}\n\n"
        
        resp = Response(generate(), mimetype='text/event-stream')
        # Improve SSE compatibility behind proxies/CDNs
        resp.headers['Cache-Control'] = 'no-cache'
        resp.headers['X-Accel-Buffering'] = 'no'
        return resp
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'model': 'sora_video2'})


@app.errorhandler(404)
def not_found(_e):
    """Serve SPA index for non-API 404s to avoid platform 404 pages"""
    try:
        path = request.path or ''
    except Exception:
        path = ''
    if path.startswith('/api/'):
        return jsonify({'error': 'Not found'}), 404
    return render_template('index.html'), 200


if __name__ == '__main__':
    print("=" * 60)
    print("Sora Video Generation Web Application")
    print("=" * 60)
    print("Starting server at http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)

