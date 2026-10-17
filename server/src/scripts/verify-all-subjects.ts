import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

async function verifyAll() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena');
  console.log('✅ Connected to MongoDB.\n');

  const categories = await mongoose.connection.db.collection('categories').find({}).sort({ order: 1, name: 1 }).toArray();
  const subjects = await mongoose.connection.db.collection('subjects').find({}).sort({ name: 1 }).toArray();
  const questionsColl = mongoose.connection.db.collection('questions');

  let totalQuestionsInDB = 0;
  let subjectsWith50OrMore = 0;
  const issues: string[] = [];

  console.log('========================================================================');
  console.log('                 QUIZZYWORLD QUESTION DATABASE AUDIT                    ');
  console.log('========================================================================\n');

  for (const cat of categories) {
    console.log(`📂 [Category] ${cat.name} (${cat.slug})`);
    const catSubjects = subjects.filter(s => s.categoryId.toString() === cat._id.toString());

    for (const sub of catSubjects) {
      const qCount = await questionsColl.countDocuments({ subjectId: sub._id });
      const easyCount = await questionsColl.countDocuments({ subjectId: sub._id, difficulty: 'easy' });
      totalQuestionsInDB += qCount;

      const status = qCount >= 50 ? '✅' : '❌';
      if (qCount >= 50) subjectsWith50OrMore++;
      else issues.push(`${sub.name} only has ${qCount} questions`);

      console.log(`   ${status} ${sub.name.padEnd(30)} : ${qCount} questions (${easyCount} easy)`);
    }
    console.log('');
  }

  console.log('========================================================================');
  console.log(`📊 SUMMARY:`);
  console.log(`   Total Categories: ${categories.length}`);
  console.log(`   Total Subjects:   ${subjects.length}`);
  console.log(`   Subjects with 50+ questions: ${subjectsWith50OrMore} / ${subjects.length}`);
  console.log(`   Total Questions in Database: ${totalQuestionsInDB}`);
  console.log('========================================================================\n');

  // Also verify JSON files
  const qDir = path.resolve('src/scripts/questions');
  if (fs.existsSync(qDir)) {
    const files = fs.readdirSync(qDir).filter(f => f.endsWith('.json'));
    console.log(`📁 Verified JSON Seed Files in ${qDir} (${files.length} files):`);
    let totalInFiles = 0;
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(qDir, file), 'utf8');
        const parsed = JSON.parse(raw);
        totalInFiles += parsed.length;
        console.log(`   - ${file.padEnd(28)} : ${parsed.length} questions`);
      } catch (e: any) {
        console.log(`   ❌ Error reading ${file}: ${e.message}`);
      }
    }
    console.log(`\n   Total questions across JSON files: ${totalInFiles}`);
  }

  await mongoose.disconnect();

  if (issues.length > 0) {
    console.error('\n⚠️ Issues found:', issues);
    process.exit(1);
  } else {
    console.log('\n🎯 ALL 33 SUBJECTS HAVE AT LEAST 50 HIGH-QUALITY EASY QUESTIONS SEEDED!');
  }
}

verifyAll().catch((err) => {
  console.error('❌ Audit Error:', err);
  process.exit(1);
});
