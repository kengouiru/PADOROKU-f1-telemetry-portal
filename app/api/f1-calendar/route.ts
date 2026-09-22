import { NextRequest, NextResponse } from 'next/server';
import { fetchOfficialCalendar } from '@/lib/f1CalendarService';

/**
 * app/api/f1-calendar/route.ts
 * Cached API endpoint for the official F1 race calendar.
 * Fetches from Jolpica (Ergast successor) + OpenF1 APIs.
 * Cache: 6 hours with 24h stale-while-revalidate.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 21600; // 6 hours

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(
      searchParams.get('year') || String(new Date().getFullYear()),
      10,
    );

    // Validate year range
    if (year < 2024 || year > 2030) {
      return NextResponse.json(
        { error: 'Year must be between 2024 and 2030' },
        { status: 400 },
      );
    }

    const calendar = await fetchOfficialCalendar(year);

    return NextResponse.json(
      {
        season: year,
        total: calendar.length,
        source: 'jolpica+openf1',
        fetchedAt: new Date().toISOString(),
        races: calendar,
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=21600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[F1 Calendar API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch calendar',
        detail:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 },
    );
  }
}
