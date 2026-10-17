import mongoose, { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { mediaService } from '../modules/media/media.service.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface NewSubjectSpec {
  categorySlug: string;
  categoryName: string;
  subjectName: string;
  subjectSlug: string;
  description: string;
  questionFile: string;
  fallbackImageUrl: string;
}

const NEW_SUBJECTS: NewSubjectSpec[] = [
  // 1. Anime & Manga
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'Demon Slayer',
    subjectSlug: 'demon-slayer',
    description: 'Tanjiro, Nezuko, Hashira, Muzan Kibutsuji, and breathing styles',
    questionFile: 'demon-slayer.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'Attack on Titan',
    subjectSlug: 'attack-on-titan',
    description: 'Survey Corps, ODM gear, Eren Yeager, Wall Maria, and nine titans',
    questionFile: 'attack-on-titan.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'Death Note',
    subjectSlug: 'death-note',
    description: 'Light Yagami, L Lawliet, Ryuk, Shinigami eyes, and psychological battles',
    questionFile: 'death-note.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'My Hero Academia',
    subjectSlug: 'my-hero-academia',
    description: 'Izuku Midoriya, One For All, All Might, quirks, and U.A. High',
    questionFile: 'my-hero-academia.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'Guess the Anime Character',
    subjectSlug: 'guess-the-anime-character',
    description: 'Iconic silhouettes, voice lines, backstories, and trademark abilities',
    questionFile: 'guess-anime-character.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'Bleach',
    subjectSlug: 'bleach',
    description: 'Ichigo Kurosaki, Zanpakuto, Gotei 13 captains, Bankai, and Hollows',
    questionFile: 'bleach.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'anime-manga',
    categoryName: 'Anime & Manga',
    subjectName: 'Hunter x Hunter',
    subjectSlug: 'hunter-x-hunter',
    description: 'Gon, Killua, Kurapika, Nen types, Hunter Exam, and Chimera Ants',
    questionFile: 'hunter-x-hunter.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },

  // 2. Movies & Web Series
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectName: 'Guess the Movie',
    subjectSlug: 'guess-the-movie',
    description: 'Plot clues, signature props, director styles, and Oscar winners',
    questionFile: 'guess-the-movie.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'movies-web-series',
    categoryName: 'Movies & Web Series',
    subjectName: 'Actors & Celebrities',
    subjectSlug: 'actors-celebrities',
    description: 'Famous film stars, award records, Hollywood trivia, and breakout roles',
    questionFile: 'actors-celebrities.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
  },

  // 3. Sports
  {
    categorySlug: 'sports',
    categoryName: 'Sports',
    subjectName: 'ICC World Cup Challenge',
    subjectSlug: 'icc-world-cup-challenge',
    description: 'ODI and T20 World Cup champions, finals, heroics, and stats',
    questionFile: 'icc-world-cup.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'sports',
    categoryName: 'Sports',
    subjectName: 'Indian Cricket Legends',
    subjectSlug: 'indian-cricket-legends',
    description: 'Kapil Dev, Gavaskar, Tendulkar, Dhoni, Kohli, and historic victories',
    questionFile: 'indian-cricket-legends.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'sports',
    categoryName: 'Sports',
    subjectName: 'Cricket Rules & Umpire Decisions',
    subjectSlug: 'cricket-rules-umpire-decisions',
    description: 'DRS, LBW rules, dead ball, powerplays, umpire signals, and MCC laws',
    questionFile: 'cricket-rules.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'sports',
    categoryName: 'Sports',
    subjectName: 'Guess the IPL Team',
    subjectSlug: 'guess-the-ipl-team',
    description: 'Home grounds, trophy tallies, team anthems, owners, and player clues',
    questionFile: 'guess-ipl-team.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'sports',
    categoryName: 'Sports',
    subjectName: 'Cricket World Records',
    subjectSlug: 'cricket-world-records',
    description: '400* Lara, 264 Rohit, 800 Murali, 100 centuries, and unmatched milestones',
    questionFile: 'cricket-world-records.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=800&auto=format&fit=crop&q=80',
  },

  // 4. Computer Science & Programming
  {
    categorySlug: 'computer-science-programming',
    categoryName: 'Computer Science & Programming',
    subjectName: 'Data Structures & Algorithms (DSA)',
    subjectSlug: 'dsa',
    description: 'Stacks, queues, trees, graphs, sorting, searching, DP, and time complexities',
    questionFile: 'dsa.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'computer-science-programming',
    categoryName: 'Computer Science & Programming',
    subjectName: 'JavaScript Quiz',
    subjectSlug: 'javascript-quiz',
    description: 'Closures, event loop, promises, async/await, prototypes, and ES6+ features',
    questionFile: 'javascript.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'computer-science-programming',
    categoryName: 'Computer Science & Programming',
    subjectName: 'Python Programming',
    subjectSlug: 'python-programming',
    description: 'Decorators, generators, OOP, GIL, itertools, data structures, and PEP 8',
    questionFile: 'python.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'computer-science-programming',
    categoryName: 'Computer Science & Programming',
    subjectName: 'Java Programming',
    subjectSlug: 'java-programming',
    description: 'JVM, OOP, collections, multithreading, exceptions, streams, and generics',
    questionFile: 'java.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  },
  {
    categorySlug: 'computer-science-programming',
    categoryName: 'Computer Science & Programming',
    subjectName: 'C & C++ Programming',
    subjectSlug: 'c-cpp-programming',
    description: 'Pointers, memory management, RAII, templates, STL, and systems programming',
    questionFile: 'c-cpp.json',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  },
];

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB at', uri);
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const results: Array<{
    subjectName: string;
    categoryName: string;
    thumbnailUrl: string;
    questionsCount: number;
    status: string;
  }> = [];

  for (let i = 0; i < NEW_SUBJECTS.length; i++) {
    const spec = NEW_SUBJECTS[i];
    console.log(`\n======================================================`);
    console.log(`[${i + 1}/${NEW_SUBJECTS.length}] Processing "${spec.subjectName}" (${spec.categoryName})...`);

    // 1. Find category
    const cat = await CategoryModel.findOne({ slug: spec.categorySlug });
    if (!cat) {
      console.error(`❌ Category '${spec.categorySlug}' not found! Skipping.`);
      continue;
    }

    // 2. Find or create Subject
    let subj = await SubjectModel.findOne({ slug: spec.subjectSlug });
    if (!subj) {
      subj = new SubjectModel({
        categoryId: cat._id,
        name: spec.subjectName,
        slug: spec.subjectSlug,
        description: spec.description,
        icon: '',
        isActive: true,
        playedCount: Math.floor(Math.random() * 15) + 5,
      });
      await subj.save();
      console.log(`   ✨ Created Subject "${spec.subjectName}" (ID: ${subj._id})`);
    } else {
      subj.categoryId = cat._id as any;
      subj.description = spec.description;
      subj.isActive = true;
      console.log(`   🔍 Found existing Subject "${spec.subjectName}" (ID: ${subj._id})`);
    }

    // 3. Thumbnail generation or upload
    if (subj.thumbnailUrl && subj.thumbnailUrl.includes('cloudinary.com') && !process.env.FORCE_REGENERATE) {
      console.log(`   🖼️ Using existing Cloudinary thumbnail: ${subj.thumbnailUrl}`);
    } else {
      let finalThumbnailUrl = '';
      try {
        console.log(`   🎨 Attempting AI image generation...`);
        finalThumbnailUrl = await mediaService.generateAndUploadSubjectThumbnail(
          spec.subjectName,
          spec.categoryName,
          {
            categorySlug: spec.categorySlug,
            description: spec.description,
          }
        );
        console.log(`   ✅ AI Thumbnail generated & uploaded: ${finalThumbnailUrl}`);
      } catch (err: any) {
        console.warn(`   ⚠️ AI generation fallback (${err.message}). Uploading verified Cloudinary thumbnail...`);
        try {
          const sanitizedSlug = spec.subjectSlug.replace(/[^a-z0-9]+/g, '-');
          finalThumbnailUrl = await mediaService.uploadImage(spec.fallbackImageUrl, {
            folder: 'quizzy/thumbnails',
            publicId: `thumb-${sanitizedSlug}-${Date.now()}`,
          });
          console.log(`   ✅ Thumbnail uploaded to Cloudinary: ${finalThumbnailUrl}`);
        } catch (uploadErr: any) {
          console.error(`   ⚠️ Fallback upload error:`, uploadErr?.message || uploadErr);
          finalThumbnailUrl = spec.fallbackImageUrl;
        }
      }

      subj.thumbnailUrl = finalThumbnailUrl;
      await subj.save();
    }

    // 4. Load questions from JSON
    const questionsPath = path.resolve(process.cwd(), 'src/scripts/questions', spec.questionFile);
    if (!fs.existsSync(questionsPath)) {
      console.error(`   ❌ Question file not found: ${questionsPath}`);
      continue;
    }

    const questionsData: any[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
    console.log(`   📝 Loading ${questionsData.length} questions from ${spec.questionFile}...`);

    let inserted = 0;
    let updated = 0;
    const now = new Date();

    for (const q of questionsData) {
      const doc = {
        questionId: q.questionId,
        categoryId: cat._id,
        subjectId: subj._id,
        topic: q.topic || spec.subjectName,
        difficulty: q.difficulty || 'medium',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        isPublished: true,
        updatedAt: now,
      };

      const res = await QuestionModel.updateOne(
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

    const totalQuestions = await QuestionModel.countDocuments({ subjectId: subj._id });
    console.log(`   ✨ Questions: ${inserted} inserted, ${updated} updated. Total in DB: ${totalQuestions}`);

    results.push({
      subjectName: spec.subjectName,
      categoryName: spec.categoryName,
      thumbnailUrl: subj.thumbnailUrl || 'N/A',
      questionsCount: totalQuestions,
      status: 'Ready & Playable',
    });

    // Brief pause between subjects
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`\n======================================================`);
  console.log(`🧹 Clearing Redis taxonomy cache...`);
  await categoryService.clearCache();
  console.log(`✅ Redis cache cleared.`);

  console.log(`\n🎉 SEEDING COMPLETE FOR ALL 19 SUBJECTS!`);
  console.table(
    results.map((r) => ({
      Subject: r.subjectName,
      Category: r.categoryName,
      Questions: r.questionsCount,
      Status: r.status,
      Thumbnail: r.thumbnailUrl.slice(0, 60) + '...',
    }))
  );

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

main().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
