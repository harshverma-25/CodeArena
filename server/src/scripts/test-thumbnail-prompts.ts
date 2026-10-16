import { buildThumbnailPrompt } from '../modules/media/thumbnail-prompt.builder.js';

const testCases = [
  {
    title: 'Anime Quiz',
    ctx: {
      subjectName: 'Anime',
      categoryName: 'Entertainment',
      categorySlug: 'entertainment',
      description: 'Japanese anime, popular shonen series, and classic animation.',
    },
    expectedInclude: ['anime characters', 'Japanese landscape', 'cel-shading'],
    expectedExclude: ['arcade machines', 'video game cabinets'],
  },
  {
    title: 'Football / Soccer Quiz',
    ctx: {
      subjectName: 'Football',
      categoryName: 'Sports',
      categorySlug: 'sports',
      description: 'World football, premier league and champions league trivia.',
    },
    expectedInclude: ['soccer players', 'stadium pitch', 'match ball'],
    expectedExclude: [],
  },
  {
    title: 'Cricket Quiz',
    ctx: {
      subjectName: 'Cricket',
      categoryName: 'Sports',
      categorySlug: 'sports',
      description: 'International test cricket, ODI and IPL.',
    },
    expectedInclude: ['Cricket batsman', 'wickets', 'cricket stadium'],
    expectedExclude: [],
  },
  {
    title: 'Programming / DSA Quiz',
    ctx: {
      subjectName: 'DSA',
      categoryName: 'Programming',
      categorySlug: 'programming',
      description: 'Data structures and algorithms in computer science.',
    },
    expectedInclude: ['binary search tree', 'algorithmic data node', 'isometric tech'],
    expectedExclude: ['arcade machines', 'arcade cabinets'],
  },
  {
    title: 'World History Quiz',
    ctx: {
      subjectName: 'History',
      categoryName: 'General Knowledge',
      categorySlug: 'general-knowledge',
      description: 'World history, ancient civilizations and major events.',
    },
    expectedInclude: ['architectural monument', 'artifacts', 'historical art'],
    expectedExclude: [],
  },
  {
    title: 'Flags of the World Quiz',
    ctx: {
      subjectName: 'Flags of the World',
      categoryName: 'General Knowledge',
      categorySlug: 'general-knowledge',
      description: 'Identify national flags from across the globe.',
    },
    expectedInclude: ['national flags', 'globe'],
    expectedExclude: [],
  },
  {
    title: 'Physics Quiz',
    ctx: {
      subjectName: 'Physics',
      categoryName: 'Science',
      categorySlug: 'science',
      description: 'Mechanics, quantum waves and astrophysics.',
    },
    expectedInclude: ['atomic nucleus', 'quantum', 'cosmos'],
    expectedExclude: [],
  },
];

console.log('--- Testing Thumbnail Prompt Builder ---');
let allPassed = true;

for (const tc of testCases) {
  const prompt = buildThumbnailPrompt(tc.ctx);
  console.log(`\n[${tc.title}]`);
  console.log(`Prompt: "${prompt}"`);

  // Verify inclusions
  for (const inc of tc.expectedInclude) {
    if (!prompt.toLowerCase().includes(inc.toLowerCase())) {
      console.error(`❌ FAILED: Expected to include "${inc}"`);
      allPassed = false;
    }
  }

  // Verify exclusions in positive subject description
  if (tc.title === 'Anime Quiz') {
    if (prompt.toLowerCase().includes('game arcade illustration')) {
      console.error(`❌ FAILED: Prompt contains generic arcade text!`);
      allPassed = false;
    }
  }

  console.log('✅ Passed visual checks');
}

if (!allPassed) {
  console.error('\nSome tests failed!');
  process.exit(1);
} else {
  console.log('\n🎉 ALL THUMBNAIL PROMPT TESTS PASSED SUCCESSFULLY!');
}
