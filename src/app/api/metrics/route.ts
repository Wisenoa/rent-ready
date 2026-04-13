import { NextResponse } from 'next/server';
import { register } from '@/lib/metrics';

// ─────────────────────────────────────────────
// GET /api/metrics — Prometheus-compatible endpoint
// ─────────────────────────────────────────────

export async function GET() {
  try {
    const contentType = await register.contentType;
    const body = await register.metrics();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to collect metrics' },
      { status: 500 }
    );
  }
}
