import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EXPECTED_CATALOG: Record<string, string[]> = {
  'anime-manga': [
    'Naruto Universe',
    'One Piece Adventures',
    'Dragon Ball',
    'Jujutsu Kaisen Quiz',
  ],
  'movies-web-series': [
    'Marvel Universe',
    'DC Universe',
    'Harry Potter World',
    'Stranger Things',
    'Money Heist Quiz',
    'Movie Dialogue Quiz',
  ],
  'sports': [
    'IPL Superstars',
    'Cricket Records',
    'Guess the Cricketer',
  ],
  'general-knowledge-india': [
    'World Flags Challenge',
    'World Geography',
    'Indian History',
    'World History',
    'Famous Personalities',
    'Inventions & Discoveries',
  ],
  'science-space': [
    'Human Body',
    'Animal Kingdom',
    'Amazing Science Facts',
    'Physics Challenge',
    'Chemistry Quiz',
    'Biology Basics',
    'Solar System',
    'Periodic Table',
    'Famous Scientists',
  ],
  'computer-science-programming': [
    'DBMS Quiz',
    'Operating Systems',
    'Computer Networks',
    'OOP Concepts',
    'HTML & CSS',
  ],
};

async function verify() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  console.log('--- VERIFYING FRESH CATALOG IN DATABASE ---');

  const categories = await CategoryModel.find({}).sort({ name: 1 });
  const subjects = await SubjectModel.find({}).sort({ name: 1 });
  const questionsCount = await QuestionModel.countDocuments();

  console.log(`Total Categories found: ${categories.length} (Expected: 6)`);
  console.log(`Total Subjects found: ${subjects.length} (Expected: 33)`);
  console.log(`Total Questions found: ${questionsCount} (Expected: 0)`);

  let allChecksPassed = true;

  if (categories.length !== 6) {
    console.error(`❌ Categories count mismatch: found ${categories.length}, expected 6`);
    allChecksPassed = false;
  }

  if (subjects.length !== 33) {
    console.error(`❌ Subjects count mismatch: found ${subjects.length}, expected 33`);
    allChecksPassed = false;
  }

  if (questionsCount !== 0) {
    console.error(`❌ Questions count is not 0: found ${questionsCount}`);
    allChecksPassed = false;
  }

  // Verify each category and its subjects
  for (const [catSlug, expectedSubjNames] of Object.entries(EXPECTED_CATALOG)) {
    const cat = categories.find((c) => c.slug === catSlug);
    if (!cat) {
      console.error(`❌ Category with slug '${catSlug}' not found!`);
      allChecksPassed = false;
      continue;
    }

    const catSubjects = subjects.filter((s) => s.categoryId.toString() === cat._id.toString());
    console.log(`\n📁 Category: "${cat.name}" (slug: ${cat.slug}) -> Found ${catSubjects.length}/${expectedSubjNames.length} subjects:`);

    for (const expName of expectedSubjNames) {
      const match = catSubjects.find((s) => s.name === expName);
      if (match) {
        console.log(`   ✅ Subject: "${match.name}" (slug: ${match.slug}, categoryId: ${match.categoryId})`);
      } else {
        console.error(`   ❌ Missing expected subject: "${expName}" in category "${cat.name}"`);
        allChecksPassed = false;
      }
    }
  }

  // Check for orphan subjects
  const validCategoryIds = new Set(categories.map((c) => c._id.toString()));
  for (const s of subjects) {
    if (!validCategoryIds.has(s.categoryId.toString())) {
      console.error(`❌ Orphan subject found: "${s.name}" with invalid categoryId ${s.categoryId}`);
      allChecksPassed = false;
    }
  }

  if (allChecksPassed) {
    console.log('\n🌟 ALL 6 CATEGORIES AND 33 SUBJECTS ARE 100% VERIFIED WITH PERFECT RELATIONSHIPS!');
  } else {
    console.error('\n⚠️ Verification failed for one or more catalog items.');
    process.exit(1);
  }

  await mongoose.disconnect();
}

verify().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
