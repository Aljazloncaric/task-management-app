import { collection, where, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

// Get User Emails Based on their IDs.

export const getUsersByIds = async (userIds) => {
  try {
    
    // Create a query to find users where UID is in the provided array
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('UID', 'in', userIds));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data() // Include all document fields (email, etc.)
    }));
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw for error handling in calling code
  }
};

// Get Owner Email based on their ID

export const getOwnerById = async (ownerId) => {
    try {
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('UID', '==', ownerId));
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data() // Include all document fields (email, etc.)
      }));
      
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Re-throw for error handling in calling code
    }
  };

  // Real time user search

  export const searchUsersByEmail = async (searchQuery) => {
    try {
      if (!searchQuery || searchQuery.length < 2) return []; // Don't search on short queries
      
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('email', '>=', searchQuery.toLowerCase()),
        where('email', '<=', searchQuery.toLowerCase() + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        UID: doc.id,
        ...doc.data()
      }));
      
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  };