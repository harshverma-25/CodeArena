import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function inspect() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  if (!db) {
    console.log('No DB connection');
    return;
  }

  const collections = await db.listCollections().toArray();
  console.log('Collections in DB:', collections.map(c => c.name));

  const categoriesCount = await db.collection('categories').countDocuments();
  const subjectsCount = await db.collection('subjects').countDocuments();
  const questionsCount = await db.collection('questions').countDocuments();
  const usersCount = await db.collection('users').countDocuments();
  const admins = await db.collection('users').find({ role: 'admin' }).toArray();

  console.log('--- DB SUMMARY ---');
  console.log('Categories Count:', categoriesCount);
  console.log('Subjects Count:', subjectsCount);
  console.log('Questions Count:', questionsCount);
  console.log('Users Count:', usersCount);
  console.log('Admin Users:', admins.map(a => ({ id: a._id.toString(), email: a.email, username: a.username, role: a.role })));

  const categories = await db.collection('categories').find({}).toArray();
  console.log('Existing Categories:', categories.map(c => ({ id: c._id.toString(), name: c.name, slug: c.slug, isActive: c.isActive })));

  const subjects = await db.collection('subjects').find({}).toArray();
  console.log('Existing Subjects Sample:', subjects.slice(0, 10).map(s => ({ id: s._id.toString(), name: s.name, slug: s.slug, categoryId: s.categoryId?.toString() })));

  // Sample question
  const sampleQ = await db.collection('questions').findOne({});
  if (sampleQ) {
    console.log('Sample Question Schema keys:', Object.keys(sampleQ));
    console.log('Sample Question IDs:', {
      questionId: sampleQ.questionId,
      categoryId: sampleQ.categoryId,
      subjectId: sampleQ.subjectId,
      difficulty: sampleQ.difficulty,
      optionsCount: sampleQ.options?.length,
      correctAnswer: sampleQ.correctAnswer
    });
  }

  await mongoose.disconnect();
}

inspect().catch(err => {
  console.error('Inspection error:', err);
  process.exit(1);
});
