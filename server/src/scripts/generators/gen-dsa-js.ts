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

// 1. Data Structures & Algorithms (50 questions)
const dsaQuestions: Question[] = [
  {
    questionId: "dsa-001",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    explanation: "QuickSort has a worst-case time complexity of O(n²) when the pivot selection repeatedly yields unbalanced partitions.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-002",
    question: "Which data structure operates on a Last In First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "A Stack adds and removes elements from the same end, following the LIFO principle.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-003",
    question: "What is the average time complexity to search for an element in a balanced Binary Search Tree (AVL or Red-Black)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
    explanation: "Because a balanced BST halves the search space at each level, lookup takes O(log n) time.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-004",
    question: "Which sorting algorithm is guaranteed to run in O(n log n) time in all cases (worst, best, and average)?",
    options: ["QuickSort", "Bubble Sort", "Merge Sort", "Insertion Sort"],
    correctAnswer: 2,
    explanation: "Merge Sort consistently divides the array in half and merges them in O(n) time, guaranteeing O(n log n) in all cases.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-005",
    question: "Which graph traversal algorithm uses a Queue as its core auxiliary data structure?",
    options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correctAnswer: 1,
    explanation: "BFS explores neighbor nodes level by level using a FIFO Queue.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-006",
    question: "What is the amortized time complexity of inserting an element into a dynamic array (e.g., std::vector, ArrayList)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Although resizing takes O(n), it occurs infrequently enough that the average/amortized cost per insertion is O(1).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-007",
    question: "In a min-heap with n elements, where is the minimum element always located?",
    options: ["At a leaf node", "At the root (index 0)", "At the last index", "At index n/2"],
    correctAnswer: 1,
    explanation: "By definition, the min-heap property ensures the root node contains the smallest key in the entire heap.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-008",
    question: "Which collision resolution technique in hash tables chains colliding entries in linked lists at each bucket?",
    options: ["Linear Probing", "Quadratic Probing", "Separate Chaining", "Double Hashing"],
    correctAnswer: 2,
    explanation: "Separate Chaining maintains an independent linked list (or tree) at each slot in the hash table array.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-009",
    question: "What is the minimum number of queues required to implement a Stack?",
    options: ["1", "2", "3", "Not possible"],
    correctAnswer: 1,
    explanation: "A stack can be implemented using two standard FIFO queues by shifting elements between them during push or pop.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-010",
    question: "Which algorithm finds the shortest path between a source node and all other nodes in a weighted graph with non-negative edges?",
    options: ["Bellman-Ford", "Dijkstra's Algorithm", "Floyd-Warshall", "Prim's Algorithm"],
    correctAnswer: 1,
    explanation: "Dijkstra's algorithm greedily extracts the minimum distance node to find single-source shortest paths on non-negative weighted graphs.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-011",
    question: "What is the time complexity to find a cycle in a directed graph using Depth-First Search (DFS)?",
    options: ["O(V + E)", "O(V * E)", "O(V²)", "O(E log V)"],
    correctAnswer: 0,
    explanation: "DFS traverses every vertex and edge once with a recursion stack / visited array, completing in O(V + E) time.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-012",
    question: "In Floyd's Cycle-Finding Algorithm (Tortoise and Hare), what are the speeds of the slow and fast pointers?",
    options: ["Slow moves 1 step, Fast moves 2 steps", "Slow moves 1 step, Fast moves 3 steps", "Slow moves 2 steps, Fast moves 3 steps", "Both move 1 step"],
    correctAnswer: 0,
    explanation: "Slow advances by 1 node while Fast advances by 2 nodes; if there is a loop, they will eventually meet within the cycle.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-013",
    question: "What is the height of a balanced binary tree containing n nodes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "A balanced binary tree has height bounded by O(log₂ n).",
    difficulty: "easy"
  },
  {
    questionId: "dsa-014",
    question: "Which algorithmic paradigm does the Merge Sort algorithm use?",
    options: ["Greedy Method", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
    correctAnswer: 2,
    explanation: "Merge sort divides the problem into subproblems, conquers them recursively, and combines their solutions.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-015",
    question: "What is the space complexity of an in-place Heap Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0,
    explanation: "Heap Sort rearranges elements within the original array itself using heapify, requiring O(1) auxiliary space.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-016",
    question: "Which data structure is best suited for evaluating arithmetic expressions written in postfix (Reverse Polish) notation?",
    options: ["Queue", "Stack", "Binary Tree", "Hash Table"],
    correctAnswer: 1,
    explanation: "Operands are pushed onto a Stack, and when an operator is encountered, the top two operands are popped and evaluated.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-017",
    question: "In dynamic programming, what two key properties must a problem exhibit to be solvable with DP?",
    options: [
      "Optimal Substructure and Overlapping Subproblems",
      "Greedy Choice and Memoization",
      "Divide and Conquer and Branching",
      "Polynomial Time and Determinism"
    ],
    correctAnswer: 0,
    explanation: "Dynamic programming applies when optimal solutions to subproblems form optimal global solutions, and subproblems recur repeatedly.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-018",
    question: "What is the maximum number of edges in a simple undirected graph with V vertices?",
    options: ["V * (V - 1)", "V * (V - 1) / 2", "2^V", "V²"],
    correctAnswer: 1,
    explanation: "Each vertex can connect to V-1 other vertices; dividing by 2 removes duplicate undirected pairs: V(V-1)/2.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-019",
    question: "Which of the following problems is known to be NP-Complete?",
    options: ["Single-source shortest path", "Traveling Salesperson Decision Problem", "Minimum Spanning Tree", "Binary Search"],
    correctAnswer: 1,
    explanation: "TSP (decision version) is a classic NP-complete problem; finding the minimum cost tour takes exponential time in the worst case.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-020",
    question: "What is the balance factor of any node in an AVL tree allowed to be?",
    options: ["0, 1, or 2", "-1, 0, or 1", "-2, -1, or 0", "Any positive integer"],
    correctAnswer: 1,
    explanation: "In an AVL tree, the height difference between left and right subtrees must strictly be -1, 0, or 1.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-021",
    question: "What is the time complexity of searching for an element in an unsorted linked list of length n?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 2,
    explanation: "Linked lists lack random index access, so searching requires a linear traversal from head to tail: O(n).",
    difficulty: "easy"
  },
  {
    questionId: "dsa-022",
    question: "Which data structure is typically used to implement a Priority Queue?",
    options: ["Binary Heap", "Circular Queue", "Hash Map", "Doubly Linked List"],
    correctAnswer: 0,
    explanation: "A Binary Heap allows insertion and extraction of the extreme element in O(log n) time.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-023",
    question: "What is the time complexity of the Bellman-Ford algorithm on a graph with V vertices and E edges?",
    options: ["O(V + E)", "O(V * E)", "O(E log V)", "O(V³)"],
    correctAnswer: 1,
    explanation: "Bellman-Ford relaxes all E edges V-1 times, leading to a time complexity of O(V * E).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-024",
    question: "Which tree traversal processes the root node FIRST, followed by left and right subtrees?",
    options: ["In-order", "Pre-order", "Post-order", "Level-order"],
    correctAnswer: 1,
    explanation: "Pre-order traversal visits Node -> Left -> Right.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-025",
    question: "In an in-order traversal of a valid Binary Search Tree, what is the output sequence guaranteed to be?",
    options: ["Sorted in ascending order", "Sorted in descending order", "Random", "Reverse breadth-first"],
    correctAnswer: 0,
    explanation: "Left < Root < Right, meaning in-order traversal (Left, Root, Right) always prints keys in ascending order.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-026",
    question: "Which sorting algorithm operates by counting the occurrences of each distinct value in the input array?",
    options: ["Radix Sort", "Counting Sort", "Bucket Sort", "Quick Sort"],
    correctAnswer: 1,
    explanation: "Counting sort tabulates key frequencies and computes prefix sums in O(n + k) non-comparative time.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-027",
    question: "What is the space complexity of building an Adjacency Matrix for a graph with V vertices?",
    options: ["O(V)", "O(E)", "O(V²)", "O(V + E)"],
    correctAnswer: 2,
    explanation: "An adjacency matrix is a 2D array of size V x V, consuming O(V²) memory regardless of the edge count.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-028",
    question: "Which algorithm finds the Minimum Spanning Tree (MST) of a connected, undirected graph using a Disjoint Set (Union-Find)?",
    options: ["Prim's Algorithm", "Kruskal's Algorithm", "Dijkstra's Algorithm", "Floyd-Warshall"],
    correctAnswer: 1,
    explanation: "Kruskal's algorithm sorts edges by weight and adds non-cycle forming edges using Union-Find.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-029",
    question: "What is the time complexity of finding the prefix match in a Trie containing words of maximum length L?",
    options: ["O(L)", "O(N * L)", "O(log N)", "O(1)"],
    correctAnswer: 0,
    explanation: "Traversing a Trie requires walking node by node for each character in the prefix, taking O(L) time.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-030",
    question: "In a circular queue implemented using an array of size N, what condition indicates the queue is full?",
    options: [
      "(rear + 1) % N == front",
      "rear == front",
      "front == 0 && rear == N",
      "rear - front == N"
    ],
    correctAnswer: 0,
    explanation: "Leaving one empty slot prevents ambiguity with the empty state: (rear + 1) % N == front denotes a full circular queue.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-031",
    question: "What is the recurrence relation for the classic Tower of Hanoi problem?",
    options: ["T(n) = 2T(n-1) + 1", "T(n) = T(n-1) + n", "T(n) = 2T(n/2) + O(1)", "T(n) = T(n-1) + T(n-2)"],
    correctAnswer: 0,
    explanation: "Moving n disks requires moving n-1 disks twice plus 1 move for the largest disk: T(n) = 2T(n-1) + 1 (solves to 2ⁿ - 1).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-032",
    question: "Which string matching algorithm precomputes a prefix function (pi table) to achieve O(N + M) search time?",
    options: ["Rabin-Karp", "Knuth-Morris-Pratt (KMP)", "Boyer-Moore", "Z-Algorithm"],
    correctAnswer: 1,
    explanation: "KMP avoids backtracking by utilizing the longest prefix that is also a suffix.",
    difficulty: "hard"
  },
  {
    questionId: "dsa-033",
    question: "What data structure can be used to efficiently find the running median of a stream of numbers in O(log n) per insertion?",
    options: ["A single BST", "Two Heaps (Max-Heap & Min-Heap)", "A circular buffer", "A segmented stack"],
    correctAnswer: 1,
    explanation: "A max-heap for the smaller half and min-heap for the larger half keeps the median at the top in O(log n) time.",
    difficulty: "hard"
  },
  {
    questionId: "dsa-034",
    question: "What is the lower bound on the time complexity of any comparison-based sorting algorithm in the worst case?",
    options: ["Ω(n)", "Ω(n log n)", "Ω(n²)", "Ω(log n)"],
    correctAnswer: 1,
    explanation: "The decision tree of comparison sort has n! leaves, leading to a minimum depth of log₂(n!) = Ω(n log n).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-035",
    question: "Which of the following is a self-balancing binary search tree where every node is colored red or black?",
    options: ["B-Tree", "Red-Black Tree", "Splay Tree", "Treap"],
    correctAnswer: 1,
    explanation: "Red-Black Trees maintain balance through node color properties, ensuring path lengths differ by at most a factor of 2.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-036",
    question: "What is the primary advantage of a Doubly Linked List over a Singly Linked List?",
    options: [
      "Requires less memory",
      "Allows bidirectional traversal and constant-time deletion given a node pointer",
      "Cache locality is vastly superior",
      "O(1) random index access"
    ],
    correctAnswer: 1,
    explanation: "With access to a node, a doubly linked list can update prev and next pointers in O(1) without walking from head.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-037",
    question: "Which dynamic programming technique uses a recursive top-down approach with cached answers?",
    options: ["Tabulation", "Memoization", "Greedy method", "Iterative DP"],
    correctAnswer: 1,
    explanation: "Memoization caches results of recursive calls in a table or hash map to prevent redundant computations.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-038",
    question: "What is the worst-case time complexity of inserting a key into an un-rehashed Hash Table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "If all n elements collide into the exact same bucket (e.g., in separate chaining), insertion requires walking the list: O(n).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-039",
    question: "What is the time complexity of finding the diameter of a binary tree in optimal O(n) time?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(h²)"],
    correctAnswer: 0,
    explanation: "By computing height and diameter in a single bottom-up post-order pass, the entire tree is traversed in O(n) time.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-040",
    question: "In a B-Tree of order m, what is the maximum number of children any internal node can have?",
    options: ["m - 1", "m", "2m", "m / 2"],
    correctAnswer: 1,
    explanation: "A B-tree of order m can have at most m children and m - 1 keys per node.",
    difficulty: "hard"
  },
  {
    questionId: "dsa-041",
    question: "Which algorithm finds all pairs shortest paths in a weighted directed graph in O(V³) time?",
    options: ["Floyd-Warshall Algorithm", "Dijkstra's Algorithm", "Bellman-Ford Algorithm", "A* Algorithm"],
    correctAnswer: 0,
    explanation: "Floyd-Warshall uses a triple-nested loop dynamic programming formulation to compute all-pairs distances in O(V³).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-042",
    question: "What is the time complexity of checking if a graph is bipartite using BFS or DFS?",
    options: ["O(V + E)", "O(V²)", "O(E²)", "O(V log V)"],
    correctAnswer: 0,
    explanation: "Bipartite checking is done by 2-coloring vertices during standard graph traversal in O(V + E) time.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-043",
    question: "Which sorting algorithm is commonly used as the internal routine in Radix Sort to sort digit by digit stably?",
    options: ["Quick Sort", "Counting Sort", "Heap Sort", "Selection Sort"],
    correctAnswer: 1,
    explanation: "Counting Sort is stable and runs in O(n + b) time, making it the standard subroutine for Radix Sort.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-044",
    question: "What is the space complexity of an iterative Breadth-First Search on a tree with maximum width W?",
    options: ["O(1)", "O(W)", "O(depth)", "O(log W)"],
    correctAnswer: 1,
    explanation: "At the widest level, the BFS queue must hold all W nodes of that level simultaneously: O(W).",
    difficulty: "medium"
  },
  {
    questionId: "dsa-045",
    question: "What is the maximum number of nodes in a binary tree of depth/height k (where root is at depth 0)?",
    options: ["2^k", "2^(k+1) - 1", "2^k - 1", "k²"],
    correctAnswer: 1,
    explanation: "Sum of geometric series: 2⁰ + 2¹ + ... + 2ᵏ = 2^(k+1) - 1 nodes.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-046",
    question: "Which data structure is best for implementing an LRU (Least Recently Used) Cache with O(1) get and put?",
    options: ["Hash Map + Doubly Linked List", "Binary Search Tree + Stack", "Array + Queue", "Heap + Hash Set"],
    correctAnswer: 0,
    explanation: "A Hash Map provides O(1) node lookup, while a Doubly Linked List enables O(1) removal and re-insertion to the head.",
    difficulty: "medium"
  },
  {
    questionId: "dsa-047",
    question: "What does the master theorem state for T(n) = 2T(n/2) + O(n)?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
    explanation: "Here a = 2, b = 2, log_b(a) = 1. Since f(n) = Θ(n¹), this is Case 2: T(n) = Θ(n log n).",
    difficulty: "hard"
  },
  {
    questionId: "dsa-048",
    question: "What is the best-case time complexity of Insertion Sort when the input is already sorted?",
    options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
    correctAnswer: 1,
    explanation: "Each element only makes one comparison with its predecessor before stopping: total O(n) comparisons.",
    difficulty: "easy"
  },
  {
    questionId: "dsa-049",
    question: "Which probabilistic data structure tests whether an element is a member of a set with possible false positives but never false negatives?",
    options: ["Bloom Filter", "Skip List", "HyperLogLog", "Count-Min Sketch"],
    correctAnswer: 0,
    explanation: "Bloom filters use bit arrays and multiple hash functions; false positives can happen, but if a bit is 0, it's definitely absent.",
    difficulty: "hard"
  },
  {
    questionId: "dsa-050",
    question: "What is the time complexity to invert/mirror a binary tree with N nodes?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
    correctAnswer: 2,
    explanation: "Every node in the tree must be visited once to swap its left and right pointers: O(N) operations.",
    difficulty: "easy"
  }
];

// 2. JavaScript Quiz (50 questions)
const jsQuestions: Question[] = [
  {
    questionId: "js-001",
    question: "What is the output of `typeof NaN` in JavaScript?",
    options: ["'nan'", "'undefined'", "'number'", "'object'"],
    correctAnswer: 2,
    explanation: "In IEEE 754 and JavaScript specifications, NaN represents a numeric value signifying 'Not-a-Number', so `typeof NaN === 'number'`.",
    difficulty: "easy"
  },
  {
    questionId: "js-002",
    question: "Which of the following creates a block-scoped variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    correctAnswer: 2,
    explanation: "`const` declares a block-scoped variable whose binding is immutable (cannot be reassigned).",
    difficulty: "easy"
  },
  {
    questionId: "js-003",
    question: "What does `[] == ![]` evaluate to in JavaScript?",
    options: ["true", "false", "undefined", "TypeError"],
    correctAnswer: 0,
    explanation: "`![]` evaluates to false. Then `[] == false` triggers type coercion: `[]` becomes `\"\"` and `false` becomes 0, then `\"\"` becomes 0, yielding `0 == 0`, which is true.",
    difficulty: "medium"
  },
  {
    questionId: "js-004",
    question: "Which JavaScript engine powers Google Chrome and Node.js?",
    options: ["SpiderMonkey", "V8", "JavaScriptCore", "Chakra"],
    correctAnswer: 1,
    explanation: "V8 is Google's open-source high-performance WebAssembly and JavaScript engine written in C++.",
    difficulty: "easy"
  },
  {
    questionId: "js-005",
    question: "What is the output of `console.log(1 + '2' + 3)`?",
    options: ["6", "'123'", "'15'", "NaN"],
    correctAnswer: 1,
    explanation: "Addition evaluates left to right: `1 + '2'` coerces 1 to string yielding `'12'`, then `'12' + 3` coerces 3 yielding `'123'`.",
    difficulty: "easy"
  },
  {
    questionId: "js-006",
    question: "What is a closure in JavaScript?",
    options: [
      "A function bundled with references to its surrounding lexical environment",
      "A method to close browser tabs programmatically",
      "A syntax error in curly braces",
      "An asynchronous event listener callback"
    ],
    correctAnswer: 0,
    explanation: "A closure gives an inner function access to an outer function's scope even after the outer function has returned.",
    difficulty: "easy"
  },
  {
    questionId: "js-007",
    question: "What will `console.log(typeof null)` output?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctAnswer: 2,
    explanation: "`typeof null === 'object'` is a historic quirk from the first implementation of JavaScript where object type tags were 0.",
    difficulty: "easy"
  },
  {
    questionId: "js-008",
    question: "Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.decode()"],
    correctAnswer: 1,
    explanation: "`JSON.parse()` deserializes a JSON string into a native JavaScript object or primitive.",
    difficulty: "easy"
  },
  {
    questionId: "js-009",
    question: "What is the difference between `==` and `===`?",
    options: [
      "`==` checks equality with type coercion, whereas `===` checks strict equality without coercion",
      "`===` is only for strings, while `==` is for numbers",
      "`==` checks memory addresses, while `===` checks values",
      "There is no difference in ES6"
    ],
    correctAnswer: 0,
    explanation: "`==` performs abstract type conversion before comparing values, while `===` requires both value and type to match.",
    difficulty: "easy"
  },
  {
    questionId: "js-010",
    question: "In the JavaScript Event Loop, which queue has higher priority: the Microtask Queue or the Macrotask (Callback) Queue?",
    options: ["Macrotask Queue", "Microtask Queue", "Both have identical priority", "Animation frame queue always preempts both"],
    correctAnswer: 1,
    explanation: "The microtask queue (Promise callbacks, queueMicrotask, MutationObserver) is completely drained after each macrotask before the next macrotask runs.",
    difficulty: "medium"
  },
  {
    questionId: "js-011",
    question: "What will `console.log(0.1 + 0.2 === 0.3)` return?",
    options: ["true", "false", "undefined", "NaN"],
    correctAnswer: 1,
    explanation: "Due to binary IEEE 754 floating-point representation, `0.1 + 0.2` equals `0.30000000000000004`, which is not strictly equal to 0.3.",
    difficulty: "easy"
  },
  {
    questionId: "js-012",
    question: "How does the `this` keyword behave inside an ES6 arrow function?",
    options: [
      "It binds dynamically to the caller object",
      "It retains the `this` value of the enclosing lexical context",
      "It is always undefined",
      "It refers to the global `window` object always"
    ],
    correctAnswer: 1,
    explanation: "Arrow functions do not have their own `this` binding; they capture `this` lexically from their enclosing scope.",
    difficulty: "medium"
  },
  {
    questionId: "js-013",
    question: "What is the purpose of the `Promise.allSettled()` method?",
    options: [
      "Rejects immediately upon the first rejected promise",
      "Resolves when all promises settle (either fulfilled or rejected) with an array of result objects",
      "Returns only the promises that resolved successfully",
      "Cancels remaining promises when one finishes"
    ],
    correctAnswer: 1,
    explanation: "`Promise.allSettled()` waits for all input promises to either resolve or reject, returning `{ status, value/reason }` for each.",
    difficulty: "medium"
  },
  {
    questionId: "js-014",
    question: "What is the Temporal Dead Zone (TDZ) in JavaScript?",
    options: [
      "The duration before the garbage collector frees memory",
      "The period between entering scope and variable declaration with `let` or `const` where access throws a ReferenceError",
      "The delay in `setTimeout(fn, 0)` execution",
      "The lifetime of an async worker thread"
    ],
    correctAnswer: 1,
    explanation: "Variables declared with `let` and `const` exist in the TDZ from the start of their enclosing block until the declaration is evaluated.",
    difficulty: "medium"
  },
  {
    questionId: "js-015",
    question: "Which built-in method creates a deep copy of serializable JavaScript data in modern browsers?",
    options: ["Object.assign()", "structuredClone()", "Array.prototype.slice()", "Object.freeze()"],
    correctAnswer: 1,
    explanation: "`structuredClone()` is a native global function that performs deep cloning of JavaScript values.",
    difficulty: "easy"
  },
  {
    questionId: "js-016",
    question: "What is the result of `Boolean('')`, `Boolean(0)`, and `Boolean([])` respectively?",
    options: ["false, false, false", "false, false, true", "true, false, true", "false, true, true"],
    correctAnswer: 1,
    explanation: "Empty string `''` and `0` are falsy, while empty array `[]` is an object reference and therefore truthy.",
    difficulty: "easy"
  },
  {
    questionId: "js-017",
    question: "What will `console.log([1, 2, 3] + [4, 5, 6])` output?",
    options: ["[1, 2, 3, 4, 5, 6]", "'1,2,34,5,6'", "NaN", "TypeError"],
    correctAnswer: 1,
    explanation: "Arrays are coerced to strings via `toString()` (`'1,2,3'` and `'4,5,6'`), then concatenated to `'1,2,34,5,6'`.",
    difficulty: "medium"
  },
  {
    questionId: "js-018",
    question: "Which of the following methods stops event propagation up the DOM tree?",
    options: ["event.preventDefault()", "event.stopPropagation()", "event.stopImmediate()", "event.cancel()"],
    correctAnswer: 1,
    explanation: "`stopPropagation()` prevents the current event from bubbling further up or capturing down through the DOM.",
    difficulty: "easy"
  },
  {
    questionId: "js-019",
    question: "What is the output of `(function(){ var a = b = 3; })(); console.log(typeof b);`?",
    options: ["'undefined'", "'number'", "'object'", "ReferenceError"],
    correctAnswer: 1,
    explanation: "`b = 3` creates a global variable in non-strict mode because `var` only applies to `a`. Thus `b` is globally accessible as a number.",
    difficulty: "hard"
  },
  {
    questionId: "js-020",
    question: "Which method invokes a function immediately while passing arguments as an array?",
    options: ["Function.prototype.call()", "Function.prototype.apply()", "Function.prototype.bind()", "Function.prototype.exec()"],
    correctAnswer: 1,
    explanation: "`apply(thisArg, [argsArray])` invokes the function with an array of arguments, whereas `call()` takes comma-separated arguments.",
    difficulty: "easy"
  },
  {
    questionId: "js-021",
    question: "What is the result of `Object.is(-0, +0)`?",
    options: ["true", "false", "undefined", "NaN"],
    correctAnswer: 1,
    explanation: "`Object.is()` distinguishes between `-0` and `+0` (returns false), unlike the `===` operator which considers `-0 === +0` true.",
    difficulty: "medium"
  },
  {
    questionId: "js-022",
    question: "What does the `WeakMap` data structure in JavaScript allow?",
    options: [
      "Keys can be arbitrary primitives or objects",
      "Keys must be objects, and they are weakly referenced allowing garbage collection",
      "Values are automatically sorted",
      "It allows iteration via `for...of` loops"
    ],
    correctAnswer: 1,
    explanation: "WeakMap keys must be garbage-collectible objects; if no other reference exists, the key and entry can be cleared by GC.",
    difficulty: "medium"
  },
  {
    questionId: "js-023",
    question: "What does `Array.prototype.reduce()` return if called on an empty array without an initialValue?",
    options: ["undefined", "null", "TypeError", "0"],
    correctAnswer: 2,
    explanation: "Executing `reduce()` on an empty array without providing an initial value throws an immediate `TypeError: Reduce of empty array with no initial value`.",
    difficulty: "medium"
  },
  {
    questionId: "js-024",
    question: "What will `console.log(3 > 2 > 1)` evaluate to?",
    options: ["true", "false", "undefined", "TypeError"],
    correctAnswer: 1,
    explanation: "Evaluated left-to-right: `(3 > 2)` is `true`. Then `(true > 1)` coerces `true` to `1`: `1 > 1` is `false`.",
    difficulty: "medium"
  },
  {
    questionId: "js-025",
    question: "What is the primary difference between `sessionStorage` and `localStorage`?",
    options: [
      "`localStorage` data persists indefinitely until cleared, while `sessionStorage` data clears when the page session/tab ends",
      "`sessionStorage` can store up to 50MB, whereas `localStorage` stores 5MB",
      "`localStorage` is sent with every HTTP request automatically",
      "`sessionStorage` is synchronous while `localStorage` is asynchronous"
    ],
    correctAnswer: 0,
    explanation: "`sessionStorage` survives page reloads but is scoped to the browser tab lifecycle; `localStorage` persists across sessions until explicitly deleted.",
    difficulty: "easy"
  },
  {
    questionId: "js-026",
    question: "Which operator provides a default value only when the left operand is `null` or `undefined` (nullish)?",
    options: ["|| (Logical OR)", "?? (Nullish Coalescing)", "&& (Logical AND)", "?: (Ternary)"],
    correctAnswer: 1,
    explanation: "The nullish coalescing operator `??` returns its right operand only if the left operand evaluates to `null` or `undefined` (ignoring `0`, `false`, `''`).",
    difficulty: "easy"
  },
  {
    questionId: "js-027",
    question: "What does a generator function return when invoked?",
    options: ["The resolved value directly", "A Generator Object (an Iterator)", "A Promise", "A Worker thread"],
    correctAnswer: 1,
    explanation: "Functions defined with `function*` return a Generator object conforming to the iterable and iterator protocols.",
    difficulty: "medium"
  },
  {
    questionId: "js-028",
    question: "Which of the following will properly freeze an object so its top-level properties cannot be added, deleted, or modified?",
    options: ["Object.seal()", "Object.freeze()", "Object.preventExtensions()", "Object.lock()"],
    correctAnswer: 1,
    explanation: "`Object.freeze()` prevents adding new properties, deleting existing properties, or changing the values/descriptors of existing properties.",
    difficulty: "easy"
  },
  {
    questionId: "js-029",
    question: "What is the output of `console.log([10, 2, 5, 1].sort())`?",
    options: ["[1, 2, 5, 10]", "[1, 10, 2, 5]", "[10, 5, 2, 1]", "[2, 5, 10, 1]"],
    correctAnswer: 1,
    explanation: "Default `sort()` converts array elements to strings and compares UTF-16 code unit values, placing `'10'` before `'2'`.",
    difficulty: "medium"
  },
  {
    questionId: "js-030",
    question: "What does the keyword `super` refer to inside a derived class constructor?",
    options: [
      "The child class instance",
      "The parent/base class constructor",
      "The global window object",
      "The prototype of the child class"
    ],
    correctAnswer: 1,
    explanation: "`super()` invokes the parent class constructor to initialize `this` in the subclass context.",
    difficulty: "easy"
  },
  {
    questionId: "js-031",
    question: "What is the output of `console.log(typeof (() => {}))`?",
    options: ["'arrow'", "'object'", "'function'", "'undefined'"],
    correctAnswer: 2,
    explanation: "Functions of all types, including arrow functions, yield `'function'` under the `typeof` operator.",
    difficulty: "easy"
  },
  {
    questionId: "js-032",
    question: "What happens when you access an uninitialized variable declared with `var`?",
    options: ["Throws a ReferenceError", "Returns `undefined`", "Returns `null`", "Throws a TypeError"],
    correctAnswer: 1,
    explanation: "`var` variables are hoisted and initialized to `undefined` at the start of their function/global execution context.",
    difficulty: "easy"
  },
  {
    questionId: "js-033",
    question: "Which method creates a new object using an existing object as the prototype of the newly created object?",
    options: ["Object.assign()", "Object.create()", "Object.setPrototypeOf()", "new Object()"],
    correctAnswer: 1,
    explanation: "`Object.create(proto)` constructs a fresh object whose `[[Prototype]]` points directly to `proto`.",
    difficulty: "medium"
  },
  {
    questionId: "js-034",
    question: "What does `Promise.race()` return?",
    options: [
      "The promise that resolves first with a value",
      "A promise that settles as soon as any input promise settles (either resolves OR rejects)",
      "An array of all completed promises",
      "The promise that took the longest time"
    ],
    correctAnswer: 1,
    explanation: "`Promise.race()` settles with the outcome (value or error) of the very first promise to settle.",
    difficulty: "medium"
  },
  {
    questionId: "js-035",
    question: "What is the purpose of the `use strict` directive in JavaScript?",
    options: [
      "Enforces strict typing like TypeScript",
      "Catches silent errors, disables un-declared globals, and restricts unsafe language features",
      "Compresses and optimizes code execution",
      "Prevents asynchronous callbacks from running"
    ],
    correctAnswer: 1,
    explanation: "Strict mode eliminates silent bugs by throwing errors, prevents accidental globals, and prohibits `with` statements.",
    difficulty: "easy"
  },
  {
    questionId: "js-036",
    question: "What will `console.log(typeof Symbol('id'))` output?",
    options: ["'string'", "'symbol'", "'object'", "'identifier'"],
    correctAnswer: 1,
    explanation: "Symbols are unique primitive values introduced in ES6, returning `'symbol'` with `typeof`.",
    difficulty: "easy"
  },
  {
    questionId: "js-037",
    question: "What does `Array.prototype.flat()` do by default if no depth argument is passed?",
    options: ["Flattens up to depth 1", "Flattens completely (Infinity)", "Returns the array unmodified", "Throws an error"],
    correctAnswer: 0,
    explanation: "`flat()` defaults to flattening sub-array elements at depth 1.",
    difficulty: "easy"
  },
  {
    questionId: "js-038",
    question: "What is event delegation in client-side JavaScript?",
    options: [
      "Assigning an event listener to multiple children simultaneously",
      "Attaching a single event listener to a parent element to handle events triggered by descendants via bubbling",
      "Delegating server processing to Web Workers",
      "Transferring mouse focus to keyboard handlers"
    ],
    correctAnswer: 1,
    explanation: "Event delegation exploits event bubbling so a single listener on an ancestor manages clicks on many dynamic children.",
    difficulty: "medium"
  },
  {
    questionId: "js-039",
    question: "What is the output of `console.log(1 < 2 < 3)` and `console.log(3 > 2 > 1)`?",
    options: ["true, true", "true, false", "false, true", "false, false"],
    correctAnswer: 1,
    explanation: "`1 < 2` is `true`, then `true < 3` coerces `true` to 1: `1 < 3` is `true`. In contrast, `3 > 2` is `true`, then `true > 1` becomes `1 > 1` which is `false`.",
    difficulty: "medium"
  },
  {
    questionId: "js-040",
    question: "Which of the following creates an unmodifiable, unique object property identifier?",
    options: ["String()", "Symbol()", "BigInt()", "Proxy()"],
    correctAnswer: 1,
    explanation: "Every `Symbol()` call generates a globally unique identifier that never clashes with other property keys.",
    difficulty: "easy"
  },
  {
    questionId: "js-041",
    question: "What will be printed by: `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }`?",
    options: ["0 1 2", "3 3 3", "undefined undefined undefined", "0 0 0"],
    correctAnswer: 1,
    explanation: "`var` is function-scoped; by the time the `setTimeout` timer callbacks execute, the single loop variable `i` has incremented to 3.",
    difficulty: "medium"
  },
  {
    questionId: "js-042",
    question: "What will be printed if `let` is used instead: `for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }`?",
    options: ["0 1 2", "3 3 3", "undefined undefined undefined", "2 2 2"],
    correctAnswer: 0,
    explanation: "`let` creates a distinct new lexical binding for `i` in each loop iteration, preserving 0, 1, and 2 in the closure.",
    difficulty: "medium"
  },
  {
    questionId: "js-043",
    question: "What is a `Proxy` object in JavaScript used for?",
    options: [
      "To intercept and customize fundamental operations (like property lookup, assignment, enumeration) on a target object",
      "To establish HTTPS network proxy tunnels",
      "To serialize objects to XML",
      "To run code in isolated sandboxed iframes"
    ],
    correctAnswer: 0,
    explanation: "A `Proxy` wraps another object (target) and intercepts operations using handler traps such as `get`, `set`, and `has`.",
    difficulty: "medium"
  },
  {
    questionId: "js-044",
    question: "What is the result of `Number.MAX_SAFE_INTEGER` in JavaScript?",
    options: ["2^31 - 1", "2^53 - 1 (9007199254740991)", "2^64 - 1", "Infinity"],
    correctAnswer: 1,
    explanation: "JavaScript represents numbers as double-precision floats, offering exact integer precision up to 2^53 - 1.",
    difficulty: "medium"
  },
  {
    questionId: "js-045",
    question: "Which method removes the last element from an array and returns that element?",
    options: ["shift()", "pop()", "slice()", "splice()"],
    correctAnswer: 1,
    explanation: "`pop()` removes the last element and mutates the array length, returning the popped element.",
    difficulty: "easy"
  },
  {
    questionId: "js-046",
    question: "Which method removes the first element from an array and returns it?",
    options: ["unshift()", "shift()", "pop()", "splice()"],
    correctAnswer: 1,
    explanation: "`shift()` removes the element at index 0 and shifts subsequent elements down.",
    difficulty: "easy"
  },
  {
    questionId: "js-047",
    question: "What does the `Reflect` API provide in JavaScript?",
    options: [
      "Methods for interceptable JavaScript operations identical to Proxy handler traps",
      "A way to inspect database tables",
      "Graphic rendering utilities for CSS reflections",
      "Methods to access CPU memory registers"
    ],
    correctAnswer: 0,
    explanation: "`Reflect` is a built-in object that provides static methods for interceptable JavaScript operations matching Proxy handler methods.",
    difficulty: "hard"
  },
  {
    questionId: "js-048",
    question: "What is the return value of `async function test() { return 42; }` when invoked?",
    options: ["42", "Promise.resolve(42)", "undefined", "Generator object"],
    correctAnswer: 1,
    explanation: "Async functions always wrap their return value in a resolved Promise.",
    difficulty: "easy"
  },
  {
    questionId: "js-049",
    question: "What does the `Object.hasOwn(obj, prop)` method do in modern JavaScript (ES2022)?",
    options: [
      "A safer alternative to `Object.prototype.hasOwnProperty.call()` to check if an object possesses a direct property",
      "Checks if property exists anywhere on the prototype chain",
      "Verifies if an object is owned by the current window",
      "Locks the property so it cannot be inherited"
    ],
    correctAnswer: 0,
    explanation: "`Object.hasOwn()` works cleanly even on objects created with `Object.create(null)` where `hasOwnProperty` is absent.",
    difficulty: "medium"
  },
  {
    questionId: "js-050",
    question: "What will `console.log(!!{})` output?",
    options: ["true", "false", "undefined", "TypeError"],
    correctAnswer: 0,
    explanation: "In JavaScript, all objects (including empty `{}`) are truthy, so double negation yields `true`.",
    difficulty: "easy"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'dsa.json'),
  JSON.stringify(dsaQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated dsa.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'javascript.json'),
  JSON.stringify(jsQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated javascript.json (50 questions)');
