import { buildThumbnailPrompt } from '../modules/media/thumbnail-prompt.builder.js';

const testTitles = [
  { name: 'Harry Potter World', cat: 'Movies & Web Series', slug: 'movies-web-series' },
  { name: 'Marvel Universe', cat: 'Movies & Web Series', slug: 'movies-web-series' },
  { name: 'Naruto Universe', cat: 'Anime & Manga', slug: 'anime-manga' },
  { name: 'One Piece Adventures', cat: 'Anime & Manga', slug: 'anime-manga' },
  { name: 'Solar System', cat: 'Science & Space', slug: 'science-space' },
  { name: 'IPL Superstars', cat: 'Sports', slug: 'sports' },
  { name: 'World Flags Challenge', cat: 'General Knowledge & India', slug: 'general-knowledge-india' },
];

console.log('================================================================');
console.log('TITLE-FIRST PROMPT BUILDER VERIFICATION');
console.log('================================================================\n');

for (const t of testTitles) {
  const prompt = buildThumbnailPrompt({
    subjectName: t.name,
    categoryName: t.cat,
    categorySlug: t.slug,
  });

  console.log(`📌 Title: "${t.name}" [Category: ${t.cat}]`);
  console.log(`Prompt:`);
  console.log(prompt);
  console.log('----------------------------------------------------------------\n');
}
