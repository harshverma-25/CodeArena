import { cacheService } from '../shared/cache/cache.service';
import { categoryService } from '../modules/category/category.service';
import { isUpstashConfigured } from '../config/redis';

async function runTests() {
  console.log('=== Upstash Redis & Cache Fallback Test Suite ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Initial configuration check
  console.log(`1. Configuration check: isUpstashConfigured() = ${isUpstashConfigured()}`);
  assert(typeof isUpstashConfigured() === 'boolean', 'isUpstashConfigured returns a boolean without throwing');

  // 2. Cache Miss followed by Cache Hit (using getOrSet)
  console.log('\n2. Testing Cache Miss -> DB Query -> Cache Hit');
  let queryCount = 0;
  const mockDbQuery = async () => {
    queryCount++;
    return { id: 'cat-1', name: 'Science', subjects: ['Physics', 'Chemistry'] };
  };

  const testKey = 'test:categories:science';
  // Clear any existing
  await cacheService.del(testKey);

  // First call -> Cache Miss -> invokes mockDbQuery
  const res1 = await cacheService.getOrSet(testKey, 10, mockDbQuery);
  assert(queryCount === 1, 'First call triggered DB query on cache miss');
  assert(res1.name === 'Science', 'Response shape is preserved on cache miss');

  // Second call -> Cache Hit -> does NOT invoke mockDbQuery
  const res2 = await cacheService.getOrSet(testKey, 10, mockDbQuery);
  assert(queryCount === 1, 'Second call retrieved cached value and skipped DB query');
  assert(res2.name === 'Science', 'Response shape is identical on cache hit');

  // 3. Cache Invalidation
  console.log('\n3. Testing Cache Invalidation');
  await cacheService.del(testKey);
  const res3 = await cacheService.getOrSet(testKey, 10, mockDbQuery);
  assert(queryCount === 2, 'Query was executed again after explicit key invalidation');

  // 4. Prefix Invalidation
  console.log('\n4. Testing Prefix Invalidation');
  const prefixKey1 = 'categories:test1';
  const prefixKey2 = 'categories:test2';
  const otherKey = 'popular:test1';

  await cacheService.set(prefixKey1, { data: 1 }, 10);
  await cacheService.set(prefixKey2, { data: 2 }, 10);
  await cacheService.set(otherKey, { data: 3 }, 10);

  await cacheService.delByPrefix('categories:');

  const afterDel1 = await cacheService.get(prefixKey1);
  const afterDel2 = await cacheService.get(prefixKey2);
  const afterOther = await cacheService.get(otherKey);

  assert(afterDel1 === null, 'categories:test1 was removed by delByPrefix');
  assert(afterDel2 === null, 'categories:test2 was removed by delByPrefix');
  assert(afterOther !== null, 'popular:test1 was unaffected by categories: prefix deletion');
  await cacheService.del(otherKey);

  // 5. TTL Expiration Check
  console.log('\n5. Testing TTL Expiration (1-second TTL)');
  const expiringKey = 'test:expiring:item';
  let expireQueryCount = 0;
  const expireFetcher = async () => {
    expireQueryCount++;
    return { timestamp: Date.now() };
  };

  await cacheService.getOrSet(expiringKey, 1, expireFetcher); // 1s TTL
  assert(expireQueryCount === 1, 'Initial query executed');

  await cacheService.getOrSet(expiringKey, 1, expireFetcher);
  assert(expireQueryCount === 1, 'Immediate second call hit cache');

  // Wait 1.1s for expiration
  await new Promise((resolve) => setTimeout(resolve, 1100));

  await cacheService.getOrSet(expiringKey, 1, expireFetcher);
  assert(expireQueryCount === 2, 'Query executed again after TTL expiration');

  // 6. Resilient Error Handling (fetching failure should NOT cache rejected value)
  console.log('\n6. Testing Error & Corrupted Data Handling');
  const errorKey = 'test:error:key';
  let shouldFail = true;
  const failingFetcher = async () => {
    if (shouldFail) {
      throw new Error('Database connection failed');
    }
    return { status: 'recovered' };
  };

  try {
    await cacheService.getOrSet(errorKey, 10, failingFetcher);
    assert(false, 'Should have thrown on DB error');
  } catch (err: any) {
    assert(err.message === 'Database connection failed', 'DB error propagated without crashing server');
  }

  // Verify that nothing invalid was cached
  const cachedVal = await cacheService.get(errorKey);
  assert(cachedVal === null, 'Failed promise was NOT cached');

  // Now when fetcher succeeds, it should work
  shouldFail = false;
  const recoveredRes = await cacheService.getOrSet(errorKey, 10, failingFetcher);
  assert(recoveredRes.status === 'recovered', 'Subsequent successful query works and can be cached');

  // 7. CategoryService integration & clearCache invalidation
  console.log('\n7. Testing CategoryService clearCache behavior');
  assert(typeof categoryService.clearCache === 'function', 'categoryService.clearCache is defined');
  // clearCache should run without throwing in any environment
  await categoryService.clearCache();
  assert(true, 'categoryService.clearCache completed cleanly');

  // Summary
  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
