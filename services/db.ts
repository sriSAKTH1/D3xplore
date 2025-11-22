
import { db, isFirebaseEnabled } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query as firestoreQuery, 
  where 
} from 'firebase/firestore';

// LocalStorage Helpers
const getLocalCollection = (collectionName: string): any[] => {
  const data = localStorage.getItem(`d3_db_${collectionName}`);
  return data ? JSON.parse(data) : [];
};

const saveLocalCollection = (collectionName: string, data: any[]) => {
  localStorage.setItem(`d3_db_${collectionName}`, JSON.stringify(data));
};

// Universal Database Service
export const dbService = {
  
  put: async (collectionName: string, data: any) => {
    if (!data.id) throw new Error("Data must have an ID for put operation");
    
    if (isFirebaseEnabled && db) {
      const ref = doc(db, collectionName, data.id);
      await setDoc(ref, data, { merge: true });
    } else {
      // LocalStorage Fallback
      const items = getLocalCollection(collectionName);
      const index = items.findIndex(i => i.id === data.id);
      if (index >= 0) {
        items[index] = { ...items[index], ...data };
      } else {
        items.push(data);
      }
      saveLocalCollection(collectionName, items);
    }
  },

  add: async (collectionName: string, data: any) => {
    if (data.id) {
      await dbService.put(collectionName, data);
    } else {
      if (isFirebaseEnabled && db) {
        const ref = collection(db, collectionName);
        const res = await addDoc(ref, data);
        await updateDoc(res, { id: res.id });
      } else {
        // LocalStorage Fallback
        const newItem = { ...data, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
        const items = getLocalCollection(collectionName);
        items.push(newItem);
        saveLocalCollection(collectionName, items);
      }
    }
  },

  get: async (collectionName: string, id: string) => {
    if (isFirebaseEnabled && db) {
      const ref = doc(db, collectionName, id);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } else {
      // LocalStorage Fallback
      const items = getLocalCollection(collectionName);
      return items.find(i => i.id === id) || null;
    }
  },

  getAll: async (collectionName: string) => {
    if (isFirebaseEnabled && db) {
      const ref = collection(db, collectionName);
      const snap = await getDocs(ref);
      return snap.docs.map(doc => doc.data());
    } else {
      // LocalStorage Fallback
      return getLocalCollection(collectionName);
    }
  },

  query: async (collectionName: string, field: string, value: any) => {
    if (isFirebaseEnabled && db) {
      const ref = collection(db, collectionName);
      const q = firestoreQuery(ref, where(field, "==", value));
      const snap = await getDocs(q);
      return snap.docs.map(doc => doc.data());
    } else {
      // LocalStorage Fallback
      const items = getLocalCollection(collectionName);
      return items.filter(i => i[field] === value);
    }
  },

  delete: async (collectionName: string, id: string) => {
    if (isFirebaseEnabled && db) {
      const ref = doc(db, collectionName, id);
      await deleteDoc(ref);
    } else {
      // LocalStorage Fallback
      const items = getLocalCollection(collectionName);
      const filtered = items.filter(i => i.id !== id);
      saveLocalCollection(collectionName, filtered);
    }
  }
};
