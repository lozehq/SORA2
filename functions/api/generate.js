/**
 * EdgeOne Pages Node Function: Video Generation Proxy
 * POST /api/generate
 * 
 * Environment Variables Required:
 * - SORA_API_KEY: Your API key for api.dzz.ai
 */

const API_ENDPOINT = 'https://api.dzz.ai/v1/chat/completions';

export default async function handler(request, context) {
  // Only accept POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get API key from environment
    const apiKey = context.env.SORA_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'SORA_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const data = await request.json();
    const { prompt, resolution, aspectRatio, mode, image } = data;

    if (!prompt && mode === 'text') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (mode === 'image' && !image) {
      return new Response(
        JSON.stringify({ error: 'Image is required for image-to-video mode' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build message content
    let content;
    if (mode === 'image' && image) {
      // Image-to-video mode
      content = [
        {
          type: 'image_url',
          image_url: {
            url: image
          }
        }
      ];
      if (prompt) {
        content.unshift({
          type: 'text',
          text: prompt
        });
      }
    } else {
      // Text-to-video mode
      content = prompt;
    }

    // Build API payload
    const payload = {
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      model: 'sora_video2',
      stream: true
    };

    console.log(`Generating video - resolution: ${resolution}, aspect: ${aspectRatio}, mode: ${mode}`);

    // Call upstream API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `API error: ${response.status}`,
          details: errorText 
        }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Stream the response back to client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

