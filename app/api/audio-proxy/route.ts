import { NextRequest, NextResponse } from 'next/server';

/**
 * app/api/audio-proxy/route.ts
 * Streaming BFF proxy for F1 Team Radio MP3 audio files.
 * Resolves browser CORS restrictions and Referrer header blocks by fetching audio server-side.
 */

// Allowed audio hostnames to prevent open proxy vulnerability
const ALLOWED_HOSTS = [
  'livetiming.formula1.com',
  'api.openf1.org',
  'openf1.org',
  'www.soundhelix.com',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audioUrl = searchParams.get('url');

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Missing audio "url" query parameter' },
        { status: 400 }
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(audioUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid audio URL format' }, { status: 400 });
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

    // Fetch remote audio stream with proper User-Agent & Accept headers
    const response = await fetch(audioUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5',
        'Accept-Encoding': 'identity',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch audio from remote host: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const contentLength = response.headers.get('content-length');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    // Return body stream directly to client
    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Audio Proxy Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while streaming audio' },
      { status: 500 }
    );
  }
}
