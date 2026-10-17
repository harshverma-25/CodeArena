import 'dotenv/config';
import mongoose, { Types } from 'mongoose';

async function verify() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const db = mongoose.connection.db;
  if (!db) throw new Error('DB connection failed');

  const questionsCollection = db.collection('questions');
  const subjectsCollection = db.collection('subjects');
  const categoriesCollection = db.collection('categories');

  // 1. Fetch DBMS subject
  const subject = await subjectsCollection.findOne({
    $or: [{ slug: 'dbms-quiz' }, { slug: 'dbms' }],
  });
  if (!subject) throw new Error('DBMS subject not found in database');
  console.log(`✅ Found Subject: "${subject.name}" (${subject.slug}) -> ID: ${subject._id}`);

  // 2. Fetch Category
  const category = await categoriesCollection.findOne({ _id: new Types.ObjectId(subject.categoryId) });
  if (!category) throw new Error('Parent category not found for DBMS subject');
  console.log(`✅ Found Parent Category: "${category.name}" (${category.slug}) -> ID: ${category._id}`);

  // 3. Count Questions
  const totalInSubject = await questionsCollection.countDocuments({ subjectId: subject._id });
  const totalDbms = await questionsCollection.countDocuments({ topic: 'DBMS' });
  const totalPublished = await questionsCollection.countDocuments({ subjectId: subject._id, isPublished: true });
  const totalEasy = await questionsCollection.countDocuments({ subjectId: subject._id, difficulty: 'easy' });

  console.log(`\n📊 Question Counts:`);
  console.log(`   - Total in Subject: ${totalInSubject} (Expected: 50)`);
  console.log(`   - Total with Topic 'DBMS': ${totalDbms} (Expected: 50)`);
  console.log(`   - Total Published: ${totalPublished} (Expected: 50)`);
  console.log(`   - Total Easy: ${totalEasy} (Expected: 50)`);

  if (totalInSubject !== 50 || totalEasy !== 50 || totalPublished !== 50) {
    throw new Error(`Expected exactly 50 easy published questions, found ${totalInSubject}`);
  }

  // 4. Validate integrity of all 50 questions
  const allQuestions = await questionsCollection.find({ subjectId: subject._id }).toArray();
  for (let i = 0; i < allQuestions.length; i++) {
    const q = allQuestions[i];
    if (!q.questionId) throw new Error(`Question at index ${i} is missing questionId`);
    if (!q.question || typeof q.question !== 'string') throw new Error(`Question ${q.questionId} has invalid question text`);
    if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`Question ${q.questionId} does not have exactly 4 options`);
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      throw new Error(`Question ${q.questionId} has invalid correctAnswer index: ${q.correctAnswer}`);
    }
    if (!q.explanation || typeof q.explanation !== 'string') throw new Error(`Question ${q.questionId} missing explanation`);
    if (q.difficulty !== 'easy') throw new Error(`Question ${q.questionId} difficulty is not easy: ${q.difficulty}`);
    if (q.isPublished !== true) throw new Error(`Question ${q.questionId} is not published`);
  }
  console.log(`\n✅ All 50 DBMS questions passed full validation (4 options, valid answer index 0-3, non-empty explanation, difficulty='easy', isPublished=true).`);

  // 5. Test Random Sampling (Simulate battle quiz generation)
  const sampled = await questionsCollection.aggregate([
    { $match: { subjectId: subject._id, isPublished: true, difficulty: 'easy' } },
    { $sample: { size: 10 } },
  ]).toArray();

  console.log(`\n🎲 Sample 10 Questions Test:`);
  console.log(`   - Retrieved ${sampled.length} questions`);
  sampled.slice(0, 3).forEach((q, idx) => {
    console.log(`   ${idx + 1}. [${q.questionId}] ${q.question}`);
    console.log(`      Options: ${JSON.stringify(q.options)}`);
    console.log(`      Correct: Option #${q.correctAnswer} -> "${q.options[q.correctAnswer]}"`);
  });

  await mongoose.disconnect();
  console.log('\n🌟 VERIFICATION COMPLETE: ALL 50 DBMS QUIZ QUESTIONS ARE READY AND FUNCTIONING!');
}

verify().catch((err) => {
  console.error('❌ Verification Error:', err);
  process.exit(1);
});
