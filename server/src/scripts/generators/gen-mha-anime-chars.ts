import fs from 'fs';
import path from 'path';

interface Question {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const questionsDir = path.resolve(process.cwd(), 'src/scripts/questions');

// 4. My Hero Academia (50 questions)
const mhaQuestions: Question[] = [
  {
    questionId: "mha-001",
    question: "What is the superhero nickname adopted by protagonist Izuku Midoriya?",
    options: ["Dynamight", "Deku", "Shoto", "Lemillion"],
    correctAnswer: 1,
    explanation: "Izuku reclaims the childhood insult 'Deku' to mean someone who never gives up.",
    difficulty: "easy"
  },
  {
    questionId: "mha-002",
    question: "What is the legendary power passed down to Izuku Midoriya by All Might?",
    options: ["All For One", "One For All", "Explosion", "Half-Cold Half-Hot"],
    correctAnswer: 1,
    explanation: "One For All is a stockpiled power transferable between wielders.",
    difficulty: "easy"
  },
  {
    questionId: "mha-003",
    question: "What is Katsuki Bakugo's explosive quirk?",
    options: ["Engine", "Explosion (Nitroglycerin-like sweat)", "Electrification", "Hellflame"],
    correctAnswer: 1,
    explanation: "Bakugo secretes nitroglycerin-like sweat from his palms that he detonates at will.",
    difficulty: "easy"
  },
  {
    questionId: "mha-004",
    question: "What dual-element Quirk does Shoto Todoroki possess?",
    options: ["Wind and Water", "Half-Cold Half-Hot (Fire & Ice)", "Earth and Lightning", "Shadow and Light"],
    correctAnswer: 1,
    explanation: "Shoto inherits ice generation from his mother on his right side and fire from Endeavor on his left.",
    difficulty: "easy"
  },
  {
    questionId: "mha-005",
    question: "Who is the legendary Symbol of Peace and 8th wielder of One For All?",
    options: ["Gran Torino", "All Might (Toshinori Yagi)", "Endeavor", "Best Jeanist"],
    correctAnswer: 1,
    explanation: "All Might inspired an era of peace and stability as the undisputed No. 1 Hero.",
    difficulty: "easy"
  },
  {
    questionId: "mha-006",
    question: "What is the elite high school for aspiring pro heroes that Class 1-A attends?",
    options: ["Shiketsu High", "Ketsubutsu Academy", "U.A. High School", "Seiai Academy"],
    correctAnswer: 2,
    explanation: "U.A. High School is Japan's premier educational institution for hero training.",
    difficulty: "easy"
  },
  {
    questionId: "mha-007",
    question: "What is Class 1-A's homeroom teacher Shota Aizawa's hero name and Quirk?",
    options: ["Present Mic / Voice", "Eraser Head / Erasure", "Vlad King / Blood Control", "Cementoss / Cement"],
    correctAnswer: 1,
    explanation: "Eraser Head can nullify the Quirks of anyone within his direct line of sight until he blinks.",
    difficulty: "easy"
  },
  {
    questionId: "mha-008",
    question: "Who is the leader of the League of Villains whose Quirk 'Decay' disintegrates whatever he touches?",
    options: ["Dabi", "Tomura Shigaraki (Tenko Shimura)", "Overhaul", "Spinner"],
    correctAnswer: 1,
    explanation: "Tomura Shigaraki, grandson of Nana Shimura, wields the catastrophic Decay quirk.",
    difficulty: "easy"
  },
  {
    questionId: "mha-009",
    question: "Who is the villain mastermind who ruled Japan's underworld and steals Quirks?",
    options: ["All For One", "Re-Destro", "Gentle Criminal", "Stain"],
    correctAnswer: 0,
    explanation: "All For One possesses the eponymous ability to forcibly steal, stockpile, and redistribute Quirks.",
    difficulty: "easy"
  },
  {
    questionId: "mha-010",
    question: "What is Ochaco Uraraka's hero name and Quirk?",
    options: ["Froppy / Frog", "Uravity / Zero Gravity", "Pinky / Acid", "Creati / Creation"],
    correctAnswer: 1,
    explanation: "Ochaco (Uravity) nullifies the gravitational pull of objects by touching them with her finger pads.",
    difficulty: "easy"
  },
  {
    questionId: "mha-011",
    question: "What is Tsuyu Asui's hero name?",
    options: ["Froppy", "Ribbit", "Lilypad", "Aquagirl"],
    correctAnswer: 0,
    explanation: "Tsuyu chose the rainy season hero name 'Froppy' ('Call me Tsu!').",
    difficulty: "easy"
  },
  {
    questionId: "mha-012",
    question: "Who is the 'Hero Killer' whose ideology against commercialized heroes influenced villains across Japan?",
    options: ["Muscular", "Stain (Chizome Akaguro)", "Moonfish", "Twice"],
    correctAnswer: 1,
    explanation: "Stain believed only true selfless heroes like All Might deserved the title, using Bloodcurdle to paralyze targets.",
    difficulty: "medium"
  },
  {
    questionId: "mha-013",
    question: "What is Tenya Iida's hero name honoring his paralyzed older brother Tensei?",
    options: ["Turbo", "Ingenium", "Speedster", "Overdrive"],
    correctAnswer: 1,
    explanation: "Tenya took on the mantle of Ingenium after his brother was crippled by Stain.",
    difficulty: "easy"
  },
  {
    questionId: "mha-014",
    question: "Which student from U.A.'s Big Three can permeate through any physical matter?",
    options: ["Tamaki Amajiki", "Mirio Togata (Lemillion)", "Nejire Hado", "Hitoshi Shinso"],
    correctAnswer: 1,
    explanation: "Mirio Togata mastered his tricky Permeation quirk through sheer dedication to become Lemillion.",
    difficulty: "medium"
  },
  {
    questionId: "mha-015",
    question: "What is the name of the little girl whose horn can 'Rewind' living bodies to previous states?",
    options: ["Eri", "Kota", "Katsuma", "Mahoro"],
    correctAnswer: 0,
    explanation: "Eri possesses the Rewind Quirk, which Deku used to maintain 100% Full Cowl against Overhaul.",
    difficulty: "easy"
  },
  {
    questionId: "mha-016",
    question: "Who is the leader of the Shie Hassaikai yakuza clan who created Quirk-destroying bullets from Eri's blood?",
    options: ["Kai Chisaki (Overhaul)", "Kendo Rappa", "Chronostasis", "Mimic"],
    correctAnswer: 0,
    explanation: "Kai Chisaki, known as Overhaul, aimed to restore the yakuza by weaponizing Quirk eradication.",
    difficulty: "medium"
  },
  {
    questionId: "mha-017",
    question: "What is the true identity of the villain Dabi revealed during the Paranormal Liberation War?",
    options: ["Toya Todoroki", "Natsuo Todoroki", "Fuyumi Todoroki", "Tenko Shimura"],
    correctAnswer: 0,
    explanation: "Dabi shockingly broadcasted to the nation that he was Endeavor's presumed-dead eldest son, Toya Todoroki.",
    difficulty: "easy"
  },
  {
    questionId: "mha-018",
    question: "Who becomes the No. 1 Pro Hero in Japan after All Might's retirement at Kamino Ward?",
    options: ["Hawks", "Endeavor (Enji Todoroki)", "Best Jeanist", "Edgeshot"],
    correctAnswer: 1,
    explanation: "The Flame Hero Endeavor ascends to No. 1 and grapples with atoning for his abusive past.",
    difficulty: "easy"
  },
  {
    questionId: "mha-019",
    question: "Who is the No. 2 Wing Hero who acted as an undercover double agent inside the Meta Liberation Army?",
    options: ["Hawks (Keigo Takami)", "Kamui Woods", "Fat Gum", "Mirko"],
    correctAnswer: 0,
    explanation: "Hawks uses his Fierce Wings to gather intelligence under the Public Safety Commission.",
    difficulty: "medium"
  },
  {
    questionId: "mha-020",
    question: "What was the first past user Quirk Izuku accidentally awakened during Class 1-A vs 1-B training?",
    options: ["Blackwhip (Daigoro Banjo)", "Float (Nana Shimura)", "Fa Jin", "Gearshift"],
    correctAnswer: 0,
    explanation: "Izuku first unlocked Daigoro Banjo's Blackwhip, allowing him to produce tendrils of dark energy.",
    difficulty: "medium"
  },
  {
    questionId: "mha-021",
    question: "Who was the 7th user of One For All and mentor to All Might?",
    options: ["Nana Shimura", "Hikage Shinomori", "En", "Yoichi Shigaraki"],
    correctAnswer: 0,
    explanation: "Nana Shimura wielded the Float Quirk and trained Toshinori Yagi before her death.",
    difficulty: "medium"
  },
  {
    questionId: "mha-022",
    question: "What is the name of the first user and younger brother of All For One who was given One For All?",
    options: ["Yoichi Shigaraki", "Tenko", "Nine", "Kudo"],
    correctAnswer: 0,
    explanation: "Yoichi was frail and believed quirkless until given a power-stockpiling quirk by his brother.",
    difficulty: "hard"
  },
  {
    questionId: "mha-023",
    question: "What is Eijiro Kirishima's hero name and defensive Quirk?",
    options: ["Red Riot / Hardening", "Steel / Iron Fist", "Sugarman / Sugar Rush", "Tailman / Tail"],
    correctAnswer: 0,
    explanation: "Kirishima took the hero name Red Riot in honor of his chivalrous idol Crimson Riot.",
    difficulty: "easy"
  },
  {
    questionId: "mha-024",
    question: "What condition causes Denki Kaminari's brain to short-circuit into a thumbs-up 'whey' state?",
    options: ["Exceeding his electrical wattage output limit", "Eating too much sugar", "Spinning too fast", "Lack of sleep"],
    correctAnswer: 0,
    explanation: "Overusing his Electrification Quirk shorts out his brain, leaving him temporarily goofy.",
    difficulty: "easy"
  },
  {
    questionId: "mha-025",
    question: "Who is Class 1-A's vice representative who can synthesize any non-living material from her lipids?",
    options: ["Momo Yaoyorozu (Creati)", "Kyoka Jiro", "Mina Ashido", "Toru Hagakure"],
    correctAnswer: 0,
    explanation: "Momo Yaoyorozu creates items at the molecular level using her Creation Quirk.",
    difficulty: "easy"
  },
  {
    questionId: "mha-026",
    question: "What is Fumikage Tokoyami's sentient shadow monster Quirk?",
    options: ["Dark Shadow", "Shadow Puppet", "Night Crawler", "Abyss"],
    correctAnswer: 0,
    explanation: "Dark Shadow grows enormously powerful and hard to control in darkness, but weakens in bright light.",
    difficulty: "easy"
  },
  {
    questionId: "mha-027",
    question: "What hero item did All Might consume from Deku to grant him One For All at Dagobah Beach?",
    options: ["A strand of hair ('Eat this!')", "A drop of blood", "A fingernail", "Sweat"],
    correctAnswer: 0,
    explanation: "All Might famously shouted 'Eat this!' while handing Izuku a strand of his blond hair.",
    difficulty: "easy"
  },
  {
    questionId: "mha-028",
    question: "What is the blood-drinking transformation Quirk of League of Villains member Himiko Toga?",
    options: ["Transform", "Bloodcurdle", "Clone", "Vampire"],
    correctAnswer: 0,
    explanation: "By ingesting a person's blood, Toga can shapeshift into them (and later copy their Quirks with love).",
    difficulty: "medium"
  },
  {
    questionId: "mha-029",
    question: "What was Twice's (Jin Bubaigawara) psychological fear before overcoming his trauma in Deika City?",
    options: ["He wasn't sure if he was the original Jin or just a clone", "Fear of the dark", "Fear of fire", "Fear of needles"],
    correctAnswer: 0,
    explanation: "After his clones attacked each other in the past, Twice feared his own body would dissolve if bruised.",
    difficulty: "medium"
  },
  {
    questionId: "mha-030",
    question: "What moveset does Izuku develop to take pressure off his broken arms and utilize his legs?",
    options: ["Shoot Style", "Detroit Stomp", "Delaware Kick", "Full Sprint"],
    correctAnswer: 0,
    explanation: "Deku creates One For All: Shoot Style to turn his powerful kicks into his primary attack mode.",
    difficulty: "easy"
  },
  {
    questionId: "mha-031",
    question: "What support item does Bakugo wear on his forearms to store sweat for massive explosions?",
    options: ["Grenadier Gauntlets", "Nitroglycerin Bracers", "Blast Rings", "Dynamite Cuffs"],
    correctAnswer: 0,
    explanation: "Bakugo's grenade-shaped gauntlets collect sweat to unleash devastating pinpoint blasts safely.",
    difficulty: "easy"
  },
  {
    questionId: "mha-032",
    question: "Who is the principal of U.A. High School who is an intelligent rare animal with the High Spec Quirk?",
    options: ["Principal Nezu", "Vlad King", "Hound Dog", "Ectoplasm"],
    correctAnswer: 0,
    explanation: "Nezu is an extraordinarily intelligent mammal (possibly a bear, dog, or mouse) who heads U.A.",
    difficulty: "medium"
  },
  {
    questionId: "mha-033",
    question: "What is the energetic rabbit hero Rumi Usagiyama's hero name?",
    options: ["Mirko", "Bunny Girl", "Hop", "Vixen"],
    correctAnswer: 0,
    explanation: "No. 5 Hero Mirko uses incredible leg strength and rabbit instincts in fearless combat.",
    difficulty: "easy"
  },
  {
    questionId: "mha-034",
    question: "Who is the Class 1-A student who can Brainwash anyone who verbally responds to his questions?",
    options: ["Hitoshi Shinso", "Neito Monoma", "Tamaki Amajiki", "Mezo Shoji"],
    correctAnswer: 0,
    explanation: "Hitoshi Shinso uses his Brainwashing Quirk alongside Eraser Head's capture cloth.",
    difficulty: "easy"
  },
  {
    questionId: "mha-035",
    question: "Which Class 1-B student is known for his eccentric arrogance and Phantom Thief Quirk (Copy)?",
    options: ["Neito Monoma", "Tetsutetsu Tetsutetsu", "Itsuka Kendo", "Juzo Honenuki"],
    correctAnswer: 0,
    explanation: "Monoma can replicate any Quirk he touches for a limited window of time.",
    difficulty: "medium"
  },
  {
    questionId: "mha-036",
    question: "What is Kyoka Jiro's hero name and sound-based Quirk?",
    options: ["Earphone Jack", "Decibel", "Subwoofer", "Amp"],
    correctAnswer: 0,
    explanation: "Jiro can plug her earlobes into surfaces to hear through walls or amplify her heartbeat as sonic blasts.",
    difficulty: "easy"
  },
  {
    questionId: "mha-037",
    question: "What is the medical doctor's name who served All For One and turned corpses into bio-engineered Nomu?",
    options: ["Dr. Kyudai Garaki (Daruma Ujiko)", "Dr. Tsubasa", "Dr. Maki", "Dr. Hado"],
    correctAnswer: 0,
    explanation: "Dr. Garaki served All For One for decades, using the Super Regeneration quirk to prolong his life.",
    difficulty: "hard"
  },
  {
    questionId: "mha-038",
    question: "What are the mindless genetically modified monsters with multiple Quirks created by Dr. Garaki called?",
    options: ["Nomu", "Ghouls", "Hollows", "Titans"],
    correctAnswer: 0,
    explanation: "Nomu are synthesized super-soldiers with exposed brains engineered to withstand multiple Quirks.",
    difficulty: "easy"
  },
  {
    questionId: "mha-039",
    question: "What was Gran Torino's connection to All Might?",
    options: ["He was All Might's brutal mentor and Nana Shimura's close ally", "His biological uncle", "His doctor", "His sidekick"],
    correctAnswer: 0,
    explanation: "Gran Torino taught All Might how to fight using One For All and later coached Deku on Full Cowl.",
    difficulty: "medium"
  },
  {
    questionId: "mha-040",
    question: "What percentage of the global human population possesses a Quirk in the MHA universe?",
    options: ["Approximately 80%", "50%", "20%", "99%"],
    correctAnswer: 0,
    explanation: "Around 80% of humanity manifested supernatural abilities, starting with the glowing baby in Qingqing City.",
    difficulty: "medium"
  },
  {
    questionId: "mha-041",
    question: "What was the very first Quirk ever reported in human history?",
    options: ["A luminescent newborn baby in China", "A flying man in America", "A fire-breather in Japan", "Telekinesis in France"],
    correctAnswer: 0,
    explanation: "The paranormal phenomenon began in Qingqing City, China, with the birth of a baby radiating light.",
    difficulty: "medium"
  },
  {
    questionId: "mha-042",
    question: "What is the ultimate team maneuver developed by Twice that overwhelms entire cities with infinite clones?",
    options: ["Sad Man's Parade", "March of Shadows", "Endless Legion", "Double Trouble"],
    correctAnswer: 0,
    explanation: "Sad Man's Parade generates a self-replicating tidal wave of thousands of Twice clones.",
    difficulty: "medium"
  },
  {
    questionId: "mha-043",
    question: "Who was revealed to be the U.A. traitor working for All For One under blackmail?",
    options: ["Yuga Aoyama", "Toru Hagakure", "Koji Koda", "Rikido Sato"],
    correctAnswer: 0,
    explanation: "Yuga Aoyama was born quirkless; his parents made a deal with All For One to grant him Navel Laser.",
    difficulty: "hard"
  },
  {
    questionId: "mha-044",
    question: "What was Bakugo's chosen pro hero name revealed during the final war?",
    options: ["Great Explosion Murder God Dynamight", "Lord Explosion", "Kacchan", "Nitro King"],
    correctAnswer: 0,
    explanation: "Bakugo proudly named himself 'Great Explosion Murder God Dynamight' in homage to All Might.",
    difficulty: "medium"
  },
  {
    questionId: "mha-045",
    question: "What is the gear-shifting quirk of the 2nd user of One For All that alters speed without inertia?",
    options: ["Gearshift", "Fa Jin", "Danger Sense", "Smokescreen"],
    correctAnswer: 0,
    explanation: "Gearshift shifts velocities through Low, Second, Third, Top, and Overdrive, bending the laws of physics.",
    difficulty: "hard"
  },
  {
    questionId: "mha-046",
    question: "Which quirk from the 4th user Hikage Shinomori alerts Izuku to imminent threats and hostility?",
    options: ["Danger Sense", "Float", "Blackwhip", "Smokescreen"],
    correctAnswer: 0,
    explanation: "Danger Sense acts like a spider-sense, stabbing Deku's head with sharp tingling when danger nears.",
    difficulty: "medium"
  },
  {
    questionId: "mha-047",
    question: "What is the quirk of Best Jeanist (Tsunagu Hakamada), the No. 3 Hero?",
    options: ["Fiber Master", "Cloth Manipulation", "Denim Weave", "Needle Thread"],
    correctAnswer: 0,
    explanation: "Fiber Master allows him to telekinetically control the threads and fibers of all fabrics.",
    difficulty: "medium"
  },
  {
    questionId: "mha-048",
    question: "What is Mina Ashido's hero name and Quirk?",
    options: ["Pinky / Acid", "Alien Queen / Corrode", "Slime / Ooze", "Melter / Gel"],
    correctAnswer: 0,
    explanation: "Mina Ashido adopted the hero name Pinky and secretes corrosive, protective acid.",
    difficulty: "easy"
  },
  {
    questionId: "mha-049",
    question: "What happens to a person who already has an innate Quirk if they inherit One For All?",
    options: ["Their lifespan is drastically shortened due to rapid cell exhaustion", "Their head explodes", "They lose both Quirks", "Nothing unusual happens"],
    correctAnswer: 0,
    explanation: "Like an overflowing cup, holding One For All on top of an existing Quirk drains life force, killing the 4th user of old age in his 30s.",
    difficulty: "hard"
  },
  {
    questionId: "mha-050",
    question: "What suit or gift does Class 1-A and All Might fund for Deku in the epilogue after he loses One For All?",
    options: ["An advanced armored mechanical battlesuit like All Might's", "A cybernetic arm", "A hero school cape", "A new costume design"],
    correctAnswer: 0,
    explanation: "Class 1-A pools their funds to commission an advanced armored battlesuit allowing Deku to continue pro heroism.",
    difficulty: "medium"
  }
];

// 5. Guess the Anime Character (50 questions)
const guessAnimeQuestions: Question[] = [
  {
    questionId: "gac-001",
    question: "I have spiky orange hair, wield a giant cleaver Zanpakuto named Zangetsu, and serve as a Substitute Soul Reaper. Who am I?",
    options: ["Naruto Uzumaki", "Ichigo Kurosaki", "Renji Abarai", "Natsu Dragneel"],
    correctAnswer: 1,
    explanation: "Ichigo Kurosaki is the substitute shinigami protagonist of Bleach.",
    difficulty: "easy"
  },
  {
    questionId: "gac-002",
    question: "I am a rubber pirate who wears a straw hat, loves meat, and dreams of becoming the King of the Pirates. Who am I?",
    options: ["Monkey D. Luffy", "Portgas D. Ace", "Roronoa Zoro", "Shanks"],
    correctAnswer: 0,
    explanation: "Monkey D. Luffy is the Straw Hat captain from One Piece.",
    difficulty: "easy"
  },
  {
    questionId: "gac-003",
    question: "I am a blond ninja with whiskers on my cheeks who houses the Nine-Tails and became the Seventh Hokage. Who am I?",
    options: ["Minato Namikaze", "Naruto Uzumaki", "Boruto Uzumaki", "Jiraiya"],
    correctAnswer: 1,
    explanation: "Naruto Uzumaki is the titular hero of Naruto and the Seventh Hokage.",
    difficulty: "easy"
  },
  {
    questionId: "gac-004",
    question: "I am a Saiyan raised on Earth, wear an orange turtle hermit gi, love food, and can transform into Super Saiyan. Who am I?",
    options: ["Vegeta", "Son Goku (Kakarot)", "Gohan", "Trunks"],
    correctAnswer: 1,
    explanation: "Goku is the legendary martial artist protagonist of Dragon Ball.",
    difficulty: "easy"
  },
  {
    questionId: "gac-005",
    question: "I am a high school genius who found a supernatural notebook and proclaimed myself the God of the New World. Who am I?",
    options: ["L Lawliet", "Light Yagami (Kira)", "Lelouch vi Britannia", "Shinichi Kudo"],
    correctAnswer: 1,
    explanation: "Light Yagami is the brilliant and megalomaniacal anti-hero of Death Note.",
    difficulty: "easy"
  },
  {
    questionId: "gac-006",
    question: "I wear a blindfold over my Six Eyes, possess the Limitless technique, and claim to be 'The Honored One'. Who am I?",
    options: ["Satoru Gojo", "Suguru Geto", "Megumi Fushiguro", "Kento Nanami"],
    correctAnswer: 0,
    explanation: "Satoru Gojo is the strongest modern jujutsu sorcerer from Jujutsu Kaisen.",
    difficulty: "easy"
  },
  {
    questionId: "gac-007",
    question: "I am a boy with a demon sister, wear hanafuda earrings and a green checkered haori, and smell the 'opening thread'. Who am I?",
    options: ["Zenitsu Agatsuma", "Tanjiro Kamado", "Inosuke Hashibira", "Giyu Tomioka"],
    correctAnswer: 1,
    explanation: "Tanjiro Kamado is the kindhearted protagonist of Demon Slayer.",
    difficulty: "easy"
  },
  {
    questionId: "gac-008",
    question: "I am the 'Hero for Fun' who trained so hard I went completely bald and defeat every villain with a single punch. Who am I?",
    options: ["Genos", "Saitama", "King", "Bang"],
    correctAnswer: 1,
    explanation: "Saitama is the overwhelmingly overpowered hero of One Punch Man.",
    difficulty: "easy"
  },
  {
    questionId: "gac-009",
    question: "I am the Fullmetal Alchemist who lost an arm and a leg restoring my brother Alphonse's soul to a suit of armor. Who am I?",
    options: ["Roy Mustang", "Edward Elric", "Scar", "Van Hohenheim"],
    correctAnswer: 1,
    explanation: "Edward Elric is the automail-bearing protagonist of Fullmetal Alchemist.",
    difficulty: "easy"
  },
  {
    questionId: "gac-010",
    question: "I am an exiled prince of Britannia who gained the Geass of absolute obedience and leads the Black Knights as 'Zero'. Who am I?",
    options: ["Suzaku Kururugi", "Lelouch vi Britannia", "Rolo Lamperouge", "Charles zi Britannia"],
    correctAnswer: 1,
    explanation: "Lelouch vi Britannia commands the rebellion as Zero in Code Geass.",
    difficulty: "medium"
  },
  {
    questionId: "gac-011",
    question: "I am a three-sword style swordsman who constantly gets lost and aims to become the World's Greatest Swordsman. Who am I?",
    options: ["Roronoa Zoro", "Trafalgar Law", "Dracule Mihawk", "Killer"],
    correctAnswer: 0,
    explanation: "Roronoa Zoro is Luffy's first mate and master of Santoryu.",
    difficulty: "easy"
  },
  {
    questionId: "gac-012",
    question: "I am a green-haired student who was born quirkless, inherited One For All, and mutters constantly in notebooks. Who am I?",
    options: ["Izuku Midoriya (Deku)", "Katsuki Bakugo", "Shoto Todoroki", "Eijiro Kirishima"],
    correctAnswer: 0,
    explanation: "Izuku Midoriya is the ninth wielder of One For All in My Hero Academia.",
    difficulty: "easy"
  },
  {
    questionId: "gac-013",
    question: "I am Humanity's Strongest Soldier, obsessed with cleanliness, and carry a deep hatred for the Beast Titan. Who am I?",
    options: ["Erwin Smith", "Captain Levi Ackerman", "Armin Arlert", "Jean Kirstein"],
    correctAnswer: 1,
    explanation: "Levi Ackerman is the fan-favorite squad captain from Attack on Titan.",
    difficulty: "easy"
  },
  {
    questionId: "gac-014",
    question: "I am an ex-assassin from the Zoldyck family who uses lightning-transmuted Nen and rides a skateboard. Who am I?",
    options: ["Gon Freecss", "Killua Zoldyck", "Kurapika", "Illumi Zoldyck"],
    correctAnswer: 1,
    explanation: "Killua Zoldyck is Gon's best friend and lightning assassin from Hunter x Hunter.",
    difficulty: "easy"
  },
  {
    questionId: "gac-015",
    question: "I left Whale Island with a fishing rod to become a Hunter and find my deadbeat father Ging. Who am I?",
    options: ["Leorio Paradinight", "Gon Freecss", "Kurapika", "Hisoka Morow"],
    correctAnswer: 1,
    explanation: "Gon Freecss is the cheerful enhancer protagonist of Hunter x Hunter.",
    difficulty: "easy"
  },
  {
    questionId: "gac-016",
    question: "I am the sole survivor of the Kurta Clan, seek vengeance against the Phantom Troupe, and wield Nen chains. Who am I?",
    options: ["Kurapika", "Chrollo Lucilfer", "Feitan", "Kalluto"],
    correctAnswer: 0,
    explanation: "Kurapika's eyes glow scarlet when agitated, and he swore vengeance on the Spiders.",
    difficulty: "easy"
  },
  {
    questionId: "gac-017",
    question: "I am a creepy jester magician whose Nen ability Bungee Gum has both the properties of rubber and gum. Who am I?",
    options: ["Illumi", "Hisoka Morow", "Pariston Hill", "Genthru"],
    correctAnswer: 1,
    explanation: "Hisoka Morow is the bloodthirsty magician who loves fighting strong opponents.",
    difficulty: "easy"
  },
  {
    questionId: "gac-018",
    question: "I have a demon fox spirit sealed inside me, was an outcast, and eat miso pork ramen at Ichiraku. Who am I?",
    options: ["Sasuke Uchiha", "Naruto Uzumaki", "Kakashi Hatake", "Iruka Umino"],
    correctAnswer: 1,
    explanation: "Naruto Uzumaki is famous for his love of Ichiraku Ramen.",
    difficulty: "easy"
  },
  {
    questionId: "gac-019",
    question: "I am the copy ninja who wields a Sharingan eye, invented Chidori, and reads 'Make-Out Paradise' novels. Who am I?",
    options: ["Obito Uchiha", "Kakashi Hatake", "Itachi Uchiha", "Might Guy"],
    correctAnswer: 1,
    explanation: "Kakashi Hatake is the masked sensei of Team 7 and the Sixth Hokage.",
    difficulty: "easy"
  },
  {
    questionId: "gac-020",
    question: "I slaughtered my entire clan in a single night to prevent a civil war, sparing only my beloved younger brother Sasuke. Who am I?",
    options: ["Madara Uchiha", "Itachi Uchiha", "Shisui Uchiha", "Fugaku Uchiha"],
    correctAnswer: 1,
    explanation: "Itachi Uchiha bore the tragic burden of eliminating the Uchiha Clan for Konoha's peace.",
    difficulty: "easy"
  },
  {
    questionId: "gac-021",
    question: "I am the Prince of all Saiyans, deeply proud, married to Bulma, and constantly striving to surpass Kakarot. Who am I?",
    options: ["Raditz", "Nappa", "Vegeta", "Bardock"],
    correctAnswer: 2,
    explanation: "Vegeta is the proud Saiyan prince from Dragon Ball.",
    difficulty: "easy"
  },
  {
    questionId: "gac-022",
    question: "I am an immortal half-demon who wields the Tessaiga sword, wears red fire-rat robes, and is bound by the word 'Sit!'. Who am I?",
    options: ["Sesshomaru", "Inuyasha", "Naraku", "Koga"],
    correctAnswer: 1,
    explanation: "Inuyasha is the dog-eared half-demon hero of Inuyasha.",
    difficulty: "medium"
  },
  {
    questionId: "gac-023",
    question: "I am a lazy silver-haired samurai who suffers from high blood sugar, loves Strawberry Milk, and runs the Yorozuya. Who am I?",
    options: ["Shinpachi Shimura", "Gintoki Sakata", "Kotaro Katsura", "Toushirou Hijikata"],
    correctAnswer: 1,
    explanation: "Gintoki Sakata (the White Yaksha) is the comical and deadly hero of Gintama.",
    difficulty: "medium"
  },
  {
    questionId: "gac-024",
    question: "I am a vampire who serves the Hellsing organization, dual-wields custom pistols, and wears a red coat and fedora. Who am I?",
    options: ["Alexander Anderson", "Alucard", "Walter C. Dornez", "Pip Bernadotte"],
    correctAnswer: 1,
    explanation: "Alucard (Dracula spelled backwards) is the supreme vampire in Hellsing.",
    difficulty: "medium"
  },
  {
    questionId: "gac-025",
    question: "I am a high schooler who swallowed a cursed finger and became the vessel for Ryomen Sukuna. Who am I?",
    options: ["Megumi Fushiguro", "Yuji Itadori", "Yuta Okkotsu", "Aoi Todo"],
    correctAnswer: 1,
    explanation: "Yuji Itadori is the superhumanly athletic vessel of the King of Curses in Jujutsu Kaisen.",
    difficulty: "easy"
  },
  {
    questionId: "gac-026",
    question: "I am the King of Curses who possesses four arms, two faces, and commands the Malevolent Shrine. Who am I?",
    options: ["Ryomen Sukuna", "Kenjaku", "Mahito", "Jogo"],
    correctAnswer: 0,
    explanation: "Ryomen Sukuna is the terrifying calamity from the Golden Age of Jujutsu.",
    difficulty: "easy"
  },
  {
    questionId: "gac-027",
    question: "I am a quiet demon who lives inside a wooden box on my brother's back and wears a bamboo muzzle. Who am I?",
    options: ["Kanao", "Nezuko Kamado", "Tamayo", "Daki"],
    correctAnswer: 1,
    explanation: "Nezuko Kamado is Tanjiro's beloved demon sister in Demon Slayer.",
    difficulty: "easy"
  },
  {
    questionId: "gac-028",
    question: "I wear a hollow boar mask, shout 'Comin' through!', and charge forward with two chipped serrated swords. Who am I?",
    options: ["Zenitsu Agatsuma", "Inosuke Hashibira", "Genya Shinazugawa", "Tengen Uzui"],
    correctAnswer: 1,
    explanation: "Inosuke Hashibira is the wild mountain-dwelling beast slayer in Demon Slayer.",
    difficulty: "easy"
  },
  {
    questionId: "gac-029",
    question: "I am a cowardly demon slayer with yellow hair who only displays terrifying lightning speed when I fall unconscious. Who am I?",
    options: ["Zenitsu Agatsuma", "Kaigaku", "Murata", "Rengoku"],
    correctAnswer: 0,
    explanation: "Zenitsu Agatsuma masters Thunder Breathing First Form while asleep.",
    difficulty: "easy"
  },
  {
    questionId: "gac-030",
    question: "I am a master swordsman with a cross-shaped scar on my cheek who vowed never to kill again using a reverse-blade sword. Who am I?",
    options: ["Hajime Saito", "Himura Kenshin (Battosai)", "Makoto Shishio", "Sanosuke Sagara"],
    correctAnswer: 1,
    explanation: "Himura Kenshin is the wandering rurouni from Rurouni Kenshin.",
    difficulty: "easy"
  },
  {
    questionId: "gac-031",
    question: "I am the captain of Squad 10 in the Soul Society who wields the ice dragon Zanpakuto Hyorinmaru. Who am I?",
    options: ["Byakuya Kuchiki", "Toshiro Hitsugaya", "Kenpachi Zaraki", "Shunsui Kyoraku"],
    correctAnswer: 1,
    explanation: "Toshiro Hitsugaya is the young prodigy captain in Bleach.",
    difficulty: "medium"
  },
  {
    questionId: "gac-032",
    question: "I am the battle-crazed captain of Squad 11 who doesn't even know his Zanpakuto's name initially and wears an eye patch that eats spiritual pressure. Who am I?",
    options: ["Ikkaku Madarame", "Kenpachi Zaraki", "Mayuri Kurotsuchi", "Sajin Komamura"],
    correctAnswer: 1,
    explanation: "Kenpachi Zaraki fights purely for the thrill of battle with monstrous spiritual energy.",
    difficulty: "medium"
  },
  {
    questionId: "gac-033",
    question: "I faked my own murder, removed my spectacles, slicked back my hair, and declared 'I will stand at the top of the heavens'. Who am I?",
    options: ["Gin Ichimaru", "Sosuke Aizen", "Kaname Tosen", "Kisuke Urahara"],
    correctAnswer: 1,
    explanation: "Sosuke Aizen is the mastermind antagonist who deceived the entire Soul Society.",
    difficulty: "easy"
  },
  {
    questionId: "gac-034",
    question: "I am a fire dragon slayer wizard with pink hair who gets horribly motion sick on all transportation. Who am I?",
    options: ["Gray Fullbuster", "Natsu Dragneel", "Gajeel Redfox", "Zeref Dragneel"],
    correctAnswer: 1,
    explanation: "Natsu Dragneel is the hot-headed dragon slayer hero of Fairy Tail.",
    difficulty: "easy"
  },
  {
    questionId: "gac-035",
    question: "I am a high school student with spiky hair who was turned into an elementary school child by the Black Organization's poison APTX 4869. Who am I?",
    options: ["Heiji Hattori", "Conan Edogawa (Shinichi Kudo)", "Kaitou Kid", "Kogoro Mori"],
    correctAnswer: 1,
    explanation: "Shinichi Kudo investigates crimes under the alias Conan Edogawa in Detective Conan.",
    difficulty: "easy"
  },
  {
    questionId: "gac-036",
    question: "I am the legendary 'Black Swordsman' who survived the Eclipse, carries the massive Dragonslayer blade, and possesses a mechanical arm. Who am I?",
    options: ["Griffith", "Guts", "Casca", "Skull Knight"],
    correctAnswer: 1,
    explanation: "Guts is the relentless branded warrior from Berserk.",
    difficulty: "easy"
  },
  {
    questionId: "gac-037",
    question: "I am a teenage psychic with pink hair and green antennae glasses who just wants to live a quiet life eating coffee jelly. Who am I?",
    options: ["Shigeo Kageyama (Mob)", "Kusuo Saiki", "Reigen Arataka", "Teruki Hanazawa"],
    correctAnswer: 1,
    explanation: "Kusuo Saiki is the god-tier esper protagonist of The Disastrous Life of Saiki K.",
    difficulty: "medium"
  },
  {
    questionId: "gac-038",
    question: "I am a middle schooler with bowl-cut hair who works for a con-artist psychic and unleashes apocalyptic psychic power when my emotions reach 100%. Who am I?",
    options: ["Ritsu Kageyama", "Shigeo Kageyama (Mob)", "Teru", "Toichiro Suzuki"],
    correctAnswer: 1,
    explanation: "Shigeo Kageyama (Mob) is the protagonist of Mob Psycho 100.",
    difficulty: "easy"
  },
  {
    questionId: "gac-039",
    question: "I am the Flame Alchemist in the Amestris military who snaps my fingers using ignition cloth gloves to produce explosive firestorms. Who am I?",
    options: ["Maes Hughes", "Roy Mustang", "Alex Louis Armstrong", "Jean Havoc"],
    correctAnswer: 1,
    explanation: "Colonel Roy Mustang is the charismatic Flame Alchemist in Fullmetal Alchemist.",
    difficulty: "easy"
  },
  {
    questionId: "gac-040",
    question: "I am a space cowboy bounty hunter aboard the Bebop who smokes cigarettes and practices Jeet Kune Do. Who am I?",
    options: ["Jet Black", "Spike Spiegel", "Vicious", "Faye Valentine"],
    correctAnswer: 1,
    explanation: "Spike Spiegel is the cool, tragic protagonist of Cowboy Bebop.",
    difficulty: "easy"
  },
  {
    questionId: "gac-041",
    question: "I am an orphaned boy who can turn into a colossal Attack Titan and yelled 'Tatakae! Tatakae!' (Fight!). Who am I?",
    options: ["Armin Arlert", "Eren Jaeger", "Jean Kirstein", "Reiner Braun"],
    correctAnswer: 1,
    explanation: "Eren Jaeger is the freedom-obsessed focal character of Attack on Titan.",
    difficulty: "easy"
  },
  {
    questionId: "gac-042",
    question: "I am the cook of the Straw Hat Pirates, refuse to use my hands in battle, and love women unconditionally. Who am I?",
    options: ["Roronoa Zoro", "Sanji (Vinsmoke Sanji)", "Usopp", "Brook"],
    correctAnswer: 1,
    explanation: "Black Leg Sanji is the chivalrous martial artist chef of One Piece.",
    difficulty: "easy"
  },
  {
    questionId: "gac-043",
    question: "I am a doctor who was an ordinary reindeer before eating the Human-Human Fruit, and I love cotton candy. Who am I?",
    options: ["Tony Tony Chopper", "Bepo", "Pekoms", "Carrot"],
    correctAnswer: 0,
    explanation: "Tony Tony Chopper is the adorable reindeer doctor of the Straw Hat crew.",
    difficulty: "easy"
  },
  {
    questionId: "gac-044",
    question: "I am a living skeleton musician who ate the Revive-Revive Fruit and laughs with 'Yo-ho-ho-ho!'. Who am I?",
    options: ["Franky", "Brook", "Gecko Moria", "Ryuma"],
    correctAnswer: 1,
    explanation: "Brook is the Afro-bearing soul king swordsman and musician in One Piece.",
    difficulty: "easy"
  },
  {
    questionId: "gac-045",
    question: "I am an explosive blonde high schooler with anger management issues who shouts 'SHINEEEE!' (Die!) in battle. Who am I?",
    options: ["Eijiro Kirishima", "Katsuki Bakugo", "Neito Monoma", "Denki Kaminari"],
    correctAnswer: 1,
    explanation: "Katsuki Bakugo is Deku's fierce rival in My Hero Academia.",
    difficulty: "easy"
  },
  {
    questionId: "gac-046",
    question: "I am an immortal demon lord who disguised myself as a family man in Tokyo and fear anyone wearing hanafuda earrings. Who am I?",
    options: ["Akaza", "Muzan Kibutsuji", "Kokushibo", "Doma"],
    correctAnswer: 1,
    explanation: "Muzan Kibutsuji is the paranoid Demon King who was nearly killed by Yoriichi Tsugikuni.",
    difficulty: "easy"
  },
  {
    questionId: "gac-047",
    question: "I am a chainsaw devil hybrid who works for Public Safety because I dream of touching breasts and eating jam on toast. Who am I?",
    options: ["Aki Hayakawa", "Denji (Chainsaw Man)", "Kishibe", "Beam"],
    correctAnswer: 1,
    explanation: "Denji is the delightfully crude, golden-hearted protagonist of Chainsaw Man.",
    difficulty: "easy"
  },
  {
    questionId: "gac-048",
    question: "I am the manipulative leader of Public Safety who loves dogs and is secretly the Control Devil. Who am I?",
    options: ["Power", "Makima", "Reze", "Kobeni"],
    correctAnswer: 1,
    explanation: "Makima is the chilling antagonist of the Public Safety Arc in Chainsaw Man.",
    difficulty: "easy"
  },
  {
    questionId: "gac-049",
    question: "I am a telepathic little girl who loves peanuts and secret agent cartoons, adopted by a spy and an assassin. Who am I?",
    options: ["Anya Forger", "Becky Blackbell", "Yor Forger", "Fiona Frost"],
    correctAnswer: 0,
    explanation: "Anya Forger is the telepathic mind-reading daughter in Spy x Family.",
    difficulty: "easy"
  },
  {
    questionId: "gac-050",
    question: "I am codename 'Twilight', Westalis's greatest intelligence spy who formed a fake family for Operation Strix. Who am I?",
    options: ["Franky Franklin", "Loid Forger", "Yuri Briar", "Donovan Desmond"],
    correctAnswer: 1,
    explanation: "Loid Forger is the master spy and father figure of Spy x Family.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'my-hero-academia.json'),
  JSON.stringify(mhaQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated my-hero-academia.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'guess-anime-character.json'),
  JSON.stringify(guessAnimeQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated guess-anime-character.json (50 questions)');
