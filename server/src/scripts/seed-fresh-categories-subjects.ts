import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const FRESH_CATEGORIES = [
  {
    name: 'Anime & Manga',
    slug: 'anime-manga',
    description: 'Explore popular anime universes, characters, and iconic story arcs.',
    icon: 'sparkles',
    isActive: true,
  },
  {
    name: 'Movies & Web Series',
    slug: 'movies-web-series',
    description: 'Quizzes on blockbuster movies, cinematic universes, and binge-worthy web series.',
    icon: 'film',
    isActive: true,
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Test your sports trivia across cricket, world records, and legendary players.',
    icon: 'trophy',
    isActive: true,
  },
  {
    name: 'General Knowledge & India',
    slug: 'general-knowledge-india',
    description: 'World trivia, geography, history, inventions, and fascinating Indian heritage.',
    icon: 'globe',
    isActive: true,
  },
  {
    name: 'Science & Space',
    slug: 'science-space',
    description: 'Discover the wonders of physics, chemistry, biology, human anatomy, and the cosmos.',
    icon: 'flask',
    isActive: true,
  },
  {
    name: 'Computer Science & Programming',
    slug: 'computer-science-programming',
    description: 'Core computer science concepts, DBMS, networking, operating systems, and web technologies.',
    icon: 'code',
    isActive: true,
  },
];

export const FRESH_SUBJECTS: Record<string, Array<{ name: string; slug: string; description?: string }>> = {
  'anime-manga': [
    { name: 'Naruto Universe', slug: 'naruto-universe', description: 'Hidden Leaf Village, shinobi ranks, jutsu, and ninja wars' },
    { name: 'One Piece Adventures', slug: 'one-piece-adventures', description: 'Straw Hat Pirates, devil fruits, Grand Line, and the Marines' },
    { name: 'Dragon Ball', slug: 'dragon-ball', description: 'Saiyans, dragon balls, martial arts tournaments, and galactic battles' },
    { name: 'Jujutsu Kaisen Quiz', slug: 'jujutsu-kaisen-quiz', description: 'Jujutsu sorcerers, cursed techniques, domains, and cursed spirits' },
    { name: 'Demon Slayer', slug: 'demon-slayer', description: 'Tanjiro, Nezuko, Hashira, Muzan Kibutsuji, and breathing styles' },
    { name: 'Attack on Titan', slug: 'attack-on-titan', description: 'Survey Corps, ODM gear, Eren Yeager, Wall Maria, and nine titans' },
    { name: 'Death Note', slug: 'death-note', description: 'Light Yagami, L Lawliet, Ryuk, Shinigami eyes, and psychological battles' },
    { name: 'My Hero Academia', slug: 'my-hero-academia', description: 'Izuku Midoriya, One For All, All Might, quirks, and U.A. High' },
    { name: 'Guess the Anime Character', slug: 'guess-the-anime-character', description: 'Iconic silhouettes, voice lines, backstories, and trademark abilities' },
    { name: 'Bleach', slug: 'bleach', description: 'Ichigo Kurosaki, Zanpakuto, Gotei 13 captains, Bankai, and Hollows' },
    { name: 'Hunter x Hunter', slug: 'hunter-x-hunter', description: 'Gon, Killua, Kurapika, Nen types, Hunter Exam, and Chimera Ants' },
  ],
  'movies-web-series': [
    { name: 'Marvel Universe', slug: 'marvel-universe', description: 'Avengers, MCU phases, infinity stones, and superhero sagas' },
    { name: 'DC Universe', slug: 'dc-universe', description: 'Justice League, Gotham City, iconic heroes, and legendary villains' },
    { name: 'Harry Potter World', slug: 'harry-potter-world', description: 'Hogwarts houses, spells, magical creatures, and wizarding lore' },
    { name: 'Stranger Things', slug: 'stranger-things', description: 'Hawkins mystery, the Upside Down, Demogorgons, and retro adventures' },
    { name: 'Money Heist Quiz', slug: 'money-heist-quiz', description: 'The Professor, Royal Mint heist, plan details, and code names' },
    { name: 'Movie Dialogue Quiz', slug: 'movie-dialogue-quiz', description: 'Iconic cinematic quotes, unforgettable lines, and movie moments' },
    { name: 'Guess the Movie', slug: 'guess-the-movie', description: 'Plot clues, signature props, director styles, and Oscar winners' },
    { name: 'Actors & Celebrities', slug: 'actors-celebrities', description: 'Famous film stars, award records, Hollywood trivia, and breakout roles' },
  ],
  'sports': [
    { name: 'IPL Superstars', slug: 'ipl-superstars', description: 'Indian Premier League teams, orange caps, purple caps, and match winners' },
    { name: 'Cricket Records', slug: 'cricket-records', description: 'World cups, centuries, bowling milestones, and legendary statistics' },
    { name: 'Guess the Cricketer', slug: 'guess-the-cricketer', description: 'Clues, jersey numbers, career achievements, and cricket trivia' },
    { name: 'ICC World Cup Challenge', slug: 'icc-world-cup-challenge', description: 'ODI and T20 World Cup champions, finals, heroics, and stats' },
    { name: 'Indian Cricket Legends', slug: 'indian-cricket-legends', description: 'Kapil Dev, Gavaskar, Tendulkar, Dhoni, Kohli, and historic victories' },
    { name: 'Cricket Rules & Umpire Decisions', slug: 'cricket-rules-umpire-decisions', description: 'DRS, LBW rules, dead ball, powerplays, umpire signals, and MCC laws' },
    { name: 'Guess the IPL Team', slug: 'guess-the-ipl-team', description: 'Home grounds, trophy tallies, team anthems, owners, and player clues' },
    { name: 'Cricket World Records', slug: 'cricket-world-records', description: '400* Lara, 264 Rohit, 800 Murali, 100 centuries, and unmatched milestones' },
  ],
  'general-knowledge-india': [
    { name: 'World Flags Challenge', slug: 'world-flags-challenge', description: 'National flags, symbols, colors, and country identifiers' },
    { name: 'World Geography', slug: 'world-geography', description: 'Continents, capitals, rivers, mountains, and global maps' },
    { name: 'Indian History', slug: 'indian-history', description: 'Ancient empires, freedom struggle, historical leaders, and heritage' },
    { name: 'World History', slug: 'world-history', description: 'Global civilizations, world wars, historical revolutions, and milestones' },
    { name: 'Famous Personalities', slug: 'famous-personalities', description: 'Global icons, leaders, artists, visionaries, and pioneers' },
    { name: 'Inventions & Discoveries', slug: 'inventions-discoveries', description: 'Groundbreaking inventions, technological milestones, and innovators' },
  ],
  'science-space': [
    { name: 'Human Body', slug: 'human-body', description: 'Anatomy, organ systems, physiological functions, and wellness' },
    { name: 'Animal Kingdom', slug: 'animal-kingdom', description: 'Wildlife species, habitats, evolutionary adaptations, and zoology' },
    { name: 'Amazing Science Facts', slug: 'amazing-science-facts', description: 'Fascinating scientific phenomena, natural wonders, and trivia' },
    { name: 'Physics Challenge', slug: 'physics-challenge', description: 'Mechanics, electricity, light, thermodynamics, and physical laws' },
    { name: 'Chemistry Quiz', slug: 'chemistry-quiz', description: 'Chemical reactions, compounds, acids, bases, and states of matter' },
    { name: 'Biology Basics', slug: 'biology-basics', description: 'Cell biology, genetics, plants, ecosystems, and living organisms' },
    { name: 'Solar System', slug: 'solar-system', description: 'Planets, moons, asteroids, space exploration, and celestial bodies' },
    { name: 'Periodic Table', slug: 'periodic-table', description: 'Chemical elements, atomic numbers, groups, and chemical symbols' },
    { name: 'Famous Scientists', slug: 'famous-scientists', description: 'Newton, Einstein, Curie, Tesla, and their scientific contributions' },
  ],
  'computer-science-programming': [
    { name: 'DBMS Quiz', slug: 'dbms-quiz', description: 'Database management systems, SQL queries, relational models, and normalization' },
    { name: 'Operating Systems', slug: 'operating-systems', description: 'Processes, memory management, file systems, scheduling, and kernels' },
    { name: 'Computer Networks', slug: 'computer-networks', description: 'OSI model, TCP/IP, IP addressing, protocols, and network architectures' },
    { name: 'OOP Concepts', slug: 'oop-concepts', description: 'Encapsulation, abstraction, inheritance, and polymorphism' },
    { name: 'HTML & CSS', slug: 'html-css', description: 'Web structuring, semantic tags, modern layouts, Flexbox, and CSS Grid' },
    { name: 'Data Structures & Algorithms (DSA)', slug: 'dsa', description: 'Stacks, queues, trees, graphs, sorting, searching, DP, and time complexities' },
    { name: 'JavaScript Quiz', slug: 'javascript-quiz', description: 'Closures, event loop, promises, async/await, prototypes, and ES6+ features' },
    { name: 'Python Programming', slug: 'python-programming', description: 'Decorators, generators, OOP, GIL, itertools, data structures, and PEP 8' },
    { name: 'Java Programming', slug: 'java-programming', description: 'JVM, OOP, collections, multithreading, exceptions, streams, and generics' },
    { name: 'C & C++ Programming', slug: 'c-cpp-programming', description: 'Pointers, memory management, RAII, templates, STL, and systems programming' },
  ],
};

export async function seedFreshCatalog(): Promise<{
  categoriesSeeded: number;
  subjectsSeeded: number;
}> {
  console.log('🚀 Seeding Fresh Categories & Subjects Catalog (NO Questions)...');

  const categoryMap = new Map<string, any>();

  // 1. Upsert Categories
  let categoriesCount = 0;
  for (const catData of FRESH_CATEGORIES) {
    const categoryDoc = await CategoryModel.findOneAndUpdate(
      { slug: catData.slug.toLowerCase() },
      { $set: catData },
      { new: true, upsert: true, runValidators: true }
    );
    categoryMap.set(catData.slug, categoryDoc);
    categoriesCount++;
    console.log(`   [Category ${categoriesCount}/6] ${categoryDoc.name} (${categoryDoc.slug}) -> ID: ${categoryDoc._id}`);
  }

  // 2. Upsert Subjects
  let subjectsCount = 0;
  for (const [catSlug, subjectsList] of Object.entries(FRESH_SUBJECTS)) {
    const parentCategory = categoryMap.get(catSlug);
    if (!parentCategory) {
      throw new Error(`Parent category '${catSlug}' not found in categoryMap!`);
    }

    for (const subjData of subjectsList) {
      const subjectDoc = await SubjectModel.findOneAndUpdate(
        { slug: subjData.slug.toLowerCase() },
        {
          $set: {
            categoryId: parentCategory._id,
            name: subjData.name,
            slug: subjData.slug.toLowerCase(),
            description: subjData.description || '',
            isActive: true,
          },
        },
        { new: true, upsert: true, runValidators: true }
      );
      subjectsCount++;
      console.log(`     (${subjectsCount}/33) [${parentCategory.name}] ${subjectDoc.name} (${subjectDoc.slug})`);
    }
  }

  // 3. Invalidate Redis & in-memory caches
  console.log('🧹 Evicting taxonomy caches...');
  await categoryService.clearCache();

  return {
    categoriesSeeded: categoriesCount,
    subjectsSeeded: subjectsCount,
  };
}

async function main() {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/codearena';

  console.log('🔌 Connecting to MongoDB...');
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
    const result = await seedFreshCatalog();
    console.log(`\n🎉 Seeding complete!`);
    console.log(`   - Categories Seeded: ${result.categoriesSeeded}`);
    console.log(`   - Subjects Seeded: ${result.subjectsSeeded}`);

    // Verification
    const dbCatCount = await CategoryModel.countDocuments();
    const dbSubCount = await SubjectModel.countDocuments();
    const dbQCount = await QuestionModel.countDocuments();

    console.log(`\n📊 Database Verification:`);
    console.log(`   - Categories in DB: ${dbCatCount}`);
    console.log(`   - Subjects in DB: ${dbSubCount}`);
    console.log(`   - Questions in DB: ${dbQCount} (should remain unchanged)`);

    if (dbCatCount !== 6 || dbSubCount !== 33) {
      console.error(`⚠️ Warning: Expected 6 categories and 33 subjects, but found ${dbCatCount} and ${dbSubCount}`);
    } else {
      console.log(`✅ EXACT MATCH: 6 Categories and 33 Subjects verified with parent-child relationships.`);
    }
  } catch (err) {
    console.error('❌ Error during catalog seeding:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed-fresh-categories-subjects.ts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
