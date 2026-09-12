import { NextRequest, NextResponse } from 'next/server';

/**
 * app/api/openf1/route.ts
 * Server-side BFF Proxy for OpenF1 API requests.
 * Eliminates browser CORS issues and protects against client-side network blocks.
 */

export const dynamic = 'force-dynamic';

const ALLOWED_ENDPOINTS = [
  'sessions',
  'meetings',
  'drivers',
  'laps',
  'stints',
  'team_radio',
  'pit',
  'race_control',
  'car_data',
  'location',
  'weather',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint || !ALLOWED_ENDPOINTS.includes(endpoint)) {
      return NextResponse.json(
        { error: `Invalid or disallowed endpoint: ${endpoint}` },
        { status: 400 }
      );
    }

    // Build target URL to OpenF1
    const targetUrl = new URL(`https://api.openf1.org/v1/${endpoint}`);
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        targetUrl.searchParams.append(key, value);
      }
    });

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'F1TelemetryPortal/1.0',
      },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 30 },
    });

    if (response.status === 404 || response.status === 401) {
      // OpenF1 may return 401 or 404 if subscription/session is unavailable or rate-limited.
      // Return empty dataset so client gracefully activates mock data fallback.
      return NextResponse.json([]);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenF1 error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `OpenF1 proxy failed: ${msg}` },
      { status: 502 }
    );
  }
}
