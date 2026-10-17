import 'dotenv/config';
import mongoose from 'mongoose';
import { seedSubjectQuestions } from './seed-helper.js';

// 6. Biology Basics (50 Questions)
const BIOLOGY_BASICS_QUESTIONS = [
  {
    questionId: "bio-001",
    question: "What is known as the 'powerhouse of the cell' for producing cellular ATP energy?",
    options: ["Ribosome", "Mitochondria", "Nucleus", "Endoplasmic reticulum"],
    correctAnswer: 1,
    explanation: "Mitochondria generate most of the cell's chemical energy supply in the form of adenosine triphosphate (ATP).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-002",
    question: "What green pigment in plant chloroplasts is responsible for absorbing sunlight for photosynthesis?",
    options: ["Carotene", "Chlorophyll", "Xanthophyll", "Anthocyanin"],
    correctAnswer: 1,
    explanation: "Chlorophyll absorbs blue and red light from the sun, reflecting green wavelengths and providing the color of plant leaves.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-003",
    question: "What cellular organelle contains the hereditary genetic material (DNA) in eukaryotic cells?",
    options: ["Vacuole", "Nucleus", "Ribosome", "Golgi apparatus"],
    correctAnswer: 1,
    explanation: "The cell nucleus serves as the repository of genetic instructions contained in linear DNA chromosomes.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-004",
    question: "What rigid outer structure surrounds plant cells providing support and protection, but is absent in animal cells?",
    options: ["Cell membrane", "Cell wall", "Nuclear envelope", "Cytoskeleton"],
    correctAnswer: 1,
    explanation: "Plant cells possess a rigid cell wall composed primarily of cellulose, which animal cells lack.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-005",
    question: "What cellular organelles are responsible for protein synthesis by translating messenger RNA?",
    options: ["Lysosomes", "Ribosomes", "Vacuoles", "Centrosomes"],
    correctAnswer: 1,
    explanation: "Ribosomes translate genetic codes transcribed in mRNA into specific polypeptide amino acid sequences.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-006",
    question: "What process do somatic cells use to divide and produce two genetically identical daughter cells?",
    options: ["Meiosis", "Mitosis", "Binary fission", "Budding"],
    correctAnswer: 1,
    explanation: "Mitosis is the process of nuclear division resulting in two daughter nuclei each identical to the parent nucleus.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-007",
    question: "What type of cell division reduces the chromosome number by half to produce gametes (sperm and egg cells)?",
    options: ["Mitosis", "Meiosis", "Cytokinesis", "Budding"],
    correctAnswer: 1,
    explanation: "Meiosis produces four haploid daughter cells (gametes) containing half the parental chromosome number.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-008",
    question: "How many pairs of chromosomes do humans typically possess in each somatic cell?",
    options: ["20 pairs", "23 pairs (46 total)", "25 pairs", "46 pairs"],
    correctAnswer: 1,
    explanation: "Humans have 23 pairs of chromosomes: 22 pairs of autosomes and 1 pair of sex chromosomes (XX or XY).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-009",
    question: "What are the four nitrogenous bases found in DNA molecules?",
    options: ["Adenine, Thymine, Guanine, Cytosine", "Adenine, Uracil, Guanine, Cytosine", "Alanine, Threonine, Glycine, Cysteine", "ATP, ADP, GTP, CTP"],
    correctAnswer: 0,
    explanation: "The four nucleotide bases in DNA are Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-010",
    question: "Which nitrogenous base replaces Thymine in ribonucleic acid (RNA)?",
    options: ["Adenine", "Uracil", "Guanine", "Cytosine"],
    correctAnswer: 1,
    explanation: "In RNA, Uracil (U) pairs with Adenine instead of Thymine (T).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-011",
    question: "What biological macromolecule stores energy long-term and forms cellular phospholipid bilayers?",
    options: ["Carbohydrates", "Lipids (fats)", "Proteins", "Nucleic acids"],
    correctAnswer: 1,
    explanation: "Lipids provide high-density energy storage, thermal insulation, and compose the lipid bilayer of membranes.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-012",
    question: "What vascular plant tissue transports water and dissolved mineral nutrients upward from roots to leaves?",
    options: ["Phloem", "Xylem", "Cambium", "Cortex"],
    correctAnswer: 1,
    explanation: "Xylem tissue consists of tracheids and vessel elements that conduct water upward via transpiration pull.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-013",
    question: "What vascular plant tissue transports sugars and organic nutrients produced in leaves downward and throughout the plant?",
    options: ["Xylem", "Phloem", "Pith", "Epidermis"],
    correctAnswer: 1,
    explanation: "Phloem translocates soluble sugars (sucrose) produced during photosynthesis to non-photosynthetic tissues.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-014",
    question: "What are microscopic pores on plant leaves that open and close to regulate gas exchange and water transpiration?",
    options: ["Lenticels", "Stomata", "Chloroplasts", "Cuticles"],
    correctAnswer: 1,
    explanation: "Stomata, regulated by pairs of guard cells, allow carbon dioxide uptake and release oxygen and water vapor.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-015",
    question: "What type of organism makes its own food using sunlight or chemical energy (a primary producer)?",
    options: ["Heterotroph", "Autotroph", "Decomposer", "Parasite"],
    correctAnswer: 1,
    explanation: "Autotrophs (like green plants and algae) produce organic compounds from simple inorganic substances.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-016",
    question: "What type of organism must consume other organisms to obtain energy and organic nutrients?",
    options: ["Autotroph", "Heterotroph", "Chemotroph", "Phototroph"],
    correctAnswer: 1,
    explanation: "Heterotrophs (including all animals, fungi, and many bacteria) cannot synthesize their own food and must ingest organic matter.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-017",
    question: "What organisms break down dead organic matter and waste, recycling nutrients back into the ecosystem?",
    options: ["Carnivores", "Decomposers (saprotrophs)", "Producers", "Apex predators"],
    correctAnswer: 1,
    explanation: "Decomposers such as fungi and soil bacteria break down decaying matter, returning vital nutrients to the soil.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-018",
    question: "What is an animal that eats only plants called?",
    options: ["Carnivore", "Herbivore", "Omnivore", "Piscivore"],
    correctAnswer: 1,
    explanation: "Herbivores are anatomically adapted to consume autotrophic plant material (e.g., deer, cows, rabbits).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-019",
    question: "What is an animal that eats only meat/flesh called?",
    options: ["Herbivore", "Carnivore", "Frugivore", "Detritivore"],
    correctAnswer: 1,
    explanation: "Carnivores obtain energy exclusively or predominantly through predation on other animals.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-020",
    question: "What is an animal that naturally consumes both plants and animals called?",
    options: ["Carnivore", "Omnivore", "Herbivore", "Insectivore"],
    correctAnswer: 1,
    explanation: "Omnivores (like humans, bears, and pigs) feed on a diverse diet of both plant matter and animal tissue.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-021",
    question: "What biological term describes a close, long-term interaction between two different biological species?",
    options: ["Competition", "Symbiosis", "Predation", "Speciation"],
    correctAnswer: 1,
    explanation: "Symbiosis includes mutualism, commensalism, and parasitism.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-022",
    question: "What symbiotic relationship benefits both participating species (such as clownfish and sea anemones)?",
    options: ["Parasitism", "Mutualism", "Commensalism", "Amensalism"],
    correctAnswer: 1,
    explanation: "Mutualism is an ecological interaction where both species derive mutual benefits.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-023",
    question: "What is the biological kingdom to which mushrooms, yeasts, and molds belong?",
    options: ["Plantae", "Fungi", "Protista", "Monera"],
    correctAnswer: 1,
    explanation: "Fungi are eukaryotic organisms possessing chitin in their cell walls that absorb nutrients through extracellular digestion.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-024",
    question: "Do viruses have cellular structures of their own?",
    options: ["Yes, they are prokaryotic cells", "No, they are non-cellular genetic material wrapped in a protein coat", "Yes, they have a nucleus", "They are eukaryotic single-cell organisms"],
    correctAnswer: 1,
    explanation: "Viruses are obligate intracellular parasites made of DNA or RNA enclosed in a protein capsid, lacking cellular machinery.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-025",
    question: "What is the biological process by which organisms maintain a stable internal environment despite external fluctuations?",
    options: ["Metabolism", "Homeostasis", "Osmosis", "Taxonomy"],
    correctAnswer: 1,
    explanation: "Homeostasis regulates core variables like body temperature, pH, and fluid balance within narrow physiological limits.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-026",
    question: "What is the net passive movement of water molecules through a semi-permeable membrane called?",
    options: ["Diffusion", "Osmosis", "Active transport", "Endocytosis"],
    correctAnswer: 1,
    explanation: "Osmosis is the spontaneous movement of water from an area of low solute concentration to high solute concentration.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-027",
    question: "What cellular organelle contains digestive enzymes that break down cell debris and foreign invaders ('suicide bags')?",
    options: ["Ribosome", "Lysosome", "Centriole", "Peroxisome"],
    correctAnswer: 1,
    explanation: "Lysosomes contain acidic hydrolytic enzymes that digest macromolecules, cellular waste, and apoptotic cell parts.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-028",
    question: "What cellular organelle modifies, sorts, and packages proteins for secretion or delivery?",
    options: ["Mitochondria", "Golgi apparatus (Golgi body)", "Endoplasmic reticulum", "Nucleolus"],
    correctAnswer: 1,
    explanation: "The Golgi apparatus acts like a cellular post office, glycosylating and packing proteins into transport vesicles.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-029",
    question: "What are bacteria classified as in terms of cell organization?",
    options: ["Eukaryotes", "Prokaryotes", "Viruses", "Protozoa"],
    correctAnswer: 1,
    explanation: "Prokaryotes are single-celled organisms that lack a membrane-bound nucleus and membrane-bound organelles.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-030",
    question: "What type of cellular organism possesses a membrane-bound nucleus and complex organelles?",
    options: ["Prokaryote", "Eukaryote", "Bacteriophage", "Prion"],
    correctAnswer: 1,
    explanation: "Eukaryotes (animals, plants, fungi, and protists) have membrane-bound nuclei and specialized organelles.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-031",
    question: "What is a segment of DNA that codes for a specific functional protein or trait called?",
    options: ["Chromosome", "Gene", "Codon", "Allele"],
    correctAnswer: 1,
    explanation: "A gene is the basic molecular unit of heredity containing instructions to build specific polypeptides.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-032",
    question: "What are different alternative forms or variants of the same gene called?",
    options: ["Codons", "Alleles", "Genomes", "Plasmids"],
    correctAnswer: 1,
    explanation: "Alleles are variant nucleotide sequences at a specific genomic locus (e.g., brown eye allele vs blue eye allele).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-033",
    question: "What is an organism's genetic makeup or combination of alleles called?",
    options: ["Phenotype", "Genotype", "Karyotype", "Serotype"],
    correctAnswer: 1,
    explanation: "Genotype refers to the specific genetic makeup of an organism, while phenotype refers to observable physical traits.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-034",
    question: "What is the observable physical appearance or functional expression of an organism's traits called?",
    options: ["Genotype", "Phenotype", "Allele", "Haplotype"],
    correctAnswer: 1,
    explanation: "An organism's phenotype is the set of observable characteristics resulting from the interaction of its genotype with the environment.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-035",
    question: "What Swedish botanist developed the modern system of binomial nomenclature (genus and species)?",
    options: ["Charles Darwin", "Carl Linnaeus", "Gregor Mendel", "Jean-Baptiste Lamarck"],
    correctAnswer: 1,
    explanation: "Carl Linnaeus formalised binomial nomenclature (e.g., Homo sapiens) in the 18th century, earning the title 'Father of Modern Taxonomy'.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-036",
    question: "What is the primary carbohydrate storage compound in plants?",
    options: ["Glycogen", "Starch (amylum)", "Cellulose", "Chitin"],
    correctAnswer: 1,
    explanation: "Plants store excess glucose produced during photosynthesis in the form of starch granules.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-037",
    question: "What is the primary carbohydrate storage compound in animal livers and muscles?",
    options: ["Starch", "Glycogen", "Cellulose", "Dextrin"],
    correctAnswer: 1,
    explanation: "Animals store energy as glycogen, a multibranched polysaccharide of glucose located primarily in liver and skeletal muscles.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-038",
    question: "Which of the following describes anaerobic respiration?",
    options: ["Respiration requiring ample oxygen", "Respiration that occurs in the absence of oxygen", "Photosynthesis in bright light", "Water filtration in roots"],
    correctAnswer: 1,
    explanation: "Anaerobic respiration breaks down glucose to produce cellular energy without requiring molecular oxygen.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-039",
    question: "What anaerobic metabolic process produces alcohol or lactic acid in microorganisms like yeast?",
    options: ["Krebs cycle", "Fermentation", "Transpiration", "Oxidative phosphorylation"],
    correctAnswer: 1,
    explanation: "Fermentation allows glycolysis to continue producing ATP in anaerobic conditions, generating ethanol or lactate.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-040",
    question: "What is an organism that transmits disease-causing pathogens from one host to another called (such as mosquitoes transmitting malaria)?",
    options: ["Parasite", "Vector", "Host", "Pathogen"],
    correctAnswer: 1,
    explanation: "In epidemiology, a vector is any agent (often an arthropod) that transfers an infectious pathogen into another living organism.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-041",
    question: "What is the process called when an organism grows and replaces damaged or lost tissues, organs, or limbs?",
    options: ["Metamorphosis", "Regeneration", "Germination", "Speciation"],
    correctAnswer: 1,
    explanation: "Regeneration is the natural renewal of lost or damaged tissues (e.g., starfishes regrowing lost arms).",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-042",
    question: "What is the biological term for the development of a plant from a dormant seed?",
    options: ["Pollination", "Germination", "Fertilization", "Transpiration"],
    correctAnswer: 1,
    explanation: "Germination begins when a dormant seed absorbs water and sprouts a seedling embryo.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-043",
    question: "What is the transfer of pollen grains from the anther to the stigma of a flower called?",
    options: ["Fertilization", "Pollination", "Germination", "Budding"],
    correctAnswer: 1,
    explanation: "Pollination is the delivery of pollen by wind, water, or animal pollinators to the female reproductive organ.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-044",
    question: "What is the female reproductive part of a flowering plant called?",
    options: ["Stamen", "Pistil (or Carpel)", "Sepal", "Petal"],
    correctAnswer: 1,
    explanation: "The pistil comprises the stigma, style, and ovary containing ovules.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-045",
    question: "What is the male reproductive organ of a flowering plant called?",
    options: ["Pistil", "Stamen", "Ovary", "Style"],
    correctAnswer: 1,
    explanation: "The stamen consists of the slender filament and the pollen-producing anther.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-046",
    question: "What is the protective outer layer of a tree trunk called?",
    options: ["Phloem", "Bark", "Pith", "Xylem"],
    correctAnswer: 1,
    explanation: "Bark comprises all tissues outside the vascular cambium, protecting against insects, physical injury, and dehydration.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-047",
    question: "What is the study of birds called?",
    options: ["Entomology", "Ornithology", "Herpetology", "Ichthyology"],
    correctAnswer: 1,
    explanation: "Ornithology is the branch of zoology that studies bird species, physiology, and habitats.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-048",
    question: "What is the study of insects called?",
    options: ["Ornithology", "Entomology", "Herpetology", "Botany"],
    correctAnswer: 1,
    explanation: "Entomology is the scientific study of insects, the largest animal group on Earth.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-049",
    question: "What is the study of reptiles and amphibians called?",
    options: ["Ichthyology", "Herpetology", "Mammalogy", "Paleontology"],
    correctAnswer: 1,
    explanation: "Herpetology is the branch of zoology dedicated to reptiles and amphibians.",
    difficulty: "easy",
    topic: "Biology Basics"
  },
  {
    questionId: "bio-050",
    question: "What is the study of plant life and botany called?",
    options: ["Zoology", "Botany (Plant Biology)", "Ecology", "Microbiology"],
    correctAnswer: 1,
    explanation: "Botany is the scientific discipline dedicated to the study of plants, including algae and fungi historically.",
    difficulty: "easy",
    topic: "Biology Basics"
  }
];

// 7. Solar System (50 Questions)
const SOLAR_SYSTEM_QUESTIONS = [
  {
    questionId: "sol-001",
    question: "How many recognized major planets are there in our Solar System?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 1,
    explanation: "Following the IAU 2006 reclassification of Pluto as a dwarf planet, there are 8 official major planets.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-002",
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    explanation: "Mercury orbits closest to the Sun at an average distance of about 58 million kilometers.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-003",
    question: "Which planet is the largest in the Solar System, with more mass than all other planets combined?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correctAnswer: 1,
    explanation: "Jupiter is a gas giant containing more than 2.5 times the combined mass of all other planets in the Solar System.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-004",
    question: "Which planet is famously known as the 'Red Planet' due to iron oxide rust on its surface?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correctAnswer: 2,
    explanation: "Mars appears reddish to the naked eye because iron-rich minerals in its soil oxidize (rust).",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-005",
    question: "What is the name of the persistent, giant anticyclonic storm on Jupiter that is larger than Earth?",
    options: ["The Great Dark Spot", "The Great Red Spot", "Olympus Mons", "Valles Marineris"],
    correctAnswer: 1,
    explanation: "The Great Red Spot is a colossal high-pressure storm in Jupiter's southern hemisphere observed for centuries.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-006",
    question: "What is the largest volcano and highest known mountain peak in the entire Solar System, located on Mars?",
    options: ["Mount Everest", "Olympus Mons", "Mauna Kea", "Maxwell Montes"],
    correctAnswer: 1,
    explanation: "Olympus Mons on Mars stands over 21 km (13 miles) high, about 2.5 times the height of Mount Everest.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-007",
    question: "Which planet in our solar system has the lowest density, low enough that it could theoretically float in water?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: 1,
    explanation: "Saturn has a mean density of approximately 0.687 g/cm³, less than the density of liquid water (1.0 g/cm³).",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-008",
    question: "Which is the coldest planet in the Solar System, often dubbed the 'Ice Giant' tilted on its side?",
    options: ["Neptune", "Uranus", "Saturn", "Mars"],
    correctAnswer: 1,
    explanation: "Uranus has the coldest atmosphere in the solar system, dropping down to -224°C, and rotates almost completely on its side.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-009",
    question: "Which planet is the eighth and farthest known major planet from the Sun, famous for intense supersonic winds?",
    options: ["Uranus", "Neptune", "Pluto", "Saturn"],
    correctAnswer: 1,
    explanation: "Neptune is the outermost major planet, with winds whipping through its blue methane atmosphere up to 2,100 km/h.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-010",
    question: "What is the largest moon in the Solar System, orbiting Jupiter and larger than the planet Mercury?",
    options: ["Titan", "Ganymede", "Callisto", "Europa"],
    correctAnswer: 1,
    explanation: "Ganymede is 5,268 km in diameter, making it larger than Mercury and the only moon known to possess its own magnetic field.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-011",
    question: "Which moon of Saturn has a dense nitrogen atmosphere and surface lakes of liquid methane and ethane?",
    options: ["Enceladus", "Titan", "Mimas", "Rhea"],
    correctAnswer: 1,
    explanation: "Titan is the only moon with a substantial, dense atmosphere and stable surface bodies of liquid hydrocarbons.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-012",
    question: "Which volcanic moon of Jupiter is the most volcanically active body in the entire Solar System?",
    options: ["Europa", "Io", "Ganymede", "Callisto"],
    correctAnswer: 1,
    explanation: "Io experiences extreme tidal friction from Jupiter's gravity, driving over 400 active volcanoes spitting sulfur.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-013",
    question: "Which icy moon of Jupiter harbors a deep subsurface liquid water ocean beneath its smooth, cracked ice crust?",
    options: ["Io", "Europa", "Phobos", "Deimos"],
    correctAnswer: 1,
    explanation: "Europa is a prime candidate in the search for extraterrestrial life due to a warm global ocean beneath its ice sheet.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-014",
    question: "What are the two tiny irregularly shaped moons of Mars called?",
    options: ["Titan and Enceladus", "Phobos and Deimos", "Io and Europa", "Oberon and Titania"],
    correctAnswer: 1,
    explanation: "Phobos ('fear') and Deimos ('panic') are captured asteroids orbiting Mars.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-015",
    question: "What astronomical classification was assigned to Pluto by the International Astronomical Union in 2006?",
    options: ["Asteroid", "Dwarf Planet", "Comet", "Major Planet"],
    correctAnswer: 1,
    explanation: "Pluto was reclassified as a dwarf planet because it has not cleared the neighborhood around its orbit in the Kuiper belt.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-016",
    question: "Where is the main asteroid belt located in our solar system?",
    options: ["Between Mercury and Venus", "Between Earth and Mars", "Between Mars and Jupiter", "Beyond Neptune"],
    correctAnswer: 2,
    explanation: "The asteroid belt orbits between Mars and Jupiter, containing millions of rocky bodies like Ceres, Vesta, and Pallas.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-017",
    question: "What is the largest object in the asteroid belt, classified as a dwarf planet?",
    options: ["Vesta", "Ceres", "Pallas", "Eris"],
    correctAnswer: 1,
    explanation: "Ceres is roughly 940 km across, accounting for a third of the entire mass of the asteroid belt.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-018",
    question: "What is the region of icy bodies, comets, and dwarf planets located beyond Neptune called?",
    options: ["Asteroid Belt", "Kuiper Belt", "Van Allen Belt", "Oort Cloud"],
    correctAnswer: 1,
    explanation: "The Kuiper Belt extends from Neptune's orbit out to 50 AU and contains Pluto, Makemake, and Haumea.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-019",
    question: "What is the vast, spherical shell of icy cometary bodies theoretically surrounding the outer boundaries of the Solar System?",
    options: ["Kuiper Belt", "Oort Cloud", "Heliopause", "Scattered Disc"],
    correctAnswer: 1,
    explanation: "The Oort Cloud extends up to 100,000 AU from the Sun and is considered the source of long-period comets.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-020",
    question: "What famous comet visits the inner solar system every 75 to 76 years, last seen in 1986 and next visible in 2061?",
    options: ["Hale-Bopp", "Halley's Comet (1P/Halley)", "Comet Encke", "Shoemaker-Levy 9"],
    correctAnswer: 1,
    explanation: "Halley's Comet is the only known short-period comet regularly visible to the naked human eye from Earth twice in a human lifetime.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-021",
    question: "What causes a comet to develop a glowing coma and long tail pointing away from the Sun?",
    options: ["Combustion with space oxygen", "Solar radiation and solar wind sublimating icy volatile compounds", "Frictional drag against interstellar dust", "Nuclear fission inside the nucleus"],
    correctAnswer: 1,
    explanation: "As a comet nears the Sun, solar radiation vaporizes ice into gas and dust pushed into a tail by solar wind.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-022",
    question: "What nuclear process powers the Sun and all main sequence stars, releasing massive thermal energy?",
    options: ["Nuclear Fission", "Nuclear Fusion (converting hydrogen into helium)", "Chemical combustion", "Radioactive decay"],
    correctAnswer: 1,
    explanation: "Under immense core pressure and temperatures (~15 million Kelvin), hydrogen nuclei fuse into helium via the proton-proton chain.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-023",
    question: "What is the visible outer surface layer of the Sun called from which light radiates?",
    options: ["Corona", "Photosphere", "Chromosphere", "Core"],
    correctAnswer: 1,
    explanation: "The photosphere is the 500-km-deep surface layer of the Sun with an average temperature of about 5,500°C.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-024",
    question: "What is the outermost halo-like atmosphere of the Sun called, visible to the eye only during a total solar eclipse?",
    options: ["Photosphere", "Corona", "Chromosphere", "Convection Zone"],
    correctAnswer: 1,
    explanation: "The solar corona consists of superheated plasma extending millions of kilometers into space at over a million Kelvin.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-025",
    question: "What are the dark, cooler patches observed on the Sun's surface caused by intense localized magnetic fields?",
    options: ["Solar Flares", "Sunspots", "Prominences", "Coronal Mass Ejections"],
    correctAnswer: 1,
    explanation: "Sunspots are regions where strong magnetic flux inhibits convection, cooling the area by ~1,500°C and appearing darker.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-026",
    question: "How long does it take for Earth to complete one full revolution around the Sun?",
    options: ["30 days", "365.25 days (1 year)", "100 days", "24 hours"],
    correctAnswer: 1,
    explanation: "Earth orbits the Sun in approximately 365.242 days, which is why a leap day is added every 4 years.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-027",
    question: "How long does it take for Earth to complete one full rotation on its axis, creating day and night?",
    options: ["12 hours", "24 hours (approx. 23h 56m)", "365 days", "28 days"],
    correctAnswer: 1,
    explanation: "Earth completes one rotation relative to the Sun in 24 hours (solar day), or 23 hours 56 minutes relative to distant stars (sidereal day).",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-028",
    question: "What causes the seasonal changes (spring, summer, autumn, winter) on Earth throughout the year?",
    options: ["Varying distance from the Sun", "The 23.5-degree tilt of Earth's rotational axis", "Solar flare cycles", "Ocean currents"],
    correctAnswer: 1,
    explanation: "Earth's axial tilt of 23.5° causes different hemispheres to lean toward or away from the Sun during its annual orbit.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-029",
    question: "Which two planets in the Solar System have zero natural moons?",
    options: ["Mercury and Venus", "Mars and Venus", "Mercury and Mars", "Earth and Venus"],
    correctAnswer: 0,
    explanation: "Mercury and Venus are the only two planets in our Solar System that do not possess any natural satellites.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-030",
    question: "Which planet is often called Earth's 'Twin' due to its very similar size, mass, and composition?",
    options: ["Mars", "Venus", "Mercury", "Neptune"],
    correctAnswer: 1,
    explanation: "Venus is nearly identical to Earth in diameter (95%) and mass (81%), but has an inhospitable, scorching atmosphere.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-031",
    question: "What is the average distance from the Earth to the Sun called in astronomy?",
    options: ["1 Light-year", "1 Astronomical Unit (AU)", "1 Parsec", "1 Gigameter"],
    correctAnswer: 1,
    explanation: "One Astronomical Unit (AU) is approximately 149.6 million kilometers (93 million miles), the mean Earth-Sun distance.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-032",
    question: "What is the brightest natural object in the Earth's night sky after the Moon?",
    options: ["Jupiter", "Venus", "Sirius", "Mars"],
    correctAnswer: 1,
    explanation: "Venus reflects 70% of sunlight with its thick sulfuric acid cloud decks, outshining all other night sky planets and stars.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-033",
    question: "Why does the same side of the Moon always face toward Earth?",
    options: ["The Moon does not rotate", "Tidal locking synchronizes its rotational period with its orbital period", "Earth's magnetic field locks it in place", "Optical illusion"],
    correctAnswer: 1,
    explanation: "Earth's gravity has tidally locked the Moon, so it takes 27.3 days both to rotate once and to orbit Earth once.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-034",
    question: "What are the dark, smooth basaltic plains visible on the lunar surface called?",
    options: ["Craters", "Lunar maria ('seas')", "Rilles", "Terrae"],
    correctAnswer: 1,
    explanation: "Early astronomers mistook dark basaltic lava flood plains on the Moon for bodies of water, naming them 'maria' (seas).",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-035",
    question: "Which spacecraft became the first human-made object to enter interstellar space in 2012?",
    options: ["Pioneer 10", "Voyager 1", "New Horizons", "Cassini"],
    correctAnswer: 1,
    explanation: "Voyager 1 crossed the heliopause in August 2012 at a distance of over 121 AU from the Sun.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-036",
    question: "Which NASA mission conducted the historic close flyby of Pluto and its moon Charon in July 2015?",
    options: ["Voyager 2", "New Horizons", "Dawn", "Galileo"],
    correctAnswer: 1,
    explanation: "New Horizons returned stunning high-resolution images of Pluto's nitrogen-ice heart (Tombaugh Regio).",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-037",
    question: "Which NASA robotic rover landed on Mars in February 2021 and deployed the Ingenuity helicopter?",
    options: ["Curiosity", "Perseverance", "Spirit", "Opportunity"],
    correctAnswer: 1,
    explanation: "Perseverance landed in Jezero Crater to search for signs of ancient microbial life and cache rock samples.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-038",
    question: "What is the four-planet group of Mercury, Venus, Earth, and Mars collectively referred to as?",
    options: ["Gas Giants", "Terrestrial (Rocky) Planets", "Ice Giants", "Dwarf Planets"],
    correctAnswer: 1,
    explanation: "The four inner terrestrial planets have compact, rocky surfaces composed mainly of silicate rock and metals.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-039",
    question: "What are Jupiter and Saturn primarily categorized as?",
    options: ["Ice Giants", "Gas Giants", "Terrestrial Planets", "Brown Dwarfs"],
    correctAnswer: 1,
    explanation: "Jupiter and Saturn are gas giants composed predominantly of hydrogen and helium without a well-defined solid surface.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-040",
    question: "What are Uranus and Neptune primarily categorized as in modern astronomy?",
    options: ["Gas Giants", "Ice Giants", "Dwarf Planets", "Terrestrial Planets"],
    correctAnswer: 1,
    explanation: "Uranus and Neptune contain heavier volatile elements ('ices' like water, ammonia, and methane) above a small rocky core.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-041",
    question: "How long does it take for the Moon to cycle through all of its phases (from New Moon to New Moon)?",
    options: ["7 days", "14 days", "29.5 days (Synodic month)", "365 days"],
    correctAnswer: 2,
    explanation: "The synodic month (lunar phase cycle) lasts approximately 29.53 days.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-042",
    question: "What is the name of the boundary zone where the solar wind is stopped by the interstellar medium?",
    options: ["Kuiper Belt", "Heliopause", "Oort limit", "Bow shock"],
    correctAnswer: 1,
    explanation: "The heliopause marks the outermost edge of the heliosphere, where the solar wind pressure balances interstellar gas.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-043",
    question: "What is the second largest planet in our solar system?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: 1,
    explanation: "Saturn is second in size only to Jupiter, with an equatorial diameter of about 120,500 km.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-044",
    question: "Which planet has the shortest day (fastest rotational period) in the Solar System, rotating in under 10 hours?",
    options: ["Mercury", "Earth", "Jupiter", "Mars"],
    correctAnswer: 2,
    explanation: "Jupiter rotates once on its axis in roughly 9 hours and 55 minutes, causing a noticeable equatorial bulge.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-045",
    question: "Which planet has the longest day, taking 243 Earth days to complete one single rotation?",
    options: ["Mercury", "Venus", "Mars", "Saturn"],
    correctAnswer: 1,
    explanation: "Venus takes 243 Earth days to rotate once on its axis, longer than its orbital year around the Sun (225 Earth days).",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-046",
    question: "What color is the planet Neptune when observed through telescopes?",
    options: ["Reddish-orange", "Vivid azure blue", "Pale green", "Bright yellow"],
    correctAnswer: 1,
    explanation: "Neptune exhibits a striking deep azure blue color caused by methane absorption of red light in its upper atmosphere.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-047",
    question: "Which planet is famous for having a hexagon-shaped cloud pattern spinning at its north pole?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: 1,
    explanation: "Saturn's north polar hexagon is a persistent jet stream storm discovered by Voyager and imaged closely by Cassini.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-048",
    question: "What is the closest star system to our Solar System?",
    options: ["Sirius", "Alpha Centauri (including Proxima Centauri)", "Barnard's Star", "Betelgeuse"],
    correctAnswer: 1,
    explanation: "Proxima Centauri, part of the Alpha Centauri triple star system, lies about 4.24 light-years from Earth.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-049",
    question: "What percentage of the total mass of the entire Solar System is contained within the Sun alone?",
    options: ["50%", "75%", "90%", "99.8%"],
    correctAnswer: 3,
    explanation: "The Sun contains approximately 99.86% of all the mass in the entire Solar System.",
    difficulty: "easy",
    topic: "Solar System"
  },
  {
    questionId: "sol-050",
    question: "What is the scientific term for the study of the origin, evolution, and eventual fate of the universe?",
    options: ["Astrology", "Cosmology", "Meteorology", "Geodesy"],
    correctAnswer: 1,
    explanation: "Cosmology is the branch of astronomy and physics concerned with the origins, large-scale structures, and evolution of the universe.",
    difficulty: "easy",
    topic: "Solar System"
  }
];

// 8. Periodic Table (50 Questions)
const PERIODIC_TABLE_QUESTIONS = [
  {
    questionId: "pt-001",
    question: "Who is celebrated as the primary creator of the first organized Periodic Table of Elements in 1869?",
    options: ["Antoine Lavoisier", "Dmitri Mendeleev", "John Newlands", "Henry Moseley"],
    correctAnswer: 1,
    explanation: "Russian chemist Dmitri Mendeleev organized elements by increasing atomic mass and predicted properties of yet undiscovered elements.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-002",
    question: "How are chemical elements arranged in the modern periodic table?",
    options: ["Increasing atomic mass", "Increasing atomic number (number of protons)", "Alphabetical order", "Order of discovery"],
    correctAnswer: 1,
    explanation: "Following Henry Moseley's work, modern elements are sequenced strictly by increasing atomic number.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-003",
    question: "What are the horizontal rows on the Periodic Table called?",
    options: ["Groups", "Periods", "Families", "Series"],
    correctAnswer: 1,
    explanation: "The periodic table contains 7 horizontal rows called periods, indicating the highest electron energy level filled.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-004",
    question: "What are the vertical columns on the Periodic Table called?",
    options: ["Periods", "Groups (or Families)", "Blocks", "Tiers"],
    correctAnswer: 1,
    explanation: "Vertical columns are called groups; elements in the same group share identical valence electron configurations and similar chemistry.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-005",
    question: "How many official periods are there in the modern Periodic Table?",
    options: ["5", "7", "8", "10"],
    correctAnswer: 1,
    explanation: "The modern standard periodic table has exactly 7 horizontal periods.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-006",
    question: "How many numbered groups (columns) are in the standard modern Periodic Table?",
    options: ["8", "12", "16", "18"],
    correctAnswer: 3,
    explanation: "The IUPAC periodic table contains 18 numbered vertical groups from alkali metals (Group 1) to noble gases (Group 18).",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-007",
    question: "What is Group 18 of the Periodic Table collectively known as?",
    options: ["Alkali metals", "Halogens", "Noble gases", "Transition metals"],
    correctAnswer: 2,
    explanation: "Group 18 elements (Helium, Neon, Argon, Krypton, Xenon, Radon, Oganesson) have full outer electron shells and are chemically inert.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-008",
    question: "What is Group 1 of the Periodic Table (excluding Hydrogen) called?",
    options: ["Alkaline earth metals", "Alkali metals", "Halogens", "Metalloids"],
    correctAnswer: 1,
    explanation: "Group 1 metals (Lithium, Sodium, Potassium, Rubidium, Cesium, Francium) are highly reactive soft alkali metals.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-009",
    question: "What is Group 2 of the Periodic Table called?",
    options: ["Alkali metals", "Alkaline earth metals", "Transition metals", "Noble gases"],
    correctAnswer: 1,
    explanation: "Group 2 elements (Beryllium, Magnesium, Calcium, Strontium, Barium, Radium) are alkaline earth metals with two valence electrons.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-010",
    question: "What is Group 17 of the Periodic Table called, meaning 'salt-former'?",
    options: ["Noble gases", "Halogens", "Chalcogens", "Pnictogens"],
    correctAnswer: 1,
    explanation: "Halogens (Fluorine, Chlorine, Bromine, Iodine, Astatine) readily react with metals to form ionic salts.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-011",
    question: "What is the lightest chemical element in the entire Periodic Table?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correctAnswer: 1,
    explanation: "Hydrogen ($H$) has an atomic mass of approximately 1.008 amu and atomic number 1.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-012",
    question: "What is the second lightest and second most abundant element in the universe?",
    options: ["Hydrogen", "Helium", "Oxygen", "Nitrogen"],
    correctAnswer: 1,
    explanation: "Helium ($He$, atomic number 2) comprises about 24% of the observable elemental mass in the universe.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-013",
    question: "What is the chemical symbol for Helium?",
    options: ["H", "He", "Hl", "Hm"],
    correctAnswer: 1,
    explanation: "The chemical symbol for Helium is He.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-014",
    question: "What is the chemical symbol for Nitrogen?",
    options: ["Ni", "Na", "N", "Nt"],
    correctAnswer: 2,
    explanation: "Nitrogen has atomic number 7 and is represented by the single letter N.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-015",
    question: "What is the chemical symbol for Carbon?",
    options: ["Ca", "C", "Cr", "Co"],
    correctAnswer: 1,
    explanation: "Carbon is represented by the chemical symbol C.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-016",
    question: "What is the chemical symbol for Calcium?",
    options: ["C", "Ca", "Cl", "Cm"],
    correctAnswer: 1,
    explanation: "Calcium has atomic number 20 and chemical symbol Ca.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-017",
    question: "What is the chemical symbol for Chlorine?",
    options: ["Ch", "Cl", "Cr", "C"],
    correctAnswer: 1,
    explanation: "Chlorine has atomic number 17 and symbol Cl.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-018",
    question: "What is the chemical symbol for Copper?",
    options: ["Co", "Cu", "Cp", "Cr"],
    correctAnswer: 1,
    explanation: "The symbol Cu comes from the Latin word 'Cuprum' (from Cyprus, famous for copper mines).",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-019",
    question: "What is the chemical symbol for Mercury?",
    options: ["Me", "Hg", "Mc", "Hy"],
    correctAnswer: 1,
    explanation: "The symbol Hg comes from Greek 'Hydrargyrum', meaning 'liquid silver' or 'water-silver'.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-020",
    question: "What is the chemical symbol for Potassium?",
    options: ["P", "Po", "K", "Pt"],
    correctAnswer: 2,
    explanation: "Potassium is represented by K, derived from the Neo-Latin word Kalium.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-021",
    question: "What element has the chemical symbol 'P'?",
    options: ["Potassium", "Phosphorus", "Platinum", "Polonium"],
    correctAnswer: 1,
    explanation: "Phosphorus (atomic number 15) has the symbol P.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-022",
    question: "What is the chemical symbol for Tungsten, derived from its German name 'Wolfram'?",
    options: ["Tu", "Tg", "W", "Tn"],
    correctAnswer: 2,
    explanation: "Tungsten uses the symbol W, derived from Wolframite / Wolfram.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-023",
    question: "What element has the highest melting point of any metal (3,422°C), traditionally used in light bulb filaments?",
    options: ["Titanium", "Platinum", "Tungsten (W)", "Osmium"],
    correctAnswer: 2,
    explanation: "Tungsten's exceptionally high melting point of 3,422°C (6,192°F) made it ideal for incandescent filaments.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-024",
    question: "What is the densest naturally occurring element on Earth?",
    options: ["Lead", "Gold", "Osmium", "Uranium"],
    correctAnswer: 2,
    explanation: "Osmium (Os) has a density of 22.59 g/cm³, slightly denser than iridium and nearly twice as dense as lead.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-025",
    question: "What is the lightest solid metal on the Periodic Table?",
    options: ["Aluminum", "Lithium", "Sodium", "Magnesium"],
    correctAnswer: 1,
    explanation: "Lithium ($Li$, atomic number 3) has a density of only 0.534 g/cm³, light enough to float on water or kerosene.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-026",
    question: "What element is the most abundant element in the Earth's crust by mass?",
    options: ["Silicon", "Oxygen", "Iron", "Aluminum"],
    correctAnswer: 1,
    explanation: "Oxygen accounts for about 46.6% of the mass of the Earth's crust, mostly bound as silicate minerals.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-027",
    question: "What is the second most abundant element in the Earth's crust, widely used in semiconductor microchips?",
    options: ["Carbon", "Silicon", "Aluminum", "Germanium"],
    correctAnswer: 1,
    explanation: "Silicon ($Si$) makes up 27.7% of the crust and forms the foundation of modern integrated circuits.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-028",
    question: "What is the most abundant metal in the Earth's crust by mass?",
    options: ["Iron", "Aluminum", "Calcium", "Copper"],
    correctAnswer: 1,
    explanation: "Aluminum is the most abundant metal in the crust (~8.1% of crustal mass), extracted commercially from bauxite ore.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-029",
    question: "What is the most electronegative element on the Periodic Table?",
    options: ["Chlorine", "Oxygen", "Fluorine", "Nitrogen"],
    correctAnswer: 2,
    explanation: "Fluorine has the highest electronegativity rating of 3.98 on the Pauling scale.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-030",
    question: "What are elements that share intermediate properties of both metals and nonmetals called (e.g., Silicon, Boron, Arsenic)?",
    options: ["Halogens", "Metalloids (semimetals)", "Transition metals", "Lanthanides"],
    correctAnswer: 1,
    explanation: "Metalloids possess metallic luster but behave as semiconductors of electricity.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-031",
    question: "Which metallic element is liquid at temperatures just above room temperature and melts in human hand warmth (29.76°C)?",
    options: ["Mercury", "Gallium", "Cesium", "Sodium"],
    correctAnswer: 1,
    explanation: "Gallium ($Ga$) melts at 29.76°C (85.57°F), liquefying when held in a human hand.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-032",
    question: "What radioactive actinide element with atomic number 92 is the primary fuel used in nuclear power stations?",
    options: ["Thorium", "Uranium", "Plutonium", "Radium"],
    correctAnswer: 1,
    explanation: "Uranium ($U$, atomic number 92) possesses the fissile isotope U-235, which sustains controlled nuclear chain reactions.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-033",
    question: "How many known chemical elements currently comprise the completed seven periods of the Periodic Table?",
    options: ["100", "109", "118", "126"],
    correctAnswer: 2,
    explanation: "The Periodic Table currently has 118 verified elements, terminating with element 118, Oganesson ($Og$).",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-034",
    question: "What element has atomic number 118, the heaviest synthetic element in the periodic table?",
    options: ["Tennessine", "Oganesson", "Moscovium", "Livermorium"],
    correctAnswer: 1,
    explanation: "Oganesson ($Og$) is element 118, named after Russian nuclear physicist Yuri Oganessian.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-035",
    question: "What element has atomic number 99 and is named in honor of Albert Einstein?",
    options: ["Mendelevium", "Curium", "Einsteinium", "Nobelium"],
    correctAnswer: 2,
    explanation: "Einsteinium ($Es$, atomic number 99) was discovered in the radioactive debris of the first thermonuclear bomb test in 1952.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-036",
    question: "What element is named after Marie and Pierre Curie?",
    options: ["Curium", "Californium", "Berkelium", "Radium"],
    correctAnswer: 0,
    explanation: "Curium ($Cm$, atomic number 96) was named by Glenn Seaborg's team in honour of Marie and Pierre Curie.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-037",
    question: "What element is named after the inventor of the periodic table, Dmitri Mendeleev?",
    options: ["Meitnerium", "Mendelevium", "Rutherfordium", "Bohrium"],
    correctAnswer: 1,
    explanation: "Mendelevium ($Md$, atomic number 101) honors Dmitri Mendeleev.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-038",
    question: "Which noble gas is radioactive and can seep into basements from the natural decay of uranium in surrounding soil and rock?",
    options: ["Argon", "Krypton", "Radon", "Xenon"],
    correctAnswer: 2,
    explanation: "Radon ($Rn$, atomic number 86) is a naturally occurring colorless radioactive gas and a leading environmental cause of lung cancer.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-039",
    question: "What is the chemical symbol for Uranium?",
    options: ["Ur", "U", "Um", "Un"],
    correctAnswer: 1,
    explanation: "Uranium is designated by the single capital letter U.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-040",
    question: "What is the chemical symbol for Platinum, the precious, corrosion-resistant catalytic metal?",
    options: ["Pl", "Pt", "P", "Pa"],
    correctAnswer: 1,
    explanation: "Platinum has atomic number 78 and chemical symbol Pt.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-041",
    question: "What is the chemical symbol for Magnesium?",
    options: ["Mn", "Mg", "Mo", "Ma"],
    correctAnswer: 1,
    explanation: "Magnesium has atomic number 12 and symbol Mg (while Mn is Manganese).",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-042",
    question: "What is the chemical symbol for Manganese?",
    options: ["Mg", "Mn", "Ma", "Mo"],
    correctAnswer: 1,
    explanation: "Manganese has atomic number 25 and chemical symbol Mn.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-043",
    question: "What is the chemical symbol for Zinc?",
    options: ["Z", "Zn", "Zi", "Zc"],
    correctAnswer: 1,
    explanation: "Zinc has atomic number 30 and symbol Zn.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-044",
    question: "What is the chemical symbol for Iodine, an essential trace element required for thyroid function?",
    options: ["Io", "Id", "I", "In"],
    correctAnswer: 2,
    explanation: "Iodine (atomic number 53) has the chemical symbol I.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-045",
    question: "What element has the chemical symbol 'K'?",
    options: ["Krypton", "Potassium", "Kurchatovium", "Phosphorus"],
    correctAnswer: 1,
    explanation: "The letter K stands for Potassium (Kalium).",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-046",
    question: "What element has the chemical symbol 'Sn'?",
    options: ["Strontium", "Silicon", "Tin", "Scandium"],
    correctAnswer: 2,
    explanation: "Sn stands for Tin (from Latin Stannum).",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-047",
    question: "What element has the chemical symbol 'Sb'?",
    options: ["Selenium", "Antimony", "Samarium", "Scandium"],
    correctAnswer: 1,
    explanation: "Antimony has the symbol Sb from Latin 'Stibium'.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-048",
    question: "What element has the chemical symbol 'Na'?",
    options: ["Nickel", "Sodium", "Nitrogen", "Neon"],
    correctAnswer: 1,
    explanation: "Sodium has the symbol Na from Latin 'Natrium'.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-049",
    question: "What is the two-row block of elements typically set below the main periodic table called?",
    options: ["Transition metals", "Lanthanides and Actinides (Inner Transition Metals)", "Alkali and Alkaline Earth metals", "Noble gases"],
    correctAnswer: 1,
    explanation: "The f-block rows at the bottom consist of the Lanthanide and Actinide series.",
    difficulty: "easy",
    topic: "Periodic Table"
  },
  {
    questionId: "pt-050",
    question: "Which element's isotope, Carbon-14, is widely used in archaeology for radiometric dating of organic remains?",
    options: ["Nitrogen-14", "Carbon-14", "Uranium-238", "Potassium-40"],
    correctAnswer: 1,
    explanation: "Carbon-14 has a half-life of 5,730 years and allows accurate dating of wood, bone, and organic artifacts up to 50,000 years old.",
    difficulty: "easy",
    topic: "Periodic Table"
  }
];

// 9. Famous Scientists (50 Questions)
const FAMOUS_SCIENTISTS_QUESTIONS = [
  {
    questionId: "sci-001",
    question: "Who developed the three fundamental laws of motion and the universal law of gravitation?",
    options: ["Albert Einstein", "Sir Isaac Newton", "Galileo Galilei", "Johannes Kepler"],
    correctAnswer: 1,
    explanation: "Sir Isaac Newton laid the foundation of classical mechanics in his 1687 work 'Philosophiae Naturalis Principia Mathematica'.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-002",
    question: "Which theoretical physicist developed the theory of relativity and won the 1921 Nobel Prize for explaining the photoelectric effect?",
    options: ["Max Planck", "Albert Einstein", "Niels Bohr", "Erwin Schrödinger"],
    correctAnswer: 1,
    explanation: "Albert Einstein fundamentally changed our understanding of space, time, gravity, and quantum physics.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-003",
    question: "Who was the Italian astronomer often called the 'Father of Modern Observational Astronomy' who used a telescope to discover moons around Jupiter?",
    options: ["Nicolaus Copernicus", "Galileo Galilei", "Tycho Brahe", "Giordano Bruno"],
    correctAnswer: 1,
    explanation: "Galileo Galilei discovered the four largest moons of Jupiter, sunspots, and lunar craters, confirming the Copernican heliocentric model.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-004",
    question: "Who was the Polish astronomer who proposed the revolutionary Heliocentric model where Earth and other planets orbit the Sun?",
    options: ["Galileo Galilei", "Nicolaus Copernicus", "Johannes Kepler", "Ptolemy"],
    correctAnswer: 1,
    explanation: "Nicolaus Copernicus published 'De revolutionibus orbium coelestium' in 1543, displacing Earth from the center of the universe.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-005",
    question: "Who formulated the three mathematical laws of planetary motion, showing that planets orbit in ellipses rather than perfect circles?",
    options: ["Galileo Galilei", "Johannes Kepler", "Tycho Brahe", "Isaac Newton"],
    correctAnswer: 1,
    explanation: "Johannes Kepler discovered that planetary orbits are elliptical with the Sun at one focus.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-006",
    question: "Who is the only scientist to have won Nobel Prizes in two different scientific fields (Physics in 1903 and Chemistry in 1911)?",
    options: ["Linus Pauling", "Marie Curie", "John Bardeen", "Frederick Sanger"],
    correctAnswer: 1,
    explanation: "Marie Skłodowska-Curie won the Nobel Prize in Physics for radioactivity research and Chemistry for discovering radium and polonium.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-007",
    question: "Which Serbian-American electrical engineer designed the AC induction motor and developed the modern AC electrical transmission system?",
    options: ["Thomas Edison", "Nikola Tesla", "Guglielmo Marconi", "Alexander Graham Bell"],
    correctAnswer: 1,
    explanation: "Nikola Tesla held over 300 patents that enabled the modern electrical grid and high-frequency alternating current devices.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-008",
    question: "Who was the prolific American inventor who accumulated 1,093 US patents, including the phonograph and motion picture camera?",
    options: ["Nikola Tesla", "Thomas Edison", "Henry Ford", "Alexander Graham Bell"],
    correctAnswer: 1,
    explanation: "Thomas Alva Edison established the world's first industrial research laboratory at Menlo Park, New Jersey.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-009",
    question: "Who discovered the first antibiotic, Penicillin, saving hundreds of millions of lives from bacterial infections?",
    options: ["Louis Pasteur", "Alexander Fleming", "Edward Jenner", "Robert Koch"],
    correctAnswer: 1,
    explanation: "Sir Alexander Fleming made the serendipitous discovery of antibacterial penicillin mold at St. Mary's Hospital in London in 1928.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-010",
    question: "Who is known as the 'Father of Microbiology' for developing vaccines for rabies and discovering the process of pasteurization?",
    options: ["Robert Koch", "Louis Pasteur", "Antonie van Leeuwenhoek", "Joseph Lister"],
    correctAnswer: 1,
    explanation: "Louis Pasteur disproved spontaneous generation and proved the germ theory of disease.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-011",
    question: "Who developed the smallpox vaccine in 1796, pioneering the field of immunology and leading to the global eradication of smallpox?",
    options: ["Louis Pasteur", "Edward Jenner", "Jonas Salk", "Albert Sabin"],
    correctAnswer: 1,
    explanation: "Edward Jenner inoculated James Phipps with cowpox, demonstrating immunity against smallpox.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-012",
    question: "Who discovered the laws of genetic inheritance through eight years of breeding experiments with pea plants?",
    options: ["Charles Darwin", "Gregor Mendel", "Thomas Hunt Morgan", "Alfred Russel Wallace"],
    correctAnswer: 1,
    explanation: "Gregor Mendel established the fundamental laws of segregation and independent assortment.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-013",
    question: "Who authored 'On the Origin of Species' in 1859, proposing the theory of evolution by natural selection?",
    options: ["Gregor Mendel", "Charles Darwin", "Jean-Baptiste Lamarck", "Thomas Malthus"],
    correctAnswer: 1,
    explanation: "Charles Darwin's observations aboard HMS Beagle, especially in the Galápagos Islands, led to his theory of natural selection.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-014",
    question: "Who were the two scientists who deduced the double-helix structure of DNA at Cambridge in 1953?",
    options: ["Charles Darwin and Gregor Mendel", "James Watson and Francis Crick", "Louis Pasteur and Robert Koch", "Linus Pauling and George Beadle"],
    correctAnswer: 1,
    explanation: "James Watson and Francis Crick solved the structural model of DNA using crucial X-ray diffraction data from Rosalind Franklin.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-015",
    question: "Which British biophysicist captured Photo 51, the critical X-ray diffraction image demonstrating the double-helix geometry of DNA?",
    options: ["Ada Lovelace", "Rosalind Franklin", "Dorothy Hodgkin", "Lise Meitner"],
    correctAnswer: 1,
    explanation: "Rosalind Franklin's superb X-ray crystallographic photo of B-DNA provided the vital experimental evidence for the double-helix structure.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-016",
    question: "Who was the Danish physicist who developed the planetary model of the atom with quantized electron energy levels?",
    options: ["Ernest Rutherford", "Niels Bohr", "J.J. Thomson", "Werner Heisenberg"],
    correctAnswer: 1,
    explanation: "Niels Bohr proposed that electrons travel in discrete stable orbits without radiating energy, winning the 1922 Nobel Prize.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-017",
    question: "Who is known as the 'Father of Nuclear Physics' after discovering the atomic nucleus through his famous gold foil experiment?",
    options: ["Niels Bohr", "Ernest Rutherford", "J.J. Thomson", "James Chadwick"],
    correctAnswer: 1,
    explanation: "Ernest Rutherford's alpha particle scattering experiment proved that positive charge and mass are concentrated in a tiny central nucleus.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-018",
    question: "Who discovered the negatively charged electron in 1897 using cathode ray tubes?",
    options: ["Ernest Rutherford", "J.J. Thomson", "James Chadwick", "John Dalton"],
    correctAnswer: 1,
    explanation: "Sir J.J. Thomson discovered the first subatomic particle (the electron) and proposed the plum pudding atomic model.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-019",
    question: "Who discovered the neutron inside the atomic nucleus in 1932, winning the 1935 Nobel Prize in Physics?",
    options: ["Ernest Rutherford", "James Chadwick", "Niels Bohr", "Enrico Fermi"],
    correctAnswer: 1,
    explanation: "Sir James Chadwick discovered the uncharged neutron, completing the fundamental tri-particle picture of the atom.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-020",
    question: "Who is considered the 'Father of Modern Chemistry' for formulating the law of conservation of mass and naming oxygen and hydrogen?",
    options: ["Robert Boyle", "Antoine Lavoisier", "John Dalton", "Joseph Priestley"],
    correctAnswer: 1,
    explanation: "Antoine Lavoisier proved that combustion is oxidation, debunked the phlogiston theory, and standardized chemical nomenclature.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-021",
    question: "Who formulated the first modern atomic theory in 1803, stating that all matter is composed of indivisible atoms?",
    options: ["Robert Boyle", "John Dalton", "Antoine Lavoisier", "Amadeo Avogadro"],
    correctAnswer: 1,
    explanation: "English schoolteacher John Dalton proposed that chemical elements consist of characteristic identical atoms that combine in whole-number ratios.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-022",
    question: "Who created the first periodic table of elements, successfully predicting the properties of undiscovered elements like gallium and germanium?",
    options: ["Dmitri Mendeleev", "Henry Moseley", "Lothar Meyer", "John Newlands"],
    correctAnswer: 0,
    explanation: "Dmitri Mendeleev arranged the known 63 elements by atomic weight and periodic periodicity in 1869.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-023",
    question: "Which English physicist and chemist discovered electromagnetic induction, invented the electric motor and transformer, and introduced the terms anode, cathode, and electrode?",
    options: ["James Clerk Maxwell", "Michael Faraday", "Andre-Marie Ampere", "Heinrich Hertz"],
    correctAnswer: 1,
    explanation: "Michael Faraday was one of the most prolific experimental scientists in history despite having little formal schooling.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-024",
    question: "Which Scottish mathematical physicist published the unified equations of electromagnetism proving light is an electromagnetic wave?",
    options: ["Michael Faraday", "James Clerk Maxwell", "Lord Kelvin", "Isaac Newton"],
    correctAnswer: 1,
    explanation: "James Clerk Maxwell unified electricity, magnetism, and optics into four classical partial differential equations.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-025",
    question: "Who was the German theoretical physicist considered the originator of quantum theory, introducing Planck's constant ($h$)?",
    options: ["Albert Einstein", "Max Planck", "Werner Heisenberg", "Erwin Schrödinger"],
    correctAnswer: 1,
    explanation: "Max Planck resolved the ultraviolet catastrophe by proposing that energy is emitted in discrete packets called quanta ($E = h\\nu$).",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-026",
    question: "Who formulated the Uncertainty Principle, which states that one cannot simultaneously know the exact position and momentum of a particle?",
    options: ["Max Planck", "Werner Heisenberg", "Niels Bohr", "Louis de Broglie"],
    correctAnswer: 1,
    explanation: "Werner Heisenberg introduced the fundamental quantum uncertainty principle ($\Delta x \cdot \Delta p \ge \hbar/2$) in 1927.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-027",
    question: "Which Austrian theoretical physicist formulated the wave equation for quantum mechanics and proposed a famous cat thought experiment?",
    options: ["Werner Heisenberg", "Erwin Schrödinger", "Paul Dirac", "Wolfgang Pauli"],
    correctAnswer: 1,
    explanation: "Erwin Schrödinger developed wave mechanics and formulated the Schrödinger's cat paradox illustrating quantum superposition.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-028",
    question: "Who is celebrated as the 'Father of Indian Space Program' and founder of ISRO?",
    options: ["Dr. Homi Bhabha", "Dr. Vikram Sarabhai", "Dr. A.P.J. Abdul Kalam", "Prof. Satish Dhawan"],
    correctAnswer: 1,
    explanation: "Dr. Vikram Sarabhai convinced the Indian government of the importance of a space program and spearheaded INCOSPAR / ISRO.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-029",
    question: "Who is known as the 'Father of the Indian Nuclear Program' and founder of the Tata Institute of Fundamental Research (TIFR)?",
    options: ["Dr. Vikram Sarabhai", "Dr. Homi Jehangir Bhabha", "Dr. C.V. Raman", "Dr. Raja Ramanna"],
    correctAnswer: 1,
    explanation: "Dr. Homi Bhabha laid the architectural foundation for India's 3-stage nuclear power program.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-030",
    question: "Which Indian physicist won the 1930 Nobel Prize in Physics for discovering the scattering of light that bears his name?",
    options: ["Satyendra Nath Bose", "Sir C.V. Raman", "Meghnad Saha", "Subrahmanyan Chandrasekhar"],
    correctAnswer: 1,
    explanation: "Sir C.V. Raman discovered the Raman Effect on February 28, 1928, celebrated annually in India as National Science Day.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-031",
    question: "Which Indian-American astrophysicist won the 1983 Nobel Prize for determining the maximum mass limit (~1.4 solar masses) of a stable white dwarf star?",
    options: ["C.V. Raman", "Subrahmanyan Chandrasekhar", "S.N. Bose", "Jayant Narlikar"],
    correctAnswer: 1,
    explanation: "Subrahmanyan Chandrasekhar calculated the 'Chandrasekhar Limit' above which a dying star must collapse into a neutron star or black hole.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-032",
    question: "Which Indian astrophysicist developed the thermal ionization equation used to interpret stellar spectral classifications?",
    options: ["Homi Bhabha", "Meghnad Saha", "C.V. Raman", "J.C. Bose"],
    correctAnswer: 1,
    explanation: "The Saha Ionization Equation (1920) relates a star's temperature and pressure to the ionization states of its chemical elements.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-033",
    question: "Who was the theoretical physicist and director of the Manhattan Project's Los Alamos Laboratory, often called the 'Father of the Atomic Bomb'?",
    options: ["Enrico Fermi", "J. Robert Oppenheimer", "Richard Feynman", "Edward Teller"],
    correctAnswer: 1,
    explanation: "J. Robert Oppenheimer led the scientific team that developed the first nuclear weapons during World War II.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-034",
    question: "Which Italian-American physicist built the world's first artificial nuclear reactor (Chicago Pile-1) in 1942?",
    options: ["Robert Oppenheimer", "Enrico Fermi", "Niels Bohr", "Leo Szilard"],
    correctAnswer: 1,
    explanation: "Enrico Fermi achieved the first self-sustaining controlled nuclear chain reaction under the University of Chicago football stadium.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-035",
    question: "Who was the renowned cosmologist who showed that black holes emit thermal radiation (now called Hawking radiation)?",
    options: ["Carl Sagan", "Stephen Hawking", "Roger Penrose", "Kip Thorne"],
    correctAnswer: 1,
    explanation: "Stephen Hawking combined quantum mechanics with general relativity to prove black holes slowly radiate energy and evaporate.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-036",
    question: "Which American astronomer confirmed the existence of galaxies outside our Milky Way and proved the universe is expanding?",
    options: ["Carl Sagan", "Edwin Hubble", "Harlow Shapley", "George Gamow"],
    correctAnswer: 1,
    explanation: "Edwin Hubble used the Hooker telescope at Mount Wilson to measure Cepheid variables in Andromeda, proving it is a separate galaxy.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-037",
    question: "Which American astronomer and science communicator hosted the legendary 1980 television series 'Cosmos: A Personal Voyage'?",
    options: ["Neil deGrasse Tyson", "Carl Sagan", "Stephen Hawking", "Bill Nye"],
    correctAnswer: 1,
    explanation: "Carl Sagan inspired millions worldwide with his lyrical advocacy of scientific skepticism and space exploration.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-038",
    question: "Who invented the modern polio vaccine that virtually eradicated epidemic infantile paralysis worldwide?",
    options: ["Edward Jenner", "Jonas Salk", "Louis Pasteur", "Alexander Fleming"],
    correctAnswer: 1,
    explanation: "Dr. Jonas Salk developed the injectable inactivated polio vaccine in 1953, famously refusing to patent it so it could benefit humanity.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-039",
    question: "Who developed the oral polio vaccine (OPV) using attenuated live virus that became the primary tool for global eradication?",
    options: ["Jonas Salk", "Albert Sabin", "Alexander Fleming", "Paul Ehrlich"],
    correctAnswer: 1,
    explanation: "Dr. Albert Sabin developed the easily administered oral polio sugar-cube drop vaccine in the late 1950s.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-040",
    question: "Who was the British mathematician, cryptanalyst, and computer scientist who cracked the German Enigma code during World War II?",
    options: ["Charles Babbage", "Alan Turing", "John von Neumann", "Claude Shannon"],
    correctAnswer: 1,
    explanation: "Alan Turing designed the Bombe machines at Bletchley Park, formulated the Turing Machine, and established modern computer science.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-041",
    question: "Who was the Hungarian-American mathematician who pioneered digital computer architecture (CPU, memory, ALU), game theory, and cellular automata?",
    options: ["Alan Turing", "John von Neumann", "Norbert Wiener", "Kurt Gödel"],
    correctAnswer: 1,
    explanation: "John von Neumann created the stored-program computer architecture upon which virtually all modern computers operate.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-042",
    question: "Who is known as the 'Father of Modern Surgery' for introducing carbolic acid (phenol) antiseptic techniques in hospitals?",
    options: ["Edward Jenner", "Joseph Lister", "William Harvey", "Ignaz Semmelweis"],
    correctAnswer: 1,
    explanation: "Sir Joseph Lister applied Pasteur's germ theory to surgery, drastically reducing post-operative surgical gangrene and sepsis.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-043",
    question: "Who discovered that blood circulates continuously in one direction throughout the human body propelled by the heart as a pump?",
    options: ["Claudius Galen", "William Harvey", "Andreas Vesalius", "Hippocrates"],
    correctAnswer: 1,
    explanation: "English physician William Harvey published his groundbreaking treatise 'De Motu Cordis' in 1628.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-044",
    question: "Who is widely revered as the 'Father of Medicine' and author of the ancient ethical oath taken by physicians?",
    options: ["Galen", "Hippocrates", "Aristotle", "Socrates"],
    correctAnswer: 1,
    explanation: "Ancient Greek physician Hippocrates established medicine as a distinct profession based on observation rather than superstition.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-045",
    question: "Which Dutch scientist is known as the 'Father of Microbiology' for grinding his own precision lenses and discovering microscopic protozoa and bacteria?",
    options: ["Robert Hooke", "Antonie van Leeuwenhoek", "Christiaan Huygens", "Zacharias Janssen"],
    correctAnswer: 1,
    explanation: "Antonie van Leeuwenhoek was the first person to observe and describe single-celled organisms, which he called animalcules.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-046",
    question: "Which German scientist discovered X-radiation in 1895, taking the first X-ray image of his wife's hand?",
    options: ["Henri Becquerel", "Wilhelm Röntgen", "Max Planck", "Heinrich Hertz"],
    correctAnswer: 1,
    explanation: "Wilhelm Conrad Röntgen discovered X-rays while experimenting with Lenard tubes, winning the very first Nobel Prize in Physics in 1901.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-047",
    question: "Who discovered natural radioactivity in uranium salts in 1896, sharing the 1903 Nobel Prize with Marie and Pierre Curie?",
    options: ["Ernest Rutherford", "Henri Becquerel", "Wilhelm Röntgen", "J.J. Thomson"],
    correctAnswer: 1,
    explanation: "Henri Becquerel discovered that uranium crystals spontaneously darkened photographic plates even when wrapped in black paper.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-048",
    question: "Who was the American theoretical physicist celebrated for his quantum electrodynamics diagrams, charismatic teaching, and bongo drumming?",
    options: ["Murray Gell-Mann", "Richard Feynman", "Carl Sagan", "J. Robert Oppenheimer"],
    correctAnswer: 1,
    explanation: "Richard Feynman won the 1965 Nobel Prize in Physics for quantum electrodynamics and popularized physics through books and lectures.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-049",
    question: "Which British scientist proposed the existence of a scalar boson field that imparts mass to fundamental particles, verified at CERN in 2012?",
    options: ["Stephen Hawking", "Peter Higgs", "Paul Dirac", "Roger Penrose"],
    correctAnswer: 1,
    explanation: "Peter Higgs predicted the Higgs boson in 1964, which was discovered at the Large Hadron Collider in 2012.",
    difficulty: "easy",
    topic: "Famous Scientists"
  },
  {
    questionId: "sci-050",
    question: "Who was the Greek mathematician and inventor who famously shouted 'Eureka!' after discovering the principle of buoyancy in his bath?",
    options: ["Pythagoras", "Archimedes of Syracuse", "Euclid", "Eratosthenes"],
    correctAnswer: 1,
    explanation: "Archimedes realized that the volume of water displaced equaled the volume of his submerged body, formulating his buoyancy principle.",
    difficulty: "easy",
    topic: "Famous Scientists"
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
    'biology-basics',
    'Biology Basics',
    'biology.json',
    BIOLOGY_BASICS_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'solar-system',
    'Solar System',
    'solar-system.json',
    SOLAR_SYSTEM_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'periodic-table',
    'Periodic Table',
    'periodic-table.json',
    PERIODIC_TABLE_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'famous-scientists',
    'Famous Scientists',
    'famous-scientists.json',
    FAMOUS_SCIENTISTS_QUESTIONS
  );

  await mongoose.disconnect();
  console.log('🎉 Category 5 (Science & Space) Part 2 completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error in Category 5 Part 2 seeding:', err);
  process.exit(1);
});
