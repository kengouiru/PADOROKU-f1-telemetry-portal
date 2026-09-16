import { NextRequest, NextResponse } from 'next/server';

/**
 * app/api/image-proxy/route.ts
 * Safe streaming BFF proxy for Wikimedia Commons and external CC-licensed driver portraits.
 * Resolves browser CORS restrictions and Referrer header blocks by fetching images server-side.
 */

export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = [
  'upload.wikimedia.org',
  'commons.wikimedia.org',
  'en.wikipedia.org',
  'wikipedia.org',
  'images.unsplash.com',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing image "url" query parameter' },
        { status: 400 }
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 });
    }

    // Domain validation
    const isAllowed = ALLOWED_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: `Host ${parsed.hostname} is not allowed` },
        { status: 403 }
      );
    }

    // Fetch remote image with Wikimedia compliant User-Agent
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent':
          'F1TelemetryApp/1.0 (Educational/Analytical Research; contact@f1telemetry.local)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Encoding': 'identity',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image from upstream: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const contentLength = response.headers.get('content-length');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      'Access-Control-Allow-Origin': '*',
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Image Proxy Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while streaming image' },
      { status: 500 }
    );
  }
}
