import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Connection } from '@solana/web3.js';

/**
 * Health Check Endpoint
 *
 * Verifies service health and external dependencies
 * Used for monitoring, uptime checks, and deployment verification
 *
 * GET /api/health - Returns health status
 */
export async function GET(request: NextRequest) {
  const timestamp = Date.now();
  const checks: Record<string, { status: 'healthy' | 'degraded' | 'unhealthy'; latency?: number; error?: string }> = {};

  try {
    // 1. Database Health Check (Supabase)
    const dbStart = Date.now();
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Simple query to verify connection
      const { error } = await supabase.from('merchants').select('id').limit(1);

      if (error) {
        checks.database = {
          status: 'unhealthy',
          error: 'Query failed',
          latency: Date.now() - dbStart
        };
      } else {
        checks.database = {
          status: 'healthy',
          latency: Date.now() - dbStart
        };
      }
    } catch (error) {
      checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - dbStart
      };
    }

    // 2. Solana RPC Health Check
    const rpcStart = Date.now();
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com'
      );

      const blockHeight = await connection.getBlockHeight();

      if (blockHeight > 0) {
        checks.solana_rpc = {
          status: 'healthy',
          latency: Date.now() - rpcStart
        };
      } else {
        checks.solana_rpc = {
          status: 'degraded',
          error: 'Invalid block height',
          latency: Date.now() - rpcStart
        };
      }
    } catch (error) {
      checks.solana_rpc = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - rpcStart
      };
    }

    // 3. Environment Variables Check
    const requiredEnvVars = [
      'NEXT_PUBLIC_SOLANA_NETWORK',
      'NEXT_PUBLIC_NFT_PROGRAM_ID',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_PRIVY_APP_ID',
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingEnvVars.length === 0) {
      checks.environment = { status: 'healthy' };
    } else {
      checks.environment = {
        status: 'unhealthy',
        error: `Missing: ${missingEnvVars.join(', ')}`
      };
    }

    // Determine overall status
    const hasUnhealthy = Object.values(checks).some(check => check.status === 'unhealthy');
    const hasDegraded = Object.values(checks).some(check => check.status === 'degraded');

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (hasUnhealthy) {
      overallStatus = 'unhealthy';
    } else if (hasDegraded) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    // Return appropriate HTTP status code
    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json({
      status: overallStatus,
      timestamp,
      uptime: process.uptime(),
      checks,
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'unknown',
    }, { status: statusCode });

  } catch (error) {
    // Catastrophic failure
    return NextResponse.json({
      status: 'unhealthy',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
      checks,
    }, { status: 503 });
  }
}

/**
 * Readiness Check Endpoint (alias for health)
 *
 * HEAD /api/health - Lightweight health check (no body)
 */
export async function HEAD(request: NextRequest) {
  try {
    // Minimal check - just verify service is running
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
