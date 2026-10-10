import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { categoryRepository } from '../modules/category/category.repository.js';
import { QuestionModel } from '../modules/question/question.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const MASTER_CATEGORIES = [
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Software development, algorithms, databases, and computer science fundamentals',
    icon: 'code',
  },
  {
    name: 'Aptitude',
    slug: 'aptitude',
    description: 'Logical reasoning, quantitative analysis, verbal skills, and data interpretation',
    icon: 'brain',
  },
  {
    name: 'General Knowledge',
    slug: 'general-knowledge',
    description: 'History, geography, science, current affairs, and general trivia',
    icon: 'globe',
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Physics, chemistry, biology, natural sciences, and scientific laws',
    icon: 'flask',
  },
];

export const MASTER_SUBJECTS: Record<string, Array<{ name: string; slug: string; description?: string }>> = {
  programming: [
    { name: 'Data Structures & Algorithms', slug: 'dsa', description: 'Arrays, trees, graphs, sorting, and dynamic programming' },
    { name: 'Database Management Systems', slug: 'dbms', description: 'Relational databases, SQL queries, indexing, and normalization' },
    { name: 'Operating Systems', slug: 'operating-systems', description: 'Processes, threads, memory management, and file systems' },
    { name: 'Computer Networks', slug: 'computer-networks', description: 'OSI model, TCP/IP protocols, routing, and network security' },
    { name: 'Object-Oriented Programming', slug: 'oop', description: 'Encapsulation, inheritance, polymorphism, and design patterns' },
    { name: 'JavaScript', slug: 'javascript', description: 'ES6+, promises, event loop, and asynchronous programming' },
    { name: 'TypeScript', slug: 'typescript', description: 'Static typing, interfaces, generics, and type manipulation' },
    { name: 'Python', slug: 'python', description: 'Python data structures, decorators, modules, and paradigms' },
    { name: 'React', slug: 'react', description: 'Components, hooks, state management, and virtual DOM' },
    { name: 'Pseudocode', slug: 'pseudocode', description: 'Algorithm logic, dry runs, and pseudocode evaluation' },
  ],
  aptitude: [
    { name: 'Logical Reasoning', slug: 'logical-reasoning', description: 'Puzzles, series, syllogisms, and deduction' },
    { name: 'Quantitative Aptitude', slug: 'quantitative-aptitude', description: 'Arithmetic, algebra, geometry, and numerical estimation' },
    { name: 'Verbal Ability', slug: 'verbal-ability', description: 'Grammar, vocabulary, reading comprehension, and analogies' },
    { name: 'Data Interpretation', slug: 'data-interpretation', description: 'Charts, graphs, tables, and data analysis' },
  ],
  'general-knowledge': [
    { name: 'History', slug: 'history', description: 'World history, civilizations, and major historical events' },
    { name: 'Geography', slug: 'geography', description: 'Physical geography, countries, maps, and climate' },
    { name: 'Science', slug: 'science', description: 'Physics, chemistry, biology, and scientific discoveries' },
    { name: 'Current Affairs', slug: 'current-affairs', description: 'Recent global developments, news, and events' },
    { name: 'General Trivia', slug: 'general-trivia', description: 'General facts, culture, and trivia' },
  ],
  science: [
    { name: 'Physics', slug: 'physics', description: 'Mechanics, electricity, optics, thermodynamics, and modern physics' },
    { name: 'Chemistry', slug: 'chemistry', description: 'Organic, inorganic, physical chemistry, and chemical reactions' },
    { name: 'Biology', slug: 'biology', description: 'Cell biology, genetics, human anatomy, ecology, and physiology' },
  ],
};

// Legacy topic mapping dictionary to new Subject slugs
const TOPIC_TO_SUBJECT_SLUG: Record<string, { categorySlug: string; subjectSlug: string }> = {
  DSA: { categorySlug: 'programming', subjectSlug: 'dsa' },
  CPP: { categorySlug: 'programming', subjectSlug: 'dsa' },
  Java: { categorySlug: 'programming', subjectSlug: 'dsa' },
  DBMS: { categorySlug: 'programming', subjectSlug: 'dbms' },
  SQL: { categorySlug: 'programming', subjectSlug: 'dbms' },
  OS: { categorySlug: 'programming', subjectSlug: 'operating-systems' },
  CN: { categorySlug: 'programming', subjectSlug: 'computer-networks' },
  networks: { categorySlug: 'programming', subjectSlug: 'computer-networks' },
  OOP: { categorySlug: 'programming', subjectSlug: 'oop' },
  JavaScript: { categorySlug: 'programming', subjectSlug: 'javascript' },
  javascript: { categorySlug: 'programming', subjectSlug: 'javascript' },
  TypeScript: { categorySlug: 'programming', subjectSlug: 'typescript' },
  typescript: { categorySlug: 'programming', subjectSlug: 'typescript' },
  Python: { categorySlug: 'programming', subjectSlug: 'python' },
  python: { categorySlug: 'programming', subjectSlug: 'python' },
  React: { categorySlug: 'programming', subjectSlug: 'react' },
  react: { categorySlug: 'programming', subjectSlug: 'react' },
};

export async function seedCategoriesAndMigrateQuestions(): Promise<{
  categoriesSeeded: number;
  subjectsSeeded: number;
  questionsMigrated: number;
}> {
  console.log('🚀 Seeding Categories and Subjects...');

  const categoryMap = new Map<string, any>();
  const subjectMap = new Map<string, any>();

  // 1. Seed Categories
  let categoriesCount = 0;
  for (const catData of MASTER_CATEGORIES) {
    const categoryDoc = await categoryRepository.upsertCategory(catData);
    categoryMap.set(catData.slug, categoryDoc);
    categoriesCount++;
  }
  console.log(`✅ Seeded ${categoriesCount} Categories.`);

  // 2. Seed Subjects
  let subjectsCount = 0;
  for (const [catSlug, subjectsList] of Object.entries(MASTER_SUBJECTS)) {
    const categoryDoc = categoryMap.get(catSlug);
    if (!categoryDoc) continue;

    for (const subjData of subjectsList) {
      const subjectDoc = await categoryRepository.upsertSubject({
        categoryId: categoryDoc._id,
        ...subjData,
      });
      subjectMap.set(subjData.slug, subjectDoc);
      subjectsCount++;
    }
  }
  console.log(`✅ Seeded ${subjectsCount} Subjects across Categories.`);

  // 3. Migrate Questions lacking categoryId or subjectId
  console.log('🔄 Migrating Question records to Category & Subject references...');
  const unmigratedQuestions = await QuestionModel.find({
    $or: [{ categoryId: { $exists: false } }, { subjectId: { $exists: false } }, { categoryId: null }, { subjectId: null }],
  });

  let migratedCount = 0;
  for (const qDoc of unmigratedQuestions) {
    const topicStr = (qDoc.topic || '').trim();
    const mapping = TOPIC_TO_SUBJECT_SLUG[topicStr];

    let targetCatDoc = categoryMap.get('programming');
    let targetSubjDoc = subjectMap.get('dsa');

    if (mapping) {
      targetCatDoc = categoryMap.get(mapping.categorySlug) || targetCatDoc;
      targetSubjDoc = subjectMap.get(mapping.subjectSlug) || targetSubjDoc;
    } else if (topicStr) {
      // Try resolving directly by slug match
      const matchedSubj = await categoryRepository.findSubjectByIdOrSlug(topicStr.toLowerCase());
      if (matchedSubj) {
        targetSubjDoc = matchedSubj;
        targetCatDoc = await categoryRepository.findCategoryByIdOrSlug(matchedSubj.categoryId.toString()) || targetCatDoc;
      }
    }

    qDoc.categoryId = targetCatDoc._id;
    qDoc.subjectId = targetSubjDoc._id;
    await qDoc.save();
    migratedCount++;
  }

  console.log(`✨ Question migration completed: ${migratedCount} questions updated with category & subject references.`);

  return {
    categoriesSeeded: categoriesCount,
    subjectsSeeded: subjectsCount,
    questionsMigrated: migratedCount,
  };
}

async function main() {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/codearena';

  console.log('🔌 Connecting to MongoDB for Category & Subject Seeding...');
  try {
    if (primaryUri) {
      await mongoose.connect(primaryUri);
    } else {
      await mongoose.connect(localUri);
    }
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    await mongoose.connect(localUri);
    console.log('✅ Connected to local MongoDB fallback.');
  }

  try {
    await seedCategoriesAndMigrateQuestions();
  } catch (err) {
    console.error('❌ Error during category seeding & question migration:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed-categories.ts')) {
  main().catch(console.error);
}
