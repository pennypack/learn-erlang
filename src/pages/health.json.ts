export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'learn-erlang-site'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}