import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { getAvailableQuizLengths } from '../shared/config/quiz-config.js';
import { categoryService } from '../modules/category/category.service.js';
import { categoryRepository } from '../modules/category/category.repository.js';
import { questionRepository } from '../modules/question/question.repository.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { seedCategoriesAndMigrateQuestions, MASTER_CATEGORIES, MASTER_SUBJECTS } from './seed-categories.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✅ ${message}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Question Bank & Availability Verifications');
  console.log('====================================================\n');

  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/codearena';

  try {
    if (primaryUri) {
      await mongoose.connect(primaryUri);
    } else {
      await mongoose.connect(localUri);
    }
  } catch {
    await mongoose.connect(localUri);
  }

  // Ensure categories and subjects exist
  await seedCategoriesAndMigrateQuestions();

  const progCategory = await categoryRepository.findCategoryByIdOrSlug('programming');
  const dsaSubject = await categoryRepository.findSubjectByIdOrSlug('dsa');
  assert(!!progCategory && !!dsaSubject, 'Database initialized with core categories and subjects');

  // --- UNIT/HELPER AVAILABILITY TESTS (TEST 1 - 7) ---
  console.log('\n▶️ Testing Question Availability Derivation Rules (TEST 1 - 7)...');

  // TEST 1: 0 questions -> []
  const lengths0 = getAvailableQuizLengths(0);
  assert(lengths0.length === 0, 'TEST 1: 0 questions -> 10/15/20 all unavailable');

  // TEST 2: 6 questions -> []
  const lengths6 = getAvailableQuizLengths(6);
  assert(lengths6.length === 0, 'TEST 2: 6 questions -> 10/15/20 all unavailable');

  // TEST 3: 10 questions -> [10]
  const lengths10 = getAvailableQuizLengths(10);
  assert(
    lengths10.length === 1 && lengths10[0] === 10,
    'TEST 3: 10 questions -> 10 available, 15/20 unavailable'
  );

  // TEST 4: 15 questions -> [10, 15]
  const lengths15 = getAvailableQuizLengths(15);
  assert(
    lengths15.length === 2 && lengths15.includes(10) && lengths15.includes(15) && !lengths15.includes(20),
    'TEST 4: 15 questions -> 10/15 available, 20 unavailable'
  );

  // TEST 5: 20 questions -> [10, 15, 20]
  const lengths20 = getAvailableQuizLengths(20);
  assert(
    lengths20.length === 3 && lengths20.includes(10) && lengths20.includes(15) && lengths20.includes(20),
    'TEST 5: 20 questions -> 10/15/20 all available'
  );

  // TEST 6: 25 questions -> [10, 15, 20]
  const lengths25 = getAvailableQuizLengths(25);
  assert(
    lengths25.length === 3 && lengths25.includes(10) && lengths25.includes(15) && lengths25.includes(20),
    'TEST 6: 25 questions -> 10/15/20 all available'
  );

  // TEST 7: Mixed category total = 18 -> 10/15 available, 20 unavailable
  const lengths18 = getAvailableQuizLengths(18);
  assert(
    lengths18.length === 2 && lengths18.includes(10) && lengths18.includes(15) && !lengths18.includes(20),
    'TEST 7: Mixed category total = 18 -> 10/15 available, 20 unavailable'
  );

  // --- DATABASE-BACKED VERIFICATIONS (TEST 8 - 12) ---
  console.log('\n▶️ Setting up isolated test fixtures in DB for integration tests (TEST 8 - 12)...');

  // Create unique dummy test user
  const testUser = await UserModel.create({
    username: `avail_test_${Date.now()}`,
    displayName: 'Availability Tester',
    email: `avail_${Date.now()}@test.com`,
    passwordHash: 'dummyhash',
  });

  const TEST_PREFIX = `avail_test_${Date.now()}`;

  // Helper to insert test questions
  async function insertTestQuestions(count: number, subjectSlug: string, isPublished: boolean = true, startIndex: number = 0) {
    const subj = await categoryRepository.findSubjectByIdOrSlug(subjectSlug);
    const cat = await categoryRepository.findCategoryByIdOrSlug(subj!.categoryId.toString());
    const docs = [];
    for (let i = 0; i < count; i++) {
      docs.push({
        questionId: `${TEST_PREFIX}_${subjectSlug}_${startIndex + i}`,
        categoryId: cat!._id,
        subjectId: subj!._id,
        topic: subj!.name,
        difficulty: 'medium',
        question: `Test Question ${startIndex + i} for ${subjectSlug}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'Test explanation',
        isPublished,
      });
    }
    await QuestionModel.insertMany(docs);
  }

  // Clean any leftover test fixtures from prior runs
  await QuestionModel.deleteMany({ questionId: { $regex: '^avail_test_' } });

  // Insert 6 questions for 'operating-systems'
  await insertTestQuestions(6, 'operating-systems', true, 0);

  // Insert 4 unpublished questions for 'operating-systems' (TEST 9 check)
  await insertTestQuestions(4, 'operating-systems', false, 100);

  // TEST 9: Published=false questions -> not counted
  const osPublishedCount = await questionRepository.countMatchingQuestions({
    subjectId: 'operating-systems',
  });
  assert(
    osPublishedCount === 6,
    `TEST 9: Published=false questions are not counted (found ${osPublishedCount}, expected 6)`
  );

  // TEST 8: Request unavailable question count through API / roomService -> server rejects request
  let rejectedError = null;
  try {
    await roomService.createRoom(testUser._id.toString(), {
      subjectId: 'operating-systems',
      questionCount: 10,
    });
  } catch (err: any) {
    rejectedError = err;
  }
  assert(
    !!rejectedError && rejectedError.statusCode === 400 && rejectedError.message.includes('has only 6 questions'),
    `TEST 8: Room creation rejected with 400 & clear message: "${rejectedError?.message}"`
  );

  // TEST 8b: Solo quiz creation also rejected with 400
  let soloRejectedError = null;
  try {
    await roomService.createSoloQuiz(testUser._id.toString(), {
      subjectId: 'operating-systems',
      questionCount: 10,
    });
  } catch (err: any) {
    soloRejectedError = err;
  }
  assert(
    !!soloRejectedError && soloRejectedError.statusCode === 400,
    `TEST 8b: Solo quiz creation rejected with 400 when questions insufficient`
  );

  // Insert additional 9 questions into 'operating-systems' to make total 15
  await insertTestQuestions(9, 'operating-systems', true, 200);
  const osNowCount = await questionRepository.countMatchingQuestions({
    subjectId: 'operating-systems',
  });
  assert(osNowCount === 15, `Operating systems now has 15 published questions`);

  // Room with 10 questions should now succeed
  const validRoom = await roomService.createRoom(testUser._id.toString(), {
    subjectId: 'operating-systems',
    questionCount: 10,
  });
  assert(!!validRoom && validRoom.settings.questionCount === 10, 'Room successfully created with 10 questions when 15 available');

  // But updating or creating room with 20 questions should be rejected
  let reject20Error = null;
  try {
    await roomService.updateSettings(testUser._id.toString(), validRoom.roomCode, {
      questionCount: 20,
    });
  } catch (err: any) {
    reject20Error = err;
  }
  assert(
    !!reject20Error && reject20Error.statusCode === 400,
    `TEST 8c: Updating settings to 20 questions rejected with 400 when only 15 available`
  );

  // TEST 10: Question sampling -> exact requested count, no duplicates
  // Start battle in validRoom (10 questions)
  const battle = await battleService.startBattle(testUser._id.toString(), validRoom.roomCode);
  const player = battle.players[0];
  const qIds = player.assignedQuestionIds;
  assert(
    qIds.length === 10,
    `TEST 10a: Question sampling returned exact requested count of 10 (actual: ${qIds.length})`
  );
  const uniqueQIds = new Set(qIds);
  assert(
    uniqueQIds.size === 10,
    `TEST 10b: All sampled questions are unique (unique count: ${uniqueQIds.size})`
  );

  // TEST 11: Category mismatch -> questions from unrelated category are not selected
  // Insert questions into 'general-knowledge' category ('science' subject)
  await insertTestQuestions(10, 'science', true, 300);
  const sampledProgQuestions = await questionRepository.sampleRandomPublished(
    { categoryId: 'programming', isMixedCategory: true },
    undefined,
    10
  );
  const progCatDoc = await categoryRepository.findCategoryByIdOrSlug('programming');
  const allBelongToProg = sampledProgQuestions.every(
    (q) => q.categoryId?.toString() === progCatDoc!._id.toString()
  );
  assert(
    allBelongToProg,
    'TEST 11: Category mismatch isolation: Programming query returns only Programming questions, never General Knowledge'
  );

  // TEST 12: Subject mismatch -> questions from unrelated subject are not selected
  const sampledOsQuestions = await questionRepository.sampleRandomPublished(
    { subjectId: 'operating-systems' },
    undefined,
    10
  );
  const osSubjDoc = await categoryRepository.findSubjectByIdOrSlug('operating-systems');
  const allBelongToOs = sampledOsQuestions.every(
    (q) => q.subjectId?.toString() === osSubjDoc!._id.toString()
  );
  assert(
    allBelongToOs,
    'TEST 12: Subject mismatch isolation: OS query returns strictly OS questions, never DSA or other subjects'
  );

  // Clean up test fixtures
  console.log('\n🧹 Cleaning up test fixtures...');
  await QuestionModel.deleteMany({ questionId: { $regex: `^${TEST_PREFIX}` } });
  await RoomModel.deleteMany({ roomCode: validRoom.roomCode });
  await BattleModel.deleteMany({ _id: battle._id });
  await UserModel.deleteOne({ _id: testUser._id });
  console.log('✅ Test fixtures cleaned up successfully.');

  // --- PRODUCTION SEED AUDIT (SECTION 18) ---
  console.log('\n====================================================');
  console.log('📊 SECTION 18: ACTUAL CURRENT PRODUCTION SEED AUDIT');
  console.log('====================================================\n');

  const categoriesRes = await categoryService.getAllCategories();
  console.log('| Category | Subject | Published Questions | 10 Qs | 15 Qs | 20 Qs |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- |');

  for (const cat of categoriesRes) {
    const subjsRes = await categoryService.getSubjectsForCategory(cat.slug);

    // Print Category Mixed Pool row
    const catLengths = cat.availableLengths || [];
    console.log(
      `| **${cat.name} (Mixed)** | *All Subjects Pool* | **${cat.questionCount}** | ${
        catLengths.includes(10) ? '✅' : '❌'
      } | ${catLengths.includes(15) ? '✅' : '❌'} | ${catLengths.includes(20) ? '✅' : '❌'} |`
    );

    for (const subj of subjsRes.subjects) {
      const sLengths = subj.availableLengths || [];
      console.log(
        `| ${cat.name} | ${subj.name} | ${subj.questionCount} | ${
          sLengths.includes(10) ? '✅' : '❌'
        } | ${sLengths.includes(15) ? '✅' : '❌'} | ${sLengths.includes(20) ? '✅' : '❌'} |`
      );
    }
  }

  console.log('\n🎉 ALL 12 TEST CASES AND PRODUCTION SEED AUDIT COMPLETED SUCCESSFULLY!\n');
}

runTests()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Verification script failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  });
