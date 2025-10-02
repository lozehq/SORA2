"""
Vercel Serverless Function: Video Generation Proxy
POST /api/generate
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import requests


API_ENDPOINT = 'https://api.dzz.ai/v1/chat/completions'


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get API key from environment
            api_key = os.getenv('SORA_API_KEY')
            if not api_key:
                self.send_error(500, 'SORA_API_KEY not configured')
                return
            
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            prompt = data.get('prompt', '')
            resolution = data.get('resolution', '1080p')
            aspect_ratio = data.get('aspectRatio', '16:9')
            mode = data.get('mode', 'text')
            image_base64 = data.get('image', None)
            
            # Validation
            if not prompt and mode == 'text':
                self.send_error(400, 'Prompt is required')
                return
            
            if mode == 'image' and not image_base64:
                self.send_error(400, 'Image is required for image-to-video mode')
                return
            
            # Build message content
            if mode == 'image' and image_base64:
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
                content = prompt
            
            # Build API payload
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
            
            print(f"Generating - resolution: {resolution}, aspect: {aspect_ratio}, mode: {mode}")
            
            # Call upstream API with streaming
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                API_ENDPOINT,
                headers=headers,
                json=payload,
                stream=True,
                timeout=300
            )
            
            if not response.ok:
                self.send_error(response.status_code, f'API error: {response.text[:200]}')
                return
            
            # Stream response back to client
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('X-Accel-Buffering', 'no')
            self.end_headers()
            
            # Stream lines from upstream
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    if decoded_line.startswith('data: '):
                        data_content = decoded_line[6:]
                        self.wfile.write(f"data: {data_content}\n\n".encode('utf-8'))
                        self.wfile.flush()
            
        except Exception as e:
            print(f'Error: {str(e)}')
            self.send_error(500, str(e))

