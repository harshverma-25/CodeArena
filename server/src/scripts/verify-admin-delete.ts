import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { adminService } from '../modules/admin/admin.service.js';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runAdminDeleteVerification() {
  console.log('====================================================');
  console.log('🧪 Admin Panel: Category & Quiz Delete Verification');
  console.log('====================================================\n');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  try {
    const timestamp = Date.now();
    const testCatSlug = `test-cat-${timestamp}`;
    const testSubSlug = `test-quiz-${timestamp}`;

    // 1. Create a Test Category
    console.log('▶️ Step 1: Create Category');
    const category = await adminService.createCategory({
      name: `Delete Test Category ${timestamp}`,
      slug: testCatSlug,
      description: 'Temporary category for delete testing',
    });
    console.log(`  Category created: ${category.name} (${category.slug}) ✅`);

    // 2. Create a Test Subject (Quiz)
    console.log('▶️ Step 2: Create Quiz (Subject)');
    const subject = await adminService.createSubject({
      categoryId: category._id.toString(),
      name: `Delete Test Quiz ${timestamp}`,
      slug: testSubSlug,
      description: 'Temporary quiz for delete testing',
    });
    console.log(`  Quiz created: ${subject.name} (${subject.slug}) ✅`);

    // 3. Create 2 Test Questions under this Quiz
    console.log('▶️ Step 3: Insert Test Questions');
    const q1 = await QuestionModel.create({
      questionId: `del-q1-${timestamp}`,
      categoryId: category._id,
      subjectId: subject._id,
      topic: testSubSlug,
      difficulty: 'easy',
      question: 'What is 2 + 2?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 3,
      explanation: 'Basic arithmetic',
      isPublished: true,
    });

    const q2 = await QuestionModel.create({
      questionId: `del-q2-${timestamp}`,
      categoryId: category._id,
      subjectId: subject._id,
      topic: testSubSlug,
      difficulty: 'medium',
      question: 'What is 3 * 3?',
      options: ['6', '9', '12', '15'],
      correctAnswer: 1,
      explanation: 'Basic multiplication',
      isPublished: true,
    });
    console.log(`  2 Questions inserted: ${q1.questionId}, ${q2.questionId} ✅`);

    // 4. Verify getSubjectQuestions
    console.log('▶️ Step 4: Verify getSubjectQuestions');
    const questionsList = await adminService.getSubjectQuestions(subject._id.toString(), 1, 10);
    if (questionsList.questions.length !== 2) {
      throw new Error(`Expected 2 questions, got ${questionsList.questions.length}`);
    }
    console.log(`  Successfully fetched ${questionsList.questions.length} questions ✅`);

    // 5. Test Delete Individual Question
    console.log('▶️ Step 5: Delete Individual Question');
    const delQResult = await adminService.deleteQuestion(q1._id.toString());
    if (!delQResult.deleted) {
      throw new Error('Failed to delete question q1');
    }
    const q1InDb = await QuestionModel.findById(q1._id);
    if (q1InDb) {
      throw new Error('Question q1 still exists in DB');
    }
    console.log('  Question deleted individually & removed from DB ✅');

    // 6. Test Delete Quiz (Subject) with Cascade
    console.log('▶️ Step 6: Delete Quiz (Subject)');
    const delSubResult = await adminService.deleteSubject(subject._id.toString());
    if (delSubResult.deletedQuestionsCount !== 1) {
      throw new Error(`Expected 1 cascaded question deleted, got ${delSubResult.deletedQuestionsCount}`);
    }
    const subInDb = await SubjectModel.findById(subject._id);
    if (subInDb) {
      throw new Error('Subject still exists in DB');
    }
    const q2InDb = await QuestionModel.findById(q2._id);
    if (q2InDb) {
      throw new Error('Remaining question q2 was not cascade deleted with Subject');
    }
    console.log('  Quiz and all its remaining questions deleted successfully ✅');

    // 7. Test Delete Category with Cascade
    console.log('▶️ Step 7: Delete Category with Nested Cascade');
    // Create another subject and question under category to verify category cascade
    const sub2 = await adminService.createSubject({
      categoryId: category._id.toString(),
      name: `Cascade Quiz ${timestamp}`,
      slug: `cascade-quiz-${timestamp}`,
    });
    await QuestionModel.create({
      questionId: `del-q3-${timestamp}`,
      categoryId: category._id,
      subjectId: sub2._id,
      topic: sub2.slug,
      difficulty: 'hard',
      question: 'Hard question',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Explanation',
      isPublished: true,
    });

    const delCatResult = await adminService.deleteCategory(category._id.toString());
    if (delCatResult.deletedSubjectsCount !== 1 || delCatResult.deletedQuestionsCount !== 1) {
      throw new Error(`Category cascade delete mismatch: ${JSON.stringify(delCatResult)}`);
    }

    const catInDb = await CategoryModel.findById(category._id);
    if (catInDb) {
      throw new Error('Category still exists in DB');
    }
    const sub2InDb = await SubjectModel.findById(sub2._id);
    if (sub2InDb) {
      throw new Error('Subject sub2 still exists in DB after category delete');
    }
    console.log('  Category deleted and all nested subjects and questions cascade deleted ✅');

    console.log('\n====================================================');
    console.log('🎉 ALL ADMIN CATEGORY & QUIZ DELETE TESTS PASSED!');
    console.log('====================================================');
  } finally {
    await mongoose.disconnect();
  }
}

runAdminDeleteVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
