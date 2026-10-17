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

// 2. Attack on Titan (50 questions)
const aotQuestions: Question[] = [
  {
    questionId: "aot-001",
    question: "What is the name of the outermost wall protecting humanity in Attack on Titan?",
    options: ["Wall Rose", "Wall Maria", "Wall Sina", "Wall Jaeger"],
    correctAnswer: 1,
    explanation: "Wall Maria is the outermost perimeter wall breached in the series premiere by the Colossal Titan.",
    difficulty: "easy"
  },
  {
    questionId: "aot-002",
    question: "Who is the main protagonist who vows to eradicate every Titan?",
    options: ["Armin Arlert", "Levi Ackerman", "Eren Jaeger", "Jean Kirstein"],
    correctAnswer: 2,
    explanation: "Eren Jaeger witnesses his mother's death and pledges to wipe out all Titans.",
    difficulty: "easy"
  },
  {
    questionId: "aot-003",
    question: "Which Titan power does Eren initially inherit from his father Grisha?",
    options: ["Armored Titan", "Attack Titan & Founding Titan", "Beast Titan", "Colossal Titan"],
    correctAnswer: 1,
    explanation: "Eren holds both the Attack Titan and the Founding Titan passed down by Grisha Jaeger.",
    difficulty: "medium"
  },
  {
    questionId: "aot-004",
    question: "Who is known as 'Humanity's Strongest Soldier' and captain of the Special Operations Squad?",
    options: ["Erwin Smith", "Levi Ackerman", "Hange Zoe", "Mike Zacharias"],
    correctAnswer: 1,
    explanation: "Captain Levi Ackerman possesses unmatched ODM combat skills against Titans.",
    difficulty: "easy"
  },
  {
    questionId: "aot-005",
    question: "What is the weak point of a standard Titan that must be slashed to kill it?",
    options: ["The nape of the neck (1 meter high, 10 cm wide)", "The heart", "The forehead", "The Achilles tendon"],
    correctAnswer: 0,
    explanation: "Slashing the nape destroys the base of the central nervous system where the human spinal connection resides.",
    difficulty: "easy"
  },
  {
    questionId: "aot-006",
    question: "Who was revealed to be the Female Titan during the Expedition outside Wall Rose?",
    options: ["Sasha Braus", "Historia Reiss", "Annie Leonhart", "Ymir"],
    correctAnswer: 2,
    explanation: "Annie Leonhart of the Military Police was revealed as the martial arts-proficient Female Titan.",
    difficulty: "easy"
  },
  {
    questionId: "aot-007",
    question: "Which characters are revealed in the dramatic Season 2 betrayal to be the Armored and Colossal Titans?",
    options: ["Jean and Connie", "Reiner Braun and Bertholdt Hoover", "Marco and Floch", "Zeke and Porco"],
    correctAnswer: 1,
    explanation: "Reiner shockingly confesses to Eren atop Wall Rose that he is the Armored Titan and Bertholdt is the Colossal Titan.",
    difficulty: "easy"
  },
  {
    questionId: "aot-008",
    question: "What is the gear used by scouts to maneuver three-dimensionally using gas and grappling hooks called?",
    options: ["Omni-Directional Mobility (ODM) Gear", "Acrobatic Wire System", "Vertical Grapple Pack", "Surveyor Flight Harness"],
    correctAnswer: 0,
    explanation: "ODM (Omni-Directional Mobility) Gear allows soldiers to navigate urban and forest battlefields against Titans.",
    difficulty: "easy"
  },
  {
    questionId: "aot-009",
    question: "Who was the charismatic 13th Commander of the Survey Corps who led the heroic charge in Shiganshina?",
    options: ["Dot Pyxis", "Erwin Smith", "Keith Shadis", "Nile Dawk"],
    correctAnswer: 1,
    explanation: "Commander Erwin Smith sacrificed himself leading a desperate cavalry charge against the Beast Titan.",
    difficulty: "easy"
  },
  {
    questionId: "aot-010",
    question: "What food did Sasha Braus famously steal and eat during military initiation?",
    options: ["A steamed potato", "A loaf of bread", "A leg of ham", "An apple"],
    correctAnswer: 0,
    explanation: "Sasha earned the beloved moniker 'Potato Girl' for casually munching a hot potato during roll call.",
    difficulty: "easy"
  },
  {
    questionId: "aot-011",
    question: "What is the true identity and royal lineage of Krista Lenz?",
    options: ["Dina Fritz", "Historia Reiss", "Frieda Reiss", "Ymir Fritz"],
    correctAnswer: 1,
    explanation: "Krista Lenz was the pseudonym of Historia Reiss, the rightful heir to the throne of Eldia.",
    difficulty: "medium"
  },
  {
    questionId: "aot-012",
    question: "Who is Eren's half-brother who inherits the Beast Titan and aims for the Euthanasia Plan?",
    options: ["Zeke Jaeger", "Willy Tybur", "Colt Grice", "Theo Magath"],
    correctAnswer: 0,
    explanation: "Zeke Jaeger, son of Grisha and royal Dina Fritz, wields the Beast Titan.",
    difficulty: "easy"
  },
  {
    questionId: "aot-013",
    question: "What island is the setting where Eren and the walled inhabitants reside?",
    options: ["Marley Island", "Paradis Island", "Hizuru", "Odiha"],
    correctAnswer: 1,
    explanation: "King Fritz relocated his Eldian subjects to Paradis Island behind the three colossal walls.",
    difficulty: "easy"
  },
  {
    questionId: "aot-014",
    question: "Who inherits the Colossal Titan after Bertholdt's defeat in Shiganshina?",
    options: ["Erwin Smith", "Armin Arlert", "Jean Kirstein", "Connie Springer"],
    correctAnswer: 1,
    explanation: "Levi chooses to administer the Titan injection to Armin rather than Commander Erwin.",
    difficulty: "easy"
  },
  {
    questionId: "aot-015",
    question: "What special heirloom does Mikasa cherish that Eren gave her as a child?",
    options: ["A silver locket", "A red scarf", "A hunting knife", "A leather bracelet"],
    correctAnswer: 1,
    explanation: "Eren wrapped his red scarf around Mikasa to comfort her after rescuing her from kidnappers.",
    difficulty: "easy"
  },
  {
    questionId: "aot-016",
    question: "What is the name of the global cataclysmic march of millions of Wall Colossal Titans?",
    options: ["The Great Titan War", "The Rumbling", "The Earth Flattening", "The Scourge of Ymir"],
    correctAnswer: 1,
    explanation: "The Rumbling is unleashed by Eren using the Founding Titan to trample the world beyond Paradis.",
    difficulty: "easy"
  },
  {
    questionId: "aot-017",
    question: "Who was the first person to obtain the power of the Titans 2,000 years ago?",
    options: ["Ymir Fritz", "Maria Fritz", "Rose Fritz", "Sina Fritz"],
    correctAnswer: 0,
    explanation: "A slave girl named Ymir came into contact with the anomaly beneath a sacred tree and became the Founding Titan.",
    difficulty: "medium"
  },
  {
    questionId: "aot-018",
    question: "What is the titan-shifter lifespan limitation known as?",
    options: ["The Curse of Ymir (13 years)", "The Eldian Clock", "The Blood Tax", "The 10-Year Mark"],
    correctAnswer: 0,
    explanation: "Titan shifters die exactly 13 years after acquiring their power, matching Ymir's lifespan after gaining the Titan.",
    difficulty: "medium"
  },
  {
    questionId: "aot-019",
    question: "Which Nine Titan possesses the ability to harden into indestructible war hammers and construct weapons from the ground?",
    options: ["Cart Titan", "War Hammer Titan", "Jaw Titan", "Armored Titan"],
    correctAnswer: 1,
    explanation: "The War Hammer Titan, held by the Tybur family, can manifest structures and weapons from hardened crystal.",
    difficulty: "medium"
  },
  {
    questionId: "aot-020",
    question: "Who holds the Cart Titan known for high endurance and carrying heavy mounted artillery?",
    options: ["Pieck Finger", "Gabi Braun", "Yelena", "Annie Leonhart"],
    correctAnswer: 0,
    explanation: "Pieck Finger possesses the versatile quadruped Cart Titan capable of remaining transformed for months.",
    difficulty: "medium"
  },
  {
    questionId: "aot-021",
    question: "Who kills Sasha Braus aboard the Survey Corps airship after the Liberio raid?",
    options: ["Falco Grice", "Gabi Braun", "Porco Galliard", "Reiner Braun"],
    correctAnswer: 1,
    explanation: "The young Marleyan cadet Gabi infiltrates the airship with a rifle and shoots Sasha.",
    difficulty: "medium"
  },
  {
    questionId: "aot-022",
    question: "What key mystery in Eren's home basement reveals the truth about the outside world?",
    options: ["A magic spellbook", "A photograph and Grisha's journals", "A radio transmitter", "A stash of Titan serum"],
    correctAnswer: 1,
    explanation: "Eren and the scouts discover a photograph proving an advanced human civilization thrives outside the walls.",
    difficulty: "easy"
  },
  {
    questionId: "aot-023",
    question: "What is the elite military branch that ventures outside the walls to reclaim human territory?",
    options: ["Garrison Regiment", "Military Police", "Survey Corps (Scouts)", "Royal Guard"],
    correctAnswer: 2,
    explanation: "The Survey Corps (Wings of Freedom) conducts expeditions beyond the walls to combat Titans and gather intelligence.",
    difficulty: "easy"
  },
  {
    questionId: "aot-024",
    question: "What is the unique ability of the Attack Titan that sets it apart from all other Nine Titans?",
    options: ["Flight", "Seeing memories of its future inheritors", "Unlimited steam expulsion", "Underwater swimming"],
    correctAnswer: 1,
    explanation: "The Attack Titan can perceive memories of both past and future inheritors, striving perpetually for freedom.",
    difficulty: "hard"
  },
  {
    questionId: "aot-025",
    question: "What bloodline are Mikasa and Levi part of that makes them immune to the Founding Titan's memory alteration?",
    options: ["Tybur Clan", "Ackerman Clan", "Fritz Line", "Jaeger Family"],
    correctAnswer: 1,
    explanation: "The Ackermans are products of titan science whose memories cannot be wiped by the Founding Titan.",
    difficulty: "medium"
  },
  {
    questionId: "aot-026",
    question: "Who sacrificed himself by being devoured by Falco to transfer the Jaw Titan?",
    options: ["Marcel Galliard", "Porco Galliard", "Colt Grice", "Tom Ksaver"],
    correctAnswer: 1,
    explanation: "Porco Galliard sacrificed himself in Shiganshina so Falco Grice could live as the Jaw Titan.",
    difficulty: "hard"
  },
  {
    questionId: "aot-027",
    question: "What special beast characteristics did Falco's Jaw Titan manifest in the final battle?",
    options: ["Avian wings and talons capable of flight", "Scorpion stingers", "Gills for oceanic travel", "Lion's roar"],
    correctAnswer: 0,
    explanation: "Because Falco was turned into a pure titan by Zeke's Beast spinal fluid, his Jaw Titan manifested bird wings allowing flight.",
    difficulty: "hard"
  },
  {
    questionId: "aot-028",
    question: "What was the motto and hand salute of the Eldian military?",
    options: ["Dedicate your hearts! (Shinzou wo Sasageyo!)", "Victory or Death!", "For the Walls!", "Honor and Blood!"],
    correctAnswer: 0,
    explanation: "'Shinzou wo Sasageyo!' (Dedicate your heart!) accompanied by a clenched right fist over the left chest.",
    difficulty: "easy"
  },
  {
    questionId: "aot-029",
    question: "Who was the quirky eccentric Survey Corps section commander obsessed with capturing and studying Titans?",
    options: ["Hange Zoe", "Mike Zacharias", "Petra Ral", "Moblit Berner"],
    correctAnswer: 0,
    explanation: "Hange Zoe conducted bizarre and insightful research on captured Titans like Sawney and Bean.",
    difficulty: "easy"
  },
  {
    questionId: "aot-030",
    question: "How did Hange Zoe heroically perish during the Rumbling?",
    options: ["Shot by Floch", "Crushed by rocks", "Burned by the scorching steam of Colossal Titans while buying time for the flying boat", "Eaten by pure Titans"],
    correctAnswer: 2,
    explanation: "Hange sacrificed themselves taking down several Colossal Titans amidst blistering heat in Odiha.",
    difficulty: "medium"
  },
  {
    questionId: "aot-031",
    question: "What is the true origin of pure Titans outside the walls?",
    options: ["They grew from plant spores", "Eldian dissidents injected with Titan spinal fluid by Marley", "Alien organisms", "Demonic curses"],
    correctAnswer: 1,
    explanation: "Marley turned Eldian restorationists and prisoners into mindless Titans and exiled them to roam Paradis.",
    difficulty: "medium"
  },
  {
    questionId: "aot-032",
    question: "Who was Grisha Jaeger's first wife in Marley who became the Smiling Titan that killed Carla Jaeger?",
    options: ["Dina Fritz", "Carla", "Faye Jaeger", "Yelena"],
    correctAnswer: 0,
    explanation: "Dina Fritz, of royal blood, was turned into the Smiling Titan and later devoured Carla.",
    difficulty: "hard"
  },
  {
    questionId: "aot-033",
    question: "What condition must be met for Eren to unlock and command the Founding Titan's power?",
    options: ["Shedding tears", "Physical contact with a Titan of royal blood", "Roaring in unison", "Swallowing a golden seed"],
    correctAnswer: 1,
    explanation: "Eren needed contact with a royal titan (like the Smiling Titan or Zeke) to access the coordinate Paths.",
    difficulty: "medium"
  },
  {
    questionId: "aot-034",
    question: "What is the mystical transcendent realm connecting all Eldians through invisible paths?",
    options: ["The Astral Plane", "The Paths", "The Void", "The Net"],
    correctAnswer: 1,
    explanation: "The coordinate Paths connect every Subject of Ymir across time and space to the Founding Titan.",
    difficulty: "medium"
  },
  {
    questionId: "aot-035",
    question: "What did Eren use as a makeshift nutcracker to break through the crystal cocoon of the War Hammer Titan?",
    options: ["The Jaw Titan's hardened jaws", "Thunder spears", "A colossal anvil", "His bare fists"],
    correctAnswer: 0,
    explanation: "Eren forced the captured Jaw Titan's teeth onto the crystal to crush Lara Tybur and drink her spinal fluid.",
    difficulty: "medium"
  },
  {
    questionId: "aot-036",
    question: "What explosive scout weapon was developed specifically to pierce the Armored Titan's thick plating?",
    options: ["Thunder Spears", "Fire Grenades", "Napalm Cannons", "Dynamite Arrows"],
    correctAnswer: 0,
    explanation: "Thunder Spears are rocket-propelled dual-staged explosive darts launched from soldiers' arms.",
    difficulty: "easy"
  },
  {
    questionId: "aot-037",
    question: "Who was the previous owner of the Attack Titan before Grisha Jaeger?",
    options: ["Eren Kruger ('The Owl')", "Tom Ksaver", "Willy Tybur", "Uri Reiss"],
    correctAnswer: 0,
    explanation: "Eren Kruger was an undercover Eldian operative within the Marley Public Security authorities.",
    difficulty: "hard"
  },
  {
    questionId: "aot-038",
    question: "What was the name of Armin Arlert's grandfather's forbidden book that inspired Armin and Eren's dream?",
    options: ["A book depicting the outside world (oceans, fiery water, lands of ice)", "The History of Eldia", "The Marley Manifesto", "A diary of Titans"],
    correctAnswer: 0,
    explanation: "The book showed the ocean and exotic wonders beyond the walls, igniting Eren and Armin's longing for freedom.",
    difficulty: "easy"
  },
  {
    questionId: "aot-039",
    question: "What radical extremist faction on Paradis seized control under the belief that Eren was their savior?",
    options: ["The Jaegerists", "The Wall Cult", "The Royalists", "The Restorationists"],
    correctAnswer: 0,
    explanation: "The Jaegerists, spearheaded by Floch Forster, believed Eren was the only hope for Paradis' survival.",
    difficulty: "easy"
  },
  {
    questionId: "aot-040",
    question: "Who delivers the fateful final strike that ends Eren Jaeger's life inside the colossal founding mouth?",
    options: ["Mikasa Ackerman", "Levi Ackerman", "Armin Arlert", "Reiner Braun"],
    correctAnswer: 0,
    explanation: "Mikasa enters the mouth and decapitates Eren, kissing him goodbye as Ymir's curse is finally undone.",
    difficulty: "medium"
  },
  {
    questionId: "aot-041",
    question: "What percentage of humanity outside the walls did Eren's Rumbling eradicate?",
    options: ["50%", "80%", "95%", "100%"],
    correctAnswer: 1,
    explanation: "Eren wiped out approximately 80% of global humanity to level the playing field for Paradis.",
    difficulty: "medium"
  },
  {
    questionId: "aot-042",
    question: "What beverage did Zeke Jaeger lace with his spinal fluid to transform the military high command into pure titans?",
    options: ["Marleyan Red Wine", "Black Tea", "Spring Water", "Whiskey"],
    correctAnswer: 0,
    explanation: "Zeke secretly contaminated the military officers' favorite imported Marleyan red wine.",
    difficulty: "medium"
  },
  {
    questionId: "aot-043",
    question: "What happened to Levi's right hand and eye during the explosion caused by Zeke's thunder spear?",
    options: ["He lost two fingers and received severe facial scars", "He lost his arm completely", "He was paralyzed", "He emerged unharmed"],
    correctAnswer: 0,
    explanation: "The blast took two of Levi's fingers and severely damaged his right eye and face.",
    difficulty: "hard"
  },
  {
    questionId: "aot-044",
    question: "What animal does Armin compare Eren to when a white bird tugs Mikasa's scarf by the tree?",
    options: ["A bird flying freely in the sky", "A wolf", "A deer", "An eagle"],
    correctAnswer: 0,
    explanation: "A bird adjusts Mikasa's scarf beside Eren's burial tree, symbolizing Eren's eternal freedom.",
    difficulty: "easy"
  },
  {
    questionId: "aot-045",
    question: "Which of the original 104th Training Corps graduated as rank 1 in their class?",
    options: ["Mikasa Ackerman", "Reiner Braun", "Bertholdt Hoover", "Annie Leonhart"],
    correctAnswer: 0,
    explanation: "Mikasa graduated at the very top (Rank 1) of the 104th Southern Division cadet class.",
    difficulty: "easy"
  },
  {
    questionId: "aot-046",
    question: "What was the name of the cheerful cadet who was mysteriously found dead bitten in half during the Trost defense?",
    options: ["Marco Bott", "Thomas Wagner", "Mina Carolina", "Daz"],
    correctAnswer: 0,
    explanation: "Marco Bott overheard Reiner and Bertholdt's secret conversation and was left to be devoured by a Titan.",
    difficulty: "medium"
  },
  {
    questionId: "aot-047",
    question: "What is inside the walls holding them upright and solid?",
    options: ["Millions of dormant Colossal Titans", "Solid obsidian stone", "Titan bones and steel", "Magnetic crystals"],
    correctAnswer: 0,
    explanation: "King Karl Fritz used millions of hardened Colossal Titans linked shoulder-to-shoulder to erect the walls.",
    difficulty: "easy"
  },
  {
    questionId: "aot-048",
    question: "Who was the priest who knew the truth of the Titans inside the wall but chose death over speaking?",
    options: ["Pastor Nick", "Father Thomas", "Bishop Uri", "Deacon Nile"],
    correctAnswer: 0,
    explanation: "Pastor Nick of the Wall Cult stayed loyal to his oath and was tortured to death by the Military Police.",
    difficulty: "hard"
  },
  {
    questionId: "aot-049",
    question: "What did Eren tell Mikasa in the final confrontation that made him look like he hated her?",
    options: ["That she was merely a slave following Ackerman bonding instincts", "That she was ugly", "That she betrayed humanity", "That she was weak"],
    correctAnswer: 0,
    explanation: "Eren fabricated the lie that Ackermans are mindless bodyguards with awakened host instincts to push her away.",
    difficulty: "medium"
  },
  {
    questionId: "aot-050",
    question: "What happens to all Titans and the power of the Titans after Eren's death?",
    options: ["The power of the Titans vanishes forever and Titans revert to humans", "Titan powers move to newborn babies", "The world is consumed", "Titans become robots"],
    correctAnswer: 0,
    explanation: "Ymir was freed from her centuries of lingering devotion, completely erasing the Titan curse from existence.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'attack-on-titan.json'),
  JSON.stringify(aotQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated attack-on-titan.json (50 questions)');
