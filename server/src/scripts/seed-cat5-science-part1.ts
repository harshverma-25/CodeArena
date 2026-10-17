import 'dotenv/config';
import mongoose from 'mongoose';
import { seedSubjectQuestions } from './seed-helper.js';

// 1. Human Body (50 Questions)
const HUMAN_BODY_QUESTIONS = [
  {
    questionId: "body-001",
    question: "What is the largest organ of the human body?",
    options: ["Liver", "Brain", "Skin", "Lungs"],
    correctAnswer: 2,
    explanation: "The skin is the body's largest organ, covering an average surface area of about 2 square meters in adults.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-002",
    question: "How many bones are there in the adult human skeleton?",
    options: ["186", "206", "216", "300"],
    correctAnswer: 1,
    explanation: "An adult human has 206 bones, while infants are born with around 270 to 300 bones that fuse together over time.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-003",
    question: "What is the largest and strongest bone in the human body?",
    options: ["Tibia", "Femur (thighbone)", "Humerus", "Pelvis"],
    correctAnswer: 1,
    explanation: "The femur, or thighbone, is the longest, heaviest, and strongest bone in the human body.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-004",
    question: "What is the smallest bone in the human body?",
    options: ["Stapes (stirrup)", "Malleus", "Incus", "Phalanx"],
    correctAnswer: 0,
    explanation: "The stapes, located in the middle ear, is about 3 mm long and is the smallest bone in the human body.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-005",
    question: "How many chambers are there in the human heart?",
    options: ["2", "3", "4", "6"],
    correctAnswer: 2,
    explanation: "The human heart has 4 chambers: two upper atria (left and right) and two lower ventricles (left and right).",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-006",
    question: "What protein in red blood cells is responsible for carrying oxygen throughout the body?",
    options: ["Insulin", "Hemoglobin", "Keratin", "Myoglobin"],
    correctAnswer: 1,
    explanation: "Hemoglobin is an iron-rich protein in red blood cells that binds oxygen in the lungs and delivers it to tissues.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-007",
    question: "Which blood type is known as the 'universal donor' for red blood cell transfusions?",
    options: ["A positive", "AB positive", "O negative", "B negative"],
    correctAnswer: 2,
    explanation: "O negative red blood cells lack A, B, and Rh antigens, making them safely transfusable to almost any recipient.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-008",
    question: "Which blood type is known as the 'universal recipient' for receiving red blood cells?",
    options: ["O positive", "AB positive", "A negative", "B positive"],
    correctAnswer: 1,
    explanation: "People with AB positive blood have A, B, and Rh antigens, meaning their immune system does not form antibodies against any of them.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-009",
    question: "What is the normal resting body temperature in healthy humans in Celsius?",
    options: ["35°C", "37°C", "39°C", "40°C"],
    correctAnswer: 1,
    explanation: "Normal human body temperature is approximately 37°C (98.6°F).",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-010",
    question: "Which organ in the human body produces insulin to regulate blood sugar levels?",
    options: ["Liver", "Pancreas", "Gallbladder", "Spleen"],
    correctAnswer: 1,
    explanation: "The beta cells of the islets of Langerhans in the pancreas produce insulin.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-011",
    question: "What is the hardest substance in the human body?",
    options: ["Bone", "Tooth enamel", "Cartilage", "Finger nails"],
    correctAnswer: 1,
    explanation: "Tooth enamel is 96% mineral (hydroxyapatite), making it the hardest substance in the human body.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-012",
    question: "What is the structural and functional unit of the human kidney that filters blood?",
    options: ["Neuron", "Nephron", "Alveolus", "Hepatocyte"],
    correctAnswer: 1,
    explanation: "Each kidney contains about one million microscopic filtering units called nephrons.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-013",
    question: "What is the basic functional cell of the human nervous system called?",
    options: ["Nephron", "Neuron (nerve cell)", "Glial cell", "Osteocyte"],
    correctAnswer: 1,
    explanation: "Neurons are specialized cells that transmit electrical and chemical signals throughout the nervous system.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-014",
    question: "Which part of the brain controls balance, posture, and muscle coordination?",
    options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Hypothalamus"],
    correctAnswer: 1,
    explanation: "The cerebellum, located at the back of the brain beneath the cerebrum, regulates motor control and balance.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-015",
    question: "Which gland in the human body is referred to as the 'Master Gland'?",
    options: ["Thyroid gland", "Pituitary gland", "Adrenal gland", "Pineal gland"],
    correctAnswer: 1,
    explanation: "The pituitary gland controls the secretions of many other endocrine glands throughout the body.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-016",
    question: "What tiny air sacs in the lungs are responsible for gas exchange between oxygen and carbon dioxide?",
    options: ["Bronchioles", "Alveoli", "Cilia", "Trachea"],
    correctAnswer: 1,
    explanation: "Alveoli are microscopic balloon-shaped air sacs where oxygen diffuses into the bloodstream and CO2 diffuses out.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-017",
    question: "What percentage of the adult human body is approximately composed of water?",
    options: ["30%", "60%", "85%", "95%"],
    correctAnswer: 1,
    explanation: "Water makes up approximately 60% of an adult human's total body weight.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-018",
    question: "What pigment gives human skin, hair, and eyes their natural color?",
    options: ["Melatonin", "Melanin", "Keratin", "Carotene"],
    correctAnswer: 1,
    explanation: "Melanin, produced by melanocytes, determines pigmentation and protects cells against UV radiation damage.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-019",
    question: "What muscular dome-shaped organ separates the chest cavity from the abdomen and enables breathing?",
    options: ["Diaphragm", "Intercostal muscle", "Esophagus", "Peritoneum"],
    correctAnswer: 0,
    explanation: "When the diaphragm contracts and moves downwards, it creates negative pressure that draws air into the lungs.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-020",
    question: "How many ribs does a typical human body have (in 12 pairs)?",
    options: ["20", "22", "24", "26"],
    correctAnswer: 2,
    explanation: "Humans typically have 24 ribs arranged in 12 pairs attached to the thoracic vertebrae.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-021",
    question: "What is the primary function of white blood cells (leukocytes)?",
    options: ["Carry oxygen", "Fight infections and diseases", "Clot blood", "Regulate body temperature"],
    correctAnswer: 1,
    explanation: "White blood cells are an essential part of the immune system that defend against bacteria, viruses, and pathogens.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-022",
    question: "What component of blood is primarily responsible for blood clotting to stop bleeding?",
    options: ["Platelets (thrombocytes)", "Red blood cells", "Plasma", "White blood cells"],
    correctAnswer: 0,
    explanation: "Platelets adhere to broken blood vessel walls and initiate fibrin clot formation.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-023",
    question: "Which organ produces bile to assist in digesting fats?",
    options: ["Gallbladder", "Liver", "Stomach", "Pancreas"],
    correctAnswer: 1,
    explanation: "The liver produces bile continuously, which is stored and concentrated in the gallbladder until needed.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-024",
    question: "What is the longest part of the human gastrointestinal tract where most nutrient absorption occurs?",
    options: ["Stomach", "Small intestine", "Large intestine (colon)", "Esophagus"],
    correctAnswer: 1,
    explanation: "The small intestine measures about 6 meters (20 feet) in length and absorbs the vast majority of nutrients.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-025",
    question: "Which acid is naturally present in the human stomach to digest food and kill bacteria?",
    options: ["Sulfuric acid", "Hydrochloric acid (HCl)", "Nitric acid", "Acetic acid"],
    correctAnswer: 1,
    explanation: "Gastric juice contains hydrochloric acid at a pH of around 1.5 to 3.5 to break down proteins and kill microorganisms.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-026",
    question: "What tough fibrous tissue connects muscles to bones?",
    options: ["Ligament", "Tendon", "Cartilage", "Fascia"],
    correctAnswer: 1,
    explanation: "Tendons connect muscles to bones (e.g., Achilles tendon), while ligaments connect bone to bone.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-027",
    question: "What tissue connects one bone to another bone at a skeletal joint?",
    options: ["Tendon", "Ligament", "Myofibril", "Epithelium"],
    correctAnswer: 1,
    explanation: "Ligaments are tough, elastic bands of connective tissue that stabilize joints by holding bones together.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-028",
    question: "Which part of the human eye contains light-sensitive photoreceptor cells (rods and cones)?",
    options: ["Cornea", "Retina", "Iris", "Lens"],
    correctAnswer: 1,
    explanation: "The retina is the inner light-sensitive layer that converts focused images into neural signals sent to the brain.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-029",
    question: "Which sensory receptor cells in the retina are primarily responsible for color vision?",
    options: ["Rods", "Cones", "Cilia", "Ganglion cells"],
    correctAnswer: 1,
    explanation: "Cones detect color and high-detail vision in bright light, whereas rods are responsible for night and peripheral vision.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-030",
    question: "What is the colored, circular part of the eye that controls the amount of light entering the pupil?",
    options: ["Cornea", "Iris", "Sclera", "Pupil"],
    correctAnswer: 1,
    explanation: "The iris contains muscles that constrict or dilate the pupil to control light entry, giving eyes their color.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-031",
    question: "How many vertebrae comprise the adult human spinal column (including sacrum and coccyx)?",
    options: ["26", "33", "20", "28"],
    correctAnswer: 0,
    explanation: "The adult spine has 26 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 1 sacrum (fused), and 1 coccyx (fused).",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-032",
    question: "What is the normal adult resting pulse rate in beats per minute?",
    options: ["30–50 bpm", "60–100 bpm", "110–140 bpm", "150–180 bpm"],
    correctAnswer: 1,
    explanation: "A typical healthy adult resting heart rate ranges from 60 to 100 beats per minute.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-033",
    question: "Which fibrous protein forms the structural basis of human hair and nails?",
    options: ["Collagen", "Keratin", "Elastin", "Albumin"],
    correctAnswer: 1,
    explanation: "Keratin is an insoluble, highly protective structural protein found in outer skin cells, hair, and fingernails.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-034",
    question: "What is the most abundant protein in the human body, providing strength to skin, bones, and cartilage?",
    options: ["Hemoglobin", "Collagen", "Actin", "Myosin"],
    correctAnswer: 1,
    explanation: "Collagen makes up about 30% of the body's total protein content, forming a structural scaffold.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-035",
    question: "Which organ filters out old, worn-out red blood cells and stores platelets?",
    options: ["Spleen", "Gallbladder", "Pancreas", "Appendix"],
    correctAnswer: 0,
    explanation: "The spleen acts as a blood filter, recycling iron from damaged red blood cells and holding immune reserves.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-036",
    question: "Where in the human body are red blood cells, white blood cells, and platelets produced?",
    options: ["Heart", "Bone marrow", "Kidneys", "Liver"],
    correctAnswer: 1,
    explanation: "Hematopoiesis (blood cell production) primarily takes place within the spongy red bone marrow.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-037",
    question: "What involuntary muscle tissue makes up the wall of the human heart?",
    options: ["Skeletal muscle", "Cardiac muscle (myocardium)", "Smooth muscle", "Striated voluntary muscle"],
    correctAnswer: 1,
    explanation: "Cardiac muscle is an involuntary, striated muscle found exclusively in the walls of the heart.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-038",
    question: "What is the protective outer layer of the brain and spinal cord called?",
    options: ["Meninges", "Pericardium", "Pleura", "Periosteum"],
    correctAnswer: 0,
    explanation: "The meninges consist of three protective membranes: dura mater, arachnoid mater, and pia mater.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-039",
    question: "Which blood vessels carry oxygenated blood away from the heart to the rest of the body (with the exception of pulmonary vessels)?",
    options: ["Veins", "Arteries", "Capillaries", "Venules"],
    correctAnswer: 1,
    explanation: "Arteries carry blood away from the heart at high pressure; the largest artery is the aorta.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-040",
    question: "What is the largest artery in the human body?",
    options: ["Carotid artery", "Aorta", "Femoral artery", "Pulmonary artery"],
    correctAnswer: 1,
    explanation: "The aorta originates from the left ventricle of the heart and distributes oxygenated blood throughout the circulatory system.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-041",
    question: "Which vitamin is synthesized in human skin when exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correctAnswer: 2,
    explanation: "Sunlight (UVB radiation) converts 7-dehydrocholesterol in the skin into cholecalciferol (Vitamin D3).",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-042",
    question: "What is the medical term for the voice box located in the neck?",
    options: ["Pharynx", "Larynx", "Trachea", "Esophagus"],
    correctAnswer: 1,
    explanation: "The larynx houses the vocal folds (cords) which manipulate pitch and volume essential for phonation.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-043",
    question: "How many teeth are in a complete permanent adult dentition (including wisdom teeth)?",
    options: ["28", "30", "32", "36"],
    correctAnswer: 2,
    explanation: "A full set of adult permanent teeth includes 32 teeth: 8 incisors, 4 canines, 8 premolars, and 12 molars.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-044",
    question: "Which flap of cartilage prevents food from entering the windpipe (trachea) during swallowing?",
    options: ["Uvula", "Epiglottis", "Tonsil", "Palate"],
    correctAnswer: 1,
    explanation: "The epiglottis folds over the glottis during swallowing to direct food down the esophagus into the stomach.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-045",
    question: "What is the primary function of the large intestine (colon)?",
    options: ["Absorb water and salts", "Digest protein", "Produce enzymes", "Filter toxins"],
    correctAnswer: 0,
    explanation: "The large intestine absorbs remaining water and electrolytes from indigestible food matter, compacting waste.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-046",
    question: "What butterfly-shaped endocrine gland is situated at the base of the neck and regulates metabolism?",
    options: ["Thymus", "Thyroid gland", "Adrenal gland", "Pituitary gland"],
    correctAnswer: 1,
    explanation: "The thyroid gland secretes thyroxine (T4) and triiodothyronine (T3), controlling metabolic rate and energy levels.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-047",
    question: "Which hormone is commonly known as the 'fight-or-flight' hormone produced by the adrenal glands?",
    options: ["Cortisol", "Adrenaline (Epinephrine)", "Melatonin", "Insulin"],
    correctAnswer: 1,
    explanation: "Adrenaline increases heart rate, dilates airways, and boosts blood glucose in response to acute stress.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-048",
    question: "What is the common name for the kneecap bone?",
    options: ["Fibula", "Patella", "Scapula", "Clavicle"],
    correctAnswer: 1,
    explanation: "The patella is a sesamoid bone located in front of the knee joint that protects and articulates with the femur.",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-049",
    question: "What is the common name for the clavicle bone?",
    options: ["Shoulder blade", "Collarbone", "Breastbone", "Shinbone"],
    correctAnswer: 1,
    explanation: "The clavicle, commonly known as the collarbone, links the sternum to the shoulder blade (scapula).",
    difficulty: "easy",
    topic: "Human Body"
  },
  {
    questionId: "body-050",
    question: "What is the liquid portion of human blood called, making up roughly 55% of blood volume?",
    options: ["Serum", "Plasma", "Lymph", "Cytosol"],
    correctAnswer: 1,
    explanation: "Blood plasma is a yellowish liquid consisting of 92% water, along with proteins, electrolytes, and nutrients.",
    difficulty: "easy",
    topic: "Human Body"
  }
];

// 2. Animal Kingdom (50 Questions)
const ANIMAL_KINGDOM_QUESTIONS = [
  {
    questionId: "anim-001",
    question: "What is the largest living mammal on Earth?",
    options: ["African Elephant", "Blue Whale", "Sperm Whale", "Colossal Squid"],
    correctAnswer: 1,
    explanation: "The Blue Whale can reach lengths of over 30 meters and weigh up to 200 metric tons, making it the largest animal ever known.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-002",
    question: "What is the fastest land animal on Earth?",
    options: ["Lion", "Cheetah", "Pronghorn Antelope", "Greyhound"],
    correctAnswer: 1,
    explanation: "The cheetah can reach speeds of 100 to 120 km/h (60 to 75 mph) in short sprints.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-003",
    question: "Which bird is the largest living bird and cannot fly?",
    options: ["Emu", "Ostrich", "Penguin", "Cassowary"],
    correctAnswer: 1,
    explanation: "The common ostrich of Africa is the world's heaviest and tallest bird, laying the largest eggs of any living land animal.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-004",
    question: "What is the largest living land animal?",
    options: ["Hippopotamus", "African Bush Elephant", "White Rhinoceros", "Giraffe"],
    correctAnswer: 1,
    explanation: "The African bush elephant can weigh up to 6,000 kg (13,000 lbs) and reach a shoulder height of nearly 4 meters.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-005",
    question: "Which mammal is the only one capable of true, sustained flapping flight?",
    options: ["Flying squirrel", "Bat", "Sugar glider", "Flying lemur"],
    correctAnswer: 1,
    explanation: "Bats (order Chiroptera) are the only mammals with wings capable of true flapping flight rather than mere gliding.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-006",
    question: "What is the tallest living terrestrial animal?",
    options: ["African Elephant", "Giraffe", "Ostrich", "Camel"],
    correctAnswer: 1,
    explanation: "Giraffes can reach towering heights of up to 5.7 meters (18.7 feet) thanks to their long necks and legs.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-007",
    question: "How many hearts does an octopus have?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 2,
    explanation: "An octopus has three hearts: two branchial hearts to pump blood through the gills and one systemic heart for the rest of the body.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-008",
    question: "What color is octopus blood, due to the copper-based molecule hemocyanin?",
    options: ["Red", "Blue", "Green", "Clear"],
    correctAnswer: 1,
    explanation: "Octopus blood uses copper-rich hemocyanin to transport oxygen in cold, low-oxygen water, giving it a distinctive blue tint.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-009",
    question: "Which animal is famous for laying eggs despite being a mammal (a monotreme)?",
    options: ["Kangaroo", "Duck-billed Platypus", "Koala", "Opossum"],
    correctAnswer: 1,
    explanation: "The platypus and echidna are monotremes, an egg-laying order of mammals found in Australia.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-010",
    question: "Which bird is celebrated as the smallest bird in the world, capable of flying backwards?",
    options: ["Sparrow", "Bee Hummingbird", "Robin", "Finch"],
    correctAnswer: 1,
    explanation: "The Bee Hummingbird of Cuba measures only about 5.5 cm and weighs under 2 grams, fluttering its wings up to 80 times per second.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-011",
    question: "What is the primary food source of the Giant Panda in the wild?",
    options: ["Fish", "Bamboo", "Eucalyptus leaves", "Grass"],
    correctAnswer: 1,
    explanation: "Bamboo makes up over 99% of a giant panda's daily diet, consuming up to 38 kg of bamboo shoots daily.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-012",
    question: "What Australian marsupial feeds almost exclusively on toxic eucalyptus leaves?",
    options: ["Kangaroo", "Wombat", "Koala", "Tasmanian Devil"],
    correctAnswer: 2,
    explanation: "Koalas have specialized digestive systems with long caecums capable of detoxifying and digesting fibrous eucalyptus leaves.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-013",
    question: "Which big cat is the largest wild cat species in the world?",
    options: ["Lion", "Tiger (Siberian/Bengal)", "Jaguar", "Leopard"],
    correctAnswer: 1,
    explanation: "Tigers (Panthera tigris) are the largest feline species, with Siberian tigers weighing up to 300 kg (660 lbs).",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-014",
    question: "What flightless aquatic birds live predominantly in the Southern Hemisphere, particularly Antarctica?",
    options: ["Puffins", "Penguins", "Albatrosses", "Gulls"],
    correctAnswer: 1,
    explanation: "Penguins are highly adapted swimming seabirds with countershaded plumage living primarily in the Southern Hemisphere.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-015",
    question: "Which reptile is the largest living reptile in the world?",
    options: ["Komodo Dragon", "Saltwater Crocodile", "Green Anaconda", "Leatherback Sea Turtle"],
    correctAnswer: 1,
    explanation: "The saltwater crocodile (Crocodylus porosus) can exceed 6 meters in length and weigh over 1,000 kg.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-016",
    question: "What is the largest living lizard species in the world?",
    options: ["Gila Monster", "Komodo Dragon", "Monitor Lizard", "Iguana"],
    correctAnswer: 1,
    explanation: "The Komodo dragon of Indonesian islands can grow up to 3 meters in length and weigh over 70 kg.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-017",
    question: "What organ do sharks have that allows them to detect the faint electrical fields of other animals?",
    options: ["Lateral lines", "Ampullae of Lorenzini", "Spiracles", "Swim bladder"],
    correctAnswer: 1,
    explanation: "The Ampullae of Lorenzini are electroreceptors covering shark snouts that detect muscle twitches in hidden prey.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-018",
    question: "Do sharks have bones in their skeletons?",
    options: ["Yes, like all fish", "No, their skeleton is made of cartilage", "Only in their jaws", "Only in their fins"],
    correctAnswer: 1,
    explanation: "Sharks are cartilaginous fish (class Chondrichthyes) whose skeletons are composed entirely of flexible, lightweight cartilage.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-019",
    question: "Which sea creature is unique because the male carries eggs and gives birth to offspring?",
    options: ["Clownfish", "Seahorse", "Starfish", "Jellyfish"],
    correctAnswer: 1,
    explanation: "Male seahorses possess a specialized brood pouch where female eggs are deposited, fertilized, and gestated until birth.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-020",
    question: "What is a group of lions called?",
    options: ["Pack", "Pride", "Herd", "Troop"],
    correctAnswer: 1,
    explanation: "A social unit of lions is called a pride, typically consisting of related lionesses, cubs, and a small coalition of males.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-021",
    question: "What is a group of wolves called?",
    options: ["Pride", "Pack", "Flock", "Mob"],
    correctAnswer: 1,
    explanation: "Wolves live and hunt together in cooperative family units known as packs.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-022",
    question: "What is a group of fish swimming together in a coordinated manner called?",
    options: ["Pod", "School (or Shoal)", "Swarm", "Colony"],
    correctAnswer: 1,
    explanation: "Fish that swim in synchrony in the same direction are schooling, which deters predators and aids foraging.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-023",
    question: "What is a baby kangaroo called when it stays inside its mother's pouch?",
    options: ["Cub", "Joey", "Calf", "Pup"],
    correctAnswer: 1,
    explanation: "Marsupial infants, including young kangaroos, wallabies, and koalas, are called joeys.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-024",
    question: "How many legs does an adult insect typically have?",
    options: ["4", "6", "8", "10"],
    correctAnswer: 1,
    explanation: "All insects (class Insecta) have three body parts and three pairs of jointed thoracic walking legs (6 total).",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-025",
    question: "How many legs does a spider (an arachnid) have?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    explanation: "Spiders belong to the class Arachnida and have four pairs of walking legs (8 total), lacking antennae.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-026",
    question: "Which insect is famous for producing honey and pollinating flowering plants?",
    options: ["Wasp", "Honeybee", "Ant", "Butterfly"],
    correctAnswer: 1,
    explanation: "Honeybees collect floral nectar, convert it into honey, and act as vital pollinators of crops and ecosystems.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-027",
    question: "What animal has fingerprints that are so strikingly similar to human fingerprints they can confuse crime investigators?",
    options: ["Chimpanzee", "Koala", "Dolphin", "Panda"],
    correctAnswer: 1,
    explanation: "Koalas have dermatoglyphic dermal ridges with loops and whorls that look virtually indistinguishable from human fingerprints.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-028",
    question: "Which arctic marine mammal is famously known as the 'Unicorn of the Sea' due to its long spiral tusk?",
    options: ["Walrus", "Narwhal", "Beluga Whale", "Bowhead Whale"],
    correctAnswer: 1,
    explanation: "The narwhal is a medium-sized toothed whale whose males boast an elongated helical canine tooth up to 3 meters long.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-029",
    question: "What color is the skin of a polar bear underneath its white fur?",
    options: ["Pink", "White", "Black", "Brown"],
    correctAnswer: 2,
    explanation: "Polar bear skin is completely black to absorb thermal radiation from sunlight, while its hollow guard hairs appear white.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-030",
    question: "Which animal is the slowest-moving mammal in the world, spending most of its life hanging upside down in trees?",
    options: ["Sloth", "Koala", "Tortoise", "Armadillo"],
    correctAnswer: 0,
    explanation: "Three-toed sloths move at an average speed of about 0.24 km/h (0.15 mph) due to an extremely low metabolic rate.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-031",
    question: "Which African animal is responsible for more human fatalities annually than lions, tigers, or crocodiles?",
    options: ["Cheetah", "Hippopotamus", "Hyena", "Zebra"],
    correctAnswer: 1,
    explanation: "Hippopotamuses are fiercely territorial, highly aggressive, and attack boats and people near African waterways.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-032",
    question: "Which bird has the largest wingspan of any living bird, reaching up to 3.5 meters (11.5 feet)?",
    options: ["Bald Eagle", "Wandering Albatross", "Andean Condor", "Pelican"],
    correctAnswer: 1,
    explanation: "The Wandering Albatross uses its enormous wingspan to glide effortlessly over the southern oceans for thousands of miles.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-033",
    question: "What is the fastest diving bird in the world, exceeding speeds of 320 km/h (200 mph) in a high-speed hunting stoop?",
    options: ["Golden Eagle", "Peregrine Falcon", "Osprey", "Cheetah Bird"],
    correctAnswer: 1,
    explanation: "The Peregrine Falcon dives steeply at over 320 km/h, making it the fastest animal on the planet.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-034",
    question: "What makes chameleons famous in the reptile world?",
    options: ["Breathing underwater", "Changing skin color and independently moving eyes", "Running on water", "Flying between trees"],
    correctAnswer: 1,
    explanation: "Chameleons change color via pigment cells (chromatophores) for camouflage and communication, and have stereoscopic independent eyes.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-035",
    question: "Which animal produces the loudest sound of any living creature, reaching up to 230 decibels under water?",
    options: ["Blue Whale", "Sperm Whale", "Howler Monkey", "Lion"],
    correctAnswer: 1,
    explanation: "Sperm whale echolocation clicks can reach an astonishing 230 decibels, capable of stunning prey underwater.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-036",
    question: "Which crustacean delivers a punch as fast as a .22 caliber bullet, creating cavitation bubbles hot enough to produce light?",
    options: ["Mantis Shrimp", "King Crab", "Hermit Crab", "Lobster"],
    correctAnswer: 0,
    explanation: "The Peacock Mantis Shrimp strikes with club-like dactyl appendages accelerating faster than a bullet.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-037",
    question: "What is a group of flamingos called?",
    options: ["Flock", "Flamboyance", "Colony", "Flight"],
    correctAnswer: 1,
    explanation: "A gathering of flamingos is charmingly referred to as a flamboyance.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-038",
    question: "What gives flamingos their vivid pink or reddish-orange color?",
    options: ["Natural skin pigment", "Carotenoid pigments in their diet of algae and brine shrimp", "Sun exposure", "Genetics"],
    correctAnswer: 1,
    explanation: "Flamingos are born grey; they turn pink from digesting carotenoid pigments found in microscopic algae and brine shrimp.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-039",
    question: "Which mammal sleeps while floating in water, often holding hands with others to prevent drifting apart?",
    options: ["Beaver", "Sea Otter", "Seal", "Dolphin"],
    correctAnswer: 1,
    explanation: "Sea otters entangle themselves in kelp and hold hands ('rafting') while resting on their backs to avoid drifting out to sea.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-040",
    question: "What is the only species of penguin that breeds during the brutally harsh Antarctic winter?",
    options: ["Adélie Penguin", "Emperor Penguin", "Chinstrap Penguin", "Gentoo Penguin"],
    correctAnswer: 1,
    explanation: "Emperor penguins endure Antarctic blizzards and subzero temperatures, with males balancing eggs on their feet for months.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-041",
    question: "Which snake is recognized as the longest venomous snake in the world?",
    options: ["Black Mamba", "King Cobra", "Rattlesnake", "Russell's Viper"],
    correctAnswer: 1,
    explanation: "The King Cobra (Ophiophagus hannah) can reach lengths of up to 5.85 meters (19.2 feet).",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-042",
    question: "Which heavy snake is considered the heaviest and one of the longest snakes in the world?",
    options: ["Green Anaconda", "Reticulated Python", "Burmese Python", "Boa Constrictor"],
    correctAnswer: 0,
    explanation: "The Green Anaconda of South America is the heaviest snake in the world, weighing up to 250 kg (550 lbs).",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-043",
    question: "Which amphibian undergoes metamorphosis from an aquatic gill-breathing tadpole to an air-breathing adult?",
    options: ["Frog", "Lizard", "Crocodile", "Snake"],
    correctAnswer: 0,
    explanation: "Frogs lay eggs in water that hatch into swimming tadpoles before developing legs, lungs, and absorbing their tails.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-044",
    question: "How do frogs typically absorb water rather than drinking it through their mouths?",
    options: ["Through their nostrils", "Through their permeable skin", "Through their claws", "Through their eyes"],
    correctAnswer: 1,
    explanation: "Frogs do not drink with their mouths; they absorb moisture and electrolytes directly through a 'seat patch' on their abdomen.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-045",
    question: "What is a group of crows called?",
    options: ["Flock", "Murder", "Covey", "Parade"],
    correctAnswer: 1,
    explanation: "A collective group of crows is famously called a 'murder of crows'.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-046",
    question: "What animal is the national symbol and bird of the United States?",
    options: ["Golden Eagle", "Bald Eagle", "Wild Turkey", "Red-tailed Hawk"],
    correctAnswer: 1,
    explanation: "The Bald Eagle has been the national bird and heraldic symbol of the United States since 1782.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-047",
    question: "What is the only continent on Earth where bees are completely absent in the wild?",
    options: ["Australia", "Antarctica", "Europe", "South America"],
    correctAnswer: 1,
    explanation: "Antarctica's freezing ice sheets and lack of flowering vegetation make it impossible for bee colonies to survive.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-048",
    question: "Which animal's defense mechanism includes spraying a pungent, sulfur-smelling liquid at predators?",
    options: ["Porcupine", "Skunk", "Badger", "Weasel"],
    correctAnswer: 1,
    explanation: "Skunks have anal scent glands that spray a foul mixture of sulfur-containing thiols up to 3 meters away.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-049",
    question: "What is the horn of a rhinoceros composed of?",
    options: ["Bone", "Keratin (same as hair and nails)", "Ivory", "Cartilage"],
    correctAnswer: 1,
    explanation: "Rhino horns are not made of bone or ivory, but dense, compacted filaments of keratin.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  },
  {
    questionId: "anim-050",
    question: "How many arms and tentacles does a squid typically have in total?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 2,
    explanation: "A squid has 10 limbs in total: 8 arms lined with suckers and 2 longer specialized feeding tentacles.",
    difficulty: "easy",
    topic: "Animal Kingdom"
  }
];

// 3. Amazing Science Facts (50 Questions)
const SCIENCE_FACTS_QUESTIONS = [
  {
    questionId: "scifact-001",
    question: "How long does it take for light from the Sun to reach the surface of the Earth?",
    options: ["8 seconds", "8 minutes and 20 seconds", "8 hours", "Instantly"],
    correctAnswer: 1,
    explanation: "Traveling at approximately 300,000 km/s across 150 million km, sunlight reaches Earth in about 8 minutes and 20 seconds.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-002",
    question: "Can sound travel through the vacuum of outer space?",
    options: ["Yes, but very quietly", "No, sound requires a physical medium to travel", "Yes, at the speed of light", "Only radio sounds can"],
    correctAnswer: 1,
    explanation: "Sound is a mechanical pressure wave that cannot travel in a vacuum because there are no molecules to vibrate.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-003",
    question: "What happens to liquid water when it freezes into solid ice that is unique compared to most substances?",
    options: ["It contracts and becomes denser", "It expands and becomes less dense", "Its mass doubles", "It turns acidic"],
    correctAnswer: 1,
    explanation: "Water expands upon freezing due to open hexagonal hydrogen-bonded crystal lattices, which is why ice floats.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-004",
    question: "What is the only planet in our solar system that spins clockwise on its axis (retrograde rotation)?",
    options: ["Mars", "Venus", "Mercury", "Jupiter"],
    correctAnswer: 1,
    explanation: "Venus rotates in the opposite direction (retrograde) to almost all other planets, meaning the sun rises in the west.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-005",
    question: "Why does an apple fall from a tree toward the ground rather than flying into the sky?",
    options: ["Centrifugal force", "Earth's gravitational attraction", "Magnetic pull", "Atmospheric pressure"],
    correctAnswer: 1,
    explanation: "Earth's mass creates a gravitational field that pulls all objects toward its center.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-006",
    question: "What is the speed of light in a vacuum approximately equal to?",
    options: ["3,000 km/s", "30,000 km/s", "300,000 km/s", "3,000,000 km/s"],
    correctAnswer: 2,
    explanation: "Light travels in a vacuum at exactly 299,792,458 meters per second (approx. 300,000 km/s or 186,000 miles/s).",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-007",
    question: "What is the hottest planet in the Solar System, with surface temperatures exceeding 460°C?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correctAnswer: 1,
    explanation: "Although Mercury is closest to the Sun, Venus is hotter due to an extreme runaway greenhouse effect caused by a dense CO2 atmosphere.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-008",
    question: "Why does the daytime sky on Earth appear blue?",
    options: ["Reflections from oceans", "Rayleigh scattering of sunlight by atmospheric gases", "Ozone emission", "Oxygen molecules are blue"],
    correctAnswer: 1,
    explanation: "Rayleigh scattering causes shorter blue wavelengths of sunlight to scatter much more strongly in all directions than longer red wavelengths.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-009",
    question: "What natural event produces a flash of light followed by a sonic shockwave called thunder?",
    options: ["Earthquake", "Lightning", "Tornado", "Solar flare"],
    correctAnswer: 1,
    explanation: "A lightning bolt instantly superheats surrounding air to 30,000 kelvins, producing an explosive shockwave heard as thunder.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-010",
    question: "Why do we always see lightning before we hear the thunder?",
    options: ["Light travels much faster than sound", "Sound travels faster than light", "Thunder is generated after the strike finishes", "Our eyes process faster than ears"],
    correctAnswer: 0,
    explanation: "Light travels at 300,000 km/s, reaching our eyes virtually instantly, whereas sound crawls at approximately 343 m/s.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-011",
    question: "What is the only metal that remains in a liquid state at room temperature (around 20°C)?",
    options: ["Gallium", "Mercury (quicksilver)", "Bromine", "Cesium"],
    correctAnswer: 1,
    explanation: "Mercury (Hg) has a melting point of -38.8°C, making it the only metallic element liquid at standard room temperature.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-012",
    question: "What is the only non-metal that is a liquid at room temperature?",
    options: ["Chlorine", "Bromine", "Iodine", "Sulfur"],
    correctAnswer: 1,
    explanation: "Bromine (Br) is a reddish-brown halogen that is the only non-metallic element existing as a liquid at room temperature.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-013",
    question: "Does pure honey ever spoil or go bad if kept in a sealed container?",
    options: ["Yes, in 6 months", "Yes, in 2 years", "No, it never spoils due to low moisture and high acidity", "Yes, it grows mold"],
    correctAnswer: 2,
    explanation: "Honey has very low water content and high acidity (pH ~3.9), creating an inhospitable environment for bacteria and fungi to grow.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-014",
    question: "Which gas do green plants absorb from the air during photosynthesis to produce glucose?",
    options: ["Oxygen", "Carbon dioxide (CO2)", "Nitrogen", "Methane"],
    correctAnswer: 1,
    explanation: "Plants utilize solar energy to convert carbon dioxide and water into glucose and oxygen via photosynthesis.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-015",
    question: "What gas is released into the atmosphere as a byproduct of plant photosynthesis?",
    options: ["Carbon dioxide", "Oxygen (O2)", "Nitrogen", "Hydrogen"],
    correctAnswer: 1,
    explanation: "Water molecules are split during light reactions, releasing molecular oxygen as a vital byproduct.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-016",
    question: "What celestial object's gravitational pull is primarily responsible for ocean tides on Earth?",
    options: ["The Sun", "The Moon", "Mars", "Jupiter"],
    correctAnswer: 1,
    explanation: "Because the Moon is much closer to Earth than the Sun, its tidal gravitational force is more than twice as strong.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-017",
    question: "What is the chemical formula for ordinary table salt?",
    options: ["NaCl", "KCl", "CaCl2", "Na2SO4"],
    correctAnswer: 0,
    explanation: "Table salt is composed of sodium and chlorine ions combined into sodium chloride (NaCl).",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-018",
    question: "What is the pH value of pure, neutral water at 25°C?",
    options: ["0", "7", "10", "14"],
    correctAnswer: 1,
    explanation: "A neutral solution has equal concentrations of hydrogen and hydroxide ions, corresponding to a pH of exactly 7.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-019",
    question: "What is the name of the astronomical phenomenon where the Moon passes directly between the Earth and the Sun?",
    options: ["Lunar Eclipse", "Solar Eclipse", "Aurora Borealis", "Equinox"],
    correctAnswer: 1,
    explanation: "In a solar eclipse, the Moon's shadow falls onto Earth, partially or completely blocking sunlight.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-020",
    question: "What happens during a lunar eclipse?",
    options: ["The Sun passes between Earth and Moon", "The Earth passes directly between the Sun and the Moon", "The Moon passes between Sun and Earth", "A comet blocks the Moon"],
    correctAnswer: 1,
    explanation: "A lunar eclipse occurs when the Earth aligns directly between the Sun and Moon, casting Earth's shadow onto the Moon.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-021",
    question: "What naturally occurring glowing lights are seen in high-latitude night skies, caused by solar wind particles hitting the atmosphere?",
    options: ["Rainbows", "Auroras (Northern/Southern Lights)", "Halos", "Mirages"],
    correctAnswer: 1,
    explanation: "Charged particles from solar winds collide with atmospheric oxygen and nitrogen atoms, exciting them into glowing auroras.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-022",
    question: "What is the term for a shooting star seen streaking across the night sky?",
    options: ["Comet", "Meteor", "Asteroid", "Supernova"],
    correctAnswer: 1,
    explanation: "A meteor is the streak of light caused by a space rock (meteoroid) burning up due to frictional heating in Earth's atmosphere.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-023",
    question: "What is a meteorite?",
    options: ["A rock that burns up completely in the air", "A space rock that survives passage through the atmosphere and lands on Earth's surface", "A distant icy comet", "An exploded star"],
    correctAnswer: 1,
    explanation: "When a piece of a meteoroid survives its descent through the atmosphere and strikes the ground, it is called a meteorite.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-024",
    question: "Which planet in our solar system has the most prominent and extensive ring system easily visible with small telescopes?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: 1,
    explanation: "Saturn's rings span hundreds of thousands of kilometers across but are surprisingly thin, composed of billions of ice and rock particles.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-025",
    question: "What is the name of the supermassive black hole at the center of our Milky Way galaxy?",
    options: ["Cygnus X-1", "Sagittarius A*", "Andromeda Core", "Messier 87"],
    correctAnswer: 1,
    explanation: "Sagittarius A* (pronounced Sagittarius A-star) is the supermassive black hole around 4 million times the mass of the Sun at our galactic center.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-026",
    question: "What state of matter is the most abundant in the visible universe, found in stars and interstellar nebulae?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    correctAnswer: 3,
    explanation: "Over 99% of visible matter in the universe is plasma, an ionized gas of free electrons and positive ions.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-027",
    question: "Can diamond be scratched by any other naturally occurring mineral?",
    options: ["Yes, by quartz", "Yes, by sapphire", "No, diamond is the hardest natural mineral and can only be scratched by another diamond", "Yes, by topaz"],
    correctAnswer: 2,
    explanation: "Diamond rates a maximum 10 on the Mohs hardness scale; its tetrahedral covalent carbon bonds can only be scratched by diamond.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-028",
    question: "What are diamonds composed of chemically?",
    options: ["Pure Silicon", "Pure Carbon", "Calcium carbonate", "Titanium dioxide"],
    correctAnswer: 1,
    explanation: "Both diamond and pencil graphite are allotropes of pure carbon crystallized under different pressures and temperatures.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-029",
    question: "What is dry ice made of?",
    options: ["Frozen liquid nitrogen", "Solid carbon dioxide (CO2)", "Frozen heavy water", "Solidified methane"],
    correctAnswer: 1,
    explanation: "Dry ice is solid carbon dioxide that sublimates directly into gas at -78.5°C (-109.3°F) without melting into a liquid.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-030",
    question: "What is the transition called when a substance turns directly from a solid into a gas without passing through a liquid phase?",
    options: ["Evaporation", "Sublimation", "Condensation", "Deposition"],
    correctAnswer: 1,
    explanation: "Sublimation is the direct phase change from solid to gas (e.g., dry ice and mothballs).",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-031",
    question: "What force keeps the planets orbiting around the Sun?",
    options: ["Magnetism", "Gravity", "Friction", "Electrostatic force"],
    correctAnswer: 1,
    explanation: "The Sun's colossal mass generates the gravitational pull that curves the paths of planets into stable elliptical orbits.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-032",
    question: "What is the boiling point of pure water at standard sea level atmospheric pressure in Celsius?",
    options: ["50°C", "90°C", "100°C", "212°C"],
    correctAnswer: 2,
    explanation: "At standard sea-level pressure (1 atm), water boils at 100°C (212°F).",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-033",
    question: "What is the freezing point of pure water at standard atmospheric pressure in Celsius?",
    options: ["-10°C", "0°C", "4°C", "32°C"],
    correctAnswer: 1,
    explanation: "At standard atmospheric pressure, water freezes into ice at 0°C (32°F).",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-034",
    question: "Why do astronauts float weightlessly aboard the International Space Station (ISS)?",
    options: ["There is zero gravity in space", "They are in perpetual free fall around Earth along with the station", "They wear special anti-gravity suits", "Magnetic repulsion"],
    correctAnswer: 1,
    explanation: "Gravity at ISS altitude is still about 90% of Earth's surface gravity; astronauts float because they and the station are in continuous orbital free fall.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-035",
    question: "Which gas makes up roughly 78% of Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"],
    correctAnswer: 1,
    explanation: "Nitrogen comprises approximately 78.08% of Earth's atmosphere, while oxygen makes up about 20.95%.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-036",
    question: "Which gas makes up roughly 21% of Earth's atmosphere?",
    options: ["Nitrogen", "Oxygen", "Argon", "Helium"],
    correctAnswer: 1,
    explanation: "Oxygen accounts for about 21% of dry atmospheric air, sustaining aerobic respiration.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-037",
    question: "What is the name of our spiral home galaxy containing hundreds of billions of stars?",
    options: ["Andromeda Galaxy", "Milky Way Galaxy", "Whirlpool Galaxy", "Triangulum Galaxy"],
    correctAnswer: 1,
    explanation: "Our solar system resides in the Orion Arm of the barred spiral Milky Way Galaxy.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-038",
    question: "What is the closest major spiral galaxy to our own Milky Way?",
    options: ["Sombrero Galaxy", "Andromeda Galaxy (M31)", "Large Magellanic Cloud", "Centaurus A"],
    correctAnswer: 1,
    explanation: "The Andromeda Galaxy lies approximately 2.5 million light-years away and is heading toward a merger with the Milky Way in 4.5 billion years.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-039",
    question: "What explosive event marks the catastrophic death of a massive star?",
    options: ["Nebula", "Supernova", "Protostar", "Pulsar"],
    correctAnswer: 1,
    explanation: "A supernova is a stellar explosion that outshines entire galaxies and disperses heavy elements across space.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-040",
    question: "What is a light-year a unit of?",
    options: ["Time", "Distance", "Brightness", "Speed"],
    correctAnswer: 1,
    explanation: "A light-year is the astronomical distance that light travels in one Julian year (approx. 9.46 trillion kilometers).",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-041",
    question: "Which subatomic particles carry a negative electric charge?",
    options: ["Protons", "Neutrons", "Electrons", "Positrons"],
    correctAnswer: 2,
    explanation: "Electrons are negatively charged fundamental leptons that orbit the atomic nucleus.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-042",
    question: "Which subatomic particles carry a positive electric charge?",
    options: ["Electrons", "Protons", "Neutrons", "Neutrinos"],
    correctAnswer: 1,
    explanation: "Protons carry a positive electrical charge of +1 elementary charge inside the atomic nucleus.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-043",
    question: "Which subatomic particle has no electrical charge (is electrically neutral)?",
    options: ["Proton", "Electron", "Neutron", "Ion"],
    correctAnswer: 2,
    explanation: "Neutrons carry zero net electric charge and reside alongside protons in the atomic nucleus.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-044",
    question: "Can an ordinary glass prism bend and split white sunlight into a spectrum of rainbow colors?",
    options: ["No, it only absorbs light", "Yes, through refraction and dispersion", "Only artificial light can be split", "Yes, through reflection only"],
    correctAnswer: 1,
    explanation: "A glass prism refracts different wavelengths (colors) of light by different angles, dispersing white light into its spectrum.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-045",
    question: "What optical device uses curved glass or mirrors to make distant celestial objects appear closer and brighter?",
    options: ["Microscope", "Telescope", "Periscope", "Kaleidoscope"],
    correctAnswer: 1,
    explanation: "Telescopes gather and focus electromagnetic radiation from distant astronomical objects to create magnified images.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-046",
    question: "What optical instrument uses lenses to magnify tiny microscopic organisms invisible to the naked human eye?",
    options: ["Telescope", "Microscope", "Spectroscope", "Stethoscope"],
    correctAnswer: 1,
    explanation: "Microscopes magnify microscopic specimens such as cells and bacteria.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-047",
    question: "What layer of the Earth's stratosphere shields living organisms from harmful solar ultraviolet (UV) radiation?",
    options: ["Ionosphere", "Ozone layer", "Troposphere", "Mesosphere"],
    correctAnswer: 1,
    explanation: "The ozone layer (O3) in the stratosphere absorbs between 97% and 99% of the Sun's medium-frequency ultraviolet light.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-048",
    question: "What is the innermost, solid layer of the Earth composed mostly of iron and nickel?",
    options: ["Crust", "Mantle", "Outer Core", "Inner Core"],
    correctAnswer: 3,
    explanation: "Earth's inner core is a solid metallic ball of iron and nickel maintained under extreme pressures despite temperatures above 5,000°C.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-049",
    question: "What generates Earth's protective magnetic field that deflects lethal solar wind particles?",
    options: ["The crust", "Convection currents of molten iron in the outer core", "The Moon", "Atmospheric winds"],
    correctAnswer: 1,
    explanation: "The geodynamo created by swirling molten iron in the liquid outer core generates Earth's geomagnetic field.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  },
  {
    questionId: "scifact-050",
    question: "What is the estimated scientific age of Planet Earth?",
    options: ["10,000 years", "100 million years", "4.54 billion years", "14 billion years"],
    correctAnswer: 2,
    explanation: "Radiometric dating of meteorite material and ancient terrestrial rock confirms Earth formed approximately 4.54 billion years ago.",
    difficulty: "easy",
    topic: "Amazing Science Facts"
  }
];

// 4. Physics Challenge (50 Questions)
const PHYSICS_CHALLENGE_QUESTIONS = [
  {
    questionId: "phys-001",
    question: "What is the SI unit of force?",
    options: ["Joule", "Newton", "Pascal", "Watt"],
    correctAnswer: 1,
    explanation: "The Newton (N) is the SI unit of force, named after Sir Isaac Newton, where 1 N = 1 kg·m/s².",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-002",
    question: "What is the SI unit of energy and work?",
    options: ["Newton", "Joule", "Watt", "Volt"],
    correctAnswer: 1,
    explanation: "The Joule (J) is the SI unit of energy and mechanical work, equal to 1 Newton applied over 1 meter.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-003",
    question: "What is the SI unit of power, representing the rate of energy transfer per second?",
    options: ["Joule", "Watt", "Ohm", "Ampere"],
    correctAnswer: 1,
    explanation: "The Watt (W) is the SI unit of power, equivalent to one joule of energy per second (1 W = 1 J/s).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-004",
    question: "What is Newton's First Law of Motion commonly referred to as?",
    options: ["Law of Universal Gravitation", "Law of Inertia", "Law of Action and Reaction", "Law of Acceleration"],
    correctAnswer: 1,
    explanation: "The Law of Inertia states that an object remains at rest or in uniform motion unless acted upon by a net external force.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-005",
    question: "According to Newton's Second Law of Motion, what does force equal?",
    options: ["Mass divided by Acceleration", "Mass multiplied by Acceleration ($F = ma$)", "Velocity multiplied by Time", "Work divided by Distance"],
    correctAnswer: 1,
    explanation: "Newton's Second Law defines force as the product of mass and acceleration ($F = ma$).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-006",
    question: "What does Newton's Third Law of Motion state?",
    options: ["Force equals mass times velocity", "Energy cannot be created or destroyed", "For every action, there is an equal and opposite reaction", "Pressure equals force over area"],
    correctAnswer: 2,
    explanation: "Newton's Third Law states that whenever one body exerts a force on another, the second exerts an equal and opposite force on the first.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-007",
    question: "What is the acceleration due to gravity on the surface of Earth approximately equal to?",
    options: ["5.8 m/s²", "9.8 m/s²", "12.4 m/s²", "19.6 m/s²"],
    correctAnswer: 1,
    explanation: "Standard acceleration due to Earth's gravity ($g$) at sea level is approximately 9.8 m/s² (or 9.81 m/s²).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-008",
    question: "What is the SI unit of electrical current?",
    options: ["Volt", "Ampere", "Ohm", "Coulomb"],
    correctAnswer: 1,
    explanation: "The Ampere (A) measures the flow of electric charge per second (1 A = 1 Coulomb/second).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-009",
    question: "What is the SI unit of electrical resistance?",
    options: ["Watt", "Ohm", "Farad", "Henry"],
    correctAnswer: 1,
    explanation: "The Ohm (Ω) is the SI unit of electrical resistance, defined by Ohm's Law ($R = V/I$).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-010",
    question: "What is the SI unit of electrical potential difference (voltage)?",
    options: ["Ampere", "Volt", "Tesla", "Weber"],
    correctAnswer: 1,
    explanation: "The Volt (V) is the SI unit of electrical potential and electromotive force.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-011",
    question: "According to Ohm's Law, what is the mathematical relationship between Voltage ($V$), Current ($I$), and Resistance ($R$)?",
    options: ["$V = I \\times R$", "$V = I / R$", "$I = V \\times R$", "$R = V \\times I$"],
    correctAnswer: 0,
    explanation: "Ohm's Law states that current is directly proportional to voltage and inversely proportional to resistance: $V = I \\times R$.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-012",
    question: "What is the SI unit of pressure?",
    options: ["Newton", "Pascal", "Joule", "Torr"],
    correctAnswer: 1,
    explanation: "The Pascal (Pa) is the SI unit of pressure, defined as one Newton of force per square meter (1 Pa = 1 N/m²).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-013",
    question: "What is the SI unit of frequency, representing cycles per second?",
    options: ["Baud", "Hertz", "Decibel", "Lumen"],
    correctAnswer: 1,
    explanation: "The Hertz (Hz) is the SI unit of frequency, named after Heinrich Hertz (1 Hz = 1 cycle per second).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-014",
    question: "What type of energy does an object possess due to its motion?",
    options: ["Potential energy", "Kinetic energy", "Thermal energy", "Chemical energy"],
    correctAnswer: 1,
    explanation: "Kinetic energy is the energy an object possesses by virtue of being in motion ($KE = \\frac{1}{2}mv^2$).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-015",
    question: "What type of energy is stored in an object due to its position in a gravitational field?",
    options: ["Kinetic energy", "Gravitational potential energy", "Nuclear energy", "Radiant energy"],
    correctAnswer: 1,
    explanation: "Gravitational potential energy ($PE = mgh$) is the energy stored when work is done against gravity to elevate an object.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-016",
    question: "What does the Law of Conservation of Energy state?",
    options: ["Energy can be created from nothing", "Energy can neither be created nor destroyed, only transformed", "Energy decreases over time", "Energy and mass are completely independent"],
    correctAnswer: 1,
    explanation: "The first law of thermodynamics states that total energy in an isolated system remains constant; it can only change form.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-017",
    question: "What is absolute zero, the theoretical lowest temperature where molecular motion ceases?",
    options: ["0°C", "-273.15°C (0 Kelvin)", "-100°C", "-459°C"],
    correctAnswer: 1,
    explanation: "Absolute zero is 0 Kelvin or -273.15°C, where particles possess minimum classical kinetic energy.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-018",
    question: "What phenomenon occurs when a wave bounces back after striking a barrier?",
    options: ["Refraction", "Reflection", "Diffraction", "Absorption"],
    correctAnswer: 1,
    explanation: "Reflection involves a change in direction of waves when they bounce off a barrier, following the law: angle of incidence = angle of reflection.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-019",
    question: "What phenomenon describes the bending of light as it passes from one medium to another with a different refractive index?",
    options: ["Reflection", "Refraction", "Interference", "Polarization"],
    correctAnswer: 1,
    explanation: "Refraction is the change in direction and speed of a wave passing from one medium into another (e.g., air into water).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-020",
    question: "What type of lens is thicker in the middle than at the edges and converges parallel light rays to a focal point?",
    options: ["Concave lens", "Convex lens", "Cylindrical lens", "Plano-concave lens"],
    correctAnswer: 1,
    explanation: "A convex (converging) lens focuses incoming parallel light rays onto a single focal point.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-021",
    question: "What type of mirror is curved inward and can produce both real and magnified virtual images?",
    options: ["Plane mirror", "Convex mirror", "Concave mirror", "Parabolic diverging mirror"],
    correctAnswer: 2,
    explanation: "Concave mirrors curve inward like a cave and are used in shaving mirrors and car headlights.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-022",
    question: "What type of mirror is commonly used as a passenger-side vehicle rearview mirror because it offers a wider field of view?",
    options: ["Concave mirror", "Convex mirror", "Plane mirror", "Two-way mirror"],
    correctAnswer: 1,
    explanation: "Convex mirrors bulge outward, producing upright, reduced virtual images with an expanded viewing angle ('Objects in mirror are closer than they appear').",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-023",
    question: "What kind of wave is sound in air?",
    options: ["Transverse electromagnetic wave", "Longitudinal mechanical wave", "Surface wave", "Standing torsional wave"],
    correctAnswer: 1,
    explanation: "Sound waves in air are longitudinal compression waves where air molecules oscillate parallel to the direction of propagation.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-024",
    question: "What kind of wave is visible light?",
    options: ["Longitudinal mechanical wave", "Transverse electromagnetic wave", "Infrasonic wave", "Acoustic wave"],
    correctAnswer: 1,
    explanation: "Light is a transverse electromagnetic wave with mutually perpendicular oscillating electric and magnetic fields.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-025",
    question: "What change in perceived pitch occurs when an ambulance siren moves rapidly toward and then away from an observer?",
    options: ["Photoelectric effect", "Doppler Effect", "Compton effect", "Tyndall effect"],
    correctAnswer: 1,
    explanation: "The Doppler Effect causes perceived frequency to increase as a source approaches and decrease as it recedes.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-026",
    question: "What is the speed of sound in dry air at room temperature (20°C) approximately?",
    options: ["100 m/s", "343 m/s", "1,500 m/s", "3,000 m/s"],
    correctAnswer: 1,
    explanation: "At 20°C, sound travels through dry air at approximately 343 meters per second (approx. 1,235 km/h or 767 mph).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-027",
    question: "Does sound travel faster through solids, liquids, or gases?",
    options: ["Gases", "Liquids", "Solids", "Speed is identical in all states"],
    correctAnswer: 2,
    explanation: "Sound travels fastest in dense, elastic solids (like steel at ~5,100 m/s) because tightly packed molecules transmit vibrations rapidly.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-028",
    question: "What is the SI unit of magnetic flux density?",
    options: ["Henry", "Tesla", "Weber", "Lumen"],
    correctAnswer: 1,
    explanation: "The Tesla (T) is the SI unit of magnetic B-field strength, named after Nikola Tesla.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-029",
    question: "What is the phenomenon where electric current creates a magnetic field, and a moving magnetic field creates electric current?",
    options: ["Thermodynamics", "Electromagnetism", "Capacitance", "Fluorescence"],
    correctAnswer: 1,
    explanation: "Electromagnetism describes the mutual interplay between electricity and magnetic fields discovered by Oersted and Faraday.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-030",
    question: "What electrical component stores electric charge between two conducting plates separated by an insulator?",
    options: ["Resistor", "Capacitor", "Inductor", "Diode"],
    correctAnswer: 1,
    explanation: "A capacitor stores electrostatic potential energy in an electric field between its plates.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-031",
    question: "What semiconductor device allows electric current to flow easily in only one forward direction while blocking it in reverse?",
    options: ["Resistor", "Diode", "Capacitor", "Transformer"],
    correctAnswer: 1,
    explanation: "A diode (such as a p-n junction diode or LED) functions as a one-way electrical valve.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-032",
    question: "What device steps up (increases) or steps down (decreases) AC voltage using electromagnetic induction between coils?",
    options: ["Transformer", "Generator", "Rectifier", "Inverter"],
    correctAnswer: 0,
    explanation: "A transformer transfers electrical energy between circuits through inductive coupling without changing frequency.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-033",
    question: "What is the name of the resistance force opposing the relative motion of two solid surfaces sliding against each other?",
    options: ["Inertia", "Friction", "Tension", "Buoyancy"],
    correctAnswer: 1,
    explanation: "Frictional force opposes sliding or rolling between contact surfaces and dissipates mechanical energy as heat.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-034",
    question: "Which principle states that an object immersed in a fluid experiences an upward buoyant force equal to the weight of the displaced fluid?",
    options: ["Bernoulli's Principle", "Archimedes' Principle", "Pascal's Law", "Hooke's Law"],
    correctAnswer: 1,
    explanation: "Archimedes' Principle explains why heavy steel ships float if their hulls displace water weighing more than the vessel.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-035",
    question: "Which fluid dynamics principle explains the aerodynamic lift on airplane wings: as fluid speed increases, internal pressure decreases?",
    options: ["Archimedes' Principle", "Bernoulli's Principle", "Coulomb's Law", "Kepler's Law"],
    correctAnswer: 1,
    explanation: "Bernoulli's principle states that an increase in fluid velocity occurs simultaneously with a decrease in static pressure.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-036",
    question: "What is the minimum velocity an object must reach to break completely free from Earth's gravitational pull without further propulsion?",
    options: ["Orbital speed", "Escape velocity", "Terminal velocity", "Speed of sound"],
    correctAnswer: 1,
    explanation: "Earth's escape velocity from the surface is approximately 11.2 km/s (around 25,000 mph).",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-037",
    question: "What is the constant maximum speed a falling object reaches when the upward drag of air resistance equals downward gravity?",
    options: ["Escape velocity", "Terminal velocity", "Sonic velocity", "Free fall constant"],
    correctAnswer: 1,
    explanation: "At terminal velocity, net acceleration is zero because the opposing aerodynamic drag equals the gravitational force.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-038",
    question: "What law of elasticity states that within elastic limits, the strain/extension of a spring is directly proportional to the applied stress/force ($F = -kx$)?",
    options: ["Hooke's Law", "Ohm's Law", "Boyle's Law", "Snell's Law"],
    correctAnswer: 0,
    explanation: "Robert Hooke formulated Hooke's Law in 1676, relating spring restoring force to displacement.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-039",
    question: "What is the term for a material that offers exactly zero electrical resistance at very low temperatures?",
    options: ["Semiconductor", "Superconductor", "Insulator", "Electrolyte"],
    correctAnswer: 1,
    explanation: "Superconductors expel magnetic fields (Meissner effect) and conduct electricity with zero resistance below a critical temperature.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-040",
    question: "In Einstein's mass-energy equivalence equation $E = mc^2$, what does 'c' represent?",
    options: ["Speed of sound", "Speed of light in a vacuum", "Centrifugal constant", "Cosmological constant"],
    correctAnswer: 1,
    explanation: "In $E = mc^2$, $c$ represents the speed of light in a vacuum (~$3 \\times 10^8$ m/s), indicating that mass can be converted into immense energy.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-041",
    question: "What is the property of matter that describes its resistance to any change in its state of rest or motion?",
    options: ["Density", "Inertia", "Momentum", "Velocity"],
    correctAnswer: 1,
    explanation: "Inertia is directly proportional to an object's mass; greater mass implies greater resistance to acceleration.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-042",
    question: "What physical quantity is defined as the product of an object's mass and its velocity ($p = mv$)?",
    options: ["Force", "Momentum", "Kinetic Energy", "Work"],
    correctAnswer: 1,
    explanation: "Linear momentum is a conserved vector quantity equal to mass times velocity.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-043",
    question: "What optical effect causes a straight straw to appear bent or broken when placed in a clear glass of water?",
    options: ["Diffraction", "Refraction", "Internal reflection", "Dispersion"],
    correctAnswer: 1,
    explanation: "Light rays bend at the air-water boundary because light travels slower in water than in air.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-044",
    question: "What optical phenomenon occurs when light attempts to pass into a less dense medium at an angle greater than the critical angle, resulting in 100% reflection?",
    options: ["Total Internal Reflection", "Diffuse reflection", "Polarization", "Scattering"],
    correctAnswer: 0,
    explanation: "Total Internal Reflection is the foundational principle allowing light signals to travel through fiber optic cables.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-045",
    question: "Which of the four fundamental forces of nature is the strongest?",
    options: ["Gravitational force", "Weak nuclear force", "Electromagnetic force", "Strong nuclear force"],
    correctAnswer: 3,
    explanation: "The strong nuclear force is the strongest fundamental interaction, binding quarks into protons/neutrons and holding nuclei together.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-046",
    question: "Which of the four fundamental forces of nature is by far the weakest, yet dominates large-scale astronomical structures?",
    options: ["Strong nuclear force", "Electromagnetic force", "Weak nuclear force", "Gravitational force"],
    correctAnswer: 3,
    explanation: "Gravity is trillions of times weaker than other forces, but because it is always attractive and has infinite range, it shapes galaxies and orbits.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-047",
    question: "What is the SI unit of electric charge?",
    options: ["Ampere", "Coulomb", "Volt", "Farad"],
    correctAnswer: 1,
    explanation: "The Coulomb (C) is the SI unit of electric charge, equal to the charge of roughly $6.242 \\times 10^{18}$ electrons.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-048",
    question: "What law in electrostatics describes the electrostatic force of attraction or repulsion between two point charges?",
    options: ["Ohm's Law", "Coulomb's Law", "Faraday's Law", "Ampere's Law"],
    correctAnswer: 1,
    explanation: "Coulomb's Law states that force is directly proportional to the product of charges and inversely proportional to the square of the distance between them.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-049",
    question: "What term describes the spread of a wave around obstacles and through small openings?",
    options: ["Refraction", "Diffraction", "Polarization", "Attenuation"],
    correctAnswer: 1,
    explanation: "Diffraction is the bending and spreading of waves when they encounter an obstacle or aperture comparable in size to their wavelength.",
    difficulty: "easy",
    topic: "Physics Challenge"
  },
  {
    questionId: "phys-050",
    question: "What simple machine consists of a rigid beam pivoted at a fixed point called a fulcrum?",
    options: ["Pulley", "Lever", "Wedge", "Inclined plane"],
    correctAnswer: 1,
    explanation: "A lever uses a fulcrum to multiply mechanical force, divided into first, second, and third class levers.",
    difficulty: "easy",
    topic: "Physics Challenge"
  }
];

// 5. Chemistry Quiz (50 Questions)
const CHEMISTRY_QUESTIONS = [
  {
    questionId: "chem-001",
    question: "What is the chemical symbol for the element Gold?",
    options: ["Ag", "Au", "Fe", "Pb"],
    correctAnswer: 1,
    explanation: "The symbol Au comes from the Latin word for gold, 'Aurum', meaning 'shining dawn'.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-002",
    question: "What is the chemical symbol for the element Silver?",
    options: ["Si", "Ag", "Au", "Sn"],
    correctAnswer: 1,
    explanation: "The symbol Ag comes from the Latin word for silver, 'Argentum'.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-003",
    question: "What is the chemical symbol for Iron?",
    options: ["Ir", "Fe", "In", "I"],
    correctAnswer: 1,
    explanation: "The symbol Fe is derived from 'Ferrum', the Latin name for iron.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-004",
    question: "What is the chemical formula for water?",
    options: ["H2O2", "H2O", "HO2", "OH"],
    correctAnswer: 1,
    explanation: "Water consists of two hydrogen atoms covalently bonded to one oxygen atom ($H_2O$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-005",
    question: "What is the chemical formula for carbon dioxide?",
    options: ["CO", "CO2", "C2O", "CH4"],
    correctAnswer: 1,
    explanation: "Carbon dioxide consists of one carbon atom doubly bonded to two oxygen atoms ($CO_2$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-006",
    question: "What is the common name for the compound dihydrogen monoxide?",
    options: ["Bleach", "Water", "Vinegar", "Ammonia"],
    correctAnswer: 1,
    explanation: "Dihydrogen monoxide is the humorous systematic chemical name for ordinary water ($H_2O$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-007",
    question: "What is the atomic number of Hydrogen, the simplest and lightest element?",
    options: ["1", "2", "6", "8"],
    correctAnswer: 0,
    explanation: "Hydrogen has atomic number 1, with each atom containing a single proton in its nucleus.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-008",
    question: "What is the atomic number of Carbon, the fundamental building block of organic life?",
    options: ["4", "6", "12", "14"],
    correctAnswer: 1,
    explanation: "Carbon has atomic number 6, containing 6 protons and typically 4 valence electrons capable of forming four covalent bonds.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-009",
    question: "What is the atomic number of Oxygen?",
    options: ["6", "7", "8", "16"],
    correctAnswer: 2,
    explanation: "Oxygen has atomic number 8, indicating 8 protons in its atomic nucleus.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-010",
    question: "What is the main chemical compound found in ordinary household vinegar?",
    options: ["Hydrochloric acid", "Acetic acid (ethanoic acid)", "Citric acid", "Sulfuric acid"],
    correctAnswer: 1,
    explanation: "Vinegar is an aqueous solution containing typically 4% to 8% acetic acid ($CH_3COOH$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-011",
    question: "What is the chemical name for ordinary baking soda?",
    options: ["Sodium chloride", "Sodium bicarbonate (sodium hydrogen carbonate)", "Sodium hydroxide", "Calcium carbonate"],
    correctAnswer: 1,
    explanation: "Baking soda is sodium bicarbonate ($NaHCO_3$), which releases carbon dioxide gas when reacting with an acid.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-012",
    question: "What gas is produced when vinegar (acetic acid) is mixed with baking soda (sodium bicarbonate)?",
    options: ["Oxygen", "Carbon dioxide (CO2)", "Hydrogen", "Methane"],
    correctAnswer: 1,
    explanation: "The acid-base reaction produces sodium acetate, water, and effervescent bubbles of carbon dioxide gas.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-013",
    question: "What is the pH range of acidic solutions on the pH scale?",
    options: ["0 to less than 7", "Exactly 7", "Greater than 7 to 14", "Above 14"],
    correctAnswer: 0,
    explanation: "On the standard pH scale from 0 to 14, acids have a pH below 7, with lower values indicating stronger acidity.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-014",
    question: "What is the pH range of basic (alkaline) solutions?",
    options: ["Below 7", "Exactly 7", "Greater than 7 to 14", "Negative values"],
    correctAnswer: 2,
    explanation: "Bases have a pH greater than 7, with 14 representing strong alkalinity.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-015",
    question: "What color does blue litmus paper turn when exposed to an acidic solution?",
    options: ["Yellow", "Red", "Green", "Stays Blue"],
    correctAnswer: 1,
    explanation: "Litmus is a natural pH indicator; blue litmus turns red in acids, while red litmus turns blue in bases.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-016",
    question: "What color does red litmus paper turn in a basic (alkaline) solution?",
    options: ["Blue", "Yellow", "Pink", "Colorless"],
    correctAnswer: 0,
    explanation: "Red litmus paper turns blue when submerged in an alkaline/basic medium.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-017",
    question: "What is the chemical formula for laughing gas, commonly used as a dental anesthetic?",
    options: ["NO", "N2O (Nitrous oxide)", "NO2", "N2O4"],
    correctAnswer: 1,
    explanation: "Nitrous oxide ($N_2O$) is a colorless gas with sweet odor used for conscious sedation and pain relief.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-018",
    question: "What is the main component of natural gas used in home heating and cooking?",
    options: ["Propane", "Methane (CH4)", "Butane", "Ethane"],
    correctAnswer: 1,
    explanation: "Methane ($CH_4$), the simplest hydrocarbon, typically makes up 70% to 90% of natural gas.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-019",
    question: "What gas is primarily stored in domestic pressurized LPG cylinders for cooking?",
    options: ["Methane", "Propane and Butane", "Acetylene", "Hydrogen"],
    correctAnswer: 1,
    explanation: "Liquefied Petroleum Gas (LPG) consists mainly of propane ($C_3H_8$) and butane ($C_4H_{10}$) compressed into liquid form.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-020",
    question: "What chemical bond is formed when atoms share pairs of valence electrons?",
    options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
    correctAnswer: 1,
    explanation: "Covalent bonds form when two nonmetal atoms share one or more pairs of electrons to achieve stable octets.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-021",
    question: "What chemical bond is formed through the electrostatic attraction between positively and negatively charged ions after electron transfer?",
    options: ["Covalent bond", "Ionic bond", "Peptide bond", "Van der Waals bond"],
    correctAnswer: 1,
    explanation: "Ionic bonds form when one atom transfers valence electrons to another (e.g., $Na^+$ and $Cl^-$ in NaCl).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-022",
    question: "What is the process called where iron slowly reacts with oxygen and moisture to form hydrated iron oxide?",
    options: ["Combustion", "Rusting (Corrosion)", "Fermentation", "Electrolysis"],
    correctAnswer: 1,
    explanation: "Rusting is an electrochemical oxidation reaction that forms flaky red-brown iron oxide ($Fe_2O_3 \\cdot nH_2O$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-023",
    question: "What method protects iron and steel from rusting by coating it with a thin layer of zinc?",
    options: ["Anodizing", "Galvanization", "Electroplating", "Alloying"],
    correctAnswer: 1,
    explanation: "Galvanization applies a sacrificial zinc coating that oxidizes before the underlying iron can corrode.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-024",
    question: "What is an alloy of copper and zinc called?",
    options: ["Bronze", "Brass", "Pewter", "Solder"],
    correctAnswer: 1,
    explanation: "Brass is an alloy consisting primarily of copper and zinc, widely used for musical instruments and plumbing.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-025",
    question: "What is an alloy of copper and tin called?",
    options: ["Brass", "Bronze", "Steel", "Electrum"],
    correctAnswer: 1,
    explanation: "Bronze is traditionally composed of copper combined with approximately 12% tin.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-026",
    question: "What is stainless steel primarily made of?",
    options: ["Iron, Carbon, and Chromium", "Copper and Zinc", "Aluminum and Magnesium", "Lead and Tin"],
    correctAnswer: 0,
    explanation: "Stainless steel is an iron alloy with at least 10.5% chromium, which forms a passive chromium oxide layer resisting rust.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-027",
    question: "What is the chemical name for common chalk, limestone, and marble?",
    options: ["Calcium oxide", "Calcium carbonate (CaCO3)", "Calcium sulfate", "Magnesium carbonate"],
    correctAnswer: 1,
    explanation: "Chalk, limestone, and marble are all geological forms of calcium carbonate ($CaCO_3$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-028",
    question: "What is the chemical formula for ozone?",
    options: ["O", "O2", "O3", "O4"],
    correctAnswer: 2,
    explanation: "Ozone is a triatomic molecule made of three oxygen atoms ($O_3$).",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-029",
    question: "Which noble gas is lighter than air, non-flammable, and used to inflate party balloons?",
    options: ["Hydrogen", "Helium", "Neon", "Argon"],
    correctAnswer: 1,
    explanation: "Helium is an inert, non-reactive noble gas that provides safe buoyancy for balloons and airships.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-030",
    question: "Which noble gas produces a distinctive reddish-orange glow in illuminated advertising signs?",
    options: ["Argon", "Neon", "Krypton", "Xenon"],
    correctAnswer: 1,
    explanation: "When high voltage passes through low-pressure neon gas, it emits a vibrant, classic reddish-orange light.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-031",
    question: "What is the chemical symbol for Lead?",
    options: ["Ld", "Pb", "Pl", "Le"],
    correctAnswer: 1,
    explanation: "The symbol Pb is derived from the Latin 'Plumbum', from which the English word 'plumbing' also originated.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-032",
    question: "What is the chemical symbol for Tin?",
    options: ["Ti", "Sn", "Tn", "Sb"],
    correctAnswer: 1,
    explanation: "The symbol Sn comes from the Latin word for tin, 'Stannum'.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-033",
    question: "What is the chemical symbol for Sodium?",
    options: ["So", "Na", "Sd", "S"],
    correctAnswer: 1,
    explanation: "The symbol Na originates from 'Natrium', the Neo-Latin name for sodium.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-034",
    question: "What is the chemical symbol for Potassium?",
    options: ["P", "Po", "K", "Pt"],
    correctAnswer: 2,
    explanation: "The symbol K comes from 'Kalium', the Neo-Latin word for potassium derived from Arabic al-qalyah.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-035",
    question: "What substance speeds up the rate of a chemical reaction without being consumed in the process?",
    options: ["Inhibitor", "Catalyst", "Reagent", "Solvent"],
    correctAnswer: 1,
    explanation: "A catalyst lowers the activation energy of a chemical reaction, increasing its rate without undergoing permanent chemical change.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-036",
    question: "What are biological catalysts that speed up biochemical reactions in living cells called?",
    options: ["Hormones", "Enzymes", "Vitamins", "Steroids"],
    correctAnswer: 1,
    explanation: "Enzymes are specialized proteins that catalyze essential physiological reactions with high specificity.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-037",
    question: "What is an exothermic chemical reaction?",
    options: ["A reaction that absorbs thermal heat", "A reaction that releases thermal heat to surroundings", "A reaction that only occurs in water", "A reaction that consumes electricity"],
    correctAnswer: 1,
    explanation: "Exothermic reactions release energy (usually heat and light) because products have lower enthalpy than reactants.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-038",
    question: "What is an endothermic chemical reaction?",
    options: ["A reaction that releases heat", "A reaction that absorbs heat from its surroundings", "A nuclear explosion", "A reaction that freezes matter instantly"],
    correctAnswer: 1,
    explanation: "Endothermic reactions absorb thermal energy from the environment (e.g., instant cold packs), causing surroundings to cool.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-039",
    question: "What is the name for atoms of the same chemical element that have the same number of protons but different numbers of neutrons?",
    options: ["Isomers", "Isotopes", "Allotropes", "Isobars"],
    correctAnswer: 1,
    explanation: "Isotopes possess identical chemical properties due to the same proton count, but differ in atomic mass.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-040",
    question: "What is an ion with a net positive electric charge called?",
    options: ["Anion", "Cation", "Positron", "Isotope"],
    correctAnswer: 1,
    explanation: "A cation is a positively charged ion formed when an atom loses one or more valence electrons.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-041",
    question: "What is an ion with a net negative electric charge called?",
    options: ["Cation", "Anion", "Neutron", "Proton"],
    correctAnswer: 1,
    explanation: "An anion is a negatively charged ion formed when an atom gains one or more electrons.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-042",
    question: "Which acid is found in citrus fruits like lemons, oranges, and limes, giving them their sour taste?",
    options: ["Acetic acid", "Citric acid", "Lactic acid", "Malic acid"],
    correctAnswer: 1,
    explanation: "Citric acid is a natural organic tricarboxylic acid found in high concentrations in citrus fruits.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-043",
    question: "Which acid accumulates in human muscles during vigorous exercise causing temporary muscle fatigue?",
    options: ["Citric acid", "Lactic acid", "Acetic acid", "Uric acid"],
    correctAnswer: 1,
    explanation: "During anaerobic glycolysis, muscle cells convert pyruvate into lactic acid when oxygen levels are depleted.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-044",
    question: "What is the common chemical name of quicklime?",
    options: ["Calcium carbonate", "Calcium oxide (CaO)", "Calcium hydroxide", "Calcium chloride"],
    correctAnswer: 1,
    explanation: "Calcium oxide ($CaO$) is quicklime, produced by heating limestone to drive off carbon dioxide.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-045",
    question: "What is the common name of slaked lime?",
    options: ["Calcium oxide", "Calcium hydroxide ($Ca(OH)_2$)", "Calcium sulfate", "Calcium carbonate"],
    correctAnswer: 1,
    explanation: "Calcium hydroxide ($Ca(OH)_2$) is slaked lime, formed when quicklime reacts vigorously with water.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-046",
    question: "What is the chemical name for the mineral Plaster of Paris?",
    options: ["Calcium carbonate", "Calcium sulfate hemihydrate ($CaSO_4 \\cdot \\frac{1}{2}H_2O$)", "Sodium sulfate", "Magnesium sulfate"],
    correctAnswer: 1,
    explanation: "Plaster of Paris is calcium sulfate hemihydrate, produced by heating gypsum.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-047",
    question: "What is the primary organic compound that gives fruits like bananas and apples their sweet taste?",
    options: ["Cellulose", "Fructose", "Starch", "Glycogen"],
    correctAnswer: 1,
    explanation: "Fructose (fruit sugar) is a simple monosaccharide found naturally in fruits, honey, and root vegetables.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-048",
    question: "What is the term for a homogeneous mixture formed when a solute completely dissolves in a solvent?",
    options: ["Suspension", "Colloid", "Solution", "Emulsion"],
    correctAnswer: 2,
    explanation: "A solution is a homogeneous mixture where solute particles are dissolved at the molecular or ionic level.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-049",
    question: "What liquid is known as the 'Universal Solvent' because it dissolves more substances than any other liquid?",
    options: ["Ethanol", "Water", "Acetone", "Benzene"],
    correctAnswer: 1,
    explanation: "Water's polar molecular structure and hydrogen bonding allow it to dissolve a wide array of ionic and polar substances.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  },
  {
    questionId: "chem-050",
    question: "What is the constant value of Avogadro's number, representing particles per mole?",
    options: ["$3.14 \\times 10^7$", "$6.022 \\times 10^{23}$", "$9.81 \\times 10^9$", "$1.602 \\times 10^{-19}$"],
    correctAnswer: 1,
    explanation: "Avogadro's number ($N_A$) is approximately $6.02214076 \\times 10^{23}$, the number of constituent particles in one mole.",
    difficulty: "easy",
    topic: "Chemistry Quiz"
  }
];

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena');
  console.log('✅ Connected to MongoDB.');

  const catSlug = 'science-space';
  const catName = 'Science & Space';

  await seedSubjectQuestions(
    catSlug,
    catName,
    'human-body',
    'Human Body',
    'human-body.json',
    HUMAN_BODY_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'animal-kingdom',
    'Animal Kingdom',
    'animal-kingdom.json',
    ANIMAL_KINGDOM_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'amazing-science-facts',
    'Amazing Science Facts',
    'science-facts.json',
    SCIENCE_FACTS_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'physics-challenge',
    'Physics Challenge',
    'physics.json',
    PHYSICS_CHALLENGE_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'chemistry-quiz',
    'Chemistry Quiz',
    'chemistry.json',
    CHEMISTRY_QUESTIONS
  );

  await mongoose.disconnect();
  console.log('🎉 Category 5 (Science & Space) Part 1 completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error in Category 5 Part 1 seeding:', err);
  process.exit(1);
});
