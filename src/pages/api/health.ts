import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ request, clientAddress }) => {
  const cf = request.cf;

  return new Response(
    JSON.stringify({
      status: 'ok',
      runtime: 'Cloudflare Workers (SSR)',
      timestamp: new Date().toISOString(),
      clientAddress: clientAddress ?? 'unknown',
      environment: env.ENVIRONMENT ?? 'unknown',
      cf: {
        colo: cf?.colo ?? 'N/A (local dev)',
        country: cf?.country ?? 'N/A (local dev)',
        city: cf?.city ?? 'N/A (local dev)',
        region: cf?.region ?? 'N/A (local dev)',
        timezone: cf?.timezone ?? 'N/A (local dev)',
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
};

