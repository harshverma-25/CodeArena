import 'dotenv/config';
import mongoose from 'mongoose';
import { seedSubjectQuestions } from './seed-helper.js';

const IPL_QUESTIONS = [
  {
    questionId: "ipl-001",
    question: "Which team won the inaugural IPL title in 2008?",
    options: ["Chennai Super Kings", "Rajasthan Royals", "Mumbai Indians", "Kolkata Knight Riders"],
    correctAnswer: 1,
    explanation: "Rajasthan Royals, captained by Shane Warne, won the very first IPL season in 2008.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-002",
    question: "Who holds the record for the highest individual score in an IPL match (175*)?",
    options: ["Brendon McCullum", "Chris Gayle", "AB de Villiers", "KL Rahul"],
    correctAnswer: 1,
    explanation: "Chris Gayle smashed 175* off 66 balls for RCB against Pune Warriors India in 2013.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-003",
    question: "Which captain has led Chennai Super Kings (CSK) to 5 IPL titles?",
    options: ["Suresh Raina", "MS Dhoni", "Ravindra Jadeja", "Ruturaj Gaikwad"],
    correctAnswer: 1,
    explanation: "MS Dhoni led CSK to victory in 2010, 2011, 2018, 2021, and 2023.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-004",
    question: "Which captain led Mumbai Indians (MI) to 5 IPL titles?",
    options: ["Sachin Tendulkar", "Rohit Sharma", "Hardik Pandya", "Harbhajan Singh"],
    correctAnswer: 1,
    explanation: "Rohit Sharma captained Mumbai Indians to trophies in 2013, 2015, 2017, 2019, and 2020.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-005",
    question: "What color cap is awarded to the highest run-scorer of an IPL season?",
    options: ["Purple Cap", "Orange Cap", "Blue Cap", "Green Cap"],
    correctAnswer: 1,
    explanation: "The Orange Cap is awarded to the tournament's leading run-scorer.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-006",
    question: "What color cap is awarded to the leading wicket-taker in an IPL season?",
    options: ["Orange Cap", "Purple Cap", "Red Cap", "Golden Cap"],
    correctAnswer: 1,
    explanation: "The Purple Cap is awarded to the bowler with the most wickets.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-007",
    question: "Who is the all-time leading run-scorer in IPL history with over 8,000 runs?",
    options: ["Shikhar Dhawan", "David Warner", "Virat Kohli", "Rohit Sharma"],
    correctAnswer: 2,
    explanation: "Virat Kohli has scored over 8,000 runs playing exclusively for Royal Challengers Bengaluru.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-008",
    question: "Who holds the record for most runs in a single IPL season (973 runs in 2016)?",
    options: ["David Warner", "Jos Buttler", "Virat Kohli", "Shubman Gill"],
    correctAnswer: 2,
    explanation: "Virat Kohli scored 973 runs with 4 centuries in IPL 2016.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-009",
    question: "Who scored an unbeaten 158 for KKR in the first-ever match of IPL history in 2008?",
    options: ["Ricky Ponting", "Brendon McCullum", "Sourav Ganguly", "Chris Gayle"],
    correctAnswer: 1,
    explanation: "Brendon McCullum hit 158* off 73 balls for KKR against RCB in 2008.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-010",
    question: "Which batsman was famously nicknamed 'Mr. IPL' for his long-standing consistency with CSK?",
    options: ["Ambati Rayudu", "Suresh Raina", "Faf du Plessis", "Shane Watson"],
    correctAnswer: 1,
    explanation: "Suresh Raina earned the nickname 'Mr. IPL' for scoring 400+ runs year after year.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-011",
    question: "Which South African batsman was known as 'Mr. 360' while representing RCB?",
    options: ["Faf du Plessis", "AB de Villiers", "David Miller", "Quinton de Kock"],
    correctAnswer: 1,
    explanation: "AB de Villiers was dubbed 'Mr. 360' for hitting boundaries all around the ground.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-012",
    question: "Which Australian opener has won the Orange Cap a record 3 times (2015, 2017, 2019)?",
    options: ["Shane Watson", "David Warner", "Michael Hussey", "Shaun Marsh"],
    correctAnswer: 1,
    explanation: "David Warner won the Orange Cap thrice playing for Sunrisers Hyderabad.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-013",
    question: "Which team won the IPL in their debut season in 2022 under Hardik Pandya?",
    options: ["Lucknow Super Giants", "Gujarat Titans", "Rising Pune Supergiant", "Kochi Tuskers"],
    correctAnswer: 1,
    explanation: "Gujarat Titans lifted the championship in their maiden appearance in 2022.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-014",
    question: "Who bowled the first-ever Super Over in IPL history in 2009 for Rajasthan Royals?",
    options: ["Kamran Khan", "Shane Warne", "Munaf Patel", "Siddharth Trivedi"],
    correctAnswer: 0,
    explanation: "Kamran Khan defended in the inaugural Super Over against KKR in South Africa.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-015",
    question: "Which Sri Lankan pacer is known for his sling-action yorkers for Mumbai Indians?",
    options: ["Chaminda Vaas", "Lasith Malinga", "Nuwan Kulasekara", "Dilhara Fernando"],
    correctAnswer: 1,
    explanation: "Lasith Malinga took 170 wickets and won 4 titles as a player with Mumbai Indians.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-016",
    question: "Who hit five consecutive sixes in the final over for KKR to defeat Gujarat Titans in 2023?",
    options: ["Andre Russell", "Rinku Singh", "Nitish Rana", "Venkatesh Iyer"],
    correctAnswer: 1,
    explanation: "Rinku Singh smashed Yash Dayal for 5 sixes off the final 5 balls.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-017",
    question: "Who was the first Indian batsman to score an IPL century (in 2009 for RCB)?",
    options: ["Virat Kohli", "Manish Pandey", "Rohit Sharma", "Suresh Raina"],
    correctAnswer: 1,
    explanation: "19-year-old Manish Pandey scored 114* against Deccan Chargers in Centurion.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-018",
    question: "Which West Indies all-rounder is celebrated as 'Dre Russ' for Kolkata Knight Riders?",
    options: ["Kieron Pollard", "Andre Russell", "Dwayne Bravo", "Sunil Narine"],
    correctAnswer: 1,
    explanation: "Andre Russell is known for his devastating power-hitting and death bowling for KKR.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-019",
    question: "Which franchise represents Kolkata and is co-owned by Shah Rukh Khan?",
    options: ["Delhi Capitals", "Kolkata Knight Riders", "Punjab Kings", "Sunrisers Hyderabad"],
    correctAnswer: 1,
    explanation: "Kolkata Knight Riders (KKR) is co-owned by Shah Rukh Khan and Juhi Chawla.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-020",
    question: "Who captained Kolkata Knight Riders to their first two championships in 2012 and 2014?",
    options: ["Sourav Ganguly", "Gautam Gambhir", "Dinesh Karthik", "Shreyas Iyer"],
    correctAnswer: 1,
    explanation: "Gautam Gambhir led KKR to titles in 2012 and 2014.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-021",
    question: "Who hit a 13-ball half-century in 2023, the fastest fifty in IPL history?",
    options: ["KL Rahul", "Yashasvi Jaiswal", "Pat Cummins", "Nicholas Pooran"],
    correctAnswer: 1,
    explanation: "Yashasvi Jaiswal of Rajasthan Royals smashed a fifty in 13 balls against KKR.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-022",
    question: "Which West Indian mystery spinner has been a star for KKR since 2012?",
    options: ["Samuel Badree", "Sunil Narine", "Akeal Hosein", "Devendra Bishoo"],
    correctAnswer: 1,
    explanation: "Sunil Narine has won multiple MVPs and championships with KKR.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-023",
    question: "Which powerful West Indies all-rounder played for Mumbai Indians from 2010 to 2022?",
    options: ["Chris Gayle", "Kieron Pollard", "Dwayne Bravo", "Carlos Brathwaite"],
    correctAnswer: 1,
    explanation: "Kieron Pollard won 5 IPL titles and 2 Champions League T20s with Mumbai Indians.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-024",
    question: "What is the home ground of the Chennai Super Kings?",
    options: ["Wankhede Stadium", "M. A. Chidambaram Stadium (Chepauk)", "Eden Gardens", "Chinnaswamy Stadium"],
    correctAnswer: 1,
    explanation: "Chepauk Stadium in Chennai is the iconic home of CSK.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-025",
    question: "What is the home ground of the Mumbai Indians?",
    options: ["Brabourne Stadium", "Wankhede Stadium", "DY Patil Stadium", "Sardar Patel Stadium"],
    correctAnswer: 1,
    explanation: "Wankhede Stadium in Mumbai is the home fortress of the Mumbai Indians.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-026",
    question: "What is the home venue of the Royal Challengers Bengaluru?",
    options: ["Arun Jaitley Stadium", "M. Chinnaswamy Stadium", "Eden Gardens", "Rajiv Gandhi Stadium"],
    correctAnswer: 1,
    explanation: "M. Chinnaswamy Stadium in Bengaluru is the high-scoring home of RCB.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-027",
    question: "Which Indian leg-spinner is the highest wicket-taker in IPL history?",
    options: ["Amit Mishra", "Yuzvendra Chahal", "Piyush Chawla", "R. Ashwin"],
    correctAnswer: 1,
    explanation: "Yuzvendra Chahal was the first bowler to breach the 200-wicket mark in IPL history.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-028",
    question: "Who took the first hat-trick in IPL history in 2008?",
    options: ["L. Balaji", "Amit Mishra", "Makhaya Ntini", "Yuvraj Singh"],
    correctAnswer: 0,
    explanation: "Lakshmipathy Balaji of CSK took the very first IPL hat-trick against Kings XI Punjab.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-029",
    question: "Who is the only bowler to take three separate hat-tricks in the IPL?",
    options: ["Yuvraj Singh", "Amit Mishra", "Lasith Malinga", "Rashid Khan"],
    correctAnswer: 1,
    explanation: "Amit Mishra took hat-tricks in 2008, 2011, and 2013.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-030",
    question: "What is the famous anthem and whistle-themed slogan of Chennai Super Kings?",
    options: ["'Korbo Lorbo Jeetbo'", "'Whistle Podu'", "'Duniya Hila Denge'", "'Play Bold'"],
    correctAnswer: 1,
    explanation: "'Whistle Podu' is the celebrated battle cry of CSK.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-031",
    question: "Which Afghan spinner is famous for his unpickable googly and quick arm action in the IPL?",
    options: ["Mujeeb Ur Rahman", "Rashid Khan", "Mohammad Nabi", "Noor Ahmad"],
    correctAnswer: 1,
    explanation: "Rashid Khan has been an elite match-winner for SRH and Gujarat Titans.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-032",
    question: "Which Indian fast bowler clocked a 157 km/h delivery for Sunrisers Hyderabad in 2022?",
    options: ["Mayank Yadav", "Umran Malik", "Jasprit Bumrah", "Navdeep Saini"],
    correctAnswer: 1,
    explanation: "Umran Malik stunned the cricketing world with raw 157 km/h pace in IPL 2022.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-033",
    question: "Who won the Player of the Tournament award in the inaugural 2008 IPL season?",
    options: ["Yusuf Pathan", "Shane Watson", "Sohail Tanvir", "Gautam Gambhir"],
    correctAnswer: 1,
    explanation: "Shane Watson won the MVP award for his all-round performance with Rajasthan Royals.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-034",
    question: "Which Indian pace spearhead is famous for his unorthodox bowling action for Mumbai Indians?",
    options: ["Mohammed Shami", "Jasprit Bumrah", "Bhuvneshwar Kumar", "Arshdeep Singh"],
    correctAnswer: 1,
    explanation: "Jasprit Bumrah is recognized globally as one of the finest fast bowlers in modern cricket.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-035",
    question: "Which swing bowler won consecutive Purple Caps in 2016 and 2017 for Sunrisers Hyderabad?",
    options: ["Ashish Nehra", "Bhuvneshwar Kumar", "Mohit Sharma", "Harshal Patel"],
    correctAnswer: 1,
    explanation: "Bhuvneshwar Kumar won back-to-back Purple Caps with SRH.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-036",
    question: "Who captained Sunrisers Hyderabad to their 2016 championship against RCB?",
    options: ["Kane Williamson", "David Warner", "Shikhar Dhawan", "Bhuvneshwar Kumar"],
    correctAnswer: 1,
    explanation: "David Warner led SRH to their maiden title victory in Bengaluru in 2016.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-037",
    question: "Who scored a fighting century (115*) for Kings XI Punjab in the 2014 IPL Final?",
    options: ["George Bailey", "Wriddhiman Saha", "Glenn Maxwell", "David Miller"],
    correctAnswer: 1,
    explanation: "Wriddhiman Saha scored a century in the 2014 final against KKR.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-038",
    question: "What is the famous Kannada catchphrase used by Royal Challengers Bengaluru fans?",
    options: ["'Aala Re'", "'Ee Sala Cup Namde'", "'Halla Bol'", "'Roar Macha'"],
    correctAnswer: 1,
    explanation: "'Ee Sala Cup Namde' (This year the cup is ours) is the passionate chant of RCB fans.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-039",
    question: "Who scored 10 runs off the last two balls of the 2023 IPL Final to secure CSK's 5th title?",
    options: ["Shivam Dube", "Ravindra Jadeja", "MS Dhoni", "Ruturaj Gaikwad"],
    correctAnswer: 1,
    explanation: "Ravindra Jadeja struck a six and a four off Mohit Sharma's final deliveries.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-040",
    question: "Which young opener scored his maiden IPL century (101*) for RCB in 2021?",
    options: ["Shubman Gill", "Devdutt Padikkal", "Ruturaj Gaikwad", "Prithvi Shaw"],
    correctAnswer: 1,
    explanation: "Devdutt Padikkal scored 101* off 52 balls against Rajasthan Royals.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-041",
    question: "Who took an extraordinary 5 wickets for just 5 runs for Mumbai Indians in the 2023 playoffs?",
    options: ["Piyush Chawla", "Akash Madhwal", "Jason Behrendorff", "Cameron Green"],
    correctAnswer: 1,
    explanation: "Akash Madhwal registered figures of 5/5 against LSG in the 2023 Eliminator.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-042",
    question: "Which franchise was originally named Delhi Daredevils before rebranding?",
    options: ["Punjab Kings", "Delhi Capitals", "Lucknow Super Giants", "Rising Pune Supergiant"],
    correctAnswer: 1,
    explanation: "Delhi Daredevils was renamed to Delhi Capitals in December 2018.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-043",
    question: "Which franchise was known as Kings XI Punjab before 2021?",
    options: ["Delhi Capitals", "Punjab Kings", "Sunrisers Hyderabad", "Gujarat Lions"],
    correctAnswer: 1,
    explanation: "Kings XI Punjab was rebranded as Punjab Kings ahead of the 2021 season.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-044",
    question: "Who holds the record for hitting the most sixes in IPL history (over 350 sixes)?",
    options: ["Rohit Sharma", "Chris Gayle", "AB de Villiers", "MS Dhoni"],
    correctAnswer: 1,
    explanation: "Chris Gayle smashed 357 sixes across his IPL career.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-045",
    question: "Which English all-rounder was bought for a record 18.50 crore by Punjab Kings in 2023?",
    options: ["Ben Stokes", "Sam Curran", "Harry Brook", "Liam Livingstone"],
    correctAnswer: 1,
    explanation: "Sam Curran became the highest-paid player in IPL history at the 2023 auction.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-046",
    question: "Which Australian bowler broke the all-time auction record, sold to KKR for 24.75 crore in 2024?",
    options: ["Pat Cummins", "Mitchell Starc", "Josh Hazlewood", "Spencer Johnson"],
    correctAnswer: 1,
    explanation: "Mitchell Starc was signed by KKR for a record-shattering 24.75 crore.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-047",
    question: "Which Australian legend led Rajasthan Royals to victory in 2008 as captain-coach?",
    options: ["Ricky Ponting", "Shane Warne", "Adam Gilchrist", "Glenn McGrath"],
    correctAnswer: 1,
    explanation: "Shane Warne masterminded Rajasthan Royals' historic victory in 2008.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-048",
    question: "Who was the first cricketer to play 250 matches in the IPL?",
    options: ["Virat Kohli", "MS Dhoni", "Rohit Sharma", "Dinesh Karthik"],
    correctAnswer: 1,
    explanation: "MS Dhoni became the first player to reach the milestone of 250 IPL appearances.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-049",
    question: "Who served as head coach of Mumbai Indians during their 2017, 2019, and 2020 title runs?",
    options: ["Ricky Ponting", "Mahela Jayawardene", "Stephen Fleming", "Trevor Bayliss"],
    correctAnswer: 1,
    explanation: "Mahela Jayawardene coached Mumbai Indians through their most dominant era.",
    difficulty: "easy",
    topic: "IPL"
  },
  {
    questionId: "ipl-050",
    question: "Who has served as the long-tenured head coach of Chennai Super Kings since 2009?",
    options: ["Gary Kirsten", "Stephen Fleming", "Brendon McCullum", "Mike Hussey"],
    correctAnswer: 1,
    explanation: "Stephen Fleming has coached CSK to 5 titles in partnership with MS Dhoni.",
    difficulty: "easy",
    topic: "IPL"
  }
];

const CRICKET_RECORDS_QUESTIONS = [
  {
    questionId: "cricket-rec-001",
    question: "Who holds the record for the highest individual score in Test cricket (400*)?",
    options: ["Matthew Hayden", "Brian Lara", "Don Bradman", "Virender Sehwag"],
    correctAnswer: 1,
    explanation: "Brian Lara scored 400 not out against England in Antigua in 2004.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-002",
    question: "Who holds the record for the highest individual score in Men's ODI history (264)?",
    options: ["Martin Guptill", "Rohit Sharma", "Virender Sehwag", "Chris Gayle"],
    correctAnswer: 1,
    explanation: "Rohit Sharma scored 264 against Sri Lanka at Eden Gardens in 2014.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-003",
    question: "Who is the only batsman in cricket history to score 100 international centuries?",
    options: ["Ricky Ponting", "Sachin Tendulkar", "Virat Kohli", "Jacques Kallis"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar scored 51 Test centuries and 49 ODI centuries (100 total).",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-004",
    question: "What is Sir Donald Bradman's legendary career Test batting average?",
    options: ["88.50", "99.94", "104.2", "95.14"],
    correctAnswer: 1,
    explanation: "Sir Don Bradman retired with an untouchable Test batting average of 99.94.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-005",
    question: "Who is the highest wicket-taker in international cricket with 800 Test wickets?",
    options: ["Shane Warne", "Muttiah Muralitharan", "James Anderson", "Anil Kumble"],
    correctAnswer: 1,
    explanation: "Muttiah Muralitharan of Sri Lanka took 800 Test wickets and 534 ODI wickets.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-006",
    question: "Who was the first male cricketer to score a double century (200*) in an ODI?",
    options: ["Virender Sehwag", "Sachin Tendulkar", "Rohit Sharma", "Chris Gayle"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar scored 200* against South Africa in Gwalior on Feb 24, 2010.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-007",
    question: "Who is the only batsman in ODI cricket to score three double centuries?",
    options: ["Chris Gayle", "Rohit Sharma", "Martin Guptill", "Fakhar Zaman"],
    correctAnswer: 1,
    explanation: "Rohit Sharma scored 209, 264, and 208* in ODIs.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-008",
    question: "Who scored the fastest century in ODI history in just 31 balls?",
    options: ["Shahid Afridi", "AB de Villiers", "Corey Anderson", "Glenn Maxwell"],
    correctAnswer: 1,
    explanation: "AB de Villiers reached 100 off 31 balls against the West Indies in 2015.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-009",
    question: "Who hit six sixes in an over off Stuart Broad in the 2007 T20 World Cup?",
    options: ["Chris Gayle", "Yuvraj Singh", "MS Dhoni", "Kieron Pollard"],
    correctAnswer: 1,
    explanation: "Yuvraj Singh smashed 6 sixes in an over in Durban, reaching a 12-ball fifty.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-010",
    question: "Which country has won the Men's ODI Cricket World Cup a record 6 times?",
    options: ["India", "Australia", "West Indies", "England"],
    correctAnswer: 1,
    explanation: "Australia won the World Cup in 1987, 1999, 2003, 2007, 2015, and 2023.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-011",
    question: "Who bowled the fastest recorded delivery in international cricket at 161.3 km/h?",
    options: ["Brett Lee", "Shoaib Akhtar", "Shaun Tait", "Mitchell Starc"],
    correctAnswer: 1,
    explanation: "Shoaib Akhtar clocked 161.3 km/h (100.2 mph) against England in the 2003 World Cup.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-012",
    question: "Who is the all-time leading run-scorer in international cricket with 34,357 runs?",
    options: ["Kumar Sangakkara", "Sachin Tendulkar", "Ricky Ponting", "Virat Kohli"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar scored 15,921 Test runs and 18,426 ODI runs.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-013",
    question: "Which English spinner was the first bowler to take all 10 wickets in a Test innings in 1956?",
    options: ["Jim Laker", "Derek Underwood", "Graeme Swann", "Tony Lock"],
    correctAnswer: 0,
    explanation: "Jim Laker took 10 for 53 against Australia at Old Trafford.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-014",
    question: "Which Indian spinner famously took all 10 wickets in a Test innings against Pakistan in 1999?",
    options: ["Harbhajan Singh", "Anil Kumble", "Bishan Bedi", "R. Ashwin"],
    correctAnswer: 1,
    explanation: "Anil Kumble took 10 for 74 at Feroz Shah Kotla in Delhi.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-015",
    question: "Who was the fastest batsman to reach 50 ODI centuries, breaking Sachin's record in 2023?",
    options: ["Rohit Sharma", "Virat Kohli", "Babar Azam", "David Warner"],
    correctAnswer: 1,
    explanation: "Virat Kohli scored his 50th ODI century in the 2023 World Cup semi-final at Wankhede.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-016",
    question: "Who holds the record for the most dismissals by a wicketkeeper in international cricket (998)?",
    options: ["Adam Gilchrist", "Mark Boucher", "MS Dhoni", "Kumar Sangakkara"],
    correctAnswer: 1,
    explanation: "Mark Boucher of South Africa leads with 998 dismissals across formats.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-017",
    question: "Who holds the record for the most stumpings in international cricket history (195)?",
    options: ["Kumar Sangakkara", "MS Dhoni", "Romesh Kaluwitharana", "Adam Gilchrist"],
    correctAnswer: 1,
    explanation: "MS Dhoni's quick glovework produced an all-time record 195 stumpings.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-018",
    question: "Who captained India to their historic first World Cup win at Lord's in 1983?",
    options: ["Sunil Gavaskar", "Kapil Dev", "Mohinder Amarnath", "Ravi Shastri"],
    correctAnswer: 1,
    explanation: "Kapil Dev captained India to defeat the two-time defending champion West Indies.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-019",
    question: "What is the highest team total in Men's ODI history (498/4)?",
    options: ["Australia", "England", "South Africa", "India"],
    correctAnswer: 1,
    explanation: "England scored 498/4 against the Netherlands in 2022.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-020",
    question: "Who was the first batsman in history to score 10,000 runs in Test cricket?",
    options: ["Allan Border", "Sunil Gavaskar", "Brian Lara", "Viv Richards"],
    correctAnswer: 1,
    explanation: "Sunil Gavaskar breached the 10,000-run landmark against Pakistan in Ahmedabad in 1987.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-021",
    question: "Who holds the record for most runs in a single ODI World Cup edition (765 in 2023)?",
    options: ["Sachin Tendulkar", "Virat Kohli", "Rohit Sharma", "Matthew Hayden"],
    correctAnswer: 1,
    explanation: "Virat Kohli scored 765 runs in 11 innings in the 2023 World Cup.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-022",
    question: "Who holds the record for the most centuries in Cricket World Cup history (7)?",
    options: ["Sachin Tendulkar", "Rohit Sharma", "David Warner", "Kumar Sangakkara"],
    correctAnswer: 1,
    explanation: "Rohit Sharma hit 7 World Cup centuries across the 2015, 2019, and 2023 editions.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-023",
    question: "Who is the only fast bowler in cricket history to take over 700 Test wickets?",
    options: ["Glenn McGrath", "James Anderson", "Stuart Broad", "Courtney Walsh"],
    correctAnswer: 1,
    explanation: "James Anderson of England retired with 704 Test wickets.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-024",
    question: "What was the lowest team total in Test cricket history (26 all out)?",
    options: ["India", "New Zealand", "South Africa", "Zimbabwe"],
    correctAnswer: 1,
    explanation: "New Zealand was bowled out for 26 against England in Auckland in 1955.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-025",
    question: "What was India's lowest-ever Test innings score (36 all out in 2020)?",
    options: ["Against England", "Against Australia at Adelaide", "Against South Africa", "Against New Zealand"],
    correctAnswer: 1,
    explanation: "India was dismissed for 36 in the day-night Adelaide Test in 2020.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-026",
    question: "Who scored an iconic 175* from 17/5 for India against Zimbabwe in the 1983 World Cup?",
    options: ["Sunil Gavaskar", "Kapil Dev", "Sandeep Patil", "Mohinder Amarnath"],
    correctAnswer: 1,
    explanation: "Kapil Dev's 175 not out at Tunbridge Wells saved India's tournament.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-027",
    question: "Who holds the record for the fastest fifty in ODI World Cup history (18 balls)?",
    options: ["Brendon McCullum", "Glenn Maxwell", "AB de Villiers", "Travis Head"],
    correctAnswer: 0,
    explanation: "Brendon McCullum smashed an 18-ball fifty against England in Wellington in 2015.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-028",
    question: "Who scored the fastest century in World Cup history (40 balls in 2023)?",
    options: ["Aiden Markram", "Glenn Maxwell", "Heinrich Klaasen", "Travis Head"],
    correctAnswer: 1,
    explanation: "Glenn Maxwell reached his century in 40 balls against the Netherlands in Delhi.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-029",
    question: "Who scored 201* while suffering severe cramps to chase 292 for Australia in World Cup 2023?",
    options: ["David Warner", "Glenn Maxwell", "Mitchell Marsh", "Pat Cummins"],
    correctAnswer: 1,
    explanation: "Glenn Maxwell produced a solo masterclass to rescue Australia from 91/7 against Afghanistan.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-030",
    question: "Who is the only captain in cricket history to win all three ICC white-ball trophies?",
    options: ["Ricky Ponting", "MS Dhoni", "Clive Lloyd", "Eoin Morgan"],
    correctAnswer: 1,
    explanation: "MS Dhoni won the T20 World Cup (2007), ODI World Cup (2011), and Champions Trophy (2013).",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-031",
    question: "Who holds the record for the most sixes in all international cricket combined (over 600)?",
    options: ["Chris Gayle", "Rohit Sharma", "Shahid Afridi", "Brendon McCullum"],
    correctAnswer: 1,
    explanation: "Rohit Sharma holds the world record with over 600 international sixes.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-032",
    question: "Who holds the best bowling figures in an ODI World Cup match (7 for 15)?",
    options: ["Chaminda Vaas", "Glenn McGrath", "Tim Southee", "Mohammed Shami"],
    correctAnswer: 1,
    explanation: "Glenn McGrath took 7/15 against Namibia in the 2003 World Cup.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-033",
    question: "Which Indian bowler was the leading wicket-taker in the 2023 World Cup with 24 wickets?",
    options: ["Jasprit Bumrah", "Mohammed Shami", "Mohammed Siraj", "Kuldeep Yadav"],
    correctAnswer: 1,
    explanation: "Mohammed Shami took 24 wickets in 7 games, including 7/57 in the semi-final.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-034",
    question: "Who took a Test hat-trick in the first over of a match against Pakistan in Karachi in 2006?",
    options: ["Wasim Akram", "Irfan Pathan", "Zaheer Khan", "Javagal Srinath"],
    correctAnswer: 1,
    explanation: "Irfan Pathan dismissed Salman Butt, Younis Khan, and Mohammad Yousuf in the opening over.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-035",
    question: "Who was the first Indian batsman to score a triple century (309) in Test cricket?",
    options: ["Sachin Tendulkar", "Virender Sehwag", "Rahul Dravid", "Sunil Gavaskar"],
    correctAnswer: 1,
    explanation: "Virender Sehwag scored 309 against Pakistan in Multan in 2004.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-036",
    question: "Who is the only other Indian batsman besides Sehwag to score a Test triple century?",
    options: ["Virat Kohli", "Karun Nair", "Rohit Sharma", "Cheteshwar Pujara"],
    correctAnswer: 1,
    explanation: "Karun Nair scored 303* against England in Chennai in December 2016.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-037",
    question: "What is the highest successful fourth-innings run chase in Test cricket (418)?",
    options: ["India vs Australia", "West Indies vs Australia", "South Africa vs Australia", "England vs Australia"],
    correctAnswer: 1,
    explanation: "West Indies scored 418/7 to beat Australia in Antigua in 2003.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-038",
    question: "In which historic 2006 ODI did South Africa chase down Australia's 434?",
    options: ["Sydney", "The Wanderers (Johannesburg)", "Durban", "Melbourne"],
    correctAnswer: 1,
    explanation: "South Africa reached 438/9 with a ball to spare at The Wanderers.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-039",
    question: "Who scored 175 off 111 balls for South Africa in the legendary 438 match?",
    options: ["Jacques Kallis", "Herschelle Gibbs", "Graeme Smith", "Mark Boucher"],
    correctAnswer: 1,
    explanation: "Herschelle Gibbs played an unforgettable innings to anchor the chase.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-040",
    question: "Who holds the record for playing the most consecutive Tests without missing a match (159)?",
    options: ["Allan Border", "Alastair Cook", "Mark Waugh", "Brendon McCullum"],
    correctAnswer: 1,
    explanation: "Alastair Cook played 159 consecutive Tests for England between 2006 and 2018.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-041",
    question: "Who scored the first-ever century in Men's T20 International cricket (in 2007)?",
    options: ["Yuvraj Singh", "Chris Gayle", "Brendon McCullum", "Suresh Raina"],
    correctAnswer: 1,
    explanation: "Chris Gayle scored 117 off 57 balls against South Africa in the 2007 T20 World Cup.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-042",
    question: "Who holds the record for the most catches by a non-wicketkeeper in Test history (210)?",
    options: ["Ricky Ponting", "Rahul Dravid", "Jacques Kallis", "Mahela Jayawardene"],
    correctAnswer: 1,
    explanation: "Rahul Dravid took 210 catches, primarily at slip, in his Test career.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-043",
    question: "Who took 4 wickets in 4 consecutive balls twice in international cricket?",
    options: ["Rashid Khan", "Lasith Malinga", "Tim Southee", "Curtis Campher"],
    correctAnswer: 1,
    explanation: "Lasith Malinga achieved 4 in 4 against South Africa (2007) and New Zealand (2019).",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-044",
    question: "Who scored an epic 281 in the Kolkata Test in 2001 after India was asked to follow on?",
    options: ["Rahul Dravid", "VVS Laxman", "Sourav Ganguly", "Sachin Tendulkar"],
    correctAnswer: 1,
    explanation: "VVS Laxman's 281 turned the match around against Steve Waugh's Australia.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-045",
    question: "Who is the only bowler to take 500+ wickets in both Tests and ODIs?",
    options: ["Shane Warne", "Muttiah Muralitharan", "Wasim Akram", "Glenn McGrath"],
    correctAnswer: 1,
    explanation: "Muralitharan took 800 Test wickets and 534 ODI wickets.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-046",
    question: "Who was the first left-arm fast bowler to take 500 ODI wickets?",
    options: ["Chaminda Vaas", "Wasim Akram", "Mitchell Starc", "Zaheer Khan"],
    correctAnswer: 1,
    explanation: "Wasim Akram was the first bowler to reach 500 ODI wickets.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-047",
    question: "Who holds the record for the most balls faced in Test cricket history (over 31,000 balls)?",
    options: ["Sachin Tendulkar", "Rahul Dravid", "Jacques Kallis", "Alastair Cook"],
    correctAnswer: 1,
    explanation: "Rahul Dravid faced 31,258 balls across his 164 Test appearances.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-048",
    question: "What is the highest partnership in Test cricket history (624 runs)?",
    options: ["Sangakkara and Jayawardene", "Hayden and Langer", "Greenidge and Haynes", "Dravid and Laxman"],
    correctAnswer: 0,
    explanation: "Kumar Sangakkara (287) and Mahela Jayawardene (374) shared a 624-run stand in 2006.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-049",
    question: "Who scored 149 in the 2007 World Cup final with a squash ball inside his glove?",
    options: ["Ricky Ponting", "Adam Gilchrist", "Matthew Hayden", "Sanath Jayasuriya"],
    correctAnswer: 1,
    explanation: "Adam Gilchrist's century powered Australia to victory against Sri Lanka in Barbados.",
    difficulty: "easy",
    topic: "Cricket Records"
  },
  {
    questionId: "cricket-rec-050",
    question: "Who holds the record for the most Man of the Match awards in Men's international cricket (76)?",
    options: ["Virat Kohli", "Sachin Tendulkar", "Sanath Jayasuriya", "Jacques Kallis"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar won 76 Player of the Match awards in his international career.",
    difficulty: "easy",
    topic: "Cricket Records"
  }
];

const GUESS_CRICKETER_QUESTIONS = [
  {
    questionId: "guess-cric-001",
    question: "I am known as the 'Little Master' and 'God of Cricket' wearing Jersey #10. Who am I?",
    options: ["Sunil Gavaskar", "Sachin Tendulkar", "Virat Kohli", "Sourav Ganguly"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar is revered globally as the God of Cricket.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-002",
    question: "I am known as 'Thala' and 'Captain Cool'. I finished the 2011 World Cup with a six. Who am I?",
    options: ["Suresh Raina", "MS Dhoni", "Ravindra Jadeja", "Rohit Sharma"],
    correctAnswer: 1,
    explanation: "MS Dhoni wore jersey number 7 and captained India to 3 ICC trophies.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-003",
    question: "I am known as 'King Kohli' and wear Jersey #18. I have scored 50 ODI centuries. Who am I?",
    options: ["Rohit Sharma", "Virat Kohli", "KL Rahul", "Shubman Gill"],
    correctAnswer: 1,
    explanation: "Virat Kohli is the prolific Indian batsman known as 'King Kohli'.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-004",
    question: "I am nicknamed 'Hitman' and wear Jersey #45. I scored 264 in an ODI. Who am I?",
    options: ["Shikhar Dhawan", "Rohit Sharma", "Suryakumar Yadav", "Hardik Pandya"],
    correctAnswer: 1,
    explanation: "Rohit Sharma holds the world record ODI score of 264.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-005",
    question: "I am the West Indian batting giant nicknamed 'The Universe Boss'. Who am I?",
    options: ["Kieron Pollard", "Chris Gayle", "Brian Lara", "Andre Russell"],
    correctAnswer: 1,
    explanation: "Chris Gayle is known as the Universe Boss.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-006",
    question: "I was nicknamed 'The Wall' for my rock-solid defensive batting. Who am I?",
    options: ["VVS Laxman", "Rahul Dravid", "Anil Kumble", "Cheteshwar Pujara"],
    correctAnswer: 1,
    explanation: "Rahul Dravid was the dependable rock of India's middle order.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-007",
    question: "I am the 'Prince of Trinidad' who scored 400* in a Test match. Who am I?",
    options: ["Vivian Richards", "Brian Lara", "Clive Lloyd", "Curtly Ambrose"],
    correctAnswer: 1,
    explanation: "Brian Lara holds the individual Test world record of 400 not out.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-008",
    question: "I was nicknamed the 'Haryana Hurricane' and led India to the 1983 World Cup title. Who am I?",
    options: ["Sunil Gavaskar", "Kapil Dev", "Madan Lal", "Mohinder Amarnath"],
    correctAnswer: 1,
    explanation: "Kapil Dev was India's premier fast-bowling all-rounder.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-009",
    question: "I am nicknamed 'Boom Boom' for my aggressive hitting for Pakistan. Who am I?",
    options: ["Shoaib Akhtar", "Shahid Afridi", "Inzamam-ul-Haq", "Wasim Akram"],
    correctAnswer: 1,
    explanation: "Shahid Afridi was famously called 'Boom Boom'.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-010",
    question: "I am an Indian pacer with a unique hyperextended action and deadly yorkers. Who am I?",
    options: ["Mohammed Shami", "Jasprit Bumrah", "Bhuvneshwar Kumar", "Arshdeep Singh"],
    correctAnswer: 1,
    explanation: "Jasprit Bumrah is India's leading strike bowler across formats.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-011",
    question: "I bowled the 'Ball of the Century' to Mike Gatting in the 1993 Ashes. Who am I?",
    options: ["Glenn McGrath", "Shane Warne", "Stuart MacGill", "Brett Lee"],
    correctAnswer: 1,
    explanation: "Shane Warne's leg-break drifted and pitched outside leg before clipping off stump.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-012",
    question: "I am known as 'Mr. 360' and played for South Africa and RCB. Who am I?",
    options: ["Glenn Maxwell", "AB de Villiers", "Jos Buttler", "David Miller"],
    correctAnswer: 1,
    explanation: "AB de Villiers is known for his innovative 360-degree shot-making.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-013",
    question: "I am India's T20 superstar ranked #1 in the world and nicknamed 'SKY'. Who am I?",
    options: ["Shreyas Iyer", "Suryakumar Yadav", "Rishabh Pant", "Sanju Samson"],
    correctAnswer: 1,
    explanation: "Suryakumar Yadav is known by the acronym 'SKY'.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-014",
    question: "I am known as 'Dada' and took off my shirt on the Lord's balcony in 2002. Who am I?",
    options: ["VVS Laxman", "Sourav Ganguly", "Yuvraj Singh", "Harbhajan Singh"],
    correctAnswer: 1,
    explanation: "Sourav Ganguly celebrated India's NatWest Series win at Lord's.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-015",
    question: "I am nicknamed 'Punter' and captained Australia to World Cup titles in 2003 and 2007. Who am I?",
    options: ["Steve Waugh", "Ricky Ponting", "Michael Clarke", "Allan Border"],
    correctAnswer: 1,
    explanation: "Ricky Ponting was one of Australia's most successful captains.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-016",
    question: "I am known as 'The Sultan of Swing' with 502 ODI wickets for Pakistan. Who am I?",
    options: ["Waqar Younis", "Wasim Akram", "Imran Khan", "Shoaib Akhtar"],
    correctAnswer: 1,
    explanation: "Wasim Akram was the master of conventional and reverse swing.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-017",
    question: "I am nicknamed 'Jumbo' and took 619 Test wickets for India. Who am I?",
    options: ["Harbhajan Singh", "Anil Kumble", "R. Ashwin", "Bishan Bedi"],
    correctAnswer: 1,
    explanation: "Anil Kumble is India's highest Test wicket-taker.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-018",
    question: "I hit 6 sixes in an over in 2007 and was Player of the Tournament in World Cup 2011. Who am I?",
    options: ["Suresh Raina", "Yuvraj Singh", "Gautam Gambhir", "Irfan Pathan"],
    correctAnswer: 1,
    explanation: "Yuvraj Singh was India's hero in both World Cup triumphs.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-019",
    question: "I am the 'Rawalpindi Express' who bowled the fastest ball in cricket history. Who am I?",
    options: ["Brett Lee", "Shoaib Akhtar", "Mohammad Amir", "Umar Gul"],
    correctAnswer: 1,
    explanation: "Shoaib Akhtar was nicknamed after his hometown of Rawalpindi.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-020",
    question: "I batted without a helmet and intimidated bowlers with my swagger for the West Indies. Who am I?",
    options: ["Clive Lloyd", "Sir Viv Richards", "Gordon Greenidge", "Desmond Haynes"],
    correctAnswer: 1,
    explanation: "Sir Viv Richards was one of the most destructive batsmen in history.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-021",
    question: "I scored over 13,000 Test runs and took 292 Test wickets for South Africa. Who am I?",
    options: ["Shaun Pollock", "Jacques Kallis", "Lance Klusener", "Hansie Cronje"],
    correctAnswer: 1,
    explanation: "Jacques Kallis is considered one of the greatest all-rounders of all time.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-022",
    question: "I am India's 'Turbanator' who took a famous hat-trick in Kolkata 2001. Who am I?",
    options: ["Navjot Sidhu", "Harbhajan Singh", "Bishan Bedi", "Arshdeep Singh"],
    correctAnswer: 1,
    explanation: "Harbhajan Singh took 417 Test wickets for India.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-023",
    question: "I am called 'Sir Jadeja' and known for my sword celebration and rocket throws. Who am I?",
    options: ["Axar Patel", "Ravindra Jadeja", "Hardik Pandya", "Shardul Thakur"],
    correctAnswer: 1,
    explanation: "Ravindra Jadeja is India's star all-rounder and premier fielder.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-024",
    question: "I led Pakistan's 'Cornered Tigers' to World Cup victory in 1992. Who am I?",
    options: ["Javed Miandad", "Imran Khan", "Wasim Akram", "Inzamam-ul-Haq"],
    correctAnswer: 1,
    explanation: "Imran Khan captained Pakistan to their sole ODI World Cup triumph.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-025",
    question: "I am an Australian batting maestro with a quirky fidgety stance averaging over 58 in Tests. Who am I?",
    options: ["David Warner", "Steve Smith", "Marnus Labuschagne", "Usman Khawaja"],
    correctAnswer: 1,
    explanation: "Steve Smith has scored over 30 Test centuries for Australia.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-026",
    question: "I am an Australian wicketkeeper-batsman nicknamed 'Gilly' who opened in ODIs. Who am I?",
    options: ["Ian Healy", "Adam Gilchrist", "Brad Haddin", "Matthew Wade"],
    correctAnswer: 1,
    explanation: "Adam Gilchrist revolutionized the role of wicket-keeper batsmen.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-027",
    question: "I scored the winning runs at the Gabba in 2021 and wear Jersey #17 for India. Who am I?",
    options: ["KL Rahul", "Rishabh Pant", "Ishan Kishan", "Sanju Samson"],
    correctAnswer: 1,
    explanation: "Rishabh Pant scored 89* to breach Australia's fortress at the Gabba.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-028",
    question: "I was nicknamed 'Pigeon' and took 563 Test wickets for Australia with metronomic accuracy. Who am I?",
    options: ["Brett Lee", "Glenn McGrath", "Jason Gillespie", "Mitchell Johnson"],
    correctAnswer: 1,
    explanation: "Glenn McGrath is one of the most successful fast bowlers in history.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-029",
    question: "I am the gentle former captain of New Zealand praised for my 'Nice Guy' sportsmanship. Who am I?",
    options: ["Brendon McCullum", "Kane Williamson", "Ross Taylor", "Martin Guptill"],
    correctAnswer: 1,
    explanation: "Kane Williamson captained New Zealand to the 2021 World Test Championship title.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-030",
    question: "I was a diving South African fielder who famously broke the stumps to run out Inzamam in 1992. Who am I?",
    options: ["AB de Villiers", "Jonty Rhodes", "Herschelle Gibbs", "Faf du Plessis"],
    correctAnswer: 1,
    explanation: "Jonty Rhodes set the gold standard for modern fielding.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-031",
    question: "I played heroics in the 2019 World Cup final and 2019 Headingley Ashes Test for England. Who am I?",
    options: ["Joe Root", "Ben Stokes", "Eoin Morgan", "Jos Buttler"],
    correctAnswer: 1,
    explanation: "Ben Stokes is England's clutch all-rounder and Test captain.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-032",
    question: "I have taken over 500 Test wickets for India with variations like the carrom ball. Who am I?",
    options: ["Harbhajan Singh", "R. Ashwin", "Anil Kumble", "Axar Patel"],
    correctAnswer: 1,
    explanation: "Ravichandran Ashwin is one of India's greatest match-winners in Test history.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-033",
    question: "I am the 'Nawab of Najafgarh' who hit two triple centuries in Test cricket. Who am I?",
    options: ["Gautam Gambhir", "Virender Sehwag", "Shikhar Dhawan", "Navjot Sidhu"],
    correctAnswer: 1,
    explanation: "Virender Sehwag scored 309 in Multan and 319 in Chennai.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-034",
    question: "I scored four consecutive centuries in the 2015 World Cup for Sri Lanka. Who am I?",
    options: ["Mahela Jayawardene", "Kumar Sangakkara", "Sanath Jayasuriya", "Tillakaratne Dilshan"],
    correctAnswer: 1,
    explanation: "Kumar Sangakkara was a masterclass left-handed batsman and wicketkeeper.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-035",
    question: "I am the 'Matara Hurricane' who tore bowling attacks apart in the 1996 World Cup. Who am I?",
    options: ["Aravinda de Silva", "Sanath Jayasuriya", "Romesh Kaluwitharana", "Marvan Atapattu"],
    correctAnswer: 1,
    explanation: "Sanath Jayasuriya revolutionized opening in limited-overs cricket.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-036",
    question: "I am an Australian fast bowler nicknamed 'Binga' who bowled over 160 km/h. Who am I?",
    options: ["Mitchell Johnson", "Brett Lee", "Shaun Tait", "Mitchell Starc"],
    correctAnswer: 1,
    explanation: "Brett Lee took 310 Test wickets and 380 ODI wickets with ferocious pace.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-037",
    question: "I am an Australian left-arm speedster who took 37 wickets in the 2013-14 Ashes. Who am I?",
    options: ["Mitchell Starc", "Mitchell Johnson", "Ryan Harris", "Peter Siddle"],
    correctAnswer: 1,
    explanation: "Mitchell Johnson's hostility dismantled England in the 2013-14 series.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-038",
    question: "I am an Indian leg-spinner nicknamed 'Yuzi' who was once a junior national chess player. Who am I?",
    options: ["Kuldeep Yadav", "Yuzvendra Chahal", "Piyush Chawla", "Rahul Chahar"],
    correctAnswer: 1,
    explanation: "Yuzvendra Chahal is India's leading wicket-taker in T20Is.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-039",
    question: "I am an Indian chinaman bowler from Kanpur with multiple international hat-tricks. Who am I?",
    options: ["Axar Patel", "Kuldeep Yadav", "Ravi Bishnoi", "Varun Chakravarthy"],
    correctAnswer: 1,
    explanation: "Kuldeep Yadav is India's premier left-arm wrist-spinner.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-040",
    question: "I am an Australian captain nicknamed 'Tugga' who led a record 16-match Test winning streak. Who am I?",
    options: ["Allan Border", "Steve Waugh", "Mark Taylor", "Ricky Ponting"],
    correctAnswer: 1,
    explanation: "Steve Waugh led Australia through an era of unprecedented dominance.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-041",
    question: "I am nicknamed 'Gabbar' and loved twirling my mustache after scoring centuries. Who am I?",
    options: ["Rohit Sharma", "Shikhar Dhawan", "Hardik Pandya", "Ravindra Jadeja"],
    correctAnswer: 1,
    explanation: "Shikhar Dhawan was India's clutch opener in ICC tournaments.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-042",
    question: "I bowled the final over of the 2024 T20 World Cup final defending 16 runs against South Africa. Who am I?",
    options: ["Jasprit Bumrah", "Hardik Pandya", "Arshdeep Singh", "Axar Patel"],
    correctAnswer: 1,
    explanation: "Hardik Pandya dismissed David Miller and sealed India's World Cup victory in Barbados.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-043",
    question: "I scored centuries in both the 2023 WTC Final and 2023 World Cup Final for Australia. Who am I?",
    options: ["David Warner", "Travis Head", "Mitchell Marsh", "Marnus Labuschagne"],
    correctAnswer: 1,
    explanation: "Travis Head won Player of the Match in both major 2023 finals.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-044",
    question: "I was the West Indies captain who lifted the 1975 and 1979 World Cups wearing glasses. Who am I?",
    options: ["Viv Richards", "Clive Lloyd", "Garfield Sobers", "Frank Worrell"],
    correctAnswer: 1,
    explanation: "Clive Lloyd captained the legendary West Indies team of the 1970s.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-045",
    question: "I am an Indian opening batsman dubbed the 'Prince' who scored 208 in an ODI against New Zealand. Who am I?",
    options: ["Prithvi Shaw", "Shubman Gill", "Yashasvi Jaiswal", "Ishan Kishan"],
    correctAnswer: 1,
    explanation: "Shubman Gill is one of India's brightest young batting stars.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-046",
    question: "I was the first batsman in first-class cricket to hit 6 sixes in an over in 1968. Who am I?",
    options: ["Ravi Shastri", "Sir Garfield Sobers", "Herschelle Gibbs", "Yuvraj Singh"],
    correctAnswer: 1,
    explanation: "Sir Garry Sobers hit 6 sixes in an over for Nottinghamshire.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-047",
    question: "I hit 6 sixes in an over in the Ranji Trophy and later became head coach of Team India. Who am I?",
    options: ["Kapil Dev", "Ravi Shastri", "Madan Lal", "Sandeep Patil"],
    correctAnswer: 1,
    explanation: "Ravi Shastri was a hard-hitting all-rounder and renowned commentator.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-048",
    question: "I am a former South African captain who currently captains RCB in the IPL. Who am I?",
    options: ["Graeme Smith", "Faf du Plessis", "Quinton de Kock", "David Miller"],
    correctAnswer: 1,
    explanation: "Faf du Plessis took over as RCB captain in 2022.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-049",
    question: "I am the world-famous Afghan leg-spinner wearing Jersey #19 in franchise leagues worldwide. Who am I?",
    options: ["Mohammad Nabi", "Rashid Khan", "Mujeeb Ur Rahman", "Fazalhaq Farooqi"],
    correctAnswer: 1,
    explanation: "Rashid Khan has taken hundreds of T20 wickets worldwide.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  },
  {
    questionId: "guess-cric-050",
    question: "I was a terrifying 6'7\" West Indian fast bowler with 405 Test wickets who never smiled at batsmen. Who am I?",
    options: ["Michael Holding", "Sir Curtly Ambrose", "Courtney Walsh", "Malcolm Marshall"],
    correctAnswer: 1,
    explanation: "Curtly Ambrose formed a fearsome bowling partnership with Courtney Walsh.",
    difficulty: "easy",
    topic: "Guess the Cricketer"
  }
];

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  await seedSubjectQuestions(
    'sports',
    'Sports',
    'ipl-superstars',
    'IPL Superstars',
    'ipl.json',
    IPL_QUESTIONS
  );

  await seedSubjectQuestions(
    'sports',
    'Sports',
    'cricket-records',
    'Cricket Records',
    'cricket-records.json',
    CRICKET_RECORDS_QUESTIONS
  );

  await seedSubjectQuestions(
    'sports',
    'Sports',
    'guess-the-cricketer',
    'Guess the Cricketer',
    'guess-cricketer.json',
    GUESS_CRICKETER_QUESTIONS
  );

  await mongoose.disconnect();
  console.log('🎉 Category 3 (Sports) completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
