import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ========================================
// Health Check Endpoint
// ========================================

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      storage: await checkStorage(),
    },
  };

  const isHealthy = Object.values(health.checks).every(c => c.status === 'healthy');
  const statusCode = isHealthy ? 200 : 503;

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
  if (!process.env.REDIS_URL) {
    return { status: 'not_configured' };
  }

  try {
    const start = Date.now();

    // Dynamically import to avoid build errors if package not installed
    const { createClient } = await import("redis");
    const client = createClient({ url: process.env.REDIS_URL });
    
    await client.connect();
    await client.ping();
    await client.disconnect();
    
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Redis package not installed' 
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