/**
 * Setup API - Test Connection
 *
 * POST /api/setup/test-connection
 * Tests Supabase connection with provided credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  SupabaseConfigSchema,
  testSupabaseConnection,
  validateSupabaseKeys,
  SETUP_ERROR_MESSAGES,
} from '@/lib/config/secure-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input schema
    const parseResult = SupabaseConfigSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid configuration format',
            details: parseResult.error.issues.map((e) => ({
              field: e.path.map(String).join('.'),
              message: e.message,
            })),
          },
        },
        { status: 400 }
      );
    }

    const config = parseResult.data;

    // Validate key formats
    const keyValidation = validateSupabaseKeys(config);
    if (!keyValidation.valid) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_KEYS',
            message: 'Invalid Supabase keys format',
            details: keyValidation.errors.map(err => ({ message: err })),
          },
        },
        { status: 400 }
      );
    }

    // Test actual connection
    const connectionResult = await testSupabaseConnection(config);

    if (!connectionResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'CONNECTION_FAILED',
            message: connectionResult.error || SETUP_ERROR_MESSAGES.CONNECTION_FAILED,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: {
        success: true,
        message: 'Connection successful! Supabase is properly configured.',
      },
    });
  } catch (error) {
    console.error('Connection test error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to test connection',
        },
      },
      { status: 500 }
    );
  }
}
