/**
 * Setup API - Status Check
 *
 * GET /api/setup/status
 * Returns current configuration status
 */

import { NextResponse } from 'next/server';
import { getConfigurationStatus } from '@/lib/config/secure-store';

export async function GET() {
  try {
    const status = getConfigurationStatus();

    return NextResponse.json({
      data: status,
    });
  } catch (error) {
    console.error('Status check error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check configuration status',
        },
      },
      { status: 500 }
    );
  }
}
