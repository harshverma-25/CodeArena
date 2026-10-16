/**
 * Context for generating a quiz thumbnail prompt.
 */
export interface ThumbnailPromptContext {
  subjectName: string;
  categoryName?: string;
  categorySlug?: string;
  description?: string;
  sampleQuestionTopics?: string[];
}

/**
 * Clean and normalize text strings for prompt assembly.
 */
function cleanText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/[^\w\s,.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds a tailored, category-specific prompt for Cloudflare Workers AI text-to-image models.
 * Ensures the primary subject dominates the image and explicitly excludes irrelevant objects
 * like arcade cabinets, generic signboards, watermarks, and embedded text.
 */
export function buildThumbnailPrompt(ctx: ThumbnailPromptContext): string {
  const subject = cleanText(ctx.subjectName);
  const category = cleanText(ctx.categoryName);
  const catSlug = (ctx.categorySlug || '').toLowerCase();
  const desc = cleanText(ctx.description);
  const topics = (ctx.sampleQuestionTopics || [])
    .map(cleanText)
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  const lowerSub = subject.toLowerCase();
  const lowerCat = category.toLowerCase();

  let subjectVisual = '';
  let settingVisual = '';
  let styleVisual = 'polished modern digital illustration, vibrant colors, expressive lighting, centered 1:1 square composition, highly readable at small icon sizes';
  let negativeConstraints = 'no text, no letters, no watermarks, no arcade machines, no game cabinets, no neon signboards';

  // 1. Anime / Manga / Animation
  if (
    lowerSub.includes('anime') ||
    lowerSub.includes('manga') ||
    lowerSub.includes('naruto') ||
    lowerSub.includes('dragon ball') ||
    lowerSub.includes('one piece') ||
    lowerSub.includes('attack on titan') ||
    lowerSub.includes('jujutsu') ||
    catSlug === 'anime'
  ) {
    subjectVisual = 'Original anime character artwork in a scenic landscape with cherry blossom petals, traditional pagodas, and vibrant twilight sky';
    settingVisual = '';
    styleVisual = 'high quality Japanese anime art style, colorful cel-shading, rich cinematic color palette, centered 1:1 square composition';
    negativeConstraints = 'no text, no logo, no arcade machines, no video game cabinets, no arcade signs';
  }
  // 2. Football / Soccer
  else if (
    lowerSub.includes('football') ||
    lowerSub.includes('soccer') ||
    lowerSub.includes('fifa') ||
    lowerSub.includes('premier league') ||
    lowerSub.includes('champions league')
  ) {
    subjectVisual = 'Dynamic soccer players in athletic jerseys competing for a classic football match ball';
    settingVisual = 'lush green stadium pitch under glowing floodlights with goal nets and atmospheric crowd bokeh';
    styleVisual = 'vibrant sports illustration, dynamic action capture, high contrast lighting, clean 1:1 square framing';
  }
  // 3. Cricket
  else if (lowerSub.includes('cricket') || lowerSub.includes('ipl')) {
    subjectVisual = 'Cricket batsman executing a dramatic cover drive shot with wooden cricket wickets and red leather ball in motion';
    settingVisual = 'sunlit green cricket stadium oval with packed grandstands and clear sky';
    styleVisual = 'energetic sports art, clean stylized illustration, balanced 1:1 square composition';
  }
  // 4. Sports (General / Basketball / Tennis etc.)
  else if (
    lowerCat.includes('sport') ||
    catSlug.includes('sport') ||
    lowerSub.includes('sport') ||
    lowerSub.includes('basketball') ||
    lowerSub.includes('tennis')
  ) {
    subjectVisual = `Athletic competition focusing on ${subject}, sporting equipment and active players in motion`;
    settingVisual = 'modern championship stadium arena with vivid court lighting';
    styleVisual = 'dynamic digital sports art, bold energetic composition, centered 1:1 square framing';
  }
  // 5. Programming / Computer Science (DSA, DBMS, Networks, OS, OOP, Web, etc.)
  else if (
    lowerCat.includes('program') ||
    catSlug.includes('program') ||
    lowerSub.includes('code') ||
    lowerSub.includes('dsa') ||
    lowerSub.includes('algorithm') ||
    lowerSub.includes('dbms') ||
    lowerSub.includes('database') ||
    lowerSub.includes('network') ||
    lowerSub.includes('os') ||
    lowerSub.includes('operating system') ||
    lowerSub.includes('oop') ||
    lowerSub.includes('software')
  ) {
    if (lowerSub.includes('dsa') || lowerSub.includes('algorithm')) {
      subjectVisual = 'Glowing 3D binary search tree and algorithmic data node connections with glowing geometric logic paths';
    } else if (lowerSub.includes('dbms') || lowerSub.includes('database')) {
      subjectVisual = 'Glowing cylindrical database servers with cyber data storage blocks and networked holographic flows';
    } else if (lowerSub.includes('network')) {
      subjectVisual = 'Interconnected global network nodes, fiber optic cyber pulses, and glowing server routers';
    } else {
      subjectVisual = 'Software development workspace with monitors showing glowing code editor interfaces and terminal consoles';
    }
    settingVisual = 'sleek minimalist developer desk environment with soft neon ambient cyber accents';
    styleVisual = 'modern isometric tech concept art, glowing neon accents, clean digital composition, 1:1 square framing';
    negativeConstraints = 'no arcade machines, no arcade cabinets, no gibberish text, no watermarks, no messy wires';
  }
  // 6. Science (Physics, Chemistry, Biology)
  else if (
    lowerCat.includes('science') ||
    catSlug.includes('science') ||
    lowerSub.includes('physics') ||
    lowerSub.includes('chemistry') ||
    lowerSub.includes('biology')
  ) {
    if (lowerSub.includes('chem')) {
      subjectVisual = 'Laboratory glass beakers and flasks filled with glowing colorful bubbling chemical reactions';
      settingVisual = 'modern research lab with molecular compound models in background';
    } else if (lowerSub.includes('bio')) {
      subjectVisual = 'Glowing double-helix DNA strand with organic cellular microscope structures and plant biology';
      settingVisual = 'luminescent scientific bio-dome atmosphere with soft green and teal lighting';
    } else if (lowerSub.includes('physics')) {
      subjectVisual = 'Orbiting atomic nucleus particles, wave-particle quantum fields, and cosmic planetary motion';
      settingVisual = 'deep space physics cosmos with glowing electromagnetic field lines';
    } else {
      subjectVisual = `Scientific visual representation of ${subject}, featuring scientific instruments and molecular discoveries`;
      settingVisual = 'atmospheric research observatory with soft ambient scientific lighting';
    }
    styleVisual = 'striking 3D scientific concept art, glowing translucency, balanced 1:1 square composition';
  }
  // 7. World History & Civilizations
  else if (
    lowerSub.includes('history') ||
    lowerSub.includes('polity') ||
    lowerSub.includes('civilization') ||
    lowerSub.includes('ancient') ||
    lowerSub.includes('war')
  ) {
    subjectVisual = 'Majestic ancient architectural monument and historic artifacts, antique parchment scroll, and vintage brass compass';
    settingVisual = 'golden hour atmospheric sunlight over historic ancient stone pillars and palace grounds';
    styleVisual = 'rich cinematic historical art, warm golden lighting, dignified composition, 1:1 square framing';
  }
  // 8. Geography & World Trivia / Flags
  else if (
    lowerSub.includes('geography') ||
    lowerSub.includes('flag') ||
    lowerSub.includes('capital') ||
    lowerSub.includes('world')
  ) {
    if (lowerSub.includes('flag')) {
      subjectVisual = 'Artistic stylized arrangement of colorful international national flags fluttering around a central globe';
    } else {
      subjectVisual = 'Detailed 3D Earth globe with visible mountain continents, oceans, vintage nautical compass rose, and world landmarks';
    }
    settingVisual = 'cosmic planetary orbit with warm atmospheric glow on the horizon';
    styleVisual = 'polished 3D cartographic art, clean geographic textures, centered 1:1 square composition';
  }
  // 9. Entertainment / Cinema / Movies (Marvel, DC, Bollywood, etc.)
  else if (
    lowerCat.includes('entertainment') ||
    catSlug.includes('entertainment') ||
    lowerSub.includes('movie') ||
    lowerSub.includes('cinema') ||
    lowerSub.includes('marvel') ||
    lowerSub.includes('dc') ||
    lowerSub.includes('bollywood')
  ) {
    if (lowerSub.includes('marvel') || lowerSub.includes('dc')) {
      subjectVisual = 'Original stylized superhero in an iconic dynamic heroic pose overlooking a glowing city skyline';
      settingVisual = 'dramatic cinematic atmosphere with lightning sparks and dusk sky';
    } else if (lowerSub.includes('bollywood')) {
      subjectVisual = 'Glamorous cinema set with classic film camera, golden film reel, and dazzling theatrical stage chandeliers';
      settingVisual = 'vibrant cinematic movie stage with warm festive amber lighting';
    } else {
      subjectVisual = 'Cinematic film camera with classic movie clapperboard, film reels, and dramatic spotlight';
      settingVisual = 'theatrical cinema premiere stage with red velvet and dramatic atmospheric lighting';
    }
    styleVisual = 'cinematic digital concept art, rich lighting and shadows, centered 1:1 square composition';
    negativeConstraints = 'no arcade machines, no game cabinets, no copyrighted character logos, no text';
  }
  // 10. Math, Aptitude & Logic
  else if (
    lowerCat.includes('aptitude') ||
    lowerCat.includes('math') ||
    lowerSub.includes('math') ||
    lowerSub.includes('logic') ||
    lowerSub.includes('puzzle')
  ) {
    subjectVisual = 'Intricate glowing polyhedrons, floating mathematical geometry, abacus counters, and tactical chess pieces';
    settingVisual = 'sleek dark reflective puzzle board with soft purple and teal neon illumination';
    styleVisual = 'clean geometric 3D art, modern abstract puzzle aesthetic, centered 1:1 square framing';
  }
  // 11. General / Custom Fallback
  else {
    const contextualHint = desc ? `representing ${desc.slice(0, 80)}` : `focusing on ${subject}`;
    subjectVisual = `Artistic representation of ${subject}, ${contextualHint}`;
    settingVisual = 'clean themed studio setting with cohesive atmospheric lighting';
    styleVisual = 'polished digital concept art, vibrant colors, clean lighting, centered 1:1 square composition';
  }

  // Include safe topic keywords if available to sharpen contextual relevance
  const topicDetails = topics ? `incorporating visual motifs of ${topics}` : '';

  // Combine into a cohesive, concise prompt within token limits
  const promptParts = [
    subjectVisual,
    topicDetails,
    settingVisual,
    styleVisual,
    negativeConstraints,
  ].filter(Boolean);

  return promptParts.join(', ');
}
