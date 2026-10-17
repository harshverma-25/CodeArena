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

// 6. Bleach (50 questions)
const bleachQuestions: Question[] = [
  {
    questionId: "bl-001",
    question: "What is the name of Ichigo Kurosaki's Zanpakuto?",
    options: ["Senbonzakura", "Zangetsu", "Hyorinmaru", "Kyoka Suigetsu"],
    correctAnswer: 1,
    explanation: "Zangetsu (Slaying Moon) is the spirit of Ichigo's Zanpakuto.",
    difficulty: "easy"
  },
  {
    questionId: "bl-002",
    question: "Who was the Soul Reaper who transferred her powers to Ichigo in the very first episode?",
    options: ["Orihime Inoue", "Rukia Kuchiki", "Yoruichi Shihoin", "Rangiku Matsumoto"],
    correctAnswer: 1,
    explanation: "Rukia Kuchiki was forced to pierce Ichigo with her blade to save his family from a Hollow.",
    difficulty: "easy"
  },
  {
    questionId: "bl-003",
    question: "What is the second and ultimate release stage of a Zanpakuto called?",
    options: ["Shikai", "Bankai", "Resurreccion", "Vollstandig"],
    correctAnswer: 1,
    explanation: "Bankai is the final release form of a Soul Reaper's Zanpakuto, multiplying power 5 to 10-fold.",
    difficulty: "easy"
  },
  {
    questionId: "bl-004",
    question: "What is Ichigo's signature energy wave attack called?",
    options: ["Getsuga Tensho", "Cero", "Bala", "Hadou 90: Kurohitsugi"],
    correctAnswer: 0,
    explanation: "Getsuga Tensho (Moon Fang Heaven-Piercer) concentrates spiritual pressure into a slashing crescent arc.",
    difficulty: "easy"
  },
  {
    questionId: "bl-005",
    question: "What organization of 13 military divisions protects the Soul Society?",
    options: ["Espada", "Gotei 13", "Vandenreich", "Visoreds"],
    correctAnswer: 1,
    explanation: "The Gotei 13 (Thirteen Court Guard Squads) is the premier military defense organization of the Soul Society.",
    difficulty: "easy"
  },
  {
    questionId: "bl-006",
    question: "Who was the Captain of Squad 5 who betrayed the Soul Society and ascended to Hueco Mundo?",
    options: ["Gin Ichimaru", "Kaname Tosen", "Sosuke Aizen", "Kisuke Urahara"],
    correctAnswer: 2,
    explanation: "Sosuke Aizen staged his own murder to orchestrate the acquisition of the Hogyoku.",
    difficulty: "easy"
  },
  {
    questionId: "bl-007",
    question: "What is the name of Aizen's complete hypnosis Zanpakuto?",
    options: ["Kyoka Suigetsu", "Senbonzakura", "Suzumebachi", "Ashisogi Jizo"],
    correctAnswer: 0,
    explanation: "Kyoka Suigetsu (Mirror Flower, Water Moon) places anyone who sees its release under complete hypnosis.",
    difficulty: "easy"
  },
  {
    questionId: "bl-008",
    question: "What miraculous artifact capable of dissolving boundaries between Soul Reapers and Hollows did Urahara and Aizen develop?",
    options: ["Hogyoku", "Oken", "Quincy Cross", "Sanrei Glove"],
    correctAnswer: 0,
    explanation: "The Hogyoku manifests the deepest desires of those around it and allows hollowfication/arrancarization.",
    difficulty: "medium"
  },
  {
    questionId: "bl-009",
    question: "What are the top 10 most powerful Arrancars under Aizen's command called?",
    options: ["The Sternritter", "The Espada", "The Visoreds", "The Privaron"],
    correctAnswer: 1,
    explanation: "The Espada are ranked 0 to 9 in order of lethal spiritual pressure.",
    difficulty: "easy"
  },
  {
    questionId: "bl-010",
    question: "Who is the 4th Espada with bat-like wings who represents Emptiness and achieves Segunda Etapa?",
    options: ["Grimmjow Jaegerjaquez", "Ulquiorra Cifer", "Coyote Starrk", "Tier Harribel"],
    correctAnswer: 1,
    explanation: "Ulquiorra Cifer possesses two levels of release and tests Ichigo's resolve in Las Noches.",
    difficulty: "medium"
  },
  {
    questionId: "bl-011",
    question: "Who is the 6th Espada with blue hair and a jaw-mask who fought Ichigo in multiple bloody duels?",
    options: ["Grimmjow Jaegerjaquez", "Nnoitra Gilga", "Szayelaporro Granz", "Baraggan Louisenbairn"],
    correctAnswer: 0,
    explanation: "Grimmjow is the panther-like Arrancar whose release command is 'Grind, Pantera'.",
    difficulty: "easy"
  },
  {
    questionId: "bl-012",
    question: "Who is the Captain-Commander of the Gotei 13 who wields the devastating flame Zanpakuto Ryujin Jakka?",
    options: ["Shunsui Kyoraku", "Genryusai Shigekuni Yamamoto", "Jushiro Ukitake", "Retsu Unohana"],
    correctAnswer: 1,
    explanation: "Yamamoto founded the Gotei 13 and held the mantle of Captain-Commander for over 1,000 years.",
    difficulty: "easy"
  },
  {
    questionId: "bl-013",
    question: "What is the release command and power of Byakuya Kuchiki's Bankai, Senbonzakura Kageyoshi?",
    options: ["Scatter, turning the blade into thousands of razor-sharp cherry blossom petals", "Freeze all water in the atmosphere", "Burn the world to ashes", "Cut everything in half"],
    correctAnswer: 0,
    explanation: "Senbonzakura Kageyoshi drops the sword into the ground, summoning millions of blade petals.",
    difficulty: "easy"
  },
  {
    questionId: "bl-014",
    question: "What is Kisuke Urahara's candy shop in the human world that acts as a base of operations?",
    options: ["Urahara Shop (Urahara Shoten)", "Soul Emporium", "Karakura Goods", "Seireitei Outpost"],
    correctAnswer: 0,
    explanation: "Former Squad 12 Captain Kisuke Urahara runs a quiet general shop in Karakura Town.",
    difficulty: "easy"
  },
  {
    questionId: "bl-015",
    question: "Who is the former 2nd Division Captain and 'Goddess of Flash' who can transform into a black cat?",
    options: ["Yoruichi Shihoin", "Soi Fon", "Kukai Shiba", "Mashiro Kuna"],
    correctAnswer: 0,
    explanation: "Yoruichi Shihoin is the master of Shunpo and unarmed martial combat.",
    difficulty: "easy"
  },
  {
    questionId: "bl-016",
    question: "What human clan of spiritual archers fights Hollows using Bows and Spirit Particles (Reishi)?",
    options: ["Fullbringers", "Quincies", "Visoreds", "Bounts"],
    correctAnswer: 1,
    explanation: "The Quincies, led historically by Yhwach and represented by Uryu Ishida, destroy Hollows entirely.",
    difficulty: "easy"
  },
  {
    questionId: "bl-017",
    question: "Who is Ichigo's high school rival and Quincy ally whose father is Ryuken Ishida?",
    options: ["Yasutora Sado (Chad)", "Uryu Ishida", "Keigo Asano", "Mizuiro Kojima"],
    correctAnswer: 1,
    explanation: "Uryu Ishida is the proud, glasses-wearing Quincy prodigy.",
    difficulty: "easy"
  },
  {
    questionId: "bl-018",
    question: "What is Orihime Inoue's extraordinary hairpin-based power called?",
    options: ["Shun Shun Rikka (Six Flowers of the Hibiscus Shield)", "Brazo Derecha", "Santen Kesshun", "Kototen Rikka"],
    correctAnswer: 0,
    explanation: "Shun Shun Rikka rejects phenomena, effectively reversing injuries and time-space outcomes.",
    difficulty: "medium"
  },
  {
    questionId: "bl-019",
    question: "What is Yasutora Sado's (Chad) fullbring ability that manifests armored arms?",
    options: ["Right Arm of the Giant & Left Arm of the Devil", "Titan Claws", "Iron Fist of El Directo", "Stone Aegis"],
    correctAnswer: 0,
    explanation: "Brazo Derecha de Gigante defends while Brazo Izquierda del Diablo delivers crushing strikes.",
    difficulty: "medium"
  },
  {
    questionId: "bl-020",
    question: "What is the ancient Father of the Quincies and Emperor of the Wandenreich called?",
    options: ["Yhwach", "Jugram Haschwalth", "Gerard Valkyrie", "Lille Barro"],
    correctAnswer: 0,
    explanation: "Yhwach awakened after 900 years to wage the Thousand-Year Blood War.",
    difficulty: "easy"
  },
  {
    questionId: "bl-021",
    question: "What is Yhwach's terrifying almighty ability to see and alter all possible futures?",
    options: ["The Almighty ('A')", "The Visionary ('V')", "The Balance ('B')", "The Miracle ('M')"],
    correctAnswer: 0,
    explanation: "The Almighty allows Yhwach to see infinite future timelines and reshape them to his advantage.",
    difficulty: "medium"
  },
  {
    questionId: "bl-022",
    question: "Who was revealed to be the very first Kenpachi (Yachiru Unohana) and captain of Squad 4?",
    options: ["Retsu Unohana", "Yachiru Kusajishi", "Isane Kotetsu", "Nemu Kurotsuchi"],
    correctAnswer: 0,
    explanation: "Unohana was the most notorious mass murderer in Soul Society history and the original First Kenpachi.",
    difficulty: "medium"
  },
  {
    questionId: "bl-023",
    question: "What is the name of the elite Five Captains of the Royal Guard who protect the Soul King?",
    options: ["Zero Division (Squad 0)", "Imperial Guard", "Oken Legion", "Court Special Forces"],
    correctAnswer: 0,
    explanation: "Squad 0 consists of 5 legendary figures whose combined power surpasses all 13 Gotei squads combined.",
    difficulty: "medium"
  },
  {
    questionId: "bl-024",
    question: "Who is the Squad 0 member and 'God of the Sword' who forges every single Asauchi / Zanpakuto?",
    options: ["Ichibe Hyosube", "Oetsu Nimaiya", "Tenjiro Kirinji", "Senjumaru Shutara"],
    correctAnswer: 1,
    explanation: "Oetsu Nimaiya created all Zanpakuto and forged Ichigo's true dual Zangetsu blades.",
    difficulty: "hard"
  },
  {
    questionId: "bl-025",
    question: "Who is the leader of Squad 0 who names everything in the Soul Society and wields the ink brush Ichimonji?",
    options: ["Ichibe Hyosube", "Oetsu Nimaiya", "Genryusai Yamamoto", "Sosuke Aizen"],
    correctAnswer: 0,
    explanation: "Ichibe Hyosube, the Monk of Perception, can erase names and strip all divine powers.",
    difficulty: "hard"
  },
  {
    questionId: "bl-026",
    question: "Who was the 'old man Zangetsu' inside Ichigo's soul actually revealed to be?",
    options: ["The manifestation of Ichigo's Quincy powers (resembling young Yhwach from 1,000 years ago)", "A demon spirit", "His biological grandfather", "A rogue Soul Reaper"],
    correctAnswer: 0,
    explanation: "Old Man Zangetsu represented Ichigo's maternal Quincy heritage, suppressing his true Hollow/Shinigami power.",
    difficulty: "hard"
  },
  {
    questionId: "bl-027",
    question: "Who is Ichigo's father, an ex-captain of the 10th Division who disguised himself as a goofy doctor?",
    options: ["Isshin Kurosaki (Isshin Shiba)", "Ryuken Ishida", "Kisuke Urahara", "Kaien Shiba"],
    correctAnswer: 0,
    explanation: "Isshin Shiba was head of the Shiba Clan and captain of Squad 10 before marrying Masaki Kurosaki.",
    difficulty: "medium"
  },
  {
    questionId: "bl-028",
    question: "What was Ichigo's mother Masaki Kurosaki's true heritage that resulted in her death to Grand Fisher?",
    options: ["She was a pure-blood (Echt) Quincy who lost her powers to Yhwach's Auswahlen", "She was a Hollow", "She was a human witch", "She was a Soul Reaper"],
    correctAnswer: 0,
    explanation: "Masaki was a powerful Quincy whose Blut Vene was stripped away during Yhwach's holy selection.",
    difficulty: "hard"
  },
  {
    questionId: "bl-029",
    question: "What technique did Ichigo use to defeat Sosuke Aizen in the Fake Karakura Town climax?",
    options: ["Final Getsuga Tensho (Mugetsu)", "Bankai: Tensa Zangetsu", "Gran Rey Cero", "Hollow Mask Burst"],
    correctAnswer: 0,
    explanation: "Using the Final Getsuga Tensho, Ichigo became the attack itself, trading all his spiritual powers for absolute god-slaying force.",
    difficulty: "easy"
  },
  {
    questionId: "bl-030",
    question: "What form did Ichigo undergo when Ulquiorra blasted a hole through his chest in Hueco Mundo?",
    options: ["Full Vasto Lorde Hollow transformation", "Bankai form 2", "Quincy Vollstandig", "Fullbring Mode"],
    correctAnswer: 0,
    explanation: "White Ichigo seized full control, manifesting the iconic horn-bearing Vasto Lorde monster.",
    difficulty: "easy"
  },
  {
    questionId: "bl-031",
    question: "What is the high-speed movement technique practiced by Soul Reapers called?",
    options: ["Shunpo (Flash Step)", "Sonido", "Hirenkyaku", "Bringer Light"],
    correctAnswer: 0,
    explanation: "Shunpo is the foundational flash step technique of the Soul Society.",
    difficulty: "easy"
  },
  {
    questionId: "bl-032",
    question: "What high-speed movement technique is uniquely used by Arrancars?",
    options: ["Sonido", "Shunpo", "Hirenkyaku", "Bringer Light"],
    correctAnswer: 0,
    explanation: "Sonido (Sound) is the Arrancar equivalent of flash step, accompanied by a static boom.",
    difficulty: "medium"
  },
  {
    questionId: "bl-033",
    question: "What high-speed movement technique is uniquely used by Quincies?",
    options: ["Hirenkyaku", "Sonido", "Shunpo", "Bringer Light"],
    correctAnswer: 0,
    explanation: "Hirenkyaku gathers reishi under the user's feet to glide through the air.",
    difficulty: "medium"
  },
  {
    questionId: "bl-034",
    question: "Who is the sadomasochistic science captain of Squad 12 who modifies his own body and daughters?",
    options: ["Mayuri Kurotsuchi", "Kisuke Urahara", "Akon", "Nanao Ise"],
    correctAnswer: 0,
    explanation: "Mayuri Kurotsuchi heads the Research and Development Institute with bizarre poisons and gadgets.",
    difficulty: "easy"
  },
  {
    questionId: "bl-035",
    question: "Who is the 1st Espada who split his soul into two (himself and Lilynette Gingerbuck) due to loneliness?",
    options: ["Coyote Starrk", "Baraggan Louisenbairn", "Tier Harribel", "Nnoitra Gilga"],
    correctAnswer: 0,
    explanation: "Coyote Starrk was so spiritually dense that hollows around him perished, so he divided his soul.",
    difficulty: "medium"
  },
  {
    questionId: "bl-036",
    question: "Which Espada was the former king of Hueco Mundo whose breath 'Respira' rots everything it touches?",
    options: ["Baraggan Louisenbairn", "Szayelaporro Granz", "Aaroniero Arruruerie", "Yammy Llargo"],
    correctAnswer: 0,
    explanation: "Baraggan (Espada 2) commands the power of Senescence and aging.",
    difficulty: "medium"
  },
  {
    questionId: "bl-037",
    question: "Who is the sole female member among the top Espada (Rank 3) with shark water attributes?",
    options: ["Tier Harribel", "Nelliel Tu Odelschwanck", "Cirucci Sanderwicci", "Sung-Sun"],
    correctAnswer: 0,
    explanation: "Tier Harribel (Tiburón) leads Hueco Mundo after Aizen's defeat.",
    difficulty: "easy"
  },
  {
    questionId: "bl-038",
    question: "Who was the adorable child Arrancar who reverted to her former 3rd Espada adult self to protect Ichigo?",
    options: ["Nelliel Tu Odelschwanck (Nel)", "Riruka Dokugamine", "Kukaku Shiba", "Yachiru"],
    correctAnswer: 0,
    explanation: "Nel was the former Espada 3 betrayed and wounded by Nnoitra, transforming back when Ichigo was in peril.",
    difficulty: "easy"
  },
  {
    questionId: "bl-039",
    question: "What is the name of Rukia Kuchiki's beautiful Bankai that brings ambient temperatures to Absolute Zero (-273.15°C)?",
    options: ["Hakka no Togame", "Sode no Shirayuki", "Daiguren Hyorinmaru", "Minazuki"],
    correctAnswer: 0,
    explanation: "Hakka no Togame (White Haze Punishment) freezes all matter to absolute zero within a pillar of mist.",
    difficulty: "hard"
  },
  {
    questionId: "bl-040",
    question: "Who becomes the new Captain-Commander of the Gotei 13 following Yamamoto's death?",
    options: ["Shunsui Kyoraku", "Byakuya Kuchiki", "Jushiro Ukitake", "Kenpachi Zaraki"],
    correctAnswer: 0,
    explanation: "The Central 46 appoint the laid-back yet ruthless Squad 8 Captain Shunsui Kyoraku as supreme commander.",
    difficulty: "medium"
  },
  {
    questionId: "bl-041",
    question: "What children's game rules does Shunsui Kyoraku's dual Zanpakuto Katen Kyokotsu enforce on reality?",
    options: ["Children's games where the rules are absolute law (Takaoni, Kageoni, Irooni)", "Card games", "Hide and seek only", "Chess puzzles"],
    correctAnswer: 0,
    explanation: "Katen Kyokotsu brings childhood games into deadly reality where both players must obey.",
    difficulty: "medium"
  },
  {
    questionId: "bl-042",
    question: "What is Kenpachi Zaraki's Shikai command and weapon name unlocked in Thousand-Year Blood War?",
    options: ["Drink, Nozarashi", "Slay, Ryujin", "Roar, Zabimaru", "Awaken, Zangetsu"],
    correctAnswer: 0,
    explanation: "After slaying Unohana, Zaraki heard his Zanpakuto speak for the first time: 'Nozarashi'.",
    difficulty: "hard"
  },
  {
    questionId: "bl-043",
    question: "Who was revealed to be the personification of Kenpachi Zaraki's Bankai?",
    options: ["Yachiru Kusajishi", "Retsu Unohana", "Nemu", "Kurotsuchi"],
    correctAnswer: 0,
    explanation: "The pink-haired child Yachiru Kusajishi was Zaraki's manifestation of his sword spirit all along.",
    difficulty: "hard"
  },
  {
    questionId: "bl-044",
    question: "What group of exiled Soul Reapers with Hollow masks did Shinji Hirako lead?",
    options: ["The Visoreds (Vizards)", "The Espada", "The Fullbringers", "The Xcution"],
    correctAnswer: 0,
    explanation: "The Visoreds were former captains and lieutenants hollowfied by Aizen 100 years prior.",
    difficulty: "easy"
  },
  {
    questionId: "bl-045",
    question: "What group composed of humans born to mothers attacked by Hollows includes Ginjo and Tsukishima?",
    options: ["Xcution (Fullbringers)", "Vandenreich", "Sternritter", "Visoreds"],
    correctAnswer: 0,
    explanation: "Xcution consists of Fullbringers who manipulate souls in matter to cultivate power.",
    difficulty: "medium"
  },
  {
    questionId: "bl-046",
    question: "What was Shukuro Tsukishima's terrifying Fullbring 'Book of the End' capable of?",
    options: ["Inserting his own presence into the past memories of anyone he slashes", "Erasing memories", "Reading the future", "Summoning books"],
    correctAnswer: 0,
    explanation: "Book of the End alters past events, inserting Tsukishima as an intimate friend or family member in memories.",
    difficulty: "medium"
  },
  {
    questionId: "bl-047",
    question: "Who is the giant fox-faced Captain of Squad 7 who becomes an immortal human berserker?",
    options: ["Sajin Komamura", "Kaname Tosen", "Tetsuzaemon Iba", "Kensei Muguruma"],
    correctAnswer: 0,
    explanation: "Komamura sacrifices his heart to his clan's ancestor to gain human form and invulnerability.",
    difficulty: "hard"
  },
  {
    questionId: "bl-048",
    question: "What is Renji Abarai's true Bankai name revealed in the Royal Realm?",
    options: ["Soo Zabimaru", "Hihio Zabimaru", "Zabimaru Orochi", "Kurotsugi Zabimaru"],
    correctAnswer: 0,
    explanation: "Zabimaru had only granted Renji half its name (Hihio); its true release is Soo Zabimaru.",
    difficulty: "hard"
  },
  {
    questionId: "bl-049",
    question: "Who did Ichigo Kurosaki marry at the end of the Bleach manga series?",
    options: ["Orihime Inoue", "Rukia Kuchiki", "Tatsuki Arisawa", "Neliel"],
    correctAnswer: 0,
    explanation: "Ichigo married Orihime Inoue and they had a son named Kazui Kurosaki.",
    difficulty: "easy"
  },
  {
    questionId: "bl-050",
    question: "Who did Renji Abarai marry at the end of the series?",
    options: ["Rukia Kuchiki", "Rangiku Matsumoto", "Soi Fon", "Momo Hinamori"],
    correctAnswer: 0,
    explanation: "Renji married his childhood best friend Rukia Kuchiki and had a daughter named Ichika.",
    difficulty: "easy"
  }
];

// 7. Hunter x Hunter (50 questions)
const hxhQuestions: Question[] = [
  {
    questionId: "hxh-001",
    question: "What is the magical aura energy system manipulated by Hunters called?",
    options: ["Chakra", "Nen", "Reiki", "Ki"],
    correctAnswer: 1,
    explanation: "Nen allows users to manipulate the flow of life energy (aura) produced by their bodies.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-002",
    question: "What is Gon Freecss's primary Nen category?",
    options: ["Enhancement", "Transmutation", "Emission", "Specialization"],
    correctAnswer: 0,
    explanation: "Gon is an Enhancer, using aura to boost natural physical offensive and defensive capabilities.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-003",
    question: "What is Killua Zoldyck's Nen category?",
    options: ["Transmutation", "Enhancement", "Conjuration", "Manipulation"],
    correctAnswer: 0,
    explanation: "Killua is a Transmuter who alters the properties of his aura to mimic electrical currents.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-004",
    question: "What is the name of Gon's devastating rock-paper-scissors Nen technique?",
    options: ["Jajanken", "Godspeed", "Bungee Gum", "Big Bang Impact"],
    correctAnswer: 0,
    explanation: "Jajanken (Ja-Janken) features Rock (Enhancement punch), Scissors (Transmutation blade), and Paper (Emission blast).",
    difficulty: "easy"
  },
  {
    questionId: "hxh-005",
    question: "What legendary infamous band of 13 thieves from Meteor City is headed by Chrollo Lucilfer?",
    options: ["The Phantom Troupe (Genei Ryodan)", "The Chimera Ants", "The Zoldycks", "The Shadow Beasts"],
    correctAnswer: 0,
    explanation: "The Phantom Troupe (also known as the Spiders) consists of 13 elite thieves with numbered spider tattoos.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-006",
    question: "What color do the eyes of the Kurta Clan glow when they become emotionally agitated?",
    options: ["Scarlet Red", "Electric Blue", "Golden Yellow", "Emerald Green"],
    correctAnswer: 0,
    explanation: "The Scarlet Eyes of the slaughtered Kurta clan are celebrated among underground collectors as rare treasures.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-007",
    question: "What Nen category does Kurapika shift into when his Scarlet Eyes activate?",
    options: ["Specialization (Emperor Time)", "Enhancement", "Manipulation", "Transmutation"],
    correctAnswer: 0,
    explanation: "Under Emperor Time, Kurapika becomes a Specialist capable of using 100% efficiency in all Nen categories.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-008",
    question: "What test using a cup filled with water and a floating leaf determines a user's Nen type?",
    options: ["Water Divination test", "Aura Scrying", "Leaf Prism test", "Element Chalice"],
    correctAnswer: 0,
    explanation: "The Water Divination test causes water to overflow, change taste, change color, or move the leaf.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-009",
    question: "What is Killua's lightning reflex state that connects his brain's signals directly to his aura?",
    options: ["Godspeed (Whirlwind & Speed of Lightning)", "Thunderclap", "Overdrive", "Lightning Step"],
    correctAnswer: 0,
    explanation: "Godspeed bypasses nervous system lag to trigger instant neuromuscular reflexes.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-010",
    question: "Who was the 12th Chairman of the Hunter Association who fought Meruem to the death?",
    options: ["Isaac Netero", "Ging Freecss", "Pariston Hill", "Cheadle Yorkshire"],
    correctAnswer: 0,
    explanation: "Chairman Netero spent years throwing 10,000 punches of gratitude a day on a mountaintop to achieve supersonic speed.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-011",
    question: "What is Isaac Netero's supreme Nen ability called?",
    options: ["100-Type Guanyin Bodhisattva", "Zero Hand", "Golden Buddha", "Nirvana Palm"],
    correctAnswer: 0,
    explanation: "The 100-Type Guanyin Bodhisattva manifests a colossal golden multi-armed deity that strikes in fractions of a second.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-012",
    question: "What was the name of the miniature radioactive weapon planted in Netero's heart that detonated upon his suicide?",
    options: ["Poor Man's Rose (Miniature Rose)", "Atom Bomb", "Dragon Dive", "Judgment Chain"],
    correctAnswer: 0,
    explanation: "The Poor Man's Rose is a cheap, mass-produced chemical weapon that released a lethal poison cloud.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-013",
    question: "Who is the Chimera Ant King who challenged Netero and loved the blind Gungi champion Komugi?",
    options: ["Meruem", "Neferpitou", "Shaiapouf", "Menthuthuyoupi"],
    correctAnswer: 0,
    explanation: "Meruem evolved from a tyrannical conqueror into a philosophical being through his games of Gungi with Komugi.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-014",
    question: "Which cat-like Royal Guard Chimera Ant killed Kite and was pulverized by Adult Gon?",
    options: ["Neferpitou (Pitou)", "Shaiapouf", "Youpi", "Colt"],
    correctAnswer: 0,
    explanation: "Neferpitou was an overwhelming Nen monster whose puppet Doctor Blythe repaired injuries.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-015",
    question: "What terrifying vow and sacrifice did Gon make to defeat Neferpitou?",
    options: ["He gave up all his future potential and lifespan to age into his ultimate adult form", "He traded his eyes", "He sacrificed Killua", "He drank Chimera poison"],
    correctAnswer: 0,
    explanation: "Gon sacrificed all future Nen and vitality, resulting in a state worse than death until Alluka healed him.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-016",
    question: "What wish-granting entity from the Dark Continent resides within Killua's younger sibling Alluka?",
    options: ["Nanika ('Something')", "Ai", "Brion", "Hellbell"],
    correctAnswer: 0,
    explanation: "Nanika can grant any wish without consequence if its three requests are fulfilled first.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-017",
    question: "What video game console and virtual game world was created by Ging Freecss and his friends?",
    options: ["Greed Island (JoyStation)", "NerveGear", "Dark Continent Quest", "Hunter Land"],
    correctAnswer: 0,
    explanation: "Greed Island is a real-world island operated through Nen cards designed for Hunter training.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-018",
    question: "Who was the 'Bomber' serial killer on Greed Island who set countdown explosives on players?",
    options: ["Genthru", "Razor", "Tsubega", "Binolt"],
    correctAnswer: 0,
    explanation: "Genthru used his Countdown and Little Flower abilities to slaughter players for cards.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-019",
    question: "Who was the powerful Nen master and convicted criminal who ran the Greed Island dodgeball match?",
    options: ["Razor", "Ging", "Dwun", "List"],
    correctAnswer: 0,
    explanation: "Razor threw lethal aura dodgeballs that required Gon, Killua, and Hisoka's combined strength to rebound.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-010",
    question: "What martial arts arena tower do Gon and Killua fight in to master Nen and earn money?",
    options: ["Heavens Arena (251 floors)", "Zoldyck Estate", "Trick Tower", "Yorknew Coliseum"],
    correctAnswer: 0,
    explanation: "Heavens Arena is a 251-story combat tower where Floor Masters hold rank above the 200th floor.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-021",
    question: "Who was the gentle glasses-wearing Nen instructor who taught Gon and Killua the basics of Ten, Zetsu, Ren, and Hatsu?",
    options: ["Wing", "Biscuit Krueger", "Zushi", "Kite"],
    correctAnswer: 0,
    explanation: "Wing, a disciple of the Shingen-ryu school under Biscuit Krueger, unlocked Gon and Killua's aura nodes.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-022",
    question: "What is the true appearance of Biscuit Krueger (Bisky), who looks like a cute 12-year-old girl?",
    options: ["A massive 57-year-old hyper-muscular woman", "An elderly grandmother", "A fairy", "A mannequin"],
    correctAnswer: 0,
    explanation: "Bisky despises her original colossal bodybuilder physique and prefers disguising herself as a dainty doll.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-023",
    question: "What is Chrollo Lucilfer's Specialist Nen ability that allows him to steal others' techniques?",
    options: ["Skill Hunter (Bandit's Secret)", "Memory Bomb", "Order Stamp", "Sun and Moon"],
    correctAnswer: 0,
    explanation: "Bandit's Secret stores stolen Nen abilities in a conjured book under strict conditions.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-024",
    question: "What heavy doors at the entrance of the Zoldyck estate must guests push open to enter?",
    options: ["Testing Gate (Gates of Trial)", "Door of Judgment", "Hell's Gate", "Dragon Threshold"],
    correctAnswer: 0,
    explanation: "The Testing Gate ranges from 4 tons (Door 1) up to 256 tons (Door 7).",
    difficulty: "easy"
  },
  {
    questionId: "hxh-025",
    question: "Who are the legendary father and grandfather duo of the Zoldyck assassin household?",
    options: ["Silva and Zeno Zoldyck", "Illumi and Milluki", "Kalluto and Maha", "Ging and Gon"],
    correctAnswer: 0,
    explanation: "Zeno and Silva Zoldyck are the lethal elder heads of the family.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-026",
    question: "What is Zeno Zoldyck's Dragon Dive ability?",
    options: ["Raining thousands of piercing dragon aura arrows from the sky", "Summoning a fire dragon", "Turning into a dragon", "Breathing lightning"],
    correctAnswer: 0,
    explanation: "Dragon Dive shatters a massive Nen dragon into countless homing spears that bombard the palace.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-027",
    question: "Who is the head butler of the Zoldyck estate who played deadly coin toss games with Gon?",
    options: ["Gotoh", "Canary", "Tsubone", "Amane"],
    correctAnswer: 0,
    explanation: "Gotoh was fiercely protective of Killua before being ambushed and killed by Hisoka.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-028",
    question: "What needle did Illumi plant in Killua's brain to manipulate him?",
    options: ["A needle forcing him to flee from opponents with equal or greater strength", "A poison needle", "A tracking needle", "A truth needle"],
    correctAnswer: 0,
    explanation: "Killua extracted the needle during his fight against Rammot, overcoming his programmed cowardice.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-029",
    question: "What board game do Meruem and Komugi play continuously in the East Gorteau palace?",
    options: ["Gungi", "Shogi", "Go", "Chess"],
    correctAnswer: 0,
    explanation: "Gungi is a fictional multi-tiered strategic board game that Meruem could never beat Komugi at.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-030",
    question: "What was Kurapika's condition and vow that made Chain Jail unbreakable against the Phantom Troupe?",
    options: ["If he uses Chain Jail on anyone who is NOT a member of the Phantom Troupe, he will instantly die", "He loses his eyesight", "He cannot eat meat", "He must stay in Yorknew"],
    correctAnswer: 0,
    explanation: "A Judgment Chain wrapped around Kurapika's heart enforces death if he breaks his pledge.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-031",
    question: "What is the four-level progression of basic Nen training?",
    options: ["Ten (Shroud), Zetsu (Suppress), Ren (Enhance), Hatsu (Release)", "In, Gyo, Ko, Ryu", "Ken, Shu, En, Ryu", "Baji, Ren, Chi, Qi"],
    correctAnswer: 0,
    explanation: "Ten, Zetsu, Ren, and Hatsu form the foundational four principles of Nen.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-032",
    question: "What advanced Nen technique extends one's aura into an omnidirectional sensory sphere?",
    options: ["En", "In", "Ko", "Gyo"],
    correctAnswer: 0,
    explanation: "En allows Nen users to sense the shape and movement of everything inside their aura perimeter.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-033",
    question: "What is the name of Kite's weapon roulette ability that manifests a talking clown?",
    options: ["Crazy Slots", "Roulette Blade", "Jackpot Weapon", "Joker's Hand"],
    correctAnswer: 0,
    explanation: "Crazy Slots rolls numbers 1 through 9, conjuring weapons that Kite cannot choose and must use before rolling again.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-034",
    question: "What insect Chimera Ant ant-humanoid form was Kite reborn into after Pitou murdered him?",
    options: ["A red-haired girl with a mouse-like tail", "A soldier ant", "A butterfly", "A dog ant"],
    correctAnswer: 0,
    explanation: "Kite's soul was reborn as the red-haired sister of Meruem raised by Colt.",
    difficulty: "hard"
  },
  {
    questionId: "hxh-035",
    question: "Who is the suction-tube and smoke master Hunter who fought alongside Knuckle and Morel?",
    options: ["Morel Mackernasey", "Knov", "Shoot McMahon", "Knuckle Bine"],
    correctAnswer: 0,
    explanation: "Morel uses a giant smoking pipe to create smoke soldiers (Deep Purple).",
    difficulty: "medium"
  },
  {
    questionId: "hxh-036",
    question: "What happens to the timid Hunter Knov when he sneaks into the palace and feels Pouf and Pitou's terrifying aura?",
    options: ["His hair turns completely white from pure psychological terror", "He goes blind", "He dies of a heart attack", "He loses his Nen"],
    correctAnswer: 0,
    explanation: "The sheer malevolence of the royal guards' En broke Knov's spirit, turning his hair snow white.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-037",
    question: "What is Knuckle Bine's Hakoware ability that lends aura with compounding interest?",
    options: ["A.P.R. (Amortizing Power Redirector) / Toritaten", "Bank Loan", "Debt Collector", "Tax Man"],
    correctAnswer: 0,
    explanation: "A.P.R. floats beside the enemy adding 10% interest every 10 seconds until bankruptcy triggers Zetsu.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-038",
    question: "Who is Gon's third companion in the Hunter Exam who dreams of becoming a doctor?",
    options: ["Leorio Paradinight", "Tonpa", "Hanzo", "Pokkle"],
    correctAnswer: 0,
    explanation: "Leorio desires money exclusively to fund medical school and treat poor patients for free.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-039",
    question: "Who is the infamous 'Rookie Crusher' who fails the Hunter Exam dozens of times on purpose to torment novices?",
    options: ["Tonpa", "Bodoro", "Geretta", "Amori"],
    correctAnswer: 0,
    explanation: "Tonpa hands out laxative-laced juice cans to sabotage rookies.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-040",
    question: "What is the name of the uncharted, perilous land outside the known human world where Chimera Ants originated?",
    options: ["The Dark Continent", "The Outer Sea", "The Abyss", "The Wild Expanse"],
    correctAnswer: 0,
    explanation: "The Dark Continent is a gargantuan primordial wilderness harboring the Five Great Calamities.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-041",
    question: "Who is the rat Zodiac in the Hunter Association who manipulates the Chairman election and loves chaos?",
    options: ["Pariston Hill", "Ging Freecss", "Mizaistom Nana", "Botobai Gigante"],
    correctAnswer: 0,
    explanation: "Vice-Chairman Pariston Hill smiles deceitfully while orchestrating high-stakes political intrigue.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-042",
    question: "Where did Gon Freecss finally meet and talk with his father Ging at the end of the anime?",
    options: ["At the top of the World Tree", "At Whale Island", "At the Hunter Association HQ", "On a blimp"],
    correctAnswer: 0,
    explanation: "Gon and Ging climbed the World Tree to sit atop its branches and discuss the wonder of the journey.",
    difficulty: "easy"
  },
  {
    questionId: "hxh-043",
    question: "What happens to Gon's ability to use Nen after being healed by Nanika?",
    options: ["He can no longer see or use his aura, returning to a normal boy", "His aura doubled", "He gained Specialization", "His Nen changed element"],
    correctAnswer: 0,
    explanation: "Ging explained that Gon simply reset to normal, having spent his Nen in his fight with Pitou.",
    difficulty: "hard"
  },
  {
    questionId: "hxh-044",
    question: "Who killed Hisoka in their death match at Heavens Arena before Hisoka restarted his own heart with Nen?",
    options: ["Chrollo Lucilfer", "Illumi Zoldyck", "Machi", "Kurapika"],
    correctAnswer: 0,
    explanation: "Chrollo used a combination of stolen abilities to explode Hisoka, who resurrected via Bungee Gum contract.",
    difficulty: "hard"
  },
  {
    questionId: "hxh-045",
    question: "Which two Phantom Troupe members did Hisoka immediately murder after reviving?",
    options: ["Kortopi and Shalnark", "Feitan and Phinks", "Nobunaga and Machi", "Franklin and Bonolenov"],
    correctAnswer: 0,
    explanation: "Hisoka ambushed Kortopi in a restroom and slaughtered Shalnark in a park.",
    difficulty: "hard"
  },
  {
    questionId: "hxh-046",
    question: "What is the massive black ark carrying princes, mafia families, and hunters to the Dark Continent?",
    options: ["Black Whale No. 1", "The Leviathan", "Titanic II", "Behemoth"],
    correctAnswer: 0,
    explanation: "The Black Whale 1 is the colossal multi-tiered ship hosting the Kakin Succession Contest.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-047",
    question: "What is the name of the eccentric 4th Prince of Kakin who collects body parts and masters Nen in days?",
    options: ["Tserriednich Hui Guo Rou", "Benjamin", "Camilla", "Halkenburg"],
    correctAnswer: 0,
    explanation: "Terror prince Tserriednich possesses terrifying Nen talent and owns a pair of Kurta scarlet eyes.",
    difficulty: "hard"
  },
  {
    questionId: "hxh-048",
    question: "What was the name of the blind chimera ant who played violin and created microscopic clones of himself?",
    options: ["Shaiapouf (Pouf)", "Menthuthuyoupi", "Ikalgo", "Meleoron"],
    correctAnswer: 0,
    explanation: "Shaiapouf was the dramatic royal guard whose scales induced hypnosis.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-049",
    question: "Which chameleon Chimera Ant allied with the Hunters using his breath-holding invisibility 'God's Accomplice'?",
    options: ["Meleoron", "Ikalgo", "Welfin", "Cheetu"],
    correctAnswer: 0,
    explanation: "Meleoron can make himself and anyone he touches completely undetectable as long as he holds his breath.",
    difficulty: "medium"
  },
  {
    questionId: "hxh-050",
    question: "How did Meruem and Komugi spend their final moments before succumbing to the Rose poison?",
    options: ["Holding hands in the dark playing one last game of Gungi", "Fighting hunters", "Traveling to the ocean", "Sleeping under a tree"],
    correctAnswer: 0,
    explanation: "Meruem asked Komugi to stay by his side, calling each other's names in the dark until they died peacefully.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'bleach.json'),
  JSON.stringify(bleachQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated bleach.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'hunter-x-hunter.json'),
  JSON.stringify(hxhQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated hunter-x-hunter.json (50 questions)');
