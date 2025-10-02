"""
Vercel Serverless Function: Health Check
GET /api/health
"""
from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        response = {
            'status': 'ok',
            'model': 'sora_video2'
        }
        
        self.wfile.write(json.dumps(response).encode())
        return

