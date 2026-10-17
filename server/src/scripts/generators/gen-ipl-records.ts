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

// 1. Guess the IPL Team (50 questions)
const guessIplTeamQuestions: Question[] = [
  {
    questionId: "ipl-t-001",
    question: "Which team uses the slogan 'Whistle Podu' and plays at M. A. Chidambaram Stadium (Chepauk)?",
    options: ["Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bengaluru", "Kolkata Knight Riders"],
    correctAnswer: 0,
    explanation: "Chennai Super Kings (CSK) are renowned for their yellow jersey, 'Whistle Podu' anthem, and fortress Chepauk.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-002",
    question: "Which team won 5 IPL titles under the captaincy of Rohit Sharma between 2013 and 2020?",
    options: ["Kolkata Knight Riders", "Mumbai Indians", "Sunrisers Hyderabad", "Delhi Capitals"],
    correctAnswer: 1,
    explanation: "Mumbai Indians won the IPL in 2013, 2015, 2017, 2019, and 2020 under Rohit Sharma.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-003",
    question: "Which team has the passionate fan slogan 'Ee Sala Cup Namde' (This year the cup is ours)?",
    options: ["Punjab Kings", "Royal Challengers Bengaluru", "Rajasthan Royals", "Lucknow Super Giants"],
    correctAnswer: 1,
    explanation: "RCB fans famously rally behind the Kannada battle cry 'Ee Sala Cup Namde'.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-004",
    question: "Which team won the inaugural edition of the Indian Premier League in 2008 under Shane Warne's leadership?",
    options: ["Rajasthan Royals", "Chennai Super Kings", "Deccan Chargers", "Delhi Daredevils"],
    correctAnswer: 0,
    explanation: "Rajasthan Royals, coached and captained by Australian spin legend Shane Warne, were crowned champions in 2008.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-005",
    question: "Co-owned by Shah Rukh Khan and Juhi Chawla, which franchise's anthem is 'Korbo, Lorbo, Jeetbo Re'?",
    options: ["Delhi Capitals", "Punjab Kings", "Kolkata Knight Riders", "Gujarat Titans"],
    correctAnswer: 2,
    explanation: "Kolkata Knight Riders (KKR) play at Eden Gardens and are co-owned by Shah Rukh Khan.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-006",
    question: "Which team won the IPL in their debut season in 2022 under Hardik Pandya's captaincy?",
    options: ["Lucknow Super Giants", "Gujarat Titans", "Sunrisers Hyderabad", "Rising Pune Supergiant"],
    correctAnswer: 1,
    explanation: "Gujarat Titans lifted the trophy in 2022 after defeating Rajasthan Royals in the final at Ahmedabad.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-007",
    question: "Which franchise plays their home games at Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium?",
    options: ["Lucknow Super Giants", "Punjab Kings", "Delhi Capitals", "Rajasthan Royals"],
    correctAnswer: 0,
    explanation: "Lucknow Super Giants (LSG), introduced in 2022, have Ekana Stadium in Lucknow as their home ground.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-008",
    question: "Formerly known as Kings XI Punjab, what is this Mohali-based franchise renamed to?",
    options: ["Punjab Warriors", "Punjab Kings", "Punjab Lions", "Royal Punjab"],
    correctAnswer: 1,
    explanation: "The franchise rebranded from Kings XI Punjab to Punjab Kings ahead of IPL 2021.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-009",
    question: "Which team rebranded from 'Delhi Daredevils' in December 2018?",
    options: ["Delhi Capitals", "Delhi Dynamos", "Delhi Challengers", "Delhi Tigers"],
    correctAnswer: 0,
    explanation: "The Delhi franchise changed their name to Delhi Capitals ahead of the 2019 season.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-010",
    question: "Which team replaced the Deccan Chargers in 2013 and won their first title under David Warner in 2016?",
    options: ["Gujarat Lions", "Sunrisers Hyderabad", "Rising Pune Supergiant", "Kochi Tuskers Kerala"],
    correctAnswer: 1,
    explanation: "Sunrisers Hyderabad was formed in 2013 and clinched the title in 2016 beating RCB in the final.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-011",
    question: "Identify the team: Chris Gayle scored his record-shattering 175* off 66 balls playing for which team?",
    options: ["Kolkata Knight Riders", "Kings XI Punjab", "Royal Challengers Bengaluru", "Sunrisers Hyderabad"],
    correctAnswer: 2,
    explanation: "Chris Gayle smashed 175* against Pune Warriors India at M. Chinnaswamy Stadium in 2013 playing for RCB.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-012",
    question: "Which team plays at Sawai Mansingh Stadium in Jaipur?",
    options: ["Rajasthan Royals", "Gujarat Titans", "Punjab Kings", "Delhi Capitals"],
    correctAnswer: 0,
    explanation: "SMS Stadium in the Pink City of Jaipur is the fortress of the Rajasthan Royals.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-013",
    question: "Which franchise won the IPL 2024 final decisively under the mentorship of Gautam Gambhir?",
    options: ["Sunrisers Hyderabad", "Kolkata Knight Riders", "Chennai Super Kings", "Rajasthan Royals"],
    correctAnswer: 1,
    explanation: "Kolkata Knight Riders won the 2024 IPL championship beating Sunrisers Hyderabad in Chennai.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-014",
    question: "Identify the team: Adam Gilchrist led this franchise to IPL glory in South Africa in 2009.",
    options: ["Deccan Chargers", "Royal Challengers Bangalore", "Delhi Daredevils", "Rajasthan Royals"],
    correctAnswer: 0,
    explanation: "Deccan Chargers won the 2009 IPL held in South Africa, captained by Adam Gilchrist.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-015",
    question: "Which team was suspended alongside Rajasthan Royals for the 2016 and 2017 IPL seasons?",
    options: ["Kolkata Knight Riders", "Chennai Super Kings", "Mumbai Indians", "Sunrisers Hyderabad"],
    correctAnswer: 1,
    explanation: "CSK and RR were banned for two seasons (2016 and 2017) following the spot-fixing inquiry.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-016",
    question: "Which temporary franchise was captained by MS Dhoni in 2016 and Steve Smith in 2017?",
    options: ["Gujarat Lions", "Rising Pune Supergiant", "Pune Warriors India", "Kochi Tuskers Kerala"],
    correctAnswer: 1,
    explanation: "Rising Pune Supergiant (RPS) competed in 2016 and 2017, reaching the final in 2017.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-017",
    question: "Which team played only in the 2011 IPL season before having their contract terminated?",
    options: ["Kochi Tuskers Kerala", "Pune Warriors India", "Gujarat Lions", "Deccan Chargers"],
    correctAnswer: 0,
    explanation: "Kochi Tuskers Kerala competed only in the 2011 edition of the IPL.",
    difficulty: "hard"
  },
  {
    questionId: "ipl-t-018",
    question: "Identify the team that posted the all-time lowest total in IPL history: 49 all out against KKR in 2017.",
    options: ["Rajasthan Royals", "Delhi Daredevils", "Royal Challengers Bengaluru", "Punjab Kings"],
    correctAnswer: 2,
    explanation: "RCB were bowled out for a meager 49 runs at Eden Gardens against KKR on April 23, 2017.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-019",
    question: "Which team holds the record for scoring 287/3 against RCB in IPL 2024?",
    options: ["Sunrisers Hyderabad", "Kolkata Knight Riders", "Mumbai Indians", "Punjab Kings"],
    correctAnswer: 0,
    explanation: "Sunrisers Hyderabad smashed 287/3 at Bengaluru in April 2024, setting a record team total in IPL.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-020",
    question: "Which franchise has Preity Zinta as one of its most visible co-owners in the stands?",
    options: ["Punjab Kings", "Rajasthan Royals", "Delhi Capitals", "Kolkata Knight Riders"],
    correctAnswer: 0,
    explanation: "Bollywood actress Preity Zinta is co-owner and the energetic cheerleader of Punjab Kings.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-021",
    question: "Which team has won 2 IPL titles (2012 & 2014) both under Gautam Gambhir's captaincy?",
    options: ["Delhi Capitals", "Kolkata Knight Riders", "Sunrisers Hyderabad", "Mumbai Indians"],
    correctAnswer: 1,
    explanation: "Gautam Gambhir led KKR to titles in 2012 (against CSK) and 2014 (against Kings XI Punjab).",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-022",
    question: "Identify the team: Jasprit Bumrah made his IPL debut for this franchise in 2013 taking 3 wickets including Virat Kohli.",
    options: ["Gujarat Lions", "Mumbai Indians", "Royal Challengers Bengaluru", "Delhi Capitals"],
    correctAnswer: 1,
    explanation: "Jasprit Bumrah made an impactful debut for Mumbai Indians against RCB in April 2013.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-023",
    question: "Which team represents the state of Gujarat and has Narendra Modi Stadium as their home arena?",
    options: ["Gujarat Titans", "Gujarat Lions", "Ahmedabad Rockets", "Saurashtra Strikers"],
    correctAnswer: 0,
    explanation: "Gujarat Titans play their home matches at the world's largest cricket stadium, Narendra Modi Stadium.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-024",
    question: "Which team did Brendon McCullum represent when he smashed 158* on the opening night of IPL in 2008?",
    options: ["Royal Challengers Bangalore", "Kolkata Knight Riders", "Chennai Super Kings", "Mumbai Indians"],
    correctAnswer: 1,
    explanation: "McCullum opened the IPL era with an explosive 158* off 73 balls for KKR against RCB on April 18, 2008.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-025",
    question: "Identify the team: Suresh Raina earned the moniker 'Mr. IPL' primarily playing for which team?",
    options: ["Chennai Super Kings", "Gujarat Lions", "Delhi Capitals", "Mumbai Indians"],
    correctAnswer: 0,
    explanation: "Suresh Raina was the batting stalwart and backbone of Chennai Super Kings for over a decade.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-026",
    question: "Which team completed the highest successful run chase in T20 cricket history by chasing down 262 against KKR in IPL 2024?",
    options: ["Punjab Kings", "Sunrisers Hyderabad", "Mumbai Indians", "Rajasthan Royals"],
    correctAnswer: 0,
    explanation: "Punjab Kings chased down 262 with 8 balls to spare at Eden Gardens in April 2024, setting a world record.",
    difficulty: "hard"
  },
  {
    questionId: "ipl-t-027",
    question: "Which team did AB de Villiers represent in the IPL before joining Royal Challengers Bangalore?",
    options: ["Delhi Daredevils", "Rajasthan Royals", "Deccan Chargers", "Mumbai Indians"],
    correctAnswer: 0,
    explanation: "AB de Villiers played for Delhi Daredevils from 2008 to 2010 before moving to RCB in 2011.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-028",
    question: "Identify the team whose primary color is orange and home ground is Rajiv Gandhi International Stadium.",
    options: ["Gujarat Titans", "Sunrisers Hyderabad", "Pune Warriors India", "Kochi Tuskers Kerala"],
    correctAnswer: 1,
    explanation: "Sunrisers Hyderabad are famously known as the 'Orange Army' and play at Uppal stadium in Hyderabad.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-029",
    question: "Which team has Rishabh Pant captained and represented since his breakout in 2016?",
    options: ["Delhi Capitals", "Punjab Kings", "Lucknow Super Giants", "Rajasthan Royals"],
    correctAnswer: 0,
    explanation: "Rishabh Pant made his IPL debut for Delhi Daredevils (now Delhi Capitals) and became captain in 2021.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-030",
    question: "Which franchise won back-to-back IPL championships in 2010 and 2011?",
    options: ["Kolkata Knight Riders", "Mumbai Indians", "Chennai Super Kings", "Rajasthan Royals"],
    correctAnswer: 2,
    explanation: "CSK became the first team to win consecutive IPL titles in 2010 (vs MI) and 2011 (vs RCB).",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-031",
    question: "Which team was owned by Subrata Roy's Sahara Group and played between 2011 and 2013?",
    options: ["Pune Warriors India", "Kochi Tuskers Kerala", "Rising Pune Supergiant", "Deccan Chargers"],
    correctAnswer: 0,
    explanation: "Pune Warriors India was owned by Sahara Adventure Sports Limited from 2011 to 2013.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-032",
    question: "Which franchise was bought by the RP-Sanjiv Goenka Group (RPSG) for a record ₹7,090 crore in 2021?",
    options: ["Gujarat Titans", "Lucknow Super Giants", "Rising Pune Supergiant", "Kochi Tuskers Kerala"],
    correctAnswer: 1,
    explanation: "RPSG Group won the bid for the Lucknow franchise (LSG) for ₹7,090 crore ($940 million).",
    difficulty: "hard"
  },
  {
    questionId: "ipl-t-033",
    question: "Which franchise won their 5th title in thrilling fashion off the last ball in a rain-curtailed final in 2023?",
    options: ["Gujarat Titans", "Chennai Super Kings", "Mumbai Indians", "Kolkata Knight Riders"],
    correctAnswer: 1,
    explanation: "Ravindra Jadeja struck a six and four off the final two deliveries to seal CSK's 5th title against Gujarat Titans.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-034",
    question: "Which team's home venue is the Arun Jaitley Stadium (formerly Feroz Shah Kotla)?",
    options: ["Punjab Kings", "Delhi Capitals", "Lucknow Super Giants", "Rajasthan Royals"],
    correctAnswer: 1,
    explanation: "Arun Jaitley Stadium in New Delhi is the home fortress of the Delhi Capitals.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-035",
    question: "Identify the team: Sunil Narine and Andre Russell have both won multiple MVP / Player of the Tournament awards for which team?",
    options: ["Kolkata Knight Riders", "Mumbai Indians", "Sunrisers Hyderabad", "Delhi Capitals"],
    correctAnswer: 0,
    explanation: "Both Caribbean all-rounders have been long-standing pillars and match-winners for KKR.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-036",
    question: "Which team reached the final in 2014 under George Bailey, scoring 199 in the final against KKR?",
    options: ["Kings XI Punjab", "Rajasthan Royals", "Delhi Daredevils", "Sunrisers Hyderabad"],
    correctAnswer: 0,
    explanation: "Kings XI Punjab had a phenomenal 2014 season powered by Glenn Maxwell and Wriddhiman Saha's century in the final.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-037",
    question: "Identify the team: Kieron Pollard played all his 189 IPL matches for this single franchise from 2010 to 2022.",
    options: ["Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bangalore", "Kolkata Knight Riders"],
    correctAnswer: 1,
    explanation: "Kieron Pollard spent his entire 13-season IPL playing career with Mumbai Indians.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-038",
    question: "Which team did Shane Watson score a blistering century for on one leg in the 2019 IPL final?",
    options: ["Rajasthan Royals", "Royal Challengers Bangalore", "Chennai Super Kings", "Mumbai Indians"],
    correctAnswer: 2,
    explanation: "Shane Watson batted courageously with a bleeding knee for CSK, scoring 80 off 59 balls in the 2019 final.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-039",
    question: "Which franchise won the fair play award in the inaugural season and was captained by Rahul Dravid in later years?",
    options: ["Rajasthan Royals", "Deccan Chargers", "Delhi Daredevils", "Royal Challengers Bangalore"],
    correctAnswer: 0,
    explanation: "Rajasthan Royals were renowned for their disciplined cricket and youth mentorship under Dravid.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-040",
    question: "Identify the team: Yuzvendra Chahal is the all-time highest wicket-taker for which IPL franchise?",
    options: ["Rajasthan Royals", "Royal Challengers Bengaluru", "Mumbai Indians", "Delhi Capitals"],
    correctAnswer: 1,
    explanation: "Chahal picked up 139 wickets for RCB between 2014 and 2021 before joining Rajasthan Royals.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-041",
    question: "Which team has qualified for the playoffs in 12 out of the 15 seasons they competed in up to 2024?",
    options: ["Mumbai Indians", "Chennai Super Kings", "Kolkata Knight Riders", "Sunrisers Hyderabad"],
    correctAnswer: 1,
    explanation: "CSK holds an unmatched consistency record, qualifying for the playoffs 12 times and reaching 10 finals.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-042",
    question: "Which team did Chris Gayle score a century on his debut match for after going unsold in the 2011 auction initially?",
    options: ["Kolkata Knight Riders", "Royal Challengers Bangalore", "Kings XI Punjab", "Pune Warriors India"],
    correctAnswer: 1,
    explanation: "Gayle came in as a replacement for Dirk Nannes and scored 102* off 55 against KKR in his RCB debut.",
    difficulty: "hard"
  },
  {
    questionId: "ipl-t-043",
    question: "Which team did Hardik Pandya lead to back-to-back finals in 2022 and 2023?",
    options: ["Mumbai Indians", "Gujarat Titans", "Lucknow Super Giants", "Sunrisers Hyderabad"],
    correctAnswer: 1,
    explanation: "Hardik captained Gujarat Titans to victory in 2022 and runners-up finish in 2023.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-044",
    question: "Which team has Sourav Ganguly served as Director of Cricket and Ricky Ponting as head coach?",
    options: ["Kolkata Knight Riders", "Delhi Capitals", "Mumbai Indians", "Punjab Kings"],
    correctAnswer: 1,
    explanation: "Ricky Ponting was head coach and Sourav Ganguly was Director of Cricket at Delhi Capitals.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-045",
    question: "Which team represents the pink city and wears pink and blue jerseys?",
    options: ["Punjab Kings", "Rajasthan Royals", "Gujarat Titans", "Lucknow Super Giants"],
    correctAnswer: 1,
    explanation: "Rajasthan Royals adopted pink jerseys in tribute to the Pink City of Jaipur.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-046",
    question: "Which team's home venue was the Brabourne Stadium and DY Patil Stadium in early IPL editions?",
    options: ["Mumbai Indians", "Chennai Super Kings", "Deccan Chargers", "Pune Warriors India"],
    correctAnswer: 0,
    explanation: "Mumbai Indians played matches at Brabourne and DY Patil while Wankhede Stadium was undergoing renovation for the 2011 WC.",
    difficulty: "hard"
  },
  {
    questionId: "ipl-t-047",
    question: "Which franchise's reserve home ground is the scenic HPCA Stadium in Dharamshala?",
    options: ["Delhi Capitals", "Punjab Kings", "Rajasthan Royals", "Lucknow Super Giants"],
    correctAnswer: 1,
    explanation: "Punjab Kings host select home matches at the picturesque Dharamshala stadium in Himachal Pradesh.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-048",
    question: "Identify the team: Who won the 2016 IPL trophy defending 208 against RCB at M. Chinnaswamy Stadium?",
    options: ["Sunrisers Hyderabad", "Kolkata Knight Riders", "Mumbai Indians", "Chennai Super Kings"],
    correctAnswer: 0,
    explanation: "Sunrisers Hyderabad defeated RCB by 8 runs in the 2016 final to lift their maiden title.",
    difficulty: "easy"
  },
  {
    questionId: "ipl-t-049",
    question: "Which team holds the record for 3 centuries by a single batter (Jos Buttler) in winning causes in IPL 2022?",
    options: ["Rajasthan Royals", "Royal Challengers Bengaluru", "Mumbai Indians", "Gujarat Titans"],
    correctAnswer: 0,
    explanation: "Jos Buttler scored 4 centuries in total for Rajasthan Royals in IPL 2022, scoring 863 runs in the season.",
    difficulty: "medium"
  },
  {
    questionId: "ipl-t-050",
    question: "Which team has the iconic horn tune followed by the crowd chanting their initials three times?",
    options: ["CSK", "RCB", "MI", "KKR"],
    correctAnswer: 1,
    explanation: "The iconic Chinnaswamy stadium horn followed by the resounding chant 'R-C-B!' is one of cricket's most famous fan traditions.",
    difficulty: "easy"
  }
];

// 2. Cricket World Records (50 questions)
const cricketWorldRecordsQuestions: Question[] = [
  {
    questionId: "cwr-001",
    question: "Who holds the record for the highest individual score in One Day Internationals (ODI) with 264 runs?",
    options: ["Martin Guptill", "Rohit Sharma", "Chris Gayle", "Virender Sehwag"],
    correctAnswer: 1,
    explanation: "Rohit Sharma scored an astonishing 264 runs off 173 balls against Sri Lanka at Eden Gardens in 2014.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-002",
    question: "Who holds the world record for the highest individual score in Test cricket (400 not out)?",
    options: ["Matthew Hayden", "Don Bradman", "Brian Lara", "Kumar Sangakkara"],
    correctAnswer: 2,
    explanation: "Brian Charles Lara scored 400 not out for the West Indies against England at St John's, Antigua in 2004.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-003",
    question: "Which bowler holds the world record for taking the most wickets in international Test cricket (800 wickets)?",
    options: ["Shane Warne", "James Anderson", "Anil Kumble", "Muttiah Muralitharan"],
    correctAnswer: 3,
    explanation: "Sri Lankan wizard Muttiah Muralitharan took 800 wickets in 133 Test matches at an average of 22.72.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-004",
    question: "Who is the only cricketer in history to score 100 international centuries (51 Tests, 49 ODIs)?",
    options: ["Virat Kohli", "Ricky Ponting", "Sachin Tendulkar", "Jacques Kallis"],
    correctAnswer: 2,
    explanation: "Sachin Tendulkar completed his 100th international century against Bangladesh at Mirpur in March 2012.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-005",
    question: "Who holds the record for the fastest century in ODI cricket, scored off just 31 balls?",
    options: ["Shahid Afridi", "Corey Anderson", "AB de Villiers", "Glenn Maxwell"],
    correctAnswer: 2,
    explanation: "AB de Villiers smashed 149 runs off 44 balls, reaching his hundred in 31 balls against West Indies in 2015.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-006",
    question: "What is Sir Donald Bradman's legendary career Test batting average?",
    options: ["94.62", "99.94", "101.40", "98.75"],
    correctAnswer: 1,
    explanation: "Don Bradman finished his 52-Test career with 6,996 runs and an unprecedented average of 99.94.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-007",
    question: "Which team holds the record for the highest team total in ODI cricket (498/4)?",
    options: ["Australia", "England", "South Africa", "India"],
    correctAnswer: 1,
    explanation: "England amassed 498/4 against the Netherlands in Amstelveen in June 2022.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-008",
    question: "Who hit 6 sixes in an over off Stuart Broad during the 2007 T20 World Cup?",
    options: ["Chris Gayle", "Yuvraj Singh", "Kieron Pollard", "Herschelle Gibbs"],
    correctAnswer: 1,
    explanation: "Yuvraj Singh took 36 runs off Stuart Broad at Kingsmead, Durban in the inaugural 2007 ICC World Twenty20.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-009",
    question: "Who was the first batsman in history to hit 6 sixes in an over in an ODI World Cup match?",
    options: ["Herschelle Gibbs", "Yuvraj Singh", "Jaskaran Malhotra", "Kieron Pollard"],
    correctAnswer: 0,
    explanation: "Herschelle Gibbs hit 6 sixes in an over off Daan van Bunge of the Netherlands in the 2007 Cricket World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-010",
    question: "Who holds the record for the fastest fifty in T20 Internationals, reached in just 9 balls?",
    options: ["Yuvraj Singh", "Dipendra Singh Airee", "Chris Gayle", "Hazratullah Zazai"],
    correctAnswer: 1,
    explanation: "Nepal's Dipendra Singh Airee scored a 50 in 9 balls against Mongolia at the 2023 Asian Games.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-011",
    question: "Who holds the record for the fastest recorded delivery in cricket history (161.3 km/h or 100.23 mph)?",
    options: ["Brett Lee", "Shoaib Akhtar", "Shaun Tait", "Mitchell Starc"],
    correctAnswer: 1,
    explanation: "Pakistan's 'Rawalpindi Express' Shoaib Akhtar bowled at 161.3 km/h to Nick Knight in the 2003 World Cup.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-012",
    question: "Which cricketer holds the record for the most total runs across all international formats (34,357 runs)?",
    options: ["Kumar Sangakkara", "Ricky Ponting", "Sachin Tendulkar", "Virat Kohli"],
    correctAnswer: 2,
    explanation: "Sachin Tendulkar scored 15,921 Test runs, 18,426 ODI runs, and 10 T20I runs, totaling 34,357 international runs.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-013",
    question: "Who holds the record for the most ODI centuries in international cricket history (50 centuries)?",
    options: ["Sachin Tendulkar", "Virat Kohli", "Rohit Sharma", "Ricky Ponting"],
    correctAnswer: 1,
    explanation: "Virat Kohli broke Sachin's record of 49 ODI centuries by scoring his 50th century against New Zealand in the 2023 World Cup semi-final.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-014",
    question: "Which bowler has taken the best bowling figures in an ODI innings (8 wickets for 19 runs)?",
    options: ["Chaminda Vaas", "Glenn McGrath", "Anil Kumble", "Shahid Afridi"],
    correctAnswer: 0,
    explanation: "Sri Lankan left-armer Chaminda Vaas took 8/19 against Zimbabwe in Colombo in December 2001.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-015",
    question: "Who are the only three bowlers in Test history to take all 10 wickets in a single innings?",
    options: [
      "Jim Laker, Anil Kumble, and Ajaz Patel",
      "Shane Warne, Muttiah Muralitharan, and Glenn McGrath",
      "Jim Laker, Richard Hadlee, and Kapil Dev",
      "Anil Kumble, Wasim Akram, and Stuart Broad"
    ],
    correctAnswer: 0,
    explanation: "Jim Laker (1956), Anil Kumble (1999), and Ajaz Patel (2021) are the exclusive trio with 10-fers in Test innings.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-016",
    question: "Who holds the record for the most sixes in all international cricket across formats?",
    options: ["Chris Gayle", "Rohit Sharma", "Shahid Afridi", "Brendon McCullum"],
    correctAnswer: 1,
    explanation: "Rohit Sharma surpassed Chris Gayle's record of 553 international sixes in 2023.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-017",
    question: "Who was the first male cricketer to score a double century in ODI history?",
    options: ["Virender Sehwag", "Chris Gayle", "Sachin Tendulkar", "Martin Guptill"],
    correctAnswer: 2,
    explanation: "Sachin Tendulkar scored 200 not out against South Africa at Gwalior on February 24, 2010.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-018",
    question: "What is the highest team total ever scored in Test match cricket history (952/6 dec)?",
    options: ["Sri Lanka vs India (1997)", "England vs Australia (1938)", "West Indies vs England (1958)", "Pakistan vs India (1983)"],
    correctAnswer: 0,
    explanation: "Sri Lanka declared at 952/6 against India in Colombo in August 1997, powered by Sanath Jayasuriya's 340.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-019",
    question: "Who holds the record for the highest individual score in a Men's T20 International (172 runs)?",
    options: ["Aaron Finch", "Chris Gayle", "Glenn Maxwell", "Hazratullah Zazai"],
    correctAnswer: 0,
    explanation: "Australia's Aaron Finch blasted 172 off 76 balls against Zimbabwe in Harare in 2018.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-020",
    question: "Which fast bowler has taken the most Test wickets in history (over 700 wickets)?",
    options: ["Glenn McGrath", "Courtney Walsh", "James Anderson", "Stuart Broad"],
    correctAnswer: 2,
    explanation: "England's James Anderson took 704 Test wickets, the most ever by a pace bowler in Test cricket history.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-021",
    question: "Who holds the record for the fastest century in Test cricket (54 balls)?",
    options: ["Viv Richards", "Brendon McCullum", "Adam Gilchrist", "Misbah-ul-Haq"],
    correctAnswer: 1,
    explanation: "Brendon McCullum scored a 54-ball century in his final Test match against Australia at Christchurch in 2016.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-022",
    question: "Which wicketkeeper holds the record for the most dismissals in international cricket (998 dismissals)?",
    options: ["Adam Gilchrist", "MS Dhoni", "Mark Boucher", "Kumar Sangakkara"],
    correctAnswer: 2,
    explanation: "South Africa's Mark Boucher claimed 998 dismissals (952 catches and 46 stumpings) across international cricket.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-023",
    question: "Who holds the world record for the most stumpings in international cricket (195 stumpings)?",
    options: ["Kumar Sangakkara", "MS Dhoni", "Romesh Kaluwitharana", "Kamran Akmal"],
    correctAnswer: 1,
    explanation: "MS Dhoni leads the all-time stumping charts with 195 stumpings across all formats.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-024",
    question: "Who holds the record for the most runs in a single edition of an ICC Men's Cricket World Cup (765 runs in 2023)?",
    options: ["Sachin Tendulkar", "Rohit Sharma", "Virat Kohli", "Matthew Hayden"],
    correctAnswer: 2,
    explanation: "Virat Kohli scored 765 runs in 11 innings with 3 centuries and 6 fifties during the 2023 World Cup.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-025",
    question: "Which bowler took a hat-trick on the first three balls of a Test match in Karachi in 2006?",
    options: ["Wasim Akram", "Irfan Pathan", "Shoaib Akhtar", "Glenn McGrath"],
    correctAnswer: 1,
    explanation: "India's Irfan Pathan dismissed Salman Butt, Younis Khan, and Mohammad Yousuf in the first over.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-026",
    question: "Who holds the world record for the highest partnership in ODI history (372 runs)?",
    options: [
      "Chris Gayle & Marlon Samuels",
      "Sachin Tendulkar & Rahul Dravid",
      "Sourav Ganguly & Rahul Dravid",
      "John Campbell & Shai Hope"
    ],
    correctAnswer: 0,
    explanation: "Gayle (215) and Samuels (133*) combined for 372 against Zimbabwe at Canberra in the 2015 World Cup.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-027",
    question: "Who is the only batsman in history to score three double centuries in One Day Internationals?",
    options: ["Chris Gayle", "Martin Guptill", "Rohit Sharma", "Virender Sehwag"],
    correctAnswer: 2,
    explanation: "Rohit Sharma hit 209 (vs Australia, 2013), 264 (vs Sri Lanka, 2014), and 208* (vs Sri Lanka, 2017).",
    difficulty: "easy"
  },
  {
    questionId: "cwr-028",
    question: "What is the lowest team score ever recorded in a completed Test match innings (26 all out)?",
    options: ["New Zealand vs England (1955)", "South Africa vs England (1896)", "India vs Australia (2020)", "Australia vs England (1902)"],
    correctAnswer: 0,
    explanation: "New Zealand were bowled out for just 26 runs against England at Eden Park, Auckland in 1955.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-029",
    question: "Who was the first bowler to reach 500 wickets in One Day Internationals?",
    options: ["Muttiah Muralitharan", "Wasim Akram", "Waqar Younis", "Glenn McGrath"],
    correctAnswer: 1,
    explanation: "Wasim Akram became the first to breach the 500-wicket milestone in ODIs during the 2003 World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-030",
    question: "Who scored the fastest double century in Test cricket (off 153 balls)?",
    options: ["Virender Sehwag", "Nathan Astle", "Brendon McCullum", "Adam Gilchrist"],
    correctAnswer: 1,
    explanation: "New Zealand's Nathan Astle blasted a double century in 153 balls against England at Christchurch in 2002.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-031",
    question: "Which batsman holds the record for the most runs in an over in Test cricket (35 runs off Stuart Broad)?",
    options: ["Brian Lara", "Jasprit Bumrah", "Shahid Afridi", "George Bailey"],
    correctAnswer: 1,
    explanation: "India captain Jasprit Bumrah smashed 29 runs off the bat (plus 6 extras) in a 35-run over from Broad at Edgbaston in 2022.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-032",
    question: "Who holds the record for the most catches by a non-wicketkeeper in Test cricket (210 catches)?",
    options: ["Ricky Ponting", "Rahul Dravid", "Jacques Kallis", "Mahela Jayawardene"],
    correctAnswer: 1,
    explanation: "Rahul Dravid 'The Wall' holds the Test world record with 210 catches, mostly at first slip.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-033",
    question: "Who took four wickets in four consecutive balls twice in international cricket?",
    options: ["Lasith Malinga", "Rashid Khan", "Wasim Akram", "Brett Lee"],
    correctAnswer: 0,
    explanation: "Lasith Malinga achieved 4 wickets in 4 balls against South Africa in 2007 (ODI) and New Zealand in 2019 (T20I).",
    difficulty: "medium"
  },
  {
    questionId: "cwr-034",
    question: "Who holds the record for the highest individual score in Women's ODIs (232 not out)?",
    options: ["Belinda Clark", "Amelia Kerr", "Deepti Sharma", "Meg Lanning"],
    correctAnswer: 1,
    explanation: "New Zealand's Amelia Kerr scored 232* off 145 balls against Ireland in Dublin in 2018.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-035",
    question: "Who holds the record for the highest team total in Men's T20 Internationals (314/3)?",
    options: ["Afghanistan", "Nepal", "India", "Czech Republic"],
    correctAnswer: 1,
    explanation: "Nepal scored 314/3 against Mongolia in the Asian Games in Hangzhou in September 2023.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-036",
    question: "Who holds the record for playing the most consecutive Test matches without missing one (159 Tests)?",
    options: ["Alastair Cook", "Allan Border", "Mark Waugh", "Brendon McCullum"],
    correctAnswer: 0,
    explanation: "Sir Alastair Cook played 159 consecutive Tests for England between 2006 and 2018.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-037",
    question: "Who was the first cricketer to play 100 T20 Internationals?",
    options: ["Rohit Sharma", "Shoaib Malik", "Shahid Afridi", "Eoin Morgan"],
    correctAnswer: 1,
    explanation: "Pakistan's Shoaib Malik was the first male cricketer to cross the 100 T20I appearance landmark.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-038",
    question: "Who holds the record for the best bowling figures in a Men's T20 International (6 wickets for 7 runs)?",
    options: ["Deepak Chahar", "Syazrul Idrus", "Ajantha Mendis", "Rashid Khan"],
    correctAnswer: 1,
    explanation: "Malaysia's Syazrul Idrus took 7 wickets for 8 runs against China in 2023 (or Deepak Chahar 6/7 among full members).",
    difficulty: "hard"
  },
  {
    questionId: "cwr-039",
    question: "Who holds the record for the most centuries in a single ICC Cricket World Cup tournament (5 centuries in 2019)?",
    options: ["Kumar Sangakkara", "Rohit Sharma", "Quinton de Kock", "Matthew Hayden"],
    correctAnswer: 1,
    explanation: "Rohit Sharma scored a record 5 centuries during the 2019 ICC World Cup in England.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-040",
    question: "Who holds the record for the most Player of the Match awards in international cricket history (76 awards)?",
    options: ["Virat Kohli", "Sachin Tendulkar", "Sanath Jayasuriya", "Jacques Kallis"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar won 76 Player of the Match awards (62 in ODIs, 14 in Tests) across his illustrious career.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-041",
    question: "What is the longest recorded cricket match in history in terms of playing days (Timeless Test)?",
    options: ["10 days (South Africa vs England, 1939)", "7 days (Australia vs England, 1929)", "8 days (West Indies vs England, 1930)", "12 days (England vs Australia, 1921)"],
    correctAnswer: 0,
    explanation: "The 1939 Timeless Test in Durban lasted 10 days before being declared a draw so England could catch their boat home.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-042",
    question: "Who holds the record for the most wickets in a single ICC World Cup tournament (27 wickets in 2019)?",
    options: ["Glenn McGrath", "Mitchell Starc", "Mohammed Shami", "Muttiah Muralitharan"],
    correctAnswer: 1,
    explanation: "Mitchell Starc took 27 wickets in the 2019 World Cup, surpassing Glenn McGrath's 26 wickets in 2007.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-043",
    question: "Who scored the first ever double century in Women's ODI cricket history in 1997?",
    options: ["Belinda Clark", "Amelia Kerr", "Mithali Raj", "Charlotte Edwards"],
    correctAnswer: 0,
    explanation: "Australia's Belinda Clark scored 229* against Denmark at Mumbai in December 1997, 13 years before Sachin's men's 200.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-044",
    question: "Which bowler took a hat-trick in his very first over on his ODI debut?",
    options: ["Taijul Islam", "Wanindu Hasaranga", "Kagiso Rabada", "Shehan Madushanka"],
    correctAnswer: 0,
    explanation: "Bangladesh spinner Taijul Islam achieved an ODI debut hat-trick against Zimbabwe in Dhaka in 2014.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-045",
    question: "Who holds the record for the most sixes hit in a single ODI innings (17 sixes)?",
    options: ["Rohit Sharma", "Chris Gayle", "Eoin Morgan", "AB de Villiers"],
    correctAnswer: 2,
    explanation: "England captain Eoin Morgan smashed 17 sixes against Afghanistan at Old Trafford in the 2019 World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-046",
    question: "Who holds the record for the highest individual score on Test debut (287 runs)?",
    options: ["Tip Foster", "Jacques Rudolph", "Lawrence Rowe", "Kyle Mayers"],
    correctAnswer: 0,
    explanation: "RE 'Tip' Foster scored 287 for England against Australia at Sydney in 1903, a record that still stands today.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-047",
    question: "Who was the fastest batsman to reach 10,000 runs in ODI cricket (in just 205 innings)?",
    options: ["Sachin Tendulkar", "Virat Kohli", "Rohit Sharma", "Sourav Ganguly"],
    correctAnswer: 1,
    explanation: "Virat Kohli reached 10,000 ODI runs in only 205 innings, beating Tendulkar's previous record of 259 innings.",
    difficulty: "easy"
  },
  {
    questionId: "cwr-048",
    question: "Who holds the world record for the most dismissals in a single Test match by a wicketkeeper (11 dismissals)?",
    options: ["Jack Russell, AB de Villiers, and Rishabh Pant", "Adam Gilchrist and MS Dhoni", "Mark Boucher and Ian Healy", "Rod Marsh and Ridley Jacobs"],
    correctAnswer: 0,
    explanation: "Jack Russell (1995), AB de Villiers (2013), and Rishabh Pant (2018) each took 11 catches in a single Test match.",
    difficulty: "hard"
  },
  {
    questionId: "cwr-049",
    question: "Which team successfully chased down the highest target in ODI history (438 runs)?",
    options: ["Australia", "South Africa", "England", "India"],
    correctAnswer: 1,
    explanation: "South Africa scored 438/9 to beat Australia's 434/4 in the legendary 5th ODI at Johannesburg in March 2006.",
    difficulty: "medium"
  },
  {
    questionId: "cwr-050",
    question: "Who has scored the most runs in T20 International history?",
    options: ["Virat Kohli", "Rohit Sharma", "Babar Azam", "Martin Guptill"],
    correctAnswer: 1,
    explanation: "Rohit Sharma finished his T20I career after winning the 2024 T20 World Cup with a record 4,231 runs.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'guess-ipl-team.json'),
  JSON.stringify(guessIplTeamQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated guess-ipl-team.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'cricket-world-records.json'),
  JSON.stringify(cricketWorldRecordsQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated cricket-world-records.json (50 questions)');
