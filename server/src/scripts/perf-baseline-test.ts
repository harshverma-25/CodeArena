import mongoose, { Types } from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { BattleModel } from '../modules/battle/battle.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runBenchmark() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  console.log('====================================================');
  console.log('📊 DATABASE QUERY PERFORMANCE & INDEX BENCHMARK');
  console.log('====================================================\n');

  await BattleModel.syncIndexes();
  const battleIndexes = await BattleModel.collection.indexes();
  console.log('Battle Collection Indexes:', battleIndexes.map(idx => idx.name));

  // Find a sample user with battle records or any user
  const sampleBattle = await BattleModel.findOne({ 'players.userId': { $exists: true } });
  const sampleUserId = sampleBattle?.players?.[0]?.userId || new Types.ObjectId();
  console.log('Sample User ID for History Query:', sampleUserId.toString());

  // -------------------------------------------------------------------------
  // 1. MATCH HISTORY QUERY PLAN EXPLAIN
  // -------------------------------------------------------------------------
  console.log('\n--- 1. Match History Query Plan (explain) ---');
  const historyExplain: any = await BattleModel.find({ 'players.userId': sampleUserId })
    .sort({ startedAt: -1, createdAt: -1 })
    .limit(10)
    .explain('executionStats');

  const winningPlan = historyExplain.queryPlanner?.winningPlan;
  const executionStats = historyExplain.executionStats;

  console.log('Winning Plan Stage:', winningPlan?.stage || winningPlan?.inputStage?.stage);
  console.log('Has In-Memory SORT Stage:', JSON.stringify(winningPlan).includes('"SORT"'));
  console.log('Full Winning Plan:', JSON.stringify(winningPlan, null, 2));
  console.log('Total Docs Examined:', executionStats?.totalDocsExamined);
  console.log('Execution Time (ms):', executionStats?.executionTimeMillis);

  // -------------------------------------------------------------------------
  // 2. LEADERBOARD INDEX PLAN EXPLAIN (Inequality vs Equality)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Leaderboard Query Plan (explain) ---');
  const lbNeExplain: any = await UserModel.find({ isGuest: { $ne: true } })
    .sort({ wins: -1, accuracy: -1, matchesPlayed: -1, username: 1 })
    .limit(10)
    .explain('executionStats');

  const lbEqExplain: any = await UserModel.find({ isGuest: false })
    .sort({ wins: -1, accuracy: -1, matchesPlayed: -1, username: 1 })
    .limit(10)
    .explain('executionStats');

  console.log('[isGuest: { $ne: true }] Index Name:', lbNeExplain.queryPlanner?.winningPlan?.inputStage?.indexName || 'NONE');
  console.log('[isGuest: { $ne: true }] Keys Examined:', lbNeExplain.executionStats?.totalKeysExamined);
  console.log('[isGuest: false] Index Name:', lbEqExplain.queryPlanner?.winningPlan?.inputStage?.indexName || 'NONE');
  console.log('[isGuest: false] Keys Examined:', lbEqExplain.executionStats?.totalKeysExamined);

  // -------------------------------------------------------------------------
  // 3. CATEGORY & SUBJECT ENDPOINTS TIMING & QUERY COUNT
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // 3. CATEGORY & SUBJECT ENDPOINTS TIMING (COLD vs WARM)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Category & Subject Endpoints Timing ---');
  categoryService.clearCache();
  const startAllCatsCold = performance.now();
  const allCatsCold = await categoryService.getAllCategories();
  const durAllCatsCold = performance.now() - startAllCatsCold;

  const startAllCatsWarm = performance.now();
  const allCatsWarm = await categoryService.getAllCategories();
  const durAllCatsWarm = performance.now() - startAllCatsWarm;
  console.log(`getAllCategories() Cold: ${durAllCatsCold.toFixed(2)}ms (Count: ${allCatsCold.length})`);
  console.log(`getAllCategories() Warm (Cache Hit): ${durAllCatsWarm.toFixed(2)}ms (Count: ${allCatsWarm.length})`);

  const startSubjectsCold = performance.now();
  const subjectsDataCold = await categoryService.getSubjectsForCategory('programming');
  const durSubjectsCold = performance.now() - startSubjectsCold;

  const startSubjectsWarm = performance.now();
  const subjectsDataWarm = await categoryService.getSubjectsForCategory('programming');
  const durSubjectsWarm = performance.now() - startSubjectsWarm;
  console.log(`getSubjectsForCategory('programming') Cold: ${durSubjectsCold.toFixed(2)}ms (Category: ${subjectsDataCold.category.name}, Subjects: ${subjectsDataCold.subjects.length})`);
  console.log(`getSubjectsForCategory('programming') Warm (Cache Hit): ${durSubjectsWarm.toFixed(2)}ms (Category: ${subjectsDataWarm.category.name}, Subjects: ${subjectsDataWarm.subjects.length})`);

  // -------------------------------------------------------------------------
  // 4. POPULAR QUIZZES TIMING (COLD vs WARM)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Popular Quizzes Aggregation Timing ---');
  categoryService.clearCache();
  const startPopCold = performance.now();
  const popularCold = await categoryService.getPopularQuizzes(5);
  const durPopCold = performance.now() - startPopCold;

  const startPopWarm = performance.now();
  const popularWarm = await categoryService.getPopularQuizzes(5);
  const durPopWarm = performance.now() - startPopWarm;
  console.log(`getPopularQuizzes(5) Cold: ${durPopCold.toFixed(2)}ms (Count: ${popularCold.length})`);
  console.log(`getPopularQuizzes(5) Warm (Cache Hit): ${durPopWarm.toFixed(2)}ms (Count: ${popularWarm.length})`);

  await mongoose.disconnect();
}

runBenchmark().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
