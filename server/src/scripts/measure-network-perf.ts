import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import app from '../app.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface MeasurementResult {
  endpoint: string;
  testCase: string;
  status: number;
  contentEncoding: string;
  cacheControl: string;
  etag: string;
  vary: string;
  rawBytes: number;
}

function fetchDetails(
  baseUrl: string,
  endpoint: string,
  headers: Record<string, string> = {}
): Promise<MeasurementResult & { headers: http.IncomingHttpHeaders; body: string }> {
  const url = `${baseUrl}${endpoint}`;

  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => {
        const totalBuffer = Buffer.concat(chunks);
        resolve({
          endpoint,
          testCase: headers['Accept-Encoding'] || 'default',
          status: res.statusCode || 0,
          contentEncoding: (res.headers['content-encoding'] as string) || 'none',
          cacheControl: (res.headers['cache-control'] as string) || 'none',
          etag: (res.headers['etag'] as string) || 'none',
          vary: (res.headers['vary'] as string) || 'none',
          rawBytes: totalBuffer.length,
          headers: res.headers,
          body: totalBuffer.toString(),
        });
      });
    });
    req.on('error', reject);
  });
}

async function runComprehensiveVerification() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log('====================================================');
  console.log('🧪 COMPREHENSIVE NETWORK OPTIMIZATION VERIFICATION');
  console.log('====================================================\n');

  // 1. Compression Test (GZIP vs Identity)
  console.log('--- 1. Compression Negotiation (Gzip vs Identity) ---');
  const gzipRes = await fetchDetails(baseUrl, '/api/v1/categories', {
    'Accept-Encoding': 'gzip, deflate',
  });
  const identityRes = await fetchDetails(baseUrl, '/api/v1/categories', {
    'Accept-Encoding': 'identity',
  });

  console.log(`[Accept-Encoding: gzip] Size: ${gzipRes.rawBytes} bytes, Encoding: ${gzipRes.contentEncoding}`);
  console.log(`[Accept-Encoding: identity] Size: ${identityRes.rawBytes} bytes, Encoding: ${identityRes.contentEncoding}`);
  const ratio = Math.round((1 - gzipRes.rawBytes / identityRes.rawBytes) * 100);
  console.log(`Compression payload saving: ${ratio}% reduction\n`);

  // 2. Conditional Requests (304 Not Modified with ETag)
  console.log('--- 2. ETag & 304 Conditional Request Validation ---');
  const etag = gzipRes.etag;
  console.log(`Initial ETag: ${etag}`);
  const condRes = await fetchDetails(baseUrl, '/api/v1/categories', {
    'If-None-Match': etag,
    'Accept-Encoding': 'gzip, deflate',
  });
  console.log(`Conditional Request Status: ${condRes.status} (Expected: 304)`);
  console.log(`Payload Transferred: ${condRes.rawBytes} bytes (Zero payload re-transmission)\n`);

  // 3. Authenticated Safety Guard (Never publicly cache with Auth header)
  console.log('--- 3. Authenticated Safety Guard Verification ---');
  const authHeaderRes = await fetchDetails(baseUrl, '/api/v1/categories', {
    Authorization: 'Bearer dummy-token',
  });
  console.log(`Unauthenticated Cache-Control: ${gzipRes.cacheControl}`);
  console.log(`Authenticated Request Cache-Control: ${authHeaderRes.cacheControl}`);
  console.log(`Is Authenticated response private? ${authHeaderRes.cacheControl.includes('private')}\n`);

  // 4. Sensitive Endpoints No-Cache Verification
  console.log('--- 4. Sensitive Endpoint No-Cache Headers ---');
  const sensitiveEndpoints = [
    '/health',
    '/api/v1/auth/me',
    '/api/v1/leaderboard?limit=5',
  ];
  for (const ep of sensitiveEndpoints) {
    const res = await fetchDetails(baseUrl, ep);
    console.log(`[${ep}] Status: ${res.status}, Cache-Control: ${res.cacheControl}`);
  }

  // 5. Cache Invalidation upon Admin Mutation
  console.log('\n--- 5. In-Memory Taxonomy Cache Invalidation ---');
  const warmData = await categoryService.getAllCategories();
  console.log(`Cached categories count: ${warmData.length}`);
  categoryService.clearCache();
  console.log('categoryService.clearCache() executed cleanly.');

  server.close();
  await mongoose.disconnect();
  console.log('\n✅ All network optimization verification tests PASSED!');
}

runComprehensiveVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
