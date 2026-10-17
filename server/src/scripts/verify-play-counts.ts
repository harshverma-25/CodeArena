import 'dotenv/config';
import { cacheService } from '../shared/cache/cache.service.js';
import { categoryService } from '../modules/category/category.service.js';
import mongoose from 'mongoose';

async function main() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // 1. Clear caches
  await categoryService.clearCache();
  console.log('✅ Cache cleared.');

  // 2. Fetch categories
  const categories = await categoryService.getAllCategories();
  console.log(`\n📋 Categories (${categories.length}):`);
  for (const cat of categories) {
    console.log(` - [${cat.slug}] ${cat.name} -> playedCount: ${cat.playedCount}, questionCount: ${cat.questionCount}`);
  }

  // 3. Fetch subjects for a category (e.g. computer-science-programming)
  const csSubjects = await categoryService.getSubjectsForCategory('computer-science-programming');
  console.log(`\n💻 Computer Science & Programming Subjects (${csSubjects.subjects.length}):`);
  for (const sub of csSubjects.subjects) {
    console.log(` - [${sub.slug}] ${sub.name} -> playedCount: ${sub.playedCount}, questionCount: ${sub.questionCount}`);
  }

  // 4. Fetch popular quizzes
  const popular = await categoryService.getPopularQuizzes(6);
  console.log(`\n🔥 Popular Quizzes (${popular.length}):`);
  for (const pop of popular) {
    console.log(` - Rank ${pop.rank}: ${pop.title} (${pop.categorySlug}) -> playedCount: ${pop.playedCount}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error in verification:', err);
  process.exit(1);
});
