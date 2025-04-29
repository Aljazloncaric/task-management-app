import { collection, addDoc, query, where, getDoc, getDocs, serverTimestamp, updateDoc, doc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/firebase'; // adjust path if needed
import { formatDate } from './methods.js';

// CHECK WHETHER A PROJECT WITH THIS NAME ALREADY EXISTS

export async function checkIfProjectExists(projectName) {
  const userId = auth.currentUser?.uid;
  if (!userId) return false;
  const q = query(collection(db, 'projects'), where('name', '==', projectName), where('ownerId', '==', userId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// CREATE A PROJECT

export async function createProject(name) {
  const dateObj = new Date();
  return await addDoc(collection(db, 'projects'), {
    name,
    date: formatDate(dateObj),
    time: dateObj.toLocaleTimeString(),
    ownerId: auth.currentUser?.uid ?? null,
    memberIDs: [],
    createdAt: serverTimestamp(),
  });
}

// UPDATE A NAME OF A SPECIFIC PROJECT

export async function updateProjectName(projectId, newName) {
  await updateDoc(doc(db, 'projects', projectId), {
    name: newName,
  });
}


// GET ALL PROJECTS ASSOCIATED TO AN USER THROUGH MEMBERSHIP OR OWNERSHIP

export async function getProjects() {
  const user = auth.currentUser;
  if (!user) return [];

  try {
      // Query projects where user is the owner
      const ownerQuery = query(
          collection(db, 'projects'),
          where('ownerId', '==', user.uid)
      );

      // Query projects where user is a member (using the flat memberIDs array)
      const memberQuery = query(
          collection(db, 'projects'),
          where('memberIDs', 'array-contains', user.uid)
      );

      // Execute both queries in parallel
      const [ownerSnapshot, memberSnapshot] = await Promise.all([
          getDocs(ownerQuery),
          getDocs(memberQuery)
      ]);

      // Combine results and remove duplicates using a Map
      const projectsMap = new Map();

      [...ownerSnapshot.docs, ...memberSnapshot.docs].forEach(doc => {
          if (!projectsMap.has(doc.id)) {
              projectsMap.set(doc.id, {
                  id: doc.id,
                  ...doc.data()
              });
          }
      });

      return Array.from(projectsMap.values());
  } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
  }
}

// GET PROJECT BY ID - USED IN NavbarComponent.vue

export const getProjectByID = async (projectId) => {
  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Return the entire document data along with the ID
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log("No such project found!");
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch project:", err);
    throw err; // Re-throw the error to let the caller handle it
  }
}

// DELETE A PROJECT BY ID - USED IN DeleteProject.vue

export async function deleteProject(projectId) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
    console.log(`Project ${projectId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// ADD NEW ID TO memberIDs

export const addNewMember = async (projectId, UID) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    
    await updateDoc(projectRef, {
      memberIDs: arrayUnion(UID) // Uses arrayUnion to safely add the UID
    });

    console.log(`Successfully added user ${UID} to project ${projectId}`);
  } catch (error) {
    console.error('Error adding member:', error);
    throw error; // Re-throw for error handling in calling code
  }
};


// DETERMINE USER ROLE AND PROJECT TYPE SHOWN ON PROJECT CARD

export const determineUserRole = (ownerID, memberIDs) =>{

    let userUID = auth.currentUser.uid
    let userRole = null

    if(ownerID === userUID && memberIDs.length === 0){
      userRole = null        
    } else if(ownerID === userUID && memberIDs.length > 0){
      userRole = "Admin"
    } else if(ownerID !== userUID && memberIDs.includes(userUID)) {
      userRole = "Guest"
    }

    return userRole

}
export const determineProjectType = (ownerID, memberIDs) =>{
    
  let userUID = auth.currentUser.uid
  let projectType = null

  if(ownerID === userUID && memberIDs.length === 0){
    projectType = "Solo"        
  } else if(ownerID === userUID && memberIDs.length > 0){
    projectType = "Group"
  } else if(ownerID !== userUID && memberIDs.includes(userUID)) {
    projectType = "Group"
  }

  return projectType
}
  

