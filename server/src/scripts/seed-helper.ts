import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';

// Helper to write JSON and upsert questions
export async function seedSubjectQuestions(
  categorySlug: string,
  categoryName: string,
  subjectSlug: string,
  subjectName: string,
  fileName: string,
  questions: any[]
) {
  const db = mongoose.connection.db;
  if (!db) throw new Error('DB connection failed');

  const categoriesCol = db.collection('categories');
  const subjectsCol = db.collection('subjects');
  const questionsCol = db.collection('questions');

  let cat = await categoriesCol.findOne({ slug: categorySlug });
  if (!cat) {
    const res = await categoriesCol.insertOne({
      name: categoryName,
      slug: categorySlug,
      description: `${categoryName} quizzes`,
      icon: 'trophy',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    cat = await categoriesCol.findOne({ _id: res.insertedId });
  }

  if (!cat) {
    throw new Error(`Failed to find or create category ${categorySlug}`);
  }

  let subj = await subjectsCol.findOne({ slug: subjectSlug });
  if (!subj) {
    const res = await subjectsCol.insertOne({
      categoryId: cat._id,
      name: subjectName,
      slug: subjectSlug,
      description: `${subjectName} trivia and quizzes`,
      icon: 'trophy',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    subj = await subjectsCol.findOne({ _id: res.insertedId });
  } else if (!subj.categoryId || subj.categoryId.toString() !== cat._id.toString()) {
    await subjectsCol.updateOne({ _id: subj._id }, { $set: { categoryId: cat._id, updatedAt: new Date() } });
    subj.categoryId = cat._id;
  }

  if (!subj) {
    throw new Error(`Failed to find or create subject ${subjectSlug}`);
  }

  // Save to JSON
  const filePath = path.resolve(process.cwd(), 'src/scripts/questions', fileName);
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`💾 Saved ${questions.length} questions to ${fileName}`);

  let inserted = 0;
  let updated = 0;
  const now = new Date();

  for (const q of questions) {
    const doc = {
      questionId: q.questionId,
      categoryId: new Types.ObjectId(cat._id),
      subjectId: new Types.ObjectId(subj._id),
      topic: q.topic || subjectName,
      difficulty: q.difficulty || 'easy',
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      isPublished: true,
      updatedAt: now,
    };

    const res = await questionsCol.updateOne(
      { questionId: q.questionId },
      {
        $set: doc,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    if (res.upsertedCount > 0) inserted++;
    else updated++;
  }

  const total = await questionsCol.countDocuments({ subjectId: subj._id });
  console.log(`✨ [${subjectName}] Inserted: ${inserted}, Updated: ${updated}, Total in DB: ${total}`);
  return total;
}
