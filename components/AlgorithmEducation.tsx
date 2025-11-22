
import React from 'react';
import { AlgorithmType, DifficultyLevel } from '../types';
import { Clock, Code, CheckCircle, AlertTriangle, Lightbulb, Layers, Network, GitBranch, Box } from 'lucide-react';

interface AlgorithmEducationProps {
  type: AlgorithmType;
  difficulty: DifficultyLevel;
}

const AlgorithmEducation: React.FC<AlgorithmEducationProps> = ({ type, difficulty }) => {
  
  const getContent = () => {
    const commonProps = {
        complexities: [
            { label: 'Access', value: 'O(1)', color: 'text-green-500', note: 'Index based' },
            { label: 'Search', value: 'O(n)', color: 'text-yellow-500', note: 'Linear scan' }
        ],
        pros: ['Simple', 'Standard'],
        cons: ['Basic limitations']
    };

    switch (type) {
        case AlgorithmType.SORTING:
             return {
                title: 'Sorting Algorithms',
                description: 'Arranging data in a specific order (ascending/descending). Key for binary search.',
                tags: ['Divide & Conquer', 'Comparison'],
                complexities: [{ label: 'Quick Sort', value: 'O(n log n)', color: 'text-green-500', note: 'Avg Case' }, { label: 'Bubble Sort', value: 'O(n²)', color: 'text-red-500', note: 'Worst Case' }],
                pros: ['Enables Binary Search', 'Data visualization'],
                cons: ['Computational cost'],
                proTip: 'Use Merge Sort for Linked Lists due to memory access patterns.',
                operations: [], types: []
             };
        case AlgorithmType.STRING:
             return {
                 title: 'String Algorithms',
                 description: 'Strings are arrays of characters. Problems often involve pattern matching, parsing, or two-pointer techniques.',
                 tags: ['Array', 'Two Pointers', 'ASCII'],
                 complexities: [{ label: 'Traversal', value: 'O(n)', color: 'text-green-500', note: 'Length n' }, { label: 'Comparison', value: 'O(n)', color: 'text-yellow-500', note: 'Character by character' }],
                 pros: ['Fundamental to text processing', 'Rich library support'],
                 cons: ['Immutable in some languages (Java/Python)'],
                 proTip: 'For palindrome checks, use Two Pointers (start and end) moving inwards.',
                 operations: [{ name: 'Palindrome Check', code: 'while l < r:\n  if s[l] != s[r]: return False\n  l++, r--' }], types: []
             };
        case AlgorithmType.LINKED_LIST:
             return {
                 title: 'Linked Lists',
                 description: 'A linear collection of nodes where each node points to the next. Non-contiguous memory allocation.',
                 tags: ['Pointers', 'Dynamic Size'],
                 complexities: [{ label: 'Insert Head', value: 'O(1)', color: 'text-green-500', note: 'No shift needed' }, { label: 'Access', value: 'O(n)', color: 'text-red-500', note: 'No random access' }],
                 pros: ['Dynamic size', 'Efficient insertion/deletion at start'],
                 cons: ['Slow lookup (O(n))', 'Extra memory for pointers'],
                 proTip: 'Use "Fast & Slow" pointers to detect cycles or find the middle node.',
                 operations: [{ name: 'Traversal', code: 'curr = head\nwhile curr:\n  print(curr.val)\n  curr = curr.next' }], types: []
             };
        case AlgorithmType.STACK:
             return {
                 title: 'Stack (LIFO)',
                 description: 'Last In, First Out. Think of a stack of plates. Used in recursion management and undo mechanisms.',
                 tags: ['LIFO', 'Recursion'],
                 complexities: [{ label: 'Push', value: 'O(1)', color: 'text-green-500', note: 'Top access' }, { label: 'Pop', value: 'O(1)', color: 'text-green-500', note: 'Top access' }],
                 pros: ['Simple memory management', 'Backtracking support'],
                 cons: ['No random access'],
                 proTip: 'Stacks are implicitly used in Depth First Search (DFS).',
                 operations: [{ name: 'Push', code: 'stack.append(val)' }, { name: 'Pop', code: 'val = stack.pop()' }], types: []
             };
        case AlgorithmType.QUEUE:
             return {
                 title: 'Queue (FIFO)',
                 description: 'First In, First Out. Like a ticket line. Used in task scheduling and BFS.',
                 tags: ['FIFO', 'Scheduling'],
                 complexities: [{ label: 'Enqueue', value: 'O(1)', color: 'text-green-500', note: 'Rear access' }, { label: 'Dequeue', value: 'O(1)', color: 'text-green-500', note: 'Front access' }],
                 pros: ['Fair scheduling', 'Order preservation'],
                 cons: ['No random access'],
                 proTip: 'Use Queues for Breadth First Search (BFS) to explore layer by layer.',
                 operations: [{ name: 'Enqueue', code: 'q.append(val)' }, { name: 'Dequeue', code: 'val = q.pop(0)' }], types: []
             };
        case AlgorithmType.GRAPH:
             return {
                 title: 'Graph Algorithms',
                 description: 'Networks of nodes (vertices) and edges. Models maps, social networks, and dependencies.',
                 tags: ['Network', 'BFS', 'DFS'],
                 complexities: [{ label: 'BFS', value: 'O(V+E)', color: 'text-green-500', note: 'Vertices + Edges' }, { label: 'Dijkstra', value: 'O(E log V)', color: 'text-yellow-500', note: 'Priority Queue' }],
                 pros: ['Models real-world relationships', 'Versatile'],
                 cons: ['Complex implementation', 'High memory for matrix representation'],
                 proTip: 'BFS finds shortest path in unweighted graphs. DFS is better for maze solving or cycle detection.',
                 operations: [{ name: 'BFS', code: 'q = [start]\nvisited = {start}\nwhile q:\n  curr = q.pop(0)\n  for n in adj[curr]:...' }], types: []
             };
        case AlgorithmType.DP:
             return {
                 title: 'Dynamic Programming',
                 description: 'Optimization technique caching results of subproblems (Memoization/Tabulation).',
                 tags: ['Optimization', 'Caching'],
                 complexities: [{ label: 'Fibonacci', value: 'O(n)', color: 'text-green-500', note: 'Linear scan' }, { label: 'Space', value: 'O(n)', color: 'text-yellow-500', note: 'DP Table' }],
                 pros: ['Solves complex overlapping problems', 'Guarantees optimal solution'],
                 cons: ['Memory intensive (Tables)', 'Hard to identify subproblems'],
                 proTip: 'If a problem asks for "max/min" or "number of ways", suspect DP.',
                 operations: [{ name: 'Fibonacci', code: 'dp[i] = dp[i-1] + dp[i-2]' }], types: []
             };
        default:
             return {
                 title: 'Algorithm Concepts',
                 description: 'Select a specific module to see detailed educational content.',
                 tags: ['General'],
                 complexities: [], pros: [], cons: [], operations: [], types: [], proTip: 'Practice makes perfect.'
             };
    }
  };

  const content = getContent();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
       <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Layers className="text-blue-500" /> {content.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {content.tags?.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase">
                    {tag}
                </span>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{content.description}</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Complexity */}
           <div className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2"><Clock size={20} className="text-purple-500"/> Complexity</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {content.complexities?.map((item, i) => (
                       <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                           <div className="flex justify-between mb-1"><span className="text-sm text-gray-500">{item.label}</span><span className={`font-bold ${item.color}`}>{item.value}</span></div>
                           <p className="text-xs text-gray-400">{item.note}</p>
                       </div>
                   ))}
               </div>
           </div>

           {/* Operations */}
           <div className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2"><Code size={20} className="text-blue-500"/> Implementation</h3>
               {content.operations?.map((op, i) => (
                   <div key={i} className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                       <p className="text-gray-400 text-xs font-bold mb-1">{op.name}</p>
                       <pre className="text-blue-300 text-xs font-mono">{op.code}</pre>
                   </div>
               ))}
           </div>
       </div>
       
       {/* Pro Tip */}
       <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-xl flex gap-3">
           <Lightbulb className="text-yellow-600 shrink-0" />
           <div>
               <h4 className="font-bold text-yellow-800 dark:text-yellow-500 text-sm">Expert Tip</h4>
               <p className="text-sm text-yellow-700 dark:text-yellow-400">{content.proTip}</p>
           </div>
       </div>
    </div>
  );
};

export default AlgorithmEducation;
