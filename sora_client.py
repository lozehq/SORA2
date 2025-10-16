#!/usr/bin/env python3
"""
Sora Video Generation Client
A simple client to interact with the Sora video generation API
"""

import requests
import json
import sys
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class SoraClient:
    """Client for interacting with Sora video generation API"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.dzz.ai"):
        """
        Initialize the Sora client
        
        Args:
            api_key: Your API key
            base_url: Base URL for the API (default: https://api.dzz.ai)
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.endpoint = f"{self.base_url}/v1/chat/completions"
        
    def generate_video(self, prompt: str, model: str = "sora_video2", stream: bool = True) -> None:
        """
        Generate a video based on the prompt
        
        Args:
            prompt: Description of the video to generate
            model: Model to use (default: sora_video2)
            stream: Whether to stream the response (default: True)
        """
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": model,
            "stream": stream
        }
        
        print(f"Generating video with prompt: {prompt}")
        print(f"Using model: {model}")
        print("-" * 60)
        
        try:
            response = requests.post(
                self.endpoint,
                headers=headers,
                json=payload,
                stream=stream,
                timeout=300
            )
            
            response.raise_for_status()
            
            if stream:
                # Handle streaming response
                print("Streaming response:")
                for line in response.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith('data: '):
                            data = decoded_line[6:]  # Remove 'data: ' prefix
                            if data.strip() == '[DONE]':
                                print("\n\nGeneration complete!")
                                break
                            try:
                                json_data = json.loads(data)
                                # Print the response chunk
                                if 'choices' in json_data:
                                    for choice in json_data['choices']:
                                        if 'delta' in choice and 'content' in choice['delta']:
                                            content = choice['delta']['content']
                                            print(content, end='', flush=True)
                                        elif 'message' in choice and 'content' in choice['message']:
                                            content = choice['message']['content']
                                            print(content, end='', flush=True)
                            except json.JSONDecodeError:
                                print(decoded_line)
            else:
                # Handle non-streaming response
                result = response.json()
                print("Response:")
                print(json.dumps(result, indent=2, ensure_ascii=False))
                
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}", file=sys.stderr)
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status: {e.response.status_code}", file=sys.stderr)
                print(f"Response body: {e.response.text}", file=sys.stderr)
            sys.exit(1)
        except KeyboardInterrupt:
            print("\n\nGeneration interrupted by user")
            sys.exit(0)


def main():
    """Main entry point"""
    # Configuration - read from environment
    API_KEY = os.getenv('SORA_API_KEY')
    BASE_URL = os.getenv('SORA_BASE_URL', 'https://api.dzz.ai')
    
    if not API_KEY:
        print("Error: SORA_API_KEY environment variable not set", file=sys.stderr)
        print("Please set your API key: export SORA_API_KEY=your_key_here", file=sys.stderr)
        sys.exit(1)
    
    # Initialize client
    client = SoraClient(api_key=API_KEY, base_url=BASE_URL)
    
    # Example prompts
    if len(sys.argv) > 1:
        # Use command line argument as prompt
        prompt = ' '.join(sys.argv[1:])
    else:
        # Default prompt
        prompt = "生成一个 1080p 的小猫吃鱼"
    
    # Generate video
    client.generate_video(prompt=prompt, model="sora_video2", stream=True)


if __name__ == "__main__":
    main()

