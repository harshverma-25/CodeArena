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

// 8. Guess the Movie (50 questions)
const guessMovieQuestions: Question[] = [
  {
    questionId: "gtm-001",
    question: "A young boy befriends an eccentric DeLorean-driving scientist and travels back to 1955. Which movie is it?",
    options: ["Back to the Future", "The Terminator", "Ghostbusters", "Bill & Ted's Excellent Adventure"],
    correctAnswer: 0,
    explanation: "Back to the Future (1985) features Marty McFly and Doc Brown in their flux capacitor-powered time machine.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-002",
    question: "A criminal infiltrates targets' subconscious dreams to perform an 'inception'. Which movie is it?",
    options: ["Shutter Island", "Inception", "Interstellar", "Tenet"],
    correctAnswer: 1,
    explanation: "Christopher Nolan's Inception (2010) follows Dom Cobb pulling off dream heists.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-003",
    question: "A luxury ocean liner strikes an iceberg in the North Atlantic on its maiden voyage in 1912. Which movie is it?",
    options: ["The Poseidon Adventure", "Titanic", "Life of Pi", "Dunkirk"],
    correctAnswer: 1,
    explanation: "James Cameron's Titanic (1997) chronicles the tragic romance between Jack and Rose.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-004",
    question: "A computer hacker named Neo learns reality is a simulation created by sentient machines. Which movie is it?",
    options: ["The Matrix", "TRON", "Blade Runner", "I, Robot"],
    correctAnswer: 0,
    explanation: "The Matrix (1999) stars Keanu Reeves as the Chosen One Neo.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-005",
    question: "A young lion cub flees his kingdom after his father is killed by his villainous uncle Scar. Which movie is it?",
    options: ["The Lion King", "Madagascar", "Tarzan", "The Jungle Book"],
    correctAnswer: 0,
    explanation: "Disney's The Lion King (1994) tells the epic journey of Simba reclaiming the Pride Lands.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-006",
    question: "An eight-year-old boy accidentally left behind by his vacationing family defends his suburban home from two burglars. Which movie is it?",
    options: ["Home Alone", "Dennis the Menace", "Baby's Day Out", "Problem Child"],
    correctAnswer: 0,
    explanation: "Home Alone (1990) follows Kevin McCallister outsmarting the Wet Bandits.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-007",
    question: "An archaeologist adventurer with a whip, fedora, and fear of snakes hunts for the lost Ark of the Covenant. Which movie is it?",
    options: ["Raiders of the Lost Ark", "The Mummy", "National Treasure", "Tomb Raider"],
    correctAnswer: 0,
    explanation: "Raiders of the Lost Ark (1981) introduced Harrison Ford as Indiana Jones.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-008",
    question: "A quiet, gentle Alabama man with an IQ of 75 inadvertently witnesses and influences defining events of the 20th century. Which movie is it?",
    options: ["Rain Man", "Forrest Gump", "The Green Mile", "Cast Away"],
    correctAnswer: 1,
    explanation: "Tom Hanks portrays Forrest Gump in the 1994 Oscar-winning classic.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-009",
    question: "A corrupt Roman emperor murders a victorious general's family, reducing him to a vengeful arena gladiator. Which movie is it?",
    options: ["Gladiator", "Spartacus", "Ben-Hur", "300"],
    correctAnswer: 0,
    explanation: "Russell Crowe stars as Maximus Decimus Meridius in Ridley Scott's Gladiator (2000).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-010",
    question: "A paraplegic marine is dispatched to the alien moon Pandora and falls in love with a tall blue Na'vi native. Which movie is it?",
    options: ["Avatar", "John Carter", "Dune", "Interstellar"],
    correctAnswer: 0,
    explanation: "James Cameron's Avatar (2009) revolutionized 3D cinema on the lush world of Pandora.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-011",
    question: "A team of astronauts travels through a wormhole near Saturn searching for a new habitable home for starving humanity. Which movie is it?",
    options: ["The Martian", "Gravity", "Interstellar", "Ad Astra"],
    correctAnswer: 2,
    explanation: "Interstellar (2014) follows Cooper through Gargantua's black hole and gravitational time dilation.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-012",
    question: "Two bickering FBI agents disguised as wealthy white debutantes infiltrate the high-society Hamptons scene. Which movie is it?",
    options: ["White Chicks", "Bad Boys", "Rush Hour", "Miss Congeniality"],
    correctAnswer: 0,
    explanation: "The Wayans brothers star in the 2004 cult comedy White Chicks.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-013",
    question: "An insomniac office worker meets a charismatic soap salesman and starts an underground bare-knuckle fighting club. Which movie is it?",
    options: ["Fight Club", "American Psycho", "Se7en", "Memento"],
    correctAnswer: 0,
    explanation: "Fight Club (1999) features Brad Pitt as Tyler Durden and Edward Norton.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-014",
    question: "A retired hitman seeks brutal vengeance across New York after Russian mobsters kill his puppy left by his late wife. Which movie is it?",
    options: ["John Wick", "The Equalizer", "Taken", "Nobody"],
    correctAnswer: 0,
    explanation: "Keanu Reeves stars as the Baba Yaga assassin John Wick.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-015",
    question: "A clownfish father crosses the vast Australian ocean alongside a forgetful blue tang to rescue his captured son. Which movie is it?",
    options: ["Finding Nemo", "Shark Tale", "A Turtle's Tale", "The Little Mermaid"],
    correctAnswer: 0,
    explanation: "Finding Nemo (2003) follows Marlin and Dory traveling to 42 Wallaby Way, Sydney.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-016",
    question: "Genetically engineered dinosaurs escape their enclosures on Isla Nublar during a tropical storm. Which movie is it?",
    options: ["Jurassic Park", "King Kong", "The Lost World", "Godzilla"],
    correctAnswer: 0,
    explanation: "Steven Spielberg's Jurassic Park (1993) brought prehistoric dinosaurs to life.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-017",
    question: "A young hobbit inherits an evil golden ring and journeys to Mount Doom to destroy it in the fires where it was forged. Which movie is it?",
    options: ["The Lord of the Rings: The Fellowship of the Ring", "The Chronicles of Narnia", "Harry Potter", "Eragon"],
    correctAnswer: 0,
    explanation: "Peter Jackson's The Lord of the Rings trilogy chronicles Frodo Baggins' epic quest across Middle-earth.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-018",
    question: "An orphaned boy with a lightning bolt scar discovers on his eleventh birthday that he is a wizard. Which movie is it?",
    options: ["Harry Potter and the Sorcerer's Stone", "Percy Jackson", "The Golden Compass", "Fantastic Beasts"],
    correctAnswer: 0,
    explanation: "The first installment in the Harry Potter cinematic series introduces Hogwarts School of Witchcraft and Wizardry.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-019",
    question: "A cyborg assassin disguised as a human is sent back in time from 2029 to 1984 to terminate Sarah Connor. Which movie is it?",
    options: ["The Terminator", "RoboCop", "Predator", "Total Recall"],
    correctAnswer: 0,
    explanation: "Arnold Schwarzenegger stars as the Cyberdyne Systems Model 101 in James Cameron's The Terminator.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-020",
    question: "A young girl named Chihiro wanders into an abandoned spirit amusement park where her parents turn into pigs. Which movie is it?",
    options: ["Spirited Away", "My Neighbor Totoro", "Princess Mononoke", "Howl's Moving Castle"],
    correctAnswer: 0,
    explanation: "Hayao Miyazaki's Oscar-winning Ghibli masterpiece Spirited Away (2001).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-021",
    question: "A teenage girl enters a deadly televised competition in Panem where 24 adolescents fight to the death. Which movie is it?",
    options: ["The Hunger Games", "Divergent", "The Maze Runner", "The Giver"],
    correctAnswer: 0,
    explanation: "Katniss Everdeen volunteers as tribute in District 12 in The Hunger Games (2012).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-022",
    question: "A stranded astronaut relies on his botanical knowledge to grow potatoes on Mars while awaiting rescue. Which movie is it?",
    options: ["The Martian", "Apollo 13", "Gravity", "First Man"],
    correctAnswer: 0,
    explanation: "Matt Damon plays astronaut botanist Mark Watney in Ridley Scott's The Martian (2015).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-023",
    question: "An eccentric candy manufacturer invites five children holding Golden Tickets for a guided tour of his confectionery factory. Which movie is it?",
    options: ["Willy Wonka & the Chocolate Factory", "Chocolat", "The Grand Budapest Hotel", "Paddington 2"],
    correctAnswer: 0,
    explanation: "Roald Dahl's classic adapted into Willy Wonka & the Chocolate Factory and Charlie and the Chocolate Factory.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-024",
    question: "A corrupt prison banker serves two consecutive life sentences and plots a meticulous 19-year tunnel escape using a small rock hammer. Which movie is it?",
    options: ["The Shawshank Redemption", "The Green Mile", "Escape from Alcatraz", "Papillon"],
    correctAnswer: 0,
    explanation: "Tim Robbins stars as Andy Dufresne in Frank Darabont's The Shawshank Redemption (1994).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-025",
    question: "A brilliant young math prodigy working as an MIT janitor solves an uncrackable blackboard problem while avoiding emotional intimacy. Which movie is it?",
    options: ["Good Will Hunting", "A Beautiful Mind", "The Theory of Everything", "The Imitation Game"],
    correctAnswer: 0,
    explanation: "Matt Damon and Robin Williams star in the Oscar-winning Good Will Hunting (1997).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-026",
    question: "A New York cop visits his estranged wife in Los Angeles on Christmas Eve only to find her skyscraper overtaken by German terrorists. Which movie is it?",
    options: ["Die Hard", "Lethal Weapon", "Speed", "Point Break"],
    correctAnswer: 0,
    explanation: "Bruce Willis plays John McClane trapped inside Nakatomi Plaza in Die Hard (1988).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-027",
    question: "A bomb on a Los Angeles city transit bus is rigged to explode if the speedometer drops below 50 miles per hour. Which movie is it?",
    options: ["Speed", "Die Hard with a Vengeance", "The Taking of Pelham 123", "Unstoppable"],
    correctAnswer: 0,
    explanation: "Keanu Reeves and Sandra Bullock star in the 1994 adrenaline-fueled thriller Speed.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-028",
    question: "A criminal mastermind uses elaborate physical torture contraptions and audio cassette tapes to test victims' will to live. Which movie is it?",
    options: ["Saw", "Hostel", "The Texas Chain Saw Massacre", "Insidious"],
    correctAnswer: 0,
    explanation: "The Jigsaw killer tests victims with moral life-or-death engineering traps in Saw (2004).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-029",
    question: "A luxury hotel in Colorado drives an isolated caretaker into violent madness during a brutal winter blizzard. Which movie is it?",
    options: ["The Shining", "Psycho", "Misery", "The Haunting"],
    correctAnswer: 0,
    explanation: "Stanley Kubrick's The Shining (1980) features Jack Nicholson as Jack Torrance at the Overlook Hotel.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-030",
    question: "An impoverished South Korean family schemes their way into employment under an affluent household through deceit. Which movie is it?",
    options: ["Parasite", "The Handmaiden", "Oldboy", "Memories of Murder"],
    correctAnswer: 0,
    explanation: "Bong Joon-ho's Parasite (2019) became the first non-English film to win Best Picture at the Academy Awards.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-031",
    question: "A French chef rat named Remy teams up with an awkward garbage boy to prepare exquisite dishes in a prestigious Paris restaurant. Which movie is it?",
    options: ["Ratatouille", "The Chef", "Julie & Julia", "Flushed Away"],
    correctAnswer: 0,
    explanation: "Pixar's Ratatouille (2007) proves that 'anyone can cook'.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-032",
    question: "Three friends wake up in Las Vegas after a wild bachelor party with no memory, a missing groom, and a Bengal tiger in their bathroom. Which movie is it?",
    options: ["The Hangover", "Old School", "Due Date", "Wedding Crashers"],
    correctAnswer: 0,
    explanation: "The Hangover (2009) follows the Wolfpack retracing their crazy Vegas night.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-033",
    question: "A wealthy quadriplegic aristocrat hires a street-smart parolee from the Paris banlieues to be his caregiver. Which movie is it?",
    options: ["The Intouchables", "The Upside", "Me Before You", "Amelie"],
    correctAnswer: 0,
    explanation: "The French smash hit The Intouchables (2011) stars Francois Cluzet and Omar Sy.",
    difficulty: "medium"
  },
  {
    questionId: "gtm-034",
    question: "An Indian wrestling coach trains his two teenage daughters to overcome gender stereotypes and win gold at the Commonwealth Games. Which movie is it?",
    options: ["Dangal", "Sultan", "Chak De! India", "Mary Kom"],
    correctAnswer: 0,
    explanation: "Aamir Khan stars as Mahavir Singh Phogat in Dangal (2016).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-035",
    question: "Three engineering students at the prestigious Imperial College of Engineering navigate academic pressure and their eccentric friend Rancho. Which movie is it?",
    options: ["3 Idiots", "Taare Zameen Par", "Chhichhore", "Super 30"],
    correctAnswer: 0,
    explanation: "Rajkumar Hirani's 3 Idiots (2009) is one of the highest-rated Indian blockbusters worldwide.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-036",
    question: "An exiled prince seeks to clear his name after his ruthless uncle kills his father to seize the throne of Mahishmati. Which movie is it?",
    options: ["Baahubali: The Beginning", "RRR", "K.G.F", "Pushpa"],
    correctAnswer: 0,
    explanation: "S.S. Rajamouli's record-breaking visual epic Baahubali stars Prabhas.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-037",
    question: "Two Indian revolutionaries in the 1920s—one fire, one water—forge an alliance against the British colonial empire. Which movie is it?",
    options: ["RRR", "Lagaan", "Mangal Pandey", "Sardar Udham"],
    correctAnswer: 0,
    explanation: "S.S. Rajamouli's RRR (2022) features the Oscar-winning song 'Naatu Naatu'.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-038",
    question: "A poor young man from Mumbai's Dharavi slums participates in the Hindi version of 'Who Wants to Be a Millionaire?'. Which movie is it?",
    options: ["Slumdog Millionaire", "Lion", "Salaam Bombay!", "Gully Boy"],
    correctAnswer: 0,
    explanation: "Danny Boyle's Slumdog Millionaire (2008) won 8 Academy Awards including Best Picture.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-039",
    question: "Villagers in colonial India wager three years of oppressive agricultural taxes on a game of cricket against British officers. Which movie is it?",
    options: ["Lagaan: Once Upon a Time in India", "Chak De! India", "83", "MS Dhoni: The Untold Story"],
    correctAnswer: 0,
    explanation: "Aamir Khan's Oscar-nominated Lagaan (2001) is a cinematic masterpiece of sport and freedom.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-040",
    question: "A disgraced former Indian hockey captain returns to coach the underdog Indian national women's team to World Cup glory. Which movie is it?",
    options: ["Chak De! India", "Gold", "Soorma", "Dangal"],
    correctAnswer: 0,
    explanation: "Shah Rukh Khan stars as Kabir Khan in the beloved sports drama Chak De! India (2007).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-041",
    question: "A mute young Pakistani girl gets separated from her mother in Delhi and is protected by a devout Hanuman devotee. Which movie is it?",
    options: ["Bajrangi Bhaijaan", "Tubelight", "My Name Is Khan", "Sultan"],
    correctAnswer: 0,
    explanation: "Salman Khan plays Pavan in the heartfelt cross-border blockbuster Bajrangi Bhaijaan (2015).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-042",
    question: "A family covers up an accidental murder by fabricating an airtight alibi on October 2nd and 3rd at a religious retreat. Which movie is it?",
    options: ["Drishyam", "Andhadhun", "Kahaani", "Talaash"],
    correctAnswer: 0,
    explanation: "Drishyam follows Vijay Salgaonkar protecting his family using clever movie knowledge.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-043",
    question: "A blind pianist gets entangled in a web of murders and deception after witnessing a crime inside a famous actor's apartment. Which movie is it?",
    options: ["Andhadhun", "Badlapur", "Monica, O My Darling", "Article 15"],
    correctAnswer: 0,
    explanation: "Ayushmann Khurrana and Tabu star in Sriram Raghavan's thriller Andhadhun (2018).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-044",
    question: "A young girl in rural Karnataka journeys to a gold mine to uncover her destiny as the lover of a fiery gangster named Rocky. Which movie is it?",
    options: ["K.G.F: Chapter 1 & 2", "Kantara", "Vikram", "Pushpa"],
    correctAnswer: 0,
    explanation: "Yash stars as Rocky Bhai dominating the Kolar Gold Fields in K.G.F.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-045",
    question: "A tribal man possessed by the demigod Panjurli defends his ancestral forest from greedy royal landowners in coastal Karnataka. Which movie is it?",
    options: ["Kantara", "Tumbbad", "Bhoomi", "Virupaksha"],
    correctAnswer: 0,
    explanation: "Rishab Shetty directed and starred in the cultural folklore blockbuster Kantara (2022).",
    difficulty: "medium"
  },
  {
    questionId: "gtm-046",
    question: "Three generations of a greedy family worship a cursed demon god named Hastar inside a dark decaying mansion to harvest endless gold. Which movie is it?",
    options: ["Tumbbad", "Pari", "Stree", "Bhoot"],
    correctAnswer: 0,
    explanation: "Tumbbad (2018) is an atmospheric mythological horror film revolving around the womb of goddess earth.",
    difficulty: "medium"
  },
  {
    questionId: "gtm-047",
    question: "A small town is haunted during an annual four-day festival by a female spirit who only abducts solitary men at night. Which movie is it?",
    options: ["Stree", "Bhediya", "Roohi", "Bhool Bhulaiyaa"],
    correctAnswer: 0,
    explanation: "Rajkummar Rao and Shraddha Kapoor star in the horror comedy Stree ('O Stree Kal Aana').",
    difficulty: "easy"
  },
  {
    questionId: "gtm-048",
    question: "A man suffering from anterograde amnesia with a 15-minute memory tattoo-maps his body to hunt down his lover's murderer. Which movie is it?",
    options: ["Ghajini", "Memento", "Drishyam", "Race"],
    correctAnswer: 0,
    explanation: "Aamir Khan stars in Ghajini (2008), which became the founding film of the 100-Crore Club in Bollywood.",
    difficulty: "easy"
  },
  {
    questionId: "gtm-049",
    question: "A British Royal Navy captain and eccentric swashbuckler seeks to reclaim the cursed Black Pearl from mutineer Captain Barbossa. Which movie is it?",
    options: ["Pirates of the Caribbean: The Curse of the Black Pearl", "Master and Commander", "Cutthroat Island", "Peter Pan"],
    correctAnswer: 0,
    explanation: "Johnny Depp's iconic portrayal of Captain Jack Sparrow debuted in Pirates of the Caribbean (2003).",
    difficulty: "easy"
  },
  {
    questionId: "gtm-050",
    question: "A ruthless 1920s British crime family led by Tommy Shelby controls underground betting and bootlegging in Birmingham. Which show is it?",
    options: ["Peaky Blinders", "Boardwalk Empire", "The Sopranos", "Penny Dreadful"],
    correctAnswer: 0,
    explanation: "Cillian Murphy stars as Thomas Shelby in the hit historical drama Peaky Blinders.",
    difficulty: "easy"
  }
];

// 9. Actors & Celebrities (50 questions)
const actorsQuestions: Question[] = [
  {
    questionId: "act-001",
    question: "Which iconic actor played Tony Stark / Iron Man across 11 Marvel Cinematic Universe movies?",
    options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
    correctAnswer: 1,
    explanation: "Robert Downey Jr. launched the MCU with Iron Man in 2008.",
    difficulty: "easy"
  },
  {
    questionId: "act-002",
    question: "Who is known as the 'King of Bollywood' and 'Badshah', having starred in DDLJ, Chennai Express, and Jawan?",
    options: ["Salman Khan", "Shah Rukh Khan", "Aamir Khan", "Akshay Kumar"],
    correctAnswer: 1,
    explanation: "Shah Rukh Khan (SRK) is universally celebrated as the King of Bollywood.",
    difficulty: "easy"
  },
  {
    questionId: "act-003",
    question: "Which actor performed his own death-defying stunts clinging to planes and base-jumping motorcycles in Mission: Impossible?",
    options: ["Tom Cruise", "Keanu Reeves", "Jason Statham", "Daniel Craig"],
    correctAnswer: 0,
    explanation: "Tom Cruise is legendary for executing real-life extreme stunts for cinematic authenticity.",
    difficulty: "easy"
  },
  {
    questionId: "act-004",
    question: "Which actress portrayed Hermione Granger across all eight Harry Potter films before starring in Beauty and the Beast?",
    options: ["Emma Stone", "Emma Watson", "Bonnie Wright", "Saoirse Ronan"],
    correctAnswer: 1,
    explanation: "Emma Watson rose to worldwide stardom playing Hermione Granger.",
    difficulty: "easy"
  },
  {
    questionId: "act-005",
    question: "Who won the Best Actor Oscar for playing J. Robert Oppenheimer in Christopher Nolan's 2023 biographical epic?",
    options: ["Cillian Murphy", "Matt Damon", "Robert Downey Jr.", "Bradley Cooper"],
    correctAnswer: 0,
    explanation: "Irish actor Cillian Murphy swept the 2024 awards season for Oppenheimer.",
    difficulty: "easy"
  },
  {
    questionId: "act-006",
    question: "Which legendary Indian megastar is affectionately referred to as 'Shahenshah' and 'Big B'?",
    options: ["Dharmendra", "Amitabh Bachchan", "Rajnikanth", "Kamal Haasan"],
    correctAnswer: 1,
    explanation: "Amitabh Bachchan has dominated Indian cinema for over five decades.",
    difficulty: "easy"
  },
  {
    questionId: "act-007",
    question: "Which Hollywood star played Captain Jack Sparrow, Edward Scissorhands, and Willy Wonka?",
    options: ["Brad Pitt", "Johnny Depp", "Leonardo DiCaprio", "Christian Bale"],
    correctAnswer: 1,
    explanation: "Johnny Depp is renowned for his eccentric character transformations.",
    difficulty: "easy"
  },
  {
    questionId: "act-008",
    question: "Which actor won his first Academy Award for Best Actor in 2016 for wrestling a bear in The Revenant?",
    options: ["Leonardo DiCaprio", "Matthew McConaughey", "Joaquin Phoenix", "Christian Bale"],
    correctAnswer: 0,
    explanation: "Leonardo DiCaprio won his long-awaited Oscar for Alejandro Inarritu's The Revenant.",
    difficulty: "easy"
  },
  {
    questionId: "act-009",
    question: "Which superstar is celebrated as 'Thalaivar' and the cultural phenomenon of Tamil cinema?",
    options: ["Kamal Haasan", "Rajinikanth", "Vijay", "Ajith Kumar"],
    correctAnswer: 1,
    explanation: "Superstar Rajinikanth is celebrated for his larger-than-life screen presence and unique style.",
    difficulty: "easy"
  },
  {
    questionId: "act-010",
    question: "Which actress won Academy Awards for La La Land (2016) and Poor Things (2023)?",
    options: ["Jennifer Lawrence", "Emma Stone", "Margot Robbie", "Anne Hathaway"],
    correctAnswer: 1,
    explanation: "Emma Stone is a two-time Best Actress Oscar winner.",
    difficulty: "easy"
  },
  {
    questionId: "act-011",
    question: "Which method actor underwent extreme physical transformations for The Machinist and Batman Begins?",
    options: ["Christian Bale", "Joaquin Phoenix", "Jared Leto", "Gary Oldman"],
    correctAnswer: 0,
    explanation: "Christian Bale famously dropped to 120 lbs for The Machinist before packing on 100 lbs of muscle for Batman.",
    difficulty: "easy"
  },
  {
    questionId: "act-012",
    question: "Which actress starred as Black Widow (Natasha Romanoff) across multiple Marvel blockbusters?",
    options: ["Scarlett Johansson", "Elizabeth Olsen", "Brie Larson", "Florence Pugh"],
    correctAnswer: 0,
    explanation: "Scarlett Johansson debuted as Black Widow in Iron Man 2 and played her for over a decade.",
    difficulty: "easy"
  },
  {
    questionId: "act-013",
    question: "Which Australian actor transformed into the Marvel God of Thunder, Thor?",
    options: ["Liam Hemsworth", "Chris Hemsworth", "Hugh Jackman", "Chris Evans"],
    correctAnswer: 1,
    explanation: "Chris Hemsworth has portrayed Thor since 2011.",
    difficulty: "easy"
  },
  {
    questionId: "act-014",
    question: "Which actor portrayed Wolverine across nine X-Men films spanning 17 years before reprising the role in Deadpool 3?",
    options: ["Hugh Jackman", "Ryan Reynolds", "Karl Urban", "Russell Crowe"],
    correctAnswer: 0,
    explanation: "Hugh Jackman's portrayal of Logan / Wolverine is one of the longest comic book runs in cinematic history.",
    difficulty: "easy"
  },
  {
    questionId: "act-015",
    question: "Which actor plays the quick-witted, fourth-wall-breaking antihero Deadpool?",
    options: ["Ryan Reynolds", "Paul Rudd", "Chris Pratt", "Taika Waititi"],
    correctAnswer: 0,
    explanation: "Ryan Reynolds championed the R-rated Deadpool franchise to global box-office records.",
    difficulty: "easy"
  },
  {
    questionId: "act-016",
    question: "Which beloved actor was tragically immortalized for his legendary Oscar-winning portrayal of the Joker in The Dark Knight?",
    options: ["Jack Nicholson", "Heath Ledger", "Joaquin Phoenix", "Barry Keoghan"],
    correctAnswer: 1,
    explanation: "Heath Ledger posthumously won the Academy Award for his unforgettable performance as the Joker.",
    difficulty: "easy"
  },
  {
    questionId: "act-017",
    question: "Which actor won the Best Actor Oscar for playing the Joker in Todd Phillips' 2019 psychological drama?",
    options: ["Joaquin Phoenix", "Willem Dafoe", "Jared Leto", "Adam Driver"],
    correctAnswer: 0,
    explanation: "Joaquin Phoenix lost 52 pounds to play Arthur Fleck in Joker.",
    difficulty: "easy"
  },
  {
    questionId: "act-018",
    question: "Who is known as 'Mr. Perfectionist' in Indian cinema for meticulously crafting films like Lagaan, 3 Idiots, and Dangal?",
    options: ["Aamir Khan", "Hrithik Roshan", "Ajay Devgn", "Ranbir Kapoor"],
    correctAnswer: 0,
    explanation: "Aamir Khan is renowned for doing one meticulous film at a time to perfection.",
    difficulty: "easy"
  },
  {
    questionId: "act-019",
    question: "Which Indian actor is hailed as the 'Greek God of Bollywood' for his extraordinary dancing skills and physique?",
    options: ["Tiger Shroff", "Hrithik Roshan", "Vidyut Jammwal", "Sidharth Malhotra"],
    correctAnswer: 1,
    explanation: "Hrithik Roshan is universally acclaimed for his sculpted physique and unmatched dance artistry.",
    difficulty: "easy"
  },
  {
    questionId: "act-020",
    question: "Which Indian actress won Miss World 2000 before achieving worldwide acclaim in Quantico and Hollywood films?",
    options: ["Deepika Padukone", "Priyanka Chopra Jonas", "Aishwarya Rai", "Katrina Kaif"],
    correctAnswer: 1,
    explanation: "Priyanka Chopra Jonas transitioned from Miss World to a global international icon.",
    difficulty: "easy"
  },
  {
    questionId: "act-021",
    question: "Which actress was crowned Miss World 1994 and is celebrated for her roles in Devdas, Dhoom 2, and Jodhaa Akbar?",
    options: ["Sushmita Sen", "Aishwarya Rai Bachchan", "Dia Mirza", "Lara Dutta"],
    correctAnswer: 1,
    explanation: "Aishwarya Rai is revered as one of the most beautiful women in the world.",
    difficulty: "easy"
  },
  {
    questionId: "act-022",
    question: "Which former WWE wrestler and box-office titan is known as 'The People's Champion' and 'The Rock'?",
    options: ["John Cena", "Dwayne Johnson", "Dave Bautista", "Roman Reigns"],
    correctAnswer: 1,
    explanation: "Dwayne 'The Rock' Johnson became the world's highest-paid movie star.",
    difficulty: "easy"
  },
  {
    questionId: "act-023",
    question: "Which actor voiced the lovable cowboy Woody in Disney Pixar's Toy Story franchise?",
    options: ["Tom Hanks", "Tim Allen", "Billy Crystal", "Robin Williams"],
    correctAnswer: 0,
    explanation: "Tom Hanks brought warmth and leadership to Sheriff Woody across four Toy Story movies.",
    difficulty: "easy"
  },
  {
    questionId: "act-024",
    question: "Which actor voiced the cosmic Space Ranger Buzz Lightyear in Toy Story?",
    options: ["Tom Hanks", "Tim Allen", "John Goodman", "Patrick Warburton"],
    correctAnswer: 1,
    explanation: "Tim Allen delivered the iconic catchphrase 'To infinity and beyond!'.",
    difficulty: "easy"
  },
  {
    questionId: "act-025",
    question: "Which actor famously played Neo in The Matrix, John Wick, and Ted in Bill & Ted?",
    options: ["Keanu Reeves", "Harrison Ford", "Nicolas Cage", "Johnny Depp"],
    correctAnswer: 0,
    explanation: "Keanu Reeves is universally beloved for his humble demeanor and legendary action cinema pedigree.",
    difficulty: "easy"
  },
  {
    questionId: "act-026",
    question: "Which English actress won an Academy Award for The Queen (2006) and portrayed Queen Elizabeth II?",
    options: ["Judi Dench", "Helen Mirren", "Maggie Smith", "Emma Thompson"],
    correctAnswer: 1,
    explanation: "Dame Helen Mirren is the only performer to have achieved the Triple Crown of Acting in both the US and UK.",
    difficulty: "medium"
  },
  {
    questionId: "act-027",
    question: "Which actor played Captain America (Steve Rogers) across the Infinity Saga of the Marvel Cinematic Universe?",
    options: ["Chris Evans", "Sebastian Stan", "Anthony Mackie", "Jeremy Renner"],
    correctAnswer: 0,
    explanation: "Chris Evans wielded the vibranium shield from The First Avenger through Avengers: Endgame.",
    difficulty: "easy"
  },
  {
    questionId: "act-028",
    question: "Which English actor portrayed the formidable dark wizard Voldemort in the Harry Potter films?",
    options: ["Ralph Fiennes", "Gary Oldman", "Alan Rickman", "Jason Isaacs"],
    correctAnswer: 0,
    explanation: "Ralph Fiennes gave a spine-chilling performance as Lord Voldemort ('He Who Must Not Be Named').",
    difficulty: "easy"
  },
  {
    questionId: "act-029",
    question: "Which beloved British actor portrayed Professor Severus Snape with iconic dry gravity before his passing in 2016?",
    options: ["Alan Rickman", "Michael Gambon", "Richard Harris", "John Hurt"],
    correctAnswer: 0,
    explanation: "Alan Rickman's tender, complicated delivery of 'Always' remains legendary.",
    difficulty: "easy"
  },
  {
    questionId: "act-030",
    question: "Which versatile Welsh actor played Hannibal Lecter in The Silence of the Lambs (1991)?",
    options: ["Anthony Hopkins", "Ian McKellen", "Patrick Stewart", "Brian Cox"],
    correctAnswer: 0,
    explanation: "Sir Anthony Hopkins won Best Actor despite appearing for less than 16 minutes of screen time.",
    difficulty: "easy"
  },
  {
    questionId: "act-031",
    question: "Which actor portrayed James Bond across five blockbuster films from Casino Royale (2006) to No Time to Die (2021)?",
    options: ["Pierce Brosnan", "Daniel Craig", "Sean Connery", "Roger Moore"],
    correctAnswer: 1,
    explanation: "Daniel Craig brought gritty realism and physical intensity to Agent 007.",
    difficulty: "easy"
  },
  {
    questionId: "act-032",
    question: "Who was the Scottish legend who was the very first actor to portray James Bond on the silver screen?",
    options: ["Sean Connery", "George Lazenby", "Roger Moore", "Timothy Dalton"],
    correctAnswer: 0,
    explanation: "Sir Sean Connery debuted as 007 in Dr. No (1962).",
    difficulty: "easy"
  },
  {
    questionId: "act-033",
    question: "Which Indian actor won universal acclaim for her roles in Piku, Padmaavat, and Gehraiyaan?",
    options: ["Deepika Padukone", "Anushka Sharma", "Kareena Kapoor", "Alia Bhatt"],
    correctAnswer: 0,
    explanation: "Deepika Padukone is one of the most bankable leading ladies in Indian cinema history.",
    difficulty: "easy"
  },
  {
    questionId: "act-034",
    question: "Which young Indian actress won four Filmfare Best Actress awards for Highway, Raazi, Gully Boy, and Gangubai Kathiawadi?",
    options: ["Alia Bhatt", "Kriti Sanon", "Sara Ali Khan", "Kiara Advani"],
    correctAnswer: 0,
    explanation: "Alia Bhatt also won the National Film Award for Best Actress for Gangubai Kathiawadi.",
    difficulty: "easy"
  },
  {
    questionId: "act-035",
    question: "Which Indian actor is known as the 'Khiladi' of Bollywood for his early martial arts stunts and high annual output?",
    options: ["Akshay Kumar", "Suniel Shetty", "Sunny Deol", "Bobby Deol"],
    correctAnswer: 0,
    explanation: "Akshay Kumar earned the nickname Khiladi after starring in eight films with the word in their title.",
    difficulty: "easy"
  },
  {
    questionId: "act-036",
    question: "Which actor portrayed the beloved character Chandler Bing in the world-famous sitcom Friends?",
    options: ["Matthew Perry", "Matt LeBlanc", "David Schwimmer", "Paul Rudd"],
    correctAnswer: 0,
    explanation: "Matthew Perry's sarcastic wit and timing made Chandler Bing an all-time TV treasure.",
    difficulty: "easy"
  },
  {
    questionId: "act-037",
    question: "Which actress portrayed Rachel Green on Friends before becoming an A-list movie star?",
    options: ["Jennifer Aniston", "Courteney Cox", "Lisa Kudrow", "Reese Witherspoon"],
    correctAnswer: 0,
    explanation: "Jennifer Aniston was a global fashion and television icon throughout Friends' 10-year run.",
    difficulty: "easy"
  },
  {
    questionId: "act-038",
    question: "Which Hollywood titan directed Jurassic Park, Jaws, E.T., Schindler's List, and Raiders of the Lost Ark?",
    options: ["Steven Spielberg", "James Cameron", "George Lucas", "Martin Scorsese"],
    correctAnswer: 0,
    explanation: "Steven Spielberg is the most commercially and critically successful director in film history.",
    difficulty: "easy"
  },
  {
    questionId: "act-039",
    question: "Which visionary director is famous for non-linear storytelling in Memento, The Dark Knight, Inception, and Oppenheimer?",
    options: ["Christopher Nolan", "Quentin Tarantino", "David Fincher", "Denis Villeneuve"],
    correctAnswer: 0,
    explanation: "Christopher Nolan is celebrated for practical effects, IMAX cinematography, and complex temporal themes.",
    difficulty: "easy"
  },
  {
    questionId: "act-040",
    question: "Which director directed the two highest-grossing films of all time: Avatar and Titanic?",
    options: ["James Cameron", "Steven Spielberg", "Peter Jackson", "Ridley Scott"],
    correctAnswer: 0,
    explanation: "James Cameron holds unprecedented records with Avatar ($2.9B), Titanic ($2.2B), and Avatar 2 ($2.3B).",
    difficulty: "easy"
  },
  {
    questionId: "act-041",
    question: "Which director directed Pulp Fiction, Kill Bill, Django Unchained, and Inglourious Basterds?",
    options: ["Quentin Tarantino", "Martin Scorsese", "Paul Thomas Anderson", "Guy Ritchie"],
    correctAnswer: 0,
    explanation: "Quentin Tarantino is celebrated for razor-sharp dialogue, stylized violence, and cinema homages.",
    difficulty: "easy"
  },
  {
    questionId: "act-042",
    question: "Which legendary director collaborated with Robert De Niro and Leonardo DiCaprio across Taxi Driver, Goodfellas, and The Wolf of Wall Street?",
    options: ["Martin Scorsese", "Francis Ford Coppola", "Brian De Palma", "Woody Allen"],
    correctAnswer: 0,
    explanation: "Martin Scorsese is an undisputed master of American crime and character cinema.",
    difficulty: "easy"
  },
  {
    questionId: "act-043",
    question: "Which South Indian actor gained massive worldwide fame as Komaram Bheem in RRR?",
    options: ["Jr. NTR (N. T. Rama Rao Jr.)", "Ram Charan", "Allu Arjun", "Mahesh Babu"],
    correctAnswer: 0,
    explanation: "Jr. NTR delivered a powerhouse physical and emotional performance in RRR.",
    difficulty: "medium"
  },
  {
    questionId: "act-044",
    question: "Which South Indian star played Alluri Sitarama Raju alongside Jr. NTR in RRR?",
    options: ["Ram Charan", "Prabhas", "Nani", "Vijay Deverakonda"],
    correctAnswer: 0,
    explanation: "Ram Charan co-starred as the laser-focused police officer and revolutionary archer.",
    difficulty: "medium"
  },
  {
    questionId: "act-045",
    question: "Which Telugu superstar gained national fame and an unprecedented fan following as the lead in Pushpa: The Rise?",
    options: ["Allu Arjun", "Vijay", "Suriya", "Dhanush"],
    correctAnswer: 0,
    explanation: "Allu Arjun won the National Film Award for Best Actor for his swagger in Pushpa.",
    difficulty: "easy"
  },
  {
    questionId: "act-046",
    question: "Which actor portrayed Walter White (Heisenberg), the chemistry teacher turned methamphetamine kingpin in Breaking Bad?",
    options: ["Bryan Cranston", "Aaron Paul", "Bob Odenkirk", "Giancarlo Esposito"],
    correctAnswer: 0,
    explanation: "Bryan Cranston won four Primetime Emmy Awards for Best Actor for Breaking Bad.",
    difficulty: "easy"
  },
  {
    questionId: "act-047",
    question: "Which actor portrayed Jesse Pinkman, Walter White's loyal young partner in Breaking Bad?",
    options: ["Aaron Paul", "Dean Norris", "RJ Mitte", "Jonathan Banks"],
    correctAnswer: 0,
    explanation: "Aaron Paul won three Emmy Awards for his emotionally raw portrayal of Jesse Pinkman ('Yeah science, bitch!').",
    difficulty: "easy"
  },
  {
    questionId: "act-048",
    question: "Which actor played the fearsome Chilean drug lord and fried chicken proprietor Gus Fring in Breaking Bad and Better Call Saul?",
    options: ["Giancarlo Esposito", "Mark Margolis", "Tony Dalton", "Pedro Pascal"],
    correctAnswer: 0,
    explanation: "Giancarlo Esposito created one of television's most chillingly composed villains.",
    difficulty: "easy"
  },
  {
    questionId: "act-049",
    question: "Which beloved Chilean-American actor stars as The Mandalorian, Joel Miller in The Last of Us, and Oberyn Martell in Game of Thrones?",
    options: ["Pedro Pascal", "Oscar Isaac", "Diego Luna", "Gabriel Luna"],
    correctAnswer: 0,
    explanation: "Pedro Pascal is affectionately celebrated as the internet's favorite protector and father figure.",
    difficulty: "easy"
  },
  {
    questionId: "act-050",
    question: "Which actor played Aragorn (Strider), the rightful King of Gondor, in Peter Jackson's The Lord of the Rings trilogy?",
    options: ["Viggo Mortensen", "Sean Bean", "Orlando Bloom", "Karl Urban"],
    correctAnswer: 0,
    explanation: "Viggo Mortensen's dedication to stunt combat and horse riding made his Aragorn iconic.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'guess-the-movie.json'),
  JSON.stringify(guessMovieQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated guess-the-movie.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'actors-celebrities.json'),
  JSON.stringify(actorsQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated actors-celebrities.json (50 questions)');
