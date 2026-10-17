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

// 11. Indian Cricket Legends (50 questions)
const legendsQuestions: Question[] = [
  {
    questionId: "icl-001",
    question: "Who is universally revered as the 'God of Cricket' and holds the record for 100 international centuries?",
    options: ["Virat Kohli", "Sachin Tendulkar", "Sunil Gavaskar", "Rahul Dravid"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar scored 51 Test centuries and 49 ODI centuries over a 24-year career.",
    difficulty: "easy"
  },
  {
    questionId: "icl-002",
    question: "Who was the first batsman in cricket history to score 10,000 runs in Test matches without wearing a helmet?",
    options: ["Sunil Gavaskar", "Gundappa Viswanath", "Kapil Dev", "Dilip Vengsarkar"],
    correctAnswer: 0,
    explanation: "Sunil 'Sunny' Gavaskar crossed the 10,000-run milestone against Pakistan in Ahmedabad in 1987.",
    difficulty: "easy"
  },
  {
    questionId: "icl-003",
    question: "Who is known as 'The Wall' of Indian cricket for his impregnable defense and patience?",
    options: ["VVS Laxman", "Rahul Dravid", "Cheteshwar Pujara", "Sourav Ganguly"],
    correctAnswer: 1,
    explanation: "Rahul Dravid faced more deliveries (31,258) than any other batsman in Test cricket history.",
    difficulty: "easy"
  },
  {
    questionId: "icl-004",
    question: "Which Indian captain is celebrated as 'Captain Cool' and is the only captain to win all three white-ball ICC trophies (T20 WC, ODI WC, Champions Trophy)?",
    options: ["Sourav Ganguly", "Virat Kohli", "MS Dhoni", "Rohit Sharma"],
    correctAnswer: 2,
    explanation: "MS Dhoni led India to victory in the 2007 T20 World Cup, 2011 ODI World Cup, and 2013 Champions Trophy.",
    difficulty: "easy"
  },
  {
    questionId: "icl-005",
    question: "Who is the legendary leg-spinner who took all 10 wickets in a single Test innings against Pakistan in Delhi (1999)?",
    options: ["Anil Kumble", "Harbhajan Singh", "Bishan Singh Bedi", "R. Ashwin"],
    correctAnswer: 0,
    explanation: "Anil Kumble became only the second bowler after Jim Laker to claim a perfect 10-wicket innings (10/74).",
    difficulty: "easy"
  },
  {
    questionId: "icl-006",
    question: "Who played the legendary epic knock of 281 at Eden Gardens in 2001 to defeat Australia after following on?",
    options: ["VVS Laxman", "Rahul Dravid", "Sachin Tendulkar", "Sourav Ganguly"],
    correctAnswer: 0,
    explanation: "VVS Laxman's 281 alongside Dravid's 180 snapped Australia's 16-match winning streak.",
    difficulty: "easy"
  },
  {
    questionId: "icl-007",
    question: "Who was nicknamed 'Dada' and the 'Prince of Calcutta', famously taking off his jersey on the Lord's balcony in 2002?",
    options: ["Virender Sehwag", "Sourav Ganguly", "Yuvraj Singh", "Harbhajan Singh"],
    correctAnswer: 1,
    explanation: "Sourav Ganguly waved his jersey after India won the NatWest Series final chasing 326.",
    difficulty: "easy"
  },
  {
    questionId: "icl-008",
    question: "Who is the 'Nawab of Najafgarh' and the only Indian batsman to score two triple-centuries in Test cricket?",
    options: ["Virender Sehwag", "Rohit Sharma", "Karun Nair", "Sunil Gavaskar"],
    correctAnswer: 0,
    explanation: "Virender Sehwag scored 309 in Multan (2004) and 319 in Chennai (2008).",
    difficulty: "easy"
  },
  {
    questionId: "icl-009",
    question: "Who is the 'Haryana Hurricane' who led India to the 1983 World Cup and finished with 434 Test wickets?",
    options: ["Kapil Dev", "Manoj Prabhakar", "Javon Srinath", "Zaheer Khan"],
    correctAnswer: 0,
    explanation: "Kapil Dev was India's premier all-rounder who held the world record for most Test wickets until 1999.",
    difficulty: "easy"
  },
  {
    questionId: "icl-010",
    question: "Who was the off-spinner nicknamed 'The Turbanator' who became the first Indian to take a Test hat-trick in 2001?",
    options: ["Harbhajan Singh", "R. Ashwin", "Erapalli Prasanna", "Srinivas Venkataraghavan"],
    correctAnswer: 0,
    explanation: "Harbhajan Singh dismissed Ponting, Gilchrist, and Warne in three consecutive balls at Eden Gardens.",
    difficulty: "easy"
  },
  {
    questionId: "icl-011",
    question: "Who holds the record for the most player-of-the-series awards in Test cricket for India and over 500 Test wickets?",
    options: ["Ravichandran Ashwin", "Anil Kumble", "Ravindra Jadeja", "Harbhajan Singh"],
    correctAnswer: 0,
    explanation: "R. Ashwin is India's second-highest Test wicket-taker and tied for the most Player of the Series awards in history.",
    difficulty: "medium"
  },
  {
    questionId: "icl-012",
    question: "Who was India's left-arm fast bowler known as the 'Knuckleball Master' and joint-highest wicket-taker in the 2011 World Cup?",
    options: ["Zaheer Khan", "Ashish Nehra", "Irfan Pathan", "RP Singh"],
    correctAnswer: 0,
    explanation: "Zaheer Khan took 21 wickets in the 2011 World Cup and spearheaded India's pace attack for over a decade.",
    difficulty: "easy"
  },
  {
    questionId: "icl-013",
    question: "Who holds the record for 50 ODI centuries, surpassing Sachin Tendulkar's 49 in the 2023 World Cup semi-final?",
    options: ["Virat Kohli", "Rohit Sharma", "Shubman Gill", "KL Rahul"],
    correctAnswer: 0,
    explanation: "Virat Kohli reached his 50th ODI hundred at Wankhede Stadium in front of Sachin Tendulkar.",
    difficulty: "easy"
  },
  {
    questionId: "icl-014",
    question: "Who is the only batsman in cricket history to score three double-centuries in ODI cricket?",
    options: ["Rohit Sharma", "Virender Sehwag", "Sachin Tendulkar", "Martin Guptill"],
    correctAnswer: 0,
    explanation: "Rohit Sharma scored 209 against Australia, 264 against Sri Lanka, and 208* against Sri Lanka.",
    difficulty: "easy"
  },
  {
    questionId: "icl-015",
    question: "Who was the brilliant Indian batsman known as 'Colonel' who scored centuries in four consecutive Tests at Lord's?",
    options: ["Dilip Vengsarkar", "Gundappa Viswanath", "Polly Umrigar", "Vijay Hazare"],
    correctAnswer: 0,
    explanation: "Dilip Vengsarkar holds the record for scoring three consecutive centuries at Lord's Cricket Ground.",
    difficulty: "hard"
  },
  {
    questionId: "icl-016",
    question: "Who captained India to their historic first-ever Test series victories in England and West Indies in 1971?",
    options: ["Ajit Wadekar", "Mansoor Ali Khan Pataudi", "Sunil Gavaskar", "Bishen Singh Bedi"],
    correctAnswer: 0,
    explanation: "Ajit Wadekar captained India to landmark triumphs in the Caribbean and England in the same year.",
    difficulty: "medium"
  },
  {
    questionId: "icl-017",
    question: "Who was the 'Tiger' of Indian cricket who captained with only one functional eye after a car accident?",
    options: ["Mansoor Ali Khan Pataudi", "Farokh Engineer", "E.A.S. Prasanna", "Bapu Nadkarni"],
    correctAnswer: 0,
    explanation: "Tiger Pataudi lost his right eye in 1961 but became India's youngest Test captain at age 21.",
    difficulty: "medium"
  },
  {
    questionId: "icl-018",
    question: "Which Indian bowler bowled 21 consecutive maiden overs in a Test match against England in Madras (1964)?",
    options: ["Bapu Nadkarni", "Bishan Bedi", "Subhash Gupte", "Vinoo Mankad"],
    correctAnswer: 0,
    explanation: "Bapu Nadkarni bowled 131 consecutive dot balls (32-27-5-0), an unbroken world record.",
    difficulty: "hard"
  },
  {
    questionId: "icl-019",
    question: "Who was the pioneering all-rounder after whom the running out of a non-striker who backs up too far was named?",
    options: ["Vinoo Mankad", "Lala Amarnath", "C.K. Nayudu", "Syed Mushtaq Ali"],
    correctAnswer: 0,
    explanation: "Vinoo Mankad famously ran out Bill Brown in Australia in 1947, entering the cricket lexicon.",
    difficulty: "easy"
  },
  {
    questionId: "icl-020",
    question: "Who was the first captain of the Indian cricket team in their inaugural Test match at Lord's in 1932?",
    options: ["C.K. Nayudu", "Lala Amarnath", "Vijay Merchant", "Wazir Ali"],
    correctAnswer: 0,
    explanation: "Col. C.K. Nayudu captained India in their first Test against England in 1932.",
    difficulty: "medium"
  },
  {
    questionId: "icl-021",
    question: "Who was the first batsman to score a Test century for independent India?",
    options: ["Lala Amarnath", "Vijay Hazare", "Pankaj Roy", "Polly Umrigar"],
    correctAnswer: 0,
    explanation: "Lala Amarnath scored 118 against England in Bombay in 1933.",
    difficulty: "hard"
  },
  {
    questionId: "icl-022",
    question: "Who took a famous hat-trick in the very first over of a Test match against Pakistan in Karachi (2006)?",
    options: ["Irfan Pathan", "Zaheer Khan", "RP Singh", "S. Sreesanth"],
    correctAnswer: 0,
    explanation: "Irfan Pathan dismissed Salman Butt, Younis Khan, and Mohammad Yousuf in the first over.",
    difficulty: "easy"
  },
  {
    questionId: "icl-023",
    question: "Who was the legendary leg-spinner who bowled with a fractured jaw bandaged with bandages in Antigua (2002) and dismissed Brian Lara?",
    options: ["Anil Kumble", "Harbhajan Singh", "Sarandeep Singh", "Javagal Srinath"],
    correctAnswer: 0,
    explanation: "Anil Kumble bowled 14 consecutive overs with a broken jaw, embodying true courage.",
    difficulty: "easy"
  },
  {
    questionId: "icl-024",
    question: "Who holds the record for the highest score by an Indian batsman in Test cricket (319)?",
    options: ["Virender Sehwag", "Karun Nair", "Virat Kohli", "Sachin Tendulkar"],
    correctAnswer: 0,
    explanation: "Virender Sehwag scored 319 off 304 balls against South Africa in Chennai (2008).",
    difficulty: "medium"
  },
  {
    questionId: "icl-025",
    question: "Who is the only other Indian batsman besides Sehwag to score a triple century in Test cricket (303* vs England in 2016)?",
    options: ["Karun Nair", "Cheteshwar Pujara", "Rohit Sharma", "Mayank Agarwal"],
    correctAnswer: 0,
    explanation: "Karun Nair scored 303 not out in Chennai in his third Test match.",
    difficulty: "medium"
  },
  {
    questionId: "icl-026",
    question: "Which Indian speedster was nicknamed the 'Mysore Express' and led India's pace bowling throughout the 1990s?",
    options: ["Javagal Srinath", "Venkatesh Prasad", "Madan Lal", "Debashish Mohanty"],
    correctAnswer: 0,
    explanation: "Javagal Srinath was clocked over 150 km/h in the 1990s and claimed 236 Test wickets.",
    difficulty: "medium"
  },
  {
    questionId: "icl-027",
    question: "Who had the famous dramatic send-off clash with Aamer Sohail in the 1996 World Cup quarter-final in Bangalore?",
    options: ["Venkatesh Prasad", "Javagal Srinath", "Anil Kumble", "Ashish Nehra"],
    correctAnswer: 0,
    explanation: "After Sohail pointed to the boundary, Venkatesh Prasad clean-bowled him next ball and gestured to the pavilion.",
    difficulty: "easy"
  },
  {
    questionId: "icl-028",
    question: "Which Indian batsman is legendary for his wristy elegance, late cuts, and the master of square cuts in the 1970s?",
    options: ["Gundappa Viswanath", "Sunil Gavaskar", "Dilip Vengsarkar", "Mohinder Amarnath"],
    correctAnswer: 0,
    explanation: "Gundappa Viswanath's wristwork was regarded as the most graceful in world cricket.",
    difficulty: "hard"
  },
  {
    questionId: "icl-029",
    question: "Who was the left-arm spinner and captain who was part of India's famed Spin Quartet with Prasanna, Venkataraghavan, and Chandrasekhar?",
    options: ["Bishan Singh Bedi", "Bapu Nadkarni", "Maninder Singh", "Dilip Doshi"],
    correctAnswer: 0,
    explanation: "Bishan Singh Bedi was renowned for his rhythmic run-up and artistic flight.",
    difficulty: "medium"
  },
  {
    questionId: "icl-030",
    question: "Which leg-spinner in the Spin Quartet overcame a childhood polio-withered right arm to become a terrifying bowler?",
    options: ["B.S. Chandrasekhar", "E.A.S. Prasanna", "Bishan Bedi", "Subhash Gupte"],
    correctAnswer: 0,
    explanation: "Bhagwat Chandrasekhar converted his withered arm into a deadly source of bounce and googlies.",
    difficulty: "hard"
  },
  {
    questionId: "icl-031",
    question: "Which legendary wicket-keeper was known for not wearing thigh guards and keeping with flamboyant charisma in the 1960s-70s?",
    options: ["Farokh Engineer", "Syed Kirmani", "Kiran More", "Nayan Mongia"],
    correctAnswer: 0,
    explanation: "Farokh Engineer was an aggressive batsman and world-class keeper who represented Lancashire.",
    difficulty: "hard"
  },
  {
    questionId: "icl-032",
    question: "Who won the Best Wicketkeeper award in the 1983 World Cup with his brilliant glovework standing up to Kapil Dev?",
    options: ["Syed Kirmani", "Kiran More", "Farokh Engineer", "Parthiv Patel"],
    correctAnswer: 0,
    explanation: "Syed Kirmani took 12 catches and 2 stumpings in the 1983 World Cup.",
    difficulty: "medium"
  },
  {
    questionId: "icl-033",
    question: "Who holds the record for the most catches by a non-wicketkeeper in Test cricket history (210 catches)?",
    options: ["Rahul Dravid", "VVS Laxman", "Jacques Kallis", "Ricky Ponting"],
    correctAnswer: 0,
    explanation: "Rahul Dravid was a premier slip catcher, securing 210 catches in 164 Tests.",
    difficulty: "medium"
  },
  {
    questionId: "icl-034",
    question: "Which Indian batsman scored 6 centuries in his debut Test series against the West Indies in 1971?",
    options: ["Sunil Gavaskar (774 runs)", "Gundappa Viswanath", "Dilip Sardesai", "Ajit Wadekar"],
    correctAnswer: 0,
    explanation: "Sunil Gavaskar amassed 774 runs at an average of 154.80, immortalized in a calypso.",
    difficulty: "medium"
  },
  {
    questionId: "icl-035",
    question: "Who took 6 wickets for 23 runs against England in Durban during the 2003 World Cup?",
    options: ["Ashish Nehra", "Zaheer Khan", "Javagal Srinath", "Harbhajan Singh"],
    correctAnswer: 0,
    explanation: "Ashish Nehra delivered one of India's most devastating left-arm pace spells on an injured ankle.",
    difficulty: "easy"
  },
  {
    questionId: "icl-036",
    question: "Who was the first Indian cricketer to score a century in T20 International cricket (against South Africa in 2010)?",
    options: ["Suresh Raina", "Rohit Sharma", "Virat Kohli", "KL Rahul"],
    correctAnswer: 0,
    explanation: "Suresh Raina scored 101 in Gros Islet during the 2010 World Twenty20.",
    difficulty: "medium"
  },
  {
    questionId: "icl-037",
    question: "Who scored 183 runs off 145 balls against Sri Lanka in Jaipur (2005), the highest ODI score by a wicket-keeper?",
    options: ["MS Dhoni", "Kumar Sangakkara", "Adam Gilchrist", "Quinton de Kock"],
    correctAnswer: 0,
    explanation: "MS Dhoni's blistering 183* featured 15 boundaries and 10 towering sixes.",
    difficulty: "easy"
  },
  {
    questionId: "icl-038",
    question: "Who hit the longest six by an Indian in international cricket (124 meters against Australia in 2007)?",
    options: ["Yuvraj Singh", "MS Dhoni", "Rohit Sharma", "Hardik Pandya"],
    correctAnswer: 0,
    explanation: "Yuvraj Singh flicked Brett Lee over square leg for a monstrous 124-meter six in Durban.",
    difficulty: "medium"
  },
  {
    questionId: "icl-039",
    question: "Who was the Indian captain when India reached the No. 1 ranking in ICC Test cricket for the first time in December 2009?",
    options: ["MS Dhoni", "Sourav Ganguly", "Rahul Dravid", "Anil Kumble"],
    correctAnswer: 0,
    explanation: "MS Dhoni's team defeated Sri Lanka 2-0 in 2009 to take the Test mace for the first time.",
    difficulty: "medium"
  },
  {
    questionId: "icl-040",
    question: "Who has the best bowling figures in an innings for India in ODI cricket (7 for 57)?",
    options: ["Mohammed Shami", "Stuart Binny (6/4)", "Anil Kumble (6/12)", "Jasprit Bumrah (6/19)"],
    correctAnswer: 0,
    explanation: "Mohammed Shami took 7/57 against New Zealand in the 2023 World Cup semi-final.",
    difficulty: "easy"
  },
  {
    questionId: "icl-041",
    question: "Who holds the record for the most economical bowling figures in an ODI for India (6 wickets for 4 runs vs Bangladesh in 2014)?",
    options: ["Stuart Binny", "Anil Kumble", "Ravindra Jadeja", "Bhuveneshwar Kumar"],
    correctAnswer: 0,
    explanation: "Stuart Binny defended a meager total of 105 by taking 6 wickets for just 4 runs in Mirpur.",
    difficulty: "medium"
  },
  {
    questionId: "icl-042",
    question: "Who was the stylish left-handed batsman from Hyderabad who served as captain and led India to 3 successive World Cups (1992, 1996, 1999)?",
    options: ["Mohammad Azharuddin", "Mansoor Ali Khan Pataudi", "Sourav Ganguly", "VVS Laxman"],
    correctAnswer: 0,
    explanation: "Mohammad Azharuddin began his career with three centuries in his first three Tests.",
    difficulty: "medium"
  },
  {
    questionId: "icl-043",
    question: "Who was the fiery Indian pace bowler who famously swung the ball both ways and took 5 wickets on debut against Australia in Melbourne (2011)?",
    options: ["Umesh Yadav", "Varun Aaron", "Mohammed Shami", "Ishant Sharma"],
    correctAnswer: 0,
    explanation: "Umesh Yadav impressed with raw pace and natural outswing.",
    difficulty: "hard"
  },
  {
    questionId: "icl-044",
    question: "Who famously bowled an unforgettable 9-over spell to Ricky Ponting in Perth (2008) as a 19-year-old?",
    options: ["Ishant Sharma", "RP Singh", "S. Sreesanth", "Munaf Patel"],
    correctAnswer: 0,
    explanation: "Ishant Sharma relentlessly set up and dismissed Ricky Ponting at the WACA.",
    difficulty: "easy"
  },
  {
    questionId: "icl-045",
    question: "Which Indian batsman scored a century before lunch on Day 1 of a Test match (against Afghanistan in 2018)?",
    options: ["Shikhar Dhawan", "Virender Sehwag", "Rohit Sharma", "KL Rahul"],
    correctAnswer: 0,
    explanation: "Shikhar Dhawan became the first Indian to score a hundred before lunch on the opening day of a Test.",
    difficulty: "medium"
  },
  {
    questionId: "icl-046",
    question: "Who is known as the 'Gabbar' of Indian cricket, celebrated for his twirling moustache and ICC tournament centuries?",
    options: ["Shikhar Dhawan", "Hardik Pandya", "Ravindra Jadeja", "Suresh Raina"],
    correctAnswer: 0,
    explanation: "Shikhar Dhawan won the Golden Bat in the 2013 and 2017 ICC Champions Trophies.",
    difficulty: "easy"
  },
  {
    questionId: "icl-047",
    question: "Which Indian pace spearhead is famous for his unorthodox hyper-extended bowling action and unplayable yorkers?",
    options: ["Jasprit Bumrah", "Mohammed Shami", "Mohammed Siraj", "Bhuvneshwar Kumar"],
    correctAnswer: 0,
    explanation: "Jasprit Bumrah is widely regarded as the most complete all-format bowler of the modern era.",
    difficulty: "easy"
  },
  {
    questionId: "icl-048",
    question: "Who is the legendary left-arm all-rounder nicknamed 'Sir Jadeja' by fans and teammates?",
    options: ["Ravindra Jadeja", "Axar Patel", "Yuvraj Singh", "Krunal Pandya"],
    correctAnswer: 0,
    explanation: "Ravindra Jadeja is a world-class fielder, Test all-rounder, and accurate left-arm spinner.",
    difficulty: "easy"
  },
  {
    questionId: "icl-049",
    question: "Who scored 175 off 66 balls in the IPL for RCB, the highest T20 individual score in history?",
    options: ["Chris Gayle", "AB de Villiers", "Virat Kohli", "Brendon McCullum"],
    correctAnswer: 0,
    explanation: "Chris Gayle demolished Pune Warriors India in Bangalore in 2013 with 17 sixes.",
    difficulty: "easy"
  },
  {
    questionId: "icl-050",
    question: "Who was the head coach of India when they won the 2024 ICC T20 World Cup, signing off on a glorious high?",
    options: ["Rahul Dravid", "Ravi Shastri", "Anil Kumble", "Gary Kirsten"],
    correctAnswer: 0,
    explanation: "Rahul Dravid ended his coaching tenure by guiding India to their first ICC trophy in 11 years.",
    difficulty: "easy"
  }
];

// 12. Cricket Rules & Umpire Decisions (50 questions)
const rulesQuestions: Question[] = [
  {
    questionId: "cru-001",
    question: "What signal does the umpire give when tapping their shoulder with an outstretched hand?",
    options: ["No-ball", "Short run", "Wide ball", "Dead ball"],
    correctAnswer: 1,
    explanation: "Tapping the shoulder indicates a short run, where the batsman failed to ground their bat past the crease.",
    difficulty: "medium"
  },
  {
    questionId: "cru-002",
    question: "What umpire signal consists of raising both arms horizontally sideways?",
    options: ["Wide ball", "Six", "No-ball", "Four"],
    correctAnswer: 0,
    explanation: "Extending both arms out sideways signals a Wide delivery.",
    difficulty: "easy"
  },
  {
    questionId: "cru-003",
    question: "What signal does the umpire make by waving their hand from side to side in front of their waist?",
    options: ["Four boundaries", "Dead ball", "No-ball", "Free hit"],
    correctAnswer: 1,
    explanation: "Crossing and uncrossing the wrists below waist level signals that the ball is dead.",
    difficulty: "medium"
  },
  {
    questionId: "cru-004",
    question: "Under the Laws of Cricket (MCC Law 41), what is the running out of a non-striker who backs up too far officially classified as?",
    options: ["Run Out", "Mankad Disqualification", "Foul Play", "Obstruction"],
    correctAnswer: 0,
    explanation: "MCC officially reclassified the dismissal as a standard 'Run Out' under Law 38 rather than Unfair Play.",
    difficulty: "easy"
  },
  {
    questionId: "cru-005",
    question: "What is the penalty if a bowler delivers a front-foot No-Ball in T20 and ODI cricket?",
    options: ["1 run penalty and the next delivery is a Free Hit", "2 runs penalty", "Dismissal of the bowler", "5 runs penalty"],
    correctAnswer: 0,
    explanation: "The batting team receives 1 run and the subsequent ball is a Free Hit (where the batsman can only be run out).",
    difficulty: "easy"
  },
  {
    questionId: "cru-006",
    question: "How many ways can a batsman be dismissed in cricket according to the MCC Laws?",
    options: ["10 ways", "8 ways", "11 ways", "9 ways"],
    correctAnswer: 0,
    explanation: "There are 10 methods of dismissal: Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket, Obstructing Field, Hit Ball Twice, Timed Out, and Retired Out.",
    difficulty: "medium"
  },
  {
    questionId: "cru-007",
    question: "What is the time limit for an incoming batsman to take guard or face a ball before being 'Timed Out' in an ODI/T20 match?",
    options: ["2 minutes (in ODIs/T20s)", "5 minutes", "1 minute", "3 minutes"],
    correctAnswer: 0,
    explanation: "The ICC Playing Conditions specify that an incoming batsman must be ready to face within 2 minutes.",
    difficulty: "easy"
  },
  {
    questionId: "cru-008",
    question: "Who became the first player in international cricket history to be dismissed 'Timed Out' (in the 2023 World Cup)?",
    options: ["Angelo Mathews", "Shakib Al Hasan", "Mushfiqur Rahim", "Kane Williamson"],
    correctAnswer: 0,
    explanation: "Angelo Mathews had a broken helmet strap and took longer than 2 minutes against Bangladesh in Delhi.",
    difficulty: "easy"
  },
  {
    questionId: "cru-009",
    question: "Can a batsman be dismissed 'Caught' off a Free Hit delivery?",
    options: ["No (they can only be Run Out, Obstructing Field, or Hit Ball Twice)", "Yes, if caught by the keeper", "Yes, if caught on the boundary", "Only on third umpire review"],
    correctAnswer: 0,
    explanation: "On a Free Hit, batsmen cannot be dismissed Bowled, Caught, LBW, Stumped, or Hit Wicket.",
    difficulty: "easy"
  },
  {
    questionId: "cru-010",
    question: "What is the maximum number of fielders allowed outside the 30-yard fielding circle during the mandatory Powerplay in an ODI?",
    options: ["2 fielders", "3 fielders", "4 fielders", "5 fielders"],
    correctAnswer: 0,
    explanation: "During the first 10 overs (Powerplay 1) in an ODI, a maximum of 2 fielders may be outside the ring.",
    difficulty: "easy"
  },
  {
    questionId: "cru-011",
    question: "How many fielders are allowed on the leg side (on-side) behind the batting crease at the instant of delivery?",
    options: ["Maximum of 2 fielders", "3 fielders", "Unlimited", "1 fielder"],
    correctAnswer: 0,
    explanation: "To prevent dangerous bodyline bowling, no more than 2 fielders can be positioned behind square on the leg side.",
    difficulty: "medium"
  },
  {
    questionId: "cru-012",
    question: "What happens if a ball in play strikes a fielder's helmet placed on the ground behind the wicket-keeper?",
    options: ["5 penalty runs awarded to the batting team", "Ball is dead with no runs", "1 run awarded", "Batsman is given out"],
    correctAnswer: 0,
    explanation: "Under Law 28.3, 5 penalty runs are awarded to the batting side and the ball becomes dead.",
    difficulty: "easy"
  },
  {
    questionId: "cru-013",
    question: "What three elements must be satisfied for an LBW (Leg Before Wicket) decision when the batsman has played a shot?",
    options: ["Pitching in-line or outside off, Impact in-line with stumps, Wickets hitting", "Pitching outside leg", "Bat hitting ball first", "Keeper catching the rebound"],
    correctAnswer: 0,
    explanation: "The ball cannot pitch outside leg-stump; if a shot is offered, impact must be in-line with the wickets.",
    difficulty: "medium"
  },
  {
    questionId: "cru-014",
    question: "Can a batsman ever be given out LBW if the ball pitches outside the leg stump line?",
    options: ["Never (pitching outside leg is an automatic not out)", "Yes, if they didn't offer a shot", "Yes, on DRS review", "Only in Test matches"],
    correctAnswer: 0,
    explanation: "Under the Laws of Cricket, a ball pitching outside leg stump can never result in an LBW dismissal.",
    difficulty: "medium"
  },
  {
    questionId: "cru-015",
    question: "What does the umpire do with their index finger to signal a batsman is OUT?",
    options: ["Raise the right or left index finger vertically", "Point to the pavilion", "Cross hands across chest", "Wave it horizontally"],
    correctAnswer: 0,
    explanation: "Raising the index finger above the head is the universal signal for a dismissal.",
    difficulty: "easy"
  },
  {
    questionId: "cru-016",
    question: "What is the signal for a boundary four?",
    options: ["Waving the arm back and forth across the body", "Raising both arms overhead", "Tapping the knee", "Rolling hands"],
    correctAnswer: 0,
    explanation: "Waving an arm horizontally across the torso indicates that the ball crossed the boundary along the ground.",
    difficulty: "easy"
  },
  {
    questionId: "cru-017",
    question: "What is the signal for a six?",
    options: ["Raising both arms vertically above the head", "One arm overhead", "Touching the cap", "Tapping the elbow"],
    correctAnswer: 0,
    explanation: "Extending both arms straight up into the air signals a six.",
    difficulty: "easy"
  },
  {
    questionId: "cru-018",
    question: "What does an umpire do to indicate a Leg Bye?",
    options: ["Touch their raised knee with their hand", "Raise one arm", "Cross their wrists", "Point to their shoe"],
    correctAnswer: 0,
    explanation: "Touching a raised knee indicates runs scored off the batsman's pads or body (Leg Byes).",
    difficulty: "easy"
  },
  {
    questionId: "cru-019",
    question: "What is the signal for a Bye?",
    options: ["Open palm raised vertically above the head", "Tapping the shoulder", "Two arms out", "Touching the chest"],
    correctAnswer: 0,
    explanation: "Holding an open hand vertically overhead signals Byes.",
    difficulty: "medium"
  },
  {
    questionId: "cru-020",
    question: "What does the umpire do to signal a Free Hit?",
    options: ["Rotate one arm in a circular motion overhead", "Tap their head", "Point to the bowler", "Make a fist"],
    correctAnswer: 0,
    explanation: "Swirling one raised arm in circles signals a Free Hit delivery.",
    difficulty: "easy"
  },
  {
    questionId: "cru-021",
    question: "How long does a fielding captain or batsman have to signal for a DRS review after the ball becomes dead?",
    options: ["15 seconds", "30 seconds", "10 seconds", "1 minute"],
    correctAnswer: 0,
    explanation: "Teams have exactly 15 seconds to request a player review using the 'T' gesture.",
    difficulty: "easy"
  },
  {
    questionId: "cru-022",
    question: "What happens if a DRS review returns an 'Umpire's Call' on the ball tracker?",
    options: ["The on-field decision stands, and the reviewing team does NOT lose their review", "The decision is reversed", "The team loses their review", "A drop ball is called"],
    correctAnswer: 0,
    explanation: "Umpire's Call upholds the original on-field ruling while preserving the team's review quota.",
    difficulty: "easy"
  },
  {
    questionId: "cru-023",
    question: "What is UltraEdge / Snicko used for in television umpire reviews?",
    options: ["Detecting audio soundwaves to determine if the ball hit the bat or pad", "Tracking ball speed", "Measuring pitch bounce", "Checking foot creases"],
    correctAnswer: 0,
    explanation: "UltraEdge synchronizes sound waveforms with slow-motion video frames to pinpoint edge contact.",
    difficulty: "easy"
  },
  {
    questionId: "cru-024",
    question: "What is HotSpot technology based on in cricket broadcasting?",
    options: ["Infrared thermal imaging that detects friction heat from ball contact", "Sonar soundwaves", "High-speed lasers", "Radar tracking"],
    correctAnswer: 0,
    explanation: "Thermal cameras show white friction spots where the ball makes contact with the bat or pad.",
    difficulty: "medium"
  },
  {
    questionId: "cru-025",
    question: "Can a batsman be given out 'Bowled' if the ball dislodges a bail off a No-Ball delivery?",
    options: ["No, a batsman cannot be out Bowled off a No-Ball", "Yes, if the stumps are broken", "Yes, if the bail flies 5 yards", "Only if it is a spinner"],
    correctAnswer: 0,
    explanation: "A batsman is immune from being dismissed Bowled on any No-Ball delivery.",
    difficulty: "easy"
  },
  {
    questionId: "cru-026",
    question: "What is 'Hit Wicket'?",
    options: ["The batsman breaks their own stumps with their bat or body while playing a shot or setting off for a run", "The bowler kicks the stumps", "The keeper breaks the stumps early", "The ball bounces off the pitch onto stumps"],
    correctAnswer: 0,
    explanation: "Law 35 defines Hit Wicket when the striker knocks down the bails during the delivery or shot.",
    difficulty: "easy"
  },
  {
    questionId: "cru-027",
    question: "If a batsman intentionally uses their hand (not holding the bat) to touch the ball without permission, what dismissal is it?",
    options: ["Obstructing the Field (formerly Handled the Ball)", "Hand Ball", "Disqualification", "No dismissal"],
    correctAnswer: 0,
    explanation: "Handled the Ball was merged into Law 37: Obstructing the Field in the 2017 MCC Code update.",
    difficulty: "medium"
  },
  {
    questionId: "cru-028",
    question: "Can a substitute fielder act as a wicket-keeper in international cricket under modern rules?",
    options: ["Yes, with the umpire's consent (since the 2017 law change)", "No, under no circumstances", "Only in Test matches", "Only if the keeper is injured by a helmet"],
    correctAnswer: 0,
    explanation: "Since 2017, umpires may permit a substitute fielder to keep wicket if the primary keeper is genuinely injured.",
    difficulty: "hard"
  },
  {
    questionId: "cru-029",
    question: "What is the standard length of a cricket pitch measured between the stumps at both ends?",
    options: ["22 yards (66 feet / 20.12 meters)", "20 yards", "24 yards", "25 yards"],
    correctAnswer: 0,
    explanation: "A cricket pitch is historically and officially 22 yards (1 chain) in length.",
    difficulty: "easy"
  },
  {
    questionId: "cru-030",
    question: "What is the distance between the bowling crease and the popping crease?",
    options: ["4 feet (1.22 meters)", "3 feet", "5 feet", "2 feet"],
    correctAnswer: 0,
    explanation: "The popping crease is drawn 4 feet in front of the bowling crease and parallel to it.",
    difficulty: "medium"
  },
  {
    questionId: "cru-031",
    question: "How many balls constitute a standard valid over in cricket?",
    options: ["6 balls", "8 balls", "5 balls", "4 balls"],
    correctAnswer: 0,
    explanation: "Since 1979/80, 6 legal deliveries constitute an over internationally.",
    difficulty: "easy"
  },
  {
    questionId: "cru-032",
    question: "What is the maximum height of a cricket stump above the ground?",
    options: ["28 inches (71.1 cm)", "30 inches", "26 inches", "32 inches"],
    correctAnswer: 0,
    explanation: "Cricket stumps stand 28 inches tall with a total wicket width of 9 inches across all three stumps.",
    difficulty: "medium"
  },
  {
    questionId: "cru-033",
    question: "What is the legal ball weight range for men's professional cricket?",
    options: ["5.5 to 5.75 ounces (155.9 to 163 grams)", "5 to 5.25 ounces", "6 to 6.25 ounces", "4.5 to 5 ounces"],
    correctAnswer: 0,
    explanation: "A standard men's red, white, or pink leather cricket ball weighs between 155.9g and 163g.",
    difficulty: "hard"
  },
  {
    questionId: "cru-034",
    question: "If a batsman hits the ball and it ricochets off the non-striker's bat onto the stumps while the non-striker is out of their crease, are they out?",
    options: ["Only if the ball touched the bowler's hand or body first", "Yes, automatically out", "Out on appeal", "Out if it was a yorker"],
    correctAnswer: 0,
    explanation: "A run out at the non-striker's end requires a member of the fielding side to touch or deflect the ball onto the stumps.",
    difficulty: "medium"
  },
  {
    questionId: "cru-035",
    question: "What is the 'Soft Signal' in cricket umpire reviews?",
    options: ["An on-field recommendation that was abolished by the ICC in June 2023", "A radio code", "A gesture for no-ball", "A warning to bowlers"],
    correctAnswer: 0,
    explanation: "The ICC abolished the controversial soft signal in 2023, allowing TV umpires full autonomy to judge catches.",
    difficulty: "medium"
  },
  {
    questionId: "cru-036",
    question: "How many reviews does each team get per innings in a T20 International?",
    options: ["2 reviews per innings", "1 review", "3 reviews", "Unlimited"],
    correctAnswer: 0,
    explanation: "In T20Is, each side is allocated 2 unsuccessful reviews per innings.",
    difficulty: "easy"
  },
  {
    questionId: "cru-037",
    question: "How many reviews does each team get per innings in a Test match?",
    options: ["3 reviews per innings", "2 reviews", "4 reviews", "1 review"],
    correctAnswer: 0,
    explanation: "In Test matches, teams are allowed 3 unsuccessful reviews per innings.",
    difficulty: "easy"
  },
  {
    questionId: "cru-038",
    question: "What is the Stop Clock rule implemented by the ICC in white-ball cricket?",
    options: ["The bowling side must start the next over within 60 seconds (warning on first two, 5-run penalty on third)", "A match timer", "DRS countdown", "Drink break timer"],
    correctAnswer: 0,
    explanation: "An electronic 60-second timer forces teams to begin overs on schedule to curb slow over rates.",
    difficulty: "medium"
  },
  {
    questionId: "cru-039",
    question: "What happens if a bowling side is behind the required over rate at the start of the final over in a T20 match?",
    options: ["They must bring one additional fielder inside the 30-yard circle for the remainder of the innings", "The bowler is banned", "The batting team gets 10 runs", "The match ends"],
    correctAnswer: 0,
    explanation: "Failing to start the final over in time forces only 4 fielders outside the ring instead of 5.",
    difficulty: "easy"
  },
  {
    questionId: "cru-040",
    question: "Can a batsman be given out Stumped off a No-Ball delivery?",
    options: ["No, a batsman cannot be Stumped off a No-Ball (though they can be Run Out if they attempt a run)", "Yes, if the keeper takes the bails", "Yes, on appeal", "Only if outside the crease"],
    correctAnswer: 0,
    explanation: "Stumping requires a legal delivery; off a No-Ball, the dismissal is void unless a genuine run is being attempted.",
    difficulty: "medium"
  },
  {
    questionId: "cru-041",
    question: "Can a batsman be given out Stumped off a Wide delivery?",
    options: ["Yes, a batsman CAN be stumped off a Wide ball", "No, wide balls are dead", "Only in Test matches", "Only on third umpire call"],
    correctAnswer: 0,
    explanation: "A batsman can legally be stumped off a wide delivery if they leave their crease without attempting a run.",
    difficulty: "easy"
  },
  {
    questionId: "cru-042",
    question: "What is a 'Beamer' in cricket terminology?",
    options: ["A full-toss delivery that reaches the batsman above waist height without bouncing", "A bouncer over the head", "A slower ball", "A yorker on the toes"],
    correctAnswer: 0,
    explanation: "A beamer is an illegal, dangerous delivery that results in an immediate No-Ball call.",
    difficulty: "easy"
  },
  {
    questionId: "cru-043",
    question: "How many beamers can a bowler deliver before being barred from bowling for the rest of the innings?",
    options: ["Two dangerous beamers (or one blatant intentional beamer)", "Three beamers", "Five beamers", "One beamer always"],
    correctAnswer: 0,
    explanation: "Umpires issue a first warning on an accidental beamer; a second dangerous beamer suspends the bowler from bowling.",
    difficulty: "medium"
  },
  {
    questionId: "cru-044",
    question: "What is the maximum number of bouncers (short-pitched deliveries above shoulder height) allowed per over in T20 international cricket?",
    options: ["1 bouncer per over (IPL permits 2)", "2 bouncers", "3 bouncers", "Unlimited"],
    correctAnswer: 0,
    explanation: "ICC T20I rules allow 1 bouncer per over; any subsequent bouncer is called a No-Ball.",
    difficulty: "medium"
  },
  {
    questionId: "cru-045",
    question: "What is the rule regarding the ball bouncing more than once before reaching the popping crease?",
    options: ["A delivery bouncing more than once or rolling along the ground is called a No-Ball", "It is a dead ball", "It is legal", "It is a wide"],
    correctAnswer: 0,
    explanation: "Under modern rules, any ball bouncing more than once before the batting crease is ruled a No-Ball.",
    difficulty: "medium"
  },
  {
    questionId: "cru-046",
    question: "What happens if both bails fall off and the fielding side wants to effect a run-out?",
    options: ["They must pull a stump completely out of the ground with the ball in hand", "They cannot run the batsman out", "Touch the stump with the ball", "Replace the bails first"],
    correctAnswer: 0,
    explanation: "If the bails are already down, a fielder must uproot a stump entirely from the turf while holding the ball.",
    difficulty: "hard"
  },
  {
    questionId: "cru-047",
    question: "What is an 'Appeal' in cricket and why is it mandatory?",
    options: ["Umpires cannot give a batsman out unless an appeal ('Howzat?') is made by the fielding side", "It is just for show", "It gives 1 extra run", "It calls the third umpire"],
    correctAnswer: 0,
    explanation: "Law 31 dictates that an umpire shall not declare any batsman out without an appeal from the fielding team.",
    difficulty: "easy"
  },
  {
    questionId: "cru-048",
    question: "What is the follow-on threshold in a standard 5-day Test match?",
    options: ["A deficit of 200 runs or more behind the first-innings total", "150 runs", "250 runs", "100 runs"],
    correctAnswer: 0,
    explanation: "In a 5-day Test, the side batting second can be forced to follow on if they trail by at least 200 runs.",
    difficulty: "easy"
  },
  {
    questionId: "cru-049",
    question: "What is the follow-on threshold in a 4-day first-class match?",
    options: ["150 runs", "200 runs", "100 runs", "175 runs"],
    correctAnswer: 0,
    explanation: "For matches scheduled for 3 or 4 days, the follow-on margin is 150 runs.",
    difficulty: "hard"
  },
  {
    questionId: "cru-050",
    question: "What happens if a batsman plays the ball with the bat and then voluntarily kicks the rolling ball away to prevent it from hitting the stumps?",
    options: ["They are NOT OUT (batsmen are legally allowed to guard their wickets using their bat or any part of their body excluding hands)", "They are given Out Handled the Ball", "5 penalty runs", "They are Out Obstructing the Field"],
    correctAnswer: 0,
    explanation: "Law 34.3 specifically permits a batsman to use their bat or feet to kick the ball away solely to prevent it from hitting the stumps.",
    difficulty: "hard"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'indian-cricket-legends.json'),
  JSON.stringify(legendsQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated indian-cricket-legends.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'cricket-rules.json'),
  JSON.stringify(rulesQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated cricket-rules.json (50 questions)');
