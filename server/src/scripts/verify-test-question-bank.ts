import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { QuestionModel } from '../modules/question/question.model.js';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { getAvailableQuizLengths } from '../shared/config/quiz-config.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✅ ${message}`);
}

async function runValidation() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codearena';
  console.log('====================================================');
  console.log('🧪 Validating Test Question Bank & Platform Rules');
  console.log('====================================================\n');
  
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.\n');

  try {
    // 1. Fetch Categories and Subjects
    const categories = await CategoryModel.find({}).lean();
    const subjects = await SubjectModel.find({}).lean();

    assert(categories.length === 3, 'Exactly 3 categories exist (Programming, Aptitude, General Knowledge)');
    assert(subjects.length === 19, 'Exactly 19 subjects exist across all categories');

    const catIdMap = new Map<string, any>(categories.map(c => [c._id.toString(), c]));
    const subjIdMap = new Map<string, any>(subjects.map(s => [s._id.toString(), s]));

    // 2. Fetch all seeded test questions (matching prefix 'test-')
    const testQuestions = await QuestionModel.find({ questionId: { $regex: /^test-/ } }).lean();
    console.log(`Found ${testQuestions.length} questions in the test question bank.\n`);
    assert(testQuestions.length === 190, 'Exactly 190 questions exist in the test question bank (19 subjects × 10)');

    // 3. Category Breakdown of Test Bank
    const catCounts = {
      programming: 0,
      aptitude: 0,
      'general-knowledge': 0,
    };

    const subjMap = new Map<string, typeof testQuestions>();
    for (const q of testQuestions) {
      assert(!!q.subjectId, `Question ${q.questionId} has subjectId`);
      assert(!!q.categoryId, `Question ${q.questionId} has categoryId`);
      const sId = q.subjectId!.toString();
      if (!subjMap.has(sId)) {
        subjMap.set(sId, []);
      }
      subjMap.get(sId)!.push(q);

      const cDoc = catIdMap.get(q.categoryId!.toString());
      assert(!!cDoc, `Question ${q.questionId} has valid categoryId`);
      if (cDoc.slug in catCounts) {
        catCounts[cDoc.slug as keyof typeof catCounts]++;
      }
    }

    console.log('--- CATEGORY BREAKDOWN IN TEST BANK ---');
    console.log(`Programming: ${catCounts.programming} (Target: 100)`);
    console.log(`Aptitude: ${catCounts.aptitude} (Target: 40)`);
    console.log(`General Knowledge: ${catCounts['general-knowledge']} (Target: 50)`);
    assert(catCounts.programming === 100, 'Programming has exactly 100 test questions (10 subjects × 10)');
    assert(catCounts.aptitude === 40, 'Aptitude has exactly 40 test questions (4 subjects × 10)');
    assert(catCounts['general-knowledge'] === 50, 'General Knowledge has exactly 50 test questions (5 subjects × 10)');

    // 4. Per-Subject Validation (Exactly 10 questions per subject, 3 Easy, 4 Medium, 3 Hard)
    console.log('\n--- PER-SUBJECT QUALITY & INTEGRITY VALIDATION ---');
    for (const subj of subjects) {
      const qList = subjMap.get(subj._id.toString()) || [];
      assert(qList.length === 10, `Subject "${subj.name}" (${subj.slug}) has exactly 10 test questions`);

      let easyCount = 0;
      let mediumCount = 0;
      let hardCount = 0;

      for (const q of qList) {
        // Required fields inspection
        assert(!!q.question && q.question.trim().length > 0, `Question ${q.questionId} has non-empty question text`);
        assert(Array.isArray(q.options) && q.options.length === 4, `Question ${q.questionId} has exactly 4 options`);
        for (let i = 0; i < 4; i++) {
          assert(typeof q.options[i] === 'string' && q.options[i].trim().length > 0, `Option ${i} in ${q.questionId} is non-empty`);
        }
        assert(typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3, `Question ${q.questionId} has valid correctAnswer (0..3)`);
        assert(!!q.explanation && q.explanation.trim().length > 0, `Question ${q.questionId} has non-empty explanation`);
        assert(q.isPublished === true, `Question ${q.questionId} is published`);
        assert(['easy', 'medium', 'hard'].includes(q.difficulty), `Question ${q.questionId} has valid difficulty`);

        // Check category relation matches subject's category
        assert(q.categoryId!.toString() === subj.categoryId.toString(), `Question ${q.questionId} category matches subject category`);

        if (q.difficulty === 'easy') easyCount++;
        if (q.difficulty === 'medium') mediumCount++;
        if (q.difficulty === 'hard') hardCount++;
      }

      assert(easyCount === 3, `Subject "${subj.name}" has exactly 3 Easy questions`);
      assert(mediumCount === 4, `Subject "${subj.name}" has exactly 4 Medium questions`);
      assert(hardCount === 3, `Subject "${subj.name}" has exactly 3 Hard questions`);
    }

    // 5. Total Published Questions in Database per Subject (Total in DB >= 10 for ALL subjects)
    console.log('\n--- VERIFYING ALL 19 SUBJECTS HAVE >= 10 PUBLISHED QUESTIONS IN DB ---');
    for (const subj of subjects) {
      const totalCount = await QuestionModel.countDocuments({ subjectId: subj._id, isPublished: true });
      assert(totalCount >= 10, `Subject "${subj.name}" has at least 10 published questions (Total: ${totalCount})`);
    }

    // 6. Test Quiz Availability Logic (10, 15, 20 questions)
    console.log('\n--- VERIFYING QUIZ LENGTH AVAILABILITY LOGIC ---');
    for (const subj of subjects) {
      const totalCount = await QuestionModel.countDocuments({ subjectId: subj._id, isPublished: true });
      const availableLengths = getAvailableQuizLengths(totalCount);

      // 10-question quiz must ALWAYS be available since count >= 10
      assert(availableLengths.includes(10), `10-question quiz is available for "${subj.name}" (Count: ${totalCount})`);

      if (totalCount === 10) {
        assert(!availableLengths.includes(15), `15-question quiz is unavailable for "${subj.name}" with 10 questions`);
        assert(!availableLengths.includes(20), `20-question quiz is unavailable for "${subj.name}" with 10 questions`);
      } else if (totalCount >= 20) {
        assert(availableLengths.includes(15), `15-question quiz is available for "${subj.name}" with ${totalCount} questions`);
        assert(availableLengths.includes(20), `20-question quiz is available for "${subj.name}" with ${totalCount} questions`);
      }
    }

    // 7. Verify Mixed Category Mode Available Lengths
    console.log('\n--- VERIFYING MIXED CATEGORY AVAILABILITY ---');
    for (const cat of categories) {
      const catCount = await QuestionModel.countDocuments({ categoryId: cat._id, isPublished: true });
      const catLengths = getAvailableQuizLengths(catCount);
      console.log(`  * Category "${cat.name}" has ${catCount} total published questions -> Available lengths: [${catLengths.join(', ')}]`);
      assert(catLengths.includes(10), `Mixed category "${cat.name}" supports 10 questions`);
      assert(catCount >= 20 ? catLengths.includes(20) : true, `Mixed category length check passed`);
    }

    // 8. Category Service Hierarchy Check
    console.log('\n--- VERIFYING CATEGORY SERVICE HIERARCHY ---');
    const allCategories = await categoryService.getAllCategories();
    assert(allCategories.length === 3, 'categoryService returns all 3 categories');
    for (const cat of allCategories) {
      assert(cat.isPlayable === true, `Category "${cat.name}" is playable (total questions >= 10)`);
      const { subjects: catSubjects } = await categoryService.getSubjectsForCategory(cat.slug);
      for (const subj of catSubjects) {
        assert(subj.questionCount >= 10, `Hierarchy reported count for ${subj.name} is >= 10 (${subj.questionCount})`);
        assert(subj.availableLengths.includes(10), `Hierarchy reports 10-question quiz available for ${subj.name}`);
        assert(subj.isPlayable === true, `Subject ${subj.name} is marked isPlayable`);
      }
    }

    console.log('\n====================================================');
    console.log('🎉 ALL TEST QUESTION BANK VERIFICATIONS PASSED!');
    console.log('====================================================\n');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runValidation().catch((err) => {
  console.error('Validation script failed:', err);
  process.exit(1);
});
