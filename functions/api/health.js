/**
 * EdgeOne Pages Node Function: Health Check
 * GET /api/health
 */
export default async function handler(request) {
  return new Response(
    JSON.stringify({
      status: 'ok',
      model: 'sora_video2'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

