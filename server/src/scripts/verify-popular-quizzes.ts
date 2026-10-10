import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function verifyPopularAndCategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  console.log('Testing categoryService.getAllCategories()...');
  const allCats = await categoryService.getAllCategories();
  console.log('Categories retrieved count:', allCats.length);
  for (const cat of allCats) {
    console.log(` - [${cat.slug}] ${cat.name}: ${cat.questionCount} questions (isPlayable: ${cat.isPlayable})`);
  }

  console.log('\nTesting categoryService.getPopularQuizzes(5)...');
  const popular = await categoryService.getPopularQuizzes(5);
  console.log('Popular quizzes retrieved count:', popular.length);
  for (const item of popular) {
    console.log(` - #${item.rank} [${item.title}] (${item.categorySlug}/${item.subjectSlug || 'mixed'}): ${item.playedCount} plays, ${item.questionCount} questions`);
  }

  console.log('\nTesting categoryService.getSubjectsForCategory("science")...');
  const scienceData = await categoryService.getSubjectsForCategory('science');
  console.log('Science category name:', scienceData.category.name);
  console.log('Science subjects count:', scienceData.subjects.length);
  for (const s of scienceData.subjects) {
    console.log(` - Subject [${s.slug}] ${s.name}: ${s.questionCount} questions`);
  }

  await mongoose.disconnect();
  console.log('\nVerification PASSED successfully!');
}

verifyPopularAndCategories().catch((err) => {
  console.error('Verification FAILED:', err);
  process.exit(1);
});
