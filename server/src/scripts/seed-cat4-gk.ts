import 'dotenv/config';
import mongoose from 'mongoose';
import { seedSubjectQuestions } from './seed-helper.js';

// 1. World Flags Challenge (50 Questions)
const WORLD_FLAGS_QUESTIONS = [
  {
    questionId: "flag-001",
    question: "Which country features a red maple leaf on its national flag?",
    options: ["Canada", "United States", "Australia", "New Zealand"],
    correctAnswer: 0,
    explanation: "Canada's national flag prominently displays an iconic 11-pointed red maple leaf on a white field flanked by red borders.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-002",
    question: "How many stars are displayed on the national flag of the United States?",
    options: ["48", "50", "52", "45"],
    correctAnswer: 1,
    explanation: "The US flag has 50 stars representing the 50 states, along with 13 stripes representing the original 13 colonies.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-003",
    question: "Which symbol is centered on the white band of the Indian national flag?",
    options: ["Charkha", "Ashoka Chakra", "Lotus", "Lion Capital"],
    correctAnswer: 1,
    explanation: "The Ashoka Chakra, a 24-spoke navy blue wheel, is located at the center of the Indian tricolour.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-004",
    question: "Which country's flag features a red circle on a plain white background representing the rising sun?",
    options: ["South Korea", "China", "Japan", "Vietnam"],
    correctAnswer: 2,
    explanation: "The flag of Japan, known as the Hinomaru ('circle of the sun'), features a crimson-red disc on a white field.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-005",
    question: "What is the common name for the national flag of the United Kingdom?",
    options: ["Stars and Stripes", "Union Jack", "Tricolore", "Southern Cross"],
    correctAnswer: 1,
    explanation: "The national flag of the United Kingdom is commonly known as the Union Jack or Union Flag.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-006",
    question: "Which is the only country in the world that does not have a four-sided rectangular flag?",
    options: ["Bhutan", "Nepal", "Switzerland", "Vatican City"],
    correctAnswer: 1,
    explanation: "Nepal's flag is the only non-quadrilateral national flag; it is made of two joined pennants forming a double triangle.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-007",
    question: "Which European country's flag consists of a simple white cross on a red square background?",
    options: ["Denmark", "Switzerland", "Sweden", "Austria"],
    correctAnswer: 1,
    explanation: "Switzerland's national flag is one of only two square sovereign state flags, featuring a bold white cross on a red field.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-008",
    question: "Which country has a large yellow five-pointed star surrounded by four smaller yellow stars on a red background?",
    options: ["Vietnam", "China", "North Korea", "Singapore"],
    correctAnswer: 1,
    explanation: "China's national flag is the Five-star Red Flag, featuring one large central star with four smaller stars in an arc.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-009",
    question: "What colors make up the national flag of Germany from top to bottom?",
    options: ["Black, Red, Gold", "Red, White, Black", "Black, Yellow, Red", "Gold, Red, Black"],
    correctAnswer: 0,
    explanation: "The German flag consists of three equal horizontal bands colored black, red, and gold.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-010",
    question: "Which country's flag features a green field with a large yellow rhombus containing a blue celestial globe with 27 stars?",
    options: ["Argentina", "Brazil", "Colombia", "Mexico"],
    correctAnswer: 1,
    explanation: "Brazil's flag features the green background, yellow rhombus, and a blue starry globe inscribed with 'Ordem e Progresso'.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-011",
    question: "Which country's flag features three vertical stripes of Blue, White, and Red?",
    options: ["France", "Italy", "Netherlands", "Russia"],
    correctAnswer: 0,
    explanation: "The French Tricolore consists of three equal vertical bands of blue, white, and red.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-012",
    question: "Which country's flag consists of three vertical stripes of Green, White, and Red?",
    options: ["Ireland", "Italy", "Hungary", "Bulgaria"],
    correctAnswer: 1,
    explanation: "Italy's national flag (il Tricolore) features three equal vertical stripes of green, white, and red.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-013",
    question: "Which country features a green cedar tree in the center of a white stripe flanked by two red stripes?",
    options: ["Lebanon", "Cyprus", "Syria", "Jordan"],
    correctAnswer: 0,
    explanation: "The flag of Lebanon features the green Lebanon Cedar prominently in the white stripe.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-014",
    question: "Which country features the Union Jack in the top left corner along with the Southern Cross constellation?",
    options: ["Canada", "Australia", "South Africa", "India"],
    correctAnswer: 1,
    explanation: "Australia's flag features the Union Jack in the canton, the Commonwealth Star, and the five stars of the Southern Cross.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-015",
    question: "How many colors are on the national flag of South Africa?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 2,
    explanation: "South Africa's flag incorporates six colors: black, yellow, green, white, red, and blue in a distinctive Y-shape design.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-016",
    question: "Which animal is depicted on the national flag of Bhutan?",
    options: ["Tiger", "Thunder Dragon (Druk)", "Snow Leopard", "Elephant"],
    correctAnswer: 1,
    explanation: "The flag of Bhutan features Druk, the white Thunder Dragon, clutching jewels in its claws across yellow and orange halves.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-017",
    question: "Which country's flag features a sun with a human face surrounded by 32 alternating straight and wavy rays?",
    options: ["Argentina", "Chile", "Uruguay", "Peru"],
    correctAnswer: 0,
    explanation: "The flag of Argentina features the 'Sun of May' (Sol de Mayo) with a human face in the center of a white band.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-018",
    question: "Which country's flag consists of a red background with a green five-pointed star (Seal of Solomon) at its center?",
    options: ["Turkey", "Tunisia", "Morocco", "Algeria"],
    correctAnswer: 2,
    explanation: "The flag of Morocco is a red field with an emerald green five-pointed linear star centered on it.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-019",
    question: "Which Nordic country's flag features a yellow Scandinavian cross on a blue field?",
    options: ["Norway", "Finland", "Sweden", "Denmark"],
    correctAnswer: 2,
    explanation: "Sweden's flag features a yellow Nordic cross extending to the edges on a blue background.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-020",
    question: "Which country's flag is considered the oldest continuously used national flag in the world?",
    options: ["United Kingdom", "Denmark", "France", "Netherlands"],
    correctAnswer: 1,
    explanation: "The Dannebrog (the flag of Denmark) holds the world record for the oldest continuously used national flag, dating back to 1219.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-021",
    question: "Which country features a golden lion holding a sword (Kastane) on its flag?",
    options: ["Singapore", "Sri Lanka", "India", "Thailand"],
    correctAnswer: 1,
    explanation: "The flag of Sri Lanka, also called the Lion Flag, features a golden lion holding a sword against a maroon background.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-022",
    question: "What symbol is in the center of the flag of Israel?",
    options: ["Menorah", "Star of David", "Olive Branch", "Crescent"],
    correctAnswer: 1,
    explanation: "The flag of Israel features the blue Star of David (Magen David) between two horizontal blue stripes on a white background.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-023",
    question: "Which country's flag is a plain green field with an offset red circle, resembling a sun rising over green plains?",
    options: ["Bangladesh", "Pakistan", "Maldives", "Oman"],
    correctAnswer: 0,
    explanation: "The flag of Bangladesh features a red circle (symbolizing the rising sun and blood of martyrs) on a bottle green field.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-024",
    question: "Which country's flag features a white crescent moon and a five-pointed star on a dark green field with a white vertical bar on the left?",
    options: ["Turkey", "Pakistan", "Algeria", "Tunisia"],
    correctAnswer: 1,
    explanation: "The national flag of Pakistan consists of a dark green field with a white crescent moon and star, and a vertical white stripe at the hoist.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-025",
    question: "Which country has a white crescent moon and star on an entirely red field?",
    options: ["Turkey", "Egypt", "Singapore", "Malaysia"],
    correctAnswer: 0,
    explanation: "The national flag of Turkey consists of a white crescent moon and a star centered on a vivid red background.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-026",
    question: "Which country features an eagle perched on a prickly pear cactus eating a rattlesnake on its national flag?",
    options: ["Guatemala", "Mexico", "Ecuador", "Bolivia"],
    correctAnswer: 1,
    explanation: "Mexico's coat of arms on its flag portrays an eagle perched on a cactus eating a serpent, from Aztec mythology.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-027",
    question: "Which country's flag features an outline of the entire island country along with two olive branches?",
    options: ["Cyprus", "Malta", "Madagascar", "Iceland"],
    correctAnswer: 0,
    explanation: "Cyprus features a copper-colored map of the island above two olive branches on a pure white field.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-028",
    question: "Which country's flag consists of horizontal stripes of White, Blue, and Red from top to bottom?",
    options: ["France", "Russia", "Poland", "Czech Republic"],
    correctAnswer: 1,
    explanation: "The Russian flag is a tricolor consisting of three equal horizontal fields: white on the top, blue in the middle, and red on the bottom.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-029",
    question: "Which European country's flag is simply two horizontal bands: White on top and Red on bottom?",
    options: ["Poland", "Monaco", "Indonesia", "Austria"],
    correctAnswer: 0,
    explanation: "Poland's flag consists of two horizontal stripes of equal width, the upper one white and the lower one red.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-030",
    question: "Which Southeast Asian country's flag is two horizontal bands of Red on top and White on bottom (identical to Monaco's proportions aside)?",
    options: ["Singapore", "Indonesia", "Malaysia", "Thailand"],
    correctAnswer: 1,
    explanation: "Indonesia's national flag (Sang Saka Merah-Putih) consists of a red stripe over a white stripe.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-031",
    question: "What color is the cross on the national flag of Greece?",
    options: ["Red", "Gold", "White", "Black"],
    correctAnswer: 2,
    explanation: "The Greek flag consists of a white cross in the upper hoist canton with nine alternating blue and white horizontal stripes.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-032",
    question: "Which country features an AK-47 assault rifle crossed with a hoe on its national flag?",
    options: ["Mozambique", "Angola", "Zimbabwe", "Uganda"],
    correctAnswer: 0,
    explanation: "The flag of Mozambique features an AK-47 rifle symbolizing defense and vigilance, alongside a hoe symbolizing agriculture.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-033",
    question: "Which nation's flag consists of horizontal stripes of red, white, and blue, representing the oldest tricolor in continuous use?",
    options: ["Luxembourg", "Netherlands", "France", "Croatia"],
    correctAnswer: 1,
    explanation: "The Netherlands flag is a horizontal tricolor of red, white, and cobalt blue, dating back to 1572.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-034",
    question: "Which African country has a flag featuring black, red, and green horizontal stripes separated by white fimbriations and a Maasai shield with two crossed spears?",
    options: ["Kenya", "Tanzania", "Ethiopia", "Ghana"],
    correctAnswer: 0,
    explanation: "The flag of Kenya features a traditional Maasai warrior shield and two crossed spears at its center.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-035",
    question: "Which country's flag features a blue Nordic cross on a white background?",
    options: ["Norway", "Finland", "Iceland", "Denmark"],
    correctAnswer: 1,
    explanation: "Finland's flag (Siniristilippu) features a blue Scandinavian cross on a white field, representing its lakes and snow.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-036",
    question: "Which country has red stars on its flag's Southern Cross constellation, unlike Australia's white stars?",
    options: ["Papua New Guinea", "New Zealand", "Samoa", "Fiji"],
    correctAnswer: 1,
    explanation: "New Zealand's flag features four red five-pointed stars with white borders representing the Southern Cross constellation.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-037",
    question: "What is the only sovereign country whose flag contains a depiction of an intact Bible?",
    options: ["Vatican City", "Dominican Republic", "Greece", "Georgia"],
    correctAnswer: 1,
    explanation: "The coat of arms on the Dominican Republic's flag includes an open Bible with a small golden cross above it.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-038",
    question: "Which country features five white horizontal stripes and four blue horizontal stripes with a red canton and a white star?",
    options: ["Cuba", "Liberia", "Puerto Rico", "Chile"],
    correctAnswer: 1,
    explanation: "Liberia's flag closely resembles the US flag, featuring 11 red and white stripes and a single white star on a blue canton.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-039",
    question: "Which country's flag has a red background with a single large yellow star in the center?",
    options: ["Vietnam", "North Korea", "China", "Laos"],
    correctAnswer: 0,
    explanation: "Vietnam's flag is known as the 'Red Flag with a Gold Star', designed with a centered five-pointed yellow star.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-040",
    question: "Which European country's flag has five red crosses (one large and four smaller Jerusalem crosses) on a white field?",
    options: ["England", "Georgia", "Malta", "Switzerland"],
    correctAnswer: 1,
    explanation: "The flag of Georgia, known as the Five Cross Flag, displays Saint George's cross and four smaller Bolnur-Katskhuri crosses.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-041",
    question: "Which country has three horizontal stripes: saffron on top, white in middle, and green at bottom?",
    options: ["Ireland", "India", "Niger", "Ivory Coast"],
    correctAnswer: 1,
    explanation: "The National Flag of India is a horizontal rectangular tricolour of India saffron, white, and India green.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-042",
    question: "Which country's flag features the Shahada (Islamic creed) written in white Arabic script above a white sword on a green background?",
    options: ["Iran", "Saudi Arabia", "Pakistan", "United Arab Emirates"],
    correctAnswer: 1,
    explanation: "Saudi Arabia's green flag displays the Shahada above a horizontal white sword pointing to the left.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-043",
    question: "Which country's flag features five horizontal bands of red, white, blue, white, and red, known as the Trairanga?",
    options: ["Thailand", "Costa Rica", "North Korea", "Laos"],
    correctAnswer: 0,
    explanation: "The flag of Thailand, known as the Thong Trairong ('tricolour flag'), has five horizontal stripes: red, white, blue, white, and red.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-044",
    question: "What colors are featured on the national flag of Spain?",
    options: ["Red and Yellow", "Blue and White", "Green and White", "Red and White"],
    correctAnswer: 0,
    explanation: "The Spanish flag (La Rojigualda) has three horizontal stripes: red, yellow (double width), and red, with the coat of arms.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-045",
    question: "Which country's flag features a red vertical stripe on the left and a green stripe on the right with an armillary sphere and national shield?",
    options: ["Portugal", "Italy", "Mexico", "Brazil"],
    correctAnswer: 0,
    explanation: "The flag of Portugal is vertically divided into green at the hoist and red at the fly, centered with the Portuguese coat of arms.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-046",
    question: "Which country has a solid red flag featuring a golden double-headed eagle in the center?",
    options: ["Albania", "Montenegro", "Serbia", "North Macedonia"],
    correctAnswer: 1,
    explanation: "Montenegro's flag consists of a red banner bordered by gold with the coat of arms (a golden double-headed eagle) in the center.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-047",
    question: "Which country has a black double-headed eagle centered on a solid red background?",
    options: ["Albania", "Poland", "Austria", "Germany"],
    correctAnswer: 0,
    explanation: "Albania's flag features a silhouette of a black double-headed eagle in the center of a red background.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-048",
    question: "Which country's flag features a yellow sun with eight rays and three five-pointed yellow stars in the corners of a white triangle?",
    options: ["Philippines", "Malaysia", "Indonesia", "Myanmar"],
    correctAnswer: 0,
    explanation: "The national flag of the Philippines features a white triangle containing a golden sun with eight rays and three stars.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-049",
    question: "Which country's flag features a silhouette of the Angkor Wat temple complex?",
    options: ["Laos", "Cambodia", "Thailand", "Vietnam"],
    correctAnswer: 1,
    explanation: "Cambodia is one of only a few nations to feature a building on its flag, displaying the white depiction of Angkor Wat.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  },
  {
    questionId: "flag-050",
    question: "What color is the circular disc in the center of the flag of Palau, symbolizing the moon?",
    options: ["Silver", "Yellow", "White", "Orange"],
    correctAnswer: 1,
    explanation: "Palau's flag features a bright yellow circular disc representing the full moon on a light blue background symbolizing the ocean.",
    difficulty: "easy",
    topic: "World Flags Challenge"
  }
];

// 2. World Geography (50 Questions)
const WORLD_GEOGRAPHY_QUESTIONS = [
  {
    questionId: "geo-001",
    question: "What is the longest river in the world by traditional geographic consensus?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: 1,
    explanation: "The Nile River in Africa, stretching approximately 6,650 km, is traditionally recognized as the longest river in the world.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-002",
    question: "What is the highest mountain peak above sea level on Earth?",
    options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Kangchenjunga"],
    correctAnswer: 2,
    explanation: "Mount Everest in the Himalayas rises to an elevation of 8,848.86 meters above sea level.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-003",
    question: "What is the largest ocean on Earth by surface area?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    explanation: "The Pacific Ocean covers over 165 million square kilometers, making it larger than all the Earth's land area combined.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-004",
    question: "What is the largest country in the world by total land area?",
    options: ["Canada", "China", "Russia", "United States"],
    correctAnswer: 2,
    explanation: "Russia spans over 17 million square kilometers across Eastern Europe and Northern Asia.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-005",
    question: "What is the smallest independent sovereign state in the world by both area and population?",
    options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
    correctAnswer: 2,
    explanation: "Vatican City covers an area of just 0.49 square kilometers (121 acres) completely surrounded by Rome, Italy.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-006",
    question: "What is the largest hot desert in the world?",
    options: ["Gobi Desert", "Sahara Desert", "Kalahari Desert", "Thar Desert"],
    correctAnswer: 1,
    explanation: "The Sahara Desert in Northern Africa is the largest subtropical hot desert on Earth, covering over 9 million square kilometers.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-007",
    question: "What is the capital city of France?",
    options: ["Marseille", "Lyon", "Paris", "Nice"],
    correctAnswer: 2,
    explanation: "Paris, situated on the Seine River, is the capital and largest city of France.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-008",
    question: "Which continent is known as the 'Dark Continent' and contains the highest number of sovereign countries?",
    options: ["Asia", "Africa", "Europe", "South America"],
    correctAnswer: 1,
    explanation: "Africa contains 54 internationally recognized sovereign states, more than any other continent.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-009",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    explanation: "Canberra was chosen as the compromise capital of Australia in 1908 between rivals Sydney and Melbourne.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-010",
    question: "Which strait separates the continents of Asia and North America?",
    options: ["Strait of Gibraltar", "Bering Strait", "Malacca Strait", "Bosphorus Strait"],
    correctAnswer: 1,
    explanation: "The Bering Strait connects the Pacific and Arctic oceans, separating Russia in Asia from Alaska in North America.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-011",
    question: "What is the largest freshwater lake in the world by surface area?",
    options: ["Lake Victoria", "Lake Superior", "Lake Baikal", "Caspian Sea"],
    correctAnswer: 1,
    explanation: "Lake Superior, on the US-Canada border, is the world's largest freshwater lake by surface area (approx. 82,100 km²).",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-012",
    question: "What is the deepest lake in the world, holding 20% of Earth's unfrozen surface freshwater?",
    options: ["Lake Tanganyika", "Lake Baikal", "Caspian Sea", "Lake Superior"],
    correctAnswer: 1,
    explanation: "Lake Baikal in Siberia, Russia, has a maximum depth of 1,642 meters (5,387 feet).",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-013",
    question: "Which country is known as the 'Land of the Rising Sun'?",
    options: ["China", "Japan", "South Korea", "Thailand"],
    correctAnswer: 1,
    explanation: "Japan is called Nihon or Nippon natively, which translates literally to 'origin of the sun' or 'Land of the Rising Sun'.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-014",
    question: "What is the highest uninterrupted waterfall in the world?",
    options: ["Niagara Falls", "Victoria Falls", "Angel Falls", "Iguazu Falls"],
    correctAnswer: 2,
    explanation: "Angel Falls in Venezuela drops 979 meters (3,212 feet) with an uninterrupted plunge of 807 meters.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-015",
    question: "Which imaginary line divides the Earth into the Northern and Southern Hemispheres?",
    options: ["Prime Meridian", "Tropic of Cancer", "Equator", "Tropic of Capricorn"],
    correctAnswer: 2,
    explanation: "The Equator is the line of 0 degrees latitude that circles the Earth midway between the North and South poles.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-016",
    question: "What is the capital city of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Yokohama"],
    correctAnswer: 2,
    explanation: "Tokyo is the bustling capital city and economic hub of Japan.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-017",
    question: "What is the longest continental mountain range in the world?",
    options: ["Rocky Mountains", "Himalayas", "Andes Mountains", "Alps"],
    correctAnswer: 2,
    explanation: "The Andes span over 7,000 kilometers along the western coast of South America.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-018",
    question: "Which country has the longest coastline in the world?",
    options: ["Russia", "Canada", "Norway", "Indonesia"],
    correctAnswer: 1,
    explanation: "Canada possesses the world's longest coastline, measuring over 202,080 kilometers (125,567 miles).",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-019",
    question: "What is the capital city of Canada?",
    options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    correctAnswer: 2,
    explanation: "Ottawa in the province of Ontario is the federal capital of Canada.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-020",
    question: "Which body of water connects the Atlantic Ocean to the Mediterranean Sea?",
    options: ["Suez Canal", "Strait of Gibraltar", "Bosphorus Strait", "Panama Canal"],
    correctAnswer: 1,
    explanation: "The Strait of Gibraltar connects the Atlantic Ocean to the Mediterranean Sea, separating Spain from Morocco.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-021",
    question: "Which is the most populous country in the world as of 2023 onwards?",
    options: ["China", "India", "United States", "Indonesia"],
    correctAnswer: 1,
    explanation: "According to UN official demographic projections, India overtook China in 2023 to become the world's most populous nation.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-022",
    question: "In which country is the famous historic Taj Mahal located?",
    options: ["Pakistan", "India", "Bangladesh", "Iran"],
    correctAnswer: 1,
    explanation: "The Taj Mahal is located on the south bank of the Yamuna River in Agra, India.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-023",
    question: "Which African country has three official capital cities: Pretoria, Cape Town, and Bloemfontein?",
    options: ["Nigeria", "South Africa", "Kenya", "Egypt"],
    correctAnswer: 1,
    explanation: "South Africa divides power among three capitals: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-024",
    question: "What is the capital of Italy?",
    options: ["Milan", "Venice", "Rome", "Florence"],
    correctAnswer: 2,
    explanation: "Rome, known as the 'Eternal City', is the capital of Italy.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-025",
    question: "Which continent is also a single sovereign country?",
    options: ["Europe", "Antarctica", "Australia", "South America"],
    correctAnswer: 2,
    explanation: "Australia is both a continent and a single sovereign nation.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-026",
    question: "What is the largest island in the world that is not a continent?",
    options: ["Madagascar", "New Guinea", "Greenland", "Borneo"],
    correctAnswer: 2,
    explanation: "Greenland, an autonomous territory within the Kingdom of Denmark, is the world's largest island.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-027",
    question: "Which river flows through the Grand Canyon in the United States?",
    options: ["Mississippi River", "Colorado River", "Rio Grande", "Columbia River"],
    correctAnswer: 1,
    explanation: "The Colorado River carved the famous Grand Canyon in Arizona over millions of years.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-028",
    question: "What is the capital of Germany?",
    options: ["Munich", "Frankfurt", "Berlin", "Hamburg"],
    correctAnswer: 2,
    explanation: "Berlin is the capital and largest city of Germany.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-029",
    question: "Which sea is the saltiest and lowest body of water on Earth's land surface?",
    options: ["Red Sea", "Caspian Sea", "Dead Sea", "Black Sea"],
    correctAnswer: 2,
    explanation: "The Dead Sea borders Jordan and Israel, lying about 430 meters below sea level with nearly 34% salinity.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-030",
    question: "What canal connects the Mediterranean Sea to the Red Sea, enabling direct maritime trade between Europe and Asia?",
    options: ["Panama Canal", "Suez Canal", "Kiel Canal", "Erie Canal"],
    correctAnswer: 1,
    explanation: "The Suez Canal in Egypt opened in 1869, providing a direct water route between the North Atlantic and northern Indian oceans.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-031",
    question: "Which city is the capital of the United Kingdom?",
    options: ["Edinburgh", "Manchester", "London", "Birmingham"],
    correctAnswer: 2,
    explanation: "London is the capital of both England and the United Kingdom.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-032",
    question: "What is the capital of Russia?",
    options: ["Saint Petersburg", "Moscow", "Novosibirsk", "Kazan"],
    correctAnswer: 1,
    explanation: "Moscow is the capital and largest metropolis of Russia.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-033",
    question: "Which major river runs through Egypt and flows into the Mediterranean Sea?",
    options: ["Congo", "Niger", "Nile", "Zambezi"],
    correctAnswer: 2,
    explanation: "The Nile River runs northward through Egypt and terminates in a large delta at the Mediterranean Sea.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-034",
    question: "What is the capital of China?",
    options: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
    correctAnswer: 1,
    explanation: "Beijing is the capital of the People's Republic of China.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-035",
    question: "Which is the highest plateau in the world, often called the 'Roof of the World'?",
    options: ["Deccan Plateau", "Colorado Plateau", "Tibetan Plateau", "Anatolian Plateau"],
    correctAnswer: 2,
    explanation: "The Tibetan Plateau in Central and East Asia averages over 4,500 meters in elevation.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-036",
    question: "What is the capital city of Brazil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    correctAnswer: 2,
    explanation: "Brasília was inaugurated in 1960 as the planned capital of Brazil, replacing Rio de Janeiro.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-037",
    question: "What is the capital of Egypt?",
    options: ["Alexandria", "Cairo", "Giza", "Luxor"],
    correctAnswer: 1,
    explanation: "Cairo is the historic capital city and cultural center of Egypt.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-038",
    question: "Which desert covers much of northern China and southern Mongolia?",
    options: ["Thar Desert", "Gobi Desert", "Atacama Desert", "Arabian Desert"],
    correctAnswer: 1,
    explanation: "The Gobi Desert is a vast cold desert region spanning northern China and southern Mongolia.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-039",
    question: "Which river flows through Paris?",
    options: ["Thames", "Danube", "Seine", "Rhine"],
    correctAnswer: 2,
    explanation: "The Seine River flows right through the heart of Paris, dividing the city into Left and Right Banks.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-040",
    question: "What is the largest country in South America by area and population?",
    options: ["Argentina", "Colombia", "Brazil", "Peru"],
    correctAnswer: 2,
    explanation: "Brazil occupies almost half of South America's entire landmass.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-041",
    question: "What is the capital of Spain?",
    options: ["Barcelona", "Seville", "Madrid", "Valencia"],
    correctAnswer: 2,
    explanation: "Madrid is the capital and most populous municipality of Spain.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-042",
    question: "What is the driest non-polar desert in the world?",
    options: ["Sahara Desert", "Atacama Desert", "Mojave Desert", "Namib Desert"],
    correctAnswer: 1,
    explanation: "The Atacama Desert in Chile is the driest non-polar desert on Earth, with some areas receiving virtually no rain.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-043",
    question: "Which ocean lies entirely in the Eastern Hemisphere and is named after a major country?",
    options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
    correctAnswer: 2,
    explanation: "The Indian Ocean is the only ocean named after a country (India).",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-044",
    question: "What is the capital of South Korea?",
    options: ["Busan", "Incheon", "Seoul", "Daegu"],
    correctAnswer: 2,
    explanation: "Seoul is the capital and financial heart of South Korea.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-045",
    question: "Which European country is shaped like a boot?",
    options: ["Greece", "Portugal", "Italy", "Croatia"],
    correctAnswer: 2,
    explanation: "Italy's geographic peninsula famously resembles a high-heeled boot kicking the island of Sicily.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-046",
    question: "What is the capital of Argentina?",
    options: ["Cordoba", "Rosario", "Buenos Aires", "Mendoza"],
    correctAnswer: 2,
    explanation: "Buenos Aires is the capital and largest city of Argentina, located on the Río de la Plata.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-047",
    question: "Which country is home to the ancient ruins of Machu Picchu?",
    options: ["Bolivia", "Chile", "Peru", "Ecuador"],
    correctAnswer: 2,
    explanation: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-048",
    question: "Which country has the most natural lakes in the world, holding over 60% of all lakes globally?",
    options: ["United States", "Russia", "Canada", "Finland"],
    correctAnswer: 2,
    explanation: "Canada contains more lakes than the rest of the world combined, numbering around 2 million lakes.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-049",
    question: "What is the capital of Thailand?",
    options: ["Phuket", "Chiang Mai", "Bangkok", "Pattaya"],
    correctAnswer: 2,
    explanation: "Bangkok (Krung Thep Maha Nakhon) is the vibrant capital city of Thailand.",
    difficulty: "easy",
    topic: "World Geography"
  },
  {
    questionId: "geo-050",
    question: "Which is the smallest continent by land area?",
    options: ["Europe", "Antarctica", "Australia (Oceania)", "South America"],
    correctAnswer: 2,
    explanation: "Australia is the smallest of Earth's seven continents by total land area.",
    difficulty: "easy",
    topic: "World Geography"
  }
];

// 3. Indian History (50 Questions)
const INDIAN_HISTORY_QUESTIONS = [
  {
    questionId: "ind-hist-001",
    question: "Who was the first Prime Minister of independent India?",
    options: ["Sardar Vallabhbhai Patel", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Lal Bahadur Shastri"],
    correctAnswer: 1,
    explanation: "Jawaharlal Nehru served as India's first Prime Minister from independence in 1947 until his death in 1964.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-002",
    question: "In which year did India gain independence from British colonial rule?",
    options: ["1942", "1945", "1947", "1950"],
    correctAnswer: 2,
    explanation: "India achieved independence at midnight on August 15, 1947.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-003",
    question: "Who is officially revered as the 'Father of the Nation' in India?",
    options: ["Subhas Chandra Bose", "Mahatma Gandhi", "Bhagat Singh", "Rabindranath Tagore"],
    correctAnswer: 1,
    explanation: "Mahatma Gandhi (Mohandas Karamchand Gandhi) led the non-violent freedom struggle and is honored as the Father of the Nation.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-004",
    question: "Who is known as the 'Chief Architect of the Indian Constitution'?",
    options: ["Dr. Rajendra Prasad", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "B.N. Rau"],
    correctAnswer: 1,
    explanation: "Dr. Bhimrao Ramji Ambedkar chaired the Drafting Committee of the Constituent Assembly that created the Constitution of India.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-005",
    question: "Who was the first President of independent India?",
    options: ["Dr. Sarvepalli Radhakrishnan", "Dr. Rajendra Prasad", "Zakir Husain", "C. Rajagopalachari"],
    correctAnswer: 1,
    explanation: "Dr. Rajendra Prasad served as the first President of the Republic of India from 1950 to 1962.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-006",
    question: "Which Mughal Emperor built the Taj Mahal in Agra in memory of his beloved wife Mumtaz Mahal?",
    options: ["Akbar", "Jahangir", "Shah Jahan", "Babur"],
    correctAnswer: 2,
    explanation: "Shah Jahan commissioned the white marble mausoleum in 1631 in memory of his wife Mumtaz Mahal.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-007",
    question: "Who was the founder of the Maurya Empire in ancient India?",
    options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Bimbisara"],
    correctAnswer: 1,
    explanation: "Chandragupta Maurya founded the Maurya Empire around 322 BCE with the guidance of Chanakya (Kautilya).",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-008",
    question: "Which Mauryan Emperor renounced violence and embraced Buddhism following the devastating Kalinga War?",
    options: ["Chandragupta Maurya", "Bindusara", "Ashoka the Great", "Brihadratha"],
    correctAnswer: 2,
    explanation: "Emperor Ashoka embraced Buddhism and the philosophy of Dhamma after witnessing the bloodshed of the Kalinga War in 261 BCE.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-009",
    question: "Who was the first female Prime Minister of India?",
    options: ["Sarojini Naidu", "Indira Gandhi", "Pratibha Patil", "Sushma Swaraj"],
    correctAnswer: 1,
    explanation: "Indira Gandhi was the first and to date only female Prime Minister of India, serving across multiple terms.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-010",
    question: "Who is known as the 'Iron Man of India' for integrating over 560 princely states into the Indian Union?",
    options: ["Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Lal Bahadur Shastri", "Bal Gangadhar Tilak"],
    correctAnswer: 0,
    explanation: "Sardar Vallabhbhai Patel, the first Deputy PM and Home Minister, united India's princely states into one nation.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-011",
    question: "The historic Jallianwala Bagh massacre occurred in which city in 1919?",
    options: ["Lahore", "Amritsar", "Delhi", "Jalandhar"],
    correctAnswer: 1,
    explanation: "British troops under General Dyer opened fire on unarmed civilians at Jallianwala Bagh in Amritsar, Punjab on April 13, 1919.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-012",
    question: "Who gave the famous slogan 'Give me blood, and I shall give you freedom'?",
    options: ["Bhagat Singh", "Subhas Chandra Bose", "Chandrasekhar Azad", "Bal Gangadhar Tilak"],
    correctAnswer: 1,
    explanation: "Netaji Subhas Chandra Bose delivered this rallying cry to the Indian National Army (Azad Hind Fauj) in Burma.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-013",
    question: "In which year did the historic Revolt of 1857 (First War of Indian Independence) break out?",
    options: ["1757", "1857", "1905", "1942"],
    correctAnswer: 1,
    explanation: "The Sepoy Mutiny / First War of Indian Independence began in Meerut in May 1857.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-014",
    question: "Which movement was launched by Mahatma Gandhi in August 1942 calling for British withdrawal from India?",
    options: ["Non-Cooperation Movement", "Civil Disobedience Movement", "Quit India Movement", "Swadeshi Movement"],
    correctAnswer: 2,
    explanation: "The Quit India Movement (Bharat Chhodo Andolan) was launched at the Bombay session of the AICC on August 8, 1942.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-015",
    question: "Who was the founder of the Mughal Empire in India in 1526 following the First Battle of Panipat?",
    options: ["Akbar", "Humayun", "Babur", "Sher Shah Suri"],
    correctAnswer: 2,
    explanation: "Zahir-ud-din Muhammad Babur defeated Ibrahim Lodi in the First Battle of Panipat (1526) to establish the Mughal dynasty.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-016",
    question: "Who was the legendary Maratha warrior king who established the Maratha Empire and was crowned Chhatrapati in 1674?",
    options: ["Chhatrapati Sambhaji", "Chhatrapati Shivaji Maharaj", "Baji Rao I", "Peshwa Madhavrao"],
    correctAnswer: 1,
    explanation: "Chhatrapati Shivaji Maharaj carved out an independent Maratha kingdom and was crowned at Raigad in 1674.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-017",
    question: "Who composed the Indian national anthem, 'Jana Gana Mana'?",
    options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Kavi Pradeep"],
    correctAnswer: 1,
    explanation: "Rabindranath Tagore originally composed 'Bharoto Bhagyo Bidhata' in Bengali, whose first stanza was adopted as the National Anthem.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-018",
    question: "Who composed India's national song, 'Vande Mataram'?",
    options: ["Rabindranath Tagore", "Bankim Chandra Chattopadhyay", "Sri Aurobindo", "Swami Vivekananda"],
    correctAnswer: 1,
    explanation: "Bankim Chandra Chattopadhyay wrote 'Vande Mataram' in his 1882 novel Anandamath.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-019",
    question: "Which ancient civilization in the Indian subcontinent is famous for planned cities like Harappa and Mohenjo-Daro?",
    options: ["Vedic Civilization", "Indus Valley Civilization", "Maurya Civilization", "Gupta Civilization"],
    correctAnswer: 1,
    explanation: "The Indus Valley Civilization (c. 2500–1900 BCE) was famous for grid-pattern city layouts, drainage systems, and granaries.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-020",
    question: "Who was the prominent freedom fighter known as 'Shaheed-e-Azam' who was executed along with Rajguru and Sukhdev in 1931?",
    options: ["Chandrashekhar Azad", "Bhagat Singh", "Ashfaqulla Khan", "Ram Prasad Bismil"],
    correctAnswer: 1,
    explanation: "Bhagat Singh was martyred on March 23, 1931 at Lahore Jail at the young age of 23 and is honored as Shaheed-e-Azam.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-021",
    question: "Which historic march led by Mahatma Gandhi in 1930 broke the British salt tax monopoly?",
    options: ["Bardoli Satyagraha", "Dandi March (Salt Satyagraha)", "Champaran Satyagraha", "Kheda Satyagraha"],
    correctAnswer: 1,
    explanation: "Gandhi and 78 followers marched 240 miles from Sabarmati Ashram to Dandi, making salt on April 6, 1930.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-022",
    question: "Who was the Queen of Jhansi who fought heroically against the British in the Revolt of 1857?",
    options: ["Rani Padmini", "Rani Lakshmibai", "Begum Hazrat Mahal", "Kittur Chennamma"],
    correctAnswer: 1,
    explanation: "Rani Lakshmibai of Jhansi fought fearlessly against British forces during the 1857 Rebellion.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-023",
    question: "Which great Indian emperor is associated with the 'Navaratnas' (Nine Gems) including Birbal and Tansen?",
    options: ["Babur", "Humayun", "Akbar the Great", "Aurangzeb"],
    correctAnswer: 2,
    explanation: "The third Mughal emperor Akbar patronized nine extraordinarily talented individuals at his court called the Navaratnas.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-024",
    question: "Which period of ancient Indian history is widely regarded as the 'Golden Age of India' due to achievements in science, math, and arts?",
    options: ["Maurya Empire", "Gupta Empire", "Kushan Empire", "Chola Empire"],
    correctAnswer: 1,
    explanation: "The Gupta Empire (c. 4th to 6th century CE) saw brilliant advances by Aryabhata, Kalidasa, and Varahamihira.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-025",
    question: "Who gave the famous slogan 'Swaraj is my birthright, and I shall have it'?",
    options: ["Lala Lajpat Rai", "Bipin Chandra Pal", "Bal Gangadhar Tilak", "Gopal Krishna Gokhale"],
    correctAnswer: 2,
    explanation: "Lokmanya Bal Gangadhar Tilak coined this inspirational phrase during India's national independence movement.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-026",
    question: "What year did the Constitution of India officially come into effect, celebrated annually as Republic Day?",
    options: ["1947", "1948", "1950", "1952"],
    correctAnswer: 2,
    explanation: "The Constitution of India came into full legal effect on January 26, 1950, transitioning India into a sovereign democratic republic.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-027",
    question: "Who was the first woman to become President of India?",
    options: ["Sarojini Naidu", "Indira Gandhi", "Pratibha Patil", "Droupadi Murmu"],
    correctAnswer: 2,
    explanation: "Pratibha Patil served as the 12th President of India from 2007 to 2012, becoming the first female president of the nation.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-028",
    question: "The historic Battle of Plassey was fought in which year, laying the foundation of British East India Company rule?",
    options: ["1757", "1764", "1857", "1600"],
    correctAnswer: 0,
    explanation: "On June 23, 1757, Robert Clive defeated Siraj-ud-Daulah, the Nawab of Bengal, at Plassey.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-029",
    question: "Who was the first Indian to be awarded the Nobel Prize in 1913?",
    options: ["C.V. Raman", "Rabindranath Tagore", "Mother Teresa", "Hargobind Khorana"],
    correctAnswer: 1,
    explanation: "Rabindranath Tagore was awarded the 1913 Nobel Prize in Literature for his collection of poems, Gitanjali.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-030",
    question: "Which ancient university in modern-day Bihar was one of the world's greatest centers of Buddhist learning?",
    options: ["Takshashila", "Nalanda University", "Vikramashila", "Vallabhi"],
    correctAnswer: 1,
    explanation: "Nalanda University was founded during the Gupta era in the 5th century CE and attracted scholars from across Asia.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-031",
    question: "Who was the founder of Sikhism and the first of the ten Sikh Gurus?",
    options: ["Guru Gobind Singh", "Guru Nanak Dev Ji", "Guru Arjan Dev Ji", "Guru Tegh Bahadur Ji"],
    correctAnswer: 1,
    explanation: "Guru Nanak Dev Ji (1469–1539) founded Sikhism in the Punjab region.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-032",
    question: "Which Sikh Guru established the Khalsa Panth in 1699 at Anandpur Sahib?",
    options: ["Guru Nanak", "Guru Har Gobind", "Guru Tegh Bahadur", "Guru Gobind Singh"],
    correctAnswer: 3,
    explanation: "Guru Gobind Singh Ji, the tenth Sikh Guru, initiated the Khalsa on Baisakhi day in 1699.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-033",
    question: "Who was the British Viceroy of India at the time of Partition and Independence in 1947?",
    options: ["Lord Curzon", "Lord Mountbatten", "Lord Linlithgow", "Lord Wavell"],
    correctAnswer: 1,
    explanation: "Lord Louis Mountbatten was the last British Viceroy and oversaw the partition and transfer of power.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-034",
    question: "Who founded the Arya Samaj in 1875 advocating a return to the pristine teachings of the Vedas?",
    options: ["Raja Ram Mohan Roy", "Swami Dayananda Saraswati", "Swami Vivekananda", "Ishwar Chandra Vidyasagar"],
    correctAnswer: 1,
    explanation: "Swami Dayananda Saraswati founded the Arya Samaj in Bombay with the slogan 'Back to the Vedas'.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-035",
    question: "Who founded the Brahmo Samaj in 1828 and worked tirelessly to abolish the practice of Sati?",
    options: ["Raja Ram Mohan Roy", "Swami Vivekananda", "Rabindranath Tagore", "Keshub Chandra Sen"],
    correctAnswer: 0,
    explanation: "Raja Ram Mohan Roy, known as the 'Father of Indian Renaissance', led the campaign that outlawed Sati in 1829.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-036",
    question: "Who gave the famous and powerful speech representing Hinduism at the World's Parliament of Religions in Chicago in 1893?",
    options: ["Swami Dayananda", "Swami Vivekananda", "Paramahansa Yogananda", "Sri Aurobindo"],
    correctAnswer: 1,
    explanation: "Swami Vivekananda began his historic address with 'Sisters and brothers of America!', earning a standing ovation.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-037",
    question: "Which ancient treatise on statecraft, economic policy, and military strategy was authored by Chanakya?",
    options: ["Arthashastra", "Manusmriti", "Kamasutra", "Panchatantra"],
    correctAnswer: 0,
    explanation: "The Arthashastra is Chanakya's (Kautilya's) comprehensive Sanskrit manual on governance and political statecraft.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-038",
    question: "Who was the ruler of Mysore known as the 'Tiger of Mysore' who resisted British expansion?",
    options: ["Hyder Ali", "Tipu Sultan", "Mir Jafar", "Nawab of Arcot"],
    correctAnswer: 1,
    explanation: "Tipu Sultan ruled Mysore from 1782 to 1799 and was famously called the 'Sher-e-Mysore' (Tiger of Mysore).",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-039",
    question: "Which city served as the capital of British India before it was shifted to New Delhi in 1911?",
    options: ["Bombay (Mumbai)", "Calcutta (Kolkata)", "Madras (Chennai)", "Agra"],
    correctAnswer: 1,
    explanation: "Calcutta was the capital of the British Indian Empire until King George V announced the transfer to Delhi at the 1911 Delhi Durbar.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-040",
    question: "Who was the first Indian woman to become the President of the Indian National Congress?",
    options: ["Annie Besant", "Sarojini Naidu", "Indira Gandhi", "Sucheta Kripalani"],
    correctAnswer: 1,
    explanation: "Sarojini Naidu presided over the 1925 Kanpur session, becoming the first Indian woman Congress president (Annie Besant was British).",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-041",
    question: "Who was the founder of the Indian National Army (Azad Hind Fauj) initially formed in 1942?",
    options: ["Subhas Chandra Bose", "Captain Mohan Singh", "Rash Behari Bose", "Bhagat Singh"],
    correctAnswer: 1,
    explanation: "Captain Mohan Singh first organized Indian PoWs into the INA in Malaya in 1942, before Netaji took leadership in 1943.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-042",
    question: "Which Indian mathematician from the Gupta era wrote the 'Aryabhatiya' and approximated the value of Pi?",
    options: ["Brahmagupta", "Aryabhata", "Bhaskara I", "Varahamihira"],
    correctAnswer: 1,
    explanation: "Aryabhata (476–550 CE) proposed that the Earth rotates on its axis and approximated Pi to 3.1416.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-043",
    question: "Who was the only female ruler of the Delhi Sultanate?",
    options: ["Nur Jahan", "Razia Sultana", "Chand Bibi", "Mumtaz Mahal"],
    correctAnswer: 1,
    explanation: "Razia Sultana ruled the Delhi Sultanate from 1236 to 1240, succeeding her father Sultan Iltutmish.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-044",
    question: "In which year did Vasco da Gama arrive at Calicut, India, discovering the direct sea route from Europe?",
    options: ["1492", "1498", "1526", "1600"],
    correctAnswer: 1,
    explanation: "Portuguese explorer Vasco da Gama landed at Kappad near Calicut (Kozhikode) in Kerala in May 1498.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-045",
    question: "The ancient rock-cut caves of Ajanta and Ellora are located in which Indian state?",
    options: ["Madhya Pradesh", "Maharashtra", "Karnataka", "Rajasthan"],
    correctAnswer: 1,
    explanation: "The UNESCO World Heritage Sites of Ajanta and Ellora caves are situated in the Aurangabad (Chhatrapati Sambhaji Nagar) district of Maharashtra.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-046",
    question: "Who was the second Prime Minister of India who coined the historic slogan 'Jai Jawan Jai Kisan'?",
    options: ["Gulzarilal Nanda", "Lal Bahadur Shastri", "Morarji Desai", "Charan Singh"],
    correctAnswer: 1,
    explanation: "Lal Bahadur Shastri coined 'Jai Jawan Jai Kisan' during the 1965 Indo-Pak war to motivate soldiers and farmers.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-047",
    question: "Who was the commander of the British Indian Army responsible for ordering fire at Jallianwala Bagh?",
    options: ["Lord Curzon", "General Dyer", "General Cornwallis", "Lord Dalhousie"],
    correctAnswer: 1,
    explanation: "Brigadier-General Reginald Dyer ordered troops to block exits and open fire on the gathering at Jallianwala Bagh.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-048",
    question: "Which movement began with the Partition of Bengal in 1905, promoting domestic Indian goods and boycotting British textiles?",
    options: ["Swadeshi Movement", "Quit India Movement", "Non-Cooperation Movement", "Khilafat Movement"],
    correctAnswer: 0,
    explanation: "The Swadeshi Movement arose against Lord Curzon's partition of Bengal, encouraging self-reliance and the burning of foreign clothes.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-049",
    question: "Who was the supreme commander of the Delhi Sultanate who founded the Slave (Mamluk) Dynasty in 1206?",
    options: ["Qutb-ud-din Aibak", "Iltutmish", "Balban", "Alauddin Khilji"],
    correctAnswer: 0,
    explanation: "Qutb-ud-din Aibak became the first Sultan of Delhi in 1206 and began construction of the Qutub Minar.",
    difficulty: "easy",
    topic: "Indian History"
  },
  {
    questionId: "ind-hist-050",
    question: "Which ancient Indian King was famously called 'Devanampriya Priyadasi' in his rock and pillar edicts?",
    options: ["Samudragupta", "Harsha", "Ashoka", "Kanishka"],
    correctAnswer: 2,
    explanation: "Emperor Ashoka's edicts across the subcontinent consistently refer to him as 'Devanampriya' (Beloved of the Gods).",
    difficulty: "easy",
    topic: "Indian History"
  }
];

// 4. World History (50 Questions)
const WORLD_HISTORY_QUESTIONS = [
  {
    questionId: "wld-hist-001",
    question: "In which year did World War I begin?",
    options: ["1912", "1914", "1918", "1939"],
    correctAnswer: 1,
    explanation: "World War I began on July 28, 1914 following the assassination of Archduke Franz Ferdinand of Austria.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-002",
    question: "In which year did World War II end with the unconditional surrender of Axis forces?",
    options: ["1943", "1944", "1945", "1948"],
    correctAnswer: 2,
    explanation: "World War II ended in 1945 following the surrender of Germany in May and Japan in September.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-003",
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correctAnswer: 2,
    explanation: "George Washington served as the first U.S. President from 1789 to 1797 after leading the Continental Army.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-004",
    question: "Which French military leader and Emperor conquered much of continental Europe in the early 19th century?",
    options: ["Louis XIV", "Napoleon Bonaparte", "Charles de Gaulle", "Robespierre"],
    correctAnswer: 1,
    explanation: "Napoleon Bonaparte rose during the French Revolution, crowned himself Emperor in 1804, and dominated European warfare.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-005",
    question: "In which ancient civilization were the Great Pyramids of Giza built?",
    options: ["Ancient Greece", "Ancient Rome", "Ancient Egypt", "Mesopotamia"],
    correctAnswer: 2,
    explanation: "The pyramids at Giza were built during the Old Kingdom period of Ancient Egypt as royal tombs for pharaohs.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-006",
    question: "What year did the historic Apollo 11 mission land the first humans on the Moon?",
    options: ["1965", "1969", "1972", "1975"],
    correctAnswer: 1,
    explanation: "On July 20, 1969, American astronauts Neil Armstrong and Buzz Aldrin landed the Apollo 11 Lunar Module on the Moon.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-007",
    question: "Who was the first human to walk on the surface of the Moon?",
    options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Michael Collins"],
    correctAnswer: 1,
    explanation: "Neil Armstrong stepped onto the lunar surface declaring, 'That's one small step for man, one giant leap for mankind.'",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-008",
    question: "Who was the first human being to travel into outer space in 1961?",
    options: ["Neil Armstrong", "Yuri Gagarin", "Alan Shepard", "John Glenn"],
    correctAnswer: 1,
    explanation: "Soviet cosmonaut Yuri Gagarin orbited the Earth on April 12, 1961 aboard Vostok 1.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-009",
    question: "In which year did the Berlin Wall fall, signaling the impending end of the Cold War?",
    options: ["1985", "1989", "1991", "1993"],
    correctAnswer: 1,
    explanation: "The Berlin Wall fell on November 9, 1989, leading to the reunification of East and West Germany.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-010",
    question: "The sinking of which famous luxury passenger liner occurred on its maiden voyage in April 1912?",
    options: ["Lusitania", "Britannic", "Titanic", "Queen Mary"],
    correctAnswer: 2,
    explanation: "The RMS Titanic struck an iceberg in the North Atlantic and sank on the night of April 14–15, 1912.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-011",
    question: "The storming of the Bastille prison in July 1789 was the flashpoint of which major revolution?",
    options: ["American Revolution", "Russian Revolution", "French Revolution", "Industrial Revolution"],
    correctAnswer: 2,
    explanation: "The storming of the Bastille on July 14, 1789 marked the dramatic opening conflict of the French Revolution.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-012",
    question: "Who was the leader of the Soviet Union during World War II?",
    options: ["Vladimir Lenin", "Joseph Stalin", "Nikita Khrushchev", "Leon Trotsky"],
    correctAnswer: 1,
    explanation: "Joseph Stalin ruled the Soviet Union as General Secretary throughout World War II and the onset of the Cold War.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-013",
    question: "Which Roman general and statesman was assassinated on the Ides of March (March 15) in 44 BCE?",
    options: ["Julius Caesar", "Augustus", "Mark Antony", "Nero"],
    correctAnswer: 0,
    explanation: "Julius Caesar was assassinated by a conspiracy of Roman senators led by Marcus Junius Brutus in the Theatre of Pompey.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-014",
    question: "Who was the first Emperor of the Roman Empire, ruling from 27 BCE until 14 CE?",
    options: ["Julius Caesar", "Caesar Augustus", "Tiberius", "Claudius"],
    correctAnswer: 1,
    explanation: "Augustus (Octavian), the adopted heir of Julius Caesar, became the first Emperor of Rome, initiating the Pax Romana.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-015",
    question: "In which year did Christopher Columbus make his historic first landfall in the Americas?",
    options: ["1492", "1498", "1512", "1540"],
    correctAnswer: 0,
    explanation: "Christopher Columbus crossed the Atlantic under Spanish sponsorship and landed in the Bahamas in October 1492.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-016",
    question: "The Renaissance cultural and intellectual movement originated in which European country in the 14th century?",
    options: ["France", "England", "Italy", "Germany"],
    correctAnswer: 2,
    explanation: "The European Renaissance began in the wealthy city-states of central and northern Italy, especially Florence.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-017",
    question: "Which devastating pandemic, also known as the Black Death, killed an estimated 30–60% of Europe's population in the 14th century?",
    options: ["Smallpox", "Bubonic Plague", "Cholera", "Spanish Flu"],
    correctAnswer: 1,
    explanation: "The Bubonic Plague, caused by the bacterium Yersinia pestis, ravaged Europe between 1346 and 1353.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-018",
    question: "Who was the Prime Minister of the United Kingdom through most of World War II, known for his stirring wartime speeches?",
    options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Anthony Eden"],
    correctAnswer: 1,
    explanation: "Winston Churchill served as UK Prime Minister from 1940 to 1945, rallying the British people to resist Nazi Germany.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-019",
    question: "Which South African anti-apartheid revolutionary served 27 years in prison before becoming South Africa's first Black president in 1994?",
    options: ["Desmond Tutu", "Nelson Mandela", "Oliver Tambo", "Steve Biko"],
    correctAnswer: 1,
    explanation: "Nelson Mandela won the 1993 Nobel Peace Prize and was inaugurated as South Africa's first democratically elected president in 1994.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-020",
    question: "In which year did the United States declare its independence from Great Britain?",
    options: ["1774", "1776", "1783", "1789"],
    correctAnswer: 1,
    explanation: "The Continental Congress adopted the Declaration of Independence on July 4, 1776 in Philadelphia.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-021",
    question: "Which city was the target of the first atomic bomb used in warfare on August 6, 1945?",
    options: ["Nagasaki", "Hiroshima", "Tokyo", "Kyoto"],
    correctAnswer: 1,
    explanation: "The US B-29 bomber Enola Gay dropped the 'Little Boy' atomic bomb on the Japanese city of Hiroshima.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-022",
    question: "Which Japanese city was bombed with the second atomic bomb on August 9, 1945?",
    options: ["Hiroshima", "Nagasaki", "Osaka", "Nagoya"],
    correctAnswer: 1,
    explanation: "The 'Fat Man' plutonium bomb was detonated over Nagasaki three days after Hiroshima.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-023",
    question: "Who wrote the famous 'Ninety-five Theses' in 1517, sparking the Protestant Reformation in Europe?",
    options: ["John Calvin", "Martin Luther", "Henry VIII", "Erasmus"],
    correctAnswer: 1,
    explanation: "German monk and theologian Martin Luther nailed his 95 Theses to the door of All Saints' Church in Wittenberg.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-024",
    question: "What international organization was founded in 1945 following World War II to maintain global peace and security?",
    options: ["League of Nations", "United Nations", "NATO", "European Union"],
    correctAnswer: 1,
    explanation: "The United Nations (UN) was founded on October 24, 1945 by 51 member states.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-025",
    question: "The ancient Silk Road was a network of trade routes connecting China primarily with which region?",
    options: ["Sub-Saharan Africa", "The Mediterranean and Europe", "Australasia", "South America"],
    correctAnswer: 1,
    explanation: "The Silk Road facilitated trade in silk, spices, and culture between Han China and the Greco-Roman Mediterranean.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-026",
    question: "Which Greek philosopher was sentenced to death by drinking poison hemlock in 399 BCE?",
    options: ["Plato", "Aristotle", "Socrates", "Pythagoras"],
    correctAnswer: 2,
    explanation: "Socrates was convicted by an Athenian court of impiety and corrupting the youth, drinking hemlock as his sentence.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-027",
    question: "Who was the Macedonian king who created one of the largest empires of the ancient world by age 30?",
    options: ["Philip II", "Alexander the Great", "Pericles", "Darius the Great"],
    correctAnswer: 1,
    explanation: "Alexander the Great conquered Greece, Egypt, and the Persian Empire all the way to northern India before dying at 32.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-028",
    question: "In which year did the Russian Revolution take place, overthrowing the Czarist autocracy and leading to Bolshevik rule?",
    options: ["1905", "1914", "1917", "1922"],
    correctAnswer: 2,
    explanation: "The 1917 Russian Revolution comprised the February Revolution and the October Revolution led by Lenin's Bolsheviks.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-029",
    question: "Who was the British monarch who reigned for over 70 years from 1952 to 2022?",
    options: ["Queen Victoria", "Queen Elizabeth I", "Queen Elizabeth II", "Queen Anne"],
    correctAnswer: 2,
    explanation: "Queen Elizabeth II reigned from February 1952 until her passing in September 2022, the longest in British history.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-030",
    question: "Which battle in 1815 marked the final military defeat of Napoleon Bonaparte?",
    options: ["Battle of Austerlitz", "Battle of Leipzig", "Battle of Waterloo", "Battle of Trafalgar"],
    correctAnswer: 2,
    explanation: "Napoleon was decisively defeated by British and Prussian armies led by the Duke of Wellington and Gebhard von Blücher at Waterloo.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-031",
    question: "Which US President issued the Emancipation Proclamation in 1863 during the American Civil War?",
    options: ["Ulysses S. Grant", "Abraham Lincoln", "Andrew Jackson", "Thomas Jefferson"],
    correctAnswer: 1,
    explanation: "Abraham Lincoln issued the Emancipation Proclamation on January 1, 1863, declaring all slaves in Confederate states to be free.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-032",
    question: "In which ancient city did the first Olympic Games take place in 776 BCE?",
    options: ["Athens", "Sparta", "Olympia", "Corinth"],
    correctAnswer: 2,
    explanation: "The ancient Olympic Games were held in Olympia, Greece, in honor of Zeus.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-033",
    question: "Who was the Mongolian warrior-ruler who founded the Mongol Empire in the early 13th century?",
    options: ["Kublai Khan", "Genghis Khan", "Tamerlane", "Attila the Hun"],
    correctAnswer: 1,
    explanation: "Genghis Khan (born Temüjin) united the nomadic tribes of Northeast Asia to form the largest contiguous empire in history.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-034",
    question: "Which medieval English document signed by King John in 1215 established that everyone, even the king, is subject to the law?",
    options: ["Bill of Rights", "Magna Carta", "Doomsday Book", "Petition of Right"],
    correctAnswer: 1,
    explanation: "The Magna Carta (Great Charter) of 1215 laid foundational principles for constitutional governance and individual liberty.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-035",
    question: "Which war took place between the United States and the Soviet Union characterized by geopolitical tension, nuclear arms race, but no direct armed conflict?",
    options: ["World War I", "The Cold War", "Korean War", "Vietnam War"],
    correctAnswer: 1,
    explanation: "The Cold War was an ideological, military, and technological standoff between Western and Eastern Blocs from roughly 1947 to 1991.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-036",
    question: "In which year did the Soviet Union officially dissolve into 15 independent nations?",
    options: ["1989", "1990", "1991", "1995"],
    correctAnswer: 2,
    explanation: "The USSR dissolved in December 1991, ending the Cold War era.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-037",
    question: "What ancient wonder was built in Babylon by King Nebuchadnezzar II for his homesick wife?",
    options: ["Colossus of Rhodes", "Hanging Gardens of Babylon", "Lighthouse of Alexandria", "Temple of Artemis"],
    correctAnswer: 1,
    explanation: "The Hanging Gardens of Babylon featured lush tiered gardens described as a marvel of engineering.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-038",
    question: "Which infamous surprise military strike by the Imperial Japanese Navy on December 7, 1941 brought the United States into World War II?",
    options: ["Battle of Midway", "Attack on Pearl Harbor", "Battle of Iwo Jima", "Battle of Coral Sea"],
    correctAnswer: 1,
    explanation: "Japan attacked the US naval base at Pearl Harbor, Hawaii, prompting President Franklin D. Roosevelt to declare war.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-039",
    question: "Who was the female pilot who became the first woman to fly solo across the Atlantic Ocean in 1932?",
    options: ["Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Valentina Tereshkova"],
    correctAnswer: 0,
    explanation: "Amelia Earhart completed her solo transatlantic flight from Newfoundland to Northern Ireland in May 1932.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-040",
    question: "What defensive structure over 13,000 miles long was built across northern China over centuries to protect against nomadic invasions?",
    options: ["Grand Canal", "Great Wall of China", "Forbidden City", "Terracotta Army"],
    correctAnswer: 1,
    explanation: "The Great Wall of China was built by multiple dynasties, most notably the Qin, Han, and Ming dynasties.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-041",
    question: "Who was the first woman in space, orbiting the Earth aboard Vostok 6 in June 1963?",
    options: ["Sally Ride", "Valentina Tereshkova", "Svetlana Savitskaya", "Mae Jemison"],
    correctAnswer: 1,
    explanation: "Soviet cosmonaut Valentina Tereshkova spent nearly three days in space, completing 48 orbits.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-042",
    question: "Which city was the historic capital of the Byzantine Empire for over 1,000 years until it fell to the Ottomans in 1453?",
    options: ["Athens", "Constantinople (Istanbul)", "Rome", "Alexandria"],
    correctAnswer: 1,
    explanation: "Constantinople was founded by Roman Emperor Constantine the Great and fell to Sultan Mehmed II in 1453.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-043",
    question: "What was the name of the diplomatic alliance formed in 1949 between North American and European nations for collective defense?",
    options: ["Warsaw Pact", "NATO (North Atlantic Treaty Organization)", "League of Nations", "ANZUS"],
    correctAnswer: 1,
    explanation: "NATO was established by 12 founding countries in April 1949 to safeguard freedom and security.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-044",
    question: "Which European country experienced the Industrial Revolution first during the mid-18th century?",
    options: ["Germany", "France", "Great Britain", "Belgium"],
    correctAnswer: 2,
    explanation: "Great Britain pioneered the Industrial Revolution with steam engines, coal reserves, and mechanized textile mills.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-045",
    question: "Who was the Russian mystic and self-proclaimed holy man who befriended the family of Tsar Nicholas II?",
    options: ["Rasputin", "Trotsky", "Lenin", "Kerensky"],
    correctAnswer: 0,
    explanation: "Grigori Rasputin exerted immense influence over Tsarina Alexandra due to his perceived ability to treat Tsarevich Alexei's hemophilia.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-046",
    question: "What year did the famous D-Day invasion of Normandy by Allied forces take place?",
    options: ["1942", "1943", "1944", "1945"],
    correctAnswer: 2,
    explanation: "Operation Overlord (D-Day) commenced on June 6, 1944 with amphibious landings on the beaches of Normandy, France.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-047",
    question: "Which ancient civilization developed cuneiform, widely considered the earliest known writing system?",
    options: ["Egyptians", "Sumerians (Mesopotamia)", "Phoenicians", "Indus Valley"],
    correctAnswer: 1,
    explanation: "The Sumerians of ancient Mesopotamia invented wedge-shaped cuneiform writing on clay tablets c. 3200 BCE.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-048",
    question: "Who was the Queen of Egypt famous for her alliances with Julius Caesar and Mark Antony?",
    options: ["Nefertiti", "Hatshepsut", "Cleopatra VII", "Twosret"],
    correctAnswer: 2,
    explanation: "Cleopatra VII Philopator was the last active ruler of the Ptolemaic Kingdom of Egypt.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-049",
    question: "The ancient Greek city-state famous for its fierce military culture and the 300 Spartans at Thermopylae was:",
    options: ["Athens", "Sparta", "Thebes", "Rhodes"],
    correctAnswer: 1,
    explanation: "Sparta was a warrior society in ancient Greece renowned for its disciplined hoplite army and rigorous military training.",
    difficulty: "easy",
    topic: "World History"
  },
  {
    questionId: "wld-hist-050",
    question: "Which treaty officially ended World War I in June 1919?",
    options: ["Treaty of Paris", "Treaty of Versailles", "Treaty of Ghent", "Treaty of Utrecht"],
    correctAnswer: 1,
    explanation: "The Treaty of Versailles was signed on June 28, 1919 in the Hall of Mirrors at Versailles, France.",
    difficulty: "easy",
    topic: "World History"
  }
];

// 5. Famous Personalities (50 Questions)
const FAMOUS_PERSONALITIES_QUESTIONS = [
  {
    questionId: "pers-001",
    question: "Who is known as the 'Missile Man of India' for his contributions to India's civilian space and missile programs?",
    options: ["Vikram Sarabhai", "Dr. A.P.J. Abdul Kalam", "Homi J. Bhabha", "Satish Dhawan"],
    correctAnswer: 1,
    explanation: "Dr. A.P.J. Abdul Kalam played a leading role in developing the Agni and Prithvi missiles and served as the 11th President of India.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-002",
    question: "Who was known as the 'Nightingale of India' (Bharat Kokila) for her lyrical poetry?",
    options: ["Lata Mangeshkar", "Sarojini Naidu", "M.S. Subbulakshmi", "Asha Bhosle"],
    correctAnswer: 1,
    explanation: "Mahatma Gandhi bestowed the title 'Nightingale of India' on Sarojini Naidu for her lyrical and evocative English poetry.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-003",
    question: "Who painted the world-famous masterpiece 'Mona Lisa' and 'The Last Supper'?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Vincent van Gogh"],
    correctAnswer: 2,
    explanation: "Italian polymath Leonardo da Vinci painted the enigmatic Mona Lisa during the Renaissance.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-004",
    question: "Which legendary English playwright wrote 'Romeo and Juliet', 'Hamlet', and 'Macbeth'?",
    options: ["Charles Dickens", "William Shakespeare", "George Bernard Shaw", "Jane Austen"],
    correctAnswer: 1,
    explanation: "William Shakespeare is widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-005",
    question: "Who founded the Missionaries of Charity in Kolkata and was awarded the Nobel Peace Prize in 1979?",
    options: ["Florence Nightingale", "Mother Teresa (Saint Teresa of Calcutta)", "Joan of Arc", "Helen Keller"],
    correctAnswer: 1,
    explanation: "Mother Teresa devoted her life to serving the destitute and sick in Kolkata and was canonized as a Catholic saint in 2016.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-006",
    question: "Who was the visionary co-founder of Apple Inc. who unveiled the Macintosh, iPod, and iPhone?",
    options: ["Bill Gates", "Steve Jobs", "Steve Wozniak", "Mark Zuckerberg"],
    correctAnswer: 1,
    explanation: "Steve Jobs co-founded Apple and revolutionized consumer technology with iconic products including the iPhone and iPad.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-007",
    question: "Who co-founded Microsoft Corporation and became one of the world's leading philanthropists through the Gates Foundation?",
    options: ["Steve Jobs", "Bill Gates", "Larry Ellison", "Jeff Bezos"],
    correctAnswer: 1,
    explanation: "Bill Gates co-founded Microsoft in 1975 with Paul Allen and launched Windows, dominating personal computing.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-008",
    question: "Who is the legendary singer renowned as the 'Queen of Melody' who recorded songs for thousands of Indian films over seven decades?",
    options: ["Asha Bhosle", "Lata Mangeshkar", "K.S. Chithra", "Shreya Ghoshal"],
    correctAnswer: 1,
    explanation: "Lata Mangeshkar, the recipient of the Bharat Ratna, is celebrated as one of the greatest playback singers of all time.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-009",
    question: "Which civil rights icon delivered the memorable 'I Have a Dream' speech at the Lincoln Memorial in 1963?",
    options: ["Malcolm X", "Martin Luther King Jr.", "Rosa Parks", "John Lewis"],
    correctAnswer: 1,
    explanation: "Dr. Martin Luther King Jr. delivered his historic speech during the March on Washington for Jobs and Freedom.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-010",
    question: "Which British scientist authored 'On the Origin of Species' introducing the theory of evolution by natural selection?",
    options: ["Gregor Mendel", "Charles Darwin", "Alfred Russel Wallace", "Thomas Huxley"],
    correctAnswer: 1,
    explanation: "Charles Darwin published his groundbreaking theory of biological evolution by natural selection in 1859.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-011",
    question: "Who was the 'Lady with the Lamp' who revolutionized modern professional nursing during the Crimean War?",
    options: ["Clara Barton", "Florence Nightingale", "Mary Seacole", "Dorothea Dix"],
    correctAnswer: 1,
    explanation: "Florence Nightingale laid the foundation of modern nursing and sanitary hospital care while tending wounded British soldiers.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-012",
    question: "Which Indian theoretical physicist and mathematician worked with Albert Einstein to formulate a new state of matter?",
    options: ["C.V. Raman", "Satyendra Nath Bose", "Meghnad Saha", "Homi Bhabha"],
    correctAnswer: 1,
    explanation: "S.N. Bose collaborated with Einstein, leading to the discovery of the Bose-Einstein condensate and naming of 'bosons'.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-013",
    question: "Who was the blind and deaf American author and political activist who earned a bachelor of arts degree in 1904?",
    options: ["Anne Sullivan", "Helen Keller", "Laura Bridgman", "Marie Curie"],
    correctAnswer: 1,
    explanation: "Helen Keller overcame deafblindness with the help of teacher Anne Sullivan to become an internationally renowned author and orator.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-014",
    question: "Which famous Dutch Post-Impressionist artist painted 'The Starry Night' and 'Sunflowers'?",
    options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"],
    correctAnswer: 1,
    explanation: "Vincent van Gogh created some of the most influential works in Western art, including 'The Starry Night' in 1889.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-015",
    question: "Who was the visionary physicist and cosmologist who wrote the international bestseller 'A Brief History of Time' while living with ALS?",
    options: ["Carl Sagan", "Stephen Hawking", "Richard Feynman", "Neil deGrasse Tyson"],
    correctAnswer: 1,
    explanation: "Stephen Hawking made landmark contributions to general relativity and black hole physics despite living with motor neurone disease.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-016",
    question: "Which Indian self-taught mathematical genius contributed deeply to number theory, infinite series, and continued fractions?",
    options: ["Srinivasa Ramanujan", "Aryabhata", "Shakuntala Devi", "P.C. Mahalanobis"],
    correctAnswer: 0,
    explanation: "Srinivasa Ramanujan possessed extraordinary mathematical intuition, collaborating with G.H. Hardy at Cambridge.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-017",
    question: "Who was the German-Jewish girl who documented her life in hiding from the Nazis in Amsterdam in her world-famous diary?",
    options: ["Anne Frank", "Sophie Scholl", "Hannah Arendt", "Rosa Luxemburg"],
    correctAnswer: 0,
    explanation: "Anne Frank's 'The Diary of a Young Girl' is one of the world's most widely read books documenting the Holocaust.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-018",
    question: "Which iconic martial artist and actor popularized martial arts films globally with 'Enter the Dragon'?",
    options: ["Jackie Chan", "Jet Li", "Bruce Lee", "Chuck Norris"],
    correctAnswer: 2,
    explanation: "Bruce Lee founded Jeet Kune Do and revolutionized action cinema with his charisma, philosophy, and martial arts mastery.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-019",
    question: "Who is the legendary Indian industrialist known as the 'Father of Indian Aviation' who launched Tata Airlines?",
    options: ["Jamsetji Tata", "J.R.D. Tata", "Ratan Tata", "G.D. Birla"],
    correctAnswer: 1,
    explanation: "J.R.D. Tata obtained India's first commercial pilot license in 1929 and founded Tata Airlines (later Air India).",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-020",
    question: "Who painted the Sistine Chapel ceiling in the Vatican, including the famous 'Creation of Adam'?",
    options: ["Leonardo da Vinci", "Michelangelo", "Donatello", "Botticelli"],
    correctAnswer: 1,
    explanation: "Michelangelo Buonarroti spent four grueling years painting the monumental frescoes on the ceiling of the Sistine Chapel.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-021",
    question: "Which Pakistani activist for female education was awarded the Nobel Peace Prize in 2014 at the age of 17?",
    options: ["Benazir Bhutto", "Malala Yousafzai", "Asma Jahangir", "Shirin Ebadi"],
    correctAnswer: 1,
    explanation: "Malala Yousafzai survived a Taliban assassination attempt and became the youngest Nobel Prize laureate in history.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-022",
    question: "Who was the visionary founder of the multinational tech giant Amazon.com in 1994?",
    options: ["Elon Musk", "Jeff Bezos", "Satya Nadella", "Tim Cook"],
    correctAnswer: 1,
    explanation: "Jeff Bezos founded Amazon as an online bookstore in his garage, transforming it into the world's largest online retailer and cloud provider.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-023",
    question: "Who is the CEO of Tesla and SpaceX who also purchased social media platform Twitter (now X)?",
    options: ["Sundar Pichai", "Elon Musk", "Peter Thiel", "Jack Dorsey"],
    correctAnswer: 1,
    explanation: "Elon Musk heads SpaceX, Tesla, Neuralink, and X Corp.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-024",
    question: "Which Indian music maestro won two Academy Awards (Oscars) for the musical score of 'Slumdog Millionaire' in 2009?",
    options: ["A.R. Rahman", "Ilaiyaraaja", "R.D. Burman", "Zakir Hussain"],
    correctAnswer: 0,
    explanation: "A.R. Rahman, known as the 'Mozart of Madras', won Oscars for Best Original Score and Best Original Song ('Jai Ho').",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-025",
    question: "Who was the renowned Indian sitar virtuoso who composed ragas, performed at Woodstock, and taught George Harrison of The Beatles?",
    options: ["Pandit Ravi Shankar", "Ustad Bismillah Khan", "Pandit Shivkumar Sharma", "Hariprasad Chaurasia"],
    correctAnswer: 0,
    explanation: "Pandit Ravi Shankar was India's most celebrated classical music ambassador to the Western world.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-026",
    question: "Which American animator, film producer, and entrepreneur created Mickey Mouse and built Disneyland?",
    options: ["Walt Disney", "Stan Lee", "Chuck Jones", "Jim Henson"],
    correctAnswer: 0,
    explanation: "Walt Disney created Mickey Mouse in 1928, produced 'Snow White and the Seven Dwarfs', and founded the Disney entertainment empire.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-027",
    question: "Who was the author of the 'Harry Potter' fantasy novel series?",
    options: ["J.R.R. Tolkien", "J.K. Rowling", "C.S. Lewis", "George R.R. Martin"],
    correctAnswer: 1,
    explanation: "J.K. Rowling wrote the 7-book Harry Potter saga, which sold over 500 million copies worldwide.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-028",
    question: "Who authored 'The Hobbit' and the epic high-fantasy trilogy 'The Lord of the Rings'?",
    options: ["J.K. Rowling", "J.R.R. Tolkien", "Terry Pratchett", "Arthur Conan Doyle"],
    correctAnswer: 1,
    explanation: "J.R.R. Tolkien, an Oxford philologist, created the rich mythology and languages of Middle-earth.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-029",
    question: "Which Spanish artist co-founded the Cubist movement and painted the powerful anti-war mural 'Guernica'?",
    options: ["Salvador Dalí", "Pablo Picasso", "Diego Velázquez", "Francisco Goya"],
    correctAnswer: 1,
    explanation: "Pablo Picasso was one of the most prolific and influential artists of the 20th century, pioneering Cubism.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-030",
    question: "Who is known as the 'Human Computer' for her extraordinary ability to perform complex mental arithmetic instantly?",
    options: ["Kalpana Chawla", "Shakuntala Devi", "Janaki Ammal", "Anandi Gopal Joshi"],
    correctAnswer: 1,
    explanation: "Shakuntala Devi demonstrated phenomenal mental calculations worldwide and earned a place in the Guinness Book of Records.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-031",
    question: "Who was the first Indian woman in space, flying aboard Space Shuttle Columbia in 1997?",
    options: ["Sunita Williams", "Kalpana Chawla", "Sirisha Bandla", "Rakesh Sharma"],
    correctAnswer: 1,
    explanation: "Kalpana Chawla, born in Karnal, Haryana, was an aerospace engineer and the first Indian-origin woman to fly in space.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-032",
    question: "Who was the first Indian citizen to travel into outer space in 1984 aboard the Soviet Soyuz T-11?",
    options: ["Kalpana Chawla", "Rakesh Sharma", "Ravish Malhotra", "Vikram Sarabhai"],
    correctAnswer: 1,
    explanation: "Wing Commander Rakesh Sharma spent nearly 8 days aboard Salyut 7, describing India as 'Saare jahan se achha'.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-033",
    question: "Which comic book writer and editor co-created iconic Marvel superheroes like Spider-Man, Iron Man, and the Avengers?",
    options: ["Jack Kirby", "Stan Lee", "Bob Kane", "Steve Ditko"],
    correctAnswer: 1,
    explanation: "Stan Lee was the creative face of Marvel Comics, co-creating beloved characters with artists Jack Kirby and Steve Ditko.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-034",
    question: "Who was the deaf German composer who created timeless masterpieces like Symphony No. 5 and Symphony No. 9 ('Ode to Joy')?",
    options: ["Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Johann Sebastian Bach", "Franz Schubert"],
    correctAnswer: 1,
    explanation: "Beethoven composed some of his most monumental works after losing his hearing almost completely.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-035",
    question: "Which Austrian musical prodigy began composing at age five and wrote over 600 works before his untimely death at 35?",
    options: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johannes Brahms", "Joseph Haydn"],
    correctAnswer: 1,
    explanation: "Mozart was a peerless musical genius of the Classical era, composing operas, symphonies, and concertos.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-036",
    question: "Who was the famous silent movie comedian and filmmaker known for his character 'The Tramp' with a bowler hat and cane?",
    options: ["Buster Keaton", "Charlie Chaplin", "Harold Lloyd", "Groucho Marx"],
    correctAnswer: 1,
    explanation: "Charlie Chaplin is widely regarded as one of the most important figures in the history of cinema.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-037",
    question: "Which Indian author wrote the classic novel 'The God of Small Things', winning the Booker Prize in 1997?",
    options: ["Salman Rushdie", "Arundhati Roy", "Jhumpa Lahiri", "Kiran Desai"],
    correctAnswer: 1,
    explanation: "Arundhati Roy won international acclaim and the 1997 Booker Prize for her debut novel set in Kerala.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-038",
    question: "Who is the legendary cricket commentator and master batsman known as the 'Little Master' who scored 100 international centuries?",
    options: ["Sunil Gavaskar", "Sachin Tendulkar", "Brian Lara", "Ricky Ponting"],
    correctAnswer: 1,
    explanation: "Sachin Tendulkar is celebrated as the God of Cricket and was awarded India's highest civilian award, the Bharat Ratna.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-039",
    question: "Who is the co-founder of Facebook (now Meta) who launched the social networking platform from his Harvard dorm room in 2004?",
    options: ["Eduardo Saverin", "Mark Zuckerberg", "Dustin Moskovitz", "Sheryl Sandberg"],
    correctAnswer: 1,
    explanation: "Mark Zuckerberg created Facebook in February 2004, leading it to become the world's most ubiquitous social media network.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-040",
    question: "Which Indian business tycoon founded Reliance Industries in 1958, transforming it into India's largest private enterprise?",
    options: ["Mukesh Ambani", "Dhirubhai Ambani", "Anil Ambani", "Ratan Tata"],
    correctAnswer: 1,
    explanation: "Dhirubhai Ambani built the vast Reliance petrochemicals and industrial empire from modest beginnings.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-041",
    question: "Who was the charismatic boxer known as 'The Greatest' who float like a butterfly and sting like a bee?",
    options: ["Mike Tyson", "Muhammad Ali", "Joe Frazier", "George Foreman"],
    correctAnswer: 1,
    explanation: "Muhammad Ali (born Cassius Clay) was a three-time world heavyweight champion and global civil rights figure.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-042",
    question: "Which French military heroine led the French army to momentous victories during the Hundred Years' War before being burned at the stake at age 19?",
    options: ["Marie Antoinette", "Joan of Arc", "Madame Roland", "Charlotte Corday"],
    correctAnswer: 1,
    explanation: "Joan of Arc, the 'Maid of Orléans', is a national heroine and patron saint of France.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-043",
    question: "Who is the current CEO of Alphabet and Google, born and raised in Tamil Nadu, India?",
    options: ["Satya Nadella", "Sundar Pichai", "Arvind Krishna", "Shantanu Narayen"],
    correctAnswer: 1,
    explanation: "Sundar Pichai earned his engineering degree from IIT Kharagpur and became Google CEO in 2015 and Alphabet CEO in 2019.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-044",
    question: "Who is the current CEO of Microsoft Corporation who led its transformation toward cloud computing and AI?",
    options: ["Sundar Pichai", "Satya Nadella", "Steve Ballmer", "Arvind Krishna"],
    correctAnswer: 1,
    explanation: "Satya Nadella took over as CEO of Microsoft in 2014, steering unprecedented growth in Azure cloud and enterprise services.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-045",
    question: "Which Indian tabla virtuoso collaborated with international musicians and performed at the White House?",
    options: ["Ustad Alla Rakha", "Ustad Zakir Hussain", "Pandit Anindo Chatterjee", "Talvin Singh"],
    correctAnswer: 1,
    explanation: "Ustad Zakir Hussain is globally acclaimed as a maestro of the tabla and a recipient of the Padma Vibhushan.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-046",
    question: "Who was the creator of the iconic fictional British detective Sherlock Holmes?",
    options: ["Agatha Christie", "Sir Arthur Conan Doyle", "Edgar Allan Poe", "Ian Fleming"],
    correctAnswer: 1,
    explanation: "Sir Arthur Conan Doyle wrote four novels and 56 short stories featuring the Baker Street consulting detective.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-047",
    question: "Which English author is celebrated as the 'Queen of Crime' for detective novels featuring Hercule Poirot and Miss Marple?",
    options: ["Dorothy L. Sayers", "Agatha Christie", "Ruth Rendell", "P.D. James"],
    correctAnswer: 1,
    explanation: "Agatha Christie is the best-selling fiction writer of all time according to Guinness World Records, selling over 2 billion books.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-048",
    question: "Who was the beloved wildlife presenter and naturalist known for broadcasting BBC nature series like 'Planet Earth' and 'Blue Planet'?",
    options: ["Steve Irwin", "Sir David Attenborough", "Jane Goodall", "Jacques Cousteau"],
    correctAnswer: 1,
    explanation: "Sir David Attenborough has been educating the world about Earth's biodiversity and conservation for over six decades.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-049",
    question: "Who was the primatologist famous for her 60-year ground-breaking study of wild chimpanzees in Gombe Stream National Park, Tanzania?",
    options: ["Dian Fossey", "Jane Goodall", "Birute Galdikas", "Mary Leakey"],
    correctAnswer: 1,
    explanation: "Dame Jane Goodall discovered that chimpanzees make and use tools, altering human understanding of primates.",
    difficulty: "easy",
    topic: "Famous Personalities"
  },
  {
    questionId: "pers-050",
    question: "Which American film director directed legendary blockbusters like 'Jaws', 'E.T.', 'Jurassic Park', and 'Schindler's List'?",
    options: ["George Lucas", "Steven Spielberg", "James Cameron", "Martin Scorsese"],
    correctAnswer: 1,
    explanation: "Steven Spielberg is the most commercially successful director in cinematic history, winning multiple Academy Awards.",
    difficulty: "easy",
    topic: "Famous Personalities"
  }
];

// 6. Inventions & Discoveries (50 Questions)
const INVENTIONS_DISCOVERIES_QUESTIONS = [
  {
    questionId: "inv-001",
    question: "Who is widely credited with inventing the first practical telephone in 1876?",
    options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
    correctAnswer: 1,
    explanation: "Alexander Graham Bell received the first US patent for the telephone in March 1876.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-002",
    question: "Who invented the first practical long-lasting incandescent light bulb?",
    options: ["Nikola Tesla", "Thomas Edison", "Benjamin Franklin", "Michael Faraday"],
    correctAnswer: 1,
    explanation: "Thomas Edison and his team developed a carbon filament incandescent bulb that burned for over 1,200 hours in 1879.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-003",
    question: "Who formulated the universal law of gravitation after observing a falling apple?",
    options: ["Galileo Galilei", "Sir Isaac Newton", "Albert Einstein", "Johannes Kepler"],
    correctAnswer: 1,
    explanation: "Sir Isaac Newton published his universal law of gravitation and three laws of motion in the 'Principia Mathematica' in 1687.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-004",
    question: "Who discovered the first antibiotic, Penicillin, in 1928?",
    options: ["Louis Pasteur", "Alexander Fleming", "Edward Jenner", "Robert Koch"],
    correctAnswer: 1,
    explanation: "Sir Alexander Fleming noticed that Penicillium notatum mold contaminated a Petri dish and killed Staphylococcus bacteria.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-005",
    question: "Who invented the World Wide Web (WWW) while working at CERN in 1989?",
    options: ["Bill Gates", "Tim Berners-Lee", "Vint Cerf", "Steve Jobs"],
    correctAnswer: 1,
    explanation: "Sir Tim Berners-Lee invented the World Wide Web, including HTML, HTTP, and URLs, to help scientists share information.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-006",
    question: "Which brothers are celebrated for inventing and flying the world's first successful motor-operated airplane in 1903?",
    options: ["Montgolfier Brothers", "Wright Brothers (Orville and Wilbur)", "Lumière Brothers", "Warner Brothers"],
    correctAnswer: 1,
    explanation: "Orville and Wilbur Wright achieved the first controlled, powered, sustained airplane flight at Kitty Hawk, North Carolina.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-007",
    question: "Who developed the smallpox vaccine in 1796, creating the world's very first vaccine?",
    options: ["Louis Pasteur", "Edward Jenner", "Jonas Salk", "Alexander Fleming"],
    correctAnswer: 1,
    explanation: "Edward Jenner used cowpox material to inoculate patients against smallpox, founding the science of immunology.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-008",
    question: "Who is known as the 'Father of Computers' for designing the Analytical Engine?",
    options: ["Alan Turing", "Charles Babbage", "John von Neumann", "Ada Lovelace"],
    correctAnswer: 1,
    explanation: "Charles Babbage originated the concept of a programmable digital computer in the 19th century.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-009",
    question: "Who is celebrated as the world's first computer programmer for writing an algorithm for Babbage's Analytical Engine?",
    options: ["Grace Hopper", "Ada Lovelace", "Katherine Johnson", "Margaret Hamilton"],
    correctAnswer: 1,
    explanation: "Ada Lovelace recognized that the computer could manipulate symbols beyond numbers, writing the first published algorithm.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-010",
    question: "Who developed the polio vaccine that saved millions of children worldwide from paralysis?",
    options: ["Jonas Salk", "Albert Sabin", "Edward Jenner", "Louis Pasteur"],
    correctAnswer: 0,
    explanation: "Dr. Jonas Salk developed the first safe and effective inactivated polio vaccine in 1953, choosing not to patent it.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-011",
    question: "Who developed the rabies vaccine and the process of pasteurization to kill pathogens in liquids?",
    options: ["Robert Koch", "Louis Pasteur", "Alexander Fleming", "Joseph Lister"],
    correctAnswer: 1,
    explanation: "French chemist and microbiologist Louis Pasteur developed pasteurization and vaccines for rabies and anthrax.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-012",
    question: "Who discovered X-rays in 1895 and won the inaugural Nobel Prize in Physics in 1901?",
    options: ["Henri Becquerel", "Wilhelm Conrad Röntgen", "Marie Curie", "Ernest Rutherford"],
    correctAnswer: 1,
    explanation: "Wilhelm Röntgen discovered electromagnetic rays capable of penetrating opaque objects and producing photographic shadows of bones.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-013",
    question: "Who invented dynamite and used his vast fortune to institute the Nobel Prizes?",
    options: ["Alfred Nobel", "Robert Nobel", "Fritz Haber", "Svante Arrhenius"],
    correctAnswer: 0,
    explanation: "Swedish chemist Alfred Nobel invented dynamite in 1867 and bequeathed his wealth to establish the Nobel Prizes.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-014",
    question: "Who invented the movable-type mechanical printing press in Europe around 1440?",
    options: ["William Caxton", "Johannes Gutenberg", "Aldus Manutius", "Martin Luther"],
    correctAnswer: 1,
    explanation: "Johannes Gutenberg's printing press in Mainz, Germany transformed the spread of knowledge across the Western world.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-015",
    question: "Who developed the theory of Special Relativity ($E = mc^2$) and General Relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Max Planck"],
    correctAnswer: 1,
    explanation: "Albert Einstein published Special Relativity in 1905 and General Relativity in 1915, revolutionizing modern physics.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-016",
    question: "Who was awarded Nobel Prizes in two different scientific fields (Physics and Chemistry) for pioneering work on radioactivity?",
    options: ["Pierre Curie", "Marie Curie", "Irène Joliot-Curie", "Lise Meitner"],
    correctAnswer: 1,
    explanation: "Marie Curie discovered polonium and radium, winning the 1903 Nobel in Physics and the 1911 Nobel in Chemistry.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-017",
    question: "Who developed the alternating current (AC) electrical system and the induction motor?",
    options: ["Thomas Edison", "Nikola Tesla", "George Westinghouse", "James Watt"],
    correctAnswer: 1,
    explanation: "Nikola Tesla patented AC electrical motors and power transmission, creating the foundation for modern power grids.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-018",
    question: "Who was the Italian inventor who sent the first transatlantic radio signal and developed commercial wireless telegraphy?",
    options: ["Alessandro Volta", "Guglielmo Marconi", "Heinrich Hertz", "Enrico Fermi"],
    correctAnswer: 1,
    explanation: "Guglielmo Marconi shared the 1909 Nobel Prize in Physics for developing long-distance radio communication.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-019",
    question: "Who invented the electric battery (voltaic pile), providing the first continuous source of electrical current?",
    options: ["Luigi Galvani", "Alessandro Volta", "Andre-Marie Ampere", "Michael Faraday"],
    correctAnswer: 1,
    explanation: "Count Alessandro Volta invented the electrochemical battery in 1800, and the electrical unit 'Volt' is named after him.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-020",
    question: "Who discovered the double-helix structure of DNA in 1953 along with Rosalind Franklin and Maurice Wilkins?",
    options: ["Charles Darwin & Gregor Mendel", "James Watson & Francis Crick", "Louis Pasteur & Robert Koch", "Linus Pauling & Erwin Chargaff"],
    correctAnswer: 1,
    explanation: "James Watson and Francis Crick correctly deduced the double helix structure of DNA, sharing the 1962 Nobel Prize.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-021",
    question: "Which Scottish engineer substantially improved the steam engine with a separate condenser, powering the Industrial Revolution?",
    options: ["George Stephenson", "James Watt", "Thomas Newcomen", "Robert Fulton"],
    correctAnswer: 1,
    explanation: "James Watt patented the separate condenser in 1769, dramatically improving the thermal efficiency of steam engines.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-022",
    question: "Who invented the mercury-in-glass thermometer and established the temperature scale bearing his name?",
    options: ["Anders Celsius", "Daniel Gabriel Fahrenheit", "Lord Kelvin", "René Antoine Réaumur"],
    correctAnswer: 1,
    explanation: "Daniel Gabriel Fahrenheit invented the precision mercury thermometer in 1714 and developed the Fahrenheit scale.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-023",
    question: "Who designed the Celsius temperature scale, originally setting 0 as boiling and 100 as freezing (inverted later)?",
    options: ["Daniel Fahrenheit", "Anders Celsius", "William Thomson (Lord Kelvin)", "Robert Boyle"],
    correctAnswer: 1,
    explanation: "Swedish astronomer Anders Celsius proposed the centigrade temperature scale in 1742.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-024",
    question: "Who invented the mechanical television system, transmitting the first recognizable moving human face on a screen in 1925?",
    options: ["Philo Farnsworth", "John Logie Baird", "Vladimir Zworykin", "Thomas Edison"],
    correctAnswer: 1,
    explanation: "Scottish inventor John Logie Baird demonstrated the first working television system in London in 1925.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-025",
    question: "Who invented the phonograph (gramophone) to record and reproduce sound in 1877?",
    options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Emile Berliner"],
    correctAnswer: 1,
    explanation: "Thomas Edison invented the tinfoil phonograph in 1877, speaking the nursery rhyme 'Mary Had a Little Lamb'.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-026",
    question: "Who is known as the 'Father of Genetics' for his experiments on pea plants?",
    options: ["Charles Darwin", "Gregor Mendel", "Thomas Hunt Morgan", "Hugo de Vries"],
    correctAnswer: 1,
    explanation: "Augustinian friar Gregor Mendel discovered the fundamental laws of genetic inheritance through pea plant breeding.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-027",
    question: "Who invented the computer mouse in 1964, made out of a wooden shell with two metal wheels?",
    options: ["Douglas Engelbart", "Alan Kay", "Steve Jobs", "Bill English"],
    correctAnswer: 0,
    explanation: "Douglas Engelbart at the Stanford Research Institute invented the computer mouse and demonstrated it in 1968.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-028",
    question: "Who developed the first commercially successful gasoline-powered automobile in 1886?",
    options: ["Henry Ford", "Karl Benz", "Gottlieb Daimler", "Rudolf Diesel"],
    correctAnswer: 1,
    explanation: "German engineer Karl Benz patented the Benz Patent-Motorwagen in 1886, regarded as the first modern automobile.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-029",
    question: "Who revolutionized automotive manufacturing by introducing the moving assembly line for the Model T in 1913?",
    options: ["Karl Benz", "Henry Ford", "Walter Chrysler", "Louis Chevrolet"],
    correctAnswer: 1,
    explanation: "Henry Ford's moving assembly line drastically reduced production time and made cars affordable for ordinary people.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-030",
    question: "Who invented the diesel internal combustion engine in the 1890s?",
    options: ["Karl Benz", "Rudolf Diesel", "Nikolaus Otto", "Felix Wankel"],
    correctAnswer: 1,
    explanation: "German mechanical engineer Rudolf Diesel invented the high-efficiency compression-ignition engine that bears his name.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-031",
    question: "Who developed the tactile reading and writing system for blind people using raised dots in 1824?",
    options: ["Valentin Haüy", "Louis Braille", "Helen Keller", "Charles Barbier"],
    correctAnswer: 1,
    explanation: "Louis Braille, blinded in childhood, designed the 6-dot cell system at the age of 15.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-032",
    question: "Who discovered the Raman Effect in 1928, explaining the inelastic scattering of light?",
    options: ["Homi Bhabha", "Sir C.V. Raman", "Jagadish Chandra Bose", "S. Chandrasekhar"],
    correctAnswer: 1,
    explanation: "Sir C.V. Raman discovered that scattered light changes wavelength, winning the 1930 Nobel Prize in Physics.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-033",
    question: "Which Indian polymath pioneered wireless millimeter waves and proved that plants feel sensations using the crescograph?",
    options: ["C.V. Raman", "Sir Jagadish Chandra Bose", "Satyendra Nath Bose", "Prafulla Chandra Ray"],
    correctAnswer: 1,
    explanation: "Sir J.C. Bose made pioneering breakthroughs in microwave optics and plant physiology.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-034",
    question: "Who discovered oxygen gas independently in 1774 by heating mercuric oxide?",
    options: ["Antoine Lavoisier", "Joseph Priestley", "Henry Cavendish", "John Dalton"],
    correctAnswer: 1,
    explanation: "English chemist Joseph Priestley isolated pure oxygen (which he called 'dephlogisticated air') in 1774.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-035",
    question: "Who is known as the 'Father of Modern Chemistry' for establishing the law of conservation of mass and naming oxygen?",
    options: ["Robert Boyle", "Antoine Lavoisier", "John Dalton", "Dmitri Mendeleev"],
    correctAnswer: 1,
    explanation: "Antoine Lavoisier revolutionized chemistry by proving that matter changes form but is neither created nor destroyed.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-036",
    question: "Who discovered hydrogen gas in 1766, which he referred to as 'inflammable air'?",
    options: ["Joseph Priestley", "Henry Cavendish", "Robert Boyle", "Humphry Davy"],
    correctAnswer: 1,
    explanation: "Henry Cavendish was the first to recognize hydrogen as a distinct element and discovered it produces water when burned.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-037",
    question: "Who discovered electromagnetic induction in 1831, enabling electric generators and transformers?",
    options: ["James Clerk Maxwell", "Michael Faraday", "Andre-Marie Ampere", "Heinrich Hertz"],
    correctAnswer: 1,
    explanation: "Michael Faraday discovered that a changing magnetic field induces an electromotive force (EMF) in a wire.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-038",
    question: "Who formulated the classical theory of electromagnetic radiation, unifying electricity, magnetism, and light?",
    options: ["Michael Faraday", "James Clerk Maxwell", "Isaac Newton", "Albert Einstein"],
    correctAnswer: 1,
    explanation: "James Clerk Maxwell published his four famous equations demonstrating that light is an electromagnetic wave.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-039",
    question: "Who discovered blood circulation and proved the heart pumps blood continuously throughout the body?",
    options: ["Claudius Galen", "William Harvey", "Andreas Vesalius", "Hippocrates"],
    correctAnswer: 1,
    explanation: "English physician William Harvey published his landmark discovery of systemic blood circulation in 1628.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-040",
    question: "Who discovered the ABO blood group system in 1900, enabling safe blood transfusions?",
    options: ["Alexander Fleming", "Karl Landsteiner", "Robert Koch", "Paul Ehrlich"],
    correctAnswer: 1,
    explanation: "Austrian biologist Karl Landsteiner identified human blood groups A, B, and O, winning the 1930 Nobel Prize in Medicine.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-041",
    question: "Who first observed living single-celled microorganisms (bacteria and protozoa) using homemade microscopes?",
    options: ["Robert Hooke", "Antonie van Leeuwenhoek", "Louis Pasteur", "Robert Brown"],
    correctAnswer: 1,
    explanation: "Antonie van Leeuwenhoek, the 'Father of Microbiology', discovered microscopic life which he termed 'animalcules'.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-042",
    question: "Who coined the biological term 'cell' in 1665 after observing cork tissue under a compound microscope?",
    options: ["Antonie van Leeuwenhoek", "Robert Hooke", "Theodor Schwann", "Matthias Schleiden"],
    correctAnswer: 1,
    explanation: "Robert Hooke noted the microscopic pores in cork resembled monks' dormitory rooms ('cellulae') in his book Micrographia.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-043",
    question: "Who invented the modern seismograph in 1880 to detect and record earthquakes?",
    options: ["Charles Richter", "John Milne", "Giuseppe Mercalli", "Beno Gutenberg"],
    correctAnswer: 1,
    explanation: "British geologist John Milne invented the horizontal pendulum seismograph while working in Japan.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-044",
    question: "Who developed the logarithmic magnitude scale used to measure the energy released by earthquakes in 1935?",
    options: ["John Milne", "Charles F. Richter", "Giuseppe Mercalli", "Alfred Wegener"],
    correctAnswer: 1,
    explanation: "American seismologist Charles Richter developed the Richter magnitude scale at Caltech in 1935.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-045",
    question: "Who proposed the groundbreaking theory of Continental Drift in 1912, suggesting all continents were once a single supercontinent (Pangaea)?",
    options: ["James Hutton", "Alfred Wegener", "Charles Lyell", "Harry Hess"],
    correctAnswer: 1,
    explanation: "German meteorologist Alfred Wegener proposed that continents slowly drift across the ocean floor, founding plate tectonics.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-046",
    question: "Who discovered the planet Uranus in 1781 using a telescope he built himself?",
    options: ["Galileo Galilei", "William Herschel", "Johannes Kepler", "Edwin Hubble"],
    correctAnswer: 1,
    explanation: "Sir William Herschel discovered Uranus, the first planet discovered since ancient times with a telescope.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-047",
    question: "Who discovered that the universe is expanding and that distant galaxies are moving away from us?",
    options: ["Albert Einstein", "Edwin Hubble", "Carl Sagan", "Stephen Hawking"],
    correctAnswer: 1,
    explanation: "Edwin Hubble discovered the redshift-distance relation (Hubble's Law) in 1929, proving cosmic expansion.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-048",
    question: "Who invented the ballpoint pen (Biro) with a rolling ball mechanism in the 1930s?",
    options: ["Lewis Waterman", "László Bíró", "John Loud", "Parker Brothers"],
    correctAnswer: 1,
    explanation: "Hungarian journalist László Bíró patented the smudge-free ballpoint pen using quick-drying printer ink in 1938.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-049",
    question: "Who invented the first commercial safety elevator brake mechanism in 1852?",
    options: ["Thomas Edison", "Elisha Otis", "Henry Bessemer", "Alexander Miles"],
    correctAnswer: 1,
    explanation: "Elisha Otis invented the safety hoist brake that prevents elevators from crashing if the hoisting rope breaks.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  },
  {
    questionId: "inv-050",
    question: "Who developed the Linux operating system kernel in 1991 as a free, open-source project?",
    options: ["Richard Stallman", "Linus Torvalds", "Ken Thompson", "Dennis Ritchie"],
    correctAnswer: 1,
    explanation: "Finnish software engineer Linus Torvalds announced and released the Linux kernel while a student at the University of Helsinki.",
    difficulty: "easy",
    topic: "Inventions & Discoveries"
  }
];

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena');
  console.log('✅ Connected to MongoDB.');

  const catSlug = 'general-knowledge-india';
  const catName = 'General Knowledge & India';

  await seedSubjectQuestions(
    catSlug,
    catName,
    'world-flags-challenge',
    'World Flags Challenge',
    'world-flags.json',
    WORLD_FLAGS_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'world-geography',
    'World Geography',
    'world-geography.json',
    WORLD_GEOGRAPHY_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'indian-history',
    'Indian History',
    'indian-history.json',
    INDIAN_HISTORY_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'world-history',
    'World History',
    'world-history.json',
    WORLD_HISTORY_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'famous-personalities',
    'Famous Personalities',
    'famous-personalities.json',
    FAMOUS_PERSONALITIES_QUESTIONS
  );

  await seedSubjectQuestions(
    catSlug,
    catName,
    'inventions-discoveries',
    'Inventions & Discoveries',
    'inventions-discoveries.json',
    INVENTIONS_DISCOVERIES_QUESTIONS
  );

  await mongoose.disconnect();
  console.log('🎉 Category 4 (General Knowledge & India) completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error in Category 4 seeding:', err);
  process.exit(1);
});
