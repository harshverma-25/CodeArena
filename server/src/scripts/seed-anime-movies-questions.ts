import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';

interface ISubjectConfig {
  categorySlug: string;
  categoryName: string;
  subjectSlug: string;
  subjectName: string;
  jsonFile: string;
}

const SUBJECT_CONFIGS: ISubjectConfig[] = [
  // --- Category 1: Anime & Manga ---
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectSlug: 'naruto-universe',
    subjectName: 'Naruto Universe',
    jsonFile: 'naruto.json',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectSlug: 'one-piece-adventures',
    subjectName: 'One Piece Adventures',
    jsonFile: 'one-piece.json',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectSlug: 'dragon-ball',
    subjectName: 'Dragon Ball',
    jsonFile: 'dragon-ball.json',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectSlug: 'jujutsu-kaisen-quiz',
    subjectName: 'Jujutsu Kaisen Quiz',
    jsonFile: 'jujutsu-kaisen.json',
  },

  // --- Category 2: Movies & Web Series ---
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectSlug: 'marvel-universe',
    subjectName: 'Marvel Universe',
    jsonFile: 'marvel.json',
  },
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectSlug: 'dc-universe',
    subjectName: 'DC Universe',
    jsonFile: 'dc.json',
  },
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectSlug: 'harry-potter-world',
    subjectName: 'Harry Potter World',
    jsonFile: 'harry-potter.json',
  },
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectSlug: 'stranger-things',
    subjectName: 'Stranger Things',
    jsonFile: 'stranger-things.json',
  },
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectSlug: 'money-heist-quiz',
    subjectName: 'Money Heist Quiz',
    jsonFile: 'money-heist.json',
  },
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectSlug: 'movie-dialogue-quiz',
    subjectName: 'Movie Dialogue Quiz',
    jsonFile: 'movie-dialogue.json',
  },
];

async function seedAll() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection failed.');

  const categoriesCollection = db.collection('categories');
  const subjectsCollection = db.collection('subjects');
  const questionsCollection = db.collection('questions');

  const questionsDir = path.resolve(process.cwd(), 'src/scripts/questions');
  let grandTotalInserted = 0;
  let grandTotalUpdated = 0;

  console.log(`\n🚀 Starting seeding for ${SUBJECT_CONFIGS.length} subjects (50 questions each)...`);

  for (const conf of SUBJECT_CONFIGS) {
    console.log(`\n======================================================`);
    console.log(`📂 Processing [${conf.categoryName}] -> "${conf.subjectName}" (${conf.subjectSlug})`);

    // 1. Locate Category
    let category = await categoriesCollection.findOne({ slug: conf.categorySlug });
    if (!category) {
      console.log(`   Creating category "${conf.categoryName}"...`);
      const res = await categoriesCollection.insertOne({
        name: conf.categoryName,
        slug: conf.categorySlug,
        description: `${conf.categoryName} quizzes and trivia`,
        icon: conf.categorySlug === 'anime-manga' ? 'sparkles' : 'film',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      category = await categoriesCollection.findOne({ _id: res.insertedId });
    }

    // 2. Locate Subject
    let subject = await subjectsCollection.findOne({
      $or: [{ slug: conf.subjectSlug }, { name: conf.subjectName }],
    });
    if (!subject) {
      console.log(`   Creating subject "${conf.subjectName}"...`);
      const res = await subjectsCollection.insertOne({
        categoryId: category._id,
        name: conf.subjectName,
        slug: conf.subjectSlug,
        description: `${conf.subjectName} trivia and quizzes`,
        icon: '',
        thumbnailUrl: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      subject = await subjectsCollection.findOne({ _id: res.insertedId });
    } else if (!subject.categoryId || subject.categoryId.toString() !== category._id.toString()) {
      await subjectsCollection.updateOne(
        { _id: subject._id },
        { $set: { categoryId: category._id, updatedAt: new Date() } }
      );
      subject.categoryId = category._id;
    }

    // 3. Read JSON
    const filePath = path.join(questionsDir, conf.jsonFile);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Questions file not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const questionsList = JSON.parse(raw);
    console.log(`   📋 Loaded ${questionsList.length} questions from ${conf.jsonFile}`);

    if (questionsList.length !== 50) {
      console.warn(`   ⚠️ Warning: Expected 50 questions, found ${questionsList.length}`);
    }

    // 4. Upsert Questions
    let inserted = 0;
    let updated = 0;
    const now = new Date();

    for (const q of questionsList) {
      if (!q.questionId || !q.question || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Invalid question format for ID ${q.questionId} in ${conf.jsonFile}`);
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid correctAnswer for ID ${q.questionId} in ${conf.jsonFile}`);
      }

      const doc = {
        questionId: q.questionId,
        categoryId: new Types.ObjectId(category._id),
        subjectId: new Types.ObjectId(subject._id),
        topic: q.topic || conf.subjectName,
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

    grandTotalInserted += inserted;
    grandTotalUpdated += updated;
    const countInSubject = await questionsCollection.countDocuments({
      subjectId: new Types.ObjectId(subject._id),
    });

    console.log(`   ✨ Subject "${conf.subjectName}": Inserted: ${inserted}, Updated: ${updated}`);
    console.log(`   📊 Total questions now in "${conf.subjectName}": ${countInSubject}`);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 ALL SUBJECTS PROCESSED SUCCESSFULLY!`);
  console.log(`   - Total Inserted: ${grandTotalInserted}`);
  console.log(`   - Total Updated: ${grandTotalUpdated}`);

  // Summary Verification
  console.log(`\n📊 DATABASE VERIFICATION SUMMARY:`);
  let allSubjectsValid = true;

  for (const conf of SUBJECT_CONFIGS) {
    const subj = await subjectsCollection.findOne({ slug: conf.subjectSlug });
    if (!subj) {
      console.error(`❌ Subject ${conf.subjectSlug} missing!`);
      allSubjectsValid = false;
      continue;
    }
    const count = await questionsCollection.countDocuments({ subjectId: subj._id });
    const easyCount = await questionsCollection.countDocuments({ subjectId: subj._id, difficulty: 'easy' });
    console.log(`   - [${conf.categoryName}] "${conf.subjectName}" (${conf.subjectSlug}): ${count} total, ${easyCount} easy`);
    if (count !== 50) {
      console.warn(`     ⚠️ Count mismatch: Expected 50, found ${count}`);
      allSubjectsValid = false;
    }
  }

  const grandTotalInDb = await questionsCollection.countDocuments();
  console.log(`\n🌟 Grand Total Questions in Database: ${grandTotalInDb}`);

  if (allSubjectsValid) {
    console.log(`✅ 100% SUCCESS: All 10 subjects have exactly 50 validated questions!`);
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

seedAll().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
