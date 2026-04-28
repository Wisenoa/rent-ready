import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ========================================
// Health Check Endpoint
// ========================================

export async function GET(request: NextRequest) {
  // Only expose full health details to authenticated requests or same-host callers.
  // Public health checks get a minimal response to avoid leaking infrastructure details.
  const authHeader = request.headers.get('authorization');
  const host = request.headers.get('host') ?? '';
  const isInternal = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
  const isAuthenticated = !!authHeader && authHeader.startsWith('Bearer ');

  const isExtended = isInternal || isAuthenticated;

  const health: Record<string, unknown> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
  };

  if (isExtended) {
    health.environment = process.env.NODE_ENV || 'development';
    health.checks = {
      database: await checkDatabase(),
      redis: await checkRedis(),
      storage: await checkStorage(),
    };
  }

  const checksHealthy = !health.checks || Object.values((health.checks as Record<string, {status: string}>)).every(c => c.status === 'healthy');
  const statusCode = checksHealthy ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}

// ========================================
// Health Check Functions
// ========================================

async function checkDatabase(): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    // Use shared Prisma singleton — never create a new client per request
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkRedis(): Promise<{ status: string; latency?: number; error?: string }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    return { status: 'not_configured' };
  }

  try {
    const start = Date.now();

    // Dynamically import to avoid build errors if package not installed
    const { Redis } = await import("@upstash/redis");
    const client = new Redis({ url: upstashUrl, token: upstashToken });

    await client.ping();

    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Upstash Redis unreachable'
    };
  }
}

async function checkStorage(): Promise<{ status: string; error?: string }> {
  if (!process.env.MINIO_ENDPOINT) {
    return { status: 'not_configured' };
  }

  try {
    // Dynamically import to avoid build errors if package not installed
    const { Client: MinioClient } = await import("minio");
    const minioClient = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
    });

    const bucket = process.env.MINIO_BUCKET || 'rent-ready-docs';
    const exists = await minioClient.bucketExists(bucket);
    
    return { status: exists ? 'healthy' : 'not_configured' };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'MinIO package not installed' 
    };
  }
}