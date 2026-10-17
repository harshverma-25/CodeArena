import 'dotenv/config';
import mongoose from 'mongoose';
import { seedSubjectQuestions } from './seed-helper.js';

const OS_QUESTIONS = [
  {
    questionId: "os-001",
    question: "What is the core component of an Operating System that manages system resources and hardware interaction?",
    options: ["Shell", "Kernel", "BIOS", "Compiler"],
    correctAnswer: 1,
    explanation: "The Kernel is the central core of an operating system with complete control over everything in the system.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-002",
    question: "What is a program in execution called in an operating system?",
    options: ["Instruction", "Process", "Thread", "Interrupt"],
    correctAnswer: 1,
    explanation: "A process is an active program in execution including its program counter, registers, and memory variables.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-003",
    question: "What is a lightweight process that shares the same address space and memory with other units in the same process?",
    options: ["Kernel", "Thread", "Semaphore", "Daemon"],
    correctAnswer: 1,
    explanation: "A thread is the smallest unit of CPU execution, sharing code, data, and resources with peer threads in a process.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-004",
    question: "What situation occurs when two or more processes are unable to proceed because each is waiting for the other to release a resource?",
    options: ["Starvation", "Deadlock", "Thrashing", "Paging"],
    correctAnswer: 1,
    explanation: "Deadlock occurs when processes are permanently blocked because each holds resources needed by the others.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-005",
    question: "Which of the following is NOT one of Coffman's four necessary conditions for a deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption of resources allowed", "Circular Wait"],
    correctAnswer: 2,
    explanation: "The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-006",
    question: "Which CPU scheduling algorithm allocates CPU time to processes in equal time slices or 'quanta'?",
    options: ["First-Come, First-Served (FCFS)", "Round Robin (RR)", "Shortest Job First (SJF)", "Priority Scheduling"],
    correctAnswer: 1,
    explanation: "Round Robin assigns a fixed time quantum to each ready process in cyclic order.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-007",
    question: "What memory management scheme allows the execution of processes that may not be completely in physical RAM?",
    options: ["Swapping", "Virtual Memory", "Overlays", "Contiguous allocation"],
    correctAnswer: 1,
    explanation: "Virtual Memory uses secondary storage (swap/pagefile) as an extension of physical RAM.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-008",
    question: "What condition occurs when a system spends more time moving pages between RAM and disk than executing instructions?",
    options: ["Deadlock", "Thrashing", "Fragmentation", "Starvation"],
    correctAnswer: 1,
    explanation: "Thrashing occurs when memory is overcommitted and the OS constantly swaps pages back and forth.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-009",
    question: "What hardware component translates virtual addresses into physical addresses?",
    options: ["ALU", "Memory Management Unit (MMU)", "Control Unit", "BIOS"],
    correctAnswer: 1,
    explanation: "The MMU (Memory Management Unit) handles virtual-to-physical address translation at the hardware level.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-010",
    question: "What signal from hardware or software notifies the CPU that an event requires immediate attention?",
    options: ["Semaphore", "Interrupt", "Deadlock", "Quantum"],
    correctAnswer: 1,
    explanation: "An Interrupt alerts the processor to pause its current task and execute an Interrupt Service Routine (ISR).",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-011",
    question: "In Unix/Linux, which system call is used to create an identical child process?",
    options: ["exec()", "fork()", "wait()", "clone()"],
    correctAnswer: 1,
    explanation: "The fork() system call creates a new process by duplicating the calling parent process.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-012",
    question: "What synchronization tool was introduced by Edsger Dijkstra to control access to shared resources?",
    options: ["Pipeline", "Semaphore", "Mutex lock", "Monitor"],
    correctAnswer: 1,
    explanation: "A Semaphore is an integer variable accessed only through atomic wait (P) and signal (V) operations.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-013",
    question: "What algorithm is used in operating systems for deadlock avoidance?",
    options: ["Round Robin Algorithm", "Banker's Algorithm", "Dijkstra's Shortest Path", "Kruskal's Algorithm"],
    correctAnswer: 1,
    explanation: "The Banker's Algorithm checks if granting a resource request leaves the system in a safe state.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-014",
    question: "What is the critical section in concurrent programming?",
    options: ["The boot sector of a hard drive", "A segment of code accessing shared resources that must not be accessed concurrently by multiple processes", "The kernel space memory", "The hardware cooling unit"],
    correctAnswer: 1,
    explanation: "A critical section accesses shared resources that require mutual exclusion to prevent race conditions.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-015",
    question: "What is the term for switching the CPU from one process to another, saving the state of the old process and loading the state of the new one?",
    options: ["Spooling", "Context Switching", "Paging", "Pipelining"],
    correctAnswer: 1,
    explanation: "Context switching stores the PCB state of the running process and restores the next ready process.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-016",
    question: "What data structure does the operating system maintain for each process to track its state, registers, and memory?",
    options: ["Process Control Block (PCB)", "File Allocation Table (FAT)", "Page Directory", "Interrupt Vector Table"],
    correctAnswer: 0,
    explanation: "The PCB (Process Control Block) contains all execution context information for an individual process.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-017",
    question: "What page replacement algorithm replaces the page that has not been accessed for the longest period of time?",
    options: ["First-In, First-Out (FIFO)", "Least Recently Used (LRU)", "Optimal (OPT)", "Least Frequently Used (LFU)"],
    correctAnswer: 1,
    explanation: "LRU page replacement replaces the page that hasn't been referenced for the longest past interval.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-018",
    question: "What phenomenon in FIFO page replacement causes the number of page faults to increase even when the number of allocated frames increases?",
    options: ["Dijkstra's Anomaly", "Belady's Anomaly", "Amdahl's Law", "Conway's Law"],
    correctAnswer: 1,
    explanation: "Belady's Anomaly demonstrates that increasing page frames can paradoxically increase FIFO page faults.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-019",
    question: "What type of fragmentation occurs when memory is allocated in fixed-size blocks and a process leaves unused space inside its allocated block?",
    options: ["External Fragmentation", "Internal Fragmentation", "Dynamic Fragmentation", "Virtual Fragmentation"],
    correctAnswer: 1,
    explanation: "Internal fragmentation is wasted memory within an allocated partition or page frame.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-020",
    question: "What type of fragmentation occurs when total free memory is sufficient to satisfy a request, but the memory is not contiguous?",
    options: ["Internal Fragmentation", "External Fragmentation", "Page Fault", "Thrashing"],
    correctAnswer: 1,
    explanation: "External fragmentation occurs when free memory is broken into many small scattered blocks.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-021",
    question: "What is Spooling in operating systems?",
    options: ["Simultaneous Peripheral Operations On-Line", "Sequential Program Operating On Linux", "System Process Optimization Over LAN", "Shared Partition Organization On Loops"],
    correctAnswer: 0,
    explanation: "SPOOLing puts data into a buffer/temporary storage for slow peripheral devices like printers.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-022",
    question: "What is a major advantage of a Microkernel architecture over a Monolithic kernel?",
    options: ["Faster raw execution speed", "Higher modularity, fault isolation, and maintainability", "Includes all drivers inside kernel mode", "Requires no RAM"],
    correctAnswer: 1,
    explanation: "Microkernels keep only minimal core services in kernel space, moving drivers and servers to user space.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-023",
    question: "What mode does the CPU operate in when executing operating system kernel code?",
    options: ["User Mode", "Kernel Mode (Privileged / Supervisor Mode)", "Safe Mode", "Virtual Mode"],
    correctAnswer: 1,
    explanation: "Kernel mode provides full, uninhibited access to all hardware and memory instructions.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-024",
    question: "What mechanism is used by user-space applications to safely request services from the operating system kernel?",
    options: ["Function pointer", "System Call (syscall)", "Network socket", "Interrupt Vector"],
    correctAnswer: 1,
    explanation: "System calls provide the programmatic interface between a running program and the OS kernel.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-025",
    question: "What is a Zombie Process in Unix/Linux?",
    options: ["A process that runs forever", "A process that has finished execution but still has an entry in the process table waiting for its parent to read its exit status", "A process created by malware", "A process running without memory"],
    correctAnswer: 1,
    explanation: "A zombie process has terminated but retains an entry in the process table until the parent calls wait().",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-026",
    question: "What is an Orphan Process in Unix/Linux?",
    options: ["A process whose parent process terminated before it did", "A process that has no thread", "A process that cannot be killed", "A process with no PID"],
    correctAnswer: 0,
    explanation: "When a parent process terminates, its surviving child processes become orphans and are adopted by 'init' (PID 1).",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-027",
    question: "What is the Process ID (PID) of the very first user-space process created during Linux boot?",
    options: ["0", "1", "100", "1024"],
    correctAnswer: 1,
    explanation: "PID 1 is the 'init' or 'systemd' process, ancestor to all other processes on a Linux system.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-028",
    question: "Which disk scheduling algorithm services requests closest to the current head position?",
    options: ["FCFS", "Shortest Seek Time First (SSTF)", "SCAN (Elevator)", "LOOK"],
    correctAnswer: 1,
    explanation: "SSTF selects the disk I/O request with the minimum seek time from the current head position.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-029",
    question: "What is the SCAN disk scheduling algorithm also commonly known as?",
    options: ["Circular Algorithm", "Elevator Algorithm", "First In First Out", "Priority Algorithm"],
    correctAnswer: 1,
    explanation: "The SCAN algorithm sweeps back and forth across disk tracks like an elevator servicing building floors.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-030",
    question: "What is a Mutex in concurrent programming?",
    options: ["A mutual exclusion locking mechanism allowing only one thread to access a resource at a time", "A multi-processor CPU", "A file compression format", "A memory swap space"],
    correctAnswer: 0,
    explanation: "A Mutex (Mutual Exclusion) lock allows only the single owning thread to access the critical section.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-031",
    question: "What is the difference between a Preemptive and Non-Preemptive scheduling algorithm?",
    options: [
      "Non-preemptive allows the OS to forcibly interrupt a running process",
      "Preemptive allows the OS to interrupt a running process; non-preemptive lets the process hold the CPU until it yields or terminates",
      "Preemptive only works on single-core processors",
      "There is no difference"
    ],
    correctAnswer: 1,
    explanation: "Preemptive scheduling can interrupt running processes to give CPU time to higher-priority tasks.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-032",
    question: "What problem arises when low-priority processes wait indefinitely for CPU time due to a continuous stream of higher-priority processes?",
    options: ["Deadlock", "Starvation", "Thrashing", "Paging"],
    correctAnswer: 1,
    explanation: "Starvation occurs when a process is perpetually denied necessary resources like CPU time.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-033",
    question: "What technique gradually increases the priority of processes that wait in the ready queue for a long time to prevent starvation?",
    options: ["Paging", "Aging", "Throttling", "Buffering"],
    correctAnswer: 1,
    explanation: "Aging gradually increases process priority over time, ensuring low-priority jobs eventually run.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-034",
    question: "What is a Page Fault in an operating system?",
    options: ["A hardware RAM failure", "An interrupt raised when a program accesses a memory page not currently mapped in physical RAM", "A corrupt file on disk", "A bad sector in storage"],
    correctAnswer: 1,
    explanation: "A page fault triggers the OS to fetch the required page from secondary storage into physical RAM.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-035",
    question: "What high-speed hardware cache in the MMU stores recent translations of virtual addresses to physical addresses?",
    options: ["L1 Cache", "Translation Lookaside Buffer (TLB)", "RAM Buffer", "Register File"],
    correctAnswer: 1,
    explanation: "The TLB (Translation Lookaside Buffer) caches page table mappings for fast virtual-to-physical address lookup.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-036",
    question: "What is the purpose of the BIOS/UEFI during computer startup?",
    options: ["Run web browser", "Initialize hardware components and load the OS bootloader into memory", "Manage swap partitions", "Scan for computer viruses"],
    correctAnswer: 1,
    explanation: "BIOS/UEFI tests hardware via POST (Power-On Self-Test) and hands over control to the bootloader.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-037",
    question: "What file system is standard in modern Microsoft Windows operating systems?",
    options: ["FAT32", "NTFS", "ext4", "APFS"],
    correctAnswer: 1,
    explanation: "NTFS (New Technology File System) is the primary default file system for Windows.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-038",
    question: "What file system is standard in most modern Linux distributions?",
    options: ["NTFS", "ext4", "FAT16", "HFS+"],
    correctAnswer: 1,
    explanation: "ext4 (Fourth Extended Filesystem) is the standard journaling file system in Linux.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-039",
    question: "What is an Inode in Unix/Linux file systems?",
    options: ["A data block containing file content", "A data structure that stores metadata about a file (size, permissions, owner, block locations)", "An internet network node", "A shell script interpreter"],
    correctAnswer: 1,
    explanation: "An Inode stores all metadata for a file or directory except its filename and raw content.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-040",
    question: "Which command in Linux displays currently active processes and dynamic resource usage in real time?",
    options: ["ls", "top", "pwd", "chmod"],
    correctAnswer: 1,
    explanation: "The 'top' (or 'htop') command provides a real-time dynamic view of running system processes.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-041",
    question: "Which Linux command is used to terminate or signal a running process by its PID?",
    options: ["stop", "kill", "exit", "halt"],
    correctAnswer: 1,
    explanation: "The 'kill' command sends signals (such as SIGTERM or SIGKILL) to terminate processes.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-042",
    question: "What signal number corresponds to SIGKILL (unconditional, uncatchable termination) in Linux?",
    options: ["1", "9", "15", "0"],
    correctAnswer: 1,
    explanation: "Signal 9 (SIGKILL) forces immediate process termination and cannot be caught or ignored.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-043",
    question: "What is RAID 0 in storage systems?",
    options: ["Mirroring for redundancy", "Striping across disks for performance without fault tolerance", "Parity-based redundancy", "Dual-parity storage"],
    correctAnswer: 1,
    explanation: "RAID 0 stripes data across multiple disks to boost read/write speed, but provides no data redundancy.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-044",
    question: "What is RAID 1 in storage systems?",
    options: ["Striping", "Disk Mirroring (exact copy of data across drives)", "Striping with distributed parity", "Dedicated parity disk"],
    correctAnswer: 1,
    explanation: "RAID 1 creates an exact duplicate mirror of data across two or more disks for redundancy.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-045",
    question: "What is RAID 5 in storage systems?",
    options: ["Striping with distributed parity across at least 3 disks", "Mirroring only", "No parity striping", "Nested striping"],
    correctAnswer: 0,
    explanation: "RAID 5 combines block-level striping with distributed parity, tolerating the failure of one drive.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-046",
    question: "What is a Race Condition in concurrent programming?",
    options: ["A race between two CPU cores for power", "An undesirable situation where the output depends on the non-deterministic timing or order of thread execution", "A network bandwidth contest", "A rapid cache hit"],
    correctAnswer: 1,
    explanation: "Race conditions occur when multiple threads access shared data concurrently and the outcome depends on thread timing.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-047",
    question: "What is Virtual Memory Paging?",
    options: ["Breaking memory into fixed-sized blocks called pages (virtual) and frames (physical)", "Breaking memory into variable-sized logical segments", "Sending alert beeps to system administrators", "Printing terminal outputs"],
    correctAnswer: 0,
    explanation: "Paging divides virtual memory into fixed-size pages and physical memory into matching frames.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-048",
    question: "What is the typical page size in most modern 32-bit and 64-bit operating systems?",
    options: ["512 bytes", "4 KB", "64 KB", "1 MB"],
    correctAnswer: 1,
    explanation: "4 Kilobytes (4096 bytes) is the standard base memory page size on x86 architectures.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-049",
    question: "What is a Daemon in Unix/Linux operating systems?",
    options: ["A malicious malware virus", "A background process that runs continuously without direct user interaction", "A broken kernel module", "A root user account"],
    correctAnswer: 1,
    explanation: "Daemons (often ending in 'd', like sshd, httpd) run in the background to handle system services.",
    difficulty: "easy",
    topic: "Operating Systems"
  },
  {
    questionId: "os-050",
    question: "What open-source operating system kernel was created by Linus Torvalds in 1991?",
    options: ["Unix", "Linux", "BSD", "MINIX"],
    correctAnswer: 1,
    explanation: "Linus Torvalds released the first version of the Linux kernel in 1991 as a free, open-source project.",
    difficulty: "easy",
    topic: "Operating Systems"
  }
];

const CN_QUESTIONS = [
  {
    questionId: "cn-001",
    question: "How many layers are in the OSI (Open Systems Interconnection) reference model?",
    options: ["4", "5", "7", "9"],
    correctAnswer: 2,
    explanation: "The OSI model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-002",
    question: "Which layer of the OSI model is responsible for routing packets across different networks?",
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
    correctAnswer: 1,
    explanation: "The Network Layer (Layer 3) handles logical IP addressing, packet forwarding, and path determination/routing.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-003",
    question: "What does TCP stand for in computer networking?",
    options: ["Transmission Control Protocol", "Transfer Communication Path", "Terminal Connection Protocol", "Telecom Control Process"],
    correctAnswer: 0,
    explanation: "TCP stands for Transmission Control Protocol, providing reliable, ordered delivery of byte streams.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-004",
    question: "What is the primary difference between TCP and UDP?",
    options: [
      "TCP is connectionless and unreliable; UDP is connection-oriented and reliable",
      "TCP is connection-oriented and guarantees delivery; UDP is connectionless and faster without delivery guarantee",
      "TCP is used only for video; UDP is used for web pages",
      "TCP works on Layer 1; UDP works on Layer 7"
    ],
    correctAnswer: 1,
    explanation: "TCP uses a 3-way handshake and retransmission to ensure delivery; UDP sends datagrams without establishing a connection.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-005",
    question: "What does IP stand for in network terminology?",
    options: ["Internet Protocol", "Internal Path", "Interconnection Port", "Interface Program"],
    correctAnswer: 0,
    explanation: "IP stands for Internet Protocol, the principal protocol for routing packets across network boundaries.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-006",
    question: "How many bits are used in an IPv4 address?",
    options: ["16 bits", "32 bits", "64 bits", "128 bits"],
    correctAnswer: 1,
    explanation: "An IPv4 address is 32 bits (4 bytes) long, represented as four decimal octets (e.g., 192.168.1.1).",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-007",
    question: "How many bits are used in an IPv6 address?",
    options: ["32 bits", "64 bits", "128 bits", "256 bits"],
    correctAnswer: 2,
    explanation: "An IPv6 address is 128 bits (16 bytes) long, represented in hexadecimal groups separated by colons.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-008",
    question: "What is the standard loopback IP address for localhost in IPv4?",
    options: ["192.168.0.1", "127.0.0.1", "10.0.0.1", "0.0.0.0"],
    correctAnswer: 1,
    explanation: "127.0.0.1 is the standard IPv4 loopback address referring to the local host machine.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-009",
    question: "What protocol translates human-readable domain names (like www.google.com) into numerical IP addresses?",
    options: ["DHCP", "DNS (Domain Name System)", "ARP", "BGP"],
    correctAnswer: 1,
    explanation: "DNS translates domain names into IP addresses so browsers can connect to internet servers.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-010",
    question: "What is the default port number for unencrypted HTTP web traffic?",
    options: ["21", "22", "80", "443"],
    correctAnswer: 2,
    explanation: "Port 80 is the default TCP port for unencrypted Hypertext Transfer Protocol (HTTP) traffic.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-011",
    question: "What is the default port number for encrypted HTTPS web traffic?",
    options: ["80", "443", "8080", "25"],
    correctAnswer: 1,
    explanation: "Port 443 is the standard TCP port for secure HTTPS web communication encrypted with TLS/SSL.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-012",
    question: "What is the default port used by Secure Shell (SSH)?",
    options: ["20", "22", "23", "53"],
    correctAnswer: 1,
    explanation: "Port 22 is the standard TCP port assigned to the SSH (Secure Shell) protocol.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-013",
    question: "What is the default port used by the Domain Name System (DNS)?",
    options: ["25", "53", "67", "110"],
    correctAnswer: 1,
    explanation: "Port 53 (using both UDP and TCP) is assigned to DNS queries and zone transfers.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-014",
    question: "What does MAC address stand for in hardware networking?",
    options: ["Master Access Code", "Media Access Control", "Main Address Channel", "Machine Authentication Card"],
    correctAnswer: 1,
    explanation: "MAC (Media Access Control) address is a unique 48-bit physical identifier assigned to a Network Interface Card (NIC).",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-015",
    question: "What protocol is used to map an IP address to a physical MAC address on a local network?",
    options: ["DNS", "ARP (Address Resolution Protocol)", "DHCP", "ICMP"],
    correctAnswer: 1,
    explanation: "ARP (Address Resolution Protocol) resolves a known logical IP address to its corresponding physical MAC address.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-016",
    question: "What protocol dynamically assigns IP addresses, subnet masks, and default gateways to client devices automatically?",
    options: ["DNS", "DHCP (Dynamic Host Configuration Protocol)", "SNMP", "NTP"],
    correctAnswer: 1,
    explanation: "DHCP automatically distributes network configuration parameters to client devices upon connection.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-017",
    question: "What utility command uses ICMP Echo Request and Echo Reply messages to test network reachability to a host?",
    options: ["traceroute", "ping", "netstat", "ipconfig"],
    correctAnswer: 1,
    explanation: "The 'ping' tool tests latency and packet loss to a destination host using ICMP.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-018",
    question: "What are the three packets exchanged during a standard TCP Three-Way Handshake to establish a connection?",
    options: ["GET, POST, ACK", "SYN, SYN-ACK, ACK", "CONNECT, ACCEPT, READY", "HELLO, WELCOME, START"],
    correctAnswer: 1,
    explanation: "A TCP connection is established using: 1) Client sends SYN, 2) Server responds SYN-ACK, 3) Client sends ACK.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-019",
    question: "Which network device operates at Layer 2 (Data Link) and forwards frames based on hardware MAC addresses?",
    options: ["Hub", "Switch", "Router", "Modem"],
    correctAnswer: 1,
    explanation: "A network switch inspects MAC addresses in Layer 2 frames to direct traffic specifically to destination ports.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-020",
    question: "Which network device operates at Layer 3 (Network Layer) and connects different networks by routing IP packets?",
    options: ["Switch", "Router", "Repeater", "Bridge"],
    correctAnswer: 1,
    explanation: "A router forwards data packets between separate computer networks based on IP routing tables.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-021",
    question: "What legacy device simply broadcasts all incoming data packets out to every other connected port at Layer 1?",
    options: ["Switch", "Hub", "Router", "Gateway"],
    correctAnswer: 1,
    explanation: "A dumb network hub retransmits incoming electrical signals across all ports without filtering.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-022",
    question: "What does LAN stand for in computer networks?",
    options: ["Local Area Network", "Logical Access Node", "Large Array Network", "Line Allocation Network"],
    correctAnswer: 0,
    explanation: "LAN (Local Area Network) connects computers within a limited geographical area like a home, school, or office.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-023",
    question: "What does WAN stand for in computer networks?",
    options: ["Wide Area Network", "Wireless Access Node", "Web Area Network", "World Allocation Network"],
    correctAnswer: 0,
    explanation: "WAN (Wide Area Network) spans large geographical distances (the Internet is the largest example).",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-024",
    question: "What topology connects all devices to a single central central hub or switch?",
    options: ["Bus Topology", "Star Topology", "Ring Topology", "Mesh Topology"],
    correctAnswer: 1,
    explanation: "In a Star topology, all network nodes connect individually to a central switch or hub.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-025",
    question: "What topology provides every device with a dedicated point-to-point link to every other device in the network?",
    options: ["Star", "Mesh Topology", "Bus", "Ring"],
    correctAnswer: 1,
    explanation: "A full Mesh topology provides redundant links between every pair of nodes, offering maximum fault tolerance.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-026",
    question: "What does NAT stand for in networking?",
    options: ["Network Address Translation", "Node Access Table", "Network Allocation Timing", "Name Authentication Tool"],
    correctAnswer: 0,
    explanation: "NAT (Network Address Translation) remaps private local IP addresses to a public IP address on the router.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-027",
    question: "Which of the following is a private IPv4 address range defined in RFC 1918?",
    options: ["192.168.0.0 - 192.168.255.255", "8.8.8.8", "1.1.1.1", "172.33.0.0"],
    correctAnswer: 0,
    explanation: "192.168.0.0/16, 10.0.0.0/8, and 172.16.0.0/12 are reserved for private internal networks.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-028",
    question: "What does FTP stand for?",
    options: ["File Transfer Protocol", "Fast Transmission Path", "Folder Transport Process", "Fiber Transfer Protocol"],
    correctAnswer: 0,
    explanation: "FTP (File Transfer Protocol) is a standard protocol used for transferring files between client and server.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-029",
    question: "What protocol is used to send outgoing email from client to server or between mail servers?",
    options: ["POP3", "SMTP (Simple Mail Transfer Protocol)", "IMAP", "HTTP"],
    correctAnswer: 1,
    explanation: "SMTP (Simple Mail Transfer Protocol, port 25/587) handles the sending and relaying of email messages.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-030",
    question: "What protocol allows email clients to retrieve messages from a mail server while keeping emails synchronized on the server?",
    options: ["SMTP", "IMAP (Internet Message Access Protocol)", "POP3", "FTP"],
    correctAnswer: 1,
    explanation: "IMAP keeps emails synchronized across multiple devices on the central mail server.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-031",
    question: "What command-line tool traces the exact path and router hops packets take across the Internet to reach a destination host?",
    options: ["traceroute (or tracert)", "ping", "netstat", "nslookup"],
    correctAnswer: 0,
    explanation: "'traceroute' lists every intermediate router hop and round-trip time by incrementing the IP packet's TTL value.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-032",
    question: "What field in an IPv4 header prevents packets from endlessly circulating in a routing loop by decrementing at each hop?",
    options: ["Checksum", "Time To Live (TTL)", "Sequence Number", "Payload Length"],
    correctAnswer: 1,
    explanation: "Each router decrements the TTL by 1; when it reaches 0, the packet is discarded and an ICMP Time Exceeded is returned.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-033",
    question: "What protocol operates at the Data Link layer using CSMA/CD to detect packet collisions on legacy wired bus networks?",
    options: ["Token Ring", "Ethernet", "FDDI", "ATM"],
    correctAnswer: 1,
    explanation: "Ethernet used CSMA/CD (Carrier Sense Multiple Access with Collision Detection) on shared media.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-034",
    question: "What does Wi-Fi stand for according to IEEE 802.11 standards?",
    options: ["Wireless Fidelity", "Wide Field Interface", "Wired Fiber Integration", "Wireless Frequency Interconnect"],
    correctAnswer: 0,
    explanation: "Wi-Fi is a brand name for wireless local area network technology conforming to IEEE 802.11 standards.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-035",
    question: "What wireless security encryption protocol is considered the modern gold standard for Wi-Fi networks?",
    options: ["WEP", "WPA3", "WPA1", "TKIP"],
    correctAnswer: 1,
    explanation: "WPA3 (Wi-Fi Protected Access 3) provides the strongest modern encryption and protection against brute-force attacks.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-036",
    question: "What does VPN stand for?",
    options: ["Virtual Private Network", "Variable Protocol Node", "Visual Packet Network", "Verified Port Number"],
    correctAnswer: 0,
    explanation: "A VPN (Virtual Private Network) encrypts internet traffic and tunnels it securely through an external server.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-037",
    question: "What security device monitors incoming and outgoing network traffic and blocks unauthorized access based on defined rules?",
    options: ["Modem", "Firewall", "Repeater", "Hub"],
    correctAnswer: 1,
    explanation: "A Firewall acts as a barrier between a trusted internal network and untrusted outside networks like the Internet.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-038",
    question: "What type of attack floods a network server with a massive volume of illegitimate traffic to make it unavailable to legitimate users?",
    options: ["Phishing", "Denial-of-Service / DDoS (Distributed Denial of Service)", "Man-in-the-Middle", "SQL Injection"],
    correctAnswer: 1,
    explanation: "A DDoS attack uses botnets to overwhelm target bandwidth and server resources.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-039",
    question: "What network transmission mode allows data to flow in both directions simultaneously (like a telephone conversation)?",
    options: ["Simplex", "Half-Duplex", "Full-Duplex", "Multiplex"],
    correctAnswer: 2,
    explanation: "Full-Duplex communication allows simultaneous two-way transmission (unlike walkie-talkies which are half-duplex).",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-040",
    question: "What transmission mode allows data to flow in only one direction ever (like a television broadcast)?",
    options: ["Simplex", "Half-Duplex", "Full-Duplex", "Duplex"],
    correctAnswer: 0,
    explanation: "Simplex mode is strictly unidirectional, sending data from transmitter to receiver only.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-041",
    question: "What physical cable uses pulses of light traveling through glass fibers to transmit data at extremely high speeds?",
    options: ["Coaxial Cable", "Fiber Optic Cable", "Unshielded Twisted Pair (UTP)", "Shielded Twisted Pair (STP)"],
    correctAnswer: 1,
    explanation: "Fiber Optic cables use total internal reflection of light waves, providing immense bandwidth over long distances.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-042",
    question: "What standard connector is used on the ends of Cat5e and Cat6 Ethernet cables?",
    options: ["RJ-11", "RJ-45", "BNC", "USB-C"],
    correctAnswer: 1,
    explanation: "RJ-45 (Registered Jack 45) is an 8-pin connector standard for twisted-pair Ethernet cabling.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-043",
    question: "What is the Maximum Transmission Unit (MTU) size for standard Ethernet frames?",
    options: ["512 bytes", "1500 bytes", "4096 bytes", "9000 bytes"],
    correctAnswer: 1,
    explanation: "The default standard Ethernet MTU is 1500 bytes (frames larger than this are termed jumbo frames).",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-044",
    question: "What subnet mask corresponds to a standard Class C network (/24 in CIDR notation)?",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    correctAnswer: 2,
    explanation: "A /24 subnet mask is 255.255.255.0, dedicating 24 bits to the network ID and 8 bits to host IDs (254 usable hosts).",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-045",
    question: "What exterior gateway routing protocol is the foundational routing backbone of the entire global Internet?",
    options: ["RIP", "OSPF", "BGP (Border Gateway Protocol)", "EIGRP"],
    correctAnswer: 2,
    explanation: "BGP (Border Gateway Protocol) makes routing decisions between autonomous systems (AS) on the global Internet.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-046",
    question: "What network protocol is used by network administrators to monitor and manage network devices like switches and routers?",
    options: ["SNMP (Simple Network Management Protocol)", "NTP", "SMTP", "LDAP"],
    correctAnswer: 0,
    explanation: "SNMP collects device health metrics, CPU loads, and bandwidth statistics across network hardware.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-047",
    question: "What protocol synchronizes clock times of computers and network equipment to within milliseconds of UTC?",
    options: ["SNMP", "NTP (Network Time Protocol)", "DNS", "DHCP"],
    correctAnswer: 1,
    explanation: "NTP (Network Time Protocol) synchronizes system clocks over packet-switched networks.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-048",
    question: "What error-detection technique appends calculated remainder bits to a data block to detect corrupted bits in transmission?",
    options: ["Parity Bit", "Cyclic Redundancy Check (CRC)", "Hamming Code", "Checksum"],
    correctAnswer: 1,
    explanation: "CRC uses polynomial division to detect transmission errors in Ethernet frames.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-049",
    question: "What does CDN stand for in web delivery architecture?",
    options: ["Content Delivery Network", "Central Domain Node", "Core Data Network", "Client Download Node"],
    correctAnswer: 0,
    explanation: "A CDN (Content Delivery Network) caches static web content across geographically distributed servers close to users.",
    difficulty: "easy",
    topic: "Computer Networks"
  },
  {
    questionId: "cn-050",
    question: "What communication architectural pattern forms the foundation of the World Wide Web?",
    options: ["Peer-to-Peer", "Client-Server Architecture", "Master-Slave", "Monolithic"],
    correctAnswer: 1,
    explanation: "The web operates primarily on a Client-Server model where web browsers request resources from web servers.",
    difficulty: "easy",
    topic: "Computer Networks"
  }
];

const OOP_QUESTIONS = [
  {
    questionId: "oop-001",
    question: "What are the four fundamental pillars of Object-Oriented Programming (OOP)?",
    options: [
      "Compilation, Interpretation, Linking, Loading",
      "Encapsulation, Abstraction, Inheritance, Polymorphism",
      "Functions, Variables, Arrays, Pointers",
      "Classes, Methods, Modules, Packages"
    ],
    correctAnswer: 1,
    explanation: "The four core pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-002",
    question: "What OOP principle bundles data (attributes) and methods that manipulate that data into a single unit while restricting direct access to internal components?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    correctAnswer: 1,
    explanation: "Encapsulation bundles data and methods together and hides internal state using private variables and public getters/setters.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-003",
    question: "What OOP principle focuses on showing only the essential features of an object while hiding the complex background implementation details?",
    options: ["Inheritance", "Abstraction", "Overloading", "Coupling"],
    correctAnswer: 1,
    explanation: "Abstraction displays essential functionality to the user while concealing the internal mechanics (e.g., driving a car without knowing engine mechanics).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-004",
    question: "What OOP mechanism allows a new class (derived/subclass) to inherit fields and methods from an existing class (base/superclass)?",
    options: ["Polymorphism", "Inheritance", "Encapsulation", "Overloading"],
    correctAnswer: 1,
    explanation: "Inheritance promotes code reuse by allowing a child class to inherit attributes and behaviors from a parent class.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-005",
    question: "What does the word 'Polymorphism' literally mean in computer science?",
    options: ["Single form", "Many forms", "Without form", "Hidden form"],
    correctAnswer: 1,
    explanation: "Derived from Greek, Polymorphism means 'many forms' — the ability of an object or method to behave differently in different contexts.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-006",
    question: "What is an instance of a class in OOP called?",
    options: ["Function", "Object", "Variable", "Module"],
    correctAnswer: 1,
    explanation: "An object is a specific runtime instance created from a class blueprint.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-007",
    question: "What special method is automatically invoked when a new object instance of a class is created?",
    options: ["Destructor", "Constructor", "Initializer", "Static Method"],
    correctAnswer: 1,
    explanation: "A constructor is automatically called when memory is allocated for an object using the 'new' keyword.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-008",
    question: "What special method is called when an object goes out of scope or is deleted to release allocated system resources?",
    options: ["Constructor", "Destructor", "Finalizer", "Garbage Collector"],
    correctAnswer: 1,
    explanation: "A destructor deallocates memory and cleans up resources when an object is destroyed.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-009",
    question: "What is Method Overloading (Compile-Time Polymorphism)?",
    options: [
      "Defining multiple methods in the same class with the same name but different parameter lists",
      "Redefining a parent class method in a child class with identical parameters",
      "Overloading the CPU with too many functions",
      "Deleting methods from a class"
    ],
    correctAnswer: 0,
    explanation: "Method Overloading features multiple methods sharing the same name but differing in number, type, or order of parameters.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-010",
    question: "What is Method Overriding (Run-Time Polymorphism)?",
    options: [
      "Defining methods with different names",
      "Providing a specific implementation in a child class for a method already defined in its parent class with the exact same signature",
      "Calling a method inside another method",
      "Deleting variables at runtime"
    ],
    correctAnswer: 1,
    explanation: "Method Overriding allows a subclass to provide a specific implementation of a method defined in its superclass.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-011",
    question: "Which access modifier restricts the visibility of members so they can only be accessed within the class they are declared in?",
    options: ["public", "private", "protected", "default"],
    correctAnswer: 1,
    explanation: "'private' members are accessible only within the declaring class, preventing external access.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-012",
    question: "Which access modifier makes members accessible from anywhere within any class or package?",
    options: ["private", "public", "protected", "sealed"],
    correctAnswer: 1,
    explanation: "'public' members have no access restrictions and can be invoked from any other code.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-013",
    question: "Which access modifier makes members accessible within the same class, subclasses (inheritance), and often the same package?",
    options: ["private", "protected", "public", "internal"],
    correctAnswer: 1,
    explanation: "'protected' allows derived classes to access parent members while keeping them hidden from general outside classes.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-014",
    question: "What is a class that cannot be directly instantiated and can contain both abstract methods (without bodies) and concrete methods called?",
    options: ["Interface", "Abstract Class", "Static Class", "Final Class"],
    correctAnswer: 1,
    explanation: "An Abstract Class serves as a base blueprint for subclasses and cannot be instantiated directly with 'new'.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-015",
    question: "What is a contract in OOP that defines a set of method signatures that implementing classes must define, supporting multiple inheritance?",
    options: ["Interface", "Abstract Class", "Virtual Table", "Module"],
    correctAnswer: 0,
    explanation: "An Interface defines purely what a class must do without dictating how, enabling polymorphism and multiple inheritance.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-016",
    question: "What keyword in Java and C++ refers to the current invoking instance of a class?",
    options: ["self", "this", "super", "current"],
    correctAnswer: 1,
    explanation: "The 'this' keyword refers to the current object instance within its methods.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-017",
    question: "What keyword in Java is used to refer to or call the immediate parent class's constructor or methods?",
    options: ["parent", "super", "base", "root"],
    correctAnswer: 1,
    explanation: "'super' is used in Java to access members and constructors of the parent class.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-018",
    question: "What keyword in C# is used to refer to the base/parent class?",
    options: ["super", "base", "parent", "this"],
    correctAnswer: 1,
    explanation: "In C#, the 'base' keyword is used to access base class constructors and methods.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-019",
    question: "What is a class member keyword that belongs to the class itself rather than to individual object instances?",
    options: ["virtual", "static", "volatile", "dynamic"],
    correctAnswer: 1,
    explanation: "'static' variables and methods are shared across all instances of a class and can be called without creating an object.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-020",
    question: "What keyword in Java prevents a variable from being re-assigned, a method from being overridden, or a class from being inherited?",
    options: ["const", "final", "static", "sealed"],
    correctAnswer: 1,
    explanation: "'final' in Java creates constants, prevents method overriding, and prohibits class subclassing.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-021",
    question: "What is the problem in C++ where a class inherits from two classes that both inherit from a single common base class called?",
    options: ["Multiple Inheritance Trap", "Diamond Problem", "Circular Dependency", "Deadlock"],
    correctAnswer: 1,
    explanation: "The Diamond Problem causes ambiguity over which parent method is inherited, solved in C++ using virtual inheritance.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-022",
    question: "Why does Java NOT support multiple inheritance through classes?",
    options: ["Java compilers are too slow", "To avoid complexity and ambiguity such as the Diamond Problem", "Memory restrictions", "Java has no classes"],
    correctAnswer: 1,
    explanation: "Java disallows multiple class inheritance to prevent ambiguity, allowing multiple inheritance through interfaces instead.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-023",
    question: "What design principle suggests that classes should prefer composition (has-a) over inheritance (is-a)?",
    options: ["Composition over Inheritance", "Single Responsibility", "Open/Closed Principle", "DRY Principle"],
    correctAnswer: 0,
    explanation: "'Favor object composition over class inheritance' provides greater flexibility and looser coupling.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-024",
    question: "What does an 'is-a' relationship represent in object-oriented design?",
    options: ["Composition", "Inheritance", "Aggregation", "Encapsulation"],
    correctAnswer: 1,
    explanation: "An 'is-a' relationship represents inheritance (e.g., a Dog 'is-a' Mammal).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-025",
    question: "What does a 'has-a' relationship represent in object-oriented design?",
    options: ["Inheritance", "Composition / Aggregation", "Polymorphism", "Abstraction"],
    correctAnswer: 1,
    explanation: "A 'has-a' relationship represents composition or containment (e.g., a Car 'has-an' Engine).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-026",
    question: "What is a Pure Virtual Function in C++?",
    options: ["A function with no name", "A virtual function declared with '= 0' that has no implementation in the base class", "A function that executes in GPU", "A private destructor"],
    correctAnswer: 1,
    explanation: "A pure virtual function (e.g. `virtual void draw() = 0;`) makes the containing class an abstract class.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-027",
    question: "What data structure does C++ use behind the scenes to resolve dynamic binding for virtual functions at runtime?",
    options: ["Virtual Table (vtable) and vptr", "Binary Search Tree", "Linked List", "Hash Table"],
    correctAnswer: 0,
    explanation: "The vtable (virtual method table) is an array of function pointers used to dispatch virtual functions dynamically.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-028",
    question: "What design pattern guarantees that a class has only one single instance throughout the application and provides global access to it?",
    options: ["Factory Pattern", "Singleton Pattern", "Observer Pattern", "Adapter Pattern"],
    correctAnswer: 1,
    explanation: "The Singleton Pattern restricts class instantiation to a single global instance.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-029",
    question: "What design pattern defines a one-to-many dependency where when one object changes state, all its dependents are automatically notified?",
    options: ["Observer Pattern", "Singleton Pattern", "Strategy Pattern", "Decorator Pattern"],
    correctAnswer: 0,
    explanation: "The Observer Pattern is widely used in event-driven programming (such as listeners and reactive state).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-030",
    question: "What design pattern creates objects without exposing the exact instantiation logic to the client, using a factory method?",
    options: ["Factory Method Pattern", "Prototype Pattern", "Builder Pattern", "Proxy Pattern"],
    correctAnswer: 0,
    explanation: "The Factory Pattern delegates the creation of specific objects to subclasses or specialized methods.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-031",
    question: "What does the 'S' stand for in the SOLID principles of object-oriented design?",
    options: ["Static Principle", "Single Responsibility Principle", "System Optimization", "Security Protocol"],
    correctAnswer: 1,
    explanation: "Single Responsibility states that a class should have one, and only one, reason to change.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-032",
    question: "What does the 'O' stand for in the SOLID principles?",
    options: ["Object Principle", "Open/Closed Principle", "Order Allocation", "Output Redirection"],
    correctAnswer: 1,
    explanation: "Open/Closed Principle states that software entities should be open for extension, but closed for modification.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-033",
    question: "What does the 'L' stand for in the SOLID principles?",
    options: ["Linear Principle", "Liskov Substitution Principle", "Late Binding", "Lazy Evaluation"],
    correctAnswer: 1,
    explanation: "Liskov Substitution Principle states that derived classes must be substitutable for their base classes without breaking behavior.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-034",
    question: "What does the 'I' stand for in the SOLID principles?",
    options: ["Inheritance Principle", "Interface Segregation Principle", "Initialization Rule", "Immutable State"],
    correctAnswer: 1,
    explanation: "Interface Segregation states that clients should not be forced to depend on interfaces they do not use.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-035",
    question: "What does the 'D' stand for in the SOLID principles?",
    options: ["Dynamic Dispatch", "Dependency Inversion Principle", "Destructor Design", "Data Encapsulation"],
    correctAnswer: 1,
    explanation: "Dependency Inversion states that high-level modules should depend on abstractions, not on concrete low-level details.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-036",
    question: "What is an association where the lifetime of the contained child object depends strictly on the parent (if the parent is destroyed, the child is destroyed)?",
    options: ["Aggregation", "Composition", "Generalization", "Specialization"],
    correctAnswer: 1,
    explanation: "Composition is a strong 'has-a' relationship where the component cannot exist independently of the owner.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-037",
    question: "What is an association where child objects can exist independently of the parent object (e.g. Students in a Classroom)?",
    options: ["Composition", "Aggregation", "Encapsulation", "Polymorphism"],
    correctAnswer: 1,
    explanation: "Aggregation is a weak 'has-a' relationship where child entities possess independent lifecycles.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-038",
    question: "What automatic memory management feature in Java and C# automatically reclaims memory occupied by unreachable objects?",
    options: ["Manual deallocation", "Garbage Collection (GC)", "Destructor Call", "Memory Swapper"],
    correctAnswer: 1,
    explanation: "The Garbage Collector periodically scans the heap and frees memory occupied by dereferenced objects.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-039",
    question: "What is Early (Static) Binding in programming?",
    options: [
      "Connecting a method call to its method body at compile time",
      "Resolving method calls at runtime",
      "Binding memory at system boot",
      "Loading external libraries"
    ],
    correctAnswer: 0,
    explanation: "Early binding binds the method call during compilation (e.g., overloaded methods, non-virtual methods).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-040",
    question: "What is Late (Dynamic) Binding in programming?",
    options: [
      "Connecting a method call to its implementation at runtime based on the actual object type",
      "Compiling code after running it",
      "Binding variables after shutdown",
      "Resolving errors in the linker"
    ],
    correctAnswer: 0,
    explanation: "Late binding defers method resolution to runtime (essential for method overriding and virtual functions).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-041",
    question: "What is a Copy Constructor in C++?",
    options: ["A constructor that takes no parameters", "A constructor that initializes a new object using an existing object of the same class", "A constructor that duplicates a class file", "A constructor written in assembly"],
    correctAnswer: 1,
    explanation: "A copy constructor initializes an object using another object of the same class (e.g., `ClassName(const ClassName &obj)`).",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-042",
    question: "What type of copy duplicates only the top-level pointer references rather than the actual underlying allocated memory?",
    options: ["Deep Copy", "Shallow Copy", "Atomic Copy", "Virtual Copy"],
    correctAnswer: 1,
    explanation: "A shallow copy copies pointer values, causing both objects to point to the exact same memory buffer.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-043",
    question: "What type of copy allocates completely fresh independent memory and replicates all nested data values?",
    options: ["Shallow Copy", "Deep Copy", "Reference Copy", "Alias Copy"],
    correctAnswer: 1,
    explanation: "A deep copy creates fully independent duplicates of all pointed-to objects and memory buffers.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-044",
    question: "What is the ultimate root base class of all classes in Java?",
    options: ["System", "Object", "Class", "Base"],
    correctAnswer: 1,
    explanation: "`java.lang.Object` sits at the top of the class hierarchy in Java; every class implicitly inherits from it.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-045",
    question: "Which keyword in Python is passed as the first parameter to instance methods to refer to the current object instance?",
    options: ["this", "self", "me", "cls"],
    correctAnswer: 1,
    explanation: "By convention, Python uses `self` as the explicit first parameter of instance methods.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-046",
    question: "What is the constructor method named in a Python class?",
    options: ["__construct__", "__init__", "__new__", "__start__"],
    correctAnswer: 1,
    explanation: "The `__init__()` method acts as the initializer/constructor for newly instantiated Python objects.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-047",
    question: "What term describes the degree of interdependence between software modules (low/loose is desirable)?",
    options: ["Cohesion", "Coupling", "Encapsulation", "Polymorphism"],
    correctAnswer: 1,
    explanation: "Coupling measures how closely connected modules are; loose coupling is a premier design goal.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-048",
    question: "What term describes how focused and closely related the responsibilities of a single class or module are (high is desirable)?",
    options: ["Coupling", "Cohesion", "Inheritance", "Modularity"],
    correctAnswer: 1,
    explanation: "Cohesion measures how focused a module's internal responsibilities are; high cohesion is desirable.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-049",
    question: "What type of class in C++ grants non-member functions or other classes access to its private and protected members?",
    options: ["Virtual Class", "Friend Class / Function", "Static Class", "Sealed Class"],
    correctAnswer: 1,
    explanation: "Declaring a `friend class` in C++ explicitly permits that class to access private and protected members.",
    difficulty: "easy",
    topic: "OOP Concepts"
  },
  {
    questionId: "oop-050",
    question: "What computer language developed in the 1960s by Ole-Johan Dahl and Kristen Nygaard is widely regarded as the first object-oriented language?",
    options: ["Smalltalk", "Simula 67", "C++", "Java"],
    correctAnswer: 1,
    explanation: "Simula 67 introduced classes, objects, inheritance, and subclasses for the first time in computer history.",
    difficulty: "easy",
    topic: "OOP Concepts"
  }
];

const HTML_CSS_QUESTIONS = [
  {
    questionId: "html-css-001",
    question: "What does HTML stand for in web development?",
    options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyperlink Text Management List", "Home Tool Markup Language"],
    correctAnswer: 0,
    explanation: "HTML stands for HyperText Markup Language, the standard markup language for creating web pages.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-002",
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax", "Colorful Style System"],
    correctAnswer: 1,
    explanation: "CSS stands for Cascading Style Sheets, used to describe the presentation and layout of HTML documents.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-003",
    question: "What is the standard declaration placed at the very top of an HTML5 document?",
    options: ["<!DOCTYPE html>", "<html5>", "<doctype xml>", "<header version=\"5\">"],
    correctAnswer: 0,
    explanation: "<!DOCTYPE html> is the clean, standard declaration that tells browsers to render in HTML5 standards mode.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-004",
    question: "Which HTML tag is used to define a hyperlink to another web page?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    explanation: "The <a> (anchor) tag, paired with the 'href' attribute, creates clickable hyperlinks.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-005",
    question: "Which HTML attribute specifies the destination URL of a hyperlink in an <a> tag?",
    options: ["src", "href", "link", "target"],
    correctAnswer: 1,
    explanation: "The 'href' (hypertext reference) attribute specifies the target URL.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-006",
    question: "Which HTML tag is used to embed an image into a web page?",
    options: ["<image>", "<img>", "<pic>", "<src>"],
    correctAnswer: 1,
    explanation: "The <img> self-closing tag embeds an image using 'src' and 'alt' attributes.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-007",
    question: "Which attribute provides alternative text for screen readers and when an image fails to load?",
    options: ["title", "alt", "desc", "caption"],
    correctAnswer: 1,
    explanation: "The 'alt' attribute provides an accessible text description of the image.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-008",
    question: "What are the four components of the standard CSS Box Model, starting from the inside out?",
    options: [
      "Content, Border, Padding, Margin",
      "Content, Padding, Border, Margin",
      "Margin, Border, Padding, Content",
      "Padding, Content, Margin, Border"
    ],
    correctAnswer: 1,
    explanation: "From inside out: Content -> Padding (clears around content) -> Border -> Margin (clears outside border).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-009",
    question: "What CSS property and value ensures that padding and borders are included in an element's total width and height?",
    options: ["box-sizing: content-box", "box-sizing: border-box", "display: flex", "overflow: hidden"],
    correctAnswer: 1,
    explanation: "'box-sizing: border-box' calculates element width including content, padding, and borders.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-010",
    question: "Which HTML heading tag represents the highest and most important heading on a page?",
    options: ["<heading>", "<h1>", "<h6>", "<header>"],
    correctAnswer: 1,
    explanation: "<h1> is the top-level heading in HTML hierarchy, while <h6> is the lowest.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-011",
    question: "Which HTML tag is used to create an unordered bulleted list?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    correctAnswer: 1,
    explanation: "<ul> defines an unordered (bulleted) list, while <ol> defines an ordered (numbered) list.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-012",
    question: "Which HTML tag defines individual list items inside either a <ul> or <ol> list?",
    options: ["<item>", "<li>", "<it>", "<ul>"],
    correctAnswer: 1,
    explanation: "<li> (list item) contains individual items within both ordered and unordered lists.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-013",
    question: "Which CSS property is used to change the background color of an element?",
    options: ["color", "background-color", "bg-color", "fill"],
    correctAnswer: 1,
    explanation: "'background-color' sets the background color of an element in CSS.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-014",
    question: "Which CSS property is used to change the color of text in an element?",
    options: ["text-color", "color", "font-color", "text-fill"],
    correctAnswer: 1,
    explanation: "The 'color' property sets the foreground color of text in CSS.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-015",
    question: "Which CSS property controls the size of text fonts?",
    options: ["text-size", "font-size", "size", "font-weight"],
    correctAnswer: 1,
    explanation: "'font-size' specifies the dimension of text fonts (e.g. 16px, 1.5rem).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-016",
    question: "Which CSS selector targets an element with the id 'header'?",
    options: [".header", "#header", "*header", "header:"],
    correctAnswer: 1,
    explanation: "In CSS, '#' selects by ID (e.g. #header), while '.' selects by class name (e.g. .header).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-017",
    question: "Which CSS selector targets all elements with the class name 'btn'?",
    options: ["#btn", ".btn", "$btn", "btn()"],
    correctAnswer: 1,
    explanation: "The period prefix ('.') is the class selector in CSS.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-018",
    question: "What is the default display value of a <div> element?",
    options: ["inline", "block", "inline-block", "flex"],
    correctAnswer: 1,
    explanation: "A <div> is a block-level element by default, starting on a new line and occupying the full available width.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-019",
    question: "What is the default display value of a <span> element?",
    options: ["block", "inline", "flex", "grid"],
    correctAnswer: 1,
    explanation: "A <span> is an inline element by default, wrapping only as much width as its content.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-020",
    question: "Which CSS display value enables a one-dimensional layout model for arranging items in rows or columns?",
    options: ["display: block", "display: flex", "display: grid", "display: table"],
    correctAnswer: 1,
    explanation: "Flexbox ('display: flex') is designed for 1-dimensional layouts (either along a row or column).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-021",
    question: "Which Flexbox property aligns items along the main axis (horizontally by default in row layout)?",
    options: ["align-items", "justify-content", "flex-wrap", "align-content"],
    correctAnswer: 1,
    explanation: "'justify-content' aligns flex items along the primary axis (flex-start, center, space-between, etc.).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-022",
    question: "Which Flexbox property aligns items along the cross axis (vertically by default in row layout)?",
    options: ["justify-content", "align-items", "flex-direction", "order"],
    correctAnswer: 1,
    explanation: "'align-items' defines default behavior for how flex items are laid out along the cross axis.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-023",
    question: "What is the default position value of all HTML elements in CSS?",
    options: ["relative", "static", "absolute", "fixed"],
    correctAnswer: 1,
    explanation: "'position: static' is the default value; elements render in the natural document flow.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-024",
    question: "Which CSS position value positions an element relative to the browser viewport, remaining in place when scrolled?",
    options: ["relative", "absolute", "fixed", "static"],
    correctAnswer: 2,
    explanation: "'position: fixed' fixes an element relative to the screen viewport regardless of scrolling.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-025",
    question: "Which CSS position value positions an element relative to its nearest positioned ancestor?",
    options: ["static", "absolute", "fixed", "sticky"],
    correctAnswer: 1,
    explanation: "'position: absolute' removes the element from normal flow, positioning it relative to its closest non-static ancestor.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-026",
    question: "What CSS property controls the stacking order of overlapping positioned elements?",
    options: ["display", "z-index", "layer", "opacity"],
    correctAnswer: 1,
    explanation: "'z-index' specifies the stack level of an element (higher values sit on top of lower values).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-027",
    question: "Which HTML5 semantic tag is used to wrap navigation links on a website?",
    options: ["<navigate>", "<nav>", "<links>", "<menu>"],
    correctAnswer: 1,
    explanation: "<nav> is the HTML5 semantic element dedicated to primary navigational links.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-028",
    question: "Which HTML5 semantic tag represents the independent, self-contained composition of a page (like a blog post)?",
    options: ["<section>", "<article>", "<aside>", "<main>"],
    correctAnswer: 1,
    explanation: "<article> designates independently distributable content such as articles, blog posts, or comments.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-029",
    question: "Which HTML5 semantic tag represents tangentially related content like sidebars or callouts?",
    options: ["<sidebar>", "<aside>", "<section>", "<div>"],
    correctAnswer: 1,
    explanation: "<aside> represents content indirectly related to the main surrounding content (e.g., sidebars).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-030",
    question: "Which HTML5 semantic tag represents the footer of a document or section?",
    options: ["<bottom>", "<footer>", "<end>", "<base>"],
    correctAnswer: 1,
    explanation: "<footer> contains author information, copyright, and related links at the bottom of a section or page.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-031",
    question: "Which HTML tag is used to create a drop-down selection list in a form?",
    options: ["<input type=\"dropdown\">", "<select>", "<datalist>", "<option>"],
    correctAnswer: 1,
    explanation: "<select> paired with nested <option> tags creates a standard drop-down menu.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-032",
    question: "Which HTML input type is used for typing hidden passwords with masked bullets?",
    options: ["<input type=\"text\">", "<input type=\"password\">", "<input type=\"hidden\">", "<input type=\"secure\">"],
    correctAnswer: 1,
    explanation: "<input type=\"password\"> masks typed characters for privacy and security.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-033",
    question: "Which input type creates a group of mutually exclusive options where only one can be selected?",
    options: ["checkbox", "radio", "button", "select"],
    correctAnswer: 1,
    explanation: "<input type=\"radio\"> allows only one choice among inputs sharing the same 'name' attribute.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-034",
    question: "Which input type allows users to select zero, one, or multiple independent choices?",
    options: ["radio", "checkbox", "switch", "toggle"],
    correctAnswer: 1,
    explanation: "<input type=\"checkbox\"> permits multiple independent selections.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-035",
    question: "What CSS pseudo-class styles an element when a user hovers their mouse pointer over it?",
    options: [":focus", ":hover", ":active", ":visited"],
    correctAnswer: 1,
    explanation: "The ':hover' pseudo-class applies styles when the pointer device hovers over an interactive element.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-036",
    question: "What CSS pseudo-class styles an input or button when it is clicked or given keyboard focus?",
    options: [":hover", ":focus", ":target", ":first-child"],
    correctAnswer: 1,
    explanation: "The ':focus' pseudo-class applies when an element receives input focus via tab or click.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-037",
    question: "What CSS at-rule is used to create responsive designs tailored for different screen widths (mobile, tablet, desktop)?",
    options: ["@import", "@media", "@keyframes", "@supports"],
    correctAnswer: 1,
    explanation: "@media queries allow CSS rules to apply conditionally based on device screen sizes and resolutions.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-038",
    question: "Which CSS unit is relative to the font-size of the root <html> element?",
    options: ["em", "rem", "px", "%"],
    correctAnswer: 1,
    explanation: "'rem' (root em) scales relative to the root <html> element's font-size (usually 16px by default).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-039",
    question: "Which CSS unit is relative to 1% of the viewport width?",
    options: ["vh", "vw", "vmin", "rem"],
    correctAnswer: 1,
    explanation: "'1vw' represents 1 percent of the current viewport width.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-040",
    question: "Which CSS property is used to make text bold?",
    options: ["font-style", "font-weight", "text-decoration", "font-variant"],
    correctAnswer: 1,
    explanation: "'font-weight: bold' (or 700) specifies the thickness or boldness of text.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-041",
    question: "Which CSS property is used to underline, strike-through, or remove underlines from text links?",
    options: ["text-align", "text-decoration", "font-style", "text-transform"],
    correctAnswer: 1,
    explanation: "'text-decoration: none' is commonly used to remove default underlines from hyperlinks.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-042",
    question: "Which CSS property changes text to uppercase, lowercase, or capitalized?",
    options: ["font-style", "text-transform", "text-align", "font-variant"],
    correctAnswer: 1,
    explanation: "'text-transform: uppercase' renders text in all capital letters.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-043",
    question: "Which CSS property rounds the corners of an element's outer border edge?",
    options: ["border-round", "border-radius", "corner-radius", "outline-radius"],
    correctAnswer: 1,
    explanation: "'border-radius' adds rounded corners (e.g. 'border-radius: 50%' creates circles).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-044",
    question: "Which CSS property adds shadow effects around an element's frame?",
    options: ["text-shadow", "box-shadow", "filter-shadow", "border-shadow"],
    correctAnswer: 1,
    explanation: "'box-shadow' applies drop-shadows or inner shadows to block elements.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-045",
    question: "What CSS display property enables a two-dimensional grid layout system with rows and columns?",
    options: ["display: flex", "display: grid", "display: table", "display: inline-grid"],
    correctAnswer: 1,
    explanation: "CSS Grid ('display: grid') handles both rows and columns simultaneously in 2D.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-046",
    question: "Which CSS property defines the column track sizes in a CSS Grid container?",
    options: ["grid-template-columns", "grid-column-gap", "grid-auto-flow", "grid-template-rows"],
    correctAnswer: 0,
    explanation: "'grid-template-columns' sets the number and widths of columns (e.g. `repeat(3, 1fr)`).",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-047",
    question: "Which CSS property controls transparency of an element where 0 is fully transparent and 1 is fully opaque?",
    options: ["visibility", "opacity", "display", "alpha"],
    correctAnswer: 1,
    explanation: "'opacity' sets the transparency level of an element and all its children.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-048",
    question: "What is the difference between 'display: none' and 'visibility: hidden' in CSS?",
    options: [
      "'display: none' removes the element entirely from layout; 'visibility: hidden' hides it while preserving its space in the document",
      "'visibility: hidden' deletes the element from the DOM",
      "They are identical",
      "'display: none' only works on mobile devices"
    ],
    correctAnswer: 0,
    explanation: "'display: none' takes up zero space, while 'visibility: hidden' leaves an empty gap where the element was.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-049",
    question: "What CSS property smoothly animates property changes over a specified duration (e.g. background-color on hover)?",
    options: ["animation", "transition", "transform", "keyframe"],
    correctAnswer: 1,
    explanation: "'transition: all 0.3s ease' animates state changes smoothly without needing keyframe definitions.",
    difficulty: "easy",
    topic: "HTML & CSS"
  },
  {
    questionId: "html-css-050",
    question: "What meta tag inside the HTML <head> is required to ensure proper mobile viewport scaling and responsive behavior?",
    options: [
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
      "<meta name=\"responsive\" content=\"true\">",
      "<meta name=\"mobile\" content=\"auto\">",
      "<meta charset=\"UTF-8\">"
    ],
    correctAnswer: 0,
    explanation: "The viewport meta tag instructs mobile browsers to render the page width equal to the device screen width.",
    difficulty: "easy",
    topic: "HTML & CSS"
  }
];

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  await seedSubjectQuestions(
    'computer-science-programming',
    'Computer Science & Programming',
    'operating-systems',
    'Operating Systems',
    'operating-systems.json',
    OS_QUESTIONS
  );

  await seedSubjectQuestions(
    'computer-science-programming',
    'Computer Science & Programming',
    'computer-networks',
    'Computer Networks',
    'computer-networks.json',
    CN_QUESTIONS
  );

  await seedSubjectQuestions(
    'computer-science-programming',
    'Computer Science & Programming',
    'oop-concepts',
    'OOP Concepts',
    'oop-concepts.json',
    OOP_QUESTIONS
  );

  await seedSubjectQuestions(
    'computer-science-programming',
    'Computer Science & Programming',
    'html-css',
    'HTML & CSS',
    'html-css.json',
    HTML_CSS_QUESTIONS
  );

  await mongoose.disconnect();
  console.log('🎉 Category 6 (Computer Science & Programming) completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
