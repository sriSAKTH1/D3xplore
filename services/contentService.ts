
import { VisualizationModule, AlgorithmType } from '../types';
import { dbService } from './db';

const MODULES_COLLECTION = 'modules';

// Default Seed Data (DSA Roadmap)
const DEFAULT_MODULES: VisualizationModule[] = [
  // --- Phase 1: Foundation Data Structures ---
  {
    id: 'mod-strings',
    title: 'Strings',
    description: 'Frequency tables, pointer movement, substring sliding windows. Topics: Patterns & Validations, Frequency / Hashing, Substrings & Palindrome.',
    baseType: AlgorithmType.STRING,
    icon: 'code',
    difficulty: 'Beginner',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-linkedlist',
    title: 'Linked List',
    description: 'Node linking animation, slow/fast pointer movement. Topics: Singly/Doubly, Cycle Detection.',
    baseType: AlgorithmType.LINKED_LIST,
    icon: 'git-merge',
    difficulty: 'Beginner',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-stack',
    title: 'Stack',
    description: 'Push/Pop operations, expression evaluation animation. Topics: Implementation, Expression Eval.',
    baseType: AlgorithmType.STACK,
    icon: 'layers',
    difficulty: 'Beginner',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-queue',
    title: 'Queue',
    description: 'Front/Rear pointer movement, queue rotation. Topics: Circular Queue, Deque, Priority Queue.',
    baseType: AlgorithmType.QUEUE,
    icon: 'list',
    difficulty: 'Beginner',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },

  // --- Phase 2: Intermediate Concepts ---
  {
    id: 'mod-recursion',
    title: 'Recursion & Backtracking',
    description: 'Recursion tree animation, state snapshots. Topics: Permutations, N-Queens, Maze Path.',
    baseType: AlgorithmType.BACKTRACKING,
    icon: 'git-merge',
    difficulty: 'Intermediate',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-sorting-adv',
    title: 'Advanced Searching & Sorting',
    description: 'Partitioning & merging animations. Topics: Binary Search Patterns, Quick Sort, Merge Sort.',
    baseType: AlgorithmType.SORTING,
    icon: 'cpu',
    difficulty: 'Intermediate',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-trees',
    title: 'Trees',
    description: 'Node hierarchy, DFS & BFS traversal paths. Topics: Height/Diameter, LCA, Tree Views.',
    baseType: AlgorithmType.TREE,
    icon: 'tree',
    difficulty: 'Intermediate',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-bst',
    title: 'Binary Search Tree (BST)',
    description: 'Insert/Delete animation, rotations and balancing. Topics: Search, Validate BST.',
    baseType: AlgorithmType.BST,
    icon: 'tree',
    difficulty: 'Intermediate',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-heaps',
    title: 'Heaps & Priority Queue',
    description: 'Heapify process animation. Topics: Max/Min Heap, k-th Largest/Smallest.',
    baseType: AlgorithmType.HEAP,
    icon: 'layers',
    difficulty: 'Intermediate',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },

  // --- Phase 3: Advanced Structures & Algorithms ---
  {
    id: 'mod-graphs',
    title: 'Graphs',
    description: 'Path traversal, shortest path simulation. Topics: BFS/DFS, Dijkstra, MST, Topological Sort.',
    baseType: AlgorithmType.GRAPH,
    icon: 'network',
    difficulty: 'Advanced',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-tries',
    title: 'Tries',
    description: 'Prefix tree expansion & character path visualization. Topics: Insert, Search, Autocomplete.',
    baseType: AlgorithmType.TRIE,
    icon: 'tree',
    difficulty: 'Intermediate',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-dp',
    title: 'Dynamic Programming (DP)',
    description: 'DP table filling process, recursion to bottom-up transition. Topics: Knapsack, LCS, LIS.',
    baseType: AlgorithmType.DP,
    icon: 'box',
    difficulty: 'Advanced',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },
  {
    id: 'mod-advanced-ds',
    title: 'Advanced Data Structures',
    description: 'Tree segment animation, binary indexing. Topics: Segment Tree, Fenwick Tree, Suffix Tree.',
    baseType: AlgorithmType.ADVANCED,
    icon: 'database',
    difficulty: 'Advanced',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  },

  // --- Final Phase: Competitive & Interview Prep ---
  {
    id: 'mod-patterns',
    title: 'Competitive & Interview Prep',
    description: 'Pointer movement & window framing. Patterns: Sliding Window, Two Pointers, Greedy.',
    baseType: AlgorithmType.PATTERNS,
    icon: 'code',
    difficulty: 'Advanced',
    visualizationType: 'Interactive',
    createdBy: 'System',
    createdAt: Date.now()
  }
];

export const contentService = {
  // In Firestore version, getModules is async. 
  // We will return a promise, components need to await it.
  getModules: async (): Promise<VisualizationModule[]> => {
    const modules = await dbService.getAll(MODULES_COLLECTION);
    // If only system default exists or empty, merge defaults
    // Simple check: if length is 0, populate defaults
    if (modules.length === 0) {
       // Seed defaults
       for (const mod of DEFAULT_MODULES) {
           await dbService.put(MODULES_COLLECTION, mod);
       }
       return DEFAULT_MODULES;
    }
    // Ensure defaults are present if user deleted them or first load
    return modules as VisualizationModule[];
  },

  addModule: async (module: Omit<VisualizationModule, 'id' | 'createdAt'>): Promise<VisualizationModule> => {
    const newModule: VisualizationModule = {
      ...module,
      id: `mod-${Date.now()}`,
      createdAt: Date.now()
    };
    await dbService.put(MODULES_COLLECTION, newModule);
    return newModule;
  },

  updateModule: async (updatedModule: VisualizationModule): Promise<void> => {
    await dbService.put(MODULES_COLLECTION, updatedModule);
  },

  deleteModule: async (id: string) => {
    await dbService.delete(MODULES_COLLECTION, id);
  }
};
