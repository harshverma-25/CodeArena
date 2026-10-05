import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { questionService } from '../modules/question/question.service.js';
import { IQuestion } from '../modules/question/question.types.js';
import { seedCategoriesAndMigrateQuestions } from './seed-categories.js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const QUESTIONS_DIR = path.resolve(process.cwd(), 'src/scripts/questions');

async function seedQuestions() {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/codearena';

  console.log('🚀 Connecting to MongoDB for question seeding...');
  try {
    if (primaryUri) {
      console.log(`Connecting to primary MongoDB URI...`);
      await mongoose.connect(primaryUri);
    } else {
      await mongoose.connect(localUri);
    }
    console.log('✅ Connected to MongoDB.');
  } catch (connErr) {
    console.warn('⚠️ Primary MongoDB connection failed, attempting fallback to local MongoDB (127.0.0.1:27017)...');
    try {
      await mongoose.connect(localUri);
      console.log('✅ Connected to local MongoDB.');
    } catch (localErr) {
      console.error('❌ Failed to connect to MongoDB:', localErr);
      process.exit(1);
    }
  }

  try {
    if (!fs.existsSync(QUESTIONS_DIR)) {
      console.error(`❌ Questions directory not found at: ${QUESTIONS_DIR}`);
      process.exit(1);
    }

    const files = fs.readdirSync(QUESTIONS_DIR).filter((file) => file.endsWith('.json'));
    console.log(`📁 Found ${files.length} question files in ${QUESTIONS_DIR}:`, files);

    let allQuestions: Partial<IQuestion>[] = [];

    for (const file of files) {
      const filePath = path.join(QUESTIONS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        const questions: Partial<IQuestion>[] = JSON.parse(content);
        console.log(`  └─ Loaded ${questions.length} questions from ${file}`);
        allQuestions = allQuestions.concat(questions);
      } catch (parseErr) {
        console.error(`❌ Error parsing JSON from ${file}:`, parseErr);
      }
    }

    console.log(`\n📥 Seeding total of ${allQuestions.length} questions into MongoDB...`);
    const { inserted, updated } = await questionService.seedQuestions(allQuestions);
    console.log(`✨ Seeding completed successfully!`);
    console.log(`   - New questions inserted: ${inserted}`);
    console.log(`   - Existing questions updated: ${updated}`);

    console.log('🔄 Linking question category and subject relationships...');
    await seedCategoriesAndMigrateQuestions();
    console.log('✅ Categories, subjects and question references synchronized!');
  } catch (error) {
    console.error('❌ Error during question seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seedQuestions().catch(console.error);
