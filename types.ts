
export enum ViewState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  VISUALIZER = 'VISUALIZER',
  EDITOR = 'EDITOR',
  TRAINER = 'TRAINER',
  LIVE_SESSION = 'LIVE_SESSION',
  NOTES = 'NOTES',
  SETTINGS = 'SETTINGS'
}

export enum AlgorithmType {
  SORTING = 'SORTING',
  BST = 'BST',
  PATHFINDING = 'PATHFINDING',
  BASIC = 'BASIC',
  ARRAY = 'ARRAY',
  STRING = 'STRING',
  LINKED_LIST = 'LINKED_LIST',
  STACK = 'STACK',
  QUEUE = 'QUEUE',
  RECURSION = 'RECURSION',
  TREE = 'TREE',
  HEAP = 'HEAP',
  GRAPH = 'GRAPH',
  DP = 'DP',
  TRIE = 'TRIE',
  ADVANCED = 'ADVANCED',
  BACKTRACKING = 'BACKTRACKING',
  PATTERNS = 'PATTERNS'
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface VisualizationModule {
  id: string;
  title: string;
  description: string;
  baseType: AlgorithmType;
  icon: 'cpu' | 'tree' | 'graph' | 'code' | 'database' | 'layers' | 'list' | 'git-merge' | 'box' | 'network';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  visualizationType: 'Interactive' | 'Static';
  createdBy: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isThinking?: boolean;
  timestamp: number;
  groundingUrls?: string[];
}

export interface CodeSnippet {
  language: 'python' | 'java' | 'cpp';
  code: string;
}

export interface AlgorithmData {
  id: string;
  name: string;
  type: AlgorithmType;
  complexity: {
    time: string;
    space: string;
  };
  description: string;
  defaultCode: CodeSnippet[];
}

// Live API Types
export interface AudioChunk {
  data: string; // base64
  mimeType: string;
}

// Auth Types
export type UserRole = 'student' | 'trainer' | 'admin';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'ta'; // English | Tamil
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  textSize: 'small' | 'medium' | 'large';
}

export interface LoginHistory {
  id: string;
  device: string;
  ip: string;
  timestamp: number;
}

export interface UserStats {
  progress: number;
  problemsSolved: number;
  streak: number;
}

export interface User {
  id: string;
  name: string;
  email: string; // used as ID for login
  mobile?: string;
  avatarUrl?: string;
  role: UserRole;
  token?: string;
  preferences?: UserPreferences;
  loginHistory?: LoginHistory[];
  stats?: UserStats;
  createdAt?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}
