import mongoose from 'mongoose';
import { ProblemModel } from '../modules/problem/problem.model.js';
import { ProblemTopic, ProblemDifficulty, ProblemStatus } from '../modules/problem/problem.types.js';

const handcraftedProblems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    topic: ProblemTopic.ARRAYS,
    difficulty: ProblemDifficulty.EASY,
    status: ProblemStatus.PUBLISHED,
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers, third line contains the target.',
    outputFormat: 'Two space-separated integers representing the indices.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 9, we return 0 1.'
      }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write code here\n}',
      python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass'
    },
    hiddenTestCases: [
      {
        input: '3\n3 2 4\n6',
        output: '1 2'
      },
      {
        input: '2\n3 3\n6',
        output: '0 1'
      }
    ],
    referenceSolutions: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        map = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in map:\n                return [map[complement], i]\n            map[num] = i\n        return []'
    },
    timeLimit: 2,
    memoryLimit: 256,
    points: 100,
    tags: ['array', 'hash-table']
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    topic: ProblemTopic.STRINGS,
    difficulty: ProblemDifficulty.EASY,
    status: ProblemStatus.PUBLISHED,
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.',
    inputFormat: 'A single line containing the string.',
    outputFormat: 'The reversed string.',
    constraints: '1 <= s.length <= 10^5',
    examples: [
      {
        input: 'hello',
        output: 'olleh',
        explanation: 'Reversing "hello" yields "olleh".'
      }
    ],
    starterCode: {
      javascript: 'function reverseString(s) {\n  // Write code here\n}',
      python: 'class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        pass'
    },
    hiddenTestCases: [
      {
        input: 'Hannah',
        output: 'hannaH'
      }
    ],
    referenceSolutions: {
      javascript: 'function reverseString(s) {\n  return s.split("").reverse().join("");\n}',
      python: 'class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        s.reverse()'
    },
    timeLimit: 2,
    memoryLimit: 256,
    points: 100,
    tags: ['two-pointers', 'string']
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    topic: ProblemTopic.ARRAYS,
    difficulty: ProblemDifficulty.MEDIUM,
    status: ProblemStatus.PUBLISHED,
    description: 'You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers representing heights.',
    outputFormat: 'An integer representing the maximum water.',
    constraints: '2 <= n <= 10^5\n0 <= height[i] <= 10^4',
    examples: [
      {
        input: '9\n1 8 6 2 5 4 8 3 7',
        output: '49',
        explanation: 'The max area of water is obtained between index 1 and 8, height min(8, 7) * width (8 - 1) = 7 * 7 = 49.'
      }
    ],
    starterCode: {
      javascript: 'function maxArea(height) {\n  // Write code here\n}',
      python: 'class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass'
    },
    hiddenTestCases: [
      {
        input: '2\n1 1',
        output: '1'
      },
      {
        input: '5\n4 3 2 1 4',
        output: '16'
      }
    ],
    referenceSolutions: {
      javascript: 'function maxArea(height) {\n  let maxVal = 0;\n  let l = 0, r = height.length - 1;\n  while (l < r) {\n    maxVal = Math.max(maxVal, Math.min(height[l], height[r]) * (r - l));\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return maxVal;\n}',
      python: 'class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        max_val = 0\n        l, r = 0, len(height) - 1\n        while l < r:\n            max_val = max(max_val, min(height[l], height[r]) * (r - l))\n            if height[l] < height[r]:\n                l += 1\n            else:\n                r -= 1\n        return max_val'
    },
    timeLimit: 2,
    memoryLimit: 256,
    points: 150,
    tags: ['two-pointers', 'array']
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    topic: ProblemTopic.STRINGS,
    difficulty: ProblemDifficulty.MEDIUM,
    status: ProblemStatus.PUBLISHED,
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    inputFormat: 'A single line containing the string.',
    outputFormat: 'The length of the longest substring.',
    constraints: '0 <= s.length <= 5 * 10^4',
    examples: [
      {
        input: 'abcabcbb',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write code here\n}',
      python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass'
    },
    hiddenTestCases: [
      {
        input: 'bbbbb',
        output: '1'
      },
      {
        input: 'pwwkew',
        output: '3'
      }
    ],
    referenceSolutions: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  let maxLen = 0;\n  let start = 0;\n  const seen = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (seen.has(s[i])) {\n      start = Math.max(start, seen.get(s[i]) + 1);\n    }\n    seen.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}',
      python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        max_len = 0\n        start = 0\n        seen = {}\n        for i, char in enumerate(s):\n            if char in seen:\n                start = max(start, seen[char] + 1)\n            seen[char] = i\n            max_len = max(max_len, i - start + 1)\n        return max_len'
    },
    timeLimit: 2,
    memoryLimit: 256,
    points: 150,
    tags: ['sliding-window', 'hash-table', 'string']
  },
  {
    title: 'First Missing Positive',
    slug: 'first-missing-positive',
    topic: ProblemTopic.ARRAYS,
    difficulty: ProblemDifficulty.HARD,
    status: ProblemStatus.PUBLISHED,
    description: 'Given an unsorted integer array `nums`, return the smallest missing positive integer.',
    inputFormat: 'First line contains N (size of array), second line contains N space-separated integers.',
    outputFormat: 'An integer representing the smallest missing positive integer.',
    constraints: '1 <= nums.length <= 10^5\n-2^31 <= nums[i] <= 2^31 - 1',
    examples: [
      {
        input: '3\n1 2 0',
        output: '3',
        explanation: 'The numbers in the range [1,2] are all in the array, so 3 is the smallest missing positive.'
      }
    ],
    starterCode: {
      javascript: 'function firstMissingPositive(nums) {\n  // Write code here\n}',
      python: 'class Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        pass'
    },
    hiddenTestCases: [
      {
        input: '4\n3 4 -1 1',
        output: '2'
      },
      {
        input: '5\n7 8 9 11 12',
        output: '1'
      }
    ],
    referenceSolutions: {
      javascript: 'function firstMissingPositive(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const temp = nums[nums[i] - 1];\n      nums[nums[i] - 1] = nums[i];\n      nums[i] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) return i + 1;\n  }\n  return n + 1;\n}',
      python: 'class Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        n = len(nums)\n        for i in range(n):\n            while 0 < nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n                temp = nums[nums[i] - 1]\n                nums[nums[i] - 1] = nums[i]\n                nums[i] = temp\n        for i in range(n):\n            if nums[i] != i + 1:\n                return i + 1\n        return n + 1'
    },
    timeLimit: 2,
    memoryLimit: 256,
    points: 200,
    tags: ['array']
  }
];

// Generate dynamic problems to cover any missing Topic x Difficulty combinations
const allProblems = [...handcraftedProblems];

for (const topic of Object.values(ProblemTopic)) {
  for (const difficulty of Object.values(ProblemDifficulty)) {
    const hasMatch = handcraftedProblems.some(
      (p) => p.topic === topic && p.difficulty === difficulty
    );
    if (!hasMatch) {
      const title = `${topic} ${difficulty} Challenge`;
      const slug = `${topic.toLowerCase()}-${difficulty.toLowerCase()}-challenge`;
      allProblems.push({
        title,
        slug,
        topic,
        difficulty,
        status: ProblemStatus.PUBLISHED,
        description: `This is a dynamically seeded challenge for ${topic} with ${difficulty} difficulty. Implement the function to solve the problem.`,
        inputFormat: `Standard input format for ${topic}.`,
        outputFormat: `Standard output format for ${topic}.`,
        constraints: `Time limit: 2s. Memory limit: 256MB.`,
        examples: [
          {
            input: 'example_input',
            output: 'example_output',
            explanation: 'Standard example explanation.'
          }
        ],
        starterCode: {
          javascript: `function solve(input) {\n  // Write your code here\n  return input;\n}`,
          python: `def solve(input):\n    # Write your code here\n    return input`
        },
        hiddenTestCases: [
          {
            input: 'test_input_1',
            output: 'test_input_1'
          },
          {
            input: 'test_input_2',
            output: 'test_input_2'
          }
        ],
        referenceSolutions: {
          javascript: `function solve(input) {\n  return input;\n}`,
          python: `def solve(input):\n    return input`
        },
        timeLimit: 2,
        memoryLimit: 256,
        points: difficulty === ProblemDifficulty.EASY ? 100 : difficulty === ProblemDifficulty.MEDIUM ? 150 : 200,
        tags: [topic.toLowerCase(), difficulty.toLowerCase()]
      });
    }
  }
}

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://hvharshverma025_db_user:SbyS85S0hor788FK@codearena.7o6mhrw.mongodb.net/codearena";
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(uri);
  console.log("Connected.");

  console.log("Clearing existing problems...");
  await ProblemModel.deleteMany({});

  console.log(`Inserting ${allProblems.length} problems...`);
  await ProblemModel.insertMany(allProblems);
  console.log("Seeding completed successfully!");

  await mongoose.disconnect();
  console.log("Disconnected.");
}

seed().catch(console.error);
