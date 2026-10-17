import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';

const QUESTIONS_FILE = path.resolve(process.cwd(), 'src/scripts/questions/dbms.json');

async function seedDBMS() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed.');
  }

  // 1. Read JSON file
  console.log('📖 Reading questions file:', QUESTIONS_FILE);
  const raw = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
  const questionsList = JSON.parse(raw);
  console.log(`📋 Found ${questionsList.length} DBMS questions.`);

  // 2. Find Category & Subject
  const categoriesCollection = db.collection('categories');
  const subjectsCollection = db.collection('subjects');
  const questionsCollection = db.collection('questions');

  let subject = await subjectsCollection.findOne({
    $or: [{ slug: 'dbms-quiz' }, { slug: 'dbms' }, { name: /dbms/i }],
  });

  let category = null;
  if (subject && subject.categoryId) {
    category = await categoriesCollection.findOne({ _id: new Types.ObjectId(subject.categoryId) });
  }

  if (!category) {
    category = await categoriesCollection.findOne({
      $or: [{ slug: 'computer-science-programming' }, { slug: 'programming' }],
    });
  }

  if (!category) {
    console.log('Creating category "Computer Science & Programming"...');
    const catInsert = await categoriesCollection.insertOne({
      name: 'Computer Science & Programming',
      slug: 'computer-science-programming',
      description: 'Core computer science concepts, DBMS, networking, operating systems, and web technologies.',
      icon: 'code',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    category = await categoriesCollection.findOne({ _id: catInsert.insertedId });
  }

  if (!category) {
    throw new Error('Failed to find or create category');
  }

  if (!subject) {
    console.log('Creating subject "DBMS Quiz"...');
    const subjInsert = await subjectsCollection.insertOne({
      categoryId: category._id,
      name: 'DBMS Quiz',
      slug: 'dbms-quiz',
      description: 'Database management systems, SQL queries, relational models, and normalization',
      icon: '',
      thumbnailUrl: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    subject = await subjectsCollection.findOne({ _id: subjInsert.insertedId });
  } else if (!subject.categoryId) {
    await subjectsCollection.updateOne(
      { _id: subject._id },
      { $set: { categoryId: category._id, updatedAt: new Date() } }
    );
    subject.categoryId = category._id;
  }

  if (!subject) {
    throw new Error('Failed to find or create subject');
  }

  console.log(`✅ Category: "${category.name}" (ID: ${category._id}, slug: ${category.slug})`);
  console.log(`✅ Subject: "${subject.name}" (ID: ${subject._id}, slug: ${subject.slug})`);

  // 3. Upsert questions
  let inserted = 0;
  let updated = 0;
  const now = new Date();

  for (const q of questionsList) {
    const doc = {
      questionId: q.questionId,
      categoryId: new Types.ObjectId(category._id),
      subjectId: new Types.ObjectId(subject._id),
      topic: 'DBMS',
      difficulty: q.difficulty || 'easy',
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      isPublished: true,
      updatedAt: now,
    };

    const res = await questionsCollection.updateOne(
      { questionId: q.questionId },
      {
        $set: doc,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    if (res.upsertedCount > 0) {
      inserted++;
    } else {
      updated++;
    }
  }

  console.log(`\n🎉 Seeding finished!`);
  console.log(`   - Questions Inserted: ${inserted}`);
  console.log(`   - Questions Updated: ${updated}`);

  // 4. Verify in DB
  const totalInSubject = await questionsCollection.countDocuments({
    subjectId: new Types.ObjectId(subject._id),
  });
  const totalDbms = await questionsCollection.countDocuments({ topic: 'DBMS' });
  const easyCount = await questionsCollection.countDocuments({
    subjectId: new Types.ObjectId(subject._id),
    difficulty: 'easy',
  });
  const allCount = await questionsCollection.countDocuments();

  console.log('\n📊 Database Verification:');
  console.log(`   - Questions with Subject ID ${subject._id}: ${totalInSubject}`);
  console.log(`   - Questions with Topic 'DBMS': ${totalDbms}`);
  console.log(`   - Questions with Difficulty 'easy': ${easyCount}`);
  console.log(`   - Total Questions in entire Database: ${allCount}`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

seedDBMS().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
