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
 * Subject-specific prompt definitions ensuring the exact quiz title and named franchise
 * dictate the visual imagery, strictly preventing generic category overrides.
 */
const SPECIFIC_SUBJECT_PROMPTS: Record<
  string,
  {
    subjectVisual: string;
    settingVisual: string;
    styleVisual: string;
    negativeConstraints: string;
  }
> = {
  // --- ANIME & MANGA ---
  'naruto universe': {
    subjectVisual:
      'Naruto Uzumaki with his iconic spiky blond hair, wearing his classic orange-and-blue ninja jumpsuit with the Konoha leaf village forehead protector headband, summoning a swirling glowing cyan Rasengan energy sphere in his hand',
    settingVisual: 'scenic Hidden Leaf Village with Hokage stone monument faces in the mountain background under clear twilight skies',
    styleVisual: 'high quality cinematic Japanese anime art style, vibrant cel-shading, dynamic action composition, centered 1:1 square framing',
    negativeConstraints: 'no Earth globe, no generic samurai, no modern city, no arcade machines, no text, no letters',
  },
  'one piece adventures': {
    subjectVisual:
      'Monkey D. Luffy wearing his iconic red vest and woven straw hat with red ribbon, standing triumphantly with fist raised on the wooden deck of the pirate ship Thousand Sunny with jolly roger flag',
    settingVisual: 'sun-drenched azure Grand Line tropical ocean with billowing white clouds and distant sea king silhouette',
    styleVisual: 'vibrant Japanese pirate adventure anime art style, rich cel-shading, bold energetic heroic framing, centered 1:1 square composition',
    negativeConstraints: 'no generic dark pirate ships, no realistic photos, no Earth globe, no arcade machines, no text, no letters',
  },
  'dragon ball': {
    subjectVisual:
      'Son Goku in his iconic orange martial arts dogi gi with blue sash and wristbands, spiky black hair with golden Super Saiyan aura flames radiating around him, gathering a glowing blue Kamehameha energy ball between his palms',
    settingVisual: 'dramatic desert canyon battlefield with floating shattered rock debris and radiant ki energy flares',
    styleVisual: 'classic high-octane Japanese shonen anime art style, powerful energy highlights, clean 1:1 square framing',
    negativeConstraints: 'no generic fighters, no western superheroes, no arcade machines, no text, no letters',
  },
  'jujutsu kaisen quiz': {
    subjectVisual:
      'Jujutsu sorcerer Satoru Gojo with iconic spiky white hair and sleek black blindfold, performing domain expansion hand signs with swirling blue and red cursed energy orbs orbiting around him, standing alongside Yuji Itadori',
    settingVisual: 'mysterious infinite void domain expansion with dark celestial reflections and glowing cursed aura',
    styleVisual: 'dark modern fantasy anime art style, high contrast neon cursed energy lighting, centered 1:1 square composition',
    negativeConstraints: 'no generic ninjas, no medieval knights, no arcade machines, no text, no letters',
  },
  'demon slayer': {
    subjectVisual:
      'Tanjiro Kamado in his checkered green-and-black haori wielding a black Nichirin sword unleashing glowing swirling water and fiery Hinokami Kagura sun breathing dragons, alongside Nezuko Kamado in bamboo muzzle',
    settingVisual: 'moonlit mystical forest with falling pink wisteria blossoms and swirling ember particles',
    styleVisual: 'high-end Ufotable inspired Japanese anime art style, dynamic breathing technique elemental effects, centered 1:1 square framing',
    negativeConstraints: 'no modern firearms, no generic knights, no arcade machines, no text, no letters',
  },
  'attack on titan': {
    subjectVisual:
      'Eren Yeager in muscular Attack Titan form roaring ferociously, steam rising from his body, beside Survey Corps Scout soldiers flying with ODM gear and twin steel blades against the gigantic 50-meter Wall Maria',
    settingVisual: 'smoky Shiganshina district battlefield with colossal Titan steam plumes against a dramatic sunset sky',
    styleVisual: 'epic dark anime concept art, gritty cinematic atmosphere, volumetric lighting, centered 1:1 square composition',
    negativeConstraints: 'no bright comedy cartoons, no futuristic spaceships, no text, no letters',
  },
  'death note': {
    subjectVisual:
      'Ryuk the towering Shinigami with glowing amber eyes and dark feathery wings holding a shiny red apple, hovering ominously behind a black leather notebook labeled with subtle mystical aura and a white quill pen',
    settingVisual: 'moody dark Tokyo bedroom illuminated by cool moonlight and glowing monitor screen in shadows',
    styleVisual: 'dark supernatural psychological thriller anime art, high contrast chiaroscuro lighting, centered 1:1 square composition',
    negativeConstraints: 'no colorful bright cartoons, no weapons, no arcade machines, no text, no letters',
  },
  'my hero academia': {
    subjectVisual:
      'Izuku Midoriya (Deku) in his hero costume channeling One For All Full Cowl with crackling neon-emerald lightning energy, alongside All Might in heroic golden age silhouette with radiant smile',
    settingVisual: 'U.A. High School heroic training grounds with dynamic dust clouds and blue sky',
    styleVisual: 'vibrant comic book style anime art, high-energy superhero highlights, centered 1:1 square composition',
    negativeConstraints: 'no dark horror elements, no generic soldiers, no text, no letters',
  },
  'guess the anime character': {
    subjectVisual:
      'A mysterious glowing anime protagonist silhouette holding a katana, surrounded by iconic anime elements — dragon balls, shinobi headband, pirate hat, and colorful aura orbs with sparkling question mark particles',
    settingVisual: 'stage spotlight illumination with dynamic swirling anime energy beams and starburst bokeh',
    styleVisual: 'modern anime celebration art, vibrant neon pop colors, dynamic mystery composition, centered 1:1 square framing',
    negativeConstraints: 'no realistic photos, no blurry mess, no arcade machines, no text, no letters',
  },
  'bleach': {
    subjectVisual:
      'Soul Reaper Ichigo Kurosaki wielding the massive black Tensa Zangetsu blade releasing swirling red and black Getsuga Tensho spiritual pressure energy, with partial white hollow mask appearing',
    settingVisual: 'atmospheric Soul Society rooftop over the Seireitei with full moon in the dark starry sky',
    styleVisual: 'stylish high-contrast supernatural shonen anime art, intense spiritual reiatsu energy lighting, centered 1:1 square composition',
    negativeConstraints: 'no medieval knights, no guns, no arcade machines, no text, no letters',
  },
  'hunter x hunter': {
    subjectVisual:
      'Gon Freecss charging golden Jajanken aura in his fist alongside Killua Zoldyck surrounded by crackling electric blue Godspeed lightning sparks and Kurapika with glowing chains',
    settingVisual: 'dramatic World Tree and Hunter Exam arena with radiant Nen aura flares',
    styleVisual: 'dynamic modern shonen anime art style, vivid vibrant Nen aura effects, centered 1:1 square composition',
    negativeConstraints: 'no generic ninjas, no modern army, no arcade machines, no text, no letters',
  },

  // --- MOVIES & WEB SERIES ---
  'harry potter world': {
    subjectVisual:
      'Harry Potter with round wire-rim glasses and lightning-bolt scar, holding a glowing brown holly wand emitting golden magical sparks, with a fluttering golden snitch with delicate wings hovering nearby, and the magnificent silhouette of Hogwarts Castle with gothic towers and candlelit stained-glass windows',
    settingVisual: 'misty Scottish highland lakeside at night with a full moon illuminating Hogwarts Castle and floating candles',
    styleVisual: 'rich cinematic wizarding fantasy illustration, warm ambient spell glow, dramatic atmospheric lighting, centered 1:1 square composition',
    negativeConstraints: 'no planet Earth, no outer space, no superheroes, no modern city, no generic fantasy, no arcade machines, no text, no letters',
  },
  'marvel universe': {
    subjectVisual:
      'The Avengers superheroes assembled together — Iron Man in iconic red-and-gold metallic armor with glowing chest arc reactor, Captain America holding his round red-white-and-blue vibranium star shield, and Thor with crackling lightning hammer',
    settingVisual: 'cinematic hero stance atop Avengers Tower overlooking a dramatic glowing metropolis skyline at dusk with lightning in the sky',
    styleVisual: 'epic cinematic superhero digital concept art, volumetric rim lighting, vivid heroic color grading, balanced 1:1 square composition',
    negativeConstraints: 'no generic robots, no ordinary warriors, no DC heroes, no arcade machines, no text, no letters',
  },
  'dc universe': {
    subjectVisual:
      'Legendary DC Justice League heroes — Batman in his dark armored cowl and scalloped cape standing poised beside Superman with the iconic chest symbol and red flowing cape, and Wonder Woman with golden lasso of truth',
    settingVisual: 'moody gothic Gotham City cathedral rooftop with dark gargoyles and distant searchlight beams piercing stormy night clouds',
    styleVisual: 'dark cinematic heroic concept art, dramatic rim highlights and deep shadows, centered 1:1 square composition',
    negativeConstraints: 'no Marvel heroes, no generic superheroes, no arcade machines, no text, no letters',
  },
  'stranger things': {
    subjectVisual:
      'The Hawkins retro mystery scene with four teenage friends on classic 1980s bicycles with glowing headlights in a misty pine forest at night, with the ominous red storm clouds and giant shadowy silhouette of the multi-legged Mind Flayer monster in the Upside Down sky',
    settingVisual: 'eerie foggy Hawkins Indiana suburban woods with glowing spores and retro 1980s atmospheric neon-red lighting',
    styleVisual: 'nostalgic 1980s cinematic sci-fi thriller art, synthwave dark atmospheric glow, centered 1:1 square composition',
    negativeConstraints: 'no modern futuristic robots, no comedy cartoons, no arcade machines, no text, no letters',
  },
  'money heist quiz': {
    subjectVisual:
      'Heist crew members in signature red hooded boiler jumpsuits wearing the iconic Salvador Dali mustache masks, holding tactical duffle bags in front of a giant circular open bank vault door with raining banknotes in the air',
    settingVisual: 'Royal Mint of Spain bank interior with grand marble pillars, dramatic overhead spotlights, and red emergency beacon glow',
    styleVisual: 'tense cinematic action thriller digital art, bold red and charcoal contrast, centered 1:1 square composition',
    negativeConstraints: 'no generic fantasy, no superheroes, no arcade machines, no text, no letters',
  },
  'movie dialogue quiz': {
    subjectVisual:
      'A glowing vintage cinema film clapperboard, classic 35mm golden film reels with flowing celluloid film strip, retro movie microphone, and director megaphone under a focused stage spotlight',
    settingVisual: 'theatrical movie premiere red carpet stage with plush crimson velvet curtains and glamorous golden bokeh chandeliers',
    styleVisual: 'polished cinematic tribute art, rich golden and amber glow, elegant 1:1 square composition',
    negativeConstraints: 'no random messy objects, no arcade machines, no text, no letters',
  },
  'guess the movie': {
    subjectVisual:
      'An iconic golden film clapperboard, vintage brass 35mm movie camera projector projecting a brilliant golden light beam, classic red-and-blue 3D glasses, and golden film reels with flowing filmstrips',
    settingVisual: 'luxurious Hollywood cinema auditorium with plush velvet seats and shimmering golden dust particles',
    styleVisual: 'glamorous cinematic 3D concept art, warm dramatic spotlight illumination, centered 1:1 square framing',
    negativeConstraints: 'no arcade machines, no television commercials, no text, no letters',
  },
  'actors & celebrities': {
    subjectVisual:
      'A glittering red carpet walkway flanked by golden stanchions with crimson velvet ropes, brilliant camera flashes from paparazzi photographers, and a prestigious gleaming golden award statuette',
    settingVisual: 'star-studded Hollywood premiere gala outside a grand illuminated theater at night under crystal clear skies',
    styleVisual: 'glamorous high-fashion celebrity red carpet digital art, dazzling light flares and golden bokeh, centered 1:1 square composition',
    negativeConstraints: 'no messy cartoon characters, no sports fields, no text, no letters',
  },

  // --- SPORTS ---
  'ipl superstars': {
    subjectVisual:
      'Star Indian Premier League T20 cricket players in vibrant team colored cricket jerseys (blue, yellow, and gold), batsman hitting an explosive sixer with wooden cricket bat, wickets with flying illuminated LED bails, and red leather ball in motion',
    settingVisual: 'massive packed modern cricket stadium at night under towering glowing floodlights with cheering grandstands and celebratory fireworks',
    styleVisual: 'high-energy sports illustration, dynamic motion capture, vivid stadium lighting, centered 1:1 square composition',
    negativeConstraints: 'no football, no soccer, no basketball, no baseball, no empty fields, no arcade machines, no text, no letters',
  },
  'cricket records': {
    subjectVisual:
      'A gleaming golden cricket championship cup trophy flanked by crossed wooden cricket bats, three wooden wickets with flying bails, and a shiny red cricket ball with crisp white seam resting on pristine green grass',
    settingVisual: 'sunlit oval cricket stadium pitch with manicured grass boundary lines and clear blue afternoon sky',
    styleVisual: 'prestigious sports art, polished gold reflections, crisp athletic details, centered 1:1 square framing',
    negativeConstraints: 'no baseball, no soccer, no football, no arcade machines, no text, no letters',
  },
  'guess the cricketer': {
    subjectVisual:
      'A celebrated international cricket batsman in jersey and white pads, holding a raised cricket bat in triumphant half-century celebration, with batting gloves and helmet on the cricket pitch',
    settingVisual: 'vibrant sunlit cricket arena with lush green turf and cheering stadium spectator stands',
    styleVisual: 'inspirational sports portrait art, dynamic lighting, clean 1:1 square framing',
    negativeConstraints: 'no other sports, no baseball, no arcade machines, no text, no letters',
  },
  'icc world cup challenge': {
    subjectVisual:
      'The prestigious golden ICC Men\'s Cricket World Cup trophy gleaming brilliantly under bright stadium lights, flanked by a polished English willow cricket bat, a new white leather cricket ball, and national team cricket flags',
    settingVisual: 'grand world cup final stadium filled with 100,000 cheering fans with confetti and dazzling floodlights at night',
    styleVisual: 'prestigious international sports concept art, radiant golden trophy reflections, centered 1:1 square composition',
    negativeConstraints: 'no football, no soccer, no rugby, no arcade machines, no text, no letters',
  },
  'indian cricket legends': {
    subjectVisual:
      'Legendary Indian cricket icons in Indian blue jerseys with tricolor accents, celebrating a historic victory with raised cricket bat, golden championship cup, and flying cricket ball',
    settingVisual: 'Wankhede Stadium Mumbai under electric floodlights with thousands of waving Indian flags',
    styleVisual: 'inspirational cricket sports art, dramatic heroic lighting, crisp athletic motion, centered 1:1 square composition',
    negativeConstraints: 'no soccer, no baseball, no other sports, no arcade machines, no text, no letters',
  },
  'cricket rules & umpire decisions': {
    subjectVisual:
      'A cricket umpire in a white wide-brim hat raising his index finger to signal OUT, three wooden wickets with glowing red LED Zing bails flying in mid-air, a leather cricket ball hitting the stump on a green pitch',
    settingVisual: 'bright sunny test match cricket ground with manicured pitch turf and chalk white crease lines',
    styleVisual: 'crisp realistic sports digital art, dramatic slow-motion impact freeze, centered 1:1 square composition',
    negativeConstraints: 'no football referees, no baseball umpires, no arcade machines, no text, no letters',
  },
  'guess the ipl team': {
    subjectVisual:
      'A circular fan banner showcase of colorful IPL team cricket jerseys and helmets in blue, yellow, purple, and red, surrounding a gleaming golden IPL champions trophy with exploding fireworks',
    settingVisual: 'vibrant modern IPL night match stadium under glowing floodlights with roaring crowds',
    styleVisual: 'high-energy T20 cricket festival art, vivid festive colors, centered 1:1 square composition',
    negativeConstraints: 'no soccer leagues, no NFL, no arcade machines, no text, no letters',
  },
  'cricket world records': {
    subjectVisual:
      'A glowing golden cricket world records ledger book opened beside a giant electronic scoreboard displaying milestone digits (400*, 264, 100), with a gold-plated cricket bat and golden ball',
    settingVisual: 'prestigious Lords Cricket Ground pavilion balcony overlooking the historic sunlit pitch',
    styleVisual: 'majestic sports milestone concept art, polished gold and amber lighting, centered 1:1 square framing',
    negativeConstraints: 'no baseball, no soccer, no arcade machines, no text, no letters',
  },

  // --- GENERAL KNOWLEDGE & INDIA ---
  'world flags challenge': {
    subjectVisual:
      'A dynamic, majestic circular wreath of recognizable international national flags fluttering in the breeze — prominently featuring the flags of India, United States, United Kingdom, Japan, Brazil, France, Germany, and Canada',
    settingVisual: 'clear blue sky background with subtle golden celebratory confetti and soft global diplomatic arena lighting',
    styleVisual: 'crisp colorful vexillological art, clean cloth textures and accurate flag motifs, centered 1:1 square composition',
    negativeConstraints: 'no plain Earth globe without flags, no dark outer space, no fantasy banners, no arcade machines, no text, no letters',
  },
  'world geography': {
    subjectVisual:
      'A detailed physical 3D world globe showing realistic green continents, snow-capped mountain ranges, blue oceans, alongside a vintage polished brass nautical compass and a folded topographical explorer map',
    settingVisual: 'explorer wooden study desk with warm golden lantern light and antique map scrolls in background',
    styleVisual: 'polished 3D cartographic explorer art, rich geographical textures, clean 1:1 square composition',
    negativeConstraints: 'no fantasy planets, no sci-fi cyberspace, no arcade machines, no text, no letters',
  },
  'indian history': {
    subjectVisual:
      'Grand architectural heritage of historical India — the majestic Ashoka Lion Capital sculpture, intricate ancient stone temple carvings, and the glowing red sandstone arches of historical Mughal forts under golden hour light',
    settingVisual: 'golden sunset over historical ancient Indian palace courtyards with ornamental water fountains and stone pillars',
    styleVisual: 'rich historical cultural digital art, warm golden amber lighting, dignified centered 1:1 square composition',
    negativeConstraints: 'no modern skyscrapers, no European castles, no arcade machines, no text, no letters',
  },
  'world history': {
    subjectVisual:
      'Historic world civilizations montage — the monumental stone Egyptian pyramids, classical ancient Roman Colosseum arches, antique parchment scroll, and an ornate vintage hourglass with falling golden sand',
    settingVisual: 'dignified historical archaeological museum setting with warm golden sunlight filtering through stone arches',
    styleVisual: 'epic historical digital painting, rich antique textures, timeless composition, 1:1 square framing',
    negativeConstraints: 'no modern technology, no outer space, no arcade machines, no text, no letters',
  },
  'famous personalities': {
    subjectVisual:
      'Artistic classical tribute to great historical world thinkers and leaders — noble busts and portraits surrounded by golden laurel wreaths, quill and parchment, scientific compass, and timeless books of philosophy',
    settingVisual: 'grand classical hall of fame library with towering wooden bookshelves and warm atmospheric light beams',
    styleVisual: 'dignified classical portrait concept art, golden luminescence, balanced 1:1 square composition',
    negativeConstraints: 'no modern pop celebrities, no cartoons, no arcade machines, no text, no letters',
  },
  'inventions & discoveries': {
    subjectVisual:
      'Revolutionary historic human inventions — Thomas Edison glowing filament incandescent lightbulb, Leonardo da Vinci aerial screw blueprint drawings, Galileo brass astronomical telescope, and intricate clockwork brass gears',
    settingVisual: 'inventor laboratory workshop with workbenches, parchment schematics, and warm amber gaslight illumination',
    styleVisual: 'detailed steampunk and historical invention art, glowing brass and glass, centered 1:1 square framing',
    negativeConstraints: 'no futuristic cyberpunk, no arcade machines, no text, no letters',
  },

  // --- SCIENCE & SPACE ---
  'solar system': {
    subjectVisual:
      'The complete Solar System with the blazing golden Sun at the center radiating warm solar flares, surrounded by the accurately rendered orbiting planets: rocky Mercury, golden Venus, blue Earth with its moon, red Mars, giant banded Jupiter with its Great Red Spot, magnificent ringed Saturn with glowing rings, icy blue Uranus, and deep blue Neptune on luminous orbital planes',
    settingVisual: 'deep cosmic starfield space background with twinkling stars and subtle colorful nebula gas clouds',
    styleVisual: 'breathtaking astronomical 3D space art, accurate planetary colors and scale, balanced 1:1 square composition',
    negativeConstraints: 'no Earth alone, no plain Earth globe, no fantasy galaxies without planets, no alien monsters, no arcade machines, no text, no letters',
  },
  'human body': {
    subjectVisual:
      'Detailed 3D anatomical model of the human body showcasing the glowing red cardiovascular heart and blood vessels, muscular skeletal anatomy, and the glowing blue synaptic neural network of the brain',
    settingVisual: 'clean modern medical science laboratory with soft turquoise and indigo holographic diagnostic lighting',
    styleVisual: 'pristine 3D biomedical concept art, luminescent anatomical clarity, centered 1:1 square composition',
    negativeConstraints: 'no grotesque horror, no cartoon monsters, no arcade machines, no text, no letters',
  },
  'animal kingdom': {
    subjectVisual:
      'A majestic wildlife assembly featuring a magnificent African lion with golden mane, a soaring bald eagle with outstretched wings, and an agile tiger in natural harmony',
    settingVisual: 'lush golden hour savanna landscape with acacia trees and warm sun rays breaking through morning clouds',
    styleVisual: 'stunning natural history wildlife art, vivid realistic animal textures, balanced 1:1 square framing',
    negativeConstraints: 'no mythical fantasy monsters, no cages, no zoo bars, no arcade machines, no text, no letters',
  },
  'amazing science facts': {
    subjectVisual:
      'Fascinating physical science wonders — a glowing glass plasma globe emitting branching purple and violet lightning tendrils, magnetic levitation superconductor disc hovering over magnets, and prism light refraction',
    settingVisual: 'modern exploratory science museum exhibit with dark background and vibrant luminescent scientific glows',
    styleVisual: 'vivid modern science concept art, glowing energetic neon highlights, centered 1:1 square composition',
    negativeConstraints: 'no plain chalkboard, no generic classroom, no arcade machines, no text, no letters',
  },
  'physics challenge': {
    subjectVisual:
      'Core physics phenomena — an illuminated atomic nucleus with glowing orbiting electron probability clouds, wave-particle double-slit interference pattern, a triangular optical glass prism dispersing pure white light into a vibrant rainbow spectrum, and spacetime curvature lines',
    settingVisual: 'deep physics cosmos with glowing electromagnetic field vectors and quantum particle trails',
    styleVisual: 'striking 3D physics visualization art, crystalline optics, brilliant quantum neon luminescence, 1:1 square composition',
    negativeConstraints: 'no chemistry test tubes, no biology cells, no arcade machines, no text, no letters',
  },
  'chemistry quiz': {
    subjectVisual:
      'Laboratory chemistry setup with borosilicate glass Erlenmeyer flasks, round boiling flasks, and test tubes filled with glowing vibrant cyan, amber, and magenta bubbling liquid solutions, alongside colorful 3D molecular ball-and-stick models',
    settingVisual: 'clean modern chemistry research lab with chalkboard chemical equations softly blurred in background',
    styleVisual: 'sparkling chemical science concept art, glowing liquid translucency, clean 1:1 square framing',
    negativeConstraints: 'no biology animals, no physics rockets, no arcade machines, no text, no letters',
  },
  'biology basics': {
    subjectVisual:
      'Glowing cyan double-helix DNA strand twisting upward beside microscopic cellular organelles, plant leaf chloroplasts showing photosynthesis, and detailed cell nucleus with vibrant bioluminescent accents',
    settingVisual: 'microscopic cellular bio-dome environment with soft aquatic teal and emerald botanical lighting',
    styleVisual: 'detailed microscopic biological 3D art, translucent cell membranes, centered 1:1 square composition',
    negativeConstraints: 'no chemistry flasks, no physics machines, no arcade machines, no text, no letters',
  },
  'periodic table': {
    subjectVisual:
      'Luminous 3D periodic table display featuring colorful glowing crystalline element cubes — shimmering golden gold ingot, glittering crystalline carbon diamond, reactive copper crystals, and neon discharge tubes glowing in different elemental colors',
    settingVisual: 'sleek scientific element display gallery with dark reflective slate surface and crisp illumination',
    styleVisual: 'vibrant modern chemistry concept art, glowing element tiles, polished 1:1 square composition',
    negativeConstraints: 'no generic textbooks, no chalkboard clutter, no arcade machines, no text, no letters',
  },
  'famous scientists': {
    subjectVisual:
      'Iconic historic scientific laboratory featuring Albert Einstein thought experiments with chalkboard calculations, Isaac Newton prism and falling red apple, Marie Curie glowing blue radium flask, and Nikola Tesla electrical wireless coils',
    settingVisual: 'atmospheric historic research study with warm amber library lamps and scientific instruments',
    styleVisual: 'tribute scientific digital painting, rich warm academic lighting, dignified 1:1 square composition',
    negativeConstraints: 'no fantasy wizards, no cartoon caricatures, no arcade machines, no text, no letters',
  },

  // --- COMPUTER SCIENCE & PROGRAMMING ---
  'dbms quiz': {
    subjectVisual:
      'Glowing 3D stacked cylindrical database server tiers with illuminated relational data tables, SQL query relational schema connecting lines with key indicators, and glowing cyan data packet pulses flowing between storage disks',
    settingVisual: 'sleek dark modern cloud server datacenter with glowing blue and purple server rack status lights',
    styleVisual: 'modern isometric software tech concept art, glowing neon data streams, clean 1:1 square composition',
    negativeConstraints: 'no arcade machines, no gaming consoles, no messy cables, no text, no letters',
  },
  'operating systems': {
    subjectVisual:
      'Computer operating system core architecture — a glowing metallic CPU multi-core silicon processor chip labeled with kernel layer, surrounded by RAM memory blocks, scheduler process pipelines, and file system hierarchy tree',
    settingVisual: 'dark high-tech motherboard circuit board with glowing neon cyan bus traces and microchip illumination',
    styleVisual: 'modern isometric computer engineering concept art, crisp circuit details, centered 1:1 square composition',
    negativeConstraints: 'no video games, no smartphone apps, no arcade machines, no text, no letters',
  },
  'computer networks': {
    subjectVisual:
      'Computer networking architecture — a glowing 3D network topology with interconnected enterprise server racks, high-speed fiber-optic cables emitting light pulses, network switches, packet routers, and glowing TCP/IP nodes spanning an abstract global grid',
    settingVisual: 'dark high-tech network operations center with glowing cyber grid and optical fiber glow',
    styleVisual: 'sleek telecommunications tech art, glowing cyan and amber data packets, clean 1:1 square composition',
    negativeConstraints: 'no social media logos, no arcade machines, no text, no letters',
  },
  'oop concepts': {
    subjectVisual:
      'Object-Oriented Programming concepts represented as 3D modular glowing geometric blocks — illustrating Inheritance with hierarchical parent-child nodes, Encapsulation with a protective glowing glass shield over internal state, and Polymorphism with morphing colorful modules',
    settingVisual: 'minimalist dark developer workspace with soft purple and teal neon blueprint grid',
    styleVisual: 'abstract software engineering 3D illustration, clean geometric logic shapes, centered 1:1 square framing',
    negativeConstraints: 'no arcade cabinets, no messy wires, no text, no letters',
  },
  'html & css': {
    subjectVisual:
      'Modern front-end web development visualization — a floating 3D glass web browser interface window with responsive UI layout wireframes, flexbox and grid layout cards, colorful CSS styling layer swatches, and brackets',
    settingVisual: 'sleek contemporary web developer desk setup with soft ambient warm-and-blue studio lighting',
    styleVisual: 'clean modern web design concept art, elegant glassmorphism elements, centered 1:1 square composition',
    negativeConstraints: 'no messy wires, no arcade cabinets, no gibberish text, no letters',
  },
  'data structures & algorithms (dsa)': {
    subjectVisual:
      'A glowing 3D algorithmic visualization — a balanced binary search tree with neon cyan nodes, an interconnected graph network with glowing yellow Dijkstra shortest path edges, and a dynamic sorting array bar visualizer',
    settingVisual: 'dark futuristic computer science matrix workspace with glowing grid lines and cybernetic data streams',
    styleVisual: 'sleek software engineering 3D digital art, high-tech neon glow, centered 1:1 square composition',
    negativeConstraints: 'no arcade cabinets, no messy wires, no text, no letters',
  },
  'javascript quiz': {
    subjectVisual:
      'A glowing modern yellow JavaScript emblem cube floating in a high-tech developer ecosystem, surrounded by circular asynchronous event loop rings, microtask packet nodes, and glowing code brackets',
    settingVisual: 'dark modern cyber programming console with warm amber and gold developer ambiance',
    styleVisual: 'sleek tech developer concept art, crisp isometric lighting, clean 1:1 square composition',
    negativeConstraints: 'no video game arcade machines, no messy clutter, no text, no letters',
  },
  'python programming': {
    subjectVisual:
      'Two elegant stylized cybernetic snakes (one royal blue, one vibrant golden yellow) intertwined around a glowing crystalline computer processor core, with floating modular brackets and data objects',
    settingVisual: 'dark modern AI and data science laboratory workspace with soft blue and gold ambient lighting',
    styleVisual: 'sophisticated high-tech programming concept art, smooth metallic reflections, centered 1:1 square composition',
    negativeConstraints: 'no real scary wild snakes, no arcade machines, no text, no letters',
  },
  'java programming': {
    subjectVisual:
      'A sleek porcelain coffee cup emitting swirling steam that morphs into glowing blue and orange JVM bytecode streams, object-oriented class nodes, and modular enterprise software architecture',
    settingVisual: 'modern software architect workspace with soft twilight city skyline and clean developer setup',
    styleVisual: 'polished modern technology art, warm and blue contrasting lighting, centered 1:1 square composition',
    negativeConstraints: 'no messy spills, no arcade cabinets, no text, no letters',
  },
  'c & c++ programming': {
    subjectVisual:
      'Interlocking precision metallic gears in deep sapphire blue and chrome, glowing memory pointer address arrows pointing to high-speed hardware registers, and low-level system performance visualization',
    settingVisual: 'high-tech systems engineering lab with clean circuit board traces and cobalt blue lighting',
    styleVisual: 'powerful low-level systems programming concept art, crisp metallic textures, centered 1:1 square framing',
    negativeConstraints: 'no arcade machines, no web design graphics, no text, no letters',
  },
};

/**
 * Builds a tailored, title-first prompt ensuring that the exact quiz title
 * and named franchise dominate the visual output.
 */
export function buildThumbnailPrompt(ctx: ThumbnailPromptContext): string {
  const subject = cleanText(ctx.subjectName);
  const category = cleanText(ctx.categoryName);
  const catSlug = (ctx.categorySlug || '').toLowerCase();
  const desc = cleanText(ctx.description);
  const lowerSub = subject.toLowerCase().trim();

  // 1. Check for exact title match in specific definitions
  if (SPECIFIC_SUBJECT_PROMPTS[lowerSub]) {
    const p = SPECIFIC_SUBJECT_PROMPTS[lowerSub];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints]
      .filter(Boolean)
      .join(', ');
  }

  // 2. Check for key franchise patterns inside the title
  if (lowerSub.includes('harry potter') || lowerSub.includes('hogwarts')) {
    const p = SPECIFIC_SUBJECT_PROMPTS['harry potter world'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('marvel') || lowerSub.includes('avengers') || lowerSub.includes('iron man')) {
    const p = SPECIFIC_SUBJECT_PROMPTS['marvel universe'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('naruto')) {
    const p = SPECIFIC_SUBJECT_PROMPTS['naruto universe'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('one piece') || lowerSub.includes('luffy')) {
    const p = SPECIFIC_SUBJECT_PROMPTS['one piece adventures'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('jujutsu') || lowerSub.includes('gojo')) {
    const p = SPECIFIC_SUBJECT_PROMPTS['jujutsu kaisen quiz'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('dragon ball') || lowerSub.includes('goku') || lowerSub.includes('saiyan')) {
    const p = SPECIFIC_SUBJECT_PROMPTS['dragon ball'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('solar system') || (lowerSub.includes('planets') && lowerSub.includes('sun'))) {
    const p = SPECIFIC_SUBJECT_PROMPTS['solar system'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('flag') && (lowerSub.includes('world') || lowerSub.includes('country') || lowerSub.includes('challenge'))) {
    const p = SPECIFIC_SUBJECT_PROMPTS['world flags challenge'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }
  if (lowerSub.includes('ipl') || (lowerSub.includes('cricket') && lowerSub.includes('superstar'))) {
    const p = SPECIFIC_SUBJECT_PROMPTS['ipl superstars'];
    return [p.subjectVisual, p.settingVisual, p.styleVisual, p.negativeConstraints].join(', ');
  }

  // 3. Dynamic Title-First Assembly for any other quiz title
  // Always prioritize the literal quiz title and its specific subject
  const contextualDetails = desc ? `focusing on ${desc.slice(0, 100)}` : `focusing on ${subject}`;
  const subjectVisual = `A vivid, highly recognizable central visual depiction of "${subject}" (${category}), ${contextualDetails}`;
  const settingVisual = 'cohesive atmospheric environment with polished dramatic lighting matching the theme';
  const styleVisual = 'polished modern digital concept art, vibrant harmonious colors, expressive lighting, centered 1:1 square composition, high visual clarity at small icon sizes';
  const negativeConstraints = 'no text, no letters, no words, no watermarks, no arcade machines, no video game cabinets, no random irrelevant objects';

  return [subjectVisual, settingVisual, styleVisual, negativeConstraints].filter(Boolean).join(', ');
}
