
import { User, UserRole, LoginHistory } from '../types';
import { auth, isFirebaseEnabled } from './firebase';
import { dbService } from './db';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';

const USERS_COLLECTION = 'users';
const MOCK_SESSION_KEY = 'd3_mock_session';

const mapUser = async (uid: string): Promise<User | null> => {
  const userDoc = await dbService.get(USERS_COLLECTION, uid);
  return userDoc as User | null;
};

export const authService = {
  init: (onUserChange: (user: User | null) => void) => {
    if (isFirebaseEnabled && auth) {
      onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const user = await mapUser(fbUser.uid);
          if (user) {
            onUserChange({ ...user, token: await fbUser.getIdToken() });
          } else {
            // Edge case: Auth exists but DB doc missing
            onUserChange(null);
          }
        } else {
          onUserChange(null);
        }
      });
    } else {
      // Mock Init
      const storedId = localStorage.getItem(MOCK_SESSION_KEY);
      if (storedId) {
        // Simulate async check
        setTimeout(async () => {
          const user = await dbService.get(USERS_COLLECTION, storedId);
          onUserChange(user as User);
        }, 500);
      } else {
        onUserChange(null);
      }
    }
  },

  login: async (email, password): Promise<User> => {
    if (isFirebaseEnabled && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = await mapUser(cred.user.uid);
      if (!user) throw new Error("User profile not found.");
      
      // Update History
      await authService.recordLoginHistory(user);
      return user;
    } else {
      // Mock Login
      // Admin backdoor for demo
      if (email === 'dsaid' && password === 'dsapass') {
        const adminUser = await authService.signup('Admin', 'dsaid', 'dsapass', 'admin');
        localStorage.setItem(MOCK_SESSION_KEY, adminUser.id);
        return adminUser;
      }

      // Check local DB
      const users = await dbService.query(USERS_COLLECTION, 'email', email);
      const user = users[0] as User;
      
      if (!user) throw new Error("User not found.");
      // Simple password check (In real app this is handled by Firebase Auth)
      // For mock mode, we assume password is valid if user exists for simplicity, 
      // or we could store it. But let's assume correct for demo if email matches.
      
      localStorage.setItem(MOCK_SESSION_KEY, user.id);
      await authService.recordLoginHistory(user);
      
      // Dispatch event for App listener
      window.dispatchEvent(new Event('storage'));
      
      return user;
    }
  },

  signup: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    let uid: string;
    let token: string = 'mock-token';

    if (isFirebaseEnabled && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      uid = cred.user.uid;
      token = await cred.user.getIdToken();
    } else {
      // Mock Signup
      // Check existing
      const existing = await dbService.query(USERS_COLLECTION, 'email', email);
      if (existing.length > 0) throw new Error("Email already exists (Demo Mode)");
      
      uid = 'user-' + Date.now();
      token = 'mock-token-' + uid;
      localStorage.setItem(MOCK_SESSION_KEY, uid);
      
      // Dispatch event
      window.dispatchEvent(new Event('storage'));
    }

    const newUser: User = {
      id: uid,
      name,
      email,
      role,
      createdAt: Date.now(),
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: { email: true, push: true, sound: true },
        textSize: 'medium'
      },
      stats: {
        progress: 0,
        problemsSolved: 0,
        streak: 1
      },
      loginHistory: [],
      token
    };

    await dbService.put(USERS_COLLECTION, newUser);
    return newUser;
  },

  logout: async () => {
    if (isFirebaseEnabled && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
      window.dispatchEvent(new Event('storage')); // Notify App
      window.location.reload(); // Force reload to clear state cleanly in demo mode
    }
  },

  recordLoginHistory: async (user: User) => {
    const historyEntry: LoginHistory = {
        id: Date.now().toString(),
        device: navigator.userAgent,
        ip: '127.0.0.1',
        timestamp: Date.now()
    };
    const updatedHistory = [historyEntry, ...(user.loginHistory || [])].slice(0, 5);
    await dbService.put(USERS_COLLECTION, { ...user, loginHistory: updatedHistory });
  },

  getCurrentUser: (): User | null => { return null; }, // Use async init instead

  updateUser: async (updatedUser: User): Promise<User> => {
    await dbService.put(USERS_COLLECTION, updatedUser);
    return updatedUser;
  },

  getAllUsers: async (): Promise<User[]> => {
    return (await dbService.getAll(USERS_COLLECTION)) as User[];
  },

  deleteUser: async (userId: string) => {
    await dbService.delete(USERS_COLLECTION, userId);
  },

  downloadDB: async () => {
    const data = await dbService.getAll(USERS_COLLECTION);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'd3xplore_users_db.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
