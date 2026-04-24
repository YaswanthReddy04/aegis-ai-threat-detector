import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Query,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseService';
import { ScanHistoryItem } from '../types';

// Add a new threat analysis record
export const saveThreatAnalysis = async (
  userId: string,
  analysis: Omit<ScanHistoryItem, 'id' | 'timestamp'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'users', userId, 'analyses'), {
    ...analysis,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
};

// Get all threat analyses for a user
export const getThreatAnalyses = async (userId: string): Promise<ScanHistoryItem[]> => {
  const q = query(
    collection(db, 'users', userId, 'analyses'),
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate?.() || new Date(),
  })) as ScanHistoryItem[];
};

// Get a specific threat analysis
export const getThreatAnalysis = async (
  userId: string,
  analysisId: string
): Promise<ScanHistoryItem | null> => {
  const docRef = doc(db, 'users', userId, 'analyses', analysisId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp?.toDate?.() || new Date(),
    } as ScanHistoryItem;
  }
  return null;
};

// Update threat analysis
export const updateThreatAnalysis = async (
  userId: string,
  analysisId: string,
  updates: Partial<ScanHistoryItem>
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'analyses', analysisId);
  await updateDoc(docRef, updates);
};

// Delete threat analysis
export const deleteThreatAnalysis = async (
  userId: string,
  analysisId: string
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'analyses', analysisId);
  await deleteDoc(docRef);
};

// Save user profile
export const saveUserProfile = async (userId: string, profile: Record<string, any>): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, profile);
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<Record<string, any> | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};
