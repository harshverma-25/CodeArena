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

// 1. Python Programming (50 questions)
const pythonQuestions: Question[] = [
  {
    questionId: "py-001",
    question: "What is the primary purpose of the Global Interpreter Lock (GIL) in CPython?",
    options: [
      "To prevent multiple threads from executing Python bytecode simultaneously",
      "To speed up asynchronous I/O loops",
      "To lock dictionary keys during iteration",
      "To encrypt bytecode files (.pyc)"
    ],
    correctAnswer: 0,
    explanation: "The GIL is a mutex that prevents multiple native threads from executing CPython bytecode at once, ensuring thread-safe CPython memory management.",
    difficulty: "medium"
  },
  {
    questionId: "py-002",
    question: "Which of the following data types in Python is IMMUTABLE?",
    options: ["list", "dict", "tuple", "set"],
    correctAnswer: 2,
    explanation: "Tuples cannot be modified after creation, making them immutable sequences in Python.",
    difficulty: "easy"
  },
  {
    questionId: "py-003",
    question: "What will `print(type(lambda x: x))` output in Python?",
    options: ["<class 'lambda'>", "<class 'function'>", "<class 'method'>", "<class 'anonymous'>"],
    correctAnswer: 1,
    explanation: "Anonymous functions created with `lambda` are regular function objects and belong to `<class 'function'>`.",
    difficulty: "easy"
  },
  {
    questionId: "py-004",
    question: "What is the difference between `__str__` and `__repr__` in Python?",
    options: [
      "`__str__` is intended for readable user output; `__repr__` is intended for unambiguous developer representation and debugging",
      "`__repr__` is for printing to files; `__str__` is for console only",
      "`__str__` is deprecated in Python 3",
      "`__repr__` converts to byte string; `__str__` converts to unicode"
    ],
    correctAnswer: 0,
    explanation: "`__str__` provides a human-friendly string, while `__repr__` should ideally be an expression that could recreate the object.",
    difficulty: "medium"
  },
  {
    questionId: "py-005",
    question: "What does the `with` statement in Python simplify?",
    options: [
      "Thread synchronization only",
      "Exception handling and automatic resource management via context managers",
      "Dynamic module imports",
      "Loop optimization"
    ],
    correctAnswer: 1,
    explanation: "The `with` statement ensures `__enter__()` and `__exit__()` are called on the context manager, guaranteeing resource cleanup (like closing files).",
    difficulty: "easy"
  },
  {
    questionId: "py-006",
    question: "What will `print([i for i in range(5) if i % 2 == 0])` output?",
    options: ["[0, 2, 4]", "[2, 4]", "[1, 3]", "[0, 1, 2, 3, 4]"],
    correctAnswer: 0,
    explanation: "Even numbers in `range(5)` (0, 1, 2, 3, 4) are 0, 2, and 4.",
    difficulty: "easy"
  },
  {
    questionId: "py-007",
    question: "What is the output of `bool('False')` in Python?",
    options: ["False", "True", "None", "ValueError"],
    correctAnswer: 1,
    explanation: "Any non-empty string in Python evaluates to `True` when converted to boolean.",
    difficulty: "easy"
  },
  {
    questionId: "py-008",
    question: "Which built-in module provides tools for working with iterators and combinatorics (e.g., permutations, combinations)?",
    options: ["functools", "itertools", "collections", "operator"],
    correctAnswer: 1,
    explanation: "`itertools` offers memory-efficient generator functions for combinatorial iterators like cycle, chain, and permutations.",
    difficulty: "easy"
  },
  {
    questionId: "py-009",
    question: "What is the difference between `is` and `==` in Python?",
    options: [
      "`is` checks identity (same memory address), whereas `==` checks value equality",
      "`is` checks value equality, whereas `==` checks identity",
      "`is` is used only for strings, `==` for numbers",
      "They are completely interchangeable"
    ],
    correctAnswer: 0,
    explanation: "`is` checks if two references point to the exact same object (`id(a) == id(b)`), while `==` checks if their contents are equal.",
    difficulty: "easy"
  },
  {
    questionId: "py-010",
    question: "What does the `*args` and `**kwargs` syntax in a function definition do?",
    options: [
      "`*args` accepts arbitrary positional arguments as a tuple; `**kwargs` accepts arbitrary keyword arguments as a dictionary",
      "`*args` specifies pointer addresses; `**kwargs` specifies reference counts",
      "`*args` handles exceptions; `**kwargs` handles type declarations",
      "`*args` is for required parameters; `**kwargs` is for default parameters"
    ],
    correctAnswer: 0,
    explanation: "`*args` packs variable positional parameters into a tuple, while `**kwargs` packs keyword arguments into a dictionary.",
    difficulty: "easy"
  },
  {
    questionId: "py-011",
    question: "What does the `yield` keyword do inside a Python function?",
    options: [
      "Terminates the function permanently like return",
      "Turns the function into a generator, producing values one at a time and pausing execution state",
      "Relinquishes CPU time to the OS scheduler",
      "Yields execution to the next imported package"
    ],
    correctAnswer: 1,
    explanation: "Functions containing `yield` become generators that preserve local state and yield items sequentially upon `next()`.",
    difficulty: "easy"
  },
  {
    questionId: "py-012",
    question: "What is the Method Resolution Order (MRO) algorithm used in Python 3 for multiple inheritance?",
    options: ["Depth-First Search", "Breadth-First Search", "C3 Linearization", "Dijkstra's topological sort"],
    correctAnswer: 2,
    explanation: "Python uses the C3 Linearization algorithm to determine the order in which base classes are searched for attributes.",
    difficulty: "hard"
  },
  {
    questionId: "py-013",
    question: "What is the output of `list(set([1, 2, 2, 3, 1, 4]))`?",
    options: [
      "A list with duplicates preserved",
      "A list containing unique elements [1, 2, 3, 4] (order may vary)",
      "Throws a TypeError",
      "A dictionary of frequencies"
    ],
    correctAnswer: 1,
    explanation: "Constructing a set strips duplicate values; converting back yields unique elements.",
    difficulty: "easy"
  },
  {
    questionId: "py-014",
    question: "What is a Python decorator?",
    options: [
      "A graphical tool in Tkinter",
      "A function that takes another function as an argument, extends its behavior without modifying it, and returns a function",
      "A class that serializes JSON",
      "A comment style using triple quotes"
    ],
    correctAnswer: 1,
    explanation: "Decorators wrap functions (using the `@` syntax) to add functionality such as logging, authentication, or caching.",
    difficulty: "medium"
  },
  {
    questionId: "py-015",
    question: "What happens when you pass a mutable default argument like `def add_item(item, lst=[]):`?",
    options: [
      "A new list is created on every call",
      "The default list is created once at function definition time and shared across subsequent calls",
      "Python raises a SyntaxError at compilation",
      "The list is automatically frozen into a tuple"
    ],
    correctAnswer: 1,
    explanation: "Default parameter expressions are evaluated once when the function is defined, causing mutable objects like lists to persist state between calls.",
    difficulty: "medium"
  },
  {
    questionId: "py-016",
    question: "What is the result of `'hello'[-1]` in Python?",
    options: ["'h'", "'o'", "'l'", "IndexError"],
    correctAnswer: 1,
    explanation: "Negative indexing in Python indexes from the end, so `[-1]` retrieves the last character `'o'`.",
    difficulty: "easy"
  },
  {
    questionId: "py-017",
    question: "Which built-in function returns a list of attributes and methods available on an object?",
    options: ["inspect()", "dir()", "help()", "eval()"],
    correctAnswer: 1,
    explanation: "`dir()` returns all valid attributes and magic methods for an object or module.",
    difficulty: "easy"
  },
  {
    questionId: "py-018",
    question: "What is the time complexity of looking up a key in a Python `dict` on average?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0,
    explanation: "Python dictionaries are implemented using optimized hash tables, giving average O(1) key lookup.",
    difficulty: "easy"
  },
  {
    questionId: "py-019",
    question: "What does the `@staticmethod` decorator indicate in a class definition?",
    options: [
      "The method receives the class `cls` as its first argument",
      "The method does not receive an implicit first argument (neither `self` nor `cls`)",
      "The method cannot be called without instantiating the class",
      "The method's variables are kept in static C memory"
    ],
    correctAnswer: 1,
    explanation: "A static method is bound to the class rather than an object, behaving like a plain function without `self` or `cls`.",
    difficulty: "medium"
  },
  {
    questionId: "py-020",
    question: "What does the `@classmethod` decorator provide to the method as its first argument?",
    options: ["`self` (instance)", "`cls` (the class object itself)", "None", "The parent module"],
    correctAnswer: 1,
    explanation: "`@classmethod` methods receive the class object (`cls`) as the first argument, allowing factory constructors.",
    difficulty: "easy"
  },
  {
    questionId: "py-021",
    question: "What is the purpose of `__init__.py` in a directory?",
    options: [
      "It marks the directory as a Python package that can be imported",
      "It contains compiler instructions for C extensions",
      "It runs unit tests automatically",
      "It initializes the virtual environment"
    ],
    correctAnswer: 0,
    explanation: "Historically and conventionally, `__init__.py` denotes that a folder should be treated as a Python package namespace.",
    difficulty: "easy"
  },
  {
    questionId: "py-022",
    question: "What is the difference between `deepcopy` and `copy` in the `copy` module?",
    options: [
      "`copy` creates a shallow copy (copies references of nested objects); `deepcopy` recursively copies all nested objects",
      "`deepcopy` works only on primitives",
      "`copy` is faster because it encrypts the object",
      "`deepcopy` creates a pointer in C memory"
    ],
    correctAnswer: 0,
    explanation: "Shallow copy only duplicates the outer container, whereas `deepcopy` duplicates nested mutable child objects recursively.",
    difficulty: "medium"
  },
  {
    questionId: "py-023",
    question: "What will `print(round(2.5))` and `print(round(3.5))` output in Python 3?",
    options: ["3 and 4", "2 and 4", "3 and 3", "2 and 3"],
    correctAnswer: 1,
    explanation: "Python 3 uses 'round half to even' (banker's rounding): 2.5 rounds to 2 (even) and 3.5 rounds to 4 (even).",
    difficulty: "hard"
  },
  {
    questionId: "py-024",
    question: "Which magic method is invoked when an instance of a class is called like a function: `obj()`?",
    options: ["`__init__`", "`__call__`", "`__invoke__`", "`__run__`"],
    correctAnswer: 1,
    explanation: "Implementing `__call__` allows instances of the class to behave as callables.",
    difficulty: "medium"
  },
  {
    questionId: "py-025",
    question: "What does `sys.getrefcount(obj)` return in Python?",
    options: [
      "The number of references to an object plus one (for the argument itself)",
      "The memory size of the object in bytes",
      "The hash value of the object",
      "The garbage collector generation number"
    ],
    correctAnswer: 0,
    explanation: "It returns the current reference count, which is 1 higher than expected because passing it to `getrefcount` creates a temporary reference.",
    difficulty: "hard"
  },
  {
    questionId: "py-026",
    question: "What will `a = [1, 2]; b = a; b += [3]; print(a)` output?",
    options: ["[1, 2]", "[1, 2, 3]", "[3]", "TypeError"],
    correctAnswer: 1,
    explanation: "`+=` on a list calls `extend()` in-place, mutating the shared list object referenced by both `a` and `b`.",
    difficulty: "medium"
  },
  {
    questionId: "py-027",
    question: "What does the `pass` statement do in Python?",
    options: [
      "Terminates the program immediately",
      "A null operation; nothing happens, used as a syntactic placeholder",
      "Skips to the next iteration of a loop",
      "Passes an argument by reference"
    ],
    correctAnswer: 1,
    explanation: "`pass` is a placeholder when a statement is required syntactically but no code needs to execute.",
    difficulty: "easy"
  },
  {
    questionId: "py-028",
    question: "What will `print('abc'.find('z'))` return in Python?",
    options: ["-1", "None", "ValueError", "0"],
    correctAnswer: 0,
    explanation: "`str.find()` returns -1 if the substring is not found, unlike `str.index()` which raises a `ValueError`.",
    difficulty: "easy"
  },
  {
    questionId: "py-029",
    question: "What is the primary difference between a list and a generator expression in Python?",
    options: [
      "Lists store all elements in memory immediately; generators yield elements lazily on demand",
      "Generators cannot be looped over",
      "Lists can only store integers",
      "Generators use square brackets `[]`"
    ],
    correctAnswer: 0,
    explanation: "Generator expressions (in parentheses `()`) compute items lazily, consuming significantly less memory for large sequences.",
    difficulty: "easy"
  },
  {
    questionId: "py-030",
    question: "Which of the following creates a dictionary with default values for non-existent keys?",
    options: ["collections.defaultdict", "collections.OrderedDict", "collections.namedtuple", "collections.deque"],
    correctAnswer: 0,
    explanation: "`defaultdict` takes a factory callable and automatically populates missing keys when accessed.",
    difficulty: "easy"
  },
  {
    questionId: "py-031",
    question: "What does the `@property` decorator allow you to do in a Python class?",
    options: [
      "Access a method like a regular attribute getter",
      "Make the class private",
      "Automatically serialize the class to XML",
      "Disable garbage collection on the class"
    ],
    correctAnswer: 0,
    explanation: "`@property` turns an instance method into a getter, allowing `obj.prop` syntax without parentheses.",
    difficulty: "easy"
  },
  {
    questionId: "py-032",
    question: "What is the output of `print(0.1 + 0.2 == 0.3)` in standard Python?",
    options: ["True", "False", "None", "FloatingPointError"],
    correctAnswer: 1,
    explanation: "Binary floating-point arithmetic makes `0.1 + 0.2 = 0.30000000000000004`, evaluating the equality to `False`.",
    difficulty: "easy"
  },
  {
    questionId: "py-033",
    question: "Which module in Python is used for asynchronous programming with `async`/`await` syntax?",
    options: ["multiprocessing", "threading", "asyncio", "concurrent.futures"],
    correctAnswer: 2,
    explanation: "`asyncio` provides an event loop, coroutines, and tasks for concurrent asynchronous I/O operations.",
    difficulty: "easy"
  },
  {
    questionId: "py-034",
    question: "What is the purpose of `__slots__` in a Python class?",
    options: [
      "Restricts valid attributes and prevents creation of `__dict__`, reducing memory overhead per instance",
      "Enables multi-threading on the class",
      "Creates slots for GUI buttons",
      "Enforces static typing on all fields"
    ],
    correctAnswer: 0,
    explanation: "Declaring `__slots__` bypasses dynamic `__dict__` creation, speeding up attribute access and saving significant RAM.",
    difficulty: "hard"
  },
  {
    questionId: "py-035",
    question: "What does `zip([1, 2], ['a', 'b'])` return when converted to a list?",
    options: ["[(1, 'a'), (2, 'b')]", "[(1, 2), ('a', 'b')]", "[1, 2, 'a', 'b']", "{1: 'a', 2: 'b'}"],
    correctAnswer: 0,
    explanation: "`zip` aggregates elements from each iterable into pairs: `[(1, 'a'), (2, 'b')]`.",
    difficulty: "easy"
  },
  {
    questionId: "py-036",
    question: "What is the output of `bool([])`, `bool({})`, and `bool(0)` in Python?",
    options: ["False, False, False", "True, True, False", "False, True, False", "True, True, True"],
    correctAnswer: 0,
    explanation: "Empty sequences, empty mappings, and zero numeric values all evaluate to `False`.",
    difficulty: "easy"
  },
  {
    questionId: "py-037",
    question: "What is the key difference between `__new__` and `__init__` in Python?",
    options: [
      "`__new__` creates and returns the new instance; `__init__` initializes the newly created instance",
      "`__init__` creates the object; `__new__` initializes its variables",
      "`__new__` is called only in subclasses of int",
      "`__init__` is a class method; `__new__` is an instance method"
    ],
    correctAnswer: 0,
    explanation: "`__new__` is the actual constructor that allocates and returns the object before `__init__` configures its initial attributes.",
    difficulty: "hard"
  },
  {
    questionId: "py-038",
    question: "What does the `break` statement do when used inside a loop with an `else` clause?",
    options: [
      "Executes the `else` block immediately",
      "Terminates the loop and SKIPS the `else` block",
      "Causes a syntax error",
      "Restarts the loop from the beginning"
    ],
    correctAnswer: 1,
    explanation: "A loop's `else` block executes only if the loop terminates normally (without hitting a `break`).",
    difficulty: "medium"
  },
  {
    questionId: "py-039",
    question: "Which standard library module handles regular expressions in Python?",
    options: ["regex_lib", "re", "strings.regex", "pattern"],
    correctAnswer: 1,
    explanation: "The `re` module provides Perl-like regular expression matching and search operations in Python.",
    difficulty: "easy"
  },
  {
    questionId: "py-040",
    question: "What is duck typing in Python?",
    options: [
      "A static type checking mode in mypy",
      "If it walks like a duck and quacks like a duck, it's a duck — dynamic typing focusing on an object's methods rather than its explicit class",
      "Subclassing all classes from Duck",
      "A pattern where variables can only hold bird species"
    ],
    correctAnswer: 1,
    explanation: "Duck typing checks whether an object supports required operations at runtime rather than verifying its explicit inheritance hierarchy.",
    difficulty: "easy"
  },
  {
    questionId: "py-041",
    question: "What does `str.strip()` do in Python?",
    options: [
      "Removes leading and trailing whitespaces (or specified characters)",
      "Removes all spaces everywhere inside the string",
      "Reverses the string",
      "Splits the string into individual letters"
    ],
    correctAnswer: 0,
    explanation: "`strip()` removes whitespace from both the beginning and end of the string.",
    difficulty: "easy"
  },
  {
    questionId: "py-042",
    question: "What is the output of `[1, 2] * 3` in Python?",
    options: ["[3, 6]", "[1, 2, 1, 2, 1, 2]", "[[1, 2], [1, 2], [1, 2]]", "TypeError"],
    correctAnswer: 1,
    explanation: "Multiplying a sequence by an integer repeats the sequence that many times.",
    difficulty: "easy"
  },
  {
    questionId: "py-043",
    question: "What is the purpose of the `nonlocal` keyword in Python?",
    options: [
      "To declare that a variable refers to a previously bound variable in the nearest enclosing non-global scope",
      "To import variables from other servers",
      "To export variables across threads",
      "To make variables accessible without imports"
    ],
    correctAnswer: 0,
    explanation: "`nonlocal` causes the identifier to refer to a variable in the outer enclosing function scope instead of creating a local one.",
    difficulty: "medium"
  },
  {
    questionId: "py-044",
    question: "What does the `enumerate()` function return when iterating over a sequence?",
    options: [
      "Tuples of (index, item)",
      "Only the indices",
      "Only the items in reversed order",
      "A dictionary of frequencies"
    ],
    correctAnswer: 0,
    explanation: "`enumerate(iterable)` yields pairs of `(count, item)` starting from count 0 by default.",
    difficulty: "easy"
  },
  {
    questionId: "py-045",
    question: "How does Python handle garbage collection for cyclic references?",
    options: [
      "Using reference counting alone",
      "Using a generational cyclic garbage collector in addition to reference counting",
      "By crashing with an OutOfMemoryError",
      "By running mark-and-sweep on every variable change"
    ],
    correctAnswer: 1,
    explanation: "While reference counting handles immediate cleanup, a generational cycle detector detects and cleans up isolated reference cycles.",
    difficulty: "hard"
  },
  {
    questionId: "py-046",
    question: "What is the return type of `map()` in Python 3?",
    options: ["A list", "A map iterator object", "A tuple", "A dictionary"],
    correctAnswer: 1,
    explanation: "In Python 3, `map()` returns an iterator yielding items on demand rather than allocating a full list.",
    difficulty: "medium"
  },
  {
    questionId: "py-047",
    question: "Which operator performs matrix multiplication in Python 3.5+?",
    options: ["*", "**", "@", "//"],
    correctAnswer: 2,
    explanation: "The `@` operator was introduced in PEP 465 to represent matrix multiplication (implemented by NumPy and others via `__matmul__`).",
    difficulty: "medium"
  },
  {
    questionId: "py-048",
    question: "What will `dict.fromkeys(['a', 'b'], 0)` produce?",
    options: ["{'a': 0, 'b': 0}", "['a', 0, 'b', 0]", "{'a': None, 'b': None}", "{0: 'a', 0: 'b'}"],
    correctAnswer: 0,
    explanation: "`fromkeys()` initializes a new dictionary with specified keys mapped to the given initial value.",
    difficulty: "easy"
  },
  {
    questionId: "py-049",
    question: "What is the purpose of `functools.lru_cache`?",
    options: [
      "To wrap a function with a memoizing callable that saves up to maxsize recent results",
      "To clear system RAM",
      "To measure network latency",
      "To compress images"
    ],
    correctAnswer: 0,
    explanation: "`@lru_cache` is a built-in decorator that caches return values based on function arguments using a Least Recently Used eviction policy.",
    difficulty: "medium"
  },
  {
    questionId: "py-050",
    question: "What does the expression `x = 5; print(f'{x=}')` output in Python 3.8+?",
    options: ["'5'", "'x=5'", "'x = 5'", "SyntaxError"],
    correctAnswer: 1,
    explanation: "The `f'{expr=}'` syntax prints the expression text followed by an equals sign and its evaluated value, handy for quick debugging.",
    difficulty: "medium"
  }
];

// 2. Java Programming (50 questions)
const javaQuestions: Question[] = [
  {
    questionId: "java-001",
    question: "What is the primary difference between the JDK and the JRE?",
    options: [
      "JDK includes development tools (like javac) and the JRE; JRE only provides the environment to run Java bytecodes",
      "JRE compiles code; JDK executes code",
      "JDK is only for Android; JRE is for desktop",
      "They are identical since Java 8"
    ],
    correctAnswer: 0,
    explanation: "JDK (Java Development Kit) contains compilers and debugging tools plus the JRE (Java Runtime Environment) needed to execute apps.",
    difficulty: "easy"
  },
  {
    questionId: "java-002",
    question: "Why are `String` objects immutable in Java?",
    options: [
      "For security, synchronization thread-safety, and String constant pool caching",
      "Because JVM cannot allocate heap memory dynamically",
      "To prevent inheritance from Object class",
      "It is an obsolete limitation from C++"
    ],
    correctAnswer: 0,
    explanation: "Immutability allows String pooling, safe multi-threaded sharing without synchronization, and secure usage as keys in HashMaps.",
    difficulty: "medium"
  },
  {
    questionId: "java-003",
    question: "What is the default value of a boolean instance variable in a Java class?",
    options: ["true", "false", "null", "0"],
    correctAnswer: 1,
    explanation: "Instance primitive boolean fields are initialized by the JVM to `false` by default.",
    difficulty: "easy"
  },
  {
    questionId: "java-004",
    question: "Which of the following is NOT a Java primitive data type?",
    options: ["byte", "char", "String", "float"],
    correctAnswer: 2,
    explanation: "`String` is an immutable reference class, not one of the 8 primitive data types (byte, short, int, long, float, double, char, boolean).",
    difficulty: "easy"
  },
  {
    questionId: "java-005",
    question: "What does the `final` keyword indicate when applied to a class?",
    options: [
      "The class cannot be extended / subclassed",
      "The class cannot be instantiated",
      "All methods must be static",
      "The class cannot implement any interface"
    ],
    correctAnswer: 0,
    explanation: "A `final` class prevents inheritance (e.g., `public final class String`).",
    difficulty: "easy"
  },
  {
    questionId: "java-006",
    question: "What is the time complexity of `get(int index)` on an `ArrayList` in Java?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "`ArrayList` is backed by a contiguous array, providing constant-time O(1) random index access.",
    difficulty: "easy"
  },
  {
    questionId: "java-007",
    question: "What happens if both `equals()` and `hashCode()` are not overridden together when using an object as a HashMap key?",
    options: [
      "Compiler throws an error",
      "Equal objects might produce different hash codes, failing retrieval in `map.get()`",
      "The HashMap converts into a LinkedList",
      "The JVM crashes with a NullPointerException"
    ],
    correctAnswer: 1,
    explanation: "The contract states that equal objects must have identical hash codes; violating this breaks HashMap lookup.",
    difficulty: "medium"
  },
  {
    questionId: "java-008",
    question: "What is the difference between `checked` and `unchecked` exceptions in Java?",
    options: [
      "Checked exceptions extend `Exception` (excluding RuntimeException) and must be caught or declared; unchecked exceptions extend `RuntimeException` and are not required to be declared",
      "Unchecked exceptions are fatal JVM errors like OutOfMemoryError only",
      "Checked exceptions cannot be caught in try-catch",
      "There is no distinction in Java 17"
    ],
    correctAnswer: 0,
    explanation: "Checked exceptions are verified at compile-time by javac; unchecked exceptions (subclasses of RuntimeException) occur at runtime.",
    difficulty: "medium"
  },
  {
    questionId: "java-009",
    question: "What does the `volatile` keyword ensure when applied to a variable in Java?",
    options: [
      "Atomic compound operations like `count++`",
      "Visibility of writes across threads and prevents instruction reordering",
      "That the variable is placed on the call stack",
      "That the variable cannot be modified"
    ],
    correctAnswer: 1,
    explanation: "`volatile` guarantees that any thread reading the field sees the most recent write directly from main memory rather than a thread-local cache.",
    difficulty: "medium"
  },
  {
    questionId: "java-010",
    question: "What is the output of `System.out.println(10 + 20 + \"Hello\");`?",
    options: ["'1020Hello'", "'30Hello'", "'Hello30'", "'Error'"],
    correctAnswer: 1,
    explanation: "Addition is left-associative: `10 + 20` evaluates to integer 30, then `30 + \"Hello\"` coerces to string `'30Hello'`.",
    difficulty: "easy"
  },
  {
    questionId: "java-011",
    question: "Which collection class is thread-safe and allows concurrent reads without locking?",
    options: ["HashMap", "Hashtable", "ConcurrentHashMap", "TreeMap"],
    correctAnswer: 2,
    explanation: "`ConcurrentHashMap` provides high concurrency through bucket-level fine-grained locking or lock-free reads.",
    difficulty: "medium"
  },
  {
    questionId: "java-012",
    question: "What is the purpose of the `try-with-resources` statement introduced in Java 7?",
    options: [
      "Automatically closes resources that implement `java.lang.AutoCloseable` at the end of the block",
      "Catches multiple exceptions in one catch block",
      "Increases JVM heap memory dynamically",
      "Spawns background threads automatically"
    ],
    correctAnswer: 0,
    explanation: "Try-with-resources ensures `close()` is invoked automatically, preventing resource leaks for files, sockets, and DB connections.",
    difficulty: "easy"
  },
  {
    questionId: "java-013",
    question: "Can an interface in Java 8+ have concrete method implementations?",
    options: [
      "No, interfaces can only have abstract methods",
      "Yes, using `default` and `static` methods",
      "Only if marked with `@FunctionalInterface`",
      "Yes, but only private methods"
    ],
    correctAnswer: 1,
    explanation: "Java 8 introduced `default` and `static` methods with code bodies to enable backward-compatible library evolution.",
    difficulty: "easy"
  },
  {
    questionId: "java-014",
    question: "What is a Functional Interface in Java?",
    options: [
      "An interface with exactly one abstract method",
      "An interface that cannot have static methods",
      "An interface that extends `java.lang.Runnable`",
      "An interface with no methods (marker interface)"
    ],
    correctAnswer: 0,
    explanation: "A functional interface has exactly one single abstract method (SAM), qualifying it as a target for lambda expressions and method references.",
    difficulty: "easy"
  },
  {
    questionId: "java-015",
    question: "What is the difference between `==` and `.equals()` when comparing two String objects?",
    options: [
      "`==` compares reference addresses in memory, while `.equals()` compares character sequence values",
      "`.equals()` compares reference addresses, while `==` compares character values",
      "They are identical for strings",
      "`==` is case-insensitive while `.equals()` is case-sensitive"
    ],
    correctAnswer: 0,
    explanation: "`==` checks whether both references point to the exact same heap memory object; `.equals()` checks value equivalence.",
    difficulty: "easy"
  },
  {
    questionId: "java-016",
    question: "Which of the following is a marker interface (an interface with zero methods) in Java?",
    options: ["Serializable", "Comparable", "Runnable", "Callable"],
    correctAnswer: 0,
    explanation: "`java.io.Serializable` has no methods; its presence signals to the JVM that the object is serializable.",
    difficulty: "easy"
  },
  {
    questionId: "java-017",
    question: "What is the memory area in JVM where all class instances and arrays are allocated?",
    options: ["Method Area", "Java Virtual Machine Stacks", "Heap", "PC Register"],
    correctAnswer: 2,
    explanation: "All objects and their instance variables reside in the shared JVM Heap.",
    difficulty: "easy"
  },
  {
    questionId: "java-018",
    question: "What does the Garbage Collector do when an object has no reachable strong references?",
    options: [
      "The object becomes eligible for garbage collection and its memory can be reclaimed",
      "Throws an OutOfMemoryError",
      "Moves it permanently into the Metaspace",
      "Calls System.exit(0)"
    ],
    correctAnswer: 0,
    explanation: "When an object cannot be reached through the root reference graph, the GC reclaims its allocated heap space.",
    difficulty: "easy"
  },
  {
    questionId: "java-019",
    question: "What is method overloading in Java?",
    options: [
      "Methods in the same class having the same name but different parameter lists (type, number, or order)",
      "Redefining a parent class method with identical signature",
      "Calling a method with too many arguments at runtime",
      "Writing a recursive method"
    ],
    correctAnswer: 0,
    explanation: "Overloading allows multiple methods in the same class to share a name as long as their signatures (parameter types/counts) differ.",
    difficulty: "easy"
  },
  {
    questionId: "java-020",
    question: "What is method overriding in Java?",
    options: [
      "A subclass providing a specific implementation of a method already defined in its superclass with the exact same signature and return type",
      "Writing multiple methods with different return types in the same class",
      "Hiding a private method behind an interface",
      "Overloading static methods"
    ],
    correctAnswer: 0,
    explanation: "Overriding enables runtime polymorphism by substituting a superclass method's behavior in a derived class.",
    difficulty: "easy"
  },
  {
    questionId: "java-021",
    question: "What does `super()` do when called inside a subclass constructor?",
    options: [
      "Invokes the constructor of the direct parent class",
      "Creates a new superuser thread",
      "Instantiates the Object class directly",
      "Calls the garbage collector"
    ],
    correctAnswer: 0,
    explanation: "`super()` invokes the parent class constructor and must be the very first statement in the subclass constructor.",
    difficulty: "easy"
  },
  {
    questionId: "java-022",
    question: "Which package is automatically imported into every Java source file without an explicit import statement?",
    options: ["java.util", "java.lang", "java.io", "java.net"],
    correctAnswer: 1,
    explanation: "`java.lang` contains fundamental classes (Object, String, Math, Thread, System) and is implicitly imported everywhere.",
    difficulty: "easy"
  },
  {
    questionId: "java-023",
    question: "What is the return type of a constructor in Java?",
    options: ["void", "Object", "No return type (not even void)", "int"],
    correctAnswer: 2,
    explanation: "Constructors initialize newly created instances and syntactically have no return type specified.",
    difficulty: "easy"
  },
  {
    questionId: "java-024",
    question: "What will `Integer a = 100; Integer b = 100; System.out.println(a == b);` output?",
    options: ["true", "false", "NullPointerException", "Compilation error"],
    correctAnswer: 0,
    explanation: "Java caches Integer objects in the range -128 to 127, so autoboxed 100 returns the identical cached instance, making `a == b` true.",
    difficulty: "medium"
  },
  {
    questionId: "java-025",
    question: "What will `Integer a = 200; Integer b = 200; System.out.println(a == b);` output?",
    options: ["true", "false", "NullPointerException", "Compilation error"],
    correctAnswer: 1,
    explanation: "200 is outside the default IntegerCache (-128 to 127), so two distinct Integer objects are allocated on the heap, making `==` false.",
    difficulty: "medium"
  },
  {
    questionId: "java-026",
    question: "What is the purpose of the `Optional<T>` class in Java 8?",
    options: [
      "To provide a container object which may or may not contain a non-null value, mitigating NullPointerExceptions",
      "To optimize database connection pools",
      "To replace the boolean data type",
      "To run functions optionally in separate threads"
    ],
    correctAnswer: 0,
    explanation: "`Optional` encourages explicit handling of presence or absence of a value without relying on unsafe `null` checks.",
    difficulty: "easy"
  },
  {
    questionId: "java-027",
    question: "What is the difference between `StringBuffer` and `StringBuilder`?",
    options: [
      "`StringBuffer` methods are synchronized (thread-safe); `StringBuilder` is not synchronized and therefore faster",
      "`StringBuilder` is immutable; `StringBuffer` is mutable",
      "`StringBuffer` was introduced in Java 11; `StringBuilder` in Java 1.0",
      "There is no difference"
    ],
    correctAnswer: 0,
    explanation: "`StringBuilder` is preferred for single-threaded string manipulations because it avoids method synchronization overhead.",
    difficulty: "easy"
  },
  {
    questionId: "java-028",
    question: "What is the result of dividing an integer by zero (`10 / 0`) in Java?",
    options: ["Infinity", "NaN", "ArithmeticException is thrown", "0"],
    correctAnswer: 2,
    explanation: "Integer division by zero throws a runtime `java.lang.ArithmeticException: / by zero`.",
    difficulty: "easy"
  },
  {
    questionId: "java-029",
    question: "What is the result of dividing a floating-point number by zero (`10.0 / 0.0`) in Java?",
    options: ["ArithmeticException", "Infinity", "NaN", "0.0"],
    correctAnswer: 1,
    explanation: "IEEE 754 floating-point division by zero evaluates to `Double.POSITIVE_INFINITY` without throwing an exception.",
    difficulty: "medium"
  },
  {
    questionId: "java-030",
    question: "Which method in the `Object` class is used for inter-thread communication to wake up a waiting thread?",
    options: ["sleep()", "yield()", "notify()", "resume()"],
    correctAnswer: 2,
    explanation: "`notify()` and `notifyAll()` awaken threads waiting on the target object's monitor.",
    difficulty: "medium"
  },
  {
    questionId: "java-031",
    question: "What does the `transient` keyword signify when applied to a class field?",
    options: [
      "The field should not be serialized during Java object serialization",
      "The field is stored on the GPU",
      "The field cannot be read by other packages",
      "The field value changes randomly"
    ],
    correctAnswer: 0,
    explanation: "`transient` signals the serialization mechanism to skip the member variable during object state serialization.",
    difficulty: "medium"
  },
  {
    questionId: "java-032",
    question: "Which of the following classes implements the `Set` interface and maintains insertion order?",
    options: ["HashSet", "TreeSet", "LinkedHashSet", "ConcurrentSkipListSet"],
    correctAnswer: 2,
    explanation: "`LinkedHashSet` uses a doubly-linked list through all elements to preserve the exact order in which elements were inserted.",
    difficulty: "easy"
  },
  {
    questionId: "java-033",
    question: "What does `TreeSet` use to order its elements?",
    options: [
      "Natural ordering (`Comparable`) or a custom provided `Comparator`",
      "Insertion timestamp",
      "Memory hash codes",
      "Alphabetical byte order exclusively"
    ],
    correctAnswer: 0,
    explanation: "`TreeSet` is backed by a Red-Black tree (`TreeMap`) and sorts keys according to their natural ordering or a supplied comparator.",
    difficulty: "easy"
  },
  {
    questionId: "java-034",
    question: "What happens when you compile Java code containing generics?",
    options: [
      "The JVM creates separate bytecode classes for each generic type argument (reification)",
      "Type erasure removes generic type annotations at compile-time, inserting casts where necessary for backwards compatibility",
      "Generics are executed via an interpreted script engine",
      "Generics are translated into C++ template structures"
    ],
    correctAnswer: 1,
    explanation: "Type Erasure discards type parameters after verification, ensuring binary compatibility with older pre-generic bytecode.",
    difficulty: "hard"
  },
  {
    questionId: "java-035",
    question: "What does `System.gc()` do in Java?",
    options: [
      "Guarantees that the garbage collector will run immediately and synchronously",
      "Suggests to the JVM that it might be a good time to run garbage collection, with no guarantee",
      "Terminates all active threads",
      "Clears all static variables"
    ],
    correctAnswer: 1,
    explanation: "`System.gc()` merely hints to the JVM runtime that it should expend effort toward recycling unused objects.",
    difficulty: "easy"
  },
  {
    questionId: "java-036",
    question: "Which Stream intermediate operation in Java transforms each element into another object or Stream and flattens the result?",
    options: ["map()", "filter()", "flatMap()", "reduce()"],
    correctAnswer: 2,
    explanation: "`flatMap` applies a function returning a stream for each element and combines all resulting streams into one flat stream.",
    difficulty: "medium"
  },
  {
    questionId: "java-037",
    question: "What is the output of `\"Java\".substring(1, 3)`?",
    options: ["'av'", "'ava'", "'Jav'", "'a'"],
    correctAnswer: 0,
    explanation: "`substring(start, end)` is inclusive of start (1='a') and exclusive of end (3='a'), yielding `'av'`.",
    difficulty: "easy"
  },
  {
    questionId: "java-038",
    question: "What does the access modifier `protected` permit?",
    options: [
      "Access within the same package and subclasses in any package",
      "Access only within the exact same class",
      "Access from anywhere globally",
      "Access only within subclasses in the same package"
    ],
    correctAnswer: 0,
    explanation: "`protected` members are accessible to classes in the same package and any subclass in any package.",
    difficulty: "easy"
  },
  {
    questionId: "java-039",
    question: "Which Java 14+ feature provides concise, immutable data carrier classes with auto-generated constructor, getters, equals, and hashCode?",
    options: ["Records", "Structs", "Data Classes", "Sealed Interfaces"],
    correctAnswer: 0,
    explanation: "`record Point(int x, int y) {}` creates an immutable data transparent carrier with boilerplate automatically generated by javac.",
    difficulty: "medium"
  },
  {
    questionId: "java-040",
    question: "What is the difference between `final`, `finally`, and `finalize()` in Java?",
    options: [
      "`final` is a keyword/modifier; `finally` is a block following try-catch; `finalize()` is a deprecated method on Object invoked before GC",
      "`finally` creates constant variables; `final` is for exception handling",
      "They are synonyms in modern Java",
      "`finalize()` is the class constructor"
    ],
    correctAnswer: 0,
    explanation: "`final` prevents changes/overriding, `finally` executes cleanup after try/catch, and `finalize()` was Object's cleanup method (deprecated in Java 9).",
    difficulty: "easy"
  },
  {
    questionId: "java-041",
    question: "Can an abstract class have a constructor in Java?",
    options: [
      "No, abstract classes cannot have constructors because they cannot be instantiated",
      "Yes, called via `super()` by subclass constructors to initialize inherited fields",
      "Only if the constructor is private",
      "Only in Java 17+"
    ],
    correctAnswer: 1,
    explanation: "Abstract classes have constructors to initialize their state, invoked when derived class instances are instantiated.",
    difficulty: "medium"
  },
  {
    questionId: "java-042",
    question: "What is the purpose of the `java.util.concurrent.ExecutorService`?",
    options: [
      "Manages a thread pool and provides methods to submit and execute asynchronous tasks",
      "Compiles Java code at runtime",
      "Handles JDBC database transactions",
      "Performs filesystem backups"
    ],
    correctAnswer: 0,
    explanation: "`ExecutorService` decouples task submission from thread management and lifecycle control.",
    difficulty: "easy"
  },
  {
    questionId: "java-043",
    question: "What is the size of an `int` primitive in Java regardless of underlying OS architecture?",
    options: ["16 bits (2 bytes)", "32 bits (4 bytes)", "64 bits (8 bytes)", "Varies depending on 32-bit or 64-bit CPU"],
    correctAnswer: 1,
    explanation: "To uphold 'Write Once, Run Anywhere', Java strictly defines `int` as a signed two's complement 32-bit integer on all platforms.",
    difficulty: "easy"
  },
  {
    questionId: "java-044",
    question: "What does `String.intern()` do?",
    options: [
      "Returns a canonical representation for the string from the String Constant Pool",
      "Translates the string into international unicode",
      "Compresses the string using UTF-8",
      "Encrypts the string"
    ],
    correctAnswer: 0,
    explanation: "If the pool already contains an equal string, the pooled instance is returned; otherwise, this String is added to the pool.",
    difficulty: "medium"
  },
  {
    questionId: "java-045",
    question: "Which of the following is true regarding Java's diamond operator `<>` introduced in Java 7?",
    options: [
      "Enables type inference for generic instance creation, e.g., `List<String> list = new ArrayList<>();`",
      "Solves the diamond problem of multiple inheritance",
      "Replaces the ternary operator",
      "Declares multidimensional arrays"
    ],
    correctAnswer: 0,
    explanation: "The diamond operator allows the compiler to infer constructor type arguments from variable declaration context.",
    difficulty: "easy"
  },
  {
    questionId: "java-046",
    question: "What is a Deadlock in Java multithreading?",
    options: [
      "A situation where two or more threads are blocked forever, each waiting for a lock held by the other",
      "A thread terminated by an unhandled exception",
      "A memory leak caused by static references",
      "When the garbage collector freezes application threads"
    ],
    correctAnswer: 0,
    explanation: "Deadlock occurs when concurrent threads acquire multiple locks in circular wait order and cannot proceed.",
    difficulty: "easy"
  },
  {
    questionId: "java-047",
    question: "What is the Metaspace in Java 8+?",
    options: [
      "Native memory area used for class metadata that replaced the old PermGen",
      "A space where garbage collection is disabled",
      "The memory area reserved for JavaFX graphics",
      "A cloud database connection manager"
    ],
    correctAnswer: 0,
    explanation: "Metaspace replaced PermGen in Java 8 and resides in native OS memory rather than contiguous heap, resizing dynamically.",
    difficulty: "hard"
  },
  {
    questionId: "java-048",
    question: "What does the `java.util.Objects.requireNonNull(obj)` method do?",
    options: [
      "Checks that the specified object reference is not null and throws NullPointerException if it is",
      "Allocates heap space for an uninitialized object",
      "Converts null to an empty string",
      "Prevents object serialization"
    ],
    correctAnswer: 0,
    explanation: "It performs validation on method parameters, throwing a descriptive NPE immediately if null.",
    difficulty: "easy"
  },
  {
    questionId: "java-049",
    question: "What will `System.out.println(5 == 5.0);` output in Java?",
    options: ["true", "false", "Compilation error", "ClassCastException"],
    correctAnswer: 0,
    explanation: "The integer 5 is widened to double 5.0 (primitive numeric promotion), yielding `5.0 == 5.0`, which evaluates to `true`.",
    difficulty: "medium"
  },
  {
    questionId: "java-050",
    question: "What is the new feature introduced in Java 21 for lightweight, scalable concurrency?",
    options: ["Virtual Threads (Project Loom)", "Async/Await keywords", "Goroutines", "Web Workers"],
    correctAnswer: 0,
    explanation: "Virtual Threads in Java 21 are lightweight threads managed by the JVM that drastically reduce the overhead of running millions of concurrent tasks.",
    difficulty: "medium"
  }
];

fs.writeFileSync(
  path.join(questionsDir, 'python.json'),
  JSON.stringify(pythonQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated python.json (50 questions)');

fs.writeFileSync(
  path.join(questionsDir, 'java.json'),
  JSON.stringify(javaQuestions, null, 2),
  'utf-8'
);
console.log('✅ Generated java.json (50 questions)');
