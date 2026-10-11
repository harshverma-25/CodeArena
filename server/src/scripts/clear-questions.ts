import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { QuestionModel } from '../modules/question/question.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const QUESTIONS_DIR = path.resolve(process.cwd(), 'src/scripts/questions');

async function clearQuestions() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codearena';
  console.log('🚀 Connecting to MongoDB to clear questions...');
  
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB.');

    // 1. Delete all questions from MongoDB
    const countBefore = await QuestionModel.countDocuments();
    console.log(`📊 Found ${countBefore} questions currently in MongoDB.`);

    if (countBefore > 0) {
      const deleteResult = await QuestionModel.deleteMany({});
      console.log(`🗑️ Successfully deleted ${deleteResult.deletedCount} questions from MongoDB.`);
    } else {
      console.log('ℹ️ No questions found in MongoDB to delete.');
    }

    // 2. Remove sample JSON files in src/scripts/questions
    if (fs.existsSync(QUESTIONS_DIR)) {
      const files = fs.readdirSync(QUESTIONS_DIR).filter((file) => file.endsWith('.json'));
      console.log(`📁 Found ${files.length} sample question files in ${QUESTIONS_DIR}.`);

      for (const file of files) {
        const filePath = path.join(QUESTIONS_DIR, file);
        fs.unlinkSync(filePath);
        console.log(`  └─ Removed: ${file}`);
      }
      console.log('✨ All sample question files removed from src/scripts/questions.');
    }

    const countAfter = await QuestionModel.countDocuments();
    console.log(`\n🎉 Verification: Database now has ${countAfter} questions.`);
  } catch (err) {
    console.error('❌ Error while clearing questions:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

clearQuestions().catch(console.error);
