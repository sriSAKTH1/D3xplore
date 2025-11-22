
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AlgorithmType, DifficultyLevel } from '../types';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Settings2, Database, ChevronDown, Wrench, GitMerge, Layers, List, Grid, Info } from 'lucide-react';

interface VisualizerProps {
  type: AlgorithmType;
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

interface HistoryStep {
  data: any; // Flexible for different structures (Array, Node[], Graph)
  indices: number[];
  action: string;
  graphMaxN?: number;
  graphLineIndex?: number;
  description?: string;
  auxiliary?: { [key: string]: string | number };
}

type SortingAlgorithm = 'Bubble' | 'Quick' | 'Merge';
type ArrayOperation = 'Insert' | 'Delete' | 'Search' | 'Update' | 'Prefix Sum' | 'Sliding Window' | 'Two Pointers' | 'Binary Search';

const Visualizer: React.FC<VisualizerProps> = ({ type, difficulty, onDifficultyChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Data State
  const [data, setData] = useState<any>([]);
  const [customInput, setCustomInput] = useState('');
  
  // Animation State
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); 
  
  // Specific States
  const [sortingAlgo, setSortingAlgo] = useState<SortingAlgorithm>('Bubble');
  const [arrayOp, setArrayOp] = useState<ArrayOperation>('Insert');
  const [opValue, setOpValue] = useState<number>(42);
  const [opIndex, setOpIndex] = useState<number>(0);
  const [windowSize, setWindowSize] = useState<number>(3);
  const [targetSum, setTargetSum] = useState<number>(15);

  // --- Generators ---

  const generateBubbleSortHistory = (arr: number[]) => {
    const steps: HistoryStep[] = [];
    const temp = [...arr];
    steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Initial State' });
    let n = temp.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ data: [...temp], indices: [j, j + 1], action: 'compare', description: `Comparing ${temp[j]} > ${temp[j+1]}?` });
        if (temp[j] > temp[j + 1]) {
          const t = temp[j];
          temp[j] = temp[j + 1];
          temp[j + 1] = t;
          steps.push({ data: [...temp], indices: [j, j + 1], action: 'swap', description: 'Swapping elements' });
        }
      }
    }
    steps.push({ data: [...temp], indices: [], action: 'sorted', description: 'Sorting Complete' });
    setHistory(steps);
  };

  const generateQuickSortHistory = (arr: number[]) => {
      const steps: HistoryStep[] = [];
      const temp = [...arr];
      steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Initial State' });
      const partition = (low: number, high: number) => {
        const pivot = temp[high];
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
          steps.push({ data: [...temp], indices: [j, high], action: 'compare', description: `Comparing ${temp[j]} with Pivot ${pivot}` });
          if (temp[j] < pivot) {
            i++;
            [temp[i], temp[j]] = [temp[j], temp[i]];
            steps.push({ data: [...temp], indices: [i, j], action: 'swap', description: `Swapping ${temp[i]} and ${temp[j]}` });
          }
        }
        [temp[i + 1], temp[high]] = [temp[high], temp[i + 1]];
        steps.push({ data: [...temp], indices: [i + 1, high], action: 'swap', description: 'Moving Pivot to correct position' });
        return (i + 1);
      };
      const quickSort = (low: number, high: number) => {
        if (low < high) {
          const pi = partition(low, high);
          quickSort(low, pi - 1);
          quickSort(pi + 1, high);
        }
      };
      quickSort(0, temp.length - 1);
      steps.push({ data: [...temp], indices: [], action: 'sorted', description: 'Sorted' });
      setHistory(steps);
  };

  const generateMergeSortHistory = (arr: number[]) => {
      const steps: HistoryStep[] = [];
      const temp = [...arr];
      steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Initial Array' });
      const merge = (left: number, mid: number, right: number) => {
        const n1 = mid - left + 1;
        const n2 = right - mid;
        const L = new Array(n1);
        const R = new Array(n2);
        for (let i = 0; i < n1; i++) L[i] = temp[left + i];
        for (let j = 0; j < n2; j++) R[j] = temp[mid + 1 + j];
        let i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            steps.push({ data: [...temp], indices: [left + i, mid + 1 + j], action: 'compare', description: `Comparing ${L[i]} and ${R[j]}` });
            if (L[i] <= R[j]) {
                temp[k] = L[i];
                steps.push({ data: [...temp], indices: [k], action: 'overwrite', description: `Overwriting index ${k} with ${L[i]}` });
                i++;
            } else {
                temp[k] = R[j];
                steps.push({ data: [...temp], indices: [k], action: 'overwrite', description: `Overwriting index ${k} with ${R[j]}` });
                j++;
            }
            k++;
        }
        while (i < n1) { temp[k] = L[i]; steps.push({ data: [...temp], indices: [k], action: 'overwrite', description: 'Flushing remaining left elements' }); i++; k++; }
        while (j < n2) { temp[k] = R[j]; steps.push({ data: [...temp], indices: [k], action: 'overwrite', description: 'Flushing remaining right elements' }); j++; k++; }
      };
      const mergeSort = (left: number, right: number) => {
        if(left >= right) return;
        const mid = left + Math.floor((right - left) / 2);
        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        merge(left, mid, right);
      };
      mergeSort(0, temp.length - 1);
      steps.push({ data: [...temp], indices: [], action: 'sorted', description: 'Sorting Complete' });
      setHistory(steps);
  };

  const generateBSTHistory = (arr: number[]) => {
      const steps: HistoryStep[] = [];
      const nodes: number[] = [];
      steps.push({ data: [], indices: [], action: 'idle', description: 'Empty Tree' }); 
      for (let i = 0; i < arr.length; i++) {
        nodes.push(arr[i]);
        steps.push({ data: [...nodes], indices: [i], action: 'insert', description: `Inserting Node ${arr[i]}` });
      }
      setHistory(steps);
  };

  const generateComplexityHistory = () => {
      const steps: HistoryStep[] = [];
      const numLines = 5; 
      for (let lineIdx = 0; lineIdx < numLines; lineIdx++) {
          const complexityName = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'][lineIdx];
          for (let n = 0; n <= 50; n += 1) {
              steps.push({ 
                  data: [], 
                  indices: [], 
                  action: 'graph', 
                  graphMaxN: n, 
                  graphLineIndex: lineIdx,
                  description: `Plotting ${complexityName} growth...`
              });
          }
      }
      // Fix: graphLineIndex should be 4 (0-4), not 5, to avoid out of bounds error
      steps.push({ data: [], indices: [], action: 'graph', graphMaxN: 50, graphLineIndex: 4, description: 'Comparison Complete' });
      setHistory(steps);
  };

  const generateArrayHistory = () => {
      const steps: HistoryStep[] = [];
      const temp = [...data];
      steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Initial Array' });

      if (arrayOp === 'Insert') {
        const idx = Math.max(0, Math.min(temp.length, opIndex));
        for (let i = temp.length - 1; i >= idx; i--) steps.push({ data: [...temp], indices: [i, i+1], action: 'moving', description: `Shifting [${i}] to [${i+1}]` });
        temp.splice(idx, 0, opValue);
        steps.push({ data: [...temp], indices: [idx], action: 'insert', description: `Inserted ${opValue} at index ${idx}` });
      } else if (arrayOp === 'Delete') {
        const idx = Math.max(0, Math.min(temp.length - 1, opIndex));
        if (temp.length > 0) {
            steps.push({ data: [...temp], indices: [idx], action: 'delete', description: `Deleting element at [${idx}]` });
            for (let i = idx; i < temp.length - 1; i++) steps.push({ data: [...temp], indices: [i, i+1], action: 'moving', description: `Shifting [${i+1}] to [${i}]` });
            temp.splice(idx, 1);
            steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Deletion Complete' });
        }
      } else if (arrayOp === 'Search') {
        for (let i = 0; i < temp.length; i++) {
            steps.push({ data: [...temp], indices: [i], action: 'search', description: `Checking index [${i}]: ${temp[i]} == ${opValue}?` });
            if (temp[i] === opValue) {
                steps.push({ data: [...temp], indices: [i], action: 'found', description: `Found ${opValue} at index ${i}!` });
                break;
            }
        }
      } else if (arrayOp === 'Prefix Sum') {
          for (let i = 1; i < temp.length; i++) {
            steps.push({ data: [...temp], indices: [i, i-1], action: 'prefix_sum', description: `Adding arr[${i-1}] (${temp[i-1]}) to arr[${i}] (${temp[i]})` });
            temp[i] = temp[i] + temp[i-1];
            steps.push({ data: [...temp], indices: [i], action: 'update', description: `New value at [${i}] is ${temp[i]}` });
        }
      } else if (arrayOp === 'Sliding Window') {
        const k = Math.max(1, Math.min(temp.length, windowSize));
        let currentSum = 0, maxSum = -Infinity;
        for (let i = 0; i < k; i++) currentSum += temp[i];
        maxSum = currentSum;
        steps.push({ data: [...temp], indices: Array.from({length: k}, (_, idx) => idx), action: 'window', description: `Initial Window [0..${k-1}]. Sum: ${currentSum}`, auxiliary: {'Sum': currentSum, 'Max': maxSum} });
        for (let i = k; i < temp.length; i++) {
            steps.push({ data: [...temp], indices: Array.from({length: k}, (_, idx) => i-k+1+idx), action: 'moving', description: `Sliding window to [${i-k+1}..${i}]` });
            currentSum += temp[i] - temp[i-k];
            maxSum = Math.max(maxSum, currentSum);
            steps.push({ data: [...temp], indices: Array.from({length: k}, (_, idx) => i-k+1+idx), action: 'window', description: `Window Sum: ${currentSum}. Max Sum: ${maxSum}`, auxiliary: {'Sum': currentSum, 'Max': maxSum} });
        }
      } else if (arrayOp === 'Two Pointers') {
          // Target Sum visualization
          // First we need a sorted array for this pattern usually, but let's assume unsorted or auto-sort for demo
          temp.sort((a: number, b: number) => a - b);
          steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Sorted array for Two Pointers' });
          let left = 0, right = temp.length - 1;
          while (left < right) {
              const sum = temp[left] + temp[right];
              steps.push({ data: [...temp], indices: [left, right], action: 'pointers', description: `L:${temp[left]} + R:${temp[right]} = ${sum}. Target: ${targetSum}` });
              if (sum === targetSum) {
                  steps.push({ data: [...temp], indices: [left, right], action: 'found', description: 'Target Found!' });
                  break;
              } else if (sum < targetSum) {
                  steps.push({ data: [...temp], indices: [left], action: 'move_left', description: 'Sum < Target, Move Left Pointer ->' });
                  left++;
              } else {
                  steps.push({ data: [...temp], indices: [right], action: 'move_right', description: 'Sum > Target, Move Right Pointer <-' });
                  right--;
              }
          }
      } else if (arrayOp === 'Binary Search') {
          // Sort array first as Binary Search requires sorted data
          temp.sort((a: number, b: number) => a - b);
          steps.push({ data: [...temp], indices: [], action: 'idle', description: 'Data sorted for Binary Search' });
          
          let low = 0;
          let high = temp.length - 1;
          let found = false;
          
          while (low <= high) {
              const mid = Math.floor((low + high) / 2);
              // Highlight current search range and mid
              steps.push({ 
                  data: [...temp], 
                  indices: [low, mid, high], 
                  action: 'binary_search', 
                  description: `Searching Range [${low}...${high}]. Mid index: ${mid}, Value: ${temp[mid]}`,
                  auxiliary: { 'Low': low, 'Mid': mid, 'High': high }
              });

              if (temp[mid] === opValue) {
                  steps.push({ data: [...temp], indices: [mid], action: 'found', description: `Found ${opValue} at index ${mid}!` });
                  found = true;
                  break;
              } else if (temp[mid] < opValue) {
                  steps.push({ data: [...temp], indices: [mid], action: 'compare', description: `${temp[mid]} < ${opValue}, searching right half` });
                  low = mid + 1;
              } else {
                  steps.push({ data: [...temp], indices: [mid], action: 'compare', description: `${temp[mid]} > ${opValue}, searching left half` });
                  high = mid - 1;
              }
          }
          if (!found) {
              steps.push({ data: [...temp], indices: [], action: 'mismatch', description: `${opValue} not found in array` });
          }
      }
      setHistory(steps);
  };

  const generateStringHistory = (str: string) => {
      const steps: HistoryStep[] = [];
      const arr = str.split('');
      steps.push({ data: arr, indices: [], action: 'idle', description: 'Initial String: ' + str });
      
      let left = 0, right = arr.length - 1;
      let isPalindrome = true;
      while (left < right) {
          steps.push({ data: arr, indices: [left, right], action: 'compare', description: `Comparing '${arr[left]}' and '${arr[right]}'` });
          if (arr[left] !== arr[right]) {
               steps.push({ data: arr, indices: [left, right], action: 'mismatch', description: 'Mismatch! Not a palindrome.' });
               isPalindrome = false;
               break;
          }
          left++; right--;
      }
      if (isPalindrome) {
          steps.push({ data: arr, indices: [], action: 'match', description: 'Palindrome Check Passed!' });
      }
      setHistory(steps);
  };

  const generateLinkedListHistory = (arr: number[]) => {
      const steps: HistoryStep[] = [];
      steps.push({ data: arr, indices: [], action: 'idle', description: 'Linked List Head' });
      for(let i=0; i<arr.length; i++) {
          steps.push({ data: arr, indices: [i], action: 'found', description: `Traversing Node: ${arr[i]}` });
      }
      steps.push({ data: arr, indices: [], action: 'idle', description: 'End of List' });
      setHistory(steps);
  };

  const generateStackHistory = (arr: number[]) => {
      const steps: HistoryStep[] = [];
      let stack: number[] = [];
      steps.push({ data: [], indices: [], action: 'idle', description: 'Empty Stack' });
      for (const val of arr) {
          stack.push(val);
          steps.push({ data: [...stack], indices: [stack.length-1], action: 'insert', description: `Push(${val})` });
      }
      while (stack.length > 0) {
          steps.push({ data: [...stack], indices: [stack.length-1], action: 'delete', description: `Pop() returns ${stack[stack.length-1]}` });
          stack.pop();
          steps.push({ data: [...stack], indices: [], action: 'idle', description: 'Stack State' });
      }
      setHistory(steps);
  };

  const generateQueueHistory = (arr: number[]) => {
      const steps: HistoryStep[] = [];
      let queue: number[] = [];
      steps.push({ data: [], indices: [], action: 'idle', description: 'Empty Queue' });
      for (const val of arr) {
          queue.push(val);
          steps.push({ data: [...queue], indices: [queue.length-1], action: 'insert', description: `Enqueue(${val})` });
      }
      while (queue.length > 0) {
          steps.push({ data: [...queue], indices: [0], action: 'delete', description: `Dequeue() returns ${queue[0]}` });
          queue.shift();
          steps.push({ data: [...queue], indices: [], action: 'idle', description: 'Queue State' });
      }
      setHistory(steps);
  };

  const generateGraphHistory = () => {
      const steps: HistoryStep[] = [];
      const nodes = [0,1,2,3,4,5];
      const links = [{source:0, target:1}, {source:0, target:2}, {source:1, target:3}, {source:2, target:4}, {source:3, target:5}];
      const graphState = { nodes, links };
      
      steps.push({ data: graphState, indices: [], action: 'idle', description: 'Graph Topology' });

      const visited = new Set();
      const queue = [0];
      visited.add(0);
      
      steps.push({ data: graphState, indices: [0], action: 'search', description: 'Starting BFS at Node 0' });

      while(queue.length > 0) {
          const curr = queue.shift()!;
          const neighbors = links.filter(l => l.source === curr || l.target === curr)
                                .map(l => l.source === curr ? l.target : l.source);
          
          for (const neighbor of neighbors) {
              if (!visited.has(neighbor)) {
                  visited.add(neighbor);
                  queue.push(neighbor as number);
                  steps.push({ data: graphState, indices: [neighbor as number], action: 'found', description: `Visiting Neighbor Node ${neighbor}` });
              }
          }
      }
      setHistory(steps);
  };

  const generateDPHistory = () => {
      const steps: HistoryStep[] = [];
      const n = 7; 
      const dp = new Array(n+1).fill(0);
      
      steps.push({ data: [...dp], indices: [], action: 'idle', description: 'DP Array [0..7]' });
      
      dp[0] = 0; steps.push({ data: [...dp], indices: [0], action: 'insert', description: 'Base Case F(0) = 0' });
      dp[1] = 1; steps.push({ data: [...dp], indices: [1], action: 'insert', description: 'Base Case F(1) = 1' });

      for (let i = 2; i <= n; i++) {
          steps.push({ data: [...dp], indices: [i, i-1, i-2], action: 'compare', description: `Computing F(${i}) = F(${i-1}) + F(${i-2})` });
          dp[i] = dp[i-1] + dp[i-2];
          steps.push({ data: [...dp], indices: [i], action: 'update', description: `Stored F(${i}) = ${dp[i]}` });
      }
      setHistory(steps);
  }

  // --- Data Handling ---

  const resetData = () => {
    setIsPlaying(false);
    setStep(0);
    
    let generatedData: any = [];
    if (type === AlgorithmType.STRING) generatedData = "RADAR";
    else if (type === AlgorithmType.GRAPH) generatedData = { nodes: [], links: [] };
    else generatedData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1);

    setData(generatedData);
    generateHistoryForData(generatedData);
  };

  const generateHistoryForData = (d: any) => {
    if (type === AlgorithmType.SORTING) {
        if (sortingAlgo === 'Bubble') generateBubbleSortHistory(d);
        else if (sortingAlgo === 'Quick') generateQuickSortHistory(d);
        else generateMergeSortHistory(d);
    } else if (type === AlgorithmType.BST) generateBSTHistory(d);
    else if (type === AlgorithmType.BASIC) generateComplexityHistory();
    else if (type === AlgorithmType.STRING) generateStringHistory(d as string);
    else if (type === AlgorithmType.LINKED_LIST) generateLinkedListHistory(d as number[]);
    else if (type === AlgorithmType.STACK) generateStackHistory(d as number[]);
    else if (type === AlgorithmType.QUEUE) generateQueueHistory(d as number[]);
    else if (type === AlgorithmType.GRAPH) generateGraphHistory();
    else if (type === AlgorithmType.DP) generateDPHistory();
    else if (type === AlgorithmType.ARRAY) setHistory([{ data: d, indices: [], action: 'idle', description: 'Ready' }]);
  };
  
  const applyCustomInput = () => {
      const arr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (arr.length > 0) {
          setData(arr);
          generateHistoryForData(arr);
      }
  };

  useEffect(() => { resetData(); }, [type, sortingAlgo, difficulty]);

  // --- Animation Loop ---
  useEffect(() => {
    let interval: any;
    if (isPlaying && step < history.length - 1) {
      interval = setInterval(() => {
        setStep(prev => {
            if (prev >= history.length - 1) { setIsPlaying(false); return prev; }
            return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, step, history, speed]);

  // --- D3 Rendering ---
  useEffect(() => {
    if (!svgRef.current || history.length === 0 || !history[step]) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const { width, height } = svgRef.current.parentElement?.getBoundingClientRect() || { width: 800, height: 600 };
    const currentStep = history[step];
    const currentData = currentStep.data;
    const { indices, action } = currentStep;

    // Helper for colors - Centralized Color Logic
    const getTextFill = (isHighlighted: boolean) => isHighlighted ? 'white' : 'black';
    const getRectFill = (isHighlighted: boolean, actionType: string) => {
        if (!isHighlighted) return 'white';
        if (actionType === 'compare' || actionType === 'search' || actionType === 'binary_search') return '#f59e0b'; // Yellow
        if (actionType === 'swap' || actionType === 'delete' || actionType === 'mismatch') return '#ef4444'; // Red
        if (actionType === 'found' || actionType === 'insert' || actionType === 'match' || actionType === 'sorted') return '#10b981'; // Green
        if (actionType === 'overwrite' || actionType === 'update') return '#8b5cf6'; // Purple
        return '#3b82f6'; // Blue default (moving, pointers, visited, etc.)
    };

    if (type === AlgorithmType.BASIC) {
        // Complexity Graph
        const margin = {top: 20, right: 80, bottom: 30, left: 50};
        const graphW = width - margin.left - margin.right;
        const graphH = height - margin.top - margin.bottom;
        
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Scales
        const x = d3.scaleLinear().domain([0, 50]).range([0, graphW]);
        const y = d3.scaleLinear().domain([0, 100]).range([graphH, 0]);

        // Axes
        g.append("g").attr("transform", `translate(0,${graphH})`).call(d3.axisBottom(x)).attr("color", "black");
        g.append("g").call(d3.axisLeft(y)).attr("color", "black");

        // Grid lines
        g.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-graphW).tickFormat(() => "")).attr("stroke-opacity", 0.1);

        const funcs = [
            (n: number) => 5, // O(1)
            (n: number) => Math.log2(n || 1) * 5, // O(log n)
            (n: number) => n, // O(n)
            (n: number) => n * Math.log2(n || 1) * 0.5, // O(n log n)
            (n: number) => (n * n) * 0.05 // O(n^2)
        ];
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
        const labels = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'];

        // Draw Lines
        const maxLine = currentStep.graphLineIndex ?? 0;
        const maxN = currentStep.graphMaxN ?? 50;

        for (let i = 0; i <= maxLine && i < funcs.length; i++) {
            const lineData = d3.range(0, (i === maxLine ? maxN : 50) + 1).map(n => ({ n, val: Math.min(100, funcs[i](n)) }));
            const line = d3.line<{n:number, val:number}>().x(d => x(d.n)).y(d => y(d.val));
            
            g.append("path").datum(lineData).attr("fill", "none").attr("stroke", colors[i]).attr("stroke-width", 3).attr("d", line);
            
            // Label
            if ((i < maxLine) || (i === maxLine && maxN > 45)) {
                g.append("text").attr("x", x(50)+5).attr("y", y(funcs[i](50))).text(labels[i]).attr("fill", colors[i]).attr("font-weight", "bold").attr("alignment-baseline", "middle");
            }
        }

    } else if (type === AlgorithmType.STRING) {
        const arr = (currentData as string[]);
        const boxSize = 60;
        const startX = (width - (arr.length * 70)) / 2;
        const startY = height / 2 - 30;

        svg.selectAll("rect").data(arr).join("rect")
            .attr("x", (d, i) => startX + i * 70)
            .attr("y", startY)
            .attr("width", boxSize).attr("height", boxSize).attr("rx", 8)
            .attr("fill", (d, i) => getRectFill(indices.includes(i), action))
            .attr("stroke", "#333").attr("stroke-width", 2);

        svg.selectAll("text.char").data(arr).join("text")
            .attr("x", (d, i) => startX + i * 70 + 30).attr("y", startY + 40).attr("text-anchor", "middle")
            .text(d => d).attr("font-size", "24px").attr("font-weight", "bold").attr("fill", (d, i) => getTextFill(indices.includes(i)));
        
        // Pointers (L/R)
        if (indices.length === 2 && (action === 'pointers' || action === 'compare')) {
            svg.append("text").attr("x", startX + indices[0]*70 + 30).attr("y", startY + 90).text("L").attr("text-anchor", "middle").attr("fill", "blue").attr("font-weight", "bold").attr("font-size", "20px");
            svg.append("text").attr("x", startX + indices[1]*70 + 30).attr("y", startY + 90).text("R").attr("text-anchor", "middle").attr("fill", "red").attr("font-weight", "bold").attr("font-size", "20px");
        }

    } else if (type === AlgorithmType.LINKED_LIST) {
        const arr = (currentData as number[]);
        const nodeWidth = 70;
        const gap = 50;
        const startX = 50;
        const startY = height / 2;

        // Arrows
        svg.append("defs").append("marker").attr("id", "arrow").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#666");

        for (let i=0; i<arr.length-1; i++) {
            svg.append("line")
                .attr("x1", startX + i*(nodeWidth+gap) + nodeWidth)
                .attr("y1", startY)
                .attr("x2", startX + (i+1)*(nodeWidth+gap))
                .attr("y2", startY)
                .attr("stroke", "#666").attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
        }

        const g = svg.selectAll("g").data(arr).join("g").attr("transform", (d, i) => `translate(${startX + i*(nodeWidth+gap)}, ${startY - 25})`);
        g.append("rect").attr("width", nodeWidth).attr("height", 50).attr("rx", 5).attr("fill", (d, i) => getRectFill(indices.includes(i), 'found')).attr("stroke", "#333").attr("stroke-width", 2);
        g.append("text").attr("x", nodeWidth/2).attr("y", 32).attr("text-anchor", "middle").text(d => d).attr("fill", (d, i) => getTextFill(indices.includes(i))).attr("font-weight", "bold").attr("font-size", "18px");
        g.append("text").attr("x", nodeWidth/2).attr("y", -10).text((d, i) => i === 0 ? "HEAD" : "").attr("text-anchor", "middle").attr("fill", "red").attr("font-size", "12px").attr("font-weight", "bold");

    } else if (type === AlgorithmType.STACK) {
        const arr = (currentData as number[]);
        const boxW = 120;
        const boxH = 50;
        const startX = width / 2 - boxW / 2;
        const bottomY = height - 100;

        // Container
        svg.append("path").attr("d", `M${startX},100 V${bottomY} H${startX+boxW} V100`).attr("fill", "none").attr("stroke", "#333").attr("stroke-width", 4);

        svg.selectAll("g").data(arr).join("g").attr("transform", (d, i) => `translate(${startX + 10}, ${bottomY - (i+1)*boxH - 5})`)
           .append("rect").attr("width", boxW - 20).attr("height", boxH - 5).attr("rx", 4)
           .attr("fill", (d, i) => indices.includes(i) ? '#3b82f6' : '#fbbf24').attr("stroke", "black").attr("stroke-width", 1);
        
        svg.selectAll("g").append("text").text(d => d).attr("x", boxW/2 - 10).attr("y", boxH/2 - 2).attr("dy", 5).attr("text-anchor", "middle").attr("fill", "black").attr("font-weight", "bold");

    } else if (type === AlgorithmType.GRAPH) {
        const { nodes, links } = currentData;
        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links).id((d: any) => d.index).distance(150))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2));
        
        for (let i = 0; i < 300; ++i) simulation.tick();

        svg.append("g").selectAll("line").data(links).join("line")
           .attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
           .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y)
           .attr("stroke", "#999").attr("stroke-width", 2);

        const nodeGroups = svg.append("g").selectAll("g").data(nodes).join("g").attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        
        nodeGroups.append("circle").attr("r", 25).attr("fill", (d: any) => indices.includes(d.index) ? '#f59e0b' : 'white').attr("stroke", "#333").attr("stroke-width", 2);
        nodeGroups.append("text").text((d: any) => d.index).attr("dy", 6).attr("text-anchor", "middle").attr("font-weight", "bold").attr("font-size", "16px").attr("fill", "black");

    } else {
        // DEFAULT ARRAY / DP / SORTING
        const arr = (currentData as number[]);
        const boxSize = 60;
        const startX = (width - (arr.length * 70)) / 2;
        const startY = height / 2 - 30;

        // Window Highlight (Sliding Window)
        if (action === 'window' && indices.length > 0) {
            const minIdx = Math.min(...indices);
            const count = indices.length;
            svg.append("rect")
                .attr("x", startX + minIdx * 70 - 5)
                .attr("y", startY - 10)
                .attr("width", count * 70 + 10)
                .attr("height", boxSize + 20)
                .attr("fill", "none").attr("stroke", "#f59e0b").attr("stroke-width", 3).attr("stroke-dasharray", "5,5").attr("rx", 10);
        }

        const nodes = svg.selectAll("g").data(arr).join("g").attr("transform", (d, i) => `translate(${startX + i * 70}, ${startY})`);
        
        nodes.append("rect")
            .attr("width", boxSize).attr("height", boxSize).attr("rx", 8)
            .attr("fill", (d, i) => getRectFill(indices.includes(i), action))
            .attr("stroke", "#333").attr("stroke-width", 2);

        nodes.append("text")
            .attr("x", boxSize/2).attr("y", boxSize/2 + 8).attr("text-anchor", "middle")
            .text(d => d).attr("font-weight", "bold").attr("font-size", "20px")
            .attr("fill", (d, i) => getTextFill(indices.includes(i)));
        
        // Index labels
        nodes.append("text")
            .attr("x", boxSize/2).attr("y", boxSize + 25).attr("text-anchor", "middle")
            .text((d, i) => `[${i}]`).attr("fill", "#666").attr("font-size", "12px").attr("font-family", "monospace");

        // Pointers
        if (type === AlgorithmType.ARRAY) {
             if ((action === 'pointers' || action === 'move_left' || action === 'move_right') && indices.length > 0) {
                // Two pointers often uses L and R
                if (indices.length === 2) {
                    svg.append("text").attr("x", startX + indices[0]*70 + 30).attr("y", startY + 90).text("L").attr("text-anchor", "middle").attr("fill", "blue").attr("font-weight", "bold");
                    svg.append("text").attr("x", startX + indices[1]*70 + 30).attr("y", startY + 90).text("R").attr("text-anchor", "middle").attr("fill", "red").attr("font-weight", "bold");
                } else {
                    indices.forEach(idx => {
                        svg.append("text").attr("x", startX + idx*70 + 30).attr("y", startY + 90).text("^").attr("text-anchor", "middle").attr("fill", "blue").attr("font-weight", "bold").attr("font-size", "24px");
                    });
                }
             }
             // Binary Search Pointers (Low, Mid, High)
             if (action === 'binary_search' && indices.length >= 3) {
                 const [low, mid, high] = indices;
                 svg.append("text").attr("x", startX + low*70 + 30).attr("y", startY + 90).text("L").attr("text-anchor", "middle").attr("fill", "blue").attr("font-weight", "bold").attr("font-size", "20px");
                 svg.append("text").attr("x", startX + mid*70 + 30).attr("y", startY + 90).text("M").attr("text-anchor", "middle").attr("fill", "#f59e0b").attr("font-weight", "bold").attr("font-size", "20px");
                 svg.append("text").attr("x", startX + high*70 + 30).attr("y", startY + 90).text("H").attr("text-anchor", "middle").attr("fill", "red").attr("font-weight", "bold").attr("font-size", "20px");
                 
                 // Range Indicator Line
                 svg.append("line")
                    .attr("x1", startX + low*70 + 30).attr("y1", startY + 75)
                    .attr("x2", startX + high*70 + 30).attr("y2", startY + 75)
                    .attr("stroke", "#666").attr("stroke-width", 2).attr("stroke-dasharray", "4,4");
             }
        }
    }
  }, [history, step, type]);

  const currentDescription = history[step]?.description || "Visualizer Ready";

  // Legend Generator
  const getLegendItems = () => {
      const items = [];
      switch (type) {
          case AlgorithmType.SORTING:
              items.push({ color: 'bg-yellow-500', label: 'Comparing' });
              items.push({ color: 'bg-red-500', label: 'Swapping' });
              items.push({ color: 'bg-purple-500', label: 'Overwriting' });
              items.push({ color: 'bg-green-500', label: 'Sorted' });
              break;
          case AlgorithmType.ARRAY:
              items.push({ color: 'bg-blue-500', label: 'Moving/Active' });
              items.push({ color: 'bg-green-500', label: 'Inserted/Found' });
              items.push({ color: 'bg-red-500', label: 'Deleted' });
              items.push({ color: 'bg-yellow-500', label: 'Searching/Comparing' });
              items.push({ color: 'bg-purple-500', label: 'Updating' });
              break;
          case AlgorithmType.GRAPH:
              items.push({ color: 'bg-yellow-500', label: 'Visiting Node' });
              items.push({ color: 'bg-white border border-gray-400', label: 'Unvisited' });
              items.push({ color: 'bg-gray-400', label: 'Edges' });
              break;
          case AlgorithmType.LINKED_LIST:
              items.push({ color: 'bg-green-500', label: 'Current Node' });
              items.push({ color: 'bg-red-500', label: 'Head Pointer' });
              break;
          case AlgorithmType.STRING:
              items.push({ color: 'bg-yellow-500', label: 'Comparing' });
              items.push({ color: 'bg-red-500', label: 'Mismatch' });
              items.push({ color: 'bg-green-500', label: 'Match/Found' });
              items.push({ color: 'bg-blue-500', label: 'Active Pointer' });
              break;
          case AlgorithmType.STACK:
              items.push({ color: 'bg-blue-500', label: 'Pushed (Top)' });
              items.push({ color: 'bg-yellow-500', label: 'Existing' });
              break;
          case AlgorithmType.DP:
              items.push({ color: 'bg-purple-500', label: 'Computed State' });
              items.push({ color: 'bg-yellow-500', label: 'Dependencies' });
              break;
          default:
              items.push({ color: 'bg-blue-500', label: 'Active' });
              items.push({ color: 'bg-green-500', label: 'Completed' });
      }
      return items;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[800px] bg-white text-black font-sans shadow-2xl rounded-xl overflow-hidden border border-gray-300">
      {/* Sidebar (Controls) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col border-r border-gray-300 bg-gray-50 z-20">
         <div className="p-6 border-b border-gray-300">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-black text-lg"><Database size={20}/> Data Input</h3>
            <button onClick={resetData} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow transition flex items-center justify-center gap-2"><RefreshCw size={18}/> Randomize Data</button>
            
            <div className="mt-6">
                <label className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1"><Grid size={12}/> Custom Array</label>
                <div className="relative">
                    <textarea 
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); applyCustomInput(); }}}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm h-24 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                        placeholder="10, 20, 30, 40..."
                    />
                </div>
                <button onClick={applyCustomInput} className="w-full mt-2 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition">Apply Values</button>
            </div>
         </div>
         
         <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-black text-lg"><Settings2 size={20}/> Controls</h3>
            
            <div className="flex gap-2 justify-center mb-8">
                <button onClick={() => { setIsPlaying(false); setStep(Math.max(0, step-1)); }} className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-black shadow-sm transition"><SkipBack size={20}/></button>
                <button onClick={() => setIsPlaying(!isPlaying)} className={`px-8 py-3 rounded-lg shadow-lg font-bold text-white transition flex items-center gap-2 ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                    {isPlaying ? <><Pause size={20}/> Pause</> : <><Play size={20}/> Play</>}
                </button>
                <button onClick={() => { setIsPlaying(false); setStep(Math.min(history.length-1, step+1)); }} className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-black shadow-sm transition"><SkipForward size={20}/></button>
            </div>
            
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700 uppercase">Speed</span>
                    <span className="text-xs font-mono text-gray-500">{1010-speed}ms</span>
                </div>
                <input type="range" min="10" max="1000" value={1010-speed} onChange={e => setSpeed(1010-parseInt(e.target.value))} className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
            </div>

            {type === AlgorithmType.ARRAY && (
                <div className="space-y-5 border-t border-gray-300 pt-6">
                    <div>
                         <label className="text-xs font-bold block mb-2 text-gray-700 uppercase">Operation Type</label>
                        <select value={arrayOp} onChange={(e) => setArrayOp(e.target.value as any)} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black outline-none focus:border-blue-500 font-medium">
                            <option>Insert</option><option>Delete</option><option>Search</option><option>Update</option><option>Prefix Sum</option><option>Sliding Window</option><option>Two Pointers</option><option>Binary Search</option>
                        </select>
                    </div>
                    {(arrayOp === 'Insert' || arrayOp === 'Search' || arrayOp === 'Update' || arrayOp === 'Binary Search') && (
                        <div>
                            <label className="text-xs font-bold block mb-2 text-gray-700 uppercase">Value</label>
                            <input type="number" value={opValue} onChange={(e) => setOpValue(parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black outline-none font-mono"/>
                        </div>
                    )}
                    {(arrayOp === 'Insert' || arrayOp === 'Delete' || arrayOp === 'Update') && (
                        <div>
                            <label className="text-xs font-bold block mb-2 text-gray-700 uppercase">Index</label>
                            <input type="number" value={opIndex} onChange={(e) => setOpIndex(parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black outline-none font-mono"/>
                        </div>
                    )}
                     {(arrayOp === 'Sliding Window') && (
                        <div>
                            <label className="text-xs font-bold block mb-2 text-gray-700 uppercase">Window Size (K)</label>
                            <input type="number" value={windowSize} onChange={(e) => setWindowSize(parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black outline-none font-mono"/>
                        </div>
                    )}
                    <button onClick={generateArrayHistory} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow mt-2">Run Operation</button>
                </div>
            )}
         </div>
      </div>

      {/* Main Visualizer Canvas Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
           {/* Dynamic Description Overlay */}
           <div className="absolute top-6 left-6 z-10 max-w-lg bg-white/95 px-5 py-4 rounded-xl shadow-xl border border-gray-200 backdrop-blur-sm animate-fade-in">
               <div className="flex items-start gap-3">
                   <div className="mt-1 p-1 bg-blue-100 rounded-full text-blue-600"><Info size={16}/></div>
                   <div>
                       <span className="font-bold text-base text-gray-900 leading-snug block">{currentDescription || "Visualizer Ready"}</span>
                       {history[step]?.auxiliary && (
                           <div className="mt-3 pt-2 border-t border-gray-100 flex gap-4">
                               {Object.entries(history[step].auxiliary!).map(([k, v]) => (
                                   <div key={k} className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                       <span className="text-gray-500 uppercase font-bold mr-2">{k}:</span> 
                                       <span className="font-mono font-bold text-blue-700 text-sm">{v}</span>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
               </div>
           </div>

           {/* SVG Canvas with Grid Background */}
           <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] relative">
               <svg ref={svgRef} width="100%" height="100%" className="overflow-visible font-sans drop-shadow-sm"></svg>
           </div>

           {/* Bottom Info Panel */}
           <div className="border-t border-gray-200 bg-gray-50 p-4 shrink-0">
                {/* Stats & Progress */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-mono text-gray-600">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><List size={14}/> Length: <strong className="text-black">{Array.isArray(data) ? data.length : (data.nodes?.length || 0)}</strong></span>
                        {type === AlgorithmType.ARRAY && <span className="flex items-center gap-2"><Layers size={14}/> Max Index: <strong className="text-black">{(Array.isArray(data) ? data.length : 1) - 1}</strong></span>}
                        <span className="flex items-center gap-2"><Database size={14}/> Memory: <strong className="text-black">{(Array.isArray(data) ? data.length * 4 : 0)} bytes</strong></span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 relative">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / history.length) * 100}%` }}></div>
                    <div className="absolute top-4 right-0 text-xs font-bold text-blue-600">Step: {step + 1} / {history.length}</div>
                </div>

                {/* Dynamic Legend */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
                     {getLegendItems().map((item, idx) => (
                         <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                             <div className={`w-3 h-3 rounded-sm shadow-sm ${item.color}`}></div>
                             <span>{item.label}</span>
                         </div>
                     ))}
                </div>
           </div>
      </div>
    </div>
  );
};

export default Visualizer;
