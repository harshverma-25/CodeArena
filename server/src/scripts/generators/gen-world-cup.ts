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

// 10. ICC World Cup Challenge (50 questions)
const worldCupQuestions: Question[] = [
  {
    questionId: "wc-001",
    question: "Which nation has won the most men's ICC Cricket World Cup (ODI) titles?",
    options: ["India", "West Indies", "Australia", "England"],
    correctAnswer: 2,
    explanation: "Australia has won 6 men's ODI World Cup titles (1987, 1999, 2003, 2007, 2015, and 2023).",
    difficulty: "easy"
  },
  {
    questionId: "wc-002",
    question: "Who was the captain of the Indian cricket team that won their first-ever World Cup in 1983?",
    options: ["Sunil Gavaskar", "Kapil Dev", "Mohinder Amarnath", "Ravi Shastri"],
    correctAnswer: 1,
    explanation: "Kapil Dev led India's underdogs to victory against the mighty West Indies at Lord's in 1983.",
    difficulty: "easy"
  },
  {
    questionId: "wc-003",
    question: "In which year did India win their second ODI World Cup on home soil?",
    options: ["2007", "2011", "2015", "2019"],
    correctAnswer: 1,
    explanation: "MS Dhoni's team won the 2011 ICC Cricket World Cup, defeating Sri Lanka in the final at Wankhede Stadium.",
    difficulty: "easy"
  },
  {
    questionId: "wc-004",
    question: "Who hit the iconic winning six in the 2011 World Cup final in Mumbai?",
    options: ["Gautam Gambhir", "Yuvraj Singh", "MS Dhoni", "Sachin Tendulkar"],
    correctAnswer: 2,
    explanation: "MS Dhoni struck Nuwan Kulasekara into the stands, famously called by Ravi Shastri.",
    difficulty: "easy"
  },
  {
    questionId: "wc-005",
    question: "Which team won the inaugural men's Cricket World Cup in 1975 held in England?",
    options: ["Australia", "West Indies", "England", "Pakistan"],
    correctAnswer: 1,
    explanation: "Clive Lloyd's West Indies won the first two World Cups in 1975 and 1979.",
    difficulty: "easy"
  },
  {
    questionId: "wc-006",
    question: "Who won the Player of the Tournament in the 2011 Cricket World Cup for his all-round heroics?",
    options: ["Sachin Tendulkar", "Yuvraj Singh", "Zaheer Khan", "Kumar Sangakkara"],
    correctAnswer: 1,
    explanation: "Yuvraj Singh scored 362 runs and took 15 wickets while battling early-stage cancer.",
    difficulty: "easy"
  },
  {
    questionId: "wc-007",
    question: "Who holds the record for the most runs scored in a single edition of an ODI World Cup?",
    options: ["Sachin Tendulkar (2003)", "Matthew Hayden (2007)", "Rohit Sharma (2019)", "Virat Kohli (2023)"],
    correctAnswer: 3,
    explanation: "Virat Kohli scored a record-shattering 765 runs in the 2023 ODI World Cup.",
    difficulty: "easy"
  },
  {
    questionId: "wc-008",
    question: "Who hit 5 centuries in a single World Cup tournament in 2019?",
    options: ["David Warner", "Rohit Sharma", "Kane Williamson", "Joe Root"],
    correctAnswer: 1,
    explanation: "Rohit Sharma became the first batsman to score 5 hundreds in a single World Cup edition.",
    difficulty: "easy"
  },
  {
    questionId: "wc-009",
    question: "Which captain led Pakistan to their sole ODI World Cup triumph in 1992 in Australia?",
    options: ["Wasim Akram", "Javed Miandad", "Imran Khan", "Inzamam-ul-Haq"],
    correctAnswer: 2,
    explanation: "Imran Khan rallied his 'cornered tigers' to defeat England at the Melbourne Cricket Ground.",
    difficulty: "easy"
  },
  {
    questionId: "wc-010",
    question: "Which team won the thrilling 2019 ICC World Cup final on boundary countback at Lord's?",
    options: ["New Zealand", "England", "Australia", "India"],
    correctAnswer: 1,
    explanation: "England tied New Zealand in the main 50 overs and in the Super Over, winning by boundary count.",
    difficulty: "easy"
  },
  {
    questionId: "wc-011",
    question: "Who won the inaugural ICC Men's T20 World Cup in 2007 in South Africa?",
    options: ["Pakistan", "India", "Australia", "South Africa"],
    correctAnswer: 1,
    explanation: "A young Indian team captained by MS Dhoni defeated Pakistan by 5 runs in Johannesburg.",
    difficulty: "easy"
  },
  {
    questionId: "wc-012",
    question: "Who hit Stuart Broad for six sixes in an over during the 2007 T20 World Cup?",
    options: ["Chris Gayle", "Yuvraj Singh", "MS Dhoni", "Virender Sehwag"],
    correctAnswer: 1,
    explanation: "Yuvraj Singh smashed 6 sixes in Durban, reaching a half-century in just 12 balls.",
    difficulty: "easy"
  },
  {
    questionId: "wc-013",
    question: "Which bowler took a hat-trick in the 1987 World Cup for India against New Zealand?",
    options: ["Kapil Dev", "Chetan Sharma", "Manoj Prabhakar", "Maninder Singh"],
    correctAnswer: 1,
    explanation: "Chetan Sharma took the first-ever hat-trick in World Cup history by clean bowling three Kiwi batsmen.",
    difficulty: "medium"
  },
  {
    questionId: "wc-014",
    question: "What is the highest individual score in an ODI World Cup match?",
    options: ["Chris Gayle (215)", "Martin Guptill (237*)", "Glenn Maxwell (201*)", "Rohit Sharma (264)"],
    correctAnswer: 1,
    explanation: "Martin Guptill blasted 237 not out against the West Indies in Wellington in the 2015 World Cup quarter-final.",
    difficulty: "medium"
  },
  {
    questionId: "wc-015",
    question: "Who scored an astonishing 201 not out battling severe cramps to win from 91/7 in the 2023 World Cup?",
    options: ["Glenn Maxwell", "Travis Head", "Pat Cummins", "Mitchell Marsh"],
    correctAnswer: 0,
    explanation: "Glenn Maxwell's double century against Afghanistan in Mumbai is considered the greatest ODI chase ever.",
    difficulty: "easy"
  },
  {
    questionId: "wc-016",
    question: "Who was the Man of the Match in the 1983 World Cup final?",
    options: ["Kapil Dev", "Mohinder Amarnath", "Kris Srikkanth", "Madan Lal"],
    correctAnswer: 1,
    explanation: "Mohinder Amarnath scored 26 runs and took 3 crucial wickets for just 12 runs.",
    difficulty: "medium"
  },
  {
    questionId: "wc-017",
    question: "Which team won the 1996 Cricket World Cup under Arjuna Ranatunga?",
    options: ["India", "Pakistan", "Sri Lanka", "Australia"],
    correctAnswer: 2,
    explanation: "Sri Lanka revolutionized pinch-hitting with Jayasuriya and Kaluwitharana, defeating Australia in Lahore.",
    difficulty: "easy"
  },
  {
    questionId: "wc-018",
    question: "Who is the leading wicket-taker in ICC Men's ODI World Cup history?",
    options: ["Wasim Akram", "Glenn McGrath (71 wickets)", "Muttiah Muralitharan", "Mitchell Starc"],
    correctAnswer: 1,
    explanation: "Australia's Glenn McGrath took 71 wickets across four World Cup tournaments (1996-2007).",
    difficulty: "medium"
  },
  {
    questionId: "wc-019",
    question: "Who took 7 wickets for 57 runs against New Zealand in the 2023 World Cup semi-final?",
    options: ["Jasprit Bumrah", "Mohammed Shami", "Kuldeep Yadav", "Ravindra Jadeja"],
    correctAnswer: 1,
    explanation: "Mohammed Shami's 7/57 at Wankhede Stadium was the best-ever bowling performance by an Indian in ODIs.",
    difficulty: "easy"
  },
  {
    questionId: "wc-020",
    question: "Who holds the record for the fastest century in ODI World Cup history (off 40 balls)?",
    options: ["Kevin O'Brien", "AB de Villiers", "Glenn Maxwell", "Aiden Markram"],
    correctAnswer: 2,
    explanation: "Glenn Maxwell blasted a 40-ball century against the Netherlands in Delhi in the 2023 World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "wc-021",
    question: "Which nation won the 2024 ICC Men's T20 World Cup in Barbados under Rohit Sharma?",
    options: ["South Africa", "India", "Australia", "England"],
    correctAnswer: 1,
    explanation: "India defeated South Africa by 7 runs in a thrilling final in Bridgetown, Barbados.",
    difficulty: "easy"
  },
  {
    questionId: "wc-022",
    question: "Who took the miraculous boundary catch of David Miller in the final over of the 2024 T20 World Cup final?",
    options: ["Virat Kohli", "Suryakumar Yadav", "Hardik Pandya", "Axar Patel"],
    correctAnswer: 1,
    explanation: "Suryakumar Yadav juggled the ball on the boundary rope in one of cricket's most clutch catches.",
    difficulty: "easy"
  },
  {
    questionId: "wc-023",
    question: "Which bowler bowled the high-pressure final over in the 2024 T20 World Cup final defending 16 runs?",
    options: ["Jasprit Bumrah", "Arshdeep Singh", "Hardik Pandya", "Kuldeep Yadav"],
    correctAnswer: 2,
    explanation: "Hardik Pandya defended 16 runs in the 20th over to seal India's World Cup victory.",
    difficulty: "easy"
  },
  {
    questionId: "wc-024",
    question: "Who was named Player of the Tournament in the 2024 ICC T20 World Cup for his masterclass bowling?",
    options: ["Rohit Sharma", "Jasprit Bumrah", "Arshdeep Singh", "Anrich Nortje"],
    correctAnswer: 1,
    explanation: "Jasprit Bumrah took 15 wickets at an astonishing economy rate of 4.17.",
    difficulty: "easy"
  },
  {
    questionId: "wc-025",
    question: "Which team won two consecutive ICC Men's T20 World Cups in 2012 and 2016 under Darren Sammy?",
    options: ["West Indies", "England", "Australia", "India"],
    correctAnswer: 0,
    explanation: "The West Indies are the first two-time champions of the men's T20 World Cup.",
    difficulty: "easy"
  },
  {
    questionId: "wc-026",
    question: "Who hit four consecutive sixes off Ben Stokes in the final over to win the 2016 T20 World Cup for West Indies?",
    options: ["Chris Gayle", "Carlos Brathwaite", "Andre Russell", "Marlon Samuels"],
    correctAnswer: 1,
    explanation: "Carlos Brathwaite ('Remember the name!') smashed four consecutive sixes at Eden Gardens.",
    difficulty: "easy"
  },
  {
    questionId: "wc-027",
    question: "Which Australian captain led his side to undefeated World Cup titles in both 2003 and 2007?",
    options: ["Steve Waugh", "Ricky Ponting", "Michael Clarke", "Mark Taylor"],
    correctAnswer: 1,
    explanation: "Ricky Ponting captained Australia during their peak era of global dominance.",
    difficulty: "easy"
  },
  {
    questionId: "wc-028",
    question: "Who was the first batsman to score a double century in men's ODI World Cup history (against Zimbabwe in 2015)?",
    options: ["Chris Gayle", "Martin Guptill", "Rohit Sharma", "Virender Sehwag"],
    correctAnswer: 0,
    explanation: "Chris Gayle scored 215 off 147 balls in Canberra during the 2015 World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "wc-029",
    question: "Which team was famously banned from international cricket and readmitted just in time for the 1992 World Cup?",
    options: ["South Africa", "Zimbabwe", "Kenya", "Namibia"],
    correctAnswer: 0,
    explanation: "South Africa returned to the World Cup arena in 1992 following the end of apartheid.",
    difficulty: "medium"
  },
  {
    questionId: "wc-030",
    question: "What controversial rain rule in 1992 famously left South Africa needing 22 runs off 1 ball in the semi-final?",
    options: ["Duckworth-Lewis", "Highest-Scoring Overs rule (Rain Rule)", "VJD Method", "Net Run Rate"],
    correctAnswer: 1,
    explanation: "The bizarre Most Productive Overs rule reduced the target from 22 off 13 balls to 22 off 1 ball after a brief rain shower.",
    difficulty: "hard"
  },
  {
    questionId: "wc-031",
    question: "Which associate nation made a historic run to the semi-finals of the 2003 Cricket World Cup?",
    options: ["Netherlands", "Kenya", "Canada", "Namibia"],
    correctAnswer: 1,
    explanation: "Steve Tikolo's Kenya stunned Sri Lanka and Zimbabwe to reach the 2003 semi-finals.",
    difficulty: "medium"
  },
  {
    questionId: "wc-032",
    question: "Who scored an iconic unbeaten 175 against Zimbabwe from 17/5 in the 1983 World Cup that was never televised?",
    options: ["Kapil Dev", "Sunil Gavaskar", "Sandeep Patil", "Kirti Azad"],
    correctAnswer: 0,
    explanation: "BBC technicians were on strike, leaving Kapil Dev's match-saving 175* unrecorded on film.",
    difficulty: "easy"
  },
  {
    questionId: "wc-033",
    question: "Who hit 4 consecutive centuries in the 2015 World Cup for Sri Lanka?",
    options: ["Kumar Sangakkara", "Mahela Jayawardene", "Tillakaratne Dilshan", "Sanath Jayasuriya"],
    correctAnswer: 0,
    explanation: "Kumar Sangakkara scored centuries against Bangladesh, England, Australia, and Scotland.",
    difficulty: "medium"
  },
  {
    questionId: "wc-034",
    question: "Who holds the record for the most total centuries (7) in ICC Cricket World Cup history?",
    options: ["Sachin Tendulkar", "Rohit Sharma", "Ricky Ponting", "David Warner"],
    correctAnswer: 1,
    explanation: "Rohit Sharma has 7 World Cup hundreds, surpassing Sachin Tendulkar's tally of 6.",
    difficulty: "easy"
  },
  {
    questionId: "wc-035",
    question: "Who was the Man of the Match in the 2023 ODI World Cup final for his match-winning 137?",
    options: ["Travis Head", "Marnus Labuschagne", "Pat Cummins", "Mitchell Starc"],
    correctAnswer: 0,
    explanation: "Travis Head scored 137 at Ahmedabad to guide Australia to their sixth World Cup title.",
    difficulty: "easy"
  },
  {
    questionId: "wc-036",
    question: "Who captained Australia to victory in the 2015 World Cup on home soil?",
    options: ["Michael Clarke", "Steve Smith", "George Bailey", "David Warner"],
    correctAnswer: 0,
    explanation: "Michael Clarke dedicated Australia's 2015 victory to the late Phillip Hughes.",
    difficulty: "medium"
  },
  {
    questionId: "wc-037",
    question: "Who took four wickets in four balls against South Africa in the 2007 World Cup in Guyana?",
    options: ["Lasith Malinga", "Chaminda Vaas", "Muttiah Muralitharan", "Shoaib Akhtar"],
    correctAnswer: 0,
    explanation: "Lasith Malinga cleaned up Pollock, Hall, Kallis, and Ntini in four consecutive deliveries.",
    difficulty: "medium"
  },
  {
    questionId: "wc-038",
    question: "Who scored the fastest 50 in World Cup history (off 18 balls) for New Zealand against England in 2015?",
    options: ["Brendon McCullum", "Martin Guptill", "Ross Taylor", "Kane Williamson"],
    correctAnswer: 0,
    explanation: "Brendon McCullum destroyed Steven Finn and England's bowling in Wellington.",
    difficulty: "hard"
  },
  {
    questionId: "wc-039",
    question: "Which Indian batsman scored 97 under pressure in the 2011 World Cup final after Sehwag and Tendulkar fell early?",
    options: ["Gautam Gambhir", "Virat Kohli", "Suresh Raina", "Yuvraj Singh"],
    correctAnswer: 0,
    explanation: "Gautam Gambhir anchored India's chase with a gritty 97 runs.",
    difficulty: "easy"
  },
  {
    questionId: "wc-040",
    question: "Who scored the winning boundary in the 1999 World Cup final at Lord's between Australia and Pakistan?",
    options: ["Darren Lehmann", "Steve Waugh", "Adam Gilchrist", "Mark Waugh"],
    correctAnswer: 0,
    explanation: "Darren Lehmann hit the winning runs as Australia chased down 133 with 8 wickets in hand.",
    difficulty: "hard"
  },
  {
    questionId: "wc-041",
    question: "Which team holds the record for the highest team total in a Men's ODI World Cup match (428/5 against Sri Lanka in 2023)?",
    options: ["South Africa", "Australia", "India", "England"],
    correctAnswer: 0,
    explanation: "South Africa posted 428/5 in Delhi with centuries from De Kock, Van der Dussen, and Markram.",
    difficulty: "medium"
  },
  {
    questionId: "wc-042",
    question: "What was the lowest team total ever recorded in an ODI World Cup match (35 all out by Canada in 2003)?",
    options: ["Canada (35 all out vs Sri Lanka)", "Namibia (45)", "Bermuda (49)", "Netherlands (52)"],
    correctAnswer: 0,
    explanation: "Chaminda Vaas and Prabath Nissanka routed Canada for 35 in Paarl.",
    difficulty: "hard"
  },
  {
    questionId: "wc-043",
    question: "Who was the tournament top run-scorer in the 1996 World Cup on the subcontinent with 523 runs?",
    options: ["Sachin Tendulkar", "Mark Waugh", "Aravinda de Silva", "Brian Lara"],
    correctAnswer: 0,
    explanation: "Sachin Tendulkar scored two centuries and averaged 87.16 in 1996.",
    difficulty: "medium"
  },
  {
    questionId: "wc-044",
    question: "Who won the Player of the Tournament in the 2003 Cricket World Cup?",
    options: ["Sachin Tendulkar (673 runs)", "Ricky Ponting", "Brett Lee", "Sourav Ganguly"],
    correctAnswer: 0,
    explanation: "Sachin Tendulkar was named Player of the Tournament for his 673 runs in South Africa.",
    difficulty: "easy"
  },
  {
    questionId: "wc-045",
    question: "Who holds the record for the most dismissals as a wicket-keeper in ODI World Cup history?",
    options: ["Kumar Sangakkara (54)", "Adam Gilchrist (52)", "MS Dhoni (42)", "Mark Boucher (31)"],
    correctAnswer: 0,
    explanation: "Kumar Sangakkara holds the record with 54 dismissals (41 catches, 13 stumpings).",
    difficulty: "hard"
  },
  {
    questionId: "wc-046",
    question: "Which team won the 2021 ICC Men's T20 World Cup held in the UAE under Aaron Finch?",
    options: ["Australia", "New Zealand", "Pakistan", "India"],
    correctAnswer: 0,
    explanation: "Australia defeated New Zealand in Dubai to claim their first Men's T20 World Cup title.",
    difficulty: "easy"
  },
  {
    questionId: "wc-047",
    question: "Who was the Player of the Match in the 2022 T20 World Cup final at Melbourne for England?",
    options: ["Sam Curran (3/12)", "Ben Stokes", "Jos Buttler", "Alex Hales"],
    correctAnswer: 0,
    explanation: "Sam Curran took 3/12 against Pakistan and won both Player of the Match and Player of the Tournament.",
    difficulty: "medium"
  },
  {
    questionId: "wc-048",
    question: "Who was the first batsman to score a century in T20 World Cup history (against South Africa in 2007)?",
    options: ["Chris Gayle (117)", "Brendon McCullum", "Yuvraj Singh", "Mahela Jayawardene"],
    correctAnswer: 0,
    explanation: "Chris Gayle smashed 117 off 57 balls in the opening match of the 2007 T20 World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "wc-049",
    question: "What venue hosted the finals of both the 1975, 1979, 1983, and 2019 ODI World Cups?",
    options: ["Lord's Cricket Ground, London", "Melbourne Cricket Ground", "The Oval", "Eden Gardens"],
    correctAnswer: 0,
    explanation: "Lord's ('The Home of Cricket') has hosted a record five men's World Cup finals.",
    difficulty: "easy"
  },
  {
    questionId: "wc-050",
    question: "Which team holds the record for 34 consecutive World Cup match victories between 1999 and 2011?",
    options: ["Australia", "India", "West Indies", "South Africa"],
    correctAnswer: 0,
    explanation: "Australia went unbeaten across three full World Cups until Pakistan ended the streak in 2011.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'icc-world-cup.json'),
  JSON.stringify(worldCupQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated icc-world-cup.json (50 questions)');
